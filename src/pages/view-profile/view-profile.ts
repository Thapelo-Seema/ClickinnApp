import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { User } from '../../models/users/user.interface';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
/**
 * Generated class for the ViewProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-profile',
  templateUrl: 'view-profile.html',
})
export class ViewProfilePage {
  user: User;
  imageLoaded: boolean = false;
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private storage: LocalDataProvider,
  	private object_init: ObjectInitProvider) {
  	this.user = this.object_init.initializeUser();
  	this.storage.getViewedProfile()
  	.then(user =>{
  		this.user = this.object_init.initializeUser2(user);
  	})
  	.catch()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewProfilePage');
  }

}
