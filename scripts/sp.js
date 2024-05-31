// Format email function
const emailFormating = (email) => {
  const emailRedex = /[\w.-]+@[\w.-]+\.\w+/;
  const match = email.match(emailRedex)[0];
  return match ? match : 'Email not found';
};
// Copy functionality to producer email
const copyTextToClipboard = (text) => {
  navigator.clipboard.writeText(text).catch((error) => {
    console.log(error);
  });
};
const copyProducerEmail = (producerEmail) => {
  const copiedMessage = document.createElement('span');
  copiedMessage.textContent = 'Copied';
  copiedMessage.classList.add('copied_message');
  tabBlockProducer.appendChild(producerEmail);
  producerEmail.addEventListener('click', () => {
    const emailElement = producerEmail.childNodes[0].nodeValue.trim();
    copyTextToClipboard(emailElement);
    producerEmail.appendChild(copiedMessage);
    copiedMessage.classList.add('show');

    setTimeout(() => {
      copiedMessage.classList.remove('show');
    }, 1500);
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

// Get Id from GET request promise
const getUserId = (email) => {
  const url =
    'https://panel.sexflix.com/producer/search/for-select2?q=' + email;
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { action: 'fetchData', url: url },
      (response) => {
        if (response.error) {
          reject(response.error);
        } else {
          try {
            const id = response.data.results[0].id;
            resolve(id);
          } catch (e) {
            reject('Data parsing error');
          }
        }
      }
    );
  });
};

// Using getUserId response to redirect on panel page
const fetchAndCreateLink = async (email) => {
  const goToProdPanel = document.createElement('a');
  try {
    const userId = await getUserId(email);
    goToProdPanel.textContent = 'Producer panel';
    goToProdPanel.href =
      'https://panel.sexflix.com/producer/manage/update?id=' + userId;
    goToProdPanel.target = '_blank';
  } catch (error) {
    goToProdPanel.textContent = 'Producer email not found in panel';
    goToProdPanel.className = 'block_cursor';
  } finally {
    tabBlockProducer.appendChild(goToProdPanel);
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
