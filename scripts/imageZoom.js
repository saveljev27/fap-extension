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
    let lastMouseX = 0;
    let lastMouseY = 0;
    mousemove(initialX, initialY, popup);

    document.addEventListener('mouseover', function (event) {
      lastMouseX = event.pageX;
      lastMouseY = event.pageY;
      let target = event.target;
      let parentHref = target?.parentElement?.href;
      const isImage = target.tagName === 'IMG';
      const isImageLink = /\.(jpg|jpeg|png|gif|svg)$/i.test(target.src);
      const isValidHref =
        parentHref &&
        parentHref.startsWith('http') &&
        !parentHref.includes('/video');

      if (isImage) {
        if (isImageLink && isValidHref) {
          popupImg.onload = () => {
            const { newWidth, newHeight } = rescale(popup, scale, popupImg);
            popupImg.style.width = newWidth + 'px';
            popupImg.style.height = newHeight + 'px';
            mousemove(lastMouseX, lastMouseY, popup);
          };
          popupImg.src = parentHref;
        } else {
          popupImg.src = target.src;
          const { newWidth, newHeight } = rescale(popup, scale, target);
          popupImg.style.width = newWidth + 'px';
          popupImg.style.height = newHeight + 'px';
        }
      }

      if (isImage && !parentHref) {
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
