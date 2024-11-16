<!-- src/routes/profile/+page.svelte -->
<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Switch } from '$lib/components/ui/switch';
	import { User, Car, Settings, LogOut } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	let driver = $state({
		name: 'John Doe',
		vehicle: 'Toyota Prius',
		phoneNumber: '+44 7700 900000',
		rating: 4.8,
		totalJobs: 156,
		earnings: {
			today: 120,
			week: 850,
			month: 3200
		}
	});

	let availabilitySchedule = $state({
		monday: true,
		tuesday: true,
		wednesday: true,
		thursday: true,
		friday: true,
		saturday: false,
		sunday: false
	});

	async function updateAvailability(day: keyof typeof availabilitySchedule) {
		try {
			availabilitySchedule[day] = !availabilitySchedule[day];
			// In real app: Update in PocketBase
			// await pb.collection('drivers').update(driverId, {
			//     [`availability.${day}`]: availabilitySchedule[day]
			// });
		} catch (error) {
			console.error('Error updating availability:', error);
			availabilitySchedule[day] = !availabilitySchedule[day]; // Revert on error
		}
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: 'GBP'
		}).format(amount);
	}
</script>

<div class="h-full bg-background">
	<!-- Main Content -->
	<div class="container mx-auto space-y-6 p-4">
		<!-- Profile Summary -->
		<Card>
			<CardContent class="p-6">
				<div class="flex items-center space-x-4">
					<div class="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
						<User class="h-8 w-8" />
					</div>
					<div>
						<h2 class="text-xl font-semibold">{driver.name}</h2>
						<div class="flex items-center space-x-2 text-sm text-muted-foreground">
							<Car class="h-4 w-4" />
							<span>{driver.vehicle}</span>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>

		<!-- Statistics -->
		<div class="grid grid-cols-3 gap-4">
			<Card>
				<CardContent class="p-4 text-center">
					<p class="text-2xl font-bold">{driver.rating}</p>
					<p class="text-sm text-muted-foreground">Rating</p>
				</CardContent>
			</Card>
			<Card>
				<CardContent class="p-4 text-center">
					<p class="text-2xl font-bold">{driver.totalJobs}</p>
					<p class="text-sm text-muted-foreground">Total Jobs</p>
				</CardContent>
			</Card>
			<Card>
				<CardContent class="p-4 text-center">
					<p class="text-2xl font-bold">98%</p>
					<p class="text-sm text-muted-foreground">Completion</p>
				</CardContent>
			</Card>
		</div>

		<!-- Earnings -->
		<Card>
			<CardHeader>
				<CardTitle>Earnings</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="space-y-4">
					<div class="flex justify-between">
						<span class="text-muted-foreground">Today</span>
						<span class="font-medium">{formatCurrency(driver.earnings.today)}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-muted-foreground">This Week</span>
						<span class="font-medium">{formatCurrency(driver.earnings.week)}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-muted-foreground">This Month</span>
						<span class="font-medium">{formatCurrency(driver.earnings.month)}</span>
					</div>
				</div>
			</CardContent>
		</Card>

		<!-- Availability Schedule -->
		<Card>
			<CardHeader>
				<CardTitle>Weekly Availability</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="space-y-4">
					{#each Object.entries(availabilitySchedule) as [day, isAvailable]}
						<div class="flex items-center justify-between">
							<span class="capitalize">{day}</span>
							<Switch
								checked={isAvailable}
								onCheckedChange={() => updateAvailability(day as keyof typeof availabilitySchedule)}
							/>
						</div>
					{/each}
				</div>
			</CardContent>
		</Card>

		<!-- Actions -->
		<div class="space-y-2">
			<Button variant="outline" class="w-full justify-start" on:click={() => goto('/settings')}>
				<Settings class="mr-2 h-4 w-4" />
				Settings
			</Button>
			<Button variant="destructive" class="w-full justify-start">
				<LogOut class="mr-2 h-4 w-4" />
				Sign Out
			</Button>
		</div>
	</div>
</div>
