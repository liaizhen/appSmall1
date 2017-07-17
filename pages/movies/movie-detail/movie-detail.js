// pages/movies/movie-detail/movie-detail.js
// var utils=require("../../../utils/utils.js");
import {Movie} from "class/Movie.js";
var app=getApp();

Page({

  data: {
  movie:{}
  },

  onLoad: function (options) {
    var _this=this;
  
    var movieId = options.movieId;
 
   var detailUrl = app.globalData.moviesUrl + "/v2/movie/subject/" + movieId;
  //  utils.http(detailUrl,this.processDetailData);
  //  创建一个movie实例  es6写法
   var movie=new Movie(detailUrl);
  //  console.log(movie);
  //  通过getMovieData方法来获取豆瓣数据和处理获得的数据
   movie.getMovieData(function(movieData){
       _this.setData({
      movie:movieData
    });
   });
  },
  // processDetailData:function(data){
  //   if(!data){
  //     return;
  //   }
  //   console.log(data);
  //   var director={
  //     avatar:'',
  //     name:'',
  //     id:''
  //   };
  //   if(data.directors[0] !=null){
  //     if(data.directors[0].avatars != null){
  //     director.avatar=data.directors[0].avatars.large;
  //   }
  //   director.name=data.directors[0].name;
  //   director.id=data.directors[0].id;
  // }
  //   var movie={
  //     movieImg:data.images?data.images.large:"",
  //     country:data.countries[0],
  //     title:data.title,
  //     originalTitle:data.original_title,
  //     wishCount:data.wish_count,
  //     commentCount:data.comments_count,
  //     year:data.year,
  //     genres:data.genres.join("、"),
  //     stars:utils.ScoretoStars(data.rating.stars),
  //     score:data.rating.average,
  //     director:director,
  //     cast:utils.convertToCastsString(data.casts),
  //     castsInfo:utils.convertToCastsInfos(data.casts),
  //     summary:data.summary
  //   };
  //   // console.log(movie);
  //   this.setData({
  //     movie:movie
  //   })
  // },
  //查看海报大图
  onScanImg:function (event) {
    var src=event.currentTarget.dataset.src;
    wx.previewImage({
        current: src, // 当前显示图片的http链接
        urls: [src] // 需要预览的图片http链接列表
      })
  }
 
})