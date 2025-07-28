import { supabase } from '../lib/supabase';
import { User, Order, OrderItem, AdminCredentials } from '../types';

export class DatabaseService {
  // Users
  static async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        full_name: userData.fullName,
        username: userData.username,
        password: userData.password,
        is_admin: userData.isAdmin
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      fullName: data.full_name,
      username: data.username,
      password: data.password,
      isAdmin: data.is_admin,
      createdAt: data.created_at
    };
  }

  static async getUserByCredentials(username: string, password: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();
    
    if (error) return null;
    
    return {
      id: data.id,
      fullName: data.full_name,
      username: data.username,
      password: data.password,
      isAdmin: data.is_admin,
      createdAt: data.created_at
    };
  }

  // Orders
  static async getOrders(): Promise<Order[]> {
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (ordersError) throw ordersError;

    const orders: Order[] = [];
    
    for (const orderData of ordersData || []) {
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderData.id);
      
      if (itemsError) throw itemsError;
      
      const items: OrderItem[] = itemsData?.map(item => ({
        flavor: item.flavor,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        subtotal: item.subtotal
      })) || [];
      
      orders.push({
        id: orderData.id,
        customerName: orderData.customer_name,
        userId: orderData.user_id,
        items,
        packaging: orderData.packaging,
        totalPrice: orderData.total_price,
        status: orderData.status,
        paymentProof: orderData.payment_proof,
        createdAt: orderData.created_at
      });
    }
    
    return orders;
  }

  static async createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: orderData.customerName,
        user_id: orderData.userId,
        packaging: orderData.packaging,
        total_price: orderData.totalPrice,
        status: orderData.status,
        payment_proof: orderData.paymentProof
      })
      .select()
      .single();
    
    if (orderError) throw orderError;

    // Insert order items
    const itemsToInsert = orderData.items.map(item => ({
      order_id: order.id,
      flavor: item.flavor,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      subtotal: item.subtotal
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsToInsert);
    
    if (itemsError) throw itemsError;

    return {
      id: order.id,
      customerName: order.customer_name,
      userId: order.user_id,
      items: orderData.items,
      packaging: order.packaging,
      totalPrice: order.total_price,
      status: order.status,
      paymentProof: order.payment_proof,
      createdAt: order.created_at
    };
  }

  static async updateOrderStatus(orderId: string, status: 'pending' | 'paid', paymentProof?: string): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({ 
        status,
        payment_proof: paymentProof 
      })
      .eq('id', orderId);
    
    if (error) throw error;
  }

  // Admin Settings
  static async getAdminSettings(): Promise<AdminCredentials> {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('*')
      .single();
    
    if (error) throw error;
    
    return {
      username: data.username,
      password: data.password
    };
  }

  static async updateAdminSettings(credentials: AdminCredentials): Promise<void> {
    const { error } = await supabase
      .from('admin_settings')
      .update({
        username: credentials.username,
        password: credentials.password,
        updated_at: new Date().toISOString()
      })
      .eq('id', (await supabase.from('admin_settings').select('id').single()).data?.id);
    
    if (error) throw error;

    // Also update the admin user
    const { error: userError } = await supabase
      .from('users')
      .update({
        username: credentials.username,
        password: credentials.password
      })
      .eq('is_admin', true);
    
    if (userError) throw userError;
  }
}