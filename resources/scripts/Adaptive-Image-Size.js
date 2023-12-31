// Declare the resizeTimer variable
var resizeTimer;

// Function to check if a string contains any of the items in an array
function arrayInString(str, arr) {
  for (var i = 0; i < arr.length; i++) {
    if (str.indexOf(arr[i]) !== -1) {
      return i;
    }
  }
  return -1;
}

// Function to parse media attributes and store image data
function parseMedia(link) {
  var medias = link.getAttribute("media"),
    pMin = /\(\s*min-width\s*:\s*(\d+)px\s*\)/,
    pMax = /\(\s*max-width\s*:\s*(\d+)px\s*\)/,
    resMin,
    resMax,
    supportedMedia = [
      "handheld",
      "all",
      "screen",
      "projection",
      "tty",
      "tv",
      "print",
    ],
    curMedia,
    mediaString = [];
  medias = !medias ? ["all"] : medias.split(",");

  for (var i = 0; i < medias.length; i++) {
    curMedia = arrayInString(medias[i], supportedMedia);

    if (curMedia !== -1) {
      curMedia = supportedMedia[curMedia];
      if (!resMin) {
        resMin = pMin.exec(medias[i]);
        if (resMin) {
          resMin = parseInt(resMin[1], 10);
        }
      }
      if (!resMax) {
        resMax = pMax.exec(medias[i]);
        if (resMax) {
          resMax = parseInt(resMax[1], 10);
        }
      }
      mediaString.push(curMedia);
    }
  }

  if (resMin || resMax) {
    return {
      obj: link,
      min: resMin,
      max: resMax,
      medium: mediaString.join(","),
      used: false,
    };
  }
  return null;
}

// Function to adjust image sources based on media queries
function adjustImageSources(imgs) {
  var width = window.innerWidth || document.documentElement.clientWidth,
    shouldUse,
    targetForNewImage,
    src,
    n,
    targetImage;

  for (var i = 0; i < imgs.length; i++) {
    shouldUse =
      !imgs[i].obj.disabled &&
      ((!(imgs[i].min && imgs[i].min > width) &&
        !(imgs[i].max && imgs[i].max < width)) ||
        (!imgs[i].max && !imgs[i].min));

    if (shouldUse) {
      n = imgs[i].obj;
      src = n.getAttribute("data-src");

      if (n.tagName.toUpperCase() === "IMG") {
        targetForNewImage = n;
      } else if (n.tagName.toUpperCase() === "SOURCE") {
        targetForNewImage = n.parentNode;
      }

      targetImage = targetForNewImage.querySelector("img");

      if (targetImage.getAttribute("src") !== src) {
        targetImage.setAttribute("src", src);
      }
    }
  }
}

// Initialize the adaptive image optimization
function initAdaptiveImages() {
  var imageElements = document.querySelectorAll(
      "img[data-src], source[data-srcset]"
    ),
    imgs = [];

  for (var i = 0; i < imageElements.length; i++) {
    var imgData = parseMedia(imageElements[i]);
    if (imgData) {
      imgs.push(imgData);
    }
  }

  adjustImageSources(imgs);

  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      adjustImageSources(imgs);
    }, 29);
  });
}

// Example usage
document.addEventListener("DOMContentLoaded", function () {
  initAdaptiveImages();
});
