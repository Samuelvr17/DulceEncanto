import React, { useState } from 'react';
import { ShoppingCart, ArrowLeft, Calendar, Cookie } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderForm } from './OrderForm';

export function ClientDashboard() {
  const { state, logout } = useApp();
  const [showOrderForm, setShowOrderForm] = useState(false);

  // Filter orders for current user
  const userOrders = state.orders.filter(order => 
    order.customerName.toLowerCase() === state.currentUser?.fullName.toLowerCase()
  );

  const goHome = () => {
    logout();
  };

  if (showOrderForm) {
    return <OrderForm onBack={() => setShowOrderForm(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={goHome}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Cerrar Sesión
            </button>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="bg-amber-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Cookie className="h-8 w-8 text-amber-800" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Hola, {state.currentUser?.fullName}!
          </h1>
          <p className="text-gray-600">Bienvenido a tu panel personal de BrownieShop</p>
        </div>

        {/* Quick Order Button */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 text-center">
          <div className="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="h-6 w-6 text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">¿Antojo de Brownies?</h2>
          <p className="text-gray-600 mb-4">Haz tu pedido rápido y fácil</p>
          <button
            onClick={() => setShowOrderForm(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Hacer Nuevo Pedido
          </button>
        </div>

        {/* Order History */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Mi Historial de Pedidos
            </h2>
          </div>
          
          {userOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pedido
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-amber-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                            <Cookie className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.items.map((item, index) => (
                                <div key={index}>
                                  {item.quantity}x {
                                    item.flavor === 'chocochips' ? 'Brownie de Galleta' :
                                    item.flavor === 'oreo' ? 'Brownie de Oreo' : 'Brownie Jumbo'
                                  }
                                </div>
                              ))}
                            </div>
                            <div className="text-sm text-gray-500">
                              Empaque: {order.packaging === 'capacillo' ? 'Capacillo' : 'Bolsa plástica'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${order.totalPrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {order.status === 'paid' ? 'Pagado' : 'Pendiente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Cookie className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tienes pedidos aún</h3>
              <p className="mt-1 text-sm text-gray-500">
                ¡Haz tu primer pedido y disfruta de nuestros deliciosos brownies!
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowOrderForm(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Hacer Mi Primer Pedido
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}