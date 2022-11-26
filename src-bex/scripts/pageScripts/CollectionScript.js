export function executeScript() {
  let subscribeImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAACXBIWXMAACxLAAAsSwGlPZapAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMASURBVHgB7Zy/iuJQFIdPdFELhQFttBrfYNFGO7cXdsHKasdCJeU+gfoGbpXCYp3KyneID+A7aGMnCFYKJnvvkFkkxDk3bE5udM4HIeavyZfknp/IDQDDMIw+DAjJbDZrua47EsNXMfkEd4JhGLYYvQ4Gg3mIzcIJEnJGjuOM4Y5JpVLjfr8/UV1fWZBlWS9i53/gARAX+ZtpmrbKuilQJJ1O/4QHQZzLSHVdZUGizWnBg+C1n0ooC3owlIvLZxWkDAtCYEEILAiBBSGwIIRECcpms5A0vkACqFQqUKvV3saS3W4Hq9UKjscj6Eb7HSSltNvtf3Le53U6HSgUCqAb7YIajUbg/EwmA81mE3SjVZCUUCqVbi4vFougG62Cktgo++Eyj8CCEFgQQmw5SLY3slG+Jp/Po9sFlfo48xG5IH8IDIOU0+12A5fFFSZJH7GgEBjlvuMIk6SCboXAqIgjTJIJwkJgVFCHybuvYufzGSghEyQPXDak1Oz3e6CE9A6SVYbyCssKtl6vgRLSMi9PYLlcQr1eh3K5HLgOVoVulfHtdvsm53Q6ASXkOUieoG3bgcs+yjnv2y4WC9AJ/9RAYEEILAiBBSFoFYRVIOoQqIJWQViYpA6BKmh/xG6FyThCoAra/zgMCpNxhUAVEvHP6kdhUjdcxRBYEAILQmBBCCwIgQUhsCAEFoTAghBYEAILQmBBCIkRZBjG3HGcqhzE5CskBO2/5qWYy+UyMU1zczX7xbKssexfKj5r7emoTZDsheyJsYOWe8K0i4pdECbGz7WodDo9dV33O8RIbILCivHjifohRLVkp9y4+tCSC/pfMX68/dhSlNdN/RkIIRMUtRg/3n6rXn9+2c37GQigELQRpbpHJcaP+J65GM2pREUpaCPumknYd2NEBZWoKAQdxDAZDodTSABRiwqTpA/+afEoTTKZTDUpcq6RosRxyWTeE5Mb3+KN6n6U7yDxRb+8K/IkPv/O5XLTXq93gIRzdUfJwCnDpjx+5be/MAzD6OQvSa0xx6KlEkYAAAAASUVORK5CYII=";

  console.log('executeScript...');

  async function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
  }

  async function waitLoaded() {
    let loaded = false;
    while (!loaded) {
      await sleep(1);
      loaded = document.querySelector("div.ep-list-card");
    }
  }

  async function loadSeasons(page = 1) {
    let url = `https://member.bilibili.com/x2/creative/web/seasons?pn=${page}&ps=30&order=mtime&sort=desc&draft=1`;
    let response = await fetch(url, {credentials: 'include'});
    let json = await response.json();
    return json.data["seasons"];
  }

  async function addSeasons(seasons, page = 1) {
    let nextPage = await loadSeasons(page);
    for (let i = 0; i < nextPage.length; i++) {
      seasons[nextPage[i]["season"]["id"].toString()] = nextPage[i];
    }
    return seasons;
  }

  function cardItemHtml(innerHtml) {
    return `<div data-v-744025ee class="ep-list-card-statistic-item">${innerHtml}</div>`;
  }

  function IHtml(className, innerHtml) {
    return `<i data-v-744025ee class="${className}">${innerHtml}</i>`;
  }

  function valueHtml(value) {
    return `<span data-v-744025ee class="ep-list-card-statistic-item-value">${value}</span>`;
  }

  function tipsHtml(tips) {
    return `<span data-v-744025ee class="ep-list-card-statistic-item-tip tip">${tips}</span>`;
  }

  async function main() {
    await waitLoaded();
    let cards = document.querySelectorAll("div.ep-list-card");
    let seasonMap = {};
    seasonMap = await addSeasons(seasonMap);
    for (let i = 0; i < cards.length; i++) {
      let base = cards[i].querySelector("div.ep-list-card-statistic");
      let playElement = base.children[0].querySelector("span.ep-list-card-statistic-item-value");
      // let danmakuElement = base.children[1].querySelector("span.ep-list-card-statistic-item-value");
      // let commentElement = base.children[2].querySelector("span.ep-list-card-statistic-item-value");
      // let coinElement = base.children[3].querySelector("span.ep-list-card-statistic-item-value");
      // let favoriteElement = base.children[4].querySelector("span.ep-list-card-statistic-item-value");
      // let likeElement = base.children[5].querySelector("span.ep-list-card-statistic-item-value");
      // let shareElement = base.children[6].querySelector("span.ep-list-card-statistic-item-value");
      // let subscribeElement = base.children[7].querySelector("span.ep-list-card-statistic-item-value");
      let seasonId = cards[i].id.split("-")[2];
      let season = seasonMap[seasonId];
      let play = season["seasonStat"]["view"];
      let danmaku = season["seasonStat"]["danmaku"];
      let comment = season["seasonStat"]["reply"];
      let coin = season["seasonStat"]["coin"];
      let favorite = season["seasonStat"]["fav"];
      let like = season["seasonStat"]["like"];
      let share = season["seasonStat"]["share"];
      let subscribe = season["seasonStat"]["subscription"];
      let playString = playElement.innerText;
      let danmakuString = play > 0 ? (danmaku / play * 100).toFixed(2) + "%" : "0%";
      let commentString = play > 0 ? (comment / play * 100).toFixed(2) + "%" : "0%";
      let coinString = play > 0 ? (coin / play * 100).toFixed(2) + "%" : "0%";
      let favoriteString = play > 0 ? (favorite / play * 100).toFixed(2) + "%" : "0%";
      let likeString = play > 0 ? (like / play * 100).toFixed(2) + "%" : "0%";
      let shareString = play > 0 ? (share / play * 100).toFixed(2) + "%" : "0%";
      let subscribeString = play > 0 ? (subscribe / play * 100).toFixed(2) + "%" : "0%";
      let finalHtml = '';
      finalHtml += cardItemHtml(IHtml("fontvt icon-guankanhuoyuedu", "") + valueHtml(playString) + tipsHtml("总稿件播放量"));
      finalHtml += cardItemHtml(IHtml("fontvt icon-ic_danmu", "") + valueHtml(danmakuString) + tipsHtml("弹幕率"));
      finalHtml += cardItemHtml(IHtml("fontvt icon-ic_comment", "") + valueHtml(commentString) + tipsHtml("评论率"));
      finalHtml += cardItemHtml(IHtml("fontvt icon-coins", "") + valueHtml(coinString) + tipsHtml("投币率"));
      finalHtml += cardItemHtml(IHtml("fontvt icon-ic_collection", "") + valueHtml(favoriteString) + tipsHtml("收藏率"));
      finalHtml += cardItemHtml(IHtml("fontvt icon-ic_like", "") + valueHtml(likeString) + tipsHtml("点赞率"));
      finalHtml += cardItemHtml(IHtml("fontvt icon-ic_share", "") + valueHtml(shareString) + tipsHtml("分享率"));
      finalHtml += cardItemHtml(`<img data-v-744025ee src="${subscribeImg}" alt="订阅" class="icon-ic"/>` + valueHtml(subscribeString) + tipsHtml("订阅率"));
      let newElement = document.createElement("div");
      newElement.setAttribute("data-v-744025ee", "");
      newElement.className = "ep-list-card-statistic";
      newElement.innerHTML = finalHtml;
      base.parentElement.insertBefore(newElement, cards[i].querySelector("div.ep-list-card-videos"));
    }
  }

  main().then(r => console.log('executeScript done.'));
}
