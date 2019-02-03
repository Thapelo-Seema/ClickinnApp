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
import { LocalDataProvider } from '../../providers/local-data/local-data';
/**
 * Generated class for the AgentGuidePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var AgentGuidePage = /** @class */ (function () {
    function AgentGuidePage(navCtrl, navParams, storage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
    }
    AgentGuidePage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad AgentGuidePage');
    };
    AgentGuidePage.prototype.gotoWelcome = function () {
        var _this = this;
        this.storage.setNotFirstime()
            .then(function (dat) {
            _this.navCtrl.setRoot('LandlordDashboardPage');
        });
    };
    AgentGuidePage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-agent-guide',
            templateUrl: 'agent-guide.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            LocalDataProvider])
    ], AgentGuidePage);
    return AgentGuidePage;
}());
export { AgentGuidePage };
//# sourceMappingURL=agent-guide.js.map