import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { SearchfeedPage } from '../searchfeed/searchfeed';
import { ChatsPage } from '../chats/chats';
import { BookingsPage } from '../bookings/bookings';
import { ManageBuildingsPage } from '../manage-buildings/manage-buildings';
import { WelcomePage } from '../welcome/welcome';
/**
 * Generated class for the CaretakerManagerDashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-caretaker-manager-dashboard',
  templateUrl: 'caretaker-manager-dashboard.html',
})
export class CaretakerManagerDashboardPage {
  tab1Root: any = SearchfeedPage;
  tab2Root: any = ManageBuildingsPage;
  tab3Root: any = BookingsPage;
  tab4Root: any = ChatsPage;
  constructor(public navCtrl: NavController, public navParams: NavParams, private app: App) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CaretakerManagerDashboardPage');
  }

  gotoHome(){
    this.app.getRootNav().setRoot(WelcomePage);
  }

}
