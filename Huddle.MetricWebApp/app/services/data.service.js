"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/toPromise");
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Rx_1 = require("rxjs/Rx");
var DataService = (function () {
    function DataService(_http) {
        this._http = _http;
    }
    DataService.prototype.getHeader = function (token) {
        var header = new http_1.Headers();
        header.append('Authorization', 'Bearer ' + token);
        return header;
    };
    DataService.prototype.getHeaderWithoutToken = function () {
        var header = new http_1.Headers();
        return header;
    };
    DataService.prototype.getRandomTick = function (url) {
        var result = '';
        if (url.indexOf('?') < 0)
            result += '?';
        else
            result += '&';
        result += ('t=' + new Date().getTime());
        return result;
    };
    DataService.prototype.get = function (actionUrl) {
        var activeProject = new Rx_1.ReplaySubject(1);
        this._http.get(actionUrl + this.getRandomTick(actionUrl), { headers: this.getHeaderWithoutToken() })
            .subscribe(function (data) {
            activeProject.next(data);
        }, function (error) {
            activeProject.error(error);
        });
        return activeProject;
    };
    DataService.prototype.getObject = function (actionUrl) {
        var activeProject = new Rx_1.ReplaySubject(1);
        this._http.get(actionUrl + this.getRandomTick(actionUrl), { headers: this.getHeaderWithoutToken() })
            .subscribe(function (data) {
            activeProject.next(data.json());
        }, function (error) {
            activeProject.error(error);
        });
        return activeProject;
    };
    DataService.prototype.getArray = function (actionUrl) {
        return this.getObject(actionUrl)
            .map(function (data) {
            return data;
        });
    };
    DataService.prototype.post = function (actionUrl, data) {
        var activeProject = new Rx_1.ReplaySubject(1);
        this._http.post(actionUrl, data, { headers: this.getHeaderWithoutToken() })
            .subscribe(function (data) { return activeProject.next(data.json()); }, function (error) { return activeProject.error(error); });
        return activeProject;
    };
    DataService.prototype.getWithoutToken = function (actionUrl) {
        return this._http.get(actionUrl);
    };
    DataService.prototype.handleError = function (error) {
        return Rx_1.Observable.throw(error.json().error || 'Server error');
    };
    return DataService;
}());
DataService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], DataService);
exports.DataService = DataService;
//# sourceMappingURL=data.service.js.map