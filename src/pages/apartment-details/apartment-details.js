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
import { IonicPage, NavController, App } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { UserSvcProvider } from '../../providers/user-svc/user-svc';
//import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
import { take } from 'rxjs-compat/operators/take';
var ApartmentDetailsPage = /** @class */ (function () {
    function ApartmentDetailsPage(navCtrl, app, local_data, obj_init, user_svc) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.app = app;
        this.local_data = local_data;
        this.obj_init = obj_init;
        this.user_svc = user_svc;
        this.tab1Root = 'InfoPage';
        this.tab2Root = 'AppointmentPage';
        this.tab3Root = 'SecurePage';
        this.currentApartment = this.obj_init.initializeApartment();
        this.user = this.obj_init.initializeUser();
        this.local_data.getApartment().then(function (data) {
            _this.currentApartment = data;
        });
        this.local_data.getUser().then(function (data) {
            _this.user_svc.getUser(data.uid)
                .pipe(take(1))
                .subscribe(function (user) {
                if (user) {
                    _this.user = _this.obj_init.initializeUser2(user);
                    console.log('User: ', _this.user);
                }
            });
        });
    }
    ApartmentDetailsPage.prototype.gotoHome = function () {
        this.app.getRootNav().setRoot('WelcomePage');
    };
    ApartmentDetailsPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-apartment-details',
            templateUrl: 'apartment-details.html',
        }),
        __metadata("design:paramtypes", [NavController, App, LocalDataProvider,
            ObjectInitProvider, UserSvcProvider])
    ], ApartmentDetailsPage);
    return ApartmentDetailsPage;
}());
export { ApartmentDetailsPage };
//# sourceMappingURL=apartment-details.js.map