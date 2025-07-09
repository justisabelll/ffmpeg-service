export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html data-theme="business">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
          src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.6/dist/htmx.min.js"
          integrity="sha384-Akqfrbj/HpNVo8k11SXBb6TlBWmXXlYQrCSqEWmyKJe+hDm3Z/B2WVG4smwBkRVm"
          crossorigin="anonymous"
        ></script>
        {/* <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.classless.min.css"
        /> */}
        <link href="src/styles.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <title>ffmpeg service</title>
      </head>
      <body className="bg-gray-50">
        <main>{children}</main>
      </body>
    </html>
  );
}
