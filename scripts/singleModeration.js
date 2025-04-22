(function () {
  let isSingleModerationInitialized = false;

  chrome.storage.local.get('scripts', (data) => {
    if (!data.scripts.singleModeration) return;

    if (!isSingleModerationInitialized) {
      isSingleModerationInitialized = true;
      changeWidth();
    }
  });

  const changeWidth = () => {
    const col = document.querySelectorAll('.col-md-8');
    Array.from(col).forEach((block) => {
      block.style.width = '100%';
    });
  };
})();
