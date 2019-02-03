import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { User } from '../../models/users/user.interface';
import { AngularFirestore } from 'angularfire2/firestore';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { take } from 'rxjs-compat/operators/take';
/**
 * Generated class for the PersonalDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-personal-details',
  templateUrl: 'personal-details.html',
})
export class PersonalDetailsPage {
  user: User;	//the current user
  image: string = "assets/imgs/placeholder.png";
  loader = this.loadingCtrl.create();
  imageLoaded: boolean = false; 
  constructor(
  	public navCtrl: NavController, 
  	private storage: LocalDataProvider,
  	private afs: AngularFirestore, 
  	private errHandler: ErrorHandlerProvider,
  	private object_init: ObjectInitProvider,
    private loadingCtrl: LoadingController) {
    this.loader.present();
  	this.user = this.object_init.initializeUser();
  		this.storage.getUser().then(data =>{
        this.afs.collection('Users').doc<User>(data.uid).valueChanges()
        .pipe(take(1))
        .subscribe(user =>{
          this.user = user;
          if(this.user.photoURL !== '') this.image = this.user.photoURL;
          else console.log(this.user.photoURL);
          this.loader.dismiss()
        },
        err =>{
          this.loader.dismiss()
          this.errHandler.handleError(err);
        })
	  	})
      .catch(err => {
        this.loader.dismiss()
        this.errHandler.handleError(err);
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PersonalDetailsPage');
  }

  gotoEdit(){
    this.navCtrl.push('EditProfilePage');
  }

}
