function removeLinkAttributes(html) {
    const linkTagRegex = /<link.*?>/g;
    const withLinkTagsReplaced = html.replace(linkTagRegex, match => {
        const hrefMatches = match.trim().match(/<link\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/);
        if (hrefMatches && hrefMatches.length === 3) {
            const assetUrl = hrefMatches[2];
            return `<link rel="stylesheet" href="${assetUrl}" as="style" media="none" onload="this.onload=null;this.media='all'">`;
        }
        return match;
    });
 
    return withLinkTagsReplaced;
 }
 
 const html = "<html><head><link rel='dns-prefetch' href='https://example.com'><link rel='preconnect' href='https://example2.com'><link rel='preload' href='https://example.com'></head><body></body></html>";
 
 const modifiedHTML = removeLinkAttributes(html);
 console.log(modifiedHTML);