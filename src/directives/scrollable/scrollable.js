var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Directive, HostListener, EventEmitter, Output, ElementRef } from '@angular/core';
/**
 * Generated class for the ScrollableDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
var ScrollableDirective = /** @class */ (function () {
    function ScrollableDirective(el) {
        this.el = el;
        this.scrollPosition = new EventEmitter();
    }
    ScrollableDirective.prototype.onScroll = function (event) {
        try {
            var top_1 = event.target.scrollTop;
            var height = this.el.nativeElement.scrollHeight;
            var offset = this.el.nativeElement.offsetHeight;
            if (top_1 > height - offset - 1) {
                this.scrollPosition.emit('bottom');
            }
            else if (top_1 == 0) {
                this.scrollPosition.emit('top');
            }
        }
        catch (err) {
        }
    };
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], ScrollableDirective.prototype, "scrollPosition", void 0);
    __decorate([
        HostListener('scroll', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], ScrollableDirective.prototype, "onScroll", null);
    ScrollableDirective = __decorate([
        Directive({
            selector: '[scrollable]' // Attribute selector
        }),
        __metadata("design:paramtypes", [ElementRef])
    ], ScrollableDirective);
    return ScrollableDirective;
}());
export { ScrollableDirective };
//# sourceMappingURL=scrollable.js.map