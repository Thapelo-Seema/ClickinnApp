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
//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/take';
/*
  Generated class for the PaginationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var PaginationProvider = /** @class */ (function () {
    function PaginationProvider(afs) {
        this.afs = afs;
        // Source data
        this._done = new BehaviorSubject(false);
        this._loading = new BehaviorSubject(false);
        this._data = new BehaviorSubject([]);
        this.done = this._done.asObservable();
        this.loading = this._loading.asObservable();
    }
    // Initial query sets options and defines the Observable
    // passing opts will override the defaults
    PaginationProvider.prototype.init = function (path, field, opts) {
        var _this = this;
        this.query = __assign({ path: path,
            field: field, limit: 2, reverse: false, prepend: false }, opts);
        var first = this.afs.collection(this.query.path, function (ref) {
            return ref
                .orderBy(_this.query.field, _this.query.reverse ? 'desc' : 'asc')
                .limit(_this.query.limit);
        });
        //Thss operation updates the data behaviourSubject, which updates the data Observable because of the next set of logic
        this.mapAndUpdate(first);
        // Create the observable array for consumption in components
        this.data = this._data.asObservable()
            .scan(function (acc, val) {
            //This scan operator takes the new data emmited by an observable and concatinates it to an accumulator
            return _this.query.prepend ? val.concat(acc) : acc.concat(val);
        });
    };
    // Retrieves additional data from firestore
    PaginationProvider.prototype.more = function () {
        var _this = this;
        var cursor = this.getCursor();
        var more = this.afs.collection(this.query.path, function (ref) {
            return ref
                .orderBy(_this.query.field, _this.query.reverse ? 'desc' : 'asc')
                .limit(_this.query.limit)
                .startAfter(cursor);
        });
        this.mapAndUpdate(more);
    };
    // Determines the doc snapshot to paginate query 
    PaginationProvider.prototype.getCursor = function () {
        var current = this._data.value;
        if (current.length) {
            return this.query.prepend ? current[0].doc : current[current.length - 1].doc;
        }
        return null;
    };
    // Maps the snapshot to usable format the updates source
    PaginationProvider.prototype.mapAndUpdate = function (col) {
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
            // If prepending, reverse the batch order
            values = _this.query.prepend ? values.reverse() : values;
            console.log('Values length: ', values.length);
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
    PaginationProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [AngularFirestore])
    ], PaginationProvider);
    return PaginationProvider;
}());
export { PaginationProvider };
//# sourceMappingURL=pagination.js.map