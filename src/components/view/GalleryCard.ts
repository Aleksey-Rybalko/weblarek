import { Card, ICard } from "./Card";
import { ensureElement } from "../../utils/utils";
import { categoryMap, CDN_URL } from "../../utils/constants";

interface ICardAction {
  onClick?: (event: MouseEvent) => void;
}

export interface IGalleryCard extends ICard {
  category: string;
  image: string;
}

export class GalleryCard extends Card {
  protected categoryCard: HTMLElement;
  protected imageCard: HTMLImageElement;

  constructor(container: HTMLElement, action?: ICardAction) {
    super(container);

    this.categoryCard = ensureElement<HTMLElement>(
      ".card__category",
      this.container
    );
    this.imageCard = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );
    
    if (action?.onClick) {
      this.container.addEventListener("click", action.onClick);
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
    this.setImage(this.imageCard, CDN_URL + value, this.title);
  }
}
