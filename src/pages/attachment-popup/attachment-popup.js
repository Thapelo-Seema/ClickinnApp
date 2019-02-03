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
import { IonicPage, NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import { LocalDataProvider } from '../../providers/local-data/local-data';
//import { Subscription } from 'rxjs-compat/Subscription';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
import { take } from 'rxjs-compat/operators/take';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
/**
 * Generated class for the AttachmentPopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var AttachmentPopupPage = /** @class */ (function () {
    function AttachmentPopupPage(navCtrl, navParams, accom_svc, local_db, toast_svc, viewCtrl, loadingCtrl, chat_svc, object_init) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.accom_svc = accom_svc;
        this.local_db = local_db;
        this.toast_svc = toast_svc;
        this.viewCtrl = viewCtrl;
        this.loadingCtrl = loadingCtrl;
        this.chat_svc = chat_svc;
        this.object_init = object_init;
        this.message = this.object_init.initializeChatMessage();
        this.loader = this.loadingCtrl.create();
        this.imagesLoaded = [false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false
        ];
        this.selectedIndex = 0;
        this.attached = [];
        this.loader.present();
        this.message = this.object_init.initializeChatMessag2(this.navParams.data);
        this.local_db.getUser()
            .then(function (user) {
            _this.chat_svc.getThreads(user).pipe(take(1)).subscribe(function (threads) {
                _this.threads = threads;
            }, function (err) {
                _this.loader.dismiss();
                _this.toast_svc.showToast('Error loading threads');
            });
            _this.user = _this.object_init.initializeUser2(user);
            _this.apartments = _this.accom_svc.getUserApartments(user.uid);
            _this.accom_svc.getUserApartments(user.uid)
                .pipe(take(1))
                .subscribe(function (aparts) {
                if (aparts.length > 0) {
                    aparts.forEach(function (apart) {
                        _this.imagesLoaded.push(false);
                        _this.attached.push(false);
                    });
                    _this.loader.dismiss();
                }
                else {
                    _this.loader.dismiss();
                    _this.toast_svc.showToast('You have no apartments linked to this profile, go ahead and upload some...');
                }
            }, function (err) {
                console.log(err);
                _this.loader.dismiss();
                _this.toast_svc.showToast('Error loading your apartments, please try again');
            });
        })
            .catch(function (err) {
            console.log(err);
            _this.loader.dismiss();
        });
    }
    AttachmentPopupPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad AttachmentPopupPage');
    };
    AttachmentPopupPage.prototype.addApartment = function (apartment, i) {
        console.log('Aapartment: ', i);
        this.message.attachment = apartment;
        this.attached[this.selectedIndex] = false;
        this.attached[i] = true;
        this.selectedIndex = i;
        console.log(this.attached);
    };
    AttachmentPopupPage.prototype.close = function () {
        this.viewCtrl.dismiss();
    };
    AttachmentPopupPage.prototype.cancelSelect = function (i) {
        if (i != undefined) {
            this.attached[i] = false;
            this.attached[this.selectedIndex] = false;
        }
        this.message.attachment = null;
    };
    AttachmentPopupPage.prototype.send = function () {
        console.log('Sending message...', this.message);
        this.message.timeStamp = Date.now();
        this.chat_svc.sendMessage(this.message, this.threads);
        this.close();
        //this.toast_svc.showToast('Your message has been sent and it can be found in your chats...');
    };
    AttachmentPopupPage.prototype.returnFirst = function (input) {
        if (input == undefined)
            return '';
        return input.split(',')[0] + ', ' + input.split(',')[1];
    };
    AttachmentPopupPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-attachment-popup',
            templateUrl: 'attachment-popup.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            AccommodationsProvider,
            LocalDataProvider,
            ToastSvcProvider,
            ViewController,
            LoadingController,
            ChatServiceProvider,
            ObjectInitProvider])
    ], AttachmentPopupPage);
    return AttachmentPopupPage;
}());
export { AttachmentPopupPage };
//# sourceMappingURL=attachment-popup.js.map