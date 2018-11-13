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
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { take } from 'rxjs-compat/operators/take';
var ChatsPage = /** @class */ (function () {
    function ChatsPage(navCtrl, navParams, chat_svc, storage, toastCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.chat_svc = chat_svc;
        this.storage = storage;
        this.toastCtrl = toastCtrl;
        this.loading = true;
        this.imagesLoaded = [false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false
        ];
        this.storage.getUser().then(function (user) {
            if (user) {
                _this.user = user;
                _this.threads = _this.chat_svc.getThreads(user);
                _this.chat_svc.getThreads(user)
                    .pipe(take(1))
                    .subscribe(function (threads) {
                    if (threads.length > 0) {
                        threads.forEach(function (prop) {
                            _this.imagesLoaded.push(false);
                        });
                        _this.loading = false;
                    }
                    else {
                        _this.loading = false;
                        _this.showToast('You currently have no chats, if you had some previous chats, they may have been deleted');
                    }
                }, function (err) {
                    _this.loading = false;
                    _this.showToast('There was an error fecthing your chats, if error persists please contact clickinn support');
                });
            }
        });
    }
    ChatsPage.prototype.gotoThread = function (thread) {
        var _this = this;
        this.storage.setThread(thread).then(function (val) {
            _this.navCtrl.push('ChatThreadPage', thread);
        })
            .catch(function (err) { return console.log(err); });
    };
    ChatsPage.prototype.showToast = function (text) {
        var toast = this.toastCtrl.create({
            message: text,
            duration: 60000
        });
        toast.present();
    };
    ChatsPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-chats',
            templateUrl: 'chats.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            ChatServiceProvider,
            LocalDataProvider,
            ToastController])
    ], ChatsPage);
    return ChatsPage;
}());
export { ChatsPage };
//# sourceMappingURL=chats.js.map