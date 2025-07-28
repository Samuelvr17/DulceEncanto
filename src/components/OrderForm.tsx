import React, { useState } from 'react';
import { ShoppingCart, Upload, CheckCircle, User, Package, CreditCard, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderItem } from '../types';

interface OrderFormProps {
  onBack?: () => void;
}

export function OrderForm({ onBack }: OrderFormProps) {
  const { addOrder, state } = useApp();
  const [customerName, setCustomerName] = useState(state.currentUser?.fullName || '');
  const [packaging, setPackaging] = useState<'capacillo' | 'bolsa'>('capacillo');
  const [items, setItems] = useState<OrderItem[]>([
    { flavor: 'chocochips', quantity: 0, unitPrice: 2000, subtotal: 0 },
    { flavor: 'oreo', quantity: 0, unitPrice: 2000, subtotal: 0 },
    { flavor: 'jumbo', quantity: 0, unitPrice: 2500, subtotal: 0 }
  ]);
  const [paymentChoice, setPaymentChoice] = useState<'immediate' | 'later' | null>(null);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const flavorNames = {
    chocochips: 'Brownie de Galleta',
    oreo: 'Brownie de Oreo',
    jumbo: 'Brownie Jumbo'
  };

  const flavorDescriptions = {
    chocochips: 'Trozos de galleta chocochips',
    oreo: 'Trozos de galleta de oreo',
    jumbo: 'Con trozos de maní'
  };

  const updateQuantity = (flavorIndex: number, newQuantity: number) => {
    if (newQuantity < 0) return;
    
    setItems(prevItems => 
      prevItems.map((item, index) => {
        if (index === flavorIndex) {
          const subtotal = newQuantity * item.unitPrice;
          return { ...item, quantity: newQuantity, subtotal };
        }
        return item;
      })
    );
  };

  const totalPrice = items.reduce((sum, item) => sum + item.subtotal, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const selectedItems = items.filter(item => item.quantity > 0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentProof(file);
    }
  };

  const goBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.location.hash = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName.trim()) {
      alert('Por favor ingresa tu nombre');
      return;
    }

    if (totalItems === 0) {
      alert('Por favor selecciona al menos un brownie');
      return;
    }

    if (paymentChoice === 'immediate' && !paymentProof) {
      alert('Por favor sube el comprobante de pago');
      return;
    }

    const orderData = {
      customerName: customerName.trim(),
      items: selectedItems,
      packaging,
      totalPrice,
      status: (paymentChoice === 'immediate' ? 'paid' : 'pending') as 'paid' | 'pending',
      paymentProof: paymentProof?.name
    };

    addOrder(orderData);
    setOrderSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setCustomerName(state.currentUser?.fullName || '');
      setItems([
        { flavor: 'chocochips', quantity: 0, unitPrice: 2000, subtotal: 0 },
        { flavor: 'oreo', quantity: 0, unitPrice: 2000, subtotal: 0 },
        { flavor: 'jumbo', quantity: 0, unitPrice: 2500, subtotal: 0 }
      ]);
      setPackaging('capacillo');
      setPaymentChoice(null);
      setPaymentProof(null);
      setOrderSubmitted(false);
      
      // If user is logged in, go back to their dashboard
      if (state.currentUser && !state.currentUser.isAdmin) {
        window.location.hash = '#client';
      }
    }, 3000);
  };

  if (orderSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Pedido Realizado!</h2>
          <p className="text-gray-600 mb-4">
            Tu pedido ha sido registrado exitosamente. 
            {paymentChoice === 'immediate' 
              ? ' El comprobante de pago ha sido enviado para verificación.'
              : ' Te contactaremos pronto para coordinar el pago.'
            }
          </p>
          <div className="bg-amber-50 p-4 rounded-lg mb-4">
            <div className="text-sm text-amber-800 space-y-1">
              {selectedItems.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.quantity}x {flavorNames[item.flavor]}</span>
                  <span>${item.subtotal.toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t pt-2 font-bold flex justify-between">
                <span>Total:</span>
                <span>${totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <button
            onClick={goBack}
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            {state.currentUser && !state.currentUser.isAdmin ? 'Volver a Mi Panel' : 'Volver al Inicio'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-amber-600 text-white p-6">
            <div className="flex items-center mb-4">
              <button
                onClick={goBack}
                className="flex items-center text-amber-100 hover:text-white transition-colors mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Volver
              </button>
            </div>
            <h1 className="text-2xl font-bold flex items-center">
              <ShoppingCart className="h-6 w-6 mr-3" />
              Hacer Pedido de Brownies
            </h1>
            <p className="text-amber-100 mt-2">Selecciona tus sabores favoritos y cantidades</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Customer Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Información Personal
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Ingresa tu nombre completo"
                  required
                  disabled={!!state.currentUser}
                />
                {state.currentUser && (
                  <p className="text-sm text-gray-500 mt-1">
                    Usando el nombre de tu cuenta registrada
                  </p>
                )}
              </div>
            </div>

            {/* Product Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Selecciona tus Brownies
              </h3>
              
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.flavor} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{flavorNames[item.flavor]}</h4>
                        <p className="text-sm text-gray-600">{flavorDescriptions[item.flavor]}</p>
                        <p className="text-sm font-medium text-amber-600">${item.unitPrice.toLocaleString()} c/u</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                          disabled={item.quantity === 0}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        
                        <span className="w-12 text-center font-medium text-lg">
                          {item.quantity}
                        </span>
                        
                        <button
                          type="button"
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-amber-200 hover:bg-amber-300 flex items-center justify-center transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          ${item.subtotal.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Empaque
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="packaging"
                      value="capacillo"
                      checked={packaging === 'capacillo'}
                      onChange={(e) => setPackaging(e.target.value as 'capacillo' | 'bolsa')}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span className="ml-3 font-medium">Capacillo</span>
                  </label>
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="packaging"
                      value="bolsa"
                      checked={packaging === 'bolsa'}
                      onChange={(e) => setPackaging(e.target.value as 'capacillo' | 'bolsa')}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span className="ml-3 font-medium">Bolsa Plástica</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            {totalItems > 0 && (
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="space-y-2">
                  {selectedItems.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.quantity}x {flavorNames[item.flavor]}</span>
                      <span>${item.subtotal.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-900">Total a Pagar:</span>
                    <span className="text-2xl font-bold text-amber-600">${totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Options */}
            {totalItems > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Opciones de Pago
                </h3>
                
                <div className="space-y-3">
                  <label className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="immediate"
                      checked={paymentChoice === 'immediate'}
                      onChange={(e) => setPaymentChoice('immediate')}
                      className="text-amber-600 focus:ring-amber-500 mt-1"
                    />
                    <div className="ml-3">
                      <div className="font-medium">Pagar Ahora (Nequi)</div>
                      <div className="text-sm text-gray-500">Realiza el pago y sube tu comprobante</div>
                    </div>
                  </label>
                  
                  <label className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="later"
                      checked={paymentChoice === 'later'}
                      onChange={(e) => setPaymentChoice('later')}
                      className="text-amber-600 focus:ring-amber-500 mt-1"
                    />
                    <div className="ml-3">
                      <div className="font-medium">Pagar Después</div>
                      <div className="text-sm text-gray-500">Te contactaremos para coordinar el pago</div>
                    </div>
                  </label>
                </div>

                {paymentChoice === 'immediate' && (
                  <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                    <p className="text-sm text-blue-800">
                      <strong>Instrucciones de pago:</strong><br />
                      1. Transfiere ${totalPrice.toLocaleString()} a Nequi<br />
                      2. Toma captura del comprobante<br />
                      3. Súbelo aquí abajo
                    </p>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comprobante de Pago *
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="payment-proof"
                          required={paymentChoice === 'immediate'}
                        />
                        <label
                          htmlFor="payment-proof"
                          className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-50"
                        >
                          <Upload className="h-4 w-4" />
                          <span>Subir Comprobante</span>
                        </label>
                        {paymentProof && (
                          <span className="text-sm text-green-600">✓ {paymentProof.name}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={!paymentChoice || totalItems === 0}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              {paymentChoice === 'immediate' ? 'Confirmar Pedido y Pago' : 'Confirmar Pedido'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}