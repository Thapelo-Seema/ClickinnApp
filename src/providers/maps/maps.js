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
import { App } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';
/*
  Generated class for the MapsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var MapsProvider = /** @class */ (function () {
    function MapsProvider(storage, appCtrl) {
        this.storage = storage;
        this.appCtrl = appCtrl;
    }
    /*This function returns an Address Promise given a string description of a place
    e.g if you pass "Johannesburg" to this method it will return an address object for
    Johannesburg
    */
    MapsProvider.prototype.geoGoder = function (address) {
        var geocoder = new google.maps.Geocoder;
        return new Promise(function (resolve, reject) {
            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status === 'OK') {
                    var place = {
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng(),
                        description: results[0].formatted_address,
                        name: results[0].formatted_address,
                        vicinity: results[0].formatted_address,
                        country_long: '',
                        country_short: ''
                    };
                    results[0].address_components.forEach(function (comp) {
                        comp.types.forEach(function (type) {
                            switch (type) {
                                case "administrative_area_level_1":
                                    place.administrative_area_level_1_lng = comp.long_name;
                                    place.administrative_area_level_1_short = comp.short_name;
                                    break;
                                case "administrative_area_level_2":
                                    place.administrative_area_level_2_lng = comp.long_name;
                                    place.administrative_area_level_2_short = comp.short_name;
                                    break;
                                case "country":
                                    place.country_long = comp.long_name;
                                    place.country_short = comp.short_name;
                                    break;
                                case "locality":
                                    place.locality_lng = comp.long_name;
                                    place.locality_short = comp.short_name;
                                    break;
                                case "sublocality":
                                    place.sublocality_lng = comp.long_name;
                                    place.sublocality_short = comp.short_name;
                                    break;
                            }
                        });
                    });
                    resolve(place);
                }
                else {
                    console.log('Status: ', status);
                    reject(new Error(status));
                }
            });
        });
    };
    /*This method returns an Address object given at latlng coordinate*/
    MapsProvider.prototype.reverseGeocoder = function (lat, lng) {
        var geocoder = new google.maps.Geocoder;
        var latlng = { lat: lat, lng: lng };
        return new Promise(function (resolve, reject) {
            geocoder.geocode({ 'location': latlng }, function (results, status) {
                if (status === 'OK') {
                    console.log('results: ', results[0]);
                    var place = {
                        lat: lat,
                        lng: lng,
                        description: results[0].formatted_address,
                        name: results[0].name,
                        vicinity: results[0].vicinity,
                        country_long: 'South Africa',
                        country_short: 'ZA'
                    };
                    results[0].address_components.forEach(function (comp) {
                        comp.types.forEach(function (type) {
                            switch (type) {
                                case "administrative_area_level_1":
                                    place.administrative_area_level_1_lng = comp.long_name;
                                    place.administrative_area_level_1_short = comp.short_name;
                                    break;
                                case "administrative_area_level_2":
                                    place.administrative_area_level_2_lng = comp.long_name;
                                    place.administrative_area_level_2_short = comp.short_name;
                                    break;
                                case "country":
                                    place.country_long = comp.long_name;
                                    place.country_short = comp.short_name;
                                    break;
                                case "locality":
                                    place.locality_lng = comp.long_name;
                                    place.locality_short = comp.short_name;
                                    break;
                                case "sublocality":
                                    place.sublocality_lng = comp.long_name;
                                    place.sublocality_short = comp.short_name;
                                    break;
                            }
                        });
                    });
                    resolve(place);
                }
                else
                    reject(new Error("Failed getting information about that coordinate from Google"));
            });
        });
    };
    /* Initialises a map centered at the position given by lat and lng and renders the map
    at the DOM element referenced by mapRefA reference to the map is also returned*/
    MapsProvider.prototype.initialiseMap = function (lat, lng, mapRef) {
        var location = new google.maps.LatLng(lat, lng);
        var options = {
            center: location,
            zoom: 15,
            mapTypeId: 'terrain',
            zoomControl: false,
            mapTypeControl: false,
            streetViewControl: false
        };
        var map = new Promise(function (resolve, reject) {
            resolve(new google.maps.Map(mapRef.nativeElement, options));
        });
        return map;
    };
    /*Adds a marker of the specified  shape or icon as specified by the MarkerOptions. A reference to this marker is returned*/
    MapsProvider.prototype.addMarker = function (options, price) {
        return new google.maps.Marker({
            position: options.position,
            map: options.map,
            title: options.title,
            icon: options.icon,
            label: price ? {
                text: 'R' + price.toString(),
                color: 'black',
                fontSize: '10px',
                fontWeight: 'bold'
            } : null
        });
    };
    /*Returns the LatLng coordinates of the current location of a device(needs some accuracy tweaking)*/
    /*getCurrentLocation(): Promise<LatLngCoordinates>{
       return  new Promise<LatLngCoordinates>((resolve, reject) =>{
          this.geo.getCurrentPosition().then(data =>{
            resolve({lat: data.coords.latitude, lng: data.coords.longitude})
          }).catch(err => {
              reject(err);
          })
       })
    }*/
    /*Returns an array of place predictions from the google place engine, given a textbox (customized for places in South Africa only)*/
    MapsProvider.prototype.getPlacePredictionsSA = function (searchText) {
        var service = new google.maps.places.AutocompleteService();
        if (searchText != undefined && searchText != null && searchText.length > 1) {
            return new Promise(function (resolve, reject) {
                service.getPlacePredictions({ input: searchText, componentRestrictions: { country: 'za' } }, function (predictions, status) {
                    if (status != google.maps.places.PlacesServiceStatus.OK) {
                        console.log('Error: ', status);
                        reject(status);
                    }
                    resolve(predictions);
                });
            });
        }
        else {
            return new Promise(function (resolve, reject) {
                resolve([]);
            });
        }
    };
    /*Returns a places Address object given its place_id*/
    MapsProvider.prototype.getPlaceById = function (place_id) {
        var request = {
            placeId: place_id
        };
        return this.getPlaceDetails(request);
    };
    /*Helper function for getPlaceById which queries the googles place service and returns a transformed result of the response from the
    place service*/
    MapsProvider.prototype.getPlaceDetails = function (request) {
        var _this = this;
        var pservice = new google.maps.places.PlacesService(document.createElement('div'));
        return new Promise(function (resolve, reject) {
            pservice.getDetails(request, function (details, status) {
                _this.transformPlaceToAddress(details, status)
                    .then(function (location) {
                    resolve(location);
                });
            });
        });
    };
    /*Helper function for getPlaceDetails Transforms a google places service response into a clickinn address*/
    MapsProvider.prototype.transformPlaceToAddress = function (details, status) {
        return new Promise(function (resolve, reject) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                var pointOfInterest = { lat: 0, lng: 0, description: null, name: '', vicinity: '', country_long: '', country_short: '' };
                pointOfInterest.lat = details.geometry.location.lat();
                pointOfInterest.lng = details.geometry.location.lng();
                pointOfInterest.description = details.formatted_address;
                pointOfInterest.name = details.name;
                pointOfInterest.vicinity = details.vicinity;
                details.address_components.forEach(function (comp) {
                    comp.types.forEach(function (type) {
                        switch (type) {
                            case "administrative_area_level_1":
                                pointOfInterest.administrative_area_level_1_lng = comp.long_name;
                                pointOfInterest.administrative_area_level_1_short = comp.short_name;
                                break;
                            case "administrative_area_level_2":
                                pointOfInterest.administrative_area_level_2_lng = comp.long_name;
                                pointOfInterest.administrative_area_level_2_short = comp.short_name;
                                break;
                            case "country":
                                pointOfInterest.country_long = comp.long_name;
                                pointOfInterest.country_short = comp.short_name;
                                break;
                            case "locality":
                                pointOfInterest.locality_lng = comp.long_name;
                                pointOfInterest.locality_short = comp.short_name;
                                break;
                            case "sublocality":
                                pointOfInterest.sublocality_lng = comp.long_name;
                                pointOfInterest.sublocality_short = comp.short_name;
                                break;
                        }
                    });
                });
                resolve(pointOfInterest);
            }
            else {
                reject(new Error('Failed to fetch results from google maps'));
            }
        });
    };
    /*Returns a promise of an address object of a place selected in a list returned by the google places service*/
    MapsProvider.prototype.getSelectedPlace = function (place) {
        return this.getPlaceById(place.place_id);
    };
    /*Initialises and returns markers with click listeners that reveal information about each place*/
    MapsProvider.prototype.addApartmentMarkersWithClickListeners = function (places, poi, map) {
        var _this = this;
        if (places.length > 0) {
            var lineCoordinates = [
                { lat: places[0].property.address.lat, lng: places[0].property.address.lng },
                { lat: poi.lat, lng: poi.lng }
            ];
            var line = new google.maps.Polyline({
                path: lineCoordinates,
                geodesic: true,
                strokeColor: '#3A86B7',
                strokeOpacity: 1.0,
                strokeWeight: 15
            });
            line.setMap(map);
            return places.map(function (place) {
                var location = new google.maps.LatLng(place.property.address.lat, place.property.address.lng);
                var markerOptions = {
                    position: location,
                    map: map,
                    title: place.description,
                    icon: { url: 'assets/imgs/png/price_tag.png' }
                };
                var marker = _this.addMarker(markerOptions, place.price);
                marker.addListener('click', function () {
                    _this.gotoApartment(place);
                });
                return marker;
            });
        }
        else
            return [];
    };
    /*Initialises and returns markers without event listeners*/
    MapsProvider.prototype.addMarkers = function (places, poi, map) {
        var _this = this;
        if (places.length > 0) {
            return places.map(function (place) {
                var location = new google.maps.LatLng(place.lat, place.lng);
                var markerOptions = { position: location, map: map, title: place.description, icon: '' };
                return _this.addMarker(markerOptions);
            });
        }
        else
            return [];
    };
    /*Returns an array of place predictions from the google place engine, given a textbox event for places in South Africa only*/
    MapsProvider.prototype.getPlaceFromAddress = function (address) {
        var searchText = address;
        if (searchText != undefined && searchText != null && searchText.length > 1) {
            var service = new google.maps.places.AutocompleteService();
            return new Promise(function (resolve, reject) {
                service.getPlacePredictions({ input: searchText, componentRestrictions: { country: 'za' } }, function (predictions, status) {
                    if (status != google.maps.places.PlacesServiceStatus.OK) {
                        alert(status);
                        reject(predictions);
                    }
                    resolve(predictions);
                });
            });
        }
        else {
            return new Promise(function (resolve, reject) {
                resolve([]);
            });
        }
    };
    /*Navigate to the detail page of the apartment selected*/
    MapsProvider.prototype.gotoApartment = function (apartment) {
        var _this = this;
        return this.storage.setApartment(apartment).then(function (data) {
            _this.appCtrl.getRootNav().push('ApartmentDetailsPage');
        });
    };
    MapsProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [LocalDataProvider, App])
    ], MapsProvider);
    return MapsProvider;
}());
export { MapsProvider };
//# sourceMappingURL=maps.js.map