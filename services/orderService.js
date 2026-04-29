// ========================================
// 訂單服務
// ========================================

const { createOrder, fetchOrders, updateOrderStatus, deleteOrder } = require('../api');
const { validateOrderUser, formatDate, getDaysAgo, formatCurrency } = require('../utils');

/**
 * 建立新訂單
 * @param {Object} userInfo - 使用者資料
 * @returns {Promise<Object>}
 */
async function placeOrder(userInfo) {
  // 請實作此函式
  // 提示：先用 utils validateOrderUser() 驗證使用者資料，驗證失敗時回傳 { success: false, errors: [...] }
  // 驗證通過後，呼叫 createOrder() 建立訂單
  // 回傳格式：{ success: true, data: ... } / { success: false, errors: [...] }

  const result = validateOrderUser(userInfo);
  if(!result.isValid){
    return { success: false, errors: result.errors }
  }

  try{
    const responseObj = await createOrder(userInfo);
    return { success: true, data: responseObj };
  } catch(error) {
    return { success: false, errors: error.response?.data?.message || "網路連線異常" };
  }
  
}

/**
 * 取得所有訂單
 * @returns {Promise<Array>}
 */
async function getOrders() {
  // 請實作此函式
  // 提示：呼叫 fetchOrders() 取得訂單陣列並回傳

  // fetchOrders() 取得的資料為 [{ users, createdAt, paid,..., prodcuts:[...] }]
  const orders = await fetchOrders(); 
  // 所以就直接 return orders 就是訂單陣列了
  return orders;

}

/**
 * 取得未付款訂單
 * @returns {Promise<Array>}
 */
async function getUnpaidOrders() {
  // 請實作此函式
  // 提示：呼叫 fetchOrders() 後，篩選出 paid 為 false 的訂單

  const orders = await fetchOrders();
  // fetchOrders() 取得的資料為 [{ users, createdAt, paid,..., prodcuts:[...] }]
  return orders.filter(obj => obj.paid === false);
}

/**
 * 取得已付款訂單
 * @returns {Promise<Array>}
 */
async function getPaidOrders() {
  // 請實作此函式
  // 提示：呼叫 fetchOrders() 後，篩選出 paid 為 true 的訂單
  
  const orders = await fetchOrders();
  // fetchOrders() 取得的資料為 [{ users, createdAt, paid,..., prodcuts:[...] }]
  return orders.filter(obj => obj.paid === true);
}

/**
 * 更新訂單付款狀態
 * @param {string} orderId - 訂單 ID
 * @param {boolean} isPaid - 是否已付款
 * @returns {Promise<Object>}
 */
async function updatePaymentStatus(orderId, isPaid) {
  // 請實作此函式
  // 提示：呼叫 updateOrderStatus()
  // 回傳格式：{ success: true, data: ... } / { success: false, error: ... }


  try{
    const resultObj = await updateOrderStatus(orderId, isPaid);
    // updateOrderStatus(orderId, isPaid) 回傳的 response.data 資料格式為
      // { "status": true,  "orders": [{ users, createdAt, paid,..., prodcuts:[...] }] }
    return {success: true, data: resultObj};
  } catch(error) {
    return { success: false, error: error.response?.data?.message || "網路連線異常" };
  }


}

/**
 * 刪除訂單
 * @param {string} orderId - 訂單 ID
 * @returns {Promise<Object>}
 */
async function removeOrder(orderId) {
  // 請實作此函式
  // 提示：呼叫 deleteOrder()
  // 回傳格式：{ success: true, data: ... } / { success: false, error: ... }

  try{
    const resultObj = await deleteOrder(orderId);
    // deleteOrder(orderId) 回傳的資料格式
    // { "status": true,  "orders": [{ users, createdAt, paid,..., prodcuts:[...] }] }
    return {success: true, data: resultObj};
    
  } catch(error) {
    return { success: false, error: error.response?.data?.message || "網路連線異常" };
  }

}

/**
 * 格式化訂單資訊
 * @param {Object} order - 訂單物件
 * @returns {Object} - 格式化後的訂單
 *
 * 回傳物件包含以下欄位：
 * - id: 訂單 ID
 * - user: 使用者資料
 * - products: 商品陣列
 * - total: 總金額（原始數字）
 * - totalFormatted: 格式化金額，使用 utils formatCurrency()
 * - paid: 付款狀態（布林值）
 * - paidText: 付款狀態文字，true → '已付款'，false → '未付款'
 * - createdAt: 格式化後的建立時間，使用 utils formatDate()
 * - daysAgo: 距離今天為幾天前，使用 utils getDaysAgo()
 */
function formatOrder(order) {
  // 請實作此函式
 
  return {
    id: order.id,
    user: order.user,
    products: order.products,
    total: order.total,
    totalFormatted: formatCurrency(order.total),
    paid: order.paid,
    paidText: order.paid ? "已付款" : "未付款", // 如果是 order.paid 是 true，就是 "已付款"；false 就是 "未付款"
    createdAt: formatDate(order.createdAt),
    daysAgo: getDaysAgo(order.createdAt),
  }
  
}

/**
 * 顯示訂單列表
 * @param {Array} orders - 訂單陣列
 */
function displayOrders(orders) {
  // 請實作此函式
  // 提示：先判斷訂單陣列是否為空，若空則輸出「沒有訂單」
  // 使用 formatOrder() 格式化每筆訂單後再輸出
  //
  // 預期輸出格式：
  // 訂單列表：
  // ========================================
  // 訂單 1
  // ----------------------------------------
  // 訂單編號：xxx
  // 顧客姓名：王小明
  // 聯絡電話：0912345678
  // 寄送地址：台北市...
  // 付款方式：Credit Card
  // 訂單金額：NT$ 1,000
  // 付款狀態：已付款
  // 建立時間：2024-01-01 (3 天前)
  // ----------------------------------------
  // 商品明細：
  //   - 產品名稱 x 2（產品數量）
  // ========================================

  // 參數 orders 的格式為
    //"orders": [
    //   {
    //     "user": {
    //       "tel": "07-5313506",
    //       "name": "六角學院",
    //       "address": "高雄市六角學院路",
    //       "payment": "Apple Pay",
    //       "email": "hexschool@hexschool.com"
    //     },
    //     "createdAt": 1614764995,
    //     "paid": false,
    //     "updatedAt": 1614764995,
    //     "total": 5000,
    //     "id": "8IIgLIdV2X19WAvEGvXQ",
    //     "quantity": 10,
    //     "products": [
    //       {
    //         "origin_price": 1000,
    //         "id": "yhHU0M0Aad1bTiA7ITHm",
    //         "category": "測試分類",
    //         "images": "https://images.unsplash.com/photo-1516550135131-fe3dcb0bedc7?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=621e8231a4e714c2e85f5acbbcc6a730&auto=format&fit=crop&w=1352&q=80",
    //         "price": 500,
    //         "title": "測試商品"
    //       }
    //     ]
    //   }
    // ]

  // 先判斷訂單陣列是否為空，若空則輸出「沒有訂單」
  // 1. 先判斷 !orders 格式有無錯誤，例如直接是 undefined
  // 2. 再判斷 orders.length === 0
  if(!orders || orders.length === 0){ 
    console.log("沒有訂單")
    return "沒有訂單"
  }
  
  console.log('訂單列表：');
  console.log('========================================');
  
  return orders.forEach((item, index) => {
    const formattedOrder = formatOrder(item);
    console.log(`訂單 ${index+1}`)
    console.log(`----------------------------------------`)
    console.log(`訂單編號：${formattedOrder.id}`)
    console.log(`顧客姓名：${formattedOrder.user.name}`)
    console.log(`聯絡電話：${formattedOrder.user.tel}`)
    console.log(`寄送地址：${formattedOrder.user.address}`)
    console.log(`付款方式：${formattedOrder.user.payment}`)
    console.log(`訂單金額：${formattedOrder.totalFormatted}`)
    console.log(`付款狀態：${formattedOrder.paidText}`)
    console.log(`建立時間：${formattedOrder.createdAt} (${formattedOrder.daysAgo})`)
    console.log(`----------------------------------------`)
    console.log(`商品明細：`)
      item.products.forEach(productItem => {
        console.log(`- ${productItem.title} x ${productItem.quantity}`)
        console.log(`========================================`)
      })
  })

}

module.exports = {
  placeOrder,
  getOrders,
  getUnpaidOrders,
  getPaidOrders,
  updatePaymentStatus,
  removeOrder,
  formatOrder,
  displayOrders
};
