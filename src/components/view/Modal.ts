import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected modalContent: HTMLElement;
  protected btnClose: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.modalContent = ensureElement<HTMLElement>(
      ".modal__content",
      this.container
    );
    this.btnClose = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container
    );

    this.btnClose.addEventListener("click", () => {
      this.events.emit("modal:close");
    });

    this.container.addEventListener("click", (event: MouseEvent) => {
      if (event.target === this.container) {
        this.events.emit("modal:close");
      }
    });
  }
  set content(item: HTMLElement) {
    this.modalContent.append(item);
  }

  clear():void {
    this.modalContent.innerHTML = "";
  }

  open():void {
    this.container.classList.add("modal_active");
  }

  close():void {
    this.container.classList.remove("modal_active");
  }
}
