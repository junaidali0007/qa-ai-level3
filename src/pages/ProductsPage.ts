import { expect, type Locator, type Page } from "@playwright/test";
import { ProductDetailsPage } from "./ProductDetailsPage.js";

export class ProductsPage {
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly continueShoppingButton: Locator;
    readonly allProductsHeading: Locator;
    readonly firstProductCard: Locator;
    readonly firstProductViewLink: Locator;
    readonly productNameHeading: Locator;
    readonly productCategory: Locator;
    readonly productPrice: Locator;
    readonly productAvailability: Locator;
    readonly productCondition: Locator;
    readonly productBrand: Locator;
    readonly categoryHeading: Locator;
    readonly categorySidebar: Locator;
    readonly womenCategoryLink: Locator;
    readonly womenTopsLink: Locator;
    readonly menCategoryLink: Locator;
    readonly menJeansLink: Locator;
    readonly categoryProductsHeading: Locator;

    constructor(private readonly page: Page) {
        this.searchInput = page.getByPlaceholder(/search product/i);
        this.searchButton = page.locator("#submit_search");
        this.continueShoppingButton = page.getByRole("button", {
            name: /continue shopping/i,
        });

        this.allProductsHeading = page.getByRole("heading", {
            name: /all products/i,
        });
        this.firstProductCard = page
            .locator(".features_items .product-image-wrapper")
            .first();
        this.firstProductViewLink = this.firstProductCard.getByRole("link", {
            name: /view product/i,
        });

        const productInfo = page.locator(".product-information");
        this.productNameHeading = productInfo.locator("h2");
        this.productCategory = productInfo
            .locator("p")
            .filter({ hasText: "Category:" });
        this.productPrice = productInfo
            .locator("span")
            .filter({ hasText: /^Rs\.\s*\d+$/ });
        this.productAvailability = productInfo
            .locator("p")
            .filter({ hasText: "Availability:" });
        this.productCondition = productInfo
            .locator("p")
            .filter({ hasText: "Condition:" });
        this.productBrand = productInfo.locator("p").filter({ hasText: "Brand:" });

        this.categoryHeading = page.getByRole("heading", {
            name: "Category",
            exact: true,
        });
        this.categorySidebar = page.locator(".left-sidebar .category-products");
        this.womenCategoryLink = this.categorySidebar.locator('a[href="#Women"]');
        this.womenTopsLink = page
            .locator("#Women")
            .getByRole("link", { name: "Tops", exact: true });
        this.menCategoryLink = this.categorySidebar.locator('a[href="#Men"]');
        this.menJeansLink = page
            .locator("#Men")
            .getByRole("link", { name: "Jeans", exact: true });
        this.categoryProductsHeading = page.locator(".features_items h2.title");
    }

    private parseCurrencyAmount(rawText: string): number {
        const numericValue = Number(rawText.replace(/[^\d.]/g, "").trim());
        expect(Number.isFinite(numericValue)).toBe(true);
        return numericValue;
    }

    async searchFor(query: string): Promise<void> {
        await this.searchInput.fill(query);
        await this.searchButton.click();
    }

    addToCartButtonForProductId(productId: number): Locator {
        return this.page
            .locator(`.add-to-cart[data-product-id="${productId}"]`)
            .first();
    }

    async clickContinueShoppingIfVisible(timeoutMs = 3000): Promise<void> {
        const appeared = await this.continueShoppingButton
            .waitFor({ state: "visible", timeout: timeoutMs })
            .then(() => true)
            .catch(() => false);

        if (appeared) {
            await this.continueShoppingButton.click();
            await this.continueShoppingButton
                .waitFor({ state: "hidden", timeout: timeoutMs })
                .catch(() => { });
        }
    }

    async openFirstProductDetails(): Promise<ProductDetailsPage> {
        await expect(this.allProductsHeading).toBeVisible();
        await expect(this.firstProductCard).toBeVisible();
        await this.firstProductCard.scrollIntoViewIfNeeded();
        await this.firstProductViewLink.click();

        const productDetailsPage = new ProductDetailsPage(this.page);
        await productDetailsPage.expectLoaded();
        return productDetailsPage;
    }

    async viewProductDetails(productId: number): Promise<ProductDetailsPage> {
        const productCard = this.page
            .locator(
                `.features_items .product-image-wrapper:has(.add-to-cart[data-product-id="${productId}"])`,
            )
            .first();
        await expect(productCard).toBeVisible();
        await productCard.scrollIntoViewIfNeeded();
        await productCard.getByRole("link", { name: /view product/i }).click();

        const productDetailsPage = new ProductDetailsPage(this.page);
        await productDetailsPage.expectLoaded();
        return productDetailsPage;
    }

    async verifyAllProductsAndProductDetailPage(): Promise<void> {
        await expect(this.allProductsHeading).toBeVisible();
        await expect(this.firstProductCard).toBeVisible();
        await this.firstProductViewLink.click();

        await expect(this.page).toHaveURL(/\/product_details\/\d+/);
        await expect(this.productNameHeading).toBeVisible();
        await expect(this.productCategory).toBeVisible();
        await expect(this.productPrice).toBeVisible();
        await expect(this.productAvailability).toBeVisible();
        await expect(this.productCondition).toBeVisible();
        await expect(this.productBrand).toBeVisible();
    }

    // @AE-09 @ui @catalog displays products for selected categories
    async verifyProductsForSelectedCategories(): Promise<void> {
        await expect(this.categoryHeading).toBeVisible();

        await this.womenCategoryLink.click();
        await this.womenTopsLink.click();
        await expect(this.categoryProductsHeading).toHaveText(
            /WOMEN\s*-\s*TOPS PRODUCTS/i,
        );

        await this.menCategoryLink.click();
        await this.menJeansLink.click();
        await expect(this.categoryProductsHeading).toHaveText(
            /MEN\s*-\s*JEANS PRODUCTS/i,
        );
    }

    // @AE-10 @ui @catalog verify products for selected brands
    async verifyProductsForSelectedBrands(): Promise<void> {
        const brandsSidebar = this.page.locator(".brands-name");
        await brandsSidebar.locator('a[href="/brand_products/Polo"]').click();
        await expect(this.categoryProductsHeading).toHaveText(
            /BRAND\s*-\s*POLO PRODUCTS/i,
        );

        await brandsSidebar.locator('a[href="/brand_products/H&M"]').click();
        await expect(this.categoryProductsHeading).toHaveText(
            /BRAND\s*-\s*H&M PRODUCTS/i,
        );
    }

    // @AE-11 @ui @catalog add multiple products to cart and verify both products are in the cart
    async addMultipleProductsToCartAndVerifyInCart(
        productIds: number[],
    ): Promise<void> {
        expect(productIds).toHaveLength(2);

        await this.page.goto("http://automationexercise.com");
        await expect(this.page.locator("#slider")).toBeVisible();
        await this.page.getByRole("link", { name: "Products", exact: true }).click();
        await expect(this.allProductsHeading).toBeVisible();

        const modalContent = this.page.locator(".modal-content");

        const firstProductCard = this.page.locator(
            `.features_items .product-image-wrapper:has(.add-to-cart[data-product-id="${productIds[0]}"])`,
        );
        await firstProductCard.scrollIntoViewIfNeeded();
        await firstProductCard.hover();
        await this.addToCartButtonForProductId(productIds[0]).click();
        await expect(modalContent).toBeVisible();
        await this.clickContinueShoppingIfVisible();
        await expect(modalContent).toBeHidden();

        const secondProductCard = this.page.locator(
            `.features_items .product-image-wrapper:has(.add-to-cart[data-product-id="${productIds[1]}"])`,
        );
        await secondProductCard.scrollIntoViewIfNeeded();
        await secondProductCard.hover();
        await this.addToCartButtonForProductId(productIds[1]).click();
        await expect(modalContent).toBeVisible();
        await modalContent.getByRole("link", { name: /view cart/i }).click();

        await expect(this.page).toHaveURL(/\/view_cart/);

        const cartRows = this.page.locator(
            "#cart_info_table tbody tr[id^='product-']",
        );
        await expect(cartRows).toHaveCount(2);

        for (const productId of productIds) {
            const cartRow = this.page.locator(`#product-${productId}`);
            await expect(cartRow).toBeVisible();

            const price = this.parseCurrencyAmount(
                await cartRow.locator(".cart_price").innerText(),
            );
            const quantityText = (
                await cartRow.locator(".cart_quantity button").innerText()
            ).trim();
            const quantity = Number(quantityText);
            const total = this.parseCurrencyAmount(
                await cartRow.locator(".cart_total").innerText(),
            );

            expect(price).toBeGreaterThan(0);
            expect(quantity).toBe(1);
            expect(total).toBe(price * quantity);
        }
    }
    // @AE-11 @ui @catalog add multiple products to cart and verify both products are in the cart, add products one by one and verify added products in the cart after last product is added
    async addMultipleProductsToCartAndVerify(productIds: number[]): Promise<void> {

        for (const productId of productIds) {

            const addToCartButton = this.addToCartButtonForProductId(productId);

            await addToCartButton.click();

            await this.clickContinueShoppingIfVisible();

        }

    }
    
    async searchProductAndAddToCart(productName: string, productId: number): Promise<void> {
        await this.searchFor(productName);

        await this.addToCartButtonForProductId(productId).click();

        await this.clickContinueShoppingIfVisible();
    }
}