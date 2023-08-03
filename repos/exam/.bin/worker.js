var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../../node_modules/.pnpm/ms@2.1.2/node_modules/ms/index.js
var require_ms = __commonJS({
  "../../node_modules/.pnpm/ms@2.1.2/node_modules/ms/index.js"(exports, module2) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module2.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// ../../node_modules/.pnpm/debug@4.3.4_supports-color@9.3.1/node_modules/debug/src/common.js
var require_common = __commonJS({
  "../../node_modules/.pnpm/debug@4.3.4_supports-color@9.3.1/node_modules/debug/src/common.js"(exports, module2) {
    function setup(env2) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env2).forEach((key) => {
        createDebug[key] = env2[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug(...args) {
          if (!debug.enabled) {
            return;
          }
          const self = debug;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms = curr - (prevTime || curr);
          self.diff = ms;
          self.prev = prevTime;
          self.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self, args);
          const logFn = self.log || createDebug.log;
          logFn.apply(self, args);
        }
        debug.namespace = namespace;
        debug.useColors = createDebug.useColors();
        debug.color = createDebug.selectColor(namespace);
        debug.extend = extend;
        debug.destroy = createDebug.destroy;
        Object.defineProperty(debug, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug);
        }
        return debug;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        let i;
        const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
        const len = split.length;
        for (i = 0; i < len; i++) {
          if (!split[i]) {
            continue;
          }
          namespaces = split[i].replace(/\*/g, ".*?");
          if (namespaces[0] === "-") {
            createDebug.skips.push(new RegExp("^" + namespaces.slice(1) + "$"));
          } else {
            createDebug.names.push(new RegExp("^" + namespaces + "$"));
          }
        }
      }
      function disable() {
        const namespaces = [
          ...createDebug.names.map(toNamespace),
          ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        if (name[name.length - 1] === "*") {
          return true;
        }
        let i;
        let len;
        for (i = 0, len = createDebug.skips.length; i < len; i++) {
          if (createDebug.skips[i].test(name)) {
            return false;
          }
        }
        for (i = 0, len = createDebug.names.length; i < len; i++) {
          if (createDebug.names[i].test(name)) {
            return true;
          }
        }
        return false;
      }
      function toNamespace(regexp) {
        return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module2.exports = setup;
  }
});

// ../../node_modules/.pnpm/debug@4.3.4_supports-color@9.3.1/node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "../../node_modules/.pnpm/debug@4.3.4_supports-color@9.3.1/node_modules/debug/src/browser.js"(exports, module2) {
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = localstorage();
    exports.destroy = (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module2.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports.storage.setItem("debug", namespaces);
        } else {
          exports.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports.storage.getItem("debug");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module2.exports = require_common()(exports);
    var { formatters } = module2.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// ../../node_modules/.pnpm/supports-color@9.3.1/node_modules/supports-color/index.js
var supports_color_exports = {};
__export(supports_color_exports, {
  createSupportsColor: () => createSupportsColor,
  default: () => supports_color_default
});
function hasFlag(flag, argv = globalThis.Deno ? globalThis.Deno.args : import_node_process.default.argv) {
  const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
  const position = argv.indexOf(prefix + flag);
  const terminatorPosition = argv.indexOf("--");
  return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
}
function envForceColor() {
  if ("FORCE_COLOR" in env) {
    if (env.FORCE_COLOR === "true") {
      return 1;
    }
    if (env.FORCE_COLOR === "false") {
      return 0;
    }
    return env.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
  }
}
function translateLevel(level) {
  if (level === 0) {
    return false;
  }
  return {
    level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3
  };
}
function _supportsColor(haveStream, { streamIsTTY, sniffFlags = true } = {}) {
  const noFlagForceColor = envForceColor();
  if (noFlagForceColor !== void 0) {
    flagForceColor = noFlagForceColor;
  }
  const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;
  if (forceColor === 0) {
    return 0;
  }
  if (sniffFlags) {
    if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
      return 3;
    }
    if (hasFlag("color=256")) {
      return 2;
    }
  }
  if ("TF_BUILD" in env && "AGENT_NAME" in env) {
    return 1;
  }
  if (haveStream && !streamIsTTY && forceColor === void 0) {
    return 0;
  }
  const min = forceColor || 0;
  if (env.TERM === "dumb") {
    return min;
  }
  if (import_node_process.default.platform === "win32") {
    const osRelease = import_node_os.default.release().split(".");
    if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
      return Number(osRelease[2]) >= 14931 ? 3 : 2;
    }
    return 1;
  }
  if ("CI" in env) {
    if ("GITHUB_ACTIONS" in env) {
      return 3;
    }
    if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "BUILDKITE", "DRONE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
      return 1;
    }
    return min;
  }
  if ("TEAMCITY_VERSION" in env) {
    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
  }
  if (env.COLORTERM === "truecolor") {
    return 3;
  }
  if (env.TERM === "xterm-kitty") {
    return 3;
  }
  if ("TERM_PROGRAM" in env) {
    const version = Number.parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
    switch (env.TERM_PROGRAM) {
      case "iTerm.app": {
        return version >= 3 ? 3 : 2;
      }
      case "Apple_Terminal": {
        return 2;
      }
    }
  }
  if (/-256(color)?$/i.test(env.TERM)) {
    return 2;
  }
  if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
    return 1;
  }
  if ("COLORTERM" in env) {
    return 1;
  }
  return min;
}
function createSupportsColor(stream, options = {}) {
  const level = _supportsColor(stream, {
    streamIsTTY: stream && stream.isTTY,
    ...options
  });
  return translateLevel(level);
}
var import_node_process, import_node_os, import_node_tty, env, flagForceColor, supportsColor, supports_color_default;
var init_supports_color = __esm({
  "../../node_modules/.pnpm/supports-color@9.3.1/node_modules/supports-color/index.js"() {
    import_node_process = __toESM(require("node:process"), 1);
    import_node_os = __toESM(require("node:os"), 1);
    import_node_tty = __toESM(require("node:tty"), 1);
    ({ env } = import_node_process.default);
    if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
      flagForceColor = 0;
    } else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
      flagForceColor = 1;
    }
    supportsColor = {
      stdout: createSupportsColor({ isTTY: import_node_tty.default.isatty(1) }),
      stderr: createSupportsColor({ isTTY: import_node_tty.default.isatty(2) })
    };
    supports_color_default = supportsColor;
  }
});

// ../../node_modules/.pnpm/debug@4.3.4_supports-color@9.3.1/node_modules/debug/src/node.js
var require_node = __commonJS({
  "../../node_modules/.pnpm/debug@4.3.4_supports-color@9.3.1/node_modules/debug/src/node.js"(exports, module2) {
    var tty2 = require("tty");
    var util = require("util");
    exports.init = init;
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.destroy = util.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    );
    exports.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor2 = (init_supports_color(), __toCommonJS(supports_color_exports));
      if (supportsColor2 && (supportsColor2.stderr || supportsColor2).level >= 2) {
        exports.colors = [
          20,
          21,
          26,
          27,
          32,
          33,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          56,
          57,
          62,
          63,
          68,
          69,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          92,
          93,
          98,
          99,
          112,
          113,
          128,
          129,
          134,
          135,
          148,
          149,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          178,
          179,
          184,
          185,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          214,
          215,
          220,
          221
        ];
      }
    } catch (error) {
    }
    exports.inspectOpts = Object.keys(process.env).filter((key) => {
      return /^debug_/i.test(key);
    }).reduce((obj, key) => {
      const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
        return k.toUpperCase();
      });
      let val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty2.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name, useColors: useColors2 } = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} \x1B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module2.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports.inspectOpts.hideDate) {
        return "";
      }
      return (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function log(...args) {
      return process.stderr.write(util.format(...args) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init(debug) {
      debug.inspectOpts = {};
      const keys = Object.keys(exports.inspectOpts);
      for (let i = 0; i < keys.length; i++) {
        debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
      }
    }
    module2.exports = require_common()(exports);
    var { formatters } = module2.exports;
    formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
    };
    formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts);
    };
  }
});

// ../../node_modules/.pnpm/debug@4.3.4_supports-color@9.3.1/node_modules/debug/src/index.js
var require_src = __commonJS({
  "../../node_modules/.pnpm/debug@4.3.4_supports-color@9.3.1/node_modules/debug/src/index.js"(exports, module2) {
    if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
      module2.exports = require_browser();
    } else {
      module2.exports = require_node();
    }
  }
});

// ../../node_modules/.pnpm/esbuild-register@3.4.2_esbuild@0.18.17/node_modules/esbuild-register/dist/node.js
var require_node2 = __commonJS({
  "../../node_modules/.pnpm/esbuild-register@3.4.2_esbuild@0.18.17/node_modules/esbuild-register/dist/node.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function _interopRequireDefault2(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var __create2 = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getProtoOf2 = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __commonJS2 = (callback, module22) => () => {
      if (!module22) {
        module22 = { exports: {} };
        callback(module22.exports, module22);
      }
      return module22.exports;
    };
    var __exportStar = (target, module22, desc) => {
      if (module22 && typeof module22 === "object" || typeof module22 === "function") {
        for (let key of __getOwnPropNames2(module22))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module22[key], enumerable: !(desc = __getOwnPropDesc2(module22, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module22) => {
      return __exportStar(__markAsModule(__defProp2(module22 != null ? __create2(__getProtoOf2(module22)) : {}, "default", module22 && module22.__esModule && "default" in module22 ? { get: () => module22.default, enumerable: true } : { value: module22, enumerable: true })), module22);
    };
    var require_base64 = __commonJS2((exports2) => {
      var intToCharMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
      exports2.encode = function(number) {
        if (0 <= number && number < intToCharMap.length) {
          return intToCharMap[number];
        }
        throw new TypeError("Must be between 0 and 63: " + number);
      };
      exports2.decode = function(charCode) {
        var bigA = 65;
        var bigZ = 90;
        var littleA = 97;
        var littleZ = 122;
        var zero = 48;
        var nine = 57;
        var plus = 43;
        var slash = 47;
        var littleOffset = 26;
        var numberOffset = 52;
        if (bigA <= charCode && charCode <= bigZ) {
          return charCode - bigA;
        }
        if (littleA <= charCode && charCode <= littleZ) {
          return charCode - littleA + littleOffset;
        }
        if (zero <= charCode && charCode <= nine) {
          return charCode - zero + numberOffset;
        }
        if (charCode == plus) {
          return 62;
        }
        if (charCode == slash) {
          return 63;
        }
        return -1;
      };
    });
    var require_base64_vlq = __commonJS2((exports2) => {
      var base64 = require_base64();
      var VLQ_BASE_SHIFT = 5;
      var VLQ_BASE = 1 << VLQ_BASE_SHIFT;
      var VLQ_BASE_MASK = VLQ_BASE - 1;
      var VLQ_CONTINUATION_BIT = VLQ_BASE;
      function toVLQSigned(aValue) {
        return aValue < 0 ? (-aValue << 1) + 1 : (aValue << 1) + 0;
      }
      function fromVLQSigned(aValue) {
        var isNegative = (aValue & 1) === 1;
        var shifted = aValue >> 1;
        return isNegative ? -shifted : shifted;
      }
      exports2.encode = function base64VLQ_encode(aValue) {
        var encoded = "";
        var digit;
        var vlq = toVLQSigned(aValue);
        do {
          digit = vlq & VLQ_BASE_MASK;
          vlq >>>= VLQ_BASE_SHIFT;
          if (vlq > 0) {
            digit |= VLQ_CONTINUATION_BIT;
          }
          encoded += base64.encode(digit);
        } while (vlq > 0);
        return encoded;
      };
      exports2.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
        var strLen = aStr.length;
        var result = 0;
        var shift = 0;
        var continuation, digit;
        do {
          if (aIndex >= strLen) {
            throw new Error("Expected more digits in base 64 VLQ value.");
          }
          digit = base64.decode(aStr.charCodeAt(aIndex++));
          if (digit === -1) {
            throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
          }
          continuation = !!(digit & VLQ_CONTINUATION_BIT);
          digit &= VLQ_BASE_MASK;
          result = result + (digit << shift);
          shift += VLQ_BASE_SHIFT;
        } while (continuation);
        aOutParam.value = fromVLQSigned(result);
        aOutParam.rest = aIndex;
      };
    });
    var require_util = __commonJS2((exports2) => {
      function getArg(aArgs, aName, aDefaultValue) {
        if (aName in aArgs) {
          return aArgs[aName];
        } else if (arguments.length === 3) {
          return aDefaultValue;
        } else {
          throw new Error('"' + aName + '" is a required argument.');
        }
      }
      exports2.getArg = getArg;
      var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
      var dataUrlRegexp = /^data:.+\,.+$/;
      function urlParse(aUrl) {
        var match = aUrl.match(urlRegexp);
        if (!match) {
          return null;
        }
        return {
          scheme: match[1],
          auth: match[2],
          host: match[3],
          port: match[4],
          path: match[5]
        };
      }
      exports2.urlParse = urlParse;
      function urlGenerate(aParsedUrl) {
        var url = "";
        if (aParsedUrl.scheme) {
          url += aParsedUrl.scheme + ":";
        }
        url += "//";
        if (aParsedUrl.auth) {
          url += aParsedUrl.auth + "@";
        }
        if (aParsedUrl.host) {
          url += aParsedUrl.host;
        }
        if (aParsedUrl.port) {
          url += ":" + aParsedUrl.port;
        }
        if (aParsedUrl.path) {
          url += aParsedUrl.path;
        }
        return url;
      }
      exports2.urlGenerate = urlGenerate;
      function normalize(aPath) {
        var path2 = aPath;
        var url = urlParse(aPath);
        if (url) {
          if (!url.path) {
            return aPath;
          }
          path2 = url.path;
        }
        var isAbsolute = exports2.isAbsolute(path2);
        var parts = path2.split(/\/+/);
        for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
          part = parts[i];
          if (part === ".") {
            parts.splice(i, 1);
          } else if (part === "..") {
            up++;
          } else if (up > 0) {
            if (part === "") {
              parts.splice(i + 1, up);
              up = 0;
            } else {
              parts.splice(i, 2);
              up--;
            }
          }
        }
        path2 = parts.join("/");
        if (path2 === "") {
          path2 = isAbsolute ? "/" : ".";
        }
        if (url) {
          url.path = path2;
          return urlGenerate(url);
        }
        return path2;
      }
      exports2.normalize = normalize;
      function join2(aRoot, aPath) {
        if (aRoot === "") {
          aRoot = ".";
        }
        if (aPath === "") {
          aPath = ".";
        }
        var aPathUrl = urlParse(aPath);
        var aRootUrl = urlParse(aRoot);
        if (aRootUrl) {
          aRoot = aRootUrl.path || "/";
        }
        if (aPathUrl && !aPathUrl.scheme) {
          if (aRootUrl) {
            aPathUrl.scheme = aRootUrl.scheme;
          }
          return urlGenerate(aPathUrl);
        }
        if (aPathUrl || aPath.match(dataUrlRegexp)) {
          return aPath;
        }
        if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
          aRootUrl.host = aPath;
          return urlGenerate(aRootUrl);
        }
        var joined = aPath.charAt(0) === "/" ? aPath : normalize(aRoot.replace(/\/+$/, "") + "/" + aPath);
        if (aRootUrl) {
          aRootUrl.path = joined;
          return urlGenerate(aRootUrl);
        }
        return joined;
      }
      exports2.join = join2;
      exports2.isAbsolute = function(aPath) {
        return aPath.charAt(0) === "/" || urlRegexp.test(aPath);
      };
      function relative(aRoot, aPath) {
        if (aRoot === "") {
          aRoot = ".";
        }
        aRoot = aRoot.replace(/\/$/, "");
        var level = 0;
        while (aPath.indexOf(aRoot + "/") !== 0) {
          var index = aRoot.lastIndexOf("/");
          if (index < 0) {
            return aPath;
          }
          aRoot = aRoot.slice(0, index);
          if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
            return aPath;
          }
          ++level;
        }
        return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
      }
      exports2.relative = relative;
      var supportsNullProto = function() {
        var obj = /* @__PURE__ */ Object.create(null);
        return !("__proto__" in obj);
      }();
      function identity(s) {
        return s;
      }
      function toSetString(aStr) {
        if (isProtoString(aStr)) {
          return "$" + aStr;
        }
        return aStr;
      }
      exports2.toSetString = supportsNullProto ? identity : toSetString;
      function fromSetString(aStr) {
        if (isProtoString(aStr)) {
          return aStr.slice(1);
        }
        return aStr;
      }
      exports2.fromSetString = supportsNullProto ? identity : fromSetString;
      function isProtoString(s) {
        if (!s) {
          return false;
        }
        var length = s.length;
        if (length < 9) {
          return false;
        }
        if (s.charCodeAt(length - 1) !== 95 || s.charCodeAt(length - 2) !== 95 || s.charCodeAt(length - 3) !== 111 || s.charCodeAt(length - 4) !== 116 || s.charCodeAt(length - 5) !== 111 || s.charCodeAt(length - 6) !== 114 || s.charCodeAt(length - 7) !== 112 || s.charCodeAt(length - 8) !== 95 || s.charCodeAt(length - 9) !== 95) {
          return false;
        }
        for (var i = length - 10; i >= 0; i--) {
          if (s.charCodeAt(i) !== 36) {
            return false;
          }
        }
        return true;
      }
      function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
        var cmp = strcmp(mappingA.source, mappingB.source);
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.originalLine - mappingB.originalLine;
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.originalColumn - mappingB.originalColumn;
        if (cmp !== 0 || onlyCompareOriginal) {
          return cmp;
        }
        cmp = mappingA.generatedColumn - mappingB.generatedColumn;
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.generatedLine - mappingB.generatedLine;
        if (cmp !== 0) {
          return cmp;
        }
        return strcmp(mappingA.name, mappingB.name);
      }
      exports2.compareByOriginalPositions = compareByOriginalPositions;
      function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
        var cmp = mappingA.generatedLine - mappingB.generatedLine;
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.generatedColumn - mappingB.generatedColumn;
        if (cmp !== 0 || onlyCompareGenerated) {
          return cmp;
        }
        cmp = strcmp(mappingA.source, mappingB.source);
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.originalLine - mappingB.originalLine;
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.originalColumn - mappingB.originalColumn;
        if (cmp !== 0) {
          return cmp;
        }
        return strcmp(mappingA.name, mappingB.name);
      }
      exports2.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;
      function strcmp(aStr1, aStr2) {
        if (aStr1 === aStr2) {
          return 0;
        }
        if (aStr1 === null) {
          return 1;
        }
        if (aStr2 === null) {
          return -1;
        }
        if (aStr1 > aStr2) {
          return 1;
        }
        return -1;
      }
      function compareByGeneratedPositionsInflated(mappingA, mappingB) {
        var cmp = mappingA.generatedLine - mappingB.generatedLine;
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.generatedColumn - mappingB.generatedColumn;
        if (cmp !== 0) {
          return cmp;
        }
        cmp = strcmp(mappingA.source, mappingB.source);
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.originalLine - mappingB.originalLine;
        if (cmp !== 0) {
          return cmp;
        }
        cmp = mappingA.originalColumn - mappingB.originalColumn;
        if (cmp !== 0) {
          return cmp;
        }
        return strcmp(mappingA.name, mappingB.name);
      }
      exports2.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;
      function parseSourceMapInput(str) {
        return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ""));
      }
      exports2.parseSourceMapInput = parseSourceMapInput;
      function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
        sourceURL = sourceURL || "";
        if (sourceRoot) {
          if (sourceRoot[sourceRoot.length - 1] !== "/" && sourceURL[0] !== "/") {
            sourceRoot += "/";
          }
          sourceURL = sourceRoot + sourceURL;
        }
        if (sourceMapURL) {
          var parsed = urlParse(sourceMapURL);
          if (!parsed) {
            throw new Error("sourceMapURL could not be parsed");
          }
          if (parsed.path) {
            var index = parsed.path.lastIndexOf("/");
            if (index >= 0) {
              parsed.path = parsed.path.substring(0, index + 1);
            }
          }
          sourceURL = join2(urlGenerate(parsed), sourceURL);
        }
        return normalize(sourceURL);
      }
      exports2.computeSourceURL = computeSourceURL;
    });
    var require_array_set = __commonJS2((exports2) => {
      var util = require_util();
      var has = Object.prototype.hasOwnProperty;
      var hasNativeMap = typeof Map !== "undefined";
      function ArraySet() {
        this._array = [];
        this._set = hasNativeMap ? /* @__PURE__ */ new Map() : /* @__PURE__ */ Object.create(null);
      }
      ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
        var set = new ArraySet();
        for (var i = 0, len = aArray.length; i < len; i++) {
          set.add(aArray[i], aAllowDuplicates);
        }
        return set;
      };
      ArraySet.prototype.size = function ArraySet_size() {
        return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
      };
      ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
        var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
        var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
        var idx = this._array.length;
        if (!isDuplicate || aAllowDuplicates) {
          this._array.push(aStr);
        }
        if (!isDuplicate) {
          if (hasNativeMap) {
            this._set.set(aStr, idx);
          } else {
            this._set[sStr] = idx;
          }
        }
      };
      ArraySet.prototype.has = function ArraySet_has(aStr) {
        if (hasNativeMap) {
          return this._set.has(aStr);
        } else {
          var sStr = util.toSetString(aStr);
          return has.call(this._set, sStr);
        }
      };
      ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
        if (hasNativeMap) {
          var idx = this._set.get(aStr);
          if (idx >= 0) {
            return idx;
          }
        } else {
          var sStr = util.toSetString(aStr);
          if (has.call(this._set, sStr)) {
            return this._set[sStr];
          }
        }
        throw new Error('"' + aStr + '" is not in the set.');
      };
      ArraySet.prototype.at = function ArraySet_at(aIdx) {
        if (aIdx >= 0 && aIdx < this._array.length) {
          return this._array[aIdx];
        }
        throw new Error("No element indexed by " + aIdx);
      };
      ArraySet.prototype.toArray = function ArraySet_toArray() {
        return this._array.slice();
      };
      exports2.ArraySet = ArraySet;
    });
    var require_mapping_list = __commonJS2((exports2) => {
      var util = require_util();
      function generatedPositionAfter(mappingA, mappingB) {
        var lineA = mappingA.generatedLine;
        var lineB = mappingB.generatedLine;
        var columnA = mappingA.generatedColumn;
        var columnB = mappingB.generatedColumn;
        return lineB > lineA || lineB == lineA && columnB >= columnA || util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
      }
      function MappingList() {
        this._array = [];
        this._sorted = true;
        this._last = { generatedLine: -1, generatedColumn: 0 };
      }
      MappingList.prototype.unsortedForEach = function MappingList_forEach(aCallback, aThisArg) {
        this._array.forEach(aCallback, aThisArg);
      };
      MappingList.prototype.add = function MappingList_add(aMapping) {
        if (generatedPositionAfter(this._last, aMapping)) {
          this._last = aMapping;
          this._array.push(aMapping);
        } else {
          this._sorted = false;
          this._array.push(aMapping);
        }
      };
      MappingList.prototype.toArray = function MappingList_toArray() {
        if (!this._sorted) {
          this._array.sort(util.compareByGeneratedPositionsInflated);
          this._sorted = true;
        }
        return this._array;
      };
      exports2.MappingList = MappingList;
    });
    var require_source_map_generator = __commonJS2((exports2) => {
      var base64VLQ = require_base64_vlq();
      var util = require_util();
      var ArraySet = require_array_set().ArraySet;
      var MappingList = require_mapping_list().MappingList;
      function SourceMapGenerator(aArgs) {
        if (!aArgs) {
          aArgs = {};
        }
        this._file = util.getArg(aArgs, "file", null);
        this._sourceRoot = util.getArg(aArgs, "sourceRoot", null);
        this._skipValidation = util.getArg(aArgs, "skipValidation", false);
        this._sources = new ArraySet();
        this._names = new ArraySet();
        this._mappings = new MappingList();
        this._sourcesContents = null;
      }
      SourceMapGenerator.prototype._version = 3;
      SourceMapGenerator.fromSourceMap = function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
        var sourceRoot = aSourceMapConsumer.sourceRoot;
        var generator = new SourceMapGenerator({
          file: aSourceMapConsumer.file,
          sourceRoot
        });
        aSourceMapConsumer.eachMapping(function(mapping) {
          var newMapping = {
            generated: {
              line: mapping.generatedLine,
              column: mapping.generatedColumn
            }
          };
          if (mapping.source != null) {
            newMapping.source = mapping.source;
            if (sourceRoot != null) {
              newMapping.source = util.relative(sourceRoot, newMapping.source);
            }
            newMapping.original = {
              line: mapping.originalLine,
              column: mapping.originalColumn
            };
            if (mapping.name != null) {
              newMapping.name = mapping.name;
            }
          }
          generator.addMapping(newMapping);
        });
        aSourceMapConsumer.sources.forEach(function(sourceFile) {
          var sourceRelative = sourceFile;
          if (sourceRoot !== null) {
            sourceRelative = util.relative(sourceRoot, sourceFile);
          }
          if (!generator._sources.has(sourceRelative)) {
            generator._sources.add(sourceRelative);
          }
          var content = aSourceMapConsumer.sourceContentFor(sourceFile);
          if (content != null) {
            generator.setSourceContent(sourceFile, content);
          }
        });
        return generator;
      };
      SourceMapGenerator.prototype.addMapping = function SourceMapGenerator_addMapping(aArgs) {
        var generated = util.getArg(aArgs, "generated");
        var original = util.getArg(aArgs, "original", null);
        var source = util.getArg(aArgs, "source", null);
        var name = util.getArg(aArgs, "name", null);
        if (!this._skipValidation) {
          this._validateMapping(generated, original, source, name);
        }
        if (source != null) {
          source = String(source);
          if (!this._sources.has(source)) {
            this._sources.add(source);
          }
        }
        if (name != null) {
          name = String(name);
          if (!this._names.has(name)) {
            this._names.add(name);
          }
        }
        this._mappings.add({
          generatedLine: generated.line,
          generatedColumn: generated.column,
          originalLine: original != null && original.line,
          originalColumn: original != null && original.column,
          source,
          name
        });
      };
      SourceMapGenerator.prototype.setSourceContent = function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
        var source = aSourceFile;
        if (this._sourceRoot != null) {
          source = util.relative(this._sourceRoot, source);
        }
        if (aSourceContent != null) {
          if (!this._sourcesContents) {
            this._sourcesContents = /* @__PURE__ */ Object.create(null);
          }
          this._sourcesContents[util.toSetString(source)] = aSourceContent;
        } else if (this._sourcesContents) {
          delete this._sourcesContents[util.toSetString(source)];
          if (Object.keys(this._sourcesContents).length === 0) {
            this._sourcesContents = null;
          }
        }
      };
      SourceMapGenerator.prototype.applySourceMap = function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
        var sourceFile = aSourceFile;
        if (aSourceFile == null) {
          if (aSourceMapConsumer.file == null) {
            throw new Error(`SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map's "file" property. Both were omitted.`);
          }
          sourceFile = aSourceMapConsumer.file;
        }
        var sourceRoot = this._sourceRoot;
        if (sourceRoot != null) {
          sourceFile = util.relative(sourceRoot, sourceFile);
        }
        var newSources = new ArraySet();
        var newNames = new ArraySet();
        this._mappings.unsortedForEach(function(mapping) {
          if (mapping.source === sourceFile && mapping.originalLine != null) {
            var original = aSourceMapConsumer.originalPositionFor({
              line: mapping.originalLine,
              column: mapping.originalColumn
            });
            if (original.source != null) {
              mapping.source = original.source;
              if (aSourceMapPath != null) {
                mapping.source = util.join(aSourceMapPath, mapping.source);
              }
              if (sourceRoot != null) {
                mapping.source = util.relative(sourceRoot, mapping.source);
              }
              mapping.originalLine = original.line;
              mapping.originalColumn = original.column;
              if (original.name != null) {
                mapping.name = original.name;
              }
            }
          }
          var source = mapping.source;
          if (source != null && !newSources.has(source)) {
            newSources.add(source);
          }
          var name = mapping.name;
          if (name != null && !newNames.has(name)) {
            newNames.add(name);
          }
        }, this);
        this._sources = newSources;
        this._names = newNames;
        aSourceMapConsumer.sources.forEach(function(sourceFile2) {
          var content = aSourceMapConsumer.sourceContentFor(sourceFile2);
          if (content != null) {
            if (aSourceMapPath != null) {
              sourceFile2 = util.join(aSourceMapPath, sourceFile2);
            }
            if (sourceRoot != null) {
              sourceFile2 = util.relative(sourceRoot, sourceFile2);
            }
            this.setSourceContent(sourceFile2, content);
          }
        }, this);
      };
      SourceMapGenerator.prototype._validateMapping = function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource, aName) {
        if (aOriginal && typeof aOriginal.line !== "number" && typeof aOriginal.column !== "number") {
          throw new Error("original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.");
        }
        if (aGenerated && "line" in aGenerated && "column" in aGenerated && aGenerated.line > 0 && aGenerated.column >= 0 && !aOriginal && !aSource && !aName) {
          return;
        } else if (aGenerated && "line" in aGenerated && "column" in aGenerated && aOriginal && "line" in aOriginal && "column" in aOriginal && aGenerated.line > 0 && aGenerated.column >= 0 && aOriginal.line > 0 && aOriginal.column >= 0 && aSource) {
          return;
        } else {
          throw new Error("Invalid mapping: " + JSON.stringify({
            generated: aGenerated,
            source: aSource,
            original: aOriginal,
            name: aName
          }));
        }
      };
      SourceMapGenerator.prototype._serializeMappings = function SourceMapGenerator_serializeMappings() {
        var previousGeneratedColumn = 0;
        var previousGeneratedLine = 1;
        var previousOriginalColumn = 0;
        var previousOriginalLine = 0;
        var previousName = 0;
        var previousSource = 0;
        var result = "";
        var next;
        var mapping;
        var nameIdx;
        var sourceIdx;
        var mappings = this._mappings.toArray();
        for (var i = 0, len = mappings.length; i < len; i++) {
          mapping = mappings[i];
          next = "";
          if (mapping.generatedLine !== previousGeneratedLine) {
            previousGeneratedColumn = 0;
            while (mapping.generatedLine !== previousGeneratedLine) {
              next += ";";
              previousGeneratedLine++;
            }
          } else {
            if (i > 0) {
              if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
                continue;
              }
              next += ",";
            }
          }
          next += base64VLQ.encode(mapping.generatedColumn - previousGeneratedColumn);
          previousGeneratedColumn = mapping.generatedColumn;
          if (mapping.source != null) {
            sourceIdx = this._sources.indexOf(mapping.source);
            next += base64VLQ.encode(sourceIdx - previousSource);
            previousSource = sourceIdx;
            next += base64VLQ.encode(mapping.originalLine - 1 - previousOriginalLine);
            previousOriginalLine = mapping.originalLine - 1;
            next += base64VLQ.encode(mapping.originalColumn - previousOriginalColumn);
            previousOriginalColumn = mapping.originalColumn;
            if (mapping.name != null) {
              nameIdx = this._names.indexOf(mapping.name);
              next += base64VLQ.encode(nameIdx - previousName);
              previousName = nameIdx;
            }
          }
          result += next;
        }
        return result;
      };
      SourceMapGenerator.prototype._generateSourcesContent = function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
        return aSources.map(function(source) {
          if (!this._sourcesContents) {
            return null;
          }
          if (aSourceRoot != null) {
            source = util.relative(aSourceRoot, source);
          }
          var key = util.toSetString(source);
          return Object.prototype.hasOwnProperty.call(this._sourcesContents, key) ? this._sourcesContents[key] : null;
        }, this);
      };
      SourceMapGenerator.prototype.toJSON = function SourceMapGenerator_toJSON() {
        var map2 = {
          version: this._version,
          sources: this._sources.toArray(),
          names: this._names.toArray(),
          mappings: this._serializeMappings()
        };
        if (this._file != null) {
          map2.file = this._file;
        }
        if (this._sourceRoot != null) {
          map2.sourceRoot = this._sourceRoot;
        }
        if (this._sourcesContents) {
          map2.sourcesContent = this._generateSourcesContent(map2.sources, map2.sourceRoot);
        }
        return map2;
      };
      SourceMapGenerator.prototype.toString = function SourceMapGenerator_toString() {
        return JSON.stringify(this.toJSON());
      };
      exports2.SourceMapGenerator = SourceMapGenerator;
    });
    var require_binary_search = __commonJS2((exports2) => {
      exports2.GREATEST_LOWER_BOUND = 1;
      exports2.LEAST_UPPER_BOUND = 2;
      function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
        var mid = Math.floor((aHigh - aLow) / 2) + aLow;
        var cmp = aCompare(aNeedle, aHaystack[mid], true);
        if (cmp === 0) {
          return mid;
        } else if (cmp > 0) {
          if (aHigh - mid > 1) {
            return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
          }
          if (aBias == exports2.LEAST_UPPER_BOUND) {
            return aHigh < aHaystack.length ? aHigh : -1;
          } else {
            return mid;
          }
        } else {
          if (mid - aLow > 1) {
            return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
          }
          if (aBias == exports2.LEAST_UPPER_BOUND) {
            return mid;
          } else {
            return aLow < 0 ? -1 : aLow;
          }
        }
      }
      exports2.search = function search(aNeedle, aHaystack, aCompare, aBias) {
        if (aHaystack.length === 0) {
          return -1;
        }
        var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack, aCompare, aBias || exports2.GREATEST_LOWER_BOUND);
        if (index < 0) {
          return -1;
        }
        while (index - 1 >= 0) {
          if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
            break;
          }
          --index;
        }
        return index;
      };
    });
    var require_quick_sort = __commonJS2((exports2) => {
      function swap(ary, x, y) {
        var temp = ary[x];
        ary[x] = ary[y];
        ary[y] = temp;
      }
      function randomIntInRange(low, high) {
        return Math.round(low + Math.random() * (high - low));
      }
      function doQuickSort(ary, comparator, p, r) {
        if (p < r) {
          var pivotIndex = randomIntInRange(p, r);
          var i = p - 1;
          swap(ary, pivotIndex, r);
          var pivot = ary[r];
          for (var j = p; j < r; j++) {
            if (comparator(ary[j], pivot) <= 0) {
              i += 1;
              swap(ary, i, j);
            }
          }
          swap(ary, i + 1, j);
          var q = i + 1;
          doQuickSort(ary, comparator, p, q - 1);
          doQuickSort(ary, comparator, q + 1, r);
        }
      }
      exports2.quickSort = function(ary, comparator) {
        doQuickSort(ary, comparator, 0, ary.length - 1);
      };
    });
    var require_source_map_consumer = __commonJS2((exports2) => {
      var util = require_util();
      var binarySearch = require_binary_search();
      var ArraySet = require_array_set().ArraySet;
      var base64VLQ = require_base64_vlq();
      var quickSort = require_quick_sort().quickSort;
      function SourceMapConsumer(aSourceMap, aSourceMapURL) {
        var sourceMap = aSourceMap;
        if (typeof aSourceMap === "string") {
          sourceMap = util.parseSourceMapInput(aSourceMap);
        }
        return sourceMap.sections != null ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL) : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
      }
      SourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
        return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
      };
      SourceMapConsumer.prototype._version = 3;
      SourceMapConsumer.prototype.__generatedMappings = null;
      Object.defineProperty(SourceMapConsumer.prototype, "_generatedMappings", {
        configurable: true,
        enumerable: true,
        get: function() {
          if (!this.__generatedMappings) {
            this._parseMappings(this._mappings, this.sourceRoot);
          }
          return this.__generatedMappings;
        }
      });
      SourceMapConsumer.prototype.__originalMappings = null;
      Object.defineProperty(SourceMapConsumer.prototype, "_originalMappings", {
        configurable: true,
        enumerable: true,
        get: function() {
          if (!this.__originalMappings) {
            this._parseMappings(this._mappings, this.sourceRoot);
          }
          return this.__originalMappings;
        }
      });
      SourceMapConsumer.prototype._charIsMappingSeparator = function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
        var c = aStr.charAt(index);
        return c === ";" || c === ",";
      };
      SourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
        throw new Error("Subclasses must implement _parseMappings");
      };
      SourceMapConsumer.GENERATED_ORDER = 1;
      SourceMapConsumer.ORIGINAL_ORDER = 2;
      SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
      SourceMapConsumer.LEAST_UPPER_BOUND = 2;
      SourceMapConsumer.prototype.eachMapping = function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
        var context = aContext || null;
        var order = aOrder || SourceMapConsumer.GENERATED_ORDER;
        var mappings;
        switch (order) {
          case SourceMapConsumer.GENERATED_ORDER:
            mappings = this._generatedMappings;
            break;
          case SourceMapConsumer.ORIGINAL_ORDER:
            mappings = this._originalMappings;
            break;
          default:
            throw new Error("Unknown order of iteration.");
        }
        var sourceRoot = this.sourceRoot;
        mappings.map(function(mapping) {
          var source = mapping.source === null ? null : this._sources.at(mapping.source);
          source = util.computeSourceURL(sourceRoot, source, this._sourceMapURL);
          return {
            source,
            generatedLine: mapping.generatedLine,
            generatedColumn: mapping.generatedColumn,
            originalLine: mapping.originalLine,
            originalColumn: mapping.originalColumn,
            name: mapping.name === null ? null : this._names.at(mapping.name)
          };
        }, this).forEach(aCallback, context);
      };
      SourceMapConsumer.prototype.allGeneratedPositionsFor = function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
        var line = util.getArg(aArgs, "line");
        var needle = {
          source: util.getArg(aArgs, "source"),
          originalLine: line,
          originalColumn: util.getArg(aArgs, "column", 0)
        };
        needle.source = this._findSourceIndex(needle.source);
        if (needle.source < 0) {
          return [];
        }
        var mappings = [];
        var index = this._findMapping(needle, this._originalMappings, "originalLine", "originalColumn", util.compareByOriginalPositions, binarySearch.LEAST_UPPER_BOUND);
        if (index >= 0) {
          var mapping = this._originalMappings[index];
          if (aArgs.column === void 0) {
            var originalLine = mapping.originalLine;
            while (mapping && mapping.originalLine === originalLine) {
              mappings.push({
                line: util.getArg(mapping, "generatedLine", null),
                column: util.getArg(mapping, "generatedColumn", null),
                lastColumn: util.getArg(mapping, "lastGeneratedColumn", null)
              });
              mapping = this._originalMappings[++index];
            }
          } else {
            var originalColumn = mapping.originalColumn;
            while (mapping && mapping.originalLine === line && mapping.originalColumn == originalColumn) {
              mappings.push({
                line: util.getArg(mapping, "generatedLine", null),
                column: util.getArg(mapping, "generatedColumn", null),
                lastColumn: util.getArg(mapping, "lastGeneratedColumn", null)
              });
              mapping = this._originalMappings[++index];
            }
          }
        }
        return mappings;
      };
      exports2.SourceMapConsumer = SourceMapConsumer;
      function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
        var sourceMap = aSourceMap;
        if (typeof aSourceMap === "string") {
          sourceMap = util.parseSourceMapInput(aSourceMap);
        }
        var version = util.getArg(sourceMap, "version");
        var sources = util.getArg(sourceMap, "sources");
        var names = util.getArg(sourceMap, "names", []);
        var sourceRoot = util.getArg(sourceMap, "sourceRoot", null);
        var sourcesContent = util.getArg(sourceMap, "sourcesContent", null);
        var mappings = util.getArg(sourceMap, "mappings");
        var file = util.getArg(sourceMap, "file", null);
        if (version != this._version) {
          throw new Error("Unsupported version: " + version);
        }
        if (sourceRoot) {
          sourceRoot = util.normalize(sourceRoot);
        }
        sources = sources.map(String).map(util.normalize).map(function(source) {
          return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source) ? util.relative(sourceRoot, source) : source;
        });
        this._names = ArraySet.fromArray(names.map(String), true);
        this._sources = ArraySet.fromArray(sources, true);
        this._absoluteSources = this._sources.toArray().map(function(s) {
          return util.computeSourceURL(sourceRoot, s, aSourceMapURL);
        });
        this.sourceRoot = sourceRoot;
        this.sourcesContent = sourcesContent;
        this._mappings = mappings;
        this._sourceMapURL = aSourceMapURL;
        this.file = file;
      }
      BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
      BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;
      BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
        var relativeSource = aSource;
        if (this.sourceRoot != null) {
          relativeSource = util.relative(this.sourceRoot, relativeSource);
        }
        if (this._sources.has(relativeSource)) {
          return this._sources.indexOf(relativeSource);
        }
        var i;
        for (i = 0; i < this._absoluteSources.length; ++i) {
          if (this._absoluteSources[i] == aSource) {
            return i;
          }
        }
        return -1;
      };
      BasicSourceMapConsumer.fromSourceMap = function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
        var smc = Object.create(BasicSourceMapConsumer.prototype);
        var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
        var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
        smc.sourceRoot = aSourceMap._sourceRoot;
        smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(), smc.sourceRoot);
        smc.file = aSourceMap._file;
        smc._sourceMapURL = aSourceMapURL;
        smc._absoluteSources = smc._sources.toArray().map(function(s) {
          return util.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
        });
        var generatedMappings = aSourceMap._mappings.toArray().slice();
        var destGeneratedMappings = smc.__generatedMappings = [];
        var destOriginalMappings = smc.__originalMappings = [];
        for (var i = 0, length = generatedMappings.length; i < length; i++) {
          var srcMapping = generatedMappings[i];
          var destMapping = new Mapping();
          destMapping.generatedLine = srcMapping.generatedLine;
          destMapping.generatedColumn = srcMapping.generatedColumn;
          if (srcMapping.source) {
            destMapping.source = sources.indexOf(srcMapping.source);
            destMapping.originalLine = srcMapping.originalLine;
            destMapping.originalColumn = srcMapping.originalColumn;
            if (srcMapping.name) {
              destMapping.name = names.indexOf(srcMapping.name);
            }
            destOriginalMappings.push(destMapping);
          }
          destGeneratedMappings.push(destMapping);
        }
        quickSort(smc.__originalMappings, util.compareByOriginalPositions);
        return smc;
      };
      BasicSourceMapConsumer.prototype._version = 3;
      Object.defineProperty(BasicSourceMapConsumer.prototype, "sources", {
        get: function() {
          return this._absoluteSources.slice();
        }
      });
      function Mapping() {
        this.generatedLine = 0;
        this.generatedColumn = 0;
        this.source = null;
        this.originalLine = null;
        this.originalColumn = null;
        this.name = null;
      }
      BasicSourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
        var generatedLine = 1;
        var previousGeneratedColumn = 0;
        var previousOriginalLine = 0;
        var previousOriginalColumn = 0;
        var previousSource = 0;
        var previousName = 0;
        var length = aStr.length;
        var index = 0;
        var cachedSegments = {};
        var temp = {};
        var originalMappings = [];
        var generatedMappings = [];
        var mapping, str, segment, end, value;
        while (index < length) {
          if (aStr.charAt(index) === ";") {
            generatedLine++;
            index++;
            previousGeneratedColumn = 0;
          } else if (aStr.charAt(index) === ",") {
            index++;
          } else {
            mapping = new Mapping();
            mapping.generatedLine = generatedLine;
            for (end = index; end < length; end++) {
              if (this._charIsMappingSeparator(aStr, end)) {
                break;
              }
            }
            str = aStr.slice(index, end);
            segment = cachedSegments[str];
            if (segment) {
              index += str.length;
            } else {
              segment = [];
              while (index < end) {
                base64VLQ.decode(aStr, index, temp);
                value = temp.value;
                index = temp.rest;
                segment.push(value);
              }
              if (segment.length === 2) {
                throw new Error("Found a source, but no line and column");
              }
              if (segment.length === 3) {
                throw new Error("Found a source and line, but no column");
              }
              cachedSegments[str] = segment;
            }
            mapping.generatedColumn = previousGeneratedColumn + segment[0];
            previousGeneratedColumn = mapping.generatedColumn;
            if (segment.length > 1) {
              mapping.source = previousSource + segment[1];
              previousSource += segment[1];
              mapping.originalLine = previousOriginalLine + segment[2];
              previousOriginalLine = mapping.originalLine;
              mapping.originalLine += 1;
              mapping.originalColumn = previousOriginalColumn + segment[3];
              previousOriginalColumn = mapping.originalColumn;
              if (segment.length > 4) {
                mapping.name = previousName + segment[4];
                previousName += segment[4];
              }
            }
            generatedMappings.push(mapping);
            if (typeof mapping.originalLine === "number") {
              originalMappings.push(mapping);
            }
          }
        }
        quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
        this.__generatedMappings = generatedMappings;
        quickSort(originalMappings, util.compareByOriginalPositions);
        this.__originalMappings = originalMappings;
      };
      BasicSourceMapConsumer.prototype._findMapping = function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName, aColumnName, aComparator, aBias) {
        if (aNeedle[aLineName] <= 0) {
          throw new TypeError("Line must be greater than or equal to 1, got " + aNeedle[aLineName]);
        }
        if (aNeedle[aColumnName] < 0) {
          throw new TypeError("Column must be greater than or equal to 0, got " + aNeedle[aColumnName]);
        }
        return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
      };
      BasicSourceMapConsumer.prototype.computeColumnSpans = function SourceMapConsumer_computeColumnSpans() {
        for (var index = 0; index < this._generatedMappings.length; ++index) {
          var mapping = this._generatedMappings[index];
          if (index + 1 < this._generatedMappings.length) {
            var nextMapping = this._generatedMappings[index + 1];
            if (mapping.generatedLine === nextMapping.generatedLine) {
              mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
              continue;
            }
          }
          mapping.lastGeneratedColumn = Infinity;
        }
      };
      BasicSourceMapConsumer.prototype.originalPositionFor = function SourceMapConsumer_originalPositionFor(aArgs) {
        var needle = {
          generatedLine: util.getArg(aArgs, "line"),
          generatedColumn: util.getArg(aArgs, "column")
        };
        var index = this._findMapping(needle, this._generatedMappings, "generatedLine", "generatedColumn", util.compareByGeneratedPositionsDeflated, util.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND));
        if (index >= 0) {
          var mapping = this._generatedMappings[index];
          if (mapping.generatedLine === needle.generatedLine) {
            var source = util.getArg(mapping, "source", null);
            if (source !== null) {
              source = this._sources.at(source);
              source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
            }
            var name = util.getArg(mapping, "name", null);
            if (name !== null) {
              name = this._names.at(name);
            }
            return {
              source,
              line: util.getArg(mapping, "originalLine", null),
              column: util.getArg(mapping, "originalColumn", null),
              name
            };
          }
        }
        return {
          source: null,
          line: null,
          column: null,
          name: null
        };
      };
      BasicSourceMapConsumer.prototype.hasContentsOfAllSources = function BasicSourceMapConsumer_hasContentsOfAllSources() {
        if (!this.sourcesContent) {
          return false;
        }
        return this.sourcesContent.length >= this._sources.size() && !this.sourcesContent.some(function(sc) {
          return sc == null;
        });
      };
      BasicSourceMapConsumer.prototype.sourceContentFor = function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
        if (!this.sourcesContent) {
          return null;
        }
        var index = this._findSourceIndex(aSource);
        if (index >= 0) {
          return this.sourcesContent[index];
        }
        var relativeSource = aSource;
        if (this.sourceRoot != null) {
          relativeSource = util.relative(this.sourceRoot, relativeSource);
        }
        var url;
        if (this.sourceRoot != null && (url = util.urlParse(this.sourceRoot))) {
          var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
          if (url.scheme == "file" && this._sources.has(fileUriAbsPath)) {
            return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)];
          }
          if ((!url.path || url.path == "/") && this._sources.has("/" + relativeSource)) {
            return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
          }
        }
        if (nullOnMissing) {
          return null;
        } else {
          throw new Error('"' + relativeSource + '" is not in the SourceMap.');
        }
      };
      BasicSourceMapConsumer.prototype.generatedPositionFor = function SourceMapConsumer_generatedPositionFor(aArgs) {
        var source = util.getArg(aArgs, "source");
        source = this._findSourceIndex(source);
        if (source < 0) {
          return {
            line: null,
            column: null,
            lastColumn: null
          };
        }
        var needle = {
          source,
          originalLine: util.getArg(aArgs, "line"),
          originalColumn: util.getArg(aArgs, "column")
        };
        var index = this._findMapping(needle, this._originalMappings, "originalLine", "originalColumn", util.compareByOriginalPositions, util.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND));
        if (index >= 0) {
          var mapping = this._originalMappings[index];
          if (mapping.source === needle.source) {
            return {
              line: util.getArg(mapping, "generatedLine", null),
              column: util.getArg(mapping, "generatedColumn", null),
              lastColumn: util.getArg(mapping, "lastGeneratedColumn", null)
            };
          }
        }
        return {
          line: null,
          column: null,
          lastColumn: null
        };
      };
      exports2.BasicSourceMapConsumer = BasicSourceMapConsumer;
      function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
        var sourceMap = aSourceMap;
        if (typeof aSourceMap === "string") {
          sourceMap = util.parseSourceMapInput(aSourceMap);
        }
        var version = util.getArg(sourceMap, "version");
        var sections = util.getArg(sourceMap, "sections");
        if (version != this._version) {
          throw new Error("Unsupported version: " + version);
        }
        this._sources = new ArraySet();
        this._names = new ArraySet();
        var lastOffset = {
          line: -1,
          column: 0
        };
        this._sections = sections.map(function(s) {
          if (s.url) {
            throw new Error("Support for url field in sections not implemented.");
          }
          var offset = util.getArg(s, "offset");
          var offsetLine = util.getArg(offset, "line");
          var offsetColumn = util.getArg(offset, "column");
          if (offsetLine < lastOffset.line || offsetLine === lastOffset.line && offsetColumn < lastOffset.column) {
            throw new Error("Section offsets must be ordered and non-overlapping.");
          }
          lastOffset = offset;
          return {
            generatedOffset: {
              generatedLine: offsetLine + 1,
              generatedColumn: offsetColumn + 1
            },
            consumer: new SourceMapConsumer(util.getArg(s, "map"), aSourceMapURL)
          };
        });
      }
      IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
      IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;
      IndexedSourceMapConsumer.prototype._version = 3;
      Object.defineProperty(IndexedSourceMapConsumer.prototype, "sources", {
        get: function() {
          var sources = [];
          for (var i = 0; i < this._sections.length; i++) {
            for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
              sources.push(this._sections[i].consumer.sources[j]);
            }
          }
          return sources;
        }
      });
      IndexedSourceMapConsumer.prototype.originalPositionFor = function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
        var needle = {
          generatedLine: util.getArg(aArgs, "line"),
          generatedColumn: util.getArg(aArgs, "column")
        };
        var sectionIndex = binarySearch.search(needle, this._sections, function(needle2, section2) {
          var cmp = needle2.generatedLine - section2.generatedOffset.generatedLine;
          if (cmp) {
            return cmp;
          }
          return needle2.generatedColumn - section2.generatedOffset.generatedColumn;
        });
        var section = this._sections[sectionIndex];
        if (!section) {
          return {
            source: null,
            line: null,
            column: null,
            name: null
          };
        }
        return section.consumer.originalPositionFor({
          line: needle.generatedLine - (section.generatedOffset.generatedLine - 1),
          column: needle.generatedColumn - (section.generatedOffset.generatedLine === needle.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
          bias: aArgs.bias
        });
      };
      IndexedSourceMapConsumer.prototype.hasContentsOfAllSources = function IndexedSourceMapConsumer_hasContentsOfAllSources() {
        return this._sections.every(function(s) {
          return s.consumer.hasContentsOfAllSources();
        });
      };
      IndexedSourceMapConsumer.prototype.sourceContentFor = function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
        for (var i = 0; i < this._sections.length; i++) {
          var section = this._sections[i];
          var content = section.consumer.sourceContentFor(aSource, true);
          if (content) {
            return content;
          }
        }
        if (nullOnMissing) {
          return null;
        } else {
          throw new Error('"' + aSource + '" is not in the SourceMap.');
        }
      };
      IndexedSourceMapConsumer.prototype.generatedPositionFor = function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
        for (var i = 0; i < this._sections.length; i++) {
          var section = this._sections[i];
          if (section.consumer._findSourceIndex(util.getArg(aArgs, "source")) === -1) {
            continue;
          }
          var generatedPosition = section.consumer.generatedPositionFor(aArgs);
          if (generatedPosition) {
            var ret = {
              line: generatedPosition.line + (section.generatedOffset.generatedLine - 1),
              column: generatedPosition.column + (section.generatedOffset.generatedLine === generatedPosition.line ? section.generatedOffset.generatedColumn - 1 : 0)
            };
            return ret;
          }
        }
        return {
          line: null,
          column: null
        };
      };
      IndexedSourceMapConsumer.prototype._parseMappings = function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
        this.__generatedMappings = [];
        this.__originalMappings = [];
        for (var i = 0; i < this._sections.length; i++) {
          var section = this._sections[i];
          var sectionMappings = section.consumer._generatedMappings;
          for (var j = 0; j < sectionMappings.length; j++) {
            var mapping = sectionMappings[j];
            var source = section.consumer._sources.at(mapping.source);
            source = util.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);
            this._sources.add(source);
            source = this._sources.indexOf(source);
            var name = null;
            if (mapping.name) {
              name = section.consumer._names.at(mapping.name);
              this._names.add(name);
              name = this._names.indexOf(name);
            }
            var adjustedMapping = {
              source,
              generatedLine: mapping.generatedLine + (section.generatedOffset.generatedLine - 1),
              generatedColumn: mapping.generatedColumn + (section.generatedOffset.generatedLine === mapping.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
              originalLine: mapping.originalLine,
              originalColumn: mapping.originalColumn,
              name
            };
            this.__generatedMappings.push(adjustedMapping);
            if (typeof adjustedMapping.originalLine === "number") {
              this.__originalMappings.push(adjustedMapping);
            }
          }
        }
        quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
        quickSort(this.__originalMappings, util.compareByOriginalPositions);
      };
      exports2.IndexedSourceMapConsumer = IndexedSourceMapConsumer;
    });
    var require_source_node = __commonJS2((exports2) => {
      var SourceMapGenerator = require_source_map_generator().SourceMapGenerator;
      var util = require_util();
      var REGEX_NEWLINE = /(\r?\n)/;
      var NEWLINE_CODE = 10;
      var isSourceNode = "$$$isSourceNode$$$";
      function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
        this.children = [];
        this.sourceContents = {};
        this.line = aLine == null ? null : aLine;
        this.column = aColumn == null ? null : aColumn;
        this.source = aSource == null ? null : aSource;
        this.name = aName == null ? null : aName;
        this[isSourceNode] = true;
        if (aChunks != null)
          this.add(aChunks);
      }
      SourceNode.fromStringWithSourceMap = function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
        var node = new SourceNode();
        var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
        var remainingLinesIndex = 0;
        var shiftNextLine = function() {
          var lineContents = getNextLine();
          var newLine = getNextLine() || "";
          return lineContents + newLine;
          function getNextLine() {
            return remainingLinesIndex < remainingLines.length ? remainingLines[remainingLinesIndex++] : void 0;
          }
        };
        var lastGeneratedLine = 1, lastGeneratedColumn = 0;
        var lastMapping = null;
        aSourceMapConsumer.eachMapping(function(mapping) {
          if (lastMapping !== null) {
            if (lastGeneratedLine < mapping.generatedLine) {
              addMappingWithCode(lastMapping, shiftNextLine());
              lastGeneratedLine++;
              lastGeneratedColumn = 0;
            } else {
              var nextLine = remainingLines[remainingLinesIndex] || "";
              var code = nextLine.substr(0, mapping.generatedColumn - lastGeneratedColumn);
              remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn - lastGeneratedColumn);
              lastGeneratedColumn = mapping.generatedColumn;
              addMappingWithCode(lastMapping, code);
              lastMapping = mapping;
              return;
            }
          }
          while (lastGeneratedLine < mapping.generatedLine) {
            node.add(shiftNextLine());
            lastGeneratedLine++;
          }
          if (lastGeneratedColumn < mapping.generatedColumn) {
            var nextLine = remainingLines[remainingLinesIndex] || "";
            node.add(nextLine.substr(0, mapping.generatedColumn));
            remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn);
            lastGeneratedColumn = mapping.generatedColumn;
          }
          lastMapping = mapping;
        }, this);
        if (remainingLinesIndex < remainingLines.length) {
          if (lastMapping) {
            addMappingWithCode(lastMapping, shiftNextLine());
          }
          node.add(remainingLines.splice(remainingLinesIndex).join(""));
        }
        aSourceMapConsumer.sources.forEach(function(sourceFile) {
          var content = aSourceMapConsumer.sourceContentFor(sourceFile);
          if (content != null) {
            if (aRelativePath != null) {
              sourceFile = util.join(aRelativePath, sourceFile);
            }
            node.setSourceContent(sourceFile, content);
          }
        });
        return node;
        function addMappingWithCode(mapping, code) {
          if (mapping === null || mapping.source === void 0) {
            node.add(code);
          } else {
            var source = aRelativePath ? util.join(aRelativePath, mapping.source) : mapping.source;
            node.add(new SourceNode(mapping.originalLine, mapping.originalColumn, source, code, mapping.name));
          }
        }
      };
      SourceNode.prototype.add = function SourceNode_add(aChunk) {
        if (Array.isArray(aChunk)) {
          aChunk.forEach(function(chunk) {
            this.add(chunk);
          }, this);
        } else if (aChunk[isSourceNode] || typeof aChunk === "string") {
          if (aChunk) {
            this.children.push(aChunk);
          }
        } else {
          throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk);
        }
        return this;
      };
      SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
        if (Array.isArray(aChunk)) {
          for (var i = aChunk.length - 1; i >= 0; i--) {
            this.prepend(aChunk[i]);
          }
        } else if (aChunk[isSourceNode] || typeof aChunk === "string") {
          this.children.unshift(aChunk);
        } else {
          throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk);
        }
        return this;
      };
      SourceNode.prototype.walk = function SourceNode_walk(aFn) {
        var chunk;
        for (var i = 0, len = this.children.length; i < len; i++) {
          chunk = this.children[i];
          if (chunk[isSourceNode]) {
            chunk.walk(aFn);
          } else {
            if (chunk !== "") {
              aFn(chunk, {
                source: this.source,
                line: this.line,
                column: this.column,
                name: this.name
              });
            }
          }
        }
      };
      SourceNode.prototype.join = function SourceNode_join(aSep) {
        var newChildren;
        var i;
        var len = this.children.length;
        if (len > 0) {
          newChildren = [];
          for (i = 0; i < len - 1; i++) {
            newChildren.push(this.children[i]);
            newChildren.push(aSep);
          }
          newChildren.push(this.children[i]);
          this.children = newChildren;
        }
        return this;
      };
      SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
        var lastChild = this.children[this.children.length - 1];
        if (lastChild[isSourceNode]) {
          lastChild.replaceRight(aPattern, aReplacement);
        } else if (typeof lastChild === "string") {
          this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
        } else {
          this.children.push("".replace(aPattern, aReplacement));
        }
        return this;
      };
      SourceNode.prototype.setSourceContent = function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
        this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
      };
      SourceNode.prototype.walkSourceContents = function SourceNode_walkSourceContents(aFn) {
        for (var i = 0, len = this.children.length; i < len; i++) {
          if (this.children[i][isSourceNode]) {
            this.children[i].walkSourceContents(aFn);
          }
        }
        var sources = Object.keys(this.sourceContents);
        for (var i = 0, len = sources.length; i < len; i++) {
          aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
        }
      };
      SourceNode.prototype.toString = function SourceNode_toString() {
        var str = "";
        this.walk(function(chunk) {
          str += chunk;
        });
        return str;
      };
      SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
        var generated = {
          code: "",
          line: 1,
          column: 0
        };
        var map2 = new SourceMapGenerator(aArgs);
        var sourceMappingActive = false;
        var lastOriginalSource = null;
        var lastOriginalLine = null;
        var lastOriginalColumn = null;
        var lastOriginalName = null;
        this.walk(function(chunk, original) {
          generated.code += chunk;
          if (original.source !== null && original.line !== null && original.column !== null) {
            if (lastOriginalSource !== original.source || lastOriginalLine !== original.line || lastOriginalColumn !== original.column || lastOriginalName !== original.name) {
              map2.addMapping({
                source: original.source,
                original: {
                  line: original.line,
                  column: original.column
                },
                generated: {
                  line: generated.line,
                  column: generated.column
                },
                name: original.name
              });
            }
            lastOriginalSource = original.source;
            lastOriginalLine = original.line;
            lastOriginalColumn = original.column;
            lastOriginalName = original.name;
            sourceMappingActive = true;
          } else if (sourceMappingActive) {
            map2.addMapping({
              generated: {
                line: generated.line,
                column: generated.column
              }
            });
            lastOriginalSource = null;
            sourceMappingActive = false;
          }
          for (var idx = 0, length = chunk.length; idx < length; idx++) {
            if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
              generated.line++;
              generated.column = 0;
              if (idx + 1 === length) {
                lastOriginalSource = null;
                sourceMappingActive = false;
              } else if (sourceMappingActive) {
                map2.addMapping({
                  source: original.source,
                  original: {
                    line: original.line,
                    column: original.column
                  },
                  generated: {
                    line: generated.line,
                    column: generated.column
                  },
                  name: original.name
                });
              }
            } else {
              generated.column++;
            }
          }
        });
        this.walkSourceContents(function(sourceFile, sourceContent) {
          map2.setSourceContent(sourceFile, sourceContent);
        });
        return { code: generated.code, map: map2 };
      };
      exports2.SourceNode = SourceNode;
    });
    var require_source_map = __commonJS2((exports2) => {
      exports2.SourceMapGenerator = require_source_map_generator().SourceMapGenerator;
      exports2.SourceMapConsumer = require_source_map_consumer().SourceMapConsumer;
      exports2.SourceNode = require_source_node().SourceNode;
    });
    var require_buffer_from = __commonJS2((exports2, module22) => {
      var toString = Object.prototype.toString;
      var isModern = typeof Buffer.alloc === "function" && typeof Buffer.allocUnsafe === "function" && typeof Buffer.from === "function";
      function isArrayBuffer(input) {
        return toString.call(input).slice(8, -1) === "ArrayBuffer";
      }
      function fromArrayBuffer(obj, byteOffset, length) {
        byteOffset >>>= 0;
        var maxLength = obj.byteLength - byteOffset;
        if (maxLength < 0) {
          throw new RangeError("'offset' is out of bounds");
        }
        if (length === void 0) {
          length = maxLength;
        } else {
          length >>>= 0;
          if (length > maxLength) {
            throw new RangeError("'length' is out of bounds");
          }
        }
        return isModern ? Buffer.from(obj.slice(byteOffset, byteOffset + length)) : new Buffer(new Uint8Array(obj.slice(byteOffset, byteOffset + length)));
      }
      function fromString(string, encoding) {
        if (typeof encoding !== "string" || encoding === "") {
          encoding = "utf8";
        }
        if (!Buffer.isEncoding(encoding)) {
          throw new TypeError('"encoding" must be a valid string encoding');
        }
        return isModern ? Buffer.from(string, encoding) : new Buffer(string, encoding);
      }
      function bufferFrom(value, encodingOrOffset, length) {
        if (typeof value === "number") {
          throw new TypeError('"value" argument must not be a number');
        }
        if (isArrayBuffer(value)) {
          return fromArrayBuffer(value, encodingOrOffset, length);
        }
        if (typeof value === "string") {
          return fromString(value, encodingOrOffset);
        }
        return isModern ? Buffer.from(value) : new Buffer(value);
      }
      module22.exports = bufferFrom;
    });
    var require_source_map_support = __commonJS2((exports2, module22) => {
      var SourceMapConsumer = require_source_map().SourceMapConsumer;
      var path2 = require("path");
      var fs3;
      try {
        fs3 = require("fs");
        if (!fs3.existsSync || !fs3.readFileSync) {
          fs3 = null;
        }
      } catch (err) {
      }
      var bufferFrom = require_buffer_from();
      function dynamicRequire(mod, request) {
        return mod.require(request);
      }
      var errorFormatterInstalled = false;
      var uncaughtShimInstalled = false;
      var emptyCacheBetweenOperations = false;
      var environment = "auto";
      var fileContentsCache = {};
      var sourceMapCache = {};
      var reSourceMap = /^data:application\/json[^,]+base64,/;
      var retrieveFileHandlers = [];
      var retrieveMapHandlers = [];
      function isInBrowser() {
        if (environment === "browser")
          return true;
        if (environment === "node")
          return false;
        return typeof window !== "undefined" && typeof XMLHttpRequest === "function" && !(window.require && window.module && window.process && window.process.type === "renderer");
      }
      function hasGlobalProcessEventEmitter() {
        return typeof process === "object" && process !== null && typeof process.on === "function";
      }
      function handlerExec(list) {
        return function(arg) {
          for (var i = 0; i < list.length; i++) {
            var ret = list[i](arg);
            if (ret) {
              return ret;
            }
          }
          return null;
        };
      }
      var retrieveFile = handlerExec(retrieveFileHandlers);
      retrieveFileHandlers.push(function(path22) {
        path22 = path22.trim();
        if (/^file:/.test(path22)) {
          path22 = path22.replace(/file:\/\/\/(\w:)?/, function(protocol, drive) {
            return drive ? "" : "/";
          });
        }
        if (path22 in fileContentsCache) {
          return fileContentsCache[path22];
        }
        var contents = "";
        try {
          if (!fs3) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", path22, false);
            xhr.send(null);
            if (xhr.readyState === 4 && xhr.status === 200) {
              contents = xhr.responseText;
            }
          } else if (fs3.existsSync(path22)) {
            contents = fs3.readFileSync(path22, "utf8");
          }
        } catch (er) {
        }
        return fileContentsCache[path22] = contents;
      });
      function supportRelativeURL(file, url) {
        if (!file)
          return url;
        var dir = path2.dirname(file);
        var match = /^\w+:\/\/[^\/]*/.exec(dir);
        var protocol = match ? match[0] : "";
        var startPath = dir.slice(protocol.length);
        if (protocol && /^\/\w\:/.test(startPath)) {
          protocol += "/";
          return protocol + path2.resolve(dir.slice(protocol.length), url).replace(/\\/g, "/");
        }
        return protocol + path2.resolve(dir.slice(protocol.length), url);
      }
      function retrieveSourceMapURL(source) {
        var fileData;
        if (isInBrowser()) {
          try {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", source, false);
            xhr.send(null);
            fileData = xhr.readyState === 4 ? xhr.responseText : null;
            var sourceMapHeader = xhr.getResponseHeader("SourceMap") || xhr.getResponseHeader("X-SourceMap");
            if (sourceMapHeader) {
              return sourceMapHeader;
            }
          } catch (e) {
          }
        }
        fileData = retrieveFile(source);
        var re = /(?:\/\/[@#][\s]*sourceMappingURL=([^\s'"]+)[\s]*$)|(?:\/\*[@#][\s]*sourceMappingURL=([^\s*'"]+)[\s]*(?:\*\/)[\s]*$)/mg;
        var lastMatch, match;
        while (match = re.exec(fileData))
          lastMatch = match;
        if (!lastMatch)
          return null;
        return lastMatch[1];
      }
      var retrieveSourceMap = handlerExec(retrieveMapHandlers);
      retrieveMapHandlers.push(function(source) {
        var sourceMappingURL = retrieveSourceMapURL(source);
        if (!sourceMappingURL)
          return null;
        var sourceMapData;
        if (reSourceMap.test(sourceMappingURL)) {
          var rawData = sourceMappingURL.slice(sourceMappingURL.indexOf(",") + 1);
          sourceMapData = bufferFrom(rawData, "base64").toString();
          sourceMappingURL = source;
        } else {
          sourceMappingURL = supportRelativeURL(source, sourceMappingURL);
          sourceMapData = retrieveFile(sourceMappingURL);
        }
        if (!sourceMapData) {
          return null;
        }
        return {
          url: sourceMappingURL,
          map: sourceMapData
        };
      });
      function mapSourcePosition(position) {
        var sourceMap = sourceMapCache[position.source];
        if (!sourceMap) {
          var urlAndMap = retrieveSourceMap(position.source);
          if (urlAndMap) {
            sourceMap = sourceMapCache[position.source] = {
              url: urlAndMap.url,
              map: new SourceMapConsumer(urlAndMap.map)
            };
            if (sourceMap.map.sourcesContent) {
              sourceMap.map.sources.forEach(function(source, i) {
                var contents = sourceMap.map.sourcesContent[i];
                if (contents) {
                  var url = supportRelativeURL(sourceMap.url, source);
                  fileContentsCache[url] = contents;
                }
              });
            }
          } else {
            sourceMap = sourceMapCache[position.source] = {
              url: null,
              map: null
            };
          }
        }
        if (sourceMap && sourceMap.map && typeof sourceMap.map.originalPositionFor === "function") {
          var originalPosition = sourceMap.map.originalPositionFor(position);
          if (originalPosition.source !== null) {
            originalPosition.source = supportRelativeURL(sourceMap.url, originalPosition.source);
            return originalPosition;
          }
        }
        return position;
      }
      function mapEvalOrigin(origin) {
        var match = /^eval at ([^(]+) \((.+):(\d+):(\d+)\)$/.exec(origin);
        if (match) {
          var position = mapSourcePosition({
            source: match[2],
            line: +match[3],
            column: match[4] - 1
          });
          return "eval at " + match[1] + " (" + position.source + ":" + position.line + ":" + (position.column + 1) + ")";
        }
        match = /^eval at ([^(]+) \((.+)\)$/.exec(origin);
        if (match) {
          return "eval at " + match[1] + " (" + mapEvalOrigin(match[2]) + ")";
        }
        return origin;
      }
      function CallSiteToString() {
        var fileName;
        var fileLocation = "";
        if (this.isNative()) {
          fileLocation = "native";
        } else {
          fileName = this.getScriptNameOrSourceURL();
          if (!fileName && this.isEval()) {
            fileLocation = this.getEvalOrigin();
            fileLocation += ", ";
          }
          if (fileName) {
            fileLocation += fileName;
          } else {
            fileLocation += "<anonymous>";
          }
          var lineNumber = this.getLineNumber();
          if (lineNumber != null) {
            fileLocation += ":" + lineNumber;
            var columnNumber = this.getColumnNumber();
            if (columnNumber) {
              fileLocation += ":" + columnNumber;
            }
          }
        }
        var line = "";
        var functionName = this.getFunctionName();
        var addSuffix = true;
        var isConstructor = this.isConstructor();
        var isMethodCall = !(this.isToplevel() || isConstructor);
        if (isMethodCall) {
          var typeName = this.getTypeName();
          if (typeName === "[object Object]") {
            typeName = "null";
          }
          var methodName = this.getMethodName();
          if (functionName) {
            if (typeName && functionName.indexOf(typeName) != 0) {
              line += typeName + ".";
            }
            line += functionName;
            if (methodName && functionName.indexOf("." + methodName) != functionName.length - methodName.length - 1) {
              line += " [as " + methodName + "]";
            }
          } else {
            line += typeName + "." + (methodName || "<anonymous>");
          }
        } else if (isConstructor) {
          line += "new " + (functionName || "<anonymous>");
        } else if (functionName) {
          line += functionName;
        } else {
          line += fileLocation;
          addSuffix = false;
        }
        if (addSuffix) {
          line += " (" + fileLocation + ")";
        }
        return line;
      }
      function cloneCallSite(frame) {
        var object = {};
        Object.getOwnPropertyNames(Object.getPrototypeOf(frame)).forEach(function(name) {
          object[name] = /^(?:is|get)/.test(name) ? function() {
            return frame[name].call(frame);
          } : frame[name];
        });
        object.toString = CallSiteToString;
        return object;
      }
      function wrapCallSite(frame, state) {
        if (state === void 0) {
          state = { nextPosition: null, curPosition: null };
        }
        if (frame.isNative()) {
          state.curPosition = null;
          return frame;
        }
        var source = frame.getFileName() || frame.getScriptNameOrSourceURL();
        if (source) {
          var line = frame.getLineNumber();
          var column = frame.getColumnNumber() - 1;
          var noHeader = /^v(10\.1[6-9]|10\.[2-9][0-9]|10\.[0-9]{3,}|1[2-9]\d*|[2-9]\d|\d{3,}|11\.11)/;
          var headerLength = noHeader.test(process.version) ? 0 : 62;
          if (line === 1 && column > headerLength && !isInBrowser() && !frame.isEval()) {
            column -= headerLength;
          }
          var position = mapSourcePosition({
            source,
            line,
            column
          });
          state.curPosition = position;
          frame = cloneCallSite(frame);
          var originalFunctionName = frame.getFunctionName;
          frame.getFunctionName = function() {
            if (state.nextPosition == null) {
              return originalFunctionName();
            }
            return state.nextPosition.name || originalFunctionName();
          };
          frame.getFileName = function() {
            return position.source;
          };
          frame.getLineNumber = function() {
            return position.line;
          };
          frame.getColumnNumber = function() {
            return position.column + 1;
          };
          frame.getScriptNameOrSourceURL = function() {
            return position.source;
          };
          return frame;
        }
        var origin = frame.isEval() && frame.getEvalOrigin();
        if (origin) {
          origin = mapEvalOrigin(origin);
          frame = cloneCallSite(frame);
          frame.getEvalOrigin = function() {
            return origin;
          };
          return frame;
        }
        return frame;
      }
      function prepareStackTrace(error, stack) {
        if (emptyCacheBetweenOperations) {
          fileContentsCache = {};
          sourceMapCache = {};
        }
        var name = error.name || "Error";
        var message = error.message || "";
        var errorString = name + ": " + message;
        var state = { nextPosition: null, curPosition: null };
        var processedStack = [];
        for (var i = stack.length - 1; i >= 0; i--) {
          processedStack.push("\n    at " + wrapCallSite(stack[i], state));
          state.nextPosition = state.curPosition;
        }
        state.curPosition = state.nextPosition = null;
        return errorString + processedStack.reverse().join("");
      }
      function getErrorSource(error) {
        var match = /\n    at [^(]+ \((.*):(\d+):(\d+)\)/.exec(error.stack);
        if (match) {
          var source = match[1];
          var line = +match[2];
          var column = +match[3];
          var contents = fileContentsCache[source];
          if (!contents && fs3 && fs3.existsSync(source)) {
            try {
              contents = fs3.readFileSync(source, "utf8");
            } catch (er) {
              contents = "";
            }
          }
          if (contents) {
            var code = contents.split(/(?:\r\n|\r|\n)/)[line - 1];
            if (code) {
              return source + ":" + line + "\n" + code + "\n" + new Array(column).join(" ") + "^";
            }
          }
        }
        return null;
      }
      function printErrorAndExit(error) {
        var source = getErrorSource(error);
        if (process.stderr._handle && process.stderr._handle.setBlocking) {
          process.stderr._handle.setBlocking(true);
        }
        if (source) {
          console.error();
          console.error(source);
        }
        console.error(error.stack);
        process.exit(1);
      }
      function shimEmitUncaughtException() {
        var origEmit = process.emit;
        process.emit = function(type) {
          if (type === "uncaughtException") {
            var hasStack = arguments[1] && arguments[1].stack;
            var hasListeners = this.listeners(type).length > 0;
            if (hasStack && !hasListeners) {
              return printErrorAndExit(arguments[1]);
            }
          }
          return origEmit.apply(this, arguments);
        };
      }
      var originalRetrieveFileHandlers = retrieveFileHandlers.slice(0);
      var originalRetrieveMapHandlers = retrieveMapHandlers.slice(0);
      exports2.wrapCallSite = wrapCallSite;
      exports2.getErrorSource = getErrorSource;
      exports2.mapSourcePosition = mapSourcePosition;
      exports2.retrieveSourceMap = retrieveSourceMap;
      exports2.install = function(options) {
        options = options || {};
        if (options.environment) {
          environment = options.environment;
          if (["node", "browser", "auto"].indexOf(environment) === -1) {
            throw new Error("environment " + environment + " was unknown. Available options are {auto, browser, node}");
          }
        }
        if (options.retrieveFile) {
          if (options.overrideRetrieveFile) {
            retrieveFileHandlers.length = 0;
          }
          retrieveFileHandlers.unshift(options.retrieveFile);
        }
        if (options.retrieveSourceMap) {
          if (options.overrideRetrieveSourceMap) {
            retrieveMapHandlers.length = 0;
          }
          retrieveMapHandlers.unshift(options.retrieveSourceMap);
        }
        if (options.hookRequire && !isInBrowser()) {
          var Module = dynamicRequire(module22, "module");
          var $compile = Module.prototype._compile;
          if (!$compile.__sourceMapSupport) {
            Module.prototype._compile = function(content, filename) {
              fileContentsCache[filename] = content;
              sourceMapCache[filename] = void 0;
              return $compile.call(this, content, filename);
            };
            Module.prototype._compile.__sourceMapSupport = true;
          }
        }
        if (!emptyCacheBetweenOperations) {
          emptyCacheBetweenOperations = "emptyCacheBetweenOperations" in options ? options.emptyCacheBetweenOperations : false;
        }
        if (!errorFormatterInstalled) {
          errorFormatterInstalled = true;
          Error.prepareStackTrace = prepareStackTrace;
        }
        if (!uncaughtShimInstalled) {
          var installHandler = "handleUncaughtExceptions" in options ? options.handleUncaughtExceptions : true;
          try {
            var worker_threads = dynamicRequire(module22, "worker_threads");
            if (worker_threads.isMainThread === false) {
              installHandler = false;
            }
          } catch (e) {
          }
          if (installHandler && hasGlobalProcessEventEmitter()) {
            uncaughtShimInstalled = true;
            shimEmitUncaughtException();
          }
        }
      };
      exports2.resetRetrieveHandlers = function() {
        retrieveFileHandlers.length = 0;
        retrieveMapHandlers.length = 0;
        retrieveFileHandlers = originalRetrieveFileHandlers.slice(0);
        retrieveMapHandlers = originalRetrieveMapHandlers.slice(0);
        retrieveSourceMap = handlerExec(retrieveMapHandlers);
        retrieveFile = handlerExec(retrieveFileHandlers);
      };
    });
    var require_node_modules_regexp = __commonJS2((exports2, module22) => {
      "use strict";
      module22.exports = /^(?:.*[\\\/])?node_modules(?:[\\\/].*)?$/;
    });
    var require_lib = __commonJS2((exports2, module22) => {
      "use strict";
      Object.defineProperty(exports2, "__esModule", {
        value: true
      });
      exports2.addHook = addHook2;
      var _module = _interopRequireDefault(require("module"));
      var _path = _interopRequireDefault(require("path"));
      var _nodeModulesRegexp = _interopRequireDefault(require_node_modules_regexp());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      var Module = module22.constructor.length > 1 ? module22.constructor : _module.default;
      var HOOK_RETURNED_NOTHING_ERROR_MESSAGE = "[Pirates] A hook returned a non-string, or nothing at all! This is a violation of intergalactic law!\n--------------------\nIf you have no idea what this means or what Pirates is, let me explain: Pirates is a module that makes is easy to implement require hooks. One of the require hooks you're using uses it. One of these require hooks didn't return anything from it's handler, so we don't know what to do. You might want to debug this.";
      function shouldCompile(filename, exts, matcher, ignoreNodeModules) {
        if (typeof filename !== "string") {
          return false;
        }
        if (exts.indexOf(_path.default.extname(filename)) === -1) {
          return false;
        }
        const resolvedFilename = _path.default.resolve(filename);
        if (ignoreNodeModules && _nodeModulesRegexp.default.test(resolvedFilename)) {
          return false;
        }
        if (matcher && typeof matcher === "function") {
          return !!matcher(resolvedFilename);
        }
        return true;
      }
      function addHook2(hook, opts = {}) {
        let reverted = false;
        const loaders = [];
        const oldLoaders = [];
        let exts;
        const originalJSLoader = Module._extensions[".js"];
        const matcher = opts.matcher || null;
        const ignoreNodeModules = opts.ignoreNodeModules !== false;
        exts = opts.extensions || opts.exts || opts.extension || opts.ext || [".js"];
        if (!Array.isArray(exts)) {
          exts = [exts];
        }
        exts.forEach((ext) => {
          if (typeof ext !== "string") {
            throw new TypeError(`Invalid Extension: ${ext}`);
          }
          const oldLoader = Module._extensions[ext] || originalJSLoader;
          oldLoaders[ext] = oldLoader;
          loaders[ext] = Module._extensions[ext] = function newLoader(mod, filename) {
            let compile;
            if (!reverted) {
              if (shouldCompile(filename, exts, matcher, ignoreNodeModules)) {
                compile = mod._compile;
                mod._compile = function _compile(code) {
                  mod._compile = compile;
                  const newCode = hook(code, filename);
                  if (typeof newCode !== "string") {
                    throw new Error(HOOK_RETURNED_NOTHING_ERROR_MESSAGE);
                  }
                  return mod._compile(newCode, filename);
                };
              }
            }
            oldLoader(mod, filename);
          };
        });
        return function revert() {
          if (reverted)
            return;
          reverted = true;
          exts.forEach((ext) => {
            if (Module._extensions[ext] === loaders[ext]) {
              Module._extensions[ext] = oldLoaders[ext];
            }
          });
        };
      }
    });
    var require_lib2 = __commonJS2((exports2, module22) => {
      "use strict";
      Object.defineProperty(exports2, "__esModule", {
        value: true
      });
      exports2.default = void 0;
      var _fs = _interopRequireDefault(require("fs"));
      var _path = _interopRequireDefault(require("path"));
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }
        if (info.done) {
          resolve(value);
        } else {
          Promise.resolve(value).then(_next, _throw);
        }
      }
      function _asyncToGenerator(fn) {
        return function() {
          var self = this, args = arguments;
          return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
              asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
              asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(void 0);
          });
        };
      }
      var readFile = (fp) => new Promise((resolve, reject) => {
        _fs.default.readFile(fp, "utf8", (err, data) => {
          if (err)
            return reject(err);
          resolve(data);
        });
      });
      var readFileSync = (fp) => {
        return _fs.default.readFileSync(fp, "utf8");
      };
      var pathExists = (fp) => new Promise((resolve) => {
        _fs.default.access(fp, (err) => {
          resolve(!err);
        });
      });
      var pathExistsSync = _fs.default.existsSync;
      var JoyCon2 = class {
        constructor({
          files,
          cwd = process.cwd(),
          stopDir,
          packageKey,
          parseJSON = JSON.parse
        } = {}) {
          this.options = {
            files,
            cwd,
            stopDir,
            packageKey,
            parseJSON
          };
          this.existsCache = /* @__PURE__ */ new Map();
          this.loaders = /* @__PURE__ */ new Set();
          this.packageJsonCache = /* @__PURE__ */ new Map();
        }
        addLoader(loader) {
          this.loaders.add(loader);
          return this;
        }
        removeLoader(name) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = void 0;
          try {
            for (var _iterator = this.loaders[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              const loader = _step.value;
              if (name && loader.name === name) {
                this.loaders.delete(loader);
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
          return this;
        }
        recusivelyResolve(options) {
          var _this = this;
          return _asyncToGenerator(function* () {
            if (options.cwd === options.stopDir || _path.default.basename(options.cwd) === "node_modules") {
              return null;
            }
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = void 0;
            try {
              for (var _iterator4 = options.files[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                const filename = _step4.value;
                const file = _path.default.resolve(options.cwd, filename);
                const exists = process.env.NODE_ENV !== "test" && _this.existsCache.has(file) ? _this.existsCache.get(file) : yield pathExists(file);
                _this.existsCache.set(file, exists);
                if (exists) {
                  if (!options.packageKey || _path.default.basename(file) !== "package.json") {
                    return file;
                  }
                  const data = require(file);
                  delete require.cache[file];
                  const hasPackageKey = Object.prototype.hasOwnProperty.call(data, options.packageKey);
                  if (hasPackageKey) {
                    _this.packageJsonCache.set(file, data);
                    return file;
                  }
                }
                continue;
              }
            } catch (err) {
              _didIteratorError4 = true;
              _iteratorError4 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
                  _iterator4.return();
                }
              } finally {
                if (_didIteratorError4) {
                  throw _iteratorError4;
                }
              }
            }
            return _this.recusivelyResolve(Object.assign({}, options, {
              cwd: _path.default.dirname(options.cwd)
            }));
          })();
        }
        recusivelyResolveSync(options) {
          if (options.cwd === options.stopDir || _path.default.basename(options.cwd) === "node_modules") {
            return null;
          }
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = void 0;
          try {
            for (var _iterator2 = options.files[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              const filename = _step2.value;
              const file = _path.default.resolve(options.cwd, filename);
              const exists = process.env.NODE_ENV !== "test" && this.existsCache.has(file) ? this.existsCache.get(file) : pathExistsSync(file);
              this.existsCache.set(file, exists);
              if (exists) {
                if (!options.packageKey || _path.default.basename(file) !== "package.json") {
                  return file;
                }
                const data = require(file);
                delete require.cache[file];
                const hasPackageKey = Object.prototype.hasOwnProperty.call(data, options.packageKey);
                if (hasPackageKey) {
                  this.packageJsonCache.set(file, data);
                  return file;
                }
              }
              continue;
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
          return this.recusivelyResolveSync(Object.assign({}, options, {
            cwd: _path.default.dirname(options.cwd)
          }));
        }
        resolve(...args) {
          var _this2 = this;
          return _asyncToGenerator(function* () {
            const options = _this2.normalizeOptions(args);
            return _this2.recusivelyResolve(options);
          })();
        }
        resolveSync(...args) {
          const options = this.normalizeOptions(args);
          return this.recusivelyResolveSync(options);
        }
        load(...args) {
          var _this3 = this;
          return _asyncToGenerator(function* () {
            const options = _this3.normalizeOptions(args);
            const filepath = yield _this3.recusivelyResolve(options);
            if (filepath) {
              const loader = _this3.findLoader(filepath);
              if (loader) {
                return {
                  path: filepath,
                  data: yield loader.load(filepath)
                };
              }
              const extname2 = _path.default.extname(filepath).slice(1);
              if (extname2 === "js") {
                delete require.cache[filepath];
                return {
                  path: filepath,
                  data: require(filepath)
                };
              }
              if (extname2 === "json") {
                if (_this3.packageJsonCache.has(filepath)) {
                  return {
                    path: filepath,
                    data: _this3.packageJsonCache.get(filepath)[options.packageKey]
                  };
                }
                const data = _this3.options.parseJSON(yield readFile(filepath));
                return {
                  path: filepath,
                  data
                };
              }
              return {
                path: filepath,
                data: yield readFile(filepath)
              };
            }
            return {};
          })();
        }
        loadSync(...args) {
          const options = this.normalizeOptions(args);
          const filepath = this.recusivelyResolveSync(options);
          if (filepath) {
            const loader = this.findLoader(filepath);
            if (loader) {
              return {
                path: filepath,
                data: loader.loadSync(filepath)
              };
            }
            const extname2 = _path.default.extname(filepath).slice(1);
            if (extname2 === "js") {
              delete require.cache[filepath];
              return {
                path: filepath,
                data: require(filepath)
              };
            }
            if (extname2 === "json") {
              if (this.packageJsonCache.has(filepath)) {
                return {
                  path: filepath,
                  data: this.packageJsonCache.get(filepath)[options.packageKey]
                };
              }
              const data = this.options.parseJSON(readFileSync(filepath));
              return {
                path: filepath,
                data
              };
            }
            return {
              path: filepath,
              data: readFileSync(filepath)
            };
          }
          return {};
        }
        findLoader(filepath) {
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = void 0;
          try {
            for (var _iterator3 = this.loaders[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              const loader = _step3.value;
              if (loader.test && loader.test.test(filepath)) {
                return loader;
              }
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
          return null;
        }
        clearCache() {
          this.existsCache.clear();
          this.packageJsonCache.clear();
          return this;
        }
        normalizeOptions(args) {
          const options = Object.assign({}, this.options);
          if (Object.prototype.toString.call(args[0]) === "[object Object]") {
            Object.assign(options, args[0]);
          } else {
            if (args[0]) {
              options.files = args[0];
            }
            if (args[1]) {
              options.cwd = args[1];
            }
            if (args[2]) {
              options.stopDir = args[2];
            }
          }
          options.cwd = _path.default.resolve(options.cwd);
          options.stopDir = options.stopDir ? _path.default.resolve(options.stopDir) : _path.default.parse(options.cwd).root;
          if (!options.files || options.files.length === 0) {
            throw new Error("[joycon] files must be an non-empty array!");
          }
          options.__normalized__ = true;
          return options;
        }
      };
      exports2.default = JoyCon2;
      module22.exports = JoyCon2;
      module22.exports.default = JoyCon2;
    });
    var require_filesystem = __commonJS2((exports2) => {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      var fs3 = require("fs");
      function fileExistsSync(path2) {
        try {
          var stats = fs3.statSync(path2);
          return stats.isFile();
        } catch (err) {
          return false;
        }
      }
      exports2.fileExistsSync = fileExistsSync;
      function readJsonFromDiskSync(packageJsonPath) {
        if (!fs3.existsSync(packageJsonPath)) {
          return void 0;
        }
        return require(packageJsonPath);
      }
      exports2.readJsonFromDiskSync = readJsonFromDiskSync;
      function readJsonFromDiskAsync(path2, callback) {
        fs3.readFile(path2, "utf8", function(err, result) {
          if (err || !result) {
            return callback();
          }
          var json = JSON.parse(result);
          return callback(void 0, json);
        });
      }
      exports2.readJsonFromDiskAsync = readJsonFromDiskAsync;
      function fileExistsAsync(path2, callback2) {
        fs3.stat(path2, function(err, stats) {
          if (err) {
            return callback2(void 0, false);
          }
          callback2(void 0, stats ? stats.isFile() : false);
        });
      }
      exports2.fileExistsAsync = fileExistsAsync;
      function removeExtension(path2) {
        return path2.substring(0, path2.lastIndexOf(".")) || path2;
      }
      exports2.removeExtension = removeExtension;
    });
    var require_mapping_entry = __commonJS2((exports2) => {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      var path2 = require("path");
      function getAbsoluteMappingEntries(absoluteBaseUrl, paths, addMatchAll) {
        var sortedKeys = sortByLongestPrefix(Object.keys(paths));
        var absolutePaths = [];
        for (var _i = 0, sortedKeys_1 = sortedKeys; _i < sortedKeys_1.length; _i++) {
          var key = sortedKeys_1[_i];
          absolutePaths.push({
            pattern: key,
            paths: paths[key].map(function(pathToResolve) {
              return path2.join(absoluteBaseUrl, pathToResolve);
            })
          });
        }
        if (!paths["*"] && addMatchAll) {
          absolutePaths.push({
            pattern: "*",
            paths: [absoluteBaseUrl.replace(/\/$/, "") + "/*"]
          });
        }
        return absolutePaths;
      }
      exports2.getAbsoluteMappingEntries = getAbsoluteMappingEntries;
      function sortByLongestPrefix(arr) {
        return arr.concat().sort(function(a, b) {
          return getPrefixLength(b) - getPrefixLength(a);
        });
      }
      function getPrefixLength(pattern) {
        var prefixLength = pattern.indexOf("*");
        return pattern.substr(0, prefixLength).length;
      }
    });
    var require_try_path = __commonJS2((exports2) => {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      var path2 = require("path");
      var path_1 = require("path");
      var filesystem_1 = require_filesystem();
      function getPathsToTry(extensions, absolutePathMappings, requestedModule) {
        if (!absolutePathMappings || !requestedModule || requestedModule[0] === "." || requestedModule[0] === path2.sep) {
          return void 0;
        }
        var pathsToTry = [];
        for (var _i = 0, absolutePathMappings_1 = absolutePathMappings; _i < absolutePathMappings_1.length; _i++) {
          var entry = absolutePathMappings_1[_i];
          var starMatch = entry.pattern === requestedModule ? "" : matchStar(entry.pattern, requestedModule);
          if (starMatch !== void 0) {
            var _loop_1 = function(physicalPathPattern2) {
              var physicalPath = physicalPathPattern2.replace("*", starMatch);
              pathsToTry.push({ type: "file", path: physicalPath });
              pathsToTry.push.apply(pathsToTry, extensions.map(function(e) {
                return { type: "extension", path: physicalPath + e };
              }));
              pathsToTry.push({
                type: "package",
                path: path2.join(physicalPath, "/package.json")
              });
              var indexPath = path2.join(physicalPath, "/index");
              pathsToTry.push.apply(pathsToTry, extensions.map(function(e) {
                return { type: "index", path: indexPath + e };
              }));
            };
            for (var _a = 0, _b = entry.paths; _a < _b.length; _a++) {
              var physicalPathPattern = _b[_a];
              _loop_1(physicalPathPattern);
            }
          }
        }
        return pathsToTry.length === 0 ? void 0 : pathsToTry;
      }
      exports2.getPathsToTry = getPathsToTry;
      function getStrippedPath(tryPath) {
        return tryPath.type === "index" ? path_1.dirname(tryPath.path) : tryPath.type === "file" ? tryPath.path : tryPath.type === "extension" ? filesystem_1.removeExtension(tryPath.path) : tryPath.type === "package" ? tryPath.path : exhaustiveTypeException(tryPath.type);
      }
      exports2.getStrippedPath = getStrippedPath;
      function exhaustiveTypeException(check) {
        throw new Error("Unknown type " + check);
      }
      exports2.exhaustiveTypeException = exhaustiveTypeException;
      function matchStar(pattern, search) {
        if (search.length < pattern.length) {
          return void 0;
        }
        if (pattern === "*") {
          return search;
        }
        var star = pattern.indexOf("*");
        if (star === -1) {
          return void 0;
        }
        var part1 = pattern.substring(0, star);
        var part2 = pattern.substring(star + 1);
        if (search.substr(0, star) !== part1) {
          return void 0;
        }
        if (search.substr(search.length - part2.length) !== part2) {
          return void 0;
        }
        return search.substr(star, search.length - part2.length);
      }
    });
    var require_match_path_sync = __commonJS2((exports2) => {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      var path2 = require("path");
      var Filesystem = require_filesystem();
      var MappingEntry = require_mapping_entry();
      var TryPath = require_try_path();
      function createMatchPath2(absoluteBaseUrl, paths, mainFields, addMatchAll) {
        if (mainFields === void 0) {
          mainFields = ["main"];
        }
        if (addMatchAll === void 0) {
          addMatchAll = true;
        }
        var absolutePaths = MappingEntry.getAbsoluteMappingEntries(absoluteBaseUrl, paths, addMatchAll);
        return function(requestedModule, readJson, fileExists, extensions) {
          return matchFromAbsolutePaths(absolutePaths, requestedModule, readJson, fileExists, extensions, mainFields);
        };
      }
      exports2.createMatchPath = createMatchPath2;
      function matchFromAbsolutePaths(absolutePathMappings, requestedModule, readJson, fileExists, extensions, mainFields) {
        if (readJson === void 0) {
          readJson = Filesystem.readJsonFromDiskSync;
        }
        if (fileExists === void 0) {
          fileExists = Filesystem.fileExistsSync;
        }
        if (extensions === void 0) {
          extensions = Object.keys(require.extensions);
        }
        if (mainFields === void 0) {
          mainFields = ["main"];
        }
        var tryPaths = TryPath.getPathsToTry(extensions, absolutePathMappings, requestedModule);
        if (!tryPaths) {
          return void 0;
        }
        return findFirstExistingPath(tryPaths, readJson, fileExists, mainFields);
      }
      exports2.matchFromAbsolutePaths = matchFromAbsolutePaths;
      function findFirstExistingMainFieldMappedFile(packageJson, mainFields, packageJsonPath, fileExists) {
        for (var index = 0; index < mainFields.length; index++) {
          var mainFieldName = mainFields[index];
          var candidateMapping = packageJson[mainFieldName];
          if (candidateMapping && typeof candidateMapping === "string") {
            var candidateFilePath = path2.join(path2.dirname(packageJsonPath), candidateMapping);
            if (fileExists(candidateFilePath)) {
              return candidateFilePath;
            }
          }
        }
        return void 0;
      }
      function findFirstExistingPath(tryPaths, readJson, fileExists, mainFields) {
        if (readJson === void 0) {
          readJson = Filesystem.readJsonFromDiskSync;
        }
        if (mainFields === void 0) {
          mainFields = ["main"];
        }
        for (var _i = 0, tryPaths_1 = tryPaths; _i < tryPaths_1.length; _i++) {
          var tryPath = tryPaths_1[_i];
          if (tryPath.type === "file" || tryPath.type === "extension" || tryPath.type === "index") {
            if (fileExists(tryPath.path)) {
              return TryPath.getStrippedPath(tryPath);
            }
          } else if (tryPath.type === "package") {
            var packageJson = readJson(tryPath.path);
            if (packageJson) {
              var mainFieldMappedFile = findFirstExistingMainFieldMappedFile(packageJson, mainFields, tryPath.path, fileExists);
              if (mainFieldMappedFile) {
                return Filesystem.removeExtension(mainFieldMappedFile);
              }
            }
          } else {
            TryPath.exhaustiveTypeException(tryPath.type);
          }
        }
        return void 0;
      }
    });
    var require_match_path_async = __commonJS2((exports2) => {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      var path2 = require("path");
      var TryPath = require_try_path();
      var MappingEntry = require_mapping_entry();
      var Filesystem = require_filesystem();
      function createMatchPathAsync(absoluteBaseUrl, paths, mainFields, addMatchAll) {
        if (mainFields === void 0) {
          mainFields = ["main"];
        }
        if (addMatchAll === void 0) {
          addMatchAll = true;
        }
        var absolutePaths = MappingEntry.getAbsoluteMappingEntries(absoluteBaseUrl, paths, addMatchAll);
        return function(requestedModule, readJson, fileExists, extensions, callback) {
          return matchFromAbsolutePathsAsync(absolutePaths, requestedModule, readJson, fileExists, extensions, callback, mainFields);
        };
      }
      exports2.createMatchPathAsync = createMatchPathAsync;
      function matchFromAbsolutePathsAsync(absolutePathMappings, requestedModule, readJson, fileExists, extensions, callback, mainFields) {
        if (readJson === void 0) {
          readJson = Filesystem.readJsonFromDiskAsync;
        }
        if (fileExists === void 0) {
          fileExists = Filesystem.fileExistsAsync;
        }
        if (extensions === void 0) {
          extensions = Object.keys(require.extensions);
        }
        if (mainFields === void 0) {
          mainFields = ["main"];
        }
        var tryPaths = TryPath.getPathsToTry(extensions, absolutePathMappings, requestedModule);
        if (!tryPaths) {
          return callback();
        }
        findFirstExistingPath(tryPaths, readJson, fileExists, callback, 0, mainFields);
      }
      exports2.matchFromAbsolutePathsAsync = matchFromAbsolutePathsAsync;
      function findFirstExistingMainFieldMappedFile(packageJson, mainFields, packageJsonPath, fileExistsAsync, doneCallback, index) {
        if (index === void 0) {
          index = 0;
        }
        if (index >= mainFields.length) {
          return doneCallback(void 0, void 0);
        }
        var tryNext = function() {
          return findFirstExistingMainFieldMappedFile(packageJson, mainFields, packageJsonPath, fileExistsAsync, doneCallback, index + 1);
        };
        var mainFieldMapping = packageJson[mainFields[index]];
        if (typeof mainFieldMapping !== "string") {
          return tryNext();
        }
        var mappedFilePath = path2.join(path2.dirname(packageJsonPath), mainFieldMapping);
        fileExistsAsync(mappedFilePath, function(err, exists) {
          if (err) {
            return doneCallback(err);
          }
          if (exists) {
            return doneCallback(void 0, mappedFilePath);
          }
          return tryNext();
        });
      }
      function findFirstExistingPath(tryPaths, readJson, fileExists, doneCallback, index, mainFields) {
        if (index === void 0) {
          index = 0;
        }
        if (mainFields === void 0) {
          mainFields = ["main"];
        }
        var tryPath = tryPaths[index];
        if (tryPath.type === "file" || tryPath.type === "extension" || tryPath.type === "index") {
          fileExists(tryPath.path, function(err, exists) {
            if (err) {
              return doneCallback(err);
            }
            if (exists) {
              return doneCallback(void 0, TryPath.getStrippedPath(tryPath));
            }
            if (index === tryPaths.length - 1) {
              return doneCallback();
            }
            return findFirstExistingPath(tryPaths, readJson, fileExists, doneCallback, index + 1, mainFields);
          });
        } else if (tryPath.type === "package") {
          readJson(tryPath.path, function(err, packageJson) {
            if (err) {
              return doneCallback(err);
            }
            if (packageJson) {
              return findFirstExistingMainFieldMappedFile(packageJson, mainFields, tryPath.path, fileExists, function(mainFieldErr, mainFieldMappedFile) {
                if (mainFieldErr) {
                  return doneCallback(mainFieldErr);
                }
                if (mainFieldMappedFile) {
                  return doneCallback(void 0, Filesystem.removeExtension(mainFieldMappedFile));
                }
                return findFirstExistingPath(tryPaths, readJson, fileExists, doneCallback, index + 1, mainFields);
              });
            }
            return findFirstExistingPath(tryPaths, readJson, fileExists, doneCallback, index + 1, mainFields);
          });
        } else {
          TryPath.exhaustiveTypeException(tryPath.type);
        }
      }
    });
    var require_unicode = __commonJS2((exports2) => {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      var Space_Separator = exports2.Space_Separator = /[\u1680\u2000-\u200A\u202F\u205F\u3000]/;
      var ID_Start = exports2.ID_Start = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]/;
      var ID_Continue = exports2.ID_Continue = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F\uDFE0]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4A\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/;
    });
    var require_util2 = __commonJS2((exports2) => {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.isSpaceSeparator = isSpaceSeparator;
      exports2.isIdStartChar = isIdStartChar;
      exports2.isIdContinueChar = isIdContinueChar;
      exports2.isDigit = isDigit;
      exports2.isHexDigit = isHexDigit;
      var _unicode = require_unicode();
      var unicode = _interopRequireWildcard(_unicode);
      function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) {
          return obj;
        } else {
          var newObj = {};
          if (obj != null) {
            for (var key in obj) {
              if (Object.prototype.hasOwnProperty.call(obj, key))
                newObj[key] = obj[key];
            }
          }
          newObj.default = obj;
          return newObj;
        }
      }
      function isSpaceSeparator(c) {
        return unicode.Space_Separator.test(c);
      }
      function isIdStartChar(c) {
        return c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c === "$" || c === "_" || unicode.ID_Start.test(c);
      }
      function isIdContinueChar(c) {
        return c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c >= "0" && c <= "9" || c === "$" || c === "_" || c === "\u200C" || c === "\u200D" || unicode.ID_Continue.test(c);
      }
      function isDigit(c) {
        return /[0-9]/.test(c);
      }
      function isHexDigit(c) {
        return /[0-9A-Fa-f]/.test(c);
      }
    });
    var require_parse = __commonJS2((exports2, module22) => {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
        return typeof obj;
      } : function(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
      exports2.default = parse;
      var _util = require_util2();
      var util = _interopRequireWildcard(_util);
      function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) {
          return obj;
        } else {
          var newObj = {};
          if (obj != null) {
            for (var key2 in obj) {
              if (Object.prototype.hasOwnProperty.call(obj, key2))
                newObj[key2] = obj[key2];
            }
          }
          newObj.default = obj;
          return newObj;
        }
      }
      var source = void 0;
      var parseState = void 0;
      var stack = void 0;
      var pos = void 0;
      var line = void 0;
      var column = void 0;
      var token = void 0;
      var key = void 0;
      var root = void 0;
      function parse(text, reviver) {
        source = String(text);
        parseState = "start";
        stack = [];
        pos = 0;
        line = 1;
        column = 0;
        token = void 0;
        key = void 0;
        root = void 0;
        do {
          token = lex();
          parseStates[parseState]();
        } while (token.type !== "eof");
        if (typeof reviver === "function") {
          return internalize({ "": root }, "", reviver);
        }
        return root;
      }
      function internalize(holder, name, reviver) {
        var value = holder[name];
        if (value != null && (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
          for (var _key in value) {
            var replacement = internalize(value, _key, reviver);
            if (replacement === void 0) {
              delete value[_key];
            } else {
              value[_key] = replacement;
            }
          }
        }
        return reviver.call(holder, name, value);
      }
      var lexState = void 0;
      var buffer = void 0;
      var doubleQuote = void 0;
      var _sign = void 0;
      var c = void 0;
      function lex() {
        lexState = "default";
        buffer = "";
        doubleQuote = false;
        _sign = 1;
        for (; ; ) {
          c = peek();
          var _token = lexStates[lexState]();
          if (_token) {
            return _token;
          }
        }
      }
      function peek() {
        if (source[pos]) {
          return String.fromCodePoint(source.codePointAt(pos));
        }
      }
      function read() {
        var c2 = peek();
        if (c2 === "\n") {
          line++;
          column = 0;
        } else if (c2) {
          column += c2.length;
        } else {
          column++;
        }
        if (c2) {
          pos += c2.length;
        }
        return c2;
      }
      var lexStates = { default: function _default() {
        switch (c) {
          case "	":
          case "\v":
          case "\f":
          case " ":
          case "\xA0":
          case "\uFEFF":
          case "\n":
          case "\r":
          case "\u2028":
          case "\u2029":
            read();
            return;
          case "/":
            read();
            lexState = "comment";
            return;
          case void 0:
            read();
            return newToken("eof");
        }
        if (util.isSpaceSeparator(c)) {
          read();
          return;
        }
        return lexStates[parseState]();
      }, comment: function comment() {
        switch (c) {
          case "*":
            read();
            lexState = "multiLineComment";
            return;
          case "/":
            read();
            lexState = "singleLineComment";
            return;
        }
        throw invalidChar(read());
      }, multiLineComment: function multiLineComment() {
        switch (c) {
          case "*":
            read();
            lexState = "multiLineCommentAsterisk";
            return;
          case void 0:
            throw invalidChar(read());
        }
        read();
      }, multiLineCommentAsterisk: function multiLineCommentAsterisk() {
        switch (c) {
          case "*":
            read();
            return;
          case "/":
            read();
            lexState = "default";
            return;
          case void 0:
            throw invalidChar(read());
        }
        read();
        lexState = "multiLineComment";
      }, singleLineComment: function singleLineComment() {
        switch (c) {
          case "\n":
          case "\r":
          case "\u2028":
          case "\u2029":
            read();
            lexState = "default";
            return;
          case void 0:
            read();
            return newToken("eof");
        }
        read();
      }, value: function value() {
        switch (c) {
          case "{":
          case "[":
            return newToken("punctuator", read());
          case "n":
            read();
            literal("ull");
            return newToken("null", null);
          case "t":
            read();
            literal("rue");
            return newToken("boolean", true);
          case "f":
            read();
            literal("alse");
            return newToken("boolean", false);
          case "-":
          case "+":
            if (read() === "-") {
              _sign = -1;
            }
            lexState = "sign";
            return;
          case ".":
            buffer = read();
            lexState = "decimalPointLeading";
            return;
          case "0":
            buffer = read();
            lexState = "zero";
            return;
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
            buffer = read();
            lexState = "decimalInteger";
            return;
          case "I":
            read();
            literal("nfinity");
            return newToken("numeric", Infinity);
          case "N":
            read();
            literal("aN");
            return newToken("numeric", NaN);
          case '"':
          case "'":
            doubleQuote = read() === '"';
            buffer = "";
            lexState = "string";
            return;
        }
        throw invalidChar(read());
      }, identifierNameStartEscape: function identifierNameStartEscape() {
        if (c !== "u") {
          throw invalidChar(read());
        }
        read();
        var u = unicodeEscape();
        switch (u) {
          case "$":
          case "_":
            break;
          default:
            if (!util.isIdStartChar(u)) {
              throw invalidIdentifier();
            }
            break;
        }
        buffer += u;
        lexState = "identifierName";
      }, identifierName: function identifierName() {
        switch (c) {
          case "$":
          case "_":
          case "\u200C":
          case "\u200D":
            buffer += read();
            return;
          case "\\":
            read();
            lexState = "identifierNameEscape";
            return;
        }
        if (util.isIdContinueChar(c)) {
          buffer += read();
          return;
        }
        return newToken("identifier", buffer);
      }, identifierNameEscape: function identifierNameEscape() {
        if (c !== "u") {
          throw invalidChar(read());
        }
        read();
        var u = unicodeEscape();
        switch (u) {
          case "$":
          case "_":
          case "\u200C":
          case "\u200D":
            break;
          default:
            if (!util.isIdContinueChar(u)) {
              throw invalidIdentifier();
            }
            break;
        }
        buffer += u;
        lexState = "identifierName";
      }, sign: function sign() {
        switch (c) {
          case ".":
            buffer = read();
            lexState = "decimalPointLeading";
            return;
          case "0":
            buffer = read();
            lexState = "zero";
            return;
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
            buffer = read();
            lexState = "decimalInteger";
            return;
          case "I":
            read();
            literal("nfinity");
            return newToken("numeric", _sign * Infinity);
          case "N":
            read();
            literal("aN");
            return newToken("numeric", NaN);
        }
        throw invalidChar(read());
      }, zero: function zero() {
        switch (c) {
          case ".":
            buffer += read();
            lexState = "decimalPoint";
            return;
          case "e":
          case "E":
            buffer += read();
            lexState = "decimalExponent";
            return;
          case "x":
          case "X":
            buffer += read();
            lexState = "hexadecimal";
            return;
        }
        return newToken("numeric", _sign * 0);
      }, decimalInteger: function decimalInteger() {
        switch (c) {
          case ".":
            buffer += read();
            lexState = "decimalPoint";
            return;
          case "e":
          case "E":
            buffer += read();
            lexState = "decimalExponent";
            return;
        }
        if (util.isDigit(c)) {
          buffer += read();
          return;
        }
        return newToken("numeric", _sign * Number(buffer));
      }, decimalPointLeading: function decimalPointLeading() {
        if (util.isDigit(c)) {
          buffer += read();
          lexState = "decimalFraction";
          return;
        }
        throw invalidChar(read());
      }, decimalPoint: function decimalPoint() {
        switch (c) {
          case "e":
          case "E":
            buffer += read();
            lexState = "decimalExponent";
            return;
        }
        if (util.isDigit(c)) {
          buffer += read();
          lexState = "decimalFraction";
          return;
        }
        return newToken("numeric", _sign * Number(buffer));
      }, decimalFraction: function decimalFraction() {
        switch (c) {
          case "e":
          case "E":
            buffer += read();
            lexState = "decimalExponent";
            return;
        }
        if (util.isDigit(c)) {
          buffer += read();
          return;
        }
        return newToken("numeric", _sign * Number(buffer));
      }, decimalExponent: function decimalExponent() {
        switch (c) {
          case "+":
          case "-":
            buffer += read();
            lexState = "decimalExponentSign";
            return;
        }
        if (util.isDigit(c)) {
          buffer += read();
          lexState = "decimalExponentInteger";
          return;
        }
        throw invalidChar(read());
      }, decimalExponentSign: function decimalExponentSign() {
        if (util.isDigit(c)) {
          buffer += read();
          lexState = "decimalExponentInteger";
          return;
        }
        throw invalidChar(read());
      }, decimalExponentInteger: function decimalExponentInteger() {
        if (util.isDigit(c)) {
          buffer += read();
          return;
        }
        return newToken("numeric", _sign * Number(buffer));
      }, hexadecimal: function hexadecimal() {
        if (util.isHexDigit(c)) {
          buffer += read();
          lexState = "hexadecimalInteger";
          return;
        }
        throw invalidChar(read());
      }, hexadecimalInteger: function hexadecimalInteger() {
        if (util.isHexDigit(c)) {
          buffer += read();
          return;
        }
        return newToken("numeric", _sign * Number(buffer));
      }, string: function string() {
        switch (c) {
          case "\\":
            read();
            buffer += escape();
            return;
          case '"':
            if (doubleQuote) {
              read();
              return newToken("string", buffer);
            }
            buffer += read();
            return;
          case "'":
            if (!doubleQuote) {
              read();
              return newToken("string", buffer);
            }
            buffer += read();
            return;
          case "\n":
          case "\r":
            throw invalidChar(read());
          case "\u2028":
          case "\u2029":
            separatorChar(c);
            break;
          case void 0:
            throw invalidChar(read());
        }
        buffer += read();
      }, start: function start() {
        switch (c) {
          case "{":
          case "[":
            return newToken("punctuator", read());
        }
        lexState = "value";
      }, beforePropertyName: function beforePropertyName() {
        switch (c) {
          case "$":
          case "_":
            buffer = read();
            lexState = "identifierName";
            return;
          case "\\":
            read();
            lexState = "identifierNameStartEscape";
            return;
          case "}":
            return newToken("punctuator", read());
          case '"':
          case "'":
            doubleQuote = read() === '"';
            lexState = "string";
            return;
        }
        if (util.isIdStartChar(c)) {
          buffer += read();
          lexState = "identifierName";
          return;
        }
        throw invalidChar(read());
      }, afterPropertyName: function afterPropertyName() {
        if (c === ":") {
          return newToken("punctuator", read());
        }
        throw invalidChar(read());
      }, beforePropertyValue: function beforePropertyValue() {
        lexState = "value";
      }, afterPropertyValue: function afterPropertyValue() {
        switch (c) {
          case ",":
          case "}":
            return newToken("punctuator", read());
        }
        throw invalidChar(read());
      }, beforeArrayValue: function beforeArrayValue() {
        if (c === "]") {
          return newToken("punctuator", read());
        }
        lexState = "value";
      }, afterArrayValue: function afterArrayValue() {
        switch (c) {
          case ",":
          case "]":
            return newToken("punctuator", read());
        }
        throw invalidChar(read());
      }, end: function end() {
        throw invalidChar(read());
      } };
      function newToken(type, value) {
        return { type, value, line, column };
      }
      function literal(s) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = void 0;
        try {
          for (var _iterator = s[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _c = _step.value;
            var p = peek();
            if (p !== _c) {
              throw invalidChar(read());
            }
            read();
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
      function escape() {
        var c2 = peek();
        switch (c2) {
          case "b":
            read();
            return "\b";
          case "f":
            read();
            return "\f";
          case "n":
            read();
            return "\n";
          case "r":
            read();
            return "\r";
          case "t":
            read();
            return "	";
          case "v":
            read();
            return "\v";
          case "0":
            read();
            if (util.isDigit(peek())) {
              throw invalidChar(read());
            }
            return "\0";
          case "x":
            read();
            return hexEscape();
          case "u":
            read();
            return unicodeEscape();
          case "\n":
          case "\u2028":
          case "\u2029":
            read();
            return "";
          case "\r":
            read();
            if (peek() === "\n") {
              read();
            }
            return "";
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
            throw invalidChar(read());
          case void 0:
            throw invalidChar(read());
        }
        return read();
      }
      function hexEscape() {
        var buffer2 = "";
        var c2 = peek();
        if (!util.isHexDigit(c2)) {
          throw invalidChar(read());
        }
        buffer2 += read();
        c2 = peek();
        if (!util.isHexDigit(c2)) {
          throw invalidChar(read());
        }
        buffer2 += read();
        return String.fromCodePoint(parseInt(buffer2, 16));
      }
      function unicodeEscape() {
        var buffer2 = "";
        var count = 4;
        while (count-- > 0) {
          var _c2 = peek();
          if (!util.isHexDigit(_c2)) {
            throw invalidChar(read());
          }
          buffer2 += read();
        }
        return String.fromCodePoint(parseInt(buffer2, 16));
      }
      var parseStates = { start: function start() {
        if (token.type === "eof") {
          throw invalidEOF();
        }
        push();
      }, beforePropertyName: function beforePropertyName() {
        switch (token.type) {
          case "identifier":
          case "string":
            key = token.value;
            parseState = "afterPropertyName";
            return;
          case "punctuator":
            pop();
            return;
          case "eof":
            throw invalidEOF();
        }
      }, afterPropertyName: function afterPropertyName() {
        if (token.type === "eof") {
          throw invalidEOF();
        }
        parseState = "beforePropertyValue";
      }, beforePropertyValue: function beforePropertyValue() {
        if (token.type === "eof") {
          throw invalidEOF();
        }
        push();
      }, beforeArrayValue: function beforeArrayValue() {
        if (token.type === "eof") {
          throw invalidEOF();
        }
        if (token.type === "punctuator" && token.value === "]") {
          pop();
          return;
        }
        push();
      }, afterPropertyValue: function afterPropertyValue() {
        if (token.type === "eof") {
          throw invalidEOF();
        }
        switch (token.value) {
          case ",":
            parseState = "beforePropertyName";
            return;
          case "}":
            pop();
        }
      }, afterArrayValue: function afterArrayValue() {
        if (token.type === "eof") {
          throw invalidEOF();
        }
        switch (token.value) {
          case ",":
            parseState = "beforeArrayValue";
            return;
          case "]":
            pop();
        }
      }, end: function end() {
      } };
      function push() {
        var value = void 0;
        switch (token.type) {
          case "punctuator":
            switch (token.value) {
              case "{":
                value = {};
                break;
              case "[":
                value = [];
                break;
            }
            break;
          case "null":
          case "boolean":
          case "numeric":
          case "string":
            value = token.value;
            break;
        }
        if (root === void 0) {
          root = value;
        } else {
          var parent = stack[stack.length - 1];
          if (Array.isArray(parent)) {
            parent.push(value);
          } else {
            parent[key] = value;
          }
        }
        if (value !== null && (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
          stack.push(value);
          if (Array.isArray(value)) {
            parseState = "beforeArrayValue";
          } else {
            parseState = "beforePropertyName";
          }
        } else {
          var current = stack[stack.length - 1];
          if (current == null) {
            parseState = "end";
          } else if (Array.isArray(current)) {
            parseState = "afterArrayValue";
          } else {
            parseState = "afterPropertyValue";
          }
        }
      }
      function pop() {
        stack.pop();
        var current = stack[stack.length - 1];
        if (current == null) {
          parseState = "end";
        } else if (Array.isArray(current)) {
          parseState = "afterArrayValue";
        } else {
          parseState = "afterPropertyValue";
        }
      }
      function invalidChar(c2) {
        if (c2 === void 0) {
          return syntaxError("JSON5: invalid end of input at " + line + ":" + column);
        }
        return syntaxError("JSON5: invalid character '" + formatChar(c2) + "' at " + line + ":" + column);
      }
      function invalidEOF() {
        return syntaxError("JSON5: invalid end of input at " + line + ":" + column);
      }
      function invalidIdentifier() {
        column -= 5;
        return syntaxError("JSON5: invalid identifier character at " + line + ":" + column);
      }
      function separatorChar(c2) {
        console.warn("JSON5: '" + c2 + "' is not valid ECMAScript; consider escaping");
      }
      function formatChar(c2) {
        var replacements = { "'": "\\'", '"': '\\"', "\\": "\\\\", "\b": "\\b", "\f": "\\f", "\n": "\\n", "\r": "\\r", "	": "\\t", "\v": "\\v", "\0": "\\0", "\u2028": "\\u2028", "\u2029": "\\u2029" };
        if (replacements[c2]) {
          return replacements[c2];
        }
        if (c2 < " ") {
          var hexString = c2.charCodeAt(0).toString(16);
          return "\\x" + ("00" + hexString).substring(hexString.length);
        }
        return c2;
      }
      function syntaxError(message) {
        var err = new SyntaxError(message);
        err.lineNumber = line;
        err.columnNumber = column;
        return err;
      }
      module22.exports = exports2["default"];
    });
    var require_stringify = __commonJS2((exports2, module22) => {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
        return typeof obj;
      } : function(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
      exports2.default = stringify;
      var _util = require_util2();
      var util = _interopRequireWildcard(_util);
      function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) {
          return obj;
        } else {
          var newObj = {};
          if (obj != null) {
            for (var key in obj) {
              if (Object.prototype.hasOwnProperty.call(obj, key))
                newObj[key] = obj[key];
            }
          }
          newObj.default = obj;
          return newObj;
        }
      }
      function stringify(value, replacer, space) {
        var stack = [];
        var indent = "";
        var propertyList = void 0;
        var replacerFunc = void 0;
        var gap = "";
        var quote = void 0;
        if (replacer != null && (typeof replacer === "undefined" ? "undefined" : _typeof(replacer)) === "object" && !Array.isArray(replacer)) {
          space = replacer.space;
          quote = replacer.quote;
          replacer = replacer.replacer;
        }
        if (typeof replacer === "function") {
          replacerFunc = replacer;
        } else if (Array.isArray(replacer)) {
          propertyList = [];
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = void 0;
          try {
            for (var _iterator = replacer[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var v = _step.value;
              var item = void 0;
              if (typeof v === "string") {
                item = v;
              } else if (typeof v === "number" || v instanceof String || v instanceof Number) {
                item = String(v);
              }
              if (item !== void 0 && propertyList.indexOf(item) < 0) {
                propertyList.push(item);
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }
        if (space instanceof Number) {
          space = Number(space);
        } else if (space instanceof String) {
          space = String(space);
        }
        if (typeof space === "number") {
          if (space > 0) {
            space = Math.min(10, Math.floor(space));
            gap = "          ".substr(0, space);
          }
        } else if (typeof space === "string") {
          gap = space.substr(0, 10);
        }
        return serializeProperty("", { "": value });
        function serializeProperty(key, holder) {
          var value2 = holder[key];
          if (value2 != null) {
            if (typeof value2.toJSON5 === "function") {
              value2 = value2.toJSON5(key);
            } else if (typeof value2.toJSON === "function") {
              value2 = value2.toJSON(key);
            }
          }
          if (replacerFunc) {
            value2 = replacerFunc.call(holder, key, value2);
          }
          if (value2 instanceof Number) {
            value2 = Number(value2);
          } else if (value2 instanceof String) {
            value2 = String(value2);
          } else if (value2 instanceof Boolean) {
            value2 = value2.valueOf();
          }
          switch (value2) {
            case null:
              return "null";
            case true:
              return "true";
            case false:
              return "false";
          }
          if (typeof value2 === "string") {
            return quoteString(value2, false);
          }
          if (typeof value2 === "number") {
            return String(value2);
          }
          if ((typeof value2 === "undefined" ? "undefined" : _typeof(value2)) === "object") {
            return Array.isArray(value2) ? serializeArray(value2) : serializeObject(value2);
          }
          return void 0;
        }
        function quoteString(value2) {
          var quotes = { "'": 0.1, '"': 0.2 };
          var replacements = { "'": "\\'", '"': '\\"', "\\": "\\\\", "\b": "\\b", "\f": "\\f", "\n": "\\n", "\r": "\\r", "	": "\\t", "\v": "\\v", "\0": "\\0", "\u2028": "\\u2028", "\u2029": "\\u2029" };
          var product = "";
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = void 0;
          try {
            for (var _iterator2 = value2[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var c = _step2.value;
              switch (c) {
                case "'":
                case '"':
                  quotes[c]++;
                  product += c;
                  continue;
              }
              if (replacements[c]) {
                product += replacements[c];
                continue;
              }
              if (c < " ") {
                var hexString = c.charCodeAt(0).toString(16);
                product += "\\x" + ("00" + hexString).substring(hexString.length);
                continue;
              }
              product += c;
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
          var quoteChar = quote || Object.keys(quotes).reduce(function(a, b) {
            return quotes[a] < quotes[b] ? a : b;
          });
          product = product.replace(new RegExp(quoteChar, "g"), replacements[quoteChar]);
          return quoteChar + product + quoteChar;
        }
        function serializeObject(value2) {
          if (stack.indexOf(value2) >= 0) {
            throw TypeError("Converting circular structure to JSON5");
          }
          stack.push(value2);
          var stepback = indent;
          indent = indent + gap;
          var keys = propertyList || Object.keys(value2);
          var partial = [];
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = void 0;
          try {
            for (var _iterator3 = keys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var key = _step3.value;
              var propertyString = serializeProperty(key, value2);
              if (propertyString !== void 0) {
                var member = serializeKey(key) + ":";
                if (gap !== "") {
                  member += " ";
                }
                member += propertyString;
                partial.push(member);
              }
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
          var final = void 0;
          if (partial.length === 0) {
            final = "{}";
          } else {
            var properties = void 0;
            if (gap === "") {
              properties = partial.join(",");
              final = "{" + properties + "}";
            } else {
              var separator = ",\n" + indent;
              properties = partial.join(separator);
              final = "{\n" + indent + properties + ",\n" + stepback + "}";
            }
          }
          stack.pop();
          indent = stepback;
          return final;
        }
        function serializeKey(key) {
          if (key.length === 0) {
            return quoteString(key, true);
          }
          var firstChar = String.fromCodePoint(key.codePointAt(0));
          if (!util.isIdStartChar(firstChar)) {
            return quoteString(key, true);
          }
          for (var i = firstChar.length; i < key.length; i++) {
            if (!util.isIdContinueChar(String.fromCodePoint(key.codePointAt(i)))) {
              return quoteString(key, true);
            }
          }
          return key;
        }
        function serializeArray(value2) {
          if (stack.indexOf(value2) >= 0) {
            throw TypeError("Converting circular structure to JSON5");
          }
          stack.push(value2);
          var stepback = indent;
          indent = indent + gap;
          var partial = [];
          for (var i = 0; i < value2.length; i++) {
            var propertyString = serializeProperty(String(i), value2);
            partial.push(propertyString !== void 0 ? propertyString : "null");
          }
          var final = void 0;
          if (partial.length === 0) {
            final = "[]";
          } else {
            if (gap === "") {
              var properties = partial.join(",");
              final = "[" + properties + "]";
            } else {
              var separator = ",\n" + indent;
              var _properties = partial.join(separator);
              final = "[\n" + indent + _properties + ",\n" + stepback + "]";
            }
          }
          stack.pop();
          indent = stepback;
          return final;
        }
      }
      module22.exports = exports2["default"];
    });
    var require_lib3 = __commonJS2((exports2, module22) => {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      var _parse = require_parse();
      var _parse2 = _interopRequireDefault(_parse);
      var _stringify = require_stringify();
      var _stringify2 = _interopRequireDefault(_stringify);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }
      exports2.default = { parse: _parse2.default, stringify: _stringify2.default };
      module22.exports = exports2["default"];
    });
    var require_strip_bom = __commonJS2((exports2, module22) => {
      "use strict";
      module22.exports = (x) => {
        if (typeof x !== "string") {
          throw new TypeError("Expected a string, got " + typeof x);
        }
        if (x.charCodeAt(0) === 65279) {
          return x.slice(1);
        }
        return x;
      };
    });
    var require_tsconfig_loader = __commonJS2((exports2) => {
      "use strict";
      var __assign = exports2 && exports2.__assign || Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
        }
        return t;
      };
      Object.defineProperty(exports2, "__esModule", { value: true });
      var path2 = require("path");
      var fs3 = require("fs");
      var JSON5 = require_lib3();
      var StripBom = require_strip_bom();
      function tsConfigLoader(_a) {
        var getEnv = _a.getEnv, cwd = _a.cwd, _b = _a.loadSync, loadSync = _b === void 0 ? loadSyncDefault : _b;
        var TS_NODE_PROJECT = getEnv("TS_NODE_PROJECT");
        var TS_NODE_BASEURL = getEnv("TS_NODE_BASEURL");
        var loadResult = loadSync(cwd, TS_NODE_PROJECT, TS_NODE_BASEURL);
        return loadResult;
      }
      exports2.tsConfigLoader = tsConfigLoader;
      function loadSyncDefault(cwd, filename, baseUrl) {
        var configPath = resolveConfigPath(cwd, filename);
        if (!configPath) {
          return {
            tsConfigPath: void 0,
            baseUrl: void 0,
            paths: void 0
          };
        }
        var config = loadTsconfig(configPath);
        return {
          tsConfigPath: configPath,
          baseUrl: baseUrl || config && config.compilerOptions && config.compilerOptions.baseUrl,
          paths: config && config.compilerOptions && config.compilerOptions.paths
        };
      }
      function resolveConfigPath(cwd, filename) {
        if (filename) {
          var absolutePath = fs3.lstatSync(filename).isDirectory() ? path2.resolve(filename, "./tsconfig.json") : path2.resolve(cwd, filename);
          return absolutePath;
        }
        if (fs3.statSync(cwd).isFile()) {
          return path2.resolve(cwd);
        }
        var configAbsolutePath = walkForTsConfig(cwd);
        return configAbsolutePath ? path2.resolve(configAbsolutePath) : void 0;
      }
      function walkForTsConfig(directory, existsSync) {
        if (existsSync === void 0) {
          existsSync = fs3.existsSync;
        }
        var configPath = path2.join(directory, "./tsconfig.json");
        if (existsSync(configPath)) {
          return configPath;
        }
        var parentDirectory = path2.join(directory, "../");
        if (directory === parentDirectory) {
          return void 0;
        }
        return walkForTsConfig(parentDirectory, existsSync);
      }
      exports2.walkForTsConfig = walkForTsConfig;
      function loadTsconfig(configFilePath, existsSync, readFileSync) {
        if (existsSync === void 0) {
          existsSync = fs3.existsSync;
        }
        if (readFileSync === void 0) {
          readFileSync = function(filename) {
            return fs3.readFileSync(filename, "utf8");
          };
        }
        if (!existsSync(configFilePath)) {
          return void 0;
        }
        var configString = readFileSync(configFilePath);
        var cleanedJson = StripBom(configString);
        var config = JSON5.parse(cleanedJson);
        var extendedConfig = config.extends;
        if (extendedConfig) {
          if (typeof extendedConfig === "string" && extendedConfig.indexOf(".json") === -1) {
            extendedConfig += ".json";
          }
          var currentDir = path2.dirname(configFilePath);
          var extendedConfigPath = path2.join(currentDir, extendedConfig);
          if (extendedConfig.indexOf("/") !== -1 && extendedConfig.indexOf(".") !== -1 && !existsSync(extendedConfigPath)) {
            extendedConfigPath = path2.join(currentDir, "node_modules", extendedConfig);
          }
          var base = loadTsconfig(extendedConfigPath, existsSync, readFileSync) || {};
          if (base.compilerOptions && base.compilerOptions.baseUrl) {
            var extendsDir = path2.dirname(extendedConfig);
            base.compilerOptions.baseUrl = path2.join(extendsDir, base.compilerOptions.baseUrl);
          }
          return __assign({}, base, config, { compilerOptions: __assign({}, base.compilerOptions, config.compilerOptions) });
        }
        return config;
      }
      exports2.loadTsconfig = loadTsconfig;
    });
    var require_minimist = __commonJS2((exports2, module22) => {
      module22.exports = function(args, opts) {
        if (!opts)
          opts = {};
        var flags = { bools: {}, strings: {}, unknownFn: null };
        if (typeof opts["unknown"] === "function") {
          flags.unknownFn = opts["unknown"];
        }
        if (typeof opts["boolean"] === "boolean" && opts["boolean"]) {
          flags.allBools = true;
        } else {
          [].concat(opts["boolean"]).filter(Boolean).forEach(function(key2) {
            flags.bools[key2] = true;
          });
        }
        var aliases = {};
        Object.keys(opts.alias || {}).forEach(function(key2) {
          aliases[key2] = [].concat(opts.alias[key2]);
          aliases[key2].forEach(function(x) {
            aliases[x] = [key2].concat(aliases[key2].filter(function(y) {
              return x !== y;
            }));
          });
        });
        [].concat(opts.string).filter(Boolean).forEach(function(key2) {
          flags.strings[key2] = true;
          if (aliases[key2]) {
            flags.strings[aliases[key2]] = true;
          }
        });
        var defaults = opts["default"] || {};
        var argv = { _: [] };
        Object.keys(flags.bools).forEach(function(key2) {
          setArg(key2, defaults[key2] === void 0 ? false : defaults[key2]);
        });
        var notFlags = [];
        if (args.indexOf("--") !== -1) {
          notFlags = args.slice(args.indexOf("--") + 1);
          args = args.slice(0, args.indexOf("--"));
        }
        function argDefined(key2, arg2) {
          return flags.allBools && /^--[^=]+$/.test(arg2) || flags.strings[key2] || flags.bools[key2] || aliases[key2];
        }
        function setArg(key2, val, arg2) {
          if (arg2 && flags.unknownFn && !argDefined(key2, arg2)) {
            if (flags.unknownFn(arg2) === false)
              return;
          }
          var value2 = !flags.strings[key2] && isNumber(val) ? Number(val) : val;
          setKey(argv, key2.split("."), value2);
          (aliases[key2] || []).forEach(function(x) {
            setKey(argv, x.split("."), value2);
          });
        }
        function setKey(obj, keys, value2) {
          var o = obj;
          for (var i2 = 0; i2 < keys.length - 1; i2++) {
            var key2 = keys[i2];
            if (key2 === "__proto__")
              return;
            if (o[key2] === void 0)
              o[key2] = {};
            if (o[key2] === Object.prototype || o[key2] === Number.prototype || o[key2] === String.prototype)
              o[key2] = {};
            if (o[key2] === Array.prototype)
              o[key2] = [];
            o = o[key2];
          }
          var key2 = keys[keys.length - 1];
          if (key2 === "__proto__")
            return;
          if (o === Object.prototype || o === Number.prototype || o === String.prototype)
            o = {};
          if (o === Array.prototype)
            o = [];
          if (o[key2] === void 0 || flags.bools[key2] || typeof o[key2] === "boolean") {
            o[key2] = value2;
          } else if (Array.isArray(o[key2])) {
            o[key2].push(value2);
          } else {
            o[key2] = [o[key2], value2];
          }
        }
        function aliasIsBoolean(key2) {
          return aliases[key2].some(function(x) {
            return flags.bools[x];
          });
        }
        for (var i = 0; i < args.length; i++) {
          var arg = args[i];
          if (/^--.+=/.test(arg)) {
            var m = arg.match(/^--([^=]+)=([\s\S]*)$/);
            var key = m[1];
            var value = m[2];
            if (flags.bools[key]) {
              value = value !== "false";
            }
            setArg(key, value, arg);
          } else if (/^--no-.+/.test(arg)) {
            var key = arg.match(/^--no-(.+)/)[1];
            setArg(key, false, arg);
          } else if (/^--.+/.test(arg)) {
            var key = arg.match(/^--(.+)/)[1];
            var next = args[i + 1];
            if (next !== void 0 && !/^-/.test(next) && !flags.bools[key] && !flags.allBools && (aliases[key] ? !aliasIsBoolean(key) : true)) {
              setArg(key, next, arg);
              i++;
            } else if (/^(true|false)$/.test(next)) {
              setArg(key, next === "true", arg);
              i++;
            } else {
              setArg(key, flags.strings[key] ? "" : true, arg);
            }
          } else if (/^-[^-]+/.test(arg)) {
            var letters = arg.slice(1, -1).split("");
            var broken = false;
            for (var j = 0; j < letters.length; j++) {
              var next = arg.slice(j + 2);
              if (next === "-") {
                setArg(letters[j], next, arg);
                continue;
              }
              if (/[A-Za-z]/.test(letters[j]) && /=/.test(next)) {
                setArg(letters[j], next.split("=")[1], arg);
                broken = true;
                break;
              }
              if (/[A-Za-z]/.test(letters[j]) && /-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) {
                setArg(letters[j], next, arg);
                broken = true;
                break;
              }
              if (letters[j + 1] && letters[j + 1].match(/\W/)) {
                setArg(letters[j], arg.slice(j + 2), arg);
                broken = true;
                break;
              } else {
                setArg(letters[j], flags.strings[letters[j]] ? "" : true, arg);
              }
            }
            var key = arg.slice(-1)[0];
            if (!broken && key !== "-") {
              if (args[i + 1] && !/^(-|--)[^-]/.test(args[i + 1]) && !flags.bools[key] && (aliases[key] ? !aliasIsBoolean(key) : true)) {
                setArg(key, args[i + 1], arg);
                i++;
              } else if (args[i + 1] && /^(true|false)$/.test(args[i + 1])) {
                setArg(key, args[i + 1] === "true", arg);
                i++;
              } else {
                setArg(key, flags.strings[key] ? "" : true, arg);
              }
            }
          } else {
            if (!flags.unknownFn || flags.unknownFn(arg) !== false) {
              argv._.push(flags.strings["_"] || !isNumber(arg) ? arg : Number(arg));
            }
            if (opts.stopEarly) {
              argv._.push.apply(argv._, args.slice(i + 1));
              break;
            }
          }
        }
        Object.keys(defaults).forEach(function(key2) {
          if (!hasKey(argv, key2.split("."))) {
            setKey(argv, key2.split("."), defaults[key2]);
            (aliases[key2] || []).forEach(function(x) {
              setKey(argv, x.split("."), defaults[key2]);
            });
          }
        });
        if (opts["--"]) {
          argv["--"] = new Array();
          notFlags.forEach(function(key2) {
            argv["--"].push(key2);
          });
        } else {
          notFlags.forEach(function(key2) {
            argv._.push(key2);
          });
        }
        return argv;
      };
      function hasKey(obj, keys) {
        var o = obj;
        keys.slice(0, -1).forEach(function(key2) {
          o = o[key2] || {};
        });
        var key = keys[keys.length - 1];
        return key in o;
      }
      function isNumber(x) {
        if (typeof x === "number")
          return true;
        if (/^0x[0-9a-f]+$/i.test(x))
          return true;
        return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(x);
      }
    });
    var require_options = __commonJS2((exports2) => {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      var minimist = require_minimist();
      var argv = minimist(process.argv.slice(2), {
        string: ["project"],
        alias: {
          project: ["P"]
        }
      });
      var project = argv && argv.project;
      exports2.options = {
        cwd: project || process.cwd()
      };
    });
    var require_config_loader = __commonJS2((exports2) => {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      var TsConfigLoader = require_tsconfig_loader();
      var path2 = require("path");
      var options_1 = require_options();
      function loadConfig2(cwd) {
        if (cwd === void 0) {
          cwd = options_1.options.cwd;
        }
        return configLoader({ cwd });
      }
      exports2.loadConfig = loadConfig2;
      function configLoader(_a) {
        var cwd = _a.cwd, explicitParams = _a.explicitParams, _b = _a.tsConfigLoader, tsConfigLoader = _b === void 0 ? TsConfigLoader.tsConfigLoader : _b;
        if (explicitParams) {
          var absoluteBaseUrl_1 = path2.isAbsolute(explicitParams.baseUrl) ? explicitParams.baseUrl : path2.join(cwd, explicitParams.baseUrl);
          return {
            resultType: "success",
            configFileAbsolutePath: "",
            baseUrl: explicitParams.baseUrl,
            absoluteBaseUrl: absoluteBaseUrl_1,
            paths: explicitParams.paths,
            mainFields: explicitParams.mainFields,
            addMatchAll: explicitParams.addMatchAll
          };
        }
        var loadResult = tsConfigLoader({
          cwd,
          getEnv: function(key) {
            return process.env[key];
          }
        });
        if (!loadResult.tsConfigPath) {
          return {
            resultType: "failed",
            message: "Couldn't find tsconfig.json"
          };
        }
        if (!loadResult.baseUrl) {
          return {
            resultType: "failed",
            message: "Missing baseUrl in compilerOptions"
          };
        }
        var tsConfigDir = path2.dirname(loadResult.tsConfigPath);
        var absoluteBaseUrl = path2.join(tsConfigDir, loadResult.baseUrl);
        return {
          resultType: "success",
          configFileAbsolutePath: loadResult.tsConfigPath,
          baseUrl: loadResult.baseUrl,
          absoluteBaseUrl,
          paths: loadResult.paths || {}
        };
      }
      exports2.configLoader = configLoader;
    });
    var require_register = __commonJS2((exports2) => {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      var match_path_sync_1 = require_match_path_sync();
      var config_loader_1 = require_config_loader();
      var options_1 = require_options();
      var noOp2 = function() {
        return void 0;
      };
      function getCoreModules(builtinModules2) {
        builtinModules2 = builtinModules2 || [
          "assert",
          "buffer",
          "child_process",
          "cluster",
          "crypto",
          "dgram",
          "dns",
          "domain",
          "events",
          "fs",
          "http",
          "https",
          "net",
          "os",
          "path",
          "punycode",
          "querystring",
          "readline",
          "stream",
          "string_decoder",
          "tls",
          "tty",
          "url",
          "util",
          "v8",
          "vm",
          "zlib"
        ];
        var coreModules = {};
        for (var _i = 0, builtinModules_1 = builtinModules2; _i < builtinModules_1.length; _i++) {
          var module_1 = builtinModules_1[_i];
          coreModules[module_1] = true;
        }
        return coreModules;
      }
      function register2(explicitParams) {
        var configLoaderResult = config_loader_1.configLoader({
          cwd: options_1.options.cwd,
          explicitParams
        });
        if (configLoaderResult.resultType === "failed") {
          console.warn(configLoaderResult.message + ". tsconfig-paths will be skipped");
          return noOp2;
        }
        var matchPath = match_path_sync_1.createMatchPath(configLoaderResult.absoluteBaseUrl, configLoaderResult.paths, configLoaderResult.mainFields, configLoaderResult.addMatchAll);
        var Module = require("module");
        var originalResolveFilename = Module._resolveFilename;
        var coreModules = getCoreModules(Module.builtinModules);
        Module._resolveFilename = function(request, _parent) {
          var isCoreModule = coreModules.hasOwnProperty(request);
          if (!isCoreModule) {
            var found = matchPath(request);
            if (found) {
              var modifiedArguments = [found].concat([].slice.call(arguments, 1));
              return originalResolveFilename.apply(this, modifiedArguments);
            }
          }
          return originalResolveFilename.apply(this, arguments);
        };
        return function() {
          Module._resolveFilename = originalResolveFilename;
        };
      }
      exports2.register = register2;
    });
    var require_lib4 = __commonJS2((exports2) => {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      var match_path_sync_1 = require_match_path_sync();
      exports2.createMatchPath = match_path_sync_1.createMatchPath;
      exports2.matchFromAbsolutePaths = match_path_sync_1.matchFromAbsolutePaths;
      var match_path_async_1 = require_match_path_async();
      exports2.createMatchPathAsync = match_path_async_1.createMatchPathAsync;
      exports2.matchFromAbsolutePathsAsync = match_path_async_1.matchFromAbsolutePathsAsync;
      var register_1 = require_register();
      exports2.register = register_1.register;
      var config_loader_1 = require_config_loader();
      exports2.loadConfig = config_loader_1.loadConfig;
    });
    var import_source_map_support = __toModule(require_source_map_support());
    var import_pirates = __toModule(require_lib());
    var _path2 = require("path");
    var _esbuild = require("esbuild");
    var _fs2 = require("fs");
    var _fs3 = _interopRequireDefault2(_fs2);
    var _module2 = require("module");
    var _module3 = _interopRequireDefault2(_module2);
    var _process = require("process");
    var _process2 = _interopRequireDefault2(_process);
    var import_joycon = __toModule(require_lib2());
    var singleComment = Symbol("singleComment");
    var multiComment = Symbol("multiComment");
    var stripWithoutWhitespace = () => "";
    var stripWithWhitespace = (string, start, end) => string.slice(start, end).replace(/\S/g, " ");
    var isEscaped = (jsonString, quotePosition) => {
      let index = quotePosition - 1;
      let backslashCount = 0;
      while (jsonString[index] === "\\") {
        index -= 1;
        backslashCount += 1;
      }
      return Boolean(backslashCount % 2);
    };
    function stripJsonComments(jsonString, { whitespace = true } = {}) {
      if (typeof jsonString !== "string") {
        throw new TypeError(`Expected argument \`jsonString\` to be a \`string\`, got \`${typeof jsonString}\``);
      }
      const strip = whitespace ? stripWithWhitespace : stripWithoutWhitespace;
      let isInsideString = false;
      let isInsideComment = false;
      let offset = 0;
      let result = "";
      for (let index = 0; index < jsonString.length; index++) {
        const currentCharacter = jsonString[index];
        const nextCharacter = jsonString[index + 1];
        if (!isInsideComment && currentCharacter === '"') {
          const escaped = isEscaped(jsonString, index);
          if (!escaped) {
            isInsideString = !isInsideString;
          }
        }
        if (isInsideString) {
          continue;
        }
        if (!isInsideComment && currentCharacter + nextCharacter === "//") {
          result += jsonString.slice(offset, index);
          offset = index;
          isInsideComment = singleComment;
          index++;
        } else if (isInsideComment === singleComment && currentCharacter + nextCharacter === "\r\n") {
          index++;
          isInsideComment = false;
          result += strip(jsonString, offset, index);
          offset = index;
          continue;
        } else if (isInsideComment === singleComment && currentCharacter === "\n") {
          isInsideComment = false;
          result += strip(jsonString, offset, index);
          offset = index;
        } else if (!isInsideComment && currentCharacter + nextCharacter === "/*") {
          result += jsonString.slice(offset, index);
          offset = index;
          isInsideComment = multiComment;
          index++;
          continue;
        } else if (isInsideComment === multiComment && currentCharacter + nextCharacter === "*/") {
          index++;
          isInsideComment = false;
          result += strip(jsonString, offset, index + 1);
          offset = index + 1;
          continue;
        }
      }
      return result + (isInsideComment ? strip(jsonString.slice(offset)) : jsonString.slice(offset));
    }
    var nodeVersion = (process.versions.node.match(/^(\d+)\.(\d+)/) || []).slice(1).map(Number);
    function removeNodePrefix(code) {
      if (nodeVersion[0] <= 14 && nodeVersion[1] < 18) {
        return code.replace(/([\b\(])require\("node:([^"]+)"\)([\b\)])/g, '$1require("$2")$3');
      }
      return code;
    }
    function jsoncParse(data) {
      try {
        return new Function("return " + stripJsonComments(data).trim())();
      } catch (_) {
        return {};
      }
    }
    var joycon = new import_joycon.default();
    joycon.addLoader({
      test: /\.json$/,
      loadSync: (file) => {
        const content = _fs3.default.readFileSync(file, "utf8");
        return jsoncParse(content);
      }
    });
    var getOptions = (cwd) => {
      var _a, _b, _c, _d;
      const { data, path: path2 } = joycon.loadSync(["tsconfig.json", "jsconfig.json"], cwd);
      if (path2 && data) {
        return {
          jsxFactory: (_a = data.compilerOptions) == null ? void 0 : _a.jsxFactory,
          jsxFragment: (_b = data.compilerOptions) == null ? void 0 : _b.jsxFragmentFactory,
          target: (_d = (_c = data.compilerOptions) == null ? void 0 : _c.target) == null ? void 0 : _d.toLowerCase()
        };
      }
      return {};
    };
    var inferPackageFormat = (cwd, filename) => {
      if (filename.endsWith(".mjs")) {
        return "esm";
      }
      if (filename.endsWith(".cjs")) {
        return "cjs";
      }
      const { data } = joycon.loadSync(["package.json"], cwd);
      return data && data.type === "module" && /\.m?js$/.test(filename) ? "esm" : "cjs";
    };
    var import_tsconfig_paths = __toModule(require_lib4());
    var noOp = () => {
    };
    function registerTsconfigPaths() {
      const configLoaderResult = (0, import_tsconfig_paths.loadConfig)(process.cwd());
      if (configLoaderResult.resultType === "failed") {
        return noOp;
      }
      const matchPath = (0, import_tsconfig_paths.createMatchPath)(configLoaderResult.absoluteBaseUrl, configLoaderResult.paths, configLoaderResult.mainFields, configLoaderResult.addMatchAll);
      const Module = require("module");
      const originalResolveFilename = Module._resolveFilename;
      Module._resolveFilename = function(request, _parent) {
        const isCoreModule = _module2.builtinModules.includes(request);
        if (!isCoreModule) {
          const found = matchPath(request);
          if (found) {
            const modifiedArguments = [found, ...[].slice.call(arguments, 1)];
            return originalResolveFilename.apply(this, modifiedArguments);
          }
        }
        return originalResolveFilename.apply(this, arguments);
      };
      return () => {
        Module._resolveFilename = originalResolveFilename;
      };
    }
    var _debug = require_src();
    var _debug2 = _interopRequireDefault2(_debug);
    var debug = _debug2.default.call(void 0, "esbuild-register");
    var IMPORT_META_URL_VARIABLE_NAME = "__esbuild_register_import_meta_url__";
    var map = {};
    function installSourceMapSupport() {
      if (_process2.default.setSourceMapsEnabled) {
        ;
        _process2.default.setSourceMapsEnabled(true);
      } else {
        import_source_map_support.default.install({
          handleUncaughtExceptions: false,
          environment: "node",
          retrieveSourceMap(file) {
            if (map[file]) {
              return {
                url: file,
                map: map[file]
              };
            }
            return null;
          }
        });
      }
    }
    function patchCommonJsLoader(compile) {
      const extensions = _module3.default.Module._extensions;
      const jsHandler = extensions[".js"];
      extensions[".js"] = function(module22, filename) {
        try {
          return jsHandler.call(this, module22, filename);
        } catch (error) {
          if (error.code !== "ERR_REQUIRE_ESM") {
            throw error;
          }
          let content = _fs3.default.readFileSync(filename, "utf8");
          content = compile(content, filename, "cjs");
          module22._compile(content, filename);
        }
      };
      return () => {
        extensions[".js"] = jsHandler;
      };
    }
    var FILE_LOADERS = {
      ".js": "js",
      ".jsx": "jsx",
      ".ts": "ts",
      ".tsx": "tsx",
      ".mjs": "js",
      ".mts": "ts",
      ".cts": "ts"
    };
    var DEFAULT_EXTENSIONS = Object.keys(FILE_LOADERS);
    var getLoader = (filename) => FILE_LOADERS[_path2.extname.call(void 0, filename)];
    function register(esbuildOptions = {}) {
      const {
        extensions = DEFAULT_EXTENSIONS,
        hookIgnoreNodeModules = true,
        hookMatcher,
        ...overrides
      } = esbuildOptions;
      const compile = function compile2(code, filename, format) {
        const define = {
          "import.meta.url": IMPORT_META_URL_VARIABLE_NAME,
          ...overrides.define
        };
        const banner = `const ${IMPORT_META_URL_VARIABLE_NAME} = require('url').pathToFileURL(__filename).href;${overrides.banner || ""}`;
        if (code.includes(banner)) {
          return code;
        }
        const dir = _path2.dirname.call(void 0, filename);
        const options = getOptions(dir);
        format = format != null ? format : inferPackageFormat(dir, filename);
        const result = _esbuild.transformSync.call(void 0, code, {
          sourcefile: filename,
          loader: getLoader(filename),
          sourcemap: "both",
          target: options.target,
          jsxFactory: options.jsxFactory,
          jsxFragment: options.jsxFragment,
          format,
          define,
          banner,
          ...overrides
        });
        const js = result.code;
        debug("compiled %s", filename);
        debug("%s", js);
        const warnings = result.warnings;
        if (warnings && warnings.length > 0) {
          for (const warning of warnings) {
            console.log(warning.location);
            console.log(warning.text);
          }
        }
        if (format === "esm")
          return js;
        return removeNodePrefix(js);
      };
      const revert = (0, import_pirates.addHook)(compile, {
        exts: extensions,
        ignoreNodeModules: hookIgnoreNodeModules,
        matcher: hookMatcher
      });
      installSourceMapSupport();
      const unpatchCommonJsLoader = patchCommonJsLoader(compile);
      const unregisterTsconfigPaths = registerTsconfigPaths();
      return {
        unregister() {
          revert();
          unpatchCommonJsLoader();
          unregisterTsconfigPaths();
        }
      };
    }
    exports.register = register;
  }
});

// src/bin/worker.ts
var path = require("path");
var { isMainThread } = require("worker_threads");
(async () => {
  if (isMainThread)
    return;
  require_node2().register({});
  require(path.resolve(__dirname, `./workerPipeline.js`));
})();
//# sourceMappingURL=worker.js.map
