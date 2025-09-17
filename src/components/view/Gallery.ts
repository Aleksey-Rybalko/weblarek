import { Component } from "../base/Component";


export interface IGallery {
    catalog: HTMLElement[];
}

export class Gallery extends Component<IGallery> {

    constructor(container: HTMLElement){
        super(container);
    }

     addItem(item: HTMLElement) {
        const itemCopy = item.cloneNode(true) as HTMLElement;
        this.container.appendChild(itemCopy);
    }

    clear() {
        this.container.innerHTML = '';
    }
}