import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Property } from '../../models/properties/property.interface';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import { LocalDataProvider } from '../../providers/local-data/local-data';


/**
 * Generated class for the BuildingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-buildings',
  templateUrl: 'buildings.html',
})
export class BuildingsPage {

  buildings: Property[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private accom_svc: AccommodationsProvider,
  	private local_db: LocalDataProvider){
  	this.local_db.getUser().then(user =>{
  		this.accom_svc.getUsersProperties(user.uid).subscribe(props =>{
  			this.buildings = props;
  		})
  	})
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuildingsPage');
  }

  gotoProperty(prop: Property){
    this.local_db.setProperty(prop).then(prp =>{
      this.navCtrl.push('EditPropertyPage');
    })
    .catch(err => {
      console.log(err);
    })
  }

}
