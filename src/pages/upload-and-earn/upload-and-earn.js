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
import { IonicPage, NavController, NavParams, AlertController, Platform, ToastController, Content, LoadingController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFirestore } from 'angularfire2/firestore';
import { MapsProvider } from '../../providers/maps/maps';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { SearchfeedProvider } from '../../providers/searchfeed/searchfeed';
import { take } from 'rxjs-compat/operators/take';
var UploadAndEarnPage = /** @class */ (function () {
    function UploadAndEarnPage(alertCtrl, navCtrl, navParams, camera, errHandler, platform, afs, afstorage, toast, map_svc, storage, accom_svc, object_init, loadingCtrl, searchfeed_svc) {
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
        this.loadingCtrl = loadingCtrl;
        this.searchfeed_svc = searchfeed_svc;
        this.buildings = [];
        this.address = '';
        this.nearby = '';
        this.apartmentImagesAdded = false;
        this.propertyImagesAdded = false;
        this.apartmentImages = [];
        this.propertyImages = [];
        this.loader = this.loadingCtrl.create();
        this.apartImgCount = 0;
        this.buildingImgCount = 0;
        this.predictionsAdd = [];
        this.predictionsNby = [];
        this.buildingSelected = false;
        this.image = "assets/imgs/placeholder.png";
        this.dpChanged = false;
        this.openList = false;
        this.onMobile = false;
        this.existing = false;
        this.progss = 0;
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
        this.apartment = this.object_init.initializeApartment();
        this.building = this.object_init.initializeProperty();
        this.platform.ready().then(function (val) {
            if (platform.is('cordova'))
                _this.onMobile = true;
            _this.storage.getUser().then(function (user) {
                _this.user = _this.object_init.initializeUser2(user);
                _this.building.user_id = user.uid; //Setting the user id of the building
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
                //If a navigation parameter containing prop_id is passed, we are just editting an existing apartment
                if (_this.navParams.data.prop_id != undefined) {
                    console.log(_this.navParams.data);
                    _this.initializeExisting(_this.navParams.data);
                }
                else {
                    _this.propertySubs = _this.accom_svc.getUsersProperties(user.uid).subscribe(function (buildings) {
                        //Subscribing to the users properties and declaring a loaded - boolean for each buildings dp
                        _this.buildings = buildings;
                        buildings.forEach(function (bld) {
                            _this.imagesLoaded.push(false);
                        });
                        _this.loader.dismiss();
                    });
                }
            });
        });
    }
    UploadAndEarnPage.prototype.ionViewDidLoad = function () {
        //this.showAlert();
    };
    UploadAndEarnPage.prototype.scrollToTop = function () {
        this.content.scrollToTop();
    };
    UploadAndEarnPage.prototype.initializeExisting = function (apartment) {
        var _this = this;
        this.existing = true;
        this.storage.setApartment(apartment)
            .then(function () {
            _this.apartment = _this.object_init.initializeApartment2(apartment);
            _this.building = _this.object_init.initializeProperty2(apartment.property);
            _this.loader.dismiss();
        });
    };
    UploadAndEarnPage.prototype.ionViewWillLeave = function () {
        console.log('uplaod page unsubscrinbing...');
        this.propertySubs.unsubscribe();
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
        this.building = this.object_init.initializeProperty2(building);
        this.apartment.property = this.object_init.initializeProperty2(building);
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
            quality: 60,
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
            console.log(err);
            _this.errHandler.handleError({ errCode: 'IMAGE_NOT_SELECTED', message: 'No image selected' });
        });
    };
    UploadAndEarnPage.prototype.uploadApartment = function () {
        var _this = this;
        console.log('Uploading apartment...');
        console.log(this.apartment);
        console.log(this.building);
        this.apartment.prop_id = this.building.prop_id;
        var ldr = this.loadingCtrl.create();
        ldr.present();
        if (this.apartment.dP.url == "assets/imgs/placeholder.jpg") {
            if (this.apartmentImages.length > 0)
                this.apartment.dP = this.apartmentImages[0];
        }
        if (this.building.dP.url == "assets/imgs/placeholder.jpg") {
            if (this.propertyImages.length > 0)
                this.building.dP = this.propertyImages[0];
        }
        if (this.buildingSelected == true) {
            this.apartment.complete = true;
            this.apartment.timeStampModified = Date.now();
            this.apartment.property.timeStampModified = Date.now();
            this.accom_svc.updateApartment(this.apartment).then(function () {
                _this.storage.setApartment(_this.apartment)
                    .then(function (apart) {
                    _this.successful();
                    ldr.dismiss();
                    _this.navCtrl.push('InfoPage');
                })
                    .catch(function (err) {
                    ldr.dismiss();
                    _this.errHandler.handleError(err);
                });
            })
                .catch(function (err) {
                ldr.dismiss();
                _this.errHandler.handleError(err);
            });
        }
        else {
            this.building.timeStampModified = Date.now();
            this.building.complete = true;
            this.apartment.complete = true;
            this.apartment.timeStampModified = Date.now();
            this.apartment.property = this.object_init.initializeProperty2(this.building);
            this.accom_svc.updateApartment(this.apartment)
                .then(function () {
                _this.storage.setApartment(_this.apartment)
                    .then(function (apart) {
                    ldr.dismiss();
                    _this.successful();
                    _this.navCtrl.push('InfoPage');
                    _this.uploadBuildingPics()
                        .then(function () {
                        _this.accom_svc.updateProperty(_this.building)
                            .then(function () {
                            //Say nothing...
                        })
                            .catch(function (err) {
                            _this.handleBuidingUploadError();
                        });
                    })
                        .catch(function (err) {
                        _this.handleBuidingUploadError();
                    });
                })
                    .catch(function (err) {
                    _this.errHandler.handleError(err);
                    ldr.dismiss();
                });
            })
                .catch(function (err) {
                _this.errHandler.handleError(err);
                ldr.dismiss();
            });
        }
    };
    UploadAndEarnPage.prototype.handleBuidingUploadError = function () {
        var _this = this;
        var edit = false;
        var errAlert = this.alertCtrl.create({
            title: 'Property not saved',
            message: 'Error saving the details of this property',
            buttons: [
                {
                    text: 'Edit property',
                    handler: function (data) {
                        edit = true;
                    }
                },
                {
                    role: 'cancel',
                    text: 'dismiss',
                    handler: function (data) {
                        edit = false;
                    }
                }
            ]
        });
        errAlert.present();
        errAlert.onDidDismiss(function () {
            if (edit == true) {
                _this.storage.setProperty(_this.building)
                    .then(function () {
                    _this.navCtrl.push('EditPropertyPage');
                });
            }
        });
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
                console.log(err);
                reject(err.message);
            }, function () {
                var tempUrl = '';
                //on success of the upload, update the url property of the upload object
                storageRef.getDownloadURL().subscribe(function (down_url) {
                    tempUrl = down_url;
                }, function (err) {
                    reject(err.message);
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
        var images = [];
        return new Promise(function (resolve, reject) {
            if (pics) {
                pics.forEach(function (pic) {
                    _this.uploadPic(pic).then(function (image) {
                        images.push(image);
                        if (images.length == pics.length) {
                            resolve(images);
                        }
                    }).catch(function (err) {
                        reject(err);
                    });
                });
            }
            else {
                reject('No images selected');
                _this.loader.dismiss();
            }
        });
    };
    UploadAndEarnPage.prototype.apartmentUpdateOrInit = function () {
        if (this.existing) {
            this.initialApartUpdate();
        }
        else {
            this.initialApartUpload();
        }
    };
    UploadAndEarnPage.prototype.buildingUpdateOrInit = function () {
        if (this.existing) {
            this.initialBuildinUpdate();
        }
        else {
            this.initialBuildinUpload();
        }
    };
    UploadAndEarnPage.prototype.initialApartUpload = function () {
        var _this = this;
        var ldr = this.loadingCtrl.create();
        ldr.present();
        if (this.apartment.quantity_available > 0) {
            this.apartment.available = true;
        }
        else {
            this.apartment.available = false;
        }
        this.afs.collection('Apartments').add(this.apartment)
            .then(function (apartRef) {
            _this.apartment.apart_id = apartRef.id;
            console.log(_this.apartment);
            console.log(_this.building);
            ldr.dismiss();
        })
            .catch(function (err) {
            ldr.dismiss();
            console.log(_this.apartment);
            console.log(_this.building);
            _this.errHandler.handleError({ message: 'Progress not saved, please check your connection and try again' });
        });
    };
    UploadAndEarnPage.prototype.initialApartUpdate = function () {
        var _this = this;
        var ldr = this.loadingCtrl.create();
        ldr.present();
        if (this.apartment.apart_id != '') {
            this.afs.collection('Apartments').doc(this.apartment.apart_id).set(this.apartment)
                .then(function () {
                console.log(_this.apartment);
                console.log(_this.building);
                ldr.dismiss();
            })
                .catch(function (err) {
                console.log(_this.apartment);
                console.log(_this.building);
                ldr.dismiss();
                _this.errHandler.handleError({ message: 'Progress not saved, please check your connection and try again' });
            });
        }
        else {
            ldr.dismiss();
            this.errHandler.handleError({ message: 'Apartment document not found' });
        }
    };
    UploadAndEarnPage.prototype.initialBuildinUpload = function () {
        var _this = this;
        var ldr = this.loadingCtrl.create();
        ldr.present();
        this.afs.collection('Properties').add(this.building).then(function (buildingRef) {
            console.log('This is the building id: ', buildingRef.id);
            console.log(_this.apartment);
            console.log(_this.building);
            _this.building.prop_id = buildingRef.id;
            ldr.dismiss();
        })
            .catch(function (err) {
            console.log(_this.apartment);
            console.log(_this.building);
            ldr.dismiss();
            _this.errHandler.handleError({ message: 'Progress not saved, please check your connection and try again' });
        });
    };
    UploadAndEarnPage.prototype.initialBuildinUpdate = function () {
        var _this = this;
        var ldr = this.loadingCtrl.create();
        ldr.present();
        this.afs.collection('Properties').doc(this.building.prop_id).set(this.building).then(function () {
            console.log(_this.apartment);
            console.log(_this.building);
            ldr.dismiss();
        })
            .catch(function (err) {
            console.log(_this.apartment);
            console.log(_this.building);
            ldr.dismiss();
            _this.errHandler.handleError({ message: 'Progress not saved, please check your connection and try again' });
        });
    };
    UploadAndEarnPage.prototype.uploadApartPics = function () {
        var _this = this;
        var ldr = this.loadingCtrl.create();
        ldr.present();
        if (this.apartmentImages.length <= 0) {
            this.toast.create({
                position: 'bottom',
                duration: 2000,
                message: 'No apartment images added'
            });
            console.log('No apartment images... ', this.apartmentImages);
            console.log(this.apartment);
            console.log(this.building);
            ldr.dismiss();
            return new Promise(function (resolve, reject) { return resolve(); });
        }
        return this.uploadPics(this.apartmentImages).then(function (images) {
            _this.apartment.images = images;
            ldr.dismiss();
            console.log('Apartment pics uploaded');
            console.log(_this.apartment);
            console.log(_this.building);
        })
            .catch(function (err) {
            ldr.dismiss();
            console.log(_this.apartment);
            console.log(_this.building);
            _this.errHandler.handleError({ message: 'Please check your connection...progress not saved' });
        });
    };
    UploadAndEarnPage.prototype.updateApartmentPics = function (event) {
        console.log('Pics: ', event.target.files);
        console.log(this.apartment);
        console.log(this.building);
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
        console.log(this.apartment);
        console.log(this.building);
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
        var ldr = this.loadingCtrl.create();
        ldr.present();
        if (!(this.propertyImages.length > 0))
            return new Promise(function (resolve, reject) { return resolve(); });
        return new Promise(function (resolve, reject) {
            _this.uploadPics(_this.propertyImages).then(function (images) {
                _this.building.images = images;
                console.log('Building pics uploaded...');
                console.log('Building.prop_id = ', _this.building.prop_id);
                console.log(_this.apartment);
                console.log(_this.building);
                _this.apartment.prop_id = _this.building.prop_id;
                ldr.dismiss();
                resolve();
            })
                .catch(function (err) {
                ldr.dismiss();
                reject(err);
            });
        });
    };
    /*Getting autocomplete predictions from the google maps place predictions service*/
    UploadAndEarnPage.prototype.getPredictionsAdd = function (event) {
        var _this = this;
        //this.loading = true;
        if (event.key === "Backspace" || event.code === "Backspace") {
            setTimeout(function () {
                _this.map_svc.getPlacePredictionsSA(event.target.value).then(function (data) {
                    console.log(data);
                    _this.predictionsAdd = [];
                    _this.predictionsAdd = data;
                    //this.loading = false;
                })
                    .catch(function (err) {
                    _this.errHandler.handleError(err);
                    // this.loading = false;
                });
            }, 3000);
        }
        else {
            this.map_svc.getPlacePredictionsSA(event.target.value).then(function (data) {
                console.log(data);
                _this.predictionsAdd = [];
                _this.predictionsAdd = data;
                //this.loading = false;
            })
                .catch(function (err) {
                _this.errHandler.handleError(err);
                //this.loading = false;
            });
        }
    };
    /*Getting autocomplete predictions from the google maps place predictions service*/
    UploadAndEarnPage.prototype.getPredictionsNby = function (event) {
        var _this = this;
        //this.loading = true;
        if (event.key === "Backspace" || event.code === "Backspace") {
            setTimeout(function () {
                _this.map_svc.getPlacePredictionsSA(event.target.value).then(function (data) {
                    console.log(data);
                    _this.predictionsNby = [];
                    _this.predictionsNby = data;
                    //this.loading = false;
                })
                    .catch(function (err) {
                    _this.errHandler.handleError(err);
                    // this.loading = false;
                });
            }, 3000);
        }
        else {
            this.map_svc.getPlacePredictionsSA(event.target.value).then(function (data) {
                if (data) {
                    console.log(data);
                    _this.predictionsNby = [];
                    _this.predictionsNby = data;
                    //this.loading = false;
                }
                else {
                    //this.loading = false;
                    _this.errHandler.handleError({ message: 'Your internet connection is faulty' });
                }
            })
                .catch(function (err) {
                _this.errHandler.handleError(err);
                //this.loading = false;
            });
        }
    };
    UploadAndEarnPage.prototype.selectPlace = function (place) {
        var _this = this;
        //this.loading = true;
        this.map_svc.getSelectedPlace(place).then(function (data) {
            _this.building.address = data;
            _this.address = data.description;
            _this.predictionsAdd = [];
            //this.loading = false;
        })
            .catch(function (err) {
            _this.errHandler.handleError(err);
            //this.loading = false;
        });
    };
    UploadAndEarnPage.prototype.addNearby = function (nearby) {
        this.building.nearbys.push(nearby);
        this.nearby = '';
        this.predictionsNby = [];
        console.log('added ', nearby);
    };
    UploadAndEarnPage.prototype.successful = function () {
        this.toast.create({
            message: "Apartment successfully uploaded!",
            showCloseButton: true,
            closeButtonText: 'Ok',
            position: 'middle',
            cssClass: 'toast_margins full_width'
        })
            .present().then(function () {
            //this.loading = false;
        });
    };
    UploadAndEarnPage.prototype.deleteNearby = function (nearby) {
        var index = this.building.nearbys.indexOf(nearby);
        if (index !== -1) {
            this.building.nearbys.splice(index, 1);
        }
    };
    __decorate([
        ViewChild(Content),
        __metadata("design:type", Content)
    ], UploadAndEarnPage.prototype, "content", void 0);
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
            ObjectInitProvider,
            LoadingController,
            SearchfeedProvider])
    ], UploadAndEarnPage);
    return UploadAndEarnPage;
}());
export { UploadAndEarnPage };
//# sourceMappingURL=upload-and-earn.js.map