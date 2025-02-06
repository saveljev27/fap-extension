const videoBlocks = Array.from(
  document.querySelectorAll('.row.pt-3.multi-moderation-row')
);

const urlReg = (url) => {
  return url.match(
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g
  );
};
const timeToSeconds = (time) => {
  const [h, m, s] = time.split(':');
  return parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s);
};
const createAlert = (text, suggestedTags) => {
  const alert = document.createElement('div');
  const alertTitle = document.createElement('p');
  alert.classList.add('alert-danger', 'alert', 'multiple_comment');
  alertTitle.classList.add('producer-comment__description', 'main_bold');
  alertTitle.innerText = text;
  suggestedTags.parentNode.insertAdjacentElement('beforeend', alert);
  alert.appendChild(alertTitle);
};

const closestBlockId = (block) => {
  return block
    .closest('.row.pt-3.multi-moderation-row')
    .getAttribute('id')
    .replace(/\D/g, '');
};
// Check Video Length and Type
const checkTimeAndType = () => {
  return Array.from(
    document.querySelectorAll(
      'table.table-condensed.table-sm.table-striped.detail-view'
    )
  )
    .map((block) => {
      const lengthAndTypeHeaders = Array.from(block.querySelectorAll('tr'));

      const lengthRow = lengthAndTypeHeaders.find((tr) => {
        const th = tr.querySelector('th');
        return th && th.innerText.includes('Length');
      });

      const accountTypeRow = lengthAndTypeHeaders.find((tr) => {
        const th = tr.querySelector('th');
        return th && th.innerText.includes('Account Type');
      });

      const momentsTypeRow = lengthAndTypeHeaders.find((tr) => {
        const th = tr.querySelector('th');
        return th && th.innerText.includes('Moment');
      });

      if (lengthRow && accountTypeRow && !momentsTypeRow) {
        const lengthTd = lengthRow.querySelector('td');
        const accountTypeTd = accountTypeRow.querySelector('td');

        const formatTime = timeToSeconds(lengthTd.innerText);
        if (formatTime < 900 && accountTypeTd.innerText.trim() === 'business') {
          lengthRow.style.color = 'red';
          accountTypeRow.style.color = 'red';
          lengthTd.style.color = 'red';
          accountTypeTd.style.color = 'red';
          lengthTd.style.fontWeight = 'bold';
          accountTypeTd.style.fontWeight = 'bold';

          return {
            id: closestBlockId(block),
            type: 'video',
          };
        }
      } else if (momentsTypeRow) {
        const momentTd = momentsTypeRow.querySelector('td');
        momentTd.style.color = 'red';
        momentsTypeRow.style.color = 'red';
        momentsTypeRow.style.fontWeight = 'bold';
        momentTd.style.fontWeight = 'bold';

        return {
          id: closestBlockId(block),
          type: 'moment',
        };
      }

      return null;
    })
    .filter(Boolean);
};

// Show Comment and Alert In Video Modal
const multipleComment = (shortOrMoment) => {
  const alertAndNotify = videoBlocks
    .map((block) => {
      const getVideoId = block.getAttribute('id').replace(/\D/g, '');
      const findShortOrMoment = shortOrMoment?.find(
        (id) => id.id === getVideoId
      );
      const comment = block.querySelector('.producer-comment__description');
      const xhamster = block.querySelector('.modification-request-notify');
      let commentText = comment ? comment.innerText.trim() : null;
      let xhamsterText = xhamster ? xhamster.innerText.trim() : null;
      const isHaveUrl = commentText && commentText.includes('https://');
      if (isHaveUrl) {
        const getHref = urlReg(commentText);
        if (getHref) {
          getHref.forEach((href) => {
            if (!commentText.includes(`<a href="${href}"`)) {
              const anchorTag = `<a href="${href}" target="_blank">${href}</a>`;
              commentText = commentText.replace(href, anchorTag);
            }
          });
          comment.innerHTML = commentText;
        }
      }

      if (
        (comment && commentText) ||
        findShortOrMoment ||
        (xhamster && xhamsterText)
      ) {
        return {
          id: getVideoId,
          ...(commentText !== null && { commentText }),
          ...(xhamsterText !== null && { xhamsterText: true }),
          ...(findShortOrMoment !== undefined && {
            type: findShortOrMoment?.type,
          }),
        };
      }
    })
    .filter(Boolean);

  alertAndNotify.forEach((item) => {
    const modal = document.querySelector(`#video_info_modal_edit_${item?.id}`);
    if (!modal) return;
    const suggestedTags = modal.querySelector('.suggested-tags-wrap');
    if (!suggestedTags) return;

    if (item.commentText) {
      const comment = document.createElement('div');
      const commentTitle = document.createElement('p');
      const commentText = document.createElement('p');
      comment.classList.add('alert-warning', 'alert', 'multiple_comment');
      commentTitle.classList.add('producer-comment__title');
      commentText.classList.add('producer-comment__description');
      commentTitle.innerText = 'Producer comment';
      commentText.innerHTML = item.commentText;
      suggestedTags.parentNode.insertAdjacentElement('beforeend', comment);
      comment.appendChild(commentTitle);
      comment.appendChild(commentText);
    }

    if (item.xhamsterText) {
      const comment = document.createElement('div');
      const commentText = document.createElement('p');
      comment.classList.add('multiple-request-notify');
      commentText.innerHTML =
        'This video was imported from xHamster. You don`t need to check the documents of the performers. Just check content and meta-information';
      suggestedTags.parentNode.insertAdjacentElement('beforeend', comment);
      comment.appendChild(commentText);
    }

    if (item.type === 'video') {
      createAlert('Short video', suggestedTags);
    } else if (item.type === 'moment') {
      createAlert('Moment', suggestedTags);
    }
  });
};

if (
  window.moderationURL ||
  window.vrmoderationURL ||
  window.stopwordsModerationURL
) {
  const shortOrMoment = checkTimeAndType();
  multipleComment(shortOrMoment);
}
