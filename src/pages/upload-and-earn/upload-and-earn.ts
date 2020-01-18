import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, 
  ToastController, Content, LoadingController } from 'ionic-angular';
import { Apartment } from '../../models/properties/apartment.interface';
import { Property } from '../../models/properties/property.interface';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { Image } from '../../models/image.interface';
import { AngularFireStorage } from 'angularfire2/storage';
import { FileUpload } from '../../models/file-upload.interface';
import { AngularFirestore } from 'angularfire2/firestore';
import { MapsProvider } from '../../providers/maps/maps';
import { User } from '../../models/users/user.interface';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { AccommodationsProvider } from '../../providers/accommodations/accommodations';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { Subscription } from 'rxjs-compat/Subscription';
import { SearchfeedProvider } from '../../providers/searchfeed/searchfeed';
import { take } from 'rxjs-compat/operators/take';
//import { Observable } from 'rxjs-compat/Observable';
import { IonicStepperComponent } from 'ionic-stepper';
@IonicPage()
@Component({
  selector: 'page-upload-and-earn',
  templateUrl: 'upload-and-earn.html',
})
export class UploadAndEarnPage{
  @ViewChild(Content) content: Content;
  @ViewChild('stepper') stepper: IonicStepperComponent;
  @ViewChild('apartmentpictures') apartment_pictures_input: ElementRef;
  apartment: Apartment;
  building: Property;
  buildings: Property[] = [];
  address: string = '';
  nearby: string = '';
  apartmentImagesAdded: boolean = false;
  propertyImagesAdded:boolean = false;
  apartmentImages: FileUpload[] = [];
  propertyImages: FileUpload[] = [];
  loader = this.loadingCtrl.create();
  apartImgCount: number  = 0;
  buildingImgCount: number  = 0;
  predictionsAdd: any[] = [];
  predictionsNby: any[] = [];
  user: User;
  buildingSelected: boolean = false;
  image: any = "assets/imgs/placeholder.png";
  dpChanged: boolean = false;
  recentDp: FileUpload;
  openList: boolean = false;
  onMobile: boolean = false;
  existing: boolean = false;
  progss: number = 0;
  propertySubs: Subscription;
  landlords: any[] = [];
  price: string = '';
  deposit: string = '';
  quantity: string = '';
  noLandlords: boolean = false;
  imagesLoaded: boolean[] = 
  [
    false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, 
    false,false, false, false, false, false, false, false, false, false,
    false,false, false, false, false, false, false, false, false, false,
    false,false, false, false, false, false, false, false, false, false
  ];
  constructor(
    private alertCtrl: AlertController, 
    public navCtrl: NavController, 
    public navParams: NavParams,
    private camera: Camera, 
    private errHandler: ErrorHandlerProvider, 
    private platform: Platform,
    private afs: AngularFirestore, 
    private afstorage: AngularFireStorage, 
    private toast: ToastController,
    private map_svc: MapsProvider, 
    private storage: LocalDataProvider, 
    private accom_svc: AccommodationsProvider, 
    private object_init: ObjectInitProvider,
    private loadingCtrl: LoadingController,
    private searchfeed_svc: SearchfeedProvider){
    this.loader.present(); //Show the loader
    this.apartment = this.object_init.initializeApartment(); //Initialise apartment fields
    this.building = this.object_init.initializeProperty(); //Initialise property fields

    this.platform.ready().then(val =>{
      if(platform.is('cordova')) this.onMobile = true; //If the app is running from cordova
      this.storage.getUser().then(user =>{ //getting user from local storage
        this.user = this.object_init.initializeUser2(user);
        this.building.user_id = user.uid; //Setting the user id of the building
        //Update the landlords that this agent is working with
        this.searchfeed_svc.getAgentsLandlords(user.uid)
        .pipe(take(1))
        .subscribe(landlords =>{
          if(landlords.length > 0){
            landlords.forEach(lnd =>{
              this.landlords.push(lnd)
            })
          }else{
            this.noLandlords = true;
          }
        })
        //If a navigation parameter containing prop_id is passed, we are just editting an existing apartment
        if(this.navParams.data.prop_id != undefined){
          console.log(this.navParams.data)
          this.initializeExisting(this.navParams.data) //Initialise existing apartment
        }else{
          this.propertySubs = this.accom_svc.getUsersProperties(user.uid).subscribe(buildings =>{
            //Subscribing to the users properties and declaring a loaded - boolean for each buildings dp
            this.buildings = buildings;
            buildings.forEach(bld =>{
              this.imagesLoaded.push(false);
            })
            this.loader.dismiss() //Switch off loader
          })
        }
      })
    })
  }

  ionViewDidLoad() {
    //this.showAlert();
  }

  scrollToTop(){
    this.content.scrollToTop();
  }

  updateApartmentImgs(event){
   //console.log(event.target.files);
   //Map Files object to an array of files
   let files = Object.keys(event.target.files).map(ind =>{
     let file = event.target.files[ind];
     return file;
   })
   //console.log(files);
   //Create a FileUpload object for each image file and push it into the apartmentImages array
   files.forEach(fl =>{
     this.apartImgCount++;
     this.apartmentImagesAdded = true;
     let image: FileUpload ={
       file: fl,
       path: 'ApartmentImages',
       url: '',
       name: fl.name,
       progress: 0
     }
     this.apartmentImages.push(image);
   })  
  }

  addBuildingPics(event){
    //console.log(event.target.files);
    //Map Files object to an array of files
    let files = Object.keys(event.target.files).map(ind =>{
     let file = event.target.files[ind];
     return file;
   })

   //Create a FileUpload object for each image file and push it into the propertyImages array
   files.forEach(fl =>{
     this.buildingImgCount++;
     this.propertyImagesAdded = true;
   let image: FileUpload ={
     file: fl,
     path: 'PropertyImages',
     url: '',
     name: fl.name,
     progress: 0
   }
   this.propertyImages.push(image);
   })
  }

  initializeExisting(apartment: Apartment){
    this.existing = true;
    this.storage.setApartment(apartment)
    .then(() =>{
      this.apartment = this.object_init.initializeApartment2(apartment);
      this.building = this.object_init.initializeProperty2(apartment.property);
      this.loader.dismiss()
    })
  }

  ionViewWillLeave(){
    console.log('uplaod page unsubscrinbing...')
    this.propertySubs.unsubscribe();
  }

  selectChange(e) {
    console.log(e);
  }

  showList(){
    this.openList = true;
  }

  closeList(){
    this.openList = false;
  }

  selectEBuilding(building: Property){
    this.buildingSelected = true;
    this.building = this.object_init.initializeProperty2(building);
    this.apartment.property = this.object_init.initializeProperty2(building);
    this.apartment.prop_id = building.prop_id;
    this.buildings = [];
    this.buildings.push(building);
  }

  showAlert(){
    let alert = this.alertCtrl.create({
      title:    'Upload and Earn',
      subTitle: `Get 10% off your next McDonalds meal !!`,
      message: `Upload a vacant apartment and use your upload code to get discount for your next meal at McDonalds`,
      cssClass: 'alertCtrl',
      buttons: ['OK']
    });
    alert.present();
  }

  addPictures(source: number, destination: number){
    this.apartment_pictures_input.nativeElement.click();
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: source,
      allowEdit: true,
      targetWidth: 800,
      targetHeight: 800,
    }
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
       if(destination == 1){
         this.apartImgCount++;
         this.apartmentImagesAdded = true;
         let image: FileUpload ={
           file: 'data:image/jpeg;base64,' + imageData,
           path: 'ApartmentImages',
           url: '',
           name: `${this.apartment.apart_id}_${this.apartImgCount}.jpg`,
           progress: 0
         }
         this.apartmentImages.push(image);
       }
       else if(destination == 2){
         this.buildingImgCount++;
         this.propertyImagesAdded = true;
         let image: FileUpload ={
           file: 'data:image/jpeg;base64,' + imageData,
           path: 'PropertyImages',
           url: '',
           name: `${this.building.prop_id}_${this.buildingImgCount}.jpg`,
           progress: 0
         }
          this.propertyImages.push(image);
       }
    }).catch(err => {
      console.log(err)
      //this.errHandler.handleError({errCode: 'IMAGE_NOT_SELECTED', message: 'No image selected'});
    })
  }

  uploadApartment(){
    this.apartment.prop_id = this.building.prop_id; //set property id of apartment
    let ldr = this.loadingCtrl.create();
    ldr.present(); //show loader
    //Update apartment dp
    if(this.apartment.images.length > 0){
      if(this.apartment.images[0].url != '' && 
         this.apartment.images[0].url != 'assets/imgs/placeholder.jpg'){
        this.apartment.dP = this.apartment.images[0]
      }else if(this.apartment.images[1].url != '' && 
         this.apartment.images[1].url != 'assets/imgs/placeholder.jpg'){
        this.apartment.dP = this.apartment.images[1]
      }
    }//Update property dp
    if(this.building.images.length > 0){
      if(this.building.images[0].url != '' && 
        this.building.images[0].url != 'assets/imgs/placeholder.jpg'){
        this.building.dP = this.building.images[0]
      }else if(this.building.images[1].url != '' && 
        this.building.images[1].url != 'assets/imgs/placeholder.jpg'){
        this.building.dP = this.building.images[1]
      }
    }
    //Updating apartment that has already been uploaded
    //If property selected from previously uploaded buildings
    if(this.buildingSelected == true){
      console.log('buiding selected')
      this.building.complete = true;
      this.apartment.prop_id = this.building.prop_id;
      this.apartment.user_id = this.user.uid;
      this.apartment.property = this.object_init.initializeProperty2(this.building);
      this.apartment.available = true;
      this.apartment.complete = true;
      this.apartment.timeStampModified = Date.now();
      this.apartment.property.timeStampModified = Date.now();
      this.accom_svc.updateApartment(this.apartment).then(() =>{
        ldr.dismiss();
        this.successful();
        this.storage.setApartment(this.apartment)
        .then(apart =>{
          this.navCtrl.push('InfoPage');
        })
        .catch(err =>{
          ldr.dismiss();
          this.errHandler.handleError(err);
        })
      })
      .catch(err =>{
        ldr.dismiss()
        this.errHandler.handleError(err);
      })
    }
    else{
      this.apartment.prop_id = this.building.prop_id;
      this.apartment.user_id = this.user.uid;
      this.apartment.available = true;
      this.building.timeStampModified = Date.now();
      this.building.complete = true;
      this.apartment.complete = true;
      this.apartment.timeStampModified = Date.now();
      this.apartment.property = this.object_init.initializeProperty2(this.building);
      this.accom_svc.updateApartment(this.apartment)
      .then(() =>{
        ldr.dismiss()
        this.successful();
        this.storage.setApartment(this.apartment)
        .then(apart =>{
          this.navCtrl.push('InfoPage');
          this.uploadBuildingPics()
          .then(() =>{
            console.log('building pics uploaded...')
            this.accom_svc.updateProperty(this.building)
            .then(() =>{
              console.log('building updated...')
               this.apartment.property = this.object_init.initializeProperty2(this.building)
               this.accom_svc.updateApartment(this.apartment)
               .then(() =>{
                 console.log('apartment updated...')
                 this.storage.setApartment(this.apartment)
               })
               .catch(err =>{
                 this.errHandler.handleError(err);
               })
            })
            .catch(err =>{
              this.handleBuidingUploadError();
            })
          })
          .catch(err =>{
            this.handleBuidingUploadError();
          })
        })
        .catch(err =>{
          ldr.dismiss()
          this.errHandler.handleError(err);
        })
      })
      .catch(err =>{
        ldr.dismiss()
        this.errHandler.handleError(err);
      })
    }
  }

  handleBuidingUploadError(){
    let edit: boolean = false;
    let errAlert = this.alertCtrl.create({
      title: 'Property not saved',
      message: 'Error saving the details of this property',
      buttons:
      [
        {
          text: 'Edit property',
          handler: data =>{
            edit = true;
          }
        },
        {
          role: 'cancel',
          text: 'dismiss',
          handler: data =>{
            edit = false;
          }
        }
      ]
    })
    errAlert.present();
    errAlert.onDidDismiss(() =>{
      if(edit == true){
        this.storage.setProperty(this.building)
        .then(() =>{
          this.navCtrl.push('EditPropertyPage')
        })
      }
    })
  }

  selectBuilding(property: Property){
    this.buildingSelected = true;
    this.apartment.prop_id = property.prop_id;
    this.apartment.property = this.object_init.initializeProperty2(property); //adding the building profile to the apartment
    property.images.forEach(image =>{
      this.apartment.property.images.push(image);
    })
  }

  uploadPic(image: FileUpload): Promise<Image>{
    console.log('Uploading pic... ', image)
    const storageRef = this.afstorage.ref(`${image.path}/${image.name}`);
    let uploadTask: any;
    if(image.file.lastModified){
      uploadTask = storageRef.put(image.file);
    }else{
      uploadTask = storageRef.putString(image.file, 'data_url');
    }
     return new Promise<Image>((resolve, reject) => {
      let up1Subs = uploadTask.snapshotChanges().subscribe(
        (snapshot) =>{
          //update the progress property of the upload object
          let up2Subs = uploadTask.percentageChanges().subscribe(progress =>{
            image.progress = progress;
            this.progss = progress;
            console.log('progress... ', image.progress);
          },
          err =>{

          },
          () =>{
            up2Subs.unsubscribe()
          })
        },
        (err) =>{
          //if there's an error log it in the console
          console.log(err);
          reject(err.message)
        },
        () =>{
          let tempUrl = '';
          //on success of the upload, update the url property of the upload object
          let up3Subs = storageRef.getDownloadURL().subscribe(down_url =>{
            tempUrl = down_url;
            }, 
            err =>{
              reject(err.message)
            },
            () =>{
              let image_out: Image = {
                url: tempUrl,
                name: image.name,
                progress: image.progress,
                path: image.path
              }
              up3Subs.unsubscribe();
              up1Subs.unsubscribe();
              resolve(image_out)
            }
          ) 
        }
      )
    })
  }

  uploadPics(pics: FileUpload[]): Promise<Image[]>{
    let images: Image[] = [];
    return new Promise<Image[]>((resolve, reject) =>{
      if(pics){
          pics.forEach(pic =>{
          this.uploadPic(pic).then(image => {
            images.push(image);
            if(images.length == pics.length){
              resolve(images);
            }
          }).catch(err =>{
            reject(err)
          });
        })
      }else{
        reject('No images selected');
        this.loader.dismiss()
      }
    })
  }

  apartmentUpdateOrInit(){
    if(this.existing){
      this.initialApartUpdate();
    }else{
      this.initialApartUpload();
    }
  }

  buildingUpdateOrInit(){
    if(this.existing){
      this.initialBuildinUpdate();
    }else{
      this.initialBuildinUpload();
    }
  }

  initialApartUpload(){
    this.apartment.price = parseFloat(this.price);
    this.apartment.deposit = parseFloat(this.deposit);
    this.apartment.quantity_available = parseFloat(this.quantity)
    this.apartment.user_id = this.user.uid;
    this.apartment.timeStamp = Date.now();
    this.apartment.timeStampModified = Date.now();
    if(this.apartment.by == 'owner'){
      this.apartment.owner == this.user.uid;
    }
    let ldr = this.loadingCtrl.create();
    let update: boolean = false;
    ldr.present();
    if(this.apartment.quantity_available > 0){
      this.apartment.available = true;
    }else{
      let all = this.alertCtrl.create({
        title: 'Zero apartments',
        message: 'You have indicated that there are 0 of these apartments available, do you want to update the number of these ?',
        buttons:[
          {
            text: 'No continue',
            role: 'cancel'
          },
          {
            text: 'Yes I want to update the number',
            role: 'cancel',
            handler: () =>{
              update = true;
            }
          }
        ]
      })
      all.present()
      all.onDidDismiss(dat =>{
        if(update == true){
          this.stepper.setStep(0);
          return;
        }else{
          this.apartment.available = false;
        }
      })
    }
    this.afs.collection('Apartments').add(this.apartment)
    .then(apartRef =>{
      this.apartment.apart_id = apartRef.id;
      this.accom_svc.updateApartment(this.apartment);
      console.log(this.apartment)
      console.log(this.building)
      ldr.dismiss();
    })
    .catch(err => {
      ldr.dismiss();
      console.log(this.apartment)
      console.log(this.building)
      this.errHandler.handleError({message: 'Progress not saved, please check your connection and try again'});
    })
  }

  initialApartUpdate(){
    let ldr = this.loadingCtrl.create()
    ldr.present()
    if(this.apartment.apart_id != ''){
        this.afs.collection('Apartments').doc(this.apartment.apart_id).set(this.apartment)
        .then(() =>{
          console.log(this.apartment)
          console.log(this.building)  
          ldr.dismiss();  
        })
        .catch(err => {
          console.log(this.apartment)
          console.log(this.building)
          ldr.dismiss();
          this.errHandler.handleError({message: 'Progress not saved, please check your connection and try again'});
        })
    }else{
      ldr.dismiss();
      this.errHandler.handleError({message: 'Apartment document not found'});
    }
  }

  initialBuildinUpload(){
    let ldr = this.loadingCtrl.create();
    ldr.present();
    this.afs.collection('Properties').add(this.building).then(buildingRef =>{
      console.log('This is the building id: ', buildingRef.id)
      console.log(this.apartment)
      console.log(this.building)
      this.building.prop_id = buildingRef.id; 
      this.apartment.prop_id = buildingRef.id;
      this.apartment.property = this.object_init.initializeProperty2(this.building);
      this.accom_svc.updateApartment(this.apartment)
      ldr.dismiss();   
    })
    .catch(err => {
      console.log(this.apartment)
      console.log(this.building)
      ldr.dismiss();
      this.errHandler.handleError({message: 'Progress not saved, please check your connection and try again'})
    })
  }

  initialBuildinUpdate(){
    let ldr = this.loadingCtrl.create()
    ldr.present();
    this.afs.collection('Properties').doc(this.building.prop_id).set(this.building).then(() =>{
      console.log(this.apartment)
      console.log(this.building) 
      this.apartment.property = this.object_init.initializeProperty2(this.building)
      this.accom_svc.updateApartment(this.apartment)
      ldr.dismiss();  
    })
    .catch(err => {
      console.log(this.apartment)
      console.log(this.building)
      ldr.dismiss();
      this.errHandler.handleError({message: 'Progress not saved, please check your connection and try again'})
    })
  }

  //This method uploads the images of the apartment selected to the file storage
  uploadApartPics(): Promise<void>{
    //Create and display a loader for 3 seconds
    let ldr = this.loadingCtrl.create({duration: 3000})
    ldr.present()
    //If no images are selected, show appropriate toast message and return an empty promise
    if(this.apartmentImages.length <= 0){
      this.toast.create({
        position: 'bottom',
        duration: 2000,
        message: 'No apartment images added'
      })
      /*console.log('No apartment images... ', this.apartmentImages);
      console.log(this.apartment)
      console.log(this.building)*/
      return new Promise<void>((resolve, reject) =>resolve())
    } 
    return this.uploadPics(this.apartmentImages).then(images =>{
      this.apartment.images = images;
      /*console.log('Apartment pics uploaded');
      console.log(this.apartment)
      console.log(this.building)*/
    })
    .catch(err => {
      console.log(this.apartment)
      console.log(this.building)
      this.errHandler.handleError({message: 'Please check your connection...progress not saved'})
    })
  }

  updateApartmentPics(event){
    console.log('Pics: ', event.target.files);
    console.log(this.apartment)
    console.log(this.building)
    let pic = event.target.files[0];
   
      let image: FileUpload = {
        file: pic,
        name: pic.name,
        url: '',
        path: 'ApartmentImages',
        progress: 0
      }
      this.apartmentImages.push(image);
  }

  updateBuildingPics(event){
    console.log('Pics: ', event.target.files);
    console.log(this.apartment)
    console.log(this.building)
    let pic = event.target.files[0];
    
      let image: FileUpload = {
        file: pic,
        name: pic.name,
        url: '',
        path: 'PropertyImages',
        progress: 0
      }
      this.propertyImages.push(image);
    
  }

  uploadBuildingPics(): Promise<void>{
    let ldr = this.loadingCtrl.create()
    ldr.present()
    if(!(this.propertyImages.length > 0)) return new Promise<void>((resolve, reject) =>resolve())
    return new Promise<void>((resolve, reject) =>{
      this.uploadPics(this.propertyImages).then(images =>{
      this.building.images = images;
      console.log('Building pics uploaded...')
      console.log('Building.prop_id = ', this.building.prop_id);
      console.log(this.apartment)
    console.log(this.building)
      this.apartment.prop_id = this.building.prop_id;
      ldr.dismiss();
      resolve();
    })
      .catch(err =>{
        ldr.dismiss();
        reject(err);
      })
    }) 
  }
  /*Getting autocomplete predictions from the google maps place predictions service*/
  getPredictionsAdd(event){
    //this.loading = true;
    if(event.key === "Backspace" || event.code === "Backspace"){
      setTimeout(()=>{
        this.map_svc.getPlacePredictionsSA(event.target.value).then(data => {
          console.log(data);
          this.predictionsAdd = [];
          this.predictionsAdd = data;
          //this.loading = false;
        })
        .catch(err => {
          this.errHandler.handleError(err);
         // this.loading = false;
        })
      }, 3000)
    }else{
      this.map_svc.getPlacePredictionsSA(event.target.value).then(data => {
        console.log(data);
        this.predictionsAdd = [];
        this.predictionsAdd = data;
        //this.loading = false;
      })
      .catch(err => {
        this.errHandler.handleError(err);
        //this.loading = false;
      })
    }
  }
  /*Getting autocomplete predictions from the google maps place predictions service*/
  getPredictionsNby(event){
    //this.loading = true;
    if(event.key === "Backspace" || event.code === "Backspace"){
      setTimeout(()=>{
        this.map_svc.getPlacePredictionsSA(event.target.value).then(data => {
          console.log(data);
          this.predictionsNby = [];
          this.predictionsNby = data;
          //this.loading = false;
        })
        .catch(err => {
          this.errHandler.handleError(err);
         // this.loading = false;
        })
      }, 3000)
    }else{
      this.map_svc.getPlacePredictionsSA(event.target.value).then(data => {
        if(data){
          console.log(data);
          this.predictionsNby = [];
          this.predictionsNby = data;
          //this.loading = false;
        }else{
          //this.loading = false;
          this.errHandler.handleError({message: 'Your internet connection is faulty'})
        }
      })
      .catch(err => {
        this.errHandler.handleError(err);
        //this.loading = false;
      })
    }
  }

  selectPlace(place){
    //this.loading = true;
    this.map_svc.getSelectedPlace(place).then(data => {
      this.building.address = data;
      this.address = data.description;
      this.predictionsAdd = [];
      //this.loading = false;
    })
    .catch(err => {
      this.errHandler.handleError(err);
      //this.loading = false;
    })
  }

  addNearby(nearby: string){
    this.building.nearbys.push(nearby);
    this.nearby = '';
    this.predictionsNby = [];
    console.log('added ', nearby);
  }

  successful(){
    this.toast.create({
      message: "Apartment successfully uploaded!",
      showCloseButton: true,
      closeButtonText: 'Ok',
      position: 'middle',
      cssClass: 'toast_margins full_width'
    })
    .present().then(() =>{
     //this.loading = false;
    })
  }

  deleteNearby(nearby:string) {
    const index: number = this.building.nearbys.indexOf(nearby);
    if (index !== -1) {
        this.building.nearbys.splice(index, 1);
    }        
  }

}
