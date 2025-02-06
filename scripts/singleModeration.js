const changeWidth = () => {
  const col = document.querySelectorAll('.col-md-8');
  Array.from(col).forEach((block) => {
    block.style.width = '100%';
  });
};

if (window.singleModeration) changeWidth();
