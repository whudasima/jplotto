//==================================================================================
//	共通処理用JS
//==================================================================================

$(function() {
	/* 当せん者エピソード */
	$('.m_overrideBox .data-index-contents-box .episode_frame').slideUp(0);
	$('.m_overrideBox .data-index-contents-box h3.episode_head').on('click', function() {
		if ($(this).hasClass('open')) {
			$(this).next('.episode_frame').slideUp(600);
			$(this).removeClass('open');
		} else {
			$(this).next('.episode_frame').slideDown(600);
			$(this).addClass('open');
		}
	});
	

	$('.m_overrideBox .data-index-contents-box .episode_frame .txt_area .txt_slide').slideUp(0);
	$('.m_overrideBox .data-index-contents-box .episode_frame .episode_box .btn_area img').on('click', function() {
		if ($(this).hasClass('open')) {
			$(this).parents('.episode_box').children('.txt_area').children('.txt_slide').slideUp(400);
			$(this).attr('src', '/common/images/data/index/btn_sequel_open.png');
			$(this).attr('alt', 'つづきを見る');
			$(this).removeClass('open');
		} else {
			$(this).parents('.episode_box').children('.txt_area').children('.txt_slide').slideDown(400);
			$(this).attr('src', '/common/images/data/index/btn_sequel_close.png');
			$(this).attr('alt', 'とじる');
			$(this).addClass('open');
		}
	});
	
	/* 統計情報 */
	$('.m_overrideBox .data-index-contents-box h3.stats_head').on('click', function() {
		if ($(this).hasClass('open')) {
			$(this).next('.stats_frame').slideUp(600);
			$(this).removeClass('open');
		} else {
			$(this).next('.stats_frame').slideDown(600);
			$(this).addClass('open');
		}
	});
	
	
	
	
});
