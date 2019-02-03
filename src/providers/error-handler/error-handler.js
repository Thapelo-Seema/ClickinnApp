var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
/*
  Generated class for the ErrorHandlerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var ErrorHandlerProvider = /** @class */ (function () {
    function ErrorHandlerProvider(http, toast) {
        this.http = http;
        this.toast = toast;
    }
    ErrorHandlerProvider.prototype.handleError = function (err) {
        console.log(err);
        //this.loading = false;
        this.toast.create({
            message: err.message,
            showCloseButton: true,
            closeButtonText: 'Ok',
            position: 'middle',
            cssClass: 'toast_margins full_width'
        }).present();
    };
    ErrorHandlerProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, ToastController])
    ], ErrorHandlerProvider);
    return ErrorHandlerProvider;
}());
export { ErrorHandlerProvider };
//# sourceMappingURL=error-handler.js.map