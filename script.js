// Ever After by TeamAfot
(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Nav: solid once scrolled, mobile menu
  const nav = document.querySelector(".nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.getElementById("menu");
  const setMenu = (open) => {
    menu.classList.toggle("is-open", open);
    nav.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", open);
    toggle.textContent = open ? "Close" : "Menu";
  };
  toggle.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

  // Hero sparkles: a few slow, twinkling points of gold light
  const sky = document.querySelector(".sparkles");
  if (sky && !reduceMotion) {
    const ctx = sky.getContext("2d");
    let w, h, stars;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = sky.clientWidth; h = sky.clientHeight;
      sky.width = w * dpr; sky.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((w * h) / 22000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.4 + 0.4,
        p: Math.random() * Math.PI * 2,
        s: 0.004 + Math.random() * 0.012,
        v: 0.05 + Math.random() * 0.15,
      }));
    };
    resize();
    window.addEventListener("resize", resize);
    let visible = true;
    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(sky);
    (function draw() {
      if (visible) {
        ctx.clearRect(0, 0, w, h);
        for (const s of stars) {
          s.p += s.s; s.y -= s.v;
          if (s.y < -4) { s.y = h + 4; s.x = Math.random() * w; }
          const a = (Math.sin(s.p) + 1) / 2;
          ctx.globalAlpha = 0.15 + a * 0.75;
          ctx.fillStyle = "#F3DDA6";
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
          if (s.r > 1.4 && a > 0.85) { // the brightest ones glint
            ctx.globalAlpha = (a - 0.85) * 4;
            ctx.fillRect(s.x - 5, s.y - 0.4, 10, 0.8);
            ctx.fillRect(s.x - 0.4, s.y - 5, 0.8, 10);
          }
        }
      }
      requestAnimationFrame(draw);
    })();
  }

  // Sample invitation
  const invite = document.querySelector(".invite");
  if (invite) {
    const closed = invite.querySelector(".invite__closed");
    const open = invite.querySelector(".invite__open");
    const seal = invite.querySelector(".seal");
    const msg = invite.querySelector(".rsvp__msg");
    let timer;
    const target = new Date();
    target.setMonth(target.getMonth() + 4);
    target.setHours(11, 0, 0, 0);
    invite.querySelector(".invite__date").textContent =
      target.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

    const tick = () => {
      const diff = Math.max(0, target - new Date());
      const parts = { d: Math.floor(diff / 864e5), h: Math.floor((diff / 36e5) % 24), m: Math.floor((diff / 6e4) % 60), s: Math.floor((diff / 1e3) % 60) };
      for (const k in parts) invite.querySelector(`[data-cd="${k}"]`).textContent = k === "d" ? parts[k] : String(parts[k]).padStart(2, "0");
    };

    seal.addEventListener("click", () => {
      closed.hidden = true; closed.style.display = "none";
      open.hidden = false;
      tick(); timer = setInterval(tick, 1000);
      shower();
      open.querySelector(".rsvp__btn").focus({ preventScroll: true });
    });
    invite.querySelector(".invite__reset").addEventListener("click", () => {
      clearInterval(timer);
      open.hidden = true; closed.hidden = false; closed.style.display = "";
      msg.textContent = ""; seal.focus();
    });
    invite.querySelectorAll("[data-rsvp]").forEach((b) => b.addEventListener("click", () => {
      msg.textContent = b.dataset.rsvp === "yes"
        ? "How wonderful. On your site, every reply reaches you instantly."
        : "We'll miss you. On your site, the couple sees this reply too.";
    }));
  }

  // A soft shower of gold and petals when the seal opens
  const canvas = document.querySelector(".confetti");
  function shower() {
    if (!canvas || reduceMotion) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const card = document.querySelector(".invite__card").getBoundingClientRect();
    const cx = card.left - rect.left + card.width / 2;
    const colours = ["#E9CF92", "#F3DDA6", "#C59A52", "#F4E4DD", "#C98F86"];
    const bits = Array.from({ length: 90 }, () => ({
      x: cx + (Math.random() - 0.5) * card.width * 1.6,
      y: card.top - rect.top - Math.random() * 200,
      vy: 0.8 + Math.random() * 1.6, vx: (Math.random() - 0.5) * 0.8,
      r: 3 + Math.random() * 4, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.08,
      sway: Math.random() * 6, c: colours[(Math.random() * colours.length) | 0], petal: Math.random() > 0.55,
    }));
    let f = 0;
    (function draw() {
      ctx.clearRect(0, 0, rect.width, rect.height);
      for (const b of bits) {
        b.sway += 0.03; b.x += b.vx + Math.sin(b.sway) * 0.5; b.y += b.vy; b.rot += b.vr;
        ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.rot);
        ctx.globalAlpha = Math.max(0, 1 - f / 260);
        ctx.fillStyle = b.c;
        ctx.beginPath();
        if (b.petal) ctx.ellipse(0, 0, b.r * 1.4, b.r * 0.7, 0, 0, Math.PI * 2);
        else ctx.arc(0, 0, b.r * 0.45, 0, Math.PI * 2);
        ctx.fill(); ctx.restore();
      }
      if (++f < 260) requestAnimationFrame(draw); else ctx.clearRect(0, 0, rect.width, rect.height);
    })();
  }
})();
