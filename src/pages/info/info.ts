import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Apartment } from '../../models/properties/apartment.interface';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { Image } from '../../models/image.interface';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import { Address } from '../../models/location/address.interface';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { User } from '../../models/users/user.interface';
import { Property } from '../../models/properties/property.interface';
import { take } from 'rxjs-compat/operators/take';
import { UserSvcProvider } from '../../providers/user-svc/user-svc';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
//import { ChatMessage } from '../../models/chatmessage.interface';

@IonicPage()
@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {

  apartment: Apartment;
  adjustedDuration: number = 0;
  pointOfInterest: Address ;
  images: Image[] = [];
  loading: boolean = false;
  canEdit: boolean = false;
  user: User;
  to: any;
  property: Property;
  heart: string = "ios-heart-outline";
  //chatMessage: ChatMessage;
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
    private storage: LocalDataProvider, 
  	private errHandler: ErrorHandlerProvider, 
    private object_init: ObjectInitProvider,
    private accom_svc: AccommodationsProvider,
    private user_svc: UserSvcProvider,
    private toast_svc: ToastSvcProvider,
    private alertCtrl: AlertController) {
      //this.chatMessage = this.object_init.initializeChatMessage();
      this.apartment = this.object_init.initializeApartment();
      this.property = this.object_init.initializeProperty()
      this.pointOfInterest = this.object_init.initializeAddress();
  }

  ionViewWillLoad(){
    this.showAlert();
    this.user = this.object_init.initializeUser();
    this.storage.getPOI().then(data => {
      this.pointOfInterest = data;
      //console.log('Description: ' + this.pointOfInterest.description + '\n' + 'Name: ' + this.pointOfInterest.name)
    })
    .catch(err => {
      this.errHandler.handleError(err);
      this.loading = false;
    })
  	this.storage.getApartment().then(data => {
      this.apartment = data;
      this.accom_svc.getPropertyById(data.prop_id)
      .pipe(
        take(1)
      )
      .subscribe(ppty =>{
        this.property = this.object_init.initializeProperty2(ppty);
        console.log('nearbys ', this.property.nearbys)
      })
      this.storage.getUser().then(user => {
        this.user = user;
        this.user_svc.getUser(data.property.user_id)
        .pipe(
          take(1)
        )
        .subscribe(host =>{
          //this.chatMessage = this.object_init.initializeChatMessageInComp(user, host);
          this.to = {
            displayName: host.firstname,
            dp: host.photoURL,
            uid: host.uid,
            topic: `Interest in your ${this.apartment.room_type} at ${this.apartment.property.address.description}`
          }
          this.storage.setMessageDetails(this.to)
        })
        if(user.liked_apartments.indexOf(data.apart_id) != -1){
          this.heart = 'ios-heart';
        }else{
          this.heart = 'ios-heart-outline';
        }
        if(this.user.uid != undefined && this.apartment.property.user_id != undefined && 
          this.apartment.property.user_id == this.user.uid){
          this.canEdit = true;
        }
      }).catch(err => console.log(err));
      if(this.apartment.property.nearbys == undefined || this.apartment.property.nearbys == null || 
        this.apartment.property.nearbys.length == 0 ){
        this.apartment.property.nearbys = [];
      }
      this.images = [];
      this.images = Object.keys(data.images).map(imageId =>{
        this.imagesLoaded.push(false);
        return data.images[imageId]
      })
      console.log(this.images);
  	})
    .catch(err => {
      this.errHandler.handleError(err);
      this.loading = false;
    })
 }

 gotoApartment(apartment: Apartment){
    this.storage.setApartment(apartment).then(data => this.navCtrl.push('EditApartmentPage'))
    .catch(err => {
      console.log(err);
      this.loading = false;
    });
  }

  gotoAppointment(){
    this.navCtrl.push('AppointmentPage')
  }

  gotoSecure(){
    this.navCtrl.push('SecurePage')
  }

  addToLiked(){
    if(this.user.liked_apartments.indexOf(this.apartment.apart_id) != -1){
      this.heart = 'ios-heart-outline';
      this.user.liked_apartments.splice(this.user.liked_apartments.indexOf(this.apartment.apart_id), 1);
      this.user_svc.updateUser(this.user)
    }else{
      this.heart = 'ios-heart';
      this.user.liked_apartments.push(this.apartment.apart_id);
      this.user_svc.updateUser(this.user).then(() =>{
        this.toast_svc.showToast("Apartment added to your 'liked apartments' ")
      })
      .catch(err => console.log(err))
    }
  }

  sendMessage(){
    this.navCtrl.push('MessageInputPopupPage')
  }

  showAlert() {
    let showPaymentSaftey: boolean = false;
    let alertC = this.alertCtrl.create({
      title: 'Alert !',
      message: `Please note that if you want to secure an apartment immediately, we highly recommend that you use the Clickinn payment system ( it is a much safer option than paying money directly to the advertiser )`,
      buttons: [
        {
          role: 'cancel',
          text: "OK",
          handler: data =>{
            showPaymentSaftey = false;
          }
        },
        {
          text: 'Find out more',
          handler: data =>{
            showPaymentSaftey = true;
          }
        }
      ]
    });
    alertC.present();
    alertC.onDidDismiss(data =>{
      if(showPaymentSaftey){
        alert('We shall explain on our own time lol !')
      }
    })
  }


}
