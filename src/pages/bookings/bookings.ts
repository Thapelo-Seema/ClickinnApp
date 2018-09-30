import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { AppointmentsProvider } from '../../providers/appointments/appointments';
import { User } from '../../models/users/user.interface';
import { Appointment } from '../../models/appointment.interface';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { Observable } from 'rxjs-compat';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
import { MessageInputPopupPage } from '../message-input-popup/message-input-popup';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';

 
@IonicPage()
@Component({
  selector: 'page-bookings',
  templateUrl: 'bookings.html',
})
export class BookingsPage {
  appointments: Observable<Appointment[]>;
  user: User;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private appt_svc: AppointmentsProvider,
  	private object_init: ObjectInitProvider, 
    private storage: LocalDataProvider, 
    private toast_svc: ToastSvcProvider,
    private modal: ModalController,
    private accom_svc: AccommodationsProvider
    ){
  	this.user = this.object_init.initializeUser();
  	this.storage.getUser().then(user =>{
  		this.user = user;
  		this.appointments = this.appt_svc.getUserBookings(user.uid);
      this.appt_svc.getUserBookings(user.uid).subscribe(data =>{
        console.log(data);
      })
  	})
  	
  }

  ionViewDidLoad(){
  }

  getProperty(prop_id){
    let property: any = null;
      this.accom_svc.getPropertyById(prop_id).subscribe(prop =>{
        property = prop;
      })
    return property;
  }

  getAdress(prop_id){
    let adress = '';
    this.getProperty(prop_id).then(data =>{
      adress = data;
    })

  }

  getApart(apart_id){

  }

  getUser(uid){

  }

  cancelBooking(appointment: Appointment){
    this.appt_svc.cancelBooking(appointment)
    .then(() =>{
      this.toast_svc.showToast('You have cancelled this booking.')
    })
    .catch(err => console.log(err))
  }

  confirmBooking(appointment: Appointment){
    this.appt_svc.confirmBooking(appointment)
    .then(() =>{
      this.toast_svc.showToast('You have confirmed this booking.')
    })
    .catch(err => console.log(err))
  }

  showInput(appointment: Appointment){
    let to = {
      uid: appointment.booker_id,
      dp : appointment.bookerDp,
      name: appointment.booker_name 
    }
    this.modal.create(MessageInputPopupPage, to).present();
  }

}
