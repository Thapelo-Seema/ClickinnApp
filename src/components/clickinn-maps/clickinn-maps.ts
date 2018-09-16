import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy } from '@angular/core';
import { MapsProvider } from '../../providers/maps/maps';
import { Address } from '../../models/location/address.interface';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import { Apartment } from '../../models/properties/apartment.interface';
import { Search } from '../../models/search.interface';
import 'rxjs/add/operator/take';

declare var MarkerClusterer: any;
/**
 * Generated class for the ClickinnMapsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'clickinn-maps',
  templateUrl: 'clickinn-maps.html'
})
export class ClickinnMapsComponent implements OnInit, OnDestroy {

	@ViewChild('map') mapRef: ElementRef;
	@Input() pointOfInterest: Address;
	@Input() search: Search;
	apartments: Apartment[] = [];
	apartmentSubs$: any;

  constructor(private maps_svc: MapsProvider, private accom_svc: AccommodationsProvider){
  }

  	ngOnInit(){
	  	this.constructMap(this.pointOfInterest);
	}

	ngOnDestroy(){
	  	this.apartmentSubs$.unsubscribe();
	}

	constructMap(place: Address){
		this.apartmentSubs$ = this.accom_svc.getRatedApartments(this.search).subscribe(apartments =>{
			//console.log('search results in clickinn-maps: ', apartments);
			this.apartments = apartments;
			this.maps_svc.initialiseMap(place.lat, place.lng, this.mapRef)
  			.then(map =>{
	  			//this.map = map;
	  			this.maps_svc.addMarker(
					{
	  					position: {lat: place.lat, lng: place.lng},
	  					map: map, 
	  					icon: {url: 'assets/imgs/png/poi.png'}
	  				}
	  			)
	  			let markers = this.maps_svc.addApartmentMarkersWithClickListeners(apartments, place, map);
	  			let markerClusterer = new MarkerClusterer(map, markers);
  			})
		})
	}

}
