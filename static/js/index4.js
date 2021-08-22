/**
 * @fileoverview
 * index.js
 * @require jquery, common
 */

$(window).on('load', function() {
  // 選べる2種類のナンバーズの高さを揃える
  new window.lottery.Tile('#numbers .m_sttl2', 2, 2);
  new window.lottery.Tile('#numbers .m_list4_txt', 2, 2);
});