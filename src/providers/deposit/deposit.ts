import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { ATMDeposit } from '../../models/atmdeposit.interface';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs-compat';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/take';


/*
  Generated class for the DepositProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DepositProvider {
  private _done = new BehaviorSubject(false);
  private _loading = new BehaviorSubject(false);
  private _data = new BehaviorSubject([]);

  // Observable data
  data: Observable<any>;
  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable();
  constructor(private afs: AngularFirestore) {
    console.log('Hello DepositProvider Provider');
  }

  async addDeposit(deposit: ATMDeposit): Promise<void>{
  	let lDep: ATMDeposit = deposit;
  	let id = await this.afs.collection('Deposits').add(deposit);
  	lDep.id = id.id;
  	return this.afs.collection('Deposits').doc(id.id).set(lDep);
  }

  updateDeposit(deposit: ATMDeposit): Promise<void>{
  	return this.afs.collection('Deposits').doc(deposit.id).set(deposit);
  }

  getPricing(){
  	return this.afs.collection('Clickinn_Pricing').doc<any>('AZgFu6nqYzZrdKm5Kd1m').valueChanges();
  }

  getDepositById(id: string){
  	return this.afs.collection('Deposits').doc<ATMDeposit>(id)
  	.valueChanges()
  }

  getHostDeposits(uid: string){
  	return this.afs.collection('Deposits', ref => ref.where('to.uid', '==', uid))
  }

  initGetHostDeposits(uid: string){
    const first = this.afs.collection('Deposits', ref => 
      ref.where('to.uid', '==', uid)
      .orderBy('timeStamp', 'desc')
      .limit(15)
    )

    this.mapAndUpdate(first)

    this.data = this._data.asObservable()
    .scan((acc, val) =>{
      return acc.concat(val)
    })
  }

  moreHostDeposits(uid: string){
    const cursor = this.getCursor()
    const more = this.afs.collection('Deposits', ref => 
      ref.where('to.uid', '==', uid)
      .orderBy('timeStamp', 'desc')
      .limit(15)
      .startAfter(cursor)
    )

    this.mapAndUpdate(more)
  }

  getTenantDepsits(uid: string){
  	return this.afs.collection('Deposits', ref => ref.where('by.uid', '==', uid))
  }

  initGetTenantDeposits(uid: string){
    const first = this.afs.collection('Deposits', ref => 
      ref.where('by.uid', '==', uid)
      .orderBy('timeStamp', 'desc')
      .limit(15)
    )

    this.mapAndUpdate(first)

    this.data = this._data.asObservable()
    .scan((acc, val) =>{
      return acc.concat(val)
    })
  }

  moreTenantDeposits(uid: string){
    const cursor = this.getCursor()
    const more = this.afs.collection('Deposits', ref => 
      ref.where('by.uid', '==', uid)
      .orderBy('timeStamp', 'desc')
      .limit(15)
      .startAfter(cursor)
    )

    this.mapAndUpdate(more)

  }

   // Determines the doc snapshot to paginate query 
  private getCursor() {
    const current = this._data.value
    if (current.length) {
      return current[current.length - 1].doc 
    }
    return null
  }


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

}
