import Category from '../../src/domain/Category';
import Order from '../../src/domain/Order';
import { OrderStatus } from '../../src/domain/OrderStatus';
import Product from '../../src/domain/Product';
import { ProductCatalog } from '../../src/repository/ProductCatalog';
import OrderCreationUseCase from '../../src/useCase/OrderCreationUseCase';
import SellItemRequest from '../../src/useCase/SellItemRequest';
import SellItemsRequest from '../../src/useCase/SellItemsRequest';
import UnknownProductException from '../../src/useCase/UnknownProductException';
import InMemoryProductCatalog from '../doubles/InMemoryProductCatalog';
import TestOrderRepository from '../doubles/TestOrderRepository';

describe('OrderApprovalUseCase', () => {
  const orderRepository: TestOrderRepository = new TestOrderRepository();
  let food: Category = new Category('food', 10);


  const saladProduct = new Product();
  saladProduct.setName('salad');
  saladProduct.setPrice(3.56);
  saladProduct.setCategory(food);
  const tomatoProduct = new Product();
  tomatoProduct.setName('tomato');
  tomatoProduct.setPrice(4.65);
  tomatoProduct.setCategory(food);
  const productCatalog: ProductCatalog = new InMemoryProductCatalog([ saladProduct, tomatoProduct]);
  const useCase: OrderCreationUseCase = new OrderCreationUseCase(orderRepository, productCatalog);

  it('sellMultipleItems', () => {
      let saladRequest: SellItemRequest = new SellItemRequest();
      saladRequest.setProductName('salad');
      saladRequest.setQuantity(2);

      let tomatoRequest: SellItemRequest = new SellItemRequest();
      tomatoRequest.setProductName('tomato');
      tomatoRequest.setQuantity(3);

      let request: SellItemsRequest = new SellItemsRequest();
      request.setRequests([]);
      request.getRequests().push(saladRequest);
      request.getRequests().push(tomatoRequest);

      useCase.run(request);

      const insertedOrder: Order = orderRepository.getSavedOrder();
      expect(insertedOrder.status).toBe(OrderStatus.CREATED);
      expect(insertedOrder.total).toBe(23.20);
      expect(insertedOrder.tax).toBe((2.13));
      expect(insertedOrder.currency).toBe(('EUR'));
      expect(insertedOrder.items.length).toBe(2);
      expect(insertedOrder.items[0].getProduct().getName()).toBe('salad');
      expect(insertedOrder.items[0].getProduct().getPrice()).toBe(3.56);
      expect(insertedOrder.items[0].getQuantity()).toBe(2);
      expect(insertedOrder.items[0].getTaxedAmount()).toBe(7.84);
      expect(insertedOrder.items[0].getTax()).toBe(0.72);
      expect(insertedOrder.items[1].getProduct().getName()).toBe('tomato');
      expect(insertedOrder.items[1].getProduct().getPrice()).toBe(4.65);
      expect(insertedOrder.items[1].getQuantity()).toBe(3);
      expect(insertedOrder.items[1].getTaxedAmount()).toBe(15.36);
      expect(insertedOrder.items[1].getTax()).toBe(1.41);
  });

  it('unknownProduct', () => {
      let request: SellItemsRequest = new SellItemsRequest();
      request.setRequests([]);
      let unknownProductRequest: SellItemRequest = new SellItemRequest();
      unknownProductRequest.setProductName('unknown product');
      request.getRequests().push(unknownProductRequest);

      expect(() => useCase.run(request)).toThrow(UnknownProductException);
  });
});
