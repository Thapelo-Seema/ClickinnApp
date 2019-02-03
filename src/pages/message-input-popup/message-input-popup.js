var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
import { take } from 'rxjs-compat/operators/take';
/**
 * Generated class for the MessageInputPopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var MessageInputPopupPage = /** @class */ (function () {
    function MessageInputPopupPage(navCtrl, navParams, viewCtrl, objectInit, storage, chat_svc, toast_svc) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.objectInit = objectInit;
        this.storage = storage;
        this.chat_svc = chat_svc;
        this.toast_svc = toast_svc;
        this.message = this.objectInit.initializeChatMessage();
        this.user = this.objectInit.initializeUser();
        this.storage.getUser().then(function (user) {
            _this.chat_svc.getThreads(user).pipe(take(1)).subscribe(function (threads) {
                _this.threads = threads;
            });
            console.log('curentUers : ', user);
            _this.user = user;
            _this.message.by.displayName = _this.user.firstname ? _this.user.firstname : 'Anonymous';
            _this.message.by.dp = _this.user.photoURL ? _this.user.photoURL : 'assets/imgs/placeholder.png';
            _this.message.by.uid = _this.user.uid;
            _this.storage.getMessageDetails().then(function (to) {
                console.log('Navparams.data: ', to);
                _this.message.to.displayName = to.name;
                _this.message.to.dp = to.dp ? to.dp : 'assets/imgs/placeholder.png';
                _this.message.to.uid = to.uid;
                _this.message.topic = to.topic;
                console.log('to object: ', _this.message.to);
            });
        });
    }
    MessageInputPopupPage.prototype.close = function () {
        this.viewCtrl.dismiss();
    };
    MessageInputPopupPage.prototype.send = function () {
        this.message.timeStamp = Date.now();
        this.chat_svc.sendMessage(this.message, this.threads);
        this.close();
        this.toast_svc.showToast('Your message has been sent and it can be found in your chats...');
    };
    MessageInputPopupPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-message-input-popup',
            templateUrl: 'message-input-popup.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            ViewController,
            ObjectInitProvider,
            LocalDataProvider,
            ChatServiceProvider,
            ToastSvcProvider])
    ], MessageInputPopupPage);
    return MessageInputPopupPage;
}());
export { MessageInputPopupPage };
//# sourceMappingURL=message-input-popup.js.map