import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { FormOrder } from "./FormOrder";

export class FormOrderContact extends FormOrder {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private btnPay: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container
    );
    this.btnPay = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container
    );

    this.emailInput.addEventListener("input", () => {
      events.emit("order:emailChange", this.container);
    });

    this.phoneInput.addEventListener("input", () => {
      events.emit("order:phoneChange", this.container);
    });

    this.btnPay.addEventListener("click", (event) => {
      event.preventDefault();
      events.emit("order:pay", this.container);
    });
  }

  get email(): string {
    return this.emailInput.value;
  }

  get phone(): string {
    return this.phoneInput.value;
  }

  set Valid(error: string) {
    this.errorsContainer.textContent = error;
  }

  statusbtnPay(value: boolean): void {
    this.btnPay.disabled = value;
  }

  clear(): void {
    this.emailInput.value = "";
    this.phoneInput.value = "";
  }
}
