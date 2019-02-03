import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController  } from 'ionic-angular';
import { Property } from '../../models/properties/property.interface';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { LocalDataProvider } from '../../providers/local-data/local-data';
//import { Subscription } from 'rxjs-compat/Subscription';
import { ToastSvcProvider } from '../../providers/toast-svc/toast-svc';
import { User } from '../../models/users/user.interface';
import { Observable } from 'rxjs-compat/Observable';
import { take } from 'rxjs-compat/operators/take';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
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
  //@ViewChild(Content) content: Content;
  buildings: Observable<Property[]> ;
  loader = this.loadingCtrl.create();
  done: boolean = false;
  noBuildings: boolean = false;
  user: User;
  imagesLoaded: boolean[] = 
  [ false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, 
    false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false
  ]; 
  constructor(
    public navCtrl: NavController, 
    //public navParams: NavParams, 
    private accom_svc: AccommodationsProvider,
  	private storage: LocalDataProvider,
    private toast_svc: ToastSvcProvider,
    private object_init: ObjectInitProvider,
    private errorHandler: ErrorHandlerProvider,
    private loadingCtrl: LoadingController){
    this.loader.present()
    /*
      Initializing the user and getting the users properties into an array
    */
  	this.storage.getUser().then(user =>{
      this.user = this.object_init.initializeUser2(user);
      this.buildings = this.accom_svc.getUsersProperties(user.uid)
  		this.accom_svc.getUsersProperties(user.uid)
      .pipe(take(1))
      .subscribe(props =>{
        if(props.length > 0){
          props.forEach(prop =>{
            this.imagesLoaded.push(false);
          })
          this.loader.dismiss()
        }else{
          this.loader.dismiss()
          this.noBuildings = true;
          //this.toast_svc.showToast('You have no properties registered on Clickinn, go ahead and upload properties before using this feature.')
        }
  		},
      err =>{
        this.loader.dismiss()
        this.toast_svc.showToast('Error loading properties');
      })
  	})
    .catch(err =>{
      this.loader.dismiss()
      this.errorHandler.handleError(err)
    })
  }

  ionViewDidLoad(){
  }

  ionViewDidLeave(){
  }

  gotoUploadApart(){
    this.navCtrl.push('UploadAndEarnPage')
  }

  /*
    This method caches (on local storage) the property object passed to it and navigates to the EditPropertyPage
  */
  gotoProperty(prop: Property){
    this.storage.setProperty(prop).then(prp =>{
      this.navCtrl.push('EditPropertyPage');
    })
    .catch(err => {
      this.errorHandler.handleError(err)
    })
  }

}
