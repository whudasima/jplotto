$(function() {
  // 初期表示
  var self = new window.lottery.MapManager({
    type : $("#topType").val(),
    jumboSales : $("#topJumboSales").val(),
    numbersSales : $("#topNumbersSales").val(),
    atm : $("#topAtm").val(),
    point : $("#topPoint").val(),
    prefecture : $("#topPrefectureCode").val(),
    city : $("#topCityCode").val(),
    keyword : $("#topKeyword").val(),
    pageno : $("#pageno").val(),
  });
  // 情報ウィンドウの店舗行クリック
  $(document).on("click", ".spot_item", function(e) {
    e.preventDefault();
    $("#ope").val("店舗ウィンドウクリック");
    $("#uribaCode").val($(this).attr("uribaCode"));
    $("#isUribaKensakuForm").attr("action", $("#next").val());
    $("#isUribaKensakuForm").submit();
  });
  // リストの店舗行クリック
  $(document).on("click", "li.m_list2_item", function(e) {
    e.preventDefault();
    $("#ope").val("店舗行クリック");
    $("#uribaCode").val($(this).attr("uribaCode"));
    $("#isUribaKensakuForm").attr("action", $("#next").val());
    // 自画面の初期表示に必要なパラメータを設定
    $("#topType").val(self._type);
    $("#topJumboSales").val(self._jumboSales);
    $("#topNumbersSales").val(self._numbersSales);
    $("#topAtm").val(self._atm);
    $("#topPrefectureCode").val(self._prefecture);
    $("#topCityCode").val(self._city);
    $("#topKeyword").val(self._keyword);
    // 店舗詳細_初期表示
    $("#isUribaKensakuForm").submit();
  });
  // 上の絞込ボタンクリック
  $(document).on("click", ".js_mapFilter_btn", function(e) {
    e.preventDefault();
    // 都道府県、市区町村、キーワード すべて未入力はエラー
    if (!isValidInputs()) {
      return;
    }
    let
    type = "search";
    if ($("#lists").val() != "0") {
      type = "filterSearch";
      // 絞込のときは一つもチェックが入っていなければエラー
      if (!isValidChekcs()) {
        return;
      }
    }
    // 絞込チェックと入力条件（都道府県、市区町村、キーワード）で再検索
    $("#topType").val("keyword");
    self._searchResult(0, type);
  });
  // キーワードでキー押下
  $(document).on("keypress", "#keyword", function(e) {
    // エンターキーが押下された場合のみ、再検索を行う
    if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
      e.preventDefault();
      // 都道府県、市区町村、キーワード すべて未入力はエラー
      if (!isValidInputs()) {
        return;
      }
      let
      type = "search";
      if ($("#lists").val() != "0") {
        type = "filterSearch";
        // 絞込のときは一つもチェックが入っていなければエラー
        if (!isValidChekcs()) {
          return;
        }
      }
      // 絞込チェックと入力条件（都道府県、市区町村、キーワード）で再検索
      $("#topType").val("keyword");
      self._searchResult(0, type);
    }
  })
  // 下の絞込ボタンクリック
  $(document).on("click", ".js_result_filter_btn", function(e) {
    e.preventDefault();
    // 一つもチェックが入っていなければエラー
    if (!isValidChekcs()) {
      return;
    }
    // 絞込チェックと呼び出し元条件（現在地、キーワード）で再検索
    self._searchResult(0, "filter");
  });
  function isValidChekcs() {
    if ($("#jumboSales").prop('checked') !== true
        && $("#numbersSales").prop('checked') !== true
        && $("#atm").prop('checked') !== true
        && $("#point").prop('checked') !== true) {
      window.lottery.MapManager.prototype.alertModalFilter.show();
      return false;
    }
    $("#topJumboSales").val(0);
    $("#topNumbersSales").val(0);
    $("#topAtm").val(0);
    $("#topPoint").val(0);
    // ジャンボ宝くじ等にチェックが入っている時
    if ($('#jumboSales').prop('checked') === true) {
      $("#topJumboSales").val(1);
    }
    // 数字選択式くじにチェックが入っている時
    if ($('#numbersSales').prop('checked') === true) {
      $("#topNumbersSales").val(1);
    }
    // ATM宝くじサービスにチェックが入っている時
    if ($('#atm').prop('checked') === true) {
      $("#topAtm").val(1);
    }
    // 宝くじポイントにチェックが入っている時
    if ($('#point').prop('checked') === true) {
      $("#topPoint").val(1);
    }
    return true;
  }
  function isValidInputs() {
    const
    pref = $("#prefectureCode").val() || undefined;
    const
    city = $("#cityCode").val() || undefined;
    const
    keyword = $("#keyword").val() || undefined;
    if (!pref && !city && !keyword) {
      window.lottery.MapManager.prototype.alertModalCondition.show();
      return false;
    }
    // 入力値で検索キーを置き換え
    $("#topPrefectureCode").val($("#prefectureCode").val());
    $("#topCityCode").val($("#cityCode").val());
    $("#topKeyword").val($("#keyword").val());
    return true;
  }
});

