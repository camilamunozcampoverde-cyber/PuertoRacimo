/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, 
  ChevronLeft, 
  X, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Minus, 
  Plus, 
  ShieldCheck,
  Smartphone,
  AlertCircle
} from 'lucide-react';
import { 
  Product, 
  CartItem, 
  PaymentMethod, 
  CATEGORIES, 
  SHEET_API_URL 
} from './constants';

// --- Components ---

const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-bg-black space-y-10">
    <div className="relative">
      {/* Glow Effect */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 bg-gold-ocre/20 blur-3xl rounded-full"
      />
      
      {/* Banana Icon */}
      <motion.div 
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, 5, -5, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-32 h-32 flex items-center justify-center"
      >
        <span className="text-8xl drop-shadow-[0_20px_50px_rgba(184,134,11,0.4)]">🍌</span>
      </motion.div>
    </div>
    
    <div className="text-center">
      <h2 className="text-gold-ocre font-extrabold tracking-[0.3em] text-xl uppercase mb-2">Puerto Racimo</h2>
      <div className="flex items-center justify-center gap-2">
        <motion.span 
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]"
        >
          Preparando tu menú
        </motion.span>
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span 
              key={i}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
              className="w-1 h-1 bg-gold-ocre rounded-full"
            />
          ))}
        </span>
      </div>
    </div>
  </div>
);

const ErrorScreen = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center h-screen bg-bg-black p-8 text-center">
    <div className="w-24 h-24 bg-zinc-900 rounded-[32px] flex items-center justify-center mb-8 border border-zinc-800 shadow-2xl">
      <span className="text-4xl">🍌</span>
    </div>
    <h2 className="text-3xl font-black text-white-arena mb-4 uppercase">¡Ups! Algo falló</h2>
    <p className="text-zinc-500 mb-10 max-w-[280px] font-medium leading-relaxed">No pudimos conectar con la base de datos. Revisa tu conexión.</p>
    <button 
      onClick={onRetry}
      className="btn-press bg-gold-ocre text-black px-12 py-4 rounded-2xl font-black shadow-xl shadow-gold-ocre/20 active:bg-gold-hover"
    >
      REINTENTAR
    </button>
  </div>
);

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onUpdateQuantity: (id: string, delta: number, masa?: Product['masa']) => void;
  quantity: number;
}

const ProductCard = ({ 
  product, 
  onUpdateQuantity, 
  quantity 
}: ProductCardProps) => {
  const isTigrillo = product.categoria.toLowerCase().includes('tigrillo');
  const [selectedMasa, setSelectedMasa] = useState<Product['masa']>(product.masa || 'Verde');

  return (
    <motion.div 
      layout
      className={`relative p-6 rounded-[32px] transition-all duration-300 flex flex-col justify-between ${
        quantity > 0 
          ? 'bg-zinc-900/80 border-2 border-green-500 shadow-2xl shadow-green-500/10' 
          : 'bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700'
      }`}
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          {quantity > 0 ? (
            <div className="bg-green-racimo text-white-arena text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-tighter">En el Carrito</div>
          ) : (
            <div className="bg-zinc-800 text-zinc-400 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-tighter">Disponible</div>
          )}
          <span className="text-2xl font-black text-gold-ocre">${Number(product.precio).toFixed(2)}</span>
        </div>
        
        <h3 className="text-xl font-extrabold mb-1 text-white-arena">{product.nombre}</h3>
        <p className="text-zinc-500 text-sm leading-snug mb-4 line-clamp-2">{product.descripcion}</p>

        {isTigrillo && quantity > 0 && (
          <div className="space-y-2 mb-4">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Personalizar Masa</span>
            <div className="flex gap-2">
              {(['Verde', 'Pintón', 'Maduro'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setSelectedMasa(m);
                    onUpdateQuantity(product.id, 0, m);
                  }}
                  className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${
                    selectedMasa === m 
                      ? 'bg-gold-ocre text-black shadow-lg shadow-gold-ocre/20' 
                      : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {m.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        {quantity > 0 ? (
          <>
            <div className="flex items-center gap-4 bg-zinc-800 rounded-2xl p-1">
              <button 
                onClick={() => onUpdateQuantity(product.id, -1, selectedMasa)}
                className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-zinc-700/50 hover:bg-zinc-700 rounded-xl btn-press"
              >
                <Minus size={18} />
              </button>
              <span className="font-black w-6 text-center">{quantity}</span>
              <button 
                onClick={() => onUpdateQuantity(product.id, 1, selectedMasa)}
                className="w-10 h-10 flex items-center justify-center text-xl font-bold bg-zinc-700/50 hover:bg-zinc-700 rounded-xl btn-press"
              >
                <Plus size={18} />
              </button>
            </div>
            <button 
              onClick={() => onUpdateQuantity(product.id, -quantity, selectedMasa)}
              className="text-sm font-bold text-zinc-500 underline underline-offset-4 btn-press"
            >
              Quitar
            </button>
          </>
        ) : (
          <button 
            onClick={() => onUpdateQuantity(product.id, 1, selectedMasa)}
            className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl transition-all btn-press"
          >
            AGREGAR AL PEDIDO
          </button>
        )}
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [screen, setScreen] = useState<'welcome' | 'menu' | 'success'>('welcome');
  const [menuData, setMenuData] = useState<Record<string, Product[]>>({});
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Efectivo');
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(SHEET_API_URL);
      if (!response.ok) throw new Error('Network response was not ok');
      const rawData = await response.json();
      
      const formatted: Record<string, Product[]> = {};
      Object.keys(rawData).forEach(key => {
        const catKey = key.toLowerCase().trim();
        formatted[catKey] = rawData[key].map((p: any) => {
          // Robust availability check: handles "Si", "SÍ", "si", "  si  ", etc.
          const checkKey = (obj: any) => {
            const keys = Object.keys(obj);
            const found = keys.find(k => k.toLowerCase().trim() === 'disponible');
            return found ? obj[found] : 'SI';
          };
          
          const rawVal = checkKey(p);
          const isAvailable = String(rawVal).trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase() === 'SI';
          
          return {
            id: String(p.id || p.nombre || p.Nombre || '').replace(/\s+/g, ''),
            nombre: p.nombre || p.Nombre || 'Producto',
            descripcion: p.descripcion || p.Descripcion || '',
            precio: parseFloat(p.precio || p.Precio || 0),
            disponible: isAvailable ? 'SI' : 'NO',
            categoria: catKey
          };
        });
      });
      setMenuData(formatted);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const currentProducts = useMemo(() => {
    const products = menuData[activeCategory] || [];
    return products.filter(p => p.disponible === 'SI');
  }, [menuData, activeCategory]);

  const cartTotal = useMemo(() => {
    return Object.values(cart).reduce((acc: number, item: CartItem) => acc + (item.precio * item.quantity), 0);
  }, [cart]);

  const totalItems = useMemo(() => {
    return Object.values(cart).reduce((acc: number, item: CartItem) => acc + item.quantity, 0);
  }, [cart]);

  const updateQuantity = (id: string, delta: number, masa?: Product['masa']) => {
    setCart(prev => {
      const newCart = { ...prev };
      const product = menuData[activeCategory]?.find(p => p.id === id);
      
      if (!product) return prev;

      if (!newCart[id]) {
        if (delta > 0) {
          newCart[id] = { ...product, quantity: 1, masa: masa || 'Verde' };
        }
      } else {
        newCart[id].quantity += delta;
        if (masa) newCart[id].masa = masa;
        if (newCart[id].quantity <= 0) delete newCart[id];
      }
      return newCart;
    });
  };

  const confirmOrder = () => {
    if (totalItems === 0) return;
    setIsCartOpen(false);
    setScreen('success');
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen onRetry={fetchMenu} />;

  return (
    <div className="max-w-[480px] mx-auto min-h-screen bg-bg-black overflow-x-hidden relative shadow-2xl">
      <AnimatePresence mode="wait">
        
        {/* Welcome Screen */}
        {screen === 'welcome' && (
          <motion.section 
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex h-screen relative bg-bg-black overflow-hidden"
          >
            <div className="absolute inset-0 z-0">
              <img 
                src="https://i.pinimg.com/736x/0f/ec/e6/0fece6af373591ae489d4f1322183b40.jpg" 
                alt="Tigrillo Masterpiece" 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-black via-bg-black/40 to-transparent" />
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-gold-ocre rounded-full blur-[120px] opacity-25"></div>
            </div>
            
            <div className="relative z-10 p-8 flex flex-col h-full justify-between w-full">
              <div className="space-y-6 mt-12">
                <div className="w-16 h-16 bg-gold-ocre rounded-2xl flex items-center justify-center shadow-xl shadow-gold-ocre/20">
                  <span className="text-black font-black text-3xl">PR</span>
                </div>
                <motion.h1 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-white-arena text-6xl font-extrabold tracking-tight leading-[0.85] uppercase"
                >
                  Puerto <br /><span className="text-gold-ocre">Racimo</span>
                </motion.h1>
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-zinc-400 text-lg font-medium leading-relaxed max-w-[280px]"
                >
                  El sabor auténtico del Tigrillo tradicional, directo desde nuestra cocina a tu mesa.
                </motion.p>
              </div>

              <div className="space-y-6 mb-10">
                <div className="p-5 bg-zinc-800/50 rounded-3xl border border-zinc-700/50 backdrop-blur-md">
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2 font-bold">Entrega estimada</span>
                  <div className="flex items-center gap-3">
                    <Clock className="text-gold-ocre" size={20} />
                    <p className="text-xl font-bold text-white-arena">25 - 35 Minutos</p>
                  </div>
                </div>
                <motion.button 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  onClick={() => setScreen('menu')}
                  className="w-full py-5 bg-gold-ocre hover:bg-gold-hover text-black font-black rounded-3xl transition-all shadow-2xl shadow-gold-ocre/20 btn-press text-lg"
                >
                  EXPLORAR MENÚ
                </motion.button>
              </div>
            </div>
          </motion.section>
        )}

        {/* Menu Screen */}
        {screen === 'menu' && (
          <motion.section 
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-screen"
          >
            {/* Nav */}
            <header className="sticky-nav flex justify-between items-center px-6 py-6 border-zinc-800">
              <button 
                onClick={() => setScreen('welcome')} 
                className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl btn-press text-zinc-400"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-gold-ocre uppercase tracking-widest leading-none mb-1">Puerto Racimo</span>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-racimo rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold text-zinc-400">Cocina Abierta</span>
                </div>
              </div>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-3 bg-zinc-900 border border-zinc-800 rounded-2xl btn-press text-white-arena"
              >
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gold-ocre text-black text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-bg-black"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </button>
            </header>

            {/* Categories */}
            <div className="sticky top-[89px] z-40 bg-bg-black/80 backdrop-blur-md px-6 py-4 overflow-x-auto no-scrollbar border-b border-zinc-800/50">
              <div className="flex gap-4">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all btn-press ${
                      activeCategory === cat.id 
                        ? 'bg-gold-ocre text-black shadow-lg shadow-gold-ocre/10' 
                        : 'bg-zinc-900 text-zinc-500 hover:bg-zinc-800 border border-zinc-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Feed */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 pb-32 space-y-4">
              {currentProducts.length > 0 ? (
                currentProducts.map(prod => (
                  <ProductCard 
                    key={prod.id} 
                    product={prod} 
                    quantity={cart[prod.id]?.quantity || 0}
                    onUpdateQuantity={updateQuantity}
                  />
                ))
              ) : (
                <div className="py-20 text-center opacity-50">
                  <p className="font-medium italic">Sección no disponible por ahora.</p>
                </div>
              )}
            </div>

            {/* Float Cart Indicator */}
            {totalItems > 0 && !isCartOpen && (
              <motion.div 
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="fixed bottom-8 right-8 z-50 flex justify-end"
              >
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="flex items-center gap-6 bg-gold-ocre p-4 rounded-[28px] shadow-2xl shadow-gold-ocre/40 border-4 border-bg-black btn-press"
                >
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] font-black text-black/60 uppercase tracking-widest">Total Pedido</span>
                    <span className="text-2xl font-black text-black leading-none">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="h-10 w-[1px] bg-black/10"></div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-black text-sm">VER CARRITO</span>
                    <div className="w-8 h-8 bg-black text-gold-ocre rounded-full flex items-center justify-center">
                      <ShoppingCart size={14} strokeWidth={3} />
                    </div>
                  </div>
                </button>
              </motion.div>
            )}
          </motion.section>
        )}

        {/* Success Screen */}
        {screen === 'success' && (
          <motion.section 
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-screen items-center justify-center p-8 text-center bg-bg-black"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10, stiffness: 100 }}
              className="w-24 h-24 bg-green-racimo rounded-full flex items-center justify-center text-white-arena mb-8 shadow-2xl shadow-green-racimo/30"
            >
              <CheckCircle2 size={48} />
            </motion.div>
            <h2 className="text-4xl font-black text-white-arena mb-4 leading-tight">
              ¡ORDEN<br />CONFIRMADA!
            </h2>
            <p className="text-zinc-500 mb-10 max-w-[280px] font-medium leading-relaxed">
              {paymentMethod === 'Transferencia' 
                ? "Tu pedido está siendo preparado. Por favor envía el comprobante por WhatsApp." 
                : "Paga en efectivo al momento de recibir tu pedido."}
            </p>
            
            <div className="w-full max-w-[280px] bg-zinc-900 p-8 rounded-[40px] mb-12 border border-zinc-800 shadow-xl">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-500 block mb-2">TIEMPO ESTIMADO</span>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-6xl font-display font-black text-gold-ocre">25</span>
                <span className="text-xl font-bold text-zinc-500">min</span>
              </div>
            </div>

            <button 
              onClick={() => {
                setCart({});
                setScreen('welcome');
              }}
              className="w-full max-w-[300px] bg-white-arena text-black py-5 rounded-2xl font-black text-lg shadow-xl btn-press"
            >
              VOLVER AL INICIO
            </button>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
            />            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto h-[85vh] bg-zinc-950 rounded-t-[48px] z-[101] flex flex-col overflow-hidden shadow-2xl border-t border-zinc-800"
            >
              <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mt-4 mb-6" />
              
              <div className="px-8 flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-black text-white-arena uppercase tracking-tight">Mi Pedido</h2>
                  <p className="text-[10px] text-zinc-500 font-black tracking-[0.2em]">{totalItems} ARTÍCULOS</p>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl btn-press text-zinc-400">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-8 space-y-6">
                {(Object.values(cart) as CartItem[]).map((item) => (
                  <div key={item.id} className="flex justify-between items-center group py-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-gold-ocre bg-gold-ocre/10 px-2.5 py-1 rounded-xl text-xs">{item.quantity}x</span>
                        <h4 className="font-bold text-white-arena text-lg">{item.nombre}</h4>
                      </div>
                      {item.masa && (
                        <p className="text-[10px] text-zinc-500 font-bold ml-[46px] mt-1 tracking-widest uppercase">Masa: {item.masa}</p>
                      )}
                    </div>
                    <span className="font-black text-white-arena text-lg ml-4">${(item.precio * item.quantity).toFixed(2)}</span>
                  </div>
                ))}

                {Object.keys(cart).length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                    <ShoppingCart size={80} className="mb-6" />
                    <p className="font-black text-xl">Tu carrito está vacío</p>
                  </div>
                )}
              </div>

              <div className="p-8 pb-10 bg-zinc-900 rounded-t-[48px] border-t border-zinc-800">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-zinc-500 font-bold text-sm uppercase tracking-widest">Total Pedido</span>
                  <span className="text-3xl font-black text-white-arena">${cartTotal.toFixed(2)}</span>
                </div>

                <div className="space-y-4 mb-10">
                  <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-600 text-center">Método de pago</p>
                  <div className="flex bg-black p-2 rounded-[24px] gap-2 border border-zinc-800">
                    <button 
                      onClick={() => setPaymentMethod('Efectivo')}
                      className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm transition-all ${
                        paymentMethod === 'Efectivo' 
                          ? 'bg-zinc-800 text-white-arena border border-zinc-700 shadow-xl' 
                          : 'text-zinc-600'
                      }`}
                    >
                      <MapPin size={16} /> Efectivo
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('Transferencia')}
                      className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm transition-all ${
                        paymentMethod === 'Transferencia' 
                          ? 'bg-zinc-800 text-white-arena border border-zinc-700 shadow-xl' 
                          : 'text-zinc-600'
                      }`}
                    >
                      <Smartphone size={16} /> Transferencia
                    </button>
                  </div>
                </div>

                <button 
                  onClick={confirmOrder}
                  disabled={totalItems === 0}
                  className={`w-full py-5 rounded-[24px] font-black text-xl transition-all flex items-center justify-center gap-4 btn-press ${
                    totalItems > 0 
                      ? 'bg-gold-ocre text-black shadow-2xl shadow-gold-ocre/20 active:bg-gold-hover' 
                      : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                  }`}
                >
                  <ShieldCheck size={24} /> PAGAR ORDEN
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

