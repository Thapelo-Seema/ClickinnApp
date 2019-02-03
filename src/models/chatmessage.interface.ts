import { Apartment } from './properties/apartment.interface';

export interface ChatMessage{
	attachment?: Apartment
	timeStamp: number;
	to: {uid: string, dp: string, displayName:string};
	by: {uid: string, dp: string, displayName:string};
	sent: boolean;
	recieved: boolean;
	read: boolean;
	text: string;
	topic?: string;
	id?: string;
	seen ?: boolean;
}