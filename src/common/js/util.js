// 解析url参数
// @example ?id=12345&a=b
// @return Object {id:12345,a:b}
export function urlParse() {
  let url = window.location.search;  //用location对象获取URL的查询字符串
  let obj = {}; //定义存放结果的对象
  let reg = /[?&][^?&]+=[^?&]+/g;  //正则匹配?id=12345&a=b，第一组为?id=12345，第二组为&a=b
  // 获取类似['?id=12345', '&a=b']的数组
  let arr = url.match(reg); //match()返回一个与regexp匹配的字符串数组。
  if (arr) {
    //遍历这个数组，返回{id:12345,a:b}
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('='); //[id,12345]
      let key = decodeURIComponent(tempArr[0]);  //key为id,需要对url进行解码
      let val = decodeURIComponent(tempArr[1]); //value为12345,需要对url进行解码
      obj[key] = val;  //给对象动态添加属性并赋值
    });
  }
  return obj; //返回储存结果的对象
}
