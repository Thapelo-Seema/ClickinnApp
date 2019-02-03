import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, ModalController, LoadingController } from 'ionic-angular';
import { Apartment } from '../../models/properties/apartment.interface';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
//import { File } from '@ionic-native/file';
//import { FileTransfer } from '@ionic-native/file-transfer';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { User } from '../../models/users/user.interface';
import { take } from 'rxjs-compat/operators/take';
import { DepositProvider } from '../../providers/deposit/deposit';
import { ATMDeposit } from '../../models/atmdeposit.interface';
import { UserSvcProvider } from '../../providers/user-svc/user-svc';
/**
 * Generated class for the SecurePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-secure',
  templateUrl: 'secure.html',
})
export class SecurePage {
  apartment: Apartment;
  reference: string = '';
  loader = this.loadingCtrl.create();
  imageLoaded: boolean  = false;
  user: User;
  deposit: ATMDeposit = null;
  sendingRequest: boolean = false;

  constructor(
    public navCtrl: NavController, 
    private alertCtrl: AlertController,
    private storage: LocalDataProvider, 
    private errHandler: ErrorHandlerProvider, 
    //private file: File, 
   // private fileTransfer: FileTransfer,
    private user_svc: UserSvcProvider,
    private object_init: ObjectInitProvider,
    private deposit_svc: DepositProvider,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController){
    this.loader.present()
    this.deposit = this.object_init.initializeDeposit();
    this.apartment = this.object_init.initializeApartment();
    this.user = this.object_init.initializeUser();
    this.storage.getUser().then(user =>{
      this.user = this.object_init.initializeUser2(user);
      this.deposit.by.firstname = user.firstname;
      this.deposit.by.lastname = user.lastname;
      this.deposit.by.dp = user.photoURL;
      this.deposit.by.uid = user.uid;
      this.storage.getApartment().then(data => {
        this.apartment = this.object_init.initializeApartment2(data);
        this.deposit.apartment = this.object_init.initializeApartment2(data);;
        this.loader.dismiss()
      })
      .catch(err => {
        this.loader.dismiss();
        this.errHandler.handleError(err);
      })
    })
    .catch(err =>{
      this.loader.dismiss();
      this.errHandler.handleError(err);
    })
  }

  ionViewWillLoad(){
    
 }


 promptConfirm(){
    let confirm: boolean = false;
    let alert = this.alertCtrl.create({
      title: "Secure place",
      message: "Are you sure you want to deposit this apartment RIGHT NOW ?",
      buttons: [
        {
          text: 'Confirm',
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
      if(confirm == true){
        let ldr = this.loadingCtrl.create()
        ldr.present()
        this.deposit_svc.getPricing()
        .pipe(take(1))
        .subscribe(data =>{
          this.deposit.landlord_credit = this.apartment.price - (this.apartment.price * data.deposit_commision);
          if(this.deposit.apartment.agent != ''){
            this.deposit.agent_commision = this.apartment.price*data.deposit_commision*(1 - 0.4);
            console.log('Agent commision: ', this.deposit.agent_commision)
            this.deposit.uploader_commision = this.deposit.agent_commision*(1 - 0.7);
            console.log('uploader commision: ', this.deposit.uploader_commision)
            this.deposit.agent_commision -= 0.3*this.deposit.agent_commision;
            console.log('Agent commision: ', this.deposit.agent_commision)
          }else{
            this.deposit.agent_commision = this.apartment.price*data.deposit_commision*(1 - 0.4);
          }
          this.deposit.time_initiated = new Date();
          this.user_svc.getUser(this.apartment.property.user_id)
          .pipe(take(1))
          .subscribe(host =>{
            this.deposit.to.firstname = host.firstname;
            this.deposit.to.lastname = host.lastname;
            this.deposit.to.dp = host.photoURL;
            this.deposit.to.uid = host.uid;
            this.deposit_svc.addDeposit(this.deposit).then(() =>{
              ldr.dismiss()
              this.showAlert();
            })
            .catch(err =>{
              ldr.dismiss()
              console.log(err);
            })
          })
        },
        err =>{
          ldr.dismiss();
          this.errHandler.handleError(err)
        })
      }
    })
 }

  /*generateRef(){
  	this.reference = this.apartment.room_type.substring(2,4) + 
                     this.apartment.property.user_id.substring(2,4) +
                     this.user.firstname.substring(0, 2) +
                     this.user.lastname.substring(0,2) + 
                     new Date().getHours().toString().substring(0,1) +
                     new Date().getMinutes().toString().substring(0,1);
    this.deposit.ref = this.reference;
    this.showAlert();
  }*/

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Request Sent !',
      subTitle: 'Thank you for choosing this safe deposit method !',
      message: ` Please wait for confirmation from the property manager before you go ahead with the deposit.`,
      buttons: ['OK']
    });
    alert.present();
  }

  comingSoon(){
    let alert = this.alertCtrl.create({
      title: 'Coming Soon!',
      subTitle: 'This feature is still under construction, please use the Deposit/EFT feature for payments',
      buttons: ['OK']
    });
    alert.present();
  }

  comingSooner(){
    let alert = this.alertCtrl.create({
      title: 'Coming Soon!',
      subTitle: 'This feature is still under construction, please communicate with the landlord or agent about the lease',
      buttons: ['OK']
    });
    alert.present();
  }

  gotoPayment(paymentMethod: string){
    this.navCtrl.push('PaymentDetailsPage', {payment_method: paymentMethod})
    .catch(err => {
      this.errHandler.handleError(err);
    })
  }

  // openLocalPDF(){
  //   const options: DocumentViewerOptions = {
  //     title: 'My Current Lease',
  //     openWith: {enabled: true},
  //     print: {enabled: true},
  //     search: {enabled: true}
  //   }
  //   this.document.viewDocument('assets/docs/lease.pdf','application/pdf', options);
  // }

  // downloadAndOpenPDF(){
  //   let path = this.file.dataDirectory;
  //   const options: DocumentViewerOptions = {
  //     title: 'My Current Lease',
  //     openWith: {enabled: true},
  //     print: {enabled: true},
  //     search: {enabled: true}
  //   }
  //   const transfer = this.fileTransfer.create();
  //   transfer.download('https://firebasestorage.googleapis.com/v0/b/clickinn-996f0.appspot.com/o/lease.pdf?alt=media&token=9a1ac086-aa34-4841-92fb-3a4208c0afa7', path + 'myClickinnLease.pdf').then(entry =>{
  //     let url = entry.toURL();
  //     this.document.viewDocument(url, 'application/pdf', options);
  //   })

  // }

}
