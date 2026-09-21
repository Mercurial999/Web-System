import { apiRequest } from "../lib/api";
import type {
  CustomerSalesReport,
  DeliveryReport,
  InventoryReport,
  ProductSalesReport,
  ReportDateRange,
  SalesDetailReport,
  SalesReportSummary,
  StockMovementReport,
} from "../types/report.types";

function queryString({ from, to }: ReportDateRange = {}): string {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const value = params.toString();
  return value ? `?${value}` : "";
}

async function getReport<T>(endpoint: string, dates?: ReportDateRange): Promise<T> {
  const response = await apiRequest<{ data: T }>(`${endpoint}${queryString(dates)}`);
  return response.data;
}

export function getSalesReportSummary(dates?: ReportDateRange) {
  return getReport<SalesReportSummary>("/reports/sales/summary", dates);
}

export function getSalesDetails(dates?: ReportDateRange) {
  return getReport<SalesDetailReport[]>("/reports/sales/details", dates);
}

export function getProductSales(dates?: ReportDateRange) {
  return getReport<ProductSalesReport[]>("/reports/sales/products", dates);
}

export function getCustomerSales(dates?: ReportDateRange) {
  return getReport<CustomerSalesReport[]>("/reports/sales/customers", dates);
}

export function getInventoryReport() {
  return getReport<InventoryReport[]>("/reports/inventory");
}

export function getStockMovementReport(dates?: ReportDateRange) {
  return getReport<StockMovementReport[]>("/reports/stock-movements", dates);
}

export function getDeliveryReport(dates?: ReportDateRange) {
  return getReport<DeliveryReport[]>("/reports/deliveries", dates);
}