export interface SupportMessage{
	timeStamp: number;
	user: {uid: string, dp: string, displayName:string};
	assigned_to: {uid: string, dp: string, displayName:string};
	sent: boolean;
	recieved: boolean;
	solved: boolean;
	text: string;
	issue_type?: string;
	sender?: string;
	id?: string;
}