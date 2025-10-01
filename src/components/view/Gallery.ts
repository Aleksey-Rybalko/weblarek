import { Component } from "../base/Component";

export interface IGallery {
  catalog: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
  constructor(container: HTMLElement) {
    super(container);
  }

  addItem(item: HTMLElement) {
    this.container.appendChild(item);
  }

  clear() {
    this.container.innerHTML = "";
  }
}
