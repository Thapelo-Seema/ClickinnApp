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
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
//import { ClickinnMapsComponent } from '../../components/clickinn-maps/clickinn-maps';
//import { AccommodationsComponent } from '../../components/accommodations/accommodations';
//import { ApartmentDetailsPage } from '../apartment-details/apartment-details';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { take } from 'rxjs-compat/operators/take';
var SeekingPage = /** @class */ (function () {
    function SeekingPage(navCtrl, accom_svc, alertCtrl, storage, errHandler, object_init) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.accom_svc = accom_svc;
        this.alertCtrl = alertCtrl;
        this.storage = storage;
        this.errHandler = errHandler;
        this.object_init = object_init;
        this.apartments = [];
        this.numberOfApartments = 0;
        this.dataLoaded = false;
        this.showList = false;
        this.more = false;
        this.pointOfInterest = this.object_init.initializeAddress();
        this.bestMatch = this.object_init.initializeApartment();
        this.search_object = this.object_init.initializeSearch();
        this.storage.getPOI().then(function (data) {
            _this.pointOfInterest = data;
        })
            .then(function () {
            _this.storage.getSearch()
                .then(function (data) {
                console.log(data);
                _this.search_object = data;
            }).then(function () {
                _this.getApartments(_this.search_object);
            })
                .catch(function (err) {
                _this.errHandler.handleError(err);
                _this.dataLoaded = true;
            });
        })
            .catch(function (err) {
            _this.errHandler.handleError(err);
            _this.dataLoaded = true;
        });
    }
    SeekingPage.prototype.getApartments = function (obj) {
        var _this = this;
        var ratedArray = [];
        this.accom_svc.search(obj)
            .pipe(take(1))
            .subscribe(function (apartments) {
            if (apartments.length > 0) {
                ratedArray = apartments;
                _this.numberOfApartments = apartments.length;
                if (ratedArray.length > 0) {
                    var ind = 0;
                    ratedArray.forEach(function (apartment) {
                        ratedArray[ind].search_rating = _this.calcRating(apartment);
                        ++ind;
                    });
                    var tempRatedApart = ratedArray[0];
                    for (var i = 1; i < ratedArray.length; ++i) {
                        if (ratedArray[i].search_rating > ratedArray[i].search_rating[i - 1]) {
                            tempRatedApart = ratedArray[i - 1];
                            ratedArray[i - 1] = ratedArray[i];
                            ratedArray[i] = tempRatedApart;
                        }
                    }
                    _this.bestMatch = ratedArray[0];
                    ratedArray.splice(0, 1);
                    _this.apartments = ratedArray;
                    _this.showAlert();
                    console.log(ratedArray);
                    _this.dataLoaded = true;
                }
            }
            else {
                _this.dataLoaded = true;
                _this.showNull();
            }
        }, function (err) {
            _this.errHandler.handleError(err);
            _this.dataLoaded = true;
        });
    };
    SeekingPage.prototype.gotoApartment = function (apartment) {
        var _this = this;
        this.storage.setApartment(apartment).then(function (data) { return _this.navCtrl.push('ApartmentDetailsPage'); })
            .catch(function (err) {
            _this.errHandler.handleError(err);
            _this.dataLoaded = true;
        });
    };
    SeekingPage.prototype.toggleList = function () {
        this.showList = !this.showList;
    };
    SeekingPage.prototype.showAlert = function () {
        var alert = this.alertCtrl.create({
            title: 'Best Matched Apartment!',
            subTitle: " " + this.bestMatch.room_type + " in " + this.bestMatch.property.address.sublocality_lng + ", \n \n                   monthly rental of R" + this.bestMatch.price + ".",
            message: "Follow the blue line on the map from " + this.pointOfInterest.name + " to this apartment and click on apartment price-tag to view more about it or\n      or click the list icon to see the list view",
            cssClass: 'alertCtrl',
            buttons: ['OK']
        });
        alert.present();
    };
    SeekingPage.prototype.showNull = function () {
        var alert = this.alertCtrl.create({
            title: 'No results!',
            subTitle: " No results found but relevant agents and landlords have been alerted of your search and will contact you.",
            cssClass: 'alertCtrl',
            buttons: ['OK']
        });
        alert.present();
    };
    SeekingPage.prototype.calcRating = function (apartment) {
        var rating = 0;
        if (apartment.property.nearbys != undefined) {
            rating += apartment.property.nearbys.length / 100;
            if (apartment.property.nearbys.indexOf(this.search_object.Address.description) != -1)
                rating += 2;
        }
        if (apartment.property.wifi)
            rating += 1;
        if (apartment.property.laundry)
            rating += 1;
        rating += 40 * ((this.search_object.maxPrice - apartment.price) / this.search_object.maxPrice);
        return rating;
    };
    SeekingPage.prototype.toggleMore = function () {
        this.more = !this.more;
    };
    SeekingPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-seeking',
            templateUrl: 'seeking.html',
        }),
        __metadata("design:paramtypes", [NavController, AccommodationsProvider,
            AlertController, LocalDataProvider,
            ErrorHandlerProvider, ObjectInitProvider])
    ], SeekingPage);
    return SeekingPage;
}());
export { SeekingPage };
//# sourceMappingURL=seeking.js.map