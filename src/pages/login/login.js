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
import { IonicPage, NavController, AlertController, LoadingController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { FcmProvider } from '../../providers/fcm/fcm';
import { Push } from '@ionic-native/push';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
//import { Thread } from '../../models/thread.interface';
var LoginPage = /** @class */ (function () {
    function LoginPage(navCtrl, afAuth, afs, storage, errHandler, object_init, fcm, alertCtrl, push, toast_svc, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.afAuth = afAuth;
        this.afs = afs;
        this.storage = storage;
        this.errHandler = errHandler;
        this.object_init = object_init;
        this.fcm = fcm;
        this.alertCtrl = alertCtrl;
        this.push = push;
        this.toast_svc = toast_svc;
        this.loadingCtrl = loadingCtrl;
        this.password = '';
        this.loader = this.loadingCtrl.create();
        this.reseting = false;
        this.seeker = this.object_init.initializeUser();
    }
    LoginPage.prototype.signup = function () {
        this.navCtrl.push('SignupPage');
    };
    LoginPage.prototype.onNotifications = function () {
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
    LoginPage.prototype.signin = function () {
        var _this = this;
        this.loader.present();
        this.afAuth.auth.signInWithEmailAndPassword(this.seeker.email, this.password).then(function (firebaseUser) {
            //console.log('firebaseUser: ', firebaseUser);
            _this.afs.collection('Users').doc("" + firebaseUser.user.uid).valueChanges().subscribe(function (data) {
                //console.log('ClickinnUser: ', data);
                _this.seeker = data;
                _this.storage.setUser(data).then(function () {
                    //console.log('CurrentUser: ', this.seeker)
                    _this.navCtrl.setRoot('WelcomePage').then(function () { return _this.loader.dismiss(); });
                    _this.onNotifications();
                })
                    .catch(function (err) {
                    _this.errHandler.handleError(err);
                    _this.loader.dismiss();
                });
            }, function (err) {
                _this.errHandler.handleError(err);
                _this.loader.dismiss();
            });
        })
            .catch(function (err) {
            _this.errHandler.handleError(err);
            _this.loader.dismiss();
        });
    };
    LoginPage.prototype.resetPassword = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'Reset password',
            message: 'Forgot your password ? do not worry, please enter your email below and we will send a reset link to your email',
            inputs: [{
                    name: 'email',
                    placeholder: 'Email adress',
                    type: 'text'
                }],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Reset',
                    handler: function (data) {
                        _this.reseting = true;
                        _this.afAuth.auth.sendPasswordResetEmail(data.email)
                            .then(function () {
                            _this.reseting = false;
                            _this.toast_svc.showToast('Your password reset link has been sent to your email.');
                        })
                            .catch(function (err) {
                            _this.reseting = false;
                            _this.errHandler.handleError(err);
                        });
                    }
                }
            ]
        });
        alert.present();
    };
    LoginPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-login',
            templateUrl: 'login.html',
        }),
        __metadata("design:paramtypes", [NavController,
            AngularFireAuth,
            AngularFirestore,
            LocalDataProvider,
            ErrorHandlerProvider,
            ObjectInitProvider,
            FcmProvider,
            AlertController,
            Push,
            ToastSvcProvider,
            LoadingController])
    ], LoginPage);
    return LoginPage;
}());
export { LoginPage };
//# sourceMappingURL=login.js.map