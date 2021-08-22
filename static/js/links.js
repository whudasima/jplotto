/**
 * @fileoverview
 * links.js
 * @require jquery, slick, common, carousel
 */

// windowのload出ないと画像の読み込みでおかしくなる時がある
$(window).on('load', function() {
  // リンク集の高さを揃える
  new window.lottery.Tile('#links_list > li > div > a', 2);
});