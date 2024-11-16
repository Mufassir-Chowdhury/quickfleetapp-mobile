export interface Job {
	id: string;
	customerName: string | null;
	pickup: {
		address: string;
		latitude: number;
		longitude: number;
	};
	dropoff: {
		address: string;
		latitude: number;
		longitude: number;
	};
	date: string | null;
	time: string | null;
	passengers: number | null;
	vehicleType: string;
	estimatedDuration: string;
	fare: number;
	status: JobStatus;
	driver?: {
		id: string;
		name: string;
		vehicle: string;
		phoneNumber: string;
	};
	notes: string;
	createdAt: string;
	updatedAt: string;
}

export type JobStatus = 'pending' | 'assigned' | 'in-transit' | 'completed' | 'cancelled';

export interface JobFormData {
	customerName: string;
	pickup: {
		address: string;
		latitude: number | null;
		longitude: number | null;
	};
	dropoff: {
		address: string;
		latitude: number | null;
		longitude: number | null;
	};
	date: DateValue | undefined;
	time: string;
	passengers: number;
	vehicleType: string | undefined;
	estimatedDuration: string;
	fare: number | null;
	notes: string;
}

export interface JobFormErrors {
	customerName?: string;
	pickup?: string;
	dropoff?: string;
	date?: string;
	time?: string;
	passengers?: string;
	vehicleType?: string;
	fare?: string;
}
