/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 40);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.getCurrentGlobalMTime = getCurrentGlobalMTime;
exports.setLoggerFunction = setLoggerFunction;
exports.vtkLogMacro = vtkLogMacro;
exports.vtkInfoMacro = vtkInfoMacro;
exports.vtkDebugMacro = vtkDebugMacro;
exports.vtkErrorMacro = vtkErrorMacro;
exports.vtkWarningMacro = vtkWarningMacro;
exports.capitalize = capitalize;
exports.safeArrays = safeArrays;
exports.enumToString = enumToString;
exports.getStateArrayMapFunc = getStateArrayMapFunc;
exports.obj = obj;
exports.get = get;
exports.set = set;
exports.setGet = setGet;
exports.getArray = getArray;
exports.setArray = setArray;
exports.setGetArray = setGetArray;
exports.algo = algo;
exports.event = event;
exports.newInstance = newInstance;
exports.chain = chain;
exports.isVtkObject = isVtkObject;
exports.traverseInstanceTree = traverseInstanceTree;
exports.debounce = debounce;

var _vtk = __webpack_require__(9);

var _vtk2 = _interopRequireDefault(_vtk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var globalMTime = 0;

function getCurrentGlobalMTime() {
  return globalMTime;
}

// ----------------------------------------------------------------------------
// Loggins function calls
// ----------------------------------------------------------------------------
/* eslint-disable no-prototype-builtins                                      */

var fakeConsole = {};
function noOp() {}

var consoleMethods = ['log', 'debug', 'info', 'warn', 'error', 'time', 'timeEnd', 'group', 'groupEnd'];
consoleMethods.forEach(function (methodName) {
  fakeConsole[methodName] = noOp;
});

global.console = window.console.hasOwnProperty('log') ? window.console : fakeConsole;

var loggerFunctions = {
  debug: noOp, // Don't print debug by default
  error: global.console.error || noOp,
  info: global.console.info || noOp,
  log: global.console.log || noOp,
  warn: global.console.warn || noOp
};

function setLoggerFunction(name, fn) {
  if (loggerFunctions[name]) {
    loggerFunctions[name] = fn || noOp;
  }
}

function vtkLogMacro() {
  loggerFunctions.log.apply(loggerFunctions, arguments);
}

function vtkInfoMacro() {
  loggerFunctions.info.apply(loggerFunctions, arguments);
}

function vtkDebugMacro() {
  loggerFunctions.debug.apply(loggerFunctions, arguments);
}

function vtkErrorMacro() {
  loggerFunctions.error.apply(loggerFunctions, arguments);
}

function vtkWarningMacro() {
  loggerFunctions.warn.apply(loggerFunctions, arguments);
}

// ----------------------------------------------------------------------------
// capitilze provided string
// ----------------------------------------------------------------------------

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ----------------------------------------------------------------------------
// Array helper
// ----------------------------------------------------------------------------

function safeArrays(model) {
  Object.keys(model).forEach(function (key) {
    if (Array.isArray(model[key])) {
      model[key] = [].concat(model[key]);
    }
  });
}

// ----------------------------------------------------------------------------

function enumToString(e, value) {
  return Object.keys(e).find(function (key) {
    return e[key] === value;
  });
}

function getStateArrayMapFunc(item) {
  if (item.isA) {
    return item.getState();
  }
  return item;
}

// ----------------------------------------------------------------------------
// vtkObject: modified(), onModified(callback), delete()
// ----------------------------------------------------------------------------

function obj() {
  var publicAPI = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var model = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // Ensure each instance as a unique ref of array
  safeArrays(model);

  var callbacks = [];
  model.mtime = Number.isInteger(model.mtime) ? model.mtime : ++globalMTime;
  model.classHierarchy = ['vtkObject'];

  function off(index) {
    callbacks[index] = null;
  }

  function on(index) {
    function unsubscribe() {
      off(index);
    }
    return Object.freeze({ unsubscribe: unsubscribe });
  }

  publicAPI.isDeleted = function () {
    return !!model.deleted;
  };

  publicAPI.modified = function () {
    if (model.deleted) {
      vtkErrorMacro('instance deleted - cannot call any method');
      return;
    }

    model.mtime = ++globalMTime;
    callbacks.forEach(function (callback) {
      return callback && callback(publicAPI);
    });
  };

  publicAPI.onModified = function (callback) {
    if (model.deleted) {
      vtkErrorMacro('instance deleted - cannot call any method');
      return null;
    }

    var index = callbacks.length;
    callbacks.push(callback);
    return on(index);
  };

  publicAPI.getMTime = function () {
    return model.mtime;
  };

  publicAPI.isA = function (className) {
    return model.classHierarchy.indexOf(className) !== -1;
  };

  publicAPI.getClassName = function () {
    var depth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    return model.classHierarchy[model.classHierarchy.length - 1 - depth];
  };

  publicAPI.set = function () {
    var map = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var noWarning = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var noFunction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var ret = false;
    Object.keys(map).forEach(function (name) {
      var fn = noFunction ? null : publicAPI['set' + capitalize(name)];
      if (fn && Array.isArray(map[name])) {
        ret = fn.apply(undefined, _toConsumableArray(map[name])) || ret;
      } else if (fn) {
        ret = fn(map[name]) || ret;
      } else {
        // Set data on model directly
        if (['mtime'].indexOf(name) === -1 && !noWarning) {
          vtkWarningMacro('Warning: Set value to model directly ' + name + ', ' + map[name]);
        }
        model[name] = map[name];
        ret = true;
      }
    });
    return ret;
  };

  publicAPI.get = function () {
    for (var _len = arguments.length, list = Array(_len), _key = 0; _key < _len; _key++) {
      list[_key] = arguments[_key];
    }

    if (!list.length) {
      return model;
    }
    var subset = {};
    list.forEach(function (name) {
      subset[name] = model[name];
    });
    return subset;
  };

  publicAPI.delete = function () {
    Object.keys(model).forEach(function (field) {
      return delete model[field];
    });
    callbacks.forEach(function (el, index) {
      return off(index);
    });

    // Flag the instance being deleted
    model.deleted = true;
  };

  // Add serialization support
  publicAPI.getState = function () {
    var jsonArchive = Object.assign({}, model, { vtkClass: publicAPI.getClassName() });

    // Convert every vtkObject to its serializable form
    Object.keys(jsonArchive).forEach(function (keyName) {
      if (jsonArchive[keyName] === null || jsonArchive[keyName] === undefined) {
        delete jsonArchive[keyName];
      } else if (jsonArchive[keyName].isA) {
        jsonArchive[keyName] = jsonArchive[keyName].getState();
      } else if (Array.isArray(jsonArchive[keyName])) {
        jsonArchive[keyName] = jsonArchive[keyName].map(getStateArrayMapFunc);
      }
    });

    // Sort resulting object by key name
    var sortedObj = {};
    Object.keys(jsonArchive).sort().forEach(function (name) {
      sortedObj[name] = jsonArchive[name];
    });

    // Remove mtime
    if (sortedObj.mtime) {
      delete sortedObj.mtime;
    }

    return sortedObj;
  };

  // Add shallowCopy(otherInstance) support
  publicAPI.shallowCopy = function (other) {
    var debug = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (other.getClassName() !== publicAPI.getClassName()) {
      throw new Error('Cannot ShallowCopy ' + other.getClassName() + ' into ' + publicAPI.getClassName());
    }
    var otherModel = other.get();

    var keyList = Object.keys(model).sort();
    var otherKeyList = Object.keys(otherModel).sort();

    otherKeyList.forEach(function (key) {
      var keyIdx = keyList.indexOf(key);
      if (keyIdx === -1) {
        if (debug) {
          vtkDebugMacro('add ' + key + ' in shallowCopy');
        }
      } else {
        keyList.splice(keyIdx, 1);
      }
      model[key] = otherModel[key];
    });
    if (keyList.length && debug) {
      vtkDebugMacro('Untouched keys: ' + keyList.join(', '));
    }

    publicAPI.modified();
  };
}

// ----------------------------------------------------------------------------
// getXXX: add getters
// ----------------------------------------------------------------------------

function get(publicAPI, model, fieldNames) {
  fieldNames.forEach(function (field) {
    if ((typeof field === 'undefined' ? 'undefined' : _typeof(field)) === 'object') {
      publicAPI['get' + capitalize(field.name)] = function () {
        return model[field.name];
      };
    } else {
      publicAPI['get' + capitalize(field)] = function () {
        return model[field];
      };
    }
  });
}

// ----------------------------------------------------------------------------
// setXXX: add setters
// ----------------------------------------------------------------------------

var objectSetterMap = {
  enum: function _enum(publicAPI, model, field) {
    return function (value) {
      if (typeof value === 'string') {
        if (field.enum[value] !== undefined) {
          if (model[field.name] !== field.enum[value]) {
            model[field.name] = field.enum[value];
            publicAPI.modified();
            return true;
          }
          return false;
        }
        vtkErrorMacro('Set Enum with invalid argument ' + field + ', ' + value);
        throw new RangeError('Set Enum with invalid string argument');
      }
      if (typeof value === 'number') {
        if (model[field.name] !== value) {
          if (Object.keys(field.enum).map(function (key) {
            return field.enum[key];
          }).indexOf(value) !== -1) {
            model[field.name] = value;
            publicAPI.modified();
            return true;
          }
          vtkErrorMacro('Set Enum outside numeric range ' + field + ', ' + value);
          throw new RangeError('Set Enum outside numeric range');
        }
        return false;
      }
      vtkErrorMacro('Set Enum with invalid argument (String/Number) ' + field + ', ' + value);
      throw new TypeError('Set Enum with invalid argument (String/Number)');
    };
  }
};

function findSetter(field) {
  if ((typeof field === 'undefined' ? 'undefined' : _typeof(field)) === 'object') {
    var fn = objectSetterMap[field.type];
    if (fn) {
      return function (publicAPI, model) {
        return fn(publicAPI, model, field);
      };
    }

    vtkErrorMacro('No setter for field ' + field);
    throw new TypeError('No setter for field');
  }
  return function getSetter(publicAPI, model) {
    return function setter(value) {
      if (model.deleted) {
        vtkErrorMacro('instance deleted - cannot call any method');
        return false;
      }

      if (model[field] !== value) {
        model[field] = value;
        publicAPI.modified();
        return true;
      }
      return false;
    };
  };
}

function set(publicAPI, model, fields) {
  fields.forEach(function (field) {
    if ((typeof field === 'undefined' ? 'undefined' : _typeof(field)) === 'object') {
      publicAPI['set' + capitalize(field.name)] = findSetter(field)(publicAPI, model);
    } else {
      publicAPI['set' + capitalize(field)] = findSetter(field)(publicAPI, model);
    }
  });
}

// ----------------------------------------------------------------------------
// set/get XXX: add both setters and getters
// ----------------------------------------------------------------------------

function setGet(publicAPI, model, fieldNames) {
  get(publicAPI, model, fieldNames);
  set(publicAPI, model, fieldNames);
}

// ----------------------------------------------------------------------------
// getXXX: add getters for object of type array
// ----------------------------------------------------------------------------

function getArray(publicAPI, model, fieldNames) {
  fieldNames.forEach(function (field) {
    publicAPI['get' + capitalize(field)] = function () {
      return [].concat(model[field]);
    };
  });
}

// ----------------------------------------------------------------------------
// setXXX: add setter for object of type array
// if 'defaultVal' is supplied, shorter arrays will be padded to 'size' with 'defaultVal'
// ----------------------------------------------------------------------------

function setArray(publicAPI, model, fieldNames, size) {
  var defaultVal = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

  fieldNames.forEach(function (field) {
    publicAPI['set' + capitalize(field)] = function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      if (model.deleted) {
        vtkErrorMacro('instance deleted - cannot call any method');
        return false;
      }

      var array = args;
      // allow an array passed as a single arg.
      if (array.length === 1 && Array.isArray(array[0])) {
        array = array[0];
      }

      if (array.length !== size) {
        if (array.length < size && defaultVal !== undefined) {
          array = [].concat(array);
          while (array.length < size) {
            array.push(defaultVal);
          }
        } else {
          throw new RangeError('Invalid number of values for array setter');
        }
      }
      var changeDetected = false;
      model[field].forEach(function (item, index) {
        if (item !== array[index]) {
          if (changeDetected) {
            return;
          }
          changeDetected = true;
        }
      });

      if (changeDetected || model[field].length !== array.length) {
        model[field] = [].concat(array);
        publicAPI.modified();
      }
      return true;
    };
  });
}

// ----------------------------------------------------------------------------
// set/get XXX: add setter and getter for object of type array
// ----------------------------------------------------------------------------

function setGetArray(publicAPI, model, fieldNames, size) {
  var defaultVal = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

  getArray(publicAPI, model, fieldNames);
  setArray(publicAPI, model, fieldNames, size, defaultVal);
}

// ----------------------------------------------------------------------------
// vtkAlgorithm: setInputData(), setInputConnection(), getOutput(), getOutputPort()
// ----------------------------------------------------------------------------

function algo(publicAPI, model, numberOfInputs, numberOfOutputs) {
  if (model.inputData) {
    model.inputData = model.inputData.map(_vtk2.default);
  } else {
    model.inputData = [];
  }

  if (model.inputConnection) {
    model.inputConnection = model.inputConnection.map(_vtk2.default);
  } else {
    model.inputConnection = [];
  }

  if (model.output) {
    model.output = model.output.map(_vtk2.default);
  } else {
    model.output = [];
  }

  if (model.inputArrayToProcess) {
    model.inputArrayToProcess = model.inputArrayToProcess.map(_vtk2.default);
  } else {
    model.inputArrayToProcess = [];
  }

  // Methods
  function setInputData(dataset) {
    var port = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    if (model.deleted) {
      vtkErrorMacro('instance deleted - cannot call any method');
      return;
    }
    if (model.inputData[port] !== dataset || model.inputConnection[port]) {
      model.inputData[port] = dataset;
      model.inputConnection[port] = null;
      if (publicAPI.modified) {
        publicAPI.modified();
      }
    }
  }

  function getInputData() {
    var port = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    if (model.inputConnection[port]) {
      model.inputData[port] = model.inputConnection[port]();
    }
    return model.inputData[port];
  }

  function setInputConnection(outputPort) {
    var port = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    if (model.deleted) {
      vtkErrorMacro('instance deleted - cannot call any method');
      return;
    }
    model.inputData[port] = null;
    model.inputConnection[port] = outputPort;
  }

  function getInputConnection() {
    var port = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    return model.inputConnection[port];
  }

  function getOutputData() {
    var port = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    if (model.deleted) {
      vtkErrorMacro('instance deleted - cannot call any method');
      return null;
    }
    if (publicAPI.shouldUpdate()) {
      // console.log('update filter', publicAPI.getClassName());
      publicAPI.update();
    }
    return model.output[port];
  }

  publicAPI.shouldUpdate = function () {
    var localMTime = publicAPI.getMTime();
    var count = numberOfOutputs;
    while (count--) {
      if (!model.output[count] || model.output[count].getMTime() < localMTime) {
        return true;
      }
    }

    count = numberOfInputs;
    while (count--) {
      if (model.inputConnection[count] && model.inputConnection[count].filter.shouldUpdate()) {
        return true;
      }
    }

    var minOutputMTime = Math.min.apply(Math, _toConsumableArray(model.output.filter(function (i) {
      return !!i;
    }).map(function (i) {
      return i.getMTime();
    })));
    count = numberOfInputs;
    while (count--) {
      if (publicAPI.getInputData(count) && publicAPI.getInputData(count).getMTime() > minOutputMTime) {
        return true;
      }
    }
    return false;
  };

  function getOutputPort() {
    var port = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    var outputPortAccess = function outputPortAccess() {
      return getOutputData(port);
    };
    // Add reference to filter
    outputPortAccess.filter = publicAPI;
    return outputPortAccess;
  }

  // Handle input if needed
  if (numberOfInputs) {
    // Reserve inputs
    var count = numberOfInputs;
    while (count--) {
      model.inputData.push(null);
      model.inputConnection.push(null);
    }

    // Expose public methods
    publicAPI.setInputData = setInputData;
    publicAPI.setInputConnection = setInputConnection;
    publicAPI.getInputData = getInputData;
    publicAPI.getInputConnection = getInputConnection;
  }

  if (numberOfOutputs) {
    publicAPI.getOutputData = getOutputData;
    publicAPI.getOutputPort = getOutputPort;
  }

  publicAPI.update = function () {
    var ins = [];
    if (numberOfInputs) {
      var _count = 0;
      while (_count < numberOfInputs) {
        ins[_count] = publicAPI.getInputData(_count);
        _count++;
      }
    }
    if (publicAPI.shouldUpdate()) {
      publicAPI.requestData(ins, model.output);
    }
  };

  publicAPI.getNumberOfInputPorts = function () {
    return numberOfInputs;
  };
  publicAPI.getNumberOfOutputPorts = function () {
    return numberOfOutputs;
  };

  publicAPI.getInputArrayToProcess = function (inputPort) {
    var arrayDesc = model.inputArrayToProcess[inputPort];
    var ds = model.inputData[inputPort];
    if (arrayDesc && ds) {
      return ds['get' + arrayDesc.fieldAssociation]().getArray(arrayDesc.arrayName);
    }
    return null;
  };
  publicAPI.setInputArrayToProcess = function (inputPort, arrayName, fieldAssociation) {
    var attributeType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'Scalars';

    while (model.inputArrayToProcess.length < inputPort) {
      model.inputArrayToProcess.push(null);
    }
    model.inputArrayToProcess[inputPort] = { arrayName: arrayName, fieldAssociation: fieldAssociation, attributeType: attributeType };
  };
}

// ----------------------------------------------------------------------------
// Event handling: onXXX(callback), invokeXXX(args...)
// ----------------------------------------------------------------------------

function event(publicAPI, model, eventName) {
  var callbacks = [];
  var previousDelete = publicAPI.delete;

  function off(index) {
    callbacks[index] = null;
  }

  function on(index) {
    function unsubscribe() {
      off(index);
    }
    return Object.freeze({ unsubscribe: unsubscribe });
  }

  publicAPI['invoke' + capitalize(eventName)] = function () {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    if (model.deleted) {
      vtkErrorMacro('instance deleted - cannot call any method');
      return;
    }

    callbacks.forEach(function (callback) {
      return callback && callback.apply(publicAPI, args);
    });
  };

  publicAPI['on' + capitalize(eventName)] = function (callback) {
    if (model.deleted) {
      vtkErrorMacro('instance deleted - cannot call any method');
      return null;
    }

    var index = callbacks.length;
    callbacks.push(callback);
    return on(index);
  };

  publicAPI.delete = function () {
    previousDelete();
    callbacks.forEach(function (el, index) {
      return off(index);
    });
  };
}

// ----------------------------------------------------------------------------
// newInstance
// ----------------------------------------------------------------------------

function newInstance(extend, className) {
  var constructor = function constructor() {
    var initialValues = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var model = {};
    var publicAPI = {};
    extend(publicAPI, model, initialValues);
    return Object.freeze(publicAPI);
  };

  // Register constructor to factory
  if (className) {
    _vtk2.default.register(className, constructor);
  }

  return constructor;
}

// ----------------------------------------------------------------------------
// Chain function calls
// ----------------------------------------------------------------------------

function chain() {
  for (var _len4 = arguments.length, fn = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    fn[_key4] = arguments[_key4];
  }

  return function () {
    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    return fn.filter(function (i) {
      return !!i;
    }).forEach(function (i) {
      return i.apply(undefined, args);
    });
  };
}

// ----------------------------------------------------------------------------
// Some utility methods for vtk objects
// ----------------------------------------------------------------------------

function isVtkObject(instance) {
  return instance && instance.isA && instance.isA('vtkObject');
}

function traverseInstanceTree(instance, extractFunction) {
  var accumulator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var visitedInstances = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

  if (isVtkObject(instance)) {
    if (visitedInstances.indexOf(instance) >= 0) {
      // avoid cycles
      return accumulator;
    }

    visitedInstances.push(instance);
    var result = extractFunction(instance);
    if (result !== undefined) {
      accumulator.push(result);
    }

    // Now go through this instance's model
    var model = instance.get();
    Object.keys(model).forEach(function (key) {
      var modelObj = model[key];
      if (Array.isArray(modelObj)) {
        modelObj.forEach(function (subObj) {
          traverseInstanceTree(subObj, extractFunction, accumulator, visitedInstances);
        });
      } else {
        traverseInstanceTree(modelObj, extractFunction, accumulator, visitedInstances);
      }
    });
  }

  return accumulator;
}

// ----------------------------------------------------------------------------
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.

function debounce(func, wait, immediate) {
  var _this = this;

  var timeout;
  return function () {
    for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      args[_key6] = arguments[_key6];
    }

    var context = _this;
    var later = function later() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
}

// ----------------------------------------------------------------------------
// Default export
// ----------------------------------------------------------------------------

exports.default = {
  algo: algo,
  capitalize: capitalize,
  chain: chain,
  enumToString: enumToString,
  event: event,
  get: get,
  getArray: getArray,
  getCurrentGlobalMTime: getCurrentGlobalMTime,
  getStateArrayMapFunc: getStateArrayMapFunc,
  isVtkObject: isVtkObject,
  newInstance: newInstance,
  obj: obj,
  safeArrays: safeArrays,
  set: set,
  setArray: setArray,
  setGet: setGet,
  setGetArray: setGetArray,
  setLoggerFunction: setLoggerFunction,
  traverseInstanceTree: traverseInstanceTree,
  vtkDebugMacro: vtkDebugMacro,
  vtkErrorMacro: vtkErrorMacro,
  vtkInfoMacro: vtkInfoMacro,
  vtkLogMacro: vtkLogMacro,
  vtkWarningMacro: vtkWarningMacro,
  debounce: debounce
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(17)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _seedrandom = __webpack_require__(48);

var _seedrandom2 = _interopRequireDefault(_seedrandom);

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vtkErrorMacro = _macro2.default.vtkErrorMacro,
    vtkWarningMacro = _macro2.default.vtkWarningMacro;

// ----------------------------------------------------------------------------
/* eslint-disable camelcase                                                  */
/* eslint-disable no-cond-assign                                             */
/* eslint-disable no-bitwise                                                 */
/* eslint-disable no-multi-assign                                            */
// ----------------------------------------------------------------------------

var randomSeedValue = 0;
var VTK_MAX_ROTATIONS = 20;
var VTK_SMALL_NUMBER = 1.0e-12;

function notImplemented(method) {
  return function () {
    return vtkErrorMacro('vtkMath::' + method + ' - NOT IMPLEMENTED');
  };
}

function vtkSwapVectors3(v1, v2) {
  for (var i = 0; i < 3; i++) {
    var tmp = v1[i];
    v1[i] = v2[i];
    v2[i] = tmp;
  }
}

function createArray() {
  var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;

  var array = [];
  while (array.length < size) {
    array.push(0);
  }
  return array;
}

// ----------------------------------------------------------------------------
// Global methods
// ----------------------------------------------------------------------------

var Pi = function Pi() {
  return Math.PI;
};
var radiansFromDegrees = function radiansFromDegrees(deg) {
  return deg / 180 * Math.PI;
};
var degreesFromRadians = function degreesFromRadians(rad) {
  return rad * 180 / Math.PI;
};
var round = Math.round;
var floor = Math.floor;
var ceil = Math.ceil;
var ceilLog2 = notImplemented('ceilLog2');
var min = Math.min;
var max = Math.max;
var factorial = notImplemented('factorial');

function nearestPowerOfTwo(xi) {
  var v = 1;
  while (v < xi) {
    v *= 2;
  }
  return v;
}

function isPowerOfTwo(x) {
  return x === nearestPowerOfTwo(x);
}

function binomial(m, n) {
  var r = 1;
  for (var i = 1; i <= n; ++i) {
    r *= (m - i + 1) / i;
  }
  return Math.floor(r);
}

function beginCombination(m, n) {
  if (m < n) {
    return 0;
  }

  var r = createArray(n);
  for (var i = 0; i < n; ++i) {
    r[i] = i;
  }
  return r;
}

function nextCombination(m, n, r) {
  var status = 0;
  for (var i = n - 1; i >= 0; --i) {
    if (r[i] < m - n + i) {
      var j = r[i] + 1;
      while (i < n) {
        r[i++] = j++;
      }
      status = 1;
      break;
    }
  }
  return status;
}

var randomSeed = function randomSeed(seed) {
  (0, _seedrandom2.default)('' + seed, { global: true });
  randomSeedValue = seed;
};

var getSeed = function getSeed() {
  return randomSeedValue;
};

function random() {
  var minValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var maxValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  var delta = maxValue - minValue;
  return minValue + delta * Math.random();
}

var gaussian = notImplemented('gaussian');

// Vect3 operations
function add(a, b, out) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
}

function subtract(a, b, out) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
}

function multiplyScalar(vec, scalar) {
  vec[0] *= scalar;
  vec[1] *= scalar;
  vec[2] *= scalar;
}

function multiplyScalar2D(vec, scalar) {
  vec[0] *= scalar;
  vec[1] *= scalar;
}

function dot(x, y) {
  return x[0] * y[0] + x[1] * y[1] + x[2] * y[2];
}

function outer(x, y, out_3x3) {
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      out_3x3[i][j] = x[i] * y[j];
    }
  }
}

function cross(x, y, out) {
  var Zx = x[1] * y[2] - x[2] * y[1];
  var Zy = x[2] * y[0] - x[0] * y[2];
  var Zz = x[0] * y[1] - x[1] * y[0];
  out[0] = Zx;
  out[1] = Zy;
  out[2] = Zz;
}

function norm(x) {
  var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;

  switch (n) {
    case 1:
      return Math.abs(x);
    case 2:
      return Math.sqrt(x[0] * x[0] + x[1] * x[1]);
    case 3:
      return Math.sqrt(x[0] * x[0] + x[1] * x[1] + x[2] * x[2]);
    default:
      {
        var sum = 0;
        for (var i = 0; i < n; i++) {
          sum += x[i] * x[i];
        }
        return Math.sqrt(sum);
      }
  }
}

function normalize(x) {
  var den = norm(x);
  if (den !== 0.0) {
    x[0] /= den;
    x[1] /= den;
    x[2] /= den;
  }
  return den;
}

function perpendiculars(x, y, z, theta) {
  var x2 = x[0] * x[0];
  var y2 = x[1] * x[1];
  var z2 = x[2] * x[2];
  var r = Math.sqrt(x2 + y2 + z2);

  var dx = void 0;
  var dy = void 0;
  var dz = void 0;

  // transpose the vector to avoid divide-by-zero error
  if (x2 > y2 && x2 > z2) {
    dx = 0;
    dy = 1;
    dz = 2;
  } else if (y2 > z2) {
    dx = 1;
    dy = 2;
    dz = 0;
  } else {
    dx = 2;
    dy = 0;
    dz = 1;
  }

  var a = x[dx] / r;
  var b = x[dy] / r;
  var c = x[dz] / r;
  var tmp = Math.sqrt(a * a + c * c);

  if (theta !== 0) {
    var sintheta = Math.sin(theta);
    var costheta = Math.cos(theta);

    if (y) {
      y[dx] = (c * costheta - a * b * sintheta) / tmp;
      y[dy] = sintheta * tmp;
      y[dz] = (-(a * costheta) - b * c * sintheta) / tmp;
    }

    if (z) {
      z[dx] = (-(c * sintheta) - a * b * costheta) / tmp;
      z[dy] = costheta * tmp;
      z[dz] = (a * sintheta - b * c * costheta) / tmp;
    }
  } else {
    if (y) {
      y[dx] = c / tmp;
      y[dy] = 0;
      y[dz] = -a / tmp;
    }

    if (z) {
      z[dx] = -a * b / tmp;
      z[dy] = tmp;
      z[dz] = -b * c / tmp;
    }
  }
}

function projectVector(a, b, projection) {
  var bSquared = dot(b, b);

  if (bSquared === 0) {
    projection[0] = 0;
    projection[1] = 0;
    projection[2] = 0;
    return false;
  }

  var scale = dot(a, b) / bSquared;

  for (var i = 0; i < 3; i++) {
    projection[i] = b[i];
  }
  multiplyScalar(projection, scale);

  return true;
}

function dot2D(x, y) {
  return x[0] * y[0] + x[1] * y[1];
}

function projectVector2D(a, b, projection) {
  var bSquared = dot2D(b, b);

  if (bSquared === 0) {
    projection[0] = 0;
    projection[1] = 0;
    return false;
  }

  var scale = dot2D(a, b) / bSquared;

  for (var i = 0; i < 2; i++) {
    projection[i] = b[i];
  }
  multiplyScalar2D(projection, scale);

  return true;
}

function distance2BetweenPoints(x, y) {
  return (x[0] - y[0]) * (x[0] - y[0]) + (x[1] - y[1]) * (x[1] - y[1]) + (x[2] - y[2]) * (x[2] - y[2]);
}

function angleBetweenVectors(v1, v2) {
  var crossVect = [0, 0, 0];
  cross(v1, v2, crossVect);
  return Math.atan2(norm(crossVect), dot(v1, v2));
}

function gaussianAmplitude(mean, variance, position) {
  var distanceFromMean = Math.abs(mean - position);
  return 1 / Math.sqrt(2 * Math.PI * variance) * Math.exp(-Math.pow(distanceFromMean, 2) / (2 * variance));
}

function gaussianWeight(mean, variance, position) {
  var distanceFromMean = Math.abs(mean - position);
  return Math.exp(-Math.pow(distanceFromMean, 2) / (2 * variance));
}

function outer2D(x, y, out_2x2) {
  for (var i = 0; i < 2; i++) {
    for (var j = 0; j < 2; j++) {
      out_2x2[i][j] = x[i] * y[j];
    }
  }
}

function norm2D(x2D) {
  return Math.sqrt(x2D[0] * x2D[0] + x2D[1] * x2D[1]);
}

function normalize2D(x) {
  var den = norm2D(x);
  if (den !== 0.0) {
    x[0] /= den;
    x[1] /= den;
  }
  return den;
}

function determinant2x2() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length === 2) {
    return args[0][0] * args[1][1] - args[1][0] * args[0][1];
  }
  if (args.length === 4) {
    return args[0] * args[3] - args[1] * args[2];
  }
  return Number.NaN;
}

function LUFactor3x3(mat_3x3, index_3) {
  var maxI = void 0;
  var tmp = void 0;
  var largest = void 0;
  var scale = [0, 0, 0];

  // Loop over rows to get implicit scaling information
  for (var i = 0; i < 3; i++) {
    largest = Math.abs(mat_3x3[i][0]);
    if ((tmp = Math.abs(mat_3x3[i][1])) > largest) {
      largest = tmp;
    }
    if ((tmp = Math.abs(mat_3x3[i][2])) > largest) {
      largest = tmp;
    }
    scale[i] = 1 / largest;
  }

  // Loop over all columns using Crout's method

  // first column
  largest = scale[0] * Math.abs(mat_3x3[0][0]);
  maxI = 0;
  if ((tmp = scale[1] * Math.abs(mat_3x3[1][0])) >= largest) {
    largest = tmp;
    maxI = 1;
  }
  if ((tmp = scale[2] * Math.abs(mat_3x3[2][0])) >= largest) {
    maxI = 2;
  }
  if (maxI !== 0) {
    vtkSwapVectors3(mat_3x3[maxI], mat_3x3[0]);
    scale[maxI] = scale[0];
  }
  index_3[0] = maxI;

  mat_3x3[1][0] /= mat_3x3[0][0];
  mat_3x3[2][0] /= mat_3x3[0][0];

  // second column
  mat_3x3[1][1] -= mat_3x3[1][0] * mat_3x3[0][1];
  mat_3x3[2][1] -= mat_3x3[2][0] * mat_3x3[0][1];
  largest = scale[1] * Math.abs(mat_3x3[1][1]);
  maxI = 1;
  if ((tmp = scale[2] * Math.abs(mat_3x3[2][1])) >= largest) {
    maxI = 2;
    vtkSwapVectors3(mat_3x3[2], mat_3x3[1]);
    scale[2] = scale[1];
  }
  index_3[1] = maxI;
  mat_3x3[2][1] /= mat_3x3[1][1];

  // third column
  mat_3x3[1][2] -= mat_3x3[1][0] * mat_3x3[0][2];
  mat_3x3[2][2] -= mat_3x3[2][0] * mat_3x3[0][2] + mat_3x3[2][1] * mat_3x3[1][2];
  index_3[2] = 2;
}

function LUSolve3x3(mat_3x3, index_3, x_3) {
  // forward substitution
  var sum = x_3[index_3[0]];
  x_3[index_3[0]] = x_3[0];
  x_3[0] = sum;

  sum = x_3[index_3[1]];
  x_3[index_3[1]] = x_3[1];
  x_3[1] = sum - mat_3x3[1][0] * x_3[0];

  sum = x_3[index_3[2]];
  x_3[index_3[2]] = x_3[2];
  x_3[2] = sum - mat_3x3[2][0] * x_3[0] - mat_3x3[2][1] * x_3[1];

  // back substitution
  x_3[2] /= mat_3x3[2][2];
  x_3[1] = (x_3[1] - mat_3x3[1][2] * x_3[2]) / mat_3x3[1][1];
  x_3[0] = (x_3[0] - mat_3x3[0][1] * x_3[1] - mat_3x3[0][2] * x_3[2]) / mat_3x3[0][0];
}

function linearSolve3x3(mat_3x3, x_3, y_3) {
  var a1 = mat_3x3[0][0];
  var b1 = mat_3x3[0][1];
  var c1 = mat_3x3[0][2];
  var a2 = mat_3x3[1][0];
  var b2 = mat_3x3[1][1];
  var c2 = mat_3x3[1][2];
  var a3 = mat_3x3[2][0];
  var b3 = mat_3x3[2][1];
  var c3 = mat_3x3[2][2];

  // Compute the adjoint
  var d1 = +determinant2x2(b2, b3, c2, c3);
  var d2 = -determinant2x2(a2, a3, c2, c3);
  var d3 = +determinant2x2(a2, a3, b2, b3);

  var e1 = -determinant2x2(b1, b3, c1, c3);
  var e2 = +determinant2x2(a1, a3, c1, c3);
  var e3 = -determinant2x2(a1, a3, b1, b3);

  var f1 = +determinant2x2(b1, b2, c1, c2);
  var f2 = -determinant2x2(a1, a2, c1, c2);
  var f3 = +determinant2x2(a1, a2, b1, b2);

  // Compute the determinant
  var det = a1 * d1 + b1 * d2 + c1 * d3;

  // Multiply by the adjoint
  var v1 = d1 * x_3[0] + e1 * x_3[1] + f1 * x_3[2];
  var v2 = d2 * x_3[0] + e2 * x_3[1] + f2 * x_3[2];
  var v3 = d3 * x_3[0] + e3 * x_3[1] + f3 * x_3[2];

  // Divide by the determinant
  y_3[0] = v1 / det;
  y_3[1] = v2 / det;
  y_3[2] = v3 / det;
}

function multiply3x3_vect3(mat_3x3, in_3, out_3) {
  var x = mat_3x3[0][0] * in_3[0] + mat_3x3[0][1] * in_3[1] + mat_3x3[0][2] * in_3[2];
  var y = mat_3x3[1][0] * in_3[0] + mat_3x3[1][1] * in_3[1] + mat_3x3[1][2] * in_3[2];
  var z = mat_3x3[2][0] * in_3[0] + mat_3x3[2][1] * in_3[1] + mat_3x3[2][2] * in_3[2];

  out_3[0] = x;
  out_3[1] = y;
  out_3[2] = z;
}

function multiply3x3_mat3(a_3x3, b_3x3, out_3x3) {
  var tmp = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

  for (var i = 0; i < 3; i++) {
    tmp[0][i] = a_3x3[0][0] * b_3x3[0][i] + a_3x3[0][1] * b_3x3[1][i] + a_3x3[0][2] * b_3x3[2][i];
    tmp[1][i] = a_3x3[1][0] * b_3x3[0][i] + a_3x3[1][1] * b_3x3[1][i] + a_3x3[1][2] * b_3x3[2][i];
    tmp[2][i] = a_3x3[2][0] * b_3x3[0][i] + a_3x3[2][1] * b_3x3[1][i] + a_3x3[2][2] * b_3x3[2][i];
  }

  for (var j = 0; j < 3; j++) {
    out_3x3[j][0] = tmp[j][0];
    out_3x3[j][1] = tmp[j][1];
    out_3x3[j][2] = tmp[j][2];
  }
}

function multiplyMatrix(a, b, rowA, colA, rowB, colB, out_rowXcol) {
  // we need colA == rowB
  if (colA !== rowB) {
    vtkErrorMacro('Number of columns of A must match number of rows of B.');
  }

  // output matrix is rowA*colB
  // output row
  for (var i = 0; i < rowA; i++) {
    // output col
    for (var j = 0; j < colB; j++) {
      out_rowXcol[i][j] = 0;
      // sum for this point
      for (var k = 0; k < colA; k++) {
        out_rowXcol[i][j] += a[i][k] * b[k][j];
      }
    }
  }
}

function transpose3x3(in_3x3, outT_3x3) {
  var tmp = void 0;
  tmp = in_3x3[1][0];
  outT_3x3[1][0] = in_3x3[0][1];
  outT_3x3[0][1] = tmp;
  tmp = in_3x3[2][0];
  outT_3x3[2][0] = in_3x3[0][2];
  outT_3x3[0][2] = tmp;
  tmp = in_3x3[2][1];
  outT_3x3[2][1] = in_3x3[1][2];
  outT_3x3[1][2] = tmp;

  outT_3x3[0][0] = in_3x3[0][0];
  outT_3x3[1][1] = in_3x3[1][1];
  outT_3x3[2][2] = in_3x3[2][2];
}

function invert3x3(in_3x3, outI_3x3) {
  var a1 = in_3x3[0][0];
  var b1 = in_3x3[0][1];
  var c1 = in_3x3[0][2];
  var a2 = in_3x3[1][0];
  var b2 = in_3x3[1][1];
  var c2 = in_3x3[1][2];
  var a3 = in_3x3[2][0];
  var b3 = in_3x3[2][1];
  var c3 = in_3x3[2][2];

  // Compute the adjoint
  var d1 = +determinant2x2(b2, b3, c2, c3);
  var d2 = -determinant2x2(a2, a3, c2, c3);
  var d3 = +determinant2x2(a2, a3, b2, b3);

  var e1 = -determinant2x2(b1, b3, c1, c3);
  var e2 = +determinant2x2(a1, a3, c1, c3);
  var e3 = -determinant2x2(a1, a3, b1, b3);

  var f1 = +determinant2x2(b1, b2, c1, c2);
  var f2 = -determinant2x2(a1, a2, c1, c2);
  var f3 = +determinant2x2(a1, a2, b1, b2);

  // Divide by the determinant
  var det = a1 * d1 + b1 * d2 + c1 * d3;

  outI_3x3[0][0] = d1 / det;
  outI_3x3[1][0] = d2 / det;
  outI_3x3[2][0] = d3 / det;

  outI_3x3[0][1] = e1 / det;
  outI_3x3[1][1] = e2 / det;
  outI_3x3[2][1] = e3 / det;

  outI_3x3[0][2] = f1 / det;
  outI_3x3[1][2] = f2 / det;
  outI_3x3[2][2] = f3 / det;
}

function identity3x3(mat_3x3) {
  for (var i = 0; i < 3; i++) {
    mat_3x3[i][0] = mat_3x3[i][1] = mat_3x3[i][2] = 0;
    mat_3x3[i][i] = 1;
  }
}

function determinant3x3(mat_3x3) {
  return mat_3x3[0][0] * mat_3x3[1][1] * mat_3x3[2][2] + mat_3x3[1][0] * mat_3x3[2][1] * mat_3x3[0][2] + mat_3x3[2][0] * mat_3x3[0][1] * mat_3x3[1][2] - mat_3x3[0][0] * mat_3x3[2][1] * mat_3x3[1][2] - mat_3x3[1][0] * mat_3x3[0][1] * mat_3x3[2][2] - mat_3x3[2][0] * mat_3x3[1][1] * mat_3x3[0][2];
}

function quaternionToMatrix3x3(quat_4, mat_3x3) {
  var ww = quat_4[0] * quat_4[0];
  var wx = quat_4[0] * quat_4[1];
  var wy = quat_4[0] * quat_4[2];
  var wz = quat_4[0] * quat_4[3];

  var xx = quat_4[1] * quat_4[1];
  var yy = quat_4[2] * quat_4[2];
  var zz = quat_4[3] * quat_4[3];

  var xy = quat_4[1] * quat_4[2];
  var xz = quat_4[1] * quat_4[3];
  var yz = quat_4[2] * quat_4[3];

  var rr = xx + yy + zz;
  // normalization factor, just in case quaternion was not normalized
  var f = 1 / (ww + rr);
  var s = (ww - rr) * f;
  f *= 2;

  mat_3x3[0][0] = xx * f + s;
  mat_3x3[1][0] = (xy + wz) * f;
  mat_3x3[2][0] = (xz - wy) * f;

  mat_3x3[0][1] = (xy - wz) * f;
  mat_3x3[1][1] = yy * f + s;
  mat_3x3[2][1] = (yz + wx) * f;

  mat_3x3[0][2] = (xz + wy) * f;
  mat_3x3[1][2] = (yz - wx) * f;
  mat_3x3[2][2] = zz * f + s;
}

function jacobiN(a, n, w, v) {
  var i = void 0;
  var j = void 0;
  var k = void 0;
  var iq = void 0;
  var ip = void 0;
  var numPos = void 0;
  var tresh = void 0;
  var theta = void 0;
  var t = void 0;
  var tau = void 0;
  var sm = void 0;
  var s = void 0;
  var h = void 0;
  var g = void 0;
  var c = void 0;
  var tmp = void 0;
  var b = createArray(n);
  var z = createArray(n);

  var vtkROTATE = function vtkROTATE(aa, ii, jj, kk, ll) {
    g = aa[ii][jj];
    h = aa[kk][ll];
    aa[ii][jj] = g - s * (h + g * tau);
    aa[kk][ll] = h + s * (g - h * tau);
  };

  // initialize
  for (ip = 0; ip < n; ip++) {
    for (iq = 0; iq < n; iq++) {
      v[ip][iq] = 0.0;
    }
    v[ip][ip] = 1.0;
  }
  for (ip = 0; ip < n; ip++) {
    b[ip] = w[ip] = a[ip][ip];
    z[ip] = 0.0;
  }

  // begin rotation sequence
  for (i = 0; i < VTK_MAX_ROTATIONS; i++) {
    sm = 0.0;
    for (ip = 0; ip < n - 1; ip++) {
      for (iq = ip + 1; iq < n; iq++) {
        sm += Math.abs(a[ip][iq]);
      }
    }
    if (sm === 0.0) {
      break;
    }

    // first 3 sweeps
    if (i < 3) {
      tresh = 0.2 * sm / (n * n);
    } else {
      tresh = 0.0;
    }

    for (ip = 0; ip < n - 1; ip++) {
      for (iq = ip + 1; iq < n; iq++) {
        g = 100.0 * Math.abs(a[ip][iq]);

        // after 4 sweeps
        if (i > 3 && Math.abs(w[ip]) + g === Math.abs(w[ip]) && Math.abs(w[iq]) + g === Math.abs(w[iq])) {
          a[ip][iq] = 0.0;
        } else if (Math.abs(a[ip][iq]) > tresh) {
          h = w[iq] - w[ip];
          if (Math.abs(h) + g === Math.abs(h)) {
            t = a[ip][iq] / h;
          } else {
            theta = 0.5 * h / a[ip][iq];
            t = 1.0 / (Math.abs(theta) + Math.sqrt(1.0 + theta * theta));
            if (theta < 0.0) {
              t = -t;
            }
          }
          c = 1.0 / Math.sqrt(1 + t * t);
          s = t * c;
          tau = s / (1.0 + c);
          h = t * a[ip][iq];
          z[ip] -= h;
          z[iq] += h;
          w[ip] -= h;
          w[iq] += h;
          a[ip][iq] = 0.0;

          // ip already shifted left by 1 unit
          for (j = 0; j <= ip - 1; j++) {
            vtkROTATE(a, j, ip, j, iq);
          }
          // ip and iq already shifted left by 1 unit
          for (j = ip + 1; j <= iq - 1; j++) {
            vtkROTATE(a, ip, j, j, iq);
          }
          // iq already shifted left by 1 unit
          for (j = iq + 1; j < n; j++) {
            vtkROTATE(a, ip, j, iq, j);
          }
          for (j = 0; j < n; j++) {
            vtkROTATE(v, j, ip, j, iq);
          }
        }
      }
    }

    for (ip = 0; ip < n; ip++) {
      b[ip] += z[ip];
      w[ip] = b[ip];
      z[ip] = 0.0;
    }
  }

  // this is NEVER called
  if (i >= VTK_MAX_ROTATIONS) {
    vtkWarningMacro('vtkMath::Jacobi: Error extracting eigenfunctions');
    return 0;
  }

  // sort eigenfunctions: these changes do not affect accuracy
  for (j = 0; j < n - 1; j++) {
    // boundary incorrect
    k = j;
    tmp = w[k];
    for (i = j + 1; i < n; i++) {
      // boundary incorrect, shifted already
      if (w[i] >= tmp) {
        // why exchange if same?
        k = i;
        tmp = w[k];
      }
    }
    if (k !== j) {
      w[k] = w[j];
      w[j] = tmp;
      for (i = 0; i < n; i++) {
        tmp = v[i][j];
        v[i][j] = v[i][k];
        v[i][k] = tmp;
      }
    }
  }
  // ensure eigenvector consistency (i.e., Jacobi can compute vectors that
  // are negative of one another (.707,.707,0) and (-.707,-.707,0). This can
  // reek havoc in hyperstreamline/other stuff. We will select the most
  // positive eigenvector.
  var ceil_half_n = (n >> 1) + (n & 1);
  for (j = 0; j < n; j++) {
    for (numPos = 0, i = 0; i < n; i++) {
      if (v[i][j] >= 0.0) {
        numPos++;
      }
    }
    //    if ( numPos < ceil(double(n)/double(2.0)) )
    if (numPos < ceil_half_n) {
      for (i = 0; i < n; i++) {
        v[i][j] *= -1.0;
      }
    }
  }
  return 1;
}

function matrix3x3ToQuaternion(mat_3x3, quat_4) {
  var tmp = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

  // on-diagonal elements
  tmp[0][0] = mat_3x3[0][0] + mat_3x3[1][1] + mat_3x3[2][2];
  tmp[1][1] = mat_3x3[0][0] - mat_3x3[1][1] - mat_3x3[2][2];
  tmp[2][2] = -mat_3x3[0][0] + mat_3x3[1][1] - mat_3x3[2][2];
  tmp[3][3] = -mat_3x3[0][0] - mat_3x3[1][1] + mat_3x3[2][2];

  // off-diagonal elements
  tmp[0][1] = tmp[1][0] = mat_3x3[2][1] - mat_3x3[1][2];
  tmp[0][2] = tmp[2][0] = mat_3x3[0][2] - mat_3x3[2][0];
  tmp[0][3] = tmp[3][0] = mat_3x3[1][0] - mat_3x3[0][1];

  tmp[1][2] = tmp[2][1] = mat_3x3[1][0] + mat_3x3[0][1];
  tmp[1][3] = tmp[3][1] = mat_3x3[0][2] + mat_3x3[2][0];
  tmp[2][3] = tmp[3][2] = mat_3x3[2][1] + mat_3x3[1][2];

  var eigenvectors = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  var eigenvalues = [0, 0, 0, 0];

  // convert into format that JacobiN can use,
  // then use Jacobi to find eigenvalues and eigenvectors
  var NTemp = [0, 0, 0, 0];
  var eigenvectorsTemp = [0, 0, 0, 0];
  for (var i = 0; i < 4; i++) {
    NTemp[i] = tmp[i];
    eigenvectorsTemp[i] = eigenvectors[i];
  }
  jacobiN(NTemp, 4, eigenvalues, eigenvectorsTemp);

  // the first eigenvector is the one we want
  quat_4[0] = eigenvectors[0][0];
  quat_4[1] = eigenvectors[1][0];
  quat_4[2] = eigenvectors[2][0];
  quat_4[3] = eigenvectors[3][0];
}

function multiplyQuaternion(quat_1, quat_2, quat_out) {
  var ww = quat_1[0] * quat_2[0];
  var wx = quat_1[0] * quat_2[1];
  var wy = quat_1[0] * quat_2[2];
  var wz = quat_1[0] * quat_2[3];

  var xw = quat_1[1] * quat_2[0];
  var xx = quat_1[1] * quat_2[1];
  var xy = quat_1[1] * quat_2[2];
  var xz = quat_1[1] * quat_2[3];

  var yw = quat_1[2] * quat_2[0];
  var yx = quat_1[2] * quat_2[1];
  var yy = quat_1[2] * quat_2[2];
  var yz = quat_1[2] * quat_2[3];

  var zw = quat_1[3] * quat_2[0];
  var zx = quat_1[3] * quat_2[1];
  var zy = quat_1[3] * quat_2[2];
  var zz = quat_1[3] * quat_2[3];

  quat_out[0] = ww - xx - yy - zz;
  quat_out[1] = wx + xw + yz - zy;
  quat_out[2] = wy - xz + yw + zx;
  quat_out[3] = wz + xy - yx + zw;
}

function orthogonalize3x3(a_3x3, out_3x3) {
  // copy the matrix
  for (var i = 0; i < 3; i++) {
    out_3x3[0][i] = a_3x3[0][i];
    out_3x3[1][i] = a_3x3[1][i];
    out_3x3[2][i] = a_3x3[2][i];
  }

  // Pivot the matrix to improve accuracy
  var scale = createArray(3);
  var index = createArray(3);
  var largest = void 0;

  // Loop over rows to get implicit scaling information
  for (var _i = 0; _i < 3; _i++) {
    var _x5 = Math.abs(out_3x3[_i][0]);
    var _x6 = Math.abs(out_3x3[_i][1]);
    var _x7 = Math.abs(out_3x3[_i][2]);
    largest = _x6 > _x5 ? _x6 : _x5;
    largest = _x7 > largest ? _x7 : largest;
    scale[_i] = 1;
    if (largest !== 0) {
      scale[_i] /= largest;
    }
  }

  // first column
  var x1 = Math.abs(out_3x3[0][0]) * scale[0];
  var x2 = Math.abs(out_3x3[1][0]) * scale[1];
  var x3 = Math.abs(out_3x3[2][0]) * scale[2];
  index[0] = 0;
  largest = x1;
  if (x2 >= largest) {
    largest = x2;
    index[0] = 1;
  }
  if (x3 >= largest) {
    index[0] = 2;
  }
  if (index[0] !== 0) {
    vtkSwapVectors3(out_3x3[index[0]], out_3x3[0]);
    scale[index[0]] = scale[0];
  }

  // second column
  var y2 = Math.abs(out_3x3[1][1]) * scale[1];
  var y3 = Math.abs(out_3x3[2][1]) * scale[2];
  index[1] = 1;
  largest = y2;
  if (y3 >= largest) {
    index[1] = 2;
    vtkSwapVectors3(out_3x3[2], out_3x3[1]);
  }

  // third column
  index[2] = 2;

  // A quaternion can only describe a pure rotation, not
  // a rotation with a flip, therefore the flip must be
  // removed before the matrix is converted to a quaternion.
  var flip = 0;
  if (determinant3x3(out_3x3) < 0) {
    flip = 1;
    for (var _i2 = 0; _i2 < 3; _i2++) {
      out_3x3[0][_i2] = -out_3x3[0][_i2];
      out_3x3[1][_i2] = -out_3x3[1][_i2];
      out_3x3[2][_i2] = -out_3x3[2][_i2];
    }
  }

  // Do orthogonalization using a quaternion intermediate
  // (this, essentially, does the orthogonalization via
  // diagonalization of an appropriately constructed symmetric
  // 4x4 matrix rather than by doing SVD of the 3x3 matrix)
  var quat = createArray(4);
  matrix3x3ToQuaternion(out_3x3, quat);
  quaternionToMatrix3x3(quat, out_3x3);

  // Put the flip back into the orthogonalized matrix.
  if (flip) {
    for (var _i3 = 0; _i3 < 3; _i3++) {
      out_3x3[0][_i3] = -out_3x3[0][_i3];
      out_3x3[1][_i3] = -out_3x3[1][_i3];
      out_3x3[2][_i3] = -out_3x3[2][_i3];
    }
  }

  // Undo the pivoting
  if (index[1] !== 1) {
    vtkSwapVectors3(out_3x3[index[1]], out_3x3[1]);
  }
  if (index[0] !== 0) {
    vtkSwapVectors3(out_3x3[index[0]], out_3x3[0]);
  }
}

function diagonalize3x3(a_3x3, w_3, v_3x3) {
  var i = void 0;
  var j = void 0;
  var k = void 0;
  var maxI = void 0;
  var tmp = void 0;
  var maxVal = void 0;

  // do the matrix[3][3] to **matrix conversion for Jacobi
  var C = [createArray(3), createArray(3), createArray(3)];
  var ATemp = createArray(3);
  var VTemp = createArray(3);
  for (i = 0; i < 3; i++) {
    C[i][0] = a_3x3[i][0];
    C[i][1] = a_3x3[i][1];
    C[i][2] = a_3x3[i][2];
    ATemp[i] = C[i];
    VTemp[i] = v_3x3[i];
  }

  // diagonalize using Jacobi
  jacobiN(ATemp, 3, w_3, VTemp);

  // if all the eigenvalues are the same, return identity matrix
  if (w_3[0] === w_3[1] && w_3[0] === w_3[2]) {
    identity3x3(v_3x3);
    return;
  }

  // transpose temporarily, it makes it easier to sort the eigenvectors
  transpose3x3(v_3x3, v_3x3);

  // if two eigenvalues are the same, re-orthogonalize to optimally line
  // up the eigenvectors with the x, y, and z axes
  for (i = 0; i < 3; i++) {
    // two eigenvalues are the same
    if (w_3[(i + 1) % 3] === w_3[(i + 2) % 3]) {
      // find maximum element of the independent eigenvector
      maxVal = Math.abs(v_3x3[i][0]);
      maxI = 0;
      for (j = 1; j < 3; j++) {
        if (maxVal < (tmp = Math.abs(v_3x3[i][j]))) {
          maxVal = tmp;
          maxI = j;
        }
      }
      // swap the eigenvector into its proper position
      if (maxI !== i) {
        tmp = w_3[maxI];
        w_3[maxI] = w_3[i];
        w_3[i] = tmp;
        vtkSwapVectors3(v_3x3[i], v_3x3[maxI]);
      }
      // maximum element of eigenvector should be positive
      if (v_3x3[maxI][maxI] < 0) {
        v_3x3[maxI][0] = -v_3x3[maxI][0];
        v_3x3[maxI][1] = -v_3x3[maxI][1];
        v_3x3[maxI][2] = -v_3x3[maxI][2];
      }

      // re-orthogonalize the other two eigenvectors
      j = (maxI + 1) % 3;
      k = (maxI + 2) % 3;

      v_3x3[j][0] = 0.0;
      v_3x3[j][1] = 0.0;
      v_3x3[j][2] = 0.0;
      v_3x3[j][j] = 1.0;
      cross(v_3x3[maxI], v_3x3[j], v_3x3[k]);
      normalize(v_3x3[k]);
      cross(v_3x3[k], v_3x3[maxI], v_3x3[j]);

      // transpose vectors back to columns
      transpose3x3(v_3x3, v_3x3);
      return;
    }
  }

  // the three eigenvalues are different, just sort the eigenvectors
  // to align them with the x, y, and z axes

  // find the vector with the largest x element, make that vector
  // the first vector
  maxVal = Math.abs(v_3x3[0][0]);
  maxI = 0;
  for (i = 1; i < 3; i++) {
    if (maxVal < (tmp = Math.abs(v_3x3[i][0]))) {
      maxVal = tmp;
      maxI = i;
    }
  }
  // swap eigenvalue and eigenvector
  if (maxI !== 0) {
    tmp = w_3[maxI];
    w_3[maxI] = w_3[0];
    w_3[0] = tmp;
    vtkSwapVectors3(v_3x3[maxI], v_3x3[0]);
  }
  // do the same for the y element
  if (Math.abs(v_3x3[1][1]) < Math.abs(v_3x3[2][1])) {
    tmp = w_3[2];
    w_3[2] = w_3[1];
    w_3[1] = tmp;
    vtkSwapVectors3(v_3x3[2], v_3x3[1]);
  }

  // ensure that the sign of the eigenvectors is correct
  for (i = 0; i < 2; i++) {
    if (v_3x3[i][i] < 0) {
      v_3x3[i][0] = -v_3x3[i][0];
      v_3x3[i][1] = -v_3x3[i][1];
      v_3x3[i][2] = -v_3x3[i][2];
    }
  }
  // set sign of final eigenvector to ensure that determinant is positive
  if (determinant3x3(v_3x3) < 0) {
    v_3x3[2][0] = -v_3x3[2][0];
    v_3x3[2][1] = -v_3x3[2][1];
    v_3x3[2][2] = -v_3x3[2][2];
  }

  // transpose the eigenvectors back again
  transpose3x3(v_3x3, v_3x3);
}

function singularValueDecomposition3x3(a_3x3, u_3x3, w_3, vT_3x3) {
  var i = void 0;
  var B = [createArray(3), createArray(3), createArray(3)];

  // copy so that A can be used for U or VT without risk
  for (i = 0; i < 3; i++) {
    B[0][i] = a_3x3[0][i];
    B[1][i] = a_3x3[1][i];
    B[2][i] = a_3x3[2][i];
  }

  // temporarily flip if determinant is negative
  var d = determinant3x3(B);
  if (d < 0) {
    for (i = 0; i < 3; i++) {
      B[0][i] = -B[0][i];
      B[1][i] = -B[1][i];
      B[2][i] = -B[2][i];
    }
  }

  // orthogonalize, diagonalize, etc.
  orthogonalize3x3(B, u_3x3);
  transpose3x3(B, B);
  multiply3x3_mat3(B, u_3x3, vT_3x3);
  diagonalize3x3(vT_3x3, w_3, vT_3x3);
  multiply3x3_mat3(u_3x3, vT_3x3, u_3x3);
  transpose3x3(vT_3x3, vT_3x3);

  // re-create the flip
  if (d < 0) {
    w_3[0] = -w_3[0];
    w_3[1] = -w_3[1];
    w_3[2] = -w_3[2];
  }
}

function luFactorLinearSystem(A, index, size) {
  var i = void 0;
  var j = void 0;
  var k = void 0;
  var largest = void 0;
  var maxI = 0;
  var sum = void 0;
  var temp1 = void 0;
  var temp2 = void 0;
  var scale = createArray(size);

  //
  // Loop over rows to get implicit scaling information
  //
  for (i = 0; i < size; i++) {
    for (largest = 0.0, j = 0; j < size; j++) {
      if ((temp2 = Math.abs(A[i][j])) > largest) {
        largest = temp2;
      }
    }

    if (largest === 0.0) {
      vtkWarningMacro('Unable to factor linear system');
      return 0;
    }
    scale[i] = 1.0 / largest;
  }
  //
  // Loop over all columns using Crout's method
  //
  for (j = 0; j < size; j++) {
    for (i = 0; i < j; i++) {
      sum = A[i][j];
      for (k = 0; k < i; k++) {
        sum -= A[i][k] * A[k][j];
      }
      A[i][j] = sum;
    }
    //
    // Begin search for largest pivot element
    //
    for (largest = 0.0, i = j; i < size; i++) {
      sum = A[i][j];
      for (k = 0; k < j; k++) {
        sum -= A[i][k] * A[k][j];
      }
      A[i][j] = sum;

      if ((temp1 = scale[i] * Math.abs(sum)) >= largest) {
        largest = temp1;
        maxI = i;
      }
    }
    //
    // Check for row interchange
    //
    if (j !== maxI) {
      for (k = 0; k < size; k++) {
        temp1 = A[maxI][k];
        A[maxI][k] = A[j][k];
        A[j][k] = temp1;
      }
      scale[maxI] = scale[j];
    }
    //
    // Divide by pivot element and perform elimination
    //
    index[j] = maxI;

    if (Math.abs(A[j][j]) <= VTK_SMALL_NUMBER) {
      vtkWarningMacro('Unable to factor linear system');
      return 0;
    }

    if (j !== size - 1) {
      temp1 = 1.0 / A[j][j];
      for (i = j + 1; i < size; i++) {
        A[i][j] *= temp1;
      }
    }
  }
  return 1;
}

function luSolveLinearSystem(A, index, x, size) {
  var i = void 0;
  var j = void 0;
  var ii = void 0;
  var idx = void 0;
  var sum = void 0;
  //
  // Proceed with forward and backsubstitution for L and U
  // matrices.  First, forward substitution.
  //
  for (ii = -1, i = 0; i < size; i++) {
    idx = index[i];
    sum = x[idx];
    x[idx] = x[i];

    if (ii >= 0) {
      for (j = ii; j <= i - 1; j++) {
        sum -= A[i][j] * x[j];
      }
    } else if (sum !== 0.0) {
      ii = i;
    }

    x[i] = sum;
  }
  //
  // Now, back substitution
  //
  for (i = size - 1; i >= 0; i--) {
    sum = x[i];
    for (j = i + 1; j < size; j++) {
      sum -= A[i][j] * x[j];
    }
    x[i] = sum / A[i][i];
  }
}

function solveLinearSystem(A, x, size) {
  // if we solving something simple, just solve it
  if (size === 2) {
    var y = createArray(2);
    var det = determinant2x2(A[0][0], A[0][1], A[1][0], A[1][1]);

    if (det === 0.0) {
      // Unable to solve linear system
      return 0;
    }

    y[0] = (A[1][1] * x[0] - A[0][1] * x[1]) / det;
    y[1] = (-(A[1][0] * x[0]) + A[0][0] * x[1]) / det;

    x[0] = y[0];
    x[1] = y[1];
    return 1;
  } else if (size === 1) {
    if (A[0][0] === 0.0) {
      // Unable to solve linear system
      return 0;
    }

    x[0] /= A[0][0];
    return 1;
  }

  //
  // System of equations is not trivial, use Crout's method
  //

  // Check on allocation of working vectors
  var index = createArray(size);

  // Factor and solve matrix
  if (luFactorLinearSystem(A, index, size) === 0) {
    return 0;
  }
  luSolveLinearSystem(A, index, x, size);

  return 1;
}

function invertMatrix(A, AI, size) {
  var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var column = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

  var tmp1Size = index || createArray(size);
  var tmp2Size = column || createArray(size);

  // Factor matrix; then begin solving for inverse one column at a time.
  // Note: tmp1Size returned value is used later, tmp2Size is just working
  // memory whose values are not used in LUSolveLinearSystem
  if (luFactorLinearSystem(A, tmp1Size, size, tmp2Size) === 0) {
    return 0;
  }

  for (var j = 0; j < size; j++) {
    for (var i = 0; i < size; i++) {
      tmp2Size[i] = 0.0;
    }
    tmp2Size[j] = 1.0;

    luSolveLinearSystem(A, tmp1Size, tmp2Size, size);

    for (var _i4 = 0; _i4 < size; _i4++) {
      AI[_i4][j] = tmp2Size[_i4];
    }
  }

  return 1;
}

function estimateMatrixCondition(A, size) {
  var minValue = +Number.MAX_VALUE;
  var maxValue = -Number.MAX_VALUE;

  // find the maximum value
  for (var i = 0; i < size; i++) {
    for (var j = i; j < size; j++) {
      if (Math.abs(A[i][j]) > max) {
        maxValue = Math.abs(A[i][j]);
      }
    }
  }

  // find the minimum diagonal value
  for (var _i5 = 0; _i5 < size; _i5++) {
    if (Math.abs(A[_i5][_i5]) < min) {
      minValue = Math.abs(A[_i5][_i5]);
    }
  }

  if (minValue === 0.0) {
    return Number.MAX_VALUE;
  }
  return maxValue / minValue;
}

function jacobi(a_3x3, w, v) {
  return jacobiN(a_3x3, 3, w, v);
}

function solveHomogeneousLeastSquares(numberOfSamples, xt, xOrder, mt) {
  // check dimensional consistency
  if (numberOfSamples < xOrder) {
    vtkWarningMacro('Insufficient number of samples. Underdetermined.');
    return 0;
  }

  var i = void 0;
  var j = void 0;
  var k = void 0;

  // set up intermediate variables
  // Allocate matrix to hold X times transpose of X
  var XXt = createArray(xOrder); // size x by x
  // Allocate the array of eigenvalues and eigenvectors
  var eigenvals = createArray(xOrder);
  var eigenvecs = createArray(xOrder);

  // Clear the upper triangular region (and btw, allocate the eigenvecs as well)
  for (i = 0; i < xOrder; i++) {
    eigenvecs[i] = createArray(xOrder);
    XXt[i] = createArray(xOrder);
    for (j = 0; j < xOrder; j++) {
      XXt[i][j] = 0.0;
    }
  }

  // Calculate XXt upper half only, due to symmetry
  for (k = 0; k < numberOfSamples; k++) {
    for (i = 0; i < xOrder; i++) {
      for (j = i; j < xOrder; j++) {
        XXt[i][j] += xt[k][i] * xt[k][j];
      }
    }
  }

  // now fill in the lower half of the XXt matrix
  for (i = 0; i < xOrder; i++) {
    for (j = 0; j < i; j++) {
      XXt[i][j] = XXt[j][i];
    }
  }

  // Compute the eigenvectors and eigenvalues
  jacobiN(XXt, xOrder, eigenvals, eigenvecs);

  // Smallest eigenval is at the end of the list (xOrder-1), and solution is
  // corresponding eigenvec.
  for (i = 0; i < xOrder; i++) {
    mt[i][0] = eigenvecs[i][xOrder - 1];
  }

  return 1;
}

function solveLeastSquares(numberOfSamples, xt, xOrder, yt, yOrder, mt) {
  var checkHomogeneous = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : true;

  // check dimensional consistency
  if (numberOfSamples < xOrder || numberOfSamples < yOrder) {
    vtkWarningMacro('Insufficient number of samples. Underdetermined.');
    return 0;
  }

  var homogenFlags = createArray(yOrder);
  var allHomogeneous = 1;
  var hmt = void 0;
  var homogRC = 0;
  var i = void 0;
  var j = void 0;
  var k = void 0;
  var someHomogeneous = 0;

  // Ok, first init some flags check and see if all the systems are homogeneous
  if (checkHomogeneous) {
    // If Y' is zero, it's a homogeneous system and can't be solved via
    // the pseudoinverse method. Detect this case, warn the user, and
    // invoke SolveHomogeneousLeastSquares instead. Note that it doesn't
    // really make much sense for yOrder to be greater than one in this case,
    // since that's just yOrder occurrences of a 0 vector on the RHS, but
    // we allow it anyway. N


    // Initialize homogeneous flags on a per-right-hand-side basis
    for (j = 0; j < yOrder; j++) {
      homogenFlags[j] = 1;
    }
    for (i = 0; i < numberOfSamples; i++) {
      for (j = 0; j < yOrder; j++) {
        if (Math.abs(yt[i][j]) > VTK_SMALL_NUMBER) {
          allHomogeneous = 0;
          homogenFlags[j] = 0;
        }
      }
    }

    // If we've got one system, and it's homogeneous, do it and bail out quickly.
    if (allHomogeneous && yOrder === 1) {
      vtkWarningMacro('Detected homogeneous system (Y=0), calling SolveHomogeneousLeastSquares()');
      return solveHomogeneousLeastSquares(numberOfSamples, xt, xOrder, mt);
    }

    // Ok, we've got more than one system of equations.
    // Figure out if we need to calculate the homogeneous equation solution for
    // any of them.
    if (allHomogeneous) {
      someHomogeneous = 1;
    } else {
      for (j = 0; j < yOrder; j++) {
        if (homogenFlags[j]) {
          someHomogeneous = 1;
        }
      }
    }
  }

  // If necessary, solve the homogeneous problem
  if (someHomogeneous) {
    // hmt is the homogeneous equation version of mt, the general solution.
    hmt = createArray(xOrder);
    for (j = 0; j < xOrder; j++) {
      // Only allocate 1 here, not yOrder, because here we're going to solve
      // just the one homogeneous equation subset of the entire problem
      hmt[j] = [0];
    }

    // Ok, solve the homogeneous problem
    homogRC = solveHomogeneousLeastSquares(numberOfSamples, xt, xOrder, hmt);
  }

  // set up intermediate variables
  var XXt = createArray(xOrder); // size x by x
  var XXtI = createArray(xOrder); // size x by x
  var XYt = createArray(xOrder); // size x by y
  for (i = 0; i < xOrder; i++) {
    XXt[i] = createArray(xOrder);
    XXtI[i] = createArray(xOrder);

    for (j = 0; j < xOrder; j++) {
      XXt[i][j] = 0.0;
      XXtI[i][j] = 0.0;
    }

    XYt[i] = createArray(yOrder);
    for (j = 0; j < yOrder; j++) {
      XYt[i][j] = 0.0;
    }
  }

  // first find the pseudoinverse matrix
  for (k = 0; k < numberOfSamples; k++) {
    for (i = 0; i < xOrder; i++) {
      // first calculate the XXt matrix, only do the upper half (symmetrical)
      for (j = i; j < xOrder; j++) {
        XXt[i][j] += xt[k][i] * xt[k][j];
      }

      // now calculate the XYt matrix
      for (j = 0; j < yOrder; j++) {
        XYt[i][j] += xt[k][i] * yt[k][j];
      }
    }
  }

  // now fill in the lower half of the XXt matrix
  for (i = 0; i < xOrder; i++) {
    for (j = 0; j < i; j++) {
      XXt[i][j] = XXt[j][i];
    }
  }

  var successFlag = invertMatrix(XXt, XXtI, xOrder);

  // next get the inverse of XXt
  if (successFlag) {
    for (i = 0; i < xOrder; i++) {
      for (j = 0; j < yOrder; j++) {
        mt[i][j] = 0.0;
        for (k = 0; k < xOrder; k++) {
          mt[i][j] += XXtI[i][k] * XYt[k][j];
        }
      }
    }
  }

  // Fix up any of the solutions that correspond to the homogeneous equation
  // problem.
  if (someHomogeneous) {
    for (j = 0; j < yOrder; j++) {
      if (homogenFlags[j]) {
        // Fix this one
        for (i = 0; i < xOrder; i++) {
          mt[i][j] = hmt[i][0];
        }
      }
    }
  }

  if (someHomogeneous) {
    return homogRC && successFlag;
  }

  return successFlag;
}

function rgb2hsv(rgb, hsv) {
  var h = void 0;
  var s = void 0;

  var _rgb = _slicedToArray(rgb, 3),
      r = _rgb[0],
      g = _rgb[1],
      b = _rgb[2];

  var onethird = 1.0 / 3.0;
  var onesixth = 1.0 / 6.0;
  var twothird = 2.0 / 3.0;

  var cmax = r;
  var cmin = r;

  if (g > cmax) {
    cmax = g;
  } else if (g < cmin) {
    cmin = g;
  }
  if (b > cmax) {
    cmax = b;
  } else if (b < cmin) {
    cmin = b;
  }
  var v = cmax;

  if (v > 0.0) {
    s = (cmax - cmin) / cmax;
  } else {
    s = 0.0;
  }
  if (s > 0) {
    if (r === cmax) {
      h = onesixth * (g - b) / (cmax - cmin);
    } else if (g === cmax) {
      h = onethird + onesixth * (b - r) / (cmax - cmin);
    } else {
      h = twothird + onesixth * (r - g) / (cmax - cmin);
    }
    if (h < 0.0) {
      h += 1.0;
    }
  } else {
    h = 0.0;
  }

  // Set the values back to the array
  hsv[0] = h;
  hsv[1] = s;
  hsv[2] = v;
}

function hsv2rgb(hsv, rgb) {
  var _hsv = _slicedToArray(hsv, 3),
      h = _hsv[0],
      s = _hsv[1],
      v = _hsv[2];

  var onethird = 1.0 / 3.0;
  var onesixth = 1.0 / 6.0;
  var twothird = 2.0 / 3.0;
  var fivesixth = 5.0 / 6.0;
  var r = void 0;
  var g = void 0;
  var b = void 0;

  // compute RGB from HSV
  if (h > onesixth && h <= onethird) {
    // green/red
    g = 1.0;
    r = (onethird - h) / onesixth;
    b = 0.0;
  } else if (h > onethird && h <= 0.5) {
    // green/blue
    g = 1.0;
    b = (h - onethird) / onesixth;
    r = 0.0;
  } else if (h > 0.5 && h <= twothird) {
    // blue/green
    b = 1.0;
    g = (twothird - h) / onesixth;
    r = 0.0;
  } else if (h > twothird && h <= fivesixth) {
    // blue/red
    b = 1.0;
    r = (h - twothird) / onesixth;
    g = 0.0;
  } else if (h > fivesixth && h <= 1.0) {
    // red/blue
    r = 1.0;
    b = (1.0 - h) / onesixth;
    g = 0.0;
  } else {
    // red/green
    r = 1.0;
    g = h / onesixth;
    b = 0.0;
  }

  // add Saturation to the equation.
  r = s * r + (1.0 - s);
  g = s * g + (1.0 - s);
  b = s * b + (1.0 - s);

  r *= v;
  g *= v;
  b *= v;

  // Assign back to the array
  rgb[0] = r;
  rgb[1] = g;
  rgb[2] = b;
}

function lab2xyz(lab, xyz) {
  // LAB to XYZ
  var _lab = _slicedToArray(lab, 3),
      L = _lab[0],
      a = _lab[1],
      b = _lab[2];

  var var_Y = (L + 16) / 116;
  var var_X = a / 500 + var_Y;
  var var_Z = var_Y - b / 200;

  if (Math.pow(var_Y, 3) > 0.008856) {
    var_Y = Math.pow(var_Y, 3);
  } else {
    var_Y = (var_Y - 16.0 / 116.0) / 7.787;
  }

  if (Math.pow(var_X, 3) > 0.008856) {
    var_X = Math.pow(var_X, 3);
  } else {
    var_X = (var_X - 16.0 / 116.0) / 7.787;
  }

  if (Math.pow(var_Z, 3) > 0.008856) {
    var_Z = Math.pow(var_Z, 3);
  } else {
    var_Z = (var_Z - 16.0 / 116.0) / 7.787;
  }
  var ref_X = 0.9505;
  var ref_Y = 1.000;
  var ref_Z = 1.089;
  xyz[0] = ref_X * var_X; // ref_X = 0.9505  Observer= 2 deg Illuminant= D65
  xyz[1] = ref_Y * var_Y; // ref_Y = 1.000
  xyz[2] = ref_Z * var_Z; // ref_Z = 1.089
}

function xyz2lab(xyz, lab) {
  var _xyz = _slicedToArray(xyz, 3),
      x = _xyz[0],
      y = _xyz[1],
      z = _xyz[2];

  var ref_X = 0.9505;
  var ref_Y = 1.000;
  var ref_Z = 1.089;
  var var_X = x / ref_X; // ref_X = 0.9505  Observer= 2 deg, Illuminant= D65
  var var_Y = y / ref_Y; // ref_Y = 1.000
  var var_Z = z / ref_Z; // ref_Z = 1.089

  if (var_X > 0.008856) var_X = Math.pow(var_X, 1.0 / 3.0);else var_X = 7.787 * var_X + 16.0 / 116.0;
  if (var_Y > 0.008856) var_Y = Math.pow(var_Y, 1.0 / 3.0);else var_Y = 7.787 * var_Y + 16.0 / 116.0;
  if (var_Z > 0.008856) var_Z = Math.pow(var_Z, 1.0 / 3.0);else var_Z = 7.787 * var_Z + 16.0 / 116.0;

  lab[0] = 116 * var_Y - 16;
  lab[1] = 500 * (var_X - var_Y);
  lab[2] = 200 * (var_Y - var_Z);
}

function xyz2rgb(xyz, rgb) {
  var _xyz2 = _slicedToArray(xyz, 3),
      x = _xyz2[0],
      y = _xyz2[1],
      z = _xyz2[2];

  var r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  var g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  var b = x * 0.0557 + y * -0.2040 + z * 1.0570;

  // The following performs a "gamma correction" specified by the sRGB color
  // space.  sRGB is defined by a canonical definition of a display monitor and
  // has been standardized by the International Electrotechnical Commission (IEC
  // 61966-2-1).  The nonlinearity of the correction is designed to make the
  // colors more perceptually uniform.  This color space has been adopted by
  // several applications including Adobe Photoshop and Microsoft Windows color
  // management.  OpenGL is agnostic on its RGB color space, but it is reasonable
  // to assume it is close to this one.
  if (r > 0.0031308) r = 1.055 * Math.pow(r, 1 / 2.4) - 0.055;else r *= 12.92;
  if (g > 0.0031308) g = 1.055 * Math.pow(g, 1 / 2.4) - 0.055;else g *= 12.92;
  if (b > 0.0031308) b = 1.055 * Math.pow(b, 1 / 2.4) - 0.055;else b *= 12.92;

  // Clip colors. ideally we would do something that is perceptually closest
  // (since we can see colors outside of the display gamut), but this seems to
  // work well enough.
  var maxVal = r;
  if (maxVal < g) maxVal = g;
  if (maxVal < b) maxVal = b;
  if (maxVal > 1.0) {
    r /= maxVal;
    g /= maxVal;
    b /= maxVal;
  }
  if (r < 0) r = 0;
  if (g < 0) g = 0;
  if (b < 0) b = 0;

  // Push values back to array
  rgb[0] = r;
  rgb[1] = g;
  rgb[2] = b;
}

function rgb2xyz(rgb, xyz) {
  var _rgb2 = _slicedToArray(rgb, 3),
      r = _rgb2[0],
      g = _rgb2[1],
      b = _rgb2[2];
  // The following performs a "gamma correction" specified by the sRGB color
  // space.  sRGB is defined by a canonical definition of a display monitor and
  // has been standardized by the International Electrotechnical Commission (IEC
  // 61966-2-1).  The nonlinearity of the correction is designed to make the
  // colors more perceptually uniform.  This color space has been adopted by
  // several applications including Adobe Photoshop and Microsoft Windows color
  // management.  OpenGL is agnostic on its RGB color space, but it is reasonable
  // to assume it is close to this one.


  if (r > 0.04045) r = Math.pow((r + 0.055) / 1.055, 2.4);else r /= 12.92;
  if (g > 0.04045) g = Math.pow((g + 0.055) / 1.055, 2.4);else g /= 12.92;
  if (b > 0.04045) b = Math.pow((b + 0.055) / 1.055, 2.4);else b /= 12.92;

  // Observer. = 2 deg, Illuminant = D65
  xyz[0] = r * 0.4124 + g * 0.3576 + b * 0.1805;
  xyz[1] = r * 0.2126 + g * 0.7152 + b * 0.0722;
  xyz[2] = r * 0.0193 + g * 0.1192 + b * 0.9505;
}

function rgb2lab(rgb, lab) {
  var xyz = [0, 0, 0];
  rgb2xyz(rgb, xyz);
  xyz2lab(xyz, lab);
}

function lab2rgb(lab, rgb) {
  var xyz = [0, 0, 0];
  lab2xyz(lab, xyz);
  xyz2rgb(xyz, rgb);
}

function uninitializeBounds(bounds) {
  bounds[0] = 1.0;
  bounds[1] = -1.0;
  bounds[2] = 1.0;
  bounds[3] = -1.0;
  bounds[4] = 1.0;
  bounds[5] = -1.0;
}

function areBoundsInitialized(bounds) {
  return !(bounds[1] - bounds[0] < 0.0);
}

function clampValue(value, minValue, maxValue) {
  if (value < minValue) {
    return minValue;
  }
  if (value > maxValue) {
    return maxValue;
  }
  return value;
}

function clampAndNormalizeValue(value, range) {
  var result = 0;
  if (range[0] !== range[1]) {
    // clamp
    if (value < range[0]) {
      result = range[0];
    } else if (value > range[1]) {
      result = range[1];
    } else {
      result = value;
    }
    // normalize
    result = (result - range[0]) / (range[1] - range[0]);
  }

  return result;
}

var getScalarTypeFittingRange = notImplemented('GetScalarTypeFittingRange');
var getAdjustedScalarRange = notImplemented('GetAdjustedScalarRange');

function extentIsWithinOtherExtent(extent1, extent2) {
  if (!extent1 || !extent2) {
    return 0;
  }

  for (var i = 0; i < 6; i += 2) {
    if (extent1[i] < extent2[i] || extent1[i] > extent2[i + 1] || extent1[i + 1] < extent2[i] || extent1[i + 1] > extent2[i + 1]) {
      return 0;
    }
  }

  return 1;
}

function boundsIsWithinOtherBounds(bounds1_6, bounds2_6, delta_3) {
  if (!bounds1_6 || !bounds2_6) {
    return 0;
  }
  for (var i = 0; i < 6; i += 2) {
    if (bounds1_6[i] + delta_3[i / 2] < bounds2_6[i] || bounds1_6[i] - delta_3[i / 2] > bounds2_6[i + 1] || bounds1_6[i + 1] + delta_3[i / 2] < bounds2_6[i] || bounds1_6[i + 1] - delta_3[i / 2] > bounds2_6[i + 1]) {
      return 0;
    }
  }
  return 1;
}

function pointIsWithinBounds(point_3, bounds_6, delta_3) {
  if (!point_3 || !bounds_6 || !delta_3) {
    return 0;
  }
  for (var i = 0; i < 3; i++) {
    if (point_3[i] + delta_3[i] < bounds_6[2 * i] || point_3[i] - delta_3[i] > bounds_6[2 * i + 1]) {
      return 0;
    }
  }
  return 1;
}

function solve3PointCircle(p1, p2, p3, center) {
  var v21 = createArray(3);
  var v32 = createArray(3);
  var v13 = createArray(3);
  var v12 = createArray(3);
  var v23 = createArray(3);
  var v31 = createArray(3);

  for (var i = 0; i < 3; ++i) {
    v21[i] = p1[i] - p2[i];
    v32[i] = p2[i] - p3[i];
    v13[i] = p3[i] - p1[i];
    v12[i] = -v21[i];
    v23[i] = -v32[i];
    v31[i] = -v13[i];
  }

  var norm12 = norm(v12);
  var norm23 = norm(v23);
  var norm13 = norm(v13);

  var crossv21v32 = createArray(3);
  cross(v21, v32, crossv21v32);
  var normCross = norm(crossv21v32);

  var radius = norm12 * norm23 * norm13 / (2 * normCross);

  var normCross22 = 2 * normCross * normCross;
  var alpha = norm23 * norm23 * dot(v21, v31) / normCross22;
  var beta = norm13 * norm13 * dot(v12, v32) / normCross22;
  var gamma = norm12 * norm12 * dot(v13, v23) / normCross22;

  for (var _i6 = 0; _i6 < 3; ++_i6) {
    center[_i6] = alpha * p1[_i6] + beta * p2[_i6] + gamma * p3[_i6];
  }
  return radius;
}

var inf = Infinity;
var negInf = -Infinity;

var isInf = function isInf(value) {
  return !Number.isFinite(value);
};
var isNan = Number.isNaN;
var isFinite = Number.isFinite;

// JavaScript - add-on ----------------------

function createUninitializedBounds() {
  return [].concat([Number.MAX_VALUE, Number.MIN_VALUE, // X
  Number.MAX_VALUE, Number.MIN_VALUE, // Y
  Number.MAX_VALUE, Number.MIN_VALUE] // Z
  );
}

// ----------------------------------------------------------------------------
// Only Static API
// ----------------------------------------------------------------------------

exports.default = {
  Pi: Pi,
  radiansFromDegrees: radiansFromDegrees,
  degreesFromRadians: degreesFromRadians,
  round: round,
  floor: floor,
  ceil: ceil,
  ceilLog2: ceilLog2,
  min: min,
  max: max,
  isPowerOfTwo: isPowerOfTwo,
  nearestPowerOfTwo: nearestPowerOfTwo,
  factorial: factorial,
  binomial: binomial,
  beginCombination: beginCombination,
  nextCombination: nextCombination,
  randomSeed: randomSeed,
  getSeed: getSeed,
  random: random,
  gaussian: gaussian,
  add: add,
  subtract: subtract,
  multiplyScalar: multiplyScalar,
  multiplyScalar2D: multiplyScalar2D,
  dot: dot,
  outer: outer,
  cross: cross,
  norm: norm,
  normalize: normalize,
  perpendiculars: perpendiculars,
  projectVector: projectVector,
  projectVector2D: projectVector2D,
  distance2BetweenPoints: distance2BetweenPoints,
  angleBetweenVectors: angleBetweenVectors,
  gaussianAmplitude: gaussianAmplitude,
  gaussianWeight: gaussianWeight,
  dot2D: dot2D,
  outer2D: outer2D,
  norm2D: norm2D,
  normalize2D: normalize2D,
  determinant2x2: determinant2x2,
  LUFactor3x3: LUFactor3x3,
  LUSolve3x3: LUSolve3x3,
  linearSolve3x3: linearSolve3x3,
  multiply3x3_vect3: multiply3x3_vect3,
  multiply3x3_mat3: multiply3x3_mat3,
  multiplyMatrix: multiplyMatrix,
  transpose3x3: transpose3x3,
  invert3x3: invert3x3,
  identity3x3: identity3x3,
  determinant3x3: determinant3x3,
  quaternionToMatrix3x3: quaternionToMatrix3x3,
  matrix3x3ToQuaternion: matrix3x3ToQuaternion,
  multiplyQuaternion: multiplyQuaternion,
  orthogonalize3x3: orthogonalize3x3,
  diagonalize3x3: diagonalize3x3,
  singularValueDecomposition3x3: singularValueDecomposition3x3,
  solveLinearSystem: solveLinearSystem,
  invertMatrix: invertMatrix,
  luFactorLinearSystem: luFactorLinearSystem,
  luSolveLinearSystem: luSolveLinearSystem,
  estimateMatrixCondition: estimateMatrixCondition,
  jacobi: jacobi,
  jacobiN: jacobiN,
  solveHomogeneousLeastSquares: solveHomogeneousLeastSquares,
  solveLeastSquares: solveLeastSquares,
  rgb2hsv: rgb2hsv,
  hsv2rgb: hsv2rgb,
  lab2xyz: lab2xyz,
  xyz2lab: xyz2lab,
  xyz2rgb: xyz2rgb,
  rgb2xyz: rgb2xyz,
  rgb2lab: rgb2lab,
  lab2rgb: lab2rgb,
  uninitializeBounds: uninitializeBounds,
  areBoundsInitialized: areBoundsInitialized,
  clampValue: clampValue,
  clampAndNormalizeValue: clampAndNormalizeValue,
  getScalarTypeFittingRange: getScalarTypeFittingRange,
  getAdjustedScalarRange: getAdjustedScalarRange,
  extentIsWithinOtherExtent: extentIsWithinOtherExtent,
  boundsIsWithinOtherBounds: boundsIsWithinOtherBounds,
  pointIsWithinBounds: pointIsWithinBounds,
  solve3PointCircle: solve3PointCircle,
  inf: inf,
  negInf: negInf,
  isInf: isInf,
  isNan: isNan,
  isFinite: isFinite,

  // JS add-on
  createUninitializedBounds: createUninitializedBounds
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @fileoverview gl-matrix - High performance matrix and vector operations
 * @author Brandon Jones
 * @author Colin MacKenzie IV
 * @version 2.3.0
 */

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */
// END HEADER

exports.glMatrix = __webpack_require__(7);
exports.mat2 = __webpack_require__(43);
exports.mat2d = __webpack_require__(44);
exports.mat3 = __webpack_require__(27);
exports.mat4 = __webpack_require__(45);
exports.quat = __webpack_require__(46);
exports.vec2 = __webpack_require__(47);
exports.vec3 = __webpack_require__(28);
exports.vec4 = __webpack_require__(29);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = exports.PASS_TYPES = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vtkErrorMacro = _macro2.default.vtkErrorMacro;
var PASS_TYPES = exports.PASS_TYPES = ['Build', 'Render'];

// ----------------------------------------------------------------------------
// vtkViewNode methods
// ----------------------------------------------------------------------------

function vtkViewNode(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkViewNode');

  // Builds myself.
  publicAPI.build = function (prepass) {};

  // Renders myself
  publicAPI.render = function (prepass) {};

  publicAPI.traverse = function (renderPass) {
    if (model.deleted) {
      return;
    }

    // we can choose to do special
    // traversal here based on pass
    var passTraversal = 'traverse' + _macro2.default.capitalize(renderPass.getOperation());
    if (typeof publicAPI[passTraversal] === 'function') {
      publicAPI[passTraversal](renderPass);
      return;
    }

    // default traversal
    publicAPI.apply(renderPass, true);

    publicAPI.getChildren().forEach(function (child) {
      child.traverse(renderPass);
    });

    publicAPI.apply(renderPass, false);
  };

  publicAPI.apply = function (renderPass, prepass) {
    if (typeof publicAPI[renderPass.getOperation()] === 'function') {
      publicAPI[renderPass.getOperation()](prepass, renderPass);
    }
  };

  publicAPI.getViewNodeFor = function (dataObject) {
    if (model.renderable === dataObject) {
      return publicAPI;
    }

    return model.children.find(function (child) {
      var vn = child.getViewNodeFor(dataObject);
      return !!vn;
    });
  };

  publicAPI.getFirstAncestorOfType = function (type) {
    if (!model.parent) {
      return null;
    }
    if (model.parent.isA(type)) {
      return model.parent;
    }
    return model.parent.getFirstAncestorOfType(type);
  };

  publicAPI.addMissingPropNodes = function (actorsList) {
    if (!actorsList || !actorsList.length) {
      return;
    }
    publicAPI.addMissingPropNode(actorsList, publicAPI);
  };

  publicAPI.addMissingPropNode = function (dataObjs, parent) {
    model.preparedNodes = model.preparedNodes.concat(dataObjs);

    // if any dataObj is not a renderable of a child
    // then create child for that dataObj with renderable set to the
    // dataObj
    var childDOs = model.children.map(function (node) {
      return node.getRenderable();
    });

    var newNodes = dataObjs.filter(function (node) {
      return node && !node.isDeleted() && childDOs.indexOf(node) === -1;
    }).map(function (node) {
      var newNode = parent.createViewNode(node);
      if (newNode) {
        newNode.setParent(parent);
        newNode.setRenderable(node);
      }
      var actors = [].concat(node.getActors());
      var childs = actors.filter(function (actor) {
        return actor !== node;
      });
      if (childs.length > 0) {
        newNode.addMissingPropNode(childs, newNode);
      }
      return newNode;
    });
    model.children = model.children.concat(newNodes);
  };

  publicAPI.addMissingNode = function (dataObj) {
    if (dataObj && !dataObj.isDeleted()) {
      publicAPI.addMissingNodes([dataObj]);
    }
  };

  publicAPI.addMissingNodes = function (dataObjs) {
    if (!dataObjs || !dataObjs.length) {
      return;
    }
    model.preparedNodes = model.preparedNodes.concat(dataObjs);

    // if any dataObj is not a renderable of a child
    // then create child for that dataObj with renderable set to the
    // dataObj
    var childDOs = model.children.map(function (node) {
      return node.getRenderable();
    });

    var newNodes = dataObjs.filter(function (node) {
      return node && !node.isDeleted() && childDOs.indexOf(node) === -1;
    }).map(function (node) {
      var newNode = publicAPI.createViewNode(node);
      if (newNode) {
        newNode.setParent(publicAPI);
        newNode.setRenderable(node);
      }
      return newNode;
    });

    model.children = model.children.concat(newNodes);
  };

  publicAPI.prepareNodes = function () {
    model.preparedNodes = [];
  };

  publicAPI.removeUnusedNodes = function () {
    model.children = model.children.filter(function (node) {
      return node.isDeleted() || model.preparedNodes.indexOf(node.getRenderable()) !== -1;
    });
    publicAPI.prepareNodes();
  };

  publicAPI.createViewNode = function (dataObj) {
    if (!model.myFactory) {
      vtkErrorMacro('Cannot create view nodes without my own factory');
      return null;
    }
    var ret = model.myFactory.createNode(dataObj);
    if (ret) {
      ret.setRenderable(dataObj);
    }
    return ret;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  parent: null,
  renderable: null,
  myFactory: null,
  children: [],
  preparedNodes: []
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  _macro2.default.obj(publicAPI, model);
  _macro2.default.event(publicAPI, model, 'event');
  _macro2.default.setGet(publicAPI, model, ['parent', 'renderable', 'myFactory']);
  _macro2.default.getArray(publicAPI, model, ['children']);

  // Object methods
  vtkViewNode(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkViewNode');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend, PASS_TYPES: PASS_TYPES };

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = function() {
	throw new Error("define cannot be used indirect");
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var DataTypeByteSize = exports.DataTypeByteSize = {
  Int8Array: 1,
  Uint8Array: 1,
  Uint8ClampedArray: 1,
  Int16Array: 2,
  Uint16Array: 2,
  Int32Array: 4,
  Uint32Array: 4,
  Float32Array: 4,
  Float64Array: 8
};

var VtkDataTypes = exports.VtkDataTypes = {
  VOID: '', // FIXME not sure to know what that shoud be
  CHAR: 'Int8Array',
  SIGNED_CHAR: 'Int8Array',
  UNSIGNED_CHAR: 'Uint8Array',
  SHORT: 'Int16Array',
  UNSIGNED_SHORT: 'Uint16Array',
  INT: 'Int32Array',
  UNSIGNED_INT: 'Uint32Array',
  FLOAT: 'Float32Array',
  DOUBLE: 'Float64Array'
};

var DefaultDataType = exports.DefaultDataType = VtkDataTypes.FLOAT;

exports.default = {
  DefaultDataType: DefaultDataType,
  DataTypeByteSize: DataTypeByteSize,
  VtkDataTypes: VtkDataTypes
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = exports.STATIC = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _Constants = __webpack_require__(5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vtkErrorMacro = _macro2.default.vtkErrorMacro;

var TUPLE_HOLDER = [];

// ----------------------------------------------------------------------------
// Global methods
// ----------------------------------------------------------------------------

function computeRange(values) {
  var component = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var tuple = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  var range = { min: Number.MAX_VALUE, max: Number.MIN_VALUE };

  if (component < 0) {
    // Compute magnitude
    vtkErrorMacro('vtkDataArray: Compute magnitude - NOT IMPLEMENTED');
    return range;
  }

  var size = values.length;
  for (var i = component; i < size; i += tuple) {
    var value = values[i];
    if (range.min > value) {
      range.min = value;
    }
    if (range.max < value) {
      range.max = value;
    }
  }

  return range;
}

function ensureRangeSize(rangeArray) {
  var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  var ranges = rangeArray || [];
  // Pad ranges with null value to get the
  while (ranges.length <= size) {
    ranges.push(null);
  }
  return ranges;
}

function getDataType(typedArray) {
  return Object.prototype.toString.call(typedArray).split(' ')[1].slice(0, -1);
}

// ----------------------------------------------------------------------------
// Static API
// ----------------------------------------------------------------------------

var STATIC = exports.STATIC = {
  computeRange: computeRange,
  getDataType: getDataType
};

// ----------------------------------------------------------------------------
// vtkDataArray methods
// ----------------------------------------------------------------------------

function vtkDataArray(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkDataArray');

  function dataChange() {
    model.ranges = null;
    publicAPI.modified();
  }

  publicAPI.getElementComponentSize = function () {
    return model.values.BYTES_PER_ELEMENT;
  };

  // Description:
  // Return the data component at the location specified by tupleIdx and
  // compIdx.
  publicAPI.getComponent = function (tupleIdx) {
    var compIdx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    return model.values[tupleIdx * model.numberOfComponents + compIdx];
  };

  // Description:
  // Set the data component at the location specified by tupleIdx and compIdx
  // to value.
  // Note that i is less than NumberOfTuples and j is less than
  //  NumberOfComponents. Make sure enough memory has been allocated
  // (use SetNumberOfTuples() and SetNumberOfComponents()).
  publicAPI.setComponent = function (tupleIdx, compIdx, value) {
    if (value !== model.values[tupleIdx * model.numberOfComponents + compIdx]) {
      model.values[tupleIdx * model.numberOfComponents + compIdx] = value;
      dataChange();
    }
  };

  publicAPI.getData = function () {
    return model.values;
  };

  publicAPI.getRange = function () {
    var componentIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    var rangeIdx = componentIndex < 0 ? model.numberOfComponents : componentIndex;
    var range = null;

    if (!model.ranges) {
      model.ranges = ensureRangeSize(model.ranges, model.numberOfComponents);
    }
    range = model.ranges[rangeIdx];

    if (range) {
      return [range.min, range.max];
    }

    // Need to compute ranges...
    range = computeRange(model.values, componentIndex, model.numberOfComponents);
    model.ranges[rangeIdx] = range;
    return [range.min, range.max];
  };

  publicAPI.setTuple = function (idx, tuple) {
    var offset = idx * model.numberOfComponents;
    for (var i = 0; i < model.numberOfComponents; i++) {
      model.values[offset + i] = tuple[i];
    }
  };

  publicAPI.getTuple = function (idx) {
    var tupleToFill = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : TUPLE_HOLDER;

    var numberOfComponents = model.numberOfComponents || 1;
    if (tupleToFill.length) {
      tupleToFill.length = numberOfComponents;
    }
    var offset = idx * numberOfComponents;
    for (var i = 0; i < numberOfComponents; i++) {
      tupleToFill[i] = model.values[offset + i];
    }
    return tupleToFill;
  };

  publicAPI.getTupleLocation = function () {
    var idx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    return idx * model.numberOfComponents;
  };
  publicAPI.getNumberOfComponents = function () {
    return model.numberOfComponents;
  };
  publicAPI.getNumberOfValues = function () {
    return model.values.length;
  };
  publicAPI.getNumberOfTuples = function () {
    return model.values.length / model.numberOfComponents;
  };
  publicAPI.getDataType = function () {
    return model.dataType;
  };
  /* eslint-disable no-use-before-define */
  publicAPI.newClone = function () {
    return newInstance({
      empty: true,
      name: model.name,
      dataType: model.dataType,
      numberOfComponents: model.numberOfComponents
    });
  };
  /* eslint-enable no-use-before-define */

  publicAPI.getName = function () {
    if (!model.name) {
      publicAPI.modified();
      model.name = 'vtkDataArray' + publicAPI.getMTime();
    }
    return model.name;
  };

  publicAPI.setData = function (typedArray, numberOfComponents) {
    model.values = typedArray;
    model.size = typedArray.length;
    model.dataType = getDataType(typedArray);
    if (numberOfComponents) {
      model.numberOfComponents = numberOfComponents;
    }
    if (model.size % model.numberOfComponents !== 0) {
      model.numberOfComponents = 1;
    }
    dataChange();
  };

  /* eslint-disable no-use-before-define */
  publicAPI.shallowCopy = function () {
    return newInstance(Object.assign({}, model));
  };
  /* eslint-enable no-use-before-define */

  // Override serialization support
  publicAPI.getState = function () {
    var jsonArchive = Object.assign({}, model, { vtkClass: publicAPI.getClassName() });

    // Convert typed array to regular array
    jsonArchive.values = Array.from(jsonArchive.values);
    delete jsonArchive.buffer;

    // Clean any empty data
    Object.keys(jsonArchive).forEach(function (keyName) {
      if (!jsonArchive[keyName]) {
        delete jsonArchive[keyName];
      }
    });

    // Sort resulting object by key name
    var sortedObj = {};
    Object.keys(jsonArchive).sort().forEach(function (name) {
      sortedObj[name] = jsonArchive[name];
    });

    // Remove mtime
    if (sortedObj.mtime) {
      delete sortedObj.mtime;
    }

    return sortedObj;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  name: '',
  numberOfComponents: 1,
  size: 0,
  dataType: _Constants.DefaultDataType
  // values: null,
  // ranges: null,
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  if (!model.empty && !model.values && !model.size) {
    throw new TypeError('Cannot create vtkDataArray object without: size > 0, values');
  }

  if (!model.values) {
    model.values = new window[model.dataType](model.size);
  } else if (Array.isArray(model.values)) {
    model.values = window[model.dataType].from(model.values);
  }

  if (model.values) {
    model.size = model.values.length;
    model.dataType = getDataType(model.values);
  }

  // Object methods
  _macro2.default.obj(publicAPI, model);
  _macro2.default.set(publicAPI, model, ['name', 'numberOfComponents']);

  // Object specific methods
  vtkDataArray(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkDataArray');

// ----------------------------------------------------------------------------

exports.default = Object.assign({ newInstance: newInstance, extend: extend }, STATIC);

/***/ }),
/* 7 */
/***/ (function(module, exports) {

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

/**
 * @class Common utilities
 * @name glMatrix
 */
var glMatrix = {};

// Constants
glMatrix.EPSILON = 0.000001;
glMatrix.ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
glMatrix.RANDOM = Math.random;

/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Type} type Array type, such as Float32Array or Array
 */
glMatrix.setMatrixArrayType = function(type) {
    GLMAT_ARRAY_TYPE = type;
}

var degree = Math.PI / 180;

/**
* Convert Degree To Radian
*
* @param {Number} Angle in Degrees
*/
glMatrix.toRadian = function(a){
     return a * degree;
}

module.exports = glMatrix;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.substitute = substitute;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _Shader = __webpack_require__(67);

var _Shader2 = _interopRequireDefault(_Shader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vtkErrorMacro = _macro2.default.vtkErrorMacro;

// perform in place string substitutions, indicate if a substitution was done
// this is useful for building up shader strings which typically involve
// lots of string substitutions. Return true if a substitution was done.

function substitute(source, search, replace) {
  var all = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  var replaceStr = Array.isArray(replace) ? replace.join('\n') : replace;
  var replaced = false;
  if (source.search(search) !== -1) {
    replaced = true;
  }
  var gflag = '';
  if (all) {
    gflag = 'g';
  }
  var regex = new RegExp(search, gflag);
  var resultstr = source.replace(regex, replaceStr);
  return { replace: replaced, result: resultstr };
}

// ----------------------------------------------------------------------------
// vtkShaderProgram methods
// ----------------------------------------------------------------------------

function vtkShaderProgram(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkShaderProgram');

  publicAPI.compileShader = function () {
    if (!model.vertexShader.compile()) {
      vtkErrorMacro(model.vertexShader.getSource().split('\n').map(function (line, index) {
        return index + ': ' + line;
      }).join('\n'));
      vtkErrorMacro(model.vertexShader.getError());
      return 0;
    }
    if (!model.fragmentShader.compile()) {
      vtkErrorMacro(model.fragmentShader.getSource().split('\n').map(function (line, index) {
        return index + ': ' + line;
      }).join('\n'));
      vtkErrorMacro(model.fragmentShader.getError());
      return 0;
    }
    // skip geometry for now
    if (!publicAPI.attachShader(model.vertexShader)) {
      vtkErrorMacro(model.error);
      return 0;
    }
    if (!publicAPI.attachShader(model.fragmentShader)) {
      vtkErrorMacro(model.error);
      return 0;
    }

    if (!publicAPI.link()) {
      vtkErrorMacro('Links failed: ' + model.error);
      return 0;
    }

    publicAPI.setCompiled(true);
    return 1;
  };

  publicAPI.cleanup = function () {
    if (model.shaderType === 'Unknown' || model.handle === 0) {
      return;
    }

    model.context.deleteShader(model.handle);
    model.handle = 0;
  };

  publicAPI.bind = function () {
    if (!model.linked && !model.link()) {
      return false;
    }

    model.context.useProgram(model.handle);
    publicAPI.setBound(true);
    return true;
  };

  publicAPI.isBound = function () {
    return !!model.bound;
  };

  publicAPI.release = function () {
    model.context.useProgram(null);
    publicAPI.setBound(false);
  };

  publicAPI.setContext = function (ctx) {
    model.vertexShader.setContext(ctx);
    model.fragmentShader.setContext(ctx);
    model.geometryShader.setContext(ctx);
  };

  publicAPI.link = function () {
    if (model.inked) {
      return true;
    }

    if (model.handle === 0) {
      model.error = 'Program has not been initialized, and/or does not have shaders.';
      return false;
    }

    // clear out the list of uniforms used
    model.uniformLocs = {};

    model.context.linkProgram(model.handle);
    var isCompiled = model.context.getProgramParameter(model.handle, model.context.LINK_STATUS);
    if (!isCompiled) {
      var lastError = model.context.getProgramInfoLog(model.handle);
      vtkErrorMacro('Error linking shader ' + lastError);
      model.handle = 0;
      return false;
    }

    publicAPI.setLinked(true);
    model.attributeLocs = {};
    return true;
  };

  publicAPI.setUniformMatrix = function (name, v) {
    var location = publicAPI.findUniform(name);
    if (location === -1) {
      model.error = 'Could not set uniform ' + name + ' . No such uniform.';
      return false;
    }
    model.context.uniformMatrix4fv(location, false, v);
    return true;
  };

  publicAPI.setUniformMatrix3x3 = function (name, v) {
    var location = publicAPI.findUniform(name);
    if (location === -1) {
      model.error = 'Could not set uniform ' + name + ' . No such uniform.';
      return false;
    }
    model.context.uniformMatrix3fv(location, false, v);
    return true;
  };

  publicAPI.setUniformf = function (name, v) {
    var location = publicAPI.findUniform(name);
    if (location === -1) {
      model.error = 'Could not set uniform ' + name + ' . No such uniform.';
      return false;
    }
    model.context.uniform1f(location, v);
    return true;
  };

  publicAPI.setUniformfv = function (name, v) {
    var location = publicAPI.findUniform(name);
    if (location === -1) {
      model.error = 'Could not set uniform ' + name + ' . No such uniform.';
      return false;
    }
    model.context.uniform1fv(location, v);
    return true;
  };

  publicAPI.setUniformi = function (name, v) {
    var location = publicAPI.findUniform(name);
    if (location === -1) {
      model.error = 'Could not set uniform ' + name + ' . No such uniform.';
      return false;
    }
    model.context.uniform1i(location, v);
    return true;
  };

  publicAPI.setUniformiv = function (name, v) {
    var location = publicAPI.findUniform(name);
    if (location === -1) {
      model.error = 'Could not set uniform ' + name + ' . No such uniform.';
      return false;
    }
    model.context.uniform1iv(location, v);
    return true;
  };

  publicAPI.setUniform2f = function (name) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var location = publicAPI.findUniform(name);
    if (location === -1) {
      model.error = 'Could not set uniform ' + name + ' . No such uniform.';
      return false;
    }
    var array = args;
    // allow an array passed as a single argument
    if (array.length === 1 && Array.isArray(array[0])) {
      array = array[0];
    }
    if (array.length !== 2) {
      throw new RangeError('Invalid number of values for array');
    }
    model.context.uniform2f(location, array[0], array[1]);
    return true;
  };

  publicAPI.setUniform2fv = function (name, v) {
    var location = publicAPI.findUniform(name);
    if (location === -1) {
      model.error = 'Could not set uniform ' + name + ' . No such uniform.';
      return false;
    }
    model.context.uniform2fv(location, v);
    return true;
  };

  publicAPI.setUniform2i = function (name) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    var location = publicAPI.findUniform(name);
    if (location === -1) {
      model.error = 'Could not set uniform ' + name + ' . No such uniform.';
      return false;
    }
    var array = args;
    // allow an array passed as a single argument
    if (array.length === 1 && Array.isArray(array[0])) {
      array = array[0];
    }
    if (array.length !== 2) {
      throw new RangeError('Invalid number of values for array');
    }
    model.context.uniform2i(location, array[0], array[1]);
    return true;
  };

  publicAPI.setUniform2iv = function (name, v) {
    var location = publicAPI.findUniform(name);
    if (location === -1) {
      model.error = 'Could not set uniform ' + name + ' . No such uniform.';
      return false;
    }
    model.context.uniform2iv(location, v);
    return true;
  };

  publicAPI.setUniform3f = function (name) {
    for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }

    var location = publicAPI.findUniform(name);
    if (location === -1) {
      model.error = 'Could not set uniform ' + name + ' . No such uniform.';
      return false;
    }
    var array = args;
    // allow an array passed as a single argument
    if (array.length === 1 && Array.isArray(array[0])) {
      array = array[0];
    }
    if (array.length !== 3) {
      throw new RangeError('Invalid number of values for array');
    }
    model.context.uniform3f(location, array[0], array[1], array[2]);
    return true;
  };

  publicAPI.setUniform3fv = function (name, v) {
    var location = publicAPI.findUniform(name);
    if (location === -1) {
      model.error = 'Could not set uniform ' + name + ' . No such uniform.';
      return false;
    }
    model.context.uniform3fv(location, v);
    return true;
  };

  publicAPI.setUniform3i = function (name) {
    for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      args[_key4 - 1] = arguments[_key4];
    }

    var location = publicAPI.findUniform(name);
    if (location === -1) {
      model.error = 'Could not set uniform ' + name + ' . No such uniform.';
      return false;
    }
    var array = args;
    // allow an array passed as a single argument
    if (array.length === 1 && Array.isArray(array[0])) {
      array = array[0];
    }
    if (array.length !== 3) {
      throw new RangeError('Invalid number of values for array');
    }
    model.context.uniform3i(location, array[0], array[1], array[2]);
    return true;
  };

  publicAPI.setUniform3iv = function (name, v) {
    var location = publicAPI.findUniform(name);
    if (location === -1) {
      model.error = 'Could not set uniform ' + name + ' . No such uniform.';
      return false;
    }
    model.context.uniform3iv(location, v);
    return true;
  };

  publicAPI.setUniform4f = function (name) {
    for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
      args[_key5 - 1] = arguments[_key5];
    }

    var location = publicAPI.findUniform(name);
    if (location === -1) {
      model.error = 'Could not set uniform ' + name + ' . No such uniform.';
      return false;
    }
    var array = args;
    // allow an array passed as a single argument
    if (array.length === 1 && Array.isArray(array[0])) {
      array = array[0];
    }
    if (array.length !== 4) {
      throw new RangeError('Invalid number of values for array');
    }
    model.context.uniform4f(location, array[0], array[1], array[2], array[3]);
    return true;
  };

  publicAPI.setUniform4fv = function (name, v) {
    var location = publicAPI.findUniform(name);
    if (location === -1) {
      model.error = 'Could not set uniform ' + name + ' . No such uniform.';
      return false;
    }
    model.context.uniform4fv(location, v);
    return true;
  };

  publicAPI.setUniform4i = function (name) {
    for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
      args[_key6 - 1] = arguments[_key6];
    }

    var location = publicAPI.findUniform(name);
    if (location === -1) {
      model.error = 'Could not set uniform ' + name + ' . No such uniform.';
      return false;
    }
    var array = args;
    // allow an array passed as a single argument
    if (array.length === 1 && Array.isArray(array[0])) {
      array = array[0];
    }
    if (array.length !== 4) {
      throw new RangeError('Invalid number of values for array');
    }
    model.context.uniform4i(location, array[0], array[1], array[2], array[3]);
    return true;
  };

  publicAPI.setUniform4iv = function (name, v) {
    var location = publicAPI.findUniform(name);
    if (location === -1) {
      model.error = 'Could not set uniform ' + name + ' . No such uniform.';
      return false;
    }
    model.context.uniform4iv(location, v);
    return true;
  };

  publicAPI.setUniform4fv = function (name, count, v) {
    var location = publicAPI.findUniform(name);
    if (location === -1) {
      model.error = 'Could not set uniform ' + name + ' . No such uniform.';
      return false;
    }
    model.context.uniform4fv(location, v);
    return true;
  };

  publicAPI.findUniform = function (name) {
    if (!name || !model.linked) {
      return -1;
    }

    var loc = Object.keys(model.uniformLocs).indexOf(name);

    if (loc !== -1) {
      return model.uniformLocs[name];
    }

    loc = model.context.getUniformLocation(model.handle, name);
    if (loc === null) {
      model.error = 'Uniform ' + name + ' not found in current shader program.';
    }
    model.uniformLocs[name] = loc;

    return loc;
  };

  publicAPI.isUniformUsed = function (name) {
    if (!name) {
      return false;
    }

    // see if we have cached the result
    var loc = Object.keys(model.uniformLocs).indexOf(name);
    if (loc !== -1) {
      return true;
    }

    if (!model.linked) {
      vtkErrorMacro('attempt to find uniform when the shader program is not linked');
      return false;
    }

    loc = model.context.getUniformLocation(model.handle, name);
    if (loc === null) {
      return false;
    }
    model.uniformLocs[name] = loc;

    return true;
  };

  publicAPI.isAttributeUsed = function (name) {
    if (!name) {
      return false;
    }

    // see if we have cached the result
    var loc = Object.keys(model.attributeLocs).indexOf(name);
    if (loc !== -1) {
      return true;
    }

    if (!model.linked) {
      vtkErrorMacro('attempt to find uniform when the shader program is not linked');
      return false;
    }

    loc = model.context.getAttribLocation(model.handle, name);
    if (loc === -1) {
      return false;
    }
    model.attributeLocs[name] = loc;

    return true;
  };

  publicAPI.attachShader = function (shader) {
    if (shader.getHandle() === 0) {
      model.error = 'Shader object was not initialized, cannot attach it.';
      return false;
    }
    if (shader.getShaderType() === 'Unknown') {
      model.error = 'Shader object is of type Unknown and cannot be used.';
      return false;
    }

    if (model.handle === 0) {
      var thandle = model.context.createProgram();
      if (thandle === 0) {
        model.error = 'Could not create shader program.';
        return false;
      }
      model.handle = thandle;
      model.linked = false;
    }

    if (shader.getShaderType() === 'Vertex') {
      if (model.vertexShaderHandle !== 0) {
        model.comntext.detachShader(model.handle, model.vertexShaderHandle);
      }
      model.vertexShaderHandle = shader.getHandle();
    }
    if (shader.getShaderType() === 'Fragment') {
      if (model.fragmentShaderHandle !== 0) {
        model.context.detachShader(model.handle, model.fragmentShaderHandle);
      }
      model.fragmentShaderHandle = shader.getHandle();
    }

    model.context.attachShader(model.handle, shader.getHandle());
    publicAPI.setLinked(false);
    return true;
  };

  publicAPI.detachShader = function (shader) {
    if (shader.getHandle() === 0) {
      model.error = 'shader object was not initialized, cannot attach it.';
      return false;
    }
    if (shader.getShaderType() === 'Unknown') {
      model.error = 'Shader object is of type Unknown and cannot be used.';
      return false;
    }
    if (model.handle === 0) {
      model.errror = 'This shader prorgram has not been initialized yet.';
    }

    switch (shader.getShaderType()) {
      case 'Vertex':
        if (model.vertexShaderHandle !== shader.getHandle()) {
          model.error = 'The supplied shader was not attached to this program.';
          return false;
        }
        model.context.detachShader(model.handle, shader.getHandle());
        model.vertexShaderHandle = 0;
        model.linked = false;
        return true;
      case 'Fragment':
        if (model.fragmentShaderHandle !== shader.getHandle()) {
          model.error = 'The supplied shader was not attached to this program.';
          return false;
        }
        model.context.detachShader(model.handle, shader.getHandle());
        model.fragmentShaderHandle = 0;
        model.linked = false;
        return true;
      default:
        return false;
    }
  };

  publicAPI.setContext = function (ctx) {
    model.context = ctx;
    model.vertexShader.setContext(ctx);
    model.fragmentShader.setContext(ctx);
    model.geometryShader.setContext(ctx);
  };

  // publicAPI.enableAttributeArray = (name) => {
  //   const location = publicAPI.findAttributeArray(name);
  //   if (location === -1) {
  //     model.error = `Could not enable attribute ${name} No such attribute.`;
  //     return false;
  //   }
  //   model.context.enableVertexAttribArray(location);
  //   return true;
  // };

  // publicAPI.disableAttributeArray = (name) => {
  //   const location = publicAPI.findAttributeArray(name);
  //   if (location === -1) {
  //     model.error = `Could not enable attribute ${name} No such attribute.`;
  //     return false;
  //   }
  //   model.context.disableVertexAttribArray(location);
  //   return true;
  // };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  vertexShaderHandle: 0,
  fragmentShaderHandle: 0,
  geometryShaderHandle: 0,
  vertexShader: null,
  fragmentShader: null,
  geometryShader: null,

  linked: false,
  bound: false,
  compiled: false,
  error: '',
  handle: 0,
  numberOfOutputs: 0,
  attributesLocs: null,
  uniformLocs: null,
  md5Hash: 0,
  context: null
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Instanciate internal objects
  model.attributesLocs = {};
  model.uniformLocs = {};
  model.vertexShader = _Shader2.default.newInstance();
  model.vertexShader.setShaderType('Vertex');
  model.fragmentShader = _Shader2.default.newInstance();
  model.fragmentShader.setShaderType('Fragment');
  model.geometryShader = _Shader2.default.newInstance();
  model.geometryShader.setShaderType('Geometry');

  // Build VTK API
  _macro2.default.obj(publicAPI, model);
  _macro2.default.setGet(publicAPI, model, ['error', 'handle', 'compiled', 'bound', 'md5Hash', 'vertexShader', 'fragmentShader', 'geometryShader', 'linked']);

  // Object methods
  vtkShaderProgram(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkShaderProgram');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend, substitute: substitute };

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = vtk;
exports.register = register;
var factoryMapping = {
  vtkObject: function vtkObject() {
    return null;
  }
};

function vtk(obj) {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (obj.isA) {
    return obj;
  }
  if (!obj.vtkClass) {
    if (global.console && global.console.error) {
      global.console.error('Invalid VTK object');
    }
    return null;
  }
  var constructor = factoryMapping[obj.vtkClass];
  if (!constructor) {
    if (global.console && global.console.error) {
      global.console.error('No vtk class found for Object of type ' + obj.vtkClass);
    }
    return null;
  }

  // Shallow copy object
  var model = Object.assign({}, obj);

  // Convert into vtkObject any nested key
  Object.keys(model).forEach(function (keyName) {
    if (model[keyName] && _typeof(model[keyName]) === 'object' && model[keyName].vtkClass) {
      model[keyName] = vtk(model[keyName]);
    }
  });

  // Return the root
  var newInst = constructor(model);
  if (newInst && newInst.modified) {
    newInst.modified();
  }
  return newInst;
}

function register(vtkClassName, constructor) {
  factoryMapping[vtkClassName] = constructor;
}

// Nest register method under the vtk function
vtk.register = register;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(17)))

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _glMatrix = __webpack_require__(2);

var _Constants = __webpack_require__(13);

var _Constants2 = __webpack_require__(5);

var _Math = __webpack_require__(1);

var _Math2 = _interopRequireDefault(_Math);

var _ViewNode = __webpack_require__(3);

var _ViewNode2 = _interopRequireDefault(_ViewNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vtkDebugMacro = _macro2.default.vtkDebugMacro,
    vtkErrorMacro = _macro2.default.vtkErrorMacro,
    vtkWarningMacro = _macro2.default.vtkWarningMacro;

// ----------------------------------------------------------------------------
// vtkOpenGLTexture methods
// ----------------------------------------------------------------------------

function vtkOpenGLTexture(publicAPI, model) {
  var _this = this;

  // Set our className
  model.classHierarchy.push('vtkOpenGLTexture');
  // Renders myself
  publicAPI.render = function () {
    var oglren = publicAPI.getFirstAncestorOfType('vtkOpenGLRenderer');
    // sync renderable properties
    model.window = oglren.getParent();
    model.context = model.window.getContext();
    if (model.renderable.getInterpolate()) {
      if (model.generateMipmap) {
        publicAPI.setMinificationFilter(_Constants.Filter.LINEAR_MIPMAP_LINEAR);
      } else {
        publicAPI.setMinificationFilter(_Constants.Filter.LINEAR);
      }
      publicAPI.setMagnificationFilter(_Constants.Filter.LINEAR);
    } else {
      publicAPI.setMinificationFilter(_Constants.Filter.NEAREST);
      publicAPI.setMagnificationFilter(_Constants.Filter.NEAREST);
    }
    if (model.renderable.getRepeat()) {
      publicAPI.setWrapR(_Constants.Wrap.REPEAT);
      publicAPI.setWrapS(_Constants.Wrap.REPEAT);
      publicAPI.setWrapT(_Constants.Wrap.REPEAT);
    }
    // clear image if input data is set
    if (model.renderable.getInputData()) {
      model.renderable.setImage(null);
    }
    // create the texture if it is not done already
    if (!model.handle || model.renderable.getMTime() > model.textureBuildTime.getMTime()) {
      // if we have an Image
      if (model.renderable.getImage() !== null) {
        if (model.renderable.getInterpolate()) {
          model.generateMipmap = true;
          publicAPI.setMinificationFilter(_Constants.Filter.LINEAR_MIPMAP_LINEAR);
        }
        // Have an Image which may not be complete
        if (model.renderable.getImage() && model.renderable.getImageLoaded()) {
          publicAPI.create2DFromImage(model.renderable.getImage());
          publicAPI.activate();
          publicAPI.sendParameters();
          model.textureBuildTime.modified();
        }
      }
      // if we have Inputdata
      var input = model.renderable.getInputData(0);
      if (input && input.getPointData().getScalars()) {
        var ext = input.getExtent();
        var inScalars = input.getPointData().getScalars();

        // do we have a cube map? Six inputs
        var data = [];
        for (var i = 0; i < 6; ++i) {
          var indata = model.renderable.getInputData(i);
          var scalars = indata ? indata.getPointData().getScalars().getData() : null;
          if (scalars) {
            data.push(scalars);
          }
        }
        if (data.length === 6) {
          publicAPI.createCubeFromRaw(ext[1] - ext[0] + 1, ext[3] - ext[2] + 1, inScalars.getNumberOfComponents(), inScalars.getDataType(), data);
        } else {
          if (model.renderable.getInterpolate() && inScalars.getNumberOfComponents() === 4) {
            model.generateMipmap = true;
            publicAPI.setMinificationFilter(_Constants.Filter.LINEAR_MIPMAP_LINEAR);
          }
          publicAPI.create2DFromRaw(ext[1] - ext[0] + 1, ext[3] - ext[2] + 1, inScalars.getNumberOfComponents(), inScalars.getDataType(), inScalars.getData());
        }
        publicAPI.activate();
        publicAPI.sendParameters();
        model.textureBuildTime.modified();
      }
    }
    if (model.handle) {
      publicAPI.activate();
    }
  };

  //----------------------------------------------------------------------------
  publicAPI.destroyTexture = function () {
    // deactivate it first
    publicAPI.deactivate();

    if (model.context && model.handle) {
      model.context.deleteTexture(model.handle);
    }
    model.handle = 0;
    model.numberOfDimensions = 0;
    model.target = 0;
    model.components = 0;
    model.width = 0;
    model.height = 0;
    model.depth = 0;
    publicAPI.resetFormatAndType();
  };

  //----------------------------------------------------------------------------
  publicAPI.createTexture = function () {
    // reuse the existing handle if we have one
    if (!model.handle) {
      model.handle = model.context.createTexture();

      if (model.target) {
        model.context.bindTexture(model.target, model.handle);

        // See: http://www.openmodel.context..org/wiki/Common_Mistakes#Creating_a_complete_texture
        // turn off mip map filter or set the base and max level correctly. here
        // both are done.
        model.context.texParameteri(model.target, model.context.TEXTURE_MIN_FILTER, publicAPI.getOpenGLFilterMode(model.minificationFilter));
        model.context.texParameteri(model.target, model.context.TEXTURE_MAG_FILTER, publicAPI.getOpenGLFilterMode(model.magnificationFilter));

        model.context.texParameteri(model.target, model.context.TEXTURE_WRAP_S, publicAPI.getOpenGLWrapMode(model.wrapS));
        model.context.texParameteri(model.target, model.context.TEXTURE_WRAP_T, publicAPI.getOpenGLWrapMode(model.wrapT));

        model.context.bindTexture(model.target, null);
      }
    }
  };

  //---------------------------------------------------------------------------
  publicAPI.getTextureUnit = function () {
    if (model.window) {
      return model.window.getTextureUnitForTexture(publicAPI);
    }
    return -1;
  };

  //---------------------------------------------------------------------------
  publicAPI.activate = function () {
    // activate a free texture unit for this texture
    model.window.activateTexture(publicAPI);
    publicAPI.bind();
  };

  //---------------------------------------------------------------------------
  publicAPI.deactivate = function () {
    if (model.window) {
      model.window.activateTexture(publicAPI);
      publicAPI.unBind();
      model.window.deactivateTexture(publicAPI);
    }
  };

  //---------------------------------------------------------------------------
  publicAPI.releaseGraphicsResources = function (rwin) {
    if (rwin && model.handle) {
      rwin.makeCurrent();

      rwin.activateTexture(publicAPI);
      publicAPI.unBind();
      rwin.deactivateTexture(publicAPI);
      model.context.deleteTexture(model.handle);
      model.handle = 0;
      model.numberOfDimensions = 0;
      model.target = 0;
      model.internalFormat = 0;
      model.format = 0;
      model.openGLDataType = 0;
      model.components = 0;
      model.width = 0;
      model.height = 0;
      model.depth = 0;
    }
    if (model.shaderProgram) {
      model.shaderProgram.releaseGraphicsResources(rwin);
      model.shaderProgram = null;
    }
  };

  //----------------------------------------------------------------------------
  publicAPI.bind = function () {
    model.context.bindTexture(model.target, model.handle);
    if (model.autoParameters && publicAPI.getMTime() > model.sendParametersTime.getMTime()) {
      publicAPI.sendParameters();
    }
  };

  //----------------------------------------------------------------------------
  publicAPI.unBind = function () {
    if (model.target) {
      model.context.bindTexture(model.target, null);
    }
  };

  //----------------------------------------------------------------------------
  publicAPI.isBound = function () {
    var result = false;
    if (model.context && model.handle) {
      var target = 0;
      switch (model.target) {
        case model.context.TEXTURE_2D:
          target = model.context.TEXTURE_BINDING_2D;
          break;
        default:
          vtkWarningMacro('impossible case');
          break;
      }
      var oid = model.context.getIntegerv(target);
      result = oid === model.handle;
    }
    return result;
  };

  //----------------------------------------------------------------------------
  publicAPI.sendParameters = function () {
    model.context.texParameteri(model.target, model.context.TEXTURE_WRAP_S, publicAPI.getOpenGLWrapMode(model.wrapS));
    model.context.texParameteri(model.target, model.context.TEXTURE_WRAP_T, publicAPI.getOpenGLWrapMode(model.wrapT));
    if (model.window.getWebgl2()) {
      model.context.texParameteri(model.target, model.context.TEXTURE_WRAP_R, publicAPI.getOpenGLWrapMode(model.wrapR));
    }

    model.context.texParameteri(model.target, model.context.TEXTURE_MIN_FILTER, publicAPI.getOpenGLFilterMode(model.minificationFilter));

    model.context.texParameteri(model.target, model.context.TEXTURE_MAG_FILTER, publicAPI.getOpenGLFilterMode(model.magnificationFilter));

    // model.context.texParameterf(model.target, model.context.TEXTURE_MIN_LOD, model.minLOD);
    // model.context.texParameterf(model.target, model.context.TEXTURE_MAX_LOD, model.maxLOD);
    // model.context.texParameteri(model.target, model.context.TEXTURE_BASE_LEVEL, model.baseLevel);
    // model.context.texParameteri(model.target, model.context.TEXTURE_MAX_LEVEL, model.maxLevel);

    model.sendParametersTime.modified();
  };

  //----------------------------------------------------------------------------
  publicAPI.getInternalFormat = function (vtktype, numComps) {
    if (model.internalFormat) {
      return model.internalFormat;
    }

    model.internalFormat = publicAPI.getDefaultInternalFormat(vtktype, numComps);

    if (!model.internalFormat) {
      vtkDebugMacro('Unable to find suitable internal format for T=' + vtktype + ' NC= ' + numComps);
    }

    return model.internalFormat;
  };

  //----------------------------------------------------------------------------
  publicAPI.getDefaultInternalFormat = function (vtktype, numComps) {
    var result = 0;

    // try default next
    result = model.window.getDefaultTextureInternalFormat(vtktype, numComps, false);
    if (result) {
      return result;
    }

    // try floating point
    result = _this.window.getDefaultTextureInternalFormat(vtktype, numComps, true);

    if (!result) {
      vtkDebugMacro('Unsupported internal texture type!');
      vtkDebugMacro('Unable to find suitable internal format for T=' + vtktype + ' NC= ' + numComps);
    }

    return result;
  };

  //----------------------------------------------------------------------------
  publicAPI.setInternalFormat = function (iFormat) {
    if (iFormat !== model.context.InternalFormat) {
      model.internalFormat = iFormat;
      publicAPI.modified();
    }
  };

  //----------------------------------------------------------------------------
  publicAPI.getFormat = function (vtktype, numComps) {
    if (!model.format) {
      model.format = publicAPI.getDefaultFormat(vtktype, numComps);
    }
    return model.format;
  };

  //----------------------------------------------------------------------------
  publicAPI.getDefaultFormat = function (vtktype, numComps) {
    if (model.window.getWebgl2()) {
      switch (numComps) {
        case 1:
          return model.context.RED;
        case 2:
          return model.context.RG;
        case 3:
          return model.context.RGB;
        case 4:
          return model.context.RGBA;
        default:
          return model.context.RGB;
      }
    } else {
      switch (numComps) {
        case 1:
          return model.context.LUMINANCE;
        case 2:
          return model.context.LUMINANCE_ALPHA;
        case 3:
          return model.context.RGB;
        case 4:
          return model.context.RGBA;
        default:
          return model.context.RGB;
      }
    }
  };

  //----------------------------------------------------------------------------
  publicAPI.resetFormatAndType = function () {
    model.format = 0;
    model.internalFormat = 0;
    model.openGLDataType = 0;
  };

  //----------------------------------------------------------------------------
  publicAPI.getDefaultDataType = function (vtkScalarType) {
    // DON'T DEAL with VTK_CHAR as this is platform dependent.
    if (model.window.getWebgl2()) {
      switch (vtkScalarType) {
        // case VtkDataTypes.SIGNED_CHAR:
        //   return model.context.BYTE;
        case _Constants2.VtkDataTypes.UNSIGNED_CHAR:
          return model.context.UNSIGNED_BYTE;
        // case VtkDataTypes.SHORT:
        //   return model.context.SHORT;
        // case VtkDataTypes.UNSIGNED_SHORT:
        //   return model.context.UNSIGNED_SHORT;
        // case VtkDataTypes.INT:
        //   return model.context.INT;
        // case VtkDataTypes.UNSIGNED_INT:
        //   return model.context.UNSIGNED_INT;
        case _Constants2.VtkDataTypes.FLOAT:
        case _Constants2.VtkDataTypes.VOID: // used for depth component textures.
        default:
          return model.context.FLOAT;
      }
    }

    switch (vtkScalarType) {
      // case VtkDataTypes.SIGNED_CHAR:
      //   return model.context.BYTE;
      case _Constants2.VtkDataTypes.UNSIGNED_CHAR:
        return model.context.UNSIGNED_BYTE;
      // case VtkDataTypes.SHORT:
      //   return model.context.SHORT;
      // case VtkDataTypes.UNSIGNED_SHORT:
      //   return model.context.UNSIGNED_SHORT;
      // case VtkDataTypes.INT:
      //   return model.context.INT;
      // case VtkDataTypes.UNSIGNED_INT:
      //   return model.context.UNSIGNED_INT;
      case _Constants2.VtkDataTypes.FLOAT:
      case _Constants2.VtkDataTypes.VOID: // used for depth component textures.
      default:
        if (model.context.getExtension('OES_texture_float') && model.context.getExtension('OES_texture_float_linear')) {
          return model.context.FLOAT;
        }
        return model.context.UNSIGNED_BYTE;
    }
  };

  //----------------------------------------------------------------------------
  publicAPI.getOpenGLDataType = function (vtkScalarType) {
    if (!model.openGLDataType) {
      model.openGLDataType = publicAPI.getDefaultDataType(vtkScalarType);
    }

    return model.openGLDataType;
  };

  publicAPI.getShiftAndScale = function () {
    var shift = 0.0;
    var scale = 1.0;

    // for all float type internal formats
    switch (model.openGLDataType) {
      case model.context.BYTE:
        scale = 127.5;
        shift = scale - 128.0;
        break;
      case model.context.UNSIGNED_BYTE:
        scale = 255.0;
        shift = 0.0;
        break;
      case model.context.SHORT:
        scale = 32767.5;
        shift = scale - 32768.0;
        break;
      case model.context.UNSIGNED_SHORT:
        scale = 65536.0;
        shift = 0.0;
        break;
      case model.context.INT:
        scale = 2147483647.5;
        shift = scale - 2147483648.0;
        break;
      case model.context.UNSIGNED_INT:
        scale = 4294967295.0;
        shift = 0.0;
        break;
      case model.context.FLOAT:
      default:
        break;
    }
    return { shift: shift, scale: scale };
  };

  //----------------------------------------------------------------------------
  publicAPI.getOpenGLFilterMode = function (emode) {
    switch (emode) {
      case _Constants.Filter.NEAREST:
        return model.context.NEAREST;
      case _Constants.Filter.LINEAR:
        return model.context.LINEAR;
      case _Constants.Filter.NEAREST_MIPMAP_NEAREST:
        return model.context.NEAREST_MIPMAP_NEAREST;
      case _Constants.Filter.NEAREST_MIPMAP_LINEAR:
        return model.context.NEAREST_MIPMAP_LINEAR;
      case _Constants.Filter.LINEAR_MIPMAP_NEAREST:
        return model.context.LINEAR_MIPMAP_NEAREST;
      case _Constants.Filter.LINEAR_MIPMAP_LINEAR:
        return model.context.LINEAR_MIPMAP_LINEAR;
      default:
        return model.context.NEAREST;
    }
  };

  //----------------------------------------------------------------------------
  publicAPI.getOpenGLWrapMode = function (vtktype) {
    switch (vtktype) {
      case _Constants.Wrap.CLAMP_TO_EDGE:
        return model.context.CLAMP_TO_EDGE;
      case _Constants.Wrap.REPEAT:
        return model.context.REPEAT;
      case _Constants.Wrap.MIRRORED_REPEAT:
        return model.context.MIRRORED_REPEAT;
      default:
        return model.context.CLAMP_TO_EDGE;
    }
  };

  //----------------------------------------------------------------------------
  function updateArrayDataType(dataType, data) {
    var pixData = [];
    // if the opengl data type is float
    // then the data array must be float
    if (dataType !== _Constants2.VtkDataTypes.FLOAT && model.openGLDataType === model.context.FLOAT) {
      var pixCount = model.width * model.height * model.components;
      for (var idx = 0; idx < data.length; idx++) {
        var newArray = new Float32Array(pixCount);
        for (var i = 0; i < pixCount; i++) {
          newArray[i] = data[idx][i];
        }
        pixData.push(newArray);
      }
    }

    // if the opengl data type is ubyte
    // then the data array must be u8, we currently simply truncate the data
    if (dataType !== _Constants2.VtkDataTypes.UNSIGNED_CHAR && model.openGLDataType === model.context.UNSIGNED_BYTE) {
      var _pixCount = model.width * model.height * model.components;
      for (var _idx = 0; _idx < data.length; _idx++) {
        var _newArray = new Uint8Array(_pixCount);
        for (var _i = 0; _i < _pixCount; _i++) {
          _newArray[_i] = data[_idx][_i];
        }
        pixData.push(_newArray);
      }
    }

    // The output has to be filled
    if (pixData.length === 0) {
      for (var _i2 = 0; _i2 < data.length; _i2++) {
        pixData.push(data[_i2]);
      }
    }

    return pixData;
  }

  //----------------------------------------------------------------------------
  function scaleTextureToHighestPowerOfTwo(data) {
    var pixData = [];
    var width = model.width;
    var height = model.height;
    var numComps = model.components;
    if (data && (!_Math2.default.isPowerOfTwo(width) || !_Math2.default.isPowerOfTwo(height))) {
      // Scale up the texture to the next highest power of two dimensions.
      var newWidth = _Math2.default.nearestPowerOfTwo(width);
      var newHeight = _Math2.default.nearestPowerOfTwo(height);
      var pixCount = newWidth * newHeight * model.components;
      for (var idx = 0; idx < data.length; idx++) {
        if (data[idx] !== null) {
          var newArray = null;
          switch (model.openGLDataType) {
            case model.context.FLOAT:
              newArray = new Float32Array(pixCount);
              break;
            default:
            case model.context.UNSIGNED_BYTE:
              newArray = new Uint8Array(pixCount);
              break;
          }
          var jFactor = height / newHeight;
          var iFactor = width / newWidth;
          for (var j = 0; j < newHeight; j++) {
            var joff = j * newWidth * numComps;
            var jidx = j * jFactor;
            var jlow = Math.floor(jidx);
            var jhi = Math.ceil(jidx);
            if (jhi >= height) {
              jhi = height - 1;
            }
            var jmix = jidx - jlow;
            var jmix1 = 1.0 - jmix;
            jlow = jlow * width * numComps;
            jhi = jhi * width * numComps;
            for (var i = 0; i < newWidth; i++) {
              var ioff = i * numComps;
              var iidx = i * iFactor;
              var ilow = Math.floor(iidx);
              var ihi = Math.ceil(iidx);
              if (ihi >= width) {
                ihi = width - 1;
              }
              var imix = iidx - ilow;
              ilow *= numComps;
              ihi *= numComps;
              for (var c = 0; c < numComps; c++) {
                newArray[joff + ioff + c] = data[idx][jlow + ilow + c] * jmix1 * (1.0 - imix) + data[idx][jlow + ihi + c] * jmix1 * imix + data[idx][jhi + ilow + c] * jmix * (1.0 - imix) + data[idx][jhi + ihi + c] * jmix * imix;
              }
            }
          }
          pixData.push(newArray);
          model.width = newWidth;
          model.height = newHeight;
        } else {
          pixData.push(null);
        }
      }
    }

    // The output has to be filled
    if (pixData.length === 0) {
      for (var _i3 = 0; _i3 < data.length; _i3++) {
        pixData.push(data[_i3]);
      }
    }

    return pixData;
  }

  //----------------------------------------------------------------------------
  publicAPI.create2DFromRaw = function (width, height, numComps, dataType, data) {
    // Now determine the texture parameters using the arguments.
    publicAPI.getOpenGLDataType(dataType);
    publicAPI.getInternalFormat(dataType, numComps);
    publicAPI.getFormat(dataType, numComps);

    if (!model.internalFormat || !model.format || !model.openGLDataType) {
      vtkErrorMacro('Failed to determine texture parameters.');
      return false;
    }

    model.target = model.context.TEXTURE_2D;
    model.components = numComps;
    model.width = width;
    model.height = height;
    model.depth = 1;
    model.numberOfDimensions = 2;
    model.window.activateTexture(publicAPI);
    publicAPI.createTexture();
    publicAPI.bind();

    // Create an array of texture with one texture
    var dataArray = [data];
    var pixData = updateArrayDataType(dataType, dataArray);
    var scaledData = scaleTextureToHighestPowerOfTwo(pixData);

    // Source texture data from the PBO.
    // model.context.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    model.context.pixelStorei(model.context.UNPACK_ALIGNMENT, 1);

    model.context.texImage2D(model.target, 0, model.internalFormat, model.width, model.height, 0, model.format, model.openGLDataType, scaledData[0]);

    if (model.generateMipmap) {
      model.context.generateMipmap(model.target);
    }

    publicAPI.deactivate();
    return true;
  };

  //----------------------------------------------------------------------------
  publicAPI.createCubeFromRaw = function (width, height, numComps, dataType, data) {
    // Now determine the texture parameters using the arguments.
    publicAPI.getOpenGLDataType(dataType);
    publicAPI.getInternalFormat(dataType, numComps);
    publicAPI.getFormat(dataType, numComps);

    if (!model.internalFormat || !model.format || !model.openGLDataType) {
      vtkErrorMacro('Failed to determine texture parameters.');
      return false;
    }

    model.target = model.context.TEXTURE_CUBE_MAP;
    model.components = numComps;
    model.width = width;
    model.height = height;
    model.depth = 1;
    model.numberOfDimensions = 2;
    model.window.activateTexture(publicAPI);
    publicAPI.createTexture();
    publicAPI.bind();

    var pixData = updateArrayDataType(dataType, data);
    var scaledData = scaleTextureToHighestPowerOfTwo(pixData);

    // Source texture data from the PBO.
    model.context.pixelStorei(model.context.UNPACK_ALIGNMENT, 1);

    for (var i = 0; i < 6; i++) {
      if (scaledData[i]) {
        model.context.texImage2D(model.context.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, model.internalFormat, model.width, model.height, 0, model.format, model.openGLDataType, scaledData[i]);
      }
    }

    publicAPI.deactivate();
    return true;
  };

  //----------------------------------------------------------------------------
  publicAPI.createDepthFromRaw = function (width, height, dataType, data) {
    // Now determine the texture parameters using the arguments.
    publicAPI.getOpenGLDataType(dataType);
    model.format = model.context.DEPTH_COMPONENT;
    model.internalFormat = model.context.DEPTH_COMPONENT;

    if (!model.internalFormat || !model.format || !model.openGLDataType) {
      vtkErrorMacro('Failed to determine texture parameters.');
      return false;
    }

    model.target = model.context.TEXTURE_2D;
    model.components = 1;
    model.width = width;
    model.height = height;
    model.depth = 1;
    model.numberOfDimensions = 2;
    model.window.activateTexture(publicAPI);
    publicAPI.createTexture();
    publicAPI.bind();

    // Source texture data from the PBO.
    // model.context.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    model.context.pixelStorei(model.context.UNPACK_ALIGNMENT, 1);

    model.context.texImage2D(model.target, 0, model.internalFormat, model.width, model.height, 0, model.format, model.openGLDataType, data);

    if (model.generateMipmap) {
      model.context.generateMipmap(model.target);
    }

    publicAPI.deactivate();
    return true;
  };

  //----------------------------------------------------------------------------
  publicAPI.create2DFromImage = function (image) {
    // Now determine the texture parameters using the arguments.
    publicAPI.getOpenGLDataType(_Constants2.VtkDataTypes.UNSIGNED_CHAR);
    publicAPI.getInternalFormat(_Constants2.VtkDataTypes.UNSIGNED_CHAR, 4);
    publicAPI.getFormat(_Constants2.VtkDataTypes.UNSIGNED_CHAR, 4);

    if (!model.internalFormat || !model.format || !model.openGLDataType) {
      vtkErrorMacro('Failed to determine texture parameters.');
      return false;
    }

    model.target = model.context.TEXTURE_2D;
    model.components = 4;
    model.width = image.width;
    model.height = image.height;
    model.depth = 1;
    model.numberOfDimensions = 2;
    model.window.activateTexture(publicAPI);
    publicAPI.createTexture();
    publicAPI.bind();

    // Source texture data from the PBO.
    // model.context.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    model.context.pixelStorei(model.context.UNPACK_ALIGNMENT, 1);

    // Scale up the texture to the next highest power of two dimensions (if needed) and flip y.
    var needNearestPowerOfTwo = !_Math2.default.isPowerOfTwo(image.width) || !_Math2.default.isPowerOfTwo(image.height);
    var canvas = document.createElement('canvas');
    canvas.width = needNearestPowerOfTwo ? _Math2.default.nearestPowerOfTwo(image.width) : image.width;
    canvas.height = needNearestPowerOfTwo ? _Math2.default.nearestPowerOfTwo(image.height) : image.height;
    var ctx = canvas.getContext('2d');
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
    ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
    var safeImage = canvas;

    model.context.texImage2D(model.target, 0, model.internalFormat, model.format, model.openGLDataType, safeImage);

    if (model.generateMipmap) {
      model.context.generateMipmap(model.target);
    }

    publicAPI.deactivate();
    return true;
  };

  //----------------------------------------------------------------------------
  publicAPI.create3DFromRaw = function (width, height, depth, numComps, dataType, data) {
    // Now determine the texture parameters using the arguments.
    publicAPI.getOpenGLDataType(dataType);
    publicAPI.getInternalFormat(dataType, numComps);
    publicAPI.getFormat(dataType, numComps);

    if (!model.internalFormat || !model.format || !model.openGLDataType) {
      vtkErrorMacro('Failed to determine texture parameters.');
      return false;
    }

    model.target = model.context.TEXTURE_3D;
    model.components = numComps;
    model.width = width;
    model.height = height;
    model.depth = depth;
    model.numberOfDimensions = 3;
    model.window.activateTexture(publicAPI);
    publicAPI.createTexture();
    publicAPI.bind();

    // Source texture data from the PBO.
    // model.context.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    // model.context.pixelStorei(model.context.UNPACK_ALIGNMENT, 1);

    model.context.texImage3D(model.target, 0, model.internalFormat, model.width, model.height, model.depth, 0, model.format, model.openGLDataType, data);

    if (model.generateMipmap) {
      model.context.generateMipmap(model.target);
    }

    publicAPI.deactivate();
    return true;
  };

  //----------------------------------------------------------------------------
  // This method simulates a 3D texture using 2D
  publicAPI.create3DOneComponentFromRaw = function (width, height, depth, dataType, data) {
    var numPixelsIn = width * height * depth;

    // compute min and max values
    var min = data[0];
    var max = data[0];
    for (var i = 0; i < numPixelsIn; ++i) {
      min = Math.min(min, data[i]);
      max = Math.max(max, data[i]);
    }
    if (min === max) {
      max = min + 1.0;
    }

    // store the information, we will need it later
    model.volumeInfo = { min: min, max: max, width: width, height: height, depth: depth };

    var volCopyData = function volCopyData(outArray, outIdx, inValue, smin, smax) {
      outArray[outIdx] = inValue;
    };
    var dataTypeToUse = _Constants2.VtkDataTypes.UNSIGNED_CHAR;
    var numCompsToUse = 1;
    var encodedScalars = false;
    if (dataType === _Constants2.VtkDataTypes.UNSIGNED_CHAR) {
      model.volumeInfo.min = 0.0;
      model.volumeInfo.max = 255.0;
    } else if (model.window.getWebgl2() || model.context.getExtension('OES_texture_float') && model.context.getExtension('OES_texture_float_linear')) {
      dataTypeToUse = _Constants2.VtkDataTypes.FLOAT;
      volCopyData = function volCopyData(outArray, outIdx, inValue, smin, smax) {
        outArray[outIdx] = (inValue - smin) / (smax - smin);
      };
    } else {
      encodedScalars = true;
      dataTypeToUse = _Constants2.VtkDataTypes.UNSIGNED_CHAR;
      numCompsToUse = 4;
      volCopyData = function volCopyData(outArray, outIdx, inValue, smin, smax) {
        var fval = (inValue - smin) / (smax - smin);
        var r = Math.floor(fval * 255.0);
        fval = fval * 255.0 - r;
        outArray[outIdx] = r;
        var g = Math.floor(fval * 255.0);
        fval = fval * 255.0 - g;
        outArray[outIdx + 1] = g;
        var b = Math.floor(fval * 255.0);
        outArray[outIdx + 2] = b;
      };
    }

    if (model.window.getWebgl2()) {
      if (dataType !== _Constants2.VtkDataTypes.UNSIGNED_CHAR) {
        var _newArray2 = new Float32Array(numPixelsIn);
        for (var _i4 = 0; _i4 < numPixelsIn; ++_i4) {
          _newArray2[_i4] = (data[_i4] - min) / (max - min);
        }
        return publicAPI.create3DFromRaw(width, height, depth, 1, _Constants2.VtkDataTypes.FLOAT, _newArray2);
      }
      return publicAPI.create3DFromRaw(width, height, depth, 1, dataType, data);
    }

    // Now determine the texture parameters using the arguments.
    publicAPI.getOpenGLDataType(dataTypeToUse);
    publicAPI.getInternalFormat(dataTypeToUse, numCompsToUse);
    publicAPI.getFormat(dataTypeToUse, numCompsToUse);

    if (!model.internalFormat || !model.format || !model.openGLDataType) {
      vtkErrorMacro('Failed to determine texture parameters.');
      return false;
    }

    model.target = model.context.TEXTURE_2D;
    model.components = numCompsToUse;
    model.depth = 1;
    model.numberOfDimensions = 2;

    // have to pack this 3D texture into pot 2D texture
    var maxTexDim = model.context.getParameter(model.context.MAX_TEXTURE_SIZE);

    // compute estimate for XY subsample
    var xstride = 1;
    var ystride = 1;
    if (numPixelsIn > maxTexDim * maxTexDim) {
      xstride = Math.ceil(Math.sqrt(numPixelsIn / (maxTexDim * maxTexDim)));
      ystride = xstride;
    }
    var targetWidth = Math.sqrt(numPixelsIn) / xstride;
    targetWidth = _Math2.default.nearestPowerOfTwo(targetWidth);
    // determine X reps
    var xreps = Math.floor(targetWidth * xstride / width);
    var yreps = Math.ceil(depth / xreps);
    var targetHeight = _Math2.default.nearestPowerOfTwo(height * yreps / ystride);

    model.width = targetWidth;
    model.height = targetHeight;
    model.window.activateTexture(publicAPI);
    publicAPI.createTexture();
    publicAPI.bind();

    // store the information, we will need it later
    model.volumeInfo = { encodedScalars: encodedScalars, min: min, max: max, width: width, height: height, depth: depth, xreps: xreps, yreps: yreps, xstride: xstride, ystride: ystride };

    // OK stuff the data into the 2d TEXTURE

    // first allocate the new texture
    var newArray = void 0;
    var pixCount = targetWidth * targetHeight * numCompsToUse;
    if (dataTypeToUse === _Constants2.VtkDataTypes.FLOAT) {
      newArray = new Float32Array(pixCount);
    } else {
      newArray = new Uint8Array(pixCount);
    }

    // then stuff the data into it, nothing fancy right now
    // for stride
    var outIdx = 0;

    for (var yRep = 0; yRep < yreps; yRep++) {
      var xrepsThisRow = Math.min(xreps, depth - yRep * xreps);
      var outXContIncr = model.width - xrepsThisRow * Math.floor(width / xstride);
      for (var inY = 0; inY < height; inY += ystride) {
        for (var xRep = 0; xRep < xrepsThisRow; xRep++) {
          var inOffset = (yRep * xreps + xRep) * width * height + inY * width;
          for (var inX = 0; inX < width; inX += xstride) {
            // copy value
            volCopyData(newArray, outIdx, data[inOffset + inX], min, max);
            outIdx += numCompsToUse;
          }
        }
        outIdx += outXContIncr * numCompsToUse;
      }
    }

    // Source texture data from the PBO.
    // model.context.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    model.context.pixelStorei(model.context.UNPACK_ALIGNMENT, 1);

    model.context.texImage2D(model.target, 0, model.internalFormat, model.width, model.height, 0, model.format, model.openGLDataType, newArray);

    publicAPI.deactivate();
    return true;
  };

  //----------------------------------------------------------------------------
  // This method creates a normal/gradient texture for 3D volume
  // rendering
  publicAPI.create3DLighting = function (scalarTexture, data, spacing) {
    var vinfo = scalarTexture.getVolumeInfo();

    var width = vinfo.width;
    var height = vinfo.height;
    var depth = vinfo.depth;

    // have to compute the gradient to get the normal
    // and magnitude
    var tmpArray = new Float32Array(width * height * depth * 4);

    var inPtr = 0;
    var outPtr = 0;
    var sliceSize = width * height;
    var grad = _glMatrix.vec3.create();
    _glMatrix.vec3.set(grad, (data[inPtr + 1] - data[inPtr]) / spacing[0], (data[inPtr + width] - data[inPtr]) / spacing[1], (data[inPtr + sliceSize] - data[inPtr]) / spacing[2]);
    var minMag = _glMatrix.vec3.length(grad);
    var maxMag = -1.0;
    for (var z = 0; z < depth; ++z) {
      var zedge = 0;
      if (z === depth - 1) {
        zedge = -sliceSize;
      }
      for (var y = 0; y < height; ++y) {
        var yedge = 0;
        if (y === height - 1) {
          yedge = -width;
        }
        for (var x = 0; x < width; ++x) {
          var edge = inPtr + zedge + yedge;
          if (x === width - 1) {
            edge--;
          }
          _glMatrix.vec3.set(grad, (data[edge + 1] - data[edge]) / spacing[0], (data[edge + width] - data[edge]) / spacing[1], (data[edge + sliceSize] - data[edge]) / spacing[2]);

          var mag = _glMatrix.vec3.length(grad);
          minMag = Math.min(mag, minMag);
          maxMag = Math.max(mag, maxMag);

          _glMatrix.vec3.normalize(grad, grad);
          tmpArray[outPtr++] = grad[0];
          tmpArray[outPtr++] = grad[1];
          tmpArray[outPtr++] = grad[2];
          tmpArray[outPtr++] = mag;
          inPtr++;
        }
      }
    }

    // store the information, we will need it later
    model.volumeInfo = { min: minMag, max: maxMag };
    var outIdx = 0;

    if (model.window.getWebgl2()) {
      var numPixelsIn = width * height * depth;
      var _newArray3 = new Uint8Array(numPixelsIn * 4);
      for (var p = 0; p < numPixelsIn; ++p) {
        var pp = p * 4;
        _newArray3[outIdx++] = 127.5 + 127.5 * tmpArray[pp];
        _newArray3[outIdx++] = 127.5 + 127.5 * tmpArray[pp + 1];
        _newArray3[outIdx++] = 127.5 + 127.5 * tmpArray[pp + 2];
        // we encode gradient magnitude using sqrt so that
        // we have nonlinear resolution
        _newArray3[outIdx++] = 255.0 * Math.sqrt(tmpArray[pp + 3] / maxMag);
      }
      return publicAPI.create3DFromRaw(width, height, depth, 4, _Constants2.VtkDataTypes.UNSIGNED_CHAR, _newArray3);
    }

    // Now determine the texture parameters using the arguments.
    publicAPI.getOpenGLDataType(_Constants2.VtkDataTypes.UNSIGNED_CHAR);
    publicAPI.getInternalFormat(_Constants2.VtkDataTypes.UNSIGNED_CHAR, 4);
    publicAPI.getFormat(_Constants2.VtkDataTypes.UNSIGNED_CHAR, 4);

    if (!model.internalFormat || !model.format || !model.openGLDataType) {
      vtkErrorMacro('Failed to determine texture parameters.');
      return false;
    }

    model.target = model.context.TEXTURE_2D;
    model.components = 4;
    model.depth = 1;
    model.numberOfDimensions = 2;

    // now store the computed values into the packed 2D
    // texture using the same packing as volumeInfo
    model.width = scalarTexture.getWidth();
    model.height = scalarTexture.getHeight();
    var newArray = new Uint8Array(model.width * model.height * 4);

    for (var yRep = 0; yRep < vinfo.yreps; yRep++) {
      var xrepsThisRow = Math.min(vinfo.xreps, depth - yRep * vinfo.xreps);
      var outXContIncr = model.width - xrepsThisRow * Math.floor(width / vinfo.xstride);
      for (var inY = 0; inY < height; inY += vinfo.ystride) {
        for (var xRep = 0; xRep < xrepsThisRow; xRep++) {
          var inOffset = 4 * ((yRep * vinfo.xreps + xRep) * width * height + inY * width);
          for (var inX = 0; inX < width; inX += vinfo.xstride) {
            // copy value
            newArray[outIdx++] = 127.5 + 127.5 * tmpArray[inOffset + inX * 4];
            newArray[outIdx++] = 127.5 + 127.5 * tmpArray[inOffset + inX * 4 + 1];
            newArray[outIdx++] = 127.5 + 127.5 * tmpArray[inOffset + inX * 4 + 2];
            // we encode gradient magnitude using sqrt so that
            // we have nonlinear resolution
            newArray[outIdx++] = 255.0 * Math.sqrt(tmpArray[inOffset + inX * 4 + 3] / maxMag);
          }
        }
        outIdx += outXContIncr * 4;
      }
    }

    model.window.activateTexture(publicAPI);
    publicAPI.createTexture();
    publicAPI.bind();

    // Source texture data from the PBO.
    // model.context.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    model.context.pixelStorei(model.context.UNPACK_ALIGNMENT, 1);

    model.context.texImage2D(model.target, 0, model.internalFormat, model.width, model.height, 0, model.format, model.openGLDataType, newArray);

    publicAPI.deactivate();
    return true;
  };

  //----------------------------------------------------------------------------
  publicAPI.getMaximumTextureSize = function (ctx) {
    if (ctx && ctx.isCurrent()) {
      return ctx.getIntegerv(ctx.MAX_TEXTURE_SIZE);
    }

    return -1;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  window: null,
  context: null,
  handle: 0,
  sendParametersTime: null,
  textureBuildTime: null,
  numberOfDimensions: 0,
  target: 0,
  format: 0,
  openGLDataType: 0,
  components: 0,
  width: 0,
  height: 0,
  depth: 0,
  autoParameters: true,
  wrapS: _Constants.Wrap.CLAMP_TO_EDGE,
  wrapT: _Constants.Wrap.CLAMP_TO_EDGE,
  wrapR: _Constants.Wrap.CLAMP_TO_EDGE,
  minificationFilter: _Constants.Filter.NEAREST,
  magnificationFilter: _Constants.Filter.NEAREST,
  minLOD: -1000.0,
  maxLOD: 1000.0,
  baseLevel: 0,
  maxLevel: 0,
  generateMipmap: false
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  _ViewNode2.default.extend(publicAPI, model, initialValues);

  model.sendParametersTime = {};
  _macro2.default.obj(model.sendParametersTime, { mtime: 0 });

  model.textureBuildTime = {};
  _macro2.default.obj(model.textureBuildTime, { mtime: 0 });

  // Build VTK API
  _macro2.default.set(publicAPI, model, ['format', 'openGLDataType']);

  _macro2.default.setGet(publicAPI, model, ['window', 'context', 'keyMatrixTime', 'minificationFilter', 'magnificationFilter', 'wrapS', 'wrapT', 'wrapR', 'generateMipmap']);

  _macro2.default.get(publicAPI, model, ['width', 'height', 'volumeInfo', 'components', 'handle', 'target']);

  // Object methods
  vtkOpenGLTexture(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkOpenGLTexture');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var Wrap = exports.Wrap = {
  CLAMP_TO_EDGE: 0,
  REPEAT: 1,
  MIRRORED_REPEAT: 2
};

var Filter = exports.Filter = {
  NEAREST: 0,
  LINEAR: 1,
  NEAREST_MIPMAP_NEAREST: 2,
  NEAREST_MIPMAP_LINEAR: 3,
  LINEAR_MIPMAP_NEAREST: 4,
  LINEAR_MIPMAP_LINEAR: 5
};

exports.default = {
  Wrap: Wrap,
  Filter: Filter
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var ObjectType = exports.ObjectType = {
  ARRAY_BUFFER: 0,
  ELEMENT_ARRAY_BUFFER: 1,
  TEXTURE_BUFFER: 2
};

exports.default = {
  ObjectType: ObjectType
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var Shading = exports.Shading = {
  FLAT: 0,
  GOURAUD: 1,
  PHONG: 2
};

var Representation = exports.Representation = {
  POINTS: 0,
  WIREFRAME: 1,
  SURFACE: 2
};

var Interpolation = exports.Interpolation = Shading;

exports.default = {
  Shading: Shading,
  Representation: Representation,
  Interpolation: Interpolation
};

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = "//VTK::System::Dec\n\n/*=========================================================================\n\n  Program:   Visualization Toolkit\n  Module:    vtkPolyDataFS.glsl\n\n  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen\n  All rights reserved.\n  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.\n\n     This software is distributed WITHOUT ANY WARRANTY; without even\n     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR\n     PURPOSE.  See the above copyright notice for more information.\n\n=========================================================================*/\n// Template for the polydata mappers fragment shader\n\nuniform int PrimitiveIDOffset;\n\n// VC position of this fragment\n//VTK::PositionVC::Dec\n\n// optional color passed in from the vertex shader, vertexColor\n//VTK::Color::Dec\n\n// optional surface normal declaration\n//VTK::Normal::Dec\n\n// extra lighting parameters\n//VTK::Light::Dec\n\n// Texture coordinates\n//VTK::TCoord::Dec\n\n// picking support\n//VTK::Picking::Dec\n\n// Depth Peeling Support\n//VTK::DepthPeeling::Dec\n\n// clipping plane vars\n//VTK::Clip::Dec\n\n// the output of this shader\n//VTK::Output::Dec\n\n// Apple Bug\n//VTK::PrimID::Dec\n\n// handle coincident offsets\n//VTK::Coincident::Dec\n\nvoid main()\n{\n  // VC position of this fragment. This should not branch/return/discard.\n  //VTK::PositionVC::Impl\n\n  // Place any calls that require uniform flow (e.g. dFdx) here.\n  //VTK::UniformFlow::Impl\n\n  // Set gl_FragDepth here (gl_FragCoord.z by default)\n  //VTK::Depth::Impl\n\n  // Early depth peeling abort:\n  //VTK::DepthPeeling::PreColor\n\n  // Apple Bug\n  //VTK::PrimID::Impl\n\n  //VTK::Clip::Impl\n\n  //VTK::Color::Impl\n\n  // Generate the normal if we are not passed in one\n  //VTK::Normal::Impl\n\n  //VTK::Light::Impl\n\n  //VTK::TCoord::Impl\n\n  if (gl_FragData[0].a <= 0.0)\n    {\n    discard;\n    }\n\n  //VTK::DepthPeeling::Impl\n\n  //VTK::Picking::Impl\n\n  // handle coincident offsets\n  //VTK::Coincident::Impl\n\n  //VTK::ZBuffer::Impl\n}\n"

/***/ }),
/* 17 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _CellArrayBufferObject = __webpack_require__(66);

var _CellArrayBufferObject2 = _interopRequireDefault(_CellArrayBufferObject);

var _ShaderProgram = __webpack_require__(8);

var _ShaderProgram2 = _interopRequireDefault(_ShaderProgram);

var _VertexArrayObject = __webpack_require__(30);

var _VertexArrayObject2 = _interopRequireDefault(_VertexArrayObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------------------------------------------------------------
// vtkOpenGLHelper methods
// ----------------------------------------------------------------------------

function vtkOpenGLHelper(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkOpenGLHelper');

  publicAPI.setContext = function (ctx) {
    model.program.setContext(ctx);
    model.VAO.setContext(ctx);
    model.CABO.setContext(ctx);
  };

  publicAPI.releaseGraphicsResources = function (oglwin) {
    model.VAO.releaseGraphicsResources();
    model.CABO.releaseGraphicsResources();
    model.CABO.setElementCount(0);
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  program: null,
  shaderSourceTime: null,
  VAO: null,
  attributeUpdateTime: null,
  CABO: null,
  primitiveType: 0
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  _macro2.default.obj(publicAPI, model);

  model.shaderSourceTime = {};
  _macro2.default.obj(model.shaderSourceTime);

  model.attributeUpdateTime = {};
  _macro2.default.obj(model.attributeUpdateTime);

  _macro2.default.setGet(publicAPI, model, ['program', 'shaderSourceTime', 'VAO', 'attributeUpdateTime', 'CABO', 'primitiveType']);

  model.program = _ShaderProgram2.default.newInstance();
  model.VAO = _VertexArrayObject2.default.newInstance();
  model.CABO = _CellArrayBufferObject2.default.newInstance();

  // Object methods
  vtkOpenGLHelper(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend);

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = exports.STATIC = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var macro = _interopRequireWildcard(_macro);

var _Constants = __webpack_require__(14);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// ----------------------------------------------------------------------------
// Global methods
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Static API
// ----------------------------------------------------------------------------

var STATIC = exports.STATIC = {};

// ----------------------------------------------------------------------------
// vtkOpenGLBufferObject methods
// ----------------------------------------------------------------------------

function vtkOpenGLBufferObject(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkOpenGLBufferObject');

  // Class-specific private functions
  function convertType(type) {
    switch (type) {
      case _Constants.ObjectType.ELEMENT_ARRAY_BUFFER:
        return model.context.ELEMENT_ARRAY_BUFFER;
      case _Constants.ObjectType.TEXTURE_BUFFER:
        if ('TEXTURE_BUFFER' in model.context) {
          return model.context.TEXTURE_BUFFER;
        }
      /* eslint-disable no-fallthrough */
      // Intentional fallthrough in case there is no TEXTURE_BUFFER in WebGL
      default:
      /* eslint-enable no-fallthrough */
      case _Constants.ObjectType.ARRAY_BUFFER:
        return model.context.ARRAY_BUFFER;
    }
  }

  var internalType = null;
  var internalHandle = null;
  var dirty = true;
  var error = '';

  // Public API methods
  publicAPI.getType = function () {
    return internalType;
  };

  publicAPI.setType = function (value) {
    internalType = value;
  };

  publicAPI.getHandle = function () {
    return internalHandle;
  };
  publicAPI.isReady = function () {
    return dirty === false;
  };

  publicAPI.generateBuffer = function (type) {
    var objectTypeGL = convertType(type);
    if (internalHandle === null) {
      internalHandle = model.context.createBuffer();
      internalType = type;
    }
    return convertType(internalType) === objectTypeGL;
  };

  publicAPI.upload = function (data, type) {
    // buffer, size, type
    var alreadyGenerated = publicAPI.generateBuffer(type);
    if (!alreadyGenerated) {
      error = 'Trying to upload array buffer to incompatible buffer.';
      return false;
    }
    model.context.bindBuffer(convertType(internalType), internalHandle);
    model.context.bufferData(convertType(internalType), data, model.context.STATIC_DRAW);
    dirty = false;
    return true;
  };

  publicAPI.bind = function () {
    if (!internalHandle) {
      return false;
    }
    model.context.bindBuffer(convertType(internalType), internalHandle);
    return true;
  };

  publicAPI.release = function () {
    if (!internalHandle) {
      return false;
    }
    model.context.bindBuffer(convertType(internalType), null);
    return true;
  };

  publicAPI.releaseGraphicsResources = function () {
    if (internalHandle !== null) {
      model.context.bindBuffer(convertType(internalType), null);
      model.context.deleteBuffer(internalHandle);
      internalHandle = null;
    }
  };

  publicAPI.getError = function () {
    return error;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  objectType: _Constants.ObjectType.ARRAY_BUFFER,
  context: null
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  macro.obj(publicAPI, model);

  macro.setGet(publicAPI, model, ['context']);

  vtkOpenGLBufferObject(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = macro.newInstance(extend);

// ----------------------------------------------------------------------------

exports.default = Object.assign({ newInstance: newInstance, extend: extend }, STATIC);

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _glMatrix = __webpack_require__(2);

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _Helper = __webpack_require__(18);

var _Helper2 = _interopRequireDefault(_Helper);

var _Math = __webpack_require__(1);

var _Math2 = _interopRequireDefault(_Math);

var _ShaderProgram = __webpack_require__(8);

var _ShaderProgram2 = _interopRequireDefault(_ShaderProgram);

var _Texture = __webpack_require__(12);

var _Texture2 = _interopRequireDefault(_Texture);

var _ViewNode = __webpack_require__(3);

var _ViewNode2 = _interopRequireDefault(_ViewNode);

var _Constants = __webpack_require__(15);

var _Constants2 = __webpack_require__(21);

var _Constants3 = __webpack_require__(13);

var _Constants4 = __webpack_require__(70);

var _vtkPolyDataVS = __webpack_require__(31);

var _vtkPolyDataVS2 = _interopRequireDefault(_vtkPolyDataVS);

var _vtkPolyDataFS = __webpack_require__(16);

var _vtkPolyDataFS2 = _interopRequireDefault(_vtkPolyDataFS);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-lonely-if */

var primTypes = {
  Start: 0,
  Points: 0,
  Lines: 1,
  Tris: 2,
  TriStrips: 3,
  TrisEdges: 4,
  TriStripsEdges: 5,
  End: 6
};

var vtkErrorMacro = _macro2.default.vtkErrorMacro;

// ----------------------------------------------------------------------------
// vtkOpenGLPolyDataMapper methods
// ----------------------------------------------------------------------------

function vtkOpenGLPolyDataMapper(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkOpenGLPolyDataMapper');

  // Renders myself
  publicAPI.translucentPass = function (prepass) {
    if (prepass) {
      publicAPI.render();
    }
  };

  publicAPI.opaqueZBufferPass = function (prepass) {
    if (prepass) {
      model.renderDepth = true;
      publicAPI.render();
      model.renderDepth = false;
    }
  };

  publicAPI.opaquePass = function (prepass) {
    if (prepass) {
      publicAPI.render();
    }
  };

  publicAPI.render = function () {
    model.openGLRenderWindow = publicAPI.getFirstAncestorOfType('vtkOpenGLRenderWindow');
    model.context = model.openGLRenderWindow.getContext();
    for (var i = primTypes.Start; i < primTypes.End; i++) {
      model.primitives[i].setContext(model.context);
    }
    model.openGLActor = publicAPI.getFirstAncestorOfType('vtkOpenGLActor');
    var actor = model.openGLActor.getRenderable();
    model.openGLRenderer = publicAPI.getFirstAncestorOfType('vtkOpenGLRenderer');
    var ren = model.openGLRenderer.getRenderable();
    model.openGLCamera = model.openGLRenderer.getViewNodeFor(ren.getActiveCamera());
    publicAPI.renderPiece(ren, actor);
  };

  publicAPI.buildShaders = function (shaders, ren, actor) {
    publicAPI.getShaderTemplate(shaders, ren, actor);

    // user specified pre replacements
    var openGLSpec = model.renderable.getViewSpecificProperties().OpenGL;
    var shaderReplacements = null;
    if (openGLSpec) {
      shaderReplacements = openGLSpec.ShaderReplacements;
    }

    if (shaderReplacements) {
      for (var i = 0; i < shaderReplacements.length; i++) {
        var currReplacement = shaderReplacements[i];
        if (currReplacement.replaceFirst) {
          var shaderType = currReplacement.shaderType;
          var ssrc = shaders[shaderType];
          var substituteRes = _ShaderProgram2.default.substitute(ssrc, currReplacement.originalValue, currReplacement.replacementValue, currReplacement.replaceAll);
          shaders[shaderType] = substituteRes.result;
        }
      }
    }

    publicAPI.replaceShaderValues(shaders, ren, actor);

    // user specified post replacements
    if (shaderReplacements) {
      for (var _i = 0; _i < shaderReplacements.length; _i++) {
        var _currReplacement = shaderReplacements[_i];
        if (!_currReplacement.replaceFirst) {
          var _shaderType = _currReplacement.shaderType;
          var _ssrc = shaders[_shaderType];
          var _substituteRes = _ShaderProgram2.default.substitute(_ssrc, _currReplacement.originalValue, _currReplacement.replacementValue, _currReplacement.replaceAll);
          shaders[_shaderType] = _substituteRes.result;
        }
      }
    }
  };

  publicAPI.getShaderTemplate = function (shaders, ren, actor) {
    var openGLSpecProp = model.renderable.getViewSpecificProperties().OpenGL;

    var vertexShaderCode = _vtkPolyDataVS2.default;
    if (openGLSpecProp) {
      var vertexSpecProp = openGLSpecProp.VertexShaderCode;
      if (vertexSpecProp !== undefined && vertexSpecProp !== '') {
        vertexShaderCode = vertexSpecProp;
      }
    }
    shaders.Vertex = vertexShaderCode;

    var fragmentShaderCode = _vtkPolyDataFS2.default;
    if (openGLSpecProp) {
      var fragmentSpecProp = openGLSpecProp.FragmentShaderCode;
      if (fragmentSpecProp !== undefined && fragmentSpecProp !== '') {
        fragmentShaderCode = fragmentSpecProp;
      }
    }
    shaders.Fragment = fragmentShaderCode;

    var geometryShaderCode = '';
    if (openGLSpecProp) {
      var geometrySpecProp = openGLSpecProp.GeometryShaderCode;
      if (geometrySpecProp !== undefined) {
        geometryShaderCode = geometrySpecProp;
      }
    }
    shaders.Geometry = geometryShaderCode;
  };

  publicAPI.replaceShaderColor = function (shaders, ren, actor) {
    var VSSource = shaders.Vertex;
    var GSSource = shaders.Geometry;
    var FSSource = shaders.Fragment;

    var lastLightComplexity = model.lastBoundBO.get('lastLightComplexity').lastLightComplexity;

    // create the material/color property declarations, and VS implementation
    // these are always defined
    var colorDec = ['uniform float opacityUniform; // the fragment opacity', 'uniform vec3 ambientColorUniform; // intensity weighted color', 'uniform vec3 diffuseColorUniform; // intensity weighted color'];
    // add more for specular
    if (lastLightComplexity) {
      colorDec = colorDec.concat(['uniform vec3 specularColorUniform; // intensity weighted color', 'uniform float specularPowerUniform;']);
    }

    // now handle the more complex fragment shader implementation
    // the following are always defined variables.  We start
    // by assiging a default value from the uniform
    var colorImpl = ['vec3 ambientColor;', '  vec3 diffuseColor;', '  float opacity;'];
    if (lastLightComplexity) {
      colorImpl = colorImpl.concat(['  vec3 specularColor;', '  float specularPower;']);
    }
    colorImpl = colorImpl.concat(['  ambientColor = ambientColorUniform;', '  diffuseColor = diffuseColorUniform;', '  opacity = opacityUniform;']);
    if (lastLightComplexity) {
      colorImpl = colorImpl.concat(['  specularColor = specularColorUniform;', '  specularPower = specularPowerUniform;']);
    }

    // add scalar vertex coloring
    if (model.lastBoundBO.getCABO().getColorComponents() !== 0 && !model.drawingEdges) {
      colorDec = colorDec.concat(['varying vec4 vertexColorVSOutput;']);
      VSSource = _ShaderProgram2.default.substitute(VSSource, '//VTK::Color::Dec', ['attribute vec4 scalarColor;', 'varying vec4 vertexColorVSOutput;']).result;
      VSSource = _ShaderProgram2.default.substitute(VSSource, '//VTK::Color::Impl', ['vertexColorVSOutput =  scalarColor;']).result;
      GSSource = _ShaderProgram2.default.substitute(GSSource, '//VTK::Color::Dec', ['in vec4 vertexColorVSOutput[];', 'out vec4 vertexColorGSOutput;']).result;
      GSSource = _ShaderProgram2.default.substitute(GSSource, '//VTK::Color::Impl', ['vertexColorGSOutput = vertexColorVSOutput[i];']).result;
    }

    var scalarMatMode = model.renderable.getScalarMaterialMode();

    if (model.lastBoundBO.getCABO().getColorComponents() !== 0 && !model.drawingEdges) {
      if (scalarMatMode === _Constants2.MaterialMode.AMBIENT || scalarMatMode === _Constants2.MaterialMode.DEFAULT && actor.getProperty().getAmbient() > actor.getProperty().getDiffuse()) {
        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Color::Impl', colorImpl.concat(['  ambientColor = vertexColorVSOutput.rgb;', '  opacity = opacity*vertexColorVSOutput.a;'])).result;
      } else if (scalarMatMode === _Constants2.MaterialMode.DIFFUSE || scalarMatMode === _Constants2.MaterialMode.DEFAULT && actor.getProperty().getAmbient() <= actor.getProperty().getDiffuse()) {
        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Color::Impl', colorImpl.concat(['  diffuseColor = vertexColorVSOutput.rgb;', '  opacity = opacity*vertexColorVSOutput.a;'])).result;
      } else {
        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Color::Impl', colorImpl.concat(['  diffuseColor = vertexColorVSOutput.rgb;', '  ambientColor = vertexColorVSOutput.rgb;', '  opacity = opacity*vertexColorVSOutput.a;'])).result;
      }
    } else {
      if (model.renderable.getInterpolateScalarsBeforeMapping() && model.renderable.getColorCoordinates() && !model.drawingEdges) {
        if (scalarMatMode === _Constants2.MaterialMode.AMBIENT || scalarMatMode === _Constants2.MaterialMode.DEFAULT && actor.getProperty().getAmbient() > actor.getProperty().getDiffuse()) {
          FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Color::Impl', colorImpl.concat(['  vec4 texColor = texture2D(texture1, tcoordVCVSOutput.st);', '  ambientColor = texColor.rgb;', '  opacity = opacity*texColor.a;'])).result;
        } else if (scalarMatMode === _Constants2.MaterialMode.DIFFUSE || scalarMatMode === _Constants2.MaterialMode.DEFAULT && actor.getProperty().getAmbient() <= actor.getProperty().getDiffuse()) {
          FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Color::Impl', colorImpl.concat(['  vec4 texColor = texture2D(texture1, tcoordVCVSOutput.st);', '  diffuseColor = texColor.rgb;', '  opacity = opacity*texColor.a;'])).result;
        } else {
          FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Color::Impl', colorImpl.concat(['  vec4 texColor = texture2D(texture1, tcoordVCVSOutput.st);', '  diffuseColor = texColor.rgb;', '  ambientColor = texColor.rgb;', '  opacity = opacity*texColor.a;'])).result;
        }
      } else {
        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Color::Impl', colorImpl).result;
      }
    }

    FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Color::Dec', colorDec).result;

    shaders.Vertex = VSSource;
    shaders.Geometry = GSSource;
    shaders.Fragment = FSSource;
  };

  publicAPI.replaceShaderLight = function (shaders, ren, actor) {
    var FSSource = shaders.Fragment;

    // check for shadow maps
    var shadowFactor = '';

    var lastLightComplexity = model.lastBoundBO.get('lastLightComplexity').lastLightComplexity;

    var lastLightCount = model.lastBoundBO.get('lastLightCount').lastLightCount;

    var sstring = [];

    switch (lastLightComplexity) {
      case 0:
        // no lighting or RENDER_VALUES
        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Light::Impl', ['  gl_FragData[0] = vec4(ambientColor + diffuseColor, opacity);', '  //VTK::Light::Impl'], false).result;
        break;

      case 1:
        // headlight
        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Light::Impl', ['  float df = max(0.0, normalVCVSOutput.z);', '  float sf = pow(df, specularPower);', '  vec3 diffuse = df * diffuseColor;', '  vec3 specular = sf * specularColor;', '  gl_FragData[0] = vec4(ambientColor + diffuse + specular, opacity);', '  //VTK::Light::Impl'], false).result;
        break;

      case 2:
        // light kit
        for (var lc = 0; lc < lastLightCount; ++lc) {
          sstring = sstring.concat(['uniform vec3 lightColor' + lc + ';', 'uniform vec3 lightDirectionVC' + lc + '; // normalized', 'uniform vec3 lightHalfAngleVC' + lc + '; // normalized']);
        }
        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Light::Dec', sstring).result;

        sstring = ['vec3 diffuse = vec3(0,0,0);', '  vec3 specular = vec3(0,0,0);', '  float df;'];
        for (var _lc = 0; _lc < lastLightCount; ++_lc) {
          sstring = sstring.concat(['  df = max(0.0, dot(normalVCVSOutput, -lightDirectionVC' + _lc + '));', '  diffuse += ((df' + shadowFactor + ') * lightColor' + _lc + ');', '  if (dot(normalVCVSOutput, lightDirectionVC' + _lc + ') < 0.0)', '    {', '    float sf = pow( max(0.0, dot(lightHalfAngleVC' + _lc + ',normalVCVSOutput)), specularPower);', '    specular += ((sf' + shadowFactor + ') * lightColor' + _lc + ');', '    }']);
        }
        sstring = sstring.concat(['  diffuse = diffuse * diffuseColor;', '  specular = specular * specularColor;', '  gl_FragData[0] = vec4(ambientColor + diffuse + specular, opacity);', '  //VTK::Light::Impl']);
        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Light::Impl', sstring, false).result;
        break;

      case 3:
        // positional
        for (var _lc2 = 0; _lc2 < lastLightCount; ++_lc2) {
          sstring = sstring.concat(['uniform vec3 lightColor' + _lc2 + ';', 'uniform vec3 lightDirectionVC' + _lc2 + '; // normalized', 'uniform vec3 lightHalfAngleVC' + _lc2 + '; // normalized', 'uniform vec3 lightPositionVC' + _lc2 + ';', 'uniform vec3 lightAttenuation' + _lc2 + ';', 'uniform float lightConeAngle' + _lc2 + ';', 'uniform float lightExponent' + _lc2 + ';', 'uniform int lightPositional' + _lc2 + ';']);
        }
        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Light::Dec', sstring).result;

        sstring = ['vec3 diffuse = vec3(0,0,0);', '  vec3 specular = vec3(0,0,0);', '  vec3 vertLightDirectionVC;', '  float attenuation;', '  float df;'];
        for (var _lc3 = 0; _lc3 < lastLightCount; ++_lc3) {
          sstring = sstring.concat(['  attenuation = 1.0;', '  if (lightPositional' + _lc3 + ' == 0)', '    {', '      vertLightDirectionVC = lightDirectionVC' + _lc3 + ';', '    }', '  else', '    {', '    vertLightDirectionVC = vertexVC.xyz - lightPositionVC' + _lc3 + ';', '    float distanceVC = length(vertLightDirectionVC);', '    vertLightDirectionVC = normalize(vertLightDirectionVC);', '    attenuation = 1.0 /', '      (lightAttenuation' + _lc3 + '.x', '       + lightAttenuation' + _lc3 + '.y * distanceVC', '       + lightAttenuation' + _lc3 + '.z * distanceVC * distanceVC);', '    // per OpenGL standard cone angle is 90 or less for a spot light', '    if (lightConeAngle' + _lc3 + ' <= 90.0)', '      {', '      float coneDot = dot(vertLightDirectionVC, lightDirectionVC' + _lc3 + ');', '      // if inside the cone', '      if (coneDot >= cos(radians(lightConeAngle' + _lc3 + ')))', '        {', '        attenuation = attenuation * pow(coneDot, lightExponent' + _lc3 + ');', '        }', '      else', '        {', '        attenuation = 0.0;', '        }', '      }', '    }', '    df = max(0.0, attenuation*dot(normalVCVSOutput, -vertLightDirectionVC));', '    diffuse += ((df' + shadowFactor + ') * lightColor' + _lc3 + ');', '    if (dot(normalVCVSOutput, vertLightDirectionVC) < 0.0)', '      {', '      float sf = attenuation*pow( max(0.0, dot(lightHalfAngleVC' + _lc3 + ',normalVCVSOutput)), specularPower);', '    specular += ((sf' + shadowFactor + ') * lightColor' + _lc3 + ');', '    }']);
        }
        sstring = sstring.concat(['  diffuse = diffuse * diffuseColor;', '  specular = specular * specularColor;', '  gl_FragData[0] = vec4(ambientColor + diffuse + specular, opacity);', '  //VTK::Light::Impl']);
        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Light::Impl', sstring, false).result;
        break;
      default:
        vtkErrorMacro('bad light complexity');
    }

    shaders.Fragment = FSSource;
  };

  publicAPI.replaceShaderNormal = function (shaders, ren, actor) {
    var lastLightComplexity = model.lastBoundBO.get('lastLightComplexity').lastLightComplexity;

    if (lastLightComplexity > 0) {
      var VSSource = shaders.Vertex;
      var GSSource = shaders.Geometry;
      var FSSource = shaders.Fragment;

      if (model.lastBoundBO.getCABO().getNormalOffset()) {
        VSSource = _ShaderProgram2.default.substitute(VSSource, '//VTK::Normal::Dec', ['attribute vec3 normalMC;', 'uniform mat3 normalMatrix;', 'varying vec3 normalVCVSOutput;']).result;
        VSSource = _ShaderProgram2.default.substitute(VSSource, '//VTK::Normal::Impl', ['normalVCVSOutput = normalMatrix * normalMC;']).result;
        GSSource = _ShaderProgram2.default.substitute(GSSource, '//VTK::Normal::Dec', ['in vec3 normalVCVSOutput[];', 'out vec3 normalVCGSOutput;']).result;
        GSSource = _ShaderProgram2.default.substitute(GSSource, '//VTK::Normal::Impl', ['normalVCGSOutput = normalVCVSOutput[i];']).result;
        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Normal::Dec', ['varying vec3 normalVCVSOutput;']).result;
        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Normal::Impl', ['vec3 normalVCVSOutput = normalize(normalVCVSOutput);',
        //  if (!gl_FrontFacing) does not work in intel hd4000 mac
        //  if (int(gl_FrontFacing) == 0) does not work on mesa
        '  if (gl_FrontFacing == false) { normalVCVSOutput = -normalVCVSOutput; }']).result;
      } else {
        if (model.haveCellNormals) {
          FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Normal::Dec', ['uniform mat3 normalMatrix;', 'uniform samplerBuffer textureN;']).result;
          FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Normal::Impl', ['vec3 normalVCVSOutput = normalize(normalMatrix *', '    texelFetchBuffer(textureN, gl_PrimitiveID + PrimitiveIDOffset).xyz);', '  if (gl_FrontFacing == false) { normalVCVSOutput = -normalVCVSOutput; }']).result;
        } else {
          if (publicAPI.getOpenGLMode(actor.getProperty().getRepresentation(), model.lastBoundBO.getPrimitiveType()) === model.context.LINES) {
            // generate a normal for lines, it will be perpendicular to the line
            // and maximally aligned with the camera view direction
            // no clue if this is the best way to do this.
            // the code below has been optimized a bit so what follows is
            // an explanation of the basic approach. Compute the gradient of the line
            // with respect to x and y, the the larger of the two
            // cross that with the camera view direction. That gives a vector
            // orthogonal to the camera view and the line. Note that the line and the camera
            // view are probably not orthogonal. Which is why when we cross result that with
            // the line gradient again we get a reasonable normal. It will be othogonal to
            // the line (which is a plane but maximally aligned with the camera view.
            FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::UniformFlow::Impl', ['  vec3 fdx = vec3(dFdx(vertexVC.x),dFdx(vertexVC.y),dFdx(vertexVC.z));', '  vec3 fdy = vec3(dFdy(vertexVC.x),dFdy(vertexVC.y),dFdy(vertexVC.z));', '  //VTK::UniformFlow::Impl'] // For further replacements
            ).result;
            FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Normal::Impl', ['vec3 normalVCVSOutput;', '  fdx = normalize(fdx);', '  fdy = normalize(fdy);', '  if (abs(fdx.x) > 0.0)', '    { normalVCVSOutput = normalize(cross(vec3(fdx.y, -fdx.x, 0.0), fdx)); }', '  else { normalVCVSOutput = normalize(cross(vec3(fdy.y, -fdy.x, 0.0), fdy));}']).result;
          } else {
            FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Normal::Dec', ['uniform int cameraParallel;']).result;

            FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::UniformFlow::Impl', [
            // '  vec3 fdx = vec3(dFdx(vertexVC.x),dFdx(vertexVC.y),dFdx(vertexVC.z));',
            // '  vec3 fdy = vec3(dFdy(vertexVC.x),dFdy(vertexVC.y),dFdy(vertexVC.z));',
            '  vec3 fdx = dFdx(vertexVC.xyz);', '  vec3 fdy = dFdy(vertexVC.xyz);', '  //VTK::UniformFlow::Impl'] // For further replacements
            ).result;
            FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Normal::Impl', ['  fdx = normalize(fdx);', '  fdy = normalize(fdy);', '  vec3 normalVCVSOutput = normalize(cross(fdx,fdy));',
            // the code below is faster, but does not work on some devices
            // 'vec3 normalVC = normalize(cross(dFdx(vertexVC.xyz), dFdy(vertexVC.xyz)));',
            '  if (cameraParallel == 1 && normalVCVSOutput.z < 0.0) { normalVCVSOutput = -1.0*normalVCVSOutput; }', '  if (cameraParallel == 0 && dot(normalVCVSOutput,vertexVC.xyz) > 0.0) { normalVCVSOutput = -1.0*normalVCVSOutput; }']).result;
          }
        }
      }
      shaders.Vertex = VSSource;
      shaders.Geometry = GSSource;
      shaders.Fragment = FSSource;
    }
  };

  publicAPI.replaceShaderPositionVC = function (shaders, ren, actor) {
    var VSSource = shaders.Vertex;
    var GSSource = shaders.Geometry;
    var FSSource = shaders.Fragment;

    // for points make sure to add in the point size
    if (actor.getProperty().getRepresentation() === _Constants.Representation.POINTS || model.lastBoundBO.getPrimitiveType() === primTypes.Points) {
      VSSource = _ShaderProgram2.default.substitute(VSSource, '//VTK::PositionVC::Impl', ['//VTK::PositionVC::Impl', '  gl_PointSize = ' + actor.getProperty().getPointSize().toFixed(1) + ';'], false).result;
    }

    // do we need the vertex in the shader in View Coordinates
    var lastLightComplexity = model.lastBoundBO.get('lastLightComplexity').lastLightComplexity;
    if (lastLightComplexity > 0) {
      VSSource = _ShaderProgram2.default.substitute(VSSource, '//VTK::PositionVC::Dec', ['varying vec4 vertexVCVSOutput;']).result;
      VSSource = _ShaderProgram2.default.substitute(VSSource, '//VTK::PositionVC::Impl', ['vertexVCVSOutput = MCVCMatrix * vertexMC;', '  gl_Position = MCDCMatrix * vertexMC;']).result;
      VSSource = _ShaderProgram2.default.substitute(VSSource, '//VTK::Camera::Dec', ['uniform mat4 MCDCMatrix;', 'uniform mat4 MCVCMatrix;']).result;
      GSSource = _ShaderProgram2.default.substitute(GSSource, '//VTK::PositionVC::Dec', ['in vec4 vertexVCVSOutput[];', 'out vec4 vertexVCGSOutput;']).result;
      GSSource = _ShaderProgram2.default.substitute(GSSource, '//VTK::PositionVC::Impl', ['vertexVCGSOutput = vertexVCVSOutput[i];']).result;
      FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::PositionVC::Dec', ['varying vec4 vertexVCVSOutput;']).result;
      FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::PositionVC::Impl', ['vec4 vertexVC = vertexVCVSOutput;']).result;
    } else {
      VSSource = _ShaderProgram2.default.substitute(VSSource, '//VTK::Camera::Dec', ['uniform mat4 MCDCMatrix;']).result;
      VSSource = _ShaderProgram2.default.substitute(VSSource, '//VTK::PositionVC::Impl', ['  gl_Position = MCDCMatrix * vertexMC;']).result;
    }
    shaders.Vertex = VSSource;
    shaders.Geometry = GSSource;
    shaders.Fragment = FSSource;
  };

  publicAPI.replaceShaderTCoord = function (shaders, ren, actor) {
    if (model.lastBoundBO.getCABO().getTCoordOffset()) {
      var VSSource = shaders.Vertex;
      var GSSource = shaders.Geometry;
      var FSSource = shaders.Fragment;

      if (model.drawingEdges) {
        return;
      }

      VSSource = _ShaderProgram2.default.substitute(VSSource, '//VTK::TCoord::Impl', 'tcoordVCVSOutput = tcoordMC;').result;

      // we only handle the first texture by default
      // additional textures are activated and we set the uniform
      // for the texture unit they are assigned to, but you have to
      // add in the shader code to do something with them
      var tus = model.openGLActor.getActiveTextures();
      var tNumComp = 2;
      var tcdim = 2;
      if (tus.length > 0) {
        tNumComp = tus[0].getComponents();
        if (tus[0].getTarget() === model.context.TEXTURE_CUBE_MAP) {
          tcdim = 3;
        }
      }
      if (model.renderable.getColorTextureMap()) {
        tNumComp = model.renderable.getColorTextureMap().getPointData().getScalars().getNumberOfComponents();
        tcdim = 2;
      }

      if (tcdim === 2) {
        VSSource = _ShaderProgram2.default.substitute(VSSource, '//VTK::TCoord::Dec', 'attribute vec2 tcoordMC; varying vec2 tcoordVCVSOutput;').result;
        GSSource = _ShaderProgram2.default.substitute(GSSource, '//VTK::TCoord::Dec', ['in vec2 tcoordVCVSOutput[];', 'out vec2 tcoordVCGSOutput;']).result;
        GSSource = _ShaderProgram2.default.substitute(GSSource, '//VTK::TCoord::Impl', 'tcoordVCGSOutput = tcoordVCVSOutput[i];').result;
        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::TCoord::Dec', ['varying vec2 tcoordVCVSOutput;', 'uniform sampler2D texture1;']).result;
        switch (tNumComp) {
          case 1:
            FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::TCoord::Impl', ['vec4 tcolor = texture2D(texture1, tcoordVCVSOutput);', 'gl_FragData[0] = clamp(gl_FragData[0],0.0,1.0)*', '  vec4(tcolor.r,tcolor.r,tcolor.r,1.0);']).result;
            break;
          case 2:
            FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::TCoord::Impl', ['vec4 tcolor = texture2D(texture1, tcoordVCVSOutput);', 'gl_FragData[0] = clamp(gl_FragData[0],0.0,1.0)*', '  vec4(tcolor.r,tcolor.r,tcolor.r,tcolor.g);']).result;
            break;
          default:
            FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::TCoord::Impl', 'gl_FragData[0] = clamp(gl_FragData[0],0.0,1.0)*texture2D(texture1, tcoordVCVSOutput.st);').result;
        }
      } else {
        VSSource = _ShaderProgram2.default.substitute(VSSource, '//VTK::TCoord::Dec', 'attribute vec3 tcoordMC; varying vec3 tcoordVCVSOutput;').result;
        GSSource = _ShaderProgram2.default.substitute(GSSource, '//VTK::TCoord::Dec', ['in vec3 tcoordVCVSOutput[];', 'out vec3 tcoordVCGSOutput;']).result;
        GSSource = _ShaderProgram2.default.substitute(GSSource, '//VTK::TCoord::Impl', 'tcoordVCGSOutput = tcoordVCVSOutput[i];').result;
        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::TCoord::Dec', ['varying vec3 tcoordVCVSOutput;', 'uniform samplerCube texture1;']).result;
        switch (tNumComp) {
          case 1:
            FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::TCoord::Impl', ['vec4 tcolor = textureCube(texture1, tcoordVCVSOutput);', 'gl_FragData[0] = clamp(gl_FragData[0],0.0,1.0)*', '  vec4(tcolor.r,tcolor.r,tcolor.r,1.0);']).result;
            break;
          case 2:
            FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::TCoord::Impl', ['vec4 tcolor = textureCube(texture1, tcoordVCVSOutput);', 'gl_FragData[0] = clamp(gl_FragData[0],0.0,1.0)*', '  vec4(tcolor.r,tcolor.r,tcolor.r,tcolor.g);']).result;
            break;
          default:
            FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::TCoord::Impl', 'gl_FragData[0] = clamp(gl_FragData[0],0.0,1.0)*textureCube(texture1, tcoordVCVSOutput);').result;
        }
      }
      shaders.Vertex = VSSource;
      shaders.Geometry = GSSource;
      shaders.Fragment = FSSource;
    }
  };

  publicAPI.replaceShaderClip = function (shaders, ren, actor) {
    var VSSource = shaders.Vertex;
    var FSSource = shaders.Fragment;

    if (model.renderable.getNumberOfClippingPlanes()) {
      var numClipPlanes = model.renderable.getNumberOfClippingPlanes();
      if (numClipPlanes > 6) {
        _macro2.default.vtkErrorMacro('OpenGL has a limit of 6 clipping planes');
        numClipPlanes = 6;
      }
      VSSource = _ShaderProgram2.default.substitute(VSSource, '//VTK::Clip::Dec', ['uniform int numClipPlanes;', 'uniform vec4 clipPlanes[6];', 'varying float clipDistancesVSOutput[6];']).result;

      VSSource = _ShaderProgram2.default.substitute(VSSource, '//VTK::Clip::Impl', ['for (int planeNum = 0; planeNum < 6; planeNum++)', '    {', '    if (planeNum >= numClipPlanes)', '        {', '        break;', '        }', '    clipDistancesVSOutput[planeNum] = dot(clipPlanes[planeNum], vertexMC);', '    }']).result;
      FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Clip::Dec', ['uniform int numClipPlanes;', 'varying float clipDistancesVSOutput[6];']).result;

      FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Clip::Impl', ['for (int planeNum = 0; planeNum < 6; planeNum++)', '    {', '    if (planeNum >= numClipPlanes)', '        {', '        break;', '        }', '    if (clipDistancesVSOutput[planeNum] < 0.0) discard;', '    }']).result;
    }
    shaders.Vertex = VSSource;
    shaders.Fragment = FSSource;
  };

  publicAPI.getCoincidentParameters = function (ren, actor) {
    // 1. ResolveCoincidentTopology is On and non zero for this primitive
    // type
    var cp = null;
    var prop = actor.getProperty();
    if (model.renderable.getResolveCoincidentTopology() || prop.getEdgeVisibility() && prop.getRepresentation() === _Constants.Representation.SURFACE) {
      var primType = model.lastBoundBO.getPrimitiveType();
      if (primType === primTypes.Points || prop.getRepresentation() === _Constants.Representation.POINTS) {
        cp = model.renderable.getCoincidentTopologyPointOffsetParameter();
      } else if (primType === primTypes.Lines || prop.getRepresentation() === _Constants.Representation.WIREFRAME) {
        cp = model.renderable.getCoincidentTopologyLineOffsetParameters();
      } else if (primType === primTypes.Tris || primType === primTypes.TriStrips) {
        cp = model.renderable.getCoincidentTopologyPolygonOffsetParameters();
      }
      if (primType === primTypes.TrisEdges || primType === primTypes.TriStripsEdges) {
        cp = model.renderable.getCoincidentTopologyPolygonOffsetParameters();
        cp.factor /= 2.0;
        cp.offset /= 2.0;
      }
    }

    // hardware picking always offset due to saved zbuffer
    // This gets you above the saved surface depth buffer.
    // vtkHardwareSelector* selector = ren->GetSelector();
    // if (selector &&
    //     selector->GetFieldAssociation() == vtkDataObject::FIELD_ASSOCIATION_POINTS)
    // {
    //   offset -= 2.0;
    //   return;
    // }
    return cp;
  };

  publicAPI.replaceShaderCoincidentOffset = function (shaders, ren, actor) {
    var cp = publicAPI.getCoincidentParameters(ren, actor);

    // if we need an offset handle it here
    // The value of .000016 is suitable for depth buffers
    // of at least 16 bit depth. We do not query the depth
    // right now because we would need some mechanism to
    // cache the result taking into account FBO changes etc.
    if (cp && (cp.factor !== 0.0 || cp.offset !== 0.0)) {
      var FSSource = shaders.Fragment;

      FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Coincident::Dec', ['uniform float cfactor;', 'uniform float coffset;']).result;

      if (model.context.getExtension('EXT_frag_depth')) {
        if (cp.factor !== 0.0) {
          FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::UniformFlow::Impl', ['float cscale = length(vec2(dFdx(gl_FragCoord.z),dFdy(gl_FragCoord.z)));', '//VTK::UniformFlow::Impl'], false).result;
          FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Depth::Impl', 'gl_FragDepthEXT = gl_FragCoord.z + cfactor*cscale + 0.000016*coffset;').result;
        } else {
          FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Depth::Impl', 'gl_FragDepthEXT = gl_FragCoord.z + 0.000016*coffset;').result;
        }
      }
      shaders.Fragment = FSSource;
    }
  };

  publicAPI.replaceShaderPicking = function (shaders, ren, actor) {
    if (model.openGLRenderer.getSelector()) {
      var FSSource = shaders.Fragment;
      switch (model.openGLRenderer.getSelector().getCurrentPass()) {
        case _Constants4.PassTypes.ID_LOW24:
          // FSSource = vtkShaderProgram.substitute(FSSource,
          //   '//VTK::Picking::Impl', [
          //     '  int idx = gl_PrimitiveID + 1 + PrimitiveIDOffset;',
          //     '  gl_FragData[0] = vec4(float(idx%256)/255.0, float((idx/256)%256)/255.0, float((idx/65536)%256)/255.0, 1.0);',
          //   ], false).result;
          break;
        default:
          FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Picking::Dec', 'uniform vec3 mapperIndex;').result;
          FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Picking::Impl', '  gl_FragData[0] = vec4(mapperIndex,1.0);').result;
      }
      shaders.Fragment = FSSource;
    }
  };

  publicAPI.replaceShaderValues = function (shaders, ren, actor) {
    publicAPI.replaceShaderColor(shaders, ren, actor);
    publicAPI.replaceShaderNormal(shaders, ren, actor);
    publicAPI.replaceShaderLight(shaders, ren, actor);
    publicAPI.replaceShaderTCoord(shaders, ren, actor);
    publicAPI.replaceShaderPicking(shaders, ren, actor);
    publicAPI.replaceShaderClip(shaders, ren, actor);
    publicAPI.replaceShaderCoincidentOffset(shaders, ren, actor);
    publicAPI.replaceShaderPositionVC(shaders, ren, actor);

    if (model.renderDepth) {
      var FSSource = shaders.Fragment;
      FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::ZBuffer::Impl', ['float iz = floor(gl_FragCoord.z*65535.0 + 0.1);', 'float rf = floor(iz/256.0)/255.0;', 'float gf = mod(iz,256.0)/255.0;', 'gl_FragData[0] = vec4(rf, gf, 0.0, 1.0);']).result;
      shaders.Fragment = FSSource;
    }
  };

  publicAPI.getNeedToRebuildShaders = function (cellBO, ren, actor) {
    var lightComplexity = 0;
    var numberOfLights = 0;

    var primType = cellBO.getPrimitiveType();

    var needLighting = true;

    var poly = model.currentInput;

    var n = actor.getProperty().getInterpolation() !== _Constants.Shading.FLAT ? poly.getPointData().getNormals() : null;
    if (n === null && poly.getCellData().getNormals()) {
      n = poly.getCellData().getNormals();
    }

    var haveNormals = n !== null;

    if (actor.getProperty().getRepresentation() === _Constants.Representation.POINTS || primType === primTypes.Points) {
      needLighting = haveNormals;
    }

    // do we need lighting?
    if (actor.getProperty().getLighting() && needLighting) {
      // consider the lighting complexity to determine which case applies
      // simple headlight, Light Kit, the whole feature set of VTK
      lightComplexity = 0;

      ren.getLights().forEach(function (light) {
        var status = light.getSwitch();
        if (status > 0) {
          numberOfLights++;
          if (lightComplexity === 0) {
            lightComplexity = 1;
          }
        }

        if (lightComplexity === 1 && (numberOfLights > 1 || light.getIntensity() !== 1.0 || !light.lightTypeIsHeadLight())) {
          lightComplexity = 2;
        }
        if (lightComplexity < 3 && light.getPositional()) {
          lightComplexity = 3;
        }
      });
    }

    var needRebuild = false;
    var lastLightComplexity = model.lastBoundBO.get('lastLightComplexity').lastLightComplexity;
    var lastLightCount = model.lastBoundBO.get('lastLightCount').lastLightCount;
    if (lastLightComplexity !== lightComplexity || lastLightCount !== numberOfLights) {
      model.lastBoundBO.set({ lastLightComplexity: lightComplexity }, true);
      model.lastBoundBO.set({ lastLightCount: numberOfLights }, true);
      needRebuild = true;
    }

    var selector = model.openGLRenderer.getSelector();
    var selectionPass = selector === null ? -1 : selector.getCurrentPass();
    if (model.lastBoundBO.get('lastSelectionPass').lastSelectionPass !== selectionPass) {
      model.lastBoundBO.set({ lastSelectionPass: selectionPass }, true);
      needRebuild = true;
    }

    var toString = '' + model.renderDepth;

    // has something changed that would require us to recreate the shader?
    // candidates are
    // property modified (representation interpolation and lighting)
    // input modified
    // light complexity changed
    if (model.shaderRebuildString !== toString || cellBO.getProgram() === 0 || cellBO.getShaderSourceTime().getMTime() < publicAPI.getMTime() || cellBO.getShaderSourceTime().getMTime() < actor.getMTime() || cellBO.getShaderSourceTime().getMTime() < model.renderable.getMTime() || cellBO.getShaderSourceTime().getMTime() < model.currentInput.getMTime() || needRebuild) {
      model.shaderRebuildString = toString;
      return true;
    }

    return false;
  };

  publicAPI.updateShaders = function (cellBO, ren, actor) {
    cellBO.getVAO().bind();
    model.lastBoundBO = cellBO;

    // has something changed that would require us to recreate the shader?
    if (publicAPI.getNeedToRebuildShaders(cellBO, ren, actor)) {
      var shaders = { Vertex: null, Fragment: null, Geometry: null };
      publicAPI.buildShaders(shaders, ren, actor);

      // compile and bind the program if needed
      var newShader = model.openGLRenderWindow.getShaderCache().readyShaderProgramArray(shaders.Vertex, shaders.Fragment, shaders.Geometry);

      // if the shader changed reinitialize the VAO
      if (newShader !== cellBO.getProgram()) {
        cellBO.setProgram(newShader);
        // reset the VAO as the shader has changed
        cellBO.getVAO().releaseGraphicsResources();
      }

      cellBO.getShaderSourceTime().modified();
    } else {
      model.openGLRenderWindow.getShaderCache().readyShaderProgram(cellBO.getProgram());
    }

    publicAPI.setMapperShaderParameters(cellBO, ren, actor);
    publicAPI.setPropertyShaderParameters(cellBO, ren, actor);
    publicAPI.setCameraShaderParameters(cellBO, ren, actor);
    publicAPI.setLightingShaderParameters(cellBO, ren, actor);

    var listCallbacks = model.renderable.getViewSpecificProperties().ShadersCallbacks;
    if (listCallbacks) {
      listCallbacks.forEach(function (object) {
        object.callback(object.userData, cellBO, ren, actor);
      });
    }
  };

  publicAPI.setMapperShaderParameters = function (cellBO, ren, actor) {
    // Now to update the VAO too, if necessary.
    cellBO.getProgram().setUniformi('PrimitiveIDOffset', model.primitiveIDOffset);

    if (cellBO.getCABO().getElementCount() && (model.VBOBuildTime.getMTime() > cellBO.getAttributeUpdateTime().getMTime() || cellBO.getShaderSourceTime().getMTime() > cellBO.getAttributeUpdateTime().getMTime())) {
      cellBO.getCABO().bind();
      var lastLightComplexity = model.lastBoundBO.get('lastLightComplexity').lastLightComplexity;

      if (cellBO.getProgram().isAttributeUsed('vertexMC')) {
        if (!cellBO.getVAO().addAttributeArray(cellBO.getProgram(), cellBO.getCABO(), 'vertexMC', cellBO.getCABO().getVertexOffset(), cellBO.getCABO().getStride(), model.context.FLOAT, 3, false)) {
          vtkErrorMacro('Error setting vertexMC in shader VAO.');
        }
      }
      if (cellBO.getProgram().isAttributeUsed('normalMC') && cellBO.getCABO().getNormalOffset() && lastLightComplexity > 0) {
        if (!cellBO.getVAO().addAttributeArray(cellBO.getProgram(), cellBO.getCABO(), 'normalMC', cellBO.getCABO().getNormalOffset(), cellBO.getCABO().getStride(), model.context.FLOAT, 3, false)) {
          vtkErrorMacro('Error setting normalMC in shader VAO.');
        }
      }
      if (cellBO.getProgram().isAttributeUsed('tcoordMC') && cellBO.getCABO().getTCoordOffset()) {
        if (!cellBO.getVAO().addAttributeArray(cellBO.getProgram(), cellBO.getCABO(), 'tcoordMC', cellBO.getCABO().getTCoordOffset(), cellBO.getCABO().getStride(), model.context.FLOAT, cellBO.getCABO().getTCoordComponents(), false)) {
          vtkErrorMacro('Error setting tcoordMC in shader VAO.');
        }
      }
      if (cellBO.getProgram().isAttributeUsed('scalarColor') && cellBO.getCABO().getColorComponents()) {
        cellBO.getCABO().getColorBO().bind();
        if (!cellBO.getVAO().addAttributeArray(cellBO.getProgram(), cellBO.getCABO().getColorBO(), 'scalarColor', cellBO.getCABO().getColorOffset(), cellBO.getCABO().getColorBOStride(), model.context.UNSIGNED_BYTE, 4, true)) {
          vtkErrorMacro('Error setting scalarColor in shader VAO.');
        }
      }
    }

    if (model.renderable.getNumberOfClippingPlanes()) {
      // add all the clipping planes
      var numClipPlanes = model.renderable.getNumberOfClippingPlanes();
      if (numClipPlanes > 6) {
        _macro2.default.vtkErrorMacro('OpenGL has a limit of 6 clipping planes');
        numClipPlanes = 6;
      }
      var planeEquations = [];
      for (var i = 0; i < numClipPlanes; i++) {
        var planeEquation = [];
        model.renderable.getClippingPlaneInDataCoords(actor.getMatrix(), i, planeEquation);

        for (var j = 0; j < 4; j++) {
          planeEquations.push(planeEquation[j]);
        }
      }
      cellBO.getProgram().setUniformi('numClipPlanes', numClipPlanes);
      cellBO.getProgram().setUniform4fv('clipPlanes', 6, planeEquations);
    }

    if (model.internalColorTexture && cellBO.getProgram().isUniformUsed('texture1')) {
      cellBO.getProgram().setUniformi('texture1', model.internalColorTexture.getTextureUnit());
    }
    var tus = model.openGLActor.getActiveTextures();
    tus.forEach(function (tex) {
      var texUnit = tex.getTextureUnit();
      var tname = 'texture' + (texUnit + 1);
      if (cellBO.getProgram().isUniformUsed(tname)) {
        cellBO.getProgram().setUniformi(tname, texUnit);
      }
    });

    // handle coincident
    if (cellBO.getProgram().isUniformUsed('coffset')) {
      var cp = publicAPI.getCoincidentParameters(ren, actor);
      cellBO.getProgram().setUniformf('coffset', cp.offset);
      // cfactor isn't always used when coffset is.
      if (cellBO.getProgram().isUniformUsed('cfactor')) {
        cellBO.getProgram().setUniformf('cfactor', cp.factor);
      }
    }

    var selector = model.openGLRenderer.getSelector();
    if (selector && cellBO.getProgram().isUniformUsed('mapperIndex')) {
      if (selector.getCurrentPass() < _Constants4.PassTypes.ID_LOW24) {
        cellBO.getProgram().setUniform3f('mapperIndex', selector.getPropColorValue());
      }
    }
  };

  publicAPI.setLightingShaderParameters = function (cellBO, ren, actor) {
    // for unlit and headlight there are no lighting parameters
    var lastLightComplexity = model.lastBoundBO.get('lastLightComplexity').lastLightComplexity;
    if (lastLightComplexity < 2) {
      return;
    }

    var program = cellBO.getProgram();

    // bind some light settings
    var numberOfLights = 0;

    var lights = ren.getLights();
    Object.keys(lights).map(function (key) {
      return lights[key];
    }).forEach(function (light) {
      var status = light.getSwitch();
      if (status > 0.0) {
        var dColor = light.getColor();
        var intensity = light.getIntensity();
        var lightColor = [dColor[0] * intensity, dColor[1] * intensity, dColor[2] * intensity];
        // get required info from light
        var lightDirection = light.getDirection();
        var lightHalfAngle = [-lightDirection[0], -lightDirection[1], -lightDirection[2] + 1.0];
        _Math2.default.normalize(lightDirection);
        program.setUniform3f('lightColor' + numberOfLights, lightColor);
        program.setUniform3f('lightDirectionVC' + numberOfLights, lightDirection);
        program.setUniform3f('lightHalfAngleVC' + numberOfLights, lightHalfAngle);
        numberOfLights++;
      }
    });

    // we are done unless we have positional lights
    if (lastLightComplexity < 3) {
      return;
    }

    // for lightkit case there are some parameters to set
    var cam = ren.getActiveCamera();
    var viewTF = cam.getViewTransformMatrix();
    _glMatrix.mat4.transpose(viewTF, viewTF);

    numberOfLights = 0;

    Object.keys(lights).map(function (key) {
      return lights[key];
    }).forEach(function (light) {
      var status = light.getSwitch();
      if (status > 0.0) {
        var lp = light.getTransformedPosition();
        var np = _glMatrix.vec3.fromValues(lp[0], lp[1], lp[2]);
        _glMatrix.vec3.transformMat4(np, np, viewTF);
        program.setUniform3f('lightAttenuation' + numberOfLights, light.getAttenuationValues());
        program.setUniformi('lightPositional' + numberOfLights, light.getPositional());
        program.setUniformf('lightExponent' + numberOfLights, light.getExponent());
        program.setUniformf('lightConeAngle' + numberOfLights, light.getConeAngle());
        program.setUniform3f('lightPositionVC' + numberOfLights, [np[0], np[1], np[2]]);
        numberOfLights++;
      }
    });
  };

  publicAPI.setCameraShaderParameters = function (cellBO, ren, actor) {
    var program = cellBO.getProgram();

    // // [WMVD]C == {world, model, view, display} coordinates
    // // E.g., WCDC == world to display coordinate transformation
    var keyMats = model.openGLCamera.getKeyMatrices(ren);
    var cam = ren.getActiveCamera();

    if (actor.getIsIdentity()) {
      program.setUniformMatrix('MCDCMatrix', keyMats.wcdc);
      if (program.isUniformUsed('MCVCMatrix')) {
        program.setUniformMatrix('MCVCMatrix', keyMats.wcvc);
      }
      if (program.isUniformUsed('normalMatrix')) {
        program.setUniformMatrix3x3('normalMatrix', keyMats.normalMatrix);
      }
    } else {
      var actMats = model.openGLActor.getKeyMatrices();
      if (program.isUniformUsed('normalMatrix')) {
        var anorms = _glMatrix.mat3.create();
        _glMatrix.mat3.multiply(anorms, keyMats.normalMatrix, actMats.normalMatrix);
        program.setUniformMatrix3x3('normalMatrix', anorms);
      }
      var tmp4 = _glMatrix.mat4.create();
      _glMatrix.mat4.multiply(tmp4, keyMats.wcdc, actMats.mcwc);
      program.setUniformMatrix('MCDCMatrix', tmp4);
      if (program.isUniformUsed('MCVCMatrix')) {
        _glMatrix.mat4.multiply(tmp4, keyMats.wcvc, actMats.mcwc);
        program.setUniformMatrix('MCVCMatrix', tmp4);
      }
    }

    if (program.isUniformUsed('cameraParallel')) {
      program.setUniformi('cameraParallel', cam.getParallelProjection());
    }
  };

  publicAPI.setPropertyShaderParameters = function (cellBO, ren, actor) {
    var program = cellBO.getProgram();

    var ppty = actor.getProperty();

    var opacity = ppty.getOpacity();
    var aColor = model.drawingEdges ? ppty.getEdgeColor() : ppty.getAmbientColor();
    var aIntensity = ppty.getAmbient();
    var ambientColor = [aColor[0] * aIntensity, aColor[1] * aIntensity, aColor[2] * aIntensity];
    var dColor = model.drawingEdges ? ppty.getEdgeColor() : ppty.getDiffuseColor();
    var dIntensity = ppty.getDiffuse();
    var diffuseColor = [dColor[0] * dIntensity, dColor[1] * dIntensity, dColor[2] * dIntensity];

    program.setUniformf('opacityUniform', opacity);
    program.setUniform3f('ambientColorUniform', ambientColor);
    program.setUniform3f('diffuseColorUniform', diffuseColor);
    // we are done unless we have lighting
    var lastLightComplexity = model.lastBoundBO.get('lastLightComplexity').lastLightComplexity;
    if (lastLightComplexity < 1) {
      return;
    }
    var sColor = ppty.getSpecularColor();
    var sIntensity = ppty.getSpecular();
    var specularColor = [sColor[0] * sIntensity, sColor[1] * sIntensity, sColor[2] * sIntensity];
    program.setUniform3f('specularColorUniform', specularColor);
    var specularPower = ppty.getSpecularPower();
    program.setUniformf('specularPowerUniform', specularPower);

    // // now set the backface properties if we have them
    // if (actor.getBackfaceProperty() && !model.DrawingEdges)
    //   {
    //   ppty = actor.getBackfaceProperty();

    //   let opacity = static_cast<float>(ppty.getOpacity());
    //   double *aColor = ppty.getAmbientColor();
    //   double aIntensity = ppty.getAmbient();  // ignoring renderer ambient
    //   let ambientColor[3] = {static_cast<float>(aColor[0] * aIntensity),
    //     static_cast<float>(aColor[1] * aIntensity),
    //     static_cast<float>(aColor[2] * aIntensity)};
    //   double *dColor = ppty.getDiffuseColor();
    //   double dIntensity = ppty.getDiffuse();
    //   let diffuseColor[3] = {static_cast<float>(dColor[0] * dIntensity),
    //     static_cast<float>(dColor[1] * dIntensity),
    //     static_cast<float>(dColor[2] * dIntensity)};
    //   double *sColor = ppty.getSpecularColor();
    //   double sIntensity = ppty.getSpecular();
    //   let specularColor[3] = {static_cast<float>(sColor[0] * sIntensity),
    //     static_cast<float>(sColor[1] * sIntensity),
    //     static_cast<float>(sColor[2] * sIntensity)};
    //   double specularPower = ppty.getSpecularPower();

    //   program.SetUniformf('opacityUniformBF', opacity);
    //   program.SetUniform3f('ambientColorUniformBF', ambientColor);
    //   program.SetUniform3f('diffuseColorUniformBF', diffuseColor);
    //   // we are done unless we have lighting
    //   if (model.LastLightComplexity[&cellBO] < 1)
    //     {
    //     return;
    //     }
    //   program.SetUniform3f('specularColorUniformBF', specularColor);
    //   program.SetUniformf('specularPowerUniformBF', specularPower);
    //   }
  };

  publicAPI.renderPieceStart = function (ren, actor) {
    model.primitiveIDOffset = 0;

    if (model.openGLRenderer.getSelector()) {
      switch (model.openGLRenderer.getSelector().getCurrentPass()) {
        default:
          model.openGLRenderer.getSelector().renderProp(actor);
      }
    }
    // Line Width setting (FIXME Ken)
    model.context.lineWidth(actor.getProperty().getLineWidth());

    // make sure the BOs are up to date
    publicAPI.updateBufferObjects(ren, actor);

    // If we are coloring by texture, then load the texture map.
    // Use Map as indicator, because texture hangs around.
    if (model.renderable.getColorTextureMap()) {
      model.internalColorTexture.activate();
    }

    // Bind the OpenGL, this is shared between the different primitive/cell types.
    model.lastBoundBO = null;
  };

  publicAPI.renderPieceDraw = function (ren, actor) {
    var representation = actor.getProperty().getRepresentation();

    var gl = model.context;

    var drawSurfaceWithEdges = actor.getProperty().getEdgeVisibility() && representation === _Constants.Representation.SURFACE;

    // for every primitive type
    for (var i = primTypes.Start; i < primTypes.End; i++) {
      // if there are entries
      var cabo = model.primitives[i].getCABO();
      if (cabo.getElementCount()) {
        // are we drawing edges
        model.drawingEdges = drawSurfaceWithEdges && (i === primTypes.TrisEdges || i === primTypes.TriStripsEdges);
        publicAPI.updateShaders(model.primitives[i], ren, actor);
        var mode = publicAPI.getOpenGLMode(representation, i);
        gl.drawArrays(mode, 0, cabo.getElementCount());

        var stride = mode === gl.POINTS ? 1 : mode === gl.LINES ? 2 : 3;
        model.primitiveIDOffset += cabo.getElementCount() / stride;
      }
    }
  };

  publicAPI.getOpenGLMode = function (rep, type) {
    if (rep === _Constants.Representation.POINTS || type === primTypes.Points) {
      return model.context.POINTS;
    }
    if (rep === _Constants.Representation.WIREFRAME || type === primTypes.Lines || type === primTypes.TrisEdges || type === primTypes.TriStripsEdges) {
      return model.context.LINES;
    }
    return model.context.TRIANGLES;
  };

  publicAPI.renderPieceFinish = function (ren, actor) {
    if (model.LastBoundBO) {
      model.LastBoundBO.getVAO().release();
    }
    if (model.renderable.getColorTextureMap()) {
      model.internalColorTexture.deactivate();
    }
  };

  publicAPI.renderPiece = function (ren, actor) {
    // Make sure that we have been properly initialized.
    // if (ren.getRenderWindow().checkAbortStatus()) {
    //   return;
    // }


    publicAPI.invokeEvent({ type: 'StartEvent' });
    model.currentInput = model.renderable.getInputData();
    if (!model.renderable.getStatic()) {
      model.renderable.update();
      model.currentInput = model.renderable.getInputData();
    }
    publicAPI.invokeEvent({ type: 'EndEvent' });

    if (model.currentInput === null) {
      vtkErrorMacro('No input!');
      return;
    }

    // if there are no points then we are done
    if (!model.currentInput.getPoints || !model.currentInput.getPoints().getNumberOfValues()) {
      return;
    }

    // apply faceCulling
    var gl = model.context;
    var backfaceCulling = actor.getProperty().getBackfaceCulling();
    var frontfaceCulling = actor.getProperty().getFrontfaceCulling();
    if (!backfaceCulling && !frontfaceCulling) {
      gl.disable(gl.CULL_FACE);
    } else if (frontfaceCulling) {
      gl.enable(gl.CULL_FACE);
      gl.cullFace(gl.FRONT);
    } else {
      gl.enable(gl.CULL_FACE);
      gl.cullFace(gl.BACK);
    }

    publicAPI.renderPieceStart(ren, actor);
    publicAPI.renderPieceDraw(ren, actor);
    publicAPI.renderPieceFinish(ren, actor);
  };

  publicAPI.computeBounds = function (ren, actor) {
    if (!publicAPI.getInput()) {
      _Math2.default.uninitializeBounds(model.bounds);
      return;
    }
    model.bounds = publicAPI.getInput().getBounds();
  };

  publicAPI.updateBufferObjects = function (ren, actor) {
    // Rebuild buffers if needed
    if (publicAPI.getNeedToRebuildBufferObjects(ren, actor)) {
      publicAPI.buildBufferObjects(ren, actor);
    }
  };

  publicAPI.getNeedToRebuildBufferObjects = function (ren, actor) {
    // first do a coarse check
    if (model.VBOBuildTime.getMTime() < publicAPI.getMTime() || model.VBOBuildTime.getMTime() < model.renderable.getMTime() || model.VBOBuildTime.getMTime() < actor.getMTime() || model.VBOBuildTime.getMTime() < actor.getProperty().getMTime() || model.VBOBuildTime.getMTime() < model.currentInput.getMTime()) {
      return true;
    }
    return false;
  };

  publicAPI.buildBufferObjects = function (ren, actor) {
    var poly = model.currentInput;

    if (poly === null) {
      return;
    }

    model.renderable.mapScalars(poly, 1.0);
    var c = model.renderable.getColorMapColors();

    model.haveCellScalars = false;
    var scalarMode = model.renderable.getScalarMode();
    if (model.renderable.getScalarVisibility()) {
      // We must figure out how the scalars should be mapped to the polydata.
      if ((scalarMode === _Constants2.ScalarMode.USE_CELL_DATA || scalarMode === _Constants2.ScalarMode.USE_CELL_FIELD_DATA || scalarMode === _Constants2.ScalarMode.USE_FIELD_DATA || !poly.getPointData().getScalars()) && scalarMode !== _Constants2.ScalarMode.USE_POINT_FIELD_DATA && c) {
        model.haveCellScalars = true;
      }
    }

    // Do we have normals?
    var n = actor.getProperty().getInterpolation() !== _Constants.Shading.FLAT ? poly.getPointData().getNormals() : null;
    if (n === null && poly.getCellData().getNormals()) {
      model.haveCellNormals = true;
      n = poly.getCellData().getNormals();
    }

    // rebuild the VBO if the data has changed we create a string for the VBO what
    // can change the VBO? points normals tcoords colors so what can change those?
    // the input data is clearly one as it can change all four items tcoords may
    // haveTextures or not colors may change based on quite a few mapping
    // parameters in the mapper

    var representation = actor.getProperty().getRepresentation();

    var tcoords = poly.getPointData().getTCoords();
    if (!model.openGLActor.getActiveTextures().length) {
      tcoords = null;
    }

    // handle color mapping via texture
    if (model.renderable.getColorCoordinates()) {
      tcoords = model.renderable.getColorCoordinates();
      if (!model.internalColorTexture) {
        model.internalColorTexture = _Texture2.default.newInstance();
      }
      var tex = model.internalColorTexture;
      // the following 4 lines allow for NPOT textures
      tex.setMinificationFilter(_Constants3.Filter.NEAREST);
      tex.setMagnificationFilter(_Constants3.Filter.NEAREST);
      tex.setWrapS(_Constants3.Wrap.CLAMP_TO_EDGE);
      tex.setWrapT(_Constants3.Wrap.CLAMP_TO_EDGE);
      tex.setWindow(model.openGLRenderWindow);
      tex.setContext(model.openGLRenderWindow.getContext());

      var input = model.renderable.getColorTextureMap();
      var ext = input.getExtent();
      var inScalars = input.getPointData().getScalars();
      tex.create2DFromRaw(ext[1] - ext[0] + 1, ext[3] - ext[2] + 1, inScalars.getNumberOfComponents(), inScalars.getDataType(), inScalars.getData());
      tex.activate();
      tex.sendParameters();
      tex.deactivate();
    }

    var toString = poly.getMTime() + 'A' + representation + 'B' + poly.getMTime() + ('C' + (n ? n.getMTime() : 1) + 'D' + (c ? c.getMTime() : 1)) + ('E' + actor.getProperty().getEdgeVisibility()) + ('F' + (tcoords ? tcoords.getMTime() : 1));
    if (model.VBOBuildString !== toString) {
      // Build the VBOs
      var points = poly.getPoints();
      var options = {
        points: points,
        normals: n,
        tcoords: tcoords,
        colors: c,
        cellOffset: 0,
        haveCellScalars: model.haveCellScalars,
        haveCellNormals: model.haveCellNormals
      };
      options.cellOffset += model.primitives[primTypes.Points].getCABO().createVBO(poly.getVerts(), 'verts', representation, options);
      options.cellOffset += model.primitives[primTypes.Lines].getCABO().createVBO(poly.getLines(), 'lines', representation, options);
      options.cellOffset += model.primitives[primTypes.Tris].getCABO().createVBO(poly.getPolys(), 'polys', representation, options);
      options.cellOffset += model.primitives[primTypes.TriStrips].getCABO().createVBO(poly.getStrips(), 'strips', representation, options);

      var drawSurfaceWithEdges = actor.getProperty().getEdgeVisibility() && representation === _Constants.Representation.SURFACE;

      // if we have edge visibility build the edge VBOs
      if (drawSurfaceWithEdges) {
        model.primitives[primTypes.TrisEdges].getCABO().createVBO(poly.getPolys(), 'polys', _Constants.Representation.WIREFRAME, {
          points: points,
          normals: n,
          tcoords: null,
          colors: null,
          cellOffset: 0,
          haveCellScalars: false,
          haveCellNormals: false
        });
        model.primitives[primTypes.TriStripsEdges].getCABO().createVBO(poly.getStrips(), 'strips', _Constants.Representation.WIREFRAME, {
          points: points,
          normals: n,
          tcoords: null,
          colors: null,
          cellOffset: 0,
          haveCellScalars: false,
          haveCellNormals: false
        });
      } else {
        // otherwise free them
        model.primitives[primTypes.TrisEdges].releaseGraphicsResources(model.openGLRenderWindow);
        model.primitives[primTypes.TriStripsEdges].releaseGraphicsResources(model.openGLRenderWindow);
      }

      model.VBOBuildTime.modified();
      model.VBOBuildString = toString;
    }
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  context: null,
  VBOBuildTime: 0,
  VBOBuildString: null,
  primitives: null,
  primTypes: null,
  shaderRebuildString: null
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  _ViewNode2.default.extend(publicAPI, model, initialValues);

  model.primitives = [];
  model.primTypes = primTypes;

  for (var i = primTypes.Start; i < primTypes.End; i++) {
    model.primitives[i] = _Helper2.default.newInstance();
    model.primitives[i].setPrimitiveType(i);
    model.primitives[i].set({ lastLightComplexity: 0, lastLightCount: 0, lastSelectionPass: -1 }, true);
  }

  // Build VTK API
  _macro2.default.setGet(publicAPI, model, ['context']);

  model.VBOBuildTime = {};
  _macro2.default.obj(model.VBOBuildTime, { mtime: 0 });

  // Object methods
  vtkOpenGLPolyDataMapper(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkOpenGLPolyDataMapper');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var ColorMode = exports.ColorMode = {
  DEFAULT: 0,
  MAP_SCALARS: 1,
  DIRECT_SCALARS: 2
};

var ScalarMode = exports.ScalarMode = {
  DEFAULT: 0,
  USE_POINT_DATA: 1,
  USE_CELL_DATA: 2,
  USE_POINT_FIELD_DATA: 3,
  USE_CELL_FIELD_DATA: 4,
  USE_FIELD_DATA: 5
};

var MaterialMode = exports.MaterialMode = {
  DEFAULT: 0,
  AMBIENT: 1,
  DIFFUSE: 2,
  AMBIENT_AND_DIFFUSE: 3
};

var GetArray = exports.GetArray = {
  BY_ID: 0,
  BY_NAME: 1
};

exports.default = {
  ColorMode: ColorMode,
  GetArray: GetArray,
  MaterialMode: MaterialMode,
  ScalarMode: ScalarMode
};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _vtk = __webpack_require__(9);

var _vtk2 = _interopRequireDefault(_vtk);

var _CellArray = __webpack_require__(94);

var _CellArray2 = _interopRequireDefault(_CellArray);

var _PointSet = __webpack_require__(95);

var _PointSet2 = _interopRequireDefault(_PointSet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var POLYDATA_FIELDS = ['verts', 'lines', 'polys', 'strips'];

// ----------------------------------------------------------------------------
// vtkPolyData methods
// ----------------------------------------------------------------------------

function vtkPolyData(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkPolyData');

  function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
      return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '');
  }

  // build empty cell arrays and set methods
  POLYDATA_FIELDS.forEach(function (type) {
    publicAPI['getNumberOf' + camelize(type)] = function () {
      return model[type].getNumberOfCells();
    };
    if (!model[type]) {
      model[type] = _CellArray2.default.newInstance();
    } else {
      model[type] = (0, _vtk2.default)(model[type]);
    }
  });

  publicAPI.getNumberOfCells = function () {
    return POLYDATA_FIELDS.reduce(function (num, cellType) {
      return num + model[cellType].getNumberOfCells();
    }, 0);
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  // verts: null,
  // lines: null,
  // polys: null,
  // strips: null,
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  _PointSet2.default.extend(publicAPI, model, initialValues);
  _macro2.default.setGet(publicAPI, model, ['verts', 'lines', 'polys', 'strips']);

  // Object specific methods
  vtkPolyData(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkPolyData');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var VectorMode = exports.VectorMode = {
  MAGNITUDE: 0,
  COMPONENT: 1,
  RGBCOLORS: 2
};

var ScalarMappingTarget = exports.ScalarMappingTarget = {
  LUMINANCE: 1,
  LUMINANCE_ALPHA: 2,
  RGB: 3,
  RGBA: 4
};

exports.default = {
  VectorMode: VectorMode,
  ScalarMappingTarget: ScalarMappingTarget
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEndianness = getEndianness;
exports.swapBytes = swapBytes;
function getEndianness() {
  var a = new ArrayBuffer(4);
  var b = new Uint8Array(a);
  var c = new Uint32Array(a);
  b[0] = 0xa1;
  b[1] = 0xb2;
  b[2] = 0xc3;
  b[3] = 0xd4;
  if (c[0] === 0xd4c3b2a1) return 'LittleEndian';
  if (c[0] === 0xa1b2c3d4) return 'BigEndian';
  return null;
}

var ENDIANNESS = exports.ENDIANNESS = getEndianness();

function swapBytes(buffer, wordSize) {
  if (wordSize < 2) {
    return;
  }

  var bytes = new Int8Array(buffer);
  var size = bytes.length;
  var tempBuffer = [];

  for (var i = 0; i < size; i += wordSize) {
    for (var j = 0; j < wordSize; j++) {
      tempBuffer.push(bytes[i + j]);
    }
    for (var _j = 0; _j < wordSize; _j++) {
      bytes[i + _j] = tempBuffer.pop();
    }
  }
}

exports.default = {
  ENDIANNESS: ENDIANNESS,
  getEndianness: getEndianness,
  swapBytes: swapBytes
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _ForwardPass = __webpack_require__(42);

var _ForwardPass2 = _interopRequireDefault(_ForwardPass);

var _ViewNodeFactory = __webpack_require__(58);

var _ViewNodeFactory2 = _interopRequireDefault(_ViewNodeFactory);

var _ShaderCache = __webpack_require__(82);

var _ShaderCache2 = _interopRequireDefault(_ShaderCache);

var _ViewNode = __webpack_require__(3);

var _ViewNode2 = _interopRequireDefault(_ViewNode);

var _TextureUnitManager = __webpack_require__(83);

var _TextureUnitManager2 = _interopRequireDefault(_TextureUnitManager);

var _Constants = __webpack_require__(5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vtkDebugMacro = _macro2.default.vtkDebugMacro,
    vtkErrorMacro = _macro2.default.vtkErrorMacro;

// ----------------------------------------------------------------------------
// vtkOpenGLRenderWindow methods
// ----------------------------------------------------------------------------

function vtkOpenGLRenderWindow(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkOpenGLRenderWindow');

  // Auto update style
  function updateWindow() {
    // Canvas size
    if (model.renderable) {
      model.canvas.setAttribute('width', model.size[0]);
      model.canvas.setAttribute('height', model.size[1]);
    }
    // Offscreen ?
    model.canvas.style.display = model.useOffScreen ? 'none' : 'block';

    // Cursor type
    if (model.el) {
      model.el.style.cursor = model.cursorVisibility ? model.cursor : 'none';
    }
  }
  publicAPI.onModified(updateWindow);

  // Builds myself.
  publicAPI.buildPass = function (prepass) {
    if (prepass) {
      if (!model.renderable) {
        return;
      }

      publicAPI.prepareNodes();
      publicAPI.addMissingNodes(model.renderable.getRenderers());
      publicAPI.removeUnusedNodes();

      publicAPI.initialize();
      model.children.forEach(function (child) {
        child.setContext(model.context);
      });
    }
  };

  publicAPI.initialize = function () {
    if (!model.initialized) {
      model.context = publicAPI.get3DContext();
      model.textureUnitManager = _TextureUnitManager2.default.newInstance();
      model.textureUnitManager.setContext(model.context);
      model.shaderCache.setContext(model.context);
      // initialize blending for transparency
      var gl = model.context;
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      model.initialized = true;
    }
  };

  publicAPI.makeCurrent = function () {
    model.context.makeCurrent();
  };

  publicAPI.setContainer = function (el) {
    if (model.el && model.el !== el) {
      // Remove canvas from previous container
      if (model.canvas.parentNode === model.el) {
        model.el.removeChild(model.canvas);
      } else {
        vtkErrorMacro('Error: canvas parent node does not match container');
      }
    }

    if (model.el !== el) {
      model.el = el;
      if (model.el) {
        model.el.appendChild(model.canvas);
      }

      // Trigger modified()
      publicAPI.modified();
    }
  };

  publicAPI.isInViewport = function (x, y, viewport) {
    var vCoords = viewport.getViewport();
    var size = model.size;
    if (vCoords[0] * size[0] <= x && vCoords[2] * size[0] >= x && vCoords[1] * size[1] <= y && vCoords[3] * size[1] >= y) {
      return true;
    }
    return false;
  };

  publicAPI.getViewportSize = function (viewport) {
    var vCoords = viewport.getViewport();
    var size = model.size;
    return [(vCoords[2] - vCoords[0]) * size[0], (vCoords[3] - vCoords[1]) * size[1]];
  };

  publicAPI.getViewportCenter = function (viewport) {
    var size = publicAPI.getViewportSize(viewport);
    return [size[0] * 0.5, size[1] * 0.5];
  };

  publicAPI.displayToNormalizedDisplay = function (x, y, z) {
    return [x / model.size[0], y / model.size[1], z];
  };

  publicAPI.normalizedDisplayToDisplay = function (x, y, z) {
    return [x * model.size[0], y * model.size[1], z];
  };

  publicAPI.worldToView = function (x, y, z, renderer) {
    var dims = publicAPI.getViewportSize(renderer);
    return renderer.worldToView(x, y, z, dims[0] / dims[1]);
  };

  publicAPI.viewToWorld = function (x, y, z, renderer) {
    var dims = publicAPI.getViewportSize(renderer);
    return renderer.viewToWorld(x, y, z, dims[0] / dims[1]);
  };

  publicAPI.worldToDisplay = function (x, y, z, renderer) {
    var val = publicAPI.worldToView(x, y, z, renderer);
    var val2 = renderer.viewToNormalizedDisplay(val[0], val[1], val[2]);
    return publicAPI.normalizedDisplayToDisplay(val2[0], val2[1], val2[2]);
  };

  publicAPI.displayToWorld = function (x, y, z, renderer) {
    var val = publicAPI.displayToNormalizedDisplay(x, y, z);
    var val2 = renderer.normalizedDisplayToView(val[0], val[1], val[2]);
    return publicAPI.viewToWorld(val2[0], val2[1], val2[2], renderer);
  };

  publicAPI.normalizedDisplayToViewport = function (x, y, z, renderer) {
    var vCoords = renderer.getViewport();
    vCoords = publicAPI.normalizedDisplayToDisplay(vCoords[0], vCoords[1], 0.0);
    var coords = publicAPI.normalizedDisplayToDisplay(x, y, z);
    return [coords[0] - vCoords[0] - 0.5, coords[1] - vCoords[1] - 0.5, z];
  };

  publicAPI.viewportToNormalizedViewport = function (x, y, z, renderer) {
    var size = publicAPI.getViewportSize(renderer);
    if (size && size[0] !== 0 && size[1] !== 0) {
      return [x / (size[0] - 1.0), y / (size[1] - 1.0), z];
    }
    return [x, y, z];
  };

  publicAPI.normalizedViewportToViewport = function (x, y, z) {
    return [x * (model.size[0] - 1.0), y * (model.size[1] - 1.0), z];
  };

  publicAPI.displayToLocalDisplay = function (x, y, z) {
    return [x, model.size[1] - y - 1, z];
  };

  publicAPI.viewportToNormalizedDisplay = function (x, y, z, renderer) {
    var vCoords = renderer.getViewport();
    vCoords = publicAPI.normalizedDisplayToDisplay(vCoords[0], vCoords[1], 0.0);
    var x2 = x + vCoords[0] + 0.5;
    var y2 = y + vCoords[1] + 0.5;
    return publicAPI.displayToNormalizedDisplay(x2, y2, z);
  };

  publicAPI.getPixelData = function (x1, y1, x2, y2) {
    var pixels = new Uint8Array((x2 - x1 + 1) * (y2 - y1 + 1) * 4);
    model.context.readPixels(x1, y1, x2 - x1 + 1, y2 - y1 + 1, model.context.RGBA, model.context.UNSIGNED_BYTE, pixels);
    return pixels;
  };

  publicAPI.get2DContext = function () {
    return model.canvas.getContext('2d');
  };

  publicAPI.get3DContext = function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { preserveDrawingBuffer: false, depth: true, alpha: true };

    var result = null;

    var webgl2Supported = typeof WebGL2RenderingContext !== 'undefined';
    model.webgl2 = false;
    if (model.defaultToWebgl2 && webgl2Supported) {
      result = model.canvas.getContext('webgl2'); // , options);
      if (result) {
        model.webgl2 = true;
        vtkDebugMacro('using webgl2');
      }
    }
    if (!result) {
      result = model.canvas.getContext('webgl', options) || model.canvas.getContext('experimental-webgl', options);
    }
    return result;
  };

  publicAPI.activateTexture = function (texture) {
    // Only add if it isn't already there
    var result = model.textureResourceIds.get(texture);
    if (result !== undefined) {
      model.context.activeTexture(model.context.TEXTURE0 + result);
      return;
    }

    var activeUnit = publicAPI.getTextureUnitManager().allocate();
    if (activeUnit < 0) {
      vtkErrorMacro('Hardware does not support the number of textures defined.');
      return;
    }

    model.textureResourceIds.set(texture, activeUnit);
    model.context.activeTexture(model.context.TEXTURE0 + activeUnit);
  };

  publicAPI.deactivateTexture = function (texture) {
    // Only deactivate if it isn't already there
    var result = model.textureResourceIds.get(texture);
    if (result !== undefined) {
      publicAPI.getTextureUnitManager().free(result);
      delete model.textureResourceIds.delete(texture);
    }
  };

  publicAPI.getTextureUnitForTexture = function (texture) {
    var result = model.textureResourceIds.get(texture);
    if (result !== undefined) {
      return result;
    }
    return -1;
  };

  publicAPI.getDefaultTextureInternalFormat = function (vtktype, numComps, useFloat) {
    if (model.webgl2) {
      switch (vtktype) {
        case _Constants.VtkDataTypes.UNSIGNED_CHAR:
          switch (numComps) {
            case 1:
              return model.context.R8;
            case 2:
              return model.context.RG8;
            case 3:
              return model.context.RGB8;
            case 4:
            default:
              return model.context.RGBA8;
          }
        default:
        case _Constants.VtkDataTypes.FLOAT:
          switch (numComps) {
            case 1:
              return model.context.R16F;
            case 2:
              return model.context.RG16F;
            case 3:
              return model.context.RGB16F;
            case 4:
            default:
              return model.context.RGBA16F;
          }
      }
    }

    // webgl1 only supports four types
    switch (numComps) {
      case 1:
        return model.context.LUMINANCE;
      case 2:
        return model.context.LUMINANCE_ALPHA;
      case 3:
        return model.context.RGB;
      case 4:
      default:
        return model.context.RGBA;
    }
  };

  function getCanvasDataURL() {
    var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'image/png';

    return model.canvas.toDataURL(format);
  }

  publicAPI.captureImage = function () {
    var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'image/png';

    if (model.deleted) {
      return null;
    }

    publicAPI.traverseAllPasses();
    return getCanvasDataURL(format);
  };

  publicAPI.traverseAllPasses = function () {
    model.renderPasses.forEach(function (val) {
      val.traverse(publicAPI, null);
    });
    if (model.notifyImageReady) {
      publicAPI.invokeImageReady(getCanvasDataURL());
    }
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  shaderCache: null,
  initialized: false,
  context: null,
  canvas: null,
  size: [300, 300],
  cursorVisibility: true,
  cursor: 'pointer',
  textureUnitManager: null,
  textureResourceIds: null,
  renderPasses: [],
  notifyImageReady: false,
  webgl2: false,
  defaultToWebgl2: false // turned off by default
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Create internal instances
  model.canvas = document.createElement('canvas');

  model.textureResourceIds = new Map();

  // Inheritance
  _ViewNode2.default.extend(publicAPI, model, initialValues);

  model.myFactory = _ViewNodeFactory2.default.newInstance();
  model.shaderCache = _ShaderCache2.default.newInstance();

  // setup default forward pass rendering
  model.renderPasses[0] = _ForwardPass2.default.newInstance();

  _macro2.default.event(publicAPI, model, 'imageReady');

  // on mac default to webgl2
  if (navigator.appVersion.indexOf('Mac') !== -1) {
    model.defaultToWebgl2 = true;
  }

  // Build VTK API
  _macro2.default.get(publicAPI, model, ['shaderCache', 'textureUnitManager', 'webgl2']);

  _macro2.default.setGet(publicAPI, model, ['initialized', 'context', 'canvas', 'renderPasses', 'notifyImageReady', 'defaultToWebgl2', 'cursor']);

  _macro2.default.setGetArray(publicAPI, model, ['size'], 2);

  // Object methods
  vtkOpenGLRenderWindow(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkOpenGLRenderWindow');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var macro = _interopRequireWildcard(_macro);

var _Texture = __webpack_require__(12);

var _Texture2 = _interopRequireDefault(_Texture);

var _Constants = __webpack_require__(5);

var _Constants2 = __webpack_require__(13);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// ----------------------------------------------------------------------------
// vtkFramebuffer methods
// ----------------------------------------------------------------------------
function vtkFramebuffer(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkFramebuffer');

  publicAPI.getBothMode = function () {
    return model.context.FRAMEBUFFER;
  };
  // publicAPI.getDrawMode = () => model.context.DRAW_FRAMEBUFFER;
  // publicAPI.getReadMode = () => model.context.READ_FRAMEBUFFER;

  publicAPI.saveCurrentBindingsAndBuffers = function (modeIn) {
    var mode = typeof modeIn !== 'undefined' ? modeIn : publicAPI.getBothMode();
    publicAPI.saveCurrentBindings(mode);
    publicAPI.saveCurrentBuffers(mode);
  };

  publicAPI.saveCurrentBindings = function (modeIn) {
    var gl = model.context;
    model.previousDrawBinding = gl.getParameter(model.context.FRAMEBUFFER_BINDING);
  };

  publicAPI.saveCurrentBuffers = function (modeIn) {
    // noop on webgl 1
  };

  publicAPI.restorePreviousBindingsAndBuffers = function (modeIn) {
    var mode = typeof modeIn !== 'undefined' ? modeIn : publicAPI.getBothMode();
    publicAPI.restorePreviousBindings(mode);
    publicAPI.restorePreviousBuffers(mode);
  };

  publicAPI.restorePreviousBindings = function (modeIn) {
    var gl = model.context;
    gl.bindFramebuffer(gl.FRAMEBUFFER, model.previousDrawBinding);
  };

  publicAPI.restorePreviousBuffers = function (modeIn) {
    // currently a noop on webgl1
  };

  publicAPI.bind = function () {
    model.context.bindFramebuffer(model.context.FRAMEBUFFER, model.glFramebuffer);
    if (model.colorTexture) {
      model.colorTexture.bind();
    }
  };

  publicAPI.create = function (width, height) {
    model.glFramebuffer = model.context.createFramebuffer();
    model.glFramebuffer.width = width;
    model.glFramebuffer.height = height;
  };

  publicAPI.setColorBuffer = function (texture, mode) {
    var gl = model.context;
    model.colorTexture = texture;
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture.getHandle(), 0);
  };

  // publicAPI.setDepthBuffer = (texture, mode) => {
  //   const gl = model.context;
  //   gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, texture.getHandle(), 0);
  // };

  publicAPI.setWindow = function (win) {
    model.window = win;
    model.context = win.getContext();
  };

  publicAPI.getGLFramebuffer = function () {
    return model.glFramebuffer;
  };

  publicAPI.getSize = function () {
    var size = [0, 0];
    if (model.glFramebuffer !== null) {
      size[0] = model.glFramebuffer.width;
      size[1] = model.glFramebuffer.height;
    }
    return size;
  };

  publicAPI.populateFramebuffer = function () {
    publicAPI.bind();
    var gl = model.context;

    var texture = _Texture2.default.newInstance();
    texture.setWindow(model.window);
    texture.setContext(model.context);
    texture.setMinificationFilter(_Constants2.Filter.LINEAR);
    texture.setMagnificationFilter(_Constants2.Filter.LINEAR);
    texture.create2DFromRaw(model.glFramebuffer.width, model.glFramebuffer.height, 4, _Constants.VtkDataTypes.UNSIGNED_CHAR, null);
    publicAPI.setColorBuffer(texture);

    // for now do not count of having a depth buffer texture
    // as they are not standard webgl 1
    model.depthTexture = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, model.depthTexture);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, model.glFramebuffer.width, model.glFramebuffer.height);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, model.depthTexture);
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------
var DEFAULT_VALUES = {
  window: null,
  context: null,
  glFramebuffer: null,
  colorTexture: null,
  depthTexture: null,
  previousDrawBinding: 0,
  previousReadBinding: 0,
  previousDrawBuffer: 0,
  previousReadBuffer: 0
};

// ----------------------------------------------------------------------------
function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  macro.obj(publicAPI, model);

  macro.setGet(publicAPI, model, ['context', 'colorTexture']);

  // For more macro methods, see "Sources/macro.js"
  // Object specific methods
  vtkFramebuffer(publicAPI, model);
}

// ----------------------------------------------------------------------------
var newInstance = exports.newInstance = macro.newInstance(extend, 'vtkFramebuffer');

// ----------------------------------------------------------------------------
exports.default = Object.assign({ newInstance: newInstance, extend: extend });

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = __webpack_require__(7);

/**
 * @class 3x3 Matrix
 * @name mat3
 */
var mat3 = {};

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */
mat3.create = function() {
    var out = new glMatrix.ARRAY_TYPE(9);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

/**
 * Copies the upper-left 3x3 values into the given mat3.
 *
 * @param {mat3} out the receiving 3x3 matrix
 * @param {mat4} a   the source 4x4 matrix
 * @returns {mat3} out
 */
mat3.fromMat4 = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[4];
    out[4] = a[5];
    out[5] = a[6];
    out[6] = a[8];
    out[7] = a[9];
    out[8] = a[10];
    return out;
};

/**
 * Creates a new mat3 initialized with values from an existing matrix
 *
 * @param {mat3} a matrix to clone
 * @returns {mat3} a new 3x3 matrix
 */
mat3.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(9);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Copy the values from one mat3 to another
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Set a mat3 to the identity matrix
 *
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */
mat3.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

/**
 * Transpose the values of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a12 = a[5];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a01;
        out[5] = a[7];
        out[6] = a02;
        out[7] = a12;
    } else {
        out[0] = a[0];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a[1];
        out[4] = a[4];
        out[5] = a[7];
        out[6] = a[2];
        out[7] = a[5];
        out[8] = a[8];
    }
    
    return out;
};

/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b01 = a22 * a11 - a12 * a21,
        b11 = -a22 * a10 + a12 * a20,
        b21 = a21 * a10 - a11 * a20,

        // Calculate the determinant
        det = a00 * b01 + a01 * b11 + a02 * b21;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = b01 * det;
    out[1] = (-a22 * a01 + a02 * a21) * det;
    out[2] = (a12 * a01 - a02 * a11) * det;
    out[3] = b11 * det;
    out[4] = (a22 * a00 - a02 * a20) * det;
    out[5] = (-a12 * a00 + a02 * a10) * det;
    out[6] = b21 * det;
    out[7] = (-a21 * a00 + a01 * a20) * det;
    out[8] = (a11 * a00 - a01 * a10) * det;
    return out;
};

/**
 * Calculates the adjugate of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    out[0] = (a11 * a22 - a12 * a21);
    out[1] = (a02 * a21 - a01 * a22);
    out[2] = (a01 * a12 - a02 * a11);
    out[3] = (a12 * a20 - a10 * a22);
    out[4] = (a00 * a22 - a02 * a20);
    out[5] = (a02 * a10 - a00 * a12);
    out[6] = (a10 * a21 - a11 * a20);
    out[7] = (a01 * a20 - a00 * a21);
    out[8] = (a00 * a11 - a01 * a10);
    return out;
};

/**
 * Calculates the determinant of a mat3
 *
 * @param {mat3} a the source matrix
 * @returns {Number} determinant of a
 */
mat3.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
};

/**
 * Multiplies two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
mat3.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b00 = b[0], b01 = b[1], b02 = b[2],
        b10 = b[3], b11 = b[4], b12 = b[5],
        b20 = b[6], b21 = b[7], b22 = b[8];

    out[0] = b00 * a00 + b01 * a10 + b02 * a20;
    out[1] = b00 * a01 + b01 * a11 + b02 * a21;
    out[2] = b00 * a02 + b01 * a12 + b02 * a22;

    out[3] = b10 * a00 + b11 * a10 + b12 * a20;
    out[4] = b10 * a01 + b11 * a11 + b12 * a21;
    out[5] = b10 * a02 + b11 * a12 + b12 * a22;

    out[6] = b20 * a00 + b21 * a10 + b22 * a20;
    out[7] = b20 * a01 + b21 * a11 + b22 * a21;
    out[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return out;
};

/**
 * Alias for {@link mat3.multiply}
 * @function
 */
mat3.mul = mat3.multiply;

/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to translate
 * @param {vec2} v vector to translate by
 * @returns {mat3} out
 */
mat3.translate = function(out, a, v) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],
        x = v[0], y = v[1];

    out[0] = a00;
    out[1] = a01;
    out[2] = a02;

    out[3] = a10;
    out[4] = a11;
    out[5] = a12;

    out[6] = x * a00 + y * a10 + a20;
    out[7] = x * a01 + y * a11 + a21;
    out[8] = x * a02 + y * a12 + a22;
    return out;
};

/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
mat3.rotate = function (out, a, rad) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        s = Math.sin(rad),
        c = Math.cos(rad);

    out[0] = c * a00 + s * a10;
    out[1] = c * a01 + s * a11;
    out[2] = c * a02 + s * a12;

    out[3] = c * a10 - s * a00;
    out[4] = c * a11 - s * a01;
    out[5] = c * a12 - s * a02;

    out[6] = a20;
    out[7] = a21;
    out[8] = a22;
    return out;
};

/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/
mat3.scale = function(out, a, v) {
    var x = v[0], y = v[1];

    out[0] = x * a[0];
    out[1] = x * a[1];
    out[2] = x * a[2];

    out[3] = y * a[3];
    out[4] = y * a[4];
    out[5] = y * a[5];

    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.translate(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {vec2} v Translation vector
 * @returns {mat3} out
 */
mat3.fromTranslation = function(out, v) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = v[0];
    out[7] = v[1];
    out[8] = 1;
    return out;
}

/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.rotate(dest, dest, rad);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
mat3.fromRotation = function(out, rad) {
    var s = Math.sin(rad), c = Math.cos(rad);

    out[0] = c;
    out[1] = s;
    out[2] = 0;

    out[3] = -s;
    out[4] = c;
    out[5] = 0;

    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.scale(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat3} out
 */
mat3.fromScaling = function(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;

    out[3] = 0;
    out[4] = v[1];
    out[5] = 0;

    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
}

/**
 * Copies the values from a mat2d into a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat2d} a the matrix to copy
 * @returns {mat3} out
 **/
mat3.fromMat2d = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = 0;

    out[3] = a[2];
    out[4] = a[3];
    out[5] = 0;

    out[6] = a[4];
    out[7] = a[5];
    out[8] = 1;
    return out;
};

/**
* Calculates a 3x3 matrix from the given quaternion
*
* @param {mat3} out mat3 receiving operation result
* @param {quat} q Quaternion to create matrix from
*
* @returns {mat3} out
*/
mat3.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[3] = yx - wz;
    out[6] = zx + wy;

    out[1] = yx + wz;
    out[4] = 1 - xx - zz;
    out[7] = zy - wx;

    out[2] = zx - wy;
    out[5] = zy + wx;
    out[8] = 1 - xx - yy;

    return out;
};

/**
* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
*
* @param {mat3} out mat3 receiving operation result
* @param {mat4} a Mat4 to derive the normal matrix from
*
* @returns {mat3} out
*/
mat3.normalFromMat4 = function (out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

    out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

    out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

    return out;
};

/**
 * Returns a string representation of a mat3
 *
 * @param {mat3} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat3.str = function (a) {
    return 'mat3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
                    a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + 
                    a[6] + ', ' + a[7] + ', ' + a[8] + ')';
};

/**
 * Returns Frobenius norm of a mat3
 *
 * @param {mat3} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat3.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2)))
};


module.exports = mat3;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = __webpack_require__(7);

/**
 * @class 3 Dimensional Vector
 * @name vec3
 */
var vec3 = {};

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */
vec3.create = function() {
    var out = new glMatrix.ARRAY_TYPE(3);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    return out;
};

/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {vec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */
vec3.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(3);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */
vec3.fromValues = function(x, y, z) {
    var out = new glMatrix.ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */
vec3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */
vec3.set = function(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
};

/**
 * Alias for {@link vec3.subtract}
 * @function
 */
vec3.sub = vec3.subtract;

/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
};

/**
 * Alias for {@link vec3.multiply}
 * @function
 */
vec3.mul = vec3.multiply;

/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    return out;
};

/**
 * Alias for {@link vec3.divide}
 * @function
 */
vec3.div = vec3.divide;

/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    return out;
};

/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    return out;
};

/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */
vec3.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out;
};

/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */
vec3.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} distance between a and b
 */
vec3.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.distance}
 * @function
 */
vec3.dist = vec3.distance;

/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec3.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */
vec3.sqrDist = vec3.squaredDistance;

/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */
vec3.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.length}
 * @function
 */
vec3.len = vec3.length;

/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec3.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */
vec3.sqrLen = vec3.squaredLength;

/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */
vec3.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
};

/**
 * Returns the inverse of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to invert
 * @returns {vec3} out
 */
vec3.inverse = function(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  return out;
};

/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */
vec3.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    var len = x*x + y*y + z*z;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */
vec3.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.cross = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2],
        bx = b[0], by = b[1], bz = b[2];

    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
};

/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
vec3.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return out;
};

/**
 * Performs a hermite interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {vec3} c the third operand
 * @param {vec3} d the fourth operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
vec3.hermite = function (out, a, b, c, d, t) {
  var factorTimes2 = t * t,
      factor1 = factorTimes2 * (2 * t - 3) + 1,
      factor2 = factorTimes2 * (t - 2) + t,
      factor3 = factorTimes2 * (t - 1),
      factor4 = factorTimes2 * (3 - 2 * t);
  
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  
  return out;
};

/**
 * Performs a bezier interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {vec3} c the third operand
 * @param {vec3} d the fourth operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
vec3.bezier = function (out, a, b, c, d, t) {
  var inverseFactor = 1 - t,
      inverseFactorTimesTwo = inverseFactor * inverseFactor,
      factorTimes2 = t * t,
      factor1 = inverseFactorTimesTwo * inverseFactor,
      factor2 = 3 * t * inverseFactorTimesTwo,
      factor3 = 3 * factorTimes2 * inverseFactor,
      factor4 = factorTimes2 * t;
  
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  
  return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */
vec3.random = function (out, scale) {
    scale = scale || 1.0;

    var r = glMatrix.RANDOM() * 2.0 * Math.PI;
    var z = (glMatrix.RANDOM() * 2.0) - 1.0;
    var zScale = Math.sqrt(1.0-z*z) * scale;

    out[0] = Math.cos(r) * zScale;
    out[1] = Math.sin(r) * zScale;
    out[2] = z * scale;
    return out;
};

/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2],
        w = m[3] * x + m[7] * y + m[11] * z + m[15];
    w = w || 1.0;
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return out;
};

/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat3 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];
    return out;
};

/**
 * Transforms the vec3 with a quat
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec3} out
 */
vec3.transformQuat = function(out, a, q) {
    // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations

    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return out;
};

/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateX = function(out, a, b, c){
   var p = [], r=[];
	  //Translate point to the origin
	  p[0] = a[0] - b[0];
	  p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];

	  //perform rotation
	  r[0] = p[0];
	  r[1] = p[1]*Math.cos(c) - p[2]*Math.sin(c);
	  r[2] = p[1]*Math.sin(c) + p[2]*Math.cos(c);

	  //translate to correct position
	  out[0] = r[0] + b[0];
	  out[1] = r[1] + b[1];
	  out[2] = r[2] + b[2];

  	return out;
};

/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateY = function(out, a, b, c){
  	var p = [], r=[];
  	//Translate point to the origin
  	p[0] = a[0] - b[0];
  	p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];
  
  	//perform rotation
  	r[0] = p[2]*Math.sin(c) + p[0]*Math.cos(c);
  	r[1] = p[1];
  	r[2] = p[2]*Math.cos(c) - p[0]*Math.sin(c);
  
  	//translate to correct position
  	out[0] = r[0] + b[0];
  	out[1] = r[1] + b[1];
  	out[2] = r[2] + b[2];
  
  	return out;
};

/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateZ = function(out, a, b, c){
  	var p = [], r=[];
  	//Translate point to the origin
  	p[0] = a[0] - b[0];
  	p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];
  
  	//perform rotation
  	r[0] = p[0]*Math.cos(c) - p[1]*Math.sin(c);
  	r[1] = p[0]*Math.sin(c) + p[1]*Math.cos(c);
  	r[2] = p[2];
  
  	//translate to correct position
  	out[0] = r[0] + b[0];
  	out[1] = r[1] + b[1];
  	out[2] = r[2] + b[2];
  
  	return out;
};

/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec3.forEach = (function() {
    var vec = vec3.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 3;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2];
        }
        
        return a;
    };
})();

/**
 * Get the angle between two 3D vectors
 * @param {vec3} a The first operand
 * @param {vec3} b The second operand
 * @returns {Number} The angle in radians
 */
vec3.angle = function(a, b) {
   
    var tempA = vec3.fromValues(a[0], a[1], a[2]);
    var tempB = vec3.fromValues(b[0], b[1], b[2]);
 
    vec3.normalize(tempA, tempA);
    vec3.normalize(tempB, tempB);
 
    var cosine = vec3.dot(tempA, tempB);

    if(cosine > 1.0){
        return 0;
    } else {
        return Math.acos(cosine);
    }     
};

/**
 * Returns a string representation of a vector
 *
 * @param {vec3} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec3.str = function (a) {
    return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';
};

module.exports = vec3;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = __webpack_require__(7);

/**
 * @class 4 Dimensional Vector
 * @name vec4
 */
var vec4 = {};

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */
vec4.create = function() {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    return out;
};

/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param {vec4} a vector to clone
 * @returns {vec4} a new 4D vector
 */
vec4.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */
vec4.fromValues = function(x, y, z, w) {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the source vector
 * @returns {vec4} out
 */
vec4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */
vec4.set = function(out, x, y, z, w) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    return out;
};

/**
 * Alias for {@link vec4.subtract}
 * @function
 */
vec4.sub = vec4.subtract;

/**
 * Multiplies two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    out[3] = a[3] * b[3];
    return out;
};

/**
 * Alias for {@link vec4.multiply}
 * @function
 */
vec4.mul = vec4.multiply;

/**
 * Divides two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    out[3] = a[3] / b[3];
    return out;
};

/**
 * Alias for {@link vec4.divide}
 * @function
 */
vec4.div = vec4.divide;

/**
 * Returns the minimum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    out[3] = Math.min(a[3], b[3]);
    return out;
};

/**
 * Returns the maximum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    out[3] = Math.max(a[3], b[3]);
    return out;
};

/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */
vec4.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    return out;
};

/**
 * Adds two vec4's after scaling the second operand by a scalar value
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec4} out
 */
vec4.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    out[3] = a[3] + (b[3] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} distance between a and b
 */
vec4.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.distance}
 * @function
 */
vec4.dist = vec4.distance;

/**
 * Calculates the squared euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec4.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredDistance}
 * @function
 */
vec4.sqrDist = vec4.squaredDistance;

/**
 * Calculates the length of a vec4
 *
 * @param {vec4} a vector to calculate length of
 * @returns {Number} length of a
 */
vec4.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.length}
 * @function
 */
vec4.len = vec4.length;

/**
 * Calculates the squared length of a vec4
 *
 * @param {vec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec4.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredLength}
 * @function
 */
vec4.sqrLen = vec4.squaredLength;

/**
 * Negates the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to negate
 * @returns {vec4} out
 */
vec4.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = -a[3];
    return out;
};

/**
 * Returns the inverse of the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to invert
 * @returns {vec4} out
 */
vec4.inverse = function(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  out[3] = 1.0 / a[3];
  return out;
};

/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to normalize
 * @returns {vec4} out
 */
vec4.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    var len = x*x + y*y + z*z + w*w;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
        out[0] = x * len;
        out[1] = y * len;
        out[2] = z * len;
        out[3] = w * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} dot product of a and b
 */
vec4.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
};

/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec4} out
 */
vec4.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    out[3] = aw + t * (b[3] - aw);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec4} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec4} out
 */
vec4.random = function (out, scale) {
    scale = scale || 1.0;

    //TODO: This is a pretty awful way of doing this. Find something better.
    out[0] = glMatrix.RANDOM();
    out[1] = glMatrix.RANDOM();
    out[2] = glMatrix.RANDOM();
    out[3] = glMatrix.RANDOM();
    vec4.normalize(out, out);
    vec4.scale(out, out, scale);
    return out;
};

/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec4} out
 */
vec4.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2], w = a[3];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    return out;
};

/**
 * Transforms the vec4 with a quat
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec4} out
 */
vec4.transformQuat = function(out, a, q) {
    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    out[3] = a[3];
    return out;
};

/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec4.forEach = (function() {
    var vec = vec4.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 4;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2]; vec[3] = a[i+3];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2]; a[i+3] = vec[3];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec4} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec4.str = function (a) {
    return 'vec4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

module.exports = vec4;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _Constants = __webpack_require__(14);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// ----------------------------------------------------------------------------
// vtkOpenGLVertexArrayObject methods
// ----------------------------------------------------------------------------

function vtkOpenGLVertexArrayObject(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkOpenGLVertexArrayObject');

  // Public API methods
  publicAPI.exposedMethod = function () {
    // This is a publicly exposed method of this object
  };

  publicAPI.initialize = function () {
    model.extension = model.context.getExtension('OES_vertex_array_object');

    // Start setting up VAO
    if (!model.forceEmulation && model.extension) {
      model.supported = true;
      model.handleVAO = model.extension.createVertexArrayOES();
    } else {
      model.supported = false;
    }
  };

  publicAPI.isReady = function () {
    return (
      // We either probed and allocated a VAO, or are falling back as the current
      // hardware does not support VAOs.
      model.handleVAO !== 0 || model.supported === false
    );
  };

  publicAPI.bind = function () {
    // Either simply bind the VAO, or emulate behavior by binding all attributes.
    if (!publicAPI.isReady()) {
      publicAPI.initialize();
    }
    if (publicAPI.isReady() && model.supported) {
      model.extension.bindVertexArrayOES(model.handleVAO);
    } else if (publicAPI.isReady()) {
      var gl = model.context;
      Object.keys(model.buffers).map(function (key) {
        return model.buffers[key];
      }).forEach(function (buff) {
        model.context.bindBuffer(gl.ARRAY_BUFFER, buff.buffer);
        Object.keys(buff.attributes).map(function (key) {
          return buff.attributes[key];
        }).forEach(function (attrIt) {
          var matrixCount = attrIt.isMatrix ? attrIt.size : 1;
          for (var i = 0; i < matrixCount; ++i) {
            gl.enableVertexAttribArray(attrIt.index + i);
            gl.vertexAttribPointer(attrIt.index + i, attrIt.size, attrIt.type, attrIt.normalize, attrIt.stride, attrIt.offset + attrIt.stride * i / attrIt.size);
            if (attrIt.divisor > 0) {
              gl.vertexAttribDivisor(attrIt.index + i, 1);
            }
          }
        });
        // gl.bindBuffer(gl.ARRAY_BUFFER, 0);
      });
    }
  };

  publicAPI.release = function () {
    // Either simply release the VAO, or emulate behavior by releasing all attributes.
    if (publicAPI.isReady() && model.supported) {
      model.extension.bindVertexArrayOES(null);
    } else if (publicAPI.isReady()) {
      var gl = model.context;
      Object.keys(model.buffers).map(function (key) {
        return model.buffers[key];
      }).forEach(function (buff) {
        Object.keys(buff.attributes).map(function (key) {
          return buff.attributes[key];
        }).forEach(function (attrIt) {
          var matrixCount = attrIt.isMatrix ? attrIt.size : 1;
          for (var i = 0; i < matrixCount; ++i) {
            gl.enableVertexAttribArray(attrIt.index + i);
            gl.vertexAttribPointer(attrIt.index + i, attrIt.size, attrIt.type, attrIt.normalize, attrIt.stride, attrIt.offset + attrIt.stride * i / attrIt.size);
            if (attrIt.divisor > 0) {
              gl.vertexAttribDivisor(attrIt.index + i, 0);
            }
            gl.disableVertexAttribArray(attrIt.index + i);
          }
        });
      });
    }
  };

  publicAPI.shaderProgramChanged = function () {
    publicAPI.release();
    if (model.handleVAO) {
      model.extension.deleteVertexArrayOES(model.handleVAO);
    }
    model.handleVAO = 0;
    model.handleProgram = 0;
  };

  publicAPI.releaseGraphicsResources = function () {
    publicAPI.shaderProgramChanged();
    if (model.handleVAO) {
      model.extension.deleteVertexArrayOES(model.handleVAO);
    }
    model.handleVAO = 0;
    model.supported = true;
    model.handleProgram = 0;
  };

  publicAPI.addAttributeArray = function (program, buffer, name, offset, stride, elementType, elementTupleSize, normalize) {
    return publicAPI.addAttributeArrayWithDivisor(program, buffer, name, offset, stride, elementType, elementTupleSize, normalize, 0, false);
  };

  publicAPI.addAttributeArrayWithDivisor = function (program, buffer, name, offset, stride, elementType, elementTupleSize, normalize, divisor, isMatrix) {
    if (!program) {
      return false;
    }

    // Check the program is bound, and the buffer is valid.
    if (!program.isBound() || buffer.getHandle() === 0 || buffer.getType() !== _Constants.ObjectType.ARRAY_BUFFER) {
      return false;
    }

    // Perform initalization if necessary, ensure program matches VAOs.
    if (model.handleProgram === 0) {
      model.handleProgram = program.getHandle();
    }
    if (!publicAPI.isReady()) {
      publicAPI.initialize();
    }
    if (!publicAPI.isReady() || model.handleProgram !== program.getHandle()) {
      return false;
    }

    var gl = model.context;

    var attribs = {};
    attribs.index = gl.getAttribLocation(model.handleProgram, name);
    attribs.offset = offset;
    attribs.stride = stride;
    //    attribs.type = convertTypeToGL(elementType);
    attribs.type = elementType;
    attribs.size = elementTupleSize;
    attribs.normalize = normalize;
    attribs.isMatrix = isMatrix;
    attribs.divisor = divisor;

    if (attribs.Index === -1) {
      return false;
    }

    // Always make the call as even the first use wants the attrib pointer setting
    // up when we are emulating.
    buffer.bind();
    gl.enableVertexAttribArray(attribs.index);
    gl.vertexAttribPointer(attribs.index, attribs.size, attribs.type, attribs.normalize, attribs.stride, attribs.offset);

    if (divisor > 0) {
      gl.vertexAttribDivisor(attribs.index, 1);
    }

    // If vertex array objects are not supported then build up our list.
    if (!model.supported) {
      var handleBuffer = buffer.getHandle();
      // find the buffer
      if (Object.keys(model.buffers).indexOf(handleBuffer) !== -1) {
        model.buffers[handleBuffer].attributes[attribs.index] = attribs;
        model.buffers[handleBuffer].buffer = handleBuffer;
      } else {
        // a single handle can have multiple attribs
        model.buffers[handleBuffer] = { buffer: handleBuffer, attributes: _defineProperty({}, attribs.index, attribs) };
      }
    }
    return true;
  };

  publicAPI.addAttributeMatrixWithDivisor = function (program, buffer, name, offset, stride, elementType, elementTupleSize, normalize, divisor) {
    // bind the first row of values
    var result = publicAPI.addAttributeArrayWithDivisor(program, buffer, name, offset, stride, elementType, elementTupleSize, normalize, divisor, true);

    if (!result) {
      return result;
    }

    var gl = model.context;

    var index = gl.getAttribLocation(model.handleProgram, name);

    for (var i = 1; i < elementTupleSize; i++) {
      gl.enableVertexAttribArray(index + i);
      //      gl.vertexAttribPointer(index + i, elementTupleSize, convertTypeToGL(elementType),
      gl.vertexAttribPointer(index + i, elementTupleSize, elementType, normalize, stride, offset + stride * i / elementTupleSize);
      if (divisor > 0) {
        gl.vertexAttribDivisor(index + i, 1);
      }
    }

    return true;
  };

  publicAPI.removeAttributeArray = function (name) {
    if (!publicAPI.isReady() || model.handleProgram === 0) {
      return false;
    }

    var gl = model.context;
    var location = gl.getAttribLocation(model.handleProgram, name);

    if (location === -1) {
      return false;
    }

    gl.disableVertexAttribArray(location);
    // If we don't have real VAOs find the entry and remove it too.
    if (!model.supported) {
      Object.keys(model.buffers).map(function (key) {
        return model.buffers[key];
      }).forEach(function (buff) {
        delete buff.attributes[location];
      });
    }

    return true;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  forceEmulation: false,
  handleVAO: 0,
  handleProgram: 0,
  supported: true,
  buffers: null,
  context: null
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Internal objects initialization
  model.buffers = {};

  // Object methods
  _macro2.default.obj(publicAPI, model);

  // Create get-only macros
  _macro2.default.get(publicAPI, model, ['supported']);

  // Create get-set macros
  _macro2.default.setGet(publicAPI, model, ['context', 'forceEmulation']);

  // For more macro methods, see "Sources/macro.js"

  // Object specific methods
  vtkOpenGLVertexArrayObject(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkOpenGLVertexArrayObject');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = "//VTK::System::Dec\n\n/*=========================================================================\n\n  Program:   Visualization Toolkit\n  Module:    vtkPolyDataVS.glsl\n\n  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen\n  All rights reserved.\n  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.\n\n     This software is distributed WITHOUT ANY WARRANTY; without even\n     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR\n     PURPOSE.  See the above copyright notice for more information.\n\n=========================================================================*/\n\nattribute vec4 vertexMC;\n\n// frag position in VC\n//VTK::PositionVC::Dec\n\n// optional normal declaration\n//VTK::Normal::Dec\n\n// extra lighting parameters\n//VTK::Light::Dec\n\n// Texture coordinates\n//VTK::TCoord::Dec\n\n// material property values\n//VTK::Color::Dec\n\n// clipping plane vars\n//VTK::Clip::Dec\n\n// camera and actor matrix values\n//VTK::Camera::Dec\n\n// Apple Bug\n//VTK::PrimID::Dec\n\nvoid main()\n{\n  //VTK::Color::Impl\n\n  //VTK::Normal::Impl\n\n  //VTK::TCoord::Impl\n\n  //VTK::Clip::Impl\n\n  //VTK::PrimID::Impl\n\n  //VTK::PositionVC::Impl\n\n  //VTK::Light::Impl\n}\n"

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = exports.STATIC = exports.INIT_BOUNDS = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _Plane = __webpack_require__(88);

var _Plane2 = _interopRequireDefault(_Plane);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var INIT_BOUNDS = exports.INIT_BOUNDS = [Number.MAX_VALUE, -Number.MAX_VALUE, // X
Number.MAX_VALUE, -Number.MAX_VALUE, // Y
Number.MAX_VALUE, -Number.MAX_VALUE];

// ----------------------------------------------------------------------------
// Global methods
// ----------------------------------------------------------------------------

function isValid(bounds) {
  return bounds[0] <= bounds[1] && bounds[2] <= bounds[3] && bounds[4] <= bounds[5];
}

function getCenter(bounds) {
  return [0.5 * (bounds[0] + bounds[1]), 0.5 * (bounds[2] + bounds[3]), 0.5 * (bounds[4] + bounds[5])];
}

function getLength(bounds, index) {
  return bounds[index * 2 + 1] - bounds[index * 2];
}

function getLengths(bounds) {
  return [getLength(bounds, 0), getLength(bounds, 1), getLength(bounds, 2)];
}

function getXRange(bounds) {
  return bounds.slice(0, 2);
}

function getYRange(bounds) {
  return bounds.slice(2, 4);
}

function getZRange(bounds) {
  return bounds.slice(4, 6);
}

function getMaxLength(bounds) {
  var l = getLengths(bounds);
  if (l[0] > l[1]) {
    if (l[0] > l[2]) {
      return l[0];
    }
    return l[2];
  } else if (l[1] > l[2]) {
    return l[1];
  }
  return l[2];
}

function getDiagonalLength(bounds) {
  if (isValid(bounds)) {
    var l = getLengths(bounds);
    return Math.sqrt(l[0] * l[0] + l[1] * l[1] + l[2] * l[2]);
  }
  return null;
}

function oppositeSign(a, b) {
  return a <= 0 && b >= 0 || a >= 0 && b <= 0;
}

// ----------------------------------------------------------------------------
// Static API
// ----------------------------------------------------------------------------

var STATIC = exports.STATIC = {
  isValid: isValid,
  getCenter: getCenter,
  getLength: getLength,
  getLengths: getLengths,
  getMaxLength: getMaxLength,
  getDiagonalLength: getDiagonalLength,
  getXRange: getXRange,
  getYRange: getYRange,
  getZRange: getZRange
};

// ----------------------------------------------------------------------------
// vtkBoundingBox methods
// ----------------------------------------------------------------------------

function vtkBoundingBox(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkBoundingBox');

  publicAPI.clone = function () {
    var bounds = [].concat(model.bounds);
    /* eslint-disable no-use-before-define */
    return newInstance({ bounds: bounds });
    /* eslint-enable no-use-before-define */
  };

  publicAPI.equals = function (other) {
    var a = model.bounds;
    var b = other.getBounds();
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5];
  };

  publicAPI.setMinPoint = function (x, y, z) {
    var _model$bounds = _slicedToArray(model.bounds, 6),
        xMin = _model$bounds[0],
        xMax = _model$bounds[1],
        yMin = _model$bounds[2],
        yMax = _model$bounds[3],
        zMin = _model$bounds[4],
        zMax = _model$bounds[5];

    model.bounds = [x, x > xMax ? x : xMax, y, y > yMax ? y : yMax, z, z > zMax ? z : zMax];

    return xMin !== x || yMin !== y || zMin !== z;
  };

  publicAPI.setMaxPoint = function (x, y, z) {
    var _model$bounds2 = _slicedToArray(model.bounds, 6),
        xMin = _model$bounds2[0],
        xMax = _model$bounds2[1],
        yMin = _model$bounds2[2],
        yMax = _model$bounds2[3],
        zMin = _model$bounds2[4],
        zMax = _model$bounds2[5];

    model.bounds = [x < xMin ? x : xMin, x, y < yMin ? y : yMin, y, z < zMin ? z : zMin, z];

    return xMax !== x || yMax !== y || zMax !== z;
  };

  publicAPI.addPoint = function () {
    for (var _len = arguments.length, xyz = Array(_len), _key = 0; _key < _len; _key++) {
      xyz[_key] = arguments[_key];
    }

    model.bounds = model.bounds.map(function (value, index) {
      if (index % 2 === 0) {
        var _idx = index / 2;
        return value < xyz[_idx] ? value : xyz[_idx];
      }
      var idx = (index - 1) / 2;
      return value > xyz[idx] ? value : xyz[idx];
    });
  };

  publicAPI.addBounds = function (xMin, xMax, yMin, yMax, zMin, zMax) {
    var _model$bounds3 = _slicedToArray(model.bounds, 6),
        _xMin = _model$bounds3[0],
        _xMax = _model$bounds3[1],
        _yMin = _model$bounds3[2],
        _yMax = _model$bounds3[3],
        _zMin = _model$bounds3[4],
        _zMax = _model$bounds3[5];

    model.bounds = [Math.min(xMin, _xMin), Math.max(xMax, _xMax), Math.min(yMin, _yMin), Math.max(yMax, _yMax), Math.min(zMin, _zMin), Math.max(zMax, _zMax)];
  };

  publicAPI.addBox = function (other) {
    publicAPI.addBounds.apply(publicAPI, _toConsumableArray(other.getBounds()));
  };

  publicAPI.isValid = function () {
    return isValid(model.bounds);
  };

  publicAPI.intersect = function (bbox) {
    if (!(publicAPI.isValid() && bbox.isValid())) {
      return false;
    }

    var newBounds = [0, 0, 0, 0, 0, 0];
    var bBounds = bbox.getBounds();
    var intersects = void 0;
    for (var i = 0; i < 3; i++) {
      intersects = false;
      if (bBounds[i * 2] >= model.bounds[i * 2] && bBounds[i * 2] <= model.bounds[i * 2 + 1]) {
        intersects = true;
        newBounds[i * 2] = bBounds[i * 2];
      } else if (model.bounds[i * 2] >= bBounds[i * 2] && model.bounds[i * 2] <= bBounds[i * 2 + 1]) {
        intersects = true;
        newBounds[i * 2] = model.bounds[i * 2];
      }

      if (bBounds[i * 2 + 1] >= model.bounds[i * 2] && bBounds[i * 2 + 1] <= model.bounds[i * 2 + 1]) {
        intersects = true;
        newBounds[i * 2 + 1] = bbox.MaxPnt[i];
      } else if (model.bounds[i * 2 + 1] >= bbox.MinPnt[i * 2] && model.bounds[i * 2 + 1] <= bbox.MaxPnt[i * 2 + 1]) {
        intersects = true;
        newBounds[i * 2 + 1] = model.bounds[i * 2 + 1];
      }

      if (!intersects) {
        return false;
      }
    }

    // OK they did intersect - set the box to be the result
    model.bounds = newBounds;
    return true;
  };

  publicAPI.intersects = function (bbox) {
    if (!(publicAPI.isValid() && bbox.isValid())) {
      return false;
    }
    var bBounds = bbox.getBounds();
    /* eslint-disable no-continue */
    for (var i = 0; i < 3; i++) {
      if (bBounds[i * 2] >= model.bounds[i * 2] && bBounds[i * 2] <= model.bounds[i * 2 + 1]) {
        continue;
      } else if (model.bounds[i * 2] >= bBounds[i * 2] && model.bounds[i * 2] <= bBounds[i * 2 + 1]) {
        continue;
      }

      if (bBounds[i * 2 + 1] >= model.bounds[i * 2] && bBounds[i * 2 + 1] <= model.bounds[i * 2 + 1]) {
        continue;
      } else if (model.bounds[i * 2 + 1] >= bbox.MinPnt[i * 2] && model.bounds[i * 2 + 1] <= bbox.MaxPnt[i * 2 + 1]) {
        continue;
      }
      return false;
    }
    /* eslint-enable no-continue */

    return true;
  };

  publicAPI.intersectPlane = function (origin, normal) {
    // Index[0..2] represents the order of traversing the corners of a cube
    // in (x,y,z), (y,x,z) and (z,x,y) ordering, respectively
    var index = [[0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 4, 5, 2, 3, 6, 7], [0, 2, 4, 6, 1, 3, 5, 7]];

    // stores the signed distance to a plane
    var d = [0, 0, 0, 0, 0, 0, 0, 0];
    var idx = 0;
    for (var ix = 0; ix < 2; ix++) {
      for (var iy = 2; iy < 4; iy++) {
        for (var iz = 4; iz < 6; iz++) {
          var x = [model.bounds[ix], model.bounds[iy], model.bounds[iz]];
          d[idx++] = _Plane2.default.evaluate(normal, origin, x);
        }
      }
    }

    var dir = 2;
    while (dir--) {
      // in each direction, we test if the vertices of two orthogonal faces
      // are on either side of the plane
      if (oppositeSign(d[index[dir][0]], d[index[dir][4]]) && oppositeSign(d[index[dir][1]], d[index[dir][5]]) && oppositeSign(d[index[dir][2]], d[index[dir][6]]) && oppositeSign(d[index[dir][3]], d[index[dir][7]])) {
        break;
      }
    }

    if (dir < 0) {
      return false;
    }

    var sign = Math.sign(normal[dir]);
    var size = Math.abs((model.bounds[dir * 2 + 1] - model.bounds[dir * 2]) * normal[dir]);
    var t = sign > 0 ? 1 : 0;
    /* eslint-disable no-continue */
    for (var i = 0; i < 4; i++) {
      if (size === 0) {
        continue; // shouldn't happen
      }
      var ti = Math.abs(d[index[dir][i]]) / size;
      if (sign > 0 && ti < t) {
        t = ti;
      }

      if (sign < 0 && ti > t) {
        t = ti;
      }
    }
    /* eslint-enable no-continue */
    var bound = (1.0 - t) * model.bounds[dir * 2] + t * model.bounds[dir * 2 + 1];

    if (sign > 0) {
      model.bounds[dir * 2] = bound;
    } else {
      model.bounds[dir * 2 + 1] = bound;
    }

    return true;
  };

  publicAPI.containsPoint = function (x, y, z) {
    if (x < model.bounds[0] || x > model.bounds[1]) {
      return false;
    }

    if (y < model.bounds[2] || y > model.bounds[3]) {
      return false;
    }

    if (z < model.bounds[4] || z > model.bounds[5]) {
      return false;
    }

    return true;
  };

  publicAPI.getMinPoint = function () {
    return [model.bounds[0], model.bounds[2], model.bounds[4]];
  };
  publicAPI.getMaxPoint = function () {
    return [model.bounds[1], model.bounds[3], model.bounds[5]];
  };
  publicAPI.getBound = function (index) {
    return model.bound[index];
  };

  publicAPI.contains = function (bbox) {
    // if either box is not valid or they don't intersect
    if (!publicAPI.intersects(bbox)) {
      return false;
    }

    if (!publicAPI.containsPoint.apply(publicAPI, _toConsumableArray(bbox.getMinPoint()))) {
      return false;
    }

    if (!publicAPI.containsPoint.apply(publicAPI, _toConsumableArray(bbox.getMaxPoint()))) {
      return 0;
    }

    return true;
  };

  publicAPI.getCenter = function () {
    return getCenter(model.bounds);
  };
  publicAPI.getLength = function (index) {
    return getLength(model.bounds, index);
  };
  publicAPI.getLengths = function () {
    return getLengths(model.bounds);
  };
  publicAPI.getMaxLength = function () {
    return getMaxLength(model.bounds);
  };
  publicAPI.getDiagonalLength = function () {
    return getDiagonalLength(model.bounds);
  };

  publicAPI.reset = function () {
    return publicAPI.setBounds([].concat(INIT_BOUNDS));
  };

  publicAPI.inflate = function (delta) {
    model.bounds = model.bounds.map(function (value, index) {
      if (index % 2 === 0) {
        return value - delta;
      }
      return value + delta;
    });
  };

  publicAPI.scale = function (sx, sy, sz) {
    if (publicAPI.isValid()) {
      var newBounds = [].concat(model.bounds);
      if (sx >= 0.0) {
        newBounds[0] *= sx;
        newBounds[1] *= sx;
      } else {
        newBounds[0] = sx * model.bounds[1];
        newBounds[1] = sx * model.bounds[0];
      }

      if (sy >= 0.0) {
        newBounds[2] *= sy;
        newBounds[3] *= sy;
      } else {
        newBounds[2] = sy * model.bounds[3];
        newBounds[3] = sy * model.bounds[2];
      }

      if (sz >= 0.0) {
        newBounds[4] *= sz;
        newBounds[5] *= sz;
      } else {
        newBounds[4] = sz * model.bounds[5];
        newBounds[5] = sz * model.bounds[4];
      }

      model.bounds = newBounds;
      return true;
    }
    return false;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  type: 'vtkBoundingBox',
  bounds: [].concat(INIT_BOUNDS)
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  _macro2.default.obj(publicAPI, model);
  _macro2.default.setGet(publicAPI, model, ['bounds']);
  vtkBoundingBox(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkBoundingBox');

// ----------------------------------------------------------------------------

exports.default = Object.assign({ newInstance: newInstance, extend: extend }, STATIC);

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var States = exports.States = {
  IS_START: 0,
  IS_NONE: 0,

  IS_ROTATE: 1,
  IS_PAN: 2,
  IS_SPIN: 3,
  IS_DOLLY: 4,
  IS_ZOOM: 5,
  IS_USCALE: 6,
  IS_TIMER: 7,
  IS_FORWARDFLY: 8,
  IS_REVERSEFLY: 9,
  IS_TWO_POINTER: 10,

  IS_ANIM_OFF: 0,
  IS_ANIM_ON: 1,

  IS_WINDOW_LEVEL: 1024,
  IS_PICK: 1025,
  IS_SLICE: 1026
};

exports.default = {
  States: States
};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _DataArray = __webpack_require__(6);

var _DataArray2 = _interopRequireDefault(_DataArray);

var _Constants = __webpack_require__(5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vtkErrorMacro = _macro2.default.vtkErrorMacro;

// ----------------------------------------------------------------------------
// vtkPoints methods
// ----------------------------------------------------------------------------

function vtkPoints(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkPoints');

  // Forwarding methods
  publicAPI.getNumberOfPoints = publicAPI.getNumberOfTuples;

  publicAPI.setNumberOfPoints = function (nbPoints) {
    var dimension = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;

    if (publicAPI.getNumberOfPoints() !== nbPoints) {
      model.size = nbPoints * dimension;
      model.values = new window[model.dataType](model.size);
      publicAPI.setNumberOfComponents(dimension);
      publicAPI.modified();
    }
  };

  publicAPI.setPoint = function (idx) {
    for (var _len = arguments.length, xyz = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      xyz[_key - 1] = arguments[_key];
    }

    var offset = idx * model.numberOfComponents;
    for (var i = 0; i < model.numberOfComponents; i++) {
      model.values[offset + i] = xyz[i];
    }
  };

  publicAPI.getPoint = publicAPI.getTuple;

  publicAPI.getBounds = function () {
    if (publicAPI.getNumberOfComponents() === 3) {
      return [].concat(publicAPI.getRange(0), publicAPI.getRange(1), publicAPI.getRange(2));
    }

    if (publicAPI.getNumberOfComponents() !== 2) {
      vtkErrorMacro('getBounds called on an array with components of\n        ' + publicAPI.getNumberOfComponents());
      return [1, -1, 1, -1, 1, -1];
    }

    return [].concat(publicAPI.getRange(0), publicAPI.getRange(1));
  };

  // Trigger the computation of bounds
  publicAPI.computeBounds = publicAPI.getBounds;
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  empty: true,
  numberOfComponents: 3,
  dataType: _Constants.VtkDataTypes.FLOAT
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  _DataArray2.default.extend(publicAPI, model, initialValues);
  vtkPoints(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkPoints');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _vtk = __webpack_require__(9);

var _vtk2 = _interopRequireDefault(_vtk);

var _DataSetAttributes = __webpack_require__(96);

var _DataSetAttributes2 = _interopRequireDefault(_DataSetAttributes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import vtkBoundingBox from '../BoundingBox';
// import vtkMath from '../../Core/Math';
//
// function getBounds(dataset) {
//   if (dataset.bounds) {
//     return dataset.bounds;
//   }
//   if (dataset.type && dataset[dataset.type]) {
//     const ds = dataset[dataset.type];
//     if (ds.bounds) {
//       return ds.bounds;
//     }
//     if (ds.Points && ds.Points.bounds) {
//       return ds.Points.bounds;
//     }

//     if (ds.Points && ds.Points.values) {
//       const array = ds.Points.values;
//       const bbox = vtkBoundingBox.newInstance();
//       const size = array.length;
//       const delta = ds.Points.numberOfComponents ? ds.Points.numberOfComponents : 3;
//       for (let idx = 0; idx < size; idx += delta) {
//         bbox.addPoint(array[idx * delta], array[(idx * delta) + 1], array[(idx * delta) + 2]);
//       }
//       ds.Points.bounds = bbox.getBounds();
//       return ds.Points.bounds;
//     }
//   }
//   return vtkMath.createUninitializedBounds();
// }

// ----------------------------------------------------------------------------
// Global methods
// ----------------------------------------------------------------------------

var DATASET_FIELDS = ['pointData', 'cellData', 'fieldData'];

// ----------------------------------------------------------------------------
// vtkDataSet methods
// ----------------------------------------------------------------------------

function vtkDataSet(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkDataSet');

  // Add dataset attributes
  DATASET_FIELDS.forEach(function (fieldName) {
    if (!model[fieldName]) {
      model[fieldName] = _DataSetAttributes2.default.newInstance();
    } else {
      model[fieldName] = (0, _vtk2.default)(model[fieldName]);
    }
  });
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  // pointData: null,
  // cellData: null,
  // fieldData: null,
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  _macro2.default.obj(publicAPI, model);
  _macro2.default.setGet(publicAPI, model, DATASET_FIELDS);

  // Object specific methods
  vtkDataSet(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkDataSet');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _glMatrix = __webpack_require__(2);

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _Prop3D = __webpack_require__(99);

var _Prop3D2 = _interopRequireDefault(_Prop3D);

var _Property = __webpack_require__(101);

var _Property2 = _interopRequireDefault(_Property);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vtkDebugMacro = _macro2.default.vtkDebugMacro;

// ----------------------------------------------------------------------------
// vtkActor methods
// ----------------------------------------------------------------------------

function vtkActor(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkActor');

  // Capture 'parentClass' api for internal use
  var superClass = Object.assign({}, publicAPI);

  publicAPI.getActors = function () {
    return publicAPI;
  };

  publicAPI.getIsOpaque = function () {
    if (model.forceOpaque) {
      return true;
    }
    if (model.forceTranslucent) {
      return false;
    }
    // make sure we have a property
    if (!model.property) {
      // force creation of a property
      publicAPI.getProperty();
    }

    var isOpaque = model.property.getOpacity() >= 1.0;

    // are we using an opaque texture, if any?
    isOpaque = isOpaque && (!model.texture || !model.texture.isTranslucent());

    // are we using an opaque scalar array, if any?
    isOpaque = isOpaque && (!model.mapper || model.mapper.getIsOpaque());

    return isOpaque;
  };

  publicAPI.hasTranslucentPolygonalGeometry = function () {
    if (model.mapper === null) {
      return false;
    }
    // make sure we have a property
    if (model.property === null) {
      // force creation of a property
      publicAPI.setProperty(publicAPI.makeProperty());
    }

    // is this actor opaque ?
    return !publicAPI.getIsOpaque();
  };

  publicAPI.makeProperty = _Property2.default.newInstance;

  publicAPI.getProperty = function () {
    if (model.property === null) {
      model.property = publicAPI.makeProperty();
    }
    return model.property;
  };

  publicAPI.getBounds = function () {
    if (model.mapper === null) {
      return model.bounds;
    }

    // Check for the special case when the mapper's bounds are unknown
    var bds = model.mapper.getBounds();
    if (!bds || bds.length !== 6) {
      return bds;
    }

    // Check for the special case when the actor is empty.
    if (bds[0] > bds[1]) {
      model.mapperBounds = bds.concat(); // copy the mapper's bounds
      model.bounds = [1, -1, 1, -1, 1, -1];
      model.boundsMTime.modified();
      return bds;
    }

    // Check if we have cached values for these bounds - we cache the
    // values returned by model.mapper.getBounds() and we store the time
    // of caching. If the values returned this time are different, or
    // the modified time of this class is newer than the cached time,
    // then we need to rebuild.
    var zip = function zip(rows) {
      return rows[0].map(function (_, c) {
        return rows.map(function (row) {
          return row[c];
        });
      });
    };
    if (!model.mapperBounds || !zip([bds, model.mapperBounds]).reduce(function (a, b) {
      return a && b[0] === b[1];
    }, true) || publicAPI.getMTime() > model.boundsMTime.getMTime()) {
      vtkDebugMacro('Recomputing bounds...');
      model.mapperBounds = bds.map(function (x) {
        return x;
      });
      var bbox = [_glMatrix.vec3.fromValues(bds[1], bds[3], bds[5]), _glMatrix.vec3.fromValues(bds[1], bds[2], bds[5]), _glMatrix.vec3.fromValues(bds[0], bds[2], bds[5]), _glMatrix.vec3.fromValues(bds[0], bds[3], bds[5]), _glMatrix.vec3.fromValues(bds[1], bds[3], bds[4]), _glMatrix.vec3.fromValues(bds[1], bds[2], bds[4]), _glMatrix.vec3.fromValues(bds[0], bds[2], bds[4]), _glMatrix.vec3.fromValues(bds[0], bds[3], bds[4])];

      publicAPI.computeMatrix();
      var tmp4 = _glMatrix.mat4.create();
      _glMatrix.mat4.transpose(tmp4, model.matrix);
      bbox.forEach(function (pt) {
        return _glMatrix.vec3.transformMat4(pt, pt, tmp4);
      });

      /* eslint-disable no-multi-assign */
      model.bounds[0] = model.bounds[2] = model.bounds[4] = Number.MAX_VALUE;
      model.bounds[1] = model.bounds[3] = model.bounds[5] = -Number.MAX_VALUE;
      /* eslint-enable no-multi-assign */
      model.bounds = model.bounds.map(function (d, i) {
        return i % 2 === 0 ? bbox.reduce(function (a, b) {
          return a > b[i / 2] ? b[i / 2] : a;
        }, d) : bbox.reduce(function (a, b) {
          return a < b[(i - 1) / 2] ? b[(i - 1) / 2] : a;
        }, d);
      });
      model.boundsMTime.modified();
    }
    return model.bounds;
  };

  publicAPI.getMTime = function () {
    var mt = superClass.getMTime();
    if (model.property !== null) {
      var time = model.property.getMTime();
      mt = time > mt ? time : mt;
    }

    if (model.backfaceProperty !== null) {
      var _time = model.backfaceProperty.getMTime();
      mt = _time > mt ? _time : mt;
    }

    return mt;
  };

  publicAPI.getRedrawMTime = function () {
    var mt = model.mtime;
    if (model.mapper !== null) {
      var time = model.mapper.getMTime();
      mt = time > mt ? time : mt;
      if (model.mapper.getInput() !== null) {
        // FIXME !!! getInputAlgorithm / getInput
        model.mapper.getInputAlgorithm().update();
        time = model.mapper.getInput().getMTime();
        mt = time > mt ? time : mt;
      }
    }
    return mt;
  };

  publicAPI.getSupportsSelection = function () {
    return model.mapper ? model.mapper.getSupportsSelection() : false;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  mapper: null,
  property: null,
  backfaceProperty: null,

  forceOpaque: false,
  forceTranslucent: false,

  bounds: [1, -1, 1, -1, 1, -1]
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  _Prop3D2.default.extend(publicAPI, model, initialValues);

  // vtkTimeStamp
  model.boundsMTime = {};
  _macro2.default.obj(model.boundsMTime);

  // Build VTK API
  _macro2.default.set(publicAPI, model, ['property']);
  _macro2.default.setGet(publicAPI, model, ['backfaceProperty', 'forceOpaque', 'forceTranslucent', 'mapper']);
  _macro2.default.getArray(publicAPI, model, ['bounds'], 6);

  // Object methods
  vtkActor(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkActor');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _AbstractMapper3D = __webpack_require__(102);

var _AbstractMapper3D2 = _interopRequireDefault(_AbstractMapper3D);

var _DataArray = __webpack_require__(6);

var _DataArray2 = _interopRequireDefault(_DataArray);

var _ImageData = __webpack_require__(104);

var _ImageData2 = _interopRequireDefault(_ImageData);

var _LookupTable = __webpack_require__(106);

var _LookupTable2 = _interopRequireDefault(_LookupTable);

var _Math = __webpack_require__(1);

var _Math2 = _interopRequireDefault(_Math);

var _Constants = __webpack_require__(23);

var _CoincidentTopologyHelper = __webpack_require__(108);

var _CoincidentTopologyHelper2 = _interopRequireDefault(_CoincidentTopologyHelper);

var _Static = __webpack_require__(109);

var _Static2 = _interopRequireDefault(_Static);

var _Constants2 = __webpack_require__(21);

var _Constants3 = _interopRequireDefault(_Constants2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ColorMode = _Constants3.default.ColorMode,
    ScalarMode = _Constants3.default.ScalarMode,
    MaterialMode = _Constants3.default.MaterialMode,
    GetArray = _Constants3.default.GetArray;

// ----------------------------------------------------------------------------

function notImplemented(method) {
  return function () {
    return _macro2.default.vtkErrorMacro('vtkMapper::' + method + ' - NOT IMPLEMENTED');
  };
}

// CoincidentTopology static methods ------------------------------------------
/* eslint-disable arrow-body-style */

var staticOffsetModel = {
  Polygon: { factor: 2, offset: 0 },
  Line: { factor: 1, offset: -1 },
  Point: { factor: 0, offset: -2 }
};
var staticOffsetAPI = {};

_CoincidentTopologyHelper2.default.addCoincidentTopologyMethods(staticOffsetAPI, staticOffsetModel, _CoincidentTopologyHelper2.default.CATEGORIES.map(function (key) {
  return { key: key, method: 'ResolveCoincidentTopology' + key + 'OffsetParameters' };
}));

// ----------------------------------------------------------------------------
// vtkMapper methods
// ----------------------------------------------------------------------------

function vtkMapper(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkMapper');

  publicAPI.getBounds = function () {
    var input = publicAPI.getInputData();
    if (!input) {
      model.bounds = _Math2.default.createUninitializedBounds();
    } else {
      if (!model.static) {
        publicAPI.update();
      }
      model.bounds = input.getBounds();
    }
    return model.bounds;
  };

  publicAPI.update = function () {
    publicAPI.getInputData();
  };

  publicAPI.setForceCompileOnly = function (v) {
    model.forceCompileOnly = v;
    // make sure we do NOT call modified()
  };

  publicAPI.createDefaultLookupTable = function () {
    model.lookupTable = _LookupTable2.default.newInstance();
  };

  publicAPI.getColorModeAsString = function () {
    return _macro2.default.enumToString(ColorMode, model.colorMode);
  };

  publicAPI.setColorModeToDefault = function () {
    return publicAPI.setColorMode(0);
  };
  publicAPI.setColorModeToMapScalars = function () {
    return publicAPI.setColorMode(1);
  };
  publicAPI.setColorModeToDirectScalars = function () {
    return publicAPI.setColorMode(2);
  };

  publicAPI.getScalarModeAsString = function () {
    return _macro2.default.enumToString(ScalarMode, model.scalarMode);
  };

  publicAPI.setScalarModeToDefault = function () {
    return publicAPI.setScalarMode(0);
  };
  publicAPI.setScalarModeToUsePointData = function () {
    return publicAPI.setScalarMode(1);
  };
  publicAPI.setScalarModeToUseCellData = function () {
    return publicAPI.setScalarMode(2);
  };
  publicAPI.setScalarModeToUsePointFieldData = function () {
    return publicAPI.setScalarMode(3);
  };
  publicAPI.setScalarModeToUseCellFieldData = function () {
    return publicAPI.setScalarMode(4);
  };
  publicAPI.setScalarModeToUseFieldData = function () {
    return publicAPI.setScalarMode(5);
  };

  // Add Static methods to our instance
  Object.keys(_Static2.default).forEach(function (methodName) {
    publicAPI[methodName] = _Static2.default[methodName];
  });
  Object.keys(staticOffsetAPI).forEach(function (methodName) {
    publicAPI[methodName] = staticOffsetAPI[methodName];
  });

  // Relative metods
  /* eslint-disable arrow-body-style */
  model.topologyOffset = {
    Polygon: { factor: 0, offset: 0 },
    Line: { factor: 0, offset: 0 },
    Point: { factor: 0, offset: 0 }
  };
  _CoincidentTopologyHelper2.default.addCoincidentTopologyMethods(publicAPI, model.topologyOffset, _CoincidentTopologyHelper2.default.CATEGORIES.map(function (key) {
    return { key: key, method: 'RelativeCoincidentTopology' + key + 'OffsetParameters' };
  }));
  /* eslint-enable arrow-body-style */

  publicAPI.getCoincidentTopologyPolygonOffsetParameters = function () {
    var globalValue = staticOffsetAPI.getResolveCoincidentTopologyPolygonOffsetParameters();
    var localValue = publicAPI.getRelativeCoincidentTopologyPolygonOffsetParameters();
    return {
      factor: globalValue.factor + localValue.factor,
      offset: globalValue.offset + localValue.offset
    };
  };

  publicAPI.getCoincidentTopologyLineOffsetParameters = function () {
    var globalValue = staticOffsetAPI.getResolveCoincidentTopologyLineOffsetParameters();
    var localValue = publicAPI.getRelativeCoincidentTopologyLineOffsetParameters();
    return {
      factor: globalValue.factor + localValue.factor,
      offset: globalValue.offset + localValue.offset
    };
  };

  publicAPI.getCoincidentTopologyPointOffsetParameter = function () {
    var globalValue = staticOffsetAPI.getResolveCoincidentTopologyPointOffsetParameters();
    var localValue = publicAPI.getRelativeCoincidentTopologyPointOffsetParameters();
    return {
      factor: globalValue.factor + localValue.factor,
      offset: globalValue.offset + localValue.offset
    };
  };

  publicAPI.getAbstractScalars = function (input, scalarMode, arrayAccessMode, arrayId, arrayName) {
    // make sure we have an input
    if (!input || !model.scalarVisibility) {
      return null;
    }

    var scalars = null;

    // get and scalar data according to scalar mode
    if (scalarMode === ScalarMode.DEFAULT) {
      scalars = input.getPointData().getScalars();
      if (!scalars) {
        scalars = input.getCellData().getScalars();
      }
    } else if (scalarMode === ScalarMode.USE_POINT_DATA) {
      scalars = input.getPointData().getScalars();
    } else if (scalarMode === ScalarMode.USE_CELL_DATA) {
      scalars = input.getCellData().getScalars();
    } else if (scalarMode === ScalarMode.USE_POINT_FIELD_DATA) {
      var pd = input.getPointData();
      if (arrayAccessMode === GetArray.BY_ID) {
        scalars = pd.getArrayByIndex(arrayId);
      } else {
        scalars = pd.getArrayByName(arrayName);
      }
    } else if (scalarMode === ScalarMode.USE_CELL_FIELD_DATA) {
      var cd = input.getCellData();
      if (arrayAccessMode === GetArray.BY_ID) {
        scalars = cd.getArrayByIndex(arrayId);
      } else {
        scalars = cd.getArrayByName(arrayName);
      }
    } else if (scalarMode === ScalarMode.USE_FIELD_DATA) {
      var fd = input.getFieldData();
      if (arrayAccessMode === GetArray.BY_ID) {
        scalars = fd.getArrayByIndex(arrayId);
      } else {
        scalars = fd.getArrayByName(arrayName);
      }
    }

    return scalars;
  };

  publicAPI.mapScalars = function (input, alpha) {
    var scalars = publicAPI.getAbstractScalars(input, model.scalarMode, model.arrayAccessMode, model.arrayId, model.colorByArrayName);

    if (!scalars) {
      model.colorCoordinates = null;
      model.colorTextureMap = null;
      model.colorMapColors = null;
      return;
    }

    if (!model.useLookupTableScalarRange) {
      publicAPI.getLookupTable().setRange(model.scalarRange[0], model.scalarRange[1]);
    }

    // Decide betweeen texture color or vertex color.
    // Cell data always uses vertex color.
    // Only point data can use both texture and vertex coloring.
    if (publicAPI.canUseTextureMapForColoring(input)) {
      publicAPI.mapScalarsToTexture(scalars, alpha);
      return;
    }

    model.colorCoordinates = null;
    model.colorTextureMap = null;

    var lut = publicAPI.getLookupTable();
    if (lut) {
      // Ensure that the lookup table is built
      lut.build();
      model.colorMapColors = lut.mapScalars(scalars, model.colorMode, 0);
    }
  };

  //-----------------------------------------------------------------------------
  publicAPI.scalarToTextureCoordinate = function (scalarValue, // Input scalar
  rangeMin, // range[0]
  invRangeWidth) {
    // 1/(range[1]-range[0])
    var texCoordS = 0.5; // Scalar value is arbitrary when NaN
    var texCoordT = 1.0; // 1.0 in t coordinate means NaN
    if (!_Math2.default.isNan(scalarValue)) {
      // 0.0 in t coordinate means not NaN.  So why am I setting it to 0.49?
      // Because when you are mapping scalars and you have a NaN adjacent to
      // anything else, the interpolation everywhere should be NaN.  Thus, I
      // want the NaN color everywhere except right on the non-NaN neighbors.
      // To simulate this, I set the t coord for the real numbers close to
      // the threshold so that the interpolation almost immediately looks up
      // the NaN value.
      texCoordT = 0.49;

      texCoordS = (scalarValue - rangeMin) * invRangeWidth;

      // Some implementations apparently don't handle relatively large
      // numbers (compared to the range [0.0, 1.0]) very well. In fact,
      // values above 1122.0f appear to cause texture wrap-around on
      // some systems even when edge clamping is enabled. Why 1122.0f? I
      // don't know. For safety, we'll clamp at +/- 1000. This will
      // result in incorrect images when the texture value should be
      // above or below 1000, but I don't have a better solution.
      if (texCoordS > 1000.0) {
        texCoordS = 1000.0;
      } else if (texCoordS < -1000.0) {
        texCoordS = -1000.0;
      }
    }
    return { texCoordS: texCoordS, texCoordT: texCoordT };
  };

  //-----------------------------------------------------------------------------
  publicAPI.createColorTextureCoordinates = function (input, output, numScalars, numComps, component, range, tableRange, tableNumberOfColors, useLogScale) {
    // We have to change the range used for computing texture
    // coordinates slightly to accomodate the special above- and
    // below-range colors that are the first and last texels,
    // respectively.
    var scalarTexelWidth = (range[1] - range[0]) / tableNumberOfColors;

    var paddedRange = [];
    paddedRange[0] = range[0] - scalarTexelWidth;
    paddedRange[1] = range[1] + scalarTexelWidth;
    var invRangeWidth = 1.0 / (paddedRange[1] - paddedRange[0]);

    var outputV = output.getData();
    var inputV = input.getData();

    var count = 0;
    var outputCount = 0;
    if (component < 0 || component >= numComps) {
      for (var scalarIdx = 0; scalarIdx < numScalars; ++scalarIdx) {
        var sum = 0;
        for (var compIdx = 0; compIdx < numComps; ++compIdx) {
          sum += inputV[count] * inputV[count];
          count++;
        }
        var magnitude = Math.sqrt(sum);
        if (useLogScale) {
          magnitude = _LookupTable2.default.applyLogScale(magnitude, tableRange, range);
        }
        var outputs = publicAPI.scalarToTextureCoordinate(magnitude, paddedRange[0], invRangeWidth);
        outputV[outputCount] = outputs.texCoordS;
        outputV[outputCount + 1] = outputs.texCoordT;
        outputCount += 2;
      }
    } else {
      count += component;
      for (var _scalarIdx = 0; _scalarIdx < numScalars; ++_scalarIdx) {
        var inputValue = inputV[count];
        if (useLogScale) {
          inputValue = _LookupTable2.default.applyLogScale(inputValue, tableRange, range);
        }
        var _outputs = publicAPI.scalarToTextureCoordinate(inputValue, paddedRange[0], invRangeWidth);
        outputV[outputCount] = _outputs.texCoordS;
        outputV[outputCount + 1] = _outputs.texCoordT;
        outputCount += 2;
        count += numComps;
      }
    }
  };

  publicAPI.mapScalarsToTexture = function (scalars, alpha) {
    var range = model.lookupTable.getRange();
    var useLogScale = model.lookupTable.usingLogScale();
    if (useLogScale) {
      // convert range to log.
      _LookupTable2.default.getLogRange(range, range);
    }

    var origAlpha = model.lookupTable.getAlpha();

    // Get rid of vertex color array.  Only texture or vertex coloring
    // can be active at one time.  The existence of the array is the
    // signal to use that technique.
    model.colorMapColors = null;

    // If the lookup table has changed, then recreate the color texture map.
    // Set a new lookup table changes this->MTime.
    if (model.colorTextureMap == null || publicAPI.getMTime() > model.colorTextureMap.getMTime() || model.lookupTable.getMTime() > model.colorTextureMap.getMTime() || model.lookupTable.getAlpha() !== alpha) {
      model.lookupTable.setAlpha(alpha);
      model.colorTextureMap = null;

      // Get the texture map from the lookup table.
      // Create a dummy ramp of scalars.
      // In the future, we could extend vtkScalarsToColors.
      model.lookupTable.build();
      var numberOfColors = model.lookupTable.getNumberOfAvailableColors();
      if (numberOfColors > 4094) {
        numberOfColors = 4094;
      }
      numberOfColors += 2;
      var k = (range[1] - range[0]) / (numberOfColors - 1 - 2);

      var newArray = new Float64Array(numberOfColors * 2);

      for (var i = 0; i < numberOfColors; ++i) {
        newArray[i] = range[0] + i * k - k; // minus k to start at below range color
        if (useLogScale) {
          newArray[i] = Math.pow(10.0, newArray[i]);
        }
      }
      // Dimension on NaN.
      for (var _i = 0; _i < numberOfColors; ++_i) {
        newArray[_i + numberOfColors] = NaN;
      }

      model.colorTextureMap = _ImageData2.default.newInstance();
      model.colorTextureMap.setExtent(0, numberOfColors - 1, 0, 1, 0, 0);

      var tmp = _DataArray2.default.newInstance({ numberOfComponents: 1, values: newArray });

      model.colorTextureMap.getPointData().setScalars(model.lookupTable.mapScalars(tmp, model.colorMode, 0));
      model.lookupTable.setAlpha(origAlpha);
    }

    // Create new coordinates if necessary.
    // Need to compare lookup table incase the range has changed.
    if (!model.colorCoordinates || publicAPI.getMTime() > model.colorCoordinates.getMTime() || publicAPI.getInputData(0).getMTime() > model.colorCoordinates.getMTime() || model.lookupTable.getMTime() > model.colorCoordinates.getMTime()) {
      // Get rid of old colors
      model.colorCoordinates = null;

      // Now create the color texture coordinates.
      var numComps = scalars.getNumberOfComponents();
      var num = scalars.getNumberOfTuples();

      // const fArray = new FloatArray(num * 2);
      model.colorCoordinates = _DataArray2.default.newInstance({ numberOfComponents: 2, values: new Float32Array(num * 2) });

      var scalarComponent = model.lookupTable.getVectorComponent();
      // Although I like the feature of applying magnitude to single component
      // scalars, it is not how the old MapScalars for vertex coloring works.
      if (model.lookupTable.getVectorMode() === _Constants.VectorMode.MAGNITUDE && scalars.getNumberOfComponents() > 1) {
        scalarComponent = -1;
      }

      publicAPI.createColorTextureCoordinates(scalars, model.colorCoordinates, num, numComps, scalarComponent, range, model.lookupTable.getRange(), model.colorTextureMap.getPointData().getScalars().getNumberOfTuples() / 2 - 2, useLogScale);
    }
  };

  publicAPI.setScalarMaterialModeToDefault = function () {
    return publicAPI.setScalarMaterialMode(MaterialMode.DEFAULT);
  };
  publicAPI.setScalarMaterialModeToAmbient = function () {
    return publicAPI.setScalarMaterialMode(MaterialMode.AMBIENT);
  };
  publicAPI.setScalarMaterialModeToDiffuse = function () {
    return publicAPI.setScalarMaterialMode(MaterialMode.DIFFUSE);
  };
  publicAPI.setScalarMaterialModeToAmbientAndDiffuse = function () {
    return publicAPI.setScalarMaterialMode(MaterialMode.AMBIENT_AND_DIFFUSE);
  };
  publicAPI.getScalarMaterialModeAsString = function () {
    return _macro2.default.enumToString(MaterialMode, model.scalarMaterialMode);
  };

  publicAPI.getIsOpaque = function () {
    var lut = publicAPI.getLookupTable();
    if (lut) {
      // Ensure that the lookup table is built
      lut.build();
      return lut.isOpaque();
    }
    return true;
  };

  publicAPI.canUseTextureMapForColoring = function (input) {
    if (!model.interpolateScalarsBeforeMapping) {
      return false; // user doesn't want us to use texture maps at all.
    }

    // index color does not use textures
    if (model.lookupTable && model.lookupTable.getIndexedLookup()) {
      return false;
    }

    return true;
  };

  publicAPI.clearColorArrays = function () {
    model.colorMapColors = null;
    model.colorCoordinates = null;
    model.colorTextureMap = null;
  };

  publicAPI.getLookupTable = function () {
    if (!model.lookupTable) {
      publicAPI.createDefaultLookupTable();
    }
    return model.lookupTable;
  };

  publicAPI.getMTime = function () {
    var mt = model.mtime;
    if (model.lookupTable !== null) {
      var time = model.lookupTable.getMTime();
      mt = time > mt ? time : mt;
    }
    return mt;
  };

  publicAPI.acquireInvertibleLookupTable = notImplemented('AcquireInvertibleLookupTable');
  publicAPI.valueToColor = notImplemented('ValueToColor');
  publicAPI.colorToValue = notImplemented('ColorToValue');
  publicAPI.useInvertibleColorFor = notImplemented('UseInvertibleColorFor');
  publicAPI.clearInvertibleColor = notImplemented('ClearInvertibleColor');
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  colorMapColors: null, // Same as this->Colors

  static: false,
  lookupTable: null,

  scalarVisibility: true,
  scalarRange: [0, 1],
  useLookupTableScalarRange: false,

  colorMode: 0,
  scalarMode: 0,
  scalarMaterialMode: 0,
  arrayAccessMode: 1, // By_NAME

  renderTime: 0,

  colorByArrayName: null,
  colorByArrayComponent: -1,

  fieldDataTupleId: -1,

  interpolateScalarsBeforeMapping: false,
  colorCoordinates: null,
  colorTextureMap: null,

  forceCompileOnly: 0,

  useInvertibleColors: false,
  invertibleScalars: null,
  resolveCoincidentTopology: false,

  viewSpecificProperties: null
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  _AbstractMapper3D2.default.extend(publicAPI, model, initialValues);
  _macro2.default.algo(publicAPI, model, 1, 0);

  _macro2.default.get(publicAPI, model, ['colorCoordinates', 'colorMapColors', 'colorTextureMap']);
  _macro2.default.setGet(publicAPI, model, ['colorByArrayComponent', 'colorByArrayName', 'arrayAccessMode', 'colorMode', 'fieldDataTupleId', 'interpolateScalarsBeforeMapping', 'lookupTable', 'renderTime', 'resolveCoincidentTopology', 'scalarMaterialMode', 'scalarMode', 'scalarVisibility', 'static', 'useLookupTableScalarRange', 'viewSpecificProperties']);
  _macro2.default.setGetArray(publicAPI, model, ['scalarRange'], 2);

  if (!model.viewSpecificProperties) {
    model.viewSpecificProperties = {};
  }

  // Object methods
  vtkMapper(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkMapper');

// ----------------------------------------------------------------------------

exports.default = Object.assign({ newInstance: newInstance, extend: extend }, staticOffsetAPI, _Static2.default);

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var StructuredType = exports.StructuredType = {
  UNCHANGED: 0,
  SINGLE_POINT: 1,
  X_LINE: 2,
  Y_LINE: 3,
  Z_LINE: 4,
  XY_PLANE: 5,
  YZ_PLANE: 6,
  XZ_PLANE: 7,
  XYZ_GRID: 8,
  EMPTY: 9
};

exports.default = {
  StructuredType: StructuredType
};

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _HtmlDataAccessHelper = __webpack_require__(111);

var _HtmlDataAccessHelper2 = _interopRequireDefault(_HtmlDataAccessHelper);

var _HttpDataAccessHelper = __webpack_require__(113);

var _HttpDataAccessHelper2 = _interopRequireDefault(_HttpDataAccessHelper);

var _JSZipDataAccessHelper = __webpack_require__(114);

var _JSZipDataAccessHelper2 = _interopRequireDefault(_JSZipDataAccessHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TYPE_MAPPING = {
  http: function http(options) {
    return _HttpDataAccessHelper2.default;
  },
  zip: function zip(options) {
    return _JSZipDataAccessHelper2.default.create(options);
  },
  html: function html(options) {
    return _HtmlDataAccessHelper2.default;
  }
};

function get() {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'http';
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return TYPE_MAPPING[type](options);
}

exports.default = {
  get: get
};

/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(global) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vtk_js_Sources_Rendering_Misc_FullScreenRenderWindow__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vtk_js_Sources_Rendering_Misc_FullScreenRenderWindow___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vtk_js_Sources_Rendering_Misc_FullScreenRenderWindow__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vtk_js_Sources_vtk__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vtk_js_Sources_vtk___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vtk_js_Sources_vtk__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vtk_js_Sources_Rendering_Core_Actor__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vtk_js_Sources_Rendering_Core_Actor___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_vtk_js_Sources_Rendering_Core_Actor__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vtk_js_Sources_Rendering_Core_Mapper__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vtk_js_Sources_Rendering_Core_Mapper___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_vtk_js_Sources_Rendering_Core_Mapper__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_vtk_js_Sources_IO_Misc_OBJReader__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_vtk_js_Sources_IO_Misc_OBJReader___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_vtk_js_Sources_IO_Misc_OBJReader__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_vtk_js_Sources_IO_Legacy_PolyDataReader__ = __webpack_require__(115);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_vtk_js_Sources_IO_Legacy_PolyDataReader___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_vtk_js_Sources_IO_Legacy_PolyDataReader__);







global.vtk = __WEBPACK_IMPORTED_MODULE_1_vtk_js_Sources_vtk___default.a;

angular.module("dcbia-vtk-module")
.service("dcbiaVTKService", function(){

    var nextId = 0;

    return {
    	initializeRenderWindow: function(rootContainer, container){

    	  // ----------------------------------------------------------------------------
	      // Standard rendering code setup
	      // ----------------------------------------------------------------------------
	      const fullScreenRenderer = __WEBPACK_IMPORTED_MODULE_0_vtk_js_Sources_Rendering_Misc_FullScreenRenderWindow___default.a.newInstance({ background: [255, 255, 255], rootContainer: rootContainer, container: container });
	      const renderer = fullScreenRenderer.getRenderer();
	      const renderWindow = fullScreenRenderer.getRenderWindow();
	      
	      // -----------------------------------------------------------
	      // Make some variables global so that you can inspect and
	      // modify objects in your browser's developer console:
	      // -----------------------------------------------------------

	      return {
	      	renderer: renderer,
	      	renderWindow: renderWindow
	      }
	      
    	},
    	getUniqueId: function(){
    		nextId++;
    		return Promise.resolve(nextId);
	    }, 
	    parsePolyData: function(data){
	    	const reader = __WEBPACK_IMPORTED_MODULE_5_vtk_js_Sources_IO_Legacy_PolyDataReader___default.a.newInstance();
	    	reader.parse(data);
	    	reader.update();
	    	return reader.getOutputData();
	    },
	    addPointDataArray: function(polydata, array, name, dataType){
	    	name = name? name: 'pointScalars';
	    	dataType = dataType? dataType: 'Float32Array';

	    	if(polydata && polydata.getPointData()){
	    		var pointdata = polydata.getPointData();
				
				pointdata.setScalars(__WEBPACK_IMPORTED_MODULE_1_vtk_js_Sources_vtk___default()({
					vtkClass: 'vtkDataArray',
					name: name,
					dataType: dataType,
					values: array
				}));
				
	    	}
	    },
	    newActor: function(polydata){
	    	// const mapper = vtkMapper.newInstance({ interpolateScalarsBeforeMapping: true });
	      const mapper = __WEBPACK_IMPORTED_MODULE_3_vtk_js_Sources_Rendering_Core_Mapper___default.a.newInstance();
	      mapper.setInputData(polydata);

	      const actor = __WEBPACK_IMPORTED_MODULE_2_vtk_js_Sources_Rendering_Core_Actor___default.a.newInstance();
	      actor.setMapper(mapper);

	      return {
	      	mapper: mapper,
	      	actor: actor
	      }

	    },
	    parseVTK1: function(data){
	    	  // connectivity of the triangles
		      var indices = [];

		      // triangles vertices
		      var positions = [];

		      // red, green, blue colors in the range 0 to 1
		      var colors = [];

		      // normal vector, one per vertex
		      var normals = [];

		      var result;

		      // pattern for reading vertices, 3 floats or integers
		      var pat3Floats = /(\-?\d+\.?[\d\-\+e]*)\s+(\-?\d+\.?[\d\-\+e]*)\s+(\-?\d+\.?[\d\-\+e]*)/g;

		      // pattern for connectivity, an integer followed by any number of ints
		      // the first integer is the number of polygon nodes
		      var patConnectivity = /^(\d+)\s+([\s\d]*)/;

		      // indicates start of vertex data section
		      var patPOINTS = /^POINTS /;

		      // indicates start of polygon connectivity section
		      var patPOLYGONS = /^POLYGONS /;

		      // indicates start of triangle strips section
		      var patTRIANGLE_STRIPS = /^TRIANGLE_STRIPS /;

		      // POINT_DATA number_of_values
		      var patPOINT_DATA = /^POINT_DATA[ ]+(\d+)/;

		      // CELL_DATA number_of_polys
		      var patCELL_DATA = /^CELL_DATA[ ]+(\d+)/;

		      // Start of color section
		      var patCOLOR_SCALARS = /^COLOR_SCALARS[ ]+(\w+)[ ]+3/;

		      // NORMALS Normals float
		      var patNORMALS = /^NORMALS[ ]+(\w+)[ ]+(\w+)/;

		      var inPointsSection = false;
		      var inPolygonsSection = false;
		      var inTriangleStripSection = false;
		      var inPointDataSection = false;
		      var inCellDataSection = false;
		      var inColorSection = false;
		      var inNormalsSection = false;

		      var lines = data.split( '\n' );

		      for ( var i in lines ) {

		        var line = lines[ i ];

		        if ( inPointsSection ) {

		          // get the vertices
		          while ( ( result = pat3Floats.exec( line ) ) !== null ) {

		            var x = parseFloat( result[ 1 ] );
		            var y = parseFloat( result[ 2 ] );
		            var z = parseFloat( result[ 3 ] );
		            positions.push( x, y, z );

		          }

		        } else if ( inPolygonsSection ) {

		          if ( ( result = patConnectivity.exec( line ) ) !== null ) {
		            
		            var inds = result[ 0 ].split( /\s+/ );

		            indices.push( parseInt( inds[ 0 ] ), parseInt( inds[ 1 ] ), parseInt( inds[ 2 ] ), parseInt( inds[ 3 ] ) );

		          }

		        } else if ( inTriangleStripSection ) {

		          if ( ( result = patConnectivity.exec( line ) ) !== null ) {

		            // numVertices i0 i1 i2 ...
		            var numVertices = parseInt( result[ 1 ] );
		            var inds = result[ 2 ].split( /\s+/ );

		            if ( numVertices >= 3 ) {

		              var i0, i1, i2;
		              // split the polygon in numVertices - 2 triangles
		              for ( var j = 0; j < numVertices - 2; j ++ ) {

		                if ( j % 2 === 1 ) {

		                  i0 = parseInt( inds[ j ] );
		                  i1 = parseInt( inds[ j + 2 ] );
		                  i2 = parseInt( inds[ j + 1 ] );
		                  indices.push( i0, i1, i2 );

		                } else {

		                  i0 = parseInt( inds[ j ] );
		                  i1 = parseInt( inds[ j + 1 ] );
		                  i2 = parseInt( inds[ j + 2 ] );
		                  indices.push( i0, i1, i2 );

		                }

		              }

		            }

		          }

		        } else if ( inPointDataSection || inCellDataSection ) {

		          if ( inColorSection ) {

		            // Get the colors

		            while ( ( result = pat3Floats.exec( line ) ) !== null ) {

		              var r = parseFloat( result[ 1 ] );
		              var g = parseFloat( result[ 2 ] );
		              var b = parseFloat( result[ 3 ] );
		              colors.push( r, g, b );

		            }

		          } else if ( inNormalsSection ) {

		            // Get the normal vectors

		            while ( ( result = pat3Floats.exec( line ) ) !== null ) {

		              var nx = parseFloat( result[ 1 ] );
		              var ny = parseFloat( result[ 2 ] );
		              var nz = parseFloat( result[ 3 ] );
		              normals.push( nx, ny, nz );

		            }

		          }

		        }

		        if ( patPOLYGONS.exec( line ) !== null ) {

		          inPolygonsSection = true;
		          inPointsSection = false;
		          inTriangleStripSection = false;

		        } else if ( patPOINTS.exec( line ) !== null ) {

		          inPolygonsSection = false;
		          inPointsSection = true;
		          inTriangleStripSection = false;

		        } else if ( patTRIANGLE_STRIPS.exec( line ) !== null ) {

		          inPolygonsSection = false;
		          inPointsSection = false;
		          inTriangleStripSection = true;

		        } else if ( patPOINT_DATA.exec( line ) !== null ) {

		          inPointDataSection = true;
		          inPointsSection = false;
		          inPolygonsSection = false;
		          inTriangleStripSection = false;

		        } else if ( patCELL_DATA.exec( line ) !== null ) {

		          inCellDataSection = true;
		          inPointsSection = false;
		          inPolygonsSection = false;
		          inTriangleStripSection = false;

		        } else if ( patCOLOR_SCALARS.exec( line ) !== null ) {

		          inColorSection = true;
		          inNormalsSection = false;
		          inPointsSection = false;
		          inPolygonsSection = false;
		          inTriangleStripSection = false;

		        } else if ( patNORMALS.exec( line ) !== null ) {

		          inNormalsSection = true;
		          inColorSection = false;
		          inPointsSection = false;
		          inPolygonsSection = false;
		          inTriangleStripSection = false;

		        }

		      }

		      // var polydata = {
		      // 	vtkClass: 'vtkPolyData',
		      // 	points: {
		      // 		vtkClass: 'vtkPoints',
		      // 		dataType: 'Float32Array',
		      // 		numberOfComponents: 3,
		      // 		values: [
		      // 		0, 0, 0,
		      // 		1, 0, 0.25,
		      // 		1, 1, 0,
		      // 		0, 1, 0.25,
		      // 		],
		      // 	},
		      // 	polys: {
		      // 		vtkClass: 'vtkCellArray',
		      // 		dataType: 'Uint16Array',
		      // 		values: [
		      // 		3, 0, 1, 2,
		      // 		3, 0, 2, 3,
		      // 		],
		      // 	},
		      // 	pointData: {
		      // 		vtkClass: 'vtkDataSetAttributes',
		      // 		activeScalars: 0,
		      // 		arrays: [{
		      // 			data: {
		      // 				vtkClass: 'vtkDataArray',
		      // 				name: 'pointScalars',
		      // 				dataType: 'Float32Array',
		      // 				values: [0, 1, 0, 1],
		      // 			},
		      // 		}],
		      // 	},
		      // 	cellData: {
		      // 		vtkClass: 'vtkDataSetAttributes',
		      // 		activeScalars: 0,
		      // 		arrays: [{
		      // 			data: {
		      // 				vtkClass: 'vtkDataArray',
		      // 				name: 'cellScalars',
		      // 				dataType: 'Float32Array',
		      // 				values: [0, 1],
		      // 			},
		      // 		}],
		      // 	}
		      // };
		      var polydata = {
		      	vtkClass: 'vtkPolyData'
		      }
		      var stagger = 'point';

		      if ( colors.length == indices.length ) {

		        stagger = 'cell';

		      }

		      if ( stagger == 'point' ) {

		      	polydata.points = {
		      		vtkClass: 'vtkPoints',
		      		dataType: 'Float32Array',
		      		numberOfComponents: 3, 
		      		values: new Float32Array( positions )
		      	}

		      	var colorarray;
		        if ( colors.length == positions.length ) {
		        	colorarray = {
		      			data: {
		      				vtkClass: 'vtkDataArray',
		      				name: 'colors',
		      				dataType: 'Float32Array',
		      				values: new Float32Array( colors ),
		      			},
		      		}
		        }

		        var normalarray;
		        if ( normals.length == positions.length ) {
		        	normalarray = {
		      			data: {
		      				vtkClass: 'vtkDataArray',
		      				name: 'normals',
		      				dataType: 'Float32Array',
		      				values: new Float32Array( normals ),
		      			}
		      		}
		        }

		        if(colorarray || normalarray){
		        	
		        	polydata.pointData = {
			      		vtkClass: 'vtkDataSetAttributes',
			      		activeScalars: 0,			      		
			      		arrays: _.compact([colorarray, normalarray]),
			      	}
		        }

		        polydata.polys = {
		      		vtkClass: 'vtkCellArray',
		      		dataType: 'Uint16Array',
		      		values: new Uint16Array(indices)
		      	}

		      	polydata.addPointDataArray = function(dataarray, name, type){
		      		if(!this.pointData){
		      			this.pointData = {
		      				vtkClass: 'vtkDataSetAttributes',
			      			activeScalars: 0,
			      			arrays: []
		      			}
		      		}
		      		var addarray = true;
		      		this.pointData.arrays.forEach(function(array){
		      			if(array.data && array.data.name === name){
		      				addarray = false;
		      				array.data.dataType = type;
		      				array.data.values = dataarray;		      				
		      			}
		      		})

		      		if(addarray){
		      			this.pointData.arrays.push({
			      			data: {
			      				vtkClass: 'vtkDataArray',
			      				name: name,
			      				dataType: type,
			      				values: dataarray,
			      			},
			      		})
		      		}
		      	}

		      } else {

		        // Cell centered colors. The only way to attach a solid color to each triangle
		        // is to use Geometry, which is less efficient than BufferGeometry
		        //geometry = new THREE.Geometry();

		        var numTriangles = indices.length / 3;
		        var numPoints = positions.length / 3;
		        var va, vb, vc;
		        var face;
		        var ia, ib, ic;
		        var x, y, z;
		        var r, g, b;

		        for ( var j = 0; j < numPoints; ++ j ) {

		          x = positions[ 3 * j + 0 ];
		          y = positions[ 3 * j + 1 ];
		          z = positions[ 3 * j + 2 ];
		          // geometry.vertices.push( new THREE.Vector3( x, y, z ) );

		        }

		        for ( var i = 0; i < numTriangles; ++ i ) {

		          ia = indices[ 3 * i + 0 ];
		          ib = indices[ 3 * i + 1 ];
		          ic = indices[ 3 * i + 2 ];
		          // geometry.faces.push( new THREE.Face3( ia, ib, ic ) );

		        }

		        if ( colors.length == numTriangles * 3 ) {

		          for ( var i = 0; i < numTriangles; ++ i ) {

		            face = geometry.faces[ i ];
		            r = colors[ 3 * i + 0 ];
		            g = colors[ 3 * i + 1 ];
		            b = colors[ 3 * i + 2 ];
		            // face.color = new THREE.Color().setRGB( r, g, b );

		          }

		        }

		      }

		      return polydata;
	    }
    }

});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(17)))

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _RenderWindow = __webpack_require__(25);

var _RenderWindow2 = _interopRequireDefault(_RenderWindow);

var _Renderer = __webpack_require__(84);

var _Renderer2 = _interopRequireDefault(_Renderer);

var _RenderWindow3 = __webpack_require__(89);

var _RenderWindow4 = _interopRequireDefault(_RenderWindow3);

var _RenderWindowInteractor = __webpack_require__(90);

var _RenderWindowInteractor2 = _interopRequireDefault(_RenderWindowInteractor);

__webpack_require__(34);

__webpack_require__(6);

__webpack_require__(22);

__webpack_require__(36);

__webpack_require__(37);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Load basic classes for vtk() factory


var STYLE_CONTAINER = {
  margin: '0',
  padding: '0',
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100vw',
  height: '100vh',
  overflow: 'hidden'
};

var STYLE_CONTROL_PANEL = {
  position: 'absolute',
  left: '25px',
  top: '25px',
  backgroundColor: 'white',
  borderRadius: '5px',
  listStyle: 'none',
  padding: '5px 10px',
  margin: '0',
  display: 'block',
  border: 'solid 1px black',
  maxWidth: 'calc(100vw - 70px)',
  maxHeight: 'calc(100vh - 60px)',
  overflow: 'auto'
};

function applyStyle(el, style) {
  Object.keys(style).forEach(function (key) {
    el.style[key] = style[key];
  });
}

function vtkFullScreenRenderWindow(publicAPI, model) {
  // Full screen DOM handler
  if (!model.rootContainer) {
    model.rootContainer = document.querySelector('body');
  }

  if (!model.container) {
    model.container = document.createElement('div');
    applyStyle(model.container, model.containerStyle || STYLE_CONTAINER);
    model.rootContainer.appendChild(model.container);
  }

  // VTK renderWindow/renderer
  model.renderWindow = _RenderWindow4.default.newInstance();
  model.renderer = _Renderer2.default.newInstance();
  model.renderWindow.addRenderer(model.renderer);

  // OpenGlRenderWindow
  model.openGlRenderWindow = _RenderWindow2.default.newInstance();
  model.openGlRenderWindow.setContainer(model.container);
  model.renderWindow.addView(model.openGlRenderWindow);

  // Interactor
  model.interactor = _RenderWindowInteractor2.default.newInstance();
  model.interactor.setView(model.openGlRenderWindow);
  model.interactor.initialize();
  model.interactor.bindEvents(model.container);

  // Expose background
  publicAPI.setBackground = model.renderer.setBackground;

  publicAPI.removeController = function () {
    var el = model.controlContainer;
    if (el) {
      el.parentNode.removeChild(el);
    }
  };

  publicAPI.addController = function (html) {
    model.controlContainer = document.createElement('div');
    applyStyle(model.controlContainer, model.controlPanelStyle || STYLE_CONTROL_PANEL);
    model.rootContainer.appendChild(model.controlContainer);
    model.controlContainer.innerHTML = html;

    model.rootContainer.addEventListener('keypress', function (e) {
      if (String.fromCharCode(e.charCode) === 'c') {
        if (model.controlContainer.style.display === 'none') {
          model.controlContainer.style.display = 'block';
        } else {
          model.controlContainer.style.display = 'none';
        }
      }
    });
  };

  // Update BG color
  publicAPI.setBackground.apply(publicAPI, _toConsumableArray(model.background));

  // Representation API
  publicAPI.addRepresentation = function (representation) {
    representation.getActors().forEach(function (actor) {
      model.renderer.addActor(actor);
    });
  };
  publicAPI.removeRepresentation = function (representation) {
    representation.getActors().forEach(function (actor) {
      return model.renderer.removeActor(actor);
    });
  };

  // Handle window resize
  publicAPI.resize = function () {
    var dims = model.container.getBoundingClientRect();
    model.openGlRenderWindow.setSize(dims.width, dims.height);
    if (model.resizeCallback) {
      model.resizeCallback(dims);
    }
    model.renderWindow.render();
  };

  publicAPI.setResizeCallback = function (cb) {
    model.resizeCallback = cb;
    publicAPI.resize();
  };

  if (model.listenWindowResize) {
    window.addEventListener('resize', publicAPI.resize);
  }
  publicAPI.resize();
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  background: [0.32, 0.34, 0.43],
  containerStyle: null,
  controlPanelStyle: null,
  listenWindowResize: true,
  resizeCallback: null
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  _macro2.default.obj(publicAPI, model);
  _macro2.default.get(publicAPI, model, ['renderWindow', 'renderer', 'openGlRenderWindow', 'interactor', 'container', 'controlContainer']);

  // Object specific methods
  vtkFullScreenRenderWindow(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend);

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _Framebuffer = __webpack_require__(26);

var _Framebuffer2 = _interopRequireDefault(_Framebuffer);

var _RenderPass = __webpack_require__(57);

var _RenderPass2 = _interopRequireDefault(_RenderPass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------------------------------------------------------------

function vtkForwardPass(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkForwardPass');

  publicAPI.getOperation = function () {
    return model.currentOperation;
  };

  // this pass implements a forward rendering pipeline
  // if both volumes and opaque geometry are present
  // it will mix the two together by capturing a zbuffer
  // first
  publicAPI.traverse = function (viewNode) {
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    if (model.deleted) {
      return;
    }

    // we just render our delegates in order
    model.currentParent = parent;

    // build
    model.currentOperation = 'buildPass';
    viewNode.traverse(publicAPI);

    // check for both opaque and volume actors
    model.opaqueActorCount = 0;
    model.translucentActorCount = 0;
    model.volumeCount = 0;
    model.currentOperation = 'queryPass';
    viewNode.traverse(publicAPI);

    // do we need to capture a zbuffer?
    if (model.opaqueActorCount > 0 && model.volumeCount > 0 || model.depthRequested) {
      var size = viewNode.getSize();
      // make sure the framebuffer is setup
      if (model.framebuffer === null) {
        model.framebuffer = _Framebuffer2.default.newInstance();
      }
      model.framebuffer.setWindow(viewNode);
      model.framebuffer.saveCurrentBindingsAndBuffers();
      var fbSize = model.framebuffer.getSize();
      if (fbSize === null || fbSize[0] !== size[0] || fbSize[1] !== size[1]) {
        model.framebuffer.create(size[0], size[1]);
        model.framebuffer.populateFramebuffer();
      }
      model.framebuffer.bind();
      model.currentOperation = 'opaqueZBufferPass';
      viewNode.traverse(publicAPI);
      model.framebuffer.restorePreviousBindingsAndBuffers();
    }

    model.currentOperation = 'cameraPass';
    viewNode.traverse(publicAPI);
    if (model.opaqueActorCount > 0) {
      model.currentOperation = 'opaquePass';
      viewNode.traverse(publicAPI);
    }
    if (model.translucentActorCount > 0) {
      model.currentOperation = 'translucentPass';
      viewNode.traverse(publicAPI);
    }
    if (model.volumeCount > 0) {
      model.currentOperation = 'volumePass';
      viewNode.traverse(publicAPI);
    }
  };

  publicAPI.getZBufferTexture = function () {
    if (model.framebuffer) {
      return model.framebuffer.getColorTexture();
    }
    return null;
  };

  publicAPI.incrementOpaqueActorCount = function () {
    return model.opaqueActorCount++;
  };
  publicAPI.incrementTranslucentActorCount = function () {
    return model.translucentActorCount++;
  };
  publicAPI.incrementVolumeCount = function () {
    return model.volumeCount++;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  opaqueActorCount: 0,
  translucentActorCount: 0,
  volumeCount: 0,
  framebuffer: null,
  depthRequested: false
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  _RenderPass2.default.extend(publicAPI, model, initialValues);

  _macro2.default.get(publicAPI, model, ['framebuffer']);
  _macro2.default.setGet(publicAPI, model, ['depthRequested']);

  // Object methods
  vtkForwardPass(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkForwardPass');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = __webpack_require__(7);

/**
 * @class 2x2 Matrix
 * @name mat2
 */
var mat2 = {};

/**
 * Creates a new identity mat2
 *
 * @returns {mat2} a new 2x2 matrix
 */
mat2.create = function() {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Creates a new mat2 initialized with values from an existing matrix
 *
 * @param {mat2} a matrix to clone
 * @returns {mat2} a new 2x2 matrix
 */
mat2.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Copy the values from one mat2 to another
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Set a mat2 to the identity matrix
 *
 * @param {mat2} out the receiving matrix
 * @returns {mat2} out
 */
mat2.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Transpose the values of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a1 = a[1];
        out[1] = a[2];
        out[2] = a1;
    } else {
        out[0] = a[0];
        out[1] = a[2];
        out[2] = a[1];
        out[3] = a[3];
    }
    
    return out;
};

/**
 * Inverts a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.invert = function(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],

        // Calculate the determinant
        det = a0 * a3 - a2 * a1;

    if (!det) {
        return null;
    }
    det = 1.0 / det;
    
    out[0] =  a3 * det;
    out[1] = -a1 * det;
    out[2] = -a2 * det;
    out[3] =  a0 * det;

    return out;
};

/**
 * Calculates the adjugate of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.adjoint = function(out, a) {
    // Caching this value is nessecary if out == a
    var a0 = a[0];
    out[0] =  a[3];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] =  a0;

    return out;
};

/**
 * Calculates the determinant of a mat2
 *
 * @param {mat2} a the source matrix
 * @returns {Number} determinant of a
 */
mat2.determinant = function (a) {
    return a[0] * a[3] - a[2] * a[1];
};

/**
 * Multiplies two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */
mat2.multiply = function (out, a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    return out;
};

/**
 * Alias for {@link mat2.multiply}
 * @function
 */
mat2.mul = mat2.multiply;

/**
 * Rotates a mat2 by the given angle
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */
mat2.rotate = function (out, a, rad) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = a0 *  c + a2 * s;
    out[1] = a1 *  c + a3 * s;
    out[2] = a0 * -s + a2 * c;
    out[3] = a1 * -s + a3 * c;
    return out;
};

/**
 * Scales the mat2 by the dimensions in the given vec2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2} out
 **/
mat2.scale = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        v0 = v[0], v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v0;
    out[2] = a2 * v1;
    out[3] = a3 * v1;
    return out;
};

/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat2.identity(dest);
 *     mat2.rotate(dest, dest, rad);
 *
 * @param {mat2} out mat2 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */
mat2.fromRotation = function(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = c;
    out[1] = s;
    out[2] = -s;
    out[3] = c;
    return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat2.identity(dest);
 *     mat2.scale(dest, dest, vec);
 *
 * @param {mat2} out mat2 receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat2} out
 */
mat2.fromScaling = function(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = v[1];
    return out;
}

/**
 * Returns a string representation of a mat2
 *
 * @param {mat2} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat2.str = function (a) {
    return 'mat2(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

/**
 * Returns Frobenius norm of a mat2
 *
 * @param {mat2} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat2.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2)))
};

/**
 * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
 * @param {mat2} L the lower triangular matrix 
 * @param {mat2} D the diagonal matrix 
 * @param {mat2} U the upper triangular matrix 
 * @param {mat2} a the input matrix to factorize
 */

mat2.LDU = function (L, D, U, a) { 
    L[2] = a[2]/a[0]; 
    U[0] = a[0]; 
    U[1] = a[1]; 
    U[3] = a[3] - L[2] * U[1]; 
    return [L, D, U];       
}; 


module.exports = mat2;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = __webpack_require__(7);

/**
 * @class 2x3 Matrix
 * @name mat2d
 * 
 * @description 
 * A mat2d contains six elements defined as:
 * <pre>
 * [a, c, tx,
 *  b, d, ty]
 * </pre>
 * This is a short form for the 3x3 matrix:
 * <pre>
 * [a, c, tx,
 *  b, d, ty,
 *  0, 0, 1]
 * </pre>
 * The last row is ignored so the array is shorter and operations are faster.
 */
var mat2d = {};

/**
 * Creates a new identity mat2d
 *
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.create = function() {
    var out = new glMatrix.ARRAY_TYPE(6);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Creates a new mat2d initialized with values from an existing matrix
 *
 * @param {mat2d} a matrix to clone
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(6);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Copy the values from one mat2d to another
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
mat2d.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Set a mat2d to the identity matrix
 *
 * @param {mat2d} out the receiving matrix
 * @returns {mat2d} out
 */
mat2d.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Inverts a mat2d
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
mat2d.invert = function(out, a) {
    var aa = a[0], ab = a[1], ac = a[2], ad = a[3],
        atx = a[4], aty = a[5];

    var det = aa * ad - ab * ac;
    if(!det){
        return null;
    }
    det = 1.0 / det;

    out[0] = ad * det;
    out[1] = -ab * det;
    out[2] = -ac * det;
    out[3] = aa * det;
    out[4] = (ac * aty - ad * atx) * det;
    out[5] = (ab * atx - aa * aty) * det;
    return out;
};

/**
 * Calculates the determinant of a mat2d
 *
 * @param {mat2d} a the source matrix
 * @returns {Number} determinant of a
 */
mat2d.determinant = function (a) {
    return a[0] * a[3] - a[1] * a[2];
};

/**
 * Multiplies two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */
mat2d.multiply = function (out, a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    out[4] = a0 * b4 + a2 * b5 + a4;
    out[5] = a1 * b4 + a3 * b5 + a5;
    return out;
};

/**
 * Alias for {@link mat2d.multiply}
 * @function
 */
mat2d.mul = mat2d.multiply;

/**
 * Rotates a mat2d by the given angle
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */
mat2d.rotate = function (out, a, rad) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = a0 *  c + a2 * s;
    out[1] = a1 *  c + a3 * s;
    out[2] = a0 * -s + a2 * c;
    out[3] = a1 * -s + a3 * c;
    out[4] = a4;
    out[5] = a5;
    return out;
};

/**
 * Scales the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2d} out
 **/
mat2d.scale = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        v0 = v[0], v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v0;
    out[2] = a2 * v1;
    out[3] = a3 * v1;
    out[4] = a4;
    out[5] = a5;
    return out;
};

/**
 * Translates the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to translate the matrix by
 * @returns {mat2d} out
 **/
mat2d.translate = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        v0 = v[0], v1 = v[1];
    out[0] = a0;
    out[1] = a1;
    out[2] = a2;
    out[3] = a3;
    out[4] = a0 * v0 + a2 * v1 + a4;
    out[5] = a1 * v0 + a3 * v1 + a5;
    return out;
};

/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.rotate(dest, dest, rad);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */
mat2d.fromRotation = function(out, rad) {
    var s = Math.sin(rad), c = Math.cos(rad);
    out[0] = c;
    out[1] = s;
    out[2] = -s;
    out[3] = c;
    out[4] = 0;
    out[5] = 0;
    return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.scale(dest, dest, vec);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat2d} out
 */
mat2d.fromScaling = function(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = v[1];
    out[4] = 0;
    out[5] = 0;
    return out;
}

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.translate(dest, dest, vec);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {vec2} v Translation vector
 * @returns {mat2d} out
 */
mat2d.fromTranslation = function(out, v) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = v[0];
    out[5] = v[1];
    return out;
}

/**
 * Returns a string representation of a mat2d
 *
 * @param {mat2d} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat2d.str = function (a) {
    return 'mat2d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
                    a[3] + ', ' + a[4] + ', ' + a[5] + ')';
};

/**
 * Returns Frobenius norm of a mat2d
 *
 * @param {mat2d} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat2d.frob = function (a) { 
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + 1))
}; 

module.exports = mat2d;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = __webpack_require__(7);

/**
 * @class 4x4 Matrix
 * @name mat4
 */
var mat4 = {};

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
mat4.create = function() {
    var out = new glMatrix.ARRAY_TYPE(16);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
mat4.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
mat4.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a03 = a[3],
            a12 = a[6], a13 = a[7],
            a23 = a[11];

        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a01;
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a02;
        out[9] = a12;
        out[11] = a[14];
        out[12] = a03;
        out[13] = a13;
        out[14] = a23;
    } else {
        out[0] = a[0];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a[1];
        out[5] = a[5];
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a[2];
        out[9] = a[6];
        out[10] = a[10];
        out[11] = a[14];
        out[12] = a[3];
        out[13] = a[7];
        out[14] = a[11];
        out[15] = a[15];
    }
    
    return out;
};

/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
};

/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    out[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
    out[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    out[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
    out[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    out[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    out[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
    out[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    out[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
    out[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
    out[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    out[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    out[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    out[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
    return out;
};

/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */
mat4.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
};

/**
 * Multiplies two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
mat4.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    // Cache only the current line of the second matrix
    var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];  
    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
    return out;
};

/**
 * Alias for {@link mat4.multiply}
 * @function
 */
mat4.mul = mat4.multiply;

/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
mat4.translate = function (out, a, v) {
    var x = v[0], y = v[1], z = v[2],
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23;

    if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
};

/**
 * Scales the mat4 by the dimensions in the given vec3
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
mat4.scale = function(out, a, v) {
    var x = v[0], y = v[1], z = v[2];

    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
mat4.rotate = function (out, a, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2],
        len = Math.sqrt(x * x + y * y + z * z),
        s, c, t,
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        b00, b01, b02,
        b10, b11, b12,
        b20, b21, b22;

    if (Math.abs(len) < glMatrix.EPSILON) { return null; }
    
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    return out;
};

/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateX = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[0]  = a[0];
        out[1]  = a[1];
        out[2]  = a[2];
        out[3]  = a[3];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateY = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[4]  = a[4];
        out[5]  = a[5];
        out[6]  = a[6];
        out[7]  = a[7];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateZ = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[8]  = a[8];
        out[9]  = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
};

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
mat4.fromTranslation = function(out, v) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.scale(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Scaling vector
 * @returns {mat4} out
 */
mat4.fromScaling = function(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = v[1];
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = v[2];
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from a given angle around a given axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotate(dest, dest, rad, axis);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
mat4.fromRotation = function(out, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2],
        len = Math.sqrt(x * x + y * y + z * z),
        s, c, t;
    
    if (Math.abs(len) < glMatrix.EPSILON) { return null; }
    
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    
    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;
    
    // Perform rotation-specific matrix multiplication
    out[0] = x * x * t + c;
    out[1] = y * x * t + z * s;
    out[2] = z * x * t - y * s;
    out[3] = 0;
    out[4] = x * y * t - z * s;
    out[5] = y * y * t + c;
    out[6] = z * y * t + x * s;
    out[7] = 0;
    out[8] = x * z * t + y * s;
    out[9] = y * z * t - x * s;
    out[10] = z * z * t + c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from the given angle around the X axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateX(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.fromXRotation = function(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad);
    
    // Perform axis-specific matrix multiplication
    out[0]  = 1;
    out[1]  = 0;
    out[2]  = 0;
    out[3]  = 0;
    out[4] = 0;
    out[5] = c;
    out[6] = s;
    out[7] = 0;
    out[8] = 0;
    out[9] = -s;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from the given angle around the Y axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateY(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.fromYRotation = function(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad);
    
    // Perform axis-specific matrix multiplication
    out[0]  = c;
    out[1]  = 0;
    out[2]  = -s;
    out[3]  = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = s;
    out[9] = 0;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from the given angle around the Z axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateZ(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.fromZRotation = function(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad);
    
    // Perform axis-specific matrix multiplication
    out[0]  = c;
    out[1]  = s;
    out[2]  = 0;
    out[3]  = 0;
    out[4] = -s;
    out[5] = c;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
mat4.fromRotationTranslation = function (out, q, v) {
    // Quaternion math
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    
    return out;
};

/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @returns {mat4} out
 */
mat4.fromRotationTranslationScale = function (out, q, v, s) {
    // Quaternion math
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2,
        sx = s[0],
        sy = s[1],
        sz = s[2];

    out[0] = (1 - (yy + zz)) * sx;
    out[1] = (xy + wz) * sx;
    out[2] = (xz - wy) * sx;
    out[3] = 0;
    out[4] = (xy - wz) * sy;
    out[5] = (1 - (xx + zz)) * sy;
    out[6] = (yz + wx) * sy;
    out[7] = 0;
    out[8] = (xz + wy) * sz;
    out[9] = (yz - wx) * sz;
    out[10] = (1 - (xx + yy)) * sz;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    
    return out;
};

/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     mat4.translate(dest, origin);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *     mat4.translate(dest, negativeOrigin);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @param {vec3} o The origin vector around which to scale and rotate
 * @returns {mat4} out
 */
mat4.fromRotationTranslationScaleOrigin = function (out, q, v, s, o) {
  // Quaternion math
  var x = q[0], y = q[1], z = q[2], w = q[3],
      x2 = x + x,
      y2 = y + y,
      z2 = z + z,

      xx = x * x2,
      xy = x * y2,
      xz = x * z2,
      yy = y * y2,
      yz = y * z2,
      zz = z * z2,
      wx = w * x2,
      wy = w * y2,
      wz = w * z2,
      
      sx = s[0],
      sy = s[1],
      sz = s[2],

      ox = o[0],
      oy = o[1],
      oz = o[2];
      
  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0] + ox - (out[0] * ox + out[4] * oy + out[8] * oz);
  out[13] = v[1] + oy - (out[1] * ox + out[5] * oy + out[9] * oz);
  out[14] = v[2] + oz - (out[2] * ox + out[6] * oy + out[10] * oz);
  out[15] = 1;
        
  return out;
};

mat4.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;

    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;

    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;

    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;

    return out;
};

/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.frustum = function (out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left),
        tb = 1 / (top - bottom),
        nf = 1 / (near - far);
    out[0] = (near * 2) * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = (near * 2) * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (far * near * 2) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.perspective = function (out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a perspective projection matrix with the given field of view.
 * This is primarily useful for generating projection matrices to be used
 * with the still experiemental WebVR API.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.perspectiveFromFieldOfView = function (out, fov, near, far) {
    var upTan = Math.tan(fov.upDegrees * Math.PI/180.0),
        downTan = Math.tan(fov.downDegrees * Math.PI/180.0),
        leftTan = Math.tan(fov.leftDegrees * Math.PI/180.0),
        rightTan = Math.tan(fov.rightDegrees * Math.PI/180.0),
        xScale = 2.0 / (leftTan + rightTan),
        yScale = 2.0 / (upTan + downTan);

    out[0] = xScale;
    out[1] = 0.0;
    out[2] = 0.0;
    out[3] = 0.0;
    out[4] = 0.0;
    out[5] = yScale;
    out[6] = 0.0;
    out[7] = 0.0;
    out[8] = -((leftTan - rightTan) * xScale * 0.5);
    out[9] = ((upTan - downTan) * yScale * 0.5);
    out[10] = far / (near - far);
    out[11] = -1.0;
    out[12] = 0.0;
    out[13] = 0.0;
    out[14] = (far * near) / (near - far);
    out[15] = 0.0;
    return out;
}

/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.ortho = function (out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right),
        bt = 1 / (bottom - top),
        nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
};

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
mat4.lookAt = function (out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
        eyex = eye[0],
        eyey = eye[1],
        eyez = eye[2],
        upx = up[0],
        upy = up[1],
        upz = up[2],
        centerx = center[0],
        centery = center[1],
        centerz = center[2];

    if (Math.abs(eyex - centerx) < glMatrix.EPSILON &&
        Math.abs(eyey - centery) < glMatrix.EPSILON &&
        Math.abs(eyez - centerz) < glMatrix.EPSILON) {
        return mat4.identity(out);
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;

    return out;
};

/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat4.str = function (a) {
    return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
                    a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
                    a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + 
                    a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
};

/**
 * Returns Frobenius norm of a mat4
 *
 * @param {mat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat4.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2) ))
};


module.exports = mat4;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = __webpack_require__(7);
var mat3 = __webpack_require__(27);
var vec3 = __webpack_require__(28);
var vec4 = __webpack_require__(29);

/**
 * @class Quaternion
 * @name quat
 */
var quat = {};

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */
quat.create = function() {
    var out = new glMatrix.ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {vec3} a the initial vector
 * @param {vec3} b the destination vector
 * @returns {quat} out
 */
quat.rotationTo = (function() {
    var tmpvec3 = vec3.create();
    var xUnitVec3 = vec3.fromValues(1,0,0);
    var yUnitVec3 = vec3.fromValues(0,1,0);

    return function(out, a, b) {
        var dot = vec3.dot(a, b);
        if (dot < -0.999999) {
            vec3.cross(tmpvec3, xUnitVec3, a);
            if (vec3.length(tmpvec3) < 0.000001)
                vec3.cross(tmpvec3, yUnitVec3, a);
            vec3.normalize(tmpvec3, tmpvec3);
            quat.setAxisAngle(out, tmpvec3, Math.PI);
            return out;
        } else if (dot > 0.999999) {
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            return out;
        } else {
            vec3.cross(tmpvec3, a, b);
            out[0] = tmpvec3[0];
            out[1] = tmpvec3[1];
            out[2] = tmpvec3[2];
            out[3] = 1 + dot;
            return quat.normalize(out, out);
        }
    };
})();

/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {vec3} view  the vector representing the viewing direction
 * @param {vec3} right the vector representing the local "right" direction
 * @param {vec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */
quat.setAxes = (function() {
    var matr = mat3.create();

    return function(out, view, right, up) {
        matr[0] = right[0];
        matr[3] = right[1];
        matr[6] = right[2];

        matr[1] = up[0];
        matr[4] = up[1];
        matr[7] = up[2];

        matr[2] = -view[0];
        matr[5] = -view[1];
        matr[8] = -view[2];

        return quat.normalize(out, quat.fromMat3(out, matr));
    };
})();

/**
 * Creates a new quat initialized with values from an existing quaternion
 *
 * @param {quat} a quaternion to clone
 * @returns {quat} a new quaternion
 * @function
 */
quat.clone = vec4.clone;

/**
 * Creates a new quat initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} a new quaternion
 * @function
 */
quat.fromValues = vec4.fromValues;

/**
 * Copy the values from one quat to another
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the source quaternion
 * @returns {quat} out
 * @function
 */
quat.copy = vec4.copy;

/**
 * Set the components of a quat to the given values
 *
 * @param {quat} out the receiving quaternion
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} out
 * @function
 */
quat.set = vec4.set;

/**
 * Set a quat to the identity quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */
quat.identity = function(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {vec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/
quat.setAxisAngle = function(out, axis, rad) {
    rad = rad * 0.5;
    var s = Math.sin(rad);
    out[0] = s * axis[0];
    out[1] = s * axis[1];
    out[2] = s * axis[2];
    out[3] = Math.cos(rad);
    return out;
};

/**
 * Adds two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 * @function
 */
quat.add = vec4.add;

/**
 * Multiplies two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 */
quat.multiply = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
};

/**
 * Alias for {@link quat.multiply}
 * @function
 */
quat.mul = quat.multiply;

/**
 * Scales a quat by a scalar number
 *
 * @param {quat} out the receiving vector
 * @param {quat} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {quat} out
 * @function
 */
quat.scale = vec4.scale;

/**
 * Rotates a quaternion by the given angle about the X axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateX = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + aw * bx;
    out[1] = ay * bw + az * bx;
    out[2] = az * bw - ay * bx;
    out[3] = aw * bw - ax * bx;
    return out;
};

/**
 * Rotates a quaternion by the given angle about the Y axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateY = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        by = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw - az * by;
    out[1] = ay * bw + aw * by;
    out[2] = az * bw + ax * by;
    out[3] = aw * bw - ay * by;
    return out;
};

/**
 * Rotates a quaternion by the given angle about the Z axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateZ = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bz = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + ay * bz;
    out[1] = ay * bw - ax * bz;
    out[2] = az * bw + aw * bz;
    out[3] = aw * bw - az * bz;
    return out;
};

/**
 * Calculates the W component of a quat from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length.
 * Any existing W component will be ignored.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate W component of
 * @returns {quat} out
 */
quat.calculateW = function (out, a) {
    var x = a[0], y = a[1], z = a[2];

    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
    return out;
};

/**
 * Calculates the dot product of two quat's
 *
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */
quat.dot = vec4.dot;

/**
 * Performs a linear interpolation between two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 * @function
 */
quat.lerp = vec4.lerp;

/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 */
quat.slerp = function (out, a, b, t) {
    // benchmarks:
    //    http://jsperf.com/quaternion-slerp-implementations

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    var        omega, cosom, sinom, scale0, scale1;

    // calc cosine
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    // adjust signs (if necessary)
    if ( cosom < 0.0 ) {
        cosom = -cosom;
        bx = - bx;
        by = - by;
        bz = - bz;
        bw = - bw;
    }
    // calculate coefficients
    if ( (1.0 - cosom) > 0.000001 ) {
        // standard case (slerp)
        omega  = Math.acos(cosom);
        sinom  = Math.sin(omega);
        scale0 = Math.sin((1.0 - t) * omega) / sinom;
        scale1 = Math.sin(t * omega) / sinom;
    } else {        
        // "from" and "to" quaternions are very close 
        //  ... so we can do a linear interpolation
        scale0 = 1.0 - t;
        scale1 = t;
    }
    // calculate final values
    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    
    return out;
};

/**
 * Performs a spherical linear interpolation with two control points
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {quat} c the third operand
 * @param {quat} d the fourth operand
 * @param {Number} t interpolation amount
 * @returns {quat} out
 */
quat.sqlerp = (function () {
  var temp1 = quat.create();
  var temp2 = quat.create();
  
  return function (out, a, b, c, d, t) {
    quat.slerp(temp1, a, d, t);
    quat.slerp(temp2, b, c, t);
    quat.slerp(out, temp1, temp2, 2 * t * (1 - t));
    
    return out;
  };
}());

/**
 * Calculates the inverse of a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate inverse of
 * @returns {quat} out
 */
quat.invert = function(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        dot = a0*a0 + a1*a1 + a2*a2 + a3*a3,
        invDot = dot ? 1.0/dot : 0;
    
    // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

    out[0] = -a0*invDot;
    out[1] = -a1*invDot;
    out[2] = -a2*invDot;
    out[3] = a3*invDot;
    return out;
};

/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate conjugate of
 * @returns {quat} out
 */
quat.conjugate = function (out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = a[3];
    return out;
};

/**
 * Calculates the length of a quat
 *
 * @param {quat} a vector to calculate length of
 * @returns {Number} length of a
 * @function
 */
quat.length = vec4.length;

/**
 * Alias for {@link quat.length}
 * @function
 */
quat.len = quat.length;

/**
 * Calculates the squared length of a quat
 *
 * @param {quat} a vector to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */
quat.squaredLength = vec4.squaredLength;

/**
 * Alias for {@link quat.squaredLength}
 * @function
 */
quat.sqrLen = quat.squaredLength;

/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */
quat.normalize = vec4.normalize;

/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {mat3} m rotation matrix
 * @returns {quat} out
 * @function
 */
quat.fromMat3 = function(out, m) {
    // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
    // article "Quaternion Calculus and Fast Animation".
    var fTrace = m[0] + m[4] + m[8];
    var fRoot;

    if ( fTrace > 0.0 ) {
        // |w| > 1/2, may as well choose w > 1/2
        fRoot = Math.sqrt(fTrace + 1.0);  // 2w
        out[3] = 0.5 * fRoot;
        fRoot = 0.5/fRoot;  // 1/(4w)
        out[0] = (m[5]-m[7])*fRoot;
        out[1] = (m[6]-m[2])*fRoot;
        out[2] = (m[1]-m[3])*fRoot;
    } else {
        // |w| <= 1/2
        var i = 0;
        if ( m[4] > m[0] )
          i = 1;
        if ( m[8] > m[i*3+i] )
          i = 2;
        var j = (i+1)%3;
        var k = (i+2)%3;
        
        fRoot = Math.sqrt(m[i*3+i]-m[j*3+j]-m[k*3+k] + 1.0);
        out[i] = 0.5 * fRoot;
        fRoot = 0.5 / fRoot;
        out[3] = (m[j*3+k] - m[k*3+j]) * fRoot;
        out[j] = (m[j*3+i] + m[i*3+j]) * fRoot;
        out[k] = (m[k*3+i] + m[i*3+k]) * fRoot;
    }
    
    return out;
};

/**
 * Returns a string representation of a quatenion
 *
 * @param {quat} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
quat.str = function (a) {
    return 'quat(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

module.exports = quat;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var glMatrix = __webpack_require__(7);

/**
 * @class 2 Dimensional Vector
 * @name vec2
 */
var vec2 = {};

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */
vec2.create = function() {
    var out = new glMatrix.ARRAY_TYPE(2);
    out[0] = 0;
    out[1] = 0;
    return out;
};

/**
 * Creates a new vec2 initialized with values from an existing vector
 *
 * @param {vec2} a vector to clone
 * @returns {vec2} a new 2D vector
 */
vec2.clone = function(a) {
    var out = new glMatrix.ARRAY_TYPE(2);
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Creates a new vec2 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} a new 2D vector
 */
vec2.fromValues = function(x, y) {
    var out = new glMatrix.ARRAY_TYPE(2);
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the source vector
 * @returns {vec2} out
 */
vec2.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Set the components of a vec2 to the given values
 *
 * @param {vec2} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} out
 */
vec2.set = function(out, x, y) {
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    return out;
};

/**
 * Alias for {@link vec2.subtract}
 * @function
 */
vec2.sub = vec2.subtract;

/**
 * Multiplies two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    return out;
};

/**
 * Alias for {@link vec2.multiply}
 * @function
 */
vec2.mul = vec2.multiply;

/**
 * Divides two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    return out;
};

/**
 * Alias for {@link vec2.divide}
 * @function
 */
vec2.div = vec2.divide;

/**
 * Returns the minimum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    return out;
};

/**
 * Returns the maximum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    return out;
};

/**
 * Scales a vec2 by a scalar number
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec2} out
 */
vec2.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    return out;
};

/**
 * Adds two vec2's after scaling the second operand by a scalar value
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec2} out
 */
vec2.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} distance between a and b
 */
vec2.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for {@link vec2.distance}
 * @function
 */
vec2.dist = vec2.distance;

/**
 * Calculates the squared euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec2.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return x*x + y*y;
};

/**
 * Alias for {@link vec2.squaredDistance}
 * @function
 */
vec2.sqrDist = vec2.squaredDistance;

/**
 * Calculates the length of a vec2
 *
 * @param {vec2} a vector to calculate length of
 * @returns {Number} length of a
 */
vec2.length = function (a) {
    var x = a[0],
        y = a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for {@link vec2.length}
 * @function
 */
vec2.len = vec2.length;

/**
 * Calculates the squared length of a vec2
 *
 * @param {vec2} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec2.squaredLength = function (a) {
    var x = a[0],
        y = a[1];
    return x*x + y*y;
};

/**
 * Alias for {@link vec2.squaredLength}
 * @function
 */
vec2.sqrLen = vec2.squaredLength;

/**
 * Negates the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to negate
 * @returns {vec2} out
 */
vec2.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    return out;
};

/**
 * Returns the inverse of the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to invert
 * @returns {vec2} out
 */
vec2.inverse = function(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  return out;
};

/**
 * Normalize a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to normalize
 * @returns {vec2} out
 */
vec2.normalize = function(out, a) {
    var x = a[0],
        y = a[1];
    var len = x*x + y*y;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} dot product of a and b
 */
vec2.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1];
};

/**
 * Computes the cross product of two vec2's
 * Note that the cross product must by definition produce a 3D vector
 *
 * @param {vec3} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec3} out
 */
vec2.cross = function(out, a, b) {
    var z = a[0] * b[1] - a[1] * b[0];
    out[0] = out[1] = 0;
    out[2] = z;
    return out;
};

/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec2} out
 */
vec2.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec2} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec2} out
 */
vec2.random = function (out, scale) {
    scale = scale || 1.0;
    var r = glMatrix.RANDOM() * 2.0 * Math.PI;
    out[0] = Math.cos(r) * scale;
    out[1] = Math.sin(r) * scale;
    return out;
};

/**
 * Transforms the vec2 with a mat2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat2 = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y;
    out[1] = m[1] * x + m[3] * y;
    return out;
};

/**
 * Transforms the vec2 with a mat2d
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2d} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat2d = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y + m[4];
    out[1] = m[1] * x + m[3] * y + m[5];
    return out;
};

/**
 * Transforms the vec2 with a mat3
 * 3rd vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat3} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat3 = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[3] * y + m[6];
    out[1] = m[1] * x + m[4] * y + m[7];
    return out;
};

/**
 * Transforms the vec2 with a mat4
 * 3rd vector component is implicitly '0'
 * 4th vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat4 = function(out, a, m) {
    var x = a[0], 
        y = a[1];
    out[0] = m[0] * x + m[4] * y + m[12];
    out[1] = m[1] * x + m[5] * y + m[13];
    return out;
};

/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec2.forEach = (function() {
    var vec = vec2.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 2;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec2} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec2.str = function (a) {
    return 'vec2(' + a[0] + ', ' + a[1] + ')';
};

module.exports = vec2;


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

// A library of seedable RNGs implemented in Javascript.
//
// Usage:
//
// var seedrandom = require('seedrandom');
// var random = seedrandom(1); // or any seed.
// var x = random();       // 0 <= x < 1.  Every bit is random.
// var x = random.quick(); // 0 <= x < 1.  32 bits of randomness.

// alea, a 53-bit multiply-with-carry generator by Johannes Baagøe.
// Period: ~2^116
// Reported to pass all BigCrush tests.
var alea = __webpack_require__(49);

// xor128, a pure xor-shift generator by George Marsaglia.
// Period: 2^128-1.
// Reported to fail: MatrixRank and LinearComp.
var xor128 = __webpack_require__(50);

// xorwow, George Marsaglia's 160-bit xor-shift combined plus weyl.
// Period: 2^192-2^32
// Reported to fail: CollisionOver, SimpPoker, and LinearComp.
var xorwow = __webpack_require__(51);

// xorshift7, by François Panneton and Pierre L'ecuyer, takes
// a different approach: it adds robustness by allowing more shifts
// than Marsaglia's original three.  It is a 7-shift generator
// with 256 bits, that passes BigCrush with no systmatic failures.
// Period 2^256-1.
// No systematic BigCrush failures reported.
var xorshift7 = __webpack_require__(52);

// xor4096, by Richard Brent, is a 4096-bit xor-shift with a
// very long period that also adds a Weyl generator. It also passes
// BigCrush with no systematic failures.  Its long period may
// be useful if you have many generators and need to avoid
// collisions.
// Period: 2^4128-2^32.
// No systematic BigCrush failures reported.
var xor4096 = __webpack_require__(53);

// Tyche-i, by Samuel Neves and Filipe Araujo, is a bit-shifting random
// number generator derived from ChaCha, a modern stream cipher.
// https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf
// Period: ~2^127
// No systematic BigCrush failures reported.
var tychei = __webpack_require__(54);

// The original ARC4-based prng included in this library.
// Period: ~2^1600
var sr = __webpack_require__(55);

sr.alea = alea;
sr.xor128 = xor128;
sr.xorwow = xorwow;
sr.xorshift7 = xorshift7;
sr.xor4096 = xor4096;
sr.tychei = tychei;

module.exports = sr;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_RESULT__;// A port of an algorithm by Johannes Baagøe <baagoe@baagoe.com>, 2010
// http://baagoe.com/en/RandomMusings/javascript/
// https://github.com/nquinlan/better-random-numbers-for-javascript-mirror
// Original work is under MIT license -

// Copyright (C) 2010 by Johannes Baagøe <baagoe@baagoe.org>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.



(function(global, module, define) {

function Alea(seed) {
  var me = this, mash = Mash();

  me.next = function() {
    var t = 2091639 * me.s0 + me.c * 2.3283064365386963e-10; // 2^-32
    me.s0 = me.s1;
    me.s1 = me.s2;
    return me.s2 = t - (me.c = t | 0);
  };

  // Apply the seeding algorithm from Baagoe.
  me.c = 1;
  me.s0 = mash(' ');
  me.s1 = mash(' ');
  me.s2 = mash(' ');
  me.s0 -= mash(seed);
  if (me.s0 < 0) { me.s0 += 1; }
  me.s1 -= mash(seed);
  if (me.s1 < 0) { me.s1 += 1; }
  me.s2 -= mash(seed);
  if (me.s2 < 0) { me.s2 += 1; }
  mash = null;
}

function copy(f, t) {
  t.c = f.c;
  t.s0 = f.s0;
  t.s1 = f.s1;
  t.s2 = f.s2;
  return t;
}

function impl(seed, opts) {
  var xg = new Alea(seed),
      state = opts && opts.state,
      prng = xg.next;
  prng.int32 = function() { return (xg.next() * 0x100000000) | 0; }
  prng.double = function() {
    return prng() + (prng() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
  };
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

function Mash() {
  var n = 0xefc8249d;

  var mash = function(data) {
    data = data.toString();
    for (var i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      var h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }
    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
  };

  return mash;
}


if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__(4) && __webpack_require__(11)) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return impl; }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.alea = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  __webpack_require__(4)   // present with an AMD loader
);



/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)(module)))

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_RESULT__;// A Javascript implementaion of the "xor128" prng algorithm by
// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  me.x = 0;
  me.y = 0;
  me.z = 0;
  me.w = 0;

  // Set up generator function.
  me.next = function() {
    var t = me.x ^ (me.x << 11);
    me.x = me.y;
    me.y = me.z;
    me.z = me.w;
    return me.w ^= (me.w >>> 19) ^ t ^ (t >>> 8);
  };

  if (seed === (seed | 0)) {
    // Integer seed.
    me.x = seed;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 64; k++) {
    me.x ^= strseed.charCodeAt(k) | 0;
    me.next();
  }
}

function copy(f, t) {
  t.x = f.x;
  t.y = f.y;
  t.z = f.z;
  t.w = f.w;
  return t;
}

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__(4) && __webpack_require__(11)) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return impl; }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.xor128 = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  __webpack_require__(4)   // present with an AMD loader
);



/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)(module)))

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_RESULT__;// A Javascript implementaion of the "xorwow" prng algorithm by
// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  // Set up generator function.
  me.next = function() {
    var t = (me.x ^ (me.x >>> 2));
    me.x = me.y; me.y = me.z; me.z = me.w; me.w = me.v;
    return (me.d = (me.d + 362437 | 0)) +
       (me.v = (me.v ^ (me.v << 4)) ^ (t ^ (t << 1))) | 0;
  };

  me.x = 0;
  me.y = 0;
  me.z = 0;
  me.w = 0;
  me.v = 0;

  if (seed === (seed | 0)) {
    // Integer seed.
    me.x = seed;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 64; k++) {
    me.x ^= strseed.charCodeAt(k) | 0;
    if (k == strseed.length) {
      me.d = me.x << 10 ^ me.x >>> 4;
    }
    me.next();
  }
}

function copy(f, t) {
  t.x = f.x;
  t.y = f.y;
  t.z = f.z;
  t.w = f.w;
  t.v = f.v;
  t.d = f.d;
  return t;
}

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__(4) && __webpack_require__(11)) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return impl; }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.xorwow = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  __webpack_require__(4)   // present with an AMD loader
);



/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)(module)))

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_RESULT__;// A Javascript implementaion of the "xorshift7" algorithm by
// François Panneton and Pierre L'ecuyer:
// "On the Xorgshift Random Number Generators"
// http://saluc.engr.uconn.edu/refs/crypto/rng/panneton05onthexorshift.pdf

(function(global, module, define) {

function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    // Update xor generator.
    var X = me.x, i = me.i, t, v, w;
    t = X[i]; t ^= (t >>> 7); v = t ^ (t << 24);
    t = X[(i + 1) & 7]; v ^= t ^ (t >>> 10);
    t = X[(i + 3) & 7]; v ^= t ^ (t >>> 3);
    t = X[(i + 4) & 7]; v ^= t ^ (t << 7);
    t = X[(i + 7) & 7]; t = t ^ (t << 13); v ^= t ^ (t << 9);
    X[i] = v;
    me.i = (i + 1) & 7;
    return v;
  };

  function init(me, seed) {
    var j, w, X = [];

    if (seed === (seed | 0)) {
      // Seed state array using a 32-bit integer.
      w = X[0] = seed;
    } else {
      // Seed state using a string.
      seed = '' + seed;
      for (j = 0; j < seed.length; ++j) {
        X[j & 7] = (X[j & 7] << 15) ^
            (seed.charCodeAt(j) + X[(j + 1) & 7] << 13);
      }
    }
    // Enforce an array length of 8, not all zeroes.
    while (X.length < 8) X.push(0);
    for (j = 0; j < 8 && X[j] === 0; ++j);
    if (j == 8) w = X[7] = -1; else w = X[j];

    me.x = X;
    me.i = 0;

    // Discard an initial 256 values.
    for (j = 256; j > 0; --j) {
      me.next();
    }
  }

  init(me, seed);
}

function copy(f, t) {
  t.x = f.x.slice();
  t.i = f.i;
  return t;
}

function impl(seed, opts) {
  if (seed == null) seed = +(new Date);
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (state.x) copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__(4) && __webpack_require__(11)) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return impl; }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.xorshift7 = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  __webpack_require__(4)   // present with an AMD loader
);


/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)(module)))

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_RESULT__;// A Javascript implementaion of Richard Brent's Xorgens xor4096 algorithm.
//
// This fast non-cryptographic random number generator is designed for
// use in Monte-Carlo algorithms. It combines a long-period xorshift
// generator with a Weyl generator, and it passes all common batteries
// of stasticial tests for randomness while consuming only a few nanoseconds
// for each prng generated.  For background on the generator, see Brent's
// paper: "Some long-period random number generators using shifts and xors."
// http://arxiv.org/pdf/1004.3115v1.pdf
//
// Usage:
//
// var xor4096 = require('xor4096');
// random = xor4096(1);                        // Seed with int32 or string.
// assert.equal(random(), 0.1520436450538547); // (0, 1) range, 53 bits.
// assert.equal(random.int32(), 1806534897);   // signed int32, 32 bits.
//
// For nonzero numeric keys, this impelementation provides a sequence
// identical to that by Brent's xorgens 3 implementaion in C.  This
// implementation also provides for initalizing the generator with
// string seeds, or for saving and restoring the state of the generator.
//
// On Chrome, this prng benchmarks about 2.1 times slower than
// Javascript's built-in Math.random().

(function(global, module, define) {

function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    var w = me.w,
        X = me.X, i = me.i, t, v;
    // Update Weyl generator.
    me.w = w = (w + 0x61c88647) | 0;
    // Update xor generator.
    v = X[(i + 34) & 127];
    t = X[i = ((i + 1) & 127)];
    v ^= v << 13;
    t ^= t << 17;
    v ^= v >>> 15;
    t ^= t >>> 12;
    // Update Xor generator array state.
    v = X[i] = v ^ t;
    me.i = i;
    // Result is the combination.
    return (v + (w ^ (w >>> 16))) | 0;
  };

  function init(me, seed) {
    var t, v, i, j, w, X = [], limit = 128;
    if (seed === (seed | 0)) {
      // Numeric seeds initialize v, which is used to generates X.
      v = seed;
      seed = null;
    } else {
      // String seeds are mixed into v and X one character at a time.
      seed = seed + '\0';
      v = 0;
      limit = Math.max(limit, seed.length);
    }
    // Initialize circular array and weyl value.
    for (i = 0, j = -32; j < limit; ++j) {
      // Put the unicode characters into the array, and shuffle them.
      if (seed) v ^= seed.charCodeAt((j + 32) % seed.length);
      // After 32 shuffles, take v as the starting w value.
      if (j === 0) w = v;
      v ^= v << 10;
      v ^= v >>> 15;
      v ^= v << 4;
      v ^= v >>> 13;
      if (j >= 0) {
        w = (w + 0x61c88647) | 0;     // Weyl.
        t = (X[j & 127] ^= (v + w));  // Combine xor and weyl to init array.
        i = (0 == t) ? i + 1 : 0;     // Count zeroes.
      }
    }
    // We have detected all zeroes; make the key nonzero.
    if (i >= 128) {
      X[(seed && seed.length || 0) & 127] = -1;
    }
    // Run the generator 512 times to further mix the state before using it.
    // Factoring this as a function slows the main generator, so it is just
    // unrolled here.  The weyl generator is not advanced while warming up.
    i = 127;
    for (j = 4 * 128; j > 0; --j) {
      v = X[(i + 34) & 127];
      t = X[i = ((i + 1) & 127)];
      v ^= v << 13;
      t ^= t << 17;
      v ^= v >>> 15;
      t ^= t >>> 12;
      X[i] = v ^ t;
    }
    // Storing state as object members is faster than using closure variables.
    me.w = w;
    me.X = X;
    me.i = i;
  }

  init(me, seed);
}

function copy(f, t) {
  t.i = f.i;
  t.w = f.w;
  t.X = f.X.slice();
  return t;
};

function impl(seed, opts) {
  if (seed == null) seed = +(new Date);
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (state.X) copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__(4) && __webpack_require__(11)) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return impl; }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.xor4096 = impl;
}

})(
  this,                                     // window object or global
  (typeof module) == 'object' && module,    // present in node.js
  __webpack_require__(4)   // present with an AMD loader
);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)(module)))

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_RESULT__;// A Javascript implementaion of the "Tyche-i" prng algorithm by
// Samuel Neves and Filipe Araujo.
// See https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  // Set up generator function.
  me.next = function() {
    var b = me.b, c = me.c, d = me.d, a = me.a;
    b = (b << 25) ^ (b >>> 7) ^ c;
    c = (c - d) | 0;
    d = (d << 24) ^ (d >>> 8) ^ a;
    a = (a - b) | 0;
    me.b = b = (b << 20) ^ (b >>> 12) ^ c;
    me.c = c = (c - d) | 0;
    me.d = (d << 16) ^ (c >>> 16) ^ a;
    return me.a = (a - b) | 0;
  };

  /* The following is non-inverted tyche, which has better internal
   * bit diffusion, but which is about 25% slower than tyche-i in JS.
  me.next = function() {
    var a = me.a, b = me.b, c = me.c, d = me.d;
    a = (me.a + me.b | 0) >>> 0;
    d = me.d ^ a; d = d << 16 ^ d >>> 16;
    c = me.c + d | 0;
    b = me.b ^ c; b = b << 12 ^ d >>> 20;
    me.a = a = a + b | 0;
    d = d ^ a; me.d = d = d << 8 ^ d >>> 24;
    me.c = c = c + d | 0;
    b = b ^ c;
    return me.b = (b << 7 ^ b >>> 25);
  }
  */

  me.a = 0;
  me.b = 0;
  me.c = 2654435769 | 0;
  me.d = 1367130551;

  if (seed === Math.floor(seed)) {
    // Integer seed.
    me.a = (seed / 0x100000000) | 0;
    me.b = seed | 0;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 20; k++) {
    me.b ^= strseed.charCodeAt(k) | 0;
    me.next();
  }
}

function copy(f, t) {
  t.a = f.a;
  t.b = f.b;
  t.c = f.c;
  t.d = f.d;
  return t;
};

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__(4) && __webpack_require__(11)) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return impl; }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.tychei = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  __webpack_require__(4)   // present with an AMD loader
);



/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)(module)))

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*
Copyright 2014 David Bau.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

(function (pool, math) {
//
// The following constants are related to IEEE 754 limits.
//
var global = this,
    width = 256,        // each RC4 output is 0 <= x < 256
    chunks = 6,         // at least six RC4 outputs for each double
    digits = 52,        // there are 52 significant digits in a double
    rngname = 'random', // rngname: name for Math.random and Math.seedrandom
    startdenom = math.pow(width, chunks),
    significance = math.pow(2, digits),
    overflow = significance * 2,
    mask = width - 1,
    nodecrypto;         // node.js crypto module, initialized at the bottom.

//
// seedrandom()
// This is the seedrandom function described above.
//
function seedrandom(seed, options, callback) {
  var key = [];
  options = (options == true) ? { entropy: true } : (options || {});

  // Flatten the seed string or build one from local entropy if needed.
  var shortseed = mixkey(flatten(
    options.entropy ? [seed, tostring(pool)] :
    (seed == null) ? autoseed() : seed, 3), key);

  // Use the seed to initialize an ARC4 generator.
  var arc4 = new ARC4(key);

  // This function returns a random double in [0, 1) that contains
  // randomness in every bit of the mantissa of the IEEE 754 value.
  var prng = function() {
    var n = arc4.g(chunks),             // Start with a numerator n < 2 ^ 48
        d = startdenom,                 //   and denominator d = 2 ^ 48.
        x = 0;                          //   and no 'extra last byte'.
    while (n < significance) {          // Fill up all significant digits by
      n = (n + x) * width;              //   shifting numerator and
      d *= width;                       //   denominator and generating a
      x = arc4.g(1);                    //   new least-significant-byte.
    }
    while (n >= overflow) {             // To avoid rounding up, before adding
      n /= 2;                           //   last byte, shift everything
      d /= 2;                           //   right using integer math until
      x >>>= 1;                         //   we have exactly the desired bits.
    }
    return (n + x) / d;                 // Form the number within [0, 1).
  };

  prng.int32 = function() { return arc4.g(4) | 0; }
  prng.quick = function() { return arc4.g(4) / 0x100000000; }
  prng.double = prng;

  // Mix the randomness into accumulated entropy.
  mixkey(tostring(arc4.S), pool);

  // Calling convention: what to return as a function of prng, seed, is_math.
  return (options.pass || callback ||
      function(prng, seed, is_math_call, state) {
        if (state) {
          // Load the arc4 state from the given state if it has an S array.
          if (state.S) { copy(state, arc4); }
          // Only provide the .state method if requested via options.state.
          prng.state = function() { return copy(arc4, {}); }
        }

        // If called as a method of Math (Math.seedrandom()), mutate
        // Math.random because that is how seedrandom.js has worked since v1.0.
        if (is_math_call) { math[rngname] = prng; return seed; }

        // Otherwise, it is a newer calling convention, so return the
        // prng directly.
        else return prng;
      })(
  prng,
  shortseed,
  'global' in options ? options.global : (this == math),
  options.state);
}
math['seed' + rngname] = seedrandom;

//
// ARC4
//
// An ARC4 implementation.  The constructor takes a key in the form of
// an array of at most (width) integers that should be 0 <= x < (width).
//
// The g(count) method returns a pseudorandom integer that concatenates
// the next (count) outputs from ARC4.  Its return value is a number x
// that is in the range 0 <= x < (width ^ count).
//
function ARC4(key) {
  var t, keylen = key.length,
      me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];

  // The empty key [] is treated as [0].
  if (!keylen) { key = [keylen++]; }

  // Set up S using the standard key scheduling algorithm.
  while (i < width) {
    s[i] = i++;
  }
  for (i = 0; i < width; i++) {
    s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
    s[j] = t;
  }

  // The "g" method returns the next (count) outputs as one number.
  (me.g = function(count) {
    // Using instance members instead of closure state nearly doubles speed.
    var t, r = 0,
        i = me.i, j = me.j, s = me.S;
    while (count--) {
      t = s[i = mask & (i + 1)];
      r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
    }
    me.i = i; me.j = j;
    return r;
    // For robust unpredictability, the function call below automatically
    // discards an initial batch of values.  This is called RC4-drop[256].
    // See http://google.com/search?q=rsa+fluhrer+response&btnI
  })(width);
}

//
// copy()
// Copies internal state of ARC4 to or from a plain object.
//
function copy(f, t) {
  t.i = f.i;
  t.j = f.j;
  t.S = f.S.slice();
  return t;
};

//
// flatten()
// Converts an object tree to nested arrays of strings.
//
function flatten(obj, depth) {
  var result = [], typ = (typeof obj), prop;
  if (depth && typ == 'object') {
    for (prop in obj) {
      try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
    }
  }
  return (result.length ? result : typ == 'string' ? obj : obj + '\0');
}

//
// mixkey()
// Mixes a string seed into a key that is an array of integers, and
// returns a shortened string seed that is equivalent to the result key.
//
function mixkey(seed, key) {
  var stringseed = seed + '', smear, j = 0;
  while (j < stringseed.length) {
    key[mask & j] =
      mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
  }
  return tostring(key);
}

//
// autoseed()
// Returns an object for autoseeding, using window.crypto and Node crypto
// module if available.
//
function autoseed() {
  try {
    var out;
    if (nodecrypto && (out = nodecrypto.randomBytes)) {
      // The use of 'out' to remember randomBytes makes tight minified code.
      out = out(width);
    } else {
      out = new Uint8Array(width);
      (global.crypto || global.msCrypto).getRandomValues(out);
    }
    return tostring(out);
  } catch (e) {
    var browser = global.navigator,
        plugins = browser && browser.plugins;
    return [+new Date, global, plugins, global.screen, tostring(pool)];
  }
}

//
// tostring()
// Converts an array of charcodes to a string
//
function tostring(a) {
  return String.fromCharCode.apply(0, a);
}

//
// When seedrandom.js is loaded, we immediately mix a few bits
// from the built-in RNG into the entropy pool.  Because we do
// not want to interfere with deterministic PRNG state later,
// seedrandom will not call math.random on its own again after
// initialization.
//
mixkey(math.random(), pool);

//
// Nodejs and AMD support: export the implementation as a module using
// either convention.
//
if ((typeof module) == 'object' && module.exports) {
  module.exports = seedrandom;
  // When in node.js, try using crypto package for autoseeding.
  try {
    nodecrypto = __webpack_require__(56);
  } catch (ex) {}
} else if (true) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return seedrandom; }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}

// End anonymous scope, and pass initial values.
})(
  [],     // pool: entropy pool starts empty
  Math    // math: package containing random, pow, and seedrandom
);


/***/ }),
/* 56 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------------------------------------------------------------

function vtkRenderPass(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkRenderPass');

  publicAPI.getOperation = function () {
    return model.currentOperation;
  };

  // by default this class will traverse all of its
  // preDelegateOperations, then call its delegate render passes
  // the traverse all of its postDelegateOperations
  // any of those three arrays can be empty
  publicAPI.traverse = function (viewNode) {
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    if (model.deleted) {
      return;
    }

    // we just render our delegates in order
    model.currentParent = parent;

    model.preDelegateOperations.forEach(function (val) {
      model.currentOperation = val;
      viewNode.traverse(publicAPI);
    });
    model.delegates.forEach(function (val) {
      val.traverse(viewNode, publicAPI);
    });
    model.postDelegateOperations.forEach(function (val) {
      model.currentOperation = val;
      viewNode.traverse(publicAPI);
    });
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  delegates: [],
  currentOperation: null,
  preDelegateOperations: [],
  postDelegateOperations: [],
  currentParent: null
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  _macro2.default.obj(publicAPI, model);
  _macro2.default.setGet(publicAPI, model, ['delegates', 'currentParent', 'currentOperation', 'preDelegateOperations', 'postDelegateOperations']);

  // Object methods
  vtkRenderPass(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkRenderPass');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _GenericWidgetRepresentation = __webpack_require__(59);

var _GenericWidgetRepresentation2 = _interopRequireDefault(_GenericWidgetRepresentation);

var _ViewNodeFactory = __webpack_require__(60);

var _ViewNodeFactory2 = _interopRequireDefault(_ViewNodeFactory);

var _Actor = __webpack_require__(61);

var _Actor2 = _interopRequireDefault(_Actor);

var _Actor2D = __webpack_require__(62);

var _Actor2D2 = _interopRequireDefault(_Actor2D);

var _Camera = __webpack_require__(63);

var _Camera2 = _interopRequireDefault(_Camera);

var _ImageMapper = __webpack_require__(64);

var _ImageMapper2 = _interopRequireDefault(_ImageMapper);

var _ImageSlice = __webpack_require__(68);

var _ImageSlice2 = _interopRequireDefault(_ImageSlice);

var _PixelSpaceCallbackMapper = __webpack_require__(69);

var _PixelSpaceCallbackMapper2 = _interopRequireDefault(_PixelSpaceCallbackMapper);

var _PolyDataMapper = __webpack_require__(20);

var _PolyDataMapper2 = _interopRequireDefault(_PolyDataMapper);

var _RenderWindow = __webpack_require__(25);

var _RenderWindow2 = _interopRequireDefault(_RenderWindow);

var _Renderer = __webpack_require__(71);

var _Renderer2 = _interopRequireDefault(_Renderer);

var _SphereMapper = __webpack_require__(72);

var _SphereMapper2 = _interopRequireDefault(_SphereMapper);

var _StickMapper = __webpack_require__(74);

var _StickMapper2 = _interopRequireDefault(_StickMapper);

var _Texture = __webpack_require__(12);

var _Texture2 = _interopRequireDefault(_Texture);

var _Volume = __webpack_require__(76);

var _Volume2 = _interopRequireDefault(_Volume);

var _VolumeMapper = __webpack_require__(77);

var _VolumeMapper2 = _interopRequireDefault(_VolumeMapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------------------------------------------------------------
// vtkOpenGLViewNodeFactory methods
// ----------------------------------------------------------------------------

function vtkOpenGLViewNodeFactory(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkOpenGLViewNodeFactory');
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  _ViewNodeFactory2.default.extend(publicAPI, model, initialValues);

  // Object methods
  vtkOpenGLViewNodeFactory(publicAPI, model);

  // Initialization
  publicAPI.registerOverride('vtkActor', _Actor2.default.newInstance);
  publicAPI.registerOverride('vtkActor2D', _Actor2D2.default.newInstance);
  publicAPI.registerOverride('vtkCamera', _Camera2.default.newInstance);
  publicAPI.registerOverride('vtkImageMapper', _ImageMapper2.default.newInstance);
  publicAPI.registerOverride('vtkImageSlice', _ImageSlice2.default.newInstance);
  publicAPI.registerOverride('vtkMapper', _PolyDataMapper2.default.newInstance);
  publicAPI.registerOverride('vtkPixelSpaceCallbackMapper', _PixelSpaceCallbackMapper2.default.newInstance);
  publicAPI.registerOverride('vtkRenderWindow', _RenderWindow2.default.newInstance);
  publicAPI.registerOverride('vtkRenderer', _Renderer2.default.newInstance);
  publicAPI.registerOverride('vtkSphereMapper', _SphereMapper2.default.newInstance);
  publicAPI.registerOverride('vtkStickMapper', _StickMapper2.default.newInstance);
  publicAPI.registerOverride('vtkTexture', _Texture2.default.newInstance);
  publicAPI.registerOverride('vtkVolume', _Volume2.default.newInstance);
  publicAPI.registerOverride('vtkVolumeMapper', _VolumeMapper2.default.newInstance);
  publicAPI.registerOverride('vtkWidgetRepresentation', _GenericWidgetRepresentation2.default.newInstance);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkOpenGLViewNodeFactory');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _ViewNode = __webpack_require__(3);

var _ViewNode2 = _interopRequireDefault(_ViewNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------------------------------------------------------------
// vtkOpenGLActor methods
// ----------------------------------------------------------------------------

function vtkGenericWidgetRepresentation(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkGenericWidgetRepresentation');
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  _ViewNode2.default.extend(publicAPI, model, initialValues);

  // Object methods
  vtkGenericWidgetRepresentation(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend);

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------------------------------------------------------------
// vtkViewNodeFactory methods
// ----------------------------------------------------------------------------

function vtkViewNodeFactory(publicAPI, model) {
  // Make sure our overrides is just for our instance not shared with everyone...
  model.overrides = {};

  // Set our className
  model.classHierarchy.push('vtkViewNodeFactory');

  publicAPI.createNode = function (dataObject) {
    if (dataObject.isDeleted()) {
      return null;
    }

    var cpt = 0;
    var className = dataObject.getClassName(cpt++);
    var isObject = false;
    var keys = Object.keys(model.overrides);
    while (className && !isObject) {
      if (keys.indexOf(className) !== -1) {
        isObject = true;
      } else {
        className = dataObject.getClassName(cpt++);
      }
    }

    if (!isObject) {
      return null;
    }
    var vn = model.overrides[className]();
    vn.setMyFactory(publicAPI);
    return vn;
  };

  publicAPI.registerOverride = function (className, func) {
    model.overrides[className] = func;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  // overrides: {},
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  _macro2.default.obj(publicAPI, model);

  // Object methods
  vtkViewNodeFactory(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkViewNodeFactory');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _glMatrix = __webpack_require__(2);

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _ViewNode = __webpack_require__(3);

var _ViewNode2 = _interopRequireDefault(_ViewNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------------------------------------------------------------
// vtkOpenGLActor methods
// ----------------------------------------------------------------------------

function vtkOpenGLActor(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkOpenGLActor');

  // Builds myself.
  publicAPI.buildPass = function (prepass) {
    if (prepass) {
      publicAPI.prepareNodes();
      publicAPI.addMissingNodes(model.renderable.getTextures());
      publicAPI.addMissingNode(model.renderable.getMapper());
      publicAPI.removeUnusedNodes();
    }
  };

  publicAPI.traverseOpaqueZBufferPass = function (renderPass) {
    publicAPI.traverseOpaquePass(renderPass);
  };

  // we draw textures, then mapper, then post pass textures
  publicAPI.traverseOpaquePass = function (renderPass) {
    if (!model.renderable || !model.renderable.getVisibility() || !model.renderable.getIsOpaque()) {
      return;
    }

    publicAPI.apply(renderPass, true);
    model.children.forEach(function (child) {
      if (!child.isA('vtkOpenGLTexture')) {
        child.traverse(renderPass);
      }
    });
    publicAPI.apply(renderPass, false);
  };

  // we draw textures, then mapper, then post pass textures
  publicAPI.traverseTranslucentPass = function (renderPass) {
    if (!model.renderable || !model.renderable.getVisibility() || model.renderable.getIsOpaque()) {
      return;
    }

    publicAPI.apply(renderPass, true);
    model.children.forEach(function (child) {
      if (!child.isA('vtkOpenGLTexture')) {
        child.traverse(renderPass);
      }
    });
    publicAPI.apply(renderPass, false);
  };

  publicAPI.activateTextures = function () {
    // always traverse textures first, then mapper
    model.activeTextures = [];
    model.children.forEach(function (child) {
      if (child.isA('vtkOpenGLTexture')) {
        child.render();
        if (child.getHandle()) {
          model.activeTextures.push(child);
        }
      }
    });
  };

  publicAPI.queryPass = function (prepass, renderPass) {
    if (prepass) {
      if (!model.renderable || !model.renderable.getVisibility()) {
        return;
      }
      if (model.renderable.getIsOpaque()) {
        renderPass.incrementOpaqueActorCount();
      } else {
        renderPass.incrementTranslucentActorCount();
      }
    }
  };

  publicAPI.opaqueZBufferPass = function (prepass, renderPass) {
    return publicAPI.opaquePass(prepass, renderPass);
  };

  publicAPI.opaquePass = function (prepass, renderPass) {
    if (prepass) {
      model.context = publicAPI.getFirstAncestorOfType('vtkOpenGLRenderWindow').getContext();
      model.context.depthMask(true);
      publicAPI.activateTextures();
    } else {
      // deactivate textures
      model.activeTextures.forEach(function (child) {
        child.deactivate();
      });
    }
  };

  // Renders myself
  publicAPI.translucentPass = function (prepass, renderPass) {
    if (prepass) {
      model.context = publicAPI.getFirstAncestorOfType('vtkOpenGLRenderWindow').getContext();
      model.context.depthMask(false);
      publicAPI.activateTextures();
    } else {
      // deactivate textures
      model.activeTextures.forEach(function (child) {
        child.deactivate();
      });
      model.context.depthMask(true);
    }
  };

  publicAPI.getKeyMatrices = function () {
    // has the actor changed?
    if (model.renderable.getMTime() > model.keyMatrixTime.getMTime()) {
      model.renderable.computeMatrix();
      _glMatrix.mat4.copy(model.MCWCMatrix, model.renderable.getMatrix());
      _glMatrix.mat4.transpose(model.MCWCMatrix, model.MCWCMatrix);

      if (model.renderable.getIsIdentity()) {
        _glMatrix.mat3.identity(model.normalMatrix);
      } else {
        _glMatrix.mat3.fromMat4(model.normalMatrix, model.MCWCMatrix);
        _glMatrix.mat3.invert(model.normalMatrix, model.normalMatrix);
      }
      model.keyMatrixTime.modified();
    }

    return { mcwc: model.MCWCMatrix, normalMatrix: model.normalMatrix };
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  context: null,
  keyMatrixTime: null,
  normalMatrix: null,
  MCWCMatrix: null,
  activeTextures: []
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  _ViewNode2.default.extend(publicAPI, model, initialValues);

  model.keyMatrixTime = {};
  _macro2.default.obj(model.keyMatrixTime, { mtime: 0 });
  model.normalMatrix = _glMatrix.mat3.create();
  model.MCWCMatrix = _glMatrix.mat4.create();

  // Build VTK API
  _macro2.default.setGet(publicAPI, model, ['context']);

  _macro2.default.get(publicAPI, model, ['activeTextures']);

  // Object methods
  vtkOpenGLActor(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend);

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var macro = _interopRequireWildcard(_macro);

var _ViewNode = __webpack_require__(3);

var _ViewNode2 = _interopRequireDefault(_ViewNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// ----------------------------------------------------------------------------
// vtkOpenGLActor methods
// ----------------------------------------------------------------------------

function vtkOpenGLActor2D(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkOpenGLActor2D');

  // Builds myself.
  publicAPI.buildPass = function (prepass) {
    if (prepass) {
      if (!model.renderable) {
        return;
      }

      publicAPI.prepareNodes();
      publicAPI.addMissingNodes(model.renderable.getTextures());
      publicAPI.addMissingNode(model.renderable.getMapper());
      publicAPI.removeUnusedNodes();
    }
  };

  // we draw textures, then mapper, then post pass textures
  publicAPI.traverseOpaquePass = function (renderPass) {
    if (!model.renderable || !model.renderable.getVisibility() || !model.renderable.getIsOpaque()) {
      return;
    }

    publicAPI.apply(renderPass, true);
    model.children.forEach(function (child) {
      if (!child.isA('vtkOpenGLTexture')) {
        child.traverse(renderPass);
      }
    });
    publicAPI.apply(renderPass, false);
  };

  // we draw textures, then mapper, then post pass textures
  publicAPI.traverseTranslucentPass = function (renderPass) {
    if (!model.renderable || !model.renderable.getVisibility() || model.renderable.getIsOpaque()) {
      return;
    }

    publicAPI.apply(renderPass, true);
    model.children.forEach(function (child) {
      if (!child.isA('vtkOpenGLTexture')) {
        child.traverse(renderPass);
      }
    });
    publicAPI.apply(renderPass, false);
  };

  publicAPI.activateTextures = function () {
    // always traverse textures first, then mapper
    model.activeTextures = [];
    model.children.forEach(function (child) {
      if (child.isA('vtkOpenGLTexture')) {
        child.render();
        if (child.getHandle()) {
          model.activeTextures.push(child);
        }
      }
    });
  };

  // Renders myself
  publicAPI.opaquePass = function (prepass, renderPass) {
    if (prepass) {
      model.context = publicAPI.getFirstAncestorOfType('vtkOpenGLRenderWindow').getContext();
      model.context.depthMask(true);
      publicAPI.activateTextures();
    } else {
      // deactivate textures
      model.activeTextures.forEach(function (child) {
        child.deactivate();
      });
    }
  };

  // Renders myself
  publicAPI.translucentPass = function (prepass, renderPass) {
    if (prepass) {
      model.context = publicAPI.getFirstAncestorOfType('vtkOpenGLRenderWindow').getContext();
      model.context.depthMask(false);
      publicAPI.activateTextures();
    } else {
      // deactivate textures
      model.activeTextures.forEach(function (child) {
        child.deactivate();
      });
      model.context.depthMask(true);
    }
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  context: null,
  activeTextures: []
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  _ViewNode2.default.extend(publicAPI, model, initialValues);

  // Build VTK API
  macro.setGet(publicAPI, model, ['context']);

  macro.get(publicAPI, model, ['activeTextures']);

  // Object methods
  vtkOpenGLActor2D(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = macro.newInstance(extend);

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _glMatrix = __webpack_require__(2);

var _macro = __webpack_require__(0);

var macro = _interopRequireWildcard(_macro);

var _ViewNode = __webpack_require__(3);

var _ViewNode2 = _interopRequireDefault(_ViewNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// ----------------------------------------------------------------------------
// vtkOpenGLCamera methods
// ----------------------------------------------------------------------------

function vtkOpenGLCamera(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkOpenGLCamera');

  // Renders myself
  publicAPI.opaquePass = function (prepass) {
    if (prepass) {
      model.context = publicAPI.getFirstAncestorOfType('vtkOpenGLRenderWindow').getContext();
      var ren = publicAPI.getFirstAncestorOfType('vtkOpenGLRenderer');
      var tsize = ren.getTiledSizeAndOrigin();
      model.context.viewport(tsize.lowerLeftU, tsize.lowerLeftV, tsize.usize, tsize.vsize);
      model.context.scissor(tsize.lowerLeftU, tsize.lowerLeftV, tsize.usize, tsize.vsize);
    }
  };
  publicAPI.translucentPass = publicAPI.opaquePass;
  publicAPI.opaqueZBufferPass = publicAPI.opaquePass;
  publicAPI.volumePass = publicAPI.opaquePass;

  publicAPI.getKeyMatrices = function (ren) {
    // has the camera changed?
    if (ren !== model.lastRenderer || publicAPI.getFirstAncestorOfType('vtkOpenGLRenderWindow').getMTime() > model.keyMatrixTime.getMTime() || publicAPI.getMTime() > model.keyMatrixTime.getMTime() || ren.getMTime() > model.keyMatrixTime.getMTime()) {
      _glMatrix.mat4.copy(model.WCVCMatrix, model.renderable.getViewTransformMatrix());

      _glMatrix.mat3.fromMat4(model.normalMatrix, model.WCVCMatrix);
      _glMatrix.mat3.invert(model.normalMatrix, model.normalMatrix);
      _glMatrix.mat4.transpose(model.WCVCMatrix, model.WCVCMatrix);

      var oglren = publicAPI.getFirstAncestorOfType('vtkOpenGLRenderer');
      var aspectRatio = oglren.getAspectRatio();

      _glMatrix.mat4.copy(model.VCDCMatrix, model.renderable.getProjectionTransformMatrix(aspectRatio, -1, 1));
      _glMatrix.mat4.transpose(model.VCDCMatrix, model.VCDCMatrix);

      _glMatrix.mat4.multiply(model.WCDCMatrix, model.VCDCMatrix, model.WCVCMatrix);
      //      mat4.multiply(model.WCDCMatrix, model.WCVCMatrix, model.VCDCMatrix);

      model.keyMatrixTime.modified();
      model.lastRenderer = ren;
    }

    return { wcvc: model.WCVCMatrix, normalMatrix: model.normalMatrix, vcdc: model.VCDCMatrix, wcdc: model.WCDCMatrix };
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  context: null,
  lastRenderer: null,
  keyMatrixTime: null,
  normalMatrix: null,
  VCDCMatrix: null,
  WCVCMatrix: null,
  WCDCMatrix: null
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  _ViewNode2.default.extend(publicAPI, model, initialValues);

  model.keyMatrixTime = {};
  model.normalMatrix = _glMatrix.mat3.create();
  model.VCDCMatrix = _glMatrix.mat4.create();
  model.WCVCMatrix = _glMatrix.mat4.create();
  model.WCDCMatrix = _glMatrix.mat4.create();
  macro.obj(model.keyMatrixTime);

  // Build VTK API
  macro.setGet(publicAPI, model, ['context', 'keyMatrixTime']);

  // Object methods
  vtkOpenGLCamera(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = macro.newInstance(extend);

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _glMatrix = __webpack_require__(2);

var _Constants = __webpack_require__(65);

var _Constants2 = _interopRequireDefault(_Constants);

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _DataArray = __webpack_require__(6);

var _DataArray2 = _interopRequireDefault(_DataArray);

var _Helper = __webpack_require__(18);

var _Helper2 = _interopRequireDefault(_Helper);

var _Math = __webpack_require__(1);

var _Math2 = _interopRequireDefault(_Math);

var _Texture = __webpack_require__(12);

var _Texture2 = _interopRequireDefault(_Texture);

var _ShaderProgram = __webpack_require__(8);

var _ShaderProgram2 = _interopRequireDefault(_ShaderProgram);

var _ViewNode = __webpack_require__(3);

var _ViewNode2 = _interopRequireDefault(_ViewNode);

var _Constants3 = __webpack_require__(15);

var _Constants4 = __webpack_require__(13);

var _vtkPolyDataVS = __webpack_require__(31);

var _vtkPolyDataVS2 = _interopRequireDefault(_vtkPolyDataVS);

var _vtkPolyDataFS = __webpack_require__(16);

var _vtkPolyDataFS2 = _interopRequireDefault(_vtkPolyDataFS);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vtkErrorMacro = _macro2.default.vtkErrorMacro;
var SlicingMode = _Constants2.default.SlicingMode;

// ----------------------------------------------------------------------------
// vtkOpenGLImageMapper methods
// ----------------------------------------------------------------------------

function vtkOpenGLImageMapper(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkOpenGLImageMapper');

  publicAPI.buildPass = function (prepass) {
    if (prepass) {
      model.openGLRenderWindow = publicAPI.getFirstAncestorOfType('vtkOpenGLRenderWindow');
      model.context = model.openGLRenderWindow.getContext();
      model.tris.setContext(model.context);
      model.openGLTexture.setWindow(model.openGLRenderWindow);
      model.openGLTexture.setContext(model.context);
      model.openGLImageSlice = publicAPI.getFirstAncestorOfType('vtkOpenGLImageSlice');
      model.openGLRenderer = publicAPI.getFirstAncestorOfType('vtkOpenGLRenderer');
      var ren = model.openGLRenderer.getRenderable();
      model.openGLCamera = model.openGLRenderer.getViewNodeFor(ren.getActiveCamera());
      // is zslice set by the camera
      if (model.renderable.getSliceAtFocalPoint()) {
        model.renderable.setZSliceFromCamera(ren.getActiveCamera());
      }
    }
  };

  publicAPI.translucentPass = function (prepass) {
    if (prepass) {
      publicAPI.render();
    }
  };

  publicAPI.opaquePass = function (prepass) {
    if (prepass) {
      publicAPI.render();
    }
  };

  // Renders myself
  publicAPI.render = function () {
    var actor = model.openGLImageSlice.getRenderable();
    var ren = model.openGLRenderer.getRenderable();
    publicAPI.renderPiece(ren, actor);
  };

  publicAPI.buildShaders = function (shaders, ren, actor) {
    publicAPI.getShaderTemplate(shaders, ren, actor);
    publicAPI.replaceShaderValues(shaders, ren, actor);
  };

  publicAPI.getShaderTemplate = function (shaders, ren, actor) {
    shaders.Vertex = _vtkPolyDataVS2.default;
    shaders.Fragment = _vtkPolyDataFS2.default;
    shaders.Geometry = '';
  };

  publicAPI.replaceShaderValues = function (shaders, ren, actor) {
    var VSSource = shaders.Vertex;
    var FSSource = shaders.Fragment;

    VSSource = _ShaderProgram2.default.substitute(VSSource, '//VTK::Camera::Dec', ['uniform mat4 MCDCMatrix;']).result;
    VSSource = _ShaderProgram2.default.substitute(VSSource, '//VTK::PositionVC::Impl', ['  gl_Position = MCDCMatrix * vertexMC;']).result;

    VSSource = _ShaderProgram2.default.substitute(VSSource, '//VTK::TCoord::Impl', 'tcoordVCVSOutput = tcoordMC;').result;

    var tNumComp = model.openGLTexture.getComponents();

    VSSource = _ShaderProgram2.default.substitute(VSSource, '//VTK::TCoord::Dec', 'attribute vec2 tcoordMC; varying vec2 tcoordVCVSOutput;').result;
    FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::TCoord::Dec', ['varying vec2 tcoordVCVSOutput;', 'uniform float shift;', 'uniform float scale;', 'uniform sampler2D texture1;']).result;
    switch (tNumComp) {
      case 1:
        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::TCoord::Impl', ['float intensity = texture2D(texture1, tcoordVCVSOutput).r*scale + shift;', 'gl_FragData[0] = vec4(intensity,intensity,intensity,1.0);']).result;
        break;
      case 2:
        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::TCoord::Impl', ['vec4 tcolor = texture2D(texture1, tcoordVCVSOutput);', 'float intensity = tcolor.r*scale + shift;', 'gl_FragData[0] = vec4(intensity, intensity, intensity, scale*tcolor.g + shift);']).result;
        break;
      default:
        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::TCoord::Impl', 'gl_FragData[0] = scale*texture2D(texture1, tcoordVCVSOutput.st) + shift;').result;
    }
    shaders.Vertex = VSSource;
    shaders.Fragment = FSSource;
  };

  publicAPI.getNeedToRebuildShaders = function (cellBO, ren, actor) {
    // has something changed that would require us to recreate the shader?
    // candidates are
    // property modified (representation interpolation and lighting)
    // input modified
    // light complexity changed
    if (cellBO.getProgram() === 0 || cellBO.getShaderSourceTime().getMTime() < publicAPI.getMTime() || cellBO.getShaderSourceTime().getMTime() < actor.getMTime() || cellBO.getShaderSourceTime().getMTime() < model.currentInput.getMTime()) {
      return true;
    }

    return false;
  };

  publicAPI.updateShaders = function (cellBO, ren, actor) {
    cellBO.getVAO().bind();
    model.lastBoundBO = cellBO;

    // has something changed that would require us to recreate the shader?
    if (publicAPI.getNeedToRebuildShaders(cellBO, ren, actor)) {
      var shaders = { Vertex: null, Fragment: null, Geometry: null };

      publicAPI.buildShaders(shaders, ren, actor);

      // compile and bind the program if needed
      var newShader = model.openGLRenderWindow.getShaderCache().readyShaderProgramArray(shaders.Vertex, shaders.Fragment, shaders.Geometry);

      // if the shader changed reinitialize the VAO
      if (newShader !== cellBO.getProgram()) {
        cellBO.setProgram(newShader);
        // reset the VAO as the shader has changed
        cellBO.getVAO().releaseGraphicsResources();
      }

      cellBO.getShaderSourceTime().modified();
    } else {
      model.openGLRenderWindow.getShaderCache().readyShaderProgram(cellBO.getProgram());
    }

    publicAPI.setMapperShaderParameters(cellBO, ren, actor);
    publicAPI.setCameraShaderParameters(cellBO, ren, actor);
    publicAPI.setPropertyShaderParameters(cellBO, ren, actor);
  };

  publicAPI.setMapperShaderParameters = function (cellBO, ren, actor) {
    // Now to update the VAO too, if necessary.

    if (cellBO.getCABO().getElementCount() && (model.VBOBuildTime > cellBO.getAttributeUpdateTime().getMTime() || cellBO.getShaderSourceTime().getMTime() > cellBO.getAttributeUpdateTime().getMTime())) {
      cellBO.getCABO().bind();
      if (cellBO.getProgram().isAttributeUsed('vertexMC')) {
        if (!cellBO.getVAO().addAttributeArray(cellBO.getProgram(), cellBO.getCABO(), 'vertexMC', cellBO.getCABO().getVertexOffset(), cellBO.getCABO().getStride(), model.context.FLOAT, 3, model.context.FALSE)) {
          vtkErrorMacro('Error setting vertexMC in shader VAO.');
        }
      }
      if (cellBO.getProgram().isAttributeUsed('tcoordMC') && cellBO.getCABO().getTCoordOffset()) {
        if (!cellBO.getVAO().addAttributeArray(cellBO.getProgram(), cellBO.getCABO(), 'tcoordMC', cellBO.getCABO().getTCoordOffset(), cellBO.getCABO().getStride(), model.context.FLOAT, cellBO.getCABO().getTCoordComponents(), model.context.FALSE)) {
          vtkErrorMacro('Error setting tcoordMC in shader VAO.');
        }
      }
    }

    var texUnit = model.openGLTexture.getTextureUnit();
    cellBO.getProgram().setUniformi('texture1', texUnit);

    var cw = actor.getProperty().getColorWindow();
    var cl = actor.getProperty().getColorLevel();
    var oglShiftScale = model.openGLTexture.getShiftAndScale();

    var scale = oglShiftScale.scale / cw;
    var shift = (oglShiftScale.shift - cl) / cw + 0.5;

    cellBO.getProgram().setUniformf('shift', shift);
    cellBO.getProgram().setUniformf('scale', scale);
  };

  publicAPI.setCameraShaderParameters = function (cellBO, ren, actor) {
    var program = cellBO.getProgram();

    var image = model.currentInput;
    var i2wmat4 = image.getIndexToWorld();

    var keyMats = model.openGLCamera.getKeyMatrices(ren);
    _glMatrix.mat4.multiply(model.imagemat, keyMats.wcdc, i2wmat4);
    program.setUniformMatrix('MCDCMatrix', model.imagemat);
  };

  publicAPI.setPropertyShaderParameters = function (cellBO, ren, actor) {
    var program = cellBO.getProgram();

    var ppty = actor.getProperty();

    var opacity = ppty.getOpacity();
    program.setUniformf('opacityUniform', opacity);
  };

  publicAPI.renderPieceStart = function (ren, actor) {
    // make sure the BOs are up to date
    publicAPI.updateBufferObjects(ren, actor);

    // Bind the OpenGL, this is shared between the different primitive/cell types.
    model.lastBoundBO = null;
  };

  publicAPI.renderPieceDraw = function (ren, actor) {
    var gl = model.context;

    // activate the texture
    model.openGLTexture.activate();

    // draw polygons
    if (model.tris.getCABO().getElementCount()) {
      // First we do the triangles, update the shader, set uniforms, etc.
      publicAPI.updateShaders(model.tris, ren, actor);
      gl.drawArrays(gl.TRIANGLES, 0, model.tris.getCABO().getElementCount());
    }

    model.openGLTexture.deactivate();
  };

  publicAPI.renderPieceFinish = function (ren, actor) {
    if (model.LastBoundBO) {
      model.LastBoundBO.getVAO().release();
    }
  };

  publicAPI.renderPiece = function (ren, actor) {
    // Make sure that we have been properly initialized.
    // if (ren.getRenderWindow().checkAbortStatus()) {
    //   return;
    // }

    publicAPI.invokeEvent({ type: 'StartEvent' });
    model.renderable.update();
    model.currentInput = model.renderable.getInputData();
    publicAPI.invokeEvent({ type: 'EndEvent' });

    if (model.currentInput === null) {
      vtkErrorMacro('No input!');
      return;
    }

    publicAPI.renderPieceStart(ren, actor);
    publicAPI.renderPieceDraw(ren, actor);
    publicAPI.renderPieceFinish(ren, actor);
  };

  publicAPI.computeBounds = function (ren, actor) {
    if (!publicAPI.getInput()) {
      _Math2.default.uninitializeBounds(model.bounds);
      return;
    }
    model.bounds = publicAPI.getInput().getBounds();
  };

  publicAPI.updateBufferObjects = function (ren, actor) {
    // Rebuild buffers if needed
    if (publicAPI.getNeedToRebuildBufferObjects(ren, actor)) {
      publicAPI.buildBufferObjects(ren, actor);
    }
  };

  publicAPI.getNeedToRebuildBufferObjects = function (ren, actor) {
    // first do a coarse check
    if (model.VBOBuildTime.getMTime() < publicAPI.getMTime() || model.VBOBuildTime.getMTime() < actor.getMTime() || model.VBOBuildTime.getMTime() < model.renderable.getMTime() || model.VBOBuildTime.getMTime() < actor.getProperty().getMTime() || model.VBOBuildTime.getMTime() < model.currentInput.getMTime()) {
      return true;
    }
    return false;
  };

  publicAPI.buildBufferObjects = function (ren, actor) {
    var image = model.currentInput;

    if (image === null) {
      return;
    }

    // rebuild the VBO if the data has changed
    var nSlice = model.renderable.getZSlice();
    if (model.renderable.getCurrentSlicingMode() === SlicingMode.X) {
      nSlice = model.renderable.getXSlice();
    }
    if (model.renderable.getCurrentSlicingMode() === SlicingMode.Y) {
      nSlice = model.renderable.getYSlice();
    }
    var toString = nSlice + 'A' + image.getMTime() + 'A' + image.getPointData().getScalars().getMTime() + 'B' + publicAPI.getMTime();
    if (model.VBOBuildString !== toString) {
      // Build the VBOs
      var dims = image.getDimensions();
      if (image.getPointData().getScalars().getNumberOfComponents() === 4) {
        model.openGLTexture.setGenerateMipmap(true);
        model.openGLTexture.setMinificationFilter(_Constants4.Filter.LINEAR_MIPMAP_LINEAR);
      } else {
        model.openGLTexture.setMinificationFilter(_Constants4.Filter.LINEAR);
      }
      model.openGLTexture.setMagnificationFilter(_Constants4.Filter.LINEAR);
      model.openGLTexture.setWrapS(_Constants4.Wrap.CLAMP_TO_EDGE);
      model.openGLTexture.setWrapT(_Constants4.Wrap.CLAMP_TO_EDGE);
      var numComp = image.getPointData().getScalars().getNumberOfComponents();
      var sliceSize = dims[0] * dims[1] * numComp;

      var ext = image.getExtent();
      var ptsArray = new Float32Array(12);
      var tcoordArray = new Float32Array(8);
      for (var i = 0; i < 4; i++) {
        ptsArray[i * 3] = i % 2 ? ext[1] : ext[0];
        ptsArray[i * 3 + 1] = i > 1 ? ext[3] : ext[2];
        ptsArray[i * 3 + 2] = nSlice;
        tcoordArray[i * 2] = i % 2 ? 1.0 : 0.0;
        tcoordArray[i * 2 + 1] = i > 1 ? 1.0 : 0.0;
      }

      var basicScalars = image.getPointData().getScalars().getData();
      var scalars = basicScalars.subarray(nSlice * sliceSize, (nSlice + 1) * sliceSize);
      // Get right scalars according to slicing mode
      if (model.renderable.getCurrentSlicingMode() === SlicingMode.X) {
        scalars = [];
        for (var k = 0; k < dims[2]; k++) {
          for (var j = 0; j < dims[1]; j++) {
            scalars.push(basicScalars[nSlice + j * dims[0] + k * dims[0] * dims[1]]);
          }
        }
        dims[0] = dims[1];
        dims[1] = dims[2];
        ptsArray[0] = nSlice;
        ptsArray[1] = ext[2];
        ptsArray[2] = ext[4];
        ptsArray[3] = nSlice;
        ptsArray[4] = ext[3];
        ptsArray[5] = ext[4];
        ptsArray[6] = nSlice;
        ptsArray[7] = ext[2];
        ptsArray[8] = ext[5];
        ptsArray[9] = nSlice;
        ptsArray[10] = ext[3];
        ptsArray[11] = ext[5];
      }
      if (model.renderable.getCurrentSlicingMode() === SlicingMode.Y) {
        scalars = [];
        for (var _k = 0; _k < dims[2]; _k++) {
          for (var _i = 0; _i < dims[0]; _i++) {
            scalars.push(basicScalars[_i + nSlice * dims[0] + _k * dims[0] * dims[1]]);
          }
        }
        dims[1] = dims[2];
        ptsArray[0] = ext[0];
        ptsArray[1] = nSlice;
        ptsArray[2] = ext[4];
        ptsArray[3] = ext[1];
        ptsArray[4] = nSlice;
        ptsArray[5] = ext[4];
        ptsArray[6] = ext[0];
        ptsArray[7] = nSlice;
        ptsArray[8] = ext[5];
        ptsArray[9] = ext[1];
        ptsArray[10] = nSlice;
        ptsArray[11] = ext[5];
      }

      if (model.renderable.getCurrentSlicingMode() === SlicingMode.Z) {
        ptsArray[0] = ext[0];
        ptsArray[1] = ext[2];
        ptsArray[2] = nSlice;
        ptsArray[3] = ext[1];
        ptsArray[4] = ext[2];
        ptsArray[5] = nSlice;
        ptsArray[6] = ext[0];
        ptsArray[7] = ext[3];
        ptsArray[8] = nSlice;
        ptsArray[9] = ext[1];
        ptsArray[10] = ext[3];
        ptsArray[11] = nSlice;
      }

      model.openGLTexture.create2DFromRaw(dims[0], dims[1], numComp, image.getPointData().getScalars().getDataType(), scalars);
      model.openGLTexture.activate();
      model.openGLTexture.sendParameters();
      model.openGLTexture.deactivate();

      var points = _DataArray2.default.newInstance({ numberOfComponents: 3, values: ptsArray });
      points.setName('points');
      var tcoords = _DataArray2.default.newInstance({ numberOfComponents: 2, values: tcoordArray });
      tcoords.setName('tcoords');

      var cellArray = new Uint16Array(8);
      cellArray[0] = 3;
      cellArray[1] = 0;
      cellArray[2] = 1;
      cellArray[3] = 3;
      cellArray[4] = 3;
      cellArray[5] = 0;
      cellArray[6] = 3;
      cellArray[7] = 2;
      var cells = _DataArray2.default.newInstance({ numberOfComponents: 1, values: cellArray });

      model.tris.getCABO().createVBO(cells, 'polys', _Constants3.Representation.SURFACE, { points: points, tcoords: tcoords, cellOffset: 0 });
      model.VBOBuildTime.modified();
      model.VBOBuildString = toString;
    }
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  context: null,
  VBOBuildTime: 0,
  VBOBuildString: null,
  openGLTexture: null,
  tris: null,
  imagemat: null
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  _ViewNode2.default.extend(publicAPI, model, initialValues);

  model.tris = _Helper2.default.newInstance();
  model.openGLTexture = _Texture2.default.newInstance();

  model.imagemat = _glMatrix.mat4.create();

  // Build VTK API
  _macro2.default.setGet(publicAPI, model, ['context']);

  model.VBOBuildTime = {};
  _macro2.default.obj(model.VBOBuildTime);

  // Object methods
  vtkOpenGLImageMapper(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkOpenGLImageMapper');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var SlicingMode = exports.SlicingMode = {
  NONE: -1,
  X: 0,
  Y: 1,
  Z: 2
};

exports.default = {
  SlicingMode: SlicingMode
};

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _BufferObject = __webpack_require__(19);

var _BufferObject2 = _interopRequireDefault(_BufferObject);

var _Constants = __webpack_require__(14);

var _Constants2 = __webpack_require__(15);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vtkDebugMacro = _macro2.default.vtkDebugMacro,
    vtkErrorMacro = _macro2.default.vtkErrorMacro;

// ----------------------------------------------------------------------------
// vtkOpenGLCellArrayBufferObject methods
// ----------------------------------------------------------------------------

function vtkOpenGLCellArrayBufferObject(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkOpenGLCellArrayBufferObject');

  publicAPI.setType(_Constants.ObjectType.ARRAY_BUFFER);

  publicAPI.createVBO = function (cellArray, inRep, outRep, options) {
    if (!cellArray.getData() || !cellArray.getData().length) {
      model.elementCount = 0;
      return 0;
    }

    // Figure out how big each block will be, currently 6 or 7 floats.
    model.blockSize = 3;
    model.vertexOffset = 0;
    model.normalOffset = 0;
    model.tCoordOffset = 0;
    model.tCoordComponents = 0;
    model.colorComponents = 0;
    model.colorOffset = 0;

    var pointData = options.points.getData();
    var normalData = null;
    var tcoordData = null;
    var colorData = null;

    var colorComponents = options.colors ? options.colors.getNumberOfComponents() : 0;
    var textureComponents = options.tcoords ? options.tcoords.getNumberOfComponents() : 0;

    // the values of 4 below are because floats are 4 bytes

    if (options.normals) {
      model.normalOffset = 4 * model.blockSize;
      model.blockSize += 3;
      normalData = options.normals.getData();
    }

    if (options.tcoords) {
      model.tCoordOffset = 4 * model.blockSize;
      model.tCoordComponents = textureComponents;
      model.blockSize += textureComponents;
      tcoordData = options.tcoords.getData();
    }

    if (options.colors) {
      model.colorComponents = options.colors.getNumberOfComponents();
      model.colorOffset = 0;
      colorData = options.colors.getData();
      if (!model.colorBO) {
        model.colorBO = _BufferObject2.default.newInstance();
      }
      model.colorBO.setContext(model.context);
    } else {
      model.colorBO = null;
    }
    model.stride = 4 * model.blockSize;

    var pointIdx = 0;
    var normalIdx = 0;
    var tcoordIdx = 0;
    var colorIdx = 0;
    var cellCount = 0;
    var addAPoint = void 0;

    var cellBuilders = {
      // easy, every input point becomes an output point
      anythingToPoints: function anythingToPoints(numPoints, cellPts, offset) {
        for (var i = 0; i < numPoints; ++i) {
          addAPoint(cellPts[offset + i]);
        }
      },
      linesToWireframe: function linesToWireframe(numPoints, cellPts, offset) {
        // for lines we add a bunch of segments
        for (var i = 0; i < numPoints - 1; ++i) {
          addAPoint(cellPts[offset + i]);
          addAPoint(cellPts[offset + i + 1]);
        }
      },
      polysToWireframe: function polysToWireframe(numPoints, cellPts, offset) {
        // for polys we add a bunch of segments and close it
        for (var i = 0; i < numPoints; ++i) {
          addAPoint(cellPts[offset + i]);
          addAPoint(cellPts[offset + (i + 1) % numPoints]);
        }
      },
      stripsToWireframe: function stripsToWireframe(numPoints, cellPts, offset) {
        // for strips we add a bunch of segments and close it
        for (var i = 0; i < numPoints - 1; ++i) {
          addAPoint(cellPts[offset + i]);
          addAPoint(cellPts[offset + i + 1]);
        }
        for (var _i = 0; _i < numPoints - 2; _i++) {
          addAPoint(cellPts[offset + _i]);
          addAPoint(cellPts[offset + _i + 2]);
        }
      },
      polysToSurface: function polysToSurface(npts, cellPts, offset) {
        if (npts < 3) {
          // ignore degenerate triangles
          vtkDebugMacro('skipping degenerate triangle');
        } else {
          for (var i = 0; i < npts - 2; i++) {
            addAPoint(cellPts[offset + 0]);
            addAPoint(cellPts[offset + i + 1]);
            addAPoint(cellPts[offset + i + 2]);
          }
        }
      },
      stripsToSurface: function stripsToSurface(npts, cellPts, offset) {
        for (var i = 0; i < npts - 2; i++) {
          addAPoint(cellPts[offset + i]);
          addAPoint(cellPts[offset + i + 1 + i % 2]);
          addAPoint(cellPts[offset + i + 1 + (i + 1) % 2]);
        }
      }
    };

    var cellCounters = {
      // easy, every input point becomes an output point
      anythingToPoints: function anythingToPoints(numPoints, cellPts) {
        return numPoints;
      },
      linesToWireframe: function linesToWireframe(numPoints, cellPts) {
        return (numPoints - 1) * 2;
      },
      polysToWireframe: function polysToWireframe(numPoints, cellPts) {
        return numPoints * 2;
      },
      stripsToWireframe: function stripsToWireframe(numPoints, cellPts) {
        return numPoints * 4 - 6;
      },
      polysToSurface: function polysToSurface(npts, cellPts) {
        if (npts < 3) {
          return 0;
        }
        return (npts - 2) * 3;
      },
      stripsToSurface: function stripsToSurface(npts, cellPts, offset) {
        return (npts - 2) * 3;
      }
    };

    var func = null;
    var countFunc = null;
    if (outRep === _Constants2.Representation.POINTS || inRep === 'verts') {
      func = cellBuilders.anythingToPoints;
      countFunc = cellCounters.anythingToPoints;
    } else if (outRep === _Constants2.Representation.WIREFRAME || inRep === 'lines') {
      func = cellBuilders[inRep + 'ToWireframe'];
      countFunc = cellCounters[inRep + 'ToWireframe'];
    } else {
      func = cellBuilders[inRep + 'ToSurface'];
      countFunc = cellCounters[inRep + 'ToSurface'];
    }

    var array = cellArray.getData();
    var size = array.length;
    var caboCount = 0;
    for (var index = 0; index < size;) {
      caboCount += countFunc(array[index], array);
      index += array[index] + 1;
    }

    var packedUCVBO = null;
    var packedVBO = new Float32Array(caboCount * model.blockSize);
    if (colorData) {
      packedUCVBO = new Uint8Array(caboCount * 4);
    }
    var vboidx = 0;
    var ucidx = 0;

    addAPoint = function addAPointFunc(i) {
      // Vertices
      pointIdx = i * 3;

      packedVBO[vboidx++] = pointData[pointIdx++];
      packedVBO[vboidx++] = pointData[pointIdx++];
      packedVBO[vboidx++] = pointData[pointIdx++];

      if (normalData !== null) {
        if (options.haveCellNormals) {
          normalIdx = (cellCount + options.cellOffset) * 3;
        } else {
          normalIdx = i * 3;
        }
        packedVBO[vboidx++] = normalData[normalIdx++];
        packedVBO[vboidx++] = normalData[normalIdx++];
        packedVBO[vboidx++] = normalData[normalIdx++];
      }

      if (tcoordData !== null) {
        tcoordIdx = i * textureComponents;
        for (var j = 0; j < textureComponents; ++j) {
          packedVBO[vboidx++] = tcoordData[tcoordIdx++];
        }
      }

      if (colorData !== null) {
        if (options.haveCellScalars) {
          colorIdx = (cellCount + options.cellOffset) * colorComponents;
        } else {
          colorIdx = i * colorComponents;
        }
        packedUCVBO[ucidx++] = colorData[colorIdx++];
        packedUCVBO[ucidx++] = colorData[colorIdx++];
        packedUCVBO[ucidx++] = colorData[colorIdx++];
        packedUCVBO[ucidx++] = colorComponents === 4 ? colorData[colorIdx++] : 255;
      }
    };

    for (var _index = 0; _index < size;) {
      func(array[_index], array, _index + 1);
      _index += array[_index] + 1;
      cellCount++;
    }
    model.elementCount = caboCount;
    publicAPI.upload(packedVBO, _Constants.ObjectType.ARRAY_BUFFER);
    if (model.colorBO) {
      model.colorBOStride = 4;
      model.colorBO.upload(packedUCVBO, _Constants.ObjectType.ARRAY_BUFFER);
    }
    return cellCount;
  };

  publicAPI.setCoordShiftAndScaleMethod = function (shiftScaleMethod) {
    vtkErrorMacro('coordinate shift and scale not yet implemented');
  };

  publicAPI.setCoordShift = function (shiftArray) {
    vtkErrorMacro('coordinate shift and scale not yet implemented');
  };

  publicAPI.setCoordScale = function (scaleArray) {
    vtkErrorMacro('coordinate shift and scale not yet implemented');
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  elementCount: 0,
  stride: 0,
  colorBOStride: 0,
  vertexOffset: 0,
  normalOffset: 0,
  tCoordOffset: 0,
  tCoordComponents: 0,
  colorOffset: 0,
  colorComponents: 0,
  tcoordBO: null
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  _BufferObject2.default.extend(publicAPI, model, initialValues);

  _macro2.default.setGet(publicAPI, model, ['colorBO', 'elementCount', 'stride', 'colorBOStride', 'vertexOffset', 'normalOffset', 'tCoordOffset', 'tCoordComponents', 'colorOffset', 'colorComponents']);

  // Object specific methods
  vtkOpenGLCellArrayBufferObject(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend);

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vtkErrorMacro = _macro2.default.vtkErrorMacro;

// export const SHADER_TYPES = ['Vertex', 'Fragment', 'Geometry', 'Unknown'];

// ----------------------------------------------------------------------------
// vtkShader methods
// ----------------------------------------------------------------------------

function vtkShader(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkShader');

  publicAPI.compile = function () {
    var stype = model.context.VERTEX_SHADER;

    if (!model.source || !model.source.length || model.shaderType === 'Unknown') {
      return false;
    }

    // Ensure we delete the previous shader if necessary.
    if (model.handle !== 0) {
      model.context.deleteShader(model.handle);
      model.handle = 0;
    }

    switch (model.shaderType) {
      // case vtkShader::Geometry:
      //   type = GL_GEOMETRY_SHADER;
      //   break;
      case 'Fragment':
        stype = model.context.FRAGMENT_SHADER;
        break;
      case 'Vertex':
      default:
        stype = model.context.VERTEX_SHADER;
        break;
    }

    model.handle = model.context.createShader(stype);
    model.context.shaderSource(model.handle, model.source);
    model.context.compileShader(model.handle);
    var isCompiled = model.context.getShaderParameter(model.handle, model.context.COMPILE_STATUS);
    if (!isCompiled) {
      var lastError = model.context.getShaderInfoLog(model.handle);
      vtkErrorMacro('Error compiling shader \'' + model.source + '\': ' + lastError);
      model.context.deleteShader(model.handle);
      model.handle = 0;
      return false;
    }

    // The shader compiled, store its handle and return success.
    return true;
  };

  publicAPI.cleanup = function () {
    if (model.shaderType === 'Unknown' || model.handle === 0) {
      return;
    }

    model.context.deleteShader(model.handle);
    model.handle = 0;
    model.dirty = true;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  shaderType: 'Unknown',
  source: '',
  error: '',
  handle: 0,
  dirty: false,
  context: null
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  _macro2.default.obj(publicAPI, model);
  _macro2.default.setGet(publicAPI, model, ['shaderType', 'source', 'error', 'handle', 'context']);

  // Object methods
  vtkShader(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkShader');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _glMatrix = __webpack_require__(2);

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _ViewNode = __webpack_require__(3);

var _ViewNode2 = _interopRequireDefault(_ViewNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------------------------------------------------------------
// vtkOpenGLImageSlice methods
// ----------------------------------------------------------------------------

function vtkOpenGLImageSlice(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkOpenGLImageSlice');

  // Builds myself.
  publicAPI.buildPass = function (prepass) {
    if (!model.renderable || !model.renderable.getVisibility()) {
      return;
    }
    if (prepass) {
      if (!model.renderable) {
        return;
      }

      publicAPI.prepareNodes();
      publicAPI.addMissingNode(model.renderable.getMapper());
      publicAPI.removeUnusedNodes();
    }
  };

  publicAPI.traverseOpaqueZBufferPass = function (renderPass) {
    publicAPI.traverseOpaquePass(renderPass);
  };

  // we draw textures, then mapper, then post pass textures
  publicAPI.traverseOpaquePass = function (renderPass) {
    if (!model.renderable || !model.renderable.getVisibility() || !model.renderable.getIsOpaque()) {
      return;
    }

    publicAPI.apply(renderPass, true);
    model.children.forEach(function (child) {
      child.traverse(renderPass);
    });
    publicAPI.apply(renderPass, false);
  };

  // we draw textures, then mapper, then post pass textures
  publicAPI.traverseTranslucentPass = function (renderPass) {
    if (!model.renderable || !model.renderable.getVisibility() || model.renderable.getIsOpaque()) {
      return;
    }

    publicAPI.apply(renderPass, true);
    model.children.forEach(function (child) {
      child.traverse(renderPass);
    });
    publicAPI.apply(renderPass, false);
  };

  publicAPI.queryPass = function (prepass, renderPass) {
    if (prepass) {
      if (!model.renderable || !model.renderable.getVisibility()) {
        return;
      }
      if (model.renderable.getIsOpaque()) {
        renderPass.incrementOpaqueActorCount();
      } else {
        renderPass.incrementTranslucentActorCount();
      }
    }
  };

  publicAPI.opaqueZBufferPass = function (prepass, renderPass) {
    return publicAPI.opaquePass(prepass, renderPass);
  };

  // Renders myself
  publicAPI.opaquePass = function (prepass, renderPass) {
    if (prepass) {
      model.context = publicAPI.getFirstAncestorOfType('vtkOpenGLRenderWindow').getContext();
      model.context.depthMask(true);
    }
  };

  // Renders myself
  publicAPI.translucentPass = function (prepass, renderPass) {
    if (prepass) {
      model.context = publicAPI.getFirstAncestorOfType('vtkOpenGLRenderWindow').getContext();
      model.context.depthMask(false);
    } else {
      model.context.depthMask(true);
    }
  };

  publicAPI.getKeyMatrices = function () {
    // has the actor changed?
    if (model.renderable.getMTime() > model.keyMatrixTime.getMTime()) {
      model.renderable.computeMatrix();
      _glMatrix.mat4.copy(model.MCWCMatrix, model.renderable.getMatrix());
      _glMatrix.mat4.transpose(model.MCWCMatrix, model.MCWCMatrix);

      if (model.renderable.getIsIdentity()) {
        _glMatrix.mat3.identity(model.normalMatrix);
      } else {
        _glMatrix.mat3.fromMat4(model.normalMatrix, model.MCWCMatrix);
        _glMatrix.mat3.invert(model.normalMatrix, model.normalMatrix);
      }
      model.keyMatrixTime.modified();
    }

    return { mcwc: model.MCWCMatrix, normalMatrix: model.normalMatrix };
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  context: null,
  keyMatrixTime: null,
  normalMatrix: null,
  MCWCMatrix: null
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  _ViewNode2.default.extend(publicAPI, model, initialValues);

  model.keyMatrixTime = {};
  _macro2.default.obj(model.keyMatrixTime);
  model.normalMatrix = _glMatrix.mat3.create();
  model.MCWCMatrix = _glMatrix.mat4.create();

  // Build VTK API
  _macro2.default.setGet(publicAPI, model, ['context']);

  // Object methods
  vtkOpenGLImageSlice(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkOpenGLImageSlice');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _ViewNode = __webpack_require__(3);

var _ViewNode2 = _interopRequireDefault(_ViewNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { mat4, vec3 }     from 'gl-matrix';

var vtkDebugMacro = _macro2.default.vtkDebugMacro;

// ----------------------------------------------------------------------------
// vtkOpenGLPixelSpaceCallbackMapper methods
// ----------------------------------------------------------------------------

function vtkOpenGLPixelSpaceCallbackMapper(publicAPI, model) {
  model.classHierarchy.push('vtkOpenGLPixelSpaceCallbackMapper');

  publicAPI.opaquePass = function (prepass, renderPass) {
    var oglren = publicAPI.getFirstAncestorOfType('vtkOpenGLRenderer');
    var aspectRatio = oglren.getAspectRatio();
    var ren = publicAPI.getFirstAncestorOfType('vtkOpenGLRenderer');
    var camera = ren ? ren.getRenderable().getActiveCamera() : null;
    var tsize = ren.getTiledSizeAndOrigin();
    var texels = null;

    if (model.renderable.getUseZValues()) {
      var zbt = renderPass.getZBufferTexture();
      var width = Math.floor(zbt.getWidth());
      var height = Math.floor(zbt.getHeight());

      var gl = zbt.getContext();
      zbt.bind();

      // Here we need to use vtkFramebuffer to save current settings (bindings/buffers)
      var fb = renderPass.getFramebuffer();
      if (!fb) {
        vtkDebugMacro('No framebuffer to save/restore');
      } else {
        // save framebuffer settings
        fb.saveCurrentBindingsAndBuffers();
      }

      var framebuffer = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, zbt.getHandle(), 0);

      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) {
        texels = new Uint8Array(width * height * 4);
        gl.viewport(0, 0, width, height);
        gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, texels);
      }

      // Now we need to restore framebuffer bindings/buffers
      if (fb) {
        fb.restorePreviousBindingsAndBuffers();
      }

      zbt.unBind();
      gl.deleteFramebuffer(framebuffer);
    }

    model.renderable.invokeCallback(model.renderable.getInputData(), camera, aspectRatio, tsize, texels);
  };

  publicAPI.queryPass = function (prepass, renderPass) {
    if (prepass) {
      if (model.renderable.getUseZValues()) {
        renderPass.setDepthRequested(true);
      } else {
        renderPass.setDepthRequested(true);
      }
    }
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  _ViewNode2.default.extend(publicAPI, model, initialValues);

  // Object methods
  vtkOpenGLPixelSpaceCallbackMapper(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkOpenGLPixelSpaceCallbackMapper');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var PassTypes = exports.PassTypes = {
  MIN_KNOWN_PASS: 0,
  ACTOR_PASS: 0,
  COMPOSITE_INDEX_PASS: 1,
  ID_LOW24: 2,
  MAX_KNOWN_PASS: 2
};

exports.default = {
  PassTypes: PassTypes
};

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _ViewNode = __webpack_require__(3);

var _ViewNode2 = _interopRequireDefault(_ViewNode);

var _Math = __webpack_require__(1);

var _Math2 = _interopRequireDefault(_Math);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var vtkDebugMacro = _macro2.default.vtkDebugMacro;

// ----------------------------------------------------------------------------
// vtkOpenGLRenderer methods
// ----------------------------------------------------------------------------
/* eslint-disable no-bitwise */

function vtkOpenGLRenderer(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkOpenGLRenderer');

  // Builds myself.
  publicAPI.buildPass = function (prepass) {
    if (prepass) {
      if (!model.renderable) {
        return;
      }

      // make sure we have a camera
      if (!model.renderable.isActiveCameraCreated()) {
        model.renderable.resetCamera();
      }
      publicAPI.updateLights();
      publicAPI.prepareNodes();
      publicAPI.addMissingNode(model.renderable.getActiveCamera());
      publicAPI.addMissingPropNodes(model.renderable.getViewProps());
      publicAPI.removeUnusedNodes();
    }
  };

  publicAPI.updateLights = function () {
    var count = 0;

    model.renderable.getLights().forEach(function (light) {
      if (light.getSwitch() > 0.0) {
        count++;
      }
    });

    if (!count) {
      vtkDebugMacro('No lights are on, creating one.');
      model.renderable.createLight();
    }

    return count;
  };

  publicAPI.opaqueZBufferPass = function (prepass) {
    if (prepass) {
      var clearMask = 0;
      var gl = model.context;
      if (!model.renderable.getTransparent()) {
        model.context.clearColor(1.0, 0.0, 0.0, 1.0);
        clearMask |= gl.COLOR_BUFFER_BIT;
      }

      if (!model.renderable.getPreserveDepthBuffer()) {
        gl.clearDepth(1.0);
        clearMask |= gl.DEPTH_BUFFER_BIT;
        gl.depthMask(true);
      }

      gl.colorMask(true, true, true, true);
      gl.clear(clearMask);

      gl.enable(gl.DEPTH_TEST);
    }
  };

  // Renders myself
  publicAPI.cameraPass = function (prepass) {
    if (prepass) {
      publicAPI.clear();
    }
  };

  publicAPI.getAspectRatio = function () {
    var size = model.parent.getSize();
    var viewport = model.renderable.getViewport();
    return size[0] * (viewport[2] - viewport[0]) / ((viewport[3] - viewport[1]) * size[1]);
  };

  publicAPI.getTiledSizeAndOrigin = function () {
    var vport = model.renderable.getViewport();

    // if there is no window assume 0 1
    var tileViewPort = [0.0, 0.0, 1.0, 1.0];

    // find the lower left corner of the viewport, taking into account the
    // lower left boundary of this tile
    var vpu = _Math2.default.clampValue(vport[0] - tileViewPort[0], 0.0, 1.0);
    var vpv = _Math2.default.clampValue(vport[1] - tileViewPort[1], 0.0, 1.0);

    // store the result as a pixel value
    var ndvp = model.parent.normalizedDisplayToDisplay(vpu, vpv);
    var lowerLeftU = Math.round(ndvp[0]);
    var lowerLeftV = Math.round(ndvp[1]);

    // find the upper right corner of the viewport, taking into account the
    // lower left boundary of this tile
    var vpu2 = _Math2.default.clampValue(vport[2] - tileViewPort[0], 0.0, 1.0);
    var vpv2 = _Math2.default.clampValue(vport[3] - tileViewPort[1], 0.0, 1.0);
    // also watch for the upper right boundary of the tile
    if (vpu2 > tileViewPort[2] - tileViewPort[0]) {
      vpu2 = tileViewPort[2] - tileViewPort[0];
    }
    if (vpv2 > tileViewPort[3] - tileViewPort[1]) {
      vpv2 = tileViewPort[3] - tileViewPort[1];
    }
    var ndvp2 = model.parent.normalizedDisplayToDisplay(vpu2, vpv2);

    // now compute the size of the intersection of the viewport with the
    // current tile
    var usize = Math.round(ndvp2[0]) - lowerLeftU;
    var vsize = Math.round(ndvp2[1]) - lowerLeftV;

    if (usize < 0) {
      usize = 0;
    }
    if (vsize < 0) {
      vsize = 0;
    }

    return { usize: usize, vsize: vsize, lowerLeftU: lowerLeftU, lowerLeftV: lowerLeftV };
  };

  publicAPI.clear = function () {
    var clearMask = 0;
    var gl = model.context;

    if (!model.renderable.getTransparent()) {
      var _model$context;

      var background = model.renderable.getBackground();
      // renderable ensures that background has 4 entries.
      (_model$context = model.context).clearColor.apply(_model$context, _toConsumableArray(background));
      clearMask |= gl.COLOR_BUFFER_BIT;
    }

    if (!model.renderable.getPreserveDepthBuffer()) {
      gl.clearDepth(1.0);
      clearMask |= gl.DEPTH_BUFFER_BIT;
      gl.depthMask(true);
    }

    gl.colorMask(true, true, true, true);

    var ts = publicAPI.getTiledSizeAndOrigin();
    gl.enable(gl.SCISSOR_TEST);
    gl.scissor(ts.lowerLeftU, ts.lowerLeftV, ts.usize, ts.vsize);

    gl.clear(clearMask);

    gl.enable(gl.DEPTH_TEST);
    /* eslint-enable no-bitwise */
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  context: null,
  selector: null
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  _ViewNode2.default.extend(publicAPI, model, initialValues);

  // Build VTK API
  _macro2.default.get(publicAPI, model, ['shaderCache']);

  _macro2.default.setGet(publicAPI, model, ['context', 'selector']);

  // Object methods
  vtkOpenGLRenderer(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkOpenGLRenderer');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _glMatrix = __webpack_require__(2);

var _Constants = __webpack_require__(14);

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _BufferObject = __webpack_require__(19);

var _BufferObject2 = _interopRequireDefault(_BufferObject);

var _Math = __webpack_require__(1);

var _Math2 = _interopRequireDefault(_Math);

var _ShaderProgram = __webpack_require__(8);

var _ShaderProgram2 = _interopRequireDefault(_ShaderProgram);

var _PolyDataMapper = __webpack_require__(20);

var _PolyDataMapper2 = _interopRequireDefault(_PolyDataMapper);

var _vtkSphereMapperVS = __webpack_require__(73);

var _vtkSphereMapperVS2 = _interopRequireDefault(_vtkSphereMapperVS);

var _vtkPolyDataFS = __webpack_require__(16);

var _vtkPolyDataFS2 = _interopRequireDefault(_vtkPolyDataFS);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vtkErrorMacro = _macro2.default.vtkErrorMacro;

// ----------------------------------------------------------------------------
// vtkOpenGLSphereMapper methods
// ----------------------------------------------------------------------------

function vtkOpenGLSphereMapper(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkOpenGLSphereMapper');

  // Capture 'parentClass' api for internal use
  var superClass = Object.assign({}, publicAPI);

  publicAPI.getShaderTemplate = function (shaders, ren, actor) {
    shaders.Vertex = _vtkSphereMapperVS2.default;
    shaders.Fragment = _vtkPolyDataFS2.default;
    shaders.Geometry = '';
  };

  publicAPI.replaceShaderValues = function (shaders, ren, actor) {
    var VSSource = shaders.Vertex;
    var FSSource = shaders.Fragment;

    VSSource = _ShaderProgram2.default.substitute(VSSource, '//VTK::Camera::Dec', ['uniform mat4 VCDCMatrix;\n', 'uniform mat4 MCVCMatrix;']).result;

    FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::PositionVC::Dec', ['varying vec4 vertexVCVSOutput;']).result;

    // we create vertexVC below, so turn off the default
    // implementation
    FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::PositionVC::Impl', ['vec4 vertexVC = vertexVCVSOutput;\n']).result;

    // for lights kit and positional the VCDC matrix is already defined
    // so don't redefine it
    var replacement = ['uniform float invertedDepth;\n', 'uniform int cameraParallel;\n', 'varying float radiusVCVSOutput;\n', 'varying vec3 centerVCVSOutput;\n', 'uniform mat4 VCDCMatrix;\n'];
    FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Normal::Dec', replacement).result;

    var fragString = '';
    if (model.context.getExtension('EXT_frag_depth')) {
      fragString = 'gl_FragDepthEXT = (pos.z / pos.w + 1.0) / 2.0;\n';
    }
    FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Depth::Impl', [
    // compute the eye position and unit direction
    '  vec3 EyePos;\n', '  vec3 EyeDir;\n', '  if (cameraParallel != 0) {\n', '    EyePos = vec3(vertexVC.x, vertexVC.y, vertexVC.z + 3.0*radiusVCVSOutput);\n', '    EyeDir = vec3(0.0,0.0,-1.0); }\n', '  else {\n', '    EyeDir = vertexVC.xyz;\n', '    EyePos = vec3(0.0,0.0,0.0);\n', '    float lengthED = length(EyeDir);\n', '    EyeDir = normalize(EyeDir);\n',
    // we adjust the EyePos to be closer if it is too far away
    // to prevent floating point precision noise
    '    if (lengthED > radiusVCVSOutput*3.0) {\n', '      EyePos = vertexVC.xyz - EyeDir*3.0*radiusVCVSOutput; }\n', '    }\n',

    // translate to Sphere center
    '  EyePos = EyePos - centerVCVSOutput;\n',
    // scale to radius 1.0
    '  EyePos = EyePos/radiusVCVSOutput;\n',
    // find the intersection
    '  float b = 2.0*dot(EyePos,EyeDir);\n', '  float c = dot(EyePos,EyePos) - 1.0;\n', '  float d = b*b - 4.0*c;\n', '  vec3 normalVCVSOutput = vec3(0.0,0.0,1.0);\n', '  if (d < 0.0) { discard; }\n', '  else {\n', '    float t = (-b - invertedDepth*sqrt(d))*0.5;\n',

    // compute the normal, for unit sphere this is just
    // the intersection point
    '    normalVCVSOutput = invertedDepth*normalize(EyePos + t*EyeDir);\n',
    // compute the intersection point in VC
    '    vertexVC.xyz = normalVCVSOutput*radiusVCVSOutput + centerVCVSOutput;\n', '    }\n',
    // compute the pixel's depth
    // ' normalVCVSOutput = vec3(0,0,1);\n'
    '  vec4 pos = VCDCMatrix * vertexVC;\n', fragString]).result;

    // Strip out the normal line -- the normal is computed as part of the depth
    FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Normal::Impl', '').result;

    if (model.renderDepth) {
      FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::ZBuffer::Impl', ['float computedZ = (pos.z / pos.w + 1.0) / 2.0;', 'float iz = floor(computedZ * 65535.0 + 0.1);', 'float rf = floor(iz/256.0)/255.0;', 'float gf = mod(iz,256.0)/255.0;', 'gl_FragData[0] = vec4(rf, gf, 0.0, 1.0);']).result;
      shaders.Fragment = FSSource;
    }

    shaders.Vertex = VSSource;
    shaders.Fragment = FSSource;

    superClass.replaceShaderValues(shaders, ren, actor);
  };

  publicAPI.setMapperShaderParameters = function (cellBO, ren, actor) {
    if (cellBO.getCABO().getElementCount() && (model.VBOBuildTime > cellBO.getAttributeUpdateTime().getMTime() || cellBO.getShaderSourceTime().getMTime() > cellBO.getAttributeUpdateTime().getMTime()) && cellBO.getProgram().isAttributeUsed('offsetMC')) {
      cellBO.getCABO().bind();
      if (!cellBO.getVAO().addAttributeArray(cellBO.getProgram(), cellBO.getCABO(), 'offsetMC', 12, // 12:this->VBO->ColorOffset+sizeof(float)
      cellBO.getCABO().getStride(), model.context.FLOAT, 2, false)) {
        vtkErrorMacro('Error setting \'offsetMC\' in shader VAO.');
      }
    }

    if (cellBO.getProgram().isUniformUsed('invertedDepth')) {
      cellBO.getProgram().setUniformf('invertedDepth', model.invert ? -1.0 : 1.0);
    }

    superClass.setMapperShaderParameters(cellBO, ren, actor);
  };

  publicAPI.setCameraShaderParameters = function (cellBO, ren, actor) {
    var program = cellBO.getProgram();

    var cam = ren.getActiveCamera();
    var keyMats = model.openGLCamera.getKeyMatrices(ren);

    if (program.isUniformUsed('VCDCMatrix')) {
      program.setUniformMatrix('VCDCMatrix', keyMats.vcdc);
    }

    if (program.isUniformUsed('MCVCMatrix')) {
      if (!actor.getIsIdentity()) {
        var actMats = model.openGLActor.getKeyMatrices();
        var tmp4 = _glMatrix.mat4.create();
        _glMatrix.mat4.multiply(tmp4, keyMats.wcvc, actMats.mcwc);
        program.setUniformMatrix('MCVCMatrix', tmp4);
      } else {
        program.setUniformMatrix('MCVCMatrix', keyMats.wcvc);
      }
    }

    if (program.isUniformUsed('cameraParallel')) {
      cellBO.getProgram().setUniformi('cameraParallel', cam.getParallelProjection());
    }
  };

  publicAPI.getOpenGLMode = function (rep, type) {
    return model.context.TRIANGLES;
  };

  publicAPI.buildBufferObjects = function (ren, actor) {
    var poly = model.currentInput;

    if (poly === null) {
      return;
    }

    model.renderable.mapScalars(poly, 1.0);
    var c = model.renderable.getColorMapColors();

    var vbo = model.primitives[model.primTypes.Tris].getCABO();

    var pointData = poly.getPointData();
    var points = poly.getPoints();
    var numPoints = points.getNumberOfPoints();
    var pointArray = points.getData();

    var pointSize = 5; // x,y,z,orientation1,orientation2
    var scales = null;

    if (model.renderable.getScaleArray() != null && pointData.hasArray(model.renderable.getScaleArray())) {
      scales = pointData.getArray(model.renderable.getScaleArray()).getData();
    }

    var colorData = null;
    var colorComponents = 0;
    var packedUCVBO = null;
    if (c) {
      colorComponents = c.getNumberOfComponents();
      vbo.setColorOffset(0);
      vbo.setColorBOStride(4);
      colorData = c.getData();
      packedUCVBO = new Uint8Array(3 * numPoints * 4);
      if (!vbo.getColorBO()) {
        vbo.setColorBO(_BufferObject2.default.newInstance());
      }
      vbo.getColorBO().setContext(model.context);
    } else if (vbo.getColorBO()) {
      vbo.setColorBO(null);
    }
    vbo.setColorComponents(colorComponents);

    var packedVBO = new Float32Array(pointSize * numPoints * 3);

    vbo.setStride(pointSize * 4);

    var cos30 = Math.cos(_Math2.default.radiansFromDegrees(30.0));
    var pointIdx = 0;
    var colorIdx = 0;

    //
    // Generate points and point data for sides
    //
    var vboIdx = 0;
    var ucIdx = 0;
    for (var i = 0; i < numPoints; ++i) {
      var radius = model.renderable.getRadius();
      if (scales) {
        radius = scales[i];
      }

      pointIdx = i * 3;
      packedVBO[vboIdx++] = pointArray[pointIdx++];
      packedVBO[vboIdx++] = pointArray[pointIdx++];
      packedVBO[vboIdx++] = pointArray[pointIdx++];
      packedVBO[vboIdx++] = -2.0 * radius * cos30;
      packedVBO[vboIdx++] = -radius;
      if (colorData) {
        colorIdx = i * colorComponents;
        packedUCVBO[ucIdx++] = colorData[colorIdx];
        packedUCVBO[ucIdx++] = colorData[colorIdx + 1];
        packedUCVBO[ucIdx++] = colorData[colorIdx + 2];
        packedUCVBO[ucIdx++] = colorData[colorIdx + 3];
      }

      pointIdx = i * 3;
      packedVBO[vboIdx++] = pointArray[pointIdx++];
      packedVBO[vboIdx++] = pointArray[pointIdx++];
      packedVBO[vboIdx++] = pointArray[pointIdx++];
      packedVBO[vboIdx++] = 2.0 * radius * cos30;
      packedVBO[vboIdx++] = -radius;
      if (colorData) {
        packedUCVBO[ucIdx++] = colorData[colorIdx];
        packedUCVBO[ucIdx++] = colorData[colorIdx + 1];
        packedUCVBO[ucIdx++] = colorData[colorIdx + 2];
        packedUCVBO[ucIdx++] = colorData[colorIdx + 3];
      }

      pointIdx = i * 3;
      packedVBO[vboIdx++] = pointArray[pointIdx++];
      packedVBO[vboIdx++] = pointArray[pointIdx++];
      packedVBO[vboIdx++] = pointArray[pointIdx++];
      packedVBO[vboIdx++] = 0.0;
      packedVBO[vboIdx++] = 2.0 * radius;
      if (colorData) {
        packedUCVBO[ucIdx++] = colorData[colorIdx];
        packedUCVBO[ucIdx++] = colorData[colorIdx + 1];
        packedUCVBO[ucIdx++] = colorData[colorIdx + 2];
        packedUCVBO[ucIdx++] = colorData[colorIdx + 3];
      }
    }

    vbo.setElementCount(vboIdx / pointSize);
    vbo.upload(packedVBO, _Constants.ObjectType.ARRAY_BUFFER);
    if (c) {
      vbo.getColorBO().upload(packedUCVBO, _Constants.ObjectType.ARRAY_BUFFER);
    }

    model.VBOBuildTime.modified();
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  _PolyDataMapper2.default.extend(publicAPI, model, initialValues);

  // Object methods
  vtkOpenGLSphereMapper(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkOpenGLSphereMapper');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 73 */
/***/ (function(module, exports) {

module.exports = "//VTK::System::Dec\n\n/*=========================================================================\n\n  Program:   Visualization Toolkit\n  Module:    vtkSphereMapperVS.glsl\n\n  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen\n  All rights reserved.\n  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.\n\n     This software is distributed WITHOUT ANY WARRANTY; without even\n     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR\n     PURPOSE.  See the above copyright notice for more information.\n\n=========================================================================*/\n// this shader implements imposters in OpenGL for Spheres\n\nattribute vec4 vertexMC;\nattribute vec2 offsetMC;\n\n// optional normal declaration\n//VTK::Normal::Dec\n\n// Texture coordinates\n//VTK::TCoord::Dec\n\nuniform mat3 normalMatrix; // transform model coordinate directions to view coordinates\n\n// material property values\n//VTK::Color::Dec\n\n// clipping plane vars\n//VTK::Clip::Dec\n\n// camera and actor matrix values\n//VTK::Camera::Dec\n\nvarying vec4 vertexVCVSOutput;\nvarying float radiusVCVSOutput;\nvarying vec3 centerVCVSOutput;\n\nuniform int cameraParallel;\n\nvoid main()\n{\n  //VTK::Color::Impl\n\n  //VTK::Normal::Impl\n\n  //VTK::TCoord::Impl\n\n  //VTK::Clip::Impl\n\n  // compute the projected vertex position\n  vertexVCVSOutput = MCVCMatrix * vertexMC;\n  centerVCVSOutput = vertexVCVSOutput.xyz;\n  radiusVCVSOutput = length(offsetMC)*0.5;\n\n  // make the triangle face the camera\n  if (cameraParallel == 0)\n    {\n    vec3 dir = normalize(-vertexVCVSOutput.xyz);\n    vec3 base2 = normalize(cross(dir,vec3(1.0,0.0,0.0)));\n    vec3 base1 = cross(base2,dir);\n    vertexVCVSOutput.xyz = vertexVCVSOutput.xyz + offsetMC.x*base1 + offsetMC.y*base2;\n    }\n  else\n    {\n    // add in the offset\n    vertexVCVSOutput.xy = vertexVCVSOutput.xy + offsetMC;\n    }\n\n  gl_Position = VCDCMatrix * vertexVCVSOutput;\n}\n"

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _glMatrix = __webpack_require__(2);

var _Constants = __webpack_require__(14);

var _macro = __webpack_require__(0);

var macro = _interopRequireWildcard(_macro);

var _BufferObject = __webpack_require__(19);

var _BufferObject2 = _interopRequireDefault(_BufferObject);

var _vtkStickMapperVS = __webpack_require__(75);

var _vtkStickMapperVS2 = _interopRequireDefault(_vtkStickMapperVS);

var _vtkPolyDataFS = __webpack_require__(16);

var _vtkPolyDataFS2 = _interopRequireDefault(_vtkPolyDataFS);

var _ShaderProgram = __webpack_require__(8);

var _ShaderProgram2 = _interopRequireDefault(_ShaderProgram);

var _PolyDataMapper = __webpack_require__(20);

var _PolyDataMapper2 = _interopRequireDefault(_PolyDataMapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var vtkErrorMacro = macro.vtkErrorMacro;

// ----------------------------------------------------------------------------
// vtkOpenGLStickMapper methods
// ----------------------------------------------------------------------------

function vtkOpenGLStickMapper(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkOpenGLStickMapper');

  // Capture 'parentClass' api for internal use
  var superClass = Object.assign({}, publicAPI);

  publicAPI.getShaderTemplate = function (shaders, ren, actor) {
    shaders.Vertex = _vtkStickMapperVS2.default;
    shaders.Fragment = _vtkPolyDataFS2.default;
    shaders.Geometry = '';
  };

  publicAPI.replaceShaderValues = function (shaders, ren, actor) {
    var VSSource = shaders.Vertex;
    var FSSource = shaders.Fragment;

    VSSource = _ShaderProgram2.default.substitute(VSSource, '//VTK::Camera::Dec', ['uniform mat4 VCDCMatrix;\n', 'uniform mat4 MCVCMatrix;']).result;

    FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::PositionVC::Dec', 'varying vec4 vertexVCVSOutput;').result;

    // we create vertexVC below, so turn off the default
    // implementation
    FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::PositionVC::Impl', '  vec4 vertexVC = vertexVCVSOutput;\n').result;

    // for lights kit and positional the VCDC matrix is already defined
    // so don't redefine it
    var replacement = ['uniform int cameraParallel;\n', 'varying float radiusVCVSOutput;\n', 'varying vec3 orientVCVSOutput;\n', 'varying float lengthVCVSOutput;\n', 'varying vec3 centerVCVSOutput;\n', 'uniform mat4 VCDCMatrix;\n'];
    FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Normal::Dec', replacement).result;

    var fragString = '';
    if (model.context.getExtension('EXT_frag_depth')) {
      fragString = '  gl_FragDepthEXT = (pos.z / pos.w + 1.0) / 2.0;\n';
    }
    // see https://www.cl.cam.ac.uk/teaching/1999/AGraphHCI/SMAG/node2.html
    FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Depth::Impl', [
    // compute the eye position and unit direction
    '  vec3 EyePos;\n', '  vec3 EyeDir;\n', '  if (cameraParallel != 0) {\n', '    EyePos = vec3(vertexVC.x, vertexVC.y, vertexVC.z + 3.0*radiusVCVSOutput);\n', '    EyeDir = vec3(0.0,0.0,-1.0); }\n', '  else {\n', '    EyeDir = vertexVC.xyz;\n', '    EyePos = vec3(0.0,0.0,0.0);\n', '    float lengthED = length(EyeDir);\n', '    EyeDir = normalize(EyeDir);\n',
    // we adjust the EyePos to be closer if it is too far away
    // to prevent floating point precision noise
    '    if (lengthED > radiusVCVSOutput*3.0) {\n', '      EyePos = vertexVC.xyz - EyeDir*3.0*radiusVCVSOutput; }\n', '    }\n',

    // translate to Stick center
    '  EyePos = EyePos - centerVCVSOutput;\n',

    // rotate to new basis
    // base1, base2, orientVC
    '  vec3 base1;\n', '  if (abs(orientVCVSOutput.z) < 0.99) {\n', '    base1 = normalize(cross(orientVCVSOutput,vec3(0.0,0.0,1.0))); }\n', '  else {\n', '    base1 = normalize(cross(orientVCVSOutput,vec3(0.0,1.0,0.0))); }\n', '  vec3 base2 = cross(orientVCVSOutput,base1);\n', '  EyePos = vec3(dot(EyePos,base1),dot(EyePos,base2),dot(EyePos,orientVCVSOutput));\n', '  EyeDir = vec3(dot(EyeDir,base1),dot(EyeDir,base2),dot(EyeDir,orientVCVSOutput));\n',

    // scale by radius
    '  EyePos = EyePos/radiusVCVSOutput;\n',

    // find the intersection
    '  float a = EyeDir.x*EyeDir.x + EyeDir.y*EyeDir.y;\n', '  float b = 2.0*(EyePos.x*EyeDir.x + EyePos.y*EyeDir.y);\n', '  float c = EyePos.x*EyePos.x + EyePos.y*EyePos.y - 1.0;\n', '  float d = b*b - 4.0*a*c;\n', '  vec3 normalVCVSOutput = vec3(0.0,0.0,1.0);\n', '  if (d < 0.0) { discard; }\n', '  else {\n', '    float t =  (-b - sqrt(d))/(2.0*a);\n', '    float tz = EyePos.z + t*EyeDir.z;\n', '    vec3 iPoint = EyePos + t*EyeDir;\n', '    if (abs(iPoint.z)*radiusVCVSOutput > lengthVCVSOutput*0.5) {\n',
    // test for end cap
    '      float t2 = (-b + sqrt(d))/(2.0*a);\n', '      float tz2 = EyePos.z + t2*EyeDir.z;\n', '      if (tz2*radiusVCVSOutput > lengthVCVSOutput*0.5 || tz*radiusVCVSOutput < -0.5*lengthVCVSOutput) { discard; }\n', '      else {\n', '        normalVCVSOutput = orientVCVSOutput;\n', '        float t3 = (lengthVCVSOutput*0.5/radiusVCVSOutput - EyePos.z)/EyeDir.z;\n', '        iPoint = EyePos + t3*EyeDir;\n', '        vertexVC.xyz = radiusVCVSOutput*(iPoint.x*base1 + iPoint.y*base2 + iPoint.z*orientVCVSOutput) + centerVCVSOutput;\n', '        }\n', '      }\n', '    else {\n',
    // The normal is the iPoint.xy rotated back into VC
    '      normalVCVSOutput = iPoint.x*base1 + iPoint.y*base2;\n',
    // rescale rerotate and translate
    '      vertexVC.xyz = radiusVCVSOutput*(normalVCVSOutput + iPoint.z*orientVCVSOutput) + centerVCVSOutput;\n', '      }\n', '    }\n',

    //    '  vec3 normalVC = vec3(0.0,0.0,1.0);\n'
    // compute the pixel's depth
    '  vec4 pos = VCDCMatrix * vertexVC;\n', fragString]).result;

    // Strip out the normal line -- the normal is computed as part of the depth
    FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Normal::Impl', '').result;

    var selector = ren.getSelector();
    var picking = false; // (ren.getRenderWindow().getIsPicking() || selector != null);
    fragString = '';
    if (picking) {
      if (!selector /* ||
                    (this->LastSelectionState >= vtkHardwareSelector::ID_LOW24) */) {
          VSSource = _ShaderProgram2.default.substitute(VSSource, '//VTK::Picking::Dec', ['attribute vec4 selectionId;\n', 'varying vec4 selectionIdVSOutput;']).result;
          VSSource = _ShaderProgram2.default.substitute(VSSource, '//VTK::Picking::Impl', 'selectionIdVSOutput = selectionId;').result;
          FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Picking::Dec', 'varying vec4 selectionIdVSOutput;').result;

          if (model.context.getExtension('EXT_frag_depth')) {
            fragString = '    gl_FragData[0] = vec4(selectionIdVSOutput.rgb, 1.0);\n';
          }
          FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Picking::Impl', fragString).result;
        } else {
        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Picking::Dec', 'uniform vec3 mapperIndex;').result;

        if (model.context.getExtension('EXT_frag_depth')) {
          fragString = '  gl_FragData[0] = vec4(mapperIndex,1.0);\n';
        }
        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Picking::Impl', fragString).result;
      }
    }

    if (model.renderDepth) {
      FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::ZBuffer::Impl', ['float computedZ = (pos.z / pos.w + 1.0) / 2.0;', 'float iz = floor(computedZ * 65535.0 + 0.1);', 'float rf = floor(iz/256.0)/255.0;', 'float gf = mod(iz,256.0)/255.0;', 'gl_FragData[0] = vec4(rf, gf, 0.0, 1.0);']).result;
      shaders.Fragment = FSSource;
    }

    shaders.Vertex = VSSource;
    shaders.Fragment = FSSource;

    superClass.replaceShaderValues(shaders, ren, actor);
  };

  publicAPI.setMapperShaderParameters = function (cellBO, ren, actor) {
    if (cellBO.getCABO().getElementCount() && (model.VBOBuildTime > cellBO.getAttributeUpdateTime().getMTime() || cellBO.getShaderSourceTime().getMTime() > cellBO.getAttributeUpdateTime().getMTime())) {
      var selector = ren.getSelector();
      var picking = false; // (ren.getRenderWindow().getIsPicking() || selector !== null);

      cellBO.getCABO().bind();
      if (cellBO.getProgram().isAttributeUsed('orientMC')) {
        if (!cellBO.getVAO().addAttributeArray(cellBO.getProgram(), cellBO.getCABO(), 'orientMC', 12, // after X Y Z
        cellBO.getCABO().getStride(), model.context.FLOAT, 3, false)) {
          vtkErrorMacro('Error setting \'orientMC\' in shader VAO.');
        }
      }
      if (cellBO.getProgram().isAttributeUsed('offsetMC')) {
        if (!cellBO.getVAO().addAttributeArray(cellBO.getProgram(), cellBO.getCABO().getColorBO(), 'offsetMC', 0, cellBO.getCABO().getColorBOStride(), model.context.UNSIGNED_BYTE, 3, true)) {
          vtkErrorMacro('Error setting \'offsetMC\' in shader VAO.');
        }
      }
      if (cellBO.getProgram().isAttributeUsed('radiusMC')) {
        if (!cellBO.getVAO().addAttributeArray(cellBO.getProgram(), cellBO.getCABO(), 'radiusMC', 24, // X Y Z OX OY OZ
        cellBO.getCABO().getStride(), model.context.FLOAT, 1, false)) {
          vtkErrorMacro('Error setting \'radiusMC\' in shader VAO.');
        }
      }
      if (picking && !selector /* ||
                               (model.LastSelectionState >= vtkHardwareSelector::ID_LOW24) */ && cellBO.getProgram().isAttributeUsed('selectionId')) {
        if (!cellBO.getVAO().addAttributeArray(cellBO.getProgram(), cellBO.getCABO(), 'selectionId', cellBO.getCABO().getColorOffset(), cellBO.getCABO().getColorBOStride(), model.context.UNSIGNED_CHAR, 4, true)) {
          vtkErrorMacro('Error setting \'selectionId\' in shader VAO.');
        }
      } else {
        cellBO.getVAO().removeAttributeArray('selectionId');
      }
    }

    superClass.setMapperShaderParameters(cellBO, ren, actor);
  };

  publicAPI.setCameraShaderParameters = function (cellBO, ren, actor) {
    var program = cellBO.getProgram();

    var cam = ren.getActiveCamera();
    var keyMats = model.openGLCamera.getKeyMatrices(ren);

    if (program.isUniformUsed('VCDCMatrix')) {
      program.setUniformMatrix('VCDCMatrix', keyMats.vcdc);
    }

    if (!actor.getIsIdentity()) {
      var actMats = model.openGLActor.getKeyMatrices();
      var tmp4 = _glMatrix.mat4.create();

      if (program.isUniformUsed('MCVCMatrix')) {
        _glMatrix.mat4.multiply(tmp4, keyMats.wcvc, actMats.mcwc);
        program.setUniformMatrix('MCVCMatrix', tmp4);
      }
      if (program.isUniformUsed('normalMatrix')) {
        var anorms = _glMatrix.mat3.create();
        _glMatrix.mat3.multiply(anorms, keyMats.normalMatrix, actMats.normalMatrix);
        program.setUniformMatrix3x3('normalMatrix', anorms);
      }
    } else {
      if (program.isUniformUsed('MCVCMatrix')) {
        program.setUniformMatrix('MCVCMatrix', keyMats.wcvc);
      }
      if (program.isUniformUsed('normalMatrix')) {
        program.setUniformMatrix3x3('normalMatrix', keyMats.normalMatrix);
      }
    }

    if (program.isUniformUsed('cameraParallel')) {
      cellBO.getProgram().setUniformi('cameraParallel', cam.getParallelProjection());
    }
  };

  publicAPI.getOpenGLMode = function (rep, type) {
    return model.context.TRIANGLES;
  };

  publicAPI.buildBufferObjects = function (ren, actor) {
    var poly = model.currentInput;

    if (poly === null) {
      return;
    }

    model.renderable.mapScalars(poly, 1.0);
    var c = model.renderable.getColorMapColors();

    var vbo = model.primitives[model.primTypes.Tris].getCABO();

    var pointData = poly.getPointData();
    var points = poly.getPoints();
    var numPoints = points.getNumberOfPoints();
    var pointArray = points.getData();
    var pointSize = 3; // x,y,z

    // three more floats for orientation + 1 for radius
    pointSize += 4;

    var colorData = null;
    var colorComponents = 0;
    vbo.setColorBOStride(4);

    if (!vbo.getColorBO()) {
      vbo.setColorBO(_BufferObject2.default.newInstance());
    }
    vbo.getColorBO().setContext(model.context);
    if (c) {
      colorComponents = c.getNumberOfComponents();
      vbo.setColorOffset(4);
      colorData = c.getData();
      vbo.setColorBOStride(8);
    }
    vbo.setColorComponents(colorComponents);

    vbo.setStride(pointSize * 4);

    // Create a buffer, and copy the data over.
    var packedVBO = new Float32Array(pointSize * numPoints * 12);
    var packedUCVBO = new Uint8Array(12 * numPoints * (colorData ? 8 : 4));

    var scales = null;
    var orientationArray = null;
    //
    // Generate points and point data for sides
    //
    if (model.renderable.getScaleArray() != null && pointData.hasArray(model.renderable.getScaleArray())) {
      scales = pointData.getArray(model.renderable.getScaleArray()).getData();
    }

    if (model.renderable.getOrientationArray() != null && pointData.hasArray(model.renderable.getOrientationArray())) {
      orientationArray = pointData.getArray(model.renderable.getOrientationArray()).getData();
    } else {
      vtkErrorMacro(['Error setting orientationArray.\n', 'You have to specify the stick orientation']);
    }

    // Vertices
    // 013 - 032 - 324 - 453
    //
    //       _.4---_.5
    //    .-*   .-*
    //   2-----3
    //   |    /|
    //   |   / |
    //   |  /  |
    //   | /   |
    //   |/    |
    //   0-----1
    //
    // coord for each points
    // 0: 000
    // 1: 100
    // 2: 001
    // 3: 101
    // 4: 011
    // 5: 111

    var verticesArray = [0, 1, 3, 0, 3, 2, 2, 3, 5, 2, 5, 4];

    var pointIdx = 0;
    var colorIdx = 0;
    var vboIdx = 0;
    var ucIdx = 0;

    for (var i = 0; i < numPoints; ++i) {
      var length = model.renderable.getLength();
      var radius = model.renderable.getRadius();
      if (scales) {
        length = scales[i * 2];
        radius = scales[i * 2 + 1];
      }

      for (var j = 0; j < verticesArray.length; ++j) {
        pointIdx = i * 3;
        packedVBO[vboIdx++] = pointArray[pointIdx++];
        packedVBO[vboIdx++] = pointArray[pointIdx++];
        packedVBO[vboIdx++] = pointArray[pointIdx++];
        pointIdx = i * 3;
        packedVBO[vboIdx++] = orientationArray[pointIdx++] * length;
        packedVBO[vboIdx++] = orientationArray[pointIdx++] * length;
        packedVBO[vboIdx++] = orientationArray[pointIdx++] * length;
        packedVBO[vboIdx++] = radius;

        packedUCVBO[ucIdx++] = 255 * (verticesArray[j] % 2);
        packedUCVBO[ucIdx++] = verticesArray[j] >= 4 ? 255 : 0;
        packedUCVBO[ucIdx++] = verticesArray[j] >= 2 ? 255 : 0;
        packedUCVBO[ucIdx++] = 255;

        colorIdx = i * colorComponents;
        if (colorData) {
          packedUCVBO[ucIdx++] = colorData[colorIdx];
          packedUCVBO[ucIdx++] = colorData[colorIdx + 1];
          packedUCVBO[ucIdx++] = colorData[colorIdx + 2];
          packedUCVBO[ucIdx++] = colorData[colorIdx + 3];
        }
      }
    }
    vbo.setElementCount(vboIdx / pointSize);
    vbo.upload(packedVBO, _Constants.ObjectType.ARRAY_BUFFER);
    vbo.getColorBO().upload(packedUCVBO, _Constants.ObjectType.ARRAY_BUFFER);
    model.VBOBuildTime.modified();
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  _PolyDataMapper2.default.extend(publicAPI, model, initialValues);

  // Object methods
  vtkOpenGLStickMapper(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = macro.newInstance(extend, 'vtkOpenGLStickMapper');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 75 */
/***/ (function(module, exports) {

module.exports = "//VTK::System::Dec\n\n/*=========================================================================\n\n  Program:   Visualization Toolkit\n  Module:    vtkStickMapperVS.glsl\n\n  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen\n  All rights reserved.\n  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.\n\n     This software is distributed WITHOUT ANY WARRANTY; without even\n     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR\n     PURPOSE.  See the above copyright notice for more information.\n\n=========================================================================*/\n// this shader implements imposters in OpenGL for Sticks\n\nattribute vec4 vertexMC;\nattribute vec3 orientMC;\nattribute vec4 offsetMC;\nattribute float radiusMC;\n\n// optional normal declaration\n//VTK::Normal::Dec\n\n//VTK::Picking::Dec\n\n// Texture coordinates\n//VTK::TCoord::Dec\n\nuniform mat3 normalMatrix; // transform model coordinate directions to view coordinates\n\n// material property values\n//VTK::Color::Dec\n\n// clipping plane vars\n//VTK::Clip::Dec\n\n// camera and actor matrix values\n//VTK::Camera::Dec\n\nvarying vec4 vertexVCVSOutput;\nvarying float radiusVCVSOutput;\nvarying float lengthVCVSOutput;\nvarying vec3 centerVCVSOutput;\nvarying vec3 orientVCVSOutput;\n\nuniform int cameraParallel;\n\nvoid main()\n{\n  //VTK::Picking::Impl\n\n  //VTK::Color::Impl\n\n  //VTK::Normal::Impl\n\n  //VTK::TCoord::Impl\n\n  //VTK::Clip::Impl\n\n  vertexVCVSOutput = MCVCMatrix * vertexMC;\n  centerVCVSOutput = vertexVCVSOutput.xyz;\n  radiusVCVSOutput = radiusMC;\n  lengthVCVSOutput = length(orientMC);\n  orientVCVSOutput = normalMatrix * normalize(orientMC);\n\n  // make sure it is pointing out of the screen\n  if (orientVCVSOutput.z < 0.0)\n    {\n    orientVCVSOutput = -orientVCVSOutput;\n    }\n\n  // make the basis\n  vec3 xbase;\n  vec3 ybase;\n  vec3 dir = vec3(0.0,0.0,1.0);\n  if (cameraParallel == 0)\n    {\n    dir = normalize(-vertexVCVSOutput.xyz);\n    }\n  if (abs(dot(dir,orientVCVSOutput)) == 1.0)\n    {\n    xbase = normalize(cross(vec3(0.0,1.0,0.0),orientVCVSOutput));\n    ybase = cross(xbase,orientVCVSOutput);\n    }\n  else\n    {\n    xbase = normalize(cross(orientVCVSOutput,dir));\n    ybase = cross(orientVCVSOutput,xbase);\n    }\n\n  vec3 offsets = offsetMC.xyz*2.0-1.0;\n  vertexVCVSOutput.xyz = vertexVCVSOutput.xyz +\n    radiusVCVSOutput*offsets.x*xbase +\n    radiusVCVSOutput*offsets.y*ybase +\n    0.5*lengthVCVSOutput*offsets.z*orientVCVSOutput;\n\n  gl_Position = VCDCMatrix * vertexVCVSOutput;\n}\n"

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _glMatrix = __webpack_require__(2);

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _ViewNode = __webpack_require__(3);

var _ViewNode2 = _interopRequireDefault(_ViewNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------------------------------------------------------------
// vtkOpenGLVolume methods
// ----------------------------------------------------------------------------

function vtkOpenGLVolume(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkOpenGLVolume');

  // Builds myself.
  publicAPI.buildPass = function (prepass) {
    if (!model.renderable || !model.renderable.getVisibility()) {
      return;
    }
    if (prepass) {
      publicAPI.prepareNodes();
      publicAPI.addMissingNode(model.renderable.getMapper());
      publicAPI.removeUnusedNodes();
    }
  };

  publicAPI.queryPass = function (prepass, renderPass) {
    if (prepass) {
      if (!model.renderable || !model.renderable.getVisibility()) {
        return;
      }
      renderPass.incrementVolumeCount();
    }
  };

  // Renders myself
  publicAPI.volumePass = function (prepass) {
    if (!model.renderable || !model.renderable.getVisibility()) {
      return;
    }
    if (prepass) {
      model.context = publicAPI.getFirstAncestorOfType('vtkOpenGLRenderWindow').getContext();
      model.context.depthMask(false);
    } else {
      model.context.depthMask(true);
    }
  };

  publicAPI.getKeyMatrices = function () {
    // has the actor changed?
    if (model.renderable.getMTime() > model.keyMatrixTime.getMTime()) {
      model.renderable.computeMatrix();
      _glMatrix.mat4.copy(model.MCWCMatrix, model.renderable.getMatrix());
      _glMatrix.mat4.transpose(model.MCWCMatrix, model.MCWCMatrix);

      if (model.renderable.getIsIdentity()) {
        _glMatrix.mat3.identity(model.normalMatrix);
      } else {
        _glMatrix.mat3.fromMat4(model.normalMatrix, model.MCWCMatrix);
        _glMatrix.mat3.invert(model.normalMatrix, model.normalMatrix);
      }
      model.keyMatrixTime.modified();
    }

    return { mcwc: model.MCWCMatrix, normalMatrix: model.normalMatrix };
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  // context: null,
  // keyMatrixTime: null,
  // normalMatrix: null,
  // MCWCMatrix: null,
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  _ViewNode2.default.extend(publicAPI, model, initialValues);

  model.keyMatrixTime = {};
  _macro2.default.obj(model.keyMatrixTime);
  model.normalMatrix = _glMatrix.mat3.create();
  model.MCWCMatrix = _glMatrix.mat4.create();

  // Build VTK API
  _macro2.default.setGet(publicAPI, model, ['context']);

  // Object methods
  vtkOpenGLVolume(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkOpenGLVolume');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _glMatrix = __webpack_require__(2);

var _DataArray = __webpack_require__(6);

var _DataArray2 = _interopRequireDefault(_DataArray);

var _Constants = __webpack_require__(5);

var _Helper = __webpack_require__(18);

var _Helper2 = _interopRequireDefault(_Helper);

var _Math = __webpack_require__(1);

var _Math2 = _interopRequireDefault(_Math);

var _Framebuffer = __webpack_require__(26);

var _Framebuffer2 = _interopRequireDefault(_Framebuffer);

var _Texture = __webpack_require__(12);

var _Texture2 = _interopRequireDefault(_Texture);

var _ShaderProgram = __webpack_require__(8);

var _ShaderProgram2 = _interopRequireDefault(_ShaderProgram);

var _VertexArrayObject = __webpack_require__(30);

var _VertexArrayObject2 = _interopRequireDefault(_VertexArrayObject);

var _ViewNode = __webpack_require__(3);

var _ViewNode2 = _interopRequireDefault(_ViewNode);

var _Constants2 = __webpack_require__(15);

var _Constants3 = __webpack_require__(13);

var _Constants4 = __webpack_require__(78);

var _vtkVolumeVS = __webpack_require__(79);

var _vtkVolumeVS2 = _interopRequireDefault(_vtkVolumeVS);

var _vtkVolumeFS = __webpack_require__(80);

var _vtkVolumeFS2 = _interopRequireDefault(_vtkVolumeFS);

var _vtkVolumeFS3 = __webpack_require__(81);

var _vtkVolumeFS4 = _interopRequireDefault(_vtkVolumeFS3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vtkWarningMacro = _macro2.default.vtkWarningMacro,
    vtkErrorMacro = _macro2.default.vtkErrorMacro;

// ----------------------------------------------------------------------------
// vtkOpenGLVolumeMapper methods
// ----------------------------------------------------------------------------

// import vtkBoundingBox       from 'vtk.js/Sources/Common/DataModel/BoundingBox';

function vtkOpenGLVolumeMapper(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkOpenGLVolumeMapper');

  publicAPI.buildPass = function () {
    model.zBufferTexture = null;
  };

  // ohh someone is doing a zbuffer pass, use that for
  // intermixed volume rendering
  publicAPI.opaqueZBufferPass = function (prepass, renderPass) {
    if (prepass) {
      var zbt = renderPass.getZBufferTexture();
      if (zbt !== model.zBufferTexture) {
        model.zBufferTexture = zbt;
      }
    }
  };

  // Renders myself
  publicAPI.volumePass = function (prepass, renderPass) {
    if (prepass) {
      model.openGLRenderWindow = publicAPI.getFirstAncestorOfType('vtkOpenGLRenderWindow');
      model.context = model.openGLRenderWindow.getContext();
      model.tris.setContext(model.context);
      model.scalarTexture.setWindow(model.openGLRenderWindow);
      model.scalarTexture.setContext(model.context);
      model.colorTexture.setWindow(model.openGLRenderWindow);
      model.colorTexture.setContext(model.context);
      model.opacityTexture.setWindow(model.openGLRenderWindow);
      model.opacityTexture.setContext(model.context);
      model.lightingTexture.setWindow(model.openGLRenderWindow);
      model.lightingTexture.setContext(model.context);
      model.framebuffer.setWindow(model.openGLRenderWindow);

      model.openGLVolume = publicAPI.getFirstAncestorOfType('vtkOpenGLVolume');
      var actor = model.openGLVolume.getRenderable();
      model.openGLRenderer = publicAPI.getFirstAncestorOfType('vtkOpenGLRenderer');
      var ren = model.openGLRenderer.getRenderable();
      model.openGLCamera = model.openGLRenderer.getViewNodeFor(ren.getActiveCamera());
      publicAPI.renderPiece(ren, actor);
    }
  };

  publicAPI.buildShaders = function (shaders, ren, actor) {
    publicAPI.getShaderTemplate(shaders, ren, actor);
    publicAPI.replaceShaderValues(shaders, ren, actor);
  };

  publicAPI.getShaderTemplate = function (shaders, ren, actor) {
    shaders.Vertex = _vtkVolumeVS2.default;
    if (model.openGLRenderWindow.getWebgl2()) {
      shaders.Fragment = _vtkVolumeFS4.default;
    } else {
      shaders.Fragment = _vtkVolumeFS2.default;
    }
    shaders.Geometry = '';
  };

  publicAPI.replaceShaderValues = function (shaders, ren, actor) {
    var FSSource = shaders.Fragment;

    var iType = actor.getProperty().getInterpolationType();
    var gopacity = actor.getProperty().getUseGradientOpacity(0);
    var volInfo = model.scalarTexture.getVolumeInfo();

    // WebGL2
    if (model.openGLRenderWindow.getWebgl2()) {
      // for lighting and gradient opacity we need the
      // normal texture
      if (gopacity || model.lastLightComplexity > 0) {
        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Normal::Dec', ['uniform highp sampler3D normalTexture;']).result;
        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Normal::Impl', ['vec4 normal = texture(normalTexture, ijk);']).result;
      }
    } else {
      // WebGL1
      // compute the tcoords
      if (iType === _Constants4.InterpolationType.LINEAR) {
        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::ComputeTCoords', ['vec2 tpos = getTextureCoord(ijk, 0.0);', 'vec2 tpos2 = getTextureCoord(ijk, 1.0);', 'float zmix = ijk.z - floor(ijk.z);']).result;
      } else {
        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::ComputeTCoords', ['vec2 tpos = getTextureCoord(ijk, 0.5);']).result;
      }

      // compute the scalar value
      if (iType === _Constants4.InterpolationType.LINEAR) {
        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::ScalarFunction', ['scalar = getScalarValue(tpos);', 'float scalar2 = getScalarValue(tpos2);', 'scalar = mix(scalar, scalar2, zmix);']).result;
      } else {
        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::ScalarFunction', ['scalar = getScalarValue(tpos);']).result;
      }

      // for lighting and gradient opacity we need the
      // normal texture
      if (gopacity || model.lastLightComplexity > 0) {
        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Normal::Dec', ['uniform sampler2D normalTexture;']).result;
        if (iType === _Constants4.InterpolationType.LINEAR) {
          FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Normal::Impl', ['vec4 normal = texture2D(normalTexture, tpos);', 'vec4 normal2 = texture2D(normalTexture, tpos2);', 'normal = mix(normal, normal2, zmix);']).result;
        } else {
          FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Normal::Impl', ['vec4 normal = texture2D(normalTexture,tpos);']).result;
        }
      }

      // if we had to encode the scalar values into
      // rgb then add the right call to decode them
      // otherwise the generic texture lookup
      if (volInfo.encodedScalars) {
        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::ScalarValueFunction::Impl', ['vec4 scalarComps = texture2D(texture1, tpos);', 'return scalarComps.r + scalarComps.g/255.0 + scalarComps.b/65025.0;']).result;
      } else {
        FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::ScalarValueFunction::Impl', 'return texture2D(texture1, tpos).r;').result;
      }

      // WebGL only supports loops over constants
      // and does not support while loops so we
      // have to hard code how many steps/samples to take
      // We do a break so most systems will gracefully
      // early terminate, but it is always possible
      // a system will execute every step regardless

      var ext = model.currentInput.getExtent();
      var spc = model.currentInput.getSpacing();
      var vsize = _glMatrix.vec3.create();
      _glMatrix.vec3.set(vsize, (ext[1] - ext[0]) * spc[0], (ext[3] - ext[2]) * spc[1], (ext[5] - ext[4]) * spc[2]);
      var maxSamples = _glMatrix.vec3.length(vsize) / model.renderable.getSampleDistance();

      FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::MaximumSamplesValue', '' + Math.ceil(maxSamples)).result;
    }

    // if using gradient opacity apply that
    if (gopacity) {
      FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::GradientOpacity::Dec', ['uniform float goscale;', 'uniform float goshift;', 'uniform float gomin;', 'uniform float gomax;']).result;
      FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::GradientOpacity::Impl', ['tcolor.a = tcolor.a*clamp(normal.a*normal.a*goscale + goshift, gomin, gomax);']).result;
    }

    // if we have a ztexture then declare it and use it
    if (model.zBufferTexture !== null) {
      FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::ZBuffer::Dec', ['uniform sampler2D zBufferTexture;', 'uniform float vpWidth;', 'uniform float vpHeight;']).result;
      FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::ZBuffer::Impl', ['vec4 depthVec = texture2D(zBufferTexture, vec2(gl_FragCoord.x / vpWidth, gl_FragCoord.y/vpHeight));', 'float zdepth = (depthVec.r*256.0 + depthVec.g)/257.0;', 'zdepth = zdepth * 2.0 - 1.0;', 'zdepth = -2.0 * camFar * camNear / (zdepth*(camFar-camNear)-(camFar+camNear)) - camNear;', 'zdepth = -zdepth/rayDir.z;', 'tbounds.y = min(zdepth,tbounds.y);']).result;
    }

    shaders.Fragment = FSSource;

    publicAPI.replaceShaderLight(shaders, ren, actor);
  };

  publicAPI.replaceShaderLight = function (shaders, ren, actor) {
    var FSSource = shaders.Fragment;

    // check for shadow maps
    var shadowFactor = '';

    switch (model.lastLightComplexity) {
      default:
      case 0:
        // no lighting, tcolor is fine as is
        break;

      case 1: // headlight
      case 2: // light kit
      case 3:
        {
          // positional not implemented fallback to directional
          FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Light::Dec', ['uniform float vSpecularPower;', 'uniform float vAmbient;', 'uniform float vDiffuse;', 'uniform float vSpecular;', '//VTK::Light::Dec'], false).result;
          FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Light::Impl', ['  normal.rgb = 2.0*(normal.rgb - 0.5);', '  vec3 diffuse = vec3(0.0, 0.0, 0.0);', '  vec3 specular = vec3(0.0, 0.0, 0.0);', '  //VTK::Light::Impl', '  tcolor.rgb = tcolor.rgb*(diffuse*vDiffuse + vAmbient) + specular*vSpecular;'], false).result;
          var lightNum = 0;
          ren.getLights().forEach(function (light) {
            var status = light.getSwitch();
            if (status > 0) {
              FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Light::Dec', [
              // intensity weighted color
              'uniform vec3 lightColor' + lightNum + ';', 'uniform vec3 lightDirectionWC' + lightNum + '; // normalized', 'uniform vec3 lightHalfAngleWC' + lightNum + '; // normalized', '//VTK::Light::Dec'], false).result;
              FSSource = _ShaderProgram2.default.substitute(FSSource, '//VTK::Light::Impl', [
              //              `  float df = max(0.0, dot(normal.rgb, -lightDirectionWC${lightNum}));`,
              '  float df = abs(dot(normal.rgb, -lightDirectionWC' + lightNum + '));', '  diffuse += ((df' + shadowFactor + ') * lightColor' + lightNum + ');',
              // '  if (df > 0.0)',
              // '    {',
              //              `    float sf = pow( max(0.0, dot(lightHalfAngleWC${lightNum},normal.rgb)), specularPower);`,
              '    float sf = pow( abs(dot(lightHalfAngleWC' + lightNum + ',normal.rgb)), vSpecularPower);', '    specular += ((sf' + shadowFactor + ') * lightColor' + lightNum + ');',
              //              '    }',
              '  //VTK::Light::Impl'], false).result;
              lightNum++;
            }
          });
        }
    }

    shaders.Fragment = FSSource;
  };

  publicAPI.getNeedToRebuildShaders = function (cellBO, ren, actor) {
    // do we need lighting?
    var lightComplexity = 0;
    if (actor.getProperty().getShade()) {
      // consider the lighting complexity to determine which case applies
      // simple headlight, Light Kit, the whole feature set of VTK
      lightComplexity = 0;
      model.numberOfLights = 0;

      ren.getLights().forEach(function (light) {
        var status = light.getSwitch();
        if (status > 0) {
          model.numberOfLights++;
          if (lightComplexity === 0) {
            lightComplexity = 1;
          }
        }

        if (lightComplexity === 1 && (model.numberOfLights > 1 || light.getIntensity() !== 1.0 || !light.lightTypeIsHeadLight())) {
          lightComplexity = 2;
        }
        if (lightComplexity < 3 && light.getPositional()) {
          lightComplexity = 3;
        }
      });
    }

    var needRebuild = false;
    if (model.lastLightComplexity !== lightComplexity) {
      model.lastLightComplexity = lightComplexity;
      needRebuild = true;
    }

    // has something changed that would require us to recreate the shader?
    if (cellBO.getProgram() === 0 || needRebuild || model.lastZBufferTexture !== model.zBufferTexture || cellBO.getShaderSourceTime().getMTime() < publicAPI.getMTime() || cellBO.getShaderSourceTime().getMTime() < actor.getMTime() || cellBO.getShaderSourceTime().getMTime() < model.currentInput.getMTime()) {
      model.lastZBufferTexture = model.zBufferTexture;
      return true;
    }

    return false;
  };

  publicAPI.updateShaders = function (cellBO, ren, actor) {
    cellBO.getVAO().bind();
    model.lastBoundBO = cellBO;

    // has something changed that would require us to recreate the shader?
    if (publicAPI.getNeedToRebuildShaders(cellBO, ren, actor)) {
      var shaders = { Vertex: null, Fragment: null, Geometry: null };

      publicAPI.buildShaders(shaders, ren, actor);

      // compile and bind the program if needed
      var newShader = model.openGLRenderWindow.getShaderCache().readyShaderProgramArray(shaders.Vertex, shaders.Fragment, shaders.Geometry);

      // if the shader changed reinitialize the VAO
      if (newShader !== cellBO.getProgram()) {
        cellBO.setProgram(newShader);
        // reset the VAO as the shader has changed
        cellBO.getVAO().releaseGraphicsResources();
      }

      cellBO.getShaderSourceTime().modified();
    } else {
      model.openGLRenderWindow.getShaderCache().readyShaderProgram(cellBO.getProgram());
    }

    publicAPI.setMapperShaderParameters(cellBO, ren, actor);
    publicAPI.setCameraShaderParameters(cellBO, ren, actor);
    publicAPI.setPropertyShaderParameters(cellBO, ren, actor);
  };

  publicAPI.setMapperShaderParameters = function (cellBO, ren, actor) {
    // Now to update the VAO too, if necessary.
    var program = cellBO.getProgram();

    if (cellBO.getCABO().getElementCount() && (model.VBOBuildTime.getMTime() > cellBO.getAttributeUpdateTime().getMTime() || cellBO.getShaderSourceTime().getMTime() > cellBO.getAttributeUpdateTime().getMTime())) {
      cellBO.getCABO().bind();
      if (program.isAttributeUsed('vertexDC')) {
        if (!cellBO.getVAO().addAttributeArray(program, cellBO.getCABO(), 'vertexDC', cellBO.getCABO().getVertexOffset(), cellBO.getCABO().getStride(), model.context.FLOAT, 3, model.context.FALSE)) {
          vtkErrorMacro('Error setting vertexDC in shader VAO.');
        }
      }
    }

    program.setUniformi('texture1', model.scalarTexture.getTextureUnit());
    program.setUniformf('sampleDistance', model.renderable.getSampleDistance());

    // if we have a zbuffer texture then set it
    if (model.zBufferTexture !== null) {
      program.setUniformi('zBufferTexture', model.zBufferTexture.getTextureUnit());
      var size = publicAPI.getRenderTargetSize();
      program.setUniformf('vpWidth', size[0]);
      program.setUniformf('vpHeight', size[1]);
    }
  };

  publicAPI.setCameraShaderParameters = function (cellBO, ren, actor) {
    // // [WMVD]C == {world, model, view, display} coordinates
    // // E.g., WCDC == world to display coordinate transformation
    var keyMats = model.openGLCamera.getKeyMatrices(ren);

    var program = cellBO.getProgram();

    var cam = model.openGLCamera.getRenderable();
    var crange = cam.getClippingRange();
    program.setUniformf('camThick', crange[1] - crange[0]);
    program.setUniformf('camNear', crange[0]);
    program.setUniformf('camFar', crange[1]);

    var bounds = model.currentInput.getBounds();
    var dims = model.currentInput.getDimensions();

    // compute the viewport bounds of the volume
    // we will only render those fragments.
    var pos = _glMatrix.vec3.create();
    var dir = _glMatrix.vec3.create();
    var dcxmin = 1.0;
    var dcxmax = -1.0;
    var dcymin = 1.0;
    var dcymax = -1.0;
    for (var i = 0; i < 8; ++i) {
      _glMatrix.vec3.set(pos, bounds[i % 2], bounds[2 + Math.floor(i / 2) % 2], bounds[4 + Math.floor(i / 4)]);
      _glMatrix.vec3.transformMat4(pos, pos, keyMats.wcvc);
      _glMatrix.vec3.normalize(dir, pos);

      // now find the projection of this point onto a
      // nearZ distance plane. Since the camera is at 0,0,0
      // in VC the ray is just t*pos and
      // t is -nearZ/dir.z
      // intersection becomes pos.x/pos.z
      var t = -crange[0] / pos[2];
      _glMatrix.vec3.scale(pos, dir, t);

      // now convert to DC
      _glMatrix.vec3.transformMat4(pos, pos, keyMats.vcdc);

      dcxmin = Math.min(pos[0], dcxmin);
      dcxmax = Math.max(pos[0], dcxmax);
      dcymin = Math.min(pos[1], dcymin);
      dcymax = Math.max(pos[1], dcymax);
    }
    program.setUniformf('dcxmin', dcxmin);
    program.setUniformf('dcxmax', dcxmax);
    program.setUniformf('dcymin', dcymin);
    program.setUniformf('dcymax', dcymax);

    var ext = model.currentInput.getExtent();
    var spc = model.currentInput.getSpacing();
    var vsize = _glMatrix.vec3.create();
    _glMatrix.vec3.set(vsize, (ext[1] - ext[0]) * spc[0], (ext[3] - ext[2]) * spc[1], (ext[5] - ext[4]) * spc[2]);
    program.setUniform3f('vSize', vsize[0], vsize[1], vsize[2]);

    _glMatrix.vec3.set(pos, ext[0], ext[2], ext[4]);
    model.currentInput.indexToWorldVec3(pos, pos);

    _glMatrix.vec3.transformMat4(pos, pos, keyMats.wcvc);
    program.setUniform3f('vOriginVC', pos[0], pos[1], pos[2]);

    // apply the image directions
    var i2wmat4 = model.currentInput.getIndexToWorld();
    _glMatrix.mat4.multiply(model.idxToView, keyMats.wcvc, i2wmat4);

    _glMatrix.mat3.copy(model.idxNormalMatrix, model.currentInput.getDirection());
    _glMatrix.mat3.multiply(model.idxNormalMatrix, keyMats.normalMatrix, model.idxNormalMatrix);

    var maxSamples = _glMatrix.vec3.length(vsize) / model.renderable.getSampleDistance();
    if (maxSamples > model.renderable.getMaximumSamplesPerRay()) {
      vtkWarningMacro('The number of steps required ' + Math.ceil(maxSamples) + ' is larger than the\n        specified maximum number of steps ' + model.renderable.getMaximumSamplesPerRay() + '.\n        Please either change the\n        volumeMapper sampleDistance or its maximum number of samples.');
    }
    var vctoijk = _glMatrix.vec3.create();
    if (model.openGLRenderWindow.getWebgl2()) {
      _glMatrix.vec3.set(vctoijk, 1.0, 1.0, 1.0);
    } else {
      _glMatrix.vec3.set(vctoijk, dims[0] - 1.0, dims[1] - 1.0, dims[2] - 1.0);
    }
    _glMatrix.vec3.divide(vctoijk, vctoijk, vsize);
    program.setUniform3f('vVCToIJK', vctoijk[0], vctoijk[1], vctoijk[2]);

    if (!model.openGLRenderWindow.getWebgl2()) {
      var volInfo = model.scalarTexture.getVolumeInfo();
      program.setUniformf('texWidth', model.scalarTexture.getWidth());
      program.setUniformf('texHeight', model.scalarTexture.getHeight());
      program.setUniformi('xreps', volInfo.xreps);
      program.setUniformf('xstride', volInfo.xstride);
      program.setUniformf('ystride', volInfo.ystride);
      program.setUniformi('repWidth', volInfo.width);
      program.setUniformi('repHeight', volInfo.height);
      program.setUniformi('repDepth', dims[2]);
    }

    // map normals through normal matrix
    // then use a point on the plane to compute the distance
    var normal = _glMatrix.vec3.create();
    var pos2 = _glMatrix.vec3.create();
    for (var _i = 0; _i < 6; ++_i) {
      switch (_i) {
        default:
        case 0:
          _glMatrix.vec3.set(normal, 1.0, 0.0, 0.0);
          _glMatrix.vec3.set(pos2, ext[1], ext[3], ext[5]);
          break;
        case 1:
          _glMatrix.vec3.set(normal, -1.0, 0.0, 0.0);
          _glMatrix.vec3.set(pos2, ext[0], ext[2], ext[4]);
          break;
        case 2:
          _glMatrix.vec3.set(normal, 0.0, 1.0, 0.0);
          _glMatrix.vec3.set(pos2, ext[1], ext[3], ext[5]);
          break;
        case 3:
          _glMatrix.vec3.set(normal, 0.0, -1.0, 0.0);
          _glMatrix.vec3.set(pos2, ext[0], ext[2], ext[4]);
          break;
        case 4:
          _glMatrix.vec3.set(normal, 0.0, 0.0, 1.0);
          _glMatrix.vec3.set(pos2, ext[1], ext[3], ext[5]);
          break;
        case 5:
          _glMatrix.vec3.set(normal, 0.0, 0.0, -1.0);
          _glMatrix.vec3.set(pos2, ext[0], ext[2], ext[4]);
          break;
      }
      _glMatrix.vec3.transformMat3(normal, normal, model.idxNormalMatrix);
      _glMatrix.vec3.transformMat4(pos2, pos2, model.idxToView);
      var dist = -1.0 * _glMatrix.vec3.dot(pos2, normal);

      // we have the plane in view coordinates
      // specify the planes in view coordinates
      program.setUniform3f('vPlaneNormal' + _i, normal[0], normal[1], normal[2]);
      program.setUniformf('vPlaneDistance' + _i, dist);
    }

    var dcvc = _glMatrix.mat4.create();
    _glMatrix.mat4.invert(dcvc, keyMats.vcdc);
    program.setUniformMatrix('DCVCMatrix', dcvc);

    // handle lighting values
    switch (model.lastLightComplexity) {
      default:
      case 0:
        // no lighting, tcolor is fine as is
        break;

      case 1: // headlight
      case 2: // light kit
      case 3:
        {
          // positional not implemented fallback to directional
          var lightNum = 0;
          var camDOP = cam.getDirectionOfProjection();
          var lightColor = [];
          ren.getLights().forEach(function (light) {
            var status = light.getSwitch();
            if (status > 0) {
              var dColor = light.getColor();
              var intensity = light.getIntensity();
              lightColor[0] = dColor[0] * intensity;
              lightColor[1] = dColor[1] * intensity;
              lightColor[2] = dColor[2] * intensity;
              program.setUniform3f('lightColor' + lightNum, lightColor);
              var lightDir = light.getDirection();
              program.setUniform3f('lightDirectionWC' + lightNum, lightDir);
              var halfAngle = [-0.5 * (lightDir[0] + camDOP[0]), -0.5 * (lightDir[1] + camDOP[1]), -0.5 * (lightDir[2] + camDOP[2])];
              program.setUniform3f('lightHalfAngleWC' + lightNum, halfAngle);
              lightNum++;
            }
          });
        }
    }
  };

  publicAPI.setPropertyShaderParameters = function (cellBO, ren, actor) {
    var program = cellBO.getProgram();

    program.setUniformi('ctexture', model.colorTexture.getTextureUnit());
    program.setUniformi('otexture', model.opacityTexture.getTextureUnit());

    var volInfo = model.scalarTexture.getVolumeInfo();
    var sscale = volInfo.max - volInfo.min;

    var vprop = actor.getProperty();
    var ofun = vprop.getScalarOpacity(0);
    var oRange = ofun.getRange();
    program.setUniformf('oshift', (volInfo.min - oRange[0]) / (oRange[1] - oRange[0]));
    program.setUniformf('oscale', sscale / (oRange[1] - oRange[0]));

    var cfun = vprop.getRGBTransferFunction(0);
    var cRange = cfun.getRange();
    program.setUniformf('cshift', (volInfo.min - cRange[0]) / (cRange[1] - cRange[0]));
    program.setUniformf('cscale', sscale / (cRange[1] - cRange[0]));

    if (vprop.getUseGradientOpacity(0)) {
      var lightingInfo = model.lightingTexture.getVolumeInfo();
      var gomin = vprop.getGradientOpacityMinimumOpacity(0);
      var gomax = vprop.getGradientOpacityMaximumOpacity(0);
      program.setUniformf('gomin', gomin);
      program.setUniformf('gomax', gomax);
      var goRange = [vprop.getGradientOpacityMinimumValue(0), vprop.getGradientOpacityMaximumValue(0)];
      program.setUniformf('goscale', lightingInfo.max * (gomax - gomin) / (goRange[1] - goRange[0]));
      program.setUniformf('goshift', -goRange[0] * (gomax - gomin) / (goRange[1] - goRange[0]) + gomin);
    }

    if (model.lastLightComplexity > 0 || vprop.getUseGradientOpacity(0)) {
      program.setUniformi('normalTexture', model.lightingTexture.getTextureUnit());
    }

    if (model.lastLightComplexity > 0) {
      program.setUniformf('vAmbient', vprop.getAmbient());
      program.setUniformf('vDiffuse', vprop.getDiffuse());
      program.setUniformf('vSpecular', vprop.getSpecular());
      program.setUniformf('vSpecularPower', vprop.getSpecularPower());
    }
  };

  publicAPI.getRenderTargetSize = function () {
    if (model.lastXYF > 1.43) {
      var sz = model.framebuffer.getSize();
      return [model.fvp[0] * sz[0], model.fvp[1] * sz[1]];
    }
    return model.openGLRenderWindow.getSize();
  };

  publicAPI.renderPieceStart = function (ren, actor) {
    if (model.renderable.getAutoAdjustSampleDistances()) {
      var rwi = ren.getVTKWindow().getInteractor();
      var rft = rwi.getLastFrameTime();
      // console.log(`last frame time ${Math.floor(1.0 / rft)}`);

      // frame time is typically for a couple frames prior
      // which makes it messy, so keep long running averages
      // of frame times and pixels rendered
      model.avgFrameTime = 0.97 * model.avgFrameTime + 0.03 * rft;
      model.avgWindowArea = 0.97 * model.avgWindowArea + 0.03 / (model.lastXYF * model.lastXYF);

      if (ren.getVTKWindow().getInteractor().isAnimating()) {
        // compute target xy factor
        var txyf = Math.sqrt(model.avgFrameTime * rwi.getDesiredUpdateRate() / model.avgWindowArea);

        // limit subsampling to a factor of 10
        if (txyf > 10.0) {
          txyf = 10.0;
        }

        model.targetXYF = txyf;
      } else {
        model.targetXYF = Math.sqrt(model.avgFrameTime * rwi.getStillUpdateRate() / model.avgWindowArea);
      }

      // have some inertia to change states around 1.43
      if (model.targetXYF < 1.53 && model.targetXYF > 1.33) {
        model.targetXYF = model.lastXYF;
      }

      // and add some inertia to change at all
      if (Math.abs(1.0 - model.targetXYF / model.lastXYF) < 0.1) {
        model.targetXYF = model.lastXYF;
      }
      model.lastXYF = model.targetXYF;
    } else {
      model.lastXYF = model.renderable.getImageSampleDistance();
    }

    // only use FBO beyond this value
    if (model.lastXYF <= 1.43) {
      model.lastXYF = 1.0;
    }

    // console.log(`last target  ${model.lastXYF} ${model.targetXYF}`);
    // console.log(`awin aft  ${model.avgWindowArea} ${model.avgFrameTime}`);
    var xyf = model.lastXYF;

    var size = model.openGLRenderWindow.getSize();
    // const newSize = [
    //   Math.floor((size[0] / xyf) + 0.5),
    //   Math.floor((size[1] / xyf) + 0.5)];

    // const diag = vtkBoundingBox.getDiagonalLength(model.currentInput.getBounds());

    // // so what is the resulting sample size roughly
    // console.log(`sam size ${diag / newSize[0]} ${diag / newSize[1]} ${model.renderable.getImageSampleDistance()}`);

    // // if the sample distance is getting far from the image sample dist
    // if (2.0 * diag / (newSize[0] + newSize[1]) > 4 * model.renderable.getSampleDistance()) {
    //   model.renderable.setSampleDistance(4.0 * model.renderable.getSampleDistance());
    // }
    // if (2.0 * diag / (newSize[0] + newSize[1]) < 0.25 * model.renderable.getSampleDistance()) {
    //   model.renderable.setSampleDistance(0.25 * model.renderable.getSampleDistance());
    // }

    // create/resize framebuffer if needed
    if (xyf > 1.43) {
      model.framebuffer.saveCurrentBindingsAndBuffers();

      if (model.framebuffer.getGLFramebuffer() === null) {
        model.framebuffer.create(Math.floor(size[0] * 0.7), Math.floor(size[1] * 0.7));
        model.framebuffer.populateFramebuffer();
      } else {
        var fbSize = model.framebuffer.getSize();
        if (fbSize[0] !== Math.floor(size[0] * 0.7) || fbSize[1] !== Math.floor(size[1] * 0.7)) {
          console.log('resizing');
          model.framebuffer.create(Math.floor(size[0] * 0.7), Math.floor(size[1] * 0.7));
          model.framebuffer.populateFramebuffer();
        }
      }
      model.framebuffer.bind();
      var gl = model.context;
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.colorMask(true, true, true, true);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.viewport(0, 0, size[0] / xyf, size[1] / xyf);
      model.fvp = [Math.floor(size[0] / xyf) / Math.floor(size[0] * 0.7), Math.floor(size[1] / xyf) / Math.floor(size[1] * 0.7)];
    }
    model.context.disable(model.context.DEPTH_TEST);

    // make sure the BOs are up to date
    publicAPI.updateBufferObjects(ren, actor);

    // set interpolation on the texture based on property setting
    var iType = actor.getProperty().getInterpolationType();
    if (iType === _Constants4.InterpolationType.NEAREST) {
      model.scalarTexture.setMinificationFilter(_Constants3.Filter.NEAREST);
      model.scalarTexture.setMagnificationFilter(_Constants3.Filter.NEAREST);
      model.lightingTexture.setMinificationFilter(_Constants3.Filter.NEAREST);
      model.lightingTexture.setMagnificationFilter(_Constants3.Filter.NEAREST);
    } else {
      model.scalarTexture.setMinificationFilter(_Constants3.Filter.LINEAR);
      model.scalarTexture.setMagnificationFilter(_Constants3.Filter.LINEAR);
      model.lightingTexture.setMinificationFilter(_Constants3.Filter.LINEAR);
      model.lightingTexture.setMagnificationFilter(_Constants3.Filter.LINEAR);
    }

    // Bind the OpenGL, this is shared between the different primitive/cell types.
    model.lastBoundBO = null;

    // if we have a zbuffer texture then activate it
    if (model.zBufferTexture !== null) {
      model.zBufferTexture.activate();
    }
  };

  publicAPI.renderPieceDraw = function (ren, actor) {
    var gl = model.context;

    // render the texture
    model.scalarTexture.activate();
    model.opacityTexture.activate();
    model.colorTexture.activate();
    if (actor.getProperty().getShade() || actor.getProperty().getUseGradientOpacity(0)) {
      model.lightingTexture.activate();
    }

    publicAPI.updateShaders(model.tris, ren, actor);

    // First we do the triangles, update the shader, set uniforms, etc.
    gl.drawArrays(gl.TRIANGLES, 0, model.tris.getCABO().getElementCount());

    model.scalarTexture.deactivate();
    model.colorTexture.deactivate();
    model.opacityTexture.deactivate();
    if (actor.getProperty().getShade() || actor.getProperty().getUseGradientOpacity(0)) {
      model.lightingTexture.deactivate();
    }
  };

  publicAPI.renderPieceFinish = function (ren, actor) {
    if (model.LastBoundBO) {
      model.LastBoundBO.getVAO().release();
    }

    // if we have a zbuffer texture then deactivate it
    if (model.zBufferTexture !== null) {
      model.zBufferTexture.deactivate();
    }

    if (model.lastXYF > 1.43) {
      // now copy the frambuffer with the volume into the
      // regular buffer
      model.framebuffer.restorePreviousBindingsAndBuffers();

      if (model.copyShader === null) {
        model.copyShader = model.openGLRenderWindow.getShaderCache().readyShaderProgramArray(['//VTK::System::Dec', 'attribute vec4 vertexDC;', 'uniform vec2 tfactor;', 'varying vec2 tcoord;', 'void main() { tcoord = vec2(vertexDC.x*0.5 + 0.5, vertexDC.y*0.5 + 0.5) * tfactor; gl_Position = vertexDC; }'].join('\n'), ['//VTK::System::Dec', '//VTK::Output::Dec', 'uniform sampler2D texture1;', 'varying vec2 tcoord;', 'void main() { gl_FragData[0] = texture2D(texture1,tcoord); }'].join('\n'), '');
        var program = model.copyShader;

        model.copyVAO = _VertexArrayObject2.default.newInstance();
        model.copyVAO.setContext(model.context);

        model.tris.getCABO().bind();
        if (!model.copyVAO.addAttributeArray(program, model.tris.getCABO(), 'vertexDC', model.tris.getCABO().getVertexOffset(), model.tris.getCABO().getStride(), model.context.FLOAT, 3, model.context.FALSE)) {
          vtkErrorMacro('Error setting vertexDC in copy shader VAO.');
        }
      } else {
        model.openGLRenderWindow.getShaderCache().readyShaderProgram(model.copyShader);
      }

      var size = model.openGLRenderWindow.getSize();
      model.context.viewport(0, 0, size[0], size[1]);

      // activate texture
      var tex = model.framebuffer.getColorTexture();
      tex.activate();
      model.copyShader.setUniformi('texture', tex.getTextureUnit());

      model.copyShader.setUniform2f('tfactor', model.fvp[0], model.fvp[1]);

      var gl = model.context;
      gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      // render quad
      model.context.drawArrays(model.context.TRIANGLES, 0, model.tris.getCABO().getElementCount());
      tex.deactivate();

      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    }
  };

  publicAPI.renderPiece = function (ren, actor) {
    publicAPI.invokeEvent({ type: 'StartEvent' });
    model.renderable.update();
    model.currentInput = model.renderable.getInputData();
    publicAPI.invokeEvent({ type: 'EndEvent' });

    if (model.currentInput === null) {
      vtkErrorMacro('No input!');
      return;
    }

    publicAPI.renderPieceStart(ren, actor);
    publicAPI.renderPieceDraw(ren, actor);
    publicAPI.renderPieceFinish(ren, actor);
  };

  publicAPI.computeBounds = function (ren, actor) {
    if (!publicAPI.getInput()) {
      _Math2.default.uninitializeBounds(model.Bounds);
      return;
    }
    model.bounnds = publicAPI.getInput().getBounds();
  };

  publicAPI.updateBufferObjects = function (ren, actor) {
    // Rebuild buffers if needed
    if (publicAPI.getNeedToRebuildBufferObjects(ren, actor)) {
      publicAPI.buildBufferObjects(ren, actor);
    }
  };

  publicAPI.getNeedToRebuildBufferObjects = function (ren, actor) {
    // first do a coarse check
    if (model.VBOBuildTime.getMTime() < publicAPI.getMTime() || model.VBOBuildTime.getMTime() < actor.getMTime() || model.VBOBuildTime.getMTime() < model.renderable.getMTime() || model.VBOBuildTime.getMTime() < actor.getProperty().getMTime() || model.VBOBuildTime.getMTime() < model.currentInput.getMTime()) {
      return true;
    }
    return false;
  };

  publicAPI.buildBufferObjects = function (ren, actor) {
    var image = model.currentInput;

    if (image === null) {
      return;
    }

    var vprop = actor.getProperty();

    // rebuild opacity tfun?
    var ofun = vprop.getScalarOpacity(0);
    var opacityFactor = model.renderable.getSampleDistance() / vprop.getScalarOpacityUnitDistance(0);
    var toString = ofun.getMTime() + 'A' + opacityFactor;
    if (model.opacityTextureString !== toString) {
      var oRange = ofun.getRange();
      var oWidth = 1024;
      var ofTable = new Float32Array(oWidth);
      ofun.getTable(oRange[0], oRange[1], oWidth, ofTable, 1);
      var oTable = new Uint8Array(oWidth);
      for (var i = 0; i < oWidth; ++i) {
        oTable[i] = 255.0 * (1.0 - Math.pow(1.0 - ofTable[i], opacityFactor));
      }
      model.opacityTexture.setMinificationFilter(_Constants3.Filter.LINEAR);
      model.opacityTexture.setMagnificationFilter(_Constants3.Filter.LINEAR);
      model.opacityTexture.create2DFromRaw(oWidth, 1, 1, _Constants.VtkDataTypes.UNSIGNED_CHAR, oTable);
      model.opacityTextureString = toString;
    }

    // rebuild color tfun?
    var cfun = vprop.getRGBTransferFunction(0);
    toString = '' + cfun.getMTime();
    if (model.colorTextureString !== toString) {
      var cRange = cfun.getRange();
      var cWidth = 1024;
      var cfTable = new Float32Array(cWidth * 3);
      cfun.getTable(cRange[0], cRange[1], cWidth, cfTable, 1);
      var cTable = new Uint8Array(cWidth * 3);
      for (var _i2 = 0; _i2 < cWidth * 3; ++_i2) {
        cTable[_i2] = 255.0 * cfTable[_i2];
      }
      model.colorTexture.setMinificationFilter(_Constants3.Filter.LINEAR);
      model.colorTexture.setMagnificationFilter(_Constants3.Filter.LINEAR);
      model.colorTexture.create2DFromRaw(cWidth, 1, 3, _Constants.VtkDataTypes.UNSIGNED_CHAR, cTable);
      model.colorTextureString = toString;
    }

    // rebuild the scalarTexture if the data has changed
    toString = '' + image.getMTime();
    if (model.scalarTextureString !== toString) {
      // Build the textures
      var dims = image.getDimensions();
      model.scalarTexture.resetFormatAndType();
      model.scalarTexture.create3DOneComponentFromRaw(dims[0], dims[1], dims[2], image.getPointData().getScalars().getDataType(), image.getPointData().getScalars().getData());
      model.scalarTextureString = toString;
    }

    // rebuild lighting texture
    var shading = vprop.getShade();
    var gopacity = vprop.getUseGradientOpacity(0);
    // rebuild the lightingTexture if the data has changed
    toString = '' + image.getMTime();
    if ((shading || gopacity) && model.lightingTextureString !== toString) {
      model.lightingTexture.resetFormatAndType();
      model.lightingTexture.create3DLighting(model.scalarTexture, image.getPointData().getScalars().getData(), image.getSpacing());
      model.lightingTextureString = toString;
    }

    if (!model.tris.getCABO().getElementCount()) {
      // build the CABO
      var ptsArray = new Float32Array(12);
      for (var _i3 = 0; _i3 < 4; _i3++) {
        ptsArray[_i3 * 3] = _i3 % 2 * 2 - 1.0;
        ptsArray[_i3 * 3 + 1] = _i3 > 1 ? 1.0 : -1.0;
        ptsArray[_i3 * 3 + 2] = -1.0;
      }

      var points = _DataArray2.default.newInstance({ numberOfComponents: 3, values: ptsArray });
      points.setName('points');

      var cellArray = new Uint16Array(8);
      cellArray[0] = 3;
      cellArray[1] = 0;
      cellArray[2] = 1;
      cellArray[3] = 3;
      cellArray[4] = 3;
      cellArray[5] = 0;
      cellArray[6] = 3;
      cellArray[7] = 2;
      var cells = _DataArray2.default.newInstance({ numberOfComponents: 1, values: cellArray });

      model.tris.getCABO().createVBO(cells, 'polys', _Constants2.Representation.SURFACE, { points: points, cellOffset: 0 });
    }

    model.VBOBuildTime.modified();
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  context: null,
  VBOBuildTime: null,
  scalarTexture: null,
  scalarTextureString: null,
  opacityTexture: null,
  opacityTextureString: null,
  colorTexture: null,
  colortextureString: null,
  lightingTexture: null,
  lightingTextureString: null,
  tris: null,
  framebuffer: null,
  copyShader: null,
  copyVAO: null,
  lastXYF: 1.0,
  targetXYF: 1.0,
  zBufferTexture: null,
  lastZBufferTexture: null,
  lastLightComplexity: 0,
  fullViewportTime: 1.0,
  idxToView: null,
  idxNormalMatrix: null,
  avgWindowArea: 0.0,
  avgFrameTime: 0.0
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  _ViewNode2.default.extend(publicAPI, model, initialValues);

  model.VBOBuildTime = {};
  _macro2.default.obj(model.VBOBuildTime, { mtime: 0 });

  model.tris = _Helper2.default.newInstance();
  model.scalarTexture = _Texture2.default.newInstance();
  model.opacityTexture = _Texture2.default.newInstance();
  model.colorTexture = _Texture2.default.newInstance();
  model.lightingTexture = _Texture2.default.newInstance();
  model.framebuffer = _Framebuffer2.default.newInstance();

  model.idxToView = _glMatrix.mat4.create();
  model.idxNormalMatrix = _glMatrix.mat3.create();

  // Build VTK API
  _macro2.default.setGet(publicAPI, model, ['context']);

  // Object methods
  vtkOpenGLVolumeMapper(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkOpenGLVolumeMapper');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var InterpolationType = exports.InterpolationType = {
  NEAREST: 0,
  LINEAR: 1,
  FAST_LINEAR: 2
};

exports.default = {
  InterpolationType: InterpolationType
};

/***/ }),
/* 79 */
/***/ (function(module, exports) {

module.exports = "//VTK::System::Dec\n\n/*=========================================================================\n\n  Program:   Visualization Toolkit\n  Module:    vtkPolyDataVS.glsl\n\n  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen\n  All rights reserved.\n  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.\n\n     This software is distributed WITHOUT ANY WARRANTY; without even\n     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR\n     PURPOSE.  See the above copyright notice for more information.\n\n=========================================================================*/\n\nattribute vec4 vertexDC;\n\nvarying vec3 vertexVCVSOutput;\nuniform mat4 DCVCMatrix;\n\nuniform float dcxmin;\nuniform float dcxmax;\nuniform float dcymin;\nuniform float dcymax;\n\nvoid main()\n{\n  // dcsmall is the device coords reduced to the\n  // x y area covered by the volume\n  vec4 dcsmall = vec4(\n    dcxmin + 0.5 * (vertexDC.x + 1.0) * (dcxmax - dcxmin),\n    dcymin + 0.5 * (vertexDC.y + 1.0) * (dcymax - dcymin),\n    vertexDC.z,\n    vertexDC.w);\n  vec4 vcpos = DCVCMatrix * dcsmall;\n  vertexVCVSOutput = vcpos.xyz/vcpos.w;\n  gl_Position = dcsmall;\n}\n"

/***/ }),
/* 80 */
/***/ (function(module, exports) {

module.exports = "//VTK::System::Dec\n\n/*=========================================================================\n\n  Program:   Visualization Toolkit\n  Module:    vtkPolyDataFS.glsl\n\n  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen\n  All rights reserved.\n  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.\n\n     This software is distributed WITHOUT ANY WARRANTY; without even\n     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR\n     PURPOSE.  See the above copyright notice for more information.\n\n=========================================================================*/\n// Template for the polydata mappers fragment shader\n\n// the output of this shader\n//VTK::Output::Dec\n\nvarying vec3 vertexVCVSOutput;\n\n// camera values\nuniform float camThick;\nuniform float camNear;\nuniform float camFar;\n\n// values describing the volume geometry\nuniform vec3 vOriginVC;\nuniform vec3 vSize;\nuniform vec3 vPlaneNormal0;\nuniform float vPlaneDistance0;\nuniform vec3 vPlaneNormal1;\nuniform float vPlaneDistance1;\nuniform vec3 vPlaneNormal2;\nuniform float vPlaneDistance2;\nuniform vec3 vPlaneNormal3;\nuniform float vPlaneDistance3;\nuniform vec3 vPlaneNormal4;\nuniform float vPlaneDistance4;\nuniform vec3 vPlaneNormal5;\nuniform float vPlaneDistance5;\n\n// opacity and color textures\nuniform sampler2D otexture;\nuniform float oshift;\nuniform float oscale;\nuniform sampler2D ctexture;\nuniform float cshift;\nuniform float cscale;\n\n// some 3D texture values\nuniform sampler2D texture1;\nuniform float sampleDistance;\nuniform vec3 vVCToIJK;\nuniform float texWidth;\nuniform float texHeight;\nuniform int xreps;\nuniform float xstride;\nuniform float ystride;\nuniform int repWidth;\nuniform int repHeight;\nuniform int repDepth;\n\n// declaration for intermixed geometry\n//VTK::ZBuffer::Dec\n\n// Lighting values\n//VTK::Light::Dec\n\n// normal calc\n//VTK::Normal::Dec\n\n// gradient opacity\n//VTK::GradientOpacity::Dec\n\nvec2 getTextureCoord(vec3 ijk, float offset)\n{\n  // uncomment the following line to see  the  packed  texture\n  // return vec2(ijk.x/float(repWidth), ijk.y/float(repHeight));\n  int z = int(ijk.z + offset);\n  int yz = z / xreps;\n  int xz = z - yz*xreps;\n\n  float ni = (ijk.x + float(xz * repWidth))/xstride;\n  float nj = (ijk.y + float(yz * repHeight))/ystride;\n\n  vec2 tpos = vec2(ni/texWidth, nj/texHeight);\n\n  return tpos;\n}\n\n// because scalars may be encoded\n// this func will decode them as needed\nfloat getScalarValue(vec2 tpos)\n{\n  //VTK::ScalarValueFunction::Impl\n}\n\nvec2 getRayPointIntersectionBounds(\n  vec3 rayPos, vec3 rayDir,\n  vec3 planeDir, float planeDist,\n  vec2 tbounds, vec3 vPlaneX, vec3 vPlaneY,\n  float vSize1, float vSize2)\n{\n  float result = dot(rayDir, planeDir);\n  if (result == 0.0)\n  {\n    return tbounds;\n  }\n  result = -1.0 * (dot(rayPos, planeDir) + planeDist) / result;\n  vec3 xposVC = rayPos + rayDir*result;\n  vec3 vxpos = xposVC - vOriginVC;\n  vec2 vpos = vec2(\n    dot(vxpos, vPlaneX),\n    dot(vxpos, vPlaneY));\n\n  // on some apple nvidia systems this does not work\n  // if (vpos.x < 0.0 || vpos.x > vSize1 ||\n  //     vpos.y < 0.0 || vpos.y > vSize2)\n  // even just\n  // if (vpos.x < 0.0 || vpos.y < 0.0)\n  // fails\n  // so instead we compute a value that represents in and out\n  //and then compute the return using this value\n  float xcheck = max(0.0, vpos.x * (vpos.x - vSize1)); //  0 means in bounds\n  float check = sign(max(xcheck, vpos.y * (vpos.y - vSize2))); //  0 means in bounds, 1 = out\n\n  return mix(\n   vec2(min(tbounds.x, result), max(tbounds.y, result)), // in value\n   tbounds, // out value\n   check);  // 0 in 1 out\n}\n\nvoid main()\n{\n  float scalar;\n  vec4 scalarComps;\n\n  // camera is at 0,0,0 so rayDir for perspective is just the vc coord\n  vec3 rayDir = normalize(vertexVCVSOutput);\n  vec2 tbounds = vec2(100.0*camFar, -1.0);\n\n  // all this is in View Coordinates\n  tbounds = getRayPointIntersectionBounds(vertexVCVSOutput, rayDir,\n    vPlaneNormal0, vPlaneDistance0, tbounds, vPlaneNormal2, vPlaneNormal4,\n    vSize.y, vSize.z);\n  tbounds = getRayPointIntersectionBounds(vertexVCVSOutput, rayDir,\n    vPlaneNormal1, vPlaneDistance1, tbounds, vPlaneNormal2, vPlaneNormal4,\n    vSize.y, vSize.z);\n  tbounds = getRayPointIntersectionBounds(vertexVCVSOutput, rayDir,\n    vPlaneNormal2, vPlaneDistance2, tbounds, vPlaneNormal0, vPlaneNormal4,\n    vSize.x, vSize.z);\n  tbounds = getRayPointIntersectionBounds(vertexVCVSOutput, rayDir,\n    vPlaneNormal3, vPlaneDistance3, tbounds, vPlaneNormal0, vPlaneNormal4,\n    vSize.x, vSize.z);\n  tbounds = getRayPointIntersectionBounds(vertexVCVSOutput, rayDir,\n    vPlaneNormal4, vPlaneDistance4, tbounds, vPlaneNormal0, vPlaneNormal2,\n    vSize.x, vSize.y);\n  tbounds = getRayPointIntersectionBounds(vertexVCVSOutput, rayDir,\n    vPlaneNormal5, vPlaneDistance5, tbounds, vPlaneNormal0, vPlaneNormal2,\n    vSize.x, vSize.y);\n\n  // do not go behind front clipping plane\n  tbounds.x = max(0.0,tbounds.x);\n\n  // do not go PAST far clipping plane\n  float farDist = -camThick/rayDir.z;\n  tbounds.y = min(farDist,tbounds.y);\n\n  // Do not go past the zbuffer value if set\n  // This is used for intermixing opaque geometry\n  //VTK::ZBuffer::Impl\n\n  // do we need to composite?\n  if (tbounds.y > tbounds.x)\n  {\n    // compute starting and ending values in volume space\n    vec3 startVC = vertexVCVSOutput + tbounds.x*rayDir;\n    startVC = startVC - vOriginVC;\n\n    // vpos and endvpos are in VolumeCoords not Index yet\n    vec3 vpos = vec3(\n      dot(startVC, vPlaneNormal0),\n      dot(startVC, vPlaneNormal2),\n      dot(startVC, vPlaneNormal4));\n    vec3 endVC = vertexVCVSOutput + tbounds.y*rayDir;\n    endVC = endVC - vOriginVC;\n    vec3 endvpos = vec3(\n      dot(endVC, vPlaneNormal0),\n      dot(endVC, vPlaneNormal2),\n      dot(endVC, vPlaneNormal4));\n    vec3 vdelta = endvpos - vpos;\n    float numSteps = length(vdelta) / sampleDistance;\n    vdelta = vdelta / numSteps;\n\n    // start slightly inside\n    vpos = vpos + vdelta*0.1;\n    vec4 color = vec4(0.0, 0.0, 0.0, 0.0);\n    int count = int(numSteps - 0.2); // end slightly inside\n\n    vec3 ijk = vpos * vVCToIJK;\n    vdelta = vdelta * vVCToIJK;\n    for (int i = 0; i < //VTK::MaximumSamplesValue ; ++i)\n    {\n      // compute the 2d texture coordinate/s\n      //VTK::ComputeTCoords\n\n      // compute the scalar\n      //VTK::ScalarFunction\n\n      // now map through opacity and color\n      vec4 tcolor = texture2D(ctexture, vec2(scalar * cscale + cshift, 0.5));\n      tcolor.a = texture2D(otexture, vec2(scalar * oscale + oshift, 0.5)).r;\n\n      // compute the normal if needed\n      //VTK::Normal::Impl\n\n      // handle gradient opacity\n      //VTK::GradientOpacity::Impl\n\n      // handle lighting\n      //VTK::Light::Impl\n\n      float mix = (1.0 - color.a);\n\n      // this line should not be needed but nvidia seems to not handle\n      // the break correctly on windows/chrome 58 angle\n      mix = mix * sign(max(float(count - i + 1), 0.0));\n\n      color = color + vec4(tcolor.rgb*tcolor.a, tcolor.a)*mix;\n      if (i >= count) { break; }\n      if (color.a > 0.99) { color.a = 1.0; break; }\n      ijk += vdelta;\n    }\n\n    gl_FragData[0] = vec4(color.rgb/color.a, color.a);\n    // gl_FragData[0] = vec4(tbounds.y/farDist, tbounds.x/farDist, color.b/color.a, 1.0);\n  }\n  else\n  {\n    discard;\n  }\n}\n"

/***/ }),
/* 81 */
/***/ (function(module, exports) {

module.exports = "//VTK::System::Dec\n\n/*=========================================================================\n\n  Program:   Visualization Toolkit\n  Module:    vtkPolyDataFS.glsl\n\n  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen\n  All rights reserved.\n  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.\n\n     This software is distributed WITHOUT ANY WARRANTY; without even\n     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR\n     PURPOSE.  See the above copyright notice for more information.\n\n=========================================================================*/\n// Template for the polydata mappers fragment shader\n\n// the output of this shader\n//VTK::Output::Dec\n\nvarying vec3 vertexVCVSOutput;\n\n// camera values\nuniform float camThick;\nuniform float camNear;\nuniform float camFar;\n\n// values describing the volume geometry\nuniform vec3 vOriginVC;\nuniform vec3 vSize;\nuniform vec3 vPlaneNormal0;\nuniform float vPlaneDistance0;\nuniform vec3 vPlaneNormal1;\nuniform float vPlaneDistance1;\nuniform vec3 vPlaneNormal2;\nuniform float vPlaneDistance2;\nuniform vec3 vPlaneNormal3;\nuniform float vPlaneDistance3;\nuniform vec3 vPlaneNormal4;\nuniform float vPlaneDistance4;\nuniform vec3 vPlaneNormal5;\nuniform float vPlaneDistance5;\n\n// opacity and color textures\nuniform sampler2D otexture;\nuniform float oshift;\nuniform float oscale;\nuniform sampler2D ctexture;\nuniform float cshift;\nuniform float cscale;\n\n// some 3D texture values\nuniform highp sampler3D texture1;\nuniform float sampleDistance;\nuniform vec3 vVCToIJK;\n\n// declaration for intermixed geometry\n//VTK::ZBuffer::Dec\n\n// Lighting values\n//VTK::Light::Dec\n\n// normal calc\n//VTK::Normal::Dec\n\n// gradient opacity\n//VTK::GradientOpacity::Dec\n\nvec2 getRayPointIntersectionBounds(\n  vec3 rayPos, vec3 rayDir,\n  vec3 planeDir, float planeDist,\n  vec2 tbounds, vec3 vPlaneX, vec3 vPlaneY,\n  float vSize1, float vSize2)\n{\n  float result = dot(rayDir, planeDir);\n  if (result == 0.0)\n  {\n    return tbounds;\n  }\n  result = -1.0 * (dot(rayPos, planeDir) + planeDist) / result;\n  vec3 xposVC = rayPos + rayDir*result;\n  vec3 vxpos = xposVC - vOriginVC;\n  vec2 vpos = vec2(\n    dot(vxpos, vPlaneX),\n    dot(vxpos, vPlaneY));\n\n  // on some apple nvidia systems this does not work\n  // if (vpos.x < 0.0 || vpos.x > vSize1 ||\n  //     vpos.y < 0.0 || vpos.y > vSize2)\n  // even just\n  // if (vpos.x < 0.0 || vpos.y < 0.0)\n  // fails\n  // so instead we compute a value that represents in and out\n  //and then compute the return using this value\n  float xcheck = max(0.0, vpos.x * (vpos.x - vSize1)); //  0 means in bounds\n  float check = sign(max(xcheck, vpos.y * (vpos.y - vSize2))); //  0 means in bounds, 1 = out\n\n  return mix(\n   vec2(min(tbounds.x, result), max(tbounds.y, result)), // in value\n   tbounds, // out value\n   check);  // 0 in 1 out\n}\n\nvoid main()\n{\n  float scalar;\n  vec4 scalarComps;\n\n  // camera is at 0,0,0 so rayDir for perspective is just the vc coord\n  vec3 rayDir = normalize(vertexVCVSOutput);\n  vec2 tbounds = vec2(100.0*camFar, -1.0);\n\n  // all this is in View Coordinates\n  tbounds = getRayPointIntersectionBounds(vertexVCVSOutput, rayDir,\n    vPlaneNormal0, vPlaneDistance0, tbounds, vPlaneNormal2, vPlaneNormal4,\n    vSize.y, vSize.z);\n  tbounds = getRayPointIntersectionBounds(vertexVCVSOutput, rayDir,\n    vPlaneNormal1, vPlaneDistance1, tbounds, vPlaneNormal2, vPlaneNormal4,\n    vSize.y, vSize.z);\n  tbounds = getRayPointIntersectionBounds(vertexVCVSOutput, rayDir,\n    vPlaneNormal2, vPlaneDistance2, tbounds, vPlaneNormal0, vPlaneNormal4,\n    vSize.x, vSize.z);\n  tbounds = getRayPointIntersectionBounds(vertexVCVSOutput, rayDir,\n    vPlaneNormal3, vPlaneDistance3, tbounds, vPlaneNormal0, vPlaneNormal4,\n    vSize.x, vSize.z);\n  tbounds = getRayPointIntersectionBounds(vertexVCVSOutput, rayDir,\n    vPlaneNormal4, vPlaneDistance4, tbounds, vPlaneNormal0, vPlaneNormal2,\n    vSize.x, vSize.y);\n  tbounds = getRayPointIntersectionBounds(vertexVCVSOutput, rayDir,\n    vPlaneNormal5, vPlaneDistance5, tbounds, vPlaneNormal0, vPlaneNormal2,\n    vSize.x, vSize.y);\n\n  // do not go behind front clipping plane\n  tbounds.x = max(0.0,tbounds.x);\n\n  // do not go PAST far clipping plane\n  float farDist = -camThick/rayDir.z;\n  tbounds.y = min(farDist,tbounds.y);\n\n  // Do not go past the zbuffer value if set\n  // This is used for intermixing opaque geometry\n  //VTK::ZBuffer::Impl\n\n  // do we need to composite?\n  if (tbounds.y > tbounds.x)\n  {\n    // compute starting and ending values in volume space\n    vec3 startVC = vertexVCVSOutput + tbounds.x*rayDir;\n    startVC = startVC - vOriginVC;\n\n    // vpos and endvpos are in VolumeCoords not Index yet\n    vec3 vpos = vec3(\n      dot(startVC, vPlaneNormal0),\n      dot(startVC, vPlaneNormal2),\n      dot(startVC, vPlaneNormal4));\n    vec3 endVC = vertexVCVSOutput + tbounds.y*rayDir;\n    endVC = endVC - vOriginVC;\n    vec3 endvpos = vec3(\n      dot(endVC, vPlaneNormal0),\n      dot(endVC, vPlaneNormal2),\n      dot(endVC, vPlaneNormal4));\n    vec3 vdelta = endvpos - vpos;\n    float numSteps = length(vdelta) / sampleDistance;\n    vdelta = vdelta / numSteps;\n\n    // start slightly inside\n    vpos = vpos + vdelta*0.1;\n    vec4 color = vec4(0.0, 0.0, 0.0, 0.0);\n\n    vec3 ijk = vpos * vVCToIJK;\n    vdelta = vdelta * vVCToIJK;\n    float i = 0.0;\n    while (i < numSteps - 0.2)\n    {\n      // compute the scalar\n      scalar = texture(texture1, ijk).r;\n\n      // now map through opacity and color\n      vec4 tcolor = texture2D(ctexture, vec2(scalar * cscale + cshift, 0.5));\n      tcolor.a = texture2D(otexture, vec2(scalar * oscale + oshift, 0.5)).r;\n\n      // compute the normal if needed\n      //VTK::Normal::Impl\n\n      // handle gradient opacity\n      //VTK::GradientOpacity::Impl\n\n      // handle lighting\n      //VTK::Light::Impl\n\n      float mix = (1.0 - color.a);\n\n      color = color + vec4(tcolor.rgb*tcolor.a, tcolor.a)*mix;\n      if (color.a > 0.99) { color.a = 1.0; break; }\n      ijk += vdelta;\n      i += 1.0;\n    }\n\n    gl_FragData[0] = vec4(color.rgb/color.a, color.a);\n    // gl_FragData[0] = vec4(tbounds.y/farDist, tbounds.x/farDist, color.b/color.a, 1.0);\n  }\n  else\n  {\n    discard;\n  }\n}\n"

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _blueimpMd = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"blueimp-md5\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

var _blueimpMd2 = _interopRequireDefault(_blueimpMd);

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _ShaderProgram = __webpack_require__(8);

var _ShaderProgram2 = _interopRequireDefault(_ShaderProgram);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------------------------------------------------------------

var SET_GET_FIELDS = ['lastShaderBound', 'context'];

// ----------------------------------------------------------------------------
// vtkShaderCache methods
// ----------------------------------------------------------------------------

function vtkShaderCache(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkShaderCache');

  publicAPI.replaceShaderValues = function (VSSource, FSSource, GSSource) {
    // first handle renaming any Fragment shader inputs
    // if we have a geometry shader. By deafult fragment shaders
    // assume their inputs come from a Vertex Shader. When we
    // have a Geometry shader we rename the frament shader inputs
    // to come from the geometry shader

    model.context.getExtension('OES_standard_derivatives');
    var nFSSource = FSSource;
    if (GSSource.length > 0) {
      nFSSource = _ShaderProgram2.default.substitute(nFSSource, 'VSOut', 'GSOut').result;
    }

    var fragDepthString = '\n';
    if (model.context.getExtension('EXT_frag_depth')) {
      fragDepthString = '#extension GL_EXT_frag_depth : enable\n';
    }

    var gl2 = model.context.getParameter(model.context.VERSION).indexOf('WebGL 2.0') !== -1;

    var version = '#version 100\n';
    if (gl2) {
      version = '#version 300 es\n' + '#define attribute in\n' + '#define textureCube texture\n' + '#define texture2D texture\n';
    }

    nFSSource = _ShaderProgram2.default.substitute(nFSSource, '//VTK::System::Dec', [version + '\n', gl2 ? '' : '#extension GL_OES_standard_derivatives : enable\n', fragDepthString, '#ifdef GL_FRAGMENT_PRECISION_HIGH', 'precision highp float;', 'precision highp int;', '#else', 'precision mediump float;', 'precision mediump int;', '#endif']).result;

    var nVSSource = _ShaderProgram2.default.substitute(VSSource, '//VTK::System::Dec', [version + '\n', '#ifdef GL_FRAGMENT_PRECISION_HIGH', 'precision highp float;', 'precision highp int;', '#else', 'precision mediump float;', 'precision mediump int;', '#endif']).result;

    if (gl2) {
      nVSSource = _ShaderProgram2.default.substitute(nVSSource, 'varying', 'out').result;
      nFSSource = _ShaderProgram2.default.substitute(nFSSource, 'varying', 'in').result;
      nFSSource = _ShaderProgram2.default.substitute(nFSSource, 'gl_FragData\\[0\\]', 'fragOutput0').result;
      nFSSource = _ShaderProgram2.default.substitute(nFSSource, '//VTK::Output::Dec', 'layout(location = 0) out vec4 fragOutput0;').result;
    }

    // nFSSource = ShaderProgram.substitute(nFSSource, 'gl_FragData\\[0\\]',
    //   'gl_FragColor').result;

    var nGSSource = _ShaderProgram2.default.substitute(GSSource, '//VTK::System::Dec', version).result;

    return { VSSource: nVSSource, FSSource: nFSSource, GSSource: nGSSource };
  };

  // return NULL if there is an issue
  publicAPI.readyShaderProgramArray = function (vertexCode, fragmentCode, geometryCode) {
    var data = publicAPI.replaceShaderValues(vertexCode, fragmentCode, geometryCode);

    var shader = publicAPI.getShaderProgram(data.VSSource, data.FSSource, data.GSSource);

    return publicAPI.readyShaderProgram(shader);
  };

  publicAPI.readyShaderProgram = function (shader) {
    if (!shader) {
      return null;
    }

    // compile if needed
    if (!shader.getCompiled() && !shader.compileShader()) {
      return null;
    }

    // bind if needed
    if (!publicAPI.bindShader(shader)) {
      return null;
    }

    return shader;
  };

  publicAPI.getShaderProgram = function (vertexCode, fragmentCode, geometryCode) {
    // compute the MD5 and the check the map
    var hashInput = '' + vertexCode + fragmentCode + geometryCode;
    var result = (0, _blueimpMd2.default)(hashInput);

    // does it already exist?
    var loc = Object.keys(model.shaderPrograms).indexOf(result);

    if (loc === -1) {
      // create one
      var sps = _ShaderProgram2.default.newInstance();
      sps.setContext(model.context);
      sps.getVertexShader().setSource(vertexCode);
      sps.getFragmentShader().setSource(fragmentCode);
      if (geometryCode) {
        sps.getGeometryShader().setSource(geometryCode);
      }
      sps.setMd5Hash(result);
      model.shaderPrograms[result] = sps;
      return sps;
    }

    return model.shaderPrograms[result];
  };

  publicAPI.releaseGraphicsResources = function (win) {
    // NOTE:
    // In the current implementation as of October 26th, if a shader
    // program is created by ShaderCache then it should make sure
    // that it releases the graphics resouces used by these programs.
    // It is not wisely for callers to do that since then they would
    // have to loop over all the programs were in use and invoke
    // release graphics resources individually.

    publicAPI.releaseCurrentShader();

    Object.keys(model.shaderPrograms).map(function (key) {
      return model.shaderPrograms[key];
    }).forEach(function (sp) {
      return sp.releaseGraphicsResources(win);
    });
  };

  publicAPI.releaseGraphicsResources = function () {
    // release prior shader
    if (model.astShaderBound) {
      model.lastShaderBound.release();
      model.lastShaderBound = null;
    }
  };

  publicAPI.bindShader = function (shader) {
    if (model.lastShaderBound === shader) {
      return 1;
    }

    // release prior shader
    if (model.lastShaderBound) {
      model.lastShaderBound.release();
    }
    shader.bind();
    model.lastShaderBound = shader;
    return 1;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  lastShaderBound: null,
  shaderPrograms: null,
  context: null
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Internal objects
  model.shaderPrograms = {};

  // Build VTK API
  _macro2.default.obj(publicAPI, model);
  _macro2.default.setGet(publicAPI, model, SET_GET_FIELDS);

  // Object methods
  vtkShaderCache(publicAPI, model);

  return Object.freeze(publicAPI);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkShaderCache');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vtkErrorMacro = _macro2.default.vtkErrorMacro;

// ----------------------------------------------------------------------------
// vtkOpenGLTextureUnitManager methods
// ----------------------------------------------------------------------------

function vtkOpenGLTextureUnitManager(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkOpenGLTextureUnitManager');

  // ----------------------------------------------------------------------------
  // Description:
  // Delete the allocation table and check if it is not called before
  // all the texture units have been released.
  publicAPI.deleteTable = function () {
    for (var i = 0; i < model.numberOfTextureUnits; ++i) {
      if (model.textureUnits[i] === true) {
        vtkErrorMacro('some texture units  were not properly released');
      }
    }
    model.textureUnits = [];
    model.numberOfTextureUnits = 0;
  };

  // ----------------------------------------------------------------------------
  publicAPI.setContext = function (ctx) {
    if (model.context !== ctx) {
      if (model.context !== 0) {
        publicAPI.deleteTable();
      }
      model.context = ctx;
      if (model.context) {
        model.numberOfTextureUnits = ctx.getParameter(ctx.MAX_TEXTURE_IMAGE_UNITS);
        for (var i = 0; i < model.numberOfTextureUnits; ++i) {
          model.textureUnits[i] = false;
        }
      }
      publicAPI.modified();
    }
  };

  // ----------------------------------------------------------------------------
  // Description:
  // Reserve a texture unit. It returns its number.
  // It returns -1 if the allocation failed (because there are no more
  // texture units left).
  // \post valid_result: result==-1 || result>=0 && result<this->GetNumberOfTextureUnits())
  // \post allocated: result==-1 || this->IsAllocated(result)
  publicAPI.allocate = function () {
    for (var i = 0; i < model.numberOfTextureUnits; i++) {
      if (!publicAPI.isAllocated(i)) {
        model.textureUnits[i] = true;
        return i;
      }
    }
    return -1;
  };

  publicAPI.allocateUnit = function (unit) {
    if (publicAPI.isAllocated(unit)) {
      return -1;
    }

    model.textureUnits[unit] = true;
    return unit;
  };

  // ----------------------------------------------------------------------------
  // Description:
  // Tell if texture unit `textureUnitId' is already allocated.
  // \pre valid_id_range : textureUnitId>=0 && textureUnitId<this->GetNumberOfTextureUnits()
  publicAPI.isAllocated = function (textureUnitId) {
    return model.textureUnits[textureUnitId];
  };

  // ----------------------------------------------------------------------------
  // Description:
  // Release a texture unit.
  // \pre valid_id: textureUnitId>=0 && textureUnitId<this->GetNumberOfTextureUnits()
  // \pre allocated_id: this->IsAllocated(textureUnitId)
  publicAPI.free = function (val) {
    model.textureUnits[val] = false;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  context: null,
  numberOfTextureUnits: 0,
  textureUnits: 0
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  _macro2.default.obj(publicAPI, model);

  model.textureUnits = [];

  // Build VTK API
  _macro2.default.get(publicAPI, model, ['numberOfTextureUnits']);

  _macro2.default.setGet(publicAPI, model, ['context']);

  // Object methods
  vtkOpenGLTextureUnitManager(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkOpenGLTextureUnitManager');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _glMatrix = __webpack_require__(2);

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _Camera = __webpack_require__(85);

var _Camera2 = _interopRequireDefault(_Camera);

var _Light = __webpack_require__(86);

var _Light2 = _interopRequireDefault(_Light);

var _Math = __webpack_require__(1);

var _Math2 = _interopRequireDefault(_Math);

var _Viewport = __webpack_require__(87);

var _Viewport2 = _interopRequireDefault(_Viewport);

var _BoundingBox = __webpack_require__(32);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vtkDebugMacro = _macro2.default.vtkDebugMacro,
    vtkErrorMacro = _macro2.default.vtkErrorMacro,
    vtkWarningMacro = _macro2.default.vtkWarningMacro;


function notImplemented(method) {
  return function () {
    return vtkErrorMacro('vtkRenderer::' + method + ' - NOT IMPLEMENTED');
  };
}

// ----------------------------------------------------------------------------
// vtkRenderer methods
// ----------------------------------------------------------------------------

function vtkRenderer(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkRenderer');
  // make sure background has 4 entries. Default to opaque black
  if (!model.background) model.background = [0, 0, 0, 1];
  while (model.background.length < 3) {
    model.background.push(0);
  }if (model.background.length === 3) model.background.push(1);

  publicAPI.updateCamera = function () {
    if (!model.activeCamera) {
      vtkDebugMacro('No cameras are on, creating one.');
      // the get method will automagically create a camera
      // and reset it since one hasn't been specified yet.
      // If is very unlikely that this can occur - if this
      // renderer is part of a vtkRenderWindow, the camera
      // will already have been created as part of the
      // DoStereoRender() method.
      publicAPI.getActiveCameraAndResetIfCreated();
    }

    // update the viewing transformation
    model.activeCamera.render(publicAPI);

    return true;
  };

  publicAPI.updateLightsGeometryToFollowCamera = function () {
    // only update the light's geometry if this Renderer is tracking
    // this lights.  That allows one renderer to view the lights that
    // another renderer is setting up.
    var camera = publicAPI.getActiveCameraAndResetIfCreated();
    var lightMatrix = camera.getCameraLightTransformMatrix();

    model.lights.forEach(function (light) {
      if (light.lightTypeIsSceneLight()) {
        // Do nothing. Don't reset the transform matrix because applications
        // may have set a custom matrix. Only reset the transform matrix in
        // vtkLight::SetLightTypeToSceneLight()
      } else if (light.lightTypeIsHeadLight()) {
        // update position and orientation of light to match camera.
        light.setPosition(camera.getPosition());
        light.setFocalPoint(camera.getFocalPoint());
      } else if (light.lightTypeIsCameraLight()) {
        light.setTransformMatrix(lightMatrix);
      } else {
        vtkErrorMacro('light has unknown light type', light);
      }
    });
  };

  publicAPI.updateLightGeometry = function () {
    if (model.lightFollowCamera) {
      // only update the light's geometry if this Renderer is tracking
      // this lights.  That allows one renderer to view the lights that
      // another renderer is setting up.
      return publicAPI.updateLightsGeometryToFollowCamera();
    }
    return true;
  };

  publicAPI.allocateTime = notImplemented('allocateTime');
  publicAPI.updateGeometry = notImplemented('updateGeometry');

  publicAPI.getVTKWindow = function () {
    return model.renderWindow;
  };

  publicAPI.setLayer = function (layer) {
    vtkDebugMacro(publicAPI.getClassName(), publicAPI, 'setting Layer to ', layer);
    if (model.layer !== layer) {
      model.layer = layer;
      publicAPI.modified();
    }
    publicAPI.setPreserveColorBuffer(!!layer);
  };

  publicAPI.setActiveCamera = function (camera) {
    if (model.activeCamera === camera) {
      return false;
    }

    model.activeCamera = camera;
    publicAPI.modified();
    publicAPI.invokeEvent({ type: 'ActiveCameraEvent', camera: camera });
    return true;
  };

  publicAPI.makeCamera = function () {
    var camera = _Camera2.default.newInstance();
    publicAPI.invokeEvent({ type: 'CreateCameraEvent', camera: camera });
    return camera;
  };

  // Replace the set/get macro method
  publicAPI.getActiveCamera = function () {
    if (!model.activeCamera) {
      model.activeCamera = publicAPI.makeCamera();
    }

    return model.activeCamera;
  };

  publicAPI.getActiveCameraAndResetIfCreated = function () {
    if (!model.activeCamera) {
      publicAPI.getActiveCamera();
      publicAPI.resetCamera();
    }

    return model.activeCamera;
  };

  publicAPI.addActor = publicAPI.addViewProp;
  publicAPI.addVolume = publicAPI.addViewProp;

  publicAPI.removeActor = function (actor) {
    model.actors = model.actors.filter(function (a) {
      return a !== actor;
    });
    publicAPI.removeViewProp(actor);
  };

  publicAPI.removeVolume = function (volume) {
    model.volumes = model.volumes.filter(function (v) {
      return v !== volume;
    });
    publicAPI.removeViewProp(volume);
  };

  publicAPI.addLight = function (light) {
    model.lights = [].concat(model.lights, light);
    publicAPI.modified();
  };

  publicAPI.getActors = function () {
    model.actors = [];
    model.props.forEach(function (prop) {
      model.actors = model.actors.concat(prop.getActors());
    });
    return model.actors;
  };

  publicAPI.getVolumes = function () {
    model.volumes = [];
    model.props.forEach(function (prop) {
      model.volumes = model.volumes.concat(prop.getVolumes());
    });
    return model.volumes;
  };

  publicAPI.removeLight = function (light) {
    model.lights = model.lights.filter(function (l) {
      return l !== light;
    });
    publicAPI.modified();
  };

  publicAPI.removeAllLights = function () {
    model.lights = [];
  };

  // FIXME
  publicAPI.addCuller = notImplemented('addCuller');
  publicAPI.removeCuller = notImplemented('removeCuller');

  publicAPI.setLightCollection = function (lights) {
    model.lights = lights;
    publicAPI.modified();
  };

  publicAPI.makeLight = _Light2.default.newInstance;

  publicAPI.createLight = function () {
    if (!model.automaticLightCreation) {
      return;
    }

    if (model.createdLight) {
      publicAPI.removeLight(model.createdLight);
      model.createdLight.delete();
      model.createdLight = null;
    }

    model.createdLight = publicAPI.makeLight();
    publicAPI.addLight(model.createdLight);

    model.createdLight.setLightTypeToHeadLight();

    // set these values just to have a good default should LightFollowCamera
    // be turned off.
    model.createdLight.setPosition(publicAPI.getActiveCamera().getPosition());
    model.createdLight.setFocalPoint(publicAPI.getActiveCamera().getFocalPoint());
  };

  // requires the aspect ratio of the viewport as X/Y
  publicAPI.normalizedDisplayToWorld = function (x, y, z, aspect) {
    var vpd = publicAPI.normalizedDisplayToView(x, y, z);

    return publicAPI.viewToWorld(vpd[0], vpd[1], vpd[2], aspect);
  };

  // requires the aspect ratio of the viewport as X/Y
  publicAPI.worldToNormalizedDisplay = function (x, y, z, aspect) {
    var vpd = publicAPI.worldToView(x, y, z);

    return publicAPI.viewToNormalizedDisplay(vpd[0], vpd[1], vpd[2], aspect);
  };

  // requires the aspect ratio of the viewport as X/Y
  publicAPI.viewToWorld = function (x, y, z, aspect) {
    if (model.activeCamera === null) {
      vtkErrorMacro('ViewToWorld: no active camera, cannot compute view to world, returning 0,0,0');
      return [0, 0, 0];
    }

    // get the perspective transformation from the active camera
    var matrix = model.activeCamera.getCompositeProjectionTransformMatrix(aspect, -1.0, 1.0);

    _glMatrix.mat4.invert(matrix, matrix);
    _glMatrix.mat4.transpose(matrix, matrix);

    // Transform point to world coordinates
    var result = _glMatrix.vec3.fromValues(x, y, z);
    _glMatrix.vec3.transformMat4(result, result, matrix);
    return [result[0], result[1], result[2]];
  };

  // Convert world point coordinates to view coordinates.
  // requires the aspect ratio of the viewport as X/Y
  publicAPI.worldToView = function (x, y, z, aspect) {
    if (model.activeCamera === null) {
      vtkErrorMacro('ViewToWorld: no active camera, cannot compute view to world, returning 0,0,0');
      return [0, 0, 0];
    }

    // get the perspective transformation from the active camera
    var matrix = model.activeCamera.getCompositeProjectionTransformMatrix(aspect, -1.0, 1.0);
    _glMatrix.mat4.transpose(matrix, matrix);

    var result = _glMatrix.vec3.fromValues(x, y, z);
    _glMatrix.vec3.transformMat4(result, result, matrix);
    return [result[0], result[1], result[2]];
  };

  publicAPI.computeVisiblePropBounds = function () {
    var allBounds = [].concat(_BoundingBox.INIT_BOUNDS);
    var nothingVisible = true;

    publicAPI.invokeEvent({ type: 'ComputeVisiblePropBoundsEvent', renderer: publicAPI });

    // loop through all props
    model.props.filter(function (prop) {
      return prop.getVisibility() && prop.getUseBounds();
    }).forEach(function (prop) {
      var bounds = prop.getBounds();
      if (bounds && _Math2.default.areBoundsInitialized(bounds)) {
        nothingVisible = false;

        if (bounds[0] < allBounds[0]) {
          allBounds[0] = bounds[0];
        }
        if (bounds[1] > allBounds[1]) {
          allBounds[1] = bounds[1];
        }
        if (bounds[2] < allBounds[2]) {
          allBounds[2] = bounds[2];
        }
        if (bounds[3] > allBounds[3]) {
          allBounds[3] = bounds[3];
        }
        if (bounds[4] < allBounds[4]) {
          allBounds[4] = bounds[4];
        }
        if (bounds[5] > allBounds[5]) {
          allBounds[5] = bounds[5];
        }
      }
    });

    if (nothingVisible) {
      _Math2.default.uninitializeBounds(allBounds);
      vtkDebugMacro('Can\'t compute bounds, no 3D props are visible');
    }

    return allBounds;
  };

  publicAPI.resetCamera = function () {
    var bounds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    var boundsToUse = bounds || publicAPI.computeVisiblePropBounds();
    var center = [0, 0, 0];

    if (!_Math2.default.areBoundsInitialized(boundsToUse)) {
      vtkDebugMacro('Cannot reset camera!');
      return false;
    }

    var vn = null;

    if (publicAPI.getActiveCamera()) {
      vn = model.activeCamera.getViewPlaneNormal();
    } else {
      vtkErrorMacro('Trying to reset non-existant camera');
      return false;
    }

    // Reset the perspective zoom factors, otherwise subsequent zooms will cause
    // the view angle to become very small and cause bad depth sorting.
    model.activeCamera.setViewAngle(30.0);

    center[0] = (boundsToUse[0] + boundsToUse[1]) / 2.0;
    center[1] = (boundsToUse[2] + boundsToUse[3]) / 2.0;
    center[2] = (boundsToUse[4] + boundsToUse[5]) / 2.0;

    var w1 = boundsToUse[1] - boundsToUse[0];
    var w2 = boundsToUse[3] - boundsToUse[2];
    var w3 = boundsToUse[5] - boundsToUse[4];
    w1 *= w1;
    w2 *= w2;
    w3 *= w3;
    var radius = w1 + w2 + w3;

    // If we have just a single point, pick a radius of 1.0
    radius = radius === 0 ? 1.0 : radius;

    // compute the radius of the enclosing sphere
    radius = Math.sqrt(radius) * 0.5;

    // default so that the bounding sphere fits within the view fustrum

    // compute the distance from the intersection of the view frustum with the
    // bounding sphere. Basically in 2D draw a circle representing the bounding
    // sphere in 2D then draw a horizontal line going out from the center of
    // the circle. That is the camera view. Then draw a line from the camera
    // position to the point where it intersects the circle. (it will be tangent
    // to the circle at this point, this is important, only go to the tangent
    // point, do not draw all the way to the view plane). Then draw the radius
    // from the tangent point to the center of the circle. You will note that
    // this forms a right triangle with one side being the radius, another being
    // the target distance for the camera, then just find the target dist using
    // a sin.
    var angle = _Math2.default.radiansFromDegrees(model.activeCamera.getViewAngle());
    var parallelScale = radius;
    var distance = radius / Math.sin(angle * 0.5);

    // check view-up vector against view plane normal
    var vup = model.activeCamera.getViewUp();
    if (Math.abs(_Math2.default.dot(vup, vn)) > 0.999) {
      vtkWarningMacro('Resetting view-up since view plane normal is parallel');
      model.activeCamera.setViewUp(-vup[2], vup[0], vup[1]);
    }

    // update the camera
    model.activeCamera.setFocalPoint(center[0], center[1], center[2]);
    model.activeCamera.setPosition(center[0] + distance * vn[0], center[1] + distance * vn[1], center[2] + distance * vn[2]);

    publicAPI.resetCameraClippingRange(boundsToUse);

    // setup default parallel scale
    model.activeCamera.setParallelScale(parallelScale);

    // Here to let parallel/distributed compositing intercept
    // and do the right thing.
    publicAPI.invokeEvent({ type: 'ResetCameraEvent', renderer: publicAPI });

    return true;
  };

  publicAPI.resetCameraClippingRange = function () {
    var bounds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    var boundsToUse = bounds || publicAPI.computeVisiblePropBounds();

    if (!_Math2.default.areBoundsInitialized(boundsToUse)) {
      vtkDebugMacro('Cannot reset camera clipping range!');
      return false;
    }

    // Make sure we have an active camera
    publicAPI.getActiveCameraAndResetIfCreated();
    if (!model.activeCamera) {
      vtkErrorMacro('Trying to reset clipping range of non-existant camera');
      return false;
    }

    var vn = null;var position = null;
    vn = model.activeCamera.getViewPlaneNormal();
    position = model.activeCamera.getPosition();

    var a = -vn[0];
    var b = -vn[1];
    var c = -vn[2];
    var d = -(a * position[0] + b * position[1] + c * position[2]);

    // Set the max near clipping plane and the min far clipping plane
    var range = [a * boundsToUse[0] + b * boundsToUse[2] + c * boundsToUse[4] + d, 1e-18];

    // Find the closest / farthest bounding box vertex
    for (var k = 0; k < 2; k++) {
      for (var j = 0; j < 2; j++) {
        for (var i = 0; i < 2; i++) {
          var dist = a * boundsToUse[i] + b * boundsToUse[2 + j] + c * boundsToUse[4 + k] + d;
          range[0] = dist < range[0] ? dist : range[0];
          range[1] = dist > range[1] ? dist : range[1];
        }
      }
    }

    // do not let far - near be less than 0.1 of the window height
    // this is for cases such as 2D images which may have zero range
    var minGap = 0.0;
    if (model.activeCamera.getParallelProjection()) {
      minGap = 0.1 * model.activeCamera.getParallelScale();
    } else {
      var angle = _Math2.default.radiansFromDegrees(model.activeCamera.getViewAngle());
      minGap = 0.2 * Math.tan(angle / 2.0) * range[1];
    }

    if (range[1] - range[0] < minGap) {
      minGap = minGap - range[1] + range[0];
      range[1] += minGap / 2.0;
      range[0] -= minGap / 2.0;
    }

    // Do not let the range behind the camera throw off the calculation.
    if (range[0] < 0.0) {
      range[0] = 0.0;
    }

    // Give ourselves a little breathing room
    range[0] = 0.99 * range[0] - (range[1] - range[0]) * model.clippingRangeExpansion;
    range[1] = 1.01 * range[1] + (range[1] - range[0]) * model.clippingRangeExpansion;

    // Make sure near is not bigger than far
    range[0] = range[0] >= range[1] ? 0.01 * range[1] : range[0];

    // Make sure near is at least some fraction of far - this prevents near
    // from being behind the camera or too close in front. How close is too
    // close depends on the resolution of the depth buffer
    if (!model.nearClippingPlaneTolerance) {
      model.nearClippingPlaneTolerance = 0.01;
    }

    // make sure the front clipping range is not too far from the far clippnig
    // range, this is to make sure that the zbuffer resolution is effectively
    // used
    if (range[0] < model.nearClippingPlaneTolerance * range[1]) {
      range[0] = model.nearClippingPlaneTolerance * range[1];
    }
    model.activeCamera.setClippingRange(range[0], range[1]);

    // Here to let parallel/distributed compositing intercept
    // and do the right thing.
    publicAPI.invokeEvent({ type: 'ResetCameraClippingRangeEvent', renderer: publicAPI });
    return false;
  };

  publicAPI.setRenderWindow = function (renderWindow) {
    if (renderWindow !== model.renderWindow) {
      model.vtkWindow = renderWindow;
      model.renderWindow = renderWindow;
    }
  };

  publicAPI.visibleActorCount = function () {
    return model.props.filter(function (prop) {
      return prop.getVisibility();
    }).length;
  };
  publicAPI.visibleVolumeCount = publicAPI.visibleActorCount;

  publicAPI.getMTime = function () {
    return Math.max(model.mtime, model.activeCamera ? model.activeCamera.getMTime() : 0, model.createdLight ? model.createdLight.getMTime() : 0);
  };

  // FIXME
  publicAPI.pickProp = notImplemented('pickProp');
  publicAPI.pickRender = notImplemented('PickRender');
  publicAPI.pickGeometry = notImplemented('PickGeometry');

  // ExpandBounds => global

  publicAPI.getTransparent = function () {
    return !!model.preserveColorBuffer;
  };

  // FIXME
  publicAPI.getTiledAspectRatio = notImplemented('GetTiledAspectRatio');

  publicAPI.isActiveCameraCreated = function () {
    return !!model.activeCamera;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  pickedProp: null,
  activeCamera: null,

  ambient: [1, 1, 1],

  allocatedRenderTime: 100,
  timeFactor: 1,

  createdLight: null,
  automaticLightCreation: true,

  twoSidedLighting: true,
  lastRenderTimeInSeconds: -1,

  renderWindow: null,
  lights: [],
  actors: [],
  volumes: [],

  lightFollowCamera: true,

  numberOfPropsRendered: 0,

  propArray: null,

  pathArray: null,

  layer: 1,
  preserveColorBuffer: false,
  preserveDepthBuffer: false,

  computeVisiblePropBounds: _Math2.default.createUninitializedBounds(),

  interactive: true,

  nearClippingPlaneTolerance: 0,
  clippingRangeExpansion: 0.05,

  erase: true,
  draw: true,

  useShadows: false,

  useDepthPeeling: false,
  occlusionRatio: 0,
  maximumNumberOfPeels: 4,

  selector: null,
  delegate: null,

  texturedBackground: false,
  backgroundTexture: null,

  pass: 0
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  _Viewport2.default.extend(publicAPI, model, initialValues);

  // Build VTK API
  _macro2.default.get(publicAPI, model, ['renderWindow', 'allocatedRenderTime', 'timeFactor', 'lastRenderTimeInSeconds', 'numberOfPropsRendered', 'lastRenderingUsedDepthPeeling', 'selector']);
  _macro2.default.setGet(publicAPI, model, ['twoSidedLighting', 'lightFollowCamera', 'automaticLightCreation', 'erase', 'draw', 'nearClippingPlaneTolerance', 'clippingRangeExpansion', 'backingStore', 'interactive', 'layer', 'preserveColorBuffer', 'preserveDepthBuffer', 'useDepthPeeling', 'occlusionRatio', 'maximumNumberOfPeels', 'delegate', 'backgroundTexture', 'texturedBackground', 'useShadows', 'pass']);
  _macro2.default.getArray(publicAPI, model, ['actors', 'volumes', 'lights']);
  _macro2.default.setGetArray(publicAPI, model, ['background'], 4, 1.0);

  // Object methods
  vtkRenderer(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkRenderer');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = exports.DEFAULT_VALUES = undefined;
exports.extend = extend;

var _glMatrix = __webpack_require__(2);

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _Math = __webpack_require__(1);

var _Math2 = _interopRequireDefault(_Math);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vtkDebugMacro = _macro2.default.vtkDebugMacro;

/* eslint-disable new-cap */

/*
 * Convenience function to access elements of a gl-matrix.  If it turns
 * out I have rows and columns swapped everywhere, then I'll just change
 * the order of 'row' and 'col' parameters in this function
 */
// function getMatrixElement(matrix, row, col) {
//   const idx = (row * 4) + col;
//   return matrix[idx];
// }

// ----------------------------------------------------------------------------
// vtkCamera methods
// ----------------------------------------------------------------------------

function vtkCamera(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkCamera');

  // Set up private variables and methods
  var viewMatrix = _glMatrix.mat4.create();
  var projectionMatrix = _glMatrix.mat4.create();

  publicAPI.orthogonalizeViewUp = function () {
    var vt = publicAPI.getViewTransformMatrix();
    model.viewUp[0] = vt[4];
    model.viewUp[1] = vt[5];
    model.viewUp[2] = vt[6];

    publicAPI.modified();
  };

  publicAPI.setPosition = function (x, y, z) {
    if (x === model.position[0] && y === model.position[1] && z === model.position[2]) {
      return;
    }

    model.position[0] = x;
    model.position[1] = y;
    model.position[2] = z;

    // recompute the focal distance
    publicAPI.computeDistance();
    // publicAPI.computeCameraLightTransform();

    publicAPI.modified();
  };

  publicAPI.setFocalPoint = function (x, y, z) {
    if (x === model.focalPoint[0] && y === model.focalPoint[1] && z === model.focalPoint[2]) {
      return;
    }

    model.focalPoint[0] = x;
    model.focalPoint[1] = y;
    model.focalPoint[2] = z;

    // recompute the focal distance
    publicAPI.computeDistance();
    // publicAPI.computeCameraLightTransform();

    publicAPI.modified();
  };

  publicAPI.setDistance = function (d) {
    if (model.distance === d) {
      return;
    }

    model.distance = d;

    if (model.distance < 1e-20) {
      model.distance = 1e-20;
      vtkDebugMacro('Distance is set to minimum.');
    }

    // we want to keep the camera pointing in the same direction
    var vec = model.directionOfProjection;

    // recalculate FocalPoint
    model.focalPoint[0] = model.position[0] + vec[0] * model.distance;
    model.focalPoint[1] = model.position[1] + vec[1] * model.distance;
    model.focalPoint[2] = model.position[2] + vec[2] * model.distance;

    publicAPI.modified();
  };

  //----------------------------------------------------------------------------
  // This method must be called when the focal point or camera position changes
  publicAPI.computeDistance = function () {
    var dx = model.focalPoint[0] - model.position[0];
    var dy = model.focalPoint[1] - model.position[1];
    var dz = model.focalPoint[2] - model.position[2];

    model.distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (model.distance < 1e-20) {
      model.distance = 1e-20;
      vtkDebugMacro('Distance is set to minimum.');

      var vec = model.directionOfProjection;

      // recalculate FocalPoint
      model.focalPoint[0] = model.position[0] + vec[0] * model.distance;
      model.focalPoint[1] = model.position[1] + vec[1] * model.distance;
      model.focalPoint[2] = model.position[2] + vec[2] * model.distance;
    }

    model.directionOfProjection[0] = dx / model.distance;
    model.directionOfProjection[1] = dy / model.distance;
    model.directionOfProjection[2] = dz / model.distance;

    publicAPI.computeViewPlaneNormal();
  };

  //----------------------------------------------------------------------------
  publicAPI.computeViewPlaneNormal = function () {
    // VPN is -DOP
    model.viewPlaneNormal[0] = -model.directionOfProjection[0];
    model.viewPlaneNormal[1] = -model.directionOfProjection[1];
    model.viewPlaneNormal[2] = -model.directionOfProjection[2];
  };

  //----------------------------------------------------------------------------
  // Move the position of the camera along the view plane normal. Moving
  // towards the focal point (e.g., > 1) is a dolly-in, moving away
  // from the focal point (e.g., < 1) is a dolly-out.
  publicAPI.dolly = function (amount) {
    if (amount <= 0.0) {
      return;
    }

    // dolly moves the camera towards the focus
    var d = model.distance / amount;

    publicAPI.setPosition(model.focalPoint[0] - d * model.directionOfProjection[0], model.focalPoint[1] - d * model.directionOfProjection[1], model.focalPoint[2] - d * model.directionOfProjection[2]);
  };

  publicAPI.setRoll = function (roll) {};

  publicAPI.getRoll = function () {};

  publicAPI.roll = function (angle) {
    var eye = model.position;
    var at = model.focalPoint;
    var up = model.viewUp;
    var viewUpVec4 = _glMatrix.vec4.fromValues(up[0], up[1], up[2], 0.0);

    var rotateMatrix = _glMatrix.mat4.create(); // FIXME: don't create a new one each time?
    var viewDir = _glMatrix.vec3.fromValues(at[0] - eye[0], at[1] - eye[1], at[2] - eye[2]);
    _glMatrix.mat4.rotate(rotateMatrix, rotateMatrix, _Math2.default.radiansFromDegrees(angle), viewDir);
    _glMatrix.vec4.transformMat4(viewUpVec4, viewUpVec4, rotateMatrix);

    model.viewUp[0] = viewUpVec4[0];
    model.viewUp[1] = viewUpVec4[1];
    model.viewUp[2] = viewUpVec4[2];

    publicAPI.modified();
  };

  publicAPI.azimuth = function (angle) {
    var newPosition = _glMatrix.vec3.create();
    var fp = model.focalPoint;

    var trans = _glMatrix.mat4.create();
    _glMatrix.mat4.identity(trans);

    // translate the focal point to the origin,
    // rotate about view up,
    // translate back again
    _glMatrix.mat4.translate(trans, trans, _glMatrix.vec3.fromValues(fp[0], fp[1], fp[2]));
    _glMatrix.mat4.rotate(trans, trans, _Math2.default.radiansFromDegrees(angle), _glMatrix.vec3.fromValues(model.viewUp[0], model.viewUp[1], model.viewUp[2]));
    _glMatrix.mat4.translate(trans, trans, _glMatrix.vec3.fromValues(-fp[0], -fp[1], -fp[2]));

    // apply the transform to the position
    _glMatrix.vec3.transformMat4(newPosition, _glMatrix.vec3.fromValues(model.position[0], model.position[1], model.position[2]), trans);
    publicAPI.setPosition(newPosition[0], newPosition[1], newPosition[2]);
  };

  publicAPI.yaw = function (angle) {
    var newFocalPoint = _glMatrix.vec3.create();
    var position = model.position;

    var trans = _glMatrix.mat4.create();
    _glMatrix.mat4.identity(trans);

    // translate the camera to the origin,
    // rotate about axis,
    // translate back again
    _glMatrix.mat4.translate(trans, trans, _glMatrix.vec3.fromValues(position[0], position[1], position[2]));
    _glMatrix.mat4.rotate(trans, trans, _Math2.default.radiansFromDegrees(angle), _glMatrix.vec3.fromValues(model.viewUp[0], model.viewUp[1], model.viewUp[2]));
    _glMatrix.mat4.translate(trans, trans, _glMatrix.vec3.fromValues(-position[0], -position[1], -position[2]));

    // apply the transform to the position
    _glMatrix.vec3.transformMat4(newFocalPoint, _glMatrix.vec3.fromValues(model.focalPoint[0], model.focalPoint[1], model.focalPoint[2]), trans);
    publicAPI.setFocalPoint(newFocalPoint[0], newFocalPoint[1], newFocalPoint[2]);
  };

  publicAPI.elevation = function (angle) {
    var newPosition = _glMatrix.vec3.create();
    var fp = model.focalPoint;

    var vt = publicAPI.getViewTransformMatrix();
    var axis = [-vt[0], -vt[1], -vt[2]];

    var trans = _glMatrix.mat4.create();
    _glMatrix.mat4.identity(trans);

    // translate the focal point to the origin,
    // rotate about view up,
    // translate back again
    _glMatrix.mat4.translate(trans, trans, _glMatrix.vec3.fromValues(fp[0], fp[1], fp[2]));
    _glMatrix.mat4.rotate(trans, trans, _Math2.default.radiansFromDegrees(angle), _glMatrix.vec3.fromValues(axis[0], axis[1], axis[2]));
    _glMatrix.mat4.translate(trans, trans, _glMatrix.vec3.fromValues(-fp[0], -fp[1], -fp[2]));

    // apply the transform to the position
    _glMatrix.vec3.transformMat4(newPosition, _glMatrix.vec3.fromValues(model.position[0], model.position[1], model.position[2]), trans);
    publicAPI.setPosition(newPosition[0], newPosition[1], newPosition[2]);
  };

  publicAPI.pitch = function (angle) {
    var newFocalPoint = _glMatrix.vec3.create();
    var position = model.position;

    var vt = publicAPI.getViewTransformMatrix();
    var axis = [vt[0], vt[1], vt[2]];

    var trans = _glMatrix.mat4.create();
    _glMatrix.mat4.identity(trans);

    // translate the camera to the origin,
    // rotate about axis,
    // translate back again
    _glMatrix.mat4.translate(trans, trans, _glMatrix.vec3.fromValues(position[0], position[1], position[2]));
    _glMatrix.mat4.rotate(trans, trans, _Math2.default.radiansFromDegrees(angle), _glMatrix.vec3.fromValues(axis[0], axis[1], axis[2]));
    _glMatrix.mat4.translate(trans, trans, _glMatrix.vec3.fromValues(-position[0], -position[1], -position[2]));

    // apply the transform to the position
    _glMatrix.vec3.transformMat4(newFocalPoint, _glMatrix.vec3.fromValues(model.focalPoint[0], model.focalPoint[1], model.focalPoint[2]), trans);
    publicAPI.setFocalPoint(newFocalPoint[0], newFocalPoint[1], newFocalPoint[2]);
  };

  publicAPI.zoom = function (factor) {
    if (factor <= 0) {
      return;
    }
    if (model.parallelProjection) {
      model.parallelScale /= factor;
    } else {
      model.viewAngle /= factor;
    }
    publicAPI.modified();
  };

  publicAPI.setThickness = function (thickness) {};

  publicAPI.setObliqueAngles = function (alpha, beta) {};

  publicAPI.getViewTransformMatrix = function () {
    var eye = model.position;
    var at = model.focalPoint;
    var up = model.viewUp;

    var result = _glMatrix.mat4.create();
    _glMatrix.mat4.lookAt(viewMatrix, _glMatrix.vec3.fromValues(eye[0], eye[1], eye[2]), // eye
    _glMatrix.vec3.fromValues(at[0], at[1], at[2]), // at
    _glMatrix.vec3.fromValues(up[0], up[1], up[2])); // up

    _glMatrix.mat4.transpose(viewMatrix, viewMatrix);
    _glMatrix.mat4.copy(result, viewMatrix);
    return result;
  };

  publicAPI.getProjectionTransformMatrix = function (aspect, nearz, farz) {
    _glMatrix.mat4.identity(projectionMatrix);

    // FIXME: Not sure what to do about adjust z buffer here
    // adjust Z-buffer range
    // this->ProjectionTransform->AdjustZBuffer( -1, +1, nearz, farz );
    var cWidth = model.clippingRange[1] - model.clippingRange[0];
    var cRange = [model.clippingRange[0] + (nearz + 1) * cWidth / 2.0, model.clippingRange[0] + (farz + 1) * cWidth / 2.0];

    if (model.parallelProjection) {
      // set up a rectangular parallelipiped
      var width = model.parallelScale * aspect;
      var height = model.parallelScale;

      var xmin = (model.windowCenter[0] - 1.0) * width;
      var xmax = (model.windowCenter[0] + 1.0) * width;
      var ymin = (model.windowCenter[1] - 1.0) * height;
      var ymax = (model.windowCenter[1] + 1.0) * height;

      // mat4.ortho(out, left, right, bottom, top, near, far)
      _glMatrix.mat4.ortho(projectionMatrix, xmin, xmax, ymin, ymax, nearz, farz);
      _glMatrix.mat4.transpose(projectionMatrix, projectionMatrix);
    } else if (model.useOffAxisProjection) {
      throw new Error('Off-Axis projection is not supported at this time');
    } else {
      var tmp = Math.tan(_Math2.default.radiansFromDegrees(model.viewAngle) / 2.0);
      var _width = void 0;
      var _height = void 0;
      if (model.useHorizontalViewAngle === true) {
        _width = model.clippingRange[0] * tmp;
        _height = model.clippingRange[0] * tmp / aspect;
      } else {
        _width = model.clippingRange[0] * tmp * aspect;
        _height = model.clippingRange[0] * tmp;
      }

      var _xmin = (model.windowCenter[0] - 1.0) * _width;
      var _xmax = (model.windowCenter[0] + 1.0) * _width;
      var _ymin = (model.windowCenter[1] - 1.0) * _height;
      var _ymax = (model.windowCenter[1] + 1.0) * _height;
      var znear = cRange[0];
      var zfar = cRange[1];

      projectionMatrix[0] = 2.0 * znear / (_xmax - _xmin);
      projectionMatrix[5] = 2.0 * znear / (_ymax - _ymin);
      projectionMatrix[2] = (_xmin + _xmax) / (_xmax - _xmin);
      projectionMatrix[6] = (_ymin + _ymax) / (_ymax - _ymin);
      projectionMatrix[10] = -(znear + zfar) / (zfar - znear);
      projectionMatrix[14] = -1.0;
      projectionMatrix[11] = -2.0 * znear * zfar / (zfar - znear);
      projectionMatrix[15] = 0.0;
    }

    var result = _glMatrix.mat4.create();
    _glMatrix.mat4.copy(result, projectionMatrix);

    return result;
  };

  publicAPI.getCompositeProjectionTransformMatrix = function (aspect, nearz, farz) {
    var vMat = publicAPI.getViewTransformMatrix();
    var pMat = publicAPI.getProjectionTransformMatrix(aspect, nearz, farz);
    var result = _glMatrix.mat4.create();
    _glMatrix.mat4.multiply(result, vMat, pMat);
    return result;
  };

  // publicAPI.getProjectionTransformMatrix = renderer => {
  //   // return glmatrix object
  // };

  publicAPI.getFrustumPlanes = function (aspect) {
    // Return array of 24 params (4 params for each of 6 plane equations)
  };

  publicAPI.getOrientation = function () {};

  publicAPI.getOrientationWXYZ = function () {};

  publicAPI.setDirectionOfProjection = function (x, y, z) {
    if (model.directionOfProjection[0] === x && model.directionOfProjection[1] === y && model.directionOfProjection[2] === z) {
      return;
    }

    model.directionOfProjection[0] = x;
    model.directionOfProjection[1] = y;
    model.directionOfProjection[2] = z;

    var vec = model.directionOfProjection;

    // recalculate FocalPoint
    model.focalPoint[0] = model.position[0] + vec[0] * model.distance;
    model.focalPoint[1] = model.position[1] + vec[1] * model.distance;
    model.focalPoint[2] = model.position[2] + vec[2] * model.distance;
    publicAPI.computeViewPlaneNormal();
  };

  // used to handle convert js device orientation angles
  // when you use this method the camera will adjust to the
  // device orientation such that the physicalViewUp you set
  // in world coordinates looks up, and the physicalViewNorth
  // you set in world coorindates will (maybe) point north
  publicAPI.setDeviceAngles = function (alpha, beta, gamma, screen) {
    var rotmat = _glMatrix.mat4.create(); // phone to physical coordinates
    _glMatrix.mat4.rotateZ(rotmat, rotmat, _Math2.default.radiansFromDegrees(alpha));
    _glMatrix.mat4.rotateX(rotmat, rotmat, _Math2.default.radiansFromDegrees(beta));
    _glMatrix.mat4.rotateY(rotmat, rotmat, _Math2.default.radiansFromDegrees(gamma));
    _glMatrix.mat4.rotateZ(rotmat, rotmat, _Math2.default.radiansFromDegrees(-screen));

    var dop = _glMatrix.vec3.fromValues(0.0, 0.0, -1.0);
    var vup = _glMatrix.vec3.fromValues(0.0, 1.0, 0.0);
    var newdop = _glMatrix.vec3.create();
    var newvup = _glMatrix.vec3.create();
    _glMatrix.vec3.transformMat4(newdop, dop, rotmat);
    _glMatrix.vec3.transformMat4(newvup, vup, rotmat);

    // now the physical to vtk world tform
    var physVRight = [3];
    _Math2.default.cross(model.physicalViewNorth, model.physicalViewUp, physVRight);
    var phystoworld = _glMatrix.mat3.create();
    phystoworld[0] = physVRight[0];
    phystoworld[1] = physVRight[1];
    phystoworld[2] = physVRight[2];
    phystoworld[3] = model.physicalViewNorth[0];
    phystoworld[4] = model.physicalViewNorth[1];
    phystoworld[5] = model.physicalViewNorth[2];
    phystoworld[6] = model.physicalViewUp[0];
    phystoworld[7] = model.physicalViewUp[1];
    phystoworld[8] = model.physicalViewUp[2];
    _glMatrix.mat3.transpose(phystoworld, phystoworld);
    _glMatrix.vec3.transformMat3(newdop, newdop, phystoworld);
    _glMatrix.vec3.transformMat3(newvup, newvup, phystoworld);

    publicAPI.setDirectionOfProjection(newdop[0], newdop[1], newdop[2]);
    publicAPI.setViewUp(newvup[0], newvup[1], newvup[2]);
    publicAPI.modified();
  };

  publicAPI.setOrientationWXYZ = function (degrees, x, y, z) {
    var quatMat = _glMatrix.mat4.create();

    if (degrees !== 0.0 && (x !== 0.0 || y !== 0.0 || z !== 0.0)) {
      // convert to radians
      var angle = _Math2.default.radiansFromDegrees(degrees);
      var q = _glMatrix.quat.create();
      _glMatrix.quat.setAxisAngle(q, [x, y, z], angle);
      _glMatrix.quat.toMat4(q, quatMat);
    }

    var dop = _glMatrix.vec3.fromValues(0.0, 0.0, -1.0);
    var newdop = _glMatrix.vec3.create();
    _glMatrix.vec3.transformMat4(newdop, dop, quatMat);

    var vup = _glMatrix.vec3.fromValues(0.0, 1.0, 0.0);
    var newvup = _glMatrix.vec3.create();
    _glMatrix.vec3.transformMat4(newvup, vup, quatMat);

    publicAPI.setDirectionOfProjection(newdop[0], newdop[1], newdop[2]);
    publicAPI.setViewUp(newvup[0], newvup[1], newvup[2]);
    publicAPI.modified();
  };

  publicAPI.getCameraLightTransformMatrix = function () {};

  publicAPI.updateViewport = function () {};

  publicAPI.shallowCopy = function (sourceCamera) {};

  publicAPI.setScissorRect = function (rect) {
    // rect is a vtkRect
  };

  publicAPI.getScissorRect = function () {};
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = exports.DEFAULT_VALUES = {
  position: [0, 0, 1],
  focalPoint: [0, 0, 0],
  viewUp: [0, 1, 0],
  directionOfProjection: [0, 0, -1],
  parallelProjection: false,
  useHorizontalViewAngle: false,
  viewAngle: 30,
  parallelScale: 1,
  clippingRange: [0.01, 1000.01],
  thickness: 1000,
  windowCenter: [0, 0],
  viewPlaneNormal: [0, 0, 1],
  focalDisk: 1,
  useOffAxisProjection: false,
  screenBottomLeft: [-0.5, -0.5, -0.5],
  screenBottomRight: [0.5, -0.5, -0.5],
  screenTopRight: [0.5, 0.5, -0.5],
  userViewTransform: null,
  userTransform: null,
  freezeFocalPoint: false,
  useScissor: false,
  physicalViewUp: [0.0, 1.0, 0.0],
  physicalViewNorth: [0.0, 0.0, -1.0]
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  _macro2.default.obj(publicAPI, model);

  _macro2.default.get(publicAPI, model, ['distance', 'thickness', 'userViewTransform', 'userTransform']);

  _macro2.default.setGet(publicAPI, model, ['parallelProjection', 'useHorizontalViewAngle', 'viewAngle', 'parallelScale', 'focalDisk', 'useOffAxisProjection', 'freezeFocalPoint', 'useScissor']);

  _macro2.default.getArray(publicAPI, model, ['directionOfProjection', 'viewPlaneNormal', 'position', 'focalPoint']);

  _macro2.default.setGetArray(publicAPI, model, ['clippingRange', 'windowCenter'], 2);

  _macro2.default.setGetArray(publicAPI, model, ['viewUp', 'screenBottomLeft', 'screenBottomRight', 'screenTopRight', 'physicalViewUp', 'physicalViewNorth'], 3);

  // Object methods
  vtkCamera(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkCamera');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = exports.LIGHT_TYPES = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _Math = __webpack_require__(1);

var _Math2 = _interopRequireDefault(_Math);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------------------------------------------------------------

var LIGHT_TYPES = exports.LIGHT_TYPES = ['HeadLight', 'CameraLight', 'SceneLight'];

// ----------------------------------------------------------------------------
// vtkLight methods
// ----------------------------------------------------------------------------

function vtkLight(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkLight');

  publicAPI.getTransformedPosition = function () {
    if (model.transformMatrix) {
      return []; // FIXME !!!!
    }
    return [].concat(model.position);
  };

  publicAPI.getTransformedFocalPoint = function () {
    if (model.transformMatrix) {
      return []; // FIXME !!!!
    }
    return [].concat(model.focalPoint);
  };

  publicAPI.getDirection = function () {
    var result = [model.focalPoint[0] - model.position[0], model.focalPoint[1] - model.position[1], model.focalPoint[2] - model.position[2]];
    _Math2.default.normalize(result);
    return result;
  };

  publicAPI.setDirectionAngle = function (elevation, azimuth) {
    var elevationRadians = _Math2.default.radiansFromDegrees(elevation);
    var azimuthRadians = _Math2.default.radiansFromDegrees(azimuth);

    publicAPI.setPosition(Math.cos(elevationRadians) * Math.sin(azimuthRadians), Math.sin(elevationRadians), Math.cos(elevationRadians) * Math.cos(azimuthRadians));

    publicAPI.setFocalPoint(0, 0, 0);
    publicAPI.setPositional(0);
  };

  publicAPI.setLightTypeToHeadLight = function () {
    publicAPI.setLightType('HeadLight');
  };

  publicAPI.setLightTypeToCameraLight = function () {
    publicAPI.setLightType('CameraLight');
  };

  publicAPI.setLightTypeToSceneLight = function () {
    publicAPI.setTransformMatrix(null);
    publicAPI.setLightType('SceneLight');
  };

  publicAPI.lightTypeIsHeadLight = function () {
    return model.lightType === 'HeadLight';
  };

  publicAPI.lightTypeIsSceneLight = function () {
    return model.lightType === 'SceneLight';
  };

  publicAPI.lightTypeIsCameraLight = function () {
    return model.lightType === 'CameraLight';
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  switch: true,
  intensity: 1,
  color: [1, 1, 1],
  position: [0, 0, 1],
  focalPoint: [0, 0, 0],
  positional: false,
  exponent: 1,
  coneAngle: 30,
  attenuationValues: [1, 0, 0],
  transformMatrix: null,
  lightType: 'SceneLight',
  shadowAttenuation: 1
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  _macro2.default.obj(publicAPI, model);
  _macro2.default.setGet(publicAPI, model, ['intensity', 'switch', 'positional', 'exponent', 'coneAngle', 'transformMatrix', 'lightType', 'shadowAttenuation']);
  _macro2.default.setGetArray(publicAPI, model, ['color', 'position', 'focalPoint', 'attenuationValues'], 3);

  // Object methods
  vtkLight(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkLight');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend, LIGHT_TYPES: LIGHT_TYPES };

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vtkErrorMacro = _macro2.default.vtkErrorMacro;


function notImplemented(method) {
  return function () {
    return vtkErrorMacro('vtkViewport::' + method + ' - NOT IMPLEMENTED');
  };
}

// ----------------------------------------------------------------------------
// vtkViewport methods
// ----------------------------------------------------------------------------

function vtkViewport(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkViewport');

  // Public API methods
  publicAPI.getViewProps = function () {
    return model.props;
  };
  publicAPI.hasViewProp = function (prop) {
    return !!model.props.filter(function (item) {
      return item === prop;
    }).length;
  };
  publicAPI.addViewProp = function (prop) {
    if (prop && !publicAPI.hasViewProp(prop)) {
      model.props = model.props.concat(prop);
    }
  };

  publicAPI.removeViewProp = function (prop) {
    var newPropList = model.props.filter(function (item) {
      return item !== prop;
    });
    if (model.props.length !== newPropList.length) {
      model.props = newPropList;
    }
  };

  publicAPI.removeAllViewProps = function () {
    model.props = [];
  };

  publicAPI.addActor2D = publicAPI.addViewProp;
  publicAPI.removeActor2D = function (prop) {
    // VTK way: model.actors2D.RemoveItem(prop);
    publicAPI.removeViewProp(prop);
  };

  publicAPI.getActors2D = function () {
    model.actors2D = [];
    model.props.forEach(function (prop) {
      model.actors2D = model.actors2D.concat(prop.getActors2D());
    });
    return model.actors2D;
  };

  publicAPI.displayToView = function () {
    return vtkErrorMacro('call displayToView on your view instead');
  };
  publicAPI.viewToDisplay = function () {
    return vtkErrorMacro('callviewtodisplay on your view instead');
  };
  publicAPI.getSize = function () {
    return vtkErrorMacro('call getSize on your View instead');
  };

  publicAPI.normalizedDisplayToView = function (x, y, z) {
    // first to normalized viewport
    var nvp = publicAPI.normalizedDisplayToNormalizedViewport(x, y, z);

    // then to view
    return publicAPI.normalizedViewportToView(nvp[0], nvp[1], nvp[2]);
  };

  publicAPI.normalizedDisplayToNormalizedViewport = function (x, y, z) {
    var scale = [model.viewport[2] - model.viewport[0], model.viewport[3] - model.viewport[1]];
    return [(x - model.viewport[0]) / scale[0], (y - model.viewport[1]) / scale[1], z];
  };

  publicAPI.normalizedViewportToView = function (x, y, z) {
    return [x * 2.0 - 1.0, y * 2.0 - 1.0, z * 2.0 - 1.0];
  };

  publicAPI.viewToNormalizedDisplay = function (x, y, z) {
    // first to nvp
    var nvp = publicAPI.viewToNormalizedViewport(x, y, z);

    // then to ndp
    return publicAPI.normalizedViewportToNormalizedDisplay(nvp[0], nvp[1], nvp[2]);
  };

  publicAPI.normalizedViewportToNormalizedDisplay = function (x, y, z) {
    var scale = [model.viewport[2] - model.viewport[0], model.viewport[3] - model.viewport[1]];
    return [x * scale[0] + model.viewport[0], y * scale[1] + model.viewport[1], z];
  };

  publicAPI.viewToNormalizedViewport = function (x, y, z) {
    return [(x + 1.0) * 0.5, (y + 1.0) * 0.5, (z + 1.0) * 0.5];
  };

  publicAPI.PickPropFrom = notImplemented('PickPropFrom');
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  vtkWindow: null,
  background: [0, 0, 0],
  background2: [0.2, 0.2, 0.2],
  gradientBackground: false,
  viewport: [0, 0, 1, 1],
  aspect: [1, 1],
  pixelAspect: [1, 1],
  props: [],
  actors2D: []
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  _macro2.default.obj(publicAPI, model);
  _macro2.default.event(publicAPI, model, 'event');

  _macro2.default.setGetArray(publicAPI, model, ['viewport'], 4);

  _macro2.default.setGetArray(publicAPI, model, ['background', 'background2'], 3);

  vtkViewport(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkViewport');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = exports.STATIC = undefined;
exports.vtkPlane = vtkPlane;
exports.extend = extend;

var _Math = __webpack_require__(1);

var _Math2 = _interopRequireDefault(_Math);

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PLANE_TOLERANCE = 1.0e-6;

// ----------------------------------------------------------------------------
// Global methods
// ----------------------------------------------------------------------------

function evaluate(normal, origin, x) {
  return normal[0] * (x[0] - origin[0]) + normal[1] * (x[1] - origin[1]) + normal[2] * (x[2] - origin[2]);
}

function distanceToPlane(x, origin, normal) {
  var distance = normal[0] * (x[0] - origin[0]) + normal[1] * (x[1] - origin[1]) + normal[2] * (x[2] - origin[2]);

  return Math.abs(distance);
}

function projectPoint(x, origin, normal, xproj) {
  var xo = [];
  _Math2.default.subtract(x, origin, xo);

  var t = _Math2.default.dot(normal, xo);

  xproj[0] = x[0] - t * normal[0];
  xproj[1] = x[1] - t * normal[1];
  xproj[2] = x[2] - t * normal[2];
}

function projectVector(v, normal, vproj) {
  var t = _Math2.default.dot(v, normal);

  var n2 = _Math2.default.dot(normal, normal);
  if (n2 === 0) {
    n2 = 1.0;
  }

  vproj[0] = v[0] - t * normal[0] / n2;
  vproj[1] = v[1] - t * normal[1] / n2;
  vproj[2] = v[2] - t * normal[2] / n2;
}

function generalizedProjectPoint(x, origin, normal, xproj) {
  var xo = [];
  _Math2.default.subtract(x, origin, xo);

  var t = _Math2.default.dot(normal, xo);
  var n2 = _Math2.default.dot(normal, normal);

  if (n2 !== 0) {
    xproj[0] = x[0] - t * normal[0] / n2;
    xproj[1] = x[1] - t * normal[1] / n2;
    xproj[2] = x[2] - t * normal[2] / n2;
  } else {
    xproj[0] = x[0];
    xproj[1] = x[1];
    xproj[2] = x[2];
  }
}

function intersectWithLine(p1, p2, origin, normal) {
  var outObj = { intersection: false, t: Number.MAX_VALUE, x: [] };

  var p21 = [];
  // Compute line vector
  _Math2.default.subtract(p2, p1, p21);

  // Compute denominator.  If ~0, line and plane are parallel.
  var num = _Math2.default.dot(normal, origin) - _Math2.default.dot(normal, p1);
  var den = _Math2.default.dot(normal, p21);

  // If denominator with respect to numerator is "zero", then the line and
  // plane are considered parallel.
  var fabsden = void 0;
  var fabstolerance = void 0;

  // Trying to avoid an expensive call to fabs()
  if (den < 0.0) {
    fabsden = -den;
  } else {
    fabsden = den;
  }
  if (num < 0.0) {
    fabstolerance = -num * PLANE_TOLERANCE;
  } else {
    fabstolerance = num * PLANE_TOLERANCE;
  }
  if (fabsden <= fabstolerance) {
    return outObj;
  }

  // Valid intersection
  outObj.t = num / den;

  outObj.x[0] = p1[0] + outObj.t * p21[0];
  outObj.x[1] = p1[1] + outObj.t * p21[1];
  outObj.x[2] = p1[2] + outObj.t * p21[2];

  outObj.intersection = outObj.t >= 0.0 && outObj.t <= 1.0;
  return outObj;
}

// ----------------------------------------------------------------------------
// Static API
// ----------------------------------------------------------------------------

var STATIC = exports.STATIC = {
  evaluate: evaluate,
  distanceToPlane: distanceToPlane,
  projectPoint: projectPoint,
  projectVector: projectVector,
  generalizedProjectPoint: generalizedProjectPoint,
  intersectWithLine: intersectWithLine
};

// ----------------------------------------------------------------------------
// vtkPlane methods
// ----------------------------------------------------------------------------

function vtkPlane(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkPlane');

  publicAPI.distanceToPlane = function (x) {
    return distanceToPlane(x, model.origin, model.normal);
  };

  publicAPI.projectPoint = function (x, xproj) {
    projectPoint(x, model.origin, model.normal, xproj);
  };

  publicAPI.projectVector = function (v, vproj) {
    projectVector(v, model.normal, vproj);
  };

  publicAPI.push = function (distance) {
    if (distance === 0.0) {
      return;
    }
    for (var i = 0; i < 3; i++) {
      model.origin[i] += distance * model.normal[i];
    }
  };

  publicAPI.generalizedProjectPoint = function (x, xproj) {
    generalizedProjectPoint(x, model.origin, model.normal, xproj);
  };

  publicAPI.evaluateFunction = function () {
    for (var _len = arguments.length, x = Array(_len), _key = 0; _key < _len; _key++) {
      x[_key] = arguments[_key];
    }

    var point = [].concat(x);
    if (Array.isArray(x[0])) {
      point = x[0];
    }

    if (point.length !== 3) {
      return Number.MAX_VALUE;
    }

    return model.normal[0] * (point[0] - model.origin[0]) + model.normal[1] * (point[1] - model.origin[1]) + model.normal[2] * (point[2] - model.origin[2]);
  };

  publicAPI.evaluateGradient = function (xyz) {
    var retVal = [model.normal[0], model.normal[1], model.normal[2]];
    return retVal;
  };

  publicAPI.intersectWithLine = function (p1, p2) {
    return intersectWithLine(p1, p2, model.origin, model.normal);
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  normal: [0.0, 0.0, 1.0],
  origin: [0.0, 0.0, 0.0]
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  _macro2.default.obj(publicAPI, model);

  _macro2.default.setGetArray(publicAPI, model, ['normal', 'origin'], 3);

  vtkPlane(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkPlane');

// ----------------------------------------------------------------------------

exports.default = Object.assign({ newInstance: newInstance, extend: extend }, STATIC);

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = exports.DEFAULT_VALUES = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------------------------------------------------------------
// vtkRenderWindow methods
// ----------------------------------------------------------------------------

function vtkRenderWindow(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkRenderWindow');

  // Add renderer
  publicAPI.addRenderer = function (renderer) {
    if (publicAPI.hasRenderer(renderer)) {
      return;
    }
    renderer.setRenderWindow(publicAPI);
    model.renderers.push(renderer);

    // for (this->Renderers->InitTraversal(rsit);
    //      (aren = this->Renderers->GetNextRenderer(rsit)); )
    //   {
    //   aren->SetAllocatedRenderTime
    //     (1.0/(this->DesiredUpdateRate*this->Renderers->GetNumberOfItems()));
    //   }

    publicAPI.modified();
  };

  // Remove renderer
  publicAPI.removeRenderer = function (renderer) {
    model.renderers = model.renderers.filter(function (r) {
      return r !== renderer;
    });
    publicAPI.modified();
  };

  publicAPI.hasRenderer = function (ren) {
    return model.renderers.indexOf(ren) !== -1;
  };

  // Add renderer
  publicAPI.addView = function (view) {
    if (publicAPI.hasView(view)) {
      return;
    }
    view.setRenderable(publicAPI);
    model.views.push(view);
    publicAPI.modified();
  };

  // Remove renderer
  publicAPI.removeView = function (view) {
    model.views = model.views.filter(function (r) {
      return r !== view;
    });
    publicAPI.modified();
  };

  publicAPI.hasView = function (view) {
    return model.views.indexOf(view) !== -1;
  };

  publicAPI.render = function () {
    model.views.forEach(function (view) {
      return view.traverseAllPasses();
    });
  };

  publicAPI.captureImages = function () {
    var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'image/png';

    publicAPI.render();
    return model.views.map(function (view) {
      return view.captureImage ? view.captureImage(format) : undefined;
    }).filter(function (i) {
      return !!i;
    });
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = exports.DEFAULT_VALUES = {
  renderers: [],
  views: [],
  interactor: null,
  neverRendered: true,
  numberOfLayers: 1
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  _macro2.default.obj(publicAPI, model);
  _macro2.default.setGet(publicAPI, model, ['interactor', 'numberOfLayers', 'views']);
  _macro2.default.get(publicAPI, model, ['neverRendered']);
  _macro2.default.getArray(publicAPI, model, ['renderers']);
  _macro2.default.event(publicAPI, model, 'completion');

  // Object methods
  vtkRenderWindow(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkRenderWindow');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _Math = __webpack_require__(1);

var _Math2 = _interopRequireDefault(_Math);

var _InteractorStyleTrackballCamera = __webpack_require__(91);

var _InteractorStyleTrackballCamera2 = _interopRequireDefault(_InteractorStyleTrackballCamera);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vtkWarningMacro = _macro2.default.vtkWarningMacro,
    vtkErrorMacro = _macro2.default.vtkErrorMacro;

// ----------------------------------------------------------------------------
// Global methods
// ----------------------------------------------------------------------------

var eventsWeHandle = ['Animation', 'Enter', 'Leave', 'MouseMove', 'LeftButtonPress', 'LeftButtonRelease', 'MiddleButtonPress', 'MiddleButtonRelease', 'RightButtonPress', 'RightButtonRelease', 'MouseWheelForward', 'MouseWheelBackward', 'Expose', 'Configure', 'Timer', 'KeyPress', 'KeyUp', 'Char', 'Delete', 'StartPinch', 'Pinch', 'EndPinch', 'StartPan', 'Pan', 'EndPan', 'StartRotate', 'Rotate', 'EndRotate', 'Tap', 'LongTap', 'Swipe'];

function preventDefault(event) {
  event.stopPropagation();
  event.preventDefault();
  return false;
}

// ----------------------------------------------------------------------------
// vtkRenderWindowInteractor methods
// ----------------------------------------------------------------------------

function vtkRenderWindowInteractor(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkRenderWindowInteractor');

  // Public API methods

  //----------------------------------------------------------------------
  publicAPI.start = function () {
    // Let the compositing handle the event loop if it wants to.
    // if (publicAPI.HasObserver(vtkCommand::StartEvent) && !publicAPI.HandleEventLoop) {
    //   publicAPI.invokeEvent({ type: 'StartEvent' });
    //   return;
    // }

    // As a convenience, initialize if we aren't initialized yet.
    if (!model.initialized) {
      publicAPI.initialize();
      if (!model.initialized) {
        return;
      }
    }
    // Pass execution to the subclass which will run the event loop,
    // this will not return until TerminateApp is called.
    publicAPI.startEventLoop();
  };

  //----------------------------------------------------------------------
  publicAPI.setRenderWindow = function (aren) {
    vtkErrorMacro('you want to call setView(view) instead of setRenderWindow on a vtk.js  interactor');
  };

  //----------------------------------------------------------------------
  publicAPI.setInteractorStyle = function (style) {
    if (model.interactorStyle !== style) {
      if (model.interactorStyle != null) {
        model.interactorStyle.setInteractor(null);
      }
      model.interactorStyle = style;
      if (model.interactorStyle != null) {
        if (model.interactorStyle.getInteractor() !== publicAPI) {
          model.interactorStyle.setInteractor(publicAPI);
        }
      }
    }
  };

  //---------------------------------------------------------------------
  publicAPI.initialize = function () {
    model.initialized = true;
    publicAPI.enable();
    publicAPI.render();
  };

  publicAPI.enable = function () {
    return publicAPI.setEnabled(true);
  };

  publicAPI.disable = function () {
    return publicAPI.setEnabled(false);
  };

  publicAPI.startEventLoop = function () {
    return vtkWarningMacro('empty event loop');
  };

  publicAPI.setEventPosition = function (xv, yv, zv, pointer) {
    model.pointerIndex = pointer;
    model.lastEventPositions.set(pointer, model.eventPositions.get(pointer));
    model.eventPositions.set(pointer, { x: xv, y: yv, z: zv });
  };

  publicAPI.setAnimationEventPosition = function (xv, yv, zv, pointer) {
    model.lastAnimationEventPositions.set(pointer, model.animationEventPositions.get(pointer));
    model.animationEventPositions.set(pointer, { x: xv, y: yv, z: zv });
  };

  publicAPI.getEventPosition = function (pointer) {
    return model.eventPositions.get(pointer);
  };

  publicAPI.getLastEventPosition = function (pointer) {
    return model.lastEventPositions.get(pointer);
  };

  publicAPI.getAnimationEventPosition = function (pointer) {
    return model.animationEventPositions.get(pointer);
  };

  publicAPI.getLastAnimationEventPosition = function (pointer) {
    return model.lastAnimationEventPositions.get(pointer);
  };

  publicAPI.bindEvents = function (canvas) {
    model.canvas = canvas;
    canvas.addEventListener('contextmenu', preventDefault);
    canvas.addEventListener('click', preventDefault);
    canvas.addEventListener('mousewheel', publicAPI.handleWheel);
    canvas.addEventListener('DOMMouseScroll', publicAPI.handleWheel);

    canvas.addEventListener('mousedown', publicAPI.handleMouseDown);
    document.querySelector('body').addEventListener('keypress', publicAPI.handleKeyPress);
    document.querySelector('body').addEventListener('keyup', publicAPI.handleKeyUp);
    canvas.addEventListener('mouseup', publicAPI.handleMouseUp);
    canvas.addEventListener('mousemove', publicAPI.handleMouseMove);
    canvas.addEventListener('touchstart', publicAPI.handleTouchStart, false);
    canvas.addEventListener('touchend', publicAPI.handleTouchEnd, false);
    canvas.addEventListener('touchcancel', publicAPI.handleTouchEnd, false);
    canvas.addEventListener('touchmove', publicAPI.handleTouchMove, false);
  };

  publicAPI.unbindEvents = function (canvas) {
    canvas.removeEventListener('contextmenu', preventDefault);
    canvas.removeEventListener('click', preventDefault);
    canvas.removeEventListener('mousewheel', publicAPI.handleWheel);
    canvas.removeEventListener('DOMMouseScroll', publicAPI.handleWheel);

    canvas.removeEventListener('mousedown', publicAPI.handleMouseDown);
    document.querySelector('body').removeEventListener('keypress', publicAPI.handleKeyPress);
    document.querySelector('body').removeEventListener('keyup', publicAPI.handleKeyUp);
    canvas.removeEventListener('mouseup', publicAPI.handleMouseUp);
    canvas.removeEventListener('mousemove', publicAPI.handleMouseMove);
    canvas.removeEventListener('touchstart', publicAPI.handleTouchStart);
    canvas.removeEventListener('touchend', publicAPI.handleTouchEnd);
    canvas.removeEventListener('touchcancel', publicAPI.handleTouchEnd);
    canvas.removeEventListener('touchmove', publicAPI.handleTouchMove);
  };

  publicAPI.handleKeyPress = function (event) {
    model.controlKey = event.ctrlKey;
    model.altKey = event.altKey;
    model.shiftKey = event.shiftKey;
    model.key = event.key;
    model.keyCode = String.fromCharCode(event.charCode);
    publicAPI.keyPressEvent();
    publicAPI.charEvent();
  };

  publicAPI.handleKeyUp = function (event) {
    model.controlKey = event.ctrlKey;
    model.altKey = event.altKey;
    model.shiftKey = event.shiftKey;
    model.key = event.key;
    publicAPI.keyUpEvent();
  };

  publicAPI.handleMouseDown = function (event) {
    event.stopPropagation();
    event.preventDefault();

    // intentioanlly done twice
    publicAPI.setEventPosition(event.clientX, model.canvas.clientHeight - event.clientY + 1, 0, 0);
    publicAPI.setEventPosition(event.clientX, model.canvas.clientHeight - event.clientY + 1, 0, 0);
    model.controlKey = event.ctrlKey;
    model.altKey = event.altKey;
    model.shiftKey = event.shiftKey;
    switch (event.which) {
      case 1:
        publicAPI.leftButtonPressEvent();
        break;
      case 2:
        publicAPI.middleButtonPressEvent();
        break;
      case 3:
        publicAPI.rightButtonPressEvent();
        break;
      default:
        vtkErrorMacro('Unknown mouse button pressed: ' + event.which);
        break;
    }
  };

  publicAPI.requestAnimation = function (requestor) {
    model.requestAnimationCount += 1;
    if (model.requestAnimationCount === 1) {
      model.eventPositions.forEach(function (value, key) {
        model.lastAnimationEventPositions.set(key, value);
        model.animationEventPositions.set(key, value);
      });
      model.lastFrameTime = 0.1;
      model.lastFrameStart = new Date().getTime();
      model.animationRequest = requestAnimationFrame(publicAPI.handleAnimation);
    }
  };

  publicAPI.isAnimating = function () {
    return model.animationRequest !== null;
  };

  publicAPI.cancelAnimation = function (requestor) {
    model.requestAnimationCount -= 1;

    if (model.animationRequest && model.requestAnimationCount === 0) {
      cancelAnimationFrame(model.animationRequest);
      model.animationRequest = null;
    }
  };

  publicAPI.handleMouseMove = function (event) {
    publicAPI.setEventPosition(event.clientX, model.canvas.clientHeight - event.clientY + 1, 0, 0);
    // Do not consume event for move
    // event.stopPropagation();
    // event.preventDefault();
    publicAPI.setPointerIndex(0);
    publicAPI.mouseMoveEvent();
  };

  publicAPI.handleAnimation = function () {
    var currTime = new Date().getTime();
    if (model.FrameTime === -1.0) {
      model.lastFrameTime = 0.1;
    } else {
      model.lastFrameTime = (currTime - model.lastFrameStart) / 1000.0;
    }
    model.lastFrameTime = Math.max(0.01, model.lastFrameTime);
    model.lastFrameStart = currTime;
    model.eventPositions.forEach(function (value, key) {
      model.lastAnimationEventPositions.set(key, model.animationEventPositions.get(key));
      model.animationEventPositions.set(key, value);
    });
    publicAPI.animationEvent();
    publicAPI.render();
    model.animationRequest = requestAnimationFrame(publicAPI.handleAnimation);
  };

  publicAPI.handleWheel = function (event) {
    event.stopPropagation();
    event.preventDefault();

    var wheelDelta = 0;
    // let mode = '';
    if (event.wheelDeltaX === undefined) {
      // mode = 'detail';
      wheelDelta = -event.detail * 2;
    } else {
      // mode = 'wheelDeltaY';
      wheelDelta = event.wheelDeltaY;
    }
    publicAPI.setScale(publicAPI.getScale() * Math.max(0.01, (wheelDelta + 1000.0) / 1000.0));
    publicAPI.pinchEvent();
  };

  publicAPI.handleMouseUp = function (event) {
    event.stopPropagation();
    event.preventDefault();

    publicAPI.setEventPosition(event.clientX, model.canvas.clientHeight - event.clientY + 1, 0, 0);
    switch (event.which) {
      case 1:
        publicAPI.leftButtonReleaseEvent();
        break;
      case 2:
        publicAPI.middleButtonReleaseEvent();
        break;
      case 3:
        publicAPI.rightButtonReleaseEvent();
        break;
      default:
        vtkErrorMacro('Unknown mouse button released: ' + event.which);
        break;
    }
  };

  publicAPI.handleTouchStart = function (event) {
    event.stopPropagation();
    event.preventDefault();

    var touches = event.changedTouches;
    for (var i = 0; i < touches.length; i++) {
      var touch = touches[i];
      publicAPI.setEventPosition(touch.clientX, model.canvas.clientHeight - touch.clientY + 1, 0, touch.identifier);
      publicAPI.setPointerIndex(touch.identifier);
      publicAPI.startTouchEvent();
    }
  };

  publicAPI.handleTouchMove = function (event) {
    event.stopPropagation();
    event.preventDefault();

    var touches = event.changedTouches;
    for (var i = 0; i < touches.length; i++) {
      var touch = touches[i];
      publicAPI.setEventPosition(touch.clientX, model.canvas.clientHeight - touch.clientY + 1, 0, touch.identifier);
      publicAPI.setPointerIndex(touch.identifier);
      publicAPI.mouseMoveEvent();
    }
  };

  publicAPI.handleTouchEnd = function (event) {
    event.stopPropagation();
    event.preventDefault();

    var touches = event.changedTouches;
    for (var i = 0; i < touches.length; i++) {
      var touch = touches[i];
      publicAPI.setEventPosition(touch.clientX, model.canvas.clientHeight - touch.clientY + 1, 0, touch.identifier);
      publicAPI.setPointerIndex(touch.identifier);
      publicAPI.endTouchEvent();
    }
  };

  publicAPI.setView = function (val) {
    if (model.view === val) {
      return;
    }
    model.view = val;
    model.view.getRenderable().setInteractor(publicAPI);
    publicAPI.modified();
  };

  publicAPI.findPokedRenderer = function () {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var rc = model.view.getRenderable().getRenderers();
    var interactiveren = null;
    var viewportren = null;
    var currentRenderer = null;

    rc.forEach(function (aren) {
      if (model.view.isInViewport(x, y, aren) && aren.getInteractive()) {
        currentRenderer = aren;
      }

      if (interactiveren === null && aren.getInteractive()) {
        // Save this renderer in case we can't find one in the viewport that
        // is interactive.
        interactiveren = aren;
      }
      if (viewportren === null && model.view.isInViewport(x, y, aren)) {
        // Save this renderer in case we can't find one in the viewport that
        // is interactive.
        viewportren = aren;
      }
    }); // for all renderers

    // We must have a value.  If we found an interactive renderer before, that's
    // better than a non-interactive renderer.
    if (currentRenderer === null) {
      currentRenderer = interactiveren;
    }

    // We must have a value.  If we found a renderer that is in the viewport,
    // that is better than any old viewport (but not as good as an interactive
    // one).
    if (currentRenderer === null) {
      currentRenderer = viewportren;
    }

    // We must have a value - take anything.
    if (currentRenderer == null) {
      currentRenderer = rc[0];
    }

    return currentRenderer;
  };

  //----------------------------------------------------------------------
  publicAPI.render = function () {
    // if (model.renderWindow && model.enabled && model.enableRender) {
    //   model.renderWindow.render();
    // }
    if (model.view && model.enabled && model.enableRender) {
      model.view.traverseAllPasses();
    }
    // outside the above test so that third-party code can redirect
    // the render to the appropriate class
    publicAPI.invokeRenderEvent();
  };

  // create the generic Event methods
  eventsWeHandle.forEach(function (eventName) {
    var lowerFirst = eventName.charAt(0).toLowerCase() + eventName.slice(1);
    publicAPI[lowerFirst + 'Event'] = function () {
      if (!model.enabled) {
        return;
      }
      publicAPI['invoke' + eventName]({ type: eventName });
    };
  });

  //------------------------------------------------------------------
  publicAPI.animationEvent = function () {
    if (!model.enabled) {
      return;
    }

    // are we translating multitouch into gestures?
    if (model.recognizeGestures && model.pointersDownCount > 1) {
      publicAPI.recognizeGesture('Animation');
    } else {
      publicAPI.invokeAnimation({ type: 'Animation' });
    }
  };

  //------------------------------------------------------------------
  publicAPI.mouseMoveEvent = function () {
    if (!model.enabled) {
      return;
    }

    // are we translating multitouch into gestures?
    if (model.recognizeGestures && model.pointersDownCount > 1) {
      publicAPI.recognizeGesture('MouseMove');
    } else {
      publicAPI.invokeMouseMove({ type: 'MouseMove' });
    }
  };

  // we know we are in multitouch now, so start recognizing
  publicAPI.recognizeGesture = function (event) {
    // more than two pointers we ignore
    if (model.pointersDownCount > 2) {
      return;
    }

    // store the initial positions
    if (event === 'LeftButtonPress') {
      model.pointersDown.forEach(function (value, key) {
        model.startingEventPositions.set(key, model.eventPositions.get(key));
      });
      // we do not know what the gesture is yet
      model.currentGesture = 'Start';
      return;
    }

    // end the gesture if needed
    if (event === 'LeftButtonRelease') {
      if (model.currentGesture === 'Pinch') {
        model.interactorStyle.setAnimationStateOff();
        publicAPI.render();
        publicAPI.endPinchEvent();
      }
      if (model.currentGesture === 'Rotate') {
        model.interactorStyle.setAnimationStateOff();
        publicAPI.render();
        publicAPI.endRotateEvent();
      }
      if (model.currentGesture === 'Pan') {
        model.interactorStyle.setAnimationStateOff();
        publicAPI.render();
        publicAPI.endPanEvent();
      }
      model.currentGesture = 'Start';
      return;
    }

    // what are the two pointers we are working with
    var count = 0;
    var posVals = [];
    var startVals = [];
    model.pointersDown.forEach(function (value, key) {
      posVals[count] = model.animationRequest === null ? model.eventPositions.get(key) : model.animationEventPositions.get(key);
      startVals[count] = model.startingEventPositions.get(key);
      count++;
    });

    // The meat of the algorithm
    // on move events we analyze them to determine what type
    // of movement it is and then deal with it.
    // calculate the distances
    var originalDistance = Math.sqrt((startVals[0].x - startVals[1].x) * (startVals[0].x - startVals[1].x) + (startVals[0].y - startVals[1].y) * (startVals[0].y - startVals[1].y));
    var newDistance = Math.sqrt((posVals[0].x - posVals[1].x) * (posVals[0].x - posVals[1].x) + (posVals[0].y - posVals[1].y) * (posVals[0].y - posVals[1].y));

    // calculate rotations
    var originalAngle = _Math2.default.degreesFromRadians(Math.atan2(startVals[1].y - startVals[0].y, startVals[1].x - startVals[0].x));
    var newAngle = _Math2.default.degreesFromRadians(Math.atan2(posVals[1].y - posVals[0].y, posVals[1].x - posVals[0].x));

    // angles are cyclic so watch for that, 1 and 359 are only 2 apart :)
    var angleDeviation = newAngle - originalAngle;
    newAngle = newAngle + 180.0 >= 360.0 ? newAngle - 180.0 : newAngle + 180.0;
    originalAngle = originalAngle + 180.0 >= 360.0 ? originalAngle - 180.0 : originalAngle + 180.0;
    if (Math.abs(newAngle - originalAngle) < Math.abs(angleDeviation)) {
      angleDeviation = newAngle - originalAngle;
    }

    // calculate the translations
    var trans = [];
    trans[0] = (posVals[0].x - startVals[0].x + posVals[1].x - startVals[1].x) / 2.0;
    trans[1] = (posVals[0].y - startVals[0].y + posVals[1].y - startVals[1].y) / 2.0;

    if (event === 'MouseMove') {
      // OK we want to
      // - immediately respond to the user
      // - allow the user to zoom without panning (saves focal point)
      // - allow the user to rotate without panning (saves focal point)

      // do we know what gesture we are doing yet? If not
      // see if we can figure it out
      if (model.currentGesture === 'Start') {
        // pinch is a move to/from the center point
        // rotate is a move along the circumference
        // pan is a move of the center point
        // compute the distance along each of these axes in pixels
        // the first to break thresh wins
        var thresh = 0.01 * Math.sqrt(model.canvas.clientWidth * model.canvas.clientWidth + model.canvas.clientHeight * model.canvas.clientHeight);
        if (thresh < 15.0) {
          thresh = 15.0;
        }
        var pinchDistance = Math.abs(newDistance - originalDistance);
        var rotateDistance = newDistance * 3.1415926 * Math.abs(angleDeviation) / 360.0;
        var panDistance = Math.sqrt(trans[0] * trans[0] + trans[1] * trans[1]);
        if (pinchDistance > thresh && pinchDistance > rotateDistance && pinchDistance > panDistance) {
          model.currentGesture = 'Pinch';
          model.scale = 1.0;
          publicAPI.startPinchEvent();
          model.interactorStyle.setAnimationStateOn();
        } else if (rotateDistance > thresh && rotateDistance > panDistance) {
          model.currentGesture = 'Rotate';
          model.rotation = 0.0;
          publicAPI.startRotateEvent();
          model.interactorStyle.setAnimationStateOn();
        } else if (panDistance > thresh) {
          model.currentGesture = 'Pan';
          model.translation[0] = 0.0;
          model.translation[1] = 0.0;
          publicAPI.startPanEvent();
          model.interactorStyle.setAnimationStateOn();
        }
      }
    }

    if (event === 'Animation') {
      // if we have found a specific type of movement then
      // handle it
      if (model.currentGesture === 'Rotate') {
        publicAPI.setRotation(angleDeviation);
        publicAPI.rotateEvent();
      }

      if (model.currentGesture === 'Pinch') {
        publicAPI.setScale(newDistance / originalDistance);
        publicAPI.pinchEvent();
      }

      if (model.currentGesture === 'Pan') {
        publicAPI.setTranslation(trans);
        publicAPI.panEvent();
      }
    }
  };

  publicAPI.setScale = function (scale) {
    model.lastScale = model.scale;
    if (model.scale !== scale) {
      model.scale = scale;
      publicAPI.modified();
    }
  };

  publicAPI.setRotation = function (rot) {
    model.lastRotation = model.rotation;
    if (model.rotation !== rot) {
      model.rotation = rot;
      publicAPI.modified();
    }
  };

  publicAPI.setTranslation = function (trans) {
    model.lastTranslation = model.translation;
    if (model.translation !== trans) {
      model.translation = trans;
      publicAPI.modified();
    }
  };

  //------------------------------------------------------------------
  publicAPI.startTouchEvent = function () {
    if (!model.enabled) {
      return;
    }

    // are we translating multitouch into gestures?
    if (model.recognizeGestures) {
      if (!model.pointersDown.has(model.pointerIndex)) {
        model.pointersDown.set(model.pointerIndex, 1);
        model.pointersDownCount++;
      }
      // do we have multitouch
      if (model.pointersDownCount > 1) {
        // did we just transition to multitouch?
        if (model.pointersDownCount === 2) {
          publicAPI.invokeLeftButtonRelease({ type: 'LeftButtonRelease' });
        }
        // handle the gesture
        publicAPI.recognizeGesture('LeftButtonPress');
        return;
      }
    }

    publicAPI.invokeLeftButtonPress({ type: 'LeftButtonPress' });
  };

  //------------------------------------------------------------------
  publicAPI.endTouchEvent = function () {
    if (!model.enabled) {
      return;
    }

    // are we translating multitouch into gestures?
    if (model.recognizeGestures) {
      if (model.pointersDown.has(model.pointerIndex)) {
        // do we have multitouch
        if (model.pointersDownCount > 1) {
          // handle the gesture
          publicAPI.recognizeGesture('LeftButtonRelease');
        }
        model.pointersDown.delete(model.pointerIndex);
        if (model.startingEventPositions.get(model.pointerIndex)) {
          model.startingEventPositions.delete(model.pointerIndex);
        }
        if (model.eventPositions.get(model.pointerIndex)) {
          model.eventPositions.delete(model.pointerIndex);
        }
        if (model.lastEventPositions.get(model.pointerIndex)) {
          model.lastEventPositions.delete(model.pointerIndex);
        }
        model.pointersDownCount--;
        publicAPI.invokeLeftButtonRelease({ type: 'LeftButtonRelease' });
      }
    } else {
      publicAPI.invokeLeftButtonRelease({ type: 'LeftButtonRelease' });
    }
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  startingEventPositions: null,
  pointersDown: null,
  pointersDownCount: 0,
  pointerIndex: 0,
  renderWindow: null,
  interactorStyle: null,
  picker: null,
  pickingManager: null,
  initialized: false,
  enabled: false,
  enableRender: true,
  lightFollowCamera: true,
  desiredUpdateRate: 30.0,
  stillUpdateRate: 2.0,
  shiftKey: false,
  altKey: false,
  controlKey: false,
  keyCode: 0,
  key: '',
  canvas: null,
  view: null,
  recognizeGestures: true,
  currentGesture: 'Start',
  scale: 1.0,
  lastScale: 1.0,
  translation: [],
  lastTranslation: [],
  rotation: 0.0,
  lastRotation: 0.0,
  animationRequest: null,
  requestAnimationCount: 0,
  lastFrameTime: 0.1
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Internal objects initialization
  model.eventPositions = new Map();
  model.lastEventPositions = new Map();
  model.pointersDown = new Map();
  model.startingEventPositions = new Map();
  model.animationEventPositions = new Map();
  model.lastAnimationEventPositions = new Map();

  // Object methods
  _macro2.default.obj(publicAPI, model);

  _macro2.default.event(publicAPI, model, 'RenderEvent');
  eventsWeHandle.forEach(function (eventName) {
    return _macro2.default.event(publicAPI, model, eventName);
  });

  // Create get-only macros
  _macro2.default.get(publicAPI, model, ['initialized', 'canvas', 'enabled', 'enableRender', 'scale', 'lastScale', 'rotation', 'lastRotation', 'interactorStyle', 'lastFrameTime', 'view']);

  // Create get-set macros
  _macro2.default.setGet(publicAPI, model, ['pointerIndex', 'lightFollowCamera', 'enabled', 'shiftKey', 'controlKey', 'altKey', 'keyCode', 'recognizeGestures', 'desiredUpdateRate', 'stillUpdateRate', 'key', 'picker']);

  _macro2.default.getArray(publicAPI, model, ['translation', 'lastTranslation']);

  // For more macro methods, see "Sources/macro.js"

  // Object specific methods
  vtkRenderWindowInteractor(publicAPI, model);

  publicAPI.setInteractorStyle(_InteractorStyleTrackballCamera2.default.newInstance());
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkRenderWindowInteractor');

// ----------------------------------------------------------------------------

exports.default = Object.assign({ newInstance: newInstance, extend: extend });

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _InteractorStyle = __webpack_require__(92);

var _InteractorStyle2 = _interopRequireDefault(_InteractorStyle);

var _Math = __webpack_require__(1);

var _Math2 = _interopRequireDefault(_Math);

var _Constants = __webpack_require__(33);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-lonely-if */

// ----------------------------------------------------------------------------
// vtkInteractorStyleTrackballCamera methods
// ----------------------------------------------------------------------------

function vtkInteractorStyleTrackballCamera(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkInteractorStyleTrackballCamera');

  // Public API methods
  publicAPI.handleAnimation = function () {
    var pos = model.interactor.getAnimationEventPosition(model.interactor.getPointerIndex());

    switch (model.state) {
      case _Constants.States.IS_ROTATE:
        publicAPI.findPokedRenderer(pos.x, pos.y);
        publicAPI.rotate();
        publicAPI.invokeInteractionEvent({ type: 'InteractionEvent' });
        break;

      case _Constants.States.IS_PAN:
        publicAPI.findPokedRenderer(pos.x, pos.y);
        publicAPI.pan();
        publicAPI.invokeInteractionEvent({ type: 'InteractionEvent' });
        break;

      case _Constants.States.IS_DOLLY:
        publicAPI.findPokedRenderer(pos.x, pos.y);
        publicAPI.dolly();
        publicAPI.invokeInteractionEvent({ type: 'InteractionEvent' });
        break;

      case _Constants.States.IS_SPIN:
        publicAPI.findPokedRenderer(pos.x, pos.y);
        publicAPI.spin();
        publicAPI.invokeInteractionEvent({ type: 'InteractionEvent' });
        break;

      default:
        break;
    }
  };

  //----------------------------------------------------------------------------
  publicAPI.handleLeftButtonPress = function () {
    var pos = model.interactor.getEventPosition(model.interactor.getPointerIndex());
    publicAPI.findPokedRenderer(pos.x, pos.y);
    if (model.currentRenderer === null) {
      return;
    }

    publicAPI.grabFocus(model.eventCallbackCommand);
    if (model.interactor.getShiftKey()) {
      if (model.interactor.getControlKey() || model.interactor.getAltKey()) {
        publicAPI.startDolly();
        publicAPI.setAnimationStateOn();
      } else {
        publicAPI.startPan();
        publicAPI.setAnimationStateOn();
      }
    } else {
      if (model.interactor.getControlKey() || model.interactor.getAltKey()) {
        publicAPI.startSpin();
        publicAPI.setAnimationStateOn();
      } else {
        publicAPI.startRotate();
        publicAPI.setAnimationStateOn();
      }
    }
  };

  //--------------------------------------------------------------------------
  publicAPI.handleLeftButtonRelease = function () {
    switch (model.state) {
      case _Constants.States.IS_DOLLY:
        publicAPI.setAnimationStateOff();
        publicAPI.endDolly();
        break;

      case _Constants.States.IS_PAN:
        publicAPI.setAnimationStateOff();
        publicAPI.endPan();
        break;

      case _Constants.States.IS_SPIN:
        publicAPI.setAnimationStateOff();
        publicAPI.endSpin();
        break;

      case _Constants.States.IS_ROTATE:
        publicAPI.setAnimationStateOff();
        publicAPI.endRotate();
        break;

      default:
        break;
    }

    if (model.interactor) {
      publicAPI.releaseFocus();
    }
  };

  //----------------------------------------------------------------------------
  publicAPI.handlePinch = function () {
    var pos = model.interactor.getEventPosition(model.interactor.getPointerIndex());
    publicAPI.findPokedRenderer(pos.x, pos.y);
    if (model.currentRenderer === null) {
      return;
    }

    var camera = model.currentRenderer.getActiveCamera();

    var dyf = model.interactor.getScale() / model.interactor.getLastScale();
    if (camera.getParallelProjection()) {
      camera.setParallelScale(camera.getParallelScale() / dyf);
    } else {
      camera.dolly(dyf);
      if (model.autoAdjustCameraClippingRange) {
        model.currentRenderer.resetCameraClippingRange();
      }
    }

    if (model.interactor.getLightFollowCamera()) {
      model.currentRenderer.updateLightsGeometryToFollowCamera();
    }
    model.interactor.render();
  };

  //----------------------------------------------------------------------------
  publicAPI.handlePan = function () {
    var pos = model.interactor.getEventPosition(model.interactor.getPointerIndex());
    publicAPI.findPokedRenderer(pos.x, pos.y);
    if (model.currentRenderer === null) {
      return;
    }

    var camera = model.currentRenderer.getActiveCamera();

    var rwi = model.interactor;

    // Calculate the focal depth since we'll be using it a lot
    var viewFocus = camera.getFocalPoint();

    viewFocus = publicAPI.computeWorldToDisplay(viewFocus[0], viewFocus[1], viewFocus[2]);
    var focalDepth = viewFocus[2];

    var newPickPoint = publicAPI.computeDisplayToWorld(pos.x, pos.y, focalDepth);

    var trans = rwi.getTranslation();
    var lastTrans = rwi.getLastTranslation();
    newPickPoint = publicAPI.computeDisplayToWorld(viewFocus[0] + trans[0] - lastTrans[0], viewFocus[1] + trans[1] - lastTrans[1], focalDepth);

    // Has to recalc old mouse point since the viewport has moved,
    // so can't move it outside the loop
    var oldPickPoint = publicAPI.computeDisplayToWorld(viewFocus[0], viewFocus[1], focalDepth);

    // Camera motion is reversed
    var motionVector = [];
    motionVector[0] = oldPickPoint[0] - newPickPoint[0];
    motionVector[1] = oldPickPoint[1] - newPickPoint[1];
    motionVector[2] = oldPickPoint[2] - newPickPoint[2];

    viewFocus = camera.getFocalPoint();
    var viewPoint = camera.getPosition();
    camera.setFocalPoint(motionVector[0] + viewFocus[0], motionVector[1] + viewFocus[1], motionVector[2] + viewFocus[2]);

    camera.setPosition(motionVector[0] + viewPoint[0], motionVector[1] + viewPoint[1], motionVector[2] + viewPoint[2]);

    if (model.interactor.getLightFollowCamera()) {
      model.currentRenderer.updateLightsGeometryToFollowCamera();
    }

    camera.orthogonalizeViewUp();
    model.interactor.render();
  };

  publicAPI.handleRotate = function () {
    var pos = model.interactor.getEventPosition(model.interactor.getPointerIndex());
    publicAPI.findPokedRenderer(pos.x, pos.y);
    if (model.currentRenderer === null) {
      return;
    }

    var camera = model.currentRenderer.getActiveCamera();

    camera.roll(model.interactor.getRotation() - model.interactor.getLastRotation());

    camera.orthogonalizeViewUp();
    model.interactor.render();
  };

  //--------------------------------------------------------------------------
  publicAPI.rotate = function () {
    if (model.currentRenderer === null) {
      return;
    }

    var rwi = model.interactor;

    var lastPtr = model.interactor.getPointerIndex();
    var pos = model.interactor.getAnimationEventPosition(lastPtr);
    var lastPos = model.interactor.getLastAnimationEventPosition(lastPtr);

    var dx = pos.x - lastPos.x;
    var dy = pos.y - lastPos.y;

    var size = rwi.getView().getViewportSize(model.currentRenderer);

    var deltaElevation = -0.1;
    var deltaAzimuth = -0.1;
    if (size[0] && size[1]) {
      deltaElevation = -20.0 / size[1];
      deltaAzimuth = -20.0 / size[0];
    }

    var rxf = dx * deltaAzimuth * model.motionFactor;
    var ryf = dy * deltaElevation * model.motionFactor;

    var camera = model.currentRenderer.getActiveCamera();
    if (!isNaN(rxf) && !isNaN(ryf)) {
      camera.azimuth(rxf);
      camera.elevation(ryf);
      camera.orthogonalizeViewUp();
    }

    if (model.autoAdjustCameraClippingRange) {
      model.currentRenderer.resetCameraClippingRange();
    }

    if (rwi.getLightFollowCamera()) {
      model.currentRenderer.updateLightsGeometryToFollowCamera();
    }

    rwi.render();
  };

  //--------------------------------------------------------------------------
  publicAPI.spin = function () {
    if (model.currentRenderer === null) {
      return;
    }

    var rwi = model.interactor;

    var lastPtr = model.interactor.getPointerIndex();
    var pos = model.interactor.getAnimationEventPosition(lastPtr);
    var lastPos = model.interactor.getLastAnimationEventPosition(lastPtr);

    var camera = model.currentRenderer.getActiveCamera();
    var center = rwi.getView().getViewportCenter(model.currentRenderer);

    var oldAngle = _Math2.default.degreesFromRadians(Math.atan2(lastPos.y - center[1], lastPos.x - center[0]));
    var newAngle = _Math2.default.degreesFromRadians(Math.atan2(pos.y - center[1], pos.x - center[0])) - oldAngle;

    if (!isNaN(newAngle)) {
      camera.roll(newAngle);
      camera.orthogonalizeViewUp();
    }

    rwi.render();
  };

  publicAPI.pan = function () {
    if (model.currentRenderer === null) {
      return;
    }

    var rwi = model.interactor;

    var lastPtr = model.interactor.getPointerIndex();
    var pos = model.interactor.getAnimationEventPosition(lastPtr);
    var lastPos = model.interactor.getLastAnimationEventPosition(lastPtr);

    var camera = model.currentRenderer.getActiveCamera();

    // Calculate the focal depth since we'll be using it a lot
    var viewFocus = camera.getFocalPoint();
    viewFocus = publicAPI.computeWorldToDisplay(viewFocus[0], viewFocus[1], viewFocus[2]);
    var focalDepth = viewFocus[2];

    var newPickPoint = publicAPI.computeDisplayToWorld(pos.x, pos.y, focalDepth);

    // Has to recalc old mouse point since the viewport has moved,
    // so can't move it outside the loop
    var oldPickPoint = publicAPI.computeDisplayToWorld(lastPos.x, lastPos.y, focalDepth);

    // Camera motion is reversed
    var motionVector = [];
    motionVector[0] = oldPickPoint[0] - newPickPoint[0];
    motionVector[1] = oldPickPoint[1] - newPickPoint[1];
    motionVector[2] = oldPickPoint[2] - newPickPoint[2];

    viewFocus = camera.getFocalPoint();
    var viewPoint = camera.getPosition();
    camera.setFocalPoint(motionVector[0] + viewFocus[0], motionVector[1] + viewFocus[1], motionVector[2] + viewFocus[2]);

    camera.setPosition(motionVector[0] + viewPoint[0], motionVector[1] + viewPoint[1], motionVector[2] + viewPoint[2]);

    if (rwi.getLightFollowCamera()) {
      model.currentRenderer.updateLightsGeometryToFollowCamera();
    }

    rwi.render();
  };

  //----------------------------------------------------------------------------
  publicAPI.dolly = function () {
    if (model.currentRenderer === null) {
      return;
    }

    var lastPtr = model.interactor.getPointerIndex();
    var pos = model.interactor.getAnimationEventPosition(lastPtr);
    var lastPos = model.interactor.getLastAnimationEventPosition(lastPtr);

    var dy = pos.y - lastPos.y;
    var rwi = model.interactor;
    var center = rwi.getView().getViewportCenter(model.currentRenderer);
    var dyf = model.motionFactor * dy / center[1];

    publicAPI.dollyByFactor(Math.pow(1.1, dyf));
  };

  //----------------------------------------------------------------------------
  publicAPI.dollyByFactor = function (factor) {
    if (model.currentRenderer === null || isNaN(factor)) {
      return;
    }

    var rwi = model.interactor;

    var camera = model.currentRenderer.getActiveCamera();
    if (camera.getParallelProjection()) {
      camera.setParallelScale(camera.getParallelScale() / factor);
    } else {
      camera.dolly(factor);
      if (model.autoAdjustCameraClippingRange) {
        model.currentRenderer.resetCameraClippingRange();
      }
    }

    if (rwi.getLightFollowCamera()) {
      model.currentRenderer.updateLightsGeometryToFollowCamera();
    }

    rwi.render();
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  motionFactor: 10.0
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  _InteractorStyle2.default.extend(publicAPI, model, initialValues);

  // Create get-set macros
  _macro2.default.setGet(publicAPI, model, ['motionFactor']);

  // For more macro methods, see "Sources/macro.js"

  // Object specific methods
  vtkInteractorStyleTrackballCamera(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkInteractorStyleTrackballCamera');

// ----------------------------------------------------------------------------

exports.default = Object.assign({ newInstance: newInstance, extend: extend });

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _InteractorObserver = __webpack_require__(93);

var _InteractorObserver2 = _interopRequireDefault(_InteractorObserver);

var _Constants = __webpack_require__(33);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// { ENUM_1: 0, ENUM_2: 1, ... }

var vtkWarningMacro = _macro2.default.vtkWarningMacro;

// ----------------------------------------------------------------------------
// Global methods
// ----------------------------------------------------------------------------

// Add module-level functions or api that you want to expose statically via
// the next section...

var stateNames = {
  Rotate: _Constants.States.IS_ROTATE,
  Pan: _Constants.States.IS_PAN,
  Spin: _Constants.States.IS_SPIN,
  Dolly: _Constants.States.IS_DOLLY,
  Zoom: _Constants.States.IS_ZOOM,
  Timer: _Constants.States.IS_TIMER,
  TwoPointer: _Constants.States.IS_TWO_POINTER,
  UniformScale: _Constants.States.IS_USCALE
};

var events = ['Animation', 'Enter', 'Leave', 'MouseMove', 'LeftButtonPress', 'LeftButtonRelease', 'MiddleButtonPress', 'MiddleButtonRelease', 'RightButtonPress', 'RightButtonRelease', 'MouseWheelForward', 'MouseWheelBackward', 'Expose', 'Configure', 'Timer', 'KeyPress', 'KeyUp', 'Char', 'Delete', 'Pinch', 'Pan', 'Rotate', 'Tap', 'LongTap', 'Swipe'];

// ----------------------------------------------------------------------------
// vtkInteractorStyle methods
// ----------------------------------------------------------------------------

function vtkInteractorStyle(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkInteractorStyle');

  // Public API methods
  publicAPI.setInteractor = function (i) {
    if (i === model.interactor) {
      return;
    }

    // if we already have an Interactor then stop observing it
    if (model.interactor) {
      while (model.unsubscribes.length) {
        model.unsubscribes.pop().unsubscribe();
      }
    }

    model.interactor = i;

    if (i) {
      events.forEach(function (eventName) {
        model.unsubscribes.push(i['on' + eventName](function () {
          if (publicAPI['handle' + eventName]) {
            publicAPI['handle' + eventName]();
          }
        }));
      });
    }
  };

  // create bunch of Start/EndState methods
  Object.keys(stateNames).forEach(function (key) {
    publicAPI['start' + key] = function () {
      if (model.state !== _Constants.States.IS_NONE) {
        return;
      }
      publicAPI.startState(stateNames[key]);
    };
    publicAPI['end' + key] = function () {
      if (model.state !== stateNames[key]) {
        return;
      }
      publicAPI.stopState();
    };
  });

  //----------------------------------------------------------------------------
  publicAPI.handleChar = function () {
    var rwi = model.interactor;

    var pos = null;

    switch (rwi.getKeyCode()) {
      case 'r':
      case 'R':
        pos = model.interactor.getEventPosition(rwi.getPointerIndex());
        publicAPI.findPokedRenderer(pos.x, pos.y);
        if (model.currentRenderer !== 0) {
          model.currentRenderer.resetCamera();
        } else {
          vtkWarningMacro('no current renderer on the interactor style.');
        }
        rwi.render();
        break;

      case 'w':
      case 'W':
        pos = model.interactor.getEventPosition(rwi.getPointerIndex());
        publicAPI.findPokedRenderer(pos.x, pos.y);
        if (model.currentRenderer !== 0) {
          var ac = model.currentRenderer.getActors();
          ac.forEach(function (anActor) {
            anActor.getProperty().setRepresentationToWireframe();
          });
        } else {
          vtkWarningMacro('no current renderer on the interactor style.');
        }
        rwi.render();
        break;

      case 's':
      case 'S':
        pos = model.interactor.getEventPosition(rwi.getPointerIndex());
        publicAPI.findPokedRenderer(pos.x, pos.y);
        if (model.currentRenderer !== 0) {
          var _ac = model.currentRenderer.getActors();
          _ac.forEach(function (anActor) {
            anActor.getProperty().setRepresentationToSurface();
          });
        } else {
          vtkWarningMacro('no current renderer on the interactor style.');
        }
        rwi.render();
        break;

      case 'v':
      case 'V':
        pos = model.interactor.getEventPosition(rwi.getPointerIndex());
        publicAPI.findPokedRenderer(pos.x, pos.y);
        if (model.currentRenderer !== 0) {
          var _ac2 = model.currentRenderer.getActors();
          _ac2.forEach(function (anActor) {
            anActor.getProperty().setRepresentationToPoints();
          });
        } else {
          vtkWarningMacro('no current renderer on the interactor style.');
        }
        rwi.render();
        break;

      default:
        break;
    }
  };

  //----------------------------------------------------------------------------
  publicAPI.findPokedRenderer = function (x, y) {
    publicAPI.setCurrentRenderer(model.interactor.findPokedRenderer(x, y));
  };

  publicAPI.setAnimationStateOn = function () {
    if (model.animationState === _Constants.States.IS_ANIM_ON) {
      return;
    }
    model.animationState = _Constants.States.IS_ANIM_ON;
    model.interactor.requestAnimation(publicAPI);
  };

  publicAPI.setAnimationStateOff = function () {
    if (model.animationState === _Constants.States.IS_ANIM_OFF) {
      return;
    }
    model.animationState = _Constants.States.IS_ANIM_OFF;
    model.interactor.cancelAnimation(publicAPI);
  };

  publicAPI.startState = function (state) {
    model.state = state;
    if (model.animationState === _Constants.States.IS_ANIM_OFF) {
      // const rwi = model.interactor;
      // rwi.getRenderWindow().setDesiredUpdateRate(rwi.getDesiredUpdateRate());
      publicAPI.invokeStartInteractionEvent({ type: 'StartInteractionEvent' });
    }
  };

  publicAPI.stopState = function () {
    model.state = _Constants.States.IS_NONE;
    if (model.animationState === _Constants.States.IS_ANIM_OFF) {
      var rwi = model.interactor;
      // rwi.getRenderWindow().setDesiredUpdateRate(rwi.getStillUpdateRate());
      publicAPI.invokeEndInteractionEvent({ type: 'EndInteractionEvent' });
      rwi.render();
    }
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  state: _Constants.States.IS_NONE,
  animationState: _Constants.States.IS_ANIM_OFF,
  handleObservers: 1,
  autoAdjustCameraClippingRange: 1,
  unsubscribes: null
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  _InteractorObserver2.default.extend(publicAPI, model, initialValues);

  model.unsubscribes = [];

  // Object specific methods
  vtkInteractorStyle(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkInteractorStyle');

// ----------------------------------------------------------------------------

exports.default = Object.assign({ newInstance: newInstance, extend: extend });

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = exports.STATIC = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------------------------------------------------------------
// Global methods
// ----------------------------------------------------------------------------

//----------------------------------------------------------------------------
// Description:
// Transform from world to display coordinates.
function computeWorldToDisplay(renderer, x, y, z) {
  var view = renderer.getRenderWindow().getViews()[0];
  return view.worldToDisplay(x, y, z, renderer);
}

//----------------------------------------------------------------------------
// Description:
// Transform from display to world coordinates.
function computeDisplayToWorld(renderer, x, y, z) {
  var view = renderer.getRenderWindow().getViews()[0];
  return view.displayToWorld(x, y, z, renderer);
}

// ----------------------------------------------------------------------------
// Static API
// ----------------------------------------------------------------------------
var STATIC = exports.STATIC = {
  computeWorldToDisplay: computeWorldToDisplay,
  computeDisplayToWorld: computeDisplayToWorld
};

// ----------------------------------------------------------------------------
// vtkInteractorObserver methods
// ----------------------------------------------------------------------------

function vtkInteractorObserver(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkInteractorObserver');

  // Public API methods
  publicAPI.setInteractor = function (i) {
    if (i === model.interactor) {
      return;
    }

    // Since the observer mediator is bound to the interactor, reset it to
    // 0 so that the next time it is requested, it is queried from the
    // new interactor.
    // Furthermore, remove ourself from the mediator queue.

    // if (this->ObserverMediator)
    //   {
    //   this->ObserverMediator->RemoveAllCursorShapeRequests(this);
    //   this->ObserverMediator = 0;
    //   }

    // if we already have an Interactor then stop observing it
    if (model.interactor) {
      publicAPI.setEnabled(false); // disable the old interactor
      model.charObserverTag();
      model.charObserverTag = null;
      model.deleteObserverTag();
      model.deleteObserverTag = null;
    }

    model.interactor = i;

    // add observers for each of the events handled in ProcessEvents
    if (i) {
      model.charObserverTag = i.onCharEvent(publicAPI.keyPressCallbackCommand);
      //                                           this->Priority);
      model.deleteObserverTag = i.onDeleteEvent(publicAPI.keyPressCallbackCommand);
      //                                           this->Priority);
      // publicAPI.registerPickers();
    }

    publicAPI.modified();
  };

  //----------------------------------------------------------------------------
  // Description:
  // Transform from display to world coordinates.
  publicAPI.computeDisplayToWorld = function (x, y, z) {
    if (!model.currentRenderer) {
      return null;
    }

    return model.interactor.getView().displayToWorld(x, y, z, model.currentRenderer);
  };

  //----------------------------------------------------------------------------
  // Description:
  // Transform from world to display coordinates.
  publicAPI.computeWorldToDisplay = function (x, y, z) {
    if (!model.currentRenderer) {
      return null;
    }

    return model.interactor.getView().worldToDisplay(x, y, z, model.currentRenderer);
  };

  //----------------------------------------------------------------------------
  publicAPI.grabFocus = function () {
    // void vtkInteractorObserver::GrabFocus(vtkCommand *mouseEvents, vtkCommand *keypressEvents)
    // {
    //   if ( this->Interactor )
    //     {
    //     this->Interactor->GrabFocus(mouseEvents,keypressEvents);
    //     }
  };

  //----------------------------------------------------------------------------
  publicAPI.releaseFocus = function () {
    // void vtkInteractorObserver::ReleaseFocus()
    // {
    //   if ( this->Interactor )
    //     {
    //     this->Interactor->ReleaseFocus();
    //     }
  };

  // //----------------------------------------------------------------------------
  // void vtkInteractorObserver::StartInteraction()
  // {
  //   this->Interactor->GetRenderWindow()->SetDesiredUpdateRate(this->Interactor->GetDesiredUpdateRate());
  // }

  // //----------------------------------------------------------------------------
  // void vtkInteractorObserver::EndInteraction()
  // {
  //   this->Interactor->GetRenderWindow()->SetDesiredUpdateRate(this->Interactor->GetStillUpdateRate());
  // }
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  enabled: false,
  interactor: null,
  currentRenderer: null,
  defaultRenderer: null,
  priority: 0.0,
  keyPressActivationValue: 'i',
  charObserverTag: null,
  deleteObserverTag: null
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  _macro2.default.obj(publicAPI, model);

  _macro2.default.event(publicAPI, model, 'InteractionEvent');
  _macro2.default.event(publicAPI, model, 'StartInteractionEvent');
  _macro2.default.event(publicAPI, model, 'EndInteractionEvent');

  // Create get-only macros
  _macro2.default.get(publicAPI, model, ['interactor']);

  // Create get-set macros
  _macro2.default.setGet(publicAPI, model, ['priority', 'currentRenderer']);

  // For more macro methods, see "Sources/macro.js"

  // Object specific methods
  vtkInteractorObserver(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkInteractorObserver');

// ----------------------------------------------------------------------------

exports.default = Object.assign({ newInstance: newInstance, extend: extend }, STATIC);

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = exports.STATIC = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _DataArray = __webpack_require__(6);

var _DataArray2 = _interopRequireDefault(_DataArray);

var _Constants = __webpack_require__(5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------------------------------------------------------------
// Global methods
// ----------------------------------------------------------------------------

function extractCellSizes(cellArray) {
  var currentIdx = 0;
  return cellArray.filter(function (value, index) {
    if (index === currentIdx) {
      currentIdx += value + 1;
      return true;
    }
    return false;
  });
}

function getNumberOfCells(cellArray) {
  return extractCellSizes(cellArray).length;
}

// ----------------------------------------------------------------------------
// Static API
// ----------------------------------------------------------------------------

var STATIC = exports.STATIC = {
  extractCellSizes: extractCellSizes,
  getNumberOfCells: getNumberOfCells
};

// ----------------------------------------------------------------------------
// vtkCellArray methods
// ----------------------------------------------------------------------------

function vtkCellArray(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkCellArray');

  publicAPI.getNumberOfCells = function (recompute) {
    if (model.numberOfCells !== undefined && !recompute) {
      return model.numberOfCells;
    }

    model.cellSizes = extractCellSizes(model.values);
    model.numberOfCells = model.cellSizes.length;
    return model.numberOfCells;
  };

  publicAPI.getCellSizes = function (recompute) {
    if (model.cellSizes !== undefined && !recompute) {
      return model.cellSizes;
    }

    model.cellSizes = extractCellSizes(model.values);
    return model.cellSizes;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  empty: true,
  numberOfComponents: 1,
  dataType: _Constants.VtkDataTypes.UNSIGNED_INT
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  _DataArray2.default.extend(publicAPI, model, initialValues);
  vtkCellArray(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkCellArray');

// ----------------------------------------------------------------------------

exports.default = Object.assign({ newInstance: newInstance, extend: extend }, STATIC);

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _vtk = __webpack_require__(9);

var _vtk2 = _interopRequireDefault(_vtk);

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _DataSet = __webpack_require__(35);

var _DataSet2 = _interopRequireDefault(_DataSet);

var _Points = __webpack_require__(34);

var _Points2 = _interopRequireDefault(_Points);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------------------------------------------------------------
// Global methods
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// vtkPointSet methods
// ----------------------------------------------------------------------------

function vtkPointSet(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkPointSet');

  // Create empty points
  if (!model.points) {
    model.points = _Points2.default.newInstance();
  } else {
    model.points = (0, _vtk2.default)(model.points);
  }

  publicAPI.getBounds = function () {
    return model.points.getBounds();
  };

  publicAPI.computeBounds = function () {
    publicAPI.getBounds();
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  // points: null,
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  _DataSet2.default.extend(publicAPI, model, initialValues);
  _macro2.default.setGet(publicAPI, model, ['points']);

  // Object specific methods
  vtkPointSet(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkPointSet');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _FieldData = __webpack_require__(97);

var _FieldData2 = _interopRequireDefault(_FieldData);

var _Constants = __webpack_require__(98);

var _Constants2 = _interopRequireDefault(_Constants);

var _DataArray = __webpack_require__(6);

var _DataArray2 = _interopRequireDefault(_DataArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AttributeTypes = _Constants2.default.AttributeTypes,
    AttributeCopyOperations = _Constants2.default.AttributeCopyOperations;
var vtkWarningMacro = _macro2.default.vtkWarningMacro;

// ----------------------------------------------------------------------------
// vtkDataSetAttributes methods
// ----------------------------------------------------------------------------

function vtkDataSetAttributes(publicAPI, model) {
  var attrTypes = ['Scalars', 'Vectors', 'Normals', 'TCoords', 'Tensors', 'GlobalIds', 'PedigreeIds'];

  function cleanAttributeType(attType) {
    // Given an integer or string, convert the result to one of the
    // strings in the "attrTypes" array above or null (if
    // no match is found)
    var cleanAttType = attrTypes.find(function (ee) {
      return AttributeTypes[ee.toUpperCase()] === attType || typeof attType !== 'number' && ee.toLowerCase() === attType.toLowerCase();
    });
    if (typeof cleanAttType === 'undefined') {
      cleanAttType = null;
    }
    return cleanAttType;
  }

  // Set our className
  model.classHierarchy.push('vtkDataSetAttributes');

  publicAPI.checkNumberOfComponents = function (x) {
    return true;
  }; // TODO

  publicAPI.setAttribute = function (arr, uncleanAttType) {
    var attType = cleanAttributeType(uncleanAttType);
    if (arr && attType.toUpperCase() === 'PEDIGREEIDS' && !arr.isA('vtkDataArray')) {
      vtkWarningMacro('Cannot set attribute ' + attType + '. The attribute must be a vtkDataArray.');
      return -1;
    }
    if (arr && !publicAPI.checkNumberOfComponents(arr, attType)) {
      vtkWarningMacro('Cannot set attribute ' + attType + '. Incorrect number of components.');
      return -1;
    }
    var currentAttribute = model['active' + attType];
    if (currentAttribute >= 0 && currentAttribute < model.arrays.length) {
      if (model.arrays[currentAttribute] === arr) {
        return currentAttribute;
      }
      publicAPI.removeArrayByIndex(currentAttribute);
    }

    if (arr) {
      currentAttribute = publicAPI.addArray(arr);
      model['active' + attType] = currentAttribute;
    } else {
      model['active' + attType] = -1;
    }
    publicAPI.modified();
    return model['active' + attType];
  };

  publicAPI.setActiveAttributeByName = function (arrayName, attType) {
    return publicAPI.setActiveAttributeByIndex(publicAPI.getArrayWithIndex(arrayName).index, attType);
  };

  publicAPI.setActiveAttributeByIndex = function (arrayIdx, uncleanAttType) {
    var attType = cleanAttributeType(uncleanAttType);
    if (arrayIdx >= 0 && arrayIdx < model.arrays.length) {
      if (attType.toUpperCase() !== 'PEDIGREEIDS') {
        var arr = publicAPI.getArrayByIndex(arrayIdx);
        if (!arr.isA('vtkDataArray')) {
          vtkWarningMacro('Cannot set attribute ' + attType + '. Only vtkDataArray subclasses can be set as active attributes.');
          return -1;
        }
        if (!publicAPI.checkNumberOfComponents(arr, attType)) {
          vtkWarningMacro('Cannot set attribute ' + attType + '. Incorrect number of components.');
          return -1;
        }
      }
      model['active' + attType] = arrayIdx;
      publicAPI.modified();
      return arrayIdx;
    } else if (arrayIdx === -1) {
      model['active' + attType] = arrayIdx;
      publicAPI.modified();
    }
    return -1;
  };

  publicAPI.getActiveAttribute = function (attType) {
    // Given an integer enum value or a string (with random capitalization),
    // find the matching string in attrTypes.
    var cleanAttType = cleanAttributeType(attType);
    return publicAPI['get' + cleanAttType]();
  };

  // Override to allow proper handling of active attributes
  publicAPI.removeAllArrays = function () {
    model.arrays = [];
    attrTypes.forEach(function (attType) {
      model['active' + attType] = -1;
    });
  };

  // Override to allow proper handling of active attributes
  publicAPI.removeArray = function (arrayName) {
    model.arrays = model.arrays.filter(function (entry, idx) {
      if (arrayName === entry.data.getName()) {
        // Found the array to remove, but is it an active attribute?
        attrTypes.forEach(function (attType) {
          if (idx === model['active' + attType]) {
            model['active' + attType] = -1;
          }
        });
        return false;
      }
      return true;
    });
  };

  // Override to allow proper handling of active attributes
  publicAPI.removeArrayByIndex = function (arrayIdx) {
    model.arrays = model.arrays.filter(function (entry, idx) {
      return idx !== arrayIdx;
    });
    attrTypes.forEach(function (attType) {
      if (arrayIdx === model['active' + attType]) {
        model['active' + attType] = -1;
      }
    });
  };

  attrTypes.forEach(function (value) {
    publicAPI['get' + value] = function () {
      return publicAPI.getArrayByIndex(model['active' + value]);
    };
    publicAPI['set' + value] = function (da) {
      return publicAPI.setAttribute(da, value);
    };
    publicAPI['setActive' + value] = function (arrayName) {
      return publicAPI.setActiveAttributeByIndex(publicAPI.getArrayWithIndex(arrayName).index, value);
    };
  });

  publicAPI.initialize = _macro2.default.chain(publicAPI.initialize, function () {
    // Default to copying all attributes in every circumstance:
    model.copyAttributeFlags = [];
    Object.keys(AttributeCopyOperations).filter(function (op) {
      return op !== 'ALLCOPY';
    }).forEach(function (attCopyOp) {
      model.copyAttributeFlags[AttributeCopyOperations[attCopyOp]] = Object.keys(AttributeTypes).filter(function (ty) {
        return ty !== 'NUM_ATTRIBUTES';
      }).reduce(function (a, b) {
        a[AttributeTypes[b]] = true;return a;
      }, []);
    });
    // Override some operations where we don't want to copy:
    model.copyAttributeFlags[AttributeCopyOperations.COPYTUPLE][AttributeTypes.GLOBALIDS] = false;
    model.copyAttributeFlags[AttributeCopyOperations.INTERPOLATE][AttributeTypes.GLOBALIDS] = false;
    model.copyAttributeFlags[AttributeCopyOperations.COPYTUPLE][AttributeTypes.PEDIGREEIDS] = false;
  });

  // Process dataArrays if any
  if (model.dataArrays && Object.keys(model.dataArrays).length) {
    Object.keys(model.dataArrays).forEach(function (name) {
      if (!model.dataArrays[name].ref && model.dataArrays[name].type === 'vtkDataArray') {
        publicAPI.addArray(_DataArray2.default.newInstance(model.dataArrays[name]));
      }
    });
  }
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  activeScalars: -1,
  activeVectors: -1,
  activeTensors: -1,
  activeNormals: -1,
  activeTCoords: -1,
  activeGlobalIds: -1,
  activePedigreeIds: -1
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  _FieldData2.default.extend(publicAPI, model, initialValues);
  _macro2.default.setGet(publicAPI, model, ['activeScalars', 'activeNormals', 'activeTCoords', 'activeVectors', 'activeTensors', 'activeGlobalIds', 'activePedigreeIds']);

  if (!model.arrays) {
    model.arrays = {};
  }

  // Object specific methods
  vtkDataSetAttributes(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkDataSetAttributes');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _vtk = __webpack_require__(9);

var _vtk2 = _interopRequireDefault(_vtk);

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------------------------------------------------------------
// vtkFieldData methods
// ----------------------------------------------------------------------------

function vtkFieldData(publicAPI, model) {
  model.classHierarchy.push('vtkFieldData');
  var superGetState = publicAPI.getState;

  // Decode serialized data if any
  if (model.arrays) {
    model.arrays = model.arrays.map(function (item) {
      return { data: (0, _vtk2.default)(item.data) };
    });
  }

  publicAPI.initialize = function () {
    publicAPI.initializeFields();
    publicAPI.copyAllOn();
    publicAPI.clearFieldFlags();
  };

  publicAPI.initializeFields = function () {
    model.arrays = [];
    model.copyFieldFlags = {};
    publicAPI.modified();
  };

  publicAPI.copyStructure = function (other) {
    publicAPI.initializeFields();
    model.copyFieldFlags = other.getCopyFieldFlags().map(function (x) {
      return x;
    }); // Deep-copy
    model.arrays = other.arrays().map(function (x) {
      return { array: x };
    }); // Deep-copy
    // TODO: Copy array information objects (once we support information objects)
  };

  publicAPI.getNumberOfArrays = function () {
    return model.arrays.length;
  };
  publicAPI.getNumberOfActiveArrays = function () {
    return model.arrays.length;
  };
  publicAPI.addArray = function (arr) {
    model.arrays = [].concat(model.arrays, { data: arr });return model.arrays.length - 1;
  };
  publicAPI.removeAllArrays = function () {
    model.arrays = [];
  };
  publicAPI.removeArray = function (arrayName) {
    model.arrays = model.arrays.filter(function (entry) {
      return arrayName !== entry.data.getName();
    });
  };
  publicAPI.removeArrayByIndex = function (arrayIdx) {
    model.arrays = model.arrays.filter(function (entry, idx) {
      return idx !== arrayIdx;
    });
  };
  publicAPI.getArrays = function () {
    return model.arrays.map(function (entry) {
      return entry.data;
    });
  };
  publicAPI.getArray = function (arraySpec) {
    return typeof arraySpec === 'number' ? publicAPI.getArrayByIndex(arraySpec) : publicAPI.getArrayByName(arraySpec);
  };
  publicAPI.getArrayByName = function (arrayName) {
    return model.arrays.reduce(function (a, b, i) {
      return b.data.getName() === arrayName ? b.data : a;
    }, null);
  };
  publicAPI.getArrayWithIndex = function (arrayName) {
    return model.arrays.reduce(function (a, b, i) {
      return b.data && b.data.getName() === arrayName ? { array: b.data, index: i } : a;
    }, { array: null, index: -1 });
  };
  publicAPI.getArrayByIndex = function (idx) {
    return idx >= 0 && idx < model.arrays.length ? model.arrays[idx].data : null;
  };
  publicAPI.hasArray = function (arrayName) {
    return publicAPI.getArrayWithIndex(arrayName).index >= 0;
  };
  publicAPI.getArrayName = function (idx) {
    var arr = model.arrays[idx];
    return arr ? arr.data.getName() : '';
  };
  publicAPI.getCopyFieldFlags = function () {
    return model.copyFieldFlags;
  };
  publicAPI.getFlag = function (arrayName) {
    return model.copyFieldFlags[arrayName];
  };
  publicAPI.passData = function (other) {
    other.getArrays().forEach(function (arr, idx) {
      var copyFlag = publicAPI.getFlag(arr.getName());
      if (copyFlag !== false && !(model.doCopyAllOff && copyFlag !== true) && arr) {
        publicAPI.addArray(arr);
      }
    });
  };
  publicAPI.copyFieldOn = function (arrayName) {
    model.copyFieldFlags[arrayName] = true;
  };
  publicAPI.copyFieldOff = function (arrayName) {
    model.copyFieldFlags[arrayName] = false;
  };
  publicAPI.copyAllOn = function () {
    if (!model.doCopyAllOn || model.doCopyAllOff) {
      model.doCopyAllOn = true;
      model.doCopyAllOff = false;
      publicAPI.modified();
    }
  };
  publicAPI.copyAllOff = function () {
    if (model.doCopyAllOn || !model.doCopyAllOff) {
      model.doCopyAllOn = false;
      model.doCopyAllOff = true;
      publicAPI.modified();
    }
  };
  publicAPI.clearFieldFlags = function () {
    model.copyFieldFlags = {};
  };
  publicAPI.deepCopy = function (other) {
    model.arrays = other.getArrays().map(function (arr) {
      var arrNew = arr.newClone();
      arrNew.deepCopy(arr);
      return { data: arrNew };
    });
  };
  publicAPI.copyFlags = function (other) {
    return other.getCopyFieldFlags().map(function (x) {
      return x;
    });
  };
  // TODO: publicAPI.squeeze = () => model.arrays.forEach(entry => entry.data.squeeze());
  publicAPI.reset = function () {
    return model.arrays.forEach(function (entry) {
      return entry.data.reset();
    });
  };
  // TODO: getActualMemorySize
  publicAPI.getMTime = function () {
    return model.arrays.reduce(function (a, b) {
      return b.data.getMTime() > a ? b.data.getMTime() : a;
    }, model.mtime);
  };
  // TODO: publicAPI.getField = (ids, other) => { copy ids from other into this model's arrays }
  // TODO: publicAPI.getArrayContainingComponent = (component) => ...
  publicAPI.getNumberOfComponents = function () {
    return model.arrays.reduce(function (a, b) {
      return a + b.data.getNumberOfComponents();
    }, 0);
  };
  publicAPI.getNumberOfTuples = function () {
    return model.arrays.length > 0 ? model.arrays[0].getNumberOfTuples() : 0;
  };

  publicAPI.getState = function () {
    var result = superGetState();
    result.arrays = model.arrays.map(function (item) {
      return { data: item.data.getState() };
    });
    return result;
  };
}

var DEFAULT_VALUES = {
  arrays: [],
  copyFieldFlags: [], // fields not to copy
  doCopyAllOn: true,
  doCopyAllOff: false
};

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  _macro2.default.obj(publicAPI, model);

  vtkFieldData(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkFieldData');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var AttributeTypes = exports.AttributeTypes = {
  SCALARS: 0,
  VECTORS: 1,
  NORMALS: 2,
  TCOORDS: 3,
  TENSORS: 4,
  GLOBALIDS: 5,
  PEDIGREEIDS: 6,
  EDGEFLAG: 7,
  NUM_ATTRIBUTES: 8
};

var AttributeLimitTypes = exports.AttributeLimitTypes = {
  MAX: 0,
  EXACT: 1,
  NOLIMIT: 2
};

var CellGhostTypes = exports.CellGhostTypes = {
  DUPLICATECELL: 1, // the cell is present on multiple processors
  HIGHCONNECTIVITYCELL: 2, // the cell has more neighbors than in a regular mesh
  LOWCONNECTIVITYCELL: 4, // the cell has less neighbors than in a regular mesh
  REFINEDCELL: 8, // other cells are present that refines it.
  EXTERIORCELL: 16, // the cell is on the exterior of the data set
  HIDDENCELL: 32 // the cell is needed to maintain connectivity, but the data values should be ignored.
};

var PointGhostTypes = exports.PointGhostTypes = {
  DUPLICATEPOINT: 1, // the cell is present on multiple processors
  HIDDENPOINT: 2 // the point is needed to maintain connectivity, but the data values should be ignored.
};

var AttributeCopyOperations = exports.AttributeCopyOperations = {
  COPYTUPLE: 0,
  INTERPOLATE: 1,
  PASSDATA: 2,
  ALLCOPY: 3 //all of the above
};

var ghostArrayName = exports.ghostArrayName = 'vtkGhostType';

exports.default = {
  AttributeTypes: AttributeTypes,
  AttributeLimitTypes: AttributeLimitTypes,
  CellGhostTypes: CellGhostTypes,
  PointGhostTypes: PointGhostTypes,
  ghostArrayName: ghostArrayName,
  AttributeCopyOperations: AttributeCopyOperations
};

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _glMatrix = __webpack_require__(2);

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _BoundingBox = __webpack_require__(32);

var _BoundingBox2 = _interopRequireDefault(_BoundingBox);

var _Math = __webpack_require__(1);

var _Math2 = _interopRequireDefault(_Math);

var _Prop = __webpack_require__(100);

var _Prop2 = _interopRequireDefault(_Prop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function notImplemented(method) {
  return function () {
    return _macro2.default.vtkErrorMacro('vtkProp3D::' + method + ' - NOT IMPLEMENTED');
  };
}

// ----------------------------------------------------------------------------
// vtkProp3D methods
// ----------------------------------------------------------------------------

function vtkProp3D(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkProp3D');

  // Capture 'parentClass' api for internal use
  var superClass = Object.assign({}, publicAPI);

  publicAPI.getMTime = function () {
    return Math.max(superClass.getMTime(), publicAPI.getUserTransformMatrixMTime());
  };

  publicAPI.getUserTransformMatrixMTime = function () {
    return Math.max(model.userMatrix ? model.userMatrix.getMTime() : 0, model.userTransform ? model.userTransform.getMTime() : 0);
  };

  publicAPI.addPosition = function (deltaXYZ) {
    model.position = model.position.map(function (value, index) {
      return value + deltaXYZ[index];
    });
    publicAPI.modified();
  };

  publicAPI.getOrientationWXYZ = function () {
    var q = _glMatrix.quat.create();
    _glMatrix.mat4.getRotation(q, model.rotation);
    var oaxis = _glMatrix.vec3.create();
    var w = _glMatrix.quat.getAxisAngle(oaxis, q);
    return [_Math2.default.degreesFromRadians(w), oaxis[0], oaxis[1], oaxis[2]];
  };

  // FIXME
  publicAPI.addOrientation = notImplemented('addOrientation');
  publicAPI.getOrientation = notImplemented('getOrientation');
  publicAPI.setOrientation = notImplemented('setOrientation');

  publicAPI.rotateX = function (val) {
    if (val !== 0.0) {
      model.isIdentity = false;
    }
    _glMatrix.mat4.rotateX(model.rotation, model.rotation, _Math2.default.radiansFromDegrees(val));
  };

  publicAPI.rotateY = function (val) {
    if (val !== 0.0) {
      model.isIdentity = false;
    }
    _glMatrix.mat4.rotateY(model.rotation, model.rotation, _Math2.default.radiansFromDegrees(val));
  };

  publicAPI.rotateZ = function (val) {
    if (val !== 0.0) {
      model.isIdentity = false;
    }
    _glMatrix.mat4.rotateZ(model.rotation, model.rotation, _Math2.default.radiansFromDegrees(val));
  };

  publicAPI.rotateWXYZ = function (degrees, x, y, z) {
    if (degrees === 0.0 || x === 0.0 && y === 0.0 && z === 0.0) {
      return;
    }

    // convert to radians
    var angle = _Math2.default.radiansFromDegrees(degrees);

    var q = _glMatrix.quat.create();
    _glMatrix.quat.setAxisAngle(q, [x, y, z], angle);

    var quatMat = _glMatrix.mat4.create();
    _glMatrix.mat4.fromQuat(quatMat, q);
    _glMatrix.mat4.multiply(model.rotation, model.rotation, quatMat);
  };

  publicAPI.SetUserTransform = notImplemented('SetUserTransform');
  publicAPI.SetUserMatrix = notImplemented('SetUserMatrix');

  publicAPI.getMatrix = function () {
    publicAPI.computeMatrix();
    return model.matrix;
  };

  publicAPI.computeMatrix = function () {
    if (model.isIdentity) {
      return;
    }

    // check whether or not need to rebuild the matrix
    if (publicAPI.getMTime() > model.matrixMTime.getMTime()) {
      _glMatrix.mat4.identity(model.matrix);
      _glMatrix.mat4.translate(model.matrix, model.matrix, model.origin);
      _glMatrix.mat4.translate(model.matrix, model.matrix, model.position);
      _glMatrix.mat4.multiply(model.matrix, model.matrix, model.rotation);
      _glMatrix.mat4.scale(model.matrix, model.matrix, model.scale);
      _glMatrix.mat4.translate(model.matrix, model.matrix, [-model.origin[0], -model.origin[1], -model.origin[2]]);
      _glMatrix.mat4.transpose(model.matrix, model.matrix);

      model.matrixMTime.modified();
    }
  };

  publicAPI.getCenter = function () {
    return _BoundingBox2.default.getCenter(model.bounds);
  };
  publicAPI.getLength = function () {
    return _BoundingBox2.default.getLength(model.bounds);
  };
  publicAPI.getXRange = function () {
    return _BoundingBox2.default.getXRange(model.bounds);
  };
  publicAPI.getYRange = function () {
    return _BoundingBox2.default.getYRange(model.bounds);
  };
  publicAPI.getZRange = function () {
    return _BoundingBox2.default.getZRange(model.bounds);
  };

  publicAPI.pokeMatrix = notImplemented('pokeMatrix');
  publicAPI.getUserMatrix = notImplemented('GetUserMatrix');

  function updateIdentityFlag() {
    var noChange = true;
    [model.origin, model.position].forEach(function (array) {
      if (noChange && array.filter(function (v) {
        return v !== 0;
      }).length) {
        model.isIdentity = false;
        noChange = false;
      }
    });

    // if (model.userMatrix || model.userTransform) {
    //   model.isIdentity = false;
    //   noChange = false;
    // }

    if (noChange && model.scale.filter(function (v) {
      return v !== 1;
    }).length) {
      model.isIdentity = false;
    }
  }

  publicAPI.onModified(updateIdentityFlag);
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  origin: [0, 0, 0],
  position: [0, 0, 0],
  rotation: null,
  scale: [1, 1, 1],
  bounds: [1, -1, 1, -1, 1, -1],

  userMatrix: null,
  userTransform: null,

  cachedProp3D: null,
  isIdentity: true,
  matrixMTime: null
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  _Prop2.default.extend(publicAPI, model, initialValues);

  model.matrixMTime = {};
  _macro2.default.obj(model.matrixMTime);

  // Build VTK API
  _macro2.default.get(publicAPI, model, ['bounds', 'isIdentity']);
  _macro2.default.setGetArray(publicAPI, model, ['origin', 'position', 'orientation', 'scale'], 3);

  // Object internal instance
  model.matrix = _glMatrix.mat4.create();
  model.rotation = _glMatrix.mat4.create();
  model.transform = null; // FIXME

  // Object methods
  vtkProp3D(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkProp3D');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function notImplemented(method) {
  return function () {
    return _macro2.default.vtkErrorMacro('vtkProp::' + method + ' - NOT IMPLEMENTED');
  };
}

// ----------------------------------------------------------------------------
// vtkProp methods
// ----------------------------------------------------------------------------

function vtkProp(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkProp');

  publicAPI.getMTime = function () {
    return Math.max(model.mtime, model.textures.reduce(function (acc, val) {
      return Math.max(val.getMTime(), acc);
    }, 0));
  };

  publicAPI.getActors = function () {
    return null;
  };
  publicAPI.getActors2D = function () {
    return null;
  };
  publicAPI.getVolumes = function () {
    return null;
  };

  publicAPI.pick = notImplemented('pick');
  publicAPI.hasKey = notImplemented('hasKey');

  publicAPI.getRedrawMTime = function () {
    return model.mtime;
  };

  publicAPI.setEstimatedRenderTime = function (t) {
    model.estimatedRenderTime = t;
    model.savedEstimatedRenderTime = t;
  };

  publicAPI.restoreEstimatedRenderTime = function () {
    model.estimatedRenderTime = model.savedEstimatedRenderTime;
  };

  publicAPI.addEstimatedRenderTime = function (t) {
    model.estimatedRenderTime += t;
  };

  publicAPI.setAllocatedRenderTime = function (t) {
    model.allocatedRenderTime = t;
    model.savedEstimatedRenderTime = model.estimatedRenderTime;
    model.estimatedRenderTime = 0;
  };

  publicAPI.getSupportsSelection = function () {
    return false;
  };

  publicAPI.getTextures = function () {
    return model.textures;
  };
  publicAPI.hasTexture = function (texture) {
    return !!model.textures.filter(function (item) {
      return item === texture;
    }).length;
  };
  publicAPI.addTexture = function (texture) {
    if (texture && !publicAPI.hasTexture(texture)) {
      model.textures = model.textures.concat(texture);
      publicAPI.modified();
    }
  };

  publicAPI.removeTexture = function (texture) {
    var newTextureList = model.textures.filter(function (item) {
      return item === texture;
    });
    if (model.texture.length !== newTextureList.length) {
      model.textures = newTextureList;
      publicAPI.modified();
    }
  };

  publicAPI.removeAllTextures = function () {
    model.textures = [];
    publicAPI.modified();
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  visibility: true,
  pickable: true,
  dragable: true,
  useBounds: true,
  allocatedRenderTime: 10,
  estimatedRenderTime: 0,
  savedEstimatedRenderTime: 0,
  renderTimeMultiplier: 1,
  paths: null,
  textures: []
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  _macro2.default.obj(publicAPI, model);
  _macro2.default.get(publicAPI, model, ['estimatedRenderTime', 'allocatedRenderTime']);
  _macro2.default.setGet(publicAPI, model, ['visibility', 'pickable', 'dragable', 'useBounds', 'renderTimeMultiplier']);

  // Object methods
  vtkProp(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkProp');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _Constants = __webpack_require__(15);

var _Constants2 = _interopRequireDefault(_Constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Representation = _Constants2.default.Representation,
    Interpolation = _Constants2.default.Interpolation;


function notImplemented(method) {
  return function () {
    return _macro2.default.vtkErrorMacro('vtkProperty::' + method + ' - NOT IMPLEMENTED');
  };
}

// ----------------------------------------------------------------------------
// vtkProperty methods
// ----------------------------------------------------------------------------

function vtkProperty(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkProperty');

  publicAPI.setColor = function (r, g, b) {
    if (model.color[0] !== r || model.color[1] !== g || model.color[2] !== b) {
      model.color[0] = r;
      model.color[1] = g;
      model.color[2] = b;
      publicAPI.modified();
    }

    publicAPI.setDiffuseColor(model.color);
    publicAPI.setAmbientColor(model.color);
    publicAPI.setSpecularColor(model.color);
  };

  publicAPI.computeCompositeColor = notImplemented('ComputeCompositeColor');
  publicAPI.getColor = function () {
    // Inline computeCompositeColor
    var norm = 0.0;
    if (model.ambient + model.diffuse + model.specular > 0) {
      norm = 1.0 / (model.ambient + model.diffuse + model.specular);
    }

    for (var i = 0; i < 3; i++) {
      model.color[i] = norm * (model.ambient * model.ambientColor[i] + model.diffuse * model.diffuseColor[i] + model.specular * model.specularColor[i]);
    }

    return [].concat(model.color);
  };

  publicAPI.addShaderVariable = notImplemented('AddShaderVariable');

  publicAPI.setInterpolationToFlat = function () {
    return publicAPI.setInterpolation(Interpolation.FLAT);
  };
  publicAPI.setInterpolationToGouraud = function () {
    return publicAPI.setInterpolation(Interpolation.GOURAUD);
  };
  publicAPI.setInterpolationToPhong = function () {
    return publicAPI.setInterpolation(Interpolation.PHONG);
  };
  publicAPI.getInterpolationAsString = function () {
    return _macro2.default.enumToString(Interpolation, model.interpolation);
  };

  publicAPI.setRepresentationToWireframe = function () {
    return publicAPI.setRepresentation(Representation.WIREFRAME);
  };
  publicAPI.setRepresentationToSurface = function () {
    return publicAPI.setRepresentation(Representation.SURFACE);
  };
  publicAPI.setRepresentationToPoints = function () {
    return publicAPI.setRepresentation(Representation.POINTS);
  };
  publicAPI.getRepresentationAsString = function () {
    return _macro2.default.enumToString(Representation, model.representation);
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  color: [1, 1, 1],
  ambientColor: [1, 1, 1],
  diffuseColor: [1, 1, 1],
  specularColor: [1, 1, 1],
  edgeColor: [0, 0, 0],

  ambient: 0,
  diffuse: 1,
  specular: 0,
  specularPower: 1,
  opacity: 1,
  interpolation: Interpolation.GOURAUD,
  representation: Representation.SURFACE,
  edgeVisibility: false,
  backfaceCulling: false,
  frontfaceCulling: false,
  pointSize: 1,
  lineWidth: 1,
  lighting: true,

  shading: false,
  materialName: null
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  _macro2.default.obj(publicAPI, model);

  _macro2.default.setGet(publicAPI, model, ['lighting', 'interpolation', 'ambient', 'diffuse', 'specular', 'specularPower', 'opacity', 'edgeVisibility', 'lineWidth', 'pointSize', 'backfaceCulling', 'frontfaceCulling', 'representation']);
  _macro2.default.setGetArray(publicAPI, model, ['ambientColor', 'specularColor', 'diffuseColor', 'edgeColor'], 3);

  // Object methods
  vtkProperty(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkProperty');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _AbstractMapper = __webpack_require__(103);

var _AbstractMapper2 = _interopRequireDefault(_AbstractMapper);

var _Math = __webpack_require__(1);

var _Math2 = _interopRequireDefault(_Math);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------------------------------------------------------------
// vtkAbstractMapper methods
// ----------------------------------------------------------------------------

function vtkAbstractMapper3D(publicAPI, model) {
  publicAPI.getBounds = function () {
    return 0;
  };

  publicAPI.getBounds = function (bounds) {
    publicAPI.getBounds();
    for (var i = 0; i < 6; i++) {
      bounds[i] = model.bounds[i];
    }
  };

  publicAPI.getCenter = function () {
    for (var _len = arguments.length, center = Array(_len), _key = 0; _key < _len; _key++) {
      center[_key] = arguments[_key];
    }

    publicAPI.getBounds();
    for (var i = 0; i < 3; i++) {
      model.center[i] = (model.bounds[2 * i + 1] + model.bounds[2 * i]) / 2.0;
    }
    if (Array.isArray(center[0])) {
      center[0] = model.center.splice(0);
    }
    return model.center;
  };

  publicAPI.getLength = function () {
    var diff = 0.0;
    var l = 0.0;
    publicAPI.getBounds();
    for (var i = 0; i < 3; i++) {
      diff = model.bounds[2 * i + 1] - model.bounds[2 * i];
      l += diff * diff;
    }

    return Math.sqrt(l);
  };

  publicAPI.getClippingPlaneInDataCoords = function (propMatrix, i, hnormal) {
    var clipPlanes = model.clippingPlanes;
    var mat = propMatrix;

    if (clipPlanes) {
      var n = clipPlanes.length;
      if (i >= 0 && i < n) {
        // Get the plane
        var plane = clipPlanes[i];
        var normal = plane.getNormal();
        var origin = plane.getOrigin();

        // Compute the plane equation
        var v1 = normal[0];
        var v2 = normal[1];
        var v3 = normal[2];
        var v4 = -(v1 * origin[0] + v2 * origin[1] + v3 * origin[2]);

        // Transform normal from world to data coords
        hnormal[0] = v1 * mat[0] + v2 * mat[4] + v3 * mat[8] + v4 * mat[12];
        hnormal[1] = v1 * mat[1] + v2 * mat[5] + v3 * mat[9] + v4 * mat[13];
        hnormal[2] = v1 * mat[2] + v2 * mat[6] + v3 * mat[10] + v4 * mat[14];
        hnormal[3] = v1 * mat[3] + v2 * mat[7] + v3 * mat[11] + v4 * mat[15];

        return;
      }
    }
    _macro2.default.vtkErrorMacro('Clipping plane index ' + i + ' is out of range.');
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  bounds: [1, -1, 1, -1, 1, -1],
  center: [0, 0, 0]
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);
  // Inheritance
  _AbstractMapper2.default.extend(publicAPI, model, initialValues);

  if (!model.bounds) {
    _Math2.default.uninitializeBounds(model.bounds);
  }

  if (!model.center) {
    model.center = [0.0, 0.0, 0.0];
  }

  vtkAbstractMapper3D(publicAPI, model);
}

// ----------------------------------------------------------------------------

exports.default = { extend: extend };

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------------------------------------------------------------
// vtkAbstractMapper methods
// ----------------------------------------------------------------------------

function vtkAbstractMapper(publicAPI, model) {
  publicAPI.addClippingPlane = function (plane) {
    if (plane.getClassName() !== 'vtkPlane') {
      return;
    }
    model.clippingPlanes.push(plane);
  };

  publicAPI.getNumberOfClippingPlanes = function () {
    return model.clippingPlanes.length;
  };

  publicAPI.removeAllClippingPlanes = function () {
    model.clippingPlanes.length = 0;
  };

  publicAPI.removeClippingPlane = function (i) {
    if (i < 0 || i >= 6) {
      return;
    }
    model.clippingPlanes.splice(i, 1);
  };

  publicAPI.getClippingPlanes = function () {
    return model.clippingPlanes;
  };

  publicAPI.setClippingPlanes = function (planes) {
    if (!planes) {
      return;
    }
    if (!Array.isArray(planes)) {
      publicAPI.addClippingPlane(planes);
    } else {
      var nbPlanes = planes.length;
      for (var i = 0; i < nbPlanes && i < 6; i++) {
        publicAPI.addClippingPlane(planes[i]);
      }
    }
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  clippingPlanes: []
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  _macro2.default.obj(publicAPI, model);

  if (!model.clippingPlanes) {
    model.clippingPlanes = [];
  }

  vtkAbstractMapper(publicAPI, model);
}

// ----------------------------------------------------------------------------
exports.default = { extend: extend };

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _DataSet = __webpack_require__(35);

var _DataSet2 = _interopRequireDefault(_DataSet);

var _StructuredData = __webpack_require__(105);

var _StructuredData2 = _interopRequireDefault(_StructuredData);

var _Constants = __webpack_require__(38);

var _glMatrix = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vtkErrorMacro = _macro2.default.vtkErrorMacro;

// ----------------------------------------------------------------------------
// vtkImageData methods
// ----------------------------------------------------------------------------

function vtkImageData(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkImageData');

  publicAPI.setExtent = function () {
    for (var _len = arguments.length, inExtent = Array(_len), _key = 0; _key < _len; _key++) {
      inExtent[_key] = arguments[_key];
    }

    if (model.deleted) {
      vtkErrorMacro('instance deleted - cannot call any method');
      return;
    }

    if (!inExtent || inExtent.length !== 6) {
      return;
    }

    var changeDetected = false;
    model.extent.forEach(function (item, index) {
      if (item !== inExtent[index]) {
        if (changeDetected) {
          return;
        }
        changeDetected = true;
      }
    });

    if (changeDetected) {
      model.extent = [].concat(inExtent);
      model.dataDescription = _StructuredData2.default.getDataDescriptionFromExtent(model.extent);
      publicAPI.modified();
    }
  };

  publicAPI.setDimensions = function () {
    var i;
    var j;
    var k;

    if (model.deleted) {
      vtkErrorMacro('instance deleted - cannot call any method');
      return;
    }

    if (arguments.length === 1) {
      var array = arguments.length <= 0 ? undefined : arguments[0];
      i = array[0];
      j = array[1];
      k = array[2];
    } else if (arguments.length === 3) {
      i = arguments.length <= 0 ? undefined : arguments[0];
      j = arguments.length <= 1 ? undefined : arguments[1];
      k = arguments.length <= 2 ? undefined : arguments[2];
    } else {
      vtkErrorMacro('Bad dimension specification');
      return;
    }

    publicAPI.setExtent(0, i - 1, 0, j - 1, 0, k - 1);
  };

  publicAPI.getDimensions = function () {
    return [model.extent[1] - model.extent[0] + 1, model.extent[3] - model.extent[2] + 1, model.extent[5] - model.extent[4] + 1];
  };

  publicAPI.getNumberOfCells = function () {
    var dims = publicAPI.getDimensions();
    var nCells = 1;

    for (var i = 0; i < 3; i++) {
      if (dims[i] === 0) {
        return 0;
      }
      if (dims[i] > 1) {
        nCells *= dims[i] - 1;
      }
    }

    return nCells;
  };

  publicAPI.getNumberOfPoints = function () {
    var dims = publicAPI.getDimensions();
    return dims[0] * dims[1] * dims[2];
  };

  publicAPI.getPoint = function (index) {
    var dims = publicAPI.getDimensions();
    var ijk = _glMatrix.vec3.fromValues(0, 0, 0);
    var coords = [0, 0, 0];

    if (dims[0] === 0 || dims[1] === 0 || dims[2] === 0) {
      vtkErrorMacro('Requesting a point from an empty image.');
      return null;
    }

    switch (model.dataDescription) {
      case _Constants.StructuredType.EMPTY:
        return null;

      case _Constants.StructuredType.SINGLE_POINT:
        break;

      case _Constants.StructuredType.X_LINE:
        ijk[0] = index;
        break;

      case _Constants.StructuredType.Y_LINE:
        ijk[1] = index;
        break;

      case _Constants.StructuredType.Z_LINE:
        ijk[2] = index;
        break;

      case _Constants.StructuredType.XY_PLANE:
        ijk[0] = index % dims[0];
        ijk[1] = index / dims[0];
        break;

      case _Constants.StructuredType.YZ_PLANE:
        ijk[1] = index % dims[1];
        ijk[2] = index / dims[1];
        break;

      case _Constants.StructuredType.XZ_PLANE:
        ijk[0] = index % dims[0];
        ijk[2] = index / dims[0];
        break;

      case _Constants.StructuredType.XYZ_GRID:
        ijk[0] = index % dims[0];
        ijk[1] = index / dims[0] % dims[1];
        ijk[2] = index / (dims[0] * dims[1]);
        break;

      default:
        vtkErrorMacro('Invalid dataDescription');
        break;
    }

    var vout = _glMatrix.vec3.create();
    publicAPI.indexToWorldVec3(ijk, vout);
    _glMatrix.vec3.copy(coords, vout);
    return coords;
  };

  // vtkCell *GetCell(vtkIdType cellId) VTK_OVERRIDE;
  // void GetCell(vtkIdType cellId, vtkGenericCell *cell) VTK_OVERRIDE;
  // void GetCellBounds(vtkIdType cellId, double bounds[6]) VTK_OVERRIDE;
  // virtual vtkIdType FindPoint(double x, double y, double z)
  // {
  //   return this->vtkDataSet::FindPoint(x, y, z);
  // }
  // vtkIdType FindPoint(double x[3]) VTK_OVERRIDE;
  // vtkIdType FindCell(
  //   double x[3], vtkCell *cell, vtkIdType cellId, double tol2,
  //   int& subId, double pcoords[3], double *weights) VTK_OVERRIDE;
  // vtkIdType FindCell(
  //   double x[3], vtkCell *cell, vtkGenericCell *gencell,
  //   vtkIdType cellId, double tol2, int& subId,
  //   double pcoords[3], double *weights) VTK_OVERRIDE;
  // vtkCell *FindAndGetCell(double x[3], vtkCell *cell, vtkIdType cellId,
  //                                 double tol2, int& subId, double pcoords[3],
  //                                 double *weights) VTK_OVERRIDE;
  // int GetCellType(vtkIdType cellId) VTK_OVERRIDE;
  // void GetCellPoints(vtkIdType cellId, vtkIdList *ptIds) VTK_OVERRIDE
  //   {vtkStructuredData::GetCellPoints(cellId,ptIds,this->DataDescription,
  //                                     this->GetDimensions());}
  // void GetPointCells(vtkIdType ptId, vtkIdList *cellIds) VTK_OVERRIDE
  //   {vtkStructuredData::GetPointCells(ptId,cellIds,this->GetDimensions());}
  // void ComputeBounds() VTK_OVERRIDE;
  // int GetMaxCellSize() VTK_OVERRIDE {return 8;}; //voxel is the largest

  publicAPI.getBounds = function () {
    return publicAPI.extentToBounds(model.extent);
  };

  publicAPI.extentToBounds = function (ex) {
    var corners = [ex[0], ex[2], ex[4], ex[1], ex[2], ex[4], ex[0], ex[3], ex[4], ex[1], ex[3], ex[4], ex[0], ex[2], ex[5], ex[1], ex[2], ex[5], ex[0], ex[3], ex[5], ex[1], ex[3], ex[5]];

    var idx = _glMatrix.vec3.fromValues(corners[0], corners[1], corners[2]);
    var vout = _glMatrix.vec3.create();
    publicAPI.indexToWorldVec3(idx, vout);
    var bounds = [vout[0], vout[0], vout[1], vout[1], vout[2], vout[2]];
    for (var i = 3; i < 24; i += 3) {
      _glMatrix.vec3.set(idx, corners[i], corners[i + 1], corners[i + 2]);
      publicAPI.indexToWorldVec3(idx, vout);
      if (vout[0] < bounds[0]) {
        bounds[0] = vout[0];
      }
      if (vout[1] < bounds[2]) {
        bounds[2] = vout[1];
      }
      if (vout[2] < bounds[4]) {
        bounds[4] = vout[2];
      }
      if (vout[0] > bounds[1]) {
        bounds[1] = vout[0];
      }
      if (vout[1] > bounds[3]) {
        bounds[3] = vout[1];
      }
      if (vout[2] > bounds[5]) {
        bounds[5] = vout[2];
      }
    }

    return bounds;
  };

  publicAPI.computeTransforms = function () {
    var rotq = _glMatrix.quat.create();
    _glMatrix.quat.fromMat3(rotq, model.direction);
    var trans = _glMatrix.vec3.fromValues(model.origin[0], model.origin[1], model.origin[2]);
    var scale = _glMatrix.vec3.fromValues(model.spacing[0], model.spacing[1], model.spacing[2]);
    _glMatrix.mat4.fromRotationTranslationScale(model.indexToWorld, rotq, trans, scale);
    _glMatrix.mat4.invert(model.worldToIndex, model.indexToWorld);
  };

  //
  // The direction matrix is a 3x3 basis for the I, J, K axes
  // of the image. The rows of the matrix correspond to the
  // axes directions in world coordinates. Direction must
  // form an orthonormal basis, results are undefined if
  // it is not.
  //
  publicAPI.setDirection = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    if (model.deleted) {
      vtkErrorMacro('instance deleted - cannot call any method');
      return false;
    }

    var array = args;
    // allow an array passed as a single arg.
    if (array.length === 1 && Array.isArray(array[0])) {
      array = array[0];
    }

    if (array.length !== 9) {
      throw new RangeError('Invalid number of values for array setter');
    }
    var changeDetected = false;
    model.direction.forEach(function (item, index) {
      if (item !== array[index]) {
        if (changeDetected) {
          return;
        }
        changeDetected = true;
      }
    });

    if (changeDetected) {
      for (var i = 0; i < 9; ++i) {
        model.direction[i] = array[i];
      }
      publicAPI.modified();
    }
    return true;
  };

  // this is the fast version, requires vec3 arguments
  publicAPI.indexToWorldVec3 = function (vin, vout) {
    _glMatrix.vec3.transformMat4(vout, vin, model.indexToWorld);
  };

  // slow version for generic arrays
  publicAPI.indexToWorld = function (ain, aout) {
    var vin = _glMatrix.vec3.fromValues(ain[0], ain[1], ain[2]);
    var vout = _glMatrix.vec3.create();
    _glMatrix.vec3.transformMat4(vout, vin, model.indexToWorld);
    _glMatrix.vec3.copy(aout, vout);
  };

  // this is the fast version, requires vec3 arguments
  publicAPI.worldToIndexVec3 = function (vin, vout) {
    _glMatrix.vec3.transformMat4(vout, vin, model.worldToIndex);
  };

  // slow version for generic arrays
  publicAPI.worldToIndex = function (ain, aout) {
    var vin = _glMatrix.vec3.fromValues(ain[0], ain[1], ain[2]);
    var vout = _glMatrix.vec3.create();
    _glMatrix.vec3.transformMat4(vout, vin, model.worldToIndex);
    _glMatrix.vec3.copy(aout, vout);
  };

  // Make sure the transform is correct
  publicAPI.onModified(publicAPI.computeTransforms);
  publicAPI.computeTransforms();
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  direction: null, // a mat3
  indexToWorld: null, // a mat4
  worldToIndex: null, // a mat4
  spacing: [1.0, 1.0, 1.0],
  origin: [0.0, 0.0, 0.0],
  extent: [0, -1, 0, -1, 0, -1],
  dataDescription: _Constants.StructuredType.EMPTY
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  _DataSet2.default.extend(publicAPI, model, initialValues);

  if (!model.direction) {
    model.direction = _glMatrix.mat3.create();
  } else if (Array.isArray(model.direction)) {
    var dvals = model.direction.slice(0);
    model.direction = _glMatrix.mat3.create();
    for (var i = 0; i < 9; ++i) {
      model.direction[i] = dvals[i];
    }
  }

  model.indexToWorld = _glMatrix.mat4.create();
  model.worldToIndex = _glMatrix.mat4.create();

  // Set/Get methods
  _macro2.default.get(publicAPI, model, ['direction', 'indexToWorld', 'worldToIndex']);
  _macro2.default.setGetArray(publicAPI, model, ['origin', 'spacing'], 3);
  _macro2.default.getArray(publicAPI, model, ['extent'], 6);

  // Object specific methods
  vtkImageData(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkImageData');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDataDescriptionFromExtent = getDataDescriptionFromExtent;

var _Constants = __webpack_require__(38);

function getDataDescriptionFromExtent(inExt) {
  var dataDim = 0;
  for (var i = 0; i < 3; ++i) {
    if (inExt[i * 2] < inExt[i * 2 + 1]) {
      dataDim++;
    }
  }

  if (inExt[0] > inExt[1] || inExt[2] > inExt[3] || inExt[4] > inExt[5]) {
    return _Constants.StructuredType.EMPTY;
  }

  if (dataDim === 3) {
    return _Constants.StructuredType.XYZ_GRID;
  } else if (dataDim === 2) {
    if (inExt[0] === inExt[1]) {
      return _Constants.StructuredType.YZ_PLANE;
    } else if (inExt[2] === inExt[3]) {
      return _Constants.StructuredType.XZ_PLANE;
    }
    return _Constants.StructuredType.XY_PLANE;
  } else if (dataDim === 1) {
    if (inExt[0] < inExt[1]) {
      return _Constants.StructuredType.X_LINE;
    } else if (inExt[2] < inExt[3]) {
      return _Constants.StructuredType.Y_LINE;
    }
    return _Constants.StructuredType.Z_LINE;
  }

  return _Constants.StructuredType.SINGLE_POINT;
}

exports.default = {
  getDataDescriptionFromExtent: getDataDescriptionFromExtent
};

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _Math = __webpack_require__(1);

var _Math2 = _interopRequireDefault(_Math);

var _ScalarsToColors = __webpack_require__(107);

var _ScalarsToColors2 = _interopRequireDefault(_ScalarsToColors);

var _Constants = __webpack_require__(23);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------------------------------------------------------------
// Global methods
// ----------------------------------------------------------------------------

// Add module-level functions or api that you want to expose statically via
// the next section...

// ----------------------------------------------------------------------------
// Static API
// ----------------------------------------------------------------------------

var BELOW_RANGE_COLOR_INDEX = 0;
var ABOVE_RANGE_COLOR_INDEX = 1;
var NAN_COLOR_INDEX = 2;

// ----------------------------------------------------------------------------
// vtkMyClass methods
// ----------------------------------------------------------------------------

function vtkLookupTable(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkLookupTable');

  //----------------------------------------------------------------------------
  // Description:
  // Return true if all of the values defining the mapping have an opacity
  // equal to 1. Default implementation return true.
  publicAPI.isOpaque = function () {
    if (model.opaqueFlagBuildTime.getMTime() < publicAPI.getMTime()) {
      var opaque = true;
      if (model.nanColor[3] < 1.0) {
        opaque = 0;
      }
      if (model.useBelowRangeColor && model.belowRangeColor[3] < 1.0) {
        opaque = 0;
      }
      if (model.useAboveRangeColor && model.aboveRangeColor[3] < 1.0) {
        opaque = 0;
      }
      for (var i = 3; i < model.table.length && opaque; i += 4) {
        if (model.table[i] < 255) {
          opaque = false;
        }
      }
      model.opaqueFlag = opaque;
      model.opaqueFlagBuildTime.modified();
    }

    return model.opaqueFlag;
  };

  publicAPI.usingLogScale = function () {
    return false;
  };

  //----------------------------------------------------------------------------
  publicAPI.getNumberOfAvailableColors = function () {
    return model.table.length;
  };

  //----------------------------------------------------------------------------
  // Apply shift/scale to the scalar value v and return the index.
  publicAPI.linearIndexLookup = function (v, p) {
    var dIndex = 0;

    if (v < p.range[0]) {
      dIndex = p.maxIndex + BELOW_RANGE_COLOR_INDEX + 1.5;
    } else if (v > p.range[1]) {
      dIndex = p.maxIndex + ABOVE_RANGE_COLOR_INDEX + 1.5;
    } else {
      dIndex = (v + p.shift) * p.scale;

      // This conditional is needed because when v is very close to
      // p.Range[1], it may map above p.MaxIndex in the linear mapping
      // above.
      dIndex = dIndex < p.maxIndex ? dIndex : p.maxIndex;
    }

    return Math.floor(dIndex);
  };

  publicAPI.linearLookup = function (v, table, p) {
    var index = 0;
    if (_Math2.default.isNan(v)) {
      index = Math.floor(p.maxIndex + 1.5 + NAN_COLOR_INDEX);
    } else {
      index = publicAPI.linearIndexLookup(v, p);
    }
    return [table[4 * index], table[4 * index + 1], table[4 * index + 2], table[4 * index + 3]];
  };

  publicAPI.indexedLookupFunction = function (v, table, p) {
    var index = publicAPI.getAnnotatedValueIndexInternal(v);
    return [table[4 * index], table[4 * index + 1], table[4 * index + 2], table[4 * index + 3]];
  };

  //----------------------------------------------------------------------------
  publicAPI.lookupShiftAndScale = function (range, p) {
    p.shift = -range[0];
    p.scale = Number.MAX_VALUE;
    if (range[1] > range[0]) {
      p.scale = (p.maxIndex + 1) / (range[1] - range[0]);
    }
  };

  // Public API methods
  publicAPI.mapScalarsThroughTable = function (input, output, outFormat, inputOffset) {
    var lookupFunc = publicAPI.linearLookup;
    if (model.indexedLookup) {
      lookupFunc = publicAPI.indexedLookupFunction;
    }

    var trange = publicAPI.getMappingRange();

    var p = {
      maxIndex: publicAPI.getNumberOfColors() - 1,
      range: trange,
      shift: 0.0,
      scale: 0.0
    };
    publicAPI.lookupShiftAndScale(trange, p);

    var alpha = publicAPI.getAlpha();
    var length = input.getNumberOfTuples();
    var inIncr = input.getNumberOfComponents();

    var outputV = output.getData();
    var inputV = input.getData();

    if (alpha >= 1.0) {
      if (outFormat === _Constants.ScalarMappingTarget.RGBA) {
        for (var i = 0; i < length; i++) {
          var cptr = lookupFunc(inputV[i * inIncr + inputOffset], model.table, p);
          outputV[i * 4] = cptr[0];
          outputV[i * 4 + 1] = cptr[1];
          outputV[i * 4 + 2] = cptr[2];
          outputV[i * 4 + 3] = cptr[3];
        }
      }
    } else {
      /* eslint-disable no-lonely-if */
      if (outFormat === _Constants.ScalarMappingTarget.RGBA) {
        for (var _i = 0; _i < length; _i++) {
          var _cptr = lookupFunc(inputV[_i * inIncr + inputOffset], model.table, p);
          outputV[_i * 4] = _cptr[0];
          outputV[_i * 4 + 1] = _cptr[1];
          outputV[_i * 4 + 2] = _cptr[2];
          outputV[_i * 4 + 3] = Math.floor(_cptr[3] * alpha + 0.5);
        }
      }
    } // alpha blending
  };

  publicAPI.forceBuild = function () {
    var hinc = 0.0;
    var sinc = 0.0;
    var vinc = 0.0;
    var ainc = 0.0;

    var maxIndex = model.numberOfColors - 1;

    if (maxIndex) {
      hinc = (model.hueRange[1] - model.hueRange[0]) / maxIndex;
      sinc = (model.saturationRange[1] - model.saturationRange[0]) / maxIndex;
      vinc = (model.valueRange[1] - model.valueRange[0]) / maxIndex;
      ainc = (model.alphaRange[1] - model.alphaRange[0]) / maxIndex;
    }

    var hsv = [];
    var rgba = [];
    for (var i = 0; i <= maxIndex; i++) {
      hsv[0] = model.hueRange[0] + i * hinc;
      hsv[1] = model.saturationRange[0] + i * sinc;
      hsv[2] = model.valueRange[0] + i * vinc;

      _Math2.default.hsv2rgb(hsv, rgba);
      rgba[3] = model.alphaRange[0] + i * ainc;

      //  case VTK_RAMP_LINEAR:
      model.table[i * 4] = rgba[0] * 255.0 + 0.5;
      model.table[i * 4 + 1] = rgba[1] * 255.0 + 0.5;
      model.table[i * 4 + 2] = rgba[2] * 255.0 + 0.5;
      model.table[i * 4 + 3] = rgba[3] * 255.0 + 0.5;
    }

    publicAPI.buildSpecialColors();

    model.buildTime.modified();
  };

  publicAPI.buildSpecialColors = function () {
    // Add "special" colors (NaN, below range, above range) to table here.
    var numberOfColors = model.numberOfColors;

    var tptr = model.table;
    var base = (model.numberOfColors + BELOW_RANGE_COLOR_INDEX) * 4;

    // Below range color
    if (model.useBelowRangeColor || numberOfColors === 0) {
      tptr[base] = model.belowRangeColor[0] * 255.0 + 0.5;
      tptr[base + 1] = model.belowRangeColor[1] * 255.0 + 0.5;
      tptr[base + 2] = model.belowRangeColor[2] * 255.0 + 0.5;
      tptr[base + 3] = model.belowRangeColor[3] * 255.0 + 0.5;
    } else {
      // Duplicate the first color in the table.
      tptr[base] = tptr[0];
      tptr[base + 1] = tptr[1];
      tptr[base + 2] = tptr[2];
      tptr[base + 3] = tptr[3];
    }

    // Above range color
    base = (model.numberOfColors + ABOVE_RANGE_COLOR_INDEX) * 4;
    if (model.useAboveRangeColor || numberOfColors === 0) {
      tptr[base] = model.aboveRangeColor[0] * 255.0 + 0.5;
      tptr[base + 1] = model.aboveRangeColor[1] * 255.0 + 0.5;
      tptr[base + 2] = model.aboveRangeColor[2] * 255.0 + 0.5;
      tptr[base + 3] = model.aboveRangeColor[3] * 255.0 + 0.5;
    } else {
      // Duplicate the last color in the table.
      tptr[base] = tptr[4 * (numberOfColors - 1) + 0];
      tptr[base + 1] = tptr[4 * (numberOfColors - 1) + 1];
      tptr[base + 2] = tptr[4 * (numberOfColors - 1) + 2];
      tptr[base + 3] = tptr[4 * (numberOfColors - 1) + 3];
    }

    // Always use NanColor
    base = (model.numberOfColors + NAN_COLOR_INDEX) * 4;
    tptr[base] = model.nanColor[0] * 255.0 + 0.5;
    tptr[base + 1] = model.nanColor[1] * 255.0 + 0.5;
    tptr[base + 2] = model.nanColor[2] * 255.0 + 0.5;
    tptr[base + 3] = model.nanColor[3] * 255.0 + 0.5;
  };

  publicAPI.build = function () {
    if (model.table.length < 1 || publicAPI.getMTime() > model.buildTime.getMTime()) {
      publicAPI.forceBuild();
    }
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  numberOfColors: 256,
  // table: null,

  hueRange: [0.0, 0.66667],
  saturationRange: [1.0, 1.0],
  valueRange: [1.0, 1.0],
  alphaRange: [1.0, 1.0],

  nanColor: [0.5, 0.0, 0.0, 1.0],
  belowRangeColor: [0.0, 0.0, 0.0, 1.0],
  aboveRangeColor: [1.0, 1.0, 1.0, 1.0],
  useAboveRangeColor: false,
  useBelowRangeColor: false,

  alpha: 1.0
  // buildTime: null,
  // opaqueFlagBuildTime: null,
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  _ScalarsToColors2.default.extend(publicAPI, model, initialValues);

  // Internal objects initialization
  if (!model.table) {
    model.table = [];
  }

  model.buildTime = {};
  _macro2.default.obj(model.buildTime);

  model.opaqueFlagBuildTime = {};
  _macro2.default.obj(model.opaqueFlagBuildTime, { mtime: 0 });

  // Create get-only macros
  _macro2.default.get(publicAPI, model, ['buildTime']);

  // Create get-set macros
  _macro2.default.setGet(publicAPI, model, ['numberOfColors', 'useAboveRangeColor', 'useBelowRangeColor']);

  // Create set macros for array (needs to know size)
  _macro2.default.setArray(publicAPI, model, ['alphaRange', 'hueRange', 'saturationRange', 'valueRange'], 2);

  _macro2.default.setArray(publicAPI, model, ['nanColor', 'belowRangeColor', 'aboveRangeColor'], 4);

  // Create get macros for array
  _macro2.default.getArray(publicAPI, model, ['hueRange', 'saturationRange', 'valueRange', 'alphaRange', 'nanColor', 'belowRangeColor', 'aboveRangeColor']);

  // For more macro methods, see "Sources/macro.js"

  // Object specific methods
  vtkLookupTable(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkLookupTable');

// ----------------------------------------------------------------------------

exports.default = Object.assign({ newInstance: newInstance, extend: extend });

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _DataArray = __webpack_require__(6);

var _DataArray2 = _interopRequireDefault(_DataArray);

var _Constants = __webpack_require__(5);

var _Constants2 = __webpack_require__(23);

var _Constants3 = __webpack_require__(21);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vtkErrorMacro = _macro2.default.vtkErrorMacro;

// ----------------------------------------------------------------------------
// Global methods
// ----------------------------------------------------------------------------

// Add module-level functions or api that you want to expose statically via
// the next section...

// ----------------------------------------------------------------------------
// Static API
// ----------------------------------------------------------------------------

function intColorToUChar(c) {
  return c;
}
function floatColorToUChar(c) {
  return Math.floor(c * 255.0 + 0.5);
}

// ----------------------------------------------------------------------------
// vtkMyClass methods
// ----------------------------------------------------------------------------

function vtkScalarsToColors(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkScalarsToColors');

  publicAPI.setVectorModeToMagnitude = function () {
    return publicAPI.setVectorMode(_Constants2.VectorMode.MAGNITUDE);
  };
  publicAPI.setVectorModeToComponent = function () {
    return publicAPI.setVectorMode(_Constants2.VectorMode.COMPONENT);
  };
  publicAPI.setVectorModeToRGBColors = function () {
    return publicAPI.setVectorMode(_Constants2.VectorMode.RGBCOLORS);
  };

  publicAPI.build = function () {};

  publicAPI.isOpaque = function () {
    return true;
  };

  //----------------------------------------------------------------------------
  publicAPI.setAnnotations = function (values, annotations) {
    if (values && !annotations || !values && annotations) {
      return;
    }

    if (values && annotations && values.getNumberOfTuples() !== annotations.getNumberOfTuples()) {
      vtkErrorMacro('Values and annotations do not have the same number of tuples so ignoring');
      return;
    }

    model.annotationArray = [];

    if (annotations && values) {
      var num = annotations.getNumberOfTuples();
      for (var i = 0; i < num; i++) {
        model.annotationArray.push({ value: values[i], annotation: annotations[i] });
      }
    }

    publicAPI.updateAnnotatedValueMap();
    publicAPI.modified();
  };

  //----------------------------------------------------------------------------
  publicAPI.setAnnotation = function (value, annotation) {
    var i = publicAPI.checkForAnnotatedValue(value);
    var modified = false;
    if (i >= 0) {
      if (model.annotationArray[i].annotation !== annotation) {
        model.annotationArray[i].annotation = annotation;
        modified = true;
      }
    } else {
      model.annotationArray.push({ value: value, annotation: annotation });
      i = model.annotationArray.length - 1;
      modified = true;
    }
    if (modified) {
      publicAPI.updateAnnotatedValueMap();
      publicAPI.modified();
    }
    return i;
  };

  //----------------------------------------------------------------------------
  publicAPI.getNumberOfAnnotatedValues = function () {
    return model.annotationArray.length;
  };

  //----------------------------------------------------------------------------
  publicAPI.getAnnotatedValue = function (idx) {
    if (idx < 0 || idx >= model.annotationArray.length) {
      return null;
    }
    return model.annotationArray[idx].value;
  };

  //----------------------------------------------------------------------------
  publicAPI.getAnnotation = function (idx) {
    if (model.annotationArray[idx] === undefined) {
      return null;
    }
    return model.annotationArray[idx].annotation;
  };

  //----------------------------------------------------------------------------
  publicAPI.getAnnotatedValueIndex = function (val) {
    return model.annotationArray.length ? publicAPI.checkForAnnotatedValue(val) : -1;
  };

  //----------------------------------------------------------------------------
  publicAPI.removeAnnotation = function (value) {
    var i = publicAPI.checkForAnnotatedValue(value);
    var needToRemove = i >= 0;
    if (needToRemove) {
      model.annotationArray.splice(i, 1);
      publicAPI.updateAnnotatedValueMap();
      publicAPI.modified();
    }
    return needToRemove;
  };

  //----------------------------------------------------------------------------
  publicAPI.resetAnnotations = function () {
    model.annotationArray = [];
    model.annotatedValueMap = [];
    publicAPI.modified();
  };

  //----------------------------------------------------------------------------
  publicAPI.getAnnotationColor = function (val, rgba) {
    if (model.indexedLookup) {
      var i = publicAPI.getAnnotatedValueIndex(val);
      publicAPI.getIndexedColor(i, rgba);
    } else {
      publicAPI.getColor(parseFloat(val), rgba);
      rgba[3] = 1.0;
    }
  };

  //----------------------------------------------------------------------------
  publicAPI.checkForAnnotatedValue = function (value) {
    return publicAPI.getAnnotatedValueIndexInternal(value);
  };

  //----------------------------------------------------------------------------
  // An unsafe version of vtkScalarsToColors::CheckForAnnotatedValue for
  // internal use (no pointer checks performed)
  publicAPI.getAnnotatedValueIndexInternal = function (value) {
    if (model.annotatedValueMap[value] !== undefined) {
      var na = model.annotationArray.length;
      return model.annotatedValueMap[value] % na;
    }
    return -1;
  };

  //----------------------------------------------------------------------------
  publicAPI.getIndexedColor = function (val, rgba) {
    rgba[0] = 0.0;
    rgba[1] = 0.0;
    rgba[2] = 0.0;
    rgba[3] = 0.0;
  };

  //----------------------------------------------------------------------------
  publicAPI.updateAnnotatedValueMap = function () {
    model.annotatedValueMap = [];

    var na = model.annotationArray.length;
    for (var i = 0; i < na; ++i) {
      model.annotatedValueMap[model.annotationArray[i].value] = i;
    }
  };

  // Description:
  // Internal methods that map a data array into a 4-component,
  // unsigned char RGBA array. The color mode determines the behavior
  // of mapping. If ColorMode.DEFAULT is set, then unsigned char
  // data arrays are treated as colors (and converted to RGBA if
  // necessary); If ColorMode.DIRECT_SCALARS is set, then all arrays
  // are treated as colors (integer types are clamped in the range 0-255,
  // floating point arrays are clamped in the range 0.0-1.0. Note 'char' does
  // not have enough values to represent a color so mapping this type is
  // considered an error);
  // otherwise, the data is mapped through this instance
  // of ScalarsToColors. The component argument is used for data
  // arrays with more than one component; it indicates which component
  // to use to do the blending.  When the component argument is -1,
  // then the this object uses its own selected technique to change a
  // vector into a scalar to map.
  publicAPI.mapScalars = function (scalars, colorMode, componentIn) {
    var numberOfComponents = scalars.getNumberOfComponents();

    var newColors = null;

    // map scalars through lookup table only if needed
    if (colorMode === _Constants3.ColorMode.DEFAULT && scalars.getDataType() === _Constants.VtkDataTypes.UNSIGNED_CHAR || colorMode === _Constants3.ColorMode.DIRECT_SCALARS && scalars) {
      newColors = publicAPI.convertToRGBA(scalars, numberOfComponents, scalars.getNumberOfTuples());
    } else {
      var newscalars = {
        type: 'vtkDataArray',
        name: 'temp',
        numberOfComponents: 4,
        dataType: _Constants.VtkDataTypes.UNSIGNED_CHAR
      };

      var s = new window[newscalars.dataType](4 * scalars.getNumberOfTuples());
      newscalars.values = s;
      newscalars.size = s.length;
      newColors = _DataArray2.default.newInstance(newscalars);

      var component = componentIn;

      // If mapper did not specify a component, use the VectorMode
      if (component < 0 && numberOfComponents > 1) {
        publicAPI.mapVectorsThroughTable(scalars, newColors, _Constants2.ScalarMappingTarget.RGBA, -1, -1);
      } else {
        if (component < 0) {
          component = 0;
        }
        if (component >= numberOfComponents) {
          component = numberOfComponents - 1;
        }

        // Map the scalars to colors
        publicAPI.mapScalarsThroughTable(scalars, newColors, _Constants2.ScalarMappingTarget.RGBA, component);
      }
    }

    return newColors;
  };

  publicAPI.mapVectorsToMagnitude = function (input, output, compsToUse) {
    var length = input.getNumberOfTuples();
    var inIncr = input.getNumberOfComponents();

    var outputV = output.getData();
    var inputV = input.getData();

    for (var i = 0; i < length; i++) {
      var sum = 0.0;
      for (var j = 0; j < compsToUse; j++) {
        sum += inputV[i * inIncr + j];
      }
      outputV[i] = Math.sqrt(sum);
    }
  };

  //----------------------------------------------------------------------------
  // Map a set of vector values through the table
  publicAPI.mapVectorsThroughTable = function (input, output, outputFormat, vectorComponentIn, vectorSizeIn) {
    var vectorMode = publicAPI.getVectorMode();
    var vectorSize = vectorSizeIn;
    var vectorComponent = vectorComponentIn;
    var inComponents = input.getNumberOfComponents();

    if (vectorMode === _Constants2.VectorMode.COMPONENT) {
      // make sure vectorComponent is within allowed range
      if (vectorComponent === -1) {
        // if set to -1, use default value provided by table
        vectorComponent = publicAPI.getVectorComponent();
      }
      if (vectorComponent < 0) {
        vectorComponent = 0;
      }
      if (vectorComponent >= inComponents) {
        vectorComponent = inComponents - 1;
      }
    } else {
      // make sure vectorSize is within allowed range
      if (vectorSize === -1) {
        // if set to -1, use default value provided by table
        vectorSize = publicAPI.getVectorSize();
      }
      if (vectorSize <= 0) {
        vectorComponent = 0;
        vectorSize = inComponents;
      } else {
        if (vectorComponent < 0) {
          vectorComponent = 0;
        }
        if (vectorComponent >= inComponents) {
          vectorComponent = inComponents - 1;
        }
        if (vectorComponent + vectorSize > inComponents) {
          vectorSize = inComponents - vectorComponent;
        }
      }

      if (vectorMode === _Constants2.VectorMode.MAGNITUDE && (inComponents === 1 || vectorSize === 1)) {
        vectorMode = _Constants2.VectorMode.COMPONENT;
      }
    }

    // increment input pointer to the first component to map
    var inputOffset = 0;
    if (vectorComponent > 0) {
      inputOffset = vectorComponent;
    }

    // map according to the current vector mode
    switch (vectorMode) {
      case _Constants2.VectorMode.COMPONENT:
        {
          publicAPI.mapScalarsThroughTable(input, output, outputFormat, inputOffset);
          break;
        }

      default:
      case _Constants2.VectorMode.MAGNITUDE:
        {
          var magValues = _DataArray2.default.newInstance({ numberOfComponents: 1, values: new Float32Array(input.getNumberOfTuples()) });

          publicAPI.mapVectorsToMagnitude(input, magValues, vectorSize);
          publicAPI.mapScalarsThroughTable(magValues, output, outputFormat, 0);
          break;
        }

      case _Constants2.VectorMode.RGBCOLORS:
        {
          // publicAPI.mapColorsToColors(
          //   input, output, inComponents, vectorSize,
          //   outputFormat);
          break;
        }
    }
  };

  publicAPI.luminanceToRGBA = function (newColors, colors, alpha, convtFun) {
    var a = convtFun(alpha);

    var values = colors.getData();
    var newValues = newColors.getData();
    var size = values.length;
    var component = 0;
    var tuple = 1;

    var count = 0;
    for (var i = component; i < size; i += tuple) {
      var l = convtFun(values[i]);
      newValues[count * 4] = l;
      newValues[count * 4 + 1] = l;
      newValues[count * 4 + 2] = l;
      newValues[count * 4 + 3] = a;
      count++;
    }
  };

  publicAPI.luminanceAlphaToRGBA = function (newColors, colors, alpha, convtFun) {
    var values = colors.getData();
    var newValues = newColors.getData();
    var size = values.length;
    var component = 0;
    var tuple = 2;

    var count = 0;
    for (var i = component; i < size; i += tuple) {
      var l = convtFun(values[i]);
      newValues[count] = l;
      newValues[count + 1] = l;
      newValues[count + 2] = l;
      newValues[count + 3] = convtFun(values[i + 1]) * alpha;
      count += 4;
    }
  };

  publicAPI.rGBToRGBA = function (newColors, colors, alpha, convtFun) {
    var a = floatColorToUChar(alpha);

    var values = colors.getData();
    var newValues = newColors.getData();
    var size = values.length;
    var component = 0;
    var tuple = 3;

    var count = 0;
    for (var i = component; i < size; i += tuple) {
      newValues[count * 4] = convtFun(values[i]);
      newValues[count * 4 + 1] = convtFun(values[i + 1]);
      newValues[count * 4 + 2] = convtFun(values[i + 2]);
      newValues[count * 4 + 3] = a;
      count++;
    }
  };

  publicAPI.rGBAToRGBA = function (newColors, colors, alpha, convtFun) {
    var values = colors.getData();
    var newValues = newColors.getData();
    var size = values.length;
    var component = 0;
    var tuple = 4;

    var count = 0;
    for (var i = component; i < size; i += tuple) {
      newValues[count * 4] = convtFun(values[i]);
      newValues[count * 4 + 1] = convtFun(values[i + 1]);
      newValues[count * 4 + 2] = convtFun(values[i + 2]);
      newColors[count * 4 + 3] = convtFun(values[i + 3]) * alpha;
      count++;
    }
  };

  //----------------------------------------------------------------------------
  publicAPI.convertToRGBA = function (colors, numComp, numTuples) {
    if (numComp === 4 && model.alpha >= 1.0 && colors.getDataType() === _Constants.VtkDataTypes.UNSIGNED_CHAR) {
      return colors;
    }

    var newColors = _DataArray2.default.newInstance({
      numberOfComponents: 4,
      empty: true,
      size: 4 * numTuples,
      dataType: _Constants.VtkDataTypes.UNSIGNED_CHAR
    });

    if (numTuples <= 0) {
      return newColors;
    }

    var alpha = model.alpha;
    alpha = alpha > 0 ? alpha : 0;
    alpha = alpha < 1 ? alpha : 1;

    var convtFun = intColorToUChar;
    if (colors.getDataType() === _Constants.VtkDataTypes.FLOAT || colors.getDataType() === _Constants.VtkDataTypes.DOUBLE) {
      convtFun = floatColorToUChar;
    }

    switch (numComp) {
      case 1:
        publicAPI.luminanceToRGBA(newColors, colors, alpha, convtFun);
        break;

      case 2:
        publicAPI.luminanceAlphaToRGBA(newColors, colors, convtFun);
        break;

      case 3:
        publicAPI.rGBToRGBA(newColors, colors, alpha, convtFun);
        break;

      case 4:
        publicAPI.rGBAToRGBA(newColors, colors, alpha, convtFun);
        break;

      default:
        vtkErrorMacro('Cannot convert colors');
        return null;
    }

    return newColors;
  };

  publicAPI.usingLogScale = function () {
    return false;
  };

  publicAPI.getNumberOfAvailableColors = function () {
    return 256 * 256 * 256;
  };

  publicAPI.setRange = function (min, max) {
    return publicAPI.setMappingRange(min, max);
  };
  publicAPI.getRange = function (min, max) {
    return publicAPI.getMappingRange();
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  alpha: 1.0,
  vectorComponent: 0,
  vectorSize: -1,
  vectorMode: _Constants2.VectorMode.COMPONENT,
  mappingRange: null,
  annotationArray: null,
  annotatedValueMap: null,
  indexedLookup: false
};

// ----------------------------------------------------------------------------

function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  _macro2.default.obj(publicAPI, model);

  model.mappingRange = [0, 255];
  model.annotationArray = [];
  model.annotatedValueMap = [];

  // Create get-set macros
  _macro2.default.setGet(publicAPI, model, ['vectorSize', 'vectorComponent', 'vectorMode', 'alpha', 'indexedLookup']);

  // Create set macros for array (needs to know size)
  _macro2.default.setArray(publicAPI, model, ['mappingRange'], 2);

  // Create get macros for array
  _macro2.default.getArray(publicAPI, model, ['mappingRange']);

  // For more macro methods, see "Sources/macro.js"

  // Object specific methods
  vtkScalarsToColors(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkScalarsToColors');

// ----------------------------------------------------------------------------

exports.default = Object.assign({ newInstance: newInstance, extend: extend });

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addCoincidentTopologyMethods = addCoincidentTopologyMethods;
function addCoincidentTopologyMethods(publicAPI, model, nameList) {
  nameList.forEach(function (item) {
    publicAPI['get' + item.method] = function () {
      return model[item.key];
    };
    publicAPI['set' + item.method] = function (factor, unit) {
      model[item.key] = { factor: factor, unit: unit };
    };
  });
}

var CATEGORIES = exports.CATEGORIES = ['Polygon', 'Line', 'Point'];

exports.default = {
  addCoincidentTopologyMethods: addCoincidentTopologyMethods,
  CATEGORIES: CATEGORIES
};

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getResolveCoincidentTopologyPolygonOffsetFaces = getResolveCoincidentTopologyPolygonOffsetFaces;
exports.setResolveCoincidentTopologyPolygonOffsetFaces = setResolveCoincidentTopologyPolygonOffsetFaces;
exports.getResolveCoincidentTopology = getResolveCoincidentTopology;
exports.setResolveCoincidentTopology = setResolveCoincidentTopology;
exports.setResolveCoincidentTopologyToDefault = setResolveCoincidentTopologyToDefault;
exports.setResolveCoincidentTopologyToOff = setResolveCoincidentTopologyToOff;
exports.setResolveCoincidentTopologyToPolygonOffset = setResolveCoincidentTopologyToPolygonOffset;
exports.getResolveCoincidentTopologyAsString = getResolveCoincidentTopologyAsString;
var resolveCoincidentTopologyPolygonOffsetFaces = 1;
var resolveCoincidentTopology = 0;

var RESOLVE_COINCIDENT_TOPOLOGY_MODE = exports.RESOLVE_COINCIDENT_TOPOLOGY_MODE = ['VTK_RESOLVE_OFF', 'VTK_RESOLVE_POLYGON_OFFSET'];

function getResolveCoincidentTopologyPolygonOffsetFaces() {
  return resolveCoincidentTopologyPolygonOffsetFaces;
}

function setResolveCoincidentTopologyPolygonOffsetFaces(value) {
  resolveCoincidentTopologyPolygonOffsetFaces = value;
}

function getResolveCoincidentTopology() {
  return resolveCoincidentTopology;
}

function setResolveCoincidentTopology() {
  var mode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

  resolveCoincidentTopology = mode;
}

function setResolveCoincidentTopologyToDefault() {
  setResolveCoincidentTopology(0); // VTK_RESOLVE_OFF
}

function setResolveCoincidentTopologyToOff() {
  setResolveCoincidentTopology(0); // VTK_RESOLVE_OFF
}

function setResolveCoincidentTopologyToPolygonOffset() {
  setResolveCoincidentTopology(1); // VTK_RESOLVE_POLYGON_OFFSET
}

function getResolveCoincidentTopologyAsString() {
  return RESOLVE_COINCIDENT_TOPOLOGY_MODE[resolveCoincidentTopology];
}

exports.default = {
  getResolveCoincidentTopologyAsString: getResolveCoincidentTopologyAsString,
  getResolveCoincidentTopologyPolygonOffsetFaces: getResolveCoincidentTopologyPolygonOffsetFaces,
  setResolveCoincidentTopology: setResolveCoincidentTopology,
  setResolveCoincidentTopologyPolygonOffsetFaces: setResolveCoincidentTopologyPolygonOffsetFaces,
  setResolveCoincidentTopologyToDefault: setResolveCoincidentTopologyToDefault,
  setResolveCoincidentTopologyToOff: setResolveCoincidentTopologyToOff,
  setResolveCoincidentTopologyToPolygonOffset: setResolveCoincidentTopologyToPolygonOffset
};

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _DataAccessHelper = __webpack_require__(39);

var _DataAccessHelper2 = _interopRequireDefault(_DataAccessHelper);

var _DataArray = __webpack_require__(6);

var _DataArray2 = _interopRequireDefault(_DataArray);

var _PolyData = __webpack_require__(22);

var _PolyData2 = _interopRequireDefault(_PolyData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------------------------------------------------------------

var data = {};

// ----------------------------------------------------------------------------

function pushVector(src, srcOffset, dst, vectorSize) {
  for (var i = 0; i < vectorSize; i++) {
    dst.push(src[srcOffset + i]);
  }
}

// ----------------------------------------------------------------------------

function begin(splitMode) {
  data.splitOn = splitMode;
  data.pieces = [];
  data.v = [];
  data.vt = [];
  data.vn = [];
  data.f = [[]];
  data.size = 0;
}

// ----------------------------------------------------------------------------

function faceMap(str) {
  var idxs = str.split('/').map(function (i) {
    return Number(i);
  });
  var vertexIdx = idxs[0] - 1;
  var textCoordIdx = idxs[1] ? idxs[1] - 1 : vertexIdx;
  var vertexNormal = idxs[2] ? idxs[2] - 1 : vertexIdx;
  return [vertexIdx, textCoordIdx, vertexNormal];
}

// ----------------------------------------------------------------------------

function parseLine(line) {
  if (line[0] === '#') {
    return;
  }
  var tokens = line.split(/[ \t]+/);
  if (tokens[0] === data.splitOn) {
    tokens.shift();
    data.pieces.push(tokens.join(' ').trim());
    data.f.push([]);
    data.size++;
  } else if (tokens[0] === 'v') {
    data.v.push(Number(tokens[1]));
    data.v.push(Number(tokens[2]));
    data.v.push(Number(tokens[3]));
  } else if (tokens[0] === 'vt') {
    data.vt.push(Number(tokens[1]));
    data.vt.push(Number(tokens[2]));
  } else if (tokens[0] === 'vn') {
    data.vn.push(Number(tokens[1]));
    data.vn.push(Number(tokens[2]));
    data.vn.push(Number(tokens[3]));
  } else if (tokens[0] === 'f') {
    // Handle triangles for now
    if (data.size === 0) {
      data.size++;
    }
    var cells = data.f[data.size - 1];
    tokens.shift();
    var faces = tokens.filter(function (s) {
      return s.length;
    });
    var size = faces.length;
    cells.push(size);
    for (var i = 0; i < size; i++) {
      cells.push(faceMap(faces[i]));
    }
  }
}

// ----------------------------------------------------------------------------

function end(model) {
  var hasTcoords = !!data.vt.length;
  var hasNormals = !!data.vn.length;
  if (model.splitMode) {
    model.numberOfOutputs = data.size;
    for (var idx = 0; idx < data.size; idx++) {
      var ctMapping = {};
      var polydata = _PolyData2.default.newInstance({ name: data.pieces[idx] });
      var pts = [];
      var tc = [];
      var normals = [];
      var polys = [];

      var polyIn = data.f[idx];
      var nbElems = polyIn.length;
      var offset = 0;
      while (offset < nbElems) {
        var cellSize = polyIn[offset];
        polys.push(cellSize);
        for (var pIdx = 0; pIdx < cellSize; pIdx++) {
          var _polyIn = _slicedToArray(polyIn[offset + pIdx + 1], 3),
              vIdx = _polyIn[0],
              tcIdx = _polyIn[1],
              nIdx = _polyIn[2];

          var key = vIdx + '/' + tcIdx + '/' + nIdx;
          if (ctMapping[key] === undefined) {
            ctMapping[key] = pts.length / 3;
            pushVector(data.v, vIdx * 3, pts, 3);
            if (hasTcoords) {
              pushVector(data.vt, tcIdx * 2, tc, 2);
            }
            if (hasNormals) {
              pushVector(data.vn, nIdx * 3, normals, 3);
            }
          }
          polys.push(ctMapping[key]);
        }
        offset += cellSize + 1;
      }

      polydata.getPoints().setData(Float32Array.from(pts), 3);
      polydata.getPolys().setData(Uint32Array.from(polys));

      if (hasTcoords) {
        var tcoords = _DataArray2.default.newInstance({ numberOfComponents: 2, values: Float32Array.from(tc), name: 'TextureCoordinates' });
        polydata.getPointData().setTCoords(tcoords);
      }

      if (hasNormals) {
        var normalsArray = _DataArray2.default.newInstance({ numberOfComponents: 3, values: Float32Array.from(normals), name: 'Normals' });
        polydata.getPointData().setNormals(normalsArray);
      }

      // register in output
      model.output[idx] = polydata;
    }
  } else {
    model.numberOfOutputs = 1;
    var _polydata = _PolyData2.default.newInstance();
    _polydata.getPoints().setData(Float32Array.from(data.v), 3);
    if (hasTcoords && data.v.length / 3 === data.vt.length / 2) {
      var _tcoords = _DataArray2.default.newInstance({ numberOfComponents: 2, values: Float32Array.from(data.vt), name: 'TextureCoordinates' });
      _polydata.getPointData().setTCoords(_tcoords);
    }
    if (hasNormals && data.v.length === data.vn.length) {
      var _normalsArray = _DataArray2.default.newInstance({ numberOfComponents: 3, values: Float32Array.from(data.vn), name: 'Normals' });
      _polydata.getPointData().setNormals(_normalsArray);
    }

    var _polys = [];
    var _polyIn2 = data.f[0];
    var _nbElems = _polyIn2.length;
    var _offset = 0;
    while (_offset < _nbElems) {
      var _cellSize = _polyIn2[_offset];
      _polys.push(_cellSize);
      for (var _pIdx = 0; _pIdx < _cellSize; _pIdx++) {
        var _polyIn3 = _slicedToArray(_polyIn2[_offset + _pIdx + 1], 1),
            vIdx = _polyIn3[0];

        _polys.push(vIdx);
      }
      _offset += _cellSize + 1;
    }
    _polydata.getPolys().setData(Uint32Array.from(_polys));
    model.output[0] = _polydata;
  }
}

// ----------------------------------------------------------------------------
// vtkOBJReader methods
// ----------------------------------------------------------------------------

function vtkOBJReader(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkOBJReader');

  // Create default dataAccessHelper if not available
  if (!model.dataAccessHelper) {
    model.dataAccessHelper = _DataAccessHelper2.default.get('http');
  }

  // Internal method to fetch Array
  function fetchData(url) {
    var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var compression = model.compression;
    var progressCallback = model.progressCallback;
    return model.dataAccessHelper.fetchText(publicAPI, url, { compression: compression, progressCallback: progressCallback });
  }

  // Set DataSet url
  publicAPI.setUrl = function (url) {
    var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (url.indexOf('.obj') === -1 && !option.fullpath) {
      model.baseURL = url;
      model.url = url + '/index.obj';
    } else {
      model.url = url;

      // Remove the file in the URL
      var path = url.split('/');
      path.pop();
      model.baseURL = path.join('/');
    }

    model.compression = option.compression;

    // Fetch metadata
    return publicAPI.loadData({ progressCallback: option.progressCallback });
  };

  // Fetch the actual data arrays
  publicAPI.loadData = function () {
    var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var promise = fetchData(model.url, option);
    promise.then(publicAPI.parse);
    return promise;
  };

  publicAPI.parse = function (content) {
    if (!content) {
      return;
    }
    if (content !== model.parseData) {
      publicAPI.modified();
    }
    model.parseData = content;
    model.numberOfOutputs = 0;
    begin(model.splitMode);
    content.split('\n').forEach(parseLine);
    end(model);
  };

  publicAPI.requestData = function (inData, outData) {
    publicAPI.parse(model.parseData);
  };

  // return Busy state
  publicAPI.isBusy = function () {
    return !!model.requestCount;
  };

  publicAPI.getNumberOfOutputPorts = function () {
    return model.numberOfOutputs;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  numberOfOutputs: 1,
  requestCount: 0,
  splitMode: null
  // baseURL: null,
  // dataAccessHelper: null,
  // url: null,
};

// ----------------------------------------------------------------------------


function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  _macro2.default.obj(publicAPI, model);
  _macro2.default.get(publicAPI, model, ['url', 'baseURL']);
  _macro2.default.setGet(publicAPI, model, ['dataAccessHelper', 'splitMode']);
  _macro2.default.algo(publicAPI, model, 0, 1);
  _macro2.default.event(publicAPI, model, 'busy');

  // Object methods
  vtkOBJReader(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkOBJReader');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base64Js = __webpack_require__(112);

var _pako = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"pako\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

var _pako2 = _interopRequireDefault(_pako);

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _Endian = __webpack_require__(24);

var _Endian2 = _interopRequireDefault(_Endian);

var _Constants = __webpack_require__(5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vtkErrorMacro = _macro2.default.vtkErrorMacro,
    vtkDebugMacro = _macro2.default.vtkDebugMacro;


var requestCount = 0;

function getContent(url) {
  var el = document.querySelector('.webResource[data-url="' + url + '"]');
  return el ? el.innerHTML : null;
}

function removeLeadingSlash(str) {
  return str[0] === '/' ? str.substr(1) : str;
}

function fetchText() {
  var instance = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var url = arguments[1];
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  return new Promise(function (resolve, reject) {
    var txt = getContent(url);
    if (txt === null) {
      reject('No such text ' + url);
    } else {
      resolve(txt);
    }
  });
}

function fetchJSON() {
  var instance = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var url = arguments[1];
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  return new Promise(function (resolve, reject) {
    var txt = getContent(removeLeadingSlash(url));
    if (txt === null) {
      reject('No such JSON ' + url);
    } else {
      resolve(JSON.parse(txt));
    }
  });
}

function fetchArray() {
  var instance = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var baseURL = arguments[1];
  var array = arguments[2];
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  return new Promise(function (resolve, reject) {
    var url = removeLeadingSlash([baseURL, array.ref.basepath, options.compression ? array.ref.id + '.gz' : array.ref.id].join('/'));

    var txt = getContent(url);
    if (txt === null) {
      reject('No such array ' + url);
    } else {
      if (array.dataType === 'string') {
        var bText = atob(txt);
        if (options.compression) {
          bText = _pako2.default.inflate(bText, { to: 'string' });
        }
        array.values = JSON.parse(bText);
      } else {
        var uint8array = (0, _base64Js.toByteArray)(txt);

        array.buffer = new ArrayBuffer(uint8array.length);

        // copy uint8array to buffer
        var view = new Uint8Array(array.buffer);
        view.set(uint8array);

        if (options.compression) {
          if (array.dataType === 'string' || array.dataType === 'JSON') {
            array.buffer = _pako2.default.inflate(new Uint8Array(array.buffer), { to: 'string' });
          } else {
            array.buffer = _pako2.default.inflate(new Uint8Array(array.buffer)).buffer;
          }
        }

        if (array.ref.encode === 'JSON') {
          array.values = JSON.parse(array.buffer);
        } else {
          if (_Endian2.default.ENDIANNESS !== array.ref.encode && _Endian2.default.ENDIANNESS) {
            // Need to swap bytes
            vtkDebugMacro('Swap bytes of ' + array.name);
            _Endian2.default.swapBytes(array.buffer, _Constants.DataTypeByteSize[array.dataType]);
          }

          array.values = new window[array.dataType](array.buffer);
        }

        if (array.values.length !== array.size) {
          vtkErrorMacro('Error in FetchArray: ' + array.name + ' does not have the proper array size. Got ' + array.values.length + ', instead of ' + array.size);
        }
      }

      // Done with the ref and work
      delete array.ref;
      if (--requestCount === 0 && instance.invokeBusy) {
        instance.invokeBusy(false);
      }
      if (instance.modified) {
        instance.modified();
      }

      resolve(array);
    }
  });
}

// Export fetch methods
exports.default = {
  fetchJSON: fetchJSON,
  fetchText: fetchText,
  fetchArray: fetchArray
};

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pako = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"pako\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

var _pako2 = _interopRequireDefault(_pako);

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _Endian = __webpack_require__(24);

var _Endian2 = _interopRequireDefault(_Endian);

var _Constants = __webpack_require__(5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vtkErrorMacro = _macro2.default.vtkErrorMacro,
    vtkDebugMacro = _macro2.default.vtkDebugMacro;


var requestCount = 0;

function fetchBinary(url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 0) {
          resolve(xhr.response);
        } else {
          reject(xhr, e);
        }
      }
    };

    if (options && options.progressCallback) {
      xhr.addEventListener('progress', options.progressCallback);
    }

    // Make request
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.send();
  });
}

function fetchArray() {
  var instance = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var baseURL = arguments[1];
  var array = arguments[2];
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (array.ref && !array.ref.pending) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      var url = [baseURL, array.ref.basepath, options.compression ? array.ref.id + '.gz' : array.ref.id].join('/');

      xhr.onreadystatechange = function (e) {
        if (xhr.readyState === 1) {
          array.ref.pending = true;
          if (++requestCount === 1 && instance.invokeBusy) {
            instance.invokeBusy(true);
          }
        }
        if (xhr.readyState === 4) {
          array.ref.pending = false;
          if (xhr.status === 200 || xhr.status === 0) {
            array.buffer = xhr.response;

            if (options.compression) {
              if (array.dataType === 'string' || array.dataType === 'JSON') {
                array.buffer = _pako2.default.inflate(new Uint8Array(array.buffer), { to: 'string' });
              } else {
                array.buffer = _pako2.default.inflate(new Uint8Array(array.buffer)).buffer;
              }
            }

            if (array.ref.encode === 'JSON') {
              array.values = JSON.parse(array.buffer);
            } else {
              if (_Endian2.default.ENDIANNESS !== array.ref.encode && _Endian2.default.ENDIANNESS) {
                // Need to swap bytes
                vtkDebugMacro('Swap bytes of ' + array.name);
                _Endian2.default.swapBytes(array.buffer, _Constants.DataTypeByteSize[array.dataType]);
              }

              array.values = new window[array.dataType](array.buffer);
            }

            if (array.values.length !== array.size) {
              vtkErrorMacro('Error in FetchArray: ' + array.name + ', does not have the proper array size. Got ' + array.values.length + ', instead of ' + array.size);
            }

            // Done with the ref and work
            delete array.ref;
            if (--requestCount === 0 && instance.invokeBusy) {
              instance.invokeBusy(false);
            }
            if (instance.modified) {
              instance.modified();
            }
            resolve(array);
          } else {
            reject(xhr, e);
          }
        }
      };

      if (options && options.progressCallback) {
        xhr.addEventListener('progress', options.progressCallback);
      }

      // Make request
      xhr.open('GET', url, true);
      xhr.responseType = options.compression || array.dataType !== 'string' ? 'arraybuffer' : 'text';
      xhr.send();
    });
  }

  return new Promise(function (resolve, reject) {
    resolve(array);
  });
}

// ----------------------------------------------------------------------------

function fetchJSON() {
  var instance = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var url = arguments[1];
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function (e) {
      if (xhr.readyState === 1) {
        if (++requestCount === 1 && instance.invokeBusy) {
          instance.invokeBusy(true);
        }
      }
      if (xhr.readyState === 4) {
        if (--requestCount === 0 && instance.invokeBusy) {
          instance.invokeBusy(false);
        }
        if (xhr.status === 200 || xhr.status === 0) {
          if (options.compression) {
            resolve(JSON.parse(_pako2.default.inflate(new Uint8Array(xhr.response), { to: 'string' })));
          } else {
            resolve(JSON.parse(xhr.responseText));
          }
        } else {
          reject(xhr, e);
        }
      }
    };

    if (options && options.progressCallback) {
      xhr.addEventListener('progress', options.progressCallback);
    }

    // Make request
    xhr.open('GET', url, true);
    xhr.responseType = options.compression ? 'arraybuffer' : 'text';
    xhr.send();
  });
}

// ----------------------------------------------------------------------------

function fetchText() {
  var instance = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var url = arguments[1];
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (options && options.compression && options.compression !== 'gz') {
    vtkErrorMacro('Supported algorithms are: [gz]');
    vtkErrorMacro('Unkown compression algorithm: ' + options.compression);
  }

  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function (e) {
      if (xhr.readyState === 1) {
        if (++requestCount === 1 && instance.invokeBusy) {
          instance.invokeBusy(true);
        }
      }
      if (xhr.readyState === 4) {
        if (--requestCount === 0 && instance.invokeBusy) {
          instance.invokeBusy(false);
        }
        if (xhr.status === 200 || xhr.status === 0) {
          if (options.compression) {
            resolve(_pako2.default.inflate(new Uint8Array(xhr.response), { to: 'string' }));
          } else {
            resolve(xhr.responseText);
          }
        } else {
          reject(xhr, e);
        }
      }
    };

    if (options.progressCallback) {
      xhr.addEventListener('progress', options.progressCallback);
    }

    // Make request
    xhr.open('GET', url, true);
    xhr.responseType = options.compression ? 'arraybuffer' : 'text';
    xhr.send();
  });
}

// ----------------------------------------------------------------------------

exports.default = {
  fetchArray: fetchArray,
  fetchJSON: fetchJSON,
  fetchText: fetchText,
  fetchBinary: fetchBinary // Only for HTTP
};

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jszip = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"jszip\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

var _jszip2 = _interopRequireDefault(_jszip);

var _pako = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"pako\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

var _pako2 = _interopRequireDefault(_pako);

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _Endian = __webpack_require__(24);

var _Endian2 = _interopRequireDefault(_Endian);

var _Constants = __webpack_require__(5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vtkErrorMacro = _macro2.default.vtkErrorMacro,
    vtkDebugMacro = _macro2.default.vtkDebugMacro;


function handleUint8Array(array, compression, done) {
  return function (uint8array) {
    array.buffer = new ArrayBuffer(uint8array.length);

    // copy uint8array to buffer
    var view = new Uint8Array(array.buffer);
    view.set(uint8array);

    if (compression) {
      if (array.dataType === 'string' || array.dataType === 'JSON') {
        array.buffer = _pako2.default.inflate(new Uint8Array(array.buffer), { to: 'string' });
      } else {
        array.buffer = _pako2.default.inflate(new Uint8Array(array.buffer)).buffer;
      }
    }

    if (array.ref.encode === 'JSON') {
      array.values = JSON.parse(array.buffer);
    } else {
      if (_Endian2.default.ENDIANNESS !== array.ref.encode && _Endian2.default.ENDIANNESS) {
        // Need to swap bytes
        vtkDebugMacro('Swap bytes of ' + array.name);
        _Endian2.default.swapBytes(array.buffer, _Constants.DataTypeByteSize[array.dataType]);
      }

      array.values = new window[array.dataType](array.buffer);
    }

    if (array.values.length !== array.size) {
      vtkErrorMacro('Error in FetchArray: ' + array.name + ' does not have the proper array size. Got ' + array.values.length + ', instead of ' + array.size);
    }

    done();
  };
}

function handleString(array, compression, done) {
  return function (string) {
    if (compression) {
      array.values = JSON.parse(_pako2.default.inflate(string, { to: 'string' }));
    } else {
      array.values = JSON.parse(string);
    }
    done();
  };
}

var handlers = {
  uint8array: handleUint8Array,
  string: handleString
};

function removeLeadingSlash(str) {
  return str[0] === '/' ? str.substr(1) : str;
}

function create(createOptions) {
  var ready = false;
  var requestCount = 0;
  var zip = new _jszip2.default();
  var zipRoot = zip;
  zip.loadAsync(createOptions.zipContent).then(function () {
    ready = true;

    // Find root index.json
    var metaFiles = [];
    zip.forEach(function (relativePath, zipEntry) {
      if (relativePath.indexOf('index.json') !== -1) {
        metaFiles.push(relativePath);
      }
    });
    metaFiles.sort(function (a, b) {
      return a.length - b.length;
    });
    var fullRootPath = metaFiles[0].split('/');
    while (fullRootPath.length > 1) {
      var dirName = fullRootPath.shift();
      zipRoot = zipRoot.folder(dirName);
    }

    if (createOptions.callback) {
      createOptions.callback(zip);
    }
  });
  return {
    fetchArray: function fetchArray() {
      var instance = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var baseURL = arguments[1];
      var array = arguments[2];
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      return new Promise(function (resolve, reject) {
        if (!ready) {
          vtkErrorMacro('ERROR!!! zip not ready...');
        }
        var url = removeLeadingSlash([baseURL, array.ref.basepath, options.compression ? array.ref.id + '.gz' : array.ref.id].join('/'));

        if (++requestCount === 1 && instance.invokeBusy) {
          instance.invokeBusy(true);
        }

        function doneCleanUp() {
          // Done with the ref and work
          delete array.ref;
          if (--requestCount === 0 && instance.invokeBusy) {
            instance.invokeBusy(false);
          }
          if (instance.modified) {
            instance.modified();
          }
          resolve(array);
        }

        var asyncType = array.dataType === 'string' && !options.compression ? 'string' : 'uint8array';
        var asyncCallback = handlers[asyncType](array, options.compression, doneCleanUp);

        zipRoot.file(url).async(asyncType).then(asyncCallback);
      });
    },
    fetchJSON: function fetchJSON() {
      var instance = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var url = arguments[1];
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var path = removeLeadingSlash(url);
      if (!ready) {
        vtkErrorMacro('ERROR!!! zip not ready...');
      }

      if (options.compression) {
        if (options.compression === 'gz') {
          return zipRoot.file(path).async('uint8array').then(function (uint8array) {
            var str = _pako2.default.inflate(uint8array, { to: 'string' });
            return new Promise(function (ok) {
              return ok(JSON.parse(str));
            });
          });
        }
        return new Promise(function (a, r) {
          return r('Invalid compression');
        });
      }

      return zipRoot.file(path).async('string').then(function (str) {
        return new Promise(function (ok) {
          return ok(JSON.parse(str));
        });
      });
    },
    fetchText: function fetchText() {
      var instance = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var url = arguments[1];
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var path = removeLeadingSlash(url);
      if (!ready) {
        vtkErrorMacro('ERROR!!! zip not ready...');
      }

      if (options.compression) {
        if (options.compression === 'gz') {
          return zipRoot.file(path).async('uint8array').then(function (uint8array) {
            var str = _pako2.default.inflate(uint8array, { to: 'string' });
            return new Promise(function (ok) {
              return ok(str);
            });
          });
        }
        return new Promise(function (a, r) {
          return r('Invalid compression');
        });
      }

      return zipRoot.file(path).async('string').then(function (str) {
        return new Promise(function (ok) {
          return ok(str);
        });
      });
    }
  };
}

exports.default = {
  create: create
};

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newInstance = undefined;
exports.extend = extend;

var _macro = __webpack_require__(0);

var _macro2 = _interopRequireDefault(_macro);

var _DataAccessHelper = __webpack_require__(39);

var _DataAccessHelper2 = _interopRequireDefault(_DataAccessHelper);

var _LegacyAsciiParser = __webpack_require__(116);

var _LegacyAsciiParser2 = _interopRequireDefault(_LegacyAsciiParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ----------------------------------------------------------------------------
// vtkPolyDataReader methods
// ----------------------------------------------------------------------------

function vtkPolyDataReader(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkPolyDataReader');

  // Create default dataAccessHelper if not available
  if (!model.dataAccessHelper) {
    model.dataAccessHelper = _DataAccessHelper2.default.get('http');
  }

  // Internal method to fetch Array
  function fetchData(url) {
    var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var compression = model.compression;
    var progressCallback = model.progressCallback;
    return model.dataAccessHelper.fetchText(publicAPI, url, { compression: compression, progressCallback: progressCallback });
  }

  // Set DataSet url
  publicAPI.setUrl = function (url) {
    var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    model.url = url;

    // Remove the file in the URL
    var path = url.split('/');
    path.pop();
    model.baseURL = path.join('/');

    model.compression = option.compression;

    // Fetch metadata
    return publicAPI.loadData({ progressCallback: option.progressCallback });
  };

  // Fetch the actual data arrays
  publicAPI.loadData = function () {
    var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var promise = fetchData(model.url, option);
    promise.then(publicAPI.parse);
    return promise;
  };

  publicAPI.parse = function (content) {
    if (!content) {
      return;
    }
    if (content !== model.parseData) {
      publicAPI.modified();
    } else {
      return;
    }

    model.parseData = content;
    model.output[0] = _LegacyAsciiParser2.default.parseLegacyASCII(model.parseData).dataset;
  };

  publicAPI.requestData = function (inData, outData) {
    publicAPI.parse(model.parseData);
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

var DEFAULT_VALUES = {
  // baseURL: null,
  // dataAccessHelper: null,
  // url: null,
};

// ----------------------------------------------------------------------------


function extend(publicAPI, model) {
  var initialValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  _macro2.default.obj(publicAPI, model);
  _macro2.default.get(publicAPI, model, ['url', 'baseURL']);
  _macro2.default.setGet(publicAPI, model, ['dataAccessHelper']);
  _macro2.default.algo(publicAPI, model, 0, 1);

  // vtkPolyDataReader methods
  vtkPolyDataReader(publicAPI, model);
}

// ----------------------------------------------------------------------------

var newInstance = exports.newInstance = _macro2.default.newInstance(extend, 'vtkPolyDataReader');

// ----------------------------------------------------------------------------

exports.default = { newInstance: newInstance, extend: extend };

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _DataArray = __webpack_require__(6);

var _DataArray2 = _interopRequireDefault(_DataArray);

var _PolyData = __webpack_require__(22);

var _PolyData2 = _interopRequireDefault(_PolyData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var METHOD_MAPPING = {
  POINTS: 'getPoints',
  VERTICES: 'getVerts',
  LINES: 'getLines',
  TRIANGLE_STRIPS: 'getStrips',
  POLYGONS: 'getPolys',
  POINT_DATA: 'getPointData',
  CELL_DATA: 'getCellData',
  FIELD: 'getFieldData'
};

var DATATYPES = {
  bit: Uint8Array,
  unsigned_char: Uint8Array,
  char: Int8Array,
  unsigned_short: Uint16Array,
  short: Int16Array,
  unsigned_int: Uint32Array,
  int: Int32Array,
  unsigned_long: Uint32Array,
  long: Int32Array,
  float: Float32Array,
  double: Float64Array
};

var REGISTER_MAPPING = {
  SCALARS: 'addArray',
  COLOR_SCALARS: 'addArray',
  VECTORS: 'setVectors',
  NORMALS: 'setNormals',
  TEXTURE_COORDINATES: 'setTCoords',
  TENSORS: 'setTensors',
  FIELD: 'addArray'
};

function createArrayHandler(array, setData, nbComponents) {
  var offset = 0;

  function fillWith(line) {
    line.split(' ').forEach(function (token) {
      if (token.length) {
        array[offset++] = Number(token);
      }
    });
    if (offset < array.length) {
      return true;
    }
    setData(array, nbComponents);
    return false;
  }

  return fillWith;
}

var GENERIC_CELL_HANDLER = {
  init: function init(line, dataModel) {
    var _line$split = line.split(' '),
        _line$split2 = _slicedToArray(_line$split, 3),
        name = _line$split2[0],
        nbCells = _line$split2[1],
        nbValues = _line$split2[2];

    var cellArray = dataModel.dataset[METHOD_MAPPING[name]]();
    cellArray.set({ numberOfCells: Number(nbCells) }, true); // Force numberOfCells update
    dataModel.arrayHandler = createArrayHandler(new Uint32Array(Number(nbValues)), cellArray.setData, 1);
    return true;
  },
  parse: function parse(line, dataModel) {
    return dataModel.arrayHandler(line);
  }
};

var TYPE_PARSER = {
  DATASET: {
    init: function init(line, datamodel) {
      var type = line.split(' ')[1];
      switch (type) {
        case 'POLYDATA':
          datamodel.dataset = _PolyData2.default.newInstance();
          break;
        default:
          console.error('Dataset of type ' + type + ' not supported');
      }
      return false;
    },
    parse: function parse(line, datamodel) {
      return false;
    }
  },
  POINTS: {
    init: function init(line, dataModel) {
      var _line$split3 = line.split(' '),
          _line$split4 = _slicedToArray(_line$split3, 3),
          name = _line$split4[0],
          size = _line$split4[1],
          type = _line$split4[2];

      var array = type === 'float' ? new Float32Array(3 * Number(size)) : new Float64Array(3 * Number(size));
      var dataArray = dataModel.dataset.getPoints();
      dataArray.setName(name);
      dataModel.arrayHandler = createArrayHandler(array, dataArray.setData, 3);
      return true;
    },
    parse: function parse(line, dataModel) {
      return dataModel.arrayHandler(line);
    }
  },
  METADATA: {
    init: function init(line, dataModel) {
      return true;
    },
    parse: function parse(line, dataModel) {
      return !!line.length;
    }
  },
  VERTICES: GENERIC_CELL_HANDLER,
  LINES: GENERIC_CELL_HANDLER,
  TRIANGLE_STRIPS: GENERIC_CELL_HANDLER,
  POLYGONS: GENERIC_CELL_HANDLER,
  POINT_DATA: {
    init: function init(line, dataModel) {
      dataModel.POINT_DATA = Number(line.split(' ')[1]);
      dataModel.activeFieldLocation = 'POINT_DATA';
      return false;
    },
    parse: function parse(line, dataModel) {
      return false;
    }
  },
  CELL_DATA: {
    init: function init(line, dataModel) {
      dataModel.CELL_DATA = Number(line.split(' ')[1]);
      dataModel.activeFieldLocation = 'CELL_DATA';
      return false;
    },
    parse: function parse(line, dataModel) {
      return false;
    }
  },
  SCALARS: {
    init: function init(line, dataModel) {
      var _line$split5 = line.split(' '),
          _line$split6 = _slicedToArray(_line$split5, 4),
          type = _line$split6[0],
          name = _line$split6[1],
          dataType = _line$split6[2],
          numComp = _line$split6[3];

      var size = dataModel[dataModel.activeFieldLocation] * Number(numComp);
      var array = new DATATYPES[dataType](size);
      var dataArray = _DataArray2.default.newInstance({ name: name, empty: true });
      dataModel.dataset[METHOD_MAPPING[dataModel.activeFieldLocation]]()[REGISTER_MAPPING[type]](dataArray);
      dataModel.arrayHandler = createArrayHandler(array, dataArray.setData, Number(numComp));
      return true;
    },
    parse: function parse(line, dataModel) {
      if (line.split(' ')[0] === 'LOOKUP_TABLE') {
        return true;
      }
      return dataModel.arrayHandler(line);
    }
  },
  COLOR_SCALARS: {
    init: function init(line, dataModel) {
      var _line$split7 = line.split(' '),
          _line$split8 = _slicedToArray(_line$split7, 3),
          type = _line$split8[0],
          name = _line$split8[1],
          numComp = _line$split8[2];

      var size = dataModel[dataModel.activeFieldLocation] * Number(numComp);
      var array = new Uint8Array(size);
      var dataArray = _DataArray2.default.newInstance({ name: name, empty: true });
      dataModel.dataset[METHOD_MAPPING[dataModel.activeFieldLocation]]()[REGISTER_MAPPING[type]](dataArray);
      dataModel.arrayHandler = createArrayHandler(array, dataArray.setData, Number(numComp));
      return true;
    },
    parse: function parse(line, dataModel) {
      if (line.split(' ')[0] === 'LOOKUP_TABLE') {
        return true;
      }
      return dataModel.arrayHandler(line);
    }
  },
  VECTORS: {
    init: function init(line, dataModel) {
      var _line$split9 = line.split(' '),
          _line$split10 = _slicedToArray(_line$split9, 3),
          type = _line$split10[0],
          name = _line$split10[1],
          dataType = _line$split10[2];

      var size = dataModel[dataModel.activeFieldLocation] * 3;
      var array = new DATATYPES[dataType](size);
      var dataArray = _DataArray2.default.newInstance({ name: name, empty: true });
      dataModel.dataset[METHOD_MAPPING[dataModel.activeFieldLocation]]()[REGISTER_MAPPING[type]](dataArray);
      dataModel.arrayHandler = createArrayHandler(array, dataArray.setData, 3);
      return true;
    },
    parse: function parse(line, dataModel) {
      return dataModel.arrayHandler(line);
    }
  },
  NORMALS: {
    init: function init(line, dataModel) {
      var _line$split11 = line.split(' '),
          _line$split12 = _slicedToArray(_line$split11, 2),
          type = _line$split12[0],
          name = _line$split12[1];

      var size = dataModel[dataModel.activeFieldLocation] * 3;
      var array = new Float32Array(size);
      var dataArray = _DataArray2.default.newInstance({ name: name, empty: true });
      dataModel.dataset[METHOD_MAPPING[dataModel.activeFieldLocation]]()[REGISTER_MAPPING[type]](dataArray);
      dataModel.arrayHandler = createArrayHandler(array, dataArray.setData, 3);
      return true;
    },
    parse: function parse(line, dataModel) {
      return dataModel.arrayHandler(line);
    }
  },
  TEXTURE_COORDINATES: {
    init: function init(line, dataModel) {
      var _line$split13 = line.split(' '),
          _line$split14 = _slicedToArray(_line$split13, 4),
          type = _line$split14[0],
          name = _line$split14[1],
          numberOfComponents = _line$split14[2],
          dataType = _line$split14[3];

      var size = dataModel[dataModel.activeFieldLocation] * Number(numberOfComponents);
      var array = new DATATYPES[dataType](size);
      var dataArray = _DataArray2.default.newInstance({ name: name, empty: true });
      dataModel.dataset[METHOD_MAPPING[dataModel.activeFieldLocation]]()[REGISTER_MAPPING[type]](dataArray);
      dataModel.arrayHandler = createArrayHandler(array, dataArray.setData, 3);
      return true;
    },
    parse: function parse(line, dataModel) {
      return dataModel.arrayHandler(line);
    }
  },
  TENSORS: {
    init: function init(line, dataModel) {
      var _line$split15 = line.split(' '),
          _line$split16 = _slicedToArray(_line$split15, 3),
          type = _line$split16[0],
          name = _line$split16[1],
          dataType = _line$split16[2];

      var size = dataModel[dataModel.activeFieldLocation] * 9;
      var array = new DATATYPES[dataType](size);
      var dataArray = _DataArray2.default.newInstance({ name: name, empty: true });
      dataModel.dataset[METHOD_MAPPING[dataModel.activeFieldLocation]]()[REGISTER_MAPPING[type]](dataArray);
      dataModel.arrayHandler = createArrayHandler(array, dataArray.setData, 9);
      return true;
    },
    parse: function parse(line, dataModel) {
      return dataModel.arrayHandler(line);
    }
  }
};

function getParser(line, dataModel) {
  var tokens = line.split(' ');
  return TYPE_PARSER[tokens[0]];
}

function parseLegacyASCII(content) {
  var dataModel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var parser = null;
  content.split('\n').forEach(function (line, index) {
    if (index < 2) {
      return;
    }
    if (!parser) {
      parser = getParser(line, dataModel);
      if (!parser) {
        return;
      }
      parser = parser.init(line, dataModel) ? parser : null;
      return;
    }

    if (parser && !parser.parse(line, dataModel)) {
      parser = null;
    }
  });
  return dataModel;
}

exports.default = {
  parseLegacyASCII: parseLegacyASCII
};

/***/ })
/******/ ]);