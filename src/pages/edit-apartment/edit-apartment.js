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
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { Camera } from '@ionic-native/camera';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { FileUploadSvcProvider } from '../../providers/file-upload-svc/file-upload-svc';
/**
 * Generated class for the EditApartmentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var EditApartmentPage = /** @class */ (function () {
    function EditApartmentPage(navCtrl, navParams, local_db, accom_svc, object_init, toastCtrl, camera, errHandler, file_upload_svc, alertCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.local_db = local_db;
        this.accom_svc = accom_svc;
        this.object_init = object_init;
        this.toastCtrl = toastCtrl;
        this.camera = camera;
        this.errHandler = errHandler;
        this.file_upload_svc = file_upload_svc;
        this.alertCtrl = alertCtrl;
        this.loading = true;
        this.images = [];
        this.apartImgCount = 0;
        this.apartmentImagesAdded = false;
        this.imagesLoaded = [false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false
        ];
        this.cancelPic();
        this.apartment = this.object_init.initializeApartment();
        this.local_db.getApartment()
            .then(function (apart) {
            if (apart) {
                console.log('apartment: ', apart);
                _this.apartment = apart;
                _this.loading = false;
                if (!(apart.images.length > 0)) {
                    console.log('apart images: ', apart.images);
                    _this.images = Object.keys(apart.images).map(function (imageId) {
                        _this.imagesLoaded.push(false);
                        return apart.images[imageId];
                    });
                    _this.apartImgCount = _this.images.length;
                }
                else {
                    console.log('apart images: ', apart.images);
                    _this.images = apart.images;
                    _this.apartImgCount = apart.images.length;
                }
            }
            else {
                _this.loading = false;
                console.log('no apartment...');
            }
        });
    }
    EditApartmentPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad EditApartmentPage');
    };
    EditApartmentPage.prototype.remove = function (index) {
        var _this = this;
        var confirm = false;
        var alert = this.alertCtrl.create({
            title: "Confirm picture deletion",
            message: "Are you sure you want to delete this picture ?",
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
            if (index >= 0 && confirm) {
                _this.images.splice(index, 1);
            }
        });
    };
    EditApartmentPage.prototype.save = function () {
        var _this = this;
        var confirm = false;
        var alert = this.alertCtrl.create({
            title: "Confirm intention",
            message: "Are you sure you want to save the changes ?",
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
                _this.loading = true;
                _this.apartment.images = _this.images;
                _this.accom_svc.updateApartment(_this.apartment)
                    .then(function () {
                    _this.loading = false;
                    _this.toastCtrl.create({
                        message: 'The apartment was successfully updated !',
                        duration: 5000
                    })
                        .present();
                })
                    .catch(function (err) {
                    console.log(err);
                });
            }
        });
    };
    EditApartmentPage.prototype.uploadApartmentImage = function () {
        var _this = this;
        var confirm = false;
        var alert = this.alertCtrl.create({
            title: "Confirm picture upload",
            message: "Are sure you want to add this image to the apartment profile ?",
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
                _this.loading = true;
                _this.file_upload_svc.uploadPic(_this.fileUpload)
                    .then(function (imag) {
                    _this.images.push(imag);
                    _this.loading = false;
                    _this.toastCtrl.create({
                        message: 'Picture added !',
                        duration: 3000
                    })
                        .present();
                });
            }
        });
    };
    EditApartmentPage.prototype.cancelPic = function () {
        this.fileUpload = {
            file: null,
            name: '',
            path: '',
            progress: 0,
            url: ''
        };
    };
    EditApartmentPage.prototype.addPicture = function () {
        var _this = this;
        var options = {
            quality: 90,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: 1,
            allowEdit: true,
            targetWidth: 800,
            targetHeight: 800,
        };
        this.camera.getPicture(options).then(function (imageData) {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64:
            _this.apartImgCount++;
            _this.apartmentImagesAdded = true;
            _this.fileUpload = {
                file: 'data:image/jpeg;base64,' + imageData,
                path: 'ApartmentImages',
                url: '',
                name: _this.apartment.apart_id + "_" + _this.apartImgCount + ".jpg",
                progress: 0
            };
        })
            .then(function () {
            _this.uploadApartmentImage();
        })
            .catch(function (err) {
            _this.errHandler.handleError({ errCode: 'IMAGE_NOT_SELECTED', message: 'No image selected' });
            _this.loading = false;
        });
    };
    EditApartmentPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-edit-apartment',
            templateUrl: 'edit-apartment.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            LocalDataProvider,
            AccommodationsProvider,
            ObjectInitProvider,
            ToastController,
            Camera,
            ErrorHandlerProvider,
            FileUploadSvcProvider,
            AlertController])
    ], EditApartmentPage);
    return EditApartmentPage;
}());
export { EditApartmentPage };
//# sourceMappingURL=edit-apartment.js.map