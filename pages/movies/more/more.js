var utils = require("../../../utils/utils.js");
var app = getApp();
Page({

  data: {
    movies: {},
    totalCount:0,
    requestUrl:'',
    isEmpty:'true'
  },
 
  onLoad: function (options) {
    var category = options.category;
    wx.setNavigationBarTitle({
      title: category
    });
    var dataUrl = "";
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.moviesUrl + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.moviesUrl + "/v2/movie/coming_soon";
        break;
      case "豆瓣Top250":
        dataUrl = app.globalData.moviesUrl + "/v2/movie/top250";
        break;


    }
    this.data.requestUrl=dataUrl;
    utils.http(dataUrl, this.processData);
    

  },
  // onScrollLower: function (event) {
   
  //   var nextUrl=this.data.requestUrl+"?start="+this.data.totalCount+"&count=20";
  //   utils.http(nextUrl, this.processData);
  //   wx.showNavigationBarLoading();
  // },
  // 解决下拉刷新与scroll-view不能同时使用的问题
  onReachBottom: function () {
    var nextUrl = this.data.requestUrl +
      "?start=" + this.data.totalCount + "&count=20";
    utils.http(nextUrl, this.processData)
    wx.showNavigationBarLoading();
  },
  onPullDownRefresh: function () {
    var refreshUrl = this.data.requestUrl + "?start=0&count=20";
    utils.http(refreshUrl, this.processData);
    //解决下拉刷新数据重复的问题
    this.data.movies={};
    this.data.isEmpty=true;
    wx.showNavigationBarLoading();
  
  },
  
  processData: function (moviesData) {
    var movies = [];
    for (var idx in moviesData.subjects) {
      var subject = moviesData.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var tem = {
        stars: utils.ScoretoStars(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverImg: subject.images.large,
        movieId: subject.id
      };
      movies.push(tem);
    }
    var totalMovies={};
    if (!this.data.isEmpty){
      //说明不是第一次加载数据
       totalMovies = this.data.movies.concat(movies);
    }
    else{
      totalMovies=movies;
      this.data.isEmpty=false;
    }
    
   
    this.setData({
      movies: totalMovies
    });
    // 设置加载的交互页面
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
    this.data.totalCount += 20;
    
  },
 //处理电影详情页
  onMovieDetail: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    // console.log(movieId);
    wx.navigateTo({
      url: '../movie-detail/movie-detail?movieId=' + movieId
    })
  }

})