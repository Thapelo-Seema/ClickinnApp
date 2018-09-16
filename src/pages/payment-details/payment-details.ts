import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
import { User } from '../../models/users/user.interface';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { AlertPage } from '../alert/alert';
import { Apartment } from '../../models/properties/apartment.interface';
import { Calendar } from '@ionic-native/calendar';
import { AngularFirestore } from 'angularfire2/firestore';
//import { AngularFireAuth } from 'angularfire2/auth';
import { Appointment } from '../../models/appointment.interface';
import { ConfirmationPage } from '../confirmation/confirmation';
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
    this.apartment = this.object_init.initializeApartment();
    this.appointment = this.object_init.initializeAppointment();
    this.user = this.object_init.initializeUser();
  	this.payment_method = this.navParams.get('payment_method');
    this.loading = true;
    this.storage.getApartment().then(data =>{
      this.afs.collection("Apartments").doc<Apartment>(data.apart_id).valueChanges().subscribe(apartment =>{
        this.storage.getUser().then(data => this.user = data).then(() =>{
          this.apartment = apartment;
          this.loading = false;
        })
      },
      err =>{
        this.errHandler.handleError(err);
        this.loading = false;
      })
      
    }).catch(err => {
      this.errHandler.handleError(err);
      this.loading = false;
    });
  }

  
  generateRef(){
   
  }

  pay(){

  }

  showWarnig(title: string, message: string){
    const myData = {
      title: title,
      message: message
    }
    let warningModal = this.confirmCtrl.create(AlertPage, {data: myData})
    warningModal.present();
  }

  handleError(err){
    console.log(err.message);
      this.loading = true;
      this.toast.create({
        message: err.message,
        showCloseButton: true,
          closeButtonText: 'Ok',
          position: 'top',
          cssClass: 'toast_margins full_width'
    }).present()
  }

   book(){ 
    this.loading = true;
    this.promptConfirmation();
  }

  promptConfirmation(){
    const myData = {
      title: "Confirm appointment",
      message: "Please confirm that your viewing appointment details are correct"
    }
    let warningModal = this.confirmCtrl.create(ConfirmationPage, {data: myData})
    warningModal.present();
    warningModal.onDidDismiss(data =>{
      if(data == true){
        this.makeAppointment();
        this.updateAppointmentVals();
        this.afs.collection('Viewings').add(this.appointment).then(data =>{
            this.toast.create({
                message: "Appointment successfully created",
                showCloseButton: true,
                  closeButtonText: 'Ok',
                  position: 'middle',
                  cssClass: 'toast_margins full_width'
            }).present()
            this.loading = false;
        }).catch(err => {
          this.errHandler.handleError(err);
          this.loading = false;
        })
      }else{
        this.toast.create({
                message: "Appointment cancelled",
                showCloseButton: true,
                  closeButtonText: 'Ok',
                  position: 'middle',
                  cssClass: 'toast_margins full_width'
        }).present()
        this.loading = false;
      }
    })
  }

  updateAppointmentVals(){
    this.appointment.prop_id = this.apartment.prop_id;
    this.appointment.apart_id = this.apartment.apart_id;
    this.appointment.booker_id = this.user.uid;
    this.appointment.host_id = this.apartment.property.user_id;
    this.appointment.date = this.myDate;
    this.appointment.timeStamp = Date.now();
  }

  showDatePicker(): Promise<void>{
    return this.datePicker.show({
    date: new Date(),
    mode: 'datetime',
    androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    })
    .then(date => {
        this.myDate = date;
    })
    .catch(err => {
          this.errHandler.handleError(err);
          this.loading = false;
    })
  }

  createCalenderEvent(){
    this.calender.hasReadWritePermission().then(permission =>{
      this.calender.createEvent(
        'Clickinn Viewing Appointment', 
        this.apartment.property.address.sublocality_lng,
        `You requested to view the ${this.apartment.room_type} at ${this.apartment.property.address.description}.`,
        new Date(), 
        this.myDate
      )
    },
    denied =>{
      this.calender.requestReadWritePermission().then(approved =>{
        this.calender.createEvent(
          'Clickinn Viewing Appointment', 
          this.apartment.property.address.sublocality_lng,
          `You requested to view the ${this.apartment.room_type} at ${this.apartment.property.address.description}.`,
          new Date(), 
          this.myDate
        )
      },
      err =>{
        this.errHandler.handleError(err);
        this.loading = false;
      })
    })
    .catch(err => {
          this.errHandler.handleError(err);
          this.loading = false;
    })
  }

  makeAppointment(){
    this.showDatePicker().then(() => {
      if(this.myDate) this.createCalenderEvent();
    })
    .catch(err => {
      this.errHandler.handleError(err);
      this.loading = false;
    })
  }


}
