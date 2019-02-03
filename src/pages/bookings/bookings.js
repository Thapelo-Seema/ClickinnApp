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
//import { Observable } from 'rxjs-compat';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import { Calendar } from '@ionic-native/calendar';
var BookingsPage = /** @class */ (function () {
    function BookingsPage(navCtrl, navParams, appt_svc, object_init, storage, toast_svc, modal, accom_svc, calender, errHandler, platform, alertCtrl) {
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
        this.loadingMore = true;
        this.done = false;
        this.role = '';
        this.bookingsSub = null;
        this.noBookings = false;
        this.imagesLoaded = [false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false
        ];
        //Subscription to the loading boolean observable in the appointments service
        this.loadingSub = this.appt_svc.loading.subscribe(function (data) {
            _this.loadingMore = data;
        });
        //Subscription to the done boolean observable in the appointments service
        this.doneSub = this.appt_svc.done.subscribe(function (data) {
            _this.done = data;
            if (data == true)
                _this.loadingMore = false;
        });
        this.user = this.object_init.initializeUser(); //Initializing an empty user object
        /* Getting the cached user */
        this.storage.getUser().then(function (user) {
            _this.user = _this.object_init.initializeUser2(user); //Populating the user
            /*
              If user in the Landlords/agents appointments interface we only fetch the appointments made for the current users adverts,
              otherwise we fetch the appointments that the current user made to view other apartments
            */
            if (_this.navCtrl.parent != null || _this.navParams.get('selectedTab')) {
                _this.appt_svc.initHostBookings(user.uid);
                _this.role = 'landlord';
                //Perform a once-off subscription to check if data was properly loaded and handle the result appropriately
                _this.bookingsSub = _this.appt_svc.getHostBookings(user.uid)
                    .subscribe(function (data) {
                    /*
                      If we get an array of bookings from this request, populate the corresponding imagesLoaded array
                    */
                    if (data.length > 0) {
                        data.forEach(function (dat) {
                            /* Populate an array of booleans which inidcate the 'loaded status' of each picture in an array of pictures being downloaded*/
                            _this.imagesLoaded.push(false);
                        });
                    }
                    else {
                        _this.noBookings = true;
                        //this.toast_svc.showToast('There are currently no appointments to show for your property/s');
                    }
                }, function (err) {
                    _this.toast_svc.showToast(err.message);
                });
            }
            else {
                _this.appt_svc.initUserBookings(user.uid);
                _this.role = 'user';
                _this.bookingsSub = _this.appt_svc.getUserBookings(user.uid)
                    .subscribe(function (data) {
                    console.log(data);
                    if (data.length > 0) {
                    }
                    else {
                        _this.noBookings = true;
                        //this.toast_svc.showToast('There are no appointments to show for your profile');
                    }
                }, function (err) {
                    _this.errHandler.handleError(err);
                });
            }
        })
            .catch(function (err) {
            _this.errHandler.handleError(err);
        });
    }
    /*Unsubscribe from all subscriptions when leaving the page*/
    BookingsPage.prototype.ionViewWillLeave = function () {
        this.doneSub.unsubscribe();
        this.loadingSub.unsubscribe();
        this.bookingsSub.unsubscribe();
        this.appt_svc.reset();
    };
    BookingsPage.prototype.ionViewDidLoad = function () {
        this.monitorEnd();
    };
    /*Check if scrolling has reached the bottom of the page and fetch more data */
    BookingsPage.prototype.monitorEnd = function () {
        var _this = this;
        //console.log('Content scrollHeight = ', this.content.scrollHeight)
        this.content.ionScrollEnd.subscribe(function (ev) {
            var height = ev.scrollElement.scrollHeight;
            var top = ev.scrollElement.scrollTop;
            var offset = ev.scrollElement.offsetHeight;
            if (top > height - offset - 1) {
                if (_this.role == 'user') {
                    _this.appt_svc.moreUserBookings(_this.user.uid);
                }
                else if (_this.role == 'landlord') {
                    _this.appt_svc.moreHostBookings(_this.user.uid);
                }
            }
        });
    };
    /*getProperty(prop_id){
      let property: any = null;
        this.accom_svc.getPropertyById(prop_id).pipe(take(1)).subscribe(prop =>{
          property = prop;
        })
      return property;
    }*/
    /* This method handles the declining of an appointment and updates the database if the user confirms the decline */
    BookingsPage.prototype.declineBooking = function (appointment) {
        var _this = this;
        var app = appointment;
        app.timeStampModified = Date.now();
        app.host_declines = true;
        app.host_confirms = false;
        app.seeker_cancels = false;
        var confirm = false;
        var alert = this.alertCtrl.create({
            title: "Delcine Appointment",
            message: "Are you sure you want to decline this viewing appointment ?",
            buttons: [
                {
                    text: 'Yes decline',
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
                    .catch(function (err) {
                    _this.errHandler.handleError(err);
                });
            }
            else {
                _this.toast_svc.showToast('Viewing appointment NOT declined.');
            }
        });
    };
    /* This method handles the confirming of an appointment and updates the database */
    BookingsPage.prototype.confirmBooking = function (appointment) {
        var _this = this;
        var app = appointment;
        app.timeStampModified = Date.now();
        app.host_confirms = true;
        app.host_declines = false;
        app.seeker_cancels = false;
        var confirm = false;
        var alert = this.alertCtrl.create({
            title: "ACCEPT APPOINTMENT",
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
                    .catch(function (err) {
                    _this.errHandler.handleError(err);
                });
            }
            else {
                _this.toast_svc.showToast('You did NOT confirm this viewing appointment.');
            }
        });
    };
    /* This method handles the cancellation of an appointment and updates the database */
    BookingsPage.prototype.seekerCancel = function (appointment) {
        var _this = this;
        var app = appointment;
        app.timeStampModified = Date.now();
        app.seeker_cancels = true;
        app.host_confirms = false;
        app.host_declines = false;
        var confirm = false;
        var alert = this.alertCtrl.create({
            title: "CANCEL APPOINTMENT",
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
                    .catch(function (err) {
                    _this.errHandler.handleError(err);
                });
            }
            else {
                _this.toast_svc.showToast('Viewing appointment NOT cancelled.');
            }
        });
    };
    /*
      This method handles sending a message from an appointment context and caches a to-object
      that represents the recipient of the message
    */
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
    /*This method creates a calender event to remind the landlord/agent about the appointment they have accepted*/
    BookingsPage.prototype.createCalenderEvent = function (appointment) {
        var _this = this;
        var dateVal = appointment.date;
        var date2Val = dateVal;
        /*
          Firestrore returns dates as a firebase.firestore.Timestamp which is an object of seconds and nanoseconds
          this needs to be re-cast into a date object so that the calender can handle it
        */
        console.log('About to create an event for: ', date2Val.toDate());
        this.calender.hasReadWritePermission().then(function (permission) {
            _this.calender.createEvent('Clickinn Viewing Appointment', appointment.address, "You have agreed to show the " + appointment.room_type + " at " + appointment.address + ".", new Date(), date2Val.toDate())
                .then(function (val) { return _this.toast_svc.showToast('Reminder created for this appointment'); })
                .catch(function (err) {
                _this.errHandler.handleError(err);
            });
        }, function (denied) {
            _this.toast_svc.showToast('Access denied but creating an alarm again...');
            _this.calender.requestReadWritePermission().then(function (approved) {
                _this.calender.createEvent('Clickinn Viewing Appointment', appointment.address, "You have agreed to show the " + appointment.room_type + " at " + appointment.address + ".", new Date(), date2Val.toDate());
            }, function (err) {
                _this.errHandler.handleError(err);
            });
        })
            .catch(function (err) {
            _this.errHandler.handleError(err);
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
            AlertController])
    ], BookingsPage);
    return BookingsPage;
}());
export { BookingsPage };
//# sourceMappingURL=bookings.js.map