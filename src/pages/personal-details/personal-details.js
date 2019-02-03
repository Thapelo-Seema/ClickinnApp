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
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { AngularFirestore } from 'angularfire2/firestore';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
/**
 * Generated class for the PersonalDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var PersonalDetailsPage = /** @class */ (function () {
    function PersonalDetailsPage(navCtrl, storage, afs, errHandler, object_init, loadingCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.storage = storage;
        this.afs = afs;
        this.errHandler = errHandler;
        this.object_init = object_init;
        this.loadingCtrl = loadingCtrl;
        this.image = "assets/imgs/placeholder.png";
        this.loader = this.loadingCtrl.create();
        this.imageLoaded = false;
        this.loader.present();
        this.user = this.object_init.initializeUser();
        this.storage.getUser().then(function (data) {
            _this.afs.collection('Users').doc(data.uid).valueChanges().subscribe(function (user) {
                _this.user = user;
                if (_this.user.photoURL !== '')
                    _this.image = _this.user.photoURL;
                else
                    console.log(_this.user.photoURL);
                _this.loader.dismiss();
            }, function (err) {
                _this.errHandler.handleError(err);
                _this.loader.dismiss();
            });
        })
            .catch(function (err) {
            _this.errHandler.handleError(err);
            _this.loader.dismiss();
        });
    }
    PersonalDetailsPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad PersonalDetailsPage');
    };
    PersonalDetailsPage.prototype.gotoEdit = function () {
        this.navCtrl.push('EditProfilePage');
    };
    PersonalDetailsPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-personal-details',
            templateUrl: 'personal-details.html',
        }),
        __metadata("design:paramtypes", [NavController,
            LocalDataProvider,
            AngularFirestore,
            ErrorHandlerProvider,
            ObjectInitProvider,
            LoadingController])
    ], PersonalDetailsPage);
    return PersonalDetailsPage;
}());
export { PersonalDetailsPage };
//# sourceMappingURL=personal-details.js.map