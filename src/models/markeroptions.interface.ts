import {LatLngCoordinates} from './location/latlng.interface';

export interface MarkerOptions{
	position: LatLngCoordinates;
	map: any;
	title?: string;
	icon?:any;
	label?: any;
}