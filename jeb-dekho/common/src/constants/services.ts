export const TRANSPORT_SERVICES = [
  { id: 'taxi', name: 'Taxi', icon: 'taxi' },
  { id: 'bike', name: 'Bike Ride', icon: 'motorcycle' },
  { id: 'auto', name: 'Auto Rickshaw', icon: 'auto_rickshaw' },
  { id: 'outstation', name: 'Outstation', icon: 'route' }
] as const;

export const FOOD_CATEGORIES = [
  { id: 'north_indian', name: 'North Indian' },
  { id: 'south_indian', name: 'South Indian' },
  { id: 'chinese', name: 'Chinese' },
  { id: 'continental', name: 'Continental' },
  { id: 'fast_food', name: 'Fast Food' },
  { id: 'desserts', name: 'Desserts' },
  { id: 'beverages', name: 'Beverages' }
] as const;

export const MART_CATEGORIES = [
  { id: 'grocery', name: 'Grocery' },
  { id: 'fruits_vegetables', name: 'Fruits & Vegetables' },
  { id: 'dairy', name: 'Dairy Products' },
  { id: 'personal_care', name: 'Personal Care' },
  { id: 'household', name: 'Household Essentials' },
  { id: 'pharmacy', name: 'Pharmacy' },
  { id: 'electronics', name: 'Electronics' }
] as const;

export const DELIVERY_TIME_SLOTS = [
  { id: 'morning', name: 'Morning', start: '06:00', end: '12:00' },
  { id: 'afternoon', name: 'Afternoon', start: '12:00', end: '18:00' },
  { id: 'evening', name: 'Evening', start: '18:00', end: '22:00' }
] as const;