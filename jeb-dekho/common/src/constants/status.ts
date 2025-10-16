export const ORDER_STATUS_LABELS = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  PREPARING: 'Preparing',
  READY: 'Ready for Pickup',
  PICKED_UP: 'Picked Up',
  IN_TRANSIT: 'In Transit',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded'
} as const;

export const PAYMENT_STATUS_LABELS = {
  PENDING: 'Payment Pending',
  PROCESSING: 'Processing Payment',
  SUCCESS: 'Payment Successful',
  FAILED: 'Payment Failed',
  REFUNDED: 'Payment Refunded'
} as const;

export const USER_STATUS_LABELS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  SUSPENDED: 'Suspended',
  PENDING_VERIFICATION: 'Pending Verification'
} as const;

export const VEHICLE_TYPE_LABELS = {
  BIKE: 'Bike',
  CAR: 'Car',
  AUTO: 'Auto Rickshaw',
  CYCLE: 'Bicycle'
} as const;

export const SERVICE_TYPE_LABELS = {
  TRANSPORT: 'Transport',
  FOOD: 'Food Delivery',
  MART: 'Mart'
} as const;