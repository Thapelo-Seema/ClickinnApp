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
import { Platform, ToastController, AlertController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { LocalDataProvider } from '../providers/local-data/local-data';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { ErrorHandlerProvider } from '../providers/error-handler/error-handler';
import { FcmProvider } from '../providers/fcm/fcm';
import { ObjectInitProvider } from '../providers/object-init/object-init';
import { take } from 'rxjs-compat/operators/take';
import { Push } from '@ionic-native/push';
import { DepositProvider } from '../providers/deposit/deposit';
import { Network } from '@ionic-native/network';
var MyApp = /** @class */ (function () {
    //Check network status
    //if connected check authState
    //if authenticated --> sync user data
    //if user tenant -->home
    //else if seeker --> welcome
    //else -->login
    //if not connected
    //if local user object
    //if tenant -->home
    //else if seeker -->welcome
    //else --> login
    function MyApp(storage, afs, afAuth, platform, errHandler, fcm, toastCtrl, object_init, statusBar, splashScreen, push, alertCtrl, deposit_svc, network) {
        var _this = this;
        this.storage = storage;
        this.afs = afs;
        this.afAuth = afAuth;
        this.platform = platform;
        this.errHandler = errHandler;
        this.fcm = fcm;
        this.toastCtrl = toastCtrl;
        this.object_init = object_init;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.push = push;
        this.alertCtrl = alertCtrl;
        this.deposit_svc = deposit_svc;
        this.network = network;
        this.loading = true;
        this.online = false;
        this.dpLoaded = false;
        this.notificationObject = null;
        this.loading = true;
        //Check for platform readiness before doing anything
        this.platform.ready()
            .then(function () {
            console.log('platform ready');
            //firestore required setting
            afs.firestore.settings({ timestampsInSnapshots: true });
            _this.initializeUser();
            //this.initializeApp();
        })
            .then(function () { return _this.monitorAuthState(); })
            .then(function () {
            _this.monitorConnectionState();
            _this.monitorOfflineState();
        })
            .catch(function (err) {
            _this.errHandler.handleError(err);
            _this.loading = false;
        });
    }
    //Navigate to the users profile
    MyApp.prototype.gotoProfile = function () {
        var _this = this;
        this.loading = true;
        this.navCtrl.push('ProfilePage').then(function () {
            _this.loading = false;
        });
    };
    MyApp.prototype.gotoAgentDash = function () {
        this.loading = true;
        this.navCtrl.push('AgentDashboardPage');
        this.loading = false;
    };
    MyApp.prototype.gotoBursaryDash = function () {
        this.loading = true;
        this.navCtrl.push('BursaryPlacementsPage');
        this.loading = false;
    };
    MyApp.prototype.gotoCaretakerDash = function () {
        this.loading = true;
        this.navCtrl.push('CaretakerManagerDashboardPage');
        this.loading = false;
    };
    MyApp.prototype.gotoLandlordDash = function () {
        var _this = this;
        this.loading = true;
        this.storage.setUserType('Landlord')
            .then(function (val) {
            _this.navCtrl.push('LandlordDashboardPage');
            _this.loading = false;
        });
    };
    MyApp.prototype.gotoChats = function () {
        this.loading = true;
        this.navCtrl.push('ChatsPage');
        this.loading = false;
    };
    MyApp.prototype.gotoBookings = function () {
        this.loading = true;
        this.navCtrl.push('BookingsPage');
        this.loading = false;
    };
    //Change the users authState, remove the users local copy
    MyApp.prototype.logout = function () {
        var _this = this;
        this.afAuth.auth.signOut().then(function () {
            _this.navCtrl.setRoot('LoginPage');
        });
    };
    //Navigate to the upload and earn page
    MyApp.prototype.uploadAndEarn = function () {
        this.navCtrl.push('UploadAndEarnPage');
    };
    //Function that handles notifications
    MyApp.prototype.initNotifications = function () {
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
        pushObject.on('notification').subscribe(function (notification) {
            // alert(notification.additionalData.deposit_id) 
            if (_this.notificationObject !== null) {
                if (!_this.compareNotification(notification, _this.notificationObject)) {
                    _this.notificationObject = notification;
                    if (notification.additionalData.foreground) {
                        // if application open, show popup
                        var notifAlert_1 = _this.alertCtrl.create({
                            title: notification.title,
                            message: notification.message,
                            cssClass: "notification",
                            buttons: [{
                                    text: 'View',
                                    role: 'cancel',
                                    handler: function () {
                                        //TODO: Your logic here
                                        _this.routeToNotificationSource(notification.additionalData.key_code, notification.additionalData.thread_id, notification.additionalData.deposit_id);
                                    }
                                }]
                        });
                        notifAlert_1.present();
                        setTimeout(function () {
                            notifAlert_1.dismiss();
                        }, 5000);
                    }
                    else {
                        //if user NOT using app and push notification comes - NOT working, redirect to default rootPage
                        _this.routeToNotificationSource(notification.additionalData.key_code, notification.additionalData.thread_id, notification.additionalData.deposit_id);
                    }
                }
            }
            else {
                _this.notificationObject = notification;
                if (notification.additionalData.foreground) {
                    // if application open, show popup
                    var notifAlert = _this.alertCtrl.create({
                        title: notification.title,
                        message: notification.message,
                        cssClass: "notification",
                        buttons: [{
                                text: 'View',
                                role: 'cancel',
                                handler: function () {
                                    //TODO: Your logic here
                                    _this.routeToNotificationSource(notification.additionalData.key_code, notification.additionalData.thread_id, notification.additionalData.deposit_id);
                                }
                            }]
                    });
                    notifAlert.present();
                }
                else {
                    //if user NOT using app and push notification comes - NOT working, redirect to default rootPage
                    _this.routeToNotificationSource(notification.additionalData.key_code, notification.additionalData.thread_id, notification.additionalData.deposit_id);
                }
            }
        });
        pushObject.on('registration').subscribe(function (registration) {
            _this.fcm.saveTokenToFirestore(registration.registrationId);
        });
        pushObject.on('error').subscribe(function (error) { return console.log(error); });
    };
    MyApp.prototype.routeToNotificationSource = function (key_code, thread_id, deposit_id) {
        switch (key_code) {
            case "new_message":
                this.gotoThread(thread_id);
                break;
            case "seeker_appointment":
                this.gotoHostBookings();
                break;
            case "host_confirmed":
                this.gotoBookings();
                break;
            case "host_declined":
                this.gotoBookings();
                break;
            case "seeker_cancelled":
                this.gotoHostBookings();
                break;
            case "agent_deposit_goAhead":
                this.gotoSeekerConfirmDeposit(deposit_id);
                break;
            case "host_accept_deposit":
                this.gotoHostAcceptDeposit(deposit_id);
                break;
            case "clickinn_confirmed_deposit":
                this.gotoDepositInfo(deposit_id, key_code);
                break;
            case "tenant_confirmed_deposit":
                this.gotoDepositInfo(deposit_id, key_code);
                break;
            case "tenant_cancelled_deposit":
                this.gotoDepositInfo(deposit_id, key_code);
                break;
            case "agent_confirmed_deposit":
                this.gotoDepositInfo(deposit_id, key_code);
                break;
        }
    };
    MyApp.prototype.compareNotification = function (noti1, noti2) {
        if ((noti1.title == noti2.title) &&
            (noti1.message == noti2.message) &&
            (noti1.additionalData.key_code == noti2.additionalData.key_code))
            return true;
        else
            return false;
    };
    MyApp.prototype.gotoHostAcceptDeposit = function (deposit_id) {
        var _this = this;
        this.storage.setTransactionState({ type: 'host_accept_deposit', id: deposit_id })
            .then(function (dat) {
            _this.navCtrl.push('DepositConfirmationPage');
        });
    };
    MyApp.prototype.gotoSeekerConfirmDeposit = function (deposit_id) {
        var _this = this;
        this.storage.setTransactionState({ type: 'seeker_confirm_deposit', id: deposit_id })
            .then(function (dat) {
            _this.navCtrl.push('DepositConfirmationPage');
        });
    };
    MyApp.prototype.gotoDepositInfo = function (deposit_id, code) {
        var _this = this;
        var message = '';
        var title = '';
        this.deposit_svc.getDepositById(deposit_id)
            .pipe(take(1))
            .subscribe(function (dep) {
            switch (code) {
                case "clickinn_confirmed_deposit":
                    message = "Clickinn has confirmed payment of " + dep.apartment.deposit + " for the " + dep.apartment.room_type + " by " + dep.by.firstname + ".";
                    title = 'Deposit payment confirmation';
                    break;
                case "tenant_confirmed_deposit":
                    message = dep.by.firstname + " confirmed a deposit payment of " + dep.apartment.deposit + " for the " + dep.apartment.room_type + ", please await confirmation of reciept from Clickinn and ALLOW the tenant to move in once you've recieved confirmation.";
                    title = 'Deposit payment claim';
                    break;
                case "tenant_cancelled_deposit":
                    message = dep.by.firstname + " cancelled the deposit payment of " + dep.apartment.deposit + " for the " + dep.apartment.room_type + ".";
                    title = 'Deposit payment cancellation';
                    break;
                case "agent_confirmed_deposit":
                    message = "Your deposit for the " + dep.apartment.room_type + " at " + dep.apartment.property.address.description + " has been confirmed. You can chat with the landlord for further move-in arrangements.";
                    title = 'Deposit payment recieved';
                    break;
            }
            var notifAlert = _this.alertCtrl.create({
                title: title,
                message: message,
                cssClass: "notification",
                buttons: [{
                        text: 'View',
                        role: 'cancel',
                    }]
            });
            notifAlert.present();
        });
    };
    MyApp.prototype.gotoThread = function (thread_id) {
        var _this = this;
        var thread = {
            uid: '',
            thread_id: thread_id,
            dp: '',
            displayName: ''
        };
        this.storage.setThread(thread).then(function (val) {
            _this.navCtrl.push('ChatThreadPage', thread);
        })
            .catch(function (err) { return console.log(err); });
    };
    MyApp.prototype.gotoHostBookings = function () {
        this.loading = true;
        this.navCtrl.push('BookingsPage', { selectedTab: 2 });
        this.loading = false;
    };
    //Navigates the user their appropriate homepage at startup
    MyApp.prototype.navigateUser = function (user) {
        if (user.user_type) { //check i user_type property exists in user
            switch (user.user_type) {
                case 'seeker': {
                    //Navigate to welcome page
                    this.rootPage = 'WelcomePage';
                    break;
                }
                case 'host': {
                    //Navigate to host dashboard
                    this.rootPage = 'WelcomePage';
                    break;
                }
                case 'support': {
                    //Navigate to support interface
                    this.rootPage = 'WelcomePage';
                    break;
                }
                case 'tenant': {
                    //Navigate to home
                    this.rootPage = 'WelcomePage';
                    break;
                }
                case 'Thapelo': {
                    //Navigate to master
                    this.rootPage = 'WelcomePage';
                    break;
                }
            }
        }
        else {
            //Navigate to welcome page
            this.rootPage = 'WelcomePage';
        }
        this.appViewReady();
    };
    //Check for authState and sync user data if possible
    MyApp.prototype.initializeAuthenticatedUser = function () {
        var _this = this;
        if (this.afAuth.auth.currentUser) {
            this.afs.collection('Users').doc(this.afAuth.auth.currentUser.uid).valueChanges()
                .subscribe(function (user) {
                if (user) {
                    _this.user = user;
                    _this.storage.setUser(user)
                        .then(function () {
                        _this.navigateUser(user);
                        _this.initNotifications();
                        _this.loading = false;
                        return;
                    })
                        .catch(function (err) {
                        _this.errHandler.handleError({ errCode: 'SET_OFFLINE_USER', message: "Error caching user" });
                        _this.loading = false;
                        return;
                    });
                }
            });
        }
        else {
            this.rootPage = 'LoginPage';
            this.loading = false;
            this.appViewReady();
            return;
        }
    };
    //If user device is offline check for a local copy of the user and navigate user apporopriately
    MyApp.prototype.InitializeOfflineUser = function () {
        var _this = this;
        this.storage.getUser().then(function (user) {
            if (user) {
                _this.user = user;
                _this.navigateUser(user);
                _this.initNotifications();
                _this.loading = false;
            }
            else {
                _this.rootPage = 'LoginPage';
                _this.appViewReady();
                _this.loading = false;
                return;
            }
        }).catch(function (err) {
            _this.errHandler.handleError({ errCode: 'GET_OFFLINE_USER', message: 'Error initializing offline user' });
            _this.loading = false;
            return;
        });
    };
    MyApp.prototype.syncAuthenticatedUser = function () {
        var _this = this;
        if (this.afAuth.auth.currentUser) {
            this.afs.collection('Users').doc(this.afAuth.auth.currentUser.uid).valueChanges()
                .subscribe(function (user) {
                if (user) {
                    _this.user = user;
                    _this.storage.setUser(user)
                        .then(function () {
                        _this.loading = false;
                        return;
                    })
                        .catch(function (err) {
                        _this.errHandler.handleError({ errCode: 'SET_OFFLINE_USER', message: "Error persisting offline user" });
                        _this.loading = false;
                        return;
                    });
                }
            });
        }
    };
    MyApp.prototype.monitorAuthState = function () {
        var _this = this;
        this.authState = this.afAuth.authState
            .subscribe(function (user) {
            console.log('MonitorAuthState running....');
            if (user || _this.afAuth.auth.currentUser) {
                console.log('Firebase user found...');
                if (_this.platform.is('cordova')) {
                    console.log('on mobile device...');
                    if (window.navigator.onLine) { //If there is a network connection
                        console.log('Connected!');
                        _this.online = true;
                        _this.initializeAuthenticatedUser();
                    }
                    else {
                        console.log('offline');
                        _this.online = false;
                        //Atleast check if there's a cached user otherwise only show login page
                        _this.InitializeOfflineUser();
                    }
                }
                else {
                    console.log('On browser');
                    if (window.navigator.onLine) {
                        console.log('connected');
                        _this.online = true;
                        _this.initializeAuthenticatedUser();
                    }
                    else {
                        //check for cached otherwise take to login page
                        console.log('offline');
                        _this.online = false;
                        _this.InitializeOfflineUser();
                    }
                }
            }
            else if (user == null) {
                _this.navCtrl.setRoot('LoginPage');
                _this.appViewReady();
                _this.loading = false;
            }
            else {
                _this.navCtrl.setRoot('LoginPage');
                _this.appViewReady();
                _this.loading = false;
                console.log('I dunno');
            }
        });
    };
    MyApp.prototype.gotoLiked = function () {
        this.navCtrl.push('FavouritesPage');
    };
    MyApp.prototype.appViewReady = function () {
        if (this.platform.is('cordova')) {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        }
    };
    //Update the offine user data when an internet connection is established
    MyApp.prototype.monitorConnectionState = function () {
        var _this = this;
        console.log('MonitorConnectionState running....');
        window.addEventListener('online', function () {
            if (!_this.online) {
                _this.online = true;
                _this.showToast('You are back online!');
            }
            _this.afs.firestore.enableNetwork().then(function () {
                _this.syncAuthenticatedUser();
            })
                .catch(function (err) { return console.log(err); });
        });
    };
    MyApp.prototype.monitorOfflineState = function () {
        var _this = this;
        console.log('MonitorConnectionState running....');
        window.addEventListener('offline', function () {
            _this.online = false;
            _this.showToast('You are offline...');
            _this.afs.firestore.disableNetwork()
                .catch(function (err) { return console.log(err); });
        });
    };
    MyApp.prototype.initializeUser = function () {
        this.user = this.object_init.initializeUser();
    };
    MyApp.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000
        });
        toast.present();
    };
    __decorate([
        ViewChild('content'),
        __metadata("design:type", Object)
    ], MyApp.prototype, "navCtrl", void 0);
    MyApp = __decorate([
        Component({
            templateUrl: 'app.html'
        }),
        __metadata("design:paramtypes", [LocalDataProvider,
            AngularFirestore,
            AngularFireAuth,
            Platform,
            ErrorHandlerProvider,
            FcmProvider,
            ToastController,
            ObjectInitProvider,
            StatusBar,
            SplashScreen,
            Push,
            AlertController,
            DepositProvider,
            Network])
    ], MyApp);
    return MyApp;
}());
export { MyApp };
//# sourceMappingURL=app.component.js.map