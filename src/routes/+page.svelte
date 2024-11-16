<!-- src/routes/home/+page.svelte -->
<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import {
		MapPin,
		Clock,
		Car,
		PoundSterling,
		CheckCircle2,
		XCircle,
		ChevronRight
	} from 'lucide-svelte';
	import { goto } from '$app/navigation';

	let { data } = $props();
	let { currentJob, availableJobs } = data.props;

	// Navigate to job details
	function viewJobDetails(jobId: string) {
		goto(`/jobs/${jobId}`);
	}

	// Accept job function
	async function acceptJob(jobId: string, event: Event) {
		// Prevent the event from bubbling up to the parent click handler
		event.stopPropagation();
		try {
			// Your existing accept job logic
			console.log('Accepting job:', jobId);
		} catch (error) {
			console.error('Error accepting job:', error);
		}
	}

	// Format currency
	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: 'GBP'
		}).format(amount);
	}
</script>

<div class="h-full bg-background">
	<!-- Main Content -->
	<div class="container mx-auto p-4">
		<!-- Current Job Section -->
		<Card class="mb-6">
			<CardHeader>
				<CardTitle>Current Job</CardTitle>
			</CardHeader>
			{#if currentJob}
				<CardContent>
					<div
						class="cursor-pointer space-y-4"
						onclick={() => viewJobDetails(currentJob.id)}
						onkeydown={(e) => e.key === 'Enter' && viewJobDetails(currentJob.id)}
						tabindex="0"
						role="button"
					>
						<div class="flex items-start justify-between">
							<div class="flex items-start space-x-2">
								<MapPin class="mt-1 h-5 w-5 text-muted-foreground" />
								<div class="flex-1">
									<p class="font-medium">Pickup</p>
									<p class="text-sm text-muted-foreground">{currentJob.pickup.address}</p>
								</div>
							</div>
							<ChevronRight class="h-5 w-5 text-muted-foreground" />
						</div>
						<div class="flex items-start space-x-2">
							<MapPin class="mt-1 h-5 w-5 text-muted-foreground" />
							<div class="flex-1">
								<p class="font-medium">Drop-off</p>
								<p class="text-sm text-muted-foreground">{currentJob.dropoff.address}</p>
							</div>
						</div>
						<div class="grid grid-cols-2 gap-4">
							<div class="flex items-center space-x-2">
								<Clock class="h-5 w-5 text-muted-foreground" />
								<span class="text-sm">{currentJob.estimatedDuration}</span>
							</div>
							<div class="flex items-center space-x-2">
								<PoundSterling class="h-5 w-5 text-muted-foreground" />
								<span class="text-sm">{formatCurrency(currentJob.fare)}</span>
							</div>
						</div>
						<div class="flex justify-between space-x-2">
							<Button class="flex-1" variant="outline">Navigate</Button>
							<Button class="flex-1">Update Status</Button>
						</div>
					</div>
				</CardContent>
			{:else}
				<CardContent class="p-6 text-center text-muted-foreground">
					No job at the moment
				</CardContent>
			{/if}
		</Card>

		<!-- Available Jobs -->
		<div class="space-y-4">
			<h2 class="text-lg font-semibold">Available Jobs</h2>
			{#if availableJobs.length === 0}
				<Card>
					<CardContent class="p-6 text-center text-muted-foreground">
						No jobs available at the moment
					</CardContent>
				</Card>
			{:else}
				{#each availableJobs as job}
					<Card>
						<CardContent class="p-4">
							<div
								class="cursor-pointer space-y-4"
								onclick={() => viewJobDetails(job.id)}
								onkeydown={(e) => e.key === 'Enter' && viewJobDetails(job.id)}
								tabindex="0"
								role="button"
							>
								<div class="flex items-start justify-between">
									<div class="flex items-start space-x-2">
										<MapPin class="mt-1 h-5 w-5 text-muted-foreground" />
										<div>
											<p class="font-medium">Pickup</p>
											<p class="text-sm text-muted-foreground">{job.pickup.address}</p>
										</div>
									</div>
									<div class="flex items-center space-x-2">
										<Badge variant="outline">
											{formatCurrency(job.fare)}
										</Badge>
										<ChevronRight class="h-5 w-5 text-muted-foreground" />
									</div>
								</div>
								<div class="flex items-start space-x-2">
									<MapPin class="mt-1 h-5 w-5 text-muted-foreground" />
									<div>
										<p class="font-medium">Drop-off</p>
										<p class="text-sm text-muted-foreground">{job.dropoff.address}</p>
									</div>
								</div>
								<div class="grid grid-cols-2 gap-4">
									<div class="flex items-center space-x-2">
										<Clock class="h-5 w-5 text-muted-foreground" />
										<span class="text-sm">{job.estimatedDuration}</span>
									</div>
									<div class="flex items-center space-x-2">
										<Car class="h-5 w-5 text-muted-foreground" />
										<span class="text-sm">{job.vehicleType}</span>
									</div>
								</div>
								<div class="flex space-x-2">
									<Button
										variant="outline"
										class="flex-1"
										on:click={(e) => {
											e.stopPropagation();
											// Decline logic here
										}}
									>
										<XCircle class="mr-2 h-4 w-4" />
										Decline
									</Button>
									<Button class="flex-1" on:click={(e) => acceptJob(job.id, e)}>
										<CheckCircle2 class="mr-2 h-4 w-4" />
										Accept
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				{/each}
			{/if}
		</div>
	</div>
</div>
