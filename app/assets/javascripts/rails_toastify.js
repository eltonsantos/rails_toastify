const totalDuration = 3000;
let toastIdCounter = 0;

function showToast(message, options) {
  const toastContainer = document.getElementById('toast-container');
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${options.theme} show ${options.animation}`;
  toast.id = `toast-${toastIdCounter}`;

  /* Adicione a respectiva classe para mudar a cor da progress-bar */
  toast.innerHTML = `
    <div>${message}</div>
    <div class="progress-bar progress-bar-${options.type}" id="progress-bar-${toastIdCounter}"></div>
    <span class="close-icon" onclick="hideToast(${toastIdCounter})"><i class="fas fa-times"></i></span>
  `;

  toastContainer.appendChild(toast);
  toastIdCounter++;

  const progressBar = toast.querySelector('.progress-bar');
  progressBar.style.width = '100%';

  let remainingTime = options.duration;
  let lastUpdateTime = Date.now();
  let paused = false;
  let intervalId;

  function updateProgressBar() {
    if (!paused) {
      const currentTime = Date.now();
      const elapsedTime = currentTime - lastUpdateTime;
      remainingTime -= elapsedTime;
      lastUpdateTime = currentTime;

      const progress = (remainingTime / totalDuration) * 100;
      progressBar.style.width = `${progress}%`;

      if (remainingTime <= 0) {
        clearInterval(intervalId);
        toast.classList.remove('show');
        toast.classList.add('hide');
        setTimeout(() => {
          toast.parentElement.removeChild(toast);
        }, 300);
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

  intervalId = setInterval(updateProgressBar, 100);
}

function hideToast(toastId) {
  const toast = document.getElementById(`toast-${toastId}`);
  if (toast) {
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => {
      toast.parentElement.removeChild(toast);
    }, 300);
  }
}

window.hideToast = hideToast;

/* showToast('slide'); */