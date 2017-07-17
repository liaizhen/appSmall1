var utils=require("../../../../utils/utils.js");
class Movie{
    constructor(url){
      this.url=url;
    }
    getMovieData(cb){
        this.cb=cb;
        // 这里绑定this是为了实现this.processDetailData与this.cb(movie)中this保持一致
       
       
        utils.http(this.url,this.processDetailData.bind(this));
    }
    processDetailData(data){
    if(!data){
      return;
    }
    var director={
      avatar:'',
      name:'',
      id:''
    };
    if(data.directors[0] !=null){
      if(data.directors[0].avatars != null){
      director.avatar=data.directors[0].avatars.large;
    }
    director.name=data.directors[0].name;
    director.id=data.directors[0].id;
  }
    var movie={
      movieImg:data.images?data.images.large:"",
      country:data.countries[0],
      title:data.title,
      originalTitle:data.original_title,
      wishCount:data.wish_count,
      commentCount:data.comments_count,
      year:data.year,
      genres:data.genres.join("、"),
      stars:utils.ScoretoStars(data.rating.stars),
      score:data.rating.average,
      director:director,
      cast:utils.convertToCastsString(data.casts),
      castsInfo:utils.convertToCastsInfos(data.casts),
      summary:data.summary
    };
    // 将异步放法的结果导出用return是没有用，所以只能通过回调函数的形式来进行参数的传递
   
   
    this.cb(movie);
   
  }
}
// 将这个类导出
 export {Movie}