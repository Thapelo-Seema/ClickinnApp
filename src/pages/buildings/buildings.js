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
import { IonicPage, NavController, LoadingController } from 'ionic-angular';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { LocalDataProvider } from '../../providers/local-data/local-data';
//import { Subscription } from 'rxjs-compat/Subscription';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
import { take } from 'rxjs-compat/operators/take';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
/**
 * Generated class for the BuildingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var BuildingsPage = /** @class */ (function () {
    function BuildingsPage(navCtrl, 
    //public navParams: NavParams, 
    accom_svc, storage, toast_svc, object_init, errorHandler, loadingCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.accom_svc = accom_svc;
        this.storage = storage;
        this.toast_svc = toast_svc;
        this.object_init = object_init;
        this.errorHandler = errorHandler;
        this.loadingCtrl = loadingCtrl;
        this.loader = this.loadingCtrl.create();
        this.done = false;
        this.noBuildings = false;
        this.imagesLoaded = [false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false
        ];
        this.loader.present();
        /*
          Initializing the user and getting the users properties into an array
        */
        this.storage.getUser().then(function (user) {
            _this.user = _this.object_init.initializeUser2(user);
            _this.buildings = _this.accom_svc.getUsersProperties(user.uid);
            _this.accom_svc.getUsersProperties(user.uid)
                .pipe(take(1))
                .subscribe(function (props) {
                if (props.length > 0) {
                    props.forEach(function (prop) {
                        _this.imagesLoaded.push(false);
                    });
                    _this.loader.dismiss();
                }
                else {
                    _this.loader.dismiss();
                    _this.noBuildings = true;
                    //this.toast_svc.showToast('You have no properties registered on Clickinn, go ahead and upload properties before using this feature.')
                }
            }, function (err) {
                _this.loader.dismiss();
                _this.toast_svc.showToast('Error loading properties');
            });
        })
            .catch(function (err) {
            _this.loader.dismiss();
            _this.errorHandler.handleError(err);
        });
    }
    BuildingsPage.prototype.ionViewDidLoad = function () {
    };
    BuildingsPage.prototype.ionViewDidLeave = function () {
    };
    BuildingsPage.prototype.gotoUploadApart = function () {
        this.navCtrl.push('UploadAndEarnPage');
    };
    /*
      This method caches (on local storage) the property object passed to it and navigates to the EditPropertyPage
    */
    BuildingsPage.prototype.gotoProperty = function (prop) {
        var _this = this;
        this.storage.setProperty(prop).then(function (prp) {
            _this.navCtrl.push('EditPropertyPage');
        })
            .catch(function (err) {
            _this.errorHandler.handleError(err);
        });
    };
    BuildingsPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-buildings',
            templateUrl: 'buildings.html',
        }),
        __metadata("design:paramtypes", [NavController,
            AccommodationsProvider,
            LocalDataProvider,
            ToastSvcProvider,
            ObjectInitProvider,
            ErrorHandlerProvider,
            LoadingController])
    ], BuildingsPage);
    return BuildingsPage;
}());
export { BuildingsPage };
//# sourceMappingURL=buildings.js.map