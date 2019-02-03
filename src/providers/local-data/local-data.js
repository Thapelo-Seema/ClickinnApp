var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
var LocalDataProvider = /** @class */ (function () {
    function LocalDataProvider(storage) {
        this.storage = storage;
    }
    LocalDataProvider.prototype.getPaymentWarningSeen = function () {
        return this.storage.get('paymentWarningSeen');
    };
    LocalDataProvider.prototype.setPaymentWarningSeen = function () {
        return this.storage.set('paymentWarningSeen', true);
    };
    LocalDataProvider.prototype.setPersonalDetailsEdit = function () {
        return this.storage.set('edit', 'personal-details');
    };
    LocalDataProvider.prototype.setBankingDetailsEdit = function () {
        return this.storage.set('edit', 'banking-details');
    };
    LocalDataProvider.prototype.getProfileEdit = function () {
        return this.storage.get('edit');
    };
    LocalDataProvider.prototype.setFirstTime = function () {
        return this.storage.set('firstime', true);
    };
    LocalDataProvider.prototype.setNotFirstime = function () {
        return this.storage.set('firstime', false);
    };
    LocalDataProvider.prototype.getFirstTime = function () {
        return this.storage.get('firstime');
    };
    LocalDataProvider.prototype.setChannelID = function (channel_id) {
        return this.storage.set('channel_id', channel_id);
    };
    LocalDataProvider.prototype.getChannelID = function () {
        return this.storage.get('channel_id');
    };
    LocalDataProvider.prototype.setTransactionState = function (state) {
        return this.storage.set('transaction_state', state);
    };
    LocalDataProvider.prototype.getTransactionState = function () {
        return this.storage.get('transaction_state');
    };
    LocalDataProvider.prototype.setMessageDetails = function (details) {
        return this.storage.set('msg_details', details);
    };
    LocalDataProvider.prototype.getMessageDetails = function () {
        return this.storage.get('msg_details');
    };
    LocalDataProvider.prototype.setThread = function (thread) {
        return this.storage.set('thread', thread);
    };
    LocalDataProvider.prototype.getThread = function () {
        return this.storage.get('thread');
    };
    LocalDataProvider.prototype.setSearch = function (search) {
        return this.storage.set('search_object', search);
    };
    LocalDataProvider.prototype.setProperty = function (prop) {
        return this.storage.set('property', prop);
    };
    LocalDataProvider.prototype.getProperty = function () {
        return this.storage.get('property');
    };
    LocalDataProvider.prototype.getSearch = function () {
        return this.storage.get('search_object');
    };
    LocalDataProvider.prototype.setUser = function (user) {
        return this.storage.set('user', user);
    };
    LocalDataProvider.prototype.getUser = function () {
        return this.storage.get('user');
    };
    LocalDataProvider.prototype.removeUser = function () {
        return this.storage.remove('user');
    };
    LocalDataProvider.prototype.setSeeker = function (seeker) {
        return this.storage.set('seeker', seeker);
    };
    LocalDataProvider.prototype.getSeeker = function () {
        return this.storage.get('seeker');
    };
    LocalDataProvider.prototype.removeSeeker = function () {
        return this.storage.remove('seeker');
    };
    LocalDataProvider.prototype.setApartment = function (apartment) {
        return this.storage.set('aoi', apartment);
    };
    LocalDataProvider.prototype.getApartment = function () {
        return this.storage.get('aoi');
    };
    LocalDataProvider.prototype.setPOI = function (poi) {
        return this.storage.set('poi', poi);
    };
    LocalDataProvider.prototype.getPOI = function () {
        return this.storage.get('poi');
    };
    LocalDataProvider.prototype.setWalkingDuration = function (duration) {
        return this.storage.set('walkingDuration', duration);
    };
    LocalDataProvider.prototype.getWalkingDuration = function () {
        return this.storage.get('walkingDuration');
    };
    LocalDataProvider.prototype.setUserType = function (user_type) {
        return this.storage.set('user_type', user_type);
    };
    LocalDataProvider.prototype.getUserType = function () {
        return this.storage.get('user_type');
    };
    LocalDataProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Storage])
    ], LocalDataProvider);
    return LocalDataProvider;
}());
export { LocalDataProvider };
//# sourceMappingURL=local-data.js.map