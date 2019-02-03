import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';

/**
 * Generated class for the OwnerGuidePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-owner-guide',
  templateUrl: 'owner-guide.html',
})
export class OwnerGuidePage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private storage: LocalDataProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OwnerGuidePage');
  }

  gotoWelcome(){
    this.storage.setNotFirstime()
    .then(dat =>{
      this.navCtrl.setRoot('OwnersDashboardPage');
    })
  }

}
