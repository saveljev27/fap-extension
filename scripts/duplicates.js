document.addEventListener('DOMContentLoaded', function () {
  // Найти все элементы с классом row pt-3 multi-moderation-row
  const rows = document.querySelectorAll('.row.pt-3.multi-moderation-row');

  // Найти элемент с классом col-md-12
  const colMd12 = document.querySelector('.col-md-12');

  // Убедиться, что элемент col-md-12 найден
  if (colMd12) {
    // Очистить содержимое элемента col-md-12
    colMd12.innerHTML = '';

    // Преобразовать NodeList в массив и отфильтровать только те, которые содержат .duplicates-alert
    const rowsWithDuplicates = Array.from(rows).filter((row) =>
      row.querySelector('.duplicates-alert')
    );

    rowsWithDuplicates.forEach((row) => {
      // Найти соответствующий элемент с классом multiple-video-edit-modal
      const modal = row.nextElementSibling;

      // Клонировать row и modal
      const clonedRow = row.cloneNode(true);
      const clonedModal = modal ? modal.cloneNode(true) : null;

      // Создать контейнер для row и modal
      const container = document.createElement('div');
      container.style.background = '#f9f9f9';

      // Добавить клонированные элементы в контейнер
      container.appendChild(clonedRow);
      if (clonedModal) {
        container.appendChild(clonedModal);
      }

      // Добавить контейнер в col-md-12
      colMd12.appendChild(container);
    });
  } else {
    console.log('Element with class col-md-12 not found.');
  }
});
