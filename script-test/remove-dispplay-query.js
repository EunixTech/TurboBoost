const {
    googleApiDisplaySwap
} =  require("../utils/commenRegrex");


function removeDisplaySwapQuery(htmlContent) {
  
    // Replace display=swap with an empty string in each match
    const modifiedContent = htmlContent.replace(googleApiDisplaySwap, match => match.replace('&display=swap', ''));

    return modifiedContent;
}

