(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
/**
* @vue/shared v3.4.38
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function makeMap(str, expectsLowerCase) {
  const set2 = new Set(str.split(","));
  return (val) => set2.has(val);
}
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
(key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
const isArray$1 = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isDate = (val) => toTypeString(val) === "[object Date]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return (isObject(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject$1 = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction(
  (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
);
const capitalize = cacheStringFunction((str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});
const toHandlerKey = cacheStringFunction((str) => {
  const s = str ? `on${capitalize(str)}` : ``;
  return s;
});
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, ...arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](...arg);
  }
};
const def = (obj, key, value, writable = false) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    writable,
    value
  });
};
const looseToNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
function normalizeStyle(value) {
  if (isArray$1(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value) || isObject(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:([^]+)/;
const styleCommentRE = /\/\*[^]*?\*\//g;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray$1(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
function looseCompareArrays(a2, b) {
  if (a2.length !== b.length) return false;
  let equal = true;
  for (let i = 0; equal && i < a2.length; i++) {
    equal = looseEqual(a2[i], b[i]);
  }
  return equal;
}
function looseEqual(a2, b) {
  if (a2 === b) return true;
  let aValidType = isDate(a2);
  let bValidType = isDate(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? a2.getTime() === b.getTime() : false;
  }
  aValidType = isSymbol(a2);
  bValidType = isSymbol(b);
  if (aValidType || bValidType) {
    return a2 === b;
  }
  aValidType = isArray$1(a2);
  bValidType = isArray$1(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? looseCompareArrays(a2, b) : false;
  }
  aValidType = isObject(a2);
  bValidType = isObject(b);
  if (aValidType || bValidType) {
    if (!aValidType || !bValidType) {
      return false;
    }
    const aKeysCount = Object.keys(a2).length;
    const bKeysCount = Object.keys(b).length;
    if (aKeysCount !== bKeysCount) {
      return false;
    }
    for (const key in a2) {
      const aHasKey = a2.hasOwnProperty(key);
      const bHasKey = b.hasOwnProperty(key);
      if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a2[key], b[key])) {
        return false;
      }
    }
  }
  return String(a2) === String(b);
}
function looseIndexOf(arr, val) {
  return arr.findIndex((item) => looseEqual(item, val));
}
const isRef$1 = (val) => {
  return !!(val && val.__v_isRef === true);
};
const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray$1(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? isRef$1(val) ? toDisplayString(val.value) : JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (isRef$1(val)) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce(
        (entries, [key, val2], i) => {
          entries[stringifySymbol(key, i) + " =>"] = val2;
          return entries;
        },
        {}
      )
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
    };
  } else if (isSymbol(val)) {
    return stringifySymbol(val);
  } else if (isObject(val) && !isArray$1(val) && !isPlainObject$1(val)) {
    return String(val);
  }
  return val;
};
const stringifySymbol = (v, i = "") => {
  var _a;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v
  );
};
/**
* @vue/reactivity v3.4.38
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.detached = detached;
    this._active = true;
    this.effects = [];
    this.cleanups = [];
    this.parent = activeEffectScope;
    if (!detached && activeEffectScope) {
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
        this
      ) - 1;
    }
  }
  get active() {
    return this._active;
  }
  run(fn) {
    if (this._active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    activeEffectScope = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this._active) {
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
      }
      if (!this.detached && this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.parent = void 0;
      this._active = false;
    }
  }
}
function effectScope(detached) {
  return new EffectScope(detached);
}
function recordEffectScope(effect2, scope = activeEffectScope) {
  if (scope && scope.active) {
    scope.effects.push(effect2);
  }
}
function getCurrentScope() {
  return activeEffectScope;
}
function onScopeDispose(fn) {
  if (activeEffectScope) {
    activeEffectScope.cleanups.push(fn);
  }
}
let activeEffect;
class ReactiveEffect {
  constructor(fn, trigger2, scheduler, scope) {
    this.fn = fn;
    this.trigger = trigger2;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    this._dirtyLevel = 4;
    this._trackId = 0;
    this._runnings = 0;
    this._shouldSchedule = false;
    this._depsLength = 0;
    recordEffectScope(this, scope);
  }
  get dirty() {
    if (this._dirtyLevel === 2 || this._dirtyLevel === 3) {
      this._dirtyLevel = 1;
      pauseTracking();
      for (let i = 0; i < this._depsLength; i++) {
        const dep = this.deps[i];
        if (dep.computed) {
          triggerComputed(dep.computed);
          if (this._dirtyLevel >= 4) {
            break;
          }
        }
      }
      if (this._dirtyLevel === 1) {
        this._dirtyLevel = 0;
      }
      resetTracking();
    }
    return this._dirtyLevel >= 4;
  }
  set dirty(v) {
    this._dirtyLevel = v ? 4 : 0;
  }
  run() {
    this._dirtyLevel = 0;
    if (!this.active) {
      return this.fn();
    }
    let lastShouldTrack = shouldTrack;
    let lastEffect = activeEffect;
    try {
      shouldTrack = true;
      activeEffect = this;
      this._runnings++;
      preCleanupEffect(this);
      return this.fn();
    } finally {
      postCleanupEffect(this);
      this._runnings--;
      activeEffect = lastEffect;
      shouldTrack = lastShouldTrack;
    }
  }
  stop() {
    if (this.active) {
      preCleanupEffect(this);
      postCleanupEffect(this);
      this.onStop && this.onStop();
      this.active = false;
    }
  }
}
function triggerComputed(computed2) {
  return computed2.value;
}
function preCleanupEffect(effect2) {
  effect2._trackId++;
  effect2._depsLength = 0;
}
function postCleanupEffect(effect2) {
  if (effect2.deps.length > effect2._depsLength) {
    for (let i = effect2._depsLength; i < effect2.deps.length; i++) {
      cleanupDepEffect(effect2.deps[i], effect2);
    }
    effect2.deps.length = effect2._depsLength;
  }
}
function cleanupDepEffect(dep, effect2) {
  const trackId = dep.get(effect2);
  if (trackId !== void 0 && effect2._trackId !== trackId) {
    dep.delete(effect2);
    if (dep.size === 0) {
      dep.cleanup();
    }
  }
}
let shouldTrack = true;
let pauseScheduleStack = 0;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function pauseScheduling() {
  pauseScheduleStack++;
}
function resetScheduling() {
  pauseScheduleStack--;
  while (!pauseScheduleStack && queueEffectSchedulers.length) {
    queueEffectSchedulers.shift()();
  }
}
function trackEffect(effect2, dep, debuggerEventExtraInfo) {
  if (dep.get(effect2) !== effect2._trackId) {
    dep.set(effect2, effect2._trackId);
    const oldDep = effect2.deps[effect2._depsLength];
    if (oldDep !== dep) {
      if (oldDep) {
        cleanupDepEffect(oldDep, effect2);
      }
      effect2.deps[effect2._depsLength++] = dep;
    } else {
      effect2._depsLength++;
    }
  }
}
const queueEffectSchedulers = [];
function triggerEffects(dep, dirtyLevel, debuggerEventExtraInfo) {
  pauseScheduling();
  for (const effect2 of dep.keys()) {
    let tracking;
    if (effect2._dirtyLevel < dirtyLevel && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
      effect2._shouldSchedule || (effect2._shouldSchedule = effect2._dirtyLevel === 0);
      effect2._dirtyLevel = dirtyLevel;
    }
    if (effect2._shouldSchedule && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
      effect2.trigger();
      if ((!effect2._runnings || effect2.allowRecurse) && effect2._dirtyLevel !== 2) {
        effect2._shouldSchedule = false;
        if (effect2.scheduler) {
          queueEffectSchedulers.push(effect2.scheduler);
        }
      }
    }
  }
  resetScheduling();
}
const createDep = (cleanup, computed2) => {
  const dep = /* @__PURE__ */ new Map();
  dep.cleanup = cleanup;
  dep.computed = computed2;
  return dep;
};
const targetMap = /* @__PURE__ */ new WeakMap();
const ITERATE_KEY = Symbol("");
const MAP_KEY_ITERATE_KEY = Symbol("");
function track(target, type, key) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = createDep(() => depsMap.delete(key)));
    }
    trackEffect(
      activeEffect,
      dep
    );
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && isArray$1(target)) {
    const newLength = Number(newValue);
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || !isSymbol(key2) && key2 >= newLength) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray$1(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray$1(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  pauseScheduling();
  for (const dep of deps) {
    if (dep) {
      triggerEffects(
        dep,
        4
      );
    }
  }
  resetScheduling();
}
function getDepFromReactive(object, key) {
  const depsMap = targetMap.get(object);
  return depsMap && depsMap.get(key);
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      pauseScheduling();
      const res = toRaw(this)[key].apply(this, args);
      resetScheduling();
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function hasOwnProperty(key) {
  if (!isSymbol(key)) key = String(key);
  const obj = toRaw(this);
  track(obj, "has", key);
  return obj.hasOwnProperty(key);
}
class BaseReactiveHandler {
  constructor(_isReadonly = false, _isShallow = false) {
    this._isReadonly = _isReadonly;
    this._isShallow = _isShallow;
  }
  get(target, key, receiver) {
    const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return isShallow2;
    } else if (key === "__v_raw") {
      if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
        return target;
      }
      return;
    }
    const targetIsArray = isArray$1(target);
    if (!isReadonly2) {
      if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }
      if (key === "hasOwnProperty") {
        return hasOwnProperty;
      }
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (isShallow2) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }
    if (isObject(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  }
}
class MutableReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(false, isShallow2);
  }
  set(target, key, value, receiver) {
    let oldValue = target[key];
    if (!this._isShallow) {
      const isOldValueReadonly = isReadonly(oldValue);
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      if (!isArray$1(target) && isRef(oldValue) && !isRef(value)) {
        if (isOldValueReadonly) {
          return false;
        } else {
          oldValue.value = value;
          return true;
        }
      }
    }
    const hadKey = isArray$1(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value);
      }
    }
    return result;
  }
  deleteProperty(target, key) {
    const hadKey = hasOwn(target, key);
    target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
      trigger(target, "delete", key, void 0);
    }
    return result;
  }
  has(target, key) {
    const result = Reflect.has(target, key);
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, "has", key);
    }
    return result;
  }
  ownKeys(target) {
    track(
      target,
      "iterate",
      isArray$1(target) ? "length" : ITERATE_KEY
    );
    return Reflect.ownKeys(target);
  }
}
class ReadonlyReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(true, isShallow2);
  }
  set(target, key) {
    return true;
  }
  deleteProperty(target, key) {
    return true;
  }
}
const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(
  true
);
const shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get(target, key, isReadonly2 = false, isShallow2 = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (hasChanged(key, rawKey)) {
      track(rawTarget, "get", key);
    }
    track(rawTarget, "get", rawKey);
  }
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has(key, isReadonly2 = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (hasChanged(key, rawKey)) {
      track(rawTarget, "has", key);
    }
    track(rawTarget, "has", rawKey);
  }
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly2 = false) {
  target = target["__v_raw"];
  !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value, _isShallow = false) {
  if (!_isShallow && !isShallow(value) && !isReadonly(value)) {
    value = toRaw(value);
  }
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set(key, value, _isShallow = false) {
  if (!_isShallow && !isShallow(value) && !isReadonly(value)) {
    value = toRaw(value);
  }
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  const oldValue = get2.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, "set", key, value);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  get2 ? get2.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, void 0);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0);
  }
  return result;
}
function createForEach(isReadonly2, isShallow2) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(
      rawTarget,
      "iterate",
      isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
    );
    return {
      // iterator protocol
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    return type === "delete" ? false : type === "clear" ? void 0 : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get(this, key);
    },
    get size() {
      return size(this);
    },
    has,
    add,
    set,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has,
    add(value) {
      return add.call(this, value, true);
    },
    set(key, value) {
      return set.call(this, key, value, true);
    },
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
    shallowInstrumentations2[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations2[method] = createIterableMethod(
      method,
      true,
      true
    );
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [
  mutableInstrumentations,
  readonlyInstrumentations,
  shallowInstrumentations,
  shallowReadonlyInstrumentations
] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(
      hasOwn(instrumentations, key) && key in target ? instrumentations : target,
      key,
      receiver
    );
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const shallowReadonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, true)
};
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  );
}
function shallowReactive(target) {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap
  );
}
function readonly(target) {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  );
}
function shallowReadonly(target) {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyCollectionHandlers,
    shallowReadonlyMap
  );
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject(target)) {
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(
    target,
    targetType === 2 ? collectionHandlers : baseHandlers
  );
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function isProxy(value) {
  return value ? !!value["__v_raw"] : false;
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  if (Object.isExtensible(value)) {
    def(value, "__v_skip", true);
  }
  return value;
}
const toReactive = (value) => isObject(value) ? reactive(value) : value;
const toReadonly = (value) => isObject(value) ? readonly(value) : value;
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2, isSSR) {
    this.getter = getter;
    this._setter = _setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this["__v_isReadonly"] = false;
    this.effect = new ReactiveEffect(
      () => getter(this._value),
      () => triggerRefValue(
        this,
        this.effect._dirtyLevel === 2 ? 2 : 3
      )
    );
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this["__v_isReadonly"] = isReadonly2;
  }
  get value() {
    const self2 = toRaw(this);
    if ((!self2._cacheable || self2.effect.dirty) && hasChanged(self2._value, self2._value = self2.effect.run())) {
      triggerRefValue(self2, 4);
    }
    trackRefValue(self2);
    if (self2.effect._dirtyLevel >= 2) {
      triggerRefValue(self2, 2);
    }
    return self2._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
  // #region polyfill _dirty for backward compatibility third party code for Vue <= 3.3.x
  get _dirty() {
    return this.effect.dirty;
  }
  set _dirty(v) {
    this.effect.dirty = v;
  }
  // #endregion
}
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = isFunction(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = NOOP;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  return cRef;
}
function trackRefValue(ref2) {
  var _a;
  if (shouldTrack && activeEffect) {
    ref2 = toRaw(ref2);
    trackEffect(
      activeEffect,
      (_a = ref2.dep) != null ? _a : ref2.dep = createDep(
        () => ref2.dep = void 0,
        ref2 instanceof ComputedRefImpl ? ref2 : void 0
      )
    );
  }
}
function triggerRefValue(ref2, dirtyLevel = 4, newVal, oldVal) {
  ref2 = toRaw(ref2);
  const dep = ref2.dep;
  if (dep) {
    triggerEffects(
      dep,
      dirtyLevel
    );
  }
}
function isRef(r) {
  return !!(r && r.__v_isRef === true);
}
function ref(value) {
  return createRef(value, false);
}
function shallowRef(value) {
  return createRef(value, true);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    const useDirectValue = this.__v_isShallow || isShallow(newVal) || isReadonly(newVal);
    newVal = useDirectValue ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue;
      this._rawValue = newVal;
      this._value = useDirectValue ? newVal : toReactive(newVal);
      triggerRefValue(this, 4);
    }
  }
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
class CustomRefImpl {
  constructor(factory) {
    this.dep = void 0;
    this.__v_isRef = true;
    const { get: get2, set: set2 } = factory(
      () => trackRefValue(this),
      () => triggerRefValue(this)
    );
    this._get = get2;
    this._set = set2;
  }
  get value() {
    return this._get();
  }
  set value(newVal) {
    this._set(newVal);
  }
}
function customRef(factory) {
  return new CustomRefImpl(factory);
}
function toRefs(object) {
  const ret = isArray$1(object) ? new Array(object.length) : {};
  for (const key in object) {
    ret[key] = propertyToRef(object, key);
  }
  return ret;
}
class ObjectRefImpl {
  constructor(_object, _key, _defaultValue) {
    this._object = _object;
    this._key = _key;
    this._defaultValue = _defaultValue;
    this.__v_isRef = true;
  }
  get value() {
    const val = this._object[this._key];
    return val === void 0 ? this._defaultValue : val;
  }
  set value(newVal) {
    this._object[this._key] = newVal;
  }
  get dep() {
    return getDepFromReactive(toRaw(this._object), this._key);
  }
}
class GetterRefImpl {
  constructor(_getter) {
    this._getter = _getter;
    this.__v_isRef = true;
    this.__v_isReadonly = true;
  }
  get value() {
    return this._getter();
  }
}
function toRef(source, key, defaultValue) {
  if (isRef(source)) {
    return source;
  } else if (isFunction(source)) {
    return new GetterRefImpl(source);
  } else if (isObject(source) && arguments.length > 1) {
    return propertyToRef(source, key, defaultValue);
  } else {
    return ref(source);
  }
}
function propertyToRef(source, key, defaultValue) {
  const val = source[key];
  return isRef(val) ? val : new ObjectRefImpl(source, key, defaultValue);
}
/**
* @vue/runtime-core v3.4.38
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const stack = [];
let isWarning = false;
function warn$1(msg, ...args) {
  if (isWarning) return;
  isWarning = true;
  pauseTracking();
  const instance = stack.length ? stack[stack.length - 1].component : null;
  const appWarnHandler = instance && instance.appContext.config.warnHandler;
  const trace = getComponentTrace();
  if (appWarnHandler) {
    callWithErrorHandling(
      appWarnHandler,
      instance,
      11,
      [
        // eslint-disable-next-line no-restricted-syntax
        msg + args.map((a2) => {
          var _a, _b;
          return (_b = (_a = a2.toString) == null ? void 0 : _a.call(a2)) != null ? _b : JSON.stringify(a2);
        }).join(""),
        instance && instance.proxy,
        trace.map(
          ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
        ).join("\n"),
        trace
      ]
    );
  } else {
    const warnArgs = [`[Vue warn]: ${msg}`, ...args];
    if (trace.length && // avoid spamming console during tests
    true) {
      warnArgs.push(`
`, ...formatTrace(trace));
    }
    console.warn(...warnArgs);
  }
  resetTracking();
  isWarning = false;
}
function getComponentTrace() {
  let currentVNode = stack[stack.length - 1];
  if (!currentVNode) {
    return [];
  }
  const normalizedStack = [];
  while (currentVNode) {
    const last = normalizedStack[0];
    if (last && last.vnode === currentVNode) {
      last.recurseCount++;
    } else {
      normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
    }
    const parentInstance = currentVNode.component && currentVNode.component.parent;
    currentVNode = parentInstance && parentInstance.vnode;
  }
  return normalizedStack;
}
function formatTrace(trace) {
  const logs = [];
  trace.forEach((entry, i) => {
    logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
  });
  return logs;
}
function formatTraceEntry({ vnode, recurseCount }) {
  const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
  const isRoot = vnode.component ? vnode.component.parent == null : false;
  const open = ` at <${formatComponentName(
    vnode.component,
    vnode.type,
    isRoot
  )}`;
  const close = `>` + postfix;
  return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
}
function formatProps(props) {
  const res = [];
  const keys = Object.keys(props);
  keys.slice(0, 3).forEach((key) => {
    res.push(...formatProp(key, props[key]));
  });
  if (keys.length > 3) {
    res.push(` ...`);
  }
  return res;
}
function formatProp(key, value, raw) {
  if (isString(value)) {
    value = JSON.stringify(value);
    return raw ? value : [`${key}=${value}`];
  } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
    return raw ? value : [`${key}=${value}`];
  } else if (isRef(value)) {
    value = formatProp(key, toRaw(value.value), true);
    return raw ? value : [`${key}=Ref<`, value, `>`];
  } else if (isFunction(value)) {
    return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
  } else {
    value = toRaw(value);
    return raw ? value : [`${key}=`, value];
  }
}
function callWithErrorHandling(fn, instance, type, args) {
  try {
    return args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  if (isArray$1(fn)) {
    const values = [];
    for (let i = 0; i < fn.length; i++) {
      values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
    }
    return values;
  }
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = `https://vuejs.org/error-reference/#runtime-${type}`;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance.appContext.config.errorHandler;
    if (appErrorHandler) {
      pauseTracking();
      callWithErrorHandling(
        appErrorHandler,
        null,
        10,
        [err, exposedInstance, errorInfo]
      );
      resetTracking();
      return;
    }
  }
  logError$1(err, type, contextVNode, throwInDev);
}
function logError$1(err, type, contextVNode, throwInDev = true) {
  {
    console.error(err);
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue = [];
let flushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
function nextTick(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex$1(id) {
  let start = flushIndex + 1;
  let end = queue.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJob = queue[middle];
    const middleJobId = getId(middleJob);
    if (middleJobId < id || middleJobId === id && middleJob.pre) {
      start = middle + 1;
    } else {
      end = middle;
    }
  }
  return start;
}
function queueJob(job) {
  if (!queue.length || !queue.includes(
    job,
    isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex
  )) {
    if (job.id == null) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex$1(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function invalidateJob(job) {
  const i = queue.indexOf(job);
  if (i > flushIndex) {
    queue.splice(i, 1);
  }
}
function queuePostFlushCb(cb) {
  if (!isArray$1(cb)) {
    if (!activePostFlushCbs || !activePostFlushCbs.includes(
      cb,
      cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex
    )) {
      pendingPostFlushCbs.push(cb);
    }
  } else {
    pendingPostFlushCbs.push(...cb);
  }
  queueFlush();
}
function flushPreFlushCbs(instance, seen, i = isFlushing ? flushIndex + 1 : 0) {
  for (; i < queue.length; i++) {
    const cb = queue[i];
    if (cb && cb.pre) {
      if (instance && cb.id !== instance.uid) {
        continue;
      }
      queue.splice(i, 1);
      i--;
      cb();
    }
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)].sort(
      (a2, b) => getId(a2) - getId(b)
    );
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      const cb = activePostFlushCbs[postFlushIndex];
      if (cb.active !== false) cb();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
const comparator = (a2, b) => {
  const diff = getId(a2) - getId(b);
  if (diff === 0) {
    if (a2.pre && !b.pre) return -1;
    if (b.pre && !a2.pre) return 1;
  }
  return diff;
};
function flushJobs(seen) {
  isFlushPending = false;
  isFlushing = true;
  queue.sort(comparator);
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && job.active !== false) {
        if (false) ;
        callWithErrorHandling(
          job,
          job.i,
          job.i ? 15 : 14
        );
      }
    }
  } finally {
    flushIndex = 0;
    queue.length = 0;
    flushPostFlushCbs();
    isFlushing = false;
    currentFlushPromise = null;
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs();
    }
  }
}
let currentRenderingInstance = null;
let currentScopeId = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  currentScopeId = instance && instance.type.__scopeId || null;
  return prev;
}
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
  if (!ctx) return fn;
  if (fn._n) {
    return fn;
  }
  const renderFnWithContext = (...args) => {
    if (renderFnWithContext._d) {
      setBlockTracking(-1);
    }
    const prevInstance = setCurrentRenderingInstance(ctx);
    let res;
    try {
      res = fn(...args);
    } finally {
      setCurrentRenderingInstance(prevInstance);
      if (renderFnWithContext._d) {
        setBlockTracking(1);
      }
    }
    return res;
  };
  renderFnWithContext._n = true;
  renderFnWithContext._c = true;
  renderFnWithContext._d = true;
  return renderFnWithContext;
}
function withDirectives(vnode, directives) {
  if (currentRenderingInstance === null) {
    return vnode;
  }
  const instance = getComponentPublicInstance(currentRenderingInstance);
  const bindings = vnode.dirs || (vnode.dirs = []);
  for (let i = 0; i < directives.length; i++) {
    let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
    if (dir) {
      if (isFunction(dir)) {
        dir = {
          mounted: dir,
          updated: dir
        };
      }
      if (dir.deep) {
        traverse(value);
      }
      bindings.push({
        dir,
        instance,
        value,
        oldValue: void 0,
        arg,
        modifiers
      });
    }
  }
  return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;
  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    if (oldBindings) {
      binding.oldValue = oldBindings[i].value;
    }
    let hook = binding.dir[name];
    if (hook) {
      pauseTracking();
      callWithAsyncErrorHandling(hook, instance, 8, [
        vnode.el,
        binding,
        vnode,
        prevVNode
      ]);
      resetTracking();
    }
  }
}
function setTransitionHooks(vnode, hooks) {
  if (vnode.shapeFlag & 6 && vnode.component) {
    setTransitionHooks(vnode.component.subTree, hooks);
  } else if (vnode.shapeFlag & 128) {
    vnode.ssContent.transition = hooks.clone(vnode.ssContent);
    vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
  } else {
    vnode.transition = hooks;
  }
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function defineComponent(options, extraOptions) {
  return isFunction(options) ? (
    // #8326: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    /* @__PURE__ */ (() => extend({ name: options.name }, extraOptions, { setup: options }))()
  ) : options;
}
const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(
    type,
    hook,
    keepAliveRoot,
    true
    /* prepend */
  );
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      pauseTracking();
      const reset = setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      reset();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => {
  if (!isInSSRComponentSetup || lifecycle === "sp") {
    injectHook(lifecycle, (...args) => hook(...args), target);
  }
};
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook("bu");
const onUpdated = createHook("u");
const onBeforeUnmount = createHook("bum");
const onUnmounted = createHook("um");
const onServerPrefetch = createHook("sp");
const onRenderTriggered = createHook(
  "rtg"
);
const onRenderTracked = createHook(
  "rtc"
);
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
const COMPONENTS = "components";
function resolveComponent(name, maybeSelfReference) {
  return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}
const NULL_DYNAMIC_COMPONENT = Symbol.for("v-ndc");
function resolveDynamicComponent(component) {
  if (isString(component)) {
    return resolveAsset(COMPONENTS, component, false) || component;
  } else {
    return component || NULL_DYNAMIC_COMPONENT;
  }
}
function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
  const instance = currentRenderingInstance || currentInstance;
  if (instance) {
    const Component = instance.type;
    if (type === COMPONENTS) {
      const selfName = getComponentName(
        Component,
        false
      );
      if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
        return Component;
      }
    }
    const res = (
      // local registration
      // check instance[type] first which is resolved for options API
      resolve(instance[type] || Component[type], name) || // global registration
      resolve(instance.appContext[type], name)
    );
    if (!res && maybeSelfReference) {
      return Component;
    }
    return res;
  }
}
function resolve(registry, name) {
  return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
}
function renderList(source, renderItem, cache, index) {
  let ret;
  const cached = cache;
  if (isArray$1(source) || isString(source)) {
    ret = new Array(source.length);
    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(source[i], i, void 0, cached);
    }
  } else if (typeof source === "number") {
    ret = new Array(source);
    for (let i = 0; i < source; i++) {
      ret[i] = renderItem(i + 1, i, void 0, cached);
    }
  } else if (isObject(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(
        source,
        (item, i) => renderItem(item, i, void 0, cached)
      );
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);
      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        ret[i] = renderItem(source[key], key, i, cached);
      }
    }
  } else {
    ret = [];
  }
  return ret;
}
function renderSlot(slots, name, props = {}, fallback, noSlotted) {
  if (currentRenderingInstance.isCE || currentRenderingInstance.parent && isAsyncWrapper(currentRenderingInstance.parent) && currentRenderingInstance.parent.isCE) {
    return createVNode("slot", props, fallback);
  }
  let slot = slots[name];
  if (slot && slot._c) {
    slot._d = false;
  }
  openBlock();
  const validSlotContent = slot && ensureValidVNode(slot(props));
  const rendered = createBlock(
    Fragment,
    {
      key: (props.key || // slot content array of a dynamic conditional slot may have a branch
      // key attached in the `createSlots` helper, respect that
      validSlotContent && validSlotContent.key || `_${name}`) + // #7256 force differentiate fallback content from actual content
      (!validSlotContent && fallback ? "_fb" : "")
    },
    validSlotContent || [],
    validSlotContent && slots._ === 1 ? 64 : -2
  );
  if (rendered.scopeId) {
    rendered.slotScopeIds = [rendered.scopeId + "-s"];
  }
  if (slot && slot._c) {
    slot._d = true;
  }
  return rendered;
}
function ensureValidVNode(vnodes) {
  return vnodes.some((child) => {
    if (!isVNode(child)) return true;
    if (child.type === Comment) return false;
    if (child.type === Fragment && !ensureValidVNode(child.children))
      return false;
    return true;
  }) ? vnodes : null;
}
const getPublicInstance = (i) => {
  if (!i) return null;
  if (isStatefulComponent(i)) return getComponentPublicInstance(i);
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
    $: (i) => i,
    $el: (i) => i.vnode.el,
    $data: (i) => i.data,
    $props: (i) => i.props,
    $attrs: (i) => i.attrs,
    $slots: (i) => i.slots,
    $refs: (i) => i.refs,
    $parent: (i) => getPublicInstance(i.parent),
    $root: (i) => getPublicInstance(i.root),
    $emit: (i) => i.emit,
    $options: (i) => resolveMergedOptions(i),
    $forceUpdate: (i) => i.f || (i.f = () => {
      i.effect.dirty = true;
      queueJob(i.update);
    }),
    $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
    $watch: (i) => instanceWatch.bind(i)
  })
);
const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    if (key === "__v_skip") {
      return true;
    }
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    let normalizedProps;
    if (key[0] !== "$") {
      const n = accessCache[key];
      if (n !== void 0) {
        switch (n) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (hasSetupBinding(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if (
        // only cache other properties when instance has declared (thus stable)
        // props
        (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)
      ) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance.attrs, "get", "");
      }
      return publicGetter(instance);
    } else if (
      // css module (injected by vue-loader)
      (cssModule = type.__cssModules) && (cssModule = cssModule[key])
    ) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (
      // global properties
      globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
    ) {
      {
        return globalProperties[key];
      }
    } else ;
  },
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (hasSetupBinding(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn(instance.props, key)) {
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      return false;
    } else {
      {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({
    _: { data, setupState, accessCache, ctx, appContext, propsOptions }
  }, key) {
    let normalizedProps;
    return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
function normalizePropsOrEmits(props) {
  return isArray$1(props) ? props.reduce(
    (normalized, p2) => (normalized[p2] = null, normalized),
    {}
  ) : props;
}
let shouldCacheAccess = true;
function applyOptions(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook(options.beforeCreate, instance, "bc");
  }
  const {
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // lifecycle
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    // public API
    expose,
    inheritAttrs,
    // assets
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = null;
  if (injectOptions) {
    resolveInjections(injectOptions, ctx, checkDuplicateProperties);
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction(methodHandler)) {
        {
          ctx[key] = methodHandler.bind(publicThis);
        }
      }
    }
  }
  if (dataOptions) {
    const data = dataOptions.call(publicThis, publicThis);
    if (!isObject(data)) ;
    else {
      instance.data = reactive(data);
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get2 = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      const set2 = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
      const c = computed({
        get: get2,
        set: set2
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: (v) => c.value = v
      });
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  if (provideOptions) {
    const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides).forEach((key) => {
      provide(key, provides[key]);
    });
  }
  if (created) {
    callHook(created, instance, "c");
  }
  function registerLifecycleHook(register, hook) {
    if (isArray$1(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray$1(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render && instance.render === NOOP) {
    instance.render = render;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components) instance.components = components;
  if (directives) instance.directives = directives;
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
  if (isArray$1(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject(opt)) {
      if ("default" in opt) {
        injected = inject(
          opt.from || key,
          opt.default,
          true
        );
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (isRef(injected)) {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => injected.value,
        set: (v) => injected.value = v
      });
    } else {
      ctx[key] = injected;
    }
  }
}
function callHook(hook, instance, type) {
  callWithAsyncErrorHandling(
    isArray$1(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
    instance,
    type
  );
}
function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString(raw)) {
    const handler = ctx[raw];
    if (isFunction(handler)) {
      watch(getter, handler);
    }
  } else if (isFunction(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject(raw)) {
    if (isArray$1(raw)) {
      raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
    } else {
      const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction(handler)) {
        watch(getter, handler, raw);
      }
    }
  } else ;
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const {
    mixins: globalMixins,
    optionsCache: cache,
    config: { optionMergeStrategies }
  } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach(
        (m) => mergeOptions$1(resolved, m, optionMergeStrategies, true)
      );
    }
    mergeOptions$1(resolved, base, optionMergeStrategies);
  }
  if (isObject(base)) {
    cache.set(base, resolved);
  }
  return resolved;
}
function mergeOptions$1(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions$1(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach(
      (m) => mergeOptions$1(to, m, strats, true)
    );
  }
  for (const key in from) {
    if (asMixin && key === "expose") ;
    else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeEmitsOrPropsOptions,
  emits: mergeEmitsOrPropsOptions,
  // objects
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  // lifecycle
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  // assets
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  // watch
  watch: mergeWatchOptions,
  // provide / inject
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(
      isFunction(to) ? to.call(this, this) : to,
      isFunction(from) ? from.call(this, this) : from
    );
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray$1(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
}
function mergeEmitsOrPropsOptions(to, from) {
  if (to) {
    if (isArray$1(to) && isArray$1(from)) {
      return [.../* @__PURE__ */ new Set([...to, ...from])];
    }
    return extend(
      /* @__PURE__ */ Object.create(null),
      normalizePropsOrEmits(to),
      normalizePropsOrEmits(from != null ? from : {})
    );
  } else {
    return from;
  }
}
function mergeWatchOptions(to, from) {
  if (!to) return from;
  if (!from) return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key]);
  }
  return merged;
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction(rootComponent)) {
      rootComponent = extend({}, rootComponent);
    }
    if (rootProps != null && !isObject(rootProps)) {
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new WeakSet();
    let isMounted = false;
    const app2 = context.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v) {
      },
      use(plugin, ...options) {
        if (installedPlugins.has(plugin)) ;
        else if (plugin && isFunction(plugin.install)) {
          installedPlugins.add(plugin);
          plugin.install(app2, ...options);
        } else if (isFunction(plugin)) {
          installedPlugins.add(plugin);
          plugin(app2, ...options);
        } else ;
        return app2;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          }
        }
        return app2;
      },
      component(name, component) {
        if (!component) {
          return context.components[name];
        }
        context.components[name] = component;
        return app2;
      },
      directive(name, directive) {
        if (!directive) {
          return context.directives[name];
        }
        context.directives[name] = directive;
        return app2;
      },
      mount(rootContainer, isHydrate, namespace) {
        if (!isMounted) {
          const vnode = createVNode(rootComponent, rootProps);
          vnode.appContext = context;
          if (namespace === true) {
            namespace = "svg";
          } else if (namespace === false) {
            namespace = void 0;
          }
          if (isHydrate && hydrate) {
            hydrate(vnode, rootContainer);
          } else {
            render(vnode, rootContainer, namespace);
          }
          isMounted = true;
          app2._container = rootContainer;
          rootContainer.__vue_app__ = app2;
          return getComponentPublicInstance(vnode.component);
        }
      },
      unmount() {
        if (isMounted) {
          render(null, app2._container);
          delete app2._container.__vue_app__;
        }
      },
      provide(key, value) {
        context.provides[key] = value;
        return app2;
      },
      runWithContext(fn) {
        const lastApp = currentApp;
        currentApp = app2;
        try {
          return fn();
        } finally {
          currentApp = lastApp;
        }
      }
    };
    return app2;
  };
}
let currentApp = null;
function provide(key, value) {
  if (!currentInstance) ;
  else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance || currentApp) {
    const provides = currentApp ? currentApp._context.provides : instance ? instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : void 0;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
    } else ;
  }
}
function hasInjectionContext() {
  return !!(currentInstance || currentRenderingInstance || currentApp);
}
const internalObjectProto = {};
const createInternalObject = () => Object.create(internalObjectProto);
const isInternalObject = (obj) => Object.getPrototypeOf(obj) === internalObjectProto;
function initProps(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = createInternalObject();
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  if (isStateful) {
    instance.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const {
    props,
    attrs,
    vnode: { patchFlag }
  } = instance;
  const rawCurrentProps = toRaw(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (optimized || patchFlag > 0) && !(patchFlag & 16)
  ) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options) {
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue(
              options,
              rawCurrentProps,
              camelizedKey,
              value,
              instance,
              false
            );
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || // for camelCase
      !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && // for camelCase
          (rawPrevProps[key] !== void 0 || // for kebab-case
          rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue(
              options,
              rawCurrentProps,
              key,
              void 0,
              instance,
              true
            );
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance.attrs, "set", "");
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue(
        options,
        rawCurrentProps,
        key,
        castValues[key],
        instance,
        !hasOwn(castValues, key)
      );
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          const reset = setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(
            null,
            props
          );
          reset();
        }
      } else {
        value = defaultValue;
      }
    }
    if (opt[
      0
      /* shouldCast */
    ]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[
        1
        /* shouldCastTrue */
      ] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
const mixinPropsCache = /* @__PURE__ */ new WeakMap();
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = asMixin ? mixinPropsCache : appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys) needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, EMPTY_ARR);
    }
    return EMPTY_ARR;
  }
  if (isArray$1(raw)) {
    for (let i = 0; i < raw.length; i++) {
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray$1(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
        const propType = prop.type;
        let shouldCast = false;
        let shouldCastTrue = true;
        if (isArray$1(propType)) {
          for (let index = 0; index < propType.length; ++index) {
            const type = propType[index];
            const typeName = isFunction(type) && type.name;
            if (typeName === "Boolean") {
              shouldCast = true;
              break;
            } else if (typeName === "String") {
              shouldCastTrue = false;
            }
          }
        } else {
          shouldCast = isFunction(propType) && propType.name === "Boolean";
        }
        prop[
          0
          /* shouldCast */
        ] = shouldCast;
        prop[
          1
          /* shouldCastTrue */
        ] = shouldCastTrue;
        if (shouldCast || hasOwn(prop, "default")) {
          needCastKeys.push(normalizedKey);
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  if (isObject(comp)) {
    cache.set(comp, res);
  }
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$" && !isReservedProp(key)) {
    return true;
  }
  return false;
}
const isInternalKey = (key) => key[0] === "_" || key === "$stable";
const normalizeSlotValue = (value) => isArray$1(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
const normalizeSlot$1 = (key, rawSlot, ctx) => {
  if (rawSlot._n) {
    return rawSlot;
  }
  const normalized = withCtx((...args) => {
    if (false) ;
    return normalizeSlotValue(rawSlot(...args));
  }, ctx);
  normalized._c = false;
  return normalized;
};
const normalizeObjectSlots = (rawSlots, slots, instance) => {
  const ctx = rawSlots._ctx;
  for (const key in rawSlots) {
    if (isInternalKey(key)) continue;
    const value = rawSlots[key];
    if (isFunction(value)) {
      slots[key] = normalizeSlot$1(key, value, ctx);
    } else if (value != null) {
      const normalized = normalizeSlotValue(value);
      slots[key] = () => normalized;
    }
  }
};
const normalizeVNodeSlots = (instance, children) => {
  const normalized = normalizeSlotValue(children);
  instance.slots.default = () => normalized;
};
const assignSlots = (slots, children, optimized) => {
  for (const key in children) {
    if (optimized || key !== "_") {
      slots[key] = children[key];
    }
  }
};
const initSlots = (instance, children, optimized) => {
  const slots = instance.slots = createInternalObject();
  if (instance.vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      assignSlots(slots, children, optimized);
      if (optimized) {
        def(slots, "_", type, true);
      }
    } else {
      normalizeObjectSlots(children, slots);
    }
  } else if (children) {
    normalizeVNodeSlots(instance, children);
  }
};
const updateSlots = (instance, children, optimized) => {
  const { vnode, slots } = instance;
  let needDeletionCheck = true;
  let deletionComparisonTarget = EMPTY_OBJ;
  if (vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      if (optimized && type === 1) {
        needDeletionCheck = false;
      } else {
        assignSlots(slots, children, optimized);
      }
    } else {
      needDeletionCheck = !children.$stable;
      normalizeObjectSlots(children, slots);
    }
    deletionComparisonTarget = children;
  } else if (children) {
    normalizeVNodeSlots(instance, children);
    deletionComparisonTarget = { default: 1 };
  }
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && deletionComparisonTarget[key] == null) {
        delete slots[key];
      }
    }
  }
};
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
  if (isArray$1(rawRef)) {
    rawRef.forEach(
      (r, i) => setRef(
        r,
        oldRawRef && (isArray$1(oldRawRef) ? oldRawRef[i] : oldRawRef),
        parentSuspense,
        vnode,
        isUnmount
      )
    );
    return;
  }
  if (isAsyncWrapper(vnode) && !isUnmount) {
    return;
  }
  const refValue = vnode.shapeFlag & 4 ? getComponentPublicInstance(vnode.component) : vnode.el;
  const value = isUnmount ? null : refValue;
  const { i: owner, r: ref3 } = rawRef;
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  if (oldRef != null && oldRef !== ref3) {
    if (isString(oldRef)) {
      refs[oldRef] = null;
      if (hasOwn(setupState, oldRef)) {
        setupState[oldRef] = null;
      }
    } else if (isRef(oldRef)) {
      oldRef.value = null;
    }
  }
  if (isFunction(ref3)) {
    callWithErrorHandling(ref3, owner, 12, [value, refs]);
  } else {
    const _isString = isString(ref3);
    const _isRef = isRef(ref3);
    if (_isString || _isRef) {
      const doSet = () => {
        if (rawRef.f) {
          const existing = _isString ? hasOwn(setupState, ref3) ? setupState[ref3] : refs[ref3] : ref3.value;
          if (isUnmount) {
            isArray$1(existing) && remove(existing, refValue);
          } else {
            if (!isArray$1(existing)) {
              if (_isString) {
                refs[ref3] = [refValue];
                if (hasOwn(setupState, ref3)) {
                  setupState[ref3] = refs[ref3];
                }
              } else {
                ref3.value = [refValue];
                if (rawRef.k) refs[rawRef.k] = ref3.value;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          }
        } else if (_isString) {
          refs[ref3] = value;
          if (hasOwn(setupState, ref3)) {
            setupState[ref3] = value;
          }
        } else if (_isRef) {
          ref3.value = value;
          if (rawRef.k) refs[rawRef.k] = value;
        } else ;
      };
      if (value) {
        doSet.id = -1;
        queuePostRenderEffect(doSet, parentSuspense);
      } else {
        doSet();
      }
    }
  }
}
const TeleportEndKey = Symbol("_vte");
const isTeleport = (type) => type.__isTeleport;
const queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options) {
  return baseCreateRenderer(options);
}
function baseCreateRenderer(options, createHydrationFns) {
  const target = getGlobalThis();
  target.__VUE__ = true;
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    setScopeId: hostSetScopeId = NOOP,
    insertStaticContent: hostInsertStaticContent
  } = options;
  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1);
      unmount(n1, parentComponent, parentSuspense, true);
      n1 = null;
    }
    if (n2.patchFlag === -2) {
      optimized = false;
      n2.dynamicChildren = null;
    }
    const { type, ref: ref3, shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container, anchor);
        break;
      case Comment:
        processCommentNode(n1, n2, container, anchor);
        break;
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, namespace);
        }
        break;
      case Fragment:
        processFragment(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        break;
      default:
        if (shapeFlag & 1) {
          processElement(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 6) {
          processComponent(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 64) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals
          );
        } else if (shapeFlag & 128) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals
          );
        } else ;
    }
    if (ref3 != null && parentComponent) {
      setRef(ref3, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
    }
  };
  const processText = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateText(n2.children),
        container,
        anchor
      );
    } else {
      const el = n2.el = n1.el;
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  const processCommentNode = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateComment(n2.children || ""),
        container,
        anchor
      );
    } else {
      n2.el = n1.el;
    }
  };
  const mountStaticNode = (n2, container, anchor, namespace) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(
      n2.children,
      container,
      anchor,
      namespace,
      n2.el,
      n2.anchor
    );
  };
  const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostInsert(el, container, nextSibling);
      el = next;
    }
    hostInsert(anchor, container, nextSibling);
  };
  const removeStaticNode = ({ el, anchor }) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostRemove(el);
      el = next;
    }
    hostRemove(anchor);
  };
  const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    if (n2.type === "svg") {
      namespace = "svg";
    } else if (n2.type === "math") {
      namespace = "mathml";
    }
    if (n1 == null) {
      mountElement(
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    } else {
      patchElement(
        n1,
        n2,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
  };
  const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    let el;
    let vnodeHook;
    const { props, shapeFlag, transition, dirs } = vnode;
    el = vnode.el = hostCreateElement(
      vnode.type,
      namespace,
      props && props.is,
      props
    );
    if (shapeFlag & 8) {
      hostSetElementText(el, vnode.children);
    } else if (shapeFlag & 16) {
      mountChildren(
        vnode.children,
        el,
        null,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(vnode, namespace),
        slotScopeIds,
        optimized
      );
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "created");
    }
    setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
    if (props) {
      for (const key in props) {
        if (key !== "value" && !isReservedProp(key)) {
          hostPatchProp(el, key, null, props[key], namespace, parentComponent);
        }
      }
      if ("value" in props) {
        hostPatchProp(el, "value", null, props.value, namespace);
      }
      if (vnodeHook = props.onVnodeBeforeMount) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
    }
    const needCallTransitionHooks = needTransition(parentSuspense, transition);
    if (needCallTransitionHooks) {
      transition.beforeEnter(el);
    }
    hostInsert(el, container, anchor);
    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        needCallTransitionHooks && transition.enter(el);
        dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
      }, parentSuspense);
    }
  };
  const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el, scopeId);
    }
    if (slotScopeIds) {
      for (let i = 0; i < slotScopeIds.length; i++) {
        hostSetScopeId(el, slotScopeIds[i]);
      }
    }
    if (parentComponent) {
      let subTree = parentComponent.subTree;
      if (vnode === subTree) {
        const parentVNode = parentComponent.vnode;
        setScopeId(
          el,
          parentVNode,
          parentVNode.scopeId,
          parentVNode.slotScopeIds,
          parentComponent.parent
        );
      }
    }
  };
  const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
    for (let i = start; i < children.length; i++) {
      const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
      patch(
        null,
        child,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
  };
  const patchElement = (n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    const el = n2.el = n1.el;
    let { patchFlag, dynamicChildren, dirs } = n2;
    patchFlag |= n1.patchFlag & 16;
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    let vnodeHook;
    parentComponent && toggleRecurse(parentComponent, false);
    if (vnodeHook = newProps.onVnodeBeforeUpdate) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
    }
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
    }
    parentComponent && toggleRecurse(parentComponent, true);
    if (oldProps.innerHTML && newProps.innerHTML == null || oldProps.textContent && newProps.textContent == null) {
      hostSetElementText(el, "");
    }
    if (dynamicChildren) {
      patchBlockChildren(
        n1.dynamicChildren,
        dynamicChildren,
        el,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace),
        slotScopeIds
      );
    } else if (!optimized) {
      patchChildren(
        n1,
        n2,
        el,
        null,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace),
        slotScopeIds,
        false
      );
    }
    if (patchFlag > 0) {
      if (patchFlag & 16) {
        patchProps(el, oldProps, newProps, parentComponent, namespace);
      } else {
        if (patchFlag & 2) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el, "class", null, newProps.class, namespace);
          }
        }
        if (patchFlag & 4) {
          hostPatchProp(el, "style", oldProps.style, newProps.style, namespace);
        }
        if (patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i];
            const prev = oldProps[key];
            const next = newProps[key];
            if (next !== prev || key === "value") {
              hostPatchProp(el, key, prev, next, namespace, parentComponent);
            }
          }
        }
      }
      if (patchFlag & 1) {
        if (n1.children !== n2.children) {
          hostSetElementText(el, n2.children);
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      patchProps(el, oldProps, newProps, parentComponent, namespace);
    }
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }
  };
  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
    for (let i = 0; i < newChildren.length; i++) {
      const oldVNode = oldChildren[i];
      const newVNode = newChildren[i];
      const container = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
        oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          fallbackContainer
        )
      );
      patch(
        oldVNode,
        newVNode,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        true
      );
    }
  };
  const patchProps = (el, oldProps, newProps, parentComponent, namespace) => {
    if (oldProps !== newProps) {
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(
              el,
              key,
              oldProps[key],
              null,
              namespace,
              parentComponent
            );
          }
        }
      }
      for (const key in newProps) {
        if (isReservedProp(key)) continue;
        const next = newProps[key];
        const prev = oldProps[key];
        if (next !== prev && key !== "value") {
          hostPatchProp(el, key, prev, next, namespace, parentComponent);
        }
      }
      if ("value" in newProps) {
        hostPatchProp(el, "value", oldProps.value, newProps.value, namespace);
      }
    }
  };
  const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
    let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    if (n1 == null) {
      hostInsert(fragmentStartAnchor, container, anchor);
      hostInsert(fragmentEndAnchor, container, anchor);
      mountChildren(
        // #10007
        // such fragment like `<></>` will be compiled into
        // a fragment which doesn't have a children.
        // In this case fallback to an empty array
        n2.children || [],
        container,
        fragmentEndAnchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    } else {
      if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
      // of renderSlot() with no valid children
      n1.dynamicChildren) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          container,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds
        );
        if (
          // #2080 if the stable fragment has a key, it's a <template v-for> that may
          //  get moved around. Make sure all root level vnodes inherit el.
          // #2134 or if it's a component root, it may also get moved around
          // as the component is being moved.
          n2.key != null || parentComponent && n2 === parentComponent.subTree
        ) {
          traverseStaticChildren(
            n1,
            n2,
            true
            /* shallow */
          );
        }
      } else {
        patchChildren(
          n1,
          n2,
          container,
          fragmentEndAnchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
    }
  };
  const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;
    if (n1 == null) {
      if (n2.shapeFlag & 512) {
        parentComponent.ctx.activate(
          n2,
          container,
          anchor,
          namespace,
          optimized
        );
      } else {
        mountComponent(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          optimized
        );
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };
  const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace, optimized) => {
    const instance = initialVNode.component = createComponentInstance(
      initialVNode,
      parentComponent,
      parentSuspense
    );
    if (isKeepAlive(initialVNode)) {
      instance.ctx.renderer = internals;
    }
    {
      setupComponent(instance, false, optimized);
    }
    if (instance.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect, optimized);
      if (!initialVNode.el) {
        const placeholder = instance.subTree = createVNode(Comment);
        processCommentNode(null, placeholder, container, anchor);
      }
    } else {
      setupRenderEffect(
        instance,
        initialVNode,
        container,
        anchor,
        parentSuspense,
        namespace,
        optimized
      );
    }
  };
  const updateComponent = (n1, n2, optimized) => {
    const instance = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance.asyncDep && !instance.asyncResolved) {
        updateComponentPreRender(instance, n2, optimized);
        return;
      } else {
        instance.next = n2;
        invalidateJob(instance.update);
        instance.effect.dirty = true;
        instance.update();
      }
    } else {
      n2.el = n1.el;
      instance.vnode = n2;
    }
  };
  const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, namespace, optimized) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        let vnodeHook;
        const { el, props } = initialVNode;
        const { bm, m, parent } = instance;
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
        toggleRecurse(instance, false);
        if (bm) {
          invokeArrayFns(bm);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
          invokeVNodeHook(vnodeHook, parent, initialVNode);
        }
        toggleRecurse(instance, true);
        if (el && hydrateNode) {
          const hydrateSubTree = () => {
            instance.subTree = renderComponentRoot(instance);
            hydrateNode(
              el,
              instance.subTree,
              instance,
              parentSuspense,
              null
            );
          };
          if (isAsyncWrapperVNode) {
            initialVNode.type.__asyncLoader().then(
              // note: we are moving the render call into an async callback,
              // which means it won't track dependencies - but it's ok because
              // a server-rendered async wrapper is already in resolved state
              // and it will never need to change.
              () => !instance.isUnmounted && hydrateSubTree()
            );
          } else {
            hydrateSubTree();
          }
        } else {
          const subTree = instance.subTree = renderComponentRoot(instance);
          patch(
            null,
            subTree,
            container,
            anchor,
            instance,
            parentSuspense,
            namespace
          );
          initialVNode.el = subTree.el;
        }
        if (m) {
          queuePostRenderEffect(m, parentSuspense);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode),
            parentSuspense
          );
        }
        if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
          instance.a && queuePostRenderEffect(instance.a, parentSuspense);
        }
        instance.isMounted = true;
        initialVNode = container = anchor = null;
      } else {
        let { next, bu, u, parent, vnode } = instance;
        {
          const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance);
          if (nonHydratedAsyncRoot) {
            if (next) {
              next.el = vnode.el;
              updateComponentPreRender(instance, next, optimized);
            }
            nonHydratedAsyncRoot.asyncDep.then(() => {
              if (!instance.isUnmounted) {
                componentUpdateFn();
              }
            });
            return;
          }
        }
        let originNext = next;
        let vnodeHook;
        toggleRecurse(instance, false);
        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance, next, optimized);
        } else {
          next = vnode;
        }
        if (bu) {
          invokeArrayFns(bu);
        }
        if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent, next, vnode);
        }
        toggleRecurse(instance, true);
        const nextTree = renderComponentRoot(instance);
        const prevTree = instance.subTree;
        instance.subTree = nextTree;
        patch(
          prevTree,
          nextTree,
          // parent may have changed if it's in a teleport
          hostParentNode(prevTree.el),
          // anchor may have changed if it's in a fragment
          getNextHostNode(prevTree),
          instance,
          parentSuspense,
          namespace
        );
        next.el = nextTree.el;
        if (originNext === null) {
          updateHOCHostEl(instance, nextTree.el);
        }
        if (u) {
          queuePostRenderEffect(u, parentSuspense);
        }
        if (vnodeHook = next.props && next.props.onVnodeUpdated) {
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, next, vnode),
            parentSuspense
          );
        }
      }
    };
    const effect2 = instance.effect = new ReactiveEffect(
      componentUpdateFn,
      NOOP,
      () => queueJob(update),
      instance.scope
      // track it in component's effect scope
    );
    const update = instance.update = () => {
      if (effect2.dirty) {
        effect2.run();
      }
    };
    update.i = instance;
    update.id = instance.uid;
    toggleRecurse(instance, true);
    update();
  };
  const updateComponentPreRender = (instance, nextVNode, optimized) => {
    nextVNode.component = instance;
    const prevProps = instance.vnode.props;
    instance.vnode = nextVNode;
    instance.next = null;
    updateProps(instance, nextVNode.props, prevProps, optimized);
    updateSlots(instance, nextVNode.children, optimized);
    pauseTracking();
    flushPreFlushCbs(instance);
    resetTracking();
  };
  const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const { patchFlag, shapeFlag } = n2;
    if (patchFlag > 0) {
      if (patchFlag & 128) {
        patchKeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        return;
      } else if (patchFlag & 256) {
        patchUnkeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        return;
      }
    }
    if (shapeFlag & 8) {
      if (prevShapeFlag & 16) {
        unmountChildren(c1, parentComponent, parentSuspense);
      }
      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & 16) {
        if (shapeFlag & 16) {
          patchKeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          unmountChildren(c1, parentComponent, parentSuspense, true);
        }
      } else {
        if (prevShapeFlag & 8) {
          hostSetElementText(container, "");
        }
        if (shapeFlag & 16) {
          mountChildren(
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        }
      }
    }
  };
  const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    c1 = c1 || EMPTY_ARR;
    c2 = c2 || EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i;
    for (i = 0; i < commonLength; i++) {
      const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      patch(
        c1[i],
        nextChild,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
    if (oldLength > newLength) {
      unmountChildren(
        c1,
        parentComponent,
        parentSuspense,
        true,
        false,
        commonLength
      );
    } else {
      mountChildren(
        c2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized,
        commonLength
      );
    }
  };
  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while (i <= e2) {
          patch(
            null,
            c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]),
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          i++;
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true);
        i++;
      }
    } else {
      const s1 = i;
      const s2 = i;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (i = s2; i <= e2; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (nextChild.key != null) {
          keyToNewIndexMap.set(nextChild.key, i);
        }
      }
      let j;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      let maxNewIndexSoFar = 0;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          unmount(prevChild, parentComponent, parentSuspense, true);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (j = s2; j <= e2; j++) {
            if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          unmount(prevChild, parentComponent, parentSuspense, true);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          patch(
            prevChild,
            c2[newIndex],
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          patched++;
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
      j = increasingNewIndexSequence.length - 1;
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
        if (newIndexToOldIndexMap[i] === 0) {
          patch(
            null,
            nextChild,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor, 2);
          } else {
            j--;
          }
        }
      }
    }
  };
  const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
    const { el, type, transition, children, shapeFlag } = vnode;
    if (shapeFlag & 6) {
      move(vnode.component.subTree, container, anchor, moveType);
      return;
    }
    if (shapeFlag & 128) {
      vnode.suspense.move(container, anchor, moveType);
      return;
    }
    if (shapeFlag & 64) {
      type.move(vnode, container, anchor, internals);
      return;
    }
    if (type === Fragment) {
      hostInsert(el, container, anchor);
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, anchor, moveType);
      }
      hostInsert(vnode.anchor, container, anchor);
      return;
    }
    if (type === Static) {
      moveStaticNode(vnode, container, anchor);
      return;
    }
    const needTransition2 = moveType !== 2 && shapeFlag & 1 && transition;
    if (needTransition2) {
      if (moveType === 0) {
        transition.beforeEnter(el);
        hostInsert(el, container, anchor);
        queuePostRenderEffect(() => transition.enter(el), parentSuspense);
      } else {
        const { leave, delayLeave, afterLeave } = transition;
        const remove22 = () => hostInsert(el, container, anchor);
        const performLeave = () => {
          leave(el, () => {
            remove22();
            afterLeave && afterLeave();
          });
        };
        if (delayLeave) {
          delayLeave(el, remove22, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el, container, anchor);
    }
  };
  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const {
      type,
      props,
      ref: ref3,
      children,
      dynamicChildren,
      shapeFlag,
      patchFlag,
      dirs,
      cacheIndex
    } = vnode;
    if (patchFlag === -2) {
      optimized = false;
    }
    if (ref3 != null) {
      setRef(ref3, null, parentSuspense, vnode, true);
    }
    if (cacheIndex != null) {
      parentComponent.renderCache[cacheIndex] = void 0;
    }
    if (shapeFlag & 256) {
      parentComponent.ctx.deactivate(vnode);
      return;
    }
    const shouldInvokeDirs = shapeFlag & 1 && dirs;
    const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
    let vnodeHook;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode);
    }
    if (shapeFlag & 6) {
      unmountComponent(vnode.component, parentSuspense, doRemove);
    } else {
      if (shapeFlag & 128) {
        vnode.suspense.unmount(parentSuspense, doRemove);
        return;
      }
      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
      }
      if (shapeFlag & 64) {
        vnode.type.remove(
          vnode,
          parentComponent,
          parentSuspense,
          internals,
          doRemove
        );
      } else if (dynamicChildren && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !dynamicChildren.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
        unmountChildren(
          dynamicChildren,
          parentComponent,
          parentSuspense,
          false,
          true
        );
      } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
        unmountChildren(children, parentComponent, parentSuspense);
      }
      if (doRemove) {
        remove2(vnode);
      }
    }
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
      }, parentSuspense);
    }
  };
  const remove2 = (vnode) => {
    const { type, el, anchor, transition } = vnode;
    if (type === Fragment) {
      {
        removeFragment(el, anchor);
      }
      return;
    }
    if (type === Static) {
      removeStaticNode(vnode);
      return;
    }
    const performRemove = () => {
      hostRemove(el);
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };
    if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
      const { leave, delayLeave } = transition;
      const performLeave = () => leave(el, performRemove);
      if (delayLeave) {
        delayLeave(vnode.el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };
  const removeFragment = (cur, end) => {
    let next;
    while (cur !== end) {
      next = hostNextSibling(cur);
      hostRemove(cur);
      cur = next;
    }
    hostRemove(end);
  };
  const unmountComponent = (instance, parentSuspense, doRemove) => {
    const { bum, scope, update, subTree, um, m, a: a2 } = instance;
    invalidateMount(m);
    invalidateMount(a2);
    if (bum) {
      invokeArrayFns(bum);
    }
    scope.stop();
    if (update) {
      update.active = false;
      unmount(subTree, instance, parentSuspense, doRemove);
    }
    if (um) {
      queuePostRenderEffect(um, parentSuspense);
    }
    queuePostRenderEffect(() => {
      instance.isUnmounted = true;
    }, parentSuspense);
    if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
      parentSuspense.deps--;
      if (parentSuspense.deps === 0) {
        parentSuspense.resolve();
      }
    }
  };
  const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
    for (let i = start; i < children.length; i++) {
      unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
    }
  };
  const getNextHostNode = (vnode) => {
    if (vnode.shapeFlag & 6) {
      return getNextHostNode(vnode.component.subTree);
    }
    if (vnode.shapeFlag & 128) {
      return vnode.suspense.next();
    }
    const el = hostNextSibling(vnode.anchor || vnode.el);
    const teleportEnd = el && el[TeleportEndKey];
    return teleportEnd ? hostNextSibling(teleportEnd) : el;
  };
  let isFlushing2 = false;
  const render = (vnode, container, namespace) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true);
      }
    } else {
      patch(
        container._vnode || null,
        vnode,
        container,
        null,
        null,
        null,
        namespace
      );
    }
    container._vnode = vnode;
    if (!isFlushing2) {
      isFlushing2 = true;
      flushPreFlushCbs();
      flushPostFlushCbs();
      isFlushing2 = false;
    }
  };
  const internals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove2,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options
  };
  let hydrate;
  let hydrateNode;
  return {
    render,
    hydrate,
    createApp: createAppAPI(render, hydrate)
  };
}
function resolveChildrenNamespace({ type, props }, currentNamespace) {
  return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
}
function toggleRecurse({ effect: effect2, update }, allowed) {
  effect2.allowRecurse = update.allowRecurse = allowed;
}
function needTransition(parentSuspense, transition) {
  return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
}
function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;
  if (isArray$1(ch1) && isArray$1(ch2)) {
    for (let i = 0; i < ch1.length; i++) {
      const c1 = ch1[i];
      let c2 = ch2[i];
      if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
          c2 = ch2[i] = cloneIfMounted(ch2[i]);
          c2.el = c1.el;
        }
        if (!shallow && c2.patchFlag !== -2)
          traverseStaticChildren(c1, c2);
      }
      if (c2.type === Text) {
        c2.el = c1.el;
      }
    }
  }
}
function getSequence(arr) {
  const p2 = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p2[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = u + v >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p2[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p2[v];
  }
  return result;
}
function locateNonHydratedAsyncRoot(instance) {
  const subComponent = instance.subTree.component;
  if (subComponent) {
    if (subComponent.asyncDep && !subComponent.asyncResolved) {
      return subComponent;
    } else {
      return locateNonHydratedAsyncRoot(subComponent);
    }
  }
}
function invalidateMount(hooks) {
  if (hooks) {
    for (let i = 0; i < hooks.length; i++) hooks[i].active = false;
  }
}
const ssrContextKey = Symbol.for("v-scx");
const useSSRContext = () => {
  {
    const ctx = inject(ssrContextKey);
    return ctx;
  }
};
function watchSyncEffect(effect2, options) {
  return doWatch(
    effect2,
    null,
    { flush: "sync" }
  );
}
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb, options) {
  return doWatch(source, cb, options);
}
function doWatch(source, cb, {
  immediate,
  deep,
  flush,
  once,
  onTrack,
  onTrigger
} = EMPTY_OBJ) {
  if (cb && once) {
    const _cb = cb;
    cb = (...args) => {
      _cb(...args);
      unwatch();
    };
  }
  const instance = currentInstance;
  const reactiveGetter = (source2) => deep === true ? source2 : (
    // for deep: false, only traverse root-level properties
    traverse(source2, deep === false ? 1 : void 0)
  );
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => reactiveGetter(source);
    forceTrigger = true;
  } else if (isArray$1(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
    getter = () => source.map((s) => {
      if (isRef(s)) {
        return s.value;
      } else if (isReactive(s)) {
        return reactiveGetter(s);
      } else if (isFunction(s)) {
        return callWithErrorHandling(s, instance, 2);
      } else ;
    });
  } else if (isFunction(source)) {
    if (cb) {
      getter = () => callWithErrorHandling(source, instance, 2);
    } else {
      getter = () => {
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(
          source,
          instance,
          3,
          [onCleanup]
        );
      };
    }
  } else {
    getter = NOOP;
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onCleanup = (fn) => {
    cleanup = effect2.onStop = () => {
      callWithErrorHandling(fn, instance, 4);
      cleanup = effect2.onStop = void 0;
    };
  };
  let ssrCleanup;
  if (isInSSRComponentSetup) {
    onCleanup = NOOP;
    if (!cb) {
      getter();
    } else if (immediate) {
      callWithAsyncErrorHandling(cb, instance, 3, [
        getter(),
        isMultiSource ? [] : void 0,
        onCleanup
      ]);
    }
    if (flush === "sync") {
      const ctx = useSSRContext();
      ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
    } else {
      return NOOP;
    }
  }
  let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect2.active || !effect2.dirty) {
      return;
    }
    if (cb) {
      const newValue = effect2.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          // pass undefined as the old value when it's changed for the first time
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
          onCleanup
        ]);
        oldValue = newValue;
      }
    } else {
      effect2.run();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
  } else {
    job.pre = true;
    if (instance) job.id = instance.uid;
    scheduler = () => queueJob(job);
  }
  const effect2 = new ReactiveEffect(getter, NOOP, scheduler);
  const scope = getCurrentScope();
  const unwatch = () => {
    effect2.stop();
    if (scope) {
      remove(scope.effects, effect2);
    }
  };
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect2.run();
    }
  } else if (flush === "post") {
    queuePostRenderEffect(
      effect2.run.bind(effect2),
      instance && instance.suspense
    );
  } else {
    effect2.run();
  }
  if (ssrCleanup) ssrCleanup.push(unwatch);
  return unwatch;
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const reset = setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  reset();
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
function traverse(value, depth = Infinity, seen) {
  if (depth <= 0 || !isObject(value) || value["__v_skip"]) {
    return value;
  }
  seen = seen || /* @__PURE__ */ new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  depth--;
  if (isRef(value)) {
    traverse(value.value, depth, seen);
  } else if (isArray$1(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], depth, seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, depth, seen);
    });
  } else if (isPlainObject$1(value)) {
    for (const key in value) {
      traverse(value[key], depth, seen);
    }
    for (const key of Object.getOwnPropertySymbols(value)) {
      if (Object.prototype.propertyIsEnumerable.call(value, key)) {
        traverse(value[key], depth, seen);
      }
    }
  }
  return value;
}
function useModel(props, name, options = EMPTY_OBJ) {
  const i = getCurrentInstance();
  const camelizedName = camelize(name);
  const hyphenatedName = hyphenate(name);
  const modifiers = getModelModifiers(props, name);
  const res = customRef((track2, trigger2) => {
    let localValue;
    let prevSetValue = EMPTY_OBJ;
    let prevEmittedValue;
    watchSyncEffect(() => {
      const propValue = props[name];
      if (hasChanged(localValue, propValue)) {
        localValue = propValue;
        trigger2();
      }
    });
    return {
      get() {
        track2();
        return options.get ? options.get(localValue) : localValue;
      },
      set(value) {
        const emittedValue = options.set ? options.set(value) : value;
        if (!hasChanged(emittedValue, localValue) && !(prevSetValue !== EMPTY_OBJ && hasChanged(value, prevSetValue))) {
          return;
        }
        const rawProps = i.vnode.props;
        if (!(rawProps && // check if parent has passed v-model
        (name in rawProps || camelizedName in rawProps || hyphenatedName in rawProps) && (`onUpdate:${name}` in rawProps || `onUpdate:${camelizedName}` in rawProps || `onUpdate:${hyphenatedName}` in rawProps))) {
          localValue = value;
          trigger2();
        }
        i.emit(`update:${name}`, emittedValue);
        if (hasChanged(value, emittedValue) && hasChanged(value, prevSetValue) && !hasChanged(emittedValue, prevEmittedValue)) {
          trigger2();
        }
        prevSetValue = value;
        prevEmittedValue = emittedValue;
      }
    };
  });
  res[Symbol.iterator] = () => {
    let i2 = 0;
    return {
      next() {
        if (i2 < 2) {
          return { value: i2++ ? modifiers || EMPTY_OBJ : res, done: false };
        } else {
          return { done: true };
        }
      }
    };
  };
  return res;
}
const getModelModifiers = (props, modelName) => {
  return modelName === "modelValue" || modelName === "model-value" ? props.modelModifiers : props[`${modelName}Modifiers`] || props[`${camelize(modelName)}Modifiers`] || props[`${hyphenate(modelName)}Modifiers`];
};
function emit(instance, event, ...rawArgs) {
  if (instance.isUnmounted) return;
  const props = instance.vnode.props || EMPTY_OBJ;
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modifiers = isModelListener2 && getModelModifiers(props, event.slice(7));
  if (modifiers) {
    if (modifiers.trim) {
      args = rawArgs.map((a2) => isString(a2) ? a2.trim() : a2);
    }
    if (modifiers.number) {
      args = rawArgs.map(looseToNumber);
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
  props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(
      handler,
      instance,
      6,
      args
    );
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(
      onceHandler,
      instance,
      6,
      args
    );
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, null);
    }
    return null;
  }
  if (isArray$1(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  if (isObject(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
function markAttrsAccessed() {
}
function renderComponentRoot(instance) {
  const {
    type: Component,
    vnode,
    proxy,
    withProxy,
    propsOptions: [propsOptions],
    slots,
    attrs,
    emit: emit2,
    render,
    renderCache,
    props,
    data,
    setupState,
    ctx,
    inheritAttrs
  } = instance;
  const prev = setCurrentRenderingInstance(instance);
  let result;
  let fallthroughAttrs;
  try {
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      const thisProxy = false ? new Proxy(proxyToUse, {
        get(target, key, receiver) {
          warn$1(
            `Property '${String(
              key
            )}' was accessed via 'this'. Avoid using 'this' in templates.`
          );
          return Reflect.get(target, key, receiver);
        }
      }) : proxyToUse;
      result = normalizeVNode(
        render.call(
          thisProxy,
          proxyToUse,
          renderCache,
          false ? shallowReadonly(props) : props,
          setupState,
          data,
          ctx
        )
      );
      fallthroughAttrs = attrs;
    } else {
      const render2 = Component;
      if (false) ;
      result = normalizeVNode(
        render2.length > 1 ? render2(
          false ? shallowReadonly(props) : props,
          false ? {
            get attrs() {
              markAttrsAccessed();
              return shallowReadonly(attrs);
            },
            slots,
            emit: emit2
          } : { attrs, slots, emit: emit2 }
        ) : render2(
          false ? shallowReadonly(props) : props,
          null
        )
      );
      fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
    }
  } catch (err) {
    blockStack.length = 0;
    handleError(err, instance, 1);
    result = createVNode(Comment);
  }
  let root = result;
  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs);
    const { shapeFlag } = root;
    if (keys.length) {
      if (shapeFlag & (1 | 6)) {
        if (propsOptions && keys.some(isModelListener)) {
          fallthroughAttrs = filterModelListeners(
            fallthroughAttrs,
            propsOptions
          );
        }
        root = cloneVNode(root, fallthroughAttrs, false, true);
      }
    }
  }
  if (vnode.dirs) {
    root = cloneVNode(root, null, false, true);
    root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
  }
  if (vnode.transition) {
    root.transition = vnode.transition;
  }
  {
    result = root;
  }
  setCurrentRenderingInstance(prev);
  return result;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
const filterModelListeners = (attrs, props) => {
  const res = {};
  for (const key in attrs) {
    if (!isModelListener(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key];
    }
  }
  return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const { props: prevProps, children: prevChildren, component } = prevVNode;
  const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
  const emits = component.emitsOptions;
  if (nextVNode.dirs || nextVNode.transition) {
    return true;
  }
  if (optimized && patchFlag >= 0) {
    if (patchFlag & 1024) {
      return true;
    }
    if (patchFlag & 16) {
      if (!prevProps) {
        return !!nextProps;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    } else if (patchFlag & 8) {
      const dynamicProps = nextVNode.dynamicProps;
      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i];
        if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
          return true;
        }
      }
    }
  } else {
    if (prevChildren || nextChildren) {
      if (!nextChildren || !nextChildren.$stable) {
        return true;
      }
    }
    if (prevProps === nextProps) {
      return false;
    }
    if (!prevProps) {
      return !!nextProps;
    }
    if (!nextProps) {
      return true;
    }
    return hasPropsChanged(prevProps, nextProps, emits);
  }
  return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }
  return false;
}
function updateHOCHostEl({ vnode, parent }, el) {
  while (parent) {
    const root = parent.subTree;
    if (root.suspense && root.suspense.activeBranch === vnode) {
      root.el = vnode.el;
    }
    if (root === vnode) {
      (vnode = parent.vnode).el = el;
      parent = parent.parent;
    } else {
      break;
    }
  }
}
const isSuspense = (type) => type.__isSuspense;
function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray$1(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}
const Fragment = Symbol.for("v-fgt");
const Text = Symbol.for("v-txt");
const Comment = Symbol.for("v-cmt");
const Static = Symbol.for("v-stc");
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
}
let isBlockTreeEnabled = 1;
function setBlockTracking(value) {
  isBlockTreeEnabled += value;
  if (value < 0 && currentBlock) {
    currentBlock.hasOnce = true;
  }
}
function setupBlock(vnode) {
  vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
  closeBlock();
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
  return setupBlock(
    createBaseVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      true
    )
  );
}
function createBlock(type, props, children, patchFlag, dynamicProps) {
  return setupBlock(
    createVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      true
    )
  );
}
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({
  ref: ref3,
  ref_key,
  ref_for
}) => {
  if (typeof ref3 === "number") {
    ref3 = "" + ref3;
  }
  return ref3 != null ? isString(ref3) || isRef(ref3) || isFunction(ref3) ? { i: currentRenderingInstance, r: ref3, k: ref_key, f: !!ref_for } : ref3 : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null,
    ctx: currentRenderingInstance
  };
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children);
    if (shapeFlag & 128) {
      type.normalize(vnode);
    }
  } else if (children) {
    vnode.shapeFlag |= isString(children) ? 8 : 16;
  }
  if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
  !isBlockNode && // has current parent block
  currentBlock && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  vnode.patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
const createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    type = Comment;
  }
  if (isVNode(type)) {
    const cloned = cloneVNode(
      type,
      props,
      true
      /* mergeRef: true */
    );
    if (children) {
      normalizeChildren(cloned, children);
    }
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
      if (cloned.shapeFlag & 6) {
        currentBlock[currentBlock.indexOf(type)] = cloned;
      } else {
        currentBlock.push(cloned);
      }
    }
    cloned.patchFlag = -2;
    return cloned;
  }
  if (isClassComponent(type)) {
    type = type.__vccOpts;
  }
  if (props) {
    props = guardReactiveProps(props);
    let { class: klass, style } = props;
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject(style)) {
      if (isProxy(style) && !isArray$1(style)) {
        style = extend({}, style);
      }
      props.style = normalizeStyle(style);
    }
  }
  const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction(type) ? 2 : 0;
  return createBaseVNode(
    type,
    props,
    children,
    patchFlag,
    dynamicProps,
    shapeFlag,
    isBlockNode,
    true
  );
}
function guardReactiveProps(props) {
  if (!props) return null;
  return isProxy(props) || isInternalObject(props) ? extend({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false, cloneTransition = false) {
  const { props, ref: ref3, patchFlag, children, transition } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      mergeRef && ref3 ? isArray$1(ref3) ? ref3.concat(normalizeRef(extraProps)) : [ref3, normalizeRef(extraProps)] : normalizeRef(extraProps)
    ) : ref3,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children,
    target: vnode.target,
    targetStart: vnode.targetStart,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    el: vnode.el,
    anchor: vnode.anchor,
    ctx: vnode.ctx,
    ce: vnode.ce
  };
  if (transition && cloneTransition) {
    setTransitionHooks(
      cloned,
      transition.clone(cloned)
    );
  }
  return cloned;
}
function createTextVNode(text = " ", flag = 0) {
  return createVNode(Text, null, text, flag);
}
function createStaticVNode(content, numberOfNodes) {
  const vnode = createVNode(Static, null, content);
  vnode.staticCount = numberOfNodes;
  return vnode;
}
function createCommentVNode(text = "", asBlock = false) {
  return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
}
function normalizeVNode(child) {
  if (child == null || typeof child === "boolean") {
    return createVNode(Comment);
  } else if (isArray$1(child)) {
    return createVNode(
      Fragment,
      null,
      // #3666, avoid reference pollution when reusing vnode
      child.slice()
    );
  } else if (typeof child === "object") {
    return cloneIfMounted(child);
  } else {
    return createVNode(Text, null, String(child));
  }
}
function cloneIfMounted(child) {
  return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
  let type = 0;
  const { shapeFlag } = vnode;
  if (children == null) {
    children = null;
  } else if (isArray$1(children)) {
    type = 16;
  } else if (typeof children === "object") {
    if (shapeFlag & (1 | 64)) {
      const slot = children.default;
      if (slot) {
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type = 32;
      const slotFlag = children._;
      if (!slotFlag && !isInternalObject(children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.slots._ === 1) {
          children._ = 1;
        } else {
          children._ = 2;
          vnode.patchFlag |= 1024;
        }
      }
    }
  } else if (isFunction(children)) {
    children = { default: children, _ctx: currentRenderingInstance };
    type = 32;
  } else {
    children = String(children);
    if (shapeFlag & 64) {
      type = 16;
      children = [createTextVNode(children)];
    } else {
      type = 8;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type;
}
function mergeProps(...args) {
  const ret = {};
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(isArray$1(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance, 7, [
    vnode,
    prevVNode
  ]);
}
const emptyAppContext = createAppContext();
let uid = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    scope: new EffectScope(
      true
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: EMPTY_OBJ,
    // inheritAttrs
    inheritAttrs: type.inheritAttrs,
    // state
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    // suspense related
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  {
    instance.ctx = { _: instance };
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
let internalSetCurrentInstance;
let setInSSRSetupState;
{
  const g2 = getGlobalThis();
  const registerGlobalSetter = (key, setter) => {
    let setters;
    if (!(setters = g2[key])) setters = g2[key] = [];
    setters.push(setter);
    return (v) => {
      if (setters.length > 1) setters.forEach((set2) => set2(v));
      else setters[0](v);
    };
  };
  internalSetCurrentInstance = registerGlobalSetter(
    `__VUE_INSTANCE_SETTERS__`,
    (v) => currentInstance = v
  );
  setInSSRSetupState = registerGlobalSetter(
    `__VUE_SSR_SETTERS__`,
    (v) => isInSSRComponentSetup = v
  );
}
const setCurrentInstance = (instance) => {
  const prev = currentInstance;
  internalSetCurrentInstance(instance);
  instance.scope.on();
  return () => {
    instance.scope.off();
    internalSetCurrentInstance(prev);
  };
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  internalSetCurrentInstance(null);
};
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false, optimized = false) {
  isSSR && setInSSRSetupState(isSSR);
  const { props, children } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps(instance, props, isStateful, isSSR);
  initSlots(instance, children, optimized);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isSSR && setInSSRSetupState(false);
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component = instance.type;
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
  const { setup } = Component;
  if (setup) {
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    const reset = setCurrentInstance(instance);
    pauseTracking();
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      0,
      [
        instance.props,
        setupContext
      ]
    );
    resetTracking();
    reset();
    if (isPromise(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      if (isSSR) {
        return setupResult.then((resolvedResult) => {
          handleSetupResult(instance, resolvedResult, isSSR);
        }).catch((e) => {
          handleError(e, instance, 0);
        });
      } else {
        instance.asyncDep = setupResult;
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance, isSSR);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction(setupResult)) {
    if (instance.type.__ssrInlineRender) {
      instance.ssrRender = setupResult;
    } else {
      instance.render = setupResult;
    }
  } else if (isObject(setupResult)) {
    instance.setupState = proxyRefs(setupResult);
  } else ;
  finishComponentSetup(instance, isSSR);
}
let compile;
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component = instance.type;
  if (!instance.render) {
    if (!isSSR && compile && !Component.render) {
      const template = Component.template || resolveMergedOptions(instance).template;
      if (template) {
        const { isCustomElement, compilerOptions } = instance.appContext.config;
        const { delimiters, compilerOptions: componentCompilerOptions } = Component;
        const finalCompilerOptions = extend(
          extend(
            {
              isCustomElement,
              delimiters
            },
            compilerOptions
          ),
          componentCompilerOptions
        );
        Component.render = compile(template, finalCompilerOptions);
      }
    }
    instance.render = Component.render || NOOP;
  }
  {
    const reset = setCurrentInstance(instance);
    pauseTracking();
    try {
      applyOptions(instance);
    } finally {
      resetTracking();
      reset();
    }
  }
}
const attrsProxyHandlers = {
  get(target, key) {
    track(target, "get", "");
    return target[key];
  }
};
function createSetupContext(instance) {
  const expose = (exposed) => {
    instance.exposed = exposed || {};
  };
  {
    return {
      attrs: new Proxy(instance.attrs, attrsProxyHandlers),
      slots: instance.slots,
      emit: instance.emit,
      expose
    };
  }
}
function getComponentPublicInstance(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance);
        }
      },
      has(target, key) {
        return key in target || key in publicPropertiesMap;
      }
    }));
  } else {
    return instance.proxy;
  }
}
const classifyRE = /(?:^|[-_])(\w)/g;
const classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
function getComponentName(Component, includeInferred = true) {
  return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
}
function formatComponentName(instance, Component, isRoot = false) {
  let name = getComponentName(Component);
  if (!name && Component.__file) {
    const match = Component.__file.match(/([^/\\]+)\.\w+$/);
    if (match) {
      name = match[1];
    }
  }
  if (!name && instance && instance.parent) {
    const inferFromRegistry = (registry) => {
      for (const key in registry) {
        if (registry[key] === Component) {
          return key;
        }
      }
    };
    name = inferFromRegistry(
      instance.components || instance.parent.type.components
    ) || inferFromRegistry(instance.appContext.components);
  }
  return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}
function isClassComponent(value) {
  return isFunction(value) && "__vccOpts" in value;
}
const computed = (getterOrOptions, debugOptions) => {
  const c = computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
  return c;
};
function h(type, propsOrChildren, children) {
  const l = arguments.length;
  if (l === 2) {
    if (isObject(propsOrChildren) && !isArray$1(propsOrChildren)) {
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren]);
      }
      return createVNode(type, propsOrChildren);
    } else {
      return createVNode(type, null, propsOrChildren);
    }
  } else {
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2);
    } else if (l === 3 && isVNode(children)) {
      children = [children];
    }
    return createVNode(type, propsOrChildren, children);
  }
}
const version = "3.4.38";
/**
* @vue/runtime-dom v3.4.38
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const svgNS = "http://www.w3.org/2000/svg";
const mathmlNS = "http://www.w3.org/1998/Math/MathML";
const doc = typeof document !== "undefined" ? document : null;
const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, namespace, is, props) => {
    const el = namespace === "svg" ? doc.createElementNS(svgNS, tag) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag) : is ? doc.createElement(tag, { is }) : doc.createElement(tag);
    if (tag === "select" && props && props.multiple != null) {
      el.setAttribute("multiple", props.multiple);
    }
    return el;
  },
  createText: (text) => doc.createTextNode(text),
  createComment: (text) => doc.createComment(text),
  setText: (node, text) => {
    node.nodeValue = text;
  },
  setElementText: (el, text) => {
    el.textContent = text;
  },
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling,
  querySelector: (selector) => doc.querySelector(selector),
  setScopeId(el, id) {
    el.setAttribute(id, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(content, parent, anchor, namespace, start, end) {
    const before = anchor ? anchor.previousSibling : parent.lastChild;
    if (start && (start === end || start.nextSibling)) {
      while (true) {
        parent.insertBefore(start.cloneNode(true), anchor);
        if (start === end || !(start = start.nextSibling)) break;
      }
    } else {
      templateContainer.innerHTML = namespace === "svg" ? `<svg>${content}</svg>` : namespace === "mathml" ? `<math>${content}</math>` : content;
      const template = templateContainer.content;
      if (namespace === "svg" || namespace === "mathml") {
        const wrapper = template.firstChild;
        while (wrapper.firstChild) {
          template.appendChild(wrapper.firstChild);
        }
        template.removeChild(wrapper);
      }
      parent.insertBefore(template, anchor);
    }
    return [
      // first
      before ? before.nextSibling : parent.firstChild,
      // last
      anchor ? anchor.previousSibling : parent.lastChild
    ];
  }
};
const vtcKey = Symbol("_vtc");
function patchClass(el, value, isSVG) {
  const transitionClasses = el[vtcKey];
  if (transitionClasses) {
    value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
  }
  if (value == null) {
    el.removeAttribute("class");
  } else if (isSVG) {
    el.setAttribute("class", value);
  } else {
    el.className = value;
  }
}
const vShowOriginalDisplay = Symbol("_vod");
const vShowHidden = Symbol("_vsh");
const CSS_VAR_TEXT = Symbol("");
const displayRE = /(^|;)\s*display\s*:/;
function patchStyle(el, prev, next) {
  const style = el.style;
  const isCssString = isString(next);
  let hasControlledDisplay = false;
  if (next && !isCssString) {
    if (prev) {
      if (!isString(prev)) {
        for (const key in prev) {
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      } else {
        for (const prevStyle of prev.split(";")) {
          const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      }
    }
    for (const key in next) {
      if (key === "display") {
        hasControlledDisplay = true;
      }
      setStyle(style, key, next[key]);
    }
  } else {
    if (isCssString) {
      if (prev !== next) {
        const cssVarText = style[CSS_VAR_TEXT];
        if (cssVarText) {
          next += ";" + cssVarText;
        }
        style.cssText = next;
        hasControlledDisplay = displayRE.test(next);
      }
    } else if (prev) {
      el.removeAttribute("style");
    }
  }
  if (vShowOriginalDisplay in el) {
    el[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "";
    if (el[vShowHidden]) {
      style.display = "none";
    }
  }
}
const importantRE = /\s*!important$/;
function setStyle(style, name, val) {
  if (isArray$1(val)) {
    val.forEach((v) => setStyle(style, name, v));
  } else {
    if (val == null) val = "";
    if (name.startsWith("--")) {
      style.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style, name);
      if (importantRE.test(val)) {
        style.setProperty(
          hyphenate(prefixed),
          val.replace(importantRE, ""),
          "important"
        );
      } else {
        style[prefixed] = val;
      }
    }
  }
}
const prefixes = ["Webkit", "Moz", "ms"];
const prefixCache = {};
function autoPrefix(style, rawName) {
  const cached = prefixCache[rawName];
  if (cached) {
    return cached;
  }
  let name = camelize(rawName);
  if (name !== "filter" && name in style) {
    return prefixCache[rawName] = name;
  }
  name = capitalize(name);
  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name;
    if (prefixed in style) {
      return prefixCache[rawName] = prefixed;
    }
  }
  return rawName;
}
const xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value, isSVG, instance, isBoolean = isSpecialBooleanAttr(key)) {
  if (isSVG && key.startsWith("xlink:")) {
    if (value == null) {
      el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (value == null || isBoolean && !includeBooleanAttr(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(
        key,
        isBoolean ? "" : isSymbol(value) ? String(value) : value
      );
    }
  }
}
function patchDOMProp(el, key, value, parentComponent) {
  if (key === "innerHTML" || key === "textContent") {
    if (value == null) return;
    el[key] = value;
    return;
  }
  const tag = el.tagName;
  if (key === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
  !tag.includes("-")) {
    const oldValue = tag === "OPTION" ? el.getAttribute("value") || "" : el.value;
    const newValue = value == null ? "" : String(value);
    if (oldValue !== newValue || !("_value" in el)) {
      el.value = newValue;
    }
    if (value == null) {
      el.removeAttribute(key);
    }
    el._value = value;
    return;
  }
  let needRemove = false;
  if (value === "" || value == null) {
    const type = typeof el[key];
    if (type === "boolean") {
      value = includeBooleanAttr(value);
    } else if (value == null && type === "string") {
      value = "";
      needRemove = true;
    } else if (type === "number") {
      value = 0;
      needRemove = true;
    }
  }
  try {
    el[key] = value;
  } catch (e) {
  }
  needRemove && el.removeAttribute(key);
}
function addEventListener(el, event, handler, options) {
  el.addEventListener(event, handler, options);
}
function removeEventListener(el, event, handler, options) {
  el.removeEventListener(event, handler, options);
}
const veiKey = Symbol("_vei");
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
  const invokers = el[veiKey] || (el[veiKey] = {});
  const existingInvoker = invokers[rawName];
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue;
  } else {
    const [name, options] = parseName(rawName);
    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(
        nextValue,
        instance
      );
      addEventListener(el, name, invoker, options);
    } else if (existingInvoker) {
      removeEventListener(el, name, existingInvoker, options);
      invokers[rawName] = void 0;
    }
  }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
  let options;
  if (optionsModifierRE.test(name)) {
    options = {};
    let m;
    while (m = name.match(optionsModifierRE)) {
      name = name.slice(0, name.length - m[0].length);
      options[m[0].toLowerCase()] = true;
    }
  }
  const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
  return [event, options];
}
let cachedNow = 0;
const p = /* @__PURE__ */ Promise.resolve();
const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
function createInvoker(initialValue, instance) {
  const invoker = (e) => {
    if (!e._vts) {
      e._vts = Date.now();
    } else if (e._vts <= invoker.attached) {
      return;
    }
    callWithAsyncErrorHandling(
      patchStopImmediatePropagation(e, invoker.value),
      instance,
      5,
      [e]
    );
  };
  invoker.value = initialValue;
  invoker.attached = getNow();
  return invoker;
}
function patchStopImmediatePropagation(e, value) {
  if (isArray$1(value)) {
    const originalStop = e.stopImmediatePropagation;
    e.stopImmediatePropagation = () => {
      originalStop.call(e);
      e._stopped = true;
    };
    return value.map(
      (fn) => (e2) => !e2._stopped && fn && fn(e2)
    );
  } else {
    return value;
  }
}
const isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // lowercase letter
key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
const patchProp = (el, key, prevValue, nextValue, namespace, parentComponent) => {
  const isSVG = namespace === "svg";
  if (key === "class") {
    patchClass(el, nextValue, isSVG);
  } else if (key === "style") {
    patchStyle(el, prevValue, nextValue);
  } else if (isOn(key)) {
    if (!isModelListener(key)) {
      patchEvent(el, key, prevValue, nextValue, parentComponent);
    }
  } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
    patchDOMProp(el, key, nextValue);
    if (!el.tagName.includes("-") && (key === "value" || key === "checked" || key === "selected")) {
      patchAttr(el, key, nextValue, isSVG, parentComponent, key !== "value");
    }
  } else {
    if (key === "true-value") {
      el._trueValue = nextValue;
    } else if (key === "false-value") {
      el._falseValue = nextValue;
    }
    patchAttr(el, key, nextValue, isSVG);
  }
};
function shouldSetAsProp(el, key, value, isSVG) {
  if (isSVG) {
    if (key === "innerHTML" || key === "textContent") {
      return true;
    }
    if (key in el && isNativeOn(key) && isFunction(value)) {
      return true;
    }
    return false;
  }
  if (key === "spellcheck" || key === "draggable" || key === "translate") {
    return false;
  }
  if (key === "form") {
    return false;
  }
  if (key === "list" && el.tagName === "INPUT") {
    return false;
  }
  if (key === "type" && el.tagName === "TEXTAREA") {
    return false;
  }
  if (key === "width" || key === "height") {
    const tag = el.tagName;
    if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") {
      return false;
    }
  }
  if (isNativeOn(key) && isString(value)) {
    return false;
  }
  return key in el;
}
const getModelAssigner = (vnode) => {
  const fn = vnode.props["onUpdate:modelValue"] || false;
  return isArray$1(fn) ? (value) => invokeArrayFns(fn, value) : fn;
};
function onCompositionStart(e) {
  e.target.composing = true;
}
function onCompositionEnd(e) {
  const target = e.target;
  if (target.composing) {
    target.composing = false;
    target.dispatchEvent(new Event("input"));
  }
}
const assignKey = Symbol("_assign");
const vModelText = {
  created(el, { modifiers: { lazy, trim, number } }, vnode) {
    el[assignKey] = getModelAssigner(vnode);
    const castToNumber = number || vnode.props && vnode.props.type === "number";
    addEventListener(el, lazy ? "change" : "input", (e) => {
      if (e.target.composing) return;
      let domValue = el.value;
      if (trim) {
        domValue = domValue.trim();
      }
      if (castToNumber) {
        domValue = looseToNumber(domValue);
      }
      el[assignKey](domValue);
    });
    if (trim) {
      addEventListener(el, "change", () => {
        el.value = el.value.trim();
      });
    }
    if (!lazy) {
      addEventListener(el, "compositionstart", onCompositionStart);
      addEventListener(el, "compositionend", onCompositionEnd);
      addEventListener(el, "change", onCompositionEnd);
    }
  },
  // set value on mounted so it's after min/max for type="range"
  mounted(el, { value }) {
    el.value = value == null ? "" : value;
  },
  beforeUpdate(el, { value, oldValue, modifiers: { lazy, trim, number } }, vnode) {
    el[assignKey] = getModelAssigner(vnode);
    if (el.composing) return;
    const elValue = (number || el.type === "number") && !/^0\d/.test(el.value) ? looseToNumber(el.value) : el.value;
    const newValue = value == null ? "" : value;
    if (elValue === newValue) {
      return;
    }
    if (document.activeElement === el && el.type !== "range") {
      if (lazy && value === oldValue) {
        return;
      }
      if (trim && el.value.trim() === newValue) {
        return;
      }
    }
    el.value = newValue;
  }
};
const vModelCheckbox = {
  // #4096 array checkboxes need to be deep traversed
  deep: true,
  created(el, _, vnode) {
    el[assignKey] = getModelAssigner(vnode);
    addEventListener(el, "change", () => {
      const modelValue = el._modelValue;
      const elementValue = getValue(el);
      const checked = el.checked;
      const assign2 = el[assignKey];
      if (isArray$1(modelValue)) {
        const index = looseIndexOf(modelValue, elementValue);
        const found = index !== -1;
        if (checked && !found) {
          assign2(modelValue.concat(elementValue));
        } else if (!checked && found) {
          const filtered = [...modelValue];
          filtered.splice(index, 1);
          assign2(filtered);
        }
      } else if (isSet(modelValue)) {
        const cloned = new Set(modelValue);
        if (checked) {
          cloned.add(elementValue);
        } else {
          cloned.delete(elementValue);
        }
        assign2(cloned);
      } else {
        assign2(getCheckboxValue(el, checked));
      }
    });
  },
  // set initial checked on mount to wait for true-value/false-value
  mounted: setChecked,
  beforeUpdate(el, binding, vnode) {
    el[assignKey] = getModelAssigner(vnode);
    setChecked(el, binding, vnode);
  }
};
function setChecked(el, { value, oldValue }, vnode) {
  el._modelValue = value;
  if (isArray$1(value)) {
    el.checked = looseIndexOf(value, vnode.props.value) > -1;
  } else if (isSet(value)) {
    el.checked = value.has(vnode.props.value);
  } else if (value !== oldValue) {
    el.checked = looseEqual(value, getCheckboxValue(el, true));
  }
}
const vModelRadio = {
  created(el, { value }, vnode) {
    el.checked = looseEqual(value, vnode.props.value);
    el[assignKey] = getModelAssigner(vnode);
    addEventListener(el, "change", () => {
      el[assignKey](getValue(el));
    });
  },
  beforeUpdate(el, { value, oldValue }, vnode) {
    el[assignKey] = getModelAssigner(vnode);
    if (value !== oldValue) {
      el.checked = looseEqual(value, vnode.props.value);
    }
  }
};
const vModelSelect = {
  // <select multiple> value need to be deep traversed
  deep: true,
  created(el, { value, modifiers: { number } }, vnode) {
    const isSetModel = isSet(value);
    addEventListener(el, "change", () => {
      const selectedVal = Array.prototype.filter.call(el.options, (o) => o.selected).map(
        (o) => number ? looseToNumber(getValue(o)) : getValue(o)
      );
      el[assignKey](
        el.multiple ? isSetModel ? new Set(selectedVal) : selectedVal : selectedVal[0]
      );
      el._assigning = true;
      nextTick(() => {
        el._assigning = false;
      });
    });
    el[assignKey] = getModelAssigner(vnode);
  },
  // set value in mounted & updated because <select> relies on its children
  // <option>s.
  mounted(el, { value, modifiers: { number } }) {
    setSelected(el, value);
  },
  beforeUpdate(el, _binding, vnode) {
    el[assignKey] = getModelAssigner(vnode);
  },
  updated(el, { value, modifiers: { number } }) {
    if (!el._assigning) {
      setSelected(el, value);
    }
  }
};
function setSelected(el, value, number) {
  const isMultiple = el.multiple;
  const isArrayValue = isArray$1(value);
  if (isMultiple && !isArrayValue && !isSet(value)) {
    return;
  }
  for (let i = 0, l = el.options.length; i < l; i++) {
    const option = el.options[i];
    const optionValue = getValue(option);
    if (isMultiple) {
      if (isArrayValue) {
        const optionType = typeof optionValue;
        if (optionType === "string" || optionType === "number") {
          option.selected = value.some((v) => String(v) === String(optionValue));
        } else {
          option.selected = looseIndexOf(value, optionValue) > -1;
        }
      } else {
        option.selected = value.has(optionValue);
      }
    } else if (looseEqual(getValue(option), value)) {
      if (el.selectedIndex !== i) el.selectedIndex = i;
      return;
    }
  }
  if (!isMultiple && el.selectedIndex !== -1) {
    el.selectedIndex = -1;
  }
}
function getValue(el) {
  return "_value" in el ? el._value : el.value;
}
function getCheckboxValue(el, checked) {
  const key = checked ? "_trueValue" : "_falseValue";
  return key in el ? el[key] : checked;
}
const vModelDynamic = {
  created(el, binding, vnode) {
    callModelHook(el, binding, vnode, null, "created");
  },
  mounted(el, binding, vnode) {
    callModelHook(el, binding, vnode, null, "mounted");
  },
  beforeUpdate(el, binding, vnode, prevVNode) {
    callModelHook(el, binding, vnode, prevVNode, "beforeUpdate");
  },
  updated(el, binding, vnode, prevVNode) {
    callModelHook(el, binding, vnode, prevVNode, "updated");
  }
};
function resolveDynamicModel(tagName, type) {
  switch (tagName) {
    case "SELECT":
      return vModelSelect;
    case "TEXTAREA":
      return vModelText;
    default:
      switch (type) {
        case "checkbox":
          return vModelCheckbox;
        case "radio":
          return vModelRadio;
        default:
          return vModelText;
      }
  }
}
function callModelHook(el, binding, vnode, prevVNode, hook) {
  const modelToUse = resolveDynamicModel(
    el.tagName,
    vnode.props && vnode.props.type
  );
  const fn = modelToUse[hook];
  fn && fn(el, binding, vnode, prevVNode);
}
const systemModifiers = ["ctrl", "shift", "alt", "meta"];
const modifierGuards = {
  stop: (e) => e.stopPropagation(),
  prevent: (e) => e.preventDefault(),
  self: (e) => e.target !== e.currentTarget,
  ctrl: (e) => !e.ctrlKey,
  shift: (e) => !e.shiftKey,
  alt: (e) => !e.altKey,
  meta: (e) => !e.metaKey,
  left: (e) => "button" in e && e.button !== 0,
  middle: (e) => "button" in e && e.button !== 1,
  right: (e) => "button" in e && e.button !== 2,
  exact: (e, modifiers) => systemModifiers.some((m) => e[`${m}Key`] && !modifiers.includes(m))
};
const withModifiers = (fn, modifiers) => {
  const cache = fn._withMods || (fn._withMods = {});
  const cacheKey = modifiers.join(".");
  return cache[cacheKey] || (cache[cacheKey] = (event, ...args) => {
    for (let i = 0; i < modifiers.length; i++) {
      const guard = modifierGuards[modifiers[i]];
      if (guard && guard(event, modifiers)) return;
    }
    return fn(event, ...args);
  });
};
const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
let renderer;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
const createApp = (...args) => {
  const app2 = ensureRenderer().createApp(...args);
  const { mount } = app2;
  app2.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (!container) return;
    const component = app2._component;
    if (!isFunction(component) && !component.render && !component.template) {
      component.template = container.innerHTML;
    }
    container.innerHTML = "";
    const proxy = mount(container, false, resolveRootNamespace(container));
    if (container instanceof Element) {
      container.removeAttribute("v-cloak");
      container.setAttribute("data-v-app", "");
    }
    return proxy;
  };
  return app2;
};
function resolveRootNamespace(container) {
  if (container instanceof SVGElement) {
    return "svg";
  }
  if (typeof MathMLElement === "function" && container instanceof MathMLElement) {
    return "mathml";
  }
}
function normalizeContainer(container) {
  if (isString(container)) {
    const res = document.querySelector(container);
    return res;
  }
  return container;
}
var isVue2 = false;
/*!
 * pinia v2.2.2
 * (c) 2024 Eduardo San Martin Morote
 * @license MIT
 */
let activePinia;
const setActivePinia = (pinia) => activePinia = pinia;
const piniaSymbol = (
  /* istanbul ignore next */
  Symbol()
);
function isPlainObject(o) {
  return o && typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]" && typeof o.toJSON !== "function";
}
var MutationType;
(function(MutationType2) {
  MutationType2["direct"] = "direct";
  MutationType2["patchObject"] = "patch object";
  MutationType2["patchFunction"] = "patch function";
})(MutationType || (MutationType = {}));
function createPinia() {
  const scope = effectScope(true);
  const state = scope.run(() => ref({}));
  let _p = [];
  let toBeInstalled = [];
  const pinia = markRaw({
    install(app2) {
      setActivePinia(pinia);
      {
        pinia._a = app2;
        app2.provide(piniaSymbol, pinia);
        app2.config.globalProperties.$pinia = pinia;
        toBeInstalled.forEach((plugin) => _p.push(plugin));
        toBeInstalled = [];
      }
    },
    use(plugin) {
      if (!this._a && !isVue2) {
        toBeInstalled.push(plugin);
      } else {
        _p.push(plugin);
      }
      return this;
    },
    _p,
    // it's actually undefined here
    // @ts-expect-error
    _a: null,
    _e: scope,
    _s: /* @__PURE__ */ new Map(),
    state
  });
  return pinia;
}
const noop$1 = () => {
};
function addSubscription(subscriptions, callback, detached, onCleanup = noop$1) {
  subscriptions.push(callback);
  const removeSubscription = () => {
    const idx = subscriptions.indexOf(callback);
    if (idx > -1) {
      subscriptions.splice(idx, 1);
      onCleanup();
    }
  };
  if (!detached && getCurrentScope()) {
    onScopeDispose(removeSubscription);
  }
  return removeSubscription;
}
function triggerSubscriptions(subscriptions, ...args) {
  subscriptions.slice().forEach((callback) => {
    callback(...args);
  });
}
const fallbackRunWithContext = (fn) => fn();
const ACTION_MARKER = Symbol();
const ACTION_NAME = Symbol();
function mergeReactiveObjects(target, patchToApply) {
  if (target instanceof Map && patchToApply instanceof Map) {
    patchToApply.forEach((value, key) => target.set(key, value));
  } else if (target instanceof Set && patchToApply instanceof Set) {
    patchToApply.forEach(target.add, target);
  }
  for (const key in patchToApply) {
    if (!patchToApply.hasOwnProperty(key))
      continue;
    const subPatch = patchToApply[key];
    const targetValue = target[key];
    if (isPlainObject(targetValue) && isPlainObject(subPatch) && target.hasOwnProperty(key) && !isRef(subPatch) && !isReactive(subPatch)) {
      target[key] = mergeReactiveObjects(targetValue, subPatch);
    } else {
      target[key] = subPatch;
    }
  }
  return target;
}
const skipHydrateSymbol = (
  /* istanbul ignore next */
  Symbol()
);
function shouldHydrate(obj) {
  return !isPlainObject(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
}
const { assign: assign$1 } = Object;
function isComputed(o) {
  return !!(isRef(o) && o.effect);
}
function createOptionsStore(id, options, pinia, hot) {
  const { state, actions, getters } = options;
  const initialState = pinia.state.value[id];
  let store;
  function setup() {
    if (!initialState && true) {
      {
        pinia.state.value[id] = state ? state() : {};
      }
    }
    const localState = toRefs(pinia.state.value[id]);
    return assign$1(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
      computedGetters[name] = markRaw(computed(() => {
        setActivePinia(pinia);
        const store2 = pinia._s.get(id);
        return getters[name].call(store2, store2);
      }));
      return computedGetters;
    }, {}));
  }
  store = createSetupStore(id, setup, options, pinia, hot, true);
  return store;
}
function createSetupStore($id, setup, options = {}, pinia, hot, isOptionsStore) {
  let scope;
  const optionsForPlugin = assign$1({ actions: {} }, options);
  const $subscribeOptions = { deep: true };
  let isListening;
  let isSyncListening;
  let subscriptions = [];
  let actionSubscriptions = [];
  let debuggerEvents;
  const initialState = pinia.state.value[$id];
  if (!isOptionsStore && !initialState && true) {
    {
      pinia.state.value[$id] = {};
    }
  }
  ref({});
  let activeListener;
  function $patch(partialStateOrMutator) {
    let subscriptionMutation;
    isListening = isSyncListening = false;
    if (typeof partialStateOrMutator === "function") {
      partialStateOrMutator(pinia.state.value[$id]);
      subscriptionMutation = {
        type: MutationType.patchFunction,
        storeId: $id,
        events: debuggerEvents
      };
    } else {
      mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator);
      subscriptionMutation = {
        type: MutationType.patchObject,
        payload: partialStateOrMutator,
        storeId: $id,
        events: debuggerEvents
      };
    }
    const myListenerId = activeListener = Symbol();
    nextTick().then(() => {
      if (activeListener === myListenerId) {
        isListening = true;
      }
    });
    isSyncListening = true;
    triggerSubscriptions(subscriptions, subscriptionMutation, pinia.state.value[$id]);
  }
  const $reset = isOptionsStore ? function $reset2() {
    const { state } = options;
    const newState = state ? state() : {};
    this.$patch(($state) => {
      assign$1($state, newState);
    });
  } : (
    /* istanbul ignore next */
    noop$1
  );
  function $dispose() {
    scope.stop();
    subscriptions = [];
    actionSubscriptions = [];
    pinia._s.delete($id);
  }
  const action = (fn, name = "") => {
    if (ACTION_MARKER in fn) {
      fn[ACTION_NAME] = name;
      return fn;
    }
    const wrappedAction = function() {
      setActivePinia(pinia);
      const args = Array.from(arguments);
      const afterCallbackList = [];
      const onErrorCallbackList = [];
      function after(callback) {
        afterCallbackList.push(callback);
      }
      function onError(callback) {
        onErrorCallbackList.push(callback);
      }
      triggerSubscriptions(actionSubscriptions, {
        args,
        name: wrappedAction[ACTION_NAME],
        store,
        after,
        onError
      });
      let ret;
      try {
        ret = fn.apply(this && this.$id === $id ? this : store, args);
      } catch (error) {
        triggerSubscriptions(onErrorCallbackList, error);
        throw error;
      }
      if (ret instanceof Promise) {
        return ret.then((value) => {
          triggerSubscriptions(afterCallbackList, value);
          return value;
        }).catch((error) => {
          triggerSubscriptions(onErrorCallbackList, error);
          return Promise.reject(error);
        });
      }
      triggerSubscriptions(afterCallbackList, ret);
      return ret;
    };
    wrappedAction[ACTION_MARKER] = true;
    wrappedAction[ACTION_NAME] = name;
    return wrappedAction;
  };
  const partialStore = {
    _p: pinia,
    // _s: scope,
    $id,
    $onAction: addSubscription.bind(null, actionSubscriptions),
    $patch,
    $reset,
    $subscribe(callback, options2 = {}) {
      const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
      const stopWatcher = scope.run(() => watch(() => pinia.state.value[$id], (state) => {
        if (options2.flush === "sync" ? isSyncListening : isListening) {
          callback({
            storeId: $id,
            type: MutationType.direct,
            events: debuggerEvents
          }, state);
        }
      }, assign$1({}, $subscribeOptions, options2)));
      return removeSubscription;
    },
    $dispose
  };
  const store = reactive(partialStore);
  pinia._s.set($id, store);
  const runWithContext = pinia._a && pinia._a.runWithContext || fallbackRunWithContext;
  const setupStore = runWithContext(() => pinia._e.run(() => (scope = effectScope()).run(() => setup({ action }))));
  for (const key in setupStore) {
    const prop = setupStore[key];
    if (isRef(prop) && !isComputed(prop) || isReactive(prop)) {
      if (!isOptionsStore) {
        if (initialState && shouldHydrate(prop)) {
          if (isRef(prop)) {
            prop.value = initialState[key];
          } else {
            mergeReactiveObjects(prop, initialState[key]);
          }
        }
        {
          pinia.state.value[$id][key] = prop;
        }
      }
    } else if (typeof prop === "function") {
      const actionValue = action(prop, key);
      {
        setupStore[key] = actionValue;
      }
      optionsForPlugin.actions[key] = prop;
    } else ;
  }
  {
    assign$1(store, setupStore);
    assign$1(toRaw(store), setupStore);
  }
  Object.defineProperty(store, "$state", {
    get: () => pinia.state.value[$id],
    set: (state) => {
      $patch(($state) => {
        assign$1($state, state);
      });
    }
  });
  pinia._p.forEach((extender) => {
    {
      assign$1(store, scope.run(() => extender({
        store,
        app: pinia._a,
        pinia,
        options: optionsForPlugin
      })));
    }
  });
  if (initialState && isOptionsStore && options.hydrate) {
    options.hydrate(store.$state, initialState);
  }
  isListening = true;
  isSyncListening = true;
  return store;
}
// @__NO_SIDE_EFFECTS__
function defineStore(idOrOptions, setup, setupOptions) {
  let id;
  let options;
  const isSetupStore = typeof setup === "function";
  if (typeof idOrOptions === "string") {
    id = idOrOptions;
    options = isSetupStore ? setupOptions : setup;
  } else {
    options = idOrOptions;
    id = idOrOptions.id;
  }
  function useStore(pinia, hot) {
    const hasContext = hasInjectionContext();
    pinia = // in test mode, ignore the argument provided as we can always retrieve a
    // pinia instance with getActivePinia()
    pinia || (hasContext ? inject(piniaSymbol, null) : null);
    if (pinia)
      setActivePinia(pinia);
    pinia = activePinia;
    if (!pinia._s.has(id)) {
      if (isSetupStore) {
        createSetupStore(id, setup, options, pinia);
      } else {
        createOptionsStore(id, options, pinia);
      }
    }
    const store = pinia._s.get(id);
    return store;
  }
  useStore.$id = id;
  return useStore;
}
function storeToRefs(store) {
  {
    store = toRaw(store);
    const refs = {};
    for (const key in store) {
      const value = store[key];
      if (isRef(value) || isReactive(value)) {
        refs[key] = // ---
        toRef(store, key);
      }
    }
    return refs;
  }
}
function logDebug(...args) {
  return;
}
function logInfo(...args) {
  console.log("Info", ...args);
}
function logError(...args) {
  console.log("Error", ...args);
}
const useGlobalStore = /* @__PURE__ */ defineStore("global", {
  state: () => {
    return {
      id: "",
      platform: "",
      initialized: false,
      disabled: false,
      configChanged: false,
      messageError: "",
      messageWarning: "",
      messageSuccess: "",
      messageInfo: "",
      fetchTimout: 8e3
    };
  },
  getters: {
    isError() {
      return this.messageError != "" ? true : false;
    },
    isWarning() {
      return this.messageWarning != "" ? true : false;
    },
    isSuccess() {
      return this.messageSuccess != "" ? true : false;
    },
    isInfo() {
      return this.messageInfo != "" ? true : false;
    },
    token() {
      return "Bearer " + this.id;
    },
    baseURL() {
      return window.location.href;
    },
    uiVersion() {
      return "2.0.0-beta2";
    },
    uiBuild() {
      return "..d31f43";
    },
    disabled32() {
      if (this.disabled) return true;
      if (this.platform !== "esp8266") return false;
      return true;
    }
  },
  actions: {
    clearMessages() {
      this.messageError = "";
      this.messageWarning = "";
      this.messageSuccess = "";
      this.messageInfo = "";
    }
  }
});
const useStatusStore = /* @__PURE__ */ defineStore("status", {
  state: () => {
    return {
      id: "",
      angle: 0,
      gravity: 0,
      gravity_format: "",
      temp: 0,
      temp_format: "",
      sleep_interval: 0,
      battery: 0,
      sleep_mode: false,
      rssi: 0,
      app_ver: "",
      app_build: "",
      mdns: "",
      platform: "",
      hardware: "",
      wifi_ssid: "",
      ip: "",
      runtime_average: 0,
      total_heap: 0,
      free_heap: 0,
      ispindel_config: false,
      self_check: {
        gyro_connected: true,
        gyro_calibration: true,
        temp_connected: true,
        gravity_formula: true,
        battery_level: true,
        push_targets: true
      },
      wifi_setup: false,
      connected: true
    };
  },
  getters: {},
  actions: {
    load(callback) {
      logInfo("statusStore.load()", "Fetching /api/status");
      fetch(global$1.baseURL + "api/status", {
        signal: AbortSignal.timeout(global$1.fetchTimout)
      }).then((res) => res.json()).then((json) => {
        this.id = json.id;
        this.angle = json.angle;
        this.temp_format = json.temp_format;
        this.gravity = json.gravity;
        this.gravity_format = json.gravity_format;
        this.temp = json.temp;
        this.sleep_mode = json.sleep_mode;
        this.battery = json.battery;
        this.rssi = json.rssi;
        this.app_ver = json.app_ver;
        this.app_build = json.app_build;
        this.mdns = json.mdns;
        this.platform = json.platform;
        this.hardware = json.hardware;
        this.wifi_ssid = json.wifi_ssid;
        this.ip = json.ip;
        this.runtime_average = json.runtime_average;
        this.ispindel_config = json.ispindel_config;
        this.self_check.gyro_connected = json.self_check.gyro_connected;
        this.self_check.gyro_calibration = json.self_check.gyro_calibration;
        this.self_check.temp_connected = json.self_check.temp_connected;
        this.self_check.gravity_formula = json.self_check.gravity_formula;
        this.self_check.battery_level = json.self_check.battery_level;
        this.self_check.push_targets = json.self_check.push_targets;
        this.total_heap = json.total_heap;
        this.free_heap = json.free_heap;
        this.wifi_setup = json.wifi_setup;
        this.total_heap = Math.round(this.total_heap / 1024).toFixed(0);
        this.free_heap = Math.round(this.free_heap / 1024).toFixed(0);
        this.battery = (Math.round(this.battery * 100) / 100).toFixed(2);
        this.angle = (Math.round(this.angle * 100) / 100).toFixed(2);
        this.temp = (Math.round(this.temp * 100) / 100).toFixed(2);
        this.runtime_average = (Math.round(this.runtime_average * 100) / 100).toFixed(2);
        if (this.gravity_format === "G")
          this.gravity = (Math.round(this.gravity * 1e4) / 1e4).toFixed(4);
        else this.gravity = (Math.round(this.gravity * 100) / 100).toFixed(2);
        logInfo("statusStore.load()", "Fetching /api/status completed");
        callback(true);
      }).catch((err) => {
        logError("statusStore.load()", err);
        callback(false);
      });
    },
    auth(callback) {
      logInfo("statusStore.auth()", "Fetching /api/auth");
      var base = btoa("gravitymon:password");
      fetch(global$1.baseURL + "api/auth", {
        method: "GET",
        headers: { Authorization: "Basic " + base },
        signal: AbortSignal.timeout(global$1.fetchTimout)
      }).then((res) => res.json()).then((json) => {
        logInfo("statusStore.auth()", "Fetching /api/auth completed");
        callback(true, json);
      }).catch((err) => {
        logError("statusStore.auth()", err);
        callback(false);
      });
    },
    ping() {
      fetch(global$1.baseURL + "api/ping", {
        method: "GET",
        signal: AbortSignal.timeout(global$1.fetchTimout)
      }).then((res) => res.json()).then(() => {
        this.connected = true;
      }).catch((err) => {
        logError("statusStore.ping()", err);
        this.connected = false;
      });
    },
    setSleepMode(val, callback) {
      logInfo("statusStore.setSleepMode()", "Fetching /api/config/sleepmode");
      fetch(global$1.baseURL + "api/sleepmode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: global$1.token
        },
        body: JSON.stringify({ sleep_mode: val }),
        signal: AbortSignal.timeout(global$1.fetchTimout)
      }).then((res) => res.json()).then((json) => {
        logInfo("statusStore.setSleepMode()", "Fetching /api/sleepmode completed", json);
        callback(true);
      }).catch((err) => {
        logError("statusStore.setSleepMode()", err);
        callback(false);
      });
    }
  }
});
const httpHeaderOptions = ref([
  { label: "JSON data", value: "Content-Type: application/json" },
  { label: "Form data", value: "Content-Type: x-www-form-urlencoded" },
  { label: "Authorization", value: "Authorization: Basic {enter token here}" },
  { label: "No Cache", value: "Pragma: no-cache" },
  { label: "User agent", value: "User-Agent: gravitymon" }
]);
const httpPostUrlOptions = ref([
  {
    label: "Brewfather ispindel",
    value: "http://log.brewfather.net/ispindel?id=<yourid>"
  },
  {
    label: "Brewfather stream",
    value: "http://log.brewfather.net/stream?id=<yourid>"
  },
  {
    label: "UBI dots",
    value: "http://industrial.api.ubidots.com/api/v1.6/devices/<devicename>/?token=<api-token>"
  },
  {
    label: "UBI dots secure",
    value: "https://industrial.api.ubidots.com/api/v1.6/devices/<devicename>/?token=<api-token>"
  },
  {
    label: "Brewersfriend (P)",
    value: "http://log.brewersfriend.com/ispindel/[API KEY]"
  },
  {
    label: "Brewersfriend (SG)",
    value: "http://log.brewersfriend.com/ispindel_sg/[API KEY]"
  },
  { label: "Brewspy", value: "http://brew-spy.com/api/ispindel" },
  { label: "Thingsspeak", value: "http://api.thingspeak.com/update.json" },
  { label: "Blynk", value: "http://blynk.cloud/external/api/batch/update" },
  { label: "Bierdot bricks", value: "https://brewbricks.com/api/iot/v1" }
]);
const httpPostFormatOptions = ref([
  {
    label: "GravityMon",
    value: "%7B%20%22name%22%20%3A%20%22%24%7Bmdns%7D%22%2C%20%22ID%22%3A%20%22%24%7Bid%7D%22%2C%20%22token%22%20%3A%20%22%24%7Btoken%7D%22%2C%20%22interval%22%3A%20%24%7Bsleep-interval%7D%2C%20%22temperature%22%3A%20%24%7Btemp%7D%2C%20%22temp_units%22%3A%20%22%24%7Btemp-unit%7D%22%2C%20%22gravity%22%3A%20%24%7Bgravity%7D%2C%20%22angle%22%3A%20%24%7Bangle%7D%2C%20%22battery%22%3A%20%24%7Bbattery%7D%2C%20%22RSSI%22%3A%20%24%7Brssi%7D%2C%20%22corr-gravity%22%3A%20%24%7Bcorr-gravity%7D%2C%20%22gravity-unit%22%3A%20%22%24%7Bgravity-unit%7D%22%2C%20%22run-time%22%3A%20%24%7Brun-time%7D%7D"
  },
  {
    label: "iSpindle",
    value: "%7B%20%22name%22%20%3A%20%22%24%7Bmdns%7D%22%2C%20%22ID%22%3A%20%22%24%7Bid%7D%22%2C%20%22token%22%20%3A%20%22%24%7Btoken%7D%22%2C%20%22interval%22%3A%20%24%7Bsleep-interval%7D%2C%20%22temperature%22%3A%20%24%7Btemp%7D%2C%20%22temp_units%22%3A%20%22%24%7Btemp-unit%7D%22%2C%20%22gravity%22%3A%20%24%7Bgravity%7D%2C%20%22angle%22%3A%20%24%7Bangle%7D%2C%20%22battery%22%3A%20%24%7Bbattery%7D%2C%20%22RSSI%22%3A%20%24%7Brssi%7D%7D"
  },
  {
    label: "BrewFatherCustom",
    value: "%7B%20%20%20%22name%22%3A%20%22%24%7Bmdns%7D%22%2C%20%20%20%22temp%22%3A%20%24%7Btemp%7D%2C%20%20%20%22aux_temp%22%3A%200%2C%20%20%20%22ext_temp%22%3A%200%2C%20%20%20%22temp_unit%22%3A%20%22%24%7Btemp-unit%7D%22%2C%20%20%20%22gravity%22%3A%20%24%7Bgravity%7D%2C%20%20%20%22gravity_unit%22%3A%20%22%24%7Bgravity-unit%7D%22%2C%20%20%20%22pressure%22%3A%200%2C%20%20%20%22pressure_unit%22%3A%20%22PSI%22%2C%20%20%20%22ph%22%3A%200%2C%20%20%20%22bpm%22%3A%200%2C%20%20%20%22comment%22%3A%20%22%22%2C%20%20%20%22beer%22%3A%20%22%22%2C%20%20%20%22battery%22%3A%20%24%7Bbattery%7D%7D"
  },
  {
    label: "UBIDots",
    value: "%7B%20%20%20%22temperature%22%3A%20%24%7Btemp%7D%2C%20%20%20%22gravity%22%3A%20%24%7Bgravity%7D%2C%20%20%20%22angle%22%3A%20%24%7Bangle%7D%2C%20%20%20%22battery%22%3A%20%24%7Bbattery%7D%2C%20%20%20%22rssi%22%3A%20%24%7Brssi%7D%7D"
  }
]);
const httpGetFormatOptions = ref([
  {
    label: "GravityMon",
    value: "%3Fname%3D%24%7Bmdns%7D%26id%3D%24%7Bid%7D%26token%3D%24%7Btoken2%7D%26interval%3D%24%7Bsleep-interval%7D%26temperature%3D%24%7Btemp%7D%26temp-units%3D%24%7Btemp-unit%7D%26gravity%3D%24%7Bgravity%7D%26angle%3D%24%7Bangle%7D%26battery%3D%24%7Bbattery%7D%26rssi%3D%24%7Brssi%7D%26corr-gravity%3D%24%7Bcorr-gravity%7D%26gravity-unit%3D%24%7Bgravity-unit%7D%26run-time%3D%24%7Brun-time%7D"
  }
]);
const influxdb2FormatOptions = ref([
  {
    label: "GravityMon",
    value: "measurement%2Chost%3D%24%7Bmdns%7D%2Cdevice%3D%24%7Bid%7D%2Ctemp%2Dformat%3D%24%7Btemp%2Dunit%7D%2Cgravity%2Dformat%3D%24%7Bgravity%2Dunit%7D%20gravity%3D%24%7Bgravity%7D%2Ccorr%2Dgravity%3D%24%7Bcorr%2Dgravity%7D%2Cangle%3D%24%7Bangle%7D%2Ctemp%3D%24%7Btemp%7D%2Cbattery%3D%24%7Bbattery%7D%2Crssi%3D%24%7Brssi%7D%0A"
  }
]);
const mqttFormatOptions = ref([
  {
    label: "iSpindle",
    value: "ispindel%2F%24%7Bmdns%7D%2Ftilt%3A%24%7Bangle%7D%7Cispindel%2F%24%7Bmdns%7D%2Ftemperature%3A%24%7Btemp%7D%7Cispindel%2F%24%7Bmdns%7D%2Ftemp_units%3A%24%7Btemp-unit%7D%7Cispindel%2F%24%7Bmdns%7D%2Fbattery%3A%24%7Bbattery%7D%7Cispindel%2F%24%7Bmdns%7D%2Fgravity%3A%24%7Bgravity%7D%7Cispindel%2F%24%7Bmdns%7D%2Finterval%3A%24%7Bsleep-interval%7D%7Cispindel%2F%24%7Bmdns%7D%2FRSSI%3A%24%7Brssi%7D%7C"
  },
  {
    label: "HomeAssistant",
    value: "gravmon%2F%24%7Bmdns%7D%2Ftemperature%3A%24%7Btemp%7D%7Cgravmon%2F%24%7Bmdns%7D%2Fgravity%3A%24%7Bgravity%7D%7Cgravmon%2F%24%7Bmdns%7D%2Frssi%3A%24%7Brssi%7D%7Cgravmon%2F%24%7Bmdns%7D%2Ftilt%3A%24%7Btilt%7D%7Cgravmon%2F%24%7Bmdns%7D%2Fbattery%3A%24%7Bbattery%7D%7C"
  },
  {
    label: "HomeAssistant 2",
    value: "gravmon%2F%24%7Bmdns%7D%2Ftemperature%3A%24%7Btemp%7D%7Cgravmon%2F%24%7Bmdns%7D%2Fgravity%3A%24%7Bgravity%7D%7Cgravmon%2F%24%7Bmdns%7D%2Frssi%3A%24%7Brssi%7D%7Cgravmon%2F%24%7Bmdns%7D%2Ftilt%3A%24%7Btilt%7D%7Cgravmon%2F%24%7Bmdns%7D%2Fbattery%3A%24%7Bbattery%7D%7Chomeassistant%2Fsensor%2Fgravmon_%24%7Bid%7D%2Ftemperature%2Fconfig%3A%7B%22dev%22%3A%7B%22name%22%3A%22%24%7Bmdns%7D%22%2C%22mdl%22%3A%22gravmon%22%2C%22sw%22%3A%22%24%7Bapp-ver%7D%22%2C%22ids%22%3A%22%24%7Bid%7D%22%7D%2C%22uniq_id%22%3A%22%24%7Bid%7D_temp%22%2C%22name%22%3A%22temperature%22%2C%22dev_cla%22%3A%22temperature%22%2C%22unit_of_meas%22%3A%22%C2%B0%24%7Btemp-unit%7D%22%2C%22stat_t%22%3A%22gravmon%2F%24%7Bmdns%7D%2Ftemperature%22%7D%7Chomeassistant%2Fsensor%2Fgravmon_%24%7Bid%7D%2Fgravity%2Fconfig%3A%7B%22dev%22%3A%7B%22name%22%3A%22%24%7Bmdns%7D%22%2C%22mdl%22%3A%22gravmon%22%2C%22sw%22%3A%22%24%7Bapp-ver%7D%22%2C%22ids%22%3A%22%24%7Bid%7D%22%7D%2C%22uniq_id%22%3A%22%24%7Bid%7D_grav%22%2C%22name%22%3A%22gravity%22%2C%22unit_of_meas%22%3A%22%20%24%7Bgravity-unit%7D%22%2C%22stat_t%22%3A%22gravmon%2F%24%7Bmdns%7D%2Fgravity%22%7D%7Chomeassistant%2Fsensor%2Fgravmon_%24%7Bid%7D%2Frssi%2Fconfig%3A%7B%22dev%22%3A%7B%22name%22%3A%22%24%7Bmdns%7D%22%2C%22mdl%22%3A%22gravmon%22%2C%22sw%22%3A%22%24%7Bapp-ver%7D%22%2C%22ids%22%3A%22%24%7Bid%7D%22%7D%2C%22uniq_id%22%3A%22%24%7Bid%7D_rssi%22%2C%22name%22%3A%22rssi%22%2C%22dev_cla%22%3A%22signal_strength%22%2C%22unit_of_meas%22%3A%22dBm%22%2C%22stat_t%22%3A%22gravmon%2F%24%7Bmdns%7D%2Frssi%22%7D%7Chomeassistant%2Fsensor%2Fgravmon_%24%7Bid%7D%2Ftilt%2Fconfig%3A%7B%22dev%22%3A%7B%22name%22%3A%22%24%7Bmdns%7D%22%2C%22mdl%22%3A%22gravmon%22%2C%22sw%22%3A%22%24%7Bapp-ver%7D%22%2C%22ids%22%3A%22%24%7Bid%7D%22%7D%2C%22uniq_id%22%3A%22%24%7Bid%7D_tilt%22%2C%22name%22%3A%22tilt%22%2C%22stat_t%22%3A%22gravmon%2F%24%7Bmdns%7D%2Ftilt%22%7D%7Chomeassistant%2Fsensor%2Fgravmon_%24%7Bid%7D%2Fbattery%2Fconfig%3A%7B%22dev%22%3A%7B%22name%22%3A%22%24%7Bmdns%7D%22%2C%22mdl%22%3A%22gravmon%22%2C%22sw%22%3A%22%24%7Bapp-ver%7D%22%2C%22ids%22%3A%22%24%7Bid%7D%22%7D%2C%22uniq_id%22%3A%22%24%7Bid%7D_batt%22%2C%22name%22%3A%22battery%22%2C%22dev_cla%22%3A%22voltage%22%2C%22unit_of_meas%22%3A%22V%22%2C%22stat_t%22%3A%22gravmon%2F%24%7Bmdns%7D%2Fbattery%22%7D%7C"
  },
  {
    label: "Brewblox",
    value: "brewcast%2Fhistory%3A%7B%22key%22%3A%22%24%7Bmdns%7D%22%2C%22data%22%3A%7B%22Temperature%5BdegC%5D%22%3A%20%24%7Btemp-c%7D%2C%22Temperature%5BdegF%5D%22%3A%20%24%7Btemp-f%7D%2C%22Battery%5BV%5D%22%3A%24%7Bbattery%7D%2C%22Tilt%5Bdeg%5D%22%3A%24%7Bangle%7D%2C%22Rssi%5BdBm%5D%22%3A%24%7Brssi%7D%2C%22SG%22%3A%24%7Bgravity-sg%7D%2C%22Plato%22%3A%24%7Bgravity-plato%7D%7D%7D%7C"
  }
]);
const httpGetUrlOptions = ref([{ label: "-blank-", value: "" }]);
function validateCurrentForm() {
  let valid = true;
  const forms = document.querySelectorAll(".needs-validation");
  Array.from(forms).forEach((form) => {
    if (!form.checkValidity()) valid = false;
    form.classList.add("was-validated");
  });
  return valid;
}
function tempToF(c) {
  return c * 1.8 + 32;
}
function tempToC(f) {
  return (f - 32) / 1.8;
}
function applyTemplate(status2, config2, template) {
  var s = template;
  s = s.replaceAll("${temp}", status2.temp);
  var c = status2.temp;
  var f = status2.temp;
  if (config2.temp_format === "C") {
    f = tempToF(status2.temp);
  } else {
    c = tempToC(status2.temp);
  }
  s = s.replaceAll("${temp-c}", c);
  s = s.replaceAll("${temp-f}", f);
  s = s.replaceAll("${angle}", status2.angle);
  s = s.replaceAll("${tilt}", status2.angle);
  s = s.replaceAll("${app-ver}", status2.app_ver);
  s = s.replaceAll("${app-build}", status2.app_build);
  s = s.replaceAll("${battery-percent}", 100);
  s = s.replaceAll("${rssi}", status2.rssi);
  s = s.replaceAll("${run-time}", status2.runtime_average);
  s = s.replaceAll("${corr-gravity}", status2.gravity);
  s = s.replaceAll("${battery}", status2.battery);
  if (config2.gravity_format === "G") {
    var sg = status2.gravity;
    s = s.replaceAll("${gravity}", sg);
    s = s.replaceAll("${gravity-sg}", sg);
    s = s.replaceAll("${corr-gravity-sg}", sg);
    var plato = 259 - (259 - sg);
    s = s.replaceAll("${gravity-plato}", plato);
    s = s.replaceAll("${corr-gravity-plato}", plato);
  } else {
    plato = status2.gravity;
    s = s.replaceAll("${gravity}", plato);
    s = s.replaceAll("${gravity-plato}", plato);
    s = s.replaceAll("${corr-gravity-plato}", plato);
    sg = 259 / (259 - plato);
    s = s.replaceAll("${gravity-sg}", sg);
    s = s.replaceAll("${corr-gravity-sg}", sg);
  }
  s = s.replaceAll("${mdns}", config2.mdns);
  s = s.replaceAll("${id}", config2.id);
  s = s.replaceAll("${sleep-interval}", config2.sleep_interval);
  s = s.replaceAll("${token}", config2.token);
  s = s.replaceAll("${token2}", config2.token2);
  s = s.replaceAll("${temp-unit}", config2.temp_format);
  s = s.replaceAll("${gravity-unit}", config2.gravity_format);
  try {
    return JSON.stringify(JSON.parse(s), null, 2);
  } catch (e) {
    logError("utils.applyTemplate()", "Not a valid json document, returning string");
  }
  return s;
}
function isValidJson(s) {
  try {
    JSON.stringify(JSON.parse(s));
    return true;
  } catch (e) {
  }
  return false;
}
function isValidFormData(s) {
  if (s.startsWith("?")) return true;
  return false;
}
function isValidMqttData(s) {
  if (s.indexOf("|") >= 0) return true;
  return false;
}
function getErrorString(code) {
  switch (code) {
    case -100:
      return "Skipped since SSL is used";
    case 200:
      return "Success (200)";
    case 401:
      return "Access denied (401)";
    case 404:
      return "Endpoint not found (404)";
    case 422:
      return "Paylod cannot be parsed, check format and http headers";
  }
  return "Unknown code, check documentation (" + code + ")";
}
function isGyroCalibrated() {
  var g2 = config.gyro_calibration_data;
  if (g2.ax + g2.ay + g2.az + g2.gx + g2.gy + g2.gz == 0) return false;
  return true;
}
function restart() {
  global$1.clearMessages();
  global$1.disabled = true;
  fetch(global$1.baseURL + "api/restart", {
    headers: { Authorization: global$1.token },
    signal: AbortSignal.timeout(global$1.fetchTimout)
  }).then((res) => res.json()).then((json) => {
    if (json.status == true) {
      global$1.messageSuccess = json.message + " Redirecting to http://" + config.mdns + ".local in 8 seconds.";
      logInfo("utils.restart()", "Scheduling refresh of UI");
      setTimeout(() => {
        location.href = "http://" + config.mdns + ".local";
      }, 8e3);
    } else {
      global$1.messageError = json.message;
      global$1.disabled = false;
    }
  }).catch((err) => {
    logError("utils.restart()", err);
    global$1.messageError = "Failed to do restart";
    global$1.disabled = false;
  });
}
const useConfigStore = /* @__PURE__ */ defineStore("config", {
  state: () => {
    return {
      // Device
      id: "",
      mdns: "",
      temp_format: "",
      gravity_format: "",
      // Hardware
      ota_url: "",
      storage_sleep: false,
      voltage_factor: 0,
      voltage_config: 0,
      gyro_temp: false,
      battery_saving: false,
      tempsensor_resolution: 0,
      temp_adjustment_value: 0,
      voltage_pin: 0,
      // Wifi
      wifi_portal_timeout: 0,
      wifi_connect_timeout: 0,
      wifi_ssid: "",
      wifi_ssid2: "",
      wifi_pass: "",
      wifi_pass2: "",
      wifi_direct_ssid: "",
      wifi_direct_pass: "",
      use_wifi_direct: false,
      wifi_scan_ap: false,
      // Push - Generic
      token: "",
      token2: "",
      sleep_interval: 0,
      push_timeout: 0,
      skip_ssl_on_test: false,
      // Push - Http Post 1
      http_post_target: "",
      http_post_header1: "",
      http_post_header2: "",
      http_post_int: 0,
      http_post_format: "",
      // Push - Http Post 2
      http_post2_target: "",
      http_post2_header1: "",
      http_post2_header2: "",
      http_post2_int: 0,
      http_post2_format: "",
      // Push - Http Get
      http_get_target: "",
      http_get_header1: "",
      http_get_header2: "",
      http_get_int: 0,
      http_get_format: "",
      // Push - Influx
      influxdb2_target: "",
      influxdb2_org: "",
      influxdb2_bucket: "",
      influxdb2_token: "",
      influxdb2_int: 0,
      influxdb2_format: "",
      // Push - MQTT
      mqtt_target: "",
      mqtt_port: "",
      mqtt_user: "",
      mqtt_pass: "",
      mqtt_int: 0,
      mqtt_format: "",
      // Push BLE
      ble_tilt_color: "",
      ble_format: 0,
      // Gravity formula
      gravity_formula: "",
      gravity_temp_adjustment: false,
      formula_calculation_data: [],
      gyro_read_count: 0,
      gyro_moving_threashold: 0,
      formula_max_deviation: 0,
      formula_calibration_temp: 0,
      ignore_low_angles: false,
      gyro_calibration_data: [],
      dark_mode: false,
      gyro_disabled: false
    };
  },
  actions: {
    toJson() {
      logInfo("configStore.toJSON()");
      var dest = {};
      for (var key in this.$state) {
        if (!key.startsWith("$")) {
          if (key === "gyro_calibration_data") {
            dest[key] = [];
            for (var i in this.$state[key]) {
              dest[key][i] = this.$state[key][i];
            }
          } else if (key === "formula_calculation_data") {
            dest[key] = [];
            for (i in this.$state[key]) {
              dest[key][i] = {};
              dest[key][i].a = this.$state[key][i].a;
              dest[key][i].g = this.$state[key][i].g;
            }
          } else {
            dest[key] = this[key];
          }
        }
      }
      logInfo("configStore.toJSON()", dest);
      return JSON.stringify(dest, null, 2);
    },
    load(callback) {
      global$1.disabled = true;
      logInfo("configStore.load()", "Fetching /api/config");
      fetch(global$1.baseURL + "api/config", {
        method: "GET",
        headers: { Authorization: global$1.token },
        signal: AbortSignal.timeout(global$1.fetchTimout)
      }).then((res) => res.json()).then((json) => {
        global$1.disabled = false;
        this.id = json.id;
        this.mdns = json.mdns;
        this.temp_format = json.temp_format;
        this.gravity_format = json.gravity_format;
        this.ota_url = json.ota_url;
        this.storage_sleep = json.storage_sleep;
        this.voltage_factor = json.voltage_factor;
        this.voltage_config = json.voltage_config;
        this.gyro_temp = json.gyro_temp;
        this.battery_saving = json.battery_saving;
        this.tempsensor_resolution = json.tempsensor_resolution;
        this.temp_adjustment_value = json.temp_adjustment_value;
        this.gyro_disabled = json.gyro_disabled;
        this.voltage_pin = json.voltage_pin;
        this.wifi_portal_timeout = json.wifi_portal_timeout;
        this.wifi_connect_timeout = json.wifi_connect_timeout;
        this.wifi_ssid = json.wifi_ssid;
        this.wifi_ssid2 = json.wifi_ssid2;
        this.wifi_pass = json.wifi_pass;
        this.wifi_pass2 = json.wifi_pass2;
        this.wifi_direct_ssid = json.wifi_direct_ssid;
        this.wifi_direct_pass = json.wifi_direct_pass;
        this.use_wifi_direct = json.use_wifi_direct;
        this.wifi_scan_ap = json.wifi_scan_ap;
        this.token = json.token;
        this.token2 = json.token2;
        this.sleep_interval = json.sleep_interval;
        this.push_timeout = json.push_timeout;
        this.skip_ssl_on_test = json.skip_ssl_on_test;
        this.http_post_target = json.http_post_target;
        this.http_post_header1 = json.http_post_header1;
        this.http_post_header2 = json.http_post_header2;
        this.http_post_int = json.http_post_int;
        this.http_post_format = json.http_post_format;
        this.http_post2_target = json.http_post2_target;
        this.http_post2_header1 = json.http_post2_header1;
        this.http_post2_header2 = json.http_post2_header2;
        this.http_post2_int = json.http_post2_int;
        this.http_post2_format = json.http_post2_format;
        this.http_get_target = json.http_get_target;
        this.http_get_header1 = json.http_get_header1;
        this.http_get_header2 = json.http_get_header2;
        this.http_get_int = json.http_get_int;
        this.http_get_format = json.http_get_format;
        this.influxdb2_target = json.influxdb2_target;
        this.influxdb2_org = json.influxdb2_org;
        this.influxdb2_bucket = json.influxdb2_bucket;
        this.influxdb2_token = json.influxdb2_token;
        this.influxdb2_int = json.influxdb2_int;
        this.influxdb2_format = json.influxdb2_format;
        this.mqtt_target = json.mqtt_target;
        this.mqtt_port = json.mqtt_port;
        this.mqtt_user = json.mqtt_user;
        this.mqtt_pass = json.mqtt_pass;
        this.mqtt_int = json.mqtt_int;
        this.mqtt_format = json.mqtt_format;
        this.ble_tilt_color = json.ble_tilt_color;
        this.ble_format = json.ble_format;
        this.gravity_formula = json.gravity_formula;
        this.gravity_temp_adjustment = json.gravity_temp_adjustment;
        this.gyro_read_count = json.gyro_read_count;
        this.gyro_moving_threashold = json.gyro_moving_threashold;
        this.formula_max_deviation = json.formula_max_deviation;
        this.formula_calibration_temp = json.formula_calibration_temp;
        this.ignore_low_angles = json.ignore_low_angles;
        this.formula_calculation_data = json.formula_calculation_data;
        this.gyro_calibration_data = json.gyro_calibration_data;
        this.dark_mode = json.dark_mode;
        callback(true);
      }).catch((err) => {
        global$1.disabled = false;
        logError("configStore.load()", err);
        callback(false);
      });
    },
    loadFormat(callback) {
      global$1.disabled = true;
      logInfo("configStore.loadFormat()", "Fetching /api/format");
      fetch(global$1.baseURL + "api/format", {
        method: "GET",
        headers: { Authorization: global$1.token },
        signal: AbortSignal.timeout(global$1.fetchTimout)
      }).then((res) => res.json()).then((json) => {
        global$1.disabled = false;
        this.http_post_format = decodeURIComponent(json.http_post_format);
        this.http_post2_format = decodeURIComponent(json.http_post2_format);
        this.http_get_format = decodeURIComponent(json.http_get_format);
        this.influxdb2_format = decodeURIComponent(json.influxdb2_format);
        this.mqtt_format = decodeURIComponent(json.mqtt_format);
        this.mqtt_format = this.mqtt_format.replaceAll("|", "|\n");
        callback(true);
      }).catch((err) => {
        global$1.disabled = false;
        logError("configStore.loadFormat()", err);
        callback(false);
      });
    },
    sendConfig(callback) {
      global$1.disabled = true;
      logInfo("configStore.sendConfig()", "Sending /api/config");
      var data = getConfigChanges();
      delete data.http_post_format;
      delete data.http_post2_format;
      delete data.http_get_format;
      delete data.influxdb2_format;
      delete data.mqtt_format;
      if (JSON.stringify(data).length == 2) {
        logInfo("configStore.sendConfig()", "No config data to store, skipping step");
        global$1.disabled = false;
        callback(true);
        return;
      }
      fetch(global$1.baseURL + "api/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: global$1.token
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(global$1.fetchTimout)
      }).then((res) => {
        global$1.disabled = false;
        if (res.status != 200) {
          logError("configStore.sendConfig()", "Sending /api/config failed", res.status);
          callback(false);
        } else {
          logInfo("configStore.sendConfig()", "Sending /api/config completed");
          callback(true);
        }
      }).catch((err) => {
        logError("configStore.sendConfig()", err);
        callback(false);
        global$1.disabled = false;
      });
    },
    sendFormat(callback) {
      global$1.disabled = true;
      logInfo("configStore.sendFormat()", "Sending /api/format");
      var data2 = getConfigChanges();
      var data = {};
      var cnt = 0;
      data = data2.http_post_format !== void 0 ? { http_post_format: encodeURIComponent(data2.http_post_format) } : {};
      this.sendOneFormat(data, (success) => {
        if (success) cnt += 1;
        data = data2.http_post2_format !== void 0 ? { http_post2_format: encodeURIComponent(data2.http_post2_format) } : {};
        this.sendOneFormat(data, (success2) => {
          if (success2) cnt += 1;
          data = data2.http_get_format !== void 0 ? { http_get_format: encodeURIComponent(data2.http_get_format) } : {};
          this.sendOneFormat(data, (success3) => {
            if (success3) cnt += 1;
            data = data2.influxdb2_format !== void 0 ? {
              influxdb2_format: encodeURIComponent(data2.influxdb2_format)
            } : {};
            this.sendOneFormat(data, (success4) => {
              if (success4) cnt += 1;
              if (data2.mqtt_format !== void 0) {
                data2.mqtt_format = data2.mqtt_format.replaceAll("\n", "");
                data2.mqtt_format = data2.mqtt_format.replaceAll("\r", "");
              }
              data = data2.mqtt_format !== void 0 ? { mqtt_format: encodeURIComponent(data2.mqtt_format) } : {};
              this.sendOneFormat(data, (success5) => {
                if (success5) cnt += 1;
                if (cnt == 5) callback(true);
                else callback(false);
              });
            });
          });
        });
      });
    },
    sendOneFormat(data, callback) {
      logInfo("configStore.sendOneFormat()", "Sending /api/format");
      if (JSON.stringify(data).length == 2) {
        logInfo("configStore.sendOneFormat()", "No format data to store, skipping step");
        callback(true);
        return;
      }
      fetch(global$1.baseURL + "api/format", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: global$1.token
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(global$1.fetchTimout)
      }).then((res) => {
        global$1.disabled = false;
        if (res.status != 200) {
          logError("configStore.sendOneFormat()", "Sending /api/format failed");
          callback(false);
        } else {
          logInfo("configStore.sendOneFormat()", "Sending /api/format completed");
          callback(true);
        }
      }).catch((err) => {
        logError("configStore.sendOneFormat()", err);
        callback(false);
      });
    },
    sendPushTest(data, callback) {
      global$1.disabled = true;
      logInfo("configStore.sendPushTest()", "Sending /api/push");
      fetch(global$1.baseURL + "api/push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: global$1.token
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(global$1.fetchTimout)
      }).then((res) => {
        if (res.status != 200) {
          logError("configStore.sendPushTest()", "Sending /api/push failed");
          callback(false);
        } else {
          logInfo("configStore.sendPushTest()", "Sending /api/push completed");
          callback(true);
        }
      }).catch((err) => {
        logError("configStore.sendPushTest()", err);
        callback(false);
      });
    },
    getPushTestStatus(callback) {
      logInfo("configStore.getPushTest()", "Fetching /api/push/status");
      fetch(global$1.baseURL + "api/push/status", {
        signal: AbortSignal.timeout(global$1.fetchTimout)
      }).then((res) => res.json()).then((json) => {
        logInfo("configStore.getPushTest()", "Fetching /api/push/status completed");
        callback(true, json);
      }).catch((err) => {
        logError("configStore.getPushTest()", err);
        callback(false, null);
      });
    },
    sendWifiScan(callback) {
      global$1.disabled = true;
      logInfo("configStore.sendWifiScan()", "Sending /api/wifi");
      fetch(global$1.baseURL + "api/wifi", {
        headers: { Authorization: global$1.token },
        signal: AbortSignal.timeout(global$1.fetchTimout)
      }).then((res) => {
        if (res.status != 200) {
          logError("configStore.sendWifiScan()", "Sending /api/wifi failed");
          callback(false);
        } else {
          logInfo("configStore.sendWifiScan()", "Sending /api/wifi completed");
          callback(true);
        }
      }).catch((err) => {
        logError("configStore.sendWifiScan()", err);
        callback(false);
      });
    },
    getWifiScanStatus(callback) {
      logInfo("configStore.getWifiScanStatus()", "Fetching /api/wifi/status");
      fetch(global$1.baseURL + "api/wifi/status", {
        method: "GET",
        headers: { Authorization: global$1.token },
        signal: AbortSignal.timeout(global$1.fetchTimout)
      }).then((res) => res.json()).then((json) => {
        logInfo("configStore.getWifiScanStatus()", "Fetching /api/wifi/status completed");
        callback(true, json);
      }).catch((err) => {
        logError("configStore.getWifiScanStatus()", err);
        callback(false, null);
      });
    },
    sendHardwareScan(callback) {
      global$1.disabled = true;
      logInfo("configStore.sendHardwareScan()", "Sending /api/hardware");
      fetch(global$1.baseURL + "api/hardware", {
        headers: { Authorization: global$1.token },
        signal: AbortSignal.timeout(global$1.fetchTimout)
      }).then((res) => {
        if (res.status != 200) {
          logError("configStore.sendHardwareScan()", "Sending /api/hardware failed");
          callback(false);
        } else {
          logInfo("configStore.sendHardwareScan()", "Sending /api/hardware completed");
          callback(true);
        }
      }).catch((err) => {
        logError("configStore.sendHardwareScan()", err);
        callback(false);
      });
    },
    getHardwareScanStatus(callback) {
      logInfo("configStore.getHardwareScanStatus()", "Fetching /api/hardware/status");
      fetch(global$1.baseURL + "api/hardware/status", {
        method: "GET",
        headers: { Authorization: global$1.token },
        signal: AbortSignal.timeout(global$1.fetchTimout)
      }).then((res) => res.json()).then((json) => {
        logInfo("configStore.getHardwareScanStatus()", "Fetching /api/hardware/status completed");
        callback(true, json);
      }).catch((err) => {
        logError("configStore.getHardwareScanStatus()", err);
        callback(false, null);
      });
    },
    saveAll() {
      global$1.clearMessages();
      global$1.disabled = true;
      this.sendConfig((success) => {
        if (!success) {
          global$1.disabled = false;
          global$1.messageError = "Failed to store configuration to device";
        } else {
          this.sendFormat((success2) => {
            global$1.disabled = false;
            if (!success2) {
              global$1.messageError = "Failed to store format to device";
            } else {
              global$1.messageSuccess = "Configuration has been saved to device";
              saveConfigState();
            }
          });
        }
      });
    },
    sendFilesystemRequest(data, callback) {
      global$1.disabled = true;
      logInfo("configStore.sendFilesystemRequest()", "Sending /api/filesystem");
      fetch(global$1.baseURL + "api/filesystem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: global$1.token
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(global$1.fetchTimout)
      }).then((res) => res.text()).then((text) => {
        callback(true, text);
      }).catch((err) => {
        logError("configStore.sendFilesystemRequest()", err);
        callback(false, "");
      });
    },
    runPushTest(data, callback) {
      global$1.disabled = true;
      this.sendPushTest(data, (success) => {
        if (success) {
          var check = setInterval(() => {
            this.getPushTestStatus((success2, data2) => {
              if (success2) {
                if (data2.status) ;
                else {
                  global$1.disabled = false;
                  if (!data2.push_enabled) {
                    global$1.messageWarning = "No endpoint is defined for this target. Cannot run test.";
                  } else if (!data2.success) {
                    global$1.messageError = "Test failed with error code " + getErrorString(data2.last_error);
                  } else {
                    global$1.messageSuccess = "Test was successful";
                  }
                  callback(true);
                  clearInterval(check);
                }
              } else {
                global$1.disabled = false;
                global$1.messageError = "Failed to get push test status";
                callback(false);
                clearInterval(check);
              }
            });
          }, 2e3);
        } else {
          global$1.messageError = "Failed to start push test";
          global$1.disabled = false;
          callback(false);
        }
      });
    },
    runWifiScan(callback) {
      global$1.disabled = true;
      this.sendWifiScan((success) => {
        if (success) {
          var check = setInterval(() => {
            this.getWifiScanStatus((success2, data) => {
              if (success2) {
                if (data.status) ;
                else {
                  global$1.disabled = false;
                  callback(data.success, data);
                  clearInterval(check);
                }
              } else {
                global$1.disabled = false;
                global$1.messageError = "Failed to get wifi scan status";
                callback(false);
                clearInterval(check);
              }
            });
          }, 2e3);
        } else {
          global$1.disabled = false;
          global$1.messageError = "Failed to start wifi scan";
          callback(false);
        }
      });
    },
    runHardwareScan(callback) {
      global$1.disabled = true;
      this.sendHardwareScan((success) => {
        if (success) {
          var check = setInterval(() => {
            this.getHardwareScanStatus((success2, data) => {
              if (success2) {
                if (data.status) ;
                else {
                  global$1.disabled = false;
                  callback(data.success, data);
                  clearInterval(check);
                }
              } else {
                global$1.disabled = false;
                global$1.messageError = "Failed to get hardware scan status";
                callback(false);
                clearInterval(check);
              }
            });
          }, 2e3);
        } else {
          global$1.disabled = false;
          global$1.messageError = "Failed to start hardware scan";
          callback(false);
        }
      });
    }
  }
});
const piniaInstance = createPinia();
const config = useConfigStore(piniaInstance);
const global$1 = useGlobalStore(piniaInstance);
const status = useStatusStore(piniaInstance);
const configCompare = ref(null);
const saveConfigState = () => {
  logInfo("pinia.saveConfigState()", "Saving state");
  configCompare.value = {};
  for (var key in config) {
    if (typeof config[key] !== "function" && key !== "$id") {
      if (key === "gyro_calibration_data") ;
      else if (key === "formula_calculation_data") {
        configCompare.value[key] = [];
        for (var i in config[key]) {
          var o = { a: config[key][i].a, g: config[key][i].g };
          configCompare.value[key].push(o);
        }
      } else {
        configCompare.value[key] = config[key];
      }
    }
  }
  logInfo("pinia.saveConfigState()", "Saved state: ", configCompare.value);
  global$1.configChanged = false;
};
const getConfigChanges = () => {
  var changes = {};
  if (configCompare.value === null) {
    logInfo("pinia.getConfigChanges()", "configState not saved");
    return changes;
  }
  for (var key in configCompare.value) {
    if (key === "gyro_calibration_data") ;
    else if (key === "formula_calculation_data") {
      for (var i in configCompare.value[key]) {
        if (configCompare.value[key][i].a != config[key][i].a) {
          changes.formula_calculation_data = config.formula_calculation_data;
        }
        if (configCompare.value[key][i].g != config[key][i].g) {
          changes.formula_calculation_data = config.formula_calculation_data;
        }
      }
    } else {
      if (configCompare.value[key] != config[key]) {
        changes[key] = config[key];
      }
    }
  }
  return changes;
};
config.$subscribe(() => {
  if (!global$1.initialized) return;
  var changes = getConfigChanges();
  logInfo("pinia.subscribe()", "State change on configStore", changes);
  if (JSON.stringify(changes).length > 2) {
    global$1.configChanged = true;
    logInfo("pinia.subscribe()", "Changed properties:", changes);
  } else {
    global$1.configChanged = false;
  }
});
/*!
  * vue-router v4.4.3
  * (c) 2024 Eduardo San Martin Morote
  * @license MIT
  */
const isBrowser = typeof document !== "undefined";
function isESModule(obj) {
  return obj.__esModule || obj[Symbol.toStringTag] === "Module";
}
const assign = Object.assign;
function applyToParams(fn, params) {
  const newParams = {};
  for (const key in params) {
    const value = params[key];
    newParams[key] = isArray(value) ? value.map(fn) : fn(value);
  }
  return newParams;
}
const noop = () => {
};
const isArray = Array.isArray;
const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const IM_RE = /\?/g;
const PLUS_RE = /\+/g;
const ENC_BRACKET_OPEN_RE = /%5B/g;
const ENC_BRACKET_CLOSE_RE = /%5D/g;
const ENC_CARET_RE = /%5E/g;
const ENC_BACKTICK_RE = /%60/g;
const ENC_CURLY_OPEN_RE = /%7B/g;
const ENC_PIPE_RE = /%7C/g;
const ENC_CURLY_CLOSE_RE = /%7D/g;
const ENC_SPACE_RE = /%20/g;
function commonEncode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|").replace(ENC_BRACKET_OPEN_RE, "[").replace(ENC_BRACKET_CLOSE_RE, "]");
}
function encodeHash(text) {
  return commonEncode(text).replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
function encodeQueryValue(text) {
  return commonEncode(text).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function encodePath(text) {
  return commonEncode(text).replace(HASH_RE, "%23").replace(IM_RE, "%3F");
}
function encodeParam(text) {
  return text == null ? "" : encodePath(text).replace(SLASH_RE, "%2F");
}
function decode(text) {
  try {
    return decodeURIComponent("" + text);
  } catch (err) {
  }
  return "" + text;
}
const TRAILING_SLASH_RE = /\/$/;
const removeTrailingSlash = (path) => path.replace(TRAILING_SLASH_RE, "");
function parseURL(parseQuery2, location2, currentLocation = "/") {
  let path, query = {}, searchString = "", hash = "";
  const hashPos = location2.indexOf("#");
  let searchPos = location2.indexOf("?");
  if (hashPos < searchPos && hashPos >= 0) {
    searchPos = -1;
  }
  if (searchPos > -1) {
    path = location2.slice(0, searchPos);
    searchString = location2.slice(searchPos + 1, hashPos > -1 ? hashPos : location2.length);
    query = parseQuery2(searchString);
  }
  if (hashPos > -1) {
    path = path || location2.slice(0, hashPos);
    hash = location2.slice(hashPos, location2.length);
  }
  path = resolveRelativePath(path != null ? path : location2, currentLocation);
  return {
    fullPath: path + (searchString && "?") + searchString + hash,
    path,
    query,
    hash: decode(hash)
  };
}
function stringifyURL(stringifyQuery2, location2) {
  const query = location2.query ? stringifyQuery2(location2.query) : "";
  return location2.path + (query && "?") + query + (location2.hash || "");
}
function stripBase(pathname, base) {
  if (!base || !pathname.toLowerCase().startsWith(base.toLowerCase()))
    return pathname;
  return pathname.slice(base.length) || "/";
}
function isSameRouteLocation(stringifyQuery2, a2, b) {
  const aLastIndex = a2.matched.length - 1;
  const bLastIndex = b.matched.length - 1;
  return aLastIndex > -1 && aLastIndex === bLastIndex && isSameRouteRecord(a2.matched[aLastIndex], b.matched[bLastIndex]) && isSameRouteLocationParams(a2.params, b.params) && stringifyQuery2(a2.query) === stringifyQuery2(b.query) && a2.hash === b.hash;
}
function isSameRouteRecord(a2, b) {
  return (a2.aliasOf || a2) === (b.aliasOf || b);
}
function isSameRouteLocationParams(a2, b) {
  if (Object.keys(a2).length !== Object.keys(b).length)
    return false;
  for (const key in a2) {
    if (!isSameRouteLocationParamsValue(a2[key], b[key]))
      return false;
  }
  return true;
}
function isSameRouteLocationParamsValue(a2, b) {
  return isArray(a2) ? isEquivalentArray(a2, b) : isArray(b) ? isEquivalentArray(b, a2) : a2 === b;
}
function isEquivalentArray(a2, b) {
  return isArray(b) ? a2.length === b.length && a2.every((value, i) => value === b[i]) : a2.length === 1 && a2[0] === b;
}
function resolveRelativePath(to, from) {
  if (to.startsWith("/"))
    return to;
  if (!to)
    return from;
  const fromSegments = from.split("/");
  const toSegments = to.split("/");
  const lastToSegment = toSegments[toSegments.length - 1];
  if (lastToSegment === ".." || lastToSegment === ".") {
    toSegments.push("");
  }
  let position = fromSegments.length - 1;
  let toPosition;
  let segment;
  for (toPosition = 0; toPosition < toSegments.length; toPosition++) {
    segment = toSegments[toPosition];
    if (segment === ".")
      continue;
    if (segment === "..") {
      if (position > 1)
        position--;
    } else
      break;
  }
  return fromSegments.slice(0, position).join("/") + "/" + toSegments.slice(toPosition).join("/");
}
const START_LOCATION_NORMALIZED = {
  path: "/",
  // TODO: could we use a symbol in the future?
  name: void 0,
  params: {},
  query: {},
  hash: "",
  fullPath: "/",
  matched: [],
  meta: {},
  redirectedFrom: void 0
};
var NavigationType;
(function(NavigationType2) {
  NavigationType2["pop"] = "pop";
  NavigationType2["push"] = "push";
})(NavigationType || (NavigationType = {}));
var NavigationDirection;
(function(NavigationDirection2) {
  NavigationDirection2["back"] = "back";
  NavigationDirection2["forward"] = "forward";
  NavigationDirection2["unknown"] = "";
})(NavigationDirection || (NavigationDirection = {}));
function normalizeBase(base) {
  if (!base) {
    if (isBrowser) {
      const baseEl = document.querySelector("base");
      base = baseEl && baseEl.getAttribute("href") || "/";
      base = base.replace(/^\w+:\/\/[^\/]+/, "");
    } else {
      base = "/";
    }
  }
  if (base[0] !== "/" && base[0] !== "#")
    base = "/" + base;
  return removeTrailingSlash(base);
}
const BEFORE_HASH_RE = /^[^#]+#/;
function createHref(base, location2) {
  return base.replace(BEFORE_HASH_RE, "#") + location2;
}
function getElementPosition(el, offset) {
  const docRect = document.documentElement.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  return {
    behavior: offset.behavior,
    left: elRect.left - docRect.left - (offset.left || 0),
    top: elRect.top - docRect.top - (offset.top || 0)
  };
}
const computeScrollPosition = () => ({
  left: window.scrollX,
  top: window.scrollY
});
function scrollToPosition(position) {
  let scrollToOptions;
  if ("el" in position) {
    const positionEl = position.el;
    const isIdSelector = typeof positionEl === "string" && positionEl.startsWith("#");
    const el = typeof positionEl === "string" ? isIdSelector ? document.getElementById(positionEl.slice(1)) : document.querySelector(positionEl) : positionEl;
    if (!el) {
      return;
    }
    scrollToOptions = getElementPosition(el, position);
  } else {
    scrollToOptions = position;
  }
  if ("scrollBehavior" in document.documentElement.style)
    window.scrollTo(scrollToOptions);
  else {
    window.scrollTo(scrollToOptions.left != null ? scrollToOptions.left : window.scrollX, scrollToOptions.top != null ? scrollToOptions.top : window.scrollY);
  }
}
function getScrollKey(path, delta) {
  const position = history.state ? history.state.position - delta : -1;
  return position + path;
}
const scrollPositions = /* @__PURE__ */ new Map();
function saveScrollPosition(key, scrollPosition) {
  scrollPositions.set(key, scrollPosition);
}
function getSavedScrollPosition(key) {
  const scroll = scrollPositions.get(key);
  scrollPositions.delete(key);
  return scroll;
}
let createBaseLocation = () => location.protocol + "//" + location.host;
function createCurrentLocation(base, location2) {
  const { pathname, search, hash } = location2;
  const hashPos = base.indexOf("#");
  if (hashPos > -1) {
    let slicePos = hash.includes(base.slice(hashPos)) ? base.slice(hashPos).length : 1;
    let pathFromHash = hash.slice(slicePos);
    if (pathFromHash[0] !== "/")
      pathFromHash = "/" + pathFromHash;
    return stripBase(pathFromHash, "");
  }
  const path = stripBase(pathname, base);
  return path + search + hash;
}
function useHistoryListeners(base, historyState, currentLocation, replace) {
  let listeners = [];
  let teardowns = [];
  let pauseState = null;
  const popStateHandler = ({ state }) => {
    const to = createCurrentLocation(base, location);
    const from = currentLocation.value;
    const fromState = historyState.value;
    let delta = 0;
    if (state) {
      currentLocation.value = to;
      historyState.value = state;
      if (pauseState && pauseState === from) {
        pauseState = null;
        return;
      }
      delta = fromState ? state.position - fromState.position : 0;
    } else {
      replace(to);
    }
    listeners.forEach((listener) => {
      listener(currentLocation.value, from, {
        delta,
        type: NavigationType.pop,
        direction: delta ? delta > 0 ? NavigationDirection.forward : NavigationDirection.back : NavigationDirection.unknown
      });
    });
  };
  function pauseListeners() {
    pauseState = currentLocation.value;
  }
  function listen(callback) {
    listeners.push(callback);
    const teardown = () => {
      const index = listeners.indexOf(callback);
      if (index > -1)
        listeners.splice(index, 1);
    };
    teardowns.push(teardown);
    return teardown;
  }
  function beforeUnloadListener() {
    const { history: history2 } = window;
    if (!history2.state)
      return;
    history2.replaceState(assign({}, history2.state, { scroll: computeScrollPosition() }), "");
  }
  function destroy() {
    for (const teardown of teardowns)
      teardown();
    teardowns = [];
    window.removeEventListener("popstate", popStateHandler);
    window.removeEventListener("beforeunload", beforeUnloadListener);
  }
  window.addEventListener("popstate", popStateHandler);
  window.addEventListener("beforeunload", beforeUnloadListener, {
    passive: true
  });
  return {
    pauseListeners,
    listen,
    destroy
  };
}
function buildState(back, current, forward, replaced = false, computeScroll = false) {
  return {
    back,
    current,
    forward,
    replaced,
    position: window.history.length,
    scroll: computeScroll ? computeScrollPosition() : null
  };
}
function useHistoryStateNavigation(base) {
  const { history: history2, location: location2 } = window;
  const currentLocation = {
    value: createCurrentLocation(base, location2)
  };
  const historyState = { value: history2.state };
  if (!historyState.value) {
    changeLocation(currentLocation.value, {
      back: null,
      current: currentLocation.value,
      forward: null,
      // the length is off by one, we need to decrease it
      position: history2.length - 1,
      replaced: true,
      // don't add a scroll as the user may have an anchor, and we want
      // scrollBehavior to be triggered without a saved position
      scroll: null
    }, true);
  }
  function changeLocation(to, state, replace2) {
    const hashIndex = base.indexOf("#");
    const url = hashIndex > -1 ? (location2.host && document.querySelector("base") ? base : base.slice(hashIndex)) + to : createBaseLocation() + base + to;
    try {
      history2[replace2 ? "replaceState" : "pushState"](state, "", url);
      historyState.value = state;
    } catch (err) {
      {
        console.error(err);
      }
      location2[replace2 ? "replace" : "assign"](url);
    }
  }
  function replace(to, data) {
    const state = assign({}, history2.state, buildState(
      historyState.value.back,
      // keep back and forward entries but override current position
      to,
      historyState.value.forward,
      true
    ), data, { position: historyState.value.position });
    changeLocation(to, state, true);
    currentLocation.value = to;
  }
  function push(to, data) {
    const currentState = assign(
      {},
      // use current history state to gracefully handle a wrong call to
      // history.replaceState
      // https://github.com/vuejs/router/issues/366
      historyState.value,
      history2.state,
      {
        forward: to,
        scroll: computeScrollPosition()
      }
    );
    changeLocation(currentState.current, currentState, true);
    const state = assign({}, buildState(currentLocation.value, to, null), { position: currentState.position + 1 }, data);
    changeLocation(to, state, false);
    currentLocation.value = to;
  }
  return {
    location: currentLocation,
    state: historyState,
    push,
    replace
  };
}
function createWebHistory(base) {
  base = normalizeBase(base);
  const historyNavigation = useHistoryStateNavigation(base);
  const historyListeners = useHistoryListeners(base, historyNavigation.state, historyNavigation.location, historyNavigation.replace);
  function go(delta, triggerListeners = true) {
    if (!triggerListeners)
      historyListeners.pauseListeners();
    history.go(delta);
  }
  const routerHistory = assign({
    // it's overridden right after
    location: "",
    base,
    go,
    createHref: createHref.bind(null, base)
  }, historyNavigation, historyListeners);
  Object.defineProperty(routerHistory, "location", {
    enumerable: true,
    get: () => historyNavigation.location.value
  });
  Object.defineProperty(routerHistory, "state", {
    enumerable: true,
    get: () => historyNavigation.state.value
  });
  return routerHistory;
}
function isRouteLocation(route) {
  return typeof route === "string" || route && typeof route === "object";
}
function isRouteName(name) {
  return typeof name === "string" || typeof name === "symbol";
}
const NavigationFailureSymbol = Symbol("");
var NavigationFailureType;
(function(NavigationFailureType2) {
  NavigationFailureType2[NavigationFailureType2["aborted"] = 4] = "aborted";
  NavigationFailureType2[NavigationFailureType2["cancelled"] = 8] = "cancelled";
  NavigationFailureType2[NavigationFailureType2["duplicated"] = 16] = "duplicated";
})(NavigationFailureType || (NavigationFailureType = {}));
function createRouterError(type, params) {
  {
    return assign(new Error(), {
      type,
      [NavigationFailureSymbol]: true
    }, params);
  }
}
function isNavigationFailure(error, type) {
  return error instanceof Error && NavigationFailureSymbol in error && (type == null || !!(error.type & type));
}
const BASE_PARAM_PATTERN = "[^/]+?";
const BASE_PATH_PARSER_OPTIONS = {
  sensitive: false,
  strict: false,
  start: true,
  end: true
};
const REGEX_CHARS_RE = /[.+*?^${}()[\]/\\]/g;
function tokensToParser(segments, extraOptions) {
  const options = assign({}, BASE_PATH_PARSER_OPTIONS, extraOptions);
  const score = [];
  let pattern = options.start ? "^" : "";
  const keys = [];
  for (const segment of segments) {
    const segmentScores = segment.length ? [] : [
      90
      /* PathScore.Root */
    ];
    if (options.strict && !segment.length)
      pattern += "/";
    for (let tokenIndex = 0; tokenIndex < segment.length; tokenIndex++) {
      const token = segment[tokenIndex];
      let subSegmentScore = 40 + (options.sensitive ? 0.25 : 0);
      if (token.type === 0) {
        if (!tokenIndex)
          pattern += "/";
        pattern += token.value.replace(REGEX_CHARS_RE, "\\$&");
        subSegmentScore += 40;
      } else if (token.type === 1) {
        const { value, repeatable, optional, regexp } = token;
        keys.push({
          name: value,
          repeatable,
          optional
        });
        const re2 = regexp ? regexp : BASE_PARAM_PATTERN;
        if (re2 !== BASE_PARAM_PATTERN) {
          subSegmentScore += 10;
          try {
            new RegExp(`(${re2})`);
          } catch (err) {
            throw new Error(`Invalid custom RegExp for param "${value}" (${re2}): ` + err.message);
          }
        }
        let subPattern = repeatable ? `((?:${re2})(?:/(?:${re2}))*)` : `(${re2})`;
        if (!tokenIndex)
          subPattern = // avoid an optional / if there are more segments e.g. /:p?-static
          // or /:p?-:p2
          optional && segment.length < 2 ? `(?:/${subPattern})` : "/" + subPattern;
        if (optional)
          subPattern += "?";
        pattern += subPattern;
        subSegmentScore += 20;
        if (optional)
          subSegmentScore += -8;
        if (repeatable)
          subSegmentScore += -20;
        if (re2 === ".*")
          subSegmentScore += -50;
      }
      segmentScores.push(subSegmentScore);
    }
    score.push(segmentScores);
  }
  if (options.strict && options.end) {
    const i = score.length - 1;
    score[i][score[i].length - 1] += 0.7000000000000001;
  }
  if (!options.strict)
    pattern += "/?";
  if (options.end)
    pattern += "$";
  else if (options.strict)
    pattern += "(?:/|$)";
  const re = new RegExp(pattern, options.sensitive ? "" : "i");
  function parse(path) {
    const match = path.match(re);
    const params = {};
    if (!match)
      return null;
    for (let i = 1; i < match.length; i++) {
      const value = match[i] || "";
      const key = keys[i - 1];
      params[key.name] = value && key.repeatable ? value.split("/") : value;
    }
    return params;
  }
  function stringify(params) {
    let path = "";
    let avoidDuplicatedSlash = false;
    for (const segment of segments) {
      if (!avoidDuplicatedSlash || !path.endsWith("/"))
        path += "/";
      avoidDuplicatedSlash = false;
      for (const token of segment) {
        if (token.type === 0) {
          path += token.value;
        } else if (token.type === 1) {
          const { value, repeatable, optional } = token;
          const param = value in params ? params[value] : "";
          if (isArray(param) && !repeatable) {
            throw new Error(`Provided param "${value}" is an array but it is not repeatable (* or + modifiers)`);
          }
          const text = isArray(param) ? param.join("/") : param;
          if (!text) {
            if (optional) {
              if (segment.length < 2) {
                if (path.endsWith("/"))
                  path = path.slice(0, -1);
                else
                  avoidDuplicatedSlash = true;
              }
            } else
              throw new Error(`Missing required param "${value}"`);
          }
          path += text;
        }
      }
    }
    return path || "/";
  }
  return {
    re,
    score,
    keys,
    parse,
    stringify
  };
}
function compareScoreArray(a2, b) {
  let i = 0;
  while (i < a2.length && i < b.length) {
    const diff = b[i] - a2[i];
    if (diff)
      return diff;
    i++;
  }
  if (a2.length < b.length) {
    return a2.length === 1 && a2[0] === 40 + 40 ? -1 : 1;
  } else if (a2.length > b.length) {
    return b.length === 1 && b[0] === 40 + 40 ? 1 : -1;
  }
  return 0;
}
function comparePathParserScore(a2, b) {
  let i = 0;
  const aScore = a2.score;
  const bScore = b.score;
  while (i < aScore.length && i < bScore.length) {
    const comp = compareScoreArray(aScore[i], bScore[i]);
    if (comp)
      return comp;
    i++;
  }
  if (Math.abs(bScore.length - aScore.length) === 1) {
    if (isLastScoreNegative(aScore))
      return 1;
    if (isLastScoreNegative(bScore))
      return -1;
  }
  return bScore.length - aScore.length;
}
function isLastScoreNegative(score) {
  const last = score[score.length - 1];
  return score.length > 0 && last[last.length - 1] < 0;
}
const ROOT_TOKEN = {
  type: 0,
  value: ""
};
const VALID_PARAM_RE = /[a-zA-Z0-9_]/;
function tokenizePath(path) {
  if (!path)
    return [[]];
  if (path === "/")
    return [[ROOT_TOKEN]];
  if (!path.startsWith("/")) {
    throw new Error(`Invalid path "${path}"`);
  }
  function crash(message) {
    throw new Error(`ERR (${state})/"${buffer}": ${message}`);
  }
  let state = 0;
  let previousState = state;
  const tokens = [];
  let segment;
  function finalizeSegment() {
    if (segment)
      tokens.push(segment);
    segment = [];
  }
  let i = 0;
  let char;
  let buffer = "";
  let customRe = "";
  function consumeBuffer() {
    if (!buffer)
      return;
    if (state === 0) {
      segment.push({
        type: 0,
        value: buffer
      });
    } else if (state === 1 || state === 2 || state === 3) {
      if (segment.length > 1 && (char === "*" || char === "+"))
        crash(`A repeatable param (${buffer}) must be alone in its segment. eg: '/:ids+.`);
      segment.push({
        type: 1,
        value: buffer,
        regexp: customRe,
        repeatable: char === "*" || char === "+",
        optional: char === "*" || char === "?"
      });
    } else {
      crash("Invalid state to consume buffer");
    }
    buffer = "";
  }
  function addCharToBuffer() {
    buffer += char;
  }
  while (i < path.length) {
    char = path[i++];
    if (char === "\\" && state !== 2) {
      previousState = state;
      state = 4;
      continue;
    }
    switch (state) {
      case 0:
        if (char === "/") {
          if (buffer) {
            consumeBuffer();
          }
          finalizeSegment();
        } else if (char === ":") {
          consumeBuffer();
          state = 1;
        } else {
          addCharToBuffer();
        }
        break;
      case 4:
        addCharToBuffer();
        state = previousState;
        break;
      case 1:
        if (char === "(") {
          state = 2;
        } else if (VALID_PARAM_RE.test(char)) {
          addCharToBuffer();
        } else {
          consumeBuffer();
          state = 0;
          if (char !== "*" && char !== "?" && char !== "+")
            i--;
        }
        break;
      case 2:
        if (char === ")") {
          if (customRe[customRe.length - 1] == "\\")
            customRe = customRe.slice(0, -1) + char;
          else
            state = 3;
        } else {
          customRe += char;
        }
        break;
      case 3:
        consumeBuffer();
        state = 0;
        if (char !== "*" && char !== "?" && char !== "+")
          i--;
        customRe = "";
        break;
      default:
        crash("Unknown state");
        break;
    }
  }
  if (state === 2)
    crash(`Unfinished custom RegExp for param "${buffer}"`);
  consumeBuffer();
  finalizeSegment();
  return tokens;
}
function createRouteRecordMatcher(record, parent, options) {
  const parser = tokensToParser(tokenizePath(record.path), options);
  const matcher = assign(parser, {
    record,
    parent,
    // these needs to be populated by the parent
    children: [],
    alias: []
  });
  if (parent) {
    if (!matcher.record.aliasOf === !parent.record.aliasOf)
      parent.children.push(matcher);
  }
  return matcher;
}
function createRouterMatcher(routes2, globalOptions) {
  const matchers = [];
  const matcherMap = /* @__PURE__ */ new Map();
  globalOptions = mergeOptions({ strict: false, end: true, sensitive: false }, globalOptions);
  function getRecordMatcher(name) {
    return matcherMap.get(name);
  }
  function addRoute(record, parent, originalRecord) {
    const isRootAdd = !originalRecord;
    const mainNormalizedRecord = normalizeRouteRecord(record);
    mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record;
    const options = mergeOptions(globalOptions, record);
    const normalizedRecords = [
      mainNormalizedRecord
    ];
    if ("alias" in record) {
      const aliases = typeof record.alias === "string" ? [record.alias] : record.alias;
      for (const alias of aliases) {
        normalizedRecords.push(assign({}, mainNormalizedRecord, {
          // this allows us to hold a copy of the `components` option
          // so that async components cache is hold on the original record
          components: originalRecord ? originalRecord.record.components : mainNormalizedRecord.components,
          path: alias,
          // we might be the child of an alias
          aliasOf: originalRecord ? originalRecord.record : mainNormalizedRecord
          // the aliases are always of the same kind as the original since they
          // are defined on the same record
        }));
      }
    }
    let matcher;
    let originalMatcher;
    for (const normalizedRecord of normalizedRecords) {
      const { path } = normalizedRecord;
      if (parent && path[0] !== "/") {
        const parentPath = parent.record.path;
        const connectingSlash = parentPath[parentPath.length - 1] === "/" ? "" : "/";
        normalizedRecord.path = parent.record.path + (path && connectingSlash + path);
      }
      matcher = createRouteRecordMatcher(normalizedRecord, parent, options);
      if (originalRecord) {
        originalRecord.alias.push(matcher);
      } else {
        originalMatcher = originalMatcher || matcher;
        if (originalMatcher !== matcher)
          originalMatcher.alias.push(matcher);
        if (isRootAdd && record.name && !isAliasRecord(matcher))
          removeRoute(record.name);
      }
      if (isMatchable(matcher)) {
        insertMatcher(matcher);
      }
      if (mainNormalizedRecord.children) {
        const children = mainNormalizedRecord.children;
        for (let i = 0; i < children.length; i++) {
          addRoute(children[i], matcher, originalRecord && originalRecord.children[i]);
        }
      }
      originalRecord = originalRecord || matcher;
    }
    return originalMatcher ? () => {
      removeRoute(originalMatcher);
    } : noop;
  }
  function removeRoute(matcherRef) {
    if (isRouteName(matcherRef)) {
      const matcher = matcherMap.get(matcherRef);
      if (matcher) {
        matcherMap.delete(matcherRef);
        matchers.splice(matchers.indexOf(matcher), 1);
        matcher.children.forEach(removeRoute);
        matcher.alias.forEach(removeRoute);
      }
    } else {
      const index = matchers.indexOf(matcherRef);
      if (index > -1) {
        matchers.splice(index, 1);
        if (matcherRef.record.name)
          matcherMap.delete(matcherRef.record.name);
        matcherRef.children.forEach(removeRoute);
        matcherRef.alias.forEach(removeRoute);
      }
    }
  }
  function getRoutes() {
    return matchers;
  }
  function insertMatcher(matcher) {
    const index = findInsertionIndex(matcher, matchers);
    matchers.splice(index, 0, matcher);
    if (matcher.record.name && !isAliasRecord(matcher))
      matcherMap.set(matcher.record.name, matcher);
  }
  function resolve2(location2, currentLocation) {
    let matcher;
    let params = {};
    let path;
    let name;
    if ("name" in location2 && location2.name) {
      matcher = matcherMap.get(location2.name);
      if (!matcher)
        throw createRouterError(1, {
          location: location2
        });
      name = matcher.record.name;
      params = assign(
        // paramsFromLocation is a new object
        paramsFromLocation(
          currentLocation.params,
          // only keep params that exist in the resolved location
          // only keep optional params coming from a parent record
          matcher.keys.filter((k) => !k.optional).concat(matcher.parent ? matcher.parent.keys.filter((k) => k.optional) : []).map((k) => k.name)
        ),
        // discard any existing params in the current location that do not exist here
        // #1497 this ensures better active/exact matching
        location2.params && paramsFromLocation(location2.params, matcher.keys.map((k) => k.name))
      );
      path = matcher.stringify(params);
    } else if (location2.path != null) {
      path = location2.path;
      matcher = matchers.find((m) => m.re.test(path));
      if (matcher) {
        params = matcher.parse(path);
        name = matcher.record.name;
      }
    } else {
      matcher = currentLocation.name ? matcherMap.get(currentLocation.name) : matchers.find((m) => m.re.test(currentLocation.path));
      if (!matcher)
        throw createRouterError(1, {
          location: location2,
          currentLocation
        });
      name = matcher.record.name;
      params = assign({}, currentLocation.params, location2.params);
      path = matcher.stringify(params);
    }
    const matched = [];
    let parentMatcher = matcher;
    while (parentMatcher) {
      matched.unshift(parentMatcher.record);
      parentMatcher = parentMatcher.parent;
    }
    return {
      name,
      path,
      params,
      matched,
      meta: mergeMetaFields(matched)
    };
  }
  routes2.forEach((route) => addRoute(route));
  function clearRoutes() {
    matchers.length = 0;
    matcherMap.clear();
  }
  return {
    addRoute,
    resolve: resolve2,
    removeRoute,
    clearRoutes,
    getRoutes,
    getRecordMatcher
  };
}
function paramsFromLocation(params, keys) {
  const newParams = {};
  for (const key of keys) {
    if (key in params)
      newParams[key] = params[key];
  }
  return newParams;
}
function normalizeRouteRecord(record) {
  return {
    path: record.path,
    redirect: record.redirect,
    name: record.name,
    meta: record.meta || {},
    aliasOf: void 0,
    beforeEnter: record.beforeEnter,
    props: normalizeRecordProps(record),
    children: record.children || [],
    instances: {},
    leaveGuards: /* @__PURE__ */ new Set(),
    updateGuards: /* @__PURE__ */ new Set(),
    enterCallbacks: {},
    components: "components" in record ? record.components || null : record.component && { default: record.component }
  };
}
function normalizeRecordProps(record) {
  const propsObject = {};
  const props = record.props || false;
  if ("component" in record) {
    propsObject.default = props;
  } else {
    for (const name in record.components)
      propsObject[name] = typeof props === "object" ? props[name] : props;
  }
  return propsObject;
}
function isAliasRecord(record) {
  while (record) {
    if (record.record.aliasOf)
      return true;
    record = record.parent;
  }
  return false;
}
function mergeMetaFields(matched) {
  return matched.reduce((meta, record) => assign(meta, record.meta), {});
}
function mergeOptions(defaults, partialOptions) {
  const options = {};
  for (const key in defaults) {
    options[key] = key in partialOptions ? partialOptions[key] : defaults[key];
  }
  return options;
}
function findInsertionIndex(matcher, matchers) {
  let lower = 0;
  let upper = matchers.length;
  while (lower !== upper) {
    const mid = lower + upper >> 1;
    const sortOrder = comparePathParserScore(matcher, matchers[mid]);
    if (sortOrder < 0) {
      upper = mid;
    } else {
      lower = mid + 1;
    }
  }
  const insertionAncestor = getInsertionAncestor(matcher);
  if (insertionAncestor) {
    upper = matchers.lastIndexOf(insertionAncestor, upper - 1);
  }
  return upper;
}
function getInsertionAncestor(matcher) {
  let ancestor = matcher;
  while (ancestor = ancestor.parent) {
    if (isMatchable(ancestor) && comparePathParserScore(matcher, ancestor) === 0) {
      return ancestor;
    }
  }
  return;
}
function isMatchable({ record }) {
  return !!(record.name || record.components && Object.keys(record.components).length || record.redirect);
}
function parseQuery(search) {
  const query = {};
  if (search === "" || search === "?")
    return query;
  const hasLeadingIM = search[0] === "?";
  const searchParams = (hasLeadingIM ? search.slice(1) : search).split("&");
  for (let i = 0; i < searchParams.length; ++i) {
    const searchParam = searchParams[i].replace(PLUS_RE, " ");
    const eqPos = searchParam.indexOf("=");
    const key = decode(eqPos < 0 ? searchParam : searchParam.slice(0, eqPos));
    const value = eqPos < 0 ? null : decode(searchParam.slice(eqPos + 1));
    if (key in query) {
      let currentValue = query[key];
      if (!isArray(currentValue)) {
        currentValue = query[key] = [currentValue];
      }
      currentValue.push(value);
    } else {
      query[key] = value;
    }
  }
  return query;
}
function stringifyQuery(query) {
  let search = "";
  for (let key in query) {
    const value = query[key];
    key = encodeQueryKey(key);
    if (value == null) {
      if (value !== void 0) {
        search += (search.length ? "&" : "") + key;
      }
      continue;
    }
    const values = isArray(value) ? value.map((v) => v && encodeQueryValue(v)) : [value && encodeQueryValue(value)];
    values.forEach((value2) => {
      if (value2 !== void 0) {
        search += (search.length ? "&" : "") + key;
        if (value2 != null)
          search += "=" + value2;
      }
    });
  }
  return search;
}
function normalizeQuery(query) {
  const normalizedQuery = {};
  for (const key in query) {
    const value = query[key];
    if (value !== void 0) {
      normalizedQuery[key] = isArray(value) ? value.map((v) => v == null ? null : "" + v) : value == null ? value : "" + value;
    }
  }
  return normalizedQuery;
}
const matchedRouteKey = Symbol("");
const viewDepthKey = Symbol("");
const routerKey = Symbol("");
const routeLocationKey = Symbol("");
const routerViewLocationKey = Symbol("");
function useCallbacks() {
  let handlers = [];
  function add2(handler) {
    handlers.push(handler);
    return () => {
      const i = handlers.indexOf(handler);
      if (i > -1)
        handlers.splice(i, 1);
    };
  }
  function reset() {
    handlers = [];
  }
  return {
    add: add2,
    list: () => handlers.slice(),
    reset
  };
}
function guardToPromiseFn(guard, to, from, record, name, runWithContext = (fn) => fn()) {
  const enterCallbackArray = record && // name is defined if record is because of the function overload
  (record.enterCallbacks[name] = record.enterCallbacks[name] || []);
  return () => new Promise((resolve2, reject) => {
    const next = (valid) => {
      if (valid === false) {
        reject(createRouterError(4, {
          from,
          to
        }));
      } else if (valid instanceof Error) {
        reject(valid);
      } else if (isRouteLocation(valid)) {
        reject(createRouterError(2, {
          from: to,
          to: valid
        }));
      } else {
        if (enterCallbackArray && // since enterCallbackArray is truthy, both record and name also are
        record.enterCallbacks[name] === enterCallbackArray && typeof valid === "function") {
          enterCallbackArray.push(valid);
        }
        resolve2();
      }
    };
    const guardReturn = runWithContext(() => guard.call(record && record.instances[name], to, from, next));
    let guardCall = Promise.resolve(guardReturn);
    if (guard.length < 3)
      guardCall = guardCall.then(next);
    guardCall.catch((err) => reject(err));
  });
}
function extractComponentsGuards(matched, guardType, to, from, runWithContext = (fn) => fn()) {
  const guards = [];
  for (const record of matched) {
    for (const name in record.components) {
      let rawComponent = record.components[name];
      if (guardType !== "beforeRouteEnter" && !record.instances[name])
        continue;
      if (isRouteComponent(rawComponent)) {
        const options = rawComponent.__vccOpts || rawComponent;
        const guard = options[guardType];
        guard && guards.push(guardToPromiseFn(guard, to, from, record, name, runWithContext));
      } else {
        let componentPromise = rawComponent();
        guards.push(() => componentPromise.then((resolved) => {
          if (!resolved)
            return Promise.reject(new Error(`Couldn't resolve component "${name}" at "${record.path}"`));
          const resolvedComponent = isESModule(resolved) ? resolved.default : resolved;
          record.components[name] = resolvedComponent;
          const options = resolvedComponent.__vccOpts || resolvedComponent;
          const guard = options[guardType];
          return guard && guardToPromiseFn(guard, to, from, record, name, runWithContext)();
        }));
      }
    }
  }
  return guards;
}
function isRouteComponent(component) {
  return typeof component === "object" || "displayName" in component || "props" in component || "__vccOpts" in component;
}
function useLink(props) {
  const router2 = inject(routerKey);
  const currentRoute = inject(routeLocationKey);
  const route = computed(() => {
    const to = unref(props.to);
    return router2.resolve(to);
  });
  const activeRecordIndex = computed(() => {
    const { matched } = route.value;
    const { length } = matched;
    const routeMatched = matched[length - 1];
    const currentMatched = currentRoute.matched;
    if (!routeMatched || !currentMatched.length)
      return -1;
    const index = currentMatched.findIndex(isSameRouteRecord.bind(null, routeMatched));
    if (index > -1)
      return index;
    const parentRecordPath = getOriginalPath(matched[length - 2]);
    return (
      // we are dealing with nested routes
      length > 1 && // if the parent and matched route have the same path, this link is
      // referring to the empty child. Or we currently are on a different
      // child of the same parent
      getOriginalPath(routeMatched) === parentRecordPath && // avoid comparing the child with its parent
      currentMatched[currentMatched.length - 1].path !== parentRecordPath ? currentMatched.findIndex(isSameRouteRecord.bind(null, matched[length - 2])) : index
    );
  });
  const isActive = computed(() => activeRecordIndex.value > -1 && includesParams(currentRoute.params, route.value.params));
  const isExactActive = computed(() => activeRecordIndex.value > -1 && activeRecordIndex.value === currentRoute.matched.length - 1 && isSameRouteLocationParams(currentRoute.params, route.value.params));
  function navigate(e = {}) {
    if (guardEvent(e)) {
      return router2[unref(props.replace) ? "replace" : "push"](
        unref(props.to)
        // avoid uncaught errors are they are logged anyway
      ).catch(noop);
    }
    return Promise.resolve();
  }
  return {
    route,
    href: computed(() => route.value.href),
    isActive,
    isExactActive,
    navigate
  };
}
const RouterLinkImpl = /* @__PURE__ */ defineComponent({
  name: "RouterLink",
  compatConfig: { MODE: 3 },
  props: {
    to: {
      type: [String, Object],
      required: true
    },
    replace: Boolean,
    activeClass: String,
    // inactiveClass: String,
    exactActiveClass: String,
    custom: Boolean,
    ariaCurrentValue: {
      type: String,
      default: "page"
    }
  },
  useLink,
  setup(props, { slots }) {
    const link = reactive(useLink(props));
    const { options } = inject(routerKey);
    const elClass = computed(() => ({
      [getLinkClass(props.activeClass, options.linkActiveClass, "router-link-active")]: link.isActive,
      // [getLinkClass(
      //   props.inactiveClass,
      //   options.linkInactiveClass,
      //   'router-link-inactive'
      // )]: !link.isExactActive,
      [getLinkClass(props.exactActiveClass, options.linkExactActiveClass, "router-link-exact-active")]: link.isExactActive
    }));
    return () => {
      const children = slots.default && slots.default(link);
      return props.custom ? children : h("a", {
        "aria-current": link.isExactActive ? props.ariaCurrentValue : null,
        href: link.href,
        // this would override user added attrs but Vue will still add
        // the listener, so we end up triggering both
        onClick: link.navigate,
        class: elClass.value
      }, children);
    };
  }
});
const RouterLink = RouterLinkImpl;
function guardEvent(e) {
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)
    return;
  if (e.defaultPrevented)
    return;
  if (e.button !== void 0 && e.button !== 0)
    return;
  if (e.currentTarget && e.currentTarget.getAttribute) {
    const target = e.currentTarget.getAttribute("target");
    if (/\b_blank\b/i.test(target))
      return;
  }
  if (e.preventDefault)
    e.preventDefault();
  return true;
}
function includesParams(outer, inner) {
  for (const key in inner) {
    const innerValue = inner[key];
    const outerValue = outer[key];
    if (typeof innerValue === "string") {
      if (innerValue !== outerValue)
        return false;
    } else {
      if (!isArray(outerValue) || outerValue.length !== innerValue.length || innerValue.some((value, i) => value !== outerValue[i]))
        return false;
    }
  }
  return true;
}
function getOriginalPath(record) {
  return record ? record.aliasOf ? record.aliasOf.path : record.path : "";
}
const getLinkClass = (propClass, globalClass, defaultClass) => propClass != null ? propClass : globalClass != null ? globalClass : defaultClass;
const RouterViewImpl = /* @__PURE__ */ defineComponent({
  name: "RouterView",
  // #674 we manually inherit them
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      default: "default"
    },
    route: Object
  },
  // Better compat for @vue/compat users
  // https://github.com/vuejs/router/issues/1315
  compatConfig: { MODE: 3 },
  setup(props, { attrs, slots }) {
    const injectedRoute = inject(routerViewLocationKey);
    const routeToDisplay = computed(() => props.route || injectedRoute.value);
    const injectedDepth = inject(viewDepthKey, 0);
    const depth = computed(() => {
      let initialDepth = unref(injectedDepth);
      const { matched } = routeToDisplay.value;
      let matchedRoute;
      while ((matchedRoute = matched[initialDepth]) && !matchedRoute.components) {
        initialDepth++;
      }
      return initialDepth;
    });
    const matchedRouteRef = computed(() => routeToDisplay.value.matched[depth.value]);
    provide(viewDepthKey, computed(() => depth.value + 1));
    provide(matchedRouteKey, matchedRouteRef);
    provide(routerViewLocationKey, routeToDisplay);
    const viewRef = ref();
    watch(() => [viewRef.value, matchedRouteRef.value, props.name], ([instance, to, name], [oldInstance, from, oldName]) => {
      if (to) {
        to.instances[name] = instance;
        if (from && from !== to && instance && instance === oldInstance) {
          if (!to.leaveGuards.size) {
            to.leaveGuards = from.leaveGuards;
          }
          if (!to.updateGuards.size) {
            to.updateGuards = from.updateGuards;
          }
        }
      }
      if (instance && to && // if there is no instance but to and from are the same this might be
      // the first visit
      (!from || !isSameRouteRecord(to, from) || !oldInstance)) {
        (to.enterCallbacks[name] || []).forEach((callback) => callback(instance));
      }
    }, { flush: "post" });
    return () => {
      const route = routeToDisplay.value;
      const currentName = props.name;
      const matchedRoute = matchedRouteRef.value;
      const ViewComponent = matchedRoute && matchedRoute.components[currentName];
      if (!ViewComponent) {
        return normalizeSlot(slots.default, { Component: ViewComponent, route });
      }
      const routePropsOption = matchedRoute.props[currentName];
      const routeProps = routePropsOption ? routePropsOption === true ? route.params : typeof routePropsOption === "function" ? routePropsOption(route) : routePropsOption : null;
      const onVnodeUnmounted = (vnode) => {
        if (vnode.component.isUnmounted) {
          matchedRoute.instances[currentName] = null;
        }
      };
      const component = h(ViewComponent, assign({}, routeProps, attrs, {
        onVnodeUnmounted,
        ref: viewRef
      }));
      return (
        // pass the vnode to the slot as a prop.
        // h and <component :is="..."> both accept vnodes
        normalizeSlot(slots.default, { Component: component, route }) || component
      );
    };
  }
});
function normalizeSlot(slot, data) {
  if (!slot)
    return null;
  const slotContent = slot(data);
  return slotContent.length === 1 ? slotContent[0] : slotContent;
}
const RouterView = RouterViewImpl;
function createRouter(options) {
  const matcher = createRouterMatcher(options.routes, options);
  const parseQuery$1 = options.parseQuery || parseQuery;
  const stringifyQuery$1 = options.stringifyQuery || stringifyQuery;
  const routerHistory = options.history;
  const beforeGuards = useCallbacks();
  const beforeResolveGuards = useCallbacks();
  const afterGuards = useCallbacks();
  const currentRoute = shallowRef(START_LOCATION_NORMALIZED);
  let pendingLocation = START_LOCATION_NORMALIZED;
  if (isBrowser && options.scrollBehavior && "scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  const normalizeParams = applyToParams.bind(null, (paramValue) => "" + paramValue);
  const encodeParams = applyToParams.bind(null, encodeParam);
  const decodeParams = (
    // @ts-expect-error: intentionally avoid the type check
    applyToParams.bind(null, decode)
  );
  function addRoute(parentOrRoute, route) {
    let parent;
    let record;
    if (isRouteName(parentOrRoute)) {
      parent = matcher.getRecordMatcher(parentOrRoute);
      record = route;
    } else {
      record = parentOrRoute;
    }
    return matcher.addRoute(record, parent);
  }
  function removeRoute(name) {
    const recordMatcher = matcher.getRecordMatcher(name);
    if (recordMatcher) {
      matcher.removeRoute(recordMatcher);
    }
  }
  function getRoutes() {
    return matcher.getRoutes().map((routeMatcher) => routeMatcher.record);
  }
  function hasRoute(name) {
    return !!matcher.getRecordMatcher(name);
  }
  function resolve2(rawLocation, currentLocation) {
    currentLocation = assign({}, currentLocation || currentRoute.value);
    if (typeof rawLocation === "string") {
      const locationNormalized = parseURL(parseQuery$1, rawLocation, currentLocation.path);
      const matchedRoute2 = matcher.resolve({ path: locationNormalized.path }, currentLocation);
      const href2 = routerHistory.createHref(locationNormalized.fullPath);
      return assign(locationNormalized, matchedRoute2, {
        params: decodeParams(matchedRoute2.params),
        hash: decode(locationNormalized.hash),
        redirectedFrom: void 0,
        href: href2
      });
    }
    let matcherLocation;
    if (rawLocation.path != null) {
      matcherLocation = assign({}, rawLocation, {
        path: parseURL(parseQuery$1, rawLocation.path, currentLocation.path).path
      });
    } else {
      const targetParams = assign({}, rawLocation.params);
      for (const key in targetParams) {
        if (targetParams[key] == null) {
          delete targetParams[key];
        }
      }
      matcherLocation = assign({}, rawLocation, {
        params: encodeParams(targetParams)
      });
      currentLocation.params = encodeParams(currentLocation.params);
    }
    const matchedRoute = matcher.resolve(matcherLocation, currentLocation);
    const hash = rawLocation.hash || "";
    matchedRoute.params = normalizeParams(decodeParams(matchedRoute.params));
    const fullPath = stringifyURL(stringifyQuery$1, assign({}, rawLocation, {
      hash: encodeHash(hash),
      path: matchedRoute.path
    }));
    const href = routerHistory.createHref(fullPath);
    return assign({
      fullPath,
      // keep the hash encoded so fullPath is effectively path + encodedQuery +
      // hash
      hash,
      query: (
        // if the user is using a custom query lib like qs, we might have
        // nested objects, so we keep the query as is, meaning it can contain
        // numbers at `$route.query`, but at the point, the user will have to
        // use their own type anyway.
        // https://github.com/vuejs/router/issues/328#issuecomment-649481567
        stringifyQuery$1 === stringifyQuery ? normalizeQuery(rawLocation.query) : rawLocation.query || {}
      )
    }, matchedRoute, {
      redirectedFrom: void 0,
      href
    });
  }
  function locationAsObject(to) {
    return typeof to === "string" ? parseURL(parseQuery$1, to, currentRoute.value.path) : assign({}, to);
  }
  function checkCanceledNavigation(to, from) {
    if (pendingLocation !== to) {
      return createRouterError(8, {
        from,
        to
      });
    }
  }
  function push(to) {
    return pushWithRedirect(to);
  }
  function replace(to) {
    return push(assign(locationAsObject(to), { replace: true }));
  }
  function handleRedirectRecord(to) {
    const lastMatched = to.matched[to.matched.length - 1];
    if (lastMatched && lastMatched.redirect) {
      const { redirect } = lastMatched;
      let newTargetLocation = typeof redirect === "function" ? redirect(to) : redirect;
      if (typeof newTargetLocation === "string") {
        newTargetLocation = newTargetLocation.includes("?") || newTargetLocation.includes("#") ? newTargetLocation = locationAsObject(newTargetLocation) : (
          // force empty params
          { path: newTargetLocation }
        );
        newTargetLocation.params = {};
      }
      return assign({
        query: to.query,
        hash: to.hash,
        // avoid transferring params if the redirect has a path
        params: newTargetLocation.path != null ? {} : to.params
      }, newTargetLocation);
    }
  }
  function pushWithRedirect(to, redirectedFrom) {
    const targetLocation = pendingLocation = resolve2(to);
    const from = currentRoute.value;
    const data = to.state;
    const force = to.force;
    const replace2 = to.replace === true;
    const shouldRedirect = handleRedirectRecord(targetLocation);
    if (shouldRedirect)
      return pushWithRedirect(
        assign(locationAsObject(shouldRedirect), {
          state: typeof shouldRedirect === "object" ? assign({}, data, shouldRedirect.state) : data,
          force,
          replace: replace2
        }),
        // keep original redirectedFrom if it exists
        redirectedFrom || targetLocation
      );
    const toLocation = targetLocation;
    toLocation.redirectedFrom = redirectedFrom;
    let failure;
    if (!force && isSameRouteLocation(stringifyQuery$1, from, targetLocation)) {
      failure = createRouterError(16, { to: toLocation, from });
      handleScroll(
        from,
        from,
        // this is a push, the only way for it to be triggered from a
        // history.listen is with a redirect, which makes it become a push
        true,
        // This cannot be the first navigation because the initial location
        // cannot be manually navigated to
        false
      );
    }
    return (failure ? Promise.resolve(failure) : navigate(toLocation, from)).catch((error) => isNavigationFailure(error) ? (
      // navigation redirects still mark the router as ready
      isNavigationFailure(
        error,
        2
        /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
      ) ? error : markAsReady(error)
    ) : (
      // reject any unknown error
      triggerError(error, toLocation, from)
    )).then((failure2) => {
      if (failure2) {
        if (isNavigationFailure(
          failure2,
          2
          /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
        )) {
          return pushWithRedirect(
            // keep options
            assign({
              // preserve an existing replacement but allow the redirect to override it
              replace: replace2
            }, locationAsObject(failure2.to), {
              state: typeof failure2.to === "object" ? assign({}, data, failure2.to.state) : data,
              force
            }),
            // preserve the original redirectedFrom if any
            redirectedFrom || toLocation
          );
        }
      } else {
        failure2 = finalizeNavigation(toLocation, from, true, replace2, data);
      }
      triggerAfterEach(toLocation, from, failure2);
      return failure2;
    });
  }
  function checkCanceledNavigationAndReject(to, from) {
    const error = checkCanceledNavigation(to, from);
    return error ? Promise.reject(error) : Promise.resolve();
  }
  function runWithContext(fn) {
    const app2 = installedApps.values().next().value;
    return app2 && typeof app2.runWithContext === "function" ? app2.runWithContext(fn) : fn();
  }
  function navigate(to, from) {
    let guards;
    const [leavingRecords, updatingRecords, enteringRecords] = extractChangingRecords(to, from);
    guards = extractComponentsGuards(leavingRecords.reverse(), "beforeRouteLeave", to, from);
    for (const record of leavingRecords) {
      record.leaveGuards.forEach((guard) => {
        guards.push(guardToPromiseFn(guard, to, from));
      });
    }
    const canceledNavigationCheck = checkCanceledNavigationAndReject.bind(null, to, from);
    guards.push(canceledNavigationCheck);
    return runGuardQueue(guards).then(() => {
      guards = [];
      for (const guard of beforeGuards.list()) {
        guards.push(guardToPromiseFn(guard, to, from));
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = extractComponentsGuards(updatingRecords, "beforeRouteUpdate", to, from);
      for (const record of updatingRecords) {
        record.updateGuards.forEach((guard) => {
          guards.push(guardToPromiseFn(guard, to, from));
        });
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = [];
      for (const record of enteringRecords) {
        if (record.beforeEnter) {
          if (isArray(record.beforeEnter)) {
            for (const beforeEnter of record.beforeEnter)
              guards.push(guardToPromiseFn(beforeEnter, to, from));
          } else {
            guards.push(guardToPromiseFn(record.beforeEnter, to, from));
          }
        }
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      to.matched.forEach((record) => record.enterCallbacks = {});
      guards = extractComponentsGuards(enteringRecords, "beforeRouteEnter", to, from, runWithContext);
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = [];
      for (const guard of beforeResolveGuards.list()) {
        guards.push(guardToPromiseFn(guard, to, from));
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).catch((err) => isNavigationFailure(
      err,
      8
      /* ErrorTypes.NAVIGATION_CANCELLED */
    ) ? err : Promise.reject(err));
  }
  function triggerAfterEach(to, from, failure) {
    afterGuards.list().forEach((guard) => runWithContext(() => guard(to, from, failure)));
  }
  function finalizeNavigation(toLocation, from, isPush, replace2, data) {
    const error = checkCanceledNavigation(toLocation, from);
    if (error)
      return error;
    const isFirstNavigation = from === START_LOCATION_NORMALIZED;
    const state = !isBrowser ? {} : history.state;
    if (isPush) {
      if (replace2 || isFirstNavigation)
        routerHistory.replace(toLocation.fullPath, assign({
          scroll: isFirstNavigation && state && state.scroll
        }, data));
      else
        routerHistory.push(toLocation.fullPath, data);
    }
    currentRoute.value = toLocation;
    handleScroll(toLocation, from, isPush, isFirstNavigation);
    markAsReady();
  }
  let removeHistoryListener;
  function setupListeners() {
    if (removeHistoryListener)
      return;
    removeHistoryListener = routerHistory.listen((to, _from, info) => {
      if (!router2.listening)
        return;
      const toLocation = resolve2(to);
      const shouldRedirect = handleRedirectRecord(toLocation);
      if (shouldRedirect) {
        pushWithRedirect(assign(shouldRedirect, { replace: true }), toLocation).catch(noop);
        return;
      }
      pendingLocation = toLocation;
      const from = currentRoute.value;
      if (isBrowser) {
        saveScrollPosition(getScrollKey(from.fullPath, info.delta), computeScrollPosition());
      }
      navigate(toLocation, from).catch((error) => {
        if (isNavigationFailure(
          error,
          4 | 8
          /* ErrorTypes.NAVIGATION_CANCELLED */
        )) {
          return error;
        }
        if (isNavigationFailure(
          error,
          2
          /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
        )) {
          pushWithRedirect(
            error.to,
            toLocation
            // avoid an uncaught rejection, let push call triggerError
          ).then((failure) => {
            if (isNavigationFailure(
              failure,
              4 | 16
              /* ErrorTypes.NAVIGATION_DUPLICATED */
            ) && !info.delta && info.type === NavigationType.pop) {
              routerHistory.go(-1, false);
            }
          }).catch(noop);
          return Promise.reject();
        }
        if (info.delta) {
          routerHistory.go(-info.delta, false);
        }
        return triggerError(error, toLocation, from);
      }).then((failure) => {
        failure = failure || finalizeNavigation(
          // after navigation, all matched components are resolved
          toLocation,
          from,
          false
        );
        if (failure) {
          if (info.delta && // a new navigation has been triggered, so we do not want to revert, that will change the current history
          // entry while a different route is displayed
          !isNavigationFailure(
            failure,
            8
            /* ErrorTypes.NAVIGATION_CANCELLED */
          )) {
            routerHistory.go(-info.delta, false);
          } else if (info.type === NavigationType.pop && isNavigationFailure(
            failure,
            4 | 16
            /* ErrorTypes.NAVIGATION_DUPLICATED */
          )) {
            routerHistory.go(-1, false);
          }
        }
        triggerAfterEach(toLocation, from, failure);
      }).catch(noop);
    });
  }
  let readyHandlers = useCallbacks();
  let errorListeners = useCallbacks();
  let ready;
  function triggerError(error, to, from) {
    markAsReady(error);
    const list = errorListeners.list();
    if (list.length) {
      list.forEach((handler) => handler(error, to, from));
    } else {
      console.error(error);
    }
    return Promise.reject(error);
  }
  function isReady() {
    if (ready && currentRoute.value !== START_LOCATION_NORMALIZED)
      return Promise.resolve();
    return new Promise((resolve22, reject) => {
      readyHandlers.add([resolve22, reject]);
    });
  }
  function markAsReady(err) {
    if (!ready) {
      ready = !err;
      setupListeners();
      readyHandlers.list().forEach(([resolve22, reject]) => err ? reject(err) : resolve22());
      readyHandlers.reset();
    }
    return err;
  }
  function handleScroll(to, from, isPush, isFirstNavigation) {
    const { scrollBehavior } = options;
    if (!isBrowser || !scrollBehavior)
      return Promise.resolve();
    const scrollPosition = !isPush && getSavedScrollPosition(getScrollKey(to.fullPath, 0)) || (isFirstNavigation || !isPush) && history.state && history.state.scroll || null;
    return nextTick().then(() => scrollBehavior(to, from, scrollPosition)).then((position) => position && scrollToPosition(position)).catch((err) => triggerError(err, to, from));
  }
  const go = (delta) => routerHistory.go(delta);
  let started;
  const installedApps = /* @__PURE__ */ new Set();
  const router2 = {
    currentRoute,
    listening: true,
    addRoute,
    removeRoute,
    clearRoutes: matcher.clearRoutes,
    hasRoute,
    getRoutes,
    resolve: resolve2,
    options,
    push,
    replace,
    go,
    back: () => go(-1),
    forward: () => go(1),
    beforeEach: beforeGuards.add,
    beforeResolve: beforeResolveGuards.add,
    afterEach: afterGuards.add,
    onError: errorListeners.add,
    isReady,
    install(app2) {
      const router22 = this;
      app2.component("RouterLink", RouterLink);
      app2.component("RouterView", RouterView);
      app2.config.globalProperties.$router = router22;
      Object.defineProperty(app2.config.globalProperties, "$route", {
        enumerable: true,
        get: () => unref(currentRoute)
      });
      if (isBrowser && // used for the initial navigation client side to avoid pushing
      // multiple times when the router is used in multiple apps
      !started && currentRoute.value === START_LOCATION_NORMALIZED) {
        started = true;
        push(routerHistory.location).catch((err) => {
        });
      }
      const reactiveRoute = {};
      for (const key in START_LOCATION_NORMALIZED) {
        Object.defineProperty(reactiveRoute, key, {
          get: () => currentRoute.value[key],
          enumerable: true
        });
      }
      app2.provide(routerKey, router22);
      app2.provide(routeLocationKey, shallowReactive(reactiveRoute));
      app2.provide(routerViewLocationKey, currentRoute);
      const unmountApp = app2.unmount;
      installedApps.add(app2);
      app2.unmount = function() {
        installedApps.delete(app2);
        if (installedApps.size < 1) {
          pendingLocation = START_LOCATION_NORMALIZED;
          removeHistoryListener && removeHistoryListener();
          removeHistoryListener = null;
          currentRoute.value = START_LOCATION_NORMALIZED;
          started = false;
          ready = false;
        }
        unmountApp();
      };
    }
  };
  function runGuardQueue(guards) {
    return guards.reduce((promise, guard) => promise.then(() => runWithContext(guard)), Promise.resolve());
  }
  return router2;
}
function extractChangingRecords(to, from) {
  const leavingRecords = [];
  const updatingRecords = [];
  const enteringRecords = [];
  const len = Math.max(from.matched.length, to.matched.length);
  for (let i = 0; i < len; i++) {
    const recordFrom = from.matched[i];
    if (recordFrom) {
      if (to.matched.find((record) => isSameRouteRecord(record, recordFrom)))
        updatingRecords.push(recordFrom);
      else
        leavingRecords.push(recordFrom);
    }
    const recordTo = to.matched[i];
    if (recordTo) {
      if (!from.matched.find((record) => isSameRouteRecord(record, recordTo))) {
        enteringRecords.push(recordTo);
      }
    }
  }
  return [leavingRecords, updatingRecords, enteringRecords];
}
function deviceBadge() {
  return deviceSettingBadge() + deviceHardwareBadge() + deviceWifiBadge();
}
function deviceSettingBadge() {
  return deviceMdnsBadge();
}
function deviceMdnsBadge() {
  return config.mdns === "" ? 1 : 0;
}
function deviceHardwareBadge() {
  return deviceGyroCalibratedBadge() + deviceMigrateIspindelBadge();
}
function deviceMigrateIspindelBadge() {
  return status.ispindel_config ? 1 : 0;
}
function deviceGyroCalibratedBadge() {
  return isGyroCalibrated() ? 0 : 1;
}
function deviceWifiBadge() {
  return deviceWifi1Badge() | deviceWifi2Badge() ? 1 : 0;
}
function deviceWifi1Badge() {
  if (config.wifi_ssid === "") return 1;
  return 0;
}
function deviceWifi2Badge() {
  if (config.wifi_ssid2 === "" && config.wifi_ssid === "") return 1;
  return 0;
}
function gravityBadge() {
  return gravitySettingBadge() + gravityFormulaBadge();
}
function gravitySettingBadge() {
  return 0;
}
function gravityFormulaBadge() {
  if (config.gravity_formula === "") return 1;
  return 0;
}
function pushBadge() {
  return pushSettingBadge() + pushHttpPost1Badge() + pushHttpPost2Badge() + pushHttpGetBadge() + pushInfluxdb2Badge() + pushMqttBadge() + pushBluetoothBadge();
}
function pushTargetCount() {
  var cnt = 0;
  cnt += config.http_post_target === "" ? 0 : 1;
  cnt += config.http_post2_target === "" ? 0 : 1;
  cnt += config.http_get_target === "" ? 0 : 1;
  cnt += config.influxdb2_target === "" ? 0 : 1;
  cnt += config.mqtt_target === "" ? 0 : 1;
  cnt += config.ble_format === 0 ? 0 : 1;
  cnt += config.use_wifi_direct ? 1 : 0;
  return cnt;
}
function pushSettingBadge() {
  return 0;
}
function pushHttpPost1Badge() {
  return pushTargetCount() === 0 ? 1 : 0;
}
function pushHttpPost2Badge() {
  return pushTargetCount() === 0 ? 1 : 0;
}
function pushHttpGetBadge() {
  return pushTargetCount() === 0 ? 1 : 0;
}
function pushInfluxdb2Badge() {
  return pushTargetCount() === 0 ? 1 : 0;
}
function pushMqttBadge() {
  return pushTargetCount() === 0 ? 1 : 0;
}
function pushBluetoothBadge() {
  return pushTargetCount() === 0 ? 1 : 0;
}
const _hoisted_1$O = { class: "container" };
const _hoisted_2$K = /* @__PURE__ */ createBaseVNode("p", null, null, -1);
const _hoisted_3$A = {
  key: 1,
  class: "container overflow-hidden text-center"
};
const _hoisted_4$q = { class: "row gy-4" };
const _hoisted_5$l = {
  key: 0,
  class: "col-md-4"
};
const _hoisted_6$k = { class: "text-center" };
const _hoisted_7$k = {
  key: 1,
  class: "col-md-4"
};
const _hoisted_8$l = { class: "text-center" };
const _hoisted_9$j = {
  key: 2,
  class: "col-md-4"
};
const _hoisted_10$j = { class: "text-center" };
const _hoisted_11$h = {
  key: 3,
  class: "col-md-4"
};
const _hoisted_12$h = { class: "text-center" };
const _hoisted_13$h = {
  key: 4,
  class: "col-md-4"
};
const _hoisted_14$h = { class: "text-center" };
const _hoisted_15$h = {
  key: 5,
  class: "col-md-4"
};
const _hoisted_16$g = { class: "text-center" };
const _hoisted_17$e = {
  key: 6,
  class: "col-md-4"
};
const _hoisted_18$e = /* @__PURE__ */ createBaseVNode("p", { class: "text-center" }, "No temperature sensor detected", -1);
const _hoisted_19$d = {
  key: 7,
  class: "col-md-4"
};
const _hoisted_20$d = { class: "text-center" };
const _hoisted_21$d = {
  key: 8,
  class: "col-md-4"
};
const _hoisted_22$9 = /* @__PURE__ */ createBaseVNode("p", { class: "text-center" }, "Battery level not valid", -1);
const _hoisted_23$8 = { class: "col-md-4" };
const _hoisted_24$7 = { class: "text-center" };
const _hoisted_25$6 = { class: "col-md-4" };
const _hoisted_26$5 = { class: "text-center" };
const _hoisted_27$4 = { class: "col-md-4" };
const _hoisted_28$4 = { class: "text-center" };
const _hoisted_29$4 = { class: "col-md-4" };
const _hoisted_30$3 = { class: "text-center" };
const _hoisted_31$3 = {
  key: 9,
  class: "col-md-4"
};
const _hoisted_32$3 = { class: "text-center" };
const _hoisted_33$3 = /* @__PURE__ */ createBaseVNode("a", {
  class: "link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover",
  href: "https://github.com/mp-se/gravitymon/releases",
  target: "_blank"
}, "github.com", -1);
const _hoisted_34$3 = { class: "col-md-4" };
const _hoisted_35$2 = { class: "text-center" };
const _hoisted_36$2 = { class: "col-md-4" };
const _hoisted_37$1 = { class: "text-center" };
const _hoisted_38$2 = { class: "col-md-4" };
const _hoisted_39$1 = { class: "d-flex justify-content-center" };
const _hoisted_40$1 = {
  class: "form-check form-switch",
  style: { "height": "0.7rem" }
};
const _sfc_main$O = {
  __name: "HomeView",
  setup(__props2) {
    const polling = ref(null);
    const flag = ref(false);
    const angle2 = ref({ average: 0, sum: 0, count: 0 });
    const newVersion = ref({ new: false, ver: "" });
    watch(flag, async () => {
      status.setSleepMode(flag.value, () => {
      });
    });
    function clearAverage() {
      angle2.value.sum = 0;
      angle2.value.count = 0;
      angle2.value.sum = 0;
    }
    function refresh() {
      status.load((success) => {
        if (success) {
          angle2.value.sum += parseFloat(status.angle);
          angle2.value.count++;
          angle2.value.average = (Math.round(angle2.value.sum / angle2.value.count * 100) / 100).toFixed(
            2
          );
        }
      });
    }
    onMounted(() => {
      flag.value = status.sleep_mode;
      setTimeout(() => {
        logInfo("HomeView.onMounted()", "Checking for new sw");
        fetch("https://www.gravitymon.com/firmware/version.json", {
          signal: AbortSignal.timeout(1e4)
        }).then((res) => res.json()).then((json) => {
          if (checkForNewGravMonVersion(json)) {
            newVersion.value.new = true;
            newVersion.value.ver = json.version;
            logInfo("HomeView.onMounted()", "Newer version found");
          }
          logInfo("HomeView.onMounted()", "Fetching latest gravtmon version completed");
        }).catch((err) => {
          logError("HomeView.onMounted()", err);
        });
      }, 500);
    });
    onBeforeMount(() => {
      refresh();
      polling.value = setInterval(refresh, 4e3);
    });
    onBeforeUnmount(() => {
      clearInterval(polling.value);
    });
    function checkForNewGravMonVersion(json) {
      var current = status.app_ver;
      var latest = json.version;
      const newVer = latest.split(".");
      const curVer = current.split(".");
      if (newVer.length != 3 && curVer.length != 3) return false;
      if (newVer[0] > curVer[0]) return true;
      else if (newVer[0] == curVer[0] && newVer[1] > curVer[1]) return true;
      else if (newVer[0] == curVer[0] && newVer[1] == curVer[1] && newVer[2] > curVer[2]) return true;
      return false;
    }
    return (_ctx, _cache) => {
      const _component_BsMessage = resolveComponent("BsMessage");
      const _component_BsCard = resolveComponent("BsCard");
      const _component_router_link = resolveComponent("router-link");
      return openBlock(), createElementBlock("div", _hoisted_1$O, [
        _hoisted_2$K,
        unref(status) ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
          !unref(status).self_check.push_targets ? (openBlock(), createBlock(_component_BsMessage, {
            key: 0,
            dismissable: "true",
            message: "",
            alert: "danger"
          }, {
            default: withCtx(() => [
              createTextVNode(" No remote services are active. Check your push settings and enable at least one service. ")
            ]),
            _: 1
          })) : createCommentVNode("", true),
          !unref(status).self_check.gyro_connected ? (openBlock(), createBlock(_component_BsMessage, {
            key: 1,
            dismissable: "true",
            message: "",
            alert: "danger"
          }, {
            default: withCtx(() => [
              createTextVNode(" No gyro is detected. Try to reboot / power-off. If this persists, check for hardware issues. ")
            ]),
            _: 1
          })) : createCommentVNode("", true)
        ], 64)) : createCommentVNode("", true),
        unref(status) ? (openBlock(), createElementBlock("div", _hoisted_3$A, [
          createBaseVNode("div", _hoisted_4$q, [
            unref(status).self_check.gravity_formula ? (openBlock(), createElementBlock("div", _hoisted_5$l, [
              createVNode(_component_BsCard, {
                header: "Measurement",
                color: "info",
                title: "Gravity"
              }, {
                default: withCtx(() => [
                  createBaseVNode("p", _hoisted_6$k, toDisplayString(unref(status).gravity) + " " + toDisplayString(unref(status).gravity_format === "G" ? " SG" : " P"), 1)
                ]),
                _: 1
              })
            ])) : createCommentVNode("", true),
            !unref(status).self_check.gravity_formula ? (openBlock(), createElementBlock("div", _hoisted_7$k, [
              createVNode(_component_BsCard, {
                header: "Measurement",
                title: "Error",
                iserr: true,
                icon: "bi-x-circle"
              }, {
                default: withCtx(() => [
                  createBaseVNode("p", _hoisted_8$l, [
                    createTextVNode(" Missing "),
                    createVNode(_component_router_link, {
                      class: "link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover",
                      to: "/gravity/formula"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("formula")
                      ]),
                      _: 1
                    }),
                    createTextVNode(", unable to calculate gravity ")
                  ])
                ]),
                _: 1
              })
            ])) : createCommentVNode("", true),
            unref(status).self_check.gyro_calibration && unref(status).self_check.gyro_connected ? (openBlock(), createElementBlock("div", _hoisted_9$j, [
              createVNode(_component_BsCard, {
                header: "Measurement",
                color: "info",
                title: "Angle"
              }, {
                default: withCtx(() => [
                  createBaseVNode("p", _hoisted_10$j, toDisplayString(unref(status).angle), 1)
                ]),
                _: 1
              })
            ])) : createCommentVNode("", true),
            unref(status).self_check.gyro_calibration && unref(status).self_check.gyro_connected ? (openBlock(), createElementBlock("div", _hoisted_11$h, [
              createVNode(_component_BsCard, {
                header: "Measurement",
                color: "info",
                title: "Average Angle"
              }, {
                default: withCtx(() => [
                  createBaseVNode("p", _hoisted_12$h, [
                    createTextVNode(toDisplayString(angle2.value.average) + " (" + toDisplayString(angle2.value.count) + ") ", 1),
                    createBaseVNode("button", {
                      onClick: clearAverage,
                      type: "button",
                      class: "btn btn-outline-info btn-sm",
                      style: { "font-size": "0.7rem" }
                    }, " Clear ")
                  ])
                ]),
                _: 1
              })
            ])) : createCommentVNode("", true),
            !unref(status).self_check.gyro_calibration ? (openBlock(), createElementBlock("div", _hoisted_13$h, [
              createVNode(_component_BsCard, {
                header: "Measurement",
                title: "Error",
                iserr: true,
                icon: "bi-x-circle"
              }, {
                default: withCtx(() => [
                  createBaseVNode("p", _hoisted_14$h, [
                    createTextVNode(" Gyro has not been "),
                    createVNode(_component_router_link, {
                      class: "link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover",
                      to: "/device/hardware"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("calibrated")
                      ]),
                      _: 1
                    }),
                    createTextVNode(" at 90 degrees ")
                  ])
                ]),
                _: 1
              })
            ])) : createCommentVNode("", true),
            unref(status).self_check.temp_connected ? (openBlock(), createElementBlock("div", _hoisted_15$h, [
              createVNode(_component_BsCard, {
                header: "Measurement",
                color: "info",
                title: "Temperature"
              }, {
                default: withCtx(() => [
                  createBaseVNode("p", _hoisted_16$g, toDisplayString(unref(status).temp) + " °" + toDisplayString(unref(status).temp_format), 1)
                ]),
                _: 1
              })
            ])) : createCommentVNode("", true),
            !unref(status).self_check.temp_connected ? (openBlock(), createElementBlock("div", _hoisted_17$e, [
              createVNode(_component_BsCard, {
                header: "Measurement",
                title: "Error",
                iserr: true,
                icon: "bi-x-circle"
              }, {
                default: withCtx(() => [
                  _hoisted_18$e
                ]),
                _: 1
              })
            ])) : createCommentVNode("", true),
            unref(status).self_check.battery_level ? (openBlock(), createElementBlock("div", _hoisted_19$d, [
              createVNode(_component_BsCard, {
                header: "Measurement",
                color: "info",
                title: "Battery"
              }, {
                default: withCtx(() => [
                  createBaseVNode("p", _hoisted_20$d, toDisplayString(unref(status).battery) + " V", 1)
                ]),
                _: 1
              })
            ])) : createCommentVNode("", true),
            !unref(status).self_check.battery_level ? (openBlock(), createElementBlock("div", _hoisted_21$d, [
              createVNode(_component_BsCard, {
                header: "Measurement",
                title: "Error",
                iserr: true,
                icon: "bi-x-circle"
              }, {
                default: withCtx(() => [
                  _hoisted_22$9
                ]),
                _: 1
              })
            ])) : createCommentVNode("", true),
            createBaseVNode("div", _hoisted_23$8, [
              createVNode(_component_BsCard, {
                header: "Measurement",
                color: "info",
                title: "Average runtime"
              }, {
                default: withCtx(() => [
                  createBaseVNode("p", _hoisted_24$7, toDisplayString(unref(status).runtime_average) + " s", 1)
                ]),
                _: 1
              })
            ]),
            createBaseVNode("div", _hoisted_25$6, [
              createVNode(_component_BsCard, {
                header: "Device",
                title: "WIFI"
              }, {
                default: withCtx(() => [
                  createBaseVNode("p", _hoisted_26$5, toDisplayString(unref(status).rssi) + " dBm - " + toDisplayString(unref(status).wifi_ssid), 1)
                ]),
                _: 1
              })
            ]),
            createBaseVNode("div", _hoisted_27$4, [
              createVNode(_component_BsCard, {
                header: "Device",
                title: "IP Address"
              }, {
                default: withCtx(() => [
                  createBaseVNode("p", _hoisted_28$4, toDisplayString(unref(status).ip), 1)
                ]),
                _: 1
              })
            ]),
            createBaseVNode("div", _hoisted_29$4, [
              createVNode(_component_BsCard, {
                header: "Device",
                title: "Memory"
              }, {
                default: withCtx(() => [
                  createBaseVNode("p", _hoisted_30$3, " Free: " + toDisplayString(unref(status).free_heap) + " kb, Total: " + toDisplayString(unref(status).total_heap) + " kb ", 1)
                ]),
                _: 1
              })
            ]),
            newVersion.value.new ? (openBlock(), createElementBlock("div", _hoisted_31$3, [
              createVNode(_component_BsCard, {
                header: "Device",
                title: "Upgrade available"
              }, {
                default: withCtx(() => [
                  createBaseVNode("p", _hoisted_32$3, [
                    createTextVNode(toDisplayString(newVersion.value.ver) + " available on ", 1),
                    _hoisted_33$3
                  ])
                ]),
                _: 1
              })
            ])) : createCommentVNode("", true),
            createBaseVNode("div", _hoisted_34$3, [
              createVNode(_component_BsCard, {
                header: "Device",
                title: "Software version"
              }, {
                default: withCtx(() => [
                  createBaseVNode("p", _hoisted_35$2, " Firmware: " + toDisplayString(unref(status).app_ver) + " (" + toDisplayString(unref(status).app_build) + ") UI: " + toDisplayString(unref(global$1).uiVersion) + " (" + toDisplayString(unref(global$1).uiBuild) + ") ", 1)
                ]),
                _: 1
              })
            ]),
            createBaseVNode("div", _hoisted_36$2, [
              createVNode(_component_BsCard, {
                header: "Device",
                title: "Platform"
              }, {
                default: withCtx(() => [
                  createBaseVNode("p", _hoisted_37$1, toDisplayString(unref(status).platform), 1)
                ]),
                _: 1
              })
            ]),
            createBaseVNode("div", _hoisted_38$2, [
              createVNode(_component_BsCard, {
                header: "Device",
                title: "Force gravity mode"
              }, {
                default: withCtx(() => [
                  createBaseVNode("div", _hoisted_39$1, [
                    createBaseVNode("div", _hoisted_40$1, [
                      withDirectives(createBaseVNode("input", {
                        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => flag.value = $event),
                        class: "form-check-input",
                        type: "checkbox",
                        role: "switch"
                      }, null, 512), [
                        [vModelCheckbox, flag.value]
                      ])
                    ])
                  ])
                ]),
                _: 1
              })
            ])
          ])
        ])) : createCommentVNode("", true)
      ]);
    };
  }
};
const _hoisted_1$N = { class: "container" };
const _hoisted_2$J = /* @__PURE__ */ createBaseVNode("p", null, null, -1);
const _hoisted_3$z = /* @__PURE__ */ createBaseVNode("p", { class: "h2" }, "Device - Settings", -1);
const _hoisted_4$p = /* @__PURE__ */ createBaseVNode("hr", null, null, -1);
const _hoisted_5$k = { class: "row" };
const _hoisted_6$j = { class: "col-md-12" };
const _hoisted_7$j = /* @__PURE__ */ createBaseVNode("div", { class: "col-md-12" }, [
  /* @__PURE__ */ createBaseVNode("hr")
], -1);
const _hoisted_8$k = { class: "col-md-6" };
const _hoisted_9$i = { class: "col-md-6" };
const _hoisted_10$i = /* @__PURE__ */ createBaseVNode("div", { class: "col-md-12" }, [
  /* @__PURE__ */ createBaseVNode("hr")
], -1);
const _hoisted_11$g = { class: "col-md-9" };
const _hoisted_12$g = { class: "col-md-3" };
const _hoisted_13$g = /* @__PURE__ */ createBaseVNode("div", { class: "col-md-12" }, [
  /* @__PURE__ */ createBaseVNode("hr")
], -1);
const _hoisted_14$g = { class: "col-md-6" };
const _hoisted_15$g = { class: "row gy-2" };
const _hoisted_16$f = /* @__PURE__ */ createBaseVNode("div", { class: "col-md-12" }, [
  /* @__PURE__ */ createBaseVNode("hr")
], -1);
const _hoisted_17$d = { class: "col-md-3" };
const _hoisted_18$d = ["disabled"];
const _hoisted_19$c = ["hidden"];
const _hoisted_20$c = { class: "col-md-3" };
const _hoisted_21$c = ["disabled"];
const _hoisted_22$8 = ["hidden"];
const _hoisted_23$7 = { class: "col-sm-4" };
const _hoisted_24$6 = ["disabled"];
const _hoisted_25$5 = ["hidden"];
const _sfc_main$N = {
  __name: "DeviceSettingsView",
  setup(__props2) {
    const otaOptions = ref([
      { label: "-blank-", value: "" },
      { label: "Gravitymon.com", value: "https://www.gravitymon.com/firmware/" }
    ]);
    const tempOptions = ref([
      { label: "Celsius °C", value: "C" },
      { label: "Fahrenheit °F", value: "F" }
    ]);
    const gravityOptions = ref([
      { label: "Specific Gravity", value: "G" },
      { label: "Plato", value: "P" }
    ]);
    const uiOptions = ref([
      { label: "Day mode", value: false },
      { label: "Dark mode", value: true }
    ]);
    const otaCallback = (opt) => {
      config.ota_url = opt;
    };
    const factory = () => {
      global$1.clearMessages();
      logInfo("DeviceSettingsView.factory()", "Sending /api/factory");
      global$1.disabled = true;
      fetch(global$1.baseURL + "api/factory", {
        headers: { Authorization: global$1.token },
        signal: AbortSignal.timeout(global$1.fetchTimout)
      }).then((res) => res.json()).then((json) => {
        if (json.success == true) {
          global$1.messageSuccess = json.message;
          setTimeout(() => {
            location.reload(true);
          }, 2e3);
        } else {
          global$1.messageFailed = json.message;
          global$1.disabled = false;
        }
      }).catch((err) => {
        logError("DeviceSettingsView.factory()", err);
        global$1.messageError = "Failed to do factory restore";
        global$1.disabled = false;
      });
    };
    const saveSettings = () => {
      if (!validateCurrentForm()) return;
      config.saveAll();
    };
    return (_ctx, _cache) => {
      const _component_BsMessage = resolveComponent("BsMessage");
      const _component_BsInputText = resolveComponent("BsInputText");
      const _component_BsInputRadio = resolveComponent("BsInputRadio");
      const _component_BsDropdown = resolveComponent("BsDropdown");
      return openBlock(), createElementBlock("div", _hoisted_1$N, [
        _hoisted_2$J,
        _hoisted_3$z,
        _hoisted_4$p,
        unref(config).mdns === "" ? (openBlock(), createBlock(_component_BsMessage, {
          key: 0,
          dismissable: "true",
          message: "",
          alert: "warning"
        }, {
          default: withCtx(() => [
            createTextVNode(" You need to define a mdns name for the device ")
          ]),
          _: 1
        })) : createCommentVNode("", true),
        createBaseVNode("form", {
          onSubmit: withModifiers(saveSettings, ["prevent"]),
          class: "needs-validation",
          novalidate: ""
        }, [
          createBaseVNode("div", _hoisted_5$k, [
            createBaseVNode("div", _hoisted_6$j, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).mdns,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => unref(config).mdns = $event),
                maxlength: "63",
                minlength: "1",
                label: "MDNS",
                help: "Enter device name used on the network, the suffix .local will be added to this name",
                badge: deviceMdnsBadge(),
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "badge", "disabled"])
            ]),
            _hoisted_7$j,
            createBaseVNode("div", _hoisted_8$k, [
              createVNode(_component_BsInputRadio, {
                modelValue: unref(config).temp_format,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => unref(config).temp_format = $event),
                options: tempOptions.value,
                label: "Temperature Format",
                width: "",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "options", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_9$i, [
              createVNode(_component_BsInputRadio, {
                modelValue: unref(config).gravity_format,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => unref(config).gravity_format = $event),
                options: gravityOptions.value,
                label: "Gravity Format",
                width: "",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "options", "disabled"])
            ]),
            _hoisted_10$i,
            createBaseVNode("div", _hoisted_11$g, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).ota_url,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => unref(config).ota_url = $event),
                type: "url",
                maxlength: "80",
                label: "OTA URL",
                help: "Base URL to where firmware and version.json file can be found. Needs to end with '/'', example: http://www.mysite.com/firmware/",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_12$g, [
              createVNode(_component_BsDropdown, {
                label: "Predefined ota",
                button: "URL",
                options: otaOptions.value,
                callback: otaCallback,
                disabled: unref(global$1).disabled
              }, null, 8, ["options", "disabled"])
            ]),
            _hoisted_13$g,
            createBaseVNode("div", _hoisted_14$g, [
              createVNode(_component_BsInputRadio, {
                modelValue: unref(config).dark_mode,
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => unref(config).dark_mode = $event),
                options: uiOptions.value,
                label: "User Interface",
                width: "",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "options", "disabled"])
            ])
          ]),
          createBaseVNode("div", _hoisted_15$g, [
            _hoisted_16$f,
            createBaseVNode("div", _hoisted_17$d, [
              createBaseVNode("button", {
                type: "submit",
                class: "btn btn-primary w-2",
                disabled: unref(global$1).disabled || !unref(global$1).configChanged
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_19$c),
                createTextVNode("  Save ")
              ], 8, _hoisted_18$d)
            ]),
            createBaseVNode("div", _hoisted_20$c, [
              createBaseVNode("button", {
                onClick: _cache[5] || (_cache[5] = ($event) => unref(restart)()),
                type: "button",
                class: "btn btn-secondary",
                disabled: unref(global$1).disabled
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_22$8),
                createTextVNode("  Restart device ")
              ], 8, _hoisted_21$c)
            ]),
            createBaseVNode("div", _hoisted_23$7, [
              createBaseVNode("button", {
                onClick: factory,
                type: "button",
                class: "btn btn-secondary",
                disabled: unref(global$1).disabled
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_25$5),
                createTextVNode("  Restore factory defaults ")
              ], 8, _hoisted_24$6)
            ])
          ])
        ], 32)
      ]);
    };
  }
};
const _hoisted_1$M = { class: "container" };
const _hoisted_2$I = /* @__PURE__ */ createBaseVNode("p", null, null, -1);
const _hoisted_3$y = /* @__PURE__ */ createBaseVNode("p", { class: "h3" }, "Device - Hardware", -1);
const _hoisted_4$o = /* @__PURE__ */ createBaseVNode("hr", null, null, -1);
const _hoisted_5$j = { class: "row" };
const _hoisted_6$i = { class: "col-md-6" };
const _hoisted_7$i = { class: "col-md-6" };
const _hoisted_8$j = { class: "col-md-6" };
const _hoisted_9$h = { class: "col-md-6" };
const _hoisted_10$h = /* @__PURE__ */ createBaseVNode("div", { class: "col-md-12" }, [
  /* @__PURE__ */ createBaseVNode("hr")
], -1);
const _hoisted_11$f = { class: "col-md-6" };
const _hoisted_12$f = /* @__PURE__ */ createBaseVNode("div", { class: "col-md-12" }, [
  /* @__PURE__ */ createBaseVNode("hr")
], -1);
const _hoisted_13$f = { class: "col-md-12" };
const _hoisted_14$f = { class: "col-md-6" };
const _hoisted_15$f = { class: "col-md-6" };
const _hoisted_16$e = /* @__PURE__ */ createBaseVNode("div", { class: "col-md-12" }, [
  /* @__PURE__ */ createBaseVNode("hr")
], -1);
const _hoisted_17$c = { class: "col-md-6" };
const _hoisted_18$c = { class: "col-md-6" };
const _hoisted_19$b = { class: "row gy-2" };
const _hoisted_20$b = /* @__PURE__ */ createBaseVNode("div", { class: "col-md-12" }, [
  /* @__PURE__ */ createBaseVNode("hr")
], -1);
const _hoisted_21$b = { class: "col-md-3" };
const _hoisted_22$7 = ["disabled"];
const _hoisted_23$6 = ["hidden"];
const _hoisted_24$5 = { class: "col-md-3" };
const _hoisted_25$4 = ["disabled"];
const _hoisted_26$4 = ["hidden"];
const _hoisted_27$3 = { class: "col-md-3" };
const _hoisted_28$3 = ["disabled"];
const _hoisted_29$3 = ["hidden"];
const _hoisted_30$2 = {
  key: 0,
  class: "badge text-bg-danger rounded-circle"
};
const _hoisted_31$2 = {
  key: 0,
  class: "col-md-3"
};
const _hoisted_32$2 = ["disabled"];
const _hoisted_33$2 = ["hidden"];
const _hoisted_34$2 = {
  key: 0,
  class: "badge text-bg-danger rounded-circle"
};
const _sfc_main$M = {
  __name: "DeviceHardwareView",
  setup(__props2) {
    const tempsensorResolutionOptions = ref([
      { label: "0.5°C (93 ms)", value: 9 },
      { label: "0.25°C (187 ms)", value: 10 },
      { label: "0.125°C (375 ms)", value: 11 },
      { label: "0.0625°C (850 ms)", value: 12 }
    ]);
    const voltagePinFloatyOptions = ref([
      { label: "PIN 32", value: 32 },
      { label: "PIN 35", value: 35 }
    ]);
    const disableDs18b20 = computed(() => {
      return config.gyro_temp || global$1.disabled;
    });
    const voltage = computed(() => {
      return status.battery + " V";
    });
    const calibrationValues = computed(() => {
      return JSON.stringify(config.gyro_calibration_data);
    });
    const ispindel = () => {
      var data = {
        command: "get",
        file: "/config.json"
      };
      config.sendFilesystemRequest(data, (success, text) => {
        if (success) {
          var json = JSON.parse(text);
          config.gyro_calibration_data.ax = json.Offset[0];
          config.gyro_calibration_data.ay = json.Offset[1];
          config.gyro_calibration_data.az = json.Offset[2];
          config.gyro_calibration_data.gx = json.Offset[3];
          config.gyro_calibration_data.gy = json.Offset[4];
          config.gyro_calibration_data.gz = json.Offset[5];
          config.gravity_formula = json.POLY;
          global$1.messageSuccess = "Imported gyro calibration data and formula from old configuration. Please save!";
        }
        global$1.disabled = false;
      });
    };
    const calibrate = () => {
      global$1.disabled = true;
      logInfo("DeviceHardwareView.calibrate()", "Sending /api/calibrate");
      fetch(global$1.baseURL + "api/calibrate", {
        headers: { Authorization: global$1.token },
        signal: AbortSignal.timeout(global$1.fetchTimout)
      }).then((res) => {
        if (res.status != 200) {
          global$1.messageError = "Failed to calibrate device";
        } else {
          setTimeout(() => {
            fetch(global$1.baseURL + "api/calibrate/status", {
              headers: { Authorization: global$1.token },
              signal: AbortSignal.timeout(global$1.fetchTimout)
            }).then((res2) => {
              if (res2.status != 200 || res2.success == true) {
                global$1.messageError = "Failed to get calibrate status";
              } else {
                config.load((success) => {
                  if (success) {
                    global$1.messageSuccess = "Gyro calibrated";
                  } else {
                    global$1.messageError = "Failed to load configuration";
                  }
                  global$1.disabled = false;
                });
              }
            }).catch((err) => {
              global$1.messageError = "Failed to get calibrate status";
              logError("DeviceHardwareView.calibrate()", err);
            });
          }, 4e3);
        }
      }).catch((err) => {
        global$1.messageError = "Failed to send calibrate request";
        logError("DeviceHardwareView.calibrate()", err);
      });
    };
    const save = () => {
      if (!validateCurrentForm()) return;
      global$1.clearMessages();
      config.saveAll();
    };
    return (_ctx, _cache) => {
      const _component_BsMessage = resolveComponent("BsMessage");
      const _component_BsInputNumber = resolveComponent("BsInputNumber");
      const _component_BsInputSwitch = resolveComponent("BsInputSwitch");
      const _component_BsInputRadio = resolveComponent("BsInputRadio");
      const _component_BsInputReadonly = resolveComponent("BsInputReadonly");
      return openBlock(), createElementBlock("div", _hoisted_1$M, [
        _hoisted_2$I,
        _hoisted_3$y,
        _hoisted_4$o,
        !unref(isGyroCalibrated)() ? (openBlock(), createBlock(_component_BsMessage, {
          key: 0,
          dismissable: "true",
          message: "",
          alert: "warning"
        }, {
          default: withCtx(() => [
            createTextVNode(" You need to calibrate the gyro at 90 degrees ")
          ]),
          _: 1
        })) : createCommentVNode("", true),
        unref(config).gyro_disabled ? (openBlock(), createBlock(_component_BsMessage, {
          key: 1,
          dismissable: "true",
          message: "",
          alert: "warning"
        }, {
          default: withCtx(() => [
            createTextVNode(" Gyro is disbled so the device will only be able to measure temperature ")
          ]),
          _: 1
        })) : createCommentVNode("", true),
        createBaseVNode("form", {
          onSubmit: withModifiers(save, ["prevent"]),
          class: "needs-validation",
          novalidate: ""
        }, [
          createBaseVNode("div", _hoisted_5$j, [
            createBaseVNode("div", _hoisted_6$i, [
              createVNode(_component_BsInputNumber, {
                modelValue: unref(config).voltage_factor,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => unref(config).voltage_factor = $event),
                label: "Voltage factor",
                min: "0",
                max: "6",
                step: ".01",
                width: "4",
                unit: voltage.value,
                help: "Factor used to calculate the battery voltage. Can vary depending on the R2 value (0 to 6)",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "unit", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_7$i, [
              createVNode(_component_BsInputNumber, {
                modelValue: unref(config).voltage_config,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => unref(config).voltage_config = $event),
                unit: "V",
                label: "Voltage config",
                min: "3",
                max: "6",
                step: ".01",
                width: "4",
                help: "Over this level the device will always go into configuration mode, some batteries might have a higher voltage when fully charged (3 to 6)",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_8$j, [
              createVNode(_component_BsInputSwitch, {
                modelValue: unref(config).storage_sleep,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => unref(config).storage_sleep = $event),
                label: "Storage sleep",
                help: "If enabled and the device is placed on its cap (less than 5 degress) it will go into sleep for 2000 minutes",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_9$h, [
              createVNode(_component_BsInputSwitch, {
                modelValue: unref(config).battery_saving,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => unref(config).battery_saving = $event),
                label: "Battery saving",
                help: "When active, the sleep interval will be changed to 1 hour when battery drops below 20% (3.73V)",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"])
            ]),
            unref(status).hardware == "floaty" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
              _hoisted_10$h,
              createBaseVNode("div", _hoisted_11$f, [
                createVNode(_component_BsInputRadio, {
                  modelValue: unref(config).voltage_pin,
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => unref(config).voltage_pin = $event),
                  options: voltagePinFloatyOptions.value,
                  label: "Floaty Voltage PIN",
                  help: "Pin to be used for measuring voltage on floaty hardware",
                  disabled: unref(global$1).disabled
                }, null, 8, ["modelValue", "options", "disabled"])
              ])
            ], 64)) : createCommentVNode("", true),
            _hoisted_12$f,
            createBaseVNode("div", _hoisted_13$f, [
              createVNode(_component_BsInputRadio, {
                modelValue: unref(config).tempsensor_resolution,
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => unref(config).tempsensor_resolution = $event),
                options: tempsensorResolutionOptions.value,
                label: "DS18B20 resolution",
                help: "Resolution when reading the DS18B20 temperature sensor, higher resolution give better accuracy but takes longer to process and reduces battery life",
                disabled: disableDs18b20.value
              }, null, 8, ["modelValue", "options", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_14$f, [
              createVNode(_component_BsInputNumber, {
                modelValue: unref(config).temp_adjustment_value,
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => unref(config).temp_adjustment_value = $event),
                unit: "°" + unref(config).temp_format,
                label: "Temperature sensor adjustment",
                min: "-10",
                max: "10",
                step: ".01",
                width: "4",
                help: "This value will be added to the temperature sensor value to adjust the value (-10 to 10)",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "unit", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_15$f, [
              createVNode(_component_BsInputSwitch, {
                modelValue: unref(config).gyro_temp,
                "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => unref(config).gyro_temp = $event),
                label: "Gyro temperature",
                help: "Use the temperature sensor in the gyro instead of DS18B20, require a minimum 300s update interval to be accurate or the heat from the chip will affect reading",
                disabled: unref(global$1).disabled || unref(config).gyro_disabled
              }, null, 8, ["modelValue", "disabled"])
            ]),
            _hoisted_16$e,
            createBaseVNode("div", _hoisted_17$c, [
              createVNode(_component_BsInputSwitch, {
                modelValue: unref(config).gyro_disabled,
                "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => unref(config).gyro_disabled = $event),
                label: "Disable gyro",
                help: "If active then the device works as a temperature sensor and ALL gyro functions are disabled",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_18$c, [
              createVNode(_component_BsInputReadonly, {
                modelValue: calibrationValues.value,
                "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => calibrationValues.value = $event),
                label: "Gyro calibration",
                help: "Shows the current gyro calibraton values",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"])
            ])
          ]),
          createBaseVNode("div", _hoisted_19$b, [
            _hoisted_20$b,
            createBaseVNode("div", _hoisted_21$b, [
              createBaseVNode("button", {
                type: "submit",
                class: "btn btn-primary w-2",
                disabled: unref(global$1).disabled || !unref(global$1).configChanged
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_23$6),
                createTextVNode("  Save ")
              ], 8, _hoisted_22$7)
            ]),
            createBaseVNode("div", _hoisted_24$5, [
              createBaseVNode("button", {
                onClick: _cache[10] || (_cache[10] = ($event) => unref(restart)()),
                type: "button",
                class: "btn btn-secondary",
                disabled: unref(global$1).disabled
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_26$4),
                createTextVNode("  Restart device ")
              ], 8, _hoisted_25$4)
            ]),
            createBaseVNode("div", _hoisted_27$3, [
              createBaseVNode("button", {
                onClick: calibrate,
                type: "button",
                class: "btn btn-secondary",
                disabled: unref(global$1).disabled
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_29$3),
                createTextVNode("  Calibrate gyro "),
                deviceGyroCalibratedBadge() ? (openBlock(), createElementBlock("span", _hoisted_30$2, "1")) : createCommentVNode("", true)
              ], 8, _hoisted_28$3)
            ]),
            unref(status).ispindel_config ? (openBlock(), createElementBlock("div", _hoisted_31$2, [
              createBaseVNode("button", {
                onClick: ispindel,
                type: "button",
                class: "btn btn-secondary",
                disabled: unref(global$1).disabled
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_33$2),
                createTextVNode("  Import iSpindel config "),
                deviceMigrateIspindelBadge() ? (openBlock(), createElementBlock("span", _hoisted_34$2, "1")) : createCommentVNode("", true)
              ], 8, _hoisted_32$2)
            ])) : createCommentVNode("", true)
          ])
        ], 32)
      ]);
    };
  }
};
const _hoisted_1$L = { class: "container" };
const _hoisted_2$H = /* @__PURE__ */ createBaseVNode("p", null, null, -1);
const _hoisted_3$x = /* @__PURE__ */ createBaseVNode("p", { class: "h3" }, "Device - WIFI", -1);
const _hoisted_4$n = /* @__PURE__ */ createBaseVNode("hr", null, null, -1);
const _hoisted_5$i = { class: "row" };
const _hoisted_6$h = { class: "col-md-6" };
const _hoisted_7$h = { class: "col-md-6" };
const _hoisted_8$i = { class: "col-md-6" };
const _hoisted_9$g = { class: "col-md-6" };
const _hoisted_10$g = /* @__PURE__ */ createBaseVNode("div", { class: "col-md-12" }, [
  /* @__PURE__ */ createBaseVNode("hr")
], -1);
const _hoisted_11$e = { class: "col-md-6" };
const _hoisted_12$e = { class: "col-md-6" };
const _hoisted_13$e = { class: "col-md-6" };
const _hoisted_14$e = { class: "row gy-2" };
const _hoisted_15$e = /* @__PURE__ */ createBaseVNode("div", { class: "col-md-12" }, [
  /* @__PURE__ */ createBaseVNode("hr")
], -1);
const _hoisted_16$d = { class: "col-md-3" };
const _hoisted_17$b = ["disabled"];
const _hoisted_18$b = ["hidden"];
const _hoisted_19$a = { class: "col-md-3" };
const _hoisted_20$a = ["disabled"];
const _hoisted_21$a = ["hidden"];
const _sfc_main$L = {
  __name: "DeviceWifiView",
  setup(__props2) {
    const scanning = ref(false);
    const networks = ref([]);
    function wifiName(label, rssi, encr) {
      var l = label;
      if (encr) l += " 🔒";
      if (rssi > -50) l += " (Excellent)";
      else if (rssi > -60) l += " (Good)";
      else if (rssi > -67) l += " (Minimum)";
      else l += " (Poor)";
      return l;
    }
    onMounted(() => {
      scanning.value = true;
      config.runWifiScan((success, data) => {
        if (success) {
          networks.value = [{ label: "-blank-", value: "", rssi: 0, encryption: 0, channel: 0 }];
          for (var n in data.networks) {
            var d = data.networks[n];
            var o = {
              label: wifiName(d.wifi_ssid, d.rssi, d.encryption),
              value: d.wifi_ssid,
              rssi: d.rssi,
              encryption: data.networks[n].encryption,
              channel: d.channel
            };
            var f = networks.value.filter((obj) => {
              return obj.value === d.wifi_ssid;
            });
            logDebug("DeviceWifiView.onMounted()", "result:", f, d.wifi_ssid);
            if (f.length === 0) networks.value.push(o);
          }
          scanning.value = false;
        }
      });
    });
    const save = () => {
      if (!validateCurrentForm()) return;
      config.saveAll();
      global$1.messageInfo = "If WIFI settings are changed, restart the device and enter the new URL of the device!";
    };
    return (_ctx, _cache) => {
      const _component_BsMessage = resolveComponent("BsMessage");
      const _component_BsSelect = resolveComponent("BsSelect");
      const _component_BsInputText = resolveComponent("BsInputText");
      const _component_BsInputNumber = resolveComponent("BsInputNumber");
      const _component_BsInputSwitch = resolveComponent("BsInputSwitch");
      return openBlock(), createElementBlock("div", _hoisted_1$L, [
        _hoisted_2$H,
        _hoisted_3$x,
        _hoisted_4$n,
        scanning.value ? (openBlock(), createBlock(_component_BsMessage, {
          key: 0,
          dismissable: false,
          message: "Scanning for wifi networks in range",
          alert: "info"
        })) : createCommentVNode("", true),
        unref(config).wifi_ssid === "" && unref(config).wifi_ssid2 === "" ? (openBlock(), createBlock(_component_BsMessage, {
          key: 1,
          dismissable: "true",
          message: "",
          alert: "warning"
        }, {
          default: withCtx(() => [
            createTextVNode(" You need to define at least one wifi network ")
          ]),
          _: 1
        })) : createCommentVNode("", true),
        createBaseVNode("form", {
          onSubmit: withModifiers(save, ["prevent"]),
          class: "needs-validation",
          novalidate: ""
        }, [
          createBaseVNode("div", _hoisted_5$i, [
            createBaseVNode("div", _hoisted_6$h, [
              createVNode(_component_BsSelect, {
                modelValue: unref(config).wifi_ssid,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => unref(config).wifi_ssid = $event),
                label: "SSID #1",
                options: networks.value,
                badge: deviceWifi1Badge(),
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "options", "badge", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_7$h, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).wifi_pass,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => unref(config).wifi_pass = $event),
                type: "password",
                maxlength: "50",
                label: "Password #1",
                help: "Enter password for the first wifi network",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_8$i, [
              createVNode(_component_BsSelect, {
                modelValue: unref(config).wifi_ssid2,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => unref(config).wifi_ssid2 = $event),
                label: "SSID #2",
                options: networks.value,
                badge: deviceWifi2Badge(),
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "options", "badge", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_9$g, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).wifi_pass2,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => unref(config).wifi_pass2 = $event),
                type: "password",
                maxlength: "50",
                label: "Password #2",
                help: "Enter password for the first wifi network",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"])
            ]),
            _hoisted_10$g,
            createBaseVNode("div", _hoisted_11$e, [
              createVNode(_component_BsInputNumber, {
                modelValue: unref(config).wifi_portal_timeout,
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => unref(config).wifi_portal_timeout = $event),
                unit: "seconds",
                label: "Portal timeout",
                min: "10",
                max: "240",
                step: "1",
                width: "5",
                help: "Max time the wifi portal is idle (10 to 240)",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_12$e, [
              createVNode(_component_BsInputNumber, {
                modelValue: unref(config).wifi_connect_timeout,
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => unref(config).wifi_connect_timeout = $event),
                unit: "seconds",
                label: "Connection timeout",
                min: "1",
                max: "60",
                step: "1",
                width: "5",
                help: "Max time waiting for a wifi connection (1 to 60)",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_13$e, [
              createVNode(_component_BsInputSwitch, {
                modelValue: unref(config).wifi_scan_ap,
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => unref(config).wifi_scan_ap = $event),
                label: "Scan for strongest AP",
                help: "Will do a scan and connect to the strongest AP found (longer connection time)",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"])
            ])
          ]),
          createBaseVNode("div", _hoisted_14$e, [
            _hoisted_15$e,
            createBaseVNode("div", _hoisted_16$d, [
              createBaseVNode("button", {
                type: "submit",
                class: "btn btn-primary w-2",
                disabled: unref(global$1).disabled || !unref(global$1).configChanged
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_18$b),
                createTextVNode("  Save ")
              ], 8, _hoisted_17$b)
            ]),
            createBaseVNode("div", _hoisted_19$a, [
              createBaseVNode("button", {
                onClick: _cache[7] || (_cache[7] = ($event) => unref(restart)()),
                type: "button",
                class: "btn btn-secondary",
                disabled: unref(global$1).disabled
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_21$a),
                createTextVNode("  Restart device ")
              ], 8, _hoisted_20$a)
            ])
          ])
        ], 32)
      ]);
    };
  }
};
const _hoisted_1$K = { class: "container" };
const _hoisted_2$G = /* @__PURE__ */ createBaseVNode("p", null, null, -1);
const _hoisted_3$w = /* @__PURE__ */ createBaseVNode("p", { class: "h2" }, "Gravity - Settings", -1);
const _hoisted_4$m = /* @__PURE__ */ createBaseVNode("hr", null, null, -1);
const _hoisted_5$h = { class: "row" };
const _hoisted_6$g = { class: "col-md-6" };
const _hoisted_7$g = { class: "col-md-6" };
const _hoisted_8$h = { class: "col-md-6" };
const _hoisted_9$f = { class: "col-md-6" };
const _hoisted_10$f = { class: "col-md-6" };
const _hoisted_11$d = { class: "row gy-2" };
const _hoisted_12$d = /* @__PURE__ */ createBaseVNode("div", { class: "col-md-12" }, [
  /* @__PURE__ */ createBaseVNode("hr")
], -1);
const _hoisted_13$d = { class: "col-md-3" };
const _hoisted_14$d = ["disabled"];
const _hoisted_15$d = ["hidden"];
const _sfc_main$K = {
  __name: "GravitySettingsView",
  setup(__props2) {
    const calTempAdj = computed(() => {
      return !config.gravity_temp_adjustment || global$1.disabled;
    });
    const save = () => {
      if (!validateCurrentForm()) return;
      config.saveAll();
    };
    return (_ctx, _cache) => {
      const _component_BsMessage = resolveComponent("BsMessage");
      const _component_BsInputSwitch = resolveComponent("BsInputSwitch");
      const _component_BsInputNumber = resolveComponent("BsInputNumber");
      return openBlock(), createElementBlock("div", _hoisted_1$K, [
        _hoisted_2$G,
        _hoisted_3$w,
        _hoisted_4$m,
        unref(config).gyro_disabled ? (openBlock(), createBlock(_component_BsMessage, {
          key: 0,
          dismissable: "true",
          message: "",
          alert: "warning"
        }, {
          default: withCtx(() => [
            createTextVNode(" Gyro is disbled so the device will only be able to measure temperature ")
          ]),
          _: 1
        })) : createCommentVNode("", true),
        createBaseVNode("form", {
          onSubmit: withModifiers(save, ["prevent"]),
          class: "needs-validation",
          novalidate: ""
        }, [
          createBaseVNode("div", _hoisted_5$h, [
            createBaseVNode("div", _hoisted_6$g, [
              createVNode(_component_BsInputSwitch, {
                modelValue: unref(config).gravity_temp_adjustment,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => unref(config).gravity_temp_adjustment = $event),
                label: "Temperature adjust gravity",
                help: "Adjust the calculated gravity based on the current temperature. Assumes that calibration is done using 20C / 68F",
                disabled: unref(global$1).disabled || unref(config).gyro_disabled
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_7$g, [
              createVNode(_component_BsInputNumber, {
                modelValue: unref(config).formula_calibration_temp,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => unref(config).formula_calibration_temp = $event),
                unit: "°" + unref(config).temp_format,
                label: "Gravity calibration temp",
                min: "0",
                max: "100",
                step: ".01",
                width: "4",
                help: "Calibration temperature, used in temperatur correction formula, default 20C/68F",
                disabled: calTempAdj.value || unref(config).gyro_disabled
              }, null, 8, ["modelValue", "unit", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_8$h, [
              createVNode(_component_BsInputSwitch, {
                modelValue: unref(config).ignore_low_angles,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => unref(config).ignore_low_angles = $event),
                label: "Ignore low angles",
                help: "When active, angles below water will be ignored. Note! Angle must be defined under calibration, first field.",
                disabled: unref(global$1).disabled || unref(config).gyro_disabled
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_9$f, [
              createVNode(_component_BsInputNumber, {
                modelValue: unref(config).gyro_read_count,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => unref(config).gyro_read_count = $event),
                label: "Gyro reads",
                min: "10",
                max: "100",
                width: "4",
                help: "How many times should we read the gyro to get an accurate angle. More reads = better accuracy but higher battery drain",
                disabled: unref(global$1).disabled || unref(config).gyro_disabled
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_10$f, [
              createVNode(_component_BsInputNumber, {
                modelValue: unref(config).gyro_moving_threashold,
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => unref(config).gyro_moving_threashold = $event),
                label: "Gyro moving threashold",
                min: "50",
                max: "1000",
                width: "4",
                help: "How much deviation between gyro reads are acceptable in order to regard this as a valid angle",
                disabled: unref(global$1).disabled || unref(config).gyro_disabled
              }, null, 8, ["modelValue", "disabled"])
            ])
          ]),
          createBaseVNode("div", _hoisted_11$d, [
            _hoisted_12$d,
            createBaseVNode("div", _hoisted_13$d, [
              createBaseVNode("button", {
                type: "submit",
                class: "btn btn-primary w-2",
                disabled: unref(global$1).disabled || !unref(global$1).configChanged
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_15$d),
                createTextVNode("  Save ")
              ], 8, _hoisted_14$d)
            ])
          ])
        ], 32)
      ]);
    };
  }
};
const _hoisted_1$J = { class: "container" };
const _hoisted_2$F = /* @__PURE__ */ createBaseVNode("p", null, null, -1);
const _hoisted_3$v = /* @__PURE__ */ createBaseVNode("p", { class: "h2" }, "Gravity - Formula", -1);
const _hoisted_4$l = /* @__PURE__ */ createBaseVNode("hr", null, null, -1);
const _hoisted_5$g = { class: "row" };
const _hoisted_6$f = { class: "col-md-12" };
const _hoisted_7$f = /* @__PURE__ */ createBaseVNode("div", { class: "col-md-12" }, [
  /* @__PURE__ */ createBaseVNode("hr")
], -1);
const _hoisted_8$g = /* @__PURE__ */ createBaseVNode("div", { class: "col-md-12" }, [
  /* @__PURE__ */ createBaseVNode("label", { class: "form-label fw-bold" }, "Data for gravity calculation (Angle and Gravity)")
], -1);
const _hoisted_9$e = { class: "col-md-6" };
const _hoisted_10$e = { class: "input-group has-validation" };
const _hoisted_11$c = { class: "input-group-text" };
const _hoisted_12$c = ["onUpdate:modelValue", "disabled"];
const _hoisted_13$c = /* @__PURE__ */ createBaseVNode("span", { class: "input-group-text" }, /* @__PURE__ */ toDisplayString("°"), -1);
const _hoisted_14$c = { class: "col-md-6" };
const _hoisted_15$c = { class: "input-group has-validation" };
const _hoisted_16$c = { class: "input-group-text" };
const _hoisted_17$a = ["onUpdate:modelValue", "disabled"];
const _hoisted_18$a = { class: "input-group-text" };
const _hoisted_19$9 = /* @__PURE__ */ createBaseVNode("div", { class: "form-text" }, " Enter the data that is used to create a new formula. The most optimal formula will be selected and also validated towards these values. ", -1);
const _hoisted_20$9 = /* @__PURE__ */ createBaseVNode("div", { class: "col-md-12" }, [
  /* @__PURE__ */ createBaseVNode("hr")
], -1);
const _hoisted_21$9 = { class: "col-md-6" };
const _hoisted_22$6 = { class: "row gy-2" };
const _hoisted_23$5 = /* @__PURE__ */ createBaseVNode("div", { class: "col-md-12" }, [
  /* @__PURE__ */ createBaseVNode("hr")
], -1);
const _hoisted_24$4 = { class: "col-md-3" };
const _hoisted_25$3 = ["disabled"];
const _hoisted_26$3 = ["hidden"];
const _hoisted_27$2 = { class: "col-md-3" };
const _hoisted_28$2 = ["disabled"];
const _hoisted_29$2 = ["hidden"];
const _sfc_main$J = {
  __name: "GravityFormulaView",
  setup(__props2) {
    const save = () => {
      if (!validateCurrentForm()) return;
      config.saveAll();
    };
    const calcFormula = () => {
      if (!validateCurrentForm()) return;
      global$1.clearMessages();
      config.sendConfig((success) => {
        if (success) {
          fetch(global$1.baseURL + "api/formula", {
            headers: { Authorization: global$1.token },
            signal: AbortSignal.timeout(global$1.fetchTimout)
          }).then((res) => res.json()).then((json) => {
            if (json.success == true) {
              config.gravity_formula = json.gravity_formula;
              global$1.messageSuccess = json.message;
            } else {
              global$1.messageError = json.message;
            }
            global$1.disabled = false;
          }).catch((err) => {
            logError("GravityFormulaView.calcFormula()", err);
            global$1.messageError = "Failed to request formula creation";
            global$1.disabled = false;
          });
        } else {
          global$1.messageError = "Failed to store configuration to device";
          global$1.disabled = false;
        }
      });
    };
    return (_ctx, _cache) => {
      const _component_BsMessage = resolveComponent("BsMessage");
      const _component_BsInputText = resolveComponent("BsInputText");
      const _component_BsInputNumber = resolveComponent("BsInputNumber");
      return openBlock(), createElementBlock("div", _hoisted_1$J, [
        _hoisted_2$F,
        _hoisted_3$v,
        _hoisted_4$l,
        unref(config).gravity_formula === "" ? (openBlock(), createBlock(_component_BsMessage, {
          key: 0,
          dismissable: "true",
          message: "",
          alert: "warning"
        }, {
          default: withCtx(() => [
            createTextVNode(" You need to enter a formula in order to report gravity ")
          ]),
          _: 1
        })) : createCommentVNode("", true),
        unref(config).gyro_disabled ? (openBlock(), createBlock(_component_BsMessage, {
          key: 1,
          dismissable: "true",
          message: "",
          alert: "warning"
        }, {
          default: withCtx(() => [
            createTextVNode(" Gyro is disbled so the device will only be able to measure temperature ")
          ]),
          _: 1
        })) : createCommentVNode("", true),
        createBaseVNode("form", {
          onSubmit: withModifiers(save, ["prevent"]),
          class: "needs-validation",
          novalidate: ""
        }, [
          createBaseVNode("div", _hoisted_5$g, [
            createBaseVNode("div", _hoisted_6$f, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).gravity_formula,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => unref(config).gravity_formula = $event),
                maxlength: "200",
                label: "Gravity formula",
                help: "Formula used to convert angle to gravity",
                badge: gravityFormulaBadge(),
                disabled: unref(global$1).disabled || unref(config).gyro_disabled
              }, null, 8, ["modelValue", "badge", "disabled"])
            ]),
            _hoisted_7$f,
            _hoisted_8$g,
            (openBlock(true), createElementBlock(Fragment, null, renderList(unref(config).formula_calculation_data, (data, index) => {
              return openBlock(), createElementBlock(Fragment, { key: index }, [
                createBaseVNode("div", _hoisted_9$e, [
                  createBaseVNode("div", _hoisted_10$e, [
                    createBaseVNode("span", _hoisted_11$c, toDisplayString(index + 1), 1),
                    withDirectives(createBaseVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(config).formula_calculation_data[index].a = $event,
                      class: "form-control w-2",
                      type: "number",
                      min: "0",
                      max: "90",
                      step: ".001",
                      disabled: unref(global$1).disabled || unref(config).gyro_disabled
                    }, null, 8, _hoisted_12$c), [
                      [vModelText, unref(config).formula_calculation_data[index].a]
                    ]),
                    _hoisted_13$c
                  ])
                ]),
                createBaseVNode("div", _hoisted_14$c, [
                  createBaseVNode("div", _hoisted_15$c, [
                    createBaseVNode("span", _hoisted_16$c, toDisplayString(index + 1), 1),
                    withDirectives(createBaseVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(config).formula_calculation_data[index].g = $event,
                      class: "form-control",
                      type: "number",
                      min: "1",
                      max: "10",
                      step: ".0001",
                      disabled: unref(global$1).disabled || unref(config).gyro_disabled
                    }, null, 8, _hoisted_17$a), [
                      [vModelText, unref(config).formula_calculation_data[index].g]
                    ]),
                    createBaseVNode("span", _hoisted_18$a, toDisplayString(unref(config).gravity_format == "G" ? "SG" : "P"), 1)
                  ])
                ])
              ], 64);
            }), 128)),
            _hoisted_19$9,
            _hoisted_20$9,
            createBaseVNode("div", _hoisted_21$9, [
              createVNode(_component_BsInputNumber, {
                modelValue: unref(config).formula_max_deviation,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => unref(config).formula_max_deviation = $event),
                unit: unref(config).gravity_format == "G" ? "SG" : "P",
                label: "Max allowed deviation",
                min: "1",
                max: "10",
                step: ".1",
                width: "4",
                help: "When validating the derived formula this is the maximum accepted deviation for the supplied values, use the analysis page to visually check where there are deviations",
                disabled: unref(global$1).disabled || unref(config).gyro_disabled
              }, null, 8, ["modelValue", "unit", "disabled"])
            ])
          ]),
          createBaseVNode("div", _hoisted_22$6, [
            _hoisted_23$5,
            createBaseVNode("div", _hoisted_24$4, [
              createBaseVNode("button", {
                type: "submit",
                class: "btn btn-primary w-2",
                disabled: unref(global$1).disabled || !unref(global$1).configChanged
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_26$3),
                createTextVNode("  Save ")
              ], 8, _hoisted_25$3)
            ]),
            createBaseVNode("div", _hoisted_27$2, [
              createBaseVNode("button", {
                onClick: withModifiers(calcFormula, ["prevent"]),
                type: "button",
                class: "btn btn-primary w-2",
                disabled: unref(global$1).disabled
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_29$2),
                createTextVNode("  Calculate new Formula ")
              ], 8, _hoisted_28$2)
            ])
          ])
        ], 32)
      ]);
    };
  }
};
const _hoisted_1$I = { class: "container" };
const _hoisted_2$E = /* @__PURE__ */ createBaseVNode("p", null, null, -1);
const _hoisted_3$u = /* @__PURE__ */ createBaseVNode("p", { class: "h2" }, "Gravity - Analysis", -1);
const _hoisted_4$k = /* @__PURE__ */ createBaseVNode("hr", null, null, -1);
const _hoisted_5$f = /* @__PURE__ */ createBaseVNode("canvas", { id: "gravityChart" }, null, -1);
const _sfc_main$I = {
  __name: "GravityAnalysisView",
  setup(__props) {
    const chartDataForm = ref([]);
    const chartDataCalc = ref([]);
    const chart = ref(null);
    const dataSetChart = ref({
      datasets: [
        {
          label: "Raw data",
          borderColor: "blue",
          backgroundColor: "blue",
          data: chartDataForm.value
        },
        {
          label: "Calculated",
          borderColor: "green",
          backgroundColor: "green",
          data: chartDataCalc.value
        }
      ]
    });
    const configChart = ref({
      type: "line",
      data: dataSetChart.value,
      options: {
        responsive: true,
        interaction: {
          intersect: false
        },
        scales: {
          x: {
            display: true,
            type: "linear",
            grace: "5%",
            title: {
              display: true,
              text: "Angle"
            },
            ticks: {
              crossAlign: "far"
            },
            suggestedMin: 25
          },
          y: {
            display: true,
            title: {
              display: true,
              text: "Gravity"
            },
            suggestedMin: 1
          }
        }
      }
    });
    const convertToPlato = (sg) => {
      return 259 - 259 / sg;
    };
    onMounted(() => {
      for (let a = 25; a < 80; a += 5) {
        let angle = a.toFixed(3);
        let formula = config.gravity_formula;
        formula = formula.replaceAll("tilt^3", angle + "*" + angle + "*" + angle);
        formula = formula.replaceAll("tilt^2", angle + "*" + angle);
        formula = formula.replaceAll("tilt", angle);
        try {
          let g = eval(formula);
          if (config.gravity_format === "P") {
            g = convertToPlato(g);
          }
          chartDataCalc.value.push({ x: parseFloat(a), y: parseFloat(g) });
        } catch (err) {
          logError("GravityAnalysisView.onMounted()", err);
          global$1.messageError = "Error evaluating the formula, the formula is invalid";
        }
      }
      for (let i = 0; i < config.formula_calculation_data.length; i++) {
        if (config.formula_calculation_data[i].a > 0)
          chartDataForm.value.push({
            x: config.formula_calculation_data[i].a,
            y: config.formula_calculation_data[i].g
          });
      }
      try {
        chart.value = new Chart(document.getElementById("gravityChart"), configChart.value);
      } catch (err) {
        logError("GravityAnalysisView.onMounted()", err);
      }
    });
    return (_ctx, _cache) => {
      const _component_BsMessage = resolveComponent("BsMessage");
      return openBlock(), createElementBlock("div", _hoisted_1$I, [
        _hoisted_2$E,
        _hoisted_3$u,
        _hoisted_4$k,
        !chart.value ? (openBlock(), createBlock(_component_BsMessage, {
          key: 0,
          dismissable: "false",
          message: "",
          alert: "danger"
        }, {
          default: withCtx(() => [
            createTextVNode(" Unable to load chart.js from https://cdn.jsdelivr.net, check your internet connection ")
          ]),
          _: 1
        })) : createCommentVNode("", true),
        _hoisted_5$f
      ]);
    };
  }
};
const _hoisted_1$H = { class: "container" };
const _hoisted_2$D = /* @__PURE__ */ createBaseVNode("p", null, null, -1);
const _hoisted_3$t = /* @__PURE__ */ createBaseVNode("p", { class: "h3" }, "Push - Settings", -1);
const _hoisted_4$j = /* @__PURE__ */ createBaseVNode("hr", null, null, -1);
const _hoisted_5$e = { class: "row" };
const _hoisted_6$e = { class: "col-md-6" };
const _hoisted_7$e = { class: "col-md-6" };
const _hoisted_8$f = { class: "col-md-6" };
const _hoisted_9$d = { class: "col-md-6" };
const _hoisted_10$d = { class: "col-md-6" };
const _hoisted_11$b = {
  key: 0,
  class: "col-md-6"
};
const _hoisted_12$b = /* @__PURE__ */ createBaseVNode("div", { class: "col-md-12" }, [
  /* @__PURE__ */ createBaseVNode("hr")
], -1);
const _hoisted_13$b = /* @__PURE__ */ createBaseVNode("div", { class: "col-md-12" }, [
  /* @__PURE__ */ createBaseVNode("p", null, " Using the WIFI direct feature means that the device will connect to the AP and send data using HTTP post to the Gravitymon Gateway. ")
], -1);
const _hoisted_14$b = { class: "col-md-6" };
const _hoisted_15$b = { class: "col-md-6" };
const _hoisted_16$b = { class: "col-md-6" };
const _hoisted_17$9 = { class: "row gy-2" };
const _hoisted_18$9 = /* @__PURE__ */ createBaseVNode("div", { class: "col-md-12" }, [
  /* @__PURE__ */ createBaseVNode("hr")
], -1);
const _hoisted_19$8 = { class: "col-md-3" };
const _hoisted_20$8 = ["disabled"];
const _hoisted_21$8 = ["hidden"];
const _sfc_main$H = {
  __name: "PushSettingsView",
  setup(__props2) {
    const { sleep_interval } = storeToRefs(config);
    const batteryLife = ref("");
    const sleepLabel = ref("");
    const save = () => {
      if (!validateCurrentForm()) return;
      config.saveAll();
    };
    watch(sleep_interval, () => {
      createSleepLabel();
      calculateBatteryLife();
    });
    onMounted(() => {
      createSleepLabel();
      calculateBatteryLife();
    });
    const createSleepLabel = () => {
      var s = Math.floor(sleep_interval.value / 60) + " min " + sleep_interval.value % 60 + " sec";
      sleepLabel.value = "(" + s + ")";
    };
    const calculateBatteryLife = () => {
      var pwrActive = 160;
      var pwrSleep = 15;
      var batt = 2200;
      var rt = status.runtime_average;
      var ble = config.ble_format === 0 ? false : true;
      var wifi = config.http_post_target.length + config.http_post2_target.length + config.http_get_target.length + config.influxdb2_target.length + config.mqtt_target.length > 0 ? true : false;
      if (!wifi && !ble) {
        logError(
          "PushSettingsView.calculateBatteryLife()",
          "No push targets defined, cannot estimate battery life"
        );
        return;
      }
      if (wifi) {
        switch (status.platform) {
          case "esp8266":
            pwrActive = 160;
            break;
          case "esp32":
            pwrActive = 320;
            break;
          case "esp32c3":
            pwrActive = 320;
            break;
          case "esp32s2":
            pwrActive = 280;
            break;
          case "esp32s3":
            pwrActive = 300;
            break;
          case "esp32lite":
            pwrActive = 330;
            break;
          default:
            logError("PushSettingsView.calculateBatteryLife()", "Unknown platform", status.platform);
            break;
        }
      } else {
        switch (status.platform) {
          case "esp8266":
          case "esp32":
          case "esp32c3":
          case "esp32s2":
          case "esp32lite":
            pwrActive = 160;
            break;
          case "esp32s3":
            pwrActive = 180;
            break;
          default:
            logError("PushSettingsView.calculateBatteryLife()", "Unknown platform", status.platform);
            break;
        }
      }
      if (rt < 4) rt = 4;
      var powerPerDay = 24 * 3600 / (config.sleep_interval + rt) * (rt / 3600) * pwrActive + pwrSleep;
      var days = batt / powerPerDay;
      logDebug(
        "PushSettingsView.calculateBatteryLife()",
        "Estimated power per hour = " + pwrActive.toString() + "mA on platform = " + status.platform
      );
      batteryLife.value = Math.floor(days / 7) + " weeks " + Math.floor(days % 7) + " days";
    };
    return (_ctx, _cache) => {
      const _component_BsMessage = resolveComponent("BsMessage");
      const _component_BsInputText = resolveComponent("BsInputText");
      const _component_BsInputNumber = resolveComponent("BsInputNumber");
      const _component_BsInputReadonly = resolveComponent("BsInputReadonly");
      const _component_BsInputSwitch = resolveComponent("BsInputSwitch");
      return openBlock(), createElementBlock("div", _hoisted_1$H, [
        _hoisted_2$D,
        _hoisted_3$t,
        _hoisted_4$j,
        unref(config).sleep_interval < 300 ? (openBlock(), createBlock(_component_BsMessage, {
          key: 0,
          dismissable: "true",
          message: "",
          alert: "warning"
        }, {
          default: withCtx(() => [
            createTextVNode(" A sleep-interval of less than 300 will reduce battery life, consider using 900 ")
          ]),
          _: 1
        })) : createCommentVNode("", true),
        unref(config).gyro_temp && unref(config).sleep_interval < 300 ? (openBlock(), createBlock(_component_BsMessage, {
          key: 1,
          dismissable: "true",
          message: "",
          alert: "warning"
        }, {
          default: withCtx(() => [
            createTextVNode(" When using gyro temperature is used, select a sleep-interval that is greater than 300 for accurate readings ")
          ]),
          _: 1
        })) : createCommentVNode("", true),
        createBaseVNode("form", {
          onSubmit: withModifiers(save, ["prevent"]),
          class: "needs-validation",
          novalidate: ""
        }, [
          createBaseVNode("div", _hoisted_5$e, [
            createBaseVNode("div", _hoisted_6$e, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).token,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => unref(config).token = $event),
                maxlength: "50",
                label: "Token 1",
                help: "Token can be used in the format template as a variable, some services use this for authentication",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_7$e, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).token2,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => unref(config).token2 = $event),
                maxlength: "50",
                label: "Token 2",
                help: "Token can be used in the format template as a variable, some services use this for authentication",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_8$f, [
              createVNode(_component_BsInputNumber, {
                modelValue: unref(config).sleep_interval,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => unref(config).sleep_interval = $event),
                label: "Sleep interval" + sleepLabel.value,
                unit: "s",
                min: "10",
                max: "3600",
                step: "1",
                width: "5",
                help: "The number of seconds that the device will sleep between gravity readings. Recommended value is 300s",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "label", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_9$d, [
              createVNode(_component_BsInputReadonly, {
                modelValue: batteryLife.value,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => batteryLife.value = $event),
                label: "Estimated battery life",
                help: "Based on current settings and platform, this is the estimated battery life",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_10$d, [
              createVNode(_component_BsInputNumber, {
                modelValue: unref(config).push_timeout,
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => unref(config).push_timeout = $event),
                label: "Push timeout",
                unit: "s",
                min: "10",
                max: "60",
                step: "1",
                width: "5",
                help: "The number of seconds that the device will wait until a remote service accepts the connection",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"])
            ]),
            unref(status).platform === "esp8266" ? (openBlock(), createElementBlock("div", _hoisted_11$b, [
              createVNode(_component_BsInputSwitch, {
                modelValue: unref(config).skip_ssl_on_test,
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => unref(config).skip_ssl_on_test = $event),
                label: "Skip SSL post in config mode",
                help: "Don't do SSL when running in configuration mode, on ESP8266 this can cause the device to crash due to low memory, only applies to ESP8266",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"])
            ])) : createCommentVNode("", true),
            _hoisted_12$b,
            _hoisted_13$b,
            createBaseVNode("div", _hoisted_14$b, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).wifi_direct_ssid,
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => unref(config).wifi_direct_ssid = $event),
                label: "Direct SSID",
                help: "Enter the SSID for the wifi direct functionallity",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_15$b, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).wifi_direct_pass,
                "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => unref(config).wifi_direct_pass = $event),
                type: "password",
                maxlength: "50",
                label: "Direct Password",
                help: "Enter password for the wifi direct network",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_16$b, [
              createVNode(_component_BsInputSwitch, {
                modelValue: unref(config).use_wifi_direct,
                "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => unref(config).use_wifi_direct = $event),
                label: "Use wifi direct in gravity mode",
                help: "In gravity mode the wifi direct SSID/Password will be used for connection",
                disabled: unref(global$1).disabled
              }, null, 8, ["modelValue", "disabled"])
            ])
          ]),
          createBaseVNode("div", _hoisted_17$9, [
            _hoisted_18$9,
            createBaseVNode("div", _hoisted_19$8, [
              createBaseVNode("button", {
                type: "submit",
                class: "btn btn-primary w-2",
                disabled: unref(global$1).disabled || !unref(global$1).configChanged
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_21$8),
                createTextVNode("  Save ")
              ], 8, _hoisted_20$8)
            ])
          ])
        ], 32)
      ]);
    };
  }
};
const _hoisted_1$G = { class: "container" };
const _hoisted_2$C = /* @__PURE__ */ createBaseVNode("p", null, null, -1);
const _hoisted_3$s = /* @__PURE__ */ createBaseVNode("p", { class: "h3" }, "Push - HTTP Post #1", -1);
const _hoisted_4$i = /* @__PURE__ */ createBaseVNode("hr", null, null, -1);
const _hoisted_5$d = ["disabled"];
const _hoisted_6$d = { class: "row" };
const _hoisted_7$d = { class: "col-md-9" };
const _hoisted_8$e = { class: "col-md-3" };
const _hoisted_9$c = { class: "col-md-9" };
const _hoisted_10$c = { class: "col-md-3" };
const _hoisted_11$a = { class: "col-md-9" };
const _hoisted_12$a = { class: "col-md-3" };
const _hoisted_13$a = { class: "col-md-6" };
const _hoisted_14$a = { class: "col-md-9" };
const _hoisted_15$a = { class: "col-md-3" };
const _hoisted_16$a = { class: "row gy-2" };
const _hoisted_17$8 = /* @__PURE__ */ createBaseVNode("div", { class: "col-md-12" }, [
  /* @__PURE__ */ createBaseVNode("hr")
], -1);
const _hoisted_18$8 = { class: "col-md-3" };
const _hoisted_19$7 = ["disabled"];
const _hoisted_20$7 = ["hidden"];
const _hoisted_21$7 = { class: "col-md-3" };
const _hoisted_22$5 = ["disabled"];
const _hoisted_23$4 = ["hidden"];
const _sfc_main$G = {
  __name: "PushHttpPost1View",
  setup(__props2) {
    const render = ref("");
    const pushDisabled = computed(() => {
      return global$1.disabled || config.use_wifi_direct;
    });
    const runTest = () => {
      const data = {
        push_format: "http_post_format"
      };
      global$1.clearMessages();
      config.runPushTest(data, () => {
      });
    };
    const httpUrlCallback = (opt) => {
      config.http_post_target = opt;
    };
    const httpHeaderH1Callback = (opt) => {
      config.http_post_header1 = opt;
    };
    const httpHeaderH2Callback = (opt) => {
      config.http_post_header2 = opt;
    };
    const httpFormatCallback = (opt) => {
      config.http_post_format = decodeURIComponent(opt);
    };
    const renderFormat = () => {
      render.value = applyTemplate(status, config, config.http_post_format);
    };
    const save = () => {
      if (!validateCurrentForm()) return;
      config.saveAll();
    };
    return (_ctx, _cache) => {
      const _component_BsInputText = resolveComponent("BsInputText");
      const _component_BsDropdown = resolveComponent("BsDropdown");
      const _component_BsInputNumber = resolveComponent("BsInputNumber");
      const _component_BsInputTextAreaFormat = resolveComponent("BsInputTextAreaFormat");
      const _component_BsModal = resolveComponent("BsModal");
      return openBlock(), createElementBlock("div", _hoisted_1$G, [
        _hoisted_2$C,
        _hoisted_3$s,
        _hoisted_4$i,
        createBaseVNode("form", {
          onSubmit: withModifiers(save, ["prevent"]),
          class: "needs-validation",
          novalidate: "",
          disabled: unref(config).use_wifi_direct
        }, [
          createBaseVNode("div", _hoisted_6$d, [
            createBaseVNode("div", _hoisted_7$d, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).http_post_target,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => unref(config).http_post_target = $event),
                type: "url",
                maxlength: "120",
                label: "HTTP URL",
                help: "URL to push target, use format http://servername.com/resource (Supports http and https)",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_8$e, [
              createVNode(_component_BsDropdown, {
                label: "Predefined URLs",
                button: "URL",
                options: unref(httpPostUrlOptions),
                callback: httpUrlCallback,
                disabled: pushDisabled.value
              }, null, 8, ["options", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_9$c, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).http_post_header1,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => unref(config).http_post_header1 = $event),
                maxlength: "120",
                pattern: "(.+): (.+)",
                label: "HTTP Header #1",
                help: "",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_10$c, [
              createVNode(_component_BsDropdown, {
                label: "Predefined headers",
                button: "Header",
                options: unref(httpHeaderOptions),
                callback: httpHeaderH1Callback,
                disabled: pushDisabled.value
              }, null, 8, ["options", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_11$a, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).http_post_header2,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => unref(config).http_post_header2 = $event),
                maxlength: "120",
                pattern: "(.+): (.+)",
                label: "HTTP Header #2",
                help: "Set a http headers, empty string is skipped, example: Content-Type: application/json",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_12$a, [
              createVNode(_component_BsDropdown, {
                label: "Predefined headers",
                button: "Header",
                options: unref(httpHeaderOptions),
                callback: httpHeaderH2Callback,
                disabled: pushDisabled.value
              }, null, 8, ["options", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_13$a, [
              createVNode(_component_BsInputNumber, {
                modelValue: unref(config).http_post_int,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => unref(config).http_post_int = $event),
                label: "Skip interval",
                min: "0",
                max: "5",
                width: "4",
                help: "Defines how many sleep cycles to skip between pushing data to this target, 1 = every second cycle. Default is 0.",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_14$a, [
              createVNode(_component_BsInputTextAreaFormat, {
                modelValue: unref(config).http_post_format,
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => unref(config).http_post_format = $event),
                rows: "6",
                label: "Data format",
                help: "Format template used to create the data sent to the remote service",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_15$a, [
              createVNode(_component_BsDropdown, {
                label: "Predefined formats",
                button: "Formats",
                options: unref(httpPostFormatOptions),
                callback: httpFormatCallback,
                disabled: pushDisabled.value
              }, null, 8, ["options", "disabled"]),
              createVNode(_component_BsModal, {
                onClick: renderFormat,
                modelValue: render.value,
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => render.value = $event),
                code: true,
                title: "Format preview",
                button: "Preview format",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ])
          ]),
          createBaseVNode("div", _hoisted_16$a, [
            _hoisted_17$8,
            createBaseVNode("div", _hoisted_18$8, [
              createBaseVNode("button", {
                type: "submit",
                class: "btn btn-primary w-2",
                disabled: unref(global$1).disabled || !unref(global$1).configChanged
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_20$7),
                createTextVNode("  Save ")
              ], 8, _hoisted_19$7)
            ]),
            createBaseVNode("div", _hoisted_21$7, [
              createBaseVNode("button", {
                onClick: runTest,
                type: "button",
                class: "btn btn-secondary",
                disabled: pushDisabled.value
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_23$4),
                createTextVNode("  Run push test ")
              ], 8, _hoisted_22$5)
            ])
          ])
        ], 40, _hoisted_5$d)
      ]);
    };
  }
};
const _hoisted_1$F = { class: "container" };
const _hoisted_2$B = /* @__PURE__ */ createBaseVNode("p", null, null, -1);
const _hoisted_3$r = /* @__PURE__ */ createBaseVNode("p", { class: "h3" }, "Push - HTTP Post #2", -1);
const _hoisted_4$h = /* @__PURE__ */ createBaseVNode("hr", null, null, -1);
const _hoisted_5$c = ["disabled"];
const _hoisted_6$c = { class: "row" };
const _hoisted_7$c = { class: "col-md-9" };
const _hoisted_8$d = { class: "col-md-3" };
const _hoisted_9$b = { class: "col-md-9" };
const _hoisted_10$b = { class: "col-md-3" };
const _hoisted_11$9 = { class: "col-md-9" };
const _hoisted_12$9 = { class: "col-md-3" };
const _hoisted_13$9 = { class: "col-md-6" };
const _hoisted_14$9 = { class: "row" };
const _hoisted_15$9 = { class: "col-md-9" };
const _hoisted_16$9 = { class: "col-md-3" };
const _hoisted_17$7 = { class: "row gy-2" };
const _hoisted_18$7 = /* @__PURE__ */ createBaseVNode("div", { class: "col-md-12" }, [
  /* @__PURE__ */ createBaseVNode("hr")
], -1);
const _hoisted_19$6 = { class: "col-md-3" };
const _hoisted_20$6 = ["disabled"];
const _hoisted_21$6 = ["hidden"];
const _hoisted_22$4 = { class: "col-md-3" };
const _hoisted_23$3 = ["disabled"];
const _hoisted_24$3 = ["hidden"];
const _sfc_main$F = {
  __name: "PushHttpPost2View",
  setup(__props2) {
    const render = ref("");
    const pushDisabled = computed(() => {
      return global$1.disabled || config.use_wifi_direct;
    });
    const runTest = () => {
      const data = {
        push_format: "http_post2_format"
      };
      global$1.clearMessages();
      config.runPushTest(data, () => {
      });
    };
    const httpUrlCallback = (opt) => {
      config.http_post2_target = opt;
    };
    const httpHeaderH1Callback = (opt) => {
      config.http_post2_header1 = opt;
    };
    const httpHeaderH2Callback = (opt) => {
      config.http_post2_header2 = opt;
    };
    const httpFormatCallback = (opt) => {
      config.http_post2_format = decodeURIComponent(opt);
    };
    const renderFormat = () => {
      render.value = applyTemplate(status, config, config.http_post2_format);
    };
    const save = () => {
      if (!validateCurrentForm()) return;
      config.saveAll();
    };
    return (_ctx, _cache) => {
      const _component_BsInputText = resolveComponent("BsInputText");
      const _component_BsDropdown = resolveComponent("BsDropdown");
      const _component_BsInputNumber = resolveComponent("BsInputNumber");
      const _component_BsInputTextAreaFormat = resolveComponent("BsInputTextAreaFormat");
      const _component_BsModal = resolveComponent("BsModal");
      return openBlock(), createElementBlock("div", _hoisted_1$F, [
        _hoisted_2$B,
        _hoisted_3$r,
        _hoisted_4$h,
        createBaseVNode("form", {
          onSubmit: withModifiers(save, ["prevent"]),
          class: "needs-validation",
          novalidate: "",
          disabled: unref(config).use_wifi_direct
        }, [
          createBaseVNode("div", _hoisted_6$c, [
            createBaseVNode("div", _hoisted_7$c, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).http_post2_target,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => unref(config).http_post2_target = $event),
                type: "url",
                maxlength: "120",
                label: "HTTP URL",
                help: "URL to push target, use format http://servername.com/resource (Supports http and https)",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_8$d, [
              createVNode(_component_BsDropdown, {
                label: "Predefined URLs",
                button: "URL",
                options: unref(httpPostUrlOptions),
                callback: httpUrlCallback,
                disabled: pushDisabled.value
              }, null, 8, ["options", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_9$b, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).http_post2_header1,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => unref(config).http_post2_header1 = $event),
                maxlength: "120",
                pattern: "(.+): (.+)",
                label: "HTTP Header #1",
                help: "",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_10$b, [
              createVNode(_component_BsDropdown, {
                label: "Predefined headers",
                button: "Header",
                options: unref(httpHeaderOptions),
                callback: httpHeaderH1Callback,
                disabled: pushDisabled.value
              }, null, 8, ["options", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_11$9, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).http_post2_header2,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => unref(config).http_post2_header2 = $event),
                maxlength: "120",
                pattern: "(.+): (.+)",
                label: "HTTP Header #2",
                help: "Set a http headers, empty string is skipped, example: Content-Type: application/json",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_12$9, [
              createVNode(_component_BsDropdown, {
                label: "Predefined headers",
                button: "Header",
                options: unref(httpHeaderOptions),
                callback: httpHeaderH2Callback,
                disabled: pushDisabled.value
              }, null, 8, ["options", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_13$9, [
              createVNode(_component_BsInputNumber, {
                modelValue: unref(config).http_post2_int,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => unref(config).http_post2_int = $event),
                label: "Skip interval",
                min: "0",
                max: "5",
                width: "4",
                help: "Defines how many sleep cycles to skip between pushing data to this target, 1 = every second cycle. Default is 0.",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ])
          ]),
          createBaseVNode("div", _hoisted_14$9, [
            createBaseVNode("div", _hoisted_15$9, [
              createVNode(_component_BsInputTextAreaFormat, {
                modelValue: unref(config).http_post2_format,
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => unref(config).http_post2_format = $event),
                rows: "6",
                label: "Data format",
                help: "Format template used to create the data sent to the remote service",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_16$9, [
              createVNode(_component_BsDropdown, {
                label: "Predefined formats",
                button: "Formats",
                options: unref(httpPostFormatOptions),
                callback: httpFormatCallback,
                disabled: pushDisabled.value
              }, null, 8, ["options", "disabled"]),
              createVNode(_component_BsModal, {
                onClick: renderFormat,
                modelValue: render.value,
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => render.value = $event),
                code: true,
                title: "Format preview",
                button: "Preview format",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ])
          ]),
          createBaseVNode("div", _hoisted_17$7, [
            _hoisted_18$7,
            createBaseVNode("div", _hoisted_19$6, [
              createBaseVNode("button", {
                type: "submit",
                class: "btn btn-primary w-2",
                disabled: unref(global$1).disabled || !unref(global$1).configChanged
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_21$6),
                createTextVNode("  Save ")
              ], 8, _hoisted_20$6)
            ]),
            createBaseVNode("div", _hoisted_22$4, [
              createBaseVNode("button", {
                onClick: runTest,
                type: "button",
                class: "btn btn-secondary",
                disabled: pushDisabled.value
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_24$3),
                createTextVNode("  Run push test ")
              ], 8, _hoisted_23$3)
            ])
          ])
        ], 40, _hoisted_5$c)
      ]);
    };
  }
};
const _hoisted_1$E = { class: "container" };
const _hoisted_2$A = /* @__PURE__ */ createBaseVNode("p", null, null, -1);
const _hoisted_3$q = /* @__PURE__ */ createBaseVNode("p", { class: "h3" }, "Push - HTTP Get", -1);
const _hoisted_4$g = /* @__PURE__ */ createBaseVNode("hr", null, null, -1);
const _hoisted_5$b = { class: "row" };
const _hoisted_6$b = { class: "col-md-9" };
const _hoisted_7$b = { class: "col-md-3" };
const _hoisted_8$c = { class: "col-md-9" };
const _hoisted_9$a = { class: "col-md-3" };
const _hoisted_10$a = { class: "col-md-9" };
const _hoisted_11$8 = { class: "col-md-3" };
const _hoisted_12$8 = { class: "col-md-6" };
const _hoisted_13$8 = { class: "col-md-9" };
const _hoisted_14$8 = { class: "col-md-3" };
const _hoisted_15$8 = { class: "row gy-2" };
const _hoisted_16$8 = /* @__PURE__ */ createBaseVNode("div", { class: "col-md-12" }, [
  /* @__PURE__ */ createBaseVNode("hr")
], -1);
const _hoisted_17$6 = { class: "col-md-3" };
const _hoisted_18$6 = ["disabled"];
const _hoisted_19$5 = ["hidden"];
const _hoisted_20$5 = { class: "col-md-3" };
const _hoisted_21$5 = ["disabled"];
const _hoisted_22$3 = ["hidden"];
const _sfc_main$E = {
  __name: "PushHttpGetView",
  setup(__props2) {
    const render = ref("");
    const pushDisabled = computed(() => {
      return global$1.disabled || config.use_wifi_direct;
    });
    const runTest = () => {
      const data = {
        push_format: "http_get_format"
      };
      global$1.clearMessages();
      config.runPushTest(data, () => {
      });
    };
    const httpUrlCallback = (opt) => {
      config.http_get_target = opt;
    };
    const httpHeaderH1Callback = (opt) => {
      config.http_get_header1 = opt;
    };
    const httpHeaderH2Callback = (opt) => {
      config.http_get_header2 = opt;
    };
    const httpFormatCallback = (opt) => {
      config.http_get_format = decodeURIComponent(opt);
    };
    const renderFormat = () => {
      var s = applyTemplate(status, config, config.http_get_format);
      render.value = s.replaceAll("&", "&");
    };
    const save = () => {
      if (!validateCurrentForm()) return;
      config.saveAll();
    };
    return (_ctx, _cache) => {
      const _component_BsInputText = resolveComponent("BsInputText");
      const _component_BsDropdown = resolveComponent("BsDropdown");
      const _component_BsInputNumber = resolveComponent("BsInputNumber");
      const _component_BsInputTextAreaFormat = resolveComponent("BsInputTextAreaFormat");
      const _component_BsModal = resolveComponent("BsModal");
      return openBlock(), createElementBlock("div", _hoisted_1$E, [
        _hoisted_2$A,
        _hoisted_3$q,
        _hoisted_4$g,
        createBaseVNode("form", {
          onSubmit: withModifiers(save, ["prevent"]),
          class: "needs-validation",
          novalidate: ""
        }, [
          createBaseVNode("div", _hoisted_5$b, [
            createBaseVNode("div", _hoisted_6$b, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).http_get_target,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => unref(config).http_get_target = $event),
                type: "url",
                maxlength: "120",
                label: "HTTP URL",
                help: "URL to push target, use format http://servername.com/resource (Supports http and https)",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_7$b, [
              createVNode(_component_BsDropdown, {
                label: "Predefined URLs",
                button: "URL",
                options: unref(httpGetUrlOptions),
                callback: httpUrlCallback,
                disabled: pushDisabled.value
              }, null, 8, ["options", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_8$c, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).http_get_header1,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => unref(config).http_get_header1 = $event),
                maxlength: "120",
                pattern: "(.+): (.+)",
                label: "HTTP Header #1",
                help: "",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_9$a, [
              createVNode(_component_BsDropdown, {
                label: "Predefined headers",
                button: "Header",
                options: unref(httpHeaderOptions),
                callback: httpHeaderH1Callback,
                disabled: pushDisabled.value
              }, null, 8, ["options", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_10$a, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).http_get_header2,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => unref(config).http_get_header2 = $event),
                maxlength: "120",
                pattern: "(.+): (.+)",
                label: "HTTP Header #2",
                help: "Set a http headers, empty string is skipped, example: Content-Type: application/json",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_11$8, [
              createVNode(_component_BsDropdown, {
                label: "Predefined headers",
                button: "Header",
                options: unref(httpHeaderOptions),
                callback: httpHeaderH2Callback,
                disabled: pushDisabled.value
              }, null, 8, ["options", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_12$8, [
              createVNode(_component_BsInputNumber, {
                modelValue: unref(config).http_get_int,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => unref(config).http_get_int = $event),
                label: "Skip interval",
                min: "0",
                max: "5",
                width: "4",
                help: "Defines how many sleep cycles to skip between pushing data to this target, 1 = every second cycle. Default is 0.",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_13$8, [
              createVNode(_component_BsInputTextAreaFormat, {
                modelValue: unref(config).http_get_format,
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => unref(config).http_get_format = $event),
                rows: "6",
                label: "Data format",
                help: "Format template used to create the data sent to the remote service",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_14$8, [
              createVNode(_component_BsDropdown, {
                label: "Predefined formats",
                button: "Formats",
                options: unref(httpGetFormatOptions),
                callback: httpFormatCallback,
                disabled: pushDisabled.value
              }, null, 8, ["options", "disabled"]),
              createVNode(_component_BsModal, {
                onClick: renderFormat,
                modelValue: render.value,
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => render.value = $event),
                code: true,
                title: "Format preview",
                button: "Preview format",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ])
          ]),
          createBaseVNode("div", _hoisted_15$8, [
            _hoisted_16$8,
            createBaseVNode("div", _hoisted_17$6, [
              createBaseVNode("button", {
                type: "submit",
                class: "btn btn-primary w-2",
                disabled: unref(global$1).disabled || !unref(global$1).configChanged
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_19$5),
                createTextVNode("  Save ")
              ], 8, _hoisted_18$6)
            ]),
            createBaseVNode("div", _hoisted_20$5, [
              createBaseVNode("button", {
                onClick: runTest,
                type: "button",
                class: "btn btn-secondary",
                disabled: pushDisabled.value
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_22$3),
                createTextVNode("  Run push test ")
              ], 8, _hoisted_21$5)
            ])
          ])
        ], 32)
      ]);
    };
  }
};
const _hoisted_1$D = { class: "container" };
const _hoisted_2$z = /* @__PURE__ */ createBaseVNode("p", null, null, -1);
const _hoisted_3$p = /* @__PURE__ */ createBaseVNode("p", { class: "h3" }, "Push - Influxdb v2", -1);
const _hoisted_4$f = /* @__PURE__ */ createBaseVNode("hr", null, null, -1);
const _hoisted_5$a = ["disabled"];
const _hoisted_6$a = { class: "row" };
const _hoisted_7$a = { class: "col-md-12" };
const _hoisted_8$b = { class: "col-md-6" };
const _hoisted_9$9 = { class: "col-md-6" };
const _hoisted_10$9 = { class: "col-md-6" };
const _hoisted_11$7 = { class: "col-md-6" };
const _hoisted_12$7 = { class: "col-md-9" };
const _hoisted_13$7 = { class: "col-md-3 gy-2" };
const _hoisted_14$7 = { class: "row gy-2" };
const _hoisted_15$7 = /* @__PURE__ */ createBaseVNode("div", { class: "col-md-12" }, [
  /* @__PURE__ */ createBaseVNode("hr")
], -1);
const _hoisted_16$7 = { class: "col-sm-3" };
const _hoisted_17$5 = ["disabled"];
const _hoisted_18$5 = ["hidden"];
const _hoisted_19$4 = { class: "col-md-3" };
const _hoisted_20$4 = ["disabled"];
const _hoisted_21$4 = ["hidden"];
const _sfc_main$D = {
  __name: "PushInfluxdbView",
  setup(__props2) {
    const render = ref("");
    const pushDisabled = computed(() => {
      return global$1.disabled || config.use_wifi_direct;
    });
    const runTest = () => {
      const data = {
        push_format: "influxdb2_format"
      };
      global$1.clearMessages();
      config.runPushTest(data, () => {
      });
    };
    const influxdb2FormatCallback = (opt) => {
      config.influxdb2_format = decodeURIComponent(opt);
    };
    const renderFormat = () => {
      render.value = applyTemplate(status, config, config.influxdb2_format);
    };
    const save = () => {
      if (!validateCurrentForm()) return;
      config.saveAll();
    };
    return (_ctx, _cache) => {
      const _component_BsInputText = resolveComponent("BsInputText");
      const _component_BsInputNumber = resolveComponent("BsInputNumber");
      const _component_BsInputTextAreaFormat = resolveComponent("BsInputTextAreaFormat");
      const _component_BsDropdown = resolveComponent("BsDropdown");
      const _component_BsModal = resolveComponent("BsModal");
      return openBlock(), createElementBlock("div", _hoisted_1$D, [
        _hoisted_2$z,
        _hoisted_3$p,
        _hoisted_4$f,
        createBaseVNode("form", {
          onSubmit: withModifiers(save, ["prevent"]),
          class: "needs-validation",
          novalidate: "",
          disabled: unref(config).use_wifi_direct
        }, [
          createBaseVNode("div", _hoisted_6$a, [
            createBaseVNode("div", _hoisted_7$a, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).influxdb2_target,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => unref(config).influxdb2_target = $event),
                type: "url",
                maxlength: "120",
                label: "Server",
                help: "URL to push target, use format http://servername.com/resource (Supports http and https)",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_8$b, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).influxdb2_org,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => unref(config).influxdb2_org = $event),
                maxlength: "50",
                label: "Organisation",
                help: "Identifier to what organisation to use",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_9$9, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).influxdb2_bucket,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => unref(config).influxdb2_bucket = $event),
                maxlength: "50",
                label: "Bucket",
                help: "Identifier for the data bucket to use",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_10$9, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).influxdb2_token,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => unref(config).influxdb2_token = $event),
                type: "password",
                maxlength: "100",
                label: "Authentication token",
                help: "Authentication token for accessing data bucket",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_11$7, [
              createVNode(_component_BsInputNumber, {
                modelValue: unref(config).influxdb2_int,
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => unref(config).influxdb2_int = $event),
                label: "Skip interval",
                min: "0",
                max: "5",
                width: "4",
                help: "Defines how many sleep cycles to skip between pushing data to this target, 1 = every second cycle. Default is 0.",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_12$7, [
              createVNode(_component_BsInputTextAreaFormat, {
                modelValue: unref(config).influxdb2_format,
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => unref(config).influxdb2_format = $event),
                rows: "6",
                label: "Data format",
                help: "Format template used to create the data sent to the remote service",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_13$7, [
              createVNode(_component_BsDropdown, {
                label: "Predefined formats",
                button: "Formats",
                options: unref(influxdb2FormatOptions),
                callback: influxdb2FormatCallback,
                disabled: pushDisabled.value
              }, null, 8, ["options", "disabled"]),
              createVNode(_component_BsModal, {
                onClick: renderFormat,
                modelValue: render.value,
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => render.value = $event),
                code: true,
                title: "Format preview",
                button: "Preview format",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ])
          ]),
          createBaseVNode("div", _hoisted_14$7, [
            _hoisted_15$7,
            createBaseVNode("div", _hoisted_16$7, [
              createBaseVNode("button", {
                type: "submit",
                class: "btn btn-primary w-2",
                disabled: unref(global$1).disabled || !unref(global$1).configChanged
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_18$5),
                createTextVNode("  Save ")
              ], 8, _hoisted_17$5)
            ]),
            createBaseVNode("div", _hoisted_19$4, [
              createBaseVNode("button", {
                onClick: runTest,
                type: "button",
                class: "btn btn-secondary",
                disabled: pushDisabled.value
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_21$4),
                createTextVNode("  Run push test ")
              ], 8, _hoisted_20$4)
            ])
          ])
        ], 40, _hoisted_5$a)
      ]);
    };
  }
};
const _hoisted_1$C = { class: "container" };
const _hoisted_2$y = /* @__PURE__ */ createBaseVNode("p", null, null, -1);
const _hoisted_3$o = /* @__PURE__ */ createBaseVNode("p", { class: "h3" }, "Push - MQTT", -1);
const _hoisted_4$e = /* @__PURE__ */ createBaseVNode("hr", null, null, -1);
const _hoisted_5$9 = ["disabled"];
const _hoisted_6$9 = { class: "row" };
const _hoisted_7$9 = { class: "col-md-9" };
const _hoisted_8$a = { class: "col-md-3" };
const _hoisted_9$8 = { class: "col-md-6" };
const _hoisted_10$8 = { class: "col-md-6" };
const _hoisted_11$6 = { class: "col-md-6" };
const _hoisted_12$6 = { class: "col-md-9" };
const _hoisted_13$6 = { class: "col-md-3" };
const _hoisted_14$6 = { class: "row gy-2" };
const _hoisted_15$6 = /* @__PURE__ */ createBaseVNode("div", { class: "col-md-12" }, [
  /* @__PURE__ */ createBaseVNode("hr")
], -1);
const _hoisted_16$6 = { class: "col-md-3" };
const _hoisted_17$4 = ["disabled"];
const _hoisted_18$4 = ["hidden"];
const _hoisted_19$3 = { class: "col-md-3" };
const _hoisted_20$3 = ["disabled"];
const _hoisted_21$3 = ["hidden"];
const _sfc_main$C = {
  __name: "PushMqttView",
  setup(__props2) {
    const render = ref("");
    const pushDisabled = computed(() => {
      return global$1.disabled || config.use_wifi_direct;
    });
    const runTest = () => {
      const data = {
        push_format: "mqtt_format"
      };
      global$1.clearMessages();
      config.runPushTest(data, () => {
      });
    };
    const mqttFormatCallback = (opt) => {
      config.mqtt_format = decodeURIComponent(opt);
      config.mqtt_format = config.mqtt_format.replaceAll("|", "|\n");
    };
    const renderFormat = () => {
      render.value = applyTemplate(status, config, config.mqtt_format);
    };
    const save = () => {
      if (!validateCurrentForm()) return;
      config.saveAll();
    };
    return (_ctx, _cache) => {
      const _component_BsInputText = resolveComponent("BsInputText");
      const _component_BsInputNumber = resolveComponent("BsInputNumber");
      const _component_BsInputTextAreaFormat = resolveComponent("BsInputTextAreaFormat");
      const _component_BsDropdown = resolveComponent("BsDropdown");
      const _component_BsModal = resolveComponent("BsModal");
      return openBlock(), createElementBlock("div", _hoisted_1$C, [
        _hoisted_2$y,
        _hoisted_3$o,
        _hoisted_4$e,
        createBaseVNode("form", {
          onSubmit: withModifiers(save, ["prevent"]),
          class: "needs-validation",
          novalidate: "",
          disabled: unref(config).use_wifi_direct
        }, [
          createBaseVNode("div", _hoisted_6$9, [
            createBaseVNode("div", _hoisted_7$9, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).mqtt_target,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => unref(config).mqtt_target = $event),
                maxlength: "120",
                label: "Server",
                help: "Name of server to connect to, use format servername.com",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_8$a, [
              createVNode(_component_BsInputNumber, {
                modelValue: unref(config).mqtt_port,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => unref(config).mqtt_port = $event),
                label: "Port",
                min: "0",
                max: "65535",
                help: "Port number, 1883 is standard. Ports above 8000 means SSL",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_9$8, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).mqtt_user,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => unref(config).mqtt_user = $event),
                maxlength: "20",
                label: "User name",
                help: "Username to use. Leave blank if authentication is disabled",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_10$8, [
              createVNode(_component_BsInputText, {
                modelValue: unref(config).mqtt_pass,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => unref(config).mqtt_pass = $event),
                type: "password",
                maxlength: "20",
                label: "Password",
                help: "Password to use. Leave blank if authentication is disabled",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_11$6, [
              createVNode(_component_BsInputNumber, {
                modelValue: unref(config).mqtt_int,
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => unref(config).mqtt_int = $event),
                label: "Skip interval",
                min: "0",
                max: "5",
                width: "4",
                help: "Defines how many sleep cycles to skip between pushing data to this target, 1 = every second cycle. Default is 0.",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_12$6, [
              createVNode(_component_BsInputTextAreaFormat, {
                modelValue: unref(config).mqtt_format,
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => unref(config).mqtt_format = $event),
                rows: "6",
                label: "Data format",
                help: "Format template used to create the data sent to the remote service",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_13$6, [
              createVNode(_component_BsDropdown, {
                label: "Predefined formats",
                button: "Formats",
                options: unref(mqttFormatOptions),
                callback: mqttFormatCallback,
                disabled: pushDisabled.value
              }, null, 8, ["options", "disabled"]),
              createVNode(_component_BsModal, {
                onClick: renderFormat,
                modelValue: render.value,
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => render.value = $event),
                code: true,
                title: "Format preview",
                button: "Preview format",
                disabled: pushDisabled.value
              }, null, 8, ["modelValue", "disabled"])
            ])
          ]),
          createBaseVNode("div", _hoisted_14$6, [
            _hoisted_15$6,
            createBaseVNode("div", _hoisted_16$6, [
              createBaseVNode("button", {
                type: "submit",
                class: "btn btn-primary w-2",
                disabled: unref(global$1).disabled || !unref(global$1).configChanged
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_18$4),
                createTextVNode("  Save ")
              ], 8, _hoisted_17$4)
            ]),
            createBaseVNode("div", _hoisted_19$3, [
              createBaseVNode("button", {
                onClick: runTest,
                type: "button",
                class: "btn btn-secondary",
                disabled: pushDisabled.value
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_21$3),
                createTextVNode("  Run push test ")
              ], 8, _hoisted_20$3)
            ])
          ])
        ], 40, _hoisted_5$9)
      ]);
    };
  }
};
const _hoisted_1$B = { class: "container" };
const _hoisted_2$x = /* @__PURE__ */ createBaseVNode("p", null, null, -1);
const _hoisted_3$n = /* @__PURE__ */ createBaseVNode("p", { class: "h3" }, "Push - Bluetooth", -1);
const _hoisted_4$d = /* @__PURE__ */ createBaseVNode("hr", null, null, -1);
const _hoisted_5$8 = { class: "row" };
const _hoisted_6$8 = { class: "col-md-12" };
const _hoisted_7$8 = { class: "col-md-12" };
const _hoisted_8$9 = /* @__PURE__ */ createBaseVNode("div", { class: "col-md-12" }, [
  /* @__PURE__ */ createBaseVNode("p"),
  /* @__PURE__ */ createBaseVNode("p", null, "Changing bluetooth settings might require a restart to function properly")
], -1);
const _hoisted_9$7 = { class: "row gy-2" };
const _hoisted_10$7 = /* @__PURE__ */ createBaseVNode("div", { class: "col-md-12" }, [
  /* @__PURE__ */ createBaseVNode("hr")
], -1);
const _hoisted_11$5 = { class: "col-md-3" };
const _hoisted_12$5 = ["disabled"];
const _hoisted_13$5 = ["hidden"];
const _hoisted_14$5 = {
  key: 1,
  class: "row"
};
const _hoisted_15$5 = /* @__PURE__ */ createBaseVNode("div", { class: "col-md-12" }, [
  /* @__PURE__ */ createBaseVNode("p", null, "Bluetooth is not available on this platform")
], -1);
const _hoisted_16$5 = [
  _hoisted_15$5
];
const _sfc_main$B = {
  __name: "PushBluetoothView",
  setup(__props2) {
    const bleTiltColorOptions = ref([
      { label: "red", value: "red" },
      { label: "green", value: "green" },
      { label: "black", value: "black" },
      { label: "purple", value: "purple" },
      { label: "orange", value: "orange" },
      { label: "blue", value: "blue" },
      { label: "yellow", value: "yellow" },
      { label: "pink", value: "pink" }
    ]);
    const bleFormatOptions = ref([
      { label: "Disabled", value: 0 },
      { label: "Tilt iBeacon", value: 1 },
      { label: "Tilt PRO iBeacon", value: 2 },
      { label: "Gravitymon iBeacon", value: 5 },
      // { label: 'Gravitymon Service', value: 3 },
      { label: "Gravitymon Eddystone", value: 4 }
    ]);
    const tilt = computed(() => {
      if (global$1.disabled32) return global$1.disabled32;
      if (config.ble_format == 1 || config.ble_format == 2) return false;
      return true;
    });
    const save = () => {
      if ((config.ble_format == 1 || config.ble_format == 2) && config.ble_tilt_color == "") {
        config.ble_tilt_color = "red";
      }
      if (!validateCurrentForm()) return;
      global$1.clearMessages();
      config.saveAll();
    };
    return (_ctx, _cache) => {
      const _component_BsInputRadio = resolveComponent("BsInputRadio");
      return openBlock(), createElementBlock("div", _hoisted_1$B, [
        _hoisted_2$x,
        _hoisted_3$n,
        _hoisted_4$d,
        unref(status).platform !== "esp8266" && unref(status).platform !== "esp32s2" ? (openBlock(), createElementBlock("form", {
          key: 0,
          onSubmit: withModifiers(save, ["prevent"]),
          class: "needs-validation",
          novalidate: ""
        }, [
          createBaseVNode("div", _hoisted_5$8, [
            createBaseVNode("div", _hoisted_6$8, [
              createVNode(_component_BsInputRadio, {
                modelValue: unref(config).ble_tilt_color,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => unref(config).ble_tilt_color = $event),
                options: bleTiltColorOptions.value,
                label: "Tilt color",
                help: "Tilt color beacon. Only used when tilt type is selected.",
                disabled: tilt.value
              }, null, 8, ["modelValue", "options", "disabled"])
            ]),
            createBaseVNode("div", _hoisted_7$8, [
              createVNode(_component_BsInputRadio, {
                modelValue: unref(config).ble_format,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => unref(config).ble_format = $event),
                options: bleFormatOptions.value,
                label: "Bluetooth data format",
                help: "Select the type of bluetooth transmission used.",
                disabled: unref(global$1).disabled32
              }, null, 8, ["modelValue", "options", "disabled"])
            ]),
            _hoisted_8$9
          ]),
          createBaseVNode("div", _hoisted_9$7, [
            _hoisted_10$7,
            createBaseVNode("div", _hoisted_11$5, [
              createBaseVNode("button", {
                type: "submit",
                class: "btn btn-primary w-2",
                disabled: unref(global$1).disabled32 || !unref(global$1).configChanged
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled32
                }, null, 8, _hoisted_13$5),
                createTextVNode("  Save ")
              ], 8, _hoisted_12$5)
            ])
          ])
        ], 32)) : (openBlock(), createElementBlock("div", _hoisted_14$5, _hoisted_16$5))
      ]);
    };
  }
};
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$A = {};
const _hoisted_1$A = { class: "container" };
const _hoisted_2$w = /* @__PURE__ */ createBaseVNode("p", null, null, -1);
const _hoisted_3$m = /* @__PURE__ */ createBaseVNode("p", { class: "h3" }, "About - Gravitymon", -1);
const _hoisted_4$c = /* @__PURE__ */ createBaseVNode("hr", null, null, -1);
const _hoisted_5$7 = /* @__PURE__ */ createBaseVNode("p", { class: "fw-normal" }, " This is a piece of software for the iSpindle hardware and will work in a similar way. No part of this software is copied from the iSpindle project. ", -1);
const _hoisted_6$7 = /* @__PURE__ */ createBaseVNode("p", { class: "h4" }, "MIT License", -1);
const _hoisted_7$7 = /* @__PURE__ */ createBaseVNode("p", { class: "fw-normal" }, ' Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. ', -1);
const _hoisted_8$8 = [
  _hoisted_2$w,
  _hoisted_3$m,
  _hoisted_4$c,
  _hoisted_5$7,
  _hoisted_6$7,
  _hoisted_7$7
];
function _sfc_render$1(_ctx, _cache) {
  return openBlock(), createElementBlock("div", _hoisted_1$A, _hoisted_8$8);
}
const AboutView = /* @__PURE__ */ _export_sfc(_sfc_main$A, [["render", _sfc_render$1]]);
const _hoisted_1$z = { class: "container" };
const _hoisted_2$v = /* @__PURE__ */ createBaseVNode("p", null, null, -1);
const _hoisted_3$l = /* @__PURE__ */ createBaseVNode("p", { class: "h3" }, "Backup & Restore", -1);
const _hoisted_4$b = /* @__PURE__ */ createBaseVNode("hr", null, null, -1);
const _hoisted_5$6 = { class: "row" };
const _hoisted_6$6 = /* @__PURE__ */ createBaseVNode("div", { class: "col-md-12" }, [
  /* @__PURE__ */ createBaseVNode("p", null, "Create a backup of the device configuration and store this in a textfile")
], -1);
const _hoisted_7$6 = { class: "col-md-12" };
const _hoisted_8$7 = ["disabled"];
const _hoisted_9$6 = /* @__PURE__ */ createBaseVNode("div", { class: "col-md-12" }, [
  /* @__PURE__ */ createBaseVNode("hr")
], -1);
const _hoisted_10$6 = /* @__PURE__ */ createBaseVNode("div", { class: "col-md-12" }, [
  /* @__PURE__ */ createBaseVNode("p", null, "Restore a previous backup of the device configuration by uploading it.")
], -1);
const _hoisted_11$4 = { class: "row" };
const _hoisted_12$4 = { class: "col-md-12" };
const _hoisted_13$4 = { class: "col-md-3" };
const _hoisted_14$4 = /* @__PURE__ */ createBaseVNode("p", null, null, -1);
const _hoisted_15$4 = ["disabled"];
const _hoisted_16$4 = ["hidden"];
const _hoisted_17$3 = {
  key: 0,
  class: "col-md-12"
};
const _hoisted_18$3 = /* @__PURE__ */ createBaseVNode("p", null, null, -1);
const _sfc_main$z = {
  __name: "BackupView",
  setup(__props2) {
    const progress = ref(0);
    function backup() {
      var backup2 = {
        meta: { version: "2.0.0", software: "GravityMon" },
        config: JSON.parse(config.toJson())
      };
      backup2.config.http_post_format = encodeURIComponent(backup2.config.http_post_format);
      backup2.config.http_post2_format = encodeURIComponent(backup2.config.http_post2_format);
      backup2.config.http_get_format = encodeURIComponent(backup2.config.http_get_format);
      backup2.config.influxdb2_format = encodeURIComponent(backup2.config.influxdb2_format);
      backup2.config.mqtt_format = encodeURIComponent(backup2.config.mqtt_format);
      var s = JSON.stringify(backup2, null, 2);
      var name = config.mdns + ".txt";
      download(s, "text/plain", name);
      global$1.messageSuccess = "Backup file created and downloaded as: " + name;
    }
    function restore() {
      const fileElement = document.getElementById("upload");
      if (fileElement.files.length === 0) {
        global$1.messageFailed = "You need to select one file to restore configuration from";
      } else {
        global$1.disabled = true;
        logDebug("BackupView.restore()", "Selected file: " + fileElement.files[0].name);
        const reader = new FileReader();
        reader.addEventListener("load", function(e) {
          let text = e.target.result;
          try {
            const data = JSON.parse(text);
            if (data.meta.software === "GravityMon" && data.meta.version === "2.0.0") {
              doRestore2(data.config);
            } else if (data.meta.software === "GravityMon") {
              doRestore1(data);
            } else {
              global$1.messageFailed = "Unknown format, unable to process";
            }
          } catch (error) {
            console.error(error);
            global$1.messageFailed = "Unable to parse configuration file for GravityMon.";
          }
        });
        reader.readAsText(fileElement.files[0]);
      }
    }
    function download(content, mimeType, filename) {
      const a2 = document.createElement("a");
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      a2.setAttribute("href", url);
      a2.setAttribute("download", filename);
      a2.click();
    }
    function doRestore1(json) {
      delete json.advanced["id"];
      for (var k in json.advanced) {
        var newK = k.replaceAll("-", "_");
        if (newK === "int_http1") newK = "http_post_int";
        if (newK === "int_http2") newK = "http_post2_int";
        if (newK === "int_http3") newK = "http_get_int";
        if (newK === "int_influx") newK = "influxdb2_int";
        if (newK === "int_mqtt") newK = "mqtt_int";
        config[newK] = json.advanced[k];
      }
      delete json.config["app-ver"];
      delete json.config["app-build"];
      delete json.config["angle"];
      delete json.config["gravity"];
      delete json.config["battery"];
      delete json.config["runtime-average"];
      delete json.config["platform"];
      delete json.config["id"];
      delete json.config["wifi-ssid"];
      delete json.config["wifi-pass"];
      delete json.config["wifi-ssid2"];
      delete json.config["wifi-pass2"];
      for (k in json.config) {
        newK = k.replaceAll("-", "_");
        if (newK === "ble") newK = "ble_tilt_color";
        if (newK === "http_push") newK = "http_post_target";
        if (newK === "http_push_h1") newK = "http_post_header1";
        if (newK === "http_push_h2") newK = "http_post_header2";
        if (newK === "http_push2") newK = "http_post2_target";
        if (newK === "http_push2_h1") newK = "http_post2_header1";
        if (newK === "http_push2_h2") newK = "http_post2_header2";
        if (newK === "http_push3") newK = "http_get_target";
        if (newK === "influxdb2_push") newK = "influxdb2_target";
        if (newK === "mqtt_push") newK = "mqtt_target";
        if (newK === "formula_calculation_data") {
          config.formula_calculation_data = [
            {
              a: json.config["formula-calculation-data"]["a1"],
              g: json.config["formula-calculation-data"]["g1"]
            },
            {
              a: json.config["formula-calculation-data"]["a2"],
              g: json.config["formula-calculation-data"]["g2"]
            },
            {
              a: json.config["formula-calculation-data"]["a3"],
              g: json.config["formula-calculation-data"]["g3"]
            },
            {
              a: json.config["formula-calculation-data"]["a4"],
              g: json.config["formula-calculation-data"]["g4"]
            },
            {
              a: json.config["formula-calculation-data"]["a5"],
              g: json.config["formula-calculation-data"]["g5"]
            },
            {
              a: json.config["formula-calculation-data"]["a6"],
              g: json.config["formula-calculation-data"]["g6"]
            },
            {
              a: json.config["formula-calculation-data"]["a7"],
              g: json.config["formula-calculation-data"]["g7"]
            },
            {
              a: json.config["formula-calculation-data"]["a8"],
              g: json.config["formula-calculation-data"]["g8"]
            },
            {
              a: json.config["formula-calculation-data"]["a9"],
              g: json.config["formula-calculation-data"]["g9"]
            },
            {
              a: json.config["formula-calculation-data"]["a10"],
              g: json.config["formula-calculation-data"]["g10"]
            }
          ];
        } else {
          config[newK] = json.config[k];
        }
      }
      config.http_post_format = decodeURIComponent(json.format["http-1"]);
      config.http_post2_format = decodeURIComponent(json.format["http-2"]);
      config.http_get_format = decodeURIComponent(json.format["http-3"]);
      config.influxdb2_format = decodeURIComponent(json.format["influxdb"]);
      config.mqtt_format = decodeURIComponent(json.format["mqtt"]);
      getConfigChanges();
      config.saveAll();
    }
    function doRestore2(json) {
      for (var k in json) {
        if (k.endsWith("_format")) {
          config[k] = decodeURIComponent(json[k]);
        } else {
          config[k] = json[k];
        }
      }
      getConfigChanges();
      config.saveAll();
    }
    return (_ctx, _cache) => {
      const _component_BsFileUpload = resolveComponent("BsFileUpload");
      const _component_BsProgress = resolveComponent("BsProgress");
      return openBlock(), createElementBlock("div", _hoisted_1$z, [
        _hoisted_2$v,
        _hoisted_3$l,
        _hoisted_4$b,
        createBaseVNode("div", _hoisted_5$6, [
          _hoisted_6$6,
          createBaseVNode("div", _hoisted_7$6, [
            createBaseVNode("button", {
              onClick: backup,
              type: "button",
              class: "btn btn-primary w-2",
              "data-bs-toggle": "tooltip",
              disabled: unref(global$1).disabled
            }, " Create backup ", 8, _hoisted_8$7)
          ]),
          _hoisted_9$6,
          _hoisted_10$6
        ]),
        createBaseVNode("div", _hoisted_11$4, [
          createBaseVNode("form", {
            onSubmit: withModifiers(restore, ["prevent"])
          }, [
            createBaseVNode("div", _hoisted_12$4, [
              createVNode(_component_BsFileUpload, {
                name: "upload",
                id: "upload",
                label: "Select backup file",
                accept: ".txt",
                disabled: unref(global$1).disabled
              }, null, 8, ["disabled"])
            ]),
            createBaseVNode("div", _hoisted_13$4, [
              _hoisted_14$4,
              createBaseVNode("button", {
                type: "submit",
                class: "btn btn-primary",
                value: "upload",
                "data-bs-toggle": "tooltip",
                title: "Upload the configuration to the device",
                disabled: unref(global$1).disabled
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_16$4),
                createTextVNode("  Restore ")
              ], 8, _hoisted_15$4)
            ]),
            progress.value > 0 ? (openBlock(), createElementBlock("div", _hoisted_17$3, [
              _hoisted_18$3,
              createVNode(_component_BsProgress, { progress: progress.value }, null, 8, ["progress"])
            ])) : createCommentVNode("", true)
          ], 32)
        ])
      ]);
    };
  }
};
const _hoisted_1$y = { class: "container" };
const _hoisted_2$u = /* @__PURE__ */ createBaseVNode("p", null, null, -1);
const _hoisted_3$k = /* @__PURE__ */ createBaseVNode("p", { class: "h3" }, "Firmware Upload", -1);
const _hoisted_4$a = /* @__PURE__ */ createBaseVNode("hr", null, null, -1);
const _hoisted_5$5 = { class: "row" };
const _hoisted_6$5 = { style: {} };
const _hoisted_7$5 = { class: "badge bg-secondary" };
const _hoisted_8$6 = { class: "badge bg-secondary" };
const _hoisted_9$5 = { class: "badge bg-secondary" };
const _hoisted_10$5 = { class: "col-md-12" };
const _hoisted_11$3 = { class: "col-md-3" };
const _hoisted_12$3 = /* @__PURE__ */ createBaseVNode("p", null, null, -1);
const _hoisted_13$3 = ["disabled"];
const _hoisted_14$3 = ["hidden"];
const _hoisted_15$3 = {
  key: 0,
  class: "col-md-12"
};
const _hoisted_16$3 = /* @__PURE__ */ createBaseVNode("p", null, null, -1);
const _sfc_main$y = {
  __name: "FirmwareView",
  setup(__props2) {
    const progress = ref(0);
    function upload() {
      const fileElement = document.getElementById("upload");
      function errorAction(e) {
        logError("FirmwareView.upload()", e.type);
        global$1.messageFailed = "File upload failed!";
        global$1.disabled = false;
      }
      if (fileElement.files.length === 0) {
        global$1.messageFailed = "You need to select one file with firmware to upload";
      } else {
        global$1.disabled = true;
        logDebug("FirmwareView.upload()", "Selected file: " + fileElement.files[0].name);
        const xhr = new XMLHttpRequest();
        xhr.timeout = 1e3 * 180;
        progress.value = 0;
        xhr.onabort = function(e) {
          errorAction(e);
        };
        xhr.onerror = function(e) {
          errorAction(e);
        };
        xhr.ontimeout = function(e) {
          errorAction(e);
        };
        xhr.onloadstart = function() {
        };
        xhr.onloadend = function() {
          progress.value = 100;
          if (xhr.status == 200) {
            global$1.messageSuccess = "File upload completed, waiting for device to restart before doing refresh!";
            global$1.messageFailed = "";
          }
          setTimeout(() => {
            location.href = location.href.replace("/other/firmware", "");
          }, 1e4);
        };
        xhr.upload.addEventListener(
          "progress",
          (e) => {
            progress.value = e.loaded / e.total * 100;
          },
          false
        );
        const fileData = new FormData();
        fileData.onprogress = function(e) {
          logDebug("FirmwareView.upload()", "progress2: " + e.loaded + "," + e.total + "," + xhr.status);
        };
        fileData.append("file", fileElement.files[0]);
        xhr.open("POST", global$1.baseURL + "api/firmware");
        xhr.setRequestHeader("Authorization", global$1.token);
        xhr.send(fileData);
      }
    }
    return (_ctx, _cache) => {
      const _component_BsFileUpload = resolveComponent("BsFileUpload");
      const _component_BsProgress = resolveComponent("BsProgress");
      return openBlock(), createElementBlock("div", _hoisted_1$y, [
        _hoisted_2$u,
        _hoisted_3$k,
        _hoisted_4$a,
        createBaseVNode("div", _hoisted_5$5, [
          createBaseVNode("form", {
            onSubmit: withModifiers(upload, ["prevent"])
          }, [
            createBaseVNode("div", _hoisted_6$5, [
              createBaseVNode("p", null, [
                createTextVNode(" Selet the firmware file that matches your device. Platform: "),
                createBaseVNode("span", _hoisted_7$5, toDisplayString(unref(status).platform), 1),
                createTextVNode(" , Version: "),
                createBaseVNode("span", _hoisted_8$6, toDisplayString(unref(status).app_ver), 1),
                createTextVNode(" (" + toDisplayString(unref(status).app_build) + ") , Hardware: ", 1),
                createBaseVNode("span", _hoisted_9$5, toDisplayString(unref(status).hardware), 1)
              ])
            ]),
            createBaseVNode("div", _hoisted_10$5, [
              createVNode(_component_BsFileUpload, {
                name: "upload",
                id: "upload",
                label: "Select firmware file",
                accept: ".bin",
                help: "Choose the firmware file that will be used to update the device",
                disabled: unref(global$1).disabled
              }, null, 8, ["disabled"])
            ]),
            createBaseVNode("div", _hoisted_11$3, [
              _hoisted_12$3,
              createBaseVNode("button", {
                type: "submit",
                class: "btn btn-primary",
                id: "upload-btn",
                value: "upload",
                "data-bs-toggle": "tooltip",
                title: "Update the device with the selected firmware",
                disabled: unref(global$1).disabled
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_14$3),
                createTextVNode("  Flash firmware ")
              ], 8, _hoisted_13$3)
            ]),
            progress.value > 0 ? (openBlock(), createElementBlock("div", _hoisted_15$3, [
              _hoisted_16$3,
              createVNode(_component_BsProgress, { progress: progress.value }, null, 8, ["progress"])
            ])) : createCommentVNode("", true)
          ], 32)
        ])
      ]);
    };
  }
};
const _hoisted_1$x = { class: "container" };
const _hoisted_2$t = /* @__PURE__ */ createStaticVNode('<p></p><p class="h3">Links and device logs</p><hr><div class="row"><p> If you need support, want to discuss the software or request any new features you can do that on github.com or homebrewtalk.com. </p></div><div class="row"><div class="col-md-4"><a class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" href="https://github.com/mp-se/gravitymon" target="_blank">Report issues on github.com</a></div><div class="col-md-4"><a class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" href="https://www.homebrewtalk.com/" target="_blank">Discuss on homebrewtalk.com</a></div><div class="col-md-4"><a class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" href="https://www.gravitymon.com/" target="_blank">Read docs on gravitymon.com</a></div></div><hr>', 6);
const _hoisted_8$5 = { class: "row" };
const _hoisted_9$4 = { class: "col" };
const _hoisted_10$4 = { class: "badge bg-secondary" };
const _hoisted_11$2 = { class: "badge bg-secondary" };
const _hoisted_12$2 = { class: "badge bg-secondary" };
const _hoisted_13$2 = { class: "badge bg-secondary" };
const _hoisted_14$2 = /* @__PURE__ */ createBaseVNode("hr", null, null, -1);
const _hoisted_15$2 = { class: "row" };
const _hoisted_16$2 = { class: "col-md-3" };
const _hoisted_17$2 = ["disabled"];
const _hoisted_18$2 = ["hidden"];
const _hoisted_19$2 = { class: "col-md-3" };
const _hoisted_20$2 = ["disabled"];
const _hoisted_21$2 = ["hidden"];
const _hoisted_22$2 = { class: "col-md-3" };
const _hoisted_23$2 = ["disabled"];
const _hoisted_24$2 = ["hidden"];
const _hoisted_25$2 = { class: "col-md-3" };
const _hoisted_26$2 = ["disabled"];
const _hoisted_27$1 = ["hidden"];
const _hoisted_28$1 = {
  key: 0,
  class: "col-md-3"
};
const _hoisted_29$1 = ["disabled"];
const _hoisted_30$1 = ["hidden"];
const _hoisted_31$1 = /* @__PURE__ */ createBaseVNode("div", { class: "row" }, [
  /* @__PURE__ */ createBaseVNode("div", { class: "col" }, [
    /* @__PURE__ */ createBaseVNode("p")
  ])
], -1);
const _hoisted_32$1 = { class: "row" };
const _hoisted_33$1 = { class: "col" };
const _hoisted_34$1 = /* @__PURE__ */ createBaseVNode("div", { class: "form-text" }, "Starts with the latest log entry first.", -1);
const _hoisted_35$1 = {
  key: 0,
  class: "row"
};
const _hoisted_36$1 = /* @__PURE__ */ createStaticVNode('<div class="col-md-12"><p></p></div><div class="col-md-12"> Common HTTP error codes: <li> 400 - Bad request. Probably an issue with the post format. Do a preview of the format to identify the issue. </li><li> 401 - Unauthorized. The service needs an token or other means to authenticate the device. </li><li>403 - Forbidden. Could be an issue with token or URL.</li><li>404 - Not found. Probably a wrong URL.</li><br> MQTT connection errors: <li>-1 - Connection refused</li><li>-2 - Send header failed</li><li>-3 - Send payload failed</li><li>-4 - Not connected</li><li>-5 - Connection lost</li><li>-6 - No stream</li><li>-7 - No HTTP server</li><li>-8 - Too little RAM available</li><li>-9 - Error encoding</li><li>-10 - Error writing to stream</li><li>-11 - Read timeout</li><li>-100 - Endpoint skipped since its SSL and the device is in gravity mode</li><br> MQTT push on topic errors: <li>-1 - Buffer to short</li><li>-2 - Overflow</li><li>-3 - Network failed connected</li><li>-4 - Network timeout</li><li>-5 - Network read failed</li><li>-6 - Network write failed</li><li>-10 - Connection denied</li><li>-11 - Failed subscription</li><br> WIFI error codes <li>1 - No SSID found.</li><li>4 - Connection failed.</li><li>5 - Connection lost.</li><li>6 - Wrong password.</li><li>7 - Disconnected by AP.</li></div>', 2);
const _hoisted_38$1 = [
  _hoisted_36$1
];
const _sfc_main$x = {
  __name: "SupportView",
  setup(__props2) {
    const logData = ref("");
    const showHelp = ref(false);
    function fetchLog(file, callback) {
      var data = {
        command: "get",
        file
      };
      config.sendFilesystemRequest(data, (success, text) => {
        if (success) {
          var list = text.split("\n");
          list.forEach(function(item) {
            if (item.length) logData.value = item + "\n" + logData.value;
          });
          callback(true);
        } else {
          callback(false);
        }
      });
    }
    function removeLog(file, callback) {
      var data = {
        command: "del",
        file
      };
      config.sendFilesystemRequest(data, (success) => {
        callback(success);
      });
    }
    function viewLogs() {
      global$1.clearMessages();
      global$1.disabled = true;
      logData.value = "";
      fetchLog("/error2.log", () => {
        fetchLog("/error.log", () => {
          global$1.disabled = false;
        });
      });
    }
    function removeLogs() {
      global$1.clearMessages();
      global$1.disabled = true;
      logData.value = "";
      removeLog("/error2.log", () => {
        removeLog("/error.log", () => {
          global$1.messageSuccess = "Requested logs to be deleted";
          global$1.disabled = false;
        });
      });
    }
    function removeLegacy() {
      global$1.clearMessages();
      global$1.disabled = true;
      logData.value = "";
      removeLog("/config.json", () => {
        removeLog("/gravitymon.json", () => {
          global$1.messageSuccess = "Requested old configuration files to be deleted";
          global$1.disabled = false;
        });
      });
    }
    function hardwareScan() {
      global$1.clearMessages();
      global$1.disabled = true;
      logData.value = "";
      config.runHardwareScan((success, data) => {
        if (success) {
          logData.value = data;
        }
      });
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$x, [
        _hoisted_2$t,
        createBaseVNode("div", _hoisted_8$5, [
          createBaseVNode("div", _hoisted_9$4, [
            createBaseVNode("p", null, [
              createTextVNode(" Platform: "),
              createBaseVNode("span", _hoisted_10$4, toDisplayString(unref(status).platform), 1),
              createTextVNode(" Firmware: "),
              createBaseVNode("span", _hoisted_11$2, toDisplayString(unref(status).app_ver) + " (" + toDisplayString(unref(status).app_build) + ")", 1),
              createTextVNode(" Hardware: "),
              createBaseVNode("span", _hoisted_12$2, toDisplayString(unref(status).hardware), 1),
              createTextVNode(" User interface: "),
              createBaseVNode("span", _hoisted_13$2, toDisplayString(unref(global$1).uiVersion) + " (" + toDisplayString(unref(global$1).uiBuild) + ")", 1)
            ])
          ])
        ]),
        _hoisted_14$2,
        createBaseVNode("div", _hoisted_15$2, [
          createBaseVNode("div", _hoisted_16$2, [
            createBaseVNode("button", {
              onClick: viewLogs,
              type: "button",
              class: "btn btn-primary",
              disabled: unref(global$1).disabled
            }, [
              createBaseVNode("span", {
                class: "spinner-border spinner-border-sm",
                role: "status",
                "aria-hidden": "true",
                hidden: !unref(global$1).disabled
              }, null, 8, _hoisted_18$2),
              createTextVNode("  View device logs ")
            ], 8, _hoisted_17$2)
          ]),
          createBaseVNode("div", _hoisted_19$2, [
            createBaseVNode("button", {
              onClick: removeLogs,
              type: "button",
              class: "btn btn-secondary",
              disabled: unref(global$1).disabled
            }, [
              createBaseVNode("span", {
                class: "spinner-border spinner-border-sm",
                role: "status",
                "aria-hidden": "true",
                hidden: !unref(global$1).disabled
              }, null, 8, _hoisted_21$2),
              createTextVNode("  Erase device logs ")
            ], 8, _hoisted_20$2)
          ]),
          createBaseVNode("div", _hoisted_22$2, [
            createBaseVNode("button", {
              onClick: hardwareScan,
              type: "button",
              class: "btn btn-secondary",
              disabled: unref(global$1).disabled
            }, [
              createBaseVNode("span", {
                class: "spinner-border spinner-border-sm",
                role: "status",
                "aria-hidden": "true",
                hidden: !unref(global$1).disabled
              }, null, 8, _hoisted_24$2),
              createTextVNode("  Hardware scan ")
            ], 8, _hoisted_23$2)
          ]),
          createBaseVNode("div", _hoisted_25$2, [
            createBaseVNode("button", {
              onClick: _cache[0] || (_cache[0] = ($event) => showHelp.value = !showHelp.value),
              type: "button",
              class: "btn btn-secondary",
              disabled: unref(global$1).disabled
            }, [
              createBaseVNode("span", {
                class: "spinner-border spinner-border-sm",
                role: "status",
                "aria-hidden": "true",
                hidden: !unref(global$1).disabled
              }, null, 8, _hoisted_27$1),
              createTextVNode("  Toggle error help ")
            ], 8, _hoisted_26$2)
          ]),
          unref(status).ispindel_config ? (openBlock(), createElementBlock("div", _hoisted_28$1, [
            createBaseVNode("button", {
              onClick: removeLegacy,
              type: "button",
              class: "btn btn-secondary",
              disabled: unref(global$1).disabled
            }, [
              createBaseVNode("span", {
                class: "spinner-border spinner-border-sm",
                role: "status",
                "aria-hidden": "true",
                hidden: !unref(global$1).disabled
              }, null, 8, _hoisted_30$1),
              createTextVNode("  Erase iSpindel config ")
            ], 8, _hoisted_29$1)
          ])) : createCommentVNode("", true)
        ]),
        _hoisted_31$1,
        createBaseVNode("div", _hoisted_32$1, [
          createBaseVNode("div", _hoisted_33$1, [
            createBaseVNode("pre", null, toDisplayString(logData.value), 1)
          ]),
          _hoisted_34$1
        ]),
        showHelp.value ? (openBlock(), createElementBlock("div", _hoisted_35$1, _hoisted_38$1)) : createCommentVNode("", true)
      ]);
    };
  }
};
const _hoisted_1$w = { class: "container" };
const _hoisted_2$s = /* @__PURE__ */ createBaseVNode("p", null, null, -1);
const _hoisted_3$j = { class: "h3" };
const _hoisted_4$9 = /* @__PURE__ */ createBaseVNode("hr", null, null, -1);
const _hoisted_5$4 = { class: "row gy-2" };
const _hoisted_6$4 = /* @__PURE__ */ createBaseVNode("div", { class: "col-md-12" }, [
  /* @__PURE__ */ createBaseVNode("hr")
], -1);
const _hoisted_7$4 = { class: "col-md-3" };
const _hoisted_8$4 = ["disabled"];
const _hoisted_9$3 = { class: "col-md-3" };
const _hoisted_10$3 = ["disabled"];
const maxLines = 50;
const _sfc_main$w = {
  __name: "SerialView",
  setup(__props2) {
    const socket = ref(null);
    const serial = ref("");
    function clear2() {
      serial.value = "";
    }
    onUnmounted(() => {
      if (socket.value) socket.value.close();
      socket.value = null;
    });
    const isConnected = computed(() => {
      return socket.value === null ? false : true;
    });
    const connected = computed(() => {
      return socket.value === null ? "Not connected" : "Connected";
    });
    function connect() {
      serial.value = "Attempting to connect to websocket\n";
      var host = global$1.baseURL.replaceAll("http://", "ws://");
      socket.value = new WebSocket(host + "serialws");
      socket.value.onopen = function() {
        serial.value += "Websocket established\n";
      };
      socket.value.onmessage = function(event) {
        var list = serial.value.split("\n");
        while (list.length > maxLines) {
          list.shift();
        }
        serial.value = list.join("\n");
        serial.value += event.data;
      };
      socket.value.onclose = function() {
        serial.value += "Socket closed\n";
        socket.value = null;
      };
    }
    onMounted(() => {
      connect();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$w, [
        _hoisted_2$s,
        createBaseVNode("p", _hoisted_3$j, "Serial console (" + toDisplayString(connected.value) + ")", 1),
        _hoisted_4$9,
        createBaseVNode("pre", null, toDisplayString(serial.value), 1),
        createBaseVNode("div", _hoisted_5$4, [
          _hoisted_6$4,
          createBaseVNode("div", _hoisted_7$4, [
            createBaseVNode("button", {
              onClick: clear2,
              type: "button",
              class: "btn btn-primary w-2",
              disabled: !isConnected.value
            }, " Clear ", 8, _hoisted_8$4)
          ]),
          createBaseVNode("div", _hoisted_9$3, [
            createBaseVNode("button", {
              onClick: connect,
              type: "button",
              class: "btn btn-secondary w-2",
              disabled: isConnected.value
            }, " Connect ", 8, _hoisted_10$3)
          ])
        ])
      ]);
    };
  }
};
const _hoisted_1$v = { class: "container" };
const _hoisted_2$r = /* @__PURE__ */ createBaseVNode("p", null, null, -1);
const _hoisted_3$i = /* @__PURE__ */ createBaseVNode("p", { class: "h3" }, "Tools", -1);
const _hoisted_4$8 = /* @__PURE__ */ createBaseVNode("hr", null, null, -1);
const _hoisted_5$3 = /* @__PURE__ */ createBaseVNode("h5", null, "Calculate a new voltage factor", -1);
const _hoisted_6$3 = { class: "row" };
const _hoisted_7$3 = { class: "col-md-4" };
const _hoisted_8$3 = { class: "col-md-4" };
const _hoisted_9$2 = { class: "col-md-4" };
const _hoisted_10$2 = { class: "row gy-4" };
const _hoisted_11$1 = /* @__PURE__ */ createBaseVNode("div", { class: "col-md-12" }, null, -1);
const _hoisted_12$1 = { class: "col-md-3" };
const _hoisted_13$1 = ["disabled"];
const _hoisted_14$1 = ["hidden"];
const _hoisted_15$1 = /* @__PURE__ */ createBaseVNode("div", { class: "row gy-4" }, [
  /* @__PURE__ */ createBaseVNode("p"),
  /* @__PURE__ */ createBaseVNode("hr")
], -1);
const _hoisted_16$1 = /* @__PURE__ */ createBaseVNode("h5", null, "Explore the file system", -1);
const _hoisted_17$1 = { class: "row gy-4" };
const _hoisted_18$1 = { class: "col-md-3" };
const _hoisted_19$1 = ["disabled"];
const _hoisted_20$1 = ["hidden"];
const _hoisted_21$1 = ["disabled"];
const _hoisted_22$1 = ["hidden"];
const _hoisted_23$1 = { class: "col-md-6" };
const _hoisted_24$1 = { class: "button-group" };
const _hoisted_25$1 = ["onClick", "disabled"];
const _hoisted_26$1 = {
  key: 0,
  class: "col-md-12"
};
const _hoisted_27 = /* @__PURE__ */ createBaseVNode("h6", null, "File system usage", -1);
const _hoisted_28 = {
  key: 1,
  class: "col-md-12"
};
const _hoisted_29 = /* @__PURE__ */ createBaseVNode("h6", null, "File contents", -1);
const _hoisted_30 = { class: "border p-2" };
const _hoisted_31 = {
  key: 2,
  class: "row gy-4"
};
const _hoisted_32 = /* @__PURE__ */ createBaseVNode("p", null, null, -1);
const _hoisted_33 = /* @__PURE__ */ createBaseVNode("hr", null, null, -1);
const _hoisted_34 = [
  _hoisted_32,
  _hoisted_33
];
const _hoisted_35 = { key: 3 };
const _hoisted_36 = {
  key: 4,
  class: "row gy-4"
};
const _hoisted_37 = { class: "col-md-12" };
const _hoisted_38 = { class: "col-md-3" };
const _hoisted_39 = /* @__PURE__ */ createBaseVNode("p", null, null, -1);
const _hoisted_40 = ["disabled"];
const _hoisted_41 = ["hidden"];
const _hoisted_42 = {
  key: 0,
  class: "col-md-12"
};
const _hoisted_43 = /* @__PURE__ */ createBaseVNode("p", null, null, -1);
const _hoisted_44 = {
  key: 5,
  class: "row gy-4"
};
const _hoisted_45 = /* @__PURE__ */ createBaseVNode("p", null, null, -1);
const _hoisted_46 = /* @__PURE__ */ createBaseVNode("hr", null, null, -1);
const _hoisted_47 = [
  _hoisted_45,
  _hoisted_46
];
const _hoisted_48 = { key: 6 };
const _hoisted_49 = {
  key: 7,
  class: "row gy-4"
};
const _hoisted_50 = { class: "col-md-3" };
const _hoisted_51 = ["disabled"];
const _hoisted_52 = ["hidden"];
const _hoisted_53 = { class: "col-md-6" };
const _hoisted_54 = { class: "button-group" };
const _hoisted_55 = ["onClick", "disabled"];
const _sfc_main$v = {
  __name: "ToolsView",
  setup(__props2) {
    const measuredVoltage = ref(0);
    const filesystemUsage = ref(null);
    const filesystemUsageText = ref(null);
    const filesView = ref([]);
    const fileData = ref(null);
    const filesDelete = ref([]);
    const confirmDeleteMessage = ref(null);
    const confirmDeleteFile = ref(null);
    const hideAdvanced = ref(true);
    function toggleAdvanced() {
      hideAdvanced.value = !hideAdvanced.value;
    }
    const confirmDeleteCallback = (result) => {
      if (result) {
        global$1.disabled = true;
        global$1.clearMessages();
        fileData.value = null;
        var data = {
          command: "del",
          file: confirmDeleteFile.value
        };
        config.sendFilesystemRequest(data, (success, text) => {
          filesView.value = [];
          filesDelete.value = [];
          filesystemUsage.value = null;
          global$1.disabled = false;
        });
      }
    };
    const calculateFactor = () => {
      global$1.disabled = true;
      global$1.clearMessages();
      var mv = parseFloat(measuredVoltage.value);
      if (isNaN(mv)) {
        global$1.messageError = "Not a valid measurement";
        return;
      }
      config.voltage_factor = parseFloat(mv / (status.battery / config.voltage_factor)).toFixed(2);
      config.sendConfig((success) => {
        saveConfigState();
        global$1.disabled = true;
        setTimeout(() => {
          status.load((success2) => {
            logDebug("ToolsView.calculateFactor()", success2, status.battery);
            global$1.messageInfo = "New factor applied, check if the current battery reading is correct";
            global$1.disabled = false;
          }, 1e3);
        });
      });
    };
    const viewFile = (f) => {
      global$1.disabled = true;
      global$1.clearMessages();
      fileData.value = null;
      var data = {
        command: "get",
        file: f
      };
      config.sendFilesystemRequest(data, (success, text) => {
        if (success) {
          if (isValidJson(text)) fileData.value = JSON.stringify(JSON.parse(text), null, 2);
          else if (isValidFormData(text)) fileData.value = text.replaceAll("&", "&\n\r");
          else if (isValidMqttData(text)) fileData.value = text.replaceAll("|", "|\n\r");
          else fileData.value = text;
        }
        global$1.disabled = false;
      });
    };
    const deleteFile = (f) => {
      confirmDeleteMessage.value = "Do you really want to delete file " + f;
      confirmDeleteFile.value = f;
      document.getElementById("deleteFile").click();
    };
    const listFilesView = () => {
      global$1.disabled = true;
      global$1.clearMessages();
      filesView.value = [];
      var data = {
        command: "dir"
      };
      config.sendFilesystemRequest(data, (success, text) => {
        if (success) {
          var json = JSON.parse(text);
          filesystemUsage.value = json.used / json.total * 100;
          filesystemUsageText.value = "Total space " + json.total / 1024 + "kb, Free space " + json.free / 1024 + "kb, Used space " + json.used / 1024 + "kb";
          for (var f in json.files) {
            filesView.value.push(json.files[f].file);
          }
        }
        global$1.disabled = false;
      });
    };
    const listFilesDelete = () => {
      global$1.disabled = true;
      global$1.clearMessages();
      filesDelete.value = [];
      var data = {
        command: "dir"
      };
      config.sendFilesystemRequest(data, (success, text) => {
        if (success) {
          var json = JSON.parse(text);
          for (var f in json.files) {
            filesDelete.value.push(json.files[f].file);
          }
        }
        global$1.disabled = false;
      });
    };
    const progress = ref(0);
    function upload() {
      const fileElement = document.getElementById("upload");
      function errorAction(e) {
        logError("ToolsView.upload()", e.type);
        global$1.messageFailed = "File upload failed!";
        global$1.disabled = false;
      }
      if (fileElement.files.length === 0) {
        global$1.messageFailed = "You need to select one file with firmware to upload";
      } else {
        global$1.disabled = true;
        logDebug("ToolsView.upload()", "Selected file: " + fileElement.files[0].name);
        const xhr = new XMLHttpRequest();
        xhr.timeout = 4e4;
        progress.value = 0;
        xhr.onabort = function(e) {
          errorAction(e);
        };
        xhr.onerror = function(e) {
          errorAction(e);
        };
        xhr.ontimeout = function(e) {
          errorAction(e);
        };
        xhr.onloadstart = function() {
        };
        xhr.onloadend = function() {
          progress.value = 100;
          if (xhr.status == 200) {
            global$1.messageSuccess = "File upload completed!";
            global$1.messageFailed = "";
          }
          global$1.disabled = false;
          filesView.value = [];
          filesDelete.value = [];
          filesystemUsage.value = null;
        };
        xhr.upload.addEventListener(
          "progress",
          (e) => {
            progress.value = e.loaded / e.total * 100;
          },
          false
        );
        const fileData2 = new FormData();
        fileData2.onprogress = function(e) {
          logDebug("ToolsView.upload()", "progress2: " + e.loaded + "," + e.total + "," + xhr.status);
        };
        fileData2.append("file", fileElement.files[0]);
        xhr.open("POST", global$1.baseURL + "api/filesystem/upload");
        xhr.setRequestHeader("Authorization", global$1.token);
        xhr.send(fileData2);
      }
    }
    return (_ctx, _cache) => {
      const _component_BsInputNumber = resolveComponent("BsInputNumber");
      const _component_BsInputReadonly = resolveComponent("BsInputReadonly");
      const _component_BsProgress = resolveComponent("BsProgress");
      const _component_BsFileUpload = resolveComponent("BsFileUpload");
      const _component_BsModalConfirm = resolveComponent("BsModalConfirm");
      return openBlock(), createElementBlock("div", _hoisted_1$v, [
        _hoisted_2$r,
        _hoisted_3$i,
        _hoisted_4$8,
        _hoisted_5$3,
        createBaseVNode("div", _hoisted_6$3, [
          createBaseVNode("div", _hoisted_7$3, [
            createVNode(_component_BsInputNumber, {
              modelValue: measuredVoltage.value,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => measuredVoltage.value = $event),
              label: "Measured voltage",
              min: "0",
              max: "6",
              step: ".01",
              width: "4",
              unit: "V",
              help: "Enter the measured voltage on the device",
              disabled: unref(global$1).disabled
            }, null, 8, ["modelValue", "disabled"])
          ]),
          createBaseVNode("div", _hoisted_8$3, [
            createVNode(_component_BsInputReadonly, {
              modelValue: unref(status).battery,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => unref(status).battery = $event),
              unit: "V",
              label: "Last voltage reading",
              width: "4",
              help: "Last measured battery voltage",
              disabled: unref(global$1).disabled
            }, null, 8, ["modelValue", "disabled"])
          ]),
          createBaseVNode("div", _hoisted_9$2, [
            createVNode(_component_BsInputReadonly, {
              modelValue: unref(config).voltage_factor,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => unref(config).voltage_factor = $event),
              label: "Current voltage factor",
              width: "4",
              help: "Current voltage factor",
              disabled: unref(global$1).disabled
            }, null, 8, ["modelValue", "disabled"])
          ])
        ]),
        createBaseVNode("div", _hoisted_10$2, [
          _hoisted_11$1,
          createBaseVNode("div", _hoisted_12$1, [
            createBaseVNode("button", {
              onClick: calculateFactor,
              type: "button",
              class: "btn btn-secondary",
              disabled: unref(global$1).disabled
            }, [
              createBaseVNode("span", {
                class: "spinner-border spinner-border-sm",
                role: "status",
                "aria-hidden": "true",
                hidden: !unref(global$1).disabled
              }, null, 8, _hoisted_14$1),
              createTextVNode("  Calculate factor ")
            ], 8, _hoisted_13$1)
          ])
        ]),
        _hoisted_15$1,
        _hoisted_16$1,
        createBaseVNode("div", _hoisted_17$1, [
          createBaseVNode("div", _hoisted_18$1, [
            createBaseVNode("button", {
              onClick: listFilesView,
              type: "button",
              class: "btn btn-secondary",
              disabled: unref(global$1).disabled
            }, [
              createBaseVNode("span", {
                class: "spinner-border spinner-border-sm",
                role: "status",
                "aria-hidden": "true",
                hidden: !unref(global$1).disabled
              }, null, 8, _hoisted_20$1),
              createTextVNode("  List files")
            ], 8, _hoisted_19$1),
            createTextVNode("  "),
            createBaseVNode("button", {
              onClick: _cache[3] || (_cache[3] = ($event) => toggleAdvanced()),
              type: "button",
              class: "btn btn-secondary",
              disabled: unref(global$1).disabled
            }, [
              createBaseVNode("span", {
                class: "spinner-border spinner-border-sm",
                role: "status",
                "aria-hidden": "true",
                hidden: !unref(global$1).disabled
              }, null, 8, _hoisted_22$1),
              createTextVNode("  Enable Advanced ")
            ], 8, _hoisted_21$1)
          ]),
          createBaseVNode("div", _hoisted_23$1, [
            createBaseVNode("div", _hoisted_24$1, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(filesView.value, (f, index) => {
                return openBlock(), createElementBlock(Fragment, { key: index }, [
                  createBaseVNode("button", {
                    type: "button",
                    onClick: withModifiers(($event) => viewFile(f), ["prevent"]),
                    class: "btn btn-outline-primary",
                    href: "#",
                    disabled: unref(global$1).disabled
                  }, toDisplayString(f), 9, _hoisted_25$1),
                  createTextVNode("  ")
                ], 64);
              }), 128))
            ])
          ])
        ]),
        filesystemUsage.value > 0 ? (openBlock(), createElementBlock("div", _hoisted_26$1, [
          _hoisted_27,
          createVNode(_component_BsProgress, { progress: filesystemUsage.value }, null, 8, ["progress"]),
          createBaseVNode("p", null, toDisplayString(filesystemUsageText.value), 1)
        ])) : createCommentVNode("", true),
        fileData.value !== null ? (openBlock(), createElementBlock("div", _hoisted_28, [
          _hoisted_29,
          createBaseVNode("pre", _hoisted_30, toDisplayString(fileData.value), 1)
        ])) : createCommentVNode("", true),
        !hideAdvanced.value ? (openBlock(), createElementBlock("div", _hoisted_31, _hoisted_34)) : createCommentVNode("", true),
        !hideAdvanced.value ? (openBlock(), createElementBlock("h5", _hoisted_35, "Upload files to file system")) : createCommentVNode("", true),
        !hideAdvanced.value ? (openBlock(), createElementBlock("div", _hoisted_36, [
          createBaseVNode("form", {
            onSubmit: withModifiers(upload, ["prevent"])
          }, [
            createBaseVNode("div", _hoisted_37, [
              createVNode(_component_BsFileUpload, {
                name: "upload",
                id: "upload",
                label: "Select firmware file",
                accept: "",
                help: "Choose a file to upload to the file system",
                disabled: unref(global$1).disabled
              }, null, 8, ["disabled"])
            ]),
            createBaseVNode("div", _hoisted_38, [
              _hoisted_39,
              createBaseVNode("button", {
                type: "submit",
                class: "btn btn-secondary",
                id: "upload-btn",
                value: "upload",
                "data-bs-toggle": "tooltip",
                title: "Update the device with the selected firmware",
                disabled: unref(global$1).disabled
              }, [
                createBaseVNode("span", {
                  class: "spinner-border spinner-border-sm",
                  role: "status",
                  "aria-hidden": "true",
                  hidden: !unref(global$1).disabled
                }, null, 8, _hoisted_41),
                createTextVNode("  Upload file ")
              ], 8, _hoisted_40)
            ]),
            progress.value > 0 ? (openBlock(), createElementBlock("div", _hoisted_42, [
              _hoisted_43,
              createVNode(_component_BsProgress, { progress: progress.value }, null, 8, ["progress"])
            ])) : createCommentVNode("", true)
          ], 32)
        ])) : createCommentVNode("", true),
        !hideAdvanced.value ? (openBlock(), createElementBlock("div", _hoisted_44, _hoisted_47)) : createCommentVNode("", true),
        !hideAdvanced.value ? (openBlock(), createElementBlock("h5", _hoisted_48, "Delete files from file system")) : createCommentVNode("", true),
        !hideAdvanced.value ? (openBlock(), createElementBlock("div", _hoisted_49, [
          createBaseVNode("div", _hoisted_50, [
            createBaseVNode("button", {
              onClick: listFilesDelete,
              type: "button",
              class: "btn btn-secondary",
              disabled: unref(global$1).disabled
            }, [
              createBaseVNode("span", {
                class: "spinner-border spinner-border-sm",
                role: "status",
                "aria-hidden": "true",
                hidden: !unref(global$1).disabled
              }, null, 8, _hoisted_52),
              createTextVNode("  List files ")
            ], 8, _hoisted_51)
          ]),
          createBaseVNode("div", _hoisted_53, [
            createBaseVNode("div", _hoisted_54, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(filesDelete.value, (f, index) => {
                return openBlock(), createElementBlock(Fragment, { key: index }, [
                  createBaseVNode("button", {
                    type: "button",
                    onClick: withModifiers(($event) => deleteFile(f), ["prevent"]),
                    class: "btn btn-outline-primary",
                    href: "#",
                    disabled: unref(global$1).disabled
                  }, toDisplayString(f), 9, _hoisted_55),
                  createTextVNode("  ")
                ], 64);
              }), 128))
            ])
          ]),
          createVNode(_component_BsModalConfirm, {
            callback: confirmDeleteCallback,
            message: confirmDeleteMessage.value,
            id: "deleteFile",
            title: "Delete file",
            disabled: unref(global$1).disabled
          }, null, 8, ["message", "disabled"])
        ])) : createCommentVNode("", true)
      ]);
    };
  }
};
const _sfc_main$u = {};
const _hoisted_1$u = { class: "fw-bold" };
function _sfc_render(_ctx, _cache) {
  const _component_BsMessage = resolveComponent("BsMessage");
  return openBlock(), createBlock(_component_BsMessage, {
    dismissable: false,
    alert: "danger"
  }, {
    default: withCtx(() => [
      createTextVNode(" Page not found! "),
      createBaseVNode("span", _hoisted_1$u, toDisplayString(this.$route.path), 1),
      createTextVNode(" is not a valid URL for this application! ")
    ]),
    _: 1
  });
}
const NotFoundView = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["render", _sfc_render]]);
const routes = [
  {
    path: "/",
    name: "home",
    component: _sfc_main$O
  },
  {
    path: "/device/settings",
    name: "device-settings",
    component: _sfc_main$N
  },
  {
    path: "/device/hardware",
    name: "device-hardware",
    component: _sfc_main$M
  },
  {
    path: "/device/wifi",
    name: "device-wifi",
    component: _sfc_main$L
  },
  {
    path: "/other/backup",
    name: "backup",
    component: _sfc_main$z
  },
  {
    path: "/gravity/settings",
    name: "gravity-settings",
    component: _sfc_main$K
  },
  {
    path: "/gravity/formula",
    name: "gravity-formula",
    component: _sfc_main$J
  },
  {
    path: "/gravity/analysis",
    name: "gravity-analysis",
    component: _sfc_main$I
  },
  {
    path: "/other/firmware",
    name: "firmware",
    component: _sfc_main$y
  },
  {
    path: "/push/settings",
    name: "push-settings",
    component: _sfc_main$H
  },
  {
    path: "/push/http-post1",
    name: "push-http-post1",
    component: _sfc_main$G
  },
  {
    path: "/push/http-post2",
    name: "push-http-post2",
    component: _sfc_main$F
  },
  {
    path: "/push/http-get",
    name: "push-http-get",
    component: _sfc_main$E
  },
  {
    path: "/push/influxdb",
    name: "push-influxdb",
    component: _sfc_main$D
  },
  {
    path: "/push/mqtt",
    name: "push-Mqtt",
    component: _sfc_main$C
  },
  {
    path: "/push/bluetooth",
    name: "push-bluetooth",
    component: _sfc_main$B
  },
  {
    path: "/other/support",
    name: "support",
    component: _sfc_main$x
  },
  {
    path: "/other/tools",
    name: "tools",
    component: _sfc_main$v
  },
  {
    path: "/other/serial",
    name: "serial",
    component: _sfc_main$w
  },
  {
    path: "/other/about",
    name: "about",
    component: AboutView
  },
  {
    path: "/:catchAll(.*)",
    name: "404",
    component: NotFoundView
  }
];
const router = createRouter({
  history: createWebHistory("/"),
  routes
});
router.beforeEach(() => {
  if (global$1.disabled) return false;
  if (!validateCurrentForm()) return false;
  global$1.clearMessages();
  return true;
});
const items = ref([
  {
    label: "Home",
    icon: "IconHome",
    path: "/",
    subs: []
  },
  {
    label: "Device",
    icon: "IconCpu",
    path: "/device",
    badge: deviceBadge,
    subs: [
      {
        label: "Settings",
        badge: deviceSettingBadge,
        path: "/device/settings"
      },
      {
        label: "Hardware",
        badge: deviceHardwareBadge,
        path: "/device/hardware"
      },
      {
        label: "Wifi",
        badge: deviceWifiBadge,
        path: "/device/wifi"
      }
    ]
  },
  {
    label: "Gravity",
    icon: "IconGraphUpArrow",
    path: "/gravity",
    badge: gravityBadge,
    subs: [
      {
        label: "Settings",
        badge: gravitySettingBadge,
        path: "/gravity/settings"
      },
      {
        label: "Formula",
        badge: gravityFormulaBadge,
        path: "/gravity/formula"
      },
      {
        label: "Analysis",
        path: "/gravity/analysis"
      }
    ]
  },
  {
    label: "Push targets",
    icon: "IconCloudUpArrow",
    path: "/push",
    badge: pushBadge,
    subs: [
      {
        label: "Settings",
        badge: pushSettingBadge,
        path: "/push/settings"
      },
      {
        label: "HTTP Post 1",
        badge: pushHttpPost1Badge,
        path: "/push/http-post1"
      },
      {
        label: "HTTP Post 2",
        badge: pushHttpPost2Badge,
        path: "/push/http-post2"
      },
      {
        label: "HTTP Get",
        badge: pushHttpGetBadge,
        path: "/push/http-get"
      },
      {
        label: "Influxdb v2",
        badge: pushInfluxdb2Badge,
        path: "/push/influxdb"
      },
      {
        label: "MQTT",
        badge: pushMqttBadge,
        path: "/push/mqtt"
      },
      {
        label: "Bluetooth",
        badge: pushBluetoothBadge,
        path: "/push/bluetooth"
      }
    ]
  },
  {
    label: "Other",
    icon: "IconTools",
    path: "/other",
    subs: [
      {
        label: "Serial console",
        path: "/other/serial"
      },
      {
        label: "Backup & Restore",
        path: "/other/backup"
      },
      {
        label: "Firmware update",
        path: "/other/firmware"
      },
      {
        label: "Support",
        path: "/other/support"
      },
      {
        label: "Tools",
        path: "/other/tools"
      },
      {
        label: "About",
        path: "/other/about"
      }
    ]
  }
]);
const _hoisted_1$t = { class: "navbar navbar-expand-lg navbar-dark bg-primary" };
const _hoisted_2$q = { class: "container-fluid align-center" };
const _hoisted_3$h = /* @__PURE__ */ createBaseVNode("button", {
  class: "navbar-toggler",
  type: "button",
  "data-bs-toggle": "collapse",
  "data-bs-target": "#navbar",
  "aria-controls": "navbarNav",
  "aria-expanded": "false",
  "aria-label": "Toggle navigation"
}, [
  /* @__PURE__ */ createBaseVNode("span", { class: "navbar-toggler-icon" })
], -1);
const _hoisted_4$7 = { class: "navbar-brand" };
const _hoisted_5$2 = /* @__PURE__ */ createBaseVNode("div", { class: "vr d-none d-lg-flex h-200 mx-lg-2 text-white" }, null, -1);
const _hoisted_6$2 = {
  class: "collapse navbar-collapse",
  id: "navbar"
};
const _hoisted_7$2 = { class: "navbar-nav" };
const _hoisted_8$2 = {
  key: 0,
  class: "nav-item"
};
const _hoisted_9$1 = {
  key: 1,
  class: "nav-item dropdown"
};
const _hoisted_10$1 = ["id", "disabled"];
const _hoisted_11 = {
  key: 1,
  class: "badge text-bg-danger rounded-circle"
};
const _hoisted_12 = ["aria-labelledby"];
const _hoisted_13 = {
  key: 0,
  class: "badge text-bg-danger rounded-circle"
};
const _hoisted_14 = /* @__PURE__ */ createBaseVNode("div", { class: "vr d-none d-lg-flex h-200 mx-lg-2 text-white" }, null, -1);
const _hoisted_15 = { class: "text-white" };
const _hoisted_16 = /* @__PURE__ */ createBaseVNode("div", { class: "vr d-none d-lg-flex h-200 mx-lg-2 text-white" }, null, -1);
const _hoisted_17 = { key: 0 };
const _hoisted_18 = /* @__PURE__ */ createBaseVNode("span", { class: "badge bg-danger fs-6" }, "Save needed  ", -1);
const _hoisted_19 = [
  _hoisted_18
];
const _hoisted_20 = {
  key: 1,
  class: "vr d-none d-lg-flex h-200 mx-lg-2 text-white"
};
const _hoisted_21 = { class: "p-2" };
const _hoisted_22 = ["hidden"];
const _hoisted_23 = /* @__PURE__ */ createBaseVNode("span", { class: "visually-hidden" }, "Loading...", -1);
const _hoisted_24 = [
  _hoisted_23
];
const _hoisted_25 = { class: "p-2" };
const _hoisted_26 = { class: "form-check form-switch" };
const _sfc_main$t = {
  __name: "BsMenuBar",
  props: {
    "disabled": {},
    "disabledModifiers": {},
    "brand": {},
    "brandModifiers": {}
  },
  emits: ["update:disabled", "update:brand"],
  setup(__props2) {
    const disabled = useModel(__props2, "disabled");
    const brand = useModel(__props2, "brand");
    const { dark_mode } = storeToRefs(config);
    onMounted(() => {
      setMode();
    });
    watch(dark_mode, () => {
      setMode();
    });
    function setMode() {
      if (config.dark_mode) {
        document.documentElement.setAttribute("data-bs-theme", "dark");
      } else {
        document.documentElement.setAttribute("data-bs-theme", "light");
      }
    }
    const subMenuClicked = () => {
      const dnList = document.getElementsByClassName("dropdown-menu show");
      for (var i = 0; i < dnList.length; i++) {
        dnList[i].classList.remove("show");
      }
    };
    return (_ctx, _cache) => {
      const _component_router_link = resolveComponent("router-link");
      return openBlock(), createElementBlock("nav", _hoisted_1$t, [
        createBaseVNode("div", _hoisted_2$q, [
          _hoisted_3$h,
          createBaseVNode("div", _hoisted_4$7, toDisplayString(brand.value), 1),
          _hoisted_5$2,
          createBaseVNode("div", _hoisted_6$2, [
            createBaseVNode("ul", _hoisted_7$2, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(items), (item, index) => {
                return openBlock(), createElementBlock(Fragment, { key: index }, [
                  !item.subs.length ? (openBlock(), createElementBlock("li", _hoisted_8$2, [
                    createVNode(_component_router_link, {
                      class: normalizeClass([
                        "nav-link",
                        _ctx.$router.currentRoute.value.path.split("/")[1] === item.path.split("/")[1] ? " active fw-bold" : ""
                      ]),
                      to: item.path,
                      disabled: disabled.value
                    }, {
                      default: withCtx(() => [
                        item.icon !== void 0 ? (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                          key: 0,
                          width: "1rem",
                          height: "1rem",
                          style: { "color": "white" }
                        })) : createCommentVNode("", true),
                        createTextVNode(" " + toDisplayString(item.label), 1)
                      ]),
                      _: 2
                    }, 1032, ["class", "to", "disabled"])
                  ])) : (openBlock(), createElementBlock("li", _hoisted_9$1, [
                    createBaseVNode("a", {
                      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.menuClicked && _ctx.menuClicked(...args)),
                      class: normalizeClass([
                        "nav-link",
                        "dropdown-toggle",
                        _ctx.$router.currentRoute.value.path.split("/")[1] === item.path.split("/")[1] ? " active fw-bold" : ""
                      ]),
                      id: "navbarDropdown" + item.label,
                      role: "button",
                      "data-bs-toggle": "dropdown",
                      "aria-expanded": "false",
                      "data-bs-auto-close": "true",
                      disabled: disabled.value
                    }, [
                      item.icon !== void 0 ? (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                        key: 0,
                        width: "1rem",
                        height: "1rem",
                        style: { "color": "white" }
                      })) : createCommentVNode("", true),
                      createTextVNode(" " + toDisplayString(item.label) + " ", 1),
                      item.badge !== void 0 && item.badge() > 0 ? (openBlock(), createElementBlock("span", _hoisted_11, toDisplayString(item.badge()), 1)) : createCommentVNode("", true)
                    ], 10, _hoisted_10$1),
                    createBaseVNode("ul", {
                      class: "dropdown-menu",
                      "aria-labelledby": "navbarDropdown" + item.label
                    }, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(item.subs, (dn) => {
                        return openBlock(), createElementBlock("li", {
                          key: dn.path
                        }, [
                          createVNode(_component_router_link, {
                            onClick: subMenuClicked,
                            class: "dropdown-item",
                            to: dn.path,
                            disabled: disabled.value
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(dn.label) + " ", 1),
                              dn.badge !== void 0 && dn.badge() > 0 ? (openBlock(), createElementBlock("span", _hoisted_13, toDisplayString(dn.badge()), 1)) : createCommentVNode("", true)
                            ]),
                            _: 2
                          }, 1032, ["to", "disabled"])
                        ]);
                      }), 128))
                    ], 8, _hoisted_12)
                  ]))
                ], 64);
              }), 128))
            ])
          ]),
          _hoisted_14,
          createBaseVNode("div", _hoisted_15, toDisplayString(unref(config).mdns), 1),
          _hoisted_16,
          unref(global$1).configChanged ? (openBlock(), createElementBlock("div", _hoisted_17, _hoisted_19)) : createCommentVNode("", true),
          unref(global$1).configChanged ? (openBlock(), createElementBlock("div", _hoisted_20)) : createCommentVNode("", true),
          createBaseVNode("div", _hoisted_21, [
            createBaseVNode("div", {
              class: "spinner-border gx-4",
              role: "status",
              style: { "color": "white" },
              hidden: !disabled.value
            }, _hoisted_24, 8, _hoisted_22)
          ]),
          createBaseVNode("div", _hoisted_25, [
            createBaseVNode("div", _hoisted_26, [
              createTextVNode("  "),
              withDirectives(createBaseVNode("input", {
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => unref(config).dark_mode = $event),
                class: "form-check-input",
                type: "checkbox",
                role: "switch",
                style: { "border-color": "white" }
              }, null, 512), [
                [vModelCheckbox, unref(config).dark_mode]
              ])
            ])
          ])
        ])
      ]);
    };
  }
};
const _hoisted_1$s = { class: "container-fluid" };
const _hoisted_2$p = /* @__PURE__ */ createBaseVNode("div", { style: { "height": "20px" } }, null, -1);
const _hoisted_3$g = {
  class: "text-light text-center rounded-pill bg-primary",
  style: { "height": "30px" }
};
const _sfc_main$s = {
  __name: "BsFooter",
  props: {
    "text": {},
    "textModifiers": {}
  },
  emits: ["update:text"],
  setup(__props2) {
    const text = useModel(__props2, "text");
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$s, [
        _hoisted_2$p,
        createBaseVNode("div", _hoisted_3$g, toDisplayString(text.value), 1)
      ]);
    };
  }
};
const _hoisted_1$r = /* @__PURE__ */ createBaseVNode("dialog", {
  id: "spinner",
  class: "loading"
}, [
  /* @__PURE__ */ createBaseVNode("div", { class: "container text-center" }, [
    /* @__PURE__ */ createBaseVNode("div", {
      class: "row align-items-center",
      style: { "height": "170px" }
    }, [
      /* @__PURE__ */ createBaseVNode("div", { class: "col" }, [
        /* @__PURE__ */ createBaseVNode("div", {
          class: "spinner-border",
          role: "status",
          style: { "width": "5rem", "height": "5rem" }
        }, [
          /* @__PURE__ */ createBaseVNode("span", { class: "visually-hidden" }, "Loading...")
        ])
      ])
    ])
  ])
], -1);
const _hoisted_2$o = {
  key: 0,
  class: "container text-center"
};
const _hoisted_3$f = { class: "container" };
const _hoisted_4$6 = /* @__PURE__ */ createBaseVNode("div", null, [
  /* @__PURE__ */ createBaseVNode("p")
], -1);
const _sfc_main$r = {
  __name: "App",
  setup(__props2) {
    const polling = ref(null);
    const { disabled } = storeToRefs(global$1);
    const close = (alert) => {
      if (alert == "danger") global$1.messageError = "";
      else if (alert == "warning") global$1.messageWarning = "";
      else if (alert == "success") global$1.messageSuccess = "";
      else if (alert == "info") global$1.messageInfo = "";
    };
    watch(disabled, () => {
      if (global$1.disabled) document.body.style.cursor = "wait";
      else document.body.style.cursor = "default";
    });
    function ping() {
      status.ping();
    }
    onBeforeMount(() => {
      polling.value = setInterval(ping, 7e3);
    });
    onBeforeUnmount(() => {
      clearInterval(polling.value);
    });
    onMounted(() => {
      if (!global$1.initialized) {
        showSpinner();
        status.auth((success, data) => {
          if (success) {
            global$1.id = data.token;
            status.load((success2) => {
              global$1.platform = status.platform;
              if (success2) {
                config.load((success3) => {
                  if (success3) {
                    config.loadFormat((success4) => {
                      if (success4) {
                        saveConfigState();
                        global$1.initialized = true;
                      } else {
                        global$1.messageError = "Failed to load format templates from device, please try to reload page!";
                      }
                      hideSpinner();
                    });
                  } else {
                    global$1.messageError = "Failed to load configuration data from device, please try to reload page!";
                    hideSpinner();
                  }
                });
              } else {
                global$1.messageError = "Failed to load status from device, please try to reload page!";
                hideSpinner();
              }
            });
          } else {
            global$1.messageError = "Failed to authenticate with device, please try to reload page!";
            hideSpinner();
          }
        });
      }
    });
    function showSpinner() {
      document.querySelector("#spinner").showModal();
    }
    function hideSpinner() {
      document.querySelector("#spinner").close();
    }
    return (_ctx, _cache) => {
      const _component_BsMessage = resolveComponent("BsMessage");
      const _component_router_link = resolveComponent("router-link");
      const _component_router_view = resolveComponent("router-view");
      return openBlock(), createElementBlock(Fragment, null, [
        _hoisted_1$r,
        !unref(global$1).initialized ? (openBlock(), createElementBlock("div", _hoisted_2$o, [
          createVNode(_component_BsMessage, {
            message: "Initalizing GravityMon Web interface",
            class: "h2",
            dismissable: false,
            alert: "info"
          })
        ])) : createCommentVNode("", true),
        unref(global$1).initialized ? (openBlock(), createBlock(_sfc_main$t, {
          key: 1,
          disabled: unref(global$1).disabled,
          brand: "GravityMon"
        }, null, 8, ["disabled"])) : createCommentVNode("", true),
        createBaseVNode("div", _hoisted_3$f, [
          _hoisted_4$6,
          !unref(status).connected ? (openBlock(), createBlock(_component_BsMessage, {
            key: 0,
            message: "No response from device, has it gone into sleep model? No need to refresh the page, just turn on the device again",
            class: "h2",
            dismissable: false,
            alert: "danger"
          })) : createCommentVNode("", true),
          unref(global$1).isError ? (openBlock(), createBlock(_component_BsMessage, {
            key: 1,
            close,
            dismissable: true,
            message: unref(global$1).messageError,
            alert: "danger"
          }, null, 8, ["message"])) : createCommentVNode("", true),
          unref(global$1).isWarning ? (openBlock(), createBlock(_component_BsMessage, {
            key: 2,
            close,
            dismissable: true,
            message: unref(global$1).messageWarning,
            alert: "warning"
          }, null, 8, ["message"])) : createCommentVNode("", true),
          unref(global$1).isSuccess ? (openBlock(), createBlock(_component_BsMessage, {
            key: 3,
            close,
            dismissable: true,
            message: unref(global$1).messageSuccess,
            alert: "success"
          }, null, 8, ["message"])) : createCommentVNode("", true),
          unref(global$1).isInfo ? (openBlock(), createBlock(_component_BsMessage, {
            key: 4,
            close,
            dismissable: true,
            message: unref(global$1).messageInfo,
            alert: "info"
          }, null, 8, ["message"])) : createCommentVNode("", true),
          unref(status).wifi_setup ? (openBlock(), createBlock(_component_BsMessage, {
            key: 5,
            dismissable: false,
            alert: "info"
          }, {
            default: withCtx(() => [
              createTextVNode(" Running in WIFI setup mode. Go to the "),
              createVNode(_component_router_link, {
                class: "alert-link",
                to: "/device/wifi"
              }, {
                default: withCtx(() => [
                  createTextVNode("wifi settings")
                ]),
                _: 1
              }),
              createTextVNode(" meny and select wifi. Restart device after settings are selected. ")
            ]),
            _: 1
          })) : createCommentVNode("", true),
          unref(status).ispindel_config ? (openBlock(), createBlock(_component_BsMessage, {
            key: 6,
            dismissable: true,
            alert: "info"
          }, {
            default: withCtx(() => [
              createTextVNode(" iSpindel configuration found, "),
              createVNode(_component_router_link, {
                class: "alert-link",
                to: "/device/hardware"
              }, {
                default: withCtx(() => [
                  createTextVNode("import")
                ]),
                _: 1
              }),
              createTextVNode(" formula/gyro or "),
              createVNode(_component_router_link, {
                class: "alert-link",
                to: "/other/links"
              }, {
                default: withCtx(() => [
                  createTextVNode("delete")
                ]),
                _: 1
              }),
              createTextVNode(" the configuration. ")
            ]),
            _: 1
          })) : createCommentVNode("", true)
        ]),
        unref(global$1).initialized ? (openBlock(), createBlock(_component_router_view, { key: 2 })) : createCommentVNode("", true),
        unref(global$1).initialized ? (openBlock(), createBlock(_sfc_main$s, {
          key: 3,
          text: "(c) 2021-2024 Magnus Persson"
        })) : createCommentVNode("", true)
      ], 64);
    };
  }
};
const _hoisted_1$q = /* @__PURE__ */ createBaseVNode("path", { d: "M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" }, null, -1);
const _hoisted_2$n = /* @__PURE__ */ createBaseVNode("path", { d: "M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" }, null, -1);
const _hoisted_3$e = [
  _hoisted_1$q,
  _hoisted_2$n
];
const _sfc_main$q = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "IconXCircle",
  setup(__props2) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", mergeProps(_ctx.$attrs, {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        fill: "currentColor"
      }), _hoisted_3$e, 16);
    };
  }
});
const _hoisted_1$p = /* @__PURE__ */ createBaseVNode("path", { d: "M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" }, null, -1);
const _hoisted_2$m = /* @__PURE__ */ createBaseVNode("path", { d: "m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" }, null, -1);
const _hoisted_3$d = [
  _hoisted_1$p,
  _hoisted_2$m
];
const _sfc_main$p = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "IconCheckCircle",
  setup(__props2) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", mergeProps(_ctx.$attrs, {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        fill: "currentColor"
      }), _hoisted_3$d, 16);
    };
  }
});
const _hoisted_1$o = /* @__PURE__ */ createBaseVNode("path", { d: "M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" }, null, -1);
const _hoisted_2$l = /* @__PURE__ */ createBaseVNode("path", { d: "m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" }, null, -1);
const _hoisted_3$c = [
  _hoisted_1$o,
  _hoisted_2$l
];
const _sfc_main$o = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "IconInfoCircle",
  setup(__props2) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", mergeProps(_ctx.$attrs, {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        fill: "currentColor"
      }), _hoisted_3$c, 16);
    };
  }
});
const _hoisted_1$n = /* @__PURE__ */ createBaseVNode("path", { d: "M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z" }, null, -1);
const _hoisted_2$k = /* @__PURE__ */ createBaseVNode("path", { d: "M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" }, null, -1);
const _hoisted_3$b = [
  _hoisted_1$n,
  _hoisted_2$k
];
const _sfc_main$n = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "IconExclamationTriangle",
  setup(__props2) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", mergeProps(_ctx.$attrs, {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        fill: "currentColor"
      }), _hoisted_3$b, 16);
    };
  }
});
const _hoisted_1$m = {
  key: 5,
  type: "button",
  class: "btn-close",
  "data-bs-dismiss": "alert",
  "aria-label": "Close"
};
const _sfc_main$m = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "BsMessage",
  props: {
    "message": {},
    "messageModifiers": {},
    "dismissable": {},
    "dismissableModifiers": {},
    "alert": {},
    "alertModifiers": {},
    "close": {},
    "closeModifiers": {}
  },
  emits: ["update:message", "update:dismissable", "update:alert", "update:close"],
  setup(__props2) {
    const message = useModel(__props2, "message");
    const dismissable = useModel(__props2, "dismissable");
    const alert = useModel(__props2, "alert");
    const close = useModel(__props2, "close");
    function classNames() {
      const cn = dismissable.value ? "alert alert-" + alert.value + " align-items-center alert-dismissible fade show" : "alert alert-" + alert.value + " align-items-center";
      return cn;
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(classNames()),
        role: "alert"
      }, [
        alert.value === "danger" ? (openBlock(), createBlock(_sfc_main$q, {
          key: 0,
          height: "20",
          width: "20"
        })) : createCommentVNode("", true),
        alert.value === "warning" ? (openBlock(), createBlock(_sfc_main$n, {
          key: 1,
          height: "20",
          width: "20"
        })) : createCommentVNode("", true),
        alert.value === "info" ? (openBlock(), createBlock(_sfc_main$o, {
          key: 2,
          height: "20",
          width: "20"
        })) : createCommentVNode("", true),
        alert.value === "success" ? (openBlock(), createBlock(_sfc_main$p, {
          key: 3,
          height: "20",
          width: "20"
        })) : createCommentVNode("", true),
        createTextVNode("  " + toDisplayString(message.value) + " ", 1),
        renderSlot(_ctx.$slots, "default"),
        dismissable.value && close.value !== void 0 ? (openBlock(), createElementBlock("button", {
          key: 4,
          onClick: _cache[0] || (_cache[0] = ($event) => close.value(alert.value)),
          type: "button",
          class: "btn-close",
          "aria-label": "Close"
        })) : createCommentVNode("", true),
        dismissable.value && close.value === void 0 ? (openBlock(), createElementBlock("button", _hoisted_1$m)) : createCommentVNode("", true)
      ], 2);
    };
  }
});
const _hoisted_1$l = { class: "card" };
const _hoisted_2$j = { class: "card-body" };
const _hoisted_3$a = { class: "card-title" };
const _hoisted_4$5 = { class: "card-text" };
const _sfc_main$l = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "BsCard",
  props: {
    "header": {},
    "headerModifiers": {},
    "title": {},
    "titleModifiers": {},
    "icon": {},
    "iconModifiers": {},
    "iserr": {},
    "iserrModifiers": {},
    "color": {},
    "colorModifiers": {}
  },
  emits: ["update:header", "update:title", "update:icon", "update:iserr", "update:color"],
  setup(__props2) {
    const header = useModel(__props2, "header");
    const title = useModel(__props2, "title");
    const icon = useModel(__props2, "icon");
    const iserr = useModel(__props2, "iserr");
    const headerColor = useModel(__props2, "color");
    function headerStyle() {
      if (iserr.value !== void 0 && iserr.value) return "card-header bg-danger-subtle";
      if (headerColor.value === void 0) return "card-header bg-primary-subtle";
      return "card-header bg-" + headerColor.value + "-subtle";
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$l, [
        createBaseVNode("div", {
          class: normalizeClass(headerStyle())
        }, toDisplayString(header.value), 3),
        createBaseVNode("div", _hoisted_2$j, [
          createBaseVNode("h5", _hoisted_3$a, [
            icon.value !== void 0 ? (openBlock(), createBlock(resolveDynamicComponent(icon.value), {
              key: 0,
              width: "16",
              height: "16"
            })) : createCommentVNode("", true),
            createTextVNode(" " + toDisplayString(title.value), 1)
          ]),
          createBaseVNode("p", _hoisted_4$5, [
            renderSlot(_ctx.$slots, "default")
          ])
        ])
      ]);
    };
  }
});
const _hoisted_1$k = {
  class: "btn-group",
  role: "group"
};
const _hoisted_2$i = ["disabled"];
const _sfc_main$k = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "BsFileUpload",
  props: {
    "label": {},
    "labelModifiers": {},
    "help": {},
    "helpModifiers": {},
    "width": {},
    "widthModifiers": {},
    "disabled": {},
    "disabledModifiers": {},
    "badge": {},
    "badgeModifiers": {}
  },
  emits: ["update:label", "update:help", "update:width", "update:disabled", "update:badge"],
  setup(__props2) {
    const label = useModel(__props2, "label");
    const help = useModel(__props2, "help");
    const width = useModel(__props2, "width");
    const disabled = useModel(__props2, "disabled");
    const badge = useModel(__props2, "badge");
    return (_ctx, _cache) => {
      const _component_BsInputBase = resolveComponent("BsInputBase");
      return openBlock(), createBlock(_component_BsInputBase, {
        width: width.value,
        label: label.value,
        help: help.value,
        badge: badge.value
      }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1$k, [
            createBaseVNode("input", mergeProps({
              class: "form-control",
              type: "file"
            }, _ctx.$attrs, { disabled: disabled.value }), null, 16, _hoisted_2$i)
          ])
        ]),
        _: 1
      }, 8, ["width", "label", "help", "badge"]);
    };
  }
});
const _hoisted_1$j = {
  class: "progress",
  style: { "height": "20px" }
};
const _sfc_main$j = {
  __name: "BsProgress",
  props: {
    "progress": {},
    "progressModifiers": {}
  },
  emits: ["update:progress"],
  setup(__props2) {
    const progress = useModel(__props2, "progress");
    const progressStyle = computed(() => {
      return "width: " + progress.value + "%";
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$j, [
        createBaseVNode("div", {
          class: "progress-bar",
          role: "progressbar",
          style: normalizeStyle(progressStyle.value)
        }, null, 4)
      ]);
    };
  }
};
const _hoisted_1$i = { class: "has-validation pt-2" };
const _hoisted_2$h = {
  key: 0,
  class: "form-label fw-bold"
};
const _hoisted_3$9 = {
  key: 1,
  class: "badge text-bg-danger rounded-circle"
};
const _hoisted_4$4 = { class: "form-text" };
const _sfc_main$i = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "BsInputBase",
  props: {
    "label": {},
    "labelModifiers": {},
    "help": {},
    "helpModifiers": {},
    "width": {},
    "widthModifiers": {},
    "badge": {},
    "badgeModifiers": {}
  },
  emits: ["update:label", "update:help", "update:width", "update:badge"],
  setup(__props2) {
    const label = useModel(__props2, "label");
    const help = useModel(__props2, "help");
    const width = useModel(__props2, "width");
    const badge = useModel(__props2, "badge");
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$i, [
        label.value !== void 0 ? (openBlock(), createElementBlock("label", _hoisted_2$h, toDisplayString(label.value), 1)) : createCommentVNode("", true),
        createTextVNode("  "),
        badge.value ? (openBlock(), createElementBlock("span", _hoisted_3$9, "1")) : createCommentVNode("", true),
        createBaseVNode("div", {
          class: normalizeClass([width.value === void 0 ? "" : "col-" + width.value])
        }, [
          renderSlot(_ctx.$slots, "default")
        ], 2),
        createBaseVNode("div", _hoisted_4$4, toDisplayString(help.value), 1)
      ]);
    };
  }
});
const _hoisted_1$h = /* @__PURE__ */ createBaseVNode("path", { d: "M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" }, null, -1);
const _hoisted_2$g = /* @__PURE__ */ createBaseVNode("path", { d: "M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" }, null, -1);
const _hoisted_3$8 = /* @__PURE__ */ createBaseVNode("path", { d: "M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" }, null, -1);
const _hoisted_4$3 = [
  _hoisted_1$h,
  _hoisted_2$g,
  _hoisted_3$8
];
const _sfc_main$h = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "IconEyeSlash",
  setup(__props2) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", mergeProps(_ctx.$attrs, {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        fill: "currentColor"
      }), _hoisted_4$3, 16);
    };
  }
});
const _hoisted_1$g = /* @__PURE__ */ createBaseVNode("path", { d: "M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" }, null, -1);
const _hoisted_2$f = /* @__PURE__ */ createBaseVNode("path", { d: "M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" }, null, -1);
const _hoisted_3$7 = [
  _hoisted_1$g,
  _hoisted_2$f
];
const _sfc_main$g = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "IconEye",
  setup(__props2) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", mergeProps(_ctx.$attrs, {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        fill: "currentColor"
      }), _hoisted_3$7, 16);
    };
  }
});
const _hoisted_1$f = { class: "input-group" };
const _hoisted_2$e = ["type", "data-bs-title"];
const _hoisted_3$6 = {
  key: 0,
  class: "input-group-text"
};
const _sfc_main$f = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "BsInputText",
  props: {
    "modelValue": {},
    "modelModifiers": {},
    "label": {},
    "labelModifiers": {},
    "help": {},
    "helpModifiers": {},
    "width": {},
    "widthModifiers": {},
    "type": {},
    "typeModifiers": {},
    "badge": {},
    "badgeModifiers": {}
  },
  emits: ["update:modelValue", "update:label", "update:help", "update:width", "update:type", "update:badge"],
  setup(__props2) {
    const model = useModel(__props2, "modelValue");
    const label = useModel(__props2, "label");
    const help = useModel(__props2, "help");
    const width = useModel(__props2, "width");
    const type = useModel(__props2, "type");
    const badge = useModel(__props2, "badge");
    const flag = ref(false);
    function toggle() {
      flag.value = !flag.value;
    }
    return (_ctx, _cache) => {
      const _component_BsInputBase = resolveComponent("BsInputBase");
      return openBlock(), createBlock(_component_BsInputBase, {
        width: width.value,
        label: label.value,
        help: help.value,
        badge: badge.value
      }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1$f, [
            withDirectives(createBaseVNode("input", mergeProps({
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => model.value = $event),
              class: "form-control",
              type: type.value === void 0 || flag.value ? "text" : type.value
            }, _ctx.$attrs, {
              "data-bs-toggle": "tooltip",
              "data-bs-custom-class": "custom-tooltip",
              "data-bs-title": help.value
            }), null, 16, _hoisted_2$e), [
              [vModelDynamic, model.value]
            ]),
            type.value === "password" ? (openBlock(), createElementBlock("span", _hoisted_3$6, [
              !flag.value ? (openBlock(), createBlock(_sfc_main$g, {
                key: 0,
                onClick: toggle,
                width: "1rem",
                height: "1rem"
              })) : createCommentVNode("", true),
              flag.value ? (openBlock(), createBlock(_sfc_main$h, {
                key: 1,
                onClick: toggle,
                width: "1rem",
                height: "1rem"
              })) : createCommentVNode("", true)
            ])) : createCommentVNode("", true)
          ])
        ]),
        _: 1
      }, 8, ["width", "label", "help", "badge"]);
    };
  }
});
const _hoisted_1$e = { class: "input-group" };
const _hoisted_2$d = ["data-bs-title"];
const _sfc_main$e = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "BsInputReadonly",
  props: {
    "modelValue": {},
    "modelModifiers": {},
    "label": {},
    "labelModifiers": {},
    "help": {},
    "helpModifiers": {},
    "width": {},
    "widthModifiers": {}
  },
  emits: ["update:modelValue", "update:label", "update:help", "update:width"],
  setup(__props2) {
    const model = useModel(__props2, "modelValue");
    const label = useModel(__props2, "label");
    const help = useModel(__props2, "help");
    const width = useModel(__props2, "width");
    return (_ctx, _cache) => {
      const _component_BsInputBase = resolveComponent("BsInputBase");
      return openBlock(), createBlock(_component_BsInputBase, {
        width: width.value,
        label: label.value,
        help: help.value
      }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1$e, [
            withDirectives(createBaseVNode("input", mergeProps({
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => model.value = $event),
              class: "form-control-plaintext",
              readonly: "",
              type: "text"
            }, _ctx.$attrs, {
              "data-bs-toggle": "tooltip",
              "data-bs-custom-class": "custom-tooltip",
              "data-bs-title": help.value
            }), null, 16, _hoisted_2$d), [
              [vModelText, model.value]
            ])
          ])
        ]),
        _: 1
      }, 8, ["width", "label", "help"]);
    };
  }
});
const _hoisted_1$d = ["disabled"];
const _hoisted_2$c = ["value"];
const _hoisted_3$5 = ["value"];
const _sfc_main$d = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "BsSelect",
  props: {
    "modelValue": {},
    "modelModifiers": {},
    "label": {},
    "labelModifiers": {},
    "help": {},
    "helpModifiers": {},
    "width": {},
    "widthModifiers": {},
    "options": {},
    "optionsModifiers": {},
    "disabled": {},
    "disabledModifiers": {},
    "badge": {},
    "badgeModifiers": {}
  },
  emits: ["update:modelValue", "update:label", "update:help", "update:width", "update:options", "update:disabled", "update:badge"],
  setup(__props2) {
    const model = useModel(__props2, "modelValue");
    const label = useModel(__props2, "label");
    const help = useModel(__props2, "help");
    const width = useModel(__props2, "width");
    const options = useModel(__props2, "options");
    const disabled = useModel(__props2, "disabled");
    const badge = useModel(__props2, "badge");
    return (_ctx, _cache) => {
      const _component_BsIcon = resolveComponent("BsIcon");
      const _component_BsInputBase = resolveComponent("BsInputBase");
      return openBlock(), createBlock(_component_BsInputBase, {
        width: width.value,
        label: label.value,
        help: help.value,
        badge: badge.value
      }, {
        default: withCtx(() => [
          withDirectives(createBaseVNode("select", {
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => model.value = $event),
            class: "form-select",
            disabled: disabled.value
          }, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(options.value, (o) => {
              return openBlock(), createElementBlock(Fragment, {
                key: o.value
              }, [
                o.value === model.value ? (openBlock(), createElementBlock("option", {
                  key: 0,
                  selected: "",
                  value: o.value
                }, [
                  createVNode(_component_BsIcon, { icon: "bi-wifi" }),
                  createTextVNode(toDisplayString(o.label), 1)
                ], 8, _hoisted_2$c)) : (openBlock(), createElementBlock("option", {
                  key: 1,
                  value: o.value
                }, toDisplayString(o.label), 9, _hoisted_3$5))
              ], 64);
            }), 128))
          ], 8, _hoisted_1$d), [
            [vModelSelect, model.value]
          ])
        ]),
        _: 1
      }, 8, ["width", "label", "help", "badge"]);
    };
  }
});
const _hoisted_1$c = ["data-bs-title"];
const _sfc_main$c = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "BsInputTextArea",
  props: {
    "modelValue": {},
    "modelModifiers": {},
    "label": {},
    "labelModifiers": {},
    "help": {},
    "helpModifiers": {},
    "width": {},
    "widthModifiers": {},
    "badge": {},
    "badgeModifiers": {}
  },
  emits: ["update:modelValue", "update:label", "update:help", "update:width", "update:badge"],
  setup(__props2) {
    const model = useModel(__props2, "modelValue");
    const label = useModel(__props2, "label");
    const help = useModel(__props2, "help");
    const width = useModel(__props2, "width");
    const badge = useModel(__props2, "badge");
    return (_ctx, _cache) => {
      const _component_BsInputBase = resolveComponent("BsInputBase");
      return openBlock(), createBlock(_component_BsInputBase, {
        width: width.value,
        label: label.value,
        help: help.value,
        badge: badge.value
      }, {
        default: withCtx(() => [
          withDirectives(createBaseVNode("textarea", mergeProps({
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => model.value = $event),
            class: "form-control",
            type: "text"
          }, _ctx.$attrs, {
            "data-bs-toggle": "tooltip",
            "data-bs-custom-class": "custom-tooltip",
            "data-bs-title": help.value
          }), null, 16, _hoisted_1$c), [
            [vModelText, model.value]
          ])
        ]),
        _: 1
      }, 8, ["width", "label", "help", "badge"]);
    };
  }
});
const _hoisted_1$b = { class: "input-group" };
const _hoisted_2$b = ["data-bs-title", "disabled"];
const _hoisted_3$4 = {
  key: 0,
  class: "input-group-text"
};
const _sfc_main$b = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "BsInputNumber",
  props: {
    "modelValue": {},
    "modelModifiers": {},
    "label": {},
    "labelModifiers": {},
    "help": {},
    "helpModifiers": {},
    "width": {},
    "widthModifiers": {},
    "unit": {},
    "unitModifiers": {},
    "disabled": {},
    "disabledModifiers": {},
    "badge": {},
    "badgeModifiers": {}
  },
  emits: ["update:modelValue", "update:label", "update:help", "update:width", "update:unit", "update:disabled", "update:badge"],
  setup(__props2) {
    const model = useModel(__props2, "modelValue");
    const label = useModel(__props2, "label");
    const help = useModel(__props2, "help");
    const width = useModel(__props2, "width");
    const unit = useModel(__props2, "unit");
    const disabled = useModel(__props2, "disabled");
    const badge = useModel(__props2, "badge");
    return (_ctx, _cache) => {
      const _component_BsInputBase = resolveComponent("BsInputBase");
      return openBlock(), createBlock(_component_BsInputBase, {
        width: width.value,
        label: label.value,
        help: help.value,
        badge: badge.value
      }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1$b, [
            withDirectives(createBaseVNode("input", mergeProps({
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => model.value = $event),
              class: "form-control",
              type: "number"
            }, _ctx.$attrs, {
              "data-bs-toggle": "tooltip",
              "data-bs-custom-class": "custom-tooltip",
              "data-bs-title": help.value,
              disabled: disabled.value
            }), null, 16, _hoisted_2$b), [
              [vModelText, model.value]
            ]),
            unit.value !== void 0 ? (openBlock(), createElementBlock("span", _hoisted_3$4, toDisplayString(unit.value), 1)) : createCommentVNode("", true)
          ])
        ]),
        _: 1
      }, 8, ["width", "label", "help", "badge"]);
    };
  }
});
const _hoisted_1$a = {
  class: "form-check form-switch",
  style: { "height": "38px" }
};
const _hoisted_2$a = ["disabled", "data-bs-title"];
const _sfc_main$a = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "BsInputSwitch",
  props: {
    "modelValue": {},
    "modelModifiers": {},
    "label": {},
    "labelModifiers": {},
    "help": {},
    "helpModifiers": {},
    "width": {},
    "widthModifiers": {},
    "disabled": {},
    "disabledModifiers": {},
    "badge": {},
    "badgeModifiers": {}
  },
  emits: ["update:modelValue", "update:label", "update:help", "update:width", "update:disabled", "update:badge"],
  setup(__props2) {
    const model = useModel(__props2, "modelValue");
    const label = useModel(__props2, "label");
    const help = useModel(__props2, "help");
    const width = useModel(__props2, "width");
    const disabled = useModel(__props2, "disabled");
    const badge = useModel(__props2, "badge");
    return (_ctx, _cache) => {
      const _component_BsInputBase = resolveComponent("BsInputBase");
      return openBlock(), createBlock(_component_BsInputBase, {
        width: width.value,
        label: label.value,
        help: help.value,
        badge: badge.value
      }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1$a, [
            withDirectives(createBaseVNode("input", mergeProps({
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => model.value = $event),
              class: "form-check-input",
              type: "checkbox",
              role: "switch"
            }, _ctx.$attrs, {
              disabled: disabled.value,
              "data-bs-toggle": "tooltip",
              "data-bs-custom-class": "custom-tooltip",
              "data-bs-title": help.value
            }), null, 16, _hoisted_2$a), [
              [vModelCheckbox, model.value]
            ])
          ])
        ]),
        _: 1
      }, 8, ["width", "label", "help", "badge"]);
    };
  }
});
const _hoisted_1$9 = {
  class: "btn-group",
  role: "group"
};
const _hoisted_2$9 = ["value", "name", "id", "disabled"];
const _hoisted_3$3 = ["for"];
const _sfc_main$9 = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "BsInputRadio",
  props: {
    "modelValue": {},
    "modelModifiers": {},
    "options": {},
    "optionsModifiers": {},
    "label": {},
    "labelModifiers": {},
    "help": {},
    "helpModifiers": {},
    "width": {},
    "widthModifiers": {},
    "disabled": {},
    "disabledModifiers": {},
    "badge": {},
    "badgeModifiers": {}
  },
  emits: ["update:modelValue", "update:options", "update:label", "update:help", "update:width", "update:disabled", "update:badge"],
  setup(__props2) {
    const model = useModel(__props2, "modelValue");
    const options = useModel(__props2, "options");
    const label = useModel(__props2, "label");
    const help = useModel(__props2, "help");
    const width = useModel(__props2, "width");
    const disabled = useModel(__props2, "disabled");
    const badge = useModel(__props2, "badge");
    return (_ctx, _cache) => {
      const _component_BsInputBase = resolveComponent("BsInputBase");
      return openBlock(), createBlock(_component_BsInputBase, {
        width: width.value,
        label: label.value,
        help: help.value,
        badge: badge.value
      }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1$9, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(options.value, (o) => {
              return openBlock(), createElementBlock(Fragment, {
                key: o.value
              }, [
                withDirectives(createBaseVNode("input", {
                  type: "radio",
                  class: "btn-check",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => model.value = $event),
                  value: o.value,
                  name: "radio" + _ctx.$.uid,
                  id: "radio" + _ctx.$.uid + o.value,
                  disabled: disabled.value
                }, null, 8, _hoisted_2$9), [
                  [vModelRadio, model.value]
                ]),
                createBaseVNode("label", {
                  class: "btn btn-outline-primary",
                  for: "radio" + _ctx.$.uid + o.value
                }, toDisplayString(o.label), 9, _hoisted_3$3)
              ], 64);
            }), 128))
          ])
        ]),
        _: 1
      }, 8, ["width", "label", "help", "badge"]);
    };
  }
});
const _hoisted_1$8 = { class: "dropdown" };
const _hoisted_2$8 = ["disabled"];
const _hoisted_3$2 = { class: "dropdown-menu" };
const _hoisted_4$2 = ["onClick"];
const _sfc_main$8 = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "BsDropdown",
  props: {
    "label": {},
    "labelModifiers": {},
    "help": {},
    "helpModifiers": {},
    "width": {},
    "widthModifiers": {},
    "options": {},
    "optionsModifiers": {},
    "button": {},
    "buttonModifiers": {},
    "callback": {},
    "callbackModifiers": {},
    "disabled": {},
    "disabledModifiers": {},
    "badge": {},
    "badgeModifiers": {}
  },
  emits: ["update:label", "update:help", "update:width", "update:options", "update:button", "update:callback", "update:disabled", "update:badge"],
  setup(__props2) {
    const label = useModel(__props2, "label");
    const help = useModel(__props2, "help");
    const width = useModel(__props2, "width");
    const options = useModel(__props2, "options");
    const button = useModel(__props2, "button");
    const callback = useModel(__props2, "callback");
    const disabled = useModel(__props2, "disabled");
    const badge = useModel(__props2, "badge");
    return (_ctx, _cache) => {
      const _component_BsInputBase = resolveComponent("BsInputBase");
      return openBlock(), createBlock(_component_BsInputBase, {
        width: width.value,
        label: label.value,
        help: help.value,
        badge: badge.value
      }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1$8, [
            createBaseVNode("button", {
              class: "btn btn-outline-secondary dropdown-toggle",
              type: "button",
              "data-bs-toggle": "dropdown",
              "aria-expanded": "false",
              disabled: disabled.value
            }, toDisplayString(button.value), 9, _hoisted_2$8),
            createBaseVNode("ul", _hoisted_3$2, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(options.value, (o) => {
                return openBlock(), createElementBlock("li", {
                  key: o.value
                }, [
                  createBaseVNode("a", {
                    class: "dropdown-item",
                    onClick: ($event) => callback.value(o.value)
                  }, toDisplayString(o.label), 9, _hoisted_4$2)
                ]);
              }), 128))
            ])
          ])
        ]),
        _: 1
      }, 8, ["width", "label", "help", "badge"]);
    };
  }
});
const _hoisted_1$7 = /* @__PURE__ */ createBaseVNode("path", { d: "M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" }, null, -1);
const _hoisted_2$7 = [
  _hoisted_1$7
];
const _sfc_main$7 = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "IconHome",
  setup(__props2) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", mergeProps(_ctx.$attrs, {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        fill: "currentColor"
      }), _hoisted_2$7, 16);
    };
  }
});
const _hoisted_1$6 = /* @__PURE__ */ createBaseVNode("path", { d: "M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.27 3.27a.997.997 0 0 0 1.414 0l1.586-1.586a.997.997 0 0 0 0-1.414l-3.27-3.27a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3q0-.405-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814zm9.646 10.646a.5.5 0 0 1 .708 0l2.914 2.915a.5.5 0 0 1-.707.707l-2.915-2.914a.5.5 0 0 1 0-.708M3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026z" }, null, -1);
const _hoisted_2$6 = [
  _hoisted_1$6
];
const _sfc_main$6 = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "IconTools",
  setup(__props2) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", mergeProps(_ctx.$attrs, {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        fill: "currentColor"
      }), _hoisted_2$6, 16);
    };
  }
});
const _hoisted_1$5 = /* @__PURE__ */ createBaseVNode("path", {
  "fill-rule": "evenodd",
  d: "M0 0h1v15h15v1H0zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5"
}, null, -1);
const _hoisted_2$5 = [
  _hoisted_1$5
];
const _sfc_main$5 = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "IconGraphUpArrow",
  setup(__props2) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", mergeProps(_ctx.$attrs, {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        fill: "currentColor"
      }), _hoisted_2$5, 16);
    };
  }
});
const _hoisted_1$4 = /* @__PURE__ */ createBaseVNode("path", {
  "fill-rule": "evenodd",
  d: "M0 0h1v15h15v1H0zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5"
}, null, -1);
const _hoisted_2$4 = [
  _hoisted_1$4
];
const _sfc_main$4 = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "IconUpArrow",
  setup(__props2) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", mergeProps(_ctx.$attrs, {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        fill: "currentColor"
      }), _hoisted_2$4, 16);
    };
  }
});
const _hoisted_1$3 = /* @__PURE__ */ createBaseVNode("path", { d: "M5 0a.5.5 0 0 1 .5.5V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2A2.5 2.5 0 0 1 14 4.5h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14a2.5 2.5 0 0 1-2.5 2.5v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14A2.5 2.5 0 0 1 2 11.5H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2A2.5 2.5 0 0 1 4.5 2V.5A.5.5 0 0 1 5 0m-.5 3A1.5 1.5 0 0 0 3 4.5v7A1.5 1.5 0 0 0 4.5 13h7a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 11.5 3zM5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5zM6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5z" }, null, -1);
const _hoisted_2$3 = [
  _hoisted_1$3
];
const _sfc_main$3 = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "IconCpu",
  setup(__props2) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("svg", mergeProps(_ctx.$attrs, {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        fill: "currentColor"
      }), _hoisted_2$3, 16);
    };
  }
});
const _hoisted_1$2 = ["data-bs-target"];
const _hoisted_2$2 = ["id"];
const _hoisted_3$1 = { class: "modal-dialog" };
const _hoisted_4$1 = { class: "modal-content p-4" };
const _hoisted_5$1 = { class: "modal-header" };
const _hoisted_6$1 = { class: "modal-title fs-5" };
const _hoisted_7$1 = /* @__PURE__ */ createBaseVNode("button", {
  type: "button",
  class: "btn-close",
  "data-bs-dismiss": "modal",
  "aria-label": "Close"
}, null, -1);
const _hoisted_8$1 = { class: "modal-body" };
const _hoisted_9 = { key: 0 };
const _hoisted_10 = /* @__PURE__ */ createBaseVNode("div", { class: "modal-footer" }, [
  /* @__PURE__ */ createBaseVNode("button", {
    type: "button",
    class: "btn btn-secondary",
    "data-bs-dismiss": "modal"
  }, "Close")
], -1);
const _sfc_main$2 = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "BsModal",
  props: {
    "modelValue": {},
    "modelModifiers": {},
    "button": {},
    "buttonModifiers": {},
    "title": {},
    "titleModifiers": {}
  },
  emits: ["update:modelValue", "update:button", "update:title"],
  setup(__props2) {
    const model = useModel(__props2, "modelValue");
    const button = useModel(__props2, "button");
    const title = useModel(__props2, "title");
    const format = (s) => {
      if (isValidJson(model.value)) return JSON.stringify(JSON.parse(s), null, 2);
      if (isValidFormData(model.value)) return s.replaceAll("&", "&\n\r");
      return s;
    };
    const checkCode = () => {
      return isValidJson(model.value) || isValidFormData(model.value) || isValidMqttData(model.value);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("button", mergeProps(_ctx.$attrs, {
          type: "button",
          class: "btn btn-secondary",
          "data-bs-toggle": "modal",
          "data-bs-target": "#modal" + _ctx.$.uid
        }), toDisplayString(button.value), 17, _hoisted_1$2),
        createBaseVNode("div", {
          class: "modal fade modal-lg",
          id: "modal" + _ctx.$.uid,
          tabindex: "-1",
          "aria-hidden": "true"
        }, [
          createBaseVNode("div", _hoisted_3$1, [
            createBaseVNode("div", _hoisted_4$1, [
              createBaseVNode("div", _hoisted_5$1, [
                createBaseVNode("h1", _hoisted_6$1, toDisplayString(title.value), 1),
                _hoisted_7$1
              ]),
              createBaseVNode("div", _hoisted_8$1, [
                checkCode() ? (openBlock(), createElementBlock("pre", _hoisted_9, toDisplayString(format(model.value)), 1)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                  createTextVNode(toDisplayString(model.value), 1)
                ], 64))
              ]),
              _hoisted_10
            ])
          ])
        ], 8, _hoisted_2$2)
      ], 64);
    };
  }
});
const _hoisted_1$1 = ["id", "data-bs-target"];
const _hoisted_2$1 = ["id"];
const _hoisted_3 = { class: "modal-dialog" };
const _hoisted_4 = { class: "modal-content p-4" };
const _hoisted_5 = { class: "modal-header" };
const _hoisted_6 = { class: "modal-title fs-5" };
const _hoisted_7 = { class: "modal-body" };
const _hoisted_8 = { class: "modal-footer" };
const _sfc_main$1 = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "BsModalConfirm",
  props: {
    "callback": {},
    "callbackModifiers": {},
    "message": {},
    "messageModifiers": {},
    "id": {},
    "idModifiers": {},
    "title": {},
    "titleModifiers": {}
  },
  emits: ["update:callback", "update:message", "update:id", "update:title"],
  setup(__props2) {
    const callback = useModel(__props2, "callback");
    const message = useModel(__props2, "message");
    const id = useModel(__props2, "id");
    const title = useModel(__props2, "title");
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("button", {
          id: id.value,
          type: "button",
          class: "btn btn-secondary",
          hidden: "",
          "data-bs-toggle": "modal",
          "data-bs-target": "#modal" + _ctx.$.uid
        }, " Testing ", 8, _hoisted_1$1),
        createBaseVNode("div", {
          class: "modal fade modal-lg",
          id: "modal" + _ctx.$.uid,
          tabindex: "-1",
          "aria-hidden": "true"
        }, [
          createBaseVNode("div", _hoisted_3, [
            createBaseVNode("div", _hoisted_4, [
              createBaseVNode("div", _hoisted_5, [
                createBaseVNode("h1", _hoisted_6, toDisplayString(title.value), 1)
              ]),
              createBaseVNode("div", _hoisted_7, toDisplayString(message.value), 1),
              createBaseVNode("div", _hoisted_8, [
                createBaseVNode("button", {
                  onClick: _cache[0] || (_cache[0] = ($event) => callback.value(true)),
                  type: "button",
                  class: "btn btn-primary",
                  "data-bs-dismiss": "modal"
                }, " Confirm "),
                createBaseVNode("button", {
                  onClick: _cache[1] || (_cache[1] = ($event) => callback.value(false)),
                  type: "button",
                  class: "btn btn-secondary",
                  "data-bs-dismiss": "modal"
                }, " Cancel ")
              ])
            ])
          ])
        ], 8, _hoisted_2$1)
      ], 64);
    };
  }
});
const _hoisted_1 = ["data-bs-title"];
const _hoisted_2 = ["onClick"];
const _sfc_main = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "BsInputTextAreaFormat",
  props: {
    "modelValue": {},
    "modelModifiers": {},
    "label": {},
    "labelModifiers": {},
    "help": {},
    "helpModifiers": {},
    "width": {},
    "widthModifiers": {},
    "badge": {},
    "badgeModifiers": {}
  },
  emits: ["update:modelValue", "update:label", "update:help", "update:width", "update:badge"],
  setup(__props2) {
    const contextMenuOptions = ref([
      { label: "Cancel", value: "" },
      { label: "Network name, ${mdns}", value: "${mdns}" },
      { label: "Chip ID, ${id}", value: "${id}" },
      { label: "Sleep interval, ${sleep-interval}", value: "${sleep-interval}" },
      { label: "Token, ${token}", value: "${token}" },
      { label: "Token 2, ${token2}", value: "${token2}" },
      { label: "Current angle/tilt, ${angle}", value: "${angle}" },
      { label: "Current angle/tilt, ${tilt}", value: "${tilt}" },
      { label: "Temperature (C), ${temp-c}", value: "${temp-c}" },
      { label: "Temperature (F), ${temp-f}", value: "${temp-f}" },
      { label: "Temperature Unit, ${temp-unit}", value: "${temp-unit}" },
      { label: "Application version, ${app-ver}", value: "${app-ver}" },
      { label: "Application build, ${app-build}", value: "${app-build}" },
      { label: "Battery (V), ${battery}", value: "${battery}" },
      { label: "Battery (%), ${battery-percent}", value: "${battery-percent}" },
      { label: "Wifi signal strength, ${rssi}", value: "${rssi}" },
      { label: "Time for measurement, ${run-time}", value: "${run-time}" },
      { label: "Gravity, ${gravity}", value: "${gravity}" },
      { label: "Gravity (SG), ${gravity-sg}", value: "${gravity-sg}" },
      { label: "Gravity (Plato), ${gravity-plato}", value: "${gravity-plato}" },
      { label: "Gravity unit, ${gravity-unit}", value: "${gravity-unit}" },
      { label: "Corrected gravity, ${corr-gravity}", value: "${corr-gravity}" },
      {
        label: "Corrected Gravity (SG), ${corr-gravity-sg}",
        value: "${corr-gravity-sg}"
      },
      {
        label: "Corrected Gravity (Plato), ${corr-gravity-plato}",
        value: "${corr-gravity-plato}"
      }
    ]);
    function insertText(value) {
      if (value.length > 0) {
        var obj = document.getElementById("textArea");
        model.value = obj.value.substring(0, obj.selectionStart) + value + obj.value.substring(obj.selectionEnd, obj.value.length);
      }
      var menu = document.getElementById("contextMenu");
      menu.style.display = "none";
    }
    const openContextMenu = (event) => {
      var menu = document.getElementById("contextMenu");
      menu.style.display = "block";
      menu.style.left = event.pageX + "px";
      menu.style.top = event.pageY + "px";
    };
    const model = useModel(__props2, "modelValue");
    const label = useModel(__props2, "label");
    const help = useModel(__props2, "help");
    const width = useModel(__props2, "width");
    const badge = useModel(__props2, "badge");
    return (_ctx, _cache) => {
      const _component_BsInputBase = resolveComponent("BsInputBase");
      return openBlock(), createElementBlock(Fragment, null, [
        createVNode(_component_BsInputBase, {
          width: width.value,
          label: label.value,
          help: help.value,
          badge: badge.value
        }, {
          default: withCtx(() => [
            withDirectives(createBaseVNode("textarea", mergeProps({
              onContextmenu: withModifiers(openContextMenu, ["right", "prevent"]),
              id: "textArea",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => model.value = $event),
              class: "form-control",
              type: "text"
            }, _ctx.$attrs, {
              "data-bs-toggle": "tooltip",
              "data-bs-custom-class": "custom-tooltip",
              "data-bs-title": help.value
            }), null, 16, _hoisted_1), [
              [vModelText, model.value]
            ])
          ]),
          _: 1
        }, 8, ["width", "label", "help", "badge"]),
        createBaseVNode("div", {
          onClick: _cache[1] || (_cache[1] = (...args) => _ctx.closeContextMenu && _ctx.closeContextMenu(...args)),
          id: "contextMenu",
          class: "dropdown-menu"
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(contextMenuOptions.value, (o) => {
            return openBlock(), createElementBlock("a", {
              key: o.value,
              class: "dropdown-item",
              onClick: ($event) => insertText(o.value)
            }, toDisplayString(o.label), 9, _hoisted_2);
          }), 128))
        ])
      ], 64);
    };
  }
});
const app = createApp(_sfc_main$r);
app.use(router);
app.use(piniaInstance);
app.component("BsMessage", _sfc_main$m);
app.component("BsDropdown", _sfc_main$8);
app.component("BsCard", _sfc_main$l);
app.component("BsFileUpload", _sfc_main$k);
app.component("BsProgress", _sfc_main$j);
app.component("BsInputBase", _sfc_main$i);
app.component("BsInputText", _sfc_main$f);
app.component("BsInputReadonly", _sfc_main$e);
app.component("BsSelect", _sfc_main$d);
app.component("BsInputTextArea", _sfc_main$c);
app.component("BsInputNumber", _sfc_main$b);
app.component("BsInputRadio", _sfc_main$9);
app.component("BsInputSwitch", _sfc_main$a);
app.component("IconHome", _sfc_main$7);
app.component("IconTools", _sfc_main$6);
app.component("IconGraphUpArrow", _sfc_main$5);
app.component("IconUpArrow", _sfc_main$4);
app.component("IconCpu", _sfc_main$3);
app.component("BsModal", _sfc_main$2);
app.component("BsModalConfirm", _sfc_main$1);
app.component("BsInputTextAreaFormat", _sfc_main);
app.mount("#app");