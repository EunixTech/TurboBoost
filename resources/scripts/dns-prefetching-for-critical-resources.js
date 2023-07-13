function addDNSPrefetch(htmlContent) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(htmlContent, 'text/html');

    // Get all the critical resources on the page
    var criticalResources = doc.querySelectorAll('link[rel="stylesheet"], script[src], img[src]');

    // Extract unique domains from the critical resources
    var domains = [];
    for (var i = 0; i < criticalResources.length; i++) {
      var resource = criticalResources[i];
      var domain = new URL(resource.href || resource.src).hostname;
      if (!domains.includes(domain)) {
        domains.push(domain);
      }
    }

    // Add DNS prefetch for each unique domain
    for (var j = 0; j < domains.length; j++) {
      var domainLink = doc.createElement('link');
      domainLink.rel = 'dns-prefetch';
      domainLink.href = '//' + domains[j];

      var head = doc.getElementsByTagName('head')[0];
      head.appendChild(domainLink);
    }

    return doc.documentElement.outerHTML;
  }

  module.exports = addDNSPrefetch;