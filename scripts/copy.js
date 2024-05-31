document.addEventListener('DOMContentLoaded', () => {
  function copyTextToClipboard(text) {
    navigator.clipboard.writeText(text).catch(function (error) {
      console.log('Copy error:', error);
    });
  }

  const paragraphs = document.querySelectorAll('.reason_text');
  paragraphs.forEach((paragraph) => {
    const copiedMessage = document.createElement('span');
    copiedMessage.textContent = 'Copied';
    copiedMessage.classList.add('copied_message');
    paragraph.insertAdjacentElement('afterend', copiedMessage);
    paragraph.addEventListener('click', () => {
      copyTextToClipboard(paragraph.textContent);
      document
        .querySelectorAll('.copied_message')
        .forEach((msg) => msg.classList.remove('show'));
      copiedMessage.classList.add('show');

      setTimeout(() => {
        copiedMessage.classList.remove('show');
      }, 1500);
    });
  });
});
