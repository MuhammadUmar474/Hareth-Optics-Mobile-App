import { ImageSource } from "expo-image";

// Define proper types for icon names - using actual Feather icon names
export type FeatherIconName =
  | "truck"
  | "star"
  | "gift"
  | "credit-card"
  | "bookmark"
  | "user"
  | "file-text"
  | "eye"
  | "home"
  | "navigation"
  | "users"
  | "help-circle"
  | "phone"
  | "glasses-outline"
  | "sun"
  | "book-open"
  | "monitor"
  | "trending-up"
  | "layers";

export interface SettingsItem {
  title: string;
  iconName: FeatherIconName;
}

export interface GlassesBrand {
  id: number;
  name: string;
  image: ImageSource;
}

export interface BestSellingProduct {
  id: number;
  name: string;
  image: ImageSource;
  price: string;
  discountedPrice: string;
}

export interface SuggestionCategory {
  id: number;
  title: string;
  iconName: string;
  iconLibrary: "feather" | "ionicons";
  isSelected: boolean;
}

export interface CategoryOption {
  id: number;
  title: string;
  iconName: string;
  iconLibrary: string;
  isSelected: boolean;
  handle: string;
}

export const settingsItems = [
  { title: "Address Book", iconName: "bookmark", link: "/address-book" },
  { title: "Account Info", iconName: "user", link: "/account-info" },
  {
    title: "My Prescriptions",
    iconName: "file-text",
    link: "/my-prescriptions",
  },
  { title: "Submit Eye Power", iconName: "eye", link: "/submit-eye-power" },
  { title: "Eye Test at Home", iconName: "home", link: "/eye-test-at-home" },
  { title: "Store Locator", iconName: "navigation", link: "/store-locator" },
  { title: "Refer & Earn", iconName: "users", link: "/refer-and-earn" },
  { title: "Help Center", iconName: "help-circle", link: "/help-center" },
  { title: "Contact Us", iconName: "phone", link: "/contact-us" },
];

export const categoryOptions: CategoryOption[] = [
  {
    id: 0,
    title: "All",
    iconName: "grid-outline",
    iconLibrary: "ionicons",
    handle: "eyeglasses",
    isSelected: true,
  },
  {
    id: 3,
    title: "Mens",
    iconName: "man-outline",
    iconLibrary: "ionicons",
    handle: "men-sunglasses",
    isSelected: false,
  },
  {
    id: 4,
    title: "Womens",
    iconName: "woman-outline",
    iconLibrary: "ionicons",
    handle: "women-sunglasses",
    isSelected: false,
  },
  {
    id: 5,
    title: "Kids",
    iconName: "happy-outline",
    iconLibrary: "ionicons",
    handle: "kids",
    isSelected: false,
  },
  {
    id: 6,
    title: "Premium",
    iconName: "diamond-outline",
    iconLibrary: "ionicons",
    handle: "color-contact-lenses",
    isSelected: false,
  },
  {
    id: 7,
    title: "Classic",
    iconName: "medal-outline",
    iconLibrary: "ionicons",
    handle: "clear-contact-lenses",
    isSelected: false,
  },
  {
    id: 8,
    title: "On Sale",
    iconName: "pricetag-outline",
    iconLibrary: "ionicons",
    handle: "monthly-colored-contact-lenses",
    isSelected: false,
  },
  {
    id: 9,
    title: "Contact Lens",
    iconName: "eye-outline",
    iconLibrary: "ionicons",
    handle: "contact-lenses",
    isSelected: false,
  },
];

export const suggestionCategories: SuggestionCategory[] = [
  {
    id: 1,
    title: "Eyeglasses",
    iconName: "glasses-outline",
    iconLibrary: "ionicons",
    isSelected: false,
  },
  {
    id: 2,
    title: "Sunglasses",
    iconName: "sunny-outline",
    iconLibrary: "ionicons",
    isSelected: false,
  },
  {
    id: 3,
    title: "Contact Lenses",
    iconName: "eye-outline",
    iconLibrary: "ionicons",
    isSelected: false,
  },
  {
    id: 4,
    title: "Reading Glasses",
    iconName: "book-outline",
    iconLibrary: "ionicons",
    isSelected: false,
  },
  {
    id: 5,
    title: "Blue Light",
    iconName: "desktop-outline",
    iconLibrary: "ionicons",
    isSelected: false,
  },
  {
    id: 6,
    title: "Progressive",
    iconName: "trending-up-outline",
    iconLibrary: "ionicons",
    isSelected: false,
  },
  {
    id: 7,
    title: "Bifocal",
    iconName: "layers-outline",
    iconLibrary: "ionicons",
    isSelected: false,
  },
  {
    id: 8,
    title: "Computer Glasses",
    iconName: "laptop-outline",
    iconLibrary: "ionicons",
    isSelected: false,
  },
];

export interface TrendingCardData {
  id: number;
  title: string;
  subtitle?: string;
  cta?: string;
  image: ImageSource;
  filter: string
}

export const trendingCards: TrendingCardData[] = [
  {
    id: 1,
    title: "FLASH SALE",
    subtitle: "FLAT 30% OFF",
    image: require("@/assets/images/sale.jpg"),
    filter: "On Sale",
  },
  {
    id: 2,
    title: "Back to School",
    subtitle: "Kids & Teens",
    image: require("@/assets/images/classic.jpg"),
    filter: "Classic",
  },
  {
    id: 3,
    title: "Classic Eyewear",
    subtitle: "Frames of Elegance",
    image: require("@/assets/images/classic.jpg"),
    filter: "Classic",
  },
  {
    id: 4,
    title: "Contact Lenses",
    subtitle: "Floral Inspired Focus",
    image: require("@/assets/images/lenses.jpg"),
    filter: "Contact Lens",
  },
];

export interface Product {
  id: number;
  name: string;
  image: ImageSource;
  category: string;
}

export interface ProductCategory {
  id: number;
  title: string;
  products: Product[];
}

export interface PaymentMethod {
  id: number;
  name: string;
  image: ImageSource;
}

export interface OurPromise {
  id: number;
  name: string;
  iconLibrary: "fontisto" | "fontawesome" | "fontawesome5";
  iconName: string;
}

export const eyeGlassesProducts: ProductCategory = {
  id: 1,
  title: "Eye Glasses",
  products: [
    {
      id: 1,
      name: "Men",
      image: require("@/assets/images/classic.jpg"),
      category: "eyeglasses",
    },
    {
      id: 2,
      name: "Women",
      image: require("@/assets/images/premium.jpg"),
      category: "eyeglasses",
    },
    {
      id: 3,
      name: "Kids",
      image: require("@/assets/images/classic.jpg"),
      category: "eyeglasses",
    },
    {
      id: 4,
      name: "On Sale",
      image: require("@/assets/images/sale.jpg"),
      category: "eyeglasses",
    },
  ],
};

export const contactLensesProducts: ProductCategory = {
  id: 2,
  title: "Contact Lenses",
  products: [
    {
      id: 1,
      name: "Clear",
      image: require("@/assets/images/lenses.jpg"),
      category: "contactlenses",
    },
    {
      id: 2,
      name: "Color",
      image: require("@/assets/images/lenses.jpg"),
      category: "contactlenses",
    },
    {
      id: 3,
      name: "KD 40",
      image: require("@/assets/images/lenses.jpg"),
      category: "contactlenses",
    },
    {
      id: 4,
      name: "Solution",
      image: require("@/assets/images/lenses.jpg"),
      category: "contactlenses",
    },
  ],
};

export const screenGlassesProducts: ProductCategory = {
  id: 3,
  title: "Screen Glasses",
  products: [
    {
      id: 1,
      name: "Men",
      image: require("@/assets/images/classic.jpg"),
      category: "screenglasses",
    },
    {
      id: 2,
      name: "Women",
      image: require("@/assets/images/premium.jpg"),
      category: "screenglasses",
    },
    {
      id: 3,
      name: "Kids",
      image: require("@/assets/images/classic.jpg"),
      category: "screenglasses",
    },
    {
      id: 4,
      name: "Blu Block",
      image: require("@/assets/images/classic.jpg"),
      category: "screenglasses",
    },
  ],
};

export const allProductCategories: ProductCategory[] = [
  eyeGlassesProducts,
  contactLensesProducts,
  screenGlassesProducts,
];

export const paymentMethodTypes: PaymentMethod[] = [
  {
    id: 1,
    name: "Visa",
    image: require("@/assets/images/home/visa.png"),
  },
  {
    id: 2,
    name: "MasterCard",
    image: require("@/assets/images/home/mastercard.png"),
  },
  {
    id: 3,
    name: "Apple Pay",
    image: require("@/assets/images/home/apple-pay.png"),
  },
  {
    id: 4,
    name: "Tabby",
    image: require("@/assets/images/home/tabby.png"),
  },
  {
    id: 5,
    name: "KNET",
    image: require("@/assets/images/home/knet.png"),
  },
];

export const glassesBrandsData: GlassesBrand[] = [
  {
    id: 1,
    name: "Ahmad Muhammad",
    image: require("@/assets/images/classic.jpg"),
  },
  {
    id: 2,
    name: "Emaan Al Othaim",
    image: require("@/assets/images/premium.jpg"),
  },
  {
    id: 3,
    name: "Sami Al Othaim",
    image: require("@/assets/images/classic.jpg"),
  },
  {
    id: 4,
    name: "Jasem Al Othaim",
    image: require("@/assets/images/premium.jpg"),
  },
  {
    id: 5,
    name: "Abdulrahman Javad",
    image: require("@/assets/images/classic.jpg"),
  },
];

export const ourPromiseData: OurPromise[] = [
  {
    id: 1,
    name: "No Questions Asked Returns",
    iconLibrary: "fontisto",
    iconName: "arrow-return-left",
  },
  {
    id: 2,
    name: "Easy 14 day Exchange",
    iconLibrary: "fontawesome",
    iconName: "exchange",
  },
  {
    id: 3,
    name: "FREE Shipping",
    iconLibrary: "fontawesome5",
    iconName: "shipping-fast",
  },
];

export const bestSellingProducts: BestSellingProduct[] = [
  {
    id: 1,
    name: "Classic Aviator Sunglasses",
    image: require("@/assets/images/classic.jpg"),
    price: "KD 400",
    discountedPrice: "KD 300",
  },
  {
    id: 2,
    name: "Premium Women's Frame",
    image: require("@/assets/images/premium.jpg"),
    price: "KD 450",
    discountedPrice: "KD 350",
  },
  {
    id: 3,
    name: "Kids Fun Glasses",
    image: require("@/assets/images/classic.jpg"),
    price: "KD 200",
    discountedPrice: "KD 150",
  },
  {
    id: 4,
    name: "Blue Light Blocker",
    image: require("@/assets/images/sale.jpg"),
    price: "KD 300",
    discountedPrice: "KD 220",
  },
];

export const storeBenefits: OurPromise[] = [
  {
    id: 1,
    name: "Free lens cleaner",
    iconLibrary: "fontawesome5",
    iconName: "spray-can",
  },
  {
    id: 2,
    name: "Free eye test",
    iconLibrary: "fontawesome5",
    iconName: "eye",
  },
  {
    id: 3,
    name: "Free repair",
    iconLibrary: "fontawesome5",
    iconName: "tools",
  },
];

// Product Details Interfaces
export interface FrameColor {
  id: number;
  name: string;
  color: string;
}

export interface FrameSize {
  id: number;
  name: string;
  value: string;
}

export interface ProductDetail {
  id: number;
  name: string;
  description: string;
  images: ImageSource[];
  frameColors: FrameColor[];
  frameSizes: FrameSize[];
  price: string;
  discountedPrice: string;
  category: string;
  brand: string;
}

// Sample Product Detail Data
export const productDetailData: ProductDetail = {
  id: 1,
  name: "Hareth Optics Classic Eyeglasses",
  description:
    "Timeless design meets modern comfort. These classic eyeglasses are perfect for everyday wear, providing both style and clarity.",
  images: [
    require("@/assets/images/classic.jpg"),
    require("@/assets/images/premium.jpg"),
    require("@/assets/images/sale.jpg"),
    require("@/assets/images/lenses.jpg"),
  ],
  frameColors: [
    { id: 1, name: "Black", color: "#000000" },
    { id: 2, name: "Brown", color: "#654321" },
    { id: 3, name: "Silver", color: "#C0C0C0" },
    { id: 4, name: "Gold", color: "#FFD700" },
  ],
  frameSizes: [
    { id: 1, name: "Small", value: "S" },
    { id: 2, name: "Medium", value: "M" },
    { id: 3, name: "Large", value: "L" },
  ],
  price: "KD 400",
  discountedPrice: "KD 300",
  category: "Eyeglasses",
  brand: "Hareth Optics",
};

// Lens Type Interfaces
export interface LensTypeOption {
  id: number;
  name: string;
  description: string;
}

export const lensTypeOptions: LensTypeOption[] = [
  {
    id: 1,
    name: "Single Vision",
    description: "For distance or reading",
  },
  {
    id: 2,
    name: "Bifocal",
    description: "Distance and reading",
  },
  {
    id: 3,
    name: "Progressive",
    description: "All-in-one vision",
  },
];

// Size Guide Data
export interface SizeMeasurement {
  id: number;
  label: string;
  description: string;
  iconLibrary: "simplelineicons" | "fontawesome5" | "fontawesome6";
  iconName: string;
}

export const sizeMeasurements: SizeMeasurement[] = [
  {
    id: 1,
    label: "Lens Width",
    description:
      "The horizontal diameter of one lens. This is the first number in the sequence (e.g., 52-18-140).",
    iconLibrary: "fontawesome6",
    iconName: "ruler-horizontal",
  },
  {
    id: 2,
    label: "Bridge Width",
    description:
      "The distance between the two lenses, over your nose. This is the middle number (e.g., 52-18-140).",
    iconLibrary: "fontawesome5",
    iconName: "minus",
  },
  {
    id: 3,
    label: "Temple Length",
    description:
      "The length of the arm from the hinge to the tip. This is the last number (e.g., 52-18-140).",
    iconLibrary: "simplelineicons",
    iconName: "graph",
  },
];

export interface HowToFindSize {
  title: string;
  description: string;
}

export const howToFindYourSize: HowToFindSize = {
  title: "How to Find Your Size",
  description:
    "The easiest way to find your size is to check your current pair of glasses. If you don't have a pair, you can use a standard credit card to measure. The width of a credit card is roughly the same as a standard lens width.",
};

/* Shopping Cart Interfaces */
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: ImageSource;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  estimatedTax: number;
  total: number;
}

/* Sample Cart Data */
export const sampleCartItems: CartItem[] = [
  {
    id: 1,
    name: "Classic Aviator Sunglasses",
    price: 75.0,
    quantity: 1,
    image: require("@/assets/images/classic.jpg"),
  },
  {
    id: 2,
    name: "Blue Light Blocking Glasses",
    price: 75.0,
    quantity: 1,
    image: require("@/assets/images/premium.jpg"),
  },
];

/* Delivery Address Interfaces */
export interface SavedAddress {
  id: number;
  label: string;
  iconName: string;
  iconLibrary: "ionicons" | "materialcommunityicons";
  address: string;
  city: string;
  state: string;
  zipCode: string;
  isSelected: boolean;
}

export const savedAddresses: SavedAddress[] = [
  {
    id: 1,
    label: "Home",
    iconName: "home",
    iconLibrary: "ionicons",
    address: "123 Maple Street, Apt 4B",
    city: "Anytown",
    state: "CA",
    zipCode: "91234",
    isSelected: true,
  },
  {
    id: 2,
    label: "Work",
    iconName: "briefcase",
    iconLibrary: "materialcommunityicons",
    address: "456 Oak Avenue, Suite 200",
    city: "Anytown",
    state: "CA",
    zipCode: "91234",
    isSelected: false,
  },
];

/* Delivery Options Interfaces */
export interface DeliveryOption {
  id: number;
  title: string;
  description: string;
  price: number;
  isSelected: boolean;
}

export const deliveryOptions: DeliveryOption[] = [
  {
    id: 1,
    title: "Standard",
    description: "Free · Arrives in 5-7 business days",
    price: 0,
    isSelected: true,
  },
  {
    id: 2,
    title: "Express",
    description: "$10 · Arrives in 2-3 business days",
    price: 10,
    isSelected: false,
  },
];

/* Payment Methods Interfaces */
export interface SavedCard {
  id: number;
  type: string;
  lastFour: string;
  icon: ImageSource;
  isSelected: boolean;
}

export interface OtherPaymentMethod {
  id: number;
  name: string;
  iconName: string;
  iconLibrary: "ionicons" | "fontawesome5";
  isSelected: boolean;
}

export const savedCards: SavedCard[] = [
  {
    id: 1,
    type: "Visa",
    lastFour: "4242",
    icon: require("@/assets/images/home/visa.png"),
    isSelected: true,
  },
  {
    id: 2,
    type: "Mastercard",
    lastFour: "1234",
    icon: require("@/assets/images/home/mastercard.png"),
    isSelected: false,
  },
];

export const otherPaymentMethods: OtherPaymentMethod[] = [
  {
    id: 1,
    name: "KNET",
    iconName: "card",
    iconLibrary: "ionicons",
    isSelected: false,
  },
  {
    id: 2,
    name: "Apple Pay",
    iconName: "apple",
    iconLibrary: "fontawesome5",
    isSelected: false,
  },
  {
    id: 3,
    name: "Tabby",
    iconName: "wallet",
    iconLibrary: "ionicons",
    isSelected: false,
  },
];

/* Order Summary Interfaces */
export interface OrderItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: ImageSource;
}

export interface OrderDiscount {
  name: string;
  amount: number;
}

export interface OrderSummaryData {
  items: OrderItem[];
  discount: OrderDiscount;
  deliveryAddress: {
    label: string;
    address: string;
  };
  deliveryMethod: {
    name: string;
    price: number;
  };
  paymentMethod: string;
}

export const orderSummaryData: OrderSummaryData = {
  items: [
    {
      id: 1,
      name: "Hareth Optics Eyeglasses",
      description: "Frame Color: Black",
      price: 129,
      image: require("@/assets/images/classic.jpg"),
    },
    {
      id: 2,
      name: "Hareth Optics Contact Lenses",
      description: "Color: Clear",
      price: 49,
      image: require("@/assets/images/lenses.jpg"),
    },
  ],
  discount: {
    name: "Summer Sale Discount",
    amount: 20,
  },
  deliveryAddress: {
    label: "Home",
    address: "123 Elm Street, Apt 4B, Springfield, IL 62704",
  },
  deliveryMethod: {
    name: "Standard Delivery",
    price: 5,
  },
  paymentMethod: "Credit Card",
};

/* Order Confirmation Interfaces */
export interface OrderConfirmation {
  orderNumber: string;
  estimatedDelivery: string;
}

export const orderConfirmationData: OrderConfirmation = {
  orderNumber: "#123456789",
  estimatedDelivery: "July 20, 2024",
};
