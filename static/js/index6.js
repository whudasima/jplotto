/**
 * @fileoverview
 * index.js
 * @require jquery, common
 */

$(window).on('load', function() {
  // 選べる3種類のロトの高さを揃える
  new window.lottery.Tile('#loto .m_sttl2', 3);
  new window.lottery.Tile('#lotoindex .m_thumbSetWrap', 3);
});