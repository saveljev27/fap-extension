// Sidebar
chrome.runtime.onMessage.addListener(async (message, sender) => {
  if (
    message.type === 'open_side_panel' ||
    message.type === 'open_side_panel2'
  ) {
    if (sender.tab) {
      const tabId = sender.tab.id;
      const panelPath =
        message.type === 'open_side_panel'
          ? 'html/sidepanel.html'
          : 'html/sidepanel2.html';
      await chrome.sidePanel.open({ tabId });
      await chrome.sidePanel.setOptions({
        tabId,
        path: panelPath,
        enabled: true,
      });
    }
  }
});

// Admin panel request
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchData') {
    fetch(request.url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        sendResponse({ data: data });
      })
      .catch((error) => {
        sendResponse({ error: error.message });
      });
    return true;
  }
});
