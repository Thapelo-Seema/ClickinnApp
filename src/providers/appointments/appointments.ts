//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Address } from '../../models/location/address.interface';
import { Observable } from 'rxjs-compat';
import { AngularFirestore } from 'angularfire2/firestore';
//import { MapsProvider } from '../maps/maps';
import { Property } from '../../models/properties/property.interface';
import { Apartment } from '../../models/properties/apartment.interface';
//import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Search } from '../../models/search.interface';
import { Image } from '../../models/image.interface';
import { User } from '../../models/users/user.interface';
import { Appointment } from '../../models/appointment.interface';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/take';
import { take } from 'rxjs-compat/operators/take';
import { ObjectInitProvider } from '../object-init/object-init';

@Injectable()
export class AppointmentsProvider {
  appointment: Appointment;
  constructor(private afstorage: AngularFirestore, private object_init: ObjectInitProvider){}

  createBooking(appointment: Appointment){
    return this.afstorage.collection<Appointment>('Viewings').add(appointment)
  }

  getUserBookings(uid: string): Observable<Appointment[]>{
  	let hostApps = this.afstorage.collection<Appointment>('Viewings', ref => ref.where('host_id', '==', uid)).valueChanges();
    let seekerApps = this.afstorage.collection<Appointment>('Viewings', ref => ref.where('booker_id', '==', uid)).valueChanges();
  	return hostApps.merge(seekerApps);
  }

  getHostBookings(uid: string): Observable<Appointment[]>{
  	return this.afstorage.collection<Appointment>('Viewings', ref => ref.where('host_id', '==', uid)).valueChanges()
  }

  cancelBooking(appointment: Appointment){
    return this.afstorage.collection('Viewings').doc(appointment.appointment_id).set(appointment);
  }

  confirmBooking(appointment: Appointment){
    return this.afstorage.collection('Viewings').doc(appointment.appointment_id).set(appointment);
  }

  updateBooking(appointment: Appointment){
    return this.afstorage.collection('Viewings').doc(appointment.appointment_id).set(appointment);
  }

  adjustBookings(){
    this.afstorage.collection<Appointment>('Viewings')
    .snapshotChanges()
    .take(1)
    .subscribe(data =>{
      data.forEach(data1 =>{
       let appointment = this.object_init.initializeAppointment2(data1.payload.doc.data());
       appointment.appointment_id = data1.payload.doc.id 
       this.afstorage.collection('Viewings').doc(data1.payload.doc.id).set(appointment)
      })
      
    })
  }



}
