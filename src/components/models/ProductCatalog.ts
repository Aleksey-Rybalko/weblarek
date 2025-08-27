import { IProduct } from "../../types/index.ts";

export class ProductCatalog {
  protected productArray: IProduct[] = [];
  protected activeProduct: IProduct | null = null;

  setProductArray(productArray: IProduct[]): void {
    this.productArray = productArray;
  }

  getProductArray(): IProduct[] {
    return this.productArray;
  }

  getProduct(id: string): IProduct | undefined {
    return this.productArray.find((product) => product.id === id);
  }

  setActiveProduct(product: IProduct): void {
    this.activeProduct = product;
  }

  getActiveProduct(): IProduct | null {
    return this.activeProduct;
  }
}
