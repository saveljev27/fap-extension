import {
  reasonsSwf,
  reasonsPhoto,
  reasonsCoPerformer,
} from '../data/reasons.js';

const reasonsList = document.getElementById('reasons');
const sidePanelHeader = document.querySelector('.sidepanel_header');
const sidePanelTitle = document.querySelector('.sidepanel_title').innerText;

const showReasons = (reasons) => {
  const globalToggleButton = document.createElement('button');
  globalToggleButton.innerText = 'Toggle All';
  globalToggleButton.className = 'sidepanel_toggle_btn';
  globalToggleButton.addEventListener('click', () => {
    const allReasonTexts = document.querySelectorAll('.reason_text');
    const areAllVisible = Array.from(allReasonTexts).every(
      (reasonText) => reasonText.style.display !== 'block'
    );
    allReasonTexts.forEach((reasonText) => {
      reasonText.style.display = areAllVisible ? 'block' : 'none';
    });
  });
  sidePanelHeader.appendChild(globalToggleButton);

  reasonsList.innerHTML = '';
  reasons.forEach((category) => {
    const reasonContainer = document.createElement('div');
    reasonContainer.className = 'reason_container';
    reasonContainer.id = category.id;

    if (category.title) {
      const declineTitle = document.createElement('p');
      declineTitle.className = 'reason_title';
      declineTitle.id = category.id;
      declineTitle.innerText = category.title;
      reasonContainer.appendChild(declineTitle);

      declineTitle.addEventListener('click', () => {
        const reasonTexts = reasonContainer.querySelectorAll('.reason_text');
        reasonTexts.forEach((reasonText) => {
          reasonText.style.display =
            reasonText.style.display === 'block' ? 'none' : 'block';
        });
      });
    }

    category.reasons.forEach((reason) => {
      const declineReason = document.createElement('p');
      declineReason.className = 'reason_text';
      declineReason.id = reason.id;
      declineReason.innerText = reason.reason;
      reasonContainer.appendChild(declineReason);
    });

    reasonsList.appendChild(reasonContainer);
  });
};

const selectReasons = () => {
  let reasons;
  switch (sidePanelTitle) {
    case 'SWF Reasons':
      reasons = reasonsSwf;
      break;
    case 'Photo Reasons':
      reasons = reasonsPhoto;
      break;
    case 'Co-performer Reasons':
      reasons = reasonsCoPerformer;
      break;
    default:
      console.error('Unknown title:', sidePanelTitle);
      return;
  }
  showReasons(reasons);
};

selectReasons();
