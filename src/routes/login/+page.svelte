<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Card, CardContent, CardFooter } from '$lib/components/ui/card';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Car, AlertCircle } from 'lucide-svelte';

	let phoneNumber = '';
	let password = '';
	let isLoading = false;
	let error: string | null = null;
	let rememberMe = false;

	async function handleLogin() {
		try {
			error = null;
			isLoading = true;

			// Validate phone number format (UK)
			const phoneRegex = /^(\+44|0)[7][0-9]{9}$/;
			if (!phoneRegex.test(phoneNumber)) {
				throw new Error('Please enter a valid UK mobile number');
			}

			// Store auth state if remember me is checked
			if (rememberMe) {
				localStorage.setItem('phoneNumber', phoneNumber);
			}

			// Redirect to home page
			goto('/');
		} catch (err) {
			console.error('Login error:', err);
			error = err instanceof Error ? err.message : 'Failed to login. Please try again.';
		} finally {
			isLoading = false;
		}
	}

	// Check for stored credentials on mount
	import { onMount } from 'svelte';

	onMount(() => {
		const storedPhone = localStorage.getItem('phoneNumber');
		if (storedPhone) {
			phoneNumber = storedPhone;
			rememberMe = true;
		}
	});
</script>

<div class="h-full bg-background">
	<div class="container flex h-full flex-col items-center justify-center p-4">
		<!-- Logo and Title -->
		<div class="mb-8 flex flex-col items-center">
			<div class="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
				<Car class="h-10 w-10 text-primary" />
			</div>
			<h1 class="text-2xl font-bold">QuickFleet Driver</h1>
			<p class="text-muted-foreground">Sign in to start accepting jobs</p>
		</div>

		<!-- Login Form -->
		<div class="w-full max-w-sm">
			<Card>
				<CardContent class="pt-6">
					<form on:submit|preventDefault={handleLogin} class="space-y-4">
						{#if error}
							<Alert variant="destructive">
								<AlertCircle class="h-4 w-4" />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						{/if}

						<div class="space-y-2">
							<Input
								type="tel"
								placeholder="Phone Number"
								bind:value={phoneNumber}
								disabled={isLoading}
							/>
							<p class="text-xs text-muted-foreground">Format: 07XXXXXXXXX or +447XXXXXXXXX</p>
						</div>

						<div class="space-y-2">
							<Input
								type="password"
								placeholder="Password"
								bind:value={password}
								disabled={isLoading}
							/>
						</div>

						<div class="flex items-center space-x-2">
							<input
								type="checkbox"
								id="remember"
								bind:checked={rememberMe}
								class="h-4 w-4 rounded border-gray-300"
							/>
							<label for="remember" class="text-sm text-muted-foreground">
								Remember my phone number
							</label>
						</div>

						<Button type="submit" class="w-full" disabled={isLoading}>
							{#if isLoading}
								<div
									class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"
								></div>
							{/if}
							{isLoading ? 'Signing in...' : 'Sign In'}
						</Button>
					</form>
				</CardContent>
				<CardFooter class="flex-col space-y-2">
					<p class="text-xs text-muted-foreground">
						Need help? Contact your operator for assistance
					</p>
				</CardFooter>
			</Card>
		</div>
	</div>
</div>
