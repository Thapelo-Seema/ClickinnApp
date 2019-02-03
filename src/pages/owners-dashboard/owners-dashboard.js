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
import { AppointmentsProvider } from '../../providers/appointments/appointments';
/**
 * Generated class for the OwnersDashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var OwnersDashboardPage = /** @class */ (function () {
    function OwnersDashboardPage(navCtrl, navParams, appt_svc) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.appt_svc = appt_svc;
        this.tab0Root = 'LandlordRegistrationPage';
        this.tab1Root = 'SearchfeedPage';
        this.tab2Root = 'ManageBuildingsPage';
        this.tab3Root = 'BookingsPage';
        this.tab4Root = 'ChatsPage';
    }
    OwnersDashboardPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad OwnersDashboardPage');
    };
    OwnersDashboardPage.prototype.gotoHome = function () {
        this.appt_svc.reset();
        this.navCtrl.setRoot('WelcomePage');
    };
    OwnersDashboardPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-owners-dashboard',
            templateUrl: 'owners-dashboard.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            AppointmentsProvider])
    ], OwnersDashboardPage);
    return OwnersDashboardPage;
}());
export { OwnersDashboardPage };
//# sourceMappingURL=owners-dashboard.js.map