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
var EditProfilePage = /** @class */ (function () {
    function EditProfilePage(navCtrl, navParams, storage, toast, afs, errHandler, camera, afstorage, object_init, user_svc, alertCtrl, loadingCtrl) {
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
        this.image = "assets/imgs/placeholder.png";
        this.loader = this.loadingCtrl.create({ dismissOnPageChange: true });
        this.dpChanged = false;
        this.imageLoaded = false;
        this.progress = 0;
        this.loader.present();
        this.user = this.object_init.initializeUser();
        this.recentDp = this.object_init.initializeFileUpload();
        this.storage.getUser().then(function (data) {
            _this.user_svc.getUser(data.uid)
                .pipe(take(1))
                .subscribe(function (user) {
                _this.user = _this.object_init.initializeUser2(user);
                if (user.photoURL !== '' || user.photoURL == undefined)
                    _this.image = user.photoURL;
                _this.loader.dismiss();
            });
        }).catch(function (err) {
            _this.errHandler.handleError(err);
            _this.loader.dismiss();
        });
    }
    EditProfilePage.prototype.ionViewWillLoad = function () {
    };
    EditProfilePage.prototype.save = function () {
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
                if (!_this.dpChanged) {
                    _this.persistChanges();
                }
                else {
                    _this.uploadDp()
                        .then(function (image) {
                        _this.user.photoURL = image.url;
                        _this.persistChanges();
                    })
                        .catch(function (err) {
                        _this.errHandler.handleError({ message: 'Please check your internet connection...picture not uploaded' });
                    });
                }
            }
        });
    };
    //Select or take a picture from the galley
    EditProfilePage.prototype.changeDp = function () {
        var _this = this;
        var options = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: 2,
            allowEdit: true,
            targetWidth: 800,
            targetHeight: 800
        };
        this.camera.getPicture(options).then(function (imageData) {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64:
            _this.image = 'data:image/jpeg;base64,' + imageData;
            _this.recentDp.file = _this.image;
            _this.user.photoURL = _this.image;
            _this.dpChanged = true;
        }).catch(function (err) {
            _this.errHandler.handleError({ errCode: 'IMAGE_NOT_SELECTED', message: 'No image selected' });
        });
    };
    EditProfilePage.prototype.uploadDp = function () {
        var _this = this;
        var storageRef = this.afstorage.ref("UserDisplayImages/" + this.user.uid);
        var uploadTask = storageRef.putString(this.recentDp.file, 'data_url');
        return new Promise(function (resolve, reject) {
            uploadTask.snapshotChanges().subscribe(function (snapshot) {
                //update the progress property of the upload object
                uploadTask.percentageChanges().subscribe(function (progress) {
                    _this.recentDp.progress = progress;
                    _this.progress = progress;
                    console.log('progress... ', _this.recentDp.progress);
                });
            }, function (err) {
                //if there's an error log it in the console
                reject(err.message);
            }, function () {
                var tempUrl = '';
                //on success of the upload, update the url property of the upload object
                storageRef.getDownloadURL().subscribe(function (down_url) {
                    tempUrl = down_url;
                }, function (err) {
                    reject(err.message);
                }, function () {
                    var image = {
                        url: tempUrl,
                        name: _this.recentDp.name,
                        progress: _this.recentDp.progress,
                        path: _this.recentDp.path
                    };
                    _this.user.photoURL = image.url;
                    resolve(image);
                });
            });
        });
    };
    EditProfilePage.prototype.persistChanges = function () {
        var _this = this;
        var ldr = this.loadingCtrl.create();
        ldr.present();
        this.afs.collection('Users').doc(this.user.uid).update(this.user).then(function () {
            _this.toast.create({
                message: "Profile successfully updated",
                showCloseButton: true,
                closeButtonText: 'Ok',
                position: 'middle',
                cssClass: 'toast_margins full_width'
            }).present().then(function () {
                ldr.dismiss();
            });
        }).catch(function (err) {
            _this.errHandler.handleError(err);
            ldr.dismiss();
        });
    };
    EditProfilePage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-edit-profile',
            templateUrl: 'edit-profile.html',
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
    ], EditProfilePage);
    return EditProfilePage;
}());
export { EditProfilePage };
//# sourceMappingURL=edit-profile.js.map