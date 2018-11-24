import { Component, ViewChild, OnDestroy } from '@angular/core';
import { Platform, ToastController, AlertController } from 'ionic-angular';
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
import { Network } from '@ionic-native/network';
import { Subscription } from 'rxjs-compat/Subscription'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  loading: boolean = true;
  user: User;
  userSubs: Subscription;
  authState: Subscription;
  online: boolean = false;
  dpLoaded: boolean = false;
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
    private network: Network,
    //private events: Events
    ){
    this.loading = true;
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
      this.errHandler.handleError(err);
      this.loading = false;
    })
  }

  ngOnDestroy(){

  }
  //Navigate to the users profile
  gotoProfile(){
    this.loading = true;
    this.navCtrl.push('ProfilePage').then(() =>{
      this.loading = false;
    });
  }

  gotoAgentDash(){
    this.loading = true;
    this.navCtrl.push('AgentDashboardPage')
    this.loading = false;
  }

  gotoBursaryDash(){
    this.loading = true;
    this.navCtrl.push('BursaryPlacementsPage');
    this.loading = false;
  }

  gotoCaretakerDash(){
    this.loading = true;
    this.navCtrl.push('CaretakerManagerDashboardPage');
    this.loading = false;
  }

  gotoLandlordDash(){
    this.loading = true;
    this.storage.setUserType('Landlord')
    .then(val =>{
      this.navCtrl.push('LandlordDashboardPage');
      this.loading = false;
    })
  }

  gotoDeposits(){
    this.loading = true;
    this.navCtrl.push('DepositsPage');
    this.loading = false;
  }

  gotoChats(){
    this.loading = true;
    this.navCtrl.push('ChatsPage');
    this.loading = false;
  }

  gotoBookings(){
    this.loading = true;
    this.navCtrl.push('BookingsPage');
    this.loading = false;
  }
  //Change the users authState, remove the users local copy
  logout(){
    this.userSubs.unsubscribe();
    this.authState.unsubscribe();
    this.afAuth.auth.signOut().then(() =>{
      this.navCtrl.setRoot('LoginPage');  
    }) 
  }
  //Navigate to the upload and earn page
  uploadAndEarn(){
    this.navCtrl.push('UploadAndEarnPage');
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
         sound: 'false'
     },
     windows: {},
     browser: {
         pushServiceURL: 'http://push.api.phonegap.com/v1/push'
     }
    };
    const pushObject: PushObject = this.push.init(options);
    
    pushObject.on('notification').subscribe((notification: any) => {
     // alert(notification.additionalData.deposit_id) 
      if(this.notificationObject !== null){
        if(!this.compareNotification(notification, this.notificationObject)){
          this.notificationObject = notification; 
          if (notification.additionalData.foreground) {
              // if application open, show popup
              let notifAlert = this.alertCtrl.create({
                  title: notification.title,
                  message: notification.message,
                  cssClass: "notification",
                  buttons: [{
                      text: 'View',
                      role: 'cancel',
                      handler: () => {
                        //TODO: Your logic here
                        this.routeToNotificationSource(notification.additionalData.key_code, 
                          notification.additionalData.thread_id,
                          notification.additionalData.deposit_id);  
                      }
                  }]
              });
              notifAlert.present();

          }else {
              //if user NOT using app and push notification comes - NOT working, redirect to default rootPage
              this.routeToNotificationSource(notification.additionalData.key_code, 
                notification.additionalData.thread_id, notification.additionalData.deposit_id);
          }
        }
      }else{
        this.notificationObject = notification; 
        if (notification.additionalData.foreground) {
            // if application open, show popup
            let notifAlert = this.alertCtrl.create({
                title: notification.title,
                message: notification.message,
                cssClass: "notification",
                buttons: [{
                    text: 'View',
                    role: 'cancel',
                    handler: () => {
                      //TODO: Your logic here
                      this.routeToNotificationSource(notification.additionalData.key_code, 
                        notification.additionalData.thread_id,
                        notification.additionalData.deposit_id);  
                    }
                }]
            });
            notifAlert.present();
        }else {
            //if user NOT using app and push notification comes - NOT working, redirect to default rootPage
            this.routeToNotificationSource(notification.additionalData.key_code, 
            notification.additionalData.thread_id, notification.additionalData.deposit_id);
        }
      }
      
    });

    pushObject.on('registration').subscribe((registration: any) => {
      this.fcm.saveTokenToFirestore(registration.registrationId)
    });

    pushObject.on('error').subscribe(error => console.log(error));
  }

  routeToNotificationSource(key_code: string, thread_id?: string, deposit_id?: string){
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
      }
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

  gotoDepositInfo(deposit_id: string, code: string){
    let message: string = '';
    let title: string = '';
    this.deposit_svc.getDepositById(deposit_id)
    .pipe(
      take(1)
    )
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

  gotoThread(thread_id: string){
    let thread: Thread = {
      uid: '',
      thread_id: thread_id,
      dp: '',
      displayName: ''
    }
    this.storage.setThread(thread).then(val =>{
      this.navCtrl.push('ChatThreadPage', thread);
    })
    .catch(err => console.log(err))
  }

  gotoHostBookings(){
    this.loading = true;
    this.navCtrl.push('BookingsPage', {selectedTab: 2});
    this.loading = false;
  }

  //Navigates the user their appropriate homepage at startup
  navigateUser(user: User){
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
      }
    }else{
      //Navigate to welcome page
      this.rootPage = 'WelcomePage';
    }
    this.appViewReady();
  }
  //Check for authState and sync user data if possible
  initializeAuthenticatedUser(){
    if(this.afAuth.auth.currentUser){
      this.userSubs = this.afs.collection('Users').doc<User>(this.afAuth.auth.currentUser.uid).valueChanges()
      .subscribe(user =>{
        if(user){
          this.user = user;
          this.storage.setUser(user)
          .then(() =>{
            this.navigateUser(user);
            this.initNotifications();
            this.loading = false;
            return;
          })
          .catch(err =>{
            this.errHandler.handleError({errCode: 'SET_OFFLINE_USER', message: `Error caching user`});
            this.loading = false;
            return;
          })
        }
      })
    }
    else{
      this.rootPage = 'LoginPage';
      this.loading = false;
      this.appViewReady();
      return;
    }
  }
  //If user device is offline check for a local copy of the user and navigate user apporopriately
  InitializeOfflineUser(){
    this.storage.getUser().then(user =>{
      if(user){
        this.user = user;
        this.navigateUser(user);
        this.initNotifications();
        this.loading = false;
      }
      else{
        this.rootPage = 'LoginPage';
        this.appViewReady()
        this.loading = false;
        return;
      }
    }).catch(err => {
      this.errHandler.handleError({errCode: 'GET_OFFLINE_USER', message: 'Error initializing offline user'});
      this.loading = false;
      return;
    })
  }

  syncAuthenticatedUser(){
    if(this.afAuth.auth.currentUser){
      this.userSubs = this.afs.collection('Users').doc<User>(this.afAuth.auth.currentUser.uid).valueChanges()
      .subscribe(user =>{
        if(user){
          this.user = user;
          this.storage.setUser(user)
          .then(() =>{
            this.loading = false;
            return;
          })
          .catch(err =>{
            this.errHandler.handleError({errCode: 'SET_OFFLINE_USER', message: `Error persisting offline user`});
            this.loading = false;
            return;
          })
        }
      })
    }
  }

  monitorAuthState(){
    this.authState = this.afAuth.authState
    .subscribe(user =>{
      console.log('MonitorAuthState running....')
      if(user || this.afAuth.auth.currentUser){
        console.log('Firebase user found...')
        if(this.platform.is('cordova')){
          console.log('on mobile device...')
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
        else{
          console.log('On browser')
          if(window.navigator.onLine){
            console.log('connected')
            this.online = true;
            this.initializeAuthenticatedUser();
          }else{
            //check for cached otherwise take to login page
            console.log('offline')
            this.online = false;
            this.InitializeOfflineUser();
          }
        }
      }
      else if(user == null){
        this.navCtrl.setRoot('LoginPage');
        this.appViewReady();
        this.loading = false;  
      }else{
        this.navCtrl.setRoot('LoginPage');
        this.appViewReady();
        this.loading = false; 
        console.log('I dunno')
      }
    })
  }

  gotoLiked(){
    this.navCtrl.push('FavouritesPage')
  }

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
        this.afs.firestore.enableNetwork().then(() =>{
          this.syncAuthenticatedUser();
        })
        .catch(err => console.log(err))
      })
  }

  monitorOfflineState(){
    console.log('MonitorConnectionState running....')
      window.addEventListener('offline', () =>{
        this.online = false;
        this.showToast('You are offline...')
        this.afs.firestore.disableNetwork()
        .catch(err => console.log(err))
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

