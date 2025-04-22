(function () {
  let isImageZoomInitialized = false;

  chrome.storage.local.get('scripts', (data) => {
    if (!data.scripts.imageZoom) return;

    if (!isImageZoomInitialized) {
      imageZoom(data.scripts.scaleValue);
      isImageZoomInitialized = true;
    }
  });

  const imageZoom = (scale) => {
    let popup = document.createElement('div');
    popup.classList.add('image-zoom-popup');

    let popupImg = document.createElement('img');
    document.body.appendChild(popup);
    popup.appendChild(popupImg);

    const initialX = window.innerWidth / 2;
    const initialY = window.innerHeight / 2;
    mousemove(initialX, initialY, popup);

    document.addEventListener('mouseover', function (event) {
      let target = event.target;
      let parentHref = target?.parentElement?.href;
      let x = event.pageX;
      let y = event.pageY;

      if (target.tagName === 'IMG' && parentHref) {
        if (parentHref !== 'javascript:void(0)') {
          popupImg.src = target.parentElement.href;
          const { newWidth, newHeight } = rescale(popup, scale, target);
          popupImg.style.width = newWidth + 'px';
          popupImg.style.height = newHeight + 'px';
        } else {
          popupImg.src = target.src;
          const { newWidth, newHeight } = rescale(popup, scale, target);
          popupImg.style.width = newWidth + 'px';
          popupImg.style.height = newHeight + 'px';
        }
      }

      if (target.tagName === 'IMG' && !parentHref) {
        popupImg.src = target.src;
        const { newWidth, newHeight } = rescale(popup, scale, target);
        popupImg.style.width = newWidth + 'px';
        popupImg.style.height = newHeight + 'px';
      }
    });

    document.addEventListener('mousemove', function (event) {
      let x = event.pageX;
      let y = event.pageY;
      mousemove(x, y, popup);
    });

    document.addEventListener('mouseout', function (event) {
      if (event.target.tagName === 'IMG') {
        popup.style.display = 'none';
      }
    });
  };

  const rescale = (popup, scale, target) => {
    popup.style.display = 'block';
    let scaleFactor = scale;
    let newWidth = target.naturalWidth * scaleFactor;
    let newHeight = target.naturalHeight * scaleFactor;

    if (newWidth > 800) {
      newWidth = 800;
      newHeight = (800 / target.naturalWidth) * target.naturalHeight;
    }
    if (newHeight > 800) {
      newHeight = 800;
      newWidth = (800 / target.naturalHeight) * target.naturalWidth;
    }

    return { newHeight, newWidth };
  };

  const mousemove = (x, y, popup) => {
    if (popup.style.display === 'block') {
      if (x < window.innerWidth / 2) {
        popup.style.left = x + 20 + 'px';
      } else {
        popup.style.left = x - popup.offsetWidth - 20 + 'px';
      }

      if (window.innerHeight / 2 + window.scrollY > y) {
        popup.style.top = y + 10 + 'px';
      } else {
        popup.style.top = y - popup.offsetHeight - 10 + 'px';
      }
    }
  };
})();
