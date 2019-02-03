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
import { IonicPage, NavController, ToastController, LoadingController } from 'ionic-angular';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { take } from 'rxjs-compat/operators/take';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
var ChatsPage = /** @class */ (function () {
    function ChatsPage(navCtrl, 
    //public navParams: NavParams, 
    chat_svc, storage, toastCtrl, object_init, errorHandler, loadingCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.chat_svc = chat_svc;
        this.storage = storage;
        this.toastCtrl = toastCtrl;
        this.object_init = object_init;
        this.errorHandler = errorHandler;
        this.loadingCtrl = loadingCtrl;
        this.loader = this.loadingCtrl.create();
        this.noChats = false;
        //loadingMore: boolean = false;
        //done: boolean = false;
        this.imagesLoaded = [false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false
        ];
        this.loader.present();
        /* Get user from cache and get the users threads */
        this.storage.getUser().then(function (user) {
            if (user) {
                _this.user = _this.object_init.initializeUser2(user);
                _this.threads = _this.chat_svc.getThreads(user);
                _this.chat_svc.getThreads(user)
                    .pipe(take(1))
                    .subscribe(function (threads) {
                    if (threads.length > 0) {
                        threads.forEach(function (prop) {
                            _this.imagesLoaded.push(false);
                        });
                        _this.loader.dismiss();
                    }
                    else {
                        _this.loader.dismiss();
                        _this.noChats = true;
                        //this.showToast('You currently have no chats')
                    }
                }, function (err) {
                    _this.loader.dismiss();
                    _this.showToast(err.message);
                });
            }
        })
            .catch(function (err) {
            _this.errorHandler.handleError(err);
        });
    }
    ChatsPage.prototype.ionViewDidLoad = function () {
    };
    /* This method extracts thread info, caches it and navigates to the thread messages page */
    ChatsPage.prototype.gotoThread = function (thread) {
        var _this = this;
        var shapedThread = {
            thread_id: thread.thread_id,
            uid: thread.uid,
            dp: thread.dp,
            displayName: thread.displayName
        };
        this.storage.setThread(shapedThread).then(function (val) {
            _this.navCtrl.push('ChatThreadPage', shapedThread);
        })
            .catch(function (err) {
            _this.errorHandler.handleError(err);
        });
    };
    ChatsPage.prototype.ionViewDidLeave = function () {
        //this.chat_svc.reset();
    };
    ChatsPage.prototype.showToast = function (text) {
        var toast = this.toastCtrl.create({
            message: text,
            duration: 3000
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
            ChatServiceProvider,
            LocalDataProvider,
            ToastController,
            ObjectInitProvider,
            ErrorHandlerProvider,
            LoadingController])
    ], ChatsPage);
    return ChatsPage;
}());
export { ChatsPage };
//# sourceMappingURL=chats.js.map