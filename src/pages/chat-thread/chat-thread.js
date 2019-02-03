var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, Content, List, LoadingController, ModalController } from 'ionic-angular';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { LocalDataProvider } from '../../providers/local-data/local-data';
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
var ChatThreadPage = /** @class */ (function () {
    function ChatThreadPage(navCtrl, 
    // public navParams: NavParams, 
    chat_svc, object_init, storage, user_svc, toast_svc, errHandler, loadingCtrl, modalCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.chat_svc = chat_svc;
        this.object_init = object_init;
        this.storage = storage;
        this.user_svc = user_svc;
        this.toast_svc = toast_svc;
        this.errHandler = errHandler;
        this.loadingCtrl = loadingCtrl;
        this.modalCtrl = modalCtrl;
        this.text = '';
        this.threads = [];
        this.loader = this.loadingCtrl.create();
        this.noMessages = false;
        this.imagesLoaded = [false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false
        ];
        this.loader.present();
        this.user = this.object_init.initializeUser(); //Initializing an empty user
        this.message = this.object_init.initializeChatMessage(); //Initialize empty chat message
        /*Retrieve cached thread in order to get some thread info and thread chats*/
        this.storage.getThread().then(function (thread) {
            _this.threadInfo = thread;
            _this.thread = _this.chat_svc.getThreadChats(thread.thread_id);
            _this.chat_svc.getThreadChats(thread.thread_id)
                .pipe(take(1))
                .subscribe(function (threadd) {
                if (threadd.length > 0) {
                    threadd.forEach(function (item) {
                        _this.imagesLoaded.push(false);
                        //let ch = this.object_init.initializeChatMessag2(item)
                        //this.chats.push(ch);
                    });
                    //this.sweepMessages(threadd.length)
                }
                else {
                    _this.noMessages = true;
                }
                _this.storage.getUser().then(function (user) {
                    _this.chat_svc.getThreads(user).pipe(take(1)).subscribe(function (threads) {
                        _this.threads = threads;
                        threads.forEach(function (th) {
                            if (th.thread_id == _this.threadInfo.thread_id)
                                _this.threadInfo = th; //Update thread info with a more complete threadInfo object
                        });
                        _this.loader.dismiss();
                    }, function (err) {
                        _this.loader.dismiss();
                        _this.toast_svc.showToast('Error loading threads');
                    });
                    _this.user_svc.getUser(user.uid).pipe(take(1)).subscribe(function (synced_user) {
                        _this.user = _this.object_init.initializeUser2(synced_user);
                    });
                })
                    .catch(function (err) {
                    _this.loader.dismiss();
                    _this.toast_svc.showToast('Could not get user');
                });
            }, function (err) {
                _this.loader.dismiss();
                _this.errHandler.handleError(err);
            });
        })
            .catch(function (err) {
            _this.loader.dismiss();
            _this.errHandler.handleError(err);
        });
        /* Get a synched user and get a more complete threadInfo object */
    }
    ChatThreadPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        console.log('chats loading...');
        //Scrolling to the bottom when there's changes to the chatList NativeElement and marking messages as read
        this.mutationObserver = new MutationObserver(function (mutations) {
            _this.content.scrollToBottom();
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
    };
    ChatThreadPage.prototype.ionViewDidLeave = function () {
        // this.chat_svc.reset();
        // this.chat_svc.initGetThreads(this.user);
    };
    ChatThreadPage.prototype.attachApartment = function () {
        this.populateMsg();
        var modal = this.modalCtrl.create('AttachmentPopupPage', this.message);
        modal.present();
    };
    ChatThreadPage.prototype.scrollToBottom = function () {
        this.content.scrollToBottom();
    };
    ChatThreadPage.prototype.handleSubmit = function (event) {
        if (event.keyCode === 13) {
            this.send();
            //this.scrollToBottom();
        }
    };
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
    ChatThreadPage.prototype.populateMsg = function () {
        this.message.by.displayName = this.user.firstname;
        this.message.by.uid = this.user.uid;
        this.message.by.dp = this.user.photoURL;
        this.message.to.displayName = this.threadInfo.displayName;
        this.message.to.dp = this.threadInfo.dp;
        this.message.to.uid = this.threadInfo.uid;
    };
    //Populate the required chatMessage fields and send the message 
    ChatThreadPage.prototype.send = function () {
        this.message.text = this.text;
        this.message.timeStamp = Date.now();
        this.populateMsg();
        this.chat_svc.sendMessage(this.message, this.threads);
        /*.then(() =>{
          this.message.sent = true;
          this.chat_svc.updateMessage(this.threadInfo.thread_id, this.message)
        })*/
        this.text = '';
        //this.scrollToBottom();
    };
    ChatThreadPage.prototype.returnFirst = function (input) {
        if (input == undefined)
            return '';
        return input.split(',')[0] + ', ' + input.split(',')[1];
    };
    ChatThreadPage.prototype.gotoApartment = function (apartment) {
        var _this = this;
        //delete apartment.doc
        this.storage.setApartment(apartment).then(function (data) {
            //this.accom_svc.reset();
            _this.navCtrl.push('ApartmentDetailsPage');
        })
            .catch(function (err) {
            console.log(err);
        });
    };
    __decorate([
        ViewChild(Content),
        __metadata("design:type", Content)
    ], ChatThreadPage.prototype, "content", void 0);
    __decorate([
        ViewChild(List, { read: ElementRef }),
        __metadata("design:type", ElementRef)
    ], ChatThreadPage.prototype, "chatList", void 0);
    ChatThreadPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-chat-thread',
            templateUrl: 'chat-thread.html',
        }),
        __metadata("design:paramtypes", [NavController,
            ChatServiceProvider,
            ObjectInitProvider,
            LocalDataProvider,
            UserSvcProvider,
            ToastSvcProvider,
            ErrorHandlerProvider,
            LoadingController,
            ModalController])
    ], ChatThreadPage);
    return ChatThreadPage;
}());
export { ChatThreadPage };
//# sourceMappingURL=chat-thread.js.map