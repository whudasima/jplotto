/**
 * @fileoverview
 * @require jquery
 * @require common
*/


;(function(w, d) {

  // namespace
  var _ns = w.lottery = w.lottery || {};

  /**
  * 現在値から探すボタンのリンク処理
  */
  var LinkSchedule = _ns.LinkSchedule = function() {
    this._init.apply(this, arguments);
  };
  LinkSchedule.prototype._init = function() {
    this._triggerSelector = '.js_linkSchedule';
    this._lat             = undefined;
    this._lng             = undefined;
    this._address         = undefined;
    // エラーテキスト
    this._error           = {
                              0: '位置情報の取得ができませんでした。',
                              1: '都道府県の取得ができませんでした。'
                            };
    this._bindClickTrigger();
  };

  /**
   * クリックイベント
  */
  LinkSchedule.prototype._bindClickTrigger = function() {
    var self = this;
    $(d).on('click', this._triggerSelector, function(e) {
      e.preventDefault();
      // 都道府県初期化
      self._prefecture  = undefined;
      // 現在地取得
      self._getMyLocation(
        function(data) {
          self._lat = data.lat;
          self._lng = data.lng;
          // 都道府県のセット
          self._setAddress();
        }
      );
    });
  };

  /**
  * 現在地の取得
  */
  LinkSchedule.prototype._getMyLocation = function(success, fail) {
    success = (typeof success === 'function') ? success : function(){};
    fail = (typeof fail === 'function') ? fail : null;
    var self = this;
    var defalutError = function() {
      // エラー表示
      self._showError(self._error[0]);
    };
    // geolocationApiが使えるかどうかの確認
    if (w.navigator.geolocation) {
      w.navigator.geolocation.getCurrentPosition(
        function(position) {
          success({lat: position.coords.latitude, lng: position.coords.longitude});
        },
        function(error) {
          if(fail) {
            fail(error);
          }
          else {
            defalutError();
          }
        }
      );
    } else {
      // エラー表示
      defalutError();
    }
  };

  /**
  * 住所の文字列をセット
  */
  LinkSchedule.prototype._setAddress = function() {
    var self = this;
    var postData = {
      latlng: this._lat + ',' + this._lng
    };
    window.lottery.Ajax({
      method: 'GET',
      url   : 'https://maps.googleapis.com/maps/api/geocode/json',
      data  : postData,
      done: function(response) {
        self._address = response.results[0].formatted_address;
        self._changeLocation();
      }
    });
  };

  /**
  * 都道府県に応じてリンク先を振り分ける
  */
  LinkSchedule.prototype._changeLocation = function() {
    // alert(this._address);
    // 関東・中部・東北自治 TODO: 飛び先を変更
    if(
      this._address.match('北海道')  ||
      this._address.match('青森県')  ||
      this._address.match('秋田県')  ||
      this._address.match('岩手県')  ||
      this._address.match('山形県')  ||
      this._address.match('宮城県')  ||
      this._address.match('福島県')  ||
      this._address.match('石川県')  ||
      this._address.match('富山県')  ||
      this._address.match('新潟県')  ||
      this._address.match('福井県')  ||
      this._address.match('長野県')  ||
      this._address.match('群馬県')  ||
      this._address.match('栃木県')  ||
      this._address.match('茨城県')  ||
      this._address.match('埼玉県')  ||
      this._address.match('千葉県')  ||
      this._address.match('神奈川県') ||
      this._address.match('山梨県')  ||
      this._address.match('静岡県')  ||
      this._address.match('岐阜県')  ||
      this._address.match('愛知県')  ||
      this._address.match('三重県')
    ) {
      // alert('関東・中部・東北自治');
      location.href = 'detail.html';
    }
    // 東京都の場合 TODO: 飛び先を変更
    else if(
      this._address.match('東京都')
    ) {
      // alert('東京都');
      location.href = 'detail.html';
    }
    // 東京都の場合 TODO: 飛び先を変更
    else if(
      this._address.match('東京都')
    ) {
      // alert('東京都');
      location.href = 'detail.html';
    }
    // 近畿の場合 TODO: 飛び先を変更
    else if(
      this._address.match('滋賀県')  ||
      this._address.match('京都府')  ||
      this._address.match('兵庫県')  ||
      this._address.match('大阪府')  ||
      this._address.match('奈良県')  ||
      this._address.match('和歌山県')
    ) {
      // alert('近畿');
      location.href = 'detail.html';
    }
    // 西日本の場合 TODO: 飛び先を変更
    else if(
      this._address.match('岡山県')  ||
      this._address.match('広島県')  ||
      this._address.match('鳥取県')  ||
      this._address.match('島根県')  ||
      this._address.match('山口県')  ||
      this._address.match('香川県')  ||
      this._address.match('愛媛県')  ||
      this._address.match('高知県')  ||
      this._address.match('徳島県')  ||
      this._address.match('福岡県')  ||
      this._address.match('佐賀県')  ||
      this._address.match('長崎県')  ||
      this._address.match('大分県')  ||
      this._address.match('熊本県')  ||
      this._address.match('宮崎県')  ||
      this._address.match('鹿児島県') ||
      this._address.match('沖縄県')
    ) {
      // alert('西日本');
      location.href = 'detail.html';
    }
    // 条件に当てはまらなかった場合はエラーモーダル表示
    else {
      this._showError(this._error[1]);
    }
  };

  /**
  * エラー表示
  */
  LinkSchedule.prototype._showError = function(errorTxt) {
    var modal = new _ns.AlertModal({
      html: errorTxt
    });
    modal.show();
  };

})(window, document);


$(function() {
  // 現在値から探すボタンのリンク処理
  new window.lottery.LinkSchedule();
});
