import { User } from './user.interface';
import { Address } from '../location/address.interface';

export interface Tenant{
	profile: User;
	address: Address;
	reviews?: {reviewer_name: string, reviewer_id: string, comment: string }[]
}