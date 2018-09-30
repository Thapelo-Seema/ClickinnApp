import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Property } from '../../models/properties/property.interface';
import { Apartment } from '../../models/properties/apartment.interface';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { take } from 'rxjs-compat/operators/take';
import { Observable } from 'rxjs-compat/observable';
import { AccommodationsComponent } from '../../components/accommodations/accommodations';
import { Image } from '../../models/image.interface';

/**
 * Generated class for the EditPropertyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-property',
  templateUrl: 'edit-property.html',
})
export class EditPropertyPage {
  property: Property;
  apartments: Observable<Apartment[]>;
  loading: boolean = true;
  images: Image[] = [];
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private accom_svc: AccommodationsProvider,
  	private local_db: LocalDataProvider,
  	private object_init: ObjectInitProvider) {
  	this.property = this.object_init.initializeProperty();
  	this.local_db.getProperty().then(prop =>{
  		if(prop){
  			this.property = prop;
  			this.images = [];
		    this.images = Object.keys(prop.images).map(imageId =>{
		      return prop.images[imageId]
		    })
		    console.log(this.images);
  			this.apartments = this.accom_svc.getPropertyApartments(prop.prop_id);
  			this.accom_svc.getPropertyApartments(prop.prop_id)
  			.pipe(
  				take(1)
  			)
  			.subscribe(aparts =>{
  				this.loading = false;
  			},
  			(err) =>{
  				this.loading = false;
  				console.log(err)
  			})
  			this.accom_svc.getPropertyById(prop.prop_id)
  			.pipe(
  				take(1)
  			)
  			.subscribe(ppty =>{
  				this.property = ppty
  			})
  		}
  	})
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditPropertyPage');
  }

  gotoApartment(apartment: Apartment){
    this.local_db.setApartment(apartment).then(data => this.navCtrl.push('InfoPage'))
    .catch(err => {
      console.log(err);
      this.loading = false;
    });
  }

  remove(index: number){
  	let sure = confirm('Are you sure you want to delete this picture ?');
    if(index >= 0 && sure == true){
      this.images.splice(index, 1);
    }
  }

}
