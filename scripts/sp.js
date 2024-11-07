const emailElement = document.querySelector('.sp-reply-all-recipients');
const getSubmititedTitle = document.querySelector('.sp-title-description');

const tabBlockProducer = document.createElement('div');
tabBlockProducer.id = 'tabProducer';
tabBlockProducer.className = 'tab_producer';

const getTicketsId = () => {
  const getHref = getSubmititedTitle.querySelector('a');
  const url = getHref.getAttribute('href');
  const onlyDigits = url.match(/\d+/g);
  return onlyDigits[0];
};

// Find ul element and create one more li and a element
const findBlockElement = document.querySelector('.sp-content-inner');
if (findBlockElement) {
  const menu = document.getElementById('Followup');
  findBlockElement.appendChild(tabBlockProducer);
  if (menu) {
    const producer = document.createElement('li');
    producer.id = 'Producer';
    const copyArc = document.createElement('a');
    copyArc.textContent = 'Email and Panel';

    const tickets = document.createElement('li');
    tickets.id = 'Tickets';
    const ticketsLink = document.createElement('a');
    ticketsLink.textContent = 'All User Tickets';
    ticketsLink.href = `https://support.faphouse.com/en/staff/user/manage/${getTicketsId()}/ticket`;
    ticketsLink.target = '_blank';

    producer.insertAdjacentElement('beforeend', copyArc);
    tickets.insertAdjacentElement('beforeend', ticketsLink);
    menu.insertAdjacentElement('afterend', tickets);
    menu.insertAdjacentElement('afterend', producer);
  }
}

// Format email function
const emailFormating = (email) => {
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
  const match = email.match(emailRegex);
  return match ? match[0] : 'Email not found';
};

// For Producer and User account status
const createStatusLink = (doc, inputName, label, url) => {
  const statusInput = doc.querySelector(`input[name="${inputName}"]`);
  const statusElement = document.createElement('a');
  const statusSpan = document.createElement('span');
  statusElement.classList.add('sp-button', 'sp-button-sm');
  const statusValue = statusInput.value.toLowerCase();
  const labelText = document.createTextNode(`${label} status: `);
  statusSpan.textContent = statusValue ? statusValue : 'N/A';
  if (statusValue === 'banned') {
    statusSpan.style.color = 'red';
  } else {
    statusSpan.style.color = 'green';
  }
  statusElement.href = url;
  statusElement.target = '_blank';
  statusElement.appendChild(labelText);
  statusElement.appendChild(statusSpan);
  tabBlockProducer.appendChild(statusElement);
};

// Functionality For Producer and User account panel
const createPanelLink = (label, url) => {
  const panelElement = document.createElement('a');
  panelElement.textContent = label + ' panel';
  panelElement.href = url;
  panelElement.target = '_blank';
  panelElement.classList.add('sp-button', 'sp-button-sm');
  tabBlockProducer.appendChild(panelElement);
};

// Copy email to clipboard functionality
const copyEmailToClipboard = async (text) => {
  try {
    navigator.clipboard.writeText(text);
  } catch (error) {}
};

// Copy producer email from tabBlockProducer
const copyProducerEmail = (producerEmail) => {
  const copiedMessage = document.createElement('span');
  copiedMessage.textContent = 'Copied';
  copiedMessage.classList.add('copied_message');

  producerEmail.addEventListener('click', () => {
    const emailElement = producerEmail.childNodes[0].nodeValue.trim();
    copyEmailToClipboard(emailElement);
    producerEmail.appendChild(copiedMessage);
    copiedMessage.classList.add('show');

    setTimeout(() => {
      copiedMessage.classList.remove('show');
      producerEmail.removeChild(copiedMessage);
    }, 500);
  });
};

const getUserId = async (email) => {
  const url =
    'https://panel.sexflix.com/producer/search/for-select2?q=' + email;
  const response = await chrome.runtime.sendMessage({
    action: 'fetchData',
    url: url,
  });
  if (response.error) {
    return;
  }
  try {
    const id = response.data.results[0].id;
    return id;
  } catch (error) {}
};

const getUserEmail = () => {
  if (!emailElement) return;
  const email = emailFormating(emailElement.textContent);
  return email;
};

const fetchAndShowProducerStatus = async (id, userUrl) => {
  const url = 'https://panel.sexflix.com/producer/manage/update?id=' + id;
  try {
    const response = await chrome.runtime.sendMessage({
      action: 'fetchProducerStatus',
      url: url,
    });
    if (response?.html) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(response.html, 'text/html');
      if (doc) {
        createPanelLink('Producer', url);
        createStatusLink(doc, 'User status', 'User', userUrl);
        createStatusLink(doc, 'status', 'Producer', url);
      }
    }
  } catch (error) {}
};

const showProducerEmail = (email) => {
  const producerEmail = document.createElement('a');
  producerEmail.classList.add(
    'tab_producer_email',
    'sp-button',
    'sp-button-sm'
  );
  producerEmail.textContent = email;
  copyProducerEmail(producerEmail);
  tabBlockProducer.appendChild(producerEmail);
};

const producerEmailAndPanelFunctionality = async () => {
  const userUrl =
    'https://panel.sexflix.com/user/manage/index?uid=&xUserId=&email=' +
    getUserEmail();
  const loading = document.createElement('a');
  loading.textContent = 'Loading...';
  loading.className = 'loading_link';

  showProducerEmail(getUserEmail());
  createPanelLink('User', userUrl);
  tabBlockProducer.appendChild(loading);

  try {
    const id = await getUserId(getUserEmail());
    if (id) {
      await Promise.all([fetchAndShowProducerStatus(id, userUrl)]);
      loading.remove();
    } else {
      loading.textContent = 'Producer email and status not found in panel.';
    }
  } catch (error) {}
};

if (window.supportPalPage && emailElement) {
  producerEmailAndPanelFunctionality();
}
