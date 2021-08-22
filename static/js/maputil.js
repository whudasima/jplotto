/**
 * @fileoverview
 * @require jquery
 * @require common
 * @require map/common
 */
;
(function(w, d) {
  // namespace
  var _ns = w.lottery = w.lottery || {};
})(window, document);

$(function() {
  // マップ系の共通処理の呼び出し
  var mapApi = window.lottery.MapApi;
  /**
   * 現在地を取得する
   */
  mapApi.getCurrentPosition = function(w, s, e, o) {
    try {
      w.navigator.geolocation.getCurrentPosition(s, e, o);
    } catch (ex) {
      e();
      return;
    }
  }
  /**
   * 現在地を取得する
   */
  mapApi.getMyLocation = function(s, e, o) {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          s(position.coords.latitude, position.coords.longitude);
        }, function(error) {
          e(error);
        }, o);
      } else {
        e();
      }
    } catch (ex) {
      e();
      return;
    }
  }
  /**
   * 会員住所を取得する
   */
  mapApi.getMemberAddress = function(str, timeout) {
    try {
      mapApi.getAddress(str, timeout);
    } catch (ex) {
      $(mapApi.event.BIND_TARGET).trigger(mapApi.event.FAIL_GET_ADDRESS, {});
      return;
    }
  }

  /**
   * 地図を取得する
   */
  mapApi.ROADMAP = function() {
    try {
      return google.maps.MapTypeId.ROADMAP;
    } catch (ex) {
      return;
    }
  }
  /**
   * 左上を取得する
   */
  mapApi.LEFT_TOP = function() {
    try {
      return google.maps.ControlPosition.LEFT_TOP;
    } catch (ex) {
      return;
    }
  }
  /**
   * 徒歩を取得する
   */
  mapApi.WALKING = function() {
    try {
      return google.maps.DirectionsTravelMode.WALKING;
    } catch (ex) {
      return;
    }
  }
  /**
   * 運転を取得する
   */
  mapApi.DRIVING = function() {
    try {
      return google.maps.DirectionsTravelMode.DRIVING;
    } catch (ex) {
      return;
    }
  }
  /**
   * OKを取得する
   */
  mapApi.OK = function() {
    try {
      return google.maps.DirectionsStatus.OK;
    } catch (ex) {
      return;
    }
  }
  /**
   * ZEROを取得する
   */
  mapApi.ZERO_RESULTS = function() {
    try {
      return google.maps.DirectionsStatus.ZERO_RESULTS;
    } catch (ex) {
      return;
    }
  }
  /**
   * 四角を取得する
   */
  mapApi.Rectangle = function(j) {
    try {
      return new google.maps.Rectangle(j);
    } catch (ex) {
      return;
    }
  }
  /**
   * 地図を取得する
   */
  mapApi.Map = function(t, o) {
    try {
      return new google.maps.Map(t, o);
    } catch (ex) {
      return;
    }
  }
  /**
   * 経路コントロールを表示する
   */
  mapApi.pushRoute = function(map, route) {
    try {
      map.controls[google.maps.ControlPosition.LEFT_TOP].push(route);
    } catch (ex) {
      if (route) {
        $('.m_mapContent').html(route);
      }
      return;
    }
  }
  /**
   * 緯度経度を取得する
   */
  mapApi.LatLng = function(lat, lon) {
    try {
      return new google.maps.LatLng(lat, lon);
    } catch (ex) {
      return;
    }
  }
  /**
   * 緯度経度境界を取得する
   */
  mapApi.LatLngBounds = function(o) {
    try {
      return new google.maps.LatLngBounds(o);
    } catch (ex) {
      return;
    }
  }
  /**
   * サイズを取得する
   */
  mapApi.Size = function(w, h) {
    try {
      return new google.maps.Size(w, h);
    } catch (ex) {
      return;
    }
  }
  /**
   * windowを取得する
   */
  mapApi.InfoWindow = function(i) {
    try {
      return new google.maps.InfoWindow(i);
    } catch (ex) {
      return;
    }
  }
  /**
   * マーカーを取得する
   */
  mapApi.Marker = function(j) {
    try {
      return new google.maps.Marker(j);
    } catch (ex) {
      return;
    }
  }
  /**
   * イベントを設定する
   */
  mapApi.addListener = function(t, e, f) {
    try {
      google.maps.event.addListener(t, e, f);
    } catch (ex) {
      return;
    }
  }
  /**
   * イベントをクリアする
   */
  mapApi.clearListeners = function(t, e) {
    try {
      google.maps.event.clearListeners(t, e);
    } catch (ex) {
      e();
      return;
    }
  }
  /**
   * ディレクションサービスを取得する
   */
  mapApi.directionsService = function() {
    try {
      return new google.maps.DirectionsService();
    } catch (ex) {
      return;
    }
  }
  /**
   * ディレクションレンダラを取得する
   */
  mapApi.directionsRenderer = function(j) {
    try {
      return new google.maps.DirectionsRenderer(j);
    } catch (ex) {
      return;
    }
  }
  /**
   * マーカー位置設定
   */
  mapApi.markerSetPosition = function(m, LatLng) {
    try {
      m.setPosition(LatLng);
    } catch (ex) {
      return;
    }
  }
  /**
   * マーカー地図設定
   */
  mapApi.markerSetMap = function(m, map) {
    try {
      m.setMap(map);
    } catch (ex) {
      return;
    }
  }
  /**
   * マーカー方向設定
   */
  mapApi.markerSetDirections = function(m, ｒ) {
    try {
      m.setDirections(ｒ);
    } catch (ex) {
      return;
    }
  }
  /**
   * マーカー緯度取得
   */
  mapApi.markerLatitude = function(m) {
    try {
      return m.lat();
    } catch (ex) {
      return;
    }
  }
  /**
   * マーカー緯度取得
   */
  mapApi.markerLongitude = function(m) {
    try {
      return m.lng();
    } catch (ex) {
      return;
    }
  }
  /**
   * ルート設定
   */
  mapApi.directionsRoute = function(s, r, f) {
    try {
      s.route(r, f);
    } catch (ex) {
      return;
    }
  }

});
