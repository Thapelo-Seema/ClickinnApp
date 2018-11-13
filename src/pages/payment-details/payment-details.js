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
import { IonicPage, NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { Calendar } from '@ionic-native/calendar';
import { AngularFirestore } from 'angularfire2/firestore';
//import { ConfirmationPage } from '../confirmation/confirmation';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
/**
 * Generated class for the PaymentDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var PaymentDetailsPage = /** @class */ (function () {
    function PaymentDetailsPage(navCtrl, navParams, datePicker, confirmCtrl, storage, toast, errHandler, calender, afs, object_init) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.datePicker = datePicker;
        this.confirmCtrl = confirmCtrl;
        this.storage = storage;
        this.toast = toast;
        this.errHandler = errHandler;
        this.calender = calender;
        this.afs = afs;
        this.object_init = object_init;
        this.bank = '';
        this.payment_method = '';
        this.myDate = null;
        this.refference = '';
        this.loading = false;
        this.apartment = this.object_init.initializeApartment();
        this.appointment = this.object_init.initializeAppointment();
        this.user = this.object_init.initializeUser();
        this.payment_method = this.navParams.get('payment_method');
        this.loading = true;
        this.storage.getApartment().then(function (data) {
            _this.afs.collection("Apartments").doc(data.apart_id).valueChanges().subscribe(function (apartment) {
                _this.storage.getUser().then(function (data) { return _this.user = data; }).then(function () {
                    _this.apartment = apartment;
                    _this.loading = false;
                });
            }, function (err) {
                _this.errHandler.handleError(err);
                _this.loading = false;
            });
        }).catch(function (err) {
            _this.errHandler.handleError(err);
            _this.loading = false;
        });
    }
    PaymentDetailsPage.prototype.generateRef = function () {
    };
    PaymentDetailsPage.prototype.pay = function () {
    };
    PaymentDetailsPage.prototype.showWarnig = function (title, message) {
        var myData = {
            title: title,
            message: message
        };
        var warningModal = this.confirmCtrl.create('AlertPage', { data: myData });
        warningModal.present();
    };
    PaymentDetailsPage.prototype.handleError = function (err) {
        console.log(err.message);
        this.loading = true;
        this.toast.create({
            message: err.message,
            showCloseButton: true,
            closeButtonText: 'Ok',
            position: 'top',
            cssClass: 'toast_margins full_width'
        }).present();
    };
    PaymentDetailsPage.prototype.book = function () {
        this.loading = true;
        this.promptConfirmation();
    };
    PaymentDetailsPage.prototype.promptConfirmation = function () {
        var _this = this;
        var myData = {
            title: "Confirm appointment",
            message: "Please confirm that your viewing appointment details are correct"
        };
        var warningModal = this.confirmCtrl.create('ConfirmationPage', { data: myData });
        warningModal.present();
        warningModal.onDidDismiss(function (data) {
            if (data == true) {
                _this.makeAppointment();
                _this.updateAppointmentVals();
                _this.afs.collection('Viewings').add(_this.appointment).then(function (data) {
                    _this.toast.create({
                        message: "Appointment successfully created",
                        showCloseButton: true,
                        closeButtonText: 'Ok',
                        position: 'middle',
                        cssClass: 'toast_margins full_width'
                    }).present();
                    _this.loading = false;
                }).catch(function (err) {
                    _this.errHandler.handleError(err);
                    _this.loading = false;
                });
            }
            else {
                _this.toast.create({
                    message: "Appointment cancelled",
                    showCloseButton: true,
                    closeButtonText: 'Ok',
                    position: 'middle',
                    cssClass: 'toast_margins full_width'
                }).present();
                _this.loading = false;
            }
        });
    };
    PaymentDetailsPage.prototype.updateAppointmentVals = function () {
        this.appointment.prop_id = this.apartment.prop_id;
        this.appointment.apart_id = this.apartment.apart_id;
        this.appointment.booker_id = this.user.uid;
        this.appointment.host_id = this.apartment.property.user_id;
        this.appointment.date = this.myDate;
        this.appointment.timeStamp = Date.now();
    };
    PaymentDetailsPage.prototype.showDatePicker = function () {
        var _this = this;
        return this.datePicker.show({
            date: new Date(),
            mode: 'datetime',
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
        })
            .then(function (date) {
            _this.myDate = date;
        })
            .catch(function (err) {
            _this.errHandler.handleError(err);
            _this.loading = false;
        });
    };
    PaymentDetailsPage.prototype.createCalenderEvent = function () {
        var _this = this;
        this.calender.hasReadWritePermission().then(function (permission) {
            _this.calender.createEvent('Clickinn Viewing Appointment', _this.apartment.property.address.sublocality_lng, "You requested to view the " + _this.apartment.room_type + " at " + _this.apartment.property.address.description + ".", new Date(), _this.myDate);
        }, function (denied) {
            _this.calender.requestReadWritePermission().then(function (approved) {
                _this.calender.createEvent('Clickinn Viewing Appointment', _this.apartment.property.address.sublocality_lng, "You requested to view the " + _this.apartment.room_type + " at " + _this.apartment.property.address.description + ".", new Date(), _this.myDate);
            }, function (err) {
                _this.errHandler.handleError(err);
                _this.loading = false;
            });
        })
            .catch(function (err) {
            _this.errHandler.handleError(err);
            _this.loading = false;
        });
    };
    PaymentDetailsPage.prototype.makeAppointment = function () {
        var _this = this;
        this.showDatePicker().then(function () {
            if (_this.myDate)
                _this.createCalenderEvent();
        })
            .catch(function (err) {
            _this.errHandler.handleError(err);
            _this.loading = false;
        });
    };
    PaymentDetailsPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-payment-details',
            templateUrl: 'payment-details.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, DatePicker,
            ModalController, LocalDataProvider, ToastController,
            ErrorHandlerProvider, Calendar, AngularFirestore,
            ObjectInitProvider])
    ], PaymentDetailsPage);
    return PaymentDetailsPage;
}());
export { PaymentDetailsPage };
//# sourceMappingURL=payment-details.js.map