/**
 * @fileoverview
 * validate.js
 * @require jquery
 * @require jquery.validate
 */

/**
 * jquery.validate用の独自のValidateメソッド
 */
// 全角
$.validator.addMethod('zenkaku', function(val, el) {
  return this.optional(el) || /^[^\x01-\x7E\uFF61-\uFF9F]+$/.test(val);
});
// 半角
$.validator.addMethod('hankaku', function(val, el) {
  return this.optional(el) || /^[\x01-\x7E]+$/.test(val);
});
// 半角数字　全角数字は半角数字に変換されて評価される
$.validator.addMethod('number', function(val, el) {
  // カンマを取り除く
  val = window.lottery.Util.getRemoveComma(val);
  // 全角数字を半角数字に変換
  val = window.lottery.Util.getCastNumber(val);
  el.value = val;
  return this.optional(el) || /^[0-9]+$/.test(val);
});
// 数値の範囲
$.validator.addMethod('numberRange', function(val, el, rule) {
  rule = rule || [];
  if(rule.length < 2) {
    return false;
  }
  // カンマを取り除く
  val = window.lottery.Util.getRemoveComma(val);
  // 全角数字を半角数字に変換
  val = window.lottery.Util.getCastNumber(val);
  return (val >= rule[0] && val <= rule[1]) ? true: false;
});
// 指定文字数
$.validator.addMethod('length', function(val, el, rule) {
  rule = rule - 0;
  return this.optional(el) || val.length === rule;
});
// カタカナ
$.validator.addMethod('katakana', function(val, el) {
  return this.optional(el) || /^[ァ-ヶー　]+$/.test(val);
});
// 口座名義入力可能文字
$.validator.addMethod('accountHolderCheck', function(val, el) {
  return this.optional(el) || /^[ァ-ワヲ-ヶ０-９0-9Ａ-Ｚａ-ｚA-Za-z￥「」（）／．－，ー\\｢｣()/\.\-,　\x20]+$/.test(val);
});
// メールアドレス
$.validator.addMethod('emailCheck', function(val, el) {
  // @の前は「aからz」「AからZ」「0から9」「_.-」
  // @の後は「aからz」「AからZ」「0から9」「_-」「一つ以上の.を含む」「末尾はaからz、AからZ、0から9のいずれか」
  return this.optional(el) || /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9_\-])+\.)+([a-zA-Z0-9])+$/.test(val);
});
// パスワードに使用できる文字列が使われているか、「aからz」、「AからZ」、「0から9」、「!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~」
$.validator.addMethod('passwordStrCheck', function(val, el) {
  return /^[A-Za-z0-9!\x22\#$%&@'()*+,-./;:<>?=^~|{}`\x5b\x5d_]+$/.test(val);
});
// パスワードに使用できる文字列が含まれていて、英字（英大文字 or 英子文字）＋英字以外（数字 or 記号）の2種類以上を使っている
$.validator.addMethod('passwordValidCheck', function(val, el) {
  return /^(?=.*[A-Za-z])(?=.*[0-9!\x22\#$%&@'()*+,-./;:<>?=^~|{}`\x5b\x5d_])[\w!\x22\#$%&@'()*+,-./;:<>?=^~|{}`\x5b\x5d]+$/.test(val);
});
// パスワードがidと被っていないか
$.validator.addMethod('passwordIdCheck', function(val, el) {
  // window.lottery.userIdはページ側で指定
  if(window.lottery && window.lottery.userId) {
    var id = window.lottery.userId.split('@')[0];
    return !!!val.match(id);
  }
  else {
    return true;
  }
});


;(function(w, d) {

  // namespace
  var _ns = w.lottery = w.lottery || {};


  /**
   * Validation共通処理郡
   */
  var Validate = _ns.Validate = _ns.Validate || function() {
    this._init.apply(this, arguments);
  };
  /**
   * Validationメッセージ
   */
  Validate.getMessages = {
    // 必須入力
    require: function(str) {
      return str + 'は必ず入力してください。';
    },
    // 必須入力(e.IS.O5006)
    require2: function(str) {
      return str + 'を入力してください。';
    },
    // 必須入力(e.PM.O8103)
    require3: function(str) {
      return str + 'は必ず選択してください。';
    },
    // 全角のみ
    zenkaku: function(str) {
      return str + 'は全角文字で入力してください。';
    },
    // 半角のみ
    hankaku: function(str) {
      return str + 'は半角文字で入力してください。';
    },
    // 半角数字のみ
    number: function(str) {
      return str + 'は半角数字で入力してください。';
    },
    // 数値の範囲
    numberRange: function(str) {
      return str + 'は{0}から{1}までの範囲で入力してください。';
    },
    // 文字数
    length: function(str) {
      return str + 'は{0}文字で入力してください。';
    },
    // 文字数(範囲内)
    rangelength: function(str) {
      return str + 'は{0}文字から{1}文字までの範囲で入力してください。';
    },
    // 文字数(最大)
    maxlength: function(str) {
      return str + 'は{0}文字以下で入力してください。';
    },
    // 文字数(最小)
    minlength: function(str) {
      return str + 'は{0}文字以上で入力してください。';
    },
    // カタカナ
    katakana: function(str) {
      return str + 'は全角カタカナで入力してください。';
    },
    // 口座名義入力可能文字
    accountHolderCheck: function(str) {
      return str + 'に使用できない文字種が含まれています。カタカナと英数字と記号（￥「」（）／．－，ー）のみが入力可能です。';
    },
    // メールアドレス
    emailCheck: function(str) {
      return str + 'は正しいメールアドレスの形式で入力してください。';
    },
    // パスワード文字列確認
    passwordStrCheck: function(str) {
      return str + 'は英字または数値または記号（!"#$%&\'()*+,-./:;<=>?@[\]^_`{|}~）を使用してください。';
    },
    // パスワード正当性確認
    passwordValidCheck: function(str) {
      return str + 'は英字及び、数字・記号を1つ以上含めてください。';
    },
    // パスワードIdとの被り確認
    passwordIdCheck: function(str) {
      return str + 'は登録されているID（メールアドレス）の＠より前の部分と同じ文字列を含むことができません。';
    },
    // 値が同じかどうかの確認
    equalTo: function(str, base) {
      return '入力された' + base + 'と' + str + 'が一致していません。';
    },
    // 値が同じかどうかの確認
    address: function() {
      return '郵便番号を入力して[郵便番号から住所を検索]を押してください。';
    }
  };
  /**
   *
   */
  Validate.prototype._init = function(el, validateObj) {
    this._$el               = (el) ? $(el) : null;
    this._commonValidateObj = this._getCommonValidateObj();
    this._validateObj       = _ns.Util.isObject(validateObj) ? validateObj : {};
    // elがない場合は処理中止
    if(!this._$el) {
      return;
    }
    this._validate();
  };
  /**
   * バリデーション呼び出し
   */
  Validate.prototype._validate = function() {
    var self = this;
    // 共通のバリデーションオブジェクトにデフォルトの挙動を足す
    $.each(this._validateObj, function(key, value) {
      self._commonValidateObj[key] = value;
    });
    // バリデーション処理
    this._$el.validate(this._commonValidateObj);
  };
  /**
   * デフォルト
   */
  Validate.prototype._getCommonValidateObj = function() {
    var self = this;
    var commonValidateObj = {
      //
      isDebug : true,
      // エラーのclass
      errorClass: 'is_error',
      //
      validClass: 'is_ok',
      // エラー位置調整
      errorPlacement: function($elError, $el) {
        var $elParent = $el.closest('.js_validate');
        if($elParent.length > 0) {
          $elError.addClass('m_formError');
          var $elOtherError = $elParent.children('.m_formError');
          // すでに表示されているエラーがある場合はそのあとに追加する
          if($elOtherError.length > 0) {
            $($elOtherError[$elOtherError.length-1]).after($elError);
          }
          // 表示されているエラーがない場合はそのまま追加する
          else {
            $elParent.prepend($elError);
          }
        }
      },
      // エラー発生時の挙動
      highlight: function(el, errorClass, validClass) {
        var $el = $(el);
        $el.addClass(errorClass).removeClass(validClass);
        // selectの場合
        if(el.tagName === 'SELECT') {
          $el.parents('.m_select').addClass(errorClass);
        }
        // radioの場合
        else if(el.type === 'radio') {
          // 同じnameのものを全てerrorにする
          $('input[name=' + el.name + ']').addClass(errorClass).removeClass(validClass);
        }
        // 親がm_formCheckmarkのもの
        var $elFormCheckmark = $el.parents('.m_formHasCheck');
        if($elFormCheckmark.length > 0) {
          // イベント発行
          $elFormCheckmark.trigger('validateHighlight');
        }
        // disabledかつ、隠されているアイテムはエラーを外す
        self._hideErrorDisabledHiddenItem(errorClass);
      },
      // エラー解消時の挙動
      unhighlight: function(el, errorClass, validClass) {
        var $el = $(el);
        $el.removeClass(errorClass).addClass(validClass);
        // selectの場合
        if(el.tagName === 'SELECT') {
          $el.parents('.m_select').removeClass(errorClass);
        }
        // radioの場合
        else if(el.type === 'radio') {
          // 同じnameのものを全てerrorにする
          $('input[name=' + el.name + ']').removeClass(errorClass).addClass(validClass);
        }
        // 親がm_formCheckmarkのもの
        var $elFormCheckmark = $el.parents('.m_formHasCheck');
        if($elFormCheckmark.length > 0) {
          // イベント発行
          $elFormCheckmark.trigger('validateUnHighlight');
        }
        // disabledかつ、隠されているアイテムはエラーを外す
        self._hideErrorDisabledHiddenItem(errorClass);
      },
      // バリデート後キー押下のたびにバリデーション処理が入るのを防止
      onkeyup: false
    };
    return commonValidateObj;
  };
  /**
   * disabledかつ、隠されているアイテムでエラーのものはエラーを外し、値を消す
   */
  Validate.prototype._hideErrorDisabledHiddenItem = function(errorClass) {
    $('input,textarea,select').each(function(i, el) {
      var $el = $(el);
      if($el.prop('disabled') === true && $el.is(':hidden') === true) {
        // エラーだった場合は値も消す
        if($el.hasClass(errorClass)) {
          $el.removeClass(errorClass);
          $el.prop('value', '');
        }
      }
    });
  };

})(window, document);

$(function() {
  // バリデーションしない条件を指定
  $.validator.setDefaults({
    ignore: '*[disabled]'
  });
});
