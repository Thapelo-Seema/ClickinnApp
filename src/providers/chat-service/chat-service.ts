import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from '../../models/users/user.interface';
import { Observable } from 'rxjs-compat';
import { ChatMessage } from '../../models/chatmessage.interface';
import { Thread } from '../../models/thread.interface';

@Injectable()
export class ChatServiceProvider {
  
  constructor(private afs: AngularFirestore, private db: AngularFireDatabase){
    
  }
  /**This function checks if the sender has the reciever already as part of their contact list and if so it will return 
    an object that contains the thread_id on which the two users chat else the object returned will contain an empty string
    fo the thread_id
  */
  isContact(uid: string, threads: Thread[]): any{
    console.log('contact uid: ', uid);
  	let match = { match: false, thread_id: '' };
    if(threads.length != undefined && threads.length > 0){
      for(let thread of threads)  {
        console.log('Potential match:  ', thread.uid);
        if(thread.uid == uid){
          console.log('match found: ', thread.thread_id);
          return {match: true, thread_id: thread.thread_id};
        }
      }
    }else if(threads){
      let threadss = Object.keys(threads);
      for(let thread of threadss){
        console.log('Potential match:  ', thread);
        if(thread == uid){
          //console.log('match found: ', user.threads.thread.thread_id)
          return { match: true, thread_id: thread };
        }
      }
    }
      return match;
    
    
  }
  /**
    This function creates a new chat thread between two users and pushes the message inside the thread
  */
  async createNewThread(msg: ChatMessage){
    let thread_id = await this.db.list('Threads').push({}).key;
    console.log('Thread id', thread_id);
  	this.db.list(`Threads/${thread_id}`).push(msg);
  	this.afs.collection(`Users`)
    .doc(msg.to.uid)
    .collection('threads')
    .doc(msg.by.uid)
    .set({thread_id: thread_id, uid: msg.by.uid, 
  		displayName: msg.by.displayName, dp: msg.by.dp})
  	.then(() =>{
  		this.afs.collection(`Users`)
      .doc(msg.by.uid)
      .collection('threads')
      .doc(msg.to.uid)
      .set({thread_id: thread_id, uid: msg.to.uid, 
  		displayName: msg.to.displayName, dp: msg.to.dp})
      .then(() => console.log('Done setting threads...'))
      .catch(err => console.log(err));
  	})
  	.catch(err =>{
  		console.log(err);
  	})
  }

  sendMessage(msg: ChatMessage, threads: Thread[]){
    console.log('Message: ', msg)
    let results = this.isContact(msg.to.uid, threads);
    console.log('results: ', results);
  	if(results.match){
      this.db.list(`Threads/${results.thread_id}`).push(msg);
  	}else{
  		this.createNewThread(msg);
  	}
  }

  getThreadChats(thread_id):Observable<ChatMessage[]>{
    return this.db.list<ChatMessage>(`Threads/${thread_id}`).valueChanges();
  }

  getThreads(user: User): Observable<Thread[]>{
		return this.afs.collection('Users').doc(user.uid).collection<Thread>('threads').valueChanges();
  }


}
