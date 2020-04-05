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
	var middleBtn = $('#middle-btn')
	var tmpCurrentTime = 0
	var isMusicPlaying = false
	var musicList
	var musicNum = 0
	var playingMusicNum = -1
	// 播放模式：顺序播放->0 单曲循环->1 随机播放->2
	var playerMode = 0
	var playerModeStr = "顺序播放"
	var playerModeTextLab = $('#playermode-text')
	//滚动歌名
	var scrollInterval = null
	var currentScrollLeft = 0
	var midFullNameTextLab = $('#mid-fullname-text')
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
		//console.log("上一首")
		if(musicNum){
			if(isMusicPlaying){
				musicPlayer.pause()
				musicplayer.currentTime=0
				isMusicPlaying = false
				playOrPauseBtn.text("播放")	
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
				//console.log(playingMusicNum)
			}
			if(playerMode !== 1){
				$('#musicplayer').attr("src","https://boringboys-1254394685.cos.ap-shanghai.myqcloud.com/gal/music/"+musicList[playingMusicNum].FullName)
				if(scrollInterval){
					clearInterval(scrollInterval)
					scrollInterval = null
				}
				midFullNameTextLab.text(musicList[playingMusicNum].FullName)
				midFullNameTextLab.scrollLeft(0)
				scrollInterval = setInterval(function(){ scrollMusicName() }, 1000)
			}
			musicPlayer.play()
			isMusicPlaying = true
			playOrPauseBtn.text("暂停")
			
		}
		audio.pause()
		audio.currentTime = 0
	})
	//	下一曲
	nextSongBtn.on('click',function(e){
		//console.log("下一首")
		if(musicNum){
			if(isMusicPlaying){
				musicPlayer.pause()
				musicplayer.currentTime=0
				isMusicPlaying = false
				playOrPauseBtn.text("播放")
				
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
				//console.log(playingMusicNum)
			}
			if(playerMode !== 1){
				$('#musicplayer').attr("src","https://boringboys-1254394685.cos.ap-shanghai.myqcloud.com/gal/music/"+musicList[playingMusicNum].FullName)
				if(scrollInterval){
					clearInterval(scrollInterval)
					scrollInterval = null
				}
				midFullNameTextLab.text(musicList[playingMusicNum].FullName)
				midFullNameTextLab.scrollLeft(0)
				scrollInterval = setInterval(function(){ scrollMusicName() }, 1000)
			}
			musicPlayer.play()
			isMusicPlaying = true
			playOrPauseBtn.text("暂停")
			
		}
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
			if(musicNum){
				if(playingMusicNum==-1){
					playingMusicNum=0
					$('#musicplayer').attr("src","https://boringboys-1254394685.cos.ap-shanghai.myqcloud.com/gal/music/"+musicList[playingMusicNum].FullName)
					if(scrollInterval){
						clearInterval(scrollInterval)
						scrollInterval = null
					}
					midFullNameTextLab.text(musicList[playingMusicNum].FullName)
					midFullNameTextLab.scrollLeft(0)
					scrollInterval = setInterval(function(){ scrollMusicName() }, 1000)
				}
				
				if(isMusicPlaying){
					//console.log("暂停")
					musicPlayer.pause()
					isMusicPlaying = false
					playOrPauseBtn.text("播放")
					
				}else{
					//console.log("播放")
					musicPlayer.play()
					isMusicPlaying = true
					playOrPauseBtn.text("暂停")
					
				}
			}				
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
		//console.log("停止")
		musicplayer.pause()
		musicPlayer.currentTime=0
		isMusicPlaying = false
		playOrPauseBtn.text("播放")	
		
		audio.pause()
		audio.currentTime = 0
	})
	//	点击中键
	middleBtn.on('click',function(e){
		//console.log("切换播放模式")
		playerMode+=1
		if(playerMode>2){
			playerMode=0
		}
		if(playerMode == 0){
			playerModeStr = "顺序播放"
		}else if(playerMode == 1){
			playerModeStr = "单曲循环"
		}else{
			playerModeStr = "随机播放"
		}
		playerModeTextLab.text(playerModeStr)
	})
	//	音乐结束事件
	musicPlayer.onended = function(){
		//console.log("播放结束")
		isMusicPlaying = false
		playOrPauseBtn.text("播放")
		
		nextSongBtn.click()
	}
	//滚动播放歌名
	function scrollMusicName(){
		//var maxScrollSize = midFullNameTextLab[0].scrollLeftMax
		midFullNameTextLab.scrollLeft(currentScrollLeft+10)
		var tmpScrollLeft = midFullNameTextLab.scrollLeft()
		console.log(tmpScrollLeft,currentScrollLeft)
		if(tmpScrollLeft == currentScrollLeft){
			currentScrollLeft = 0
		}else{
			currentScrollLeft = tmpScrollLeft
		}
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
					//console.log(this)
				}
			})
			
			if(scrollInterval){
				clearInterval(scrollInterval)
				scrollInterval = null
			}
					
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
			
			if(scrollInterval){
				clearInterval(scrollInterval)
				scrollInterval = null
			}
			
			$(".circle").removeClass("open")
			$(".GalMenu").delay(400).hide(0)
			audio.pause();
			audio.currentTime = 0
		} else {
			
			if(playingMusicNum !== -1){
				scrollInterval = setInterval(function(){ scrollMusicName() }, 1000)
			}
			
			$(".circle").addClass("open")
			if(!isMusicPlaying){
				audio.play()
			}
		}

	})

})($)