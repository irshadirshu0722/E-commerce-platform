interface Product {
  product_id: number;
  product_name: string;
  total_amount: number;
  total_quantity: number;
  total_orders: number;
}

interface AllTimeSalesOverview {
  total_customers: { value: number };
  gross_sales: { value: string };
  net_sales: { value: string };
  discounts: { value: string };
  refunds: { value: string };
  shipping: { value: string };
  orders: { value: number };
  profit: { value: string };
}

interface CustomSalesOverview {
  total_customers: { value: number; growth_rate: number; type: string };
  gross_sales: { value: string; growth_rate: number; type: string };
  net_sales: { value: string; growth_rate: number; type: string };
  discounts: { value: string; growth_rate: number; type: string };
  refunds: { value: string; growth_rate: number; type: string };
  shipping: { value: string; growth_rate: number; type: string };
  orders: { value: number; growth_rate: number; type: string };
  profit: { value: string; growth_rate: number; type: string };
}

interface TotalOrderReturn {
  labels: string[];
  data: number[];
}

interface OrderStatus {
  labels: string[];
  data: number[];
}

interface OrdersBarChart {
  labels: number[];
  data: (number | string)[];
}

interface SalesBarChart {
  labels: number[];
  data: (number | string)[];
}

export interface IStatitics {
  best_selling_products: Product[];
  all_time_sales_overview: AllTimeSalesOverview;
  custom_sales_overview: CustomSalesOverview;
  total_order_return: TotalOrderReturn;
  order_status: OrderStatus;
  orders_bar_chart: OrdersBarChart;
  sales_bar_chart: SalesBarChart;
}
