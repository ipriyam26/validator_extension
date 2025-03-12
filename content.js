function injectModal() {
  // Add custom scrollbar and modal styles
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    #validator-modal {
      display: none;
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(25, 32, 44, 0.8);
      z-index: 10000;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: #4a5568 #2d3748;
    }

    #modal-container {
      position: relative;
      background-color: #19202C;
      margin: 5% auto;
      padding: 20px;
      width: 80%;
      max-width: 1000px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
      color: white;
    }

    #modal-content {
      max-height: 80vh;
      overflow-y: auto;
      padding-right: 10px;
    }

    #modal-content::-webkit-scrollbar {
      width: 8px;
    }
    
    #modal-content::-webkit-scrollbar-track {
      background: #2d3748;
      border-radius: 4px;
    }
    
    #modal-content::-webkit-scrollbar-thumb {
      background: #4a5568;
      border-radius: 4px;
    }
    
    #modal-content::-webkit-scrollbar-thumb:hover {
      background: #718096;
    }

    #close-modal {
      position: sticky;
      top: 15px;
      float: right;
      border: none;
      background: none;
      font-size: 24px;
      cursor: pointer;
      color: #a0aec0;
      z-index: 1000;
      margin-left: 10px;
    }

    #close-modal:hover {
      color: #e2e8f0;
    }

    .loading-indicator {
      text-align: center;
      padding: 20px;
      color: #e2e8f0;
    }
  `;
  document.head.appendChild(styleSheet);

  const modalHTML = `
    <div id="validator-modal">
      <div id="modal-container">
        <button id="close-modal">×</button>
        <div id="modal-content">
          <div class="loading-indicator">Validating notebook...</div>
        </div>
      </div>
    </div>
  `;

  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = modalHTML;
  document.body.appendChild(modalContainer);

  // Add modal close handlers
  document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('validator-modal').style.display = 'none';
  });

  document.getElementById('validator-modal').addEventListener('click', (e) => {
    if (e.target.id === 'validator-modal') {
      e.target.style.display = 'none';
    }
  });
}

// Create and inject the validate button
function injectValidateButton() {
  // Create button container
  // Check for original buttons
  const originalSubmitButton = document.querySelector('.chakra-button.css-wy6zoh');
  const originalSaveButton = document.querySelector('.chakra-button.css-ic7jay');

  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
    `;


  const sumbitButton = document.createElement('button');
  sumbitButton.textContent = 'Submit';
  sumbitButton.style.cssText = `
        padding: 10px 20px;
        background-color: #9AE6B4;
        color: black;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1rem;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        font-weight: 600;
    `;

  const saveButton = document.createElement('button');
  saveButton.textContent = 'Save';
  saveButton.style.cssText = sumbitButton.style.cssText;
  // Create button
  const validateButton = document.createElement('button');
  validateButton.textContent = 'Validate';
  validateButton.style.cssText = `
        padding: 10px 20px;
        background-color: #9DECF9;
        color: black;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1rem;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        font-weight: 600;

    `;

  sumbitButton.addEventListener('mouseenter', () => {
    sumbitButton.style.backgroundColor = '#218838';
  });

  sumbitButton.addEventListener('mouseleave', () => {
    sumbitButton.style.backgroundColor = '#9AE6B4';
  });

  sumbitButton.addEventListener('click', () => {
    if (originalSubmitButton) {
      originalSubmitButton.click();
    }
  })

  saveButton.addEventListener('mouseenter', () => {
    saveButton.style.backgroundColor = '#218838';
  });

  saveButton.addEventListener('mouseleave', () => {
    saveButton.style.backgroundColor = '#9AE6B4';
  });
  saveButton.addEventListener('click', () => {
    if (originalSaveButton) {
      originalSaveButton.click();
    }
  })
  validateButton.addEventListener('mouseenter', () => {
    validateButton.style.backgroundColor = '#0056b3';
  });

  validateButton.addEventListener('mouseleave', () => {
    validateButton.style.backgroundColor = '#9DECF9';
  });

  // Add click handler
  validateButton.addEventListener('click', function () {
    console.log('Custom validate button clicked');
    const linkElement = document.querySelector('.chakra-link.css-1xt8mtd');
    if (!linkElement) {
      console.log('Link element not found');
      alert('No notebook link found on this page');
      return;
    }

    const fileId = linkElement.getAttribute('href');
    if (!fileId) {
      console.log('No file ID found');
      alert('No file ID found');
      return;
    }

    console.log('Found file ID:', fileId);
    const modal = document.getElementById('validator-modal');
    const modalContent = document.getElementById('modal-content');
    if (modal && modalContent) {
      modalContent.innerHTML = '<div class="loading-indicator">Validating notebook...</div>';
      modal.style.display = 'block';

      chrome.runtime.sendMessage({
        action: 'validateNotebook',
        fileId: fileId
      });
    }
  });

  // Add button to container and container to page
  if (window.location.href.includes('editor')) {
    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(sumbitButton);
  }

  buttonContainer.appendChild(validateButton);
  document.body.appendChild(buttonContainer);
  console.log('Validate button injected');
}
function shouldShowButton() {
  const url = window.location.href;
  const workspaceRegex = /^https:\/\/labeling-mi\.turing\.com\/conversations\/workspace/;
  return !workspaceRegex.test(url);
}

function initializeExtension() {
  console.log('Initializing extension...');
  if (shouldShowButton()) {
    injectModal();
    setTimeout(injectValidateButton, 1000);
  } else {
    console.log('Not a conversation page, skipping button injection');
  }
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'displayResults') {
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = request.html;

    // Style the content to match the dark theme
    const style = document.createElement('style');
    style.textContent = `
      #modal-content {
        color: #e2e8f0;
      }
      #modal-content .card {
        background-color: #2d3748;
        border: 1px solid #4a5568;
      }
      #modal-content .card-header {
        background-color: #2d3748;
        border-bottom: 1px solid #4a5568;
      }
      #modal-content pre {
        background-color: #1a202c;
        color: #e2e8f0;
        padding: 15px;
        border-radius: 4px;
      }
    `;
    modalContent.appendChild(style);
  }
});


// Update the initialization call
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeExtension);
} else {
  initializeExtension();
}