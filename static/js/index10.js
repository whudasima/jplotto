lottery.SC_WMB_SP_101 = (function() {
    "use strict";
    
    function init() {
        /*$('html,body').animate({scrollTop:'0px'});*/
        if(window.lottery.value.rtnCode == 1 && window.lottery.value.hnbFlag == 0) {
            // フォーカスの設定： 宝くじ発売スケジュール
            $("#scheduleTop").focus();
            } else if(window.lottery.value.hnbFlag == 1 && window.lottery.value.shsiCode == 0) {
            // フォーカスの設定： グループを作成する１
            $("#groupClosed").focus();
            $("#groupClosedSp").focus();
        }
    }
    return {
        init : init
    };
}());

$(function() {
    lottery.SC_WMB_SP_101.init();
});
