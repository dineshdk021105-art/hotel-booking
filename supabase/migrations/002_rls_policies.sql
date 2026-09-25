-- ============================================================
-- ITC GRAND CHOLA - ROW LEVEL SECURITY (RLS) POLICIES
-- Run this in your Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ============================================================

-- 1. PUBLIC READ POLICIES (Allows visitors & users to view rooms, food, and hotel info)
DROP POLICY IF EXISTS "Public read hotels" ON hotels;
CREATE POLICY "Public read hotels" ON hotels FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read room_types" ON room_types;
CREATE POLICY "Public read room_types" ON room_types FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read rooms" ON rooms;
CREATE POLICY "Public read rooms" ON rooms FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read room_rates" ON room_rates;
CREATE POLICY "Public read room_rates" ON room_rates FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read food_categories" ON food_categories;
CREATE POLICY "Public read food_categories" ON food_categories FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read food_items" ON food_items;
CREATE POLICY "Public read food_items" ON food_items FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read approved reviews" ON reviews;
CREATE POLICY "Public read approved reviews" ON reviews FOR SELECT TO anon, authenticated USING (status = 'approved');

-- 2. PROFILES POLICIES
DROP POLICY IF EXISTS "Users read own profile" ON profiles;
CREATE POLICY "Users read own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users update own profile" ON profiles;
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow profile creation on signup" ON profiles;
CREATE POLICY "Allow profile creation on signup" ON profiles FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admins manage profiles" ON profiles;
CREATE POLICY "Admins manage profiles" ON profiles FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')));

-- 3. BOOKINGS POLICIES
DROP POLICY IF EXISTS "Customers view own bookings" ON bookings;
CREATE POLICY "Customers view own bookings" ON bookings FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','staff')));

DROP POLICY IF EXISTS "Customers create bookings" ON bookings;
CREATE POLICY "Customers create bookings" ON bookings FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Customers update own bookings" ON bookings;
CREATE POLICY "Customers update own bookings" ON bookings FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','staff')));

-- 4. BOOKING ITEMS POLICIES
DROP POLICY IF EXISTS "Customers view booking items" ON booking_items;
CREATE POLICY "Customers view booking items" ON booking_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM bookings WHERE bookings.id = booking_items.booking_id AND (bookings.user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','staff')))));

DROP POLICY IF EXISTS "Customers insert booking items" ON booking_items;
CREATE POLICY "Customers insert booking items" ON booking_items FOR INSERT TO authenticated WITH CHECK (true);

-- 5. FOOD ORDERS POLICIES
DROP POLICY IF EXISTS "Customers view own food orders" ON food_orders;
CREATE POLICY "Customers view own food orders" ON food_orders FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','staff')));

DROP POLICY IF EXISTS "Customers create food orders" ON food_orders;
CREATE POLICY "Customers create food orders" ON food_orders FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Customers update food orders" ON food_orders;
CREATE POLICY "Customers update food orders" ON food_orders FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','staff')));

-- 6. FOOD ORDER ITEMS POLICIES
DROP POLICY IF EXISTS "Customers view food order items" ON food_order_items;
CREATE POLICY "Customers view food order items" ON food_order_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM food_orders WHERE food_orders.id = food_order_items.order_id AND (food_orders.user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','staff')))));

DROP POLICY IF EXISTS "Customers insert food order items" ON food_order_items;
CREATE POLICY "Customers insert food order items" ON food_order_items FOR INSERT TO authenticated WITH CHECK (true);

-- 7. REVIEWS POLICIES
DROP POLICY IF EXISTS "Customers create reviews" ON reviews;
CREATE POLICY "Customers create reviews" ON reviews FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users view own pending reviews" ON reviews;
CREATE POLICY "Users view own pending reviews" ON reviews FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR status = 'approved' OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','staff')));

-- 8. ADMIN MANAGEMENT POLICIES
DROP POLICY IF EXISTS "Admins manage hotels" ON hotels;
CREATE POLICY "Admins manage hotels" ON hotels FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','staff')));

DROP POLICY IF EXISTS "Admins manage room_types" ON room_types;
CREATE POLICY "Admins manage room_types" ON room_types FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','staff')));

DROP POLICY IF EXISTS "Admins manage rooms" ON rooms;
CREATE POLICY "Admins manage rooms" ON rooms FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','staff')));

DROP POLICY IF EXISTS "Admins manage room_rates" ON room_rates;
CREATE POLICY "Admins manage room_rates" ON room_rates FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','staff')));

DROP POLICY IF EXISTS "Admins manage food_categories" ON food_categories;
CREATE POLICY "Admins manage food_categories" ON food_categories FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','staff')));

DROP POLICY IF EXISTS "Admins manage food_items" ON food_items;
CREATE POLICY "Admins manage food_items" ON food_items FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','staff')));

DROP POLICY IF EXISTS "Admins manage bookings" ON bookings;
CREATE POLICY "Admins manage bookings" ON bookings FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','staff')));

DROP POLICY IF EXISTS "Admins manage food_orders" ON food_orders;
CREATE POLICY "Admins manage food_orders" ON food_orders FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','staff')));

DROP POLICY IF EXISTS "Admins manage reviews" ON reviews;
CREATE POLICY "Admins manage reviews" ON reviews FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','staff')));

-- 9. SERVICE ROLE BYPASS POLICIES
DROP POLICY IF EXISTS "Service role access hotels" ON hotels;
CREATE POLICY "Service role access hotels" ON hotels FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role access room_types" ON room_types;
CREATE POLICY "Service role access room_types" ON room_types FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role access food_items" ON food_items;
CREATE POLICY "Service role access food_items" ON food_items FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role access bookings" ON bookings;
CREATE POLICY "Service role access bookings" ON bookings FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role access food_orders" ON food_orders;
CREATE POLICY "Service role access food_orders" ON food_orders FOR ALL TO service_role USING (true) WITH CHECK (true);
