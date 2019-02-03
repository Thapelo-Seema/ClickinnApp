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
import { IonicPage, NavController } from 'ionic-angular';
import { AppointmentsProvider } from '../../providers/appointments/appointments';
var LandlordDashboardPage = /** @class */ (function () {
    function LandlordDashboardPage(navCtrl, 
    //public navParams: NavParams, 
    //private app: App,
    appt_svc) {
        this.navCtrl = navCtrl;
        this.appt_svc = appt_svc;
        this.tab1Root = 'SearchfeedPage';
        this.tab2Root = 'ManageBuildingsPage';
        this.tab3Root = 'BookingsPage';
        this.tab4Root = 'ChatsPage';
    }
    LandlordDashboardPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad LandlordDashboardPage');
    };
    LandlordDashboardPage.prototype.gotoHome = function () {
        this.appt_svc.reset();
        this.navCtrl.setRoot('WelcomePage');
    };
    LandlordDashboardPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-landlord-dashboard',
            templateUrl: 'landlord-dashboard.html',
        }),
        __metadata("design:paramtypes", [NavController,
            AppointmentsProvider])
    ], LandlordDashboardPage);
    return LandlordDashboardPage;
}());
export { LandlordDashboardPage };
//# sourceMappingURL=landlord-dashboard.js.map