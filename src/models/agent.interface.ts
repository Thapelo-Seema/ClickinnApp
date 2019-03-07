import { Address } from './location/address.interface';

export interface Agent{
	uid: string;
	name: string;
	areas: Address[];
	phoneNumber: string;
	online: boolean;
}