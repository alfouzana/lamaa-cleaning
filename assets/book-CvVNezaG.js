import{P as y,H as c,W as N,S as w,A as S,T,N as B,C as U,E as W,a as Y}from"./config-t6AVxiv0.js";const d=["نوع المكان","حجم المكان","الخدمات","الموعد","ملخص الطلب","بياناتك"],e={step:0,type:null,rooms:1,baths:1,services:[],addons:[],date:null,slot:null,hours:c.included,name:"",phone:"",district:"",address:"",notes:"",calMonth:null,tried:!1},i=t=>document.querySelector(t),m=t=>String(t).replace(/[&<>"']/g,s=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[s]),r=t=>`${t.toLocaleString("en-US")} ${U}`,E=()=>y.find(t=>t.id===e.type),R=t=>new Date(t+"T12:00:00").toLocaleDateString("ar-SA-u-ca-gregory-nu-latn",{weekday:"long",day:"numeric",month:"long",year:"numeric"}),F=()=>{const t=new Date;return k(t.getFullYear(),t.getMonth(),t.getDate())},k=(t,s,a)=>`${t}-${String(s+1).padStart(2,"0")}-${String(a).padStart(2,"0")}`;function M(){const t=E();if(!t)return 0;let s=t.base;s+=Math.max(0,e.rooms-t.baseRooms)*W,s+=Math.max(0,e.baths-t.baseBaths)*Y;for(const a of e.services)s+=w.find(n=>n.id===a)?.price||0;for(const a of e.addons)s+=S.find(n=>n.id===a)?.price||0;return s+=Math.max(0,e.hours-c.included)*c.extraHourPrice,s}function C(){const t=E();if(!t)return"";const s=[t.name];return t.rooms[1]>t.rooms[0]&&s.push(`${e.rooms} غرف`),s.push(`${e.baths} دورة مياه`),s.join("، ")}const O=()=>[...e.services.map(t=>w.find(s=>s.id===t).name),...e.addons.map(t=>S.find(s=>s.id===t).name)].join("، "),P=()=>T.find(t=>t.id===e.slot);function A(t){let s=t.replace(/[٠-٩]/g,a=>"٠١٢٣٤٥٦٧٨٩".indexOf(a)).replace(/\D/g,"");return s.startsWith("00966")?s=s.slice(5):s.startsWith("966")?s=s.slice(3):s.startsWith("0")&&(s=s.slice(1)),/^5\d{8}$/.test(s)?"0"+s:null}const j=()=>({name:e.name.trim().length<2?"اكتب اسمك":null,phone:A(e.phone)?null:"رقم جوال سعودي صحيح يبدأ بـ 05 (10 أرقام)",district:e.district.trim()?null:"اختر الحي أو اكتبه",address:e.address.trim().length<3?"اكتب عنواناً مختصراً أو الصق رابط الموقع":null});function g(t=e.step){return t===0?!!e.type:t===1?!0:t===2?e.services.length+e.addons.length>0:t===3?!!e.date&&!!e.slot:t===4?!0:t===5?Object.values(j()).every(s=>!s):!0}const u=(t,s="")=>`<h1 class="text-2xl font-extrabold md:text-3xl">${t}</h1>${s?`<p class="mt-2 text-slate-600">${s}</p>`:""}`;function v(t,s,[a,n]){return`<div class="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5">
    <span class="text-lg font-bold">${s}</span>
    <div class="flex items-center gap-4">
      <button data-dec="${t}" data-min="${a}" class="h-11 w-11 rounded-full border border-slate-300 text-2xl leading-none hover:border-brand disabled:opacity-30" ${e[t]<=a?"disabled":""}>−</button>
      <span class="w-8 text-center text-2xl font-extrabold">${e[t]}</span>
      <button data-inc="${t}" data-max="${n}" class="h-11 w-11 rounded-full border border-slate-300 text-2xl leading-none hover:border-brand disabled:opacity-30" ${e[t]>=n?"disabled":""}>+</button>
    </div>
  </div>`}function z(){const t=new Date;e.calMonth||(e.calMonth={y:t.getFullYear(),m:t.getMonth()});const{y:s,m:a}=e.calMonth,n=new Date(s,a,1).getDay(),o=new Date(s,a+1,0).getDate(),b=F(),_=s===t.getFullYear()&&a===t.getMonth(),I=new Date(s,a,1).toLocaleDateString("ar-SA-u-ca-gregory-nu-latn",{month:"long",year:"numeric"});let h="";for(let l=0;l<n;l++)h+="<span></span>";for(let l=1;l<=o;l++){const x=k(s,a,l),D=x<b,q=x===e.date;h+=`<button data-date="${x}" ${D?"disabled":""} class="aspect-square rounded-xl text-base font-bold transition ${q?"bg-brand text-white":D?"text-slate-300":"hover:bg-brand/10"}">${l}</button>`}return`<div class="rounded-2xl border border-slate-200 bg-white p-4">
    <div class="mb-3 flex items-center justify-between">
      <button data-cal="-1" class="h-9 w-9 rounded-full hover:bg-slate-100 disabled:opacity-30" ${_?"disabled":""} aria-label="الشهر السابق">→</button>
      <span class="font-bold">${I}</span>
      <button data-cal="1" class="h-9 w-9 rounded-full hover:bg-slate-100" aria-label="الشهر التالي">←</button>
    </div>
    <div class="grid grid-cols-7 gap-1 text-center text-xs text-slate-500">${["أحد","إثنين","ثلاثاء","أربعاء","خميس","جمعة","سبت"].map(l=>`<span class="py-1">${l}</span>`).join("")}</div>
    <div class="mt-1 grid grid-cols-7 gap-1">${h}</div>
  </div>`}function p(t,s,a,n){const o=e.tried&&n;return`<label class="block"><span class="mb-1.5 block font-bold">${s}</span>${a}
    <span data-err="${t}" class="mt-1 block text-sm text-red-600 ${o?"":"hidden"}">${n||""}</span></label>`}const f=(t,s,a)=>`<div class="flex items-start justify-between gap-4 border-b border-slate-100 py-3.5 last:border-0">
  <div><div class="text-sm text-slate-500">${t}</div><div class="mt-0.5 font-bold">${m(s)}</div></div>
  <button data-goto="${a}" class="shrink-0 text-sm font-bold text-brand hover:underline">تعديل</button></div>`,V=[()=>`${u("وش نوع المكان؟","اختر نوع المكان اللي تبي ننظفه")}
    <div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">${y.map(t=>`
      <button data-type="${t.id}" class="choice ${e.type===t.id?"active":""}">
        <div class="text-4xl">${t.icon}</div><div class="mt-2 font-bold">${t.name}</div>
        <div class="mt-1 text-sm text-slate-500">من ${r(t.base)}</div></button>`).join("")}</div>`,()=>{const t=E();return`${u("حجم المكان",`${t.name}: حدد عدد ${t.rooms[1]>t.rooms[0]?"الغرف و":""}دورات المياه`)}
      <div class="mt-6 space-y-3">
        ${t.rooms[1]>t.rooms[0]?v("rooms",t.id==="office"?"عدد الغرف / المكاتب":"عدد الغرف",t.rooms):""}
        ${v("baths","عدد دورات المياه",t.baths)}
      </div>
      <p class="mt-4 text-sm text-slate-500">السعر الأساسي يشمل ${t.rooms[1]>t.rooms[0]?`${t.baseRooms} غرف و`:""}${t.baseBaths} دورة مياه، وكل زيادة تُضاف للسعر.</p>`},()=>`${u("الخدمات المطلوبة","اختر خدمة أو أكثر")}
    <div class="mt-6 grid gap-3 sm:grid-cols-2">${w.map(t=>`
      <button data-service="${t.id}" class="choice flex items-center justify-between text-start ${e.services.includes(t.id)?"active":""}">
        <span class="font-bold">${t.name}</span><span class="text-sm text-slate-500">${t.price?"+"+r(t.price):"مشمولة"}</span></button>`).join("")}</div>
    <h2 class="mt-8 text-lg font-extrabold">إضافات اختيارية</h2>
    <div class="mt-3 grid gap-3 sm:grid-cols-2">${S.map(t=>`
      <button data-addon="${t.id}" class="choice flex items-center justify-between text-start ${e.addons.includes(t.id)?"active":""}">
        <span class="font-bold">✨ ${t.name}</span><span class="text-sm text-slate-500">+${r(t.price)}</span></button>`).join("")}</div>`,()=>`${u("اختر الموعد","اليوم، ثم الفترة، ثم عدد الساعات")}
    <div class="mt-6">${z()}</div>
    <h2 class="mt-6 font-extrabold">الفترة</h2>
    <div class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">${T.map(t=>`
      <button data-slot="${t.id}" class="choice ${e.slot===t.id?"active":""}"><div class="font-bold">${t.name}</div><div class="mt-1 text-xs text-slate-500" dir="ltr">${t.hint}</div></button>`).join("")}</div>
    <h2 class="mt-6 font-extrabold">عدد الساعات</h2>
    <div class="mt-3">${v("hours","ساعات العمل",[c.min,c.max])}</div>
    <p class="mt-2 text-sm text-slate-500">السعر يشمل حتى ${c.included} ساعات، وكل ساعة إضافية +${r(c.extraHourPrice)}.</p>`,()=>`${u("ملخص طلبك","راجع اختياراتك، وتقدر تعدل أي شيء")}
    <div class="mt-6 rounded-2xl border border-slate-200 bg-white px-5">
      ${f("نوع المكان وحجمه",C(),0)}
      ${f("الخدمات",O(),2)}
      ${f("التاريخ والوقت",`${R(e.date)}، ${P().name}`,3)}
      ${f("عدد الساعات",`${e.hours} ساعات`,3)}
    </div>
    <div class="mt-4 rounded-2xl bg-brand p-6 text-white">
      <div class="text-sm text-white/80">السعر التقديري</div>
      <div class="mt-1 text-4xl font-extrabold">${r(M())}</div>
      <div class="mt-3 text-sm text-white/90">السعر تقديري ويتأكد عند التواصل · الأسعار لا تشمل الضريبة</div>
    </div>`,()=>{const t=j();return`${u("بياناتك","آخر خطوة، عشان نتواصل معك ونأكد الموعد")}
    <div class="mt-6 space-y-4">
      ${p("name","الاسم *",`<input data-f="name" class="field" autocomplete="name" value="${m(e.name)}" />`,t.name)}
      ${p("phone","رقم الجوال *",`<input data-f="phone" class="field text-start" inputmode="tel" dir="ltr" placeholder="05XXXXXXXX" autocomplete="tel" value="${m(e.phone)}" />`,t.phone)}
      ${p("district","الحي في الخبر *",`<input data-f="district" class="field" list="districts" placeholder="مثال: العقربية" value="${m(e.district)}" /><datalist id="districts">${B.map(s=>`<option value="${s}">`).join("")}</datalist>`,t.district)}
      ${p("address","عنوان مختصر أو رابط الموقع *",`<input data-f="address" class="field" placeholder="الشارع ورقم المبنى، أو رابط خرائط قوقل" value="${m(e.address)}" />`,t.address)}
      ${p("notes","ملاحظات (اختياري)",`<textarea data-f="notes" rows="3" class="field" placeholder="أي تفاصيل تساعدنا">${m(e.notes)}</textarea>`,null)}
    </div>`}];function G(){return`<div class="py-12 text-center">
    <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand/10 text-4xl">✓</div>
    <h1 class="mt-6 text-3xl font-extrabold">وصلنا طلبك، وبنتواصل معك لتأكيد الموعد</h1>
    <p class="mt-3 text-slate-600">شكراً لاختيارك لمعة 🤍</p>
    <p class="mt-8 text-sm text-slate-500">ما انفتح واتساب؟</p>
    <a href="${X()}" target="_blank" rel="noopener" class="mt-2 inline-block rounded-full bg-[#25D366] px-6 py-3 font-bold text-white">أرسل الطلب عبر واتساب</a>
    <div class="mt-6"><a href="./" class="font-bold text-brand">العودة للرئيسية</a></div>
  </div>`}function J(){return["طلب حجز جديد، لمعة",`الاسم: ${e.name.trim()}`,`الجوال: ${A(e.phone)}`,`الحي: ${e.district.trim()}`,`العنوان: ${e.address.trim()}`,`نوع المكان وحجمه: ${C()}`,`الخدمات: ${O()}`,`التاريخ والوقت: ${R(e.date)}، ${P().name}`,`عدد الساعات: ${e.hours}`,`السعر التقديري: ${r(M())} (بدون ضريبة)`,`ملاحظات: ${e.notes.trim()||"لا يوجد"}`].join(`
`)}const X=()=>`https://wa.me/${N}?text=${encodeURIComponent(J())}`;function $(){const t=e.step>=d.length;i("#step").innerHTML=t?G():V[e.step](),i("#progress").style.width=`${t?100:(e.step+1)/d.length*100}%`,i("#stepLabel").textContent=t?"تم":`الخطوة ${e.step+1} من ${d.length} · ${d[e.step]}`,i("#nav").classList.toggle("hidden",t),i("#back").style.visibility=e.step===0?"hidden":"visible";const s=e.step===d.length-1,a=i("#next");a.textContent=s?"أرسل الطلب عبر واتساب":"التالي",a.classList.toggle("bg-[#25D366]",s),a.classList.toggle("bg-brand",!s),a.disabled=!s&&!g(),i("#livePrice").textContent=e.type?r(M()):"—"}function H(){const t=j();for(const[s,a]of Object.entries(t)){const n=document.querySelector(`[data-err="${s}"]`),o=document.querySelector(`[data-f="${s}"]`),b=e.tried&&!!a;n&&(n.textContent=a||"",n.classList.toggle("hidden",!b)),o?.classList.toggle("invalid",b)}}const L=(t,s)=>t.includes(s)?t.filter(a=>a!==s):[...t,s];document.addEventListener("click",t=>{const s=t.target.closest("button");if(!s||s.disabled)return;const a=s.dataset;if(a.type){const n=y.find(o=>o.id===a.type);e.type!==a.type&&(e.rooms=n.rooms[0],e.baths=n.baths[0]),e.type=a.type}else if(a.inc)e[a.inc]=Math.min(+a.max,e[a.inc]+1);else if(a.dec)e[a.dec]=Math.max(+a.min,e[a.dec]-1);else if(a.service)e.services=L(e.services,a.service);else if(a.addon)e.addons=L(e.addons,a.addon);else if(a.slot)e.slot=a.slot;else if(a.date)e.date=a.date;else if(a.cal){let{y:n,m:o}=e.calMonth;o+=+a.cal,o<0?(o=11,n--):o>11&&(o=0,n++),e.calMonth={y:n,m:o}}else if(a.goto)e.step=+a.goto,window.scrollTo(0,0);else return;$()});document.addEventListener("input",t=>{const s=t.target.dataset?.f;s&&(e[s]=t.target.value,H())});i("#back").addEventListener("click",()=>{e.step>0&&(e.step--,$(),window.scrollTo(0,0))});i("#next").addEventListener("click",()=>{if(e.step===d.length-1){if(e.tried=!0,!g()){H(),document.querySelector(".field.invalid")?.focus();return}window.open(X(),"_blank"),e.step=d.length}else g()&&e.step++;$(),window.scrollTo(0,0)});$();
