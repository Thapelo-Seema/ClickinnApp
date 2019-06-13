import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,  ToastController, 
  AlertController, LoadingController, Platform } from 'ionic-angular';
import { Apartment } from '../../models/properties/apartment.interface';
import { DatePicker } from '@ionic-native/date-picker';
import { Calendar } from '@ionic-native/calendar';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { Appointment } from '../../models/appointment.interface';
import { User } from '../../models/users/user.interface';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { AppointmentsProvider } from '../../providers/appointments/appointments';
import { take } from 'rxjs-compat/operators/take';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations'

/* This page handles the process of the accommodation seeker making an appointment to view an accommodation */

@IonicPage()
@Component({
  selector: 'page-appointment',
  templateUrl: 'appointment.html',
})
export class AppointmentPage {
  apartment: Apartment;
  myDate: Date = null;
  loader = this.loadingCtrl.create();
  appointment: Appointment;
  user: User;
  imageLoaded: boolean = false;
  on_browser: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private datePicker: DatePicker, 
  	private calender: Calendar,
    private storage: LocalDataProvider,
    private toast: ToastController,
    private errHandler: ErrorHandlerProvider,
    private object_init: ObjectInitProvider, 
    private appointment_svc: AppointmentsProvider,
    private accom_svc: AccommodationsProvider,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController, 
    private platform: Platform){
    console.log('Platforms: ', this.platform.platforms());
    this.on_browser = this.onBrowser(this.platform.platforms());
    /*if(this.onBrowser(this.platform.platforms()) == true){
      alert("Running on a broswer");
    }else{
      alert("Running on mobile");
    }*/
    this.loader.setDuration(4000);
    this.loader.present();
    this.apartment = this.object_init.initializeApartment(); //Initialize an empty apartment object
    this.appointment = this.object_init.initializeAppointment(); //Initialize an empty appointment object
    this.user = this.object_init.initializeUser(); //Initialize an empty user object
   
    /* 
      Retrieving the cached apartment and pulling an updated version of it from the firestore database
    */
    if(this.navParams.data != null && this.navParams.data != undefined){
      //Extract apartment and user
      this.apartment = this.navParams.data.apartment;
      //setup the rest of the data
    }else{
      //get apartment and user from storage and setup the rest of the data
    }
    
    this.storage.getApartment().then(cachedApart =>{
      this.accom_svc.getApartmentById(cachedApart.apart_id)
      .pipe(take(1))
      .subscribe(apartment =>{
        this.storage.getUser().then(user => {
          this.user = this.object_init.initializeUser2(user); //Populating the user
          //Populating some fields in the appointment object
          this.appointment.booker_name = user.displayName ? user.displayName : user.firstname;
          this.appointment.booker_id = user.uid;
          this.appointment.bookerDp = user.photoURL ? user.photoURL : 'assets/imgs/placeholder.png'
        }).then(() =>{
          //Populating more fields in the appointment object
          this.imageLoaded = true;
          this.apartment = this.object_init.initializeApartment2(apartment); //Populating the apartment
          this.appointment.apart_id = apartment.apart_id;
          this.appointment.apart_type = apartment.room_type;
          this.appointment.room_type = apartment.room_type;
        })
        .catch(err =>{
          this.errHandler.handleError(err)
        })
      },
      err =>{
        
        this.errHandler.handleError(err);
      })
    }).catch(err => {
      this.errHandler.handleError(err);
    });
  }

  onBrowser(devices: string[]):boolean{
    let browser = false;
    devices.forEach(dev =>{
      if(dev == 'mobileweb' || dev == 'core') browser = true;
    })
    return browser;
  }

  /* This function prompts the user to confirm the appointment and creates the appointment on the database if granted */
  book(){
    let ldr = this.loadingCtrl.create({
      cssClass: 'my-loading-class'
    })
    
    let confirm: boolean = false;
    let alert = this.alertCtrl.create({
      title: "Make Appointment",
      message: "Are you sure you want to make this appointment and that all the details are correct ?",
      buttons: [
        {
          text: 'Yes Make Appointment',
          handler: data =>{
            confirm = true;
          }
        },
        {
          role: 'cancel',
          text: 'Cancel',
          handler: data =>{
            confirm = false;
          }
        }
      ]
    })
    alert.present();
    alert.onDidDismiss(data =>{
      if(confirm){
        ldr.setDuration(2000);
        ldr.present();
        if(this.on_browser == false){
          this.createCalenderEvent();
        }
        this.updateAppointmentVals();
        this.appointment_svc.createBooking(this.appointment).then(data =>{
          this.appointment.appointment_id = data.id;
          this.appointment_svc.updateBooking(this.appointment)
          .then(() =>{
            this.toast.create({
                message: "Appointment successfully created",
                showCloseButton: true,
                  closeButtonText: 'Ok',
                  position: 'middle',
                  cssClass: 'toast_margins full_width'
            }).present()
          })
          .catch(err =>{
            this.errHandler.handleError(err);
          }) 
        }).catch(err => {
          this.errHandler.handleError(err);
        })
      }else{
        this.toast.create({
                message: "Appointment not created",
                showCloseButton: true,
                  closeButtonText: 'Ok',
                  position: 'middle',
                  cssClass: 'toast_margins full_width'
        }).present()
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
    this.appointment.address = this.apartment.property.address.description;
    this.appointment.apart_dp = this.apartment.dP.url;
    this.appointment.timeStamp = Date.now();
    this.appointment.timeStampModified = Date.now();
  }
 
  /*This method handles the presenting of the native android date-time app and saves the date in myDate */
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
    })
  }

  /* This method takes the value of myDate and writes a custom calender event to an android fone */
  createCalenderEvent(){
  	this.calender.hasReadWritePermission().then(permission =>{
  		this.calender.createEvent(
        'Clickinn Viewing Appointment', 
  		  this.returnFirstTwo(this.apartment.property.address.description),
  		  `You requested to view the ${this.apartment.room_type} at ${this.returnFirstTwo(this.apartment.property.address.description)}.`,
  		  new Date(), 
        this.myDate
  		)
  	},
  	denied =>{
  		this.calender.requestReadWritePermission().then(approved =>{
  			this.calender.createEvent(
          'Clickinn Viewing Appointment', 
	  		  this.returnFirstTwo(this.apartment.property.address.description),
	  		  `You requested to view the ${this.apartment.room_type} at ${this.returnFirstTwo(this.apartment.property.address.description)}.`,
	  		  new Date(), 
          this.myDate
	  		)
  		},
  		err =>{
  			this.errHandler.handleError(err);
  		})
  	})
    .catch(err => {
      this.errHandler.handleError(err);
    })
  }

  /* This function delegates the tasks of showing the date-time picker and creating the calender event once the datePicker closes */
  makeAppointment(){
  	this.showDatePicker().then(() => {
      if(this.myDate) this.book();
    })
    .catch(err => {
      this.errHandler.handleError(err);
    })
  }

  //This helper function returns the first two strings in a comma delimited string array
  returnFirstTwo(input: string): string{
    if(input == undefined) return '';
    return input.split(',')[0] + ', ' + input.split(',')[1];
  }

}
