
import { Injectable } from '@angular/core';
//import { Address } from '../../models/location/address.interface';
import { Observable } from 'rxjs-compat';
//import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore } from 'angularfire2/firestore';
//import { MapsProvider } from '../maps/maps';
import { Property } from '../../models/properties/property.interface';
import { Apartment } from '../../models/properties/apartment.interface';
//import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Search } from '../../models/search.interface';
import { Image } from '../../models/image.interface';
//import { User } from '../../models/users/user.interface';
import { map } from 'rxjs-compat/operators/map';
/*import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';*/

@Injectable()
export class AccommodationsProvider {

  constructor( private afs: AngularFirestore){}

  getAllApartments():Observable<Apartment[]>{
    return this.afs.collection<Apartment>('/Apartments').valueChanges()
  }

  getApartmentById(apart_id: string):Observable<Apartment>{
    return this.afs.collection('Apartments').doc<Apartment>(apart_id).valueChanges()
  }

  getApartImages(apart_id: string):Observable<Image[]>{
    const col = this.afs.collection('Apartments');
    const docu = col.doc(apart_id);
    return docu.collection<Image>(`images`).valueChanges()
  }

  getUsersProperties(uid: string):Observable<Property[]>{
    return this.afs.collection<Property>('Properties', ref => ref.where('user_id', '==', uid))
    .valueChanges()
  }

  getUserApartments(uid: string): Observable<Apartment[]>{
    return this.afs.collection<Apartment>('Apartments', ref => ref.where('property.user_id', '==', uid)).valueChanges()
  }

  getPropertyApartments(prop_id: string): Observable<Apartment[]>{
    return this.afs.collection<Apartment>('Apartments', ref => ref.where('prop_id', '==', prop_id)).valueChanges()
  }

  getPropertyImages(prop_id: string):Observable<Image[]>{
    const col = this.afs.collection('Properties');
    const docu = col.doc(prop_id);
    return docu.collection<Image>(`images`).valueChanges();
  }

  getFeaturedApartments():Observable<Apartment[]>{
    return this.afs.collection<Apartment>('/Apartments', ref => ref.limit(9)).valueChanges();
  }

  /*updateAccoms():Observable<Property[]>{
    return this.db.list<Property>('/Properties').valueChanges()
  }

  updatePropertyAddress(property_id: string, address: Address):Promise<void>{
    return this.db.object(`Properties/${property_id}/address`).remove();
  }

  updateApartmentProperty(apartment_id: string, property):Promise<void>{
    return this.db.object(`Apartments/${apartment_id}/property`).update(property)
  }*/

  getPropertyById(property_id: string):Observable<Property>{
    return this.afs.collection(`/Properties`).doc<Property>(property_id).valueChanges()
  }

  getPropertiesByVicinity(vicinity: string):Observable<Property[]>{
    return this.afs.collection<Property>('/Properties', ref => 
      ref.where('address.vicinity', '==', vicinity)).valueChanges()
  }

  search(search_obj: Search):Observable<Apartment[]>{
    console.log('search_obj: ', search_obj);
   if(search_obj.apartment_type !== 'Any' && search_obj.parking && search_obj.wifi && search_obj.nsfas && search_obj.laundry){
     console.log('case 1');
     return this.afs.collection<Apartment>('/Apartments', ref => 
        ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
           .where('available', '==', true)
           .where('price', "<=", search_obj.maxPrice)
           .where('room_type', '==', search_obj.apartment_type)
           .where('property.parking', '==', search_obj.parking)
           .where('property.wifi', '==', search_obj.wifi)
           .where('property.nsfas', '==', search_obj.nsfas)
           .where('property.laundry', '==', search_obj.laundry)
           .orderBy('price', 'asc')
          ).valueChanges()
   }else if(search_obj.apartment_type !== 'Any' && search_obj.wifi && search_obj.laundry && search_obj.nsfas && !search_obj.parking){
     console.log('case 2');
      return this.afs.collection<Apartment>('/Apartments', ref => 
        ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
           .where('available', '==', true)
           .where('price', "<=", search_obj.maxPrice)
           .where('room_type', '==', search_obj.apartment_type)
           .where('property.wifi', '==', search_obj.wifi)
           .where('property.nsfas', '==', search_obj.nsfas)
           .where('property.laundry', '==', search_obj.laundry)
           .orderBy('price', 'asc')
          ).valueChanges()
   }else if(search_obj.apartment_type !== 'Any' && search_obj.wifi && search_obj.laundry && !search_obj.nsfas && !search_obj.parking){
     console.log('case 3');
      return this.afs.collection<Apartment>('/Apartments', ref => 
        ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
           .where('available', '==', true)
           .where('price', "<=", search_obj.maxPrice)
           .where('room_type', '==', search_obj.apartment_type)
           .where('property.wifi', '==', search_obj.wifi)
           .where('property.laundry', '==', search_obj.laundry)
           .orderBy('price', 'asc')
          ).valueChanges()
   }else if(search_obj.apartment_type !== 'Any' && search_obj.wifi && !search_obj.laundry && !search_obj.nsfas && !search_obj.parking){
     console.log('case 4');
       return this.afs.collection<Apartment>('/Apartments', ref => 
        ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
           .where('available', '==', true)
           .where('price', "<=", search_obj.maxPrice)
           .where('room_type', '==', search_obj.apartment_type)
           .where('property.wifi', '==', search_obj.wifi)
           .orderBy('price', 'asc')
          ).valueChanges()
   }else if(search_obj.apartment_type !== 'Any' && !search_obj.wifi && !search_obj.laundry && !search_obj.nsfas && !search_obj.parking){
     console.log('case 5');
      return this.afs.collection<Apartment>('/Apartments', ref => 
        ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
           .where('available', '==', true)
           .where('price', "<=", search_obj.maxPrice)
           .where('room_type', '==', search_obj.apartment_type)
           .orderBy('price', 'asc')
          ).valueChanges()
   }else if(search_obj.apartment_type === 'Any' && !search_obj.wifi && !search_obj.laundry && !search_obj.nsfas && !search_obj.parking){
     console.log('case 6');
      return this.afs.collection<Apartment>('/Apartments', ref => 
        ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
           .where('available', '==', true)
           .where('price', "<=", search_obj.maxPrice)
           .orderBy('price', 'asc')
          ).valueChanges()
   }else if(search_obj.apartment_type === 'Any' && search_obj.wifi && search_obj.laundry && search_obj.nsfas && search_obj.parking){
     console.log('case 7');
      return this.afs.collection<Apartment>('/Apartments', ref => 
        ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
           .where('available', '==', true)
           .where('price', "<=", search_obj.maxPrice)
           .where('property.parking', '==', search_obj.parking)
           .where('property.wifi', '==', search_obj.wifi)
           .where('property.nsfas', '==', search_obj.nsfas)
           .where('property.laundry', '==', search_obj.laundry)
           .orderBy('price', 'asc')
          ).valueChanges()
   }else if(search_obj.apartment_type === 'Any' && search_obj.wifi && search_obj.laundry && search_obj.nsfas && !search_obj.parking){
     console.log('case 8');
      return this.afs.collection<Apartment>('/Apartments', ref => 
        ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
           .where('available', '==', true)
           .where('price', "<=", search_obj.maxPrice)
           .where('property.wifi', '==', search_obj.wifi)
           .where('property.nsfas', '==', search_obj.nsfas)
           .where('property.laundry', '==', search_obj.laundry)
           .orderBy('price', 'asc')
          ).valueChanges()
   }else if(search_obj.apartment_type === 'Any' && search_obj.wifi && search_obj.laundry && !search_obj.nsfas && !search_obj.parking){
     console.log('case 9');
      return this.afs.collection<Apartment>('/Apartments', ref => 
        ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
           .where('available', '==', true)
           .where('price', "<=", search_obj.maxPrice)
           .where('property.wifi', '==', search_obj.wifi)
           .where('property.laundry', '==', search_obj.laundry)
           .orderBy('price', 'asc')
          ).valueChanges()
   }else if(search_obj.apartment_type === 'Any' && search_obj.wifi && !search_obj.laundry && !search_obj.nsfas && !search_obj.parking){
     console.log('case 10');
      return this.afs.collection<Apartment>('/Apartments', ref => 
        ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
           .where('available', '==', true)
           .where('price', "<=", search_obj.maxPrice)
           .where('property.wifi', '==', search_obj.wifi)
           .orderBy('price', 'asc')
          ).valueChanges()
   }else if(search_obj.apartment_type !== 'Any' && !search_obj.wifi && search_obj.laundry && search_obj.nsfas && search_obj.parking){
     console.log('case 11');
      return this.afs.collection<Apartment>('/Apartments', ref => 
        ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
           .where('available', '==', true)
           .where('price', "<=", search_obj.maxPrice)
           .where('room_type', '==', search_obj.apartment_type)
           .where('property.parking', '==', search_obj.parking)
           .where('property.nsfas', '==', search_obj.nsfas)
           .where('property.laundry', '==', search_obj.laundry)
           .orderBy('price', 'asc')
          ).valueChanges()
   }else if(search_obj.apartment_type !== 'Any' && !search_obj.wifi && search_obj.laundry && search_obj.nsfas && !search_obj.parking){
     console.log('case 12');
      return this.afs.collection<Apartment>('/Apartments', ref => 
        ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
           .where('available', '==', true)
           .where('price', "<=", search_obj.maxPrice)
           .where('room_type', '==', search_obj.apartment_type)
           .where('property.nsfas', '==', search_obj.nsfas)
           .where('property.laundry', '==', search_obj.laundry)
           .orderBy('price', 'asc')
          ).valueChanges()
   }
   else if(search_obj.apartment_type !== 'Any' && !search_obj.wifi && search_obj.laundry && !search_obj.nsfas && !search_obj.parking){
     console.log('case 13');
      return this.afs.collection<Apartment>('/Apartments', ref => 
        ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
           .where('available', '==', true)
           .where('price', "<=", search_obj.maxPrice)
           .where('property.laundry', '==', search_obj.laundry)
           .orderBy('price', 'asc')
          ).valueChanges()
   }
   else if(search_obj.apartment_type === 'Any' && !search_obj.wifi && search_obj.laundry && !search_obj.nsfas && !search_obj.parking){
     console.log('case 14');
      return this.afs.collection<Apartment>('/Apartments', ref => 
        ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
           .where('available', '==', true)
           .where('price', "<=", search_obj.maxPrice)
           .where('property.laundry', '==', search_obj.laundry)
           .orderBy('price', 'asc')
          ).valueChanges()
   }
   else if(search_obj.apartment_type !== 'Any' && search_obj.wifi && !search_obj.laundry && search_obj.nsfas && search_obj.parking){
     console.log('case 15');
       return this.afs.collection<Apartment>('/Apartments', ref => 
        ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
           .where('available', '==', true)
           .where('price', "<=", search_obj.maxPrice)
           .where('room_type', '==', search_obj.apartment_type)
           .where('property.parking', '==', search_obj.parking)
           .where('property.wifi', '==', search_obj.wifi)
           .where('property.nsfas', '==', search_obj.nsfas)
           .orderBy('price', 'asc')
          ).valueChanges()
   }else if(search_obj.apartment_type !== 'Any' && search_obj.wifi && !search_obj.laundry && search_obj.nsfas && !search_obj.parking){
     console.log('case 16');
     return this.afs.collection<Apartment>('/Apartments', ref => 
        ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
           .where('available', '==', true)
           .where('price', "<=", search_obj.maxPrice)
           .where('room_type', '==', search_obj.apartment_type)
           .where('property.wifi', '==', search_obj.wifi)
           .where('property.nsfas', '==', search_obj.nsfas)
           .orderBy('price', 'asc')
          ).valueChanges()
   }else if(search_obj.apartment_type === 'Any' && search_obj.wifi && !search_obj.laundry && search_obj.nsfas && !search_obj.parking){
     console.log('case 17');
       return this.afs.collection<Apartment>('/Apartments', ref => 
        ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
           .where('available', '==', true)
           .where('price', "<=", search_obj.maxPrice)
           .where('property.wifi', '==', search_obj.wifi)
           .where('property.nsfas', '==', search_obj.nsfas)
           .orderBy('price', 'asc')
          ).valueChanges()
   }else if(search_obj.apartment_type === 'Any' && !search_obj.wifi && !search_obj.laundry && search_obj.nsfas && !search_obj.parking){
     console.log('case 18');
       return this.afs.collection<Apartment>('/Apartments', ref => 
        ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
           .where('available', '==', true)
           .where('price', "<=", search_obj.maxPrice)
           .where('property.nsfas', '==', search_obj.nsfas)
           .orderBy('price', 'asc')
          ).valueChanges()
   }else if(search_obj.apartment_type !== 'Any' && search_obj.wifi && search_obj.laundry && !search_obj.nsfas && search_obj.parking){
     console.log('case 19');
     return this.afs.collection<Apartment>('/Apartments', ref => 
        ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
           .where('available', '==', true)
           .where('price', "<=", search_obj.maxPrice)
           .where('room_type', '==', search_obj.apartment_type)
           .where('property.parking', '==', search_obj.parking)
           .where('property.wifi', '==', search_obj.wifi)
           .where('property.laundry', '==', search_obj.laundry)
           .orderBy('price', 'asc')
          ).valueChanges()
   }else if(search_obj.apartment_type === 'Any' && search_obj.wifi && search_obj.laundry && !search_obj.nsfas && search_obj.parking){
     console.log('case 20');
      return this.afs.collection<Apartment>('/Apartments', ref => 
        ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
           .where('available', '==', true)
           .where('price', "<=", search_obj.maxPrice)
           .where('property.parking', '==', search_obj.parking)
           .where('property.wifi', '==', search_obj.wifi)
           .where('property.laundry', '==', search_obj.laundry)
           .orderBy('price', 'asc')
          ).valueChanges()
   }else if(search_obj.apartment_type === 'Any' && search_obj.wifi && !search_obj.laundry && !search_obj.nsfas && search_obj.parking){
     console.log('case 21');
         return this.afs.collection<Apartment>('/Apartments', ref => 
        ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
           .where('available', '==', true)
           .where('price', "<=", search_obj.maxPrice)
           .where('property.parking', '==', search_obj.parking)
           .where('property.wifi', '==', search_obj.wifi)
           .orderBy('price', 'asc')
          ).valueChanges()
   }else if(search_obj.apartment_type === 'Any' && !search_obj.wifi && !search_obj.laundry && !search_obj.nsfas && search_obj.parking){
     console.log('case 22');
       return this.afs.collection<Apartment>('/Apartments', ref => 
        ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
           .where('available', '==', true)
           .where('price', "<=", search_obj.maxPrice)
           .where('property.parking', '==', search_obj.parking)
           .orderBy('price', 'asc')
          ).valueChanges()
   }else if(search_obj.apartment_type !== 'Any' && !search_obj.wifi && !search_obj.laundry && search_obj.nsfas && !search_obj.parking){
     console.log('case 23');
       return this.afs.collection<Apartment>('/Apartments', ref => 
        ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
           .where('available', '==', true)
           .where('price', "<=", search_obj.maxPrice)
           .where('room_type', '==', search_obj.apartment_type)
           .where('property.nsfas', '==', search_obj.nsfas)
           .orderBy('price', 'asc')
          ).valueChanges()
   }else if(search_obj.apartment_type !== 'Any' && !search_obj.wifi && !search_obj.laundry && !search_obj.nsfas && search_obj.parking){
     console.log('case 24');
       return this.afs.collection<Apartment>('/Apartments', ref => 
        ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
           .where('available', '==', true)
           .where('price', "<=", search_obj.maxPrice)
           .where('room_type', '==', search_obj.apartment_type)
           .where('property.parking', '==', search_obj.parking)
           .orderBy('price', 'asc')
          ).valueChanges()
   }else if(search_obj.apartment_type !== 'Any' && !search_obj.wifi && search_obj.laundry && !search_obj.nsfas && search_obj.parking){
     console.log('case 24');
       return this.afs.collection<Apartment>('/Apartments', ref => 
        ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
           .where('available', '==', true)
           .where('price', "<=", search_obj.maxPrice)
           .where('room_type', '==', search_obj.apartment_type)
           .where('property.parking', '==', search_obj.parking)
           .where('property.laundry', '==', search_obj.laundry)
           .orderBy('price', 'asc')
          ).valueChanges()
   }else if(search_obj.apartment_type !== 'Any' && !search_obj.wifi && !search_obj.laundry && search_obj.nsfas && search_obj.parking){
     console.log('case 25');
       return this.afs.collection<Apartment>('/Apartments', ref => 
        ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
           .where('available', '==', true)
           .where('price', "<=", search_obj.maxPrice)
           .where('room_type', '==', search_obj.apartment_type)
           .where('property.parking', '==', search_obj.parking)
           .where('property.nsfas', '==', search_obj.nsfas)
           .orderBy('price', 'asc')
          ).valueChanges()
   }else if(search_obj.apartment_type === 'Any' && !search_obj.wifi && search_obj.laundry && !search_obj.nsfas && search_obj.parking){
     console.log('case 26');
       return this.afs.collection<Apartment>('/Apartments', ref => 
        ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
           .where('available', '==', true)
           .where('price', "<=", search_obj.maxPrice)
           .where('property.parking', '==', search_obj.parking)
           .where('property.laundry', '==', search_obj.laundry)
           .orderBy('price', 'asc')
          ).valueChanges()
   }else if(search_obj.apartment_type === 'Any' && search_obj.wifi && !search_obj.laundry && search_obj.nsfas && search_obj.parking){
     console.log('case 27');
       return this.afs.collection<Apartment>('/Apartments', ref => 
        ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
           .where('available', '==', true)
           .where('price', "<=", search_obj.maxPrice)
           .where('property.nsfas', '==', search_obj.nsfas)
           .where('property.wifi', '==', search_obj.wifi)
           .orderBy('price', 'asc')
          ).valueChanges()
   }else if(search_obj.apartment_type === 'Any' && !search_obj.wifi && search_obj.laundry && search_obj.nsfas && search_obj.parking){
     console.log('case 28');
       return this.afs.collection<Apartment>('/Apartments', ref => 
        ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
           .where('available', '==', true)
           .where('price', "<=", search_obj.maxPrice)
           .where('property.nsfas', '==', search_obj.nsfas)
           .where('property.laundry', '==', search_obj.laundry)
           .where('property.parking', '==', search_obj.parking)
           .orderBy('price', 'asc')
          ).valueChanges()
   }else if(search_obj.apartment_type === 'Any' && !search_obj.wifi && !search_obj.laundry && search_obj.nsfas && search_obj.parking){
     console.log('case 29');
       return this.afs.collection<Apartment>('/Apartments', ref => 
        ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
           .where('available', '==', true)
           .where('price', "<=", search_obj.maxPrice)
           .where('property.nsfas', '==', search_obj.nsfas)
           .where('property.parking', '==', search_obj.parking)
           .orderBy('price', 'asc')
          ).valueChanges()
   }else if(search_obj.apartment_type === 'Any' && !search_obj.wifi && search_obj.laundry && search_obj.nsfas && !search_obj.parking){
     console.log('case 30');
       return this.afs.collection<Apartment>('/Apartments', ref => 
        ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
           .where('available', '==', true)
           .where('price', "<=", search_obj.maxPrice)
           .where('property.nsfas', '==', search_obj.nsfas)
           .where('property.laundry', '==', search_obj.laundry)
           .orderBy('price', 'asc')
          ).valueChanges()
   }else if(search_obj.apartment_type !== 'Any' && search_obj.wifi && !search_obj.laundry && !search_obj.nsfas && search_obj.parking){
     console.log('case 31');
       return this.afs.collection<Apartment>('/Apartments', ref => 
        ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
           .where('available', '==', true)
           .where('price', "<=", search_obj.maxPrice)
           .where('room_type', '==', search_obj.apartment_type)
           .where('property.parking', '==', search_obj.parking)
           .where('property.wifi', '==', search_obj.wifi)
           .orderBy('price', 'asc')
          ).valueChanges()
   }else{
      console.log('case 32');
      return this.afs.collection<Apartment>('/Apartments', ref => 
        ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
           .where('available', '==', true)
           .orderBy('price', 'asc')
        ).valueChanges()
    } 
  }

  getRatedApartments(search: Search): Observable<Apartment[]>{
    var ratedArray: Apartment[] = [];
    return  this.search(search)
    .pipe(
      map(apartments =>{
        ratedArray = apartments;
        if(ratedArray.length > 0){
          var ind = 0;
          ratedArray.forEach(apartment => {
            ratedArray[ind].search_rating = this.calcRating(apartment, search);
            ++ind;
          });
          var tempRatedApart = ratedArray[0];
          for(var i = 1; i < ratedArray.length; ++i){
            if(ratedArray[i].search_rating > ratedArray[i].search_rating[i-1]){
              tempRatedApart = ratedArray[i-1];
              ratedArray[i-1] = ratedArray[i];
              ratedArray[i] = tempRatedApart;
            }
          }
        }
        return ratedArray;
        }
      )
    )
    
  }

  calcRating(apartment: Apartment, search: Search): number{
    var rating = 0;
    if(apartment.property.nearbys != undefined){
      rating += apartment.property.nearbys.length/100
      if(apartment.property.nearbys.indexOf(search.Address.description) != -1) rating+=2;
    }
    if(apartment.property.wifi) rating +=1;
    if(apartment.property.laundry) rating +=1;
    rating += 40*((search.maxPrice - apartment.price)/search.maxPrice);
    return rating;
  }

 /* migrateApartments(){
    this.db.list('/Apartments').snapshotChanges().map(actions =>{
      return actions.map(action =>{
        const data = action.payload.val();
        const id = action.key;
        console.log(id);
        return {'data': data, 'id': id}
      })
    }).subscribe(apartments =>{
        var i = 0;
        apartments.forEach(apartment =>{
          console.log(++i ,') ', apartment);
          this.afs.collection('Apartments').doc(apartment.id).set(apartment.data)
        })
        
    })

    this.db.list('/Properties').snapshotChanges().map(actions =>{
      return actions.map(action =>{
        const data = action.payload.val();
        const id = action.key;
        console.log(id);
        return {'data': data, 'id': id}
      })
    }).subscribe(apartments =>{
        var i = 0;
        apartments.forEach(apartment =>{
          console.log(++i ,') ', apartment);
          this.afs.collection('Properties').doc(apartment.id).set(apartment.data)
        })
        
    })
  }

  pingClickinnSearch(search: Search):Observable<Apartment[]>{
    let headers = new HttpHeaders(  
      {   
        'Access-Control-Allow-Headers': ['Content-Type'],
        'Access-Control-Allow-Methods': ['GET', 'POST', 'OPTIONS'],
        'Access-Control-Allow-Origin': ['*']
      } 
    )
    return this.http.post<Apartment[]>('https://us-central1-clickinn-996f0.cloudfunctions.net/clickinnSearch', search, {
        headers: headers
      })
  }

  changePropertyStructure(){
    this.db.list<Apartment>('Apartments').valueChanges().take(1).subscribe(apartments =>{
      apartments.forEach(apartment =>{
        this.db.object(`Properties/${apartment.prop_id}`).valueChanges().take(1).subscribe(property =>{
          this.db.object(`Apartments/${apartment.apart_id}/property`).set(property).then(() =>{
            console.log('success')
          });
        })
      })
    })
  }

  changeProperty(){
    this.db.list<Apartment>('Apartments').valueChanges().take(1).subscribe(apartments =>{
      apartments.forEach(apartment =>{
          this.db.object(`Properties/${apartment.prop_id}`).set(apartment.property).then(success =>{
            console.log('successful')
          });
      })
    })
  }*/

}
