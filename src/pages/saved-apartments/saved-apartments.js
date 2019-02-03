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
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
import { take } from 'rxjs-compat/operators/take';
/**
 * Generated class for the SavedApartmentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var SavedApartmentsPage = /** @class */ (function () {
    function SavedApartmentsPage(navCtrl, navParams, accom_svc, local_db, toast_svc, loadingCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.accom_svc = accom_svc;
        this.local_db = local_db;
        this.toast_svc = toast_svc;
        this.loadingCtrl = loadingCtrl;
        this.loader = this.loadingCtrl.create();
        this.imagesLoaded = [false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false
        ];
        this.loader.present();
        this.local_db.getUser()
            .then(function (user) {
            _this.user = user;
            _this.apartments = _this.accom_svc.getUserApartments(user.uid);
            _this.accom_svc.getUserApartments(user.uid)
                .pipe(take(1))
                .subscribe(function (aparts) {
                if (aparts.length > 0) {
                    aparts.forEach(function (apart) {
                        _this.imagesLoaded.push(false);
                    });
                    _this.loader.dismiss();
                }
                else {
                    _this.loader.dismiss();
                    _this.toast_svc.showToast('You have not apartments linked to this profile, go ahead and upload some...');
                }
            });
        });
    }
    SavedApartmentsPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad SavedApartmentsPage');
    };
    SavedApartmentsPage.prototype.gotoEditApartment = function (apartment) {
        var _this = this;
        this.local_db.setApartment(apartment).then(function (data) { return _this.navCtrl.push('EditApartmentPage'); })
            .catch(function (err) {
            console.log(err);
        });
    };
    SavedApartmentsPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-saved-apartments',
            templateUrl: 'saved-apartments.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            AccommodationsProvider,
            LocalDataProvider,
            ToastSvcProvider,
            LoadingController])
    ], SavedApartmentsPage);
    return SavedApartmentsPage;
}());
export { SavedApartmentsPage };
//# sourceMappingURL=saved-apartments.js.map