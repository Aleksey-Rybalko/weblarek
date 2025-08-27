import "./scss/styles.scss";
import "./components/models/Basket.ts";
import "./components/models/Buyer.ts";
import "./components/models/ProductCatalog.ts";
import { apiProducts } from "./utils/data.ts";
import { ProductCatalog } from "./components/models/ProductCatalog.ts";
import { Basket } from "./components/models/Basket.ts";
import { Buyer } from "./components/models/Buyer.ts";
import { IGetProducts } from "./types/index.ts";
import { CommunicationLayout } from "./components/communication/Layout.ts";
import { Api } from "./components/base/Api.ts";
import { API_URL } from "../src/utils/constants.ts";

const productsModel = new ProductCatalog();
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
  });
