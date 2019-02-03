import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
/**
 * Generated class for the AgentGuidePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-agent-guide',
  templateUrl: 'agent-guide.html',
})
export class AgentGuidePage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private storage: LocalDataProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AgentGuidePage');
  }

  gotoWelcome(){
    this.storage.setNotFirstime()
    .then(dat =>{
      this.navCtrl.setRoot('LandlordDashboardPage');
    })
  }

}
