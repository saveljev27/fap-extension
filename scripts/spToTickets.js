const createButton = (text, className) => {
  const button = document.createElement('a');
  button.innerText = text;
  button.className = className;
  return button;
};

const updateSPInterfaceBtn = (button, id) => {
  if (id) {
    button.innerText = `SP Tickets`;
    button.classList.remove('disabled');
    button.href = `https://support.faphouse.com/en/staff/user/manage/${id}/ticket`;
    button.target = '_blank';
  }
};

const fetchEmail = async (dataId, type) => {
  const url = `https://panel.sexflix.com/email/${type}?id=` + dataId;
  const response = await chrome.runtime.sendMessage({
    action: 'fetchEmail',
    url: url,
  });
  if (response.error) {
    return;
  }
  try {
    const email = response.data.email;
    return email;
  } catch (error) {}
};

const fetchDataInSp = async (email) => {
  const url =
    'https://support.faphouse.com/en/staff/user/datatables/user?draw=5&columns%5B0%5D%5Bdata%5D=0&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=false&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=1&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=true&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=2&columns%5B2%5D%5Bname%5D=&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=true&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=3&columns%5B3%5D%5Bname%5D=&columns%5B3%5D%5Bsearchable%5D=true&columns%5B3%5D%5Borderable%5D=true&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=4&columns%5B4%5D%5Bname%5D=&columns%5B4%5D%5Bsearchable%5D=true&columns%5B4%5D%5Borderable%5D=true&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B5%5D%5Bdata%5D=5&columns%5B5%5D%5Bname%5D=&columns%5B5%5D%5Bsearchable%5D=true&columns%5B5%5D%5Borderable%5D=false&columns%5B5%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B5%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B6%5D%5Bdata%5D=6&columns%5B6%5D%5Bname%5D=&columns%5B6%5D%5Bsearchable%5D=true&columns%5B6%5D%5Borderable%5D=true&columns%5B6%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B6%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B7%5D%5Bdata%5D=7&columns%5B7%5D%5Bname%5D=&columns%5B7%5D%5Bsearchable%5D=true&columns%5B7%5D%5Borderable%5D=false&columns%5B7%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B7%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B8%5D%5Bdata%5D=8&columns%5B8%5D%5Bname%5D=&columns%5B8%5D%5Bsearchable%5D=true&columns%5B8%5D%5Borderable%5D=false&columns%5B8%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B8%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=6&order%5B0%5D%5Bdir%5D=desc&order%5B0%5D%5Bname%5D=&start=0&length=10&search%5Bvalue%5D=' +
    email;
  const response = await chrome.runtime.sendMessage({
    action: 'fetchData',
    url: url,
  });
  if (!response) {
    return;
  }
  try {
    const data = response.data.data;
    return data;
  } catch (error) {}
};

const responseAndHandle = async () => {
  const showEmailIcon = document.querySelector('.show-email');
  if (!showEmailIcon) {
    return;
  }

  const dataId = showEmailIcon.getAttribute('data-id');
  if (!dataId) {
    return;
  }

  let type, mainBtn, btnClass, parentElement;
  const producerBtn = document.querySelector('.btn.btn-default.pull-right');
  const userBtn = document.querySelector('.btn.btn-info.reset-password-link');

  if (producerBtn) {
    type = 'producer';
    mainBtn = producerBtn;
    btnClass = 'btn btn-default pull-right disabled btn_margin_right';
  } else if (userBtn) {
    type = 'user';
    mainBtn = userBtn;
    btnClass = 'btn btn-default disabled btn_margin_left';
  }

  if (!type || !mainBtn) {
    return;
  }

  parentElement = mainBtn.parentNode;

  const fpBtn = createButton('Loading...', btnClass);
  parentElement.insertBefore(fpBtn, mainBtn.nextSibling);
  try {
    const email = await fetchEmail(dataId, type);
    const spData = (await fetchDataInSp(email))[0];
    if (!spData) {
      fpBtn.textContent = 'No Registered Tickets';
      return;
    }
    const spUserId = spData.DT_RowId;
    updateSPInterfaceBtn(fpBtn, spUserId);
  } catch (error) {
    fpBtn.textContent = 'No access to SP. Please login and try again.';
  }
};

if (window.editingProducerURL || window.editingUserURL) responseAndHandle();
