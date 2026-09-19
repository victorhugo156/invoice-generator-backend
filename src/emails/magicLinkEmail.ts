import { resend } from '../lib/resend'

const from = process.env.EMAIL_FROM || 'Acme <onboarding@resend.dev>'

export async function SendMagicLinkEmail(to: string, url: string) {
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject: 'Hello from Resend!',
    html: `<h1>Welcome!</h1><p>This email was sent using Resend's Node.js SDK.</p><a href="${url}">Click here to login</a>`,
  })

  if (error) {
    console.error('Error sending email:', error)
    return
  }
  return true
}
