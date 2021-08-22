window.lottery = window.lottery || {};
lottery.doubleClick = (function() {
    "use strict";
    
    /**
     * doubleClick処理中の場合、true.
     */
    var _isSubmit = false;

    /**
    * 二重クリック対応(FRONT用)
    */
    function init() {
        $("body").submit(function() {
            if(!_isSubmit) {
                _isSubmit = true;
                // タイムアウト時間
                var timeout = lottery.value.doubleclickTimeout;
                // ダウンロードボタン押下時の対応として、一定秒数経過後にフラグを戻す
                setTimeout(function(){_isSubmit = false}, timeout);
                return true;
            } else {
                return false;
            }
        });
    }

    return {
        init : init
    }
}());

$(function() {
    lottery.doubleClick.init();
})