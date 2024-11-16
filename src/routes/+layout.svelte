<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { Sheet, SheetContent, SheetTrigger } from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';
	import { Switch } from '$lib/components/ui/switch';
	import { Menu, Home, Clock, User, Settings, LogOut, BellRing } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import NotificationsPopover from '$lib/components/notifications/NotificationsPopover.svelte';
	let { children } = $props();

	let isMenuOpen = $state(false);
	let isOnline = $state(false);
	let notifications = $state([]);

	const menuItems = [
		{ icon: Home, label: 'Home', href: '/' },
		{ icon: Clock, label: 'Job History', href: '/history' },
		{ icon: User, label: 'Profile', href: '/profile' },
		{ icon: Settings, label: 'Settings', href: '/settings' }
	];

	// Handle online status toggle
	async function toggleOnlineStatus() {
		isOnline = !isOnline;
		// In real app: Update driver status in PocketBase
		try {
			// await pb.collection('drivers').update(driverId, { status: isOnline ? 'available' : 'offline' });
		} catch (error) {
			console.error('Error updating status:', error);
			isOnline = !isOnline; // Revert on error
		}
	}

	async function handleLogout() {
		try {
			// In real app: Clear PocketBase auth
			// await pb.authStore.clear();
			goto('/login');
		} catch (error) {
			console.error('Error logging out:', error);
		}
	}

	function handleNavigate(href: string) {
		isMenuOpen = false;
		goto(href);
	}

	let pageUrl = $derived($page.url.pathname);
</script>

<div class="flex h-full flex-col bg-background antialiased">
	<!-- Top Bar -->
	{#if $page.url.pathname !== '/login'}
		<header class="sticky top-0 z-50 border-b bg-background">
			<div class="flex h-16 items-center justify-between px-4">
				<div class="flex items-center space-x-4">
					<Sheet bind:open={isMenuOpen}>
						<SheetTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								class="shrink-0"
								onclick={() => (isMenuOpen = true)}
							>
								<Menu class="h-6 w-6" />
								<span class="sr-only">Open menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="left" class="w-[80%] max-w-[300px] p-0">
							<div class="flex h-full flex-col">
								<!-- User Profile Summary -->
								<div class="border-b p-4">
									<div class="mb-4 flex items-center space-x-4">
										<div
											class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
										>
											<User class="h-6 w-6" />
										</div>
										<div>
											<p class="font-medium">John Doe</p>
											<p class="text-sm text-muted-foreground">Driver</p>
										</div>
									</div>
									<div class="flex items-center space-x-2">
										<Switch checked={isOnline} onCheckedChange={toggleOnlineStatus} />
										<span class={isOnline ? 'text-green-600' : 'text-gray-500'}>
											{isOnline ? 'Online' : 'Offline'}
										</span>
									</div>
								</div>

								<!-- Navigation Menu -->
								<nav class="flex-1 space-y-1 p-2">
									{#each menuItems as item}
										{@const Icon = item.icon}
										<Button
											variant={$page.url.pathname === item.href ? 'secondary' : 'ghost'}
											class="w-full justify-start"
											on:click={() => handleNavigate(item.href)}
										>
											<Icon class="mr-2 h-4 w-4" />
											{item.label}
										</Button>
									{/each}
								</nav>

								<!-- Logout Button -->
								<div class="border-t p-2">
									<Button
										variant="ghost"
										class="w-full justify-start text-destructive hover:text-destructive"
										on:click={handleLogout}
									>
										<LogOut class="mr-2 h-4 w-4" />
										Sign Out
									</Button>
								</div>
							</div>
						</SheetContent>
					</Sheet>
					<div class="text-lg font-semibold">QuickFleet</div>
					<div class="flex items-center space-x-2">
						<Switch checked={isOnline} onCheckedChange={toggleOnlineStatus} />
						<span class={isOnline ? 'text-green-600' : 'text-gray-500'}>
							{isOnline ? 'Online' : 'Offline'}
						</span>
					</div>
				</div>
				<div class="flex items-center space-x-2">
					<NotificationsPopover />
				</div>
			</div>
		</header>
	{/if}
	<!-- Main Content -->
	<main class="flex-1">
		{@render children()}
	</main>
</div>
