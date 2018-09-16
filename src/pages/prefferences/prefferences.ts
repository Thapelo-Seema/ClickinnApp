import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Address } from '../../models/location/address.interface';
import { Search } from '../../models/search.interface';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { AngularFirestore } from 'angularfire2/firestore';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { AlertPage } from '../alert/alert';
import { SeekingPage } from '../seeking/seeking';
import { AngularFireAuth } from 'angularfire2/auth';
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
  loading: boolean = false;
  user: User;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alert: ModalController,  
  	private storage: LocalDataProvider, private afs: AngularFirestore,
    private errHandler: ErrorHandlerProvider, private afAuth: AngularFireAuth, private object_init: ObjectInitProvider){
    this.user = this.object_init.initializeUser();
    this.pointOfInterest = this.object_init.initializeAddress();
    this.search_object = this.object_init.initializeSearch();
    this.storage.getUser().then(user => this.user = user)
    .catch(err => {
      this.errHandler.handleError(err);
      this.loading = false;
    })
  	this.storage.getPOI()
    .then(data => this.pointOfInterest = data)
    .catch(err => {
      this.errHandler.handleError(err);
      this.loading = false;
    })
  }

  gotoSeekPage(){
    this.loading = true;
     if(this.search_object.maxPrice == 0 || this.search_object.maxPrice == null){
      this.showWarnig(
          'Price limit not set!',
          'The maximum price (rent) must be entered before you can proceed.'
        );
      this.loading = false;
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
    this.afs.collection('Searches2').add(this.search_object).then(data =>{
      this.loading = false;
    })
    .catch(err => {
      this.errHandler.handleError(err);
      this.loading = false;
    })
    this.storage.setSearch(this.search_object).then(data =>{
      this.loading = false;
    	this.navCtrl.push(SeekingPage, {search: this.search_object, poi: this.pointOfInterest});
    })
    .catch(err => {
      this.errHandler.handleError(err);
      this.loading = false;
    })
  }

  showWarnig(title: string, message: string){
    const myData = {
      title: title,
      message: message
    }
    let warningModal = this.alert.create(AlertPage, {data: myData})
    warningModal.present();
  }

  showMore(){
    this.more = !this.more;
  }


}
