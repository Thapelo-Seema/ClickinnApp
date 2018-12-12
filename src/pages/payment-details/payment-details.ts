import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
import { User } from '../../models/users/user.interface';
import { LocalDataProvider } from '../../providers/local-data/local-data';
//import { AlertPage } from '../alert/alert';
import { Apartment } from '../../models/properties/apartment.interface';
import { Calendar } from '@ionic-native/calendar';
import { AngularFirestore } from 'angularfire2/firestore';
//import { AngularFireAuth } from 'angularfire2/auth';
import { Appointment } from '../../models/appointment.interface';
//import { ConfirmationPage } from '../confirmation/confirmation';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { ObjectInitProvider } from '../../providers/object-init/object-init';

/**
 * Generated class for the PaymentDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment-details',
  templateUrl: 'payment-details.html',
})
export class PaymentDetailsPage {

  bank: string = '';
  payment_method: string = '';
  myDate: Date = null;
  refference: string = '';
  loading: boolean = false;
  apartment: Apartment;
  appointment: Appointment;
  user: User;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private datePicker: DatePicker,
   private confirmCtrl: ModalController, private storage: LocalDataProvider, private toast: ToastController,
   private errHandler: ErrorHandlerProvider, private calender: Calendar, private afs: AngularFirestore, 
   private object_init: ObjectInitProvider){
    
  }

  
  generateRef(){
   
  }

  pay(){

  }

}
