import { Address } from './location/address.interface';

export interface Search{
	apartment_type: string;
	Address: Address;
	maxPrice: number;
	minPrice: number;
	nearby?: string;
	nsfas: boolean;
	parking: boolean;
	searcher_id?: string;
	searcher_name?: string;
	searcher_dp?: string;
	searcher_contact?: string;
	searcher_email?: string;
	contact_on_WhatsApp?: boolean;
	timeStamp: number;
	wifi?: boolean;
	laundry?: boolean;
	other?: string;
}