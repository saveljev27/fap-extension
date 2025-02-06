const getHref = (block) => {
  if (!block) return;
  const linkElement = block.querySelector('a');
  return linkElement ? linkElement.getAttribute('href') : null;
};

const fetchData = async (url, action) => {
  try {
    const response = await chrome.runtime.sendMessage({ action, url });
    if (response?.html) {
      const parser = new DOMParser();
      return parser.parseFromString(response.html, 'text/html');
    }
  } catch (error) {}
};

const videoIdBlocks = Array.from(document.querySelectorAll('.col-md-1'))
  .filter((block) => {
    return getHref(block) !== null;
  })
  .slice(0, 5);

const qualityBlocks = Array.from(document.querySelectorAll('.col-md-2'))
  .filter((block) => {
    return block.textContent.includes('quality');
  })
  .slice(0, 5);

// To show producer only once
const uniqueProducerHrefs = new Set();
const producerBlocks = Array.from(document.querySelectorAll('.col-md-2'))
  .filter((block) => {
    const href = getHref(block);
    if (
      href &&
      block.textContent.includes('producer') &&
      !uniqueProducerHrefs.has(href)
    ) {
      uniqueProducerHrefs.add(href);
      return true;
    }
    return false;
  })
  .slice(0, 5);

const fetchMonetizationStatuses = async () => {
  const promises = videoIdBlocks.map(async (block) => {
    const href = getHref(block);
    if (href) {
      const url = 'https://panel.sexflix.com' + href;
      const doc = await fetchData(url, 'fetchMonetizationStatus');
      if (doc) {
        const monetizationValue =
          doc.getElementById('videoupdateform-accesstype').value || null;
        const checker = doc.querySelector('.field-videoupdateform-vodallowed');
        const checkbox = checker.querySelector(
          'input[type="checkbox"]'
        ).checked;
        const vod = checkbox ? ' + VOD' : '';

        return monetizationValue
          ? monetizationValue + vod || monetizationValue
          : 'N/A';
      }
    }
    return;
  });
  return Promise.all(promises);
};

const showMonetizationStatuses = async () => {
  const monetizationStatuses = await fetchMonetizationStatuses();
  qualityBlocks.forEach((element, index) => {
    if (index < monetizationStatuses.length) {
      const status = document.createElement('b');
      status.style.color = 'red';
      status.textContent =
        `monetization: ${monetizationStatuses[index]}` || 'N/A';
      element.appendChild(status);
    }
  });
};

const fetchInternalComments = async () => {
  const promises = producerBlocks.map(async (block) => {
    const href = getHref(block);
    if (href) {
      // const url = 'https://panel.stage.k8s.flixdev.com' + href;
      const url = 'https://panel.sexflix.com' + href;
      const doc = await fetchData(url, 'fetchProducerComments');
      if (doc) {
        const getInternalComment = doc.getElementById(
          'producer-update-internal_comment'
        );
        const selectedComment = getInternalComment?.textContent.trim();
        return selectedComment && selectedComment.length > 0
          ? selectedComment
          : null;
      }
    }

    return;
  });

  return Promise.all(promises);
};

const showInternalComments = async () => {
  const internalComment = await fetchInternalComments();

  producerBlocks.forEach((element, index) => {
    if (internalComment[index] !== null) {
      const producer = element.querySelector('a');
      producer.style.color = 'red';

      const comment = document.createElement('b');
      comment.classList.add('comment_popup');

      comment.textContent = `${internalComment[index]}` || 'N/A';

      producer.addEventListener('mouseover', () => {
        comment.style.display = 'block';
      });
      producer.addEventListener('mouseout', () => {
        comment.style.display = 'none';
      });
      element.appendChild(comment);
    }
  });
};

if (videoIdBlocks.length && qualityBlocks.length) showMonetizationStatuses();

if (producerBlocks.length) showInternalComments();
