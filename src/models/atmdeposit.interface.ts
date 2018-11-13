//import { User } from './users/user.interface';
import { Apartment } from './properties/apartment.interface';

export interface ATMDeposit{
	time_initiated: Date;
	time_tenant_confirmed: Date;
	time_clickinn_confirm: Date;
	time_agent_confirm: Date;
	currency: string;
	to: {firstname: string, lastname: string, dp: string, uid: string};
	by: {firstname: string, lastname: string, dp: string, uid: string}
	apartment: Apartment;
	clickinn_confirmed: boolean;
	tenant_confirmed: boolean;
	agent_confirmed: boolean;
	agent_goAhead: boolean;
	clickinn_cancel: boolean;
	tenant_refund_request: boolean;
	transaction_closed: boolean;
	landlord_credit: number;
	id: string;
	ref: string;

}