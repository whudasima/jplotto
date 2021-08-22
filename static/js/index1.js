/**
 * @fileoverview
 * index.js
 * @require jquery, slick, common, carousel
 */

// windowのload出ないと画像の読み込みでおかしくなる時がある
$(window).on('load', function () {
  // 発売中の宝くじの高さを揃える
  new window.lottery.Tile('#loto_list > li', 3);
  new window.lottery.Tile('#numbers_list > li', 3);

  // 宝くじをみんなで楽しむ
  new window.lottery.Tile('#group_gift > li .m_sttl2 + div ', 2);
  new window.lottery.Tile('#group_gift > li .m_list6', 2);

});

$(function () {

  var sc_wmb_sp_401Modal = new window.lottery.Modal({
    $el: $('#sc_wmb_sp_401')
  });
  $('#show_sc_wmb_sp_401').on('click', function (e) {
    sc_wmb_sp_401Modal.show();
  })

  var sc_wmb_sp_402Modal = new window.lottery.Modal({
    $el: $('#sc_wmb_sp_402')
  });
  $('#show_sc_wmb_sp_402').on('click', function (e) {
    sc_wmb_sp_402Modal.show();
  })

  var sc_wmb_sp_403Modal = new window.lottery.Modal({
    $el: $('#sc_wmb_sp_403')
  });
  $('#show_sc_wmb_sp_403').on('click', function (e) {
    sc_wmb_sp_403Modal.show();
  });
})
