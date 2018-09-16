import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { User } from '../../models/users/user.interface'
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { LoginPage } from '../login/login';
import { WelcomePage } from '../welcome/welcome';
import { ObjectInitProvider } from '../../providers/object-init/object-init';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

	seeker: User;
	password: string;
  loading: boolean = false;

  constructor(public navCtrl: NavController,
    private afs: AngularFirestore, private afAuth: AngularFireAuth, private storage: LocalDataProvider,
     private errHandler: ErrorHandlerProvider, private object_init: ObjectInitProvider) {
  	this.seeker = this.object_init.initializeUser();
  }

  signup(){
    this.loading = true;
    this.afAuth.auth.createUserWithEmailAndPassword(this.seeker.email, this.password)
    .then(data =>{
      //alert('signed in!')
      this.seeker.uid = data.user.uid;
      this.seeker.displayName = this.seeker.firstname + ' ' + this.seeker.lastname;
      if(this.seeker.uid !== ''){
        //alert('persisting user...');
        this.persistUser(data.user.uid);
      }
    })
    .catch(err => {
      this.errHandler.handleError(err);
      this.loading = false;
    })
  }

  signin(){
    this.navCtrl.setRoot(LoginPage);
  }

  persistUser(uid: string){
    if(this.seeker.uid !== ''){
      this.afs.collection('Users').doc(uid).set(this.seeker)
      .then(() =>{
          //alert('stored in collection!');
          this.storage.setUser(this.seeker).then(() =>{
           // alert('local storage!');
            this.navCtrl.setRoot(WelcomePage).then(() =>{
              //alert('navigated');
              this.loading = false;
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
