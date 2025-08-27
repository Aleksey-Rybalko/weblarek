import {IApi, IGetProducts, IOrder, IOrderResponse} from '../../types/index.ts'

export class CommunicationLayout {
    productApi: IApi;

    constructor(productApi: IApi) {
        this.productApi = productApi;
    }

    async getProductList(): Promise<IGetProducts> {
      return this.productApi.get<IGetProducts>('/product/');
    }

    async postOrder(orderData:IOrder): Promise<IOrderResponse> {
        return this.productApi.post<IOrderResponse>('/order/', orderData, 'POST');
    }
}