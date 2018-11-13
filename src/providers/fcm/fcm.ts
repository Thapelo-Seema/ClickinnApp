//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { LocalDataProvider } from '../local-data/local-data';
import { User } from '../../models/users/user.interface'

@Injectable()
export class FcmProvider {
  user:User; 
  constructor(
    private platform: Platform, 
    private db: AngularFirestore,
  	private local_db: LocalDataProvider) {
  }

    saveTokenToFirestore(token){
      if (!token) return;
      return this.local_db.getUser().then(user =>{
        if(!user) return;
        else if(user){
          let obj = {
            token: token,
            uid: user.uid
          }
          return this.db.collection('Tokens').doc(token).set(obj)
        }
      })
    }
}
