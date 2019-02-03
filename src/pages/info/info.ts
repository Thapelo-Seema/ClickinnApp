import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
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
import { CallNumber } from '@ionic-native/call-number';

@IonicPage()
@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {

  apartment: Apartment;
  //adjustedDuration: number = 0;
  pointOfInterest: Address ;
  images: Image[] = [];
  loader = this.loadingCtrl.create();
  canEdit: boolean = false;
  user: User;
  to: any;
  property: Property;
  heart: string = "ios-heart-outline";
  //chatMessage: ChatMessage;
  imagesLoaded: boolean[] = 
  [ false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, 
    false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false
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
    private alertCtrl: AlertController, 
    private loadingCtrl: LoadingController,
    private callNumber: CallNumber){
      //this.chatMessage = this.object_init.initializeChatMessage();
      //his.loader.present();
      this.apartment = this.object_init.initializeApartment();
      this.property = this.object_init.initializeProperty();
      this.pointOfInterest = this.object_init.initializeAddress();
      this.user = this.object_init.initializeUser();
      this.storage.getPOI().then(data1 => {
      this.pointOfInterest = data1;
        //console.log('Description: ' + this.pointOfInterest.description + '\n' + 'Name: ' + this.pointOfInterest.name)
      })
      .catch(err => {
        this.errHandler.handleError(err);
      })
      this.storage.getApartment().then(data => {
      console.log('apartment: ', data)
      console.log('data.property.images: ', data.property.images)
      this.apartment = this.object_init.initializeApartment2(data);
      //this.loader.dismiss()
      if(data.prop_id){
        this.accom_svc.getPropertyById(data.prop_id)
        .pipe(take(1))
        .subscribe(ppty =>{
          this.property = this.object_init.initializeProperty2(ppty);
          console.log('nearbys ', this.property.nearbys)
        })
      }else if(data.property.prop_id){
        this.accom_svc.getPropertyById(data.property.prop_id)
        .pipe(take(1))
        .subscribe(ppty =>{
          this.property = this.object_init.initializeProperty2(ppty);
          console.log('nearbys ', this.property.nearbys)
        })
      }
      
      this.storage.getUser().then(user => {
        this.user = this.object_init.initializeUser2(user)
        //if(this.user.firstime == true) this.showAlert();
        if(data.user_id){
          this.user_svc.getUser(data.user_id)
          .pipe(take(1))
          .subscribe(host =>{
            //this.chatMessage = this.object_init.initializeChatMessageInComp(user, host);
            this.to = {
              displayName: host.firstname,
              dp: host.photoURL,
              uid: host.uid,
              topic: `Interest in your ${this.apartment.room_type} at ${this.apartment.property.address ? this.apartment.property.address.description : ''}`
            }
            this.storage.setMessageDetails(this.to)
          })
        }else if(data.property.user_id){
          this.user_svc.getUser(data.property.user_id)
          .pipe(take(1))
          .subscribe(host =>{
            //this.chatMessage = this.object_init.initializeChatMessageInComp(user, host);
            this.to = {
              displayName: host.firstname,
              dp: host.photoURL,
              uid: host.uid,
              topic: `Interest in your ${this.apartment.room_type} at ${this.apartment.property.address ? this.apartment.property.address.description : ''}`
            }
            this.storage.setMessageDetails(this.to)
          })
        }else if(data.agent){
          this.user_svc.getUser(data.agent)
          .pipe(take(1))
          .subscribe(host =>{
            //this.chatMessage = this.object_init.initializeChatMessageInComp(user, host);
            this.to = {
              displayName: host.firstname,
              dp: host.photoURL,
              uid: host.uid,
              topic: `Interest in your ${this.apartment.room_type} at ${this.apartment.property.address ? this.apartment.property.address.description : ''}`
            }
            this.storage.setMessageDetails(this.to)
          })
        }
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
      let tempImages = []

      console.log('property images: ', data.property.images)
      //Populating tempImages with the apartments images
      tempImages = Object.keys(data.images).map(imageId =>{
        this.imagesLoaded.push(false);
        return data.images[imageId]
      })

      console.log('tempImages: ', tempImages)
      //Populating propImages with the apartments property images
      let propImages = Object.keys(data.property.images).map(imageId =>{
        this.imagesLoaded.push(false);
        return data.property.images[imageId]
      })
      //Transferring apartment images
      console.log('propImages: ', propImages)
      tempImages.forEach(mg =>{
        console.log(mg)
        if(mg != undefined) this.images.push(mg)
      })
      //Transferring property images
      console.log('images after adding temp: ', this.images)
      propImages.forEach(mg =>{
        console.log(mg)
        if(mg != undefined) this.images.push(mg)
      })
      console.log('images after adding prop: ', this.images)
    })
    .catch(err => {
      this.errHandler.handleError(err);
      //this.loader.dismiss()
    })
  }

  ionViewWillLoad(){
    this.storage.getPaymentWarningSeen()
    .then(val =>{
      if(val == undefined){
        this.showAlert();
      }
    })
    

  	
 }

 gotoApartment(apartment: Apartment){
    this.storage.setApartment(apartment).then(data => this.navCtrl.push('EditApartmentPage'))
    .catch(err => {
      console.log(err);
    });
  }

  gotoMap(){
    this.navCtrl.push('MapPage');
  }

  gotoAppointment(){
    this.navCtrl.parent.select(1)
    this.navCtrl.push('AppointmentPage')
  }

  gotoSecure(){
    this.navCtrl.parent.select(2)
    this.navCtrl.push('SecurePage')
  }

  addToLiked(){
    let ldr = this.loadingCtrl.create();
    ldr.present()
    if(this.user.liked_apartments.indexOf(this.apartment.apart_id) != -1){
      this.heart = 'ios-heart-outline';
      this.user.liked_apartments.splice(this.user.liked_apartments.indexOf(this.apartment.apart_id), 1);
      this.user_svc.updateUser(this.user)
      .then(() =>{
        ldr.dismiss()
      })
    }else{
      this.heart = 'ios-heart';
      this.user.liked_apartments.push(this.apartment.apart_id);
      this.user_svc.updateUser(this.user).then(() =>{
        ldr.dismiss()
        .then(dat =>{
          this.toast_svc.showToast("Apartment added to your 'liked apartments' ")
        })
      })
      .catch(err => {
        ldr.dismiss()
        console.log(err)
      })
    }
  }

  sendMessage(){
    let to: any;
      to = {
        name: '',
        uid: this.apartment.user_id ? this.apartment.user_id : this.apartment.property.user_id  ,
        dp: this.apartment.dP,
        topic: `Regarding the ${this.apartment.room_type} in ${this.returnFirst(this.apartment.property.address.description)}`
      }

    this.storage.setMessageDetails(to).then(val =>{
      this.navCtrl.push('MessageInputPopupPage', to);
    })
  }

  returnFirst(input: string): string{
    if(input == undefined) return '';
    return input.split(" ")[0];
  }

  showAlert() {
    let showPaymentSaftey: boolean = false;
    let alertC = this.alertCtrl.create({
      title: 'Payment Alert ',
      cssClass: 'alertNoty',
      message: `Please note that if you want to secure an apartment immediately, we highly recommend that you use the Clickinn payment system by clicking on the shopping cart icon below ( it is a much safer option than paying money directly to the advertiser )`,
      inputs:[
        {
           name: 'dismis',
           type: 'checkbox',
           checked: false,
           label: 'Do not show this again',
           value: "false"
        }
      ],
      buttons: [
        {
          role: 'cancel',
          text: "OK",
          handler: data =>{
            if(data.length > 0){
              this.storage.setPaymentWarningSeen()
            }
            showPaymentSaftey = false;
          }
        },
        {
          text: 'Find out more',
          handler: data =>{
            if(data.length > 0){
              this.storage.setPaymentWarningSeen()
            }
            showPaymentSaftey = true;
          }
        }
      ]
    });
    alertC.present();
    alertC.onDidDismiss(data =>{
      
      if(showPaymentSaftey){
        this.navCtrl.push('PaymentDetailsPage');
      }
    })
  }

  callLandlord(uid: string){
    this.toast_svc.showToast('Please note that network charges may apply for making this call...')
    this.user_svc.getUser(uid)
    .pipe(take(1))
    .subscribe(user =>{
      
        this.callNumber.callNumber(user.phoneNumber, false)
        .catch(err =>{
          this.errHandler.handleError(err)
        })
    })
  }


}
