import{a7 as H,s,r as N,aC as M,av as je,ao as Ce,az as Le,X as K,a_ as ye,a$ as Oe,af as S,ai as _,b2 as Be,o as C,Y as Q,b3 as $,c as U,aG as Ee,B as R,_ as Se,I as J,a4 as Ne,Z as De,H as Ve,M as xe,a5 as X,O as ze,a as Pe,b as Ie}from"./pinia.esm-browser.b39ed190.js";import{u as Re,_ as $e,i as _e,z as Ue}from"./QRToggle.20701f63.js";/**
 * Vue 3 Carousel 0.1.40
 * (c) 2022
 * @license MIT
 */const g={itemsToShow:1,itemsToScroll:1,modelValue:0,transition:300,autoplay:0,snapAlign:"center",wrapAround:!1,pauseAutoplayOnHover:!1,mouseDrag:!0,touchDrag:!0,dir:"ltr",breakpoints:void 0};function Xe(t,a){let n;return function(...r){n&&clearTimeout(n),n=setTimeout(()=>{t(...r),n=null},a)}}function He(t,a){let n;return function(...r){const v=this;n||(t.apply(v,r),n=!0,setTimeout(()=>n=!1,a))}}function Ye(t){var a,n,r;return t?((n=(a=t[0])===null||a===void 0?void 0:a.type)===null||n===void 0?void 0:n.name)==="CarouselSlide"?t:((r=t[0])===null||r===void 0?void 0:r.children)||[]:[]}function We(t,a){if(t.wrapAround)return a-1;switch(t.snapAlign){case"start":return a-t.itemsToShow;case"end":return a-1;case"center":case"center-odd":return a-Math.ceil(t.itemsToShow/2);case"center-even":return a-Math.ceil(t.itemsToShow/2);default:return 0}}function Fe(t){if(t.wrapAround)return 0;switch(t.snapAlign){case"start":return 0;case"end":return t.itemsToShow-1;case"center":case"center-odd":return Math.floor((t.itemsToShow-1)/2);case"center-even":return Math.floor((t.itemsToShow-2)/2);default:return 0}}function we(t,a,n,r){return t.wrapAround?a:Math.min(Math.max(a,r),n)}function Ge({slidesBuffer:t,currentSlide:a,snapAlign:n,itemsToShow:r,wrapAround:v,slidesCount:u}){let c=t.indexOf(a);if(c===-1&&(c=t.indexOf(Math.ceil(a))),n==="center"||n==="center-odd"?c-=(r-1)/2:n==="center-even"?c-=(r-2)/2:n==="end"&&(c-=r-1),!v){const i=u-r,d=0;c=Math.max(Math.min(c,i),d)}return c}var Ze=H({name:"Carousel",props:{itemsToShow:{default:g.itemsToShow,type:Number},itemsToScroll:{default:g.itemsToScroll,type:Number},wrapAround:{default:g.wrapAround,type:Boolean},snapAlign:{default:g.snapAlign,validator(t){return["start","end","center","center-even","center-odd"].includes(t)}},transition:{default:g.transition,type:Number},breakpoints:{default:g.breakpoints,type:Object},autoplay:{default:g.autoplay,type:Number},pauseAutoplayOnHover:{default:g.pauseAutoplayOnHover,type:Boolean},modelValue:{default:void 0,type:Number},mouseDrag:{default:g.mouseDrag,type:Boolean},touchDrag:{default:g.touchDrag,type:Boolean},dir:{default:g.dir,validator(t){return["rtl","ltr"].includes(t)}},settings:{default(){return{}},type:Object}},setup(t,{slots:a,emit:n,expose:r}){var v;const u=s(null),c=s([]),i=s([]),d=s(0),l=s(1),T=s(null),h=s(null);let x=s({}),w=Object.assign({},g);const o=N(Object.assign({},w)),p=s((v=o.modelValue)!==null&&v!==void 0?v:0),be=s(0),te=s(0),L=s(0),O=s(0);M("config",o),M("slidesBuffer",i),M("slidesCount",l),M("currentSlide",p),M("maxSlide",L),M("minSlide",O);function ae(){const e=Object.assign(Object.assign({},t),t.settings);x=s(Object.assign({},e.breakpoints)),w=Object.assign(Object.assign({},e),{settings:void 0,breakpoints:void 0}),ne(w)}function D(){const e=Object.keys(x.value).map(m=>Number(m)).sort((m,y)=>+y-+m);let f=Object.assign({},w);e.some(m=>window.matchMedia(`(min-width: ${m}px)`).matches?(f=Object.assign(Object.assign({},f),x.value[m]),!0):!1),ne(f)}function ne(e){for(let f in e)o[f]=e[f]}const Ae=Xe(()=>{x.value&&(D(),B()),V()},16);function V(){if(!u.value)return;const e=u.value.getBoundingClientRect();d.value=e.width/o.itemsToShow}function B(){l.value=Math.max(c.value.length,1),!(l.value<=0)&&(te.value=Math.ceil((l.value-1)/2),L.value=We(o,l.value),O.value=Fe(o),p.value=we(o,p.value,L.value,O.value))}function z(){const e=[...Array(l.value).keys()];if(o.wrapAround&&o.itemsToShow+1<=l.value){let y=(o.itemsToShow!==1?Math.round((l.value-o.itemsToShow)/2):0)-p.value;if(o.snapAlign==="end"?y+=Math.floor(o.itemsToShow-1):(o.snapAlign==="center"||o.snapAlign==="center-odd")&&y++,y<0)for(let A=y;A<0;A++)e.push(Number(e.shift()));else for(let A=0;A<y;A++)e.unshift(Number(e.pop()))}i.value=e}je(()=>{x.value&&(D(),B()),Ce(()=>setTimeout(V,16)),o.autoplay&&o.autoplay>0&&se(),window.addEventListener("resize",Ae,{passive:!0})}),Le(()=>{h.value&&clearTimeout(h.value),ue(!1)});let b=!1;const P={x:0,y:0},I={x:0,y:0},j=N({x:0,y:0}),oe=s(!1),W=s(!1),Te=()=>{W.value=!0},ke=()=>{W.value=!1};function le(e){b=e.type==="touchstart",!(!b&&e.button!==0||E.value)&&(oe.value=!0,P.x=b?e.touches[0].clientX:e.clientX,P.y=b?e.touches[0].clientY:e.clientY,document.addEventListener(b?"touchmove":"mousemove",re,!0),document.addEventListener(b?"touchend":"mouseup",ie,!0))}const re=He(e=>{I.x=b?e.touches[0].clientX:e.clientX,I.y=b?e.touches[0].clientY:e.clientY;const f=I.x-P.x,m=I.y-P.y;j.y=m,j.x=f},16);function ie(){oe.value=!1;const e=o.dir==="rtl"?-1:1,f=Math.sign(j.x)*.4,m=Math.round(j.x/d.value+f)*e;let y=we(o,p.value-m,L.value,O.value);if(m){const A=q=>{q.stopPropagation(),window.removeEventListener("click",A,!0)};window.addEventListener("click",A,!0)}k(y),j.x=0,j.y=0,document.removeEventListener(b?"touchmove":"mousemove",re,!0),document.removeEventListener(b?"touchend":"mouseup",ie,!0)}function se(){T.value=setInterval(()=>{o.pauseAutoplayOnHover&&W.value||F()},o.autoplay)}function ue(e=!0){!T.value||(clearInterval(T.value),e&&se())}const E=s(!1);function k(e,f=!1){if(ue(),p.value===e||E.value)return;const m=l.value-1;if(e>m)return k(e-l.value);if(e<0)return k(e+l.value);E.value=!0,be.value=p.value,p.value=e,f||n("update:modelValue",p.value),h.value=setTimeout(()=>{o.wrapAround&&z(),E.value=!1},o.transition)}function F(){let e=p.value+o.itemsToScroll;o.wrapAround||(e=Math.min(e,L.value)),k(e)}function ce(){let e=p.value-o.itemsToScroll;o.wrapAround||(e=Math.max(e,O.value)),k(e)}const de={slideTo:k,next:F,prev:ce};M("nav",de);const ve=K(()=>Ge({slidesBuffer:i.value,itemsToShow:o.itemsToShow,snapAlign:o.snapAlign,wrapAround:Boolean(o.wrapAround),currentSlide:p.value,slidesCount:l.value}));M("slidesToScroll",ve);const Me=K(()=>{const e=o.dir==="rtl"?-1:1,f=ve.value*d.value*e;return{transform:`translateX(${j.x-f}px)`,transition:`${E.value?o.transition:0}ms`}});function fe(){ae()}function me(){ae(),D(),B(),z(),V()}function pe(){B(),z()}ye(()=>Object.values(t),me),fe(),Oe(()=>{const e=l.value!==c.value.length;t.modelValue!==void 0&&p.value!==t.modelValue&&k(Number(t.modelValue),!0),e&&pe()});const he={config:o,slidesBuffer:i,slidesCount:l,slideWidth:d,currentSlide:p,maxSlide:L,minSlide:O,middleSlide:te};r({updateBreakpointsConfigs:D,updateSlidesData:B,updateSlideWidth:V,updateSlidesBuffer:z,initCarousel:fe,restartCarousel:me,updateCarousel:pe,slideTo:k,next:F,prev:ce,nav:de,data:he});const G=a.default||a.slides,Z=a.addons,ge=N(he);return()=>{const e=Ye(G==null?void 0:G(ge)),f=(Z==null?void 0:Z(ge))||[];c.value=e,e.forEach((A,q)=>A.props.index=q);const m=S("ol",{class:"carousel__track",style:Me.value,onMousedown:o.mouseDrag?le:null,onTouchstart:o.touchDrag?le:null},e),y=S("div",{class:"carousel__viewport"},m);return S("section",{ref:u,class:{carousel:!0,"carousel--rtl":o.dir==="rtl"},dir:o.dir,"aria-label":"Gallery",onMouseenter:Te,onMouseleave:ke},[y,f])}}});const qe={arrowUp:"M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z",arrowDown:"M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z",arrowRight:"M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z",arrowLeft:"M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"},ee=t=>{const a=t.name;if(!a||typeof a!="string")return;const n=qe[a],r=S("path",{d:n}),v=t.title||a,u=S("title",null,a);return S("svg",{class:"carousel__icon",viewBox:"0 0 24 24",role:"img",ariaLabel:v},[u,r])};ee.props={name:String,title:String};const Je=(t,{slots:a,attrs:n})=>{const{next:r,prev:v}=a,u=_("config",N(Object.assign({},g))),c=_("maxSlide",s(1)),i=_("minSlide",s(1)),d=_("currentSlide",s(1)),l=_("nav",{}),T=u.dir==="rtl",h=S("button",{type:"button",class:["carousel__prev",!u.wrapAround&&d.value<=i.value&&"carousel__prev--in-active",n==null?void 0:n.class],"aria-label":"Navigate to previous slide",onClick:l.prev},(v==null?void 0:v())||S(ee,{name:T?"arrowRight":"arrowLeft"})),x=S("button",{type:"button",class:["carousel__next",!u.wrapAround&&d.value>=c.value&&"carousel__next--in-active",n==null?void 0:n.class],"aria-label":"Navigate to next slide",onClick:l.next},(r==null?void 0:r())||S(ee,{name:T?"arrowLeft":"arrowRight"}));return[h,x]};var Ke=H({name:"CarouselSlide",props:{index:{type:Number,default:1}},setup(t,{slots:a}){const n=_("config",N(Object.assign({},g))),r=_("slidesBuffer",s([])),v=_("currentSlide",s(0)),u=_("slidesToScroll",s(0)),c=s(t.index);n.wrapAround&&(i(),ye(r,i));function i(){c.value=r.value.indexOf(t.index)}const d=K(()=>{const w=n.itemsToShow;return{width:`${1/w*100}%`,order:c.value.toString()}}),l=()=>t.index===v.value,T=()=>{const w=Math.ceil(u.value),o=Math.floor(u.value+n.itemsToShow);return r.value.slice(w,o).includes(t.index)},h=()=>t.index===r.value[Math.ceil(u.value)-1],x=()=>t.index===r.value[Math.floor(u.value+n.itemsToShow)];return()=>{var w;return S("li",{style:d.value,class:{carousel__slide:!0,"carousel__slide--active":l(),"carousel__slide--visible":T(),"carousel__slide--prev":h(),"carousel__slide--next":x()}},(w=a.default)===null||w===void 0?void 0:w.call(a))}}});const Qe=()=>{const t=_("maxSlide",s(1)),a=_("minSlide",s(1)),n=_("currentSlide",s(1)),r=_("nav",{});function v(i){r.slideTo(i)}const u=i=>{const d=n.value;return d===i||d>t.value&&i>=t.value||d<a.value&&i<=a.value},c=[];for(let i=a.value;i<t.value+1;i++){const d=S("button",{type:"button",class:{"carousel__pagination-button":!0,"carousel__pagination-button--active":u(i)},"aria-label":`Navigate to slide ${i+1}`,onClick:()=>v(i)}),l=S("li",{class:"carousel__pagination-item",key:i},d);c.push(l)}return S("ol",{class:"carousel__pagination"},c)};const et={key:0,class:"en"},tt={key:1,class:"ja"},at=H({name:"SlidesDisplay",async setup(t){let a,n;const{addWordsFromURLSearchParams:r}=Re(),v=([a,n]=Be(()=>r()),a=await a,n(),a),u=s([]),i=new URLSearchParams(window.location.search).get("type");for(const l of v)(!i||i.includes("en"))&&u.value.push({image:l.image,text:{en:Array.isArray(l.en)?l.en[0]:l.en}}),i!=null&&i.includes("ja")&&u.value.push({image:l.image,text:{ja:{hiragana:Array.isArray(l.ja)?l.ja[0].hiragana:l.ja.hiragana,kanji:Array.isArray(l.ja)?l.ja[0].kanji:l.ja.kanji}}});let d=s(null);return window.addEventListener("keydown",l=>{switch(l.key){case"ArrowLeft":d.value.prev();break;case"ArrowRight":d.value.next();break}}),(l,T)=>(C(),Q(R(Ze),{"items-to-show":1.1,"wrap-around":!0,ref_key:"myCarousel",ref:d},{slides:$(()=>[(C(!0),U(xe,null,Ee(u.value,(h,x)=>(C(),Q(R(Ke),{key:x},{default:$(()=>[Se("div",{class:"carousel__item",style:Ve({backgroundImage:`url(${h.image})`})},[h.text.en?(C(),U("ruby",et,J(h.text.en),1)):h.text.ja?(C(),U("ruby",tt,[Ne(J(h.text.ja.kanji),1),Se("rt",null,J(h.text.ja.hiragana),1)])):De("",!0)],4)]),_:2},1024))),128))]),addons:$(()=>[X(R(Je)),X(R(Qe))]),_:1},8,["items-to-show"]))}});const nt=H({name:"SlidesApp",setup(t){return(a,n)=>(C(),U(xe,null,[X($e),(C(),Q(ze,null,{default:$(()=>[X(at)]),_:1}))],64))}}),Y=Pe(nt);Y.component(_e.name,_e);Y.use(Ie());Y.use(Ue);Y.mount("#app");