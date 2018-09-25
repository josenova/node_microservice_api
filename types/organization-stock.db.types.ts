export interface DbOrganizationStock {
  id?: string;
  stripModelId: number;
  organizationId: number;
  hcpId?: number;
  stock: number;
  lastShipmentAt: string;
  numberOfStripsReceived: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface DbOrganizationStockAdjustment {
  id?: string;
  organizationId: number;
  stripModelId: number;
  hcpId: number;
  action: string;
  lastStock: number;
  stockChange: number;
  actionPerformedAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Merge<A, B, C> {
  (x: A, y: B): C;
}