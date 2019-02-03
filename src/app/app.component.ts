import { Component, ViewChild} from '@angular/core';
import { Platform, ToastController, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { LocalDataProvider } from '../providers/local-data/local-data';
import { AngularFirestore } from 'angularfire2/firestore';
import { User } from '../models/users/user.interface';
import { AngularFireAuth } from 'angularfire2/auth';
import { ErrorHandlerProvider } from '../providers/error-handler/error-handler';
import { FcmProvider } from '../providers/fcm/fcm' ;
import { ObjectInitProvider } from '../providers/object-init/object-init';
import { take } from 'rxjs-compat/operators/take';
import { Push, PushOptions, PushObject } from '@ionic-native/push';
import { Thread } from '../models/thread.interface';
import { DepositProvider } from '../providers/deposit/deposit';
import { Subscription } from 'rxjs-compat/Subscription';
import { SearchfeedProvider } from '../providers/searchfeed/searchfeed';
//import { AccommodationsProvider } from '../providers/accommodations/accommodations';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  user: User;
  pushSubs: Subscription;
  regSubs: Subscription;
  errSubs: Subscription;
  authSubs: Subscription;
  online: boolean = false;
  dpLoaded: boolean = false;
  loader = this.loadingCtrl.create({
    dismissOnPageChange: true
  });
  notificationObject: any = null;
  @ViewChild('content') navCtrl;

  //Check network status
    //if connected check authState
      //if authenticated --> sync user data
        //if user tenant -->home
        //else if seeker --> welcome
      //else -->login
    //if not connected
      //if local user object
        //if tenant -->home
        //else if seeker -->welcome
      //else --> login

  constructor(
    private storage: LocalDataProvider, 
    private afs: AngularFirestore, 
    private afAuth: AngularFireAuth, 
    private platform: Platform, 
    private errHandler: ErrorHandlerProvider, 
    private fcm: FcmProvider, 
    private toastCtrl: ToastController,
    private object_init: ObjectInitProvider,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private push: Push,
    private alertCtrl: AlertController,
    private deposit_svc: DepositProvider,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private searchfeed_svc: SearchfeedProvider
    //private accom_svc: AccommodationsProvider
    //private events: Events
    ){
    this.loader.present();
    //Check for platform readiness before doing anything
    this.platform.ready()
    .then(() =>{
      console.log('platform ready')
      //firestore required setting
      afs.firestore.settings({timestampsInSnapshots: true});
      this.initializeUser();
      //this.initializeApp();
    })
    .then(() => this.monitorAuthState())
    .then(() => {
      this.monitorConnectionState();
      this.monitorOfflineState();
    })
    .catch(err =>{
      console.log('theres an error...')
      this.loader.dismiss();
      this.errHandler.handleError(err);
    })
  }

  ngOnDestroy(){
  }
  
  //Function that handles notifications
  initNotifications(){
    const options: PushOptions = {
     android: {
       senderID: '882290923419'
     },
     ios: {
         alert: 'true',
         badge: true,
         sound: 'true'
     },
     windows: {},
     browser: {
        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
     }
    };
    const pushObject: PushObject = this.push.init(options);
    
    this.pushSubs = pushObject.on('notification').subscribe((notification: any) => {
     // alert(notification.additionalData.deposit_id) 
      if(this.notificationObject != null){
        if(this.compareNotification(notification, this.notificationObject) == false){
          this.notificationObject = notification; 
          if (notification.additionalData.foreground){
              // if application open, show popup
              if(notification.additionalData.key_code == 'new_message'){
                let modal = this.modalCtrl.create('ConfirmationPage', 
                  {title: notification.title, message: notification.message, thread_id: notification.additionalData.thread_id}, 
                  {showBackdrop: false})
                modal.present()
                setTimeout(() =>{
                  modal.dismiss();
                }, 9000)
              }else{
                let notifAlert = this.alertCtrl.create({
                  title: notification.title,
                  subTitle: notification.message,
                  cssClass: "notification",
                  buttons: [{
                      text: 'View',
                      role: 'cancel',
                      handler: () => {
                        //TODO: Your logic here
                        this.routeToNotificationSource(notification.additionalData.key_code, 
                          notification.additionalData.thread_id,
                          notification.additionalData.deposit_id, notification.message);  
                      }
                  }]
                });
                notifAlert.present();
              }
          }else {
            //if user NOT using app and push notification comes - NOT working, redirect to default rootPage
            this.routeToNotificationSource(
              notification.additionalData.key_code, 
              notification.additionalData.thread_id, 
              notification.additionalData.deposit_id, 
              notification.message
            );
          }
        }
      }else{
        this.notificationObject = notification; 
        if(notification.additionalData.foreground){
            // if application open, show popup
            if(notification.additionalData.key_code == 'new_message'){
                let modal = this.modalCtrl.create('ConfirmationPage', 
                  {title: notification.title, message: notification.message, thread_id: notification.additionalData.thread_id}, 
                  {showBackdrop: false})
                modal.present()
                setTimeout(() =>{
                  modal.dismiss();
                }, 9000)
              }else{
                let notifAlert = this.alertCtrl.create({
                  title: notification.title,
                  subTitle: notification.message,
                  cssClass: "notification",
                  buttons: [{
                      text: 'View',
                      role: 'cancel',
                      handler: () => {
                        //TODO: Your logic here
                        this.routeToNotificationSource(
                          notification.additionalData.key_code, 
                          notification.additionalData.thread_id,
                          notification.additionalData.deposit_id, 
                          notification.message
                        );  
                      }
                  }]
                });
                notifAlert.present();
              }
        }else {
          //if user NOT using app and push notification comes - NOT working, redirect to default rootPage
          this.routeToNotificationSource(
            notification.additionalData.key_code, 
            notification.additionalData.thread_id, 
            notification.additionalData.deposit_id, 
            notification.message
          );
        }
      }
      
    });

    this.regSubs = pushObject.on('registration').subscribe((registration: any) => {
      this.fcm.saveTokenToFirestore(registration.registrationId)
    });

    this.errSubs = pushObject.on('error').subscribe(error => console.log(error));
  }

  routeToNotificationSource(key_code: string, thread_id?: string, deposit_id?: string, message?: string){
      switch (key_code) {
        case "new_message":
          this.gotoThread(thread_id)
          break;
        case "seeker_appointment":
          this.gotoHostBookings()
          break;
        case "host_confirmed":
          this.gotoBookings()
          break;
        case "host_declined":
          this.gotoBookings()
          break;
        case "seeker_cancelled":
          this.gotoHostBookings()
          break;
        case "agent_deposit_goAhead":
          this.gotoSeekerConfirmDeposit(deposit_id)
          break;
        case "host_accept_deposit":
          this.gotoHostAcceptDeposit(deposit_id)
          break;
        case "clickinn_confirmed_deposit":
          this.gotoDepositInfo(deposit_id, key_code)
          break;
        case "tenant_confirmed_deposit":
          this.gotoDepositInfo(deposit_id, key_code)
          break;
        case "tenant_cancelled_deposit":
          this.gotoDepositInfo(deposit_id, key_code)
          break;
        case "agent_confirmed_deposit":
          this.gotoDepositInfo(deposit_id, key_code)
          break;
        case "landlord_proposal_agreed":
          this.gotoMyLandlords(message)
          break;
        case "landlord_proposal_declined":
          this.gotoMyLandlords(message)
          break;
        case "agent_proposal_cancelled":
          this.gotoMyAgents(message)
          break;
      }
  }

  //Change the users authState, remove the users local copy
  logout(){
    this.searchfeed_svc.unsubscribe();
    this.pushSubs.unsubscribe();
    this.errSubs.unsubscribe();
    this.regSubs.unsubscribe();
    this.authSubs.unsubscribe();
    let ldr = this.loadingCtrl.create()
    ldr.present();
    this.navCtrl.setRoot('LoginPage')
    .then(() =>{
      ldr.dismiss();
      this.afAuth.auth.signOut()
    })  
  }
  //Navigate to the upload and earn page
  uploadAndEarn(){
    this.navCtrl.push('UploadAndEarnPage')
  }

  //Navigate to the users profile
  gotoProfile(){
    this.navCtrl.push('ProfilePage')
  }

  gotoAgentDash(){
    this.navCtrl.push('AgentDashboardPage')
  }

  gotoBursaryDash(){
    this.navCtrl.push('BursaryPlacementsPage')
  }

  gotoCaretakerDash(){
    this.navCtrl.push('CaretakerManagerDashboardPage')
  }

  gotoLandlordDash(){
    this.navCtrl.push('LandlordDashboardPage')
  }

  gotoDeposits(){
    this.navCtrl.push('DepositsPage')
  }

  gotoChats(){
    this.navCtrl.push('ChatsPage')
  }

  gotoSupport(){
    this.navCtrl.push('SupportPage')
  }

  gotoSupportAdmin(){
    this.navCtrl.push('SupportAdminPage')
  }

  gotoBookings(){
    this.navCtrl.push('BookingsPage')
  }

  gotoMyAgents(message: string){
    this.navCtrl.push('MyAgentsPage', {msg: message})
  }

  gotoMyLandlords(message: string){
    this.navCtrl.push('MyLandlordsPage', {msg: message})
  }

  compareNotification(noti1, noti2): boolean{
    if((noti1.title == noti2.title) && 
      (noti1.message == noti2.message) &&
      (noti1.additionalData.key_code == noti2.additionalData.key_code)) return true
      else return false;
  }

  gotoHostAcceptDeposit(deposit_id: string){
    this.storage.setTransactionState({type: 'host_accept_deposit', id: deposit_id})
    .then(dat =>{
      this.navCtrl.push('DepositConfirmationPage')
    })
  }

  gotoSeekerConfirmDeposit(deposit_id: string){
    this.storage.setTransactionState({type: 'seeker_confirm_deposit', id: deposit_id})
    .then(dat =>{
      this.navCtrl.push('DepositConfirmationPage')
    })
  }

  gotoThread(thread_id: string){
    let thread: Thread = {
      uid: '',
      thread_id: thread_id,
      dp: '',
      displayName: ''
    }
    this.storage.setThread(thread).then(val =>{
      this.navCtrl.push('ChatThreadPage', thread)
    })
    .catch(err => console.log(err))
  }

  gotoHostBookings(){
    this.navCtrl.push('BookingsPage', {selectedTab: 2})
  }

  gotoOwners(){
    this.navCtrl.push('OwnersDashboardPage')
  }

  gotoDepositInfo(deposit_id: string, code: string){
    let message: string = '';
    let title: string = '';
    this.deposit_svc.getDepositById(deposit_id)
    .pipe(take(1))
    .subscribe(dep =>{
        switch (code) {
          case "clickinn_confirmed_deposit":
            message = `Clickinn has confirmed payment of ${dep.apartment.deposit} for the ${dep.apartment.room_type} by ${dep.by.firstname}.`
            title = 'DEPOSIT PAYMENT CONFIRMATION'
            break;
          case "tenant_confirmed_deposit":
            message = `${dep.by.firstname} confirmed a deposit payment of ${dep.apartment.deposit} for the ${dep.apartment.room_type}, please await confirmation of reciept from Clickinn and ALLOW the tenant to move in once you've recieved confirmation.`
            title = 'DEPOSIT PAYMENT CLAIM'
            break;
          case "tenant_cancelled_deposit":
            message = `${dep.by.firstname} cancelled the deposit payment of ${dep.apartment.deposit} for the ${dep.apartment.room_type}.`
            title = 'DEPOSIT PAYMENT CANCELLATION'
            break;
          case "agent_confirmed_deposit":
            message = `Your deposit for the ${dep.apartment.room_type} at ${dep.apartment.property.address.description} has been confirmed. You can chat with the landlord for further move-in arrangements.`
            title = 'DEPOSIT PAYMENT RECIEVED'
            break;
        }
        let notifAlert = this.alertCtrl.create({
            title: title,
            message: message,
            cssClass: "notification",
            buttons: [{
              text: 'View',
              role: 'cancel',
            }]
        });
        notifAlert.present();
    })
  }

  //Navigates the user their appropriate homepage at startup
  /*
    Check if this is first time user by checking for the first time token,
    if there's no token route to the user guide page else route to the page suitable for the user role
  */
  navigateUser(user: User){
    console.log('getting first time...', user)
    if(user.firstime == true){
      console.log('Users first time')
      this.user.firstime = false;
      console.log('New users', this.user)
      this.storage.setUser(this.user)
      .then(uza =>{
        console.log('Updating user...', uza)
        this.afs.collection('Users').doc(user.uid).set(this.user)
        .then(() =>{
          console.log('User updated')
          this.rootPage = 'WelcomePage';
        })
      })
    }else{
      this.storage.setUser(user)
      .then(cached =>{
        if(user.user_type){ //check i user_type property exists in user
        switch(user.user_type){
          case 'seeker':{
            //Navigate to welcome page
            this.rootPage = 'WelcomePage';
            break;
          }
          case 'host':{
            //Navigate to host dashboard
            this.rootPage = 'WelcomePage';
            break;
          }
          case 'support':{
            //Navigate to support interface
            this.rootPage = 'WelcomePage';
            break;
          }
          case 'tenant':{
            //Navigate to home
            this.rootPage = 'WelcomePage';
            break;
          }
          case 'Thapelo':{
            //Navigate to master
            this.rootPage = 'WelcomePage';
            break;
          }
          case 'admin':{
            //Navigate to master
            this.rootPage = 'WelcomePage';
            break;
          }
          case 'landlord':{
            //Navigate to master
            this.rootPage = 'WelcomePage';
            break;
          }
        }
      }
      else{
        //Navigate to welcome page
        console.log('No user match...')
        this.rootPage = 'WelcomePage';
      }
      this.appViewReady();
      })
    }
  }
  //Check for authState and sync user data if possible
  initializeAuthenticatedUser(){
    if(this.afAuth.auth.currentUser){
      this.afs.collection('Users').doc<User>(this.afAuth.auth.currentUser.uid).valueChanges()
      .pipe(take(1))
      .subscribe(user =>{
        if(user){
          this.user = this.object_init.initializeUser2(user);
          this.storage.setUser(this.user)
          .then(() =>{
            this.loader.dismiss()
            this.navigateUser(user);
            this.initNotifications();
            return;
          })
          .catch(err =>{
            this.loader.dismiss()
            this.errHandler.handleError({errCode: 'SET_OFFLINE_USER', message: `Error caching user`});
            this.rootPage = 'LoginPage';
            return;
          })
        }
      })
    }
    else{
      this.loader.dismiss();
      this.rootPage = 'LoginPage';
      this.appViewReady();
      return;
    }
  }
  //If user device is offline check for a local copy of the user and navigate user apporopriately
  InitializeOfflineUser(){
    this.storage.getUser().then(user =>{
      if(user){
        this.user = this.object_init.initializeUser2(user);
        this.loader.dismiss();
        this.navigateUser(user);
        this.initNotifications();
      }
      else{
        this.loader.dismiss();
        console.log('No user cached')
        this.rootPage = 'LoginPage';
        this.appViewReady()
        return;
      }
    }).catch(err => {
      this.loader.dismiss();
      this.errHandler.handleError({errCode: 'GET_OFFLINE_USER', message: 'Error initializing offline user'});
      this.rootPage = 'LoginPage';
      return;
    })
  }

  syncAuthenticatedUser(){
    if(this.afAuth.auth.currentUser){
      this.afs.collection('Users').doc<User>(this.afAuth.auth.currentUser.uid).valueChanges()
      .subscribe(user =>{
        if(user){
          this.user = this.object_init.initializeUser2(user);
          this.storage.setUser(this.user)
          .then(() =>{
            return;
          })
          .catch(err =>{
            this.errHandler.handleError({errCode: 'SET_OFFLINE_USER', message: `Error persisting offline user`});
            return;
          })
        }
      })
    }
  }

  /*
  This method monitors the authState and  initializes a user if auth is positive or navigates to the signup page if no
  authenticated user is found
  */
  monitorAuthState(){
   this.authSubs = this.afAuth.authState
    .subscribe(user =>{
      console.log('MonitorAuthState running....')
      if(user || this.afAuth.auth.currentUser){
        console.log('Firebase user found...')
        if(window.navigator.onLine){//If there is a network connection
          console.log('Connected!');
          this.online = true;
          this.initializeAuthenticatedUser();
        }else{
          console.log('offline')
          this.online = false;
          //Atleast check if there's a cached user otherwise only show login page
          this.InitializeOfflineUser();
        }
      }
      else if(user == null){
        this.loader.dismiss()
        this.navCtrl.setRoot('SignupPage');
        this.appViewReady();  
      }else{
        this.loader.dismiss()
        this.navCtrl.setRoot('SignupPage');
        this.appViewReady();
        console.log('I dunno')
      }
    })
  }

  gotoLiked(){
    this.navCtrl.push('FavouritesPage')
  }

  //This method manages the hiding of the splashscreen and loader once the app is ready
  appViewReady(){
    if(this.platform.is('cordova')){
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    }
  }
  //Update the offine user data when an internet connection is established
  monitorConnectionState(){
    console.log('MonitorConnectionState running....')
    window.addEventListener('online', () =>{
      if(!this.online){
        this.online = true;
        this.showToast('You are back online!')
      }
      this.syncAuthenticatedUser();
    })
  }

  monitorOfflineState(){
    console.log('MonitorConnectionState running....')
    window.addEventListener('offline', () =>{
      this.online = false;
      this.showToast('You are offline...')
    })
  }

  initializeUser(){
    this.user = this.object_init.initializeUser();
  }

  showToast(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    })
    toast.present();
  }


}

