export interface ChatMessage{
	timeStamp: number;
	to: {uid: string, dp: string, displayName:string};
	by: {uid: string, dp: string, displayName:string};
	sent: boolean;
	recieved: boolean;
	read: boolean;
	text: string;
	topic?: string;
}