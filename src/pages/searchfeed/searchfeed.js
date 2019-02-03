var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, Content, AlertController } from 'ionic-angular';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { SearchfeedProvider } from '../../providers/searchfeed/searchfeed';
import { MapsProvider } from '../../providers/maps/maps';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { PaginationProvider } from '../../providers/pagination/pagination';
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
var SearchfeedPage = /** @class */ (function () {
    function SearchfeedPage(navCtrl, navParams, object_init, searchfeed_svc, modal, local_db, map_svc, errHandler, toastCtrl, alertCtrl, page) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.object_init = object_init;
        this.searchfeed_svc = searchfeed_svc;
        this.modal = modal;
        this.local_db = local_db;
        this.map_svc = map_svc;
        this.errHandler = errHandler;
        this.toastCtrl = toastCtrl;
        this.alertCtrl = alertCtrl;
        this.page = page;
        this.inputVisible = false;
        this.loading = true;
        this.loadingMore = false;
        this.done = false;
        this.predictions = [];
        this.predictionLoading = false;
        this.connectionError = false;
        this.online = false;
        this.byArea = false;
        this.imagesLoaded = [false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false
        ];
        this.searchfeed_svc.getAllSearches();
        this.pointOfInterest = this.object_init.initializeAddress(); //Initialize the point of interest with default values
        this.pointOfInterest.description = '';
        this.user = this.object_init.initializeUser();
        this.local_db.getUser().then(function (user) {
            if (user)
                _this.user = _this.object_init.initializeUser2(user);
        });
        this.search = this.object_init.initializeSearch();
        this.loadingSubs = this.searchfeed_svc.loading.subscribe(function (dat) {
            _this.loadingMore = dat;
            console.log('loading... ', _this.loadingMore);
        });
        this.doneSubs = this.searchfeed_svc.done.subscribe(function (dat) {
            _this.done = dat;
            if (dat == true)
                _this.loadingMore = false;
            console.log('done... ', _this.done);
        });
        this.dataSubs = this.searchfeed_svc.data
            .subscribe(function (searches) {
            if (searches) {
                console.log(searches.length);
                _this.loading = false;
                searches.forEach(function (ser) {
                    _this.imagesLoaded.push(false);
                });
            }
        }, function (err) {
            _this.loading = false;
            _this.showToast('Something went wrong while fetching the searches, please also check if you are connected to the internet');
        });
    }
    SearchfeedPage.prototype.showInput = function (search) {
        var _this = this;
        var to;
        if (search.apartment_type == 'Any') {
            to = {
                name: search.searcher_name,
                uid: search.searcher_id,
                dp: search.searcher_dp,
                topic: "Regarding your search for any room type around " + this.returnFirst(search.Address.description)
            };
        }
        else {
            to = {
                name: search.searcher_name,
                uid: search.searcher_id,
                dp: search.searcher_dp,
                topic: "Regarding your search for a " + search.apartment_type + " around " + this.returnFirst(search.Address.description)
            };
        }
        this.local_db.setMessageDetails(to).then(function (val) {
            _this.modal.create('MessageInputPopupPage', to).present();
        });
    };
    SearchfeedPage.prototype.showToast = function (text) {
        var toast = this.toastCtrl.create({
            message: text,
            duration: 60000
        });
        toast.present();
    };
    SearchfeedPage.prototype.gotoLandlordSearch = function () {
        this.navCtrl.push('LandlordSearchPage');
    };
    SearchfeedPage.prototype.gotoMyLandlords = function () {
        this.navCtrl.push('MyLandlordsPage');
    };
    SearchfeedPage.prototype.gotoMyAgents = function () {
        this.navCtrl.push('MyAgentsPage');
    };
    SearchfeedPage.prototype.ionViewDidLoad = function () {
        console.log('Searchfeed page did load');
        this.refresh();
        this.monitorEnd();
    };
    SearchfeedPage.prototype.ionViewWillLeave = function () {
        console.log('Searchfeed unsubscribing...');
        this.dataSubs.unsubscribe();
        this.doneSubs.unsubscribe();
        this.loadingSubs.unsubscribe();
        this.refresh();
    };
    SearchfeedPage.prototype.refresh = function () {
        this.searchfeed_svc.refresh();
    };
    SearchfeedPage.prototype.monitorEnd = function () {
        var _this = this;
        //console.log('Content scrollHeight = ', this.content.scrollHeight)
        this.content.ionScrollEnd.subscribe(function (ev) {
            var height = ev.scrollElement.scrollHeight;
            var top = ev.scrollElement.scrollTop;
            var offset = ev.scrollElement.offsetHeight;
            if (top > height - offset - 1) {
                console.log('bottom');
                if (_this.byArea) {
                    _this.searchfeed_svc.moreAreaSearches(_this.pointOfInterest.locality_lng);
                }
                else {
                    _this.searchfeed_svc.moreAllSearches();
                }
            }
        });
    };
    /*Getting autocomplete predictions from the google maps place predictions service*/
    SearchfeedPage.prototype.getPredictions = function (event) {
        var _this = this;
        this.predictionLoading = true;
        //If there is an internet connection try to make requests
        if (window.navigator.onLine) {
            this.online = true;
            if (event.key === "Backspace" || event.code === "Backspace") {
                setTimeout(function () {
                    _this.map_svc.getPlacePredictionsSA(event.target.value).then(function (data) {
                        _this.handleSuccess(data);
                    })
                        .catch(function (err) {
                        console.log('Error 1');
                        _this.handleNetworkError();
                    });
                }, 3000);
            }
            else { // When location is being typed
                this.map_svc.getPlacePredictionsSA(event.target.value).then(function (data) {
                    if (data == null || data == undefined) {
                        console.log('Error 2');
                        _this.handleNetworkError();
                    }
                    else {
                        _this.handleSuccess(data);
                    }
                })
                    .catch(function (err) {
                    console.log('Error 3');
                    _this.handleNetworkError();
                });
            }
        }
        else { //If there's no connection set online status to false, show message and stop spinner
            this.online = false;
            this.predictionLoading = false;
            this.showToast('You are not connected to the internet...');
        }
    };
    SearchfeedPage.prototype.cancelSearch = function () {
        this.predictions = [];
        this.predictionLoading = false;
    };
    SearchfeedPage.prototype.selectPlace = function (place) {
        var _this = this;
        this.predictionLoading = true;
        this.byArea = true;
        this.map_svc.getSelectedPlace(place).then(function (data) {
            console.log(data.locality_lng);
            _this.searchfeed_svc.reset();
            _this.pointOfInterest = data;
            _this.searchfeed_svc.getSearchesOfArea(data.locality_lng);
            _this.predictions = [];
            _this.predictionLoading = false;
        })
            .catch(function (err) {
            _this.errHandler.handleError(err);
            _this.predictionLoading = false;
        });
    };
    SearchfeedPage.prototype.handleSuccess = function (data) {
        this.connectionError = false;
        this.predictions = [];
        this.predictions = data;
        this.predictionLoading = false;
    };
    SearchfeedPage.prototype.handleNetworkError = function () {
        if (this.connectionError == false)
            this.errHandler.handleError({ message: 'You are offline...check your internet connection' });
        this.predictionLoading = false;
        this.connectionError = true;
    };
    SearchfeedPage.prototype.showWarnig = function (title, message) {
        var alert = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: ['OK']
        });
        alert.present();
    };
    SearchfeedPage.prototype.returnFirst = function (input) {
        if (input == undefined)
            return '';
        return input.split(" ")[0];
    };
    __decorate([
        ViewChild(Content),
        __metadata("design:type", Content)
    ], SearchfeedPage.prototype, "content", void 0);
    SearchfeedPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-searchfeed',
            templateUrl: 'searchfeed.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            ObjectInitProvider,
            SearchfeedProvider,
            ModalController,
            LocalDataProvider,
            MapsProvider,
            ErrorHandlerProvider,
            ToastController,
            AlertController,
            PaginationProvider])
    ], SearchfeedPage);
    return SearchfeedPage;
}());
export { SearchfeedPage };
//# sourceMappingURL=searchfeed.js.map