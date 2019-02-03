import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Placement } from '../../models/placement.interface';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
/**
 * Generated class for the PlacementsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-placements',
  templateUrl: 'placements.html',
})
export class PlacementsPage {
  placement: Placement;
  
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private object_init: ObjectInitProvider,
  	private accom_svc: AccommodationsProvider,
  	private storage: LocalDataProvider,
  	private toast_svc: ToastSvcProvider) {
  	this.placement = this.object_init.initializePlacement();
  	this.storage.getUser()
  	.then(user =>{
  		this.placement.agent_dp = user.photoURL;
  		this.placement.agent_firstname = user.firstname;
  		this.placement.agent_lastname = user.lastname;
  		this.placement.agent_id = user.uid;
  	})
  	
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlacementsPage');
  }

  place(){
  	this.placement.placement_date = Date.now();
  	this.accom_svc.makePlacement(this.placement)
  	.then(() =>{
  		this.toast_svc.showToast('Placement success!')
  	})
  	.catch(err =>{
  		this.toast_svc.showToast('Placement failed')
  	})
  }

}
