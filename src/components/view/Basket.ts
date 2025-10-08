import { createElement, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IBasket {
  contentAdd: HTMLElement;
  totalCost: string;
}

export class Basket extends Component<IBasket> {
  protected btnExecute: HTMLButtonElement;
  protected cost: HTMLElement;
  protected basketList: HTMLElement;
  protected basketclear:HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.btnExecute = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container
    );
    this.cost = ensureElement<HTMLElement>(".basket__price", this.container);
    this.basketList = ensureElement<HTMLElement>(
      ".basket__list",
      this.container
    );

    this.basketList.style.overflow = 'auto';
    this.basketList.style.maxHeight = '40vh'

    this.basketclear = createElement("p");
    this.basketclear.innerHTML = "корзина пуста";

    this.btnExecute.addEventListener("click", () => {
      this.events.emit("modalSalary:open");
    });
  }

  set totalCost(value: number) {
    this.cost.textContent = `${value} синапсов`;
  }

  set contentAdd(item: HTMLElement) {
    this.basketList.append(item);
  }

  clear() {
    this.basketList.innerHTML = "";
  }

  set deactivationBtn(value: boolean) {
    if (value) {
      this.btnExecute.disabled = true;
    } else {
      this.btnExecute.disabled = false;
    }
  }

  getEmptyBasket (): HTMLElement {
    return this.basketclear;
  }
}
