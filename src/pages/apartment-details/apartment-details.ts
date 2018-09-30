import { Component } from '@angular/core';
import { IonicPage, NavController, App, ToastController } from 'ionic-angular';
import { InfoPage } from '../info/info';
import { AppointmentPage } from '../appointment/appointment';
import { SecurePage } from '../secure/secure';
import { WelcomePage } from '../welcome/welcome';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { Apartment } from '../../models/properties/apartment.interface';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { User } from '../../models/users/user.interface';
import { UserSvcProvider } from '../../providers/user-svc/user-svc';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';


@IonicPage()
@Component({
  selector: 'page-apartment-details',
  templateUrl: 'apartment-details.html',
})
export class ApartmentDetailsPage{
  tab1Root: any = InfoPage;
  tab2Root: any = AppointmentPage;
  tab3Root: any = SecurePage;
  currentApartment: Apartment;
  user: User;
 
  constructor(public navCtrl: NavController, private app: App, private local_data: LocalDataProvider, 
    private obj_init: ObjectInitProvider, private user_svc: UserSvcProvider, private toast_svc: ToastSvcProvider){
    this.currentApartment = this.obj_init.initializeApartment();
    this.user = this.obj_init.initializeUser();
    this.local_data.getApartment().then(data =>{
      this.currentApartment = data;
    })
    this.local_data.getUser().then(data =>{
      this.user_svc.getUser(data.uid).subscribe(user =>{
        if(user){
          this.user = this.obj_init.initializeUser2(user);
          console.log('User: ', this.user);
        }
      })
      
    })
  }

  gotoHome(){
    this.app.getRootNav().setRoot(WelcomePage);
  }

  addToLiked(){
    this.user.liked_apartments.push(this.currentApartment.apart_id);
    this.user_svc.updateUser(this.user).then(() =>{
      this.toast_svc.showToast("Apartment added to your 'liked apartments' ")
    })
    .catch(err => console.log(err))
  }

  
  
}
