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
import { IonicPage, NavController, LoadingController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
/**
 * Generated class for the BankingDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var BankingDetailsPage = /** @class */ (function () {
    function BankingDetailsPage(navCtrl, storage, errHandler, object_init, loadingCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.storage = storage;
        this.errHandler = errHandler;
        this.object_init = object_init;
        this.loadingCtrl = loadingCtrl;
        this.loader = this.loadingCtrl.create();
        this.loader.present();
        this.user = this.object_init.initializeUser();
        this.storage.getUser().then(function (data) {
            _this.user = _this.object_init.initializeUser2(data);
            _this.loader.dismiss();
        })
            .catch(function (err) {
            _this.loader.dismiss();
            _this.errHandler.handleError(err);
        });
    }
    BankingDetailsPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad BankingDetailsPage');
    };
    BankingDetailsPage.prototype.gotoEdit = function () {
        this.navCtrl.push('EditBankingPage');
    };
    BankingDetailsPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-banking-details',
            templateUrl: 'banking-details.html',
        }),
        __metadata("design:paramtypes", [NavController,
            LocalDataProvider,
            ErrorHandlerProvider,
            ObjectInitProvider,
            LoadingController])
    ], BankingDetailsPage);
    return BankingDetailsPage;
}());
export { BankingDetailsPage };
//# sourceMappingURL=banking-details.js.map