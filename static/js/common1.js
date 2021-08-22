/**
 * @fileoverview
 * @require jquery
 * @require common
 * @require jquery.validate
 * @require validate
 */
;
(function(w, d) {

  // namespace
  var _ns = w.lottery = w.lottery || {};

  /**
   * map系共通の関数群
   */
  var MapUtil = _ns.MapUtil = _ns.MapUtil || {};

  /**
   * 渡されてきたデータを元にoptionタグを生成して返却する
   */
  MapUtil.getCityOptions = function(data) {
    var optionsHtml = '<option value="">市区町村</option>';
    // Ajax: apiから取得する物によって、中身を変更する
    $(data.cities).each(
        function(i, obj) {
          optionsHtml += '<option value="' + obj.cityCode + '">' + obj.city
              + '(' + obj.uribaCount + ')</option>';
        });
    return optionsHtml;
  };

  /**
   * Api通信
   */
  var MapApi = _ns.MapApi = _ns.MapApi || {};

  /**
   * API通信完了後のイベント名定義
   */
  MapApi.event = {
    BIND_TARGET : window,
    SUCCESS_GET_CITY : 'successGetCity',
    SUCCESS_GET_SHOP : 'successGetShop',
    SUCCESS_GET_ADDRESS : 'successGetAddress',
    FAIL_GET_ADDRESS : 'failGetAddress',
    SUCCESS_GET_STATION : 'successGetStation'
  };

  /**
   * 市区町村一覧を取得する
   */
  MapApi.getCity = function(options) {
    var self = this;
    // Ajax: apiにpostするデータ 
    var postData = {};
    if (options.prefectureCode) {
      postData.prefectureCode = options.prefectureCode;
    }
    if (options.jumboSales) {
      postData.jumboSales = options.jumboSales;
    }
    if (options.numbersSales) {
      postData.numbersSales = options.numbersSales;
    }
    if (options.atm) {
      postData.atm = options.atm;
    }
    if (options.point) {
      postData.point = options.point;
    }
    postData.timeout = options.timeout || 10000;
    // Ajax: 市区町村取得用のapi通信 lottery.ajax.ajaxCommunication window.lottery.Ajax
    lottery.ajax.ajaxCommunication({
      method : 'POST', // Ajax: 
      url : lottery.value.contextPath + '/map/citylist/', // Ajax: 
      data : postData, // Ajax: 
      ope : options.ope,
      callbackSuccess : function(response) {
        // 完了のイベントを発行してデータを渡す
        $(self.event.BIND_TARGET)
            .trigger(self.event.SUCCESS_GET_CITY, response);
      },
      fail : function(jqXHR) {
        var response = {};
        $(self.event.BIND_TARGET)
            .trigger(self.event.SUCCESS_GET_CITY, response);
      }
    });
  };

  /**
   * 店舗一覧を取得する
   */
  MapApi.getShop = function(options) {
    options = _ns.Util.isObject(options) ? options : {};
    var self = this;
    // Ajax: apiにpostするデータ 
    var postData = {};
    if (options.lat) {
      postData.latitude = options.lat;
    }
    if (options.lng) {
      postData.longitude = options.lng;
    }
    if (options.north) {
      postData.north = options.north;
    }
    if (options.south) {
      postData.south = options.south;
    }
    if (options.west) {
      postData.west = options.west;
    }
    if (options.east) {
      postData.east = options.east;
    }
    if (options.keyword) {
      postData.keyword = options.keyword;
    }
    if (options.type) {
      postData.searchType = options.type;
    }
    if (options.pageno) {
      postData.pageno = options.pageno;
    }
    if (options.jumboSales) {
      postData.jumboSales = options.jumboSales;
    }
    if (options.numbersSales) {
      postData.numbersSales = options.numbersSales;
    }
    if (options.atm) {
      postData.atm = options.atm;
    }
    if (options.point) {
      postData.point = options.point;
    }
    if (options.prefectureCode) {
      postData.prefectureCode = options.prefectureCode;
    }
    if (options.cityCode) {
      postData.cityCode = options.cityCode;
    }
    if (options.filterSearch) {
      postData.filterSearch = options.filterSearch;
    }
    postData.timeout = options.timeout || 10000;
    // Ajax: apiから緯度経度・キーワードを元に店舗一覧を取得する lottery.ajax.ajaxCommunication
    // window.lottery.Ajax
    lottery.ajax.ajaxCommunication({
      method : 'POST', // Ajax: 
      url : lottery.value.contextPath + '/map/shoplist/', // Ajax: 
      data : postData, // Ajax: 
      ope : options.ope,
      callbackSuccess : function(response) {
        // 完了のイベントを発行してデータを渡す
        $(self.event.BIND_TARGET)
            .trigger(self.event.SUCCESS_GET_SHOP, response);
      },
      fail : function(jqXHR) {
        var response = {};
        $(self.event.BIND_TARGET)
            .trigger(self.event.SUCCESS_GET_SHOP, response);
      }
    });
  };

  /**
   * google geocording apiを使用して住所を取得する
   */
  MapApi.getAddress = function(str, timeout) {
    var self = this;
    str = str || undefined;
    if (!str) {
      return;
    }
    var request = {
      address : str
    };
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode(request,
        function(results, stat) {
          if (stat == google.maps.GeocoderStatus.OK) {
            $(self.event.BIND_TARGET).trigger(self.event.SUCCESS_GET_ADDRESS,
                results[0]);
          } else {
            $(self.event.BIND_TARGET).trigger(self.event.FAIL_GET_ADDRESS,
                results);
          }
        });
  };

  /**
   * 最寄り駅を返す
   */
  MapApi.getStation = function(map, station, timeout) {
    var self = this;
    if (!station) {
      return;
    }
    var request = {
      query : station
    };
    var service = new google.maps.places.PlacesService(map);
    service.textSearch(request, function(results, stat) {
      if (stat == google.maps.places.PlacesServiceStatus.OK) {
        $(self.event.BIND_TARGET).trigger(self.event.SUCCESS_GET_STATION,
            results[0]);
      }
    });

  };
})(window, document);

