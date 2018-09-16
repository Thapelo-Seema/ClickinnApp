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

@IonicPage()
@Component({
  selector: 'page-bookings',
  templateUrl: 'bookings.html',
})
export class BookingsPage {
  appointments: Observable<Appointment[]>;
  user: User;
  constructor(public navCtrl: NavController, public navParams: NavParams, private appt_svc: AppointmentsProvider,
  	private object_init: ObjectInitProvider, private storage: LocalDataProvider, private toast_svc: ToastSvcProvider,
    private modal: ModalController){
  	this.user = this.object_init.initializeUser();
  	this.storage.getUser().then(user =>{
  		this.user = user;
  		this.appointments = this.appt_svc.getUserBookings(user.uid);
      this.appt_svc.getUserBookings(user.uid).subscribe(data =>{
        console.log(data);
      })
  	})
  	
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookingsPage');
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

  showInput(search){
    this.modal.create(MessageInputPopupPage, search).present();
  }

}
