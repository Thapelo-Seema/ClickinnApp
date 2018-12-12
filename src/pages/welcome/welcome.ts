import { Component} from '@angular/core';
import { IonicPage, NavController, ModalController, ToastController, Platform, AlertController} from 'ionic-angular';
import { MapsProvider } from '../../providers/maps/maps';
import { Address } from '../../models/location/address.interface';
import { AngularFirestore } from 'angularfire2/firestore';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { User } from '../../models/users/user.interface';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { Subscription } from 'rxjs-compat/Subscription';



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
  search: boolean = false;
  userSubs: Subscription;
  loading: boolean = false;
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
    private alertCtrl: AlertController){
    this.platform.ready().then(value =>{
      this.loading = true; //indicate that data is being loaded from the database
      this.user = this.object_init.initializeUser(); //Initialize user object with default values
      this.pointOfInterest = this.object_init.initializeAddress(); //Initialize the point of interest with default values
      this.pointOfInterest.description = ''; //Initialize the description of the the POI with an empty string (for some strange reason)
      this.storage.getUser().then(data =>{ //Get a cached copy of user
          //Subscribing to the most recent user object in the database
          this.userSubs = this.afs.collection('Users').doc<User>(data.uid).valueChanges().subscribe(user =>{
            this.user = user;
            this.loading = false;
          }, 
          err =>{
            //If theres an error getting the user info from the firestore database display the error message from firestore and stop the spinner
            this.errHandler.handleError(err);
            this.loading = false;
          })
        })
        .catch(() => {
          //If there's an error getting the user from the local storage display the message below and stop the spinner
          this.errHandler.handleError({message: "Could not find local user", code: 101});
          this.loading = false;
        })
    })
  }

  //Unsubscribe from all subscriptions before leaving the page
  ionViewDidLeave(){
    console.log('Welcome page unsubscrinbing...')
    this.userSubs.unsubscribe();
  }

  //Navigating to the chats page
  gotoChats(){
    this.loading = true;
    this.navCtrl.push('ChatsPage');
    this.loading = false;
  }
  
/*Navigating to the next page, which is the PrefferencesPage and passing the pointOfInterest object along*/
  nextPage(){
    //If the POI is not set by a google maps response throw an error otherwise cache the POI and navigate to the next page
    if(this.pointOfInterest.lat == 0 && this.pointOfInterest.lng == 0){
      this.showWarnig(
        'Enter area or institution!',
        'Please enter the name of your institution or the area (city) where you want us to search for your accommodation.'
        )
      return;
    }
    this.storage.setPOI(this.pointOfInterest).then(data =>{
      this.navCtrl.push('PrefferencesPage');
    })
    .catch(err => {
      this.errHandler.handleError({message: 'Could not set POI', code: 102});
      this.loading = false;
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
    this.loading = true;
    this.navCtrl.push('OwnersDashboardPage')
    this.loading = false;
  }

  gotoLandlordDash(){
    this.loading = true;
    this.storage.setUserType('Landlord')
    .then(val =>{
      this.navCtrl.push('LandlordDashboardPage');
      this.loading = false;
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
