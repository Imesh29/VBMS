# VBMS Notification + Booking Workflow Setup

## 1. Database
Run `database/20260911_add_notifications.sql` once against the VBMS PostgreSQL database.

It adds:
- `bookings.cancellation_reason`
- `notifications` table
- notification indexes

## 2. Dependency
Install dependencies after replacing the backend files:

```bash
npm install
```

`nodemailer` was added to `package.json`.

## 3. Dean email configuration
Copy the values from `.env.notification.example` into your existing `.env` and provide real SMTP credentials.

For Gmail, use an App Password instead of your normal account password.

To develop without email delivery, set:

```env
EMAIL_ENABLED=false
```

In-app notifications continue to work when email is disabled.

## 4. New notification API

- `GET /api/notifications?limit=20`
- `PATCH /api/notifications/:id/read`
- `PATCH /api/notifications/read-all`

All require a valid JWT.

## 5. Updated cancellation API

`PATCH /api/admin/bookings/:id/cancel`

Body:

```json
{
  "reason": "Vehicle requires urgent maintenance."
}
```

The reason is required and stored in `bookings.cancellation_reason`.

## Workflow

1. Staff creates booking -> Staff gets in-app notification; all active DEAN users get in-app notification and email.
2. Dean approves -> booking owner gets in-app notification.
3. Admin confirms -> booking owner gets in-app notification.
4. Admin cancels with reason -> booking owner gets in-app notification containing the reason.
5. Admin completes -> booking owner gets in-app notification.

### Current schema limitation
The current users table has no faculty-to-dean relationship. Therefore a new booking is sent to every active user with role `DEAN`. If the system later stores a faculty/dean mapping, `findActiveUsersByRole("DEAN")` can be replaced with a faculty-specific lookup.
