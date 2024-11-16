<!-- src/routes/history/+page.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Input } from '$lib/components/ui/input';
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectValue
	} from '$lib/components/ui/select';
	import { MapPin, Clock, Search, ArrowLeft, PoundSterling, ChevronRight } from 'lucide-svelte';
	import type { Job } from '$lib/types';

	let { data } = $props();
	let { jobs } = data.props;

	let isLoading = $state(false);
	let error: string | null = $state(null);
	let searchQuery = $state('');
	let statusFilter = $state('all');
	let currentPage = $state(1);
	const itemsPerPage = 10;

	// Date range filter (default to last 30 days)
	let startDate = $state(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

	let endDate = $state(new Date());

	// Calculate earnings
	let totalEarnings = $derived(jobs.reduce((sum, job) => sum + (job.fare || 0), 0));
	let filteredJobs = $derived(filterJobs(jobs));
	console.log(jobs);
	let paginatedJobs = $derived(paginateJobs(filteredJobs));

	function filterJobs(jobs: Job[]) {
		return jobs.filter((job) => {
			const matchesSearch =
				searchQuery === '' ||
				job.pickup.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
				job.dropoff.address.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesStatus = statusFilter === 'all' || job.status === statusFilter;

			// const jobDate = new Date(job.date ?? job.createdAt);
			// const matchesDate = jobDate >= startDate && jobDate <= endDate;
			// console.log(matchesDate);

			return matchesSearch && matchesStatus;
		});
	}

	function paginateJobs(jobs: Job[]) {
		const start = (currentPage - 1) * itemsPerPage;
		const end = start + itemsPerPage;
		return jobs.slice(start, end);
	}

	function formatDateTime(dateString: string): string {
		return new Date(dateString).toLocaleString('en-GB', {
			day: '2-digit',
			month: 'short',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: 'GBP'
		}).format(amount);
	}
</script>

<div class="h-full bg-background">
	<div class="container mx-auto space-y-4 p-4">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<Button variant="ghost" class="p-2" on:click={() => goto('/home')}>
				<ArrowLeft class="h-4 w-4" />
			</Button>
			<h1 class="text-xl font-bold">Job History</h1>
			<div class="w-8"></div>
		</div>

		<!-- Earnings Summary -->
		<Card>
			<CardContent class="p-4">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-muted-foreground">Total Earnings</p>
						<p class="text-2xl font-bold">{formatCurrency(totalEarnings)}</p>
					</div>
					<p class="text-sm text-muted-foreground">
						{filteredJobs.length} jobs
					</p>
				</div>
			</CardContent>
		</Card>

		<!-- Filters -->
		<div class="space-y-2">
			<!-- Search and Status Filter -->
			<div class="flex space-x-2">
				<div class="relative flex-1">
					<Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input type="text" placeholder="Search jobs..." class="pl-8" bind:value={searchQuery} />
				</div>
				<Select
					selected={statusFilter}
					onSelectedChange={(value: string) => (statusFilter = value)}
				>
					<SelectTrigger class="w-[140px]">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All</SelectItem>
						<SelectItem value="completed">Completed</SelectItem>
						<SelectItem value="cancelled">Cancelled</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<!-- Date Range -->
			<div class="flex space-x-2">
				<Input type="date" bind:value={startDate} class="flex-1" />
				<Input type="date" bind:value={endDate} class="flex-1" />
			</div>
		</div>

		<!-- Jobs List -->
		{#if isLoading}
			<div class="flex justify-center p-8">
				<div
					class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"
				></div>
			</div>
		{:else if error}
			<Card>
				<CardContent class="p-6 text-center text-destructive">
					{error}
				</CardContent>
			</Card>
		{:else if paginatedJobs.length === 0}
			<Card>
				<CardContent class="p-6 text-center text-muted-foreground">No jobs found</CardContent>
			</Card>
		{:else}
			<div class="space-y-2">
				{#each paginatedJobs as job}
					<Card>
						<CardContent class="p-4">
							<div
								class="cursor-pointer space-y-3"
								onclick={() => goto(`/jobs/${job.id}`)}
								onkeydown={(e) => e.key === 'Enter' && goto(`/jobs/${job.id}`)}
								tabindex="0"
								role="button"
							>
								<!-- Header with Status and Time -->
								<div class="flex items-center justify-between">
									<Badge
										variant="outline"
										class={job.status === 'completed'
											? 'bg-green-100 text-green-800'
											: 'bg-red-100 text-red-800'}
									>
										{job.status}
									</Badge>
									<div class="flex items-center space-x-2">
										<span class="text-sm text-muted-foreground">
											{formatDateTime(job.createdAt)}
										</span>
										<ChevronRight class="h-4 w-4 text-muted-foreground" />
									</div>
								</div>

								<!-- Locations -->
								<div class="space-y-2">
									<div class="flex space-x-2">
										<MapPin class="mt-1 h-4 w-4 text-muted-foreground" />
										<div class="flex-1">
											<p class="text-sm font-medium">Pickup</p>
											<p class="text-sm text-muted-foreground">{job.pickup.address}</p>
										</div>
									</div>
									<div class="flex space-x-2">
										<MapPin class="mt-1 h-4 w-4 text-muted-foreground" />
										<div class="flex-1">
											<p class="text-sm font-medium">Drop-off</p>
											<p class="text-sm text-muted-foreground">{job.dropoff.address}</p>
										</div>
									</div>
								</div>

								<!-- Footer with Duration and Fare -->
								<div class="flex items-center justify-between border-t pt-2">
									<div class="flex items-center space-x-2">
										<Clock class="h-4 w-4 text-muted-foreground" />
										<span class="text-sm">{job.estimatedDuration}</span>
									</div>
									<div class="flex items-center space-x-2">
										<PoundSterling class="h-4 w-4 text-muted-foreground" />
										<span class="text-sm font-medium">{formatCurrency(job.fare)}</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				{/each}
			</div>

			<!-- Pagination -->
			{#if filteredJobs.length > itemsPerPage}
				<div class="mt-4 flex justify-center space-x-2">
					<Button variant="outline" disabled={currentPage === 1} on:click={() => currentPage--}>
						Previous
					</Button>
					<Button
						variant="outline"
						disabled={currentPage >= Math.ceil(filteredJobs.length / itemsPerPage)}
						on:click={() => currentPage++}
					>
						Next
					</Button>
				</div>
			{/if}
		{/if}
	</div>
</div>
