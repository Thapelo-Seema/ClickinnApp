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
import { IonicPage, NavController, NavParams, ModalController, ToastController, Content } from 'ionic-angular';
import { ObjectInitProvider } from '../../providers/object-init/object-init';
import { SearchfeedProvider } from '../../providers/searchfeed/searchfeed';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { PaginationProvider } from '../../providers/pagination/pagination';
var SearchfeedPage = /** @class */ (function () {
    function SearchfeedPage(navCtrl, navParams, object_init, searchfeed_svc, modal, local_db, toastCtrl, page) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.object_init = object_init;
        this.searchfeed_svc = searchfeed_svc;
        this.modal = modal;
        this.local_db = local_db;
        this.toastCtrl = toastCtrl;
        this.page = page;
        this.inputVisible = false;
        this.loading = true;
        this.loadingMore = false;
        this.done = false;
        this.imagesLoaded = [false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false
        ];
        this.searchfeed_svc.getAllSearches();
        this.user = this.object_init.initializeUser();
        this.local_db.getUser().then(function (user) {
            if (user)
                _this.user = user;
        });
        this.search = this.object_init.initializeSearch();
        this.searchfeed_svc.loading.subscribe(function (dat) {
            _this.loadingMore = dat;
            console.log('loading... ', _this.loadingMore);
        });
        this.searchfeed_svc.done.subscribe(function (dat) {
            _this.done = dat;
            if (dat == true)
                _this.loadingMore = false;
            console.log('done... ', _this.done);
        });
        this.searchfeed_svc.data
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
        var to = {
            name: search.searcher_name,
            uid: search.searcher_id,
            dp: search.searcher_dp,
            topic: "Regarding your search for a " + search.apartment_type + " around " + search.Address.description
        };
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
    SearchfeedPage.prototype.ionViewDidLoad = function () {
        this.monitorEnd();
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
                _this.searchfeed_svc.moreAllSearches();
            }
        });
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
            ToastController,
            PaginationProvider])
    ], SearchfeedPage);
    return SearchfeedPage;
}());
export { SearchfeedPage };
//# sourceMappingURL=searchfeed.js.map