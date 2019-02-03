import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { User } from '../../models/users/user.interface';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
//import { FcmProvider } from '../../providers/fcm/fcm';
//import { Push, PushOptions, PushObject } from '@ionic-native/push';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
//import { Thread } from '../../models/thread.interface';
import { take } from 'rxjs-compat/operators/take';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  seeker: User;
  password: string = '';
  loader = this.loadingCtrl.create();
  reseting: boolean = false;
  constructor(
    public navCtrl: NavController, 
    private afAuth: AngularFireAuth,
  	private afs: AngularFirestore, 
    private storage: LocalDataProvider,
    private errHandler: ErrorHandlerProvider, 
    private object_init: ObjectInitProvider,
   /// private fcm: FcmProvider,
    private alertCtrl: AlertController,
   // private push: Push,
    private toast_svc: ToastSvcProvider,
    private loadingCtrl: LoadingController) {
  	this.seeker = this.object_init.initializeUser();
  }

  signup(){
  	this.navCtrl.push('SignupPage');
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

  signin(){
  	this.loader.present()
  	this.afAuth.auth.signInWithEmailAndPassword(this.seeker.email, this.password).then(firebaseUser =>{
      //console.log('firebaseUser: ', firebaseUser);
  		this.afs.collection('Users').doc<User>(`${firebaseUser.user.uid}`).valueChanges()
      .pipe(take(1))
      .subscribe(data =>{
        //console.log('ClickinnUser: ', data);
  			this.seeker = data;
  			this.storage.setUser(data).then(() =>{
          this.loader.dismiss()
  				this.navCtrl.setRoot('WelcomePage')
          //this.onNotifications();
  			})
        .catch(err => {
          this.loader.dismiss()
          this.errHandler.handleError(err);
        })
  		}, err =>{
        this.loader.dismiss()
        this.errHandler.handleError(err);
      })
  	})
    .catch(err => {
      this.loader.dismiss()
      this.errHandler.handleError(err);
    })
  }

  resetPassword(){
    let alert = this.alertCtrl.create({
      title: 'Reset password',
      message: 'Forgot your password ? do not worry, please enter your email below and we will send a reset link to your email',
      inputs: [{
        name: 'email',
        placeholder: 'Email adress',
        type: 'text'
      }],
      buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Reset',
        handler: data =>{
          this.reseting = true;
          this.afAuth.auth.sendPasswordResetEmail(data.email)
          .then(() =>{
            this.reseting = false;
            this.toast_svc.showToast('Your password reset link has been sent to your email.')
          })
          .catch(err =>{
            this.reseting = false;
            this.errHandler.handleError(err);
          })
        }
      }
      ]
    })

    alert.present();
  }

}
