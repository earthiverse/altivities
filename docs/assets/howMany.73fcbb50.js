import{d as P,e as A,r as $,f as N,o as h,c as w,g as S,w as z,h as n,u as l,i as T,j as C,F as L,k as E,p as D,n as x,t as H,a as V,b as j}from"./pinia.esm-browser.14892411.js";import{_ as Q,i as R,z as q}from"./QRToggle.d3f2701f.js";import{a as G,r as y}from"./random.9fb4bc4f.js";import{u as M}from"./url.ba275dec.js";import{_ as K}from"./plugin-vue_export-helper.21dcd24c.js";const O=P({id:"how_many",state:()=>({cols:5,rows:5,cells:new Array,hidden:!1,howManyQuestion:0}),actions:{checkAnswer(t){let e=0;for(const s of this.cells)this.howManyQuestion==s.index&&(e+=1);return e==t},randomize(t){const e=t.length;this.cells.splice(0,this.cells.length);for(let s=0;s<this.cols*this.rows;s++){const d=y(0,e-1);this.cells.push({index:d,selected:!1,style:G(),word:t[d]})}this.hidden=!1,this.howManyQuestion=y(0,e-1)},setSettingsFromURLSearchParams(){const t=new URLSearchParams(window.location.search),e=t.get("rows");e&&(this.rows=Number.parseInt(e));const s=t.get("cols");s&&(this.cols=Number.parseInt(s))}}}),J="https://altivities.earthiverse.ca/wordlists/Plurals",X={General:{prefix:`${J}/`,lists:{fruits:{name:"Fruits",wordList:"fruits.json"}}}},U=P({id:"word_list",state:()=>({wordLists:new Array,numWords:0}),getters:{curatedWordLists:()=>X,getWordByIndex:t=>e=>{let s=0;for(const d of t.wordLists)for(const r of d){if(s==e)return r;s++}},words:t=>t.wordLists.flat()},actions:{async addWordsFromURLSearchParams(t="wordlist",e="wordlists",s="ignore",d="include"){const r=new URLSearchParams(window.location.search);let o=[];const u=r.get(t);if(u){const i=await(await fetch(u)).json();o.push(...i)}const _=r.get(e);if(_)for(const a of _.split(",")){const b=await(await fetch(a)).json();o.push(...b)}const p=r.get(s);if(p){const a=p.split(",");for(let i=0;i<o.length;i++){const b=o[i];for(const v of a)if(b.singular.en==v){o.splice(i,1),i-=1;break}}}const m=r.get(d);if(m){const a=m.split(","),i=[];for(;a.length>0;){const b=a.shift();for(const v of o)if(v.singular.en==b){i.push(v);break}}o=i}for(const a of o)a.id=this.numWords,this.numWords++;this.wordLists.push(o);let c=1,g=`${c}_wordlist`,f=`${c}_wordlists`;for(;r.has(g)||r.has(f);)this.addWordsFromURLSearchParams(g,f,`${c}_ignore`,`${c}_include`),c+=1,g=`${c}_wordlist`,f=`${c}_wordlists`;return this.words},resetStore(){this.wordLists.splice(0,this.wordLists.length),this.numWords=0}}});const Y=["onSubmit"],Z=E(" # Rows "),ss=["value"],es=E(" # Columns "),ts=["value"],ns=n("input",{type:"submit",value:"Set"},null,-1),os=A({name:"HowManySettingsToggle",setup(t){let e=$(!1);const s=O(),d=U();function r(){const o=Number.parseInt(document.querySelector('input[name="rows"]').value),u=Number.parseInt(document.querySelector('input[name="cols"]').value);s.rows=o,s.cols=u,M("rows",o.toString()),M("cols",u.toString()),s.randomize(d.words),e.value=!1}return(o,u)=>{const _=N("vue-final-modal");return h(),w(L,null,[S(_,{modelValue:l(e),"onUpdate:modelValue":u[0]||(u[0]=p=>C(e)?e.value=p:e=p),classes:"modal-container","content-class":"modal-content"},{default:z(()=>[n("form",{class:"how-many-settings-form",onSubmit:T(r,["prevent"]),name:"type"},[Z,n("input",{type:"number",id:"rows",name:"rows",value:l(s).rows},null,8,ss),es,n("input",{type:"number",id:"cols",name:"cols",value:l(s).cols},null,8,ts),ns],40,Y)]),_:1},8,["modelValue"]),n("span",{class:"material-symbols-outlined button button-top button-left-2 settings-button",onClick:u[1]||(u[1]=p=>C(e)?e.value=!0:e=!0)},"settings")],64)}}});const as={id:"maru_batsu_correct",class:"correct"},rs=["src"],is={id:"maru_batsu_incorrect",class:"incorrect"},us=["src"],B=["/assets/images/correct/bear.png","/assets/images/correct/cat.png","/assets/images/correct/dog.png","/assets/images/correct/man.png","/assets/images/correct/rabbit.png","/assets/images/correct/woman.png"],k=["/assets/images/incorrect/bear.png","/assets/images/incorrect/cat.png","/assets/images/incorrect/dog.png","/assets/images/incorrect/man.png","/assets/images/incorrect/rabbit.png","/assets/images/incorrect/woman.png"];let F=$(0),W=$(0);function cs(){const t=document.getElementById("maru_batsu_correct");t.classList.contains("fadeInAndOut")||(F.value=y(0,B.length-1),t.addEventListener("animationend",()=>{t.classList.remove("fadeInAndOut"),W.value=y(0,k.length-1)},!0),t.classList.add("fadeInAndOut"))}function ds(){const t=document.getElementById("maru_batsu_incorrect");t.classList.contains("fadeInAndOut")||(t.addEventListener("animationend",()=>{t.classList.remove("fadeInAndOut"),W.value=y(0,k.length-1)},!0),t.classList.add("fadeInAndOut"))}const ls=A({name:"MaruBatsuDisplay",setup(t){return(e,s)=>(h(),w(L,null,[n("div",as,[n("img",{id:"maru_batsu_correct_img",src:B[l(F)]},null,8,rs)]),n("div",is,[n("img",{id:"maru_batsu_incorrect_img",src:k[l(W)]},null,8,us)])],64))}});var ms=K(ls,[["__scopeId","data-v-0ef46f00"]]);const ps={id:"top",style:{flexWrap:"wrap"}},_s=["onClick"],hs=["src"],ws={class:"bottom-menu"},gs=n("div",null,"How many",-1),fs={class:"text"},bs=n("div",null,"?",-1),ys=["onSubmit"],vs=["max"],Ss=n("input",{type:"submit",value:"Check!"},null,-1),Ls=A({name:"HowManyApp",setup(t){const e=U(),s=O();e.addWordsFromURLSearchParams().then(()=>{s.setSettingsFromURLSearchParams(),s.randomize(e.words)});const d={1:"/assets/audio/numbers/1.mp3",2:"/assets/audio/numbers/2.mp3",3:"/assets/audio/numbers/3.mp3",4:"/assets/audio/numbers/4.mp3",5:"/assets/audio/numbers/5.mp3",6:"/assets/audio/numbers/6.mp3",7:"/assets/audio/numbers/7.mp3",8:"/assets/audio/numbers/8.mp3",9:"/assets/audio/numbers/9.mp3",10:"/assets/audio/numbers/10.mp3",11:"/assets/audio/numbers/11.mp3",12:"/assets/audio/numbers/12.mp3",13:"/assets/audio/numbers/13.mp3",14:"/assets/audio/numbers/14.mp3",15:"/assets/audio/numbers/15.mp3",16:"/assets/audio/numbers/16.mp3",17:"/assets/audio/numbers/17.mp3",18:"/assets/audio/numbers/18.mp3",19:"/assets/audio/numbers/19.mp3",20:"/assets/audio/numbers/20.mp3",30:"/assets/audio/numbers/30.mp3",40:"/assets/audio/numbers/40.mp3",50:"/assets/audio/numbers/50.mp3",60:"/assets/audio/numbers/60.mp3",70:"/assets/audio/numbers/70.mp3",80:"/assets/audio/numbers/80.mp3",90:"/assets/audio/numbers/90.mp3"};function r(){return e.getWordByIndex(s.howManyQuestion)}let o=0;function u(m){if(s.hidden||m.selected)return;const c=s.howManyQuestion;m.index==c?(m.selected=!0,new Audio("/assets/audio/sfx/correct.mp3").play(),o+=1,d[o]&&new Audio(d[o]).play()):new Audio("/assets/audio/sfx/incorrect.mp3").play()}function _(){s.hidden=!s.hidden}function p(){const m=document.querySelector('input[name="answer"]'),c=Number.parseInt(m.value);s.checkAnswer(c)?(new Audio("/assets/audio/sfx/complete.mp3").play(),cs(),s.hidden=!0,setTimeout(()=>{m.value="",o=0,s.randomize(e.words)},2e3)):(new Audio("/assets/audio/sfx/incorrect.mp3").play(),ds())}return(m,c)=>{var g,f;return h(),w(L,null,[S(Q),S(os),l(s).hidden?(h(),w("span",{key:0,onClick:_,class:"material-symbols-outlined button button-top button-right-1"}," image ")):(h(),w("span",{key:1,onClick:_,class:"material-symbols-outlined button button-top button-right-1"}," hide_image ")),S(ms),n("div",ps,[(h(!0),w(L,null,D(l(s).cells,(a,i)=>(h(),w("div",{class:"cell",key:i,style:x({height:`calc((100% / ${l(s).rows}))`,opacity:l(s).hidden?0:a.selected?.5:1,width:`calc((100% / ${l(s).cols}))`}),onClick:b=>u(a)},[n("img",{src:a.word.singular.image,style:x(a.style)},null,12,hs)],12,_s))),128))]),n("div",ws,[gs,n("div",{class:"card",style:x({backgroundImage:`url(${(g=r())==null?void 0:g.plural.image})`})},[n("span",fs,H((f=r())==null?void 0:f.plural.en),1)],4),bs,n("form",{class:"form",onSubmit:T(p,["prevent"])},[n("input",{type:"number",min:"0",name:"answer",placeholder:"__",required:"",max:l(s).cells.length},null,8,vs),Ss],40,ys)])],64)}}}),I=V(Ls);I.component(R.name,R);I.use(j());I.use(q);I.mount("#app");