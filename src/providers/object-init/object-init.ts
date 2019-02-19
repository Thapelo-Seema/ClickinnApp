//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Search } from '../../models/search.interface';
import { Address } from '../../models/location/address.interface';
import { Duration } from '../../models/location/duration.interface';
import { LatLngCoordinates } from '../../models/location/latlng.interface';
import { Location } from '../../models/location/location.interface';
import { Apartment } from '../../models/properties/apartment.interface';
import { Property } from '../../models/properties/property.interface';
import { User } from '../../models/users/user.interface';
import { Tenant } from '../../models/users/tenant.interface';
import { Seeker } from '../../models/users/seeker.interface';
import { Appointment } from '../../models/appointment.interface';
import { FileUpload } from '../../models/file-upload.interface';
import { Image } from '../../models/image.interface';
import { MarkerOptions } from '../../models/markeroptions.interface';
import { AngularFireAuth } from 'angularfire2/auth';
import { ChatMessage } from '../../models/chatmessage.interface';
import { ATMDeposit } from '../../models/atmdeposit.interface';
import { SupportMessage } from '../../models/support_message.interface';
import { Placement } from '../../models/placement.interface';



@Injectable()
export class ObjectInitProvider {

  uid: string = '';
  constructor(private afAuth: AngularFireAuth){
    if(this.afAuth.auth.currentUser){
      this.uid = this.afAuth.auth.currentUser.uid;
    }
    
  }

  initializePlacement(){
    let placement: Placement ={
      agent_dp: '',
      agent_firstname: '',
      agent_id: '',
      agent_lastname: '',
      complete: false,
      tenant_email: '',
      tenant_firstname: '',
      tenant_lastname: '',
      tenant_occupation: '',
      tenant_dp: '',
      tenant_id: '',
      tenant_institution: '',
      qualification: '',
      tenant_studentno: '',
      tenant_phoneNumber: '',
      apartment_type: '',
      placement_date: 0,
      property_address: '',
      rent: 0,
      deposit: 0,
      apartment_id: '',
      placement_id: ''
    }
    return placement;
  }

  initializePlacement2(plmt: Placement){
    let placement: Placement ={
      agent_dp: plmt.agent_dp ? plmt.agent_dp : '',
      agent_firstname: plmt.agent_firstname ? plmt.agent_firstname : '',
      agent_id: plmt.agent_id ? plmt.agent_id : '',
      agent_lastname: plmt.agent_lastname ? plmt.agent_lastname : '',
      complete: plmt.complete ? plmt.complete : false,
      tenant_email: plmt.tenant_email ? plmt.tenant_email : '',
      tenant_firstname: plmt.tenant_firstname ? plmt.tenant_firstname : '',
      tenant_lastname: plmt.tenant_lastname ? plmt.tenant_lastname : '',
      tenant_occupation: plmt.tenant_occupation ? plmt.tenant_occupation : '',
      tenant_dp: plmt.tenant_dp ? plmt.tenant_dp : '',
      tenant_id: plmt.tenant_id ? plmt.tenant_id : '',
      tenant_institution: plmt.tenant_institution ? plmt.tenant_institution : '',
      qualification: plmt.qualification ? plmt.qualification : '',
      tenant_studentno: plmt.tenant_studentno ? plmt.tenant_studentno : '',
      tenant_phoneNumber: plmt.tenant_phoneNumber ? plmt.tenant_phoneNumber : '',
      apartment_type: plmt.apartment_type ? plmt.apartment_type : '',
      placement_date: plmt.placement_date ? plmt.placement_date : 0,
      property_address: plmt.property_address ? plmt.property_address : '',
      rent: plmt.rent ? plmt.rent : 0,
      deposit: plmt.deposit ? plmt.deposit : 0,
      apartment_id: plmt.apartment_id ? plmt.apartment_id : '',
      placement_id: plmt.placement_id ? plmt.placement_id : ''
    }
    return placement;
  }

  initializeDeposit(){
    let deposit: ATMDeposit = {
      agent_goAhead: false,
      time_initiated: null,
      time_agent_confirm: 0,
      time_clickinn_confirm: 0,
      time_tenant_confirmed: 0,
      tenant_confirmed: false,
      agent_confirmed: false,
      clickinn_confirmed: false,
      clickinn_cancel: false,
      to: {firstname: '', lastname: '', dp: '', uid: ''},
      by: {firstname: '', lastname: '', dp: '', uid: ''},
      apartment: this.initializeApartment(),
      id: '',
      currency: 'ZAR',
      transaction_closed: false,
      tenant_refund_request: false,
      landlord_credit: 0,
      ref : '',
      bank: '',
      account_holder: '',
      account_number: '',
      branch_code: '',
      tenantMovedIn: false,
      timeStampModified: 0,
      seen: false
    }
    return deposit;
  }

  initializeDeposit2(dep: ATMDeposit){
    let deposit: ATMDeposit = {
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
      ref : dep.ref ? dep.ref : '',
      bank: dep.bank ? dep.bank : '',
      account_holder: dep.account_holder ? dep.account_holder : '',
      account_number: dep.account_number ? dep.account_number : '',
      branch_code: dep.branch_code ? dep.branch_code : '',
      tenantMovedIn: dep.tenantMovedIn != undefined ? dep.tenantMovedIn : false,
      timeStampModified: dep.timeStampModified ? dep.timeStampModified : 0,
      seen: dep.seen != undefined ? dep.seen : false
    }
    return deposit;
  }

  initializeChatMessage(){
    let message: ChatMessage ={
      by: {displayName: '', dp: '', uid: ''},
      to: {displayName: '', dp: '', uid: ''},
      timeStamp: 0,
      sent: false,
      read: false,
      recieved: false,
      text: '',
      topic: '',
      id: '',
      seen: false,
      attachment: null
    }
    return message;
  }

  initializeChatMessag2(msg: ChatMessage){
    let message: ChatMessage ={
      by: msg.by ? msg.by : {displayName: '', dp: '', uid: ''},
      to: msg.to ? msg.to : {displayName: '', dp: '', uid: ''},
      timeStamp: msg.timeStamp ? msg.timeStamp : 0,
      sent: msg.sent != undefined ? msg.sent : false,
      read: msg.read ? msg.read : false,
      recieved: msg.recieved != undefined ? msg.recieved : false,
      text: msg.text ? msg.text : '',
      topic: msg.topic ? msg.topic : '',
      id: msg.id ? msg.id : '',
      seen: msg.seen != undefined ? msg.seen : false,
      attachment: msg.attachment ? msg.attachment: null
    }
    return message;
  }

  initializeSupportMessage(){
    let message: SupportMessage ={
      user: {displayName: '', dp: '', uid: ''},
      assigned_to: {displayName: '', dp: '', uid: ''},
      timeStamp: 0,
      sent: false,
      solved: false,
      recieved: false,
      text: '',
      issue_type: '',
      id: ''
    }
    return message;
  }

  initializeChatMessageInComp(user: User, host: User){
    let message: ChatMessage ={
      by: {displayName: user.displayName, dp: user.photoURL, uid: user.uid},
      to: {displayName: host.displayName, dp: host.photoURL, uid: host.uid},
      timeStamp: 0,
      sent: false,
      read: false,
      recieved: false,
      text: '',
      topic: ''
    }
    return message;
  }

  initializeSearch(): Search{
  	let search: Search = {
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

  	}
  	return search;
  }


  initializeAddress(): Address{
  	let address: Address = {
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
  	}
  	return address;
  }

  initializeDuration(): Duration{
  	let duration: Duration ={
  		text: '',
  		value: 0
  	}
  	return duration;
  }

  initializeLatLng(): LatLngCoordinates{
  	let latlng: LatLngCoordinates = {
  		lat: 0,
  		lng: 0
  	}
  	return latlng;
  }

  initializeLocation(): Location{
  	let location: Location ={
  		lat: 0,
  		lng: 0,
  		details: ''
  	}
  	return location;
  }

  initializeApartment(): Apartment{
  	let apartment: Apartment ={
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
      owner: '',
      callNumber: ''
  	}
  	return apartment;
  }

  initializeApartment2(apart: Apartment): Apartment{
    let apartment: Apartment ={
      available: apart.available != undefined ? apart.available : true,
      dP: apart.dP ? apart.dP : this.initializeImage(),
      deposit: apart.deposit ? apart.deposit: 0,
      description: apart.description,
      apart_id: apart.apart_id ? apart.apart_id: '',
      images: apart.images ? apart.images : [this.initializeImage()],
      occupiedBy: apart.occupiedBy ? apart.occupiedBy : this.initializeTenant(),
      price: apart.price ? apart.price : 0,
      prop_id: apart.prop_id ? apart.prop_id : '',
      property: apart.property ? apart.property : this.initializeProperty(),
      room_type: apart.room_type ? apart.room_type : '',
      search_rating: apart.search_rating ? apart.search_rating : 0,
      type: apart.type ? apart.type : '',
      timeStamp: apart.timeStamp ? apart.timeStamp : 0,
      user_id: apart.user_id ? apart.user_id: '',
      complete: apart.complete != undefined ? apart.complete : false,
      timeStampModified: apart.timeStampModified ? apart.timeStampModified : 0,
      quantity_available: apart.quantity_available ? apart.quantity_available : 1,
      by: apart.by ? apart.by : '',
      owner: apart.owner ? apart.owner : '',
      callNumber: apart.callNumber ? apart.callNumber : ''
    }
    return apartment;
  }

  initializeImage(): Image{
  	let image: Image = {
  		name: '',
  		path: '',
  		progress: 0,
  		url: '',
      loaded: false
  	}
  	return image;
  }

  initializeImage2(image: Image){
    let img: Image = {
      name: image.name ? image.name : '',
      path: image.path ? image.path : '',
      progress: image.progress ? image.progress: 0,
      url: image.url ? image.url : '',
      loaded: image.loaded ? image.loaded : false
    }
  }

  initializeProperty(): Property{
  	let property: Property = {
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
  	}
  	return property;
  }

  initializeProperty2(prop: Property): Property{
    let property: Property = {
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
      complete: prop.complete ? prop.complete : false,
      timeStampModified: prop.timeStampModified
    }
    return property;
  }

  initializeUser(): User{
  	let user: User = {
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
  	}
  	return user;
  }

  initializeUser2(userIn: User): User{
    let user: User = {
      agents: userIn.agents ? userIn.agents : [],
      landlords: userIn.landlords ? userIn.landlords : [],
      displayName: userIn.displayName ? userIn.displayName: '',
      firstname: userIn.firstname ? userIn.firstname: '',
      firstime: userIn.firstime != undefined ? userIn.firstime : true,
      lastname: userIn.lastname ? userIn.lastname : '',
      liked_apartments: userIn.liked_apartments ? userIn.liked_apartments : [],
      user_type: userIn.user_type ? userIn.user_type: '',
      email: userIn.email ? userIn.email: '',
      fcm_token: userIn.fcm_token ? userIn.fcm_token: '',
      is_host: userIn.is_host != undefined ? userIn.is_host : false,
      phoneNumber: userIn.phoneNumber ? userIn.phoneNumber: '',
      photoURL: userIn.photoURL ? userIn.photoURL: 'assets/imgs/placeholder.png',
      rating: userIn.rating ? userIn.rating : '',
      status: userIn.status != undefined ? userIn.status: false,
      threads: userIn.threads ? userIn.threads : [],
      uid: userIn.uid ,
      occupation: userIn.occupation ? userIn.occupation : '',
      age: userIn.age ? userIn.age: 0,
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
    }
    return user;
  }


 initializeSeeker(): Seeker{
 	let seeker: Seeker = {
 		firstname: '',
 		lastname: '',
 		uid: this.uid,
 		age: 0,
 		occupation: '',
 		cellphone: '',
 		email: '',
 		rating: 0
 	}
 	return seeker;
 }

 initializeTenant(): Tenant{
 	let tenant: Tenant = {
 		profile: this.initializeUser(),
 		address: this.initializeAddress(),
 		reviews: [{comment:'', reviewer_id: '', reviewer_name: ''}]
 	}
 	return tenant;
 }

 initializeAppointment(): Appointment{
 	let appointment: Appointment ={
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
 	}
 	return appointment;
 }


 initializeAppointment2(ap: Appointment): Appointment{
   let appointment: Appointment ={
     date: ap.date? ap.date : new Date(),
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
   }
   return appointment;
 }

 initializeFileUpload(): FileUpload{
 	let fileUpload: FileUpload ={
 		file: null,
 		url: '',
 		name: '',
 		progress: 0,
 		path: '',
    loaded: false
 	}
 	return fileUpload;
 }
 
 initializeMarkerOptions(): MarkerOptions{
 	let options: MarkerOptions ={
 		position: this.initializeLatLng(),
 		title: '',
 		icon: null,
 		label: null,
 		map: null
 	}
 	return options;
 }
 

}
