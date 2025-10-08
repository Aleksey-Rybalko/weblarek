import { IProduct } from "../../types/index.ts";
import { IEvents } from "../base/Events.ts";

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

export class EventsProductCatalog extends ProductCatalog {
  constructor(private events: IEvents) {
    super();
  }

  setProductArray(productArray: IProduct[]): void {
    super.setProductArray(productArray);
    this.events.emit("products:changed", this.productArray);
  }

  setActiveProduct(product: IProduct): void {
    super.setActiveProduct(product);
    this.events.emit("card:select", product);
  }
}
