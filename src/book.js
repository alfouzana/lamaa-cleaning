import "./style.css";
import {
  WHATSAPP_NUMBER, CURRENCY, PLACE_TYPES, EXTRA_ROOM_PRICE, EXTRA_BATH_PRICE,
  SERVICES, ADDONS, TIME_SLOTS, HOURS, NEIGHBORHOODS,
} from "./config.js";

const STEPS = ["نوع المكان", "حجم المكان", "الخدمات", "الموعد", "ملخص الطلب", "بياناتك"];

const state = {
  step: 0,
  type: null, rooms: 1, baths: 1,
  services: [], addons: [],
  date: null, slot: null, hours: HOURS.included,
  name: "", phone: "", district: "", address: "", notes: "",
  calMonth: null, tried: false,
};

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = (n) => `${n.toLocaleString("en-US")} ${CURRENCY}`;
const place = () => PLACE_TYPES.find((p) => p.id === state.type);
const fmtDate = (iso) => new Date(iso + "T12:00:00").toLocaleDateString("ar-SA-u-ca-gregory-nu-latn", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const todayISO = () => { const d = new Date(); return iso(d.getFullYear(), d.getMonth(), d.getDate()); };
const iso = (y, m, d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

function price() {
  const p = place();
  if (!p) return 0;
  let total = p.base;
  total += Math.max(0, state.rooms - p.baseRooms) * EXTRA_ROOM_PRICE;
  total += Math.max(0, state.baths - p.baseBaths) * EXTRA_BATH_PRICE;
  for (const id of state.services) total += SERVICES.find((s) => s.id === id)?.price || 0;
  for (const id of state.addons) total += ADDONS.find((a) => a.id === id)?.price || 0;
  total += Math.max(0, state.hours - HOURS.included) * HOURS.extraHourPrice;
  return total;
}

function sizeText() {
  const p = place();
  if (!p) return "";
  const parts = [p.name];
  if (p.rooms[1] > p.rooms[0]) parts.push(`${state.rooms} غرف`);
  parts.push(`${state.baths} دورة مياه`);
  return parts.join("، ");
}
const servicesText = () => [
  ...state.services.map((id) => SERVICES.find((s) => s.id === id).name),
  ...state.addons.map((id) => ADDONS.find((a) => a.id === id).name),
].join("، ");
const slotObj = () => TIME_SLOTS.find((t) => t.id === state.slot);

// ---- validation ----
function normalizePhone(v) {
  let d = v.replace(/[٠-٩]/g, (c) => "٠١٢٣٤٥٦٧٨٩".indexOf(c)).replace(/\D/g, "");
  if (d.startsWith("00966")) d = d.slice(5);
  else if (d.startsWith("966")) d = d.slice(3);
  else if (d.startsWith("0")) d = d.slice(1);
  return /^5\d{8}$/.test(d) ? "0" + d : null;
}
const errors = () => ({
  name: state.name.trim().length < 2 ? "اكتب اسمك" : null,
  phone: !normalizePhone(state.phone) ? "رقم جوال سعودي صحيح يبدأ بـ 05 (10 أرقام)" : null,
  district: !state.district.trim() ? "اختر الحي أو اكتبه" : null,
  address: state.address.trim().length < 3 ? "اكتب عنواناً مختصراً أو الصق رابط الموقع" : null,
});

function stepValid(i = state.step) {
  if (i === 0) return !!state.type;
  if (i === 1) return true;
  if (i === 2) return state.services.length + state.addons.length > 0;
  if (i === 3) return !!state.date && !!state.slot;
  if (i === 4) return true;
  if (i === 5) return Object.values(errors()).every((e) => !e);
  return true;
}

// ---- UI pieces ----
const title = (t, sub = "") => `<h1 class="text-2xl font-extrabold md:text-3xl">${t}</h1>${sub ? `<p class="mt-2 text-slate-600">${sub}</p>` : ""}`;

function counter(key, label, [min, max]) {
  return `<div class="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5">
    <span class="text-lg font-bold">${label}</span>
    <div class="flex items-center gap-4">
      <button data-dec="${key}" data-min="${min}" class="h-11 w-11 rounded-full border border-slate-300 text-2xl leading-none hover:border-brand disabled:opacity-30" ${state[key] <= min ? "disabled" : ""}>−</button>
      <span class="w-8 text-center text-2xl font-extrabold">${state[key]}</span>
      <button data-inc="${key}" data-max="${max}" class="h-11 w-11 rounded-full border border-slate-300 text-2xl leading-none hover:border-brand disabled:opacity-30" ${state[key] >= max ? "disabled" : ""}>+</button>
    </div>
  </div>`;
}

function calendar() {
  const now = new Date();
  if (!state.calMonth) state.calMonth = { y: now.getFullYear(), m: now.getMonth() };
  const { y, m } = state.calMonth;
  const first = new Date(y, m, 1).getDay(); // 0 = الأحد
  const days = new Date(y, m + 1, 0).getDate();
  const today = todayISO();
  const isCurrent = y === now.getFullYear() && m === now.getMonth();
  const monthName = new Date(y, m, 1).toLocaleDateString("ar-SA-u-ca-gregory-nu-latn", { month: "long", year: "numeric" });
  let cells = "";
  for (let i = 0; i < first; i++) cells += "<span></span>";
  for (let d = 1; d <= days; d++) {
    const v = iso(y, m, d);
    const past = v < today;
    const sel = v === state.date;
    cells += `<button data-date="${v}" ${past ? "disabled" : ""} class="aspect-square rounded-xl text-base font-bold transition ${sel ? "bg-brand text-white" : past ? "text-slate-300" : "hover:bg-brand/10"}">${d}</button>`;
  }
  return `<div class="rounded-2xl border border-slate-200 bg-white p-4">
    <div class="mb-3 flex items-center justify-between">
      <button data-cal="-1" class="h-9 w-9 rounded-full hover:bg-slate-100 disabled:opacity-30" ${isCurrent ? "disabled" : ""} aria-label="الشهر السابق">→</button>
      <span class="font-bold">${monthName}</span>
      <button data-cal="1" class="h-9 w-9 rounded-full hover:bg-slate-100" aria-label="الشهر التالي">←</button>
    </div>
    <div class="grid grid-cols-7 gap-1 text-center text-xs text-slate-500">${["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"].map((d) => `<span class="py-1">${d}</span>`).join("")}</div>
    <div class="mt-1 grid grid-cols-7 gap-1">${cells}</div>
  </div>`;
}

function field(key, label, input, err) {
  const show = state.tried && err;
  return `<label class="block"><span class="mb-1.5 block font-bold">${label}</span>${input}
    <span data-err="${key}" class="mt-1 block text-sm text-red-600 ${show ? "" : "hidden"}">${err || ""}</span></label>`;
}

const summaryRow = (label, value, step) => `<div class="flex items-start justify-between gap-4 border-b border-slate-100 py-3.5 last:border-0">
  <div><div class="text-sm text-slate-500">${label}</div><div class="mt-0.5 font-bold">${esc(value)}</div></div>
  <button data-goto="${step}" class="shrink-0 text-sm font-bold text-brand hover:underline">تعديل</button></div>`;

// ---- steps ----
const views = [
  () => `${title("وش نوع المكان؟", "اختر نوع المكان اللي تبي ننظفه")}
    <div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">${PLACE_TYPES.map((p) => `
      <button data-type="${p.id}" class="choice ${state.type === p.id ? "active" : ""}">
        <div class="text-4xl">${p.icon}</div><div class="mt-2 font-bold">${p.name}</div>
        <div class="mt-1 text-sm text-slate-500">من ${money(p.base)}</div></button>`).join("")}</div>`,

  () => {
    const p = place();
    return `${title("حجم المكان", `${p.name}: حدد عدد ${p.rooms[1] > p.rooms[0] ? "الغرف و" : ""}دورات المياه`)}
      <div class="mt-6 space-y-3">
        ${p.rooms[1] > p.rooms[0] ? counter("rooms", p.id === "office" ? "عدد الغرف / المكاتب" : "عدد الغرف", p.rooms) : ""}
        ${counter("baths", "عدد دورات المياه", p.baths)}
      </div>
      <p class="mt-4 text-sm text-slate-500">السعر الأساسي يشمل ${p.rooms[1] > p.rooms[0] ? `${p.baseRooms} غرف و` : ""}${p.baseBaths} دورة مياه، وكل زيادة تُضاف للسعر.</p>`;
  },

  () => `${title("الخدمات المطلوبة", "اختر خدمة أو أكثر")}
    <div class="mt-6 grid gap-3 sm:grid-cols-2">${SERVICES.map((s) => `
      <button data-service="${s.id}" class="choice flex items-center justify-between text-start ${state.services.includes(s.id) ? "active" : ""}">
        <span class="font-bold">${s.name}</span><span class="text-sm text-slate-500">${s.price ? "+" + money(s.price) : "مشمولة"}</span></button>`).join("")}</div>
    <h2 class="mt-8 text-lg font-extrabold">إضافات اختيارية</h2>
    <div class="mt-3 grid gap-3 sm:grid-cols-2">${ADDONS.map((a) => `
      <button data-addon="${a.id}" class="choice flex items-center justify-between text-start ${state.addons.includes(a.id) ? "active" : ""}">
        <span class="font-bold">✨ ${a.name}</span><span class="text-sm text-slate-500">+${money(a.price)}</span></button>`).join("")}</div>`,

  () => `${title("اختر الموعد", "اليوم، ثم الفترة، ثم عدد الساعات")}
    <div class="mt-6">${calendar()}</div>
    <h2 class="mt-6 font-extrabold">الفترة</h2>
    <div class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">${TIME_SLOTS.map((t) => `
      <button data-slot="${t.id}" class="choice ${state.slot === t.id ? "active" : ""}"><div class="font-bold">${t.name}</div><div class="mt-1 text-xs text-slate-500" dir="ltr">${t.hint}</div></button>`).join("")}</div>
    <h2 class="mt-6 font-extrabold">عدد الساعات</h2>
    <div class="mt-3">${counter("hours", "ساعات العمل", [HOURS.min, HOURS.max])}</div>
    <p class="mt-2 text-sm text-slate-500">السعر يشمل حتى ${HOURS.included} ساعات، وكل ساعة إضافية +${money(HOURS.extraHourPrice)}.</p>`,

  () => `${title("ملخص طلبك", "راجع اختياراتك، وتقدر تعدل أي شيء")}
    <div class="mt-6 rounded-2xl border border-slate-200 bg-white px-5">
      ${summaryRow("نوع المكان وحجمه", sizeText(), 0)}
      ${summaryRow("الخدمات", servicesText(), 2)}
      ${summaryRow("التاريخ والوقت", `${fmtDate(state.date)}، ${slotObj().name}`, 3)}
      ${summaryRow("عدد الساعات", `${state.hours} ساعات`, 3)}
    </div>
    <div class="mt-4 rounded-2xl bg-brand p-6 text-white">
      <div class="text-sm text-white/80">السعر التقديري</div>
      <div class="mt-1 text-4xl font-extrabold">${money(price())}</div>
      <div class="mt-3 text-sm text-white/90">السعر تقديري ويتأكد عند التواصل · الأسعار لا تشمل الضريبة</div>
    </div>`,

  () => {
    const e = errors();
    return `${title("بياناتك", "آخر خطوة، عشان نتواصل معك ونأكد الموعد")}
    <div class="mt-6 space-y-4">
      ${field("name", "الاسم *", `<input data-f="name" class="field" autocomplete="name" value="${esc(state.name)}" />`, e.name)}
      ${field("phone", "رقم الجوال *", `<input data-f="phone" class="field text-start" inputmode="tel" dir="ltr" placeholder="05XXXXXXXX" autocomplete="tel" value="${esc(state.phone)}" />`, e.phone)}
      ${field("district", "الحي في الخبر *", `<input data-f="district" class="field" list="districts" placeholder="مثال: العقربية" value="${esc(state.district)}" /><datalist id="districts">${NEIGHBORHOODS.map((n) => `<option value="${n}">`).join("")}</datalist>`, e.district)}
      ${field("address", "عنوان مختصر أو رابط الموقع *", `<input data-f="address" class="field" placeholder="الشارع ورقم المبنى، أو رابط خرائط قوقل" value="${esc(state.address)}" />`, e.address)}
      ${field("notes", "ملاحظات (اختياري)", `<textarea data-f="notes" rows="3" class="field" placeholder="أي تفاصيل تساعدنا">${esc(state.notes)}</textarea>`, null)}
    </div>`;
  },
];

function thanks() {
  return `<div class="py-12 text-center">
    <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand/10 text-4xl">✓</div>
    <h1 class="mt-6 text-3xl font-extrabold">وصلنا طلبك، وبنتواصل معك لتأكيد الموعد</h1>
    <p class="mt-3 text-slate-600">شكراً لاختيارك لمعة 🤍</p>
    <p class="mt-8 text-sm text-slate-500">ما انفتح واتساب؟</p>
    <a href="${waLink()}" target="_blank" rel="noopener" class="mt-2 inline-block rounded-full bg-[#25D366] px-6 py-3 font-bold text-white">أرسل الطلب عبر واتساب</a>
    <div class="mt-6"><a href="./" class="font-bold text-brand">العودة للرئيسية</a></div>
  </div>`;
}

function waMessage() {
  return [
    "طلب حجز جديد، لمعة",
    `الاسم: ${state.name.trim()}`,
    `الجوال: ${normalizePhone(state.phone)}`,
    `الحي: ${state.district.trim()}`,
    `العنوان: ${state.address.trim()}`,
    `نوع المكان وحجمه: ${sizeText()}`,
    `الخدمات: ${servicesText()}`,
    `التاريخ والوقت: ${fmtDate(state.date)}، ${slotObj().name}`,
    `عدد الساعات: ${state.hours}`,
    `السعر التقديري: ${money(price())} (بدون ضريبة)`,
    `ملاحظات: ${state.notes.trim() || "لا يوجد"}`,
  ].join("\n");
}
const waLink = () => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage())}`;

// ---- render ----
function render() {
  const done = state.step >= STEPS.length;
  $("#step").innerHTML = done ? thanks() : views[state.step]();
  $("#progress").style.width = `${done ? 100 : ((state.step + 1) / STEPS.length) * 100}%`;
  $("#stepLabel").textContent = done ? "تم" : `الخطوة ${state.step + 1} من ${STEPS.length} · ${STEPS[state.step]}`;
  $("#nav").classList.toggle("hidden", done);
  $("#back").style.visibility = state.step === 0 ? "hidden" : "visible";
  const last = state.step === STEPS.length - 1;
  const next = $("#next");
  next.textContent = last ? "أرسل الطلب عبر واتساب" : "التالي";
  next.classList.toggle("bg-[#25D366]", last);
  next.classList.toggle("bg-brand", !last);
  next.disabled = !last && !stepValid();
  $("#livePrice").textContent = state.type ? money(price()) : "—";
}

function refreshFieldErrors() {
  const e = errors();
  for (const [k, msg] of Object.entries(e)) {
    const el = document.querySelector(`[data-err="${k}"]`);
    const input = document.querySelector(`[data-f="${k}"]`);
    const show = state.tried && !!msg;
    if (el) { el.textContent = msg || ""; el.classList.toggle("hidden", !show); }
    input?.classList.toggle("invalid", show);
  }
}

const toggle = (arr, id) => (arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);

document.addEventListener("click", (ev) => {
  const t = ev.target.closest("button");
  if (!t || t.disabled) return;
  const d = t.dataset;
  if (d.type) {
    const p = PLACE_TYPES.find((x) => x.id === d.type);
    if (state.type !== d.type) { state.rooms = p.rooms[0]; state.baths = p.baths[0]; }
    state.type = d.type;
  } else if (d.inc) state[d.inc] = Math.min(+d.max, state[d.inc] + 1);
  else if (d.dec) state[d.dec] = Math.max(+d.min, state[d.dec] - 1);
  else if (d.service) state.services = toggle(state.services, d.service);
  else if (d.addon) state.addons = toggle(state.addons, d.addon);
  else if (d.slot) state.slot = d.slot;
  else if (d.date) state.date = d.date;
  else if (d.cal) {
    let { y, m } = state.calMonth;
    m += +d.cal;
    if (m < 0) { m = 11; y--; } else if (m > 11) { m = 0; y++; }
    state.calMonth = { y, m };
  } else if (d.goto) { state.step = +d.goto; window.scrollTo(0, 0); }
  else return;
  render();
});

document.addEventListener("input", (ev) => {
  const k = ev.target.dataset?.f;
  if (!k) return;
  state[k] = ev.target.value;
  refreshFieldErrors();
});

$("#back").addEventListener("click", () => {
  if (state.step > 0) { state.step--; render(); window.scrollTo(0, 0); }
});

$("#next").addEventListener("click", () => {
  if (state.step === STEPS.length - 1) {
    state.tried = true;
    if (!stepValid()) {
      refreshFieldErrors();
      document.querySelector(".field.invalid")?.focus();
      return;
    }
    window.open(waLink(), "_blank");
    state.step = STEPS.length;
  } else if (stepValid()) state.step++;
  render();
  window.scrollTo(0, 0);
});

render();
