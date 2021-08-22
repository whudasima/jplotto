$(function(){
  // バリデーション共通関数呼び出し
  var validate    = window.lottery.Validate;

  // ページ独自のバリデーションオブジェクト
  var validateObj = {};

  // バリデーションルール
  validateObj.rules = {
    // name: キーワード
    'keyword': {
      required: true
    }
  };

  // エラー時のバリデーションメッセージ
  validateObj.messages = {
    // name: キーワード
    'keyword': {
      required: validate.getMessages.require2('キーワード')
    }
  };

  // バリデーション実行
  new validate('#isUribaKensakuForm', validateObj);
});
