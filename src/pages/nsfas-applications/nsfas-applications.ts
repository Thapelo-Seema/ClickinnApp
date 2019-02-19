import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import { Placement } from '../../models/placement.interface';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
/**
 * Generated class for the NsfasApplicationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-nsfas-applications',
  templateUrl: 'nsfas-applications.html',
})
export class NsfasApplicationsPage {
  applications: Placement[] = [];
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private accom_svc: AccommodationsProvider,
  	private object_init: ObjectInitProvider,
  	private toast_svc: ToastSvcProvider) {
  	this.accom_svc.getNSFASPlacements()
  	.subscribe(val =>{
  		this.applications = [];
  		val.forEach(application =>{
  			this.applications.push(this.object_init.initializePlacement2(application))
  		})
  	})
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NsfasApplicationsPage');
  }

  markasSeen(placement: Placement){
  	let seenApp = placement;
  	seenApp.complete = true;
  	this.accom_svc.updateNsfas(seenApp)
  	.then(() =>{
  		this.toast_svc.showToast('Updated')
  	})
  	.catch(err =>{
  		this.toast_svc.showToast(err.message)
  	})
  }

}
