const createButton = (text, className) => {
  const button = document.createElement('a');
  button.innerText = text;
  button.className = className;
  return button;
};
const updateSPInterfaceBtn = (button, data, text) => {
  if (data) {
    const id = data.DT_RowId;
    button.innerText = `${text} Tickets`;
    button.classList.remove('disabled');
    button.href = `https://support.faphouse.com/en/staff/user/manage/${id}/ticket`;
    button.target = '_blank';
  } else {
    button.innerText = 'Not found';
  }
};

const fetchEmail = async (dataId, type) => {
  const url = `https://panel.sexflix.com/email/${type}?id=` + dataId;
  const response = await chrome.runtime.sendMessage({
    action: 'fetchEmail',
    url: url,
  });
  if (response.error) {
    throw new Error(response.error);
  }
  try {
    const email = response.data.email;
    return email;
  } catch (error) {
    throw new Error('Bad request');
  }
};

const fetchDataInSp = async (email) => {
  const url =
    'https://support.faphouse.com/en/staff/user/datatables/user?sEcho=1&iColumns=8&sColumns=%2C%2C%2C%2C%2C%2C%2C&sSearch=' +
    email;
  const response = await chrome.runtime.sendMessage({
    action: 'fetchData',
    url: url,
  });
  if (!response) {
    throw new Error(response.error);
  }
  try {
    const data = response.data.aaData;
    return data;
  } catch (error) {
    throw new Error(error);
  }
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
    const spData = await fetchDataInSp(email);
    const findFp = spData.find((el) => Object.values(el).includes('FapHouse'));
    const findXh = spData.find((el) => Object.values(el).includes('xHamster'));
    if (findXh) {
      const xhBtn = createButton('Loading...', btnClass);
      updateSPInterfaceBtn(xhBtn, findXh, 'XH');
      parentElement.insertBefore(xhBtn, fpBtn.nextSibling);
    }
    updateSPInterfaceBtn(fpBtn, findFp, 'FP');
  } catch (error) {
    fpBtn.textContent = 'No access to SP. Please login and try again.';
  }
};

responseAndHandle();
