export type Event = {
  id: string;
  badge: string;
  date: string;
  location: string;
  title: string;
  description: string;
  price: string;
  image_url: string;
  created_at: string;
  updated_at: string;
};

export type GalleryItem = {
  id: string;
  category: "food" | "events" | "entertainment" | "vendors" | "brand";
  src: string;
  alt: string;
  created_at: string;
};

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type TicketOrder = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  event_name: string;
  tickets_json: string;
  qty: number;
  total: number;
  payment_status: PaymentStatus;
  paystack_reference: string | null;
  created_at: string;
};

export type VendorBooking = {
  id: string;
  business: string;
  category: string;
  contact: string;
  phone: string | null;
  email: string;
  instagram: string | null;
  package: string;
  qty: number;
  dates: string | null;
  total: number;
  payment_status: PaymentStatus;
  paystack_reference: string | null;
  created_at: string;
};

export type VendorPricing = {
  single: number;
  multi: number;
  flagship: number;
};

export type PartnerPricing = {
  community: number;
  festival: number;
  title: string;
};

export type AdminUser = {
  id: number;
  email: string;
  password_hash: string;
  created_at: string;
};
