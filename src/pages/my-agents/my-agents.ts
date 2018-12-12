import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
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
/**
 * Generated class for the MyAgentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-agents',
  templateUrl: 'my-agents.html',
})
export class MyAgentsPage {
  loading: boolean = true
  landlords: Observable<ServiceDeal[]>;
  user: User;
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
    private toast_svc: ToastSvcProvider) {
  	this.storage.getUser()
  	.then(data =>{
  		this.user = this.object_init.initializeUser2(data)
  		this.landlords = this.searchfeed_svc.getLandlordAgents(data.uid);
  		this.searchfeed_svc.getAgentsLandlords(data.uid)
  		.pipe(take(1))
  		.subscribe(lords =>{
  			this.loading = false;
  			console.log('Deals: ', lords)
  			lords.forEach(lord =>{
  				this.imagesLoaded.push(false)
  			})
  		})
  	})
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyAgentsPage');
  }

  cancelDeal(deal: ServiceDeal){
  	let confirm: boolean = false;
    let alert = this.alertCtrl.create({
      title: "CONFIRM CANCEL",
      message: "Are you sure you want to cancel the services of this agent ?",
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
        let svc = deal;
  		svc.landlord_disagree = true;
  		this.searchfeed_svc.updateProposal(svc)
  		.then(() =>{
  			this.toast_svc.showToast('The services of this agent have been discontinued')
  		})
  		.catch(err =>{
  			this.errHandler.handleError(err)
  		})
      }
    })
  }

  showInput(deal: ServiceDeal){
    let to: any;
      to = {
        uid: deal.agent_uid,
        dp : deal.agent_dp,
        name: deal.agent_firstname ? deal.agent_firstname : '',
        topic: `Regarding the agent services between you and ${deal.landlord_firstname}`
      }
    this.storage.setMessageDetails(to).then(val =>{
      this.alert.create('MessageInputPopupPage', to).present();
    })
  }

}
