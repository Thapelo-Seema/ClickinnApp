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
import { IonicPage, NavController, NavParams, ModalController, ToastController, Platform, AlertController, LoadingController } from 'ionic-angular';
import { MapsProvider } from '../../providers/maps/maps';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { AngularFirestore } from 'angularfire2/firestore';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { UserSvcProvider } from '../../providers/user-svc/user-svc';
/**
 * Generated class for the LandlordRegistrationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var LandlordRegistrationPage = /** @class */ (function () {
    function LandlordRegistrationPage(navCtrl, navParams, storage, map_svc, alert, afs, errHandler, object_init, toastCtrl, platform, alertCtrl, user_svc, loadingCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.map_svc = map_svc;
        this.alert = alert;
        this.afs = afs;
        this.errHandler = errHandler;
        this.object_init = object_init;
        this.toastCtrl = toastCtrl;
        this.platform = platform;
        this.alertCtrl = alertCtrl;
        this.user_svc = user_svc;
        this.loadingCtrl = loadingCtrl;
        this.predictions = [];
        this.loader = this.loadingCtrl.create();
        this.predictionLoading = false;
        this.connectionError = false;
        this.online = false;
        this.areas = [];
        this.loader.present();
        this.user = this.object_init.initializeUser();
        this.storage.getUser()
            .then(function (data) {
            console.log(data);
            _this.user = _this.object_init.initializeUser2(data);
            console.log('Landlord: ', _this.user);
            _this.loader.dismiss();
        });
    }
    LandlordRegistrationPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad LandlordRegistrationPage');
    };
    /*Getting autocomplete predictions from the google maps place predictions service*/
    LandlordRegistrationPage.prototype.getPredictions = function (event) {
        var _this = this;
        this.predictionLoading = true;
        //If there is an internet connection try to make requests
        if (window.navigator.onLine) {
            this.online = true;
            if (event.key === "Backspace" || event.code === "Backspace") {
                setTimeout(function () {
                    _this.map_svc.getPlacePredictionsSA(event.target.value).then(function (data) {
                        _this.handleSuccess(data);
                    })
                        .catch(function (err) {
                        console.log('Error 1');
                        _this.handleNetworkError();
                    });
                }, 3000);
            }
            else { // When location is being typed
                this.map_svc.getPlacePredictionsSA(event.target.value).then(function (data) {
                    if (data == null || data == undefined) {
                        console.log('Error 2');
                        _this.handleNetworkError();
                    }
                    else {
                        _this.handleSuccess(data);
                    }
                })
                    .catch(function (err) {
                    console.log('Error 3');
                    _this.handleNetworkError();
                });
            }
        }
        else { //If there's no connection set online status to false, show message and stop spinner
            this.online = false;
            this.predictionLoading = false;
            this.showToast('You are not connected to the internet...');
        }
    };
    LandlordRegistrationPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 9000
        });
        toast.present();
    };
    LandlordRegistrationPage.prototype.cancelSearch = function () {
        this.predictions = [];
        this.predictionLoading = false;
    };
    LandlordRegistrationPage.prototype.selectPlace = function (place) {
        var _this = this;
        this.predictionLoading = true;
        this.map_svc.getSelectedPlace(place).then(function (data) {
            _this.user.locations.push(data);
            _this.predictions = [];
            _this.predictionLoading = false;
        })
            .catch(function (err) {
            _this.errHandler.handleError(err);
            _this.predictionLoading = false;
        });
    };
    LandlordRegistrationPage.prototype.handleSuccess = function (data) {
        this.connectionError = false;
        this.predictions = [];
        this.predictions = data;
        this.predictionLoading = false;
    };
    LandlordRegistrationPage.prototype.handleNetworkError = function () {
        if (this.connectionError == false)
            this.errHandler.handleError({ message: 'You are offline...check your internet connection' });
        this.predictionLoading = false;
        this.connectionError = true;
    };
    LandlordRegistrationPage.prototype.showWarnig = function (title, message) {
        var alert = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: ['OK']
        });
        alert.present();
    };
    LandlordRegistrationPage.prototype.returnFirst = function (input) {
        if (input == undefined)
            return '';
        return input.split(',')[0] + ', ' + input.split(',')[1];
    };
    LandlordRegistrationPage.prototype.deleteNearby = function (index) {
        var _this = this;
        var confirm = false;
        var alert = this.alertCtrl.create({
            title: "CONFIRM DELETE",
            message: 'Are you sure you want to delete this area ?',
            buttons: [
                {
                    text: 'Delete',
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
            if (index >= 0 && confirm == true) {
                _this.user.locations.splice(index, 1);
            }
        });
    };
    LandlordRegistrationPage.prototype.save = function () {
        var _this = this;
        var ldr = this.loadingCtrl.create();
        ldr.present();
        this.user.user_type = 'landlord';
        this.user_svc.updateUser(this.user)
            .then(function () {
            ldr.dismiss();
            _this.showToast('Landlord profile successfully updated!');
        })
            .catch(function (err) {
            ldr.dismiss();
            _this.errHandler.handleError(err);
        });
    };
    LandlordRegistrationPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-landlord-registration',
            templateUrl: 'landlord-registration.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            LocalDataProvider,
            MapsProvider,
            ModalController,
            AngularFirestore,
            ErrorHandlerProvider,
            ObjectInitProvider,
            ToastController,
            Platform,
            AlertController,
            UserSvcProvider,
            LoadingController])
    ], LandlordRegistrationPage);
    return LandlordRegistrationPage;
}());
export { LandlordRegistrationPage };
//# sourceMappingURL=landlord-registration.js.map