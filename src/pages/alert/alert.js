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
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
var AlertPage = /** @class */ (function () {
    function AlertPage(navParams, viewCtrl) {
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.warning = {
            title: 'string',
            message: 'string'
        };
    }
    AlertPage.prototype.ionViewWillLoad = function () {
        this.warning = this.navParams.get('data');
    };
    AlertPage.prototype.close = function () {
        this.viewCtrl.dismiss();
    };
    AlertPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-alert',
            templateUrl: 'alert.html',
        }),
        __metadata("design:paramtypes", [NavParams, ViewController])
    ], AlertPage);
    return AlertPage;
}());
export { AlertPage };
//# sourceMappingURL=alert.js.map