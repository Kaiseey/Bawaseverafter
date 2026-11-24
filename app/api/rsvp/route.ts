import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const full_name = String(body.full_name ?? '').trim().slice(0, 120);
    const email = String(body.email ?? '').trim().toLowerCase().slice(0, 254);
    const attendance = String(body.attendance ?? '');
    const guest_count = Number(body.guest_count ?? 1);
    const phone = String(body.phone ?? '').trim().slice(0, 40);
    const message = String(body.message ?? '').trim().slice(0, 1000);

    if (!full_name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !['yes', 'no'].includes(attendance) || !Number.isInteger(guest_count) || guest_count < 1 || guest_count > 4) {
      return NextResponse.json({ error: 'Please check your name, email, attendance and guest count.' }, { status: 400 });
    }

    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    const sharedSecret = process.env.GOOGLE_APPS_SCRIPT_SECRET;
    if (!scriptUrl || !sharedSecret) {
      return NextResponse.json({ error: 'RSVP collection is still being connected. Please try again shortly.' }, { status: 503 });
    }

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        secret: sharedSecret,
        full_name,
        email,
        phone,
        attendance,
        guest_count: attendance === 'yes' ? guest_count : 0,
        message,
      }),
      cache: 'no-store',
      redirect: 'follow',
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'We could not save your response. Please try again.' }, { status: 502 });
    }

    const result = await response.json();
    if (!result.success) {
      return NextResponse.json({ error: 'We could not save your response. Please try again.' }, { status: 502 });
    }

    return NextResponse.json({ success: true, emailSent: Boolean(result.emailSent) });
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again in a moment.' }, { status: 500 });
  }
}
