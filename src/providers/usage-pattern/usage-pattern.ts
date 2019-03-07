//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { User } from '../../models/users/user.interface';
/*
  Generated class for the UsagePatternProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UsagePatternProvider {

  constructor(private afs: AngularFirestore) {
    console.log('Hello UsagePatternProvider Provider');
  }

  madeCall(user: User, host: User){
  	let enquiry = {
  		host: host,
  		seeker: user,
  		timeStamp: Date.now()
  	}
  	return this.afs.collection('CallEnquiries').add(enquiry);
  }

  sentMessage(user: User, host: User){
  	let enquiry = {
  		host: host,
  		seeker: user,
  		timeStamp: Date.now()
  	}
  	return this.afs.collection('TextEnquiries').add(enquiry);
  }

}
