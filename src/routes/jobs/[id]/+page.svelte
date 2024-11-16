<!-- src/routes/jobs/[id]/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import {
		ArrowLeft,
		MapPin,
		User,
		Clock,
		Car,
		PoundSterling,
		MessageCircle,
		Navigation,
		CheckCircle2
	} from 'lucide-svelte';
	import type { JobStatus } from '$lib/types';

	let { data } = $props();
	let { job } = data.props;

	let isLoading = $state(true);
	let error: string | null = $state(null);

	// Status options for the job
	const STATUS_OPTIONS = [
		{ value: 'accepted', label: 'Accepted' },
		{ value: 'arrived_pickup', label: 'Arrived at Pickup' },
		{ value: 'pickup_complete', label: 'Pickup Complete' },
		{ value: 'arrived_dropoff', label: 'Arrived at Drop-off' },
		{ value: 'completed', label: 'Completed' }
	];

	async function updateJobStatus(newStatus: JobStatus) {
		try {
			// In real app: Update in PocketBase
			// await pb.collection('jobs').update(job.id, { status: newStatus });
			// Update local state
			if (job) {
				job.status = newStatus;
			}
		} catch (error) {
			console.error('Error updating job status:', error);
		}
	}

	function openNavigation(address: string) {
		// In real app: Use Capacitor plugins to open native maps
		const encodedAddress = encodeURIComponent(address);
		window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: 'GBP'
		}).format(amount);
	}

	onMount(async () => {
		try {
			// In real app: Fetch from PocketBase using page.params.id
			// const record = await pb.collection('jobs').getOne(params.id);
			// job = record;
		} catch (e) {
			error = 'Failed to load job details';
			console.error(e);
		} finally {
			isLoading = false;
		}
	});
</script>

<div class="h-full bg-background">
	<!-- Main Content -->
	<div class="container mx-auto space-y-6 p-4">
		{#if isLoading}
			<div class="flex h-64 items-center justify-center">
				<div class="loading loading-spinner loading-lg"></div>
			</div>
		{:else if error}
			<Card>
				<CardContent class="p-6">
					<div class="text-center text-destructive">
						{error}
					</div>
				</CardContent>
			</Card>
		{:else if job}
			<!-- Customer Info -->
			<Card>
				<CardContent class="p-4">
					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-2">
							<User class="h-5 w-5 text-muted-foreground" />
							<span class="font-medium">{job.customerName}</span>
						</div>
						<Badge variant="outline">
							{job.status}
						</Badge>
					</div>
				</CardContent>
			</Card>

			<!-- Location Details -->
			<Card>
				<CardContent class="space-y-4 p-4">
					<div>
						<div class="flex items-start space-x-2">
							<MapPin class="mt-1 h-5 w-5 text-muted-foreground" />
							<div class="flex-1">
								<p class="font-medium">Pickup Location</p>
								<p class="text-sm text-muted-foreground">{job.pickup.address}</p>
							</div>
							<Button
								variant="outline"
								size="icon"
								on:click={() => openNavigation(job.pickup.address)}
							>
								<Navigation class="h-4 w-4" />
							</Button>
						</div>
					</div>
					<div>
						<div class="flex items-start space-x-2">
							<MapPin class="mt-1 h-5 w-5 text-muted-foreground" />
							<div class="flex-1">
								<p class="font-medium">Drop-off Location</p>
								<p class="text-sm text-muted-foreground">{job.dropoff.address}</p>
							</div>
							<Button
								variant="outline"
								size="icon"
								on:click={() => openNavigation(job.dropoff.address)}
							>
								<Navigation class="h-4 w-4" />
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			<!-- Job Details -->
			<Card>
				<CardHeader>
					<CardTitle>Job Details</CardTitle>
				</CardHeader>
				<CardContent class="space-y-4">
					<div class="grid grid-cols-2 gap-4">
						<div class="flex items-center space-x-2">
							<Clock class="h-5 w-5 text-muted-foreground" />
							<div>
								<p class="text-sm font-medium">Duration</p>
								<p class="text-sm text-muted-foreground">{job.estimatedDuration}</p>
							</div>
						</div>
						<div class="flex items-center space-x-2">
							<Car class="h-5 w-5 text-muted-foreground" />
							<div>
								<p class="text-sm font-medium">Vehicle</p>
								<p class="text-sm text-muted-foreground">{job.vehicleType}</p>
							</div>
						</div>
					</div>
					<div class="flex items-center justify-between border-t pt-4">
						<div class="flex items-center space-x-2">
							<PoundSterling class="h-5 w-5 text-muted-foreground" />
							<span class="font-medium">Fare</span>
						</div>
						<span class="text-xl font-bold">{formatCurrency(job.fare)}</span>
					</div>
				</CardContent>
			</Card>

			<!-- Action Buttons -->
			<div class="space-y-2">
				<Button class="w-full" on:click={() => updateJobStatus('assigned' as JobStatus)}>
					<CheckCircle2 class="mr-2 h-4 w-4" />
					Update Status
				</Button>
				<Button variant="outline" class="w-full">
					<MessageCircle class="mr-2 h-4 w-4" />
					Message Operator
				</Button>
			</div>
		{/if}
	</div>
</div>
