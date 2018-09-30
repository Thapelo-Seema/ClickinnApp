import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { SearchfeedProvider } from '../../providers/searchfeed/searchfeed';
import { Observable } from 'rxjs-compat';
import { Search } from '../../models/search.interface';
import { MessageInputPopupPage } from '../message-input-popup/message-input-popup';
import { User } from '../../models/users/user.interface';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { take } from 'rxjs-compat/operators/take';

@IonicPage()
@Component({
  selector: 'page-searchfeed',
  templateUrl: 'searchfeed.html',
})
export class SearchfeedPage {

  searches: Observable<Search[]>;
  search: Search;
  inputVisible: boolean = false;
  user: User;
  loading: boolean = true;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private object_init: ObjectInitProvider,
  	private searchfeed_svc: SearchfeedProvider, 
    private modal: ModalController, 
    private local_db: LocalDataProvider,
    private toastCtrl: ToastController){
  	this.searches = this.searchfeed_svc.getAllSearches();
  	this.search = this.object_init.initializeSearch();
    this.searchfeed_svc.getAllSearches()
    .pipe(
      take(1)
    )
    .subscribe(searches =>{
      if(searches){
        this.loading = false;
      }
    },
    (err) =>{
        this.loading = false;
        this.showToast('Something went wrong while fetching the searches, please also check if you are connected to the internet')
    })
    setTimeout(() =>{
      if(!this.searches){
        this.loading = false;
        this.showToast('No searches to show, please check internet connection')
      }
    }, 20000)
    this.user = this.object_init.initializeUser();
    this.local_db.getUser().then(user =>{
      if(user) this.user = user;
    })
  }


  ionViewDidLoad(){
   
  }

  showInput(search: Search){
    let to = {
      name: search.searcher_name,
      uid: search.searcher_id,
      dp: search.searcher_dp
    }
    this.modal.create(MessageInputPopupPage, to).present();
  }

  showToast(text: string){
    let toast = this.toastCtrl.create({
      message: text,
      duration: 60000
    })
    toast.present()
  }



}
