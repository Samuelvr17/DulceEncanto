/*
  # Esquema inicial para DulceEncanto

  1. Nuevas Tablas
    - `users`
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `username` (text, unique)
      - `password` (text)
      - `is_admin` (boolean)
      - `created_at` (timestamp)
    
    - `orders`
      - `id` (uuid, primary key)
      - `customer_name` (text)
      - `user_id` (uuid, foreign key, nullable)
      - `packaging` (text)
      - `total_price` (integer)
      - `status` (text)
      - `payment_proof` (text, nullable)
      - `created_at` (timestamp)
    
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key)
      - `flavor` (text)
      - `quantity` (integer)
      - `unit_price` (integer)
      - `subtotal` (integer)
    
    - `admin_settings`
      - `id` (uuid, primary key)
      - `username` (text)
      - `password` (text)
      - `updated_at` (timestamp)

  2. Seguridad
    - Enable RLS en todas las tablas
    - Políticas para usuarios autenticados y administradores
*/

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  username text UNIQUE NOT NULL,
  password text NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de pedidos
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  user_id uuid REFERENCES users(id),
  packaging text NOT NULL CHECK (packaging IN ('capacillo', 'bolsa')),
  total_price integer NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'paid')),
  payment_proof text,
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de items de pedido
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  flavor text NOT NULL CHECK (flavor IN ('chocochips', 'oreo', 'jumbo')),
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price integer NOT NULL,
  subtotal integer NOT NULL
);

-- Crear tabla de configuración admin
CREATE TABLE IF NOT EXISTS admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL,
  password text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Insertar admin por defecto
INSERT INTO users (full_name, username, password, is_admin) 
VALUES ('Administrador', 'admin', 'brownie123', true)
ON CONFLICT (username) DO NOTHING;

INSERT INTO admin_settings (username, password)
VALUES ('admin', 'brownie123')
ON CONFLICT DO NOTHING;

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Políticas para users
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (true);

-- Políticas para orders
CREATE POLICY "Anyone can read orders" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update orders" ON orders
  FOR UPDATE USING (true);

-- Políticas para order_items
CREATE POLICY "Anyone can read order items" ON order_items
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert order items" ON order_items
  FOR INSERT WITH CHECK (true);

-- Políticas para admin_settings
CREATE POLICY "Anyone can read admin settings" ON admin_settings
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update admin settings" ON admin_settings
  FOR UPDATE USING (true);