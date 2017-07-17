var app = getApp();
var utils = require("../../utils/utils.js");
Page({
  data: {
    // 当数据是对象的时候，一定要给对象定义一个空对象
    InTheater: {},
    ComingSoon: {},
    Top250: {},
    searchPanelShow: false,
    moviesShow: true,
    searchResult: {}
  },
  onLoad: function () {
    //  只要三条数据
    var InTheaterUrl = app.globalData.moviesUrl + "/v2/movie/in_theaters" + "?start=0&count=3";
    var ComingSoonUrl = app.globalData.moviesUrl + "/v2/movie/coming_soon" + "?start=0&count=3";
    var Top250Url = app.globalData.moviesUrl + "/v2/movie/top250" + "?start=0&count=3";
    this.getMoviesDataList(InTheaterUrl, "InTheater", "正在热映");
    this.getMoviesDataList(ComingSoonUrl, "ComingSoon", "即将上映");
    this.getMoviesDataList(Top250Url, "Top250", "豆瓣Top250");

  },
  //由于template中不能编写.js文件，所以点击更多跳转页面的程序写在这里
  onMoreTap: function (event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: "more/more?category=" + category
    })
  },


  getMoviesDataList: function (url, settedKey, categoryTitle) {
    var _this = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        _this.processData(res.data, settedKey, categoryTitle)
        //  console.log(res);
      },
      fail: function () {

      }
    })
  },
  //  处理豆瓣数据
  processData: function (moviesData, settedKey, categoryTitle) {
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
    //绑定哪一类数据
    var readyData = {};
    //  实现三列数据都展示
    //实现slogan的绑定
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    };
    //  console.log(readyData[settedKey]);
    this.setData(readyData);
  },
  onBindFocus: function () {
    this.setData({
      searchPanelShow: true,
      moviesShow: false,
      searchResult: {}

    })
  },
  closeSearchPanel: function () {
    this.setData({
      searchPanelShow: false,
      moviesShow: true
    })
  },
  //  bindchange
  onBindBlur: function (event) {
    var text = event.detail.value;
    var searchUrl = app.globalData.moviesUrl + "/v2/movie/search?q=" + text;
    this.getMoviesDataList(searchUrl, "searchResult", "");
  },
  //处理电影详情页
  onMovieDetail: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    // console.log(movieId);
    wx.navigateTo({
      url: 'movie-detail/movie-detail?movieId=' + movieId
    })
  }

})