import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";

interface ICardAction {
  onClick?: (event: MouseEvent) => void;
}

export interface ICardBasket {
  cardIndex: number;
}

export class CardBasket extends Card {
  protected btnDeleteCard: HTMLButtonElement;
  protected index: HTMLElement;

  constructor(container: HTMLElement, action?: ICardAction) {
    super(container);

    this.btnDeleteCard = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container
    );

    this.index = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container
    );

    if (action?.onClick) {
      this.btnDeleteCard.addEventListener("click", action.onClick);
    }
  }

  set updateCardIndex(value: number) {
    this.index.textContent = String(value);
  }
}
