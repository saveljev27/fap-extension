const videoBlocks = Array.from(
  document.querySelectorAll('.row.pt-3.multi-moderation-row')
);

const urlReg = (url) => {
  return url.match(
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g
  );
};

// Check Video Length and Type

const timeToSeconds = (time) => {
  const [h, m, s] = time.split(':');
  return parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s);
};

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

      if (lengthRow && accountTypeRow) {
        const lengthTd = lengthRow.querySelector('td');
        const accountTypeTd = accountTypeRow.querySelector('td');

        const formatTime = timeToSeconds(lengthTd.innerText);
        if (formatTime < 900 && accountTypeTd.innerText.trim() === 'business') {
          lengthTd.style.color = 'red';
          lengthTd.style.fontWeight = 'bold';
          accountTypeTd.style.color = 'red';
          accountTypeTd.style.fontWeight = 'bold';

          return block
            .closest('.row.pt-3.multi-moderation-row')
            .getAttribute('id')
            .replace(/\D/g, '');
        }
      }

      return null;
    })
    .filter(Boolean);
};

// Show Comment and Alert In Video Modal

const multipleComment = (shortIds) => {
  const commentAlert = videoBlocks
    .map((block) => {
      const getVideoId = block.getAttribute('id').replace(/\D/g, '');
      const isShort = shortIds.includes(getVideoId);
      const alert = block.querySelector('.producer-comment__description');
      let alertText = alert ? alert.innerText.trim() : null;
      const isHaveUrl = alertText && alertText.includes('https://');
      if (isHaveUrl) {
        const getHref = urlReg(alertText);
        if (getHref) {
          getHref.forEach((href) => {
            if (!alertText.includes(`<a href="${href}"`)) {
              const anchorTag = `<a href="${href}" target="_blank">${href}</a>`;
              alertText = alertText.replace(href, anchorTag);
            }
          });
          alert.innerHTML = alertText;
        }
      }

      if ((alert && alertText) || isShort) {
        return {
          commentText: alertText,
          id: getVideoId,
          short: isShort,
        };
      }
    })
    .filter(Boolean);

  commentAlert.forEach((item) => {
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

    if (item.short) {
      const shortVideo = document.createElement('div');
      const shortVideoTitle = document.createElement('p');
      shortVideo.classList.add('alert-danger', 'alert', 'multiple_comment');
      shortVideoTitle.classList.add(
        'producer-comment__description',
        'main_bold'
      );
      shortVideoTitle.innerText = 'Short Video';
      suggestedTags.parentNode.insertAdjacentElement('beforeend', shortVideo);
      shortVideo.appendChild(shortVideoTitle);
    }
  });
};

if (window.moderationURL || window.vrmoderationURL) {
  const shortIds = checkTimeAndType();
  multipleComment(shortIds);
}
