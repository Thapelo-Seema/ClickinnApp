import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, LoadingController } from 'ionic-angular';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { Thread } from '../../models/thread.interface';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { Observable } from 'rxjs';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { User } from '../../models/users/user.interface';
import { take } from 'rxjs-compat/operators/take';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { UserSvcProvider } from '../../providers/user-svc/user-svc';

@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {
  //@ViewChild(Content) content: Content;
  threads: Observable<Thread[]>;
  user: User;
  users: User[] = [];
  searchText: string = '';
  loader = this.loadingCtrl.create();
  noChats: boolean = false;
  //loadingMore: boolean = false;
  //done: boolean = false;
  imagesLoaded: boolean[] = 
  [ false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, 
    false,false, false, false, false, false, false, false, false, false,
    false,false, false, false, false, false, false, false, false, false,
    false,false, false, false, false, false, false, false, false, false
  ];
  constructor(
    public navCtrl: NavController, 
    //public navParams: NavParams, 
  	private chat_svc: ChatServiceProvider, 
    private storage: LocalDataProvider,
    private toastCtrl: ToastController,
    private object_init: ObjectInitProvider,
    private errorHandler: ErrorHandlerProvider,
    private loadingCtrl: LoadingController,
    private user_svc: UserSvcProvider){
    this.loader.present()
    /* Get user from cache and get the users threads */
  	this.storage.getUser().then(user =>{
      if(user){
        this.user = this.object_init.initializeUser2(user);
        this.threads = this.chat_svc.getThreads(user)
        this.chat_svc.getThreads(user)
        .pipe(take(1))
        .subscribe( threads =>{
          if(threads.length > 0){
            threads.forEach(prop =>{
            this.imagesLoaded.push(false);
          })
            this.loader.dismiss()
          }else{
            this.loader.dismiss()
            this.noChats = true;
            //this.showToast('You currently have no chats')
          }
        },
        (err) =>{
          this.loader.dismiss()
          this.showToast(err.message);
        }
        )
      }
  	})
    .catch(err =>{
      this.errorHandler.handleError(err);
    })
  }

  ionViewDidLoad(){
   
  }

  /* This method extracts thread info, caches it and navigates to the thread messages page */
  gotoThread(thread: any){
    let shapedThread: Thread = {
      thread_id: thread.thread_id,
      uid: thread.uid,
      dp: thread.dp,
      displayName: thread.displayName
    }
    this.storage.setThread(shapedThread).then(val =>{
      this.navCtrl.push('ChatThreadPage', shapedThread);
    })
  	.catch(err => {
      this.errorHandler.handleError(err)
    })
  }

  ionViewDidLeave(){
    //this.chat_svc.reset();
  }

  showToast(text: string){
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000
    })
    toast.present()
  }

  userAutocomplete(event){
    
      this.user_svc.getAllUsers()
      .pipe(take(1))
      .subscribe(users =>{
        if(this.searchText == ''){
          this.users =  [];
        }else{
          this.users = users.filter(v =>{
            if(!v){
              return;
            }else{
              return v.email.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1  
            }
          })
        }
      })
   }

   selectUser(user: User){
    let to = {
      name: user.firstname ? user.firstname : 'anonymous',
      dp: user.photoURL,
      uid: user.uid,
      topic: 'Express assistance'
    }
    this.storage.setMessageDetails(to)
    .then(() =>{
      this.users = [];
      this.navCtrl.push('MessageInputPopupPage', to);
    })
   }

  /*monitorEnd(){
    //console.log('Content scrollHeight = ', this.content.scrollHeight)
    this.content.ionScrollEnd.subscribe(ev =>{
    let height = ev.scrollElement.scrollHeight;
    let top = ev.scrollElement.scrollTop;
    let offset = ev.scrollElement.offsetHeight;
      if(top > height - offset - 1){
        this.chat_svc.moreThreads(this.user)
      }
    })
  }*/

}
