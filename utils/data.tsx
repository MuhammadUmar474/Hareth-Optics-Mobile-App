export const PRODUCTS = [
  {
    id: "1",
    name: "Classic Aviator",
    category: "All",
    price: 200,
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop",
  },
  {
    id: "2",
    name: "Urban Square",
    category: "All",
    price: 220,
    image:
      "https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=400&fit=crop",
  },
  {
    id: "3",
    name: "Retro Round",
    category: "All",
    price: 240,
    image:
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop",
  },
  {
    id: "4",
    name: "Sport Shield",
    category: "All",
    price: 260,
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
  },
  {
    id: "5",
    name: "Business Pro",
    category: "Men",
    price: 210,
    image:
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400&h=400&fit=crop",
  },
  {
    id: "6",
    name: "Cat Eye Chic",
    category: "Women",
    price: 230,
    image:
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=400&h=400&fit=crop",
  },
  {
    id: "7",
    name: "Junior Fun",
    category: "Kids",
    price: 180,
    image:
      "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=400&h=400&fit=crop",
  },
  {
    id: "8",
    name: "Luxury Gold",
    category: "Premium",
    price: 350,
    image:
      "https://images.unsplash.com/photo-1609010697446-11f2155278f0?w=400&h=400&fit=crop",
  },
];

export const ORDERS = [
  {
    id: "1001",
    status: "Delivered",
    date: "2025-08-01",
    items: 2,
    total: "280.00",
    products: [
      {
        id: "1",
        name: "Classic Aviator",
        image:
          "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400",
      },
      {
        id: "2",
        name: "Modern Frame",
        image:
          "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400",
      },
    ],
  },
  {
    id: "1002",
    status: "Delivered",
    date: "2025-08-01",
    items: 2,
    total: "280.00",
    products: [
      {
        id: "3",
        name: "Retro Style",
        image:
          "https://images.unsplash.com/photo-1577803645773-f96470509666?w=400",
      },
      {
        id: "4",
        name: "Sport Glasses",
        image:
          "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400",
      },
    ],
  },
  {
    id: "1003",
    status: "Delivered",
    date: "2025-08-01",
    items: 2,
    total: "280.00",
    products: [
      {
        id: "5",
        name: "Designer Frame",
        image:
          "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=400",
      },
      {
        id: "6",
        name: "Vintage Look",
        image:
          "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
      },
    ],
  },
];

export const OrderStatus = [
  { title: "Order placed", date: "June 12, 2024", completed: true },
  { title: "Order shipped", date: "June 12, 2024", completed: true },
  { title: "Out for delivery", date: "June 13, 2024", completed: true },
  { title: "Delivered", date: "June 15, 2024", completed: false },
];

export const orderDetails = {
  orderId: "#1234567890",
  product: {
    name: "Hareth Optics - Blue Light Glasses",
    size: "Item",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop",
  },
  pricing: {
    subtotal: 120.0,
    shipping: 5.0,
    taxes: 10.0,
    total: 135.0,
  },
  shippingAddress: {
    name: "Liam Carter",
    address: "123 Main Street",
    city: "Anytown, CA 91234",
  },
  billingAddress: {
    name: "Liam Carter",
    address: "123 Main Street",
    city: "Anytown, CA 91234",
  },
  paymentMethod: "MasterCard ending in 1234",
};
