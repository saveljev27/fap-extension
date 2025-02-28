const urls = [
  {
    url: 'https://panel.sexflix.com/video/moderation/index',
    elementId: 'video',
  },
  {
    url: 'https://panel.sexflix.com/video/moderation/index?producerType=1',
    elementId: 'videoindividuals',
  },
  {
    url: 'https://panel.sexflix.com/video/moderation/index?producerType=2',
    elementId: 'videobusiness',
  },
  {
    url: 'https://panel.sexflix.com/video/stop-words-moderation/',
    elementId: 'stopwords',
  },
  {
    url: 'https://panel.sexflix.com/vr/moderation/video',
    elementId: 'vr',
  },
  {
    url: 'https://panel.sexflix.com/video/moderation/index?&transferSource=faphouse',
    elementId: 'faphouse',
  },
  {
    url: 'https://panel.sexflix.com/video/moderation/index?&transferSource=xhamster',
    elementId: 'xhamster',
  },
  {
    url: 'https://panel.sexflix.com/video/moderation/index?&transferSource=xvideos',
    elementId: 'xvideos',
  },
  {
    url: 'https://panel.sexflix.com/video/moderation/index?&transferSource=pornhub',
    elementId: 'pornhub',
  },
  {
    url: 'https://panel.sexflix.com/video/moderation/index?&transferSource=onlyfans',
    elementId: 'onlyfans',
  },
  {
    url: 'https://panel.sexflix.com/video/moderation/index?&transferSource=fansly',
    elementId: 'fansly',
  },
  {
    url: 'https://panel.sexflix.com/video/moderation/index?&transferSource=manyvids',
    elementId: 'manyvids',
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
      if (loadingIcon) loadingIcon.style.display = 'none';
    }
  }
};

const fetchAllData = async () => {
  try {
    const promises = urls.map((item) =>
      fetchPageData(item.url, item.elementId)
    );

    await Promise.all(promises);
  } catch (error) {}
};

fetchAllData();
