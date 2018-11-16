import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Search } from '../../models/search.interface';
import { Apartment } from '../../models/properties/apartment.interface';
import { Address } from '../../models/location/address.interface';
import { Seeker } from '../../models/users/seeker.interface';
import { User } from '../../models/users/user.interface';
import { Duration } from '../../models/location/duration.interface';
import { Property } from '../../models/properties/property.interface';
import { Thread } from '../../models/thread.interface';

@Injectable()
export class LocalDataProvider {

  constructor(private storage: Storage) {
   
  }

  setTransactionState(state: any){
    return this.storage.set('transaction_state', state)
  }

  getTransactionState(){
    return this.storage.get('transaction_state')
  }

  setMessageDetails(details: any){
    return this.storage.set('msg_details', details);
  }

  getMessageDetails(){
    return this.storage.get('msg_details');
  }

  setThread(thread: any){
    return this.storage.set('thread', thread);
  }

  getThread(){
    return this.storage.get('thread');
  }

  setSearch(search: Search):Promise<Search>{
  	return this.storage.set('search_object', search)
  }

  setProperty(prop: Property):Promise<Property>{
    return this.storage.set('property', prop)
  }

  getProperty():Promise<Property>{
    return this.storage.get('property')
  }

  getSearch():Promise<Search>{
  	return this.storage.get('search_object')
  }

  setUser(user: User):Promise<User>{
    return this.storage.set('user', user);
  }

  getUser():Promise<User>{
    return this.storage.get('user');
  }

  removeUser():Promise<void>{
    return this.storage.remove('user');
  }

  setSeeker(seeker: Seeker):Promise<Seeker>{
    return this.storage.set('seeker', seeker);
  }

  getSeeker():Promise<Seeker>{
    return this.storage.get('seeker');
  }

  removeSeeker():Promise<void>{
    return this.storage.remove('seeker');
  }

  setApartment(apartment: Apartment):Promise<Apartment>{
  	return this.storage.set('aoi', apartment);
  }

  getApartment():Promise<Apartment>{
  	return this.storage.get('aoi');
  }

  setPOI(poi: Address):Promise<Address>{
  	return this.storage.set('poi', poi);
  }

  getPOI():Promise<Address>{
  	return this.storage.get('poi');
  }

  setWalkingDuration(duration: Duration):Promise<Duration>{
    return this.storage.set('walkingDuration', duration);
  }

  getWalkingDuration():Promise<Duration>{
    return this.storage.get('walkingDuration');
  }

  setUserType(user_type: string){
    return this.storage.set('user_type', user_type)
  }

  getUserType(){
    return this.storage.get('user_type');
  }

}
