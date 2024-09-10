// Format email function
const emailFormating = (email) => {
  const emailRedex = /[\w.-]+@[\w.-]+\.\w+/;
  const match = email.match(emailRedex);
  return match ? match[0] : 'Email not found';
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

// Create tabBlockProducer
const tabBlockProducer = document.createElement('div');
tabBlockProducer.id = 'tabProducer';
tabBlockProducer.className = 'tab_producer';

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

    producer.insertAdjacentElement('beforeend', copyArc);
    menu.insertAdjacentElement('afterend', producer);
  }
}

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

// Using getUserId response to redirect on panel page
const fetchAndCreateLink = async (email) => {
  const goToProdPanel = document.createElement('a');
  goToProdPanel.className = 'loading_link';
  goToProdPanel.textContent = 'Loading...';
  tabBlockProducer.appendChild(goToProdPanel);
  try {
    const userId = await getUserId(email);
    goToProdPanel.textContent = 'Producer panel';
    goToProdPanel.classList.remove('loading_link');
    goToProdPanel.href =
      'https://panel.sexflix.com/producer/manage/update?id=' + userId;
    goToProdPanel.target = '_blank';
  } catch (error) {
    goToProdPanel.textContent = 'Producer email not found in panel';
  }
};

// Email search, formating. User Panel creating
const emailElement = document.querySelector('.sp-reply-all-recipients');
if (emailElement) {
  const findEmail = emailElement ? emailElement.textContent : '';
  const formatEmail = emailFormating(findEmail);
  const producerEmail = document.createElement('span');
  producerEmail.className = 'tab_producer_email';
  producerEmail.textContent = formatEmail;

  tabBlockProducer.appendChild(producerEmail);
  fetchAndCreateLink(formatEmail);
  copyProducerEmail(producerEmail);

  const goToUserPanel = document.createElement('a');
  goToUserPanel.textContent = 'User panel';
  goToUserPanel.href =
    'https://panel.sexflix.com/user/manage/index?uid=&xUserId=&email=' +
    formatEmail;
  goToUserPanel.target = '_blank';
  tabBlockProducer.appendChild(goToUserPanel);
}
