/**
 * @fileoverview
 * vue-common.js
 * @require Vue.js
 */
;(function(w, d, Vue) {
  'use strict';

  // namespace
  var _ns = w.lottery = w.lottery || {};


  /**
   * Use common.js methods
   */
  var Util = _ns.Util;


  /**
   * Use Vue plugin
   */
  if (typeof Vuex !== 'undefined') {
    Vue.use(Vuex);
  }
  if (typeof VueTouch !== 'undefined') {
    Vue.use(VueTouch, {name: 'v-touch'});
    VueTouch.config.swipe = {
      direction: 'horizontal'
    };
  }

  // Local Mixins
  var Mixins = Vue.__mixins = Vue.__mixins || {};
  // Store Modules
  var Stores = Vuex.__stores = Vuex.__stores || {};
  // Local Components
  var Components = Vue.__components = Vue.__components || {};



  /**
   * Golbal mixin
   */
  Vue.mixin({

    methods: {
      bindChangeMediaQuery: function() {
        if (typeof window.enquire === 'undefined') {
          console.log('enquire.js is not defined.');
          return;
        } else if (!this.$store || !this.$store.getters.mediaQuery) {
          console.log('$store global module is not defined.');
          return;
        }
        var mediaPc = this.$store.getters.mediaQuery('pc');

        var onChangeMediaQuery = function(device) {
          this.$store.dispatch('updateCurrentMediaView', device);
        };

        enquire.register(mediaPc, {
          match  : onChangeMediaQuery.bind(this, 'pc'),
          unmatch: onChangeMediaQuery.bind(this, 'sp')
        });
      },

      /**
       * $emit custom event
       * @param   {string}   eventName
       * @param   {*}        data
       */
      emitVmApp: function(eventName, data) {
        this.$root.$emit(eventName, data);
      },

      /**
       * $on custom event
       * @param   {string}     eventName
       * @param   {function}   callback
       */
      onVmApp: function(eventName, callback) {
        if (typeof callback !== 'function') {
          return;
        }
        this.$root.$on(eventName, callback);
      },

      /**
       * タッチデバイスかどうか返す
       * @return  {bool}
       */
      getIsTouchDevice: function() {
        return Util.isTouchDevice();
      },
    }

  });


  /**
   * Store modules
   * global
   */
  Stores.GLOBAL = {
    state: {
      now: moment().format('YYYYMMDDHHmmss'), //{string}
      momentFormat: 'YYYYMMDDHHmmss',
      mediaQuery: {
        pc: '(min-width: 769px)' //{string} - media query value
      },
      // $rootでonResizeなりしてupdateして利用する
      currentMediaView: window.matchMedia('(min-width: 769px)').matches ? 'pc' : 'sp', //{string} - sp|pc
      modalDelay: 280, //{number}
    },
    getters: {
      /**
       * 日時をYYYYMMDDHHmmss形式で返す
       * @return   {string} - state.now
       */
      now: function(state) {
        return state.now;
      },
      /**
       * 引数value（YYYYMMDDHHmmss形式）をmoment objectで返す
       */
      moment: function(state) {
        /**
         * @param   {string}   value - YYYYMMDDHHmmss
         * @return  {object} - moment object
         */
        return function(value) {
          if (typeof moment !== 'undefined') {
            return moment(value, state.momentFormat);
          }
        };
      },
      /**
       * （引数targetの）CSSメディアクエリ値を返す
       */
      mediaQuery: function(state) {
        /**
         * @param    {string}   target - sp|pc
         * @return   {string} - state.mediaQuery[target]
         */
        return function(target) {
          return state.mediaQuery[target || 'pc'];
        };
      },
      /**
       * 表示状態を返す
       * @return   {string} - sp|pc
       */
      currentMediaView: function(state) {
        return state.currentMediaView;
      },
      /**
       * Modalコンストラクタの表示delay値を返す
       * @return   {number} - state.modalDelay
       */
      modalDelay: function(state) {
        return state.modalDelay;
      },
    },
    mutations: {
      /**
       * state.currentMediaViewをvalue値で更新
       * @param   {string}   value - sp|pc
       */
      UPDATE_CURRENT_MEDIA_VIEW: function(state, value) {
        state.currentMediaView = value;
      }
    },
    actions: {
      /**
       * state.currentMediaViewをvalue値で更新(commit)
       * @param   {string}   value - sp|pc
       */
      updateCurrentMediaView: function(context, value) {
        context.commit('UPDATE_CURRENT_MEDIA_VIEW', value);
      }
    }
  };

  /**
   * Store modules
   * router
   */
  Stores.ROUTER = {
    state: {
      route: 'default', //{string} 初期タブ 'default'|'continuation'
    },
    getters: {
      /**
       * state.routeを返す
       * @return   {string} - state.route
       */
      route: function(state) {
        return state.route;
      }
    },
    mutations: {
      /**
       * state.routeをvalue値で更新
       * @param   {string}   value
       */
      CHANGE_ROUTE: function(state, value) {
        state.route = value;
      },
    },
    actions: {
      /**
       * state.routeをvalue値で更新(commit)
       * @param   {string}   value
       */
      routerPush: function(context, value) {
        context.commit('CHANGE_ROUTE', value);
      }
    }
  };

  /**
   * Store modules
   * purchase
   */
  Stores.PURCHASE = {
    state: {
      monthly: {
        limit: 0, //{number}
        used : 0, //{number}
      },
      once: {
        limit: 0, //{number}
        used : 0, //{number}
      },
      nsItemCount: {
        limit: 0, //{number}
        used : 0, //{number}
      }
    },
    getters: {
      /**
       * 月額限度額状態を返す
       * @return   {object} - state.monthly
       */
      purchaseMonthly: function(state) {
        return state.monthly;
      },
      /**
       * カート上限額状態を返す
       * @return   {object} - state.once
       */
      purchaseOnce: function(state) {
        return state.once;
      },
      /**
       * 数選くじ組み合わせ限度数状態を返す
       * @return   {object} - state.nsItemCount
       */
      purchaseNsItemCount: function(state) {
        return state.nsItemCount;
      },
      /**
       * 購入可能状態バリデートを返す
       */
//      purchaseState: function(state, getters) {
//        /**
//         * @param   {string}   target - router
//         * @return  {object}
//         *          {boolean}  isValid   - バリデート状態
//         *          {string}   errorType - バリデートfalseの理由
//         */
//        return function(target) {
//          target = target || getters.route;
//
//          var result = {isValid: true, errorType: ''};
//
//          if (!getters.totalPrice) {
//            result.isValid = false;
//            result.errorType = 'undefined';
//            console.log('store getters.totalPrice is not defined');
//            return result;
//          }
//
//          var totalPrice = getters.totalPrice(target);
//          var totalNsItemCount = !!getters.totalNsItemCount
//                                    ? getters.totalNsItemCount(target) : 0;
//
//          var monthly = getters.purchaseMonthly;
//          var once    = getters.purchaseOnce;
//          var nsCount = getters.purchaseNsItemCount;
//
//          var limitMonthly = monthly.limit - monthly.used;
//          var limitOnce    = once.limit - once.used;
//          var limitNsItemCount = nsCount.limit - nsCount.used;
//
//          if (totalPrice > limitMonthly) {
//            // 月額限度額
//            result.isValid = false;
//            result.errorType = 'limitMonthly';
//
//          } else if (totalPrice > limitOnce) {
//            // カート上限額
//            result.isValid = false;
//            result.errorType = 'limitOnce';
//
//          } else if (totalNsItemCount > limitNsItemCount) {
//            // 数選くじ組み合わせ限度数
//            result.isValid = false;
//            result.errorType = 'limitNsItemCount';
//          }
//
//          return result;
//        };
//      }
    }
  };

  /**
   * Store modules
   * purchase
   */
  Stores.PRODUCT = {
    state: {
      price: 0,  //{number}
      unit : '', //{string}
      hnbJykShbt : '', //{string}
      hnbFlag : '' //{string}
    },
    getters: {
      /**
       * 単価を返す
       * @return   {number} - state.price
       */
      price: function(state) {
        return state.price;
      },
      /**
       * 製品単位を返す
       * @return   {number} - state.unit
       */
      unit: function(state) {
        return state.unit;
      },
      /**
       * 販売状況種別を返す
       * @return   {String} - state.hnbJykShbt
       */
      hnbJykShbt: function(state) {
        return state.hnbJykShbt;
      },
      /**
       * 販売フラグを返す
       * @return   {String} - state.hnbFlag
       */
      hnbFlag: function(state) {
        return state.hnbFlag;
      },
      /**
       * 数選・番号フォーマットオブジェクトを返す
       */
      lotteryNumberFormat: function() {
        /**
         * @param   {string|number}   value
         * @param   {string}          selectType
         * @return  {object} - {value: value, selectType: selectType}
         */
        return function(value, selectType) {
          if ( typeof value === 'undefined' || !value && (typeof value === 'object')
              || typeof value === 'boolean') {
            // undefined, null, boolean
            value = '';
          }
          selectType = (typeof selectType === 'undefined') ? '' : selectType;

          return {value: value, selectType: selectType};
        };
      },
      /**
       * 引数selecteds（数選・番号フォーマットの集まり）で、
       * selectTypeに値がある番号の個数を返す
       * ※selectType=disabledも返り値の個数に含まれる
       */
      selectedNumbersCount: function() {
        /**
         * @param   {array<object>}   selecteds
         * @return  {number}
         */
        return function(selecteds) {
          if ( !Array.isArray(selecteds) ) return 0;

          var count = _.countBy(selecteds, function(o) {
            return !!o.selectType ? 'selected' : 'empty';
          });

          return count.selected || 0;
        };
      },
      /**
       * 引数selecteds（数選・番号フォーマットの集まり）で、
       * selectType=disabledの番号の個数を返す
       */
      disabledNumbersCount: function() {
        /**
         * @param   {array<object>}   selecteds
         * @return  {number}
         */
        return function(selecteds) {
          if ( !Array.isArray(selecteds) ) return 0;

          var count = _.countBy(selecteds, function(o) {
            return ('disabled' === o.selectType) ? 'disabled' : 'abled';
          });

          return count.disabled || 0;
        };
      }
    }
  };


  /**
   * Golbal filters
   */

  /**
   * 3桁コンマ表示
   * @param   {number}   num
   * @return  {string}
   */
  Vue.filter('number_format', function (num) {
    if(Number.isNaN(num - 0)) {
      return num;
    }
    var str = num + ''; //{string}
    while( str !== (str = str.replace(/^(-?\d+)(\d{3})/, '$1,$2')) ); //3桁毎にカンマを挿入
    return str;
  });


  /**
   * Golbal & Local Components
   */

  /**
   * 疑似router-link
   * $rootにvuex($.store)が必要
   */
  Vue.component('router-link-store', {
    template: '<a href="#" ' +
                'v-bind:class="aClass" ' +
                'v-on:click.prevent="onClick"><slot></slot></a>',
    props: {
      to: {
        type: String,
        required: true,
        default: ''
      },
      activeClass: {
        type: String,
        default: 'is_current'
      },
      disabledClass: {
        type: String,
        default: 'is_disabled'
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      route: function() {
        if (!this.$store || !this.$store.getters.route) {
          return '';
        } else {
          return this.$store.getters.route || '';
        }
      },
      aClass: function() {
        var c = {};

        if (this.route === this.to) {
          c[this.activeClass] = true;
        }
        if (this.disabled) {
          c[this.disabledClass] = true;
        }

        return c;
      }
    },
    mounted: function() {
      if (!this.$store || !this.$store.getters.route) {
        console.log('$store route module is not defined.');
      }
    },
    methods: {
      onClick: function() {
        if (this.disabled) return;

        this.$store.dispatch('routerPush', this.to);
      }
    }
  });

  /**
   * モーダル
   * @require  _ns.Modal
   * note: v-ifなどで要素自体を消さない（jQuey依存のため）
   */
  Vue.component('modal', {
    template: '<div class="m_modal">' +
                '<div class="m_modal_scroll" v-if="!isFavorite">' +
                  '<div class="m_modal_header" v-if="isHeader">' +
                    '<div class="m_modal_header_inner">' +
                      '<p class="m_modal_header_ttl"><slot name="header"></slot></p>' +
                      '<slot name="header_txt"></slot>' +
                    '</div>' +
                  '</div>' +
                  '<div class="m_modal_body" ' +
                    'v-bind:class="_bodyClass"><slot name="body"></slot>' +
                  '</div>' +
                '</div>' +
                '<div class="m_modal_header" v-if="isHeader && isFavorite">' +
	                '<div class="m_modal_header_inner">' +
	                  '<p class="m_modal_header_ttl"><slot name="header"></slot></p>' +
	                  '<slot name="header_txt"></slot>' +
	                '</div>' +
	              '</div>' +
	              '<div class="m_modal_body" ' +
	                'v-bind:class="_bodyClass" v-if="isFavorite"><slot name="body"></slot>' +
	              '</div>' +
                '<div class="m_modal_footer" v-if="isFooter">' +
                  '<slot name="footer">' +
                    '<p class="m_modal_btnWrap">' +
                      '<a href="#" class="m_modal_btn m_btn m_btn__color2 m_btn__block js_modal_close" ' +
                        'v-on:click.prevent>' +
                        '<span><span>閉じる</span></span>' +
                      '</a>' +
                    '</p>' +
                  '</slot>' +
                '</div>' +
              '</div>',
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      isHeader: {
        type: Boolean,
        default: true
      },
      isFooter: {
        type: Boolean,
        default: true
      },
      isFavorite: {
          type: Boolean,
          default: false
      },
      overlayClass: {
        type: String,
        default: 'm_modalBg'
      },
      bodyClass: {
        type: String,
        default: ''
      },
      isBgClickHide: {
        type: Boolean,
        default: true
      },
      isMinheightBody: {
        type: Boolean,
        default: true
      },
      maxHeight: {
        type: Number
      }
    },

    data: function() {
      return {
        _isShow: false
      };
    },
    modalInstance: null,

    computed: {
      _bodyClass: function() {
        var c = {};

        if (this.bodyClass) {
          c[this.bodyClass] = true;
        }

        return c;
      }
    },

    watch: {
      isShow: function(val) {
        var method = val ? 'show' : 'hide';
        this[method]();
      }
    },

    mounted: function() {
      this._isShow = this.isShow;

      this.$nextTick(function() {
        this.init();
        if (this.isShow) {
          this.show();
        }
      });
    },

    // beforeDestroy: function() {
    //   // _ns.Modal destroy
    // },

    methods: {
      init: function() {
        if (typeof _ns.Modal !== 'function') {
          console.log('Modal constructor is not defined.');
        }
        var jQ_el = $(this.$el);

        var options = {
          $el     : jQ_el,
          isMoveEl: false,
          isBgClickHide: this.isBgClickHide,
          isMinheightBody: this.isMinheightBody,
          maxHeight: this.maxHeight
        };

        this.$options.modalInstance = new _ns.Modal(options);

        jQ_el.on('hideModal', function(e, eTarget) {
          this._isShow = false;
          this.emitHide(eTarget);
        }.bind(this));
      },
      show: function() {
        if (!this.$options.modalInstance) {
          this.init();
        }
        this._show();
      },
      _show: function() {
        if (this._isShow) return;

        this._isShow = true;
        this.$nextTick(function() {
          this.$options.modalInstance.show();
          this.$emit('show');
        });
      },
      hide: function() {
        var $o = this.$options;

        if (!$o.modalInstance || !this._isShow) return;

        this.$nextTick(function() {
          $o.modalInstance.hide();
        });
      },
      /**
       * @param   {object}   eTarget
       */
      emitHide: function(eTarget) {
        var param = {};
        var o = this.overlayClass;

        if (!!eTarget) {
          param.eTarget = eTarget;
          param.isOverlayClicked = !!eTarget.className
                                    ? eTarget.className.indexOf(o) > -1 : false;
        }

        this.$emit('hide', param);
      }
    }
  });



  Components.INPUT_RADIO = {
    template: '<div class="m_radio" ' +
                'v-bind:class="wrapClass" ' +
                'v-on:click="onClickWrap">' +
                '<input type="radio" ref="input" ' +
                  'v-bind:name="name || false" ' +
                  'v-bind:value="value" ' +
                  'v-bind:disabled="disabled" ' +
                  'v-bind:checked="checked" ' +
                  'v-on:change="updateValue($event.target.value)">' +
                '<label v-on:click.prevent="onLabelClick">' +
                  '<span class="m_radio_txtWrap">' +
                    '<span class="m_radio_txt" ' +
                      'v-if="title">{{ title }}</span>' +
                    '<slot></slot>' +
                  '</span>' +
                '</label>' +
              '</div>',
    model: {
      prop : 'checkedValue',
      event: 'change'
    },
    props: {
      checkedValue: {
        type: null,
        required: true,
        default: ''
      },
      value: {
        type: null,
        required: true,
        default: ''
      },
      name: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      },
      clickBubbles: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      wrapClass: function() {
        if (this.disabled) {
          return {'is_disabled': true};
        }
      },
      checked: function() {
        return this.checkedValue === this.value;
      }
    },
    methods: {
      updateValue: function(value) {
        value = (typeof value === 'undefined') ? this.value : value;
        this.$emit('change', value);
      },
      getId: function() {
        var r = Math.random() * 0x80000000 | 0;
        return 'id' + r;
      },
      onLabelClick: function() {
        if (this.disabled) return;

        this.updateValue();
      },
      onClickWrap: function(e) {
        if (this.disabled || !this.clickBubbles) {
          e.stopPropagation();
        }
      }
    }
  };

  Vue.component('input-radio', Components.INPUT_RADIO);

  // Vue.component('input-checkbox', {
  //   extends: Components.INPUT_RADIO,

  //   template: '<div class="m_checkbox" ' +
  //               'v-bind:class="wrapClass">' +
  //               '<input type="checkbox" ref="input" ' +
  //                 'v-bind:id="_id" ' +
  //                 'v-bind:name="name || false" ' +
  //                 'v-model="value" ' +
  //                 'v-bind:true-value="trueValue" ' +
  //                 'v-bind:false-value="falseValue" ' +
  //                 'v-bind:disabled="disabled" ' +
  //                 'v-bind:checked="checked" ' +
  //                 'v-on:change="updateValue($event.target.value)">' +
  //               '<label v-bind:for="_id">' +
  //                 '<span class="m_checkbox_txt" ' +
  //                   'v-if="title">{{ title }}</span>' +
  //                 '<slot></slot>' +
  //               '</label>' +
  //             '</div>',
  //   props: {
  //     trueValue: {
  //       type: null,
  //       default: true
  //     },
  //     falseValue: {
  //       type: null,
  //       default: false
  //     }
  //   }
  // });


  /**
   * input[type=number]
   * PCの場合はinput[type=text]になる（許容は数字のみ）
   */
  Vue.component('input-number', {
    template: '<input ref="input" ' +
                'v-model.lazy="value" ' +
                'v-bind:type="_type" ' +
                'v-on:focus="$emit(\'focus\')" ' +
                'v-on:blur="onBlur" ' +
                'v-on:keydown.enter="onEnter">',
    props: {
      type: {
        type: String,
        default: 'text'
      },
      value: {
        type: Number,
        default: ''
      },

      // 小数点を受け入れるか
      acceptFloat: {
        type: Boolean,
        default: false
      },
      // Enterでsubmitさせない
      disabledEnterSubmit: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      _type: function() {
        return this.acceptFloat ? 'text' : this.type
      }
    },
    watch: {
      value: function(val, oldVal) {
        // カンマを削除＆全角数字がある場合は、半角数字に変換
        var castVal = this.castNumber( this.removeComma(val) );

        // 不正値の場合、前の値に戻す
        if (false === castVal) {
          this.$emit('error', 'string');
          this.value = oldVal;
          return;
        }

        // 小数点を受け入れない場合は、切り捨て
        if (!this.acceptFloat) {
          castVal = this.castInt(castVal);
        }

        this.value = castVal;
        this.$emit('change', castVal);
      }
    },
    methods: {
      /**
       * @param   {*}   val
       * @return  {*}
       */
      removeComma: function(val) {
        if (typeof val !== 'string') {
          return val;
        }

        return val.replace(/\,/g, '');
      },
      /**
       * @param   {*}   val
       * @return  {number|empty string|false}
       */
      castNumber: function(val) {
        if ('' === val) return val;

        var _str = '' + val;
        var regexp, num;
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
          '９': 9
        };
        for(var key in casts) {
          regexp = new RegExp(key, 'g');
          _str = _str.replace(regexp, casts[key]);
        }
        num = _str - 0;
        if(!Number.isNaN(num)) {
          return num;
        } else {
          return false;
        }
      },
      /**
       * @param   {number}   val
       * @return  {number}
       */
      castInt: function(val) {
        if ( (val+'').match(/^-?[0-9]+\.[0-9]+$/) ) {
          return Math.floor(val);
        } else {
          return !Number.isNaN(val - 0) ? val : false;
        }
      },
      // @param   {object}  e - event
      onEnter: function(e) {
        if (this.disabledEnterSubmit) {
          e.preventDefault();
          this.$el.blur();
        }
      },
      onBlur: function() {
        this.value = this.$el.value;
        this.$nextTick(function() {
          this.$emit('blur');
        });
      },
      focus: function() {
        var el = this.$refs.input;

        if (!!el) {
          el.focus();
        }
      }
    }
  });


  Vue.component('button-lottery', {
    template: '<button class="m_btn" ' +
                'v-bind:type="type" ' +
                'v-bind:disabled="disabled" ' +
                'v-bind:class="buttonClass" ' +
                'v-on:click="$emit(\'click\', $event)">' +
                '<span><span><slot></slot></span></span>' +
              '</button>',
    props: {
      type: {
        type: String,
        default: 'button'
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      buttonClass: function() {
        if (this.disabled) {
          return {'is_disabled': true};
        }
      }
    },
  });


  /**
   * テキストが数字のボタン
   */
  Components.BUTTON_NUMBER = {
    template: '<button type="button" ' +
                // 'v-bind:disabled="disabled" ' +
                'v-bind:class="buttonClass" ' +
                'v-on:click.prevent="onClick">{{ value }}</button>',
    props: {
      value: {
        type: Number,
        required: true,
        default: 0
      },
      disabled: {
        type: Boolean,
        default: false
      },
    },
    computed: {
      buttonClass: function() {
        if (this.disabled) {
          return {'is_disabled': true};
        }
      }
    },
    methods: {
      onClick: function() {
        if (!this.disabled) {
          this.$emit('click', this.value);
        }
      }
    }
  };

  // テキストが数字のボタン(touchstart版)
  Components.BUTTON_NUMBER_TOUCH = {
    extends: Components.BUTTON_NUMBER,

    data: function() {
      return {
        isTouchDevice: this.getIsTouchDevice()
      };
    },
    template: '<button type="button" ' +
                'v-bind:disabled="disabled" ' +
                'v-bind:class="buttonClass" ' +
                'v-on:touchstart="onTouchStart" ' +
                'v-on:click.prevent="onClick" >{{ value }}</button>',
    methods: {
      onTouchStart: function() {
        if (!this.disabled) {
          this.$emit('click', this.value);
        }
      },
      onClick: function() {
        if (this.isTouchDevice || this.disabled) return;

        this.$emit('click', this.value);
      }
    }
  };

  /**
   * 絵札のボタン
   */
  Components.BUTTON_CARD = {
    template: '<button type="button" ' +
                // 'v-bind:disabled="disabled" ' +
                'v-bind:class="buttonClass" ' +
                'v-on:click.prevent="onClick">' +
                  '<img v-bind:src="cards[value].src" v-bind:alt="cards[value].alt" width="30">' +
                '</button>',
    props: {
      value: {
        type: Number,
        required: true,
        default: 0
      },
      disabled: {
        type: Boolean,
        default: false
      },
    },
    data: function() {
      return {
        cards: {
          0 : { id:0, src:'', alt:'-' },
          1 : { id:1, src:'/assets/img/ec/pic-kisekae-input001.svg', alt:'リンゴ' },
          2 : { id:2, src:'/assets/img/ec/pic-kisekae-input002.svg', alt:'ミカン' },
          3 : { id:3, src:'/assets/img/ec/pic-kisekae-input003.svg', alt:'メロン' },
          4 : { id:4, src:'/assets/img/ec/pic-kisekae-input004.svg', alt:'ブドウ' },
          5 : { id:5, src:'/assets/img/ec/pic-kisekae-input005.svg', alt:'モモ' }
        }
      };
    },
    computed: {
      buttonClass: function() {
        if (this.disabled) {
          return {'is_disabled': true};
        }
      }
    },
    methods: {
      onClick: function() {
        if (!this.disabled) {
          this.$emit('click', this.value);
        }
      }
    }
  };


  /**
   * 数字ラベル
   */
  Vue.component('label-number', {
    template: '<span v-bind:class="labelClass" class="m_labelNum"><slot></slot></span>',
    props: {
      type: {
        type: String,
        default: '' //''|myself|favorite|random|noSelect
      },
      shape: {
        type: String,
        default: 'circle' //circle|square
      }
    },
    computed: {
      labelClass: function() {
        return {
          'm_labelNum__myself'  : 'myself' === this.type,
          'm_labelNum__favorite': 'favorite' === this.type,
          'm_labelNum__random'  : 'random' === this.type,
          'm_labelNum__noselect': 'noSelect' === this.type,
          'm_labelNum__square'  : 'square' === this.shape,
        };
      }
    }
  });

  /**
   * 数字のセレクトボックス
   */
  Vue.component('select-number', {
    template: '<span class="m_select">' +
                '<select ' +
                  'v-model.number="selected" ' +
                  'v-bind:name="name" ' +
                  'v-bind:id="id">' +
                  '<slot></slot>' +
                  '<option ' +
                    'v-for="optionValue in options" ' +
                    'v-bind:value="optionValue">{{ optionValue }}</option>' +
                '</select>' +
              '</span>',
    props: {
      selected: {
        type: Number
      },
      name: {
        type: String
      },
      id: {
        type: String
      },
      first: {
        type: Number,
        default: 1
      },
      last: {
        type: Number,
        default: 99
      }
    },
    computed: {
      options: function() {
        var options = [];

        // first, last 不正値
        if (this.last < this.first) return options;

        for (var i = 0, j = this.first; j <= this.last; ++i, ++j) {
          options[i] = j;
        }

        return options;
      }
    },
    watch: {
      selected: function(val) {
        this.$emit('change', val);
      }
    },
  });

  /**
   * 絵札ラベル
   */
  Vue.component('label-card', {
    template: '<span v-bind:class="labelClass" class="m_labelCard"><slot></slot></span>',
    props: {
      type: {
        type: String,
        default: '' //''|myself|favorite|random|noSelect
      },
      shape: {
        type: String,
        default: 'circle' //circle|square
      }
    },
    computed: {
      labelClass: function() {
        return {
          'm_labelNum__myself'  : 'myself' === this.type,
          'm_labelNum__favorite': 'favorite' === this.type,
          'm_labelNum__random'  : 'random' === this.type,
          'm_labelNum__noselect': 'noSelect' === this.type,
          'm_labelNum__square'  : 'square' === this.shape,
        };
      }
    }
  });

  // プラスボタン
  Vue.component('button-plus', {
    template: '<button type="button" class="m_lotteryBtn m_lotteryBtn__plus" ' +
                'v-bind:disabled="disabled" ' +
                'v-bind:class="btnClass" ' +
                'v-on:touchstart.prevent="onClick" ' +
                'v-on:touchend.prevent ' +
                'v-on:click.prevent="onClick">' +
                'プラス' +
              '</button>',
    props: {
      count: {
        type: Number,
        default: 1
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      btnClass: function() {
        return {
          'is_disabled': this.disabled
        };
      }
    },
    methods: {
      /**
       * @param   {object}   event
       */
      onClick: function(event) {
        this.$emit('click', this.count, event);
      }
    }
  });

  // マイナスボタン
  Vue.component('button-minus', {
    template: '<button type="button" class="m_lotteryBtn m_lotteryBtn__minus" ' +
                'v-bind:disabled="disabled" ' +
                'v-bind:class="btnClass" ' +
                'v-on:touchstart.prevent="onClick" ' +
                'v-on:touchend.prevent ' +
                'v-on:click.prevent="onClick">' +
                'マイナス' +
              '</button>',
    props: {
      count: {
        type: Number,
        default: 1
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      btnClass: function() {
        return {
          'is_disabled': this.disabled
        };
      }
    },
    methods: {
      /**
       * @param   {object}   event
       */
      onClick: function(event) {
        this.$emit('click', -this.count, event);
      }
    }
  });


  Mixins.INCREMENTER = {
    props: {
      count: {
        type: Number,
        default: 0
      },
      minCount: {
        type: Number,
        default: 0
      },
      maxCount: {
        type: Number
      },
      minValidCount: {
        type: Number,
        default: 1
      },
      maxValidCount: {
        type: Number
      },
      plusMinusCount: {
        type: Number,
        default: 1
      },
      name: {
        type: String
      },
      id: {
        type: String
      },
      readonly: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: 'text'
      }
    },
  };

  /**
   * 製品購入タイプ専用インクリメンター
   * SP表示の際、プラスマイナスボタンでinput[value]が操作できる
   */
  Components.PURCHASE_INCREMENTER = {
    template: '<div class="m_lotteryNormalForm">' +
                '<div class="m_lotteryNormalForm_item">' +
                  '<button-minus ' +
                    'v-bind:count="plusMinusCount" ' +
                    'v-bind:disabled="readonly || disabled || isMin" ' +
                    'v-on:click="onClickBtn">' +
                  '</button-minus>' +
                '</div>' +
                '<div class="m_lotteryNormalForm_item2">' +
                  '<input-number ref="input" ' +
                    'v-bind:id="id" ' +
                    'v-bind:name="name" ' +
                    'v-bind:readonly="readonly" ' +
                    'v-bind:disabled="disabled" ' +
                    'v-bind:value="count" ' +
                    'v-bind:class="inputClass" ' +
                    'v-bind:disabled-enter-submit="true" ' +
                    'v-bind:type="type" ' +
                    'v-on:error="onError" ' +
                    'v-on:change="onChangeInput" ' +
                    'v-on:focus="onFocus" ' +
                    'v-on:blur="onBlur" class="inputNumVal"></input-number>' +
                  '<slot name="unit"></slot>' +
                '</div>' +
                '<div class="m_lotteryNormalForm_item">' +
                  '<button-plus ' +
                    'v-bind:count="plusMinusCount" ' +
                    'v-bind:disabled="readonly || disabled || isMax" ' +
                    'v-on:click="onClickBtn">' +
                  '</button-plus>' +
                '</div>' +
              '</div>',
    mixins: [Mixins.INCREMENTER],

    data: function() {
      return {
        isFocus: false
      };
    },
    computed: {
      inputClass: function() {
        return {
          'u_colorPlaceholder': !this.isFocus && (this.count < this.minCount)
        };
      },
      isMin: function() {
        return this.count <= this.minCount;
      },
      isMax: function() {
        return this.count >= this.maxCount;
      }
    },
    watch: {
      /**
       * @param   {number}   val
       */
      count: function(val) {
        if ('' === val) {
          // 空白
          this.$emit('error', 'empty');
          if (!this.isFocus) {
          this.count = this.minCount;
          }

        } else if ( this.isMinUnder(val) ) {
          // 最小値未満
          this.$emit('error', 'underMin');
          this.count = this.minCount;

        } else if ( this.isMaxOver(val) ) {
          // 最大値超
          this.$emit('error', 'overMax');
          this.count = this.minCount;
        }

        this.$emit('change', this.count - 0);
      }
    },
    methods: {
      // @param   {number}   val
      onClickBtn: function(val) {
        if ( this.validate(this.count + val) ) {
          this.count += val;
        }
      },

      // @param   {string}   errorType
      onError: function(errorType) {
        this.$emit('error', errorType);
      },

      // @param   {number}   val
      onChangeInput: function(val) {
        this.count = val;
      },

      onFocus: function() {
        this.isFocus = true;

        if (this.isMin) {
          this.count = '';
        }
      },
      onBlur: function() {
        this.isFocus = false;

        if (this.count === '') {
          this.$nextTick(function() {
            this.count = this.minCount;
          });
        }
      },

      /**
       * 最小値未満か
       * @param   {number}   val
       * @return  {bool}
       */
      isMinUnder: function(val) {
        return val < this.minCount;
      },

      /**
       * 最大値超か
       * @param   {number}   val
       * @return  {bool}
       */
      isMaxOver: function(val) {
        return !!this.maxCount && (val > this.maxCount);
      },

      /**
       * バリデート（最小・最大値チェック）
       * @param   {number}   val
       * @return  {bool}
       */
      validate: function(val) {
        if ( this.isMinUnder(val) ) {
          return false;

        } else if ( this.isMaxOver(val) ) {
          return false;

        } else {
          return true;
        }
      },

      focusInput: function() {
        var el = this.$refs.input;

        if (!!el) {
          el.focus();
        }
      }

    }
  };


  // 確認系で使うモーダル
  Vue.component('modal-confirm', {
    template: '<modal ' +
                'v-bind:is-show="isShow" ' +
                'v-bind:is-header="isHeader" ' +
                // 'v-on:show="$emit(\'show\', $event)" ' +
                'v-on:hide="$emit(\'hide\', $event)">' +
                '<template slot="header" ' +
                  'v-if="isHeader">{{ header }}</template>' +
                '<template slot="body"><slot name="body"></slot></template>' +
                '<template slot="footer">' +
                  '<slot name="footer">' +
                    '<ul class="m_modal_btnWrap2">' +
                      '<li>' +
                        '<button-lottery class="m_modal_btn m_btn__color2 m_btn__block" ' +
                          'v-on:click="$emit(\'hide\')">' +
                          '{{ cancelBtnText }}' +
                        '</button-lottery>' +
                      '</li>' +
                      '<li>' +
                        '<button-lottery class="m_modal_btn m_btn__block" ' +
                          'v-on:click="$emit(\'click\', \'success\')">' +
                          '{{ continueBtnText }}' +
                        '</button-lottery>' +
                      '</li>' +
                    '</ul>' +
                  '</slot>' +
                '</template>' +
              '</modal>',
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      header: {
        type: String,
        default: ''
      },
      cancelBtnText: {
        type: String,
        default: 'キャンセル'
      },
      continueBtnText: {
        type: String,
        default: '実行する'
      }
    },
    computed: {
      isHeader: function() {
        return !!this.header;
      },
    },
  });


  Components.FORM_CHECK_LIST_RADIO_LI = {
    template: '<li v-bind:class="liClass">' +
                '<div class="m_formCheckList_inner" ' +
                  'v-on:click="onClickLi">' +
                  '<input-radio ' +
                    'v-model="selected" ' +
                    'v-bind:checked-value="selected" ' +
                    'v-bind:value="item.value" ' +
                    'v-bind:name="item.name" ' +
                    'v-bind:title="item.title" ' +
                    'v-bind:disabled="item.disabled" ' +
                    'v-bind:click-bubbles="false" ' +
                    'v-on:change="$emit(\'change\', $event)">' +
                    '<slot name="labelText"></slot>' +
                  '</input-radio>' +
                '</div>' +
              '</li>',
    props: {
      selected: {
        type: null,
        default: ''
      },
      item: {
        type: Object,
        default: function() {
          /**
           * @prop   {string}   title
           * @prop   {*}        value
           * @prop   {*}        name
           * @prop   {string}   class
           * @prop   {string}   colset
           * @prop   {bool}     isCol
           * @prop   {bool}     disabled
           */
          return {};
        }
      }
    },
    computed: {
      liClass: function() {
        var c = {is_checked: this.selected === this.item.value};

        if (!!this.item.class) {
          c[this.item.class] = true;
        }
        return c;
      },
    },
    methods: {
      onClickLi: function() {
        if (!this.item.disabled) {
          this.$emit('change', this.item.value);
        }
      }
    }
  };

  Components.FORM_CHECK_LIST_RADIO_LI_TYPE2 = {
    extends: Components.FORM_CHECK_LIST_RADIO_LI,

    template: '<li v-bind:class="liClass">' +
                '<div class="m_formCheckList_inner" ' +
                  'v-on:click="onClickLi">' +
                  '<div v-bind:class="colsetWrapClass">' +
                    '<div v-bind:class="colClass">' +
                      '<input-radio ' +
                        'v-model="selected" ' +
                        'v-bind:checked-value="selected" ' +
                        'v-bind:value="item.value" ' +
                        'v-bind:name="item.name" ' +
                        'v-bind:title="item.title" ' +
                        'v-bind:disabled="item.disabled" ' +
                        'v-bind:click-bubbles="false" ' +
                        'v-on:change="$emit(\'change\', $event)">' +
                        '<slot name="labelText"></slot>' +
                      '</input-radio>' +
                    '</div>' +
                    '<div v-bind:class="col2Class">' +
                      '<slot name="colHTML"></slot>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</li>',
    computed: {
      colsetClassName: function() {
        return 'm_formCheckList_' + (this.item.colset || 'colset');
      },
      colsetWrapClass: function() {
        var c = {};

        c[this.colsetClassName] = true;

        return c;
      },
      colClass: function() {
        var c = {};

        c[this.colsetClassName + '_col'] = true;

        return c;
      },
      col2Class: function() {
        var c = {};

        c[this.colsetClassName + '_col2'] = true;

        return c;
      }
    }
  };

  Components.FORM_CHECK_LIST_RADIO_LI_TYPE3 = {
    extends: Components.FORM_CHECK_LIST_RADIO_LI,

    components: {
      'input-radio-type2': {
        extends: Components.INPUT_RADIO,

        template: '<div class="m_radio" ' +
                    'v-bind:class="wrapClass" ' +
                    'v-on:click="onClickWrap">' +
                    '<input type="radio" ref="input" ' +
                      'v-bind:name="name || false" ' +
                      'v-bind:value="value" ' +
                      'v-bind:disabled="disabled" ' +
                      'v-bind:checked="checked" ' +
                      'v-on:change="updateValue($event.target.value)">' +
                    '<label v-on:click.prevent="onLabelClick">' +
                      '<span class="m_radio_txt m_radio_txt__type2" ' +
                        'v-if="title">{{ title }}</span>' +
                      '<slot></slot>' +
                    '</label>' +
                  '</div>',
      }
    },
    template: '<li class="m_formCheckList_halfPc" ' +
                'v-bind:class="liClass">' +
                '<div class="m_formCheckList_inner m_formCheckList_inner__type2" ' +
                  'v-on:click="onClickLi">' +
                  '<input-radio-type2 class="m_radio__type2" ' +
                    'v-model="selected" ' +
                    'v-bind:checked-value="selected" ' +
                    'v-bind:value="item.value" ' +
                    'v-bind:name="item.name" ' +
                    'v-bind:title="item.title" ' +
                    'v-bind:disabled="item.disabled" ' +
                    'v-bind:click-bubbles="false" ' +
                    'v-on:change="$emit(\'change\', $event)">' +
                    '<slot name="labelText"></slot>' +
                  '</input-radio-type2>' +
                '</div>' +
              '</li>',
  };

  /**
   * ラジオボタンリスト
   */
  Components.FORM_CHECK_LIST_RADIO = {
    template: '<ul class="m_formCheckList">' +
                '<li ' +
                  'v-bind:is="getCurrentComponent(item)" ' +
                  'v-for="(item, i) in items" ' +
                  'v-bind:key="i" ' +
                  'v-bind:selected="selected" ' +
                  'v-bind:item="item" ' +
                  'v-on:change="onChange">' +
                  '<template slot="labelText"><slot v-bind:name=" \'labelText_\' + item.value "></slot></template>' +
                  '<template slot="colHTML"><slot v-bind:name=" \'colHTML_\' + item.value "></slot></template>' +
                '</li>' +
              '</ul>',
    components: {
      'li-item': Components.FORM_CHECK_LIST_RADIO_LI,
      'li-item-col': Components.FORM_CHECK_LIST_RADIO_LI_TYPE2,
      'li-item-half-pc': Components.FORM_CHECK_LIST_RADIO_LI_TYPE3,
    },
    props: {
      uiType: {
        type: String,
        default: 'default'
      },
      selected: {
        type: null,
        default: ''
      },
      items: {
        type: Array, //array<object>
        default: function() {
          return [];
        }
      },
    },
    methods: {
      /**
       * @param   {object}   item
       */
      getCurrentComponent: function(item) {
        item = item || {};

        if ('halfPc' === this.uiType) {
          return 'li-item-half-pc';

        } else if (!!item.colset) {
          return 'li-item-col';

        } else {
          return 'li-item';
        }
      },

      /**
       * @param   {*}   val
       */
      onChange: function(val) {
        this.selected = val;
        this.$emit('change', val);
      }
    }
  };



  // カート状態
  Components.PURCHASE_STATE = {
    template: '<div class="m_infoPrice">' +
                '<div class="m_infoPrice_item">' +
                  '<div class="m_infoPrice_item_row">' +
                    '<dl v-if="price > -1" class="m_infoPrice_param m_param">' +
                      '<dt>1{{ unit }}</dt> ' +
                      '<dd>{{ price | number_format }}円</dd>' +
                    '</dl>' +
                    '<dl class="m_infoPrice_param m_infoPrice_param__type2 m_param">' +
                      '<dt>購入{{ unit }}数</dt> ' +
                      '<dd>{{ totalCount | number_format }}{{ unit }}</dd>' +
                    '</dl>' +
                  '</div>' +
                  '<slot name="sub_txt"></slot>' +
                  '<div class="m_infoPrice_item_row">' +
                    '<dl class="m_infoPrice_total">' +
                      '<dt>合計</dt> ' +
                      '<dd>' +
                        '<span class="m_infoPrice_total_num">{{ totalPrice | number_format }}</span>' +
                        '<span class="m_infoPrice_total_unit">円</span>' +
                      '</dd>' +
                    '</dl>' +
                  '</div>' +
                '<!-- /.m_infoPrice_item --></div>' +
                '<div class="m_infoPrice_item2">' +
                  '<p class="m_infoPrice_btnWrap">' +
                    '<button-lottery type="submit" class="m_infoPrice_btn m_btn__block" ' +
                      'v-bind:disabled="disabled || !canPurchase">' +
                      '<slot name="btn_txt">カートに入れる</slot>' +
                    '</button-lottery>' +
                  '</p>' +
                '<!-- /.m_infoPrice_item2 --></div>' +
              '</div>',
      props: {
        price: {
          type: Number,
          default: -1
        },
        unit: {
          type: String,
          default: '枚'
        },
        totalCount: {
          type: Number,
          default: 0
        },
        totalPrice: {
          type: Number,
          default: 0
        },
        disabled: {
          type: Boolean,
          default: false
        }
      },
      computed: {
        canPurchase: function() {
          return this.totalPrice > 0;
        },
      }
  };


  // カートエラーモーダル
  Components.MODAL_PURCHASE_ERROR = {
    template: '<modal ' +
                'v-bind:is-show="isShow" ' +
                'v-on:show="$emit(\'show\', $event)" ' +
                'v-on:hide="$emit(\'hide\', $event)">' +
                '<template slot="header">カートエラー</template>' +
                '<template slot="body">' +
                  '<p class="m_sttl2 u_colorAlert" ' +
                    'v-if="errorText">' +
                    'エラー原因<br>{{ errorText }}' +
                  '</p>' +
                  '<slot name="body"></slot>' +
                '</template>' +
                '<template slot="footer">' +
                  '<slot name="footer">' +
                    '<p class="m_modal_btnWrap">' +
                      '<a href="javascript:;" class="m_modal_btn m_btn m_btn__color2 m_btn__block js_modal_close">' +
                        '<span>入力画面に戻る</span>' +
                      '</a>' +
                    '</p>' +
                  '</slot>' +
                '</template>' +
              '</modal>',
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      errorText: {
        type: String,
        default: ''
      }
    }
  };


  // モーダル
  Components.MODAL_PURCHASE_ERRORS = {
    template: '<div>' +
                // 購入限度額
                '<modal-purchase-error error-text="購入限度額　上限超過" ' +
                  'v-bind:is-show="isLimitMonthly" ' +
                  'v-on:hide="hide">' +
                  '<template slot="body">' +
                    '<p>' +
                      'お客さまが1ヶ月に購入できる購入限度額を超えています。<br>' +
                      '恐れ入りますが、購入金額を調整してください。' +
                    '</p>' +
                    '<ul class="m_list m_list__attention m_list__sizeS">' +
                      '<li>お客さまの今月の購入可能額は画面右上の[マイページ]を押して表示される吹き出しから確認できます。</li>' +
                    '</ul>' +
                  '</template>' +
                  '<template slot="footer">' +
                    '<ul class="m_modal_btnWrap2 m_modal_btnWrap2__type2">' +
                      '<li>' +
                        '<a href="javascript:;" class="m_modal_btn m_btn m_btn__color2 m_btn__block js_modal_close"><span>購入入力へ</span></a>' +
                      '</li>' +
                      '<li>' +
                        '<a href="/mypage/setting/limit/" class="m_modal_btn m_btn m_btn__block"><span>購入限度額を確認する</span></a>' +
                      '</li>' +
                    '</ul>' +
                  '</template>' +
                '</modal-purchase-error>' +
                // カート決済限度額
                '<modal-purchase-error error-text="カート決済額　上限超過" ' +
                  'v-bind:is-show="isLimitOnce" ' +
                  'v-on:hide="hide">' +
                  '<template slot="body">' +
                    '<p>' +
                      '一度のご購入で決済できる金額は最大{{ purchaseOnce.limit | number_format }}円までとなります。<br>' +
                      'お客さまはすでに{{ purchaseOnce.used | number_format }}円分の商品を選択済みですので、' +
                      'あと{{ purchaseOnce.limit - purchaseOnce.used | number_format}}円分しか選択できません。' +
                    '</p>' +
                    '<p>恐れ入りますが、入力画面に戻って購入金額を調整してください。</p>' +
                  '</template>' +
                '</modal-purchase-error>' +
                // 数選組み合わせ数限度数
                '<modal-purchase-error error-text="数字選択式くじの組み合わせ数　上限超過" ' +
                  'v-bind:is-show="isLimitNsItemCount" ' +
                  'v-on:hide="hide">' +
                  '<template slot="body">' +
                    '<p>' +
                      '一度のご購入で選択可能な数字選択式くじの組み合わせは{{ purchaseNsItemCount.limit | number_format }}個までとなります。<br>' +
                      'お客さまのカートにはすでに{{ purchaseNsItemCount.used | number_format }}個の数字選択式くじが選択されていますので、' +
                      'あと{{ purchaseNsItemCount.limit - purchaseNsItemCount.used | number_format}}個しか選択することができません。' +
                    '</p>' +
                    '<p>恐れ入りますが、入力画面に戻って組合せの数を調整してください。</p>' +
                  '</template>' +
                '</modal-purchase-error>' +
              '</div>',
    components: {
      'modal-purchase-error': Components.MODAL_PURCHASE_ERROR
    },

    props: {
      purchaseError: {
        type: String,
        default: '' //limitMonthly|limitOnce|limitNsItemCount|{empty string}
      }
    },
    computed: {
      purchaseMonthly: function() {
        return this.$store.getters.purchaseMonthly || {limit: 0, used: 0};
      },
      purchaseOnce: function() {
        return this.$store.getters.purchaseOnce || {limit: 0, used: 0};
      },
      purchaseNsItemCount: function() {
        return this.$store.getters.purchaseNsItemCount || {limit: 0, used: 0};
      },
      isLimitMonthly: function() {
        return 'limitMonthly' === this.purchaseError;
      },
      isLimitOnce: function() {
        return 'limitOnce' === this.purchaseError;
      },
      isLimitNsItemCount: function() {
        return 'limitNsItemCount' === this.purchaseError;
      },
    },
    watch: {
      isLimitMonthly: function(isShow) {
        if (!isShow) {
          this.emitVmApp('HIDE_MODAL_PURCHASE_ERROR', 'limitMonthly');
        }
      },
      isLimitOnce: function(isShow) {
        if (!isShow) {
          this.emitVmApp('HIDE_MODAL_PURCHASE_ERROR', 'limitOnce');
        }
      },
      isLimitNsItemCount: function(isShow) {
        if (!isShow) {
          this.emitVmApp('HIDE_MODAL_PURCHASE_ERROR', 'limitNsItemCount');
        }
      },
    },
    mounted: function() {
      if (!this.$store || !this.$store.getters.purchaseMonthly) {
//        console.log('$store purchase module is not defined.');
      }
    },
    methods: {
      hide: function() {
        this.purchaseError = '';
        this.$emit('hide');
      }
    }
  };


  // くじ製品情報
  Components.THUMBSET = {
    template: '<div class="m_thumbSet">' +
                '<div class="m_thumbSet_thumb" ' +
                  'v-if="thumbPath">' +
                  '<img v-bind:src="thumbPath" v-bind:alt="alt" v-bind:width="width" v-bind:height="height" class="u_spHide">' +
                  '<img v-bind:src="thumbPathSp" v-bind:alt="altSp" v-bind:width="widthSp" v-bind:height="heightSp" class="u_pcHide">' +
                '</div>' +
                '<div class="m_thumbSet_item">' +
                  '<p class="m_thumbSet_row" ' +
                    'v-if="subTitle">{{ subTitle }}</p>' +
                  '<p class="m_thumbSet_ttl">{{ title }}</p>' +
                  '<dl class="m_param m_thumbSet_row" ' +
                    'v-if="salePeriod">' +
                    '<dt>発売期間</dt> ' +
                    '<dd>{{ salePeriod }}</dd>' +
                  '</dl>' +
                  '<dl class="m_param m_thumbSet_row" ' +
                    'v-if="lotteryDay">' +
                    '<dt>抽せん日</dt> ' +
                    '<dd>{{ lotteryDay }}</dd>' +
                  '</dl>' +
                  '<dl class="m_param m_thumbSet_row">' +
                    '<dt>1{{ unit }}</dt> ' +
                    '<dd>{{ price | number_format }}円</dd>' +
                  '</dl>' +
                  '<slot></slot>' +
              '</div>',
    props: {
      thumbPath: {
        type: String
      },
      width: {
        type: Number,
        default: 80
      },
      height: {
        type: Number,
        default: 80
      },
      thumbPathSp: {
        type: String
      },
      widthSp: {
        type: Number,
        default: 80
      },
      heightSp: {
        type: Number,
        default: 80
      },
      subTitle: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      },
      price: {
        type: Number,
        default: 0
      },
      salePeriod: {
        type: String
      },
      lotteryDay: {
        type: String
      },
      alt: {
        type: String
      },
      altSp: {
        type: String
      },
	  unit: {
	    type: String,
	    default: '枚'
      }
    },
  };

  // くじ製品情報
  Components.MODALTHUMBSET = {
    template: '<div class="m_thumbSet">' +
                '<div class="m_thumbSet_thumb" ' +
                  'v-if="thumbPath">' +
                  '<img v-bind:src="thumbPath" v-bind:alt="alt" v-bind:width="width" v-bind:height="height" class="u_spHide">' +
                  '<img v-bind:src="thumbPathSp" v-bind:alt="altSp" v-bind:width="widthSp" v-bind:height="heightSp" class="u_pcHide">' +
                '</div>' +
                '<div class="m_thumbSet_item">' +
                  '<p class="m_thumbSet_row" ' +
                    'v-if="subTitle">{{ subTitle }}</p>' +
                  '<p class="m_thumbSet_ttl">{{ title }}</p>' +
                  '<dl class="m_param m_thumbSet_row" ' +
                    'v-if="lotteryDay">' +
                    '<dt>抽せん日</dt> ' +
                    '<dd>{{ lotteryDay }}</dd>' +
                  '</dl>' +
                  '<slot></slot>' + 
              '</div>' ,
    props: {
      thumbPath: {
        type: String
      },
      width: {
        type: Number,
        default: 80
      },
      height: {
        type: Number,
        default: 80
      },
      thumbPathSp: {
        type: String
      },
      widthSp: {
        type: Number,
        default: 80
      },
      heightSp: {
        type: Number,
        default: 80
      },
      subTitle: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      },
      salePeriod: {
        type: String
      },
      lotteryDay: {
        type: String
      },
      alt: {
        type: String
      },
      altSp: {
        type: String
      }
    },
  };

  // 数字ラベル
  Components.LOTTERY_LABEL_NUMBERS = {
    template: '<div>' +
                '<template ' +
                  'v-for="item in _items">' +
                  '<label-number ' +
                    'v-bind:class="_labelClass" ' +
                    'v-bind:shape="shape" ' +
                    'v-bind:type="item.selectType">{{ item.value }}</label-number>' +
                  '&nbsp;' +
                '</template>' +
              '</div>',
    props: {
      items: {
        type: Array, //{array<object>}
        required: true,
        default: function() {
          return [];
        }
      },
      sort: {
        type: String,
        default: '' //asc|desc|''
      },
      defaultLength: {
        type: Number,
        default: 0
      },
      shape: {
        type: String,
        default: 'circle' //circle|square
      },
      labelClass: {
        type: String,
        default: ''
      },
      emptyValue: {
        type: String,
        default: ''
      }
    },
    computed: {
      _items: function() {
        var _items = _.cloneDeep(this.items);
        var len = _items.length;

        this.setEmtpyValue(_items);

        if (len < this.defaultLength) {
          this.pushEmptyItems(_items, this.defaultLength - len);
        }

        return this.getSortItems(_items);
      },
      _labelClass: function() {
        var c = {};

        if (!!this.labelClass) {
          c[this.labelClass] = true;
          return c;
        }
      },
    },
    methods: {
      /**
       * @param   {array<object>}   items
       */
      setEmtpyValue: function(items) {
        var emptyValue = this.emptyValue;

        if (!emptyValue) return;

        _.forEach(items, function(o) {
          if ( (typeof o.value === 'undefined') || ('' === o.value) ) {
            o.value = emptyValue;
          }
        });
      },

      /**
       * @param   {array}   items
       * @param   {number}  length
       */
      pushEmptyItems: function(items, length) {
        if (length < 1) return;

        for (var i = 0; i < length; ++i) {
          items.push(
            this.$store.getters.lotteryNumberFormat(this.emptyValue)
          );
        }
      },

      /**
       * @param   {array<object>}   items
       * @return  {array<object>}
       */
      getSortItems: function(items) {
        if ('asc' === this.sort) {
          // 昇順
          return _.sortBy(items, [function(o) {
            return ('' === o.value) ? 99999 : o.value;
          }]);

        } else if ('desc' === this.sort) {
          // 降順
          return _.sortBy(items, [function(o) {
            return o.value;
          }]).reverse();

        } else {
          // no sort
          return items;
        }
      }
    }
  };

  // ビンゴ５
  Components.LOTTERY_LABEL_FAV_BINGO = {
		    template: '<div>' +
		                '<div class="m_lotteryNum_row_bingo">' +
		                  '<label-number ' +
		                    'v-bind:class="_labelClass" ' +
		                    'v-bind:shape="shape" ' +
		                    'v-bind:type="_items[0].selectType">{{ _items[0].value }}</label-number>' +
		                  '<label-number ' +
		                    'v-bind:class="_labelClass" ' +
		                    'v-bind:shape="shape" ' +
		                    'v-bind:type="_items[1].selectType">{{ _items[1].value }}</label-number>' +
		                  '<label-number ' +
		                    'v-bind:class="_labelClass" ' +
		                    'v-bind:shape="shape" ' +
		                    'v-bind:type="_items[2].selectType">{{ _items[2].value }}</label-number>' +
		                  '<label-number ' +
		                    'v-bind:class="_labelClass" ' +
		                    'v-bind:shape="shape" ' +
		                    'v-bind:type="_items[3].selectType">{{ _items[3].value }}</label-number>' +
		                  '<span class="m_labelNum m_labelNumFree">FREE</span>' +
		                  '<label-number ' +
		                    'v-bind:class="_labelClass" ' +
		                    'v-bind:shape="shape" ' +
		                    'v-bind:type="_items[4].selectType">{{ _items[4].value }}</label-number>' +
		                  '<label-number ' +
		                    'v-bind:class="_labelClass" ' +
		                    'v-bind:shape="shape" ' +
		                    'v-bind:type="_items[5].selectType">{{ _items[5].value }}</label-number>' +
		                  '<label-number ' +
		                    'v-bind:class="_labelClass" ' +
		                    'v-bind:shape="shape" ' +
		                    'v-bind:type="_items[6].selectType">{{ _items[6].value }}</label-number>' +
		                  '<label-number ' +
		                    'v-bind:class="_labelClass" ' +
		                    'v-bind:shape="shape" ' +
		                    'v-bind:type="_items[7].selectType">{{ _items[7].value }}</label-number>' +
		                '</div>' +
		              '</div>',
		    props: {
		      items: {
		        type: Array, //{array<object>}
		        required: true,
		        default: function() {
		          return [];
		        }
		      },
		      sort: {
		        type: String,
		        default: '' //asc|desc|''
		      },
		      defaultLength: {
		        type: Number,
		        default: 0
		      },
		      shape: {
		        type: String,
		        default: 'square' //circle|square
		      },
		      labelClass: {
		        type: String,
		        default: ''
		      },
		      emptyValue: {
		        type: String,
		        default: ''
		      }
		    },
		    computed: {
		      _items: function() {
		        var _items = _.cloneDeep(this.items);
		        var len = _items.length;

		        this.setEmtpyValue(_items);

		        if (len < this.defaultLength) {
		          this.pushEmptyItems(_items, this.defaultLength - len);
		        }

		        return this.getSortItems(_items);
		      },
		      _labelClass: function() {
		        var c = {};

		        if (!!this.labelClass) {
		          c[this.labelClass] = true;
		          return c;
		        }
		      },
		    },
		    methods: {
		      /**
		       * @param   {array<object>}   items
		       */
		      setEmtpyValue: function(items) {
		        var emptyValue = this.emptyValue;

		        if (!emptyValue) return;

		        _.forEach(items, function(o) {
		          if ( (typeof o.value === 'undefined') || ('' === o.value) ) {
		            o.value = emptyValue;
		          }
		        });
		      },

		      /**
		       * @param   {array}   items
		       * @param   {number}  length
		       */
		      pushEmptyItems: function(items, length) {
		        if (length < 1) return;

		        for (var i = 0; i < length; ++i) {
		          items.push(
		            this.$store.getters.lotteryNumberFormat(this.emptyValue)
		          );
		        }
		      },

		      /**
		       * @param   {array<object>}   items
		       * @return  {array<object>}
		       */
		      getSortItems: function(items) {
		        if ('asc' === this.sort) {
		          // 昇順
		          return _.sortBy(items, [function(o) {
		            return ('' === o.value) ? 99999 : o.value;
		          }]);

		        } else if ('desc' === this.sort) {
		          // 降順
		          return _.sortBy(items, [function(o) {
		            return o.value;
		          }]).reverse();

		        } else {
		          // no sort
		          return items;
		        }
		      }
		    }
		  };

		  // ビンゴ用数字ラベル
		  Components.LOTTERY_LABEL_BINGO = {
		    template: '<div class="m_lotteryNum_row_bingo">' +
		                '<label-number ' +
		                  'v-bind:class="_labelClass" ' +
		                  'v-bind:shape="shape" ' +
		                  'v-bind:type="_items[0].selectType">{{ _items[0].value }}</label-number>' +
		                '<label-number ' +
		                  'v-bind:class="_labelClass" ' +
		                  'v-bind:shape="shape" ' +
		                  'v-bind:type="_items[1].selectType">{{ _items[1].value }}</label-number>' +
		                '<label-number ' +
		                  'v-bind:class="_labelClass" ' +
		                  'v-bind:shape="shape" ' +
		                  'v-bind:type="_items[2].selectType">{{ _items[2].value }}</label-number>' +
		                '<label-number ' +
		                  'v-bind:class="_labelClass" ' +
		                  'v-bind:shape="shape" ' +
		                  'v-bind:type="_items[3].selectType">{{ _items[3].value }}</label-number>' +
		                '<span class="m_labelNum m_labelNumFree m_labelNum__square">FREE</span>' +
		                '<label-number ' +
		                  'v-bind:class="_labelClass" ' +
		                  'v-bind:shape="shape" ' +
		                  'v-bind:type="_items[4].selectType">{{ _items[4].value }}</label-number>' +
		                '<label-number ' +
		                  'v-bind:class="_labelClass" ' +
		                  'v-bind:shape="shape" ' +
		                  'v-bind:type="_items[5].selectType">{{ _items[5].value }}</label-number>' +
		                '<label-number ' +
		                  'v-bind:class="_labelClass" ' +
		                  'v-bind:shape="shape" ' +
		                  'v-bind:type="_items[6].selectType">{{ _items[6].value }}</label-number>' +
		                '<label-number ' +
		                  'v-bind:class="_labelClass" ' +
		                  'v-bind:shape="shape" ' +
		                  'v-bind:type="_items[7].selectType">{{ _items[7].value }}</label-number>' +
		              '</div>',
		    props: {
		      items: {
		        type: Array, //{array<object>}
		        required: true,
		        default: function() {
		          return [];
		        }
		      },
		      sort: {
		        type: String,
		        default: '' //asc|desc|''
		      },
		      defaultLength: {
		        type: Number,
		        default: 0
		      },
		      shape: {
		        type: String,
		        default: 'circle' //circle|square
		      },
		      labelClass: {
		        type: String,
		        default: ''
		      },
		      emptyValue: {
		        type: String,
		        default: ''
		      }
		    },
		    computed: {
		      _items: function() {
		        var _items = _.cloneDeep(this.items);
		        var len = _items.length;

		        this.setEmtpyValue(_items);

		        if (len < this.defaultLength) {
		          this.pushEmptyItems(_items, this.defaultLength - len);
		        }

		        return this.getSortItems(_items);
		      },
		      _labelClass: function() {
		        var c = {};

		        if (!!this.labelClass) {
		          c[this.labelClass] = true;
		          return c;
		        }
		      },
		    },
		    methods: {
		      /**
		       * @param   {array<object>}   items
		       */
		      setEmtpyValue: function(items) {
		        var emptyValue = this.emptyValue;

		        if (!emptyValue) return;

		        _.forEach(items, function(o) {
		          if ( (typeof o.value === 'undefined') || ('' === o.value) ) {
		            o.value = emptyValue;
		          }
		        });
		      },

		      /**
		       * @param   {array}   items
		       * @param   {number}  length
		       */
		      pushEmptyItems: function(items, length) {
		        if (length < 1) return;

		        for (var i = 0; i < length; ++i) {
		          items.push(
		            this.$store.getters.lotteryNumberFormat(this.emptyValue)
		          );
		        }
		      },

		      /**
		       * @param   {array<object>}   items
		       * @return  {array<object>}
		       */
		      getSortItems: function(items) {
		        if ('asc' === this.sort) {
		          // 昇順
		          return _.sortBy(items, [function(o) {
		            return ('' === o.value) ? 99999 : o.value;
		          }]);

		        } else if ('desc' === this.sort) {
		          // 降順
		          return _.sortBy(items, [function(o) {
		            return o.value;
		          }]).reverse();

		        } else {
		          // no sort
		          return items;
		        }
		      }
		    }
		  };

  // 絵札ラベル
  Components.LOTTERY_LABEL_CARDS = {
    template: '<div>' +
                '<template ' +
                  'v-for="item in _items">' +
                  '<label-card ' +
                    'v-bind:class="_labelClass" ' +
                    'v-bind:shape="shape" ' +
                    'v-bind:type="item.selectType"> ' +
                      '<img v-bind:src="cards[item.value].src" v-bind:alt="cards[item.value].alt" width="45" v-if="item.value > 0">' +
                      '<img v-bind:src="cards[0].src" v-bind:alt="cards[0].alt" width="45" v-else-if="item.value === 0 || item.selectType">' +
                    '</label-card>' +
                  '&nbsp;' +
                '</template>' +
              '</div>',
    props: {
      items: {
        type: Array, //{array<object>}
        required: true,
        default: function() {
          return [];
        }
      },
      sort: {
        type: String,
        default: '' //asc|desc|''
      },
      defaultLength: {
        type: Number,
        default: 0
      },
      shape: {
        type: String,
        default: 'circle' //circle|square
      },
      labelClass: {
        type: String,
        default: ''
      },
      emptyValue: {
        type: String,
        default: ''
      }
    },
    data: function() {
      return {
        cards: {
          0 : { id:0, src:'/assets/img/ec/pic-kisekae-default-index001.svg', alt:'-' },
          1 : { id:1, src:'/assets/img/ec/pic-kisekae-index001.svg', alt:'リンゴ' },
          2 : { id:2, src:'/assets/img/ec/pic-kisekae-index002.svg', alt:'ミカン' },
          3 : { id:3, src:'/assets/img/ec/pic-kisekae-index003.svg', alt:'メロン' },
          4 : { id:4, src:'/assets/img/ec/pic-kisekae-index004.svg', alt:'ブドウ' },
          5 : { id:5, src:'/assets/img/ec/pic-kisekae-index005.svg', alt:'モモ' }
        }
      };
    },
    computed: {
      _items: function() {
        var _items = _.cloneDeep(this.items);
        var len = _items.length;

        this.setEmtpyValue(_items);

        if (len < this.defaultLength) {
          this.pushEmptyItems(_items, this.defaultLength - len);
        }

        return this.getSortItems(_items);
      },
      _labelClass: function() {
        var c = {};

        if (!!this.labelClass) {
          c[this.labelClass] = true;
          return c;
        }
      },
    },
    methods: {
      /**
       * @param   {array<object>}   items
       */
      setEmtpyValue: function(items) {
        if (this.emptyValue == '-') {
          this.emptyValue = 0;
        }
        var emptyValue = this.emptyValue;

        if (!emptyValue && emptyValue !== 0) return;

        _.forEach(items, function(o) {
          if ( (typeof o.value === 'undefined') || ('' === o.value) ) {
            o.value = emptyValue;
          }
        });
      },

      /**
       * @param   {array}   items
       * @param   {number}  length
       */
      pushEmptyItems: function(items, length) {
        if (length < 1) return;

        for (var i = 0; i < length; ++i) {
          items.push(
            this.$store.getters.lotteryNumberFormat(this.emptyValue)
          );
        }
      },

      /**
       * @param   {array<object>}   items
       * @return  {array<object>}
       */
      getSortItems: function(items) {
        if ('asc' === this.sort) {
          // 昇順
          return _.sortBy(items, [function(o) {
            return ('' === o.value) ? 99999 : o.value;
          }]);

        } else if ('desc' === this.sort) {
          // 降順
          return _.sortBy(items, [function(o) {
            return o.value;
          }]).reverse();

        } else {
          // no sort
          return items;
        }
      }
    }
  };


  // モーダルrouter
  Components.MODAL_ROUTER = {
    // template: '#modal_router',
    // components: {
    // },

    data: function() {
      return {
        routeModal: '', //{string}
        payload   : {} //{object}
      };
    },
    mounted: function() {
      this.onVmApp('MODAL_ROUTER_PUSH', function(vals) {
        this.routeModal = vals.to || '';
        this.payload    = vals.payload || {};
      }.bind(this));
    },
    methods: {
      reset: function() {
        this.routeModal = '';
        this.payload    = {};
      },
    }
  };


  // ナンバーズ用数字状態
  Components.LOTTERY_NUMBERS_ITEM_STATES = {
    template: '<div class="m_lotteryNumInputNumbers_num">' +
                '<ul class="m_lotteryNumInputNumbers_num_inner">' +
                  '<li is="number-state" ' +
                    'v-for="(item, i) in states" ' +
                    'v-bind:key="item" ' +
                    'v-bind:is-current="current === i" ' +
                    'v-bind:value="item.value" ' +
                    'v-bind:select-type="item.selectType" ' +
                    'v-on:click="$emit(\'click\', i)"></li>' +
                '</ul>' +
              '</div>',
    components: {
      'number-state': {
        template: '<li v-bind:class="liClass">' +
                    '<span ' +
                      'v-if="isCurrent || disabled">{{ text }}</span>' +
                    '<a href="#" ' +
                      'v-else ' +
                      'v-on:click.prevent="$emit(\'click\')">{{ text }}</a>' +
                  '</li>',
        props: ['isCurrent', 'value', 'selectType'],
        computed: {
          disabled: function() {
            return 'disabled' === this.selectType;
          },
          issetValue: function() {
            if (typeof this.value === 'undefined') {
              return false;
            } else {
              return !!(this.value + '');
            }
          },
          text: function() {
            return this.issetValue ? this.value : 'ー';
          },
          liClass: function() {
            var c = {
              'is_focus': this.isCurrent,
              'is_disabled': this.disabled,
              'is_empty': !this.issetValue
            };

            if (this.issetValue) {
              c['is_' + this.selectType] = true;
            }

            return c;
          }
        },
      }
    },

    props: {
      current: {
        type: Number,
        default: 0
      },
      length: {
        type: Number,
        default: 4
      },
      selecteds: {
        type: Array,
        default: function() {
          return [];
        }
      },
    },
    computed: {
      states: function() {
        var states = [];
        var selecteds = this.selecteds || [];
        var state, value, selectType;

        for (var i = 0, len = this.length; i < len; ++i) {
          value      = !!selecteds[i] ? selecteds[i].value : '';
          selectType = !!selecteds[i] ? selecteds[i].selectType : '';

          state = this.$store.getters.lotteryNumberFormat(value, selectType);

          states.push(state);
        }

        return states;
      }
    },
  };

  // ビンゴ用数字状態
  Components.LOTTERY_BINGO_ITEM_STATES = {
    template: '<div class="m_lotteryNumInputBingo_num">' +
                '<ul class="m_lotteryNumInputBingo_num_inner">' +
                  '<li is="number-state" ' +
                    'v-bind:key="states[0]" ' +
                    'v-bind:is-current="current === 0" ' +
                    'v-bind:value="states[0].value" ' +
                    'v-bind:select-type="states[0].selectType" ' +
                    'v-on:click="$emit(\'click\', 0)"></li>' +
                  '<li is="number-state" ' +
                    'v-bind:key="states[1]" ' +
                    'v-bind:is-current="current === 1" ' +
                    'v-bind:value="states[1].value" ' +
                    'v-bind:select-type="states[1].selectType" ' +
                    'v-on:click="$emit(\'click\', 1)"></li>' +
                  '<li is="number-state" ' +
                    'v-bind:key="states[2]" ' +
                    'v-bind:is-current="current === 2" ' +
                    'v-bind:value="states[2].value" ' +
                    'v-bind:select-type="states[2].selectType" ' +
                    'v-on:click="$emit(\'click\', 2)"></li>' +
                  '<li is="number-state" ' +
                    'v-bind:key="states[3]" ' +
                    'v-bind:is-current="current === 3" ' +
                    'v-bind:value="states[3].value" ' +
                    'v-bind:select-type="states[3].selectType" ' +
                    'v-on:click="$emit(\'click\', 3)"></li>' +
                  '<li><span class="m_labelNumFree">FREE</span></li>' +
                  '<li is="number-state" ' +
                    'v-bind:key="states[4]" ' +
                    'v-bind:is-current="current === 4" ' +
                    'v-bind:value="states[4].value" ' +
                    'v-bind:select-type="states[4].selectType" ' +
                    'v-on:click="$emit(\'click\', 4)"></li>' +
                  '<li is="number-state" ' +
                    'v-bind:key="states[5]" ' +
                    'v-bind:is-current="current === 5" ' +
                    'v-bind:value="states[5].value" ' +
                    'v-bind:select-type="states[5].selectType" ' +
                    'v-on:click="$emit(\'click\', 5)"></li>' +
                  '<li is="number-state" ' +
                    'v-bind:key="states[6]" ' +
                    'v-bind:is-current="current === 6" ' +
                    'v-bind:value="states[6].value" ' +
                    'v-bind:select-type="states[6].selectType" ' +
                    'v-on:click="$emit(\'click\', 6)"></li>' +
                  '<li is="number-state" ' +
                    'v-bind:key="states[7]" ' +
                    'v-bind:is-current="current === 7" ' +
                    'v-bind:value="states[7].value" ' +
                    'v-bind:select-type="states[7].selectType" ' +
                    'v-on:click="$emit(\'click\', 7)"></li>' +
                '</ul>' +
              '</div>',
    components: {
      'number-state': {
        template: '<li v-bind:class="liClass">' +
                    '<span ' +
                      'v-if="isCurrent || disabled">{{ text }}</span>' +
                    '<a href="#" ' +
                      'v-else ' +
                      'v-on:click.prevent="$emit(\'click\')">{{ text }}</a>' +
                  '</li>',
        props: ['isCurrent', 'value', 'selectType'],
        computed: {
          disabled: function() {
            return 'disabled' === this.selectType;
          },
          issetValue: function() {
            if (typeof this.value === 'undefined') {
              return false;
            } else {
              return !!(this.value + '');
            }
    },
          text: function() {
            return this.issetValue ? this.value : 'ー';
          },
          liClass: function() {
            var c = {
              'is_focus': this.isCurrent,
              'is_disabled': this.disabled,
              'is_empty': !this.issetValue
  };

            if (this.issetValue) {
              c['is_' + this.selectType] = true;
            }

            return c;
          }
        },
      }
    },

    props: {
      current: {
        type: Number,
        default: 0
      },
      length: {
        type: Number,
        default: 4
      },
      selecteds: {
        type: Array,
        default: function() {
          return [];
        }
      },
    },
    computed: {
      states: function() {
        var states = [];
        var selecteds = this.selecteds || [];
        var state, value, selectType;

        for (var i = 0, len = this.length; i < len; ++i) {
          value      = !!selecteds[i] ? selecteds[i].value : '';
          selectType = !!selecteds[i] ? selecteds[i].selectType : '';

          state = this.$store.getters.lotteryNumberFormat(value, selectType);

          states.push(state);
        }

        return states;
      }
    },
  };


  // 絵札用数字状態
  Components.LOTTERY_CARDS_ITEM_STATES = {
    template: '<div class="m_lotteryNumInputCards_num">' +
                '<ul class="m_lotteryNumInputCards_num_inner">' +
                  '<li is="number-state" ' +
                    'v-for="(item, i) in states" ' +
                    'v-bind:key="item" ' +
                    'v-bind:is-current="current === i" ' +
                    'v-bind:value="item.value" ' +
                    'v-bind:select-type="item.selectType" ' +
                    'v-on:click="$emit(\'click\', i)"></li>' +
                '</ul>' +
              '</div>',
    components: {
      'number-state': {
        template: '<li v-bind:class="liClass">' +
                    '<span ' +
                    'v-if="disabled || (isCurrent && !isSpLayout) || (isCurrent && value > 0 && isSpLayout)">' +
                    '<img v-bind:src="cards[text].src" v-bind:alt="cards[text].alt" width="100%">' +
                  '</span>' +
                '<span ' +
                  'v-else-if="isCurrent && value == 0 && isSpLayout">' +
                    '<img v-bind:src="cards[text].src2" v-bind:alt="cards[text].alt" width="100%">' +
                      '</span>' +
                    '<a href="#" ' +
                      'v-else ' +
                      'v-on:click.prevent="$emit(\'click\')">' +
                        '<img v-bind:src="cards[text].src" v-bind:alt="cards[text].alt" width="100%">' +
                      '</a>' +
                  '</li>',
        props: ['isCurrent', 'value', 'selectType'],
        data: function() {
          return {
            cards: {
              0 : { id:0, src:'/assets/img/ec/pic-kisekae-default-index001.svg', src2:'/assets/img/ec/pic-kisekae-default-index002.svg', alt:'-' },
              1 : { id:1, src:'/assets/img/ec/pic-kisekae-index001.svg', alt:'リンゴ' },
              2 : { id:2, src:'/assets/img/ec/pic-kisekae-index002.svg', alt:'ミカン' },
              3 : { id:3, src:'/assets/img/ec/pic-kisekae-index003.svg', alt:'メロン' },
              4 : { id:4, src:'/assets/img/ec/pic-kisekae-index004.svg', alt:'ブドウ' },
              5 : { id:5, src:'/assets/img/ec/pic-kisekae-index005.svg', alt:'モモ' }
            }
          };
        },
        computed: {
          disabled: function() {
            return 'disabled' === this.selectType;
          },
          issetValue: function() {
            if (typeof this.value === 'undefined') {
              return false;
            } else {
              return !!(this.value + '');
            }
          },
          text: function() {
            return this.issetValue ? this.value : '0';
          },
          isSpLayout: function() {
              return 'sp' === this.$store.getters.currentMediaView;
          },
          liClass: function() {
            var c = {
              'is_focus': this.isCurrent,
              'is_disabled': this.disabled,
              'is_empty': !this.issetValue
            };

            if (this.issetValue) {
              c['is_' + this.selectType] = true;
            }

            return c;
          }
        },
      }
    },

    props: {
      current: {
        type: Number,
        default: 0
      },
      length: {
        type: Number,
        default: 4
      },
      selecteds: {
        type: Array,
        default: function() {
          return [];
        }
      },
    },
    computed: {
      states: function() {
        var states = [];
        var selecteds = this.selecteds || [];
        var state, value, selectType;

        for (var i = 0, len = this.length; i < len; ++i) {
          value      = !!selecteds[i] ? selecteds[i].value : '';
          selectType = !!selecteds[i] ? selecteds[i].selectType : '';

          state = this.$store.getters.lotteryNumberFormat(value, selectType);

          states.push(state);
        }

        return states;
      }
    },
  };


  // 絵札選択ボタン
  Components.LOTTERY_CARD_BUTTON = {
    template: '<button-card ' +
                'v-bind:class="btnClass" ' +
                'v-bind:disabled="disabled" ' +
                'v-bind:value="value" ' +
                'v-on:click="onClick">' +
              '</button-number>',
    components: {
      'button-card': Components.BUTTON_CARD
    },
    props: {
      lotteryType: {
        type: String,
        default: ''
      },
      value: {
        type: Number,
        default: ''
      },
      selectType: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      },
      defaultSelectType: {
        type: String,
        default: 'myself' // myself|favorite
      },
    },
    computed: {
      btnClass: function() {
        return {
          'm_lotteryNumInputNum_btn': !this.lotteryType,
          'm_lotteryNumInputCards_btn': 'numbers' === this.lotteryType,
          'is_myself': 'myself' === this.selectType,
          'is_favorite': 'favorite' === this.selectType,
          'is_random': 'random' === this.selectType,
        };
      }
    },
    methods: {
      onClick: function() {
        this.emit(!!this.selectType ? '' : this.defaultSelectType);
      },
      emit: function(selectType) {
        this.$emit('click', {
          value     : this.value,
          selectType: selectType
        });
      }
    }
  };

  // 数字選択ボタン
  Components.LOTTERY_NUMBER_BUTTON = {
    template: '<button-number ' +
                'v-bind:class="btnClass" ' +
                'v-bind:disabled="disabled" ' +
                'v-bind:value="value" ' +
                'v-on:click="onClick">' +
              '</button-number>',
    components: {
      'button-number': Components.BUTTON_NUMBER
    },
    props: {
      lotteryType: {
        type: String,
        default: ''
      },
      value: {
        type: Number,
        default: ''
      },
      selectType: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      },
      defaultSelectType: {
        type: String,
        default: 'myself' // myself|favorite
      },
    },
    computed: {
      btnClass: function() {
        return {
          'm_lotteryNumInputNum_btn': !this.lotteryType,
          'm_lotteryNumInputNumbers_btn': 'numbers' === this.lotteryType,
          'is_myself': 'myself' === this.selectType,
          'is_favorite': 'favorite' === this.selectType,
          'is_random': 'random' === this.selectType,
        };
      }
    },
    methods: {
      onClick: function() {
        this.emit(!!this.selectType ? '' : this.defaultSelectType);
      },
      emit: function(selectType) {
        this.$emit('click', {
          value     : this.value,
          selectType: selectType
        });
      }
    }
  };


  // 数字選択ボタン：複数選択可（ロト）
  Components.LOTTERY_NUMBER_BUTTONS = {
    template: '<ol class="m_lotteryNumInputNum_nums">' +
                '<li v-for="item in numbers">' +
                  '<lottery-number ' +
                    'v-bind:key="item.value" ' +
                    'v-bind:disabled="geIsDisabled(item.value) || !restCount && !item.selectType" ' +
                    'v-bind:value="item.value" ' +
                    'v-bind:select-type="item.selectType" ' +
                    'v-bind:default-select-type="defaultSelectType" ' +
                    'v-on:click="onClickNumber">' +
                  '</lottery-number>' +
                '</li>' +
              '</ol>',
    components: {
      'lottery-number': Components.LOTTERY_NUMBER_BUTTON,
    },

    props: {
      first: {
        type: Number,
        default: 1
      },
      last: {
        type: Number,
        default: 37
      },
      selecteds: {
        type: Array,
        default: function() {
          return [];
        }
      },
      maxSelectCount: {
        type: Number,
        default: 4
      },
      defaultSelectType: {
        type: String,
        default: 'myself' // myself|favorite
      },
      disabledNumbers: {
        type: Array, //{array<number>}
        default: function() {
          return [];
        }
      }
    },
    data: function() {
      return {
        numbers: []
      };
    },
    computed: {
      selectedCount: function() {
        return this.$store.getters.selectedNumbersCount(this.selecteds);
      },
      restCount: function() {
        return this.maxSelectCount - this.selectedCount;
      },
    },
    watch: {
      first: function() {
        this.initNumbers();
      },
      last: function() {
        this.initNumbers();
      },
      selecteds: function(val) {
        this.setNumbers(val);
      }
    },
    mounted: function() {
      this.initNumbers();
    },
    methods: {
      initNumbers: function() {
        this.numbers = this.createNumbers();
        this.setNumbers(this.selecteds);
      },
      // @return   {array<object>}
      createNumbers: function() {
        var numbers = [];

        // first-last値不正
        if (this.last < this.first) return numbers;

        // 正常
        for (var i = this.first; i <= this.last; ++i) {
          numbers.push(
            this.$store.getters.lotteryNumberFormat(i)
          );
        }

        return numbers;
      },
      /**
       * @param   {array<object>}   selecteds
       */
      setNumbers: function(selecteds) {
        var numbers = this.numbers;
        var i;

        _.forEach(numbers, function(o) {
          i = _.findIndex(selecteds, function(_o) {
            return  o.value === _o.value;
          });
          o.selectType = (i > -1) ? selecteds[i].selectType : '';
        });
      },

      geIsDisabled: function(value) {
        var isDisabled = false;
        var disableds = this.disabledNumbers;

        if (!disableds.length) {
          return false;
        }

        _.forEach(disableds, function(v) {
          if (v === value) {
            isDisabled = true;
            return false;
          }
        });

        return isDisabled;
      },

      /**
       * @param   {object}   number
       *          {number}   number.value
       *          {string}   number.selectType
       */
      onClickNumber: function(number) {
        var selecteds = _.cloneDeep(this.selecteds);

        var i = _.findIndex(selecteds, function(o) {
          return number.value === o.value;
        });

        if ( ('' === number.selectType) && !!selecteds[i] ) {
          // 削除
          selecteds.splice(i, 1);
          this.emit('change', selecteds);

        } else if (!!number.selectType && !selecteds[i] ) {
          // 追加
          if (!this.restCount) return; //MAX

          selecteds.push(number);
          this.emit('change', selecteds);
        }
      },
      /**
       * @param   {string}         eventName
       * @param   {array<object>}  selecteds
       */
      emit: function(eventName, selecteds) {
        eventName = eventName || 'change';

        this.$emit(eventName, {
          selecteds: selecteds
        });
      }
    }
  };


  // 数字選択ボタン：単一選択（ナンバーズ）
  Components.LOTTERY_NUMBER_BUTTONS_SELECT_ONLY = {
    template: '<ol class="m_lotteryNumInputNumbers_btns" ' +
                'v-bind:class="wrapClass">' +
                '<li v-for="item in numbers">' +
                  '<lottery-number lottery-type="numbers" ' +
                    'v-bind:key="item.value" ' +
                    'v-bind:value="item.value" ' +
                    'v-bind:select-type="item.selectType" ' +
                    'v-bind:default-select-type="defaultSelectType"' +
                    'v-on:click="onClickNumber">' +
                  '</lottery-number>' +
                '</li>' +
              '</ol>',
    components: {
      'lottery-number': Components.LOTTERY_NUMBER_BUTTON,
    },

    props: {
      current: {
        type: Number,
        default: 0
      },
      first: {
        type: Number,
        default: 0
      },
      last: {
        type: Number,
        default: 9
      },
      selected: {
        type: Object,
        default: function() {
          return {};
        }
      },
      defaultSelectType: {
        type: String,
        default: 'myself' // myself|favorite
      },
    },
    data: function() {
      return {
        numbers: []
      };
    },
    computed: {
      wrapClass: function() {
        if (!this.current) return;

        var wrapClass = {};
        var addClass = this.getWrapClass();

        wrapClass[addClass] = true;

        return wrapClass;
      }
    },
    watch: {
      first: function() {
        this.initNumbers();
      },
      last: function() {
        this.initNumbers();
      },
      selected: function(val) {
        this.setNumbers(val);
      }
    },
    mounted: function() {
      this.initNumbers();
    },
    methods: {
      initNumbers: function() {
        this.numbers = this.createNumbers();
        this.setNumbers(this.selected);
      },
      // @return  {array<object>}
      createNumbers: function() {
        var numbers = [];

        // first-last値不正
        if (this.last < this.first) return numbers;

        // 正常
        for (var i = this.first; i <= this.last; ++i) {
          numbers.push(
            this.$store.getters.lotteryNumberFormat(i)
          );
        }

        return numbers;
      },

      /**
       * @param   {object}   selected
       *          {number}   selected.value
       *          {string}   selected.selectType
       */
      setNumbers: function(selected) {
        this.resetNumbers();

        var numbers = this.numbers;
        var i = _.findIndex(numbers, function(o) {
          return  o.value === selected.value;
        });

        if (i > -1) {
          numbers[i].selectType = selected.selectType;
        }
      },
      resetNumbers: function() {
        _.forEach(this.numbers, function(o) {
          o.selectType = '';
        });
      },
      // @return   {string}
      getWrapClass: function() {
        var classes = ['', '2nd', '3rd', '4th'];
        var c = classes[this.current];

        return !!c ? 'is_' + c : '';
      },

      /**
       * @param   {object}   number
       *          {number}   number.value
       *          {string}   number.selectType
       */
      onClickNumber: function(number) {
        if ('' === number.selectType) {
          // OFF
          this.emit('change', {
            value: '',
            selectType: ''
          });

        } else if (!!number.selectType) {
          // ON
          this.emit('change', number);
        }
      },

      /**
       * @param   {string}   eventName
       * @param   {object}   selected
       */
      emit: function(eventName, selected) {
        eventName = eventName || 'change';

        this.$emit(eventName, {
          index   : this.current,
          selected: selected
        });
      }
    }
  };

  // 数字選択ボタン：単一選択（ビンゴ）
  Components.LOTTERY_BINGO_BUTTONS_SELECT_ONLY = {
    template: '<div class="m_lotteryNumInputBingo_btnContainer">' +
                '<ol class="m_lotteryNumInputBingo_btns" ' +
                  'v-for="(items, index) in numbers"' +
                  'v-if="current===index"' +
                  'v-bind:class="wrapClass">' +
                  '<li v-for="item in items">' +
                    '<lottery-number lottery-type="numbers" ' +
                      'v-bind:key="item.value" ' +
                      'v-bind:value="item.value" ' +
                      'v-bind:select-type="item.selectType" ' +
                      'v-bind:default-select-type="defaultSelectType"' +
                      'v-on:click="onClickNumber">' +
                    '</lottery-number>' +
                  '</li>' +
                '</ol>' +
              '</div>',
    components: {
      'lottery-number': Components.LOTTERY_NUMBER_BUTTON,
    },

    props: {
      current: {
        type: Number,
        default: 0
      },
      first: {
        type: Number,
        default: 0
      },
      last: {
        type: Number,
        default: 40
      },
      group: {
        type: Object,
        default: function() {
          return {};
        }
      },
      selected: {
        type: Object,
        default: function() {
          return {};
    }
      },
      defaultSelectType: {
        type: String,
        default: 'myself' // myself|favorite
      },
    },
    data: function() {
      return {
        numbers: []
  };
    },
    computed: {
      wrapClass: function() {
        if (!this.current) return;

        var wrapClass = {};
        var addClass = this.getWrapClass();

        wrapClass[addClass] = true;

        return wrapClass;
      }
    },
    watch: {
      first: function() {
        this.initNumbers();
      },
      last: function() {
        this.initNumbers();
      },
      group: function() {
        this.initNumbers();
      },
      selected: function(val) {
        this.setNumbers(val);
      }
    },
    mounted: function() {
      this.initNumbers();
    },
    methods: {
      initNumbers: function() {
        this.numbers = this.createNumbers();
        this.setNumbers(this.selected);
      },
      // @return  {array<object>}
      createNumbers: function() {
        var numbers = [];

        // first-last値不正
        if (this.last < this.first) return numbers;

        // 正常
        var cnt = Object.keys(this.group).length;
        for (var i = 0; i < cnt; i++) {
          var t = this.group[i];
          var number = [];
          for (var j = 0; j <  t.length; j++) {
            number.push(
              this.$store.getters.lotteryNumberFormat(t[j])
            );
          }
          numbers.push(number);
        }
        return numbers;
      },

      /**
       * @param   {object}   selected
       *          {number}   selected.value
       *          {string}   selected.selectType
       */
      setNumbers: function(selected) {
        var numbers = this.numbers;
        var i;

        _.forEach(numbers, function(number) {
          _.forEach(number, function(o) {
            i = _.findIndex(selected, function(_o) {
              return  o.value === _o.value;
            });
            o.selectType = (i > -1) ? selected[i].selectType : '';
          });
        });
      },
      resetNumbers: function() {
        _.forEach(this.numbers, function(number) {
          _.forEach(number, function(o) {
            o.selectType = '';
          });
        });
      },
      // @return   {string}
      getWrapClass: function() {
        var classes = ['', '2nd', '3rd', '4th'];
        var c = classes[this.current];

        return !!c ? 'is_' + c : '';
      },

      /**
       * @param   {object}   number
       *          {number}   number.value
       *          {string}   number.selectType
       */
      onClickNumber: function(number) {
        if ('' === number.selectType) {
          // OFF
          this.emit('change', {
            value: '',
            selectType: ''
          });

        } else if (!!number.selectType) {
          // ON
          this.emit('change', number);
        }
      },

      /**
       * @param   {string}   eventName
       * @param   {object}   selected
       */
      emit: function(eventName, selected) {
        eventName = eventName || 'change';

        this.$emit(eventName, {
          index   : this.current,
          selected: selected
        });
      }
    }
  };

  // 数字選択ボタン：単一選択（絵札）
  Components.LOTTERY_CARD_BUTTONS_SELECT_ONLY = {
    template: '<div class="m_lotteryNumInputCards_btns" ' +
                'v-bind:class="wrapClass">' +
                '<p class="m_lotteryNumInputCards_btns_caption" v-html="text"></p>' +
                '<div class="m_lotteryNumInputCards_btns_inner">' +
                  '<div class="m_lotteryNumInputCards_imgs">' +
                    '<div class="m_lotteryNumInputCards_img" v-bind:class="imgClass">' +
                      '<div class="m_lotteryNumInputCards_img_a"><img v-bind:src="qooImg1" v-bind:alt="qooImgAlt1"></div>' +
                      '<div class="m_lotteryNumInputCards_img_b"><img v-bind:src="qooImg2" v-bind:alt="qooImgAlt2"></div>' +
                    '</div>' +
                  '</div>' +
                  '<div class="m_lotteryNumInputCards_ols">' +
                    '<ol>' +
                      '<li v-for="item in numbers">' +
                        '<lottery-card lottery-type="numbers" ' +
                          'v-bind:key="item.value" ' +
                          'v-bind:value="item.value" ' +
                          'v-bind:select-type="item.selectType" ' +
                          'v-bind:default-select-type="defaultSelectType"' +
                          'v-on:click="onClickNumber">' +
                        '</lottery-card>' +
                      '</li>' +
                      '<li>' +
                        '<button type="button" class="m_btn m_btn__block m_lotteryCardConfirm_btn"' +
                          'v-bind:class="btnClass" ' +
                          'v-bind:disabled="isDisabled" ' +
                          'v-on:click="onClickNext">' +
                          '<span><span v-if="!isLast">次へ</span><span v-if="isLast">先頭へ</span></span>' +
                        '</button>' +
                      '</li>' +
                    '</ol>' +
                  '</div>' +
                '</div>' +
              '</div>',
    components: {
      'lottery-card': Components.LOTTERY_CARD_BUTTON,
    },

    props: {
      current: {
        type: Number,
        default: 0
      },
      length: {
        type: Number,
        default: 4
      },
      first: {
        type: Number,
        default: 0
      },
      last: {
        type: Number,
        default: 9
      },
      selected: {
        type: Object,
        default: function() {
          return {};
        }
      },
      defaultSelectType: {
        type: String,
        default: 'myself' // myself|favorite
      },
      selectedCard: {
        type: Object,
        default: function() {
          return {};
        }
      },
      actived: {
        type: Boolean,
        default: false
      },
      isActived: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: true
      },
      cardImgNum1: {
        type: Number,
        default: 0
      },
      cardImgNum2: {
        type: Number,
        default: 0
      }
    },
    data: function() {
      return {
        numbers: [],
        cards: {
          0 : { id:0, src:'/assets/img/ec/pic-kisekae-default-set001.svg', alt:'-' },
          1 : { id:1, src:'/assets/img/ec/pic-kisekae-set001.svg', alt:'リンゴ' },
          2 : { id:2, src:'/assets/img/ec/pic-kisekae-set002.svg', alt:'ミカン' },
          3 : { id:3, src:'/assets/img/ec/pic-kisekae-set003.svg', alt:'メロン' },
          4 : { id:4, src:'/assets/img/ec/pic-kisekae-set004.svg', alt:'ブドウ' },
          5 : { id:5, src:'/assets/img/ec/pic-kisekae-set005.svg', alt:'モモ' }
        }
      };
    },
    computed: {
      wrapClass: function() {
        if (!this.current) return;

        var wrapClass = {};
        var addClass = this.getWrapClass();

        wrapClass[addClass] = true;

        return wrapClass;
      },
      isDisabled: function() {
        if (this.selectedCard.value > 0) {
          this.disabled = false;
        } else {
          this.disabled = true;
        }
        return this.disabled;
      },
      isLast: function() {
        return this.current === this.length - 1;
      },
      btnClass: function() {
        if (this.isDisabled) {
          return {'is_disabled': true};
        }
      },
      imgClass: function() {
        if (this.isActived) {
          return {'is_active': true};
        } else {
          return {'is_active': false};
        }
      },
      qooImg1: function() {
        var img = this.cards[this.cardImgNum1].src;
        if (!this.actived) {
          if (this.selectedCard.value > 0) {
            this.cardImgNum1 = this.selectedCard.value;
          } else {
            this.cardImgNum1 = 0;
          }
          img = this.cards[this.cardImgNum1].src;
        }
        return img;
      },
      qooImgAlt1: function() {
        var alt = this.cards[this.cardImgNum1].alt;
        if (!this.actived) {
          if (this.selectedCard.value > 0) {
            this.cardImgNum1 = this.selectedCard.value;
          } else {
            this.cardImgNum1 = 0;
          }
          alt = this.cards[this.cardImgNum1].alt;
        }
        return alt;
      },
      qooImg2: function() {
        var img = this.cards[this.cardImgNum2].src;
        if (this.actived) {
          if (this.selectedCard.value > 0) {
            this.cardImgNum2 = this.selectedCard.value;
          } else {
            this.cardImgNum2 = 0;
          }
          img = this.cards[this.cardImgNum2].src;
        }
        return img;
      },
      qooImgAlt2: function() {
        var alt = this.cards[this.cardImgNum2].alt;
        if (this.actived) {
          if (this.selectedCard.value > 0) {
            this.cardImgNum2 = this.selectedCard.value;
          } else {
            this.cardImgNum2 = 0;
          }
          alt = this.cards[this.cardImgNum2].alt;
        }
        return alt;
      },
      text: function() {
        if (this.selectedCard.value > 0) {
          return '選び直す場合は絵柄を再選択してください。';
        } else {
          return '5種類の絵柄から選んでください。';
        }
      }
    },
    watch: {
      first: function() {
        this.initNumbers();
      },
      last: function() {
        this.initNumbers();
      },
      selected: function(val) {
        this.setNumbers(val);
      }
    },
    mounted: function() {
      this.initNumbers();
    },
    methods: {
      initNumbers: function() {
        this.numbers = this.createNumbers();
        this.setNumbers(this.selected);
      },
      // @return  {array<object>}
      createNumbers: function() {
        var numbers = [];

        // first-last値不正
        if (this.last < this.first) return numbers;

        // 正常
        for (var i = this.first; i <= this.last; ++i) {
          numbers.push(
            this.$store.getters.lotteryNumberFormat(i)
          );
        }

        return numbers;
      },

      /**
       * @param   {object}   selected
       *          {number}   selected.value
       *          {string}   selected.selectType
       */
      setNumbers: function(selected) {
        this.resetNumbers();

        var numbers = this.numbers;
        var i = _.findIndex(numbers, function(o) {
          return  o.value === selected.value;
        });

        if (i > -1) {
          numbers[i].selectType = selected.selectType;
        }

        if (this.selected.value > 0) {
          this.selectedCard = this.selected;
        }
      },
      resetNumbers: function() {
        _.forEach(this.numbers, function(o) {
          o.selectType = '';
        });

        this.selectedCard = {
          value     : 0,
          selectType: ''
        }
      },
      // @return   {string}
      getWrapClass: function() {
        var classes = ['', '2nd', '3rd', '4th'];
        var c = classes[this.current];

        return !!c ? 'is_' + c : '';
      },

      /**
       * @param   {object}   number
       *          {number}   number.value
       *          {string}   number.selectType
       */
      onClickNext: function() {
        this.$emit('next');
      },

      /**
       * @param   {object}   number
       *          {number}   number.value
       *          {string}   number.selectType
       */
      onClickNumber: function(number) {
        if (this.selectedCard.value !== number.value) {
          _.forEach(this.numbers, function(o) {
            o.selectType = '';
            if (o.value == number.value) {
              o.selectType = 'myself';
            }
          });

          this.selectedCard = number;
          if (this.actived) {
            this.actived = false;
          } else {
            this.actived = true;
          }
          setTimeout(this.setActived, 300);

          this.onClickCommit();
        }
      },

      setActived: function() {
        if (!this.actived) {
          this.isActived = false;
        } else {
          this.isActived = true;
        }
      },

      /**
       * @param   {object}   number
       *          {number}   number.value
       *          {string}   number.selectType
       */
      onClickCommit: function() {
        var number = this.selectedCard;
        if ('' === number.selectType) {
        } else if (!!number.selectType) {
          // ON
          this.emit('change', number);
        }
      },

      /**
       * @param   {string}   eventName
       * @param   {object}   selected
       */
      emit: function(eventName, selected) {
        eventName = eventName || 'change';

        this.$emit(eventName, {
          index   : this.current,
          selected: selected
        });
      }
    }
  };

  // クイックピックオーバーレイ
  Components.LOTTERY_ITEM_QUICKPICK_LAYER = {
    template: '<div class="m_lotteryNum_quick">' +
                '<slot><span>クイックピック</span></slot>' +
              '</div>',
  };


  // 数字選択：状態＋ボタン（ナンバーズ）
  Components.LOTTERY_NUMBERS_SELECTOR = {
    template: '<div class="m_lotteryNumInputNumbers" ' +
                'v-bind:class="wrapClass">' +
                '<lottery-numbers-states ' +
                  'v-bind:current="current" ' +
                  'v-bind:length="length" ' +
                  'v-bind:selecteds="selecteds" ' +
                  'v-on:click="onChangeCurrent"></lottery-numbers-states>' +
                '<lottery-number-buttons ' +
                  'v-bind:default-select-type="defaultSelectType" ' +
                  'v-bind:current="current" ' +
                  'v-bind:first="first" ' +
                  'v-bind:last="last" ' +
                  'v-bind:selected="selecteds[current]" ' +
                  'v-on:change="onChangeNumber"></lottery-number-buttons>' +
                '<quick-pick-layer v-if="isQuickPick">' +
                  '<div class="m_lotteryNum_quickTxt">' +
                    '<div class="m_lotteryNum_quickTxt_inner">' +
                      '<p>クイックピックで申込数字選択中</p>' +
                      '<p class="u_fontS">コンピュータが自動で選んだ申込数字は、購入完了後<br>にマイページの「購入履歴詳細」から確認できます。</p>' +
                    '</div>' +
                  '</div>' +
                '</quick-pick-layer>' +
              '</div>',
    components: {
      'quick-pick-layer'      : Components.LOTTERY_ITEM_QUICKPICK_LAYER,
      'lottery-numbers-states': Components.LOTTERY_NUMBERS_ITEM_STATES,
      'lottery-number-buttons': Components.LOTTERY_NUMBER_BUTTONS_SELECT_ONLY
    },
    props: {
      length: {
        type: Number,
        default: 4
      },
      defaultSelectType: {
        type: String,
        default: 'myself' // myself|favorite
      },
      selecteds: {
        type: Array,
        default: function() {
          return [];
        }
      },
      betType: {
        type: Number,
        default: -1
      },
      first: {
        type: Number,
        default: 0
      },
      last: {
        type: Number,
        default: 9
      }
    },
    data: function() {
      return {
        current: 0,
        prevCurrent: -1
      };
    },
    computed: {
      isQuickPick: function() {
        var s = this.selecteds;
        return !!s.length && ('quickpick' === s[0].selectType) ? true : false;
      },
      wrapClass: function() {
        return {
          'm_lotteryNumInputNumbers__numbers3': 3 === this.length
        };
      },
      isMini: function() {
        return 'mini' === this.betType;
      },
    },
    watch: {
      selecteds: {
        handler: function() {
          this.setCurrent();
        },
        deep: true
      },
      current: function(val, oldVal) {
        this.prevCurrent = oldVal;
      }
    },
    mounted: function() {
      this.setCurrent();
    },
    methods: {
      /**
       * @param   {bool}   isSetCurrent - setCurrentを実行するか
       */
      refreshCurrent: function(isSetCurrent) {
        isSetCurrent = (typeof isSetCurrent === 'undefined') ? true : isSetCurrent;

        this.prevCurrent = -1;

        if (isSetCurrent) {
          this.setCurrent();
        }
      },
      /**
       * @return   {number}   -1:not found
       */
      getEmptyIndex: function() {
        var s = this.selecteds;

        if (!s.length) return 0;

        return _.findIndex(this.selecteds, function(o) {
          return !o.selectType;
        });
      },
      /**
       * @param   {number}   value
       */
      setCurrent: function(value) {
        this.current = (typeof value === 'undefined') ? this.getCurrent() : value;
      },
      /**
       * @return   {number}
       */
      getCurrent: function() {
        var emptyIndex = this.getEmptyIndex();

        if (emptyIndex > -1) {
          // 未設定有り：最初の未設定値に移動して処理完了
          return emptyIndex;
        }

        var isLoad = this.prevCurrent === -1;
        var next = isLoad ? 0 : (this.current + 1);
        var isLast = next >= this.length;
        var isDisabled;

        if (isLast) {
          // 全設定済みで最後の場合は移動しない
          return this.current;
        }

        isDisabled = this.getIsDisabled(next);

        if (isLoad && !isDisabled) {
          // ロード時：OK
          this.prevCurrent = next;
          return next;

        } else if (isLoad && isDisabled) {
          // ロード時：再取得
          this.prevCurrent = next;
          this.current = next;
          return this.getCurrent();

        } else if (isDisabled) {
          // 再取得
          this.current = next;
          return this.getCurrent();

        } else {
          // OK
          return next;
        }
      },

      getIsDisabled: function(index) {
        var s = this.selecteds;
        return !!s.length && !!s[index] && ('disabled' === s[index].selectType);
      },

      /**
       * @param   {number}   value
       */
      onChangeCurrent: function(value) {
        this.setCurrent(value);
      },
      /**
       * @param   {object}   payload
       *          {number}   payload.index
       *          {object}   payload.selected - value, selectType
       */
      onChangeNumber: function(payload) {
        if ( !payload || (typeof payload !== 'object')
              || !payload.hasOwnProperty('index') || !payload.selected ) return;

        var selecteds = _.cloneDeep(this.selecteds);

        for (var i = 0, len = this.length; i < len; ++i) {
          if (i === payload.index) {
            // update
            selecteds[i] = payload.selected;
          } else if (typeof selecteds[i] === 'undefined') {
            // create null object
            selecteds[i] = this.$store.getters.lotteryNumberFormat();
          }
        }

        this.$emit('change', {
          index: payload.index,
          selected: payload.selected,
          selecteds: selecteds
        });
      },
    }

  };

  // 数字選択：状態＋ボタン（ビンゴ）
  Components.LOTTERY_BINGO_SELECTOR = {
    template: '<div class="m_lotteryNumInputNumbers" ' +
                'v-bind:class="wrapClass">' +
                '<lottery-bingo-states ' +
                  'v-bind:current="current" ' +
                  'v-bind:length="length" ' +
                  'v-bind:selecteds="selecteds" ' +
                  'v-on:click="onChangeCurrent"></lottery-bingo-states>' +
                '<lottery-bingo-buttons ' +
                  'v-bind:default-select-type="defaultSelectType" ' +
                  'v-bind:current="current" ' +
                  'v-bind:first="first" ' +
                  'v-bind:last="last" ' +
                  'v-bind:group="group" ' +
                  'v-bind:selected="selecteds" ' +
                  'v-on:change="onChangeNumber"></lottery-bingo-buttons>' +
                '<quick-pick-layer v-if="isQuickPick">' +
                  '<div class="m_lotteryNum_quickTxt">' +
                    '<div class="m_lotteryNum_quickTxt_inner">' +
                      '<p>クイックピックで申込数字選択中</p>' +
                      '<p class="u_fontS">コンピュータが自動で選んだ8個の申込数字は、購入完了後<br>にマイページの「購入履歴詳細」から確認できます。</p>' +
                    '</div>' +
                  '</div>' +
                '</quick-pick-layer>' +
              '</div>',
    components: {
      'quick-pick-layer'      : Components.LOTTERY_ITEM_QUICKPICK_LAYER,
      'lottery-bingo-states': Components.LOTTERY_BINGO_ITEM_STATES,
      'lottery-bingo-buttons': Components.LOTTERY_BINGO_BUTTONS_SELECT_ONLY
    },
    props: {
      length: {
        type: Number,
        default: 4
      },
      defaultSelectType: {
        type: String,
        default: 'myself' // myself|favorite
      },
      selecteds: {
        type: Array,
        default: function() {
          return [];
        }
      },
      betType: {
        type: Number,
        default: -1
      },
      first: {
        type: Number,
        default: 0
      },
      last: {
        type: Number,
        default: 9
      },
      group: {
        type: Array,
        default: function() {
          return [];
      }
    },
    },
    data: function() {
      return {
        current: 0,
        prevCurrent: -1
      };
    },
    computed: {
      isQuickPick: function() {
        var s = this.selecteds;
        return !!s.length && ('quickpick' === s[0].selectType) ? true : false;
      },
      wrapClass: function() {
        return {
          'm_lotteryNumInputNumbers__numbers3': 3 === this.length
        };
      },
      isMini: function() {
        return 'mini' === this.betType;
      },
    },
    watch: {
      selecteds: {
        handler: function() {
          this.setCurrent();
        },
        deep: true
      },
      current: function(val, oldVal) {
        this.prevCurrent = oldVal;
      }
    },
    mounted: function() {
      this.setCurrent();
    },
    methods: {
      /**
       * @param   {bool}   isSetCurrent - setCurrentを実行するか
       */
      refreshCurrent: function(isSetCurrent) {
        isSetCurrent = (typeof isSetCurrent === 'undefined') ? true : isSetCurrent;

        this.prevCurrent = -1;

        if (isSetCurrent) {
          this.setCurrent();
        }
      },
      /**
       * @return   {number}   -1:not found
       */
      getEmptyIndex: function() {
        var s = this.selecteds;

        if (!s.length) return 0;

        return _.findIndex(this.selecteds, function(o) {
          return !o.selectType;
        });
      },
      /**
       * @param   {number}   value
       */
      setCurrent: function(value) {
        this.current = (typeof value === 'undefined') ? this.getCurrent() : value;
      },
      /**
       * @return   {number}
       */
      getCurrent: function() {
        var emptyIndex = this.getEmptyIndex();

        if (emptyIndex > -1) {
          // 未設定有り：最初の未設定値に移動して処理完了
          return emptyIndex;
        }

        var isLoad = this.prevCurrent === -1;
        var next = isLoad ? 0 : (this.current + 1);
        var isLast = next >= this.length;
        var isDisabled;

        if (isLast) {
          // 全設定済みで最後の場合は移動しない
          return this.current;
        }

        isDisabled = this.getIsDisabled(next);

        if (isLoad && !isDisabled) {
          // ロード時：OK
          this.prevCurrent = next;
          return next;

        } else if (isLoad && isDisabled) {
          // ロード時：再取得
          this.prevCurrent = next;
          this.current = next;
          return this.getCurrent();

        } else if (isDisabled) {
          // 再取得
          this.current = next;
          return this.getCurrent();

        } else {
          // OK
          return next;
        }
      },

      getIsDisabled: function(index) {
        var s = this.selecteds;
        return !!s.length && !!s[index] && ('disabled' === s[index].selectType);
      },

      /**
       * @param   {number}   value
       */
      onChangeCurrent: function(value) {
        this.setCurrent(value);
      },
      /**
       * @param   {object}   payload
       *          {number}   payload.index
       *          {object}   payload.selected - value, selectType
       */
      onChangeNumber: function(payload) {
        if ( !payload || (typeof payload !== 'object')
              || !payload.hasOwnProperty('index') || !payload.selected ) return;

        var selecteds = _.cloneDeep(this.selecteds);

        for (var i = 0, len = this.length; i < len; ++i) {
          if (i === payload.index) {
            // update
            selecteds[i] = payload.selected;
          } else if (typeof selecteds[i] === 'undefined') {
            // create null object
            selecteds[i] = this.$store.getters.lotteryNumberFormat();
          }
        }

        this.$emit('change', {
          index: payload.index,
          selected: payload.selected,
          selecteds: selecteds
        });
      },
    }

  };


  // 数字選択：状態＋ボタン（絵札）
  Components.LOTTERY_CARDS_SELECTOR = {
    template: '<div class="m_lotteryNumInputNumbers" ' +
                'v-bind:class="wrapClass">' +
                '<lottery-cards-states ' +
                  'v-bind:current="current" ' +
                  'v-bind:length="length" ' +
                  'v-bind:selecteds="selecteds" ' +
                  'v-on:click="onChangeCurrent"></lottery-cards-states>' +
                '<lottery-card-buttons ' +
                  'v-bind:default-select-type="defaultSelectType" ' +
                  'v-bind:current="current" ' +
                  'v-bind:length="length" ' +
                  'v-bind:first="first" ' +
                  'v-bind:last="last" ' +
                  'v-bind:selected="selecteds[current]" ' +
                  'v-on:next="onNext" ' +
                  'v-on:change="onChangeNumber"></lottery-card-buttons>' +
                '<quick-pick-layer v-if="isQuickPick">' +
                  '<div class="m_lotteryNum_quickTxt">' +
                    '<div class="m_lotteryNum_quickTxt_inner">' +
                      '<p>クイックピックで申込絵柄選択中</p>' +
                      '<p class="u_fontS">コンピュータが自動で選んだ申込絵柄は、購入完了後に<br>マイページの「購入履歴詳細」から確認できます。</p>' +
                    '</div>' +
                  '</div>' +
                '</quick-pick-layer>' +
              '</div>',
    components: {
      'quick-pick-layer'      : Components.LOTTERY_ITEM_QUICKPICK_LAYER,
      'lottery-cards-states': Components.LOTTERY_CARDS_ITEM_STATES,
      'lottery-card-buttons': Components.LOTTERY_CARD_BUTTONS_SELECT_ONLY
    },
    props: {
      length: {
        type: Number,
        default: 4
      },
      defaultSelectType: {
        type: String,
        default: 'myself' // myself|favorite
      },
      selecteds: {
        type: Array,
        default: function() {
          return [];
        }
      },
      betType: {
        type: Number,
        default: -1
      },
      first: {
        type: Number,
        default: 0
      },
      last: {
        type: Number,
        default: 9
      }
    },
    data: function() {
      return {
        current: 0,
        prevCurrent: -1
      };
    },
    computed: {
      isQuickPick: function() {
        var s = this.selecteds;
        return !!s.length && ('quickpick' === s[0].selectType) ? true : false;
      },
      wrapClass: function() {
        return {
          'm_lotteryNumInputNumbers__numbers3': 3 === this.length
        };
      },
      isMini: function() {
        return 'mini' === this.betType;
      },
    },
    watch: {
      selecteds: {
        handler: function() {
          this.setCurrent();
        },
        deep: true
      },
      current: function(val, oldVal) {
        this.prevCurrent = oldVal;
      }
    },
    mounted: function() {
      this.setCurrent();
    },
    methods: {
      /**
       * @param   {bool}   isSetCurrent - setCurrentを実行するか
       */
      refreshCurrent: function(isSetCurrent) {
        isSetCurrent = (typeof isSetCurrent === 'undefined') ? true : isSetCurrent;

        this.prevCurrent = -1;

        if (isSetCurrent) {
          this.setCurrent();
        }
      },
      /**
       * @return   {number}   -1:not found
       */
      getEmptyIndex: function() {
        var s = this.selecteds;

        if (!s.length) return 0;

        return _.findIndex(this.selecteds, function(o) {
          return !o.selectType;
        });
      },
      /**
       * @param   {number}   value
       */
      setCurrent: function(value) {
        this.current = (typeof value === 'undefined') ? this.getCurrent() : value;
      },
      /**
       * @return   {number}
       */
      getCurrent: function() {
        var emptyIndex = this.getEmptyIndex();
        if (this.selecteds.length === 0) {
          if (emptyIndex > -1) {
            // 未設定有り：最初の未設定値に移動して処理完了
            return emptyIndex;
          }
        }

        var isLoad = this.prevCurrent === -1;
        var next = isLoad ? 0 : (this.current + 1);
        var isLast = next >= this.length;
        var isDisabled;

        if (isLast) {
          // 全設定済みで最後の場合は移動しない
          return this.current;
        }

        isDisabled = this.getIsDisabled(next);

        if (isLoad && !isDisabled) {
          // ロード時：OK
          this.prevCurrent = next;
          return next;

        } else if (isLoad && isDisabled) {
          // ロード時：再取得
          this.prevCurrent = next;
          this.current = next;
          return this.getCurrent();

        } else if (isDisabled) {
          // 再取得
          this.current = next;
          return this.getCurrent();

        } else {
          // OK
          return this.current;
        }
      },

      onNext: function() {
        var isLoad = this.prevCurrent === -1;
        var next = this.current + 1;
        var isLast = next >= this.length;
        var isDisabled;

        if (isLast) {
          // 全設定済みで最後の場合は最初へ
          next = 0;
          this.current = 0;
        }

        isDisabled = this.getIsDisabled(next);

        if (isLoad && !isDisabled) {
          // ロード時：OK
          this.prevCurrent = next;
          this.current = next;

        } else if (isLoad && isDisabled) {
          // ロード時：再取得
          this.prevCurrent = next;
          this.current = next;
          this.current = this.onNext();

        } else if (isDisabled) {
          // 再取得
          this.current = next;
          this.current = this.onNext();

        } else {
          // OK
          this.current = next;
        }
      },

      /**
       * @return   {number}
       */
      getIsDisabled: function(index) {
        var s = this.selecteds;
        return !!s.length && !!s[index] && ('disabled' === s[index].selectType);
      },

      /**
       * @param   {number}   value
       */
      onChangeCurrent: function(value) {
        this.setCurrent(value);
      },
      /**
       * @param   {object}   payload
       *          {number}   payload.index
       *          {object}   payload.selected - value, selectType
       */
      onChangeNumber: function(payload) {
        if ( !payload || (typeof payload !== 'object')
              || !payload.hasOwnProperty('index') || !payload.selected ) return;

        var selecteds = _.cloneDeep(this.selecteds);

        for (var i = 0, len = this.length; i < len; ++i) {
          if (i === payload.index) {
            // update
            selecteds[i] = payload.selected;
          } else if (typeof selecteds[i] === 'undefined') {
            // create null object
            selecteds[i] = this.$store.getters.lotteryNumberFormat();
          }
        }

        this.$emit('change', {
          index: payload.index,
          selected: payload.selected,
          selecteds: selecteds
        });
      },
    }

  };


})(window, document, Vue);