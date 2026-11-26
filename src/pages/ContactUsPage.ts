import { expect, Locator, Page } from '@playwright/test';

export class ContactUsPage {
	readonly page: Page;
	readonly getInTouchHeading: Locator;
	readonly nameInput: Locator;
	readonly emailInput: Locator;
	readonly subjectInput: Locator;
	readonly messageInput: Locator;
	readonly fileUploadInput: Locator;
	readonly submitButton: Locator;
	readonly successMessage: Locator;
	readonly homeLink: Locator;

	constructor(page: Page) {
		this.page = page;
		this.getInTouchHeading = page.getByRole('heading', { name: 'Get In Touch' });
		this.nameInput = page.locator('input[name="name"]');
		this.emailInput = page.locator('input[name="email"]');
		this.subjectInput = page.locator('input[name="subject"]');
		this.messageInput = page.locator('textarea[name="message"]');
		this.fileUploadInput = page.locator('input[name="upload_file"]');
		this.submitButton = page.locator('input[name="submit"]');
		this.successMessage = page.locator('div.status.alert.alert-success');
		this.homeLink = page.getByRole('link', { name: 'Home' });
	}

	// Method to fill out the contact form, accept the browser dialog, and submit
	async fillContactFormAndSubmit(
		name: string,
		email: string,
		subject: string,
		message: string,
		filePayload?: string | { name: string; mimeType: string; buffer: Buffer },
	): Promise<void> {
		await this.nameInput.fill(name);
		await this.emailInput.fill(email);
		await this.subjectInput.fill(subject);
		await this.messageInput.fill(message);
		if (filePayload) {
			if (typeof filePayload === 'string') {
				await this.fileUploadInput.setInputFiles(filePayload);
			} else {
				await this.fileUploadInput.setInputFiles([filePayload]);
			}
		}

		this.page.once('dialog', async (dialog) => {
			await dialog.accept();
		});

		await this.submitButton.click();
	}

	// Method to verify the success message after form submission
	async verifySuccessMessage(): Promise<void> {
		await expect(this.successMessage).toBeVisible();
		await expect(this.successMessage).toContainText(
			/success! your details have been submitted successfully/i,
		);
	}
}