export type MilestoneDifficulty = 'Intermediate' | 'Advanced' | 'Production-Ready';

export type CalloutType = 'production-caveat' | 'interview-tip' | 'debugging-practice';

export interface DataEngineeringPhase {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  tagline: string;
  readTime: string;
  difficulty: MilestoneDifficulty;
  tools: string[];
  summary: string;
  learningObjectives: string[];
}

export interface EcommerceTransactionEvent {
  event_id: string;
  order_id: string;
  customer_id: string;
  customer_segment: 'Enterprise' | 'Retail' | 'VIP';
  product_sku: string;
  category: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  payment_method: 'CreditCard' | 'UPI' | 'PayPal' | 'Crypto';
  country_code: string;
  event_timestamp: string;
  device_type: 'Mobile' | 'Desktop' | 'Tablet';
  is_fraud_flagged: boolean;
}

export interface PipelineMetric {
  metric: string;
  bronzeRaw: string;
  silverClean: string;
  goldAggregated: string;
  sloTarget: string;
}
