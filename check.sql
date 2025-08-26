SELECT * FROM invoices;
SELECT * FROM payment_events;

SELECT * FROM payment_events WHERE event_id='bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

SELECT 
    i.id AS invoice_id,
    i.status,
    i.total_cents,
    i.paid_cents,
    COUNT(p.event_id) AS num_payments,
    SUM(p.amount_cents) AS sum_payments
FROM invoices i
LEFT JOIN payment_events p ON i.id = p.invoice_id
GROUP BY i.id, i.status, i.total_cents, i.paid_cents;