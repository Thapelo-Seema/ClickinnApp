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
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
/**
 * Generated class for the BuildingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var BuildingsPage = /** @class */ (function () {
    function BuildingsPage(navCtrl, navParams, accom_svc, local_db, toast_svc) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.accom_svc = accom_svc;
        this.local_db = local_db;
        this.toast_svc = toast_svc;
        this.buildings = [];
        this.loading = true;
        this.buildingSub = null;
        this.imagesLoaded = [false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false
        ];
        this.local_db.getUser().then(function (user) {
            _this.buildingSub = _this.accom_svc.getUsersProperties(user.uid)
                .subscribe(function (props) {
                if (props.length > 0) {
                    _this.buildings = props;
                    props.forEach(function (prop) {
                        _this.imagesLoaded.push(false);
                    });
                    _this.loading = false;
                }
                else {
                    _this.loading = false;
                    _this.toast_svc.showToast('You have no properties registered on Clickinn, go ahead and upload properties before using this feature.');
                }
            });
        });
    }
    BuildingsPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad BuildingsPage');
    };
    BuildingsPage.prototype.ionViewDidLeave = function () {
        if (this.buildingSub)
            this.buildingSub.unsubscribe();
    };
    BuildingsPage.prototype.gotoProperty = function (prop) {
        var _this = this;
        this.local_db.setProperty(prop).then(function (prp) {
            _this.navCtrl.push('EditPropertyPage');
        })
            .catch(function (err) {
            console.log(err);
        });
    };
    BuildingsPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-buildings',
            templateUrl: 'buildings.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            AccommodationsProvider,
            LocalDataProvider,
            ToastSvcProvider])
    ], BuildingsPage);
    return BuildingsPage;
}());
export { BuildingsPage };
//# sourceMappingURL=buildings.js.map