var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { LocalDataProvider } from '../local-data/local-data';
var FcmProvider = /** @class */ (function () {
    function FcmProvider(platform, db, local_db) {
        this.platform = platform;
        this.db = db;
        this.local_db = local_db;
    }
    FcmProvider.prototype.saveTokenToFirestore = function (token) {
        var _this = this;
        if (!token)
            return;
        return this.local_db.getUser().then(function (user) {
            if (!user)
                return;
            else if (user) {
                var obj = {
                    token: token,
                    uid: user.uid
                };
                return _this.db.collection('Tokens').doc(token).set(obj);
            }
        });
    };
    FcmProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Platform,
            AngularFirestore,
            LocalDataProvider])
    ], FcmProvider);
    return FcmProvider;
}());
export { FcmProvider };
//# sourceMappingURL=fcm.js.map