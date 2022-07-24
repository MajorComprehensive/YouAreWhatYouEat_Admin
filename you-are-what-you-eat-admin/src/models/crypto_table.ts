export type CryptoTableStatus = '空闲' | '占用' ;

export interface CryptoTable {
  table_id: string;
  customer_number: number;
  table_capacity: number;
  occupied: string;
}