import "dotenv/config";
import nodemailer from "nodemailer";

const emailEnabled = process.env.EMAIL_ENABLED === "true";

const transporter = emailEnabled
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth:
        process.env.SMTP_USER && process.env.SMTP_PASS
          ? {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            }
          : undefined,
    })
  : null;

const formatDateTime = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-LK", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export const sendNewBookingToDean = async ({ dean, requester, booking, vehicle }) => {
  if (!emailEnabled || !transporter) {
    console.info("Email disabled. Skipping Dean booking email.");
    return;
  }

  if (!dean?.email) return;

  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;

  const text = [
    `Hello ${dean.full_name || "Dean"},`,
    "",
    "A new vehicle booking request is waiting for your approval.",
    "",
    `Booking reference: ${booking.booking_reference}`,
    `Requester: ${requester?.full_name || "Staff member"}`,
    `Requester email: ${requester?.email || "-"}`,
    `Department: ${requester?.department || "-"}`,
    `Vehicle: ${vehicle?.vehicle_name || "-"} (${vehicle?.vehicle_number || "-"})`,
    `Destination: ${booking.destination}`,
    `Purpose: ${booking.purpose}`,
    `Departure: ${formatDateTime(booking.departure_date)}`,
    `Return: ${formatDateTime(booking.return_date)}`,
    `Passengers: ${booking.passenger_count}`,
    "",
    "Please sign in to VBMS to review the request.",
  ].join("\n");

  await transporter.sendMail({
    from,
    to: dean.email,
    subject: `VBMS: New booking request ${booking.booking_reference}`,
    text,
  });
};
