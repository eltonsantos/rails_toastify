const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

class ClassList {
  constructor(element) {
    this.element = element;
  }

  add(...classes) {
    const current = new Set(this.element.className.split(/\s+/).filter(Boolean));
    classes.forEach((name) => current.add(name));
    this.element.className = Array.from(current).join(" ");
  }

  remove(...classes) {
    const removed = new Set(classes);
    this.element.className = this.element.className
      .split(/\s+/)
      .filter((name) => name && !removed.has(name))
      .join(" ");
  }

  contains(name) {
    return this.element.className.split(/\s+/).includes(name);
  }
}

class Element {
  constructor(tagName) {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.parentElement = null;
    this.attributes = {};
    this.dataset = {};
    this.style = {};
    this.eventListeners = {};
    this.className = "";
    this.textContent = "";
    this.innerHTML = "";
    this.offsetWidth = 320;
    this.classList = new ClassList(this);
  }

  set id(value) {
    this.attributes.id = value;
  }

  get id() {
    return this.attributes.id;
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
    if (name.startsWith("data-")) {
      const key = name
        .slice(5)
        .replace(/-([a-z])/g, (_match, letter) => letter.toUpperCase());
      this.dataset[key] = String(value);
    }
  }

  getAttribute(name) {
    return this.attributes[name];
  }

  appendChild(child) {
    child.parentElement = this;
    this.children.push(child);
    return child;
  }

  removeChild(child) {
    this.children = this.children.filter((candidate) => candidate !== child);
    child.parentElement = null;
  }

  addEventListener(type, listener) {
    this.eventListeners[type] ||= [];
    this.eventListeners[type].push(listener);
  }

  dispatchEvent(event) {
    event.target ||= this;
    (this.eventListeners[event.type] || []).forEach((listener) => listener(event));
  }

  querySelector(selector) {
    return find(this, (element) => matches(element, selector));
  }

  closest(selector) {
    let element = this;
    while (element) {
      if (matches(element, selector)) return element;
      element = element.parentElement;
    }
    return null;
  }

  setPointerCapture() {}
  releasePointerCapture() {}
}

class Document {
  constructor() {
    this.body = new Element("body");
    this.readyState = "complete";
    this.eventListeners = {};
  }

  createElement(tagName) {
    return new Element(tagName);
  }

  getElementById(id) {
    return find(this.body, (element) => element.id === id);
  }

  querySelectorAll(selector) {
    const all = [];
    walk(this.body, (element) => {
      if (selector === "script[data-rails-toastify-messages]:not([data-rails-toastify-processed])") {
        if (
          element.tagName === "SCRIPT" &&
          element.attributes["data-rails-toastify-messages"] != null &&
          element.attributes["data-rails-toastify-processed"] == null
        ) {
          all.push(element);
        }
      } else if (matches(element, selector)) {
        all.push(element);
      }
    });
    return all;
  }

  addEventListener(type, listener) {
    this.eventListeners[type] ||= [];
    this.eventListeners[type].push(listener);
  }

  dispatchEvent(event) {
    (this.eventListeners[event.type] || []).forEach((listener) => listener(event));
  }
}

function walk(root, callback) {
  callback(root);
  root.children.forEach((child) => walk(child, callback));
}

function find(root, predicate) {
  if (predicate(root)) return root;
  for (const child of root.children) {
    const found = find(child, predicate);
    if (found) return found;
  }
  return null;
}

function matches(element, selector) {
  if (selector.startsWith(".")) {
    return element.className.split(/\s+/).includes(selector.slice(1));
  }
  return false;
}

function loadToastify({ config = {}, messages = [] } = {}) {
  const document = new Document();
  const container = document.createElement("div");
  container.id = "rails-toastify-container";
  container.className = "rails-toastify-container";
  container.dataset.railsToastifyConfig = JSON.stringify(config);
  document.body.appendChild(container);

  if (messages.length > 0) {
    const script = document.createElement("script");
    script.setAttribute("data-rails-toastify-messages", "true");
    script.textContent = JSON.stringify(messages);
    document.body.appendChild(script);
  }

  const timers = [];
  const window = {
    CSS: { supports: () => true },
    setInterval: () => 1,
    clearInterval: () => {},
    setTimeout: (callback) => {
      timers.push(callback);
      return timers.length;
    }
  };

  const context = {
    window,
    document,
    CSS: window.CSS,
    setInterval: window.setInterval,
    clearInterval: window.clearInterval,
    setTimeout: window.setTimeout,
    Date
  };

  vm.runInNewContext(
    fs.readFileSync(path.join(__dirname, "../../app/assets/javascripts/rails_toastify.js"), "utf8"),
    context
  );

  return { document, container, window, timers };
}

test("show inserts messages as text and uses namespaced classes", () => {
  const { container, window } = loadToastify();

  const toast = window.RailsToastify.show("<img src=x onerror=alert(1)>", { type: "success" });

  assert.equal(container.children.length, 1);
  assert.equal(toast.classList.contains("rails-toastify-toast"), true);
  assert.equal(toast.querySelector(".rails-toastify-message").textContent, "<img src=x onerror=alert(1)>");
});

test("flash messages are processed once across repeated init events", () => {
  const { container, document, window } = loadToastify({
    messages: [{ message: "Saved", options: { kind: "notice" } }]
  });

  assert.equal(container.children.length, 1);
  window.RailsToastify.init();
  document.dispatchEvent({ type: "turbo:load" });

  assert.equal(container.children.length, 1);
});

test("progress color precedence prefers explicit per-toast value", () => {
  const { window } = loadToastify({
    config: { progress_color: "red", notice_progress_color: "blue" }
  });

  const toast = window.RailsToastify.show("Saved", { progressColor: "#22c55e" });

  assert.equal(toast.querySelector(".rails-toastify-progress").style.backgroundColor, "#22c55e");
});

test("drag beyond threshold dismisses the toast", () => {
  const { window } = loadToastify({ config: { drag_threshold: 0.5 } });
  const toast = window.RailsToastify.show("Drag me", { duration: 3000 });

  toast.dispatchEvent({ type: "pointerdown", clientX: 0, pointerId: 1 });
  toast.dispatchEvent({ type: "pointermove", clientX: 200, pointerId: 1 });
  toast.dispatchEvent({ type: "pointerup", clientX: 200, pointerId: 1 });

  assert.equal(toast._railsToastifyDismissed, true);
});

test("drag below threshold snaps back without dismissing", () => {
  const { window } = loadToastify({ config: { drag_threshold: 0.5 } });
  const toast = window.RailsToastify.show("Drag me", { duration: 3000 });

  toast.dispatchEvent({ type: "pointerdown", clientX: 0, pointerId: 1 });
  toast.dispatchEvent({ type: "pointermove", clientX: 20, pointerId: 1 });
  toast.dispatchEvent({ type: "pointerup", clientX: 20, pointerId: 1 });

  assert.equal(toast._railsToastifyDismissed, undefined);
  assert.equal(toast.style.transform, "");
});
