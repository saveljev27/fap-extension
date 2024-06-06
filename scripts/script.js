const handleButtonClick = async (type, path) => {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  const tabId = tab.id;
  await chrome.runtime.sendMessage({ type });
  await chrome.sidePanel.open({ tabId });
  await chrome.sidePanel.setOptions({
    tabId,
    path,
    enabled: true,
  });
};

const swfBtn = document.getElementById('decline_swf');
if (swfBtn) {
  swfBtn.addEventListener('click', () => {
    handleButtonClick('open_swf_panel', 'html/swfpanel.html');
  });
}

const photoBtn = document.getElementById('decline_photo');
if (photoBtn) {
  photoBtn.addEventListener('click', () => {
    handleButtonClick('open_photo_panel', 'html/photopanel.html');
  });
}

const performerBtn = document.getElementById('decline_performer');
if (performerBtn) {
  performerBtn.addEventListener('click', () => {
    handleButtonClick('open_performer_panel', 'html/performerpanel.html');
  });
}
