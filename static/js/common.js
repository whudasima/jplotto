/**
 * @fileoverview
 * common.js
 * @require jquery
 */
;(function (w, d) {
  // namespace
  var _ns = (w.lottery = w.lottery || {})

  /**
   * [Number ES6] isNaN
   * @param    {*}         value
   * @return   {bool}
   */
  Number.isNaN =
    Number.isNaN ||
    function (value) {
      return typeof value === 'number' && value !== value
    }

  /**
   * Util static class
   * サイト内共通で使用する便利関数群
   */
  var Util = (_ns.Util = _ns.Util || {})

  /**
   * undefined型かどうかを返す
   * @param   {*}     value
   * @return  {bool}
   */
  Util.isUndefined = function (value) {
    return typeof value === 'undefined'
  }

  /**
   * functionかどうかを返す
   * @param   {*}     value
   * @return  {bool}
   */
  Util.isFunction = function (value) {
    return typeof value === 'function'
  }

  /**
   * null型かどうかを返す
   * @param   {*}     value
   * @return  {bool}
   */
  Util.isNull = function (value) {
    return !value && typeof value === 'object'
  }

  /**
   * オブジェクトかどうかを返す
   * @param   {*}     value
   * @return  {bool}
   */
  Util.isObject = function (value) {
    return !!value && typeof value === 'object'
  }

  /**
   * NaNかどうかを返す
   * @param   {*}     value
   * @return  {bool}
   */
  Util.isNaN = function (value) {
    return Number.isNaN(value)
  }

  /**
   * ユーザーエージェント関係の関数群
   */
  Util.ua = {
    ua: w.navigator.userAgent.toLowerCase(),
    /**
     * Androidかどうかの判定
     * @return  {bool}
     */
    isAndroid: function () {
      return this.ua.indexOf('android') !== -1
    },
    /**
     * iOSかどうかの判定
     * @return  {bool}
     */
    isIOS: function () {
      return this.ua.indexOf('iphone') !== -1 || this.ua.indexOf('ipad') !== -1
    },
    /**
     * スマートフォンかどうかの判定
     * @return  {bool}
     */
    isSp: function () {
      return this.isAndroid() || this.isIOS()
    },
  }

  /**
   * windowの位置系情報を取得する
   * @return  {object}    - {w:幅, h:高さ, t:スクロール量(上から), l:スクロール量(左から)}
   */
  Util.getWindowInfo = function () {
    var result = {}
    var $w = $(w)
    result.w =
      w.innerWidth || d.documentElement.clientWidth || d.body.clientWidth
    result.h =
      w.innerHeight || d.documentElement.clientHeight || d.body.clienHeight
    result.t = $w.scrollTop()
    result.l = $w.scrollLeft()
    return result
  }

  /**
   * 要素の位置系情報を取得する
   * @param   {HTMLElement}   el    - 要素
   * @return  {object}    - {w:幅, h:高さ, t:スクロール量(上から), l:スクロール量(左から)}
   * wキーに幅、hキーに高さ、tにスクロール位置を格納する
   */
  Util.getElementInfo = function (el) {
    if (Util.isUndefined(el)) {
      return
    }
    var result = {}
    var $el = $(el)
    if ($el.length === 0) {
      return
    }
    result.w = $el.innerWidth()
    result.h = $el.innerHeight()
    result.t = $el.offset().top
    result.l = $el.offset().left
    return result
  }

  /**
   * 現在の表示がSPかどうかを返す
   * @return  {bool}
   */
  Util.isSpView = function () {
    if (Util.getWindowInfo().w < 769) {
      return true
    } else {
      return false
    }
  }

  /**
   * タッチデバイスかどうか返す
   * @return  {bool}
   */
  Util.isTouchDevice = function () {
    return 'createTouch' in document || 'ontouchstart' in document
  }

  /**
   * img要素を生成して返す
   * @param   {string}   src    - null, undefinedはsrc属性を生成しない
   * @param   {object}   attrs
   * @return  {HTMLElement}
   */
  Util.createImg = function (src, attrs) {
    var img = new Image()
    if (!Util.isUndefined(src) && !Util.isNull(src)) {
      img.src = src
    }
    if (Util.isObject(attrs)) {
      for (var key in attrs) {
        img.setAttribute(key, attrs[key])
      }
    }
    if (!img.getAttribute('alt')) {
      img.alt = ''
    }
    return img
  }

  /**
   * 指定された要素を生成して返す
   * @param   {string}   tagName    - null, undefinedは生成しない
   * @param   {object}   attrs
   * @return  {HTMLElement}
   */
  Util.createElement = function (tagName, attrs) {
    if (Util.isUndefined(tagName) || Util.isNull(tagName)) {
      return null
    }
    var el = d.createElement(tagName)
    if (Util.isObject(attrs)) {
      for (var key in attrs) {
        el.setAttribute(key, attrs[key])
      }
    }
    return el
  }

  /**
   * 3桁ごとにカンマを挿入して返す
   * @param   {number}   num
   * @return  {string}
   */
  Util.getAddComma = function (num) {
    if (Number.isNaN(num - 0)) {
      return num
    }
    var str = num + '' //{string}
    while (str !== (str = str.replace(/^(-?\d+)(\d{3})/, '$1,$2'))); //3桁毎にカンマを挿入
    return str
  }

  /**
   * カンマを削除した文字列を返す
   * @param   {string}   str
   * @return  {string}
   */
  Util.getRemoveComma = function (str) {
    var _str = str + ''
    var num = _str.replace(/,/g, '') //カンマを削除
    if (!Number.isNaN(num - 0)) {
      return num
    } else {
      return str
    }
  }

  /**
   * 全角数字文字列を半角数字文字列に変換して返す
   * @param   {string}   str
   * @return  {string}
   */
  Util.getCastNumber = function (str) {
    var _str = '' + str
    var regexp
    var casts = {
      '０': 0,
      '１': 1,
      '２': 2,
      '３': 3,
      '４': 4,
      '５': 5,
      '６': 6,
      '７': 7,
      '８': 8,
      '９': 9,
    }
    for (var key in casts) {
      regexp = new RegExp(key, 'g')
      _str = _str.replace(regexp, casts[key])
    }
    return _str
  }

  /**
   * Ajax static class
   * $.ajaxのラッパー
   * @param   {object}   settings
   */
  var Ajax = (_ns.Ajax = function (settings) {
    if (!Util.isObject(settings)) {
      return
    }
    // ajax通信、共通のエラーを定義
    var failFunction = function (jqXHR, textStatus, errorThrown) {}
    // パラメータ定義
    var method = settings.method ? settings.method : 'POST'
    var url = settings.url ? settings.url : ''
    var data = settings.data ? settings.data : ''
    var cache = 'cache' in settings ? settings.cache : true
    var done = Util.isFunction(settings.done) ? settings.done : function () {}
    var fail = Util.isFunction(settings.fail) ? settings.fail : failFunction
    // URL指定がない場合は処置を止める
    if (!url) {
      return
    }
    var ajaxParams = {
      method: method,
      url: url,
    }
    if (data) {
      ajaxParams.data = data
    }
    ajaxParams.cache = cache
    // ajax通信
    $.ajax(ajaxParams)
      // 成功
      .done(function (response, textStatus, jqXHR) {
        done(response, textStatus, jqXHR)
      })
      // 失敗
      .fail(function (jqXHR, textStatus, errorThrown) {
        fail(jqXHR, textStatus, errorThrown)
      })
  })

  /**
   * AddStateTouchDevice static class
   * bodyにtouchdevice判定用のclassを付与
   */
  var AddStateTouchDevice = (_ns.AddStateTouchDevice = function () {
    if (_ns.Util.isTouchDevice()) {
      $('body').removeClass('is_notTouchDevice')
    } else {
      $('body').addClass('is_notTouchDevice')
    }
  })

  /**
   * GrobalNav static class
   * グローバルナビゲーション表示制御
   */
  var GrobalNav = (_ns.GrobalNav =
    _ns.GrobalNav ||
    function () {
      GrobalNav.init()
    })
  GrobalNav.init = function () {
    this.$elGrobalNavWrap = $('.l_container_nav')
    this.$elGrobalNav = $('.l_globalNav')
    this.openState = 'is_open'

    // PC
    this.$elGrobalNavList = $('.l_globalNav_list > li')
    this.$elGrobalNavListLink = this.$elGrobalNavList.children('a')
    this.grobalNavSubName = '.l_globalNav_sub'
    this.$elFooter = $('.l_container_footer')

    // SP 共通
    this.$elContainer = $('.l_container')
    this.$elMenuSp = $('.l_menuSp')
    this.$elMenuSpHeader = $('.l_menuSp_header')
    this.$elMenuBg

    // SP ドロワー
    this.$elDrawer = $('.js_drawer')
    this.$elDrawerTrigger = $('.js_drawer_trigger')
    this.elDrawerClass = 'l_drawer_bg'
    this.oepnScrollTop = 0

    // SP ユーザー情報
    this.$elInfoDrawer = $('.js_infoDrawer')
    this.$elInfoDrawerTrigger = $('.js_infoDrawer_trigger')

    // ページ下部のfixedのメニュー
    this.$elBottomFixedMenu = $('.m_box__spFixed')

    // PC
    // マウスオーバー、マウスアウト
    if (this.$elGrobalNav.length > 0) {
      this.bindGrobalNavHover()
      this.bindWindowEvents()
    }

    // SP
    if (this.$elMenuSp.length > 0) {
      this.bindDrawerTriggerClick()
      this.bindInfoDrawerTriggerClick()
    }

    // ページ下部のfixedメニュー
    if (this.$elBottomFixedMenu.length > 0) {
      this.startBottomMenuTimer()
    }
  }

  /**
   * マウスオーバー、マウスアウトイベント
   */
  GrobalNav.bindGrobalNavHover = function () {
    var self = this

    // a要素の設定
    $(this.grobalNavSubName).find('a').attr('tabindex', -1)

    // リスト
    this.$elGrobalNavList.on('mouseover', function (e) {
      // 位置調整
      var $el = $(e.currentTarget)
      var $elSubNav = $el.find(self.grobalNavSubName)
      // サブナビがなければ処理しない
      if ($elSubNav.length <= 0) {
        return
      }

      var $elSubNavChild = $elSubNav.children()
      var positionTop = $el.position().top
      var grovalNavHeight = Util.getElementInfo(self.$elGrobalNav).h
      var subNavChildHeight = Util.getElementInfo($elSubNavChild).h
      var grobalNavState = self.getGrobalNavState()
      var top

      // 左ナビが表示限界を超えていない時
      if (grobalNavState.isFullView) {
        if (subNavChildHeight + positionTop > grovalNavHeight - 56) {
          top = subNavChildHeight + positionTop - grovalNavHeight + 56
          top = positionTop - top
        } else {
          top = positionTop
        }
      } else {
        // 超えている時
        // サブナビゲーションが下まで表示されるように調整表示
        if (subNavChildHeight + positionTop < grovalNavHeight - 56) {
          top = positionTop - 56
        } else {
          top = grovalNavHeight - subNavChildHeight - 56
        }
      }
      $elSubNavChild.css('top', top + 'px')
      // 展開
      $elSubNav.addClass(self.openState)
      $elSubNav.find('a').attr('tabindex', 0)
    })
    this.$elGrobalNavList.on('mouseout', function (e) {
      var $elSubNav = $(e.currentTarget).find(self.grobalNavSubName)
      $elSubNav.removeClass(self.openState)
      $elSubNav.find('a').attr('tabindex', -1)
    })

    // a要素
    this.$elGrobalNavListLink.on('focus', function (e) {
      // 位置調整
      var $el = $(e.currentTarget).parent()
      var $elSubNav = $el.find(self.grobalNavSubName)

      $el.addClass(self.openState)

      // 他のリストにopenが当たっている場合は外す
      self.$elGrobalNavList.each(function (i, elList) {
        var $elList = $(elList)
        if (elList != $el[0]) {
          $elList.removeClass(self.openState)
          $elList.find(self.grobalNavSubName).removeClass(self.openState)
          $elList.find(self.grobalNavSubName).find('a').attr('tabindex', -1)
        }
      })

      // サブナビがなければ処理しない
      if ($elSubNav.length <= 0) {
        return
      }

      var $elSubNavChild = $elSubNav.children()
      var positionTop = $el.position().top
      var grovalNavHeight = Util.getElementInfo(self.$elGrobalNav).h
      var subNavChildHeight = Util.getElementInfo($elSubNavChild).h
      var grobalNavState = self.getGrobalNavState()
      var top

      // 左ナビが表示限界を超えていない時
      if (grobalNavState.isFullView) {
        if (subNavChildHeight + positionTop > grovalNavHeight - 56) {
          top = subNavChildHeight + positionTop - grovalNavHeight + 56
          top = positionTop - top
        } else {
          top = positionTop
        }
      } else {
        // 超えている時
        // サブナビゲーションが下まで表示されるように調整表示
        if (subNavChildHeight + positionTop < grovalNavHeight - 56) {
          top = positionTop - 56
        } else {
          top = grovalNavHeight - subNavChildHeight - 56
        }
      }
      $elSubNavChild.css('top', top + 'px')
      // 展開
      $elSubNav.addClass(self.openState)
      $elSubNav.find('a').attr('tabindex', 0)
    })
    this.$elGrobalNavListLink.on('blur', function (e) {
      var $el = $(e.currentTarget).parent()
      //
      if ($el.hasClass(self.openState)) {
        return
      }
      var $elSubNav = $el.find(self.grobalNavSubName)
      $elSubNav.removeClass(self.openState)
      $elSubNav.find('a').attr('tabindex', -1)
    })
  }

  /**
   * ウィンドウのスクロール、リサイズイベント
   */
  GrobalNav.bindWindowEvents = function () {
    var self = this
    $(window).on('scroll resize', function () {
      // スクロール位置によって、グローバルナビゲーションの位置を変更する
      var windowWidth = Util.getWindowInfo().w
      var scrollLeft = Util.getWindowInfo().l
      var grobalNavState = self.getGrobalNavState()
      var top
      var left
      // 左ナビが表示限界を超えていない時
      if (grobalNavState.isFullView) {
        top = 0
      } else {
        // 超えている時
        // SP表示の時は0となる
        if (Util.isSpView()) {
          top = 0
        } else {
          top = grobalNavState.offsetTop - grobalNavState.scrollTop + 'px'
        }
      }
      // 横スクロール
      if (windowWidth < 1280) {
        // SP表示の時は0となる
        if (Util.isSpView()) {
          left = 0
        } else {
          left = -1 * scrollLeft + 'px'
        }
      } else {
        left = 'auto'
      }
      self.$elGrobalNav.css({
        top: top,
      })
      self.$elGrobalNavWrap.css({
        left: left,
      })
    })
    // 初期実行
    $(window).trigger('resize')
  }

  /**
   * グローバルナビの状態を返す
   */
  GrobalNav.getGrobalNavState = function () {
    var result = {}
    var offsetTop = this.$elFooter.offset().top - this.$elGrobalNav.height()
    var scrollTop = Util.getWindowInfo().t
    result.offsetTop = offsetTop
    result.scrollTop = scrollTop
    // 左ナビが表示限界を超えていない時
    if (scrollTop < offsetTop) {
      result.isFullView = true
    } else {
      // 超えている時
      result.isFullView = false
    }
    return result
  }

  /**
   * ドロワーのトリガーをクリックした時の挙動
   */
  GrobalNav.bindDrawerTriggerClick = function () {
    var self = this
    $(this.$elDrawerTrigger).on('click', function (e) {
      e.preventDefault()
      // 展開時
      if (self.$elDrawer.hasClass(self.openState)) {
        self.closeDrawer()
      }
      // 非展開時
      else {
        self.openDrawer()
      }
    })
  }

  /**
   * ドロワーメニューを開く
   */
  GrobalNav.openDrawer = function () {
    // ユーザー情報が開いていたら閉じる
    this.closeInfoDrawer()
    this.$elDrawer.addClass(this.openState)
    // 背景生成
    this.createBg()
    //
    this.$elDrawerTrigger.addClass(this.openState)
    this.$elDrawerTrigger.find('span').text('閉じる')
  }

  /**
   * ロワーメニューを閉じる
   */
  GrobalNav.closeDrawer = function () {
    this.$elDrawer.removeClass(this.openState)
    // 背景削除
    this.removeBg()
    this.$elDrawerTrigger.removeClass(this.openState)
    this.$elDrawerTrigger.find('span').text('メニュー')
  }

  /**
   * 背景の生成
   */
  GrobalNav.createBg = function () {
    if (!this.$elMenuBg) {
      this.$elMenuBg = Util.createElement('div', {
        class: this.elDrawerClass,
      })
      this.$elMenuBg = $(this.$elMenuBg)
      this.$elMenuSp.append(this.$elMenuBg)
      this.bindClickBg()
    }
    //
    this.oepnScrollTop = Util.getWindowInfo().t
    this.$elContainer.css({
      top: -1 * this.oepnScrollTop + 'px',
    })
    this.$elContainer.addClass('is_fixed')
    this.$elMenuSpHeader.addClass(this.openState)
  }

  /**
   * 背景の削除
   */
  GrobalNav.removeBg = function () {
    if (!this.$elMenuBg) {
      return
    }
    // 背景削除
    this.$elMenuBg.remove()
    this.$elMenuBg = null
    //
    this.$elMenuSpHeader.removeClass(this.openState)
    this.$elContainer.removeClass('is_fixed')
    window.scrollTo(0, this.oepnScrollTop)
    this.$elContainer.css({
      top: 'auto',
    })
  }

  /**
   * 背景クリック
   */
  GrobalNav.bindClickBg = function () {
    var self = this
    this.$elMenuBg.on('click', function () {
      self.closeDrawer()
      self.closeInfoDrawer()
    })
  }

  /**
   * ユーザー情報（マイページ）のトリガーをクリックした時の挙動
   */
  GrobalNav.bindInfoDrawerTriggerClick = function () {
    var self = this
    $(this.$elInfoDrawerTrigger).on('click', function (e) {
      e.preventDefault()
      // 展開時
      if (self.$elInfoDrawer.hasClass(self.openState)) {
        self.closeInfoDrawer()
      }
      // 非展開時
      else {
        self.openInfoDrawer()
      }
    })
  }

  /**
   * ユーザー情報（マイページ）を開く
   */
  GrobalNav.openInfoDrawer = function () {
    // ドロワーが開いていたら閉じる
    this.closeDrawer()
    this.createBg()
    this.$elInfoDrawer.addClass(this.openState)
    this.$elInfoDrawerTrigger.addClass(this.openState)
  }

  /**
   * ユーザー情報（マイページ）を閉じる
   */
  GrobalNav.closeInfoDrawer = function () {
    this.removeBg()
    this.$elInfoDrawer.removeClass(this.openState)
    this.$elInfoDrawerTrigger.removeClass(this.openState)
  }

  /**
   * ページ下部にfixedメニューが存在する場合の処理
   */
  GrobalNav.startBottomMenuTimer = function () {
    var self = this
    var elBottomFixedMenuInfo
    var $elContainer = $('.l_container')
    var elContainerDefaultPaddingBottom = $elContainer.css('padding-bottom')
    var $elCartBtn = $('.l_cartBtn')
    var elCartBtnDefaultBottom = $('.l_cartBtn').css('bottom')

    elContainerDefaultPaddingBottom = elContainerDefaultPaddingBottom
      ? elContainerDefaultPaddingBottom.replace('px', '') - 0
      : 0

    elCartBtnDefaultBottom = elCartBtnDefaultBottom
      ? elCartBtnDefaultBottom.replace('px', '') - 0
      : 0

    setInterval(function () {
      // SP表示時
      if (_ns.Util.isSpView()) {
        elBottomFixedMenuInfo = _ns.Util.getElementInfo(self.$elBottomFixedMenu)
        // bodyの更新
        $elContainer.css(
          'padding-bottom',
          elBottomFixedMenuInfo.h + elContainerDefaultPaddingBottom + 'px',
        )
        // cartボタンの更新
        if ($elCartBtn.length > 0) {
          $elCartBtn.css(
            'bottom',
            elBottomFixedMenuInfo.h + elContainerDefaultPaddingBottom + 'px',
          )
        }
      }
      // PC表示時
      else {
        // bodyの更新
        $elContainer.css(
          'padding-bottom',
          elContainerDefaultPaddingBottom + 'px',
        )
        // cartボタンの更新
        if ($elCartBtn.length > 0) {
          $elCartBtn.css('bottom', elContainerDefaultPaddingBottom + 'px')
        }
      }
    }, 99)
  }

  /**
   * タブの挙動制御
   * @constructor
   */
  var Tab = (_ns.Tab =
    _ns.Tab ||
    function () {
      this._init.apply(this, arguments)
    })

  /**
   * @param  {HTMLElement}  el  - タブの親となる要素
   */
  Tab.prototype._init = function (el) {
    this._$el = $(el)
    this._attrTabid = 'data-tab-id'
    this._tabId = this._getTabId()
    this._$elTrigger = null
    this._$elTarget = null
    this._currentState = 'is_current'
    this._duration = 300
    this._isChanging = false

    this._setElements()
    this._bindClickTrigger()
  }

  /**
   * data-tab-idの取得
   */
  Tab.prototype._getTabId = function () {
    return this._$el.attr('data-tab-id')
  }

  /**
   * 処理に必要な子孫要素のセット
   */
  Tab.prototype._setElements = function () {
    // 属性セレクター
    var attrSelector = '[' + this._attrTabid + '=' + this._tabId + ']'
    // トリガー
    this._$elTrigger = this._$el
      .find('.js_tab_triggers' + attrSelector)
      .find('a')
    // タブ切り替えコンテンツ
    this._$elTarget = this._$el.find('.js_tab_content' + attrSelector)
  }

  /**
   * トリガーへのクリックイベント付与
   */
  Tab.prototype._bindClickTrigger = function () {
    var self = this
    this._$elTrigger.on('click', function (e) {
      e.preventDefault()
      var $el = $(e.currentTarget)
      var elTargetId = $el.attr('href')
      var $elTarget = $(elTargetId)
      // ターゲットが見つからなかったら処理しない
      if ($elTarget.length === 0) {
        return
      }
      // カレント状態の時は処理しない
      if ($el.hasClass(self._currentState)) {
        return
      }
      // 変更中は処理しない
      if (self._isChanging) {
        return
      }
      self._isChanging = true
      var $elCurrentContent = self._getCurrentTarget()
      $elCurrentContent.fadeOut(self._duration, function () {
        self._$elTrigger.removeClass(self._currentState)
        $elCurrentContent.removeClass(self._currentState)
        // $el.addClass(self._currentState);
        // #hrefがelTargetIdのものはカレントにする（複数対応）
        self._$elTrigger.each(function (i, elTrigger) {
          var $elTrigger = $(elTrigger)
          if ($elTrigger.attr('href') === elTargetId) {
            $elTrigger.addClass(self._currentState)
          }
        })

        $elTarget.fadeIn(self._duration, function () {
          $elTarget.addClass(self._currentState)
          self._isChanging = false
        })
      })
    })
  }
  /**
   * 現在表示状態の要素を取得
   * @return  {object} jquery object
   */

  Tab.prototype._getCurrentTarget = function () {
    var self = this
    var $resultEl = null
    self._$elTarget.each(function (i, el) {
      var $el = $(el)
      if ($el.hasClass(self._currentState)) {
        $resultEl = $el
        return false
      }
    })
    return $resultEl
  }

  /**
   * js_tabというclassが付いている要素へのTab処理
   */
  var bindTab = (_ns.bindTab =
    _ns.bindTab ||
    function () {
      bindTab._init()
    })

  bindTab._init = function () {
    this.instances = []
    this._$el = $('.js_tab')
    this._eachConstructor()
  }

  /**
   * Tabイベントの付与
   */
  bindTab._eachConstructor = function () {
    var self = this
    $(this._$el).each(function (i, el) {
      self.instances.push(new Tab(el))
    })
  }

  /**
   * アコーディオンの挙動制御
   * @constructor
   */
  var Accordion = (_ns.Accordion =
    _ns.Accordion ||
    function () {
      this._init.apply(this, arguments)
    })

  /**
   * @param  {HTMLElement}   el  - アコーディオンの親となる要素
   */
  Accordion.prototype._init = function (el) {
    this.$el = $(el)
    this.$elTrigger = this.$el.find('.js_acc_trigger')
    this.$elTarget = this.$el.find('.js_acc_target')
    this.$elClose = this.$el.find('.js_acc_close')
    this.openState = 'is_open'
    this.duration = 300
    this.defaultTxt = null
    this.toggleTxt = this.$el.attr('data-toggle-text')
    this.isFirst = true

    this._bindClickTrigger()
    this._bindClickCloseAll()
  }

  /**
   * トリガーとなる要素へのクリックイベント付与
   */
  Accordion.prototype._bindClickTrigger = function () {
    var self = this
    $(this.$elTrigger).on('click', function (e) {
      e.preventDefault()
      var $el = $(e.currentTarget)
      var elTargetId = $el.attr('href')
      var $elTarget = $(elTargetId)
      if (self.isFirst) {
        self.isFirst = false
        self.defaultTxt = $el.text()
      }
      // 開いている時
      if ($el.hasClass(self.openState)) {
        self._closeAccordiong($el, $elTarget)
      }
      // 閉じている時
      else {
        self._openAccordiong($el, $elTarget)
      }
    })
  }

  /**
   * 開く
   */
  Accordion.prototype._openAccordiong = function ($el, $elTarget) {
    var self = this
    // アコーディオン更新
    $elTarget.slideDown(this.duration, function () {
      $el.addClass(self.openState)
      $el.parent().addClass(self.openState)
      if (self.toggleTxt) {
        var $elChild = $el.find('*')
        if ($elChild.length > 0) {
          $($elChild[$elChild.length - 1]).text(self.toggleTxt)
        } else {
          $el.text(self.toggleTxt)
        }
      }
    })
  }

  /**
   * 閉じる
   */
  Accordion.prototype._closeAccordiong = function ($el, $elTarget) {
    var self = this
    // アコーディオン更新
    $elTarget.slideUp(this.duration, function () {
      $el.removeClass(self.openState)
      $el.parent().removeClass(self.openState)
      // $elTarget.removeClass(self.openState);
      if (self.toggleTxt) {
        var $elChild = $el.find('*')
        if ($elChild.length > 0) {
          $($elChild[$elChild.length - 1]).text(self.defaultTxt)
        } else {
          $el.text(self.defaultTxt)
        }
      }
    })
  }

  /**
   * トリガー以外でアコーディオンを閉じる
   */
  Accordion.prototype._bindClickCloseAll = function () {
    var self = this
    this.$elClose.on('click', function (e) {
      e.preventDefault()
      self.$elTarget.slideUp(self.duration, function () {
        self.$elTrigger.removeClass(self.openState)
        self.$elTrigger.parent().removeClass(self.openState)
      })
    })
  }

  /**
   * js_accというclassが付いている要素へのAccordion処理
   */
  var bindAccordion = (_ns.bindAccordion =
    _ns.bindAccordion ||
    function () {
      bindAccordion.init()
    })

  bindAccordion.init = function () {
    this.instances = []
    this._$elAccordion = $('.js_acc')
    this._bindAccordionEvent()
  }

  /**
   * アコーディオンイベントの付与
   */
  bindAccordion._bindAccordionEvent = function () {
    var self = this
    $(this._$elAccordion).each(function (i, el) {
      self.instances.push(new _ns.Accordion(el))
    })
  }

  /**
   * bindShareSns
   * TwitterとFacebook
   */
  var bindShareSns = (_ns.bindShareSns =
    _ns.bindShareSns ||
    function () {
      bindShareSns.init()
    })

  bindShareSns.init = function () {
    this.elTwBtnName = '.js_share_twitter'
    this.elFbBtnName = '.js_share_facebook'

    this.bindClickBtns()
  }

  /**
   * Facebook、Twitterのボタンへのクリックイベント付与
   */
  bindShareSns.bindClickBtns = function () {
    var self = this
    // Twitter
    $(document).on('click', this.elTwBtnName, function (e) {
      e.preventDefault()
      var $el = $(e.currentTarget)
      var shareUrl = $el.attr('data-url')
      var shareText = $el.attr('data-text')
      var url = ''
      //
      if (!shareUrl) {
        return
      }
      url = 'https://twitter.com/intent/tweet?url=' + shareUrl
      if (shareText) {
        url = url + '&amp;text=' + shareText
      }
      self.popupWindow(url)
    })

    // Facebook
    $(document).on('click', this.elFbBtnName, function (e) {
      e.preventDefault()
      var $el = $(e.currentTarget)
      var shareUrl = $el.attr('data-url')
      var url = ''
      //
      if (!shareUrl) {
        return
      }
      url = 'https://www.facebook.com/sharer/sharer.php?u=' + shareUrl
      self.popupWindow(url)
    })
  }

  /**
   * Popupウィンドウ
   */
  bindShareSns.popupWindow = function (url) {
    window.open(
      url,
      'tw_window',
      'width=550, height=450,personalbar=0,toolbar=0,scrollbars=1,resizable=1',
    )
  }

  /**
   * bindScrollAnchor
   * ページ内リンク（スムーススクロール）
   */
  var bindScrollAnchor = (_ns.bindScrollAnchor =
    _ns.bindScrollAnchor ||
    function () {
      bindScrollAnchor._init()
    })

  bindScrollAnchor._init = function () {
    this._elScrollTriggerName = '.js_anchorScroll'
    this._duration = 300
    this._bindClickTrigger()
    this._checkURL()
  }

  /**
   * トリガーへのクリックイベント付与
   */
  bindScrollAnchor._bindClickTrigger = function () {
    var self = this
    $(document).on('click', this._elScrollTriggerName, function (e) {
      e.preventDefault()
      var $el = $(e.currentTarget)
      var targetId = $el.attr('href')
      self._ScrollTo(targetId)
    })
  }

  /**
   * ページの読み込み時の処理
   * #付き（ページ内特定箇所へのリンク）だった場合処理する
   */
  bindScrollAnchor._checkURL = function () {
    var self = this
    var hash = location.hash
    if (hash.length === 0) {
      return
    }
    // ページが完全に読み込み終わるまでは処理を止める
    if (document.readyState !== 'complete') {
      var timer = setTimeout(function () {
        clearTimeout(timer)
        self._checkURL()
      }, 132)
      return
    }
    this._ScrollTo(hash, false)
  }

  /**
   * スクロール処理
   * @param  {string} targetId    - スクロール先の要素のid
   * @param  {bool} is_animation  - アニメーションを伴うかどうか
   */
  bindScrollAnchor._ScrollTo = function (targetId, is_animation) {
    var $target = $(targetId)
    var top
    var elHeaderHeight
    var is_animation = _ns.Util.isUndefined(is_animation) ? true : is_animation
    if ($target.length === 0) {
      return
    }
    top = Util.getElementInfo($target).t
    // 調整値
    top = top - 12
    // SPの場合はヘッダーナビゲーションの高さ分をマイナスする
    if (_ns.Util.isSpView()) {
      // APの場合、nav無しなのでゼロ
      elHeaderHeight = _ns.Util.getElementInfo('.l_globalNav')
        ? _ns.Util.getElementInfo('.l_globalNav').h
        : 0
      top = top - elHeaderHeight
    }
    var duration = is_animation === true ? this.duration : 0
    $('body, html').stop(true, true).animate(
      {
        scrollTop: top,
      },
      duration,
    )
  }

  /**
   * Modal
   * モーダルウィンドウの処理
   * @constructor
   */
  var Modal = (_ns.Modal =
    _ns.Modal ||
    function () {
      this._init.apply(this, arguments)
    })

  /**
   * 展開されたモーダルがある場合格納
   */
  Modal.showns = []

  /**
   * モーダルの基準となるz-index
   */
  Modal.zIndex = 10000

  Modal.prototype._init = function (options) {
    options = options || {}
    // モーダルのHTML
    this._$el = options.$el ? options.$el : null
    this._$elBg = null
    this._$elContainer = $('.l_container')
    this._$elHeader = null
    this._$elBody = null
    this._$elFooter = null
    this._$elCloseTrigger = null

    // 背景をクリックしたときに閉じるかどうか。デフォルトはtrue;
    this._isBgClickHide =
      options.isBgClickHide === false ? options.isBgClickHide : true
    // 最低の高さ設定をするか。デフォルトはtrue;
    this._isMinheightBody =
      options.isMinheightBody === false ? options.isMinheightBody : true
    this._maxHeight = options.maxHeight ? options.maxHeight : 560
    this._minHeightBody = null
    this._dutation = 300
    this._isMoveEl = 'isMoveEl' in options ? options.isMoveEl : true
    this._isShow = false

    // 内部管理用：イベントターゲットをキャッシュ
    this.__cacheEventTarget = null

    // モーダルのHTMLを渡されなければ処理終了
    if (!this._$el) {
      return
    }

    this._setMinheightBody()
    this._bindBodyClick()
    this._bindEventModalInput()
  }

  /**
   * モーダル表示
   */
  Modal.prototype.show = function (afterShow) {
    // モーダルが表示状態にある時は動作させない
    if (this._isShow) {
      return
    }
    // 開いた後に実行する関数
    afterShow = typeof afterShow === 'function' ? afterShow : function () {}

    // 表示モーダル用の配列にモーダルを格納
    _ns.Modal.showns.push(this)

    // モーダルをbody直下に移動
    if (this._isMoveEl) {
      $('body').append(this._$el)
    }

    // モーダルのz-indexを調整
    Modal.zIndex = Modal.zIndex + _ns.Modal.showns.length + 2
    this._$el.css('z-index', Modal.zIndex)

    // Androidだけpositionをfixedにする
    // スクロールバが非表示になる端末への対応のため
    if (_ns.Util.ua.isAndroid()) {
      this._$el.css('position', 'fixed')
    }

    // 背景生成
    this._createBgEl(Modal.zIndex - 1)

    // モーダル表示
    this._$el.show()

    // stateの更新
    if (_ns.Util.isSpView()) {
      this._viewState = 'sp'
    } else {
      this._viewState = 'pc'
    }

    // ヘッダー等を格納
    this._$elScrollSelector = '.m_modal_scroll'
    this._$elScroll = this._$el.find(this._$elScrollSelector)
    this._$elHeaderSelector = '.m_modal_header'
    this._$elHeader = this._$el.find(this._$elHeaderSelector)
    this._$elBodySelector = '.m_modal_body'
    this._$elBody = this._$el.find(this._$elBodySelector)
    this._$elFooterSelector = '.m_modal_footer'
    this._$elFooter = this._$el.find(this._$elFooterSelector)

    if (this._$elBody.find('img').length > 0) {
      var self = this
      var cnt = 0
      var srcs = {
        length: 0,
        src: [],
      }
      this._$elBody.find('img').each(function () {
        var modalItemImage = new Image()
        $(modalItemImage).on('load', function () {
          cnt++
          if (srcs.length === cnt) {
            // サイズ・位置調整
            self._adjustSize()
            self._bindWindowResize()
          }
        })

        if (!srcs.src[this.src]) {
          srcs.src = this.src
          srcs.length++
        }
        modalItemImage.src = this.src
      })
    }

    // サイズ・位置調整
    this._adjustSize()
    this._bindWindowResize()

    // スクロール禁止
    this.oepnScrollTop = _ns.Util.getWindowInfo().t
    this._$elContainer.css({
      top: -1 * this.oepnScrollTop + 'px',
    })
    this._$elContainer.addClass('is_bgShow')

    // 引数で渡されてきた展開時のイベント実行
    afterShow()

    //閉じるイベント
    this._$elCloseTrigger = this._$el.find('.js_modal_close')
    this._bindCloseTrigger()

    // フォーカスの移動
    this._$el.attr('tabindex', 0)
    this._$el.css('outline', 0)
    this._$el.trigger('focus')

    // 一度リサイズイベントを呼ぶ
    $(window).trigger('resize')
  }

  /**
   * モーダル閉じる
   */
  Modal.prototype.hide = function (afterHide) {
    var self = this

    $('#__modalBefore').remove()
    $('#__modalAfter').remove()

    // 閉じた後に実行する関数
    afterHide = typeof afterHide === 'function' ? afterHide : function () {}
    this._$el.addClass('is_hide')
    this._$el.attr('tabindex', -1)
    var timer = setTimeout(function () {
      clearTimeout(timer)
      self._$el.removeClass('is_show')
      self._$el.removeClass('is_hide')
      self._$el.hide()
      self._$elBg.remove()
      // モーダル表示フラグの解除
      self._isShow = false
      // イベントの解除
      self._unbindWindowResize()
      self._unbindCloseTrigger()

      // カスタムイベント発行
      self._$el.trigger('hideModal', self.__cacheEventTarget)
      self.__cacheEventTarget = null

      // スクロール禁止無効化
      self._$elContainer.css({
        top: 0,
      })

      if (_ns.Modal.showns.length === 1) {
        self._$elContainer.removeClass('is_bgShow')
      }
      window.scrollTo(0, self.oepnScrollTop)
      // 引数で渡されてきた展開時のイベント実行
      afterHide()

      _ns.Modal.showns.pop()

      if (_ns.Modal.showns.length > 0) {
        var current = _ns.Modal.showns[_ns.Modal.showns.length - 1]
        current._$el.attr('tabindex', 0).focus()
        current._trapTabKey()
      }
    }, this._dutation)
  }

  /**
   * モーダルエレメントを返す
   */
  Modal.prototype.getModalEl = function () {
    return this._$el
  }

  /**
   * 最低幅を設定する
   */
  Modal.prototype._setMinheightBody = function () {
    this._minHeightBody = {
      sp: 140,
      pc: 160,
    }
  }

  /**
   * イベントターゲットをキャッシュ
   * useCapture
   */
  Modal.prototype._bindBodyClick = function () {
    var self = this
    $('body').on('click', function (e) {
      if (!e || !e.target) return
      self.__cacheEventTarget = e.target
    })
  }

  /**
   * モーダル内のinputにフォーカスイベント
   * Androidのキーボドがせり上がってくる問題への対処
   */
  Modal.prototype._bindEventModalInput = function () {
    // Android以外は動作させない
    if (!_ns.Util.ua.isAndroid()) {
      return
    }
    var self = this

    // フォーカスされた時に表示エリアが変わってしまう問題の解消
    this._$el.find('input').on('focus blur', function (e) {
      // 表示されるべき位置用の変数
      var $el = $(e.currentTarget)
      var $elParent = $el.parents(self._$elBodySelector)
      if ($el.parents(self._$elScrollSelector).length > 0) {
        $elParent = $el.parents(self._$elScrollSelector)
      }
      var scrollTop = $elParent.scrollTop()
      scrollTop += $el.position().top
      // キーボード出現時間があるため処理を遅延させる
      setTimeout(function () {
        $elParent.stop().animate(
          {
            scrollTop: scrollTop,
          },
          0,
        )
      }, 330)
    })
  }

  /**
   * サイズ変更用リサイズイベント
   */
  Modal.prototype._bindWindowResize = function () {
    var self = this
    $(window).on('resize.resizeModal', function () {
      self._adjustSize()
    })
  }

  /**
   * リサイズイベントの解除
   */
  Modal.prototype._unbindWindowResize = function () {
    $(window).off('resize.resizeModal')
  }

  /**
   * モーダルを閉じるイベント
   */
  Modal.prototype._bindCloseTrigger = function () {
    var self = this
    $(this._$elCloseTrigger).on('click.closeModal', function (e) {
      e.preventDefault()
      self.hide()
    })
  }

  /**
   * モーダルを閉じるイベントの解除
   */
  Modal.prototype._unbindCloseTrigger = function () {
    $(this._$elCloseTrigger).off('click.closeModal')
  }

  /**
   * モーダルの位置・サイズ調整をする
   */
  Modal.prototype._adjustSize = function () {
    var viewState = _ns.Util.isSpView() ? 'sp' : 'pc'

    // スクロール可能エリアのスクロール値を取得。初期化したあとにその位置に戻すため。
    var modalScrollTop = 0
    if (this._$elScroll.length > 0) {
      modalScrollTop = this._$elScroll.scrollTop()
    } else if (this._$elBody.length > 0) {
      modalScrollTop = this._$elBody.scrollTop()
    }

    // モーダルの更新
    this._$el.css('height', 'auto')
    this._$elScroll.css('height', 'auto')
    this._$elBody.css('height', 'auto')

    // モーダルスクロールエリアの情報取得（ない場合がある）
    var scrollInfo =
      this._$elScroll.length > 0
        ? _ns.Util.getElementInfo(this._$elScroll)
        : null
    // モーダルヘッダーの情報取得
    var headerInfo =
      this._$elHeader.length > 0
        ? _ns.Util.getElementInfo(this._$elHeader)
        : null
    // モーダルボディの情報取得
    var bodyInfo =
      this._$elBody.length > 0 ? _ns.Util.getElementInfo(this._$elBody) : null
    // モーダルフッターの情報取得
    var footerInfo =
      this._$elFooter.length > 0
        ? _ns.Util.getElementInfo(this._$elFooter)
        : null

    // windowの情報を取得
    var windowInfo = _ns.Util.getWindowInfo()
    // モーダルの情報取得
    var modalInfo = _ns.Util.getElementInfo(this._$el)
    // ウィンドウの高さをモーダルの高さが超えた時(SP表示とPC表示で異なる)
    var limit
    if (viewState === 'pc') {
      limit =
        windowInfo.h < this._maxHeight ? windowInfo.h - 24 : this._maxHeight
    } else {
      limit = windowInfo.h - 16
    }
    if (modalInfo.h > limit) {
      modalInfo.h = limit
    }

    this._$el.css('height', modalInfo.h)
    // モーダルの中央よせ
    this._$el.css({
      'margin-top': (-1 * modalInfo.h) / 2 + 'px',
    })

    var reduceHeight = 0
    // スクロールエリアがある場合とない場合で処理を分ける
    if (scrollInfo) {
      if (headerInfo) {
        this._minHeightBody = {
          sp: 140 + headerInfo.h,
          pc: 160 + headerInfo.h,
        }
      }
      // モーダルの調整
      if (this._isMinheightBody) {
        this._$elScroll.css('min-height', this._minHeightBody[viewState] + 'px')
      }

      // フッターが存在する場合のモーダルの調整
      if (footerInfo) {
        this._$el.css('padding-bottom', footerInfo.h + 'px')
      }

      // スクロールエリアの高さ設定
      if (footerInfo) {
        reduceHeight += footerInfo.h
      }
      var scrollHegiht = modalInfo.h - reduceHeight
      this._$elScroll.css('height', scrollHegiht + 'px')

      // min-heightの調整
      if (this._minHeightBody[viewState] >= scrollHegiht) {
        this._$elScroll.css('min-height', scrollHegiht)
      }

      // スクロール位置の調整
      this._$elScroll.scrollTop(modalScrollTop)
    } else {
      // ボディが存在する場合のモーダルの調整
      if (bodyInfo) {
        if (this._isMinheightBody) {
          this._$elBody.css('min-height', this._minHeightBody[viewState] + 'px')
        }
      }
      // フッターが存在する場合のモーダルの調整
      if (footerInfo) {
        this._$el.css('padding-bottom', footerInfo.h + 'px')
      }
      // bodyの高さ設定
      if (headerInfo) {
        reduceHeight += headerInfo.h
      }
      if (footerInfo) {
        reduceHeight += footerInfo.h
      }
      var bodyHegiht = modalInfo.h - reduceHeight /*- 1*/
      this._$elBody.css('height', bodyHegiht + 'px')
      // min-heightの調整
      if (this._minHeightBody[viewState] >= bodyHegiht) {
        this._$elBody.css('min-height', bodyHegiht)
      }

      if (bodyInfo) {
        // スクロール位置の調整
        this._$elBody.scrollTop(modalScrollTop)
      }
    }

    // モーダル表示
    this._$el.addClass('is_show')
    this._isShow = true

    $('#__modalBefore').remove()
    $('#__modalAfter').remove()
    this._trapTabKey()
  }

  /**
   * 背景生成
   * @param   {number}   zIndex
   */
  Modal.prototype._createBgEl = function (zIndex) {
    var el = _ns.Util.createElement('div', {
      class: 'm_modalBg',
    })
    this._$elBg = $(el)
    $('body').append(this._$elBg)

    // z-index調整
    if (typeof zIndex !== 'undefined') {
      this._$elBg.css('z-index', zIndex)
    } else {
      this._$elBg.css('z-index', Modal.zIndex - 1)
    }

    this._bindClickBgEl()
  }

  /**
   * 背景クリック
   */
  Modal.prototype._bindClickBgEl = function () {
    var self = this
    if (!this._isBgClickHide) {
      return
    }
    this._$elBg.on('click', function () {
      self.hide()
    })
  }

  /**
   * モーダルフォーカス対応
   */
  Modal.prototype._trapTabKey = function () {
    var FOCUSABLE_ELEMENTS_STRING =
      "a[href]:visible, area[href]:visible, input:not(:disabled, :hidden), select:not(:disabled, :hidden), textarea:not(:disabled, :hidden), button:not(:disabled, :hidden), iframe:visible, object:visible, embed:visible, [tabindex='0'], [contenteditable]"
    var MODAL_BEFORE_ID = '__modalBefore'
    var MODAL_AFTER_ID = '__modalAfter'
    var _firstTabStop = null
    var _lastTabStop = null
    var self = $(this._$el[0])
    var _this = this

    self.prepend("<div id='" + MODAL_BEFORE_ID + "' tabindex='0'></div>")
    self.append("<div id='" + MODAL_AFTER_ID + "' tabindex='0'></div>")

    var focusableElements = self
      .find(FOCUSABLE_ELEMENTS_STRING)
      .not('#' + MODAL_BEFORE_ID + ', #' + MODAL_AFTER_ID)

    if (focusableElements.length > 0) {
      _firstTabStop = $('#' + MODAL_BEFORE_ID)[0]
      _lastTabStop = $('#' + MODAL_AFTER_ID)[0]
    } else {
      _firstTabStop = null
      _lastTabStop = null
    }

    this._$el.on('keydown.tab', self, function (e) {
      // Check for TAB key press
      if (e.keyCode === 9 && _firstTabStop && _lastTabStop) {
        // なぜかChromeでは疑似クラス$(":focus")で取得できない
        var focused = document.activeElement
        if (e.shiftKey) {
          if (
            _this._equals(focused, _firstTabStop) ||
            _this._equals(focused, self[0])
          ) {
            e.preventDefault()
            focusableElements = self
              .find(FOCUSABLE_ELEMENTS_STRING)
              .not('#' + MODAL_BEFORE_ID + ', #' + MODAL_AFTER_ID)
            focusableElements[focusableElements.length - 1].focus()
          }
        } else {
          if (_this._equals(focused, _lastTabStop)) {
            e.preventDefault()
            focusableElements = self
              .find(FOCUSABLE_ELEMENTS_STRING)
              .not('#' + MODAL_BEFORE_ID + ', #' + MODAL_AFTER_ID)
            focusableElements[0].focus()
          }
        }
      }
    })
  }

  /**
   * モーダルフォーカス 比較処理
   */
  Modal.prototype._equals = function (obj1, obj2) {
    if (obj1 === obj2) {
      return true
    }

    var $obj1 = $(obj1)
    var $obj2 = $(obj2)
    if (
      $obj1.prop('type') === $obj2.prop('type') &&
      $obj1.prop('name') === $obj2.prop('name')
    ) {
      return $obj1.prop('type') === 'radio'
    }

    return false
  }

  /**
   * js_modalというclassがついた要素へのモーダルイベント
   * <a href="#hoge">モーダル立ち上げ</a> となっているものを想定
   */
  var bindModal = (_ns.bindModal =
    _ns.bindModal ||
    function () {
      bindModal._init()
    })

  bindModal._init = function () {
    this._elTrigger = '.js_modal'
    this._bindClickTrigger()
  }

  /**
   * トリガーへのclickイベント付与
   */
  bindModal._bindClickTrigger = function () {
    var self = this
    $(document).on('click', this._elTrigger, function (e) {
      e.preventDefault()
      var $el = $(e.currentTarget)
      // ページ内に配置されたモーダル用のid属性の要素を取得
      var target = $el.attr('href')
      // targetがなければ処理しない
      if (!target) {
        return
      }
      self._modal(target)
    })
  }

  /**
   * モーダル生成
   */
  bindModal._modal = function (target) {
    var modal = new _ns.Modal({
      $el: $(target),
    })
    modal.show()
  }

  /**
   * bindAjaxModal
   * Ajaxで外部HTMLファイルからデータを取得してきて、ページ内モーダルとして表示する
   */
  var bindAjaxModal = (_ns.bindAjaxModal =
    _ns.bindAjaxModal ||
    function () {
      bindAjaxModal._init()
    })

  bindAjaxModal._init = function () {
    // 一度読み込んだモーダルを格納しておく配列
    this._chaceModals = {}
    this._chaceModalsKey = 0
    this._elTrigger = '.js_ajaxModal'
    this._bindClickTrigger()
  }

  /**
   * トリガーへのクリックイベント付与
   */
  bindAjaxModal._bindClickTrigger = function () {
    var self = this
    $(document).on('click', this._elTrigger, function (e) {
      e.preventDefault()
      var $el = $(e.currentTarget)
      // すでにモーダルがある時
      if ($el.attr('data-ajaxModal-index')) {
        self._chaceModals[$el.attr('data-ajaxModal-index')].show()
      } else {
        $el.attr('data-ajaxModal-index', self._chaceModalsKey)
        var url = $el.attr('href')
        self._ajaxModal(url)
      }
    })
  }

  /**
   * ajax処理で外部HTMLからモーダルないに表示するデータを取得してくる
   */
  bindAjaxModal._ajaxModal = function (url) {
    var self = this
    _ns.Ajax({
      method: 'GET',
      url: url,
      done: function (data) {
        var $html = $($.parseHTML(data))
        var modalHtml = $html.find('#modal').html()
        var $modalHtml = $(modalHtml)
        self._chaceModals[self._chaceModalsKey] = new _ns.Modal({
          $el: $modalHtml,
        })
        self._chaceModals[self._chaceModalsKey].show()
        self._chaceModalsKey++
        // タブを実行
        new _ns.Tab($modalHtml.find('.js_modalTab'))
      },
    })
  }

  /**
   * js_movieModalというclassがついた要素への動画用のモーダル処理
   */
  var bindMovieModal = (_ns.bindMovieModal =
    _ns.bindMovieModal ||
    function () {
      bindMovieModal._init()
    })

  /**
   * 生成されたplayerを格納
   */
  bindMovieModal._players = {}

  bindMovieModal._init = function () {
    this._elTrigger = '.js_movieModal'
    this._loader = null
    this._isCreatedYTScript = false
    this._isReadyApi = false
    this._screenTimer = false

    this._createLoader()
    this._bindClickTrigger()
  }

  /**
   * ローディング生成
   */
  bindMovieModal._createLoader = function () {
    var self = this
    this._loader = new _ns.Loader()
  }

  /**
   * トリガーへのクリックイベント付与
   */
  bindMovieModal._bindClickTrigger = function () {
    var self = this
    $(document).on('click', this._elTrigger, function (e) {
      e.preventDefault()
      var $el = $(e.currentTarget)
      var movieId = $el.attr('data-movie-id')

      // loading準備
      self._createYTScript()
      // script生成
      self._createYTScript()
      // player生成
      self._createYTPlayer(movieId)
      // player再生
      self._showModal(movieId)
    })
  }

  /**
   * YoutubeのIFrame Player APIを使用するためのscriptを生成する
   */
  bindMovieModal._createYTScript = function () {
    var self = this
    // すでに生成されていたら処理しない
    if (this._isCreatedYTScript) {
      return
    }
    // playerを使用するためのscriptが呼ばれたら実行される関数の定義
    w.onYouTubePlayerAPIReady = function () {
      // apiが使用可能かどうかのフラグを更新
      self._isReadyApi = true
    }
    // script生成済みかどうかのフラグの更新
    this._isCreatedYTScript = true
    var elScriptFirst = $('script')[0]
    $(elScriptFirst).before(
      '<script src="https://www.youtube.com/iframe_api"></script>',
    )
  }

  /**
   * YoutubeのPlayerを生成
   */
  bindMovieModal._createYTPlayer = function (movieId) {
    var self = this
    // scriptが使用できるようになるまで待機
    if (!this._isReadyApi) {
      var timer = setTimeout(function () {
        clearTimeout(timer)
        timer = null
        self._createYTPlayer(movieId)
      }, 165)
      return
    }
    // すでに生成されていたら処理しない
    if (this._players[movieId]) {
      return
    }
    // ローディング表示
    this._loader.show()
    // モーダル定義
    var modalHtml =
      '<div class="m_modal m_modal__movie">' +
      '<div class="m_modal_close">' +
      '<a href="javascript:;" class="js_modal_close">閉じる</a>' +
      '</div>' +
      '<div class="m_modal_body2">' +
      '<div id="movie_' +
      movieId +
      '"></div>' +
      '</div>' +
      '</div>'
    var $modalHtml = $(modalHtml)
    $('body').append($modalHtml)
    this._players[movieId] = {}
    this._players[movieId].modal = new _ns.Modal({
      $el: $modalHtml,
      isMoveEl: false,
    })
    this._players[movieId].isReady = false
    this._players[movieId].player = new YT.Player('movie_' + movieId, {
      width: '704',
      height: '396',
      videoId: movieId,
      playerVars: {
        // 関連動画を表示しない
        rel: 0,
        // 自動再生しない
        autoplay: 0,
        // z-indexを有効にする
        wmode: 'transparent',
      },
      events: {
        onReady: function (e) {
          self._players[movieId].isReady = true
        },
      },
    })
    // モーダルを閉じたら再生を停止する
    $modalHtml.on('hideModal', function () {
      self._players[movieId].player.pauseVideo()
      clearInterval(self._screenTimer)
    })
  }

  /**
   * モーダルを立ち上げ、YoutubeのPlayerを再生
   */
  bindMovieModal._showModal = function (movieId) {
    var self = this
    // scriptが使用できるようになるまで待機
    if (!this._isReadyApi) {
      var timer = setTimeout(function () {
        clearTimeout(timer)
        timer = null
        self._showModal(movieId)
      }, 165)
      return
    }
    // playerが再生できるようになるまで待機
    if (!this._players[movieId] || !this._players[movieId].isReady) {
      var timer = setTimeout(function () {
        clearTimeout(timer)
        timer = null
        self._showModal(movieId)
      }, 165)
      return
    }

    // ローディング非表示
    this._loader.hide()
    // モーダルを表示して動画を再生
    this._players[movieId].modal.show(function () {
      // 頭出し
      self._players[movieId].player.seekTo(0)
      // PC版は自動再生
      if (!_ns.Util.ua.isSp()) {
        self._players[movieId].player.playVideo()
      }
    })

    // 状態監視タイマー
    this._screenTimer = setInterval(function () {
      // 全画面再生されている時
      // 全画面検知のイベントがないため動画のサイズとウィンドウのサイズを比較する
      if ($('#movie_' + movieId).width() === _ns.Util.getWindowInfo().w) {
        $('body').addClass('is_fullScreen')
      }
      // 全画面再生されていない時
      else {
        $('body').removeClass('is_fullScreen')
      }
      $(window).trigger('resize')
    }, 198)
  }

  /**
   * AlertModal
   * 汎用エラーモーダル処理
   * @constructor
   */
  var AlertModal = (_ns.AlertModal =
    _ns.AlertModal ||
    function () {
      this._init.apply(this, arguments)
    })

  /**
   * @param   {object}   options
   */
  AlertModal.prototype._init = function (options) {
    options = options || {}
    this._alertHtml = options.html ? options.html : ''
    this._afterHide =
      typeof options.afterHide === 'function'
        ? options.afterHide
        : function () {}
    this._modal = null

    this._createModal()
  }

  /**
   * モーダルの生成
   */
  AlertModal.prototype._createModal = function () {
    var self = this
    var html =
      '<div class="m_modal" id="w-1_1">' +
      '<div class="m_modal_body">' +
      '<div class="m_modal_sec u_colorAlert u_bold u_center">' +
      '<div class="m_modal_sec_inner">' +
      this._alertHtml +
      '</div>' +
      '</div>' +
      '</div>' +
      '<div class="m_modal_footer">' +
      '<p class="m_modal_btnWrap">' +
      '<a href="javascript:;" class="m_modal_btn m_btn m_btn__color2 m_btn__block js_modal_close"><span>閉じる</span></a>' +
      '</p>' +
      '</div>' +
      '<!-- /.m_modal --></div>'
    var $html = $(html)
    this._modal = new _ns.Modal({
      $el: $html,
    })
    // 閉じた後の処理を追加
    $html.on('hideModal', function () {
      self._afterHide()
    })
  }

  /**
   * モーダルの表示
   */
  AlertModal.prototype.show = function () {
    this._modal.show()
  }

  /**
   * Loader
   * ローディングの表示
   * @constructor
   */
  var Loader = (_ns.Loader =
    _ns.Loader ||
    function () {
      this._init.apply(this, arguments)
    })

  Loader.prototype._init = function () {
    this._$elLoader = null
    this._$elContainer = $('.l_container')
    this._stateShow = 'is_show'
    this._stateShow = 'is_show'
    this._oepnScrollTop = 0

    this._createLoader()
  }

  /**
   * ローディングのHTMLを生成
   */
  Loader.prototype._createLoader = function () {
    var elLoader = '<div class="m_loader">' + '<div></div>' + '</div>'
    this.$elLoader = $(elLoader)
    $('body').append(this.$elLoader)
  }

  /**
   * ローディング表示
   */
  Loader.prototype.show = function () {
    this.$elLoader.removeClass(this._stateHide).addClass(this._stateShow)
    // スクロール禁止
    this._oepnScrollTop = _ns.Util.getWindowInfo().t
    this._$elContainer.css({
      top: -1 * this._oepnScrollTop + 'px',
    })
    this._$elContainer.addClass('is_bgShow')
  }

  /**
   * ローディング隠す
   */
  Loader.prototype.hide = function () {
    var self = this
    this.$elLoader.addClass(this._stateHide)
    // スクロール禁止無効化
    this._$elContainer.css({
      top: 0,
    })
    this._$elContainer.removeClass('is_bgShow')
    window.scrollTo(0, this._oepnScrollTop)
    var timer = setTimeout(function () {
      clearTimeout(timer)
      timer = null
      self.$elLoader.removeClass(self._stateShow)
    }, 300)
  }

  /**
   * CarouselImg
   * メインビジュアルカルーセル
   */
  var CarouselImg = (_ns.CarouselImg =
    _ns.CarouselImg ||
    function (options) {
      CarouselImg.options = options || {}
      CarouselImg._init()
    })

  CarouselImg._init = function () {
    this.autoplay = this.options.autoplay === false ? false : true
    this.autoplaySpeed = this.options.autoplaySpeed
      ? this.options.autoplaySpeed
      : 5000
    this.$elParent = $('.m_carouselImg')
    this.$el = $('.m_carouselImg_main')
    this.breakpoint = 769

    this.elSubClass = 'm_carouselImg_sub'
    this.$elSub = null
    this.elNavClass = 'm_carouselImg_nav'
    this.$elNav = null
    this.elPagerClass = 'm_carouselImg_pager'
    this.$elPager = null
    this.$elPrev = $(this.elPrev)
    this.$elNext = $(this.elNext)
    this.currentState = 'is_current'
    this.disabledState = 'is_disabled'

    this.maxSlide = this.$el.find('li').length - 1
    this.numPerPage = 4 // 1ページ毎のスライド個数
    this.currentSlide = 0
    this.currentPage = 0
    this.totalPage = Math.floor(this.maxSlide / this.numPerPage)

    this.autoPlayTimer = null

    // スライド画像が2つ以上の時のみ処理する
    if (this.maxSlide > 0) {
      this.createThumbNav()
      this.createPager()
      this.bindSlickTimer()
    }

    this.bindSlick()
  }

  /**
   * PC用のサムネイルナビゲーションを生成する
   */
  CarouselImg.createThumbNav = function () {
    this.$elSub = $('.' + this.elSubClass)
    this.$elNav = $('.' + this.elNavClass)

    $('.' + this.elNavClass + ' ul li').each(function (i) {
      $(this).attr('data-index', i)
    })

    var items = $('.' + this.elNavClass + ' ul li')
    this.$elNav.empty()

    for (var i = 0; i <= this.maxSlide; i++) {
      // this.numPerPageの倍数毎にulを生成
      if (i % this.numPerPage === 0) {
        elNavList = _ns.Util.createElement('ul')
      }
      // 最初の一回だけクラスをつける
      if (i === 0) {
        $(elNavList).addClass(this.currentState)
        $(elNavList).css('display', 'block')
      }
      var elLi = items.eq(i)
      if (i === 0) {
        $(elLi).addClass(this.currentState)
      }
      $(elNavList).append(elLi)
      // this.numPerPageの倍数毎または、ループの最後にulを追加する
      if (i % this.numPerPage === 0 || i === this.maxSlide) {
        this.$elNav.append(elNavList)
      }
    }

    // クリック
    this.bindClickThumb()
    // サムネイルエリアのホバー
    this.bindHoverThumb()
    // メインビジュアルエリアのホバー
    this.bindHoverEl()
  }

  /**
   * PC用のサムネイルナビゲーションクリック動作
   */
  CarouselImg.bindClickThumb = function () {
    var self = this
    var $elNavLi = this.$elNav.find('li')
    $elNavLi.on('click', function (e) {
      e.preventDefault()
      var $el = $(e.currentTarget)
      self.currentSlide = $el.attr('data-index')
      self.gotoSlide()
    })
  }

  /**
   * PC用のサムネイルエリアのホバー動作
   */
  CarouselImg.bindHoverThumb = function () {
    var self = this
    this.$elNav.on('mouseover', function (e) {
      self.stopAutoPlayTimer()
    })
    this.$elNav.on('mouseout', function (e) {
      self.startAutoPlayTimer()
    })
  }

  /**
   * PC用のメインビジュアルエリアのホバー動作
   */
  CarouselImg.bindHoverEl = function () {
    var self = this
    this.$el.on('mouseover', function (e) {
      self.stopAutoPlayTimer()
    })
    this.$el.on('mouseout', function (e) {
      self.startAutoPlayTimer()
    })
  }

  /**
   * PC用のサムネイルのカレントを変更する
   */
  CarouselImg.changeThumbNav = function () {
    var $elNavLi = this.$elNav.find('li')
    $elNavLi.removeClass(this.currentState)
    $($elNavLi[this.currentSlide]).addClass(this.currentState)
    // サムネイル表示個数毎の時だけ実行
    if (this.currentSlide % this.numPerPage === 0) {
      var nextPage = Math.ceil((this.currentSlide + 1) / this.numPerPage) - 1
      // ページャーグループの切り替え
      if (
        nextPage - this.currentPage === 1 ||
        nextPage - this.currentPage === -1
      ) {
        this.currentPage = nextPage
        this.changePager()
      }
    }
  }

  /**
   * PC用のページャーを生成する
   */
  CarouselImg.createPager = function () {
    // スライドの数がthis.numPerPage以下の時はページャーは生成しない。
    if (this.maxSlide + 1 <= this.numPerPage) {
      return
    }
    this.$elPager = $('.' + this.elPagerClass)
    this.$elPrev = $('.m_carouselImg_pager_prev')
    this.$elPrev.addClass(this.disabledState)
    this.$elNext = $('.m_carouselImg_pager_next')
    // ページャークリック
    this.bindClickPager()
    // ページャーの切り替え
    this.changePager()
  }

  /**
   * PC用のページャークリック動作
   */
  CarouselImg.bindClickPager = function () {
    var self = this
    this.$elPrev.on('click', function (e) {
      e.preventDefault()
      if ($(e.currentTarget).hasClass(self.disabledState)) {
        return
      }
      // カレントページ情報を更新
      self.currentPage--
      self.changePager()
    })
    this.$elNext.on('click', function (e) {
      e.preventDefault()
      if ($(e.currentTarget).hasClass(self.disabledState)) {
        return
      }
      // カレントページ情報を更新
      self.currentPage++
      self.changePager()
    })
  }

  /**
   * ページャーの切り替え
   */
  CarouselImg.changePager = function () {
    var self = this

    this.$elPrev.removeClass(this.disabledState)
    this.$elNext.removeClass(this.disabledState)

    if (this.currentPage === 0) {
      this.$elPrev.addClass(this.disabledState)
    }
    if (this.currentPage === this.totalPage) {
      this.$elNext.addClass(this.disabledState)
    }

    var $elNavFadeout = this.$elNav.find('ul.' + this.currentState)
    var $elNavFadeIn = $(this.$elNav.find('ul')[this.currentPage])

    $elNavFadeout.fadeOut(300, function () {
      $elNavFadeout.removeClass(self.currentState)
      $elNavFadeIn.addClass(self.currentState).fadeIn(300)
    })
  }

  /**
   * slickの実行
   */
  CarouselImg.bindSlick = function () {
    this.$el.slick({
      mobileFirst: true,
      arrows: false,
      autoplay: this.autoplay,
      autoplaySpeed: this.autoplaySpeed,
      dots: true,
      pauseOnFocus: false,
      pauseOnHover: false,
      responsive: [
        {
          breakpoint: this.breakpoint,
          settings: {
            fade: true,
            autoplay: false,
            speed: 600,
            swipe: false,
            infinite: false,
            dots: false,
          },
        },
      ],
    })
    this.bindSlickChange()
  }

  /**
   * slickの移動後に実行されるイベント
   */
  CarouselImg.bindSlickChange = function () {
    var self = this
    this.$el.on('beforeChange', function (e, slick, currentSlide, nextSlide) {
      self.currentSlide = nextSlide
      self.changeThumbNav()
      // self.changePager();
    })
  }

  /**
   * レスポンシブによる、タイマーの切り替え
   */
  CarouselImg.bindSlickTimer = function () {
    var self = this
    if (!_ns.Util.isSpView()) {
      self.startAutoPlayTimer()
    }
    this.$el.on('breakpoint', function (e, slick, breakpoint) {
      // PC表示の時のみタイマー実行
      if (breakpoint) {
        self.startAutoPlayTimer()
      } else {
        self.stopAutoPlayTimer()
      }
    })
  }

  /**
   * タイマースタート
   */
  CarouselImg.startAutoPlayTimer = function () {
    var self = this
    this.autoPlayTimer = setInterval(function () {
      if (self.currentSlide < self.maxSlide) {
        self.currentSlide++
      } else {
        self.currentSlide = 0
      }
      self.gotoSlide()
    }, this.autoplaySpeed)
  }

  /**
   * タイマーを止める
   */
  CarouselImg.stopAutoPlayTimer = function () {
    clearInterval(this.autoPlayTimer)
    this.autoPlayTimer = null
  }

  /**
   * 指定のスライドへ飛ぶ
   */
  CarouselImg.gotoSlide = function () {
    this.$el.slick('slickGoTo', this.currentSlide)
  }

  /**
   * CarouselCard
   * カードのカルーセル
   */
  var CarouselCard = (_ns.CarouselCard =
    _ns.CarouselCard ||
    function (options) {
      CarouselCard.options = options || {}
      CarouselCard._init()
    })

  CarouselCard._init = function () {
    this._elFrame = this.options.frame ? this.options.frame : '.js_carouselCard'
    this._$elFrame = $(this._elFrame)
    this._slyInstances = []
    this._responsiveTimer = null

    this._bindSly()
    this._startResponsiveTimer()
  }

  /**
   * slyをbindする
   */
  CarouselCard._bindSly = function () {
    var self = this
    var options = {
      horizontal: 1,
      itemNav: 'basic',
      smart: 1,
      activateOn: 'click',
      mouseDragging: 1,
      touchDragging: 1,
      releaseSwing: 1,
      speed: 300,
      elasticBounds: 1,
    }
    this._$elFrame.css('display', 'block')
    this._$elFrame.each(function (i, el) {
      self._slyInstances.push(new Sly(el, options))
    })
  }

  /**
   * レスポンシブでの状態をみて、slyを実行するかどうか決める
   * SPのみslyを実行する。
   */
  CarouselCard._startResponsiveTimer = function () {
    var self = this
    if (_ns.Util.isSpView()) {
      self._startSly()
    } else {
      self._stopSly()
    }
    this._responsiveTimer = setInterval(function () {
      if (_ns.Util.isSpView()) {
        self._startSly()
      } else {
        self._stopSly()
      }
    }, 330)
  }

  /**
   * slyを実行する
   */
  CarouselCard._startSly = function () {
    $(this._slyInstances).each(function (i, obj) {
      if (obj.initialized === 0) {
        obj.init()
      } else {
        obj.reload()
      }
    })
  }

  /**
   * slyを破棄する
   */
  CarouselCard._stopSly = function () {
    $(this._slyInstances).each(function (i, obj) {
      obj.destroy()
    })
  }

  /**
   * 要素の高さを揃える
   * @constructor
   */
  var Tile = (_ns.Tile =
    _ns.Tile ||
    function () {
      this._init.apply(this, arguments)
    })

  /**
   * @param   {string}   selector  - 処理の対象となるDOMのセレクタ
   * @param   {number}   pcColumns - PC表示における、高さを揃えるカラム数
   * @param   {number}   spColumns - SP表示における、高さを揃えるカラム数。省略可能で、省略した場合は0となる（SPは処理しなくなる）
   */
  Tile.prototype._init = function (selector, pcColumns, spColumns) {
    if (!selector) {
      return
    }
    this._$el = $(selector)
    this._pcColumns = pcColumns
    this._spColumns = spColumns || 0
    this._bindTile()
    this._bindResize()
  }

  /**
   * tile.jsの処理
   */
  Tile.prototype._bindTile = function () {
    // spへのカラム数指定がある場合
    if (this._spColumns) {
      var columns = _ns.Util.isSpView() ? this._spColumns : this._pcColumns
      if (columns === 'all') {
        columns = ''
      }
      this._$el.tile(columns)
    }
    // ない場合はSPには適用しない
    else {
      if (_ns.Util.isSpView()) {
        this._$el.removeAttr('style')
      } else {
        if (this._pcColumns === 'all') {
          this._pcColumns = ''
        }
        this._$el.tile(this._pcColumns)
      }
    }
  }

  /**
   * ウィンドウリサイズイベント
   */
  Tile.prototype._bindResize = function () {
    var self = this
    $(window).on('resize', function () {
      self._bindTile()
    })
  }

  /**
   * ロールオーバー
   * @constructor
   */
  var Rollover = (_ns.Rollover =
    _ns.Rollover ||
    function () {
      this._init.apply(this, arguments)
    })

  /**
   * @param   {HTMLElement}   el - 処理の起点となる要素
   */
  Rollover.prototype._init = function (el) {
    this._$el = $(el)
    this._suffix = 'hover'
    this._bindMouseEventEl()
  }

  /**
   * マウスオーバー、マウスアウトのイベント付与
   */
  Rollover.prototype._bindMouseEventEl = function () {
    var self = this
    var src = this._$el.attr('src')
    var ext = src.substring(src.lastIndexOf('.'), src.length)
    var srcSuffix = src.replace(ext, '-' + self._suffix + ext)
    // オン画像のプリロード
    var elImgPreload = new Image()
    elImgPreload.src = srcSuffix

    // 連動して動かしたいホバー
    var relativeHovers = []
    var targets = this._$el.attr('data-rollover-targets')
    if (targets) {
      targets = targets.split(',')
    }
    $(targets).each(function (i, id) {
      var $elTarget = $('[data-rollover-id=' + id + ']')
      var targetSrc = $elTarget.attr('src')
      var targetExt = targetSrc.substring(
        targetSrc.lastIndexOf('.'),
        targetSrc.length,
      )
      var targetSrcSuffix = targetSrc.replace(
        targetExt,
        '-' + self._suffix + targetExt,
      )
      var elTargetPreload = new Image()
      elTargetPreload.src = targetSrcSuffix
      relativeHovers.push({
        $el: $elTarget,
        base: targetSrc,
        rollover: targetSrcSuffix,
      })
    })

    this._$el.on('mouseover', function () {
      self._$el.attr('src', srcSuffix)
      // 連動して変更する処理
      $(relativeHovers).each(function (i, obj) {
        obj.$el.attr('src', obj.rollover)
      })
    })

    this._$el.on('mouseout', function () {
      self._$el.attr('src', src)
      // 連動して変更する処理
      $(relativeHovers).each(function (i, obj) {
        obj.$el.attr('src', obj.base)
      })
    })
  }

  /**
   * js_rolloverというclassが付いている要素へのRollover処理
   */
  var bindRollover = (_ns.bindRollover =
    _ns.bindRollover ||
    function () {
      bindRollover._init()
    })

  bindRollover._init = function () {
    this._$el = $('.js_rollover')
    this._bindRolloverEl()
  }

  bindRollover._bindRolloverEl = function () {
    this._$el.each(function (i, el) {
      new _ns.Rollover(el)
    })
  }

  /**
   * ユーザーサムネイル位置調整
   * @constructor
   */
  var UserThumb = (_ns.UserThumb =
    _ns.UserThumb ||
    function () {
      this._init.apply(this, arguments)
    })

  /**
   * @param   {HTMLElement}   el - 処理の起点となる要素
   */
  UserThumb.prototype._init = function (el) {
    this._$el = $(el)
    this._$elImg = this._$el.find('img')

    this._adjustThumb()
    this._bindResizeWindow()
  }

  /**
   * サムネイルの位置を調整する
   */
  UserThumb.prototype._adjustThumb = function () {
    var self = this
    this._$el.css('opacity', 0)
    // ドキュメントの読み込みが完了するまでは処理しない
    if (document.readyState !== 'complete') {
      var timer = setTimeout(function () {
        clearTimeout(timer)
        self._adjustThumb()
      }, 165)
      return
    }
    this._$el.css('opacity', 1)
    // 画像がなければ処理しない
    if (this._$elImg.length === 0) {
      return
    }
    // 画像に設定されているwidthとheightを削除
    this._$elImg.removeAttr('width').removeAttr('height')
    var elImg = this._$elImg[0]
    var imgWidth = elImg.width
    var imgHeight = elImg.height
    // 幅と高さを比較
    if (this._$el.css('position') === 'static') {
      this._$el.css('position', 'relative')
    }
    if (imgWidth >= imgHeight) {
      this._$elImg.css({
        position: 'absolute',
        width: 'auto',
        height: '100%',
        left: '50%',
      })
    } else {
      this._$elImg.css({
        position: 'absolute',
        width: '100%',
        height: 'auto',
        top: '50%',
      })
    }
    // 画像の位置調整。表示しないと幅と高さが取得できないためここで処理
    if (imgWidth >= imgHeight) {
      this._$elImg.css({
        'margin-left': (-1 * this._$elImg.width()) / 2 + 'px',
      })
    } else {
      this._$elImg.css({
        'margin-top': (-1 * this._$elImg.height()) / 2 + 'px',
      })
    }
  }

  /**
   * レスポンシブでの切り替え対応のためのリサイズ時の位置決め処理
   */
  UserThumb.prototype._bindResizeWindow = function () {
    var self = this
    $(w).on('resize', function () {
      self._adjustThumb()
    })
  }

  /**
   * js_userThumbというclassが付いている要素へのUserThumb処理
   */
  var bindUserThumb = (_ns.bindUserThumb =
    _ns.bindUserThumb ||
    function () {
      bindUserThumb._init()
    })

  bindUserThumb._init = function () {
    this._$el = $('.js_userThumb')
    this._bindUserThumbEl()
  }

  bindUserThumb._bindUserThumbEl = function () {
    this._$el.each(function (i, el) {
      new _ns.UserThumb(el)
    })
  }

  /**
   * Formで使用する関数群
   */
  var Form = (_ns.Form = _ns.Form || {})

  /**
   * 指定フォーム内の残りの文字数数える
   * @constructor
   */
  Form.CountRestTxt = function () {
    this._init.apply(this, arguments)
  }

  /**
   * @param   {HTMLElement}   el - 処理の起点となる要素
   */
  Form.CountRestTxt.prototype._init = function (el) {
    this._$el = $(el)
    this._$elCount = this._$el.find('.js_countRestTxt_count')
    this._$elTxt = this._$el.find('.js_countRestTxt_txt')
    this._$elFrom = this._$el.find('.js_countRestTxt_form')
    this._maxLength

    this._setMaxLength()
    this._watchTxt()
  }

  /**
   * data属性から、入力のmax値を設定する
   */
  Form.CountRestTxt.prototype._setMaxLength = function () {
    var maxLength = this._$el.attr('data-max-length')
    this._maxLength = maxLength
    this._$elCount.text(maxLength)
  }

  /**
   * 入力エリアを監視し、文字数表示の増減の処理をする
   */
  Form.CountRestTxt.prototype._watchTxt = function () {
    // maxlengthがない場合は処理しない
    if (_ns.Util.isUndefined(this._maxLength)) {
      return
    }
    var self = this

    setInterval(function () {
      var val = self._$elFrom.val()
      var valLength = val.length
      // 文字のカウントを減らす
      self._$elCount.text(self._maxLength - valLength)
      // 指定された文字数を超える場合
      if (valLength > self._maxLength) {
        self._$elCount.parent().addClass('is_error')
      } else {
        self._$elCount.parent().removeClass('is_error')
      }
    }, 33)
  }

  /**
   * js_countRestTxtというclassが付いている要素へのForm.CountRestTxt処理
   */
  Form.bindCountRestTxt = function () {
    Form.bindCountRestTxt._init()
  }

  Form.bindCountRestTxt._init = function () {
    this.instances = []
    this._$el = $('.js_countRestTxt')
    this._eachConstructor()
  }

  Form.bindCountRestTxt._eachConstructor = function () {
    var self = this
    $(this._$el).each(function (i, el) {
      self.instances.push(new Form.CountRestTxt(el))
    })
  }

  /**
   * 画像のアップロード及び、アップロードした画像の表示
   * @constructor
   */
  Form.ImgUploader = function () {
    this._init.apply(this, arguments)
  }

  /**
   * @param   {HTMLElement}   el - 処理の起点となる要素
   */
  Form.ImgUploader.prototype._init = function (el) {
    this._$el = $(el)
    this._$elTrigger = this._$el.find('.js_uploader_trigger')
    this._$elToggle = this._$el.find('.js_uploader_toggle')
    this._$elInput = this._$el.find('.js_uploader_input')
    this._$elImg = this._$el.find('.js_uploader_img')
    this._$elForm = this._$el.find('.js_uploader_form')
    this._limitSize = 5000000 // 5MB;

    this._bindChangeTrigger()
  }

  /**
   * input[type=file]のチェンジイベントの付与
   */
  Form.ImgUploader.prototype._bindChangeTrigger = function () {
    var self = this
    // inputのchageイベント
    this._$elInput.on('change', function (e) {
      var file = e.target.files[0]
      // キャンセルされた時
      if (!file) {
        // 初期化する
        self._reset()
        return
      }
      var type = file.type
      var size = file.size
      // 形式がpngかjpg画像ではない
      if (type !== 'image/png' && type !== 'image/jpeg') {
        var imgAlertModal = new _ns.AlertModal({
          html: 'PNG、JPGのいずれかの形式のファイルを選択してください',
          // モーダルが閉じたら
          afterHide: function () {
            // 初期化する
            self._reset()
            // 再度選択用画面を立ち上げる
            self._$elInput.trigger('click')
          },
        })
        imgAlertModal.show()
        // self._$elInput.focus();
        return
      }
      // ファイルサイズが限界を超えている
      if (size > self._limitSize) {
        var sizeAlertModal = new _ns.AlertModal({
          html: '1MB超えています',
          // モーダルが閉じたら
          afterHide: function () {
            // 初期化する
            self._reset()
            // 再度選択用画面を立ち上げる
            self._$elInput.trigger('click')
          },
        })
        sizeAlertModal.show()
        return
      }
      // 変数に値を格納
      self._elInputVal = self._$elInput.val()
      // 画像読み込み
      var fileReader = new FileReader()
      fileReader.onload = function (e) {
        var elImg = new Image()
        var $elImg = $(elImg)
        elImg.onload = function () {
          // iOSのバグ対策、一度ダミーの画像を配置して幅と高さを取得する。
          var $elImgCopy = $elImg.clone()
          $elImgCopy.css({
            position: 'absolute',
            top: '-999999px',
            left: '-999999px',
          })
          $('body').append($elImgCopy)
          var imgWidth = $elImgCopy.width()
          var imgHeight = $elImgCopy.height()
          // 幅と高さを比較
          if (imgWidth >= imgHeight) {
            $elImg.css({
              width: 'auto',
              height: '100%',
              left: '50%',
            })
          } else {
            $elImg.css({
              width: '100%',
              height: 'auto',
              top: '50%',
            })
          }
          $elImgCopy.remove()
          self._$elImg.html(elImg)
          self._$elToggle.removeClass('is_hide')
          // 画像の位置調整。表示しないと幅と高さが取得できないためここで処理
          if (imgWidth >= imgHeight) {
            $elImg.css({
              'margin-left': (-1 * $elImg.width()) / 2 + 'px',
            })
          } else {
            $elImg.css({
              'margin-top': (-1 * $elImg.height()) / 2 + 'px',
            })
          }
          self._$elForm.prop('checked', true).trigger('change')
          // ボタンの文言変更
          self._$elTrigger.html('<span><span>写真を変更する</span></span>')
        }
        elImg.src = fileReader.result
      }
      fileReader.readAsDataURL(file)
    })

    // ボタンのクリックでinputを押したことにする
    this._$elTrigger.on('click', function (e) {
      e.preventDefault()
      self._$elInput.trigger('click')
    })
  }

  /**
   * UIの初期化をする
   */
  Form.ImgUploader.prototype._reset = function () {
    // valueを初期化する
    this._$elInput.prop('value', '')
    //
    $(this._$el.find('input[type=radio]')[0]).prop('checked', true)
    // 画像を削除
    this._$elImg.html('')
    // エリアを非表示に
    this._$elToggle.addClass('is_hide')
  }

  /**
   * js_uploaderというclassが付いている要素へのForm.ImgUploader処理
   */
  Form.bindImgUploader = function () {
    Form.bindImgUploader._init()
  }

  Form.bindImgUploader._init = function () {
    this.instances = []
    this._$el = $('.js_uploader')
    this._eachConstructor()
  }

  Form.bindImgUploader._eachConstructor = function () {
    var self = this
    $(this._$el).each(function (i, el) {
      self.instances.push(new Form.ImgUploader(el))
    })
  }

  /**
   * チェックをしたら背景色が変わり非表示エリアが表示される。
   * またエリア全体をおしたら、フォームがチェックされる
   * @constructor
   */
  Form.CheckItem = function () {
    this._init.apply(this, arguments)
  }

  /**
   * @param   {HTMLElement}   el - 処理の起点となる要素
   */
  Form.CheckItem.prototype._init = function (el) {
    this._$el = $(el)
    this._elTriggerClass = '.js_checkItem_trigger'
    this._$elTrigger = this._$el.find(this._elTriggerClass)
    this._elTargetClass = '.js_checkItem_item'
    this._$elTarget = this._$el.find(this._elTargetClass)
    this._elToggleClass = '.js_checkItem_toggle'
    this._elInnerClass = '.js_checkItem_inner'
    this._duration = 300
    this._checkedState = 'is_checked'

    this._bindChangeTrigger()
    this._bindClickTarget()
  }

  /**
   * ターゲットとなるエリアへのクリックイベント付与
   */
  Form.CheckItem.prototype._bindClickTarget = function () {
    this._$elTarget.on('click', function (e) {
      var target = e.target
      var $el = $(e.currentTarget)
      var firstInput = $el.find('input')[0]
      var $firstInput = $(firstInput)
      var type = $firstInput.prop('type')
      var disabled = $firstInput.prop('disabled')

      // a,特定のtypeの要素は以降の処理はしない
      if (
        target.tagName === 'A' ||
        target.type === 'radio' ||
        target.type === 'checkbox'
      ) {
        return
      }

      // preventDefaultしないと子要素にイベントが伝播してしまう
      e.preventDefault()

      // クリックした要素が特定のものであれば処理しない
      if (target !== e.currentTarget && e.currentTarget === firstInput) {
        return
      }
      // disabledだったら処理中止
      if (disabled) {
        return
      }

      // チェックが入っていない時
      if (!$firstInput.prop('checked')) {
        // ラジオボタンかチェックボックスの時はチェックを入れる
        if (type === 'radio' || type === 'checkbox') {
          $firstInput.prop('checked', true)
          $firstInput.trigger('change')
        }
      }
      // チェックが入っている時
      else {
        // チェックボックスの場合チェックを外す
        if (type === 'checkbox') {
          $firstInput.prop('checked', false)
          $firstInput.trigger('change')
        }
      }
    })
  }

  /**
   * トリガーとなるフォームアイテムへのチェンジイベント付与
   */
  Form.CheckItem.prototype._bindChangeTrigger = function () {
    var self = this
    // 初期表示状態を作るための処理
    self._$elTarget.each(function (i, el) {
      var $el = $(el)
      var $elToggles = $el
        .parents(self._elTargetClass)
        .find(self._elToggleClass)
      var $elInners = $el.find(self._elInnerClass)
      if ($el.find(self._elTriggerClass).prop('checked')) {
        $el.addClass(self._checkedState)
        $elToggles.show()
        self._changeDisabled($elToggles, false)
        self._changeDisabled($elInners, false)
      } else {
        $el.removeClass(self._checkedState)
        self._changeDisabled($elToggles, true)
        self._changeDisabled($elInners, true)
      }
    })
    this._$elTrigger.on('change', function (e) {
      // 親にイベントを伝播させない
      e.stopPropagation()
      var $el = $(e.currentTarget)
      var $elParent = $el.parents(self._elTargetClass)
      var $elToggles = self._$elTarget.find(self._elToggleClass)
      var $elToggle = $elParent.find(self._elToggleClass)
      var $elInners = self._$elTarget.find(self._elInnerClass)
      var $elInner = $elParent.find(self._elInnerClass)

      // 背景色変更
      self._$elTarget.each(function (i, el) {
        var $el = $(el)
        if ($el.find(self._elTriggerClass).prop('checked')) {
          $el.addClass(self._checkedState)
        } else {
          $el.removeClass(self._checkedState)
        }
      })

      // 中身に表示するものがあれば、表示の切り替えを行う。
      $elToggles.stop(true, true).slideUp(self._duration)
      self._changeDisabled($elToggles, true)
      self._changeDisabled($elInners, true)
      //
      $elToggle.stop(true, true).slideDown(self._duration)
      self._changeDisabled($elToggle, false)
      self._changeDisabled($elInner, false)
    })
  }

  /**
   * jquery objectとして渡されてきた要素へのdisabled設定
   * @param   {JQuery}   $el - disabledを切り替える要素
   * @param   {bool}     isDisabled - disabledにするかどうか
   */
  Form.CheckItem.prototype._changeDisabled = function ($el, isDisabled) {
    $el.find('input,textarea,select').each(function (i, el) {
      var $el = $(el)
      $el.prop('disabled', isDisabled)
    })
  }

  /**
   * js_checkItemというclassが付いている要素へのForm.CheckItem処理
   */
  Form.bindCheckItem = function () {
    Form.bindCheckItem.init()
  }

  Form.bindCheckItem.init = function () {
    this.instances = []
    this._$elCheckItem = $('.js_checkItem')
    this._bindCheckItemEvent()
  }

  Form.bindCheckItem._bindCheckItemEvent = function () {
    var self = this
    $(this._$elCheckItem).each(function (i, el) {
      self.instances.push(new Form.CheckItem(el))
    })
  }

  /**
   * プルダウンのplaceholder処理
   * @constructor
   */
  Form.SelectPlaceholder = function () {
    this._init.apply(this, arguments)
  }

  /**
   * @param   {HTMLElement}   el - 処理の起点となる要素
   */
  Form.SelectPlaceholder.prototype._init = function (el) {
    this._$el = $(el)
    this._$elTrigger = this._$el.find('select')
    this._stateNoselected = 'is_noSelected'
    this._bindEventsTrigger()
  }

  /**
   * トリガーへのイベント付与
   */
  Form.SelectPlaceholder.prototype._bindEventsTrigger = function () {
    var self = this
    // フォーカスした時に一時的にplaceholder実現用classを外す
    this._$elTrigger.on('mousedown focus', function (e) {
      var $el = $(e.currentTarget)
      self._$el.removeClass(self._stateNoselected)
    })
    // change、blurでのplaceholder化
    this._$elTrigger.on('change blur', function (e) {
      var $el = $(e.currentTarget)
      var val = $el.prop('value')

      // valueがない場合または空の場合、未選択のclassを付与する。
      if (val === '' || _ns.Util.isUndefined(val)) {
        self._$el.addClass(self._stateNoselected)
      } else {
        self._$el.removeClass(self._stateNoselected)
      }
    })
    // 初期表示用
    this._$elTrigger.trigger('change')
  }

  /**
   * m_selectというclassが付いている要素へのForm.SelectPlaceholder処理
   */
  Form.bindSelectPlaceholder = function () {
    Form.bindSelectPlaceholder.init()
  }

  Form.bindSelectPlaceholder.init = function () {
    this.instances = []
    this._$elSelect = $('.m_select')
    this._bindSelectPlaceholderFunction()
  }

  Form.bindSelectPlaceholder._bindSelectPlaceholderFunction = function () {
    var self = this
    $(this._$elSelect).each(function (i, el) {
      self.instances.push(new Form.SelectPlaceholder(el))
    })
  }

  /**
   * 郵便番号からの住所検索
   * @constructor
   */
  Form.SearchAddress = function () {
    this._init.apply(this, arguments)
  }

  /**
   * @param   {HTMLElement}   el - 処理の起点となる要素
   */
  Form.SearchAddress.prototype._init = function (el) {
    this._$el = $(el)
    this._$elTrigger = this._$el.find('.js_searchAddress_btn')
    this._$elZip1 = this._$el.find('.js_searchAddress_zip1')
    this._$elZip2 = this._$el.find('.js_searchAddress_zip2')
    this._$inputPref = this._$el.find('.js_searchAddress_prefecture')
    this._$inputCity = this._$el.find('.js_searchAddress_city')
    this._$releaseArea = this._$el.find('.js_searchAddress_release')
    this._$releaseItem = this._$el.find('.js_searchAddress_releaseItem')
    this._disabledState = 'is_disabled'
    this._errorState = 'is_error'
    this._apiPostData = {}
    this._apiResponseData = {}
    this._modal = null

    // 状態に寄って初期表示の切り替え
    this._bindClickTrigger()
  }

  /**
   * トリガーへのクリックイベント付与
   */
  Form.SearchAddress.prototype._bindClickTrigger = function () {
    var self = this
    this._$elTrigger.on('click', function (e) {
      e.preventDefault()
      var $el = $(e.currentTarget)

      var valZip1 = self._$elZip1.val()
      var valZip2 = self._$elZip2.val()

      // jquery.validateを動かすための措置
      if (!valZip1) {
        self._$elZip1.prop('value', 'X')
        self._$elZip1.trigger('focusout')
        self._$elZip1.prop('value', '')
        self._$elZip1.trigger('focusout')
      }
      if (!valZip2) {
        self._$elZip2.prop('value', 'X')
        self._$elZip2.trigger('focusout')
        self._$elZip2.prop('value', '')
        self._$elZip2.trigger('focusout')
      }
      if (!valZip1) {
        self._$elZip1.trigger('focus')
      } else if (!valZip2) {
        self._$elZip2.trigger('focus')
      }

      // 値がからの場合とエラー表示中の場合は処理しない
      if (
        !valZip1 ||
        !valZip2 ||
        self._$elZip1.hasClass(self._errorState) ||
        self._$elZip2.hasClass(self._errorState)
      ) {
        return
      }

      // Ajax: apiに送信するデータを整えて格納
      self._apiPostData['zipcode'] = valZip1 + valZip2
      self._apiPostData['postalCode3'] = valZip1 //@[SONE キーが異なるので追加
      self._apiPostData['postalCode4'] = valZip2 //@[SONE キーが異なるので追加
      self._ajaxApi()
    })
  }

  /**
   * API通信をして住所のデータを取得し処理をする
   */
  Form.SearchAddress.prototype._ajaxApi = function () {
    var self = this
    $('#selectAddress').remove()
    $('#searchAddress-error').remove()
    lottery.ajax.ajaxCommunication({
      url: lottery.value.contextPath + '/search-address-front/',
      data: this._apiPostData,
      callbackSuccess: function (data) {
        // データ取得
        self._apiResponseData = data

        if (self._apiResponseData.length == 0) {
          // 0件の場合はエラーメッセージ表示
          $('.m_formAddress').before(
            '<label id="searchAddress-error" class="is_error m_formError" for="searchAddress">都道府県情報が誤っています。再度、郵便番号から住所を検索しなおしてください。</label>',
          )
        } else if (self._apiResponseData.length > 1) {
          var modalHtml = self._getModalHTML(self._apiResponseData)
          self._modal = new _ns.Modal({
            $el: $(modalHtml),
          })
          // モーダル展開と展開時のイベント
          self._modal.show(function () {
            // チェックボックス
            var checkItem = '#modal_checkItem'
            new Form.CheckItem(checkItem)
            // チェックしたものを「決定」押下のタイミングで反映する
            $('#entry_address').on('click', function (e) {
              e.preventDefault()
              var $elCheckItem = $(checkItem)
              var data = null
              $elCheckItem.find('input').each(function (i, el) {
                var $el = $(el)
                // ラジオボタンにチェックが入っているものをもとにデータを作成
                if ($el.prop('checked')) {
                  data = {
                    prefectures: $el.attr('data-prefectures'),
                    city: $el.attr('data-address1') + $el.attr('data-address2'),
                  }
                }
              })
              self._inputAddress(data)
              // 住所入力エリアのdisabled状態を解除
              self._releaseDisabled()
              // モーダル閉じる
              self._modal.hide()
            })
          })
        }
        // Ajax: 複数ないときは直接フォームに値を入れる
        else {
          var data = self._getAddressData(self._apiResponseData[0])
          self._inputAddress(data)
          // 住所入力エリアのdisabled状態を解除
          self._releaseDisabled()
        }
      },
      fail: function () {
        alert('検索に失敗しました')
      },
      ope: '住所検索',
      timeout: true,
    })
  }

  /**
   * Ajax: api通信のレスポンスデータを元にモーダルのHTMLを生成
   * @param   {object}   data
   */
  Form.SearchAddress.prototype._getModalHTML = function (data) {
    // モーダルのHTML生成
    var listHtml = ''
    // 配列からラジオボタンのHTMLを生成
    $(data).each(function (i, obj) {
      // Ajax: レスポンスデータを元に各値を変数に格納
      var prefectures = obj.prfctName
      var address1 = obj.cityName
      var address2 = obj.cityareaName
      var checked = ''
      var index = i + 1
      // 一番最初のラジオボタンをチェック済みにする
      if (i === 0) {
        checked = 'checked'
      }
      listHtml +=
        '<li class="js_checkItem_item">' +
        '<div class="m_formCheckList3_inner">' +
        '<div class="m_radio">' +
        '<input type="radio" name="result" id="result' +
        index +
        '" value="" class="js_checkItem_trigger"' +
        'data-prefectures="' +
        prefectures +
        '" ' +
        'data-address1="' +
        address1 +
        '" ' +
        'data-address2="' +
        address2 +
        '" ' +
        checked +
        '>' +
        '<label for="result' +
        index +
        '"><span class="m_radio_txt">' +
        prefectures +
        address1 +
        address2 +
        '</span></label>' +
        '<!-- /.m_radio --></div>' +
        '</div>' +
        '</li>'
    })
    // モーダルのHTMLを生成
    var modalHtml =
      '<div class="m_modal" id="selectAddress">' +
      '<div class="m_modal_header">' +
      '<div class="m_modal_header_inner">' +
      '<p class="m_modal_header_ttl">住所を選んで［決定］を押してください。</p>' +
      '</div>' +
      '<!-- /.m_modal_header --></div>' +
      '<div class="m_modal_body m_modal_body__type2">' +
      '<ul class="m_formCheckList3" id="modal_checkItem">' +
      listHtml +
      '</ul>' +
      '<!-- /.m_modal_body --></div>' +
      '<div class="m_modal_footer">' +
      '<ul class="m_modal_btnWrap2">' +
      '<li>' +
      '<a href="javascript:;" class="m_modal_btn m_btn m_btn__color2 m_btn__block js_modal_close"><span>キャンセル</span></a>' +
      '</li>' +
      '<li>' +
      '<a href="javascript:;" class="m_modal_btn m_btn m_btn__block" id="entry_address"><span>決定</span></a>' +
      '</li>' +
      '</ul>' +
      '<!-- /.m_modal_footer --></div>' +
      '<!-- /.m_modal --></div>'
    return modalHtml
  }

  /**
   * 渡されたオブジェクトを元に住所のデータを生成して返す
   * @param   {object}   data
   * @return   {object}  -  {prefectures:都道府県, city:市区町村}
   */
  Form.SearchAddress.prototype._getAddressData = function (data) {
    var result = {}
    result.prefectures = data.prfctName
    result.city = data.cityName + data.cityareaName
    return result
  }

  /**
   * 住所のエリアに渡されたオブジェクトを元に値を入れる
   * @param   {object}   data - {prefectures:都道府県, city:市区町村}
   */
  Form.SearchAddress.prototype._inputAddress = function (data) {
    this._$inputPref.val(data.prefectures)
    this._$inputCity.val(data.city)
    // jqueryvalidatieとの連携
    this._$inputPref.trigger('focusout')
    this._$inputCity.trigger('focusout')
  }

  /**
   * 対象要素のdisabledを解除する
   */
  Form.SearchAddress.prototype._releaseDisabled = function () {
    this._$releaseArea.removeClass(this._disabledState)
    // this._$releaseItem.prop('value', '');
    this._$releaseItem.prop('readonly', false)
    this._$releaseItem[0].focus()
  }

  /**
   * js_searchAddressというclassの付いた要素へForm.SearchAddress処理
   */
  Form.bindSearchAddress = function () {
    Form.bindSearchAddress._init()
  }

  Form.bindSearchAddress._init = function () {
    this.instances = []
    this._$el = $('.js_searchAddress')
    this._eachConstructor()
  }

  Form.bindSearchAddress._eachConstructor = function () {
    var self = this
    $(this._$el).each(function (i, el) {
      self.instances.push(new Form.SearchAddress(el))
    })
  }

  /**
   * チェックマーク付きフォーム
   * @constructor
   */
  Form.CheckMark = function () {
    this._init.apply(this, arguments)
  }

  /**
   * @param   {HTMLElement}   el - 処理の起点となる要素
   */
  Form.CheckMark.prototype._init = function (el) {
    this._$el = $(el)
    this._$elForm = this._$el.find('.js_formCheckmark_item')
    this._ngState = 'is_error'
    this._okState = 'is_ok'

    this._bindFocusForm()
    this._bindHilightEl()
  }

  /**
   * 対象のフォームアイテムへのフォーカスイベントの付与
   */
  Form.CheckMark.prototype._bindFocusForm = function (el) {
    var self = this
    this._$elForm.on('focus focusout', function (e) {
      // jquery validateの処理を待った上で処理する
      setTimeout(function () {
        // チェックマークの状態管理
        // 0:ノーマル状態, 1:OK状態, 2:エラー状態
        var checkState = 0

        // 必須入力確認用フラグ
        var is_required = false
        // エラー確認用フラグ
        var is_valid = false

        // 必須項目が入力されているかどうかの判定
        self._$el
          .find('.js_formCheckmark_item[data-required=1]')
          .each(function (i, el) {
            // 入力されている場合
            if ($(el).val().length > 0) {
              is_required = true
            }
            // されていない場合はfalseにして処理終了
            else {
              is_required = false
              return false
            }
          })
        // エラーが出ているかどうかの判定
        self._$el.find('.js_formCheckmark_item').each(function (i, el) {
          // エラーがない場合
          if (!$(el).hasClass(self._ngState)) {
            is_valid = true
          }
          // ある場合はfalseにして処理終了
          else {
            is_valid = false
            return false
          }
        })
        // チェックマークのフラグを変更
        if (is_required === false && is_valid === true) {
          checkState = 0
        } else if (is_valid === false) {
          checkState = 2
        } else {
          checkState = 1
        }
        // チェックマークの状態別に挙動を振り分け
        if (checkState === 0) {
          self._$el.removeClass(self._ngState).removeClass(self._okState)
        }
        if (checkState === 1) {
          self._$el.removeClass(self._ngState).addClass(self._okState)
        }
        if (checkState === 2) {
          self._$el.removeClass(self._okState).addClass(self._ngState)
        }
      }, 33)
    })
  }

  /**
   * jquery validateで発火されるイベントの付与
   */
  Form.CheckMark.prototype._bindHilightEl = function (el) {
    var self = this
    // エラー発生時にエラーのclassを付与
    this._$el.on('validateHighlight', function (e) {
      self._$el.addClass(self._ngState)
    })
  }

  /**
   * js_formCheckmarkというclassがついた要素にForm.CheckMark処理
   */
  Form.bindCheckMark = function () {
    Form.bindCheckMark._init()
  }

  Form.bindCheckMark._init = function () {
    this.instances = []
    this._$el = $('.js_formCheckmark')
    this._eachConstructor()
  }

  Form.bindCheckMark._eachConstructor = function () {
    var self = this
    $(this._$el).each(function (i, el) {
      self.instances.push(new Form.CheckMark(el))
    })
  }

  /**
   * ニックネームをチェック
   * @constructor
   */
  Form.CheckNickName = function () {
    this._init.apply(this, arguments)
  }

  /**
   * @param   {HTMLElement}   el - 処理の起点となる要素
   */
  Form.CheckNickName.prototype._init = function (el) {
    this._$el = $(el)
    this._$elTrigger = this._$el.find('.js_checkNickName_btn')
    this._$elForm = this._$el.find('.js_checkNickName_form')
    this._ngState = 'is_error'
    this._okState = 'is_ok'
    this._$elError = null
    this._apiPostData = {}
    this._value = ''

    this._bindClickTrigger()
    this._bindEventForm()
    this._bindValidateEl()
  }

  /**
   * トリガーへのクリックイベント付与
   */
  Form.CheckNickName.prototype._bindClickTrigger = function () {
    var self = this
    this._$elTrigger.on('click', function (e) {
      e.preventDefault()
      var valForm = self._$elForm.val()
      if (!valForm) {
        // jquery.validateを動かすための措置
        self._$elForm.prop('value', 'X')
        self._$elForm.trigger('focusout')
        self._$elForm.prop('value', '')
        self._$elForm.trigger('focusout')
        self._$elForm.trigger('focus')
        return
      }
      // エラー表示の時は処理しない
      if (self._$elForm.hasClass(self._ngState)) {
        return
      }
      // Ajax: apiに送るデータ用を取得して格納する
      self._apiPostData['nickname'] = valForm
      self._ajaxApi()
    })
  }

  /**
   * elFormへのイベント付与
   */
  Form.CheckNickName.prototype._bindEventForm = function () {
    var self = this
    this._$elForm.on('focus', function (e) {
      self._value = e.currentTarget.value
    })
    this._$elForm.on('change focus focusout', function (e) {
      setTimeout(function () {
        if (self._$elForm.hasClass(self._ngState)) {
          self._$el.removeClass(self._okState).addClass(self._ngState)
        }
        // 値が書き換わってなければ何もしない
        else if (e.currentTarget.value === self._value) {
          return
        } else {
          self._$el.removeClass(self._ngState).removeClass(self._okState)
        }
      }, 99)
    })
  }

  /**
   * jquery.validateから発行されるイベントの付与
   */
  Form.CheckNickName.prototype._bindValidateEl = function () {
    var self = this
    this._$el.on('validateUnHighlight', function (e) {
      self._$el.removeClass(self._ngState)
    })
    this._$el.on('validateHighlight', function (e) {
      self._$el.addClass(self._ngState)
    })
    $(this._$el).on('validateUnHighlight validateHighlight', function () {
      self._hideError()
    })
  }

  /**
   * Ajax:API通信
   */
  Form.CheckNickName.prototype._ajaxApi = function () {
    var self = this

    // Ajax: api通信して、ニックネームが被っていないかどうかを取得する
    lottery.ajax.ajaxCommunication({
      url: './nickname-check/',
      data: this._apiPostData,
      ope: self._$elForm.val(),
      callbackSuccess: function (response) {
        // Ajax: レスポンスデータ
        var data = response
        // Ajax: ニックネームが被っていないとき
        if (
          data.nicknameCheckErrorMessage === null ||
          data.nicknameCheckErrorMessage === ''
        ) {
          self._$el.removeClass(self._ngState)
          self._$el.addClass(self._okState)
          self._hideError()
        }
        // Ajax: ニックネームが被っている時
        else {
          self._$el.addClass(self._ngState)
          self._showError(data.nicknameCheckErrorMessage)
          self._$el.removeClass(self._okState)
          self._$el.addClass(self._ngState)
        }
      },
    })
  }

  /**
   * エラー表示
   */
  Form.CheckNickName.prototype._showError = function (str) {
    if (!this._$elError) {
      var elError = _ns.Util.createElement('label', {
        class: 'm_formError',
      })
      this._$elError = $(elError)
    }
    this._$elError.html(str)
    this._$el.parents('.js_validate').prepend(this._$elError)
  }

  /**
   * エラー非表示
   */
  Form.CheckNickName.prototype._hideError = function () {
    if (!this._$elError) {
      return
    }
    this._$elError.detach()
  }

  /**
   * js_checkNicNameというclassをもつ要素へのForm.CheckNickName処理
   */
  Form.bindCheckNickName = function () {
    Form.bindCheckNickName._init()
  }

  Form.bindCheckNickName._init = function () {
    this.instances = []
    this._$el = $('.js_checkNicName')
    this._eachConstructor()
  }

  Form.bindCheckNickName._eachConstructor = function () {
    var self = this
    $(this._$el).each(function (i, el) {
      self.instances.push(new Form.CheckNickName(el))
    })
  }

  /**
   * パスワードの挙動
   * @constructor
   */
  Form.CheckPassword = function () {
    this._init.apply(this, arguments)
  }

  /**
   * @param   {HTMLElement}   el - 処理の起点となる要素
   */
  Form.CheckPassword.prototype._init = function (el) {
    this._$el = $(el)
    // パスワード入力フォーム
    this._$elPasswordBase = this._$el.find('.js_password_base')
    // パスワード入力確認フォーム
    this._$elPasswordConfirm = this._$el.find('.js_password_confirm')
    // パスワードを表示する
    this._$elPasswordShow = this._$el.find('.js_password_show')

    this._bindChangePasswordShow()
  }

  /**
   * パスワードを表示するチェックボックスへのチェンジイベントの付与
   */
  Form.CheckPassword.prototype._bindChangePasswordShow = function () {
    var self = this
    this._$elPasswordShow
      .on('change', function (e) {
        var $el = $(e.currentTarget)
        // チェックされている時はtypeを変える
        if ($el.prop('checked')) {
          self._$elPasswordBase.prop('type', 'text')
          self._$elPasswordConfirm.prop('type', 'text')
        }
        // チェックされていない時はtypeを戻す
        else {
          self._$elPasswordBase.prop('type', 'password')
          self._$elPasswordConfirm.prop('type', 'password')
        }
      })
      .trigger('change')
  }

  /**
   * js_checkPasswordというclassをもつ要素にForm.CheckPassword処理
   */
  Form.bindCheckPassword = function () {
    Form.bindCheckPassword._init()
  }

  Form.bindCheckPassword._init = function () {
    this.instances = []
    this._$el = $('.js_checkPassword')
    this._eachConstructor()
  }

  Form.bindCheckPassword._eachConstructor = function () {
    var self = this
    $(this._$el).each(function (i, el) {
      self.instances.push(new Form.CheckPassword(el))
    })
  }

  /**
   * 秘密の質問の挙動
   * @constructor
   */
  Form.CheckSecretQa = function () {
    this._init.apply(this, arguments)
  }

  /**
   * @param   {HTMLElement}   el - 処理の起点となる要素
   */
  Form.CheckSecretQa.prototype._init = function (el) {
    this._$el = $(el)
    // 質問定型分
    this._$elSecretQaBase = this._$el.find('.js_checkSecretQa_qBase')
    // 質問自由入力フォーム
    this._$elSecretQaFree = this._$el.find('.js_checkSecretQa_qFree')
    // 自由入力するためのチェックボックス
    this._$elSecretQaCheck = this._$el.find('.js_checkSecretQa_check')
    // バリデーションの要素
    this._$elValidate = this._$elSecretQaBase.closest('.js_validate')
    // ステート
    this._stateDisabled = 'is_disabled'
    this._stateError = 'is_error'

    this._watchElSecretQaCheck()
    this._bindElChangeSecretQaCheck()
  }

  /**
   * チェックボックスへのチェックされているかによって状態を切り替える
   */
  Form.CheckSecretQa.prototype._watchElSecretQaCheck = function () {
    var $elSlectParent = this._$elSecretQaBase.parents('.m_select')
    var $elError = this._$elValidate.find('.m_formError')
    // チェックされている時
    if (this._$elSecretQaCheck.prop('checked')) {
      // 定型文を入力不可に
      this._$elSecretQaBase.prop('disabled', true)
      $elSlectParent.addClass(this._stateDisabled)
      // 自由入力を入力可に
      this._$elSecretQaFree.prop('disabled', false)
      // jqueryvalidateのエラーを外す
      $elSlectParent.removeClass(this._stateError)
      $elError.hide()
    }
    // チェックされていない時
    else {
      // 定型文を入力可に
      this._$elSecretQaBase.prop('disabled', false)
      $elSlectParent.removeClass(this._stateDisabled)
      // 自由入力を入力不可に
      this._$elSecretQaFree.prop('disabled', true)
      // jqueryvalidateのエラーを外す
      this._$elSecretQaFree.removeClass(this._stateError)
      $elError.hide()
    }
  }

  /**
   * チェックボックスへのチェンジイベント付与
   */
  Form.CheckSecretQa.prototype._bindElChangeSecretQaCheck = function () {
    var self = this
    this._$elSecretQaCheck.on('change', function () {
      self._watchElSecretQaCheck()
    })
  }

  /**
   * js_checkSecretQaというclassが付いている要素へのForm.CheckSecretQa処理
   */
  Form.bindCheckSecretQa = function () {
    Form.bindCheckSecretQa._init()
  }

  Form.bindCheckSecretQa._init = function () {
    this.instances = []
    this._$el = $('.js_checkSecretQa')
    this._eachConstructor()
  }

  Form.bindCheckSecretQa._eachConstructor = function () {
    var self = this
    $(this._$el).each(function (i, el) {
      self.instances.push(new Form.CheckSecretQa(el))
    })
  }

  /**
   * お知らせ受信設定の挙動
   * @constructor
   */
  Form.CheckGetNews = function () {
    this._init.apply(this, arguments)
  }

  /**
   * @param   {HTMLElement}   el - 処理の起点となる要素
   */
  Form.CheckGetNews.prototype._init = function (el) {
    this._$el = $(el)
    this._$elGetNewsTrigger = this._$el.find('.js_checkGetNews_trigger')
    this._elGetNewsGroupClass = '.js_checkGetNews_group'
    this._elGetNewstoggleClass = '.js_checkGetNews_toggle'
    this._hideState = 'is_hide'
    this._elTargetChangeBgEle = this._$el.find('.js_change_chkdBg > li')

    this._watchElGetNewsTrigger()
    this._bindChangeElGetNewsTrigger()
  }

  /**
   * トリガーとなる要素へのクリックイベント付与
   */
  Form.CheckGetNews.prototype._bindChangeElGetNewsTrigger = function () {
    var self = this
    this._$elGetNewsTrigger.on('change', function () {
      self._watchElGetNewsTrigger()
    })
  }

  /**
   * チェック状態によってチェックを外す/アクディブにする要素を変える
   */
  Form.CheckGetNews.prototype._watchElGetNewsTrigger = function () {
    var self = this
    this._$elGetNewsTrigger.each(function (i, el) {
      var $el = $(el)
      var $elGroup = $el.parents(self._elGetNewsGroupClass)
      var $elCheckboxs = $elGroup.find('input[type=checkbox]')
      var $elToggle = $elGroup.find(self._elGetNewstoggleClass)
      // チェックされている時
      if ($el.prop('checked')) {
        if (window.lottery && window.lottery.NotAutoCheck) {
          window.lottery.NotAutoCheck = false
          $elCheckboxs.each(function (i, el) {
            var $elChild = $(el)
            if ($elChild.prop('checked')) {
              $elChild.parents('li').addClass('is_checked')
            } else {
              $elChild.parents('li').removeClass('is_checked')
              $elChild.checked = ''
            }
          })
        } else {
          $elCheckboxs
            .prop('checked', true)
            .closest(self._elTargetChangeBgEle)
            .addClass('is_checked')
        }

        $elToggle.removeClass(self._hideState)
      }
      // チェックされていない時
      else {
        $elCheckboxs.prop('checked', false)
        $elToggle.addClass(self._hideState)
      }
    })
  }

  /**
   * js_checkGetNewsというclassが付いた要素へのForm.CheckGetNews処理
   */
  Form.bindCheckGetNews = function () {
    Form.bindCheckGetNews._init()
  }

  Form.bindCheckGetNews._init = function () {
    this.instances = []
    this._$el = $('.js_checkGetNews')
    this._eachConstructor()
  }

  Form.bindCheckGetNews._eachConstructor = function () {
    var self = this
    $(this._$el).each(function (i, el) {
      self.instances.push(new Form.CheckGetNews(el))
    })
  }

  /**
   * 入力フォームのカレンダー表示
   */
  Form.Calendar = function () {
    this._init.apply(this, arguments)
  }

  /**
   * @param   {string|HTMLElement}   el - selector or  HTMLElement
   * @param   {object}               options - jQuery datepicker options
   */
  Form.Calendar.prototype._init = function (el, options) {
    options = options || {}
    var self = this
    this._$el = $(el)
    this._isCalFocus = true
    this._focusTimer = null
    // 最小値、指定がない場合は今日
    options.minDate = 'minDate' in options ? options.minDate : 0
    // 年月の切り替えの時
    options.onChangeMonthYear = function (year, month, instance) {
      self._isCalFocus = true
    }
    // 開いた時
    options.beforeShow = function (str, instance) {
      // フォーカス用の監視タイマー
      self._startCalenderTimer()
    }
    // 閉じた時
    options.onClose = function (str, instance) {
      var $elInput = instance.input
      // フォーカス用の監視タイマーを削除
      self._stopCalenderTimer()
      // 一度datepickerを削除
      $elInput.datepicker('destroy')
      // フォーカスを次の要素に移動
      self.nextFocus($elInput.datepicker('option'))
      // IE対応のため、実行タイミングをずらす
      setTimeout(function () {
        $elInput.datepicker(options)
      }, 33)
    }
    // datepicker実行
    this._$el.datepicker(options)
  }

  /**
   * フォーカスを次の要素に移動する
   */
  Form.Calendar.prototype.nextFocus = function (element) {
    var nextStop = false
    var $focusableElements = $(document).find(':focusable')
    for (var i = 0; i < $focusableElements.length; i++) {
      $obj = $focusableElements[i]
      if (nextStop) {
        $obj.focus()
        return
      }
      if ($obj == element.context) {
        nextStop = true
      }
    }
  }

  /**
   * カレンダーを非表示にする
   */
  Form.Calendar.prototype.hide = function () {
    this._$el.datepicker('hide')
  }

  /**
   * フォーカス用の監視タイマー
   */
  Form.Calendar.prototype._startCalenderTimer = function () {
    var self = this
    this._focusTimer = setInterval(function () {
      var $elCalendar = self._$el.datepicker('widget')
      var $elLink = $elCalendar.find('a:not(.ui-state-disabled)')

      if ($elCalendar.is(':visible')) {
        // タブ移動できるように
        $elLink.attr('href', 'javascript:;').attr('tabindex', 0)
        if (self._isCalFocus) {
          self._isCalFocus = false
          $elLink[0].focus()
        }
      } else {
        $elLink.attr('tabindex', -1)
        self._isCalFocus = true
      }
    }, 330)
  }

  /**
   * フォーカス用の監視タイマー
   */
  Form.Calendar.prototype._stopCalenderTimer = function () {
    clearTimeout(this._focusTimer)
    this._isCalFocus = true
  }

  /**
   * チェックボックスと連動したsubmitボタン
   */
  Form.AcitivateSubmit = function () {
    this._init.apply(this, arguments)
  }

  /**
   * @param   {HTMLElement}   el
   */
  Form.AcitivateSubmit.prototype._init = function (el) {
    this._$el = $(el)
    this._$elForm = this._$el.find('.js_acitivateSubmit_form')
    this._$elBtn = this._$el.find('.js_acitivateSubmit_btn')
    this._disabledState = 'is_disabled'
    this._errorState = 'is_error'
    this._timer = null

    this._bindFocusElform()
    this._watchElform()
  }

  /**
   * elFormへのfocus系イベント付与
   */
  Form.AcitivateSubmit.prototype._bindFocusElform = function () {
    var self = this
    // focusされたタイミングでタイマーを解除
    this._$elForm.on('focus', function (e) {
      var $el = $(e.currentTarget)
      var type = $el.attr('type')
      // 文字入力系の要素だった場合
      if (
        $el[0].tagName === 'TEXTAREA' ||
        type === 'text' ||
        type === 'email' ||
        type === 'password' ||
        type === 'tel' ||
        type === 'search' ||
        type === 'date' ||
        type === 'number'
      ) {
        clearInterval(self._timer)
        self._timer = null
      }
    })
    // focusさが外れたタイミングでタイマーを再開
    this._$elForm.on('focusout', function (e) {
      var $el = $(e.currentTarget)
      var type = $el.attr('type')
      // 文字入力系の要素だった場合
      if (
        $el[0].tagName === 'TEXTAREA' ||
        type === 'text' ||
        type === 'email' ||
        type === 'password' ||
        type === 'tel' ||
        type === 'search' ||
        type === 'date' ||
        type === 'number'
      ) {
        self._watchElform()
      }
    })
  }

  /**
   * elFormの状態を監視して、submitボタンの応対を切り替える
   */
  Form.AcitivateSubmit.prototype._watchElform = function () {
    var self = this
    // すでにタイマーが定義されている場合は実行しない。
    if (this._timer) {
      return
    }
    this._timer = setInterval(function () {
      var isSelectedCheckForm = true
      var isSelectedTextForm = true
      self._$elForm.each(function (i, el) {
        var $el = $(el)
        var type = $el.prop('type')
        if (type === 'checkbox' || type === 'radio') {
          if ($el.prop('checked')) {
            isSelectedCheckForm = true
          } else {
            isSelectedCheckForm = false
            return false
          }
        }

        if (
          $el[0].tagName === 'TEXTAREA' ||
          type === 'text' ||
          type === 'email' ||
          type === 'password' ||
          type === 'tel' ||
          type === 'search' ||
          type === 'date' ||
          type === 'number'
        ) {
          if ($el.prop('value') !== '' && !$el.hasClass(self._errorState)) {
            isSelectedTextForm = true
          } else {
            isSelectedTextForm = false
            return false
          }
        }
      })
      // 全て選択・入力されたらボタンをアクティブに
      if (isSelectedCheckForm && isSelectedTextForm) {
        self._$elBtn.prop('disabled', false)
        self._$elBtn.removeClass(self._disabledState)
      } else {
        self._$elBtn.prop('disabled', true)
        self._$elBtn.addClass(self._disabledState)
      }
    }, 99)
  }

  /**
   * js_acitivateSubmitというclassが付いた要素へのForm.AcitivateSubmit処理
   */
  Form.bindAcitivateSubmit = function () {
    Form.bindAcitivateSubmit._init()
  }
  Form.bindAcitivateSubmit._init = function () {
    this.instances = []
    this._$el = $('.js_acitivateSubmit')
    this._eachConstructor()
  }
  Form.bindAcitivateSubmit._eachConstructor = function () {
    var self = this
    $(this._$el).each(function (i, el) {
      self.instances.push(new Form.AcitivateSubmit(el))
    })
  }

  /**
   * Enterでのサブミットを禁止
   */
  Form.disabledEnterSubmit = function () {
    Form.disabledEnterSubmit._init()
  }
  Form.disabledEnterSubmit._init = function () {
    $(document).on('keypress', 'input', function (e) {
      return e.which !== 13
    })
  }

  /**
   * ログアウトモーダル
   */
  var ShowLogoutModal = (_ns.ShowLogoutModal =
    _ns.ShowLogoutModal ||
    function () {
      ShowLogoutModal._init()
    })

  ShowLogoutModal._init = function () {
    this._$elShowLogoutModalTrigger = $('.js_showLogoutModal_trigger')
    this._modal = null
    this._createModal()
    this._bindClickShowLogoutModalTrigger()
  }

  /**
   * ログアウトモーダル生成
   */
  ShowLogoutModal._createModal = function () {
    var html =
      '<div class="m_modal" tabindex="0">' +
      '<div class="m_modal_header">' +
      '<div class="m_modal_header_inner">' +
      '<p class="m_modal_header_ttl">ログアウトのご確認</p>' +
      '</div>' +
      '<!-- /.m_modal_header --></div>' +
      '<div class="m_modal_body">' +
      'ログアウトすると、現在カートに入っている商品がすべて削除されます。' +
      '<!-- /.m_modal_body --></div>' +
      '<div class="m_modal_footer">' +
      '<ul class="m_modal_btnWrap2">' +
      '<li><a href="javascript:;" class="m_modal_btn m_btn m_btn__color2 m_btn__block js_modal_close"><span>キャンセル</span></a></li>' +
      '<li><a href="javascript:;" class="m_modal_btn m_btn m_btn__block js_showLogoutOk"><span>ログアウト</span></a></li>' +
      '</ul>' +
      '<!-- /.m_modal_footer --></div>' +
      '<!-- /.m_modal --></div>'
    var $html = $(html)
    this._modal = new _ns.Modal({
      $el: $html,
    })
    // ログアウトボタンにイベントを付与
    $html.find('.js_showLogoutOk').on('click', function (e) {
      e.preventDefault()
      if ($('#logoutForm').size()) {
        $('#logoutForm').submit()
      } else if ($('#mypageLogoutForm').size()) {
        $('#mypageLogoutForm').submit()
      }
    })
  }

  /**
   * トリガーにクリックイベントを付与（ログアウト）
   */
  ShowLogoutModal._bindClickShowLogoutModalTrigger = function () {
    var self = this
    this._$elShowLogoutModalTrigger.on('click', function (e) {
      e.preventDefault()
      if (lottery.value.cartFlg === '1') {
        // モーダルを表示する
        self._modal.show()
      } else {
        if ($('#logoutForm').size()) {
          $('#logoutForm').submit()
        } else if ($('#mypageLogoutForm').size()) {
          $('#mypageLogoutForm').submit()
        }
      }
    })
  }

  /**
   * キャリーオーバー
   */
  var CarryOver = (_ns.CarryOver = _ns.CarryOver || {})

  CarryOver._json = {}

  CarryOver.getJSON = function () {
    return CarryOver._json
  }

  /**
   * キャリーオーバー 表示の種類にあわせたリスト
   */
  CarryOver._itemList = [
    {
      digit: ['', '<span>万</span>', '<span>億</span>'],
      comma: '$1<span class="u_lotoInfoComma">,</span>',
    },
  ]

  /**
   * キャリーオーバー JSON取得
   */

  /**
   * キャリーオーバー 値を成形
   */
  CarryOver.createJpyen = function (param) {
    var num = parseInt(param.split)
    var digit = CarryOver._itemList[param.type].digit
    var comma = CarryOver._itemList[param.type].comma
    var result = ''

    if (num) {
      var nums = String(num)
        .replace(/(\d)(?=(\d{4})+$)/g, '$1,')
        .split(',')
        .reverse()
      for (var i = 0; i < nums.length; i++) {
        if (!nums[i].match(/^[0]+$/)) {
          nums[i] = nums[i].replace(/^[0]+/g, '')
          if (nums[i].length == 4) {
            nums[i] = nums[i].replace(/(\d)(?=(\d{3})+(?!\d))/g, comma)
          }
          result = nums[i] + digit[i] + result
        }
      }
    }
    return result
  }

  /**
   * キャリーオーバーバナー　(type: 0)
   */
  CarryOver.setBanner = function () {
    ;['loto6', 'loto7'].forEach(function (i) {
      if (CarryOver._json.carryover[i] == 0) {
        $('.m_' + i + '_billionaire_number').append(
          CarryOver._json.billionaire[i] + '<span>口</span>',
        )
        $('.m_' + i + '_carryover_block').hide()
      } else {
        $('.m_' + i + '_carryover_number').append(
          CarryOver.createJpyen({
            split: CarryOver._json.carryover[i],
            type: 0,
          }) + '<span>円</span>',
        )
        $('.m_' + i + '_billionaire_block').hide()
      }
    })
  }

  /**
   * bindAjaxModal
   * Ajaxで外部HTMLファイルからデータを取得してきて、ページ内モーダルとして表示する
   */
  var bindUpdateQRCodeModal = (_ns.bindUpdateQRCodeModal =
    _ns.bindUpdateQRCodeModal ||
    function () {
      bindUpdateQRCodeModal._init()
    })

  bindUpdateQRCodeModal._init = function () {
    // 一度読み込んだモーダルを格納しておく配列
    this._chaceModals = {}
    this._chaceModalsKey = 0
    this._elTrigger = '.js_ajaxQRCodeModal'
    this._qrTimeoutFn
    this._bindClickTrigger()
    this._doUpdateQR()
  }

  /**
   * トリガーへのクリックイベント付与
   */
  bindUpdateQRCodeModal._bindClickTrigger = function () {
    var self = this
    $(document).on('click', this._elTrigger, function (e) {
      e.preventDefault()
      var $el = $(e.currentTarget)
      // すでにモーダルがある時
      var url = $el.attr('href')
      if ($el.attr('data-ajaxModal-index')) {
        self._ajaxModal(url, $el.attr('data-ajaxModal-index'))
      } else {
        $el.attr('data-ajaxModal-index', self._chaceModalsKey)
        self._chaceModalsKey++
        self._ajaxModal(url)
      }
    })
  }

  /**
   * ajax処理で外部HTMLからモーダルないに表示するデータを取得してくる
   */
  bindUpdateQRCodeModal._ajaxModal = function (url, modalIndex) {
    var self = this
    lottery.ajax.ajaxCommunication({
      url: url,
      data: {},
      dataType: 'html',
      callbackSuccess: function (data) {
        clearInterval(self._qrTimeoutFn)
        $('#qrModal').remove()
        var $html = $($.parseHTML(data))
        var modalHtml = $html.find('#modal').html()
        var $modalHtml = $(modalHtml)
        if (modalIndex === undefined) {
          modalIndex = self._chaceModalsKey
          self._chaceModalsKey++
        }
        self._chaceModals[modalIndex] = new _ns.Modal({
          $el: $modalHtml,
        })
        self._chaceModals[modalIndex].show()
        $('#qrModal').qrcode($('#qrImg').attr('data-qrcode'))
        $('#qrModal').find('canvas').hide()
        $('#qrImg').attr(
          'src',
          $('#qrModal').find('canvas').get(0).toDataURL('image/png'),
        )
        $('#qrBtnWrap').hide()
        var qrCodeYukokigen =
          Date.now() + parseInt($('#qrCodeYukokigen').val()) * 1000
        self._qrTimeoutFn = setInterval(function () {
          if (Date.now() > qrCodeYukokigen) {
            clearInterval(self._qrTimeoutFn)
            $('#qrBtnWrap').show()
          }
        }, parseInt($('#qrCodeCheckInterval').val()))
      },
      fail: function () {
        alert('QRコード生成に失敗しました')
      },
      ope: 'QRコード生成',
      timeout: true,
    })
  }

  /**
   * QRコードを更新する
   */
  bindUpdateQRCodeModal._doUpdateQR = function doUpdateQRCode(url) {
    var self = this
    $(document).on('click', '#qrBtn', function (e) {
      e.preventDefault()
      var $el = $(e.currentTarget)
      // すでにモーダルがある時
      var url = $el.attr('href')
      $('#qrBtnWrap').hide()
      // Ajax: api通信して、ニックネームが被っていないかどうかを取得する
      lottery.ajax.ajaxCommunication({
        url: url,
        data: {},
        __ope: $el.text(),
        callbackSuccess: function (response) {
          // Ajax: レスポンスデータ
          var data = response
          if (data) {
            clearInterval(self._qrTimeoutFn)
            $('#qrModal').find('canvas').remove()
            $('#qrModal').qrcode(data.qrCode)
            $('#qrModal').find('canvas').hide()
            $('#qrImg').attr(
              'src',
              $('#qrModal').find('canvas').get(0).toDataURL('image/png'),
            )
            $('#qrCodeYukokigen').val(data.qrCodeYukokigen)
            $('#qrCodeCheckInterval').val(data.qrCodeCheckInterval)
            var qrCodeYukokigen =
              Date.now() + parseInt($('#qrCodeYukokigen').val()) * 1000
            self._qrTimeoutFn = setInterval(function () {
              if (Date.now() > qrCodeYukokigen) {
                clearInterval(self._qrTimeoutFn)
                $('#qrBtnWrap').show()
              }
            }, parseInt($('#qrCodeCheckInterval').val()))
          }
        },
      })
    })
  }
})(window, document)

// 全ページで初期実行するもの
$(function () {
  window.lottery.GrobalNav() // グローバルナビ
  window.lottery.AddStateTouchDevice() // タッチデバイス判定
  window.lottery.bindTab() // タブ
  window.lottery.bindAccordion() // アコーディオン
  window.lottery.bindShareSns() // SNSシェアボタン
  window.lottery.bindScrollAnchor() // ページ内スクロール
  window.lottery.bindModal() // モーダル
  window.lottery.bindAjaxModal() // 非同期モーダル
  window.lottery.bindMovieModal() // 動画モーダル
  window.lottery.bindRollover() // ロールオーバー
  window.lottery.bindUserThumb() // ユーザーアップロードサムネイル
  window.lottery.Form.bindSelectPlaceholder() // selectのplaceholder
  window.lottery.ShowLogoutModal() // ログアウトモーダル
  window.lottery.bindUpdateQRCodeModal() // 非同期モーダル
})
