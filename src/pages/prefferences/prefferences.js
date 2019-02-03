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
import { IonicPage, NavController, NavParams, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { AngularFirestore } from 'angularfire2/firestore';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
//import { AlertPage } from '../alert/alert';
//import { SeekingPage } from '../seeking/seeking';
//import { AngularFireAuth } from 'angularfire2/auth';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
var PrefferencesPage = /** @class */ (function () {
    function PrefferencesPage(navCtrl, navParams, alert, storage, afs, errHandler, object_init, alertCtrl, loadingCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alert = alert;
        this.storage = storage;
        this.afs = afs;
        this.errHandler = errHandler;
        this.object_init = object_init;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.more = false;
        this.loader = this.loadingCtrl.create();
        this.loader.present();
        this.user = this.object_init.initializeUser();
        this.pointOfInterest = this.object_init.initializeAddress();
        this.search_object = this.object_init.initializeSearch();
        this.storage.getUser()
            .then(function (user) {
            _this.user = _this.object_init.initializeUser2(user);
            _this.storage.getPOI()
                .then(function (data) {
                _this.pointOfInterest = data;
                _this.loader.dismiss();
            })
                .catch(function (err) {
                _this.errHandler.handleError(err);
                _this.loader.dismiss();
            });
        })
            .catch(function (err) {
            _this.errHandler.handleError(err);
            _this.loader.dismiss();
        });
    }
    PrefferencesPage.prototype.gotoSeekPage = function () {
        var _this = this;
        if (this.search_object.maxPrice == 0 || this.search_object.maxPrice == null) {
            this.showWarnig('Price limit not set!', 'The maximum price (rent) must be entered before you can proceed.');
            return;
        }
        this.search_object.searcher_id = this.user.uid;
        if (this.user.firstname != undefined && this.user.firstname != null) {
            this.search_object.searcher_name = this.user.firstname + ' ' + this.user.lastname;
        }
        else if (this.user.displayName != undefined && this.user.displayName != null) {
            this.search_object.searcher_name = this.user.displayName;
        }
        else {
            this.search_object.searcher_name = 'Anonymous';
        }
        this.search_object.searcher_dp = this.user.photoURL;
        this.search_object.Address = this.pointOfInterest;
        this.search_object.maxPrice = Number(this.search_object.maxPrice);
        this.search_object.minPrice = Number(this.search_object.minPrice);
        this.search_object.timeStamp = Date.now();
        this.afs.collection('Searches2').add(this.search_object).then(function (data) {
        })
            .catch(function (err) {
            _this.errHandler.handleError(err);
        });
        this.storage.setSearch(this.search_object).then(function (data) {
            _this.navCtrl.push('SeekingPage', { search: _this.search_object, poi: _this.pointOfInterest });
        })
            .catch(function (err) {
            _this.errHandler.handleError(err);
        });
    };
    PrefferencesPage.prototype.showWarnig = function (title, message) {
        var alert = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: ['OK']
        });
        alert.present();
    };
    PrefferencesPage.prototype.showMore = function () {
        this.more = !this.more;
    };
    PrefferencesPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-prefferences',
            templateUrl: 'prefferences.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            ModalController,
            LocalDataProvider,
            AngularFirestore,
            ErrorHandlerProvider,
            ObjectInitProvider,
            AlertController,
            LoadingController])
    ], PrefferencesPage);
    return PrefferencesPage;
}());
export { PrefferencesPage };
//# sourceMappingURL=prefferences.js.map