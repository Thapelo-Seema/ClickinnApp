import { Component } from '@angular/core';
import { IonicPage, NavController} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  tab0Root: any = 'PersonalDetailsPage';
  tab1Root: any = 'BankingDetailsPage'; 
  tab2Root: any = 'UserDocumentsPage';

  constructor(public navCtrl: NavController){
  }

  gotoHome(){
    this.navCtrl.setRoot('WelcomePage');
  }
  
}
