/**
 * @fileoverview
 * @require jquery
 * @require common
 * @require jquery.validate
 * @require validate
 */
$(function() {
  // 問い合わせリンクの高さをそろえる
  new window.lottery.Tile('#faq_card .m_card5 a', 2);

  var validate    = window.lottery.Validate;

  // ページ独自のバリデーションオブジェクト
  var validateObj = {};

  // バリデーションルール
  validateObj.rules = {
    // name: キーワード
    'kensakuJyoken': {
      required: true
    }
  };
  // エラー時のバリデーションメッセージ
  validateObj.messages = {
    // name: キーワード
    'kensakuJyoken': {
      required: validate.getMessages.require('キーワード')
    }
  };

  // バリデーション実行
  new validate('#form', validateObj);
});
