import { urls } from '../data/queue.js';

const fetchPageData = async (url, elementId) => {
  const loadingIcon = document.getElementById(`${elementId}_loading`);
  const textElement = document.getElementById(`${elementId}_text`);
  const linkElement = document.getElementById(`${elementId}_link`);

  if (loadingIcon && textElement) {
    loadingIcon.style.display = 'inline';
    textElement.innerText = '';
    linkElement.href = url;
    linkElement.target = '_blank';

    try {
      const response = await chrome.runtime.sendMessage({
        action: 'fetchQuanity',
        url,
      });

      if (response?.html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.html, 'text/html');
        const summaryElement = doc.querySelector('.summary');
        if (summaryElement) {
          const summaryText = summaryElement.innerText;
          const match = summaryText.match(/of\s+([\d,]+)\s+item[s]?/);
          if (match) {
            const totalItems = match[1];
            textElement.innerText = totalItems;
          } else {
            textElement.innerText = 0;
          }
        } else {
          textElement.innerText = 0;
        }
      }
    } catch (error) {
      textElement.innerText = 0;
    } finally {
      loadingIcon.style.display = 'none';
    }
  }
};

const fetchAllData = async () => {
  const promises = urls.map((item) => fetchPageData(item.url, item.elementId));
  await Promise.all(promises);
};

fetchAllData();
