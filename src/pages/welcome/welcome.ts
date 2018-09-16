import { Component} from '@angular/core';
import { IonicPage, NavController, ModalController, ToastController} from 'ionic-angular';
import { MapsProvider } from '../../providers/maps/maps';
import { Address } from '../../models/location/address.interface';
import { AngularFirestore } from 'angularfire2/firestore';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { User } from '../../models/users/user.interface';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { PrefferencesPage } from '../prefferences/prefferences';
import { AlertPage } from '../alert/alert';
import { ObjectInitProvider } from '../../providers/object-init/object-init';

declare var google: any;

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
  loading: boolean = false;
  service = new google.maps.places.AutocompleteService();
  constructor(public navCtrl: NavController, private storage: LocalDataProvider,
  private map_svc: MapsProvider, private alert: ModalController, private afs: AngularFirestore, 
  private errHandler: ErrorHandlerProvider, private object_init: ObjectInitProvider, private toastCtrl: ToastController){
    this.loading = true;
    this.user = this.object_init.initializeUser();
    this.pointOfInterest = this.object_init.initializeAddress();
    this.pointOfInterest.description = '';
    this.storage.getUser().then(data =>{
        this.afs.collection('Users').doc<User>(data.uid).valueChanges().subscribe(user =>{
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
      this.navCtrl.push(PrefferencesPage);
    })
    .catch(err => {
      this.errHandler.handleError(err);
      this.loading = false;
    })
  }

  /*Getting autocomplete predictions from the google maps place predictions service*/
  getPredictions(event){
    this.loading = true;
    if(window.navigator.onLine){
      if(event.key === "Backspace" || event.code === "Backspace"){
        setTimeout(()=>{
          this.map_svc.getPlacePredictionsSA(event.target.value, this.service).then(data => {
            this.predictions = [];
            this.predictions = data;
            this.loading = false;
          })
          .catch(err => {
            if(!window.navigator.onLine){
              this.errHandler.handleError({code: 'no connection', message: 'You do not have an internect connection...'})
            }else{
              this.errHandler.handleError(err);
            }
            this.loading = false;
          })
        }, 3000)
      }else{
        this.map_svc.getPlacePredictionsSA(event.target.value, this.service).then(data => {
          this.predictions = [];
          this.predictions = data;
          this.loading = false;
        })
        .catch(err => {
          this.errHandler.handleError(err);
          this.loading = false;
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
    const myData = {
      title: title,
      message: message
    }
    let warningModal = this.alert.create(AlertPage, {data: myData})
    warningModal.present();
  }

  returnFirst(input: string): string{
    if(input == undefined) return '';
    return input.split(" ")[0];
  }

}
