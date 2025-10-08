import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IHeader {
  counter: number;
}

export class Header extends Component<IHeader> {
  protected btnBasket: HTMLButtonElement;
  protected counterBasket: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.btnBasket = ensureElement<HTMLButtonElement>(
      ".header__basket",
      this.container
    );
    this.counterBasket = ensureElement<HTMLElement>(
      ".header__basket-counter",
      this.container
    );

    this.btnBasket.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }

  set counter(value: number) {
    this.counterBasket.textContent = String(value);
  }
}
