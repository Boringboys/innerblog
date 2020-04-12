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
			
			
			//	如果已设置cookie，获取并恢复状态
			var ctmpCurrentTime = getCookie("tmpCurrentTime")
			var cisMusicPlaying = getCookie("isMusicPlaying")
			var cplayingMusicNum = getCookie("playingMusicNum")
			var cplayerMode = getCookie("playerMode")
			var cplayerModeStr = getCookie("playerModeStr")
			if(ctmpCurrentTime != "" && cplayingMusicNum != "" && cplayerMode != "" && cplayerModeStr != "" && cplayingMusicNum != -1){
				console.log(ctmpCurrentTime)
				tmpCurrentTime = parseFloat(ctmpCurrentTime)
				console.log(tmpCurrentTime)
				playingMusicNum = cplayingMusicNum
				playerMode = cplayerMode
				playerModeStr = cplayerModeStr
				
				//	恢复歌名 设置滚动歌名
				$('#musicplayer').attr("src","https://boringboys-1254394685.cos.ap-shanghai.myqcloud.com/gal/music/"+musicList[playingMusicNum].FullName)
				if(scrollInterval){
					clearInterval(scrollInterval)
					scrollInterval = null
				}
				midFullNameTextLab.text("          "+musicList[playingMusicNum].FullName+"          ")
				midFullNameTextLab.scrollLeft(0)
				if ($("#gal").hasClass("open")){
					scrollInterval = setInterval(function(){ scrollMusicName() }, 100)
				}
				
				//	恢复设置播放模式
				playerModeTextLab.text(playerModeStr)
				
				//	恢复播放位置
				musicPlayer.currentTime = tmpCurrentTime
				
				//	如果还在播放或者播放状态还有效
				if(cisMusicPlaying == "true"){
					musicPlayer.play();
					//	调用play()失败，没有正常开始播放，可能是没有自动播放权限
					if(musicplayer.paused){
						//console.log("播放失败");
						isMusicPlaying = false;
						//	如果是移动端尝试
						if(isMobileDev()){
							//alert("移动端，自动播放失败");
							function touchToPlay(){
								musicPlayer.play();
								
								document.addEventListener('DOMContentLoaded', function () {
									function audioAutoPlay() {
										var musicEle0 = document.getElementById('musicplayer');
										musicEle0.play();
									}
									audioAutoPlay();
								});
								
								document.removeEventListener('touchstart',touchToPlay);
								if(musicplayer.paused){
									alert("触摸播放失败");
									isMusicPlaying = false;
								}
							}
							document.addEventListener('touchstart',touchToPlay);
						}
					}
					
				}
			}
			////
		}
	}
	xhrMusicList.open("GET","https://boringboys-1254394685.cos.ap-shanghai.myqcloud.com/gal/music/musiclist.json","true");
	xhrMusicList.send();
	
	
	
	
	//	文档卸载时事件，通过cookie保存状态
	window.onunload = function(event) {
		console.log("保存播放器状态，有效期x天")
		if(playingMusicNum != -1){
			tmpCurrentTime = musicPlayer.currentTime
			setCookie("tmpCurrentTime",tmpCurrentTime,1)
			setCookie("isMusicPlaying",isMusicPlaying,0.001)
			setCookie("playingMusicNum",playingMusicNum,1)
			setCookie("playerMode",playerMode,1)
			setCookie("playerModeStr",playerModeStr,1)
		}
	};
	
	
	//	上一曲
	preSongBtn.on('click',function(e){
		//console.log("上一首")
		if(musicNum){
			if(isMusicPlaying){
				musicPlayer.pause()
				musicplayer.currentTime=0
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
				midFullNameTextLab.text("          "+musicList[playingMusicNum].FullName+"          ")
				midFullNameTextLab.scrollLeft(0)
				if ($("#gal").hasClass("open")){
					scrollInterval = setInterval(function(){ scrollMusicName() }, 100)
				}
			}
			musicPlayer.play()
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
				midFullNameTextLab.text("          "+musicList[playingMusicNum].FullName+"          ")
				midFullNameTextLab.scrollLeft(0)
				if ($("#gal").hasClass("open")){
					scrollInterval = setInterval(function(){ scrollMusicName() }, 100)
				}
			}
			musicPlayer.play()
			
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
					midFullNameTextLab.text("          "+musicList[playingMusicNum].FullName+"          ")
					midFullNameTextLab.scrollLeft(0)
					scrollInterval = setInterval(function(){ scrollMusicName() }, 100)
				}
				
				if(isMusicPlaying){
					//console.log("暂停")
					musicPlayer.pause()	
				}else{
					//console.log("播放")
					musicPlayer.play()	
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
		nextSongBtn.click()
	}
	// 音乐开始播放事件
	musicPlayer.onplaying = function(){
		console.log("开始播放");
		isMusicPlaying = true;
		playOrPauseBtn.text("暂停");
	}
	//	音乐暂停事件
	musicPlayer.onpause = function(){
		console.log("暂停播放");
		isMusicPlaying = false;
		playOrPauseBtn.text("播放");
	}
	//	滚动播放歌名
	function scrollMusicName(){
		//var maxScrollSize = midFullNameTextLab[0].scrollLeftMax
		midFullNameTextLab.scrollLeft(currentScrollLeft+2)
		var tmpScrollLeft = midFullNameTextLab.scrollLeft()
		//console.log(tmpScrollLeft,currentScrollLeft)
		
		if(tmpScrollLeft == currentScrollLeft){
			currentScrollLeft = -2
		}else{
			currentScrollLeft = tmpScrollLeft
		}
	}
	//	设置cookie
	function setCookie(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires="+ d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	} 
	//	获取cookie
	function getCookie(cname) {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for(var i = 0; i <ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			 }
			 if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			 }
		 }
		return "";
	} 
	//	判断是否是移动端（不完全可靠）
	function isMobileDev(){
		if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))){
			//alert('移动端');
			return true;
		}else{
			//alert('pc端');
			return false;
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
				scrollInterval = setInterval(function(){ scrollMusicName() }, 100)
			}
			
			$(".circle").addClass("open")
			if(!isMusicPlaying){
				audio.play()
			}
		}

	})

})($)