import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-alert',
  templateUrl: 'alert.html',
})
export class AlertPage {
	warning = {
		title: 'string',
 		message: 'string'
	}
  
  constructor( public navParams: NavParams, private viewCtrl: ViewController){
  }

  ionViewWillLoad(){
  	this.warning = this.navParams.get('data');
  }

  close(){
  	this.viewCtrl.dismiss();
  }

}
