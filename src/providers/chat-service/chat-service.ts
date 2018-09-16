import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { LocalDataProvider } from '../local-data/local-data';
import { User } from '../../models/users/user.interface';
import { Observable } from 'rxjs-compat';
import { ChatMessage } from '../../models/chatmessage.interface';
import { Thread } from '../../models/thread.interface';
import { map } from 'rxjs-compat/operators/map';

@Injectable()
export class ChatServiceProvider {
  currentUser: User;
  constructor(private afs: AngularFirestore, private storage: LocalDataProvider){
    this.storage.getUser().then(user =>{
    	this.currentUser = user;
    	console.log('Chat service loading current user... ', this.currentUser);
    })
  }

  isContact(uid: string, user: User): any{
  	let match = { match: false, thread_id: '' };
    if(user.threads.length != undefined && user.threads.length > 0){
      user.threads.forEach(thread => {
        if(thread.uid == uid){
          return {match: true, thread_id: thread.thread_id};
        }
      })
    }else{
      let threads = Object.keys(user.threads);
      threads.forEach(thread =>{
        if(thread == uid){
          return { match: true, thread_id: user.threads.thread.thread_id };
        }
      })
    }
  	return match;
  }

  async createNewThread(msg: ChatMessage){
  	let thread_id = await this.afs.collection('Threads').add(msg);
  	this.afs.collection(`Users/${msg.to.uid}/threads`).doc(msg.by.uid).set({thread_id: thread_id.id, uid: msg.by.uid, 
  		displayName: msg.by.displayName, dp: msg.by.dp})
  	.then(() =>{
  		this.afs.collection(`Users/${msg.by.uid}/threads`).doc(msg.to.uid).set({thread_id: thread_id.id, uid: msg.to.uid, 
  		displayName: msg.to.displayName, dp: msg.to.dp})
  	})
  	.catch(err =>{
  		console.log(err);
  	})
  }

  sendMessage(msg: ChatMessage, user: User){
  	if(this.isContact(msg.to.uid, user).match){
  		this.afs.collection(`Threads/${this.isContact(msg.to.uid, user).thread_id}`).add(msg);
  	}else{
  		this.createNewThread(msg);
  	}
  }

  getThreadChats(thread_id):Observable<ChatMessage[]>{
  	return this.afs.collection(`Threads`).doc<ChatMessage[]>(thread_id).valueChanges()
    .pipe(
      map(data => {
        console.log('Here are the chats ', data);
        return data;
      })
    )
    
  }

  getThreads(user: User): Observable<Thread[]>{
		console.log('Loading threads from chat service...');
		return this.afs.collection('Users').doc(user.uid).collection<Thread>('threads').valueChanges();
  }


}
