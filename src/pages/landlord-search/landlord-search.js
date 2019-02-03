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
import { SearchfeedProvider } from '../../providers/searchfeed/searchfeed';
import { take } from 'rxjs-compat/operators/take';
/**
 * Generated class for the LandlordSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var LandlordSearchPage = /** @class */ (function () {
    function LandlordSearchPage(navCtrl, navParams, storage, map_svc, alert, afs, errHandler, object_init, toastCtrl, platform, alertCtrl, user_svc, searchfeed_svc, loadingCtrl) {
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
        this.searchfeed_svc = searchfeed_svc;
        this.loadingCtrl = loadingCtrl;
        this.predictions = [];
        this.loader = this.loadingCtrl.create();
        this.predictionLoading = false;
        this.connectionError = false;
        this.online = false;
        this.areas = [];
        this.imagesLoaded = [false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false
        ];
        this.loader.present();
        this.landlords = this.searchfeed_svc.getAllLandLords();
        this.searchfeed_svc.getAllLandLords()
            .pipe(take(1))
            .subscribe(function (data) {
            _this.loader.dismiss();
            if (data.length > 0) {
                data.forEach(function (dat) {
                    _this.imagesLoaded.push(false);
                });
            }
            else {
                _this.showToast('No landlords to show');
            }
        });
        this.storage.getUser().then(function (data) {
            _this.user = _this.object_init.initializeUser2(data);
        });
    }
    LandlordSearchPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad LandlordSearchPage');
    };
    /*Getting autocomplete predictions from the google maps place predictions service*/
    LandlordSearchPage.prototype.getPredictions = function (event) {
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
    LandlordSearchPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 9000
        });
        toast.present();
    };
    LandlordSearchPage.prototype.cancelSearch = function () {
        this.predictions = [];
        this.predictionLoading = false;
    };
    LandlordSearchPage.prototype.selectPlace = function (place) {
        var _this = this;
        this.predictionLoading = true;
        this.map_svc.getSelectedPlace(place).then(function (data) {
            _this.landlords = null;
            _this.landlords = _this.searchfeed_svc.getLandLordsByLocation(data);
            _this.searchfeed_svc.getLandLordsByLocation(data)
                .pipe(take(1))
                .subscribe(function (dat) {
                _this.predictionLoading = false;
                if (dat.length > 0) {
                }
                else {
                    _this.showToast('No landlords to show');
                }
            });
            _this.predictions = [];
            _this.predictionLoading = false;
        })
            .catch(function (err) {
            _this.errHandler.handleError(err);
            _this.predictionLoading = false;
        });
    };
    LandlordSearchPage.prototype.handleSuccess = function (data) {
        this.connectionError = false;
        this.predictions = [];
        this.predictions = data;
        this.predictionLoading = false;
    };
    LandlordSearchPage.prototype.handleNetworkError = function () {
        if (this.connectionError == false)
            this.errHandler.handleError({ message: 'You are offline...check your internet connection' });
        this.predictionLoading = false;
        this.connectionError = true;
    };
    LandlordSearchPage.prototype.showWarnig = function (title, message) {
        var alert = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: ['OK']
        });
        alert.present();
    };
    LandlordSearchPage.prototype.returnFirst = function (input) {
        if (input == undefined)
            return '';
        return input.split(',')[0] + ', ' + input.split(',')[1];
    };
    LandlordSearchPage.prototype.deleteNearby = function (index) {
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
    LandlordSearchPage.prototype.save = function () {
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
    LandlordSearchPage.prototype.propose = function (landlord) {
        var _this = this;
        var ldr = this.loadingCtrl.create();
        ldr.present();
        var deal = {
            landlord_firstname: landlord.firstname,
            landlord_lastname: landlord.lastname,
            landlord_uid: landlord.uid,
            landlord_dp: landlord.photoURL,
            landlord_phoneNumber: landlord.phoneNumber,
            agent_firstname: this.user.firstname,
            agent_lastname: this.user.lastname,
            agent_uid: this.user.uid,
            agent_dp: this.user.photoURL,
            agent_phoneNumber: this.user.phoneNumber,
            landlord_agreed: false,
            landlord_disagree: false,
            agent_cancelled: false,
            timeStamp: Date.now(),
            id: ''
        };
        this.searchfeed_svc.proposeAgentService(deal)
            .then(function () {
            ldr.dismiss()
                .then(function () {
                _this.showToast('Proposal sent, please wait for the landlords response');
            });
        })
            .catch(function (err) {
            ldr.dismiss()
                .then(function () {
                _this.errHandler.handleError(err);
            });
        });
    };
    LandlordSearchPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-landlord-search',
            templateUrl: 'landlord-search.html',
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
            SearchfeedProvider,
            LoadingController])
    ], LandlordSearchPage);
    return LandlordSearchPage;
}());
export { LandlordSearchPage };
//# sourceMappingURL=landlord-search.js.map