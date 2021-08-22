/**
 * @fileoverview
 * top.js
 * @require jquery, common
 */

// windowのload出ないと画像の読み込みでおかしくなる時がある
$(window).on('load', function() {
  new window.lottery.Tile('.m_list6 .m_list6_item .m_sttl2', 2);
});