var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ModalController, AlertController, Content, LoadingController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { DepositProvider } from '../../providers/deposit/deposit';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { UserSvcProvider } from '../../providers/user-svc/user-svc';
import { take } from 'rxjs-compat/operators/take';
//import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
/**
 * Generated class for the DepositConfirmationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var DepositConfirmationPage = /** @class */ (function () {
    function DepositConfirmationPage(navCtrl, 
    //public navParams: NavParams,
    storage, deposit_svc, object_init, toast_svc, chat_svc, user_svc, modal, alertCtrl, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.storage = storage;
        this.deposit_svc = deposit_svc;
        this.object_init = object_init;
        this.toast_svc = toast_svc;
        this.chat_svc = chat_svc;
        this.user_svc = user_svc;
        this.modal = modal;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.loader = this.loadingCtrl.create();
        this.host = false;
        this.imageLoaded = false;
        this.movedIn = false;
        this.imagesLoaded = [false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false
        ];
        this.loader.present();
        this.deposit = this.object_init.initializeDeposit();
        this.message = this.object_init.initializeChatMessage();
    }
    DepositConfirmationPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.storage.getTransactionState()
            .then(function (state) {
            if (state.type == 'host_accept_deposit')
                _this.host = true;
            _this.depositSubs = _this.deposit_svc.getDepositById(state.id)
                .subscribe(function (deposit) {
                _this.deposit = _this.object_init.initializeDeposit2(deposit);
                _this.loader.dismiss();
                if (deposit.tenant_confirmed && !_this.host)
                    _this.movedIn = true;
                if (!(deposit.apartment.images.length > 0)) {
                    _this.images = Object.keys(deposit.apartment.images).map(function (imageId) {
                        _this.imagesLoaded.push(false);
                        return deposit.apartment.images[imageId];
                    });
                    _this.apartImgCount = _this.images.length;
                    _this.content.scrollToBottom();
                }
                else {
                    _this.images = deposit.apartment.images;
                    _this.apartImgCount = deposit.apartment.images.length;
                    _this.content.scrollToBottom();
                }
            }, function (err) {
                _this.toast_svc.showToast(err.message);
                _this.loader.dismiss();
            });
        });
    };
    DepositConfirmationPage.prototype.ionViewWillLeave = function () {
        this.depositSubs.unsubscribe();
    };
    DepositConfirmationPage.prototype.generateRef = function () {
        var refference = this.deposit.apartment.room_type.substring(2, 4) +
            this.deposit.apartment.property.user_id.substring(2, 4) +
            this.deposit.by.firstname.substring(0, 2) +
            this.deposit.by.lastname.substring(0, 2) +
            new Date().getHours().toString().substring(0, 1) +
            new Date().getMinutes().toString().substring(0, 1);
        this.deposit.ref = refference;
    };
    DepositConfirmationPage.prototype.showInput = function (deposit) {
        var _this = this;
        var to;
        if (this.host) {
            to = {
                uid: deposit.by.uid,
                dp: deposit.by.dp,
                name: deposit.by.firstname ? deposit.by.firstname : '',
                topic: "Regarding your request to deposit the " + deposit.apartment.price + " " + deposit.apartment.room_type + " at " + deposit.apartment.property.address.description
            };
        }
        else if (this.host == false) {
            to = {
                uid: deposit.to.uid,
                dp: deposit.to.dp,
                name: deposit.to.firstname ? deposit.by.firstname : '',
                topic: "Regarding the request of " + deposit.by.firstname + " to deposit the " + deposit.apartment.price + " " + deposit.apartment.room_type + " at " + deposit.apartment.property.address.description
            };
        }
        this.storage.setMessageDetails(to).then(function (val) {
            _this.modal.create('MessageInputPopupPage', to).present();
        });
    };
    DepositConfirmationPage.prototype.acceptDeposit = function () {
        var _this = this;
        var confirm = false;
        var alert = this.alertCtrl.create({
            title: "Accept Payment",
            message: "Are you sure you want to accept this deposit payment ?",
            buttons: [
                {
                    text: 'Accept',
                    handler: function (data) {
                        confirm = true;
                    }
                },
                {
                    role: 'cancel',
                    text: 'Cancel',
                    handler: function (data) {
                        confirm = false;
                    }
                }
            ]
        });
        alert.present();
        alert.onDidDismiss(function (data) {
            if (confirm) {
                var ldr_1 = _this.loadingCtrl.create();
                ldr_1.present();
                _this.generateRef();
                _this.deposit.agent_goAhead = true;
                _this.deposit.time_agent_confirm = Date.now();
                _this.deposit.timeStampModified = Date.now();
                _this.deposit_svc.updateDeposit(_this.deposit)
                    .then(function () {
                    ldr_1.dismiss();
                    _this.toast_svc.showToast('You have accepted this deposit payment');
                })
                    .catch(function (err) {
                    ldr_1.dismiss();
                    console.log(err);
                });
            }
            else {
                _this.toast_svc.showToast('Deposit NOT accepted.');
            }
        });
    };
    DepositConfirmationPage.prototype.rejectDeposit = function () {
        var _this = this;
        var confirm = false;
        var alert = this.alertCtrl.create({
            title: "Decline Deposit Payment",
            message: "Are you sure you want to decline this deposit payment ?",
            buttons: [
                {
                    text: 'Decline',
                    handler: function (data) {
                        confirm = true;
                    }
                },
                {
                    role: 'cancel',
                    text: 'Cancel',
                    handler: function (data) {
                        confirm = false;
                    }
                }
            ]
        });
        alert.present();
        alert.onDidDismiss(function (data) {
            if (confirm == true) {
                var ldr_2 = _this.loadingCtrl.create();
                ldr_2.present();
                _this.message.topic = "Regarding your deposit of R" + _this.deposit.apartment.price + " for the " + _this.deposit.apartment.room_type;
                _this.message.text = "Hi " + _this.deposit.by.firstname + ", I can not accept your deposit request, text me back if you want reasons";
                _this.message.to.uid = _this.deposit.by.uid;
                _this.message.to.dp = _this.deposit.by.dp;
                _this.message.to.displayName = _this.deposit.by.firstname;
                _this.message.by.uid = _this.deposit.to.uid;
                _this.message.by.dp = _this.deposit.to.dp;
                _this.message.by.displayName = _this.deposit.to.firstname;
                _this.user_svc.getUser(_this.deposit.to.uid)
                    .pipe(take(1))
                    .subscribe(function (user) {
                    _this.message.timeStamp = Date.now();
                    _this.chat_svc.sendMessage(_this.message, user.threads);
                });
                _this.deposit.agent_goAhead = false;
                _this.deposit.timeStampModified = Date.now();
                _this.deposit.time_agent_confirm = Date.now();
                _this.deposit_svc.updateDeposit(_this.deposit)
                    .then(function () {
                    ldr_2.dismiss();
                    _this.toast_svc.showToast('You have rejected this deposit payment');
                })
                    .catch(function (err) {
                    ldr_2.dismiss();
                    console.log(err);
                });
            }
            else {
                _this.toast_svc.showToast('You have NOT rejected this deposit payment');
            }
        });
    };
    DepositConfirmationPage.prototype.cancelDeposit = function () {
        var _this = this;
        var confirm = false;
        var alert = this.alertCtrl.create({
            title: "Cancel Payment",
            message: "Are you sure you want to cancel this deposit payment ?",
            buttons: [
                {
                    text: 'Yes cancel',
                    handler: function (data) {
                        confirm = true;
                    }
                },
                {
                    role: 'cancel',
                    text: 'No do not cancel',
                    handler: function (data) {
                        confirm = false;
                    }
                }
            ]
        });
        alert.present();
        alert.onDidDismiss(function (data) {
            if (confirm == true) {
                var ldr_3 = _this.loadingCtrl.create();
                ldr_3.present();
                _this.message.topic = "Regarding the deposit of R" + _this.deposit.apartment.price + " for the " + _this.deposit.apartment.room_type;
                _this.message.text = "Hi " + _this.deposit.to.firstname + ", I couldn't complete the deposit, text me back if you want reasons";
                _this.message.to.uid = _this.deposit.to.uid;
                _this.message.to.dp = _this.deposit.to.dp;
                _this.message.to.displayName = _this.deposit.to.firstname;
                _this.message.by.uid = _this.deposit.by.uid;
                _this.message.by.dp = _this.deposit.by.dp;
                _this.message.by.displayName = _this.deposit.by.firstname;
                _this.user_svc.getUser(_this.deposit.by.uid)
                    .pipe(take(1))
                    .subscribe(function (user) {
                    _this.message.timeStamp = Date.now();
                    _this.chat_svc.sendMessage(_this.message, user.threads);
                });
                _this.deposit.time_tenant_confirmed = Date.now();
                _this.deposit.timeStampModified = Date.now();
                _this.deposit.tenant_confirmed = false;
                _this.deposit_svc.updateDeposit(_this.deposit)
                    .then(function () {
                    ldr_3.dismiss();
                    _this.toast_svc.showToast('You have cancelled this deposit payment');
                })
                    .catch(function (err) {
                    ldr_3.dismiss();
                    console.log(err);
                });
            }
            else {
                _this.toast_svc.showToast('You have NOT cancelled this deposit payment');
            }
        });
    };
    DepositConfirmationPage.prototype.confirmDeposit = function () {
        var _this = this;
        var confirm = false;
        var alert = this.alertCtrl.create({
            title: "Confirm Payment",
            message: "Are you sure you have paid the required amount in full ?",
            buttons: [
                {
                    text: 'Confirm',
                    handler: function (data) {
                        confirm = true;
                    }
                },
                {
                    role: 'cancel',
                    text: 'Cancel',
                    handler: function (data) {
                        confirm = false;
                    }
                }
            ]
        });
        alert.present();
        alert.onDidDismiss(function (data) {
            if (confirm) {
                var ldr_4 = _this.loadingCtrl.create();
                ldr_4.present();
                _this.deposit.tenant_confirmed = true;
                _this.deposit.time_tenant_confirmed = Date.now();
                _this.deposit.timeStampModified = Date.now();
                _this.deposit_svc.updateDeposit(_this.deposit)
                    .then(function () {
                    ldr_4.dismiss();
                    _this.toast_svc.showToast('You have confirmed this deposit payment');
                })
                    .catch(function (err) {
                    ldr_4.dismiss();
                    console.log(err);
                });
            }
            else {
                _this.toast_svc.showToast('You have NOT confirmed this deposit payment');
            }
        });
    };
    DepositConfirmationPage.prototype.confirmMoveIn = function () {
        var _this = this;
        var confirm = false;
        var alert = this.alertCtrl.create({
            title: "CONFIRM MOVE IN",
            message: "Are you sure you want to confirm this move in ?",
            buttons: [
                {
                    text: 'Confirm',
                    handler: function (data) {
                        confirm = true;
                    }
                },
                {
                    role: 'cancel',
                    text: 'Cancel',
                    handler: function (data) {
                        confirm = false;
                    }
                }
            ]
        });
        alert.present();
        alert.onDidDismiss(function (data) {
            if (confirm) {
                var ldr_5 = _this.loadingCtrl.create();
                ldr_5.present();
                _this.deposit.tenantMovedIn = true;
                _this.deposit.timeStampModified = Date.now();
                _this.deposit_svc.updateDeposit(_this.deposit)
                    .then(function () {
                    ldr_5.dismiss();
                    _this.toast_svc.showToast('You have confirmed your move in successfully, enjoy your stay !');
                })
                    .catch(function (err) {
                    ldr_5.dismiss();
                    console.log(err);
                });
            }
            else {
                _this.toast_svc.showToast('You have NOT confirmed your move in ');
            }
        });
    };
    __decorate([
        ViewChild(Content),
        __metadata("design:type", Content)
    ], DepositConfirmationPage.prototype, "content", void 0);
    DepositConfirmationPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-deposit-confirmation',
            templateUrl: 'deposit-confirmation.html',
        }),
        __metadata("design:paramtypes", [NavController,
            LocalDataProvider,
            DepositProvider,
            ObjectInitProvider,
            ToastSvcProvider,
            ChatServiceProvider,
            UserSvcProvider,
            ModalController,
            AlertController,
            LoadingController])
    ], DepositConfirmationPage);
    return DepositConfirmationPage;
}());
export { DepositConfirmationPage };
//# sourceMappingURL=deposit-confirmation.js.map