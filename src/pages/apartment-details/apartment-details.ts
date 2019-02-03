import { Component } from '@angular/core';
import { IonicPage, NavController} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-apartment-details',
  templateUrl: 'apartment-details.html',
})
export class ApartmentDetailsPage{
  tab1Root: any = 'InfoPage';
  tab2Root: any = 'AppointmentPage';
  tab3Root: any = 'SecurePage';
 
  constructor(
    public navCtrl: NavController){
  }

  /** This is a navigation page to navigate between the Three pages of a users interest in securing a place **/


  /* This function navigates the user to the welcome page */
  gotoHome(){
    this.navCtrl.setRoot('WelcomePage');
  } 
  
}
