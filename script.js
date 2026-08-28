const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function applyTheme(theme) {
  root.dataset.theme = theme;
  themeIcon.textContent = theme === "dark" ? "☀" : "☾";
  localStorage.setItem("freshman-theme", theme);
}
// Theme is already set inline (head script) before first paint to avoid a light/dark flash;
// this just syncs the icon + keeps localStorage in sync with the resolved value.
applyTheme(root.dataset.theme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
themeToggle.addEventListener("click", () => {
  themeIcon.animate(
    [{ transform: "rotate(0deg) scale(1)" }, { transform: "rotate(180deg) scale(.6)" }, { transform: "rotate(360deg) scale(1)" }],
    { duration: prefersReducedMotion ? 0 : 420, easing: "ease" }
  );
  applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

// Mobile navigation
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const navScrim = document.getElementById("navScrim");

function closeMenu() {
  mainNav.classList.remove("open");
  menuToggle.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  navScrim.classList.remove("visible");
  document.body.classList.remove("no-scroll");
}
function openMenu() {
  mainNav.classList.add("open");
  menuToggle.classList.add("open");
  menuToggle.setAttribute("aria-expanded", "true");
  navScrim.classList.add("visible");
  document.body.classList.add("no-scroll");
}
menuToggle.addEventListener("click", () => {
  mainNav.classList.contains("open") ? closeMenu() : openMenu();
});
navScrim.addEventListener("click", closeMenu);
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
window.addEventListener("resize", () => {
  if (window.innerWidth > 950) closeMenu();
});

const items = [
  "برنامه کلاس‌ها را ذخیره کرده‌ام.",
  "مسیر خوابگاه تا دانشکده را بلدم.",
  "غذای هفته بعد را رزرو کرده‌ام.",
  "شیوه نمره‌دهی درس‌ها را می‌دانم.",
  "قوانین اتاق را با هم‌اتاقی‌ها مشخص کرده‌ام.",
  "برای کمدم قفل دارم.",
  "کتابخانه و سالن مطالعه را پیدا کرده‌ام.",
  "حداقل یک سال‌بالایی قابل اعتماد می‌شناسم.",
  "یک فعالیت دانشجویی موردعلاقه پیدا کرده‌ام.",
  "شماره‌های ضروری را ذخیره کرده‌ام."
];
const checklist = document.getElementById("checklistItems");
const savedChecks = JSON.parse(localStorage.getItem("freshman-checklist") || "[]");

items.forEach((text, index) => {
  const row = document.createElement("div");
  row.className = "check-item" + (savedChecks.includes(index) ? " done" : "");
  row.innerHTML = `<input id="check-${index}" type="checkbox" ${savedChecks.includes(index) ? "checked" : ""}>
                   <span class="fake-check">${savedChecks.includes(index) ? "✓" : ""}</span>
                   <label for="check-${index}">${text}</label>`;
  row.addEventListener("click", () => {
    const input = row.querySelector("input");
    input.checked = !input.checked;
    row.classList.toggle("done", input.checked);
    row.querySelector(".fake-check").textContent = input.checked ? "✓" : "";
    const state = [...document.querySelectorAll(".check-item input")]
      .map((el, i) => el.checked ? i : null).filter(i => i !== null);
    localStorage.setItem("freshman-checklist", JSON.stringify(state));
  });
  checklist.appendChild(row);
});

// Stagger siblings that reveal together (cards in the same grid) for a nicer cascade.
document.querySelectorAll(".topic-grid, .cards-3, .people-grid, .dorm-mini-grid, .shortcut-grid, .checklist").forEach(group => {
  [...group.children].forEach((child, i) => {
    if (child.classList.contains("reveal")) child.style.transitionDelay = prefersReducedMotion ? "0s" : `${Math.min(i * 70, 350)}ms`;
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .08 });
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".nav a")];
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
    }
  });
}, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
sections.forEach(section => navObserver.observe(section));

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});