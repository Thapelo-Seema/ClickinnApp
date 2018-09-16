import { Image } from '../image.interface';
import { Tenant } from '../users/tenant.interface';
import { Property } from '../properties/property.interface';

export interface Apartment{
	available: boolean;
	dP: Image;
	deposit: number;
	description: string;
	apart_id: string;
	images: Image[];
	occupiedBy?: Tenant;
	price: number;
	prop_id: string;
	property?: Property;
	room_type: string;
	search_rating?: number;
	type: string;
	timeStamp: number;

}