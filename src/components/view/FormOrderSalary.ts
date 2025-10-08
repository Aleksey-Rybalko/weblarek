import { FormOrder } from "./FormOrder";
import { IEvents } from "../base/Events";
import { ensureElement, ensureAllElements } from "../../utils/utils";
import { IPayment } from "../../types";

export interface PayMethodObj {
  method: IPayment; 
}

export class FormOrderSalary extends FormOrder {
  private paymentButtons: HTMLButtonElement[];
  private adressInput: HTMLInputElement;
  private btnNext: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.paymentButtons = ensureAllElements<HTMLButtonElement>(
      ".button_alt",
      this.container
    );
    this.adressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container
    );
    this.btnNext = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container
    );

    this.paymentButtons.forEach((button) => {
      {
        button.addEventListener("click", (event: Event) => {
          const element = event.currentTarget as HTMLElement;
          const methodObj:PayMethodObj = {method: element.getAttribute("name") as IPayment};
          events.emit(
            "order:selectPayMethod",
             methodObj
          );
        });
      }
    });

    

    this.adressInput.addEventListener("input", () => {
      events.emit("order:adressChange", this.container);
    });

    this.btnNext.addEventListener("click", (event) => {
      event?.preventDefault();
      events.emit("modalContact:open", this.container);
    });
  }

  set selectedPayment(method: string) {
    this.paymentButtons.forEach((button) => {
      if (button.name === method) {
        button.classList.add("button_alt-active");
        button.classList.remove("button_alt");
      } else {
        button.classList.remove("button_alt-active");
        button.classList.add("button_alt");
      }
    });
  }

  get addresOrder(): string {
    return this.adressInput.value;
  }

  set adressValid(error: string) {
    this.errorsContainer.textContent = error;
  }

  statusDisabledBtnNext(value: boolean): void {
    this.btnNext.disabled = value;
  }

  clear(): void {
    this.paymentButtons.forEach((button) => {
      button.classList.remove("button_alt-active");
      button.classList.add("button_alt");
    });
    this.adressInput.value = "";
    this.statusDisabledBtnNext(true);
  }
}
