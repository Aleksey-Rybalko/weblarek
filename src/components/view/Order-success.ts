import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IOrderSuccess {
    totalCost:number;
}

export class OrderSuccess extends Component<IOrderSuccess> {
    protected btnClose: HTMLButtonElement;
    protected costEdit: HTMLElement;


    constructor(protected events: IEvents, container: HTMLElement){
        super(container);

        this.btnClose= ensureElement<HTMLButtonElement>('.order-success__close', this.container);
        this.costEdit = ensureElement<HTMLElement>('.order-success__description', this.container);

        this.btnClose.addEventListener('click',() => {
            this.events.emit('order:close');
        })
    }

    set totalCost (value:number) {
        this.costEdit.textContent = `Списано ${String(value)} синапсов`;
    }
}