const urls = [
  {
    url: 'https://panel.sexflix.com/video/moderation/index',
    elementId: 'video',
  },
  {
    url: 'https://panel.sexflix.com/video/moderation/index?requestType=1',
    elementId: 'videonew',
  },
  {
    url: 'https://panel.sexflix.com/video/moderation/index?requestType=2',
    elementId: 'videoupdate',
  },
  {
    url: 'https://panel.sexflix.com/video/moderation/index?producerType=1',
    elementId: 'videoindividuals',
  },
  {
    url: 'https://panel.sexflix.com/video/moderation/index?requestType=1&producerType=1',
    elementId: 'videoindividualsnew',
  },
  {
    url: 'https://panel.sexflix.com/video/moderation/index?requestType=2&producerType=1',
    elementId: 'videoindividualsupdate',
  },
  {
    url: 'https://panel.sexflix.com/video/moderation/index?producerType=2',
    elementId: 'videobusiness',
  },
  {
    url: 'https://panel.sexflix.com/video/moderation/index?requestType=1&producerType=2',
    elementId: 'videobusinessnew',
  },
  {
    url: 'https://panel.sexflix.com/video/moderation/index?requestType=2&producerType=2',
    elementId: 'videobusinessupdate',
  },
  {
    url: 'https://panel.sexflix.com/video/moderation/index?&transferSource=faphouse',
    elementId: 'faphouse',
  },
  {
    url: 'https://panel.sexflix.com/video/moderation/index?&transferSource=faphouse&requestType=1',
    elementId: 'faphousenew',
  },
  {
    url: 'https://panel.sexflix.com/video/moderation/index?&transferSource=faphouse&requestType=2',
    elementId: 'faphouseupdate',
  },
  {
    url: 'https://panel.sexflix.com/video/moderation/index?&transferSource=xhamster',
    elementId: 'xhamster',
  },
  {
    url: 'https://panel.sexflix.com/video/moderation/index?transferSource=xhamster&requestType=1',
    elementId: 'xhamsternew',
  },
  {
    url: 'https://panel.sexflix.com/video/moderation/index?&transferSource=xhamster&requestType=2',
    elementId: 'xhamsterupdate',
  },
  {
    url: 'https://panel.sexflix.com/video/moderation/index?&transferSource=xvideos',
    elementId: 'xvideos',
  },
  {
    url: 'https://panel.sexflix.com/video/moderation/index?&transferSource=xvideos&requestType=1',
    elementId: 'xvideosnew',
  },
  {
    url: 'https://panel.sexflix.com/video/moderation/index?&transferSource=xvideos&requestType=2',
    elementId: 'xvideosupdate',
  },
  {
    url: 'https://panel.sexflix.com/video/moderation/index?&transferSource=pornhub',
    elementId: 'pornhub',
  },
  {
    url: 'https://panel.sexflix.com/video/moderation/index?&transferSource=pornhub&requestType=1',
    elementId: 'pornhubnew',
  },
  {
    url: 'https://panel.sexflix.com/video/moderation/index?&transferSource=pornhub&requestType=2',
    elementId: 'pornhubupdate',
  },
  {
    url: 'https://panel.sexflix.com/video/moderation/index?&transferSource=onlyfans',
    elementId: 'onlyfans',
  },
  {
    url: 'https://panel.sexflix.com/video/moderation/index?&transferSource=onlyfans&requestType=1',
    elementId: 'onlyfansnew',
  },
  {
    url: 'https://panel.sexflix.com/video/moderation/index?&transferSource=onlyfans&requestType=2',
    elementId: 'onlyfansupdate',
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
