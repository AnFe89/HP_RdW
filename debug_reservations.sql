-- Simpler Debug View
-- Run this and tell me if you see any rows in the result table.

SELECT 
    r.id AS reservation_id,
    r.table_id, 
    to_char(r.start_time, 'YYYY-MM-DD HH24:MI') as time,
    p.username, 
    p.role,
    r.game_mode
FROM public.reservations r
LEFT JOIN public.profiles p ON r.user_id = p.id
WHERE 
    -- Check for Sturmhardt
    p.username = 'Sturmhardt' 
    OR 
    -- Check for ANY reservation on the 18th
    r.start_time::text LIKE '2025-12-18%';
