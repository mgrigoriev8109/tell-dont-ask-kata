import OrderItem from './OrderItem';
import { OrderStatus } from './OrderStatus';

class Order {
  constructor(total: number = 0, currency: string = 'EUR', items: OrderItem[] = [], 
  tax: number = 0, status: OrderStatus = OrderStatus.CREATED, id: number = 0) {
    this.total = total;
    this.currency = currency;
    this.items = items;
    this.tax = tax;
    this.status =status;
    this.id = id;
  }

  total: number;
  currency: string;
  items: OrderItem[];
  tax: number;
  status: OrderStatus;
  id: number;

  public getTax(): number {
    return this.tax;
  }

  public getStatus(): OrderStatus {
      return this.status;
  }

  public setStatus(status: OrderStatus): void {
      this.status = status;
  }

  public setId(id: number): void {
      this.id = id;
  }
}

export default Order;

