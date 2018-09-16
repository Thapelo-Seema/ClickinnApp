import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { Thread } from '../../models/thread.interface';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { Observable } from 'rxjs';
import { ChatThreadPage } from '../chat-thread/chat-thread';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { User } from '../../models/users/user.interface';


@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {

  threads: Observable<Thread[]>;
  user: User;
  constructor(public navCtrl: NavController, public navParams: NavParams, private object_init: ObjectInitProvider, 
  	private chat_svc: ChatServiceProvider, private storage: LocalDataProvider){
  	this.storage.getUser().then(user =>{
  		this.user = user;
  		this.threads = this.chat_svc.getThreads(user)
  	})
  }

  ionViewDidLoad() {
    
  }

  gotoThread(thread: Thread){
  	this.navCtrl.push(ChatThreadPage, thread);
  }

}
