import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { User } from '../../models/users/user.interface';

/*
  Generated class for the UserSvcProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserSvcProvider {

  constructor(private afs: AngularFirestore){
    
  }

  createUser(user: User){
  	return this.afs.collection<User>('Users').doc(user.uid).set(user);
  }

  updateUser(user: User){
  	return this.afs.collection<User>('Users').doc(user.uid).set(user);
  }

  getUser(uid: string){
  	return this.afs.collection('Users').doc<User>(uid).valueChanges();
  }

  removeUser(uid: string){
  	return this.afs.collection<User>('Users').doc(uid).delete();
  }

}
