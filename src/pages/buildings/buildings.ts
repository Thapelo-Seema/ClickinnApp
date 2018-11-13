import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { Property } from '../../models/properties/property.interface';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { Subscription } from 'rxjs-compat/Subscription';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
import { User } from '../../models/users/user.interface';

/**
 * Generated class for the BuildingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-buildings',
  templateUrl: 'buildings.html',
})
export class BuildingsPage {
  @ViewChild(Content) content: Content;
  buildings: Property[] = [];
  loading: boolean = true;
  loadingMore: boolean = false;
  done: boolean = false;
  buildingSub: Subscription = null;
  user: User;
  imagesLoaded: boolean[] = 
      [false, false, false, false, false, false, false, false, false, false,
       false, false, false, false, false, false, false, false, false, false, 
       false,false, false, false, false, false, false, false, false, false,
       false,false, false, false, false, false, false, false, false, false,
       false,false, false, false, false, false, false, false, false, false
       ];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private accom_svc: AccommodationsProvider,
  	private local_db: LocalDataProvider,
    private toast_svc: ToastSvcProvider){

    this.accom_svc.loading.subscribe(data =>{
      this.loadingMore = data;
    })

    this.accom_svc.done.subscribe(data =>{
      this.done = data;
      if(this.done == true) this.loadingMore = false;
    })
  	this.local_db.getUser().then(user =>{
      this.user = user;
      this.accom_svc.initUserProperties(user.uid)
  		this.buildingSub =  this.accom_svc.getUsersProperties(user.uid)
      .subscribe(props =>{
        if(props.length > 0){
          this.buildings = props;
          props.forEach(prop =>{
            this.imagesLoaded.push(false);
          })
          this.loading = false;
        }else{
          this.loading = false;
          this.toast_svc.showToast('You have no properties registered on Clickinn, go ahead and upload properties before using this feature.')
        }
  		})
  	})
  }

  ionViewDidLoad() {
    this.monitorEnd()
  }

  ionViewDidLeave(){
    if(this.buildingSub) this.buildingSub.unsubscribe();
  }

  gotoProperty(prop: Property){
    this.local_db.setProperty(prop).then(prp =>{
      this.navCtrl.push('EditPropertyPage');
    })
    .catch(err => {
      console.log(err);
    })
  }

  monitorEnd(){
    //console.log('Content scrollHeight = ', this.content.scrollHeight)
    this.content.ionScrollEnd.subscribe(ev =>{
    let height = ev.scrollElement.scrollHeight;
    let top = ev.scrollElement.scrollTop;
    let offset = ev.scrollElement.offsetHeight;
      if(top > height - offset - 1){
        this.accom_svc.moreUserProperties(this.user.uid)
      }
    })
  }

}
