import{o as pp,_ as be,R as da}from"./vendor-DhuH0n_x.js";const mp=()=>{};var bu={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hl=function(n){const e=[];let t=0;for(let r=0;r<n.length;r++){let s=n.charCodeAt(r);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},gp=function(n){const e=[];let t=0,r=0;for(;t<n.length;){const s=n[t++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){const i=n[t++];e[r++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){const i=n[t++],a=n[t++],c=n[t++],l=((s&7)<<18|(i&63)<<12|(a&63)<<6|c&63)-65536;e[r++]=String.fromCharCode(55296+(l>>10)),e[r++]=String.fromCharCode(56320+(l&1023))}else{const i=n[t++],a=n[t++];e[r++]=String.fromCharCode((s&15)<<12|(i&63)<<6|a&63)}}return e.join("")},Gl={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<n.length;s+=3){const i=n[s],a=s+1<n.length,c=a?n[s+1]:0,l=s+2<n.length,f=l?n[s+2]:0,p=i>>2,m=(i&3)<<4|c>>4;let v=(c&15)<<2|f>>6,V=f&63;l||(V=64,a||(v=64)),r.push(t[p],t[m],t[v],t[V])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(Hl(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):gp(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<n.length;){const i=t[n.charAt(s++)],c=s<n.length?t[n.charAt(s)]:0;++s;const f=s<n.length?t[n.charAt(s)]:64;++s;const m=s<n.length?t[n.charAt(s)]:64;if(++s,i==null||c==null||f==null||m==null)throw new _p;const v=i<<2|c>>4;if(r.push(v),f!==64){const V=c<<4&240|f>>2;if(r.push(V),m!==64){const C=f<<6&192|m;r.push(C)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class _p extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const yp=function(n){const e=Hl(n);return Gl.encodeByteArray(e,!0)},di=function(n){return yp(n).replace(/\./g,"")},Kl=function(n){try{return Gl.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ep(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wp=()=>Ep().__FIREBASE_DEFAULTS__,Tp=()=>{if(typeof process>"u"||typeof bu>"u")return;const n=bu.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},vp=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&Kl(n[1]);return e&&JSON.parse(e)},Li=()=>{try{return mp()||wp()||Tp()||vp()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},Ql=n=>{var e,t;return(t=(e=Li())==null?void 0:e.emulatorHosts)==null?void 0:t[n]},Ip=n=>{const e=Ql(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},Xl=()=>{var n;return(n=Li())==null?void 0:n.config},Jl=n=>{var e;return(e=Li())==null?void 0:e[`_${n}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ap{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bp(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},r=e||"demo-project",s=n.iat||0,i=n.sub||n.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a={iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}},...n};return[di(JSON.stringify(t)),di(JSON.stringify(a)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ne(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Rp(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Ne())}function Pp(){var e;const n=(e=Li())==null?void 0:e.forceEnvironment;if(n==="node")return!0;if(n==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Vp(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Sp(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function Cp(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function xp(){const n=Ne();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function Np(){return!Pp()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function kp(){try{return typeof indexedDB=="object"}catch{return!1}}function Dp(){return new Promise((n,e)=>{try{let t=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{var i;e(((i=s.error)==null?void 0:i.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Op="FirebaseError";class Nt extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=Op,Object.setPrototypeOf(this,Nt.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,_s.prototype.create)}}class _s{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){const r=t[0]||{},s=`${this.service}/${e}`,i=this.errors[e],a=i?Lp(i,r):"Error",c=`${this.serviceName}: ${a} (${s}).`;return new Nt(s,c,r)}}function Lp(n,e){try{let t=0,r="";for(;t<n.length;){const s=n.indexOf("{$",t);if(s===-1){r+=n.substring(t);break}const i=n.indexOf("}",s+2);if(i===-1){r+=n.substring(t);break}const a=n.substring(s+2,i),c=e[a];r+=n.substring(t,s)+(c!=null?String(c):`<${a}?>`),t=i+1}return r}catch{return n}}function Mp(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function In(n,e){if(n===e)return!0;const t=Object.keys(n),r=Object.keys(e);for(const s of t){if(!r.includes(s))return!1;const i=n[s],a=e[s];if(Ru(i)&&Ru(a)){if(!In(i,a))return!1}else if(i!==a)return!1}for(const s of r)if(!t.includes(s))return!1;return!0}function Ru(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ys(n){const e=[];for(const[t,r]of Object.entries(n))Array.isArray(r)?r.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function Up(n,e){const t=new Fp(n,e);return t.subscribe.bind(t)}class Fp{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let s;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");Bp(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:r},s.next===void 0&&(s.next=xo),s.error===void 0&&(s.error=xo),s.complete===void 0&&(s.complete=xo);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Bp(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function xo(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xe(n){return n&&n._delegate?n._delegate:n}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Es(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Yl(n){return(await fetch(n,{credentials:"include"})).ok}class An{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mn="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $p{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const r=new Ap;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(e==null?void 0:e.optional)??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(s){if(r)return null;throw s}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(jp(e))try{this.getOrInitializeService({instanceIdentifier:mn})}catch{}for(const[t,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const i=this.getOrInitializeService({instanceIdentifier:s});r.resolve(i)}catch{}}}}clearInstance(e=mn){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=mn){return this.instances.has(e)}getOptions(e=mn){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:t});for(const[i,a]of this.instancesDeferred.entries()){const c=this.normalizeInstanceIdentifier(i);r===c&&a.resolve(s)}return s}onInit(e,t){const r=this.normalizeInstanceIdentifier(t),s=this.onInitCallbacks.get(r)??new Set;s.add(e),this.onInitCallbacks.set(r,s);const i=this.instances.get(r);return i&&e(i,r),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){const r=this.onInitCallbacks.get(t);if(r)for(const s of r)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:qp(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=mn){return this.component?this.component.multipleInstances?e:mn:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function qp(n){return n===mn?void 0:n}function jp(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zp{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new $p(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Y;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(Y||(Y={}));const Wp={debug:Y.DEBUG,verbose:Y.VERBOSE,info:Y.INFO,warn:Y.WARN,error:Y.ERROR,silent:Y.SILENT},Hp=Y.INFO,Gp={[Y.DEBUG]:"log",[Y.VERBOSE]:"log",[Y.INFO]:"info",[Y.WARN]:"warn",[Y.ERROR]:"error"},Kp=(n,e,...t)=>{if(e<n.logLevel)return;const r=new Date().toISOString(),s=Gp[e];if(s)console[s](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class pa{constructor(e){this.name=e,this._logLevel=Hp,this._logHandler=Kp,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in Y))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Wp[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,Y.DEBUG,...e),this._logHandler(this,Y.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,Y.VERBOSE,...e),this._logHandler(this,Y.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,Y.INFO,...e),this._logHandler(this,Y.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,Y.WARN,...e),this._logHandler(this,Y.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,Y.ERROR,...e),this._logHandler(this,Y.ERROR,...e)}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qp{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(Xp(t)){const r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}}function Xp(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const qo="@firebase/app",Pu="0.16.3";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pt=new pa("@firebase/app"),Jp="@firebase/app-compat",Yp="@firebase/analytics-compat",Zp="@firebase/analytics",em="@firebase/app-check-compat",tm="@firebase/app-check",nm="@firebase/auth",rm="@firebase/auth-compat",sm="@firebase/database",im="@firebase/data-connect",om="@firebase/database-compat",am="@firebase/functions",cm="@firebase/functions-compat",um="@firebase/installations",lm="@firebase/installations-compat",hm="@firebase/messaging",fm="@firebase/messaging-compat",dm="@firebase/performance",pm="@firebase/performance-compat",mm="@firebase/remote-config",gm="@firebase/remote-config-compat",_m="@firebase/storage",ym="@firebase/storage-compat",Em="@firebase/firestore",wm="@firebase/ai",Tm="@firebase/firestore-compat",vm="firebase",Im="13.0.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jo="[DEFAULT]",Am={[qo]:"fire-core",[Jp]:"fire-core-compat",[Zp]:"fire-analytics",[Yp]:"fire-analytics-compat",[tm]:"fire-app-check",[em]:"fire-app-check-compat",[nm]:"fire-auth",[rm]:"fire-auth-compat",[sm]:"fire-rtdb",[im]:"fire-data-connect",[om]:"fire-rtdb-compat",[am]:"fire-fn",[cm]:"fire-fn-compat",[um]:"fire-iid",[lm]:"fire-iid-compat",[hm]:"fire-fcm",[fm]:"fire-fcm-compat",[dm]:"fire-perf",[pm]:"fire-perf-compat",[mm]:"fire-rc",[gm]:"fire-rc-compat",[_m]:"fire-gcs",[ym]:"fire-gcs-compat",[Em]:"fire-fst",[Tm]:"fire-fst-compat",[wm]:"fire-vertex","fire-js":"fire-js",[vm]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wr=new Map,bm=new Map,zo=new Map;function Vu(n,e){try{n.container.addComponent(e)}catch(t){Pt.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function Qn(n){const e=n.name;if(zo.has(e))return Pt.debug(`There were multiple attempts to register component ${e}.`),!1;zo.set(e,n);for(const t of Wr.values())Vu(t,n);for(const t of bm.values())Vu(t,n);return!0}function ma(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function Ze(n){return n==null?!1:n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rm={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Et=new _s("app","Firebase",Rm);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pm{constructor(e,t,r){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new An("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Et.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sr=Im;function Vm(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const r={name:jo,automaticDataCollectionEnabled:!0,...e},s=r.name;if(typeof s!="string"||!s)throw Et.create("bad-app-name",{appName:String(s)});if(t||(t=Xl()),!t)throw Et.create("no-options");const i=Wr.get(s);if(i)if(In(t,i.options)){if(In(r,i.config))return i;throw Et.create("duplicate-app",{appName:s,mismatchedParam:"config",oldValue:JSON.stringify(i.config),newValue:JSON.stringify(r)})}else throw Et.create("duplicate-app",{appName:s,mismatchedParam:"options",oldValue:JSON.stringify(i.options),newValue:JSON.stringify(t)});const a=new zp(s);for(const l of zo.values())a.addComponent(l);const c=new Pm(t,r,a);return Wr.set(s,c),c}function Zl(n=jo){const e=Wr.get(n);if(!e&&n===jo&&Xl())return Vm();if(!e)throw Et.create("no-app",{appName:n});return e}function OT(){return Array.from(Wr.values())}function Ht(n,e,t){let r=Am[n]??n;t&&(r+=`-${t}`);const s=r.match(/\s|\//),i=e.match(/\s|\//);if(s||i){const a=[`Unable to register library "${r}" with version "${e}":`];s&&a.push(`library name "${r}" contains illegal characters (whitespace or "/")`),s&&i&&a.push("and"),i&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Pt.warn(a.join(" "));return}Qn(new An(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sm="firebase-heartbeat-database",Cm=1,Hr="firebase-heartbeat-store";let No=null;function eh(){return No||(No=pp(Sm,Cm,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(Hr)}catch(t){console.warn(t)}}}}).catch(n=>{throw Et.create("idb-open",{originalErrorMessage:n.message})})),No}async function xm(n){try{const t=(await eh()).transaction(Hr),r=await t.objectStore(Hr).get(th(n));return await t.done,r}catch(e){if(e instanceof Nt)Pt.warn(e.message);else{const t=Et.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Pt.warn(t.message)}}}async function Su(n,e){try{const r=(await eh()).transaction(Hr,"readwrite");await r.objectStore(Hr).put(e,th(n)),await r.done}catch(t){if(t instanceof Nt)Pt.warn(t.message);else{const r=Et.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});Pt.warn(r.message)}}}function th(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nm=1024,km=30;class Dm{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new Lm(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,t;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=Cu();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(a=>a.date===i))return;if(this._heartbeatsCache.heartbeats.push({date:i,agent:s}),this._heartbeatsCache.heartbeats.length>km){const a=Mm(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){Pt.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=Cu(),{heartbeatsToSend:r,unsentEntries:s}=Om(this._heartbeatsCache.heartbeats),i=di(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(t){return Pt.warn(t),""}}}function Cu(){return new Date().toISOString().substring(0,10)}function Om(n,e=Nm){const t=[];let r=n.slice();for(const s of n){const i=t.find(a=>a.agent===s.agent);if(i){if(i.dates.push(s.date),xu(t)>e){i.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),xu(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}class Lm{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return kp()?Dp().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await xm(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return Su(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return Su(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function xu(n){return di(JSON.stringify({version:2,heartbeats:n})).length}function Mm(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let r=1;r<n.length;r++)n[r].date<t&&(t=n[r].date,e=r);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Um(n){Qn(new An("platform-logger",e=>new Qp(e),"PRIVATE")),Qn(new An("heartbeat",e=>new Dm(e),"PRIVATE")),Ht(qo,Pu,n),Ht(qo,Pu,"esm2020"),Ht("fire-js","")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Um("");var Fm="firebase",Bm="13.0.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Ht(Fm,Bm,"app");function nh(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const $m=nh,rh=new _s("auth","Firebase",nh());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pi=new pa("@firebase/auth");function ti(n,...e){pi.logLevel<=Y.WARN&&pi.warn(`Auth (${sr}): ${n}`,...e)}function ni(n,...e){pi.logLevel<=Y.ERROR&&pi.error(`Auth (${sr}): ${n}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mt(n,...e){throw ga(n,...e)}function st(n,...e){return ga(n,...e)}function Mi(n,e,t){const r={...$m(),[e]:t};return new _s("auth","Firebase",r).create(e,{appName:n.name})}function Gt(n){return Mi(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function sh(n,e,t){const r=t;if(!(e instanceof r))throw r.name!==e.constructor.name&&mt(n,"argument-error"),Mi(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function ga(n,...e){if(typeof n!="string"){const t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(t,...r)}return rh.create(n,...e)}function z(n,e,...t){if(!n)throw ga(e,...t)}function wt(n){const e="INTERNAL ASSERTION FAILED: "+n;throw ni(e),new Error(e)}function Vt(n,e){n||wt(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wo(){var n;return typeof self<"u"&&((n=self.location)==null?void 0:n.href)||""}function qm(){return Nu()==="http:"||Nu()==="https:"}function Nu(){var n;return typeof self<"u"&&((n=self.location)==null?void 0:n.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jm(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(qm()||Sp()||"connection"in navigator)?navigator.onLine:!0}function zm(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ws{constructor(e,t){this.shortDelay=e,this.longDelay=t,Vt(t>e,"Short delay should be less than long delay!"),this.isMobile=Rp()||Cp()}get(){return jm()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _a(n,e){Vt(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ih{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;wt("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;wt("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;wt("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wm={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hm=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Gm=new ws(3e4,6e4);function ya(n,e){return n.tenantId&&!e.tenantId?{...e,tenantId:n.tenantId}:e}async function ir(n,e,t,r,s={}){return oh(n,s,async()=>{let i={},a={};r&&(e==="GET"?a=r:i={body:JSON.stringify(r)});const c=ys({...a,key:n.config.apiKey}).slice(1),l=await n._getAdditionalHeaders();l["Content-Type"]="application/json",n.languageCode&&(l["X-Firebase-Locale"]=n.languageCode);const f={method:e,headers:l,...i};return Vp()||(f.referrerPolicy="strict-origin-when-cross-origin"),n.emulatorConfig&&Es(n.emulatorConfig.host)&&(f.credentials="include"),ih.fetch()(await ah(n,n.config.apiHost,t,c),f)})}async function oh(n,e,t){n._canInitEmulator=!1;const r={...Wm,...e};try{const s=new Qm(n),i=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();const a=await i.json();if("needConfirmation"in a)throw Ks(n,"account-exists-with-different-credential",a);if(i.ok&&!("errorMessage"in a))return a;{const c=i.ok?a.errorMessage:a.error.message,[l,f]=c.split(" : ");if(l==="FEDERATED_USER_ID_ALREADY_LINKED")throw Ks(n,"credential-already-in-use",a);if(l==="EMAIL_EXISTS")throw Ks(n,"email-already-in-use",a);if(l==="USER_DISABLED")throw Ks(n,"user-disabled",a);const p=r[l]||l.toLowerCase().replace(/[_\s]+/g,"-");if(f)throw Mi(n,p,f);mt(n,p)}}catch(s){if(s instanceof Nt)throw s;mt(n,"network-request-failed",{message:String(s)})}}async function Km(n,e,t,r,s={}){const i=await ir(n,e,t,r,s);return"mfaPendingCredential"in i&&mt(n,"multi-factor-auth-required",{_serverResponse:i}),i}async function ah(n,e,t,r){const s=`${e}${t}?${r}`,i=n,a=i.config.emulator?_a(n.config,s):`${n.config.apiScheme}://${s}`;return Hm.includes(t)&&(await i._persistenceManagerAvailable,i._getPersistenceType()==="COOKIE")?i._getPersistence()._getFinalTarget(a).toString():a}class Qm{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(st(this.auth,"network-request-failed")),Gm.get())})}}function Ks(n,e,t){const r={appName:n.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);const s=st(n,e,r);return s.customData._tokenResponse=t,s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Xm(n,e){return ir(n,"POST","/v1/accounts:delete",e)}async function mi(n,e){return ir(n,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mr(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Jm(n,e=!1){const t=Xe(n),r=await t.getIdToken(e),s=Ea(r);z(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");const i=typeof s.firebase=="object"?s.firebase:void 0,a=i==null?void 0:i.sign_in_provider;return{claims:s,token:r,authTime:Mr(ko(s.auth_time)),issuedAtTime:Mr(ko(s.iat)),expirationTime:Mr(ko(s.exp)),signInProvider:a||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function ko(n){return Number(n)*1e3}function Ea(n){const[e,t,r]=n.split(".");if(e===void 0||t===void 0||r===void 0)return ni("JWT malformed, contained fewer than 3 sections"),null;try{const s=Kl(t);return s?JSON.parse(s):(ni("Failed to decode base64 JWT payload"),null)}catch(s){return ni("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function ku(n){const e=Ea(n);return z(e,"internal-error"),z(typeof e.exp<"u","internal-error"),z(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Gr(n,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof Nt&&Ym(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function Ym({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zm{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ho{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Mr(this.lastLoginAt),this.creationTime=Mr(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function gi(n){var m;const e=n.auth,t=await n.getIdToken(),r=await Gr(n,mi(e,{idToken:t}));z(r==null?void 0:r.users.length,e,"internal-error");const s=r.users[0];n._notifyReloadListener(s);const i=(m=s.providerUserInfo)!=null&&m.length?ch(s.providerUserInfo):[],a=tg(n.providerData,i),c=n.isAnonymous,l=!(n.email&&s.passwordHash)&&!(a!=null&&a.length),f=c?l:!1,p={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:a,metadata:new Ho(s.createdAt,s.lastLoginAt),isAnonymous:f};Object.assign(n,p)}async function eg(n){const e=Xe(n);await gi(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function tg(n,e){return[...n.filter(r=>!e.some(s=>s.providerId===r.providerId)),...e]}function ch(n){return n.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ng(n,e){const t=await oh(n,{},async()=>{const r=ys({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:i}=n.config,a=await ah(n,s,"/v1/token",`key=${i}`),c=await n._getAdditionalHeaders();c["Content-Type"]="application/x-www-form-urlencoded";const l={method:"POST",headers:c,body:r};return n.emulatorConfig&&Es(n.emulatorConfig.host)&&(l.credentials="include"),ih.fetch()(a,l)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function rg(n,e){return ir(n,"POST","/v2/accounts:revokeToken",ya(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zn{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){z(e.idToken,"internal-error"),z(typeof e.idToken<"u","internal-error"),z(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):ku(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){z(e.length!==0,"internal-error");const t=ku(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(z(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:r,refreshToken:s,expiresIn:i}=await ng(e,t);this.updateTokensAndExpiration(r,s,Number(i))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){const{refreshToken:r,accessToken:s,expirationTime:i}=t,a=new zn;return r&&(z(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),s&&(z(typeof s=="string","internal-error",{appName:e}),a.accessToken=s),i&&(z(typeof i=="number","internal-error",{appName:e}),a.expirationTime=i),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new zn,this.toJSON())}_performRefresh(){return wt("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ft(n,e){z(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class nt{constructor({uid:e,auth:t,stsTokenManager:r,...s}){this.providerId="firebase",this.proactiveRefresh=new Zm(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new Ho(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const t=await Gr(this,this.stsTokenManager.getToken(this.auth,e));return z(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return Jm(this,e)}reload(){return eg(this)}_assign(e){this!==e&&(z(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new nt({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){z(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await gi(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Ze(this.auth.app))return Promise.reject(Gt(this.auth));const e=await this.getIdToken();return await Gr(this,Xm(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const r=t.displayName??void 0,s=t.email??void 0,i=t.phoneNumber??void 0,a=t.photoURL??void 0,c=t.tenantId??void 0,l=t._redirectEventId??void 0,f=t.createdAt??void 0,p=t.lastLoginAt??void 0,{uid:m,emailVerified:v,isAnonymous:V,providerData:C,stsTokenManager:M}=t;z(m&&M,e,"internal-error");const O=zn.fromJSON(this.name,M);z(typeof m=="string",e,"internal-error"),Ft(r,e.name),Ft(s,e.name),z(typeof v=="boolean",e,"internal-error"),z(typeof V=="boolean",e,"internal-error"),Ft(i,e.name),Ft(a,e.name),Ft(c,e.name),Ft(l,e.name),Ft(f,e.name),Ft(p,e.name);const H=new nt({uid:m,auth:e,email:s,emailVerified:v,displayName:r,isAnonymous:V,photoURL:a,phoneNumber:i,tenantId:c,stsTokenManager:O,createdAt:f,lastLoginAt:p});return C&&Array.isArray(C)&&(H.providerData=C.map(J=>({...J}))),l&&(H._redirectEventId=l),H}static async _fromIdTokenResponse(e,t,r=!1){const s=new zn;s.updateFromServerResponse(t);const i=new nt({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:r});return await gi(i),i}static async _fromGetAccountInfoResponse(e,t,r){const s=t.users[0];z(s.localId!==void 0,"internal-error");const i=s.providerUserInfo!==void 0?ch(s.providerUserInfo):[],a=!(s.email&&s.passwordHash)&&!(i!=null&&i.length),c=new zn;c.updateFromIdToken(r);const l=new nt({uid:s.localId,auth:e,stsTokenManager:c,isAnonymous:a}),f={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:i,metadata:new Ho(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(i!=null&&i.length)};return Object.assign(l,f),l}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Du=new Map;function Tt(n){Vt(n instanceof Function,"Expected a class definition");let e=Du.get(n);return e?(Vt(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,Du.set(n,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uh{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}uh.type="NONE";const Ou=uh;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ri(n,e,t){return`firebase:${n}:${e}:${t}`}class En{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;const{config:s,name:i}=this.auth;this.fullUserKey=ri(this.userKey,s.apiKey,i),this.fullPersistenceKey=ri("persistence",s.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t);try{this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}catch{}}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await mi(this.auth,{idToken:e}).catch(()=>{});return t?nt._fromGetAccountInfoResponse(this.auth,t,e):null}return nt._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){try{this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}catch{}}static async create(e,t,r="authUser"){if(!t.length)return new En(Tt(Ou),e,r);const s=(await Promise.all(t.map(async f=>{try{if(await f._isAvailable())return f}catch{return}}))).filter(f=>f);let i=s[0]||Tt(Ou);const a=ri(r,e.config.apiKey,e.name);let c=null;for(const f of t)try{const p=await f._get(a);if(p){let m;if(typeof p=="string"){const v=await mi(e,{idToken:p}).catch(()=>{});if(!v)break;m=await nt._fromGetAccountInfoResponse(e,v,p)}else m=nt._fromJSON(e,p);f!==i&&(c=m),i=f;break}}catch{}const l=s.filter(f=>f._shouldAllowMigration);return!i._shouldAllowMigration||!l.length?new En(i,e,r):(i=l[0],c&&await i._set(a,c.toJSON()),await Promise.all(t.map(async f=>{if(f!==i)try{await f._remove(a)}catch{}})),new En(i,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Lu(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(dh(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(lh(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(mh(e))return"Blackberry";if(gh(e))return"Webos";if(hh(e))return"Safari";if((e.includes("chrome/")||fh(e))&&!e.includes("edge/"))return"Chrome";if(ph(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(t);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function lh(n=Ne()){return/firefox\//i.test(n)}function hh(n=Ne()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function fh(n=Ne()){return/crios\//i.test(n)}function dh(n=Ne()){return/iemobile/i.test(n)}function ph(n=Ne()){return/android/i.test(n)}function mh(n=Ne()){return/blackberry/i.test(n)}function gh(n=Ne()){return/webos/i.test(n)}function wa(n=Ne()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function sg(n=Ne()){var e;return wa(n)&&!!((e=window.navigator)!=null&&e.standalone)}function ig(){return xp()&&document.documentMode===10}function _h(n=Ne()){return wa(n)||ph(n)||gh(n)||mh(n)||/windows phone/i.test(n)||dh(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yh(n,e=[]){let t;switch(n){case"Browser":t=Lu(Ne());break;case"Worker":t=`${Lu(Ne())}-${n}`;break;default:t=n}const r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${sr}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class og{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const r=i=>new Promise((a,c)=>{try{const l=e(i);a(l)}catch(l){c(l)}});r.onAbort=t,this.queue.push(r);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(const s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ag(n,e={}){return ir(n,"GET","/v2/passwordPolicy",ya(n,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cg=6;class ug{constructor(e){var r;const t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??cg,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((r=e.allowedNonAlphanumericCharacters)==null?void 0:r.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const r=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let s=0;s<e.length;s++)r=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,s,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lg{constructor(e,t,r,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Mu(this),this.idTokenSubscription=new Mu(this),this.beforeStateQueue=new og(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=rh,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion,this._persistenceManagerAvailable=new Promise(i=>this._resolvePersistenceManagerAvailable=i)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Tt(t)),this._initializationPromise=this.queue(async()=>{var r,s,i;if(!this._deleted){try{this.persistenceManager=await En.create(this,e)}catch(a){ti(`Failed to initialize persistence: ${a}`),this.persistenceManager=await En.create(this,[])}finally{(r=this._resolvePersistenceManagerAvailable)==null||r.call(this)}if(!this._deleted){if((s=this._popupRedirectResolver)!=null&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}try{await this.initializeCurrentUser(t)}catch(a){ti(`Failed to initialize current user: ${a}`),await this.directlySetCurrentUser(null).catch(()=>{})}this.lastNotifiedUid=((i=this.currentUser)==null?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await mi(this,{idToken:e}),r=await nt._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var i;if(Ze(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(c=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(c,c))}):this.directlySetCurrentUser(null)}const t=await this.assertedPersistence.getCurrentUser();let r=t,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(i=this.redirectUser)==null?void 0:i._redirectEventId,c=r==null?void 0:r._redirectEventId,l=await this.tryRedirectSignIn(e);(!a||a===c)&&(l!=null&&l.user)&&(r=l.user,s=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(r)}catch(a){r=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return z(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await gi(e)}catch(t){const r=t==null?void 0:t.code;if(r!=="auth/network-request-failed"&&r!=="auth/too-many-requests"&&!(r!=null&&r.startsWith("auth/quota-exceeded")))return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=zm()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Ze(this.app))return Promise.reject(Gt(this));const t=e?Xe(e):null;return t&&z(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&z(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Ze(this.app)?Promise.reject(Gt(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Ze(this.app)?Promise.reject(Gt(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Tt(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await ag(this),t=new ug(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new _s("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await rg(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,t){const r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Tt(e)||this._popupRedirectResolver;z(t,this,"argument-error"),this.redirectPersistenceManager=await En.create(this,[Tt(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,r;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)==null?void 0:t._redirectEventId)===e?this._currentUser:((r=this.redirectUser)==null?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((t=this.currentUser)==null?void 0:t.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,s){if(this._deleted)return()=>{};const i=typeof t=="function"?t:t.next.bind(t);let a=!1;const c=this._isInitialized?Promise.resolve():this._initializationPromise;if(z(c,this,"internal-error"),c.then(()=>{a||i(this.currentUser)}).catch(l=>{if(!a)if(typeof t!="function"&&t.error)t.error(l);else if(r)r(l);else throw l}),typeof t=="function"){const l=e.addObserver(t,r,s);return()=>{a=!0,l()}}else{const l=e.addObserver(t);return()=>{a=!0,l()}}}async directlySetCurrentUser(e){if(this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,this.persistenceManager)try{e?await this.persistenceManager.setCurrentUser(e):await this.persistenceManager.removeCurrentUser()}catch(t){const r=(t==null?void 0:t.message)||String(t),s=Mi(this,"internal-error",`An internal AuthError has occurred: ${r}`);throw s.customData={originalError:t},s}}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return z(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=yh(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var s;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const t=await((s=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:s.getHeartbeatsHeader());t&&(e["X-Firebase-Client"]=t);const r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){var t;if(Ze(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((t=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:t.getToken());return e!=null&&e.error&&ti(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function or(n){return Xe(n)}class Mu{constructor(e){this.auth=e,this.observer=null,this.addObserver=Up(t=>this.observer=t)}get next(){return z(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ta={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function hg(n){Ta=n}function fg(n){return Ta.loadJS(n)}function dg(){return Ta.gapiScript}function pg(n){return`__${n}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mg(n,e){const t=ma(n,"auth");if(t.isInitialized()){const s=t.getImmediate(),i=t.getOptions();if(In(i,e??{}))return s;mt(s,"already-initialized")}return t.initialize({options:e})}function gg(n,e){const t=(e==null?void 0:e.persistence)||[],r=(Array.isArray(t)?t:[t]).map(Tt);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function _g(n,e,t){const r=or(n);z(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const s=!1,i=Eh(e),{host:a,port:c}=yg(e),l=c===null?"":`:${c}`,f={url:`${i}//${a}${l}/`},p=Object.freeze({host:a,port:c,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:s})});if(!r._canInitEmulator){z(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),z(In(f,r.config.emulator)&&In(p,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=f,r.emulatorConfig=p,r.settings.appVerificationDisabledForTesting=!0,Es(a)?Yl(`${i}//${a}${l}`):Eg()}function Eh(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function yg(n){const e=Eh(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const r=t[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(r);if(s){const i=s[1];return{host:i,port:Uu(r.substr(i.length+1))}}else{const[i,a]=r.split(":");return{host:i,port:Uu(a)}}}function Uu(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function Eg(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wh{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return wt("not implemented")}_getIdTokenResponse(e){return wt("not implemented")}_linkToIdToken(e,t){return wt("not implemented")}_getReauthenticationResolver(e){return wt("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Wn(n,e){return Km(n,"POST","/v1/accounts:signInWithIdp",ya(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wg="http://localhost";class bn extends wh{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new bn(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):mt("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:s,...i}=t;if(!r||!s)return null;const a=new bn(r,s);return a.idToken=i.idToken||void 0,a.accessToken=i.accessToken||void 0,a.secret=i.secret,a.nonce=i.nonce,a.pendingToken=i.pendingToken||null,a}_getIdTokenResponse(e){const t=this.buildRequest();return Wn(e,t)}_linkToIdToken(e,t){const r=this.buildRequest();return r.idToken=t,Wn(e,r)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Wn(e,t)}buildRequest(){const e={requestUri:wg,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=ys(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ui{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ts extends Ui{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bt extends Ts{constructor(){super("facebook.com")}static credential(e){return bn._fromParams({providerId:Bt.PROVIDER_ID,signInMethod:Bt.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Bt.credentialFromTaggedObject(e)}static credentialFromError(e){return Bt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Bt.credential(e.oauthAccessToken)}catch{return null}}}Bt.FACEBOOK_SIGN_IN_METHOD="facebook.com";Bt.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $t extends Ts{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return bn._fromParams({providerId:$t.PROVIDER_ID,signInMethod:$t.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return $t.credentialFromTaggedObject(e)}static credentialFromError(e){return $t.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return $t.credential(t,r)}catch{return null}}}$t.GOOGLE_SIGN_IN_METHOD="google.com";$t.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qt extends Ts{constructor(){super("github.com")}static credential(e){return bn._fromParams({providerId:qt.PROVIDER_ID,signInMethod:qt.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return qt.credentialFromTaggedObject(e)}static credentialFromError(e){return qt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return qt.credential(e.oauthAccessToken)}catch{return null}}}qt.GITHUB_SIGN_IN_METHOD="github.com";qt.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jt extends Ts{constructor(){super("twitter.com")}static credential(e,t){return bn._fromParams({providerId:jt.PROVIDER_ID,signInMethod:jt.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return jt.credentialFromTaggedObject(e)}static credentialFromError(e){return jt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return jt.credential(t,r)}catch{return null}}}jt.TWITTER_SIGN_IN_METHOD="twitter.com";jt.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xn{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,s=!1){const i=await nt._fromIdTokenResponse(e,r,s),a=Fu(r);return new Xn({user:i,providerId:a,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);const s=Fu(r);return new Xn({user:e,providerId:s,_tokenResponse:r,operationType:t})}}function Fu(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _i extends Nt{constructor(e,t,r,s){super(t.code,t.message),this.operationType=r,this.user=s,Object.setPrototypeOf(this,_i.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,s){return new _i(e,t,r,s)}}function Th(n,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?_i._fromErrorAndOperation(n,i,e,r):i})}async function Tg(n,e,t=!1){const r=await Gr(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return Xn._forOperation(n,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function vg(n,e,t=!1){const{auth:r}=n;if(Ze(r.app))return Promise.reject(Gt(r));const s="reauthenticate";try{const i=await Gr(n,Th(r,s,e,n),t);z(i.idToken,r,"internal-error");const a=Ea(i.idToken);z(a,r,"internal-error");const{sub:c}=a;return z(n.uid===c,r,"user-mismatch"),Xn._forOperation(n,s,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&mt(r,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ig(n,e,t=!1){if(Ze(n.app))return Promise.reject(Gt(n));const r="signIn",s=await Th(n,r,e),i=await Xn._fromIdTokenResponse(n,r,s);return t||await n._updateCurrentUser(i.user),i}function Ag(n,e,t,r){return Xe(n).onIdTokenChanged(e,t,r)}function bg(n,e,t){return Xe(n).beforeAuthStateChanged(e,t)}function LT(n,e,t,r){return Xe(n).onAuthStateChanged(e,t,r)}function MT(n){return Xe(n).signOut()}const yi="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vh{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(yi,"1"),this.storage.removeItem(yi),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rg=1e3,Pg=10;class Ih extends vh{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=_h(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const r=this.storage.getItem(t),s=this.localCache[t];r!==s&&e(t,s,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((a,c,l)=>{this.notifyListeners(a,l)});return}const r=e.key;t?this.detachListener():this.stopPolling();const s=()=>{const a=this.storage.getItem(r);!t&&this.localCache[r]===a||this.notifyListeners(r,a)},i=this.storage.getItem(r);ig()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,Pg):s()}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},Rg)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}Ih.type="LOCAL";const Vg=Ih;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ah extends vh{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}Ah.type="SESSION";const bh=Ah;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sg(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fi{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;const r=new Fi(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:r,eventType:s,data:i}=t.data,a=this.handlersMap[s];if(!(a!=null&&a.size))return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:s});const c=Array.from(a).map(async f=>f(t.origin,i)),l=await Sg(c);t.ports[0].postMessage({status:"done",eventId:r,eventType:s,response:l})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Fi.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function va(n="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return n+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cg{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let i,a;return new Promise((c,l)=>{const f=va("",20);s.port1.start();const p=setTimeout(()=>{l(new Error("unsupported_event"))},r);a={messageChannel:s,onMessage(m){const v=m;if(v.data.eventId===f)switch(v.data.status){case"ack":clearTimeout(p),i=setTimeout(()=>{l(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),c(v.data.response);break;default:clearTimeout(p),clearTimeout(i),l(new Error("invalid_response"));break}}},this.handlers.add(a),s.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:f,data:t},[s.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ht(){return window}function xg(n){ht().location.href=n}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rh(){return typeof ht().WorkerGlobalScope<"u"&&typeof ht().importScripts=="function"}async function Ng(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function kg(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)==null?void 0:n.controller)||null}function Dg(){return Rh()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ph="firebaseLocalStorageDb",Og=1,Ei="firebaseLocalStorage",Vh="fbase_key";class vs{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Bi(n,e){return n.transaction([Ei],e?"readwrite":"readonly").objectStore(Ei)}function Lg(){const n=indexedDB.deleteDatabase(Ph);return new vs(n).toPromise()}function Sh(){const n=indexedDB.open(Ph,Og);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const r=n.result;try{r.createObjectStore(Ei,{keyPath:Vh})}catch(s){t(s)}}),n.addEventListener("success",async()=>{const r=n.result;r.objectStoreNames.contains(Ei)?e(r):(r.close(),await Lg(),e(await Sh()))})})}async function Bu(n,e,t){const r=Bi(n,!0).put({[Vh]:e,value:t});return new vs(r).toPromise()}async function Mg(n,e){const t=Bi(n,!1).get(e),r=await new vs(t).toPromise();return r===void 0?null:r.value}function $u(n,e){const t=Bi(n,!0).delete(e);return new vs(t).toPromise()}const Ug=800,Fg=3;class Ch{registerLifecycleListeners(){typeof window<"u"&&typeof window.addEventListener=="function"&&(window.addEventListener("pagehide",this.onPageHide),window.addEventListener("pageshow",this.onPageShow))}unregisterLifecycleListeners(){typeof window<"u"&&typeof window.removeEventListener=="function"&&(window.removeEventListener("pagehide",this.onPageHide),window.removeEventListener("pageshow",this.onPageShow))}constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.isClosing=!1,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this.onPageHide=()=>{this.isClosing=!0,this.stopPolling(),this.dbPromise&&(this.dbPromise.then(e=>e.close()).catch(()=>{}),this.dbPromise=null)},this.onPageShow=()=>{this.isClosing&&(this.isClosing=!1,Object.keys(this.listeners).length>0&&this.startPolling())},this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.dbPromise?this.dbPromise:(this.dbPromise=Sh(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let t=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(t++>Fg)throw r;if(this.dbPromise){const s=this.dbPromise;this.dbPromise=null;try{(await s).close()}catch{}}}}async initializeServiceWorkerMessaging(){return Rh()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Fi._getInstance(Dg()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var t,r;if(this.activeServiceWorker=await Ng(),!this.activeServiceWorker)return;this.sender=new Cg(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(t=e[0])!=null&&t.fulfilled&&(r=e[0])!=null&&r.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||kg()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await Bu(e,yi,"1"),await $u(e,yi)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>Bu(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(r=>Mg(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>$u(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){if(this.isClosing)return[];try{const e=await this._withRetries(s=>{const i=Bi(s,!1).getAll();return new vs(i).toPromise()});if(this.isClosing)return[];if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],r=new Set;if(e.length!==0)for(const{fbase_key:s,value:i}of e)r.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(i)&&(this.notifyListeners(s,i),t.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!r.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}catch(e){return this.isClosing||ti(`Firebase Auth cross-tab polling failed with error: ${e}`),[]}}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Ug)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.startPolling(),this.registerLifecycleListeners()),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.stopPolling(),this.unregisterLifecycleListeners())}}Ch.type="LOCAL";const Bg=Ch;new ws(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ia(n,e){return e?Tt(e):(z(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Aa extends wh{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Wn(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Wn(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Wn(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function $g(n){return Ig(n.auth,new Aa(n),n.bypassAuthState)}function qg(n){const{auth:e,user:t}=n;return z(t,e,"internal-error"),vg(t,new Aa(n),n.bypassAuthState)}async function jg(n){const{auth:e,user:t}=n;return z(t,e,"internal-error"),Tg(t,new Aa(n),n.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xh{constructor(e,t,r,s,i=!1){this.auth=e,this.resolver=r,this.user=s,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:r,postBody:s,tenantId:i,error:a,type:c}=e;if(a){this.reject(a);return}const l={auth:this.auth,requestUri:t,sessionId:r,tenantId:i||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(c)(l))}catch(f){this.reject(f)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return $g;case"linkViaPopup":case"linkViaRedirect":return jg;case"reauthViaPopup":case"reauthViaRedirect":return qg;default:mt(this.auth,"internal-error")}}resolve(e){Vt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Vt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zg=new ws(2e3,1e4);async function UT(n,e,t){if(Ze(n.app))return Promise.reject(st(n,"operation-not-supported-in-this-environment"));const r=or(n);sh(n,e,Ui);const s=Ia(r,t);return new _n(r,"signInViaPopup",e,s).executeNotNull()}class _n extends xh{constructor(e,t,r,s,i){super(e,t,s,i),this.provider=r,this.authWindow=null,this.pollId=null,_n.currentPopupAction&&_n.currentPopupAction.cancel(),_n.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return z(e,this.auth,"internal-error"),e}async onExecution(){Vt(this.filter.length===1,"Popup operations only handle one event");const e=va();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(st(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(st(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,_n.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,r;if((r=(t=this.authWindow)==null?void 0:t.window)!=null&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(st(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,zg.get())};e()}}_n.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wg="pendingRedirect",si=new Map;class Hg extends xh{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=si.get(this.auth._key());if(!e){try{const r=await Gg(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}si.set(this.auth._key(),e)}return this.bypassAuthState||si.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Gg(n,e){const t=kh(e),r=Nh(n);if(!await r._isAvailable())return!1;const s=await r._get(t)==="true";return await r._remove(t),s}async function Kg(n,e){return Nh(n)._set(kh(e),"true")}function Qg(n,e){si.set(n._key(),e)}function Nh(n){return Tt(n._redirectPersistence)}function kh(n){return ri(Wg,n.config.apiKey,n.name)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function FT(n,e,t){return Xg(n,e,t)}async function Xg(n,e,t){if(Ze(n.app))return Promise.reject(Gt(n));const r=or(n);sh(n,e,Ui),await r._initializationPromise;const s=Ia(r,t);return await Kg(s,r),s._openRedirect(r,e,"signInViaRedirect")}async function BT(n,e){return await or(n)._initializationPromise,Dh(n,e,!1)}async function Dh(n,e,t=!1){if(Ze(n.app))return Promise.reject(Gt(n));const r=or(n),s=Ia(r,e),a=await new Hg(r,s,t).execute();return a&&!t&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jg=600*1e3;class Yg{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Zg(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var r;if(e.error&&!Oh(e)){const s=((r=e.error.code)==null?void 0:r.split("auth/")[1])||"internal-error";t.onError(st(this.auth,s))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Jg&&this.cachedEventUids.clear(),this.cachedEventUids.has(qu(e))}saveEventToCache(e){this.cachedEventUids.add(qu(e)),this.lastProcessedEventTime=Date.now()}}function qu(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function Oh({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Zg(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Oh(n);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function e_(n,e={}){return ir(n,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const t_=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,n_=/^https?/;async function r_(n){if(n.config.emulator)return;const{authorizedDomains:e}=await e_(n);for(const t of e)try{if(s_(t))return}catch{}mt(n,"unauthorized-domain")}function s_(n){const e=Wo(),{protocol:t,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){const a=new URL(n);return a.hostname===""&&r===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&a.hostname===r}if(!n_.test(t))return!1;if(t_.test(n))return r===n;const s=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const i_=new ws(3e4,6e4);function ju(){const n=ht().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function o_(n){return new Promise((e,t)=>{var s,i,a;function r(){ju(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{ju(),t(st(n,"network-request-failed"))},timeout:i_.get()})}if((i=(s=ht().gapi)==null?void 0:s.iframes)!=null&&i.Iframe)e(gapi.iframes.getContext());else if((a=ht().gapi)!=null&&a.load)r();else{const c=pg("iframefcb");return ht()[c]=()=>{gapi.load?r():t(st(n,"network-request-failed"))},fg(`${dg()}?onload=${c}`).catch(l=>t(l))}}).catch(e=>{throw ii=null,e})}let ii=null;function a_(n){return ii=ii||o_(n),ii}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const c_=new ws(5e3,15e3),u_="__/auth/iframe",l_="emulator/auth/iframe",h_={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},f_=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function d_(n){const e=n.config;z(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?_a(e,l_):`https://${n.config.authDomain}/${u_}`,r={apiKey:e.apiKey,appName:n.name,v:sr},s=f_.get(n.config.apiHost);s&&(r.eid=s);const i=n._getFrameworks();return i.length&&(r.fw=i.join(",")),`${t}?${ys(r).slice(1)}`}async function p_(n){const e=await a_(n),t=ht().gapi;return z(t,n,"internal-error"),e.open({where:document.body,url:d_(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:h_,dontclear:!0},r=>new Promise(async(s,i)=>{await r.restyle({setHideOnLeave:!1});const a=st(n,"network-request-failed"),c=ht().setTimeout(()=>{i(a)},c_.get());function l(){ht().clearTimeout(c),s(r)}r.ping(l).then(l,()=>{i(a)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const m_={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},g_=500,__=600,y_="_blank",E_="http://localhost";class zu{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function w_(n,e,t,r=g_,s=__){const i=Math.max((window.screen.availHeight-s)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let c="";const l={...m_,width:r.toString(),height:s.toString(),top:i,left:a},f=Ne().toLowerCase();t&&(c=fh(f)?y_:t),lh(f)&&(e=e||E_,l.scrollbars="yes");const p=Object.entries(l).reduce((v,[V,C])=>`${v}${V}=${C},`,"");if(sg(f)&&c!=="_self")return T_(e||"",c),new zu(null);const m=window.open(e||"",c,p);z(m,n,"popup-blocked");try{m.focus()}catch{}return new zu(m)}function T_(n,e){const t=document.createElement("a");t.href=n,t.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const v_="__/auth/handler",I_="emulator/auth/handler",A_=encodeURIComponent("fac");async function Wu(n,e,t,r,s,i){z(n.config.authDomain,n,"auth-domain-config-required"),z(n.config.apiKey,n,"invalid-api-key");const a={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:r,v:sr,eventId:s};if(e instanceof Ui){e.setDefaultLanguage(n.languageCode),a.providerId=e.providerId||"",Mp(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[p,m]of Object.entries({}))a[p]=m}if(e instanceof Ts){const p=e.getScopes().filter(m=>m!=="");p.length>0&&(a.scopes=p.join(","))}n.tenantId&&(a.tid=n.tenantId);const c=a;for(const p of Object.keys(c))c[p]===void 0&&delete c[p];const l=await n._getAppCheckToken(),f=l?`#${A_}=${encodeURIComponent(l)}`:"";return`${b_(n)}?${ys(c).slice(1)}${f}`}function b_({config:n}){return n.emulator?_a(n,I_):`https://${n.authDomain}/${v_}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Do="webStorageSupport";class R_{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=bh,this._completeRedirectFn=Dh,this._overrideRedirectResult=Qg}async _openPopup(e,t,r,s){var a;Vt((a=this.eventManagers[e._key()])==null?void 0:a.manager,"_initialize() not called before _openPopup()");const i=await Wu(e,t,r,Wo(),s);return w_(e,i,va())}async _openRedirect(e,t,r,s){await this._originValidation(e);const i=await Wu(e,t,r,Wo(),s);return xg(i),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:s,promise:i}=this.eventManagers[t];return s?Promise.resolve(s):(Vt(i,"If manager is not set, promise should be"),i)}const r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){const t=await p_(e),r=new Yg(e);return t.register("authEvent",s=>(z(s==null?void 0:s.authEvent,e,"invalid-auth-event"),{status:r.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Do,{type:Do},s=>{var a;const i=(a=s==null?void 0:s[0])==null?void 0:a[Do];i!==void 0&&t(!!i),mt(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=r_(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return _h()||hh()||wa()}}const P_=R_;var Hu="@firebase/auth",Gu="1.13.7";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class V_{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){z(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function S_(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function C_(n){Qn(new An("auth",(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:a,authDomain:c}=r.options;z(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const l={apiKey:a,authDomain:c,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:yh(n)},f=new lg(r,s,i,l);return gg(f,t),f},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),Qn(new An("auth-internal",e=>{const t=or(e.getProvider("auth").getImmediate());return(r=>new V_(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Ht(Hu,Gu,S_(n)),Ht(Hu,Gu,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const x_=300,N_=Jl("authIdTokenMaxAge")||x_;let Ku=null;const k_=n=>async e=>{const t=e&&await e.getIdTokenResult(),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>N_)return;const s=t==null?void 0:t.token;Ku!==s&&(Ku=s,await fetch(n,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function $T(n=Zl()){const e=ma(n,"auth");if(e.isInitialized())return e.getImmediate();const t=mg(n,{popupRedirectResolver:P_,persistence:[Bg,Vg,bh]}),r=Jl("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(r,location.origin);if(location.origin===i.origin){const a=k_(i.toString());bg(t,a,()=>a(t.currentUser)),Ag(t,c=>a(c))}}const s=Ql("auth");return s&&_g(t,`http://${s}`),t}function D_(){var n;return((n=document.getElementsByTagName("head"))==null?void 0:n[0])??document}hg({loadJS(n){return new Promise((e,t)=>{const r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=s=>{const i=st("internal-error");i.customData=s,t(i)},r.type="text/javascript",r.charset="UTF-8",D_().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});C_("Browser");var Qu=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Kt,Lh;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(T,g){function y(){}y.prototype=g.prototype,T.F=g.prototype,T.prototype=new y,T.prototype.constructor=T,T.D=function(I,w,b){for(var _=Array(arguments.length-2),Me=2;Me<arguments.length;Me++)_[Me-2]=arguments[Me];return g.prototype[w].apply(I,_)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(r,t),r.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(T,g,y){y||(y=0);const I=Array(16);if(typeof g=="string")for(var w=0;w<16;++w)I[w]=g.charCodeAt(y++)|g.charCodeAt(y++)<<8|g.charCodeAt(y++)<<16|g.charCodeAt(y++)<<24;else for(w=0;w<16;++w)I[w]=g[y++]|g[y++]<<8|g[y++]<<16|g[y++]<<24;g=T.g[0],y=T.g[1],w=T.g[2];let b=T.g[3],_;_=g+(b^y&(w^b))+I[0]+3614090360&4294967295,g=y+(_<<7&4294967295|_>>>25),_=b+(w^g&(y^w))+I[1]+3905402710&4294967295,b=g+(_<<12&4294967295|_>>>20),_=w+(y^b&(g^y))+I[2]+606105819&4294967295,w=b+(_<<17&4294967295|_>>>15),_=y+(g^w&(b^g))+I[3]+3250441966&4294967295,y=w+(_<<22&4294967295|_>>>10),_=g+(b^y&(w^b))+I[4]+4118548399&4294967295,g=y+(_<<7&4294967295|_>>>25),_=b+(w^g&(y^w))+I[5]+1200080426&4294967295,b=g+(_<<12&4294967295|_>>>20),_=w+(y^b&(g^y))+I[6]+2821735955&4294967295,w=b+(_<<17&4294967295|_>>>15),_=y+(g^w&(b^g))+I[7]+4249261313&4294967295,y=w+(_<<22&4294967295|_>>>10),_=g+(b^y&(w^b))+I[8]+1770035416&4294967295,g=y+(_<<7&4294967295|_>>>25),_=b+(w^g&(y^w))+I[9]+2336552879&4294967295,b=g+(_<<12&4294967295|_>>>20),_=w+(y^b&(g^y))+I[10]+4294925233&4294967295,w=b+(_<<17&4294967295|_>>>15),_=y+(g^w&(b^g))+I[11]+2304563134&4294967295,y=w+(_<<22&4294967295|_>>>10),_=g+(b^y&(w^b))+I[12]+1804603682&4294967295,g=y+(_<<7&4294967295|_>>>25),_=b+(w^g&(y^w))+I[13]+4254626195&4294967295,b=g+(_<<12&4294967295|_>>>20),_=w+(y^b&(g^y))+I[14]+2792965006&4294967295,w=b+(_<<17&4294967295|_>>>15),_=y+(g^w&(b^g))+I[15]+1236535329&4294967295,y=w+(_<<22&4294967295|_>>>10),_=g+(w^b&(y^w))+I[1]+4129170786&4294967295,g=y+(_<<5&4294967295|_>>>27),_=b+(y^w&(g^y))+I[6]+3225465664&4294967295,b=g+(_<<9&4294967295|_>>>23),_=w+(g^y&(b^g))+I[11]+643717713&4294967295,w=b+(_<<14&4294967295|_>>>18),_=y+(b^g&(w^b))+I[0]+3921069994&4294967295,y=w+(_<<20&4294967295|_>>>12),_=g+(w^b&(y^w))+I[5]+3593408605&4294967295,g=y+(_<<5&4294967295|_>>>27),_=b+(y^w&(g^y))+I[10]+38016083&4294967295,b=g+(_<<9&4294967295|_>>>23),_=w+(g^y&(b^g))+I[15]+3634488961&4294967295,w=b+(_<<14&4294967295|_>>>18),_=y+(b^g&(w^b))+I[4]+3889429448&4294967295,y=w+(_<<20&4294967295|_>>>12),_=g+(w^b&(y^w))+I[9]+568446438&4294967295,g=y+(_<<5&4294967295|_>>>27),_=b+(y^w&(g^y))+I[14]+3275163606&4294967295,b=g+(_<<9&4294967295|_>>>23),_=w+(g^y&(b^g))+I[3]+4107603335&4294967295,w=b+(_<<14&4294967295|_>>>18),_=y+(b^g&(w^b))+I[8]+1163531501&4294967295,y=w+(_<<20&4294967295|_>>>12),_=g+(w^b&(y^w))+I[13]+2850285829&4294967295,g=y+(_<<5&4294967295|_>>>27),_=b+(y^w&(g^y))+I[2]+4243563512&4294967295,b=g+(_<<9&4294967295|_>>>23),_=w+(g^y&(b^g))+I[7]+1735328473&4294967295,w=b+(_<<14&4294967295|_>>>18),_=y+(b^g&(w^b))+I[12]+2368359562&4294967295,y=w+(_<<20&4294967295|_>>>12),_=g+(y^w^b)+I[5]+4294588738&4294967295,g=y+(_<<4&4294967295|_>>>28),_=b+(g^y^w)+I[8]+2272392833&4294967295,b=g+(_<<11&4294967295|_>>>21),_=w+(b^g^y)+I[11]+1839030562&4294967295,w=b+(_<<16&4294967295|_>>>16),_=y+(w^b^g)+I[14]+4259657740&4294967295,y=w+(_<<23&4294967295|_>>>9),_=g+(y^w^b)+I[1]+2763975236&4294967295,g=y+(_<<4&4294967295|_>>>28),_=b+(g^y^w)+I[4]+1272893353&4294967295,b=g+(_<<11&4294967295|_>>>21),_=w+(b^g^y)+I[7]+4139469664&4294967295,w=b+(_<<16&4294967295|_>>>16),_=y+(w^b^g)+I[10]+3200236656&4294967295,y=w+(_<<23&4294967295|_>>>9),_=g+(y^w^b)+I[13]+681279174&4294967295,g=y+(_<<4&4294967295|_>>>28),_=b+(g^y^w)+I[0]+3936430074&4294967295,b=g+(_<<11&4294967295|_>>>21),_=w+(b^g^y)+I[3]+3572445317&4294967295,w=b+(_<<16&4294967295|_>>>16),_=y+(w^b^g)+I[6]+76029189&4294967295,y=w+(_<<23&4294967295|_>>>9),_=g+(y^w^b)+I[9]+3654602809&4294967295,g=y+(_<<4&4294967295|_>>>28),_=b+(g^y^w)+I[12]+3873151461&4294967295,b=g+(_<<11&4294967295|_>>>21),_=w+(b^g^y)+I[15]+530742520&4294967295,w=b+(_<<16&4294967295|_>>>16),_=y+(w^b^g)+I[2]+3299628645&4294967295,y=w+(_<<23&4294967295|_>>>9),_=g+(w^(y|~b))+I[0]+4096336452&4294967295,g=y+(_<<6&4294967295|_>>>26),_=b+(y^(g|~w))+I[7]+1126891415&4294967295,b=g+(_<<10&4294967295|_>>>22),_=w+(g^(b|~y))+I[14]+2878612391&4294967295,w=b+(_<<15&4294967295|_>>>17),_=y+(b^(w|~g))+I[5]+4237533241&4294967295,y=w+(_<<21&4294967295|_>>>11),_=g+(w^(y|~b))+I[12]+1700485571&4294967295,g=y+(_<<6&4294967295|_>>>26),_=b+(y^(g|~w))+I[3]+2399980690&4294967295,b=g+(_<<10&4294967295|_>>>22),_=w+(g^(b|~y))+I[10]+4293915773&4294967295,w=b+(_<<15&4294967295|_>>>17),_=y+(b^(w|~g))+I[1]+2240044497&4294967295,y=w+(_<<21&4294967295|_>>>11),_=g+(w^(y|~b))+I[8]+1873313359&4294967295,g=y+(_<<6&4294967295|_>>>26),_=b+(y^(g|~w))+I[15]+4264355552&4294967295,b=g+(_<<10&4294967295|_>>>22),_=w+(g^(b|~y))+I[6]+2734768916&4294967295,w=b+(_<<15&4294967295|_>>>17),_=y+(b^(w|~g))+I[13]+1309151649&4294967295,y=w+(_<<21&4294967295|_>>>11),_=g+(w^(y|~b))+I[4]+4149444226&4294967295,g=y+(_<<6&4294967295|_>>>26),_=b+(y^(g|~w))+I[11]+3174756917&4294967295,b=g+(_<<10&4294967295|_>>>22),_=w+(g^(b|~y))+I[2]+718787259&4294967295,w=b+(_<<15&4294967295|_>>>17),_=y+(b^(w|~g))+I[9]+3951481745&4294967295,T.g[0]=T.g[0]+g&4294967295,T.g[1]=T.g[1]+(w+(_<<21&4294967295|_>>>11))&4294967295,T.g[2]=T.g[2]+w&4294967295,T.g[3]=T.g[3]+b&4294967295}r.prototype.v=function(T,g){g===void 0&&(g=T.length);const y=g-this.blockSize,I=this.C;let w=this.h,b=0;for(;b<g;){if(w==0)for(;b<=y;)s(this,T,b),b+=this.blockSize;if(typeof T=="string"){for(;b<g;)if(I[w++]=T.charCodeAt(b++),w==this.blockSize){s(this,I),w=0;break}}else for(;b<g;)if(I[w++]=T[b++],w==this.blockSize){s(this,I),w=0;break}}this.h=w,this.o+=g},r.prototype.A=function(){var T=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);T[0]=128;for(var g=1;g<T.length-8;++g)T[g]=0;g=this.o*8;for(var y=T.length-8;y<T.length;++y)T[y]=g&255,g/=256;for(this.v(T),T=Array(16),g=0,y=0;y<4;++y)for(let I=0;I<32;I+=8)T[g++]=this.g[y]>>>I&255;return T};function i(T,g){var y=c;return Object.prototype.hasOwnProperty.call(y,T)?y[T]:y[T]=g(T)}function a(T,g){this.h=g;const y=[];let I=!0;for(let w=T.length-1;w>=0;w--){const b=T[w]|0;I&&b==g||(y[w]=b,I=!1)}this.g=y}var c={};function l(T){return-128<=T&&T<128?i(T,function(g){return new a([g|0],g<0?-1:0)}):new a([T|0],T<0?-1:0)}function f(T){if(isNaN(T)||!isFinite(T))return m;if(T<0)return O(f(-T));const g=[];let y=1;for(let I=0;T>=y;I++)g[I]=T/y|0,y*=4294967296;return new a(g,0)}function p(T,g){if(T.length==0)throw Error("number format error: empty string");if(g=g||10,g<2||36<g)throw Error("radix out of range: "+g);if(T.charAt(0)=="-")return O(p(T.substring(1),g));if(T.indexOf("-")>=0)throw Error('number format error: interior "-" character');const y=f(Math.pow(g,8));let I=m;for(let b=0;b<T.length;b+=8){var w=Math.min(8,T.length-b);const _=parseInt(T.substring(b,b+w),g);w<8?(w=f(Math.pow(g,w)),I=I.j(w).add(f(_))):(I=I.j(y),I=I.add(f(_)))}return I}var m=l(0),v=l(1),V=l(16777216);n=a.prototype,n.m=function(){if(M(this))return-O(this).m();let T=0,g=1;for(let y=0;y<this.g.length;y++){const I=this.i(y);T+=(I>=0?I:4294967296+I)*g,g*=4294967296}return T},n.toString=function(T){if(T=T||10,T<2||36<T)throw Error("radix out of range: "+T);if(C(this))return"0";if(M(this))return"-"+O(this).toString(T);const g=f(Math.pow(T,6));var y=this;let I="";for(;;){const w=De(y,g).g;y=H(y,w.j(g));let b=((y.g.length>0?y.g[0]:y.h)>>>0).toString(T);if(y=w,C(y))return b+I;for(;b.length<6;)b="0"+b;I=b+I}},n.i=function(T){return T<0?0:T<this.g.length?this.g[T]:this.h};function C(T){if(T.h!=0)return!1;for(let g=0;g<T.g.length;g++)if(T.g[g]!=0)return!1;return!0}function M(T){return T.h==-1}n.l=function(T){return T=H(this,T),M(T)?-1:C(T)?0:1};function O(T){const g=T.g.length,y=[];for(let I=0;I<g;I++)y[I]=~T.g[I];return new a(y,~T.h).add(v)}n.abs=function(){return M(this)?O(this):this},n.add=function(T){const g=Math.max(this.g.length,T.g.length),y=[];let I=0;for(let w=0;w<=g;w++){let b=I+(this.i(w)&65535)+(T.i(w)&65535),_=(b>>>16)+(this.i(w)>>>16)+(T.i(w)>>>16);I=_>>>16,b&=65535,_&=65535,y[w]=_<<16|b}return new a(y,y[y.length-1]&-2147483648?-1:0)};function H(T,g){return T.add(O(g))}n.j=function(T){if(C(this)||C(T))return m;if(M(this))return M(T)?O(this).j(O(T)):O(O(this).j(T));if(M(T))return O(this.j(O(T)));if(this.l(V)<0&&T.l(V)<0)return f(this.m()*T.m());const g=this.g.length+T.g.length,y=[];for(var I=0;I<2*g;I++)y[I]=0;for(I=0;I<this.g.length;I++)for(let w=0;w<T.g.length;w++){const b=this.i(I)>>>16,_=this.i(I)&65535,Me=T.i(w)>>>16,un=T.i(w)&65535;y[2*I+2*w]+=_*un,J(y,2*I+2*w),y[2*I+2*w+1]+=b*un,J(y,2*I+2*w+1),y[2*I+2*w+1]+=_*Me,J(y,2*I+2*w+1),y[2*I+2*w+2]+=b*Me,J(y,2*I+2*w+2)}for(T=0;T<g;T++)y[T]=y[2*T+1]<<16|y[2*T];for(T=g;T<2*g;T++)y[T]=0;return new a(y,0)};function J(T,g){for(;(T[g]&65535)!=T[g];)T[g+1]+=T[g]>>>16,T[g]&=65535,g++}function se(T,g){this.g=T,this.h=g}function De(T,g){if(C(g))throw Error("division by zero");if(C(T))return new se(m,m);if(M(T))return g=De(O(T),g),new se(O(g.g),O(g.h));if(M(g))return g=De(T,O(g)),new se(O(g.g),g.h);if(T.g.length>30){if(M(T)||M(g))throw Error("slowDivide_ only works with positive integers.");for(var y=v,I=g;I.l(T)<=0;)y=me(y),I=me(I);var w=ge(y,1),b=ge(I,1);for(I=ge(I,2),y=ge(y,2);!C(I);){var _=b.add(I);_.l(T)<=0&&(w=w.add(y),b=_),I=ge(I,1),y=ge(y,1)}return g=H(T,w.j(g)),new se(w,g)}for(w=m;T.l(g)>=0;){for(y=Math.max(1,Math.floor(T.m()/g.m())),I=Math.ceil(Math.log(y)/Math.LN2),I=I<=48?1:Math.pow(2,I-48),b=f(y),_=b.j(g);M(_)||_.l(T)>0;)y-=I,b=f(y),_=b.j(g);C(b)&&(b=v),w=w.add(b),T=H(T,_)}return new se(w,T)}n.B=function(T){return De(this,T).h},n.and=function(T){const g=Math.max(this.g.length,T.g.length),y=[];for(let I=0;I<g;I++)y[I]=this.i(I)&T.i(I);return new a(y,this.h&T.h)},n.or=function(T){const g=Math.max(this.g.length,T.g.length),y=[];for(let I=0;I<g;I++)y[I]=this.i(I)|T.i(I);return new a(y,this.h|T.h)},n.xor=function(T){const g=Math.max(this.g.length,T.g.length),y=[];for(let I=0;I<g;I++)y[I]=this.i(I)^T.i(I);return new a(y,this.h^T.h)};function me(T){const g=T.g.length+1,y=[];for(let I=0;I<g;I++)y[I]=T.i(I)<<1|T.i(I-1)>>>31;return new a(y,T.h)}function ge(T,g){const y=g>>5;g%=32;const I=T.g.length-y,w=[];for(let b=0;b<I;b++)w[b]=g>0?T.i(b+y)>>>g|T.i(b+y+1)<<32-g:T.i(b+y);return new a(w,T.h)}r.prototype.digest=r.prototype.A,r.prototype.reset=r.prototype.u,r.prototype.update=r.prototype.v,Lh=r,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.B,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=f,a.fromString=p,Kt=a}).apply(typeof Qu<"u"?Qu:typeof self<"u"?self:typeof window<"u"?window:{});var Qs=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Mh,Nr,Uh,oi,Go,Fh,Bh,$h;(function(){var n,e=Object.defineProperty;function t(o){o=[typeof globalThis=="object"&&globalThis,o,typeof window=="object"&&window,typeof self=="object"&&self,typeof Qs=="object"&&Qs];for(var u=0;u<o.length;++u){var h=o[u];if(h&&h.Math==Math)return h}throw Error("Cannot find global object")}var r=t(this);function s(o,u){if(u)e:{var h=r;o=o.split(".");for(var d=0;d<o.length-1;d++){var A=o[d];if(!(A in h))break e;h=h[A]}o=o[o.length-1],d=h[o],u=u(d),u!=d&&u!=null&&e(h,o,{configurable:!0,writable:!0,value:u})}}s("Symbol.dispose",function(o){return o||Symbol("Symbol.dispose")}),s("Array.prototype.values",function(o){return o||function(){return this[Symbol.iterator]()}}),s("Object.entries",function(o){return o||function(u){var h=[],d;for(d in u)Object.prototype.hasOwnProperty.call(u,d)&&h.push([d,u[d]]);return h}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var i=i||{},a=this||self;function c(o){var u=typeof o;return u=="object"&&o!=null||u=="function"}function l(o,u,h){return o.call.apply(o.bind,arguments)}function f(o,u,h){return f=l,f.apply(null,arguments)}function p(o,u){var h=Array.prototype.slice.call(arguments,1);return function(){var d=h.slice();return d.push.apply(d,arguments),o.apply(this,d)}}function m(o,u){function h(){}h.prototype=u.prototype,o.Z=u.prototype,o.prototype=new h,o.prototype.constructor=o,o.Ob=function(d,A,R){for(var k=Array(arguments.length-2),K=2;K<arguments.length;K++)k[K-2]=arguments[K];return u.prototype[A].apply(d,k)}}var v=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?o=>o&&AsyncContext.Snapshot.wrap(o):o=>o;function V(o){const u=o.length;if(u>0){const h=Array(u);for(let d=0;d<u;d++)h[d]=o[d];return h}return[]}function C(o,u){for(let d=1;d<arguments.length;d++){const A=arguments[d];var h=typeof A;if(h=h!="object"?h:A?Array.isArray(A)?"array":h:"null",h=="array"||h=="object"&&typeof A.length=="number"){h=o.length||0;const R=A.length||0;o.length=h+R;for(let k=0;k<R;k++)o[h+k]=A[k]}else o.push(A)}}class M{constructor(u,h){this.i=u,this.j=h,this.h=0,this.g=null}get(){let u;return this.h>0?(this.h--,u=this.g,this.g=u.next,u.next=null):u=this.i(),u}}function O(o){a.setTimeout(()=>{throw o},0)}function H(){var o=T;let u=null;return o.g&&(u=o.g,o.g=o.g.next,o.g||(o.h=null),u.next=null),u}class J{constructor(){this.h=this.g=null}add(u,h){const d=se.get();d.set(u,h),this.h?this.h.next=d:this.g=d,this.h=d}}var se=new M(()=>new De,o=>o.reset());class De{constructor(){this.next=this.g=this.h=null}set(u,h){this.h=u,this.g=h,this.next=null}reset(){this.next=this.g=this.h=null}}let me,ge=!1,T=new J,g=()=>{const o=Promise.resolve(void 0);me=()=>{o.then(y)}};function y(){for(var o;o=H();){try{o.h.call(o.g)}catch(h){O(h)}var u=se;u.j(o),u.h<100&&(u.h++,o.next=u.g,u.g=o)}ge=!1}function I(){this.u=this.u,this.C=this.C}I.prototype.u=!1,I.prototype.dispose=function(){this.u||(this.u=!0,this.N())},I.prototype[Symbol.dispose]=function(){this.dispose()},I.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function w(o,u){this.type=o,this.g=this.target=u,this.defaultPrevented=!1}w.prototype.h=function(){this.defaultPrevented=!0};var b=(function(){if(!a.addEventListener||!Object.defineProperty)return!1;var o=!1,u=Object.defineProperty({},"passive",{get:function(){o=!0}});try{const h=()=>{};a.addEventListener("test",h,u),a.removeEventListener("test",h,u)}catch{}return o})();function _(o){return/^[\s\xa0]*$/.test(o)}function Me(o,u){w.call(this,o?o.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,o&&this.init(o,u)}m(Me,w),Me.prototype.init=function(o,u){const h=this.type=o.type,d=o.changedTouches&&o.changedTouches.length?o.changedTouches[0]:null;this.target=o.target||o.srcElement,this.g=u,u=o.relatedTarget,u||(h=="mouseover"?u=o.fromElement:h=="mouseout"&&(u=o.toElement)),this.relatedTarget=u,d?(this.clientX=d.clientX!==void 0?d.clientX:d.pageX,this.clientY=d.clientY!==void 0?d.clientY:d.pageY,this.screenX=d.screenX||0,this.screenY=d.screenY||0):(this.clientX=o.clientX!==void 0?o.clientX:o.pageX,this.clientY=o.clientY!==void 0?o.clientY:o.pageY,this.screenX=o.screenX||0,this.screenY=o.screenY||0),this.button=o.button,this.key=o.key||"",this.ctrlKey=o.ctrlKey,this.altKey=o.altKey,this.shiftKey=o.shiftKey,this.metaKey=o.metaKey,this.pointerId=o.pointerId||0,this.pointerType=o.pointerType,this.state=o.state,this.i=o,o.defaultPrevented&&Me.Z.h.call(this)},Me.prototype.h=function(){Me.Z.h.call(this);const o=this.i;o.preventDefault?o.preventDefault():o.returnValue=!1};var un="closure_listenable_"+(Math.random()*1e6|0),Ld=0;function Md(o,u,h,d,A){this.listener=o,this.proxy=null,this.src=u,this.type=h,this.capture=!!d,this.ha=A,this.key=++Ld,this.da=this.fa=!1}function ks(o){o.da=!0,o.listener=null,o.proxy=null,o.src=null,o.ha=null}function Ds(o,u,h){for(const d in o)u.call(h,o[d],d,o)}function Ud(o,u){for(const h in o)u.call(void 0,o[h],h,o)}function Ac(o){const u={};for(const h in o)u[h]=o[h];return u}const bc="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function Rc(o,u){let h,d;for(let A=1;A<arguments.length;A++){d=arguments[A];for(h in d)o[h]=d[h];for(let R=0;R<bc.length;R++)h=bc[R],Object.prototype.hasOwnProperty.call(d,h)&&(o[h]=d[h])}}function Os(o){this.src=o,this.g={},this.h=0}Os.prototype.add=function(o,u,h,d,A){const R=o.toString();o=this.g[R],o||(o=this.g[R]=[],this.h++);const k=ao(o,u,d,A);return k>-1?(u=o[k],h||(u.fa=!1)):(u=new Md(u,this.src,R,!!d,A),u.fa=h,o.push(u)),u};function oo(o,u){const h=u.type;if(h in o.g){var d=o.g[h],A=Array.prototype.indexOf.call(d,u,void 0),R;(R=A>=0)&&Array.prototype.splice.call(d,A,1),R&&(ks(u),o.g[h].length==0&&(delete o.g[h],o.h--))}}function ao(o,u,h,d){for(let A=0;A<o.length;++A){const R=o[A];if(!R.da&&R.listener==u&&R.capture==!!h&&R.ha==d)return A}return-1}var co="closure_lm_"+(Math.random()*1e6|0),uo={};function Pc(o,u,h,d,A){if(Array.isArray(u)){for(let R=0;R<u.length;R++)Pc(o,u[R],h,d,A);return null}return h=Cc(h),o&&o[un]?o.J(u,h,c(d)?!!d.capture:!1,A):Fd(o,u,h,!1,d,A)}function Fd(o,u,h,d,A,R){if(!u)throw Error("Invalid event type");const k=c(A)?!!A.capture:!!A;let K=ho(o);if(K||(o[co]=K=new Os(o)),h=K.add(u,h,d,k,R),h.proxy)return h;if(d=Bd(),h.proxy=d,d.src=o,d.listener=h,o.addEventListener)b||(A=k),A===void 0&&(A=!1),o.addEventListener(u.toString(),d,A);else if(o.attachEvent)o.attachEvent(Sc(u.toString()),d);else if(o.addListener&&o.removeListener)o.addListener(d);else throw Error("addEventListener and attachEvent are unavailable.");return h}function Bd(){function o(h){return u.call(o.src,o.listener,h)}const u=$d;return o}function Vc(o,u,h,d,A){if(Array.isArray(u))for(var R=0;R<u.length;R++)Vc(o,u[R],h,d,A);else d=c(d)?!!d.capture:!!d,h=Cc(h),o&&o[un]?(o=o.i,R=String(u).toString(),R in o.g&&(u=o.g[R],h=ao(u,h,d,A),h>-1&&(ks(u[h]),Array.prototype.splice.call(u,h,1),u.length==0&&(delete o.g[R],o.h--)))):o&&(o=ho(o))&&(u=o.g[u.toString()],o=-1,u&&(o=ao(u,h,d,A)),(h=o>-1?u[o]:null)&&lo(h))}function lo(o){if(typeof o!="number"&&o&&!o.da){var u=o.src;if(u&&u[un])oo(u.i,o);else{var h=o.type,d=o.proxy;u.removeEventListener?u.removeEventListener(h,d,o.capture):u.detachEvent?u.detachEvent(Sc(h),d):u.addListener&&u.removeListener&&u.removeListener(d),(h=ho(u))?(oo(h,o),h.h==0&&(h.src=null,u[co]=null)):ks(o)}}}function Sc(o){return o in uo?uo[o]:uo[o]="on"+o}function $d(o,u){if(o.da)o=!0;else{u=new Me(u,this);const h=o.listener,d=o.ha||o.src;o.fa&&lo(o),o=h.call(d,u)}return o}function ho(o){return o=o[co],o instanceof Os?o:null}var fo="__closure_events_fn_"+(Math.random()*1e9>>>0);function Cc(o){return typeof o=="function"?o:(o[fo]||(o[fo]=function(u){return o.handleEvent(u)}),o[fo])}function Ve(){I.call(this),this.i=new Os(this),this.M=this,this.G=null}m(Ve,I),Ve.prototype[un]=!0,Ve.prototype.removeEventListener=function(o,u,h,d){Vc(this,o,u,h,d)};function Oe(o,u){var h,d=o.G;if(d)for(h=[];d;d=d.G)h.push(d);if(o=o.M,d=u.type||u,typeof u=="string")u=new w(u,o);else if(u instanceof w)u.target=u.target||o;else{var A=u;u=new w(d,o),Rc(u,A)}A=!0;let R,k;if(h)for(k=h.length-1;k>=0;k--)R=u.g=h[k],A=Ls(R,d,!0,u)&&A;if(R=u.g=o,A=Ls(R,d,!0,u)&&A,A=Ls(R,d,!1,u)&&A,h)for(k=0;k<h.length;k++)R=u.g=h[k],A=Ls(R,d,!1,u)&&A}Ve.prototype.N=function(){if(Ve.Z.N.call(this),this.i){var o=this.i;for(const u in o.g){const h=o.g[u];for(let d=0;d<h.length;d++)ks(h[d]);delete o.g[u],o.h--}}this.G=null},Ve.prototype.J=function(o,u,h,d){return this.i.add(String(o),u,!1,h,d)},Ve.prototype.K=function(o,u,h,d){return this.i.add(String(o),u,!0,h,d)};function Ls(o,u,h,d){if(u=o.i.g[String(u)],!u)return!0;u=u.concat();let A=!0;for(let R=0;R<u.length;++R){const k=u[R];if(k&&!k.da&&k.capture==h){const K=k.listener,_e=k.ha||k.src;k.fa&&oo(o.i,k),A=K.call(_e,d)!==!1&&A}}return A&&!d.defaultPrevented}function qd(o,u){if(typeof o!="function")if(o&&typeof o.handleEvent=="function")o=f(o.handleEvent,o);else throw Error("Invalid listener argument");return Number(u)>2147483647?-1:a.setTimeout(o,u||0)}function xc(o){o.g=qd(()=>{o.g=null,o.i&&(o.i=!1,xc(o))},o.l);const u=o.h;o.h=null,o.m.apply(null,u)}class jd extends I{constructor(u,h){super(),this.m=u,this.l=h,this.h=null,this.i=!1,this.g=null}j(u){this.h=arguments,this.g?this.i=!0:xc(this)}N(){super.N(),this.g&&(a.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function pr(o){I.call(this),this.h=o,this.g={}}m(pr,I);var Nc=[];function kc(o){Ds(o.g,function(u,h){this.g.hasOwnProperty(h)&&lo(u)},o),o.g={}}pr.prototype.N=function(){pr.Z.N.call(this),kc(this)},pr.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var po=a.JSON.stringify,zd=a.JSON.parse,Wd=class{stringify(o){return a.JSON.stringify(o,void 0)}parse(o){return a.JSON.parse(o,void 0)}};function Dc(){}function Oc(){}var mr={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function mo(){w.call(this,"d")}m(mo,w);function go(){w.call(this,"c")}m(go,w);var ln={},Lc=null;function Ms(){return Lc=Lc||new Ve}ln.Ia="serverreachability";function Mc(o){w.call(this,ln.Ia,o)}m(Mc,w);function gr(o){const u=Ms();Oe(u,new Mc(u))}ln.STAT_EVENT="statevent";function Uc(o,u){w.call(this,ln.STAT_EVENT,o),this.stat=u}m(Uc,w);function Le(o){const u=Ms();Oe(u,new Uc(u,o))}ln.Ja="timingevent";function Fc(o,u){w.call(this,ln.Ja,o),this.size=u}m(Fc,w);function _r(o,u){if(typeof o!="function")throw Error("Fn must not be null and must be a function");return a.setTimeout(function(){o()},u)}function yr(){this.g=!0}yr.prototype.ua=function(){this.g=!1};function Hd(o,u,h,d,A,R){o.info(function(){if(o.g)if(R){var k="",K=R.split("&");for(let ne=0;ne<K.length;ne++){var _e=K[ne].split("=");if(_e.length>1){const we=_e[0];_e=_e[1];const at=we.split("_");k=at.length>=2&&at[1]=="type"?k+(we+"="+_e+"&"):k+(we+"=redacted&")}}}else k=null;else k=R;return"XMLHTTP REQ ("+d+") [attempt "+A+"]: "+u+`
`+h+`
`+k})}function Gd(o,u,h,d,A,R,k){o.info(function(){return"XMLHTTP RESP ("+d+") [ attempt "+A+"]: "+u+`
`+h+`
`+R+" "+k})}function On(o,u,h,d){o.info(function(){return"XMLHTTP TEXT ("+u+"): "+Qd(o,h)+(d?" "+d:"")})}function Kd(o,u){o.info(function(){return"TIMEOUT: "+u})}yr.prototype.info=function(){};function Qd(o,u){if(!o.g)return u;if(!u)return null;try{const R=JSON.parse(u);if(R){for(o=0;o<R.length;o++)if(Array.isArray(R[o])){var h=R[o];if(!(h.length<2)){var d=h[1];if(Array.isArray(d)&&!(d.length<1)){var A=d[0];if(A!="noop"&&A!="stop"&&A!="close")for(let k=1;k<d.length;k++)d[k]=""}}}}return po(R)}catch{return u}}var Us={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},Bc={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},$c;function _o(){}m(_o,Dc),_o.prototype.g=function(){return new XMLHttpRequest},$c=new _o;function Er(o){return encodeURIComponent(String(o))}function Xd(o){var u=1;o=o.split(":");const h=[];for(;u>0&&o.length;)h.push(o.shift()),u--;return o.length&&h.push(o.join(":")),h}function kt(o,u,h,d){this.j=o,this.i=u,this.l=h,this.S=d||1,this.V=new pr(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new qc}function qc(){this.i=null,this.g="",this.h=!1}var jc={},yo={};function Eo(o,u,h){o.M=1,o.A=Bs(ot(u)),o.u=h,o.R=!0,zc(o,null)}function zc(o,u){o.F=Date.now(),Fs(o),o.B=ot(o.A);var h=o.B,d=o.S;Array.isArray(d)||(d=[String(d)]),ru(h.i,"t",d),o.C=0,h=o.j.L,o.h=new qc,o.g=Tu(o.j,h?u:null,!o.u),o.P>0&&(o.O=new jd(f(o.Y,o,o.g),o.P)),u=o.V,h=o.g,d=o.ba;var A="readystatechange";Array.isArray(A)||(A&&(Nc[0]=A.toString()),A=Nc);for(let R=0;R<A.length;R++){const k=Pc(h,A[R],d||u.handleEvent,!1,u.h||u);if(!k)break;u.g[k.key]=k}u=o.J?Ac(o.J):{},o.u?(o.v||(o.v="POST"),u["Content-Type"]="application/x-www-form-urlencoded",o.g.ea(o.B,o.v,o.u,u)):(o.v="GET",o.g.ea(o.B,o.v,null,u)),gr(),Hd(o.i,o.v,o.B,o.l,o.S,o.u)}kt.prototype.ba=function(o){o=o.target;const u=this.O;u&&Lt(o)==3?u.j():this.Y(o)},kt.prototype.Y=function(o){try{if(o==this.g)e:{const K=Lt(this.g),_e=this.g.ya(),ne=this.g.ca();if(!(K<3)&&(K!=3||this.g&&(this.h.h||this.g.la()||lu(this.g)))){this.K||K!=4||_e==7||(_e==8||ne<=0?gr(3):gr(2)),wo(this);var u=this.g.ca();this.X=u;var h=Jd(this);if(this.o=u==200,Gd(this.i,this.v,this.B,this.l,this.S,K,u),this.o){if(this.U&&!this.L){t:{if(this.g){var d,A=this.g;if((d=A.g?A.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!_(d)){var R=d;break t}}R=null}if(o=R)On(this.i,this.l,o,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,To(this,o);else{this.o=!1,this.m=3,Le(12),hn(this),wr(this);break e}}if(this.R){o=!0;let we;for(;!this.K&&this.C<h.length;)if(we=Yd(this,h),we==yo){K==4&&(this.m=4,Le(14),o=!1),On(this.i,this.l,null,"[Incomplete Response]");break}else if(we==jc){this.m=4,Le(15),On(this.i,this.l,h,"[Invalid Chunk]"),o=!1;break}else On(this.i,this.l,we,null),To(this,we);if(Wc(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),K!=4||h.length!=0||this.h.h||(this.m=1,Le(16),o=!1),this.o=this.o&&o,!o)On(this.i,this.l,h,"[Invalid Chunked Response]"),hn(this),wr(this);else if(h.length>0&&!this.W){this.W=!0;var k=this.j;k.g==this&&k.aa&&!k.P&&(k.j.info("Great, no buffering proxy detected. Bytes received: "+h.length),So(k),k.P=!0,Le(11))}}else On(this.i,this.l,h,null),To(this,h);K==4&&hn(this),this.o&&!this.K&&(K==4?_u(this.j,this):(this.o=!1,Fs(this)))}else fp(this.g),u==400&&h.indexOf("Unknown SID")>0?(this.m=3,Le(12)):(this.m=0,Le(13)),hn(this),wr(this)}}}catch{}finally{}};function Jd(o){if(!Wc(o))return o.g.la();const u=lu(o.g);if(u==="")return"";let h="";const d=u.length,A=Lt(o.g)==4;if(!o.h.i){if(typeof TextDecoder>"u")return hn(o),wr(o),"";o.h.i=new a.TextDecoder}for(let R=0;R<d;R++)o.h.h=!0,h+=o.h.i.decode(u[R],{stream:!(A&&R==d-1)});return u.length=0,o.h.g+=h,o.C=0,o.h.g}function Wc(o){return o.g?o.v=="GET"&&o.M!=2&&o.j.Aa:!1}function Yd(o,u){var h=o.C,d=u.indexOf(`
`,h);return d==-1?yo:(h=Number(u.substring(h,d)),isNaN(h)?jc:(d+=1,d+h>u.length?yo:(u=u.slice(d,d+h),o.C=d+h,u)))}kt.prototype.cancel=function(){this.K=!0,hn(this)};function Fs(o){o.T=Date.now()+o.H,Hc(o,o.H)}function Hc(o,u){if(o.D!=null)throw Error("WatchDog timer not null");o.D=_r(f(o.aa,o),u)}function wo(o){o.D&&(a.clearTimeout(o.D),o.D=null)}kt.prototype.aa=function(){this.D=null;const o=Date.now();o-this.T>=0?(Kd(this.i,this.B),this.M!=2&&(gr(),Le(17)),hn(this),this.m=2,wr(this)):Hc(this,this.T-o)};function wr(o){o.j.I==0||o.K||_u(o.j,o)}function hn(o){wo(o);var u=o.O;u&&typeof u.dispose=="function"&&u.dispose(),o.O=null,kc(o.V),o.g&&(u=o.g,o.g=null,u.abort(),u.dispose())}function To(o,u){try{var h=o.j;if(h.I!=0&&(h.g==o||vo(h.h,o))){if(!o.L&&vo(h.h,o)&&h.I==3){try{var d=h.Ba.g.parse(u)}catch{d=null}if(Array.isArray(d)&&d.length==3){var A=d;if(A[0]==0){e:if(!h.v){if(h.g)if(h.g.F+3e3<o.F)Ws(h),js(h);else break e;Vo(h),Le(18)}}else h.xa=A[1],0<h.xa-h.K&&A[2]<37500&&h.F&&h.A==0&&!h.C&&(h.C=_r(f(h.Va,h),6e3));Qc(h.h)<=1&&h.ta&&(h.ta=void 0)}else dn(h,11)}else if((o.L||h.g==o)&&Ws(h),!_(u))for(A=h.Ba.g.parse(u),u=0;u<A.length;u++){let ne=A[u];const we=ne[0];if(!(we<=h.K))if(h.K=we,ne=ne[1],h.I==2)if(ne[0]=="c"){h.M=ne[1],h.ba=ne[2];const at=ne[3];at!=null&&(h.ka=at,h.j.info("VER="+h.ka));const pn=ne[4];pn!=null&&(h.za=pn,h.j.info("SVER="+h.za));const Mt=ne[5];Mt!=null&&typeof Mt=="number"&&Mt>0&&(d=1.5*Mt,h.O=d,h.j.info("backChannelRequestTimeoutMs_="+d)),d=h;const Ut=o.g;if(Ut){const Gs=Ut.g?Ut.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Gs){var R=d.h;R.g||Gs.indexOf("spdy")==-1&&Gs.indexOf("quic")==-1&&Gs.indexOf("h2")==-1||(R.j=R.l,R.g=new Set,R.h&&(Io(R,R.h),R.h=null))}if(d.G){const Co=Ut.g?Ut.g.getResponseHeader("X-HTTP-Session-Id"):null;Co&&(d.wa=Co,ie(d.J,d.G,Co))}}h.I=3,h.l&&h.l.ra(),h.aa&&(h.T=Date.now()-o.F,h.j.info("Handshake RTT: "+h.T+"ms")),d=h;var k=o;if(d.na=wu(d,d.L?d.ba:null,d.W),k.L){Xc(d.h,k);var K=k,_e=d.O;_e&&(K.H=_e),K.D&&(wo(K),Fs(K)),d.g=k}else mu(d);h.i.length>0&&zs(h)}else ne[0]!="stop"&&ne[0]!="close"||dn(h,7);else h.I==3&&(ne[0]=="stop"||ne[0]=="close"?ne[0]=="stop"?dn(h,7):Po(h):ne[0]!="noop"&&h.l&&h.l.qa(ne),h.A=0)}}gr(4)}catch{}}var Zd=class{constructor(o,u){this.g=o,this.map=u}};function Gc(o){this.l=o||10,a.PerformanceNavigationTiming?(o=a.performance.getEntriesByType("navigation"),o=o.length>0&&(o[0].nextHopProtocol=="hq"||o[0].nextHopProtocol=="h2")):o=!!(a.chrome&&a.chrome.loadTimes&&a.chrome.loadTimes()&&a.chrome.loadTimes().wasFetchedViaSpdy),this.j=o?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function Kc(o){return o.h?!0:o.g?o.g.size>=o.j:!1}function Qc(o){return o.h?1:o.g?o.g.size:0}function vo(o,u){return o.h?o.h==u:o.g?o.g.has(u):!1}function Io(o,u){o.g?o.g.add(u):o.h=u}function Xc(o,u){o.h&&o.h==u?o.h=null:o.g&&o.g.has(u)&&o.g.delete(u)}Gc.prototype.cancel=function(){if(this.i=Jc(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const o of this.g.values())o.cancel();this.g.clear()}};function Jc(o){if(o.h!=null)return o.i.concat(o.h.G);if(o.g!=null&&o.g.size!==0){let u=o.i;for(const h of o.g.values())u=u.concat(h.G);return u}return V(o.i)}var Yc=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function ep(o,u){if(o){o=o.split("&");for(let h=0;h<o.length;h++){const d=o[h].indexOf("=");let A,R=null;d>=0?(A=o[h].substring(0,d),R=o[h].substring(d+1)):A=o[h],u(A,R?decodeURIComponent(R.replace(/\+/g," ")):"")}}}function Dt(o){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let u;o instanceof Dt?(this.l=o.l,Tr(this,o.j),this.o=o.o,this.g=o.g,vr(this,o.u),this.h=o.h,Ao(this,su(o.i)),this.m=o.m):o&&(u=String(o).match(Yc))?(this.l=!1,Tr(this,u[1]||"",!0),this.o=Ir(u[2]||""),this.g=Ir(u[3]||"",!0),vr(this,u[4]),this.h=Ir(u[5]||"",!0),Ao(this,u[6]||"",!0),this.m=Ir(u[7]||"")):(this.l=!1,this.i=new br(null,this.l))}Dt.prototype.toString=function(){const o=[];var u=this.j;u&&o.push(Ar(u,Zc,!0),":");var h=this.g;return(h||u=="file")&&(o.push("//"),(u=this.o)&&o.push(Ar(u,Zc,!0),"@"),o.push(Er(h).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),h=this.u,h!=null&&o.push(":",String(h))),(h=this.h)&&(this.g&&h.charAt(0)!="/"&&o.push("/"),o.push(Ar(h,h.charAt(0)=="/"?rp:np,!0))),(h=this.i.toString())&&o.push("?",h),(h=this.m)&&o.push("#",Ar(h,ip)),o.join("")},Dt.prototype.resolve=function(o){const u=ot(this);let h=!!o.j;h?Tr(u,o.j):h=!!o.o,h?u.o=o.o:h=!!o.g,h?u.g=o.g:h=o.u!=null;var d=o.h;if(h)vr(u,o.u);else if(h=!!o.h){if(d.charAt(0)!="/")if(this.g&&!this.h)d="/"+d;else{var A=u.h.lastIndexOf("/");A!=-1&&(d=u.h.slice(0,A+1)+d)}if(A=d,A==".."||A==".")d="";else if(A.indexOf("./")!=-1||A.indexOf("/.")!=-1){d=A.lastIndexOf("/",0)==0,A=A.split("/");const R=[];for(let k=0;k<A.length;){const K=A[k++];K=="."?d&&k==A.length&&R.push(""):K==".."?((R.length>1||R.length==1&&R[0]!="")&&R.pop(),d&&k==A.length&&R.push("")):(R.push(K),d=!0)}d=R.join("/")}else d=A}return h?u.h=d:h=o.i.toString()!=="",h?Ao(u,su(o.i)):h=!!o.m,h&&(u.m=o.m),u};function ot(o){return new Dt(o)}function Tr(o,u,h){o.j=h?Ir(u,!0):u,o.j&&(o.j=o.j.replace(/:$/,""))}function vr(o,u){if(u){if(u=Number(u),isNaN(u)||u<0)throw Error("Bad port number "+u);o.u=u}else o.u=null}function Ao(o,u,h){u instanceof br?(o.i=u,op(o.i,o.l)):(h||(u=Ar(u,sp)),o.i=new br(u,o.l))}function ie(o,u,h){o.i.set(u,h)}function Bs(o){return ie(o,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),o}function Ir(o,u){return o?u?decodeURI(o.replace(/%25/g,"%2525")):decodeURIComponent(o):""}function Ar(o,u,h){return typeof o=="string"?(o=encodeURI(o).replace(u,tp),h&&(o=o.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),o):null}function tp(o){return o=o.charCodeAt(0),"%"+(o>>4&15).toString(16)+(o&15).toString(16)}var Zc=/[#\/\?@]/g,np=/[#\?:]/g,rp=/[#\?]/g,sp=/[#\?@]/g,ip=/#/g;function br(o,u){this.h=this.g=null,this.i=o||null,this.j=!!u}function fn(o){o.g||(o.g=new Map,o.h=0,o.i&&ep(o.i,function(u,h){o.add(decodeURIComponent(u.replace(/\+/g," ")),h)}))}n=br.prototype,n.add=function(o,u){fn(this),this.i=null,o=Ln(this,o);let h=this.g.get(o);return h||this.g.set(o,h=[]),h.push(u),this.h+=1,this};function eu(o,u){fn(o),u=Ln(o,u),o.g.has(u)&&(o.i=null,o.h-=o.g.get(u).length,o.g.delete(u))}function tu(o,u){return fn(o),u=Ln(o,u),o.g.has(u)}n.forEach=function(o,u){fn(this),this.g.forEach(function(h,d){h.forEach(function(A){o.call(u,A,d,this)},this)},this)};function nu(o,u){fn(o);let h=[];if(typeof u=="string")tu(o,u)&&(h=h.concat(o.g.get(Ln(o,u))));else for(o=Array.from(o.g.values()),u=0;u<o.length;u++)h=h.concat(o[u]);return h}n.set=function(o,u){return fn(this),this.i=null,o=Ln(this,o),tu(this,o)&&(this.h-=this.g.get(o).length),this.g.set(o,[u]),this.h+=1,this},n.get=function(o,u){return o?(o=nu(this,o),o.length>0?String(o[0]):u):u};function ru(o,u,h){eu(o,u),h.length>0&&(o.i=null,o.g.set(Ln(o,u),V(h)),o.h+=h.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const o=[],u=Array.from(this.g.keys());for(let d=0;d<u.length;d++){var h=u[d];const A=Er(h);h=nu(this,h);for(let R=0;R<h.length;R++){let k=A;h[R]!==""&&(k+="="+Er(h[R])),o.push(k)}}return this.i=o.join("&")};function su(o){const u=new br;return u.i=o.i,o.g&&(u.g=new Map(o.g),u.h=o.h),u}function Ln(o,u){return u=String(u),o.j&&(u=u.toLowerCase()),u}function op(o,u){u&&!o.j&&(fn(o),o.i=null,o.g.forEach(function(h,d){const A=d.toLowerCase();d!=A&&(eu(this,d),ru(this,A,h))},o)),o.j=u}function ap(o,u){const h=new yr;if(a.Image){const d=new Image;d.onload=p(Ot,h,"TestLoadImage: loaded",!0,u,d),d.onerror=p(Ot,h,"TestLoadImage: error",!1,u,d),d.onabort=p(Ot,h,"TestLoadImage: abort",!1,u,d),d.ontimeout=p(Ot,h,"TestLoadImage: timeout",!1,u,d),a.setTimeout(function(){d.ontimeout&&d.ontimeout()},1e4),d.src=o}else u(!1)}function cp(o,u){const h=new yr,d=new AbortController,A=setTimeout(()=>{d.abort(),Ot(h,"TestPingServer: timeout",!1,u)},1e4);fetch(o,{signal:d.signal}).then(R=>{clearTimeout(A),R.ok?Ot(h,"TestPingServer: ok",!0,u):Ot(h,"TestPingServer: server error",!1,u)}).catch(()=>{clearTimeout(A),Ot(h,"TestPingServer: error",!1,u)})}function Ot(o,u,h,d,A){try{A&&(A.onload=null,A.onerror=null,A.onabort=null,A.ontimeout=null),d(h)}catch{}}function up(){this.g=new Wd}function bo(o){this.i=o.Sb||null,this.h=o.ab||!1}m(bo,Dc),bo.prototype.g=function(){return new $s(this.i,this.h)};function $s(o,u){Ve.call(this),this.H=o,this.o=u,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}m($s,Ve),n=$s.prototype,n.open=function(o,u){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=o,this.D=u,this.readyState=1,Pr(this)},n.send=function(o){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const u={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};o&&(u.body=o),(this.H||a).fetch(new Request(this.D,u)).then(this.Pa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,Rr(this)),this.readyState=0},n.Pa=function(o){if(this.g&&(this.l=o,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=o.headers,this.readyState=2,Pr(this)),this.g&&(this.readyState=3,Pr(this),this.g)))if(this.responseType==="arraybuffer")o.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof a.ReadableStream<"u"&&"body"in o){if(this.j=o.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;iu(this)}else o.text().then(this.Oa.bind(this),this.ga.bind(this))};function iu(o){o.j.read().then(o.Ma.bind(o)).catch(o.ga.bind(o))}n.Ma=function(o){if(this.g){if(this.o&&o.value)this.response.push(o.value);else if(!this.o){var u=o.value?o.value:new Uint8Array(0);(u=this.B.decode(u,{stream:!o.done}))&&(this.response=this.responseText+=u)}o.done?Rr(this):Pr(this),this.readyState==3&&iu(this)}},n.Oa=function(o){this.g&&(this.response=this.responseText=o,Rr(this))},n.Na=function(o){this.g&&(this.response=o,Rr(this))},n.ga=function(){this.g&&Rr(this)};function Rr(o){o.readyState=4,o.l=null,o.j=null,o.B=null,Pr(o)}n.setRequestHeader=function(o,u){this.A.append(o,u)},n.getResponseHeader=function(o){return this.h&&this.h.get(o.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const o=[],u=this.h.entries();for(var h=u.next();!h.done;)h=h.value,o.push(h[0]+": "+h[1]),h=u.next();return o.join(`\r
`)};function Pr(o){o.onreadystatechange&&o.onreadystatechange.call(o)}Object.defineProperty($s.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(o){this.m=o?"include":"same-origin"}});function ou(o){let u="";return Ds(o,function(h,d){u+=d,u+=":",u+=h,u+=`\r
`}),u}function Ro(o,u,h){e:{for(d in h){var d=!1;break e}d=!0}d||(h=ou(h),typeof o=="string"?h!=null&&Er(h):ie(o,u,h))}function ce(o){Ve.call(this),this.headers=new Map,this.L=o||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}m(ce,Ve);var lp=/^https?$/i,hp=["POST","PUT"];n=ce.prototype,n.Fa=function(o){this.H=o},n.ea=function(o,u,h,d){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+o);u=u?u.toUpperCase():"GET",this.D=o,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():$c.g(),this.g.onreadystatechange=v(f(this.Ca,this));try{this.B=!0,this.g.open(u,String(o),!0),this.B=!1}catch(R){au(this,R);return}if(o=h||"",h=new Map(this.headers),d)if(Object.getPrototypeOf(d)===Object.prototype)for(var A in d)h.set(A,d[A]);else if(typeof d.keys=="function"&&typeof d.get=="function")for(const R of d.keys())h.set(R,d.get(R));else throw Error("Unknown input type for opt_headers: "+String(d));d=Array.from(h.keys()).find(R=>R.toLowerCase()=="content-type"),A=a.FormData&&o instanceof a.FormData,!(Array.prototype.indexOf.call(hp,u,void 0)>=0)||d||A||h.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[R,k]of h)this.g.setRequestHeader(R,k);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(o),this.v=!1}catch(R){au(this,R)}};function au(o,u){o.h=!1,o.g&&(o.j=!0,o.g.abort(),o.j=!1),o.l=u,o.o=5,cu(o),qs(o)}function cu(o){o.A||(o.A=!0,Oe(o,"complete"),Oe(o,"error"))}n.abort=function(o){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=o||7,Oe(this,"complete"),Oe(this,"abort"),qs(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),qs(this,!0)),ce.Z.N.call(this)},n.Ca=function(){this.u||(this.B||this.v||this.j?uu(this):this.Xa())},n.Xa=function(){uu(this)};function uu(o){if(o.h&&typeof i<"u"){if(o.v&&Lt(o)==4)setTimeout(o.Ca.bind(o),0);else if(Oe(o,"readystatechange"),Lt(o)==4){o.h=!1;try{const R=o.ca();e:switch(R){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var u=!0;break e;default:u=!1}var h;if(!(h=u)){var d;if(d=R===0){let k=String(o.D).match(Yc)[1]||null;!k&&a.self&&a.self.location&&(k=a.self.location.protocol.slice(0,-1)),d=!lp.test(k?k.toLowerCase():"")}h=d}if(h)Oe(o,"complete"),Oe(o,"success");else{o.o=6;try{var A=Lt(o)>2?o.g.statusText:""}catch{A=""}o.l=A+" ["+o.ca()+"]",cu(o)}}finally{qs(o)}}}}function qs(o,u){if(o.g){o.m&&(clearTimeout(o.m),o.m=null);const h=o.g;o.g=null,u||Oe(o,"ready");try{h.onreadystatechange=null}catch{}}}n.isActive=function(){return!!this.g};function Lt(o){return o.g?o.g.readyState:0}n.ca=function(){try{return Lt(this)>2?this.g.status:-1}catch{return-1}},n.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.La=function(o){if(this.g){var u=this.g.responseText;return o&&u.indexOf(o)==0&&(u=u.substring(o.length)),zd(u)}};function lu(o){try{if(!o.g)return null;if("response"in o.g)return o.g.response;switch(o.F){case"":case"text":return o.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in o.g)return o.g.mozResponseArrayBuffer}return null}catch{return null}}function fp(o){const u={};o=(o.g&&Lt(o)>=2&&o.g.getAllResponseHeaders()||"").split(`\r
`);for(let d=0;d<o.length;d++){if(_(o[d]))continue;var h=Xd(o[d]);const A=h[0];if(h=h[1],typeof h!="string")continue;h=h.trim();const R=u[A]||[];u[A]=R,R.push(h)}Ud(u,function(d){return d.join(", ")})}n.ya=function(){return this.o},n.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function Vr(o,u,h){return h&&h.internalChannelParams&&h.internalChannelParams[o]||u}function hu(o){this.za=0,this.i=[],this.j=new yr,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=Vr("failFast",!1,o),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=Vr("baseRetryDelayMs",5e3,o),this.Za=Vr("retryDelaySeedMs",1e4,o),this.Ta=Vr("forwardChannelMaxRetries",2,o),this.va=Vr("forwardChannelRequestTimeoutMs",2e4,o),this.ma=o&&o.xmlHttpFactory||void 0,this.Ua=o&&o.Rb||void 0,this.Aa=o&&o.useFetchStreams||!1,this.O=void 0,this.L=o&&o.supportsCrossDomainXhr||!1,this.M="",this.h=new Gc(o&&o.concurrentRequestLimit),this.Ba=new up,this.S=o&&o.fastHandshake||!1,this.R=o&&o.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=o&&o.Pb||!1,o&&o.ua&&this.j.ua(),o&&o.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&o&&o.detectBufferingProxy||!1,this.ia=void 0,o&&o.longPollingTimeout&&o.longPollingTimeout>0&&(this.ia=o.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}n=hu.prototype,n.ka=8,n.I=1,n.connect=function(o,u,h,d){Le(0),this.W=o,this.H=u||{},h&&d!==void 0&&(this.H.OSID=h,this.H.OAID=d),this.F=this.X,this.J=wu(this,null,this.W),zs(this)};function Po(o){if(fu(o),o.I==3){var u=o.V++,h=ot(o.J);if(ie(h,"SID",o.M),ie(h,"RID",u),ie(h,"TYPE","terminate"),Sr(o,h),u=new kt(o,o.j,u),u.M=2,u.A=Bs(ot(h)),h=!1,a.navigator&&a.navigator.sendBeacon)try{h=a.navigator.sendBeacon(u.A.toString(),"")}catch{}!h&&a.Image&&(new Image().src=u.A,h=!0),h||(u.g=Tu(u.j,null),u.g.ea(u.A)),u.F=Date.now(),Fs(u)}Eu(o)}function js(o){o.g&&(So(o),o.g.cancel(),o.g=null)}function fu(o){js(o),o.v&&(a.clearTimeout(o.v),o.v=null),Ws(o),o.h.cancel(),o.m&&(typeof o.m=="number"&&a.clearTimeout(o.m),o.m=null)}function zs(o){if(!Kc(o.h)&&!o.m){o.m=!0;var u=o.Ea;me||g(),ge||(me(),ge=!0),T.add(u,o),o.D=0}}function dp(o,u){return Qc(o.h)>=o.h.j-(o.m?1:0)?!1:o.m?(o.i=u.G.concat(o.i),!0):o.I==1||o.I==2||o.D>=(o.Sa?0:o.Ta)?!1:(o.m=_r(f(o.Ea,o,u),yu(o,o.D)),o.D++,!0)}n.Ea=function(o){if(this.m)if(this.m=null,this.I==1){if(!o){this.V=Math.floor(Math.random()*1e5),o=this.V++;const A=new kt(this,this.j,o);let R=this.o;if(this.U&&(R?(R=Ac(R),Rc(R,this.U)):R=this.U),this.u!==null||this.R||(A.J=R,R=null),this.S)e:{for(var u=0,h=0;h<this.i.length;h++){t:{var d=this.i[h];if("__data__"in d.map&&(d=d.map.__data__,typeof d=="string")){d=d.length;break t}d=void 0}if(d===void 0)break;if(u+=d,u>4096){u=h;break e}if(u===4096||h===this.i.length-1){u=h+1;break e}}u=1e3}else u=1e3;u=pu(this,A,u),h=ot(this.J),ie(h,"RID",o),ie(h,"CVER",22),this.G&&ie(h,"X-HTTP-Session-Id",this.G),Sr(this,h),R&&(this.R?u="headers="+Er(ou(R))+"&"+u:this.u&&Ro(h,this.u,R)),Io(this.h,A),this.Ra&&ie(h,"TYPE","init"),this.S?(ie(h,"$req",u),ie(h,"SID","null"),A.U=!0,Eo(A,h,null)):Eo(A,h,u),this.I=2}}else this.I==3&&(o?du(this,o):this.i.length==0||Kc(this.h)||du(this))};function du(o,u){var h;u?h=u.l:h=o.V++;const d=ot(o.J);ie(d,"SID",o.M),ie(d,"RID",h),ie(d,"AID",o.K),Sr(o,d),o.u&&o.o&&Ro(d,o.u,o.o),h=new kt(o,o.j,h,o.D+1),o.u===null&&(h.J=o.o),u&&(o.i=u.G.concat(o.i)),u=pu(o,h,1e3),h.H=Math.round(o.va*.5)+Math.round(o.va*.5*Math.random()),Io(o.h,h),Eo(h,d,u)}function Sr(o,u){o.H&&Ds(o.H,function(h,d){ie(u,d,h)}),o.l&&Ds({},function(h,d){ie(u,d,h)})}function pu(o,u,h){h=Math.min(o.i.length,h);const d=o.l?f(o.l.Ka,o.l,o):null;e:{var A=o.i;let K=-1;for(;;){const _e=["count="+h];K==-1?h>0?(K=A[0].g,_e.push("ofs="+K)):K=0:_e.push("ofs="+K);let ne=!0;for(let we=0;we<h;we++){var R=A[we].g;const at=A[we].map;if(R-=K,R<0)K=Math.max(0,A[we].g-100),ne=!1;else try{R="req"+R+"_"||"";try{var k=at instanceof Map?at:Object.entries(at);for(const[pn,Mt]of k){let Ut=Mt;c(Mt)&&(Ut=po(Mt)),_e.push(R+pn+"="+encodeURIComponent(Ut))}}catch(pn){throw _e.push(R+"type="+encodeURIComponent("_badmap")),pn}}catch{d&&d(at)}}if(ne){k=_e.join("&");break e}}k=void 0}return o=o.i.splice(0,h),u.G=o,k}function mu(o){if(!o.g&&!o.v){o.Y=1;var u=o.Da;me||g(),ge||(me(),ge=!0),T.add(u,o),o.A=0}}function Vo(o){return o.g||o.v||o.A>=3?!1:(o.Y++,o.v=_r(f(o.Da,o),yu(o,o.A)),o.A++,!0)}n.Da=function(){if(this.v=null,gu(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var o=4*this.T;this.j.info("BP detection timer enabled: "+o),this.B=_r(f(this.Wa,this),o)}},n.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,Le(10),js(this),gu(this))};function So(o){o.B!=null&&(a.clearTimeout(o.B),o.B=null)}function gu(o){o.g=new kt(o,o.j,"rpc",o.Y),o.u===null&&(o.g.J=o.o),o.g.P=0;var u=ot(o.na);ie(u,"RID","rpc"),ie(u,"SID",o.M),ie(u,"AID",o.K),ie(u,"CI",o.F?"0":"1"),!o.F&&o.ia&&ie(u,"TO",o.ia),ie(u,"TYPE","xmlhttp"),Sr(o,u),o.u&&o.o&&Ro(u,o.u,o.o),o.O&&(o.g.H=o.O);var h=o.g;o=o.ba,h.M=1,h.A=Bs(ot(u)),h.u=null,h.R=!0,zc(h,o)}n.Va=function(){this.C!=null&&(this.C=null,js(this),Vo(this),Le(19))};function Ws(o){o.C!=null&&(a.clearTimeout(o.C),o.C=null)}function _u(o,u){var h=null;if(o.g==u){Ws(o),So(o),o.g=null;var d=2}else if(vo(o.h,u))h=u.G,Xc(o.h,u),d=1;else return;if(o.I!=0){if(u.o)if(d==1){h=u.u?u.u.length:0,u=Date.now()-u.F;var A=o.D;d=Ms(),Oe(d,new Fc(d,h)),zs(o)}else mu(o);else if(A=u.m,A==3||A==0&&u.X>0||!(d==1&&dp(o,u)||d==2&&Vo(o)))switch(h&&h.length>0&&(u=o.h,u.i=u.i.concat(h)),A){case 1:dn(o,5);break;case 4:dn(o,10);break;case 3:dn(o,6);break;default:dn(o,2)}}}function yu(o,u){let h=o.Qa+Math.floor(Math.random()*o.Za);return o.isActive()||(h*=2),h*u}function dn(o,u){if(o.j.info("Error code "+u),u==2){var h=f(o.bb,o),d=o.Ua;const A=!d;d=new Dt(d||"//www.google.com/images/cleardot.gif"),a.location&&a.location.protocol=="http"||Tr(d,"https"),Bs(d),A?ap(d.toString(),h):cp(d.toString(),h)}else Le(2);o.I=0,o.l&&o.l.pa(u),Eu(o),fu(o)}n.bb=function(o){o?(this.j.info("Successfully pinged google.com"),Le(2)):(this.j.info("Failed to ping google.com"),Le(1))};function Eu(o){if(o.I=0,o.ja=[],o.l){const u=Jc(o.h);(u.length!=0||o.i.length!=0)&&(C(o.ja,u),C(o.ja,o.i),o.h.i.length=0,V(o.i),o.i.length=0),o.l.oa()}}function wu(o,u,h){var d=h instanceof Dt?ot(h):new Dt(h);if(d.g!="")u&&(d.g=u+"."+d.g),vr(d,d.u);else{var A=a.location;d=A.protocol,u=u?u+"."+A.hostname:A.hostname,A=+A.port;const R=new Dt(null);d&&Tr(R,d),u&&(R.g=u),A&&vr(R,A),h&&(R.h=h),d=R}return h=o.G,u=o.wa,h&&u&&ie(d,h,u),ie(d,"VER",o.ka),Sr(o,d),d}function Tu(o,u,h){if(u&&!o.L)throw Error("Can't create secondary domain capable XhrIo object.");return u=o.Aa&&!o.ma?new ce(new bo({ab:h})):new ce(o.ma),u.Fa(o.L),u}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function vu(){}n=vu.prototype,n.ra=function(){},n.qa=function(){},n.pa=function(){},n.oa=function(){},n.isActive=function(){return!0},n.Ka=function(){};function Hs(){}Hs.prototype.g=function(o,u){return new ze(o,u)};function ze(o,u){Ve.call(this),this.g=new hu(u),this.l=o,this.h=u&&u.messageUrlParams||null,o=u&&u.messageHeaders||null,u&&u.clientProtocolHeaderRequired&&(o?o["X-Client-Protocol"]="webchannel":o={"X-Client-Protocol":"webchannel"}),this.g.o=o,o=u&&u.initMessageHeaders||null,u&&u.messageContentType&&(o?o["X-WebChannel-Content-Type"]=u.messageContentType:o={"X-WebChannel-Content-Type":u.messageContentType}),u&&u.sa&&(o?o["X-WebChannel-Client-Profile"]=u.sa:o={"X-WebChannel-Client-Profile":u.sa}),this.g.U=o,(o=u&&u.Qb)&&!_(o)&&(this.g.u=o),this.A=u&&u.supportsCrossDomainXhr||!1,this.v=u&&u.sendRawJson||!1,(u=u&&u.httpSessionIdParam)&&!_(u)&&(this.g.G=u,o=this.h,o!==null&&u in o&&(o=this.h,u in o&&delete o[u])),this.j=new Mn(this)}m(ze,Ve),ze.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},ze.prototype.close=function(){Po(this.g)},ze.prototype.o=function(o){var u=this.g;if(typeof o=="string"){var h={};h.__data__=o,o=h}else this.v&&(h={},h.__data__=po(o),o=h);u.i.push(new Zd(u.Ya++,o)),u.I==3&&zs(u)},ze.prototype.N=function(){this.g.l=null,delete this.j,Po(this.g),delete this.g,ze.Z.N.call(this)};function Iu(o){mo.call(this),o.__headers__&&(this.headers=o.__headers__,this.statusCode=o.__status__,delete o.__headers__,delete o.__status__);var u=o.__sm__;if(u){e:{for(const h in u){o=h;break e}o=void 0}(this.i=o)&&(o=this.i,u=u!==null&&o in u?u[o]:void 0),this.data=u}else this.data=o}m(Iu,mo);function Au(){go.call(this),this.status=1}m(Au,go);function Mn(o){this.g=o}m(Mn,vu),Mn.prototype.ra=function(){Oe(this.g,"a")},Mn.prototype.qa=function(o){Oe(this.g,new Iu(o))},Mn.prototype.pa=function(o){Oe(this.g,new Au)},Mn.prototype.oa=function(){Oe(this.g,"b")},Hs.prototype.createWebChannel=Hs.prototype.g,ze.prototype.send=ze.prototype.o,ze.prototype.open=ze.prototype.m,ze.prototype.close=ze.prototype.close,$h=function(){return new Hs},Bh=function(){return Ms()},Fh=ln,Go={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},Us.NO_ERROR=0,Us.TIMEOUT=8,Us.HTTP_ERROR=6,oi=Us,Bc.COMPLETE="complete",Uh=Bc,Oc.EventType=mr,mr.OPEN="a",mr.CLOSE="b",mr.ERROR="c",mr.MESSAGE="d",Ve.prototype.listen=Ve.prototype.J,Nr=Oc,ce.prototype.listenOnce=ce.prototype.K,ce.prototype.getLastError=ce.prototype.Ha,ce.prototype.getLastErrorCode=ce.prototype.ya,ce.prototype.getStatus=ce.prototype.ca,ce.prototype.getResponseJson=ce.prototype.La,ce.prototype.getResponseText=ce.prototype.la,ce.prototype.send=ce.prototype.ea,ce.prototype.setWithCredentials=ce.prototype.Fa,Mh=ce}).apply(typeof Qs<"u"?Qs:typeof self<"u"?self:typeof window<"u"?window:{});/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ar="13.0.0";function O_(n){ar=n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rn=new pa("@firebase/firestore");function Un(){return Rn.logLevel}function D(n,...e){if(Rn.logLevel<=Y.DEBUG){const t=e.map(ba);Rn.debug(`Firestore (${ar}): ${n}`,...t)}}function St(n,...e){if(Rn.logLevel<=Y.ERROR){const t=e.map(ba);Rn.error(`Firestore (${ar}): ${n}`,...t)}}function it(n,...e){if(Rn.logLevel<=Y.WARN){const t=e.map(ba);Rn.warn(`Firestore (${ar}): ${n}`,...t)}}function ba(n){if(typeof n=="string")return n;try{return(function(t){return JSON.stringify(t)})(n)}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function B(n,e,t){let r="Unexpected state";typeof e=="string"?r=e:t=e,qh(n,r,t)}function qh(n,e,t){let r=`FIRESTORE (${ar}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;if(t!==void 0)try{r+=" CONTEXT: "+JSON.stringify(t)}catch{r+=" CONTEXT: "+t}throw St(r),new Error(r)}function U(n,e,t,r){let s="Unexpected state";typeof t=="string"?s=t:r=t,n||qh(e,s,r)}function G(n,e){return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function L_(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ra{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let r="";for(;r.length<20;){const s=L_(40);for(let i=0;i<s.length;++i)r.length<20&&s[i]<t&&(r+=e.charAt(s[i]%62))}return r}}function Q(n,e){return n<e?-1:n>e?1:0}function Kr(n,e){const t=Math.min(n.length,e.length);for(let r=0;r<t;r++){const s=n.charAt(r),i=e.charAt(r);if(s!==i)return Oo(s)===Oo(i)?Q(s,i):Oo(s)?1:-1}return Q(n.length,e.length)}const M_=55296,U_=57343;function Oo(n){const e=n.charCodeAt(0);return e>=M_&&e<=U_}function Jn(n,e,t){return n.length===e.length&&n.every(((r,s)=>t(r,e[s])))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oe{constructor(e,t){this.comparator=e,this.root=t||Re.EMPTY}insert(e,t){return new oe(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Re.BLACK,null,null))}remove(e){return new oe(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Re.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){const s=this.comparator(e,r.key);if(s===0)return t+r.left.size;s<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,r)=>(e(t,r),!1)))}toString(){const e=[];return this.inorderTraversal(((t,r)=>(e.push(`${t}:${r}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Xs(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Xs(this.root,e,this.comparator,!1)}getReverseIterator(){return new Xs(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Xs(this.root,e,this.comparator,!0)}}class Xs{constructor(e,t,r,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?r(e.key,t):1,t&&s&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Re{constructor(e,t,r,s,i){this.key=e,this.value=t,this.color=r??Re.RED,this.left=s??Re.EMPTY,this.right=i??Re.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,s,i){return new Re(e??this.key,t??this.value,r??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let s=this;const i=r(e,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(e,t,r),null):i===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return Re.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return Re.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Re.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Re.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw B(43730,{key:this.key,value:this.value});if(this.right.isRed())throw B(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw B(27949);return e+(this.isRed()?0:1)}}Re.EMPTY=null,Re.RED=!0,Re.BLACK=!1;Re.EMPTY=new class{constructor(){this.size=0}get key(){throw B(57766)}get value(){throw B(16141)}get color(){throw B(16727)}get left(){throw B(29726)}get right(){throw B(36894)}copy(e,t,r,s,i){return this}insert(e,t,r){return new Re(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class de{constructor(e){this.comparator=e,this.data=new oe(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,r)=>(e(t),!1)))}forEachInRange(e,t){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const s=r.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Xu(this.data.getIterator())}getIteratorFrom(e){return new Xu(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((r=>{t=t.add(r)})),t}isEqual(e){if(!(e instanceof de)||this.size!==e.size)return!1;const t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=r.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new de(this.comparator);return t.data=e,t}}class Xu{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const x={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class L extends Nt{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yn="__name__";class ct{constructor(e,t,r){t===void 0?t=0:t>e.length&&B(637,{offset:t,range:e.length}),r===void 0?r=e.length-t:r>e.length-t&&B(1746,{length:r,range:e.length-t}),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return ct.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof ct?e.forEach((r=>{t.push(r)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const r=Math.min(e.length,t.length);for(let s=0;s<r;s++){const i=ct.compareSegments(e.get(s),t.get(s));if(i!==0)return i}return Q(e.length,t.length)}static compareSegments(e,t){const r=ct.isNumericId(e),s=ct.isNumericId(t);return r&&!s?-1:!r&&s?1:r&&s?ct.extractNumericId(e).compare(ct.extractNumericId(t)):Kr(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Kt.fromString(e.substring(4,e.length-2))}}class te extends ct{construct(e,t,r){return new te(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toStringWithLeadingSlash(){return`/${this.canonicalString()}`}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const r of e){if(r.indexOf("//")>=0)throw new L(x.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter((s=>s.length>0)))}return new te(t)}static emptyPath(){return new te([])}}const F_=/^[_a-zA-Z][_a-zA-Z0-9]*$/;let Qe=class Fn extends ct{construct(e,t,r){return new Fn(e,t,r)}static isValidIdentifier(e){return F_.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Fn.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Yn}static keyField(){return new Fn([Yn])}static fromServerFormat(e){const t=[];let r="",s=0;const i=()=>{if(r.length===0)throw new L(x.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""};let a=!1;for(;s<e.length;){const c=e[s];if(c==="\\"){if(s+1===e.length)throw new L(x.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const l=e[s+1];if(l!=="\\"&&l!=="."&&l!=="`")throw new L(x.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=l,s+=2}else c==="`"?(a=!a,s++):c!=="."||a?(r+=c,s++):(i(),s++)}if(i(),a)throw new L(x.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Fn(t)}static emptyPath(){return new Fn([])}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rt{constructor(e){this.fields=e,e.sort(Qe.comparator)}static empty(){return new rt([])}unionWith(e){let t=new de(Qe.comparator);for(const r of this.fields)t=t.add(r);for(const r of e)t=t.add(r);return new rt(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Jn(this.fields,e.fields,((t,r)=>t.isEqual(r)))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pn(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function Sn(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function B_(n,e){const t=[];for(const r in n)Object.prototype.hasOwnProperty.call(n,r)&&t.push(e(n[r],r,n));return t}function jh(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ${constructor(e){this.path=e}static fromPath(e){return new $(te.fromString(e))}static fromName(e){return new $(te.fromString(e).popFirst(5))}static empty(){return new $(te.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&te.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return te.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new $(new te(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $_(n,e,t){if(!t)throw new L(x.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function q_(n,e,t,r){if(e===!0&&r===!0)throw new L(x.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function Ju(n){if(!$.isDocumentKey(n))throw new L(x.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function Is(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function Pa(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=(function(r){return r.constructor?r.constructor.name:null})(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":B(12329,{type:typeof n})}function Qt(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new L(x.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Pa(n);throw new L(x.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function le(n,e){const t={typeString:n};return e&&(t.value=e),t}function As(n,e){if(!Is(n))throw new L(x.INVALID_ARGUMENT,"JSON must be an object");let t;for(const r in e)if(e[r]){const s=e[r].typeString,i="value"in e[r]?{value:e[r].value}:void 0,a=e[r].optional;if(!(r in n)){if(a)continue;t=`JSON missing required field: '${r}'`;break}const c=n[r];if(s&&typeof c!==s){t=`JSON field '${r}' must be a ${s}.`;break}if(i!==void 0&&c!==i.value){t=`Expected '${r}' field to equal '${i.value}'`;break}}if(t)throw new L(x.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yu=-62135596800,Zu=1e6;class ee{static now(){return ee.fromMillis(Date.now())}static fromDate(e){return ee.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),r=Math.floor((e-1e3*t)*Zu);return new ee(t,r)}static fromInstant(e){if(!e||typeof e.t!="bigint")throw new L(x.INVALID_ARGUMENT,"Invalid Temporal.Instant object provided.");return ee._fromEpochNanoseconds(e.t)}static _fromEpochNanoseconds(e){let t,r;if(e>=0n)t=Number(e/1000000000n),r=Number(e%1000000000n);else{const s=e%1000000000n;s===0n?(t=Number(e/1000000000n),r=0):(t=Number(e/1000000000n-1n),r=Number(s+1000000000n))}return new ee(t,r)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new L(x.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new L(x.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<Yu)throw new L(x.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new L(x.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Zu}toInstant(){if(typeof Temporal>"u"||!Temporal.Instant)throw new L(x.FAILED_PRECONDITION,"The Temporal object is not available in the current environment.");const e=1000000000n*BigInt(this.seconds)+BigInt(this.nanoseconds);return Temporal.Instant.__PRIVATE_fromEpochNanoseconds(e)}_compareTo(e){return this.seconds===e.seconds?Q(this.nanoseconds,e.nanoseconds):Q(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:ee._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(As(e,ee._jsonSchema))return new ee(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Yu;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}ee._jsonSchemaVersion="firestore/timestamp/1.0",ee._jsonSchema={type:le("string",ee._jsonSchemaVersion),seconds:le("number"),nanoseconds:le("number")};/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zh extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ae{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new zh("Invalid base64 string: "+i):i}})(e);return new ae(t)}static fromUint8Array(e){const t=(function(s){let i="";for(let a=0;a<s.length;++a)i+=String.fromCharCode(s[a]);return i})(e);return new ae(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const r=new Uint8Array(t.length);for(let s=0;s<t.length;s++)r[s]=t.charCodeAt(s);return r})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return Q(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}ae.EMPTY_BYTE_STRING=new ae("");const j_=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Zt(n){if(U(!!n,39018),typeof n=="string"){let e=0;const t=j_.exec(n);if(U(!!t,46558,{timestamp:n}),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:ue(n.seconds),nanos:ue(n.nanos)}}function ue(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function Vn(n){return typeof n=="string"?ae.fromBase64String(n):ae.fromUint8Array(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wh="server_timestamp",Hh="__type__",Gh="__previous_value__",Kh="__local_write_time__";function Va(n){var t,r;return((r=(((t=n==null?void 0:n.mapValue)==null?void 0:t.fields)||{})[Hh])==null?void 0:r.stringValue)===Wh}function bs(n){const e=n.mapValue.fields[Gh];return Va(e)?bs(e):e}function Zn(n){const e=Zt(n.mapValue.fields[Kh].timestampValue);return new ee(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class z_{constructor(e,t,r,s,i,a,c,l,f,p,m,v,V){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=s,this.ssl=i,this.forceLongPolling=a,this.autoDetectLongPolling=c,this.longPollingOptions=l,this.useFetchStreams=f,this.isUsingEmulator=p,this.apiKey=m,this._customHeaders=v,this.grpcFlowControlWindow=V}}const wi="(default)";class Qr{constructor(e,t){this.projectId=e,this.database=t||wi}static empty(){return new Qr("","")}get isDefaultDatabase(){return this.database===wi}isEqual(e){return e instanceof Qr&&e.projectId===this.projectId&&e.database===this.database}}function W_(n,e){if(!Object.prototype.hasOwnProperty.apply(n.options,["projectId"]))throw new L(x.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Qr(n.options.projectId,e)}/**
 * Copyright 2021 M.Vokhmentsev
 *
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class q{constructor(){this.exponent=0,this.i=0n,this.o=0n,this.u=new Array(4).fill(0n),this.l=new Array(6).fill(0n),this.h=new Array(6).fill(0n),this.T=new Array(6).fill(0n),this.P=new Array(12).fill(0n)}static I(e,t){let r=new q;return r.parse(e,t),r}parse(e,t){t+=e.length-1,this.exponent=0,this.i=0n,this.o=0n;let r=this.T,s=this.R(e,r);if(s==0&&this.isEmpty(r)||(t+=s)<q.A)return;if(t>q.V)return void(this.exponent=Number(q.m));let i=this.p(t,r);this.S(t,i,r)}R(e,t){for(let i=0;i<6;i++)t[i]=0n;let r=0;for(;r<e.length&&e[r]==0;)r+=1;if(r==e.length)return 0;let s=-r;if(e.length-r>q.v){let i=e[q.v]>=5,a=new Array(q.v).fill(0);for(let c=0;c<q.v;c++)a[c]=e[c+r];i&&(s+=this.D(a)),e=a,r=0}for(let i=e.length-1;i>=r;i--)t[0]|=BigInt(e[i])<<32n,this.C(t);return s}C(e){let t=e.length;for(let r=0;r<t;r++){let s=e[r]%10n;e[r]=e[r]/10n,r+1<t&&(e[r+1]+=s<<32n)}}isEmpty(e){for(let t=0;t<e.length;t++)if(e[t]!=0n)return!1;return!0}D(e){for(let t=e.length-1;t>=0;t--){if(e[t]!=9)return e[t]=e[t]+1,0;e[t]=0}return e[0]=1,1}p(e,t){let r=t[0]<<31n|t[1]>>1n,s=Number(r)/q.F;return Math.floor(Number(e)*q.O+this.log2(s))}log2(e){return q.M*Math.log(e)}S(e,t,r){let s=this.u;this.N(-t,s);let i=this.P;this.B(r,s,i),this.L(i),BigInt(s[0])!=BigInt(-e)&&this.L(i),t+=this.U(i),(t+=q.k)<=0||(t+=this.q(i),BigInt(t)>=q.m?this.exponent=Number(q.m):(this.exponent=Number(t),this.i=(i[0]<<32n)+i[1]&0xffffffffffffffffn,this.o=(i[2]<<32n)+i[3]&0xffffffffffffffffn))}N(e,t){if(e==0)return void this.K(q.$[0],t);let r=q.$;e<0&&(e=-e,r=q.W);let s=q.G,i=32,a=!0;for(;e>0;)e>=s&&(a?(this.K(r[i],t),a=!1):this.j(t,r[i],t),e-=s),i-=1,s*=.5}K(e,t){for(let r=0;r<t.length;r++)t[r]=e[r]}j(e,t,r){this.H(e,t,this.P);let s=this.J(this.P);this.Y(this.P,r),r[0]=e[0]+t[0]+BigInt(s)}H(e,t,r){for(let s=0;s<r.length;s++)r[s]=0n;this.Z(e,this.l),this.Z(t,this.h);for(let s=5;s>=0;s--)for(let i=5;i>=0;i--){let a=this.l[s]*this.h[i];r[i+s+1]=r[i+s+1]+(a&q.X)&0xffffffffffffffffn,r[i+s]=r[i+s]+(a>>32n)&0xffffffffffffffffn}for(let s=11;s>=1;s--)r[s-1]=r[s-1]+(r[s]>>32n)&0xffffffffffffffffn,r[s]&=q.X}J(e){let t=0;for(;this.ee(e);)this.L(e),t-=1;return t}ee(e){if(e[0]<0x19999999n)return!0;if(e[0]>0x19999999n)return!1;for(let t=1;t<e.length;t++){if(e[t]<0x99999999n)return!0;if(e[t]>0x99999999n)return!1}return!1}B(e,t,r){for(let a=0;a<r.length;a++)r[a]=0n;let s=this.h;this.Z(t,s);let i=e.length;for(let a=i-1;a>=0;a--)for(let c=i-1;c>=0;c--){let l=e[a]*s[c];r[c+a+1]=r[c+a+1]+(l&q.X)&0xffffffffffffffffn,r[c+a]=r[c+a]+(l>>32n)&0xffffffffffffffffn}for(let a=11;a>=1;a--)r[a-1]=r[a-1]+(r[a]>>32n)&0xffffffffffffffffn,r[a]&=q.X}L(e){let t=e.length-1;e[0]&=q.X,e[t]*=10n;for(let r=t-1;r>=0;r--)e[r]=10n*e[r]+(e[r+1]>>32n)&0xffffffffffffffffn,e[r+1]&=q.X}U(e){let t=31-q.te(e[0]);return t!=0&&this.ne(e,t),t}q(e){return this.re(e,5,100n),this.re(e,4,0x80000000n),(e[0]&q.ie<<1n)!=0n?(this.ne(e,1),1):0}Y(e,t){t[1]=(e[0]<<32n)+e[1],t[2]=(e[2]<<32n)+e[3],t[3]=(e[4]<<32n)+e[5]}Z(e,t){t[0]=e[1]>>32n,t[1]=e[1]&q.X,t[2]=e[2]>>32n,t[3]=e[2]&q.X,t[4]=e[3]>>32n,t[5]=e[3]&q.X}ne(e,t){let r=e.length-1,s=BigInt(32-Math.abs(t));if(t>0){let i=BigInt(t);for(let a=r+1-1;a>=1;a--)e[a]=e[a]>>i|e[a-1]<<s&q.X;e[0]=e[0]>>i}else if(t<0){let i=BigInt(-t);e[0]=0xffffffffffffffffn&(e[0]<<i|e[1]>>s);for(let a=1;a<r;a++)e[a]=0xffffffffffffffffn&(e[a]<<i&q.X|e[a+1]>>s);e[r]=e[r]<<i&q.X}}re(e,t,r){let s=t;e[s]=e[s]+r&0xffffffffffffffffn;for(let i=s+1-1;i>=1&&(e[i]&q.ie)!=0n;i--)e[i]&=q.X,e[i-1]+=1n}static te(e){let t=Number(e>>32n);return t==0?32+Math.clz32(Number(BigInt.asUintN(32,e))):Math.clz32(t)}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Te,jn,Ko,ai,ci,kr;q.v=59,q.V=646456993,q.A=-646457032,q.F=0xccccccccccccd00,q.se=0x8000000000000000n,q.G=2147483648,q.X=0x00000000ffffffffn,q.ie=0xffffffff00000000n,q.O=Math.log(10)/Math.log(2),q.M=1/Math.log(2),q.k=2147483647,q.m=0xffffffffn,q.$=[[1n,0x1999999999999999n,0x9999999999999999n,0x999999999999999an],[1n,0x3333333333333333n,0x3333333333333333n,0x3333333333333334n],[1n,0x6666666666666666n,0x6666666666666666n,0x6666666666666667n],[2n,0x28f5c28f5c28f5c2n,0x8f5c28f5c28f5c28n,0xf5c28f5c28f5c290n],[3n,0x4189374bc6a7ef9dn,0xb22d0e5604189374n,0xbc6a7ef9db22d0e6n],[5n,0xa7c5ac471b478423n,0x0fcf80dc33721d53n,0xcddd6e04c0592104n],[10n,0x6df37f675ef6eadfn,0x5ab9a2072d44268dn,0x97df837e6748956en],[20n,0x2f394219248446ban,0xa23d2ec729af3d61n,0x0607aa0167dd94cbn],[39n,0x571cbec554b60dbbn,0xd5f64baf0506840dn,0x451db70d5904029bn],[78n,0x1da48ce468e7c702n,0x6520247d3556476dn,0x1469caf6db224cfan],[155n,0x2252f0e5b39769dcn,0x9ae2eea30ca3ade0n,0xeeaa3c08dfe84e30n],[309n,0x2e055c9a3f6ba793n,0x16583a816eb60a59n,0x22c4b0826cf1ebf7n],[617n,0x52bb45e9cf23f17fn,0x7688c07606e50364n,0xb34479aa9d449a57n],[1234n,0x1abc81c8ff5f846cn,0x8f5e3c9853e38c97n,0x45060097f3bf9296n],[2467n,0x1bec53b510daa7b4n,0x48369ed77dbb0eb1n,0x3b05587b2187b41en],[4933n,0x1e75063a5ba91326n,0x8abfb8e460016ae3n,0x28008702d29e8a3cn],[9865n,0x243c5d8bb5c5fa55n,0x40c6d248c5881915n,0x4c0fd99fd5befc22n],[19729n,0x334a5570c3f4ef3cn,0xa13c36c43f979c90n,0xda7ac473555fb7a8n],[39457n,0x66c304445dd98f3bn,0xa8c293a20e47a41bn,0x4c5b03dc12604964n],[78914n,0x293ffbf5fb028cc4n,0x89d3e5ff44238406n,0x369a339e1bfe8c9bn],[157827n,0x427792fbb68e5d20n,0x7b297cd9fc154b62n,0xf09142114aa9a20cn],[315653n,0xac92bc65ad5c08fcn,0x00beeb115a566c19n,0x4ba882d8a4622437n],[631306n,0x745581440f92e80en,0x4da822cf7f896f41n,0x509d598678164ecdn],[1262612n,0x34dd99b4c69523a5n,0x64bc2e8f0d8b1044n,0xb03b1c96da5dd349n],[2525223n,0x6d2bbea9d6d25a08n,0xa0a4606a88e96b70n,0x182063bbc2fe8520n],[5050446n,0x2e8e47d63bfdd6e3n,0x2b55fa8976eaa3e9n,0x1a6b9d3086412a73n],[10100891n,0x54aa68efa1d719dfn,0xd8505806612c5c8fn,0xad068837fee8b43an],[20201782n,0x1c00464ccb7bae77n,0x9e3877784c77982cn,0xd94af3b61717404fn],[40403563n,0x1ea099c8be2b6cd0n,0x8bfb6d539fa50466n,0x6d3bc37e69a84218n],[80807125n,0x24a457f466ce8d18n,0xf2c8f3b81bc6bb59n,0xa78c757692e02d49n],[161614249n,0x347256677aba6b53n,0x3fbf90d30611a67cn,0x1e039d87e0bdb32bn],[323228497n,0x6b727daf0fd3432an,0x71f71121f9e4200fn,0x8fcd9942d486c10cn],[646456994n,0x2d18e84484d91f78n,0x4079bfe7829dec6fn,0x21551643e365abc6n]],q.W=[[1n,0x1999999999999999n,0x9999999999999999n,0x999999999999999an],[0n,0x8000000000000000n,0x0000000000000000n,0x0000000000000000n],[0n,0x4000000000000000n,0x0000000000000000n,0x0000000000000001n],[-1n,0xa000000000000000n,0x0000000000000000n,0x0000000000000000n],[-2n,0x6400000000000000n,0x0000000000000000n,0x0000000000000000n],[-4n,0x2710000000000000n,0x0000000000000000n,0x0000000000000001n],[-9n,0x3b9aca0000000000n,0x0000000000000000n,0x0000000000000001n],[-19n,0x8ac7230489e80000n,0x0000000000000000n,0x0000000000000000n],[-38n,0x4b3b4ca85a86c47an,0x098a224000000000n,0x0000000000000001n],[-77n,0xdd15fe86affad912n,0x49ef0eb713f39eben,0xaa987b6e6fd2a002n],[-154n,0xbeeefb584aff8603n,0xaafb550ffacfd8fan,0x5ca47e4f88d45371n],[-308n,0x8e679c2f5e44ff8fn,0x570f09eaa7ea7648n,0x5961db50c6d2b888n],[-616n,0x4f371b3399fc2ab0n,0x8170041c9feb05aan,0xc7c343447c75bcf6n],[-1233n,0xf51e928179013fd3n,0xde4bd12cde4d985cn,0x4a573ca6f94bff14n],[-2466n,0xeab388127bccaff7n,0x1667639142b9fbaen,0x775ec9995e1039fbn],[-4932n,0xd72cb2a95c7ef6ccn,0xe81bf1e825ba7515n,0xc2feb521d6cb5dcdn],[-9864n,0xb4dc1be6604502dcn,0xd491079b8eef6535n,0x578d3965d24de84dn],[-19728n,0x7fc6447bee60ea43n,0x2548da5c8b125b27n,0x5f42d1142f41d349n],[-39456n,0x3fc65180f88af8fbn,0x6a6915f383349413n,0x063c3708b6ceb291n],[-78913n,0x9ee0197c8dcd55bfn,0x2b2b9b942c38f4a2n,0x0f8ba634e9c706aen],[-157826n,0x629963a25b8b2d79n,0xd00b9d2286f70876n,0xe97004700c3644fcn],[-315652n,0x25f9cc308ceef4f3n,0x40f19543911a4546n,0xa2cd389452cfc366n],[-631305n,0x385597b0d47e76b8n,0x1b9f67e103bf2329n,0xc3119848595985f7n],[-1262611n,0x7bf795d276c12f66n,0x66a61d62a446659an,0xa1a4d73bebf093d5n],[-2525222n,0x3c07d96ab1ed7799n,0xcb7355c22cc05ac0n,0x4ffc0ab73b1f6a49n],[-5050445n,0x8cc4cd8c3edefb9an,0x6c8ff86a90a97e0cn,0x166cfddbf98b71bfn],[-10100890n,0x4d67d81cc88e1228n,0x1d7cfb06666b79b3n,0x7b916728aaa4e70dn],[-20201781n,0xea0c55494e7a552dn,0xb88cb9484bb86c61n,0x8d44893c610bb7dfn],[-40403562n,0xd5fa8c821ec0c24an,0xa80e46e764e0f8b0n,0xa7276bfa432fac7en],[-80807124n,0xb2dae307426f6791n,0xc970b82f58b12918n,0x0472592f7f39190en],[-161614248n,0x7cf51edd8a15f1c9n,0x656dab3498f8e697n,0x12daa2a80e53c807n],[-323228496n,0x3cfe609ab5883c50n,0xbec8b5d22b198871n,0xe18477703b4622b4n],[-646456993n,0x9152447b9d7cda9an,0x3b4d3f6110d77aadn,0xfa81bad1c394adb4n]];class F{constructor(e,t,r,s){this.negative=e,this._e=t,this.i=r,this.o=s}exponent(){return this._e-q.k}oe(){return this._e===0&&this.i===0n&&this.o===0n}ae(){return this._e===be(F,Te,"f",jn)&&this.i===0n&&this.o===0n}isNaN(){return this._e===be(F,Te,"f",jn)&&!(this.i===0n&&this.o===0n)}compareTo(e){if(this.isNaN())return e.isNaN()?0:1;if(e.isNaN())return-1;let t,r;if(this.negative){if(!e.negative)return-1;t=1,r=-1}else{if(e.negative)return 1;t=-1,r=1}return this._e<e._e?t:this._e>e._e?r:this.i<e.i?t:this.i>e.i?r:this.o<e.o?t:this.o>e.o?r:0}debug(){return(this.negative?"+":"-")+be(F,Te,"m",Ko).call(F,this.i)+be(F,Te,"m",Ko).call(F,this.o)+"*2^"+this.exponent()}static fromNumber(e){if(isNaN(e))return F.NaN;if(!isFinite(e))return e<0?F.ue:F.ce;if(e===0)return Math.sign(1/e)>0?F.le:F.Ee;const t=new DataView(new ArrayBuffer(8));t.setFloat64(0,e);const r=t.getBigUint64(0);let s=BigInt.asUintN(64,r<<12n),i=2047&Number(r>>52n);if(i===0){const a=q.te(s);s=a<63?s<<BigInt(a+1):0n,i=-a}return new F(e<0,be(F,Te,"m",kr).call(F,i-1023),s,0n)}static fromString(e){if(e==="NaN")return F.NaN;if(e==="-Infinity")return F.ue;if(e==="Infinity"||e==="+Infinity")return F.ce;const t=new Array(e.length).fill(0);let r=0,s=0,i=0,a=!1;for(e[r]==="-"?(a=!0,r++):e[r]==="+"&&r++;be(F,Te,"m",ai).call(F,e,r);)t[s++]=be(F,Te,"m",ci).call(F,e,r++);if(e[r]==="."){const l=++r;for(;be(F,Te,"m",ai).call(F,e,r);)t[s++]=be(F,Te,"m",ci).call(F,e,r++);i=l-r}if(e[r]==="e"||e[r]==="E"){let l=0;r++;let f=1;e[r]==="-"?(f=-1,r++):e[r]==="+"&&r++;const p=r;for(;be(F,Te,"m",ai).call(F,e,r);)if(l=10*l+be(F,Te,"m",ci).call(F,e,r++),r-p>9)throw new Error("Exponent too large "+e);if(r===p)throw new Error("Invalid number "+e);i+=l*f}if(s===0||r!==e.length)throw new Error("Invalid number "+e);const c=q.I(t.slice(0,s),i);return new F(a,c.exponent,c.i,c.o)}}Te=F,Ko=function(e){return e.toString(16).padStart(16,"0")},ai=function(e,t){const r=e.codePointAt(t);return r!==void 0&&r>=48&&r<=57},ci=function(e,t){return e.codePointAt(t)-48},kr=function(e){return e+q.k},jn={value:Number(q.m)},F.le=new F(!1,0,0n,0n),F.Ee=new F(!0,0,0n,0n),F.NaN=new F(!1,be(F,Te,"f",jn),1n<<63n,0n),F.ue=new F(!0,be(F,Te,"f",jn),0n,0n),F.ce=new F(!1,be(F,Te,"f",jn),0n,0n),new F(!0,be(F,Te,"m",kr).call(F,63),0n,0n),new F(!1,be(F,Te,"m",kr).call(F,0),0n,0n),new F(!0,be(F,Te,"m",kr).call(F,0),0n,0n);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sa=-1;function $i(n){return n==null}function Xr(n){return n===0&&1/n==-1/0}function H_(n){return typeof n=="number"&&Number.isInteger(n)&&!Xr(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}function G_(n){return typeof n=="string"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ca="__type__",xa="__vector__",Jr="value",K_="server_timestamp",Qh="__min__",Na="__max__",Wt="__regex__",Ti="pattern",vi="options",Yr="__oid__",Cn="__int__",en="__decimal128__",yn="__request_timestamp__",Ii="seconds",Ai="increment",qi="__binary__",er={nullValue:"NULL_VALUE"},Js={mapValue:{}};var re,Ye;(Ye=re||(re={})).he="regexValue",Ye.Te="bsonObjectIdValue",Ye.Pe="int32Value",Ye.Ie="decimal128Value",Ye.Re="bsonTimestampValue",Ye.Ae="bsonBinaryValue",Ye.Ve="minKeyValue",Ye.fe="maxKeyValue",Ye.de="maxValue",Ye.me="vectorValue",Ye.pe="serverTimestampValue",Ye.ge="regularMapValue";const el={[xa]:re.me,[Na]:re.de,[K_]:re.pe},Xh={[Wt]:re.he,[Yr]:re.Te,[Cn]:re.Pe,[en]:re.Ie,[yn]:re.Re,[qi]:re.Ae,[Qh]:re.Ve,[Na]:re.fe},Q_=new Set(Object.values(Xh)),qe={booleanValue:!0},Ie={booleanValue:!1};function pe(n){if("nullValue"in n)return 0;if("booleanValue"in n)return 2;if("integerValue"in n||"doubleValue"in n)return 3;if("timestampValue"in n)return 4;if("stringValue"in n)return 7;if("bytesValue"in n)return 8;if("referenceValue"in n)return 9;if("geoPointValue"in n)return 11;if("arrayValue"in n)return 13;if(!("mapValue"in n))return B(28295,{value:n});switch(rf(n)){case re.pe:return 6;case re.de:return 9007199254740991;case re.me:return 14;case re.he:return 12;case re.Te:return 10;case re.Pe:case re.Ie:return 3;case re.Re:return 5;case re.Ae:return 8;case re.Ve:return 1;case re.fe:return 16;default:return 15}}function et(n,e,t){if(n===e)return!0;const r=pe(n);if(r!==pe(e))return!1;switch(r){case 0:case 9007199254740991:case 16:case 1:return!0;case 2:return n.booleanValue===e.booleanValue;case 6:return Zn(n).isEqual(Zn(e));case 4:return(function(i,a){if(typeof i.timestampValue=="string"&&typeof a.timestampValue=="string"&&i.timestampValue.length===a.timestampValue.length)return i.timestampValue===a.timestampValue;const c=Zt(i.timestampValue),l=Zt(a.timestampValue);return c.seconds===l.seconds&&c.nanos===l.nanos})(n,e);case 7:return n.stringValue===e.stringValue;case 8:return(function(i,a){return ef(i,a)===0})(n,e);case 9:return n.referenceValue===e.referenceValue;case 11:return(function(i,a){return ue(i.geoPointValue.latitude)===ue(a.geoPointValue.latitude)&&ue(i.geoPointValue.longitude)===ue(a.geoPointValue.longitude)})(n,e);case 3:return(function(i,a,c){if(tt(i)&&tt(a))return Yh(i,a)===0;if("integerValue"in i&&"integerValue"in a||tn(i)&&tn(a))return es(i)===es(a);let l,f;if("doubleValue"in i&&"doubleValue"in a)l=ue(i.doubleValue),f=ue(a.doubleValue);else{if(!(c!=null&&c.ye))return!1;l=ue(i.integerValue??i.doubleValue),f=ue(a.integerValue??a.doubleValue)}return l===f?!!(c!=null&&c.we)||Xr(l)===Xr(f):!!(c===void 0||c.be)&&isNaN(l)&&isNaN(f)})(n,e,t);case 13:return Jn(n.arrayValue.values||[],e.arrayValue.values||[],((s,i)=>et(s,i,t)));case 14:case 15:return(function(i,a,c){const l=i.mapValue.fields||{},f=a.mapValue.fields||{};if(Pn(l)!==Pn(f))return!1;for(const p in l)if(l.hasOwnProperty(p)&&(f[p]===void 0||!et(l[p],f[p],c)))return!1;return!0})(n,e,t);case 5:return Zh(n,e)===0;case 12:return tf(n,e)===0;case 10:return nf(n,e)===0;default:return B(52216,{left:n})}}function Zr(n,e){return(n.values||[]).find((t=>et(t,e)))!==void 0}function je(n,e){if(n===e)return 0;const t=pe(n),r=pe(e);if(t!==r)return Q(t,r);switch(t){case 0:case 1:case 16:case 9007199254740991:return 0;case 2:return Q(n.booleanValue,e.booleanValue);case 3:return ts(n,e);case 4:return nl(n.timestampValue,e.timestampValue);case 6:return nl(Zn(n),Zn(e));case 7:return Kr(n.stringValue,e.stringValue);case 8:return ef(n,e);case 9:return(function(i,a){const c=i.split("/"),l=a.split("/");for(let f=0;f<c.length&&f<l.length;f++){const p=Q(c[f],l[f]);if(p!==0)return p}return Q(c.length,l.length)})(n.referenceValue,e.referenceValue);case 11:return(function(i,a){const c=Q(ue(i.latitude),ue(a.latitude));return c!==0?c:Q(ue(i.longitude),ue(a.longitude))})(n.geoPointValue,e.geoPointValue);case 13:return rl(n.arrayValue,e.arrayValue);case 14:return(function(i,a){var v,V,C,M;const c=i.fields||{},l=a.fields||{},f=(v=c[Jr])==null?void 0:v.arrayValue,p=(V=l[Jr])==null?void 0:V.arrayValue,m=Q(((C=f==null?void 0:f.values)==null?void 0:C.length)||0,((M=p==null?void 0:p.values)==null?void 0:M.length)||0);return m!==0?m:rl(f,p)})(n.mapValue,e.mapValue);case 15:return(function(i,a){if(i===Js.mapValue&&a===Js.mapValue)return 0;if(i===Js.mapValue)return 1;if(a===Js.mapValue)return-1;const c=i.fields||{},l=Object.keys(c),f=a.fields||{},p=Object.keys(f);l.sort(),p.sort();for(let m=0;m<l.length&&m<p.length;++m){const v=Kr(l[m],p[m]);if(v!==0)return v;const V=je(c[l[m]],f[p[m]]);if(V!==0)return V}return Q(l.length,p.length)})(n.mapValue,e.mapValue);case 5:return Zh(n,e);case 12:return tf(n,e);case 10:return nf(n,e);default:throw B(23264,{Se:t})}}function es(n){let e;return e=tn(n)?n.mapValue.fields[Cn].integerValue:n.integerValue||n.doubleValue,ue(e)}function Jh(n){return n.mapValue.fields[en].stringValue}function ts(n,e){if(tt(n)||tt(e))return Yh(n,e);const t=es(n),r=es(e);return isNaN(t)?isNaN(r)?0:-1:isNaN(r)?1:Q(t,r)}function Yh(n,e){const t=tl(n),r=tl(e);return t.oe()&&r.oe()?0:t.isNaN()?r.isNaN()?0:-1:r.isNaN()?1:t.compareTo(r)}function tl(n){return tt(n)?F.fromString(Jh(n)):F.fromNumber(es(n))}function nl(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return Q(n,e);const t=Zt(n),r=Zt(e),s=Q(t.seconds,r.seconds);return s!==0?s:Q(t.nanos,r.nanos)}function rl(n,e){const t=n.values||[],r=e.values||[];for(let s=0;s<t.length&&s<r.length;++s){const i=je(t[s],r[s]);if(i!==void 0&&i!==0)return i}return Q(t.length,r.length)}function Zh(n,e){var c,l,f,p,m,v,V,C,M,O,H,J;const t=(f=(l=(c=n.mapValue.fields)==null?void 0:c[yn].mapValue)==null?void 0:l.fields)==null?void 0:f[Ii],r=(v=(m=(p=e.mapValue.fields)==null?void 0:p[yn].mapValue)==null?void 0:m.fields)==null?void 0:v[Ii],s=(M=(C=(V=n.mapValue.fields)==null?void 0:V[yn].mapValue)==null?void 0:C.fields)==null?void 0:M[Ai],i=(J=(H=(O=e.mapValue.fields)==null?void 0:O[yn].mapValue)==null?void 0:H.fields)==null?void 0:J[Ai],a=ts(t,r);return a!==0?a:ts(s,i)}function sl(n){var c;if("bytesValue"in n)return{subtype:0,bytes:Vn(n.bytesValue)};const e=(c=n.mapValue)==null?void 0:c.fields,t=e==null?void 0:e[qi],r=t==null?void 0:t.bytesValue;if(!r)throw new Error("Received incorrect value for BsonBinaryData");const s=Vn(r).toUint8Array();if(s.length===0)throw new Error("Received empty bytesValue for BsonBinaryData");const i=s[0],a=s.slice(1);return{subtype:i,bytes:ae.fromUint8Array(a)}}function ef(n,e){const t=sl(n),r=sl(e);return t.subtype!==r.subtype?t.subtype<r.subtype?-1:1:t.bytes.compareTo(r.bytes)}function tf(n,e){var f,p,m,v,V,C,M,O,H,J,se,De,me,ge,T,g;const t=n.mapValue.fields,r=((v=(m=(p=(f=t==null?void 0:t[Wt])==null?void 0:f.mapValue)==null?void 0:p.fields)==null?void 0:m[Ti])==null?void 0:v.stringValue)??"",s=((O=(M=(C=(V=t==null?void 0:t[Wt])==null?void 0:V.mapValue)==null?void 0:C.fields)==null?void 0:M[vi])==null?void 0:O.stringValue)??"",i=e.mapValue.fields,a=((De=(se=(J=(H=i==null?void 0:i[Wt])==null?void 0:H.mapValue)==null?void 0:J.fields)==null?void 0:se[Ti])==null?void 0:De.stringValue)??"",c=((g=(T=(ge=(me=i==null?void 0:i[Wt])==null?void 0:me.mapValue)==null?void 0:ge.fields)==null?void 0:T[vi])==null?void 0:g.stringValue)??"",l=Kr(r,a);return l!==0?l:Q(s,c)}function nf(n,e){var t,r,s,i;return Kr(((r=(t=n.mapValue.fields)==null?void 0:t[Yr])==null?void 0:r.stringValue)??"",((i=(s=e.mapValue.fields)==null?void 0:s[Yr])==null?void 0:i.stringValue)??"")}function tr(n){return Qo(n)}function Qo(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?(function(t){const r=Zt(t);return`time(${r.seconds},${r.nanos})`})(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?(function(t){return Vn(t).toBase64()})(n.bytesValue):"referenceValue"in n?(function(t){return $.fromName(t).toString()})(n.referenceValue):"geoPointValue"in n?(function(t){return`geo(${t.latitude},${t.longitude})`})(n.geoPointValue):"arrayValue"in n?(function(t){let r="[",s=!0;for(const i of t.values||[])s?s=!1:r+=",",r+=Qo(i);return r+"]"})(n.arrayValue):"mapValue"in n?(function(t){const r=Object.keys(t.fields||{}).sort();let s="{",i=!0;for(const a of r)i?i=!1:s+=",",s+=`${a}:${Qo(t.fields[a])}`;return s+"}"})(n.mapValue):B(61005,{value:n})}function bi(n){switch(pe(n)){case 0:case 2:return 4;case 3:return tt(n)?16:8;case 4:case 11:return 16;case 6:const e=bs(n);return e?16+bi(e):16;case 7:return 2*n.stringValue.length;case 8:return"bytesValue"in n?Vn(n.bytesValue).approximateByteSize():il(n.mapValue);case 9:return n.referenceValue.length;case 13:return(function(r){return(r.values||[]).reduce(((s,i)=>s+bi(i)),0)})(n.arrayValue);case 14:case 15:case 12:case 10:case 5:case 1:case 16:return il(n.mapValue);default:throw B(13486,{value:n})}}function il(n){let e=0;return Sn(n.fields,((t,r)=>{e+=t.length+bi(r)})),e}function ut(n){return!!n&&"integerValue"in n}function lt(n){return!!n&&"doubleValue"in n}function tt(n){var t;if(!((t=n.mapValue)!=null&&t.fields))return!1;const e=n.mapValue.fields;return Pn(e)===1&&e[en]&&!!e[en].stringValue}function tn(n){var t,r;if(!((t=n.mapValue)!=null&&t.fields))return!1;const e=n.mapValue.fields;return Pn(e)===1&&((r=e[Cn])==null?void 0:r.integerValue)!==void 0}function Ct(n){return ut(n)||lt(n)||!!n&&tn(n)||!!n&&tt(n)}function nr(n){return!!n&&"arrayValue"in n}function Ke(n){return!!n&&"nullValue"in n}function Ae(n){return!(!lt(n)||!isNaN(Number(n.doubleValue)))||!(!tt(n)||Jh(n)!=="NaN")}function wn(n){return!!n&&"mapValue"in n}function rf(n){var r,s;if(!((r=n.mapValue)!=null&&r.fields))return re.ge;const e=n.mapValue.fields,t=(s=e[Ca])==null?void 0:s.stringValue;if(t&&el[t])return el[t];if(Pn(e)===1){const i=Object.keys(e);return Xh[i[0]]??re.ge}return re.ge}function Xo(n){var t,r;return((r=(((t=n==null?void 0:n.mapValue)==null?void 0:t.fields)||{})[Ca])==null?void 0:r.stringValue)===xa}function Jo(n){var e,t;return(t=(((e=n==null?void 0:n.mapValue)==null?void 0:e.fields)||{})[Jr])==null?void 0:t.arrayValue}function Ur(n){if(n.geoPointValue)return{geoPointValue:{...n.geoPointValue}};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:{...n.timestampValue}};if(n.mapValue){const e={mapValue:{fields:{}}};return Sn(n.mapValue.fields,((t,r)=>e.mapValue.fields[t]=Ur(r))),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Ur(n.arrayValue.values[t]);return e}return{...n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class He{constructor(e){this.value=e}static empty(){return new He({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!wn(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Ur(t)}setAll(e){let t=Qe.emptyPath(),r={},s=[];e.forEach(((a,c)=>{if(!t.isImmediateParentOf(c)){const l=this.getFieldsMap(t);this.applyChanges(l,r,s),r={},s=[],t=c.popLast()}a?r[c.lastSegment()]=Ur(a):s.push(c.lastSegment())}));const i=this.getFieldsMap(t);this.applyChanges(i,r,s)}delete(e){const t=this.field(e.popLast());wn(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return et(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let s=t.mapValue.fields[e.get(r)];wn(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,r){Sn(t,((s,i)=>e[s]=i));for(const s of r)delete e[s]}clone(){return new He(Ur(this.value))}}function sf(n){const e=[];return Sn(n.fields,((t,r)=>{const s=new Qe([t]);if(wn(r)&&!(function(a){return Q_.has(rf(a))})(r)){const i=sf(r.mapValue).fields;if(i.length===0)e.push(s);else for(const a of i)e.push(s.child(a))}else e.push(s)})),new rt(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ka(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Xr(e)?"-0":e}}function Hn(n){return{integerValue:""+n}}function Da(n,e,t){return H_(e)?Hn(e):ka(n,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ji{constructor(){this._=void 0}}function X_(n,e,t){return n instanceof ns?(function(s,i){const a={fields:{[Hh]:{stringValue:Wh},[Kh]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&Va(i)&&(i=bs(i)),i&&(a.fields[Gh]=i),{mapValue:a}})(t,e):n instanceof rs?af(n,e):n instanceof ss?cf(n,e):n instanceof is?(function(s,i){const a=of(s,i),c=ol(a)+ol(s.xe);return tt(a)||tt(s.xe)?{mapValue:{fields:{[en]:{stringValue:c.toString()}}}}:tn(a)?lt(s.xe)?{doubleValue:c}:ut(s.xe)?{integerValue:c.toString()}:{mapValue:{fields:{[Cn]:Hn(c)}}}:ut(a)&&(ut(s.xe)||tn(s.xe))?Hn(c):ka(s.serializer,c)})(n,e):n instanceof Ri?(function(s,i){return!Ct(i)||Ae(s.xe)?s.xe:Ae(i)?i:ts(s.xe,i)<0?s.xe:i})(n,e):n instanceof Pi?(function(s,i){return!Ct(i)||Ae(s.xe)?s.xe:Ae(i)?i:ts(s.xe,i)>0?s.xe:i})(n,e):void 0}function J_(n,e,t){return n instanceof rs?af(n,e):n instanceof ss?cf(n,e):t}function of(n,e){return n instanceof is?Ct(e)?e:{integerValue:0}:null}class ns extends ji{}class rs extends ji{constructor(e){super(),this.elements=e}}function af(n,e){const t=uf(e);for(const r of n.elements)t.some((s=>et(s,r)))||t.push(r);return{arrayValue:{values:t}}}class ss extends ji{constructor(e){super(),this.elements=e}}function cf(n,e){let t=uf(e);for(const r of n.elements)t=t.filter((s=>!et(s,r)));return{arrayValue:{values:t}}}class Oa extends ji{constructor(e,t){super(),this.serializer=e,this.xe=t}}class is extends Oa{}class Ri extends Oa{}class Pi extends Oa{}function ol(n){return ut(n)?ue(n.integerValue):lt(n)?ue(n.doubleValue):tn(n)?ue(n.mapValue.fields[Cn].integerValue):tt(n)?parseFloat(n.mapValue.fields[en].stringValue):0}function uf(n){return nr(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Y_{constructor(e,t){this.field=e,this.transform=t}}function Z_(n,e){return n.field.isEqual(e.field)&&(function(r,s){return r instanceof rs&&s instanceof rs||r instanceof ss&&s instanceof ss?Jn(r.elements,s.elements,et):r instanceof is&&s instanceof is||r instanceof Ri&&s instanceof Ri||r instanceof Pi&&s instanceof Pi?et(r.xe,s.xe):r instanceof ns&&s instanceof ns})(n.transform,e.transform)}class ey{constructor(e,t){this.version=e,this.transformResults=t}}class bt{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new bt}static exists(e){return new bt(void 0,e)}static updateTime(e){return new bt(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function ui(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class zi{}function lf(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new ff(n.key,bt.none()):new Rs(n.key,n.data,bt.none());{const t=n.data,r=He.empty();let s=new de(Qe.comparator);for(let i of e.fields)if(!s.has(i)){let a=t.field(i);a===null&&i.length>1&&(i=i.popLast(),a=t.field(i)),a===null?r.delete(i):r.set(i,a),s=s.add(i)}return new xn(n.key,r,new rt(s.toArray()),bt.none())}}function ty(n,e,t){n instanceof Rs?(function(s,i,a){const c=s.value.clone(),l=cl(s.fieldTransforms,i,a.transformResults);c.setAll(l),i.convertToFoundDocument(a.version,c).setHasCommittedMutations()})(n,e,t):n instanceof xn?(function(s,i,a){if(!ui(s.precondition,i))return void i.convertToUnknownDocument(a.version);const c=cl(s.fieldTransforms,i,a.transformResults),l=i.data;l.setAll(hf(s)),l.setAll(c),i.convertToFoundDocument(a.version,l).setHasCommittedMutations()})(n,e,t):(function(s,i,a){i.convertToNoDocument(a.version).setHasCommittedMutations()})(0,e,t)}function Fr(n,e,t,r){return n instanceof Rs?(function(i,a,c,l){if(!ui(i.precondition,a))return c;const f=i.value.clone(),p=ul(i.fieldTransforms,l,a);return f.setAll(p),a.convertToFoundDocument(a.version,f).setHasLocalMutations(),null})(n,e,t,r):n instanceof xn?(function(i,a,c,l){if(!ui(i.precondition,a))return c;const f=ul(i.fieldTransforms,l,a),p=a.data;return p.setAll(hf(i)),p.setAll(f),a.convertToFoundDocument(a.version,p).setHasLocalMutations(),c===null?null:c.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map((m=>m.field)))})(n,e,t,r):(function(i,a,c){return ui(i.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):c})(n,e,t)}function ny(n,e){let t=null;for(const r of n.fieldTransforms){const s=e.data.field(r.field),i=of(r.transform,s||null);i!=null&&(t===null&&(t=He.empty()),t.set(r.field,i))}return t||null}function al(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!(function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&Jn(r,s,((i,a)=>Z_(i,a)))})(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class Rs extends zi{constructor(e,t,r,s=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class xn extends zi{constructor(e,t,r,s,i=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function hf(n){const e=new Map;return n.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const r=n.data.field(t);e.set(t,r)}})),e}function cl(n,e,t){const r=new Map;U(n.length===t.length,32656,{ve:t.length,De:n.length});for(let s=0;s<t.length;s++){const i=n[s],a=i.transform,c=e.data.field(i.field);r.set(i.field,J_(a,c,t[s]))}return r}function ul(n,e,t){const r=new Map;for(const s of n){const i=s.transform,a=t.data.field(s.field);r.set(s.field,X_(i,a,e))}return r}class ff extends zi{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class ry extends zi{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vi{constructor(e,t){this.position=e,this.inclusive=t}}function ll(n,e,t){let r=0;for(let s=0;s<n.position.length;s++){const i=e[s],a=n.position[s];if(i.field.isKeyField()?r=$.comparator($.fromName(a.referenceValue),t.key):r=je(a,t.data.field(i.field)),i.dir==="desc"&&(r*=-1),r!==0)break}return r}function hl(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!et(n.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class df{}class ye extends df{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,r):new iy(e,t,r):t==="array-contains"?new cy(e,r):t==="in"?new uy(e,r):t==="not-in"?new ly(e,r):t==="array-contains-any"?new hy(e,r):new ye(e,t,r)}static createKeyFieldInFilter(e,t,r){return t==="in"?new oy(e,r):new ay(e,r)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(je(t,this.value)):t!==null&&pe(this.value)===pe(t)&&this.matchesComparison(je(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return B(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class gt extends df{constructor(e,t){super(),this.filters=e,this.op=t,this.Ce=null}static create(e,t){return new gt(e,t)}matches(e){return pf(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.Ce!==null||(this.Ce=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.Ce}getFilters(){return Object.assign([],this.filters)}}function pf(n){return n.op==="and"}function mf(n){return sy(n)&&pf(n)}function sy(n){for(const e of n.filters)if(e instanceof gt)return!1;return!0}function Yo(n){if(n instanceof ye)return n.field.canonicalString()+n.op.toString()+tr(n.value);if(mf(n))return n.filters.map((e=>Yo(e))).join(",");{const e=n.filters.map((t=>Yo(t))).join(",");return`${n.op}(${e})`}}function gf(n,e){return n instanceof ye?(function(r,s){return s instanceof ye&&r.op===s.op&&r.field.isEqual(s.field)&&et(r.value,s.value)})(n,e):n instanceof gt?(function(r,s){return s instanceof gt&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce(((i,a,c)=>i&&gf(a,s.filters[c])),!0):!1})(n,e):void B(19439)}function _f(n){return n instanceof ye?(function(t){return`${t.field.canonicalString()} ${t.op} ${tr(t.value)}`})(n):n instanceof gt?(function(t){return t.op.toString()+" {"+t.getFilters().map(_f).join(" ,")+"}"})(n):"Filter"}class iy extends ye{constructor(e,t,r){super(e,t,r),this.key=$.fromName(r.referenceValue)}matches(e){const t=$.comparator(e.key,this.key);return this.matchesComparison(t)}}class oy extends ye{constructor(e,t){super(e,"in",t),this.keys=yf("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class ay extends ye{constructor(e,t){super(e,"not-in",t),this.keys=yf("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function yf(n,e){var t;return(((t=e.arrayValue)==null?void 0:t.values)||[]).map((r=>$.fromName(r.referenceValue)))}class cy extends ye{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return nr(t)&&Zr(t.arrayValue,this.value)}}class uy extends ye{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&Zr(this.value.arrayValue,t)}}class ly extends ye{constructor(e,t){super(e,"not-in",t)}matches(e){if(Zr(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!Zr(this.value.arrayValue,t)}}class hy extends ye{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!nr(t)||!t.arrayValue.values)&&t.arrayValue.values.some((r=>Zr(this.value.arrayValue,r)))}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Si{constructor(e,t="asc"){this.field=e,this.dir=t}}function fy(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class W{static fromTimestamp(e){return new W(e)}static min(){return new W(new ee(0,0))}static max(){return new W(new ee(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xe{constructor(e,t,r,s,i,a,c){this.key=e,this.documentType=t,this.version=r,this.readTime=s,this.createTime=i,this.data=a,this.documentState=c}static newInvalidDocument(e){return new xe(e,0,W.min(),W.min(),W.min(),He.empty(),0)}static newFoundDocument(e,t,r,s){return new xe(e,1,t,W.min(),r,s,0)}static newNoDocument(e,t){return new xe(e,2,t,W.min(),W.min(),He.empty(),0)}static newUnknownDocument(e,t){return new xe(e,3,t,W.min(),W.min(),He.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(W.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=He.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=He.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=W.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof xe&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new xe(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const os=-1;function dy(n,e){const t=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,s=W.fromTimestamp(r===1e9?new ee(t+1,0):new ee(t,r));return new nn(s,$.empty(),e)}function py(n){return new nn(n.readTime,n.key,os)}class nn{constructor(e,t,r){this.readTime=e,this.documentKey=t,this.largestBatchId=r}static min(){return new nn(W.min(),$.empty(),os)}static max(){return new nn(W.max(),$.empty(),os)}}function my(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=$.comparator(n.documentKey,e.documentKey),t!==0?t:Q(n.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gy{constructor(e,t=null,r=[],s=[],i=null,a=null,c=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=s,this.limit=i,this.startAt=a,this.endAt=c,this.Fe=null}}function fl(n,e=null,t=[],r=[],s=null,i=null,a=null){return new gy(n,e,t,r,s,i,a)}function Ef(n){const e=G(n);if(e.Fe===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((r=>Yo(r))).join(","),t+="|ob:",t+=e.orderBy.map((r=>(function(i){return i.field.canonicalString()+i.dir})(r))).join(","),$i(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((r=>tr(r))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((r=>tr(r))).join(",")),e.Fe=t}return e.Fe}function wf(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!fy(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!gf(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!hl(n.startAt,e.startAt)&&hl(n.endAt,e.endAt)}function gn(n){return!!n.isCorePipeline}function Tf(n){return!!n.path&&$.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wi{constructor(e,t=null,r=[],s=[],i=null,a="F",c=null,l=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=s,this.limit=i,this.limitType=a,this.startAt=c,this.endAt=l,this.Oe=null,this.Me=null,this.Ne=null,this.startAt,this.endAt}}function _y(n,e,t,r,s,i,a,c){return new Wi(n,e,t,r,s,i,a,c)}function Hi(n){return new Wi(n)}function dl(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function yy(n){return $.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}function Ey(n){return n.collectionGroup!==null}function Br(n){const e=G(n);if(e.Oe===null){e.Oe=[];const t=new Set;for(const i of e.explicitOrderBy)e.Oe.push(i),t.add(i.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(a){let c=new de(Qe.comparator);return a.filters.forEach((l=>{l.getFlattenedFilters().forEach((f=>{f.isInequality()&&(c=c.add(f.field))}))})),c})(e).forEach((i=>{t.has(i.canonicalString())||i.isKeyField()||e.Oe.push(new Si(i,r))})),t.has(Qe.keyField().canonicalString())||e.Oe.push(new Si(Qe.keyField(),r))}return e.Oe}function ft(n){const e=G(n);return e.Me||(e.Me=wy(e,Br(n))),e.Me}function wy(n,e){if(n.limitType==="F")return fl(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map((s=>{const i=s.dir==="desc"?"asc":"desc";return new Si(s.field,i)}));const t=n.endAt?new Vi(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new Vi(n.startAt.position,n.startAt.inclusive):null;return fl(n.path,n.collectionGroup,e,n.filters,n.limit,t,r)}}function Zo(n,e,t){return new Wi(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function Ty(n,e){return wf(ft(n),ft(e))&&n.limitType===e.limitType}function $r(n){return`Query(target=${(function(t){let r=t.path.canonicalString();return t.collectionGroup!==null&&(r+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(r+=`, filters: [${t.filters.map((s=>_f(s))).join(", ")}]`),$i(t.limit)||(r+=", limit: "+t.limit),t.orderBy.length>0&&(r+=`, orderBy: [${t.orderBy.map((s=>(function(a){return`${a.field.canonicalString()} (${a.dir})`})(s))).join(", ")}]`),t.startAt&&(r+=", startAt: ",r+=t.startAt.inclusive?"b:":"a:",r+=t.startAt.position.map((s=>tr(s))).join(",")),t.endAt&&(r+=", endAt: ",r+=t.endAt.inclusive?"a:":"b:",r+=t.endAt.position.map((s=>tr(s))).join(",")),`Target(${r})`})(ft(n))}; limitType=${n.limitType})`}function Gi(n,e){return e.isFoundDocument()&&(function(r,s){const i=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(i):$.isDocumentKey(r.path)?r.path.isEqual(i):r.path.isImmediateParentOf(i)})(n,e)&&(function(r,s){for(const i of Br(r))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0})(n,e)&&(function(r,s){for(const i of r.filters)if(!i.matches(s))return!1;return!0})(n,e)&&(function(r,s){return!(r.startAt&&!(function(a,c,l){const f=ll(a,c,l);return a.inclusive?f<=0:f<0})(r.startAt,Br(r),s)||r.endAt&&!(function(a,c,l){const f=ll(a,c,l);return a.inclusive?f>=0:f>0})(r.endAt,Br(r),s))})(n,e)}function La(n){return(e,t)=>{let r=!1;for(const s of Br(n)){const i=vy(s,e,t);if(i!==0)return i;r=r||s.field.isKeyField()}return 0}}function vy(n,e,t){const r=n.field.isKeyField()?$.comparator(e.key,t.key):(function(i,a,c){const l=a.data.field(i),f=c.data.field(i);return l!==null&&f!==null?je(l,f):B(42886)})(n.field,e,t);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return B(19790,{direction:n.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Iy{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var he,Z;function Ay(n){switch(n){case x.OK:return B(64938);case x.CANCELLED:case x.UNKNOWN:case x.DEADLINE_EXCEEDED:case x.RESOURCE_EXHAUSTED:case x.INTERNAL:case x.UNAVAILABLE:case x.UNAUTHENTICATED:return!1;case x.INVALID_ARGUMENT:case x.NOT_FOUND:case x.ALREADY_EXISTS:case x.PERMISSION_DENIED:case x.FAILED_PRECONDITION:case x.ABORTED:case x.OUT_OF_RANGE:case x.UNIMPLEMENTED:case x.DATA_LOSS:return!0;default:return B(15467,{code:n})}}function vf(n){if(n===void 0)return St("GRPC error has no .code"),x.UNKNOWN;switch(n){case he.OK:return x.OK;case he.CANCELLED:return x.CANCELLED;case he.UNKNOWN:return x.UNKNOWN;case he.DEADLINE_EXCEEDED:return x.DEADLINE_EXCEEDED;case he.RESOURCE_EXHAUSTED:return x.RESOURCE_EXHAUSTED;case he.INTERNAL:return x.INTERNAL;case he.UNAVAILABLE:return x.UNAVAILABLE;case he.UNAUTHENTICATED:return x.UNAUTHENTICATED;case he.INVALID_ARGUMENT:return x.INVALID_ARGUMENT;case he.NOT_FOUND:return x.NOT_FOUND;case he.ALREADY_EXISTS:return x.ALREADY_EXISTS;case he.PERMISSION_DENIED:return x.PERMISSION_DENIED;case he.FAILED_PRECONDITION:return x.FAILED_PRECONDITION;case he.ABORTED:return x.ABORTED;case he.OUT_OF_RANGE:return x.OUT_OF_RANGE;case he.UNIMPLEMENTED:return x.UNIMPLEMENTED;case he.DATA_LOSS:return x.DATA_LOSS;default:return B(39323,{code:n})}}(Z=he||(he={}))[Z.OK=0]="OK",Z[Z.CANCELLED=1]="CANCELLED",Z[Z.UNKNOWN=2]="UNKNOWN",Z[Z.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",Z[Z.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",Z[Z.NOT_FOUND=5]="NOT_FOUND",Z[Z.ALREADY_EXISTS=6]="ALREADY_EXISTS",Z[Z.PERMISSION_DENIED=7]="PERMISSION_DENIED",Z[Z.UNAUTHENTICATED=16]="UNAUTHENTICATED",Z[Z.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",Z[Z.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",Z[Z.ABORTED=10]="ABORTED",Z[Z.OUT_OF_RANGE=11]="OUT_OF_RANGE",Z[Z.UNIMPLEMENTED=12]="UNIMPLEMENTED",Z[Z.INTERNAL=13]="INTERNAL",Z[Z.UNAVAILABLE=14]="UNAVAILABLE",Z[Z.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nn{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r!==void 0){for(const[s,i]of r)if(this.equalsFn(s,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){const r=this.mapKeyFn(e),s=this.inner[r];if(s===void 0)return this.inner[r]=[[e,t]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return void(s[i]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return r.length===1?delete this.inner[t]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(e){Sn(this.inner,((t,r)=>{for(const[s,i]of r)e(s,i)}))}isEmpty(){return jh(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const by=new oe($.comparator);function Be(){return by}const If=new oe($.comparator);function Bn(...n){let e=If;for(const t of n)e=e.insert(t.key,t);return e}function Af(n){let e=If;return n.forEach(((t,r)=>e=e.insert(t,r.overlayedDocument))),e}function zt(){return qr()}function bf(){return qr()}function qr(){return new Nn((n=>n.toString()),((n,e)=>n.isEqual(e)))}const Ry=new oe($.comparator),Py=new de($.comparator);function X(...n){let e=Py;for(const t of n)e=e.add(t);return e}const Vy=new de(Q);function Sy(){return Vy}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cy(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xy=new Kt([4294967295,4294967295],0);function pl(n){const e=Cy().encode(n),t=new Lh;return t.update(e),new Uint8Array(t.digest())}function ml(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),r=e.getUint32(4,!0),s=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new Kt([t,r],0),new Kt([s,i],0)]}class Ma{constructor(e,t,r){if(this.bitmap=e,this.padding=t,this.hashCount=r,t<0||t>=8)throw new Dr(`Invalid padding: ${t}`);if(r<0)throw new Dr(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new Dr(`Invalid hash count: ${r}`);if(e.length===0&&t!==0)throw new Dr(`Invalid padding when bitmap length is 0: ${t}`);this.Be=8*e.length-t,this.Le=Kt.fromNumber(this.Be)}Ue(e,t,r){let s=e.add(t.multiply(Kt.fromNumber(r)));return s.compare(xy)===1&&(s=new Kt([s.getBits(0),s.getBits(1)],0)),s.modulo(this.Le).toNumber()}ke(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.Be===0)return!1;const t=pl(e),[r,s]=ml(t);for(let i=0;i<this.hashCount;i++){const a=this.Ue(r,s,i);if(!this.ke(a))return!1}return!0}static create(e,t,r){const s=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),a=new Ma(i,s,t);return r.forEach((c=>a.insert(c))),a}insert(e){if(this.Be===0)return;const t=pl(e),[r,s]=ml(t);for(let i=0;i<this.hashCount;i++){const a=this.Ue(r,s,i);this.Qe(a)}}Qe(e){const t=Math.floor(e/8),r=e%8;this.bitmap[t]|=1<<r}}class Dr extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ps{constructor(e,t,r,s,i,a){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=r,this.documentUpdates=s,this.augmentedDocumentUpdates=i,this.resolvedLimboDocuments=a}static createSynthesizedRemoteEventForCurrentChange(e,t,r){const s=new Map;return s.set(e,Vs.createSynthesizedTargetChangeForCurrentChange(e,t,r)),new Ps(W.min(),s,new oe(Q),Be(),Be(),X())}}class Vs{constructor(e,t,r,s,i){this.resumeToken=e,this.current=t,this.addedDocuments=r,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,r){return new Vs(r,t,X(),X(),X())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class li{constructor(e,t,r,s){this.qe=e,this.removedTargetIds=t,this.key=r,this.Ke=s}}class Rf{constructor(e,t){this.targetId=e,this.$e=t}}class Pf{constructor(e,t,r=ae.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=r,this.cause=s}}class gl{constructor(e){this.targetId=e,this.We=0,this.Ge=_l(),this.je=ae.EMPTY_BYTE_STRING,this.ze=!1,this.He=!0}get current(){return this.ze}get resumeToken(){return this.je}get Je(){return this.We!==0}get Ye(){return this.He}Ze(e){e.approximateByteSize()>0&&(this.He=!0,this.je=e)}Xe(){let e=X(),t=X(),r=X();return this.Ge.forEach(((s,i)=>{switch(i){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:r=r.add(s);break;default:B(38017,{changeType:i})}})),new Vs(this.je,this.ze,e,t,r)}et(){this.He=!1,this.Ge=_l()}tt(e,t){this.He=!0,this.Ge=this.Ge.insert(e,t)}nt(e){this.He=!0,this.Ge=this.Ge.remove(e)}rt(){this.We+=1}it(){this.We-=1,U(this.We>=0,3241,{We:this.We,targetId:this.targetId})}st(){this.He=!0,this.ze=!0}}const Cr="WatchChangeAggregator";class Ny{constructor(e){this._t=e,this.ot=new Map,this.ut=Be(),this.ct=Ys(),this.lt=Be(),this.Et=Ys(),this.ht=new oe(Q)}Tt(e){for(const t of e.qe)e.Ke&&e.Ke.isFoundDocument()?this.Pt(t,e.Ke):this.It(t,e.key,e.Ke);for(const t of e.removedTargetIds)this.It(t,e.key,e.Ke)}Rt(e){this.forEachTarget(e,(t=>{const r=this.ot.get(t);if(r)switch(e.state){case 0:this.At(t)&&r.Ze(e.resumeToken);break;case 1:r.it(),r.Je||r.et(),r.Ze(e.resumeToken);break;case 2:r.it(),r.Je||this.removeTarget(t);break;case 3:this.At(t)&&(r.st(),r.Ze(e.resumeToken));break;case 4:this.At(t)&&(this.Vt(t),r.Ze(e.resumeToken));break;default:B(56790,{state:e.state})}else D(Cr,`handleTargetChange received targetChange for untracked target ID (${t}) with state (${e.state})`)}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.ot.forEach(((r,s)=>{this.At(s)&&t(s)}))}ft(e){var t;return gn(e)?e.getPipelineSourceType()==="documents"&&((t=e.getPipelineDocuments())==null?void 0:t.length)===1:Tf(e)}dt(e){const t=e.targetId,r=e.$e.count,s=this.gt(t);if(s){const i=s.target;if(this.ft(i))if(r===0){const a=new $(gn(i)?te.fromString(i.getPipelineDocuments()[0]):i.path);this.It(t,a,xe.newNoDocument(a,W.min()))}else U(r===1,20013,"Single document existence filter with count: "+r);else{const a=this.yt(t);if(a!==r){const c=this.wt(e),l=c?this.bt(c,e,a):1;if(l!==0){this.Vt(t);const f=l===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.ht=this.ht.insert(t,f)}}}}}wt(e){const t=e.$e.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:r="",padding:s=0},hashCount:i=0}=t;let a,c;try{a=Vn(r).toUint8Array()}catch(l){if(l instanceof zh)return it("Decoding the base64 bloom filter in existence filter failed ("+l.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw l}try{c=new Ma(a,s,i)}catch(l){return it(l instanceof Dr?"BloomFilter error: ":"Applying bloom filter failed: ",l),null}return c.Be===0?null:c}bt(e,t,r){return t.$e.count===r-this.vt(e,t.targetId)?0:2}vt(e,t){const r=this._t.getRemoteKeysForTarget(t);let s=0;return r.forEach((i=>{const a=this._t.xt(),c=`projects/${a.projectId}/databases/${a.database}/documents/${i.path.canonicalString()}`;e.mightContain(c)||(this.It(t,i,null),s++)})),s}Dt(e){const t=new Map;this.ot.forEach(((i,a)=>{const c=this.gt(a);if(c){if(i.current&&this.ft(c.target)){const l=gn(c.target)?te.fromString(c.target.getPipelineDocuments()[0]):c.target.path,f=new $(l);this.Ct(f).has(a)||this.Ft(a,f)||this.It(a,f,xe.newNoDocument(f,e))}i.Ye&&(t.set(a,i.Xe()),i.et())}}));let r=X();this.Et.forEach(((i,a)=>{let c=!0;a.forEachWhile((l=>{const f=this.gt(l);return!f||f.purpose==="TargetPurposeLimboResolution"||(c=!1,!1)})),c&&(r=r.add(i))})),this.ut.forEach(((i,a)=>a.setReadTime(e))),this.lt.forEach(((i,a)=>a.setReadTime(e)));const s=new Ps(e,t,this.ht,this.ut,this.lt,r);return this.ut=Be(),this.ct=Ys(),this.lt=Be(),this.Et=Ys(),this.ht=new oe(Q),s}Pt(e,t){const r=this.ot.get(e);if(!r||!this.At(e))return void D(Cr,`addDocumentToTarget received document for unknown inactive target (${e})`);const s=this.Ft(e,t.key)?2:0;r.tt(t.key,s),gn(this.gt(e).target)&&this.gt(e).target.getPipelineFlavor()!=="exact"?this.lt=this.lt.insert(t.key,t):this.ut=this.ut.insert(t.key,t),this.ct=this.ct.insert(t.key,this.Ct(t.key).add(e)),this.Et=this.Et.insert(t.key,this.Ot(t.key).add(e))}It(e,t,r){const s=this.ot.get(e);s&&this.At(e)?(this.Ft(e,t)?s.tt(t,1):s.nt(t),this.Et=this.Et.insert(t,this.Ot(t).delete(e)),this.Et=this.Et.insert(t,this.Ot(t).add(e)),r&&(gn(this.gt(e).target)&&this.gt(e).target.getPipelineFlavor()!=="exact"?this.lt=this.lt.insert(t,r):this.ut=this.ut.insert(t,r))):D(Cr,`removeDocumentFromTarget received document for unknown or inactive target (${e})`)}removeTarget(e){this.ot.delete(e)}yt(e){const t=this.ot.get(e);if(!t)return 0;const r=t.Xe();return this._t.getRemoteKeysForTarget(e).size+r.addedDocuments.size-r.removedDocuments.size}rt(e){let t=this.ot.get(e);t||(D(Cr,`recordPendingTargetRequest set up tracking for target ID ${e}`),t=new gl(e),this.ot.set(e,t)),t.rt()}Ot(e){let t=this.Et.get(e);return t||(t=new de(Q),this.Et=this.Et.insert(e,t)),t}Ct(e){let t=this.ct.get(e);return t||(t=new de(Q),this.ct=this.ct.insert(e,t)),t}At(e){const t=this.gt(e)!==null;return t||D(Cr,"Detected inactive target",e),t}gt(e){const t=this.ot.get(e);return t===void 0||t.Je?null:this._t.Mt(e)}Vt(e){this.ot.set(e,new gl(e)),this._t.getRemoteKeysForTarget(e).forEach((t=>{this.It(e,t,null)}))}Ft(e,t){return this._t.getRemoteKeysForTarget(e).has(t)}}function Ys(){return new oe($.comparator)}function _l(){return new oe($.comparator)}const ky={asc:"ASCENDING",desc:"DESCENDING"},Dy={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},Oy={and:"AND",or:"OR"};class Ly{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function ea(n,e){return n.useProto3Json||$i(e)?e:{value:e}}function jr(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Ua(n){const e=Zt(n);return new ee(e.seconds,e.nanos)}function ta(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function hi(n,e){return jr(n,e.toTimestamp())}function dt(n){return U(!!n,49232),W.fromTimestamp(Ua(n))}function Fa(n,e){return na(n,e).canonicalString()}function na(n,e){const t=(function(s){return new te(["projects",s.projectId,"databases",s.database])})(n).child("documents");return e===void 0?t:t.child(e)}function Vf(n){const e=te.fromString(n);return U(kf(e),10190,{key:e.toString()}),e}function Ci(n,e){return Fa(n.databaseId,e.path)}function Lo(n,e){const t=Vf(e);if(t.get(1)!==n.databaseId.projectId)throw new L(x.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new L(x.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new $(Cf(t))}function Sf(n,e){return Fa(n.databaseId,e)}function My(n){const e=Vf(n);return e.length===4?te.emptyPath():Cf(e)}function ra(n){return new te(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function Cf(n){return U(n.length>4&&n.get(4)==="documents",29091,{key:n.toString()}),n.popFirst(5)}function yl(n,e,t){return{name:Ci(n,e),fields:t.value.mapValue.fields}}function Uy(n,e){let t;if("targetChange"in e){e.targetChange;const r=(function(f){return f==="NO_CHANGE"?0:f==="ADD"?1:f==="REMOVE"?2:f==="CURRENT"?3:f==="RESET"?4:B(39313,{state:f})})(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],i=(function(f,p){return f.useProto3Json?(U(p===void 0||typeof p=="string",58123),ae.fromBase64String(p||"")):(U(p===void 0||p instanceof Buffer||p instanceof Uint8Array,16193),ae.fromUint8Array(p||new Uint8Array))})(n,e.targetChange.resumeToken),a=e.targetChange.cause,c=a&&(function(f){const p=f.code===void 0?x.UNKNOWN:vf(f.code);return new L(p,f.message||"")})(a);t=new Pf(r,s,i,c||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const s=Lo(n,r.document.name),i=dt(r.document.updateTime),a=r.document.createTime?dt(r.document.createTime):W.min(),c=new He({mapValue:{fields:r.document.fields}}),l=xe.newFoundDocument(s,i,a,c),f=r.targetIds||[],p=r.removedTargetIds||[];t=new li(f,p,l.key,l)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const s=Lo(n,r.document),i=r.readTime?dt(r.readTime):W.min(),a=xe.newNoDocument(s,i),c=r.removedTargetIds||[];t=new li([],c,a.key,a)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const s=Lo(n,r.document),i=r.removedTargetIds||[];t=new li([],i,s,null)}else{if(!("filter"in e))return B(11601,{Nt:e});{e.filter;const r=e.filter;r.targetId;const{count:s=0,unchangedNames:i}=r,a=new Iy(s,i),c=r.targetId;t=new Rf(c,a)}}return t}function Fy(n,e){let t;if(e instanceof Rs)t={update:yl(n,e.key,e.value)};else if(e instanceof ff)t={delete:Ci(n,e.key)};else if(e instanceof xn)t={update:yl(n,e.key,e.data),updateMask:Qy(e.fieldMask)};else{if(!(e instanceof ry))return B(16599,{Bt:e.type});t={verify:Ci(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((r=>(function(i,a){const c=a.transform;if(c instanceof ns)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(c instanceof rs)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:c.elements}};if(c instanceof ss)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:c.elements}};if(c instanceof is)return{fieldPath:a.field.canonicalString(),increment:c.xe};if(c instanceof Ri)return{fieldPath:a.field.canonicalString(),minimum:c.xe};if(c instanceof Pi)return{fieldPath:a.field.canonicalString(),maximum:c.xe};throw B(20930,{transform:a.transform})})(0,r)))),e.precondition.isNone||(t.currentDocument=(function(s,i){return i.updateTime!==void 0?{updateTime:hi(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:B(27497)})(n,e.precondition)),t}function By(n,e){return n&&n.length>0?(U(e!==void 0,14353),n.map((t=>(function(s,i){let a=s.updateTime?dt(s.updateTime):dt(i);return a.isEqual(W.min())&&(a=dt(i)),new ey(a,s.transformResults||[])})(t,e)))):[]}function $y(n,e){return{documents:[Sf(n,e.path)]}}function qy(n,e){const t={structuredQuery:{}},r=e.path;let s;e.collectionGroup!==null?(s=r,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=r.popLast(),t.structuredQuery.from=[{collectionId:r.lastSegment()}]),t.parent=Sf(n,s);const i=(function(f){if(f.length!==0)return Nf(gt.create(f,"and"))})(e.filters);i&&(t.structuredQuery.where=i);const a=(function(f){if(f.length!==0)return f.map((p=>(function(v){return{field:$n(v.field),direction:Hy(v.dir)}})(p)))})(e.orderBy);a&&(t.structuredQuery.orderBy=a);const c=ea(n,e.limit);return c!==null&&(t.structuredQuery.limit=c),e.startAt&&(t.structuredQuery.startAt=(function(f){return{before:f.inclusive,values:f.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(f){return{before:!f.inclusive,values:f.position}})(e.endAt)),{Lt:t,parent:s}}function jy(n){let e=My(n.parent);const t=n.structuredQuery,r=t.from?t.from.length:0;let s=null;if(r>0){U(r===1,65062);const p=t.from[0];p.allDescendants?s=p.collectionId:e=e.child(p.collectionId)}let i=[];t.where&&(i=(function(m){const v=xf(m);return v instanceof gt&&mf(v)?v.getFilters():[v]})(t.where));let a=[];t.orderBy&&(a=(function(m){return m.map((v=>(function(C){return new Si(qn(C.field),(function(O){switch(O){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(C.direction))})(v)))})(t.orderBy));let c=null;t.limit&&(c=(function(m){let v;return v=typeof m=="object"?m.value:m,$i(v)?null:v})(t.limit));let l=null;t.startAt&&(l=(function(m){const v=!!m.before,V=m.values||[];return new Vi(V,v)})(t.startAt));let f=null;return t.endAt&&(f=(function(m){const v=!m.before,V=m.values||[];return new Vi(V,v)})(t.endAt)),_y(e,s,a,i,c,"F",l,f)}function zy(n,e){const t=(function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return B(28987,{purpose:s})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function Wy(n,e){return{structuredPipeline:{pipeline:{stages:e.stages.map((t=>t._toProto(n)))}}}}function xf(n){return n.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const r=qn(t.unaryFilter.field);return ye.create(r,"==",{doubleValue:NaN});case"IS_NULL":const s=qn(t.unaryFilter.field);return ye.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=qn(t.unaryFilter.field);return ye.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=qn(t.unaryFilter.field);return ye.create(a,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return B(61313);default:return B(60726)}})(n):n.fieldFilter!==void 0?(function(t){return ye.create(qn(t.fieldFilter.field),(function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return B(58110);default:return B(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(n):n.compositeFilter!==void 0?(function(t){return gt.create(t.compositeFilter.filters.map((r=>xf(r))),(function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return B(1026)}})(t.compositeFilter.op))})(n):B(30097,{filter:n})}function Hy(n){return ky[n]}function Gy(n){return Dy[n]}function Ky(n){return Oy[n]}function $n(n){return{fieldPath:n.canonicalString()}}function qn(n){return Qe.fromServerFormat(n.fieldPath)}function Nf(n){return n instanceof ye?(function(t){if(t.op==="=="){if(Ae(t.value))return{unaryFilter:{field:$n(t.field),op:"IS_NAN"}};if(Ke(t.value))return{unaryFilter:{field:$n(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Ae(t.value))return{unaryFilter:{field:$n(t.field),op:"IS_NOT_NAN"}};if(Ke(t.value))return{unaryFilter:{field:$n(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:$n(t.field),op:Gy(t.op),value:t.value}}})(n):n instanceof gt?(function(t){const r=t.getFilters().map((s=>Nf(s)));return r.length===1?r[0]:{compositeFilter:{op:Ky(t.op),filters:r}}})(n):B(54877,{filter:n})}function Qy(n){const e=[];return n.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function kf(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}function Df(n){return!!n&&typeof n._toProto=="function"&&n._protoValueType==="ProtoValue"}function as(n,e){const t={fields:{}};return e.forEach(((r,s)=>{if(typeof s!="string")throw new Error(`Cannot encode map with non-string key: ${s}`);t.fields[s]=r._toProto(n)})),{mapValue:t}}function Of(n){return{stringValue:n}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ki(n){return new Ly(n,!0)}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ba{constructor(e){this.value=e}isEqual(e){return this.value===e.value}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $a{constructor(e,t){if(this.seconds=e,this.increment=t,!Number.isInteger(e)||e<0||e>4294967295)throw new Error("BsonTimestamp 'seconds' must be in the range of a 32-bit unsigned integer (0-4294967295).");if(!Number.isInteger(t)||t<0||t>4294967295)throw new Error("BsonTimestamp 'increment' must be in the range of a 32-bit unsigned integer (0-4294967295).")}isEqual(e){return this.seconds===e.seconds&&this.increment===e.increment}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ge{constructor(e,t=0){if(this.subtype=t,!Number.isInteger(t)||t<0||t>255)throw new L(x.INVALID_ARGUMENT,"The subtype for Bytes must be a value in the inclusive [0, 255] range.");this._byteString=e}static fromBase64String(e,t=0){try{return new Ge(ae.fromBase64String(e),t)}catch(r){throw new L(x.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+r)}}static fromUint8Array(e,t=0){return new Ge(ae.fromUint8Array(e),t)}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}get data(){return this.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+", subtype: "+this.subtype+")"}isEqual(e){return this.subtype===e.subtype&&this._byteString.isEqual(e._byteString)}toJSON(){const e={type:Ge._jsonSchemaVersion,bytes:this.toBase64()};return this.subtype!==0&&(e.subtype=this.subtype),e}static fromJSON(e){if(As(e,Ge._jsonSchema)){const t=e.subtype??0;return Ge.fromBase64String(e.bytes,t)}}}Ge._jsonSchemaVersion="firestore/bytes/1.0",Ge._jsonSchema={type:le("string",Ge._jsonSchemaVersion),bytes:le("string"),subtype:{...le("number"),optional:!0}};/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qa{constructor(e){this.stringValue=e,this.value=F.fromString(e)}isEqual(e){return!(!this.value.oe()||!e.value.oe())||this.value.compareTo(e.value)===0}toJSON(){return{kt:{stringValue:this.stringValue}}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ja{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new L(x.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Qe(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}function Xy(){return new ja(Yn)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class za{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pt{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new L(x.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new L(x.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return Q(this._lat,e._lat)||Q(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:pt._jsonSchemaVersion}}static fromJSON(e){if(As(e,pt._jsonSchema))return new pt(e.latitude,e.longitude)}}pt._jsonSchemaVersion="firestore/geoPoint/1.0",pt._jsonSchema={type:le("string",pt._jsonSchemaVersion),latitude:le("number"),longitude:le("number")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wa{constructor(e){this.value=e}isEqual(e){return this.value===e.value}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vt{constructor(){this.type="MaxKey"}static instance(){return vt.MAX_KEY_VALUE_INSTANCE||(vt.MAX_KEY_VALUE_INSTANCE=new vt),vt.MAX_KEY_VALUE_INSTANCE}}vt.MAX_KEY_VALUE_INSTANCE=null;/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class It{constructor(){this.type="MinKey"}static instance(){return It.MIN_KEY_VALUE_INSTANCE||(It.MIN_KEY_VALUE_INSTANCE=new It),It.MIN_KEY_VALUE_INSTANCE}}It.MIN_KEY_VALUE_INSTANCE=null;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ce{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Ce.UNAUTHENTICATED=new Ce(null),Ce.GOOGLE_CREDENTIALS=new Ce("google-credentials-uid"),Ce.FIRST_PARTY=new Ce("first-party-uid"),Ce.MOCK_USER=new Ce("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xt{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lf{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class Jy{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(Ce.UNAUTHENTICATED)))}shutdown(){}}class Yy{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class Zy{constructor(e){this.Qt=e,this.currentUser=Ce.UNAUTHENTICATED,this.qt=0,this.forceRefresh=!1,this.auth=null}start(e,t){U(this.Kt===void 0,42304);let r=this.qt;const s=l=>this.qt!==r?(r=this.qt,t(l)):Promise.resolve();let i=new Xt;this.Kt=()=>{this.qt++,this.currentUser=this.$t(),i.resolve(),i=new Xt,e.enqueueRetryable((()=>s(this.currentUser)))};const a=()=>{const l=i;e.enqueueRetryable((async()=>{await l.promise,await s(this.currentUser)}))},c=l=>{D("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=l,this.Kt&&(this.auth.addAuthTokenListener(this.Kt),a())};this.Qt.onInit((l=>c(l))),setTimeout((()=>{if(!this.auth){const l=this.Qt.getImmediate({optional:!0});l?c(l):(D("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new Xt)}}),0),a()}getToken(){const e=this.qt,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((r=>this.qt!==e?(D("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(U(typeof r.accessToken=="string",31837,{Wt:r}),new Lf(r.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.Kt&&this.auth.removeAuthTokenListener(this.Kt),this.Kt=void 0}$t(){const e=this.auth&&this.auth.getUid();return U(e===null||typeof e=="string",2055,{Gt:e}),new Ce(e)}}class eE{constructor(e,t,r){this.jt=e,this.zt=t,this.Ht=r,this.type="FirstParty",this.user=Ce.FIRST_PARTY,this.Jt=new Map}Yt(){return this.Ht?this.Ht():null}get headers(){this.Jt.set("X-Goog-AuthUser",this.jt);const e=this.Yt();return e&&this.Jt.set("Authorization",e),this.zt&&this.Jt.set("X-Goog-Iam-Authorization-Token",this.zt),this.Jt}}class tE{constructor(e,t,r){this.jt=e,this.zt=t,this.Ht=r}getToken(){return Promise.resolve(new eE(this.jt,this.zt,this.Ht))}start(e,t){e.enqueueRetryable((()=>t(Ce.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class El{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class nE{constructor(e,t){this.Zt=t,this.forceRefresh=!1,this.appCheck=null,this.Xt=null,this.en=null,Ze(e)&&e.settings.appCheckToken&&(this.en=e.settings.appCheckToken)}start(e,t){U(this.Kt===void 0,3512);const r=i=>{i.error!=null&&D("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const a=i.token!==this.Xt;return this.Xt=i.token,D("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?t(i.token):Promise.resolve()};this.Kt=i=>{e.enqueueRetryable((()=>r(i)))};const s=i=>{D("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.Kt&&this.appCheck.addTokenListener(this.Kt)};this.Zt.onInit((i=>s(i))),setTimeout((()=>{if(!this.appCheck){const i=this.Zt.getImmediate({optional:!0});i?s(i):D("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.en)return Promise.resolve(new El(this.en));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(U(typeof t.token=="string",44558,{tokenResult:t}),this.Xt=t.token,new El(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.Kt&&this.appCheck.removeTokenListener(this.Kt),this.Kt=void 0}}function Mf(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rE{tn(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wl="ConnectivityMonitor";class Tl{constructor(){this.nn=()=>this.rn(),this.sn=()=>this._n(),this.an=[],this.un()}tn(e){this.an.push(e)}shutdown(){window.removeEventListener("online",this.nn),window.removeEventListener("offline",this.sn)}un(){window.addEventListener("online",this.nn),window.addEventListener("offline",this.sn)}rn(){D(wl,"Network connectivity changed: AVAILABLE");for(const e of this.an)e(0)}_n(){D(wl,"Network connectivity changed: UNAVAILABLE");for(const e of this.an)e(1)}static cn(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Zs=null;function sa(){return Zs===null?Zs=(function(){return 268435456+Math.round(2147483648*Math.random())})():Zs++,"0x"+Zs.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mo="RestConnection",sE={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"};class iE{get En(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.hn=t+"://"+e.host,this.Tn=`projects/${r}/databases/${s}`,this.Pn=this.databaseId.database===wi?`project_id=${r}`:`project_id=${r}&database_id=${s}`}In(e,t,r,s,i){const a=sa(),c=this.Rn(e,t.toUriEncodedString());D(Mo,`Sending RPC '${e}' ${a}:`,c,r);const l={"google-cloud-resource-prefix":this.Tn,"x-goog-request-params":this.Pn};this.An(l,s,i);const{host:f}=new URL(c),p=Es(f);return this.Vn(e,c,l,r,p).then((m=>(D(Mo,`Received RPC '${e}' ${a}: `,m),m)),(m=>{throw it(Mo,`RPC '${e}' ${a} failed with error: `,m,"url: ",c,"request:",r),m}))}fn(e,t,r,s,i,a){return this.In(e,t,r,s,i)}An(e,t,r){if(e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+ar})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((s,i)=>e[i]=s)),r&&r.headers.forEach(((s,i)=>e[i]=s)),this.databaseInfo._customHeaders)for(const s of Object.keys(this.databaseInfo._customHeaders))e[s]=this.databaseInfo._customHeaders[s]}Rn(e,t){const r=sE[e];let s=`${this.hn}/v1/${t}:${r}`;return this.databaseInfo.apiKey&&(s=`${s}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),s}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oE{constructor(e){this.dn=e.dn,this.mn=e.mn}pn(e){this.gn=e}yn(e){this.wn=e}bn(e){this.Sn=e}onMessage(e){this.xn=e}close(){this.mn()}send(e){this.dn(e)}vn(){this.gn()}Dn(){this.wn()}Cn(e){this.Sn(e)}Fn(e){this.xn(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Se="WebChannelConnection",xr=(n,e,t)=>{n.listen(e,(r=>{try{t(r)}catch(s){setTimeout((()=>{throw s}),0)}}))};class Gn extends iE{constructor(e){super(e),this.On=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}static Mn(){if(!Gn.Nn){const e=Bh();xr(e,Fh.STAT_EVENT,(t=>{t.stat===Go.PROXY?D(Se,"STAT_EVENT: detected buffering proxy"):t.stat===Go.NOPROXY&&D(Se,"STAT_EVENT: detected no buffering proxy")})),Gn.Nn=!0}}Vn(e,t,r,s,i){const a=sa();return new Promise(((c,l)=>{const f=new Mh;f.setWithCredentials(!0),f.listenOnce(Uh.COMPLETE,(()=>{try{switch(f.getLastErrorCode()){case oi.NO_ERROR:const m=f.getResponseJson();D(Se,`XHR for RPC '${e}' ${a} received:`,JSON.stringify(m)),c(m);break;case oi.TIMEOUT:D(Se,`RPC '${e}' ${a} timed out`),l(new L(x.DEADLINE_EXCEEDED,"Request time out"));break;case oi.HTTP_ERROR:const v=f.getStatus();if(D(Se,`RPC '${e}' ${a} failed with status:`,v,"response text:",f.getResponseText()),v>0){let V=f.getResponseJson();Array.isArray(V)&&(V=V[0]);const C=V==null?void 0:V.error;if(C&&C.status&&C.message){const M=(function(H){const J=H.toLowerCase().replace(/_/g,"-");return Object.values(x).indexOf(J)>=0?J:x.UNKNOWN})(C.status);l(new L(M,C.message))}else l(new L(x.UNKNOWN,"Server responded with status "+f.getStatus()))}else l(new L(x.UNAVAILABLE,"Connection failed."));break;default:B(9055,{Bn:e,streamId:a,Ln:f.getLastErrorCode(),Un:f.getLastError()})}}finally{D(Se,`RPC '${e}' ${a} completed.`)}}));const p=JSON.stringify(s);D(Se,`RPC '${e}' ${a} sending request:`,s),f.send(t,"POST",p,r,15)}))}kn(e,t,r){const s=sa(),i=[this.hn,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=this.createWebChannelTransport(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},l=this.longPollingOptions.timeoutSeconds;l!==void 0&&(c.longPollingTimeout=Math.round(1e3*l)),this.useFetchStreams&&(c.useFetchStreams=!0),this.An(c.initMessageHeaders,t,r),c.encodeInitMessageHeaders=!0;const f=i.join("");D(Se,`Creating RPC '${e}' stream ${s}: ${f}`,c);const p=a.createWebChannel(f,c);this.Qn(p);let m=!1,v=!1;const V=new oE({dn:C=>{v?D(Se,`Not sending because RPC '${e}' stream ${s} is closed:`,C):(m||(D(Se,`Opening RPC '${e}' stream ${s} transport.`),p.open(),m=!0),D(Se,`RPC '${e}' stream ${s} sending:`,C),p.send(C))},mn:()=>p.close()});return xr(p,Nr.EventType.OPEN,(()=>{v||(D(Se,`RPC '${e}' stream ${s} transport opened.`),V.vn())})),xr(p,Nr.EventType.CLOSE,(()=>{v||(v=!0,D(Se,`RPC '${e}' stream ${s} transport closed`),V.Cn(),this.qn(p))})),xr(p,Nr.EventType.ERROR,(C=>{v||(v=!0,it(Se,`RPC '${e}' stream ${s} transport errored. Name:`,C.name,"Message:",C.message),V.Cn(new L(x.UNAVAILABLE,"The operation could not be completed")))})),xr(p,Nr.EventType.MESSAGE,(C=>{var M;if(!v){const O=C.data[0];U(!!O,16349);const H=O,J=(H==null?void 0:H.error)||((M=H[0])==null?void 0:M.error);if(J){D(Se,`RPC '${e}' stream ${s} received error:`,J);const se=J.status;let De=(function(T){const g=he[T];if(g!==void 0)return vf(g)})(se),me=J.message;se==="NOT_FOUND"&&me.includes("database")&&me.includes("does not exist")&&me.includes(this.databaseId.database)&&it(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),De===void 0&&(De=x.INTERNAL,me="Unknown error status: "+se+" with message "+J.message),v=!0,V.Cn(new L(De,me)),p.close()}else D(Se,`RPC '${e}' stream ${s} received:`,O),V.Fn(O)}})),Gn.Mn(),setTimeout((()=>{V.Dn()}),0),V}terminate(){this.On.forEach((e=>e.close())),this.On=[]}Qn(e){this.On.push(e)}qn(e){this.On=this.On.filter((t=>t===e))}An(e,t,r){super.An(e,t,r),this.databaseInfo.apiKey&&(e["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return $h()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function aE(n){return new Gn(n)}Gn.Nn=!1;class Uf{constructor(e,t,r=1e3,s=1.5,i=6e4){this.Kn=e,this.timerId=t,this.$n=r,this.Wn=s,this.Gn=i,this.jn=0,this.zn=null,this.Hn=Date.now(),this.reset()}reset(){this.jn=0}Jn(){this.jn=this.Gn}Yn(e){this.cancel();const t=Math.floor(this.jn+this.Zn()),r=Math.max(0,Date.now()-this.Hn),s=Math.max(0,t-r);s>0&&D("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.jn} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.zn=this.Kn.enqueueAfterDelay(this.timerId,s,(()=>(this.Hn=Date.now(),e()))),this.jn*=this.Wn,this.jn<this.$n&&(this.jn=this.$n),this.jn>this.Gn&&(this.jn=this.Gn)}Xn(){this.zn!==null&&(this.zn.skipDelay(),this.zn=null)}cancel(){this.zn!==null&&(this.zn.cancel(),this.zn=null)}Zn(){return(Math.random()-.5)*this.jn}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vl="PersistentStream";class Ff{constructor(e,t,r,s,i,a,c,l){this.Kn=e,this.er=r,this.tr=s,this.connection=i,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=c,this.listener=l,this.state=0,this.nr=0,this.rr=null,this.ir=null,this.stream=null,this.sr=0,this._r=new Uf(e,t)}ar(){return this.state===1||this.state===5||this.ur()}ur(){return this.state===2||this.state===3}start(){this.sr=0,this.state!==4?this.auth():this.cr()}async stop(){this.ar()&&await this.close(0)}lr(){this.state=0,this._r.reset()}Er(){this.ur()&&this.rr===null&&(this.rr=this.Kn.enqueueAfterDelay(this.er,6e4,(()=>this.hr())))}Tr(e){this.Pr(),this.stream.send(e)}async hr(){if(this.ur())return this.close(0)}Pr(){this.rr&&(this.rr.cancel(),this.rr=null)}Ir(){this.ir&&(this.ir.cancel(),this.ir=null)}async close(e,t){this.Pr(),this.Ir(),this._r.cancel(),this.nr++,e!==4?this._r.reset():t&&t.code===x.RESOURCE_EXHAUSTED?(St(t.toString()),St("Using maximum backoff delay to prevent overloading the backend."),this._r.Jn()):t&&t.code===x.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.Rr(),this.stream.close(),this.stream=null),this.state=e,await this.listener.bn(t)}Rr(){}auth(){this.state=1;const e=this.Ar(this.nr),t=this.nr;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([r,s])=>{this.nr===t&&this.Vr(r,s)}),(r=>{e((()=>{const s=new L(x.UNKNOWN,"Fetching auth token failed: "+r.message);return this.dr(s)}))}))}Vr(e,t){const r=this.Ar(this.nr);this.stream=this.mr(e,t),this.stream.pn((()=>{r((()=>this.listener.pn()))})),this.stream.yn((()=>{r((()=>(this.state=2,this.ir=this.Kn.enqueueAfterDelay(this.tr,1e4,(()=>(this.ur()&&(this.state=3),Promise.resolve()))),this.listener.yn())))})),this.stream.bn((s=>{r((()=>this.dr(s)))})),this.stream.onMessage((s=>{r((()=>++this.sr==1?this.pr(s):this.onNext(s)))}))}cr(){this.state=5,this._r.Yn((async()=>{this.state=0,this.start()}))}dr(e){return D(vl,`close with error: ${e}`),this.stream=null,this.close(4,e)}Ar(e){return t=>{this.Kn.enqueueAndForget((()=>this.nr===e?t():(D(vl,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class cE extends Ff{constructor(e,t,r,s,i,a){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,r,s,a),this.serializer=i}mr(e,t){return this.connection.kn("Listen",e,t)}pr(e){return this.onNext(e)}onNext(e){this._r.reset();const t=Uy(this.serializer,e),r=(function(i){if(!("targetChange"in i))return W.min();const a=i.targetChange;return a.targetIds&&a.targetIds.length?W.min():a.readTime?dt(a.readTime):W.min()})(e);return this.listener.gr(t,r)}yr(e){const t={};t.database=ra(this.serializer),t.addTarget=(function(i,a){let c;const l=a.target;if(c=gn(l)?{pipelineQuery:Wy(i,l)}:Tf(l)?{documents:$y(i,l)}:{query:qy(i,l).Lt},c.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){c.resumeToken=ta(i,a.resumeToken);const f=ea(i,a.expectedCount);f!==null&&(c.expectedCount=f)}else if(a.snapshotVersion.compareTo(W.min())>0){c.readTime=jr(i,a.snapshotVersion.toTimestamp());const f=ea(i,a.expectedCount);f!==null&&(c.expectedCount=f)}return c})(this.serializer,e);const r=zy(this.serializer,e);r&&(t.labels=r),this.Tr(t)}wr(e){const t={};t.database=ra(this.serializer),t.removeTarget=e,this.Tr(t)}}class uE extends Ff{constructor(e,t,r,s,i,a){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,r,s,a),this.serializer=i}get br(){return this.sr>0}start(){this.lastStreamToken=void 0,super.start()}Rr(){this.br&&this.Sr([])}mr(e,t){return this.connection.kn("Write",e,t)}pr(e){return U(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,U(!e.writeResults||e.writeResults.length===0,55816),this.listener.vr()}onNext(e){U(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this._r.reset();const t=By(e.writeResults,e.commitTime),r=dt(e.commitTime);return this.listener.Dr(r,t)}Cr(){const e={};e.database=ra(this.serializer),this.Tr(e)}Sr(e){const t={streamToken:this.lastStreamToken,writes:e.map((r=>Fy(this.serializer,r)))};this.Tr(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lE{}class hE extends lE{constructor(e,t,r,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=s,this.Fr=!1}Or(){if(this.Fr)throw new L(x.FAILED_PRECONDITION,"The client has already been terminated.")}In(e,t,r,s){return this.Or(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([i,a])=>this.connection.In(e,na(t,r),s,i,a))).catch((i=>{throw i.name==="FirebaseError"?(i.code===x.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new L(x.UNKNOWN,i.toString())}))}fn(e,t,r,s,i){return this.Or(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([a,c])=>this.connection.fn(e,na(t,r),s,a,c,i))).catch((a=>{throw a.name==="FirebaseError"?(a.code===x.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new L(x.UNKNOWN,a.toString())}))}terminate(){this.Fr=!0,this.connection.terminate()}}function fE(n,e,t,r){return new hE(n,e,t,r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dE="ComponentProvider",Il=new Map;function pE(n,e,t,r,s){return new z_(n,e,t,s.host,s.ssl,s.experimentalForceLongPolling,s.experimentalAutoDetectLongPolling,Mf(s.experimentalLongPollingOptions),s.useFetchStreams,s.isUsingEmulator,r,s._customHeaders,s.grpcFlowControlWindow)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Al={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},Bf=41943040;class Ue{static withCacheSize(e){return new Ue(e,Ue.DEFAULT_COLLECTION_PERCENTILE,Ue.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,r){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=r}}Ue.DEFAULT_COLLECTION_PERCENTILE=10,Ue.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Ue.DEFAULT=new Ue(Bf,Ue.DEFAULT_COLLECTION_PERCENTILE,Ue.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Ue.DISABLED=new Ue(-1,0,0);/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qi{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=r=>this.Mr(r),this.Nr=r=>t.writeSequenceNumber(r))}Mr(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.Nr&&this.Nr(e),e}}Qi.Br=-1;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mE="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class gE{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function cr(n){if(n.code!==x.FAILED_PRECONDITION||n.message!==mE)throw n;D("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class S{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&B(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new S(((r,s)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(r,s)},this.catchCallback=i=>{this.wrapFailure(t,i).next(r,s)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof S?t:S.resolve(t)}catch(t){return S.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):S.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):S.reject(t)}static resolve(e){return new S(((t,r)=>{t(e)}))}static reject(e){return new S(((t,r)=>{r(e)}))}static waitFor(e){return new S(((t,r)=>{let s=0,i=0,a=!1;e.forEach((c=>{++s,c.next((()=>{++i,a&&i===s&&t()}),(l=>r(l)))})),a=!0,i===s&&t()}))}static or(e){let t=S.resolve(!1);for(const r of e)t=t.next((s=>s?S.resolve(s):r()));return t}static forEach(e,t){const r=[];return e.forEach(((s,i)=>{r.push(t.call(this,s,i))})),this.waitFor(r)}static mapArray(e,t){return new S(((r,s)=>{const i=e.length,a=new Array(i);let c=0;for(let l=0;l<i;l++){const f=l;t(e[f]).next((p=>{a[f]=p,++c,c===i&&r(a)}),(p=>s(p)))}}))}static doWhile(e,t){return new S(((r,s)=>{const i=()=>{e()===!0?t().next((()=>{i()}),s):r()};i()}))}}function _E(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function ur(n){return n.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bl="LruGarbageCollector",yE=1048576;function Rl([n,e],[t,r]){const s=Q(n,t);return s===0?Q(e,r):s}class EE{constructor(e){this.ai=e,this.buffer=new de(Rl),this.ui=0}ci(){return++this.ui}li(e){const t=[e,this.ci()];if(this.buffer.size<this.ai)this.buffer=this.buffer.add(t);else{const r=this.buffer.last();Rl(t,r)<0&&(this.buffer=this.buffer.delete(r).add(t))}}get maxValue(){return this.buffer.last()[0]}}class wE{constructor(e,t,r){this.garbageCollector=e,this.asyncQueue=t,this.localStore=r,this.Ei=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.hi(6e4)}stop(){this.Ei&&(this.Ei.cancel(),this.Ei=null)}get started(){return this.Ei!==null}hi(e){D(bl,`Garbage collection scheduled in ${e}ms`),this.Ei=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.Ei=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){ur(t)?D(bl,"Ignoring IndexedDB error during garbage collection: ",t):await cr(t)}await this.hi(3e5)}))}}class TE{constructor(e,t){this.Ti=e,this.params=t}calculateTargetCount(e,t){return this.Ti.Pi(e).next((r=>Math.floor(t/100*r)))}nthSequenceNumber(e,t){if(t===0)return S.resolve(Qi.Br);const r=new EE(t);return this.Ti.forEachTarget(e,(s=>r.li(s.sequenceNumber))).next((()=>this.Ti.Ii(e,(s=>r.li(s))))).next((()=>r.maxValue))}removeTargets(e,t,r){return this.Ti.removeTargets(e,t,r)}removeOrphanedDocuments(e,t){return this.Ti.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(D("LruGarbageCollector","Garbage collection skipped; disabled"),S.resolve(Al)):this.getCacheSize(e).next((r=>r<this.params.cacheSizeCollectionThreshold?(D("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Al):this.Ri(e,t)))}getCacheSize(e){return this.Ti.getCacheSize(e)}Ri(e,t){let r,s,i,a,c,l,f;const p=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((m=>(m>this.params.maximumSequenceNumbersToCollect?(D("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${m}`),s=this.params.maximumSequenceNumbersToCollect):s=m,a=Date.now(),this.nthSequenceNumber(e,s)))).next((m=>(r=m,c=Date.now(),this.removeTargets(e,r,t)))).next((m=>(i=m,l=Date.now(),this.removeOrphanedDocuments(e,r)))).next((m=>(f=Date.now(),Un()<=Y.DEBUG&&D("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${a-p}ms
	Determined least recently used ${s} in `+(c-a)+`ms
	Removed ${i} targets in `+(l-c)+`ms
	Removed ${m} documents in `+(f-l)+`ms
Total Duration: ${f-p}ms`),S.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:i,documentsRemoved:m}))))}}function vE(n,e){return new TE(n,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $f="firestore.googleapis.com",Pl=!0;class Vl{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new L(x.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=$f,this.ssl=Pl}else this.host=e.host,this.ssl=e.ssl??Pl;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e._customHeaders&&(this._customHeaders={...e._customHeaders}),e.cacheSizeBytes===void 0)this.cacheSizeBytes=Bf;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<yE)throw new L(x.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}if(q_("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Mf(e.experimentalLongPollingOptions??{}),(function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new L(x.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new L(x.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new L(x.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams,e.grpcFlowControlWindow!==void 0){if(typeof e.grpcFlowControlWindow!="number"||e.grpcFlowControlWindow<=0||e.grpcFlowControlWindow>2147483647||!Number.isInteger(e.grpcFlowControlWindow))throw new L(x.INVALID_ARGUMENT,"grpcFlowControlWindow must be a positive integer and cannot exceed 2147483647");this.grpcFlowControlWindow=e.grpcFlowControlWindow}}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(r,s){return r.timeoutSeconds===s.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams&&this.grpcFlowControlWindow===e.grpcFlowControlWindow&&(function(r,s){if(r===s)return!0;if(!r||!s)return!1;const i=Object.keys(r),a=Object.keys(s);if(i.length!==a.length)return!1;for(const c of i)if(r[c]!==s[c])return!1;return!0})(this._customHeaders,e._customHeaders)}}let Ha=class{constructor(e,t,r,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Vl({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new L(x.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new L(x.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Vl(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(r){if(!r)return new Jy;switch(r.type){case"firstParty":return new tE(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new L(x.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const r=Il.get(t);r&&(D(dE,"Removing Datastore"),Il.delete(t),r.terminate())})(this),Promise.resolve()}};function IE(n,e,t,r={}){var f;n=Qt(n,Ha);const s=Es(e),i=n._getSettings(),a={...i,emulatorOptions:n._getEmulatorOptions()},c=`${e}:${t}`;s&&Yl(`https://${c}`),i.host!==$f&&i.host!==c&&it("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const l={...i,host:c,ssl:s,emulatorOptions:r};if(!In(l,a)&&(n._setSettings(l),r.mockUserToken)){let p,m;if(typeof r.mockUserToken=="string")p=r.mockUserToken,m=Ce.MOCK_USER;else{p=bp(r.mockUserToken,(f=n._app)==null?void 0:f.options.projectId);const v=r.mockUserToken.sub||r.mockUserToken.user_id;if(!v)throw new L(x.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");m=new Ce(v)}n._authCredentials=new Yy(new Lf(p,m))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xi{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new Xi(this.firestore,e,this._query)}}class fe{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new cs(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new fe(this.firestore,e,this._key)}toJSON(){return{type:fe._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,r){if(As(t,fe._jsonSchema))return new fe(e,r||null,new $(te.fromString(t.referencePath)))}}fe._jsonSchemaVersion="firestore/documentReference/1.0",fe._jsonSchema={type:le("string",fe._jsonSchemaVersion),referencePath:le("string")};class cs extends Xi{constructor(e,t,r){super(e,t,Hi(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new fe(this.firestore,null,new $(e))}withConverter(e){return new cs(this.firestore,e,this._path)}}function zT(n,e,...t){if(n=Xe(n),arguments.length===1&&(e=Ra.newId()),$_("doc","path",e),n instanceof Ha){const r=te.fromString(e,...t);return Ju(r),new fe(n,null,new $(r))}{if(!(n instanceof fe||n instanceof cs))throw new L(x.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(te.fromString(e,...t));return Ju(r),new fe(n.firestore,n instanceof cs?n.converter:null,new $(r))}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ga{constructor(e,t){this.pattern=e,this.options=t}isEqual(e){return this.pattern===e.pattern&&this.options===e.options}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $e{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(r,s){if(r.length!==s.length)return!1;for(let i=0;i<r.length;++i)if(r[i]!==s[i])return!1;return!0})(this._values,e._values)}toJSON(){return{type:$e._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(As(e,$e._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new $e(e.vectorValues);throw new L(x.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}$e._jsonSchemaVersion="firestore/vectorValue/1.0",$e._jsonSchema={type:le("string",$e._jsonSchemaVersion),vectorValues:le("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const AE=/^__.*__$/;class bE{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return this.fieldMask!==null?new xn(e,this.data,this.fieldMask,t,this.fieldTransforms):new Rs(e,this.data,t,this.fieldTransforms)}}function qf(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw B(40011,{dataSource:n})}}class Ka{constructor(e,t,r,s,i,a){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=s,i===void 0&&this.validatePath(),this.fieldTransforms=i||[],this.fieldMask=a||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}contextWith(e){return new Ka({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}childContextForField(e){var s;const t=(s=this.path)==null?void 0:s.child(e),r=this.contextWith({path:t,arrayElement:!1});return r.validatePathSegment(e),r}childContextForFieldPath(e){var s;const t=(s=this.path)==null?void 0:s.child(e),r=this.contextWith({path:t,arrayElement:!1});return r.validatePath(),r}childContextForArray(e){return this.contextWith({path:void 0,arrayElement:!0})}createError(e){return xi(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}validatePath(){if(this.path)for(let e=0;e<this.path.length;e++)this.validatePathSegment(this.path.get(e))}validatePathSegment(e){if(e.length===0)throw this.createError("Document fields must not be empty");if(qf(this.dataSource)&&AE.test(e))throw this.createError('Document fields cannot begin and end with "__"')}}class RE{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||Ki(e)}createContext(e,t,r,s=!1){return new Ka({dataSource:e,methodName:t,targetDoc:r,path:Qe.emptyPath(),arrayElement:!1,hasConverter:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function PE(n){const e=n._freezeSettings(),t=Ki(n._databaseId);return new RE(n._databaseId,!!e.ignoreUndefinedProperties,t)}function VE(n,e,t,r,s,i={}){const a=n.createContext(i.merge||i.mergeFields?2:0,e,t,s);Hf("Data must be an object, but it was:",a,r);const c=jf(r,a);let l,f;if(i.merge)l=new rt(a.fieldMask),f=a.fieldTransforms;else if(i.mergeFields){const p=[];for(const m of i.mergeFields){const v=Ji(e,m,t);if(!a.contains(v))throw new L(x.INVALID_ARGUMENT,`Field '${v}' is specified in your field mask but missing from your input data.`);xE(p,v)||p.push(v)}l=new rt(p),f=a.fieldTransforms.filter((m=>l.covers(m.field)))}else l=null,f=a.fieldTransforms;return new bE(new He(c),l,f)}class Qa extends za{_toFieldTransform(e){return new Y_(e.path,new ns)}isEqual(e){return e instanceof Qa}}function us(n,e,t){if(Wf(n=Xe(n)))return Hf("Unsupported field value:",e,n),jf(n,e);if(n instanceof za)return(function(s,i){if(!qf(i.dataSource))throw i.createError(`${s._methodName}() can only be used with update() and set()`);if(!i.path)throw i.createError(`${s._methodName}() is not currently supported inside arrays`);const a=s._toFieldTransform(i);a&&i.fieldTransforms.push(a)})(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.arrayElement&&e.dataSource!==4)throw e.createError("Nested arrays are not supported");return(function(s,i){const a=[];let c=0;for(const l of s){let f=us(l,i.childContextForArray(c));f==null&&(f={nullValue:"NULL_VALUE"}),a.push(f),c++}return{arrayValue:{values:a}}})(n,e)}return(function(s,i,a){if((s=Xe(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return Da(i.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const c=ee.fromDate(s);return{timestampValue:jr(i.serializer,c)}}if(s instanceof ee){const c=new ee(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:jr(i.serializer,c)}}if(zf(s)){const c=ee.fromInstant(s),l=new ee(c.seconds,1e3*Math.floor(c.nanoseconds/1e3));return{timestampValue:jr(i.serializer,l)}}if(s instanceof pt)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof Ge)return s.subtype===0?{bytesValue:ta(i.serializer,s._byteString)}:(function(l,f){const p=f.toUint8Array(),m=new Uint8Array(p.length+1);return m[0]=f.subtype,m.set(p,1),{mapValue:{fields:{[qi]:{bytesValue:ta(l,ae.fromUint8Array(m))}}}}})(i.serializer,s);if(s instanceof fe){const c=i.databaseId,l=s.firestore._databaseId;if(!l.isEqual(c))throw i.createError(`Document reference is for database ${l.projectId}/${l.database} but should be for database ${c.projectId}/${c.database}`);return{referenceValue:Fa(s.firestore._databaseId||i.databaseId,s._key.path)}}if(s instanceof $e)return(function(l,f){const p=l instanceof $e?l.toArray():l;return{mapValue:{fields:{[Ca]:{stringValue:xa},[Jr]:{arrayValue:{values:p.map((v=>{if(typeof v!="number")throw f.createError("VectorValues must only contain numeric values.");return ka(f.serializer,v)}))}}}}}})(s,i);if(s instanceof Ga)return(function(l){return{mapValue:{fields:{[Wt]:{mapValue:{fields:{[Ti]:{stringValue:l.pattern},[vi]:{stringValue:l.options}}}}}}}})(s);if(s instanceof Ba)return(function(l){return{mapValue:{fields:{[Yr]:{stringValue:l.value}}}}})(s);if(s instanceof Wa)return(function(l){return{mapValue:{fields:{[Cn]:Hn(l.value)}}}})(s);if(s instanceof qa)return(function(l){return{mapValue:{fields:{[en]:{stringValue:l.stringValue}}}}})(s);if(s instanceof $a)return(function(l){return{mapValue:{fields:{[yn]:{mapValue:{fields:{[Ii]:Hn(l.seconds),[Ai]:Hn(l.increment)}}}}}}})(s);if(s instanceof It)return(function(){return{mapValue:{fields:{[Qh]:{nullValue:"NULL_VALUE"}}}}})();if(s instanceof vt)return(function(){return{mapValue:{fields:{[Na]:{nullValue:"NULL_VALUE"}}}}})();if(Df(s))return s._toProto(i.serializer);throw i.createError(`Unsupported field value: ${Pa(s)}`)})(n,e)}function jf(n,e){const t={};return jh(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Sn(n,((r,s)=>{const i=us(s,e.childContextForField(r));i!=null&&(t[r]=i)})),{mapValue:{fields:t}}}function zf(n){if(typeof n!="object"||n===null)return!1;if(typeof Temporal<"u"&&typeof Temporal.Instant=="function"&&n instanceof Temporal.Instant)return!0;const e=n;return e[Symbol.toStringTag]==="Temporal.Instant"&&typeof e.t=="bigint"}function Wf(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof ee||n instanceof pt||n instanceof Ge||n instanceof fe||n instanceof za||n instanceof $e||n instanceof It||n instanceof vt||n instanceof Wa||n instanceof qa||n instanceof Ga||n instanceof Ba||n instanceof $a||zf(n)||Df(n))}function Hf(n,e,t){if(!Wf(t)||!Is(t)){const r=Pa(t);throw r==="an object"?e.createError(n+" a custom object"):e.createError(n+" "+r)}}function Ji(n,e,t){if((e=Xe(e))instanceof ja)return e._internalPath;if(typeof e=="string")return CE(n,e);throw xi("Field path arguments must be of type string or ",n,!1,void 0,t)}const SE=new RegExp("[~\\*/\\[\\]]");function CE(n,e,t){if(e.search(SE)>=0)throw xi(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new ja(...e.split("."))._internalPath}catch{throw xi(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function xi(n,e,t,r,s){const i=r&&!r.isEmpty(),a=s!==void 0;let c=`Function ${e}() called with invalid data`;t&&(c+=" (via `toFirestore()`)"),c+=". ";let l="";return(i||a)&&(l+=" (found",i&&(l+=` in field ${r}`),a&&(l+=` in document ${s}`),l+=")"),new L(x.INVALID_ARGUMENT,c+n+l)}function xE(n,e){return n.some((t=>t.isEqual(e)))}function NE(n){return typeof n._readUserData=="function"}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ke{constructor(e){this.optionDefinitions=e}_getKnownOptions(e,t){const r=He.empty();for(const s in this.optionDefinitions)if(this.optionDefinitions.hasOwnProperty(s)){const i=this.optionDefinitions[s];if(s in e){const a=e[s];let c;i.nestedOptions&&Is(a)?c={mapValue:{fields:new ke(i.nestedOptions).getOptionsProto(t,a)}}:a&&(c=us(a,t)??void 0),c&&r.set(Qe.fromServerFormat(i.serverName),c)}}return r}getOptionsProto(e,t,r){const s=this._getKnownOptions(t,e);if(r){const i=new Map(B_(r,((a,c)=>[Qe.fromServerFormat(c),a!==void 0?us(a,e):null])));s.setAll(i)}return s.value.mapValue.fields??{}}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kE(n){return typeof n=="object"&&n!==null&&!!("nullValue"in n&&(n.nullValue===null||n.nullValue==="NULL_VALUE")||"booleanValue"in n&&(n.booleanValue===null||typeof n.booleanValue=="boolean")||"integerValue"in n&&(n.integerValue===null||typeof n.integerValue=="number"||typeof n.integerValue=="string")||"doubleValue"in n&&(n.doubleValue===null||typeof n.doubleValue=="number")||"timestampValue"in n&&(n.timestampValue===null||(function(t){return typeof t=="object"&&t!==null&&"seconds"in t&&(t.seconds===null||typeof t.seconds=="number"||typeof t.seconds=="string")&&"nanos"in t&&(t.nanos===null||typeof t.nanos=="number")})(n.timestampValue))||"stringValue"in n&&(n.stringValue===null||typeof n.stringValue=="string")||"bytesValue"in n&&(n.bytesValue===null||n.bytesValue instanceof Uint8Array)||"referenceValue"in n&&(n.referenceValue===null||typeof n.referenceValue=="string")||"geoPointValue"in n&&(n.geoPointValue===null||(function(t){return typeof t=="object"&&t!==null&&"latitude"in t&&(t.latitude===null||typeof t.latitude=="number")&&"longitude"in t&&(t.longitude===null||typeof t.longitude=="number")})(n.geoPointValue))||"arrayValue"in n&&(n.arrayValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("values"in t)||t.values!==null&&!Array.isArray(t.values))})(n.arrayValue))||"mapValue"in n&&(n.mapValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("fields"in t)||t.fields!==null&&!Is(t.fields))})(n.mapValue))||"fieldReferenceValue"in n&&(n.fieldReferenceValue===null||typeof n.fieldReferenceValue=="string")||"functionValue"in n&&(n.functionValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("name"in t)||t.name!==null&&typeof t.name!="string"||!("args"in t)||t.args!==null&&!Array.isArray(t.args))})(n.functionValue))||"pipelineValue"in n&&(n.pipelineValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("stages"in t)||t.stages!==null&&!Array.isArray(t.stages))})(n.pipelineValue)))}function WT(){return new Qa("serverTimestamp")}function DE(n){return new $e(n)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function N(n){let e;return n instanceof kn?n:(e=Is(n)?BE(n):n instanceof Array?$E(n):Gf(n,void 0),e)}function Uo(n){if(n instanceof kn)return n;if(n instanceof $e)return ls(n);if(Array.isArray(n))return ls(DE(n));throw new Error("Unsupported value: "+typeof n)}function Xa(n){return G_(n)?ME(n):N(n)}class kn{constructor(){this._protoValueType="ProtoValue"}add(e){return new P("add",[this,N(e)],"add")}asBoolean(){if(this instanceof rn)return this;if(this instanceof lr)return new Qf(this);if(this instanceof Ss)return new FE(this);if(this instanceof P)return new Kf(this);throw new L("invalid-argument",`Conversion of type ${typeof this} to BooleanExpression not supported.`)}subtract(e){return new P("subtract",[this,N(e)],"subtract")}multiply(e){return new P("multiply",[this,N(e)],"multiply")}divide(e){return new P("divide",[this,N(e)],"divide")}mod(e){return new P("mod",[this,N(e)],"mod")}equal(e){return new P("equal",[this,N(e)],"equal").asBoolean()}notEqual(e){return new P("not_equal",[this,N(e)],"notEqual").asBoolean()}lessThan(e){return new P("less_than",[this,N(e)],"lessThan").asBoolean()}lessThanOrEqual(e){return new P("less_than_or_equal",[this,N(e)],"lessThanOrEqual").asBoolean()}greaterThan(e){return new P("greater_than",[this,N(e)],"greaterThan").asBoolean()}greaterThanOrEqual(e){return new P("greater_than_or_equal",[this,N(e)],"greaterThanOrEqual").asBoolean()}arrayConcat(e,...t){const r=[e,...t].map((s=>N(s)));return new P("array_concat",[this,...r],"arrayConcat")}arrayContains(e){return new P("array_contains",[this,N(e)],"arrayContains").asBoolean()}arrayContainsAll(e){const t=Array.isArray(e)?new Or(e.map(N),"arrayContainsAll"):e;return new P("array_contains_all",[this,t],"arrayContainsAll").asBoolean()}arrayContainsAny(e){const t=Array.isArray(e)?new Or(e.map(N),"arrayContainsAny"):e;return new P("array_contains_any",[this,t],"arrayContainsAny").asBoolean()}arrayReverse(){return new P("array_reverse",[this])}arrayLength(){return new P("array_length",[this],"arrayLength")}equalAny(e){const t=Array.isArray(e)?new Or(e.map(N),"equalAny"):e;return new P("equal_any",[this,t],"equalAny").asBoolean()}notEqualAny(e){const t=Array.isArray(e)?new Or(e.map(N),"notEqualAny"):e;return new P("not_equal_any",[this,t],"notEqualAny").asBoolean()}exists(){return new P("exists",[this],"exists").asBoolean()}charLength(){return new P("char_length",[this],"charLength")}like(e){return new P("like",[this,N(e)],"like").asBoolean()}regexContains(e){return new P("regex_contains",[this,N(e)],"regexContains").asBoolean()}regexFind(e){return new P("regex_find",[this,N(e)],"regexFind")}regexFindAll(e){return new P("regex_find_all",[this,N(e)],"regexFindAll")}regexMatch(e){return new P("regex_match",[this,N(e)],"regexMatch").asBoolean()}stringContains(e){return new P("string_contains",[this,N(e)],"stringContains").asBoolean()}startsWith(e){return new P("starts_with",[this,N(e)],"startsWith").asBoolean()}endsWith(e){return new P("ends_with",[this,N(e)],"endsWith").asBoolean()}toLower(){return new P("to_lower",[this],"toLower")}toUpper(){return new P("to_upper",[this],"toUpper")}trim(e){const t=[this];return e&&t.push(N(e)),new P("trim",t,"trim")}ltrim(e){const t=[this];return e&&t.push(N(e)),new P("ltrim",t,"ltrim")}rtrim(e){const t=[this];return e&&t.push(N(e)),new P("rtrim",t,"rtrim")}type(){return new P("type",[this])}isType(e){return new P("is_type",[this,ls(e)],"isType").asBoolean()}stringConcat(e,...t){const r=[e,...t].map(N);return new P("string_concat",[this,...r],"stringConcat")}stringIndexOf(e){return new P("string_index_of",[this,N(e)],"stringIndexOf")}stringRepeat(e){return new P("string_repeat",[this,N(e)],"stringRepeat")}stringReplaceAll(e,t){return new P("string_replace_all",[this,N(e),N(t)],"stringReplaceAll")}stringReplaceOne(e,t){return new P("string_replace_one",[this,N(e),N(t)],"stringReplaceOne")}concat(e,...t){const r=[e,...t].map(N);return new P("concat",[this,...r],"concat")}reverse(){return new P("reverse",[this],"reverse")}arrayFilter(e,t){return new P("array_filter",[this,N(e),t],"arrayFilter")}arrayTransform(e,t){return new P("array_transform",[this,N(e),t],"arrayTransform")}arrayTransformWithIndex(e,t,r){return new P("array_transform",[this,N(e),N(t),r],"arrayTransformWithIndex")}arraySlice(e,t){const r=[this,N(e)];return t!==void 0&&r.push(N(t)),new P("array_slice",r,"arraySlice")}arrayFirst(){return new P("array_first",[this],"arrayFirst")}arrayFirstN(e){return new P("array_first_n",[this,N(e)],"arrayFirstN")}arrayLast(){return new P("array_last",[this],"arrayLast")}arrayLastN(e){return new P("array_last_n",[this,N(e)],"arrayLastN")}arrayMaximum(){return new P("maximum",[this],"arrayMaximum")}arrayMaximumN(e){return new P("maximum_n",[this,N(e)],"arrayMaximumN")}arrayMinimum(){return new P("minimum",[this],"arrayMinimum")}arrayMinimumN(e){return new P("minimum_n",[this,N(e)],"arrayMinimumN")}arrayIndexOf(e){return new P("array_index_of",[this,N(e),N("first")],"arrayIndexOf")}arrayLastIndexOf(e){return new P("array_index_of",[this,N(e),N("last")],"arrayLastIndexOf")}arrayIndexOfAll(e){return new P("array_index_of_all",[this,N(e)],"arrayIndexOfAll")}byteLength(){return new P("byte_length",[this],"byteLength")}ceil(){return new P("ceil",[this])}floor(){return new P("floor",[this])}abs(){return new P("abs",[this])}exp(){return new P("exp",[this])}mapGet(e){return new P("map_get",[this,ls(e)],"mapGet")}mapSet(e,t,...r){const s=[this,N(e),N(t),...r.map(N)];return new P("map_set",s,"mapSet")}mapKeys(){return new P("map_keys",[this],"mapKeys")}mapValues(){return new P("map_values",[this],"mapValues")}mapEntries(){return new P("map_entries",[this],"mapEntries")}getField(e){return new P("get_field",[this,N(e)],"get_field")}count(){return We._create("count",[this],"count")}sum(){return We._create("sum",[this],"sum")}average(){return We._create("average",[this],"average")}minimum(){return We._create("minimum",[this],"minimum")}maximum(){return We._create("maximum",[this],"maximum")}first(){return We._create("first",[this],"first")}last(){return We._create("last",[this],"last")}arrayAgg(){return We._create("array_agg",[this],"arrayAgg")}arrayAggDistinct(){return We._create("array_agg_distinct",[this],"arrayAggDistinct")}countDistinct(){return We._create("count_distinct",[this],"countDistinct")}logicalMaximum(e,...t){const r=[e,...t];return new P("maximum",[this,...r.map(N)],"logicalMaximum")}logicalMinimum(e,...t){const r=[e,...t];return new P("minimum",[this,...r.map(N)],"minimum")}vectorLength(){return new P("vector_length",[this],"vectorLength")}cosineDistance(e){return new P("cosine_distance",[this,Uo(e)],"cosineDistance")}dotProduct(e){return new P("dot_product",[this,Uo(e)],"dotProduct")}euclideanDistance(e){return new P("euclidean_distance",[this,Uo(e)],"euclideanDistance")}unixMicrosToTimestamp(){return new P("unix_micros_to_timestamp",[this],"unixMicrosToTimestamp")}timestampToUnixMicros(){return new P("timestamp_to_unix_micros",[this],"timestampToUnixMicros")}unixMillisToTimestamp(){return new P("unix_millis_to_timestamp",[this],"unixMillisToTimestamp")}timestampToUnixMillis(){return new P("timestamp_to_unix_millis",[this],"timestampToUnixMillis")}unixSecondsToTimestamp(){return new P("unix_seconds_to_timestamp",[this],"unixSecondsToTimestamp")}timestampToUnixSeconds(){return new P("timestamp_to_unix_seconds",[this],"timestampToUnixSeconds")}timestampAdd(e,t){return new P("timestamp_add",[this,N(e),N(t)],"timestampAdd")}timestampSubtract(e,t){return new P("timestamp_subtract",[this,N(e),N(t)],"timestampSubtract")}timestampDiff(e,t){return new P("timestamp_diff",[this,Xa(e),N(t)],"timestampDiff")}timestampExtract(e,t){const r=[this,N(e)];return t&&r.push(N(t)),new P("timestamp_extract",r,"timestampExtract")}documentId(){return new P("document_id",[this],"documentId")}parent(){return new P("parent",[this],"parent")}substring(e,t){const r=N(e);return new P("substring",t===void 0?[this,r]:[this,r,N(t)],"substring")}arrayGet(e){return new P("array_get",[this,N(e)],"arrayGet")}isError(){return new P("is_error",[this],"isError").asBoolean()}ifError(e){const t=new P("if_error",[this,N(e)],"ifError");return e instanceof rn?t.asBoolean():t}isAbsent(){return new P("is_absent",[this],"isAbsent").asBoolean()}mapRemove(e){return new P("map_remove",[this,N(e)],"mapRemove")}mapMerge(e,...t){const r=N(e),s=t.map(N);return new P("map_merge",[this,r,...s],"mapMerge")}pow(e){return new P("pow",[this,N(e)])}trunc(e){return e===void 0?new P("trunc",[this]):new P("trunc",[this,N(e)],"trunc")}round(e){return e===void 0?new P("round",[this]):new P("round",[this,N(e)],"round")}collectionId(){return new P("collection_id",[this])}length(){return new P("length",[this])}ln(){return new P("ln",[this])}sqrt(){return new P("sqrt",[this])}stringReverse(){return new P("string_reverse",[this])}ifAbsent(e){return new P("if_absent",[this,N(e)],"ifAbsent")}ifNull(e){return new P("if_null",[this,N(e)],"ifNull")}coalesce(e,...t){return new P("coalesce",[this,N(e),...t.map(N)],"coalesce")}join(e){return new P("join",[this,N(e)],"join")}log10(){return new P("log10",[this])}arraySum(){return new P("sum",[this])}split(e){return new P("split",[this,N(e)])}timestampTruncate(e,t){const r=[this,N(e)];return t&&r.push(N(t)),new P("timestamp_trunc",r)}ascending(){return qE(this)}descending(){return jE(this)}as(e){return new LE(this,e,"as")}}class We{constructor(e,t){this.name=e,this.params=t,this.exprType="AggregateFunction",this._protoValueType="ProtoValue"}static _create(e,t,r){const s=new We(e,t);return s._methodName=r,s}as(e){return new OE(this,e,"as")}_toProto(e){return{functionValue:{name:this.name,args:this.params.map((t=>t._toProto(e)))}}}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,this.params.forEach((t=>t._readUserData(e)))}}class OE{constructor(e,t,r){this.aggregate=e,this.alias=t,this._methodName=r}_readUserData(e){this.aggregate._readUserData(e)}}class LE{constructor(e,t,r){this.expr=e,this.alias=t,this._methodName=r,this.exprType="AliasedExpression",this.selectable=!0}_readUserData(e){this.expr._readUserData(e)}}class Or extends kn{constructor(e,t){super(),this.fi=e,this._methodName=t,this.expressionType="ListOfExpressions"}_toProto(e){return{arrayValue:{values:this.fi.map((t=>t._toProto(e)))}}}_readUserData(e){this.fi.forEach((t=>t._readUserData(e)))}}class Ss extends kn{constructor(e,t){super(),this.fieldPath=e,this._methodName=t,this.expressionType="Field",this.selectable=!0}get _fieldPath(){return this.fieldPath}get fieldName(){return this.fieldPath.canonicalString()}get alias(){return this.fieldName}get expr(){return this}geoDistance(e){return new P("geo_distance",[this,N(e)],"geoDistance")}_toProto(e){return{fieldReferenceValue:this.fieldPath.canonicalString()}}_readUserData(e){}}function ME(n){return UE(n,"field")}function UE(n,e){return new Ss(typeof n=="string"?Yn===n?Xy()._internalPath:Ji("field",n):n._internalPath,e)}class lr extends kn{constructor(e,t){super(),this.value=e,this._methodName=t,this.expressionType="Constant"}static _fromProto(e){const t=new lr(e,void 0);return t._protoValue=e,t}_toProto(e){return U(this._protoValue!==void 0,237),this._protoValue}_getValue(){return this._protoValue}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,kE(this._protoValue)||(this._protoValue=us(this.value,e))}}function ls(n,e){return Gf(n,"constant")}function Gf(n,e){const t=new lr(n,e);return typeof n=="boolean"?new Qf(t):t}class P extends kn{constructor(e,t,r,s){super(),this.name=e,this.params=t,this.expressionType="Function",this._optionsProto=void 0,r!==void 0&&(this._methodName=r),s!==void 0&&(this._options=s)}get _optionsUtil(){return new ke({})}_toProto(e){const t={functionValue:{name:this.name,args:this.params.map((r=>r._toProto(e)))}};return this._optionsProto&&(t.functionValue.options=this._optionsProto),t}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,this.params.forEach((t=>t._readUserData(e))),this._options&&(this._optionsProto=this._optionsUtil.getOptionsProto(e,this._options))}}class rn extends kn{get _methodName(){return this._expr._methodName}countIf(){return We._create("count_if",[this],"countIf")}not(){return new P("not",[this],"not").asBoolean()}conditional(e,t){return new P("conditional",[this,e,t],"conditional")}ifError(e){const t=N(e),r=new P("if_error",[this,t],"ifError");return t instanceof rn?r.asBoolean():r}_toProto(e){return this._expr._toProto(e)}_readUserData(e){this._expr._readUserData(e)}}class Kf extends rn{constructor(e){super(),this._expr=e,this.expressionType="Function"}}class Qf extends rn{constructor(e){super(),this._expr=e,this.expressionType="Constant"}_getValue(){return this._expr._getValue()}}class FE extends rn{constructor(e){super(),this._expr=e,this.expressionType="Field"}}function BE(n,e){const t=[];for(const r in n)if(Object.prototype.hasOwnProperty.call(n,r)){const s=n[r];t.push(ls(r)),t.push(N(s))}return new P("map",t,"map")}function $E(n){return(function(t,r){return new P("array",t.map((s=>N(s))),r)})(n,"array")}function qE(n){return new Xf(Xa(n),"ascending","ascending")}function jE(n){return new Xf(Xa(n),"descending","descending")}class Xf{constructor(e,t,r){this.expr=e,this.direction=t,this._methodName=r,this._protoValueType="ProtoValue"}_toProto(e){return{mapValue:{fields:{direction:Of(this.direction),expression:this.expr._toProto(e)}}}}_readUserData(e){this.expr._readUserData(e)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Je{constructor(e){this.optionsProto=void 0,{rawOptions:this.rawOptions,...this.knownOptions}=e}_readUserData(e){this.optionsProto=this._optionsUtil.getOptionsProto(e,this.knownOptions,this.rawOptions)}_toProto(e){return{name:this._name,options:this.optionsProto}}}class Jf extends Je{get _name(){return"add_fields"}get _optionsUtil(){return new ke({})}constructor(e,t){super(t),this.fields=e}_toProto(e){return{...super._toProto(e),args:[as(e,this.fields)]}}_readUserData(e){super._readUserData(e),sn(this.fields,e)}}class Yf extends Je{get _name(){return"aggregate"}get _optionsUtil(){return new ke({})}constructor(e,t,r){super(r),this.groups=e,this.accumulators=t}_toProto(e){return{...super._toProto(e),args:[as(e,this.accumulators),as(e,this.groups)]}}_readUserData(e){super._readUserData(e),sn(this.groups,e),sn(this.accumulators,e)}}class Zf extends Je{get _name(){return"distinct"}get _optionsUtil(){return new ke({})}constructor(e,t){super(t),this.groups=e}_toProto(e){return{...super._toProto(e),args:[as(e,this.groups)]}}_readUserData(e){super._readUserData(e),sn(this.groups,e)}}class Yi extends Je{get _name(){return"collection"}get _optionsUtil(){return new ke({forceIndex:{serverName:"force_index"}})}constructor(e,t){super(t),this.pi=e.startsWith("/")?e:"/"+e}_toProto(e){return{...super._toProto(e),args:[{referenceValue:this.pi}]}}_readUserData(e){super._readUserData(e)}}class Zi extends Je{get _name(){return"collection_group"}get _optionsUtil(){return new ke({forceIndex:{serverName:"force_index"}})}constructor(e,t){super(t),this.collectionId=e}_toProto(e){return{...super._toProto(e),args:[{referenceValue:""},{stringValue:this.collectionId}]}}_readUserData(e){super._readUserData(e)}}class Ja extends Je{get _name(){return"database"}get _optionsUtil(){return new ke({})}_toProto(e){return{...super._toProto(e)}}_readUserData(e){super._readUserData(e)}}class Ya extends Je{get _name(){return"documents"}get _optionsUtil(){return new ke({})}constructor(e,t){if(super(t),!e||e.length===0)throw new L(x.INVALID_ARGUMENT,"Empty document paths are not allowed in DocumentsSource");const r=e.map((i=>i.startsWith("/")?i:"/"+i)),s=new Set(r);if(s.size!==r.length)throw new L(x.INVALID_ARGUMENT,"Duplicate document paths are not allowed in DocumentsSource");this.gi=r,this.yi=s}_toProto(e){return{...super._toProto(e),args:this.gi.map((t=>({referenceValue:t})))}}_readUserData(e){super._readUserData(e)}}class Za extends Je{get _name(){return"where"}get _optionsUtil(){return new ke({})}constructor(e,t){super(t),this.condition=e}_toProto(e){return{...super._toProto(e),args:[this.condition._toProto(e)]}}_readUserData(e){super._readUserData(e),sn(this.condition,e)}}class hs extends Je{get _name(){return"limit"}get _optionsUtil(){return new ke({})}constructor(e,t){U(!isNaN(e)&&e!==1/0&&e!==-1/0,34860),super(t),this.limit=e}_toProto(e){return{...super._toProto(e),args:[Da(e,this.limit)]}}}class Sl extends Je{get _name(){return"offset"}get _optionsUtil(){return new ke({})}constructor(e,t){super(t),this.offset=e}_toProto(e){return{...super._toProto(e),args:[Da(e,this.offset)]}}}class zE extends Je{get _name(){return"select"}get _optionsUtil(){return new ke({})}constructor(e,t){super(t),this.selections=e}_toProto(e){return{...super._toProto(e),args:[as(e,this.selections)]}}_readUserData(e){super._readUserData(e),sn(this.selections,e)}}class ec extends Je{get _name(){return"sort"}get _optionsUtil(){return new ke({})}constructor(e,t){super(t),this.orderings=e}_toProto(e){return{...super._toProto(e),args:this.orderings.map((t=>t._toProto(e)))}}_readUserData(e){super._readUserData(e),sn(this.orderings,e)}}class tc extends Je{get _name(){return"replace_with"}get _optionsUtil(){return new ke({})}constructor(e,t){super(t),this.map=e}_toProto(e){return{...super._toProto(e),args:[this.map._toProto(e),Of(tc.wi)]}}_readUserData(e){super._readUserData(e),sn(this.map,e)}}tc.wi="full_replace";function sn(n,e){return NE(n)?n._readUserData(e):Array.isArray(n)?n.forEach((t=>t._readUserData(e))):n instanceof Map?n.forEach((t=>t._readUserData(e))):Object.values(n).forEach((t=>t._readUserData(e))),n}// Copyright 2024 Google LLC* @license
class Fe{constructor(e,t,r){this.serializer=e,this.stages=t,this.listenOptions=r,this.isCorePipeline=!0}getPipelineCollection(){return eo(this)}getPipelineCollectionGroup(){return nc(this)}getPipelineCollectionId(){return WE(this)}getPipelineDocuments(){return ia(this)}getPipelineFlavor(){return(function(t){let r="exact";return t.stages.forEach(((s,i)=>{s._name!==Zf.name&&s._name!==Yf.name||(r="keyless"),s._name===zE.name&&r==="exact"&&(r="augmented"),s._name===Jf.name&&i<t.stages.length-1&&r==="exact"&&(r="augmented")})),r})(this)}getPipelineSourceType(){return Jt(this)}}function Jt(n){const e=n.stages[0];return e instanceof Yi||e instanceof Zi||e instanceof Ja||e instanceof Ya?e._name:"unknown"}function eo(n){if(Jt(n)==="collection")return n.stages[0].pi}function nc(n){if(Jt(n)==="collection_group")return n.stages[0].collectionId}function WE(n){switch(Jt(n)){case"collection":return te.fromString(eo(n)).lastSegment();case"collection_group":return nc(n);default:return}}function ia(n){if(Jt(n)==="documents")return n.stages[0].gi}class E{constructor(e,t){this.type=e,this.value=t}static Ci(){return new E("ERROR",void 0)}static Fi(){return new E("UNSET",void 0)}static Oi(){return new E("NULL",er)}static newValue(e){return Ke(e)?new E("NULL",er):(function(r){return!!r&&"booleanValue"in r})(e)?new E("BOOLEAN",e):ut(e)?new E("INT",e):lt(e)?new E("DOUBLE",e):(function(r){return!!r&&"timestampValue"in r&&!!r.timestampValue})(e)?new E("TIMESTAMP",e):(function(r){return!!r&&"stringValue"in r})(e)?new E("STRING",e):(function(r){return!!r&&"bytesValue"in r})(e)?new E("BYTES",e):e.referenceValue?new E("REFERENCE",e):e.geoPointValue?new E("GEO_POINT",e):nr(e)?new E("ARRAY",e):Xo(e)?new E("VECTOR",e):wn(e)?new E("MAP",e):new E("ERROR",void 0)}Mi(){return this.type==="ERROR"||this.type==="UNSET"}Ni(){return this.type==="NULL"}}function zr(n){if(!n.Mi())return n.value}function ed(n){return n instanceof rn?n._expr:n}function j(n){if((n=ed(n))instanceof Ss)return new HE(n);if(n instanceof lr)return new GE(n);if(n instanceof Or)return new KE(n);if(n instanceof P){if(n.name==="add")return new JE(n);if(n.name==="subtract")return new YE(n);if(n.name==="multiply")return new ZE(n);if(n.name==="divide")return new e0(n);if(n.name==="mod")return new t0(n);if(n.name==="and")return new n0(n);if(n.name==="equal")return new p0(n);if(n.name==="not_equal")return new m0(n);if(n.name==="less_than")return new g0(n);if(n.name==="less_than_or_equal")return new _0(n);if(n.name==="greater_than")return new y0(n);if(n.name==="greater_than_or_equal")return new E0(n);if(n.name==="array_concat")return new w0(n);if(n.name==="array_reverse")return new T0(n);if(n.name==="array_contains")return new v0(n);if(n.name==="array_contains_all")return new I0(n);if(n.name==="array_contains_any")return new A0(n);if(n.name==="array_length")return new b0(n);if(n.name==="array_element")return new R0(n);if(n.name==="equal_any")return new td(n);if(n.name==="not_equal_any")return new s0(n);if(n.name==="is_nan")return new i0(n);if(n.name==="is_not_nan")return new o0(n);if(n.name==="is_null")return new a0(n);if(n.name==="is_not_null")return new c0(n);if(n.name==="is_error")return new u0(n);if(n.name==="exists")return new l0(n);if(n.name==="not")return new to(n);if(n.name==="or")return new r0(n);if(n.name==="xor")return new rc(n);if(n.name==="conditional")return new h0(n);if(n.name==="maximum")return new f0(n);if(n.name==="minimum")return new d0(n);if(n.name==="reverse")return new P0(n);if(n.name==="replace_first")return new V0(n);if(n.name==="replace_all")return new S0(n);if(n.name==="char_length")return new C0(n);if(n.name==="byte_length")return new x0(n);if(n.name==="like")return new N0(n);if(n.name==="regex_contains")return new k0(n);if(n.name==="regex_match")return new D0(n);if(n.name==="string_contains")return new O0(n);if(n.name==="starts_with")return new L0(n);if(n.name==="ends_with")return new M0(n);if(n.name==="to_lower")return new U0(n);if(n.name==="to_upper")return new F0(n);if(n.name==="trim")return new B0(n);if(n.name==="string_concat")return new $0(n);if(n.name==="map_get")return new q0(n);if(n.name==="cosine_distance")return new j0(n);if(n.name==="dot_product")return new z0(n);if(n.name==="euclidean_distance")return new W0(n);if(n.name==="vector_length")return new H0(n);if(n.name==="unix_micros_to_timestamp")return new J0(n);if(n.name==="timestamp_to_unix_micros")return new ew(n);if(n.name==="unix_millis_to_timestamp")return new Y0(n);if(n.name==="timestamp_to_unix_millis")return new tw(n);if(n.name==="unix_seconds_to_timestamp")return new Z0(n);if(n.name==="timestamp_to_unix_seconds")return new nw(n);if(n.name==="timestamp_add")return new rw(n);if(n.name==="timestamp_subtract")return new sw(n)}throw new Error(`Unknown Expr : ${n}`)}class HE{constructor(e){this.expr=e}evaluate(e,t){if(this.expr.fieldName===Yn)return E.newValue({referenceValue:Ci(e.serializer,t.key)});if(this.expr.fieldName==="__update_time__")return E.newValue({timestampValue:hi(e.serializer,t.version)});if(this.expr.fieldName==="__create_time__")return E.newValue({timestampValue:hi(e.serializer,t.createTime)});const r=t.data.field(this.expr._fieldPath);return r?Va(r)?E.newValue((function(i,a){if(i.serverTimestampBehavior==="estimate")return{timestampValue:hi(i.serializer,W.fromTimestamp(Zn(a)))};if(i.serverTimestampBehavior==="previous"){const c=bs(a);if(c)return c}return{nullValue:"NULL_VALUE"}})(e,r)):E.newValue(r):E.Fi()}}class GE{constructor(e){this.expr=e}evaluate(e,t){return E.newValue(this.expr._getValue())}}class KE{constructor(e){this.expr=e}evaluate(e,t){const r=this.expr.fi.map((s=>j(s).evaluate(e,t)));return r.some((s=>s.Mi()))?E.Ci():E.newValue({arrayValue:{values:r.map((s=>s.value))}})}}function Pe(n){return lt(n)?Number(n.doubleValue):Number(n.integerValue)}function _t(n){return BigInt(n.integerValue)}const QE=BigInt("0x7fffffffffffffff"),XE=-BigInt("0x8000000000000000");class Cs{constructor(e){this.expr=e}evaluate(e,t){U(this.expr.params.length>=2,24778);const r=j(this.expr.params[0]).evaluate(e,t),s=j(this.expr.params[1]).evaluate(e,t);let i=this.Bi(r,s);for(const a of this.expr.params.slice(2)){const c=j(a).evaluate(e,t);i=this.Bi(i,c)}return i}Bi(e,t){if(e.Mi()||t.Mi())return E.Ci();if(e.Ni()||t.Ni())return E.Oi();const r=e.value,s=t.value;if(!lt(r)&&!ut(r)||!lt(s)&&!ut(s))return E.Ci();if(lt(r)||lt(s)){const i=this.Li(r,s);return i?E.newValue(i):E.Ci()}if(ut(r)&&ut(s)){const i=this.Ui(r,s);return i===void 0?E.Ci():typeof i=="number"?E.newValue({doubleValue:i}):i<XE||i>QE?E.Ci():E.newValue({integerValue:`${i}`})}return E.Ci()}}function xt(n,e){return pe(n)!==pe(e)?"TYPE_MISMATCH":Ae(n)||Ae(e)?"NOT_EQ":Ke(n)&&Ke(e)?"EQ":Ke(n)||Ke(e)?"NULL":nr(n)&&nr(e)?(function(r,s){var a,c,l;if(((a=r.values)==null?void 0:a.length)!==((c=s.values)==null?void 0:c.length))return"NOT_EQ";let i=!1;for(let f=0;f<(((l=r.values)==null?void 0:l.length)??0);f++){const p=r.values[f],m=s.values[f];switch(xt(p,m)){case"EQ":break;case"NOT_EQ":case"TYPE_MISMATCH":return"NOT_EQ";case"NULL":i=!0;break;default:B(44609,{ki:p,Qi:m})}}return i?"NULL":"EQ"})(n.arrayValue,e.arrayValue):Xo(n)&&Xo(e)||wn(n)&&wn(e)?(function(r,s){const i=r.fields||{},a=s.fields||{};if(Pn(i)!==Pn(a))return"NOT_EQ";let c=!1;for(const l in i)if(i.hasOwnProperty(l)){if(a[l]===void 0)return"NOT_EQ";switch(xt(i[l],a[l])){case"NOT_EQ":case"TYPE_MISMATCH":return"NOT_EQ";case"NULL":c=!0}}return c?"NULL":"EQ"})(n.mapValue,e.mapValue):(function(r,s){return et(r,s,{be:!1,ye:!0,we:!0})})(n,e)?"EQ":"NOT_EQ"}class JE extends Cs{Ui(e,t){return _t(e)+_t(t)}Li(e,t){return{doubleValue:Pe(e)+Pe(t)}}}class YE extends Cs{constructor(e){super(e),this.expr=e}Ui(e,t){return _t(e)-_t(t)}Li(e,t){return{doubleValue:Pe(e)-Pe(t)}}}class ZE extends Cs{constructor(e){super(e),this.expr=e}Ui(e,t){return _t(e)*_t(t)}Li(e,t){return{doubleValue:Pe(e)*Pe(t)}}}class e0 extends Cs{constructor(e){super(e),this.expr=e}Ui(e,t){const r=_t(t);if(r!==BigInt(0))return _t(e)/r}Li(e,t){const r=Pe(t);return r===0?{doubleValue:Xr(r)?Number.NEGATIVE_INFINITY:Number.POSITIVE_INFINITY}:{doubleValue:Pe(e)/r}}}class t0 extends Cs{constructor(e){super(e),this.expr=e}Ui(e,t){const r=_t(t);if(r!==BigInt(0))return _t(e)%r}Li(e,t){const r=Pe(t);if(r!==0)return{doubleValue:Pe(e)%r}}}class n0{constructor(e){this.expr=e}evaluate(e,t){var i;let r=!1,s=!1;for(const a of this.expr.params){const c=j(a).evaluate(e,t);switch(c.type){case"BOOLEAN":if(!((i=c.value)!=null&&i.booleanValue))return E.newValue(Ie);break;case"NULL":s=!0;break;default:r=!0}}return r?E.Ci():s?E.Oi():E.newValue(qe)}}class to{constructor(e){this.expr=e}evaluate(e,t){var s;U(this.expr.params.length===1,9634);const r=j(this.expr.params[0]).evaluate(e,t);switch(r.type){case"BOOLEAN":return E.newValue({booleanValue:!((s=r.value)!=null&&s.booleanValue)});case"NULL":return E.Oi();default:return E.Ci()}}}class r0{constructor(e){this.expr=e}evaluate(e,t){var i;let r=!1,s=!1;for(const a of this.expr.params){const c=j(a).evaluate(e,t);switch(c.type){case"BOOLEAN":if((i=c.value)!=null&&i.booleanValue)return E.newValue(qe);break;case"NULL":s=!0;break;default:r=!0}}return r?E.Ci():s?E.Oi():E.newValue(Ie)}}class rc{constructor(e){this.expr=e}evaluate(e,t){var i;let r=!1,s=!1;for(const a of this.expr.params){const c=j(a).evaluate(e,t);switch(c.type){case"BOOLEAN":r=rc.xor(r,!!((i=c.value)!=null&&i.booleanValue));break;case"NULL":s=!0;break;default:return E.Ci()}}return s?E.Oi():E.newValue({booleanValue:r})}static xor(e,t){return(e||t)&&!(e&&t)}}class td{constructor(e){this.expr=e}evaluate(e,t){var a,c;U(this.expr.params.length===2,55094);let r=!1;const s=j(this.expr.params[0]).evaluate(e,t);switch(s.type){case"NULL":r=!0;break;case"ERROR":case"UNSET":return E.Ci()}const i=j(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":r=!0;break;default:return E.Ci()}if(r)return E.Oi();for(const l of((c=(a=i.value)==null?void 0:a.arrayValue)==null?void 0:c.values)??[])switch(Ke(s.value)&&Ke(l)?"EQ":xt(s.value,l)){case"EQ":return E.newValue(qe);case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":r=!0;break;default:B(44608,{value:s.value,candidate:l})}return r?E.Oi():E.newValue(Ie)}}class s0{constructor(e){this.expr=e}evaluate(e,t){return new to(new P("not",[new P("equal_any",this.expr.params)])).evaluate(e,t)}}class i0{constructor(e){this.expr=e}evaluate(e,t){U(this.expr.params.length===1,23322);const r=j(this.expr.params[0]).evaluate(e,t);switch(r.type){case"INT":return E.newValue(Ie);case"DOUBLE":return E.newValue({booleanValue:isNaN(Pe(r.value))});case"NULL":return E.Oi();default:return E.Ci()}}}class o0{constructor(e){this.expr=e}evaluate(e,t){return U(this.expr.params.length===1,50406),new to(new P("not",[new P("is_nan",this.expr.params)])).evaluate(e,t)}}class a0{constructor(e){this.expr=e}evaluate(e,t){switch(U(this.expr.params.length===1,23123),j(this.expr.params[0]).evaluate(e,t).type){case"NULL":return E.newValue(qe);case"UNSET":case"ERROR":return E.Ci();default:return E.newValue(Ie)}}}class c0{constructor(e){this.expr=e}evaluate(e,t){return U(this.expr.params.length===1,23167),new to(new P("not",[new P("is_null",this.expr.params)])).evaluate(e,t)}}class u0{constructor(e){this.expr=e}evaluate(e,t){return U(this.expr.params.length===1,5228),j(this.expr.params[0]).evaluate(e,t).type==="ERROR"?E.newValue(qe):E.newValue(Ie)}}class l0{constructor(e){this.expr=e}evaluate(e,t){switch(U(this.expr.params.length===1,6877),j(this.expr.params[0]).evaluate(e,t).type){case"ERROR":return E.Ci();case"UNSET":return E.newValue(Ie);default:return E.newValue(qe)}}}class h0{constructor(e){this.expr=e}evaluate(e,t){var s;U(this.expr.params.length===3,11706);const r=j(this.expr.params[0]).evaluate(e,t);switch(r.type){case"BOOLEAN":return(s=r.value)!=null&&s.booleanValue?j(this.expr.params[1]).evaluate(e,t):j(this.expr.params[2]).evaluate(e,t);case"NULL":return j(this.expr.params[2]).evaluate(e,t);default:return E.Ci()}}}class f0{constructor(e){this.expr=e}evaluate(e,t){const r=this.expr.params.map((i=>j(i).evaluate(e,t)));let s;for(const i of r)switch(i.type){case"ERROR":case"UNSET":case"NULL":continue;default:s=s===void 0||je(i.value,s.value)>0?i:s}return s===void 0?E.Oi():s}}class d0{constructor(e){this.expr=e}evaluate(e,t){const r=this.expr.params.map((i=>j(i).evaluate(e,t)));let s;for(const i of r)switch(i.type){case"ERROR":case"UNSET":case"NULL":continue;default:s=s===void 0||je(i.value,s.value)<0?i:s}return s===void 0?E.Oi():s}}class hr{constructor(e){this.expr=e}evaluate(e,t){U(this.expr.params.length===2,31033,`${this.expr.name}() function should have exactly 2 params`);const r=j(this.expr.params[0]).evaluate(e,t);switch(r.type){case"ERROR":case"UNSET":return E.Ci()}const s=j(this.expr.params[1]).evaluate(e,t);switch(s.type){case"ERROR":case"UNSET":return E.Ci()}return this.qi(r,s)}}class p0 extends hr{constructor(e){super(e),this.expr=e}qi(e,t){if(e.Ni()&&t.Ni())return E.newValue(qe);if(e.Ni()||t.Ni()||Ae(e.value)||Ae(t.value)||pe(e.value)!==pe(t.value))return E.newValue(Ie);switch(xt(e.value,t.value)){case"EQ":return E.newValue(qe);case"NOT_EQ":return E.newValue(Ie);case"NULL":return E.Oi();default:B(44615,{left:e,right:t})}}}class m0 extends hr{constructor(e){super(e),this.expr=e}qi(e,t){switch(xt(e.value,t.value)){case"EQ":return E.newValue(Ie);case"NOT_EQ":case"TYPE_MISMATCH":return E.newValue(qe);case"NULL":return E.Oi();default:B(44614,{left:e,right:t})}}}class g0 extends hr{constructor(e){super(e),this.expr=e}qi(e,t){return pe(e.value)!==pe(t.value)||Ae(e.value)||Ae(t.value)?E.newValue(Ie):E.newValue({booleanValue:je(e.value,t.value)<0})}}class _0 extends hr{constructor(e){super(e),this.expr=e}qi(e,t){return pe(e.value)!==pe(t.value)||Ae(e.value)||Ae(t.value)?E.newValue(Ie):xt(e.value,t.value)==="EQ"?E.newValue(qe):E.newValue({booleanValue:je(e.value,t.value)<0})}}class y0 extends hr{constructor(e){super(e),this.expr=e}qi(e,t){return pe(e.value)!==pe(t.value)||Ae(e.value)||Ae(t.value)?E.newValue(Ie):E.newValue({booleanValue:je(e.value,t.value)>0})}}class E0 extends hr{constructor(e){super(e),this.expr=e}qi(e,t){return pe(e.value)!==pe(t.value)||Ae(e.value)||Ae(t.value)?E.newValue(Ie):xt(e.value,t.value)==="EQ"?E.newValue(qe):E.newValue({booleanValue:je(e.value,t.value)>0})}}class w0{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class T0{constructor(e){this.expr=e}evaluate(e,t){var s;U(this.expr.params.length===1,216);const r=j(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return E.Oi();case"ARRAY":{const i=((s=r.value.arrayValue)==null?void 0:s.values)??[];return E.newValue({arrayValue:{values:[...i].reverse()}})}default:return E.Ci()}}}class v0{constructor(e){this.expr=e}evaluate(e,t){return U(this.expr.params.length===2,52884),new td(new P("eq_any",[this.expr.params[1],this.expr.params[0]])).evaluate(e,t)}}class I0{constructor(e){this.expr=e}evaluate(e,t){var l,f,p,m;U(this.expr.params.length===2,1392);let r=!1;const s=j(this.expr.params[0]).evaluate(e,t);switch(s.type){case"ARRAY":break;case"NULL":r=!0;break;default:return E.Ci()}const i=j(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":r=!0;break;default:return E.Ci()}if(r)return E.Oi();const a=((f=(l=i.value)==null?void 0:l.arrayValue)==null?void 0:f.values)??[],c=((m=(p=s.value)==null?void 0:p.arrayValue)==null?void 0:m.values)??[];for(const v of a){let V=!1;r=!1;for(const C of c){switch(Ke(v)&&Ke(C)?"EQ":xt(v,C)){case"EQ":V=!0;break;case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":r=!0;break;default:B(44613,{value:C,search:v})}if(V)break}if(!V)return E.newValue(Ie)}return E.newValue(qe)}}class A0{constructor(e){this.expr=e}evaluate(e,t){var l,f,p,m;U(this.expr.params.length===2,2680);let r=!1;const s=j(this.expr.params[0]).evaluate(e,t);switch(s.type){case"ARRAY":break;case"NULL":r=!0;break;default:return E.Ci()}const i=j(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":r=!0;break;default:return E.Ci()}if(r)return E.Oi();const a=((f=(l=i.value)==null?void 0:l.arrayValue)==null?void 0:f.values)??[],c=((m=(p=s.value)==null?void 0:p.arrayValue)==null?void 0:m.values)??[];for(const v of c)for(const V of a)switch(Ke(v)&&Ke(V)?"EQ":xt(v,V)){case"EQ":return E.newValue(qe);case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":r=!0;break;default:B(60403,{value:v,search:V})}return r?E.Oi():E.newValue(Ie)}}class b0{constructor(e){this.expr=e}evaluate(e,t){var s,i,a;U(this.expr.params.length===1,38605);const r=j(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return E.Oi();case"ARRAY":return E.newValue({integerValue:`${((a=(i=(s=r.value)==null?void 0:s.arrayValue)==null?void 0:i.values)==null?void 0:a.length)??0}`});default:return E.Ci()}}}class R0{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class P0{constructor(e){this.expr=e}evaluate(e,t){var s,i;U(this.expr.params.length===1,1508);const r=j(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return E.Oi();case"BYTES":{const a=(s=r.value)==null?void 0:s.bytesValue;if(typeof a=="string"){const c=ae.fromBase64String(a).toUint8Array();return c.reverse(),E.newValue({bytesValue:ae.fromUint8Array(c).toBase64()})}return E.newValue({bytesValue:new Uint8Array(a).reverse()})}case"STRING":{const a=(i=r.value)==null?void 0:i.stringValue,c=new Intl.__PRIVATE_Segmenter(void 0,{granularity:"grapheme"}).segment(a),l=Array.from(c,(f=>f.segment)).reverse();return E.newValue({stringValue:l.join("")})}default:return E.Ci()}}}class V0{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class S0{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class C0{constructor(e){this.expr=e}evaluate(e,t){U(this.expr.params.length===1,19400);const r=j(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return E.Oi();case"STRING":{const s=(function(a){let c=0;for(let l=0;l<a.length;l++){const f=a.codePointAt(l);if(f===void 0)return;if(f<=65535)if(f>=55296&&f<=57343)if(f<=56319){const p=a.codePointAt(l+1);p!==void 0&&p>=56320&&p<=57343?(c+=1,l++):c+=1}else c+=1;else c+=1;else{if(!(f<=1114111))return;c+=1,l++}}return c})(r.value.stringValue);return s===void 0?E.Ci():E.newValue({integerValue:s})}default:return E.Ci()}}}class x0{constructor(e){this.expr=e}evaluate(e,t){var s,i;U(this.expr.params.length===1,8486);const r=j(this.expr.params[0]).evaluate(e,t);switch(r.type){case"BYTES":{const a=(s=r.value)==null?void 0:s.bytesValue;return typeof a=="string"?E.newValue({integerValue:ae.fromBase64String(a).toUint8Array().length}):E.newValue({integerValue:new Uint8Array(a).length})}case"STRING":{const a=(function(l){let f=0;for(let p=0;p<l.length;p++){const m=l.codePointAt(p);if(m===void 0)return;if(m>=55296&&m<=57343){if(!(m<=56319))return;{const v=l.codePointAt(p+1);if(v===void 0||!(v>=56320&&v<=57343))return;f+=4,p++}}else if(m<=127)f+=1;else if(m<=2047)f+=2;else if(m<=65535)f+=3;else{if(!(m<=1114111))return;f+=4,p++}}return f})((i=r.value)==null?void 0:i.stringValue);return a===void 0?E.Ci():E.newValue({integerValue:a})}case"NULL":return E.Oi();default:return E.Ci()}}}class fr{constructor(e){this.expr=e}evaluate(e,t){var a,c;U(this.expr.params.length===2,39773,`${this.expr.name}() function should have exactly two parameters`);let r=!1;const s=j(this.expr.params[0]).evaluate(e,t);switch(s.type){case"STRING":break;case"NULL":r=!0;break;default:return E.Ci()}const i=j(this.expr.params[1]).evaluate(e,t);switch(i.type){case"STRING":break;case"NULL":r=!0;break;default:return E.Ci()}return r?E.Oi():this.Ki((a=s.value)==null?void 0:a.stringValue,(c=i.value)==null?void 0:c.stringValue)}}class N0 extends fr{Ki(e,t){try{const r=(function(a){let c="";for(let l=0;l<a.length;l++){const f=a.charAt(l);switch(f){case"_":c+=".";break;case"%":c+=".*";break;case"\\":case".":case"*":case"?":case"+":case"^":case"$":case"|":case"(":case")":case"[":case"]":case"{":case"}":c+="\\"+f;break;default:c+=f}}return"^"+c+"$"})(t),s=da.compile(r);return E.newValue({booleanValue:s.matches(e)})}catch(r){return it(`Invalid LIKE pattern converted to regex: ${t}, returning error. Error: ${r}`),E.Ci()}}}class k0 extends fr{Ki(e,t){try{const r=da.compile(t);return E.newValue({booleanValue:r.test(e)})}catch{return it(`Invalid regex pattern found in regex_contains: ${t}, returning error`),E.Ci()}}}class D0 extends fr{Ki(e,t){try{return E.newValue({booleanValue:da.compile(t).matches(e)})}catch{return it(`Invalid regex pattern found in regex_match: ${t}, returning error`),E.Ci()}}}class O0 extends fr{Ki(e,t){return E.newValue({booleanValue:e.includes(t)})}}class L0 extends fr{Ki(e,t){return E.newValue({booleanValue:e.startsWith(t)})}}class M0 extends fr{Ki(e,t){return E.newValue({booleanValue:e.endsWith(t)})}}class U0{constructor(e){this.expr=e}evaluate(e,t){var s,i;U(this.expr.params.length===1,29079);const r=j(this.expr.params[0]).evaluate(e,t);switch(r.type){case"STRING":return E.newValue({stringValue:(i=(s=r.value)==null?void 0:s.stringValue)==null?void 0:i.toLowerCase()});case"NULL":return E.Oi();default:return E.Ci()}}}class F0{constructor(e){this.expr=e}evaluate(e,t){var s,i;U(this.expr.params.length===1,60487);const r=j(this.expr.params[0]).evaluate(e,t);switch(r.type){case"STRING":return E.newValue({stringValue:(i=(s=r.value)==null?void 0:s.stringValue)==null?void 0:i.toUpperCase()});case"NULL":return E.Oi();default:return E.Ci()}}}class B0{constructor(e){this.expr=e}evaluate(e,t){var s,i;U(this.expr.params.length===1,28544);const r=j(this.expr.params[0]).evaluate(e,t);switch(r.type){case"STRING":return E.newValue({stringValue:(i=(s=r.value)==null?void 0:s.stringValue)==null?void 0:i.trim()});case"NULL":return E.Oi();default:return E.Ci()}}}class $0{constructor(e){this.expr=e}evaluate(e,t){const r=this.expr.params.map((a=>j(a).evaluate(e,t)));let s="",i=!1;for(const a of r)switch(a.type){case"STRING":s+=a.value.stringValue;break;case"NULL":i=!0;break;default:return E.Ci()}return i?E.Oi():E.newValue({stringValue:s})}}class q0{constructor(e){this.expr=e}evaluate(e,t){var a,c,l,f;U(this.expr.params.length===2,4483);const r=j(this.expr.params[0]).evaluate(e,t);switch(r.type){case"UNSET":return E.Fi();case"MAP":break;default:return E.Ci()}const s=j(this.expr.params[1]).evaluate(e,t);if(s.type!=="STRING")return E.Ci();const i=(f=(c=(a=r.value)==null?void 0:a.mapValue)==null?void 0:c.fields)==null?void 0:f[(l=s.value)==null?void 0:l.stringValue];return i===void 0?E.Fi():E.newValue(i)}}class sc{constructor(e){this.expr=e}evaluate(e,t){var f,p;U(this.expr.params.length===2,25231,`${this.expr.name}() function should have exactly 2 params`);let r=!1;const s=j(this.expr.params[0]).evaluate(e,t);switch(s.type){case"VECTOR":break;case"NULL":r=!0;break;default:return E.Ci()}const i=j(this.expr.params[1]).evaluate(e,t);switch(i.type){case"VECTOR":break;case"NULL":r=!0;break;default:return E.Ci()}if(r)return E.Oi();const a=Jo(s.value),c=Jo(i.value);if(a===void 0||c===void 0||((f=a.values)==null?void 0:f.length)!==((p=c.values)==null?void 0:p.length))return E.Ci();const l=this.$i(a,c);return l===void 0||isNaN(l)?E.Ci():E.newValue({doubleValue:l})}}class j0 extends sc{$i(e,t){const r=(e==null?void 0:e.values)??[],s=(t==null?void 0:t.values)??[];if(r.length===0)return;let i=0,a=0,c=0;for(let f=0;f<r.length;f++){if(!Ct(r[f])||!Ct(s[f]))return;const p=Pe(r[f]),m=Pe(s[f]);i+=p*m,a+=p*p,c+=m*m}const l=Math.sqrt(a)*Math.sqrt(c);if(l!==0)return 1-Math.max(-1,Math.min(1,i/l))}}class z0 extends sc{$i(e,t){const r=(e==null?void 0:e.values)??[],s=(t==null?void 0:t.values)??[];if(r.length===0)return 0;let i=0;for(let a=0;a<r.length;a++){if(!Ct(r[a])||!Ct(s[a]))return;i+=Pe(r[a])*Pe(s[a])}return i}}class W0 extends sc{$i(e,t){const r=(e==null?void 0:e.values)??[],s=(t==null?void 0:t.values)??[];if(r.length===0)return 0;let i=0;for(let a=0;a<r.length;a++){if(!Ct(r[a])||!Ct(s[a]))return;const c=Pe(r[a]),l=Pe(s[a]);i+=Math.pow(c-l,2)}return Math.sqrt(i)}}class H0{constructor(e){this.expr=e}evaluate(e,t){var s;U(this.expr.params.length===1,39044);const r=j(this.expr.params[0]).evaluate(e,t);switch(r.type){case"VECTOR":{const i=Jo(r.value);return E.newValue({integerValue:((s=i==null?void 0:i.values)==null?void 0:s.length)??0})}case"NULL":return E.Oi();default:return E.Ci()}}}const fs=BigInt(-62135596800),ds=BigInt(253402300799),Ni=BigInt(1e3),Yt=BigInt(1e6),G0=fs*Ni,K0=ds*Ni+BigInt(999),Q0=fs*Yt,X0=ds*Yt+BigInt(999999);function ic(n){return n>=Q0&&n<=X0}function nd(n){return n>=fs&&n<=ds}function ps(n,e){const t=BigInt(n);return!(t<fs||t>ds)&&!(e<0||e>=1e9)&&(t!==fs||e===0)&&!(t===ds&&e>999999999)}function rd(n,e){return e<0?{seconds:n-1,nanos:e+1e9}:{seconds:n,nanos:e}}function oc(n){return BigInt(n.seconds)*Yt+BigInt(Math.trunc(n.nanoseconds/1e3))}class ac{constructor(e){this.expr=e}evaluate(e,t){U(this.expr.params.length===1,49262,`${this.expr.name}() function should have exactly one parameter`);const r=j(this.expr.params[0]).evaluate(e,t);switch(r.type){case"INT":return this.toTimestamp(BigInt(r.value.integerValue));case"NULL":return E.Oi();default:return E.Ci()}}}class J0 extends ac{toTimestamp(e){if(!ic(e))return E.Ci();let t=Number(e/Yt),r=Number(e%Yt*BigInt(1e3));const s=rd(t,r);return t=s.seconds,r=s.nanos,ps(t,r)?E.newValue({timestampValue:{seconds:t,nanos:r}}):E.Ci()}}class Y0 extends ac{toTimestamp(e){if(!(function(a){return a>=G0&&a<=K0})(e))return E.Ci();let t=Number(e/Ni),r=Number(e%Ni*BigInt(1e6));const s=rd(t,r);return t=s.seconds,r=s.nanos,ps(t,r)?E.newValue({timestampValue:{seconds:t,nanos:r}}):E.Ci()}}class Z0 extends ac{toTimestamp(e){if(!nd(e))return E.Ci();const t=Number(e);return E.newValue({timestampValue:{seconds:t,nanos:0}})}}class cc{constructor(e){this.expr=e}evaluate(e,t){U(this.expr.params.length===1,1265,`${this.expr.name}() function should have exactly one parameter`);const r=j(this.expr.params[0]).evaluate(e,t);switch(r.type){case"TIMESTAMP":break;case"NULL":return E.Oi();default:return E.Ci()}const s=Ua(r.value.timestampValue);return ps(s.seconds,s.nanoseconds)?this.Wi(s):E.Ci()}}class ew extends cc{Wi(e){const t=oc(e);return ic(t)?E.newValue({integerValue:`${t.toString()}`}):E.Ci()}}class tw extends cc{Wi(e){const t=oc(e),r=t/BigInt(1e3),s=t%BigInt(1e3);return r>BigInt(0)||s===BigInt(0)?E.newValue({integerValue:r.toString()}):E.newValue({integerValue:(r-BigInt(1)).toString()})}}class nw extends cc{Wi(e){const t=BigInt(e.seconds);return nd(t)?E.newValue({integerValue:t.toString()}):E.Ci()}}class sd{constructor(e){this.expr=e}evaluate(e,t){U(this.expr.params.length===3,2775,`${this.expr.name}() function should have exactly 3 parameters`);let r=!1;const s=j(this.expr.params[0]).evaluate(e,t);switch(s.type){case"TIMESTAMP":break;case"NULL":r=!0;break;default:return E.Ci()}const i=j(this.expr.params[1]).evaluate(e,t);let a;switch(i.type){case"STRING":if(a=(function(J){switch(J){case"microsecond":return"microsecond";case"millisecond":return"millisecond";case"second":return"second";case"minute":return"minute";case"hour":return"hour";case"day":return"day";default:return}})(i.value.stringValue),a===void 0)return E.Ci();break;case"NULL":r=!0;break;default:return E.Ci()}const c=j(this.expr.params[2]).evaluate(e,t);switch(c.type){case"INT":break;case"NULL":r=!0;break;default:return E.Ci()}if(r)return E.Oi();const l=BigInt(c.value.integerValue);let f;try{switch(a){case"microsecond":f=l;break;case"millisecond":f=l*BigInt(1e3);break;case"second":f=l*BigInt(1e6);break;case"minute":f=l*BigInt(6e7);break;case"hour":f=l*BigInt(36e8);break;case"day":f=l*BigInt(864e8);break;default:return E.Ci()}if(a!=="microsecond"&&l!==BigInt(0)&&f/l!==BigInt(this.Gi(a)))return E.Ci()}catch(H){return it(`Error during timestamp arithmetic: ${H}`),E.Ci()}const p=Ua(s.value.timestampValue);if(!ps(p.seconds,p.nanoseconds))return E.Ci();const m=oc(p),v=this.ji(m,f);if(!ic(v))return E.Ci();const V=Number(v/Yt),C=v%Yt,M=Number((C<0?C+Yt:C)*BigInt(1e3)),O=C<0?V-1:V;return ps(O,M)?E.newValue({timestampValue:{seconds:O,nanos:M}}):E.Ci()}Gi(e){switch(e){case"millisecond":return 1e3;case"second":return 1e6;case"minute":return 6e7;case"hour":return 36e8;case"day":return 864e8;default:return 1}}}class rw extends sd{ji(e,t){return e+t}}class sw extends sd{ji(e,t){return e-t}}function ms(n){if((n=ed(n))instanceof Ss)return`fld(${n.fieldName})`;if(n instanceof lr)return`cst(${(function(t){return t===null?"null":typeof t=="number"?t.toString():typeof t=="string"?`"${t}"`:t instanceof fe?`ref(${t.path})`:t instanceof $e?`vec(${JSON.stringify(t)})`:JSON.stringify(t)})(n.value)})`;if(n instanceof P)return`fn(${n.name},[${n.params.map(ms).join(",")}])`;if(n.expressionType==="ListOfExpressions")return`list([${n.fi.map(ms).join(",")}])`;throw new Error(`Unrecognized expr ${JSON.stringify(n,null,2)}`)}function iw(n){if(n instanceof Jf)return`${n._name}(${ei(n.fields)})`;if(n instanceof Yf){let e=`${n._name}(${ei(n.accumulators)})`;return n.groups.size>0&&(e+=`grouping(${ei(n.groups)})`),e}if(n instanceof Zf)return`${n._name}(${ei(n.groups)})`;if(n instanceof Yi)return`${n._name}(${n.pi})`;if(n instanceof Zi)return`${n._name}(${n.collectionId})`;if(n instanceof Ja)return`${n._name}()`;if(n instanceof Ya)return`${n._name}(${n.gi.sort()})`;if(n instanceof Za)return`${n._name}(${ms(n.condition)})`;if(n instanceof hs)return`${n._name}(${n.limit})`;if(n instanceof ec)return`${n._name}(${(function(t){return t.map((r=>`${ms(r.expr)}${r.direction}`)).join(",")})(n.orderings)})`;throw new Error(`Unrecognized stage ${n._name}`)}function ei(n){return`${Array.from(n.entries()).sort().map((([e,t])=>`${e}=${ms(t)}`)).join(",")}`}function Rt(n){return n.stages.map((e=>iw(e))).join("|")}function id(n,e){return Rt(n)===Rt(e)}function Ee(n){return n instanceof Fe}function Cl(n){return Ee(n)?Rt(n):$r(n)}function od(n){return Ee(n)?Rt(n):(function(t){return`${Ef(ft(t))}|lt:${t.limitType}`})(n)}function no(n,e){return n instanceof Fe&&e instanceof Fe?id(n,e):!(n instanceof Fe&&!(e instanceof Fe)||!(n instanceof Fe)&&e instanceof Fe)&&Ty(n,e)}function ad(n){return gn(n)?Rt(n):Ef(n)}function cd(n,e){return n instanceof Fe&&e instanceof Fe?id(n,e):!(n instanceof Fe&&!(e instanceof Fe)||!(n instanceof Fe)&&e instanceof Fe)&&wf(n,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ow{constructor(e,t,r,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(e,t){const r=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(e.key)&&ty(i,e,r[s])}}applyToLocalView(e,t){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(t=Fr(r,e,t,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(t=Fr(r,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const r=bf();return this.mutations.forEach((s=>{const i=e.get(s.key),a=i.overlayedDocument;let c=this.applyToLocalView(a,i.mutatedFields);c=t.has(s.key)?null:c;const l=lf(a,c);l!==null&&r.set(s.key,l),a.isValidDocument()||a.convertToNoDocument(W.min())})),r}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),X())}isEqual(e){return this.batchId===e.batchId&&Jn(this.mutations,e.mutations,((t,r)=>al(t,r)))&&Jn(this.baseMutations,e.baseMutations,((t,r)=>al(t,r)))}}class uc{constructor(e,t,r,s){this.batch=e,this.commitVersion=t,this.mutationResults=r,this.docVersions=s}static from(e,t,r){U(e.mutations.length===r.length,58842,{zi:e.mutations.length,Hi:r.length});let s=(function(){return Ry})();const i=e.mutations;for(let a=0;a<i.length;a++)s=s.insert(i[a].key,r[a].version);return new uc(e,t,r,s)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ud="";function aw(n){let e="";for(let t=0;t<n.length;t++)e.length>0&&(e=xl(e)),e=cw(n.get(t),e);return xl(e)}function cw(n,e){let t=e;const r=n.length;for(let s=0;s<r;s++){const i=n.charAt(s);switch(i){case"\0":t+="";break;case ud:t+="";break;default:t+=i}}return t}function xl(n){return n+ud+""}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uw{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class At{constructor(e,t,r,s,i=W.min(),a=W.min(),c=ae.EMPTY_BYTE_STRING,l=null){this.target=e,this.targetId=t,this.purpose=r,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=c,this.expectedCount=l}withSequenceNumber(e){return new At(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new At(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new At(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new At(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lw{constructor(e){this.Yi=e}}function hw(n){const e=jy({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Zo(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fw{constructor(){this.A_=new dw}addToCollectionParentIndex(e,t){return this.A_.add(t),S.resolve()}getCollectionParents(e,t){return S.resolve(this.A_.getEntries(t))}addFieldIndex(e,t){return S.resolve()}deleteFieldIndex(e,t){return S.resolve()}deleteAllFieldIndexes(e){return S.resolve()}createTargetIndexes(e,t){return S.resolve()}getDocumentsMatchingTarget(e,t){return S.resolve(null)}getIndexType(e,t){return S.resolve(0)}getFieldIndexes(e,t){return S.resolve([])}getNextCollectionGroupToUpdate(e){return S.resolve(null)}getMinOffset(e,t){return S.resolve(nn.min())}getMinOffsetFromCollectionGroup(e,t){return S.resolve(nn.min())}updateCollectionGroup(e,t,r){return S.resolve()}updateIndexEntries(e,t){return S.resolve()}}class dw{constructor(){this.index={}}add(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t]||new de(te.comparator),i=!s.has(r);return this.index[t]=s.add(r),i}has(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t];return s&&s.has(r)}getEntries(e){return(this.index[e]||new de(te.comparator)).toArray()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class on{constructor(e){this.Q_=e}next(){return this.Q_+=2,this.Q_}static q_(){return new on(0)}static K_(){return new on(-1)}}// Copyright 2024 Google LLC* @license
function ld(n,e){var r;let t=e;for(const s of n.stages)t=mw({serializer:n.serializer,serverTimestampBehavior:(r=n.listenOptions)==null?void 0:r.serverTimestampBehavior},s,t);return t}function ro(n,e){return ld(n,[e]).length>0}function pw(n,e){return Ee(n)?ro(n,e):Gi(n,e)}function mw(n,e,t){if(e instanceof Yi)return(function(s,i,a){return a.filter((c=>c.isFoundDocument()&&`/${c.key.getCollectionPath().canonicalString()}`===i.pi))})(0,e,t);if(e instanceof Za)return(function(s,i,a){return a.filter((c=>{const l=zr(j(i.condition).evaluate(s,c));return l!==void 0&&et(l,qe)}))})(n,e,t);if(e instanceof Zi)return(function(s,i,a){return a.filter((c=>c.isFoundDocument()&&c.key.getCollectionPath().lastSegment()===i.collectionId))})(0,e,t);if(e instanceof Ja)return(function(s,i,a){return a.filter((c=>c.isFoundDocument()))})(0,0,t);if(e instanceof Ya)return(function(s,i,a){return a.filter((c=>c.isFoundDocument()&&i.yi.has(c.key.path.toStringWithLeadingSlash())))})(0,e,t);if(e instanceof hs)return(function(s,i,a){return a.slice(0,i.limit)})(0,e,t);if(e instanceof ec)return(function(s,i,a){const c=i.orderings.map((l=>({Z_:j(l.expr),direction:l.direction})));return[...a].sort(((l,f)=>{for(const{Z_:p,direction:m}of c){const v=zr(p.evaluate(s,l)),V=zr(p.evaluate(s,f)),C=je(v??er,V??er);if(C!==0)return m==="ascending"?C:-C}return 0}))})(n,e,t);throw new Error(`Unknown stage: ${e._name}`)}function oa(n){const e=(function(r){for(let s=r.stages.length-1;s>=0;s--){const i=r.stages[s];if(i instanceof ec)return i.orderings}throw new Error("Pipeline must contain at least one Sort stage")})(n);return(t,r)=>{for(const s of e){const i=zr(j(s.expr).evaluate({serializer:n.serializer},t)),a=zr(j(s.expr).evaluate({serializer:n.serializer},r)),c=je(i||er,a||er);if(c!==0)return s.direction==="ascending"?c:-c}return 0}}function Fo(n){for(let e=n.stages.length-1;e>=0;e--){const t=n.stages[e];if(t instanceof hs)return{limit:t.limit}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gw{constructor(){this.changes=new Nn((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,xe.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const r=this.changes.get(t);return r!==void 0?S.resolve(r):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _w{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yw{constructor(e,t,r,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=r,this.indexManager=s}getDocument(e,t){let r=null;return this.documentOverlayCache.getOverlay(e,t).next((s=>(r=s,this.remoteDocumentCache.getEntry(e,t)))).next((s=>(r!==null&&Fr(r.mutation,s,rt.empty(),ee.now()),s)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((r=>this.getLocalViewOfDocuments(e,r,X()).next((()=>r))))}getLocalViewOfDocuments(e,t,r=X()){const s=zt();return this.populateOverlays(e,s,t).next((()=>this.computeViews(e,t,s,r).next((i=>{let a=Bn();return i.forEach(((c,l)=>{a=a.insert(c,l.overlayedDocument)})),a}))))}getOverlayedDocuments(e,t){const r=zt();return this.populateOverlays(e,r,t).next((()=>this.computeViews(e,t,r,X())))}populateOverlays(e,t,r){const s=[];return r.forEach((i=>{t.has(i)||s.push(i)})),this.documentOverlayCache.getOverlays(e,s).next((i=>{i.forEach(((a,c)=>{t.set(a,c)}))}))}computeViews(e,t,r,s){let i=Be();const a=qr(),c=(function(){return qr()})();return t.forEach(((l,f)=>{const p=r.get(f.key);s.has(f.key)&&(p===void 0||p.mutation instanceof xn)?i=i.insert(f.key,f):p!==void 0?(a.set(f.key,p.mutation.getFieldMask()),Fr(p.mutation,f,p.mutation.getFieldMask(),ee.now())):a.set(f.key,rt.empty())})),this.recalculateAndSaveOverlays(e,i).next((l=>(l.forEach(((f,p)=>a.set(f,p))),t.forEach(((f,p)=>c.set(f,new _w(p,a.get(f)??null)))),c)))}recalculateAndSaveOverlays(e,t){const r=qr();let s=new oe(((a,c)=>a-c)),i=X();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((a=>{for(const c of a)c.keys().forEach((l=>{const f=t.get(l);if(f===null)return;let p=r.get(l)||rt.empty();p=c.applyToLocalView(f,p),r.set(l,p);const m=(s.get(c.batchId)||X()).add(l);s=s.insert(c.batchId,m)}))})).next((()=>{const a=[],c=s.getReverseIterator();for(;c.hasNext();){const l=c.getNext(),f=l.key,p=l.value,m=bf();p.forEach((v=>{if(!i.has(v)){const V=lf(t.get(v),r.get(v));V!==null&&m.set(v,V),i=i.add(v)}})),a.push(this.documentOverlayCache.saveOverlays(e,f,m))}return S.waitFor(a)})).next((()=>r))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((r=>this.recalculateAndSaveOverlays(e,r)))}getDocumentsMatchingQuery(e,t,r,s){return Ee(t)?this.getDocumentsMatchingPipeline(e,t,r,s):yy(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):Ey(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,r,s):this.getDocumentsMatchingCollectionQuery(e,t,r,s)}getNextDocuments(e,t,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,r,s).next((i=>{const a=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,r.largestBatchId,s-i.size):S.resolve(zt());let c=os,l=i;return a.next((f=>S.forEach(f,((p,m)=>(c<m.largestBatchId&&(c=m.largestBatchId),i.get(p)?S.resolve():this.remoteDocumentCache.getEntry(e,p).next((v=>{l=l.insert(p,v)}))))).next((()=>this.populateOverlays(e,f,i))).next((()=>this.computeViews(e,l,f,X()))).next((p=>({batchId:c,changes:Af(p)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new $(t)).next((r=>{let s=Bn();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s}))}getDocumentsMatchingCollectionGroupQuery(e,t,r,s){const i=t.collectionGroup;let a=Bn();return this.indexManager.getCollectionParents(e,i).next((c=>S.forEach(c,(l=>{const f=(function(m,v){return new Wi(v,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)})(t,l.child(i));return this.getDocumentsMatchingCollectionQuery(e,f,r,s).next((p=>{p.forEach(((m,v)=>{a=a.insert(m,v)}))}))})).next((()=>a))))}getDocumentsMatchingCollectionQuery(e,t,r,s){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,r.largestBatchId).next((a=>(i=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,i,s)))).next((a=>this.retrieveMatchingLocalDocuments(i,a,(c=>Gi(t,c)))))}getDocumentsMatchingPipeline(e,t,r,s){if(Jt(t)==="collection_group"){const i=nc(t);let a=Bn();return this.indexManager.getCollectionParents(e,i).next((c=>S.forEach(c,(l=>{const f=(function(m,v){const V=m.stages.map((C=>C instanceof Zi?new Yi(v.canonicalString(),{}):C));return new Fe(m.serializer,V)})(t,l.child(i));return this.getDocumentsMatchingPipeline(e,f,r,s).next((p=>{p.forEach(((m,v)=>{a=a.insert(m,v)}))}))})).next((()=>a))))}{let i;return this.getOverlaysForPipeline(e,t,r.largestBatchId).next((a=>{switch(i=a,Jt(t)){case"collection":return this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,i,s);case"documents":let c=X();for(const l of ia(t))c=c.add($.fromPath(l));return this.remoteDocumentCache.getEntries(e,c);case"database":return this.remoteDocumentCache.getAllEntries(e);default:throw new L("invalid-argument",`Invalid pipeline source to execute offline: ${Rt(t)}`)}})).next((a=>this.retrieveMatchingLocalDocuments(i,a,(c=>ro(t,c)))))}}retrieveMatchingLocalDocuments(e,t,r){e.forEach(((i,a)=>{const c=a.getKey();t.get(c)===null&&(t=t.insert(c,xe.newInvalidDocument(c)))}));let s=Bn();return t.forEach(((i,a)=>{const c=e.get(i);c!==void 0&&Fr(c.mutation,a,rt.empty(),ee.now()),r(a)&&(s=s.insert(i,a))})),s}getOverlaysForPipeline(e,t,r){switch(Jt(t)){case"collection":return this.documentOverlayCache.getOverlaysForCollection(e,te.fromString(eo(t)),r);case"collection_group":throw new L("invalid-argument",`Unexpected collection group pipeline: ${Rt(t)}`);case"documents":return this.documentOverlayCache.getOverlays(e,ia(t).map((s=>$.fromPath(s))));case"database":return this.documentOverlayCache.getAllOverlays(e,r);default:throw new L("invalid-argument",`Failed to get overlays for pipeline: ${Rt(t)}`)}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ew{constructor(e){this.serializer=e,this.ao=new Map,this.uo=new Map}getBundleMetadata(e,t){return S.resolve(this.ao.get(t))}saveBundleMetadata(e,t){return this.ao.set(t.id,(function(s){return{id:s.id,version:s.version,createTime:dt(s.createTime)}})(t)),S.resolve()}getNamedQuery(e,t){return S.resolve(this.uo.get(t))}saveNamedQuery(e,t){return this.uo.set(t.name,(function(s){return{name:s.name,query:hw(s.bundledQuery),readTime:dt(s.readTime)}})(t)),S.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ww{constructor(){this.overlays=new oe($.comparator),this.co=new Map}getOverlay(e,t){return S.resolve(this.overlays.get(t))}getOverlays(e,t){const r=zt();return S.forEach(t,(s=>this.getOverlay(e,s).next((i=>{i!==null&&r.set(s,i)})))).next((()=>r))}getAllOverlays(e,t){const r=zt();return this.overlays.forEach(((s,i)=>{i.largestBatchId>t&&r.set(s,i)})),S.resolve(r)}saveOverlays(e,t,r){return r.forEach(((s,i)=>{this.cs(e,t,i)})),S.resolve()}removeOverlaysForBatchId(e,t,r){const s=this.co.get(r);return s!==void 0&&(s.forEach((i=>this.overlays=this.overlays.remove(i))),this.co.delete(r)),S.resolve()}getOverlaysForCollection(e,t,r){const s=zt(),i=t.length+1,a=new $(t.child("")),c=this.overlays.getIteratorFrom(a);for(;c.hasNext();){const l=c.getNext().value,f=l.getKey();if(!t.isPrefixOf(f.path))break;f.path.length===i&&l.largestBatchId>r&&s.set(l.getKey(),l)}return S.resolve(s)}getOverlaysForCollectionGroup(e,t,r,s){let i=new oe(((f,p)=>f-p));const a=this.overlays.getIterator();for(;a.hasNext();){const f=a.getNext().value;if(f.getKey().getCollectionGroup()===t&&f.largestBatchId>r){let p=i.get(f.largestBatchId);p===null&&(p=zt(),i=i.insert(f.largestBatchId,p)),p.set(f.getKey(),f)}}const c=zt(),l=i.getIterator();for(;l.hasNext()&&(l.getNext().value.forEach(((f,p)=>c.set(f,p))),!(c.size()>=s)););return S.resolve(c)}cs(e,t,r){const s=this.overlays.get(r.key);if(s!==null){const a=this.co.get(s.largestBatchId).delete(r.key);this.co.set(s.largestBatchId,a)}this.overlays=this.overlays.insert(r.key,new uw(t,r));let i=this.co.get(t);i===void 0&&(i=X(),this.co.set(t,i)),this.co.set(t,i.add(r.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tw{constructor(){this.sessionToken=ae.EMPTY_BYTE_STRING}getSessionToken(e){return S.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,S.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lc{constructor(){this.lo=new de(ve.Eo),this.ho=new de(ve.To)}isEmpty(){return this.lo.isEmpty()}addReference(e,t){const r=new ve(e,t);this.lo=this.lo.add(r),this.ho=this.ho.add(r)}Po(e,t){e.forEach((r=>this.addReference(r,t)))}removeReference(e,t){this.Io(new ve(e,t))}Ro(e,t){e.forEach((r=>this.removeReference(r,t)))}Ao(e){const t=new $(new te([])),r=new ve(t,e),s=new ve(t,e+1),i=[];return this.ho.forEachInRange([r,s],(a=>{this.Io(a),i.push(a.key)})),i}Vo(){this.lo.forEach((e=>this.Io(e)))}Io(e){this.lo=this.lo.delete(e),this.ho=this.ho.delete(e)}fo(e){const t=new $(new te([])),r=new ve(t,e),s=new ve(t,e+1);let i=X();return this.ho.forEachInRange([r,s],(a=>{i=i.add(a.key)})),i}containsKey(e){const t=new ve(e,0),r=this.lo.firstAfterOrEqual(t);return r!==null&&e.isEqual(r.key)}}class ve{constructor(e,t){this.key=e,this.mo=t}static Eo(e,t){return $.comparator(e.key,t.key)||Q(e.mo,t.mo)}static To(e,t){return Q(e.mo,t.mo)||$.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vw{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.ts=1,this.po=new de(ve.Eo)}checkEmpty(e){return S.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,r,s){const i=this.ts;this.ts++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new ow(i,t,r,s);this.mutationQueue.push(a);for(const c of s)this.po=this.po.add(new ve(c.key,i)),this.indexManager.addToCollectionParentIndex(e,c.key.path.popLast());return S.resolve(a)}lookupMutationBatch(e,t){return S.resolve(this.yo(t))}getNextMutationBatchAfterBatchId(e,t){const r=t+1,s=this.wo(r),i=s<0?0:s;return S.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return S.resolve(this.mutationQueue.length===0?Sa:this.ts-1)}getAllMutationBatches(e){return S.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const r=new ve(t,0),s=new ve(t,Number.POSITIVE_INFINITY),i=[];return this.po.forEachInRange([r,s],(a=>{const c=this.yo(a.mo);i.push(c)})),S.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new de(Q);return t.forEach((s=>{const i=new ve(s,0),a=new ve(s,Number.POSITIVE_INFINITY);this.po.forEachInRange([i,a],(c=>{r=r.add(c.mo)}))})),S.resolve(this.bo(r))}getAllMutationBatchesAffectingQuery(e,t){const r=t.path,s=r.length+1;let i=r;$.isDocumentKey(i)||(i=i.child(""));const a=new ve(new $(i),0);let c=new de(Q);return this.po.forEachWhile((l=>{const f=l.key.path;return!!r.isPrefixOf(f)&&(f.length===s&&(c=c.add(l.mo)),!0)}),a),S.resolve(this.bo(c))}bo(e){const t=[];return e.forEach((r=>{const s=this.yo(r);s!==null&&t.push(s)})),t}removeMutationBatch(e,t){U(this.So(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let r=this.po;return S.forEach(t.mutations,(s=>{const i=new ve(s.key,t.batchId);return r=r.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)})).next((()=>{this.po=r}))}ss(e){}containsKey(e,t){const r=new ve(t,0),s=this.po.firstAfterOrEqual(r);return S.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,S.resolve()}So(e,t){return this.wo(e)}wo(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}yo(e){const t=this.wo(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Iw{constructor(e){this.xo=e,this.docs=(function(){return new oe($.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const r=t.key,s=this.docs.get(r),i=s?s.size:0,a=this.xo(t);return this.docs=this.docs.insert(r,{document:t.mutableCopy(),size:a}),this.size+=a-i,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const r=this.docs.get(t);return S.resolve(r?r.document.mutableCopy():xe.newInvalidDocument(t))}getEntries(e,t){let r=Be();return t.forEach((s=>{const i=this.docs.get(s);r=r.insert(s,i?i.document.mutableCopy():xe.newInvalidDocument(s))})),S.resolve(r)}getAllEntries(e){let t=Be();return this.docs.forEach(((r,s)=>{t=t.insert(r,s.document)})),S.resolve(t)}getDocumentsMatchingQuery(e,t,r,s){let i,a;Ee(t)?(i=te.fromString(eo(t)),a=p=>ro(t,p)):(i=t.path,a=p=>Gi(t,p));let c=Be();const l=new $(i.child("__id-9223372036854775808__")),f=this.docs.getIteratorFrom(l);for(;f.hasNext();){const{key:p,value:{document:m}}=f.getNext();if(!i.isPrefixOf(p.path))break;p.path.length>i.length+1||my(py(m),r)<=0||(s.has(m.key)||a(m))&&(c=c.insert(m.key,m.mutableCopy()))}return S.resolve(c)}getAllFromCollectionGroup(e,t,r,s){B(9500)}vo(e,t){return S.forEach(this.docs,(r=>t(r)))}newChangeBuffer(e){return new Aw(this)}getSize(e){return S.resolve(this.size)}}class Aw extends gw{constructor(e){super(),this._o=e}applyChanges(e){const t=[];return this.changes.forEach(((r,s)=>{s.isValidDocument()?t.push(this._o.addEntry(e,s)):this._o.removeEntry(r)})),S.waitFor(t)}getFromCache(e,t){return this._o.getEntry(e,t)}getAllFromCache(e,t){return this._o.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bw{constructor(e){this.persistence=e,this.Do=new Nn((t=>ad(t)),cd),this.lastRemoteSnapshotVersion=W.min(),this.highestTargetId=0,this.Co=0,this.Fo=new lc,this.targetCount=0,this.Oo=on.q_()}forEachTarget(e,t){return this.Do.forEach(((r,s)=>t(s))),S.resolve()}getLastRemoteSnapshotVersion(e){return S.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return S.resolve(this.Co)}allocateTargetId(e){return this.highestTargetId=this.Oo.next(),S.resolve(this.highestTargetId)}setTargetsMetadata(e,t,r){return r&&(this.lastRemoteSnapshotVersion=r),t>this.Co&&(this.Co=t),S.resolve()}j_(e){this.Do.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.Oo=new on(t),this.highestTargetId=t),e.sequenceNumber>this.Co&&(this.Co=e.sequenceNumber)}addTargetData(e,t){return this.j_(t),this.targetCount+=1,S.resolve()}updateTargetData(e,t){return this.j_(t),S.resolve()}removeTargetData(e,t){return this.Do.delete(t.target),this.Fo.Ao(t.targetId),this.targetCount-=1,S.resolve()}removeTargets(e,t,r){let s=0;const i=[];return this.Do.forEach(((a,c)=>{c.sequenceNumber<=t&&r.get(c.targetId)===null&&(this.Do.delete(a),i.push(this.removeMatchingKeysForTargetId(e,c.targetId)),s++)})),S.waitFor(i).next((()=>s))}getTargetCount(e){return S.resolve(this.targetCount)}getTargetData(e,t){const r=this.Do.get(t)||null;return S.resolve(r)}addMatchingKeys(e,t,r){return this.Fo.Po(t,r),S.resolve()}removeMatchingKeys(e,t,r){this.Fo.Ro(t,r);const s=this.persistence.referenceDelegate,i=[];return s&&t.forEach((a=>{i.push(s.markPotentiallyOrphaned(e,a))})),S.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.Fo.Ao(t),S.resolve()}getMatchingKeysForTargetId(e,t){const r=this.Fo.fo(t);return S.resolve(r)}containsKey(e,t){return S.resolve(this.Fo.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hd{constructor(e,t){this.Mo={},this.overlays={},this.No=new Qi(0),this.Bo=!1,this.Bo=!0,this.Lo=new Tw,this.referenceDelegate=e(this),this.Uo=new bw(this),this.indexManager=new fw,this.remoteDocumentCache=(function(s){return new Iw(s)})((r=>this.referenceDelegate.ko(r))),this.serializer=new lw(t),this.Qo=new Ew(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Bo=!1,Promise.resolve()}get started(){return this.Bo}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new ww,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let r=this.Mo[e.toKey()];return r||(r=new vw(t,this.referenceDelegate),this.Mo[e.toKey()]=r),r}getGlobalsCache(){return this.Lo}getTargetCache(){return this.Uo}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Qo}runTransaction(e,t,r){D("MemoryPersistence","Starting transaction:",e);const s=new Rw(this.No.next());return this.referenceDelegate.qo(),r(s).next((i=>this.referenceDelegate.Ko(s).next((()=>i)))).toPromise().then((i=>(s.raiseOnCommittedEvent(),i)))}$o(e,t){return S.or(Object.values(this.Mo).map((r=>()=>r.containsKey(e,t))))}}class Rw extends gE{constructor(e){super(),this.currentSequenceNumber=e}}class hc{constructor(e){this.persistence=e,this.Wo=new lc,this.Go=null}static jo(e){return new hc(e)}get zo(){if(this.Go)return this.Go;throw B(60996)}addReference(e,t,r){return this.Wo.addReference(r,t),this.zo.delete(r.toString()),S.resolve()}removeReference(e,t,r){return this.Wo.removeReference(r,t),this.zo.add(r.toString()),S.resolve()}markPotentiallyOrphaned(e,t){return this.zo.add(t.toString()),S.resolve()}removeTarget(e,t){this.Wo.Ao(t.targetId).forEach((s=>this.zo.add(s.toString())));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,t.targetId).next((s=>{s.forEach((i=>this.zo.add(i.toString())))})).next((()=>r.removeTargetData(e,t)))}qo(){this.Go=new Set}Ko(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return S.forEach(this.zo,(r=>{const s=$.fromPath(r);return this.Ho(e,s).next((i=>{i||t.removeEntry(s,W.min())}))})).next((()=>(this.Go=null,t.apply(e))))}updateLimboDocument(e,t){return this.Ho(e,t).next((r=>{r?this.zo.delete(t.toString()):this.zo.add(t.toString())}))}ko(e){return 0}Ho(e,t){return S.or([()=>S.resolve(this.Wo.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.$o(e,t)])}}class ki{constructor(e,t){this.persistence=e,this.Jo=new Nn((r=>aw(r.path)),((r,s)=>r.isEqual(s))),this.garbageCollector=vE(this,t)}static jo(e,t){return new ki(e,t)}qo(){}Ko(e){return S.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}Pi(e){const t=this.H_(e);return this.persistence.getTargetCache().getTargetCount(e).next((r=>t.next((s=>r+s))))}H_(e){let t=0;return this.Ii(e,(r=>{t++})).next((()=>t))}Ii(e,t){return S.forEach(this.Jo,((r,s)=>this.Y_(e,r,s).next((i=>i?S.resolve():t(s)))))}removeTargets(e,t,r){return this.persistence.getTargetCache().removeTargets(e,t,r)}removeOrphanedDocuments(e,t){let r=0;const s=this.persistence.getRemoteDocumentCache(),i=s.newChangeBuffer();return s.vo(e,(a=>this.Y_(e,a,t).next((c=>{c||(r++,i.removeEntry(a,W.min()))})))).next((()=>i.apply(e))).next((()=>r))}markPotentiallyOrphaned(e,t){return this.Jo.set(t,e.currentSequenceNumber),S.resolve()}removeTarget(e,t){const r=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,r)}addReference(e,t,r){return this.Jo.set(r,e.currentSequenceNumber),S.resolve()}removeReference(e,t,r){return this.Jo.set(r,e.currentSequenceNumber),S.resolve()}updateLimboDocument(e,t){return this.Jo.set(t,e.currentSequenceNumber),S.resolve()}ko(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=bi(e.data.value)),t}Y_(e,t,r){return S.or([()=>this.persistence.$o(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const s=this.Jo.get(t);return S.resolve(s!==void 0&&s>r)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fc{constructor(e,t,r,s){this.targetId=e,this.fromCache=t,this.Ba=r,this.La=s}static Ua(e,t){let r=X(),s=X();for(const i of t.docChanges)switch(i.type){case 0:r=r.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new fc(e,t.fromCache,r,s)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pw(n,e){return $.comparator(n.key,e.key)}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vw{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sw{constructor(){this.ka=!1,this.Qa=!1,this.qa=100,this.Ka=(function(){return Np()?8:_E(Ne())>0?6:4})()}initialize(e,t){this.$a=e,this.indexManager=t,this.ka=!0}getDocumentsMatchingQuery(e,t,r,s){const i={result:null};return this.Wa(e,t).next((a=>{i.result=a})).next((()=>{if(!i.result)return this.Ga(e,t,s,r).next((a=>{i.result=a}))})).next((()=>{if(i.result)return;const a=new Vw;return this.ja(e,t,a).next((c=>{if(i.result=c,this.Qa)return this.za(e,t,a,c.size)}))})).next((()=>i.result))}za(e,t,r,s){return Ee(t)?S.resolve():r.documentReadCount<this.qa?(Un()<=Y.DEBUG&&D("QueryEngine","SDK will not create cache indexes for query:",$r(t),"since it only creates cache indexes for collection contains","more than or equal to",this.qa,"documents"),S.resolve()):(Un()<=Y.DEBUG&&D("QueryEngine","Query:",$r(t),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.Ka*s?(Un()<=Y.DEBUG&&D("QueryEngine","The SDK decides to create cache indexes for query:",$r(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,ft(t))):S.resolve())}Wa(e,t){if(Ee(t))return S.resolve(null);let r=t;if(dl(r))return S.resolve(null);let s=ft(r);return this.indexManager.getIndexType(e,s).next((i=>i===0?null:(r.limit!==null&&i===1&&(r=Zo(r,null,"F"),s=ft(r)),this.indexManager.getDocumentsMatchingTarget(e,s).next((a=>{const c=X(...a);return this.$a.getDocuments(e,c).next((l=>this.indexManager.getMinOffset(e,s).next((f=>{const p=this.Ha(r,l);return this.Ja(r,p,c,f.readTime)?this.Wa(e,Zo(r,null,"F")):this.Ya(e,p,r,f)}))))})))))}Ga(e,t,r,s){return(Ee(t)?(function(a){for(const c of a.stages){if(c instanceof hs||c instanceof Sl)return!1;if(c instanceof Za){if(c.condition instanceof Kf&&c.condition._expr.name==="exists"&&c.condition._expr.params[0]instanceof Ss&&c.condition._expr.params[0].fieldName===Yn)continue;return!1}}return!0})(t):dl(t))||s.isEqual(W.min())?S.resolve(null):this.$a.getDocuments(e,r).next((i=>{const a=this.Ha(t,i);return this.Ja(t,a,r,s)?S.resolve(null):(Un()<=Y.DEBUG&&D("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),Cl(t)),this.Ya(e,a,t,dy(s,os)).next((c=>c)))}))}Ha(e,t){let r,s;return Ee(e)?(r=new de(Pw),s=i=>ro(e,i)):(r=new de(La(e)),s=i=>Gi(e,i)),t.forEach(((i,a)=>{s(a)&&(r=r.add(a))})),r}Ja(e,t,r,s){if(Ee(e))return(function(c){return c.stages.some((l=>l instanceof hs||l instanceof Sl))})(e);if(e.limit===null)return!1;if(r.size!==t.size)return!0;const i=e.limitType==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}ja(e,t,r){return Un()<=Y.DEBUG&&D("QueryEngine","Using full collection scan to execute query:",Cl(t)),this.$a.getDocumentsMatchingQuery(e,t,nn.min(),r)}Ya(e,t,r,s){return this.$a.getDocumentsMatchingQuery(e,r,s).next((i=>(t.forEach((a=>{i=i.insert(a.key,a)})),i)))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dc="LocalStore",Cw=3e8;class xw{constructor(e,t,r,s){this.persistence=e,this.Za=t,this.serializer=s,this.Xa=new oe(Q),this.eu=new Nn((i=>ad(i)),cd),this.tu=new Map,this.nu=e.getRemoteDocumentCache(),this.Uo=e.getTargetCache(),this.Qo=e.getBundleCache(),this.ru(r)}ru(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new yw(this.nu,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.nu.setIndexManager(this.indexManager),this.Za.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.Xa)))}}function Nw(n,e,t,r){return new xw(n,e,t,r)}async function fd(n,e){const t=G(n);return await t.persistence.runTransaction("Handle user change","readonly",(r=>{let s;return t.mutationQueue.getAllMutationBatches(r).next((i=>(s=i,t.ru(e),t.mutationQueue.getAllMutationBatches(r)))).next((i=>{const a=[],c=[];let l=X();for(const f of s){a.push(f.batchId);for(const p of f.mutations)l=l.add(p.key)}for(const f of i){c.push(f.batchId);for(const p of f.mutations)l=l.add(p.key)}return t.localDocuments.getDocuments(r,l).next((f=>({iu:f,removedBatchIds:a,addedBatchIds:c})))}))}))}function kw(n,e){const t=G(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(r=>{const s=e.batch.keys(),i=t.nu.newChangeBuffer({trackRemovals:!0});return(function(c,l,f,p){const m=f.batch,v=m.keys();let V=S.resolve();return v.forEach((C=>{V=V.next((()=>p.getEntry(l,C))).next((M=>{const O=f.docVersions.get(C);U(O!==null,48541),M.version.compareTo(O)<0&&(m.applyToRemoteDocument(M,f),M.isValidDocument()&&(M.setReadTime(f.commitVersion),p.addEntry(M)))}))})),V.next((()=>c.mutationQueue.removeMutationBatch(l,m)))})(t,r,e,i).next((()=>i.apply(r))).next((()=>t.mutationQueue.performConsistencyCheck(r))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(r,s,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,(function(c){let l=X();for(let f=0;f<c.mutationResults.length;++f)c.mutationResults[f].transformResults.length>0&&(l=l.add(c.batch.mutations[f].key));return l})(e)))).next((()=>t.localDocuments.getDocuments(r,s)))}))}function dd(n){const e=G(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.Uo.getLastRemoteSnapshotVersion(t)))}function Dw(n,e){const t=G(n),r=e.snapshotVersion;let s=t.Xa;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(i=>{const a=t.nu.newChangeBuffer({trackRemovals:!0});s=t.Xa;const c=[];e.targetChanges.forEach(((p,m)=>{const v=s.get(m);if(!v)return;c.push(t.Uo.removeMatchingKeys(i,p.removedDocuments,m).next((()=>t.Uo.addMatchingKeys(i,p.addedDocuments,m))));let V=v.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(m)!==null?V=V.withResumeToken(ae.EMPTY_BYTE_STRING,W.min()).withLastLimboFreeSnapshotVersion(W.min()):p.resumeToken.approximateByteSize()>0&&(V=V.withResumeToken(p.resumeToken,r)),s=s.insert(m,V),(function(M,O,H){return M.resumeToken.approximateByteSize()===0||O.snapshotVersion.toMicroseconds()-M.snapshotVersion.toMicroseconds()>=Cw?!0:H.addedDocuments.size+H.modifiedDocuments.size+H.removedDocuments.size>0})(v,V,p)&&c.push(t.Uo.updateTargetData(i,V))}));let l=Be(),f=X();if(e.documentUpdates.forEach((p=>{e.resolvedLimboDocuments.has(p)&&c.push(t.persistence.referenceDelegate.updateLimboDocument(i,p))})),c.push(Ow(i,a,e.documentUpdates).next((p=>{l=p.su,f=p._u}))),!r.isEqual(W.min())){const p=t.Uo.getLastRemoteSnapshotVersion(i).next((m=>t.Uo.setTargetsMetadata(i,i.currentSequenceNumber,r)));c.push(p)}return S.waitFor(c).next((()=>a.apply(i))).next((()=>t.localDocuments.getLocalViewOfDocuments(i,l,f))).next((()=>l))})).then((i=>(t.Xa=s,i)))}function Ow(n,e,t){let r=X(),s=X();return t.forEach((i=>r=r.add(i))),e.getEntries(n,r).next((i=>{let a=Be();return t.forEach(((c,l)=>{const f=i.get(c);l.isFoundDocument()!==f.isFoundDocument()&&(s=s.add(c)),l.isNoDocument()&&l.version.isEqual(W.min())?(e.removeEntry(c,l.readTime),a=a.insert(c,l)):!f.isValidDocument()||l.version.compareTo(f.version)>0||l.version.compareTo(f.version)===0&&f.hasPendingWrites?(e.addEntry(l),a=a.insert(c,l)):D(dc,"Ignoring outdated watch update for ",c,". Current version:",f.version," Watch version:",l.version)})),{su:a,_u:s}}))}function Lw(n,e){const t=G(n);return t.persistence.runTransaction("Get next mutation batch","readonly",(r=>(e===void 0&&(e=Sa),t.mutationQueue.getNextMutationBatchAfterBatchId(r,e))))}function Mw(n,e){const t=G(n);return t.persistence.runTransaction("Allocate target","readwrite",(r=>{let s;return t.Uo.getTargetData(r,e).next((i=>i?(s=i,S.resolve(s)):t.Uo.allocateTargetId(r).next((a=>(s=new At(e,a,"TargetPurposeListen",r.currentSequenceNumber),t.Uo.addTargetData(r,s).next((()=>s)))))))})).then((r=>{const s=t.Xa.get(r.targetId);return(s===null||r.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.Xa=t.Xa.insert(r.targetId,r),t.eu.set(e,r.targetId)),r}))}async function aa(n,e,t){const r=G(n),s=r.Xa.get(e),i=t?"readwrite":"readwrite-primary";try{t||await r.persistence.runTransaction("Release target",i,(a=>r.persistence.referenceDelegate.removeTarget(a,s)))}catch(a){if(!ur(a))throw a;D(dc,`Failed to update sequence numbers for target ${e}: ${a}`)}r.Xa=r.Xa.remove(e),r.eu.delete(s.target)}function Nl(n,e,t){const r=G(n);let s=W.min(),i=X();return r.persistence.runTransaction("Execute query","readwrite",(a=>(function(l,f,p){const m=G(l),v=m.eu.get(p);return v!==void 0?S.resolve(m.Xa.get(v)):m.Uo.getTargetData(f,p)})(r,a,Ee(e)?e:ft(e)).next((c=>{if(c)return s=c.lastLimboFreeSnapshotVersion,r.Uo.getMatchingKeysForTargetId(a,c.targetId).next((l=>{i=l}))})).next((()=>r.Za.getDocumentsMatchingQuery(a,e,t?s:W.min(),t?i:X()))).next((c=>(Uw(r,c),{documents:c,ou:i})))))}function Uw(n,e){e.forEach(((t,r)=>{const s=r.key.getCollectionGroup(),i=n.tu.get(s)||W.min();r.readTime.compareTo(i)>0&&n.tu.set(s,r.readTime)}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fw{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.hu=0,this.Tu=null,this.Pu=!0}Iu(){this.hu===0&&(this.Ru("Unknown"),this.Tu=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.Tu=null,this.Au("Backend didn't respond within 10 seconds."),this.Ru("Offline"),Promise.resolve()))))}Vu(e){this.state==="Online"?this.Ru("Unknown"):(this.hu++,this.hu>=1&&(this.fu(),this.Au(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.Ru("Offline")))}set(e){this.fu(),this.hu=0,e==="Online"&&(this.Pu=!1),this.Ru(e)}Ru(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}Au(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.Pu?(St(t),this.Pu=!1):D("OnlineStateTracker",t)}fu(){this.Tu!==null&&(this.Tu.cancel(),this.Tu=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yt="RemoteStore";class Bw{constructor(e,t,r,s,i){this.localStore=e,this.datastore=t,this.asyncQueue=r,this.remoteSyncer={},this.du=[],this.mu=new Map,this.pu=new Map,this.gu=new Map,this.yu=new on(1e3),this.wu=new on(1001),this.bu=new Set,this.Su=[],this.xu=i,this.xu.tn((a=>{r.enqueueAndForget((async()=>{Dn(this)&&(D(yt,"Restarting streams for network reachability change."),await(async function(l){const f=G(l);f.bu.add(4),await xs(f),f.vu.set("Unknown"),f.bu.delete(4),await so(f)})(this))}))})),this.vu=new Fw(r,s)}}async function so(n){if(Dn(n))for(const e of n.Su)await e(!0)}async function xs(n){for(const e of n.Su)await e(!1)}function ca(n,e){return n.pu.get(e)||void 0}function pd(n,e){const t=G(n),r=ca(t,e.targetId);if(r!==void 0&&t.mu.has(r))return;const s=(function(c,l){const f=ca(c,l);f!==void 0&&c.gu.delete(f);const p=(function(v,V){return V%2!=0?v.wu.next():v.yu.next()})(c,l);return c.pu.set(l,p),c.gu.set(p,l),p})(t,e.targetId);D(yt,"remoteStoreListen mapping SDK target ID to remote",e.targetId,s);const i=new At(e.target,s,e.purpose,e.sequenceNumber,e.snapshotVersion,e.lastLimboFreeSnapshotVersion,e.resumeToken);t.mu.set(s,i),_c(t)?gc(t):dr(t).ur()&&mc(t,i)}function pc(n,e){const t=G(n),r=dr(t),s=ca(t,e);D(yt,"remoteStoreUnlisten removing mapping of SDK target ID to remote",e,s),t.mu.delete(s),t.pu.delete(e),t.gu.delete(s),r.ur()&&md(t,s),t.mu.size===0&&(r.ur()?r.Er():Dn(t)&&t.vu.set("Unknown"))}function mc(n,e){if(n.Du.rt(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(W.min())>0){const t=n.gu.get(e.targetId);if(t===void 0)return void D(yt,"SDK target ID not found for remote ID: "+e.targetId);const r=n.remoteSyncer.getRemoteKeysForTarget(t).size;e=e.withExpectedCount(r)}dr(n).yr(e)}function md(n,e){n.Du.rt(e),dr(n).wr(e)}function gc(n){n.Du=new Ny({getRemoteKeysForTarget:e=>{const t=n.gu.get(e);return t!==void 0?n.remoteSyncer.getRemoteKeysForTarget(t):X()},Mt:e=>n.mu.get(e)||null,xt:()=>n.datastore.serializer.databaseId}),dr(n).start(),n.vu.Iu()}function _c(n){return Dn(n)&&!dr(n).ar()&&n.mu.size>0}function Dn(n){return G(n).bu.size===0}function gd(n){n.Du=void 0}async function $w(n){n.vu.set("Online")}async function qw(n){n.mu.forEach(((e,t)=>{mc(n,e)}))}async function jw(n,e){gd(n),_c(n)?(n.vu.Vu(e),gc(n)):n.vu.set("Unknown")}async function zw(n,e,t){if(n.vu.set("Online"),e instanceof Pf&&e.state===2&&e.cause)try{await(async function(s,i){const a=i.cause;for(const c of i.targetIds){if(s.mu.has(c)){const l=s.gu.get(c);l!==void 0&&(await s.remoteSyncer.rejectListen(l,a),s.pu.delete(l),s.gu.delete(c)),s.mu.delete(c)}s.Du.removeTarget(c)}})(n,e)}catch(r){D(yt,"Failed to remove targets %s: %s ",e.targetIds.join(","),r),await Di(n,r)}else if(e instanceof li?n.Du.Tt(e):e instanceof Rf?n.Du.dt(e):n.Du.Rt(e),!t.isEqual(W.min()))try{const r=await dd(n.localStore);t.compareTo(r)>=0&&await(function(i,a){const c=i.Du.Dt(a);c.targetChanges.forEach(((f,p)=>{if(f.resumeToken.approximateByteSize()>0){const m=i.mu.get(p);m&&i.mu.set(p,m.withResumeToken(f.resumeToken,a))}})),c.targetMismatches.forEach(((f,p)=>{const m=i.mu.get(f);if(!m)return;i.mu.set(f,m.withResumeToken(ae.EMPTY_BYTE_STRING,m.snapshotVersion)),md(i,f);const v=new At(m.target,f,p,m.sequenceNumber);mc(i,v)}));const l=(function(p,m){const v=new Map;m.targetChanges.forEach(((C,M)=>{const O=p.gu.get(M);O!==void 0&&v.set(O,C)}));let V=new oe(Q);return m.targetMismatches.forEach(((C,M)=>{const O=p.gu.get(C);O!==void 0&&(V=V.insert(O,M))})),new Ps(m.snapshotVersion,v,V,m.documentUpdates,m.augmentedDocumentUpdates,m.resolvedLimboDocuments)})(i,c);return i.remoteSyncer.applyRemoteEvent(l)})(n,t)}catch(r){D(yt,"Failed to raise snapshot:",r),await Di(n,r)}}async function Di(n,e,t){if(!ur(e))throw e;n.bu.add(1),await xs(n),n.vu.set("Offline"),t||(t=()=>dd(n.localStore)),n.asyncQueue.enqueueRetryable((async()=>{D(yt,"Retrying IndexedDB access"),await t(),n.bu.delete(1),await so(n)}))}function _d(n,e){return e().catch((t=>Di(n,t,e)))}async function io(n){const e=G(n),t=an(e);let r=e.du.length>0?e.du[e.du.length-1].batchId:Sa;for(;Ww(e);)try{const s=await Lw(e.localStore,r);if(s===null){e.du.length===0&&t.Er();break}r=s.batchId,Hw(e,s)}catch(s){await Di(e,s)}yd(e)&&Ed(e)}function Ww(n){return Dn(n)&&n.du.length<10}function Hw(n,e){n.du.push(e);const t=an(n);t.ur()&&t.br&&t.Sr(e.mutations)}function yd(n){return Dn(n)&&!an(n).ar()&&n.du.length>0}function Ed(n){an(n).start()}async function Gw(n){an(n).Cr()}async function Kw(n){const e=an(n);for(const t of n.du)e.Sr(t.mutations)}async function Qw(n,e,t){const r=n.du.shift(),s=uc.from(r,e,t);await _d(n,(()=>n.remoteSyncer.applySuccessfulWrite(s))),await io(n)}async function Xw(n,e){e&&an(n).br&&await(async function(r,s){if((function(a){return Ay(a)&&a!==x.ABORTED})(s.code)){const i=r.du.shift();an(r).lr(),await _d(r,(()=>r.remoteSyncer.rejectFailedWrite(i.batchId,s))),await io(r)}})(n,e),yd(n)&&Ed(n)}async function kl(n,e){const t=G(n);t.asyncQueue.verifyOperationInProgress(),D(yt,"RemoteStore received new credentials");const r=Dn(t);t.bu.add(3),await xs(t),r&&t.vu.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.bu.delete(3),await so(t)}async function Jw(n,e){const t=G(n);e?(t.bu.delete(2),await so(t)):e||(t.bu.add(2),await xs(t),t.vu.set("Unknown"))}function dr(n){return n.Cu||(n.Cu=(function(t,r,s){const i=G(t);return i.Or(),new cE(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(n.datastore,n.asyncQueue,{pn:$w.bind(null,n),yn:qw.bind(null,n),bn:jw.bind(null,n),gr:zw.bind(null,n)}),n.Su.push((async e=>{e?(n.Cu.lr(),_c(n)?gc(n):n.vu.set("Unknown")):(await n.Cu.stop(),gd(n))}))),n.Cu}function an(n){return n.Fu||(n.Fu=(function(t,r,s){const i=G(t);return i.Or(),new uE(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(n.datastore,n.asyncQueue,{pn:()=>Promise.resolve(),yn:Gw.bind(null,n),bn:Xw.bind(null,n),vr:Kw.bind(null,n),Dr:Qw.bind(null,n)}),n.Su.push((async e=>{e?(n.Fu.lr(),await io(n)):(await n.Fu.stop(),n.du.length>0&&(D(yt,`Stopping write stream with ${n.du.length} pending writes`),n.du=[]))}))),n.Fu}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wd{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ou(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ou(this.observer.error,e):St("Uncaught Error in snapshot listener:",e.toString()))}Mu(){this.muted=!0}Ou(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yc{constructor(e,t,r,s,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=s,this.removalCallback=i,this.deferred=new Xt,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((a=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,s,i){const a=Date.now()+r,c=new yc(e,t,a,s,i);return c.start(r),c}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new L(x.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Ec(n,e){if(St("AsyncQueue",`${e}: ${n}`),ur(n))return new L(x.UNAVAILABLE,`${e}: ${n}`);throw n}class Dl{constructor(){this.activeTargetIds=Sy()}ec(e){this.activeTargetIds=this.activeTargetIds.add(e)}tc(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Xu(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class Yw{constructor(){this.Uc=new Dl,this.kc={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,r){}addLocalQueryTarget(e,t=!0){return t&&this.Uc.ec(e),this.kc[e]||"not-current"}updateQueryState(e,t,r){this.kc[e]=t}removeLocalQueryTarget(e){this.Uc.tc(e)}isLocalQueryTarget(e){return this.Uc.activeTargetIds.has(e)}clearQueryState(e){delete this.kc[e]}getAllActiveQueryTargets(){return this.Uc.activeTargetIds}isActiveQueryTarget(e){return this.Uc.activeTargetIds.has(e)}start(){return this.Uc=new Dl,Promise.resolve()}handleUserChange(e,t,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}function Bo(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tn{static emptySet(e){return new Tn(e.comparator)}constructor(e){this.comparator=e?(t,r)=>e(t,r)||$.comparator(t.key,r.key):(t,r)=>$.comparator(t.key,r.key),this.keyedMap=Bn(),this.sortedSet=new oe(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,r)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Tn)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=r.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const r=new Tn;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=t,r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ol{constructor(){this.Qc=new oe($.comparator)}track(e){const t=e.doc.key,r=this.Qc.get(t);r?e.type!==0&&r.type===3?this.Qc=this.Qc.insert(t,e):e.type===3&&r.type!==1?this.Qc=this.Qc.insert(t,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.Qc=this.Qc.insert(t,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.Qc=this.Qc.insert(t,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.Qc=this.Qc.remove(t):e.type===1&&r.type===2?this.Qc=this.Qc.insert(t,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.Qc=this.Qc.insert(t,{type:2,doc:e.doc}):B(63341,{Nt:e,qc:r}):this.Qc=this.Qc.insert(t,e)}Kc(){const e=[];return this.Qc.inorderTraversal(((t,r)=>{e.push(r)})),e}}class rr{constructor(e,t,r,s,i,a,c,l,f){this.query=e,this.docs=t,this.oldDocs=r,this.docChanges=s,this.mutatedKeys=i,this.fromCache=a,this.syncStateChanged=c,this.excludesMetadataChanges=l,this.hasCachedResults=f}static fromInitialDocuments(e,t,r,s,i){const a=[];return t.forEach((c=>{a.push({type:0,doc:c})})),new rr(e,t,Tn.emptySet(t),a,r,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&no(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,r=e.docChanges;if(t.length!==r.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==r[s].type||!t[s].doc.isEqual(r[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zw{constructor(){this.$c=void 0,this.Wc=[]}Gc(){return this.Wc.some((e=>e.jc()))}}class eT{constructor(){this.queries=Ll(),this.onlineState="Unknown",this.zc=new Set}terminate(){(function(t,r){const s=G(t),i=s.queries;s.queries=Ll(),i.forEach(((a,c)=>{for(const l of c.Wc)l.onError(r)}))})(this,new L(x.ABORTED,"Firestore shutting down"))}}function Ll(){return new Nn((n=>od(n)),no)}async function Td(n,e){const t=G(n);let r=3;const s=e.query;let i=t.queries.get(s);i?!i.Gc()&&e.jc()&&(r=2):(i=new Zw,r=e.jc()?0:1);try{switch(r){case 0:i.$c=await t.onListen(s,!0);break;case 1:i.$c=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(a){const c=Ec(a,`Initialization of query '${Ee(e.query)?Rt(e.query):$r(e.query)}' failed`);return void e.onError(c)}t.queries.set(s,i),i.Wc.push(e),e.Hc(t.onlineState),i.$c&&e.Jc(i.$c)&&wc(t)}async function vd(n,e){const t=G(n),r=e.query;let s=3;const i=t.queries.get(r);if(i){const a=i.Wc.indexOf(e);a>=0&&(i.Wc.splice(a,1),i.Wc.length===0?s=e.jc()?0:1:!i.Gc()&&e.jc()&&(s=2))}switch(s){case 0:return t.queries.delete(r),t.onUnlisten(r,!0);case 1:return t.queries.delete(r),t.onUnlisten(r,!1);case 2:return t.onLastRemoteStoreUnlisten(r);default:return}}function tT(n,e){const t=G(n);let r=!1;for(const s of e){const i=s.query,a=t.queries.get(i);if(a){for(const c of a.Wc)c.Jc(s)&&(r=!0);a.$c=s}}r&&wc(t)}function nT(n,e,t){const r=G(n),s=r.queries.get(e);if(s)for(const i of s.Wc)i.onError(t);r.queries.delete(e)}function wc(n){n.zc.forEach((e=>{e.next()}))}var ua;(function(n){n.Default="default",n.Cache="cache"})(ua||(ua={}));class Id{constructor(e,t,r){this.query=e,this.Yc=t,this.Zc=!1,this.Xc=null,this.onlineState="Unknown",this.options=r||{}}Jc(e){if(!this.options.includeMetadataChanges){const r=[];for(const s of e.docChanges)s.type!==3&&r.push(s);e=new rr(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.Zc?this.el(e)&&(this.Yc.next(e),t=!0):this.tl(e,this.onlineState)&&(this.nl(e),t=!0),this.Xc=e,t}onError(e){this.Yc.error(e)}Hc(e){this.onlineState=e;let t=!1;return this.Xc&&!this.Zc&&this.tl(this.Xc,e)&&(this.nl(this.Xc),t=!0),t}tl(e,t){if(!e.fromCache||!this.jc())return!0;const r=t!=="Offline";return(!this.options.waitForSyncWhenOnline||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}el(e){if(e.docChanges.length>0)return!0;const t=this.Xc&&this.Xc.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}nl(e){e=rr.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Zc=!0,this.Yc.next(e)}jc(){return this.options.source!==ua.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ad{constructor(e){this.key=e}}class bd{constructor(e){this.key=e}}class rT{constructor(e,t){this.query=e,this.ll=t,this.El=null,this.hasCachedResults=!1,this.current=!1,this.hl=X(),this.mutatedKeys=X(),this.Tl=Ee(e)?oa(e):La(e),this.Pl=new Tn(this.Tl)}get Il(){return this.ll}Rl(e,t){const r=t?t.Al:new Ol,s=t?t.Pl:this.Pl;let i=t?t.mutatedKeys:this.mutatedKeys,a=s,c=!1;const[l,f]=this.Vl(this.query,s);e.inorderTraversal(((m,v)=>{const V=s.get(m),C=pw(this.query,v)?v:null,M=!!V&&this.mutatedKeys.has(V.key),O=!!C&&(C.hasLocalMutations||this.mutatedKeys.has(C.key)&&C.hasCommittedMutations);let H=!1;V&&C?V.data.isEqual(C.data)?M!==O&&(r.track({type:3,doc:C}),H=!0):this.fl(V,C)||(r.track({type:2,doc:C}),H=!0,(l&&this.Tl(C,l)>0||f&&this.Tl(C,f)<0)&&(c=!0)):!V&&C?(r.track({type:0,doc:C}),H=!0):V&&!C&&(r.track({type:1,doc:V}),H=!0,(l||f)&&(c=!0)),H&&(C?(a=a.add(C),i=O?i.add(m):i.delete(m)):(a=a.delete(m),i=i.delete(m)))}));const p=this.dl(this.query);if(p)if(Ee(this.query)){const m=[];a.forEach((C=>m.push(C)));const v=ld(this.query,m);let V=new Tn(oa(this.query));for(const C of v)V=V.add(C);a.forEach((C=>{V.has(C.key)||(i=i.delete(C.key),r.track({type:1,doc:C}))})),a=V}else{const m=this.ml(this.query);for(;a.size>p;){const v=m==="F"?a.last():a.first();a=a.delete(v.key),i=i.delete(v.key),r.track({type:1,doc:v})}}return{Pl:a,Al:r,Ja:c,mutatedKeys:i}}dl(e){var t;return Ee(e)?(t=Fo(e))==null?void 0:t.limit:e.limit||void 0}ml(e){if(Ee(e)){const t=Fo(e);return t&&t.limit<0?"L":"F"}return e.limitType}Vl(e,t){var r;if(Ee(e)){const s=(r=Fo(e))==null?void 0:r.limit;return[t.size===s?t.last():null,null]}return[e.limitType==="F"&&t.size===this.dl(this.query)?t.last():null,e.limitType==="L"&&t.size===this.dl(this.query)?t.first():null]}fl(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,r,s){const i=this.Pl;this.Pl=e.Pl,this.mutatedKeys=e.mutatedKeys;const a=e.Al.Kc();a.sort(((p,m)=>(function(V,C){const M=O=>{switch(O){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return B(20277,{Nt:O})}};return M(V)-M(C)})(p.type,m.type)||this.Tl(p.doc,m.doc))),this.pl(r),s=s??!1;const c=t&&!s?this.gl():[],l=this.hl.size===0&&this.current&&!s?1:0,f=l!==this.El;return this.El=l,a.length!==0||f?{snapshot:new rr(this.query,e.Pl,i,a,e.mutatedKeys,l===0,f,!1,!!r&&r.resumeToken.approximateByteSize()>0),yl:c}:{yl:c}}Hc(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Pl:this.Pl,Al:new Ol,mutatedKeys:this.mutatedKeys,Ja:!1},!1)):{yl:[]}}wl(e){return!this.ll.has(e)&&!!this.Pl.has(e)&&!this.Pl.get(e).hasLocalMutations}pl(e){e&&(e.addedDocuments.forEach((t=>this.ll=this.ll.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.ll=this.ll.delete(t))),this.current=e.current)}gl(){if(!this.current)return[];const e=this.hl;this.hl=X(),this.Pl.forEach((r=>{this.wl(r.key)&&(this.hl=this.hl.add(r.key))}));const t=[];return e.forEach((r=>{this.hl.has(r)||t.push(new bd(r))})),this.hl.forEach((r=>{e.has(r)||t.push(new Ad(r))})),t}bl(e){this.ll=e.ou,this.hl=X();const t=this.Rl(e.documents);return this.applyChanges(t,!0)}Sl(){return rr.fromInitialDocuments(this.query,this.Pl,this.mutatedKeys,this.El===0,this.hasCachedResults)}}const Tc="SyncEngine";class sT{constructor(e,t,r){this.query=e,this.targetId=t,this.view=r}}class iT{constructor(e){this.key=e,this.xl=!1}}class oT{constructor(e,t,r,s,i,a){this.localStore=e,this.remoteStore=t,this.eventManager=r,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=a,this.vl={},this.Dl=new Nn((c=>od(c)),no),this.Cl=new Map,this.Fl=new Set,this.Ol=new oe($.comparator),this.Ml=new Map,this.Nl=new lc,this.Bl={},this.Ll=new Map,this.Ul=on.K_(),this.onlineState="Unknown",this.kl=void 0}get isPrimaryClient(){return this.kl===!0}}async function aT(n,e,t=!0){const r=xd(n);let s;const i=r.Dl.get(e);return i?(r.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.Sl()):s=await Rd(r,e,t,!0),s}async function cT(n,e){const t=xd(n);await Rd(t,e,!0,!1)}async function Rd(n,e,t,r){const s=await Mw(n.localStore,Ee(e)?e:ft(e)),i=s.targetId,a=n.sharedClientState.addLocalQueryTarget(i,t);let c;return r&&(c=await uT(n,e,i,a==="current",s.resumeToken)),n.isPrimaryClient&&t&&pd(n.remoteStore,s),c}async function uT(n,e,t,r,s){n.Ql=(m,v,V)=>(async function(M,O,H,J){let se=O.view.Rl(H);se.Ja&&(se=await Nl(M.localStore,O.query,!1).then((({documents:T})=>O.view.Rl(T,se))));const De=J&&J.targetChanges.get(O.targetId),me=J&&J.targetMismatches.get(O.targetId)!=null,ge=O.view.applyChanges(se,M.isPrimaryClient,De,me);return Ul(M,O.targetId,ge.yl),ge.snapshot})(n,m,v,V);const i=await Nl(n.localStore,e,!0),a=new rT(e,i.ou),c=a.Rl(i.documents),l=Vs.createSynthesizedTargetChangeForCurrentChange(t,r&&n.onlineState!=="Offline",s),f=a.applyChanges(c,n.isPrimaryClient,l);Ul(n,t,f.yl);const p=new sT(e,t,a);return n.Dl.set(e,p),n.Cl.has(t)?n.Cl.get(t).push(e):n.Cl.set(t,[e]),f.snapshot}async function lT(n,e,t){const r=G(n),s=r.Dl.get(e),i=r.Cl.get(s.targetId);if(i.length>1)return r.Cl.set(s.targetId,i.filter((a=>!no(a,e)))),void r.Dl.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await aa(r.localStore,s.targetId,!1).then((()=>{r.sharedClientState.clearQueryState(s.targetId),t&&pc(r.remoteStore,s.targetId),la(r,s.targetId)})).catch(cr)):(la(r,s.targetId),await aa(r.localStore,s.targetId,!0))}async function hT(n,e){const t=G(n),r=t.Dl.get(e),s=t.Cl.get(r.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(r.targetId),pc(t.remoteStore,r.targetId))}async function fT(n,e,t){const r=ET(n);try{const s=await(function(a,c){const l=G(a),f=ee.now(),p=c.reduce(((V,C)=>V.add(C.key)),X());let m,v;return l.persistence.runTransaction("Locally write mutations","readwrite",(V=>{let C=Be(),M=X();return l.nu.getEntries(V,p).next((O=>{C=O,C.forEach(((H,J)=>{J.isValidDocument()||(M=M.add(H))}))})).next((()=>l.localDocuments.getOverlayedDocuments(V,C))).next((O=>{m=O;const H=[];for(const J of c){const se=ny(J,m.get(J.key).overlayedDocument);se!=null&&H.push(new xn(J.key,se,sf(se.value.mapValue),bt.exists(!0)))}return l.mutationQueue.addMutationBatch(V,f,H,c)})).next((O=>{v=O;const H=O.applyToLocalDocumentSet(m,M);return l.documentOverlayCache.saveOverlays(V,O.batchId,H)}))})).then((()=>({batchId:v.batchId,changes:Af(m)})))})(r.localStore,e);r.sharedClientState.addPendingMutation(s.batchId),(function(a,c,l){let f=a.Bl[a.currentUser.toKey()];f||(f=new oe(Q)),f=f.insert(c,l),a.Bl[a.currentUser.toKey()]=f})(r,s.batchId,t),await Ns(r,s.changes),await io(r.remoteStore)}catch(s){const i=Ec(s,"Failed to persist write");t.reject(i)}}async function Pd(n,e){const t=G(n);try{const r=await Dw(t.localStore,e);e.targetChanges.forEach(((s,i)=>{const a=t.Ml.get(i);a&&(U(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?a.xl=!0:s.modifiedDocuments.size>0?U(a.xl,14607):s.removedDocuments.size>0&&(U(a.xl,42227),a.xl=!1))})),await Ns(t,r,e)}catch(r){await cr(r)}}function Ml(n,e,t){const r=G(n);if(r.isPrimaryClient&&t===0||!r.isPrimaryClient&&t===1){const s=[];r.Dl.forEach(((i,a)=>{const c=a.view.Hc(e);c.snapshot&&s.push(c.snapshot)})),(function(a,c){const l=G(a);l.onlineState=c;let f=!1;l.queries.forEach(((p,m)=>{for(const v of m.Wc)v.Hc(c)&&(f=!0)})),f&&wc(l)})(r.eventManager,e),s.length&&r.vl.gr(s),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function dT(n,e,t){const r=G(n);r.sharedClientState.updateQueryState(e,"rejected",t);const s=r.Ml.get(e),i=s&&s.key;if(i){let a=new oe($.comparator);a=a.insert(i,xe.newNoDocument(i,W.min()));const c=X().add(i),l=new Ps(W.min(),new Map,new oe(Q),a,Be(),c);await Pd(r,l),r.Ol=r.Ol.remove(i),r.Ml.delete(e),vc(r)}else await aa(r.localStore,e,!1).then((()=>la(r,e,t))).catch(cr)}async function pT(n,e){const t=G(n),r=e.batch.batchId;try{const s=await kw(t.localStore,e);Sd(t,r,null),Vd(t,r),t.sharedClientState.updateMutationState(r,"acknowledged"),await Ns(t,s)}catch(s){await cr(s)}}async function mT(n,e,t){const r=G(n);try{const s=await(function(a,c){const l=G(a);return l.persistence.runTransaction("Reject batch","readwrite-primary",(f=>{let p;return l.mutationQueue.lookupMutationBatch(f,c).next((m=>(U(m!==null,37113),p=m.keys(),l.mutationQueue.removeMutationBatch(f,m)))).next((()=>l.mutationQueue.performConsistencyCheck(f))).next((()=>l.documentOverlayCache.removeOverlaysForBatchId(f,p,c))).next((()=>l.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(f,p))).next((()=>l.localDocuments.getDocuments(f,p)))}))})(r.localStore,e);Sd(r,e,t),Vd(r,e),r.sharedClientState.updateMutationState(e,"rejected",t),await Ns(r,s)}catch(s){await cr(s)}}function Vd(n,e){(n.Ll.get(e)||[]).forEach((t=>{t.resolve()})),n.Ll.delete(e)}function Sd(n,e,t){const r=G(n);let s=r.Bl[r.currentUser.toKey()];if(s){const i=s.get(e);i&&(t?i.reject(t):i.resolve(),s=s.remove(e)),r.Bl[r.currentUser.toKey()]=s}}function la(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const r of n.Cl.get(e))n.Dl.delete(r),t&&n.vl.ql(r,t);n.Cl.delete(e),n.isPrimaryClient&&n.Nl.Ao(e).forEach((r=>{n.Nl.containsKey(r)||Cd(n,r)}))}function Cd(n,e){n.Fl.delete(e.path.canonicalString());const t=n.Ol.get(e);t!==null&&(pc(n.remoteStore,t),n.Ol=n.Ol.remove(e),n.Ml.delete(t),vc(n))}function Ul(n,e,t){for(const r of t)r instanceof Ad?(n.Nl.addReference(r.key,e),gT(n,r)):r instanceof bd?(D(Tc,"Document no longer in limbo: "+r.key),n.Nl.removeReference(r.key,e),n.Nl.containsKey(r.key)||Cd(n,r.key)):B(19791,{Kl:r})}function gT(n,e){const t=e.key,r=t.path.canonicalString();n.Ol.get(t)||n.Fl.has(r)||(D(Tc,"New document in limbo: "+t),n.Fl.add(r),vc(n))}function vc(n){for(;n.Fl.size>0&&n.Ol.size<n.maxConcurrentLimboResolutions;){const e=n.Fl.values().next().value;n.Fl.delete(e);const t=new $(te.fromString(e)),r=n.Ul.next();n.Ml.set(r,new iT(t)),n.Ol=n.Ol.insert(t,r),pd(n.remoteStore,new At(ft(Hi(t.path)),r,"TargetPurposeLimboResolution",Qi.Br))}}async function Ns(n,e,t){const r=G(n),s=[],i=[],a=[];r.Dl.isEmpty()||(r.Dl.forEach(((c,l)=>{a.push(r.Ql(l,e,t).then((f=>{var p;if((f||t)&&r.isPrimaryClient){const m=f?!f.fromCache:(p=t==null?void 0:t.targetChanges.get(l.targetId))==null?void 0:p.current;r.sharedClientState.updateQueryState(l.targetId,m?"current":"not-current")}if(f){s.push(f);const m=fc.Ua(l.targetId,f);i.push(m)}})))})),await Promise.all(a),r.vl.gr(s),await(async function(l,f){const p=G(l);try{await p.persistence.runTransaction("notifyLocalViewChanges","readwrite",(m=>S.forEach(f,(v=>S.forEach(v.Ba,(V=>p.persistence.referenceDelegate.addReference(m,v.targetId,V))).next((()=>S.forEach(v.La,(V=>p.persistence.referenceDelegate.removeReference(m,v.targetId,V)))))))))}catch(m){if(!ur(m))throw m;D(dc,"Failed to update sequence numbers: "+m)}for(const m of f){const v=m.targetId;if(!m.fromCache){const V=p.Xa.get(v),C=V.snapshotVersion,M=V.withLastLimboFreeSnapshotVersion(C);p.Xa=p.Xa.insert(v,M)}}})(r.localStore,i))}async function _T(n,e){const t=G(n);if(!t.currentUser.isEqual(e)){D(Tc,"User change. New user:",e.toKey());const r=await fd(t.localStore,e);t.currentUser=e,(function(i,a){i.Ll.forEach((c=>{c.forEach((l=>{l.reject(new L(x.CANCELLED,a))}))})),i.Ll.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await Ns(t,r.iu)}}function yT(n,e){const t=G(n),r=t.Ml.get(e);if(r&&r.xl)return X().add(r.key);{let s=X();const i=t.Cl.get(e);if(!i)return s;for(const a of i??[]){const c=t.Dl.get(a);s=s.unionWith(c.view.Il)}return s}}function xd(n){const e=G(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=Pd.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=yT.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=dT.bind(null,e),e.vl.gr=tT.bind(null,e.eventManager),e.vl.ql=nT.bind(null,e.eventManager),e}function ET(n){const e=G(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=pT.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=mT.bind(null,e),e}class Oi{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Ki(e.databaseInfo.databaseId),this.sharedClientState=this.Wl(e),this.persistence=this.Gl(e),await this.persistence.start(),this.localStore=this.jl(e),this.gcScheduler=this.zl(e,this.localStore),this.indexBackfillerScheduler=this.Hl(e,this.localStore)}zl(e,t){return null}Hl(e,t){return null}jl(e){return Nw(this.persistence,new Sw,e.initialUser,this.serializer)}Gl(e){return new hd(hc.jo,this.serializer)}Wl(e){return new Yw}async terminate(){var e,t;(e=this.gcScheduler)==null||e.stop(),(t=this.indexBackfillerScheduler)==null||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Oi.provider={build:()=>new Oi};class wT extends Oi{constructor(e){super(),this.cacheSizeBytes=e}zl(e,t){U(this.persistence.referenceDelegate instanceof ki,46915);const r=this.persistence.referenceDelegate.garbageCollector;return new wE(r,e.asyncQueue,t)}Gl(e){const t=this.cacheSizeBytes!==void 0?Ue.withCacheSize(this.cacheSizeBytes):Ue.DEFAULT;return new hd((r=>ki.jo(r,t)),this.serializer)}}class ha{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>Ml(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=_T.bind(null,this.syncEngine),await Jw(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new eT})()}createDatastore(e){const t=Ki(e.databaseInfo.databaseId),r=aE(e.databaseInfo);return fE(e.authCredentials,e.appCheckCredentials,r,t)}createRemoteStore(e){return(function(r,s,i,a,c){return new Bw(r,s,i,a,c)})(this.localStore,this.datastore,e.asyncQueue,(t=>Ml(this.syncEngine,t,0)),(function(){return Tl.cn()?new Tl:new rE})())}createSyncEngine(e,t){return(function(s,i,a,c,l,f,p){const m=new oT(s,i,a,c,l,f);return p&&(m.kl=!0),m})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await(async function(s){const i=G(s);D(yt,"RemoteStore shutting down."),i.bu.add(5),await xs(i),i.xu.shutdown(),i.vu.set("Unknown")})(this.remoteStore),(e=this.datastore)==null||e.terminate(),(t=this.eventManager)==null||t.terminate()}}ha.provider={build:()=>new ha};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cn="FirestoreClient";class TT{constructor(e,t,r,s,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=r,this._databaseInfo=s,this.user=Ce.UNAUTHENTICATED,this.clientId=Ra.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(r,(async a=>{D(cn,"Received user=",a.uid),await this.authCredentialListener(a),this.user=a})),this.appCheckCredentials.start(r,(a=>(D(cn,"Received new app check token=",a),this.appCheckCredentialListener(a,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Xt;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const r=Ec(t,"Failed to shutdown persistence");e.reject(r)}})),e.promise}}async function $o(n,e){n.asyncQueue.verifyOperationInProgress(),D(cn,"Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let r=t.initialUser;n.setCredentialChangeListener((async s=>{r.isEqual(s)||(await fd(e.localStore,s),r=s)})),e.persistence.setDatabaseDeletedListener((()=>n.terminate())),n._offlineComponents=e}async function Fl(n,e){n.asyncQueue.verifyOperationInProgress();const t=await vT(n);D(cn,"Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener((r=>kl(e.remoteStore,r))),n.setAppCheckTokenChangeListener(((r,s)=>kl(e.remoteStore,s))),n._onlineComponents=e}async function vT(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){D(cn,"Using user provided OfflineComponentProvider");try{await $o(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(s){return s.name==="FirebaseError"?s.code===x.FAILED_PRECONDITION||s.code===x.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11})(t))throw t;it("Error using user provided cache. Falling back to memory cache: "+t),await $o(n,new Oi)}}else D(cn,"Using default OfflineComponentProvider"),await $o(n,new wT(void 0));return n._offlineComponents}async function Nd(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(D(cn,"Using user provided OnlineComponentProvider"),await Fl(n,n._uninitializedComponentsProvider._online)):(D(cn,"Using default OnlineComponentProvider"),await Fl(n,new ha))),n._onlineComponents}function IT(n){return Nd(n).then((e=>e.syncEngine))}async function fa(n){const e=await Nd(n),t=e.eventManager;return t.onListen=aT.bind(null,e.syncEngine),t.onUnlisten=lT.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=cT.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=hT.bind(null,e.syncEngine),t}function AT(n,e,t,r){const s=new wd(r),i=new Id(e,s,t);return n.asyncQueue.enqueueAndForget((async()=>Td(await fa(n),i))),()=>{s.Mu(),n.asyncQueue.enqueueAndForget((async()=>vd(await fa(n),i)))}}function bT(n,e,t={}){const r=new Xt;return n.asyncQueue.enqueueAndForget((async()=>(function(i,a,c,l,f){const p=new wd({next:v=>{p.Mu(),a.enqueueAndForget((()=>vd(i,m)));const V=v.docs.has(c);!V&&v.fromCache?f.reject(new L(x.UNAVAILABLE,"Failed to get document because the client is offline.")):V&&v.fromCache&&l&&l.source==="server"?f.reject(new L(x.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):f.resolve(v)},error:v=>f.reject(v)}),m=new Id(Hi(c.path),p,{includeMetadataChanges:!0,waitForSyncWhenOnline:!0});return Td(i,m)})(await fa(n),n.asyncQueue,e,t,r))),r.promise}function RT(n,e){const t=new Xt;return n.asyncQueue.enqueueAndForget((async()=>fT(await IT(n),e,t))),t.promise}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let kd=class{constructor(e,t,r,s,i){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new fe(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new PT(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){var e;return((e=this._document)==null?void 0:e.data.clone().value.mapValue.fields)??void 0}get(e){if(this._document){const t=this._document.data.field(Ji("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}},PT=class extends kd{data(){return super.data()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class VT{convertValue(e,t="none"){switch(pe(e)){case 0:return null;case 2:return e.booleanValue;case 3:if("mapValue"in e){if(tn(e))return this.convertToInt32Value(e.mapValue);if(tt(e))return this.convertToDecimal128Value(e.mapValue)}return ue(e.integerValue||e.doubleValue);case 4:return this.convertTimestamp(e.timestampValue);case 6:return this.convertServerTimestamp(e,t);case 7:return e.stringValue;case 8:return"bytesValue"in e?this.convertBytes(Vn(e.bytesValue)):this.convertToBytesWithSubtype(e.mapValue);case 9:return this.convertReference(e.referenceValue);case 11:return this.convertGeoPoint(e.geoPointValue);case 13:return this.convertArray(e.arrayValue,t);case 15:return this.convertObject(e.mapValue,t);case 14:return this.convertVectorValue(e.mapValue);case 12:return this.convertToRegexValue(e.mapValue);case 10:return this.convertToBsonObjectId(e.mapValue);case 5:return this.convertToBsonTimestamp(e.mapValue);case 16:return vt.instance();case 1:return It.instance();default:throw B(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const r={};return Sn(e,((s,i)=>{r[s]=this.convertValue(i,t)})),r}convertVectorValue(e){var r,s,i;const t=(i=(s=(r=e.fields)==null?void 0:r[Jr].arrayValue)==null?void 0:s.values)==null?void 0:i.map((a=>ue(a.doubleValue)));return new $e(t)}convertToBsonObjectId(e){var r,s;const t=((s=(r=e.fields)==null?void 0:r[Yr])==null?void 0:s.stringValue)??"";return new Ba(t)}convertToBytesWithSubtype(e){var c;const t=(c=e.fields)==null?void 0:c[qi],r=t==null?void 0:t.bytesValue;if(!r)throw new Error("Received incorrect bytesValue for Bytes with subtype");const s=Vn(r).toUint8Array();if(s.length===0)throw new Error("Received empty bytesValue for Bytes with subtype");const i=s[0],a=s.slice(1);return new Ge(ae.fromUint8Array(a),i)}convertToBsonTimestamp(e){var i,a,c,l,f,p,m;const t=(i=e.fields)==null?void 0:i[yn],r=Number((l=(c=(a=t==null?void 0:t.mapValue)==null?void 0:a.fields)==null?void 0:c[Ii])==null?void 0:l.integerValue),s=Number((m=(p=(f=t==null?void 0:t.mapValue)==null?void 0:f.fields)==null?void 0:p[Ai])==null?void 0:m.integerValue);return new $a(r,s)}convertToRegexValue(e){var s,i,a,c,l,f,p,m,v,V;const t=((l=(c=(a=(i=(s=e.fields)==null?void 0:s[Wt])==null?void 0:i.mapValue)==null?void 0:a.fields)==null?void 0:c[Ti])==null?void 0:l.stringValue)??"",r=((V=(v=(m=(p=(f=e.fields)==null?void 0:f[Wt])==null?void 0:p.mapValue)==null?void 0:m.fields)==null?void 0:v[vi])==null?void 0:V.stringValue)??"";return new Ga(t,r)}convertToInt32Value(e){var r,s;const t=Number((s=(r=e.fields)==null?void 0:r[Cn])==null?void 0:s.integerValue);return new Wa(t)}convertToDecimal128Value(e){var r,s;const t=((s=(r=e.fields)==null?void 0:r[en])==null?void 0:s.stringValue)??"";return new qa(t)}convertGeoPoint(e){return new pt(ue(e.latitude),ue(e.longitude))}convertArray(e,t){return(e.values||[]).map((r=>this.convertValue(r,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const r=bs(e);return r==null?null:this.convertValue(r,t);case"estimate":return this.convertTimestamp(Zn(e));default:return null}}convertTimestamp(e){const t=Zt(e);return new ee(t.seconds,t.nanos)}convertDocumentKey(e,t){const r=te.fromString(e);U(kf(r),9688,{name:e});const s=new Qr(r.get(1),r.get(3)),i=new $(r.popFirst(5));return s.isEqual(t)||St(`A document reference to ${i} refers to a different database (${s.projectId}/${s.database}), which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ST(n,e,t){let r;return r=n?n.toFirestore(e):e,r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bl="AsyncQueue";class $l{constructor(e=Promise.resolve()){this.iE=[],this.sE=!1,this._E=[],this.oE=null,this.aE=!1,this.uE=!1,this.cE=[],this._r=new Uf(this,"async_queue_retry"),this.lE=()=>{const r=Bo();r&&D(Bl,"Visibility state changed to "+r.visibilityState),this._r.Xn()},this.EE=e;const t=Bo();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.lE)}get isShuttingDown(){return this.sE}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.hE(),this.TE(e)}enterRestrictedMode(e){if(!this.sE){this.sE=!0,this.uE=e||!1;const t=Bo();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.lE)}}enqueue(e){if(this.hE(),this.sE)return new Promise((()=>{}));const t=new Xt;return this.TE((()=>this.sE&&this.uE?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.iE.push(e),this.PE())))}async PE(){if(this.iE.length!==0){try{await this.iE[0](),this.iE.shift(),this._r.reset()}catch(e){if(!ur(e))throw e;D(Bl,"Operation failed with retryable error: "+e)}this.iE.length>0&&this._r.Yn((()=>this.PE()))}}TE(e){const t=this.EE.then((()=>(this.aE=!0,e().catch((r=>{throw this.oE=r,this.aE=!1,St("INTERNAL UNHANDLED ERROR: ",ql(r)),r})).then((r=>(this.aE=!1,r))))));return this.EE=t,t}enqueueAfterDelay(e,t,r){this.hE(),this.cE.indexOf(e)>-1&&(t=0);const s=yc.createAndSchedule(this,e,t,r,(i=>this.IE(i)));return this._E.push(s),s}hE(){this.oE&&B(47125,{RE:ql(this.oE)})}verifyOperationInProgress(){}async AE(){let e;do e=this.EE,await e;while(e!==this.EE)}VE(e){for(const t of this._E)if(t.timerId===e)return!0;return!1}fE(e){return this.AE().then((()=>{this._E.sort(((t,r)=>t.targetTimeMs-r.targetTimeMs));for(const t of this._E)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.AE()}))}dE(e){this.cE.push(e)}IE(e){const t=this._E.indexOf(e);this._E.splice(t,1)}}function ql(n){let e=n.message||"";return n.stack&&(e=n.stack.includes(n.message)?n.stack:n.message+`
`+n.stack),e}class gs extends Ha{constructor(e,t,r,s){super(e,t,r,s),this.type="firestore",this._queue=new $l,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new $l(e),this._firestoreClient=void 0,await e}}}function KT(n,e){const t=typeof n=="object"?n:Zl(),r=typeof n=="string"?n:wi,s=ma(t,"firestore").getImmediate({identifier:r});if(!s._initialized){const i=Ip("firestore");i&&IE(s,...i)}return s}function Ic(n){if(n._terminated)throw new L(x.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||CT(n),n._firestoreClient}function CT(n){var r,s,i,a;const e=n._freezeSettings(),t=pE(n._databaseId,((r=n._app)==null?void 0:r.options.appId)||"",n._persistenceKey,(s=n._app)==null?void 0:s.options.apiKey,e);n._componentsProvider||(i=e.localCache)!=null&&i._offlineComponentProvider&&((a=e.localCache)!=null&&a._onlineComponentProvider)&&(n._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),n._firestoreClient=new TT(n._authCredentials,n._appCheckCredentials,n._queue,t,n._componentsProvider&&(function(l){const f=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(f),_online:f}})(n._componentsProvider))}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dd extends VT{constructor(e){super(),this.firestore=e}convertBytes(e){return new Ge(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new fe(this.firestore,null,t)}}class Lr{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class vn extends kd{constructor(e,t,r,s,i,a){super(e,t,r,s,a),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new fi(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const r=this._document.data.field(Ji("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new L(x.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=vn._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}vn._jsonSchemaVersion="firestore/documentSnapshot/1.0",vn._jsonSchema={type:le("string",vn._jsonSchemaVersion),bundleSource:le("string","DocumentSnapshot"),bundleName:le("string"),bundle:le("string")};class fi extends vn{data(e={}){return super.data(e)}}class Kn{constructor(e,t,r,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new Lr(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((r=>{e.call(t,new fi(this._firestore,this._userDataWriter,r.key,r,new Lr(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new L(x.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(s,i){if(s._snapshot.oldDocs.isEmpty()){let a=0;return s._snapshot.docChanges.map((c=>{Ee(s._snapshot.query)?oa(s._snapshot.query):La(s.query._query);const l=new fi(s._firestore,s._userDataWriter,c.doc.key,c.doc,new Lr(s._snapshot.mutatedKeys.has(c.doc.key),s._snapshot.fromCache),s.query.converter);return c.doc,{type:"added",doc:l,oldIndex:-1,newIndex:a++}}))}{let a=s._snapshot.oldDocs;return s._snapshot.docChanges.filter((c=>i||c.type!==3)).map((c=>{const l=new fi(s._firestore,s._userDataWriter,c.doc.key,c.doc,new Lr(s._snapshot.mutatedKeys.has(c.doc.key),s._snapshot.fromCache),s.query.converter);let f=-1,p=-1;return c.type!==0&&(f=a.indexOf(c.doc.key),a=a.delete(c.doc.key)),c.type!==1&&(a=a.add(c.doc),p=a.indexOf(c.doc.key)),{type:xT(c.type),doc:l,oldIndex:f,newIndex:p}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new L(x.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=Kn._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Ra.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],r=[],s=[];return this.docs.forEach((i=>{i._document!==null&&(t.push(i._document),r.push(this._userDataWriter.convertObjectMap(i._document.data.value.mapValue.fields,"previous")),s.push(i.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function xT(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return B(61501,{type:n})}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Kn._jsonSchemaVersion="firestore/querySnapshot/1.0",Kn._jsonSchema={type:le("string",Kn._jsonSchemaVersion),bundleSource:le("string","QuerySnapshot"),bundleName:le("string"),bundle:le("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function NT(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new L(x.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jl(n){return(function(t,r){if(typeof t!="object"||t===null)return!1;const s=t;for(const i of r)if(i in s&&typeof s[i]=="function")return!0;return!1})(n,["next","error","complete"])}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function QT(n){n=Qt(n,fe);const e=Qt(n.firestore,gs),t=Ic(e);return bT(t,n._key).then((r=>Od(e,n,r)))}function XT(n,e,t){n=Qt(n,fe);const r=Qt(n.firestore,gs),s=ST(n.converter,e),i=PE(r);return kT(r,[VE(i,"setDoc",n._key,s,n.converter!==null,t).toMutation(n._key,bt.none())])}function JT(n,...e){var f,p,m;n=Xe(n);let t={includeMetadataChanges:!1,source:"default"},r=0;typeof e[r]!="object"||jl(e[r])||(t=e[r++]);const s={includeMetadataChanges:t.includeMetadataChanges,source:t.source};if(jl(e[r])){const v=e[r];e[r]=(f=v.next)==null?void 0:f.bind(v),e[r+1]=(p=v.error)==null?void 0:p.bind(v),e[r+2]=(m=v.complete)==null?void 0:m.bind(v)}let i,a,c;if(n instanceof fe)a=Qt(n.firestore,gs),c=Hi(n._key.path),i={next:v=>{e[r]&&e[r](Od(a,n,v))},error:e[r+1],complete:e[r+2]};else{const v=Qt(n,Xi);a=Qt(v.firestore,gs),c=v._query;const V=new Dd(a);i={next:C=>{e[r]&&e[r](new Kn(a,V,v,C))},error:e[r+1],complete:e[r+2]},NT(n._query)}const l=Ic(a);return AT(l,c,s,i)}function kT(n,e){const t=Ic(n);return RT(t,e)}function Od(n,e,t){const r=t.docs.get(e._key),s=new Dd(n);return new vn(n,s,e._key,r,new Lr(t.hasPendingWrites,t.fromCache),e.converter)}const zl="@firebase/firestore",Wl="4.18.0";(function(e,t=!0){O_(sr),Qn(new An("firestore",((r,{instanceIdentifier:s,options:i})=>{const a=r.getProvider("app").getImmediate(),c=new gs(new Zy(r.getProvider("auth-internal")),new nE(a,r.getProvider("app-check-internal")),W_(a,s),a);return i={useFetchStreams:t,...i},c._setSettings(i),c}),"PUBLIC").setMultipleInstances(!0)),Ht(zl,Wl,e),Ht(zl,Wl,"esm2020")})();export{$t as G,OT as a,Zl as b,$T as c,zT as d,KT as e,QT as f,BT as g,MT as h,Vm as i,UT as j,FT as k,JT as l,WT as m,LT as o,XT as s};
