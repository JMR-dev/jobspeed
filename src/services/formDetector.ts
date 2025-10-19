import type { FormField } from '../types';

export class FormDetector {
  private readonly formFieldSelectors = [
    'input[type="text"]',
    'input[type="email"]',
    'input[type="tel"]',
    'input[type="url"]',
    'input[type="number"]',
    'input:not([type])',
    'textarea',
    'select',
  ];

  detectFormFields(): FormField[] {
    const fields: FormField[] = [];
    const selector = this.formFieldSelectors.join(', ');
    const elements = document.querySelectorAll(selector);

    elements.forEach((element) => {
      if (
        !(
          element instanceof HTMLInputElement ||
          element instanceof HTMLTextAreaElement ||
          element instanceof HTMLSelectElement
        )
      ) {
        return;
      }

      // Skip hidden, disabled, or readonly fields
      if (
        element.type === 'hidden' ||
        element.disabled ||
        ('readOnly' in element && element.readOnly) ||
        !this.isVisible(element)
      ) {
        return;
      }

      const field = this.extractFieldInfo(element);
      if (field) {
        fields.push(field);
      }
    });

    return fields;
  }

  private extractFieldInfo(
    element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  ): FormField | null {
    const name = element.name || '';
    const id = element.id || '';
    const type =
      element instanceof HTMLInputElement
        ? element.type
        : element.tagName.toLowerCase();

    // Get label
    let label = '';

    // Try to find label by 'for' attribute
    if (id) {
      const labelElement = document.querySelector(`label[for="${id}"]`);
      if (labelElement) {
        label = labelElement.textContent?.trim() || '';
      }
    }

    // Try to find parent label
    if (!label) {
      const parentLabel = element.closest('label');
      if (parentLabel) {
        label = parentLabel.textContent?.trim() || '';
      }
    }

    // Try to find nearby text
    if (!label) {
      label = this.findNearbyLabel(element);
    }

    // Use placeholder, name, or id as fallback
    if (!label) {
      label =
        element.getAttribute('placeholder') ||
        element.getAttribute('aria-label') ||
        name ||
        id;
    }

    return {
      element,
      type,
      name,
      id,
      label,
      value:
        element instanceof HTMLSelectElement ? element.value : element.value,
    };
  }

  private findNearbyLabel(element: HTMLElement): string {
    // Look for text in previous sibling
    let sibling = element.previousElementSibling;
    if (sibling && sibling.textContent) {
      return sibling.textContent.trim();
    }

    // Look for text in parent's previous sibling
    const parent = element.parentElement;
    if (parent) {
      sibling = parent.previousElementSibling;
      if (sibling && sibling.textContent) {
        return sibling.textContent.trim();
      }
    }

    return '';
  }

  private isVisible(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element);
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      style.opacity !== '0' &&
      element.offsetParent !== null
    );
  }
}
