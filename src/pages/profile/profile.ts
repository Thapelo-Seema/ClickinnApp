import { Component } from '@angular/core';
import { IonicPage, NavController} from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { User } from '../../models/users/user.interface';
import { AngularFirestore } from 'angularfire2/firestore';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { ObjectInitProvider } from '../../providers/object-init/object-init';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  user: User;	//the current user
  image: string = "assets/imgs/placeholder.png";
  loading: boolean = false;

  constructor(public navCtrl: NavController, private storage: LocalDataProvider,
  	 private afs: AngularFirestore, private errHandler: ErrorHandlerProvider, private object_init: ObjectInitProvider){
    this.user = this.object_init.initializeUser();
      this.loading = true;
  		this.storage.getUser().then(data =>{
        this.afs.collection('Users').doc<User>(data.uid).valueChanges().subscribe(user =>{
          this.user = user;
          if(this.user.photoURL !== '') this.image = this.user.photoURL;
          else console.log(this.user.photoURL);
          this.loading = false;
        },
        err =>{
          this.errHandler.handleError(err);
          this.loading = false
        })
	  	})
      .catch(err => {
      this.errHandler.handleError(err);
      this.loading = false;
    })
  }

  gotoEdit(){
    this.navCtrl.push(EditProfilePage);
  }

}
