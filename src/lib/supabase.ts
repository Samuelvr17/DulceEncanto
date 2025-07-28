import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          full_name: string;
          username: string;
          password: string;
          is_admin: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          username: string;
          password: string;
          is_admin?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          username?: string;
          password?: string;
          is_admin?: boolean;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          customer_name: string;
          user_id: string | null;
          packaging: 'capacillo' | 'bolsa';
          total_price: number;
          status: 'pending' | 'paid';
          payment_proof: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          user_id?: string | null;
          packaging: 'capacillo' | 'bolsa';
          total_price: number;
          status: 'pending' | 'paid';
          payment_proof?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          user_id?: string | null;
          packaging?: 'capacillo' | 'bolsa';
          total_price?: number;
          status?: 'pending' | 'paid';
          payment_proof?: string | null;
          created_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          flavor: 'chocochips' | 'oreo' | 'jumbo';
          quantity: number;
          unit_price: number;
          subtotal: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          flavor: 'chocochips' | 'oreo' | 'jumbo';
          quantity: number;
          unit_price: number;
          subtotal: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          flavor?: 'chocochips' | 'oreo' | 'jumbo';
          quantity?: number;
          unit_price?: number;
          subtotal?: number;
        };
      };
      admin_settings: {
        Row: {
          id: string;
          username: string;
          password: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          password: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          password?: string;
          updated_at?: string;
        };
      };
    };
  };
}