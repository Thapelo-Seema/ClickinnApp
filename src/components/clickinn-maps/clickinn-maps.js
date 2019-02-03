var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { MapsProvider } from '../../providers/maps/maps';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import 'rxjs/add/operator/take';
import { take } from 'rxjs-compat/operators/take';
import { LocalDataProvider } from '../../providers/local-data/local-data';
/**
 * Generated class for the ClickinnMapsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
var ClickinnMapsComponent = /** @class */ (function () {
    function ClickinnMapsComponent(maps_svc, accom_svc, storage) {
        this.maps_svc = maps_svc;
        this.accom_svc = accom_svc;
        this.storage = storage;
        this.apartments = [];
    }
    ClickinnMapsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.storage.getPOI()
            .then(function (poi) {
            _this.constructMap(poi);
        });
    };
    ClickinnMapsComponent.prototype.constructMap = function (place) {
        var _this = this;
        this.storage.getSearch()
            .then(function (search) {
            _this.accom_svc.getRatedApartments(search).pipe(take(1)).subscribe(function (apartments) {
                //console.log('search results in clickinn-maps: ', apartments);
                _this.apartments = apartments;
                _this.maps_svc.initialiseMap(place.lat, place.lng, _this.mapRef)
                    .then(function (map) {
                    //this.map = map;
                    _this.maps_svc.addMarker({
                        position: { lat: place.lat, lng: place.lng },
                        map: map,
                        icon: { url: 'assets/imgs/png/poi.png' }
                    });
                    var markers = _this.maps_svc.addApartmentMarkersWithClickListeners(apartments, place, map);
                    var markerClusterer = new MarkerClusterer(map, markers);
                });
            });
        });
    };
    __decorate([
        ViewChild('map'),
        __metadata("design:type", ElementRef)
    ], ClickinnMapsComponent.prototype, "mapRef", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], ClickinnMapsComponent.prototype, "pointOfInterest", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], ClickinnMapsComponent.prototype, "search", void 0);
    ClickinnMapsComponent = __decorate([
        Component({
            selector: 'clickinn-maps',
            templateUrl: 'clickinn-maps.html'
        }),
        __metadata("design:paramtypes", [MapsProvider,
            AccommodationsProvider,
            LocalDataProvider])
    ], ClickinnMapsComponent);
    return ClickinnMapsComponent;
}());
export { ClickinnMapsComponent };
//# sourceMappingURL=clickinn-maps.js.map