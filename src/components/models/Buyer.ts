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

export class BuyerWhithEvent extends Buyer {
  constructor(private events: IEvents) {
    super();
  }

  setBuyerAddress(address: string): void {
    super.setBuyerAddress(address);
    this.events.emit("validationSalary:start");
  }

  setBuyerEmail(email: string): void {
    super.setBuyerEmail(email);
    this.events.emit("validationContact:start");
  }

  setBuyerPhone(phone: string): void {
    super.setBuyerPhone(phone);
    this.events.emit("validationContact:start");
  }

  setBuyerPayment(payment: IPayment): void {
    super.setBuyerPayment(payment);
    this.events.emit("validationSalary:start");
  }
}
