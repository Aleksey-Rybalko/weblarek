import "./scss/styles.scss";
import "./components/models/Basket.ts";
import "./components/models/Buyer.ts";
import "./components/models/ProductCatalog.ts";
import { ProductCatalog } from "./components/models/ProductCatalog.ts";
import { Basket } from "./components/models/Basket.ts";
import { Buyer } from "./components/models/Buyer.ts";
import { IGetProducts, IProduct } from "./types/index.ts";
import { CommunicationLayout } from "./components/communication/Layout.ts";
import { Api } from "./components/base/Api.ts";
import { API_URL, CDN_URL, categoryMap } from "../src/utils/constants.ts";
import { Header, IHeader } from "./components/view/Header.ts";
import { EventEmitter } from "./components/base/Events.ts";
import { Modal } from "./components/view/Modal.ts";
import { GalleryCard } from "./components/view/GalleryCard.ts";
import { Gallery } from "./components/view/Gallery.ts";
import { cloneTemplate, createElement } from "./utils/utils.ts";
import { OrderSuccess } from "./components/view/Order-success.ts";
import { Card } from "./components/view/Card.ts";

/*const productsModel = new ProductCatalog();
productsModel.setProductArray(apiProducts.items);
console.log("Массив товаров из каталога: ", productsModel.getProductArray());
console.log(
  "Поиск по id: ",
  productsModel.getProduct("b06cde61-912f-4663-9751-09956c0eed67")
);
productsModel.setActiveProduct(apiProducts.items[3]);
console.log(
  "Получение товара для подробного отображения: ",
  productsModel.getActiveProduct()
);

const itemsBasket = new Basket();
itemsBasket.setProductInBasket(apiProducts.items[3]);
itemsBasket.setProductInBasket(apiProducts.items[1]);
console.log(
  "Получение товаров находящихся в корзине: ",
  itemsBasket.getProductArrayBasket()
);
itemsBasket.deleteProductFromBasket(apiProducts.items[1]);
console.log(
  "Получение товаров находящихся в корзине: ",
  itemsBasket.getProductArrayBasket()
);
itemsBasket.setProductInBasket(apiProducts.items[1]);
console.log(
  "Получение стоимости всех товаров в корзине: ",
  itemsBasket.getCost()
);
console.log("Получение количества товаров корзины: ", itemsBasket.getCount());
console.log(
  "Поиск товара в корзине по id: ",
  itemsBasket.hasProduct("c101ab44-ed99-4a54-990d-47aa2bb4e7d9")
);
console.log(
  "Поиск товара в корзине по id: ",
  itemsBasket.hasProduct("b06cde61-912f-4663-9751-09956c0eed67")
);
itemsBasket.clearBasket();
console.log(
  "Получение товаров находящихся в корзине: ",
  itemsBasket.getProductArrayBasket()
);

const shopper = new Buyer();
shopper.setBuyerAddress("МО, г.Бронницы, ул. Жуковского, д 11а, кв 88");
console.log("Получение Адреса доставки: ", shopper.getBuyer?.address);
shopper.setBuyerEmail("123@gmail.com");
console.log("Получение адреса электронной почты: ", shopper.getBuyer?.email);
console.log("Результат валидации: ", shopper.validation());
shopper.setBuyerPhone("+79180000000");
console.log("Получение телефонного номера: ", shopper.getBuyer?.phone);
shopper.setBuyerPayment("Online");
console.log("Получение формы оплаты: ", shopper.getBuyer?.payment);
console.log("Результат валидации: ", shopper.validation());
console.log("Получение телефонного номера: ", shopper.getBuyer?.phone);
shopper.clearData();

const productsList = new ProductCatalog();
const productApi = new Api(API_URL);
const communication = new CommunicationLayout(productApi);

console.log("Получение товаров с сервера ");
communication
  .getProductList()
  .then((response: IGetProducts) => {
    productsList.setProductArray(response.items);
    console.log("Товары:", productsList.getProductArray());
    console.log("Всего товаров:", response.total);
  })
  .catch((error) => {
    console.error("Ошибка:", error);
  });*/

// Инициализация приложения

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

header.counter = 5;

//тестирование открытия корзины
/*events.on('basket:open', () => {
        modalElement.classList.add('modal_active');
        const modalcont = createElement('div');
        modalcont.innerHTML = '<div> Проверка выполнена </div>';
        modal.content = modalcont;
    })*/

events.on("modal:close", () => {
  modalElement.classList.remove("modal_active");
});

events.on("order:close", () => {
  modalElement.classList.remove("modal_active");
});

//тестирование формы завершения оформления зааза
/*
    orderSuccess.totalCost = 1250;

    events.on('basket:open', () => {
        modalElement.classList.add('modal_active');
        modal.content = orderSuccess.render();
    })*/

const cardGalleryTemplate = document.getElementById("card-catalog") as HTMLTemplateElement;


const productsList = new ProductCatalog();
communication
  .getProductList()
  .then((response) => {
    productsList.setProductArray(response.items);
    console.log(productsList.getProductArray())
    makeGalery();

  })
  .catch((error) => {
    console.error("Ошибка:", error);
  });

function makeGalery () {
  productsList.getProductArray().forEach((item) => {
    const cardTemplateClone = cardGalleryTemplate.content.cloneNode(true) as HTMLElement;
    console.log(cardTemplateClone)
    const cardGallery = new GalleryCard(cardTemplateClone, {
      onClick: () => {
        console.log("Клик сработал!");
        events.emit("card:select")
      }
    });
    pageGallery.addItem(cardGallery.render(item));
  });
}

events.on("card:select", (item) => {
  console.log('card:select', item);
  modalElement.classList.add('modal_active');
})


