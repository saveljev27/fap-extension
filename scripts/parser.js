const urls = [
  {
    url: 'https://panel.sexflix.com/video/moderation/',
    elementId: 'video',
  },
  {
    url: 'https://panel.sexflix.com/video/moderation/?studioSearchString=&studioPrivacyType=&requestType=&producerType=1&durationType=&isScheduled=',
    elementId: 'videoindividuals',
  },
  {
    url: 'https://panel.sexflix.com/video/moderation/?studioSearchString=&studioPrivacyType=&requestType=&producerType=2&durationType=&isScheduled=',
    elementId: 'videobusiness',
  },
  {
    url: 'https://panel.sexflix.com/transferredcontent/moderation/video',
    elementId: 'transfers',
  },
  {
    url: 'https://panel.sexflix.com/transferredcontent/moderation/video?dateRange=&transferSource=xhamster',
    elementId: 'xhamster',
  },
  {
    url: 'https://panel.sexflix.com/transferredcontent/moderation/video?dateRange=&transferSource=xvideos',
    elementId: 'xvideos',
  },
  {
    url: 'https://panel.sexflix.com/transferredcontent/moderation/video?dateRange=&transferSource=pornhub',
    elementId: 'pornhub',
  },
  {
    url: 'https://panel.sexflix.com/transferredcontent/moderation/video?dateRange=&transferSource=onlyfans',
    elementId: 'onlyfans',
  },
  {
    url: 'https://panel.sexflix.com/transferredcontent/moderation/photo',
    elementId: 'transfersphoto',
  },
  {
    url: 'https://panel.sexflix.com/studio/moderation/index',
    elementId: 'studio',
  },
  {
    url: 'https://panel.sexflix.com/sfw/moderation/index',
    elementId: 'sfw',
  },
  {
    url: 'https://panel.sexflix.com/producer/moderation/index',
    elementId: 'producer',
  },
  {
    url: 'https://panel.sexflix.com/performer/moderation/index',
    elementId: 'performer',
  },
  {
    url: 'https://panel.sexflix.com/avatar/moderation/index?verifiedSelectValue=-1&searchString=&type=amateur&sort=score',
    elementId: 'avatars',
  },
];

async function fetchPageData(url, elementId) {
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

      if (response.html) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(response.html, 'text/html');
        let summaryElement = doc.querySelector('.summary');
        if (summaryElement) {
          let summaryText = summaryElement.innerText;
          let match = summaryText.match(/of\s+([\d,]+)\s+item[s]?/);
          if (match) {
            let totalItems = match[1];
            textElement.innerText = totalItems;
          } else {
            textElement.innerText = 0;
          }
        } else {
          textElement.innerText = 0;
        }
      }
    } catch (error) {
      console.log(`Error fetching ${url}: `, error);
      textElement.innerText = 0;
    } finally {
      loadingIcon.style.display = 'none';
    }
  }
}

async function fetchAllData() {
  const promises = urls.map((item) => fetchPageData(item.url, item.elementId));
  await Promise.all(promises);
}

fetchAllData();
