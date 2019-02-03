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
            time_agent_confirm: 0,
            time_clickinn_confirm: 0,
            time_tenant_confirmed: 0,
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
            ref: '',
            bank: '',
            account_holder: '',
            account_number: '',
            branch_code: '',
            tenantMovedIn: false,
            timeStampModified: 0,
            seen: false
        };
        return deposit;
    };
    ObjectInitProvider.prototype.initializeDeposit2 = function (dep) {
        var deposit = {
            agent_goAhead: dep.agent_goAhead,
            time_initiated: dep.time_initiated ? dep.time_initiated : null,
            time_agent_confirm: dep.time_agent_confirm ? dep.time_agent_confirm : 0,
            time_clickinn_confirm: dep.time_clickinn_confirm ? dep.time_clickinn_confirm : 0,
            time_tenant_confirmed: dep.time_tenant_confirmed ? dep.time_tenant_confirmed : 0,
            tenant_confirmed: dep.tenant_confirmed,
            agent_confirmed: dep.agent_confirmed,
            clickinn_confirmed: dep.clickinn_confirmed,
            clickinn_cancel: dep.clickinn_cancel,
            to: dep.to,
            by: dep.by,
            apartment: dep.apartment,
            id: dep.id ? dep.id : '',
            currency: dep.currency ? dep.currency : 'ZAR',
            transaction_closed: dep.transaction_closed,
            tenant_refund_request: dep.tenant_refund_request,
            landlord_credit: dep.landlord_credit ? dep.landlord_credit : 0,
            ref: dep.ref ? dep.ref : '',
            bank: dep.bank ? dep.bank : '',
            account_holder: dep.account_holder ? dep.account_holder : '',
            account_number: dep.account_number ? dep.account_number : '',
            branch_code: dep.branch_code ? dep.branch_code : '',
            tenantMovedIn: dep.tenantMovedIn != undefined ? dep.tenantMovedIn : false,
            timeStampModified: dep.timeStampModified ? dep.timeStampModified : 0,
            seen: dep.seen != undefined ? dep.seen : false
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
            topic: '',
            id: '',
            seen: false,
            attachment: null
        };
        return message;
    };
    ObjectInitProvider.prototype.initializeChatMessag2 = function (msg) {
        var message = {
            by: msg.by ? msg.by : { displayName: '', dp: '', uid: '' },
            to: msg.to ? msg.to : { displayName: '', dp: '', uid: '' },
            timeStamp: msg.timeStamp ? msg.timeStamp : 0,
            sent: msg.sent != undefined ? msg.sent : false,
            read: msg.read ? msg.read : false,
            recieved: msg.recieved != undefined ? msg.recieved : false,
            text: msg.text ? msg.text : '',
            topic: msg.topic ? msg.topic : '',
            id: msg.id ? msg.id : '',
            seen: msg.seen != undefined ? msg.seen : false,
            attachment: msg.attachment ? msg.attachment : null
        };
        return message;
    };
    ObjectInitProvider.prototype.initializeSupportMessage = function () {
        var message = {
            user: { displayName: '', dp: '', uid: '' },
            assigned_to: { displayName: '', dp: '', uid: '' },
            timeStamp: 0,
            sent: false,
            solved: false,
            recieved: false,
            text: '',
            issue_type: '',
            id: ''
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
            images: [],
            occupiedBy: this.initializeTenant(),
            price: 0,
            prop_id: '',
            property: this.initializeProperty(),
            room_type: '',
            search_rating: 0,
            type: '',
            timeStamp: 0,
            user_id: '',
            complete: false,
            timeStampModified: 0,
            quantity_available: 1,
            by: '',
            owner: ''
        };
        return apartment;
    };
    ObjectInitProvider.prototype.initializeApartment2 = function (apart) {
        var apartment = {
            available: apart.available != undefined ? apart.available : true,
            dP: apart.dP ? apart.dP : this.initializeImage(),
            deposit: apart.deposit ? apart.deposit : 0,
            description: apart.description,
            apart_id: apart.apart_id ? apart.apart_id : '',
            images: apart.images ? apart.images : [this.initializeImage()],
            occupiedBy: apart.occupiedBy ? apart.occupiedBy : this.initializeTenant(),
            price: apart.price ? apart.price : 0,
            prop_id: apart.prop_id ? apart.prop_id : '',
            property: apart.property ? apart.property : this.initializeProperty(),
            room_type: apart.room_type ? apart.room_type : '',
            search_rating: apart.search_rating ? apart.search_rating : 0,
            type: apart.type ? apart.type : '',
            timeStamp: apart.timeStamp ? apart.timeStamp : 0,
            user_id: apart.user_id ? apart.user_id : '',
            complete: apart.complete != undefined ? apart.complete : false,
            timeStampModified: apart.timeStampModified ? apart.timeStampModified : 0,
            quantity_available: apart.quantity_available ? apart.quantity_available : 1,
            by: apart.by ? apart.by : '',
            owner: apart.owner ? apart.owner : ''
        };
        return apartment;
    };
    ObjectInitProvider.prototype.initializeImage = function () {
        var image = {
            name: '',
            path: '',
            progress: 0,
            url: '',
            loaded: false
        };
        return image;
    };
    ObjectInitProvider.prototype.initializeImage2 = function (image) {
        var img = {
            name: image.name ? image.name : '',
            path: image.path ? image.path : '',
            progress: image.progress ? image.progress : 0,
            url: image.url ? image.url : '',
            loaded: image.loaded ? image.loaded : false
        };
    };
    ObjectInitProvider.prototype.initializeProperty = function () {
        var property = {
            address: this.initializeAddress(),
            prop_id: '',
            common: '',
            dP: this.initializeImage(),
            images: [],
            laundry: false,
            nsfas: false,
            wifi: false,
            parking: false,
            prepaid_elec: false,
            timeStamp: 0,
            user_id: '',
            nearbys: ['Clickinn Offices'],
            complete: false,
            timeStampModified: 0
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
            nearbys: prop.nearbys ? prop.nearbys : ['Clickinn Offices'],
            complete: prop.complete,
            timeStampModified: prop.timeStampModified
        };
        return property;
    };
    ObjectInitProvider.prototype.initializeUser = function () {
        var user = {
            agents: [],
            landlords: [],
            displayName: '',
            firstname: '',
            firstime: true,
            lastname: '',
            liked_apartments: [],
            locations: [],
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
            gender: '',
            balance: 0,
            bank: '',
            account_number: '',
            bank_code: '',
            account_holder: '',
            agreed_to_terms: false
        };
        return user;
    };
    ObjectInitProvider.prototype.initializeUser2 = function (userIn) {
        var user = {
            agents: userIn.agents ? userIn.agents : [],
            landlords: userIn.landlords ? userIn.landlords : [],
            displayName: userIn.displayName ? userIn.displayName : '',
            firstname: userIn.firstname ? userIn.firstname : '',
            firstime: userIn.firstime != undefined ? userIn.firstime : true,
            lastname: userIn.lastname ? userIn.lastname : '',
            liked_apartments: userIn.liked_apartments ? userIn.liked_apartments : [],
            user_type: userIn.user_type ? userIn.user_type : '',
            email: userIn.email ? userIn.email : '',
            fcm_token: userIn.fcm_token ? userIn.fcm_token : '',
            is_host: userIn.is_host != undefined ? userIn.is_host : false,
            phoneNumber: userIn.phoneNumber ? userIn.phoneNumber : '',
            photoURL: userIn.photoURL ? userIn.photoURL : 'assets/imgs/placeholder.png',
            rating: userIn.rating ? userIn.rating : '',
            status: userIn.status != undefined ? userIn.status : false,
            threads: userIn.threads ? userIn.threads : [],
            uid: userIn.uid,
            occupation: userIn.occupation ? userIn.occupation : '',
            age: userIn.age ? userIn.age : 0,
            dob: userIn.dob ? userIn.dob : new Date(),
            id_no: userIn.id_no ? userIn.id_no : '',
            gender: userIn.gender ? userIn.gender : '',
            balance: userIn.balance ? userIn.balance : 0,
            bank: userIn.bank ? userIn.bank : '',
            account_number: userIn.account_number ? userIn.account_number : '',
            bank_code: userIn.bank_code ? userIn.bank_code : '',
            account_holder: userIn.account_holder ? userIn.account_holder : '',
            agreed_to_terms: userIn.agreed_to_terms != undefined ? userIn.agreed_to_terms : false,
            locations: userIn.locations ? userIn.locations : []
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
            room_type: '',
            timeStampModified: 0,
            seen: false
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
            apart_dp: ap.apart_dp ? ap.apart_dp : '',
            timeStampModified: ap.timeStampModified ? ap.timeStampModified : 0,
            seen: ap.seen ? ap.seen : false
        };
        return appointment;
    };
    ObjectInitProvider.prototype.initializeFileUpload = function () {
        var fileUpload = {
            file: null,
            url: '',
            name: '',
            progress: 0,
            path: '',
            loaded: false
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