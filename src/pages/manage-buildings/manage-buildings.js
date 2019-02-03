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
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//import { ObjectInitProvider } from '../../providers/object-init/object-init';
//import { UploadAndEarnPage } from '../upload-and-earn/upload-and-earn';
/**
 * Generated class for the ManageBuildingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ManageBuildingsPage = /** @class */ (function () {
    function ManageBuildingsPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
    }
    ManageBuildingsPage.prototype.ionViewDidLoad = function () {
    };
    ManageBuildingsPage.prototype.uploadAndEarn = function () {
        this.navCtrl.push('UploadAndEarnPage');
    };
    ManageBuildingsPage.prototype.gotoBuildings = function () {
        this.navCtrl.push('BuildingsPage');
    };
    ManageBuildingsPage.prototype.gotoAparts = function () {
        this.navCtrl.push('SavedApartmentsPage');
    };
    ManageBuildingsPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-manage-buildings',
            templateUrl: 'manage-buildings.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams])
    ], ManageBuildingsPage);
    return ManageBuildingsPage;
}());
export { ManageBuildingsPage };
//# sourceMappingURL=manage-buildings.js.map