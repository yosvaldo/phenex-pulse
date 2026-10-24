import resend from "../lib/resend";
import renderTemplate from "../lib/handlebars";

const SENDER_EMAIL = "Phenex Pulse <onboarding@resend.dev>";
const ADMIN_EMAIL = "yosvaldo.oc@gmail.com";

const EmailService = {
  sendReorderAlert: async (products: any[]) => {
    try {
      const html = renderTemplate("reorder.hbs", { products });
      await resend.emails.send({
        from: SENDER_EMAIL,
        to: [ADMIN_EMAIL],
        subject: "🚨 Action Required: Phenex Production Reorder",
        html,
      });
    } catch (error) {
      console.error("Failed to send reorder alert:", error);
    }
  },

  sendCollectionAlert: async (invoices: any[]) => {
    try {
      const html = renderTemplate("collection.hbs", { invoices });
      await resend.emails.send({
        from: SENDER_EMAIL,
        to: [ADMIN_EMAIL],
        subject: "💰 Action Required: Distributor Payment Collection",
        html,
      });
    } catch (error) {
      console.error("Failed to send collection alert:", error);
    }
  }
};

export default EmailService;