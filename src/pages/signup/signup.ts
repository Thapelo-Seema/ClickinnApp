import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController} from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { User } from '../../models/users/user.interface'
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
//import { FcmProvider } from '../../providers/fcm/fcm';
//import { Push, PushOptions, PushObject } from '@ionic-native/push';
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
  loader = this.loadingCtrl.create();

  constructor(
    public navCtrl: NavController,
    private afs: AngularFirestore, 
    private afAuth: AngularFireAuth, 
    private storage: LocalDataProvider,
     private errHandler: ErrorHandlerProvider, 
     private object_init: ObjectInitProvider,
     //private fcm: FcmProvider,
     private toast_svc: ToastSvcProvider,
     //private push: Push,
     private loadingCtrl: LoadingController) {
  	this.seeker = this.object_init.initializeUser();
  }

  signup(){
    this.loader.present()
    this.afAuth.auth.createUserWithEmailAndPassword(this.seeker.email, this.password)
    .then(data =>{
      this.seeker.uid = data.user.uid;
      this.seeker.agreed_to_terms = true;
      this.seeker.displayName = this.seeker.firstname + ' ' + this.seeker.lastname;
      if(this.seeker.uid !== ''){
        this.persistUser(data.user.uid);
      }else{
        this.loader.dismiss()
        this.errHandler.handleError({
          code: 'no uid',
          message: 'Something went wrong, please try again'
        })
      }
    })
    .catch(err => {
      this.loader.dismiss()
      this.errHandler.handleError(err);
    })
  }

  signin(){
    this.navCtrl.setRoot('LoginPage');
  }

  gotoTerms(){
    this.navCtrl.push('TermsPage');
  }

  

  /*onNotifications(){
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
  }*/

  persistUser(uid: string){
    if(this.seeker.uid !== ''){
      this.afs.collection('Users').doc(uid).set(this.seeker)
      .then(() =>{
          //alert('stored in collection!');
          this.storage.setUser(this.seeker).then(val =>{
            this.loader.dismiss();
            this.navCtrl.setRoot('WelcomePage').then(() =>{
              //this.onNotifications();
            })
            .catch(err => {
              this.loader.dismiss()
              this.errHandler.handleError(err);
            })
          })
          .catch(err => {
            this.loader.dismiss()
            this.errHandler.handleError(err);
          })
        })
        .catch(err => {
          this.loader.dismiss()
          this.errHandler.handleError(err);
        })
    }else{
      this.loader.dismiss()
    }
  }

}
