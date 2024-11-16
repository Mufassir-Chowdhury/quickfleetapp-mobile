import type { Job } from '$lib/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	let availableJobs: Job[] = [
		{
			id: '1',
			customerName: 'John Doe',
			pickup: {
				address: '123 Main St',
				latitude: 123.456,
				longitude: 789.123
			},
			dropoff: {
				address: '456 Elm St',
				latitude: 456.789,
				longitude: 123.456
			},
			date: '2021-12-31',
			time: '12:00 PM',
			passengers: 2,
			vehicleType: 'Sedan',
			estimatedDuration: '1 hour',
			fare: 50,
			status: 'pending',
			driver: {
				id: '2',
				name: 'Jane Smith',
				vehicle: 'SUV',
				phoneNumber: '555-555-5555'
			},
			notes: 'Some notes',
			createdAt: '2021-12-01',
			updatedAt: '2021-12-01'
		},
		{
			id: '1',
			customerName: 'John Doe',
			pickup: {
				address: '123 Main St',
				latitude: 123.456,
				longitude: 789.123
			},
			dropoff: {
				address: '456 Elm St',
				latitude: 456.789,
				longitude: 123.456
			},
			date: '2021-12-31',
			time: '12:00 PM',
			passengers: 2,
			vehicleType: 'Sedan',
			estimatedDuration: '1 hour',
			fare: 50,
			status: 'pending',
			driver: {
				id: '2',
				name: 'Jane Smith',
				vehicle: 'SUV',
				phoneNumber: '555-555-5555'
			},
			notes: 'Some notes',
			createdAt: '2021-12-01',
			updatedAt: '2021-12-01'
		}
	];

	return {
		props: {
			jobs: availableJobs
		}
	};
};
