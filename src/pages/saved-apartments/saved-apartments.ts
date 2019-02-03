import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { Subscription } from 'rxjs-compat/Subscription';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
import { User } from '../../models/users/user.interface';
import { Observable } from 'rxjs-compat/Observable';
import { take } from 'rxjs-compat/operators/take';
import { Apartment } from '../../models/properties/apartment.interface';
/**
 * Generated class for the SavedApartmentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-saved-apartments',
  templateUrl: 'saved-apartments.html',
})
export class SavedApartmentsPage {
  user: User;
  loader = this.loadingCtrl.create();
  apartments: Observable<Apartment[]>
  imagesLoaded: boolean[] = 
    [false, false, false, false, false, false, false, false, false, false,
       false, false, false, false, false, false, false, false, false, false, 
       false,false, false, false, false, false, false, false, false, false,
       false,false, false, false, false, false, false, false, false, false,
       false,false, false, false, false, false, false, false, false, false
    ];
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private accom_svc: AccommodationsProvider,
  	private local_db: LocalDataProvider,
    private toast_svc: ToastSvcProvider,
    private loadingCtrl: LoadingController){
  	this.loader.present()
  	this.local_db.getUser()
  	.then(user =>{
  		this.user = user;
  		this.apartments = this.accom_svc.getUserApartments(user.uid);
  		this.accom_svc.getUserApartments(user.uid)
  		.pipe(take(1))
  		.subscribe(aparts =>{
  			if(aparts.length > 0){
  				aparts.forEach(apart =>{
	  				this.imagesLoaded.push(false)
	  			})
	  			this.loader.dismiss()
  			}else{
  				this.loader.dismiss()
  				this.toast_svc.showToast('You have not apartments linked to this profile, go ahead and upload some...')
  			}
  		})
  	})
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SavedApartmentsPage');
  }

  gotoEditApartment(apartment: Apartment){
    this.local_db.setApartment(apartment).then(data => this.navCtrl.push('EditApartmentPage'))
    .catch(err => {
      console.log(err);
    });
  }

}
