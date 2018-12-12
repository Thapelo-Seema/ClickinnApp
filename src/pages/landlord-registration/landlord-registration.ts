import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, Platform, AlertController } from 'ionic-angular';
import { MapsProvider } from '../../providers/maps/maps';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { AngularFirestore } from 'angularfire2/firestore';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { User } from '../../models/users/user.interface';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { Subscription } from 'rxjs-compat/Subscription';
import { UserSvcProvider } from '../../providers/user-svc/user-svc';

/**
 * Generated class for the LandlordRegistrationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-landlord-registration',
  templateUrl: 'landlord-registration.html',
})
export class LandlordRegistrationPage {
  predictions: any[] = [];
  user: User;
  userSubs: Subscription;
  loading: boolean = false;
  predictionLoading: boolean = false;
  connectionError: boolean = false;
  online: boolean = false;
  areas: any[] = [];
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private storage: LocalDataProvider,
    private map_svc: MapsProvider, 
    private alert: ModalController, 
    private afs: AngularFirestore, 
    private errHandler: ErrorHandlerProvider, 
    private object_init: ObjectInitProvider, 
    private toastCtrl: ToastController,
    private platform: Platform,
    private alertCtrl: AlertController,
    private user_svc: UserSvcProvider) {
  	this.user = this.object_init.initializeUser();
  	this.storage.getUser()
  	.then(data =>{
  		this.user = this.object_init.initializeUser2(data);
  		console.log('Landlord: ', this.user)
  	})
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LandlordRegistrationPage');
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
      this.user.locations.push(data)
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
    return input.split(',')[0] + ', ' + input.split(',')[1];
  }

  deleteNearby(index: number){
    let confirm: boolean = false;
    let alert = this.alertCtrl.create({
      title: "CONFIRM DELETE",
      message: 'Are you sure you want to delete this area ?',
      buttons: [
        {
          text: 'Delete',
          handler: data =>{
            confirm = true;
          }
        },
        {
          role: 'cancel',
          text: 'Cancel',
          handler: data =>{
            confirm = false;
          }
        }
      ]
    })
    alert.present();
    alert.onDidDismiss(data =>{
      if(index >= 0 && confirm == true){
        this.user.locations.splice(index, 1);
      }
    })
  }

  save(){
  	this.loading = true;
  	this.user.user_type = 'landlord';
  	this.user_svc.updateUser(this.user)
  	.then(() =>{
  		this.loading = false;
  		this.showToast('Landlord profile successfully updated!')
  	})
  	.catch(err =>{
  		this.loading = false;
  		this.errHandler.handleError(err)
  	})
  }

  

}
