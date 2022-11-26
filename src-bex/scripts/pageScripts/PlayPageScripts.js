export function executeScript() {
  console.log('executeScript...');

  async function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
  }

  async function waitLoaded() {
    let loaded = false;
    while (!loaded) {
      let element = document.querySelector('div.comment')
      let base = document.querySelector("div.video-toolbar-v1 div.toolbar-left");
      if (element && base.children.length >= 4) {
        loaded = true;
      } else {
        await sleep(1);
      }
    }
  }

  function toString(number) {
    if (number >= 10000) {
      return (number / 10000).toFixed(1) + '万';
    } else {
      return number.toString();
    }
  }

  async function main() {
    await waitLoaded();
    let bvid = /(?<=video\/)[a-zA-Z0-9]+/.exec(window.location.pathname)[0];
    let result = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`, {credentials: 'include'});
    let data = await result.json();
    let play = data.data.stat.view;
    let like = data.data.stat["like"];
    let coin = data.data.stat["coin"];
    let favorite = data.data.stat["favorite"];
    let share = data.data.stat["share"];
    let base = document.querySelector("div.video-toolbar-v1");
    base.querySelector("span.like span").innerHTML = `${toString(like)}<br />${play > 0 ? (100 * like / play).toFixed(1) : 0}%`;
    base.querySelector("span.coin span").innerHTML = `${toString(coin)}<br />${play > 0 ? (100 * coin / play).toFixed(1) : 0}%`;
    base.querySelector("span.collect span").innerHTML = `${toString(favorite)}<br />${play > 0 ? (100 * favorite / play).toFixed(1) : 0}%`;
  }

  let observer = new MutationObserver(function (mutations, observer) {
    let base = document.querySelector("div.video-toolbar-v1 div.toolbar-left");
    main().then(_ => null);
  });
  let el = document.querySelector('body');
  let options = {
    'childList': true,
    'attributes': true
  };
  observer.observe(el, options);
}
