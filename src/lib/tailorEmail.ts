import { Resend } from "resend";
import { Occasion } from "@prisma/client";

const resend = new Resend(process.env.RESEND_API_KEY);

const COMMISSION_NOTICE =
  "Tailor commission will be sent after confirmation by the tailor.";

export interface TailorNotificationInput {
  tailorEmail: string;
  tailorName: string;
  styleName: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  occasion: Occasion;
  yardsNeeded: number;
  totalPrice: number;
  fabricImageUrl: string;
  styleImageUrl: string;
}

export async function sendTailorOrderNotification(input: TailorNotificationInput) {
  const html = `
    <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
      <h2>New Order: ${input.styleName}</h2>
      <p>Hi ${input.tailorName}, you have a new order from ${input.customerName}.</p>
      <table cellpadding="6" style="border-collapse: collapse;">
        <tr><td><strong>Customer</strong></td><td>${input.customerName}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${input.customerPhone}</td></tr>
        <tr><td><strong>Address</strong></td><td>${input.customerAddress}</td></tr>
        <tr><td><strong>Occasion</strong></td><td>${input.occasion}</td></tr>
        <tr><td><strong>Yards needed</strong></td><td>${input.yardsNeeded}</td></tr>
        <tr><td><strong>Fabric cost paid</strong></td><td>₦${input.totalPrice.toLocaleString()}</td></tr>
      </table>
      <p><strong>${COMMISSION_NOTICE}</strong></p>
      <p><strong>Fabric photo:</strong></p>
      <img src="${input.fabricImageUrl}" alt="Fabric photo" style="max-width: 100%; border-radius: 8px;" />
      <p><strong>Chosen style:</strong></p>
      <img src="${input.styleImageUrl}" alt="${input.styleName}" style="max-width: 100%; border-radius: 8px;" />
    </div>
  `;

  await resend.emails.send({
    from: process.env.NOTIFICATIONS_FROM_EMAIL ?? "orders@example.com",
    to: input.tailorEmail,
    subject: `New Order: ${input.styleName} for ${input.customerName}`,
    html,
  });
}
