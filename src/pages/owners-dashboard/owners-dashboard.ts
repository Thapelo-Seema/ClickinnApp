import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppointmentsProvider } from '../../providers/appointments/appointments'
/**
 * Generated class for the OwnersDashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-owners-dashboard',
  templateUrl: 'owners-dashboard.html',
})
export class OwnersDashboardPage {
  tab0Root: any = 'LandlordRegistrationPage';
  tab1Root: any = 'SearchfeedPage';
  tab2Root: any = 'ManageBuildingsPage';
  tab3Root: any = 'BookingsPage';
  tab4Root: any = 'ChatsPage';
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private appt_svc: AppointmentsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OwnersDashboardPage');
  }

  gotoHome(){
    this.appt_svc.reset();
    this.navCtrl.setRoot('WelcomePage');
  }

}
