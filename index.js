/**
 * Created by byte on 2016/3/3.
 */
var demoData = [
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000003-6',
    'ITEM000005',
    'ITEM000005'
];
var shopping_data = {
    "ITEM000001": {
        "name": "可口可乐",
        "price": 3.00,
        "unit":"瓶",
        "category":"A" //类别
    },
    "ITEM000003": {
        "name": "羽毛球",
        "price": 1.00,
        "unit":"个",
        "category":"B"
    },
    "ITEM000005": {
        "name": "苹果",
        "price": 5.50,
        "unit":"斤",
        "category":"C"
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
function Order(barcode_arr_95, barcode_arr_two_with_one_fee, barcode_shopping) {
    this.unit = '(元)';
    //this.init(barcode_95,barcode_two_with_one_fe)4
    var that = this;
    //9.5折：discount_95 值为单价95折商品的条形码
    this.discount_95 = barcode_arr_95 || [];

    //买二送一 ：此处可设置买二送一商品的条形码
    this.sale_two = barcode_arr_two_with_one_fee || [];
    var new_barcode_shopping = {};

    barcode_shopping.forEach(function (item, idx) {

        var item_arr = item.split('-');
        var trans_item = shopping_data[item_arr[0]];
        var _num = 0;
        //if (item_arr.length > 1) {
        //    _num = parseInt(item_arr[1]);
        //} else if(item_arr.length==1) {
        //    _num = 1;
        //}
        _num = item_arr.length > 1?parseInt(item_arr[1]):1;
        trans_item.barcode = item_arr[0];

        new_barcode_shopping[trans_item.barcode] && (_num += new_barcode_shopping[trans_item.barcode].num);
        trans_item.num = _num;
        //console.log(trans_item.num)
        new_barcode_shopping[trans_item.barcode] = trans_item;



    });
    //console.log(JSON.stringify(new_barcode_shopping));
    this.console(new_barcode_shopping)
}
Order.prototype.console = function (shoppings) {
    var that =  this;
    console.log('***<没钱赚商店>购物清单***');

    var shoppings_two = [],total_save = 0,total = 0;
    Object.keys(shoppings).forEach(function (item, index) {

        item = shoppings[item];
        item = that.discount(item);
        //console.log(item)
        var desc = '名称：' + item.name + ' 数量：' + item.num +item.unit+' 单价：' + item.price + that.unit+' 小计：' + item.total+ that.unit;
        if (item.type == '95') {
            desc += ' 节省:' + that._parseFloat(item.save)+that.unit;
            total_save += item.save;
        }
        if (item.type == '2') {
            shoppings_two.push(item);
        }

        total += item.total;
        console.log(desc)
    });

    if(shoppings_two.length>0){
        console.log('----------------------');
        console.log('买二赠一商品：');
        shoppings_two.forEach(function (item, index) {
            var desc = '名称：' + item.name + ' 数量：' + item.save_num+item.unit;
            total_save += that._parseFloat(item.save_num*item.price);
            console.log(desc);
        });
    }

    console.log('----------------------');
    var desc_total = '总计：' +total+ that.unit;
    var desc_save = '节省：'+total_save+ that.unit;
    console.log(desc_total+'\n'+desc_save);
    console.log('**********************');
};
Order.prototype._parseFloat = function(arg){
   return parseFloat(arg.toFixed(2));
};
//TODO: 订单优惠活动
Order.prototype.discount = function (item) {
    var barcode = item.barcode, num = item.num, price = item.price, total;
    //两者都符合时，只享受二送一优惠
    if (this.sale_two.indexOf(barcode) > -1) {
        total = Math.floor((num / 3)) * 2 * price + (num % 3) * price;
        item.type = '2';
        item.save_num =  Math.floor((num / 3));
    } else if (this.discount_95.indexOf(barcode) > -1) {
        total = this._parseFloat(price * 0.95 * num);
        item.type = '95';
        item.save = this._parseFloat(num*price-total);
    } else {
        total = price * num;
    }
    item.total = total;
    return item;
};


new Order(['ITEM000005','ITEM000001'], ['ITEM000001',"ITEM000003"], demoData);
//
