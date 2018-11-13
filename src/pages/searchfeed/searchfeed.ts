import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, Content } from 'ionic-angular';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { SearchfeedProvider } from '../../providers/searchfeed/searchfeed';
import { Observable } from 'rxjs-compat';
import { Search } from '../../models/search.interface';
//import { MessageInputPopupPage } from '../message-input-popup/message-input-popup';
import { User } from '../../models/users/user.interface';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { take } from 'rxjs-compat/operators/take';
import { PaginationProvider } from '../../providers/pagination/pagination';

@IonicPage()
@Component({
  selector: 'page-searchfeed',
  templateUrl: 'searchfeed.html',
})
export class SearchfeedPage {
  @ViewChild(Content) content: Content;
  searches: Observable<Search[]>;
  search: Search;
  inputVisible: boolean = false;
  user: User;
  loading: boolean = true;
  loadingMore: boolean = false;
  done: boolean = false;
  imagesLoaded: boolean[] = 
      [false, false, false, false, false, false, false, false, false, false,
       false, false, false, false, false, false, false, false, false, false, 
       false,false, false, false, false, false, false, false, false, false,
       false,false, false, false, false, false, false, false, false, false,
       false,false, false, false, false, false, false, false, false, false
       ];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private object_init: ObjectInitProvider,
  	private searchfeed_svc: SearchfeedProvider, 
    private modal: ModalController, 
    private local_db: LocalDataProvider,
    private toastCtrl: ToastController,
    private page: PaginationProvider){
  	
    this.searchfeed_svc.getAllSearches();
    
    this.user = this.object_init.initializeUser();
    this.local_db.getUser().then(user =>{
      if(user) this.user = user;
    })
  	this.search = this.object_init.initializeSearch();
    this.searchfeed_svc.loading.subscribe(dat =>{
      this.loadingMore = dat
      console.log('loading... ', this.loadingMore)
    })
    this.searchfeed_svc.done.subscribe(dat =>{
      this.done = dat
      if(dat == true) this.loadingMore = false;
      console.log('done... ', this.done)
    })
    this.searchfeed_svc.data
    .subscribe(searches =>{
      if(searches){
        console.log(searches.length)
        this.loading = false;
        
        searches.forEach(ser =>{
          this.imagesLoaded.push(false)
        })
      }
    },
    (err) =>{
        this.loading = false;
        this.showToast('Something went wrong while fetching the searches, please also check if you are connected to the internet')
    })
    
  }

  showInput(search: Search){
    let to = {
      name: search.searcher_name,
      uid: search.searcher_id,
      dp: search.searcher_dp,
      topic: `Regarding your search for a ${search.apartment_type} around ${search.Address.description}`
    }
    this.local_db.setMessageDetails(to).then(val =>{
      this.modal.create('MessageInputPopupPage', to).present();
    })
  }

  showToast(text: string){
    let toast = this.toastCtrl.create({
      message: text,
      duration: 60000
    })
    toast.present()
  }

  

  ionViewDidLoad(){
    this.monitorEnd();
  }

  monitorEnd(){
    //console.log('Content scrollHeight = ', this.content.scrollHeight)
    this.content.ionScrollEnd.subscribe(ev =>{
    let height = ev.scrollElement.scrollHeight;
    let top = ev.scrollElement.scrollTop;
    let offset = ev.scrollElement.offsetHeight;
      if(top > height - offset - 1){
        console.log('bottom')
        this.searchfeed_svc.moreAllSearches()
      }
    })
  }
  
}
