/**
 * @fileoverview
 * index.js
 * @require jquery, common
 */

$(function(){
  // おすすめの宝ニュースカルーセル
  lottery.CarouselCard();
});

$(window).on('load', function() {
  // おすすめの宝ニュースの高さを揃える
  new window.lottery.Tile('#relative .m_carouselCard_info', 3, 'all');
});