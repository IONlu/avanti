'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.remove = exports.create = undefined;

var _client = require('../client.js');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const create = (() => {
    var _ref = _asyncToGenerator(function* (client, hostname) {
        try {
            yield new _client2.default(client).addHost(hostname);
        } catch (e) {
            console.error(e);
        }
    });

    return function create(_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();

const remove = (() => {
    var _ref2 = _asyncToGenerator(function* (client, hostname) {
        try {
            yield new _client2.default(client).removeHost(hostname);
        } catch (e) {
            console.error(e);
        }
    });

    return function remove(_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
})();

exports.create = create;
exports.remove = remove;