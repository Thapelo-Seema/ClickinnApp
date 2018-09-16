import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Search } from '../../models/search.interface';
import { map } from 'rxjs-compat/operators/map';

@Injectable()
export class SearchfeedProvider {

  constructor(private afs: AngularFirestore) {
  }

  getAllSearches(): Observable<Search[]>{
    return this.afs.collection<Search>('Searches2').valueChanges()
  }

  getSeekerSearches(uid: string): Observable<Search[]>{
  	return this.afs.collection<Search>('Searches2', ref => ref.where('searcher_id', '==', uid))
    .valueChanges()
  }

  getHostFeeds(locations: string[]): Observable<Search[]>{
    return this.afs.collection<Search>('Searches2')
    .valueChanges()
    .pipe(
      map(searches => searches.filter(search => locations.indexOf(search.Address.locality_lng) != -1))
    ) 
  }

  getSearchesOfArea(area: string){
    return this.afs.collection('Searches2', ref => ref.where('Address.locality_lng', '==', area))
  }

  getSearchesSince(){
  	
  }

}
