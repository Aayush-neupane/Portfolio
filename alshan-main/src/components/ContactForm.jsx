import { useContactForm } from '../hooks/useContactForm'

export default function ContactForm() {
  const { values, setField, submit, reset, status, error } = useContactForm()

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (status === 'loading') return
    await submit()
  }

  if (status === 'success') {
    return (
      <div className="form-success" role="status">
        <svg className="success-check" viewBox="0 0 52 52" aria-hidden="true"><path d="m10 27 11 11 21-24" /></svg>
        <strong>Message sent</strong>
        <p>I will reply to the address you entered.</p>
        <button type="button" className="text-button" onClick={reset}>Send another</button>
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="field-row two-up">
        <label className="field">
          <span>Name</span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={setField}
            required
            aria-label="Name"
          />
        </label>

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={values.email}
            onChange={setField}
            required
            aria-label="Email"
          />
        </label>
      </div>

      <label className="field honeypot" aria-hidden="true">
        <span>Leave empty</span>
        <input
          type="text"
          name="website"
          value={values.website}
          onChange={setField}
          tabIndex={-1}
          autoComplete="off"
        />
      </label>

      <label className="field textarea-field">
        <span>Message</span>
        <textarea
          name="message"
          value={values.message}
          onChange={setField}
          minLength={10}
          maxLength={2000}
          required
          aria-label="Message"
        />
        <span className="message-count">{values.message.length} / 2000</span>
      </label>

      <div className="form-actions">
        <button className="button primary" type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending' : 'Send'}
        </button>
      </div>

      {error ? <p className="form-message error" role="alert">{error}</p> : null}
    </form>
  )
}
