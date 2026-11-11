/* The Cozy Toolbox — shared helpers + header/footer injection */
(function () {
  "use strict";

  // Pages set data-root="." (hub) or ".." (apps) on <body>
  const ROOT = document.body.dataset.root || ".";

  const CB = {
    $: (sel, el = document) => el.querySelector(sel),
    $$: (sel, el = document) => Array.from(el.querySelectorAll(sel)),

    /* localStorage helpers (namespaced, JSON) */
    store: {
      _errListeners: [],
      /* Register a callback for save failures / corrupt data so pages can warn the user. */
      onError(fn) { this._errListeners.push(fn); },
      _fail(msg) {
        this._errListeners.forEach(fn => { try { fn(msg); } catch (e) { /* listener bug never breaks storage */ } });
        CB.toast(msg, 5200);
      },
      get(key, fallback) {
        let raw = null;
        try { raw = localStorage.getItem("cozy:" + key); }
        catch (e) { return fallback; }
        if (raw === null) return fallback;
        try { return JSON.parse(raw); }
        catch (e) {
          /* Corrupt value: quarantine it so the next save can't silently destroy the user's data. */
          try { localStorage.setItem("cozy:" + key + ".corrupt-" + Date.now(), raw); } catch (e2) { /* best effort */ }
          this._fail("Saved data for “" + key + "” was damaged — a backup copy was kept; starting fresh.");
          return fallback;
        }
      },
      set(key, value) {
        try { localStorage.setItem("cozy:" + key, JSON.stringify(value)); return true; }
        catch (e) {
          this._fail("Couldn't save — storage is full or blocked. Recent changes may be lost.");
          return false;
        }
      },
      remove(key) { try { localStorage.removeItem("cozy:" + key); } catch (e) { } }
    },

    esc(str) {
      return String(str).replace(/[&<>"']/g, c => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
      }[c]));
    },

    uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); },

    /* 12345.6 -> "12,345.60" (locale separators, no currency symbol) */
    fmtNum(n, dec = 2) {
      return Number(n).toLocaleString(undefined, {
        minimumFractionDigits: dec, maximumFractionDigits: dec
      });
    },

    fmtDate(ts) {
      const d = new Date(ts);
      return d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
        " · " + d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
    },

    toast(msg, ms = 2600) {
      let t = document.querySelector(".toast");
      if (!t) {
        t = document.createElement("div");
        t.className = "toast";
        document.body.appendChild(t);
      }
      t.textContent = msg;
      requestAnimationFrame(() => t.classList.add("show"));
      clearTimeout(CB._toastTimer);
      CB._toastTimer = setTimeout(() => t.classList.remove("show"), ms);
    },

    confetti(x = window.innerWidth / 2, y = window.innerHeight * 0.35, count = 70) {
      const colors = ["#FF6B57", "#FFB238", "#2EC4B6", "#9B7EDE", "#7BC950", "#FFD447", "#FF8A3D"];
      const box = document.createElement("div");
      box.className = "confetti";
      document.body.appendChild(box);
      for (let i = 0; i < count; i++) {
        const p = document.createElement("i");
        p.style.left = (x + (Math.random() * 2 - 1) * 70) + "px";
        p.style.top = y + "px";
        p.style.background = colors[i % colors.length];
        p.style.setProperty("--dx", ((Math.random() * 2 - 1) * 260) + "px");
        p.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");
        p.style.animationDuration = (0.9 + Math.random() * 0.9) + "s";
        p.style.animationDelay = (Math.random() * 0.18) + "s";
        if (Math.random() < 0.35) { p.style.borderRadius = "50%"; p.style.width = "8px"; p.style.height = "8px"; }
        box.appendChild(p);
      }
      setTimeout(() => box.remove(), 2000);
    }
  };

  window.CB = CB;

  /* ---------- header & footer ---------- */
  const isAppPage = document.body.classList.contains("app-page");

  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <a class="logo" href="${ROOT}/index.html">
      <img src="${ROOT}/assets/img/toolbox.png" alt="">
      <span>The Cozy <b>Toolbox</b></span>
    </a>
    ${isAppPage
      ? `<a class="btn btn-ghost btn-sm" href="${ROOT}/index.html">🏠&nbsp; All tools</a>`
      : `<span class="header-badge">🧰 10 cozy tools · more coming</span>`}
  `;
  document.body.prepend(header);

  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <p><img src="${ROOT}/assets/img/sparkles.png" alt=""> Made with warmth — your data stays on your device.
    More mini apps coming soon. <img src="${ROOT}/assets/img/rainbow.png" alt=""></p>
  `;
  document.body.appendChild(footer);
})();
