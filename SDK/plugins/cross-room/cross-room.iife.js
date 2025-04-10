"use strict";var CrossRoom=(()=>{var y=Object.defineProperty,W=Object.defineProperties,D=Object.getOwnPropertyDescriptor,H=Object.getOwnPropertyDescriptors,K=Object.getOwnPropertyNames,C=Object.getOwnPropertySymbols;var k=Object.prototype.hasOwnProperty,j=Object.prototype.propertyIsEnumerable;var E=(o,e,r)=>e in o?y(o,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):o[e]=r,A=(o,e)=>{for(var r in e||(e={}))k.call(e,r)&&E(o,r,e[r]);if(C)for(var r of C(e))j.call(e,r)&&E(o,r,e[r]);return o},N=(o,e)=>W(o,H(e));var F=(o,e)=>{for(var r in e)y(o,r,{get:e[r],enumerable:!0})},X=(o,e,r,a)=>{if(e&&typeof e=="object"||typeof e=="function")for(let t of K(e))!k.call(o,t)&&t!==r&&y(o,t,{get:()=>e[t],enumerable:!(a=D(e,t))||a.enumerable});return o};var q=o=>X(y({},"__esModule",{value:!0}),o),x=(o,e,r,a)=>{for(var t=a>1?void 0:a?D(e,r):e,s=o.length-1,n;s>=0;s--)(n=o[s])&&(t=(a?n(e,r,t):n(t))||t);return a&&t&&y(e,r,t),t};var b=(o,e,r)=>E(o,typeof e!="symbol"?e+"":e,r);var $={};F($,{CrossRoom:()=>I,default:()=>Z});var L={properties:{roomId:{type:"number"},strRoomId:{type:"string"}}},U={name:"option",required:!0,properties:N(A({},L.properties),{userId:{type:"string"}})},V={name:"option",required:!0,properties:{updateList:{type:"array",required:!0,arrayItem:{required:!0,type:"object",properties:N(A({},U.properties),{userId:{required:!1,type:"string"},muteAudio:{type:"boolean"},muteVideo:{type:"boolean"},muteSubStream:{type:"boolean"}})}}}},B={name:"option",properties:A({},L.properties)};var p=o=>typeof o=="function";var v=0,J=1,M=2;function z({retryFunction:o,settings:e,onError:r,onRetrying:a,onRetryFailed:t,onRetrySuccess:s,context:n}){return function(...d){let{retries:m=5,timeout:u=1e3}=e,i=0,l=-1,c=v,g=async(h,f)=>{let w=n||this;try{let R=await o.apply(w,d);i>0&&s&&s.call(this,i),i=0,h(R)}catch(R){let P=()=>{clearTimeout(l),i=0,c=M,f(R)},_=()=>{c!==M&&i<(p(m)?m():m)?(i++,c=J,p(a)&&a.call(this,i,P),l=window.setTimeout(()=>{l=-1,g(h,f)},p(u)?u(i):u)):(P(),p(t)&&t.call(this,R))};p(r)?r.call(this,{error:R,retry:_,reject:f,retryFuncArgs:d,retriedCount:i}):_()}};return new Promise(g)}}var G=z;var T=new WeakMap;function O({settings:o={retries:5,timeout:2e3},onError:e,onRetrying:r,onRetryFailed:a}){return function(t,s,n){let d=G({retryFunction:n.value,settings:o,onError({error:m,retry:u,reject:i,retryFuncArgs:l}){var c;e?e.call(this,m,()=>{var g;(g=T.get(t))!=null&&g.has(s)?u():i(m)},i,l):(c=T.get(t))!=null&&c.has(s)?u():i(m)},onRetrying(m,u){var i;p(r)&&r.call(this,m,u),(i=T.get(t))!=null&&i.has(s)&&(T.get(t).get(s).stopRetry=u)},onRetryFailed:a});return n.value=function(...m){let u=T.get(t);return u?u.set(s,{args:m}):T.set(t,new Map([[s,{args:m}]])),d.apply(this,m).finally(()=>{var i;return(i=T.get(t))==null?void 0:i.delete(s)})},n}}var S=class S{constructor(e){this.core=e;b(this,"disableRandomCall",!0);b(this,"connectedRoomIdSet",new Set);b(this,"updateSeq",0);b(this,"_log");this._log=this.core.log.createChild({id:`${this.getAlias()}`})}getName(){return S.Name}getAlias(){return"crs-r"}getGroup(e){var a;let r=(e==null?void 0:e.userId)||((a=e==null?void 0:e.updateList)==null?void 0:a[0].userId)||"";return r||(e?e.updateList?String(e.updateList[0].roomId)||e.updateList[0].strRoomId||"":String(e.roomId)||e.strRoomId||"":"*")}getValidateRule(e){switch(e){case"start":return U;case"update":return V;case"stop":return B}}async start({roomId:e,strRoomId:r,userId:a}){let{RtcError:t,ErrorCode:s}=this.core.errorModule;if(!this.core.room.sendSignalMessage)throw new t({code:s.ENV_NOT_SUPPORTED});let n=e||r,d=await this.core.room.sendSignalMessage({command:"connect_other_room",responseCommand:String(8209),data:{roomId:n,userId:a,localRoomId:a?void 0:this.core.room.roomId},retries:3});if(d.data.code!==0)throw new t({code:s.SERVER_ERROR,extraCode:d.data.code,message:d.data.message});a||this.connectedRoomIdSet.add(n)}async update({updateList:e}){var n;let{RtcError:r,ErrorCode:a}=this.core.errorModule;if(!this.core.room.sendSignalMessage)throw new r({code:a.ENV_NOT_SUPPORTED});let t=e.find(d=>d.userId)?0:1,s=await this.core.room.sendSignalMessage({command:"update_other_room_forward_mode",responseCommand:String(8213),data:{seq:++this.updateSeq,operationType:t,updateList:e.map(({roomId:d,strRoomId:m,userId:u,muteAudio:i,muteVideo:l,muteSubStream:c})=>({roomId:d||m,userId:u,muteAudio:i,muteVideo:l,muteSubStream:c}))},retries:3});if(s.data.data.expectSeq)return this.updateSeq=s.data.data.expectSeq,this.update({updateList:e});if(s.data.code!==0)throw new r({code:a.SERVER_ERROR,extraCode:s.data.code,message:s.data.message});if(((n=s.data.data.errorList)==null?void 0:n.length)>0)throw new r({code:a.UNKNOWN_ERROR,message:s.data.data.errorList[0].message})}async stop({roomId:e,strRoomId:r}={}){let a=e||r;if(a)await this.doStop(a);else if(this.connectedRoomIdSet.size>0)for(let t of[...this.connectedRoomIdSet.values()])await this.doStop(t);else await this.doStop()}async doStop(e){let{RtcError:r,ErrorCode:a}=this.core.errorModule;if(!this.core.room.sendSignalMessage)throw new r({code:a.ENV_NOT_SUPPORTED});let t=await this.core.room.sendSignalMessage({command:"disconnect_other_room",responseCommand:String(8211),data:{roomId:e,localRoomId:this.core.room.roomId},retries:3});if(t.data.code!==0)throw new r({code:a.SERVER_ERROR,extraCode:t.data.code,message:t.data.message});this.connectedRoomIdSet.delete(e)}destroy(){}};b(S,"Name","CrossRoom"),x([O({settings:{retries:3,timeout:1e3},onRetrying(e){this._log.warn(`retry start: ${e}`)}})],S.prototype,"start",1),x([O({settings:{retries:3,timeout:1e3},onRetrying(e){this._log.warn(`retry update: ${e}`)}})],S.prototype,"update",1);var I=S;var Z=I;return q($);})().default;
