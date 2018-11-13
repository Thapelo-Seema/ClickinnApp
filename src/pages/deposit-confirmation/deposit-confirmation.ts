import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { DepositProvider } from '../../providers/deposit/deposit';
import { ATMDeposit } from '../../models/atmdeposit.interface';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { ChatMessage } from '../../models/chatmessage.interface';
import { UserSvcProvider } from '../../providers/user-svc/user-svc';
import { take } from 'rxjs-compat/operators/take';
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
  loading: boolean = true;
  host: boolean = false;
  images: any;
  processing: boolean = false;
  apartImgCount: number;
  imageLoaded: boolean = false;
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
    private user_svc: UserSvcProvider) {
    this.loading = true;
  	this.deposit = this.object_init.initializeDeposit();
    this.message = this.object_init.initializeChatMessage();
  	
  }

  ionViewDidLoad() {
    this.storage.getTransactionState()
    .then(state =>{
      if(state.type == 'host_accept_deposit') this.host = true;
      this.deposit_svc.getDepositById(state.id)
      .subscribe(deposit =>{
        this.deposit = deposit;
        this.loading = false;
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
      })
    })
  }

  acceptDeposit(){
    this.processing = true;
  	this.deposit.agent_goAhead = true;
  	this.deposit_svc.updateDeposit(this.deposit)
  	.then(() =>{
      this.processing = false;
  		this.toast_svc.showToast('You have accepted this deposit payment')
  	})
    .catch( err => {
      this.processing = false;
      console.log(err)
    })
  }

  rejectDeposit(){
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
    this.deposit_svc.updateDeposit(this.deposit)
    .then(() =>{
      this.processing = false
      this.toast_svc.showToast('You have rejected this deposit payment')
    })
    .catch( err => {
      this.processing = false;
      console.log(err)
    })
  }

  cancelDeposit(){
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
  }

  confirmDeposit(){
    this.processing = true;
  	this.deposit.tenant_confirmed = true;
    this.deposit_svc.updateDeposit(this.deposit)
    .then(() =>{
      this.processing =  false;
      this.toast_svc.showToast('You have confirmed this deposit payment')
    })
    .catch( err => {
      this.processing = false;
      console.log(err)
    })
  }

}
