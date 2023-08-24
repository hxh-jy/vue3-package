/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 9662:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var isCallable = __webpack_require__(614);
var tryToString = __webpack_require__(6330);

var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw $TypeError(tryToString(argument) + ' is not a function');
};


/***/ }),

/***/ 6077:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var isCallable = __webpack_require__(614);

var $String = String;
var $TypeError = TypeError;

module.exports = function (argument) {
  if (typeof argument == 'object' || isCallable(argument)) return argument;
  throw $TypeError("Can't set " + $String(argument) + ' as a prototype');
};


/***/ }),

/***/ 5787:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var isPrototypeOf = __webpack_require__(7976);

var $TypeError = TypeError;

module.exports = function (it, Prototype) {
  if (isPrototypeOf(Prototype, it)) return it;
  throw $TypeError('Incorrect invocation');
};


/***/ }),

/***/ 9670:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var isObject = __webpack_require__(111);

var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw $TypeError($String(argument) + ' is not an object');
};


/***/ }),

/***/ 3013:
/***/ (function(module) {


// eslint-disable-next-line es/no-typed-arrays -- safe
module.exports = typeof ArrayBuffer != 'undefined' && typeof DataView != 'undefined';


/***/ }),

/***/ 260:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var NATIVE_ARRAY_BUFFER = __webpack_require__(3013);
var DESCRIPTORS = __webpack_require__(9781);
var global = __webpack_require__(7854);
var isCallable = __webpack_require__(614);
var isObject = __webpack_require__(111);
var hasOwn = __webpack_require__(2597);
var classof = __webpack_require__(648);
var tryToString = __webpack_require__(6330);
var createNonEnumerableProperty = __webpack_require__(8880);
var defineBuiltIn = __webpack_require__(8052);
var defineBuiltInAccessor = __webpack_require__(7045);
var isPrototypeOf = __webpack_require__(7976);
var getPrototypeOf = __webpack_require__(9518);
var setPrototypeOf = __webpack_require__(7674);
var wellKnownSymbol = __webpack_require__(5112);
var uid = __webpack_require__(9711);
var InternalStateModule = __webpack_require__(9909);

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var Int8Array = global.Int8Array;
var Int8ArrayPrototype = Int8Array && Int8Array.prototype;
var Uint8ClampedArray = global.Uint8ClampedArray;
var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
var TypedArray = Int8Array && getPrototypeOf(Int8Array);
var TypedArrayPrototype = Int8ArrayPrototype && getPrototypeOf(Int8ArrayPrototype);
var ObjectPrototype = Object.prototype;
var TypeError = global.TypeError;

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG');
var TYPED_ARRAY_CONSTRUCTOR = 'TypedArrayConstructor';
// Fixing native typed arrays in Opera Presto crashes the browser, see #595
var NATIVE_ARRAY_BUFFER_VIEWS = NATIVE_ARRAY_BUFFER && !!setPrototypeOf && classof(global.opera) !== 'Opera';
var TYPED_ARRAY_TAG_REQUIRED = false;
var NAME, Constructor, Prototype;

var TypedArrayConstructorsList = {
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

var BigIntArrayConstructorsList = {
  BigInt64Array: 8,
  BigUint64Array: 8
};

var isView = function isView(it) {
  if (!isObject(it)) return false;
  var klass = classof(it);
  return klass === 'DataView'
    || hasOwn(TypedArrayConstructorsList, klass)
    || hasOwn(BigIntArrayConstructorsList, klass);
};

var getTypedArrayConstructor = function (it) {
  var proto = getPrototypeOf(it);
  if (!isObject(proto)) return;
  var state = getInternalState(proto);
  return (state && hasOwn(state, TYPED_ARRAY_CONSTRUCTOR)) ? state[TYPED_ARRAY_CONSTRUCTOR] : getTypedArrayConstructor(proto);
};

var isTypedArray = function (it) {
  if (!isObject(it)) return false;
  var klass = classof(it);
  return hasOwn(TypedArrayConstructorsList, klass)
    || hasOwn(BigIntArrayConstructorsList, klass);
};

var aTypedArray = function (it) {
  if (isTypedArray(it)) return it;
  throw TypeError('Target is not a typed array');
};

var aTypedArrayConstructor = function (C) {
  if (isCallable(C) && (!setPrototypeOf || isPrototypeOf(TypedArray, C))) return C;
  throw TypeError(tryToString(C) + ' is not a typed array constructor');
};

var exportTypedArrayMethod = function (KEY, property, forced, options) {
  if (!DESCRIPTORS) return;
  if (forced) for (var ARRAY in TypedArrayConstructorsList) {
    var TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && hasOwn(TypedArrayConstructor.prototype, KEY)) try {
      delete TypedArrayConstructor.prototype[KEY];
    } catch (error) {
      // old WebKit bug - some methods are non-configurable
      try {
        TypedArrayConstructor.prototype[KEY] = property;
      } catch (error2) { /* empty */ }
    }
  }
  if (!TypedArrayPrototype[KEY] || forced) {
    defineBuiltIn(TypedArrayPrototype, KEY, forced ? property
      : NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property, options);
  }
};

var exportTypedArrayStaticMethod = function (KEY, property, forced) {
  var ARRAY, TypedArrayConstructor;
  if (!DESCRIPTORS) return;
  if (setPrototypeOf) {
    if (forced) for (ARRAY in TypedArrayConstructorsList) {
      TypedArrayConstructor = global[ARRAY];
      if (TypedArrayConstructor && hasOwn(TypedArrayConstructor, KEY)) try {
        delete TypedArrayConstructor[KEY];
      } catch (error) { /* empty */ }
    }
    if (!TypedArray[KEY] || forced) {
      // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
      try {
        return defineBuiltIn(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && TypedArray[KEY] || property);
      } catch (error) { /* empty */ }
    } else return;
  }
  for (ARRAY in TypedArrayConstructorsList) {
    TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
      defineBuiltIn(TypedArrayConstructor, KEY, property);
    }
  }
};

for (NAME in TypedArrayConstructorsList) {
  Constructor = global[NAME];
  Prototype = Constructor && Constructor.prototype;
  if (Prototype) enforceInternalState(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;
  else NATIVE_ARRAY_BUFFER_VIEWS = false;
}

for (NAME in BigIntArrayConstructorsList) {
  Constructor = global[NAME];
  Prototype = Constructor && Constructor.prototype;
  if (Prototype) enforceInternalState(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;
}

// WebKit bug - typed arrays constructors prototype is Object.prototype
if (!NATIVE_ARRAY_BUFFER_VIEWS || !isCallable(TypedArray) || TypedArray === Function.prototype) {
  // eslint-disable-next-line no-shadow -- safe
  TypedArray = function TypedArray() {
    throw TypeError('Incorrect invocation');
  };
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global[NAME]) setPrototypeOf(global[NAME], TypedArray);
  }
}

if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype) {
  TypedArrayPrototype = TypedArray.prototype;
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global[NAME]) setPrototypeOf(global[NAME].prototype, TypedArrayPrototype);
  }
}

// WebKit bug - one more object in Uint8ClampedArray prototype chain
if (NATIVE_ARRAY_BUFFER_VIEWS && getPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
  setPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
}

if (DESCRIPTORS && !hasOwn(TypedArrayPrototype, TO_STRING_TAG)) {
  TYPED_ARRAY_TAG_REQUIRED = true;
  defineBuiltInAccessor(TypedArrayPrototype, TO_STRING_TAG, {
    configurable: true,
    get: function () {
      return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
    }
  });
  for (NAME in TypedArrayConstructorsList) if (global[NAME]) {
    createNonEnumerableProperty(global[NAME], TYPED_ARRAY_TAG, NAME);
  }
}

module.exports = {
  NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
  TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQUIRED && TYPED_ARRAY_TAG,
  aTypedArray: aTypedArray,
  aTypedArrayConstructor: aTypedArrayConstructor,
  exportTypedArrayMethod: exportTypedArrayMethod,
  exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
  getTypedArrayConstructor: getTypedArrayConstructor,
  isView: isView,
  isTypedArray: isTypedArray,
  TypedArray: TypedArray,
  TypedArrayPrototype: TypedArrayPrototype
};


/***/ }),

/***/ 7745:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var lengthOfArrayLike = __webpack_require__(6244);

module.exports = function (Constructor, list) {
  var index = 0;
  var length = lengthOfArrayLike(list);
  var result = new Constructor(length);
  while (length > index) result[index] = list[index++];
  return result;
};


/***/ }),

/***/ 1318:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var toIndexedObject = __webpack_require__(5656);
var toAbsoluteIndex = __webpack_require__(1400);
var lengthOfArrayLike = __webpack_require__(6244);

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el !== el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value !== value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ }),

/***/ 3658:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var DESCRIPTORS = __webpack_require__(9781);
var isArray = __webpack_require__(3157);

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Safari < 13 does not throw an error in this case
var SILENT_ON_NON_WRITABLE_LENGTH_SET = DESCRIPTORS && !function () {
  // makes no sense without proper strict mode support
  if (this !== undefined) return true;
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', { writable: false }).length = 1;
  } catch (error) {
    return error instanceof TypeError;
  }
}();

module.exports = SILENT_ON_NON_WRITABLE_LENGTH_SET ? function (O, length) {
  if (isArray(O) && !getOwnPropertyDescriptor(O, 'length').writable) {
    throw $TypeError('Cannot set read only .length');
  } return O.length = length;
} : function (O, length) {
  return O.length = length;
};


/***/ }),

/***/ 1843:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var lengthOfArrayLike = __webpack_require__(6244);

// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.toReversed
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.toReversed
module.exports = function (O, C) {
  var len = lengthOfArrayLike(O);
  var A = new C(len);
  var k = 0;
  for (; k < len; k++) A[k] = O[len - k - 1];
  return A;
};


/***/ }),

/***/ 1572:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var lengthOfArrayLike = __webpack_require__(6244);
var toIntegerOrInfinity = __webpack_require__(9303);

var $RangeError = RangeError;

// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.with
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.with
module.exports = function (O, C, index, value) {
  var len = lengthOfArrayLike(O);
  var relativeIndex = toIntegerOrInfinity(index);
  var actualIndex = relativeIndex < 0 ? len + relativeIndex : relativeIndex;
  if (actualIndex >= len || actualIndex < 0) throw $RangeError('Incorrect index');
  var A = new C(len);
  var k = 0;
  for (; k < len; k++) A[k] = k === actualIndex ? value : O[k];
  return A;
};


/***/ }),

/***/ 4326:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var uncurryThis = __webpack_require__(1702);

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};


/***/ }),

/***/ 648:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var TO_STRING_TAG_SUPPORT = __webpack_require__(1694);
var isCallable = __webpack_require__(614);
var classofRaw = __webpack_require__(4326);
var wellKnownSymbol = __webpack_require__(5112);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Object = Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) === 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) === 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};


/***/ }),

/***/ 9920:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var hasOwn = __webpack_require__(2597);
var ownKeys = __webpack_require__(3887);
var getOwnPropertyDescriptorModule = __webpack_require__(1236);
var definePropertyModule = __webpack_require__(3070);

module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};


/***/ }),

/***/ 8544:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var fails = __webpack_require__(7293);

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});


/***/ }),

/***/ 8880:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var DESCRIPTORS = __webpack_require__(9781);
var definePropertyModule = __webpack_require__(3070);
var createPropertyDescriptor = __webpack_require__(9114);

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ 9114:
/***/ (function(module) {


module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ 7045:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var makeBuiltIn = __webpack_require__(6339);
var defineProperty = __webpack_require__(3070);

module.exports = function (target, name, descriptor) {
  if (descriptor.get) makeBuiltIn(descriptor.get, name, { getter: true });
  if (descriptor.set) makeBuiltIn(descriptor.set, name, { setter: true });
  return defineProperty.f(target, name, descriptor);
};


/***/ }),

/***/ 8052:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var isCallable = __webpack_require__(614);
var definePropertyModule = __webpack_require__(3070);
var makeBuiltIn = __webpack_require__(6339);
var defineGlobalProperty = __webpack_require__(3072);

module.exports = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable(value)) makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;
    else defineGlobalProperty(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];
      else if (O[key]) simple = true;
    } catch (error) { /* empty */ }
    if (simple) O[key] = value;
    else definePropertyModule.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  } return O;
};


/***/ }),

/***/ 3072:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var global = __webpack_require__(7854);

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(global, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ }),

/***/ 9781:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var fails = __webpack_require__(7293);

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] !== 7;
});


/***/ }),

/***/ 4154:
/***/ (function(module) {


var documentAll = typeof document == 'object' && document.all;

// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
var IS_HTMLDDA = typeof documentAll == 'undefined' && documentAll !== undefined;

module.exports = {
  all: documentAll,
  IS_HTMLDDA: IS_HTMLDDA
};


/***/ }),

/***/ 317:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var global = __webpack_require__(7854);
var isObject = __webpack_require__(111);

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),

/***/ 7207:
/***/ (function(module) {


var $TypeError = TypeError;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF; // 2 ** 53 - 1 == 9007199254740991

module.exports = function (it) {
  if (it > MAX_SAFE_INTEGER) throw $TypeError('Maximum allowed index exceeded');
  return it;
};


/***/ }),

/***/ 3678:
/***/ (function(module) {


module.exports = {
  IndexSizeError: { s: 'INDEX_SIZE_ERR', c: 1, m: 1 },
  DOMStringSizeError: { s: 'DOMSTRING_SIZE_ERR', c: 2, m: 0 },
  HierarchyRequestError: { s: 'HIERARCHY_REQUEST_ERR', c: 3, m: 1 },
  WrongDocumentError: { s: 'WRONG_DOCUMENT_ERR', c: 4, m: 1 },
  InvalidCharacterError: { s: 'INVALID_CHARACTER_ERR', c: 5, m: 1 },
  NoDataAllowedError: { s: 'NO_DATA_ALLOWED_ERR', c: 6, m: 0 },
  NoModificationAllowedError: { s: 'NO_MODIFICATION_ALLOWED_ERR', c: 7, m: 1 },
  NotFoundError: { s: 'NOT_FOUND_ERR', c: 8, m: 1 },
  NotSupportedError: { s: 'NOT_SUPPORTED_ERR', c: 9, m: 1 },
  InUseAttributeError: { s: 'INUSE_ATTRIBUTE_ERR', c: 10, m: 1 },
  InvalidStateError: { s: 'INVALID_STATE_ERR', c: 11, m: 1 },
  SyntaxError: { s: 'SYNTAX_ERR', c: 12, m: 1 },
  InvalidModificationError: { s: 'INVALID_MODIFICATION_ERR', c: 13, m: 1 },
  NamespaceError: { s: 'NAMESPACE_ERR', c: 14, m: 1 },
  InvalidAccessError: { s: 'INVALID_ACCESS_ERR', c: 15, m: 1 },
  ValidationError: { s: 'VALIDATION_ERR', c: 16, m: 0 },
  TypeMismatchError: { s: 'TYPE_MISMATCH_ERR', c: 17, m: 1 },
  SecurityError: { s: 'SECURITY_ERR', c: 18, m: 1 },
  NetworkError: { s: 'NETWORK_ERR', c: 19, m: 1 },
  AbortError: { s: 'ABORT_ERR', c: 20, m: 1 },
  URLMismatchError: { s: 'URL_MISMATCH_ERR', c: 21, m: 1 },
  QuotaExceededError: { s: 'QUOTA_EXCEEDED_ERR', c: 22, m: 1 },
  TimeoutError: { s: 'TIMEOUT_ERR', c: 23, m: 1 },
  InvalidNodeTypeError: { s: 'INVALID_NODE_TYPE_ERR', c: 24, m: 1 },
  DataCloneError: { s: 'DATA_CLONE_ERR', c: 25, m: 1 }
};


/***/ }),

/***/ 8113:
/***/ (function(module) {


module.exports = typeof navigator != 'undefined' && String(navigator.userAgent) || '';


/***/ }),

/***/ 7392:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var global = __webpack_require__(7854);
var userAgent = __webpack_require__(8113);

var process = global.process;
var Deno = global.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;


/***/ }),

/***/ 748:
/***/ (function(module) {


// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),

/***/ 1060:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var uncurryThis = __webpack_require__(1702);

var $Error = Error;
var replace = uncurryThis(''.replace);

var TEST = (function (arg) { return String($Error(arg).stack); })('zxcasd');
// eslint-disable-next-line redos/no-vulnerable -- safe
var V8_OR_CHAKRA_STACK_ENTRY = /\n\s*at [^:]*:[^\n]*/;
var IS_V8_OR_CHAKRA_STACK = V8_OR_CHAKRA_STACK_ENTRY.test(TEST);

module.exports = function (stack, dropEntries) {
  if (IS_V8_OR_CHAKRA_STACK && typeof stack == 'string' && !$Error.prepareStackTrace) {
    while (dropEntries--) stack = replace(stack, V8_OR_CHAKRA_STACK_ENTRY, '');
  } return stack;
};


/***/ }),

/***/ 2109:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var global = __webpack_require__(7854);
var getOwnPropertyDescriptor = (__webpack_require__(1236).f);
var createNonEnumerableProperty = __webpack_require__(8880);
var defineBuiltIn = __webpack_require__(8052);
var defineGlobalProperty = __webpack_require__(3072);
var copyConstructorProperties = __webpack_require__(9920);
var isForced = __webpack_require__(4705);

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    defineBuiltIn(target, key, sourceProperty, options);
  }
};


/***/ }),

/***/ 7293:
/***/ (function(module) {


module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),

/***/ 4374:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var fails = __webpack_require__(7293);

module.exports = !fails(function () {
  // eslint-disable-next-line es/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});


/***/ }),

/***/ 6916:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var NATIVE_BIND = __webpack_require__(4374);

var call = Function.prototype.call;

module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};


/***/ }),

/***/ 6530:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var DESCRIPTORS = __webpack_require__(9781);
var hasOwn = __webpack_require__(2597);

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};


/***/ }),

/***/ 5668:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var uncurryThis = __webpack_require__(1702);
var aCallable = __webpack_require__(9662);

module.exports = function (object, key, method) {
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    return uncurryThis(aCallable(Object.getOwnPropertyDescriptor(object, key)[method]));
  } catch (error) { /* empty */ }
};


/***/ }),

/***/ 1702:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var NATIVE_BIND = __webpack_require__(4374);

var FunctionPrototype = Function.prototype;
var call = FunctionPrototype.call;
var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);

module.exports = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
  return function () {
    return call.apply(fn, arguments);
  };
};


/***/ }),

/***/ 5005:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var global = __webpack_require__(7854);
var isCallable = __webpack_require__(614);

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method];
};


/***/ }),

/***/ 8173:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var aCallable = __webpack_require__(9662);
var isNullOrUndefined = __webpack_require__(8554);

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? undefined : aCallable(func);
};


/***/ }),

/***/ 7854:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var check = function (it) {
  return it && it.Math === Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || this || Function('return this')();


/***/ }),

/***/ 2597:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var uncurryThis = __webpack_require__(1702);
var toObject = __webpack_require__(7908);

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};


/***/ }),

/***/ 3501:
/***/ (function(module) {


module.exports = {};


/***/ }),

/***/ 4664:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var DESCRIPTORS = __webpack_require__(9781);
var fails = __webpack_require__(7293);
var createElement = __webpack_require__(317);

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a !== 7;
});


/***/ }),

/***/ 8361:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var uncurryThis = __webpack_require__(1702);
var fails = __webpack_require__(7293);
var classof = __webpack_require__(4326);

var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) === 'String' ? split(it, '') : $Object(it);
} : $Object;


/***/ }),

/***/ 9587:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var isCallable = __webpack_require__(614);
var isObject = __webpack_require__(111);
var setPrototypeOf = __webpack_require__(7674);

// makes subclassing work correct for wrapped built-ins
module.exports = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    setPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    isCallable(NewTarget = dummy.constructor) &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) setPrototypeOf($this, NewTargetPrototype);
  return $this;
};


/***/ }),

/***/ 2788:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var uncurryThis = __webpack_require__(1702);
var isCallable = __webpack_require__(614);
var store = __webpack_require__(5465);

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;


/***/ }),

/***/ 9909:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var NATIVE_WEAK_MAP = __webpack_require__(4811);
var global = __webpack_require__(7854);
var isObject = __webpack_require__(111);
var createNonEnumerableProperty = __webpack_require__(8880);
var hasOwn = __webpack_require__(2597);
var shared = __webpack_require__(5465);
var sharedKey = __webpack_require__(6200);
var hiddenKeys = __webpack_require__(3501);

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = global.TypeError;
var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  /* eslint-disable no-self-assign -- prototype methods protection */
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  /* eslint-enable no-self-assign -- prototype methods protection */
  set = function (it, metadata) {
    if (store.has(it)) throw TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    store.set(it, metadata);
    return metadata;
  };
  get = function (it) {
    return store.get(it) || {};
  };
  has = function (it) {
    return store.has(it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),

/***/ 3157:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var classof = __webpack_require__(4326);

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
module.exports = Array.isArray || function isArray(argument) {
  return classof(argument) === 'Array';
};


/***/ }),

/***/ 4067:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var classof = __webpack_require__(648);

module.exports = function (it) {
  var klass = classof(it);
  return klass === 'BigInt64Array' || klass === 'BigUint64Array';
};


/***/ }),

/***/ 614:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var $documentAll = __webpack_require__(4154);

var documentAll = $documentAll.all;

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
module.exports = $documentAll.IS_HTMLDDA ? function (argument) {
  return typeof argument == 'function' || argument === documentAll;
} : function (argument) {
  return typeof argument == 'function';
};


/***/ }),

/***/ 4705:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var fails = __webpack_require__(7293);
var isCallable = __webpack_require__(614);

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value === POLYFILL ? true
    : value === NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),

/***/ 8554:
/***/ (function(module) {


// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
module.exports = function (it) {
  return it === null || it === undefined;
};


/***/ }),

/***/ 111:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var isCallable = __webpack_require__(614);
var $documentAll = __webpack_require__(4154);

var documentAll = $documentAll.all;

module.exports = $documentAll.IS_HTMLDDA ? function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it) || it === documentAll;
} : function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};


/***/ }),

/***/ 1913:
/***/ (function(module) {


module.exports = false;


/***/ }),

/***/ 2190:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var getBuiltIn = __webpack_require__(5005);
var isCallable = __webpack_require__(614);
var isPrototypeOf = __webpack_require__(7976);
var USE_SYMBOL_AS_UID = __webpack_require__(3307);

var $Object = Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};


/***/ }),

/***/ 6244:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var toLength = __webpack_require__(7466);

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};


/***/ }),

/***/ 6339:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var uncurryThis = __webpack_require__(1702);
var fails = __webpack_require__(7293);
var isCallable = __webpack_require__(614);
var hasOwn = __webpack_require__(2597);
var DESCRIPTORS = __webpack_require__(9781);
var CONFIGURABLE_FUNCTION_NAME = (__webpack_require__(6530).CONFIGURABLE);
var inspectSource = __webpack_require__(2788);
var InternalStateModule = __webpack_require__(9909);

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var $String = String;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;
var stringSlice = uncurryThis(''.slice);
var replace = uncurryThis(''.replace);
var join = uncurryThis([].join);

var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
  return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
});

var TEMPLATE = String(String).split('String');

var makeBuiltIn = module.exports = function (value, name, options) {
  if (stringSlice($String(name), 0, 7) === 'Symbol(') {
    name = '[' + replace($String(name), /^Symbol\(([^)]*)\)/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
    if (DESCRIPTORS) defineProperty(value, 'name', { value: name, configurable: true });
    else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
    defineProperty(value, 'length', { value: options.arity });
  }
  try {
    if (options && hasOwn(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false });
    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) { /* empty */ }
  var state = enforceInternalState(value);
  if (!hasOwn(state, 'source')) {
    state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
  } return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn(function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
}, 'toString');


/***/ }),

/***/ 4758:
/***/ (function(module) {


var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};


/***/ }),

/***/ 6277:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var toString = __webpack_require__(1340);

module.exports = function (argument, $default) {
  return argument === undefined ? arguments.length < 2 ? '' : $default : toString(argument);
};


/***/ }),

/***/ 3070:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var DESCRIPTORS = __webpack_require__(9781);
var IE8_DOM_DEFINE = __webpack_require__(4664);
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(3353);
var anObject = __webpack_require__(9670);
var toPropertyKey = __webpack_require__(4948);

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ 1236:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var DESCRIPTORS = __webpack_require__(9781);
var call = __webpack_require__(6916);
var propertyIsEnumerableModule = __webpack_require__(5296);
var createPropertyDescriptor = __webpack_require__(9114);
var toIndexedObject = __webpack_require__(5656);
var toPropertyKey = __webpack_require__(4948);
var hasOwn = __webpack_require__(2597);
var IE8_DOM_DEFINE = __webpack_require__(4664);

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};


/***/ }),

/***/ 8006:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var internalObjectKeys = __webpack_require__(6324);
var enumBugKeys = __webpack_require__(748);

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),

/***/ 5181:
/***/ (function(__unused_webpack_module, exports) {


// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ 9518:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var hasOwn = __webpack_require__(2597);
var isCallable = __webpack_require__(614);
var toObject = __webpack_require__(7908);
var sharedKey = __webpack_require__(6200);
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(8544);

var IE_PROTO = sharedKey('IE_PROTO');
var $Object = Object;
var ObjectPrototype = $Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es/no-object-getprototypeof -- safe
module.exports = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function (O) {
  var object = toObject(O);
  if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
  var constructor = object.constructor;
  if (isCallable(constructor) && object instanceof constructor) {
    return constructor.prototype;
  } return object instanceof $Object ? ObjectPrototype : null;
};


/***/ }),

/***/ 7976:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var uncurryThis = __webpack_require__(1702);

module.exports = uncurryThis({}.isPrototypeOf);


/***/ }),

/***/ 6324:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var uncurryThis = __webpack_require__(1702);
var hasOwn = __webpack_require__(2597);
var toIndexedObject = __webpack_require__(5656);
var indexOf = (__webpack_require__(1318).indexOf);
var hiddenKeys = __webpack_require__(3501);

var push = uncurryThis([].push);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};


/***/ }),

/***/ 5296:
/***/ (function(__unused_webpack_module, exports) {


var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;


/***/ }),

/***/ 7674:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


/* eslint-disable no-proto -- safe */
var uncurryThisAccessor = __webpack_require__(5668);
var anObject = __webpack_require__(9670);
var aPossiblePrototype = __webpack_require__(6077);

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = uncurryThisAccessor(Object.prototype, '__proto__', 'set');
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


/***/ }),

/***/ 2140:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var call = __webpack_require__(6916);
var isCallable = __webpack_require__(614);
var isObject = __webpack_require__(111);

var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw $TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ 3887:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var getBuiltIn = __webpack_require__(5005);
var uncurryThis = __webpack_require__(1702);
var getOwnPropertyNamesModule = __webpack_require__(8006);
var getOwnPropertySymbolsModule = __webpack_require__(5181);
var anObject = __webpack_require__(9670);

var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};


/***/ }),

/***/ 4488:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var isNullOrUndefined = __webpack_require__(8554);

var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (isNullOrUndefined(it)) throw $TypeError("Can't call method on " + it);
  return it;
};


/***/ }),

/***/ 6200:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var shared = __webpack_require__(2309);
var uid = __webpack_require__(9711);

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),

/***/ 5465:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var global = __webpack_require__(7854);
var defineGlobalProperty = __webpack_require__(3072);

var SHARED = '__core-js_shared__';
var store = global[SHARED] || defineGlobalProperty(SHARED, {});

module.exports = store;


/***/ }),

/***/ 2309:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var IS_PURE = __webpack_require__(1913);
var store = __webpack_require__(5465);

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.32.1',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2023 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.32.1/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});


/***/ }),

/***/ 6293:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(7392);
var fails = __webpack_require__(7293);
var global = __webpack_require__(7854);

var $String = global.String;

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol('symbol detection');
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
  // of course, fail.
  return !$String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});


/***/ }),

/***/ 1400:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var toIntegerOrInfinity = __webpack_require__(9303);

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),

/***/ 4599:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var toPrimitive = __webpack_require__(7593);

var $TypeError = TypeError;

// `ToBigInt` abstract operation
// https://tc39.es/ecma262/#sec-tobigint
module.exports = function (argument) {
  var prim = toPrimitive(argument, 'number');
  if (typeof prim == 'number') throw $TypeError("Can't convert number to bigint");
  // eslint-disable-next-line es/no-bigint -- safe
  return BigInt(prim);
};


/***/ }),

/***/ 5656:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(8361);
var requireObjectCoercible = __webpack_require__(4488);

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),

/***/ 9303:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var trunc = __webpack_require__(4758);

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};


/***/ }),

/***/ 7466:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var toIntegerOrInfinity = __webpack_require__(9303);

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),

/***/ 7908:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var requireObjectCoercible = __webpack_require__(4488);

var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};


/***/ }),

/***/ 7593:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var call = __webpack_require__(6916);
var isObject = __webpack_require__(111);
var isSymbol = __webpack_require__(2190);
var getMethod = __webpack_require__(8173);
var ordinaryToPrimitive = __webpack_require__(2140);
var wellKnownSymbol = __webpack_require__(5112);

var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};


/***/ }),

/***/ 4948:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var toPrimitive = __webpack_require__(7593);
var isSymbol = __webpack_require__(2190);

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};


/***/ }),

/***/ 1694:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var wellKnownSymbol = __webpack_require__(5112);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),

/***/ 1340:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var classof = __webpack_require__(648);

var $String = String;

module.exports = function (argument) {
  if (classof(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
  return $String(argument);
};


/***/ }),

/***/ 6330:
/***/ (function(module) {


var $String = String;

module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};


/***/ }),

/***/ 9711:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var uncurryThis = __webpack_require__(1702);

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};


/***/ }),

/***/ 3307:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(6293);

module.exports = NATIVE_SYMBOL
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';


/***/ }),

/***/ 3353:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var DESCRIPTORS = __webpack_require__(9781);
var fails = __webpack_require__(7293);

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype !== 42;
});


/***/ }),

/***/ 8053:
/***/ (function(module) {


var $TypeError = TypeError;

module.exports = function (passed, required) {
  if (passed < required) throw $TypeError('Not enough arguments');
  return passed;
};


/***/ }),

/***/ 4811:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var global = __webpack_require__(7854);
var isCallable = __webpack_require__(614);

var WeakMap = global.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));


/***/ }),

/***/ 5112:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var global = __webpack_require__(7854);
var shared = __webpack_require__(2309);
var hasOwn = __webpack_require__(2597);
var uid = __webpack_require__(9711);
var NATIVE_SYMBOL = __webpack_require__(6293);
var USE_SYMBOL_AS_UID = __webpack_require__(3307);

var Symbol = global.Symbol;
var WellKnownSymbolsStore = shared('wks');
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol['for'] || Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name)) {
    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name)
      ? Symbol[name]
      : createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};


/***/ }),

/***/ 7658:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


var $ = __webpack_require__(2109);
var toObject = __webpack_require__(7908);
var lengthOfArrayLike = __webpack_require__(6244);
var setArrayLength = __webpack_require__(3658);
var doesNotExceedSafeInteger = __webpack_require__(7207);
var fails = __webpack_require__(7293);

var INCORRECT_TO_LENGTH = fails(function () {
  return [].push.call({ length: 0x100000000 }, 1) !== 4294967297;
});

// V8 and Safari <= 15.4, FF < 23 throws InternalError
// https://bugs.chromium.org/p/v8/issues/detail?id=12681
var properErrorOnNonWritableLength = function () {
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', { writable: false }).push();
  } catch (error) {
    return error instanceof TypeError;
  }
};

var FORCED = INCORRECT_TO_LENGTH || !properErrorOnNonWritableLength();

// `Array.prototype.push` method
// https://tc39.es/ecma262/#sec-array.prototype.push
$({ target: 'Array', proto: true, arity: 1, forced: FORCED }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  push: function push(item) {
    var O = toObject(this);
    var len = lengthOfArrayLike(O);
    var argCount = arguments.length;
    doesNotExceedSafeInteger(len + argCount);
    for (var i = 0; i < argCount; i++) {
      O[len] = arguments[i];
      len++;
    }
    setArrayLength(O, len);
    return len;
  }
});


/***/ }),

/***/ 1439:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


var arrayToReversed = __webpack_require__(1843);
var ArrayBufferViewCore = __webpack_require__(260);

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var getTypedArrayConstructor = ArrayBufferViewCore.getTypedArrayConstructor;

// `%TypedArray%.prototype.toReversed` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.toreversed
exportTypedArrayMethod('toReversed', function toReversed() {
  return arrayToReversed(aTypedArray(this), getTypedArrayConstructor(this));
});


/***/ }),

/***/ 7585:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


var ArrayBufferViewCore = __webpack_require__(260);
var uncurryThis = __webpack_require__(1702);
var aCallable = __webpack_require__(9662);
var arrayFromConstructorAndList = __webpack_require__(7745);

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var getTypedArrayConstructor = ArrayBufferViewCore.getTypedArrayConstructor;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var sort = uncurryThis(ArrayBufferViewCore.TypedArrayPrototype.sort);

// `%TypedArray%.prototype.toSorted` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.tosorted
exportTypedArrayMethod('toSorted', function toSorted(compareFn) {
  if (compareFn !== undefined) aCallable(compareFn);
  var O = aTypedArray(this);
  var A = arrayFromConstructorAndList(getTypedArrayConstructor(O), O);
  return sort(A, compareFn);
});


/***/ }),

/***/ 5315:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


var arrayWith = __webpack_require__(1572);
var ArrayBufferViewCore = __webpack_require__(260);
var isBigIntArray = __webpack_require__(4067);
var toIntegerOrInfinity = __webpack_require__(9303);
var toBigInt = __webpack_require__(4599);

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var getTypedArrayConstructor = ArrayBufferViewCore.getTypedArrayConstructor;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

var PROPER_ORDER = !!function () {
  try {
    // eslint-disable-next-line no-throw-literal, es/no-typed-arrays, es/no-array-prototype-with -- required for testing
    new Int8Array(1)['with'](2, { valueOf: function () { throw 8; } });
  } catch (error) {
    // some early implementations, like WebKit, does not follow the final semantic
    // https://github.com/tc39/proposal-change-array-by-copy/pull/86
    return error === 8;
  }
}();

// `%TypedArray%.prototype.with` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.with
exportTypedArrayMethod('with', { 'with': function (index, value) {
  var O = aTypedArray(this);
  var relativeIndex = toIntegerOrInfinity(index);
  var actualValue = isBigIntArray(O) ? toBigInt(value) : +value;
  return arrayWith(O, getTypedArrayConstructor(O), relativeIndex, actualValue);
} }['with'], !PROPER_ORDER);


/***/ }),

/***/ 2801:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


var $ = __webpack_require__(2109);
var global = __webpack_require__(7854);
var getBuiltIn = __webpack_require__(5005);
var createPropertyDescriptor = __webpack_require__(9114);
var defineProperty = (__webpack_require__(3070).f);
var hasOwn = __webpack_require__(2597);
var anInstance = __webpack_require__(5787);
var inheritIfRequired = __webpack_require__(9587);
var normalizeStringArgument = __webpack_require__(6277);
var DOMExceptionConstants = __webpack_require__(3678);
var clearErrorStack = __webpack_require__(1060);
var DESCRIPTORS = __webpack_require__(9781);
var IS_PURE = __webpack_require__(1913);

var DOM_EXCEPTION = 'DOMException';
var Error = getBuiltIn('Error');
var NativeDOMException = getBuiltIn(DOM_EXCEPTION);

var $DOMException = function DOMException() {
  anInstance(this, DOMExceptionPrototype);
  var argumentsLength = arguments.length;
  var message = normalizeStringArgument(argumentsLength < 1 ? undefined : arguments[0]);
  var name = normalizeStringArgument(argumentsLength < 2 ? undefined : arguments[1], 'Error');
  var that = new NativeDOMException(message, name);
  var error = Error(message);
  error.name = DOM_EXCEPTION;
  defineProperty(that, 'stack', createPropertyDescriptor(1, clearErrorStack(error.stack, 1)));
  inheritIfRequired(that, this, $DOMException);
  return that;
};

var DOMExceptionPrototype = $DOMException.prototype = NativeDOMException.prototype;

var ERROR_HAS_STACK = 'stack' in Error(DOM_EXCEPTION);
var DOM_EXCEPTION_HAS_STACK = 'stack' in new NativeDOMException(1, 2);

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var descriptor = NativeDOMException && DESCRIPTORS && Object.getOwnPropertyDescriptor(global, DOM_EXCEPTION);

// Bun ~ 0.1.1 DOMException have incorrect descriptor and we can't redefine it
// https://github.com/Jarred-Sumner/bun/issues/399
var BUGGY_DESCRIPTOR = !!descriptor && !(descriptor.writable && descriptor.configurable);

var FORCED_CONSTRUCTOR = ERROR_HAS_STACK && !BUGGY_DESCRIPTOR && !DOM_EXCEPTION_HAS_STACK;

// `DOMException` constructor patch for `.stack` where it's required
// https://webidl.spec.whatwg.org/#es-DOMException-specialness
$({ global: true, constructor: true, forced: IS_PURE || FORCED_CONSTRUCTOR }, { // TODO: fix export logic
  DOMException: FORCED_CONSTRUCTOR ? $DOMException : NativeDOMException
});

var PolyfilledDOMException = getBuiltIn(DOM_EXCEPTION);
var PolyfilledDOMExceptionPrototype = PolyfilledDOMException.prototype;

if (PolyfilledDOMExceptionPrototype.constructor !== PolyfilledDOMException) {
  if (!IS_PURE) {
    defineProperty(PolyfilledDOMExceptionPrototype, 'constructor', createPropertyDescriptor(1, PolyfilledDOMException));
  }

  for (var key in DOMExceptionConstants) if (hasOwn(DOMExceptionConstants, key)) {
    var constant = DOMExceptionConstants[key];
    var constantName = constant.s;
    if (!hasOwn(PolyfilledDOMException, constantName)) {
      defineProperty(PolyfilledDOMException, constantName, createPropertyDescriptor(6, constant.c));
    }
  }
}


/***/ }),

/***/ 6229:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


var defineBuiltIn = __webpack_require__(8052);
var uncurryThis = __webpack_require__(1702);
var toString = __webpack_require__(1340);
var validateArgumentsLength = __webpack_require__(8053);

var $URLSearchParams = URLSearchParams;
var URLSearchParamsPrototype = $URLSearchParams.prototype;
var append = uncurryThis(URLSearchParamsPrototype.append);
var $delete = uncurryThis(URLSearchParamsPrototype['delete']);
var forEach = uncurryThis(URLSearchParamsPrototype.forEach);
var push = uncurryThis([].push);
var params = new $URLSearchParams('a=1&a=2&b=3');

params['delete']('a', 1);
// `undefined` case is a Chromium 117 bug
// https://bugs.chromium.org/p/v8/issues/detail?id=14222
params['delete']('b', undefined);

if (params + '' !== 'a=2') {
  defineBuiltIn(URLSearchParamsPrototype, 'delete', function (name /* , value */) {
    var length = arguments.length;
    var $value = length < 2 ? undefined : arguments[1];
    if (length && $value === undefined) return $delete(this, name);
    var entries = [];
    forEach(this, function (v, k) { // also validates `this`
      push(entries, { key: k, value: v });
    });
    validateArgumentsLength(length, 1);
    var key = toString(name);
    var value = toString($value);
    var index = 0;
    var dindex = 0;
    var found = false;
    var entriesLength = entries.length;
    var entry;
    while (index < entriesLength) {
      entry = entries[index++];
      if (found || entry.key === key) {
        found = true;
        $delete(this, entry.key);
      } else dindex++;
    }
    while (dindex < entriesLength) {
      entry = entries[dindex++];
      if (!(entry.key === key && entry.value === value)) append(this, entry.key, entry.value);
    }
  }, { enumerable: true, unsafe: true });
}


/***/ }),

/***/ 7330:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


var defineBuiltIn = __webpack_require__(8052);
var uncurryThis = __webpack_require__(1702);
var toString = __webpack_require__(1340);
var validateArgumentsLength = __webpack_require__(8053);

var $URLSearchParams = URLSearchParams;
var URLSearchParamsPrototype = $URLSearchParams.prototype;
var getAll = uncurryThis(URLSearchParamsPrototype.getAll);
var $has = uncurryThis(URLSearchParamsPrototype.has);
var params = new $URLSearchParams('a=1');

// `undefined` case is a Chromium 117 bug
// https://bugs.chromium.org/p/v8/issues/detail?id=14222
if (params.has('a', 2) || !params.has('a', undefined)) {
  defineBuiltIn(URLSearchParamsPrototype, 'has', function has(name /* , value */) {
    var length = arguments.length;
    var $value = length < 2 ? undefined : arguments[1];
    if (length && $value === undefined) return $has(this, name);
    var values = getAll(this, name); // also validates `this`
    validateArgumentsLength(length, 1);
    var value = toString($value);
    var index = 0;
    while (index < values.length) {
      if (values[index++] === value) return true;
    } return false;
  }, { enumerable: true, unsafe: true });
}


/***/ }),

/***/ 2062:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


var DESCRIPTORS = __webpack_require__(9781);
var uncurryThis = __webpack_require__(1702);
var defineBuiltInAccessor = __webpack_require__(7045);

var URLSearchParamsPrototype = URLSearchParams.prototype;
var forEach = uncurryThis(URLSearchParamsPrototype.forEach);

// `URLSearchParams.prototype.size` getter
// https://github.com/whatwg/url/pull/734
if (DESCRIPTORS && !('size' in URLSearchParamsPrototype)) {
  defineBuiltInAccessor(URLSearchParamsPrototype, 'size', {
    get: function size() {
      var count = 0;
      forEach(this, function () { count++; });
      return count;
    },
    configurable: true,
    enumerable: true
  });
}


/***/ }),

/***/ 89:
/***/ (function(__unused_webpack_module, exports) {

var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
// runtime helper for setting properties on components
// in a tree-shakable way
exports.Z = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	!function() {
/******/ 		__webpack_require__.p = "";
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ entry_lib; }
});

;// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
/* eslint-disable no-var */
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var currentScript = window.document.currentScript
  if (false) { var getCurrentScript; }

  var src = currentScript && currentScript.src.match(/(.+\/)[^/]+\.js(\?.*)?$/)
  if (src) {
    __webpack_require__.p = src[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

;// CONCATENATED MODULE: external {"commonjs":"vue","commonjs2":"vue","root":"Vue"}
var external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject = require("vue");
;// CONCATENATED MODULE: ./src/assets/img/weibo.png
var weibo_namespaceObject = __webpack_require__.p + "img/weibo.f776237d.png";
;// CONCATENATED MODULE: ./src/assets/img/qq.png
var qq_namespaceObject = __webpack_require__.p + "img/qq.4a17f232.png";
;// CONCATENATED MODULE: ./src/assets/img/qZone.png
var qZone_namespaceObject = __webpack_require__.p + "img/qZone.b6f627f2.png";
;// CONCATENATED MODULE: ./src/assets/img/weChat.png
var weChat_namespaceObject = __webpack_require__.p + "img/weChat.021cb1b7.png";
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/package/share-content.vue?vue&type=template&id=1e320325&scoped=true





const _withScopeId = n => (_pushScopeId("data-v-1e320325"), n = n(), _popScopeId(), n);
const _hoisted_1 = {
  class: "share-content"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_vue_qr = (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.resolveComponent)("vue-qr");
  const _directive_click_outside = (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.resolveDirective)("click-outside");
  return (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.withDirectives)(((0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.openBlock)(), (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.createElementBlock)("div", _hoisted_1, [(0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.createElementVNode)("img", {
    class: "share",
    onClick: _cache[0] || (_cache[0] = $event => $options.shareToMicroblog()),
    src: weibo_namespaceObject,
    alt: "微博"
  }), (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.createElementVNode)("img", {
    class: "share",
    onClick: _cache[1] || (_cache[1] = $event => $options.shareToQQ()),
    src: qq_namespaceObject,
    alt: "qq"
  }), (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.createElementVNode)("img", {
    class: "share",
    onClick: _cache[2] || (_cache[2] = $event => $options.shareToQQRom()),
    src: qZone_namespaceObject,
    alt: "qq空间"
  }), (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.createElementVNode)("img", {
    onClick: _cache[3] || (_cache[3] = (...args) => $options.shareToWechat && $options.shareToWechat(...args)),
    class: "share",
    src: weChat_namespaceObject,
    alt: "微信"
  }), $data.showQr ? ((0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.openBlock)(), (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.createBlock)(_component_vue_qr, {
    key: 0,
    class: "vue-qr",
    margin: $props.info.margin,
    size: $props.info.size,
    text: $props.info.url
  }, null, 8, ["margin", "size", "text"])) : (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.createCommentVNode)("", true)])), [[_directive_click_outside, $options.shareToWechat]]);
}
;// CONCATENATED MODULE: ./src/package/share-content.vue?vue&type=template&id=1e320325&scoped=true

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.push.js
var es_array_push = __webpack_require__(7658);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./node_modules/vue-qr/src/packages/vue-qr.vue?vue&type=template&id=477c6f15

const vue_qrvue_type_template_id_477c6f15_hoisted_1 = ["src"];
function vue_qrvue_type_template_id_477c6f15_render(_ctx, _cache, $props, $setup, $data, $options) {
  return $props.bindElement ? ((0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.openBlock)(), (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.createElementBlock)("img", {
    key: 0,
    style: {
      "display": "inline-block"
    },
    src: $data.imgUrl
  }, null, 8, vue_qrvue_type_template_id_477c6f15_hoisted_1)) : (0,external_commonjs_vue_commonjs2_vue_root_Vue_namespaceObject.createCommentVNode)("", true);
}
;// CONCATENATED MODULE: ./node_modules/vue-qr/src/packages/vue-qr.vue?vue&type=template&id=477c6f15

;// CONCATENATED MODULE: ./node_modules/vue-qr/src/packages/util.js
function toBoolean(val) {
  if (val === '') return val;
  return val === 'true' || val == '1';
}
;// CONCATENATED MODULE: ./node_modules/vue-qr/src/packages/readAsArrayBuffer.js
function readAsArrayBuffer(url, callback) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.responseType = "blob"; //设定返回数据类型为Blob
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result);
      };
      reader.readAsArrayBuffer(xhr.response); //xhr.response就是一个Blob，用FileReader读取
    };

    xhr.open("GET", url);
    xhr.send();
  });
}
/* harmony default export */ var packages_readAsArrayBuffer = (readAsArrayBuffer);
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom-exception.stack.js
var web_dom_exception_stack = __webpack_require__(2801);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.to-reversed.js
var es_typed_array_to_reversed = __webpack_require__(1439);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.to-sorted.js
var es_typed_array_to_sorted = __webpack_require__(7585);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.with.js
var es_typed_array_with = __webpack_require__(5315);
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.url-search-params.delete.js
var web_url_search_params_delete = __webpack_require__(6229);
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.url-search-params.has.js
var web_url_search_params_has = __webpack_require__(7330);
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.url-search-params.size.js
var web_url_search_params_size = __webpack_require__(2062);
;// CONCATENATED MODULE: ./node_modules/vue-qr/packages/path-browserify/index.js
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length) code = path.charCodeAt(i);else if (code === 47 /*/*/) break;else code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0) res += '/..';else res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) res += '/' + path.slice(lastSlash + 1, i);else res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}
var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;
    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0) path = arguments[i];else {
        if (cwd === undefined) cwd = process.cwd();
        path = cwd;
      }
      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }
      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);
    if (resolvedAbsolute) {
      if (resolvedPath.length > 0) return '/' + resolvedPath;else return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },
  normalize: function normalize(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);
    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';
    if (isAbsolute) return '/' + path;
    return path;
  },
  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0) return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined) joined = arg;else joined += '/' + arg;
      }
    }
    if (joined === undefined) return '.';
    return posix.normalize(joined);
  },
  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);
    if (from === to) return '';
    from = posix.resolve(from);
    to = posix.resolve(to);
    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/) break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/) break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode) break;else if (fromCode === 47 /*/*/) lastCommonSep = i;
    }
    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0) out += '..';else out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0) return out + to.slice(toStart + lastCommonSep);else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/) ++toStart;
      return to.slice(toStart);
    }
  },
  _makeLong: function _makeLong(path) {
    return path;
  },
  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }
    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },
  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);
    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;
    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            start = i + 1;
            break;
          }
        } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }
      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            start = i + 1;
            break;
          }
        } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }
      if (end === -1) return '';
      return path.slice(start, end);
    }
  },
  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }
    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },
  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },
  parse: function parse(path) {
    assertPath(path);
    var ret = {
      root: '',
      dir: '',
      base: '',
      ext: '',
      name: ''
    };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }
    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }
    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';
    return ret;
  },
  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};
posix.posix = posix;
const extname = posix.extname;
const basename = posix.basename;
/* harmony default export */ var path_browserify = ((/* unused pure expression or super */ null && (posix)));
;// CONCATENATED MODULE: ./node_modules/vue-qr/packages/skia-canvas-lib/lib/io.js


// const { basename, extname } = require("path");








//
// Mime type <-> File extension mappings
//

class Format {
  constructor() {
    let isWeb = (() => typeof __webpack_require__.g == "undefined")(),
      png = "image/png",
      jpg = "image/jpeg",
      jpeg = "image/jpeg",
      webp = "image/webp",
      pdf = "application/pdf",
      svg = "image/svg+xml";
    Object.assign(this, {
      toMime: this.toMime.bind(this),
      fromMime: this.fromMime.bind(this),
      expected: isWeb ? `"png", "jpg", or "webp"` : `"png", "jpg", "pdf", or "svg"`,
      formats: isWeb ? {
        png,
        jpg,
        jpeg,
        webp
      } : {
        png,
        jpg,
        jpeg,
        pdf,
        svg
      },
      mimes: isWeb ? {
        [png]: "png",
        [jpg]: "jpg",
        [webp]: "webp"
      } : {
        [png]: "png",
        [jpg]: "jpg",
        [pdf]: "pdf",
        [svg]: "svg"
      }
    });
  }
  toMime(ext) {
    return this.formats[(ext || "").replace(/^\./, "").toLowerCase()];
  }
  fromMime(mime) {
    return this.mimes[mime];
  }
}

//
// Validation of the options dict shared by the Canvas saveAs, toBuffer, and toDataURL methods
//

function options(pages, {
  filename = "",
  extension = "",
  format,
  page,
  quality,
  matte,
  density,
  outline,
  archive
} = {}) {
  var {
      fromMime,
      toMime,
      expected
    } = new Format(),
    archive = archive || "canvas",
    ext = format || extension.replace(/@\d+x$/i, "") || extname(filename),
    format = fromMime(toMime(ext) || ext),
    mime = toMime(format),
    pp = pages.length;
  if (!ext) throw new Error(`Cannot determine image format (use a filename extension or 'format' argument)`);
  if (!format) throw new Error(`Unsupported file format "${ext}" (expected ${expected})`);
  if (!pp) throw new RangeError(`Canvas has no associated contexts (try calling getContext or newPage first)`);
  let padding,
    isSequence,
    pattern = filename.replace(/{(\d*)}/g, (_, width) => {
      isSequence = true;
      width = parseInt(width, 10);
      padding = isFinite(width) ? width : isFinite(padding) ? padding : -1;
      return "{}";
    });

  // allow negative indexing if a specific page is specified
  let idx = page > 0 ? page - 1 : page < 0 ? pp + page : undefined;
  if (isFinite(idx) && idx < 0 || idx >= pp) throw new RangeError(pp == 1 ? `Canvas only has a ‘page 1’ (${idx} is out of bounds)` : `Canvas has pages 1–${pp} (${idx} is out of bounds)`);
  pages = isFinite(idx) ? [pages[idx]] : isSequence || format == "pdf" ? pages : pages.slice(-1); // default to the 'current' context

  if (quality === undefined) {
    quality = 0.92;
  } else {
    if (typeof quality != "number" || !isFinite(quality) || quality < 0 || quality > 1) {
      throw new TypeError("The quality option must be an number in the 0.0–1.0 range");
    }
  }
  if (density === undefined) {
    let m = (extension || basename(filename, ext)).match(/@(\d+)x$/i);
    density = m ? parseInt(m[1], 10) : 1;
  } else if (typeof density != "number" || !Number.isInteger(density) || density < 1) {
    throw new TypeError("The density option must be a non-negative integer");
  }
  if (outline === undefined) {
    outline = true;
  } else if (format == "svg") {
    outline = !!outline;
  }
  return {
    filename,
    pattern,
    format,
    mime,
    pages,
    padding,
    quality,
    matte,
    density,
    outline,
    archive
  };
}

//
// Zip (pace Phil Katz & q.v. https://github.com/jimmywarting/StreamSaver.js)
//

class Crc32 {
  static for(data) {
    return new Crc32().append(data).get();
  }
  constructor() {
    this.crc = -1;
  }
  get() {
    return ~this.crc;
  }
  append(data) {
    var crc = this.crc | 0,
      table = this.table;
    for (var offset = 0, len = data.length | 0; offset < len; offset++) {
      crc = crc >>> 8 ^ table[(crc ^ data[offset]) & 0xff];
    }
    this.crc = crc;
    return this;
  }
}
Crc32.prototype.table = (() => {
  var i,
    j,
    t,
    table = [];
  for (i = 0; i < 256; i++) {
    t = i;
    for (j = 0; j < 8; j++) {
      t = t & 1 ? t >>> 1 ^ 0xedb88320 : t >>> 1;
    }
    table[i] = t;
  }
  return table;
})();
function calloc(size) {
  let array = new Uint8Array(size),
    view = new DataView(array.buffer),
    buf = {
      array,
      view,
      size,
      set8(at, to) {
        view.setUint8(at, to);
        return buf;
      },
      set16(at, to) {
        view.setUint16(at, to, true);
        return buf;
      },
      set32(at, to) {
        view.setUint32(at, to, true);
        return buf;
      },
      bytes(at, to) {
        array.set(to, at);
        return buf;
      }
    };
  return buf;
}
// const TextEncoder=require('util').TextEncoder

class Zip {
  constructor(directory) {
    let now = new Date();
    Object.assign(this, {
      directory,
      offset: 0,
      files: [],
      time: (now.getHours() << 6 | now.getMinutes()) << 5 | now.getSeconds() / 2,
      date: (now.getFullYear() - 1980 << 4 | now.getMonth() + 1) << 5 | now.getDate()
    });
    this.add(directory);
  }
  async add(filename, blob) {
    let folder = !blob,
      name = Zip.encoder.encode(`${this.directory}/${folder ? "" : filename}`),
      data = new Uint8Array(folder ? 0 : await blob.arrayBuffer()),
      preamble = 30 + name.length,
      descriptor = preamble + data.length,
      postamble = 16,
      {
        offset
      } = this;
    let header = calloc(26).set32(0, 0x08080014) // zip version
    .set16(6, this.time) // time
    .set16(8, this.date) // date
    .set32(10, Crc32.for(data)) // checksum
    .set32(14, data.length) // compressed size (w/ zero compression)
    .set32(18, data.length) // un-compressed size
    .set16(22, name.length); // filename length (utf8 bytes)
    offset += preamble;
    let payload = calloc(preamble + data.length + postamble).set32(0, 0x04034b50) // local header signature
    .bytes(4, header.array) // ...header fields...
    .bytes(30, name) // filename
    .bytes(preamble, data); // blob bytes
    offset += data.length;
    payload.set32(descriptor, 0x08074b50) // signature
    .bytes(descriptor + 4, header.array.slice(10, 22)); // length & filemame
    offset += postamble;
    this.files.push({
      offset,
      folder,
      name,
      header,
      payload
    });
    this.offset = offset;
  }
  toBuffer() {
    // central directory record
    let length = this.files.reduce((len, {
        name
      }) => 46 + name.length + len, 0),
      cdr = calloc(length + 22),
      index = 0;
    for (var {
      offset,
      name,
      header,
      folder
    } of this.files) {
      cdr.set32(index, 0x02014b50) // archive file signature
      .set16(index + 4, 0x0014) // version
      .bytes(index + 6, header.array) // ...header fields...
      .set8(index + 38, folder ? 0x10 : 0) // is_dir flag
      .set32(index + 42, offset) // file offset
      .bytes(index + 46, name); // filename
      index += 46 + name.length;
    }
    cdr.set32(index, 0x06054b50) // signature
    .set16(index + 8, this.files.length) // № files per-segment
    .set16(index + 10, this.files.length) // № files this segment
    .set32(index + 12, length) // central directory length
    .set32(index + 16, this.offset); // file-offset of directory

    // concatenated zipfile data
    let output = new Uint8Array(this.offset + cdr.size),
      cursor = 0;
    for (var {
      payload
    } of this.files) {
      output.set(payload.array, cursor);
      cursor += payload.size;
    }
    output.set(cdr.array, cursor);
    return output;
  }
  get blob() {
    return new Blob([this.toBuffer()], {
      type: "application/zip"
    });
  }
}
Zip.encoder = new TextEncoder();

//
// Browser helpers for converting canvas elements to blobs/buffers/files/zips
//

const asBlob = (canvas, mime, quality, matte) => {
  if (matte) {
    let {
        width,
        height
      } = canvas,
      comp = Object.assign(document.createElement("canvas"), {
        width,
        height
      }),
      ctx = comp.getContext("2d");
    ctx.fillStyle = matte;
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(canvas, 0, 0);
    canvas = comp;
  }
  return new Promise((res, rej) => canvas.toBlob(res, mime, quality));
};
const asBuffer = (...args) => asBlob(...args).then(b => b.arrayBuffer());
const asDownload = async (canvas, mime, quality, matte, filename) => {
  _download(filename, await asBlob(canvas, mime, quality, matte));
};
const asZipDownload = async (pages, mime, quality, matte, archive, pattern, padding) => {
  let filenames = i => pattern.replace("{}", String(i + 1).padStart(padding, "0")),
    folder = basename(archive, ".zip") || "archive",
    zip = new Zip(folder);
  await Promise.all(pages.map(async (page, i) => {
    let filename = filenames(i); // serialize filename(s) before awaiting
    await zip.add(filename, await asBlob(page, mime, quality, matte));
  }));
  _download(`${folder}.zip`, zip.blob);
};
const _download = (filename, blob) => {
  const href = window.URL.createObjectURL(blob),
    link = document.createElement("a");
  link.style.display = "none";
  link.href = href;
  link.setAttribute("download", filename);
  if (typeof link.download === "undefined") {
    link.setAttribute("target", "_blank");
  }
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => window.URL.revokeObjectURL(href), 100);
};
const atScale = (pages, density, matte) => pages.map(page => {
  if (density == 1 && !matte) return page.canvas;
  let scaled = document.createElement("canvas"),
    ctx = scaled.getContext("2d"),
    src = page.canvas ? page.canvas : page;
  scaled.width = src.width * density;
  scaled.height = src.height * density;
  if (matte) {
    ctx.fillStyle = matte;
    ctx.fillRect(0, 0, scaled.width, scaled.height);
  }
  ctx.scale(density, density);
  ctx.drawImage(src, 0, 0);
  return scaled;
});
const obj = {
  asBuffer,
  asDownload,
  asZipDownload,
  atScale,
  options
};
/* harmony default export */ var io = (obj);
// module.exports = { asBuffer, asDownload, asZipDownload, atScale, options };
;// CONCATENATED MODULE: ./node_modules/vue-qr/packages/skia-canvas-lib/lib/browser.js


// const {asBuffer, asDownload, asZipDownload, atScale, options} = require('./io')


const {
  asBuffer: browser_asBuffer,
  asDownload: browser_asDownload,
  asZipDownload: browser_asZipDownload,
  atScale: browser_atScale,
  options: browser_options
} = io;
//
// Browser equivalents of the skia-canvas convenience initializers and polyfills for
// the Canvas object’s newPage & export methods
//

const _toURL_ = Symbol.for("toDataURL");
const loadImage = src => new Promise((onload, onerror) => Object.assign(new browser_Image(), {
  crossOrigin: "Anonymous",
  onload,
  onerror,
  src
}));
class Canvas {
  constructor(width, height) {
    // alert(1)
    let elt = document.createElement("canvas"),
      pages = [];
    Object.defineProperty(elt, "async", {
      value: true,
      writable: false,
      enumerable: true
    });
    for (var [prop, get] of Object.entries({
      png: () => browser_asBuffer(elt, "image/png"),
      jpg: () => browser_asBuffer(elt, "image/jpeg"),
      pages: () => pages.concat(elt).map(c => c.getContext("2d"))
    })) Object.defineProperty(elt, prop, {
      get
    });
    return Object.assign(elt, {
      width,
      height,
      newPage(...size) {
        var {
            width,
            height
          } = elt,
          page = Object.assign(document.createElement("canvas"), {
            width,
            height
          });
        page.getContext("2d").drawImage(elt, 0, 0);
        pages.push(page);
        var [width, height] = size.length ? size : [width, height];
        return Object.assign(elt, {
          width,
          height
        }).getContext("2d");
      },
      saveAs(filename, args) {
        args = typeof args == "number" ? {
          quality: args
        } : args;
        let opts = browser_options(this.pages, {
            filename,
            ...args
          }),
          {
            pattern,
            padding,
            mime,
            quality,
            matte,
            density,
            archive
          } = opts,
          pages = browser_atScale(opts.pages, density);
        return padding == undefined ? browser_asDownload(pages[0], mime, quality, matte, filename) : browser_asZipDownload(pages, mime, quality, matte, archive, pattern, padding);
      },
      toBuffer(extension = "png", args = {}) {
        args = typeof args == "number" ? {
          quality: args
        } : args;
        let opts = browser_options(this.pages, {
            extension,
            ...args
          }),
          {
            mime,
            quality,
            matte,
            pages,
            density
          } = opts,
          canvas = browser_atScale(pages, density, matte)[0];
        return browser_asBuffer(canvas, mime, quality, matte);
      },
      [_toURL_]: elt.toDataURL.bind(elt),
      toDataURL(extension = "png", args = {}) {
        args = typeof args == "number" ? {
          quality: args
        } : args;
        let opts = browser_options(this.pages, {
            extension,
            ...args
          }),
          {
            mime,
            quality,
            matte,
            pages,
            density
          } = opts,
          canvas = browser_atScale(pages, density, matte)[0],
          url = canvas[canvas === elt ? _toURL_ : "toDataURL"](mime, quality);
        return Promise.resolve(url);
      }
    });
  }
}
const {
  CanvasRenderingContext2D,
  CanvasGradient,
  CanvasPattern,
  Image: browser_Image,
  ImageData,
  Path2D,
  DOMMatrix,
  DOMRect,
  DOMPoint
} = window;

// module.exports = {
//   Canvas,
//   loadImage,
//   CanvasRenderingContext2D,
//   CanvasGradient,
//   CanvasPattern,
//   Image,
//   ImageData,
//   Path2D,
//   DOMMatrix,
//   DOMRect,
//   DOMPoint
// };

const browser_obj = {
  Canvas,
  loadImage,
  CanvasRenderingContext2D,
  CanvasGradient,
  CanvasPattern,
  Image: browser_Image,
  ImageData,
  Path2D,
  DOMMatrix,
  DOMRect,
  DOMPoint
};
/* harmony default export */ var browser = (browser_obj);
;// CONCATENATED MODULE: ./node_modules/js-binary-schema-parser/src/index.js

const parse = (stream, schema, result = {}, parent = result) => {
  if (Array.isArray(schema)) {
    schema.forEach(partSchema => parse(stream, partSchema, result, parent));
  } else if (typeof schema === 'function') {
    schema(stream, result, parent, parse);
  } else {
    const key = Object.keys(schema)[0];
    if (Array.isArray(schema[key])) {
      parent[key] = {};
      parse(stream, schema[key], result, parent[key]);
    } else {
      parent[key] = schema[key](stream, result, parent, parse);
    }
  }
  return result;
};
const conditional = (schema, conditionFunc) => (stream, result, parent, parse) => {
  if (conditionFunc(stream, result, parent)) {
    parse(stream, schema, result, parent);
  }
};
const loop = (schema, continueFunc) => (stream, result, parent, parse) => {
  const arr = [];
  let lastStreamPos = stream.pos;
  while (continueFunc(stream, result, parent)) {
    const newParent = {};
    parse(stream, schema, result, newParent);
    // cases when whole file is parsed but no termination is there and stream position is not getting updated as well
    // it falls into infinite recursion, null check to avoid the same
    if (stream.pos === lastStreamPos) {
      break;
    }
    lastStreamPos = stream.pos;
    arr.push(newParent);
  }
  return arr;
};
;// CONCATENATED MODULE: ./node_modules/js-binary-schema-parser/src/parsers/uint8.js
// Default stream and parsers for Uint8TypedArray data type

const buildStream = uint8Data => ({
  data: uint8Data,
  pos: 0
});
const readByte = () => stream => {
  return stream.data[stream.pos++];
};
const peekByte = (offset = 0) => stream => {
  return stream.data[stream.pos + offset];
};
const readBytes = length => stream => {
  return stream.data.subarray(stream.pos, stream.pos += length);
};
const peekBytes = length => stream => {
  return stream.data.subarray(stream.pos, stream.pos + length);
};
const readString = length => stream => {
  return Array.from(readBytes(length)(stream)).map(value => String.fromCharCode(value)).join('');
};
const readUnsigned = littleEndian => stream => {
  const bytes = readBytes(2)(stream);
  return littleEndian ? (bytes[1] << 8) + bytes[0] : (bytes[0] << 8) + bytes[1];
};
const readArray = (byteSize, totalOrFunc) => (stream, result, parent) => {
  const total = typeof totalOrFunc === 'function' ? totalOrFunc(stream, result, parent) : totalOrFunc;
  const parser = readBytes(byteSize);
  const arr = new Array(total);
  for (var i = 0; i < total; i++) {
    arr[i] = parser(stream);
  }
  return arr;
};
const subBitsTotal = (bits, startIndex, length) => {
  var result = 0;
  for (var i = 0; i < length; i++) {
    result += bits[startIndex + i] && 2 ** (length - i - 1);
  }
  return result;
};
const readBits = schema => stream => {
  const byte = readByte()(stream);
  // convert the byte to bit array
  const bits = new Array(8);
  for (var i = 0; i < 8; i++) {
    bits[7 - i] = !!(byte & 1 << i);
  }
  // convert the bit array to values based on the schema
  return Object.keys(schema).reduce((res, key) => {
    const def = schema[key];
    if (def.length) {
      res[key] = subBitsTotal(bits, def.index, def.length);
    } else {
      res[key] = bits[def.index];
    }
    return res;
  }, {});
};
;// CONCATENATED MODULE: ./node_modules/js-binary-schema-parser/src/schemas/gif.js







// a set of 0x00 terminated subblocks
var subBlocksSchema = {
  blocks: stream => {
    const terminator = 0x00;
    const chunks = [];
    const streamSize = stream.data.length;
    var total = 0;
    for (var size = readByte()(stream); size !== terminator; size = readByte()(stream)) {
      // size becomes undefined for some case when file is corrupted and  terminator is not proper 
      // null check to avoid recursion
      if (!size) break;
      // catch corrupted files with no terminator
      if (stream.pos + size >= streamSize) {
        const availableSize = streamSize - stream.pos;
        chunks.push(readBytes(availableSize)(stream));
        total += availableSize;
        break;
      }
      chunks.push(readBytes(size)(stream));
      total += size;
    }
    const result = new Uint8Array(total);
    var offset = 0;
    for (var i = 0; i < chunks.length; i++) {
      result.set(chunks[i], offset);
      offset += chunks[i].length;
    }
    return result;
  }
};

// global control extension
const gceSchema = conditional({
  gce: [{
    codes: readBytes(2)
  }, {
    byteSize: readByte()
  }, {
    extras: readBits({
      future: {
        index: 0,
        length: 3
      },
      disposal: {
        index: 3,
        length: 3
      },
      userInput: {
        index: 6
      },
      transparentColorGiven: {
        index: 7
      }
    })
  }, {
    delay: readUnsigned(true)
  }, {
    transparentColorIndex: readByte()
  }, {
    terminator: readByte()
  }]
}, stream => {
  var codes = peekBytes(2)(stream);
  return codes[0] === 0x21 && codes[1] === 0xf9;
});

// image pipeline block
const imageSchema = conditional({
  image: [{
    code: readByte()
  }, {
    descriptor: [{
      left: readUnsigned(true)
    }, {
      top: readUnsigned(true)
    }, {
      width: readUnsigned(true)
    }, {
      height: readUnsigned(true)
    }, {
      lct: readBits({
        exists: {
          index: 0
        },
        interlaced: {
          index: 1
        },
        sort: {
          index: 2
        },
        future: {
          index: 3,
          length: 2
        },
        size: {
          index: 5,
          length: 3
        }
      })
    }]
  }, conditional({
    lct: readArray(3, (stream, result, parent) => {
      return Math.pow(2, parent.descriptor.lct.size + 1);
    })
  }, (stream, result, parent) => {
    return parent.descriptor.lct.exists;
  }), {
    data: [{
      minCodeSize: readByte()
    }, subBlocksSchema]
  }]
}, stream => {
  return peekByte()(stream) === 0x2c;
});

// plain text block
const textSchema = conditional({
  text: [{
    codes: readBytes(2)
  }, {
    blockSize: readByte()
  }, {
    preData: (stream, result, parent) => readBytes(parent.text.blockSize)(stream)
  }, subBlocksSchema]
}, stream => {
  var codes = peekBytes(2)(stream);
  return codes[0] === 0x21 && codes[1] === 0x01;
});

// application block
const applicationSchema = conditional({
  application: [{
    codes: readBytes(2)
  }, {
    blockSize: readByte()
  }, {
    id: (stream, result, parent) => readString(parent.blockSize)(stream)
  }, subBlocksSchema]
}, stream => {
  var codes = peekBytes(2)(stream);
  return codes[0] === 0x21 && codes[1] === 0xff;
});

// comment block
const commentSchema = conditional({
  comment: [{
    codes: readBytes(2)
  }, subBlocksSchema]
}, stream => {
  var codes = peekBytes(2)(stream);
  return codes[0] === 0x21 && codes[1] === 0xfe;
});
const schema = [{
  header: [{
    signature: readString(3)
  }, {
    version: readString(3)
  }]
}, {
  lsd: [{
    width: readUnsigned(true)
  }, {
    height: readUnsigned(true)
  }, {
    gct: readBits({
      exists: {
        index: 0
      },
      resolution: {
        index: 1,
        length: 3
      },
      sort: {
        index: 4
      },
      size: {
        index: 5,
        length: 3
      }
    })
  }, {
    backgroundColorIndex: readByte()
  }, {
    pixelAspectRatio: readByte()
  }]
}, conditional({
  gct: readArray(3, (stream, result) => Math.pow(2, result.lsd.gct.size + 1))
}, (stream, result) => result.lsd.gct.exists),
// content frames
{
  frames: loop([gceSchema, applicationSchema, commentSchema, imageSchema, textSchema], stream => {
    var nextCode = peekByte()(stream);
    // rather than check for a terminator, we should check for the existence
    // of an ext or image block to avoid infinite loops
    //var terminator = 0x3B;
    //return nextCode !== terminator;
    return nextCode === 0x21 || nextCode === 0x2c;
  })
}];
/* harmony default export */ var gif = (schema);
;// CONCATENATED MODULE: ./node_modules/vue-qr/src/lib/gifuct-js/deinterlace.js
/**
 * Deinterlace function from https://github.com/shachaf/jsgif
 */
const deinterlace = (pixels, width) => {
  const newPixels = new Array(pixels.length);
  const rows = pixels.length / width;
  const cpRow = function (toRow, fromRow) {
    const fromPixels = pixels.slice(fromRow * width, (fromRow + 1) * width);
    newPixels.splice.apply(newPixels, [toRow * width, width].concat(fromPixels));
  };
  // See appendix E.
  const offsets = [0, 4, 2, 1];
  const steps = [8, 8, 4, 2];
  var fromRow = 0;
  for (var pass = 0; pass < 4; pass++) {
    for (var toRow = offsets[pass]; toRow < rows; toRow += steps[pass]) {
      cpRow(toRow, fromRow);
      fromRow++;
    }
  }
  return newPixels;
};
;// CONCATENATED MODULE: ./node_modules/vue-qr/src/lib/gifuct-js/lzw.js
/**
 * javascript port of java LZW decompression
 * Original java author url: https://gist.github.com/devunwired/4479231
 */
const lzw = (minCodeSize, data, pixelCount) => {
  const MAX_STACK_SIZE = 4096;
  const nullCode = -1;
  const npix = pixelCount;
  var available, clear, code_mask, code_size, end_of_information, in_code, old_code, bits, code, i, datum, data_size, first, top, bi, pi;
  const dstPixels = new Array(pixelCount);
  const prefix = new Array(MAX_STACK_SIZE);
  const suffix = new Array(MAX_STACK_SIZE);
  const pixelStack = new Array(MAX_STACK_SIZE + 1);
  // Initialize GIF data stream decoder.
  data_size = minCodeSize;
  clear = 1 << data_size;
  end_of_information = clear + 1;
  available = clear + 2;
  old_code = nullCode;
  code_size = data_size + 1;
  code_mask = (1 << code_size) - 1;
  for (code = 0; code < clear; code++) {
    prefix[code] = 0;
    suffix[code] = code;
  }
  // Decode GIF pixel stream.
  var datum, bits, count, first, top, pi, bi;
  datum = bits = count = first = top = pi = bi = 0;
  for (i = 0; i < npix;) {
    if (top === 0) {
      if (bits < code_size) {
        // get the next byte
        datum += data[bi] << bits;
        bits += 8;
        bi++;
        continue;
      }
      // Get the next code.
      code = datum & code_mask;
      datum >>= code_size;
      bits -= code_size;
      // Interpret the code
      if (code > available || code == end_of_information) {
        break;
      }
      if (code == clear) {
        // Reset decoder.
        code_size = data_size + 1;
        code_mask = (1 << code_size) - 1;
        available = clear + 2;
        old_code = nullCode;
        continue;
      }
      if (old_code == nullCode) {
        pixelStack[top++] = suffix[code];
        old_code = code;
        first = code;
        continue;
      }
      in_code = code;
      if (code == available) {
        pixelStack[top++] = first;
        code = old_code;
      }
      while (code > clear) {
        pixelStack[top++] = suffix[code];
        code = prefix[code];
      }
      first = suffix[code] & 0xff;
      pixelStack[top++] = first;
      // add a new string to the table, but only if space is available
      // if not, just continue with current table until a clear code is found
      // (deferred clear code implementation as per GIF spec)
      if (available < MAX_STACK_SIZE) {
        prefix[available] = old_code;
        suffix[available] = first;
        available++;
        if ((available & code_mask) === 0 && available < MAX_STACK_SIZE) {
          code_size++;
          code_mask += available;
        }
      }
      old_code = in_code;
    }
    // Pop a pixel off the pixel stack.
    top--;
    dstPixels[pi++] = pixelStack[top];
    i++;
  }
  for (i = pi; i < npix; i++) {
    dstPixels[i] = 0; // clear missing pixels
  }

  return dstPixels;
};
;// CONCATENATED MODULE: ./node_modules/vue-qr/src/lib/gifuct-js/index.js








const parseGIF = arrayBuffer => {
  const byteData = new Uint8Array(arrayBuffer);
  return parse(buildStream(byteData), gif);
};
const generatePatch = image => {
  const totalPixels = image.pixels.length;
  const patchData = new Uint8ClampedArray(totalPixels * 4);
  for (var i = 0; i < totalPixels; i++) {
    const pos = i * 4;
    const colorIndex = image.pixels[i];
    const color = image.colorTable[colorIndex];
    patchData[pos] = color[0];
    patchData[pos + 1] = color[1];
    patchData[pos + 2] = color[2];
    patchData[pos + 3] = colorIndex !== image.transparentIndex ? 255 : 0;
  }
  return patchData;
};
const decompressFrame = (frame, gct, buildImagePatch) => {
  if (!frame.image) {
    console.warn('gif frame does not have associated image.');
    return;
  }
  const {
    image
  } = frame;
  // get the number of pixels
  const totalPixels = image.descriptor.width * image.descriptor.height;
  // do lzw decompression
  var pixels = lzw(image.data.minCodeSize, image.data.blocks, totalPixels);
  // deal with interlacing if necessary
  if (image.descriptor.lct.interlaced) {
    pixels = deinterlace(pixels, image.descriptor.width);
  }
  const resultImage = {
    pixels: pixels,
    dims: {
      top: frame.image.descriptor.top,
      left: frame.image.descriptor.left,
      width: frame.image.descriptor.width,
      height: frame.image.descriptor.height
    }
  };
  // color table
  if (image.descriptor.lct && image.descriptor.lct.exists) {
    resultImage.colorTable = image.lct;
  } else {
    resultImage.colorTable = gct;
  }
  // add per frame relevant gce information
  if (frame.gce) {
    resultImage.delay = (frame.gce.delay || 10) * 10; // convert to ms
    resultImage.disposalType = frame.gce.extras.disposal;
    // transparency
    if (frame.gce.extras.transparentColorGiven) {
      resultImage.transparentIndex = frame.gce.transparentColorIndex;
    }
  }
  // create canvas usable imagedata if desired
  if (buildImagePatch) {
    resultImage.patch = generatePatch(resultImage);
  }
  return resultImage;
};
const decompressFrames = (parsedGif, buildImagePatches) => {
  return parsedGif.frames.filter(f => f.image).map(f => decompressFrame(f, parsedGif.gct, buildImagePatches));
};
;// CONCATENATED MODULE: ./node_modules/vue-qr/src/lib/qrcode.js

//---------------------------------------------------------------------
// QRCode for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
// Re-written in TypeScript by Makito <sumimakito@hotmail.com>
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//   http://www.opensource.org/licenses/mit-license.php
//
// The word "QR Code" is registered trademark of
// DENSO WAVE INCORPORATED
//   http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------
function checkQRVersion(version, sText, nCorrectLevel) {
  const length = _getUTF8Length(sText);
  const i = version - 1;
  let nLimit = 0;
  switch (nCorrectLevel) {
    case QRErrorCorrectLevel.L:
      nLimit = QRCodeLimitLength[i][0];
      break;
    case QRErrorCorrectLevel.M:
      nLimit = QRCodeLimitLength[i][1];
      break;
    case QRErrorCorrectLevel.Q:
      nLimit = QRCodeLimitLength[i][2];
      break;
    case QRErrorCorrectLevel.H:
      nLimit = QRCodeLimitLength[i][3];
      break;
  }
  return length <= nLimit;
}
function _getTypeNumber(sText, nCorrectLevel) {
  var nType = 1;
  var length = _getUTF8Length(sText);
  for (var i = 0, len = QRCodeLimitLength.length; i < len; i++) {
    var nLimit = 0;
    switch (nCorrectLevel) {
      case QRErrorCorrectLevel.L:
        nLimit = QRCodeLimitLength[i][0];
        break;
      case QRErrorCorrectLevel.M:
        nLimit = QRCodeLimitLength[i][1];
        break;
      case QRErrorCorrectLevel.Q:
        nLimit = QRCodeLimitLength[i][2];
        break;
      case QRErrorCorrectLevel.H:
        nLimit = QRCodeLimitLength[i][3];
        break;
    }
    if (length <= nLimit) {
      break;
    } else {
      nType++;
    }
  }
  if (nType > QRCodeLimitLength.length) {
    throw new Error("Too long data");
  }
  return nType;
}
function _getUTF8Length(sText) {
  var replacedText = encodeURI(sText).toString().replace(/\%[0-9a-fA-F]{2}/g, "a");
  return replacedText.length + (replacedText.length != Number(sText) ? 3 : 0);
}
class QR8bitByte {
  constructor(data) {
    this.mode = QRMode.MODE_8BIT_BYTE;
    this.parsedData = [];
    this.data = data;
    const byteArrays = [];
    // Added to support UTF-8 Characters
    for (let i = 0, l = this.data.length; i < l; i++) {
      const byteArray = [];
      const code = this.data.charCodeAt(i);
      if (code > 0x10000) {
        byteArray[0] = 0xf0 | (code & 0x1c0000) >>> 18;
        byteArray[1] = 0x80 | (code & 0x3f000) >>> 12;
        byteArray[2] = 0x80 | (code & 0xfc0) >>> 6;
        byteArray[3] = 0x80 | code & 0x3f;
      } else if (code > 0x800) {
        byteArray[0] = 0xe0 | (code & 0xf000) >>> 12;
        byteArray[1] = 0x80 | (code & 0xfc0) >>> 6;
        byteArray[2] = 0x80 | code & 0x3f;
      } else if (code > 0x80) {
        byteArray[0] = 0xc0 | (code & 0x7c0) >>> 6;
        byteArray[1] = 0x80 | code & 0x3f;
      } else {
        byteArray[0] = code;
      }
      byteArrays.push(byteArray);
    }
    this.parsedData = Array.prototype.concat.apply([], byteArrays);
    if (this.parsedData.length != this.data.length) {
      this.parsedData.unshift(191);
      this.parsedData.unshift(187);
      this.parsedData.unshift(239);
    }
  }
  getLength() {
    return this.parsedData.length;
  }
  write(buffer) {
    for (let i = 0, l = this.parsedData.length; i < l; i++) {
      buffer.put(this.parsedData[i], 8);
    }
  }
}
class QRCodeModel {
  constructor(typeNumber = -1, errorCorrectLevel = QRErrorCorrectLevel.L) {
    this.moduleCount = 0;
    this.dataList = [];
    this.typeNumber = typeNumber;
    this.errorCorrectLevel = errorCorrectLevel;
    this.moduleCount = 0;
    this.dataList = [];
  }
  addData(data) {
    if (this.typeNumber <= 0) {
      this.typeNumber = _getTypeNumber(data, this.errorCorrectLevel);
    } else if (this.typeNumber > 40) {
      throw new Error(`Invalid QR version: ${this.typeNumber}`);
    } else {
      if (!checkQRVersion(this.typeNumber, data, this.errorCorrectLevel)) {
        throw new Error(`Data is too long for QR version: ${this.typeNumber}`);
      }
    }
    const newData = new QR8bitByte(data);
    this.dataList.push(newData);
    this.dataCache = undefined;
  }
  isDark(row, col) {
    if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
      throw new Error(`${row},${col}`);
    }
    return this.modules[row][col];
  }
  getModuleCount() {
    return this.moduleCount;
  }
  make() {
    this.makeImpl(false, this.getBestMaskPattern());
  }
  makeImpl(test, maskPattern) {
    this.moduleCount = this.typeNumber * 4 + 17;
    this.modules = new Array(this.moduleCount);
    for (let row = 0; row < this.moduleCount; row++) {
      this.modules[row] = new Array(this.moduleCount);
      for (let col = 0; col < this.moduleCount; col++) {
        this.modules[row][col] = null;
      }
    }
    this.setupPositionProbePattern(0, 0);
    this.setupPositionProbePattern(this.moduleCount - 7, 0);
    this.setupPositionProbePattern(0, this.moduleCount - 7);
    this.setupPositionAdjustPattern();
    this.setupTimingPattern();
    this.setupTypeInfo(test, maskPattern);
    if (this.typeNumber >= 7) {
      this.setupTypeNumber(test);
    }
    if (this.dataCache == null) {
      this.dataCache = QRCodeModel.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
    }
    this.mapData(this.dataCache, maskPattern);
  }
  setupPositionProbePattern(row, col) {
    for (let r = -1; r <= 7; r++) {
      if (row + r <= -1 || this.moduleCount <= row + r) continue;
      for (let c = -1; c <= 7; c++) {
        if (col + c <= -1 || this.moduleCount <= col + c) continue;
        if (0 <= r && r <= 6 && (c == 0 || c == 6) || 0 <= c && c <= 6 && (r == 0 || r == 6) || 2 <= r && r <= 4 && 2 <= c && c <= 4) {
          this.modules[row + r][col + c] = true;
        } else {
          this.modules[row + r][col + c] = false;
        }
      }
    }
  }
  getBestMaskPattern() {
    if (Number.isInteger(this.maskPattern) && Object.values(QRMaskPattern).includes(this.maskPattern)) {
      return this.maskPattern;
    }
    let minLostPoint = 0;
    let pattern = 0;
    for (let i = 0; i < 8; i++) {
      this.makeImpl(true, i);
      const lostPoint = QRUtil.getLostPoint(this);
      if (i == 0 || minLostPoint > lostPoint) {
        minLostPoint = lostPoint;
        pattern = i;
      }
    }
    return pattern;
  }
  setupTimingPattern() {
    for (let r = 8; r < this.moduleCount - 8; r++) {
      if (this.modules[r][6] != null) {
        continue;
      }
      this.modules[r][6] = r % 2 == 0;
    }
    for (let c = 8; c < this.moduleCount - 8; c++) {
      if (this.modules[6][c] != null) {
        continue;
      }
      this.modules[6][c] = c % 2 == 0;
    }
  }
  setupPositionAdjustPattern() {
    const pos = QRUtil.getPatternPosition(this.typeNumber);
    for (let i = 0; i < pos.length; i++) {
      for (let j = 0; j < pos.length; j++) {
        const row = pos[i];
        const col = pos[j];
        if (this.modules[row][col] != null) {
          continue;
        }
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (r == -2 || r == 2 || c == -2 || c == 2 || r == 0 && c == 0) {
              this.modules[row + r][col + c] = true;
            } else {
              this.modules[row + r][col + c] = false;
            }
          }
        }
      }
    }
  }
  setupTypeNumber(test) {
    const bits = QRUtil.getBCHTypeNumber(this.typeNumber);
    for (var i = 0; i < 18; i++) {
      var mod = !test && (bits >> i & 1) == 1;
      this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
    }
    for (var i = 0; i < 18; i++) {
      var mod = !test && (bits >> i & 1) == 1;
      this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
    }
  }
  setupTypeInfo(test, maskPattern) {
    const data = this.errorCorrectLevel << 3 | maskPattern;
    const bits = QRUtil.getBCHTypeInfo(data);
    for (var i = 0; i < 15; i++) {
      var mod = !test && (bits >> i & 1) == 1;
      if (i < 6) {
        this.modules[i][8] = mod;
      } else if (i < 8) {
        this.modules[i + 1][8] = mod;
      } else {
        this.modules[this.moduleCount - 15 + i][8] = mod;
      }
    }
    for (var i = 0; i < 15; i++) {
      var mod = !test && (bits >> i & 1) == 1;
      if (i < 8) {
        this.modules[8][this.moduleCount - i - 1] = mod;
      } else if (i < 9) {
        this.modules[8][15 - i - 1 + 1] = mod;
      } else {
        this.modules[8][15 - i - 1] = mod;
      }
    }
    this.modules[this.moduleCount - 8][8] = !test;
  }
  mapData(data, maskPattern) {
    let inc = -1;
    let row = this.moduleCount - 1;
    let bitIndex = 7;
    let byteIndex = 0;
    for (let col = this.moduleCount - 1; col > 0; col -= 2) {
      if (col == 6) col--;
      while (true) {
        for (let c = 0; c < 2; c++) {
          if (this.modules[row][col - c] == null) {
            let dark = false;
            if (byteIndex < data.length) {
              dark = (data[byteIndex] >>> bitIndex & 1) == 1;
            }
            const mask = QRUtil.getMask(maskPattern, row, col - c);
            if (mask) {
              dark = !dark;
            }
            this.modules[row][col - c] = dark;
            bitIndex--;
            if (bitIndex == -1) {
              byteIndex++;
              bitIndex = 7;
            }
          }
        }
        row += inc;
        if (row < 0 || this.moduleCount <= row) {
          row -= inc;
          inc = -inc;
          break;
        }
      }
    }
  }
  static createData(typeNumber, errorCorrectLevel, dataList) {
    const rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel);
    const buffer = new QRBitBuffer();
    for (var i = 0; i < dataList.length; i++) {
      const data = dataList[i];
      buffer.put(data.mode, 4);
      buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber));
      data.write(buffer);
    }
    let totalDataCount = 0;
    for (var i = 0; i < rsBlocks.length; i++) {
      totalDataCount += rsBlocks[i].dataCount;
    }
    if (buffer.getLengthInBits() > totalDataCount * 8) {
      throw new Error(`code length overflow. (${buffer.getLengthInBits()}>${totalDataCount * 8})`);
    }
    if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
      buffer.put(0, 4);
    }
    while (buffer.getLengthInBits() % 8 != 0) {
      buffer.putBit(false);
    }
    while (true) {
      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break;
      }
      buffer.put(QRCodeModel.PAD0, 8);
      if (buffer.getLengthInBits() >= totalDataCount * 8) {
        break;
      }
      buffer.put(QRCodeModel.PAD1, 8);
    }
    return QRCodeModel.createBytes(buffer, rsBlocks);
  }
  static createBytes(buffer, rsBlocks) {
    let offset = 0;
    let maxDcCount = 0;
    let maxEcCount = 0;
    const dcdata = new Array(rsBlocks.length);
    const ecdata = new Array(rsBlocks.length);
    for (var r = 0; r < rsBlocks.length; r++) {
      const dcCount = rsBlocks[r].dataCount;
      const ecCount = rsBlocks[r].totalCount - dcCount;
      maxDcCount = Math.max(maxDcCount, dcCount);
      maxEcCount = Math.max(maxEcCount, ecCount);
      dcdata[r] = new Array(dcCount);
      for (var i = 0; i < dcdata[r].length; i++) {
        dcdata[r][i] = 0xff & buffer.buffer[i + offset];
      }
      offset += dcCount;
      const rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
      const rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);
      const modPoly = rawPoly.mod(rsPoly);
      ecdata[r] = new Array(rsPoly.getLength() - 1);
      for (var i = 0; i < ecdata[r].length; i++) {
        const modIndex = i + modPoly.getLength() - ecdata[r].length;
        ecdata[r][i] = modIndex >= 0 ? modPoly.get(modIndex) : 0;
      }
    }
    let totalCodeCount = 0;
    for (var i = 0; i < rsBlocks.length; i++) {
      totalCodeCount += rsBlocks[i].totalCount;
    }
    const data = new Array(totalCodeCount);
    let index = 0;
    for (var i = 0; i < maxDcCount; i++) {
      for (var r = 0; r < rsBlocks.length; r++) {
        if (i < dcdata[r].length) {
          data[index++] = dcdata[r][i];
        }
      }
    }
    for (var i = 0; i < maxEcCount; i++) {
      for (var r = 0; r < rsBlocks.length; r++) {
        if (i < ecdata[r].length) {
          data[index++] = ecdata[r][i];
        }
      }
    }
    return data;
  }
}
QRCodeModel.PAD0 = 0xec;
QRCodeModel.PAD1 = 0x11;
const QRErrorCorrectLevel = {
  L: 1,
  M: 0,
  Q: 3,
  H: 2
};
const QRMode = {
  MODE_NUMBER: 1 << 0,
  MODE_ALPHA_NUM: 1 << 1,
  MODE_8BIT_BYTE: 1 << 2,
  MODE_KANJI: 1 << 3
};
const QRMaskPattern = {
  PATTERN000: 0,
  PATTERN001: 1,
  PATTERN010: 2,
  PATTERN011: 3,
  PATTERN100: 4,
  PATTERN101: 5,
  PATTERN110: 6,
  PATTERN111: 7
};
class QRUtil {
  static getBCHTypeInfo(data) {
    let d = data << 10;
    while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
      d ^= QRUtil.G15 << QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15);
    }
    return (data << 10 | d) ^ QRUtil.G15_MASK;
  }
  static getBCHTypeNumber(data) {
    let d = data << 12;
    while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) {
      d ^= QRUtil.G18 << QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18);
    }
    return data << 12 | d;
  }
  static getBCHDigit(data) {
    let digit = 0;
    while (data != 0) {
      digit++;
      data >>>= 1;
    }
    return digit;
  }
  static getPatternPosition(typeNumber) {
    return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1];
  }
  static getMask(maskPattern, i, j) {
    switch (maskPattern) {
      case QRMaskPattern.PATTERN000:
        return (i + j) % 2 == 0;
      case QRMaskPattern.PATTERN001:
        return i % 2 == 0;
      case QRMaskPattern.PATTERN010:
        return j % 3 == 0;
      case QRMaskPattern.PATTERN011:
        return (i + j) % 3 == 0;
      case QRMaskPattern.PATTERN100:
        return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;
      case QRMaskPattern.PATTERN101:
        return i * j % 2 + i * j % 3 == 0;
      case QRMaskPattern.PATTERN110:
        return (i * j % 2 + i * j % 3) % 2 == 0;
      case QRMaskPattern.PATTERN111:
        return (i * j % 3 + (i + j) % 2) % 2 == 0;
      default:
        throw new Error(`bad maskPattern:${maskPattern}`);
    }
  }
  static getErrorCorrectPolynomial(errorCorrectLength) {
    let a = new QRPolynomial([1], 0);
    for (let i = 0; i < errorCorrectLength; i++) {
      a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0));
    }
    return a;
  }
  static getLengthInBits(mode, type) {
    if (1 <= type && type < 10) {
      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 10;
        case QRMode.MODE_ALPHA_NUM:
          return 9;
        case QRMode.MODE_8BIT_BYTE:
          return 8;
        case QRMode.MODE_KANJI:
          return 8;
        default:
          throw new Error(`mode:${mode}`);
      }
    } else if (type < 27) {
      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 12;
        case QRMode.MODE_ALPHA_NUM:
          return 11;
        case QRMode.MODE_8BIT_BYTE:
          return 16;
        case QRMode.MODE_KANJI:
          return 10;
        default:
          throw new Error(`mode:${mode}`);
      }
    } else if (type < 41) {
      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 14;
        case QRMode.MODE_ALPHA_NUM:
          return 13;
        case QRMode.MODE_8BIT_BYTE:
          return 16;
        case QRMode.MODE_KANJI:
          return 12;
        default:
          throw new Error(`mode:${mode}`);
      }
    } else {
      throw new Error(`type:${type}`);
    }
  }
  static getLostPoint(qrCode) {
    const moduleCount = qrCode.getModuleCount();
    let lostPoint = 0;
    for (var row = 0; row < moduleCount; row++) {
      for (var col = 0; col < moduleCount; col++) {
        let sameCount = 0;
        const dark = qrCode.isDark(row, col);
        for (let r = -1; r <= 1; r++) {
          if (row + r < 0 || moduleCount <= row + r) {
            continue;
          }
          for (let c = -1; c <= 1; c++) {
            if (col + c < 0 || moduleCount <= col + c) {
              continue;
            }
            if (r == 0 && c == 0) {
              continue;
            }
            if (dark == qrCode.isDark(row + r, col + c)) {
              sameCount++;
            }
          }
        }
        if (sameCount > 5) {
          lostPoint += 3 + sameCount - 5;
        }
      }
    }
    for (var row = 0; row < moduleCount - 1; row++) {
      for (var col = 0; col < moduleCount - 1; col++) {
        let count = 0;
        if (qrCode.isDark(row, col)) count++;
        if (qrCode.isDark(row + 1, col)) count++;
        if (qrCode.isDark(row, col + 1)) count++;
        if (qrCode.isDark(row + 1, col + 1)) count++;
        if (count == 0 || count == 4) {
          lostPoint += 3;
        }
      }
    }
    for (var row = 0; row < moduleCount; row++) {
      for (var col = 0; col < moduleCount - 6; col++) {
        if (qrCode.isDark(row, col) && !qrCode.isDark(row, col + 1) && qrCode.isDark(row, col + 2) && qrCode.isDark(row, col + 3) && qrCode.isDark(row, col + 4) && !qrCode.isDark(row, col + 5) && qrCode.isDark(row, col + 6)) {
          lostPoint += 40;
        }
      }
    }
    for (var col = 0; col < moduleCount; col++) {
      for (var row = 0; row < moduleCount - 6; row++) {
        if (qrCode.isDark(row, col) && !qrCode.isDark(row + 1, col) && qrCode.isDark(row + 2, col) && qrCode.isDark(row + 3, col) && qrCode.isDark(row + 4, col) && !qrCode.isDark(row + 5, col) && qrCode.isDark(row + 6, col)) {
          lostPoint += 40;
        }
      }
    }
    let darkCount = 0;
    for (var col = 0; col < moduleCount; col++) {
      for (var row = 0; row < moduleCount; row++) {
        if (qrCode.isDark(row, col)) {
          darkCount++;
        }
      }
    }
    const ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
    lostPoint += ratio * 10;
    return lostPoint;
  }
}
QRUtil.PATTERN_POSITION_TABLE = [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]];
QRUtil.G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
QRUtil.G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
QRUtil.G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
class QRMath {
  static glog(n) {
    if (n < 1) {
      throw new Error(`glog(${n})`);
    }
    return QRMath.LOG_TABLE[n];
  }
  static gexp(n) {
    while (n < 0) {
      n += 255;
    }
    while (n >= 256) {
      n -= 255;
    }
    return QRMath.EXP_TABLE[n];
  }
}
QRMath.EXP_TABLE = new Array(256);
QRMath.LOG_TABLE = new Array(256);
QRMath._constructor = function () {
  for (var i = 0; i < 8; i++) {
    QRMath.EXP_TABLE[i] = 1 << i;
  }
  for (var i = 8; i < 256; i++) {
    QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4] ^ QRMath.EXP_TABLE[i - 5] ^ QRMath.EXP_TABLE[i - 6] ^ QRMath.EXP_TABLE[i - 8];
  }
  for (var i = 0; i < 255; i++) {
    QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i;
  }
}();
class QRPolynomial {
  constructor(num, shift) {
    if (num.length == undefined) {
      throw new Error(`${num.length}/${shift}`);
    }
    let offset = 0;
    while (offset < num.length && num[offset] == 0) {
      offset++;
    }
    this.num = new Array(num.length - offset + shift);
    for (let i = 0; i < num.length - offset; i++) {
      this.num[i] = num[i + offset];
    }
  }
  get(index) {
    return this.num[index];
  }
  getLength() {
    return this.num.length;
  }
  multiply(e) {
    const num = new Array(this.getLength() + e.getLength() - 1);
    for (let i = 0; i < this.getLength(); i++) {
      for (let j = 0; j < e.getLength(); j++) {
        num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i)) + QRMath.glog(e.get(j)));
      }
    }
    return new QRPolynomial(num, 0);
  }
  mod(e) {
    if (this.getLength() - e.getLength() < 0) {
      return this;
    }
    const ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0));
    const num = new Array(this.getLength());
    for (var i = 0; i < this.getLength(); i++) {
      num[i] = this.get(i);
    }
    for (var i = 0; i < e.getLength(); i++) {
      num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio);
    }
    return new QRPolynomial(num, 0).mod(e);
  }
}
class QRRSBlock {
  constructor(totalCount, dataCount) {
    this.totalCount = totalCount;
    this.dataCount = dataCount;
  }
  static getRSBlocks(typeNumber, errorCorrectLevel) {
    const rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);
    if (rsBlock == undefined) {
      throw new Error(`bad rs block @ typeNumber:${typeNumber}/errorCorrectLevel:${errorCorrectLevel}`);
    }
    const length = rsBlock.length / 3;
    const list = [];
    for (let i = 0; i < length; i++) {
      const count = rsBlock[i * 3 + 0];
      const totalCount = rsBlock[i * 3 + 1];
      const dataCount = rsBlock[i * 3 + 2];
      for (let j = 0; j < count; j++) {
        list.push(new QRRSBlock(totalCount, dataCount));
      }
    }
    return list;
  }
  static getRsBlockTable(typeNumber, errorCorrectLevel) {
    switch (errorCorrectLevel) {
      case QRErrorCorrectLevel.L:
        return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
      case QRErrorCorrectLevel.M:
        return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
      case QRErrorCorrectLevel.Q:
        return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
      case QRErrorCorrectLevel.H:
        return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
      default:
        return undefined;
    }
  }
}
QRRSBlock.RS_BLOCK_TABLE = [[1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9], [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16], [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13], [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9], [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12], [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15], [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14], [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15], [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13], [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16], [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13], [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15], [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12], [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13], [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12], [5, 122, 98, 1, 123, 99], [7, 73, 45, 3, 74, 46], [15, 43, 19, 2, 44, 20], [3, 45, 15, 13, 46, 16], [1, 135, 107, 5, 136, 108], [10, 74, 46, 1, 75, 47], [1, 50, 22, 15, 51, 23], [2, 42, 14, 17, 43, 15], [5, 150, 120, 1, 151, 121], [9, 69, 43, 4, 70, 44], [17, 50, 22, 1, 51, 23], [2, 42, 14, 19, 43, 15], [3, 141, 113, 4, 142, 114], [3, 70, 44, 11, 71, 45], [17, 47, 21, 4, 48, 22], [9, 39, 13, 16, 40, 14], [3, 135, 107, 5, 136, 108], [3, 67, 41, 13, 68, 42], [15, 54, 24, 5, 55, 25], [15, 43, 15, 10, 44, 16], [4, 144, 116, 4, 145, 117], [17, 68, 42], [17, 50, 22, 6, 51, 23], [19, 46, 16, 6, 47, 17], [2, 139, 111, 7, 140, 112], [17, 74, 46], [7, 54, 24, 16, 55, 25], [34, 37, 13], [4, 151, 121, 5, 152, 122], [4, 75, 47, 14, 76, 48], [11, 54, 24, 14, 55, 25], [16, 45, 15, 14, 46, 16], [6, 147, 117, 4, 148, 118], [6, 73, 45, 14, 74, 46], [11, 54, 24, 16, 55, 25], [30, 46, 16, 2, 47, 17], [8, 132, 106, 4, 133, 107], [8, 75, 47, 13, 76, 48], [7, 54, 24, 22, 55, 25], [22, 45, 15, 13, 46, 16], [10, 142, 114, 2, 143, 115], [19, 74, 46, 4, 75, 47], [28, 50, 22, 6, 51, 23], [33, 46, 16, 4, 47, 17], [8, 152, 122, 4, 153, 123], [22, 73, 45, 3, 74, 46], [8, 53, 23, 26, 54, 24], [12, 45, 15, 28, 46, 16], [3, 147, 117, 10, 148, 118], [3, 73, 45, 23, 74, 46], [4, 54, 24, 31, 55, 25], [11, 45, 15, 31, 46, 16], [7, 146, 116, 7, 147, 117], [21, 73, 45, 7, 74, 46], [1, 53, 23, 37, 54, 24], [19, 45, 15, 26, 46, 16], [5, 145, 115, 10, 146, 116], [19, 75, 47, 10, 76, 48], [15, 54, 24, 25, 55, 25], [23, 45, 15, 25, 46, 16], [13, 145, 115, 3, 146, 116], [2, 74, 46, 29, 75, 47], [42, 54, 24, 1, 55, 25], [23, 45, 15, 28, 46, 16], [17, 145, 115], [10, 74, 46, 23, 75, 47], [10, 54, 24, 35, 55, 25], [19, 45, 15, 35, 46, 16], [17, 145, 115, 1, 146, 116], [14, 74, 46, 21, 75, 47], [29, 54, 24, 19, 55, 25], [11, 45, 15, 46, 46, 16], [13, 145, 115, 6, 146, 116], [14, 74, 46, 23, 75, 47], [44, 54, 24, 7, 55, 25], [59, 46, 16, 1, 47, 17], [12, 151, 121, 7, 152, 122], [12, 75, 47, 26, 76, 48], [39, 54, 24, 14, 55, 25], [22, 45, 15, 41, 46, 16], [6, 151, 121, 14, 152, 122], [6, 75, 47, 34, 76, 48], [46, 54, 24, 10, 55, 25], [2, 45, 15, 64, 46, 16], [17, 152, 122, 4, 153, 123], [29, 74, 46, 14, 75, 47], [49, 54, 24, 10, 55, 25], [24, 45, 15, 46, 46, 16], [4, 152, 122, 18, 153, 123], [13, 74, 46, 32, 75, 47], [48, 54, 24, 14, 55, 25], [42, 45, 15, 32, 46, 16], [20, 147, 117, 4, 148, 118], [40, 75, 47, 7, 76, 48], [43, 54, 24, 22, 55, 25], [10, 45, 15, 67, 46, 16], [19, 148, 118, 6, 149, 119], [18, 75, 47, 31, 76, 48], [34, 54, 24, 34, 55, 25], [20, 45, 15, 61, 46, 16]];
class QRBitBuffer {
  constructor() {
    this.buffer = [];
    this.length = 0;
  }
  get(index) {
    const bufIndex = Math.floor(index / 8);
    return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) == 1;
  }
  put(num, length) {
    for (let i = 0; i < length; i++) {
      this.putBit((num >>> length - i - 1 & 1) == 1);
    }
  }
  getLengthInBits() {
    return this.length;
  }
  putBit(bit) {
    const bufIndex = Math.floor(this.length / 8);
    if (this.buffer.length <= bufIndex) {
      this.buffer.push(0);
    }
    if (bit) {
      this.buffer[bufIndex] |= 0x80 >>> this.length % 8;
    }
    this.length++;
  }
}
const QRCodeLimitLength = [[17, 14, 11, 7], [32, 26, 20, 14], [53, 42, 32, 24], [78, 62, 46, 34], [106, 84, 60, 44], [134, 106, 74, 58], [154, 122, 86, 64], [192, 152, 108, 84], [230, 180, 130, 98], [271, 213, 151, 119], [321, 251, 177, 137], [367, 287, 203, 155], [425, 331, 241, 177], [458, 362, 258, 194], [520, 412, 292, 220], [586, 450, 322, 250], [644, 504, 364, 280], [718, 560, 394, 310], [792, 624, 442, 338], [858, 666, 482, 382], [929, 711, 509, 403], [1003, 779, 565, 439], [1091, 857, 611, 461], [1171, 911, 661, 511], [1273, 997, 715, 535], [1367, 1059, 751, 593], [1465, 1125, 805, 625], [1528, 1190, 868, 658], [1628, 1264, 908, 698], [1732, 1370, 982, 742], [1840, 1452, 1030, 790], [1952, 1538, 1112, 842], [2068, 1628, 1168, 898], [2188, 1722, 1228, 958], [2303, 1809, 1283, 983], [2431, 1911, 1351, 1051], [2563, 1989, 1423, 1093], [2699, 2099, 1499, 1139], [2809, 2213, 1579, 1219], [2953, 2331, 1663, 1273]];
;// CONCATENATED MODULE: ./node_modules/vue-qr/src/lib/gif.js/TypedNeuQuant.js



/* NeuQuant Neural-Net Quantization Algorithm
 * ------------------------------------------
 *
 * Copyright (c) 1994 Anthony Dekker
 *
 * NEUQUANT Neural-Net quantization algorithm by Anthony Dekker, 1994.
 * See "Kohonen neural networks for optimal colour quantization"
 * in "Network: Computation in Neural Systems" Vol. 5 (1994) pp 351-367.
 * for a discussion of the algorithm.
 * See also  http://members.ozemail.com.au/~dekker/NEUQUANT.HTML
 *
 * Any party obtaining a copy of these files from the author, directly or
 * indirectly, is granted, free of charge, a full and unrestricted irrevocable,
 * world-wide, paid up, royalty-free, nonexclusive right and license to deal
 * in this software and documentation files (the "Software"), including without
 * limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons who receive
 * copies from any such party to do so, with the only requirement being
 * that this copyright notice remain intact.
 *
 * (JavaScript port 2012 by Johan Nordberg)
 */
var ncycles = 100; // number of learning cycles
var netsize = 256; // number of colors used
var maxnetpos = netsize - 1;
// defs for freq and bias
var netbiasshift = 4; // bias for colour values
var intbiasshift = 16; // bias for fractions
var intbias = 1 << intbiasshift;
var gammashift = 10;
var gamma = 1 << gammashift;
var betashift = 10;
var beta = intbias >> betashift; /* beta = 1/1024 */
var betagamma = intbias << gammashift - betashift;
// defs for decreasing radius factor
var initrad = netsize >> 3; // for 256 cols, radius starts
var radiusbiasshift = 6; // at 32.0 biased by 6 bits
var radiusbias = 1 << radiusbiasshift;
var initradius = initrad * radiusbias; //and decreases by a
var radiusdec = 30; // factor of 1/30 each cycle
// defs for decreasing alpha factor
var alphabiasshift = 10; // alpha starts at 1.0
var initalpha = 1 << alphabiasshift;
var alphadec; // biased by 10 bits
/* radbias and alpharadbias used for radpower calculation */
var radbiasshift = 8;
var radbias = 1 << radbiasshift;
var alpharadbshift = alphabiasshift + radbiasshift;
var alpharadbias = 1 << alpharadbshift;
// four primes near 500 - assume no image has a length so large that it is
// divisible by all four primes
var prime1 = 499;
var prime2 = 491;
var prime3 = 487;
var prime4 = 503;
var minpicturebytes = 3 * prime4;
/*
  Constructor: NeuQuant

  Arguments:

  pixels - array of pixels in RGB format
  samplefac - sampling factor 1 to 30 where lower is better quality

  >
  > pixels = [r, g, b, r, g, b, r, g, b, ..]
  >
*/
function NeuQuant(pixels, samplefac) {
  var network; // int[netsize][4]
  var netindex; // for network lookup - really 256
  // bias and freq arrays for learning
  var bias;
  var freq;
  var radpower;
  /*
    Private Method: init
       sets up arrays
  */
  function init() {
    network = [];
    netindex = new Int32Array(256);
    bias = new Int32Array(netsize);
    freq = new Int32Array(netsize);
    radpower = new Int32Array(netsize >> 3);
    var i, v;
    for (i = 0; i < netsize; i++) {
      v = (i << netbiasshift + 8) / netsize;
      network[i] = new Float64Array([v, v, v, 0]);
      //network[i] = [v, v, v, 0]
      freq[i] = intbias / netsize;
      bias[i] = 0;
    }
  }
  /*
    Private Method: unbiasnet
       unbiases network to give byte values 0..255 and record position i to prepare for sort
  */
  function unbiasnet() {
    for (var i = 0; i < netsize; i++) {
      network[i][0] >>= netbiasshift;
      network[i][1] >>= netbiasshift;
      network[i][2] >>= netbiasshift;
      network[i][3] = i; // record color number
    }
  }
  /*
    Private Method: altersingle
       moves neuron *i* towards biased (b,g,r) by factor *alpha*
  */
  function altersingle(alpha, i, b, g, r) {
    network[i][0] -= alpha * (network[i][0] - b) / initalpha;
    network[i][1] -= alpha * (network[i][1] - g) / initalpha;
    network[i][2] -= alpha * (network[i][2] - r) / initalpha;
  }
  /*
    Private Method: alterneigh
       moves neurons in *radius* around index *i* towards biased (b,g,r) by factor *alpha*
  */
  function alterneigh(radius, i, b, g, r) {
    var lo = Math.abs(i - radius);
    var hi = Math.min(i + radius, netsize);
    var j = i + 1;
    var k = i - 1;
    var m = 1;
    var p, a;
    while (j < hi || k > lo) {
      a = radpower[m++];
      if (j < hi) {
        p = network[j++];
        p[0] -= a * (p[0] - b) / alpharadbias;
        p[1] -= a * (p[1] - g) / alpharadbias;
        p[2] -= a * (p[2] - r) / alpharadbias;
      }
      if (k > lo) {
        p = network[k--];
        p[0] -= a * (p[0] - b) / alpharadbias;
        p[1] -= a * (p[1] - g) / alpharadbias;
        p[2] -= a * (p[2] - r) / alpharadbias;
      }
    }
  }
  /*
    Private Method: contest
       searches for biased BGR values
  */
  function contest(b, g, r) {
    /*
      finds closest neuron (min dist) and updates freq
      finds best neuron (min dist-bias) and returns position
      for frequently chosen neurons, freq[i] is high and bias[i] is negative
      bias[i] = gamma * ((1 / netsize) - freq[i])
    */
    var bestd = ~(1 << 31);
    var bestbiasd = bestd;
    var bestpos = -1;
    var bestbiaspos = bestpos;
    var i, n, dist, biasdist, betafreq;
    for (i = 0; i < netsize; i++) {
      n = network[i];
      dist = Math.abs(n[0] - b) + Math.abs(n[1] - g) + Math.abs(n[2] - r);
      if (dist < bestd) {
        bestd = dist;
        bestpos = i;
      }
      biasdist = dist - (bias[i] >> intbiasshift - netbiasshift);
      if (biasdist < bestbiasd) {
        bestbiasd = biasdist;
        bestbiaspos = i;
      }
      betafreq = freq[i] >> betashift;
      freq[i] -= betafreq;
      bias[i] += betafreq << gammashift;
    }
    freq[bestpos] += beta;
    bias[bestpos] -= betagamma;
    return bestbiaspos;
  }
  /*
    Private Method: inxbuild
       sorts network and builds netindex[0..255]
  */
  function inxbuild() {
    var i,
      j,
      p,
      q,
      smallpos,
      smallval,
      previouscol = 0,
      startpos = 0;
    for (i = 0; i < netsize; i++) {
      p = network[i];
      smallpos = i;
      smallval = p[1]; // index on g
      // find smallest in i..netsize-1
      for (j = i + 1; j < netsize; j++) {
        q = network[j];
        if (q[1] < smallval) {
          // index on g
          smallpos = j;
          smallval = q[1]; // index on g
        }
      }

      q = network[smallpos];
      // swap p (i) and q (smallpos) entries
      if (i != smallpos) {
        j = q[0];
        q[0] = p[0];
        p[0] = j;
        j = q[1];
        q[1] = p[1];
        p[1] = j;
        j = q[2];
        q[2] = p[2];
        p[2] = j;
        j = q[3];
        q[3] = p[3];
        p[3] = j;
      }
      // smallval entry is now in position i
      if (smallval != previouscol) {
        netindex[previouscol] = startpos + i >> 1;
        for (j = previouscol + 1; j < smallval; j++) netindex[j] = i;
        previouscol = smallval;
        startpos = i;
      }
    }
    netindex[previouscol] = startpos + maxnetpos >> 1;
    for (j = previouscol + 1; j < 256; j++) netindex[j] = maxnetpos; // really 256
  }
  /*
    Private Method: inxsearch
       searches for BGR values 0..255 and returns a color index
  */
  function inxsearch(b, g, r) {
    var a, p, dist;
    var bestd = 1000; // biggest possible dist is 256*3
    var best = -1;
    var i = netindex[g]; // index on g
    var j = i - 1; // start at netindex[g] and work outwards
    while (i < netsize || j >= 0) {
      if (i < netsize) {
        p = network[i];
        dist = p[1] - g; // inx key
        if (dist >= bestd) i = netsize; // stop iter
        else {
          i++;
          if (dist < 0) dist = -dist;
          a = p[0] - b;
          if (a < 0) a = -a;
          dist += a;
          if (dist < bestd) {
            a = p[2] - r;
            if (a < 0) a = -a;
            dist += a;
            if (dist < bestd) {
              bestd = dist;
              best = p[3];
            }
          }
        }
      }
      if (j >= 0) {
        p = network[j];
        dist = g - p[1]; // inx key - reverse dif
        if (dist >= bestd) j = -1; // stop iter
        else {
          j--;
          if (dist < 0) dist = -dist;
          a = p[0] - b;
          if (a < 0) a = -a;
          dist += a;
          if (dist < bestd) {
            a = p[2] - r;
            if (a < 0) a = -a;
            dist += a;
            if (dist < bestd) {
              bestd = dist;
              best = p[3];
            }
          }
        }
      }
    }
    return best;
  }
  /*
    Private Method: learn
       "Main Learning Loop"
  */
  function learn() {
    var i;
    var lengthcount = pixels.length;
    var alphadec = 30 + (samplefac - 1) / 3;
    var samplepixels = lengthcount / (3 * samplefac);
    var delta = ~~(samplepixels / ncycles);
    var alpha = initalpha;
    var radius = initradius;
    var rad = radius >> radiusbiasshift;
    if (rad <= 1) rad = 0;
    for (i = 0; i < rad; i++) radpower[i] = alpha * ((rad * rad - i * i) * radbias / (rad * rad));
    var step;
    if (lengthcount < minpicturebytes) {
      samplefac = 1;
      step = 3;
    } else if (lengthcount % prime1 !== 0) {
      step = 3 * prime1;
    } else if (lengthcount % prime2 !== 0) {
      step = 3 * prime2;
    } else if (lengthcount % prime3 !== 0) {
      step = 3 * prime3;
    } else {
      step = 3 * prime4;
    }
    var b, g, r, j;
    var pix = 0; // current pixel
    i = 0;
    while (i < samplepixels) {
      b = (pixels[pix] & 0xff) << netbiasshift;
      g = (pixels[pix + 1] & 0xff) << netbiasshift;
      r = (pixels[pix + 2] & 0xff) << netbiasshift;
      j = contest(b, g, r);
      altersingle(alpha, j, b, g, r);
      if (rad !== 0) alterneigh(rad, j, b, g, r); // alter neighbours
      pix += step;
      if (pix >= lengthcount) pix -= lengthcount;
      i++;
      if (delta === 0) delta = 1;
      if (i % delta === 0) {
        alpha -= alpha / alphadec;
        radius -= radius / radiusdec;
        rad = radius >> radiusbiasshift;
        if (rad <= 1) rad = 0;
        for (j = 0; j < rad; j++) radpower[j] = alpha * ((rad * rad - j * j) * radbias / (rad * rad));
      }
    }
  }
  /*
    Method: buildColormap
       1. initializes network
    2. trains it
    3. removes misconceptions
    4. builds colorindex
  */
  function buildColormap() {
    init();
    learn();
    unbiasnet();
    inxbuild();
  }
  this.buildColormap = buildColormap;
  /*
    Method: getColormap
       builds colormap from the index
       returns array in the format:
       >
    > [r, g, b, r, g, b, r, g, b, ..]
    >
  */
  function getColormap() {
    var map = [];
    var index = [];
    for (var i = 0; i < netsize; i++) index[network[i][3]] = i;
    var k = 0;
    for (var l = 0; l < netsize; l++) {
      var j = index[l];
      map[k++] = network[j][0];
      map[k++] = network[j][1];
      map[k++] = network[j][2];
    }
    return map;
  }
  this.getColormap = getColormap;
  /*
    Method: lookupRGB
       looks for the closest *r*, *g*, *b* color in the map and
    returns its index
  */
  this.lookupRGB = inxsearch;
}
// module.exports = NeuQuant;
/* harmony default export */ var TypedNeuQuant = (NeuQuant);
;// CONCATENATED MODULE: ./node_modules/vue-qr/src/lib/gif.js/LZWEncoder.js



/*
  LZWEncoder.js

  Authors
  Kevin Weiner (original Java version - kweiner@fmsware.com)
  Thibault Imbert (AS3 version - bytearray.org)
  Johan Nordberg (JS version - code@johan-nordberg.com)

  Acknowledgements
  GIFCOMPR.C - GIF Image compression routines
  Lempel-Ziv compression based on 'compress'. GIF modifications by
  David Rowley (mgardi@watdcsu.waterloo.edu)
  GIF Image compression - modified 'compress'
  Based on: compress.c - File compression ala IEEE Computer, June 1984.
  By Authors: Spencer W. Thomas (decvax!harpo!utah-cs!utah-gr!thomas)
  Jim McKie (decvax!mcvax!jim)
  Steve Davies (decvax!vax135!petsd!peora!srd)
  Ken Turkowski (decvax!decwrl!turtlevax!ken)
  James A. Woods (decvax!ihnp4!ames!jaw)
  Joe Orost (decvax!vax135!petsd!joe)
*/
var EOF = -1;
var BITS = 12;
var HSIZE = 5003; // 80% occupancy
var masks = [0x0000, 0x0001, 0x0003, 0x0007, 0x000F, 0x001F, 0x003F, 0x007F, 0x00FF, 0x01FF, 0x03FF, 0x07FF, 0x0FFF, 0x1FFF, 0x3FFF, 0x7FFF, 0xFFFF];
function LZWEncoder(width, height, pixels, colorDepth) {
  var initCodeSize = Math.max(2, colorDepth);
  var accum = new Uint8Array(256);
  var htab = new Int32Array(HSIZE);
  var codetab = new Int32Array(HSIZE);
  var cur_accum,
    cur_bits = 0;
  var a_count;
  var free_ent = 0; // first unused entry
  var maxcode;
  // block compression parameters -- after all codes are used up,
  // and compression rate changes, start over.
  var clear_flg = false;
  // Algorithm: use open addressing double hashing (no chaining) on the
  // prefix code / next character combination. We do a variant of Knuth's
  // algorithm D (vol. 3, sec. 6.4) along with G. Knott's relatively-prime
  // secondary probe. Here, the modular division first probe is gives way
  // to a faster exclusive-or manipulation. Also do block compression with
  // an adaptive reset, whereby the code table is cleared when the compression
  // ratio decreases, but after the table fills. The variable-length output
  // codes are re-sized at this point, and a special CLEAR code is generated
  // for the decompressor. Late addition: construct the table according to
  // file size for noticeable speed improvement on small files. Please direct
  // questions about this implementation to ames!jaw.
  var g_init_bits, ClearCode, EOFCode;
  var remaining, curPixel, n_bits;
  // Add a character to the end of the current packet, and if it is 254
  // characters, flush the packet to disk.
  function char_out(c, outs) {
    accum[a_count++] = c;
    if (a_count >= 254) flush_char(outs);
  }
  // Clear out the hash table
  // table clear for block compress
  function cl_block(outs) {
    cl_hash(HSIZE);
    free_ent = ClearCode + 2;
    clear_flg = true;
    output(ClearCode, outs);
  }
  // Reset code table
  function cl_hash(hsize) {
    for (var i = 0; i < hsize; ++i) htab[i] = -1;
  }
  function compress(init_bits, outs) {
    var fcode, c, i, ent, disp, hsize_reg, hshift;
    // Set up the globals: g_init_bits - initial number of bits
    g_init_bits = init_bits;
    // Set up the necessary values
    clear_flg = false;
    n_bits = g_init_bits;
    maxcode = MAXCODE(n_bits);
    ClearCode = 1 << init_bits - 1;
    EOFCode = ClearCode + 1;
    free_ent = ClearCode + 2;
    a_count = 0; // clear packet
    ent = nextPixel();
    hshift = 0;
    for (fcode = HSIZE; fcode < 65536; fcode *= 2) ++hshift;
    hshift = 8 - hshift; // set hash code range bound
    hsize_reg = HSIZE;
    cl_hash(hsize_reg); // clear hash table
    output(ClearCode, outs);
    outer_loop: while ((c = nextPixel()) != EOF) {
      fcode = (c << BITS) + ent;
      i = c << hshift ^ ent; // xor hashing
      if (htab[i] === fcode) {
        ent = codetab[i];
        continue;
      } else if (htab[i] >= 0) {
        // non-empty slot
        disp = hsize_reg - i; // secondary hash (after G. Knott)
        if (i === 0) disp = 1;
        do {
          if ((i -= disp) < 0) i += hsize_reg;
          if (htab[i] === fcode) {
            ent = codetab[i];
            continue outer_loop;
          }
        } while (htab[i] >= 0);
      }
      output(ent, outs);
      ent = c;
      if (free_ent < 1 << BITS) {
        codetab[i] = free_ent++; // code -> hashtable
        htab[i] = fcode;
      } else {
        cl_block(outs);
      }
    }
    // Put out the final code.
    output(ent, outs);
    output(EOFCode, outs);
  }
  function encode(outs) {
    outs.writeByte(initCodeSize); // write "initial code size" byte
    remaining = width * height; // reset navigation variables
    curPixel = 0;
    compress(initCodeSize + 1, outs); // compress and write the pixel data
    outs.writeByte(0); // write block terminator
  }
  // Flush the packet to disk, and reset the accumulator
  function flush_char(outs) {
    if (a_count > 0) {
      outs.writeByte(a_count);
      outs.writeBytes(accum, 0, a_count);
      a_count = 0;
    }
  }
  function MAXCODE(n_bits) {
    return (1 << n_bits) - 1;
  }
  // Return the next pixel from the image
  function nextPixel() {
    if (remaining === 0) return EOF;
    --remaining;
    var pix = pixels[curPixel++];
    return pix & 0xff;
  }
  function output(code, outs) {
    cur_accum &= masks[cur_bits];
    if (cur_bits > 0) cur_accum |= code << cur_bits;else cur_accum = code;
    cur_bits += n_bits;
    while (cur_bits >= 8) {
      char_out(cur_accum & 0xff, outs);
      cur_accum >>= 8;
      cur_bits -= 8;
    }
    // If the next entry is going to be too big for the code size,
    // then increase it, if possible.
    if (free_ent > maxcode || clear_flg) {
      if (clear_flg) {
        maxcode = MAXCODE(n_bits = g_init_bits);
        clear_flg = false;
      } else {
        ++n_bits;
        if (n_bits == BITS) maxcode = 1 << BITS;else maxcode = MAXCODE(n_bits);
      }
    }
    if (code == EOFCode) {
      // At EOF, write the rest of the buffer.
      while (cur_bits > 0) {
        char_out(cur_accum & 0xff, outs);
        cur_accum >>= 8;
        cur_bits -= 8;
      }
      flush_char(outs);
    }
  }
  this.encode = encode;
}
// module.exports = LZWEncoder;
/* harmony default export */ var gif_js_LZWEncoder = (LZWEncoder);
;// CONCATENATED MODULE: ./node_modules/vue-qr/src/lib/gif.js/GIFEncoder.js




/*
  GIFEncoder.js

  Authors
  Kevin Weiner (original Java version - kweiner@fmsware.com)
  Thibault Imbert (AS3 version - bytearray.org)
  Johan Nordberg (JS version - code@johan-nordberg.com)
  Makito (Optimized for AwesomeQR - sumimakito@hotmail,com)
*/
// var NeuQuant = require("./TypedNeuQuant.js");

// var LZWEncoder = require("./LZWEncoder.js");

function ByteArray() {
  this.page = -1;
  this.pages = [];
  this.newPage();
}
ByteArray.pageSize = 4096;
ByteArray.charMap = {};
for (var i = 0; i < 256; i++) ByteArray.charMap[i] = String.fromCharCode(i);
ByteArray.prototype.newPage = function () {
  this.pages[++this.page] = new Uint8Array(ByteArray.pageSize);
  this.cursor = 0;
};
ByteArray.prototype.getData = function () {
  var rv = "";
  for (var p = 0; p < this.pages.length; p++) {
    for (var i = 0; i < ByteArray.pageSize; i++) {
      rv += ByteArray.charMap[this.pages[p][i]];
    }
  }
  return rv;
};
ByteArray.prototype.toFlattenUint8Array = function () {
  const chunks = [];
  for (var p = 0; p < this.pages.length; p++) {
    if (p === this.pages.length - 1) {
      const chunk = Uint8Array.from(this.pages[p].slice(0, this.cursor));
      chunks.push(chunk);
    } else {
      chunks.push(this.pages[p]);
    }
  }
  const flatten = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
  chunks.reduce((lastLength, chunk) => {
    flatten.set(chunk, lastLength);
    return lastLength + chunk.length;
  }, 0);
  return flatten;
};
ByteArray.prototype.writeByte = function (val) {
  if (this.cursor >= ByteArray.pageSize) this.newPage();
  this.pages[this.page][this.cursor++] = val;
};
ByteArray.prototype.writeUTFBytes = function (string) {
  for (var l = string.length, i = 0; i < l; i++) this.writeByte(string.charCodeAt(i));
};
ByteArray.prototype.writeBytes = function (array, offset, length) {
  for (var l = length || array.length, i = offset || 0; i < l; i++) this.writeByte(array[i]);
};
function GIFEncoder(width, height) {
  // image size
  this.width = ~~width;
  this.height = ~~height;
  // transparent color if given
  this.transparent = null;
  // transparent index in color table
  this.transIndex = 0;
  // -1 = no repeat, 0 = forever. anything else is repeat count
  this.repeat = -1;
  // frame delay (hundredths)
  this.delay = 0;
  this.image = null; // current frame
  this.pixels = null; // BGR byte array from frame
  this.indexedPixels = null; // converted frame indexed to palette
  this.colorDepth = null; // number of bit planes
  this.colorTab = null; // RGB palette
  this.neuQuant = null; // NeuQuant instance that was used to generate this.colorTab.
  this.usedEntry = new Array(); // active palette entries
  this.palSize = 7; // color table size (bits-1)
  this.dispose = -1; // disposal code (-1 = use default)
  this.firstFrame = true;
  this.sample = 10; // default sample interval for quantizer
  this.dither = false; // default dithering
  this.globalPalette = false;
  this.out = new ByteArray();
}
/*
  Sets the delay time between each frame, or changes it for subsequent frames
  (applies to last frame added)
*/
GIFEncoder.prototype.setDelay = function (milliseconds) {
  this.delay = Math.round(milliseconds / 10);
};
/*
  Sets frame rate in frames per second.
*/
GIFEncoder.prototype.setFrameRate = function (fps) {
  this.delay = Math.round(100 / fps);
};
/*
  Sets the GIF frame disposal code for the last added frame and any
  subsequent frames.

  Default is 0 if no transparent color has been set, otherwise 2.
*/
GIFEncoder.prototype.setDispose = function (disposalCode) {
  if (disposalCode >= 0) this.dispose = disposalCode;
};
/*
  Sets the number of times the set of GIF frames should be played.

  -1 = play once
  0 = repeat indefinitely

  Default is -1

  Must be invoked before the first image is added
*/
GIFEncoder.prototype.setRepeat = function (repeat) {
  this.repeat = repeat;
};
/*
  Sets the transparent color for the last added frame and any subsequent
  frames. Since all colors are subject to modification in the quantization
  process, the color in the final palette for each frame closest to the given
  color becomes the transparent color for that frame. May be set to null to
  indicate no transparent color.
*/
GIFEncoder.prototype.setTransparent = function (color) {
  this.transparent = color;
};
/*
  Adds next GIF frame. The frame is not written immediately, but is
  actually deferred until the next frame is received so that timing
  data can be inserted.  Invoking finish() flushes all frames.
*/
GIFEncoder.prototype.addFrame = function (imageData) {
  this.image = imageData;
  this.colorTab = this.globalPalette && this.globalPalette.slice ? this.globalPalette : null;
  this.getImagePixels(); // convert to correct format if necessary
  this.analyzePixels(); // build color table & map pixels
  if (this.globalPalette === true) this.globalPalette = this.colorTab;
  if (this.firstFrame) {
    this.writeHeader();
    this.writeLSD(); // logical screen descriptior
    this.writePalette(); // global color table
    if (this.repeat >= 0) {
      // use NS app extension to indicate reps
      this.writeNetscapeExt();
    }
  }
  this.writeGraphicCtrlExt(); // write graphic control extension
  this.writeImageDesc(); // image descriptor
  if (!this.firstFrame && !this.globalPalette) this.writePalette(); // local color table
  this.writePixels(); // encode and write pixel data
  this.firstFrame = false;
};
/*
  Adds final trailer to the GIF stream, if you don't call the finish method
  the GIF stream will not be valid.
*/
GIFEncoder.prototype.finish = function () {
  this.out.writeByte(0x3b); // gif trailer
};
/*
  Sets quality of color quantization (conversion of images to the maximum 256
  colors allowed by the GIF specification). Lower values (minimum = 1)
  produce better colors, but slow processing significantly. 10 is the
  default, and produces good color mapping at reasonable speeds. Values
  greater than 20 do not yield significant improvements in speed.
*/
GIFEncoder.prototype.setQuality = function (quality) {
  if (quality < 1) quality = 1;
  this.sample = quality;
};
/*
  Sets dithering method. Available are:
  - FALSE no dithering
  - TRUE or FloydSteinberg
  - FalseFloydSteinberg
  - Stucki
  - Atkinson
  You can add '-serpentine' to use serpentine scanning
*/
GIFEncoder.prototype.setDither = function (dither) {
  if (dither === true) dither = "FloydSteinberg";
  this.dither = dither;
};
/*
  Sets global palette for all frames.
  You can provide TRUE to create global palette from first picture.
  Or an array of r,g,b,r,g,b,...
*/
GIFEncoder.prototype.setGlobalPalette = function (palette) {
  this.globalPalette = palette;
};
/*
  Returns global palette used for all frames.
  If setGlobalPalette(true) was used, then this function will return
  calculated palette after the first frame is added.
*/
GIFEncoder.prototype.getGlobalPalette = function () {
  return this.globalPalette && this.globalPalette.slice && this.globalPalette.slice(0) || this.globalPalette;
};
/*
  Writes GIF file header
*/
GIFEncoder.prototype.writeHeader = function () {
  this.out.writeUTFBytes("GIF89a");
};
/*
  Analyzes current frame colors and creates color map.
*/
GIFEncoder.prototype.analyzePixels = function () {
  if (!this.colorTab) {
    this.neuQuant = new TypedNeuQuant(this.pixels, this.sample);
    this.neuQuant.buildColormap(); // create reduced palette
    this.colorTab = this.neuQuant.getColormap();
  }
  // map image pixels to new palette
  if (this.dither) {
    this.ditherPixels(this.dither.replace("-serpentine", ""), this.dither.match(/-serpentine/) !== null);
  } else {
    this.indexPixels();
  }
  this.pixels = null;
  this.colorDepth = 8;
  this.palSize = 7;
  // get closest match to transparent color if specified
  if (this.transparent !== null) {
    this.transIndex = this.findClosest(this.transparent, true);
  }
};
/*
  Index pixels, without dithering
*/
GIFEncoder.prototype.indexPixels = function (imgq) {
  var nPix = this.pixels.length / 3;
  this.indexedPixels = new Uint8Array(nPix);
  var k = 0;
  for (var j = 0; j < nPix; j++) {
    var index = this.findClosestRGB(this.pixels[k++] & 0xff, this.pixels[k++] & 0xff, this.pixels[k++] & 0xff);
    this.usedEntry[index] = true;
    this.indexedPixels[j] = index;
  }
};
/*
  Taken from http://jsbin.com/iXofIji/2/edit by PAEz
*/
GIFEncoder.prototype.ditherPixels = function (kernel, serpentine) {
  var kernels = {
    FalseFloydSteinberg: [[3 / 8, 1, 0], [3 / 8, 0, 1], [2 / 8, 1, 1]],
    FloydSteinberg: [[7 / 16, 1, 0], [3 / 16, -1, 1], [5 / 16, 0, 1], [1 / 16, 1, 1]],
    Stucki: [[8 / 42, 1, 0], [4 / 42, 2, 0], [2 / 42, -2, 1], [4 / 42, -1, 1], [8 / 42, 0, 1], [4 / 42, 1, 1], [2 / 42, 2, 1], [1 / 42, -2, 2], [2 / 42, -1, 2], [4 / 42, 0, 2], [2 / 42, 1, 2], [1 / 42, 2, 2]],
    Atkinson: [[1 / 8, 1, 0], [1 / 8, 2, 0], [1 / 8, -1, 1], [1 / 8, 0, 1], [1 / 8, 1, 1], [1 / 8, 0, 2]]
  };
  if (!kernel || !kernels[kernel]) {
    throw "Unknown dithering kernel: " + kernel;
  }
  var ds = kernels[kernel];
  var index = 0,
    height = this.height,
    width = this.width,
    data = this.pixels;
  var direction = serpentine ? -1 : 1;
  this.indexedPixels = new Uint8Array(this.pixels.length / 3);
  for (var y = 0; y < height; y++) {
    if (serpentine) direction = direction * -1;
    for (var x = direction == 1 ? 0 : width - 1, xend = direction == 1 ? width : 0; x !== xend; x += direction) {
      index = y * width + x;
      // Get original colour
      var idx = index * 3;
      var r1 = data[idx];
      var g1 = data[idx + 1];
      var b1 = data[idx + 2];
      // Get converted colour
      idx = this.findClosestRGB(r1, g1, b1);
      this.usedEntry[idx] = true;
      this.indexedPixels[index] = idx;
      idx *= 3;
      var r2 = this.colorTab[idx];
      var g2 = this.colorTab[idx + 1];
      var b2 = this.colorTab[idx + 2];
      var er = r1 - r2;
      var eg = g1 - g2;
      var eb = b1 - b2;
      for (var i = direction == 1 ? 0 : ds.length - 1, end = direction == 1 ? ds.length : 0; i !== end; i += direction) {
        var x1 = ds[i][1]; // *direction;  //  Should this by timesd by direction?..to make the kernel go in the opposite direction....got no idea....
        var y1 = ds[i][2];
        if (x1 + x >= 0 && x1 + x < width && y1 + y >= 0 && y1 + y < height) {
          var d = ds[i][0];
          idx = index + x1 + y1 * width;
          idx *= 3;
          data[idx] = Math.max(0, Math.min(255, data[idx] + er * d));
          data[idx + 1] = Math.max(0, Math.min(255, data[idx + 1] + eg * d));
          data[idx + 2] = Math.max(0, Math.min(255, data[idx + 2] + eb * d));
        }
      }
    }
  }
};
/*
  Returns index of palette color closest to c
*/
GIFEncoder.prototype.findClosest = function (c, used) {
  return this.findClosestRGB((c & 0xff0000) >> 16, (c & 0x00ff00) >> 8, c & 0x0000ff, used);
};
GIFEncoder.prototype.findClosestRGB = function (r, g, b, used) {
  if (this.colorTab === null) return -1;
  if (this.neuQuant && !used) {
    return this.neuQuant.lookupRGB(r, g, b);
  }
  var c = b | g << 8 | r << 16;
  var minpos = 0;
  var dmin = 256 * 256 * 256;
  var len = this.colorTab.length;
  for (var i = 0, index = 0; i < len; index++) {
    var dr = r - (this.colorTab[i++] & 0xff);
    var dg = g - (this.colorTab[i++] & 0xff);
    var db = b - (this.colorTab[i++] & 0xff);
    var d = dr * dr + dg * dg + db * db;
    if ((!used || this.usedEntry[index]) && d < dmin) {
      dmin = d;
      minpos = index;
    }
  }
  return minpos;
};
/*
  Extracts image pixels into byte array pixels
  (removes alphachannel from canvas imagedata)
*/
GIFEncoder.prototype.getImagePixels = function () {
  var w = this.width;
  var h = this.height;
  this.pixels = new Uint8Array(w * h * 3);
  var data = this.image;
  var srcPos = 0;
  var count = 0;
  for (var i = 0; i < h; i++) {
    for (var j = 0; j < w; j++) {
      this.pixels[count++] = data[srcPos++];
      this.pixels[count++] = data[srcPos++];
      this.pixels[count++] = data[srcPos++];
      srcPos++;
    }
  }
};
/*
  Writes Graphic Control Extension
*/
GIFEncoder.prototype.writeGraphicCtrlExt = function () {
  this.out.writeByte(0x21); // extension introducer
  this.out.writeByte(0xf9); // GCE label
  this.out.writeByte(4); // data block size
  var transp, disp;
  if (this.transparent === null) {
    transp = 0;
    disp = 0; // dispose = no action
  } else {
    transp = 1;
    disp = 2; // force clear if using transparent color
  }

  if (this.dispose >= 0) {
    disp = this.dispose & 7; // user override
  }

  disp <<= 2;
  // packed fields
  this.out.writeByte(0 |
  // 1:3 reserved
  disp |
  // 4:6 disposal
  0 |
  // 7 user input - 0 = none
  transp // 8 transparency flag
  );

  this.writeShort(this.delay); // delay x 1/100 sec
  this.out.writeByte(this.transIndex); // transparent color index
  this.out.writeByte(0); // block terminator
};
/*
  Writes Image Descriptor
*/
GIFEncoder.prototype.writeImageDesc = function () {
  this.out.writeByte(0x2c); // image separator
  this.writeShort(0); // image position x,y = 0,0
  this.writeShort(0);
  this.writeShort(this.width); // image size
  this.writeShort(this.height);
  // packed fields
  if (this.firstFrame || this.globalPalette) {
    // no LCT - GCT is used for first (or only) frame
    this.out.writeByte(0);
  } else {
    // specify normal LCT
    this.out.writeByte(0x80 |
    // 1 local color table 1=yes
    0 |
    // 2 interlace - 0=no
    0 |
    // 3 sorted - 0=no
    0 |
    // 4-5 reserved
    this.palSize // 6-8 size of color table
    );
  }
};
/*
  Writes Logical Screen Descriptor
*/
GIFEncoder.prototype.writeLSD = function () {
  // logical screen size
  this.writeShort(this.width);
  this.writeShort(this.height);
  // packed fields
  this.out.writeByte(0x80 |
  // 1 : global color table flag = 1 (gct used)
  0x70 |
  // 2-4 : color resolution = 7
  0x00 |
  // 5 : gct sort flag = 0
  this.palSize // 6-8 : gct size
  );

  this.out.writeByte(0); // background color index
  this.out.writeByte(0); // pixel aspect ratio - assume 1:1
};
/*
  Writes Netscape application extension to define repeat count.
*/
GIFEncoder.prototype.writeNetscapeExt = function () {
  this.out.writeByte(0x21); // extension introducer
  this.out.writeByte(0xff); // app extension label
  this.out.writeByte(11); // block size
  this.out.writeUTFBytes("NETSCAPE2.0"); // app id + auth code
  this.out.writeByte(3); // sub-block size
  this.out.writeByte(1); // loop sub-block id
  this.writeShort(this.repeat); // loop count (extra iterations, 0=repeat forever)
  this.out.writeByte(0); // block terminator
};
/*
  Writes color table
*/
GIFEncoder.prototype.writePalette = function () {
  this.out.writeBytes(this.colorTab);
  var n = 3 * 256 - this.colorTab.length;
  for (var i = 0; i < n; i++) this.out.writeByte(0);
};
GIFEncoder.prototype.writeShort = function (pValue) {
  this.out.writeByte(pValue & 0xff);
  this.out.writeByte(pValue >> 8 & 0xff);
};
/*
  Encodes and writes pixel data
*/
GIFEncoder.prototype.writePixels = function () {
  var enc = new gif_js_LZWEncoder(this.width, this.height, this.indexedPixels, this.colorDepth);
  enc.encode(this.out);
};
/*
  Retrieves the GIF stream
*/
GIFEncoder.prototype.stream = function () {
  return this.out;
};
// module.exports = GIFEncoder;
/* harmony default export */ var gif_js_GIFEncoder = (GIFEncoder);
;// CONCATENATED MODULE: ./node_modules/vue-qr/src/lib/awesome-qr.js

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

const {
  Canvas: awesome_qr_Canvas
} = browser;



const defaultScale = 0.4;
function awesome_qr_loadImage(url) {
  if (!url) {
    return undefined;
  }
  function cleanup(img) {
    img.onload = null;
    img.onerror = null;
  }
  return new Promise(function (resolve, reject) {
    if (url.slice(0, 4) == 'data') {
      let img = new Image();
      img.onload = function () {
        resolve(img);
        cleanup(img);
      };
      img.onerror = function () {
        reject('Image load error');
        cleanup(img);
      };
      img.src = url;
      return;
    }
    let img = new Image();
    img.setAttribute("crossOrigin", 'Anonymous');
    img.onload = function () {
      resolve(img);
    };
    img.onerror = function () {
      reject('Image load error');
    };
    img.src = url;
  });
}
class AwesomeQR {
  constructor(options) {
    const _options = Object.assign({}, options);
    Object.keys(AwesomeQR.defaultOptions).forEach(k => {
      if (!(k in _options)) {
        Object.defineProperty(_options, k, {
          value: AwesomeQR.defaultOptions[k],
          enumerable: true,
          writable: true
        });
      }
    });
    if (!_options.components) {
      _options.components = AwesomeQR.defaultComponentOptions;
    } else if (typeof _options.components === "object") {
      Object.keys(AwesomeQR.defaultComponentOptions).forEach(k => {
        if (!(k in _options.components)) {
          Object.defineProperty(_options.components, k, {
            value: AwesomeQR.defaultComponentOptions[k],
            enumerable: true,
            writable: true
          });
        } else {
          Object.defineProperty(_options.components, k, {
            value: Object.assign(Object.assign({}, AwesomeQR.defaultComponentOptions[k]), _options.components[k]),
            enumerable: true,
            writable: true
          });
        }
      });
    }
    if (_options.dotScale !== null && _options.dotScale !== undefined) {
      if (_options.dotScale <= 0 || _options.dotScale > 1) {
        throw new Error("dotScale should be in range (0, 1].");
      }
      _options.components.data.scale = _options.dotScale;
      _options.components.timing.scale = _options.dotScale;
      _options.components.alignment.scale = _options.dotScale;
    }
    this.options = _options;
    this.canvas = new awesome_qr_Canvas(options.size, options.size);
    this.canvasContext = this.canvas.getContext("2d");
    this.qrCode = new QRCodeModel(-1, this.options.correctLevel);
    if (Number.isInteger(this.options.maskPattern)) {
      this.qrCode.maskPattern = this.options.maskPattern;
    }
    if (Number.isInteger(this.options.version)) {
      this.qrCode.typeNumber = this.options.version;
    }
    this.qrCode.addData(this.options.text);
    this.qrCode.make();
  }
  draw() {
    return new Promise(resolve => this._draw().then(resolve));
  }
  _clear() {
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  static _prepareRoundedCornerClip(canvasContext, x, y, w, h, r) {
    canvasContext.beginPath();
    canvasContext.moveTo(x, y);
    canvasContext.arcTo(x + w, y, x + w, y + h, r);
    canvasContext.arcTo(x + w, y + h, x, y + h, r);
    canvasContext.arcTo(x, y + h, x, y, r);
    canvasContext.arcTo(x, y, x + w, y, r);
    canvasContext.closePath();
  }
  static _getAverageRGB(image) {
    const blockSize = 5;
    const defaultRGB = {
      r: 0,
      g: 0,
      b: 0
    };
    let width, height;
    let i = -4;
    const rgb = {
      r: 0,
      g: 0,
      b: 0
    };
    let count = 0;
    height = image.naturalHeight || image.height;
    width = image.naturalWidth || image.width;
    const canvas = new awesome_qr_Canvas(width, height);
    const context = canvas.getContext("2d");
    if (!context) {
      return defaultRGB;
    }
    context.drawImage(image, 0, 0);
    let data;
    try {
      data = context.getImageData(0, 0, width, height);
    } catch (e) {
      return defaultRGB;
    }
    while ((i += blockSize * 4) < data.data.length) {
      if (data.data[i] > 200 || data.data[i + 1] > 200 || data.data[i + 2] > 200) continue;
      ++count;
      rgb.r += data.data[i];
      rgb.g += data.data[i + 1];
      rgb.b += data.data[i + 2];
    }
    rgb.r = ~~(rgb.r / count);
    rgb.g = ~~(rgb.g / count);
    rgb.b = ~~(rgb.b / count);
    return rgb;
  }
  static _drawDot(canvasContext, centerX, centerY, nSize, xyOffset = 0, dotScale = 1) {
    canvasContext.fillRect((centerX + xyOffset) * nSize, (centerY + xyOffset) * nSize, dotScale * nSize, dotScale * nSize);
  }
  static _drawAlignProtector(canvasContext, centerX, centerY, nSize) {
    canvasContext.clearRect((centerX - 2) * nSize, (centerY - 2) * nSize, 5 * nSize, 5 * nSize);
    canvasContext.fillRect((centerX - 2) * nSize, (centerY - 2) * nSize, 5 * nSize, 5 * nSize);
  }
  static _drawAlign(canvasContext, centerX, centerY, nSize, xyOffset = 0, dotScale = 1, colorDark, hasProtector) {
    const oldFillStyle = canvasContext.fillStyle;
    canvasContext.fillStyle = colorDark;
    new Array(4).fill(0).map((_, i) => {
      AwesomeQR._drawDot(canvasContext, centerX - 2 + i, centerY - 2, nSize, xyOffset, dotScale);
      AwesomeQR._drawDot(canvasContext, centerX + 2, centerY - 2 + i, nSize, xyOffset, dotScale);
      AwesomeQR._drawDot(canvasContext, centerX + 2 - i, centerY + 2, nSize, xyOffset, dotScale);
      AwesomeQR._drawDot(canvasContext, centerX - 2, centerY + 2 - i, nSize, xyOffset, dotScale);
    });
    AwesomeQR._drawDot(canvasContext, centerX, centerY, nSize, xyOffset, dotScale);
    if (!hasProtector) {
      canvasContext.fillStyle = "rgba(255, 255, 255, 0.6)";
      new Array(2).fill(0).map((_, i) => {
        AwesomeQR._drawDot(canvasContext, centerX - 1 + i, centerY - 1, nSize, xyOffset, dotScale);
        AwesomeQR._drawDot(canvasContext, centerX + 1, centerY - 1 + i, nSize, xyOffset, dotScale);
        AwesomeQR._drawDot(canvasContext, centerX + 1 - i, centerY + 1, nSize, xyOffset, dotScale);
        AwesomeQR._drawDot(canvasContext, centerX - 1, centerY + 1 - i, nSize, xyOffset, dotScale);
      });
    }
    canvasContext.fillStyle = oldFillStyle;
  }
  _draw() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
    return __awaiter(this, void 0, void 0, function* () {
      const nCount = (_a = this.qrCode) === null || _a === void 0 ? void 0 : _a.moduleCount;
      const rawSize = this.options.size;
      let rawMargin = this.options.margin;
      if (rawMargin < 0 || rawMargin * 2 >= rawSize) {
        rawMargin = 0;
      }
      const margin = Math.ceil(rawMargin);
      const rawViewportSize = rawSize - 2 * rawMargin;
      const whiteMargin = this.options.whiteMargin;
      const backgroundDimming = this.options.backgroundDimming;
      const nSize = Math.ceil(rawViewportSize / nCount);
      const viewportSize = nSize * nCount;
      const size = viewportSize + 2 * margin;
      const mainCanvas = new awesome_qr_Canvas(size, size);
      const mainCanvasContext = mainCanvas.getContext("2d");
      this._clear();
      // Translate to make the top and left margins off the viewport
      mainCanvasContext.save();
      mainCanvasContext.translate(margin, margin);
      const backgroundCanvas = new awesome_qr_Canvas(size, size);
      const backgroundCanvasContext = backgroundCanvas.getContext("2d");
      let parsedGIFBackground = null;
      let gifFrames = [];
      if (!!this.options.gifBackground) {
        const gif = parseGIF(this.options.gifBackground);
        parsedGIFBackground = gif;
        gifFrames = decompressFrames(gif, true);
        if (this.options.autoColor) {
          let r = 0,
            g = 0,
            b = 0;
          let count = 0;
          for (let i = 0; i < gifFrames[0].colorTable.length; i++) {
            const c = gifFrames[0].colorTable[i];
            if (c[0] > 200 || c[1] > 200 || c[2] > 200) continue;
            if (c[0] === 0 && c[1] === 0 && c[2] === 0) continue;
            count++;
            r += c[0];
            g += c[1];
            b += c[2];
          }
          r = ~~(r / count);
          g = ~~(g / count);
          b = ~~(b / count);
          this.options.colorDark = `rgb(${r},${g},${b})`;
        }
      } else if (!!this.options.backgroundImage) {
        const backgroundImage = yield awesome_qr_loadImage(this.options.backgroundImage);
        if (this.options.autoColor) {
          const avgRGB = AwesomeQR._getAverageRGB(backgroundImage);
          this.options.colorDark = `rgb(${avgRGB.r},${avgRGB.g},${avgRGB.b})`;
        }
        backgroundCanvasContext.drawImage(backgroundImage, 0, 0, backgroundImage.width, backgroundImage.height, 0, 0, size, size);
        backgroundCanvasContext.rect(0, 0, size, size);
        backgroundCanvasContext.fillStyle = backgroundDimming;
        backgroundCanvasContext.fill();
      } else {
        backgroundCanvasContext.rect(0, 0, size, size);
        backgroundCanvasContext.fillStyle = this.options.colorLight;
        backgroundCanvasContext.fill();
      }
      const alignmentPatternCenters = QRUtil.getPatternPosition(this.qrCode.typeNumber);
      const dataScale = ((_c = (_b = this.options.components) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.scale) || defaultScale;
      const dataXyOffset = (1 - dataScale) * 0.5;
      for (let row = 0; row < nCount; row++) {
        for (let col = 0; col < nCount; col++) {
          const bIsDark = this.qrCode.isDark(row, col);
          const isBlkPosCtr = col < 8 && (row < 8 || row >= nCount - 8) || col >= nCount - 8 && row < 8;
          const isTiming = row == 6 && col >= 8 && col <= nCount - 8 || col == 6 && row >= 8 && row <= nCount - 8;
          let isProtected = isBlkPosCtr || isTiming;
          for (let i = 1; i < alignmentPatternCenters.length - 1; i++) {
            isProtected = isProtected || row >= alignmentPatternCenters[i] - 2 && row <= alignmentPatternCenters[i] + 2 && col >= alignmentPatternCenters[i] - 2 && col <= alignmentPatternCenters[i] + 2;
          }
          const nLeft = col * nSize + (isProtected ? 0 : dataXyOffset * nSize);
          const nTop = row * nSize + (isProtected ? 0 : dataXyOffset * nSize);
          mainCanvasContext.strokeStyle = bIsDark ? this.options.colorDark : this.options.colorLight;
          mainCanvasContext.lineWidth = 0.5;
          mainCanvasContext.fillStyle = bIsDark ? this.options.colorDark : this.options.colorLight;
          if (alignmentPatternCenters.length === 0) {
            if (!isProtected) {
              mainCanvasContext.fillRect(nLeft, nTop, (isProtected ? isBlkPosCtr ? 1 : 1 : dataScale) * nSize, (isProtected ? isBlkPosCtr ? 1 : 1 : dataScale) * nSize);
            }
          } else {
            const inAgnRange = col < nCount - 4 && col >= nCount - 4 - 5 && row < nCount - 4 && row >= nCount - 4 - 5;
            if (!isProtected && !inAgnRange) {
              // if align pattern list is empty, then it means that we don't need to leave room for the align patterns
              mainCanvasContext.fillRect(nLeft, nTop, (isProtected ? isBlkPosCtr ? 1 : 1 : dataScale) * nSize, (isProtected ? isBlkPosCtr ? 1 : 1 : dataScale) * nSize);
            }
          }
        }
      }
      const cornerAlignmentCenter = alignmentPatternCenters[alignmentPatternCenters.length - 1];
      // - PROTECTORS
      const protectorStyle = this.options.colorLight;
      // - FINDER PROTECTORS
      mainCanvasContext.fillStyle = protectorStyle;
      mainCanvasContext.fillRect(0, 0, 8 * nSize, 8 * nSize);
      mainCanvasContext.fillRect(0, (nCount - 8) * nSize, 8 * nSize, 8 * nSize);
      mainCanvasContext.fillRect((nCount - 8) * nSize, 0, 8 * nSize, 8 * nSize);
      // - TIMING PROTECTORS
      if ((_e = (_d = this.options.components) === null || _d === void 0 ? void 0 : _d.timing) === null || _e === void 0 ? void 0 : _e.protectors) {
        mainCanvasContext.fillRect(8 * nSize, 6 * nSize, (nCount - 8 - 8) * nSize, nSize);
        mainCanvasContext.fillRect(6 * nSize, 8 * nSize, nSize, (nCount - 8 - 8) * nSize);
      }
      // - CORNER ALIGNMENT PROTECTORS
      if ((_g = (_f = this.options.components) === null || _f === void 0 ? void 0 : _f.cornerAlignment) === null || _g === void 0 ? void 0 : _g.protectors) {
        AwesomeQR._drawAlignProtector(mainCanvasContext, cornerAlignmentCenter, cornerAlignmentCenter, nSize);
      }
      // - ALIGNMENT PROTECTORS
      if ((_j = (_h = this.options.components) === null || _h === void 0 ? void 0 : _h.alignment) === null || _j === void 0 ? void 0 : _j.protectors) {
        for (let i = 0; i < alignmentPatternCenters.length; i++) {
          for (let j = 0; j < alignmentPatternCenters.length; j++) {
            const agnX = alignmentPatternCenters[j];
            const agnY = alignmentPatternCenters[i];
            if (agnX === 6 && (agnY === 6 || agnY === cornerAlignmentCenter)) {
              continue;
            } else if (agnY === 6 && (agnX === 6 || agnX === cornerAlignmentCenter)) {
              continue;
            } else if (agnX === cornerAlignmentCenter && agnY === cornerAlignmentCenter) {
              continue;
            } else {
              AwesomeQR._drawAlignProtector(mainCanvasContext, agnX, agnY, nSize);
            }
          }
        }
      }
      // - FINDER
      mainCanvasContext.fillStyle = this.options.colorDark;
      mainCanvasContext.fillRect(0, 0, 7 * nSize, nSize);
      mainCanvasContext.fillRect((nCount - 7) * nSize, 0, 7 * nSize, nSize);
      mainCanvasContext.fillRect(0, 6 * nSize, 7 * nSize, nSize);
      mainCanvasContext.fillRect((nCount - 7) * nSize, 6 * nSize, 7 * nSize, nSize);
      mainCanvasContext.fillRect(0, (nCount - 7) * nSize, 7 * nSize, nSize);
      mainCanvasContext.fillRect(0, (nCount - 7 + 6) * nSize, 7 * nSize, nSize);
      mainCanvasContext.fillRect(0, 0, nSize, 7 * nSize);
      mainCanvasContext.fillRect(6 * nSize, 0, nSize, 7 * nSize);
      mainCanvasContext.fillRect((nCount - 7) * nSize, 0, nSize, 7 * nSize);
      mainCanvasContext.fillRect((nCount - 7 + 6) * nSize, 0, nSize, 7 * nSize);
      mainCanvasContext.fillRect(0, (nCount - 7) * nSize, nSize, 7 * nSize);
      mainCanvasContext.fillRect(6 * nSize, (nCount - 7) * nSize, nSize, 7 * nSize);
      mainCanvasContext.fillRect(2 * nSize, 2 * nSize, 3 * nSize, 3 * nSize);
      mainCanvasContext.fillRect((nCount - 7 + 2) * nSize, 2 * nSize, 3 * nSize, 3 * nSize);
      mainCanvasContext.fillRect(2 * nSize, (nCount - 7 + 2) * nSize, 3 * nSize, 3 * nSize);
      // - TIMING
      const timingScale = ((_l = (_k = this.options.components) === null || _k === void 0 ? void 0 : _k.timing) === null || _l === void 0 ? void 0 : _l.scale) || defaultScale;
      const timingXyOffset = (1 - timingScale) * 0.5;
      for (let i = 0; i < nCount - 8; i += 2) {
        AwesomeQR._drawDot(mainCanvasContext, 8 + i, 6, nSize, timingXyOffset, timingScale);
        AwesomeQR._drawDot(mainCanvasContext, 6, 8 + i, nSize, timingXyOffset, timingScale);
      }
      // - CORNER ALIGNMENT PROTECTORS
      const cornerAlignmentScale = ((_o = (_m = this.options.components) === null || _m === void 0 ? void 0 : _m.cornerAlignment) === null || _o === void 0 ? void 0 : _o.scale) || defaultScale;
      const cornerAlignmentXyOffset = (1 - cornerAlignmentScale) * 0.5;
      AwesomeQR._drawAlign(mainCanvasContext, cornerAlignmentCenter, cornerAlignmentCenter, nSize, cornerAlignmentXyOffset, cornerAlignmentScale, this.options.colorDark, ((_q = (_p = this.options.components) === null || _p === void 0 ? void 0 : _p.cornerAlignment) === null || _q === void 0 ? void 0 : _q.protectors) || false);
      // - ALIGNEMNT
      const alignmentScale = ((_s = (_r = this.options.components) === null || _r === void 0 ? void 0 : _r.alignment) === null || _s === void 0 ? void 0 : _s.scale) || defaultScale;
      const alignmentXyOffset = (1 - alignmentScale) * 0.5;
      for (let i = 0; i < alignmentPatternCenters.length; i++) {
        for (let j = 0; j < alignmentPatternCenters.length; j++) {
          const agnX = alignmentPatternCenters[j];
          const agnY = alignmentPatternCenters[i];
          if (agnX === 6 && (agnY === 6 || agnY === cornerAlignmentCenter)) {
            continue;
          } else if (agnY === 6 && (agnX === 6 || agnX === cornerAlignmentCenter)) {
            continue;
          } else if (agnX === cornerAlignmentCenter && agnY === cornerAlignmentCenter) {
            continue;
          } else {
            AwesomeQR._drawAlign(mainCanvasContext, agnX, agnY, nSize, alignmentXyOffset, alignmentScale, this.options.colorDark, ((_u = (_t = this.options.components) === null || _t === void 0 ? void 0 : _t.alignment) === null || _u === void 0 ? void 0 : _u.protectors) || false);
          }
        }
      }
      // Fill the margin
      if (whiteMargin) {
        mainCanvasContext.fillStyle = this.options.backgroundColor;
        mainCanvasContext.fillRect(-margin, -margin, size, margin);
        mainCanvasContext.fillRect(-margin, viewportSize, size, margin);
        mainCanvasContext.fillRect(viewportSize, -margin, margin, size);
        mainCanvasContext.fillRect(-margin, -margin, margin, size);
      }
      if (!!this.options.logoImage) {
        const logoImage = yield awesome_qr_loadImage(this.options.logoImage);
        let logoScale = this.options.logoScale;
        let logoMargin = this.options.logoMargin;
        let logoCornerRadius = this.options.logoCornerRadius;
        if (logoScale <= 0 || logoScale >= 1.0) {
          logoScale = 0.2;
        }
        if (logoMargin < 0) {
          logoMargin = 0;
        }
        if (logoCornerRadius < 0) {
          logoCornerRadius = 0;
        }
        const logoSize = viewportSize * logoScale;
        const x = 0.5 * (size - logoSize);
        const y = x;
        // Restore the canvas
        // After restoring, the top and left margins should be taken into account
        mainCanvasContext.restore();
        // Clean the area that the logo covers (including margins)
        mainCanvasContext.fillStyle = this.options.logoBackgroundColor;
        mainCanvasContext.save();
        AwesomeQR._prepareRoundedCornerClip(mainCanvasContext, x - logoMargin, y - logoMargin, logoSize + 2 * logoMargin, logoSize + 2 * logoMargin, logoCornerRadius + logoMargin);
        mainCanvasContext.clip();
        const oldGlobalCompositeOperation = mainCanvasContext.globalCompositeOperation;
        mainCanvasContext.globalCompositeOperation = "destination-out";
        mainCanvasContext.fill();
        mainCanvasContext.globalCompositeOperation = oldGlobalCompositeOperation;
        mainCanvasContext.restore();
        // Draw logo image
        mainCanvasContext.save();
        AwesomeQR._prepareRoundedCornerClip(mainCanvasContext, x, y, logoSize, logoSize, logoCornerRadius);
        mainCanvasContext.clip();
        mainCanvasContext.drawImage(logoImage, x, y, logoSize, logoSize);
        mainCanvasContext.restore();
        // Re-translate the canvas to translate the top and left margins into invisible area
        mainCanvasContext.save();
        mainCanvasContext.translate(margin, margin);
      }
      if (!!parsedGIFBackground) {
        let gifOutput;
        // Reuse in order to apply the patch
        let backgroundCanvas;
        let backgroundCanvasContext;
        let patchCanvas;
        let patchCanvasContext;
        let patchData;
        gifFrames.forEach(function (frame) {
          if (!gifOutput) {
            gifOutput = new gif_js_GIFEncoder(rawSize, rawSize);
            gifOutput.setDelay(frame.delay);
            gifOutput.setRepeat(0);
          }
          const {
            width,
            height
          } = frame.dims;
          if (!backgroundCanvas) {
            backgroundCanvas = new awesome_qr_Canvas(width, height);
            backgroundCanvasContext = backgroundCanvas.getContext("2d");
            backgroundCanvasContext.rect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
            backgroundCanvasContext.fillStyle = "#ffffff";
            backgroundCanvasContext.fill();
          }
          if (!patchCanvas || !patchData || width !== patchCanvas.width || height !== patchCanvas.height) {
            patchCanvas = new awesome_qr_Canvas(width, height);
            patchCanvasContext = patchCanvas.getContext("2d");
            patchData = patchCanvasContext.createImageData(width, height);
          }
          patchData.data.set(frame.patch);
          patchCanvasContext.putImageData(patchData, 0, 0);
          backgroundCanvasContext.drawImage(patchCanvas.getContext('2d').canvas, frame.dims.left, frame.dims.top);
          const unscaledCanvas = new awesome_qr_Canvas(size, size);
          const unscaledCanvasContext = unscaledCanvas.getContext("2d");
          unscaledCanvasContext.drawImage(backgroundCanvas.getContext('2d').canvas, 0, 0, size, size);
          unscaledCanvasContext.rect(0, 0, size, size);
          unscaledCanvasContext.fillStyle = backgroundDimming;
          unscaledCanvasContext.fill();
          unscaledCanvasContext.drawImage(mainCanvas.getContext('2d').canvas, 0, 0, size, size);
          // Scale the final image
          const outCanvas = new awesome_qr_Canvas(rawSize, rawSize);
          const outCanvasContext = outCanvas.getContext("2d");
          outCanvasContext.drawImage(unscaledCanvas.getContext('2d').canvas, 0, 0, rawSize, rawSize);
          gifOutput.addFrame(outCanvasContext.getImageData(0, 0, outCanvas.width, outCanvas.height).data);
        });
        if (!gifOutput) {
          throw new Error("No frames.");
        }
        gifOutput.finish();
        if (isElement(this.canvas)) {
          const u8array = gifOutput.stream().toFlattenUint8Array();
          const binary = u8array.reduce((bin, u8) => bin + String.fromCharCode(u8), "");
          return Promise.resolve(`data:image/gif;base64,${window.btoa(binary)}`);
        }
        return Promise.resolve(Buffer.from(gifOutput.stream().toFlattenUint8Array()));
      } else {
        // Swap and merge the foreground and the background
        backgroundCanvasContext.drawImage(mainCanvas.getContext('2d').canvas, 0, 0, size, size);
        mainCanvasContext.drawImage(backgroundCanvas.getContext('2d').canvas, -margin, -margin, size, size);
        // Scale the final image
        const outCanvas = new awesome_qr_Canvas(rawSize, rawSize); //document.createElement("canvas");
        const outCanvasContext = outCanvas.getContext("2d");
        outCanvasContext.drawImage(mainCanvas.getContext('2d').canvas, 0, 0, rawSize, rawSize);
        this.canvas = outCanvas;
        const format = this.options.gifBackground ? "gif" : "png";
        if (isElement(this.canvas)) {
          return Promise.resolve(this.canvas.toDataURL(format));
        }
        return Promise.resolve(this.canvas.toBuffer(format));
      }
    });
  }
}
AwesomeQR.CorrectLevel = QRErrorCorrectLevel;
AwesomeQR.defaultComponentOptions = {
  data: {
    scale: 0.4
  },
  timing: {
    scale: 0.5,
    protectors: false
  },
  alignment: {
    scale: 0.5,
    protectors: false
  },
  cornerAlignment: {
    scale: 0.5,
    protectors: true
  }
};
AwesomeQR.defaultOptions = {
  text: "",
  size: 400,
  margin: 20,
  colorDark: "#000000",
  colorLight: "rgba(255, 255, 255, 0.6)",
  correctLevel: QRErrorCorrectLevel.M,
  backgroundImage: undefined,
  backgroundDimming: "rgba(0,0,0,0)",
  logoImage: undefined,
  logoScale: 0.2,
  logoMargin: 4,
  logoCornerRadius: 8,
  whiteMargin: true,
  components: AwesomeQR.defaultComponentOptions,
  autoColor: true,
  logoBackgroundColor: '#ffffff',
  backgroundColor: '#ffffff'
};
function isElement(obj) {
  try {
    //Using W3 DOM2 (works for FF, Opera and Chrome)
    return obj instanceof HTMLElement;
  } catch (e) {
    //Browsers not supporting W3 DOM2 don't have HTMLElement and
    //an exception is thrown and we end up here. Testing some
    //properties that all elements have (works on IE7)
    return typeof obj === "object" && obj.nodeType === 1 && typeof obj.style === "object" && typeof obj.ownerDocument === "object";
  }
}
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./node_modules/vue-qr/src/packages/vue-qr.vue?vue&type=script&lang=js



/* harmony default export */ var vue_qrvue_type_script_lang_js = ({
  props: {
    text: {
      type: String,
      required: true
    },
    qid: {
      type: String
    },
    correctLevel: {
      type: Number,
      default: 1
    },
    size: {
      type: Number,
      default: 200
    },
    margin: {
      type: Number,
      default: 20
    },
    colorDark: {
      type: String,
      default: "#000000"
    },
    colorLight: {
      type: String,
      default: "#FFFFFF"
    },
    bgSrc: {
      type: String,
      default: undefined
    },
    background: {
      type: String,
      default: "rgba(0,0,0,0)"
    },
    backgroundDimming: {
      type: String,
      default: "rgba(0,0,0,0)"
    },
    logoSrc: {
      type: String,
      default: undefined
    },
    logoBackgroundColor: {
      type: String,
      default: "rgba(255,255,255,1)"
    },
    gifBgSrc: {
      type: String,
      default: undefined
    },
    logoScale: {
      type: Number,
      default: 0.2
    },
    logoMargin: {
      type: Number,
      default: 0
    },
    logoCornerRadius: {
      type: Number,
      default: 8
    },
    whiteMargin: {
      type: [Boolean, String],
      default: true
    },
    dotScale: {
      type: Number,
      default: 1
    },
    autoColor: {
      type: [Boolean, String],
      default: true
    },
    binarize: {
      type: [Boolean, String],
      default: false
    },
    binarizeThreshold: {
      type: Number,
      default: 128
    },
    callback: {
      type: Function,
      default: function () {
        return undefined;
      }
    },
    bindElement: {
      type: Boolean,
      default: true
    },
    backgroundColor: {
      type: String,
      default: "#FFFFFF"
    },
    components: {
      default: function () {
        return {
          data: {
            scale: 1
          },
          timing: {
            scale: 1,
            protectors: false
          },
          alignment: {
            scale: 1,
            protectors: false
          },
          cornerAlignment: {
            scale: 1,
            protectors: true
          }
        };
      }
    }
  },
  name: "vue-qr",
  data() {
    return {
      imgUrl: ""
    };
  },
  watch: {
    $props: {
      deep: true,
      handler() {
        this.main();
      }
    }
  },
  mounted() {
    this.main();
  },
  methods: {
    async main() {
      // const that = this;
      if (this.gifBgSrc) {
        const gifImg = await packages_readAsArrayBuffer(this.gifBgSrc);
        const logoImg = this.logoSrc;
        this.render(undefined, logoImg, gifImg);
        return;
      }
      const bgImg = this.bgSrc;
      const logoImg = this.logoSrc;
      this.render(bgImg, logoImg);
    },
    async render(img, logoImg, gifBgSrc) {
      const that = this;
      // if (this.$isServer) {
      //   return;
      // }
      // if (!this.AwesomeQR) {
      //   this.AwesomeQR = AwesomeQR;
      // }
      new AwesomeQR({
        gifBackground: gifBgSrc,
        text: that.text,
        size: that.size,
        margin: that.margin,
        colorDark: that.colorDark,
        colorLight: that.colorLight,
        backgroundColor: that.backgroundColor,
        backgroundImage: img,
        backgroundDimming: that.backgroundDimming,
        logoImage: logoImg,
        logoScale: that.logoScale,
        logoBackgroundColor: that.logoBackgroundColor,
        correctLevel: that.correctLevel,
        logoMargin: that.logoMargin,
        logoCornerRadius: that.logoCornerRadius,
        whiteMargin: toBoolean(that.whiteMargin),
        dotScale: that.dotScale,
        autoColor: toBoolean(that.autoColor),
        binarize: toBoolean(that.binarize),
        binarizeThreshold: that.binarizeThreshold,
        components: that.components
      }).draw().then(dataUri => {
        this.imgUrl = dataUri;
        that.callback && that.callback(dataUri, that.qid);
      });
    }
  }
});
;// CONCATENATED MODULE: ./node_modules/vue-qr/src/packages/vue-qr.vue?vue&type=script&lang=js
 
// EXTERNAL MODULE: ./node_modules/vue-loader/dist/exportHelper.js
var exportHelper = __webpack_require__(89);
;// CONCATENATED MODULE: ./node_modules/vue-qr/src/packages/vue-qr.vue




;
const __exports__ = /*#__PURE__*/(0,exportHelper/* default */.Z)(vue_qrvue_type_script_lang_js, [['render',vue_qrvue_type_template_id_477c6f15_render]])

/* harmony default export */ var vue_qr = (__exports__);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/package/share-content.vue?vue&type=script&lang=js


/* harmony default export */ var share_contentvue_type_script_lang_js = ({
  name: 'ShareContent',
  // 自己编写组件插件时name属性必须有，否则无视调用成功
  props: {
    info: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  components: {
    VueQr: vue_qr
  },
  data() {
    return {
      showQr: false
    };
  },
  computed: {
    targeUrl() {
      let params = {
        url: this.info.url,
        /*获取URL，可加上来自分享到QQ标识，方便统计*/
        title: this.info.title,
        /*分享标题(可选)*/
        summary: this.info.summary,
        /*分享描述(可选)*/
        pics: this.info.titleimg,
        /*分享图片(可选)*/
        desc: this.info.desc
      };
      let array = [];
      for (let item in params) {
        array.push(item + '=' + encodeURIComponent(params[item] || ''));
      }
      return array.join('&');
    }
  },
  methods: {
    shareToMicroblog() {
      window.open(`https://service.weibo.com/share/share.php?` + this.targeUrl);
    },
    shareToQQ() {
      window.open("http://connect.qq.com/widget/shareqq/iframe_index.html?" + this.targeUrl, 'qq', 'height=520, width=720');
    },
    shareToQQRom() {
      window.open("https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?" + this.targeUrl);
    },
    shareToWechat() {
      this.showQr = !this.showQr;
    }
  },
  directives: {
    clickOutside: {
      updated(el, binding) {
        function clickHandler(e) {
          if (el.contains(e.target)) {
            return false;
          } else {
            binding.value();
          }
        }
        el._vueClickOutside = clickHandler;
        document.addEventListener('click', clickHandler);
      },
      unmounted(el) {
        document.removeEventListener('click', el._vueClickOutside);
      }
    }
  }
});
;// CONCATENATED MODULE: ./src/package/share-content.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-12.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/package/share-content.vue?vue&type=style&index=0&id=1e320325&scoped=true&lang=css
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./src/package/share-content.vue?vue&type=style&index=0&id=1e320325&scoped=true&lang=css

;// CONCATENATED MODULE: ./src/package/share-content.vue




;


const share_content_exports_ = /*#__PURE__*/(0,exportHelper/* default */.Z)(share_contentvue_type_script_lang_js, [['render',render],['__scopeId',"data-v-1e320325"]])

/* harmony default export */ var share_content = (share_content_exports_);
;// CONCATENATED MODULE: ./src/package/index.js

const components = [share_content];
const install = function (app) {
  components.forEach(component => {
    app.component(component.name, component);
  });
};

// export default {
//     install: (app) => {
//         components.forEach((component) => {
//             console.log('测试插件',component)
//             app.component(component.name,component)
//         })
//     }
// }
/* harmony default export */ var src_package = (install);
;// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = (src_package);


}();
module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=share-content.common.js.map