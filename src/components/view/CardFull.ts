import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";
import { IEvents } from "../base/Events";

export interface ICardFull {
  categoryCard: string;
  titleCard: string;
  imagePathCard: string;
  priceCard: number;
  descriptionCard: string;
}

export class CardFull extends Card {
  protected btnBuy: HTMLButtonElement;
  category: string;
  imagePath: string;
  description: string;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.btnBuy = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container
    );
    this.category = "";
    this.imagePath = "";
    this.description = "";
    
    this.btnBuy.addEventListener("click", () => {
      this.events.emit("basket:check");
    });
  }

  set categoryCard(value: string) {
    this.category = value;
  }

  set imagePathCard(value: string) {
    this.imagePath = value;
  }

    set descriptionCard (value: string) {
    this.description = value;
  }
}
