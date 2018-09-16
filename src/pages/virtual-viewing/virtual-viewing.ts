import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
/**
 * Generated class for the VirtualViewingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-virtual-viewing',
  templateUrl: 'virtual-viewing.html',
})
export class VirtualViewingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VirtualViewingPage');
  }

}
