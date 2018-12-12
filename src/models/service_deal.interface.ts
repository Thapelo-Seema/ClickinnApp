
export interface ServiceDeal{
  landlord_firstname: string;
  landlord_lastname: string;
  landlord_uid: string;
  landlord_dp: string;
  landlord_phoneNumber: string;
  agent_firstname: string;
  agent_lastname: string;
  agent_uid: string;
  agent_dp: string;
  agent_phoneNumber: string;
  landlord_agreed: boolean;
  landlord_disagree: boolean;
  agent_cancelled: boolean;
  timeStamp: number;
  id: string;
}