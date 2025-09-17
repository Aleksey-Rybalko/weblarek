import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";
import { IEvents } from "../base/Events";

export interface ICardBasket {
  titleCard: string;
  priceCard: number;
  cardIndex: number;
}

export class CardBasket extends Card {
  protected btnDeleteCard: HTMLButtonElement
  protected itemCard: HTMLElement
  protected index: number;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.btnDeleteCard = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container
    );

    this.itemCard = ensureElement<HTMLButtonElement>(
      ".basket__item",
      this.container
    );
    this.index = 0;

    this.btnDeleteCard.addEventListener("click", () => {
      this.events.emit("basket:delete");
    });
  }

  set cardIndex (value: number) {
    this.index = value;
  }
}
