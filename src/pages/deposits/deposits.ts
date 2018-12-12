import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DepositProvider } from '../../providers/deposit/deposit'
import { ATMDeposit } from '../../models/ATMdeposit.interface';
import { Observable } from 'rxjs';
import { User } from '../../models/users/user.interface';
import { take } from 'rxjs-compat/operators/take';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
import { Subscription } from 'rxjs-compat/Subscription';
/**
 * Generated class for the DepositsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-deposits',
  templateUrl: 'deposits.html',
})
export class DepositsPage {
  deposits: Observable<ATMDeposit[]>;
  depositsSubs: Subscription;
  user: User;
  loading: boolean = true;
  balance: number = 0;
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private dep_svc: DepositProvider,
  	private storage: LocalDataProvider,
    private toast_svc: ToastSvcProvider) {
  	this.storage.getUser().then(user =>{
  		this.user = user;
  		this.deposits = this.dep_svc.getUserDeposits(user.uid)
      this.depositsSubs = this.dep_svc.getUserDeposits(user.uid)
      .subscribe(deps =>{
        console.log('subscribing to deposits...')
        if(deps.length > 0 ){
          this.loading = false;
          deps.forEach(dep =>{
            if(dep.to.uid == user.uid && !dep.transaction_closed){
              if(dep.apartment.by && dep.apartment.by == 'Agent'){
                this.balance += dep.agent_commision
              }else {
                this.balance += dep.landlord_credit
              }
            } 
              console.log(this.balance)
          })
          this.user.balance = this.balance;
          this.dep_svc.updateUserBalance(user.uid, this.balance)
        }else{
          this.loading = false;
          this.toast_svc.showToast('You have no deposit transactions on this profile...')
        } 
      }, 
      err =>{
        this.toast_svc.showToast(err.message);
        this.loading = false;
      })
  	})
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad DepositsPage');
  }

  ionViewWillLeave(){
    console.log('deposits page unsubscrinbing...')
    this.depositsSubs.unsubscribe();
  }


  gotoHostAcceptDeposit(deposit_id: string){
    this.storage.setTransactionState({type: 'host_accept_deposit', id: deposit_id})
    .then(dat =>{
      this.navCtrl.push('DepositConfirmationPage')
    })
  }

  gotoSeekerConfirmDeposit(deposit_id: string){
    this.storage.setTransactionState({type: 'seeker_confirm_deposit', id: deposit_id})
    .then(dat =>{
      this.navCtrl.push('DepositConfirmationPage')
    })
  }

  gotoDeposit(deposit: ATMDeposit){
  	if(deposit.by.uid == this.user.uid){
  		this.gotoSeekerConfirmDeposit(deposit.id)
  	}else{
  		this.gotoHostAcceptDeposit(deposit.id)
  	}
  }

}
