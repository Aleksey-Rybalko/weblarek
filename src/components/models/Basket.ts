import { IProduct } from "../../types/index.ts";

export class Basket {
  protected productArrayBasket: IProduct[] = [];

  getProductArrayBasket(): IProduct[] {
    return this.productArrayBasket;
  }

  setProductInBasket(product: IProduct): void {
    this.productArrayBasket.push(product);
  }

  deleteProductFromBasket(productRem: IProduct): void {
    const index = this.productArrayBasket.findIndex(
      (product) => product.id === productRem.id
    );
    if (index !== -1) {
      this.productArrayBasket.splice(index, 1);
    }
  }

  clearBasket(): void {
    this.productArrayBasket = [];
  }

  getCost(): number {
    let cost: number = 0;
    this.productArrayBasket.forEach((product) => {
      if (typeof product.price === "number") {
        cost = cost + product.price;
      }
    });
    return cost;
  }

  getCount(): number {
    return this.productArrayBasket.length;
  }

  hasProduct(id: string): boolean {
    return this.productArrayBasket.some((product) => product.id === id);
  }
}
