var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from '@angular/core';
//import { Apartment } from '../../models/properties/apartment.interface';
/**
 * Generated class for the AccommodationsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
var AccommodationsComponent = /** @class */ (function () {
    function AccommodationsComponent() {
        this.imageLoaded = false;
    }
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AccommodationsComponent.prototype, "apartment", void 0);
    AccommodationsComponent = __decorate([
        Component({
            selector: 'accommodations',
            templateUrl: 'accommodations.html'
        }),
        __metadata("design:paramtypes", [])
    ], AccommodationsComponent);
    return AccommodationsComponent;
}());
export { AccommodationsComponent };
//# sourceMappingURL=accommodations.js.map