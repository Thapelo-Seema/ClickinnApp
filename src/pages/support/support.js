var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, List, LoadingController } from 'ionic-angular';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { UserSvcProvider } from '../../providers/user-svc/user-svc';
import { take } from 'rxjs-compat/operators/take';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
/**
 * Generated class for the SupportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var SupportPage = /** @class */ (function () {
    function SupportPage(navCtrl, navParams, chat_svc, object_init, storage, user_svc, toast_svc, loadingCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.chat_svc = chat_svc;
        this.object_init = object_init;
        this.storage = storage;
        this.user_svc = user_svc;
        this.toast_svc = toast_svc;
        this.loadingCtrl = loadingCtrl;
        this.text = '';
        this.loader = this.loadingCtrl.create();
        this.threads = [];
        this.loader.present();
        this.user = this.object_init.initializeUser();
        this.storage.getUser().then(function (user) {
            _this.user = _this.object_init.initializeUser2(user);
            //this.chat_svc.initGetThreadChats(thread.thread_id)
            /*this.chat_svc.loading.subscribe(data =>{
            this.loadingMore = data;
          })
      
          this.chat_svc.done.subscribe(data =>{
            this.done = data;
            if(this.done == true) this.loadingMore = false;
          })*/
            _this.thread = _this.chat_svc.getUserSupportMessages(user.uid);
            _this.chat_svc.getUserSupportMessages(user.uid)
                .pipe(take(1))
                .subscribe(function (threadd) {
                if (threadd.length > 0) {
                    _this.loader.dismiss();
                }
                else {
                    _this.toast_svc.showToast('You have no messages from this chat, they may have been deleted...');
                    _this.loader.dismiss();
                }
            }, function (err) {
                _this.toast_svc.showToast(err.message);
                _this.loader.dismiss();
            });
        })
            .catch(function (err) { return console.log(err); });
        this.message = this.object_init.initializeSupportMessage();
    }
    SupportPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.mutationObserver = new MutationObserver(function (mutations) {
            _this.content.scrollToBottom();
        });
        this.mutationObserver.observe(this.chatList.nativeElement, {
            childList: true
        });
    };
    SupportPage.prototype.scrollToBottom = function () {
        console.log('scrolling...');
        this.content.scrollToBottom();
    };
    SupportPage.prototype.handleSubmit = function (event) {
        if (event.keyCode === 13) {
            this.send();
            //this.scrollToBottom();
        }
    };
    SupportPage.prototype.send = function () {
        this.message.text = this.text;
        this.message.timeStamp = Date.now();
        this.message.user.displayName = this.user.firstname;
        this.message.user.uid = this.user.uid;
        this.message.user.dp = this.user.photoURL;
        this.message.sender = 'user';
        this.chat_svc.sendSupportMessage(this.message);
        this.text = '';
        //this.scrollToBottom();
    };
    __decorate([
        ViewChild('scroller'),
        __metadata("design:type", ElementRef)
    ], SupportPage.prototype, "feedContainer", void 0);
    __decorate([
        ViewChild(Content),
        __metadata("design:type", Content)
    ], SupportPage.prototype, "content", void 0);
    __decorate([
        ViewChild(List, { read: ElementRef }),
        __metadata("design:type", ElementRef)
    ], SupportPage.prototype, "chatList", void 0);
    SupportPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-support',
            templateUrl: 'support.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            ChatServiceProvider,
            ObjectInitProvider,
            LocalDataProvider,
            UserSvcProvider,
            ToastSvcProvider,
            LoadingController])
    ], SupportPage);
    return SupportPage;
}());
export { SupportPage };
//# sourceMappingURL=support.js.map