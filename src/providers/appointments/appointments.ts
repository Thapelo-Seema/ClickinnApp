//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { Address } from '../../models/location/address.interface';
import { Observable } from 'rxjs-compat';
import { AngularFirestore , AngularFirestoreCollection} from 'angularfire2/firestore';
//import { MapsProvider } from '../maps/maps';
//import { Property } from '../../models/properties/property.interface';
//import { Apartment } from '../../models/properties/apartment.interface';
//import { HttpClient, HttpHeaders } from '@angular/common/http'
//import { Search } from '../../models/search.interface';
//import { Image } from '../../models/image.interface';
//import { User } from '../../models/users/user.interface';
import { Appointment } from '../../models/appointment.interface';
//import 'rxjs/add/operator/merge';
//import 'rxjs/add/operator/take';
import { take } from 'rxjs-compat/operators/take';
import { ObjectInitProvider } from '../object-init/object-init';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/take';

@Injectable()
export class AppointmentsProvider {
  appointment: Appointment;
  private _done = new BehaviorSubject(false);
  private _loading = new BehaviorSubject(false);
  private _data = new BehaviorSubject([]);

  // Observable data
  data: Observable<any>;
  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable();
  constructor(
    private afstorage: AngularFirestore, 
    private object_init: ObjectInitProvider){}

  createBooking(appointment: Appointment){
    return this.afstorage.collection<Appointment>('Viewings').add(appointment)
  }

  getUserBookings(uid: string): Observable<Appointment[]>{
  	return this.afstorage.collection<Appointment>('Viewings', ref => 
      ref.where('booker_id', '==', uid)
      .orderBy('timeStamp', 'desc')
      ).valueChanges();
  }

  getUserUnseen(uid: string){
    return this.afstorage.collection<Appointment>('Viewings', ref => 
      ref.where('booker_id', '==', uid)
      .where('host_confirms', '==', false)
      .where('host_declines', '==', false)
      .where('seeker_cancels', '==', false)
      ).valueChanges(); 
  }

  getHostUnseen(uid: string){
    return this.afstorage.collection<Appointment>('Viewings', ref => 
      ref.where('host_id', '==', uid)
      .where('host_confirms', '==', false)
      .where('host_declines', '==', false)
      .where('seeker_cancels', '==', false)
      ).valueChanges();
  }

  initUserBookings(uid: string){
    console.log('Init user bookings...')
    const first =  this.afstorage.collection<Appointment>('Viewings', ref => 
      ref.where('booker_id', '==', uid)
      .orderBy('timeStamp', 'desc')
      .limit(10)
    )

    this.mapAndUpdate(first);

    this.data = this._data.asObservable()
    .scan((acc, val) =>{

      return acc.concat(val)
    })
  }

  moreUserBookings(uid: string){
    const cursor = this.getCursor();
    const more =  this.afstorage.collection<Appointment>('Viewings', ref => 
      ref.where('booker_id', '==', uid)
      .orderBy('timeStamp', 'desc')
      .limit(10)
      .startAfter(cursor)
    )

    this.mapAndUpdate(more)
  }

  getHostBookings(uid: string): Observable<Appointment[]>{
  	return this.afstorage.collection<Appointment>('Viewings', ref => 
      ref.where('host_id', '==', uid)
      .orderBy('timeStamp', 'desc')
      ).valueChanges()
  }

  getUnseenHostBookings(uid: string){
    return this.afstorage.collection<Appointment>('Viewings', ref => 
      ref.where('host_id', '==', uid)
      .where('seen', '==', false)
      ).valueChanges()
  }

  initHostBookings(uid: string){
    console.log('Init host bookings...')
    const first = this.afstorage.collection<Appointment>('Viewings', ref => 
      ref.where('host_id', '==', uid)
         .orderBy('timeStamp', 'desc')
         .limit(10)
      )

    this.mapAndUpdate(first)

    this.data = this._data.asObservable()
    .scan((acc, val) =>{
      return acc.concat(val)
    })
  }

  moreHostBookings(uid: string){
    const cursor = this.getCursor();
    const more =  this.afstorage.collection<Appointment>('Viewings', ref => 
      ref.where('host_id', '==', uid)
      .orderBy('timeStamp', 'desc')
      .limit(10)
      .startAfter(cursor)
    )
    this.mapAndUpdate(more)
  }

  cancelBooking(appointment: Appointment){
    return this.afstorage.collection('Viewings').doc(appointment.appointment_id).set(appointment);
  }

  confirmBooking(appointment: Appointment){
    return this.afstorage.collection('Viewings').doc(appointment.appointment_id).set(appointment);
  }

  seekerCancel(appointment: Appointment){
    return this.afstorage.collection('Viewings').doc(appointment.appointment_id).set(appointment);
  }

  updateBooking(appointment: Appointment){
    return this.afstorage.collection('Viewings').doc(appointment.appointment_id).set(appointment);
  }

  adjustBookings(){
    this.afstorage.collection<Appointment>('Viewings')
    .snapshotChanges()
    .pipe
    (take(1))
    .subscribe(data =>{
      data.forEach(data1 =>{
       let appointment = this.object_init.initializeAppointment2(data1.payload.doc.data());
       appointment.appointment_id = data1.payload.doc.id 
       this.afstorage.collection('Viewings').doc(data1.payload.doc.id).set(appointment)
      })
    })
  }

  reset(){
    console.log('reseting...')
    this._data.next([])
    this._done.next(false);
  }

   // Determines the doc snapshot to paginate query 
  private getCursor() {
    const current = this._data.value
    if (current.length) {
      return current[current.length - 1].doc 
    }
    return null
  }


  // Maps the snapshot to usable format the updates source
  private mapAndUpdate(col: AngularFirestoreCollection<any>) {
    if (this._done.value || this._loading.value) { return };
    // loading
    this._loading.next(true)

    // Map snapshot with doc ref (needed for cursor)
    return col.snapshotChanges()
      .do(arr => {
        let values = arr.map(snap => {
          const data = snap.payload.doc.data()
          const doc = snap.payload.doc
          return { ...data, doc }
        })
  
        // update source with new values, done loading
        this._data.next(values)
        this._loading.next(false)
        console.log('_data: ', this._data.value)
        console.log('data: ', this.data);
        console.log('mapAndUpdate running...')
        // no more values, mark done
        if (!values.length) {
          console.log('done!')
          this._done.next(true)
        }
    })
    .take(1)
    .subscribe()

  }



}
