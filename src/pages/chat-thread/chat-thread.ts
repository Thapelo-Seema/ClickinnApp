import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { ChatMessage } from '../../models/chatmessage.interface';
import { Observable } from 'rxjs-compat';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { User } from '../../models/users/user.interface';
import { Thread } from '../../models/thread.interface';
import { UserSvcProvider } from '../../providers/user-svc/user-svc';
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
  message: ChatMessage;
  text: string = '';
  user: User;
  threadInfo: Thread; 
  threads: Thread[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private chat_svc: ChatServiceProvider,
  	private object_init: ObjectInitProvider, private storage: LocalDataProvider, private user_svc: UserSvcProvider){
  	this.threadInfo = this.navParams.data;
    console.log('navParams  ', this.navParams.data.thread_id);
  	this.user = this.object_init.initializeUser();
  	this.thread = this.chat_svc.getThreadChats(this.navParams.data.thread_id);
  	this.message = this.object_init.initializeChatMessage();

  	this.storage.getUser().then(user =>{
      this.chat_svc.getThreads(user).subscribe(threads =>{
        this.threads = threads;
      })
      this.user_svc.getUser(user.uid).subscribe(synced_user =>{
        console.log('user changed...', synced_user.threads);
        this.user = this.object_init.initializeUser2(synced_user);
      })
  	})
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatThreadPage');
  }

  scrollToBottom(){
    if(this.feedContainer != undefined) 
      this.feedContainer.nativeElement.scrollTop = this.feedContainer.nativeElement.scrollHeight;
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

}
