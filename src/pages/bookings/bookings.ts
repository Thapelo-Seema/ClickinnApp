import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, AlertController, Content, LoadingController} from 'ionic-angular';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { AppointmentsProvider } from '../../providers/appointments/appointments';
import { User } from '../../models/users/user.interface';
import { Appointment } from '../../models/appointment.interface';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
//import { Observable } from 'rxjs-compat';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import { Subscription } from 'rxjs-compat/Subscription';
import { Calendar } from '@ionic-native/calendar';
import * as firebase from 'firebase';
import { CallNumber } from '@ionic-native/call-number';
import { UserSvcProvider } from '../../providers/user-svc/user-svc';
import { take } from 'rxjs-compat/operators/take';
@IonicPage()
@Component({
  selector: 'page-bookings',
  templateUrl: 'bookings.html',
})
export class BookingsPage {
  user: User;
  loadingMore: boolean = true;
  done: boolean = false;
  role: string = '';
  bookingsSub: Subscription = null;
  loadingSub: Subscription;
  doneSub: Subscription;
  contentSubs: Subscription;
  noBookings: boolean = false;
  @ViewChild(Content) content: Content;
  imagesLoaded: boolean[] = 
  [ false, false, false, false, false, false, false, false, false, false,
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
    private loacdingCtrl: LoadingController,
    private callNumber: CallNumber,
    private user_svc: UserSvcProvider
    ){

    //Subscription to the loading boolean observable in the appointments service
    this.loadingSub = this.appt_svc.loading.subscribe(data =>{
      this.loadingMore = data;
    })

    //Subscription to the done boolean observable in the appointments service
    this.doneSub = this.appt_svc.done.subscribe(data =>{
      this.done = data;
      if(data == true) this.loadingMore = false;
    })

  	this.user = this.object_init.initializeUser(); //Initializing an empty user object

    /* Getting the cached user */
  	this.storage.getUser().then(user =>{
  		this.user = this.object_init.initializeUser2(user); //Populating the user
      /*
        If user in the Landlords/agents appointments interface we only fetch the appointments made for the current users adverts,
        otherwise we fetch the appointments that the current user made to view other apartments
      */
      if(this.navCtrl.parent != null || this.navParams.get('selectedTab')){
        this.appt_svc.initHostBookings(user.uid)
        this.role = 'landlord';
        //Perform a once-off subscription to check if data was properly loaded and handle the result appropriately
        this.bookingsSub = this.appt_svc.getHostBookings(user.uid)
        .subscribe(data =>{
          console.log(data)
          /*
            If we get an array of bookings from this request, populate the corresponding imagesLoaded array
          */
          if(data.length > 0){
            data.forEach(dat =>{
              /* Populate an array of booleans which inidcate the 'loaded status' of each picture in an array of pictures being downloaded*/
              this.imagesLoaded.push(false);
            })
          }else{
            this.noBookings = true;
            //this.toast_svc.showToast('There are currently no appointments to show for your property/s');
          } 
        },
        err =>{
          this.toast_svc.showToast(err.message);
        })
      }
      else{
        this.appt_svc.initUserBookings(user.uid)
        this.role = 'user';
        this.bookingsSub = this.appt_svc.getUserBookings(user.uid)
        .subscribe(data =>{
          console.log(data)
          if(data.length > 0){
          }else{
            this.noBookings = true;
            //this.toast_svc.showToast('There are no appointments to show for your profile');
          }
        },
        err =>{
          this.errHandler.handleError(err)
        })
      }
  	})
    .catch(err => {
      this.errHandler.handleError(err)
    })
  }


  /*Unsubscribe from all subscriptions when leaving the page*/
  ionViewWillLeave(){
    this.doneSub.unsubscribe();
    this.loadingSub.unsubscribe();
    this.bookingsSub.unsubscribe();
    this.contentSubs.unsubscribe();
    this.appt_svc.reset();
  }

  ionViewDidLoad(){
    this.monitorEnd();
  }

  callLandlord(uid: string){
    this.toast_svc.showToast('Please note that network charges may apply for making this call...')
    this.user_svc.getUser(uid)
    .pipe(take(1))
    .subscribe(user =>{

      this.callNumber.callNumber(user.phoneNumber, false)
      .catch(err =>{
        this.errHandler.handleError(err)
      })
    })
  }

  callTenant(uid: string){
    this.toast_svc.showToast('Please note that network charges may apply for making this call...')
    this.user_svc.getUser(uid)
    .pipe(take(1))
    .subscribe(user =>{
      this.callNumber.callNumber(user.phoneNumber, false)
      .catch(err =>{
        this.errHandler.handleError(err)
      })
    })
  }

  /*Check if scrolling has reached the bottom of the page and fetch more data */
  monitorEnd(){
    //console.log('Content scrollHeight = ', this.content.scrollHeight)
    this.contentSubs = this.content.ionScrollEnd.subscribe(ev =>{
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

  /*getProperty(prop_id){
    let property: any = null;
      this.accom_svc.getPropertyById(prop_id).pipe(take(1)).subscribe(prop =>{
        property = prop;
      })
    return property;
  }*/

  /* This method handles the declining of an appointment and updates the database if the user confirms the decline */
  declineBooking(appointment: Appointment){
    let app = this.object_init.initializeAppointment2(appointment);
    app.timeStampModified = Date.now();
    app.host_declines = true;
    app.host_confirms = false;
    app.seeker_cancels = false;
    let confirm: boolean = false;
    let alertI = this.alertCtrl.create({
      title: "Decline Appointment",
      message: "Are you sure you want to decline this viewing appointment ?",
      buttons: [
        {
          text: 'Yes decline it',
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
    alertI.present();
    alertI.onDidDismiss(data =>{
      if(confirm == true){
        let ldr = this.loacdingCtrl.create()
        ldr.present();
        console.log(app)
        this.appt_svc.cancelBooking(app)
        .then(() =>{
          ldr.dismiss();
          this.toast_svc.showToast('You have declined this viewing appointment.')
        })
        .catch(err => {
          ldr.dismiss();
          this.errHandler.handleError(err);
        })
      }else{
        this.toast_svc.showToast('Viewing appointment NOT declined.')
      }
    })
  }

  /* This method handles the confirming of an appointment and updates the database */
  confirmBooking(appointment: Appointment){
    let app = this.object_init.initializeAppointment2(appointment);
    app.timeStampModified = Date.now();
    app.host_confirms = true;
    app.host_declines = false;
    app.seeker_cancels = false;
    let confirm: boolean = false;
    let alertI = this.alertCtrl.create({
      title: "Accept Appointment",
      message: "Are you sure you want to accept this viewing appointment ?",
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
    alertI.present();
    alertI.onDidDismiss(data =>{
      if(confirm == true){
        let ldr = this.loacdingCtrl.create();
        ldr.present()
        console.log(app)
        this.appt_svc.confirmBooking(app)
        .then(() =>{
          if(this.platform.is('cordova')){
            //this.toast_svc.showToast("Platform is cordova so we're creating an alarm...");
            this.createCalenderEvent(app);
          }
          ldr.dismiss();
          this.toast_svc.showToast('You have confirmed this viewing appointment.')
        })
        .catch(err => {
          ldr.dismiss()
          this.errHandler.handleError(err)
        })
      }else{
        this.toast_svc.showToast('You did NOT confirm this viewing appointment.')
      }
    })
  }

  /* This method handles the cancellation of an appointment and updates the database */
  seekerCancel(appointment: Appointment){
    let app = this.object_init.initializeAppointment2(appointment);
    app.timeStampModified = Date.now();
    app.seeker_cancels = true;
    app.host_confirms = false;
    app.host_declines = false;
    let confirm: boolean = false;
    let alertI = this.alertCtrl.create({
      title: "Cancel Appointment",
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
    alertI.present();
    alertI.onDidDismiss(data =>{
      if(confirm == true){
        let ldr = this.loacdingCtrl.create();
        ldr.present()
      this.appt_svc.cancelBooking(app)
      .then(() =>{
        ldr.dismiss()
        this.toast_svc.showToast('You have cancelled this booking and the advertiser will no longer be expecting you.')
      })
      .catch(err => {
        ldr.dismiss()
        this.errHandler.handleError(err);
      })
      }else{
        this.toast_svc.showToast('Viewing appointment NOT cancelled.')
      }
    })
  }

  /*
    This method handles sending a message from an appointment context and caches a to-object 
    that represents the recipient of the message
  */
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

  /*This method creates a calender event to remind the landlord/agent about the appointment they have accepted*/
  createCalenderEvent(appointment: Appointment){
    let dateVal: any = appointment.date;
    let date2Val: firebase.firestore.Timestamp = dateVal;
    /*
      Firestrore returns dates as a firebase.firestore.Timestamp which is an object of seconds and nanoseconds
      this needs to be re-cast into a date object so that the calender can handle it
    */
    console.log('About to create an event for: ', date2Val.toDate())
    this.calender.hasReadWritePermission().then(permission =>{
      this.calender.createEvent(
        'Clickinn Viewing Appointment', 
        appointment.address,
        `You have agreed to show the ${appointment.room_type} at ${appointment.address}.`,
        new Date(), 
        date2Val.toDate()
      )
      .then(val => this.toast_svc.showToast('Reminder created for this appointment'))
      .catch(err => {
        this.errHandler.handleError(err)
      })
    },
    denied =>{
      this.toast_svc.showToast('Access denied but creating an alarm again...')
      this.calender.requestReadWritePermission().then(approved =>{
        this.calender.createEvent(
          'Clickinn Viewing Appointment', 
          appointment.address,
          `You have agreed to show the ${appointment.room_type} at ${appointment.address}.`,
          new Date(), 
          date2Val.toDate()
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

}
