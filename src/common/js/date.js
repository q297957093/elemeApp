//输出格式化时间的方法，方便复用
export function formatDate(date, fmt) {
  //正则匹配以y开头1个或以上的字符串,正则RegExp实例方法text(),匹配就返回true
  if (/(y+)/.test(fmt)) {
    //将匹配捕获到的第1组字符串，用时间获取年来替代,并根据y的个数来截取，比如：yy，18 yyyy,2018
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '')).slice(4 - RegExp.$1.length);
  }
  //定义一些时间的匹配字符串对象，并获得相应时间对象
  let o = {
    'M+': date.getMonth() + 1, //月份从0开始，需要加1
    'd+': date.getDay(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  //循环匹配捕获
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';  //转化为字符串
      //若捕获的字符串长度为1，则直接应用；不为1，则需要补零
      fmt = fmt.replace(RegExp.$1,(RegExp.$1.length===1)?str:padLeftZero(str))
    }
  }
  return fmt;
}

//辅助方法：左侧补零
function padLeftZero(str) {
  //技巧：根据字符串长度截取，比如：9,009,9  12,0012,12
  return ('00' + str).slice(str.length);
}
