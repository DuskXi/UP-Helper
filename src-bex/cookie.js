async function getCookies(domain) {
  return new Promise(resolve => {
    chrome.cookies.getAll({domain: domain}, function (cookies) {
      resolve(cookies);
    });
  });
}

async function getCookieString(url) {
  let cookies = await getCookies(url);
  let cookieString = "";
  for (let cookie of cookies) {
    cookieString += cookie.name + "=" + cookie.value + "; ";
  }
  return cookieString;
}

export {
  getCookies, getCookieString
}
