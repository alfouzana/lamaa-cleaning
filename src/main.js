import "./style.css";
import { WHATSAPP_NUMBER } from "./config.js";

document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = String(new Date().getFullYear())));
document.querySelectorAll("[data-wa-float]").forEach((a) => {
  a.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("السلام عليكم، عندي استفسار عن خدمات لمعة")}`;
});
