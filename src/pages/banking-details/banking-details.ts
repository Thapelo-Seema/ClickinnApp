import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { User } from '../../models/users/user.interface';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
/**
 * Generated class for the BankingDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-banking-details',
  templateUrl: 'banking-details.html',
})
export class BankingDetailsPage {
  user: User;	//the current user
  loader = this.loadingCtrl.create();
  constructor(
  	public navCtrl: NavController, 
  	private storage: LocalDataProvider,
  	private errHandler: ErrorHandlerProvider,
  	private object_init: ObjectInitProvider,
    private loadingCtrl: LoadingController) {
      this.loader.present();
  	  this.user = this.object_init.initializeUser();
  		this.storage.getUser().then(data =>{
        this.user = this.object_init.initializeUser2(data);
        this.loader.dismiss()
      })
      .catch(err => {
        this.loader.dismiss()
        this.errHandler.handleError(err);
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BankingDetailsPage');
  }

  gotoEdit(){
    this.navCtrl.push('EditBankingPage');
  }

}
