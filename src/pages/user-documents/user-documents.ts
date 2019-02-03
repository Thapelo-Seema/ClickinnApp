import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

/**
 * Generated class for the UserDocumentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-documents',
  templateUrl: 'user-documents.html',
})
export class UserDocumentsPage {

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserDocumentsPage');
  }

  comingSoon(){
    let alert = this.alertCtrl.create({
      title: 'Coming Soon!',
      subTitle: 'This feature is still under construction, please send documents directly to landlords or agents',
      buttons: ['OK']
    });
    alert.present();
  }

}
