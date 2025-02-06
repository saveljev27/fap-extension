const changeIdHref = () => {
  Array.from(
    document.querySelectorAll(
      'table.table-condensed.table-sm.table-striped.detail-view'
    )
  ).map((block) => {
    const idHeader = Array.from(block.querySelectorAll('tr'));

    const idVideoBlock = idHeader.find((tr) => {
      const th = tr.querySelector('th');
      return th && th.innerText.includes('Id Video');
    });

    if (idVideoBlock) {
      const id = idVideoBlock.querySelector('td').innerText;
      const link = document.createElement('a');
      link.innerText = id;
      link.href = 'https://panel.sexflix.com/video/manage/update?id=' + id;
      link.target = '_blank';
      idVideoBlock.querySelector('td').innerHTML = '';
      idVideoBlock.querySelector('td').appendChild(link);
    }
  });
};

if (window.vrmoderationURL) changeIdHref();
