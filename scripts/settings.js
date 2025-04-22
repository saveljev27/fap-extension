const scripts = [
  {
    name: 'Single Moderation',
    description:
      'Изменяет ширину страницы https://panel.sexflix.com/video/moderation/ с широкой на оригинальную',
    script: 'singleModeration',
  },
  {
    name: 'Image Zoom',
    description: 'Включает zoom для изображений',
    script: 'imageZoom',
  },
];
const scales = [1, 1.5, 2, 3, 5];

const scriptSettings = () => {
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('settings_buttons');
    const scalesBlock = document.getElementById('settings_scales');
    const infoBlock = document.getElementById('settings_info');
    const saveButton = document.getElementById('save_settings');

    const highlightSelectedScale = (currentScale) => {
      const allButtons = scalesBlock.querySelectorAll('button');
      allButtons.forEach((btn) => {
        if (btn.dataset.scale === String(currentScale)) {
          btn.classList.add('selected');
        } else {
          btn.classList.remove('selected');
        }
      });
    };

    chrome.storage.local.get('scripts', (data) => {
      let scriptStatuses = data.scripts || {};

      scripts.forEach((scriptName) => {
        const { name, description, script } = scriptName;
        const block = document.createElement('div');
        const label = document.createElement('label');
        const button = document.createElement('button');

        block.classList.add('settings_field');
        label.classList.add('settings_label');
        label.textContent = name;
        button.textContent = scriptStatuses[script] ? `Enabled` : `Disabled`;
        button.classList.add('interactive_button');
        button.dataset.script = script;
        if (scriptStatuses[script]) {
          button.classList.add('selected');
        } else {
          button.classList.add('not_selected');
        }

        block.appendChild(label);
        block.appendChild(button);
        container.appendChild(block);

        button.addEventListener('click', () => {
          chrome.runtime.sendMessage(
            { action: 'toggleScript', script },
            (response) => {
              if (response && response.success) {
                chrome.storage.local.get('scripts', (updatedData) => {
                  let updatedScripts = updatedData.scripts || {};
                  button.textContent = updatedScripts[script]
                    ? `Enabled`
                    : `Disabled`;
                  if (updatedScripts[script]) {
                    button.classList.add('selected');
                    button.classList.remove('not_selected');
                  } else {
                    button.classList.remove('selected');
                    button.classList.add('not_selected');
                  }
                });
              }
            }
          );
        });

        button.addEventListener('mouseover', () => {
          infoBlock.textContent = description;
        });

        button.addEventListener('mouseout', () => {
          infoBlock.textContent = '';
        });
      });

      scales.forEach((scale) => {
        const scaleButton = document.createElement('button');
        scaleButton.classList.add('interactive_button');
        scaleButton.textContent = scale;
        scaleButton.dataset.scale = scale;
        scalesBlock.appendChild(scaleButton);

        scaleButton.addEventListener('click', () => {
          chrome.runtime.sendMessage(
            { action: 'toggleScale', scale },
            (response) => {
              if (response && response.success) {
                chrome.storage.local.get('scripts', (updatedData) => {
                  const selectedScale = updatedData.scripts?.scaleValue;
                  highlightSelectedScale(selectedScale);
                });
              }
            }
          );
        });
        scaleButton.addEventListener('mouseover', () => {
          infoBlock.textContent =
            'Изменение кратности zoom для Image Zoom 1x min - 5x max';
        });

        scaleButton.addEventListener('mouseout', () => {
          infoBlock.textContent = '';
        });
      });

      saveButton.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]?.id) {
            chrome.tabs.reload(tabs[0].id);
          }
        });
      });
      chrome.storage.local.get('scripts', (data) => {
        const currentScale = data.scripts?.scaleValue;
        highlightSelectedScale(currentScale);
      });
    });
  });
};

scriptSettings();
