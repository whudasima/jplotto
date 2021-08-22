/**
 * @fileoverview
 * @require jquery
 * @require common
 * @require jquery.validate
 * @require validate
 */
$(function() {
  // バリデーション共通関数呼び出し
  var validate    = window.lottery.Validate;

  // ページ独自のバリデーションオブジェクト
  var validateObj = {};

  // バリデーションルール
  validateObj.rules = {
    // name: メールアドレス
    'mailAddress': {
      required: true,
      maxlength: 256,
      isValidEmail: true,
      email: false // jqueryValidateデフォルトの機能をoff
    },
    // name: 宝くじ会員規約に同意する
    'memberKiyakuDouiCheck': {
      isValidCheckbox: true
    }
  };
  // エラー時のバリデーションメッセージ
  validateObj.messages = {
    // name: メールアドレス
    'mailAddress': {
      required: validate.getMessages.require('メールアドレス'),
      maxlength: validate.getMessages.maxlength('メールアドレス'),
      isValidEmail: 'メールアドレスは正しいメールアドレスの形式で入力してください。'
    },
    // name: 宝くじ会員規約に同意する
    'memberKiyakuDouiCheck': {
      isValidCheckbox: "【宝くじ会員規約に同意する】にチェックが入っておりません。"
    }
  };

  // メールアドレス
  $.validator.addMethod('isValidEmail', function(val, el) {
    // ①「@」マークがあること
    // ②「@」の前に使えるのは半角英数字記号
    // ③「@」の後は半角英数字記号かつ、「一つ以上の”.”（ドット）を含む」こと
    return this.optional(el) || /^[a-zA-Z0-9!"#$%&'()-^\@[;:\],./\=~|`{+*}<>?_]+@[a-zA-Z0-9!"#$%&'()-^\@[;:\],./\=~|`{+*}<>?_]+\.[a-zA-Z0-9!"#$%&'()-^\@[;:\],./\=~|`{+*}<>?_]+$/.test(val);
  });
  
  $.validator.addMethod('isValidCheckbox', function(val, el) {
    // 1の場合エラーしない
    // 1以外またはnull場合エラーする
    var isValid = true;
    if(val === undefined || val == null || val != '1')
      isValid = false;
    return isValid;
  });
  
  // バリデーション実行
  new validate('#form', validateObj);

  // チェックマーク
  window.lottery.Form.bindCheckMark();
  // 同意するボタン
  window.lottery.Form.bindAcitivateSubmit();
  // enterでのsubmitを無効にする
  window.lottery.Form.disabledEnterSubmit();
  //宝くじ会員規約 ボタン＆チェックボックス処理
  var mtsBtn = $('.js_memberTermsBtn');
  var mtsChkbox = $('.js_memberTermsChkbox');
  var mtsChkboxfunc = function(){
    mtsBtn.addClass('m_btn m_btn__color2');
    mtsChkbox.removeClass('is_disabled').children($('input[checkbox]')).prop('disabled', false);
  }
  // 宝くじ会員規約 押下時
  mtsBtn.on('click',function(){
    mtsChkboxfunc();
  });
  // historyback用処理
  if(mtsChkbox.children($('input[checkbox]')).prop('checked')){
    mtsChkboxfunc();
  }
});
