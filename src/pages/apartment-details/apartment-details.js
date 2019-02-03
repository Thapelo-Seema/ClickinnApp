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
var ApartmentDetailsPage = /** @class */ (function () {
    function ApartmentDetailsPage(navCtrl) {
        this.navCtrl = navCtrl;
        this.tab1Root = 'InfoPage';
        this.tab2Root = 'AppointmentPage';
        this.tab3Root = 'SecurePage';
    }
    /** This is a navigation page to navigate between the Three pages of a users interest in securing a place **/
    /* This function navigates the user to the welcome page */
    ApartmentDetailsPage.prototype.gotoHome = function () {
        this.navCtrl.setRoot('WelcomePage');
    };
    ApartmentDetailsPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-apartment-details',
            templateUrl: 'apartment-details.html',
        }),
        __metadata("design:paramtypes", [NavController])
    ], ApartmentDetailsPage);
    return ApartmentDetailsPage;
}());
export { ApartmentDetailsPage };
//# sourceMappingURL=apartment-details.js.map