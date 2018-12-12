import { Component} from '@angular/core';
import { IonicPage, NavController} from 'ionic-angular';
//import { AppointmentsProvider } from '../../providers/appointments/appointments'

@IonicPage()
@Component({
  selector: 'page-landlord-dashboard',
  templateUrl: 'landlord-dashboard.html',
})
export class LandlordDashboardPage {
 
  tab1Root: any = 'SearchfeedPage';
  tab2Root: any = 'ManageBuildingsPage';
  tab3Root: any = 'BookingsPage';
  tab4Root: any = 'ChatsPage';
  constructor(
    public navCtrl: NavController, 
    //public navParams: NavParams, 
    //private app: App,
    //private appt_svc: AppointmentsProvider
    ) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LandlordDashboardPage');
  }

  gotoHome(){
    //this.appt_svc.reset();
    this.navCtrl.setRoot('WelcomePage');
  }

}
