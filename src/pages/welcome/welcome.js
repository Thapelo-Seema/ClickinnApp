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
import { IonicPage, NavController, ModalController, ToastController, Platform, AlertController } from 'ionic-angular';
import { MapsProvider } from '../../providers/maps/maps';
import { AngularFirestore } from 'angularfire2/firestore';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
//import { PrefferencesPage } from '../prefferences/prefferences';
//import { AlertPage } from '../alert/alert';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
var WelcomePage = /** @class */ (function () {
    function WelcomePage(navCtrl, storage, map_svc, alert, afs, errHandler, object_init, toastCtrl, platform, alertCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.storage = storage;
        this.map_svc = map_svc;
        this.alert = alert;
        this.afs = afs;
        this.errHandler = errHandler;
        this.object_init = object_init;
        this.toastCtrl = toastCtrl;
        this.platform = platform;
        this.alertCtrl = alertCtrl;
        //statusMessage: string = '';
        this.predictions = [];
        this.loading = false;
        this.predictionLoading = false;
        this.platform.ready().then(function (value) {
            _this.loading = true;
            _this.user = _this.object_init.initializeUser();
            _this.pointOfInterest = _this.object_init.initializeAddress();
            _this.pointOfInterest.description = '';
            _this.storage.getUser().then(function (data) {
                _this.afs.collection('Users').doc(data.uid).valueChanges().subscribe(function (user) {
                    _this.user = user;
                    _this.loading = false;
                }, function (err) {
                    _this.errHandler.handleError(err);
                    _this.loading = false;
                });
            })
                .catch(function () {
                _this.errHandler.handleError({ message: "Could not find user" });
                _this.loading = false;
            });
        });
    }
    /*Navigating to the next page, which is the PrefferencesPage and passing the pointOfInterest object along*/
    WelcomePage.prototype.nextPage = function () {
        var _this = this;
        if (this.pointOfInterest.lat == 0 && this.pointOfInterest.lng == 0) {
            this.showWarnig('Enter area or institution!', 'Please enter the name of your institution or the area (city) where you want us to search for your accommodation.');
            return;
        }
        this.storage.setPOI(this.pointOfInterest).then(function (data) {
            _this.navCtrl.push('PrefferencesPage');
        })
            .catch(function (err) {
            _this.errHandler.handleError(err);
            _this.loading = false;
        });
    };
    /*Getting autocomplete predictions from the google maps place predictions service*/
    WelcomePage.prototype.getPredictions = function (event) {
        var _this = this;
        this.predictionLoading = true;
        if (window.navigator.onLine) {
            if (event.key === "Backspace" || event.code === "Backspace") {
                setTimeout(function () {
                    _this.map_svc.getPlacePredictionsSA(event.target.value).then(function (data) {
                        _this.predictions = [];
                        _this.predictions = data;
                        _this.predictionLoading = false;
                    })
                        .catch(function (err) {
                        if (!window.navigator.onLine) {
                            _this.errHandler.handleError({ code: 'no connection', message: 'You do not have an internect connection...' });
                        }
                        else {
                            _this.errHandler.handleError(err);
                        }
                        _this.predictionLoading = false;
                    });
                }, 3000);
            }
            else {
                this.map_svc.getPlacePredictionsSA(event.target.value).then(function (data) {
                    if (data == null || data == undefined || data.length <= 0) {
                        _this.predictionLoading = false;
                    }
                    _this.predictions = [];
                    _this.predictions = data;
                    _this.predictionLoading = false;
                })
                    .catch(function (err) {
                    _this.errHandler.handleError(err);
                    _this.predictionLoading = false;
                });
            }
        }
        else {
            this.showToast('You are not connected to the internet...');
        }
    };
    WelcomePage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000
        });
        toast.present();
    };
    WelcomePage.prototype.cancelSearch = function () {
        this.predictions = [];
        this.loading = false;
    };
    WelcomePage.prototype.selectPlace = function (place) {
        var _this = this;
        this.loading = true;
        this.map_svc.getSelectedPlace(place).then(function (data) {
            _this.pointOfInterest = data;
            _this.predictions = [];
            _this.loading = false;
        })
            .catch(function (err) {
            _this.errHandler.handleError(err);
            _this.loading = false;
        });
    };
    WelcomePage.prototype.showWarnig = function (title, message) {
        var alert = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: ['OK']
        });
        alert.present();
    };
    WelcomePage.prototype.returnFirst = function (input) {
        if (input == undefined)
            return '';
        return input.split(" ")[0];
    };
    WelcomePage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-welcome',
            templateUrl: 'welcome.html',
        }),
        __metadata("design:paramtypes", [NavController,
            LocalDataProvider,
            MapsProvider,
            ModalController,
            AngularFirestore,
            ErrorHandlerProvider,
            ObjectInitProvider,
            ToastController,
            Platform,
            AlertController])
    ], WelcomePage);
    return WelcomePage;
}());
export { WelcomePage };
//# sourceMappingURL=welcome.js.map