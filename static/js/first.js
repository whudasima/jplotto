/**
 * @fileoverview
 * howto.js
 * @require jquery, slick, common, carousel
 */

// windowのload出ないと画像の読み込みでおかしくなる時がある
$(window).on('load', function() {
  // 福連100、福バラ100、3連バラとはの高さを揃える
  new window.lottery.Tile('.m_list7 .m_list7_item .m_sttl2', 3);
  new window.lottery.Tile('.m_list6 .m_list6_item .m_sttl2', 2);
});