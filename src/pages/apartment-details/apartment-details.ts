import { Component } from '@angular/core';
import { IonicPage, NavController, App } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { Apartment } from '../../models/properties/apartment.interface';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { User } from '../../models/users/user.interface';
import { UserSvcProvider } from '../../providers/user-svc/user-svc';
//import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
import { take } from 'rxjs-compat/operators/take';

@IonicPage()
@Component({
  selector: 'page-apartment-details',
  templateUrl: 'apartment-details.html',
})
export class ApartmentDetailsPage{
  tab1Root: any = 'InfoPage';
  tab2Root: any = 'AppointmentPage';
  tab3Root: any = 'SecurePage';
  currentApartment: Apartment;
  user: User;
 
  constructor(public navCtrl: NavController, private app: App, private local_data: LocalDataProvider, 
    private obj_init: ObjectInitProvider, private user_svc: UserSvcProvider){
    this.currentApartment = this.obj_init.initializeApartment();
    this.user = this.obj_init.initializeUser();
    this.local_data.getApartment().then(data =>{
      this.currentApartment = data;
    })
    this.local_data.getUser().then(data =>{
      this.user_svc.getUser(data.uid)
      .pipe(
        take(1)
      )
      .subscribe(user =>{
        if(user){
          this.user = this.obj_init.initializeUser2(user);
          console.log('User: ', this.user);
        }
      })
    })
  }

  gotoHome(){
    this.app.getRootNav().setRoot('WelcomePage');
  }

  

  
  
}
