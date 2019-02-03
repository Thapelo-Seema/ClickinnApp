var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { AngularFireStorage } from 'angularfire2/storage';
import { Injectable } from '@angular/core';
import { ErrorHandlerProvider } from '../error-handler/error-handler';
/*
  Generated class for the FileUploadSvcProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var FileUploadSvcProvider = /** @class */ (function () {
    function FileUploadSvcProvider(afstorage, errHandler) {
        this.afstorage = afstorage;
        this.errHandler = errHandler;
        this.loading = false;
        console.log('Hello FileUploadSvcProvider Provider');
    }
    FileUploadSvcProvider.prototype.uploadPic = function (image) {
        var _this = this;
        var storageRef = this.afstorage.ref(image.path + "/" + image.name);
        var uploadTask = storageRef.putString(image.file, 'data_url');
        return new Promise(function (resolve, reject) {
            uploadTask.snapshotChanges().subscribe(function (snapshot) {
                //update the progress property of the upload object
                uploadTask.percentageChanges().subscribe(function (progress) {
                    image.progress = progress;
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
                        path: image.path,
                        loaded: false
                    };
                    resolve(image_out);
                });
            });
        });
    };
    FileUploadSvcProvider.prototype.uploadPics = function (pics) {
        var _this = this;
        var images = [];
        return new Promise(function (resolve, reject) {
            if (pics) {
                pics.forEach(function (pic) {
                    _this.uploadPic(pic).then(function (image) { return images.push(image); }).catch(function (err) {
                        _this.errHandler.handleError(err);
                        _this.loading = false;
                    });
                    if (images.length == pics.length) {
                        resolve(images);
                    }
                });
            }
            else {
                reject('No images selected');
            }
        });
    };
    FileUploadSvcProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [AngularFireStorage,
            ErrorHandlerProvider])
    ], FileUploadSvcProvider);
    return FileUploadSvcProvider;
}());
export { FileUploadSvcProvider };
//# sourceMappingURL=file-upload-svc.js.map