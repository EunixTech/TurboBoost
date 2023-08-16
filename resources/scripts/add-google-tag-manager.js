function addGoogleTagManager(htmlContent, gtmId) {

  const gtmScript = `
      <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');</script>
    `;

  const updatedHtml = htmlContent.replace("</head>", gtmScript + "</head>");
  return updatedHtml;
}

module.exports = 	addGoogleTagManager