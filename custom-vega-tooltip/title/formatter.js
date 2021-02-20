!(function (t, e) {
  "object" == typeof exports && "undefined" != typeof module
    ? e(exports, require("vega-util"))
    : "function" == typeof define && define.amd
    ? define(["exports", "vega-util"], e)
    : e(
        ((t =
          "undefined" != typeof globalThis
            ? globalThis
            : t || self).vegaTooltip = {}),
        t.vega
      );
})(this, function (t, e) {
  "use strict";
  var n = "0.25.0",
    i = function () {
      return (i =
        Object.assign ||
        function (t) {
          for (var e, n = 1, i = arguments.length; n < i; n++)
            for (var o in (e = arguments[n]))
              Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
          return t;
        }).apply(this, arguments);
    };
  var o = "vg-tooltip-element",
    l = {
      offsetX: 10,
      offsetY: 10,
      id: o,
      styleId: "vega-tooltip-style",
      theme: "light",
      disableDefaultStyle: !1,
      sanitize: r,
      maxDepth: 2,
    };
  function r(t) {
    return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  }
  function s(t) {
    if (!/^[A-Za-z]+[-:.\w]*$/.test(t)) throw new Error("Invalid HTML ID");
    return "#vg-tooltip-element {\n  visibility: hidden;\n  padding: 8px;\n  position: fixed;\n  z-index: 1000;\n  font-family: sans-serif;\n  font-size: 11px;\n  border-radius: 3px;\n  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);\n  /* The default theme is the light theme. */\n  background-color: rgba(255, 255, 255, 0.95);\n  border: 1px solid #d9d9d9;\n  color: black; }\n  #vg-tooltip-element.visible {\n    visibility: visible; }\n  #vg-tooltip-element h2 {\n    margin-top: 0;\n    margin-bottom: 10px;\n    font-size: 13px; }\n  #vg-tooltip-element img {\n    max-width: 200px;\n    max-height: 200px; }\n  #vg-tooltip-element table {\n    border-spacing: 0; }\n    #vg-tooltip-element table tr {\n      border: none; }\n      #vg-tooltip-element table tr td {\n        overflow: hidden;\n        text-overflow: ellipsis;\n        padding-top: 2px;\n        padding-bottom: 2px; }\n        #vg-tooltip-element table tr td.key {\n          color: #808080;\n          max-width: 150px;\n          text-align: right;\n          padding-right: 4px; }\n        #vg-tooltip-element table tr td.value {\n          display: block;\n          max-width: 300px;\n          max-height: 7em;\n          text-align: left; }\n  #vg-tooltip-element.dark-theme {\n    background-color: rgba(32, 32, 32, 0.9);\n    border: 1px solid #f5f5f5;\n    color: white; }\n    #vg-tooltip-element.dark-theme td.key {\n      color: #bfbfbf; }\n"
      .toString()
      .replace(o, t);
  }
  function a(t, n, i) {
    if (e.isArray(t))
      return (
        "[" +
        t
          .map(function (t) {
            return n(e.isString(t) ? t : p(t, i));
          })
          .join(", ") +
        "]"
      );
    if (e.isObject(t)) {
      var o = "",
        l = t,
        r = l.title,
        s = l.image,
        a = (function (t, e) {
          var n = {};
          for (var i in t)
            Object.prototype.hasOwnProperty.call(t, i) &&
              e.indexOf(i) < 0 &&
              (n[i] = t[i]);
          if (null != t && "function" == typeof Object.getOwnPropertySymbols) {
            var o = 0;
            for (i = Object.getOwnPropertySymbols(t); o < i.length; o++)
              e.indexOf(i[o]) < 0 &&
                Object.prototype.propertyIsEnumerable.call(t, i[o]) &&
                (n[i[o]] = t[i[o]]);
          }
          return n;
        })(l, ["title", "image"]);
      r && (o += "<h2>" + n(r) + "</h2>"),
        s && (o += '<img src="' + n(s) + '">');
      var d = Object.keys(a);
      if (d.length > 0) {
        o += "<table>";
        for (var h = 0, c = d; h < c.length; h++) {
          var f = c[h],
            u = a[f];
          void 0 !== u &&
            (e.isObject(u) && (u = p(u, i)),
            (o +=
              '<tr><td class="key">' +
              n(f) +
              ':</td><td class="value">' +
              n(u) +
              "</td></tr>"));
        }
        o += "</table>";
      }
      return o || "{}";
    }
    return n(t);
  }
  function d(t) {
    var e = [];
    return function (n, i) {
      if ("object" != typeof i || null === i) return i;
      var o = e.indexOf(this) + 1;
      return (
        (e.length = o),
        e.length > t
          ? "[Object]"
          : e.indexOf(i) >= 0
          ? "[Circular]"
          : (e.push(i), i)
      );
    };
  }
  function p(t, e) {
    return JSON.stringify(t, d(e));
  }
  function h(t, e, n, i) {
    var o = t.clientX + n;
    o + e.width > window.innerWidth && (o = +t.clientX - n - e.width);
    var l = t.clientY + i;
    return (
      l + e.height > window.innerHeight && (l = +t.clientY - i - e.height),
      { x: o, y: l }
    );
  }
  var c = (function () {
      function t(t) {
        this.options = i(i({}, l), t);
        var e = this.options.id;
        if (
          ((this.el = null),
          (this.call = this.tooltipHandler.bind(this)),
          !this.options.disableDefaultStyle &&
            !document.getElementById(this.options.styleId))
        ) {
          var n = document.createElement("style");
          n.setAttribute("id", this.options.styleId), (n.innerHTML = s(e));
          var o = document.head;
          o.childNodes.length > 0
            ? o.insertBefore(n, o.childNodes[0])
            : o.appendChild(n);
        }
      }
      return (
        (t.prototype.tooltipHandler = function (t, e, n, i) {
          if (
            ((this.el = document.getElementById(this.options.id)),
            this.el ||
              ((this.el = document.createElement("div")),
              this.el.setAttribute("id", this.options.id),
              this.el.classList.add("vg-tooltip"),
              document.body.appendChild(this.el)),
            (null != document.fullscreenElement
              ? document.fullscreenElement
              : document.body
            ).appendChild(this.el),
            null != i && "" !== i)
          ) {
            (this.el.innerHTML = a(
              i,
              this.options.sanitize,
              this.options.maxDepth
            )),
              this.el.classList.add("visible", this.options.theme + "-theme");
            var o = h(
                e,
                this.el.getBoundingClientRect(),
                this.options.offsetX,
                this.options.offsetY
              ),
              l = o.x,
              r = o.y;
            this.el.setAttribute(
              "style",
              "top: " + r + "px; left: " + l + "px"
            );
          } else
            this.el.classList.remove("visible", this.options.theme + "-theme");
        }),
        t
      );
    })(),
    f = n;
  (t.DEFAULT_OPTIONS = l),
    (t.Handler = c),
    (t.calculatePosition = h),
    (t.createDefaultStyle = s),
    (t.default = function (t, e) {
      var n = new c(e);
      return t.tooltip(n.call).run(), n;
    }),
    (t.escapeHTML = r),
    (t.formatValue = a),
    (t.replacer = d),
    (t.stringify = p),
    (t.version = f),
    Object.defineProperty(t, "__esModule", { value: !0 });
});
