/**
 * @fileoverview
 * @require jquery
 * @require common
 */

;(function(w, d) {

  // namespace
  var _ns = w.lottery = w.lottery || {};

  // マップ系の共通処理の呼び出し
  var mapUtil = _ns.MapUtil;
  var mapApi  = _ns.MapApi;

  /**
   * googleMap制御用
   */
  var MapManager = _ns.MapManager = function() {
    this._init.apply(this, arguments);
  };
  // アラートモーダル(検索条件)
  MapManager.prototype.alertModalCondition =  new window.lottery.AlertModal({
    html: '検索条件を入力してください。'
  });
  // アラートモーダル(絞り込み条件)
  MapManager.prototype.alertModalFilter =  new window.lottery.AlertModal({
    html: '絞り込み条件を入力してください。'
  });

  /**
   * 
   */
  MapManager.prototype._init = function(options) {
    options            = _ns.Util.isObject(options) ? options : {};
    // 表示タイプ location:現在地から探す、area：エリアから探す、keyword：キーワードで探す
    this._type         = options.type || undefined;
    // 検索条件:ジャンボ宝くじ等
    this._jumboSales   = 'jumboSales' in options ? options.jumboSales : '0';
    // 検索条件:数字選択式宝くじ
    this._numbersSales = 'numbersSales' in options ? options.numbersSales : '0';
    // 検索条件:ATM宝くじサービス
    this._atm          = 'atm' in options ? options.atm : '0';
    // 検索条件:宝くじポイント
    this._point          = 'point' in options ? options.point : '0';
    // 都道府県
    this._prefecture   = 'prefecture' in options ? options.prefecture : undefined;
    // 市区町村
    this._city         = 'city' in options ? options.city : undefined;
    // キーワード
    this._keyword      = 'keyword' in options ? options.keyword : undefined;
    //
    this._stateHide    = 'is_hide';
    this._stateOpen    = 'is_open';
    // 地図描画エリア
    this._$elMapParent = $('.js_map');
    // 地図描画エリア
    this._elMap        = $('#map')[0];
    // googleMapオブジェクト格納用
    this._map          = undefined;
    // googleMapマーカー格納用配列
    this._markers      = [];
    // googleMapマーカークリックで表示する吹き出し格納用配列
    this._infoWindows  = [];

    // センターの表示設定。lication:現在地優先 / shop:店舗の座業優先
    this._centerType   = undefined;
    this._centerInfo   = {};
    // 表示する地図のオプション、初期で入っているものは共通の設定
    this._mapOptions   = {};
    // 何らかの理由でエラーになった時に使用するgoogleMapの設定
    this._mapErrorOptions = {
            center: mapApi.LatLng($('#latitudeDefault').val(), $('#longitudeDefault').val()),
            mapTypeId: mapApi.ROADMAP(),
            disableDefaultUI: true,
            zoomControl: true,
            zoom: Number($('#zoomDefault').val())
          };
    this._mapKeywordErrorOptions = {
            center: mapApi.LatLng($('#latitudeDefault').val(), $('#longitudeDefault').val()),
            mapTypeId: mapApi.ROADMAP(),
            disableDefaultUI: true,
            zoomControl: true,
            zoom: Number($('#zoomDefault').val())
          };
    // エラーテキスト
    this._mapError = {
      0: '位置情報の取得ができませんでした。'
    };

    // 地図上の検索アイテム
    this._$elMapFilter           = $('.js_mapFilter');
    this._$elMapFilterPref       = $('.js_mapFilter_prefecture');
    this._$elMapFilterCity       = $('.js_mapFilter_city');
    this._$elMapFilterCityParent =   this._$elMapFilterCity.parent();
    this._$elMapFilterKeyword    = $('.js_mapFilter_keyword');
    this._$elMapFilterTxt        = $('.js_mapFilter_txt');
    this._$elMapFilterBtn        = $('.js_mapFilter_btn');
    // 検索アイテム内の切り替えるテキスト
    this._mapFilterTxtInnerTxt   = {
      normal: '条件を変更して再検索できます。',
      noResult: '条件を変更して再検索できます。'
    };
    this._mapFilterBtnInnerTxt   = {
      normal: '再検索',
      noResult: '再検索'
    };
    this._mapFilterBtnAddClass   = {
      normal: 'm_mapSerch_btn__search',
      noResult: 'm_mapSerch_btn__search'
    };

    // 検索結果
    this._$elResult              = $('.js_result');
    // 検索結果
    this._$elResultHead          = $('.js_result_head');
    // 検索結果件数
    this._$elResultHeadTxt       = $('.js_result_head_txt');
    // 絞り込みを展開するトリガー
    this._$elResultHeadFilter    = $('.js_result_head_filter');
    // 検索結果が0件
    this._$elResultNoResult      = $('.js_result_noResult');
    // 絞り込み
    this._$elResultFilter        = $('.js_result_filter');
    this._$elResultFilterJumbo   = $('.js_result_filter_jumbo');
    this._$elResultFilterNumbers = $('.js_result_filter_numbers');
    this._$elResultFilterAtm     = $('.js_result_filter_atm');
    this._$elResultFilterPoint     = $('.js_result_filter_point');
    // 絞り込みを展開するかどうかのフラグ
    this._isOpenResultHeadFilter = false;
    // 絞り込み実行ボタン
    this._$elResultFilterBtn     = $('.js_result_filter_btn');
    // 店舗
    this._$elResultShop          = $('.js_result_shop');
    // 店舗一覧
    this._$elResultShopList      = $('.js_result_shopList');
    // ページャー
    this._$elResultPager         = $('.js_result_pager');
    // ページャー
    this._$elResultPagerList     = $('.js_result_pagerList');
    // 店舗の配列
    this._shopsOrigin            = [];
    //
    // 検索条件で絞り込みされた店舗の配列
    this._shops                  = [];
    // 店舗一覧表示用配列
    this._shopList               = [];
    // 店舗一覧の1ページの個数
    this._shopListPageMaxNum     = $('#pageSize').val();
    // 店舗一覧の現在ページ
    this._shopListPageCurrent    = 0;

    this._isNoResult             = false;
    // ページャの情報
    this._pagerOrigin            = {};
    // ページャ
    this._pageno                 = options.pageno || undefined;

    // 発行するイベント
    this._event                     = mapApi.event || {};
    // マップオプションの設定完了時
    this._event.SETTING_MAP_OPTIONS = 'settingMapOptions';

    this._latitude   = 'latitude' in options ? options.latitude : undefined;
    this._longitude   = 'longitude' in options ? options.longitude : undefined;
    this._latitudePager   = 'latitude' in options ? options.latitude : undefined;
    this._longitudePager   = 'longitude' in options ? options.longitude : undefined;
    this._north   = 'north' in options ? options.north : undefined;
    this._south   = 'south' in options ? options.south : undefined;
    this._west   = 'west' in options ? options.west : undefined;
    this._east   = 'east' in options ? options.east : undefined;
    this._timeout     = $('#timeout').val();
    this._zoom     = Number($('#zoom').val());
    this._spotzoom     = $('#zoomSpot').val();
    this._spotzoom     = 14;
    // フィルター・再検索
    this._filterSearch         = options.filterSearch || undefined;
    // 初回
    this._isFirst                = true;
    this._isToggled              = false;
    // 各種イベントの付与
    this._bindEvents();
    // マップ初期表示
    this._setInitialMap();
    // 市区町村リストボックスの有効化
    if ($('#topCityCode').val() != "") {
      this._$elMapFilterCityParent.removeClass('is_disabled');
    }
  };

  /**
   * マップのオプションの設定
   */
  MapManager.prototype._bindEvents = function() {
    var self = this;

    // マップのopition設定が完了した時
    $(this._event.BIND_TARGET).on(this._event.SETTING_MAP_OPTIONS, function() {
      if(!self._map) {
        self._drawMap();
      }
      else {
        var latlng = mapApi.LatLng(self._latitude, self._longitude);
        self._map.panTo(latlng);
      }
    });

    // 住所からの緯度経度取得が成功したら
    $(this._event.BIND_TARGET).on(this._event.SUCCESS_GET_ADDRESS, function(e, result) {
      self._latitude = 0;
      self._longitude = 0;
      if(result) {
        self._latitude = result.geometry.location.lat();
        self._longitude = result.geometry.location.lng();
      }
      self._latitudePager   = self._latitude;
      self._longitudePager   = self._longitude;
      // 店舗取得後に地図描画 
      self._getShopList();
    });
    // 住所からの緯度経度取得が失敗したら
    $(this._event.BIND_TARGET).on(this._event.FAIL_GET_ADDRESS, function(e, data) {
      self._latitude = 0;
      self._longitude = 0;
      self._latitudePager   = self._latitude;
      self._longitudePager   = self._longitude;
      // 店舗取得後に地図描画 
      self._getShopList();
    });

    // 店舗一覧を取得した時
    $(this._event.BIND_TARGET).on(this._event.SUCCESS_GET_SHOP, function(e, data) {
      data = data || {};
      // エラー判定
      if (data.errorMessage && 0 < data.errorMessage.length) {
        if (data.errorMessage == "filter") {
          self.alertModalFilter.show();
        }
        else {
          self.alertModalCondition.show();
        }
        return;
      }
      // 条件にあった店舗があった場合
      // Ajax: 受け取るショップ一覧の値によっては更新の必要あり
      if(data.shops && data.shops.length > 0) {
        // 店舗取得後に地図描画 
        if(self._type === 'keyword') {
          if (data.prefectures) {
            $("#prefectures").val(data.prefectures);
          }
          if (data.city) {
            $("#city").val(data.city);
          }
          if (self._filterSearch != "pager") {
            self._latitude = data.shops[0].latitude;
            self._longitude = data.shops[0].longitude;
          }
          self._setMapOptions();
        }
        self._isNoResult = false;
        self._shopsOrigin = data.shops;
        self._pagerOrigin = data.pager;
        self._filterShop();
      }
      // なかった場合
      else {
        self._isNoResult = true;
        // 店舗取得後に地図描画 
        if(self._type === 'keyword') {
          self._latitude = $('#latitudeDefault').val();
          self._longitude = $('#longitudeDefault').val();
          self._drawMap(self._mapKeywordErrorOptions);
        }
        self._showNoResult();
        self._showMapFilter();
      }
    });

    // 都道府県のプルダウンを変更した時
    $(this._$elMapFilterPref).on('change', function(e, isUnResetCity) {
      var $el = $(e.currentTarget);
      var val = $el.prop('value');
      if(!val) {
        self._$elMapFilterCity.html('<option value="">市区町村</option>');
        self._$elMapFilterCityParent.addClass('is_disabled');
        return;
      }
      var options = {};
      options.prefectureCode = val;
      if($('#jumboSales').prop('checked') === true) {
          options.jumboSales =  1;
      }
      // 数字選択式くじにチェックが入っている時
      if($('#numbersSales').prop('checked') === true) {
          options.numbersSales =  1;
      }
      // ATM宝くじサービスにチェックが入っている時
      if($('#atm').prop('checked') === true) {
          options.atm = 1;
      }
      //宝くじポイントにチェックが入っている時
      if($('#point').prop('checked') === true) {
          options.point = 1;
      }
      options.ope = "都道府県のプルダウン変更";
      options.timeout = self._timeout;
      // API通信
      mapApi.getCity(options);
    });

    // 市区町村のデータ取得のAjax終了後のイベント
    $(mapApi.event.BIND_TARGET).on(mapApi.event.SUCCESS_GET_CITY, function(e, data) {
      // 受け取ったデータの配列を元に、selectにoptionを設定する
      var optionsHtml = mapUtil.getCityOptions(data);
      self._$elMapFilterCityParent.removeClass('is_disabled');
      self._$elMapFilterCity.html(optionsHtml);
      self._$elMapFilterCity.val(self._city);
      // selectのplaceholder化
      new window.lottery.Form.SelectPlaceholder(self._$elMapFilterCityParent);
    });

    // 取り扱いくじの絞り込みボタンを押した時
    this._$elResultHeadFilter.on('click', function(e) {
      e.preventDefault();

      var $el = $(e.currentTarget);
      // 閉じる時
      if($el.hasClass(self._stateOpen)) {
        self._isOpenResultHeadFilter = false;
      }
      else {
        self._isOpenResultHeadFilter = true;
      }

    });
  };

  /**
   * マップの初期表示
   */
  MapManager.prototype._setInitialMap = function() {
    var self = this;
    // 現在地から探す
    if(this._type === 'location') {
      this._centerType = 'location';
      // 現在地を取得して、地図を描画
      this._getMyLocation(
        function(data) {
          // 店舗一覧を取得
          self._latitude = data.lat;
          self._longitude = data.lng;
          self._setMapOptions();          // 検索前に移動
        }
      );
    }
    // キーワードから探す
    else if(this._type === 'keyword') {
      this._centerType = 'shop';
      // 現在地・会員住所取得してソート順を確定する
      this._getKeywordLocation(
        function(data) {
          // 店舗一覧を取得
          self._latitude = data.lat;
          self._longitude = data.lng;
          self._latitudePager = self._latitude;
          self._longitudePager = self._longitude;
          // 店舗取得後に地図描画
          self._getShopList();
        }
      );
    }  };

  /**
   * マップのオプション設定
   */
  MapManager.prototype._setMapOptions = function() {
    // センター位置の更新
    // Ajax: 受け取るショップ一覧の値によっては更新の必要あり
    $(".js_map").removeClass("is_hide").css("background-color", "#C4C4C4");
    var latlng  = mapApi.LatLng(this._latitude, this._longitude);
    // mapのoption設定
    var mapOptions = {
      center: latlng,
      mapTypeId: mapApi.ROADMAP(),
      mapTypeControl: false,
      disableDefaultUI: true,
      zoomControl: true,
      zoom: Number($("#zoom").val())
    };
    this._mapOptions = mapOptions;
    // 完了イベントの発行
    $(this._event.BIND_TARGET).trigger(this._event.SETTING_MAP_OPTIONS);
  };

  /**
   * マップの描画
   */
  MapManager.prototype._drawMap = function(options) {
    options = options || this._mapOptions;
    var self = this;
    $(this._$elMapParent).removeClass(this._stateHide);
    this._map = mapApi.Map(this._elMap, options);
    // マップへのイベント
    mapApi.addListener(this._map, 'dragend', function() {
      self.mapChanged();
    });
    mapApi.addListener(this._map, 'zoom_changed', function() {
      self.mapChanged();
    });
    mapApi.addListener(this._map, 'tilesloaded', function() {
      self.mapLoaded();
    });
  }
  /**
   * マップイベント tilesloaded
   */
  MapManager.prototype.mapLoaded = function() {
    var self = this;
    if (!self._isFirst) {
        return;
    }
    self._isFirst = false;
    self.mapChanged();
  }
  /**
   * マップイベントの処理 dragend zoom_changed
   */
  MapManager.prototype.mapChanged = function() {
    var self = this;
    // マップの位置情報保存
    self.saveChanged();
    if (self._type == 'location'
      && self._latitude != 0
      && self._longitude != 0
      && self._spotzoom <= self._zoom) {
      // 検索
      self._getShopList();
    }
  }
  /**
   * マップの位置情報保存
   */
  MapManager.prototype.saveChanged = function() {
    var self = this;
    // 内部に保存
    var center = self._map.getCenter();
    center = center.toJSON();
    self._latitude = center.lat;
    self._longitude = center.lng;
    var bounds = self._map.getBounds();
    bounds = bounds.toJSON();
    self._north = bounds.north;
    self._south = bounds.south;
    self._west = bounds.west;
    self._east = bounds.east;
    self._zoom = self._map.getZoom();
    // hiddenに保存
    $("#latitude").val(center.lat);
    $("#longitude").val(center.lng);
    $("#north").val(bounds.north);
    $("#south").val(bounds.south);
    $("#west").val(bounds.west);
    $("#east").val(bounds.east);
    $("#zoom").val(self._zoom);
  }

  /**
   * マーカーの設定
   */
  MapManager.prototype._setMarker = function() {
    var self = this;
    this._clearMarker();
    this._closeInfoWindow();
    var markerSize = {
      w: 31,
      h: 39
    };
    // Ajax: Ajaxで取得した店舗データ形式によっては内容を変更
    $(this._shops).each(function(i, shopData) {
      var latlng  = mapApi.LatLng(shopData.latitude, shopData.longitude);
      var size  = mapApi.Size(markerSize.w, markerSize.h);
      var marker = mapApi.Marker({
        position: latlng,
        map: self._map,
        icon: {
          url: '/assets/img/common/ic-map-marker001.png',
          scaledSize: size
        }
      });
      var infowindow = self._createInfoWindow(shopData);
      // マーカーのクリックイベント
      mapApi.addListener(marker, 'click', function() {
        // マーカーの座業に移動
        self._map.panTo(marker.getPosition());
        // 移動した座業から中心を少しずらす
        self._map.panBy(0, -120);
        // 情報ウィンドウを閉じる
        self._closeInfoWindow();
        // マーカーに紐付いた情報ウィンドウの表示
        infowindow.open(self._map, marker);
      });
      self._markers.push(marker);
    });
  };

  /**
   * マーカーの消去
   */
  MapManager.prototype._clearMarker = function() {
    // mapから除去
    $(this._markers).each(function(i, marker) {
      if (marker) {
        marker.setMap(null);
      }
    });
    // 配列を初期化
    this._markers = [];
  };

  /**
   * 情報ウィンドウを生成
   */
  MapManager.prototype._createInfoWindow = function(shopInfo) {
    shopInfo = shopInfo || {};
    // Ajax: Ajaxで取得した店舗データ形式によっては内容を変更
    // ラベルの設定
    var labelJumbo   = '';
    var labelNumbers = '';
    var labelAtm     = '';
    var labelPoint     = '';
    if(shopInfo.jumboSales == '1') {
      labelJumbo = 'm_label__jumbo';
    }
    if(shopInfo.numbersSales == '1') {
      labelNumbers = 'm_label__numbers';
    }
    if(shopInfo.atm == '1') {
      labelAtm = 'm_label__atm';
    }
    if(shopInfo.point == '1') {
      labelPoint = 'm_label__point';
    }
    // 情報ウィンドウ内のHTML
    var html = '<div style="padding:8px 0;">' +
                  '<dl class="m_shopInfo2">' +
                    '<dt class="spot_item" uribaCode="' + shopInfo.id + '" >' +
                    '<a href="javascript:void(0)" >' +
                        shopInfo.name +
                      '</a>' +
                    '</dt>'+
                    '<dd class="m_shopInfo2_txt">' +
                      shopInfo.address +
                    '</dd>' +
                    '<dd class="m_shopInfo2_status">' +
                      '<span class="m_label ' + labelJumbo + '">' +
                        'ジャンボ宝くじ等' +
                      '</span> ' +
                      '<span class="m_label ' + labelNumbers + '">' +
                        '数字選択式宝くじ' +
                      '</span> ' +
                      '<span class="m_label ' + labelAtm + '">' +
                        'ATM宝くじサービス' +
                      '</span> ' +
                      '<span class="m_label ' + labelPoint + '">' +
                        '宝くじポイント' +
                      '</span> ' +
                    '</dd>' +
                  '</dl>' +
                '</div>';
      var infoWindow = mapApi.InfoWindow({
      content: html
    });
    this._infoWindows.push(infoWindow);
    return infoWindow;
  };

  /**
   * 情報ウィンドウを閉じる
   */
  MapManager.prototype._closeInfoWindow = function() {
    // mapから除去
    $(this._infoWindows).each(function(i, obj) {
      if (obj) {
        obj.close();
      }
    });
  };

  /**
   * 現在地の取得
   */
  MapManager.prototype._getMyLocation = function(success) {
    success = (typeof success === 'function') ? success : function(){};
    var self = this;
    // geolocationApiが使えるかどうかの確認
    if (w.navigator.geolocation) {
      var options = {timeout: self._timeout};
        mapApi.getCurrentPosition(w, 
        function(position) {
          success({lat: position.coords.latitude, lng: position.coords.longitude});
        },
        function(error) {
          self._latitude = 0;
          self._longitude = 0;
          self._isNoResult = true;
          self._showNoResult();
          self._showMapFilter();
          self._drawMap(self._mapErrorOptions);
        },
        options
      );
    } else {
      // エラー表示
      self._latitude = 0;
      self._longitude = 0;
      self._isNoResult = true;
      self._showNoResult();
      self._showMapFilter();
      self._drawMap(self._mapErrorOptions);
    }
  };

  /**
   * 現在地の取得（キーワード）
   */
  MapManager.prototype._getKeywordLocation = function(success) {
    success = (typeof success === 'function') ? success : function(){};
    var self = this;
    // geolocationApiが使えるかどうかの確認
    if (w.navigator.geolocation) {
      var options = {timeout: self._timeout};
      mapApi.getCurrentPosition(w, 
        function(position) {
          success({lat: position.coords.latitude, lng: position.coords.longitude});
        },
        function(error) {
          self._getAddress($("#prefectures").val(), $("#city").val(), $("#streetAddress").val());
        },
        options
      );
    } else {
        self._getAddress($("#prefectures").val(), $("#city").val(), $("#streetAddress").val());
    }
  };

  /**
   * 店舗一覧情報の取得
   */
  MapManager.prototype._getShopList = function() {
    // this._centerInfoを元にajaxで店舗一覧を取得する
    var options = {};
    if(this._type === 'keyword') {
      options.lat = this._latitudePager;
      options.lng = this._longitudePager;
    }
    else {
      options.lat = this._latitude;
      options.lng = this._longitude;
    }
    options.north = this._north;
    options.south = this._south;
    options.west = this._west;
    options.east = this._east;
    if(this._keyword) {
      options.keyword = this._keyword;
    }
    options.jumboSales = this._jumboSales;
    options.numbersSales = this._numbersSales;
    options.atm = this._atm;
    options.point = this._point;
    if(this._prefecture) {
      options.prefectureCode = this._prefecture;
    }
    if(this._city) {
      options.cityCode = this._city;
    }
    if(this._type) {
      options.type = this._type;
    }
    if(this._pageno) {
      options.pageno = this._pageno;
    }
    if(this._filterSearch) {
      options.filterSearch = this._filterSearch;
    }
    options.ope = "店舗一覧情報取得";
    options.timeout = this._timeout;
    mapApi.getShop(options);
  };

  /**
   * 都道府県と市区町村を元に緯度経度を取得する
   */
  MapManager.prototype._getAddress = function(prefectures, city, streetAddress) {
    var address = '';
    if(prefectures) {
      address += prefectures;
    }
    if(city) {
      address += city;
    }
    if(streetAddress) {
      address += streetAddress;
    }
    // 都道府県と市区町村を元にajaxで店舗一覧を取得する
    if (address) {
      mapApi.getMemberAddress(address, this._timeout);
    }
    else {
      // 住所情報なしで一覧表示
      this._latitude = 0;
      this._longitude = 0;
      this._latitudePager   = this._latitude;
      this._longitudePager   = this._longitude;
      // 店舗取得後に地図描画 
      this._getShopList();
    }
  };

  /**
   * エラー表示
   */
  MapManager.prototype._showError = function(errorTxt) {
    var modal = new _ns.AlertModal({
      html: errorTxt
    });
    modal.show();
    this._showNoResult(errorTxt);
  };

  /**
   * 検索条件で絞り込んだショップ一覧を返す
   */
  MapManager.prototype._getFilteredShop = function() {
    return this._shopsOrigin;
  };

  /**
   * 店舗を検索条件で絞り込む
   */
  MapManager.prototype._filterShop = function() {
    this._shops = this._getFilteredShop();
    // 初期化
    this._shopList            = [];
    this._shopListPageCurrent = 0;
    // 絞り混んだ結果存在する場合
    if(this._shops.length > 0) {
      // マップの設定
      // 店舗一覧表示用のオブジェクトの作成
      this._setShopList();
    }
    // 0件だった場合
    else {
      // マップの設定
      //
      this._showNoResultFilter();
      this._showMapFilter();
    }
    // マーカーの設置
    this._setMarker();
  };

  /**
   * 店舗一覧処理
   */
  MapManager.prototype._setShopList = function() {
    var self = this;
    //
    var page = 0;

    $(this._shops).each(function(i, shop) {
      //
      if(i > 0 && i%self._shopListPageMaxNum === 0) {
        page = page + 1;
        // ページのカウントを更新
        self._shopListPageNum = self._shopListPageNum + 1;
      }
      //
      if(i%self._shopListPageMaxNum === 0) {
        self._shopList[page] = [];
      }

      self._shopList[page].push(shop);
    });
    // 結果表示制御
    this._showResult();

    // 店舗の一覧を生成
    this._createShopList();
    // ページャーの生成
    this._createPager();
    // 地図のフィルターエリア表示制御
    this._showMapFilter();
  };

  /**
   * 店舗一覧html作成
   */
  MapManager.prototype._createShopList = function() {
    var html = '<ul class="m_list2">';
    // Ajax: Ajaxで取得した店舗データ形式によっては内容を変更
    $(this._shopList[this._shopListPageCurrent]).each(function(i, shopInfo) {
      // ラベルの設定
      var labelJumbo   = '';
      var labelNumbers = '';
      var labelAtm     = '';
      var labelPoint     = '';
      if(shopInfo.jumboSales == '1') {
        labelJumbo = 'm_label__jumbo';
      }
      if(shopInfo.numbersSales == '1') {
        labelNumbers = 'm_label__numbers';
      }
      if(shopInfo.atm == '1') {
        labelAtm = 'm_label__atm';
      }
      if(shopInfo.point == '1') {
        labelPoint = 'm_label__point';
      }
      html += '<li class="m_list2_item" uribaCode="' + shopInfo.id + '" >' +
                '<a href="javascript:void(0)" class="m_list2_linkArrow m_linkArrow">' +
                  '<dl class="m_shopInfo2">' +
                    '<dt>' +
                      shopInfo.name +
                    '</dt>' +
                    '<dd class="m_shopInfo2_txt">' +
                      shopInfo.address +
                    '</dd>' +
                    '<dd class="m_shopInfo2_status">' +
                      '<span class="m_label ' + labelJumbo + '">ジャンボ宝くじ等</span> ' +
                      '<span class="m_label ' + labelNumbers + '">数字選択式宝くじ</span> ' +
                      '<span class="m_label ' + labelAtm + '">ATM宝くじサービス</span> ' +
                      '<span class="m_label ' + labelPoint + '">宝くじポイント</span> ' +
                    '</dd>' +
                  '</dl>' +
                '</a>' +
              '</li>';
    });
    html += '</ul>';

    // 店舗一覧
    this._$elResultShopList.html(html);
    this._$elResultShop.removeClass(this._stateHide);
  };

  /**
   * ページャー生成
   */
  MapManager.prototype._createPager = function() {
    var self = this;
    if (self._pagerOrigin.totalCount <= self._pagerOrigin.pageSize) {
      this._$elResultPagerList.html('');
      this._$elResultPager.addClass(this._stateHide);
      return;
    }
    var html = '<ul class="m_pagination">';
    const max = (self._pagerOrigin.totalCount + self._pagerOrigin.pageSize - 1) / self._pagerOrigin.pageSize;
    for (let i = 0; i < Math.floor(max); i++) {
      if (5 < Math.floor(max) 
        && i != 0
        && !(self._pagerOrigin.pageNumber <= 3
                && i <= 3)
        && !(Math.floor(max) - 3 <= self._pagerOrigin.pageNumber
                && Math.floor(max) - 3 <= i)
        && !(self._pagerOrigin.pageNumber - 1 <= i
                && i <= self._pagerOrigin.pageNumber + 1)
        && i != Math.floor(max) - 1) {
        if (i == 2 || i == Math.floor(max) - 2) {
            html += '<li>' +
            '<span class="m_pagination_ellipsis">…</span>' +
          '</li>';
        }
        continue;
      }
      let current = '';
      if(i == self._pagerOrigin.pageNumber) {
        current = 'is_current';
      }
      html += '<li>' +
                '<a href="javascript:;" class="m_pagination_link js_result_pagerLink ' + current + '" data-page-num="' + i + '">' + (i+1) + '</a>' +
              '</li>';
    }
    html += '</ul>';

    // 店舗一覧
    this._$elResultPagerList.html(html);
    this._$elResultPager.removeClass(this._stateHide);

    // ページャーのイベント設定
    $('.js_result_pagerLink').on('click', function(e) {
      e.preventDefault();
      var $el = $(e.currentTarget);
      var gotoPageNum = $el.attr('data-page-num') - 0;
      if(!$el.hasClass('is_current')) {
        $("#pageno").val(gotoPageNum);
        self._filterSearch = "pager";
        self._setCondition(gotoPageNum);
        self._getShopList();
      }
    });
  };
  /**
   * 再検索
   */
  MapManager.prototype._searchResult = function(gotoPageNum, fs) {
    var self = this;
    // 検索結果を表示
    this._filterSearch = fs;
    this._clearMarker();
    this._closeInfoWindow();
    this._setCondition(gotoPageNum);
    this._centerType = 'shop';
    // 再検索時は表示位置クリアする
    this._latitude = 0;
    this._longitude = 0;
    // 再検索時は現在ページをクリアする
    $("#pageno").val("0")
    // 現在地・会員住所取得してソート順を確定する
    this._getKeywordLocation(
      function(data) {
        // 店舗一覧を取得
        self._latitude = data.lat;
        self._longitude = data.lng;
        self._latitudePager   = self._latitude;
        self._longitudePager   = self._longitude;
        // 店舗取得後に地図描画
        self._getShopList();
      }
    );

   };
  /**
   * 検索条件設定
   */
   MapManager.prototype._setCondition = function(gotoPageNum) {
     this._type = $("#topType").val();
     this._jumboSales = $("#topJumboSales").val();
     this._numbersSales = $("#topNumbersSales").val();
     this._atm = $("#topAtm").val();
     this._point = $("#topPoint").val();
     this._prefecture = $("#topPrefectureCode").val();
     this._city = $("#topCityCode").val();
     this._keyword = $("#topKeyword").val();
     this._latitude = $("#latitude").val();
     this._longitude = $("#longitude").val();
     this._north = $("#north").val();
     this._south = $("#south").val();
     this._west = $("#west").val();
     this._east = $("#east").val();
     this._pageno = gotoPageNum;
   };

  /**
   * 結果表示
   */
  MapManager.prototype._showResult = function() {
    var resultTxt = this._pagerOrigin.totalCount + '件の店舗があります。';
    this._$elResultHeadTxt.html(resultTxt);

    // 絞り込みエリアの書き換え
    this._showResultFilter();

    // エリアの表示制御
    this._$elResultHead.removeClass(this._stateHide);
    this._$elResultHeadTxt.removeClass(this._stateHide);
    this._$elResultHeadFilter.removeClass(this._stateHide);
    this._$elResultNoResult.addClass(this._stateHide).removeClass('m_box__first');
    this._$elResult.removeClass(this._stateHide);
    this._$elResultFilter.addClass(this._stateHide);
  };

  /**
   * 結果表示
   */
  MapManager.prototype._showNoResult = function(str) {
    str = str || '該当する宝くじ売り場はありません。';
    var resultTxt = '<div class="m_box_inner">' +
                      '<p class="u_center">' + str + '</p>' +
                    '</div>';
    this._$elResultNoResult.html(resultTxt);

    // エリアの表示制御
    this._$elResultHead.addClass(this._stateHide);
    this._$elResultShop.addClass(this._stateHide);
    this._$elResultNoResult.removeClass(this._stateHide).addClass('m_box__first');
    this._$elResultPager.addClass(this._stateHide);
    this._$elResult.removeClass(this._stateHide);
    this._$elResultFilter.addClass(this._stateHide);
  };

  /**
   * フィルターをかけた上での結果表示
   */
  MapManager.prototype._showNoResultFilter = function() {
    var resultTxt = '<div class="m_box_inner">' +
                      '<p class="u_center">該当する宝くじ売り場はありません。</p>' +
                    '</div>';
    this._$elResultNoResult.html(resultTxt);

    this._showResultFilter();

    // エリアの表示制御
    this._$elResultHead.removeClass(this._stateHide);
    this._$elResultHeadTxt.addClass(this._stateHide);
    this._$elResultHeadFilter.removeClass(this._stateHide);
    this._$elResultShop.addClass(this._stateHide);
    this._$elResultNoResult.removeClass(this._stateHide).removeClass('m_box__first');
    this._$elResultPager.addClass(this._stateHide);
    this._$elResult.removeClass(this._stateHide);
    this._$elResultFilter.addClass(this._stateHide);
  };

  /**
   * 結果部分のフィルター表示
   */
  MapManager.prototype._showResultFilter = function() {
    if($("#topJumboSales").val() == '1') {
      this._$elResultFilterJumbo.prop('checked', true);
    } else {
      this._$elResultFilterJumbo.prop('checked', false);
    }
    if($("#topNumbersSales").val() == '1') {
      this._$elResultFilterNumbers.prop('checked', true);
    } else {
      this._$elResultFilterNumbers.prop('checked', false);
    }
    if($("#topAtm").val() == '1') {
      this._$elResultFilterAtm.prop('checked', true);
    } else {
      this._$elResultFilterAtm.prop('checked', false);
    }
    if($("#topPoint").val() == '1') {
      this._$elResultFilterPoint.prop('checked', true);
    } else {
      this._$elResultFilterPoint.prop('checked', false);
    }
  };

  /**
   * 地図上のフィルター表示
   */
  MapManager.prototype._showMapFilter = function() {
    // apiから取得した値が0件だった場合
    if(this._isNoResult) {
      this._$elMapFilterTxt.text(this._mapFilterTxtInnerTxt.noResult);
      this._$elMapFilterBtn.removeClass(this._mapFilterBtnAddClass.normal)
                           .addClass(this._mapFilterBtnAddClass.noResult);
      this._$elMapFilterBtn.html('<span><span>' + this._mapFilterBtnInnerTxt.noResult + '</span></span>');
      $("#lists").val("0");
    } else {
      this._$elMapFilterTxt.text(this._mapFilterTxtInnerTxt.normal);
      this._$elMapFilterBtn.removeClass(this._mapFilterBtnAddClass.noResult)
                           .addClass(this._mapFilterBtnAddClass.normal);
      this._$elMapFilterBtn.html('<span><span>' + this._mapFilterBtnInnerTxt.normal + '</span></span>');
      $("#lists").val("1");
    }

    // エリアの表示
    if (!this._isToggled) {
      // 初期表示時のみ
      this._isToggled = true;
      $(".m_mapSerch_detail").toggle();
      $("#upFilter").addClass(this._stateOpen);
    }
    // このタイミングで表示させないと先にアコーディオン上部が表示される
    this._$elMapFilter.removeClass(this._stateHide);
    this._$elMapFilter.addClass(this._stateOpen);
  };

})(window, document);

