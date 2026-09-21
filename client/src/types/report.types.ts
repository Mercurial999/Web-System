export interface ReportDateRange {
  from?: string;
  to?: string;
}

export interface SalesReportSummary {
  completedSales: number;
  totalQuantitySold: number;
  totalSales: number | string;
}

export interface SalesReportItem {
  product: string;
  quantity: number;
  unit: string;
  unitPrice: number | null;
  subtotal: number | null;
}

export interface SalesDetailReport {
  deliveryId: number;
  orderId: number;
  deliveryDate: string;
  customer: string;
  status: string;
  items: SalesReportItem[];
  total: number;
}

export interface ProductSalesReport {
  product: string;
  unit: string;
  quantitySold: number;
  totalSales: number;
}

export interface CustomerSalesReport {
  customer: string;
  completedDeliveries: number;
  quantitySold: number;
  totalSales: number;
}

export interface InventoryReport {
  product: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
}

export interface StockMovementReport {
  id: number;
  product: string;
  unit: string;
  type: string;
  reason: string;
  quantity: number;
  reference: string | null;
  notes: string | null;
  createdAt: string;
}

export interface DeliveryReport {
  deliveryId: number;
  orderId: number;
  deliveryDate: string;
  customer: string;
  status: string;
  items: SalesReportItem[];
  total: number;
}