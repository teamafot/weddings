// Shared helpers for the Ever After sample wedding sites
window.EA = (function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Hide missing photos so the elegant fallback shows instead
  document.querySelectorAll(".photo img").forEach((img) => {
    const miss = () => img.classList.add("is-missing");
    if (img.complete && !img.naturalWidth) miss();
    img.addEventListener("error", miss);
  });

  const toastEl = document.querySelector(".toast");
  let tt;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("is-on");
    clearTimeout(tt);
    tt = setTimeout(() => toastEl.classList.remove("is-on"), 3200);
  }
  document.querySelectorAll("[data-toast]").forEach((b) => b.addEventListener("click", () => toast(b.dataset.toast)));
  document.querySelectorAll("[data-copy]").forEach((b) => b.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); toast("Number copied. (This is a sample number.)"); }
    catch { toast("On a real site, this copies the number in one tap."); }
  }));

  function countdown(dateStr, root = document) {
    const when = new Date(dateStr);
    const els = { d: root.querySelector('[data-cd="d"]'), h: root.querySelector('[data-cd="h"]'), m: root.querySelector('[data-cd="m"]'), s: root.querySelector('[data-cd="s"]') };
    const tick = () => {
      const diff = Math.max(0, when - new Date());
      const p = { d: Math.floor(diff / 864e5), h: Math.floor((diff / 36e5) % 24), m: Math.floor((diff / 6e4) % 60), s: Math.floor((diff / 1e3) % 60) };
      for (const k in p) if (els[k]) els[k].textContent = k === "d" ? p[k] : String(p[k]).padStart(2, "0");
    };
    tick();
    setInterval(tick, 1000);
  }

  function rsvp(form, couple) {
    if (!form) return;
    const err = form.querySelector(".rsvp__error");
    const done = form.querySelector(".rsvp__done");
    form.name.addEventListener("input", () => (err.textContent = ""));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      if (!name) { err.textContent = "Add your name so the couple knows who's replying."; form.name.focus(); return; }
      err.textContent = "";
      const first = name.split(" ")[0];
      const attend = form.attend ? form.attend.value !== "no" : true;
      done.textContent = attend
        ? `Thank you, ${first}. ${couple} can't wait to celebrate with you. (Sample: on a real site, the couple receives this reply.)`
        : `Thank you, ${first}. You'll be missed. (Sample: on a real site, the couple receives this reply.)`;
    });
  }

  function calendar(btn, { title, date, location, file }) {
    if (!btn) return;
    btn.addEventListener("click", () => {
      const d = new Date(date);
      const pad = (n) => String(n).padStart(2, "0");
      const day = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
      const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Ever After by TeamAfot//Sample//EN", "BEGIN:VEVENT",
        `UID:${file}@everafter-sample`, `DTSTART;VALUE=DATE:${day}`, `SUMMARY:${title} (sample)`, `LOCATION:${location}`,
        "END:VEVENT", "END:VCALENDAR"].join("\r\n");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
      a.download = `${file}.ics`;
      a.click();
      toast("Calendar file saved.");
    });
  }

  // Falling particles: petals, gold flakes or confetti
  function shower(colours, { count = 80, frames = 300, shape = "petal" } = {}) {
    if (reduceMotion) return;
    const cv = document.querySelector(".fx");
    if (!cv) return;
    const ctx = cv.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const w = innerWidth, h = innerHeight;
    cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const bits = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: -20 - Math.random() * h * 0.7, vy: 1 + Math.random() * 1.8,
      sway: Math.random() * 6, r: 3 + Math.random() * 5, rot: Math.random() * 6, vr: (Math.random() - .5) * .08,
      c: colours[(Math.random() * colours.length) | 0],
    }));
    let f = 0;
    (function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const b of bits) {
        b.sway += .025; b.x += Math.sin(b.sway) * .8; b.y += b.vy; b.rot += b.vr;
        ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.rot);
        ctx.globalAlpha = Math.max(0, 1 - f / frames); ctx.fillStyle = b.c; ctx.beginPath();
        if (shape === "petal") ctx.ellipse(0, 0, b.r * 1.3, b.r * .65, 0, 0, Math.PI * 2);
        else if (shape === "flake") ctx.rect(-b.r * .5, -b.r * .25, b.r, b.r * .5);
        else ctx.arc(0, 0, b.r * .5, 0, Math.PI * 2);
        ctx.fill(); ctx.restore();
      }
      if (++f < frames) requestAnimationFrame(draw); else ctx.clearRect(0, 0, w, h);
    })();
  }

  return { toast, countdown, rsvp, calendar, shower, reduceMotion };
})();
