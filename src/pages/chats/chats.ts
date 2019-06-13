import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, LoadingController } from 'ionic-angular';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { Thread } from '../../models/thread.interface';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
//import { Observable } from 'rxjs';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { User } from '../../models/users/user.interface';
import { take } from 'rxjs-compat/operators/take';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { UserSvcProvider } from '../../providers/user-svc/user-svc';
import { Subscription } from 'rxjs-compat/Subscription';

@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {
  //@ViewChild(Content) content: Content;
  threads: Thread[];
  threadSubs: Subscription = null;
  threadStampsSubs: Subscription = null;
  unseenSubs: Subscription = null;
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
    this.loader.setDuration(4000);
    this.loader.present();
    /* Get user from cache and get the users threads */
  	this.storage.getUser().then(user =>{
      if(user != undefined){
        this.user = this.object_init.initializeUser2(user); //initializing user from cache
        let ids: string[] = []; //Array to contain all thread_ids for this user
        let modifiedThreads: Thread[] = []; //Array to contain threads which are rearranged by timeStamp value
        //console.log(user)
        /**
        * Subscribe to users threads and assign subscription to threadSubs
        */
        this.threadSubs = this.chat_svc.getThreads(user)
        .subscribe( threads =>{
          this.threadStampsSubs = this.chat_svc.getThreadTimeStamps(user.uid)
          //.pipe(take(1))
          .subscribe(timestamps =>{
            modifiedThreads = [];
            this.threads = [];
            //Putting the thread ids of the timeStamps in ids (the timestamps are already in descending order and so are the ids)
            timestamps.forEach(stamp =>{
              //console.log(stamp)
              ids.push(stamp.payload.doc.id)
            })
            //Checking for thread whos timestamps are captured and putting them in modifiedThreads
            threads.forEach(thread =>{
              if(ids.indexOf(thread.thread_id) != -1){ //if thread_id exists in ids, push into modified threads
                modifiedThreads.push(thread)
              }
            })
            //Ordering the threads in mofiedThreads according to the order in ids
            threads.forEach(thread =>{
              if(ids.indexOf(thread.thread_id) != -1){ //if thread_id exists in ids (of threads which have timeStamps)
                //console.log('Recent thread: ', thread.displayName)
                modifiedThreads[ids.indexOf(thread.thread_id)] = thread; //order threads according to the order in the ids array 
              }
            })
            //Add the other threads which dont have timeStamps yet
            threads.forEach(thread =>{
              if(ids.indexOf(thread.thread_id) == -1){
                modifiedThreads.push(thread);
              }
            })
            //Make sure to add thread only once
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
            
          }else{
            
            this.noChats = true;
            //this.showToast('You currently have no chats')
          }
        },
        (err) =>{
          
          this.showToast(err.message);
        }
        )
      }
  	})
    .catch(err =>{
      
      this.errorHandler.handleError(err);
    })
  }

  getLastChat(thread_id: string){
    this.chat_svc.getLastChat(thread_id)
    .pipe(take(1))
    .subscribe(chats =>{
      chats.forEach(chat =>{
        console.log(chat.text);
      })
    })
  }

  getUnseen(thread_id: string): Promise<number>{
    console.log('Unseen triggered...')
    return new Promise<number>((resolve, reject) =>{
      this.unseenSubs = this.chat_svc.getUnseenThreadChats(thread_id, this.user.uid)
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
    
      this.navCtrl.push('ChatThreadPage', shapedThread);
  }

  ionViewDidLeave(){
    if(this.threadSubs != null) this.threadSubs.unsubscribe();
    if(this.threadStampsSubs != null) this.threadStampsSubs.unsubscribe();
    if(this.unseenSubs != null) this.unseenSubs.unsubscribe();
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
