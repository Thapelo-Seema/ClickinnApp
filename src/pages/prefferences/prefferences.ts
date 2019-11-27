import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { Address } from '../../models/location/address.interface';
import { Search } from '../../models/search.interface';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { AngularFirestore } from 'angularfire2/firestore';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
//import { AlertPage } from '../alert/alert';
//import { SeekingPage } from '../seeking/seeking';
//import { AngularFireAuth } from 'angularfire2/auth';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { User } from '../../models/users/user.interface';

@IonicPage()
@Component({
  selector: 'page-prefferences',
  templateUrl: 'prefferences.html',
})
export class PrefferencesPage {

  search_object: Search;
  pointOfInterest: Address ;
  more: boolean = false;
  loader = this.loadingCtrl.create();
  user: User;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private alert: ModalController,  
  	private storage: LocalDataProvider, 
    private afs: AngularFirestore,
    private errHandler: ErrorHandlerProvider,
    private object_init: ObjectInitProvider,
    private alertCtrl: AlertController, 
    private loadingCtrl: LoadingController){
    this.loader.present()
    this.user = this.object_init.initializeUser();
    this.pointOfInterest = this.object_init.initializeAddress();
    this.search_object = this.object_init.initializeSearch();
    let searchObj: Search = this.navParams.get("searchObj");
    if(searchObj != undefined && searchObj != null){
      this.search_object.contact_on_WhatsApp = searchObj.contact_on_WhatsApp;
      this.search_object.searcher_contact = searchObj.searcher_contact;

    }
    this.storage.getUser()
    .then(user => {
      this.user = this.object_init.initializeUser2(user);
      this.storage.getPOI()
      .then(data => {
        this.pointOfInterest = data;
        this.loader.dismiss()
      })
      .catch(err => {
        this.errHandler.handleError(err);
        this.loader.dismiss()
      })
    })
    .catch(err => {
      this.errHandler.handleError(err);
      this.loader.dismiss()
    })
  	
  }

  gotoSeekPage(){
    
     if(this.search_object.maxPrice == 0 || this.search_object.maxPrice == null){
      this.showWarnig(
          'Price limit not set!',
          'The maximum price (rent) must be entered before you can proceed.'
        );
      return;
    }
    this.search_object.searcher_id = this.user.uid;
    if(this.user.firstname != undefined && this.user.firstname != null){
      this.search_object.searcher_name = this.user.firstname + ' ' + this.user.lastname;
    }else if(this.user.displayName != undefined && this.user.displayName != null){
      this.search_object.searcher_name = this.user.displayName;
    }else{
      this.search_object.searcher_name = 'Anonymous';
    }
    this.search_object.searcher_dp = this.user.photoURL;
    this.search_object.Address = this.pointOfInterest;
    this.search_object.maxPrice = Number(this.search_object.maxPrice);
    this.search_object.minPrice = Number(this.search_object.minPrice);
    this.search_object.timeStamp = Date.now();
    if(this.user.user_type != 'agent'){
      console.log('Logging search in database: ', this.search_object);
      this.afs.collection('Searches2').add(this.search_object)
      .catch(err => {
        this.errHandler.handleError(err);
      })
    }
    this.navCtrl.push('SeekingPage', {search: this.search_object, poi: this.pointOfInterest, user: this.user});
    this.storage.setSearch(this.search_object)
    .catch(err => {
      this.errHandler.handleError(err);
    })
  }

  showWarnig(title: string, message: string){
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: ['OK']
    })
    alert.present();
  }

  showMore(){
    this.more = !this.more;
  }


}
