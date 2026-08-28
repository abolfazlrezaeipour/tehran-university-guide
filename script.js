const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

function applyTheme(theme) {
  root.dataset.theme = theme;
  themeIcon.textContent = theme === "dark" ? "☀" : "☾";
  localStorage.setItem("freshman-theme", theme);
}
const savedTheme = localStorage.getItem("freshman-theme");
applyTheme(savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
themeToggle.addEventListener("click", () => {
  applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
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

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
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
