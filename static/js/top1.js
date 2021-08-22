/**
 * @fileoverview
 * kuji/top.js
 * @require jquery, common
 */

$(window).on('load', function() {
  // 発売中の宝くじの高さを揃える
  new window.lottery.Tile('#lottery .m_card_header', 2);
  new window.lottery.Tile('#lottery .m_card_colset', 2);
  new window.lottery.Tile('#howto .m_card_header', 3);
  new window.lottery.Tile('#howto .m_card_colset', 3);
});