import { z } from 'zod';

const ProductCategorySchema = z
  .object({
    usertype: z
      .object({
        usertype: z.string().optional(),
      })
      .optional(),
    category: z.string().optional(),
  })
  .passthrough();

export const ProductSchema = z
  .object({
    id: z.union([z.number(), z.string()]).transform((v) => Number(v)),
    name: z.string(),
    price: z.string(),
    brand: z.string().optional(),
    category: ProductCategorySchema.optional(),
  })
  .passthrough();

const ProductsListResponseSchema = z.object({
  responseCode: z.union([z.number(), z.string()]).transform((v) => Number(v)),
  products: z.array(ProductSchema).optional(),
  message: z.string().optional(),
});

export type ProductItem = z.infer<typeof ProductSchema>;

export interface ProductsListResult {
  responseCode: number;
  products: ProductItem[];
  message: string;
}

export class ProductsApiClient {
  constructor(
    private readonly baseUrl: string = process.env.BASE_URL ?? 'https://automationexercise.com',
  ) {}

  private parseJsonPayload(rawText: string): unknown {
    try {
      return JSON.parse(rawText);
    } catch {
      throw new Error(
        `Expected JSON payload from Products API, received non-JSON starting with: ${rawText.slice(0, 140)}`,
      );
    }
  }

  async listProducts(): Promise<ProductsListResult> {
    const response = await fetch(`${this.baseUrl}/api/productsList`, {
      method: 'GET',
    });

    const text = await response.text();
    const parsed = ProductsListResponseSchema.parse(this.parseJsonPayload(text));

    return {
      responseCode: parsed.responseCode,
      products: parsed.products ?? [],
      message: parsed.message ?? '',
    };
  }

  async searchProducts(query: string): Promise<ProductsListResult> {
    const body = new URLSearchParams({ search_product: query });
    const response = await fetch(`${this.baseUrl}/api/searchProduct`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    const text = await response.text();
    const parsed = ProductsListResponseSchema.parse(this.parseJsonPayload(text));

    return {
      responseCode: parsed.responseCode,
      products: parsed.products ?? [],
      message: parsed.message ?? '',
    };
  }
}