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

    let lastMouseX = 0;
    let lastMouseY = 0;
    let popupDelay = null;

    document.addEventListener('mouseover', function (event) {
      popup.style.display = 'none';
      let target = event.target;
      let parentHref = target?.parentElement?.href;
      let href = target?.href;
      const isImage = target.tagName === 'IMG';
      const isLink = target.tagName === 'A';
      const isImageSrc = /\.(jpg|jpeg|png|gif|svg)$/i.test(target.src);
      const isImageLink = /\.(jpg|jpeg|png|gif|svg)$/i.test(target.href);
      const isValidHref =
        parentHref &&
        parentHref.startsWith('http') &&
        !parentHref.includes('/video');

      if (isImage) {
        popupImg.onload = () => {
          popupDelay = setTimeout(() => {
            const { newWidth, newHeight } = rescale(popup, scale, popupImg);
            popupImg.style.width = newWidth + 'px';
            popupImg.style.height = newHeight + 'px';
            mousemove(lastMouseX, lastMouseY, popup);
          }, 500);
        };
        popupImg.src = parentHref;
        if (isImageSrc && isValidHref) {
          popupImg.src = parentHref;
        } else {
          popupImg.src = target.src;
        }
      }

      if (isLink && isImageLink) {
        popupImg.onload = () => {
          popupDelay = setTimeout(() => {
            const { newWidth, newHeight } = rescale(popup, scale, popupImg);
            popupImg.style.width = newWidth + 'px';
            popupImg.style.height = newHeight + 'px';
            mousemove(lastMouseX, lastMouseY, popup);
          }, 500);
        };
        popupImg.src = href;
      }
    });

    document.addEventListener('mousemove', function (event) {
      lastMouseX = event.pageX;
      lastMouseY = event.pageY;
      mousemove(lastMouseX, lastMouseY, popup);
    });

    document.addEventListener('mouseout', function (event) {
      if (event.target.tagName === 'IMG' || event.target.tagName === 'A') {
        popup.style.display = 'none';
      }
      if (popupDelay) {
        clearTimeout(popupDelay);
        popupDelay = null;
      }
    });
  };

  const rescale = (popup, scale, target) => {
    popup.style.display = 'block';
    let scaleFactor = scale;
    let newWidth = target.naturalWidth * scaleFactor;
    let newHeight = target.naturalHeight * scaleFactor;

    let maxSize = scaleFactor * 300;

    if (newWidth > maxSize) {
      newWidth = maxSize;
      newHeight = (maxSize / target.naturalWidth) * target.naturalHeight;
    }
    if (newHeight > maxSize) {
      newHeight = maxSize;
      newWidth = (maxSize / target.naturalHeight) * target.naturalWidth;
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
