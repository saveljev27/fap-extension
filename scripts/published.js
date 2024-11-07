const fetchVideoStatus = async (id) => {
  const url = 'https://panel.sexflix.com/video/manage/update?id=' + id;
  try {
    const response = await chrome.runtime.sendMessage({
      action: 'fetchVideoStatus',
      url,
    });
    if (response.html) {
      let parser = new DOMParser();
      let doc = parser.parseFromString(response.html, 'text/html');
      const table = doc.getElementById('w1');
      const rows = table.querySelectorAll('tr');

      const moderationStatusRow = Array.from(rows).find((row) => {
        const th = row.querySelector('th');
        return th && th.innerText === 'Status';
      });
      const status = moderationStatusRow
        ? moderationStatusRow.querySelector('td').innerText
        : null;

      return { id, status };
    }
  } catch (error) {}
};

const videoIdToFetch = async () => {
  const tables = document.querySelectorAll('.multiple-video-edit-modal');
  if (!tables) {
    return;
  }
  const arr = Array.from(tables, (tab) => {
    return tab.getAttribute('data-video-id');
  });
  const getStatus = arr.map((id) => fetchVideoStatus(id));
  const response = await Promise.all(getStatus);

  const published = response
    .filter((pub) => pub && pub.status === 'published')
    .map((video) => {
      const findVid = Array.from(tables).find(
        (tab) => tab.getAttribute('data-video-id') === video.id
      );

      if (findVid) {
        const parentElement = findVid.parentElement;
        parentElement.style.background = '#ffcc80';

        const row = findVid.previousElementSibling;
        if (row && row.classList.contains('multi-moderation-row')) {
          row.classList.add('multi-moderation-alert-row');
        }
      }

      return findVid;
    });
  return published;
};

if (window.publishedMultiple) {
  videoIdToFetch();
}
