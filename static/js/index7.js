/**
 * @fileoverview
 * index.js
 * @require jquery, slick, common, carousel
 */

// windowのload出ないと画像の読み込みでおかしくなる時がある
$(window).on('load', function() {
  // 宝くじをみんなで楽しむ
  new window.lottery.Tile('.m_list6 .m_sttl2__pcLeft', 2);
});
