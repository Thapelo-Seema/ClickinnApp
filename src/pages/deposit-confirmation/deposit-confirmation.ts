import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { DepositProvider } from '../../providers/deposit/deposit';
import { ATMDeposit } from '../../models/atmdeposit.interface';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { ChatMessage } from '../../models/chatmessage.interface';
import { UserSvcProvider } from '../../providers/user-svc/user-svc';
import { take } from 'rxjs-compat/operators/take';
import { Subscription } from 'rxjs-compat/Subscription';
//import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
/**
 * Generated class for the DepositConfirmationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-deposit-confirmation',
  templateUrl: 'deposit-confirmation.html',
})
export class DepositConfirmationPage {
  deposit: ATMDeposit;
  message: ChatMessage;
  depositSubs: Subscription;
  loading: boolean = true;
  host: boolean = false;
  images: any;
  processing: boolean = false;
  apartImgCount: number;
  imageLoaded: boolean = false;
  movedIn: boolean = false;
  
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
  	private deposit_svc: DepositProvider,
  	private object_init: ObjectInitProvider,
    private toast_svc: ToastSvcProvider,
    private chat_svc: ChatServiceProvider,
    private user_svc: UserSvcProvider,
    private modal: ModalController,
    private alertCtrl: AlertController) {
    this.loading = true;
  	this.deposit = this.object_init.initializeDeposit();
    this.message = this.object_init.initializeChatMessage();
  	
  }

  ionViewDidLoad() {
    this.storage.getTransactionState()
    .then(state =>{
      if(state.type == 'host_accept_deposit') this.host = true;
      this.depositSubs = this.deposit_svc.getDepositById(state.id)
      .subscribe(deposit =>{
        this.deposit = this.object_init.initializeDeposit2(deposit);
        this.loading = false;
        if(deposit.tenant_confirmed && ! this.host) this.movedIn = true;
        if(!(deposit.apartment.images.length > 0)){
          this.images = Object.keys(deposit.apartment.images).map(imageId =>{
              this.imagesLoaded.push(false);
              return deposit.apartment.images[imageId]
          })
          this.apartImgCount = this.images.length;
        }else{
          this.images = deposit.apartment.images;
          this.apartImgCount = deposit.apartment.images.length;
        }
      }, err =>{
        this.toast_svc.showToast(err.message);
        this.loading = false;
      })
    })
  }

  ionViewWillLeave(){
    this.depositSubs.unsubscribe();
  }

  generateRef(){
    let refference = this.deposit.apartment.room_type.substring(2,4) + 
                     this.deposit.apartment.property.user_id.substring(2,4) +
                     this.deposit.by.firstname.substring(0, 2) +
                     this.deposit.by.lastname.substring(0,2) + 
                     new Date().getHours().toString().substring(0,1) +
                     new Date().getMinutes().toString().substring(0,1);
    this.deposit.ref = refference;
  }

  showInput(deposit: ATMDeposit){
    let to: any;
    if(this.host){
      to = {
        uid: deposit.by.uid,
        dp : deposit.by.dp,
        name: deposit.by.firstname? deposit.by.firstname : '',
        topic: `Regarding your request to deposit the ${deposit.apartment.price} ${deposit.apartment.room_type} at ${deposit.apartment.property.address.description}`
      }
    }else if(this.host == false){
      to = {
        uid: deposit.to.uid,
        dp : deposit.to.dp,
        name: deposit.to.firstname? deposit.by.firstname : '',
        topic: `Regarding the request of ${deposit.by.firstname} to deposit the ${deposit.apartment.price} ${deposit.apartment.room_type} at ${deposit.apartment.property.address.description}`
      }
    }
    this.storage.setMessageDetails(to).then(val =>{
      this.modal.create('MessageInputPopupPage', to).present();
    })
  }

  acceptDeposit(){
    let confirm: boolean = false;
    let alert = this.alertCtrl.create({
      title: "ACCEPT DEPOSIT",
      message: "Are you sure you want to accept this deposit ?",
      buttons: [
        {
          text: 'Accept',
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
      if(confirm){
        this.processing = true;
        this.generateRef();
        this.deposit.agent_goAhead = true;
        this.deposit.time_agent_confirm = Date.now();
        this.deposit.timeStampModified = Date.now();
        this.deposit_svc.updateDeposit(this.deposit)
        .then(() =>{
          this.processing = false;
          this.toast_svc.showToast('You have accepted this deposit payment')
        })
        .catch( err => {
          this.processing = false;
          console.log(err)
        })
      }else{
        this.toast_svc.showToast('Deposit NOT accepted.')
      }
      })
  }

  rejectDeposit(){
    let confirm: boolean = false;
    let alert = this.alertCtrl.create({
      title: "DECLINE DEPOSIT",
      message: "Are you sure you want to decline this deposit ?",
      buttons: [
        {
          text: 'Decline',
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
        this.processing = true;
        this.message.topic = `Regarding your deposit of R${this.deposit.apartment.price} for the ${this.deposit.apartment.room_type}`
        this.message.text = `Hi ${this.deposit.by.firstname}, I can not accept your deposit request, text me back if you want reasons`
        this.message.to.uid = this.deposit.by.uid;
        this.message.to.dp = this.deposit.by.dp;
        this.message.to.displayName = this.deposit.by.firstname;
        this.message.by.uid = this.deposit.to.uid;
        this.message.by.dp = this.deposit.to.dp;
        this.message.by.displayName = this.deposit.to.firstname;
        this.user_svc.getUser(this.deposit.to.uid)
        .pipe(
          take(1)
        )
        .subscribe(user =>{
          this.message.timeStamp = Date.now();
          this.chat_svc.sendMessage(this.message, user.threads)
        })
        this.deposit.agent_goAhead = false;
        this.deposit.timeStampModified = Date.now();
        this.deposit.time_agent_confirm = Date.now();
        this.deposit_svc.updateDeposit(this.deposit)
        .then(() =>{
          this.processing = false
          this.toast_svc.showToast('You have rejected this deposit payment')
        })
        .catch( err => {
          this.processing = false;
          console.log(err)
        })

      }else{
        this.toast_svc.showToast('You have NOT rejected this deposit payment')
      }
    })
  }

  cancelDeposit(){
    let confirm: boolean = false;
    let alert = this.alertCtrl.create({
      title: "CANCEL DEPOSIT",
      message: "Are you sure you want to cancel this deposit payment ?",
      buttons: [
        {
          text: 'Yes cancel',
          handler: data =>{
            confirm = true;
          }
        },
        {
          role: 'cancel',
          text: 'No do not cancel',
          handler: data =>{
            confirm = false;
          }
        }
      ]
    })
    alert.present();
    alert.onDidDismiss(data =>{
      if(confirm == true){
        this.processing = true;
        this.message.topic = `Regarding the deposit of R${this.deposit.apartment.price} for the ${this.deposit.apartment.room_type}`
        this.message.text = `Hi ${this.deposit.to.firstname}, I couldn't complete the deposit, text me back if you want reasons`
        this.message.to.uid = this.deposit.to.uid;
        this.message.to.dp = this.deposit.to.dp;
        this.message.to.displayName = this.deposit.to.firstname;
        this.message.by.uid = this.deposit.by.uid;
        this.message.by.dp = this.deposit.by.dp;
        this.message.by.displayName = this.deposit.by.firstname;
        this.user_svc.getUser(this.deposit.by.uid)
        .pipe(
          take(1)
        )
        .subscribe(user =>{
          this.message.timeStamp = Date.now();
          this.chat_svc.sendMessage(this.message, user.threads)
        })
        this.deposit.time_tenant_confirmed = Date.now();
        this.deposit.timeStampModified = Date.now();
        this.deposit.tenant_confirmed = false;
        this.deposit_svc.updateDeposit(this.deposit)
        .then(() =>{
          this.processing = false;
          this.toast_svc.showToast('You have cancelled this deposit payment')
        })
        .catch( err => {
          this.processing = false;
          console.log(err)
        })
      }else{
        this.toast_svc.showToast('You have NOT cancelled this deposit payment')
      }
    })
    
  }

  confirmDeposit(){
    let confirm: boolean = false;
    let alert = this.alertCtrl.create({
      title: "CONFIRM DEPOSIT",
      message: "Are you sure you want to confirm this deposit ?",
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
      if(confirm){
        this.processing = true;
        this.deposit.tenant_confirmed = true;
        this.deposit.time_tenant_confirmed = Date.now();
        this.deposit.timeStampModified = Date.now();
        this.deposit_svc.updateDeposit(this.deposit)
        .then(() =>{
          this.processing =  false;
          this.toast_svc.showToast('You have confirmed this deposit payment')
        })
        .catch( err => {
          this.processing = false;
          console.log(err)
        })
      }else{
        this.toast_svc.showToast('You have NOT confirmed this deposit payment')
      }
    })
  }

  confirmMoveIn(){
    let confirm: boolean = false;
    let alert = this.alertCtrl.create({
      title: "CONFIRM MOVE IN",
      message: "Are you sure you want to confirm this move in ?",
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
      if(confirm){
        this.processing = true;
        this.deposit.tenantMovedIn = true;
        this.deposit.timeStampModified = Date.now();
        this.deposit_svc.updateDeposit(this.deposit)
        .then(() =>{
          this.processing =  false;
          this.toast_svc.showToast('You have confirmed your move in successfully, enjoy your stay !')
        })
        .catch( err => {
          this.processing = false;
          console.log(err)
        })
      }else{
        this.toast_svc.showToast('You have NOT confirmed your move in ')
      }
    })
    
  }

}
