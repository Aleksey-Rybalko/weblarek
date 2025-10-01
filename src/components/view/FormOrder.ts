import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface IFormOrderView {
  submitDisabled: boolean;
  errors: string;
}

export class FormOrder extends Component<IFormOrderView> {
  protected errorsContainer: HTMLSpanElement;

  constructor(container: HTMLElement) {
    super(container);

    this.errorsContainer = ensureElement<HTMLSpanElement>(
      ".form__errors",
      this.container
    );
  }

  set errors(message: string) {
    this.errorsContainer.textContent = message;
  }
}
