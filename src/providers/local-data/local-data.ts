import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Search } from '../../models/search.interface';
import { Apartment } from '../../models/properties/apartment.interface';
import { Address } from '../../models/location/address.interface';
import { Seeker } from '../../models/users/seeker.interface';
import { User } from '../../models/users/user.interface';
import { Duration } from '../../models/location/duration.interface';

@Injectable()
export class LocalDataProvider {

  constructor(private storage: Storage) {
   
  }

  setSearch(search: Search):Promise<Search>{
  	return this.storage.set('search_object', search)
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

}
