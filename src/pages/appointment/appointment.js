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
import { IonicPage, NavController, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
import { Calendar } from '@ionic-native/calendar';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { AppointmentsProvider } from '../../providers/appointments/appointments';
import { take } from 'rxjs-compat/operators/take';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
/* This page handles the process of the accommodation seeker making an appointment to view an accommodation */
var AppointmentPage = /** @class */ (function () {
    function AppointmentPage(navCtrl, datePicker, calender, storage, toast, errHandler, object_init, appointment_svc, accom_svc, alertCtrl, loadingCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.datePicker = datePicker;
        this.calender = calender;
        this.storage = storage;
        this.toast = toast;
        this.errHandler = errHandler;
        this.object_init = object_init;
        this.appointment_svc = appointment_svc;
        this.accom_svc = accom_svc;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.myDate = null;
        this.loader = this.loadingCtrl.create();
        this.imageLoaded = false;
        this.loader.present();
        this.apartment = this.object_init.initializeApartment(); //Initialize an empty apartment object
        this.appointment = this.object_init.initializeAppointment(); //Initialize an empty appointment object
        this.user = this.object_init.initializeUser(); //Initialize an empty user object
        /*
          Retrieving the cached apartment and pulling an updated version of it from the firestore database
        */
        this.storage.getApartment().then(function (cachedApart) {
            _this.accom_svc.getApartmentById(cachedApart.apart_id)
                .pipe(take(1))
                .subscribe(function (apartment) {
                _this.storage.getUser().then(function (user) {
                    _this.user = _this.object_init.initializeUser2(user); //Populating the user
                    //Populating some fields in the appointment object
                    _this.appointment.booker_name = user.displayName ? user.displayName : user.firstname;
                    _this.appointment.booker_id = user.uid;
                    _this.appointment.bookerDp = user.photoURL ? user.photoURL : 'assets/imgs/placeholder.png';
                }).then(function () {
                    //Populating more fields in the appointment object
                    _this.imageLoaded = true;
                    _this.apartment = _this.object_init.initializeApartment2(apartment); //Populating the apartment
                    _this.appointment.apart_id = apartment.apart_id;
                    _this.appointment.apart_type = apartment.room_type;
                    _this.appointment.room_type = apartment.room_type;
                    _this.loader.dismiss();
                })
                    .catch(function (err) {
                    _this.loader.dismiss();
                    _this.errHandler.handleError(err);
                });
            }, function (err) {
                _this.loader.dismiss();
                _this.errHandler.handleError(err);
            });
        }).catch(function (err) {
            _this.errHandler.handleError(err);
            _this.loader.dismiss();
        });
    }
    /* This function prompts the user to confirm the appointment and creates the appointment on the database if granted */
    AppointmentPage.prototype.book = function () {
        var _this = this;
        var ldr = this.loadingCtrl.create();
        ldr.present();
        var confirm = false;
        var alert = this.alertCtrl.create({
            title: "Make Appointment",
            message: "Are you sure you want to make this appointment and all the details are correct ?",
            buttons: [
                {
                    text: 'Yes Make Appointment',
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
                    _this.appointment_svc.updateBooking(_this.appointment)
                        .then(function () {
                        _this.loader.dismiss();
                        _this.toast.create({
                            message: "Appointment successfully created",
                            showCloseButton: true,
                            closeButtonText: 'Ok',
                            position: 'middle',
                            cssClass: 'toast_margins full_width'
                        }).present();
                    })
                        .catch(function (err) {
                        ldr.dismiss();
                        _this.errHandler.handleError(err);
                    });
                }).catch(function (err) {
                    ldr.dismiss();
                    _this.errHandler.handleError(err);
                });
            }
            else {
                ldr.dismiss();
                _this.toast.create({
                    message: "Appointment cancelled",
                    showCloseButton: true,
                    closeButtonText: 'Ok',
                    position: 'middle',
                    cssClass: 'toast_margins full_width'
                }).present();
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
        this.appointment.timeStampModified = Date.now();
    };
    /*This method handles the presenting of the native android date-time app and saves the date in myDate */
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
        });
    };
    /* This method takes the value of myDate and writes a custom calender event to an android fone */
    AppointmentPage.prototype.createCalenderEvent = function () {
        var _this = this;
        this.calender.hasReadWritePermission().then(function (permission) {
            _this.calender.createEvent('Clickinn Viewing Appointment', _this.returnFirstTwo(_this.apartment.property.address.description), "You requested to view the " + _this.apartment.room_type + " at " + _this.returnFirstTwo(_this.apartment.property.address.description) + ".", new Date(), _this.myDate);
        }, function (denied) {
            _this.calender.requestReadWritePermission().then(function (approved) {
                _this.calender.createEvent('Clickinn Viewing Appointment', _this.returnFirstTwo(_this.apartment.property.address.description), "You requested to view the " + _this.apartment.room_type + " at " + _this.returnFirstTwo(_this.apartment.property.address.description) + ".", new Date(), _this.myDate);
            }, function (err) {
                _this.errHandler.handleError(err);
            });
        })
            .catch(function (err) {
            _this.errHandler.handleError(err);
        });
    };
    /* This function delegates the tasks of showing the date-time picker and creating the calender event once the datePicker closes */
    AppointmentPage.prototype.makeAppointment = function () {
        var _this = this;
        this.showDatePicker().then(function () {
            if (_this.myDate)
                _this.book();
        })
            .catch(function (err) {
            _this.errHandler.handleError(err);
        });
    };
    //This helper function returns the first two strings in a comma delimited string array
    AppointmentPage.prototype.returnFirstTwo = function (input) {
        if (input == undefined)
            return '';
        return input.split(',')[0] + ', ' + input.split(',')[1];
    };
    AppointmentPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-appointment',
            templateUrl: 'appointment.html',
        }),
        __metadata("design:paramtypes", [NavController,
            DatePicker,
            Calendar,
            LocalDataProvider,
            ToastController,
            ErrorHandlerProvider,
            ObjectInitProvider,
            AppointmentsProvider,
            AccommodationsProvider,
            AlertController,
            LoadingController])
    ], AppointmentPage);
    return AppointmentPage;
}());
export { AppointmentPage };
//# sourceMappingURL=appointment.js.map