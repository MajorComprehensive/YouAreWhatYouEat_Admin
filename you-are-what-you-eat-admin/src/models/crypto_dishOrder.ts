export type CryptoDishOrderStatus = '已完成' | '待处理' | '制作中';

export interface CryptoDishOrder {
  dish_order_id: string;
  order_id: string;
  dish_id: string;
  dish_name: string;
  final_payment: number;
  original_price?: number;
  dish_status: CryptoDishOrderStatus;
}

export interface summary {
  total_price: number;
}

export interface CryptoAllDishOrder {
  data: CryptoDishOrder[];
  summary: summary;
}
