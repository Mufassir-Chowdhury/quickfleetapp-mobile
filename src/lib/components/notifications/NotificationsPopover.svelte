<!-- src/lib/components/notifications/NotificationsPopover.svelte -->
<script lang="ts">
	import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Bell, MessageSquare, Car, CheckCircle, AlertCircle } from 'lucide-svelte';
	import type { Notification, NotificationType } from '$lib/types';

	// Sample notifications data - in production, this would come from PocketBase
	let notifications: Notification[] = [
		{
			id: '1',
			type: 'job_assigned',
			title: 'New Job Assigned',
			message: 'You have been assigned a new job in Central London',
			timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
			read: false,
			jobId: 'job123'
		},
		{
			id: '2',
			type: 'message',
			title: 'New Message',
			message: 'Operator: Please call when you arrive',
			timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
			read: false,
			jobId: 'job123'
		},
		{
			id: '3',
			type: 'job_completed',
			title: 'Job Completed',
			message: 'Job #ABC123 has been marked as completed',
			timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
			read: true,
			jobId: 'job123'
		},
		{
			id: '4',
			type: 'system',
			title: 'System Update',
			message: 'App update available. Please update to the latest version.',
			timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
			read: true
		}
	];

	$: unreadCount = notifications.filter((n) => !n.read).length;

	function getNotificationIcon(type: NotificationType) {
		switch (type) {
			case 'message':
				return MessageSquare;
			case 'job_assigned':
				return Car;
			case 'job_completed':
				return CheckCircle;
			default:
				return AlertCircle;
		}
	}

	function formatTimestamp(timestamp: string): string {
		const date = new Date(timestamp);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / (1000 * 60));
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

		if (diffMins < 60) {
			return `${diffMins}m ago`;
		} else if (diffHours < 24) {
			return `${diffHours}h ago`;
		} else if (diffDays === 1) {
			return 'Yesterday';
		} else {
			return date.toLocaleDateString();
		}
	}

	function markAsRead(notificationId: string) {
		notifications = notifications.map((n) => (n.id === notificationId ? { ...n, read: true } : n));
	}

	function handleNotificationClick(notification: Notification) {
		markAsRead(notification.id);
		if (notification.jobId) {
			// Navigate to job details
			console.log('Navigate to job:', notification.jobId);
		}
	}
</script>

<Popover>
	<PopoverTrigger asChild let:builder>
		<Button variant="ghost" size="icon" class="relative" builders={[builder]}>
			<Bell class="h-5 w-5" />
			{#if unreadCount > 0}
				<span
					class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground"
				>
					{unreadCount}
				</span>
			{/if}
		</Button>
	</PopoverTrigger>
	<PopoverContent class="w-80" align="end">
		<div class="flex items-center justify-between pb-4">
			<h4 class="text-sm font-semibold">Notifications</h4>
			{#if unreadCount > 0}
				<Button variant="ghost" size="sm" class="text-xs">Mark all as read</Button>
			{/if}
		</div>
		<ScrollArea class="h-[300px]">
			<div class="space-y-4">
				{#each notifications as notification}
					{@const Icon = getNotificationIcon(notification.type)}
					<div
						class="flex cursor-pointer space-x-4 rounded-lg p-2 hover:bg-muted"
						class:opacity-70={notification.read}
						on:click={() => handleNotificationClick(notification)}
						on:keydown={(e) => e.key === 'Enter' && handleNotificationClick(notification)}
						role="button"
						tabindex="0"
					>
						<div class="mt-1">
							<Icon class="h-5 w-5" />
						</div>
						<div class="flex-1 space-y-1">
							<div class="flex items-start justify-between">
								<p class="text-sm font-medium">{notification.title}</p>
								<span class="text-[10px] text-muted-foreground">
									{formatTimestamp(notification.timestamp)}
								</span>
							</div>
							<p class="text-xs text-muted-foreground">
								{notification.message}
							</p>
						</div>
						{#if !notification.read}
							<div class="mt-1 h-2 w-2 rounded-full bg-primary"></div>
						{/if}
					</div>
				{/each}
			</div>
		</ScrollArea>
	</PopoverContent>
</Popover>
