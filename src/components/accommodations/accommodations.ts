import { Component, Input } from '@angular/core';
//import { Apartment } from '../../models/properties/apartment.interface';

/**
 * Generated class for the AccommodationsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'accommodations',
  templateUrl: 'accommodations.html'
})
export class AccommodationsComponent{

	@Input() apartment: any;

	constructor(){
	}

}
