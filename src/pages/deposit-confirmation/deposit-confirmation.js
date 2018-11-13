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
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { DepositProvider } from '../../providers/deposit/deposit';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { UserSvcProvider } from '../../providers/user-svc/user-svc';
import { take } from 'rxjs-compat/operators/take';
/**
 * Generated class for the DepositConfirmationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var DepositConfirmationPage = /** @class */ (function () {
    function DepositConfirmationPage(navCtrl, navParams, storage, deposit_svc, object_init, toast_svc, chat_svc, user_svc) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.deposit_svc = deposit_svc;
        this.object_init = object_init;
        this.toast_svc = toast_svc;
        this.chat_svc = chat_svc;
        this.user_svc = user_svc;
        this.loading = true;
        this.host = false;
        this.processing = false;
        this.imageLoaded = false;
        this.imagesLoaded = [false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false
        ];
        this.loading = true;
        this.deposit = this.object_init.initializeDeposit();
        this.message = this.object_init.initializeChatMessage();
    }
    DepositConfirmationPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.storage.getTransactionState()
            .then(function (state) {
            if (state.type == 'host_accept_deposit')
                _this.host = true;
            _this.deposit_svc.getDepositById(state.id)
                .subscribe(function (deposit) {
                _this.deposit = deposit;
                _this.loading = false;
                if (!(deposit.apartment.images.length > 0)) {
                    _this.images = Object.keys(deposit.apartment.images).map(function (imageId) {
                        _this.imagesLoaded.push(false);
                        return deposit.apartment.images[imageId];
                    });
                    _this.apartImgCount = _this.images.length;
                }
                else {
                    _this.images = deposit.apartment.images;
                    _this.apartImgCount = deposit.apartment.images.length;
                }
            });
        });
    };
    DepositConfirmationPage.prototype.acceptDeposit = function () {
        var _this = this;
        this.processing = true;
        this.deposit.agent_goAhead = true;
        this.deposit_svc.updateDeposit(this.deposit)
            .then(function () {
            _this.processing = false;
            _this.toast_svc.showToast('You have accepted this deposit payment');
        })
            .catch(function (err) {
            _this.processing = false;
            console.log(err);
        });
    };
    DepositConfirmationPage.prototype.rejectDeposit = function () {
        var _this = this;
        this.processing = true;
        this.message.topic = "Regarding your deposit of R" + this.deposit.apartment.price + " for the " + this.deposit.apartment.room_type;
        this.message.text = "Hi " + this.deposit.by.firstname + ", I can not accept your deposit request, text me back if you want reasons";
        this.message.to.uid = this.deposit.by.uid;
        this.message.to.dp = this.deposit.by.dp;
        this.message.to.displayName = this.deposit.by.firstname;
        this.message.by.uid = this.deposit.to.uid;
        this.message.by.dp = this.deposit.to.dp;
        this.message.by.displayName = this.deposit.to.firstname;
        this.user_svc.getUser(this.deposit.to.uid)
            .pipe(take(1))
            .subscribe(function (user) {
            _this.message.timeStamp = Date.now();
            _this.chat_svc.sendMessage(_this.message, user.threads);
        });
        this.deposit.agent_goAhead = false;
        this.deposit_svc.updateDeposit(this.deposit)
            .then(function () {
            _this.processing = false;
            _this.toast_svc.showToast('You have rejected this deposit payment');
        })
            .catch(function (err) {
            _this.processing = false;
            console.log(err);
        });
    };
    DepositConfirmationPage.prototype.cancelDeposit = function () {
        var _this = this;
        this.processing = true;
        this.message.topic = "Regarding the deposit of R" + this.deposit.apartment.price + " for the " + this.deposit.apartment.room_type;
        this.message.text = "Hi " + this.deposit.to.firstname + ", I couldn't complete the deposit, text me back if you want reasons";
        this.message.to.uid = this.deposit.to.uid;
        this.message.to.dp = this.deposit.to.dp;
        this.message.to.displayName = this.deposit.to.firstname;
        this.message.by.uid = this.deposit.by.uid;
        this.message.by.dp = this.deposit.by.dp;
        this.message.by.displayName = this.deposit.by.firstname;
        this.user_svc.getUser(this.deposit.by.uid)
            .pipe(take(1))
            .subscribe(function (user) {
            _this.message.timeStamp = Date.now();
            _this.chat_svc.sendMessage(_this.message, user.threads);
        });
        this.deposit.tenant_confirmed = false;
        this.deposit_svc.updateDeposit(this.deposit)
            .then(function () {
            _this.processing = false;
            _this.toast_svc.showToast('You have cancelled this deposit payment');
        })
            .catch(function (err) {
            _this.processing = false;
            console.log(err);
        });
    };
    DepositConfirmationPage.prototype.confirmDeposit = function () {
        var _this = this;
        this.processing = true;
        this.deposit.tenant_confirmed = true;
        this.deposit_svc.updateDeposit(this.deposit)
            .then(function () {
            _this.processing = false;
            _this.toast_svc.showToast('You have confirmed this deposit payment');
        })
            .catch(function (err) {
            _this.processing = false;
            console.log(err);
        });
    };
    DepositConfirmationPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-deposit-confirmation',
            templateUrl: 'deposit-confirmation.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            LocalDataProvider,
            DepositProvider,
            ObjectInitProvider,
            ToastSvcProvider,
            ChatServiceProvider,
            UserSvcProvider])
    ], DepositConfirmationPage);
    return DepositConfirmationPage;
}());
export { DepositConfirmationPage };
//# sourceMappingURL=deposit-confirmation.js.map