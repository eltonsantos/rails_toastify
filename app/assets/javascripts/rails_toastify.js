document.addEventListener('DOMContentLoaded', () => {
  window.RailsToastify = {
    showToast(message, type = 'info', duration = 3000) {
      const toastContainer = document.querySelector('.toast-container') || createToastContainer();
      const toast = createToast(message, type);
      toastContainer.appendChild(toast);
      setTimeout(() => {
        toast.classList.add('fade-out');
        toast.addEventListener('transitionend', () => toast.remove());
      }, duration);
    }
  };

  function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
  }

  function createToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    return toast;
  }
});