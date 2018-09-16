import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { UploadAndEarnPage } from '../upload-and-earn/upload-and-earn'

/**
 * Generated class for the ManageBuildingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manage-buildings',
  templateUrl: 'manage-buildings.html',
})
export class ManageBuildingsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private object_init: ObjectInitProvider) {
  }

  ionViewDidLoad() {
    
  }

  uploadAndEarn(){
    this.navCtrl.push(UploadAndEarnPage);
  }

}
