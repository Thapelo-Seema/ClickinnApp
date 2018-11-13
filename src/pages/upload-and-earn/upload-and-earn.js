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
import { IonicPage, NavController, NavParams, AlertController, Platform, ToastController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
//import { storage } from 'firebase';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFirestore } from 'angularfire2/firestore';
//import { AngularFireAuth } from 'angularfire2/auth';
import { MapsProvider } from '../../providers/maps/maps';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
var UploadAndEarnPage = /** @class */ (function () {
    function UploadAndEarnPage(alertCtrl, navCtrl, navParams, camera, errHandler, platform, afs, afstorage, toast, map_svc, storage, accom_svc, object_init) {
        var _this = this;
        this.alertCtrl = alertCtrl;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.camera = camera;
        this.errHandler = errHandler;
        this.platform = platform;
        this.afs = afs;
        this.afstorage = afstorage;
        this.toast = toast;
        this.map_svc = map_svc;
        this.storage = storage;
        this.accom_svc = accom_svc;
        this.object_init = object_init;
        this.apartment = {
            available: true,
            dP: { name: 'placeholder', path: 'path', progress: 0, url: "assets/imgs/placeholder.jpg" },
            deposit: 0,
            description: '',
            apart_id: '',
            images: [],
            price: 0,
            prop_id: '',
            room_type: '',
            type: 'loading...',
            timeStamp: 0,
            occupiedBy: this.object_init.initializeTenant()
        };
        this.building = {
            address: null,
            nearbys: [],
            nsfas: false,
            wifi: false,
            laundry: false,
            common: '',
            dP: { name: 'placeholder', path: 'path', progress: 0, url: "assets/imgs/placeholder.jpg" },
            images: [],
            prop_id: '',
            timeStamp: 0,
            user_id: '',
            parking: false,
            prepaid_elec: false
        };
        this.buildings = [];
        this.address = '';
        this.nearby = '';
        this.apartmentImagesAdded = false;
        this.propertyImagesAdded = false;
        this.apartmentImages = [];
        this.propertyImages = [];
        this.loading = false;
        this.apartImgCount = 0;
        this.buildingImgCount = 0;
        this.predictionsAdd = [];
        this.predictionsNby = [];
        this.buildingSelected = false;
        this.image = "assets/imgs/placeholder.png";
        this.dpChanged = false;
        this.openList = false;
        this.onMobile = false;
        this.uploading = false;
        this.progss = 0;
        this.imagesLoaded = [false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false
        ];
        this.platform.ready().then(function (val) {
            if (platform.is('cordova'))
                _this.onMobile = true;
            _this.storage.getUser().then(function (user) {
                _this.user = user;
                _this.building.user_id = user.uid;
                _this.accom_svc.getUsersProperties(user.uid).subscribe(function (buildings) {
                    _this.buildings = buildings;
                    buildings.forEach(function (bld) {
                        _this.imagesLoaded.push(false);
                    });
                });
            });
        });
    }
    UploadAndEarnPage.prototype.ionViewDidLoad = function () {
        //this.showAlert();
    };
    UploadAndEarnPage.prototype.selectChange = function (e) {
        console.log(e);
    };
    UploadAndEarnPage.prototype.showList = function () {
        this.openList = true;
    };
    UploadAndEarnPage.prototype.closeList = function () {
        this.openList = false;
    };
    UploadAndEarnPage.prototype.selectEBuilding = function (building) {
        this.building = building;
        this.apartment.property = building;
        this.apartment.prop_id = building.prop_id;
        this.buildings = [];
        this.buildings.push(building);
        this.buildingSelected = true;
    };
    UploadAndEarnPage.prototype.showAlert = function () {
        var alert = this.alertCtrl.create({
            title: 'Upload and Earn',
            subTitle: "Get 10% off your next McDonalds meal !!",
            message: "Upload a vacant apartment and use your upload code to get discount for your next meal at McDonalds",
            cssClass: 'alertCtrl',
            buttons: ['OK']
        });
        alert.present();
    };
    UploadAndEarnPage.prototype.addPictures = function (source, destination) {
        var _this = this;
        var options = {
            quality: 90,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: source,
            allowEdit: true,
            targetWidth: 800,
            targetHeight: 800,
        };
        this.camera.getPicture(options).then(function (imageData) {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64:
            if (destination == 1) {
                _this.apartImgCount++;
                _this.apartmentImagesAdded = true;
                var image = {
                    file: 'data:image/jpeg;base64,' + imageData,
                    path: 'ApartmentImages',
                    url: '',
                    name: _this.apartment.apart_id + "_" + _this.apartImgCount + ".jpg",
                    progress: 0
                };
                _this.apartmentImages.push(image);
            }
            else if (destination == 2) {
                _this.buildingImgCount++;
                _this.propertyImagesAdded = true;
                var image = {
                    file: 'data:image/jpeg;base64,' + imageData,
                    path: 'PropertyImages',
                    url: '',
                    name: _this.building.prop_id + "_" + _this.buildingImgCount + ".jpg",
                    progress: 0
                };
                _this.propertyImages.push(image);
            }
        }).catch(function (err) {
            _this.errHandler.handleError({ errCode: 'IMAGE_NOT_SELECTED', message: 'No image selected' });
            _this.loading = false;
        });
    };
    UploadAndEarnPage.prototype.uploadApartment = function () {
        var _this = this;
        console.log('Uploading apartment...');
        this.uploading = true;
        if (this.buildingSelected) {
            this.accom_svc.updateApartment(this.apartment).then(function () {
                _this.storage.setApartment(_this.apartment)
                    .then(function (apart) {
                    _this.successful();
                    _this.uploading = false;
                    _this.navCtrl.push('InfoPage');
                });
            })
                .catch(function (err) {
                _this.errHandler.handleError(err);
                _this.uploading = false;
            });
        }
        else {
            this.uploadBuildingPics().then(function () {
                console.log('Uploaded building pics...', _this.building.images);
                _this.apartment.property = _this.building;
                _this.accom_svc.updateProperty(_this.building);
                _this.accom_svc.updateApartment(_this.apartment).then(function () {
                    _this.storage.setApartment(_this.apartment)
                        .then(function (apart) {
                        _this.successful();
                        _this.uploading = false;
                        _this.navCtrl.push('InfoPage');
                    });
                })
                    .catch(function (err) {
                    _this.errHandler.handleError(err);
                    _this.uploading = false;
                });
            })
                .catch(function (err) {
                _this.uploading = false;
                console.log(err);
            });
        }
    };
    UploadAndEarnPage.prototype.selectBuilding = function (property) {
        var _this = this;
        this.apartment.property = property; //adding the building profile to the apartment
        property.images.forEach(function (image) {
            _this.apartment.property.images.push(image);
        });
    };
    UploadAndEarnPage.prototype.uploadPic = function (image) {
        var _this = this;
        this.loading = true;
        console.log('Uploading pic... ', image);
        var storageRef = this.afstorage.ref(image.path + "/" + image.name);
        var uploadTask;
        if (image.file.lastModified) {
            uploadTask = storageRef.put(image.file);
        }
        else {
            uploadTask = storageRef.putString(image.file, 'data_url');
        }
        return new Promise(function (resolve, reject) {
            uploadTask.snapshotChanges().subscribe(function (snapshot) {
                //update the progress property of the upload object
                uploadTask.percentageChanges().subscribe(function (progress) {
                    image.progress = progress;
                    _this.progss = progress;
                    console.log('progress... ', image.progress);
                });
            }, function (err) {
                //if there's an error log it in the console
                _this.errHandler.handleError(err);
                _this.loading = false;
            }, function () {
                var tempUrl = '';
                //on success of the upload, update the url property of the upload object
                storageRef.getDownloadURL().subscribe(function (down_url) {
                    tempUrl = down_url;
                }, function (err) {
                    _this.errHandler.handleError(err);
                    _this.loading = false;
                }, function () {
                    var image_out = {
                        url: tempUrl,
                        name: image.name,
                        progress: image.progress,
                        path: image.path
                    };
                    resolve(image_out);
                });
            });
        });
    };
    UploadAndEarnPage.prototype.uploadPics = function (pics) {
        var _this = this;
        this.loading = true;
        var images = [];
        return new Promise(function (resolve, reject) {
            if (pics) {
                pics.forEach(function (pic) {
                    _this.uploadPic(pic).then(function (image) {
                        images.push(image);
                        if (images.length == pics.length) {
                            resolve(images);
                            _this.loading = false;
                        }
                    }).catch(function (err) {
                        _this.loading = false;
                        _this.errHandler.handleError(err);
                    });
                });
            }
            else {
                reject('No images selected');
                _this.loading = false;
            }
        });
    };
    UploadAndEarnPage.prototype.initialApartUpload = function () {
        var _this = this;
        this.loading = true;
        this.afs.collection('Apartments').add(this.apartment).then(function (apartRef) {
            _this.apartment.apart_id = apartRef.id;
            _this.loading = false;
        })
            .catch(function (err) {
            _this.errHandler.handleError(err);
            _this.loading = false;
        });
    };
    UploadAndEarnPage.prototype.initialBuildinUpload = function () {
        var _this = this;
        this.loading = true;
        this.afs.collection('Properties').add(this.building).then(function (buildingRef) {
            console.log('This is the building id: ', buildingRef.id);
            _this.building.prop_id = buildingRef.id;
            _this.loading = false;
        })
            .catch(function (err) { return _this.errHandler.handleError(err); });
    };
    UploadAndEarnPage.prototype.uploadApartPics = function () {
        var _this = this;
        if (this.apartmentImages.length <= 0) {
            console.log('No apartment images... ', this.apartmentImages);
            return;
        }
        return this.uploadPics(this.apartmentImages).then(function (images) {
            _this.apartment.images = images;
            console.log('Apartment pics uploaded');
        })
            .catch(function (err) { return _this.errHandler.handleError(err); });
    };
    UploadAndEarnPage.prototype.updateApartmentPics = function (event) {
        console.log('Pics: ', event.target.files);
        var pic = event.target.files[0];
        var image = {
            file: pic,
            name: pic.name,
            url: '',
            path: 'ApartmentImages',
            progress: 0
        };
        this.apartmentImages.push(image);
    };
    UploadAndEarnPage.prototype.updateBuildingPics = function (event) {
        console.log('Pics: ', event.target.files);
        var pic = event.target.files[0];
        var image = {
            file: pic,
            name: pic.name,
            url: '',
            path: 'PropertyImages',
            progress: 0
        };
        this.propertyImages.push(image);
    };
    UploadAndEarnPage.prototype.uploadBuildingPics = function () {
        var _this = this;
        if (!(this.propertyImages.length > 0))
            return;
        return new Promise(function (resolve, reject) {
            _this.uploadPics(_this.propertyImages).then(function (images) {
                _this.building.images = images;
                console.log('Building pics uploaded...');
                console.log('Building.prop_id = ', _this.building.prop_id);
                _this.apartment.prop_id = _this.building.prop_id;
                resolve();
            });
        });
    };
    /*Getting autocomplete predictions from the google maps place predictions service*/
    UploadAndEarnPage.prototype.getPredictionsAdd = function (event) {
        var _this = this;
        this.loading = true;
        if (event.key === "Backspace" || event.code === "Backspace") {
            setTimeout(function () {
                _this.map_svc.getPlacePredictionsSA(event.target.value).then(function (data) {
                    console.log(data);
                    _this.predictionsAdd = [];
                    _this.predictionsAdd = data;
                    _this.loading = false;
                })
                    .catch(function (err) {
                    _this.errHandler.handleError(err);
                    _this.loading = false;
                });
            }, 3000);
        }
        else {
            this.map_svc.getPlacePredictionsSA(event.target.value).then(function (data) {
                console.log(data);
                _this.predictionsAdd = [];
                _this.predictionsAdd = data;
                _this.loading = false;
            })
                .catch(function (err) {
                _this.errHandler.handleError(err);
                _this.loading = false;
            });
        }
    };
    /*Getting autocomplete predictions from the google maps place predictions service*/
    UploadAndEarnPage.prototype.getPredictionsNby = function (event) {
        var _this = this;
        this.loading = true;
        if (event.key === "Backspace" || event.code === "Backspace") {
            setTimeout(function () {
                _this.map_svc.getPlacePredictionsSA(event.target.value).then(function (data) {
                    console.log(data);
                    _this.predictionsNby = [];
                    _this.predictionsNby = data;
                    _this.loading = false;
                })
                    .catch(function (err) {
                    _this.errHandler.handleError(err);
                    _this.loading = false;
                });
            }, 3000);
        }
        else {
            this.map_svc.getPlacePredictionsSA(event.target.value).then(function (data) {
                console.log(data);
                _this.predictionsNby = [];
                _this.predictionsNby = data;
                _this.loading = false;
            })
                .catch(function (err) {
                _this.errHandler.handleError(err);
                _this.loading = false;
            });
        }
    };
    UploadAndEarnPage.prototype.selectPlace = function (place) {
        var _this = this;
        this.loading = true;
        this.map_svc.getSelectedPlace(place).then(function (data) {
            _this.building.address = data;
            _this.address = data.description;
            _this.predictionsAdd = [];
            _this.loading = false;
        })
            .catch(function (err) {
            _this.errHandler.handleError(err);
            _this.loading = false;
        });
    };
    UploadAndEarnPage.prototype.addNearby = function (nearby) {
        this.building.nearbys.push(nearby);
        this.nearby = '';
        this.predictionsNby = [];
        console.log('added ', nearby);
    };
    UploadAndEarnPage.prototype.successful = function () {
        var _this = this;
        this.toast.create({
            message: "Apartment successfully uploaded!",
            showCloseButton: true,
            closeButtonText: 'Ok',
            position: 'middle',
            cssClass: 'toast_margins full_width'
        })
            .present().then(function () {
            _this.loading = false;
        });
    };
    UploadAndEarnPage.prototype.deleteNearby = function (nearby) {
        var index = this.building.nearbys.indexOf(nearby);
        if (index !== -1) {
            this.building.nearbys.splice(index, 1);
        }
    };
    UploadAndEarnPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-upload-and-earn',
            templateUrl: 'upload-and-earn.html',
        }),
        __metadata("design:paramtypes", [AlertController,
            NavController,
            NavParams,
            Camera,
            ErrorHandlerProvider,
            Platform,
            AngularFirestore,
            AngularFireStorage,
            ToastController,
            MapsProvider,
            LocalDataProvider,
            AccommodationsProvider,
            ObjectInitProvider])
    ], UploadAndEarnPage);
    return UploadAndEarnPage;
}());
export { UploadAndEarnPage };
//# sourceMappingURL=upload-and-earn.js.map