export default function PrivacyPage() {
  return (
    <main className="simple-page">
      <script type="application/ld+json">{JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': 'https://alshanrijal.com.np/privacy',
        url: 'https://alshanrijal.com.np/privacy',
        name: 'Privacy Policy | Alshan Rijal',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://alshanrijal.com.np/' },
            { '@type': 'ListItem', position: 2, name: 'Privacy Policy', item: 'https://alshanrijal.com.np/privacy' },
          ],
        },
      })}</script>
      <section className="page-header">
        <h1>How contact data is handled</h1>
      </section>

      <section className="editorial-block">
        <h2>What I collect</h2>
        <p>
          The contact form collects the name, email address and message that you send. No
          additional personal data is collected unless you choose to include it in your
          message.
        </p>

        <h2>How it is used</h2>
        <p>
          I use this information only to reply to your message and to understand the project,
          role or enquiry you are reaching out about.
        </p>

        <h2>How long it is kept</h2>
        <p>
          Messages are kept only as long as needed to respond to your enquiry and to manage my
          records. If you need a copy or removal, email me at contact@alshanrijal.com.np.
        </p>

        <h2>Removal</h2>
        <p>
          If you want me to delete a prior email or message, contact me directly and I will
          remove it from my records when possible.
        </p>

        <p className="footer-link-row">
          <a href="/">Return home</a>
        </p>
      </section>
    </main>
  )
}
