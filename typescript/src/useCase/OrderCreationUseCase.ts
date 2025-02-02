import Order from '../domain/Order';
import OrderItem from '../domain/OrderItem';
import { OrderStatus } from '../domain/OrderStatus';
import Product from '../domain/Product';
import OrderRepository from '../repository/OrderRepository';
import { ProductCatalog } from '../repository/ProductCatalog';
import SellItemsRequest from './SellItemsRequest';
import UnknownProductException from './UnknownProductException';

class OrderCreationUseCase {
  private readonly orderRepository: OrderRepository;
  private readonly productCatalog: ProductCatalog;

  public constructor(orderRepository: OrderRepository, productCatalog: ProductCatalog) {
    this.orderRepository = orderRepository;
    this.productCatalog = productCatalog;
  }

  public run(request: SellItemsRequest): void {
    const order: Order = new Order();
    order.status = OrderStatus.CREATED;

    for (const itemRequest of request.getRequests()) {
       const product: Product = this.productCatalog.getByName(itemRequest.getProductName());

      if (product === undefined) {
        throw new UnknownProductException();
      }
      else {
        const unitaryTax: number = Math.round(product.getPrice() / 100 * product.getCategory().taxPercentage * 100) / 100;
        const unitaryTaxedAmount: number = Math.round((product.getPrice() + unitaryTax) * 100) / 100;
        const taxedAmount: number = Math.round(unitaryTaxedAmount * itemRequest.getQuantity() * 100) / 100;
        const taxAmount: number = unitaryTax * itemRequest.getQuantity();

        const orderItem: OrderItem = new OrderItem();
        orderItem.setProduct(product);
        orderItem.setQuantity(itemRequest.getQuantity());
        orderItem.setTax(taxAmount);
        orderItem.setTaxedAmount(taxedAmount);
        order.items.push(orderItem);

        order.total = (order.total + taxedAmount);
        order.tax = (order.getTax() + taxAmount);
      }
    }

    this.orderRepository.save(order);
  }
}

export default OrderCreationUseCase;
