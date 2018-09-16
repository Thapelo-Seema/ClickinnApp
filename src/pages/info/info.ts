import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Apartment } from '../../models/properties/apartment.interface';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { Image } from '../../models/image.interface';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import { Address } from '../../models/location/address.interface';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { User } from '../../models/users/user.interface';

@IonicPage()
@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {

  apartment: Apartment;
  adjustedDuration: number = 0;
  pointOfInterest: Address ;
  images: Image[] = [];
  loading: boolean = false;
  canEdit: boolean = false;
  user: User;
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: LocalDataProvider, 
  	private accom_svc: AccommodationsProvider, private errHandler: ErrorHandlerProvider, private object_init: ObjectInitProvider) {
      this.apartment = this.object_init.initializeApartment();
      this.pointOfInterest = this.object_init.initializeAddress();
      

  }

  ionViewWillLoad(){
    this.user = this.object_init.initializeUser();
    this.storage.getPOI().then(data => {
      this.pointOfInterest = data;
      //console.log('Description: ' + this.pointOfInterest.description + '\n' + 'Name: ' + this.pointOfInterest.name)
    })
    .catch(err => {
      this.errHandler.handleError(err);
      this.loading = false;
    })
  	this.storage.getApartment().then(data => {
      this.apartment = data;
      this.storage.getUser().then(user => {
        this.user = user
        if(this.user.uid != undefined && this.apartment.property.user_id != undefined && 
          this.apartment.property.user_id == this.user.uid){
          this.canEdit = true;
        }
      }).catch(err => console.log(err));
      if(this.apartment.property.nearbys == undefined || this.apartment.property.nearbys == null || 
        this.apartment.property.nearbys.length == 0 ){
        this.apartment.property.nearbys = [];
      }
      this.images = [];
      this.images = Object.keys(data.images).map(imageId =>{
        return data.images[imageId]
      })
      console.log(this.images);
  	})
    .catch(err => {
      this.errHandler.handleError(err);
      this.loading = false;
    })
  	
 }


}
