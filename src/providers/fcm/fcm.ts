//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { Platform } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { LocalDataProvider } from '../local-data/local-data';
import { User } from '../../models/users/user.interface'

@Injectable()
export class FcmProvider {
  user:User; 
  constructor(private firebaseNative: Firebase, private platform: Platform, private db: AngularFireDatabase,
  	private local_db: LocalDataProvider) {
  }

  async getToken(){
      let token;
      if (this.platform.is('android')){
        token = await this.firebaseNative.getToken();
      } 
      if (this.platform.is('ios')) {
        this.firebaseNative.grantPermission();
        this.firebaseNative.getToken();
      } 
      return this.saveTokenToFirestore(token)
    }

    private saveTokenToFirestore(token) {
      if (!token) return;
      return this.local_db.getUser().then(user =>{
        if(user){
          return this.db.object(`Tokens/${user.uid}`).set({token: token})
        }
      })
      
    }

    listenToNotifications() {
      this.firebaseNative.grantPermission();
      return this.firebaseNative.onNotificationOpen()
    }

}
