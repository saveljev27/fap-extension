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

const button = document.getElementById('decline_reasons');
if (button) {
  button.addEventListener('click', () => {
    handleButtonClick('open_side_panel', 'html/sidepanel.html');
  });
}

const button2 = document.getElementById('decline_reasons2');
if (button2) {
  button2.addEventListener('click', () => {
    handleButtonClick('open_side_panel2', 'html/sidepanel2.html');
  });
}
