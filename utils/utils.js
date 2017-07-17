function ScoretoStars(stars){
  var num=stars.toString().substring(0,1);
  var i;
  var arr=[];
  for(i=1;i<=5;i++){
    if(i<=num){
      arr.push(1);
    }
    else{
      arr.push(0);
    
    }
  }
  return arr;
}
function http(url, callback) {
  wx.request({
    url: url,
    method: 'GET',
    header: {
      "Content-Type": "json"
    },
    success: function (res) {
      callback(res.data);
    },
    fail: function (err) {
      console.log(err);
    }
  })
}
//将演员的名字用/拼接
function convertToCastsString(casts){
  var castsJoin="";
  for(var idx in casts){
    castsJoin+= casts[idx].name+'/';
  }
  return castsJoin.substring(0,castsJoin.length-1);

}
function convertToCastsInfos(casts){
  var castsArray=[];
  for(var idx in casts){
   var cast={
     img:casts[idx].avatars?casts[idx].avatars.large:"",
     name:casts[idx].name
   }
  castsArray.push(cast);
  }
  return castsArray;

}
module.exports = {
  ScoretoStars: ScoretoStars,
  http: http,
  convertToCastsString:convertToCastsString,
  convertToCastsInfos:convertToCastsInfos
};
