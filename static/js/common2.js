var bingo = {
	initialized: false,
	isTouchDevice: false,
	menu: ["introduction", "cm", "fiction", "event", "dial"],	// Gメニューが増えたらここに追加
	sticky: {},
	share: {
		url: 'https://www.takarakuji-official.jp/brand/bingo5-cp/',
		txt: '合コンでビンゴ！オフィスでビンゴ！おうちでビンゴ！毎週どこかでビンゴな瞬間を巻き起こす、宝くじBINGO5！日本ぜんぶが会場の盛大なビンゴパーティーに、みんなで参加しよう｜ビンゴみたいな宝くじ BINGO5（ビンゴ5）！'
	},
	fn: {}
}

$(function(){
	bingo.bgm.init();
	bingo.nav.init();

	$('a[href^="#"]', '#fukidashi').click(function() {
		if (!$(this).hasClass('noscroll')) {
			var target = $(this).attr('href');
			if(target != '#'){
				$('html, body').stop().animate({scrollTop:$(target ).offset().top}, { duration: 800, easing: 'swing'})
				return false;
			}
		}
	});
})

/* ----------------------------
  BGM
---------------------------- */
bingo.bgm = {
	isplayng: false,
	init: function() {
		var self = $(this);
		self.player = document.getElementById("bgm_player");
		self.btns = $('.btn', '#bgm');
		self.main = $('#bgm');

		self.btns.on('click', function(){
			self.btns.removeClass('selected');
			if (!self.isplayng) {
				self.player.currentTime = 0;
				self.player.play();
				self.isplayng = true;
				self.btns.filter('.on').addClass('selected');
				self.main.addClass('playing');
			} else {
				self.player.pause();
				self.isplayng = false;
				self.btns.filter('.off').addClass('selected');
				self.main.removeClass('playing');
			}
		})
	}
}

/* ----------------------------
  ナビゲーション
---------------------------- */
bingo.nav = {
	init: function() {
		var self = this;
		// ナビゲーション現在地表示
		var url = location.pathname;
		for (var i in bingo.menu) {
			var item = bingo.menu[i];
			if(url.match("/" + bingo.menu[i])) {
				$('li.' + bingo.menu[i], '#sub_column').addClass('current');
			}
		}

		// シェアボタン
		var twitter_url = 'https://twitter.com/share?url=' + encodeURIComponent(bingo.share.url) + '&text=' + encodeURIComponent(bingo.share.txt);
		var facebook_url = 'http://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(bingo.share.url);
		$('#share_twitter').on('click', function() {
			window.open(twitter_url, 'sharewindow', 'width=650, height=400, personalbar=0, toolbar=0, scrollbars=1, sizable=1');
		return false;
		});
		$('#share_facebook').on('click', function() {
			window.open(facebook_url, 'sharewindow', 'width=650, height=400, personalbar=0, toolbar=0, scrollbars=1, sizable=1');
		return false;
		});
	}
}