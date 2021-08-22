/**
 * @fileoverview
 * @require jquery
 * @require common
 * @require jquery.validate
 * @require validate
 * @require map/common
 */
;
(function (w, d) {

  // namespace
  var _ns = w.lottery = w.lottery || {};

  /**
   * 検索条件のinputを引数で渡されてきたFomrにhiddenで追加する
   */
  _ns.addConditionInput = function (elForm) {
    var $elCheckJumbo = $('#jumboSales');
    var $elCheckNumber = $('#numbersSales');
    var $elCheckAtm = $('#atm');
    var $elCheckPoint = $('#point');
    var inputType = 'hidden';
    var addHtml = '';

    $(elForm).find("#jumboSales").val(0);
    $(elForm).find("#numbersSales").val(0);
    $(elForm).find("#atm").val(0);
    $(elForm).find("#point").val(0);
    // ジャンボ等にチェックが入っている時
    if ($elCheckJumbo.prop('checked') === true) {
      $(elForm).find("#jumboSales").val(1);
    }
    // 数字選択式くじにチェックが入っている時
    if ($elCheckNumber.prop('checked') === true) {
      $(elForm).find("#numbersSales").val(1);
    }
    // ATM宝くじサービスにチェックが入っている時
    if ($elCheckAtm.prop('checked') === true) {
      $(elForm).find("#atm").val(1);
    }
    // 宝くじポイントにチェックが入っている時
    if ($elCheckPoint.prop('checked') === true) {
      $(elForm).find("#point").val(1);
    }
  };

  _ns.isConditionInputed = function () {
    var $elCheckJumbo = $('#jumboSales');
    var $elCheckNumber = $('#numbersSales');
    var $elCheckAtm = $('#atm');
    var $elCheckPoint = $('#point');
    // 全てチェックが入ってなかったらfalseを返す
    if (!$elCheckJumbo.prop('checked') && !$elCheckNumber.prop('checked')
      && !$elCheckAtm.prop('checked') && !$elCheckPoint.prop('checked')) {
      return false;
    }
    return true;
  }

})(window, document);

$(function () {
  // マップ系の共通処理の呼び出し
  var mapUtil = window.lottery.MapUtil;
  var mapApi = window.lottery.MapApi;

  // アラートモーダル(検索条件)
  var alertModalCondition = new window.lottery.AlertModal({
    html: '検索条件を入力してください。'
  });

  // submitの処理
  var submitForm = function (elForm) {
    // フォームに検索条件用のinputを追加
    window.lottery.addConditionInput(elForm);
    // 一つもチェックが入っていなければ処理しない
    if (!window.lottery.isConditionInputed()) {
      alertModalCondition.show();
      return;
    }
    // フォーム送信
    elForm.submit();
  }

  // エラーメッセージ判定
  var checkError = function (data) {
    $('#is_server_error').css('display', 'none');
    $('#is_area_error').css('display', 'none');
    if (data.errorMessage) {
      $('#is_server_error').css('display', 'block').find('p').text(
        data.errorMessage);
      $('#is_area_error').css('display', 'block').find('p').text(
        data.errorMessage);
    }
  }

  // バリデーション共通関数呼び出し
  var validate = window.lottery.Validate;

  /*
   * 現在地から探す
   */
  // バリデーションオブジェクト
  var locationValidateObj = {};

  // 現在地から探すボタン
  locationValidateObj.submitHandler = function (elForm) {
    submitForm(elForm);
  };

  // バリデーション実行
  new validate('#location', locationValidateObj);

  /*
   * エリアから探す
   */
  var $elSelectPrefecture = $('.js_prefecture');
  var $elSelectCity = $('.js_city');
  var $elSelectCityParent = $elSelectCity.parent();
  var $elAreaForm = $elSelectPrefecture.parents('form');
  var elAreaFormAction = $elAreaForm.attr('action');

  var $elCheckJumbo = $('#jumboSales');
  var $elCheckNumber = $('#numbersSales');
  var $elCheckAtm = $('#atm');
  var $elCheckPoint = $('#point');

  // 市区町村取得処理
  var getCityCombo = function (el) {
    var val = el.prop('value');
    if (!val) {
      $elSelectCity.html('<option value="">市区町村</option>');
      $elSelectCityParent.addClass('is_disabled');
      return;
    }
    var options = {};
    options.prefectureCode = val;
    if ($('#jumboSales').prop('checked') === true) {
      options.jumboSales = 1;
    }
    // 数字選択式くじにチェックが入っている時
    if ($('#numbersSales').prop('checked') === true) {
      options.numbersSales = 1;
    }
    // ATM売り場にチェックが入っている時
    if ($('#atm').prop('checked') === true) {
      options.atm = 1;
    }
    // 宝くじポイントにチェックが入っている時
    if ($('#point').prop('checked') === true) {
      options.point = 1;
    }
    // API通信
    mapApi.getCity(options);
  }

  // 都道府県を選択した時の挙動
  $elSelectPrefecture.change(function (e) {
    var $el = $(e.currentTarget);
    getCityCombo($el);
  });
  // ジャンボ、数選、ATM、ポイントを変更した時の処理
  var getCityComboByCheck = function () {
    if ($('#jumboSales').prop('checked') !== true
      && $('#numbersSales').prop('checked') !== true
      && $('#atm').prop('checked') !== true
      && $('#point').prop('checked') !== true) {
      $elSelectCity.html('<option value="">市区町村</option>');
      $elSelectCityParent.addClass('is_disabled');
      return;
    }
    getCityCombo($elSelectPrefecture);
  }
  $elCheckJumbo.change(function () {
    getCityComboByCheck();
  });
  $elCheckNumber.change(function () {
    getCityComboByCheck();
  });
  $elCheckAtm.change(function () {
    getCityComboByCheck();
  });
  $elCheckPoint.change(function () {
    getCityComboByCheck();
  });
  getCityCombo($elSelectPrefecture); // history.back()対応

  // Ajax: apiと通信した結果のデータを受け取って処理する
  $(mapApi.event.BIND_TARGET).on(mapApi.event.SUCCESS_GET_CITY,
    function (e, data) {
      // エラーメッセージ判定
      checkError(data);
      // 受け取ったデータの配列を元に、selectにoptionを設定する
      var optionsHtml = mapUtil.getCityOptions(data);
      $elSelectCityParent.removeClass('is_disabled');
      $elSelectCity.html(optionsHtml);
      // selectのplaceholder化
      new window.lottery.Form.SelectPlaceholder($elSelectCityParent);
    });

  // selectを選んだかどうかによってformのactionを変更する
  setInterval(function () {
    // 都道府県のみ選ばれている時
    if ($elSelectPrefecture.val() && !$elSelectCity.val()) {
      $elAreaForm.attr('action', lottery.value.contextPath
        + '/map/prefectures/');
    }
    // 都道府県と市区町村が選ばれている時
    else if ($elSelectPrefecture.val() && $elSelectCity.val()) {
      $elAreaForm.attr('action', lottery.value.contextPath
        + '/map/municipality/');
    }
    // それ以外は初期値にする
    else {
      $elAreaForm.attr('action', elAreaFormAction);
    }
  }, 165);

  // バリデーションオブジェクト
  var areaValidateObj = {};

  // バリデーションルール
  areaValidateObj.rules = {
    // name: 都道府県
    'prefectureCode': {
      required: true
    }
  };

  // エラー時のバリデーションメッセージ
  areaValidateObj.messages = {
    // name: 都道府県
    'prefectureCode': {
      required: validate.getMessages.require('都道府県')
    }
  };

  // 検索するボタン
  areaValidateObj.submitHandler = function (elForm) {
    submitForm(elForm);
  };

  // バリデーション実行
  new validate('#area', areaValidateObj);

  /*
   * キーワードから探す
   */
  // バリデーションオブジェクト
  var keywordValidateObj = {};

  // バリデーションルール
  keywordValidateObj.rules = {
    // name: キーワード
    'keyword': {
      required: true
    }
  };

  // エラー時のバリデーションメッセージ
  keywordValidateObj.messages = {
    // name: キーワード
    'keyword': {
      required: validate.getMessages.require('キーワード')
    }
  };

  // 検索するボタン
  keywordValidateObj.submitHandler = function (elForm) {
    submitForm(elForm);
  };

  // バリデーション実行
  new validate('#keyword', keywordValidateObj);

});

