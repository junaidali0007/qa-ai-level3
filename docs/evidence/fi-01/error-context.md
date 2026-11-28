# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\catalog\product-detail.spec.ts >> Product Detail page @ui @catalog >> @AE-12 @ui @catalog open first product details, increase quantity, add to cart and verify cart quantity and total
- Location: tests\ui\catalog\product-detail.spec.ts:6:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 2000
Received: 1500
```

# Page snapshot

```yaml
- generic [active] [ref=f12e1]:
  - banner [ref=f12e2]:
    - generic [ref=f12e5]:
      - link [ref=f12e8] [cursor=pointer]:
        - /url: /
        - img "Website for automation practice" [ref=f12e9]
      - list [ref=f12e12]:
        - listitem [ref=f12e13]:
          - link " Home" [ref=f12e14] [cursor=pointer]:
            - /url: /
            - generic [ref=f12e15]: 
            - text: Home
        - listitem [ref=f12e16]:
          - link " Products" [ref=f12e17] [cursor=pointer]:
            - /url: /products
            - generic [ref=f12e18]: 
            - text: Products
        - listitem [ref=f12e19]:
          - link " Cart" [ref=f12e20] [cursor=pointer]:
            - /url: /view_cart
            - generic [ref=f12e21]: 
            - text: Cart
        - listitem [ref=f12e22]:
          - link " Signup / Login" [ref=f12e23] [cursor=pointer]:
            - /url: /login
            - generic [ref=f12e24]: 
            - text: Signup / Login
        - listitem [ref=f12e25]:
          - link " Test Cases" [ref=f12e26] [cursor=pointer]:
            - /url: /test_cases
            - generic [ref=f12e27]: 
            - text: Test Cases
        - listitem [ref=f12e28]:
          - link " API Testing" [ref=f12e29] [cursor=pointer]:
            - /url: /api_list
            - generic [ref=f12e30]: 
            - text: API Testing
        - listitem [ref=f12e31]:
          - link " Video Tutorials" [ref=f12e32] [cursor=pointer]:
            - /url: https://www.youtube.com/c/AutomationExercise
            - generic [ref=f12e33]: 
            - text: Video Tutorials
        - listitem [ref=f12e34]:
          - link " Contact us" [ref=f12e35] [cursor=pointer]:
            - /url: /contact_us
            - generic [ref=f12e36]: 
            - text: Contact us
  - generic [ref=f12e38]:
    - list [ref=f12e40]:
      - listitem [ref=f12e41]:
        - link "Home" [ref=f12e42] [cursor=pointer]:
          - /url: /
      - listitem [ref=f12e43]: Shopping Cart
    - generic [ref=f12e44]: Proceed To Checkout
    - table [ref=f12e50]:
      - rowgroup [ref=f12e51]:
        - row [ref=f12e52]:
          - cell "Item" [ref=f12e53]
          - cell "Description" [ref=f12e54]
          - cell "Price" [ref=f12e55]
          - cell "Quantity" [ref=f12e56]
          - cell "Total" [ref=f12e57]
          - cell [ref=f12e58]
      - rowgroup [ref=f12e59]:
        - row [ref=f12e60]:
          - cell [ref=f12e61]:
            - link [ref=f12e62] [cursor=pointer]:
              - /url: ""
              - img "Product Image" [ref=f12e63]
          - cell [ref=f12e64]:
            - heading [level=4] [ref=f12e65]:
              - link "Blue Top" [ref=f12e66] [cursor=pointer]:
                - /url: /product_details/1
            - paragraph [ref=f12e67]: Women > Tops
          - cell [ref=f12e68]:
            - paragraph [ref=f12e69]: Rs. 500
          - cell [ref=f12e70]:
            - button "3" [ref=f12e71] [cursor=pointer]
          - cell [ref=f12e72]:
            - paragraph [ref=f12e73]: Rs. 1500
          - cell "" [ref=f12e74]
  - contentinfo [ref=f12e77]:
    - generic [ref=f12e82]:
      - heading "Subscription" [level=2] [ref=f12e83]
      - generic [ref=f12e84]:
        - textbox "Your email address" [ref=f12e85]
        - button "" [ref=f12e86] [cursor=pointer]
        - paragraph [ref=f12e88]: Get the most recent updates from our site and be updated your self...
    - paragraph [ref=f12e92]: Copyright © 2021 All rights reserved
  - text: 
```

# Test source

```ts
  4   |     readonly productImage: Locator;
  5   |     readonly productName: Locator;
  6   |     readonly category: Locator;
  7   |     readonly price: Locator;
  8   |     readonly availability: Locator;
  9   |     readonly condition: Locator;
  10  |     readonly brand: Locator;
  11  |     readonly quantityInput: Locator;
  12  |     readonly addToCartButton: Locator;
  13  |     readonly writeReviewHeading: Locator;
  14  |     readonly reviewNameInput: Locator;
  15  |     readonly reviewEmailInput: Locator;
  16  |     readonly reviewTextInput: Locator;
  17  |     readonly submitReviewButton: Locator;
  18  |     readonly reviewSuccessAlert: Locator;
  19  |     readonly reviewSuccessMessage: Locator;
  20  | 
  21  |     constructor(private readonly page: Page) {
  22  |         this.productImage = page.locator('.view-product img');
  23  |         this.productName = page.locator('.product-information h2');
  24  |         this.category = page.locator('.product-information p').filter({ hasText: 'Category:' });
  25  |         this.price = page.locator('.product-information span span');
  26  |         this.availability = page.locator('.product-information p').filter({ hasText: 'Availability:' });
  27  |         this.condition = page.locator('.product-information p').filter({ hasText: 'Condition:' });
  28  |         this.brand = page.locator('.product-information p').filter({ hasText: 'Brand:' });
  29  |         this.quantityInput = page.locator('#quantity');
  30  |         this.addToCartButton = page.locator('.product-information .cart');
  31  |         this.writeReviewHeading = page.getByText('Write Your Review', { exact: true });
  32  |         this.reviewNameInput = page.locator('#name');
  33  |         this.reviewEmailInput = page.locator('#email');
  34  |         this.reviewTextInput = page.locator('#review');
  35  |         this.submitReviewButton = page.locator('#button-review');
  36  |         this.reviewSuccessAlert = page.locator("#review-section .alert-success");
  37  |         this.reviewSuccessMessage = page.locator("#review-section .alert-success span");
  38  |     }
  39  | 
  40  |     async expectLoaded(): Promise<void> {
  41  |         await expect(this.page).toHaveURL(/\/product_details\/\d+/);
  42  |         await expect(this.productName).toBeVisible();
  43  |     }
  44  | 
  45  |     async verifyProductDetails(expected?: {
  46  |         name?: string;
  47  |         brand?: string;
  48  |     }): Promise<void> {
  49  |         await this.expectLoaded();
  50  |         await expect(this.productImage).toBeVisible();
  51  |         await expect(this.category).toBeVisible();
  52  |         await expect(this.price).toBeVisible();
  53  |         await expect(this.availability).toBeVisible();
  54  |         await expect(this.condition).toBeVisible();
  55  |         await expect(this.brand).toBeVisible();
  56  | 
  57  |         if (expected?.name) {
  58  |             await expect(this.productName).toContainText(expected.name);
  59  |         }
  60  |         if (expected?.brand) {
  61  |             await expect(this.brand).toContainText(expected.brand);
  62  |         }
  63  |     }
  64  | 
  65  |     private parseRupeeAmount(rawText: string): number {
  66  |         const numericValue = Number(
  67  |             rawText.replace(/^Rs\.\s*/i, "").replace(/[^\d.]/g, "").trim(),
  68  |         );
  69  |         expect(Number.isFinite(numericValue)).toBe(true);
  70  |         return numericValue;
  71  |     }
  72  | 
  73  |     // @AE-12 @ui @catalog increase quantity on product detail page, add to cart and verify cart page quantity and total price
  74  |     async addProductToCartAndVerify(p0: string, quantity = 3): Promise<void> {
  75  |         await this.expectLoaded();
  76  |         await expect(this.price).toBeVisible();
  77  | 
  78  |         const productName = (await this.productName.innerText()).trim();
  79  |         const unitPrice = this.parseRupeeAmount(await this.price.innerText());
  80  |         expect(unitPrice).toBeGreaterThan(0);
  81  | 
  82  |         await this.quantityInput.fill(String(quantity));
  83  |         await this.addToCartButton.click();
  84  | 
  85  |         await this.page
  86  |             .locator(".modal-content")
  87  |             .getByRole("link", { name: /view cart/i })
  88  |             .click();
  89  | 
  90  |         await expect(this.page).toHaveURL(/\/view_cart/);
  91  | 
  92  |         const cartRow = this.page
  93  |             .locator("#cart_info_table tbody tr[id^='product-']")
  94  |             .filter({ hasText: productName })
  95  |             .first();
  96  | 
  97  |         await expect(cartRow).toBeVisible();
  98  |         await expect(cartRow.locator(".cart_quantity button")).toHaveText(String(quantity));
  99  | 
  100 |         const total = this.parseRupeeAmount(
  101 |             await cartRow.locator(".cart_total p").innerText(),
  102 |         );
  103 |         //revert this line
> 104 |          expect(total).toBe(unitPrice * (quantity + 1));
      |                        ^ Error: expect(received).toBe(expected) // Object.is equality
  105 |     }
  106 |  async submitReviewAndVerify(
  107 |   name: string,
  108 |   email: string,
  109 |   review: string,
  110 | ): Promise<string> {
  111 |   await this.reviewNameInput.scrollIntoViewIfNeeded();
  112 |   await this.reviewNameInput.fill(name);
  113 |   await this.reviewEmailInput.fill(email);
  114 |   await this.reviewTextInput.fill(review);
  115 | 
  116 |   await Promise.all([
  117 |     this.reviewSuccessAlert.waitFor({ state: "visible", timeout: 4000 }),
  118 |     this.submitReviewButton.click(),
  119 |   ]);
  120 | 
  121 |   await expect(this.reviewSuccessMessage).toHaveText(/thank you for your review\.?/i, {
  122 |     timeout: 4000,
  123 |   });
  124 | 
  125 |   return (await this.reviewSuccessMessage.innerText()).trim();
  126 | }
  127 | }
```