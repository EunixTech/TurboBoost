// const axios = require("axios");
  // let data = JSON.stringify({
  //     page: {
  //         id: 121769328920,
  //         body_html:
  //             "<p>Returns accepted if we receive the items <strong>14 days</strong> after purchase.</p>",
  //         author: "Christopher Gorski",
  //         title: "New warranty",
  //         handle: "new-warranty",
  //     },
  // });

  // let config = {
  //     method: "put",
  //     maxBodyLength: Infinity,
  //     url: "https://turboboost-dev.myshopify.com/admin/api/2023-07/pages/121769328920.json",
  //     headers: {
  //         "X-Shopify-Access-Token": "shpua_832b00f9f277821c02a70c5524402acd",
  //         "Content-Type": "application/json",
  //     },
  //     data: data,
  // };

  // axios
  //     .request(config)
  //     .then((response) => {
  //         console.log(JSON.stringify(response.data));
  //     })
  //     .catch((error) => {
  //         console.log(error);
  //     });

  // // updating html body

  // const jsdom = require("jsdom");
  // const { JSDOM } = jsdom;

  // function addAriaLabelToAnchors(htmlString) {
  //     const dom = new JSDOM(htmlString);
  //     const document = dom.window.document;

  //     const anchors = document.getElementsByTagName("a");

  //     for (let i = 0; i < anchors.length; i++) {
  //         const anchor = anchors[i];
  //         anchor.setAttribute("aria-label", "Link");
  //     }

  //     return dom.serialize();
  // }

  // // Example usage
  // const html =
  //     '<div><a href="https://example.com">Link 1</a><a href="https://example.com">Link 2</a></div>';
  // const modifiedHtml = addAriaLabelToAnchors(html);
  // console.log(modifiedHtml);