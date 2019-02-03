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
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { take } from 'rxjs-compat/operators/take';
import { UserSvcProvider } from '../../providers/user-svc/user-svc';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
//import { ChatMessage } from '../../models/chatmessage.interface';
var InfoPage = /** @class */ (function () {
    function InfoPage(navCtrl, navParams, storage, errHandler, object_init, accom_svc, user_svc, toast_svc, alertCtrl, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.errHandler = errHandler;
        this.object_init = object_init;
        this.accom_svc = accom_svc;
        this.user_svc = user_svc;
        this.toast_svc = toast_svc;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.images = [];
        this.loader = this.loadingCtrl.create();
        this.canEdit = false;
        this.heart = "ios-heart-outline";
        //chatMessage: ChatMessage;
        this.imagesLoaded = [false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false
        ];
        //this.chatMessage = this.object_init.initializeChatMessage();
        this.loader.present();
        this.apartment = this.object_init.initializeApartment();
        this.property = this.object_init.initializeProperty();
        this.pointOfInterest = this.object_init.initializeAddress();
    }
    InfoPage.prototype.ionViewWillLoad = function () {
        var _this = this;
        this.storage.getPaymentWarningSeen()
            .then(function (val) {
            if (val == undefined) {
                _this.showAlert();
            }
        });
        this.user = this.object_init.initializeUser();
        this.storage.getPOI().then(function (data) {
            _this.pointOfInterest = data;
            _this.loader.dismiss();
            //console.log('Description: ' + this.pointOfInterest.description + '\n' + 'Name: ' + this.pointOfInterest.name)
        })
            .catch(function (err) {
            _this.errHandler.handleError(err);
            _this.loader.dismiss();
        });
        this.storage.getApartment().then(function (data) {
            _this.apartment = _this.object_init.initializeApartment2(data);
            _this.accom_svc.getPropertyById(data.prop_id)
                .pipe(take(1))
                .subscribe(function (ppty) {
                _this.property = _this.object_init.initializeProperty2(ppty);
                console.log('nearbys ', _this.property.nearbys);
            });
            _this.storage.getUser().then(function (user) {
                _this.user = _this.object_init.initializeUser2(user);
                if (_this.user.firstime == true)
                    _this.showAlert();
                _this.user_svc.getUser(data.property.user_id)
                    .pipe(take(1))
                    .subscribe(function (host) {
                    //this.chatMessage = this.object_init.initializeChatMessageInComp(user, host);
                    _this.to = {
                        displayName: host.firstname,
                        dp: host.photoURL,
                        uid: host.uid,
                        topic: "Interest in your " + _this.apartment.room_type + " at " + (_this.apartment.property.address ? _this.apartment.property.address.description : '')
                    };
                    _this.storage.setMessageDetails(_this.to);
                });
                if (user.liked_apartments.indexOf(data.apart_id) != -1) {
                    _this.heart = 'ios-heart';
                }
                else {
                    _this.heart = 'ios-heart-outline';
                }
                if (_this.user.uid != undefined && _this.apartment.property.user_id != undefined &&
                    _this.apartment.property.user_id == _this.user.uid) {
                    _this.canEdit = true;
                }
            }).catch(function (err) { return console.log(err); });
            if (_this.apartment.property.nearbys == undefined || _this.apartment.property.nearbys == null ||
                _this.apartment.property.nearbys.length == 0) {
                _this.apartment.property.nearbys = [];
            }
            _this.images = [];
            _this.images = Object.keys(data.images).map(function (imageId) {
                _this.imagesLoaded.push(false);
                return data.images[imageId];
            });
            console.log(_this.images);
        })
            .catch(function (err) {
            _this.errHandler.handleError(err);
            _this.loader.dismiss();
        });
    };
    InfoPage.prototype.gotoApartment = function (apartment) {
        var _this = this;
        this.storage.setApartment(apartment).then(function (data) { return _this.navCtrl.push('EditApartmentPage'); })
            .catch(function (err) {
            console.log(err);
        });
    };
    InfoPage.prototype.gotoAppointment = function () {
        this.navCtrl.parent.select(1);
        this.navCtrl.push('AppointmentPage');
    };
    InfoPage.prototype.gotoSecure = function () {
        this.navCtrl.parent.select(2);
        this.navCtrl.push('SecurePage');
    };
    InfoPage.prototype.addToLiked = function () {
        var _this = this;
        var ldr = this.loadingCtrl.create();
        ldr.present();
        if (this.user.liked_apartments.indexOf(this.apartment.apart_id) != -1) {
            this.heart = 'ios-heart-outline';
            this.user.liked_apartments.splice(this.user.liked_apartments.indexOf(this.apartment.apart_id), 1);
            this.user_svc.updateUser(this.user)
                .then(function () {
                ldr.dismiss();
            });
        }
        else {
            this.heart = 'ios-heart';
            this.user.liked_apartments.push(this.apartment.apart_id);
            this.user_svc.updateUser(this.user).then(function () {
                ldr.dismiss()
                    .then(function (dat) {
                    _this.toast_svc.showToast("Apartment added to your 'liked apartments' ");
                });
            })
                .catch(function (err) {
                ldr.dismiss();
                console.log(err);
            });
        }
    };
    InfoPage.prototype.sendMessage = function () {
        this.navCtrl.push('MessageInputPopupPage');
    };
    InfoPage.prototype.showAlert = function () {
        var _this = this;
        var showPaymentSaftey = false;
        var alertC = this.alertCtrl.create({
            title: 'Payment Alert ',
            cssClass: 'alertNoty',
            message: "Please note that if you want to secure an apartment immediately, we highly recommend that you use the Clickinn payment system by pressing MAKE DEPOSIT NOW below ( it is a much safer option than paying money directly to the advertiser )",
            inputs: [
                {
                    name: 'dismis',
                    type: 'checkbox',
                    checked: false,
                    label: 'Do not show this again',
                    value: "false"
                }
            ],
            buttons: [
                {
                    role: 'cancel',
                    text: "OK",
                    handler: function (data) {
                        if (data.length > 0) {
                            _this.storage.setPaymentWarningSeen();
                        }
                        showPaymentSaftey = false;
                    }
                },
                {
                    text: 'Find out more',
                    handler: function (data) {
                        if (data.length > 0) {
                            _this.storage.setPaymentWarningSeen();
                        }
                        showPaymentSaftey = true;
                    }
                }
            ]
        });
        alertC.present();
        alertC.onDidDismiss(function (data) {
            if (showPaymentSaftey) {
                _this.navCtrl.push('PaymentDetailsPage');
            }
        });
    };
    InfoPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-info',
            templateUrl: 'info.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            LocalDataProvider,
            ErrorHandlerProvider,
            ObjectInitProvider,
            AccommodationsProvider,
            UserSvcProvider,
            ToastSvcProvider,
            AlertController,
            LoadingController])
    ], InfoPage);
    return InfoPage;
}());
export { InfoPage };
//# sourceMappingURL=info.js.map