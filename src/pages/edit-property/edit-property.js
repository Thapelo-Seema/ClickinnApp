var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, Content, LoadingController } from 'ionic-angular';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { take } from 'rxjs-compat/operators/take';
import { Camera } from '@ionic-native/camera';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { FileUploadSvcProvider } from '../../providers/file-upload-svc/file-upload-svc';
import { MapsProvider } from '../../providers/maps/maps';
/**
 * Generated class for the EditPropertyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var EditPropertyPage = /** @class */ (function () {
    function EditPropertyPage(navCtrl, navParams, accom_svc, local_db, object_init, toastCtrl, camera, errHandler, file_upload_svc, map_svc, alertCtrl, loadingCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.accom_svc = accom_svc;
        this.local_db = local_db;
        this.object_init = object_init;
        this.toastCtrl = toastCtrl;
        this.camera = camera;
        this.errHandler = errHandler;
        this.file_upload_svc = file_upload_svc;
        this.map_svc = map_svc;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.loader = this.loadingCtrl.create();
        this.images = [];
        this.fileUploads = [];
        this.propImgCount = 0;
        this.propertyImagesAdded = false;
        this.showAddedImages = false;
        this.nearby = '';
        this.predictionLoading = false;
        this.connectionError = false;
        this.predictionsNby = [];
        this.imagesLoaded = [false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false
        ];
        this.imagesLoaded2 = [false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false
        ];
        this.loader.present();
        /*this.accom_svc.loading.subscribe(data =>{
          this.loadingMore = data;
        })
    
        this.accom_svc.done.subscribe(data =>{
          this.done = data;
          if(this.done == true) this.loadingMore = false;
        })*/
        this.property = this.object_init.initializeProperty();
        this.local_db.getProperty().then(function (prop) {
            if (prop) {
                _this.property = _this.object_init.initializeProperty2(prop);
                _this.images = [];
                if (!(prop.images.length > 0)) {
                    _this.images = Object.keys(prop.images).map(function (imageId) {
                        _this.imagesLoaded.push(false);
                        return prop.images[imageId];
                    });
                    _this.loader.dismiss();
                }
                else {
                    console.log('apart images: ', prop.images);
                    _this.images = prop.images;
                    _this.propImgCount = prop.images.length;
                    _this.loader.dismiss();
                }
                _this.apartments = _this.accom_svc.getPropertyApartments(prop.prop_id);
                _this.accom_svc.getPropertyApartments(prop.prop_id)
                    .pipe(take(1))
                    .subscribe(function (aparts) {
                    aparts.forEach(function (apart) {
                        _this.imagesLoaded2.push(false);
                    });
                });
                _this.accom_svc.getPropertyById(prop.prop_id)
                    .pipe(take(1))
                    .subscribe(function (ppty) {
                    _this.property = _this.object_init.initializeProperty2(ppty);
                }, function (err) {
                    _this.toastCtrl.create({
                        message: err.message,
                        duration: 3000
                    })
                        .present();
                });
            }
        });
    }
    EditPropertyPage.prototype.ionViewDidLoad = function () {
        // this.monitorEnd();
    };
    EditPropertyPage.prototype.gotoApartment = function (apartment) {
        var _this = this;
        this.local_db.setApartment(apartment).then(function (data) { return _this.navCtrl.push('EditApartmentPage'); })
            .catch(function (err) {
            console.log(err);
        });
    };
    EditPropertyPage.prototype.remove = function (index) {
        var _this = this;
        var confirm = false;
        var alert = this.alertCtrl.create({
            title: "Confirm picture deletion",
            message: 'Are you sure you want to delete this picture ?',
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
            if (index >= 0 && confirm == true) {
                _this.images.splice(index, 1);
            }
        });
    };
    EditPropertyPage.prototype.save = function () {
        var _this = this;
        var confirm = false;
        var alert = this.alertCtrl.create({
            title: "Confirm changes",
            message: 'Are you sure you want to save the changes you made to this property ?',
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
                _this.property.images = _this.images;
                _this.accom_svc.updateProperty(_this.property)
                    .then(function () {
                    ldr_1.dismiss();
                    _this.toastCtrl.create({
                        message: 'The property was successfully updated !',
                        duration: 5000
                    })
                        .present();
                    _this.showAddedImages = false;
                })
                    .catch(function (err) {
                    _this.toastCtrl.create({
                        message: 'Property not updated...please check your connection and try again',
                        duration: 4000
                    })
                        .present();
                });
            }
        });
    };
    EditPropertyPage.prototype.uploadPropertyImage = function () {
        var _this = this;
        var confirm = false;
        var alert = this.alertCtrl.create({
            title: "Confirm intention",
            message: 'Are sure you want to add this image to the property profile ?',
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
                _this.file_upload_svc.uploadPics(_this.fileUploads)
                    .then(function (imag) {
                    imag.forEach(function (im) {
                        _this.images.push(im);
                    });
                    ldr_2.dismiss();
                    _this.toastCtrl.create({
                        message: 'Pictures updated !',
                        duration: 3000
                    })
                        .present();
                })
                    .catch(function (err) {
                    _this.toastCtrl.create({
                        message: 'Please check your internet connection and try again...images not ulploaded',
                        duration: 4000
                    })
                        .present();
                    ldr_2.dismiss();
                });
            }
        });
    };
    EditPropertyPage.prototype.deleteNearby = function (nearby) {
        var index = this.property.nearbys.indexOf(nearby);
        if (index !== -1) {
            this.property.nearbys.splice(index, 1);
        }
    };
    EditPropertyPage.prototype.addNearby = function (nearby) {
        this.property.nearbys.push(nearby);
        this.nearby = '';
        this.predictionsNby = [];
        console.log('added ', nearby);
    };
    EditPropertyPage.prototype.cancelPic = function (index) {
        if (confirm('Do you really want to remove this image ?')) {
            this.fileUploads.splice(index);
        }
    };
    EditPropertyPage.prototype.addPicture = function () {
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
            _this.propImgCount++;
            _this.propertyImagesAdded = true;
            _this.fileUploads.push({
                file: 'data:image/jpeg;base64,' + imageData,
                path: 'ApartmentImages',
                url: '',
                name: _this.property.prop_id + "_" + _this.propImgCount + ".jpg",
                progress: 0
            });
        })
            .then(function () {
            _this.uploadPropertyImage();
        })
            .catch(function (err) {
            _this.errHandler.handleError({ errCode: 'IMAGE_NOT_SELECTED', message: 'No image selected' });
        });
    };
    EditPropertyPage.prototype.getPredictionsNby = function (event) {
        var _this = this;
        this.predictionLoading = true;
        if (event.key === "Backspace" || event.code === "Backspace") {
            setTimeout(function () {
                _this.map_svc.getPlacePredictionsSA(event.target.value).then(function (data) {
                    console.log(data);
                    _this.predictionsNby = [];
                    _this.predictionsNby = data;
                    _this.predictionLoading = false;
                })
                    .catch(function (err) {
                    console.log('Error 1');
                    if (_this.connectionError == false)
                        _this.errHandler.handleError({ message: 'Your internet connection is faulty please try again once a proper connection is established' });
                    _this.predictionLoading = false;
                    _this.connectionError = true;
                });
            }, 3000);
        }
        else {
            this.map_svc.getPlacePredictionsSA(event.target.value).then(function (data) {
                console.log(data);
                _this.predictionsNby = [];
                _this.predictionsNby = data;
                _this.predictionLoading = false;
            })
                .catch(function (err) {
                console.log('Error 1');
                if (_this.connectionError == false)
                    _this.errHandler.handleError({ message: 'Your internet connection is faulty please try again once a proper connection is established' });
                _this.predictionLoading = false;
                _this.connectionError = true;
            });
        }
    };
    __decorate([
        ViewChild(Content),
        __metadata("design:type", Content)
    ], EditPropertyPage.prototype, "content", void 0);
    EditPropertyPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-edit-property',
            templateUrl: 'edit-property.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            AccommodationsProvider,
            LocalDataProvider,
            ObjectInitProvider,
            ToastController,
            Camera,
            ErrorHandlerProvider,
            FileUploadSvcProvider,
            MapsProvider,
            AlertController,
            LoadingController])
    ], EditPropertyPage);
    return EditPropertyPage;
}());
export { EditPropertyPage };
//# sourceMappingURL=edit-property.js.map