import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, AlertController, Content } from 'ionic-angular';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { AppointmentsProvider } from '../../providers/appointments/appointments';
import { User } from '../../models/users/user.interface';
import { Appointment } from '../../models/appointment.interface';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { Observable } from 'rxjs-compat';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
//import { MessageInputPopupPage } from '../message-input-popup/message-input-popup';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import { Subscription } from 'rxjs-compat/Subscription';
import { Calendar } from '@ionic-native/calendar';
import * as firebase from 'firebase';
import { PaginationProvider } from '../../providers/pagination/pagination';

 
@IonicPage()
@Component({
  selector: 'page-bookings',
  templateUrl: 'bookings.html',
})
export class BookingsPage {
  appointments: Observable<Appointment[]> = null;
  user: User;
  loading: boolean = false;
  loadingMore: boolean = false;
  done: boolean = false;
  role: string = '';
  bookingsSub: Subscription = null;
  @ViewChild(Content) content: Content;
  imagesLoaded: boolean[] = 
      [false, false, false, false, false, false, false, false, false, false,
       false, false, false, false, false, false, false, false, false, false, 
       false,false, false, false, false, false, false, false, false, false,
       false,false, false, false, false, false, false, false, false, false,
       false,false, false, false, false, false, false, false, false, false
       ];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private appt_svc: AppointmentsProvider,
  	private object_init: ObjectInitProvider, 
    private storage: LocalDataProvider, 
    private toast_svc: ToastSvcProvider,
    private modal: ModalController,
    private accom_svc: AccommodationsProvider,
    private calender: Calendar,
    private errHandler: ErrorHandlerProvider,
    private platform: Platform,
    private alertCtrl: AlertController,
    private page: PaginationProvider
    ){

    this.loading = true;
    this.appt_svc.loading.subscribe(data =>{
      this.loadingMore = data;
    })
    this.appt_svc.done.subscribe(data =>{
      this.done = data;
      if(data == true) this.loadingMore = false;
    })
  	this.user = this.object_init.initializeUser();
  	this.storage.getUser().then(user =>{
      console.log('cached user: ', user)
  		this.user = user; 
      if(this.navCtrl.parent != null){//This means you're in the Landlords/agents appointments interface
        this.appointments = null;
        this.appointments = this.appt_svc.getHostBookings(user.uid);
        //if(this.appt_svc.data)this.appt_svc.reset();
        this.appt_svc.initHostBookings(user.uid)
        this.role = 'landlord';
        //Perform a once-off subscription to check if data was properly loaded and handle the result appropriately
        this.bookingsSub = this.appt_svc.getHostBookings(user.uid)
        .subscribe(data =>{
          console.log(data);
          if(data.length > 0){
            data.forEach(dat =>{
              this.imagesLoaded.push(false);
            })
            this.loading = false;
          }else{
            this.toast_svc.showToast('You are offline OR There are no appointments to show for your property/s');
            this.loading = false;
          } 
        })
      }else if(this.navParams.get('selectedTab')){
        console.log(navParams)
        this.appointments = null;
        //if(this.appt_svc.data)this.appt_svc.reset();
        this.appt_svc.initHostBookings(user.uid)
        this.appointments = this.appt_svc.getHostBookings(user.uid);
        this.role = 'landlord';
        //Perform a once-off subscription to check if data was properly loaded and handle the result appropriately
        this.bookingsSub = this.appt_svc.getHostBookings(user.uid)
        .subscribe(data =>{
          console.log(data);
          if(data.length > 0){
            this.loading = false;
          }else{
            this.toast_svc.showToast('You are offline OR There are no appointments to show for your property/s');
            this.loading = false;
          } 
        })
      }
      else{
        this.appointments = null;
        //if(this.appt_svc.data)this.appt_svc.reset();
        this.appt_svc.initUserBookings(user.uid)
        this.appointments = this.appt_svc.getUserBookings(user.uid);
        this.role = 'user';
        this.bookingsSub = this.appt_svc.getUserBookings(user.uid)
        .subscribe(data =>{
          console.log(data)
          if(data.length > 0){
            this.loading = false;
          }else{
            this.toast_svc.showToast('You are offline OR There are no appointments to show for your profile');
            this.loading = false;
          }
        })
      }
  	})
  }

  ionViewDidLeave(){
    this.bookingsSub.unsubscribe();
    this.appt_svc.reset();
  }

  ionViewDidLoad(){
    this.monitorEnd();
  }

 monitorEnd(){
    //console.log('Content scrollHeight = ', this.content.scrollHeight)
    this.content.ionScrollEnd.subscribe(ev =>{
    let height = ev.scrollElement.scrollHeight;
    let top = ev.scrollElement.scrollTop;
    let offset = ev.scrollElement.offsetHeight;
      if(top > height - offset - 1){
        if(this.role == 'user'){
          this.appt_svc.moreUserBookings(this.user.uid)
        }else if(this.role == 'landlord'){
          this.appt_svc.moreHostBookings(this.user.uid)
        }
        
      }
    })
  }

  getProperty(prop_id){
    let property: any = null;
      this.accom_svc.getPropertyById(prop_id).subscribe(prop =>{
        property = prop;
      })
    return property;
  }

  declineBooking(appointment: Appointment){
    let app = appointment;
    app.host_declines = true;
    app.host_confirms = false;
    app.seeker_cancels = false;
    let confirm: boolean = false;
    let alert = this.alertCtrl.create({
      title: "Decline appointment",
      message: "Are you sure you want to decline this viewing appointment ?",
      buttons: [
        {
          text: 'Yes cancel',
          handler: data =>{
            confirm = true;
          }
        },
        {
          role: 'cancel',
          text: 'Not sure',
          handler: data =>{
            confirm = false;
          }
        }
      ]
    })
    alert.present();
    alert.onDidDismiss(data =>{
      if(confirm){
        this.appt_svc.cancelBooking(app)
        .then(() =>{
          this.toast_svc.showToast('You have declined this viewing appointment.')
        })
        .catch(err => console.log(err))
      }else{
        this.toast_svc.showToast('Viewing appointment NOT declined.')
      }
      })
    
  }

  confirmBooking(appointment: Appointment){
    let app = appointment;
    app.host_confirms = true;
    app.host_declines = false;
    app.seeker_cancels = false;
    let confirm: boolean = false;
    let alert = this.alertCtrl.create({
      title: "Confirm appointment",
      message: "Are you sure you want to accept this booking ?",
      buttons: [
        {
          text: 'Accept',
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
      this.appt_svc.confirmBooking(app)
      .then(() =>{
        if(this.platform.is('cordova')){
          //this.toast_svc.showToast("Platform is cordova so we're creating an alarm...");
          this.createCalenderEvent(app);
        }
        this.toast_svc.showToast('You have confirmed this viewing appointment.')
      })
      .catch(err => console.log(err))
    }else{
      this.toast_svc.showToast('You did NOT confirm this viewing appointment.')
    }
    })
    
  }

  seekerCancel(appointment: Appointment){
    let app = appointment;
    app.seeker_cancels = true;
    app.host_confirms = false;
    app.host_declines = false;
    let confirm: boolean = false;
    let alert = this.alertCtrl.create({
      title: "Cancel appointment",
      message: "Are you sure you want to cancel this appointment ?",
      buttons: [
        {
          text: 'Yes cancel',
          handler: data =>{
            confirm = true;
          }
        },
        {
          role: 'cancel',
          text: 'Not sure',
          handler: data =>{
            confirm = false;
          }
        }
      ]
    })
    alert.present();
    alert.onDidDismiss(data =>{
      if(confirm){
      this.appt_svc.cancelBooking(app)
      .then(() =>{
        this.toast_svc.showToast('You have cancelled this booking and the advertiser will no longer be expecting you.')
      })
      .catch(err => console.log(err))
    }else{
      this.toast_svc.showToast('Viewing appointment NOT cancelled.')
    }
    })
    
  }

  showInput(appointment: Appointment){
    let to: any;
    if(this.role == 'landlord'){
      to = {
        uid: appointment.booker_id,
        dp : appointment.bookerDp,
        name: appointment.booker_name ? appointment.booker_name : '',
        topic: `Regarding your appointment to see the ${appointment.room_type} in ${appointment.address}`
      }
    }else if(this.role == 'user'){
      to = {
        uid: appointment.host_id,
        dp : appointment.apart_dp,
        name: appointment.host_name ? appointment.host_name : '',
        topic: `Regarding the appointment to see the ${appointment.room_type} at ${appointment.address}` 
      }
    }
    this.storage.setMessageDetails(to).then(val =>{
      this.modal.create('MessageInputPopupPage', to).present();
    })
  }

  createCalenderEvent(appointment: Appointment){
    let dateVal: any = appointment.date;
    let date2Val: firebase.firestore.Timestamp = dateVal;
    console.log('About to create an event for: ', date2Val.toDate())
    this.calender.hasReadWritePermission().then(permission =>{
      
      this.calender.createEvent(
        'Clickinn Viewing Appointment', 
        '',
        `You have agreed to show the ${appointment.room_type} at ${appointment.address}.`,
        new Date(), 
        date2Val.toDate()
      )
      .then(val => this.toast_svc.showToast('Reminder created for this appointment'))
      .catch(err => console.log(err))
    },
    denied =>{
      this.toast_svc.showToast('Access denied but creating an alarm again...')
      this.calender.requestReadWritePermission().then(approved =>{
        this.calender.createEvent(
          'Clickinn Viewing Appointment', 
          '',
          `You have agreed to show the ${appointment.room_type} at ${appointment.address}.`,
          new Date(), 
          date2Val.toDate()
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

}
