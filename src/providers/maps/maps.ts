import { Injectable } from '@angular/core';
import { ElementRef } from '@angular/core';
//import { Geolocation } from '@ionic-native/geolocation';
import { Address } from '../../models/location/address.interface';
import { MarkerOptions } from '../../models/markeroptions.interface';
//import { LatLngCoordinates } from '../../models/location/latlng.interface';
import { Apartment } from '../../models/properties/apartment.interface';
import { App } from 'ionic-angular';
import { LocalDataProvider } from '../../providers/local-data/local-data';

//import 'rxjs-compat/add/operator/map';
//import { map } from 'rxjs-compat/operators/map';

declare var google: any;
/*
  Generated class for the MapsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MapsProvider {

constructor( private storage: LocalDataProvider, public appCtrl: App){
}
/*This function returns an Address Promise given a string description of a place
e.g if you pass "Johannesburg" to this method it will return an address object for
Johannesburg
*/
geoGoder(address: string):Promise<Address>{
  var geocoder = new google.maps.Geocoder;
  return new Promise<Address>((resolve, reject) =>{
    geocoder.geocode({'address': address}, (results, status) =>{
      if(status === 'OK'){
        var place: Address = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
          description:  results[0].formatted_address,
          name: results[0].formatted_address,
          vicinity: results[0].formatted_address,
          country_long: '',
          country_short: ''
        }
        results[0].address_components.forEach(comp =>{
          comp.types.forEach(type =>{
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
          })
        })
        resolve(place);
      }
      else {
        console.log('Status: ', status);
        reject(new Error(status))
      }

    })
  }) 
}
/*This method returns an Address object given at latlng coordinate*/
reverseGeocoder(lat: number, lng: number): Promise<Address>{
  var geocoder = new google.maps.Geocoder;
  const latlng = {lat: lat, lng: lng};
  return new Promise<Address>((resolve, reject) =>{
      geocoder.geocode({'location': latlng}, (results, status) =>{
          if(status === 'OK'){
            console.log('results: ', results[0])
            var place: Address = {
              lat: lat,
              lng: lng,
              description: results[0].formatted_address,
              name: results[0].name,
              vicinity: results[0].vicinity,
              country_long: 'South Africa',
              country_short: 'ZA'
            }
            results[0].address_components.forEach(comp =>{
        comp.types.forEach(type =>{
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
        })
      })
         resolve(place); 
        } 
        else reject(new Error("Failed getting information about that coordinate from Google"));
      })
  }) 
}
/* Initialises a map centered at the position given by lat and lng and renders the map 
at the DOM element referenced by mapRefA reference to the map is also returned*/
  initialiseMap(lat: number, lng: number, mapRef: ElementRef):Promise<any>{
  	const location = new google.maps.LatLng(lat, lng)
  	const options = {
  		center: location,
  		zoom: 15,
  		mapTypeId: 'terrain',
      zoomControl: false,
      mapTypeControl: false,
      streetViewControl: false
  	}
  	var map = new Promise<any>((resolve, reject) =>{
  		resolve(new google.maps.Map(mapRef.nativeElement, options)); 
  	})
  	return map;
  }
/*Adds a marker of the specified  shape or icon as specified by the MarkerOptions. A reference to this marker is returned*/
  addMarker(options: MarkerOptions, price?: number){
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
    }: null });
  }
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
  getPlacePredictionsSA(searchText: string):Promise<any[]>{
    var service = new google.maps.places.AutocompleteService();
    if(searchText != undefined && searchText != null && searchText.length > 1){
        return new Promise<any>((resolve, reject) =>{
          service.getPlacePredictions({ input: searchText, componentRestrictions: {country: 'za'} }, 
          (predictions, status) =>{
            if (status != google.maps.places.PlacesServiceStatus.OK){
              console.log('Error: ', status)
              reject(status);
            }
              resolve(predictions);
          });
        }) 
    }else{
      return new Promise<any>((resolve, reject) =>{
        resolve([]);
      })
    }
  }
/*Returns a places Address object given its place_id*/
  getPlaceById(place_id):Promise<Address>{
    var request = {
        placeId: place_id
      }
   return this.getPlaceDetails(request);
  }
/*Helper function for getPlaceById which queries the googles place service and returns a transformed result of the response from the 
place service*/
   private getPlaceDetails(request):Promise<Address>{
    const pservice = new google.maps.places.PlacesService(document.createElement('div'));
    return new Promise<Address>((resolve, reject) =>{
        pservice.getDetails(request,(details, status) => { 
          this.transformPlaceToAddress(details, status)
          .then(location =>{
            resolve(location);
        })})
    })
  }
/*Helper function for getPlaceDetails Transforms a google places service response into a clickinn address*/
  private transformPlaceToAddress(details, status):Promise<Address>{
    return new Promise<Address>((resolve, reject) =>{
      if (status == google.maps.places.PlacesServiceStatus.OK){
        var pointOfInterest: Address = {lat: 0, lng: 0, description: null, name: '', vicinity: '', country_long: '', country_short: ''};
        pointOfInterest.lat = details.geometry.location.lat();
        pointOfInterest.lng = details.geometry.location.lng();
        pointOfInterest.description = details.formatted_address;
        pointOfInterest.name = details.name;
        pointOfInterest.vicinity = details.vicinity;
        details.address_components.forEach(comp =>{
          comp.types.forEach(type =>{
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
          })
        })
        resolve(pointOfInterest)
      }else{
        reject(new Error('Failed to fetch results from google maps'))
      }
    })
  }
/*Returns a promise of an address object of a place selected in a list returned by the google places service*/
  getSelectedPlace(place): Promise<Address>{
    return this.getPlaceById(place.place_id)
  }
/*Initialises and returns markers with click listeners that reveal information about each place*/
addApartmentMarkersWithClickListeners(places: Apartment[], poi: Address, map: any): Promise<any[]>{
  return new Promise<any[]>((resolve, reject) =>{
    if(places.length > 0){
    var lineCoordinates = [
      {lat: places[0].property.address.lat, lng: places[0].property.address.lng},
      {lat: poi.lat, lng: poi.lng}
    ];
    var line = new google.maps.Polyline({
      path: lineCoordinates,
      geodesic: true,
      strokeColor: '#3A86B7',
      strokeOpacity: 1.0,
      strokeWeight: 15
    });
    line.setMap(map); 
    let markers = places.map(place => {
    const location = new google.maps.LatLng(place.property.address.lat, place.property.address.lng);
    const markerOptions: MarkerOptions = 
    {
      position: location, 
      map: map, 
      title: place.description, 
      icon: {url: 'assets/imgs/png/price_tag.png'} 
    }
    var marker = this.addMarker(markerOptions, place.price);
    marker.addListener('click', () =>{
      this.gotoApartment(place);
    });
    return marker;
  })
  resolve(markers)
  }else resolve(null) ;
  })
}

addApartmentMarker(place: Apartment, map: any){
  return new Promise<any[]>((resolve, reject) =>{
    if(place){ 
    const location = new google.maps.LatLng(place.property.address.lat, place.property.address.lng);
    const markerOptions: MarkerOptions = 
    {
      position: location, 
      map: map, 
      title: place.description, 
      icon: {url: 'assets/imgs/png/price_tag.png'} 
    }
    var marker = this.addMarker(markerOptions, place.price);
    marker.addListener('click', () =>{
      this.gotoApartment(place);
    });
    resolve(marker)
  }else resolve([]) ;
  })
}
/*Initialises and returns markers with click listeners that reveal information about each place*/
addApartmentMarkerWithClickListeners(place: Apartment, poi: Address, map: any): Promise<any[]>{
  return new Promise<any[]>((resolve, reject) =>{
    if(place){
    var lineCoordinates = [
      {lat: place.property.address.lat, lng: place.property.address.lng},
      {lat: poi.lat, lng: poi.lng}
    ];
    var line = new google.maps.Polyline({
      path: lineCoordinates,
      geodesic: true,
      strokeColor: '#3A86B7',
      strokeOpacity: 1.0,
      strokeWeight: 15
    });
    line.setMap(map); 
    const location = new google.maps.LatLng(place.property.address.lat, place.property.address.lng);
    const markerOptions: MarkerOptions = 
    {
      position: location, 
      map: map, 
      title: place.description, 
      icon: {url: 'assets/imgs/png/price_tag.png'} 
    }
    var marker = this.addMarker(markerOptions, place.price);
    marker.addListener('click', () =>{
      this.gotoApartment(place);
    });
    resolve(marker)
  }else resolve([]) ;
  })
}
/*Initialises and returns markers without event listeners*/
addMarkers(places: Address[], poi: Address, map: any): Array<any>{
  if(places.length > 0){
    return places.map(place => {
    const location = new google.maps.LatLng(place.lat, place.lng);
    const markerOptions: MarkerOptions = {position: location, map: map, title: place.description, icon: ''}
    return this.addMarker(markerOptions); 
  })
  }else return [];
}
/*Returns an array of place predictions from the google place engine, given a textbox event for places in South Africa only*/
  getPlaceFromAddress(address: string):Promise<any[]>{
    var searchText = address;
    if(searchText != undefined && searchText != null && searchText.length > 1){
        var service = new google.maps.places.AutocompleteService();
        return new Promise<any>((resolve, reject) =>{
          service.getPlacePredictions({ input: searchText, componentRestrictions: {country: 'za'} }, 
          (predictions, status) =>{
            if (status != google.maps.places.PlacesServiceStatus.OK){
              alert(status);
              reject(predictions);
            }
              resolve(predictions);
          });
        }) 
    }else{
      return new Promise<any>((resolve, reject) =>{
        resolve([]);
      })
    }
  }
/*Navigate to the detail page of the apartment selected*/
 gotoApartment(apartment: Apartment):Promise<void>{
    return this.storage.setApartment(apartment).then(data => {
      this.appCtrl.getRootNav().push('ApartmentDetailsPage');
    })
 }

}
