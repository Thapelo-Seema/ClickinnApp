import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, Content, AlertController } from 'ionic-angular';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { SearchfeedProvider } from '../../providers/searchfeed/searchfeed';
import { Observable } from 'rxjs-compat';
import { Search } from '../../models/search.interface';
import { MapsProvider } from '../../providers/maps/maps';
import { User } from '../../models/users/user.interface';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { take } from 'rxjs-compat/operators/take';
import { PaginationProvider } from '../../providers/pagination/pagination';
import { Subscription } from 'rxjs-compat/Subscription';
import { Address } from '../../models/location/address.interface';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';

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
  loadingSubs: Subscription;
  doneSubs: Subscription;
  dataSubs: Subscription;
  loading: boolean = true;
  loadingMore: boolean = false;
  done: boolean = false;
  predictions: any[] = [];
  pointOfInterest: Address;
  userSubs: Subscription;
  predictionLoading: boolean = false;
  connectionError: boolean = false;
  online: boolean = false;
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
    private map_svc: MapsProvider,
    private errHandler: ErrorHandlerProvider,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private page: PaginationProvider){
  	
    this.searchfeed_svc.getAllSearches();
    this.pointOfInterest = this.object_init.initializeAddress(); //Initialize the point of interest with default values
    this.pointOfInterest.description = '';
    this.user = this.object_init.initializeUser();
    this.local_db.getUser().then(user =>{
      if(user) this.user = user;
    })
  	this.search = this.object_init.initializeSearch();
    this.loadingSubs = this.searchfeed_svc.loading.subscribe(dat =>{
      this.loadingMore = dat
      console.log('loading... ', this.loadingMore)
    })
    this.doneSubs = this.searchfeed_svc.done.subscribe(dat =>{
      this.done = dat
      if(dat == true) this.loadingMore = false;
      console.log('done... ', this.done)
    })
    this.dataSubs = this.searchfeed_svc.data
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

  gotoLandlordSearch(){
    this.navCtrl.push('LandlordSearchPage')
  }

  gotoMyLandlords(){
    this.navCtrl.push('MyLandlordsPage')
  }

  gotoMyAgents(){
    this.navCtrl.push('MyAgentsPage')
  }

  ionViewDidLoad(){
    this.monitorEnd();
  }

  ionViewWillLeave(){
    console.log('Searchfeed unsubscribing...')
    this.dataSubs.unsubscribe();
    this.doneSubs.unsubscribe();
    this.loadingSubs.unsubscribe();
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

  /*Getting autocomplete predictions from the google maps place predictions service*/
  getPredictions(event){
    this.predictionLoading = true;
    //If there is an internet connection try to make requests
    if(window.navigator.onLine){
      this.online = true;
      if(event.key === "Backspace" || event.code === "Backspace"){
        setTimeout(()=>{//Set timeout to limit the number of requests made during a deletion
          this.map_svc.getPlacePredictionsSA(event.target.value).then(data =>{
            this.handleSuccess(data);
          })
          .catch(err =>{
            console.log('Error 1')
            this.handleNetworkError();
          })
        }, 3000)
      }else{// When location is being typed
        this.map_svc.getPlacePredictionsSA(event.target.value).then(data =>{
          if(data == null || data == undefined ){
            console.log('Error 2')
            this.handleNetworkError();
          }else{
            this.handleSuccess(data);
          }
        })
        .catch(err => {
          console.log('Error 3')
          this.handleNetworkError();
        })
      }
    }else{ //If there's no connection set online status to false, show message and stop spinner
      this.online = false;
      this.predictionLoading = false;
      this.showToast('You are not connected to the internet...')
    }
  }


  cancelSearch(){
    this.predictions = [];
    this.predictionLoading = false;
  }

  selectPlace(place){
    this.predictionLoading = true;
    this.map_svc.getSelectedPlace(place).then(data => {
      this.pointOfInterest = data;
      this.predictions = [];
      this.predictionLoading = false;
    })
    .catch(err => {
      this.errHandler.handleError(err);
      this.predictionLoading = false;
    })
  }

  handleSuccess(data: any[]){
    this.connectionError = false;
    this.predictions = [];
    this.predictions = data;
    this.predictionLoading = false;
  }

  handleNetworkError(){
    if(this.connectionError == false)
      this.errHandler.handleError({message: 'You are offline...check your internet connection'});
      this.predictionLoading = false;
      this.connectionError = true;
  }

  showWarnig(title: string, message: string){
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: ['OK']
    })
    alert.present();
  }

  returnFirst(input: string): string{
    if(input == undefined) return '';
    return input.split(" ")[0];
  }

  
}
