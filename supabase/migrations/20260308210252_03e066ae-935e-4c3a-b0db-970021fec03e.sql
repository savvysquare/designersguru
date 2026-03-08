-- Drop the constraint first, then update rows, then re-add with all valid statuses
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;

UPDATE public.orders SET status = 'awaiting_payment' WHERE status NOT IN ('pending', 'awaiting_payment', 'deposit_paid', 'paid', 'in_progress', 'completed', 'cancelled');

ALTER TABLE public.orders ADD CONSTRAINT orders_status_check 
  CHECK (status IN ('pending', 'awaiting_payment', 'deposit_paid', 'paid', 'in_progress', 'completed', 'cancelled'));