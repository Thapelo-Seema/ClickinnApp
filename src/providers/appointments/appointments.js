var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { AngularFirestore } from 'angularfire2/firestore';
//import 'rxjs/add/operator/merge';
//import 'rxjs/add/operator/take';
import { take } from 'rxjs-compat/operators/take';
import { ObjectInitProvider } from '../object-init/object-init';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/take';
var AppointmentsProvider = /** @class */ (function () {
    function AppointmentsProvider(afstorage, object_init) {
        this.afstorage = afstorage;
        this.object_init = object_init;
        this._done = new BehaviorSubject(false);
        this._loading = new BehaviorSubject(false);
        this._data = new BehaviorSubject([]);
        this.done = this._done.asObservable();
        this.loading = this._loading.asObservable();
    }
    AppointmentsProvider.prototype.createBooking = function (appointment) {
        return this.afstorage.collection('Viewings').add(appointment);
    };
    AppointmentsProvider.prototype.getUserBookings = function (uid) {
        return this.afstorage.collection('Viewings', function (ref) {
            return ref.where('booker_id', '==', uid)
                .orderBy('timeStamp', 'desc');
        }).valueChanges();
    };
    AppointmentsProvider.prototype.getUserUnseen = function (uid) {
        return this.afstorage.collection('Viewings', function (ref) {
            return ref.where('booker_id', '==', uid)
                .where('seen', '==', false);
        }).valueChanges();
    };
    AppointmentsProvider.prototype.initUserBookings = function (uid) {
        console.log('Init user bookings...');
        var first = this.afstorage.collection('Viewings', function (ref) {
            return ref.where('booker_id', '==', uid)
                .orderBy('timeStamp', 'desc')
                .limit(10);
        });
        this.mapAndUpdate(first);
        this.data = this._data.asObservable()
            .scan(function (acc, val) {
            return acc.concat(val);
        });
    };
    AppointmentsProvider.prototype.moreUserBookings = function (uid) {
        var cursor = this.getCursor();
        var more = this.afstorage.collection('Viewings', function (ref) {
            return ref.where('booker_id', '==', uid)
                .orderBy('timeStamp', 'desc')
                .limit(10)
                .startAfter(cursor);
        });
        this.mapAndUpdate(more);
    };
    AppointmentsProvider.prototype.getHostBookings = function (uid) {
        return this.afstorage.collection('Viewings', function (ref) {
            return ref.where('host_id', '==', uid)
                .orderBy('timeStamp', 'desc');
        }).valueChanges();
    };
    AppointmentsProvider.prototype.getUnseenHostBookings = function (uid) {
        return this.afstorage.collection('Viewings', function (ref) {
            return ref.where('host_id', '==', uid)
                .where('seen', '==', false);
        }).valueChanges();
    };
    AppointmentsProvider.prototype.initHostBookings = function (uid) {
        console.log('Init host bookings...');
        var first = this.afstorage.collection('Viewings', function (ref) {
            return ref.where('host_id', '==', uid)
                .orderBy('timeStamp', 'desc')
                .limit(10);
        });
        this.mapAndUpdate(first);
        this.data = this._data.asObservable()
            .scan(function (acc, val) {
            return acc.concat(val);
        });
    };
    AppointmentsProvider.prototype.moreHostBookings = function (uid) {
        var cursor = this.getCursor();
        var more = this.afstorage.collection('Viewings', function (ref) {
            return ref.where('host_id', '==', uid)
                .orderBy('timeStamp', 'desc')
                .limit(10)
                .startAfter(cursor);
        });
        this.mapAndUpdate(more);
    };
    AppointmentsProvider.prototype.cancelBooking = function (appointment) {
        return this.afstorage.collection('Viewings').doc(appointment.appointment_id).set(appointment);
    };
    AppointmentsProvider.prototype.confirmBooking = function (appointment) {
        return this.afstorage.collection('Viewings').doc(appointment.appointment_id).set(appointment);
    };
    AppointmentsProvider.prototype.seekerCancel = function (appointment) {
        return this.afstorage.collection('Viewings').doc(appointment.appointment_id).set(appointment);
    };
    AppointmentsProvider.prototype.updateBooking = function (appointment) {
        return this.afstorage.collection('Viewings').doc(appointment.appointment_id).set(appointment);
    };
    AppointmentsProvider.prototype.adjustBookings = function () {
        var _this = this;
        this.afstorage.collection('Viewings')
            .snapshotChanges()
            .pipe(take(1))
            .subscribe(function (data) {
            data.forEach(function (data1) {
                var appointment = _this.object_init.initializeAppointment2(data1.payload.doc.data());
                appointment.appointment_id = data1.payload.doc.id;
                _this.afstorage.collection('Viewings').doc(data1.payload.doc.id).set(appointment);
            });
        });
    };
    AppointmentsProvider.prototype.reset = function () {
        console.log('reseting...');
        this._data.next([]);
        this._done.next(false);
    };
    // Determines the doc snapshot to paginate query 
    AppointmentsProvider.prototype.getCursor = function () {
        var current = this._data.value;
        if (current.length) {
            return current[current.length - 1].doc;
        }
        return null;
    };
    // Maps the snapshot to usable format the updates source
    AppointmentsProvider.prototype.mapAndUpdate = function (col) {
        var _this = this;
        if (this._done.value || this._loading.value) {
            return;
        }
        ;
        // loading
        this._loading.next(true);
        // Map snapshot with doc ref (needed for cursor)
        return col.snapshotChanges()
            .do(function (arr) {
            var values = arr.map(function (snap) {
                var data = snap.payload.doc.data();
                var doc = snap.payload.doc;
                return __assign({}, data, { doc: doc });
            });
            // update source with new values, done loading
            _this._data.next(values);
            _this._loading.next(false);
            console.log('_data: ', _this._data.value);
            console.log('data: ', _this.data);
            console.log('mapAndUpdate running...');
            // no more values, mark done
            if (!values.length) {
                console.log('done!');
                _this._done.next(true);
            }
        })
            .take(1)
            .subscribe();
    };
    AppointmentsProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [AngularFirestore,
            ObjectInitProvider])
    ], AppointmentsProvider);
    return AppointmentsProvider;
}());
export { AppointmentsProvider };
//# sourceMappingURL=appointments.js.map