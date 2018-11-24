import { Component } from '@angular/core';
import { IonicPage, NavController} from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { User } from '../../models/users/user.interface'
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { FcmProvider } from '../../providers/fcm/fcm';
import { Push, PushOptions, PushObject } from '@ionic-native/push';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
//import { Thread } from '../../models/thread.interface';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

	seeker: User;
	password: string;
  loading: boolean = false;

  constructor(
    public navCtrl: NavController,
    private afs: AngularFirestore, 
    private afAuth: AngularFireAuth, 
    private storage: LocalDataProvider,
     private errHandler: ErrorHandlerProvider, 
     private object_init: ObjectInitProvider,
     private fcm: FcmProvider,
     private toast_svc: ToastSvcProvider,
     private push: Push) {
  	this.seeker = this.object_init.initializeUser();
  }

  signup(){
    this.loading = true;
    this.afAuth.auth.createUserWithEmailAndPassword(this.seeker.email, this.password)
    .then(data =>{
      this.seeker.uid = data.user.uid;
      this.seeker.displayName = this.seeker.firstname + ' ' + this.seeker.lastname;
      if(this.seeker.uid !== ''){
        this.persistUser(data.user.uid);
      }else{
        this.loading = false;
        this.errHandler.handleError({
          code: 'no uid',
          message: 'Something went wrong, please try again'
        })
      }
    })
    .catch(err => {
      this.errHandler.handleError(err);
      this.loading = false;
    })
  }

  signin(){
    this.navCtrl.setRoot('LoginPage');
  }

  resetPassword(email: string){
    this.afAuth.auth.sendPasswordResetEmail(email)
    .then(() => {
      this.toast_svc.showToast('Reset instructions sent to your email')
    })
  }

  onNotifications(){
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
    pushObject.on('registration').subscribe((registration: any) => {
      this.fcm.saveTokenToFirestore(registration.registrationId)
    });
    pushObject.on('error').subscribe(error => alert(error));
  }

  persistUser(uid: string){
    if(this.seeker.uid !== ''){
      this.afs.collection('Users').doc(uid).set(this.seeker)
      .then(() =>{
          //alert('stored in collection!');
          this.storage.setUser(this.seeker).then(val =>{
           // alert('local storage!');
            this.navCtrl.setRoot('WelcomePage').then(() =>{
              this.loading = false;
              this.onNotifications();
            })
            .catch(err => {
              this.errHandler.handleError(err);
              this.loading = false;
            })
          })
          .catch(err => {
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

}
