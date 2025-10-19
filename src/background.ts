/// <reference types="firefox-webext-browser" />
import type { Message, MessageResponse } from './types';

// Background service worker for JobSpeed extension

console.log('JobSpeed background script loaded');

// Listen for extension installation
browser.runtime.onInstalled.addListener(
  (details: browser.runtime._OnInstalledDetails) => {
    if (details.reason === 'install') {
      console.log('JobSpeed extension installed');
      // Initialize storage with empty resume data
      void browser.storage.local.set({
        resumeData: null,
        resumeLastUpdated: null,
      });
    }
  }
);

// Listen for messages from content scripts or popup
browser.runtime.onMessage.addListener(
  (
    message: Message,
    _sender: browser.runtime.MessageSender,
    sendResponse: (response: MessageResponse) => void
  ) => {
    console.log('Background received message:', message);

    if (message.type === 'GET_RESUME_DATA') {
      browser.storage.local
        .get(['resumeData'])
        .then((result: { resumeData?: unknown }) => {
          sendResponse({ success: true, data: result.resumeData });
        })
        .catch((error: Error) => {
          console.error('Error getting resume data:', error);
          sendResponse({ success: false, error: error.message });
        });
      return true; // Keep message channel open for async response
    }

    if (message.type === 'SAVE_RESUME_DATA') {
      browser.storage.local
        .set({
          resumeData: message.data,
          resumeLastUpdated: new Date().toISOString(),
        })
        .then(() => {
          sendResponse({ success: true });
        })
        .catch((error: Error) => {
          console.error('Error saving resume data:', error);
          sendResponse({ success: false, error: error.message });
        });
      return true; // Keep message channel open for async response
    }

    return false;
  }
);
