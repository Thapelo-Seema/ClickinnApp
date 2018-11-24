import { Component} from '@angular/core';
import { IonicPage, NavController, ModalController, ToastController, Platform, AlertController} from 'ionic-angular';
import { MapsProvider } from '../../providers/maps/maps';
import { Address } from '../../models/location/address.interface';
import { AngularFirestore } from 'angularfire2/firestore';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { User } from '../../models/users/user.interface';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
//import { PrefferencesPage } from '../prefferences/prefferences';
//import { AlertPage } from '../alert/alert';
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
  userSubs: Subscription;
  loading: boolean = false;
  predictionLoading: boolean = false;
  connectionError: boolean = false;
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
      
      this.loading = true;
      this.user = this.object_init.initializeUser();
      this.pointOfInterest = this.object_init.initializeAddress();
      this.pointOfInterest.description = '';
      this.storage.getUser().then(data =>{
          this.userSubs = this.afs.collection('Users').doc<User>(data.uid).valueChanges().subscribe(user =>{
            this.user = user;
            this.loading = false;
          }, 
          err =>{
            this.errHandler.handleError(err);
            this.loading = false;
          })
        })
        .catch(() => {
          this.errHandler.handleError({message: "Could not find user"});
          this.loading = false;
        })
    })
  }

  ionViewWillLeave(){
    console.log('Welcome page unsubscrinbing...')
    this.userSubs.unsubscribe();
  }


  gotoChats(){
    this.loading = true;
    this.navCtrl.push('ChatsPage');
    this.loading = false;
  }
  
/*Navigating to the next page, which is the PrefferencesPage and passing the pointOfInterest object along*/
  nextPage(){
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
      this.errHandler.handleError(err);
      this.loading = false;
    })
  }

  /*Getting autocomplete predictions from the google maps place predictions service*/
  getPredictions(event){
    this.predictionLoading = true;
    if(window.navigator.onLine){
      if(event.key === "Backspace" || event.code === "Backspace"){
        setTimeout(()=>{
          this.map_svc.getPlacePredictionsSA(event.target.value).then(data => {
            this.connectionError = false;
            this.predictions = [];
            this.predictions = data;
            this.predictionLoading = false;
          })
          .catch(err => {
            console.log('Error 1')
           if(this.connectionError == false)
            this.errHandler.handleError({message: 'Your internet connection is faulty please try again once a proper connection is established'});
            this.predictionLoading = false;
            this.connectionError = true;
          })
        }, 3000)
      }else{
        this.map_svc.getPlacePredictionsSA(event.target.value).then(data => {
          if(data == null || data == undefined ){
            console.log('Error 2')
            if(this.connectionError == false)
          this.errHandler.handleError({message: 'Your internet connection is faulty please try again once a proper connection is established'});
          this.predictionLoading = false;
          this.connectionError = true;
          }else{
            this.connectionError = false;
            this.predictions = [];
            this.predictions = data;
            this.predictionLoading = false;
          }
        })
        .catch(err => {
          console.log('Error 3')
          if(this.connectionError == false)
          this.errHandler.handleError({message: 'Your internet connection is faulty please try again once a proper connection is established'});
          this.predictionLoading = false;
          this.connectionError = true;
        })
      }
    }else{
      this.showToast('You are not connected to the internet...')
    }
  }

  showToast(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    })
    toast.present();
  }

  cancelSearch(){
    this.predictions = [];
    this.loading = false;
  }

  selectPlace(place){
    this.loading = true;
    this.map_svc.getSelectedPlace(place).then(data => {
      this.pointOfInterest = data;
      this.predictions = [];
      this.loading = false;
    })
    .catch(err => {
      this.errHandler.handleError(err);
      this.loading = false;
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

  returnFirst(input: string): string{
    if(input == undefined) return '';
    return input.split(" ")[0];
  }

}
