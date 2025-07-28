import React, { useState, useEffect } from 'react';
import { DollarSign, Package, CheckCircle, Clock, Search, Settings, Bell, Eye, X, FileImage } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CredentialsModal } from './CredentialsModal';

export function AdminDashboard() {
  const { state, updateOrderStatus, requestNotificationPermission } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid'>('all');
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  useEffect(() => {
    // Check if notifications are enabled
    setNotificationEnabled(Notification.permission === 'granted');
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationEnabled(granted);
    if (granted) {
      alert('¡Notificaciones activadas! Recibirás alertas de nuevos pedidos.');
    } else {
      alert('No se pudieron activar las notificaciones. Verifica los permisos del navegador.');
    }
  };

  const filteredOrders = state.orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalOrders: state.orders.length,
    totalRevenue: state.orders.filter(order => order.status === 'paid').reduce((sum, order) => sum + order.totalPrice, 0),
    pendingRevenue: state.orders.filter(order => order.status === 'pending').reduce((sum, order) => sum + order.totalPrice, 0),
    paidOrders: state.orders.filter(order => order.status === 'paid').length,
    pendingOrders: state.orders.filter(order => order.status === 'pending').length
  };

  const handleStatusChange = (orderId: string, newStatus: 'pending' | 'paid') => {
    updateOrderStatus(orderId, newStatus);
  };

  const handleViewProof = (proofName: string) => {
    setSelectedProof(proofName);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel Administrativo</h1>
            <p className="text-gray-600 mt-1">Gestiona tus pedidos y ventas</p>
          </div>
          <div className="flex space-x-3">
            {!notificationEnabled && (
              <button
                onClick={handleEnableNotifications}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Bell className="h-4 w-4" />
                <span>Activar Notificaciones</span>
              </button>
            )}
            <button
              onClick={() => setShowCredentialsModal(true)}
              className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Configuración</span>
            </button>
          </div>
        </div>

        {notificationEnabled && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <Bell className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 text-sm">
                Notificaciones activadas - Recibirás alertas de nuevos pedidos
              </span>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-lg p-3">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Pedidos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-lg p-3">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ingresos Confirmados</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 rounded-lg p-3">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ingresos Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">${stats.pendingRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-lg p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pedidos Pagados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.paidOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 rounded-lg p-3">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pedidos Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'paid')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="paid">Pagados</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-lg font-medium text-gray-900">Pedidos Recientes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
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
                    Comprobante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">ID: {order.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
                      {order.paymentProof ? (
                        <button
                          onClick={() => handleViewProof(order.paymentProof!)}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Ver</span>
                        </button>
                      ) : (
                        <span className="text-gray-400">Sin comprobante</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as 'pending' | 'paid')}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="pending">Pendiente</option>
                        <option value="paid">Pagado</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay pedidos</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' ? 'No se encontraron pedidos con los filtros aplicados.' : 'Aún no hay pedidos registrados.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {showCredentialsModal && (
        <CredentialsModal onClose={() => setShowCredentialsModal(false)} />
      )}

      {/* Payment Proof Modal */}
      {selectedProof && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Comprobante de Pago</h2>
              <button
                onClick={() => setSelectedProof(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <FileImage className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-900 font-medium mb-2">Archivo: {selectedProof}</p>
                <p className="text-sm text-gray-500">
                  Comprobante de pago subido por el cliente
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}