window.lottery = window.lottery || {};
lottery.ajax = (function() {
    "use strict";
    /**
     * Ajax処理中の場合、true.
     */
    var _isAjax = false;
    /**
     * チェック対象外判定.
     */
    var NOT_TARGET = [ "number", "string", "null", "undefined", "function" ];

    /**
     * Ajax通信を行う.
     * 
     * @param param
     *            Ajax通信を行うためのパラメータ<BR>
     *            done 成功処理<BR>
     */
    function _ajax(param, done, fail, always) {

        // URL
        var url = param.url;

        // タイムアウト時間
        var timeout = param.timeout ? lottery.value.ajaxTimeout : 0;

        // リクエストデータ
        var requestData = param.data;

        // データ種別
        var dataType = param.dataType;

        // CSRFトークン
        if ($(":hidden[name='_csrf']").val()) {
            requestData._csrf = $(":hidden[name='_csrf']").val();
        }

        // トランザクショントークン
        if ($(":hidden[name='_TRANSACTION_TOKEN']").val()) {
            requestData._TRANSACTION_TOKEN = $(":hidden[name='_TRANSACTION_TOKEN']").val();
        }

        // 画面ID
        if ($(":hidden[name='__fromScreenId']").val()) {
            requestData.__fromScreenId = $(":hidden[name='__fromScreenId']").val();
        }

        // 操作
        if (param.ope) {
            requestData.__ope = param.ope;
        } else if (param.__ope) {
            requestData.__ope = param.__ope;
        }

        $.ajax(url, {
            "type" : "POST",
            "data" : $.param(requestData),
            "dataType" : dataType,
            "timeout" : timeout,
        }).done(function(data) {
            done(_convertObjectKey(data));
        }).fail(function(jqXHR) {
            fail(jqXHR, param.fail);
        }).always(function() {
            always();
        });
    }

    /**
     * Ajax通信失敗時の共通処理.
     */
    function _commonFail(jqXHR, _failMehood) {
        $(".modal-overlay-ajax").css("display", "none");
        $(".indicator-overlay").css("display", "none");        
        var statusCode = jqXHR.status; // HTTPステータス
        var statusText = jqXHR.statusText;
        var STATUS_403 = 403;// csrfトークンエラー
        var STATUS_406 = 406;// ユーザエージェントが変更され場合
        var STATUS_404 = 404;
        var STATUS_500 = 500;
        
        if (statusCode === STATUS_403 || statusCode === STATUS_406) {
            var topPageUrl = lottery.value.contextPath;
            window.location.href = topPageUrl;
            //Ajax エラーハンドラー終了
            return;
        } else {
            var fail = (_failMehood !== undefined && typeof _failMehood === 'function') ? _failMehood : null;
            if (fail !== null ) {
                // csrfトークンエラー , ユーザエージェントエラーでもなく
                // ajaxエラーの個別定義が有効な場合
                fail(jqXHR);
                //Ajax エラーハンドラー終了
                return;
            }
        }
    }

    /**
     * Ajax通信を行う.
     * 
     * @param param
     *            url URL<BR>
     *            data データ<BR>
     *            dataType データ種別<BR>
     *            ope 操作<BR>
     *            callbackSuccess コールバック関数(成功)<BR>
     *            fail コールバック関数（失敗）<BR>
     *            indicator インジケータ有無<BR>
     *            timeout　タイムアウト有無<BR>
     */
    function ajaxCommunication(param) {

        if(_isAjax) {
            return;
        }

        _isAjax = true;

        if(param.indicator) {
            $(".modal-overlay-ajax").css("display", "block");
            $(".indicator-overlay").css("display", "block");
        }

        _ajax(param, function(data) {
            param.callbackSuccess(data);
        }, function(jqXHR) {
            _commonFail(jqXHR, param.fail );
        }, function() {
            $(".modal-overlay-ajax").css("display", "none");
            $(".indicator-overlay").css("display", "none");
            _isAjax = false;
        });
    }


    /**
     * Ajax通信かどうかを判定するためのオブジェクト.
     */
    function isAjax() {
        return _isAjax;
    }

    /**
     * 対象のオブジェクトの場合、変換して返却する.
     * 
     * @return 変換した値
     */
    function _rename(data, key) {
        // booleanの場合、先頭にisを付与する
        // booleanの配列の場合を考慮し、keyがstringか判断する
        if ($.type(data[key]) === "boolean" && $.type(key) === "string") {
            var temp = data[key];
            delete data[key];
            data[(function() {
                return "is" + key.substring(0, 1).toUpperCase();
            }()) + key.substring(1, key.length)] = temp;
        }
    }

    /**
     * 返却値の名称をチェックする.<BR>
     * チェック対象の場合、名称を変換する.<BR>
     * booleanの場合、isを付与する.
     * 
     * @return 変換した値
     */
    function _convertObjectKey(data) {
        if ($.inArray($.type(data), NOT_TARGET) === -1) {
            // 対象の場合、チェックを行う
            $.each(data, function(key) {
                _rename(data, key);
                // 再帰的に処理を継続し、内部の確認を行う
                _convertObjectKey(data[key]);
            });
        }
        return data;
    }

    return {
        ajaxCommunication : ajaxCommunication,
        isAjax : isAjax
    };
}());
