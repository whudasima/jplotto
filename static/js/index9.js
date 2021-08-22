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
      hankaku: true,
      isValidEmail: true,
      maxlength: 256,
      email: false // jqueryValidateデフォルトの機能をoff
    },
    // name: 姓（全角カナ）
    'lastnameKana': {
      required: true,
      zenkakukana: true,
      maxlength: 30
    },
    // name: 名（全角カナ）
    'firstnameKana': {
      required: true,
      zenkakukana: true,
      maxlength: 30
    },
    // name: 生年月日（年）
    'yr': {
      required: true,
      number: true
    },
    // name: 生年月日（月）
    'mo': {
      required: true,
      number: true
    },
    // name: 生年月日（日）
    'dy': {
      required: true,
      number: true
    },
    // name: 電話番号
    'phoneNumber': {
      required: true,
      number: true,
      minlength: 10,
      maxlength: 11
    }
  };

  // エラー時のバリデーションメッセージ
  validateObj.messages = {
    // name: メールアドレス
    'mailAddress': {
      required: validate.getMessages.require('メールアドレス'),
      hankaku: validate.getMessages.hankaku('メールアドレス'),
      isValidEmail: 'メールアドレスは正しいメールアドレスの形式で入力してください。',
      maxlength: validate.getMessages.maxlength('メールアドレス')
    },
    // name: 姓（全角カナ）
    'lastnameKana': {
      required: validate.getMessages.require('姓（全角カナ）'),
      zenkakukana: '姓（全角カナ）に使用できない文字種が含まれています。カタカナと英数字と記号（￥「」（）／．－，ー）のみが入力可能です。',
      maxlength: validate.getMessages.maxlength('姓（全角カナ）')
    },
    // name: 名（全角カナ）
    'firstnameKana': {
      required: validate.getMessages.require('名（全角カナ）'),
      zenkakukana: '名（全角カナ）に使用できない文字種が含まれています。カタカナと英数字と記号（￥「」（）／．－，ー）のみが入力可能です。',
      maxlength: validate.getMessages.maxlength('名（全角カナ）')
    },
    // name: 生年月日（年）
    'yr': {
      required: validate.getMessages.require('生年月日（年）'),
      number: validate.getMessages.require('生年月日（年）')
    },
    // name: 生年月日（月）
    'mo': {
      required: validate.getMessages.require('生年月日（月）'),
      number: validate.getMessages.require('生年月日（月）')
    },
    // name: 生年月日（日）
    'dy': {
      required: validate.getMessages.require('生年月日（日）'),
      number: validate.getMessages.require('生年月日（日）')
    },
    // name: 電話番号
    'phoneNumber': {
      required: validate.getMessages.require('電話番号'),
      number: validate.getMessages.number('電話番号'),
      minlength: validate.getMessages.minlength('電話番号'),
      maxlength: validate.getMessages.maxlength('電話番号')
    }
  };

  // カナ
  $.validator.addMethod('zenkakukana', function(val, el) {
    /** 全角カナ*/
    var FULL_WIDTH_KANA = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    /** 全角カナ促音・拗音*/
    var FULL_WIDTH_KANA_BURST = "ァィゥェォヵヶッャュョヮ";
    /** 全角カナ濁音・半濁音*/
    var FULL_WIDTH_KANA_SOUND = "ガギグゲゴザジズゼゾダヂヅデドバビブベボヴパピプペポ";
    /** 全角数字*/
    var FULL_WIDTH_NUMBER = "１２３４５６７８９０";
    /** 半角数字*/
    var HALF_WIDTH_NUMBER = "1234567890";
    /** 全角英大文字、小文字*/
    var FULL_WIDTH_ENGLISH = "ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ";
    /** 全角英大文字、小文字*/
    var HALF_WIDTH_ENGLISH = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    /** 全角記号*/
    var FULL_WIDTH_SYMBOL = "￥「」（）／．－，ー";
    /** 半角記号*/
    var HALF_WIDTH_SYMBOL = "\\｢｣()/.\\-,";
    /** 全角スペース、半角スペース*/
    var FULL_HALF_SPACE = "　 ";
    var regexPattern = new RegExp("^[" + FULL_WIDTH_KANA + FULL_WIDTH_KANA_BURST + FULL_WIDTH_KANA_SOUND + FULL_WIDTH_NUMBER + HALF_WIDTH_NUMBER
             + FULL_WIDTH_ENGLISH + HALF_WIDTH_ENGLISH + FULL_WIDTH_SYMBOL + HALF_WIDTH_SYMBOL + FULL_HALF_SPACE + "]+$");
    
    return this.optional(el) || regexPattern.test(val);
  });

  // メールアドレス
  $.validator.addMethod('isValidEmail', function(val, el) {
    // ①「@」マークがあること
    // ②「@」の前に使えるのは半角英数字記号
    // ③「@」の後は半角英数字記号かつ、「一つ以上の”.”（ドット）を含む」こと
    return this.optional(el) || /^[a-zA-Z0-9!"#$%&'()-^\@[;:\],./\=~|`{+*}<>?_]+@[a-zA-Z0-9!"#$%&'()-^\@[;:\],./\=~|`{+*}<>?_]+\.[a-zA-Z0-9!"#$%&'()-^\@[;:\],./\=~|`{+*}<>?_]+$/.test(val);
  });
  
  // バリデーション実行
  new validate('#form', validateObj);

  // チェックマーク
  window.lottery.Form.bindCheckMark();
});
