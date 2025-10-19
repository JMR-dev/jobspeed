/// <reference types="firefox-webext-browser" />
import type {
  ResumeData,
  FieldMapping,
  Message,
  MessageResponse,
} from './types';
import { FormDetector } from './services/formDetector';
import { FieldMatcher } from './services/fieldMatcher';

console.log('JobSpeed content script loaded');

let previewPanel: HTMLElement | null = null;

// Listen for messages from popup or background
browser.runtime.onMessage.addListener(
  (
    message: Message,
    _sender: browser.runtime.MessageSender,
    sendResponse: (response: MessageResponse) => void
  ) => {
    if (message.type === 'SCAN_PAGE') {
      scanPageAndShowPreview()
        .then(() => {
          sendResponse({ success: true });
        })
        .catch((error: Error) => {
          console.error('Error scanning page:', error);
          sendResponse({ success: false, error: error.message });
        });
      return true; // Keep message channel open
    }

    return false;
  }
);

async function scanPageAndShowPreview() {
  try {
    // Get resume data
    const response = (await browser.runtime.sendMessage({
      type: 'GET_RESUME_DATA',
    })) as MessageResponse;

    if (!response.success || !response.data) {
      alert('Please upload your resume first!');
      return;
    }

    const resumeData = response.data as ResumeData;

    // Detect form fields
    const detector = new FormDetector();
    const fields = detector.detectFormFields();

    if (fields.length === 0) {
      alert('No form fields detected on this page.');
      return;
    }

    // Match fields with resume data
    const matcher = new FieldMatcher(resumeData);
    const mappings = matcher.matchFields(fields);

    // Show preview panel
    showPreviewPanel(mappings);
  } catch (error) {
    console.error('Error in scanPageAndShowPreview:', error);
    alert('An error occurred while scanning the page.');
  }
}

function showPreviewPanel(mappings: FieldMapping[]) {
  // Remove existing panel if any
  if (previewPanel) {
    previewPanel.remove();
  }

  // Create preview panel
  previewPanel = document.createElement('div');
  previewPanel.id = 'jobspeed-preview-panel';
  previewPanel.innerHTML = `
    <div class="jobspeed-panel-header">
      <h2>JobSpeed - Auto-fill Preview</h2>
      <button class="jobspeed-close-btn">×</button>
    </div>
    <div class="jobspeed-panel-content">
      <p class="jobspeed-info">Review the suggested values below. Fields will be highlighted on the page.</p>
      <div class="jobspeed-mappings">
        ${mappings
          .map(
            (mapping, index) => `
          <div class="jobspeed-mapping-item" data-index="${index}">
            <div class="jobspeed-field-name">${mapping.field.label || mapping.field.name}</div>
            <div class="jobspeed-field-value">${escapeHtml(mapping.value)}</div>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
    <div class="jobspeed-panel-footer">
      <button class="jobspeed-cancel-btn">Cancel</button>
      <button class="jobspeed-apply-btn">Apply Auto-fill</button>
    </div>
  `;

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    #jobspeed-preview-panel {
      position: fixed;
      top: 20px;
      right: 20px;
      width: 400px;
      max-height: 80vh;
      background: white;
      border: 2px solid #667eea;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      flex-direction: column;
    }

    .jobspeed-panel-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px 20px;
      border-radius: 10px 10px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .jobspeed-panel-header h2 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }

    .jobspeed-close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 28px;
      line-height: 1;
      cursor: pointer;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: background 0.2s;
    }

    .jobspeed-close-btn:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .jobspeed-panel-content {
      padding: 20px;
      overflow-y: auto;
      flex: 1;
    }

    .jobspeed-info {
      margin: 0 0 16px 0;
      font-size: 13px;
      color: #666;
      line-height: 1.5;
    }

    .jobspeed-mappings {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .jobspeed-mapping-item {
      padding: 12px;
      background: #f8f9fa;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .jobspeed-mapping-item:hover {
      background: #e8f5e9;
      border-color: #4caf50;
      transform: translateX(-2px);
    }

    .jobspeed-field-name {
      font-size: 12px;
      font-weight: 600;
      color: #333;
      margin-bottom: 4px;
    }

    .jobspeed-field-value {
      font-size: 13px;
      color: #666;
    }

    .jobspeed-panel-footer {
      padding: 16px 20px;
      border-top: 1px solid #e0e0e0;
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }

    .jobspeed-cancel-btn,
    .jobspeed-apply-btn {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .jobspeed-cancel-btn {
      background: white;
      color: #666;
      border: 1px solid #ddd;
    }

    .jobspeed-cancel-btn:hover {
      background: #f5f5f5;
      border-color: #999;
    }

    .jobspeed-apply-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .jobspeed-apply-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .jobspeed-highlight {
      outline: 2px solid #667eea !important;
      outline-offset: 2px !important;
      background-color: rgba(102, 126, 234, 0.05) !important;
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(previewPanel);

  // Highlight fields
  mappings.forEach((mapping) => {
    mapping.field.element.classList.add('jobspeed-highlight');
  });

  // Add event listeners
  const closeBtn = previewPanel.querySelector('.jobspeed-close-btn');
  const cancelBtn = previewPanel.querySelector('.jobspeed-cancel-btn');
  const applyBtn = previewPanel.querySelector('.jobspeed-apply-btn');

  const cleanup = () => {
    mappings.forEach((mapping) => {
      mapping.field.element.classList.remove('jobspeed-highlight');
    });
    if (previewPanel) {
      previewPanel.remove();
      previewPanel = null;
    }
  };

  closeBtn?.addEventListener('click', cleanup);
  cancelBtn?.addEventListener('click', cleanup);
  applyBtn?.addEventListener('click', () => {
    applyAutoFill(mappings);
    cleanup();
  });

  // Hover effect - highlight corresponding field
  const mappingItems = previewPanel.querySelectorAll('.jobspeed-mapping-item');
  mappingItems.forEach((item, index) => {
    const mapping = mappings[index];
    if (!mapping) return;

    item.addEventListener('mouseenter', () => {
      mapping.field.element.style.outline = '3px solid #4caf50';
      mapping.field.element.style.outlineOffset = '2px';
    });

    item.addEventListener('mouseleave', () => {
      mapping.field.element.style.outline = '';
      mapping.field.element.style.outlineOffset = '';
    });
  });
}

function applyAutoFill(mappings: FieldMapping[]) {
  let successCount = 0;

  mappings.forEach((mapping) => {
    try {
      const element = mapping.field.element;

      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement
      ) {
        element.value = mapping.value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        successCount++;
      } else if (element instanceof HTMLSelectElement) {
        // Try to find matching option
        const options = Array.from(element.options);
        const matchingOption = options.find(
          (opt) =>
            opt.value.toLowerCase() === mapping.value.toLowerCase() ||
            opt.text.toLowerCase() === mapping.value.toLowerCase()
        );

        if (matchingOption) {
          element.value = matchingOption.value;
          element.dispatchEvent(new Event('change', { bubbles: true }));
          successCount++;
        }
      }
    } catch (error) {
      console.error('Error filling field:', error);
    }
  });

  alert(
    `Successfully filled ${successCount} out of ${mappings.length} fields!`
  );
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
