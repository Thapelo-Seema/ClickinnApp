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
//import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
//import { AccommodationsComponent } from '../../components/accommodations/accommodations';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { take } from 'rxjs-compat/operators/take';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
/**
 * Generated class for the FavouritesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var FavouritesPage = /** @class */ (function () {
    function FavouritesPage(navCtrl, navParams, accom_svc, storage, toast_svc, loadingCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.accom_svc = accom_svc;
        this.storage = storage;
        this.toast_svc = toast_svc;
        this.loadingCtrl = loadingCtrl;
        this.loader = this.loadingCtrl.create();
        this.done = false;
        //apartmentSub: Subscription = null;
        this.noLiked = false;
        //@ViewChild(Content) content: Content;
        this.imagesLoaded = [false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false
        ];
        /*this.accom_svc.loading.subscribe(data =>{
          this.loadingMore = data;
        })
    
        this.accom_svc.done.subscribe(data =>{
          this.done = data;
          if(this.done == true) this.loadingMore = false;
        })*/
        this.loader.present();
        this.storage.getUser().then(function (data) {
            _this.user = data;
            _this.apartments = _this.accom_svc.getUserFavourites(data.liked_apartments);
            _this.accom_svc.getUserFavourites(data.liked_apartments)
                .pipe(take(1))
                .subscribe(function (aparts) {
                if (aparts.length > 0) {
                    aparts.forEach(function (apart) {
                        _this.imagesLoaded.push(false);
                    });
                    _this.loader.dismiss();
                }
                else {
                    //this.toast_svc.showToast('You have not liked any apartments yet...')
                    _this.noLiked = true;
                    _this.loader.dismiss();
                }
            });
        });
    }
    FavouritesPage.prototype.ionViewDidLoad = function () {
        //this.monitorEnd()
    };
    FavouritesPage.prototype.ionViewDidLeave = function () {
    };
    FavouritesPage.prototype.gotoApartment = function (apartment) {
        var _this = this;
        //delete apartment.doc
        this.storage.setApartment(apartment).then(function (data) {
            //this.accom_svc.reset();
            _this.navCtrl.push('ApartmentDetailsPage');
        })
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
            LocalDataProvider,
            ToastSvcProvider,
            LoadingController])
    ], FavouritesPage);
    return FavouritesPage;
}());
export { FavouritesPage };
//# sourceMappingURL=favourites.js.map