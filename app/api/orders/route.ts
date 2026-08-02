import { NextResponse } from "next/server";
import { getStoredOrdersAsync, addOrder, Order } from "../../../lib/ordersStore";

// GET /api/orders - Fetch all orders live from PostgreSQL / store for Admin & Trackers
export async function GET() {
  try {
    const orders = await getStoredOrdersAsync();
    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST /api/orders - Save new Cash on Delivery checkout order to PostgreSQL
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.customerName || !body.phone || !body.address || !body.items) {
      return NextResponse.json(
        { success: false, message: "Missing required order fields" },
        { status: 400 }
      );
    }

    const orderId = body.id || `VOD-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      id: orderId,
      customerName: body.customerName,
      phone: body.phone,
      email: body.email || "",
      city: body.city || "Karachi",
      address: body.address,
      landmark: body.landmark || "",
      notes: body.notes || "",
      items: body.items,
      totalAmount: body.totalAmount || 3500,
      paymentMethod: "Cash on Delivery",
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    const savedOrder = addOrder(newOrder);

    // Action: Send real-time Email Notification to Admin (agha.irtiza.rizvi@gmail.com)
    const adminEmail = process.env.ADMIN_EMAIL || "agha.irtiza.rizvi@gmail.com";
    const resendApiKey = process.env.RESEND_API_KEY;
    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

    const firstItem = savedOrder.items?.[0] || { name: "Official SIM Card Package", price: 3500, image: "/product pictures/Vodafone_img1_202304.jpg", carrier: "Vodafone UK" };
    const itemName = firstItem.name;
    const itemCarrier = firstItem.carrier || "Vodafone UK";
    const formattedPrice = `Rs. ${Number(savedOrder.totalAmount || firstItem.price || 3500).toLocaleString()}`;
    const cleanWaPhone = (savedOrder.phone || "").replace(/\D/g, "").replace(/^0/, "92");

    // Local file path resolution for CID email attachment
    const pathModule = await import("path");
    const fsModule = await import("fs");
    
    let rawImg = firstItem.image || "/product pictures/Vodafone_img1_202304.jpg";
    if (rawImg.startsWith("/")) rawImg = rawImg.substring(1);
    const localImgPath = pathModule.default.join(process.cwd(), "public", decodeURIComponent(rawImg));
    const hasLocalImage = fsModule.default.existsSync(localImgPath);

    const emailSubject = `📦 New SIM Order #${savedOrder.id} - ${savedOrder.customerName} (${savedOrder.city})`;
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Plus Jakarta Sans','Segoe UI',Roboto,sans-serif;color:#334155;-webkit-font-smoothing:antialiased;">
  
  <!-- Main Container Box (760px Wide) -->
  <div style="max-width:760px;width:100%;margin:32px auto;background-color:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);border:1px solid #e2e8f0;">
    
    <!-- Top Red Brand Accent Bar -->
    <div style="background:#E60000;height:5px;width:100%;"></div>

    <!-- Header Section -->
    <div style="padding:36px 44px 24px;border-bottom:1px solid #f1f5f9;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td>
            <div style="color:#E60000;font-weight:700;font-size:13px;letter-spacing:0.8px;text-transform:uppercase;margin-bottom:4px;">
              Vodafone Pakistan SIM Hub
            </div>
            <h1 style="margin:0;font-size:22px;font-weight:700;color:#0f172a;letter-spacing:-0.3px;">
              New Order Received
            </h1>
          </td>
          <td style="text-align:right;vertical-align:middle;">
            <span style="background:#fff1f2;color:#e11d48;font-size:13px;font-weight:700;padding:6px 16px;border-radius:8px;border:1px solid #ffe4e6;font-family:monospace;">
              #${savedOrder.id}
            </span>
          </td>
        </tr>
      </table>
    </div>

    <!-- Main Content Container -->
    <div style="padding:36px 44px;">
      
      <!-- Ordered Product Section with Embedded Image -->
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:24px;margin-bottom:32px;">
        <div style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:16px;">
          Ordered SIM Package
        </div>

        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <!-- Product Thumbnail -->
            <td style="width:88px;vertical-align:top;padding-right:20px;">
              <img src="${hasLocalImage ? 'cid:product_image' : 'https://vodafonesimhub.pk/product%20pictures/Vodafone_img1_202304.jpg'}" alt="${itemName}" style="width:88px;height:88px;object-fit:cover;border-radius:12px;border:1px solid #cbd5e1;background:#ffffff;display:block;" />
            </td>

            <!-- Product Details -->
            <td style="vertical-align:top;">
              <div style="font-size:11px;font-weight:700;color:#E60000;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px;">
                ${itemCarrier}
              </div>
              <div style="font-size:17px;font-weight:700;color:#0f172a;line-height:1.4;margin-bottom:8px;">
                ${itemName}
              </div>
              <div style="font-size:18px;font-weight:800;color:#E60000;">
                ${formattedPrice} <span style="font-size:12px;color:#64748b;font-weight:500;margin-left:8px;">(Cash on Delivery)</span>
              </div>
            </td>
          </tr>
        </table>
      </div>

      <!-- Customer & Delivery Info Section -->
      <div style="margin-bottom:36px;">
        <div style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:16px;letter-spacing:-0.1px;">
          Customer & Delivery Information
        </div>

        <table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
          <tr style="border-bottom:1px solid #f1f5f9;background:#ffffff;">
            <td style="padding:13px 20px;color:#64748b;font-weight:500;width:30%;">Customer Name</td>
            <td style="padding:13px 20px;color:#0f172a;font-weight:600;">${savedOrder.customerName}</td>
          </tr>
          <tr style="border-bottom:1px solid #f1f5f9;background:#f8fafc;">
            <td style="padding:13px 20px;color:#64748b;font-weight:500;">Phone Number</td>
            <td style="padding:13px 20px;color:#0f172a;font-weight:600;font-family:monospace;">${savedOrder.phone}</td>
          </tr>
          <tr style="border-bottom:1px solid #f1f5f9;background:#ffffff;">
            <td style="padding:13px 20px;color:#64748b;font-weight:500;">WhatsApp Number</td>
            <td style="padding:13px 20px;color:#0f172a;font-weight:600;font-family:monospace;">${savedOrder.phone}</td>
          </tr>
          ${savedOrder.email ? `
          <tr style="border-bottom:1px solid #f1f5f9;background:#f8fafc;">
            <td style="padding:13px 20px;color:#64748b;font-weight:500;">Email Address</td>
            <td style="padding:13px 20px;color:#2563eb;font-weight:500;">${savedOrder.email}</td>
          </tr>
          ` : ""}
          <tr style="border-bottom:1px solid #f1f5f9;background:#ffffff;">
            <td style="padding:13px 20px;color:#64748b;font-weight:500;">Delivery Address</td>
            <td style="padding:13px 20px;color:#0f172a;font-weight:500;line-height:1.5;">${savedOrder.address} ${savedOrder.landmark ? `(Near: ${savedOrder.landmark})` : ""}</td>
          </tr>
          <tr style="background:#f8fafc;">
            <td style="padding:13px 20px;color:#64748b;font-weight:500;">City / Region</td>
            <td style="padding:13px 20px;color:#0f172a;font-weight:600;">${savedOrder.city}, Pakistan</td>
          </tr>
        </table>
      </div>

      <!-- Professional WhatsApp Button with Logo Icon -->
      <div style="text-align:center;margin-top:28px;">
        <a href="https://wa.me/${cleanWaPhone}?text=Hi%20${encodeURIComponent(savedOrder.customerName)},%20your%20Vodafone%20SIM%20order%20%23${savedOrder.id}%20details%20have%20been%20received!%20Please%20confirm%20your%20delivery%20address." 
           style="display:inline-flex;align-items:center;justify-content:center;background:#25D366;color:#ffffff;font-weight:700;font-size:15px;padding:15px 36px;border-radius:12px;text-decoration:none;box-shadow:0 4px 14px rgba(37,211,102,0.3);letter-spacing:0.2px;">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/120px-WhatsApp.svg.png" width="22" height="22" style="vertical-align:middle;margin-right:10px;display:inline-block;" alt="WhatsApp" />
          <span>Chat with Customer on WhatsApp →</span>
        </a>
      </div>

    </div>

    <!-- Footer -->
    <div style="padding:22px 40px;background:#f8fafc;border-top:1px solid #f1f5f9;text-align:center;font-size:12px;color:#94a3b8;font-weight:400;">
      Vodafone Pakistan SIM Hub • Official Automated Dispatch System
    </div>

  </div>
</body>
</html>
    `;

    const attachmentsList = hasLocalImage ? [{ filename: "product.jpg", path: localImgPath, cid: "product_image" }] : [];

    if (resendApiKey) {
      import("resend").then(({ Resend }) => {
        const resend = new Resend(resendApiKey);
        resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "Vodafone SIM Hub <orders@resend.dev>",
          to: adminEmail,
          subject: emailSubject,
          html: emailHtml,
        }).then(() => console.log(`[Resend Email] Sent order ${savedOrder.id} to ${adminEmail}`))
          .catch((err) => console.error("[Resend Error]:", err));
      }).catch(console.error);
    } else if (smtpUser && smtpPass) {
      import("nodemailer").then((nodemailer) => {
        const isGmail = smtpUser.includes("@gmail.com");
        const transporter = nodemailer.createTransport(
          isGmail
            ? { service: "gmail", auth: { user: smtpUser, pass: smtpPass } }
            : { host: process.env.SMTP_HOST || "smtp.gmail.com", port: 465, secure: true, auth: { user: smtpUser, pass: smtpPass } }
        );
        transporter.sendMail({
          from: `"Vodafone SIM Hub" <${smtpUser}>`,
          to: adminEmail,
          subject: emailSubject,
          html: emailHtml,
          attachments: attachmentsList,
        }).then((info) => console.log(`[Gmail SMTP] Sent order ${savedOrder.id} to ${adminEmail}, MessageId: ${info.messageId}`))
          .catch((err) => console.error("[Gmail SMTP Error]:", err));
      }).catch(console.error);
    }

    if (resendApiKey) {
      import("resend").then(({ Resend }) => {
        const resend = new Resend(resendApiKey);
        resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "Vodafone SIM Hub <orders@resend.dev>",
          to: adminEmail,
          subject: emailSubject,
          html: emailHtml,
        }).then(() => console.log(`[Resend Email] Sent order ${savedOrder.id} to ${adminEmail}`))
          .catch((err) => console.error("[Resend Error]:", err));
      }).catch(console.error);
    } else if (smtpUser && smtpPass) {
      import("nodemailer").then((nodemailer) => {
        const isGmail = smtpUser.includes("@gmail.com");
        const transporter = nodemailer.createTransport(
          isGmail
            ? { service: "gmail", auth: { user: smtpUser, pass: smtpPass } }
            : { host: process.env.SMTP_HOST || "smtp.gmail.com", port: 465, secure: true, auth: { user: smtpUser, pass: smtpPass } }
        );
        transporter.sendMail({
          from: `"Vodafone SIM Hub" <${smtpUser}>`,
          to: adminEmail,
          subject: emailSubject,
          html: emailHtml,
        }).then((info) => console.log(`[Gmail SMTP] Sent order ${savedOrder.id} to ${adminEmail}, MessageId: ${info.messageId}`))
          .catch((err) => console.error("[Gmail SMTP Error]:", err));
      }).catch(console.error);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        order: savedOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to create order" },
      { status: 500 }
    );
  }
}
