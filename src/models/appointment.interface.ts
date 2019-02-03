export interface Appointment{
	date: Date;
    timeStamp: number;
    booker_id: string;
    booker_name?: string;
    prop_id: string;
    apart_id: string;
    apart_type?: string;
    apart_dp?: string;
    host_id: string;
    host_name?: string;
    host_confirms?: boolean;
    host_declines?: boolean;
    seeker_cancels?: boolean;
    room_type?: string;
    address?: string;
    bookerDp?: string;
    appointment_id?: string;
    timeStampModified?: number;
    seen ?: boolean;
}