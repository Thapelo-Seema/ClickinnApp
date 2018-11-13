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
import { IonicPage, NavController, NavParams, ModalController, ToastController, AlertController } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
import { Calendar } from '@ionic-native/calendar';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { AngularFirestore } from 'angularfire2/firestore';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
//import { ConfirmationPage } from '../confirmation/confirmation';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { AppointmentsProvider } from '../../providers/appointments/appointments';
import { take } from 'rxjs-compat/operators/take';
var AppointmentPage = /** @class */ (function () {
    function AppointmentPage(navCtrl, navParams, datePicker, calender, confirmtCtrl, storage, toast, afs, errHandler, object_init, appointment_svc, alertCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.datePicker = datePicker;
        this.calender = calender;
        this.confirmtCtrl = confirmtCtrl;
        this.storage = storage;
        this.toast = toast;
        this.afs = afs;
        this.errHandler = errHandler;
        this.object_init = object_init;
        this.appointment_svc = appointment_svc;
        this.alertCtrl = alertCtrl;
        this.myDate = null;
        this.loading = false;
        this.imageLoaded = false;
        this.apartment = this.object_init.initializeApartment();
        this.appointment = this.object_init.initializeAppointment();
        this.user = this.object_init.initializeUser();
        this.loading = true;
        this.storage.getApartment().then(function (data) {
            _this.afs.collection("Apartments").doc(data.apart_id).valueChanges()
                .pipe(take(1))
                .subscribe(function (apartment) {
                _this.storage.getUser().then(function (data) {
                    _this.user = data;
                    _this.appointment.booker_name = data.displayName ? data.displayName : data.firstname;
                    _this.appointment.booker_id = data.uid;
                    _this.appointment.bookerDp = data.photoURL ? data.photoURL : 'assets/imgs/placeholder.png';
                }).then(function () {
                    _this.apartment = apartment;
                    _this.appointment.apart_id = apartment.apart_id;
                    _this.appointment.apart_type = apartment.room_type;
                    _this.appointment.room_type = apartment.room_type;
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
    AppointmentPage.prototype.book = function () {
        this.loading = true;
        this.promptConfirmation();
    };
    AppointmentPage.prototype.promptConfirmation = function () {
        var _this = this;
        var confirm = false;
        var alert = this.alertCtrl.create({
            title: "Confirm intention",
            message: "Are you sure you want to make this appointment and all the details are correct ?",
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
                _this.createCalenderEvent();
                _this.updateAppointmentVals();
                _this.appointment_svc.createBooking(_this.appointment).then(function (data) {
                    _this.appointment.appointment_id = data.id;
                    _this.appointment_svc.updateBooking(_this.appointment);
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
    AppointmentPage.prototype.updateAppointmentVals = function () {
        this.appointment.prop_id = this.apartment.prop_id;
        this.appointment.apart_id = this.apartment.apart_id;
        this.appointment.booker_id = this.user.uid;
        this.appointment.bookerDp = this.user.photoURL ? this.user.photoURL : 'assets/imgs/placeholder.png';
        this.appointment.booker_name = this.user.displayName ? this.user.displayName : this.user.firstname;
        this.appointment.host_id = this.apartment.property.user_id;
        this.appointment.date = this.myDate;
        this.appointment.address = this.apartment.property.address.description;
        this.appointment.apart_dp = this.apartment.dP.url;
        this.appointment.timeStamp = Date.now();
    };
    AppointmentPage.prototype.showDatePicker = function () {
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
    AppointmentPage.prototype.createCalenderEvent = function () {
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
    AppointmentPage.prototype.makeAppointment = function () {
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
    AppointmentPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-appointment',
            templateUrl: 'appointment.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            DatePicker,
            Calendar,
            ModalController,
            LocalDataProvider,
            ToastController,
            AngularFirestore,
            ErrorHandlerProvider,
            ObjectInitProvider,
            AppointmentsProvider,
            AlertController])
    ], AppointmentPage);
    return AppointmentPage;
}());
export { AppointmentPage };
//# sourceMappingURL=appointment.js.map