import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, Order, AdminCredentials, User } from '../types';

interface AppContextType {
  state: AppState;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  register: (fullName: string, username: string, password: string) => boolean;
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void;
  updateOrderStatus: (orderId: string, status: 'pending' | 'paid', paymentProof?: string) => void;
  updateCredentials: (newCredentials: AdminCredentials) => void;
  requestNotificationPermission: () => Promise<boolean>;
  sendNotification: (title: string, body: string) => void;
}

type AppAction = 
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER'; payload: User }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: 'pending' | 'paid'; paymentProof?: string } }
  | { type: 'UPDATE_CREDENTIALS'; payload: AdminCredentials }
  | { type: 'LOAD_STATE'; payload: AppState };

const initialState: AppState = {
  isAdminLoggedIn: false,
  currentUser: null,
  orders: [],
  users: [
    {
      id: 'admin-default',
      fullName: 'Administrador',
      username: 'admin',
      password: 'brownie123',
      isAdmin: true,
      createdAt: new Date().toISOString()
    }
  ],
  adminCredentials: {
    username: 'admin',
    password: 'brownie123'
  }
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return { 
        ...state, 
        isAdminLoggedIn: action.payload.isAdmin,
        currentUser: action.payload 
      };
    case 'LOGOUT':
      return { 
        ...state, 
        isAdminLoggedIn: false,
        currentUser: null 
      };
    case 'REGISTER':
      return { 
        ...state, 
        users: [...state.users, action.payload] 
      };
    case 'ADD_ORDER':
      return { ...state, orders: [...state.orders, action.payload] };
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status, paymentProof: action.payload.paymentProof }
            : order
        )
      };
    case 'UPDATE_CREDENTIALS':
      // Update both admin credentials and the admin user
      const updatedUsers = state.users.map(user => 
        user.isAdmin 
          ? { ...user, username: action.payload.username, password: action.payload.password }
          : user
      );
      return { 
        ...state, 
        adminCredentials: action.payload,
        users: updatedUsers
      };
    case 'LOAD_STATE':
      return { ...action.payload, users: action.payload.users || initialState.users };
    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const savedState = localStorage.getItem('brownieAppState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Error loading saved state:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('brownieAppState', JSON.stringify(state));
  }, [state]);

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.log('Este navegador no soporta notificaciones');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  };

  const sendNotification = (title: string, body: string) => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/vite.svg',
        badge: '/vite.svg'
      });
    }
  };

  const login = (username: string, password: string): boolean => {
    const user = state.users.find(u => u.username === username && u.password === password);
    if (user) {
      dispatch({ type: 'LOGIN', payload: user });
      return true;
    }
    return false;
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    window.location.hash = '';
  };

  const register = (fullName: string, username: string, password: string): boolean => {
    // Check if username already exists
    const existingUser = state.users.find(u => u.username === username);
    if (existingUser) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      fullName,
      username,
      password,
      isAdmin: false,
      createdAt: new Date().toISOString()
    };

    dispatch({ type: 'REGISTER', payload: newUser });
    return true;
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_ORDER', payload: newOrder });

    // Send notification to admin users if they're logged in
    if (state.isAdminLoggedIn) {
      const itemsDescription = orderData.items
        .map(item => `${item.quantity}x ${
          item.flavor === 'chocochips' ? 'Brownie de Galleta' :
          item.flavor === 'oreo' ? 'Brownie de Oreo' : 'Brownie Jumbo'
        }`)
        .join(', ');
        
      sendNotification(
        '🍫 Nuevo Pedido de Brownie!',
        `${orderData.customerName} ordenó: ${itemsDescription} - $${orderData.totalPrice.toLocaleString()}`
      );
    }
  };

  const updateOrderStatus = (orderId: string, status: 'pending' | 'paid', paymentProof?: string) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status, paymentProof } });
  };

  const updateCredentials = (newCredentials: AdminCredentials) => {
    dispatch({ type: 'UPDATE_CREDENTIALS', payload: newCredentials });
  };

  return (
    <AppContext.Provider value={{
      state,
      login,
      logout,
      register,
      addOrder,
      updateOrderStatus,
      updateCredentials,
      requestNotificationPermission,
      sendNotification
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}