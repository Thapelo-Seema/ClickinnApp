import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ObjectInitProvider } from '../../providers/object-init/object-init';

@IonicPage()
@Component({
  selector: 'page-confirmation',
  templateUrl: 'confirmation.html',
})
export class ConfirmationPage {
  confirmation = {
		title: 'string',
 		message: 'string'
  }
	
  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController,
    private object_init: ObjectInitProvider) {
  }

  ionViewWillLoad() {
    this.confirmation = this.navParams.get('data');  
  }

  close(){
  	this.viewCtrl.dismiss(false);
  }

  confirm(){
  	this.viewCtrl.dismiss(true);
  }

}
