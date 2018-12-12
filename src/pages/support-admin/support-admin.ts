import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { Subscription } from 'rxjs-compat/Subscription';
import { take } from 'rxjs-compat/operators/take';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
import { LocalDataProvider } from '../../providers/local-data/local-data';
/**
 * Generated class for the SupportAdminPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-support-admin',
  templateUrl: 'support-admin.html',
})
export class SupportAdminPage {
  supportMessages: any;
  channels: any;
  channelSubs: Subscription;
  loading: boolean = false;
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
  	private chat_svc: ChatServiceProvider,
    private toast_svc: ToastSvcProvider,
    private storage: LocalDataProvider) {
    this.channels = this.chat_svc.getAllSupport();
  	this.channelSubs = this.chat_svc.getAllSupport()
  	.pipe(take(1))
      .subscribe(props =>{
        if(props.length > 0){
          props.forEach(prop =>{
            this.imagesLoaded.push(false);
          })
          this.loading = false;
        }else{
          this.loading = false;
          this.toast_svc.showToast('There are no messages...')
        }
      },
      err =>{
        this.toast_svc.showToast(err.message);
        this.loading = false;
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SupportAdminPage');
  }

  ionViewWillLeave(){
    this.channelSubs.unsubscribe();
  }

  gotoChannel(channel_id: string){
    this.storage.setChannelID(channel_id)
    .then(data =>{
      this.navCtrl.push('ChannelMessagesPage')
    })
    .catch(err =>{
      console.log(err)
    })
  }

}
