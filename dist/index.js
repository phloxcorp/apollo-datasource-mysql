"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_datasource_1 = require("apollo-datasource");
var MysqlDataSource = /** @class */ (function (_super) {
    __extends(MysqlDataSource, _super);
    function MysqlDataSource(pool) {
        var _this = _super.call(this) || this;
        _this.pool = pool;
        return _this;
    }
    MysqlDataSource.prototype.query = function (arg, values) {
        var _this = this;
        if (values) {
            return new Promise(function (resolve, reject) {
                _this.pool.query(arg, values, function (err, results, fields) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve({ results: results, fields: fields });
                    }
                });
            });
        }
        else {
            return new Promise(function (resolve, reject) {
                _this.pool.query(arg, function (err, results, fields) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve({ results: results, fields: fields });
                    }
                });
            });
        }
    };
    MysqlDataSource.prototype.getConnection = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.pool.getConnection(function (err, connection) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(connection);
                }
            });
        });
    };
    return MysqlDataSource;
}(apollo_datasource_1.DataSource));
exports.MysqlDataSource = MysqlDataSource;
