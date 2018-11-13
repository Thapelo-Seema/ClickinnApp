import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { ChatMessage } from '../../models/chatmessage.interface';
import { Observable } from 'rxjs-compat';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { User } from '../../models/users/user.interface';
import { Thread } from '../../models/thread.interface';
import { UserSvcProvider } from '../../providers/user-svc/user-svc';
import { take } from 'rxjs-compat/operators/take';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
/**
 * Generated class for the ChatThreadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-chat-thread',
  templateUrl: 'chat-thread.html',
})
export class ChatThreadPage {

  thread: Observable<ChatMessage[]>;
  @ViewChild('scroller') feedContainer: ElementRef;
  @ViewChild(Content) content: Content;
  message: ChatMessage;
  text: string = '';
  user: User;
  loadingMore: boolean = false;
  done: boolean = false;
  threadInfo: Thread; 
  threads: Thread[] = [];
  loading: boolean = false;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private chat_svc: ChatServiceProvider,
  	private object_init: ObjectInitProvider, 
    private storage: LocalDataProvider, 
    private user_svc: UserSvcProvider,
    private toast_svc: ToastSvcProvider){
    this.loading = true;
  	this.threadInfo = this.navParams.data;
    console.log('navParams  ', this.navParams.data.thread_id);
    
  	this.user = this.object_init.initializeUser();
    this.storage.getThread().then(thread =>{
      this.threadInfo = thread;
      this.chat_svc.initGetThreadChats(thread.thread_id)
      this.chat_svc.loading.subscribe(data =>{
      this.loadingMore = data;
    })

    this.chat_svc.done.subscribe(data =>{
      this.done = data;
      if(this.done == true) this.loadingMore = false;
    })
      this.thread = this.chat_svc.getThreadChats(thread.thread_id);
      this.chat_svc.getThreadChats(thread.thread_id)
      .pipe(
        take(1))
      .subscribe(threadd =>{
        if(threadd.length > 0 ){
          this.loading = false;
        }else{
          this.toast_svc.showToast('You have no messages from this chat, they may have been deleted...');
          this.loading = false;
        }
        console.log('chats ', threadd)
      })
    })
  	.catch(err => console.log(err))
  	this.message = this.object_init.initializeChatMessage();

  	this.storage.getUser().then(user =>{
      this.chat_svc.getThreads(user).subscribe(threads =>{
        console.log('Threads: ', threads);
        this.threads = threads;
      })
      this.user_svc.getUser(user.uid).subscribe(synced_user =>{
        console.log('user changed...', synced_user.threads);
        this.user = this.object_init.initializeUser2(synced_user);
      })
  	})
  }

  ionViewDidLoad() {
    this.monitorEnd()
    this.scrollToBottom();
  }

  scrollToBottom(){
    this.content.scrollToBottom();
  }

  handleSubmit(event){
    if(event.keyCode === 13){
      this.send();
      this.scrollToBottom();
    }
  }

  send(){
    this.message.text = this.text;
  	this.message.timeStamp = Date.now();
  	this.message.by.displayName = this.user.firstname;
  	this.message.by.uid = this.user.uid;
  	this.message.by.dp = this.user.photoURL;
  	this.message.to.displayName = this.threadInfo.displayName;
  	this.message.to.dp = this.threadInfo.dp;
  	this.message.to.uid = this.threadInfo.uid;
  	this.chat_svc.sendMessage(this.message, this.threads);
  	this.text = '';
  	this.scrollToBottom();
  }

  monitorEnd(){
    //console.log('Content scrollHeight = ', this.content.scrollHeight)
    this.content.ionScrollEnd.subscribe(ev =>{
    let height = ev.scrollElement.scrollHeight;
    let top = ev.scrollElement.scrollTop;
    let offset = ev.scrollElement.offsetHeight;
      if(top > height - offset - 1){
        this.chat_svc.moreThreadChats(this.threadInfo.thread_id)
      }
    })
  }

}
