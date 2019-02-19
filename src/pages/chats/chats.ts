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
  threads: Thread[];
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
      if(user != undefined){
        this.user = this.object_init.initializeUser2(user);
        let ids: string[] = []
        let modifiedThreads: Thread[] = [];
        console.log(user)
        this.chat_svc.getThreads(user)
        .subscribe( threads =>{
          this.chat_svc.getThreadTimeStamps(user.uid)
          .pipe(take(1))
          .subscribe(timestamps =>{
            modifiedThreads = [];
            this.threads = [];
            //getting the order of the threads by timestamp in array ids
            timestamps.forEach(stamp =>{
              console.log(stamp)
              ids.push(stamp.payload.doc.id)
            })
            //Checking for thread whos timestamps are captured and putting them in modifiedThreads
            threads.forEach(thread =>{
              if(ids.indexOf(thread.thread_id) != -1){
                modifiedThreads.push(thread)
              }
            })
            //Ordering the threads in mofiedThreads according to the order in ids
            threads.forEach(thread =>{
              if(ids.indexOf(thread.thread_id) != -1){
                console.log('Recent thread: ', thread.displayName)
                modifiedThreads[ids.indexOf(thread.thread_id)] = thread;
              }
            })

            threads.forEach(thread =>{
              if(ids.indexOf(thread.thread_id) == -1){
                modifiedThreads.push(thread);
              }
            })
            let inserted = [];
            modifiedThreads.forEach(th =>{
              if(inserted.indexOf(th.thread_id) == -1){
                this.threads.push(th)
                inserted.push(th.thread_id)
              }
            })
          })
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

  getUnseen(thread_id: string){
    return new Promise<number>((resolve, reject) =>{
      this.chat_svc.getUnseenThreadChats(thread_id, this.user.uid)
      .subscribe(val =>{
        resolve(val.length)
      })
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
