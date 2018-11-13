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
import { IonicPage, NavController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { FcmProvider } from '../../providers/fcm/fcm';
import { Push } from '@ionic-native/push';
//import { Thread } from '../../models/thread.interface';
var SignupPage = /** @class */ (function () {
    function SignupPage(navCtrl, afs, afAuth, storage, errHandler, object_init, fcm, 
    //private platform: Platform,
    push) {
        this.navCtrl = navCtrl;
        this.afs = afs;
        this.afAuth = afAuth;
        this.storage = storage;
        this.errHandler = errHandler;
        this.object_init = object_init;
        this.fcm = fcm;
        this.push = push;
        this.loading = false;
        this.seeker = this.object_init.initializeUser();
    }
    SignupPage.prototype.signup = function () {
        var _this = this;
        this.loading = true;
        this.afAuth.auth.createUserWithEmailAndPassword(this.seeker.email, this.password)
            .then(function (data) {
            _this.seeker.uid = data.user.uid;
            _this.seeker.displayName = _this.seeker.firstname + ' ' + _this.seeker.lastname;
            if (_this.seeker.uid !== '') {
                _this.persistUser(data.user.uid);
            }
            else {
                _this.loading = false;
                _this.errHandler.handleError({
                    code: 'no uid',
                    message: 'Something went wrong, please try again'
                });
            }
        })
            .catch(function (err) {
            _this.errHandler.handleError(err);
            _this.loading = false;
        });
    };
    SignupPage.prototype.signin = function () {
        this.navCtrl.setRoot('LoginPage');
    };
    SignupPage.prototype.onNotifications = function () {
        var _this = this;
        var options = {
            android: {
                senderID: '882290923419'
            },
            ios: {
                alert: 'true',
                badge: true,
                sound: 'false'
            },
            windows: {},
            browser: {
                pushServiceURL: 'http://push.api.phonegap.com/v1/push'
            }
        };
        var pushObject = this.push.init(options);
        pushObject.on('registration').subscribe(function (registration) {
            _this.fcm.saveTokenToFirestore(registration.registrationId);
        });
        pushObject.on('error').subscribe(function (error) { return alert(error); });
    };
    SignupPage.prototype.persistUser = function (uid) {
        var _this = this;
        if (this.seeker.uid !== '') {
            this.afs.collection('Users').doc(uid).set(this.seeker)
                .then(function () {
                //alert('stored in collection!');
                _this.storage.setUser(_this.seeker).then(function (val) {
                    // alert('local storage!');
                    _this.navCtrl.setRoot('WelcomePage').then(function () {
                        _this.loading = false;
                        _this.onNotifications();
                    })
                        .catch(function (err) {
                        _this.errHandler.handleError(err);
                        _this.loading = false;
                    });
                })
                    .catch(function (err) {
                    _this.errHandler.handleError(err);
                    _this.loading = false;
                });
            })
                .catch(function (err) {
                _this.errHandler.handleError(err);
                _this.loading = false;
            });
        }
    };
    SignupPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-signup',
            templateUrl: 'signup.html',
        }),
        __metadata("design:paramtypes", [NavController,
            AngularFirestore,
            AngularFireAuth,
            LocalDataProvider,
            ErrorHandlerProvider,
            ObjectInitProvider,
            FcmProvider,
            Push])
    ], SignupPage);
    return SignupPage;
}());
export { SignupPage };
//# sourceMappingURL=signup.js.map