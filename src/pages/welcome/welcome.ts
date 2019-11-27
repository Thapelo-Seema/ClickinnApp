import { Component} from '@angular/core';
import { IonicPage, NavController, ModalController, ToastController, Platform, AlertController, NavParams, LoadingController} from 'ionic-angular';
import { MapsProvider } from '../../providers/maps/maps';
import { Address } from '../../models/location/address.interface';
import { AngularFirestore } from 'angularfire2/firestore';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { User } from '../../models/users/user.interface';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
//import { Subscription } from 'rxjs-compat/Subscription';
import { UserSvcProvider } from '../../providers/user-svc/user-svc';
import { take } from 'rxjs-compat/operators/take';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { Search } from '../../models/search.interface';


@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {
  //statusMessage: string = '';
  predictions: any[] = [];
  pointOfInterest: Address;
  user: User;
  userSearch: Search = this.object_init.initializeSearch();
  search: boolean = false;
  unseenNotifications: number = 0;
  chats: number = 0;
  //userSubs: Subscription;
  
  predictionLoading: boolean = false;
  connectionError: boolean = false;
  online: boolean = false;
  constructor(
    public navCtrl: NavController, 
    private storage: LocalDataProvider,
    private map_svc: MapsProvider, 
    private alert: ModalController, 
    private afs: AngularFirestore, 
    private errHandler: ErrorHandlerProvider, 
    private object_init: ObjectInitProvider, 
    private toastCtrl: ToastController,
    private platform: Platform,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private user_svc: UserSvcProvider,
    private chat_svc: ChatServiceProvider,
    private navParams: NavParams){
    console.log('welcome constructor...');
    let ldng = this.loadingCtrl.create();
    //ldng.setDuration(2000);
    //ldng.present();
    this.user = this.object_init.initializeUser2(this.navParams.data); //Initialize user object with default values
    this.pointOfInterest = this.object_init.initializeAddress(); //Initialize the point of interest with default values
    this.pointOfInterest.description = ''; //Initialize the description of the the POI with an empty string (for some strange reason)
    console.log('navParams.data in welcome: ', this.navParams.data);
    /*if(this.user != null && this.user != undefined){
      ldng.dismiss();
      if(this.user.uid){
        console.log('user ready for notifications')
        this.chat_svc.getUnseenChats(this.user.uid)
        .subscribe(chats =>{
          if(chats.length > 0){
            console.log('Unseen chats: ', chats.length)
            this.unseenNotifications = this.unseenNotifications - this.chats + chats.length
            this.chats = chats.length
          }else{
            this.unseenNotifications -= this.chats;
            this.chats = chats.length
          }
        })
      }
    }else{
*/    console.log('fetching user from cache...')
      this.storage.getUser()
      .then(user =>{
        console.log('Got user: ', user);
        if(user){
          this.user = this.object_init.initializeUser2(user);
        }else{
          this.navCtrl.setRoot('LoginPage');
        }
      })
  }

  //Unsubscribe from all subscriptions before leaving the page
  ionViewWilLeave(){

  }

  //Navigating to the chats page
  gotoChats(){
    this.navCtrl.push('ChatsPage');
  }

  gotoNsfas(){
    this.navCtrl.push('NsfasPage')
  }
  
/*Navigating to the next page, which is the PrefferencesPage and passing the pointOfInterest object along*/
  nextPage(){
    this.userSearch.searcher_email = this.user.email;
    //If the POI is not set by a google maps response throw an error otherwise cache the POI and navigate to the next page
    if(this.pointOfInterest.lat == 0 && this.pointOfInterest.lng == 0){
      this.showWarnig(
        'Enter Place Or Institution!',
        'Please enter the name of your institution or the place (city / town / township) where you want us to search for your accommodation.'
        )
      return;
    }
    this.storage.setPOI(this.pointOfInterest).then(data =>{
      this.navCtrl.push('PrefferencesPage', {searchObj: this.userSearch});
    })
    .catch(err => {
      this.errHandler.handleError({message: 'Could not set POI', code: 102});
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
    setTimeout(() =>{
      if(this.pointOfInterest.lat == 0 && this.pointOfInterest.lng == 0 && this.predictions == [] && this.pointOfInterest.description == ''){
        console.log('poi: ', this.pointOfInterest)
        console.log('predictions: ', this.predictions)
        this.handleNetworkError();
      }
    }, 10000)
  }

  showToast(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 9000
    })
    toast.present();
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

  gotoOwners(){
    this.storage.getFirstTime()
    .then(val =>{
      if(val == true){
        this.user.user_type = 'landlord';
        this.storage.setUser(this.user)
        .then(dat =>{
          console.log('User before update: ', this.user)
          
          this.navCtrl.push('OwnersDashboardPage')
        })
      }else{
        this.user.user_type = 'landlord';
        this.storage.setUser(this.user)
        .then(dat =>{
          console.log('User before update: ', this.user)
          
          this.navCtrl.push('OwnersDashboardPage')
        })
      }
    })
    .catch(err =>{
      console.log('User before update: ', this.user)
        
        this.navCtrl.push('OwnersDashboardPage')
    })
    
  }

  gotoLandlordDash(){
    this.storage.getFirstTime()
    .then(dat =>{
      if(dat == true){
        this.user.user_type = 'agent';
        this.storage.setUser(this.user)
        .then(val =>{
          this.navCtrl.push('LandlordDashboardPage');
        })
      }else{
        this.user.user_type = 'agent';
        this.storage.setUser(this.user)
        .then(val =>{
          this.navCtrl.push('LandlordDashboardPage');
        })
      }
    })
    .catch(err =>{
      this.user.user_type = 'agent';
      this.storage.setUser(this.user)
      .then(val =>{
        this.navCtrl.push('LandlordDashboardPage');
      })
    })
  }

  showSearch(){
    this.search = true;
  }

  showOptions(){
    this.search = false;
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
