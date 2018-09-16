import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ChatMessage } from '../../models/chatmessage.interface';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { User } from '../../models/users/user.interface';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { ChatsPage } from '../chats/chats';
/**
 * Generated class for the MessageInputPopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-message-input-popup',
  templateUrl: 'message-input-popup.html',
})
export class MessageInputPopupPage {

  message: ChatMessage;
  user: User;
  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, 
  	private objectInit: ObjectInitProvider, private storage: LocalDataProvider, private chat_svc: ChatServiceProvider){
  	this.message = this.objectInit.initializeChatMessage();
  	this.user = this.objectInit.initializeUser();
  	let to = this.navParams.data;
  	this.storage.getUser().then(user =>{
  		console.log('curentUers : ', user);
  		this.user = user;
  		this.message.by.displayName = this.user.firstname ? this.user.firstname : 'Anonymous';
  		this.message.by.dp = this.user.photoURL ?  this.user.photoURL : 'assets/imgs/placeholder.png';
  		this.message.by.uid = this.user.uid;
  		this.message.to.displayName = to.searcher_name;
  		this.message.to.dp = to.searcher_dp ?  to.searcher_dp : 'assets/imgs/placeholder.png';
  		this.message.to.uid = to.searcher_id;
  	})
  }

  ionViewDidLoad() {
    console.log(this.navParams.data);
    this.message.by
  }

  close(){
  	this.viewCtrl.dismiss();
  }

  send(){
  	this.message.timeStamp = Date.now();
  	this.chat_svc.sendMessage(this.message, this.user);
  	this.close();
  	this.navCtrl.push(ChatsPage);
  }

}
