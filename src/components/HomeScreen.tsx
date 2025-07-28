import React, { useEffect } from 'react';
import { ShoppingCart, Cookie } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function HomeScreen() {
  const { requestNotificationPermission } = useApp();

  useEffect(() => {
    // Request notification permission when the app loads
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="bg-amber-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Cookie className="h-10 w-10 text-amber-800" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenido a DulceEncanto
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Elige uno de los sabores y disfruta de cada bocado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-12 max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="h-8 w-8 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Hacer Pedido</h2>
            <p className="text-gray-600 mb-6">
              Ordena tus brownies favoritos de manera fácil y rápida. 
              Sin necesidad de registro.
            </p>
            <a
              href="#order"
              className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Ordenar Ahora
            </a>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Nuestros Sabores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="bg-amber-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">
                C
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Brownie de Galleta</h3>
                <p className="text-gray-600">Trozos de galleta chocochips</p>
                <p className="font-bold text-amber-600">$2,000</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="bg-amber-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">
                O
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Brownie de Oreo</h3>
                <p className="text-gray-600">Trozos de galleta de oreo</p>
                <p className="font-bold text-amber-600">$2,000</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="bg-amber-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">
                J
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Brownie Jumbo</h3>
                <p className="text-gray-600">Con trozos de maní</p>
                <p className="font-bold text-amber-600">$2,500</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}