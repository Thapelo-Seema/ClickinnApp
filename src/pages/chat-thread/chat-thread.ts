import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, Content , List, LoadingController, ModalController, NavParams} from 'ionic-angular';
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
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
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
  @ViewChild(Content) content: Content;
  @ViewChild(List, {read: ElementRef}) chatList: ElementRef;
  message: ChatMessage;
  text: string = '';
  user: User;
  //loadingMore: boolean = false;
  //done: boolean = false;
  threadInfo: Thread; 
  threads: Thread[] = [];
  loader = this.loadingCtrl.create();
  contact: any;
  //chats: ChatMessage[] = [];
  mutationObserver: MutationObserver;
  noMessages: boolean = false;
  imagesLoaded: boolean[] = 
  [ false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, 
    false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false
  ];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private chat_svc: ChatServiceProvider,
  	private object_init: ObjectInitProvider, 
    private storage: LocalDataProvider, 
    private user_svc: UserSvcProvider,
    private toast_svc: ToastSvcProvider,
    private errHandler: ErrorHandlerProvider,
    private loadingCtrl: LoadingController,
    private modalCtrl:  ModalController){
    this.loader.present()
  	this.user = this.object_init.initializeUser(); //Initializing an empty user
    this.message = this.object_init.initializeChatMessage(); //Initialize empty chat message

    /*Retrieve cached thread in order to get some thread info and thread chats*/
    

      this.threadInfo = this.navParams.data;
      this.storage.setThread(this.threadInfo).catch(err => this.errHandler.handleError(err));

      if(this.threadInfo == null || this.threadInfo == undefined){
        this.storage.getThread().then(thread =>{
          this.threadInfo = thread;
          this.setupData();
        })
      }else{
        this.setupData();
      }
    /* Get a synched user and get a more complete threadInfo object */
  	
  }

  setupData(){
    this.thread = this.chat_svc.getThreadChats(this.threadInfo.thread_id);
      this.chat_svc.getThreadChats(this.threadInfo.thread_id)
      .pipe(take(1))
      .subscribe(threadd =>{
        console.log(threadd)
        this.contact = threadd[0]
        this.storage.getUser().then(user =>{
          this.user = this.object_init.initializeUser2(user);

          if(threadd.length > 0 ){
          threadd.forEach(item =>{
            this.imagesLoaded.push(false);
            this.chat_svc.removeUnseenMessage(item.id, user.uid)
            .catch(err => console.log(err))
            //let ch = this.object_init.initializeChatMessag2(item)
            //this.chats.push(ch);
          })
          //this.sweepMessages(threadd.length)
        }else{
          this.noMessages = true;
        }
          this.chat_svc.getThreads(user).pipe(take(1)).subscribe(threads =>{
            this.threads = threads;
            threads.forEach(th =>{
              if(th.thread_id == this.threadInfo.thread_id) this.threadInfo = th; //Update thread info with a more complete threadInfo object
            })
            this.loader.dismiss()
          },
          err =>{
            this.loader.dismiss()
            this.toast_svc.showToast('Error loading threads')
          })
          this.user_svc.getUser(user.uid).pipe(take(1)).subscribe(synced_user =>{
            this.user = this.object_init.initializeUser2(synced_user);
            this.populateMsg();
          })
        })
        .catch(err =>{
          this.loader.dismiss()
          this.toast_svc.showToast('Could not get user')
        })
      },
      err =>{
        this.loader.dismiss()
        this.errHandler.handleError(err)
      })
  }

  ionViewDidLoad() {
    console.log('chats loading...')
    
    //Scrolling to the bottom when there's changes to the chatList NativeElement and marking messages as read
    this.mutationObserver = new MutationObserver((mutations) => {
        this.content.scrollToBottom();
        /*for(let i = 1; i < this.chats.length; ++i){
          if(this.chats[this.chats.length - i].to.uid == this.user.uid){
            if(this.chats[this.chats.length - i].read == false){
              this.chats[this.chats.length - i].read = true;
              this.chats[this.chats.length - i].recieved = true;
              if(this.chats[this.chats.length - i].id != ''){
                console.log('Updating msg...', this.chats[this.chats.length - i]) 
                this.chat_svc.updateMessage(this.threadInfo.thread_id, this.chats[this.chats.length - i] )
              }
            }
          }
          if(i >= 5) break;
        }*/
    });

    this.mutationObserver.observe(this.chatList.nativeElement, {
        childList: true
    });
  }

  ionViewDidLeave(){
   // this.chat_svc.reset();
   // this.chat_svc.initGetThreads(this.user);
  }

  attachApartment(){
    this.populateMsg()
    let modal = this.modalCtrl.create('AttachmentPopupPage', this.message)
    modal.present();
  }

  scrollToBottom(){
    this.content.scrollToBottom();
  }

  handleSubmit(event){
    if(event.keyCode === 13){
      this.send();
      //this.scrollToBottom();
    }
  }

  /*sweepMessages(length: number){
    for(let i = 1; i < length; ++i){
      console.log('for loop...')
      if(this.chats[length - i].to.uid == this.user.uid){
        console.log('My message...')
        if(this.chats[length - i].read == false){
          console.log('Chat not read...')
          this.chats[length - i].read = true;
          this.chats[length - i].recieved = true;
          if(this.chats[length - i].id != ''){
            console.log('Updating msg...', this.chats[length - i]) 
            this.chat_svc.updateMessage(this.threadInfo.thread_id, this.chats[length - i] )
          }
        }
      }
    }
  }*/

  populateMsg(){
    this.message.by.displayName = this.user.firstname  + this.user.lastname;
    this.message.by.uid = this.user.uid;
    this.message.by.dp = this.user.photoURL;
    this.message.to.displayName = this.threadInfo.displayName;
    this.message.to.dp = this.threadInfo.dp;
    this.message.to.uid = this.threadInfo.uid;
  }

  //Populate the required chatMessage fields and send the message 
  send(){
    this.populateMsg();
    this.message.text = this.text;
  	this.message.timeStamp = Date.now();
    console.log('Sending... ', this.message)
  	this.chat_svc.sendMessage(this.message, this.threads)
    .then(() =>{
      this.text = '';
    })
      	//this.scrollToBottom();
  }

  returnFirst(input: string): string{
    if(input == undefined) return '';
    return input.split(',')[0] + ', ' + input.split(',')[1];
  }

  gotoApartment(apartment: any){
    //delete apartment.doc
    this.storage.setApartment(apartment).then(data => {
      //this.accom_svc.reset();
      this.navCtrl.push('ApartmentDetailsPage')
    })
    .catch(err => {
      console.log(err)
    });
  }

  /*monitorEnd(){
    //console.log('Content scrollHeight = ', this.content.scrollHeight)
    this.content.ionScrollEnd.subscribe(ev =>{
    let height = ev.scrollElement.scrollHeight;
    let top = ev.scrollElement.scrollTop;
    let offset = ev.scrollElement.offsetHeight;
      if(top > height - offset - 1){
        this.chat_svc.moreThreadChats(this.threadInfo.thread_id)
      }
    })
  }*/

}
