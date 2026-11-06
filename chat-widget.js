(function () {
  "use strict";

  var HOST_TAG = "poc-chat-widget";
  var HOST_ID = "poc-chat-widget-" + Math.random().toString(36).slice(2, 10);

  if (window.__pocChatWidgetLoaded) return;
  window.__pocChatWidgetLoaded = true;

  var HOST_RESET = [
    "all: initial !important",
    "display: block !important",
    "position: fixed !important",
    "top: 0 !important",
    "left: 0 !important",
    "width: 0 !important",
    "height: 0 !important",
    "margin: 0 !important",
    "padding: 0 !important",
    "border: 0 !important",
    "overflow: visible !important",
    "transform: none !important",
    "filter: none !important",
    "opacity: 1 !important",
    "visibility: visible !important",
    "pointer-events: none !important",
    "z-index: 2147483647 !important",
    "contain: none !important",
  ].join(";");

  var CSS = `
    :host {
      all: initial !important;
      display: block !important;
    }

    *, *::before, *::after {
      all: unset;
      box-sizing: border-box;
    }

    style, script, template { display: none; }

    .root {
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 14px;
      font-weight: 400;
      font-style: normal;
      line-height: 1.4;
      letter-spacing: normal;
      word-spacing: normal;
      text-transform: none;
      text-align: left;
      text-indent: 0;
      text-shadow: none;
      color: #1f2330;
      direction: ltr;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    div, section, header, form, ul, li, p { display: block; }

    .launcher {
      position: fixed;
      right: 24px;
      bottom: 24px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6c5ce7, #a35cf0);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      pointer-events: auto;
      box-shadow: 0 8px 24px rgba(76, 52, 180, 0.35), 0 2px 6px rgba(0, 0, 0, 0.15);
      transition: transform 160ms ease, box-shadow 160ms ease;
    }
    .launcher:hover { transform: scale(1.06); }
    .launcher:active { transform: scale(0.96); }
    .launcher:focus-visible { outline: 3px solid #a35cf0; outline-offset: 3px; }
    .launcher svg { display: block; width: 28px; height: 28px; fill: currentColor; }

    .panel {
      position: fixed;
      right: 24px;
      bottom: 96px;
      width: 360px;
      max-width: calc(100vw - 32px);
      height: 480px;
      max-height: calc(100vh - 128px);
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(20, 20, 40, 0.25), 0 4px 12px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      pointer-events: auto;
      opacity: 0;
      transform: translateY(16px) scale(0.98);
      visibility: hidden;
      transition: opacity 180ms ease, transform 180ms ease, visibility 0s linear 180ms;
    }
    .panel.open {
      opacity: 1;
      transform: none;
      visibility: visible;
      transition: opacity 180ms ease, transform 180ms ease, visibility 0s;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      background: linear-gradient(135deg, #6c5ce7, #a35cf0);
      color: #fff;
    }
    .title { display: block; font-size: 15px; font-weight: 600; }
    .subtitle { display: block; font-size: 12px; opacity: 0.85; }
    .close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      cursor: pointer;
      color: #fff;
      font-size: 22px;
      line-height: 1;
    }
    .close:hover { background: rgba(255, 255, 255, 0.18); }
    .close:focus-visible { outline: 2px solid #fff; outline-offset: 1px; }

    .messages {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1 1 auto;
      padding: 16px;
      overflow-y: auto;
      background: #f6f6fb;
    }
    .msg {
      display: block;
      max-width: 80%;
      padding: 9px 12px;
      border-radius: 14px;
      white-space: pre-wrap;
      word-wrap: break-word;
      overflow-wrap: anywhere;
    }
    .msg.bot { align-self: flex-start; background: #fff; color: #1f2330; border: 1px solid #e6e6f0; border-bottom-left-radius: 4px; }
    .msg.user { align-self: flex-end; background: #6c5ce7; color: #fff; border-bottom-right-radius: 4px; }

    .composer {
      display: flex;
      gap: 8px;
      padding: 12px;
      border-top: 1px solid #ececf3;
      background: #fff;
    }
    .input {
      display: block;
      flex: 1 1 auto;
      min-width: 0;
      height: 40px;
      padding: 0 12px;
      border: 1px solid #d9d9e5;
      border-radius: 10px;
      background: #fff;
      color: #1f2330;
      font: inherit;
      cursor: text;
      -webkit-user-select: text;
      user-select: text;
    }
    .input::placeholder { color: #9a9ab0; opacity: 1; }
    .input:focus { border-color: #6c5ce7; box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.18); }
    .send {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      padding: 0 16px;
      border-radius: 10px;
      background: #6c5ce7;
      color: #fff;
      font-weight: 600;
      cursor: pointer;
    }
    .send:hover { background: #5a4bd6; }
    .send:focus-visible { outline: 2px solid #a35cf0; outline-offset: 2px; }

    .confetti {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
    }

    @media (max-width: 480px) {
      .panel { right: 16px; left: 16px; width: auto; max-width: none; bottom: 92px; }
      .launcher { right: 16px; bottom: 16px; }
    }
  `;

  var CHAT_ICON =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3C6.48 3 2 6.94 2 11.8c0 2.6 1.3 4.94 3.36 6.55-.13 1.2-.6 2.5-1.6 3.65 2.07-.1 3.9-.9 5.12-1.83.98.26 2.03.4 3.12.4 5.52 0 10-3.94 10-8.77S17.52 3 12 3z"/></svg>';

  function el(tag, className, attrs) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (attrs) for (var key in attrs) node.setAttribute(key, attrs[key]);
    return node;
  }

  function buildWidget() {
    var host = document.createElement(HOST_TAG);
    host.id = HOST_ID;
    host.setAttribute("style", HOST_RESET);

    var shadow = host.attachShadow({ mode: "closed" });
    var style = document.createElement("style");
    style.textContent = CSS;
    shadow.appendChild(style);

    var root = el("div", "root");
    var canvas = el("canvas", "confetti", { "aria-hidden": "true" });

    var launcher = el("button", "launcher", { type: "button", "aria-label": "Open chat", "aria-expanded": "false" });
    launcher.innerHTML = CHAT_ICON;

    var panel = el("section", "panel", { role: "dialog", "aria-label": "Chat", "aria-hidden": "true" });
    var header = el("header", "header");
    var titles = el("div");
    var title = el("span", "title");
    title.textContent = "PoC Chat";
    var subtitle = el("span", "subtitle");
    subtitle.textContent = "Injected via a single script tag";
    titles.append(title, subtitle);
    var close = el("button", "close", { type: "button", "aria-label": "Close chat" });
    close.textContent = "×";
    header.append(titles, close);

    var messages = el("div", "messages", { "aria-live": "polite" });
    var form = el("form", "composer");
    var input = el("input", "input", { type: "text", placeholder: "Type a message…", "aria-label": "Message" });
    var send = el("button", "send", { type: "submit" });
    send.textContent = "Send";
    form.append(input, send);

    panel.append(header, messages, form);
    root.append(panel, launcher, canvas);
    shadow.appendChild(root);

    return { host: host, launcher: launcher, panel: panel, close: close, messages: messages, form: form, input: input, canvas: canvas };
  }

  function addMessage(container, text, who) {
    var msg = el("div", "msg " + who);
    msg.textContent = text;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
  }

  var CONFETTI_COLORS = ["#6c5ce7", "#a35cf0", "#ff6b6b", "#feca57", "#1dd1a1", "#48dbfb", "#ff9ff3"];

  function launchConfetti(canvas) {
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var width = window.innerWidth;
    var height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var particles = [];
    var originX = width - 54;
    var originY = height - 54;

    for (var i = 0; i < 220; i++) {
      var fromCorner = i < 120;
      var angle = fromCorner ? (-Math.PI / 2) - Math.random() * (Math.PI / 2.2) : Math.PI / 2;
      var speed = fromCorner ? 9 + Math.random() * 13 : 1 + Math.random() * 3;
      particles.push({
        x: fromCorner ? originX : Math.random() * width,
        y: fromCorner ? originY : -20 - Math.random() * height * 0.5,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 8,
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.3,
        wobble: Math.random() * Math.PI * 2,
        color: CONFETTI_COLORS[(Math.random() * CONFETTI_COLORS.length) | 0],
        round: Math.random() < 0.25,
      });
    }

    var duration = 4200;
    var start = performance.now();

    function frame(now) {
      var elapsed = now - start;
      var fade = Math.max(0, Math.min(1, (duration - elapsed) / 800));
      ctx.clearRect(0, 0, width, height);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.vy += 0.25;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.wobble += 0.1;
        p.x += p.vx + Math.sin(p.wobble) * 0.6;
        p.y += p.vy;
        p.rotation += p.spin;

        if (p.y > height + 40) continue;

        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        if (p.round) {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.scale(1, Math.cos(p.wobble));
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
      }

      if (elapsed < duration) {
        requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, width, height);
        canvas.width = 0;
        canvas.height = 0;
      }
    }

    requestAnimationFrame(frame);
  }

  function init() {
    var ui = buildWidget();
    var isOpen = false;
    var greeted = false;

    function setOpen(open) {
      isOpen = open;
      ui.panel.classList.toggle("open", open);
      ui.panel.setAttribute("aria-hidden", String(!open));
      ui.launcher.setAttribute("aria-expanded", String(open));
      ui.launcher.setAttribute("aria-label", open ? "Close chat" : "Open chat");

      if (!open) return;
      launchConfetti(ui.canvas);
      if (!greeted) {
        greeted = true;
        addMessage(ui.messages, "Hello World", "bot");
      }
      setTimeout(function () { ui.input.focus(); }, 50);
    }

    ui.launcher.addEventListener("click", function () { setOpen(!isOpen); });
    ui.close.addEventListener("click", function () { setOpen(false); ui.launcher.focus(); });
    ui.panel.addEventListener("keydown", function (event) {
      if (event.key === "Escape") { setOpen(false); ui.launcher.focus(); }
    });

    ui.form.addEventListener("submit", function (event) {
      event.preventDefault();
      var text = ui.input.value.trim();
      if (!text) return;
      addMessage(ui.messages, text, "user");
      ui.input.value = "";
      setTimeout(function () {
        addMessage(ui.messages, "You said: “" + text + "”. The PoC is alive.", "bot");
      }, 400);
    });

    document.documentElement.appendChild(ui.host);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
