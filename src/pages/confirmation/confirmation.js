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
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
//import { ObjectInitProvider } from '../../providers/object-init/object-init';
var ConfirmationPage = /** @class */ (function () {
    function ConfirmationPage(navCtrl, navParams, viewCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.confirmation = {
            title: 'string',
            message: 'string'
        };
    }
    ConfirmationPage.prototype.ionViewWillLoad = function () {
        this.confirmation = this.navParams.get('data');
    };
    ConfirmationPage.prototype.close = function () {
        this.viewCtrl.dismiss(false);
    };
    ConfirmationPage.prototype.confirm = function () {
        this.viewCtrl.dismiss(true);
    };
    ConfirmationPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-confirmation',
            templateUrl: 'confirmation.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, ViewController])
    ], ConfirmationPage);
    return ConfirmationPage;
}());
export { ConfirmationPage };
//# sourceMappingURL=confirmation.js.map