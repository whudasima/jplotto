(function() {
    "use strict";

    // JavaScript値連携機能
    // metaタグに設定されたサーバサイドからの連携データを変数に格納
    // BOとフロントで同一ロジックになる必要があるため、修正したらBO側も直すこと
    if($("meta[name='lottery:value']").length) {
        var metaValue = $("meta[name='lottery:value']").attr("content");
        var decodedValue = decodeURIComponent(escape(window.atob(metaValue)));
        try {
            lottery.value = $.parseJSON(decodedValue);
            // コンテキストパス変換
            if(lottery.value.contextPath) {
                lottery.value.contextPath = decodeURIComponent(escape(window.atob(lottery.value.contextPath)));
            }
        } catch(e) {
           // 何もしない
        }
    }

}());
