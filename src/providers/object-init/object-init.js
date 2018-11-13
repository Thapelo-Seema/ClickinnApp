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
import { AngularFireAuth } from 'angularfire2/auth';
var ObjectInitProvider = /** @class */ (function () {
    function ObjectInitProvider(afAuth) {
        this.afAuth = afAuth;
        this.uid = '';
        if (this.afAuth.auth.currentUser) {
            this.uid = this.afAuth.auth.currentUser.uid;
        }
    }
    ObjectInitProvider.prototype.initializeDeposit = function () {
        var deposit = {
            agent_goAhead: false,
            time_initiated: null,
            time_agent_confirm: null,
            time_clickinn_confirm: null,
            time_tenant_confirmed: null,
            tenant_confirmed: false,
            agent_confirmed: false,
            clickinn_confirmed: false,
            clickinn_cancel: false,
            to: { firstname: '', lastname: '', dp: '', uid: '' },
            by: { firstname: '', lastname: '', dp: '', uid: '' },
            apartment: this.initializeApartment(),
            id: '',
            currency: 'ZAR',
            transaction_closed: false,
            tenant_refund_request: false,
            landlord_credit: 0,
            ref: ''
        };
        return deposit;
    };
    ObjectInitProvider.prototype.initializeChatMessage = function () {
        var message = {
            by: { displayName: '', dp: '', uid: '' },
            to: { displayName: '', dp: '', uid: '' },
            timeStamp: 0,
            sent: false,
            read: false,
            recieved: false,
            text: '',
            topic: ''
        };
        return message;
    };
    ObjectInitProvider.prototype.initializeChatMessageInComp = function (user, host) {
        var message = {
            by: { displayName: user.displayName, dp: user.photoURL, uid: user.uid },
            to: { displayName: host.displayName, dp: host.photoURL, uid: host.uid },
            timeStamp: 0,
            sent: false,
            read: false,
            recieved: false,
            text: '',
            topic: ''
        };
        return message;
    };
    ObjectInitProvider.prototype.initializeSearch = function () {
        var search = {
            apartment_type: 'Any',
            nsfas: false,
            parking: false,
            laundry: false,
            wifi: false,
            maxPrice: 0,
            minPrice: 0,
            Address: this.initializeAddress(),
            timeStamp: 0,
            searcher_id: this.uid,
            searcher_name: '',
            nearby: '',
            other: '',
            searcher_dp: ''
        };
        return search;
    };
    ObjectInitProvider.prototype.initializeAddress = function () {
        var address = {
            administrative_area_level_1_lng: '',
            administrative_area_level_2_lng: '',
            administrative_area_level_1_short: '',
            administrative_area_level_2_short: '',
            country_long: '',
            country_short: '',
            description: '',
            lat: 0,
            lng: 0,
            locality_short: '',
            locality_lng: '',
            name: '',
            sublocality_short: '',
            sublocality_lng: '',
            vicinity: ''
        };
        return address;
    };
    ObjectInitProvider.prototype.initializeDuration = function () {
        var duration = {
            text: '',
            value: 0
        };
        return duration;
    };
    ObjectInitProvider.prototype.initializeLatLng = function () {
        var latlng = {
            lat: 0,
            lng: 0
        };
        return latlng;
    };
    ObjectInitProvider.prototype.initializeLocation = function () {
        var location = {
            lat: 0,
            lng: 0,
            details: ''
        };
        return location;
    };
    ObjectInitProvider.prototype.initializeApartment = function () {
        var apartment = {
            available: true,
            dP: this.initializeImage(),
            deposit: 0,
            description: '',
            apart_id: '',
            images: [this.initializeImage()],
            occupiedBy: this.initializeTenant(),
            price: 0,
            prop_id: '',
            property: this.initializeProperty(),
            room_type: '',
            search_rating: 0,
            type: '',
            timeStamp: 0
        };
        return apartment;
    };
    ObjectInitProvider.prototype.initializeImage = function () {
        var image = {
            name: '',
            path: '',
            progress: 0,
            url: ''
        };
        return image;
    };
    ObjectInitProvider.prototype.initializeProperty = function () {
        var property = {
            address: this.initializeAddress(),
            prop_id: '',
            common: '',
            dP: this.initializeImage(),
            images: [this.initializeImage()],
            laundry: false,
            nsfas: false,
            wifi: false,
            parking: false,
            prepaid_elec: false,
            timeStamp: 0,
            user_id: '',
            nearbys: ['Clickinn Offices']
        };
        return property;
    };
    ObjectInitProvider.prototype.initializeProperty2 = function (prop) {
        var property = {
            address: prop.address ? prop.address : this.initializeAddress(),
            prop_id: prop.prop_id ? prop.prop_id : '',
            common: prop.common ? prop.common : '',
            dP: prop.dP ? prop.dP : this.initializeImage(),
            images: prop.images ? prop.images : [this.initializeImage()],
            laundry: prop.laundry,
            nsfas: prop.nsfas,
            wifi: prop.wifi,
            parking: prop.parking,
            prepaid_elec: prop.prepaid_elec,
            timeStamp: prop.timeStamp ? prop.timeStamp : 0,
            user_id: prop.user_id ? prop.user_id : '',
            nearbys: prop.nearbys ? prop.nearbys : ['Clickinn Offices']
        };
        return property;
    };
    ObjectInitProvider.prototype.initializeUser = function () {
        var user = {
            displayName: '',
            firstname: '',
            lastname: '',
            liked_apartments: [],
            user_type: '',
            email: '',
            fcm_token: '',
            is_host: false,
            phoneNumber: '',
            photoURL: '',
            rating: '1',
            status: false,
            threads: [''],
            uid: this.uid,
            occupation: '',
            age: 0,
            dob: new Date(),
            id_no: '',
            gender: ''
        };
        return user;
    };
    ObjectInitProvider.prototype.initializeUser2 = function (userIn) {
        var user = {
            displayName: userIn.displayName ? userIn.displayName : '',
            firstname: userIn.firstname ? userIn.firstname : '',
            lastname: userIn.lastname ? userIn.lastname : '',
            liked_apartments: userIn.liked_apartments ? userIn.liked_apartments : [],
            user_type: userIn.user_type ? userIn.user_type : '',
            email: userIn.email ? userIn.email : '',
            fcm_token: userIn.fcm_token ? userIn.fcm_token : '',
            is_host: userIn.is_host ? userIn.is_host : false,
            phoneNumber: userIn.phoneNumber ? userIn.phoneNumber : '',
            photoURL: userIn.photoURL ? userIn.photoURL : 'assets/imgs/placeholder.png',
            rating: userIn.rating ? userIn.rating : '',
            status: userIn.status ? userIn.status : false,
            threads: userIn.threads ? userIn.threads : [],
            uid: userIn.uid,
            occupation: userIn.occupation ? userIn.occupation : '',
            age: userIn.age ? userIn.age : 0,
            dob: userIn.dob ? userIn.dob : new Date(),
            id_no: userIn.id_no ? userIn.id_no : '',
            gender: userIn.gender ? userIn.gender : ''
        };
        return user;
    };
    ObjectInitProvider.prototype.initializeSeeker = function () {
        var seeker = {
            firstname: '',
            lastname: '',
            uid: this.uid,
            age: 0,
            occupation: '',
            cellphone: '',
            email: '',
            rating: 0
        };
        return seeker;
    };
    ObjectInitProvider.prototype.initializeTenant = function () {
        var tenant = {
            profile: this.initializeUser(),
            address: this.initializeAddress(),
            reviews: [{ comment: '', reviewer_id: '', reviewer_name: '' }]
        };
        return tenant;
    };
    ObjectInitProvider.prototype.initializeAppointment = function () {
        var appointment = {
            date: new Date(),
            appointment_id: '',
            booker_id: this.uid,
            prop_id: '',
            apart_id: '',
            apart_dp: '',
            host_id: '',
            host_confirms: false,
            host_declines: false,
            seeker_cancels: false,
            timeStamp: 0,
            address: '',
            room_type: ''
        };
        return appointment;
    };
    ObjectInitProvider.prototype.initializeAppointment2 = function (ap) {
        var appointment = {
            date: ap.date ? ap.date : new Date(),
            appointment_id: ap.appointment_id ? ap.appointment_id : '',
            booker_id: ap.booker_id ? ap.booker_id : this.uid,
            prop_id: ap.prop_id ? ap.prop_id : '',
            apart_id: ap.apart_id ? ap.apart_id : '',
            host_id: ap.host_id ? ap.host_id : '',
            host_confirms: ap.host_confirms ? ap.host_confirms : false,
            host_declines: ap.host_declines ? ap.host_declines : false,
            seeker_cancels: ap.seeker_cancels ? ap.seeker_cancels : false,
            timeStamp: ap.timeStamp ? ap.timeStamp : 0,
            address: ap.address ? ap.address : '',
            room_type: ap.room_type ? ap.room_type : '',
            apart_dp: ap.apart_dp ? ap.apart_dp : ''
        };
        return appointment;
    };
    ObjectInitProvider.prototype.initializeFileUpload = function () {
        var fileUpload = {
            file: null,
            url: '',
            name: '',
            progress: 0,
            path: ''
        };
        return fileUpload;
    };
    ObjectInitProvider.prototype.initializeMarkerOptions = function () {
        var options = {
            position: this.initializeLatLng(),
            title: '',
            icon: null,
            label: null,
            map: null
        };
        return options;
    };
    ObjectInitProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [AngularFireAuth])
    ], ObjectInitProvider);
    return ObjectInitProvider;
}());
export { ObjectInitProvider };
//# sourceMappingURL=object-init.js.map