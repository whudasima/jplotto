/**
 * @fileoverview
 * index.js
 * @require jquery, slick, common, carousel
 */
; (function (w, d) {

  // namespace
  var _ns = w.lottery = w.lottery || {};

  /**
   * InfoModal
   * ページ来訪時に表示するモーダル制御
   */
  var InfoModal = _ns.InfoModal = _ns.InfoModal || function () {
    this._init.apply(this, arguments);
  };
  /**
   * InfoModal
   *
   */
  InfoModal.prototype._init = function () {
    // 表示待機モーダル格納用
    this._modals = [];
    this._currentModal = 0;
    this._createHowtoModal();
    // モーダル表示
    this._show();
  };

  /**
   * 使い方説明用のモーダル
   */
  InfoModal.prototype._createHowtoModal = function () {
    var html = '<div class="m_modal" tabindex="0" id="sc_wmb_sp_307">' +
      '<div class="m_modal_header">' +
      '<div class="m_modal_header_inner">' +
      '<p class="m_modal_header_ttl">【重要】当せん金受取口座再登録のお願い</p>' +
      '</div>' +
      '<!-- /.m_modal_header --></div>' +
      '<div class="m_modal_body">' +
      '<p>当せん金受取口座の登録処理の不具合により、会員登録時にご登録いただいた口座情報が、正しく反映されておりません。</p>' +
      '<p><正しく反映されている場合の表示例>' +
      '<br>口座番号 12345-1-1234****' +
      '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12345-1234****</p>' +
      '<p><正しく反映されていない可能性のある表示例>' +
      '<br>口座番号 12345-1-****' +
      '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12345-****</p>' +
      '<p>お手数をおかけしますが、［当せん金受取口座の確認］を押下のうえ、[口座情報を変更する]から、当せん金受取口座の再登録のお手続きをお願いいたします。</p>' +
      '<p>ご迷惑をお掛けしておりますことをお詫び申し上げます。</p>' +
      '</div>' +
      '<div class="m_modal_footer">' +
      '<ul class="m_modal_btnWrap2">' +
      '<li>' +
      '<a href="javascript:;" class="m_modal_btn m_btn m_btn__color2 m_btn__block js_modal_close">' +
      '<span>閉じる</span>' +
      '</a>' +
      '</li>' +
      '<li>' +
      '<a href="' + window.lottery.value.contextPath + '/mypage/setting/bank/check/" opeName="当せん金受取口座" fromScreenId="SC_WMC_SP_901" class="m_modal_btn m_btn m_btn__block js_delete">' +
      '<span>当せん金受取口座の確認</span>' +
      '</a>' +
      '</li>' +
      '</ul>' +
      '</div>' +
      '</div>';

    var modal = new _ns.Modal({
      $el: $(html)
    });
    this._modals.push(modal);
  };

  /**
   *
   */
  InfoModal.prototype._show = function () {
    var self = this;
    var currentModal = this._modals[this._currentModal];
    // 準備されたモーダルがなければ処理終了
    if (!currentModal) {
      return;
    }
    currentModal.show();
    // 閉じた時に次のモーダルを表示
    currentModal.getModalEl().on('hideModal', function () {
      self._currentModal++;
      // 次のモーダル出現のため、少しだけ遅らせる
      setTimeout(function () {
        self._show();
      }, 0);
    });

  };

})(window, document);


$(function () {
  // カルーセル
  window.lottery.CarouselImg();

  if (String(window.lottery.value.FurikomiError).replace(/\\/g, "") == '1') {
    new window.lottery.InfoModal();
    //new window.lottery.AlertModal({html:'振込エラーあるので口座を再登録してください！'}).show();
  }
});

$(window).on('load', function () {
  // 発売中の宝くじの高さを揃える
  new window.lottery.Tile('#limited > li .m_cardLotteryOther_ttl', 3);
  new window.lottery.Tile('#limited > li .m_cardLotteryNumWrap', 3);
  new window.lottery.Tile('#limited > li', 3);

  new window.lottery.Tile('#sale > li .m_cardLotteryNumWrap', 3);
  new window.lottery.Tile('#sale > li', 3);
});

$(function () {
  window.lottery.ajax.ajaxCommunication({
    "url": window.lottery.value.contextPath + String(window.lottery.value.coBannerFile).replace(/\\/g, ""),
    "data": {
      'type': 'carryover'
    },
    "dataType": "json",
    "callbackSuccess": function (data) {
      var carryover = data["carryover"];
      var billionaire = data["billionaire"];

      var jpyen = function (s) {
        var num = parseInt(s);
        var digit = ['', '<span>万</span>', '<span>億</span>'];
        var result = '';
        if (num) {
          var nums = String(num).replace(/(\d)(?=(\d{4})+$)/g, "$1,").split(",").reverse();
          for (var i = 0; i < nums.length; i++) {
            if (!nums[i].match(/^[0]+$/)) {
              nums[i] = nums[i].replace(/^[0]+/g, "");
              if (nums[i].length == 4) {
                nums[i] = nums[i].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1<span class="u_lotoInfoComma">,</span>');
              }
              result = nums[i] + digit[i] + result;
            }
          }
        }
        return result;
      };

      ['loto6', 'loto7'].forEach(function (i) {
        if (carryover[i] == 0) {
          $(".m_" + i + "_billionaire_number").append(billionaire[i] + "<span>口</span>");
          $(".m_" + i + "_carryover_block").hide();
        } else {
          $(".m_" + i + "_carryover_number").append(jpyen(carryover[i]) + "<span>円</span>");
          $(".m_" + i + "_billionaire_block").hide();
        }
      });
    },
    "fail": function (e) {
      console.log(e);
    },
    "ope": "ロトキャリーオーバー取得"
  });
});
