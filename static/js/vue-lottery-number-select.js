/**
 * @fileoverview
 * vue-lottery-number-select.js
 * 数選用（ロト/ナンバーズ）
 *
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


  // Local Mixins
  var Mixins = Vue.__mixins = Vue.__mixins || {};
  // Store Modules
  var Stores = Vuex.__stores = Vuex.__stores || {};
  // Local Components
  var Components = Vue.__components = Vue.__components || {};


  // 数選基本情報
  Stores.lotteryNumberSelectProduct = $.extend(true, Stores.PRODUCT, {
    state: {
      name : '', // {string}
      perPageLength: 5, //{number}
      numberSort: '', //''|asc|desc
      selectCount: 0, //{number}
      numberRange: {
        first: 0, //{number}
        last : 10, //{number}
        group : {} //{object}
      },
      betTypes: [
        {
          title: 'ストレート', //{string}
          value: 'straight', //{string}
          disabled: false,   //{boolean}
        },
        {
          title: 'ボックス',
          value: 'box',
          disabled: false,
        },
        {
          title: 'セット',
          value: 'set',
          disabled: false,
        },
        {
          title: 'ミニ',
          value: 'mini',
          disabled: false,
        },
      ]
    },
    getters: {
      /**
       * 製品名を返す
       * @return   {string} - state.name
       */
      productName: function(state) {
        return state.name;
      },
      /**
       * UIタイプを返す
       * @return   {string} - loto|numbers|cards|bingo
       */
      uiType: function(state, getters) {
        var first = getters.numberRange('first');
        var last = getters.numberRange('last');
        if (first === 1 && last === 5) {
          return 'cards';
        } else if (first === 1 && last === 40) {
            return 'bingo';
        } else {
        return (first > 0) ? 'loto' : 'numbers';
        }
      },
      /**
       * UIタイプがロトかを返す
       * @return   {boolean}
       */
      isUiLoto: function(state, getters) {
        return 'loto' === getters.uiType;
      },
      /**
       * UIタイプが絵札かを返す
       * @return   {boolean}
       */
      isUiCards: function(state, getters) {
        return 'cards' === getters.uiType;
      },
      /**
       * UIタイプがナンバーズかを返す
       * @return   {boolean}
       */
      isUiNumbers: function(state, getters) {
        return 'numbers' === getters.uiType;
      },
      /**
       * 製品がナンバーズ3かを返す
       * @return   {boolean}
       */
      isUiNumbers3: function(state, getters) {
        return (3 === getters.selectCount);
      },
      /**
       * 製品がナンバーズ4かを返す
       * @return   {boolean}
       */
      isUiNumbers4: function(state, getters) {
        return (4 === getters.selectCount);
      },
      /**
       * UIタイプがビンゴかを返す
       * @return   {boolean}
       */
      isUiBingo: function(state, getters) {
        return 'bingo' === getters.uiType;
      },
      /**
       * （引数targetの）購入合計枠数を返す
       * ※done(選択完了)状態でフィルタ
       */
      totalNsItemCount: function(state, getters) {
        /**
         * @param   {string}   target - default|continuation
         * @return  {number}
         */
        return function(target) {
          target = target || getters.route;

          var items = getters['productItems/items'](target);
          var item, _state, count = 0;

          for (var i = 0, len = items.length; i < len; ++i) {
            item = items[i];
            _state = getters['productItems/item/state'](i, target);

            if ('done' === _state) {
              count++;
            }
          }

          return count;
        };
      },
      /**
       * （引数targetの）購入合計数（購入口数×継続回数の枠数分）を返す
       * ※done(選択完了)状態でフィルタ
       */
      totalCount: function(state, getters) {
        /**
         * @param   {string}   target - default|continuation
         * @return  {number}
         */
        return function(target) {
          target = target || getters.route;

          var items = getters['productItems/items'](target);
          var item, _state, count = 0;

          for (var i = 0, len = items.length; i < len; ++i) {
            item = items[i];
            _state = getters['productItems/item/state'](i, target);

            if ('done' === _state) {
              // 継続回数が1以上の場合は、購入口数×継続回数
              count += item.continuationCount
                          ? (item.purchaseCount * item.continuationCount)
                          : item.purchaseCount;
            }
          }

          return count;
        };
      },
      /**
       * （引数targetの）購入合計金額を返す
       * ※done(選択完了)状態でフィルタ
       */
      totalPrice: function(state, getters) {
        /**
         * @param   {string}   target - default|continuation
         * @return  {number}
         */
        return function(target) {
          target = target || getters.route;

          var totalCount = getters.totalCount(target);

          return totalCount * getters.price;
        };
      },
      /**
       * 1ページあたりに表示する購入枠数を返す（PC表示）
       * @return   {number} - state.perPageLength
       */
      perPageLength: function(state) {
        return state.perPageLength;
      },
      /**
       * 選択する数字の個数を返す
       * @return   {number} - state.selectCount
       */
      selectCount: function(state) {
        return state.selectCount;
      },
      /**
       * 選択数字のソート順を返す
       * @return   {string} - ''|asc|desc  (state.numberSort)
       */
      numberSort: function(state) {
        return state.numberSort;
      },
      /**
       * 選択数字の範囲（開始または終了値）を返す
       */
      numberRange: function(state) {
        /**
         * @param   {string}   property - first|last
         * @return  {number}
         */
        return function(property) {
          return state.numberRange[property];
        };
      },
      /**
       * すべての申し込みタイプを返す
       */
      betTypes: function(state, getters) {
        // @return   {array<object>}
        return function() {
          var types = state.betTypes;

          if (getters.isUiNumbers4) {
            // ナンバーズ4はミニを除いた値を返す
            types = _.filter(state.betTypes, function(o) { return 'mini' !== o.value; });
          }

          return _.cloneDeep(types);
        };
      },
      /**
       * 引数numbersの配列値（数字）が、すべて同じ数字かどうかを返す
       */
      isSameNumbers: function(state, getters) {
        /**
         * @param   {array<object>}   numbers
         * @return  {boolean}
         */
        return function(numbers) {
          var selectCount = getters.selectCount;
          var count = _.countBy(numbers, function(o) {
            return o.value;
          });

          var result = _.find(count, function(_c) { return _c === selectCount; });

          return !!result && ('' !== numbers[0].value);
        };
      },
    },

  });

  // 登録済みお気に入り数字
  Stores.favoriteNumbers = {
    namespaced: true,

    state: {
      numbers: [] //{array<number|empty string>}
    },
    getters: {
      /**
       * お気に入り数字を数選番号フォーマットの形式に変換して返す
       * 例） [1, ''] -> [{value: 1, selectType: 'favorite'}, {value: '', selectType: ''}]
       * @return   {array<object>}
       */
      numbers: function(state, getters, rootState, rootGetters) {
        var items = [];
        var stateItems = state.numbers;

        var createNumbers = function(numbers) {
          var _nums = [];
          var value, selectType;

          for (var i = 0, len = numbers.length; i < len; ++i) {
            value = numbers[i];
            selectType = ('' !== value) ? 'favorite' : '';

            _nums.push(
              rootGetters.lotteryNumberFormat(value, selectType)
            );
          }

          return _nums;
        };

        for (var i = 0, len = stateItems.length; i < len; ++i) {
          items.push( createNumbers(stateItems[i]) );
        }

        return items;
      }
    }
  };

  // 数選組み合わせ数字アイテム
  Stores.lotteryNumberSelectItems = {
    namespaced: true,

    state: {
      maxItemCount: {
        default: 25, //{number}
        continuation: 25,
      },
      current: {
        default: 0, //{number}
        continuation: 0
      },
      pagerRange: {
        default: {
          first: 0 //{number}
        },
        continuation: {
          first: 0
        }
      },
      transition: {
        enter: 'slideInLeft', //{string}
        leave: 'slideOutRight'
      },
      items: {
        default: [], //{array<object>}
        continuation: [],
      }
    },
    getters: {
      /**
       * （引数targetの）すべての購入枠を返す
       */
      items: function(state, getters, rootState, rootGetters) {
        /**
         * @param   {string}   target - default|continuation
         * @return  {array<object>} - state.items[target]
         */
        return function(target) {
          target = target || rootGetters.route;
          return state.items[target];
        };
      },
      /**
       * （引数targetの）currentを返す
       */
      current: function(state, getters, rootState, rootGetters) {
        /**
         * @param   {string}   target - default|continuation
         * @return  {number} - state.current[target]
         */
        return function(target) {
          target = target || rootGetters.route;
          return state.current[target];
        };
      },
      /**
       * （引数targetの）currentの購入枠の状態を返す
       */
      currentState: function(state, getters, rootState, rootGetters) {
        /**
         * @param   {string}   target - default|continuation
         * @return  {string} - unSelect|done|edit
         */
        return function(target) {
          target = target || rootGetters.route;

          var current = getters.current(target);

          return getters['item/state'](current, target);
        };
      },
      /**
       * lottery-group-items-pagerコンポーネント、
       * （引数targetの）表示中の購入枠の範囲（開始値）を返す
       * ※現状、stateがfirstだけなので、targetはfirst固定
       * ※返り値は、index値（実際の表示値-1の値）
       */
      pagerRange: function(state, getters, rootState, rootGetters) {
        /**
         * @param   {string}   target - default|continuation
         * @return  {object} - state.pagerRange[target]
         */
        return function(target) {
          target = target || rootGetters.route;

          return state.pagerRange[target];
        };
      },
      /**
       * （引数targetの）unSelect（未選択）状態の購入枠を昇順に検索して、
       * 該当購入枠のindex値を返す
       */
      firstUnSelectIndex: function(state, getters, rootState, rootGetters) {
        /**
         * @param   {string}   target - default|continuation
         * @param   {number}   firstIndex - 検索開始index
         * @return  {number} - unSelectがない場合は-1を返す
         */
        return function(target, firstIndex) {
          target = target || rootGetters.route;

          var items = getters.items(target);
          var f = (typeof firstIndex === 'undefined') ? getters.pagerRange(target).first : firstIndex;

          for (var i = f, len = items.length; i < len; ++i) {
            if ('unSelect' === getters['item/state'](i, target)) {
              return i;
            }
          }

          return -1;
        };
      },
      /**
       * （引数targetの）購入枠の最大数を返す
       */
      maxItemCount: function(state, getters, rootState, rootGetters) {
        /**
         * @param   {string}   target - default|continuation
         * @return  {number} - state.maxItemCount[target]
         */
        return function(target) {
          target = target || rootGetters.route;

          return state.maxItemCount[target];
        };
      },
      /**
       * （引数targetの）currentが最後の購入枠かどうかを返す
       */
      isLast: function(state, getters, rootState, rootGetters) {
        /**
         * @param   {string}   target - default|continuation
         * @return  {boolean}
         */
        return function(target) {
          target = target || rootGetters.route;

          var lastIndex = getters.items(target).length - 1;
          var current = getters.current(target);

          return current === lastIndex;
        };
      },
      /**
       * （引数targetの）購入枠の数が最大数かどうかを返す
       */
      isMax: function(state, getters, rootState, rootGetters) {
        /**
         * @param   {string}   target - default|continuation
         * @return  {boolean}
         */
        return function(target) {
          target = target || rootGetters.route;

          var max = getters.maxItemCount(target);
          var len = getters.items(target).length;

          return len === max;
        };
      },
      /**
       * （引数targetの）次の申し込み数字が利用できるかを返す
       * 購入枠が最大数かつunSelect(未選択)状態の購入枠がない場合はfalseを返す
       */
      canToNext: function(state, getters, rootState, rootGetters) {
        /**
         * @param   {string}   target - default|continuation
         * @return  {boolean}
         */
        return function(target) {
          target = target || rootGetters.route;

          var isMax = getters.isMax(target);
          var firstUnSelect;

          if (!isMax) {
            // 最大数でない場合は次への移動OK
            return true;
          }

          firstUnSelect = getters.firstUnSelectIndex(target, 0);

          if (firstUnSelect > -1) {
            // 未選択がある場合は移動OK
            return true;
          }

          return false;
        }
      },
      /**
       * transition nameを返す
       */
      transition: function(state) {
        /**
         * @param   {string}   type - enter|leave
         * @return  {string} - state.transition[type]
         */
        return function(type) {
          return state.transition[type];
        };
      }
    },
    mutations: {
      /**
       * current更新
       * state.current[target]をpayload.value値で更新
       * @param   {object}   payload
       *          {string}   payload.target - default|continuation
       *          {number}   payload.value  - update state.current[target]
       */
      UPDATE_CURRENT: function(state, payload) {
        var target = payload.target;
        var value  = payload.value;

        state.current[target] = value;
      },
      /**
       * 購入枠を更新
       * state.items[target][index]をpayload.properies値で更新
       * @param   {object}   payload
       *          {string}   payload.target - default|continuation
       *          {number}   payload.index
       *          {object}   properies - update properies
       */
      UPDATE_ITEM: function(state, payload) {
        var target = payload.target;
        var index  = payload.index;
        var properies = payload.properies;

        var item = state.items[target][index];

        var pushNumbers = function(item, numbers) {
          for (var i = 0, len = numbers.length; i < len; ++i) {
            item.numbers.push(numbers[i]);
          }
        };

        for (var key in properies) {
          if ('numbers' === key) {
            item.numbers.splice(0, item.numbers.length);
            pushNumbers(item, properies.numbers);
          } else {
            item[key] = properies[key];
          }
        }
      },
      /**
       * 購入枠を追加
       * state.items[target]にvalue値をpush
       * @param   {object}   payload
       *          {string}   payload.target - default|continuation
       *          {object}   payload.value - getters['item/itemFormat']
       */
      PUSH_ITEM: function(state, payload) {
        var target = payload.target;
        var value  = payload.value;

        state.items[target].push(value);
      },
      /**
       * transition[name]を更新
       * state.transitionをpayload値で更新
       * @param   {object}   payload
       *          {string}   payload.enter
       *          {string}   payload.leave
       */
      UPDATE_TRANSITION: function(state, payload) {
        state.transition.enter = payload.enter;
        state.transition.leave = payload.leave;
      },

      /**
       * グループページャーの状態を更新
       * state.pagerRange[target].firstをfirst値で更新
       * @param   {object}   payload
       *          {string}   payload.target - default|continuation
       *          {number}   payload.first
       */
      UPDATE_PAGER_RANGE: function(state, payload) {
        var target = payload.target;
        var first  = (payload.first > -1) ? payload.first : 0;

        state.pagerRange[target].first = first;
      }
    },
    actions: {
      /**
       * transition[name]更新(commit)
       * transition[name]を算出して、state.transitionを更新
       * @param   {object}   payload
       *          {string}   payload.isPrev
       */
      changeTransition: function(context, payload) {
        var isPrev = !!payload.isPrev;
        var enter = isPrev ? 'slideInLeft'   : 'slideInRight';
        var leave = isPrev ? 'slideOutRight' : 'slideOutLeft';

        context.commit('UPDATE_TRANSITION', {
          enter: enter,
          leave: leave
        });
      },

      /**
       * currentを更新(dispatch)
       * next|prevに該当するcurrent値を算出
       * @param   {object}   payload
       *          {string}   payload.target - default|continuation
       *          {string}   payload.value  - next|prev
       */
      toNextPrev: function(context, payload) {
        var target = payload.target || context.rootGetters.route;
        var value  = ('value' in payload) ? payload.value : 'next';

        var current = context.getters.current(target);

        payload.value = ('prev' === value) ? (current - 1) : (current + 1);

        context.dispatch('changeCurrentCommon', payload);
      },

      /**
       * current更新(dispatch)
       * unSelect(未選択)状態の購入枠を昇順検索して、該当値をcurrent値とする
       * ※（isAddがtrue時）該当なしの場合は、購入枠を追加して追加枠のcurrent値で更新
       * ※購入枠が最大数に達している場合は、現在のcurrent値で更新
       * @param   {object}   payload
       *          {string}   payload.target - default|continuation
       *          {string}   payload.value  - empty
       *          {boolean}  payload.isAdd
       */
      toNextEmpty: function(context, payload) {
        var target = payload.target || context.rootGetters.route;
        var current  = context.getters.current(target);

        var firstUnSelect = context.getters.firstUnSelectIndex(target);
        var isMax = context.getters.isMax(target);
        var items;

        if (firstUnSelect > -1) {
          // 最初の空購入枠へ
          payload.value = firstUnSelect;

        } else if (isMax) {
          firstUnSelect = context.getters.firstUnSelectIndex(target, 0);
          payload.value = (firstUnSelect > -1) ?firstUnSelect : current;

        } else if (payload.isAdd) {
          // 次の申し込み数字がない時は追加して移動
          context.dispatch('insertItem', payload);
          items = context.getters.items(target);
          payload.value = items.length - 1;

        } else {
          // 移動なし
          payload.value = current;
        }

        context.dispatch('changeCurrentCommon', payload);
      },

      /**
       * current更新(dispatch)
       * payload.value値で判定して、該当処理にdispatch
       * @param   {object}         payload
       *          {string}         payload.target - default|continuation
       *          {number|string}  payload.value  - next|prev|{number}
       */
      changeCurrent: function(context, payload) {
        payload = payload || {};

        var value = ('value' in payload) ? payload.value : 'next';

        if ( ('next' === value) || ('prev' === value) ) {
          // next or prev
          context.dispatch('toNextPrev', payload);

        } else if ('empty' === value) {
          // empty
          context.dispatch('toNextEmpty', payload);

        } else if ('first' === value) {
          // first
          payload.value = 0;
          context.dispatch('changeCurrentCommon', payload);

        } else {
          // index
          context.dispatch('changeCurrentCommon', payload);
        }

      },

      /**
       * current更新(commit, dispatch)
       * および連動する各種処理
       * @param   {object}    payload
       *          {string}    payload.target - default|continuation
       *          {number}    payload.value  - new current
       */
      changeCurrentCommon: function(context, payload) {
        payload = payload || {};

        var target     = payload.target || context.rootGetters.route;
        var newCurrent = payload.value;

        var current = context.getters.current(target);
        var _state  = context.getters['item/state'](current, target);

        // 編集中は変更させない
        if ('edit' === _state) return;

        // 変更なし
        if ( newCurrent === current ) return;

        var newItem = context.getters['item/item'](newCurrent, target);

        // 変更先がない
        if (!newItem) return;

        // 数字未選択なら、データリセット後にcurrent変更
        if ('unSelect' === _state) {
          context.dispatch('resetItem', {
            target: target,
            index : current
          });
        }

        // transition name変更
        context.dispatch('changeTransition', {
          isPrev: newCurrent < current
        });

        // 変更
        // 同期処理のために通常購入/継続購入両方へcommit
        context.commit('UPDATE_CURRENT', {
          target: target,
          value : newCurrent
        });
      },

      /**
       * 購入枠をcountで指定した個数分追加(dispatch)
       * @param   {object}   payload
       *          {string}   payload.target - default|continuation
       *          {number}   payload.count  - insert count
       */
      insertItems: function(context, payload) {
        payload = payload || {};
        payload.target = payload.target || context.rootGetters.route;

        var count  = (typeof payload.count === 'undefined') ? 1 : payload.count;

        // 挿入件数がない
        if (count < 1) return;

        for (var i = 0; i < count; ++i) {
          context.dispatch('insertItem', payload);
        }
      },
      /**
       * 購入枠を追加(commit)
       * @param   {object}   payload
       *          {string}   payload.target - default|continuation
       */
      insertItem: function(context, payload) {
        payload = payload || {};

        var target = payload.target || context.rootGetters.route;
        var isMax = context.getters.isMax(target);

        if (isMax) return; //最大数

        var elseTarget = ('default' === target) ? 'continuation' : 'default';

        // 同期処理のために通常購入/継続購入両方へcommit
        context.commit('PUSH_ITEM', {
          target: target,
          value : context.getters['item/itemFormat']('continuation' === target)
        });
      },

      /**
       * 購入枠をすべて更新(dispatch)
       * @param   {payload}  payload
       *          {string}   payload.target - default|continuation
       *          {object}   payload.properies
       */
      updateItems: function(context, payload) {
        payload = payload || {};

        var target    = payload.target || context.rootGetters.route;
        var properies = payload.properies;

        var items = context.getters.items(target);

        for (var i = 0, len = items.length; i < len; ++i) {
          context.dispatch('updateItem', {
            target: target,
            index : i,
            properies: properies
          });
        }
      },
      /**
       * 購入枠を更新(commit)
       * @param   {payload}  payload
       *          {string}   payload.target - default|continuation
       *          {number}   payload.index
       *          {object}   payload.properies
       */
      updateItem: function(context, payload) {
        payload = payload || {};

        var target    = payload.target || context.rootGetters.route;
        var index     = payload.index;
        var properies = payload.properies;

        var maxSelectCount = context.rootGetters.selectCount;

        if (properies.isQuickPick) {
          properies.numbers = [];
          for (var i = 0; i < maxSelectCount; ++i) {
            properies.numbers.push(
              context.rootGetters.lotteryNumberFormat('', 'quickpick')
            );
          }
        }

        var elseTarget = ('default' === target) ? 'continuation' : 'default';
        var elseTargetProps = $.extend(true, {}, properies);

        // 継続回数は同期させない
        if ('continuationCount' in elseTargetProps) {
          delete elseTargetProps.continuationCount;
        }

        // 同期処理のために通常購入/継続購入両方へcommit
        context.commit('UPDATE_ITEM', {
          target: target,
          index : index,
          properies: properies
        });
      },

      /**
       * 購入枠の内容をリセット(commit)
       * @param   {payload}  payload
       *          {string}   payload.target - default|continuation
       *          {number}   payload.index
       */
      resetItem: function(context, payload) {
        payload = payload || {};

        var target = payload.target || context.rootGetters.route;
        var index  = payload.index;

        var elseTarget = ('default' === target) ? 'continuation' : 'default';

        // 同期処理のために通常購入/継続購入両方へcommit
        context.commit('UPDATE_ITEM', {
          target: target,
          index : index,
          properies: context.getters['item/itemFormat']('continuation' === target)
        });
      },

      /**
       * グループページャーの状態を更新
       * state.pagerRange[target].firstをfirst値で更新(commit)
       * @param   {payload}  payload
       *          {string}   payload.target - default|continuation
       *          {number}   payload.first
       */
      updatePagerRange: function(context, payload) {
        payload.target = payload.target || context.rootGetters.route;

        context.commit('UPDATE_PAGER_RANGE', payload);
      }
    },

    modules: {
      item: {
        namespaced: true,

        getters: {
          /**
           * （引数targetとindexに該当する）購入枠を返す
           */
          item: function(state, getters, rootState, rootGetters) {
            /**
             * @param   {number}   index
             * @param   {string}   target - default|continuation
             * @return  {object}
             */
            return function(index, target) {
              target = target || rootGetters.route;

              return rootGetters['productItems/items'](target)[index];
            };
          },
          /**
           * （引数に該当する購入枠の）申し込みタイプを返す
           */
          betType: function(state, getters, rootState, rootGetters) {
            /**
             * @param   {number}   index
             * @param   {string}   target - default|continuation
             * @return  {string} - straight|box|set|mini
             */
            return function(index, target) {
              var item = getters.item(index, target) || {};

              return item.betType;
            };
          },
          /**
           * （引数に該当する購入枠の）選択済み数字の個数を返す
           */
          selectedCount: function(state, getters, rootState, rootGetters) {
            /**
             * @param   {number}   index
             * @param   {string}   target - default|continuation
             * @return  {number}
             */
            return function(index, target) {
              var item = getters.item(index, target) || {};

              return rootGetters.selectedNumbersCount(item.numbers);
            };
          },
          /**
           * （引数に該当する購入枠の）無効数字(disabled)の個数を返す
           */
          disabledNumbersCount: function(state, getters, rootState, rootGetters) {
            /**
             * @param   {number}   index
             * @param   {string}   target - default|continuation
             * @return  {number}
             */
            return function(index, target) {
              var item = getters.item(index, target) || {};

              return rootGetters.disabledNumbersCount(item.numbers);
            };
          },
          /**
           * （引数に該当する購入枠の）選択が必要な残りの数字の個数を返す
           */
          restCount: function(state, getters, rootState, rootGetters) {
            /**
             * @param   {number}   index
             * @param   {string}   target - default|continuation
             * @return  {number}
             */
            return function(index, target) {
              target = target || rootGetters.route;

              var selectedCount  = getters.selectedCount(index, target);
              var maxSelectCount = rootGetters.selectCount;

              return maxSelectCount - selectedCount;
            };
          },
          /**
           * （引数に該当する購入枠の）状態を返す
           * 未選択(unSelect)/選択完了(done)/編集中(edit)
           */
          state: function(state, getters, rootState, rootGetters) {
            /**
             * @param   {number}   index
             * @param   {string}   target - default|continuation
             * @return  {string} - unSelect|done|edit
             */
            return function(index, target) {
              target = target || rootGetters.route;

              var selectedCount = getters.selectedCount(index, target);
              var restCount     = getters.restCount(index, target);
              var disabledCount = getters.disabledNumbersCount(index, target);
              var betType       = getters.betType(index, target);

              if ( (selectedCount - disabledCount) < 1 ) {
                return 'unSelect';

              } else if (!restCount && rootGetters.isUiLoto) {
                return 'done';

              } else if (!restCount && rootGetters.isUiCards) {
                return 'done';

              } else if (!restCount && rootGetters.isUiBingo) {
                  return 'done';

              } else if (!restCount && !!betType) {
                return 'done';

              } else {
                return 'edit';
              }
            };
          },
          /**
           * 購入枠のフォーマットを返す
           */
          itemFormat: function(state, getters, rootState, rootGetters) {
            /**
             * @param   {boolean}  isContinuation
             * @param   {object}   defaultValues
             * @return  {object}
             */
            return function(isContinuation, defaultValues) {
              var format = $.extend(true, {
                purchaseCount    : 1,
                continuationCount: isContinuation ? 0 : 1,
                isQuickPick      : false,
                numbers: []
              }, defaultValues);

              if ( rootGetters.isUiNumbers && !format.hasOwnProperty('betType') ) {
                format.betType = '';
              }

              return format;
            };
          },
        },

      }
    } //productItems/modules

  };



  _ns.ModelToStore = {

    /**
     * items[n].numbersを数選・番号フォーマット{array<object>}へ変換したデータを返す
     * @param   {array<object>}   items
     * @param   {number}          selectCount
     * @return  {array<object>}
     */
    productItems: function(items, selectCount) {
      var _items = [];

      /**
       * @param  {array}   pushTarget
       * @param  {array}   numbers
       * @param  {number}  len
       */
      var insertQuickPickNumbers = function(pushTarget, numbers, len) {
        for (var i = 0; i < len; ++i) {
          pushTarget.push({value: '', selectType: 'quickpick'});
        }
      };
      var insertNumbers = function(pushTarget, numbers, numbersSsnhhShbt, betType) {
          for (var i = 0, len = numbers.length; i < len; ++i) {
            var selectType = 'myself';
            if(numbersSsnhhShbt[i] === '4' ){
                selectType = 'random';
            }
            if(i === 0 && betType==='mini'){
                if(numbers[i] === null){
                    pushTarget.push({"value": "", "selectType": "disabled"});
                }else{
                    pushTarget.push({"value": numbers[i] - 0, "selectType": "disabled"});
                }
            }else{
                pushTarget.push({"value": numbers[i] - 0, "selectType": selectType});
            }
          }
        };

      for (var i = 0, len = items.length; i < len; ++i) {
        _items.push({
          purchaseCount    : items[i].purchaseCount - 0,
          continuationCount: items[i].continuationCount - 0,
          isQuickPick      : !!items[i].isQuickPick,
          numbers          : [],
        });
        if (items[i].betType) {
          _items[i].betType = items[i].betType;
        }
        if (_items[i].isQuickPick) {
          insertQuickPickNumbers(_items[i].numbers, items[i].numbers, selectCount);
        } else {
          insertNumbers(_items[i].numbers, items[i].numbers, items[i].numbersSsnhhShbt, items[i].betType);
        }
      }

      return _items;
    },
  };




  Components.lotteryNumberSelectFormItemNumbers = {
    template: '<div>' +
                '<input type="hidden" ' +
//                  'v-for="number in _numbers" ' +
//                  'v-bind:name="name + \'[\' + index + \'][numbers][]\'" ' +
                  'v-bind:name="name + \'[\' + index + \'].mskmNum\'" ' +
//                  'v-bind:value=" \'disabled\' !== number.selectType ? number.value : \'-\' ">' +
//                  'v-bind:value=" \'disabled\' !== _numbers[0].selectType ? numbersArr : \'-\' ">' +
//                  'v-bind:value=" numbersArr.length !== 0 ? numbersArr : \'-\' ">' +
                  'v-bind:value=" numbersArr.length !== 0 ? numbersArr : \'\' ">' +
                  '<input type="hidden" ' +
                  'v-bind:name="name + \'[\' + index + \'].mskmNumSsnhhShbt\'" ' +
//                  'v-bind:value=" \'disabled\' !== _numbers[0].selectType ? ssnhhShbtArr : \'-\' ">' +
//                  'v-bind:value=" ssnhhShbtArr.length !== 0 ? ssnhhShbtArr : \'-\' ">' +
                  'v-bind:value=" ssnhhShbtArr.length !== 0 ? ssnhhShbtArr : \'\' ">' +
              '</div>',
    props: {
      numbers: {
        type: Array,
        default: function() {
            return [];
        }
      },
      index: {
        type: Number,
        required: true,
        default: 0
      },
      name: {
        type: String,
        default: 'number'
      }
    },
    computed: {
      sort: function() {
        return this.$store.getters.numberSort || ''; //asc|desc|''
      },
      _numbers: function() {
          if ('asc' === this.sort) {
          // 昇順
          return _.sortBy(this.numbers, [function(o) {
            return ('' === o.value) ? 99999 : o.value;
          }]);

        } else if ('desc' === this.sort) {
          // 降順
          return _.sortBy(this.numbers, [function(o) {
            return o.value;
          }]).reverse();

        } else {
          // no sort
          return this.numbers;
        }
      },
      numbersArr: function() {
          //selectType:myself|random|favorite|quickpick|disabled
          var concatNumber = '';
          // quickpickの場合、空を渡す。
          if (this._numbers[0].selectType ==='quickpick') {
              return concatNumber;
          }else{
            for (var i = 0; i < this._numbers.length; ++i) {
              if (this._numbers[i].selectType ==='disabled') {
                  //disabledしても数字を渡す（ミニの場合）
                  if(this._numbers[i].value !== null && this._numbers[i].value !== "" ){
                      concatNumber += this._numbers[i].value + ',';
                  }
              }else{
                  concatNumber += this._numbers[i].value + ',';
              }
            }
            return concatNumber.slice(0, -1);
          }
        },
        ssnhhShbtArr: function() {
            //selectType:myself|random|favorite|quickpick|disabled
            var concatSsnhhShbt = '';
            // quickpickの場合、空を渡す。
            if (this._numbers[0].selectType ==='quickpick') {
                return concatSsnhhShbt;
            }else{
              for (var i = 0; i < this._numbers.length; ++i) {
                  if (this._numbers[i].selectType ==='disabled') {
                      //disabledしても数字を渡す（ミニの場合）
                      if(this._numbers[i].value !== null && this._numbers[i].value !== ""){
                          concatSsnhhShbt += '1' + ',';
                      }
                  }else{
	                  var selectTypeCd = '';
	                  if ('myself' == this._numbers[i].selectType
	                      || 'favorite' == this._numbers[i].selectType) {
	                    selectTypeCd = '1';
	                  }
	                  if ('random' == this._numbers[i].selectType) {
	                    selectTypeCd = '4';
	                  }
	                  concatSsnhhShbt += selectTypeCd + ',';
                }
              }
              return concatSsnhhShbt.slice(0, -1);
            }
       }
    }
  };

  Components.lotteryNumberSelectFormItem = {
    template: '<div>' +
                '<template v-for="(value, property) in item">' +
                  // 選択数字以外
                  '<input-item-default ' +
                    'v-if=" \'numbers\' !== property " ' +
                    'v-bind:index="index" ' +
                    'v-bind:name="name" ' +
                    'v-bind:property="property" ' +
                    'v-bind:value="value"></input-item-default>' +
                  // 選択数字
                  '<input-item-numbers ' +
//                  'v-else-if="!item.isQuickPick" ' +
//                  'v-else-if="!item.qpRyUmu" ' +
                    'v-else ' +
                    'v-bind:numbers="value" ' +
                    'v-bind:index="index" ' +
                    'v-bind:name="name"></input-item-numbers>' +
                '</template>' +
              '</div>',
    components: {
      'input-item-numbers': Components.lotteryNumberSelectFormItemNumbers,
      'input-item-default': {
        template: '<input type="hidden" v-bind:name="_name" v-bind:value="value">',
        props: ['index', 'name', 'property', 'value'],
        computed: {
          _name: function() {
//              return this.name + '[' + this.index + '][' + this.property + ']';
            return this.name + '[' + this.index + '].' + this.property;
          }
        }
      }
    },
    props: {
      item: {
        type: Object,
        required: true,
        default: function() {
          return {};
        }
      },
      index: {
        type: Number,
        required: true,
        default: 0
      },
      name: {
        type: String,
        default: 'number'
      },
      storeTarget: {
        type: String,
        default: 'default'
      },
    },
  };

  /**
   * 数選input出力コンポーネント。以下の形になる（divを挟むが）
   * ※isQuickPick=1の場合は、numbersは出力されない
   * ※申込みタイプがない場合（ロト）は、betTypeは出力されない
   *
   * <input type="hidden" name="number[0][purchaseCount]" value="1">
   * <input type="hidden" name="number[0][continuationCount]" value="1">
   * <input type="hidden" name="number[0][isQuickPick]" value="0">
   * <input type="hidden" name="number[0][betType]" value="box">
   * <input type="hidden" name="number[0][numbers][]" value="1">
   * <input type="hidden" name="number[0][numbers][]" value="2">
   * <input type="hidden" name="number[0][numbers][]" value="...以下省略" >
   */
  Components.lotteryNumberSelectFormItems = {
    template: '<div>' +
                '<form-item ' +
                  'v-for="(item, i) in filterItems" ' +
                  'v-bind:key="i" ' +
                  'v-bind:item="item" ' +
                  'v-bind:index="i" ' +
                  'v-bind:store-target="storeTarget" ' +
                  'v-bind:name="name"></form-item>' +
              '</div>',
    components: {
      'form-item': Components.lotteryNumberSelectFormItem,
    },
    props: {
      items: {
        type: Array,
        required: true,
        default: function() {
          return [];
        }
      },
      name: {
        type: String,
        default: 'number'
      },
      storeTarget: {
        type: String,
        default: 'default'
      },
    },
    computed: {
      filterItems: function() {
        // 編集完了アイテムのみをfilter
        var _items = $.extend(true,[],_.filter(this.items, function(o, i) {
          var s = this.$store.getters['productItems/item/state'](i, this.storeTarget);
          return 'done' === s;
        }.bind(this)));

        for (var i = 0, len = _items.length; i < len; ++i) {
          // quickPickをnumberにcast
          _items[i].isQuickPick = _items[i].isQuickPick - 0; //number
          _items[i].knyKchsu = _items[i].purchaseCount;
          _items[i].kzkTimes = _items[i].continuationCount;
          _items[i].qpRyUmu = _items[i].isQuickPick;
          delete _items[i].purchaseCount;
          delete _items[i].continuationCount;
          delete _items[i].isQuickPick;
          if (null !== _items[i].betType) {
            _items[i].mskmtype = this.convMskmtype(_items[i].betType);
            delete _items[i].betType;
          }

          // 継続回数0はinputに出力しない
//          if (!_items[i].continuationCount) {
//            delete _items[i].continuationCount;
//          }
          if (!_items[i].kzkTimes) {
            _items[i].kzkTimes = 1;
          }
        }

        return _items;
      },
    },
    methods: {
      convMskmtype: function(betType) {
        if ('straight' === betType) {
          return '1';
        } else if ('box' === betType) {
          return '2';
        } else if ('set' === betType) {
          return '3';
        } else if ('mini' === betType) {
          return '5';
        } else {
          return '';
        }
      },
    },
  };


  // ページャー（単一アイテム切り替え）
  Vue.component('lottery-items-pager', {
    template: '<div class="m_lotteryNumPager">' +
                '<div class="m_lotteryNumPager_inner">' +
                  '<button type="button" class="m_lotteryNumPager_btn m_lotteryNumPager_btn__prev" ' +
                    'v-bind:class="prevBtnClass" ' +
                    'v-bind:disabled="isPrevDisabled" ' +
                    'v-on:click.prevent="onClick(\'prev\')">前へ</button>' +
                    '<span class="m_lotteryNumPager_current">{{ currentAlphabet }}</span>' +
                  '<button type="button" class="m_lotteryNumPager_btn m_lotteryNumPager_btn__next" ' +
                    'v-bind:class="nextBtnClass" ' +
                    'v-bind:disabled="isNextDisabled" ' +
                    'v-on:click.prevent="onClick(\'next\')">次へ</button>' +
                '</div>' +
              '</div>',
    props: {
      items: {
        type: Array,
        required: true,
        default: function() {
          return [];
        }
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      /**
       * @return  {string} - unSelect|edit|done
       */
      state: function() {
        return this.$store.getters['productItems/item/state'](this.current);
      },
      isEdit: function() {
        return 'edit' === this.state;
      },
      isUnSelect: function() {
        return 'unSelect' === this.state;
      },
      isPrevDisabled: function() {
        return this.disabled || this.isEdit || this.isFirst;
      },
      isNextDisabled: function() {
        return this.disabled
                  || this.isEdit
                  || (this.isUnSelect && this.isLastItem) //未選択で次の枠がない
                  || this.isLast;
      },
      current: function() {
        return this.$store.getters['productItems/current']();
      },
      currentAlphabet: function() {
        return String.fromCharCode(this.current + 65);
      },
      isFirst: function() {
        return this.current === 0;
      },
      // 挿入枠内での最後にcurrentがあるか
      isLastItem: function() {
        return this.current === (this.items.length - 1);
      },
      isLast: function() {
        var maxItemCount = this.$store.getters['productItems/maxItemCount']();
        return this.current === (maxItemCount - 1);
      },
      prevBtnClass: function() {
        if (this.isPrevDisabled) {
          return {'is_disabled': true};
        }
      },
      nextBtnClass: function() {
        if (this.isNextDisabled) {
          return {'is_disabled': true};
        }
      }
    },
    methods: {
      /**
       * @param   {string}   target - next|prev
       */
      onClick: function(target) {
        // setTimeoutする必要ないはずだが
        // iOSでtransitionがうまくいかないケースが発生するので入れている
        setTimeout(function() {
          this.onChangeCurrent(target);
        }.bind(this), 0);
      },
      /**
       * @param   {string}   target - next|prev
       */
      onChangeCurrent: function(target) {
        var isInsert = ('next' === target) && this.isLastItem && !this.isLast;

        if (isInsert) {
          this.$store.dispatch('productItems/insertItem');
        }
        this.$store.dispatch('productItems/changeCurrent', {
          value: target
        });
      }
    }
  });

  // ページャー（グループアイテム切り替え）
  Vue.component('lottery-group-items-pager', {
    template: '<ul class="m_lotteryNumPager2">' +
                '<li>' +
                  '<button type="button" class="m_lotteryNumPager2_btn m_lotteryNumPager2_btn__first" ' +
                    'v-bind:class="prevBtnClass" ' +
                    'v-bind:disabled="disabled || isFirst" ' +
                    'v-on:click.prevent="onClick(\'first\')">最初へ</button>' +
                '</li>' +
                '<li>' +
                  '<button type="button" class="m_lotteryNumPager2_btn m_lotteryNumPager2_btn__prev" ' +
                    'v-bind:class="prevBtnClass" ' +
                    'v-bind:disabled="disabled || isFirst" ' +
                    'v-on:click.prevent="onClick(\'prev\')">前へ</button>' +
                '</li>' +
                '<li class="m_lotteryNumPager2_current">' +
                  ' {{ rangeFirst }}-{{ rangeLast }}/{{ last }} ' +
                '</li>' +
                '<li>' +
                  '<button type="button" class="m_lotteryNumPager2_btn m_lotteryNumPager2_btn__next" ' +
                    'v-bind:class="nextBtnClass" ' +
                    'v-bind:disabled="disabled || isLast" ' +
                    'v-on:click.prevent="onClick(\'next\')">次へ</button>' +
                '</li>' +
                '<li>' +
                  '<button type="button" class="m_lotteryNumPager2_btn m_lotteryNumPager2_btn__last" ' +
                    'v-bind:class="nextBtnClass" ' +
                    'v-bind:disabled="disabled || isLast" ' +
                    'v-on:click.prevent="onClick(\'last\')">最後へ</button>' +
                '</li>' +
              '</ul>',
    props: {
      items: {
        type: Array,
        required: true,
        default: function() {
          return [];
        }
      },
      perPageLength: {
        type: Number,
        default: 5
      },
      disabled: {
        type: Boolean,
        default: false
      },
    },
    computed: {
      first: function() {
        return 0 + 1;
      },
      last: function() {
        return this.items.length;
      },
      current: function() {
        return this.$store.getters['productItems/current']();
      },
      totalPageCount: function() {
        return Math.ceil(this.last / this.perPageLength);
      },
      currentPage: function() {
        return this.getCurrentPage(this.current);
      },
      rangeFirst: function() {
        return this.getRangeFirst(this.currentPage);
      },
      rangeLast: function() {
        var end = (this.currentPage+1) * this.perPageLength;
        return (end < this.last) ? end : this.last;
      },
      isFirst: function() {
        return this.rangeFirst === this.first;
      },
      isLast: function() {
        return this.rangeLast === this.last;
      },
      prevBtnClass: function() {
        if (this.disabled || this.isFirst) {
          return {'is_disabled': true};
        }
      },
      nextBtnClass: function() {
        if (this.disabled || this.isLast) {
          return {'is_disabled': true};
        }
      }
    },
    watch: {
      rangeFirst: function() {
        this.emit();
      },
      last: function() {
        this.emit();
      }
    },
    mounted: function() {
      this.emit('mounted');
    },
    destroyed: function() {
      this.emit('destroyed');
    },
    methods: {
      /**
       * @param   {number}   current
       * @return  {number}
       */
      getCurrentPage: function(current) {
        return (current / this.perPageLength)|0;
      },
      /**
       * @param   {number}   currentPage
       * @return  {number}
       */
      getRangeFirst: function(currentPage) {
        var end = (currentPage+1) * this.perPageLength;
        return end - (this.perPageLength - 1);
      },
      /**
       * @param   {string}   target - first|prev|next|last
       * @return  {number}
       */
      getTempCurrent: function(target) {
        switch (target) {
          case 'first':
            return this.first - 1;
          case 'prev':
            return this.current - this.perPageLength;
          case 'next':
            return this.current + this.perPageLength;
          case 'last':
            return this.last - 1;
        }
      },
      /**
       * @param   {string}   target - first|prev|next|last
       */
      onClick: function(target) {
        var tempCurrent = this.getTempCurrent(target);
        var currentPage = this.getCurrentPage(tempCurrent);
        var current = this.getRangeFirst(currentPage) - 1;

        this.onChangeCurrent(current);
      },
      /**
       * @param   {number}   current
       */
      onChangeCurrent: function(current) {
        this.$store.dispatch('productItems/changeCurrent', {
          value: current
        });
      },
      /**
       * @param   {string}   eventName
       */
      emit: function(eventName) {
        eventName = eventName || 'change';

        var payload =  {
          currentPage   : this.currentPage,
          rangeFirst    : this.rangeFirst -1,
          rangeLast     : this.rangeLast -1,
          totalPageCount: this.totalPageCount,
        };

        if ('destroyed' === eventName) {
          payload.currentPage = 0;
          payload.rangeFirst = 0;
          payload.rangeLast = 0;
          payload.totalPageCount = 1;
        }

        this.$emit(eventName, payload);
      }
    }
  });


  Vue.component('lottery-button-favorite', {
    template: '<button-lottery class="m_lotteryNumInputFunc_btn m_btn__block" ' +
                'v-bind:disabled="disabled" ' +
                'v-on:click="$emit(\'click\', \'favorite\')">' +
                '<slot>お気に入り数字<br>から選択</slot>' +
              '</button-lottery>',
    props: {
      disabled: {type: Boolean, default: false}
    }
  });

  Vue.component('lottery-button-quickpick', {
    template: '<button-lottery class="m_lotteryNumInputFunc_btn m_btn__colorQuick m_btn__block" ' +
                'v-bind:disabled="disabled" ' +
                'v-on:click="$emit(\'click\', \'quickpick\')">' +
                '<slot>クイックピック</slot>' +
              '</button-lottery>',
    props: {
      disabled: {type: Boolean, default: false}
    }
  });

  Vue.component('lottery-button-reset', {
    template: '<button-lottery class="m_lotteryNumInputNum_btn2 m_btn__color2 m_btn__block" ' +
                'v-bind:disabled="disabled" ' +
                'v-on:click="$emit(\'click\', \'reset\')">' +
                '<slot>リセット</slot>' +
              '</button-lottery>',
    props: {
      disabled: {type: Boolean, default: false}
    }
  });

  Vue.component('lottery-button-next', {
    template: '<button-lottery class="m_lotteryNumInputForm_btn m_btn__block" ' +
                'v-bind:disabled="disabled" ' +
                'v-on:click="$emit(\'click\', \'next\')">' +
                '<slot>次の<br>申込数字へ</slot>' +
              '</button-lottery>',
    props: {
      disabled: {type: Boolean, default: false}
    }
  });

  Vue.component('lottery-button-close', {
    template: '<button-lottery class="m_btn__block" ' +
                'v-bind:disabled="disabled" ' +
                'v-on:click="$emit(\'click\', \'close\')">' +
                '<slot>閉じる</slot>' +
              '</button-lottery>',
    props: {
      disabled: {type: Boolean, default: false}
    }
  });

  Vue.component('lottery-button-add', {
    template: '<button-lottery class="m_btn__color2 m_btn__block" ' +
                'v-bind:disabled="disabled" ' +
                'v-on:click="$emit(\'click\', \'add\')">' +
                '<slot>＋さらに「組合せ」を追加</slot>' +
              '</button-lottery>',
    props: {
      disabled: {type: Boolean, default: false}
    }
  });

  Components.lotteryButtonRandom = {
    template: '<button-lottery class="m_lotteryNumInputFunc_btn m_btn__colorRandom m_btn__block" ' +
                'v-bind:disabled="disabled" ' +
                'v-on:click="onClick">' +
                '<slot>ランダム選択</slot>' +
              '</button-lottery>',
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      numbers: {
        type: Array,
        required: true,
        default: function() {
          return [];
        }
      },
      selectCount: {
        type: Number,
        default: 1
      }
    },
    methods: {
      onClick: function() {
        var randNums = this.getRandNumbers();
        this.$emit('click', 'random', randNums);
      },

      /**
       * @return   {array<object>}
       */
      getRandNumbers: function() {
        var targets = this.getTargetsNums();
        var nums = [], rand;

        // @return   {number}
        var getRand = function() {
          var rand = targets[(Math.random() * targets.length | 0)];

          // すでに選択されている
          var isHit = _.find(nums, function(o) { return rand === o.value; });

          return (typeof isHit === 'undefined') ? rand : getRand();
        };

        for (var i = 0; i < this.selectCount; ++i) {
          nums.push(
            this.$store.getters.lotteryNumberFormat(getRand(), 'random')
          );
        }

        return nums;
      },

      /**
       * 選択可能な数字リストを返す
       * @return   {array<number>}
       */
      getTargetsNums: function() {
        var nums = _.filter(this.numbers, function(o) {
          return !o.selectType || (o.selectType === 'random');
        });
        return _.map(nums, _.property('value'));
      }
    }
  };

  Components.lotteryButtonRandomNumbers = {
    extends: Components.lotteryButtonRandom,

    props: {
      betType: {
        type: String,
        default: ''
      },
    },
    computed: {
      isBoxSet: function() {
        return (this.betType === 'box') || (this.betType === 'set');
      }
    },
    methods: {
      /**
       * @return   {array<object>}
       */
      getRandNumbers: function() {
        var targets = this.getTargetsNums();
        var nums = [], rand;

        // @return   {number}
        var getRand = function() {
          return targets[(Math.random() * targets.length | 0)];
        };

        for (var i = 0; i < this.selectCount; ++i) {
          nums.push(
            this.$store.getters.lotteryNumberFormat(getRand(), 'random')
          );
        }

        return this.validate(nums) ? nums : this.getRandNumbers();
      },

      /**
       * 選択可能な数字リストを返す
       * @return   {array<number>}
       */
      getTargetsNums: function() {
        return _.map(this.numbers, _.property('value'));
      },

      /**
       * 申し込みタイプがボックスかセットの時
       * 全同数字になっていないかをチェック
       * @return   {bool}
       */
      validate: function(randomNums) {
        if (!this.isBoxSet) {
          return true;
        }

        // 選択済み数字
        var selecteds = _.filter(this.numbers, function(o) {
          return !!o.selectType;
        });
        // バリデート対象数字
        var validNums = randomNums.concat(selecteds);

        // 数チェック
        var counts = _.countBy(validNums, function(o) {
          return o.value;
        });

        return (_.size(counts) > 1) ? true : false;
      }
    }
  };

  Components.lotteryButtonRandomBingo = {
		    extends: Components.lotteryButtonRandom,

		    props: {
		      betType: {
		        type: String,
		        default: ''
		      },
		    },
		    computed: {
		      isBoxSet: function() {
		        return (this.betType === 'box') || (this.betType === 'set');
		      }
		    },
		    methods: {
		      /**
		       * @return   {array<object>}
		       */
		      getRandNumbers: function() {
		        var nums = [], rand;
		        var group = this.$store.getters.numberRange('group');
		        var cnt = Object.keys(group).length;

		        // @return   {number}
		        var getRand = function(target) {
		          return target[(Math.random() * target.length | 0)];
		        };

		        for (var i = 0; i < cnt; ++i) {
		          nums.push(
		            this.$store.getters.lotteryNumberFormat(getRand(group[i]), 'random')
		          );
		        }

		        return this.validate(nums) ? nums : this.getRandNumbers();
		      },

		      /**
		       * 選択可能な数字リストを返す
		       * @return   {array<number>}
		       */
		      getTargetsNums: function() {
		        return _.map(this.numbers, _.property('value'));
		      },

		      /**
		       * 申し込みタイプがボックスかセットの時
		       * 全同数字になっていないかをチェック
		       * @return   {bool}
		       */
		      validate: function(randomNums) {
		        if (!this.isBoxSet) {
		          return true;
		        }

		        // 選択済み数字
		        var selecteds = _.filter(this.numbers, function(o) {
		          return !!o.selectType;
		        });
		        // バリデート対象数字
		        var validNums = randomNums.concat(selecteds);

		        // 数チェック
		        var counts = _.countBy(validNums, function(o) {
		          return o.value;
		        });

		        return (_.size(counts) > 1) ? true : false;
		      }
		    }
		  };


  // 購入数
  Components.lotteryItemPurchaseCount = {
    template: '<dl class="m_lotteryNum_param">' +
                '<dt>購入{{ unit }}数</dt>' +
                '<dd>' +
                  '<span class="m_lotteryNum_label">{{ count }}{{ unit }}</span>' +
                '</dd>' +
              '</dl>',
    props: {
      count: {
        type: Number,
        default: 0
      },
      unit: {
        type: String,
        default: '枚'
      }
    }
  };

  // 継続回数
  Components.lotteryItemContinuationCount = {
    template: '<dl class="m_lotteryNum_param">' +
                '<dt>継続回数</dt>' +
                '<dd>' +
                  '<span class="m_lotteryNum_label">{{ count }}回</span>' +
                '</dd>' +
              '</dl>',
    props: {
      count: {
        type: Number,
        default: 0
      }
    }
  };

  // 購入数セレクト
  Vue.component('lottery-item-selectbox', {
    template: '<dl class="m_lotteryNumInputForm_num">' +
                '<dt><slot name="title"></slot></dt>' +
                '<dd>' +
                  '<span class="m_lotteryNumInputForm_num_item">' +
                    '<select-number class="m_lotteryNumInputForm_select m_select__full m_select__small" ' +
                      'v-bind:selected="selected" ' +
                      'v-bind:name="name" ' +
                      'v-bind:id="id" ' +
                      'v-bind:first="first" ' +
                      'v-bind:last="last" ' +
                      'v-on:change="onChange"><slot name="option"></slot></select-number>' +
                  '</span>' +
                  '<span class="m_lotteryNumInputForm_num_item2">{{ unit }}</span>' +
                '</dd>' +
              '</dl>',
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
      unit: {
        type: String,
        default: '枚'
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
    methods: {
      // @param   {number}   selected
      onChange: function(selected) {
        this.$emit('change', selected);
      }
    }
  });



  Mixins.lotteryItem = {
    props: {
      index: {
        type: Number,
        default: 0
      },
      current: {
        type: Number
      },
      item: {
        type: Object,
        default: function() {
          return {};
        }
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      unit: function() {
        return this.$store.getters.unit || '枚';
      },
      state: function() {
        return this.$store.getters['productItems/item/state'](this.index); //unSelect|edit|done
      },
      isQuickPick: function() {
        return this.item.isQuickPick;
      },
      numbers: function() {
        return this.item.numbers || [];
      },
      purchaseCount: function() {
        return this.item.purchaseCount || 0;
      },
      continuationCount: function() {
        return this.item.continuationCount || 0;
      },
      isCurrent: function() {
        return this.index === this.current;
      },
      isUnSelect: function() {
        return 'unSelect' === this.state;
      },
      isDone: function() {
        return 'done' === this.state;
      },
      isEdit: function() {
        return 'edit' === this.state;
      }
    },
    methods: {
      /**
       * @param   {number}   index
       * @param   {string}   val - select|reset
       */
      onClick: function(index, val) {
        this.$emit('click', index, val);
      }
    }
  };


  Components.lotteryItemLabelBetType = {
    template: '<span class="m_label m_label__type2">{{ text }}</span>',
    props: {
      type: {
        type: String,
        default: 'straight' //straight|box|set|mini
      },
    },
    computed: {
      text: function() {
        switch (this.type) {
          case 'straight':
            return 'ストレート';
          case 'box':
            return 'ボックス';
          case 'set':
            return 'セット';
          case 'mini':
            return 'ミニ';
          default:
            return '-';
        }
      }
    }
  };

  Components.lotteryItemQickPickLayer = {
    template: '<quick-pick-layer v-bind:class="elClass"></quick-pick-layer>',
    components: {
      'quick-pick-layer': Components.LOTTERY_ITEM_QUICKPICK_LAYER
    },
    props: {
      numbersLength: {
        type: Number,
        default: 4
      }
    },
    computed: {
      elClass: function() {
        if (this.numbersLength < 4) {
          return {'m_lotteryNum_quick__type2': true};
        }
      }
    }
  };

  // 選択済み or 選択中
  Components.lotteryItemDefault = {
    template: '<div>' +
                '<button type="button" class="m_lotteryNum_close" ' +
                  'v-if="!_disabled" ' +
                  'v-on:click.prevent="onClick(\'reset\')"><span><span>閉じる</span></span></button>' +
                '<a class="m_lotteryNum_link m_lotteryNum_link__type2" ' +
                  'v-bind:href="href" ' +
                  'v-bind:class="linkClass" ' +
                  'v-on:click.prevent="onClick(\'select\')">' +
                  '<div class="m_lotteryNum_link_inner">' +
                    '<div class="m_lotteryNum_link_inner2">' +
                      '<div class="m_lotteryNum_row m_lotteryNum_row__numbers">' +
                        '<lottery-item-labels ' +
                          'v-bind:items="_numbers"' +
                          'v-bind:sort="sort" ' +
                          'v-bind:default-length="selectCount"></lottery-item-labels>' +
                        '<quick-pick-layer ' +
                          'v-if="isQuickPick" ' +
                          'v-bind:numbers-length="numbers.length"></quick-pick-layer>' +
                      '</div>' +
                      '<div class="m_lotteryNum_row" ' +
                        'v-if="isCurrent || !isUnSelect">' +
                        '<lottery-item-purchase-count ' +
                          'v-bind:unit="unit" ' +
                          'v-bind:count="purchaseCount"></lottery-item-purchase-count>' +
                        '<lottery-item-continuation-count ' +
                          'v-if="continuationCount" ' +
                          'v-bind:count="continuationCount"></lottery-item-continuation-count>' +
                      '</div>' +
                    '</div>' +
                  '</div>' +
                '</a>' +
              '</div>',
    components: {
      'lottery-item-labels'            : Components.LOTTERY_LABEL_NUMBERS,
      'lottery-item-purchase-count'    : Components.lotteryItemPurchaseCount,
      'lottery-item-continuation-count': Components.lotteryItemContinuationCount,
      'quick-pick-layer'               : Components.lotteryItemQickPickLayer,
    },
    mixins: [Mixins.lotteryItem],

    computed: {
      isSpLayout: function() {
        return 'sp' === this.$store.getters.currentMediaView;
      },
      sort: function() {
        return this.$store.getters.numberSort || ''; //asc|desc|''
      },
      selectCount: function() {
        return this.$store.getters.selectCount || 0;
      },
      linkClass: function() {
        return {
          'is_disabled': this._disabled
        };
      },
      href: function() {
        return this._disabled ? false : '#';
      },
      _disabled: function() {
        var firstUnSelect = this.$store.getters['productItems/firstUnSelectIndex']();

        if (firstUnSelect < 0) {
          firstUnSelect = this.$store.getters['productItems/current']();
        }

        if ( this.disabled ) {
          // parent disapbled
          return true;

        } else if (this.index === firstUnSelect) {
          // empty current
          return false;

        } else if (this.isUnSelect) {
          // unselect
          return true;

        } else {
          return false;
        }
      },
      _numbers: function() {
        var numbers = _.cloneDeep(this.numbers);

        _.forEach(numbers, function(o) {
          if ('disabled' === o.selectType) {
            o.value = '-';
          }
        });

        return numbers;
      }
    },
    methods: {
      // @param   {string}   val - select|reset
      onClick: function(val) {
        if (this._disabled) return;

        this.$emit('click', this.index, val);
      }
    }
  };

  // 絵札用：選択済み or 選択中
  Components.lotteryItemDefaultTypeCards = {
    template: '<div>' +
                '<button type="button" class="m_lotteryNum_close" ' +
                  'v-if="!_disabled" ' +
                  'v-on:click.prevent="onClick(\'reset\')"><span><span>閉じる</span></span></button>' +
                '<a class="m_lotteryNum_link m_lotteryNum_link__type2" ' +
                  'v-bind:href="href" ' +
                  'v-bind:class="linkClass" ' +
                  'v-on:click.prevent="onClick(\'select\')">' +
                  '<div class="m_lotteryNum_link_inner">' +
                    '<div class="m_lotteryNum_link_inner2">' +
                      '<div class="m_lotteryNum_row m_lotteryNum_row__numbers">' +
                        '<lottery-item-label-cards ' +
                          'v-bind:items="_numbers"' +
                          'v-bind:sort="sort" ' +
                          'v-bind:empty-value="emptyValue" ' +
                          'v-bind:default-length="selectCount"></lottery-item-label-cards>' +
                        '<quick-pick-layer ' +
                          'v-if="isQuickPick" ' +
                          'v-bind:numbers-length="numbers.length"></quick-pick-layer>' +
                      '</div>' +
                      '<div class="m_lotteryNum_row" ' +
                        'v-if="isCurrent || !isUnSelect">' +
                        '<lottery-item-purchase-count ' +
                          'v-bind:unit="unit" ' +
                          'v-bind:count="purchaseCount"></lottery-item-purchase-count>' +
                        '<lottery-item-continuation-count ' +
                          'v-if="continuationCount" ' +
                          'v-bind:count="continuationCount"></lottery-item-continuation-count>' +
                      '</div>' +
                    '</div>' +
                  '</div>' +
                '</a>' +
              '</div>',
    components: {
      'lottery-item-label-cards'       : Components.LOTTERY_LABEL_CARDS,
      'lottery-item-purchase-count'    : Components.lotteryItemPurchaseCount,
      'lottery-item-continuation-count': Components.lotteryItemContinuationCount,
      'quick-pick-layer'               : Components.lotteryItemQickPickLayer,
    },
    mixins: [Mixins.lotteryItem],

    computed: {
      isSpLayout: function() {
        return 'sp' === this.$store.getters.currentMediaView;
      },
      sort: function() {
        return this.$store.getters.numberSort || ''; //asc|desc|''
      },
      selectCount: function() {
        return this.$store.getters.selectCount || 0;
      },
      linkClass: function() {
        return {
          'is_disabled': this._disabled
        };
      },
      href: function() {
        return this._disabled ? false : '#';
      },
      _disabled: function() {
        var firstUnSelect = this.$store.getters['productItems/firstUnSelectIndex']();

        if (firstUnSelect < 0) {
          firstUnSelect = this.$store.getters['productItems/current']();
        }

        if ( this.disabled ) {
          // parent disapbled
          return true;

        } else if (this.index === firstUnSelect) {
          // empty current
          return false;

        } else if (this.isUnSelect) {
          // unselect
          return true;

        } else {
          return false;
        }
      },
      _numbers: function() {
        var numbers = _.cloneDeep(this.numbers);

        _.forEach(numbers, function(o) {
          if ('disabled' === o.selectType) {
            o.value = '-';
          }
        });

        return numbers;
      },
      emptyValue: function() {
        return this.isCurrent || !this.isUnSelect ? '-' : '';
      }
    },
    methods: {
      // @param   {string}   val - select|reset
      onClick: function(val) {
        if (this._disabled) return;

        this.$emit('click', this.index, val);
      }
    }
  };

  // ナンバーズ用：選択済み or 選択中
  Components.lotteryItemDefaultTypeNumbers = {
    extends: Components.lotteryItemDefault,

    template: '<div>' +
                '<button type="button" class="m_lotteryNum_close" ' +
                  'v-if="!_disabled" ' +
                  'v-on:click.prevent="onClick(\'reset\')"><span><span>閉じる</span></span></button>' +
                '<a class="m_lotteryNum_link m_lotteryNum_link__type2" ' +
                  'v-bind:href="href" ' +
                  'v-bind:class="linkClass" ' +
                  'v-on:click.prevent="onClick(\'select\')">' +
                  '<div class="m_lotteryNum_link_inner">' +
                    '<div class="m_lotteryNum_link_inner2">' +
                      '<div class="m_lotteryNum_row m_lotteryNum_row__numbers">' +
                        '<lottery-item-labels shape="square" ' +
                          'v-bind:items="_numbers"' +
                          'v-bind:sort="sort" ' +
                          'v-bind:empty-value="emptyValue" ' +
                          'v-bind:default-length="selectCount"></lottery-item-labels>' +
                        '<quick-pick-layer ' +
                          'v-if="isQuickPick" ' +
                          'v-bind:numbers-length="numbers.length"></quick-pick-layer>' +
                      '</div>' +
                      '<bet-type-label ' +
                        'v-if="isCurrent || !isUnSelect" ' +
                        'v-bind:type="betType"></bet-type-label>' +
                      '<div class="m_lotteryNum_row" ' +
                        'v-if="isCurrent || !isUnSelect">' +
                        '<lottery-item-purchase-count ' +
                          'v-bind:unit="unit" ' +
                          'v-bind:count="purchaseCount"></lottery-item-purchase-count>' +
                        '<lottery-item-continuation-count ' +
                          'v-if="continuationCount" ' +
                          'v-bind:count="continuationCount"></lottery-item-continuation-count>' +
                      '</div>' +
                    '</div>' +
                  '</div>' +
                '</a>' +
              '</div>',
    components: {
      'bet-type-label':Components.lotteryItemLabelBetType
    },
    computed: {
      betType: function() {
        return this.item.betType;
      },
      emptyValue: function() {
        return this.isCurrent || !this.isUnSelect ? '-' : '';
      }
    }
  };

  // ビンゴ用：選択済み or 選択中
  Components.lotteryItemDefaultTypeBingo = {
    extends: Components.lotteryItemDefault,

    template: '<div class="m_lotteryNum_bingo">' +
                '<button type="button" class="m_lotteryNum_close" ' +
                  'v-if="!_disabled" ' +
                  'v-on:click.prevent="onClick(\'reset\')"><span><span>閉じる</span></span></button>' +
                '<a class="m_lotteryNum_link m_lotteryNum_link__type2" ' +
                  'v-bind:href="href" ' +
                  'v-bind:class="linkClass" ' +
                  'v-on:click.prevent="onClick(\'select\')">' +
                  '<div class="m_lotteryNum_link_inner">' +
                    '<div class="m_lotteryNum_link_inner2">' +
                      '<div class="m_lotteryNum_row m_lotteryNum_row__numbers">' +
                        '<lottery-item-label-bingo shape="square" ' +
                          'v-bind:items="_numbers"' +
                          'v-bind:sort="sort" ' +
                          'v-bind:empty-value="emptyValue" ' +
                          'v-bind:default-length="selectCount"></lottery-item-label-bingo>' +
                        '<quick-pick-layer ' +
                          'v-if="isQuickPick" ' +
                          'v-bind:numbers-length="numbers.length"></quick-pick-layer>' +
                      '</div>' +
                      '<div class="m_lotteryNum_row" ' +
                        'v-if="isCurrent || !isUnSelect">' +
                        '<lottery-item-purchase-count ' +
                          'v-bind:unit="unit" ' +
                          'v-bind:count="purchaseCount"></lottery-item-purchase-count>' +
                        '<lottery-item-continuation-count ' +
                          'v-if="continuationCount" ' +
                          'v-bind:count="continuationCount"></lottery-item-continuation-count>' +
                      '</div>' +
                    '</div>' +
                  '</div>' +
                '</a>' +
              '</div>',
    components: {
      'lottery-item-label-bingo'       : Components.LOTTERY_LABEL_BINGO,
    },
    computed: {
      betType: function() {
        return this.item.betType;
      },
      emptyValue: function() {
        return this.isCurrent || !this.isUnSelect ? '-' : '';
      }
    }
  };


  // 選択画面へ
  Components.lotteryItemToSelect = {
    template: '<ul class="m_lotteryNum_btnWrap" ' +
                'v-if="isShowQuickPick">' +
                '<li>' +
                  '<button-lottery class="m_lotteryNum_btn m_btn m_btn__block" ' +
                    'v-on:click="onClick(\'select\')" v-if="isUiCards">絵柄選択</button-lottery>' +
                  '<button-lottery class="m_lotteryNum_btn m_btn m_btn__block" ' +
                    'v-on:click="onClick(\'select\')" v-else>数字選択</button-lottery>' +
                '</li>' +
                '<li>' +
                  '<button-lottery class="m_lotteryNum_btn m_btn m_btn__colorQuick m_btn__block" ' +
                    'v-on:click="onClick(\'quickpick\')">クイックピック</button-lottery>' +
                '</li>' +
              '</ul>' +
              '<div class="m_lotteryNum_btnWrap" ' +
                'v-else>' +
                '<button-lottery class="m_lotteryNum_btn m_btn m_btn__block" ' +
                  'v-on:click="onClick(\'select\')" v-if="isUiCards">絵柄選択</button-lottery>' +
                '<button-lottery class="m_lotteryNum_btn m_btn m_btn__block" ' +
                  'v-on:click="onClick(\'select\')" v-else>数字選択</button-lottery>' +
              '</div>',
    mixins: [Mixins.lotteryItem],

    computed: {
      isShowQuickPick: function() {
        var isQuick = false;
        if (this.$store.getters.isUiLoto || this.$store.getters.isUiCards || this.$store.getters.isUiBingo) {
          isQuick = true;
        }
        return isQuick;
      },
      isUiCards: function() {
        return this.$store.getters.isUiCards;
      }
    },
    methods: {
      // @param   {string}   val - select|quickpick
      onClick: function(val) {
        this.$emit('click', this.index, val);
      }
    }
  };

  Components.lotteryItemActivate = {
    template: '<component ' +
                'v-bind:is="currentComponent" ' +
                'v-bind:index="index" ' +
                'v-bind:current="current" ' +
                'v-bind:disabled="disabled" ' +
                'v-bind:item="item" ' +
                'v-on:click="onClick"></component>',
    components: {
      'lottery-item-to-select': Components.lotteryItemToSelect,
      'lottery-item-default': Components.lotteryItemDefault,
      'lottery-item-default-type-numbers': Components.lotteryItemDefaultTypeNumbers,
      'lottery-item-default-type-bingo': Components.lotteryItemDefaultTypeBingo,
      'lottery-item-default-type-cards': Components.lotteryItemDefaultTypeCards,
    },
    mixins: [Mixins.lotteryItem],

    computed: {
      isSpLayout: function() {
        return 'sp' === this.$store.getters.currentMediaView;
      },
      currentComponent: function() {
        var isNumbers = this.$store.getters.isUiNumbers;
        var isBingo = this.$store.getters.isUiBingo;
        var isCards = this.$store.getters.isUiCards;
        var pref = 'lottery-item-';

        if (this.isSpLayout && this.isUnSelect) {
          return pref + 'to-select';

        } else if (isNumbers) {
          return pref + 'default-type-numbers';

        } else if (isBingo) {
            return pref + 'default-type-bingo';

        } else if (isCards) {
          return pref + 'default-type-cards';

        } else {
          return pref + 'default';
        }
      }
    }
  };

  Vue.component('lottery-item', {
    template: '<dl v-bind:class="wrapClass" class="m_lotteryNum">' +
                '<dt>{{ title }}</dt>' +
                '<dd>' +
                  '<component ' +
                    'v-bind:is="currentComponent" ' +
                    'v-bind:index="index" ' +
                    'v-bind:current="current" ' +
                    'v-bind:disabled="disabled" ' +
                    'v-bind:item="item" ' +
                    'v-on:click="onClick"></component>' +
                '</dd>' +
              '</dl>',
    components: {
      'lottery-item-activate': Components.lotteryItemActivate,
      'lottery-item-default': Components.lotteryItemDefault,
      'lottery-item-default-type-numbers': Components.lotteryItemDefaultTypeNumbers,
      'lottery-item-default-type-bingo': Components.lotteryItemDefaultTypeBingo,
      'lottery-item-default-type-cards': Components.lotteryItemDefaultTypeCards,
    },
    mixins: [Mixins.lotteryItem],

    props: {
      title: {
        type: String,
        required: true,
        default: ''
      },
    },
    computed: {
      currentComponent: function() {
        var isNumbers = this.$store.getters.isUiNumbers;
        var isBingo = this.$store.getters.isUiBingo;
        var isCards = this.$store.getters.isUiCards;
        var pref = 'lottery-item-';

        if (this.isCurrent) {
          return pref + 'activate';

        } else if (isNumbers) {
          return pref + 'default-type-numbers';

        } else if (isBingo) {
            return pref + 'default-type-bingo';

        } else if (isCards) {
          return pref + 'default-type-cards';

        } else {
          return pref + 'default';
        }
      },
      wrapClass: function() {
        var isNumbers = this.$store.getters.isUiNumbers;
        var isCards = this.$store.getters.isUiCards;
        var isBingo = this.$store.getters.isUiBingo;

        return {
          'is_select'  : this.isCurrent,
          'is_disabled': this.disabled,
          'm_lotteryNum__numbers': isNumbers,
          'm_lotteryNum__cards': isCards,
          'm_lotteryNum__bingo': isBingo
        };
      }
    },
  });


  Vue.component('lottery-items', {
    template: '<ul class="m_lotteryNumWrap">' +
                '<li v-for="fItem in filterItems">' +
                  '<lottery-item ' +
                    'v-bind:key="fItem.__index" ' +
                    'v-bind:index="fItem.__index" ' +
                    'v-bind:current="current" ' +
                    'v-bind:item="items[fItem.__index]" ' +
                    'v-bind:disabled="isEdit && (current !== fItem.__index)" ' +
                    'v-bind:title="String.fromCharCode(fItem.__index + 65)" ' +
                    'v-on:click="onClick"></lottery-item>' +
                  '</lottery-item>' +
                '</li>' +
              '</ul>',
    props: {
      items: {
        type: Array,
        required: true,
        default: function() {
          return [];
        }
      },
      filter: {
        type: Object,
        default: function() {
          return {
            first : 0,
            last  : 0
          };
        }
      },
      minLength: {
        type: Number,
        default: 5
      }
    },
    computed: {
      filterItems: function() {
        var filterItems = JSON.parse(JSON.stringify(this.items)); //deep copy

        var first = this.filter.first;
        var last  = this.filter.last;

        if (first || last) {
          filterItems = filterItems.slice(first, last+1);
        }

        this.addIndexProperty(filterItems, first);

        return filterItems;
      },
      current: function() {
        return this.$store.getters['productItems/current']();
      },
      isSpLayout: function() {
        return 'sp' === this.$store.getters.currentMediaView;
      },
      isEdit: function() {
        var state = this.$store.getters['productItems/currentState']();
        return 'edit' === state;
      },
    },
    mounted: function() {
      this.init();
    },
    methods: {
      init: function() {
        var len = this.items.length;
        var minLen = this.minLength;

        if (len <= minLen) {
          // 不足分を追加
          this.insertItems(minLen - len);
        }

        // 購入系エラーモーダルが表示されたらA枠へcurrent移動
        this.onVmApp('HIDE_MODAL_PURCHASE_ERROR', function() {
          this.changeCurrentFirst();
        }.bind(this));
      },
      insertItems: function(len) {
        this.$store.dispatch('productItems/insertItems', {
          count: len
        });
      },

      changeCurrentFirst: function() {
        this.$store.dispatch('productItems/changeCurrent', {
          value: 'first'
        });
      },

      /**
       * @param   {number}   index
       * @param   {string}   val - select|quickpick|reset
       */
      onClick: function(index, val) {
        var item = this.items[index];

        if (!item) return;

        switch (val) {
          case 'select':
            this.onClickSelect(index);
            break;
          case 'quickpick':
            this.onClickQuickPick(index);
            break;
          case 'reset':
            this.onClickReset(index);
            break;
        }
      },
      // @param   {number}   index
      onClickSelect: function(index) {
        this.changeCurrent(index);

        setTimeout(function() {
          this.openNumberSelectModal();
        }.bind(this), 30);
      },
      // @param   {number}   index
      onClickQuickPick: function(index) {
        this.$store.dispatch('productItems/updateItem', {
          index: index,
          properies: {isQuickPick: true}
        });
        this.$nextTick(function() {
          this.changeCurrent('empty');
        });
      },
      // @param   {number}   index
      onClickReset: function(index) {
          this.$store.dispatch('productItems/resetItem', {
            index: index
          });
          this.$nextTick(function() {
            this.changeCurrent('empty');
          });
      },
      openNumberSelectModal: function() {
        if (this.isSpLayout) {
          this.emitVmApp('MODAL_LOTTERY_BODY', true);
        }
      },
      /**
       * @param   {string|number}   value - next|prev|{number}
       */
      changeCurrent: function(value) {
        this.$store.dispatch('productItems/changeCurrent', {
          value: value
        });
      },

      /**
       * @param   {array}   items
       * @param   {number}  firstIndex
       */
      addIndexProperty: function(items, firstIndex) {
        for (var i = 0, len = items.length; i < len; ++i) {
          items[i].__index = firstIndex + i;
        }
      }
    }
  });


  // 数字状態
  Components.lotteryController = {
    template: '<div class="m_lotteryController">' +
                '<lottery-items ' +
                  'v-bind:items="items" ' +
                  'v-bind:filter="filter" ' +
                  'v-bind:min-length="itemPerPageLength"></lottery-items>' +
                '<p class="m_lotteryNum_btn2Wrap" ' +
                  'v-if="isSpLayout">' +
                  '<lottery-button-add class="m_lotteryNum_btn2" ' +
                    'v-bind:disabled="isEdit || isItemMax" ' +
                    'v-on:click="onClickAdd">＋さらに「組合せ」を追加</lottery-button-add>' +
                '</p>' +
                '<lottery-group-items-pager ' +
                  'v-else ' +
                  'v-bind:items="items" ' +
                  'v-bind:per-page-length="itemPerPageLength" ' +
                  'v-bind:disabled="isEdit" ' +
                  'v-on:mounted="onChangeGroupPager(\'mounted\', $event)" ' +
                  'v-on:destroyed="onChangeGroupPager(\'destroyed\', $event)" ' +
                  'v-on:change="onChangeGroupPager(\'change\', $event)"></lottery-group-items-pager>' +
              '</div>',
    props: {
      items: {
        type: Array,
        required: true,
        default: function() {
          return [];
        }
      },
    },
    data: function() {
      return {
        groupPager: {
          currentPage: 0,
          rangeFirst: 0,
          rangeLast: 0,
          totalPageCount: 1
        }
      };
    },
    computed: {
      itemPerPageLength: function() {
        return this.$store.getters.perPageLength;
      },
      isSpLayout: function() {
        return 'sp' === this.$store.getters.currentMediaView;
      },
      isItemMax: function() {
        return this.$store.getters['productItems/isMax']();
      },
      filter: function() {
        return {
          first: this.groupPager.rangeFirst,
          last : this.groupPager.rangeLast
        };
      },
      isEdit: function() {
        var state = this.$store.getters['productItems/currentState']();
        return 'edit' === state;
      },
    },
    methods: {
      /**
       * @param   {string}   type - mounted|destroyed|change
       * @param   {object}   vals
       *          {number}   vals.currentPage
       *          {number}   vals.rangeFirst
       *          {number}   vals.rangeLast
       *          {number}   vals.totalPageCount
       */
      onChangeGroupPager: function(type, vals) {
        var p = this.groupPager;

        p.currentPage    = vals.currentPage;
        p.rangeFirst     = vals.rangeFirst;
        p.rangeLast      = vals.rangeLast;
        p.totalPageCount = vals.totalPageCount;

        this.$store.dispatch('productItems/updatePagerRange', {
          first: vals.rangeFirst
        });
      },
      onClickAdd: function() {
        this.$store.dispatch('productItems/insertItem');
        this.$store.dispatch('productItems/changeCurrent', {
          value: 'empty'
        });
      }
    },
  };


  // 数字選択（単体）
  Components.lotteryBodyItem = {
    template: '#lottery_body_item', // _vue_template/_tpl_lottery_body_item.ejs
    components: {
      'quick-pick-layer'      : Components.LOTTERY_ITEM_QUICKPICK_LAYER,
      'lottery-number-buttons': Components.LOTTERY_NUMBER_BUTTONS,
      'lottery-button-random' : Components.lotteryButtonRandom,
      'rest-count': {
        template: '<p class="m_lotteryNumInput_restCount">' +
                    '<span>あと</span>' +
                    '<span class="m_lotteryNumInput_restCount_num">' +
                      '<span>{{ count }}</span>{{ unit }}' +
                    '</span>' +
                  '</p>',
        props: {
          count: {
            type: Number,
            default: 0,
            required: true
          },
          unit: {
            type: String,
            default: '個'
          }
        }
      }
    },
    props: {
      index: {
        type: Number,
        default: 0
      },
      item: {
        type: Object,
        required: true,
        default: function() {
          return {};
        }
      },
    },
    data: function() {
      return {
        numbers: []
      };
    },
    _cache_selectType: 'myself',

    computed: {
      isContinuation: function() {
        return 'continuation' === this.$store.getters.route;
      },
      isSpLayout: function() {
        return 'sp' === this.$store.getters.currentMediaView;
      },
      maxSelectCount: function() {
        return this.$store.getters.selectCount;
      },
      canToNext: function() {
        return this.$store.getters['productItems/canToNext']();
      },
      isQuickPick: function() {
        return this.item.isQuickPick;
      },
      selecteds: {
        get: function() {
          return this.item.numbers || [];
        },
        set: function(val) {
          this.item.numbers = val;
        }
      },
      purchaseCount: function() {
        return this.item.purchaseCount || 1;
      },
      continuationCount: function() {
        return this.item.continuationCount || 0;
      },
      unit: function() {
        return this.$store.getters.unit;
      },
      state: function() {
        return this.$store.getters['productItems/item/state'](this.index);
      },
      restCount: function() {
        return this.$store.getters['productItems/item/restCount'](this.index);
      },
      randomSelectCount: function() {
        var count = 0;

        _.forEach(this.selecteds, function(o) {
          if ( !!o.selectType && (o.selectType !== 'random') ) {
            ++count;
          }
        });

        return this.maxSelectCount - count;
      },
      numberRangeFirst: function() {
        return this.$store.getters.numberRange('first');
      },
      numberRangeLast: function() {
        return this.$store.getters.numberRange('last');
      },
      numberRangeGroup: function() {
          return this.$store.getters.numberRange('group');
      },
      isDone: function() {
        return 'done' === this.state;
      },
      isUnSelect: function() {
        return 'unSelect' === this.state;
      },
      isEdit: function() {
        return 'edit' === this.state;
      },
    },
    watch: {
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
      /**
       * @return   {array<object>}
       */
      createNumbers: function() {
        var nums = [];
        var first = this.numberRangeFirst;
        var last  = this.numberRangeLast;

        for (var i = first; i <= last; ++i) {
          nums.push(
            this.$store.getters.lotteryNumberFormat(i)
          );
        }

        return nums;
      },
      // @param   {array<object>}   selecteds
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
      /**
       * @param   {object}   vals
       *          {array}    vals.selecteds - selected numbers
       */
      onChangeNumbers: function(vals) {
        this.updateItemNumbers(vals.selecteds);
      },
      // @param   {number}   val
      onChangePurchaseCount: function(val) {
        this.updateItem({purchaseCount: val});
      },
      // @param   {number}   val
      onChangeContinuationCount: function(val) {
        this.updateItem({continuationCount: val});
      },
      onClickQuickpick: function() {
        this.updateItem({isQuickPick: !this.item.isQuickPick});
      },
      onClickFavorite: function() {
        // @param   {array<object>}   selected - 選択されたお気に入り数字
        var select = function(selected) {
          var $o = this.$options;

          _.forEach(this.selecteds, function(o, i) {
            if ('disabled' === o.selectType) {
              $o._cache_selectType = selected[i].selectType;
              selected[i].selectType = 'disabled';
            }
          });

          this.updateItemNumbers(selected);
        }.bind(this);

        this.emitVmApp('MODAL_ROUTER_PUSH', {
          to: 'select-favorite-numbers',
          payload: {
            success: select,
          }
        });
      },
      /**
       * @param   {string}         type
       * @param   {array<object>}  randNums
       */
      onClickRandom: function(type, randNums) {
        this.setSelectedsRandNums(randNums);
      },
      onClickReset: function() {
          this.$store.dispatch('productItems/resetItem', {
            index: this.index
          });
      },
      onClickNext: function() {
        this.$store.dispatch('productItems/changeCurrent', {
          value: 'empty',
          isAdd: true
        });
      },
      onClickClose: function() {
        this.emitVmApp('MODAL_LOTTERY_BODY', false);
      },
      /**
       * @param   {array<object>}
       */
      setSelectedsRandNums: function(randNums) {
        var selecteds = _.cloneDeep(this.selecteds);
        var len = this.maxSelectCount;
        var i = 0;

        if (selecteds.length < len) {
          this.pushEmptyNumbers(selecteds, len - selecteds.length);
        }

        _.forEach(selecteds, function(o) {
          if (!randNums[i])   return false;
          if ( !!o.selectType && (o.selectType !== 'random') ) {
            return true;
          }

          o.value      = randNums[i].value;
          o.selectType = randNums[i].selectType;
          ++i;
        });

        this.updateItemNumbers(selecteds);
      },
      pushEmptyNumbers: function(selecteds, len) {
        for (var i = 0; i < len; ++i) {
          selecteds.push( this.$store.getters.lotteryNumberFormat() );
        }
      },

      updateItemNumbers: function(numbers) {
        this.updateItem({numbers: numbers});
      },
      updateItem: function(properies) {
        this.$store.dispatch('productItems/updateItem', {
          index: this.index,
          properies: properies
        });
      },
    }
  };

  // 申し込みタイプ：ナンバーズ用
  Components.lotteryBodyItemBetType = {
    template: '<form-check-list class="m_formCheckList__type4" ' +
                'v-bind:ui-type="uiType" ' +
                'v-bind:items="items" ' +
                'v-bind:selected="selected" ' +
                'v-on:change="onChange">' +
              '</form-check-list>',
    components: {
      'form-check-list': Components.FORM_CHECK_LIST_RADIO
    },
    props: {
      items: {
        type: Array,
        default: function() {
          return [];
        }
      },
      selected: {
        type: null,
        default: ''
      }
    },
    computed: {
      uiType: function() {
        return (this.items.length < 4) ? 'default' : 'halfPc';
      }
    },
    methods: {
      // @param   {string}   selected
      onChange: function(selected) {
        this.selected = selected;
        this.$emit('change', selected);
      }
    }
  };

  // 数字選択（単体）：ナンバーズ用
  Components.lotteryBodyItemTypeNumbers = {
    extends: Components.lotteryBodyItem,

    template: '#lottery_body_item_type_numbers',
    components: {
      'lottery-numbers-selector': Components.LOTTERY_NUMBERS_SELECTOR,
      'lottery-button-random'   : Components.lotteryButtonRandomNumbers,
      'bet-types'               : Components.lotteryBodyItemBetType,
    },
    data: function() {
      return {
        betTypes: []
      };
    },
    _cache_selecteds: null,

    computed: {
      betType: function() {
        return this.item.betType;
      },
    },
    watch: {
      selecteds: function(val) {
        if (!val.length) return;

        var miniTargetIndex = 0;
        var first = val[miniTargetIndex];

        if ( !first.selectType || ('disabled' === first.selectType) ) return;

        this.$options._cache_selectType = first.selectType;
      },
      restCount: function(val) {
        if (val > 0) {
          this.abledBetTypes('all');
        }
      },
    },
    mounted: function() {
      this.betTypes = this.$store.getters.betTypes();
    },
    methods: {
      abledBetTypes: function(targets) {
        this.updateBetTypes(targets, false);
      },
      disabledBetTypes: function(targets) {
        this.updateBetTypes(targets, true);
      },

      /**
       * @param   {array<string>|string}   targets - array<target>|'all'
       * @param   {bool}                   isDisabled
       */
      updateBetTypes: function(targets, isDisabled) {
        var betTypes = this.betTypes;
        var i;

        if ( Array.isArray(targets) ) {
          // array<string>
          _.forEach(targets, function(target) {
            i = _.findIndex(betTypes, function(o) {
              return target === o.value;
            });
            if (i > -1) {
              betTypes[i].disabled = !!isDisabled;
            }
          });

        } else {
          // all
          _.forEach(betTypes, function(o) {
            o.disabled = !!isDisabled;
          });
        }

      },

      refreshCurrent: function() {
        var ref = this.$refs.numbersSelector;

        if (!ref || !ref.refreshCurrent) return;

        ref.refreshCurrent();
      },
      // @param   {number}   current
      setCurrent: function(current) {
        var ref = this.$refs.numbersSelector;

        if (!ref || !ref.setCurrent) return;

        ref.setCurrent(current);
      },

      /**
       * @param   {object}   vals
       *          {number}   vals.index
       *          {object}   vals.selected
       *          {array}    vals.selecteds - selected numbers
       */
      onChangeNumbers: function(vals) {
        var selecteds = _.cloneDeep(vals.selecteds);

        this.updateItemNumbers(selecteds, vals);
      },
      onClickFavorite: function() {
        // @param   {array<object>}   selected - 選択されたお気に入り数字
        var select = function(selected) {
          var $o = this.$options;

          _.forEach(this.selecteds, function(o, i) {
            if ('disabled' === o.selectType) {
              $o._cache_selectType = selected[i].selectType;
              selected[i].selectType = 'disabled';
            }
          });

          this.updateItemNumbers(selected);

          if (!this.restCount) {
            this.$nextTick(function() {
              this.setCurrent(this.maxSelectCount - 1);
            });
          }
        }.bind(this);

        this.emitVmApp('MODAL_ROUTER_PUSH', {
          to: 'select-favorite-numbers',
          payload: {
            success: select,
            betType: this.betType
          }
        });
      },
      /**
       * @param   {string}         type
       * @param   {array<object>}  randNums
       */
      onClickRandom: function(type, randNums) {
        this.setSelectedsRandNums(randNums);
        this.$nextTick(function() {
          this.setCurrent(this.maxSelectCount - 1);
        });
      },
      // @param   {string}   val
      onChangeBetType: function(val) {
        var payload = {betType: val};

        var isMini = 'mini' === val;
        var miniTargetIndex = 0;
        var len = this.selecteds.length;

        if ( this.isQuickPick || (!isMini && !len) ) {
          // クイックピックON, ミニ以外かつ配列無しなら処理不要
          this.updateItem(payload);
          return;
        }

        var selecteds = _.cloneDeep(this.selecteds);
        var miniTarget = selecteds[miniTargetIndex];
        var prevSelectType = this.$options._cache_selectType;
        var value = !!miniTarget ? miniTarget.value : '';

        if ( !isMini && ('disabled' === miniTarget.selectType) ) {
          // ミニ以外配列有り：selectTypeを前の状態に戻す
          selecteds[miniTargetIndex].selectType = ('' === value) ? '' : prevSelectType;

        } else if (isMini) {
          // ミニ
          selecteds[miniTargetIndex] = this.$store.getters.lotteryNumberFormat(value, 'disabled');
        }

        this.updateItem(payload);
        this.updateItemNumbers(selecteds);
      },

      /**
       * @param   {array<object>}   selecteds
       * @param   {object}          payload
       *          {bool}            payload.valid
       *          {number}          payload.index
       * @return  {bool} - バリデート結果
       */
      validateSelected: function(selecteds, payload) {
        payload = payload || {};

        var isSameNumbers = this.$store.getters.isSameNumbers(selecteds);
        var bet = this.betType;
        var betBoxSet = ('set' === bet) || ('box' === bet);

        if (isSameNumbers && betBoxSet) {
          // ボックス・セットは全部同じ数字にできない
          this.emitVmApp('MODAL_ROUTER_PUSH', {
            to: 'alert-bet-type',
            payload: {
              hide: this.setCurrent.bind(this, payload.index || 0)
            }
          });
          this.updateItemNumbers(this.$options._cache_selecteds, {valid: true});

          return false;
        }

        if (!isSameNumbers) {
          // 違う数字
          this.abledBetTypes('all');

        } else if (!bet) {
          // 全部同じ数字で、申込みタイプが未選択の場合はセット
          this.updateItem({betType: 'straight'});
          this.disabledBetTypes(['box', 'set']);

        } else {
          // 申込みタイプ選択済みで、全部同じ数字
          this.disabledBetTypes(['box', 'set']);
        }

        return true;
      },

      /**
       * @param   {array<object>}   selecteds
       * @param   {object}          payload
       *          {bool}            payload.valid
       *          {number}          payload.index
       */
      updateItemNumbers: function(selecteds, payload) {
        payload = payload || {};

        var valid = payload.hasOwnProperty('valid')
                      ? payload.valid : this.validateSelected(selecteds, payload);

        if (!valid) return;

        this.updateItem({numbers: selecteds});
        this.setCacheSelecteds(selecteds);
      },

      // @param   {array<object>}
      setCacheSelecteds: function(selecteds) {
        this.$options._cache_selecteds = _.cloneDeep(selecteds);
      }
    }
  };

  // 数字選択（単体）：ビンゴ用
  Components.lotteryBodyItemTypeBingo = {
    extends: Components.lotteryBodyItem,

    template: '#lottery_body_item_type_bingo',
    components: {
      'lottery-numbers-selector': Components.LOTTERY_BINGO_SELECTOR,
      'lottery-button-random'   : Components.lotteryButtonRandomBingo,
    },
    _cache_selecteds: null,

    watch: {
      selecteds: function(val) {
        if (!val.length) return;

        var miniTargetIndex = 0;
        var first = val[miniTargetIndex];
        if ( !first.selectType || ('disabled' === first.selectType) ) return;

        this.$options._cache_selectType = first.selectType;
      },
    },
    methods: {
      refreshCurrent: function() {
        var ref = this.$refs.numbersSelector;

        if (!ref || !ref.refreshCurrent) return;

        ref.refreshCurrent();
      },
      // @param   {number}   current
      setCurrent: function(current) {
        var ref = this.$refs.numbersSelector;

        if (!ref || !ref.setCurrent) return;

        ref.setCurrent(current);
      },

      /**
       * @param   {object}   vals
       *          {number}   vals.index
       *          {object}   vals.selected
       *          {array}    vals.selecteds - selected numbers
       */
      onChangeNumbers: function(vals) {
        var selecteds = _.cloneDeep(vals.selecteds);

        this.updateItemNumbers(selecteds, vals);
      },
      onClickFavorite: function() {
        // @param   {array<object>}   selected - 選択されたお気に入り数字
        var select = function(selected) {
          var $o = this.$options;

          _.forEach(this.selecteds, function(o, i) {
            if ('disabled' === o.selectType) {
              $o._cache_selectType = selected[i].selectType;
              selected[i].selectType = 'disabled';
            }
          });

          this.updateItemNumbers(selected);

          if (!this.restCount) {
            this.$nextTick(function() {
              this.setCurrent(this.maxSelectCount - 1);
            });
          }
        }.bind(this);

        this.emitVmApp('MODAL_ROUTER_PUSH', {
          to: 'select-favorite-numbers',
          payload: {
            success: select,
          }
        });
      },
      /**
       * @param   {string}         type
       * @param   {array<object>}  randNums
       */
      onClickRandom: function(type, randNums) {
        this.setSelectedsRandNums(randNums);
        this.$nextTick(function() {
          this.setCurrent(this.maxSelectCount - 1);
        });
      },
      /**
       * @param   {array<object>}
       */
      setSelectedsRandNums: function(randNums) {
        var selecteds = _.cloneDeep(this.selecteds);
        var len = this.maxSelectCount;
        if (selecteds.length < len) {
          this.pushEmptyNumbers(selecteds, len - selecteds.length);
        }

        _.forEach(selecteds, function(o,index) {
          if (!randNums[index])   return false;
          if ( !!o.selectType && (o.selectType !== 'random') ) {
            return true;
          }

          o.value      = randNums[index].value;
          o.selectType = randNums[index].selectType;
        });

        this.updateItemNumbers(selecteds);
      },

      /**
       * @param   {array<object>}   selecteds
       * @param   {object}          payload
       *          {bool}            payload.valid
       *          {number}          payload.index
       */
      updateItemNumbers: function(selecteds, payload) {
        payload = payload || {};

        this.updateItem({numbers: selecteds});
        this.setCacheSelecteds(selecteds);
      },

      // @param   {array<object>}
      setCacheSelecteds: function(selecteds) {
        this.$options._cache_selecteds = _.cloneDeep(selecteds);
      }
    }
  };

  // 数字選択（単体）：絵札用
  Components.lotteryBodyItemTypeCards = {
    extends: Components.lotteryBodyItem,

    template: '#lottery_body_item_type_cards',
    components: {
      'lottery-cards-selector': Components.LOTTERY_CARDS_SELECTOR,
      'lottery-button-random'   : Components.lotteryButtonRandomNumbers,
    },
    _cache_selecteds: null,

    watch: {
      selecteds: function(val) {
        if (!val.length) return;

        var miniTargetIndex = 0;
        var first = val[miniTargetIndex];

        if ( !first.selectType || ('disabled' === first.selectType) ) return;

        this.$options._cache_selectType = first.selectType;
      },
    },
    methods: {
      refreshCurrent: function() {
        var ref = this.$refs.numbersSelector;

        if (!ref || !ref.refreshCurrent) return;

        ref.refreshCurrent();
      },
      // @param   {number}   current
      setCurrent: function(current) {
        var ref = this.$refs.numbersSelector;

        if (!ref || !ref.setCurrent) return;

        ref.setCurrent(current);
      },

      /**
       * @param   {object}   vals
       *          {number}   vals.index
       *          {object}   vals.selected
       *          {array}    vals.selecteds - selected numbers
       */
      onChangeNumbers: function(vals) {
        var selecteds = _.cloneDeep(vals.selecteds);

        this.updateItemNumbers(selecteds, vals);
      },
      onClickFavorite: function() {
        // @param   {array<object>}   selected - 選択されたお気に入り数字
        var select = function(selected) {
          var $o = this.$options;

          _.forEach(this.selecteds, function(o, i) {
            if ('disabled' === o.selectType) {
              $o._cache_selectType = selected[i].selectType;
              selected[i].selectType = 'disabled';
            }
          });

          this.updateItemNumbers(selected);

          if (!this.restCount) {
            this.$nextTick(function() {
              this.setCurrent(this.maxSelectCount - 1);
            });
          }
        }.bind(this);

        this.emitVmApp('MODAL_ROUTER_PUSH', {
          to: 'select-favorite-numbers',
          payload: {
            success: select,
          }
        });
      },
      /**
       * @param   {string}         type
       * @param   {array<object>}  randNums
       */
      onClickRandom: function(type, randNums) {
        this.setSelectedsRandNums(randNums);
        this.$nextTick(function() {
          this.setCurrent(this.maxSelectCount - 1);
        });
      },

      /**
       * @param   {array<object>}   selecteds
       * @param   {object}          payload
       *          {bool}            payload.valid
       *          {number}          payload.index
       */
      updateItemNumbers: function(selecteds, payload) {
        payload = payload || {};

        this.updateItem({numbers: selecteds});
        this.setCacheSelecteds(selecteds);
      },

      // @param   {array<object>}
      setCacheSelecteds: function(selecteds) {
        this.$options._cache_selecteds = _.cloneDeep(selecteds);
      }
    }
  };

  // 数字選択
  Components.lotteryBodyItems = {
    template: '<v-touch ' +
                'v-bind:enabled="vTouchEnabled" ' +
                'v-on:swipeleft="onChangeCurrent(\'next\')" ' +
                'v-on:swiperight="onChangeCurrent(\'prev\')">' +
                '<transition-group tag="div" mode="in-out" name="slide" ' +
                  'v-bind:enter-active-class="transitionEnter" ' +
                  'v-bind:leave-active-class="transitionLeave" ' +
                  'v-bind:style="wrapStyle">' +
                  '<component ref="items" ' +
                    'v-bind:is="currentComponent" ' +
                    'v-for="(item, index) in items" ' +
                    'v-bind:key="index" ' +
                    'v-bind:index="index" ' +
                    'v-bind:item="item" ' +
                    'v-bind:style="slideItemStyle" ' +
                    'v-show="current === index"></component>' +
                '</transition-group>' +
              '</v-touch>',
    components: {
      'lottery-body-item': Components.lotteryBodyItem,
      'lottery-body-item-type-numbers': Components.lotteryBodyItemTypeNumbers,
      'lottery-body-item-type-bingo': Components.lotteryBodyItemTypeBingo,
      'lottery-body-item-type-cards': Components.lotteryBodyItemTypeCards
    },
    props: {
      items: {
        type: Array,
        required: true,
        default: function() {
          return [];
        }
      },
    },
    data: function() {
      return {
        vTouchEnabled: {
          swipe: true,
          pan: false,
          pinch: false,
          rotate: false,
          tap: false
        },
        height: 0
      };
    },
    computed: {
      currentComponent: function() {
        var isNumbers = this.$store.getters.isUiNumbers;
        var isBingo = this.$store.getters.isUiBingo;
        var isCards = this.$store.getters.isUiCards;
        var c = 'lottery-body-item';

        if (isNumbers) {
          c = c + '-type-numbers';
        } else if (isBingo) {
            c = c + '-type-bingo';
        } else if (isCards) {
          c = c + '-type-cards';
        }

        return c;
      },
      slideItemStyle: function() {
        return {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0
        };
      },
      wrapStyle: function() {
        return {
          position: 'relative',
          height: this.height + 'px'
        };
      },
      current: function() {
        return this.$store.getters['productItems/current']();
      },
      transitionEnter: function() {
        return this.$store.getters['productItems/transition']('enter');
      },
      transitionLeave: function() {
        return this.$store.getters['productItems/transition']('leave');
      },
    },
    mounted: function() {
      this.onVmApp( 'SHOWN_MODAL_LOTTERY_BODY', this.setHeight.bind(this) );
      this.onVmApp( 'HIDDEN_MODAL_LOTTERY_BODY', this.setHeight.bind(this) );

      this.$nextTick(function() {
          var self = this;
          setTimeout(function(){
            self.setHeight();
          },500);
      });
    },
    watch: {
      current: function() {
        this.refreshNumbersSelectorCurrent();
      }
    },
    // アイテムごとに高さが変わらないので、動作軽量化のためコメントアウト
    // updated: function() {
    //   this.$nextTick(function() {
    //     this.setHeight();
    //   });
    // },
    methods: {
      // @return   {object}
      getCurrentItem: function() {
        var items = this.$refs.items;

        if (!items.length || !items[this.current]) return; //not dom create

        return items[this.current];
      },
      setHeight: function() {
        this.height = this.getHeight();
      },
      // @return   {number}
      getHeight: function() {
        var item = this.getCurrentItem();

        if (!item) return 0;

        var h = $(item.$el).outerHeight();

        return Math.ceil(h);
      },
      refreshNumbersSelectorCurrent: function() {
        var item = this.getCurrentItem();

        if (!item || !item.refreshCurrent) return;

        item.refreshCurrent();
      },
      /**
       * @param   {string}   target - next|prev
       */
      onChangeCurrent: function(target) {
        this.$store.dispatch('productItems/changeCurrent', {
          value: target
        });
      },
    }
  };


  Mixins.lotteryBody = {
    components: {
      'lottery-body-items': Components.lotteryBodyItems
    },
    props: {
      items: {
        type: Array,
        required: true,
        default: function() {
          return [];
        }
      },
    },
    computed: {
      isEdit: function() {
        var state = this.$store.getters['productItems/currentState']();
        return 'edit' === state;
      },
    },
  };

  // 数字選択（ラッパー）
  Components.lotteryBody = {
    template: '<div>' +
                '<lottery-items-pager ' +
                  'v-bind:items="items"></lottery-items-pager>' +
                '<lottery-body-items ' +
                  'v-bind:items="items"></lottery-body-items>' +
              '</div>',
    mixins: [Mixins.lotteryBody]
  };

  // 数字選択（モーダル）
  Components.modalLotteryBody = {
    template: '<div class="m_lotteryNumModal">' +
                '<transition v-bind:name="transitionModalHeader">' +
                  '<div class="m_lotteryNumModal_header" ' +
                    'v-show="isShow">' +
                    '<lottery-items-pager ' +
                      'v-bind:items="items"></lottery-items-pager>' +
                    '<div class="m_lotteryNumModal_header_logo" v-if="headerLogoImg"><img v-bind:src="headerLogoImg" v-bind:alt="headerLogoAlt"></div>' +
                    '<div class="m_lotteryNumModal_header_close">' +
                      '<lottery-button-close class="m_lotteryNumModal_header_close_btn" ' +
                        'v-if="!isSpLayout" ' +
                        'v-bind:disabled="isEdit" ' +
                        'v-on:click="onClickClose">完了</lottery-button-close>' +
                    '</div>' +
                  '</div>' +
                '</transition>' +
                '<transition v-bind:name="transitionModalBody">' +
                  '<div class="m_lotteryNumModal_body" ' +
                    'v-show="isShow">' +
                    '<lottery-body-items ' +
                      'v-bind:items="items"></lottery-body-items>' +
                  '</div>' +
                '</transition>' +
              '</div>',
    mixins: [Mixins.lotteryBody],

    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      dislayTargetSelector: {
        type: String,
        default: '#pagetop, .l_menuSp'
      },
      animationSpeed: {
        type: Number,
        default: 300
      }
    },

    data: function() {
      return {
        transition: {
          header: 'fadeDown',
          body  : 'fadeUp',
        },
        cache: {
          scrollY: 0
        }
      };
    },

    jQ_target: null,

    computed: {
      transitionModalHeader: function() {
        return this.transition.header;
      },
      transitionModalBody: function() {
        return this.transition.body;
      },
      isSpLayout: function() {
        return 'sp' === this.$store.getters.currentMediaView;
      },
      headerLogoImg: function() {
        var type = this.$store.getters.uiType;
        var count = this.$store.getters.selectCount;
        var img = '';
        if (type == 'loto') {
          if (count == 5) {
            img = '/assets/img/common/logo-miniloto-001.svg';
          } else if (count == 6) {
            img = '/assets/img/common/logo-loto6-001.svg';
          } else if (count == 7) {
            img = '/assets/img/common/logo-loto7-001.svg';
          }
        } else if (type == 'numbers') {
          if (count == 3) {
            img = '/assets/img/common/logo-numbers3-001.svg';
          } else if (count == 4) {
            img = '/assets/img/common/logo-numbers4-001.svg';
          }
        } else if (type == 'bingo') {
            img = '/assets/img/common/logo-bingo5-001.svg';

        } else if (type == 'cards') {
          img = '/assets/img/common/logo-kisekae-qoochan-001.svg';
        }
        return img;
      },
      headerLogoAlt: function() {
        var type = this.$store.getters.uiType;
        var count = this.$store.getters.selectCount;
        var alt = '';
        if (type == 'loto') {
          if (count == 5) {
            alt = 'ミニロト';
          } else if (count == 6) {
            alt = 'ロト6';
          } else if (count == 7) {
            alt = 'ロト7';
          }
        } else if (type == 'numbers') {
          if (count == 3) {
            alt = 'ナンバーズ3';
          } else if (count == 4) {
            alt = 'ナンバーズ4';
          }
        } else if (type == 'cards') {
            alt = '着せかえクーちゃん';
        }
        return alt;
      },
    },

    mounted: function() {
      this.onVmApp('MODAL_LOTTERY_BODY', function(isShow, cb) {
        var method = isShow ? 'show' : 'hide';
        this[method](cb);
      }.bind(this));

      this.$nextTick(function() {
        this.$options.jQ_target = $(this.dislayTargetSelector);
      }.bind(this));
    },

    methods: {
      show: function() {
        var $target = this.$options.jQ_target;
        var speed = this.animationSpeed;

        this.cache.scrollY = Math.floor(window.pageYOffset);

        this.changeTransition('show');

        $target.fadeOut(speed, function() {
          window.scrollTo(0, 0);
          this.isShow = true;
          this.emit('shown');
        }.bind(this));
      },
      // @param   {function}   cb
      hide: function(cb) {
        var _cb = function() {
          this.$store.dispatch('productItems/changeCurrent', {
            value: 'empty',
          });
          if (typeof cb === 'function') {
            cb();
          }
        };

        var $target = this.$options.jQ_target;
        var speed = this.animationSpeed;

        var onFadeInStart = function() {
          // setTimeout for IE11
          setTimeout(function() {
            window.scrollTo(0, this.cache.scrollY);
            $(window).trigger('resize');
          }.bind(this), 0);
        };

        this.changeTransition('hide');

        this.isShow = false;

        setTimeout(function() {
          $target.fadeIn({
            duration: speed,
            start   : onFadeInStart.bind(this),
            done    : _cb.bind(this)
          }).css('display', '');
          this.emit('hidden');
        }.bind(this), speed);
      },
      // @param   {string}   type - shown|hidden
      emit: function(type) {
        this.$nextTick(function() {
          var name = ('shown' === type) ? 'SHOWN' : 'HIDDEN';
          this.emitVmApp(name + '_MODAL_LOTTERY_BODY');
        });
      },
      // @param   {string}   type - show|hide
      changeTransition: function(type) {
        var isShow = 'show' === type;

        this.transition.header = isShow ? 'fadeDown' : 'fadeUp';
        this.transition.body   = isShow ? 'fadeUp'   : 'fadeDown';
      },
      onClickClose: function() {
        this.hide();
      }
    }
  };


  // お気に入り数字がない
  Components.modalNoFavoriteNumbers = {
    template: '<modal ' +
                'v-bind:is-show="isShow" ' +
                'v-bind:is-header="false" ' +
                'v-on:hide="$emit(\'hide\', $event)">' +
                '<template slot="body">' +
                  '<p>{{ productName }}で使えるお気に入り数字がまだ登録されていません。</p>' +
                  '<p>※マイページの「設定」＞「お気に入り数字」から登録、編集できます。</p>' +
                '</template>' +
              '</modal>',
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
    },
    computed: {
      productName: function() {
        return this.$store.getters.productName || '';
      }
    }
  };


  Components.modalSelectFavoriteNumber = {
    template: '<li v-bind:class="liClass">' +
                '<div class="m_formCheckList3_inner">' +
                  '<input-radio name="favoriteItem" ' +
                    'v-bind:checked-value="selected" ' +
                    'v-bind:value="index" ' +
                    'v-bind:disabled="disabled" ' +
                    'v-on:change="onChange">' +
                    '<span class="m_radio_txt" ' +
                      'v-bind:is="currentComponent" ' +
                      'v-bind:items="numbers" ' +
                      'v-bind:shape="shape" ' +
                      'v-bind:emptyValue="emptyValue">' +
                    '</span>' +
                    '<span class="u_colorAlert">{{ errorText }}</span>' +
                  '</input-radio>' +
                '</div>' +
              '</li>',
    components: {
      'lottery-item-labels': Components.LOTTERY_LABEL_NUMBERS,
      'lottery-item-labels-bingo': Components.LOTTERY_LABEL_FAV_BINGO
    },
    props: {
      index: Number,
      selected: {
        type: [String, Number],
        default: ''
      },
      numbers: {
        type: Array,
        default: function() {
          return [];
        }
      },
      options: {
        type: Object,
        default: function() {
          return {};
        }
      },
      disabled: {
        type: Boolean,
        default: false
      },
      errorText: {
        type: String,
        default: ''
      }
    },
    watch: {
      'options.betType': function() {
        this.validate();
      }
    },
    mounted: function() {
      this.validate();
    },
    computed: {
      liClass: function() {
        return {
          is_checked: this.selected === this.index
        };
      },
      isUiNumbers: function() {
        return this.$store.getters.isUiNumbers;
      },
      isUiBingo: function() {
          return this.$store.getters.isUiBingo;
      },
      shape: function() {
        return this.isUiNumbers ? 'square' : 'circle';
      },
      emptyValue: function() {
        return this.isUiNumbers || this.isUiBingo ? '-' : '';
      },
      currentComponent: function() {
        return this.isUiBingo
                  ? 'lottery-item-labels-bingo' : 'lottery-item-labels';
      }
    },
    methods: {
      validate: function() {
        var isSameNumbers = this.$store.getters.isSameNumbers(this.numbers);

        var bet = this.options.betType || '';
        var isBetBoxSet = ('set' === bet) || ('box' === bet);

        if (this.isUiNumbers && isSameNumbers && isBetBoxSet) {
          this.disabled  = true;
          this.errorText = '申込みタイプにボックスまたはセットを指定しているため選択できません。';
        } else {
          this.disabled  = false;
          this.errorText = '';
        }
      },
      // @param   {string}   val - string number
      onChange: function(val) {
        val = val - 0;

        this.selected = val;
        this.$emit('change', val);
      }
    }
  };

  // お気に入り数字を選択
  Components.modalSelectFavoriteNumbers = {
    template: '<modal body-class="m_modal_body__type2" ' +
                'v-bind:is-show="isShow" ' +
                'v-bind:is-favorite="isFavorite" ' +
                'v-on:hide="$emit(\'hide\', $event)">' +
                '<template slot="header">お気に入り数字から選択</template>' +
                '<template slot="body">' +
                  '<ul class="m_formCheckList3">' +
                    '<li is="favorite-item" ' +
                      'v-for="(numbers, i) in items" ' +
                      'v-bind:key="i" ' +
                      'v-bind:index="i" ' +
                      'v-bind:numbers="numbers" ' +
                      'v-bind:selected="selected" ' +
                      'v-bind:options="options" ' +
                      'v-on:change="onChange"></li>' +
                  '</ul>' +
                '</template>' +
                '<template slot="footer">' +
                  '<ul class="m_modal_btnWrap2">' +
                    '<li>' +
                      '<button-lottery class="m_btn__color2 m_modal_btn m_btn__block" ' +
                        'v-on:click="$emit(\'hide\')">' +
                        'キャンセル' +
                      '</button-lottery>' +
                    '</li>' +
                    '<li>' +
                      '<button-lottery class="m_modal_btn m_btn__block" ' +
                        'v-bind:disabled="isUnSelect" ' +
                        'v-on:click="$emit(\'click\', \'success\', items[selected])">' +
                        'この数字を反映する' +
                      '</button-lottery>' +
                    '</li>' +
                  '</ul>' +
                '</template>' +
              '</modal>',
    components: {
      'favorite-item': Components.modalSelectFavoriteNumber
    },

    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      isFavorite: {
          type: Boolean,
          default: true
      },
      selected: {
        type: [String, Number],
        default: ''
      },
      options: {
        type: Object,
        default: function() {
          return {};
        }
      }
    },
    computed: {
      isUnSelect: function() {
        return '' === this.selected;
      },
      items: function() {
        return this.$store.getters['favoriteNumbers/numbers'];
      }
    },
    watch: {
      isShow: function() {
        this.selected = '';
      }
    },
    methods: {
      // @param   {number}   selected
      onChange: function(selected) {
        this.selected = selected;
        // this.$emit('change', selected);
      }
    }
  };

  Components.modalFavoriteNumbers = {
    template: '<component ' +
                'v-bind:is="currentComponent" ' +
                'v-bind:is-show="isShow" ' +
                'v-bind:options="options" ' +
                // 'v-on:change="$emit(\'change\', $event)" ' +
                'v-on:hide="$emit(\'hide\', $event)" ' +
                'v-on:click="onClick"></component>',
    components: {
      'modal-select-favorite-numbers': Components.modalSelectFavoriteNumbers,
      'modal-no-favorite-numbers'    : Components.modalNoFavoriteNumbers,
    },

    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      options: {
        type: Object,
        default: function() {
          return {};
        }
      }
    },
    computed: {
      items: function() {
        return this.$store.getters['favoriteNumbers/numbers'];
      },
      currentComponent: function() {
        return this.items.length
                  ? 'modal-select-favorite-numbers' : 'modal-no-favorite-numbers';
      }
    },
    methods: {
      /**
       * @param   {string}   type - success
       * @param   {*}        param
       */
      onClick: function(type, param) {
        this.$emit('click', type, param);
      }
    }
  };


  // モーダルrouter extend
  Components.lotteryNumberSelectModalRouter = {
    extends: Components.MODAL_ROUTER,

    template: '<div>' +
                '<modal-purchase-errors ' +
                  'v-bind:purchase-error="routeModal" ' +
                  'v-on:hide="reset"></modal-purchase-errors>' +
                // リセット
                '<modal-confirm continue-btn-text="削除する" ' +
                  'v-bind:is-show=" \'confirm-reset\' === routeModal " ' +
                  'v-on:click="onClick" ' +
                  'v-on:hide="reset">' +
                  '<template slot="body">' +
                    '<p v-if="currentAlphabet">申し込み数字{{ currentAlphabet }}をリセットしますか？</p>' +
                  '</template>' +
                '</modal-confirm>' +
                // ボックス・セット指定で数字が全部同じ
                '<modal ' +
                  'v-bind:is-show=" \'alert-bet-type\' === routeModal " ' +
                  'v-bind:is-header="false" ' +
                  'v-on:hide="onHideAlertBetType">' +
                  '<template slot="body">' +
                    // ナンバーズ4の場合
                    '<p v-if="isNumbers4">申込タイプが「ボックス」および「セット」の場合は、すべての数字が同じ（「1111」など）では申し込みできません。<br/>' +
                  '申込タイプを「ストレート」に変更いただくか、申込数字を選び直してください。</p>' +
                    // ナンバーズ3の場合
                    '<p v-else>申込タイプが「ボックス」および「セット」の場合は、すべての数字が同じ（「111」など）では申し込みできません。<br/>' +
                  '申込タイプを「ストレート」に変更いただくか、申込数字を選び直してください。</p>' +
                  '</template>' +
                '</modal>' +
                // お気に入り数字
                '<modal-favorite-numbers ' +
                  'v-bind:is-show=" \'select-favorite-numbers\' === routeModal " ' +
                  'v-bind:options="payload" ' +
                  'v-on:click="onClick" ' +
                  'v-on:hide="reset">' +
                '</modal-favorite-numbers>' +
              '</div>',
    components: {
      'modal-purchase-errors' : Components.MODAL_PURCHASE_ERRORS,
      'modal-favorite-numbers': Components.modalFavoriteNumbers
    },
    computed: {
      currentAlphabet: function() {
        if ('index' in this.payload) {
          return String.fromCharCode(this.payload.index + 65);
        } else {
          return '';
        }
      },
      // ナンバーズ4かどうか判定
      isNumbers4: function() {
          if (this.$store.getters.selectCount === 4) {
            return true;
          }
           return false;
      },
    },
    methods: {
      /**
       * @param   {string}   method - success|function
       * @param   {*}        param
       */
      onClick: function(method, param) {
        var p = this.payload || {};

        if ( ('success' !== method) || (typeof p[method] !== 'function') ) {
          return;
        }

        p[method](param);
        this.reset();
      },
      onHideAlertBetType: function() {
        this.payload.hide();
        this.reset();
      }
    }
  };



  // Mixins：タブページ
  Mixins.tabPage = {
    data: function() {
      return {
        isShowLotteryModal: false
      };
    },
    components: {
      'lottery-controller': Components.lotteryController,
      'lottery-body'      : Components.lotteryBody,
      'purchase-state'    : Components.PURCHASE_STATE,
      'lottery-purchase-form-items': Components.lotteryNumberSelectFormItems
    },
    computed: {
      isSpLayout: function() {
        return 'sp' === this.$store.getters.currentMediaView;
      },
      route: function() {
          return this.$store.getters.route;
      },
      items: function() {
        return this.$store.getters['productItems/items'](this.tabTarget);
      },
      selectCount: function() {
        return this.$store.getters.selectCount;
      },
      totalCount: function() {
        return this.$store.getters.totalCount(this.tabTarget);
      },
      totalPrice: function() {
        return this.$store.getters.totalPrice(this.tabTarget);
      },
      price: function() {
        return this.$store.getters.price;
      },
      unit: function() {
        return this.$store.getters.unit;
      },
      isEdit: function() {
        var route = this.$store.getters.route;
        var state = this.$store.getters['productItems/currentState'](route);
        return 'edit' === state;
      },
    },
    mounted: function() {
      this.onVmApp( 'SHOWN_MODAL_LOTTERY_BODY', this.onChangeStateLotteryModal.bind(this, true) );
      this.onVmApp( 'HIDDEN_MODAL_LOTTERY_BODY', this.onChangeStateLotteryModal.bind(this, false) );
    },
    methods: {
      /**
       * @param   {string}   target - default|continuation
       * @param   {object}   e - event
       */
      onSubmit: function(target, e) {
        target = target || this.tabTarget;

//        var valid = this.$store.getters.purchaseState(target);

//        if (valid.isValid) {
          e.currentTarget.submit();
//        } else {
//          this.$emit('purchase_error', valid.errorType);
//        }
      },
      onChangeStateLotteryModal: function(isShow) {
        this.isShowLotteryModal = isShow;
      },
    }
  };

  // Mixins：タブページ・通常購入
  Mixins.tabPageDefault = {
    data: function() {
      return {
        tabTarget: 'default'
      };
    },
  };

  // Mixins：タブページ・継続購入
  Mixins.tabPageContinuation = {
    data: function() {
      return {
        tabTarget: 'continuation',
        isShowValidText: false,
        formValid: true,
        formInValidScrollTargetEl: null //{HTMLElement|null}
      };
    },
    watch: {
      formValid: function(isValid) {
        if (isValid) {
          this.isShowValidText = false;
        }
      }
    },
    mounted: function() {
      this.resetContinuationCount();
    },
    methods: {
      resetContinuationCount: function() {
        this.$store.dispatch('productItems/updateItems', {
          target: this.tabTarget,
          properies: {
            continuationCount: 0
          }
        });
      },
      /**
       * @param   {object}       vals
       *          {bool}         vals.isValid
       *          {HTMLELement}  vals.scrollTargetEl
       */
      onChangeValid: function(vals) {
        if ('isValid' in vals) {
          this.formValid = vals.isValid;
        }
        if ('scrollTargetEl' in vals) {
          this.formInValidScrollTargetEl = vals.scrollTargetEl; //{HTMLElement}
        }
      },
      /**
       * @param   {string}   target - default|continuation
       * @param   {object}   e - event
       */
      onSubmit: function(target, e) {
        target = target || this.tabTarget;

        var form = e.currentTarget;
//        var purchaseValid = this.$store.getters.purchaseState(target);

        // 購入金額チェック
//        if (!purchaseValid.isValid) {
//          this.$emit('purchase_error', purchaseValid.errorType);
//          return;
//        }

        var inValidTarget = this.formInValidScrollTargetEl; //{HTMLElement}
        var y;

        // フォームバリデーションチェック
        if (!this.formValid) {
          this.isShowValidText = true;
          y = inValidTarget ? inValidTarget.offsetTop : form.offsetTop;
          window.scroll(0, y);
          return;
        }

//        form.submit();
        sc_wmb_sp_470Modal.show();
      },
    }
  };


  // 継続購入オプション設定
  Mixins.formItemsContinuation = {
    components: {
      'form-check-list': Components.FORM_CHECK_LIST_RADIO
    },

    data: function() {
      return {
        frequency: this.$store.getters.continuationSetting('frequency'),
        period: this.$store.getters.continuationSetting('period'),
        periodRangeValue: this.$store.getters.continuationSetting('periodRangeValue'),
        endDyShtJogen: this.$store.getters.continuationSetting('endDyShtJogen'),
        nowDate: this.$store.getters.continuationSetting('nowDate'),
      };
    },
    computed: {
      unit: function() {
        return this.$store.getters.unit;
      },
      frequencyItems: function() {
        return this.$store.getters.continuationSetting('frequencyItems');
      },
      periodItems: function() {
        return this.$store.getters.continuationSetting('periodItems');
      },
      periodRangeName: function() {
        return this.$store.getters.continuationSetting('periodRangeName');
      }
    },
    mounted: function() {
      this.$nextTick(function() {
        $(function() {
          this.initPeriodRange();
        }.bind(this));
      });
    },
    
    alertModalOverdate : null,
    
    methods: {
      // 終了日datepicker
      initPeriodRange: function() {
        var el = this.$refs.periodRange;
        if (!el) return;
        var start = this.$store.getters.moment(this.nowDate).add('days', 1).toDate();
        
        new _ns.Form.Calendar(el, {
          onSelect: this.onChangePeriodRange.bind(this),
          minDate: start
        });
      },
      // @param   {string}   val - YYYY/MM/DD
      onChangePeriodRange: function(val) {
          this.periodRangeValue = val;
      },
      onChangeFrequency: function(selected) {
        this.frequency = selected - 0; //{number}
      },
      onChangePeriod: function(selected) {
        this.period = selected - 0; //{number}
        this.convKnyKknVal(this.period);
      },
      hideperiodRange: function() {
        this.periodRangeValue = null;
      },
      /*
       * 購入期間の値を変更する。
       * HTMLのコード値とオンライン処理（コード定義）のコード値が異なるため、オンライン処理へ連携するコード値の変換を行う。
       * 画面で選択した購入期間が"4"（終了日指定）の場合、"8"を設定
       * 画面で選択した購入期間が"5"（自動延長）の場合、"9"を設定
       * 上記以外の場合、画面選択値をそのまま設定
       */
      convKnyKknVal: function(val) {
        switch (val) {
        case 4:
            document.getElementById('tnyInfo.knyKkn').value = 8;
            break;
        case 5:
            document.getElementById('tnyInfo.knyKkn').value = 9;
            break;
          default:
            document.getElementById('tnyInfo.knyKkn').value = val;
            break;
        }
      },
    }
  };

  // 継続購入オプション設定・キャリーオーバー買い増し設定
  Mixins.formItemsContinuationUpCarryOver = {
    data: function() {
      return {
        isUpCarryOver: this.$store.getters.continuationSetting('isUpCarryOver'),
        upCarryOverCountValue: this.$store.getters.continuationSetting('upCarryOverCountValue'),
      };
    },
    alertModalOverMax : null,
    alertModalUnderMin: null,
    alertModalString  : null,

    computed: {
      isUpCarryOverItems: function() {
        return this.$store.getters.continuationSetting('isUpCarryOverItems');
      },
      upCarryOverCountName: function() {
        return this.$store.getters.continuationSetting('upCarryOverCountName');
      },
    },
    mounted: function() {
      this.createAlertModals();
    },
    methods: {
      createAlertModals: function() {
        var $o = this.$options;
        // キャリーオーバー時買い増し口数上限
//        var maxCnt = this.$store.state.product.continuationSetting.upCarryOverMaxCount; 
        // 数選くじ 1投入組み合わせ数 上限値
        var maxItemCnt = this.$store.state.productItems.maxItemCount.continuation; 

//        $o.alertModalOverMax = new _ns.AlertModal({
////          html: '「継続購入」の「キャリーオーバー時の買い増し」の「購入口数」は0から99までの範囲で入力してください。',
//          html: '「継続購入」の「キャリーオーバー時の買い増し」の「購入口数」は1から' + maxCnt + 'までの範囲で入力してください。',
//          afterHide: this.focusUpCarryOverCountInput.bind(this)
//        });
        $o.alertModalUnderMin = new _ns.AlertModal({
//          html: '「継続購入」の「キャリーオーバー時の買い増し」の「購入口数」は1から99までの範囲で入力してください。',
          html: '「継続購入」の「キャリーオーバー時の買い増し」の「購入口数」は1以上で入力してください。',
          afterHide: this.focusUpCarryOverCountInput.bind(this)
        });
        $o.alertModalString = new _ns.AlertModal({
          html: '「継続購入」の「キャリーオーバー時の買い増し」の「購入口数」は半角数字で入力してください。',
          afterHide: this.focusUpCarryOverCountInput.bind(this)
        });
        $o.alertModalOverMaxItemCount = new _ns.AlertModal({
            html: '継続購入の申込数字件数とキャリーオーバー時の買い増し口数の合計が、上限値' + maxItemCnt + 'を超えています。<br />継続購入の申込数字件数とキャリーオーバー時の買い増し口数の合計は上限値' + maxItemCnt + '以下の数字を入力してください。',
            afterHide: this.focusUpCarryOverCountInput.bind(this)
          });
      },
      // @param   {string}   target
      showAlertModal: function(target) {
        if (!target) return;

        var $o = this.$options;
        var pref = 'alertModal';
        var _target = target.charAt(0).toUpperCase() + target.slice(1);

        if (!!$o[pref + _target]) {
          $o[pref + _target].show();
        }
      },

      focusUpCarryOverCountInput: function() {
        var el = this.$refs.upCarryOverCount;

        if (!!el) {
          el.focus();
        }
      },
      onChangeisUpCarryOver: function(selected) {
        this.isUpCarryOver = selected - 0; //{number}
      },
      onChangeUpCarryOverCount: function(val) {
        var $o = this.$options;
//        var maxCnt = this.$store.state.product.continuationSetting.upCarryOverMaxCount; 
        // 数選くじ 1投入組み合わせ数 上限値
        var maxItemCnt = this.$store.getters['productItems/maxItemCount']("continuation");

        this.upCarryOverCountValue = val;

        if ('' === val) {
          // 未入力
          return;

//        } else if (val > 99) {
//        } else if (val > maxCnt) {
//          // 最大値超
////          this.onErrorUpCarryOverCount('overMax', 99);
//          this.onErrorUpCarryOverCount('overMax', maxCnt);
//
        } else if (val < 1) {
          // 最小値未満
          this.onErrorUpCarryOverCount('underMin', 1);
        } else {
			var panelCnt = 0;
            var items = this.$store.getters['productItems/items']("continuation");
	        for (var i = 0, len = items.length; i < len; ++i) {
	        	if (items[i].numbers.length > 0) {
	        		panelCnt = panelCnt + 1;
	        	}
			}
			if ((panelCnt + this.upCarryOverCountValue) > maxItemCnt) {
                this.onErrorUpCarryOverCount('overMaxItemCount', (maxItemCnt-panelCnt));
			}
        }
      },
      // @param   {string}   error
      onErrorUpCarryOverCount: function(errorType, value) {
        if (typeof value !== 'undefined') {
          setTimeout(function() {
            this.upCarryOverCountValue = value;
          }.bind(this), 0);
        }

        switch (errorType) {
          case 'string':
            // 不正値
            this.showAlertModal('string');
            break;

          case 'overMax':
            // 最大値超
            this.showAlertModal('overMax');
            break;

          case 'underMin':
            // 最小値未満
            this.showAlertModal('underMin');
            break;

          case 'overMaxItemCount':
            // パネル数＋買い増し口数が1投入組み合わせ上限以上
            this.showAlertModal('overMaxItemCount');
            break;
        }
      },
    }
  };

  // 継続購入オプション設定・月～金すべて
  Mixins.formItemsContinuationWeekToggle = {
    data: function() {
      return {
        frequencyWeek: this.$store.getters.continuationSetting('frequencyWeekItems'),
      };
    },
    watch: {
      'frequencyWeek.all': function(val) {
          this.onCheckedFrequencyWeekAll(!!val);
          this.onChangeCheckboxVal('all', val);
      },
      'frequencyWeek.monday': function(val) {
        this.onCheckedFrequencyWeek(!!val);
        this.onChangeCheckboxVal('monday', val);
      },
      'frequencyWeek.tuesday': function(val) {
        this.onCheckedFrequencyWeek(!!val);
        this.onChangeCheckboxVal('tuesday', val);
      },
      'frequencyWeek.wednesday': function(val) {
        this.onCheckedFrequencyWeek(!!val);
        this.onChangeCheckboxVal('wednesday', val);
      },
      'frequencyWeek.thursday': function(val) {
        this.onCheckedFrequencyWeek(!!val);
        this.onChangeCheckboxVal('thursday', val);
      },
      'frequencyWeek.friday': function(val) {
        this.onCheckedFrequencyWeek(!!val);
        this.onChangeCheckboxVal('friday', val);
      },
    },
    methods: {
      onCheckedFrequencyWeekAll: function(isCheckedAll) {
        var model = this.frequencyWeek;

        _.forEach(model, function(value, key) {
          if ('all' !== key) {
            model[key] = isCheckedAll ? 0 : model[key];
          }
        });
      },
      onCheckedFrequencyWeek: function(isChecked) {
        if (isChecked) {
          this.frequencyWeek.all = 0;
        }
      },
      onChangeFrequencyCheck: function(key) {
          var model = this.frequencyWeek;
          document.getElementByName(key).value = model[key];
      },
      onChangeCheckboxVal: function(item, val) {
        var changeVal = val;
        if (changeVal == false) changeVal = '0';
        else if (changeVal == true) changeVal = '1';
        if ('monday' == item) {
          document.getElementById('tnyInfo.knyDyMo').value = changeVal;
        }
        if ('tuesday' == item) {
          document.getElementById('tnyInfo.knyDyTu').value = changeVal;
        }
        if ('wednesday' == item) {
          document.getElementById('tnyInfo.knyDyWe').value = changeVal;
        }
        if ('thursday' == item) {
          document.getElementById('tnyInfo.knyDyThu').value = changeVal;
        }
        if ('friday' == item) {
          document.getElementById('tnyInfo.knyDyFr').value = changeVal;
        }
        if ('all' == item) {
          document.getElementById('tnyInfo.knyDyMoToFr').value = changeVal;
        }
      }
    }
  };



})(window, document, Vue);