import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Search } from '../../models/search.interface';
import { map } from 'rxjs-compat/operators/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/take';

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

  private query: QueryConfig;

  // Observable data
  data: Observable<any>;
  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable();

  constructor(private afs: AngularFirestore) {
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

  getAllSearches(){
    
    const first = this.afs.collection<Search>('Searches2', ref => {
      return ref.orderBy('timeStamp', 'desc')
      .limit(10)
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
    const cursor = this.getCursor()

    const more = this.afs.collection('Searches2', ref => {
      return ref
              .orderBy('timeStamp', 'desc' )
              .limit(10)
              .startAfter(cursor)
    })
    this.mapAndUpdate(more)
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
    let first = this.afs.collection<Search>('Searches2', ref => ref
      .where('Address.locality_lng', '==', area)
      .orderBy('timeStamp', 'desc')
      .limit(10)
      )

    this.mapAndUpdate(first);

    this.data = this._data.asObservable()
    .scan( (acc, val) =>{
      return acc.concat(val)
    })
  }

  moreAreaSearches(area: string) {
    const cursor = this.getCursor()
    const more = this.afs.collection('Searches2', ref => {
      return ref
              .where('Address.locality_lng', '==', area)
              .orderBy('timeStamp', 'desc' )
              .limit(10)
              .startAfter(cursor)
    })
    this.mapAndUpdate(more)
  }

  getSearchesSince(){
  	
  }

}
