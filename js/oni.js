(function ($) {
	var audio = $('#audio')[0]
	var body = $('body')
	var galMenu = $('.gal-menu')
	//在同一DOM元素上实现双击和单击并存
	var clickTimer = null
	//	播放器参数初始化
	var musicPlayer = $('#musicplayer')[0]
	var preSongBtn = $('#pre-song')
	var nextSongBtn = $('#next-song')
	var playOrPauseBtn = $('#play-or-pause')
	var tmpCurrentTime = 0
	var isMusicPlaying = false
	var musicList
	var musicNum = 0
	var playingMusicNum = -1
	// 播放模式：顺序播放->0 单曲循环->1 随机播放->2
	var playerMode = 0
	var playerModeStr = "顺序播放（双击切换）"
	//	获取歌曲列表
	var xhrMusicList=new XMLHttpRequest()
	xhrMusicList.onreadystatechange=function(){
		if (xhrMusicList.readyState==4 && xhrMusicList.status==200){
			var tmpobj=eval("("+xhrMusicList.response+")")
			musicNum=tmpobj.size
			musicList=tmpobj.musiclist
		}
	}
	xhrMusicList.open("GET","https://boringboys-1254394685.cos.ap-shanghai.myqcloud.com/gal/music/musiclist.json","true");
	xhrMusicList.send();
	//	上一曲
	preSongBtn.on('click',function(e){
		console.log("上一首")
		if(musicNum){
			if(isMusicPlaying){
				musicPlayer.pause()
				musicplayer.currentTime=0
				isMusicPlaying = false
				playOrPauseBtn.text("播放")
				playOrPauseBtn.attr("title",playerModeStr)
			}
			if(playerMode == 0){
				if(playingMusicNum==-1){
					playingMusicNum=0
				}else{
					playingMusicNum-=1
				}
				if(playingMusicNum<0){
					playingMusicNum=musicNum-1
				}
			}else if(playerMode == 2){
				do{
					var tmpNum=Math.floor(Math.random()*musicNum)
				}while(tmpNum == playingMusicNum)
				playingMusicNum=tmpNum
				console.log(playingMusicNum)
			}
			if(playerMode !== 1){
				$('#musicplayer').attr("src","https://boringboys-1254394685.cos.ap-shanghai.myqcloud.com/gal/music/"+musicList[playingMusicNum].FullName)
			}
			musicPlayer.play()
			isMusicPlaying = true
			playOrPauseBtn.text("暂停")
			playOrPauseBtn.attr("title",playerModeStr)
		}
		$(".circle").removeClass("open")
		$(".GalMenu").delay(400).hide(0)
		audio.pause()
		audio.currentTime = 0
	})
	//	下一曲
	nextSongBtn.on('click',function(e){
		console.log("下一首")
		if(musicNum){
			if(isMusicPlaying){
				musicPlayer.pause()
				musicplayer.currentTime=0
				isMusicPlaying = false
				playOrPauseBtn.text("播放")
				playOrPauseBtn.attr("title",playerModeStr)
			}
			if(playerMode == 0){
				if(playingMusicNum==-1){
					playingMusicNum=0
				}else{
					playingMusicNum+=1
				}
				if(playingMusicNum>=musicNum){
					playingMusicNum=0
				}
			}else if(playerMode == 2){
				do{
					var tmpNum=Math.floor(Math.random()*musicNum)
				}while(tmpNum == playingMusicNum)
				playingMusicNum=tmpNum
				console.log(playingMusicNum)
			}
			if(playerMode !== 1){
				$('#musicplayer').attr("src","https://boringboys-1254394685.cos.ap-shanghai.myqcloud.com/gal/music/"+musicList[playingMusicNum].FullName)
			}
			musicPlayer.play()
			isMusicPlaying = true
			playOrPauseBtn.text("暂停")
			playOrPauseBtn.attr("title","双击停止播放")
		}
		$(".circle").removeClass("open")
		$(".GalMenu").delay(400).hide(0)
		audio.pause()
		audio.currentTime = 0
	})
	//	播放/暂停
	playOrPauseBtn.on('click',function(e){
		if(clickTimer){
			window.clearTimeout(clickTimer)
			clickTimer = null
		}
		clickTimer = window.setTimeout(function(){
			if(isMusicPlaying){
				console.log("暂停")
				musicPlayer.pause()
				isMusicPlaying = false
				playOrPauseBtn.text("播放")
				playOrPauseBtn.attr("title",playerModeStr)
			}else{
				console.log("播放")
				musicPlayer.play()
				isMusicPlaying = true
				playOrPauseBtn.text("暂停")
				playOrPauseBtn.attr("title","双击停止播放")
			}			
			$(".circle").removeClass("open")
			$(".GalMenu").delay(10000).hide(0)
			audio.pause()
			audio.currentTime = 0
		},233)
	})
	//	双击播放/暂停键
	playOrPauseBtn.on('dblclick',function(e){
		if(clickTimer){
			window.clearTimeout(clickTimer)
			clickTimer = null
		}
		if(isMusicPlaying){
			console.log("停止")
			musicplayer.pause()
			musicPlayer.currentTime=0
			isMusicPlaying = false
			playOrPauseBtn.text("播放")
			playOrPauseBtn.attr("title",playerModeStr)
		}else{
			console.log("切换播放模式")
			playerMode+=1
			if(playerMode>2){
				playerMode=0
			}
			if(playerMode == 0){
				playerModeStr = "顺序播放（双击切换）"
			}else if(playerMode == 1){
				playerModeStr = "单曲循环（双击切换）"
			}else{
				playerModeStr = "随机播放（双击切换）"
			}
			playOrPauseBtn.attr("title",playerModeStr)
		}
		$(".circle").removeClass("open")
		$(".GalMenu").delay(10000).hide(0)
		audio.pause()
		audio.currentTime = 0
	})
	//	音乐结束事件
	musicPlayer.onended = function(){
		console.log("播放结束")
		isMusicPlaying = false
		playOrPauseBtn.text("播放")
		playOrPauseBtn.attr("title",playerModeStr)
		nextSongBtn.click()
	}
	//////////////////////
	body.on('mousedown', function (e) {
		if(e.which !== 3 && $(e.target).parents('.gal-menu').length < 1) {
			body.find('.gal-menu').stop(true, false).animate({
				opacity: 0
			}, {
				duration: 100,
				queue: false,
				complete: function() {
					$(this).css('display', 'none')
				}
			})
			$(".circle").removeClass("open")
			$(".GalMenu").delay(400).hide(0)
			audio.pause()
			audio.currentTime = 0
		}
	})

	body.on('contextmenu', function (e) {
		e.preventDefault()
		e.stopPropagation()

		var target = e || window.event;
		var clickX = 0
		var docEl = document.documentElement
		if ((target.clientX || target.clientY) && document.body && document.body.scrollLeft !== null) {
			clickX= target.clientX + document.body.scrollLeft
		}

		// 确定标准兼容模式开启
		if ((target.clientX || target.clientY) && document.compatMode === 'CSS1Compat' && docEl && docEl.scrollLeft !== null) {
			clickX = target.clientX + docEl.scrollLeft
		}
		if (target.pageX || target.pageY) {
			clickX = target.pageX
		}

		var boundary = 150
		var top = target.clientY - boundary
		var left = (body[0] === e.target) ? clickX - boundary : target.clientX - boundary
		var clientHeight = docEl.clientHeight
		var clientWidth = docEl.clientWidth
		if (top < 0) {
			top = 0
		}
		if (clientHeight - target.clientY < 150) {
			top = clientHeight - 300
		}
		if (left < 0) {
			left = 0
		}
		if (body[0] === e.target) {
			if (clientWidth - clickX < 150) {
				left = clientWidth - 300
			}
		} else {
			if (clientWidth - target.clientX < 150) {
				left = clientWidth - 300
			}
		}

		galMenu.css({
			top: top + 'px',
			left: left + 'px',
			display: 'block'
		}).stop(true, false).animate({
			opacity: 1
		}, {
			duration: 100,
			queue: false
		})

		if ($("#gal").hasClass("open")) {
			$(".circle").removeClass("open")
			$(".GalMenu").delay(400).hide(0)
			audio.pause();
			audio.currentTime = 0
		} else {
			$(".circle").addClass("open")
			if(!isMusicPlaying){
				audio.play()
			}
		}

	})

})($)