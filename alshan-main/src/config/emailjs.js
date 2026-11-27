/**
 * EmailJS configuration
 * ---------------------
 * 1. Create a free account at https://www.emailjs.com/
 * 2. Add an email service (e.g. Gmail)  -> copy the SERVICE  ID
 * 3. Create an email template with the variables:
 *      {{from_name}}  {{from_email}}  {{message}}
 *    -> copy the TEMPLATE ID
 * 4. Account > General -> copy your PUBLIC KEY
 * 5. Paste all three values below and redeploy.
 *
 * Until real values are provided the form shows a friendly
 * "not configured yet" error instead of failing silently.
 */
export const EMAILJS = {
  SERVICE_ID: 'service_a08td1i',
  TEMPLATE_ID: 'template_joh4pas',
  PUBLIC_KEY: 'AFFrVB-WVWzkZlfNo',
}

export const isEmailJsConfigured = () =>
  !Object.values(EMAILJS).some((value) => value === '' || value.endsWith('_ID') || value === 'PUBLIC_KEY')
