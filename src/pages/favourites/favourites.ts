import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
//import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
//import { AccommodationsComponent } from '../../components/accommodations/accommodations';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import { Observable } from 'rxjs-compat/Observable';
import { Apartment } from '../../models/properties/apartment.interface';
import { LocalDataProvider } from '../../providers/local-data/local-data';
//import { Subscription } from 'rxjs-compat/Subscription';
import { User } from '../../models/users/user.interface';
import { take } from 'rxjs-compat/operators/take';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';

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
  apartments: Observable<Apartment[]> ;
  user: User;
  loader = this.loadingCtrl.create();
  done: boolean = false;
  //apartmentSub: Subscription = null;
  noLiked: boolean = false;
  //@ViewChild(Content) content: Content;
  imagesLoaded: boolean[] = 
  [ false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, 
    false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false
  ];
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private accom_svc: AccommodationsProvider,
  	private storage: LocalDataProvider,
    private toast_svc: ToastSvcProvider,
    private loadingCtrl: LoadingController) {
    /*this.accom_svc.loading.subscribe(data =>{
      this.loadingMore = data;
    })

    this.accom_svc.done.subscribe(data =>{
      this.done = data;
      if(this.done == true) this.loadingMore = false;
    })*/
    this.loader.present()
  	this.storage.getUser().then(data =>{
      this.user = data;
      this.apartments = this.accom_svc.getUserFavourites(data.liked_apartments)
  		this.accom_svc.getUserFavourites(data.liked_apartments)
      .pipe(
        take(1)
       )
  		.subscribe(aparts =>{
        if(aparts.length > 0){
          aparts.forEach(apart =>{
            this.imagesLoaded.push(false);
          })
          this.loader.dismiss()
        }else{
          //this.toast_svc.showToast('You have not liked any apartments yet...')
          this.noLiked = true;
          this.loader.dismiss()
        }
  		})
  	})

  }

  ionViewDidLoad() {
    //this.monitorEnd()
  }

  ionViewDidLeave(){
   
  }

  gotoApartment(apartment: any){
    //delete apartment.doc
    this.storage.setApartment(apartment).then(data => {
      //this.accom_svc.reset();
      this.navCtrl.push('ApartmentDetailsPage')
    })
    .catch(err => {
      console.log(err)
    });
  }

  /*monitorEnd(){
    //console.log('Content scrollHeight = ', this.content.scrollHeight)
    this.content.ionScrollEnd.subscribe(ev =>{
    let height = ev.scrollElement.scrollHeight;
    let top = ev.scrollElement.scrollTop;
    let offset = ev.scrollElement.offsetHeight;
      if(top > height - offset - 1){
        this.accom_svc.moreUserProperties(this.user.uid)
      }
    })
  }*/

}
