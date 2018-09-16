import {Image} from '../image.interface'
import { Address } from '../location/address.interface'

export interface Property{
	prop_id: string;
	common: string;
	description?: string;
	dP: Image;
	images: Image[];
	laundry: boolean;
	nsfas: boolean;
	wifi: boolean;
	parking: boolean;
	prepaid_elec: boolean;
	address: Address;
	timeStamp: number;
	user_id: string
	nearbys?: string[];
}