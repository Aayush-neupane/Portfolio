const RESEND_ENDPOINT = 'https://api.resend.com/emails'
const FROM = 'Alshan Rijal <no-reply@alshanrijal.com.np>'
const REPLY_TO = 'contact@alshanrijal.com.np'
const SUBJECT = 'Thanks for reaching out!'
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const escapeHtml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const json = (body, status = 200) => Response.json(body, { status })

export async function onRequestPost({ request, env }) {
  let payload
  try {
    payload = await request.json()
  } catch {
    return json({ error: 'Request body must be valid JSON.' }, 400)
  }

  const name = typeof payload?.name === 'string' ? payload.name.trim().slice(0, 100) : ''
  const email = typeof payload?.email === 'string' ? payload.email.trim() : ''

  if (!name || !EMAIL_PATTERN.test(email)) {
    return json({ error: 'A valid name and email are required.' }, 400)
  }

  if (!env.RESEND_API_KEY) {
    return json({ error: 'The auto-reply service is not configured.' }, 500)
  }

  const safeName = escapeHtml(name)

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background-color:#f4f1fa;font-family:'Segoe UI',Helvetica,Arial,sans-serif;color:#3b3550;">
    <div style="max-width:560px;margin:0 auto;padding:32px 16px;">
      <div style="background-color:#ffffff;border-radius:24px;padding:32px;box-shadow:0 18px 40px rgba(160,150,180,0.18);">
        <p style="margin:0;font-size:18px;font-weight:700;">Hi ${safeName},</p>
        <p style="margin:16px 0 0;font-size:15px;line-height:1.6;">
          Thanks for reaching out! Your message landed safely in my inbox and I&rsquo;ll get back to you as soon as I can &mdash; usually within a day or two.
        </p>
        <p style="margin:16px 0 0;font-size:15px;line-height:1.6;">
          If you need to add anything, just reply to this email and it will reach me directly.
        </p>
        <p style="margin:24px 0 0;font-size:15px;line-height:1.6;">
          Talk soon,<br />Alshan Rijal
        </p>
      </div>
      <p style="margin:16px 0 0;text-align:center;font-size:12px;color:#8b84a8;">
        Automated confirmation from alshanrijal.com.np &mdash; replies go straight to my inbox.
      </p>
    </div>
  </body>
</html>`

  const text = `Hi ${name},

Thanks for reaching out! Your message landed safely in my inbox and I'll get back to you as soon as I can - usually within a day or two.

If you need to add anything, just reply to this email and it will reach me directly.

Talk soon,
Alshan Rijal`

  let resendResponse
  try {
    resendResponse = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [email],
        reply_to: REPLY_TO,
        subject: SUBJECT,
        html,
        text,
      }),
    })
  } catch {
    return json({ error: 'Could not reach the email service.' }, 502)
  }

  if (!resendResponse.ok) {
    const detail = await resendResponse.text()
    return json({ error: 'Resend could not send the auto-reply.', detail }, 502)
  }

  const result = await resendResponse.json()
  return json({ ok: true, id: result.id })
}
