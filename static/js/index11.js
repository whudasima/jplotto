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
    // name: 姓（カナ）
    'lastnameKana': {
      required: true,
      zenkakukana: true,
      maxlength: 30
    },
    // name: 名（カナ）
    'firstnameKana': {
      required: true,
      zenkakukana: true,
      maxlength: 30
    },
    // name: 年
    'yr': {
      required: true,
      number: true
    },
    // name: 月
    'mo': {
      required: true,
      number: true
    },
    // name: 日
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
    // name: 姓（カナ）
    'lastnameKana': {
      required: validate.getMessages.require('姓（カナ）'),
      zenkakukana: '姓（カナ）に使用できない文字種が含まれています。カタカナと英数字と記号（￥「」（）／．－，ー）のみが入力可能です。',
      maxlength: validate.getMessages.maxlength('姓（カナ）')
    },
    // name: 名（カナ）
    'firstnameKana': {
      required: validate.getMessages.require('名（カナ）'),
      zenkakukana: '名（カナ）に使用できない文字種が含まれています。カタカナと英数字と記号（￥「」（）／．－，ー）のみが入力可能です。',
      maxlength: validate.getMessages.maxlength('名（カナ）')
    },
    // name: 年
    'yr': {
      required: validate.getMessages.require('生年月日（年）'),
      number: validate.getMessages.require('生年月日（年）')
    },
    // name: 月
    'mo': {
      required: validate.getMessages.require('生年月日（月）'),
      number: validate.getMessages.require('生年月日（月）')
    },
    // name: 日
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

  //カナ
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
  
  // バリデーション実行
  new validate('#form', validateObj);
});
