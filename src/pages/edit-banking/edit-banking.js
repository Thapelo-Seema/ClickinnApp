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
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { Camera } from '@ionic-native/camera';
import { AngularFireStorage } from 'angularfire2/storage';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { take } from 'rxjs-compat/operators/take';
import { UserSvcProvider } from '../../providers/user-svc/user-svc';
/**
 * Generated class for the EditBankingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var EditBankingPage = /** @class */ (function () {
    function EditBankingPage(navCtrl, navParams, storage, toast, afs, errHandler, camera, afstorage, object_init, user_svc, alertCtrl, loadingCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.toast = toast;
        this.afs = afs;
        this.errHandler = errHandler;
        this.camera = camera;
        this.afstorage = afstorage;
        this.object_init = object_init;
        this.user_svc = user_svc;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.loader = this.loadingCtrl.create();
        this.loader.present();
        this.user = this.object_init.initializeUser();
        this.storage.getUser().then(function (data) {
            _this.user_svc.getUser(data.uid)
                .pipe(take(1))
                .subscribe(function (user) {
                _this.user = _this.object_init.initializeUser2(user);
                _this.loader.dismiss();
            });
        }).catch(function (err) {
            _this.errHandler.handleError(err);
            _this.loader.dismiss();
        });
    }
    EditBankingPage.prototype.ionViewWillLoad = function () {
    };
    EditBankingPage.prototype.save = function () {
        var _this = this;
        var confirm = false;
        var alert = this.alertCtrl.create({
            title: "Confirm changes",
            message: "Are you sure you want to save the changes to your profile ?",
            buttons: [
                {
                    text: 'Confirm',
                    handler: function (data) {
                        confirm = true;
                    }
                },
                {
                    role: 'cancel',
                    text: 'Cancel',
                    handler: function (data) {
                        confirm = false;
                    }
                }
            ]
        });
        alert.present();
        alert.onDidDismiss(function (data) {
            if (confirm) {
                _this.persistChanges();
            }
        });
    };
    EditBankingPage.prototype.persistChanges = function () {
        var _this = this;
        var ldr = this.loadingCtrl.create();
        ldr.present();
        this.storage.setUser(this.user)
            .then(function () {
            _this.afs.collection('Users').doc(_this.user.uid).update(_this.user).then(function () {
                ldr.dismiss();
                _this.toast.create({
                    message: "Profile successfully updated",
                    showCloseButton: true,
                    closeButtonText: 'Ok',
                    position: 'middle',
                    cssClass: 'toast_margins full_width'
                }).present().then(function () {
                });
            }).catch(function (err) {
                _this.errHandler.handleError(err);
                ldr.dismiss();
            });
        })
            .catch(function (err) {
            ldr.dismiss();
            _this.errHandler.handleError(err);
        });
    };
    EditBankingPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-edit-banking',
            templateUrl: 'edit-banking.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            LocalDataProvider,
            ToastController,
            AngularFirestore,
            ErrorHandlerProvider,
            Camera,
            AngularFireStorage,
            ObjectInitProvider,
            UserSvcProvider,
            AlertController,
            LoadingController])
    ], EditBankingPage);
    return EditBankingPage;
}());
export { EditBankingPage };
//# sourceMappingURL=edit-banking.js.map