var postsData = require("../../../data/post-data.js");
var app=getApp();
Page({
    data: {
        isPlaying: false
    },
    onLoad: function (res) {
        // console.log(postsData);
        var postId = res.id;
        //    将id传递过来，通过data将id传递过来
        this.data.currentPostId = postId;
        var postData = postsData.postList[postId];
        this.setData({
            postData: postData
        });
        // 假设数据库中存储了收藏状态，那么要从数据库中读取到状态值
        //   var postCollected=wx.getStorage({
        //     key:'dd',
        //     success:function(res){
        //key对应的值
        //       console.log(res.data);

        //     }
        // });
        // 假设收藏的状态 var postsCollected={
        //     0:"true",
        //     1:"true",
        //     2:"false",
        // }
        // 获取到一个状态数组
        //   如果没有被收藏
        var postsCollected = wx.getStorageSync("posts_Collected");
        if (postsCollected) {
            //   获取到对应的ID的收藏状态情况
            var postCollected = postsCollected[postId];
            //   将收藏的状态绑定到data上
            this.setData({
                collected: postCollected
            });
        }
        else {
            //如果不存在状态对象，就定义一个状态的对象
            var postsCollected = {};
            // 并且将对应的postId对应的状态设置成未收藏
            postsCollected[postId] = false;
            // 将这个记录状态的对象放置在内存中
            wx.setStorageSync("posts_Collected", postsCollected);
        }
        if (app.globalData.g_isPlaying && app.globalData.g_currentPostId === postId){
            this.setData({
                 isPlaying: true
            })
        }
        this.setMusicMonitor();
        // 3.退出播放的页面,音乐播放的状态值重新被加载问题
    },
    setMusicMonitor:function(){
      // 2.实现点击播放的总按钮，图片的上的按钮也同步改变，即点击暂停。图片对应的图标也进行切换，其实就是改变isPlaying的值
      // 4.解决在不同的页面，音乐播放的状态与图标的状态不一致，也就是说从详情a页面切换到详情b页面，详情b页面的音乐仍然是显示播放的状态，这里需要定义一个全局的变量来表示当前正在播放的页面g_currentPostId
      // 5.监听音乐停止，图片变成默认的状态
        var _this=this;
        wx.onBackgroundAudioPlay(function() {
          _this.setData({
            isPlaying:true
          })
          app.globalData.g_isPlaying=true;
          app.globalData.g_currentPostId = _this.data.currentPostId;
        });
        wx.onBackgroundAudioPause(function() {
          _this.setData({
               isPlaying:false
          })
           app.globalData.g_isPlaying=false;
           app.globalData.g_currentPostId = null;
        }),
          wx.onBackgroundAudioStop(function () {
            _this.setData({
              isPlaying: false
            })
            app.globalData.g_isPlaying = false;
            app.globalData.g_currentPostId = null;
          })
    },
    onCollectedTap: function (event) {
        this.getpostsCollectedSync();
        // this.getpostsCollectedAsy();

    },
    // 同步获取存储的方法
    getpostsCollectedSync: function () {
        var postsCollected = wx.getStorageSync("posts_Collected");
        //获取id对应的状态数组
        var postCollected = postsCollected[this.data.currentPostId];
        //将状态取反
        postCollected = !postCollected;
        //更新内存的状态
        postsCollected[this.data.currentPostId] = postCollected;
        wx.setStorageSync('posts_Collected', postsCollected);
        // this.showModal(postCollected);
        this.showToast(postCollected);
    },
    //    异步获取存储的方法
    getpostsCollectedAsy: function () {
        var _this = this;
        wx.getStorage({
            key: "posts_Collected",
            success: function (res) {
                var postsCollected = res.data;
                //获取id对应的状态数组
                var postCollected = postsCollected[_this.data.currentPostId];
                //将状态取反
                postCollected = !postCollected;
                //更新内存的状态
                postsCollected[_this.data.currentPostId] = postCollected;
                wx.setStorageSync('posts_Collected', postsCollected);
                // this.showModal(postCollected);
                _this.showToast(postCollected);
            }
        });

    },
    onShareTap: function () {
        var itemList = [
            '分享到微信好友',
            '分享到朋友圈',
            '分享到qq好友',
            '分享到微博'
        ];
        wx.showActionSheet({
            itemList: itemList,
            success: function (res) {
                console.log(res.tapIndex);
                //res.tapIndex  数组的下标
                // res.cancel 取消按钮
                wx.showModal({
                    title: '用户点击了' + itemList[res.tapIndex],
                    content: '用户是否取消？' + res.cancel
                });
            }
        })
    },
    //   音乐播放
    onMusicTap: function () {
        var currentPostId = this.data.currentPostId;
        var postData = postsData.postList[currentPostId];
        // 1.绑定一个变量，通过这个变量来改变视频的播放状态,并且实现音乐背景图片的切换
        if (this.data.isPlaying) {
            wx.pauseBackgroundAudio();
            this.setData({
                isPlaying: false
            });
        } else {
            wx.playBackgroundAudio({
                dataUrl: postData.music.dataUrl,
                title: postData.music.title,
                coverImgUrl: postData.music.coverImgUrl
            });
            this.setData({
                isPlaying: true
            });
        }
       
    },
    showModal: function (postCollected) {
        var _this = this;
        wx.showModal({
            title: '收藏',
            content: postCollected ? '收藏该成功？' : '取消收藏该文章？',
            showCancel: 'true',
            cancelText: '取消',
            cancelColor: '#333',
            confirmText: '确认',
            confirmColor: 'blue',
            success: function (res) {
                if (res.confirm) {

                    //更新数据绑定，实现图片的切换
                    _this.setData({
                        collected: postCollected
                    });
                }
            }
        })
    },
    showToast: function (postCollected) {
        var _this = this;
        //更新数据绑定，实现图片的切换
        _this.setData({
            collected: postCollected
        });
        console.log(postCollected);
        wx.showToast({
            title: postCollected ? '收藏成功' : '取消成功',
            duration: 1000
        })
    }
})