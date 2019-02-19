import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { User } from '../../models/users/user.interface';
import { Observable } from 'rxjs-compat';
import { ChatMessage } from '../../models/chatmessage.interface';
import { Thread } from '../../models/thread.interface';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/take';
import { SupportMessage } from '../../models/support_message.interface';
import { ObjectInitProvider } from '../object-init/object-init';
import { take } from 'rxjs-compat/operators/take';

@Injectable()
export class ChatServiceProvider {
  private _done = new BehaviorSubject(false);
  private _loading = new BehaviorSubject(false);
  private _data = new BehaviorSubject([]);

  // Observable data
  data: Observable<any>;
  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable();
  constructor(private afs: AngularFirestore, private object_init: ObjectInitProvider){
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
    //let thread_id = await this.db.list('Threads').push({}).key;
    let docRef = await this.afs.collection('Threads').add({});
    let thread_id = docRef.id;
    let msg2 = this.object_init.initializeChatMessag2(msg);
    let chat = await this.afs.collection(`Threads/${thread_id}/chats`).add(msg);
    msg2.id = chat.id;
    let unseen = {
      message_id: msg2.id,
      timeStamp: msg2.timeStamp,
      thread_id: thread_id
    }
    this.afs.collection('ThreadTimeStamps').doc(msg.by.uid).collection('timeStamps').doc(thread_id).set({timeStamp: msg2.timeStamp})
    this.afs.collection('ThreadTimeStamps').doc(msg.to.uid).collection('timeStamps').doc(thread_id).set({timeStamp: msg2.timeStamp})
    this.afs.collection('UnseenMessages').doc(msg.to.uid).collection('Messages').doc(msg2.id).set(unseen)
    this.afs.collection(`Threads`).doc(thread_id).collection('chats').doc(msg2.id).set(msg2)
    /*console.log('Thread id', thread_id);
  	this.db.list(`Threads/${thread_id}`).push(msg);*/
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

  async sendMessage(msg: ChatMessage, threads: Thread[]){
    console.log('Message: ', msg)
    let results = this.isContact(msg.to.uid, threads);
    console.log('results: ', results);
  	if(results.match){
      let msg2 = this.object_init.initializeChatMessag2(msg);
      console.log('First message...', msg2)
      let chat = await this.afs.collection(`Threads`).doc(results.thread_id).collection('chats').add(msg);
      msg2.id = chat.id;
      console.log('Second message', msg2)
      let unseen = {
        message_id: msg2.id,
        timeStamp: msg2.timeStamp,
        thread_id: results.thread_id
      }
      this.afs.collection('ThreadTimeStamps').doc(msg.by.uid).collection('timeStamps').doc(results.thread_id).set({timeStamp: msg2.timeStamp})
      this.afs.collection('ThreadTimeStamps').doc(msg.to.uid).collection('timeStamps').doc(results.thread_id).set({timeStamp: msg2.timeStamp})
      this.afs.collection('UnseenMessages').doc(msg.to.uid).collection('Messages').doc(msg2.id).set(unseen)
      return this.afs.collection(`Threads`).doc(results.thread_id).collection('chats').doc(msg2.id).set(msg2);
  	}else{
  		this.createNewThread(msg);
  	}
  }

  removeUnseenMessage(msgId: string, uid: string){
    return this.afs.collection('UnseenMessages').doc(uid).collection('Messages').doc(msgId).delete()
  }

  markAsSeen(thread_id, msg: ChatMessage){
    return this.afs.collection(`Threads`).doc(thread_id).collection('chats').doc(msg.id).update({seen: true})
  }

  sendSupportMessage(msg: SupportMessage){
    this.afs.collection('Support').doc(msg.user.uid).set({user: msg.user, text: msg.text, timeStamp: msg.timeStamp, assigned: msg.assigned_to})
    this.afs.collection(`Support`).doc(msg.user.uid).collection('chats').add(msg);
  }

  replySupport(msg: SupportMessage){
    this.afs.collection('Support').doc(msg.user.uid).set({user: msg.user, text: msg.text, timeStamp: msg.timeStamp, assigned: msg.assigned_to})
    this.afs.collection(`Support`).doc(msg.user.uid).collection('chats').add(msg);
  }

  getUserSupportMessages(uid: string){
    return this.afs.collection(`Support`).doc(uid).collection<SupportMessage>('chats', ref => ref.orderBy('timeStamp', 'asc'))
    .valueChanges();
  }

  getAllSupport(){
    return this.afs.collection('Support').valueChanges()
  }

  /*getAdminSupportMessages(uid: string){
    return this.afs.collection(`Support`).doc(uid).collection<SupportMessage>('chats', ref => ref.orderBy('timeStamp', 'asc'))
    .valueChanges();
  }*/

  getThreadChats(thread_id):Observable<ChatMessage[]>{
    return this.afs.collection(`Threads`).doc(thread_id).collection<ChatMessage>('chats', ref => ref.orderBy('timeStamp', 'asc'))
    .valueChanges();
  }

  getUnseenThreadChats(thread_id: string, uid: string){
    return this.afs.collection(`UnseenMessages`)
    .doc(uid)
    .collection('Messages', ref =>
        ref.where('thread_id', '==', thread_id)
      )
    .valueChanges();
  }

  getUnseenChats(uid: string){
    return this.afs.collection('UnseenMessages').doc(uid).collection('Messages', ref =>
      ref.orderBy('timeStamp', 'desc')).valueChanges();
  }

  getThreadTimeStamps(uid: string){
    return this.afs.collection('ThreadTimeStamps').doc(uid).collection('timeStamps', ref =>
      ref.orderBy('timeStamp', 'desc')).snapshotChanges()
  }

  /*initGetThreadChats(thread_id){
    console.log('initGetThreadChats...')
    const first = this.afs.collection(`Threads`).doc(thread_id).collection<ChatMessage>('chats', ref => 
      ref.orderBy('timeStamp', 'asc')
      .limit(15)
     )

    this.mapAndUpdate(first);

    this.data = this._data.asObservable()
    .scan((acc, val) =>{
      console.log('chats: ', acc)
      return acc.concat(val)
    })
  }*/

  /*moreThreadChats(thread_id){
    const cursor = this.getCursor();

    const more = this.afs.collection(`Threads`).doc(thread_id).collection<ChatMessage>('chats', ref => 
      ref.orderBy('timeStamp', 'asc')
      .limit(15)
      .startAfter(cursor)
     )

    this.mapAndUpdate(more);
  }*/

  getThreads(user: User): Observable<Thread[]>{
		return this.afs.collection('Users').doc(user.uid).collection<Thread>('threads').valueChanges();
  }

  /*initGetThreads(user: User){
    console.log('initGetThreads...')
    const first = this.afs.collection('Users').doc(user.uid).collection<Thread>('threads', ref =>{
      return ref.limit(15)
    })

    this.mapAndUpdate(first)

    this.data = this._data.asObservable()
    .scan((acc, val) =>{
      return acc.concat(val)
    })
  }

  moreThreads(user: User){
    const cursor = this.getCursor();
    if(cursor == null) return;
    const more = this.afs.collection('Users').doc(user.uid).collection<Thread>('threads', ref =>{
      return ref.limit(15)
                .startAfter(cursor)
    })

    this.mapAndUpdate(more);
  }

   // Determines the doc snapshot to paginate query 
  private getCursor() {
    const current = this._data.value
    console.log('current: ', current)
    if (current.length) {
      console.log('cursor: ', current[current.length - 1].doc)
      return current[current.length - 1].doc 
    }
    return null
  }

  reset(){
    console.log('reseting...')
    this._data.next([])
    this._done.next(false);
  }
*/

  // Maps the snapshot to usable format the updates source
  private mapAndUpdate(col: AngularFirestoreCollection<any>) {

    if (this._done.value || this._loading.value) { return };

    // loading
    this._loading.next(true)

    // Map snapshot with doc ref (needed for cursor)
    return col.snapshotChanges()
      .do(arr => {
        let values = arr.map(snap => {
          const data = snap.payload.doc.data()
          const doc = snap.payload.doc
          return { ...data, doc }
        })
  
        // update source with new values, done loading
        this._data.next(values)
        this._loading.next(false)

        // no more values, mark done
        if (!values.length) {
          console.log('done!')
          this._done.next(true)
        }
    })
    .take(1)
    .subscribe()
  }

  updateMessage(thread_id: string, msg: ChatMessage){
    return this.afs.collection(`Threads`).doc(thread_id).collection<ChatMessage>('chats').doc(msg.id).set(msg)
  }


}
