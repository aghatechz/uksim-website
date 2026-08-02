import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const credsPath = path.join(process.cwd(), "data", "admin-credentials.json");

// In-memory credentials cache — critical on Vercel where the filesystem is read-only.
// Keeps OTP + password changes working within the serverless instance lifetime.
let memoryCreds: any = null;

function getAdminCreds() {
  // 0. In-memory cache first (holds OTP/password updates made in this process)
  if (memoryCreds) {
    return memoryCreds;
  }

  // 1. Environment variables take priority (Vercel-safe — serverless filesystem is read-only)
  const envEmail = process.env.ADMIN_EMAIL;
  const envPassword = process.env.ADMIN_PASSWORD;
  if (envEmail && envPassword) {
    memoryCreds = {
      email: envEmail,
      password: envPassword,
      otp: null,
      otpExpiresAt: null,
    };
    return memoryCreds;
  }

  // 2. Local file fallback (for development)
  try {
    if (fs.existsSync(credsPath)) {
      const data = JSON.parse(fs.readFileSync(credsPath, "utf-8"));
      memoryCreds = data;
      return data;
    }
  } catch (err) {
    console.error("Error reading admin credentials:", err);
  }
  memoryCreds = {
    email: process.env.ADMIN_EMAIL || "agha.irtiza.rizvi@gmail.com",
    password: process.env.ADMIN_PASSWORD || "VodafoneAdmin#2026",
    otp: null,
    otpExpiresAt: null,
  };
  return memoryCreds;
}

function saveAdminCreds(creds: any) {
  memoryCreds = creds;
  try {
    const dir = path.dirname(credsPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(credsPath, JSON.stringify(creds, null, 2), "utf-8");
  } catch (err) {
    // On Vercel the filesystem is read-only — in-memory cache above still keeps it working
    console.error("Error saving admin credentials (file write skipped on serverless):", err);
  }
}

async function sendOtpEmail(email: string, otp: string) {
  const smtpUser = process.env.GMAIL_USER || process.env.SMTP_USER || "agha.irtiza.rizvi@gmail.com";
  const smtpPass = process.env.GMAIL_PASS || process.env.SMTP_PASS || "mbquzplszhkltmfp";

  const emailSubject = `🔐 ${otp} is your Vodafone Admin Password Reset Code`;
  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Vodafone Admin Security OTP</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:30px auto;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);border:1px solid #e2e8f0;">
    
    <!-- Top Brand Bar -->
    <div style="background:#E60000;padding:28px 36px;text-align:left;">
      <span style="font-size:24px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">vodafone</span>
      <span style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.85);margin-left:12px;text-transform:uppercase;letter-spacing:1.5px;">Admin Security Portal</span>
    </div>

    <!-- Main Content -->
    <div style="padding:40px 36px;text-align:center;">
      <div style="width:64px;height:64px;background:#fef2f2;border-radius:20px;margin:0 auto 20px auto;display:flex;align-items:center;justify-content:center;">
        <span style="font-size:32px;">🔐</span>
      </div>

      <h2 style="font-size:22px;font-weight:900;color:#0f172a;margin:0 0 10px 0;letter-spacing:-0.5px;">
        Admin Password Reset Request
      </h2>
      
      <p style="font-size:14px;color:#64748b;margin:0 0 28px 0;line-height:1.6;">
        We received a password reset request for your Vodafone Admin Control Panel (<strong style="color:#0f172a;">${email}</strong>). Use the 6-digit verification OTP code below to set a new password.
      </p>

      <!-- OTP Box -->
      <div style="background:#f8fafc;border:2px dashed #cbd5e1;border-radius:20px;padding:24px;margin:0 0 28px 0;display:inline-block;">
        <span style="font-size:38px;font-weight:900;font-family:monospace;color:#E60000;letter-spacing:8px;display:block;">
          ${otp}
        </span>
        <span style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-top:6px;display:block;">
          Valid for 10 Minutes Only
        </span>
      </div>

      <p style="font-size:12px;color:#94a3b8;margin:0;line-height:1.5;">
        If you did not request this password reset, please ignore this email or contact security immediately.
      </p>
    </div>

    <!-- Footer -->
    <div style="padding:20px 36px;background:#f8fafc;border-top:1px solid #f1f5f9;text-align:center;font-size:12px;color:#94a3b8;">
      Vodafone Pakistan SIM Hub • Executive Security Control
    </div>
  </div>
</body>
</html>
  `;

  if (smtpUser && smtpPass) {
    const nodemailer = await import("nodemailer");
    const isGmail = smtpUser.includes("@gmail.com");
    const transporter = nodemailer.createTransport(
      isGmail
        ? { service: "gmail", auth: { user: smtpUser, pass: smtpPass } }
        : { host: process.env.SMTP_HOST || "smtp.gmail.com", port: 465, secure: true, auth: { user: smtpUser, pass: smtpPass } }
    );

    await transporter.sendMail({
      from: `"Vodafone Admin Security" <${smtpUser}>`,
      to: email,
      subject: emailSubject,
      html: emailHtml,
    });
    console.log(`[Admin Security] OTP ${otp} emailed to ${email}`);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, password, otp, newPassword } = body;

    const creds = getAdminCreds();

    // 1. LOGIN ACTION
    if (action === "login") {
      if (!email || !password) {
        return NextResponse.json(
          { success: false, message: "Email and password are required" },
          { status: 400 }
        );
      }

      if (email.toLowerCase().trim() === creds.email.toLowerCase().trim() && password === creds.password) {
        return NextResponse.json(
          {
            success: true,
            message: "Authentication successful",
            admin: { email: creds.email },
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { success: false, message: "Invalid admin email or password" },
          { status: 401 }
        );
      }
    }

    // 2. FORGOT PASSWORD (GENERATE & EMAIL OTP)
    if (action === "forgot-password") {
      if (!email) {
        return NextResponse.json(
          { success: false, message: "Registered email address is required" },
          { status: 400 }
        );
      }

      if (email.toLowerCase().trim() !== creds.email.toLowerCase().trim()) {
        return NextResponse.json(
          { success: false, message: "Email address not found in admin registry" },
          { status: 404 }
        );
      }

      // Generate random 6-digit OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now

      creds.otp = generatedOtp;
      creds.otpExpiresAt = expiresAt;
      saveAdminCreds(creds);

      // Send OTP via Nodemailer
      await sendOtpEmail(creds.email, generatedOtp);

      return NextResponse.json(
        {
          success: true,
          message: `Security OTP sent to ${creds.email}. Please check your Gmail inbox.`,
        },
        { status: 200 }
      );
    }

    // 3. VERIFY OTP
    if (action === "verify-otp") {
      if (!otp) {
        return NextResponse.json(
          { success: false, message: "6-digit OTP code is required" },
          { status: 400 }
        );
      }

      if (!creds.otp || creds.otp !== otp.trim()) {
        return NextResponse.json(
          { success: false, message: "Incorrect OTP verification code" },
          { status: 400 }
        );
      }

      if (Date.now() > (creds.otpExpiresAt || 0)) {
        return NextResponse.json(
          { success: false, message: "OTP code has expired. Please request a new one." },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { success: true, message: "OTP code verified successfully" },
        { status: 200 }
      );
    }

    // 4. RESET PASSWORD
    if (action === "reset-password") {
      if (!otp || !newPassword) {
        return NextResponse.json(
          { success: false, message: "OTP and new password are required" },
          { status: 400 }
        );
      }

      if (newPassword.length < 1) {
        return NextResponse.json(
          { success: false, message: "New password cannot be empty" },
          { status: 400 }
        );
      }

      if (!creds.otp || creds.otp !== otp.trim()) {
        return NextResponse.json(
          { success: false, message: "Invalid or expired OTP code" },
          { status: 400 }
        );
      }

      if (Date.now() > (creds.otpExpiresAt || 0)) {
        return NextResponse.json(
          { success: false, message: "OTP code has expired. Please request a new one." },
          { status: 400 }
        );
      }

      // Update password
      creds.password = newPassword;
      creds.otp = null;
      creds.otpExpiresAt = null;
      saveAdminCreds(creds);

      return NextResponse.json(
        {
          success: true,
          message: "Password updated successfully! You can now log in with your new password.",
        },
        { status: 200 }
      );
    }

    // 5. UPDATE PROFILE PASSWORD (DIRECT FROM ADMIN PROFILE TAB)
    if (action === "update-profile-password") {
      const { currentPassword } = body;

      if (!currentPassword) {
        return NextResponse.json(
          { success: false, message: "Current admin password is required" },
          { status: 400 }
        );
      }

      if (currentPassword !== creds.password) {
        return NextResponse.json(
          { success: false, message: "Incorrect current admin password" },
          { status: 401 }
        );
      }

      if (!newPassword) {
        return NextResponse.json(
          { success: false, message: "New password is required" },
          { status: 400 }
        );
      }

      if (newPassword.length < 1) {
        return NextResponse.json(
          { success: false, message: "New password cannot be empty" },
          { status: 400 }
        );
      }

      // Update password directly
      creds.password = newPassword;
      creds.otp = null;
      creds.otpExpiresAt = null;
      saveAdminCreds(creds);

      return NextResponse.json(
        {
          success: true,
          message: "Admin password updated successfully!",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Invalid action type" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Admin Auth Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Authentication service failure" },
      { status: 500 }
    );
  }
}
