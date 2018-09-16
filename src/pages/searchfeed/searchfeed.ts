import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { SearchfeedProvider } from '../../providers/searchfeed/searchfeed';
import { Observable } from 'rxjs-compat';
import { Search } from '../../models/search.interface';
import { MessageInputPopupPage } from '../message-input-popup/message-input-popup';

@IonicPage()
@Component({
  selector: 'page-searchfeed',
  templateUrl: 'searchfeed.html',
})
export class SearchfeedPage {

  searches: Observable<Search[]>;
  search: Search;
  inputVisible: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private object_init: ObjectInitProvider,
  	private searchfeed_svc: SearchfeedProvider, private modal: ModalController){
  	this.searches = this.searchfeed_svc.getAllSearches();
  	this.search = this.object_init.initializeSearch();
  }


  ionViewDidLoad() {
   // console.log('ionViewDidLoad SearchfeedPage');
  }

  showInput(search){
    this.modal.create(MessageInputPopupPage, search).present();
  }



}
