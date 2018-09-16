import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { SearchfeedPage } from '../searchfeed/searchfeed';
import { ChatsPage } from '../chats/chats';
import { BookingsPage } from '../bookings/bookings';
import { ManageBuildingsPage } from '../manage-buildings/manage-buildings';
import { WelcomePage } from '../welcome/welcome';

@IonicPage()
@Component({
  selector: 'page-landlord-dashboard',
  templateUrl: 'landlord-dashboard.html',
})
export class LandlordDashboardPage {
  tab1Root: any = SearchfeedPage;
  tab2Root: any = ManageBuildingsPage;
  tab3Root: any = BookingsPage;
  tab4Root: any = ChatsPage;
  constructor(public navCtrl: NavController, public navParams: NavParams, private app: App) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LandlordDashboardPage');
  }

  gotoHome(){
    this.app.getRootNav().setRoot(WelcomePage);
  }

}
