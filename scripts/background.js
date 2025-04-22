const fetchParams = {
  method: 'GET',
  headers: {
    'Content-Type': 'text/html',
  },
};

chrome.storage.local.get('scripts', (data) => {
  if (!data.scripts) {
    const defaultScripts = {
      singleModeration: true,
      imageZoom: true,
      scaleValue: 2,
    };

    chrome.storage.local.set({ scripts: defaultScripts }, () => {});
  }
});

// Sidebar
chrome.runtime.onMessage.addListener(async (message, sender) => {
  if (
    message.type === 'open_swf_panel' ||
    message.type === 'open_photo_panel' ||
    message.type === 'open_performer_panel'
  ) {
    if (sender.tab) {
      const tabId = sender.tab.id;
      let panelPath;
      if (message.type === 'open_swf_panel') {
        panelPath = 'html/swfpanel.html';
      } else if (message.type === 'open_photo_panel') {
        panelPath = 'html/photopanel.html';
      } else if (message.type === 'open_performer_panel') {
        panelPath = 'html/performerpanel.html';
      }
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

// Fetch Email
const fetchEmail = async (url) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
  });
  return response.json();
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchEmail') {
    fetchEmail(request.url)
      .then((data) => sendResponse({ data }))
      .catch((error) => sendResponse({ error: error.toString() }));
    return true;
  }
});

// Queue request
const fetchPageContent = async (url) => {
  const response = await fetch(url, fetchParams);
  return response.text();
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchQuanity') {
    fetchPageContent(request.url)
      .then((html) => sendResponse({ html }))
      .catch((error) => sendResponse({ error: error.toString() }));
    return true;
  }
});

// Monetization status
const fetchMonetizationStatus = async (url) => {
  const response = await fetch(url, fetchParams);
  return response.text();
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchMonetizationStatus') {
    fetchMonetizationStatus(request.url)
      .then((html) => sendResponse({ html }))
      .catch((error) => sendResponse({ error: error.toString() }));
    return true;
  }
});

// Producer status
const fetchProducerStatus = async (url) => {
  const response = await fetch(url, fetchParams);
  return response.text();
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchProducerStatus') {
    fetchProducerStatus(request.url)
      .then((html) => sendResponse({ html }))
      .catch((error) => sendResponse({ error: error.toString() }));
    return true;
  }
});

// Producer comments
const fetchProducerComments = async (url) => {
  const response = await fetch(url, fetchParams);
  return response.text();
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchProducerComments') {
    fetchProducerComments(request.url)
      .then((html) => sendResponse({ html }))
      .catch((error) => sendResponse({ error: error.toString() }));
    return true;
  }
});

// Get Video Status
const fetchVideoStatus = async (url) => {
  const response = await fetch(url, fetchParams);
  return response.text();
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchVideoStatus') {
    fetchVideoStatus(request.url)
      .then((html) => sendResponse({ html }))
      .catch((error) => sendResponse({ error: error.toString() }));
    return true;
  }
});

// Settings
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggleScript') {
    const scriptName = message.script;

    chrome.storage.local.get('scripts', (data) => {
      let scripts = data.scripts || {};
      scripts[scriptName] = !scripts[scriptName];

      chrome.storage.local.set({ scripts }, () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (scripts[scriptName]) {
            chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              files: [`scripts/${scriptName}.js`],
            });
          }
        });
        sendResponse({ success: true });
      });
    });

    return true;
  }

  // Scale
  if (message.action === 'toggleScale') {
    const scaleValue = message.scale;

    chrome.storage.local.get('scripts', (data) => {
      let scripts = data.scripts || {};
      scripts.scaleValue = scaleValue;
      chrome.storage.local.set({ scripts }, () => {
        sendResponse({ success: true, scaleValue: scripts.scaleValue });
      });
    });

    return true;
  }
});
