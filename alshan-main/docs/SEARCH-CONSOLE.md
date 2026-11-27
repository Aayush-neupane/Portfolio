# Search Console setup

1. Add a Domain property for `alshanrijal.com.np` in Google Search Console.
2. Verify ownership with the DNS TXT record Google provides. If DNS verification is not available, use a URL-prefix property for `https://alshanrijal.com.np/`.
3. Submit `https://alshanrijal.com.np/sitemap.xml`.
4. Use URL Inspection and request indexing for `/` and `/privacy`.
5. Review the Page indexing report for crawl and indexing issues.
6. Test the structured data with Google's Rich Results Test.
7. Monitor Core Web Vitals after real traffic is collected.
8. Configure the host to redirect `www.alshanrijal.com.np` to the apex HTTPS domain.
9. Import the property into Bing Webmaster Tools.

Set `VITE_GSC_VERIFICATION` in the deployment environment when Google provides a verification token. The application emits the verification meta tag only when that variable is present.
