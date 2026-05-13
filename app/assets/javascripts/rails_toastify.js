(function (global) {
  "use strict";

  var toastIdCounter = 0;

  var TOAST_ICONS = {
    info: '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z"/></svg>',
    success: '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"/></svg>',
    warning: '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M23.32 17.191L15.438 2.184C14.728.833 13.416 0 11.996 0c-1.42 0-2.733.833-3.443 2.184L.533 17.448a4.744 4.744 0 000 4.368C1.243 23.167 2.555 24 3.975 24h16.05C22.22 24 24 22.044 24 19.632c0-.904-.232-1.747-.68-2.441zM12.002 7a1.5 1.5 0 011.5 1.5v5a1.5 1.5 0 01-3 0v-5a1.5 1.5 0 011.5-1.5zm-.004 12a2 2 0 110-4 2 2 0 010 4z"/></svg>',
    error: '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z"/></svg>'
  };

  var CLOSE_SVG = '<svg viewBox="0 0 14 14" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M14 1.41L12.59 0 7 5.59 1.41 0 0 1.41 5.59 7 0 12.59 1.41 14 7 8.41 12.59 14 14 12.59 8.41 7z"/></svg>';

  function containerElement() {
    return document.getElementById("rails-toastify-container") || document.getElementById("toast-container");
  }

  function readConfig(container) {
    if (!container) return {};

    var raw = container.dataset ? container.dataset.railsToastifyConfig : null;
    if (!raw) return {};

    try {
      return JSON.parse(raw);
    } catch (_error) {
      return {};
    }
  }

  function configValue(config, key, fallback) {
    return config[key] == null || config[key] === "" ? fallback : config[key];
  }

  function defaultOptions(config, kind) {
    var prefix = kind === "alert" ? "alert" : "notice";

    return {
      kind: prefix,
      theme: configValue(config, prefix + "_theme", "light"),
      animation: configValue(config, prefix + "_animation", "bounce"),
      duration: configValue(config, prefix + "_duration", 3000),
      type: configValue(config, prefix + "_type", prefix === "alert" ? "error" : "default"),
      progressColor: configValue(config, prefix + "_progress_color", config.progress_color || null),
      draggable: config.draggable !== false,
      dragThreshold: Number(config.drag_threshold || 0.5)
    };
  }

  function normalizeOptions(config, options) {
    options = options || {};

    var defaults = defaultOptions(config, options.kind);
    var normalized = Object.assign({}, defaults, options);
    normalized.progressColor = options.progressColor || options.progress_color || defaults.progressColor || config.progress_color || null;
    normalized.dragThreshold = Math.min(Math.max(Number(normalized.dragThreshold || normalized.drag_threshold || 0.5), 0.01), 1);
    normalized.duration = Number(normalized.duration || 3000);
    normalized.draggable = normalized.draggable !== false;

    return normalized;
  }

  function setProgressColor(progressBar, color) {
    if (!color) return;

    if (!global.CSS || !CSS.supports || CSS.supports("color", color)) {
      progressBar.style.background = "none";
      progressBar.style.backgroundColor = color;
    }
  }

  function appendIcon(toastBody, type) {
    if (type === "default" || !TOAST_ICONS[type]) return;

    var icon = document.createElement("div");
    icon.className = "rails-toastify-icon rails-toastify-icon-" + type;
    icon.innerHTML = TOAST_ICONS[type];
    toastBody.appendChild(icon);
  }

  function createToast(message, options) {
    var currentId = toastIdCounter++;
    var toast = document.createElement("div");
    toast.id = "rails-toastify-toast-" + currentId;
    toast.setAttribute("data-animation", options.animation);
    toast.className = [
      "rails-toastify-toast",
      "rails-toastify-toast-" + options.theme,
      "rails-toastify-show",
      "rails-toastify-" + options.animation,
      options.type === "default" ? "" : "rails-toastify-type-" + options.type
    ].filter(Boolean).join(" ");

    var body = document.createElement("div");
    body.className = "rails-toastify-body";
    appendIcon(body, options.type);

    var messageElement = document.createElement("div");
    messageElement.className = "rails-toastify-message";
    messageElement.textContent = message == null ? "" : String(message);
    body.appendChild(messageElement);
    toast.appendChild(body);

    var closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "rails-toastify-close";
    closeButton.setAttribute("aria-label", "Close notification");
    closeButton.innerHTML = CLOSE_SVG;
    closeButton.addEventListener("click", function () {
      dismissToast(toast);
    });
    toast.appendChild(closeButton);

    var progressBar = document.createElement("div");
    progressBar.className = "rails-toastify-progress rails-toastify-progress-" + options.type;
    setProgressColor(progressBar, options.progressColor);
    toast.appendChild(progressBar);

    return { toast: toast, progressBar: progressBar };
  }

  function showToast(message, options) {
    var container = containerElement();
    if (!container) return null;

    RailsToastify.config = Object.assign({}, RailsToastify.config || {}, readConfig(container));
    options = normalizeOptions(RailsToastify.config, options);

    var elements = createToast(message, options);
    var toast = elements.toast;
    var progressBar = elements.progressBar;
    container.appendChild(toast);

    startTimer(toast, progressBar, options.duration);
    if (options.draggable) enableDrag(toast, options.dragThreshold);

    return toast;
  }

  function startTimer(toast, progressBar, duration) {
    progressBar.style.width = "100%";

    var remainingTime = duration;
    var lastUpdateTime = Date.now();
    var paused = false;

    function pause() {
      paused = true;
    }

    function resume() {
      paused = false;
      lastUpdateTime = Date.now();
    }

    function updateProgressBar() {
      if (paused) return;

      var currentTime = Date.now();
      remainingTime -= currentTime - lastUpdateTime;
      lastUpdateTime = currentTime;

      var progress = (remainingTime / duration) * 100;
      progressBar.style.width = Math.max(progress, 0) + "%";

      if (remainingTime <= 0) dismissToast(toast);
    }

    toast.addEventListener("mouseenter", pause);
    toast.addEventListener("mouseleave", resume);
    toast.addEventListener("focusin", pause);
    toast.addEventListener("focusout", resume);

    toast._railsToastifyIntervalId = setInterval(updateProgressBar, 100);
  }

  function enableDrag(toast, threshold) {
    var startX = 0;
    var offsetX = 0;
    var dragging = false;

    toast.addEventListener("pointerdown", function (event) {
      if (event.target.closest(".rails-toastify-close")) return;

      dragging = true;
      startX = event.clientX;
      offsetX = 0;
      toast.classList.add("rails-toastify-dragging");
      try {
        toast.setPointerCapture && toast.setPointerCapture(event.pointerId);
      } catch (_error) {
        // Some browsers reject synthetic or already-released pointer captures.
      }
    });

    toast.addEventListener("pointermove", function (event) {
      if (!dragging) return;

      offsetX = event.clientX - startX;
      toast.style.transform = "translate3d(" + offsetX + "px, 0, 0)";
      toast.style.opacity = String(Math.max(1 - Math.abs(offsetX) / toast.offsetWidth, 0.2));
    });

    function finishDrag(event) {
      if (!dragging) return;

      dragging = false;
      toast.classList.remove("rails-toastify-dragging");
      try {
        toast.releasePointerCapture && toast.releasePointerCapture(event.pointerId);
      } catch (_error) {
        // Releasing a pointer that was not captured should not block dismissal.
      }

      if (Math.abs(offsetX) >= toast.offsetWidth * threshold) {
        toast.style.transform = "";
        toast.style.opacity = "";
        dismissToast(toast);
      } else {
        toast.style.transform = "";
        toast.style.opacity = "";
        toast.classList.add("rails-toastify-snap-back");
        setTimeout(function () {
          toast.classList.remove("rails-toastify-snap-back");
        }, 200);
      }
    }

    toast.addEventListener("pointerup", finishDrag);
    toast.addEventListener("pointercancel", finishDrag);
  }

  function dismissToast(toast) {
    if (!toast || toast._railsToastifyDismissed) return;

    toast._railsToastifyDismissed = true;
    if (toast._railsToastifyIntervalId) {
      clearInterval(toast._railsToastifyIntervalId);
      toast._railsToastifyIntervalId = null;
    }

    var animation = toast.getAttribute("data-animation") || "bounce";
    toast.classList.remove("rails-toastify-show");
    toast.classList.remove("rails-toastify-" + animation);
    toast.classList.add("rails-toastify-" + animation + "-exit");

    var removed = false;
    var removeToast = function () {
      if (!removed && toast.parentElement) {
        removed = true;
        toast.parentElement.removeChild(toast);
      }
    };

    toast.addEventListener("animationend", removeToast);
    setTimeout(removeToast, 1000);
  }

  function hideToast(toastId) {
    var toast = document.getElementById("rails-toastify-toast-" + toastId) || document.getElementById("toast-" + toastId);
    if (toast) dismissToast(toast);
  }

  function showMessages() {
    var messageNodes = document.querySelectorAll("script[data-rails-toastify-messages]:not([data-rails-toastify-processed])");

    Array.prototype.forEach.call(messageNodes, function (node) {
      node.setAttribute("data-rails-toastify-processed", "true");

      try {
        JSON.parse(node.textContent || "[]").forEach(function (payload) {
          showToast(payload.message, payload.options || {});
        });
      } catch (_error) {
        return;
      }
    });
  }

  function init() {
    var container = containerElement();
    RailsToastify.config = Object.assign({}, RailsToastify.config || {}, readConfig(container));
    showMessages();
  }

  var RailsToastify = global.RailsToastify || {};
  RailsToastify.config = RailsToastify.config || {};
  RailsToastify.init = init;
  RailsToastify.show = showToast;
  RailsToastify.hide = hideToast;

  global.RailsToastify = RailsToastify;
  global.hideToast = hideToast;

  document.addEventListener("DOMContentLoaded", init);
  document.addEventListener("turbo:load", init);
  if (document.readyState !== "loading") init();
})(window);
