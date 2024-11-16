export interface Message {
	id: string;
	senderId: string;
	senderName: string;
	content: string;
	timestamp: string;
	isOperator: boolean;
}

export interface Notification {
	id: string;
	type: NotificationType;
	title: string;
	message: string;
	timestamp: string;
	read: boolean;
	jobId?: string;
}

export type NotificationType = 'job_assigned' | 'message' | 'job_completed' | 'system';
