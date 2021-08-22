/**
 * @fileoverview
 * index.js
 * @require jquery, common
 */

$(function(){
  // こちらの宝ニュースもおすすめカルーセル
  lottery.CarouselCard();
});

$(window).on('load', function() {
  // こちらの宝ニュースもおすすめの高さを揃える
  new window.lottery.Tile('#recommend .m_carouselCard_info', 3, 'all');
});