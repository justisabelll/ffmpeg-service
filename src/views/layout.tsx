export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html data-theme="minimal">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
          src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.6/dist/htmx.min.js"
          integrity="sha384-Akqfrbj/HpNVo8k11SXBb6TlBWmXXlYQrCSqEWmyKJe+hDm3Z/B2WVG4smwBkRVm"
          crossorigin="anonymous"
        ></script>
        <link href="src/styles.css" rel="stylesheet" />
        <title>FFMPEG Service</title>
      </head>
      <body className="min-h-screen bg-base-100 text-base-content antialiased">
        <main className="animate-fadeIn">{children}</main>
      </body>
    </html>
  );
}
