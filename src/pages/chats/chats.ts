import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { Thread } from '../../models/thread.interface';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { Observable } from 'rxjs';
import { ChatThreadPage } from '../chat-thread/chat-thread';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { User } from '../../models/users/user.interface';
import { take } from 'rxjs-compat/operators/take';


@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {

  threads: Observable<Thread[]>;
  user: User;
  loading: boolean = true;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private object_init: ObjectInitProvider, 
  	private chat_svc: ChatServiceProvider, 
    private storage: LocalDataProvider,
    private toastCtrl: ToastController){
  	this.storage.getUser().then(user =>{
      if(user){
        this.user = user;
        this.threads = this.chat_svc.getThreads(user)
        this.chat_svc.getThreads(user)
        .pipe(
          take(1)
        )
        .subscribe( threads =>{
          if(threads){
            this.loading = false;
          }else{
            this.loading = false;
            this.showToast('You have no chats so far...')
          }
        },
        (err) =>{
          this.loading = false;
          this.showToast('There was an error fecthing your chats, if error persists please contact clickinn support');
        }
        )
      }
  	})
  }

  ionViewDidLoad() {
    
  }

  gotoThread(thread: Thread){
  	this.navCtrl.push(ChatThreadPage, thread);
  }

  showToast(text: string){
    let toast = this.toastCtrl.create({
      message: text,
      duration: 60000
    })
    toast.present()
  }

}
