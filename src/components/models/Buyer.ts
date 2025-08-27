import { IBuyer, IPayment } from "../../types/index.ts";

export class Buyer {
  private _buyer: IBuyer = {
    payment: "Online",
    email: "",
    phone: "",
    address: "",
  };

  setBuyerAddress(address: string): void {
    this._buyer.address = address;
  }

  setBuyerEmail(email: string): void {
    this._buyer.email = email;
  }

  setBuyerPhone(phone: string): void {
    this._buyer.phone = phone;
  }

  setBuyerPayment(payment: IPayment): void {
    this._buyer.payment = payment;
  }

  get getBuyer(): IBuyer | undefined {
    return this._buyer;
  }

  clearData(): void {
    this._buyer = {
      payment: "Online",
      email: "",
      phone: "",
      address: "",
    };
  }

  validation(): {
    stateValidationEmail: boolean;
    validationErrorsEmail: string;
    stateValidationPhone: boolean;
    validationErrorsPhone: string;
    stateValidationAddress: boolean;
    validationErrorsAddress: string;
    stateValidationPayment: boolean;
    validationErrorsPayment: string;
  } {
    const validationResult: {
      stateValidationEmail: boolean;
      validationErrorsEmail: string;
      stateValidationPhone: boolean;
      validationErrorsPhone: string;
      stateValidationAddress: boolean;
      validationErrorsAddress: string;
      stateValidationPayment: boolean;
      validationErrorsPayment: string;
    } = {
      stateValidationEmail: true,
      validationErrorsEmail: "",
      stateValidationPhone: true,
      validationErrorsPhone: "",
      stateValidationAddress: true,
      validationErrorsAddress: "",
      stateValidationPayment: true,
      validationErrorsPayment: "",
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex =
      /^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;

    if (
      !this._buyer.email ||
      (this._buyer.email && !emailRegex.test(this._buyer.email))
    ) {
      validationResult.stateValidationEmail = false;
      validationResult.validationErrorsEmail +=
        " email отсутствует или не соответствует формату;  ";
    }

    if (
      !this._buyer.phone ||
      (this._buyer.phone && !phoneRegex.test(this._buyer.phone))
    ) {
      validationResult.stateValidationPhone = false;
      validationResult.validationErrorsPhone +=
        " номер телефона отсутствует или не соответствует формату;  ";
    }

    if (!this._buyer.address) {
      validationResult.stateValidationAddress = false;
      validationResult.validationErrorsAddress += " адрес отсутствует;  ";
    }

    if (!this._buyer.payment) {
      validationResult.stateValidationPayment = false;
      validationResult.validationErrorsPayment += " тип оплаты не указан;  ";
    }

    return validationResult;
  }
}
