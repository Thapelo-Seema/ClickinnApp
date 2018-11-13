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
import { IonicPage, NavController, AlertController, ModalController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
//import { File } from '@ionic-native/file';
//import { FileTransfer } from '@ionic-native/file-transfer';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { take } from 'rxjs-compat/operators/take';
import { DepositProvider } from '../../providers/deposit/deposit';
import { UserSvcProvider } from '../../providers/user-svc/user-svc';
/**
 * Generated class for the SecurePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var SecurePage = /** @class */ (function () {
    function SecurePage(navCtrl, alertCtrl, storage, errHandler, 
    //private file: File, 
    // private fileTransfer: FileTransfer,
    user_svc, object_init, deposit_svc, modalCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.alertCtrl = alertCtrl;
        this.storage = storage;
        this.errHandler = errHandler;
        this.user_svc = user_svc;
        this.object_init = object_init;
        this.deposit_svc = deposit_svc;
        this.modalCtrl = modalCtrl;
        this.reference = '';
        this.loading = false;
        this.imageLoaded = false;
        this.deposit = null;
        this.sendingRequest = false;
        this.deposit = this.object_init.initializeDeposit();
        this.apartment = this.object_init.initializeApartment();
        this.user = this.object_init.initializeUser();
        this.storage.getUser().then(function (user) {
            _this.user_svc.getUser(user.uid)
                .pipe(take(1))
                .subscribe(function (data) {
                _this.user = data;
                _this.deposit.by.firstname = data.firstname;
                _this.deposit.by.lastname = data.lastname;
                _this.deposit.by.dp = data.photoURL;
                _this.deposit.by.uid = data.uid;
            });
        });
        this.storage.getApartment().then(function (data) {
            _this.apartment = data;
            _this.deposit.apartment = data;
            _this.user_svc.getUser(data.property.user_id)
                .pipe(take(1))
                .subscribe(function (host) {
                _this.deposit.to.firstname = host.firstname;
                _this.deposit.to.lastname = host.lastname;
                _this.deposit.to.dp = host.photoURL;
                _this.deposit.to.uid = host.uid;
            });
        })
            .catch(function (err) {
            _this.errHandler.handleError(err);
            _this.loading = false;
        });
        this.deposit_svc.getPricing()
            .pipe(take(1))
            .subscribe(function (data) {
            _this.deposit.landlord_credit = _this.apartment.deposit - (_this.apartment.deposit * data.deposit_commision);
        });
    }
    SecurePage.prototype.ionViewWillLoad = function () {
    };
    SecurePage.prototype.promptConfirm = function () {
        var _this = this;
        var confirm = false;
        var alert = this.alertCtrl.create({
            title: "Confirm intention",
            message: "Are you sure you want to deposit this apartment RIGHT NOW ?",
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
                _this.sendingRequest = true;
                //this.generateRef()
                _this.deposit.time_initiated = new Date();
                _this.deposit_svc.addDeposit(_this.deposit).then(function () {
                    _this.sendingRequest = false;
                    _this.showAlert();
                })
                    .catch(function (err) {
                    console.log(err);
                    _this.sendingRequest = false;
                });
            }
        });
    };
    SecurePage.prototype.generateRef = function () {
        this.reference = this.apartment.room_type.substring(2, 4) +
            this.apartment.property.user_id.substring(2, 4) +
            this.user.firstname.substring(0, 2) +
            this.user.lastname.substring(0, 2) +
            new Date().getHours().toString().substring(0, 1) +
            new Date().getMinutes().toString().substring(0, 1);
        this.deposit.ref = this.reference;
        this.showAlert();
    };
    SecurePage.prototype.showAlert = function () {
        var alert = this.alertCtrl.create({
            title: 'Request Sent !',
            subTitle: 'Thank you for choosing this safe deposit method !',
            message: " Please wait for confirmation from the property manager before you go ahead with the deposit.",
            buttons: ['OK']
        });
        alert.present();
    };
    SecurePage.prototype.comingSoon = function () {
        var alert = this.alertCtrl.create({
            title: 'Coming Soon!',
            subTitle: 'This feature is still under construction, please communicate with the advertiser about payments',
            buttons: ['OK']
        });
        alert.present();
    };
    SecurePage.prototype.gotoPayment = function (paymentMethod) {
        var _this = this;
        this.navCtrl.push('PaymentDetailsPage', { payment_method: paymentMethod })
            .catch(function (err) {
            _this.errHandler.handleError(err);
            _this.loading = false;
        });
    };
    SecurePage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-secure',
            templateUrl: 'secure.html',
        }),
        __metadata("design:paramtypes", [NavController,
            AlertController,
            LocalDataProvider,
            ErrorHandlerProvider,
            UserSvcProvider,
            ObjectInitProvider,
            DepositProvider,
            ModalController])
    ], SecurePage);
    return SecurePage;
}());
export { SecurePage };
//# sourceMappingURL=secure.js.map