import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Search } from '../../models/search.interface';
import { map } from 'rxjs-compat/operators/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/take';
import { User } from '../../models/users/user.interface';
import { ServiceDeal } from '../../models/service_deal.interface';
//import { take } from 'rxjs-compat/operators/take';
import { Subscription } from 'rxjs-compat/Subscription';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

interface QueryConfig {
  path: string, //  path to collection
  field: string, // field to orderBy
  limit: number, // limit per query
  reverse: boolean, // reverse order?
  prepend: boolean // prepend to source?
}

@Injectable()
export class SearchfeedProvider {

  // Source data
  private _done = new BehaviorSubject(false);
  private _loading = new BehaviorSubject(false);
  private _data = new BehaviorSubject([]);

  //private query: QueryConfig;

  // Observable data
  data: Observable<any> = this._data.asObservable();
  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable();
  data1Subs: Subscription;
  data2Subs: Subscription;
  constructor(private afs: AngularFirestore, private http: HttpClient) {
  }

reset(){
  console.log('reseting...')
  this.data = this._data.asObservable()
  this._data.next([])
  this._done.next(false);
}

getRequest(url: string){
  const headers = new HttpHeaders();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return this.http.post(url, {}, {headers})
  //return this.http.get(url);
}

sendMail(search: Search, sender: string, msg: string){
  let url = "https://us-central1-clickinn-996f0.cloudfunctions.net/sendMail";
  let params: HttpParams = new HttpParams()
  .set("dest", search.searcher_email)
  .set("sender", sender)
  .set("msg", msg);
  return this.http.get(url, {params: params});
}

unsubscribe(){
  console.log('searchfeed unsubscribing...')
  this.reset()
  if(this.data1Subs) this.data1Subs.unsubscribe();
  if(this.data2Subs) this.data2Subs.unsubscribe();
}

refresh(){
  this.reset()
  this.getAllSearches();
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
    this.data1Subs = col.snapshotChanges()
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
    .subscribe(arr =>{
      this.data = this._data.asObservable()
      .scan((acc, val) =>{
        return acc.concat(val);
      })
    })
    return this.data1Subs;
  }

  private mapAndUpdateMore(col: AngularFirestoreCollection<any>) {
    if (this._done.value || this._loading.value) { return };
    // loading
    this._loading.next(true)
    // Map snapshot with doc ref (needed for cursor)
    this.data2Subs = col.snapshotChanges()
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
    .subscribe()
    return this.data2Subs;
  }

  getAllSearches(){
    //console.log('Getting all seraches : ')
    const first = this.afs.collection<Search>('Searches2', ref => {
      return ref.orderBy('timeStamp', 'desc')
      .limit(15)
      }
     )
    this.mapAndUpdate(first)
    this.data = this._data.asObservable()
    .scan((acc, val) =>{
      return acc.concat(val);
    })
  }

   // Retrieves additional data from firestore
  moreAllSearches() {
    //console.log('Getting more all searches : ')
    const cursor = this.getCursor()
    const more = this.afs.collection('Searches2', ref => {
      return ref
      .orderBy('timeStamp', 'desc' )
      .limit(15)
      .startAfter(cursor)
    })
    this.mapAndUpdateMore(more)
  }

  getSeekerSearches(uid: string){
  	let first = this.afs.collection<Search>('Searches2', ref => 
      ref.where('searcher_id', '==', uid)
      .orderBy('timeStamp', 'desc')
      .limit(10)
      )
    this.mapAndUpdate(first);

    this.data = this._data.asObservable()
    .scan((acc, val) =>{
      return acc.concat(val);
    })
  }

  moreSeelerSearches(uid: string) {
    const cursor = this.getCursor()
    const more = this.afs.collection('Searches2', ref => {
      return ref
              .where('searcher_id', '==', uid)
              .orderBy('timeStamp', 'desc' )
              .limit(10)
              .startAfter(cursor)
    })
    this.mapAndUpdate(more)
  }

  getHostFeeds(locations: string[]): Observable<Search[]>{
    return this.afs.collection<Search>('Searches2', ref => ref.orderBy('timeStamp', 'desc'))
    .valueChanges()
    .pipe(
      map(searches => searches.filter(search => locations.indexOf(search.Address.locality_lng) != -1))
    ) 
  }

  getSearchesOfArea(area: string){
    //console.log('Getting seraches of area: ', area)
    let first = this.afs.collection<Search>('Searches2', ref => ref
      .where('Address.locality_lng', '==', area)
      .orderBy('timeStamp', 'desc')
      .limit(15)
    )
    this.mapAndUpdate(first);
    this.data = this._data.asObservable()
    .scan( (acc, val) =>{
      return acc.concat(val)
    })
  }

  moreAreaSearches(area: string) {
    //console.log('Getting more searches of area: ', area)
    const cursor = this.getCursor()
    const more = this.afs.collection('Searches2', ref => {
      return ref
      .where('Address.locality_lng', '==', area)
      .orderBy('timeStamp', 'desc' )
      .limit(15)
      .startAfter(cursor)
    })
    this.mapAndUpdateMore(more)
  }

  getSearchesSince(){
  	
  }

  getAllLandLords(){
    return this.afs.collection<User>(`Users`, ref =>{
      return ref.where('user_type', '==', 'landlord')
    })
    .valueChanges()
  }

  getLandLordsByLocation(location: any){
    let match: boolean = false;
    return this.afs.collection<User>('Users', ref =>{
      return ref.where('user_type', '==', 'landlord')
    })
    .valueChanges()
    .map(users =>{
      return users.filter(user => {
        user.locations.forEach(loc =>{
            if(this.returnFirst(loc.description) == this.returnFirst(location.description)) match = true;
        })
        return match;
      })
    })
  }

  returnFirst(input: string): string{
    if(input == undefined) return '';
    return input.split(',')[0] + ', ' + input.split(',')[1];
  }

  proposeAgentService(deal: ServiceDeal){
    let deall = deal;
    deall.id = deal.agent_uid + deal.landlord_uid;
    return this.afs.collection<ServiceDeal>('AgentProposals').doc(deall.id).set(deall)
  }

  updateProposal(deal: ServiceDeal){
    let deall = deal;
    deall.id = deal.agent_uid + deal.landlord_uid;
    return this.afs.collection<ServiceDeal>('AgentProposals').doc(deall.id).set(deall)
  }

  getLandlordAgents(uid: string){
    return this.afs.collection<ServiceDeal>('AgentProposals', ref =>{
      return ref.where('landlord_uid', '==', uid)
                .where('landlord_agreed', '==', true)
    }).valueChanges()
  }

  getAgentsLandlords(uid: string){
    return this.afs.collection<ServiceDeal>('AgentProposals', ref =>{
      return ref.where('agent_uid', '==', uid)
                .where('landlord_agreed', '==', true)
    }).valueChanges()
  }

  getLandlordAgentProposals(uid: string){
    return this.afs.collection<ServiceDeal>('AgentProposals', ref =>{
      return ref.where('landlord_uid', '==', uid)
    }).valueChanges()
  }

}
