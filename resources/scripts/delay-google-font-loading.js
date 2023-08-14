const DelayGoogleFontLoading = (htmlContent) => {
    console.log(`htmlContent`,htmlContent)

    const fontPattern = /https:\/\/fonts\.googleapis\.com\/css\?.*/g,
        fontLinks = htmlContent.match(fontPattern);
  


    if(fontLinks){
        let modifiedHtml = htmlContent;

        fontLinks.forEach(link => {
            const modifiedLink = link + '&display=swap';
            modifiedHtml = modifiedHtml.replace(link, modifiedLink);
        });
        return modifiedHtml;
    } else {
        return htmlContent;
    }


  
 
}

module.exports = DelayGoogleFontLoading