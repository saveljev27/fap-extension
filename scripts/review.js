const reviewUrl = document.URL;
const reviewPage = reviewUrl.includes(
  'https://panel.sexflix.com/video/moderation/reviewer-stats'
);

if (reviewPage) {
  const rows = document.querySelectorAll(
    '.table-striped.table.table-sm tbody tr'
  );
  rows.forEach((row) => {
    const link = document.createElement('a');
    const videoTextId = row.lastElementChild.innerText;
    const videoId = row.lastElementChild;

    link.innerText = videoTextId;
    link.href =
      'https://panel.sexflix.com/video/manage/update?id=' + videoTextId;
    link.target = '_blank';

    videoId.innerHTML = '';
    videoId.appendChild(link);
  });
}
