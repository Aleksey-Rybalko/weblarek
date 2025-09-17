import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    protected modalContent: HTMLElement;
    protected btnClose: HTMLButtonElement;


    constructor(protected events: IEvents, container: HTMLElement){
        super(container);

        this.modalContent = ensureElement<HTMLElement>('.modal__container', this.container);
        this.btnClose = ensureElement<HTMLButtonElement>('.modal__close', this.container);

        this.btnClose.addEventListener('click',() => {
            this.events.emit('modal:close');
        })
    }
    set content (item: HTMLElement) {
        this.modalContent.append(item);
    }
}