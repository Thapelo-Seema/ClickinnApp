import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LocalDataProvider }  from '../../providers/local-data/local-data';
import { Thread } from '../../models/thread.interface';
//import { ObjectInitProvider } from '../../providers/object-init/object-init';

@IonicPage()
@Component({
  selector: 'page-confirmation',
  templateUrl: 'confirmation.html',
})
export class ConfirmationPage {
  confirmation = {
		title: 'string',
 		message: 'string'
  }
	
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private viewCtrl: ViewController,
    private storage: LocalDataProvider
    ) {
  }

  ionViewWillLoad() {
    this.confirmation = this.navParams.data;  
  }

  close(){
  	this.viewCtrl.dismiss(false);
  }

  confirm(){
  	this.viewCtrl.dismiss(true);
  }

  gotoProfile(){
    this.navCtrl.push('ProfilePage')
  }

  gotoThread(){
    let thread: Thread = {
      uid: '',
      thread_id: this.navParams.data.thread_id,
      dp: '',
      displayName: ''
    }
    this.storage.setThread(thread).then(val =>{
      this.navCtrl.push('ChatThreadPage', thread)
    })
    .catch(err => console.log(err))
  }

}
