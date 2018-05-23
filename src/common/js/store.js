//保存数据到本地缓存
export function saveToLocal(id, key, value) {
  let seller = window.localStorage.__seller__;  //将seller赋值localStorage对象的属性
  if (!seller) {
    seller = {};
    seller[id] = {};
  } else {
    seller = JSON.parse(seller);  //将一个JSON转化为对象
    if (!seller[id]) {
      seller[id] = {};
    }
  }
  seller[id][key] = value;
  window.localStorage.__seller__ = JSON.stringify(seller); //将一个对象转换为一个JSON字符串
}

//读取本地缓存的数据
export function loadFromLocal(id, key, def) {
  let seller = window.localStorage.__seller__;  //获取seller
  if (!seller) {
    return def;  //没有seller，返回默认值
  }
  seller = JSON.parse(seller)[id];  //有的话，取出id值
  if (!seller) {
    return def;  //没有id值，返回默认值
  }
  let ret = seller[key];
  return ret || def;
}
