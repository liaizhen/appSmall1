var postData=require("../../data/post-data.js");
Page({
  data:{
   
  },
  onLoad:function(options){
    // this.data.postList = postData.postList;
    // console.log(this.data.postList);
   
    this.setData({
    postList: postData.postList
    })
  },
  gotoPL:function(event){
    //获取到postId
    var postId=event.currentTarget.dataset.postid;
    // console.log(event.currentTarget.dataset.postid);
    wx.navigateTo({
     url:'post-details/post-details?id='+postId
    })
  },
  onSwiperTap: function(event) {
    //获取到冒泡事件中postId   通过event.target
    var postId = event.target.dataset.postid;
    // console.log(event.target);
    wx.navigateTo({
      url: 'post-details/post-details?id=' + postId
      
    })
  }

})