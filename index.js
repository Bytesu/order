/**
 * Created by byte on 2016/3/3.
 */
var demoData = [
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000003-2',
  'ITEM000005',
  'ITEM000005',
  'ITEM000005'
];
var shopping_data = {
  "ITEM000001": {
    "name": "可口可乐",
    "price": 3.0
  },
  "ITEM000003": {
    "name": "羽毛球",
    "price": 1.0
  },
  "ITEM000005": {
    "name": "苹果",
    "price": 5.5
  }
};
//TODO:  订单模块
/**
 *
 * @param barcode_arr_95 : barcode array for discount of 95
 * @param barcode_arr_two_with_one_fee : barcode array for buying two with one fee
 * @param barcode_shopping :
 * @constructor
 */
function Order(barcode_arr_95,barcode_arr_two_with_one_fee,barcode_shopping){
  //this.init(barcode_95,barcode_two_with_one_fe)
  //9.5折：discount_95 值为单价95折商品的条形码
  this.discount_95 = barcode_arr_95||[];

  //买二送一 ：此处可设置买二送一商品的条形码
  this.sale_two = barcode_arr_two_with_one_fee||[];

  barcode_shopping = barcode_shopping.map(function(item,idx){
    var item_arr = item.split('-'),trans_item = {};
    trans_item = shopping_data[item];
    if(item_arr.length>1){
      trans_item.num = parseInt(item_arr[1]);

    }else{
      trans_item.num = 1;
    }
    trans_item.barcode = item;
    trans_item.total = this.discount(trans_item);

    console.log(trans_item);
    return {'name':trans_item};
  });
  console.log(barcode_shopping);
}
Order.prototype.console = function(shoppings){
  console.log('***<没钱赚商店>购物清单***');
  shoppings.forEach(function(item,index){
      console.log('名称：','数量：','单价：','小计：')
  });
  console.log('----------------------');
  console.log('买二赠一商品：');

  console.log('**********************');
};
//Order.prototype.init =  function(barcode_95,barcode_two_with_one_fe){
//
//};

//TODO: 订单优惠活动
Order.prototype.discount = function(item){
  var barcode = item.barcode,num = item.num, price =  item.price;
  //两者都符合时，只享受二送一优惠
  if(this.sale_two.indexOf(barcode)>-1){
    return Math.floor((num/3))*2*price+(num%3)*price;
  }else if(this.discount_95.indexOf(barcode)>-1){
    return price*0.95*num;
  }
  return price*num;

};


new Order([],[],demoData);
//
