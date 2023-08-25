module.exports = {
    googleApiDisplaySwap: /<link\s+href="https:\/\/fonts.googleapis.com\/css2[^"]+display=swap"[^>]*>/g,
    fontPattern:  /https:\/\/fonts\.googleapis\.com\/css2\?[^"]+/g,
    fontFaceRegex: /@font-face\s*\{[\s\S]*?\}/g,
    googleManagerTag: /<script async>\(function\(w,d,s,l,i\){w\[l\]=w\[l\]||\[\];w\[l\].push\({'gtm\.start':\s*new Date\(\).getTime\(\),event:'gtm\.js'\}\);var f=d\.getElementsByTagName\(s\)\[0\],\s*j=d\.createElement\(s\),dl=l!='dataLayer'?'&l='+l:'';j\.async=true;j\.src=\s*'https:\/\/www\.googletagmanager\.com\/gtm\.js\?id='+i+dl;f\.parentNode\.insertBefore\(j,f\);\s*}\)\(window,document,'script','dataLayer','[A-Z0-9-]+'\);<\/script>/,
}