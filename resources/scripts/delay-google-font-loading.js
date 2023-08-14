const DelayGoogleFontLoading = (htmlContent) => {

    const fontPattern = /https:\/\/fonts\.googleapis\.com\/css\?.*/g,
        fontLinks = htmlContent.match(fontPattern);
  
    let modifiedHtml = htmlContent;

    fontLinks.forEach(link => {
        const modifiedLink = link + '&display=swap';
        modifiedHtml = modifiedHtml.replace(link, modifiedLink);
    });
  
    return modifiedHtml;
}

module.export = DelayGoogleFontLoading