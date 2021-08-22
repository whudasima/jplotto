/**
 * @fileoverview
 * index.js
 * @require jquery, common
 */

$(window).on('load', function() {
  // 宝くじの社会貢献の高さを揃える
  new window.lottery.Tile('#contrib .m_list10_image + p', 2);
  // 宝くじの日・宝くじ調査結果の高さを揃える
  new window.lottery.Tile('#Lotterysday .m_card_txt', 2);
});