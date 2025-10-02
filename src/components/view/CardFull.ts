import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";
//import { IEvents } from "../base/Events";
import { categoryMap, CDN_URL } from "../../utils/constants";

interface ICardAction {
  onClick?: (event: MouseEvent) => void;
}

export interface ICardFull {
  category: string;
  image: string;
  description: string;
}

export class CardFull extends Card {
  protected btnBuy: HTMLButtonElement;
  categoryCard: HTMLElement;
  imagePath: HTMLImageElement;
  descriptionCard: HTMLElement;

  constructor(container: HTMLElement, action?: ICardAction) {
    super(container);

    this.btnBuy = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container
    );
    this.categoryCard = ensureElement<HTMLElement>(
      ".card__category",
      this.container
    );
    this.imagePath = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );
    this.descriptionCard = ensureElement<HTMLElement>(
      ".card__text",
      this.container
    );

    if (action?.onClick) {
      this.btnBuy.addEventListener("click", action.onClick);
      

    }
  }

  set category(value: string) {
    this.categoryCard.className = "";
    this.categoryCard.className = `card__category ${
      categoryMap[value as keyof typeof categoryMap]
    }`;
    this.categoryCard.textContent = value;
  }

  set image(value: string) {
    this.setImage(this.imagePath, CDN_URL + value, this.title);
  }

  set description(value: string) {
    this.descriptionCard.textContent = value;
  }

  deactivationBtn(): void {
    this.btnBuy.toggleAttribute("disabled");
    this.btnBuy.textContent = "Недоступно";
  }

  set namingBtn(value: string) {
    this.btnBuy.textContent = value;
  }
}
