(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-07c72ca8"],{"06ea":function(t,e,n){},"757f":function(t,e,n){(function(e){t.exports=function(t){function e(r){if(n[r])return n[r].exports;var a=n[r]={i:r,l:!1,exports:{}};return t[r].call(a.exports,a,a.exports,e),a.l=!0,a.exports}var n={};return e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:r})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=3)}([function(t,e,n){"use strict";function r(){return window.google&&window.google.charts?Promise.resolve(window.google.charts):(c||(c=new Promise((function(t){var e=document.createElement("script");e.type="text/javascript",e.onload=function(){return t(window.google.charts)},e.src=i,document.body.appendChild(e)}))),c)}function a(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"current",e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return r().then((function(n){if("object"!==(void 0===e?"undefined":o(e)))throw new Error("Google Charts loader: settings must be an object");var r=t+"_"+JSON.stringify(e,Object.keys(e).sort());if(s.has(r))return s.get(r);var a=new Promise((function(r){n.load(t,e),n.setOnLoadCallback((function(){return r(window.google)}))}));return s.set(r,a),a}))}e.a=a;var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i="https://www.gstatic.com/charts/loader.js",c=null,s=new Map},function(t,e,n){var r=n(5)(n(4),n(6),null,null);t.exports=r.exports},function(t,e){t.exports=function(t,e,n){function r(){var u=Date.now()-c;u<e&&u>=0?a=setTimeout(r,e-u):(a=null,n||(s=t.apply(i,o),i=o=null))}var a,o,i,c,s;null==e&&(e=100);var u=function(){i=this,o=arguments,c=Date.now();var u=n&&!a;return a||(a=setTimeout(r,e)),u&&(s=t.apply(i,o),i=o=null),s};return u.clear=function(){a&&(clearTimeout(a),a=null)},u.flush=function(){a&&(s=t.apply(i,o),i=o=null,clearTimeout(a),a=null)},u}},function(t,n,r){"use strict";function a(t){t.component("GChart",c.a)}Object.defineProperty(n,"__esModule",{value:!0}),n.install=a;var o=r(0),i=r(1),c=r.n(i);r.d(n,"loadGoogleCharts",(function(){return o.a})),r.d(n,"GChart",(function(){return c.a}));var s={version:"0.3.3",install:a};n.default=s;var u=null;"undefined"!=typeof window?u=window.Vue:"undefined"!=typeof e&&(u=e.Vue),u&&u.use(s)},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(0),a=n(2),o=n.n(a),i=function(){function t(t,e){var n=[],r=!0,a=!1,o=void 0;try{for(var i,c=t[Symbol.iterator]();!(r=(i=c.next()).done)&&(n.push(i.value),!e||n.length!==e);r=!0);}catch(s){a=!0,o=s}finally{try{!r&&c.return&&c.return()}finally{if(a)throw o}}return n}return function(e,n){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},s=null;e.default={name:"GChart",props:{type:{type:String},data:{type:[Array,Object],default:function(){return[]}},options:{type:Object,default:function(){return{}}},version:{type:String,default:"current"},settings:{type:Object,default:function(){return{packages:["corechart","table"]}}},events:{type:Object},createChart:{type:Function},resizeDebounce:{type:Number,default:200}},data:function(){return{chartObject:null}},watch:{data:{deep:!0,handler:function(){this.drawChart()}},options:{deep:!0,handler:function(){this.drawChart()}},type:function(t){this.createChartObject(),this.drawChart()}},mounted:function(){var t=this;n.i(r.a)(this.version,this.settings).then((function(e){s=e;var n=t.createChartObject();t.$emit("ready",n,e),t.drawChart()})),this.resizeDebounce>0&&window.addEventListener("resize",o()(this.drawChart,this.resizeDebounce))},beforeDestroy:function(){this.chartObject&&"function"==typeof this.chartObject.clearChart&&this.chartObject.clearChart()},methods:{drawChart:function(){if(s&&this.chartObject){var t=this.getValidChartData();t&&this.chartObject.draw(t,this.options)}},getValidChartData:function(){return this.data instanceof s.visualization.DataTable||this.data instanceof s.visualization.DataView?this.data:Array.isArray(this.data)?s.visualization.arrayToDataTable(this.data):null!==this.data&&"object"===c(this.data)?new s.visualization.DataTable(this.data):null},createChartObject:function(){var t=function(t,e,n){if(!n)throw new Error("please, provide chart type property");return new e.visualization[n](t)},e=this.createChart||t;return this.chartObject=e(this.$refs.chart,s,this.type),this.attachListeners(),this.chartObject},attachListeners:function(){var t=this;this.events&&Object.entries(this.events).forEach((function(e){var n=i(e,2),r=n[0],a=n[1];s.visualization.events.addListener(t.chartObject,r,a)}))}}}},function(t,e){t.exports=function(t,e,n,r){var a,o=t=t||{},i=typeof t.default;"object"!==i&&"function"!==i||(a=t,o=t.default);var c="function"==typeof o?o.options:o;if(e&&(c.render=e.render,c.staticRenderFns=e.staticRenderFns),n&&(c._scopeId=n),r){var s=c.computed||(c.computed={});Object.keys(r).forEach((function(t){var e=r[t];s[t]=function(){return e}}))}return{esModule:a,exports:o,options:c}}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{ref:"chart"})},staticRenderFns:[]}}])}).call(this,n("c8ba"))},"9f63":function(t,e,n){"use strict";n("06ea")},cb43:function(t,e,n){"use strict";var r=n("757f");n.o(r,"GChart")&&n.d(e,"GChart",(function(){return r["GChart"]}))},cd56:function(t,e,n){"use strict";n.r(e);var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"container"},[n("h1",[t._v("메인 페이지")]),n("section",{staticClass:"chart-wrap"},[n("div",{staticClass:"line"},[n("GChart",{attrs:{type:"LineChart",data:t.chartData,options:t.chartOptions}})],1),n("div",{staticClass:"bar"},[n("GChart",{attrs:{type:"BarChart",data:t.chartData2,options:t.chartOptions2}})],1)])])},a=[],o=n("cb43"),i={components:{GChart:o["GChart"]},data:function(){return{chartData:[["Year","hi","Ess","Pr"],["2017",1030,540,350],["2018",1e3,400,200],["2019",1170,460,250],["2020",660,1120,300]],chartData2:[["Year","av","vs","kr"],["2017",1030,540,350],["2018",1e3,400,200],["2019",1170,460,250],["2020",660,1120,300]],chartOptions:{chart:{title:"Company Performance",subtitle:"yo, Expenses, and Profit: 2017-2020"}},chartOptions2:{chart:{title:"Company Performance",subtitle:"hi, my, ass"}}}}},c=i,s=(n("9f63"),n("2877")),u=Object(s["a"])(c,r,a,!1,null,"4bae5f53",null);e["default"]=u.exports}}]);
//# sourceMappingURL=chunk-07c72ca8.c600d042.js.map