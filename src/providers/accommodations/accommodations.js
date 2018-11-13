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
//import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore } from 'angularfire2/firestore';
//import { User } from '../../models/users/user.interface';
import { map } from 'rxjs-compat/operators/map';
/*import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';*/
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/take';
var AccommodationsProvider = /** @class */ (function () {
    function AccommodationsProvider(afs) {
        this.afs = afs;
        // Source data
        this._done = new BehaviorSubject(false);
        this._loading = new BehaviorSubject(false);
        this._data = new BehaviorSubject([]);
        this.done = this._done.asObservable();
        this.loading = this._loading.asObservable();
    }
    // Determines the doc snapshot to paginate query 
    AccommodationsProvider.prototype.getCursor = function () {
        var current = this._data.value;
        if (current.length) {
            return current[current.length - 1].doc;
        }
        return null;
    };
    // Maps the snapshot to usable format the updates source
    AccommodationsProvider.prototype.mapAndUpdate = function (col) {
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
    AccommodationsProvider.prototype.getAllApartments = function () {
        var first = this.afs.collection('Apartments', function (ref) {
            return ref.orderBy('timeStamp', 'desc')
                .limit(10);
        });
        this.mapAndUpdate(first);
        this.data = this._data.asObservable()
            .scan(function (acc, val) {
            return acc.concat(val);
        });
    };
    AccommodationsProvider.prototype.moreAllApartments = function () {
        var cursor = this.getCursor();
        var more = this.afs.collection('Apartments', function (ref) {
            return ref
                .orderBy('timeStamp', 'desc')
                .limit(10)
                .startAfter(cursor);
        });
        this.mapAndUpdate(more);
    };
    AccommodationsProvider.prototype.getApartmentById = function (apart_id) {
        return this.afs.collection('Apartments').doc(apart_id).valueChanges();
    };
    AccommodationsProvider.prototype.getApartImages = function (apart_id) {
        var col = this.afs.collection('Apartments');
        var docu = col.doc(apart_id);
        return docu.collection("images").valueChanges();
    };
    AccommodationsProvider.prototype.getUsersProperties = function (uid) {
        return this.afs.collection('Properties', function (ref) { return ref.where('user_id', '==', uid); })
            .valueChanges();
    };
    AccommodationsProvider.prototype.initUserProperties = function (uid) {
        var first = ;
    };
    AccommodationsProvider.prototype.getUserApartments = function (uid) {
        return this.afs.collection('Apartments', function (ref) { return ref.where('property.user_id', '==', uid); }).valueChanges();
    };
    AccommodationsProvider.prototype.getUserFavourites = function (favs) {
        return this.afs.collection('Apartments')
            .valueChanges()
            .pipe(map(function (obsAparts) { return obsAparts.filter(function (apart) { return favs.indexOf(apart.apart_id) != -1; }); }));
    };
    AccommodationsProvider.prototype.getPropertyApartments = function (prop_id) {
        return this.afs.collection('Apartments', function (ref) { return ref.where('prop_id', '==', prop_id); }).valueChanges();
    };
    AccommodationsProvider.prototype.getPropertyImages = function (prop_id) {
        var col = this.afs.collection('Properties');
        var docu = col.doc(prop_id);
        return docu.collection("images").valueChanges();
    };
    AccommodationsProvider.prototype.getFeaturedApartments = function () {
        return this.afs.collection('/Apartments', function (ref) { return ref.limit(9); }).valueChanges();
    };
    /*updateAccoms():Observable<Property[]>{
      return this.db.list<Property>('/Properties').valueChanges()
    }
  
    updatePropertyAddress(property_id: string, address: Address):Promise<void>{
      return this.db.object(`Properties/${property_id}/address`).remove();
    }
  
    updateApartmentProperty(apartment_id: string, property):Promise<void>{
      return this.db.object(`Apartments/${apartment_id}/property`).update(property)
    }*/
    AccommodationsProvider.prototype.updateApartment = function (apartment) {
        return this.afs.collection('Apartments').doc(apartment.apart_id).set(apartment);
    };
    AccommodationsProvider.prototype.updateProperty = function (property) {
        return this.afs.collection('Properties').doc(property.prop_id).set(property);
    };
    AccommodationsProvider.prototype.getPropertyById = function (property_id) {
        return this.afs.collection("/Properties").doc(property_id).valueChanges();
    };
    AccommodationsProvider.prototype.getPropertiesByVicinity = function (vicinity) {
        return this.afs.collection('/Properties', function (ref) {
            return ref.where('address.vicinity', '==', vicinity);
        }).valueChanges();
    };
    AccommodationsProvider.prototype.search = function (search_obj) {
        console.log('search_obj: ', search_obj);
        if (search_obj.apartment_type !== 'Any' && search_obj.parking && search_obj.wifi && search_obj.nsfas && search_obj.laundry) {
            console.log('case 1');
            return this.afs.collection('/Apartments', function (ref) {
                return ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
                    .where('available', '==', true)
                    .where('price', "<=", search_obj.maxPrice)
                    .where('room_type', '==', search_obj.apartment_type)
                    .where('property.parking', '==', search_obj.parking)
                    .where('property.wifi', '==', search_obj.wifi)
                    .where('property.nsfas', '==', search_obj.nsfas)
                    .where('property.laundry', '==', search_obj.laundry)
                    .orderBy('price', 'asc');
            }).valueChanges();
        }
        else if (search_obj.apartment_type !== 'Any' && search_obj.wifi && search_obj.laundry && search_obj.nsfas && !search_obj.parking) {
            console.log('case 2');
            return this.afs.collection('/Apartments', function (ref) {
                return ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
                    .where('available', '==', true)
                    .where('price', "<=", search_obj.maxPrice)
                    .where('room_type', '==', search_obj.apartment_type)
                    .where('property.wifi', '==', search_obj.wifi)
                    .where('property.nsfas', '==', search_obj.nsfas)
                    .where('property.laundry', '==', search_obj.laundry)
                    .orderBy('price', 'asc');
            }).valueChanges();
        }
        else if (search_obj.apartment_type !== 'Any' && search_obj.wifi && search_obj.laundry && !search_obj.nsfas && !search_obj.parking) {
            console.log('case 3');
            return this.afs.collection('/Apartments', function (ref) {
                return ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
                    .where('available', '==', true)
                    .where('price', "<=", search_obj.maxPrice)
                    .where('room_type', '==', search_obj.apartment_type)
                    .where('property.wifi', '==', search_obj.wifi)
                    .where('property.laundry', '==', search_obj.laundry)
                    .orderBy('price', 'asc');
            }).valueChanges();
        }
        else if (search_obj.apartment_type !== 'Any' && search_obj.wifi && !search_obj.laundry && !search_obj.nsfas && !search_obj.parking) {
            console.log('case 4');
            return this.afs.collection('/Apartments', function (ref) {
                return ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
                    .where('available', '==', true)
                    .where('price', "<=", search_obj.maxPrice)
                    .where('room_type', '==', search_obj.apartment_type)
                    .where('property.wifi', '==', search_obj.wifi)
                    .orderBy('price', 'asc');
            }).valueChanges();
        }
        else if (search_obj.apartment_type !== 'Any' && !search_obj.wifi && !search_obj.laundry && !search_obj.nsfas && !search_obj.parking) {
            console.log('case 5');
            return this.afs.collection('/Apartments', function (ref) {
                return ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
                    .where('available', '==', true)
                    .where('price', "<=", search_obj.maxPrice)
                    .where('room_type', '==', search_obj.apartment_type)
                    .orderBy('price', 'asc');
            }).valueChanges();
        }
        else if (search_obj.apartment_type === 'Any' && !search_obj.wifi && !search_obj.laundry && !search_obj.nsfas && !search_obj.parking) {
            console.log('case 6');
            return this.afs.collection('/Apartments', function (ref) {
                return ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
                    .where('available', '==', true)
                    .where('price', "<=", search_obj.maxPrice)
                    .orderBy('price', 'asc');
            }).valueChanges();
        }
        else if (search_obj.apartment_type === 'Any' && search_obj.wifi && search_obj.laundry && search_obj.nsfas && search_obj.parking) {
            console.log('case 7');
            return this.afs.collection('/Apartments', function (ref) {
                return ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
                    .where('available', '==', true)
                    .where('price', "<=", search_obj.maxPrice)
                    .where('property.parking', '==', search_obj.parking)
                    .where('property.wifi', '==', search_obj.wifi)
                    .where('property.nsfas', '==', search_obj.nsfas)
                    .where('property.laundry', '==', search_obj.laundry)
                    .orderBy('price', 'asc');
            }).valueChanges();
        }
        else if (search_obj.apartment_type === 'Any' && search_obj.wifi && search_obj.laundry && search_obj.nsfas && !search_obj.parking) {
            console.log('case 8');
            return this.afs.collection('/Apartments', function (ref) {
                return ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
                    .where('available', '==', true)
                    .where('price', "<=", search_obj.maxPrice)
                    .where('property.wifi', '==', search_obj.wifi)
                    .where('property.nsfas', '==', search_obj.nsfas)
                    .where('property.laundry', '==', search_obj.laundry)
                    .orderBy('price', 'asc');
            }).valueChanges();
        }
        else if (search_obj.apartment_type === 'Any' && search_obj.wifi && search_obj.laundry && !search_obj.nsfas && !search_obj.parking) {
            console.log('case 9');
            return this.afs.collection('/Apartments', function (ref) {
                return ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
                    .where('available', '==', true)
                    .where('price', "<=", search_obj.maxPrice)
                    .where('property.wifi', '==', search_obj.wifi)
                    .where('property.laundry', '==', search_obj.laundry)
                    .orderBy('price', 'asc');
            }).valueChanges();
        }
        else if (search_obj.apartment_type === 'Any' && search_obj.wifi && !search_obj.laundry && !search_obj.nsfas && !search_obj.parking) {
            console.log('case 10');
            return this.afs.collection('/Apartments', function (ref) {
                return ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
                    .where('available', '==', true)
                    .where('price', "<=", search_obj.maxPrice)
                    .where('property.wifi', '==', search_obj.wifi)
                    .orderBy('price', 'asc');
            }).valueChanges();
        }
        else if (search_obj.apartment_type !== 'Any' && !search_obj.wifi && search_obj.laundry && search_obj.nsfas && search_obj.parking) {
            console.log('case 11');
            return this.afs.collection('/Apartments', function (ref) {
                return ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
                    .where('available', '==', true)
                    .where('price', "<=", search_obj.maxPrice)
                    .where('room_type', '==', search_obj.apartment_type)
                    .where('property.parking', '==', search_obj.parking)
                    .where('property.nsfas', '==', search_obj.nsfas)
                    .where('property.laundry', '==', search_obj.laundry)
                    .orderBy('price', 'asc');
            }).valueChanges();
        }
        else if (search_obj.apartment_type !== 'Any' && !search_obj.wifi && search_obj.laundry && search_obj.nsfas && !search_obj.parking) {
            console.log('case 12');
            return this.afs.collection('/Apartments', function (ref) {
                return ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
                    .where('available', '==', true)
                    .where('price', "<=", search_obj.maxPrice)
                    .where('room_type', '==', search_obj.apartment_type)
                    .where('property.nsfas', '==', search_obj.nsfas)
                    .where('property.laundry', '==', search_obj.laundry)
                    .orderBy('price', 'asc');
            }).valueChanges();
        }
        else if (search_obj.apartment_type !== 'Any' && !search_obj.wifi && search_obj.laundry && !search_obj.nsfas && !search_obj.parking) {
            console.log('case 13');
            return this.afs.collection('/Apartments', function (ref) {
                return ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
                    .where('available', '==', true)
                    .where('price', "<=", search_obj.maxPrice)
                    .where('property.laundry', '==', search_obj.laundry)
                    .orderBy('price', 'asc');
            }).valueChanges();
        }
        else if (search_obj.apartment_type === 'Any' && !search_obj.wifi && search_obj.laundry && !search_obj.nsfas && !search_obj.parking) {
            console.log('case 14');
            return this.afs.collection('/Apartments', function (ref) {
                return ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
                    .where('available', '==', true)
                    .where('price', "<=", search_obj.maxPrice)
                    .where('property.laundry', '==', search_obj.laundry)
                    .orderBy('price', 'asc');
            }).valueChanges();
        }
        else if (search_obj.apartment_type !== 'Any' && search_obj.wifi && !search_obj.laundry && search_obj.nsfas && search_obj.parking) {
            console.log('case 15');
            return this.afs.collection('/Apartments', function (ref) {
                return ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
                    .where('available', '==', true)
                    .where('price', "<=", search_obj.maxPrice)
                    .where('room_type', '==', search_obj.apartment_type)
                    .where('property.parking', '==', search_obj.parking)
                    .where('property.wifi', '==', search_obj.wifi)
                    .where('property.nsfas', '==', search_obj.nsfas)
                    .orderBy('price', 'asc');
            }).valueChanges();
        }
        else if (search_obj.apartment_type !== 'Any' && search_obj.wifi && !search_obj.laundry && search_obj.nsfas && !search_obj.parking) {
            console.log('case 16');
            return this.afs.collection('/Apartments', function (ref) {
                return ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
                    .where('available', '==', true)
                    .where('price', "<=", search_obj.maxPrice)
                    .where('room_type', '==', search_obj.apartment_type)
                    .where('property.wifi', '==', search_obj.wifi)
                    .where('property.nsfas', '==', search_obj.nsfas)
                    .orderBy('price', 'asc');
            }).valueChanges();
        }
        else if (search_obj.apartment_type === 'Any' && search_obj.wifi && !search_obj.laundry && search_obj.nsfas && !search_obj.parking) {
            console.log('case 17');
            return this.afs.collection('/Apartments', function (ref) {
                return ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
                    .where('available', '==', true)
                    .where('price', "<=", search_obj.maxPrice)
                    .where('property.wifi', '==', search_obj.wifi)
                    .where('property.nsfas', '==', search_obj.nsfas)
                    .orderBy('price', 'asc');
            }).valueChanges();
        }
        else if (search_obj.apartment_type === 'Any' && !search_obj.wifi && !search_obj.laundry && search_obj.nsfas && !search_obj.parking) {
            console.log('case 18');
            return this.afs.collection('/Apartments', function (ref) {
                return ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
                    .where('available', '==', true)
                    .where('price', "<=", search_obj.maxPrice)
                    .where('property.nsfas', '==', search_obj.nsfas)
                    .orderBy('price', 'asc');
            }).valueChanges();
        }
        else if (search_obj.apartment_type !== 'Any' && search_obj.wifi && search_obj.laundry && !search_obj.nsfas && search_obj.parking) {
            console.log('case 19');
            return this.afs.collection('/Apartments', function (ref) {
                return ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
                    .where('available', '==', true)
                    .where('price', "<=", search_obj.maxPrice)
                    .where('room_type', '==', search_obj.apartment_type)
                    .where('property.parking', '==', search_obj.parking)
                    .where('property.wifi', '==', search_obj.wifi)
                    .where('property.laundry', '==', search_obj.laundry)
                    .orderBy('price', 'asc');
            }).valueChanges();
        }
        else if (search_obj.apartment_type === 'Any' && search_obj.wifi && search_obj.laundry && !search_obj.nsfas && search_obj.parking) {
            console.log('case 20');
            return this.afs.collection('/Apartments', function (ref) {
                return ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
                    .where('available', '==', true)
                    .where('price', "<=", search_obj.maxPrice)
                    .where('property.parking', '==', search_obj.parking)
                    .where('property.wifi', '==', search_obj.wifi)
                    .where('property.laundry', '==', search_obj.laundry)
                    .orderBy('price', 'asc');
            }).valueChanges();
        }
        else if (search_obj.apartment_type === 'Any' && search_obj.wifi && !search_obj.laundry && !search_obj.nsfas && search_obj.parking) {
            console.log('case 21');
            return this.afs.collection('/Apartments', function (ref) {
                return ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
                    .where('available', '==', true)
                    .where('price', "<=", search_obj.maxPrice)
                    .where('property.parking', '==', search_obj.parking)
                    .where('property.wifi', '==', search_obj.wifi)
                    .orderBy('price', 'asc');
            }).valueChanges();
        }
        else if (search_obj.apartment_type === 'Any' && !search_obj.wifi && !search_obj.laundry && !search_obj.nsfas && search_obj.parking) {
            console.log('case 22');
            return this.afs.collection('/Apartments', function (ref) {
                return ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
                    .where('available', '==', true)
                    .where('price', "<=", search_obj.maxPrice)
                    .where('property.parking', '==', search_obj.parking)
                    .orderBy('price', 'asc');
            }).valueChanges();
        }
        else if (search_obj.apartment_type !== 'Any' && !search_obj.wifi && !search_obj.laundry && search_obj.nsfas && !search_obj.parking) {
            console.log('case 23');
            return this.afs.collection('/Apartments', function (ref) {
                return ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
                    .where('available', '==', true)
                    .where('price', "<=", search_obj.maxPrice)
                    .where('room_type', '==', search_obj.apartment_type)
                    .where('property.nsfas', '==', search_obj.nsfas)
                    .orderBy('price', 'asc');
            }).valueChanges();
        }
        else if (search_obj.apartment_type !== 'Any' && !search_obj.wifi && !search_obj.laundry && !search_obj.nsfas && search_obj.parking) {
            console.log('case 24');
            return this.afs.collection('/Apartments', function (ref) {
                return ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
                    .where('available', '==', true)
                    .where('price', "<=", search_obj.maxPrice)
                    .where('room_type', '==', search_obj.apartment_type)
                    .where('property.parking', '==', search_obj.parking)
                    .orderBy('price', 'asc');
            }).valueChanges();
        }
        else if (search_obj.apartment_type !== 'Any' && !search_obj.wifi && search_obj.laundry && !search_obj.nsfas && search_obj.parking) {
            console.log('case 24');
            return this.afs.collection('/Apartments', function (ref) {
                return ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
                    .where('available', '==', true)
                    .where('price', "<=", search_obj.maxPrice)
                    .where('room_type', '==', search_obj.apartment_type)
                    .where('property.parking', '==', search_obj.parking)
                    .where('property.laundry', '==', search_obj.laundry)
                    .orderBy('price', 'asc');
            }).valueChanges();
        }
        else if (search_obj.apartment_type !== 'Any' && !search_obj.wifi && !search_obj.laundry && search_obj.nsfas && search_obj.parking) {
            console.log('case 25');
            return this.afs.collection('/Apartments', function (ref) {
                return ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
                    .where('available', '==', true)
                    .where('price', "<=", search_obj.maxPrice)
                    .where('room_type', '==', search_obj.apartment_type)
                    .where('property.parking', '==', search_obj.parking)
                    .where('property.nsfas', '==', search_obj.nsfas)
                    .orderBy('price', 'asc');
            }).valueChanges();
        }
        else if (search_obj.apartment_type === 'Any' && !search_obj.wifi && search_obj.laundry && !search_obj.nsfas && search_obj.parking) {
            console.log('case 26');
            return this.afs.collection('/Apartments', function (ref) {
                return ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
                    .where('available', '==', true)
                    .where('price', "<=", search_obj.maxPrice)
                    .where('property.parking', '==', search_obj.parking)
                    .where('property.laundry', '==', search_obj.laundry)
                    .orderBy('price', 'asc');
            }).valueChanges();
        }
        else if (search_obj.apartment_type === 'Any' && search_obj.wifi && !search_obj.laundry && search_obj.nsfas && search_obj.parking) {
            console.log('case 27');
            return this.afs.collection('/Apartments', function (ref) {
                return ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
                    .where('available', '==', true)
                    .where('price', "<=", search_obj.maxPrice)
                    .where('property.nsfas', '==', search_obj.nsfas)
                    .where('property.wifi', '==', search_obj.wifi)
                    .orderBy('price', 'asc');
            }).valueChanges();
        }
        else if (search_obj.apartment_type === 'Any' && !search_obj.wifi && search_obj.laundry && search_obj.nsfas && search_obj.parking) {
            console.log('case 28');
            return this.afs.collection('/Apartments', function (ref) {
                return ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
                    .where('available', '==', true)
                    .where('price', "<=", search_obj.maxPrice)
                    .where('property.nsfas', '==', search_obj.nsfas)
                    .where('property.laundry', '==', search_obj.laundry)
                    .where('property.parking', '==', search_obj.parking)
                    .orderBy('price', 'asc');
            }).valueChanges();
        }
        else if (search_obj.apartment_type === 'Any' && !search_obj.wifi && !search_obj.laundry && search_obj.nsfas && search_obj.parking) {
            console.log('case 29');
            return this.afs.collection('/Apartments', function (ref) {
                return ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
                    .where('available', '==', true)
                    .where('price', "<=", search_obj.maxPrice)
                    .where('property.nsfas', '==', search_obj.nsfas)
                    .where('property.parking', '==', search_obj.parking)
                    .orderBy('price', 'asc');
            }).valueChanges();
        }
        else if (search_obj.apartment_type === 'Any' && !search_obj.wifi && search_obj.laundry && search_obj.nsfas && !search_obj.parking) {
            console.log('case 30');
            return this.afs.collection('/Apartments', function (ref) {
                return ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
                    .where('available', '==', true)
                    .where('price', "<=", search_obj.maxPrice)
                    .where('property.nsfas', '==', search_obj.nsfas)
                    .where('property.laundry', '==', search_obj.laundry)
                    .orderBy('price', 'asc');
            }).valueChanges();
        }
        else if (search_obj.apartment_type !== 'Any' && search_obj.wifi && !search_obj.laundry && !search_obj.nsfas && search_obj.parking) {
            console.log('case 31');
            return this.afs.collection('/Apartments', function (ref) {
                return ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
                    .where('available', '==', true)
                    .where('price', "<=", search_obj.maxPrice)
                    .where('room_type', '==', search_obj.apartment_type)
                    .where('property.parking', '==', search_obj.parking)
                    .where('property.wifi', '==', search_obj.wifi)
                    .orderBy('price', 'asc');
            }).valueChanges();
        }
        else {
            console.log('case 32');
            return this.afs.collection('/Apartments', function (ref) {
                return ref.where('property.address.locality_short', '==', search_obj.Address.locality_short)
                    .where('available', '==', true)
                    .orderBy('price', 'asc');
            }).valueChanges();
        }
    };
    AccommodationsProvider.prototype.getRatedApartments = function (search) {
        var _this = this;
        var ratedArray = [];
        return this.search(search)
            .pipe(map(function (apartments) {
            ratedArray = apartments;
            if (ratedArray.length > 0) {
                var ind = 0;
                ratedArray.forEach(function (apartment) {
                    ratedArray[ind].search_rating = _this.calcRating(apartment, search);
                    ++ind;
                });
                var tempRatedApart = ratedArray[0];
                for (var i = 1; i < ratedArray.length; ++i) {
                    if (ratedArray[i].search_rating > ratedArray[i].search_rating[i - 1]) {
                        tempRatedApart = ratedArray[i - 1];
                        ratedArray[i - 1] = ratedArray[i];
                        ratedArray[i] = tempRatedApart;
                    }
                }
            }
            return ratedArray;
        }));
    };
    AccommodationsProvider.prototype.calcRating = function (apartment, search) {
        var rating = 0;
        if (apartment.property.nearbys != undefined) {
            rating += apartment.property.nearbys.length / 100;
            if (apartment.property.nearbys.indexOf(search.Address.description) != -1)
                rating += 2;
        }
        if (apartment.property.wifi)
            rating += 1;
        if (apartment.property.laundry)
            rating += 1;
        rating += 40 * ((search.maxPrice - apartment.price) / search.maxPrice);
        return rating;
    };
    AccommodationsProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [AngularFirestore])
    ], AccommodationsProvider);
    return AccommodationsProvider;
}());
export { AccommodationsProvider };
//# sourceMappingURL=accommodations.js.map