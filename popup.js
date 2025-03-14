
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'displayResults') {
    const resultDiv = document.getElementById('result');
    const loadingDiv = document.querySelector('.loading');
    const statusDiv = document.getElementById('status');

    // Hide loading indicator
    loadingDiv.style.display = 'none';

    // Display the HTML response
    resultDiv.innerHTML = request.html;

    // Check if validation passed
    const statusElement = resultDiv.querySelector('h5.alert-heading');
    if (statusElement && statusElement.textContent.toLowerCase().includes('passed')) {
      statusDiv.textContent = 'Validation PASSED! ✅';
    } else {
      statusDiv.textContent = 'Validation FAILED! ❌';
    }
  }
});