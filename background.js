

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'validateNotebook') {
    validateNotebook(request.fileId, sender.tab.id);
  }
});

function validateNotebook(fileId, tabId) {
  const formData = new FormData();
  formData.append('file_id', fileId);

  fetch('https://mistral-validator.turing.com/fetch-notebook', {
    method: 'POST',
    body: formData
  })
    .then(response => response.text())
    .then(html => {
      // Send results to content script instead of opening popup
      chrome.tabs.sendMessage(tabId, {
        action: 'displayResults',
        html: html
      });
    })
    .catch(error => {
      console.error('Validation error:', error);
      chrome.tabs.sendMessage(tabId, {
        action: 'displayResults',
        html: `<div class="alert alert-danger">Error: ${error.message}</div>`
      });
    });
}