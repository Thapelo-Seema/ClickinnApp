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
import { IonicPage, NavController, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { Camera } from '@ionic-native/camera';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { FileUploadSvcProvider } from '../../providers/file-upload-svc/file-upload-svc';
import { SearchfeedProvider } from '../../providers/searchfeed/searchfeed';
import { take } from 'rxjs-compat/operators/take';
/**
 * Generated class for the EditApartmentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var EditApartmentPage = /** @class */ (function () {
    function EditApartmentPage(navCtrl, storage, accom_svc, object_init, toastCtrl, camera, errHandler, file_upload_svc, alertCtrl, loadingCtrl, searchfeed_svc) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.storage = storage;
        this.accom_svc = accom_svc;
        this.object_init = object_init;
        this.toastCtrl = toastCtrl;
        this.camera = camera;
        this.errHandler = errHandler;
        this.file_upload_svc = file_upload_svc;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.searchfeed_svc = searchfeed_svc;
        this.loader = this.loadingCtrl.create();
        this.images = [];
        this.apartImgCount = 0;
        this.apartmentImagesAdded = false;
        this.connectionError = false;
        this.landlords = [];
        this.noLandlords = false;
        this.imagesLoaded = [
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false
        ];
        this.loader.present();
        this.cancelPic(); //Initializing the fileUpload object (just reusing an inappropriatley named method)
        this.apartment = this.object_init.initializeApartment(); //Initializing an empty apartment object
        this.storage.getApartment()
            .then(function (apart) {
            //Check if theres an apartment form cache before proceed
            if (apart) {
                //console.log('apartment: ', apart )
                _this.apartment = _this.object_init.initializeApartment2(apart); //Populating the apartment fields with those from the cache
                _this.storage.getUser()
                    .then(function (user) {
                    _this.searchfeed_svc.getAgentsLandlords(user.uid)
                        .pipe(take(1))
                        .subscribe(function (landlords) {
                        if (landlords.length > 0) {
                            landlords.forEach(function (lnd) {
                                _this.landlords.push(lnd);
                            });
                        }
                        else {
                            _this.noLandlords = true;
                        }
                    });
                });
                _this.loader.dismiss();
                /*If the images of the apartment are not in array format put them in array otherwise use as is */
                if (!(apart.images.length > 0)) {
                    //console.log('apart images: ', apart.images)
                    _this.images = Object.keys(apart.images).map(function (imageId) {
                        _this.imagesLoaded.push(false);
                        return apart.images[imageId];
                    });
                    _this.apartImgCount = _this.images.length;
                }
                else {
                    //console.log('apart images: ', apart.images)
                    _this.images = apart.images;
                    _this.apartImgCount = apart.images.length;
                }
            }
            else {
                _this.loader.dismiss();
            }
        })
            .catch(function (err) {
            _this.loader.dismiss();
            _this.errHandler.handleError(err);
        });
    }
    EditApartmentPage.prototype.ionViewDidLoad = function () {
    };
    EditApartmentPage.prototype.gotoBuilding = function () {
        var _this = this;
        this.storage.setProperty(this.apartment.property)
            .then(function () {
            _this.navCtrl.push('EditPropertyPage');
        });
    };
    //Method for handling deletion of apartment pictures
    EditApartmentPage.prototype.remove = function (index) {
        var _this = this;
        var confirm = false;
        var alert = this.alertCtrl.create({
            title: "Delete",
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
    //Save the changes made to the apartment
    EditApartmentPage.prototype.save = function () {
        var _this = this;
        var confirm = false;
        var alert = this.alertCtrl.create({
            title: "Save",
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
                var ldr_1 = _this.loadingCtrl.create();
                ldr_1.present();
                _this.apartment.images = _this.images;
                if (_this.apartment.quantity_available > 0) {
                    _this.apartment.available = true;
                }
                else {
                    _this.apartment.available = false;
                }
                _this.accom_svc.updateApartment(_this.apartment)
                    .then(function () {
                    ldr_1.dismiss();
                    _this.toastCtrl.create({
                        message: 'The apartment was successfully updated !',
                        duration: 5000
                    })
                        .present();
                })
                    .catch(function (err) {
                    ldr_1.dismiss();
                    _this.toastCtrl.create({
                        message: err.message,
                        duration: 4000
                    })
                        .present();
                });
            }
        });
    };
    //Method that handles the uploading of apartment images to firebase storage
    EditApartmentPage.prototype.uploadApartmentImage = function () {
        var _this = this;
        var confirm = false;
        var alert = this.alertCtrl.create({
            title: "Upload",
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
                var ldr_2 = _this.loadingCtrl.create();
                ldr_2.present();
                _this.file_upload_svc.uploadPic(_this.fileUpload)
                    .then(function (imag) {
                    _this.images.push(imag);
                    ldr_2.dismiss();
                    _this.connectionError = false;
                    _this.toastCtrl.create({
                        message: 'Picture added !',
                        duration: 3000
                    })
                        .present();
                })
                    .catch(function (err) {
                    ldr_2.dismiss();
                    if (_this.connectionError == true)
                        _this.toastCtrl.create({
                            message: 'Please check your internet connection...images could not be uploaded',
                            duration: 4000
                        })
                            .present();
                    _this.connectionError = true;
                });
            }
        });
    };
    //Cancel the current image details
    EditApartmentPage.prototype.cancelPic = function () {
        this.fileUpload = {
            file: null,
            name: '',
            path: '',
            progress: 0,
            url: ''
        };
    };
    //Add a picture to the current apartment image array
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
        });
    };
    EditApartmentPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-edit-apartment',
            templateUrl: 'edit-apartment.html',
        }),
        __metadata("design:paramtypes", [NavController,
            LocalDataProvider,
            AccommodationsProvider,
            ObjectInitProvider,
            ToastController,
            Camera,
            ErrorHandlerProvider,
            FileUploadSvcProvider,
            AlertController,
            LoadingController,
            SearchfeedProvider])
    ], EditApartmentPage);
    return EditApartmentPage;
}());
export { EditApartmentPage };
//# sourceMappingURL=edit-apartment.js.map