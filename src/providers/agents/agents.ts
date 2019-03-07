import { Injectable } from '@angular/core';
import { Agent } from '../../models/agent.interface';
import { AngularFirestore , AngularFirestoreCollection} from 'angularfire2/firestore';
/*
  Generated class for the AgentsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AgentsProvider {

  constructor(private afs: AngularFirestore) {
    console.log('Hello AgentsProvider Provider');
  }

  /**
  *This function will create an entry in the agents database to store the agents details like:
  *user id
  *phone number
  *areas served
  */
  createNewAgent(agent: Agent){
  	return this.afs.collection('Agents').doc(agent.uid).set(agent);
  }

}
