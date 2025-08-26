This project implements a POST /webhooks/payments endpoint that records payment events and updates an invoice’s status in the database.

# Installation & Running

1. Clone the repository
2. Install dependencies
3. Create enviroment files in the project root:

- .env.development
- .env.test
  (with PGDATABASE=circlehealth_development & PGDATABASE=circlehealth_test respectively - only shared for demo purposes)
  ensure .env.\* files are .gitignored

4. Set up and seed the databases:

- npm run setup-dbs
- npm run seed-dev

5. Start the server

- npm run start

To run the test suite: npm test

# Example Request

POST /webhooks/payments
Content-Type: application/json

{
event_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
type: "payment",
invoice_id: "11111111-1111-1111-1111-111111111111",
amount_cents: 5000,
}

# Example Response (200 OK)

{
"ok": true
}

# Example Error (400 Bad Request)

{
"ok": false,
"error": "Invalid invoice_id"
}
