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
import { IonicPage, NavController, NavParams, ModalController, Platform, AlertController, Content } from 'ionic-angular';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { AppointmentsProvider } from '../../providers/appointments/appointments';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
//import { MessageInputPopupPage } from '../message-input-popup/message-input-popup';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import { Calendar } from '@ionic-native/calendar';
import { PaginationProvider } from '../../providers/pagination/pagination';
var BookingsPage = /** @class */ (function () {
    function BookingsPage(navCtrl, navParams, appt_svc, object_init, storage, toast_svc, modal, accom_svc, calender, errHandler, platform, alertCtrl, page) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.appt_svc = appt_svc;
        this.object_init = object_init;
        this.storage = storage;
        this.toast_svc = toast_svc;
        this.modal = modal;
        this.accom_svc = accom_svc;
        this.calender = calender;
        this.errHandler = errHandler;
        this.platform = platform;
        this.alertCtrl = alertCtrl;
        this.page = page;
        this.appointments = null;
        this.loading = false;
        this.role = '';
        this.bookingsSub = null;
        this.imagesLoaded = [false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false
        ];
        this.loading = true;
        this.user = this.object_init.initializeUser();
        this.storage.getUser().then(function (user) {
            console.log('cached user: ', user);
            _this.user = user;
            if (_this.navCtrl.parent != null) { //This means you're in the Landlords/agents appointments interface
                _this.appointments = null;
                _this.appointments = _this.appt_svc.getHostBookings(user.uid);
                _this.page.init('Viewings', 'timeStamp', { limit: 10, prepend: false, reverse: true });
                _this.role = 'landlord';
                //Perform a once-off subscription to check if data was properly loaded and handle the result appropriately
                _this.bookingsSub = _this.appt_svc.getHostBookings(user.uid)
                    .subscribe(function (data) {
                    console.log(data);
                    if (data.length > 0) {
                        data.forEach(function (dat) {
                            _this.imagesLoaded.push(false);
                        });
                        _this.loading = false;
                    }
                    else {
                        _this.toast_svc.showToast('You are offline OR There are no appointments to show for your property/s');
                        _this.loading = false;
                    }
                });
            }
            else if (_this.navParams.get('selectedTab')) {
                console.log(navParams);
                _this.appointments = null;
                _this.appointments = _this.appt_svc.getHostBookings(user.uid);
                _this.role = 'landlord';
                //Perform a once-off subscription to check if data was properly loaded and handle the result appropriately
                _this.bookingsSub = _this.appt_svc.getHostBookings(user.uid)
                    .subscribe(function (data) {
                    console.log(data);
                    if (data.length > 0) {
                        _this.loading = false;
                    }
                    else {
                        _this.toast_svc.showToast('You are offline OR There are no appointments to show for your property/s');
                        _this.loading = false;
                    }
                });
            }
            else {
                _this.appointments = null;
                _this.appointments = _this.appt_svc.getUserBookings(user.uid);
                _this.role = 'user';
                _this.bookingsSub = _this.appt_svc.getUserBookings(user.uid)
                    .subscribe(function (data) {
                    console.log(data);
                    if (data.length > 0) {
                        _this.loading = false;
                    }
                    else {
                        _this.toast_svc.showToast('You are offline OR There are no appointments to show for your profile');
                        _this.loading = false;
                    }
                });
            }
        });
    }
    BookingsPage.prototype.ionViewDidLeave = function () {
        this.bookingsSub.unsubscribe();
    };
    BookingsPage.prototype.monitorEnd = function () {
        var _this = this;
        //console.log('Content scrollHeight = ', this.content.scrollHeight)
        this.content.ionScrollEnd.subscribe(function (ev) {
            var height = ev.scrollElement.scrollHeight;
            var top = ev.scrollElement.scrollTop;
            var offset = ev.scrollElement.offsetHeight;
            if (top > height - offset - 1) {
                console.log('bottom');
                _this.page.more();
            }
        });
    };
    BookingsPage.prototype.getProperty = function (prop_id) {
        var property = null;
        this.accom_svc.getPropertyById(prop_id).subscribe(function (prop) {
            property = prop;
        });
        return property;
    };
    BookingsPage.prototype.declineBooking = function (appointment) {
        var _this = this;
        var app = appointment;
        app.host_declines = true;
        app.host_confirms = false;
        app.seeker_cancels = false;
        var confirm = false;
        var alert = this.alertCtrl.create({
            title: "Decline appointment",
            message: "Are you sure you want to decline this viewing appointment ?",
            buttons: [
                {
                    text: 'Yes cancel',
                    handler: function (data) {
                        confirm = true;
                    }
                },
                {
                    role: 'cancel',
                    text: 'Not sure',
                    handler: function (data) {
                        confirm = false;
                    }
                }
            ]
        });
        alert.present();
        alert.onDidDismiss(function (data) {
            if (confirm) {
                _this.appt_svc.cancelBooking(app)
                    .then(function () {
                    _this.toast_svc.showToast('You have declined this viewing appointment.');
                })
                    .catch(function (err) { return console.log(err); });
            }
            else {
                _this.toast_svc.showToast('Viewing appointment NOT declined.');
            }
        });
    };
    BookingsPage.prototype.confirmBooking = function (appointment) {
        var _this = this;
        var app = appointment;
        app.host_confirms = true;
        app.host_declines = false;
        app.seeker_cancels = false;
        var confirm = false;
        var alert = this.alertCtrl.create({
            title: "Confirm appointment",
            message: "Are you sure you want to accept this booking ?",
            buttons: [
                {
                    text: 'Accept',
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
                _this.appt_svc.confirmBooking(app)
                    .then(function () {
                    if (_this.platform.is('cordova')) {
                        //this.toast_svc.showToast("Platform is cordova so we're creating an alarm...");
                        _this.createCalenderEvent(app);
                    }
                    _this.toast_svc.showToast('You have confirmed this viewing appointment.');
                })
                    .catch(function (err) { return console.log(err); });
            }
            else {
                _this.toast_svc.showToast('You did NOT confirm this viewing appointment.');
            }
        });
    };
    BookingsPage.prototype.seekerCancel = function (appointment) {
        var _this = this;
        var app = appointment;
        app.seeker_cancels = true;
        app.host_confirms = false;
        app.host_declines = false;
        var confirm = false;
        var alert = this.alertCtrl.create({
            title: "Cancel appointment",
            message: "Are you sure you want to cancel this appointment ?",
            buttons: [
                {
                    text: 'Yes cancel',
                    handler: function (data) {
                        confirm = true;
                    }
                },
                {
                    role: 'cancel',
                    text: 'Not sure',
                    handler: function (data) {
                        confirm = false;
                    }
                }
            ]
        });
        alert.present();
        alert.onDidDismiss(function (data) {
            if (confirm) {
                _this.appt_svc.cancelBooking(app)
                    .then(function () {
                    _this.toast_svc.showToast('You have cancelled this booking and the advertiser will no longer be expecting you.');
                })
                    .catch(function (err) { return console.log(err); });
            }
            else {
                _this.toast_svc.showToast('Viewing appointment NOT cancelled.');
            }
        });
    };
    BookingsPage.prototype.showInput = function (appointment) {
        var _this = this;
        var to;
        if (this.role == 'landlord') {
            to = {
                uid: appointment.booker_id,
                dp: appointment.bookerDp,
                name: appointment.booker_name ? appointment.booker_name : '',
                topic: "Regarding your appointment to see the " + appointment.room_type + " in " + appointment.address
            };
        }
        else if (this.role == 'user') {
            to = {
                uid: appointment.host_id,
                dp: appointment.apart_dp,
                name: appointment.host_name ? appointment.host_name : '',
                topic: "Regarding the appointment to see the " + appointment.room_type + " at " + appointment.address
            };
        }
        this.storage.setMessageDetails(to).then(function (val) {
            _this.modal.create('MessageInputPopupPage', to).present();
        });
    };
    BookingsPage.prototype.createCalenderEvent = function (appointment) {
        var _this = this;
        var dateVal = appointment.date;
        var date2Val = dateVal;
        console.log('About to create an event for: ', date2Val.toDate());
        this.calender.hasReadWritePermission().then(function (permission) {
            _this.calender.createEvent('Clickinn Viewing Appointment', '', "You have agreed to show the " + appointment.room_type + " at " + appointment.address + ".", new Date(), date2Val.toDate())
                .then(function (val) { return _this.toast_svc.showToast('Reminder created for this appointment'); })
                .catch(function (err) { return console.log(err); });
        }, function (denied) {
            _this.toast_svc.showToast('Access denied but creating an alarm again...');
            _this.calender.requestReadWritePermission().then(function (approved) {
                _this.calender.createEvent('Clickinn Viewing Appointment', '', "You have agreed to show the " + appointment.room_type + " at " + appointment.address + ".", new Date(), date2Val.toDate());
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
    __decorate([
        ViewChild(Content),
        __metadata("design:type", Content)
    ], BookingsPage.prototype, "content", void 0);
    BookingsPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-bookings',
            templateUrl: 'bookings.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            AppointmentsProvider,
            ObjectInitProvider,
            LocalDataProvider,
            ToastSvcProvider,
            ModalController,
            AccommodationsProvider,
            Calendar,
            ErrorHandlerProvider,
            Platform,
            AlertController,
            PaginationProvider])
    ], BookingsPage);
    return BookingsPage;
}());
export { BookingsPage };
//# sourceMappingURL=bookings.js.map