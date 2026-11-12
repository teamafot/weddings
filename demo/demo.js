// Ever After sample wedding websites: one template, four couples.
(function () {
  const COUPLES = {
    ivory: {
      a: "Adjoa", b: "Kofi", date: "2027-06-20T10:00:00",
      city: "ACCRA, GHANA", intro: "Together with their families",
      story: "They met at a friend's birthday dinner where Kofi insisted the jollof was better at his mother's house. Adjoa went to find out. Six years, many plates of jollof and one surprise proposal later, they're saying forever.",
      e1Label: "THE CEREMONY", e1Venue: "Holy Trinity Cathedral", e1Time: "10:00 a.m.",
      e2Label: "THE RECEPTION", e2Venue: "The Garden Pavilion", e2Time: "2:00 p.m. till late",
      dressText: "Elegant formal wear in our wedding colours.",
      colours: [["#FFFDF9", "Ivory"], ["#E9CF92", "Champagne"], ["#B88A44", "Gold"]],
      petals: ["#E9CF92", "#F3DDA6", "#FFFFFF"],
    },
    heritage: {
      a: "Akosua", b: "Yaw", date: "2027-09-11T09:00:00",
      city: "KUMASI, GHANA", intro: "With the blessing of both families",
      story: "Two families, one love. Akosua and Yaw grew up two streets apart but only truly met at university in Kumasi. Now they come home to celebrate with a traditional engagement and a white wedding, and they want you there for both.",
      e1Label: "TRADITIONAL ENGAGEMENT", e1Venue: "The Family House, Ahodwo", e1Time: "9:00 a.m.",
      e2Label: "WHITE WEDDING AND RECEPTION", e2Venue: "Royal Heritage Gardens", e2Time: "1:00 p.m. till late",
      dressText: "Kente and traditional wear for the engagement. Formal wear in our colours for the wedding.",
      colours: [["#1F4A35", "Emerald"], ["#C59A3A", "Gold"], ["#8E2B2B", "Burgundy"]],
      petals: ["#E3C27A", "#C59A3A", "#2A5C44"],
    },
    blush: {
      a: "Naa", b: "Nii", date: "2027-12-04T15:00:00",
      city: "ABURI, GHANA", intro: "Surrounded by flowers and family",
      story: "Naa loves gardens and Nii loves Naa, so a garden wedding in the cool hills of Aburi was the easiest decision they ever made. Come for the vows, stay for the sunset and the dancing.",
      e1Label: "THE CEREMONY", e1Venue: "The Botanical Gardens Lawn", e1Time: "3:00 p.m.",
      e2Label: "THE RECEPTION", e2Venue: "Hillside Terrace", e2Time: "5:30 p.m. till late",
      dressText: "Garden formal in soft, romantic shades. Comfortable shoes for the lawn are welcome.",
      colours: [["#F2C9C4", "Blush"], ["#A9B79B", "Sage"], ["#FFFFFF", "White"]],
      petals: ["#F2C9C4", "#D9A2A8", "#A9B79B"],
    },
    wine: {
      a: "Esi", b: "Kwame", date: "2027-03-13T11:00:00",
      city: "ACCRA, GHANA", intro: "Together with their families",
      story: "A wrong number, a long apology and a phone call that lasted three hours. Esi and Kwame like to say they were connected by mistake and kept together on purpose. Now they invite you to celebrate the best mistake they ever made.",
      e1Label: "THE CEREMONY", e1Venue: "Christ the King Church", e1Time: "11:00 a.m.",
      e2Label: "THE RECEPTION", e2Venue: "The Grand Ballroom", e2Time: "3:00 p.m. till late",
      dressText: "Black tie optional, in our wedding colours.",
      colours: [["#5B1F33", "Wine"], ["#F1E2C6", "Champagne"], ["#C59A52", "Gold"]],
      petals: ["#C59A52", "#F3DDA6", "#8B3550"],
    },
  };

  const theme = document.documentElement.dataset.theme;
  const c = COUPLES[theme];
  const when = new Date(c.date);
  const rsvpBy = new Date(when); rsvpBy.setDate(rsvpBy.getDate() - 30);
  const fmt = (d, o) => d.toLocaleDateString("en-GB", o);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const fields = {
    names: `${c.a} & ${c.b}`,
    initials: `${c.a[0]}&${c.b[0]}`,
    dateLong: fmt(when, { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    rsvpBy: fmt(rsvpBy, { day: "numeric", month: "long", year: "numeric" }),
    giftName: `${c.a} & ${c.b} (sample)`,
    ...c,
  };
  document.title = `${c.a} & ${c.b} | Sample wedding website | Ever After`;
  document.querySelectorAll("[data-f]").forEach((el) => {
    const k = el.dataset.f;
    if (k === "namesHtml") {
      el.innerHTML = "";
      el.append(c.a, Object.assign(document.createElement("span"), { textContent: " & " }), c.b);
    } else if (k === "swatches") {
      c.colours.forEach(([hex, name]) => {
        const s = document.createElement("div");
        s.className = "swatch";
        s.innerHTML = `<i style="--c:${hex}"></i>`;
        s.append(name);
        el.append(s);
      });
    } else if (fields[k] !== undefined) {
      el.textContent = fields[k];
    }
  });

  // Countdown
  const tick = () => {
    const diff = Math.max(0, when - new Date());
    const p = { d: Math.floor(diff / 864e5), h: Math.floor((diff / 36e5) % 24), m: Math.floor((diff / 6e4) % 60), s: Math.floor((diff / 1e3) % 60) };
    for (const k in p) document.querySelector(`[data-cd="${k}"]`).textContent = k === "d" ? p[k] : String(p[k]).padStart(2, "0");
  };

  // Open the envelope
  const envelope = document.querySelector(".envelope");
  const site = document.getElementById("site");
  document.querySelector(".seal").addEventListener("click", () => {
    site.hidden = false;
    tick(); setInterval(tick, 1000);
    envelope.classList.add("is-open");
    document.body.classList.remove("is-sealed");
    petals();
    setTimeout(() => { envelope.hidden = true; document.querySelector(".hero__names").setAttribute("tabindex", "-1"); document.querySelector(".hero__names").focus({ preventScroll: true }); }, 1000);
  });

  // Toast
  const toastEl = document.querySelector(".toast");
  let toastTimer;
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-on"), 3200);
  };
  document.querySelectorAll("[data-toast]").forEach((b) => b.addEventListener("click", () => toast(b.dataset.toast)));
  document.querySelectorAll("[data-copy]").forEach((b) => b.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); toast("Number copied. (This is a sample number.)"); }
    catch { toast("On your real site, this copies the number in one tap."); }
  }));

  // RSVP (sample)
  const form = document.querySelector(".rsvp");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const err = form.querySelector(".rsvp__error");
    const done = form.querySelector(".rsvp__done");
    const name = form.name.value.trim();
    if (!name) { err.textContent = "Add your name so the couple knows who's replying."; form.name.focus(); return; }
    err.textContent = "";
    const first = name.split(" ")[0];
    done.textContent = form.attend.value === "yes"
      ? `Thank you, ${first}. ${c.a} and ${c.b} can't wait to celebrate with you. (Sample: on a real site, the couple receives this reply.)`
      : `Thank you, ${first}. You'll be missed. (Sample: on a real site, the couple receives this reply.)`;
  });
  form.name.addEventListener("input", () => (form.querySelector(".rsvp__error").textContent = ""));

  // Save the date: a real calendar file
  document.getElementById("ics").addEventListener("click", () => {
    const pad = (n) => String(n).padStart(2, "0");
    const d = `${when.getFullYear()}${pad(when.getMonth() + 1)}${pad(when.getDate())}`;
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Ever After by TeamAfot//Sample//EN", "BEGIN:VEVENT",
      `UID:${theme}-sample@everafter`, `DTSTART;VALUE=DATE:${d}`, `SUMMARY:${c.a} & ${c.b}'s wedding (sample)`,
      `LOCATION:${c.e1Venue}`, "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = `${c.a}-${c.b}-wedding.ics`;
    a.click();
    toast("Saved to your calendar file.");
  });

  // Petals when the envelope opens
  function petals() {
    if (reduceMotion) return;
    const cv = document.querySelector(".petals");
    const ctx = cv.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const w = innerWidth, h = innerHeight;
    cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const bits = Array.from({ length: 70 }, () => ({
      x: Math.random() * w, y: -20 - Math.random() * h * 0.6,
      vy: 1 + Math.random() * 1.6, sway: Math.random() * 6, r: 4 + Math.random() * 5,
      rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.06, col: c.petals[(Math.random() * c.petals.length) | 0],
    }));
    let f = 0;
    (function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const b of bits) {
        b.sway += 0.025; b.x += Math.sin(b.sway) * 0.8; b.y += b.vy; b.rot += b.vr;
        ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.rot);
        ctx.globalAlpha = Math.max(0, 1 - f / 320);
        ctx.fillStyle = b.col; ctx.beginPath(); ctx.ellipse(0, 0, b.r * 1.3, b.r * 0.65, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      if (++f < 320) requestAnimationFrame(draw); else ctx.clearRect(0, 0, w, h);
    })();
  }
})();
