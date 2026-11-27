export default function NotFoundPage() {
  return (
    <main className="simple-page">
      <section className="page-header">
        <h1>Page not found</h1>
      </section>

      <section className="editorial-block">
        <p>The page you requested does not exist or was moved.</p>
        <p className="footer-link-row">
          <a href="/">Go to the homepage</a>
        </p>
      </section>
    </main>
  )
}
