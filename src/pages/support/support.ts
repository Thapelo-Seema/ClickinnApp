import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, List } from 'ionic-angular';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { SupportMessage } from '../../models/support_message.interface';
import { Observable } from 'rxjs-compat';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { User } from '../../models/users/user.interface';
import { UserSvcProvider } from '../../providers/user-svc/user-svc';
import { take } from 'rxjs-compat/operators/take';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
import { Thread } from '../../models/thread.interface';
/**
 * Generated class for the SupportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-support',
  templateUrl: 'support.html',
})
export class SupportPage {
  thread: Observable<SupportMessage[]>;
  @ViewChild('scroller') feedContainer: ElementRef;
  @ViewChild(Content) content: Content;
  @ViewChild(List, {read: ElementRef}) chatList: ElementRef;
  message: SupportMessage;
  text: string = '';
  user: User;
  loadingMore: boolean = false;
  done: boolean = false;
  threadInfo: Thread; 
  threads: Thread[] = [];
  loading: boolean = false;
  mutationObserver: MutationObserver;
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private chat_svc: ChatServiceProvider,
  	private object_init: ObjectInitProvider, 
    private storage: LocalDataProvider, 
    private user_svc: UserSvcProvider,
    private toast_svc: ToastSvcProvider) {

  	this.user = this.object_init.initializeUser();
    this.storage.getUser().then(user =>{
      this.user = user;
      //this.chat_svc.initGetThreadChats(thread.thread_id)
      /*this.chat_svc.loading.subscribe(data =>{
      this.loadingMore = data;
    })

    this.chat_svc.done.subscribe(data =>{
      this.done = data;
      if(this.done == true) this.loadingMore = false;
    })*/
      this.thread = this.chat_svc.getUserSupportMessages(user.uid);
      this.chat_svc.getUserSupportMessages(user.uid)
      .pipe(
        take(1))
      .subscribe(threadd =>{
        if(threadd.length > 0 ){
          this.loading = false;
        }else{
          this.toast_svc.showToast('You have no messages from this chat, they may have been deleted...');
          this.loading = false;
        }
      },
      err =>{
        this.toast_svc.showToast(err.message);
        this.loading = false;
      })
    })
  	.catch(err => console.log(err))
  	this.message = this.object_init.initializeSupportMessage();
  }

  ionViewDidLoad() {
    this.mutationObserver = new MutationObserver((mutations) => {
            this.content.scrollToBottom();
        });
 
        this.mutationObserver.observe(this.chatList.nativeElement, {
            childList: true
        });
  }

  scrollToBottom(){
    console.log('scrolling...')
    this.content.scrollToBottom();
  }

  handleSubmit(event){
    if(event.keyCode === 13){
      this.send();
      //this.scrollToBottom();
    }
  }

  send(){
    this.message.text = this.text;
  	this.message.timeStamp = Date.now();
  	this.message.user.displayName = this.user.firstname;
  	this.message.user.uid = this.user.uid;
  	this.message.user.dp = this.user.photoURL;
  	this.message.sender = 'user';
  	this.chat_svc.sendSupportMessage(this.message);
  	this.text = '';
  	//this.scrollToBottom();
  }

}
