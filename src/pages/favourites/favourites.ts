import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
//import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
//import { AccommodationsComponent } from '../../components/accommodations/accommodations';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
//import { Observable } from 'rxjs-compat/Observable';
import { Apartment } from '../../models/properties/apartment.interface';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { Subscription } from 'rxjs-compat/Subscription';
import { User } from '../../models/users/user.interface';
/**
 * Generated class for the FavouritesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-favourites',
  templateUrl: 'favourites.html',
})
export class FavouritesPage {
  apartments: Apartment[] = [];
  user: User;
  loading: boolean = true;
  loadingMore: boolean = false;
  done: boolean = false;
  apartmentSub: Subscription = null;
  @ViewChild(Content) content: Content;
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
  	private storage: LocalDataProvider) {
    this.accom_svc.loading.subscribe(data =>{
      this.loadingMore = data;
    })

    this.accom_svc.done.subscribe(data =>{
      this.done = data;
      if(this.done == true) this.loadingMore = false;
    })
  	this.storage.getUser().then(data =>{
      this.user = data;
      this.accom_svc.initUserFavs(data.liked_apartments);
  		this.apartmentSub = this.accom_svc.getUserFavourites(data.liked_apartments)
  		.subscribe(aparts =>{
  			this.apartments = aparts;
        this.loading = false;
  		})
  	})

  }

  ionViewDidLoad() {
    this.monitorEnd()
  }

  ionViewDidLeave(){
    if(this.apartmentSub) this.apartmentSub.unsubscribe();
  }

  gotoApartment(apartment: Apartment){
    this.storage.setApartment(apartment).then(data => this.navCtrl.push('ApartmentDetailsPage'))
    .catch(err => {
      console.log(err)
    });
  }

  monitorEnd(){
    //console.log('Content scrollHeight = ', this.content.scrollHeight)
    this.content.ionScrollEnd.subscribe(ev =>{
    let height = ev.scrollElement.scrollHeight;
    let top = ev.scrollElement.scrollTop;
    let offset = ev.scrollElement.offsetHeight;
      if(top > height - offset - 1){
        this.accom_svc.moreUserProperties(this.user.uid)
      }
    })
  }

}
