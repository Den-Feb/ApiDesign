"use strict";
exports.__esModule = true;
exports.ResponseWrapper = void 0;
var ResponseWrapper = /** @class */ (function () {
    function ResponseWrapper(result, status, message, data, datas, errors) {
        this.result = result;
        this.status = status;
        this.message = message;
        this.data = data;
        this.datas = datas;
        this.errors = errors;
    }
    return ResponseWrapper;
}());
exports.ResponseWrapper = ResponseWrapper;
