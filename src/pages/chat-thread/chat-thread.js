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
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { UserSvcProvider } from '../../providers/user-svc/user-svc';
import { take } from 'rxjs-compat/operators/take';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
/**
 * Generated class for the ChatThreadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ChatThreadPage = /** @class */ (function () {
    function ChatThreadPage(navCtrl, navParams, chat_svc, object_init, storage, user_svc, toast_svc) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.chat_svc = chat_svc;
        this.object_init = object_init;
        this.storage = storage;
        this.user_svc = user_svc;
        this.toast_svc = toast_svc;
        this.text = '';
        this.threads = [];
        this.loading = false;
        this.loading = true;
        this.threadInfo = this.navParams.data;
        console.log('navParams  ', this.navParams.data.thread_id);
        this.user = this.object_init.initializeUser();
        this.storage.getThread().then(function (thread) {
            _this.thread = _this.chat_svc.getThreadChats(thread.thread_id);
            _this.chat_svc.getThreadChats(thread.thread_id)
                .pipe(take(1))
                .subscribe(function (threadd) {
                if (threadd.length > 0) {
                    _this.loading = false;
                }
                else {
                    _this.toast_svc.showToast('You have no messages from this chat, they may have been deleted...');
                    _this.loading = false;
                }
                console.log('chats ', threadd);
            });
        })
            .catch(function (err) { return console.log(err); });
        this.message = this.object_init.initializeChatMessage();
        this.storage.getUser().then(function (user) {
            _this.chat_svc.getThreads(user).subscribe(function (threads) {
                console.log('Threads: ', threads);
                _this.threads = threads;
            });
            _this.user_svc.getUser(user.uid).subscribe(function (synced_user) {
                console.log('user changed...', synced_user.threads);
                _this.user = _this.object_init.initializeUser2(synced_user);
            });
        });
    }
    ChatThreadPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ChatThreadPage');
        this.scrollToBottom();
    };
    ChatThreadPage.prototype.scrollToBottom = function () {
        this.content.scrollToBottom();
    };
    ChatThreadPage.prototype.handleSubmit = function (event) {
        if (event.keyCode === 13) {
            this.send();
            this.scrollToBottom();
        }
    };
    ChatThreadPage.prototype.send = function () {
        this.message.text = this.text;
        this.message.timeStamp = Date.now();
        this.message.by.displayName = this.user.firstname;
        this.message.by.uid = this.user.uid;
        this.message.by.dp = this.user.photoURL;
        this.message.to.displayName = this.threadInfo.displayName;
        this.message.to.dp = this.threadInfo.dp;
        this.message.to.uid = this.threadInfo.uid;
        this.chat_svc.sendMessage(this.message, this.threads);
        this.text = '';
        this.scrollToBottom();
    };
    __decorate([
        ViewChild('scroller'),
        __metadata("design:type", ElementRef)
    ], ChatThreadPage.prototype, "feedContainer", void 0);
    __decorate([
        ViewChild(Content),
        __metadata("design:type", Content)
    ], ChatThreadPage.prototype, "content", void 0);
    ChatThreadPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-chat-thread',
            templateUrl: 'chat-thread.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            ChatServiceProvider,
            ObjectInitProvider,
            LocalDataProvider,
            UserSvcProvider,
            ToastSvcProvider])
    ], ChatThreadPage);
    return ChatThreadPage;
}());
export { ChatThreadPage };
//# sourceMappingURL=chat-thread.js.map