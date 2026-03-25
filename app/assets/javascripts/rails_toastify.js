let toastIdCounter = 0;

const TOAST_ICONS = {
  info: '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z"/></svg>',
  success: '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"/></svg>',
  warning: '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M23.32 17.191L15.438 2.184C14.728.833 13.416 0 11.996 0c-1.42 0-2.733.833-3.443 2.184L.533 17.448a4.744 4.744 0 000 4.368C1.243 23.167 2.555 24 3.975 24h16.05C22.22 24 24 22.044 24 19.632c0-.904-.232-1.747-.68-2.441zM12.002 7a1.5 1.5 0 011.5 1.5v5a1.5 1.5 0 01-3 0v-5a1.5 1.5 0 011.5-1.5zm-.004 12a2 2 0 110-4 2 2 0 010 4z"/></svg>',
  error: '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z"/></svg>'
};

const CLOSE_SVG = '<svg viewBox="0 0 14 14" width="14" height="14" fill="currentColor"><path d="M14 1.41L12.59 0 7 5.59 1.41 0 0 1.41 5.59 7 0 12.59 1.41 14 7 8.41 12.59 14 14 12.59 8.41 7z"/></svg>';

function showToast(message, options) {
  options = options || {};
  const theme = options.theme || 'light';
  const animation = options.animation || 'bounce';
  const duration = options.duration || 3000;
  const type = options.type || 'default';

  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;

  const currentId = toastIdCounter;
  const toast = document.createElement('div');
  toast.id = `toast-${currentId}`;
  toast.setAttribute('data-animation', animation);

  let classes = `toast toast-${theme} show ${animation}`;
  if (type !== 'default') {
    classes += ` toast-type-${type}`;
  }
  toast.className = classes;

  let iconHtml = '';
  if (type !== 'default' && TOAST_ICONS[type]) {
    iconHtml = `<div class="toast-icon toast-icon-${type}">${TOAST_ICONS[type]}</div>`;
  }

  toast.innerHTML =
    `<div class="toast-body">` +
      iconHtml +
      `<div class="toast-message">${message}</div>` +
    `</div>` +
    `<span class="close-icon" onclick="hideToast(${currentId})" aria-label="close">${CLOSE_SVG}</span>` +
    `<div class="progress-bar progress-bar-${type}" id="progress-bar-${currentId}"></div>`;

  toastContainer.appendChild(toast);
  toastIdCounter++;

  const progressBar = toast.querySelector('.progress-bar');
  progressBar.style.width = '100%';

  let remainingTime = duration;
  let lastUpdateTime = Date.now();
  let paused = false;

  function updateProgressBar() {
    if (!paused) {
      const currentTime = Date.now();
      const elapsedTime = currentTime - lastUpdateTime;
      remainingTime -= elapsedTime;
      lastUpdateTime = currentTime;

      const progress = (remainingTime / duration) * 100;
      progressBar.style.width = `${Math.max(progress, 0)}%`;

      if (remainingTime <= 0) {
        clearInterval(intervalId);
        dismissToast(toast);
        return;
      }
    }
  }

  toast.addEventListener('mouseover', () => {
    paused = true;
  });

  toast.addEventListener('mouseout', () => {
    paused = false;
    lastUpdateTime = Date.now();
  });

  const intervalId = setInterval(updateProgressBar, 100);
  toast._intervalId = intervalId;
}

function dismissToast(toast) {
  if (toast._intervalId) {
    clearInterval(toast._intervalId);
    toast._intervalId = null;
  }

  const animation = toast.getAttribute('data-animation') || 'bounce';
  toast.classList.remove('show');
  toast.classList.remove(animation);
  toast.classList.add(`${animation}-exit`);

  let removed = false;
  const removeToast = () => {
    if (!removed && toast.parentElement) {
      removed = true;
      toast.parentElement.removeChild(toast);
    }
  };

  toast.addEventListener('animationend', removeToast);
  setTimeout(removeToast, 1000);
}

function hideToast(toastId) {
  const toast = document.getElementById(`toast-${toastId}`);
  if (toast) {
    dismissToast(toast);
  }
}

window.hideToast = hideToast;
