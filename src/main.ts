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
import { cloneTemplate } from "./utils/utils.ts";
import { OrderSuccess } from "./components/view/Order-success.ts";
import { CardFull } from "./components/view/CardFull.ts";
import { CardBasket } from "./components/view/CardBasket.ts";
import { FormOrderSalary, PayMethodObj } from "./components/view/FormOrderSalary.ts";
import { BuyerWhithEvent, BuyerValidationObj } from "./components/models/Buyer.ts";
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
  modal.clear();
  modal.close();
});


events.on("products:changed", () => {
  pageGallery.clear();
  productsList.getProductArray().forEach((item) => {
    const cardTemplateClone = cloneTemplate(cardGalleryTemplate);
    const cardGallery = new GalleryCard(cardTemplateClone, {
      onClick: () => {
        productsList.setActiveProduct(item);
      },
    });
    pageGallery.addItem(cardGallery.render(item));
  });
});

events.on("card:select", (item) => {
modal.clear();
  const activeProduct = productsList.getActiveProduct();
   if (!activeProduct) return;
  const isInBasket: boolean =  basketModel.hasProduct(activeProduct.id);
  const isAvailable = activeProduct.price !== null;
  const fullCardTemplate = cloneTemplate(fullCardContainer);
  const fullCard = new CardFull(fullCardTemplate, {
    onClick: () => {
      if (isAvailable) {
        if (!isInBasket) {
          events.emit("basket:addProduct", activeProduct);
          events.emit("modal:close");
        } else {
          events.emit("basket:removeProduct", activeProduct);
          events.emit("modal:close");
        }
      }
    },
  });
  fullCard.namingBtn = !isInBasket ? "Купить" : "Удалить из корзины";
  if (!isAvailable) fullCard.deactivationBtn();
  modal.open();
  modal.content = fullCard.render(item);
});


events.on("basket:addProduct", (item) => {
  basketModel.setProductInBasket(item as IProduct);
});

events.on("basket:removeProduct", (item) => {
  basketModel.deleteProductFromBasket(item as IProduct);
});

events.on("basket:changed", () => {
  basket.clear();
  basket.totalCost = basketModel.getCost();
  if (basketModel.getCount() === 0) {
    basket.contentAdd = basket.getEmptyBasket();
    basket.deactivationBtn = true;
  } else {
    basketModel.getProductArrayBasket().map((item, indexProduct) => {
      const cardBasketTemplateClone = cloneTemplate(cardBasketTemplate);
      const cardBasket = new CardBasket(cardBasketTemplateClone, {
        onClick: () => {
          events.emit("basket:removeProduct", item);
        },
      });
      cardBasket.updateCardIndex = indexProduct + 1;
      basket.contentAdd = cardBasket.render(item);
    });
    basket.deactivationBtn = false;
  }
  header.counter = basketModel.getCount();
});

events.on("basket:open", () => {
  modal.clear();
  modal.open();
  modal.content = basket.render();
});

events.on("modalSalary:open", () => {
  modal.clear();
  modal.open();
  modal.content = formOrderSalary.render();
});


events.on("buyer:changed", (validationParameter:BuyerValidationObj) => {
  const validationResult = buyer.getvalidation();
  if (validationParameter.parameter === 'address' || validationParameter.parameter === 'payment') {
    formOrderSalary.errors =
      validationResult.payment +' '+ validationResult.address;
  if (!validationResult.payment && validationResult.address === "") 
    formOrderSalary.statusDisabledBtnNext(false);
    else formOrderSalary.statusDisabledBtnNext(true);
  } else{
    formOrderContact.errors =
      validationResult.email +' '+ validationResult.phone;
  if (
    validationResult.email === "" &&
    validationResult.phone === ""
  ) 
    formOrderContact.statusDisabledbtnPay(false);
   else     
    formOrderContact.statusDisabledbtnPay(true);
  }
});

events.on("order:selectPayMethod", (payMethod: PayMethodObj) => {
  formOrderSalary.selectedPayment = payMethod.method as string;
  buyer.setBuyerPayment(payMethod.method as IPayment);
  console.log(buyer.getBuyer)
});

events.on("order:adressChange", () => {
  buyer.setBuyerAddress(formOrderSalary.addresOrder);
});

const formOrderContact = new FormOrderContact(
  containerFormContactClone,
  events
);

events.on("modalContact:open", () => {
  modal.clear();
  modal.open();
  modal.content = formOrderContact.render();
});

events.on("order:emailChange", () => {
  buyer.setBuyerEmail(formOrderContact.email);
});

events.on("order:phoneChange", () => {
  buyer.setBuyerPhone(formOrderContact.phone);
});

events.on("order:pay", async () => {
  console.log(buyer.getBuyer);
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
          modal.clear();
          modal.open();
          modal.content = orderSuccess.render();
          buyer.clearData();
          formOrderContact.clear();
          formOrderSalary.clear();
        } else {
          throw new Error("Пустой ответ от сервера");
        }
      });
    }
  } catch (error) {
    console.error("Ошибка при оформлении заказа:", error);
  }
});

