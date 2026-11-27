import { useMemo, useState } from 'react'

const EMPTY_FORM = { name: '', email: '', message: '', website: '' }

export function useContactForm() {
  const [values, setValues] = useState(EMPTY_FORM)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const validators = useMemo(
    () => ({
      name: (value) => value.trim().length >= 2,
      email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
      message: (value) => value.trim().length >= 10 && value.trim().length <= 2000,
    }),
    [],
  )

  const setField = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  const reset = () => {
    setValues(EMPTY_FORM)
    setStatus('idle')
    setError('')
    setSuccess('')
  }

  const submit = async () => {
    const normalized = {
      name: values.name.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
      website: values.website.trim(),
    }

    if (normalized.website) {
      setStatus('error')
      setError('Your message was blocked by our anti-spam filter.')
      setSuccess('')
      return false
    }

    const issues = []
    if (!validators.name(normalized.name)) issues.push('Please enter your name.')
    if (!validators.email(normalized.email)) issues.push('Please enter a valid email address.')
    if (!validators.message(normalized.message)) issues.push('Message must be 10 to 2000 characters long.')

    if (issues.length) {
      setStatus('error')
      setError(issues[0])
      setSuccess('')
      return false
    }

    setStatus('loading')
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalized),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(payload.error || 'Unable to send message right now.')
      }

      setValues(EMPTY_FORM)
      setStatus('success')
      setSuccess('Message sent')
      setError('')
      return true
    } catch (submittedError) {
      setStatus('error')
      setError(
        submittedError instanceof Error && submittedError.message
          ? submittedError.message
          : 'There was a problem sending your message. Please email directly.',
      )
      setSuccess('')
      return false
    }
  }

  return { values, setField, submit, reset, status, error, success }
}
