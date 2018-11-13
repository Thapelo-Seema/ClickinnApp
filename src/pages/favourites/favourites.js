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
//import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
//import { AccommodationsComponent } from '../../components/accommodations/accommodations';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import { LocalDataProvider } from '../../providers/local-data/local-data';
/**
 * Generated class for the FavouritesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var FavouritesPage = /** @class */ (function () {
    function FavouritesPage(navCtrl, navParams, accom_svc, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.accom_svc = accom_svc;
        this.storage = storage;
        this.apartments = [];
        this.loading = true;
        this.apartmentSub = null;
        this.imagesLoaded = [false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false
        ];
        this.storage.getUser().then(function (data) {
            _this.apartmentSub = _this.accom_svc.getUserFavourites(data.liked_apartments)
                .subscribe(function (aparts) {
                _this.apartments = aparts;
                _this.loading = false;
            });
        });
    }
    FavouritesPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad FavouritesPage');
    };
    FavouritesPage.prototype.ionViewDidLeave = function () {
        if (this.apartmentSub)
            this.apartmentSub.unsubscribe();
    };
    FavouritesPage.prototype.gotoApartment = function (apartment) {
        var _this = this;
        this.storage.setApartment(apartment).then(function (data) { return _this.navCtrl.push('ApartmentDetailsPage'); })
            .catch(function (err) {
            console.log(err);
        });
    };
    FavouritesPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-favourites',
            templateUrl: 'favourites.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            AccommodationsProvider,
            LocalDataProvider])
    ], FavouritesPage);
    return FavouritesPage;
}());
export { FavouritesPage };
//# sourceMappingURL=favourites.js.map