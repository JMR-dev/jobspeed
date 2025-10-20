import { test, expect } from '@playwright/test';

test.describe('Job Application Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the form with all sections', async ({ page }) => {
    await expect(page.getByText('Job Application Form')).toBeVisible();
    await expect(
      page.getByText('Fields marked with * are required')
    ).toBeVisible();

    // Check all sections are present
    await expect(page.getByText('Personal Information')).toBeVisible();
    await expect(page.getByText('Work Experience *')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Education' })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Certifications' })
    ).toBeVisible();
    await expect(page.getByText('Skills *')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Professional Summary' })
    ).toBeVisible();
  });

  test('should show validation errors for incomplete required fields', async ({
    page,
  }) => {
    // Fill some fields but leave others empty to trigger custom validation
    await page.getByLabel(/full name/i).fill('John Doe');
    await page.getByLabel(/email/i).fill('john@example.com');
    // Leave other required fields empty

    await page.getByRole('button', { name: /submit application/i }).click();

    await expect(
      page.getByText(/please fill in all required personal information fields/i)
    ).toBeVisible();
  });

  test('should fill personal information', async ({ page }) => {
    await page.getByLabel(/full name/i).fill('John Doe');
    await page.getByLabel(/email/i).fill('john.doe@example.com');
    await page.getByLabel(/phone/i).fill('+12345678901');
    await page.getByLabel(/address/i).fill('123 Main Street');
    await page.getByLabel(/city/i).fill('New York');
    await page.getByLabel(/state/i).fill('NY');
    await page.getByLabel(/zip code/i).fill('10001');
    await page.getByLabel(/country/i).fill('USA');

    // Verify values are entered
    await expect(page.getByLabel(/full name/i)).toHaveValue('John Doe');
    await expect(page.getByLabel(/email/i)).toHaveValue(
      'john.doe@example.com'
    );
  });

  test('should add and remove work experience', async ({ page }) => {
    // Add work experience
    await page.getByRole('button', { name: /add work experience/i }).click();

    // Fill work experience form
    await page.getByLabel(/company/i).fill('Acme Corporation');
    await page.getByLabel(/position/i).fill('Software Engineer');
    await page.getByLabel(/start date/i).fill('2020-01-01');
    await page.getByLabel(/end date/i).fill('2023-12-31');
    await page
      .getByLabel(/description/i)
      .fill('Developed and maintained web applications');

    // Verify values
    await expect(page.getByLabel(/company/i)).toHaveValue('Acme Corporation');

    // Check for delete button (IconButton with DeleteIcon)
    const deleteButton = page.getByRole('button', { name: '' }).first();
    await expect(deleteButton).toBeVisible();

    // Remove work experience
    await deleteButton.click();

    // Verify work experience is removed
    await expect(page.getByLabel(/company/i)).not.toBeVisible();
  });

  test('should toggle current job checkbox', async ({ page }) => {
    await page.getByRole('button', { name: /add work experience/i }).click();

    const endDateInput = page.getByLabel(/end date/i);
    await expect(endDateInput).toBeEnabled();

    // Click "I currently work here" checkbox
    await page.getByText(/i currently work here/i).click();

    // End date should be disabled
    await expect(endDateInput).toBeDisabled();
  });

  test('should add and remove skills', async ({ page }) => {
    // Add a skill
    await page.getByLabel(/add a skill/i).fill('JavaScript');
    await page.getByRole('button', { name: /^add$/i }).click();

    // Verify skill chip appears
    await expect(page.getByText('JavaScript')).toBeVisible();

    // Add another skill
    await page.getByLabel(/add a skill/i).fill('TypeScript');
    await page.getByRole('button', { name: /^add$/i }).click();

    await expect(page.getByText('TypeScript')).toBeVisible();

    // Remove a skill (click the X on the chip)
    await page.locator('[data-testid="CancelIcon"]').first().click();

    // Verify one skill remains
    const skillChips = page.locator('span').filter({ hasText: /script/i });
    await expect(skillChips).toHaveCount(1);
  });

  test('should add education entry', async ({ page }) => {
    await page.getByRole('button', { name: /add education/i }).click();

    await page.getByLabel(/institution/i).fill('MIT');
    await page.getByLabel(/degree/i).fill('Bachelor of Science');
    await page.getByLabel(/field of study/i).fill('Computer Science');
    await page.getByLabel(/graduation date/i).fill('2019-05-15');
    await page.getByLabel(/gpa/i).fill('3.85');

    await expect(page.getByLabel(/institution/i)).toHaveValue('MIT');
  });

  test('should add certification entry', async ({ page }) => {
    await page.getByRole('button', { name: /add certification/i }).click();

    await page
      .getByLabel(/certification name/i)
      .fill('AWS Certified Solutions Architect');
    await page.getByLabel(/acquired date/i).fill('2022-06-01');
    await page.getByLabel(/area of expertise/i).fill('Cloud Computing');

    await expect(page.getByLabel(/certification name/i)).toHaveValue(
      'AWS Certified Solutions Architect'
    );
  });

  test('should fill professional summary', async ({ page }) => {
    const summary =
      'Experienced software engineer with 5 years of expertise in web development.';
    await page.getByLabel(/summary/i).fill(summary);

    await expect(page.getByLabel(/summary/i)).toHaveValue(summary);
  });

  test('should complete full application and submit', async ({ page }) => {
    // Personal Information
    await page.getByLabel(/full name/i).fill('Jane Smith');
    await page.getByLabel(/email/i).fill('jane.smith@example.com');
    await page.getByLabel(/phone/i).fill('+19876543210');
    await page.getByLabel(/address/i).fill('456 Oak Avenue');
    await page.getByLabel(/city/i).fill('San Francisco');
    await page.getByLabel(/state/i).fill('CA');
    await page.getByLabel(/zip code/i).fill('94102');
    await page.getByLabel(/country/i).fill('USA');

    // Work Experience
    await page.getByRole('button', { name: /add work experience/i }).click();
    await page.getByLabel(/company/i).fill('Tech Innovations Inc');
    await page.getByLabel(/position/i).fill('Senior Developer');
    await page.getByLabel(/start date/i).fill('2018-03-01');
    await page.getByLabel(/end date/i).fill('2024-01-01');
    await page
      .getByLabel(/description/i)
      .fill('Led development of enterprise applications');

    // Skills
    await page.getByLabel(/add a skill/i).fill('React');
    await page.getByRole('button', { name: /^add$/i }).click();
    await page.getByLabel(/add a skill/i).fill('Node.js');
    await page.getByRole('button', { name: /^add$/i }).click();

    // Setup download listener before clicking submit
    const downloadPromise = page.waitForEvent('download');

    // Submit the form
    await page.getByRole('button', { name: /submit application/i }).click();

    // Wait for success message
    await expect(
      page.getByText(/application saved as job-application/i)
    ).toBeVisible({ timeout: 10000 });

    // Verify download occurred
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/job-application-\d+-.*\.json/);
  });

  test('should validate email format', async ({ page }) => {
    const emailInput = page.getByLabel(/email/i);
    await emailInput.fill('invalid-email');

    // The HTML5 validation will prevent form submission
    await page.getByRole('button', { name: /submit application/i }).click();

    // Check for browser validation message
    const validationMessage = await emailInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );
    expect(validationMessage).toBeTruthy();
  });

  test('should validate phone number format', async ({ page }) => {
    const phoneInput = page.getByLabel(/phone/i);
    await phoneInput.fill('abc123');

    await page.getByRole('button', { name: /submit application/i }).click();

    const validationMessage = await phoneInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );
    expect(validationMessage).toBeTruthy();
  });

  test('should validate zip code format', async ({ page }) => {
    const zipInput = page.getByLabel(/zip code/i);
    await zipInput.fill('1234'); // Only 4 digits

    await page.getByRole('button', { name: /submit application/i }).click();

    const validationMessage = await zipInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );
    expect(validationMessage).toBeTruthy();
  });

  test('should validate GPA format when education is added', async ({
    page,
  }) => {
    await page.getByRole('button', { name: /add education/i }).click();

    const gpaInput = page.getByLabel(/gpa/i);
    await gpaInput.fill('5.00'); // Invalid - first digit must be 1-4

    await page.getByRole('button', { name: /submit application/i }).click();

    const validationMessage = await gpaInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );
    expect(validationMessage).toBeTruthy();
  });
});
