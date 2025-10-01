import "./scss/styles.scss";
import "./components/models/BasketModel.ts";
import "./components/models/Buyer.ts";
import "./components/models/ProductCatalog.ts";
import { EventsProductCatalog } from "./components/models/ProductCatalog.ts";
import { BasketModelWhithEvents } from "./components/models/BasketModel.ts";
import { Basket } from "./components/view/Basket.ts";
import { IPayment, IProduct } from "./types/index.ts";
import { CommunicationLayout } from "./components/communication/Layout.ts";
import { Api } from "./components/base/Api.ts";
import { API_URL } from "../src/utils/constants.ts";
import { Header } from "./components/view/Header.ts";
import { EventEmitter } from "./components/base/Events.ts";
import { Modal } from "./components/view/Modal.ts";
import { GalleryCard } from "./components/view/GalleryCard.ts";
import { Gallery } from "./components/view/Gallery.ts";
import { cloneTemplate, createElement } from "./utils/utils.ts";
import { OrderSuccess } from "./components/view/Order-success.ts";
import { CardFull } from "./components/view/CardFull.ts";
import { CardBasket } from "./components/view/CardBasket.ts";
import { FormOrderSalary } from "./components/view/FormOrderSalary.ts";
import { BuyerWhithEvent } from "./components/models/Buyer.ts";
import { FormOrderContact } from "./components/view/FormOrderContact.ts";
import { IOrder } from "./types/index.ts";

const gallery = document.getElementById("gallery") as HTMLElement;
const productApi = new Api(API_URL);
const communication = new CommunicationLayout(productApi);
const events = new EventEmitter();
const modalElement = document.getElementById("modal-container") as HTMLElement;
const headerElement = document.querySelector(".header") as HTMLElement;
const header = new Header(events, headerElement);
const modal = new Modal(events, modalElement);
const successTemplate = document.getElementById(
  "success"
) as HTMLTemplateElement;
const successContent = successTemplate.content.cloneNode(
  true
) as DocumentFragment;
const successElement = successContent.firstElementChild as HTMLElement;
const orderSuccess = new OrderSuccess(events, successElement);
const pageGallery = new Gallery(gallery);
const basketModel = new BasketModelWhithEvents(events);
const cardGalleryTemplate = document.getElementById(
  "card-catalog"
) as HTMLTemplateElement;

const productsList = new EventsProductCatalog(events);
const fullCardContainer = document.getElementById(
  "card-preview"
) as HTMLTemplateElement;
const basketTemplate = document.getElementById("basket") as HTMLTemplateElement;
const basketTemplateClone = cloneTemplate(basketTemplate);
const basket = new Basket(events, basketTemplateClone);
const cardBasketTemplate = document.getElementById(
  "card-basket"
) as HTMLTemplateElement;
const containerFormOrderSalary = document.getElementById(
  "order"
) as HTMLTemplateElement;
const containerFormOrderSalaryClone = cloneTemplate(containerFormOrderSalary);
const containerFormContact = document.getElementById(
  "contacts"
) as HTMLTemplateElement;
const containerFormContactClone = cloneTemplate(containerFormContact);
const formOrderSalary = new FormOrderSalary(
  containerFormOrderSalaryClone,
  events
);
const buyer = new BuyerWhithEvent(events);

communication
  .getProductList()
  .then((response) => {
    productsList.setProductArray(response.items);
  })
  .catch((error) => {
    console.error("Ошибка:", error);
  });

events.on("modal:close", () => {
  modalElement.classList.remove("modal_active");
  header.counter = basketModel.getCount();
  modal.clear();
});


events.on("products:changed", () => {
  pageGallery.clear();
  productsList.getProductArray().forEach((item) => {
    const cardTemplateClone = cloneTemplate(cardGalleryTemplate);
    const cardGallery = new GalleryCard(cardTemplateClone, {
      onClick: () => {
        events.emit("card:select", item);
      },
    });
    pageGallery.addItem(cardGallery.render(item));
  });
});

events.on("card:select", (item) => {
  modal.clear();
  const isInBasket: boolean =  "id" in item && !basketModel.hasProduct(String(item.id));
  const fullCardTemplate = cloneTemplate(fullCardContainer);
  const fullCard = new CardFull(fullCardTemplate, {
    onClick: () => {
      if (isInBasket) {
        events.emit("basket:addProduct", item);
      } else {
        events.emit("basket:removeProductFromCard", item);
      }
    },
  });
  fullCard.namingBtn = isInBasket ? "Купить" : "Удалить из корзины";
  if ("price" in item && item.price === null) fullCard.deactivationBtn();
  modalElement.classList.add("modal_active");
  modal.content = fullCard.render(item);
});

events.on("basket:addProduct", (item) => {
  basketModel.setProductInBasket(item as IProduct);
});

events.on("basket:removeProductFromCard", (item) => {
  basketModel.deleteProductFromCard(item as IProduct);
});

events.on("basket:removeProductFromBasket", (item) => {
  basketModel.deleteProductFromBasket(item as IProduct);
});

events.on("basket:changed", () => {
  basket.clear();
  modal.clear();
  basket.totalCost = basketModel.getCost();
  if (basketModel.getCount() === 0) {
    const basketclear = createElement("div");
    basketclear.innerHTML = "корзина пуста";
    basket.contentAdd = basketclear;
    basket.deactivationBtn = true;
  } else {
    let indexProduct: number = 0;
    basketModel.getProductArrayBasket().forEach((item) => {
      const cardBasketTemplateClone = cloneTemplate(cardBasketTemplate);
      const cardBasket = new CardBasket(cardBasketTemplateClone, {
        onClick: () => {
          events.emit("basket:removeProductFromBasket", item);
        },
      });
      indexProduct++;
      cardBasket.updateCardIndex = indexProduct;
      basket.contentAdd = cardBasket.render(item);
    });
    basket.deactivationBtn = false;
  }
  modalElement.classList.add("modal_active");
  modal.content = basket.render();
  header.counter = basketModel.getCount();
  
});

events.on("orderSalary:input", () => {
  modal.clear();
  formOrderSalary.clear();
  modalElement.classList.add("modal_active");
  modal.content = formOrderSalary.render();
});

events.on("order: selectPayMethod", (element: HTMLElement) => {
  const method = element.getAttribute("name") as string;
  formOrderSalary.selectedPayment = method;
  buyer.setBuyerPayment(method as IPayment);
});

events.on("order: adressChange", () => {
  buyer.setBuyerAddress(formOrderSalary.addresOrder);
});

events.on("validationSalary:start", () => {
  if (!buyer.getvalidation().payment && buyer.getvalidation().address === "") {
    formOrderSalary.statusBtnNext(false);
    formOrderSalary.errors =
      buyer.getvalidation().payment + buyer.getvalidation().address;
  } else {
    formOrderSalary.errors =
      buyer.getvalidation().payment + buyer.getvalidation().address;
    formOrderSalary.statusBtnNext(true);
  }
});

const formOrderContact = new FormOrderContact(
  containerFormContactClone,
  events
);

events.on("orderContact:input", () => {
  modal.clear();
  modalElement.classList.add("modal_active");
  modal.content = formOrderContact.render();
});

events.on("order:emailChange", () => {
  buyer.setBuyerEmail(formOrderContact.email);
});

events.on("order:phoneChange", () => {
  buyer.setBuyerPhone(formOrderContact.phone);
});

events.on("validationContact:start", () => {
  if (
    buyer.getvalidation().email === "" &&
    buyer.getvalidation().phone === ""
  ) {
    formOrderContact.statusbtnPay(false);
    formOrderContact.errors = "";
  } else {
    formOrderContact.errors =
      buyer.getvalidation().email + buyer.getvalidation().phone;
    formOrderContact.statusbtnPay(true);
  }
});

events.on("order:pay", async () => {
  try {
    if (buyer.getBuyer !== undefined) {
      const orderData: IOrder = {
        payment: buyer.getBuyer.payment,
        email: buyer.getBuyer.email,
        phone: buyer.getBuyer.phone,
        address: buyer.getBuyer.address,
        total: basketModel.getCost(),
        items: basketModel.getProductArrayBasket().map((product) => product.id),
      };
      await communication.postOrder(orderData).then((res) => {
        if (res) {
          orderSuccess.totalCost = res.total;
          basketModel.clearBasket();
          modalElement.classList.add("modal_active");
          modal.content = orderSuccess.render();
          buyer.clearData();
          
          formOrderContact.clear();
        } else {
          throw new Error("Пустой ответ от сервера");
        }
      });
    }
  } catch (error) {
    console.error("Ошибка при оформлении заказа:", error);
  }
});
