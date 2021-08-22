/* ------------------------------------------------
  自身のurlから判断してPC/SPへ転送
  ※<head>タグ内に配置する
------------------------------------------------ */
// デバイス判別
var navua = navigator.userAgent, is_sp = false;
if(navua.indexOf('iPhone') > 0 || navua.indexOf('iPod') > 0 || navua.indexOf('Android') > 0 && navua.indexOf('Mobile') > 0){
  is_sp = true;
}

// 転送
var lhref = location.href;
var lhref_ary = lhref.split('/bingo5-cp');
if (lhref_ary[1].indexOf('/sp/') > -1) {
  if (!is_sp) {
    // SP > PC
    location.href = getForwardingUrl(lhref_ary, 'pc');
  }
} else {
  if (is_sp) {
    // PC > SP
    location.href = getForwardingUrl(lhref_ary, 'sp');
  }
}

function getForwardingUrl(path, device) {
  var cate = ['dial', 'event', 'fiction'], // SP版のページがあるカテゴリ
  url = path[0] + '/bingo5-cp';
  if (device == 'sp') {
    // 転送先がSP
    url += '/sp';
  } else {
    // 転送先がPC
    path[1] = path[1].replace(/\/sp/, "");
  }
  for (var i in cate) {
    if (path[1].indexOf(cate[i]) > -1) {
      url += path[1];
      break;
    }
  }
  return url;
}