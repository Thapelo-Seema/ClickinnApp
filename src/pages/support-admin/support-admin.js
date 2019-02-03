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
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { take } from 'rxjs-compat/operators/take';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
import { LocalDataProvider } from '../../providers/local-data/local-data';
/**
 * Generated class for the SupportAdminPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var SupportAdminPage = /** @class */ (function () {
    function SupportAdminPage(navCtrl, navParams, chat_svc, toast_svc, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.chat_svc = chat_svc;
        this.toast_svc = toast_svc;
        this.storage = storage;
        this.loading = false;
        this.imagesLoaded = [false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false
        ];
        this.channels = this.chat_svc.getAllSupport();
        this.channelSubs = this.chat_svc.getAllSupport()
            .pipe(take(1))
            .subscribe(function (props) {
            if (props.length > 0) {
                props.forEach(function (prop) {
                    _this.imagesLoaded.push(false);
                });
                _this.loading = false;
            }
            else {
                _this.loading = false;
                _this.toast_svc.showToast('There are no messages...');
            }
        }, function (err) {
            _this.toast_svc.showToast(err.message);
            _this.loading = false;
        });
    }
    SupportAdminPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad SupportAdminPage');
    };
    SupportAdminPage.prototype.ionViewWillLeave = function () {
        this.channelSubs.unsubscribe();
    };
    SupportAdminPage.prototype.gotoChannel = function (channel_id) {
        var _this = this;
        this.storage.setChannelID(channel_id)
            .then(function (data) {
            _this.navCtrl.push('ChannelMessagesPage');
        })
            .catch(function (err) {
            console.log(err);
        });
    };
    SupportAdminPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-support-admin',
            templateUrl: 'support-admin.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            ChatServiceProvider,
            ToastSvcProvider,
            LocalDataProvider])
    ], SupportAdminPage);
    return SupportAdminPage;
}());
export { SupportAdminPage };
//# sourceMappingURL=support-admin.js.map