-- Permanently drop the status check constraint so any text value is valid
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;