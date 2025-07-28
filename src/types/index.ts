export interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  packaging: 'capacillo' | 'bolsa';
  totalPrice: number;
  status: 'pending' | 'paid';
  paymentProof?: string;
  createdAt: string;
}

export interface OrderItem {
  flavor: 'chocochips' | 'oreo' | 'jumbo';
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface AdminCredentials {
  username: string;
  password: string;
}

export interface User {
  id: string;
  fullName: string;
  username: string;
  password: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface AppState {
  isAdminLoggedIn: boolean;
  currentUser: User | null;
  orders: Order[];
  users: User[];
  adminCredentials: AdminCredentials;
}