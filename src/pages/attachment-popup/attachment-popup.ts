import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import { LocalDataProvider } from '../../providers/local-data/local-data';
//import { Subscription } from 'rxjs-compat/Subscription';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
import { User } from '../../models/users/user.interface';
import { Observable } from 'rxjs-compat/Observable';
import { take } from 'rxjs-compat/operators/take';
import { Apartment } from '../../models/properties/apartment.interface';
import { ChatMessage } from '../../models/chatmessage.interface';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { Thread } from '../../models/thread.interface';
/**
 * Generated class for the AttachmentPopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-attachment-popup',
  templateUrl: 'attachment-popup.html',
})
export class AttachmentPopupPage {
  user: User;
  threads: Thread[];
  message: ChatMessage = this.object_init.initializeChatMessage();
  loader = this.loadingCtrl.create();
  apartments: Observable<Apartment[]>
  imagesLoaded: boolean[] = 
  [ false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, 
    false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false
  ];
  selectedIndex: number = 0;
  attached: boolean[] = [] ;
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private accom_svc: AccommodationsProvider,
  	private local_db: LocalDataProvider,
    private toast_svc: ToastSvcProvider,
    private viewCtrl: ViewController,
    private loadingCtrl: LoadingController,
    private chat_svc: ChatServiceProvider,
    private object_init: ObjectInitProvider
  ) {
  	this.loader.present()
  	this.message = this.object_init.initializeChatMessag2(this.navParams.data)
  	this.local_db.getUser()
  	.then(user =>{
  		this.chat_svc.getThreads(user).pipe(take(1)).subscribe(threads =>{
        this.threads = threads;
      },
      err =>{
        this.loader.dismiss()
        this.toast_svc.showToast('Error loading threads')
      })
  		this.user = this.object_init.initializeUser2(user);
  		this.apartments = this.accom_svc.getAllApartments();
  		this.accom_svc.getAllApartments()
  		.pipe(take(1))
  		.subscribe(aparts =>{
  			if(aparts.length > 0){
          console.log(aparts)
  				aparts.forEach(apart =>{
	  				this.imagesLoaded.push(false)
            this.attached.push(false);
	  			})
	  			this.loader.dismiss()
  			}else{
  				this.loader.dismiss()
  				this.toast_svc.showToast('You have no apartments linked to this profile, go ahead and upload some...')
  			}
  		},
      err =>{
        console.log(err)
        this.loader.dismiss()
        this.toast_svc.showToast('Error loading your apartments, please try again')
      })
  	})
    .catch(err =>{
      console.log(err)
      this.loader.dismiss()
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AttachmentPopupPage');
  }

  addApartment(apartment: Apartment, i: number){
    console.log('Aapartment: ', i)
  	this.message.attachment = apartment;
    this.message.attachment.agent = this.user.uid;
    this.attached[this.selectedIndex] = false;
    this.attached[i] = true;
    this.selectedIndex = i;
    console.log(this.attached)
  }

  close(){
  	this.viewCtrl.dismiss();
  }

  cancelSelect(i?: number){
    if(i != undefined){
      this.attached[i] = false;
      this.attached[this.selectedIndex] = false;
    }
  	this.message.attachment = null;
  }

  send(){
  	console.log('Sending message...', this.message)
  	this.message.timeStamp = Date.now();
  	this.chat_svc.sendMessage(this.message, this.threads);
  	this.close();
  	//this.toast_svc.showToast('Your message has been sent and it can be found in your chats...');
  }

  returnFirst(input: string): string{
    if(input == undefined) return '';
    return input.split(',')[0] + ', ' + input.split(',')[1];
  }

}
