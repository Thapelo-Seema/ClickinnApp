import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { AngularFirestore } from 'angularfire2/firestore';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { User } from '../../models/users/user.interface';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { Subscription } from 'rxjs-compat/Subscription';
import { UserSvcProvider } from '../../providers/user-svc/user-svc';
import { SearchfeedProvider } from '../../providers/searchfeed/searchfeed';
import { Observable } from 'rxjs-compat/Observable';
import { take } from 'rxjs-compat/operators/take';
import { ServiceDeal } from '../../models/service_deal.interface';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
import { CallNumber } from '@ionic-native/call-number';
/**
 * Generated class for the MyLandlordsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-landlords',
  templateUrl: 'my-landlords.html',
})
export class MyLandlordsPage {
  loader = this.loadingCtrl.create();
  landlords: Observable<ServiceDeal[]>;
  user: User;
  noLandlords: boolean = false;
  imagesLoaded: boolean[] = 
    [  false, false, false, false, false, false, false, false, false, false,
       false, false, false, false, false, false, false, false, false, false, 
       false,false, false, false, false, false, false, false, false, false,
       false,false, false, false, false, false, false, false, false, false,
       false,false, false, false, false, false, false, false, false, false
    ];
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private storage: LocalDataProvider, 
    private alert: ModalController, 
    private afs: AngularFirestore, 
    private errHandler: ErrorHandlerProvider, 
    private object_init: ObjectInitProvider, 
    private alertCtrl: AlertController,
    private user_svc: UserSvcProvider,
    private searchfeed_svc: SearchfeedProvider,
    private toast_svc: ToastSvcProvider,
    private loadingCtrl: LoadingController,
    private callNumber: CallNumber){
    this.loader.present();
  	this.storage.getUser()
  	.then(data =>{
  		this.user = this.object_init.initializeUser2(data)
  		this.landlords = this.searchfeed_svc.getAgentsLandlords(data.uid);
  		this.searchfeed_svc.getAgentsLandlords(data.uid)
  		.pipe(take(1))
  		.subscribe(lords =>{
  			this.loader.dismiss()
  			console.log('Deals: ', lords);
        if(lords.length  > 0){
          lords.forEach(lord =>{
            this.imagesLoaded.push(false)
          })
        }else{
          this.noLandlords = true;
        }
  		})
  	})
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyLandlordsPage');
  }

  cancelDeal(deal: ServiceDeal){
  	let confirm: boolean = false;
    let alert = this.alertCtrl.create({
      title: "CONFIRM CANCEL",
      message: "Are you sure you want to cancel your services to this property owner ?",
      buttons: [
        {
          text: 'Yes cancel services',
          handler: data =>{
            confirm = true;
          }
        },
        {
          role: 'cancel',
          text: 'No nevermind',
          handler: data =>{
            confirm = false;
          }
        }
      ]
    })
    alert.present();
    alert.onDidDismiss(data =>{
      if(confirm){
        let ldr = this.loadingCtrl.create()
        ldr.present()
        let svc = deal;
    		svc.agent_cancelled = true;
    		this.searchfeed_svc.updateProposal(svc)
    		.then(() =>{
          ldr.dismiss()
    			this.toast_svc.showToast('Your services to this landlord have been discontinued')
    		})
    		.catch(err =>{
          ldr.dismiss()
    			this.errHandler.handleError(err)
    		})
      }
    })
  }

  showInput(deal: ServiceDeal){
    let ldr = this.loadingCtrl.create()
    ldr.present()
    let to: any;
      to = {
        uid: deal.landlord_uid,
        dp : deal.landlord_dp,
        name: deal.landlord_firstname ? deal.landlord_firstname : '',
        topic: `Regarding the agent services between you and ${deal.agent_firstname}`
      }
    this.storage.setMessageDetails(to).then(val =>{
      ldr.dismiss();
      this.alert.create('MessageInputPopupPage', to).present();
    })
  }

  callLandlord(deal: ServiceDeal){
    this.toast_svc.showToast('Please note that network charges may apply for making this call...')
    this.user_svc.getUser(deal.landlord_uid)
    .pipe(take(1))
    .subscribe(user =>{
      this.callNumber.callNumber(user.phoneNumber, false)
      .catch(err =>{
        this.errHandler.handleError(err)
      })
    })
  }

}
