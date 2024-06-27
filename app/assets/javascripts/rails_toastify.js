document.addEventListener('DOMContentLoaded', () => {
  window.RailsToastify = {
    showToast(message, type = 'info', duration = 5000) {
      const toastContainer = document.querySelector('.toast-container') || createToastContainer();
      const toast = createToast(message, type, duration);
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

  function createToast(message, type, duration) {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.classList.add('show');
  
    const closeButton = document.createElement('button');
    closeButton.className = 'toast__close-button';
    closeButton.innerHTML = '<svg aria-hidden="true" viewBox="0 0 14 16"><path fill-rule="evenodd" d="M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z"></path></svg>';
    closeButton.addEventListener('click', () => {
      toast.classList.add('hide');
      toast.addEventListener('transitionend', () => toast.remove());
    });
  
    const progressBar = document.createElement('div');
    progressBar.className = `toast__progress-bar toast__progress-bar--${type}`;
    progressBar.style.animationDuration = `${duration}ms`;
  
    const body = document.createElement('div');
    body.className = 'toast__body';
    body.textContent = message;
  
    toast.appendChild(body);
    toast.appendChild(closeButton);
    toast.appendChild(progressBar);
  
    toast.addEventListener('click', () => {
      toast.classList.add('hide');
      toast.addEventListener('transitionend', () => toast.remove());
    });
    toast.addEventListener('mouseover', () => progressBar.style.animationPlayState = 'paused');
    toast.addEventListener('mouseout', () => progressBar.style.animationPlayState = 'running');
  
    return toast;
  }
  
});
