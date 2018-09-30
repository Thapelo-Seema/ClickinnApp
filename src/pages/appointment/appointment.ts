import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { Apartment } from '../../models/properties/apartment.interface';
import { DatePicker } from '@ionic-native/date-picker';
import { Calendar } from '@ionic-native/calendar';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { AngularFirestore } from 'angularfire2/firestore';
//import { AngularFireAuth } from 'angularfire2/auth';
import { Appointment } from '../../models/appointment.interface';
import { User } from '../../models/users/user.interface';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { ConfirmationPage } from '../confirmation/confirmation';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { AppointmentsProvider } from '../../providers/appointments/appointments';


@IonicPage()
@Component({
  selector: 'page-appointment',
  templateUrl: 'appointment.html',
})
export class AppointmentPage {
  apartment: Apartment;
  myDate: Date = null;
  loading: boolean = false;
  appointment: Appointment;
  user: User;

  constructor(public navCtrl: NavController, public navParams: NavParams, private datePicker: DatePicker, 
  	private calender: Calendar, private confirmtCtrl: ModalController, private storage: LocalDataProvider,
    private toast: ToastController, private afs: AngularFirestore, private errHandler: ErrorHandlerProvider,
    private object_init: ObjectInitProvider, private appointment_svc: AppointmentsProvider){	
    this.apartment = this.object_init.initializeApartment();
    this.appointment = this.object_init.initializeAppointment();
    this.user = this.object_init.initializeUser();
    this.loading = true;
    this.storage.getApartment().then(data =>{
      this.afs.collection("Apartments").doc<Apartment>(data.apart_id).valueChanges().subscribe(apartment =>{
        this.storage.getUser().then(data => {
          this.user = data;
          this.appointment.booker_name = data.displayName ? data.displayName : data.firstname;
          this.appointment.booker_id = data.uid;
          this.appointment.bookerDp = data.photoURL ? data.photoURL : 'assets/imgs/placeholder.png'
        }).then(() =>{
          this.apartment = apartment;
          this.appointment.apart_id = apartment.apart_id;
          this.appointment.apart_type = apartment.room_type;
          this.appointment.room_type = apartment.room_type;
           
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

  book(){ 
    this.loading = true;
  	this.promptConfirmation();
  }

  promptConfirmation(){
    const myData = {
      title: "Confirm appointment",
      message: "Please confirm that your viewing appointment details are correct"
    }
    let warningModal = this.confirmtCtrl.create(ConfirmationPage, {data: myData})
    warningModal.present();
    warningModal.onDidDismiss(data =>{
      if(data == true){
        this.createCalenderEvent();
        this.updateAppointmentVals();
        this.appointment_svc.createBooking(this.appointment).then(data =>{
          this.appointment.appointment_id = data.id;
          this.appointment_svc.updateBooking(this.appointment)
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
    this.appointment.bookerDp = this.user.photoURL ? this.user.photoURL : 'assets/imgs/placeholder.png'
    this.appointment.booker_name = this.user.displayName ? this.user.displayName : this.user.firstname;
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
