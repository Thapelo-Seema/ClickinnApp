import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Content } from 'ionic-angular';
//import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { Thread } from '../../models/thread.interface';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { Observable } from 'rxjs';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { User } from '../../models/users/user.interface';
import { take } from 'rxjs-compat/operators/take';


@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {
  @ViewChild(Content) content: Content;
  threads: Observable<Thread[]>;
  user: User;
  loading: boolean = true;
  loadingMore: boolean = false;
  done: boolean = false;
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
    private storage: LocalDataProvider,
    private toastCtrl: ToastController){
    this.chat_svc.loading.subscribe(data =>{
      this.loadingMore = data;
    })

    this.chat_svc.done.subscribe(data =>{
      this.done = data;
      if(this.done == true) this.loadingMore = false;
    })
    
  	this.storage.getUser().then(user =>{
      if(user){
        this.user = user;
        this.chat_svc.initGetThreads(user)
        this.threads = this.chat_svc.getThreads(user)
        this.chat_svc.getThreads(user)
        .pipe(
          take(1)
        )
        .subscribe( threads =>{
          if(threads.length > 0){
            threads.forEach(prop =>{
            this.imagesLoaded.push(false);
          })
            this.loading = false;
          }else{
            this.loading = false;
            this.showToast('You currently have no chats, if you had some previous chats, they may have been deleted')
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

  ionViewDidLoad(){
    this.monitorEnd();
  }

  gotoThread(thread: Thread){
    this.storage.setThread(thread).then(val =>{
      this.navCtrl.push('ChatThreadPage', thread);
    })
  	.catch(err => console.log(err))
  }

  showToast(text: string){
    let toast = this.toastCtrl.create({
      message: text,
      duration: 60000
    })
    toast.present()
  }

  monitorEnd(){
    //console.log('Content scrollHeight = ', this.content.scrollHeight)
    this.content.ionScrollEnd.subscribe(ev =>{
    let height = ev.scrollElement.scrollHeight;
    let top = ev.scrollElement.scrollTop;
    let offset = ev.scrollElement.offsetHeight;
      if(top > height - offset - 1){
        this.chat_svc.moreThreads(this.user)
      }
    })
  }

}
