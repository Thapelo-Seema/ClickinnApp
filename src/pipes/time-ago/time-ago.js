var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Pipe, NgZone } from '@angular/core';
import { Observable } from 'rxjs-compat/observable';
var TimeAgoPipe = /** @class */ (function () {
    function TimeAgoPipe(ngZone) {
        var _this = this;
        this.ngZone = ngZone;
        this.process = function (timestamp) {
            var text;
            var timeToUpdate;
            var now = new Date();
            // Time ago in milliseconds
            var timeAgo = now.getTime() - timestamp;
            var seconds = timeAgo / 1000;
            var minutes = seconds / 60;
            var hours = minutes / 60;
            var days = hours / 24;
            var months = days / 30.416;
            var years = days / 365;
            if (seconds <= 10) {
                text = 'now';
            }
            else if (seconds <= 45) {
                text = 'a few seconds ago';
            }
            else if (seconds <= 90) {
                text = 'a minute ago';
            }
            else if (minutes <= 50) {
                text = Math.round(minutes) + ' minutes ago';
            }
            else if (hours <= 1.5) {
                text = 'an hour ago';
            }
            else if (hours <= 22) {
                text = Math.round(hours) + ' hours ago';
            }
            else if (hours <= 36) {
                text = 'a day ago';
            }
            else if (days <= 25) {
                text = Math.round(days) + ' days ago';
            }
            else if (months <= 1.5) {
                text = 'a month ago';
            }
            else if (months <= 11.5) {
                text = Math.round(months) + ' months ago';
            }
            else if (years <= 1.5) {
                text = 'a year ago';
            }
            else {
                text = Math.round(years) + ' years ago';
            }
            if (minutes < 1) {
                // update every 2 secs
                timeToUpdate = 2 * 1000;
            }
            else if (hours < 1) {
                // update every 30 secs
                timeToUpdate = 30 * 1000;
            }
            else if (days < 1) {
                // update every 5 mins
                timeToUpdate = 300 * 1000;
            }
            else {
                // update every hour
                timeToUpdate = 3600 * 1000;
            }
            return {
                text: text,
                timeToUpdate: timeToUpdate
            };
        };
        this.transform = function (value) {
            var d;
            if (value instanceof Date) {
                d = value;
            }
            else {
                d = new Date(value);
            }
            // time value in milliseconds
            var timestamp = d.getTime();
            var timeoutID;
            return Observable.create(function (observer) {
                var latestText = '';
                // Repeatedly set new timeouts for new update checks.
                var registerUpdate = function () {
                    var processOutput = _this.process(timestamp);
                    if (processOutput.text !== latestText) {
                        latestText = processOutput.text;
                        _this.ngZone.run(function () {
                            observer.next(latestText);
                        });
                    }
                    timeoutID = setTimeout(registerUpdate, processOutput.timeToUpdate);
                };
                _this.ngZone.runOutsideAngular(registerUpdate);
                // Return teardown function
                var teardownFunction = function () {
                    if (timeoutID) {
                        clearTimeout(timeoutID);
                    }
                };
                return teardownFunction;
            });
        };
    }
    TimeAgoPipe = __decorate([
        Pipe({
            name: 'timeAgo',
            pure: true
        }),
        __metadata("design:paramtypes", [NgZone])
    ], TimeAgoPipe);
    return TimeAgoPipe;
}());
export { TimeAgoPipe };
//# sourceMappingURL=time-ago.js.map