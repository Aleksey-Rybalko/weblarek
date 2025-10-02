import { IProduct } from "../../types/index.ts";
import { IEvents } from "../base/Events.ts";

export class BasketModel {
  protected productArrayBasket: IProduct[] = [];

  getProductArrayBasket(): IProduct[] {
    return this.productArrayBasket;
  }

  setProductInBasket(product: IProduct): void {
    this.productArrayBasket.push(product);
  }

  deleteProductFromBasket(productRem: IProduct): void {
    console.log(this.productArrayBasket);
    const index = this.productArrayBasket.findIndex(
      (product) => product.id === productRem.id
    );
    if (index !== -1) {
      this.productArrayBasket.splice(index, 1);

      console.log(this.productArrayBasket);
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

export class BasketModelWhithEvents extends BasketModel {
  constructor(private events: IEvents) {
    super();
  }

  setProductInBasket(product: IProduct): void {
    super.setProductInBasket(product);
    this.events.emit("modal:close");
  }

  clearBasket(): void {
    super.clearBasket();
    this.events.emit("basket:changed");
    this.events.emit("modal:close");
  }
}
