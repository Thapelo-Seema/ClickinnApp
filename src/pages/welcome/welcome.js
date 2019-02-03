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
import { IonicPage, NavController, ModalController, ToastController, Platform, AlertController, LoadingController } from 'ionic-angular';
import { MapsProvider } from '../../providers/maps/maps';
import { AngularFirestore } from 'angularfire2/firestore';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
//import { Subscription } from 'rxjs-compat/Subscription';
import { UserSvcProvider } from '../../providers/user-svc/user-svc';
var WelcomePage = /** @class */ (function () {
    function WelcomePage(navCtrl, storage, map_svc, alert, afs, errHandler, object_init, toastCtrl, platform, alertCtrl, loadingCtrl, user_svc) {
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
        this.loadingCtrl = loadingCtrl;
        this.user_svc = user_svc;
        //statusMessage: string = '';
        this.predictions = [];
        this.search = false;
        //userSubs: Subscription;
        this.predictionLoading = false;
        this.connectionError = false;
        this.online = false;
        this.platform.ready().then(function (value) {
            var ldng = _this.loadingCtrl.create();
            ldng.present();
            _this.user = _this.object_init.initializeUser(); //Initialize user object with default values
            _this.pointOfInterest = _this.object_init.initializeAddress(); //Initialize the point of interest with default values
            _this.pointOfInterest.description = ''; //Initialize the description of the the POI with an empty string (for some strange reason)
            _this.storage.getUser().then(function (data) {
                //Subscribing to the most recent user object in the database
                _this.user = _this.object_init.initializeUser2(data);
                ldng.dismiss();
                console.log('User in Welcome: ', _this.user);
                console.log('User in storage: ', data);
            })
                .catch(function () {
                //If there's an error getting the user from the local storage display the message below and stop the spinner
                _this.errHandler.handleError({ message: "Could not find local user", code: 101 });
                ldng.dismiss();
            });
        });
    }
    //Unsubscribe from all subscriptions before leaving the page
    WelcomePage.prototype.ionViewWilLeave = function () {
    };
    //Navigating to the chats page
    WelcomePage.prototype.gotoChats = function () {
        this.navCtrl.push('ChatsPage');
    };
    /*Navigating to the next page, which is the PrefferencesPage and passing the pointOfInterest object along*/
    WelcomePage.prototype.nextPage = function () {
        var _this = this;
        //If the POI is not set by a google maps response throw an error otherwise cache the POI and navigate to the next page
        if (this.pointOfInterest.lat == 0 && this.pointOfInterest.lng == 0) {
            this.showWarnig('Enter Place Or Institution!', 'Please enter the name of your institution or the place (city / town / township) where you want us to search for your accommodation.');
            return;
        }
        this.storage.setPOI(this.pointOfInterest).then(function (data) {
            _this.navCtrl.push('PrefferencesPage');
        })
            .catch(function (err) {
            _this.errHandler.handleError({ message: 'Could not set POI', code: 102 });
        });
    };
    /*Getting autocomplete predictions from the google maps place predictions service*/
    WelcomePage.prototype.getPredictions = function (event) {
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
        setTimeout(function () {
            if (_this.pointOfInterest.lat == 0 && _this.pointOfInterest.lng == 0 && _this.predictions == [] && _this.pointOfInterest.description == '') {
                console.log('poi: ', _this.pointOfInterest);
                console.log('predictions: ', _this.predictions);
                _this.handleNetworkError();
            }
        }, 10000);
    };
    WelcomePage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 9000
        });
        toast.present();
    };
    WelcomePage.prototype.cancelSearch = function () {
        this.predictions = [];
        this.predictionLoading = false;
    };
    WelcomePage.prototype.selectPlace = function (place) {
        var _this = this;
        this.predictionLoading = true;
        this.map_svc.getSelectedPlace(place).then(function (data) {
            _this.pointOfInterest = data;
            _this.predictions = [];
            _this.predictionLoading = false;
        })
            .catch(function (err) {
            _this.errHandler.handleError(err);
            _this.predictionLoading = false;
        });
    };
    WelcomePage.prototype.gotoOwners = function () {
        var _this = this;
        this.storage.getFirstTime()
            .then(function (val) {
            if (val == true) {
                _this.user.user_type = 'landlord';
                _this.storage.setUser(_this.user)
                    .then(function (dat) {
                    console.log('User before update: ', _this.user);
                    _this.navCtrl.push('OwnersDashboardPage');
                });
            }
            else {
                _this.user.user_type = 'landlord';
                _this.storage.setUser(_this.user)
                    .then(function (dat) {
                    console.log('User before update: ', _this.user);
                    _this.navCtrl.push('OwnersDashboardPage');
                });
            }
        })
            .catch(function (err) {
            console.log('User before update: ', _this.user);
            _this.navCtrl.push('OwnersDashboardPage');
        });
    };
    WelcomePage.prototype.gotoLandlordDash = function () {
        var _this = this;
        this.storage.getFirstTime()
            .then(function (dat) {
            if (dat == true) {
                _this.user.user_type = 'agent';
                _this.storage.setUser(_this.user)
                    .then(function (val) {
                    _this.navCtrl.push('LandlordDashboardPage');
                });
            }
            else {
                _this.user.user_type = 'agent';
                _this.storage.setUser(_this.user)
                    .then(function (val) {
                    _this.navCtrl.push('LandlordDashboardPage');
                });
            }
        })
            .catch(function (err) {
            _this.user.user_type = 'agent';
            _this.storage.setUser(_this.user)
                .then(function (val) {
                _this.navCtrl.push('LandlordDashboardPage');
            });
        });
    };
    WelcomePage.prototype.showSearch = function () {
        this.search = true;
    };
    WelcomePage.prototype.showOptions = function () {
        this.search = false;
    };
    WelcomePage.prototype.handleSuccess = function (data) {
        this.connectionError = false;
        this.predictions = [];
        this.predictions = data;
        this.predictionLoading = false;
    };
    WelcomePage.prototype.handleNetworkError = function () {
        if (this.connectionError == false)
            this.errHandler.handleError({ message: 'You are offline...check your internet connection' });
        this.predictionLoading = false;
        this.connectionError = true;
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
            AlertController,
            LoadingController,
            UserSvcProvider])
    ], WelcomePage);
    return WelcomePage;
}());
export { WelcomePage };
//# sourceMappingURL=welcome.js.map