import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { ChatMessage } from '../../models/chatmessage.interface';
import { Observable } from 'rxjs';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { User } from '../../models/users/user.interface';
import { Thread } from '../../models/thread.interface';
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
  constructor(public navCtrl: NavController, public navParams: NavParams, private chat_svc: ChatServiceProvider,
  	private object_init: ObjectInitProvider, private storage: LocalDataProvider){
  	this.threadInfo = this.navParams.data;
    console.log('navParams  ', this.navParams.data.thread_id);
  	this.user = this.object_init.initializeUser();
  	this.chat_svc.getThreadChats(this.navParams.data.thread_id)
    .subscribe(data =>{
      console.log('Chats coming from the server ', data);
    })
  	this.message = this.object_init.initializeChatMessage();
  	this.storage.getUser().then(user =>{
  		this.user = user;
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
  	this.chat_svc.sendMessage(this.message, this.user);
  	this.text = '';
  	this.scrollToBottom();
  }

}
