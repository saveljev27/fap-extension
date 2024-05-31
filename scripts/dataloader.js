import { reasonsSwfPhoto, reasonsCoPerformer } from '../data/reasons.js';

const reasonsList = document.getElementById('reasons');
const sidePanelTitle = document.getElementById('title').innerText;

const showReasons = (reasons) => {
  reasonsList.innerHTML = '';
  reasons.forEach((category) => {
    const declineTitle = category.title
      ? `<h2 class="reason_title">${category.title}</h2>`
      : '';
    reasonsList.innerHTML += declineTitle ? declineTitle : '';
    const declineMainSubitle = category.mainSubtitle
      ? `<p class='reason_subtitle'>${category?.mainSubtitle}</p>`
      : '';
    reasonsList.innerHTML += declineMainSubitle;
    category.reasons.forEach((reason) => {
      const declineSubtitle = reason.subtitle
        ? `<p class='reason_subtitle' id=${reason.id}>${reason?.subtitle}</p>`
        : '';
      const declineReason = `<p class="reason_text" id="${reason.id}">${reason.reason}</p>`;
      reasonsList.innerHTML += declineSubtitle;
      reasonsList.innerHTML += declineReason;
    });
  });
};

const selectReasons = () => {
  let reasons;
  switch (sidePanelTitle) {
    case 'Decline Reasons':
      reasons = reasonsSwfPhoto;
      break;
    case 'Co-performers':
      reasons = reasonsCoPerformer;
      break;
    default:
      console.error('Unknown title:', sidePanelTitle);
      return;
  }
  showReasons(reasons);
};

selectReasons();
