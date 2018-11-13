var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs-compat/operators/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/take';
var SearchfeedProvider = /** @class */ (function () {
    function SearchfeedProvider(afs) {
        this.afs = afs;
        // Source data
        this._done = new BehaviorSubject(false);
        this._loading = new BehaviorSubject(false);
        this._data = new BehaviorSubject([]);
        this.done = this._done.asObservable();
        this.loading = this._loading.asObservable();
    }
    // Determines the doc snapshot to paginate query 
    SearchfeedProvider.prototype.getCursor = function () {
        var current = this._data.value;
        if (current.length) {
            return current[current.length - 1].doc;
        }
        return null;
    };
    // Maps the snapshot to usable format the updates source
    SearchfeedProvider.prototype.mapAndUpdate = function (col) {
        var _this = this;
        if (this._done.value || this._loading.value) {
            return;
        }
        ;
        // loading
        this._loading.next(true);
        // Map snapshot with doc ref (needed for cursor)
        return col.snapshotChanges()
            .do(function (arr) {
            var values = arr.map(function (snap) {
                var data = snap.payload.doc.data();
                var doc = snap.payload.doc;
                return __assign({}, data, { doc: doc });
            });
            // update source with new values, done loading
            _this._data.next(values);
            _this._loading.next(false);
            // no more values, mark done
            if (!values.length) {
                console.log('done!');
                _this._done.next(true);
            }
        })
            .take(1)
            .subscribe();
    };
    SearchfeedProvider.prototype.getAllSearches = function () {
        var first = this.afs.collection('Searches2', function (ref) {
            return ref.orderBy('timeStamp', 'desc')
                .limit(10);
        });
        this.mapAndUpdate(first);
        this.data = this._data.asObservable()
            .scan(function (acc, val) {
            return acc.concat(val);
        });
    };
    // Retrieves additional data from firestore
    SearchfeedProvider.prototype.moreAllSearches = function () {
        var cursor = this.getCursor();
        var more = this.afs.collection('Searches2', function (ref) {
            return ref
                .orderBy('timeStamp', 'desc')
                .limit(10)
                .startAfter(cursor);
        });
        this.mapAndUpdate(more);
    };
    SearchfeedProvider.prototype.getSeekerSearches = function (uid) {
        var first = this.afs.collection('Searches2', function (ref) {
            return ref.where('searcher_id', '==', uid)
                .orderBy('timeStamp', 'desc')
                .limit(10);
        });
        this.mapAndUpdate(first);
        this.data = this._data.asObservable()
            .scan(function (acc, val) {
            return acc.concat(val);
        });
    };
    SearchfeedProvider.prototype.moreSeelerSearches = function (uid) {
        var cursor = this.getCursor();
        var more = this.afs.collection('Searches2', function (ref) {
            return ref
                .where('searcher_id', '==', uid)
                .orderBy('timeStamp', 'desc')
                .limit(10)
                .startAfter(cursor);
        });
        this.mapAndUpdate(more);
    };
    SearchfeedProvider.prototype.getHostFeeds = function (locations) {
        return this.afs.collection('Searches2', function (ref) { return ref.orderBy('timeStamp', 'desc'); })
            .valueChanges()
            .pipe(map(function (searches) { return searches.filter(function (search) { return locations.indexOf(search.Address.locality_lng) != -1; }); }));
    };
    SearchfeedProvider.prototype.getSearchesOfArea = function (area) {
        var first = this.afs.collection('Searches2', function (ref) { return ref
            .where('Address.locality_lng', '==', area)
            .orderBy('timeStamp', 'desc')
            .limit(10); });
        this.mapAndUpdate(first);
        this.data = this._data.asObservable()
            .scan(function (acc, val) {
            return acc.concat(val);
        });
    };
    SearchfeedProvider.prototype.moreAreaSearches = function (area) {
        var cursor = this.getCursor();
        var more = this.afs.collection('Searches2', function (ref) {
            return ref
                .where('Address.locality_lng', '==', area)
                .orderBy('timeStamp', 'desc')
                .limit(10)
                .startAfter(cursor);
        });
        this.mapAndUpdate(more);
    };
    SearchfeedProvider.prototype.getSearchesSince = function () {
    };
    SearchfeedProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [AngularFirestore])
    ], SearchfeedProvider);
    return SearchfeedProvider;
}());
export { SearchfeedProvider };
//# sourceMappingURL=searchfeed.js.map