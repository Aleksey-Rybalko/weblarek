import { IBuyer, IPayment } from "../../types/index.ts";
import { IEvents } from "../base/Events.ts";

export class Buyer {
  private _buyer: IBuyer = {
    payment: undefined,
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
      payment: undefined,
      email: "",
      phone: "",
      address: "",
    };
  }

  getvalidation(): {
    payment: string;
    address: string;
    phone: string;
    email: string;
  } {
    const validationResult: {
      payment: string;
      address: string;
      phone: string;
      email: string;
    } = {
      payment: "",
      address: "",
      phone: "",
      email: "",
    };

    this._buyer.email === ""
      ? (validationResult.email = "Не задан Email")
      : (validationResult.email = "");
    this._buyer.address === ""
      ? (validationResult.address = "Не задан Адрес")
      : (validationResult.address = "");
    this._buyer.phone === ""
      ? (validationResult.phone = "Не задан Телефон")
      : (validationResult.phone = "");
    this._buyer.payment === undefined
      ? (validationResult.payment = "Не выбран тип оплаты")
      : (validationResult.payment = "");

    return validationResult;
  }
}

export interface BuyerValidationObj {
  parameter: string; 
}

export class BuyerWhithEvent extends Buyer {
  constructor(private events: IEvents) {
    super();
  }

  setBuyerAddress(address: string): void {
    super.setBuyerAddress(address);
    const validationObj: BuyerValidationObj = { parameter: 'address' };
    this.events.emit("buyer:changed", validationObj);
  }

  setBuyerEmail(email: string): void {
    super.setBuyerEmail(email);
    const validationObj: BuyerValidationObj = { parameter: 'email' };
    this.events.emit("buyer:changed", validationObj);
  }

  setBuyerPhone(phone: string): void {
    super.setBuyerPhone(phone);
    const validationObj: BuyerValidationObj = { parameter: 'phone' };
    this.events.emit("buyer:changed", validationObj);
  }

  setBuyerPayment(payment: IPayment): void {
    super.setBuyerPayment(payment);
    const validationObj: BuyerValidationObj = { parameter: 'payment' };
    this.events.emit("buyer:changed", validationObj);
  }
}
