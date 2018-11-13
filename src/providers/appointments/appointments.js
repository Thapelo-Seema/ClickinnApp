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
var AppointmentsProvider = /** @class */ (function () {
    function AppointmentsProvider(afstorage, object_init) {
        this.afstorage = afstorage;
        this.object_init = object_init;
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
    AppointmentsProvider.prototype.getHostBookings = function (uid) {
        return this.afstorage.collection('Viewings', function (ref) {
            return ref.where('host_id', '==', uid)
                .orderBy('timeStamp', 'desc');
        }).valueChanges();
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
    AppointmentsProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [AngularFirestore, ObjectInitProvider])
    ], AppointmentsProvider);
    return AppointmentsProvider;
}());
export { AppointmentsProvider };
//# sourceMappingURL=appointments.js.map