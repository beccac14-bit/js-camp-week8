// ========================================
// API 請求函式
// ========================================

const axios = require('axios');
const { API_PATH, BASE_URL, ADMIN_TOKEN } = require('./config');

// ========== 客戶端 API ==========

/**
 * 取得產品列表
 * @returns {Promise<Array>}
 */
async function fetchProducts() {
  // 請實作此函式
  // 回傳 response.data.products  
  const response = await axios.get(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/products`);
  return response.data.products;

}

/**
 * 取得購物車
 * @returns {Promise<Object>} - 回傳 { carts: [...], total: 數字, finalTotal: 數字 }
 */
async function fetchCart() {
  // 請實作此函式
  
  const response = await axios.get(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`);
  // 補充：解構賦值，可以只取出除了 status 之外的資料
    const { status, ...restData } = response.data; 
    return restData;

}

/**
 * 加入購物車
 * @param {string} productId - 產品 ID
 * @param {number} quantity - 數量
 * @returns {Promise<Object>} - 回傳購物車資料
 */
async function addToCart(productId, quantity) {
  // 請實作此函式
   
  const dataParam = { data: {productId, quantity} };
  const response = await axios.post(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`, dataParam);
  return response.data; 
    // response.data 資料結構：{status, carts:{...}, total, finalTotal}
  
}

/**
 * 更新購物車商品數量
 * @param {string} cartId - 購物車項目 ID
 * @param {number} quantity - 新數量
 * @returns {Promise<Object>} - 回傳購物車資料
 */
async function updateCartItem(cartId, quantity) {
  // 請實作此函式
  
  const updataData = { data: {cartId, quantity} };
  const response = await axios.patch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`, updataData)
  return response.data;
    // response.data 資料結構：{status, carts:{...}, total, finalTotal}
  
}

/**
 * 刪除購物車商品
 * @param {string} cartId - 購物車項目 ID
 * @returns {Promise<Object>} - 回傳購物車資料
 */
async function deleteCartItem(cartId) {
  // 請實作此函式
  
  const response = await axios.delete(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`, cartId);
  return response.data;  // 應回傳物件
  // response.data 格式 { status, carts:[{...},{...}], Total ,finalTotal} 

}

/**
 * 清空購物車
 * @returns {Promise<Object>} - 回傳購物車資料
 */
async function clearCart() {
  // 請實作此函式
    
  const response = await axios.delete(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`);
  return response.data; 
  // 應回傳物件，且清空後 carts 為空陣列、total 為 0 -> 所以要取出整個 data 物件而不是只有 data.carts
    // 回傳的資料結構
      //  {
      //   "status": false,
      //   "carts": [],
      //   "total": 0,
      //   "finalTotal": 0,
      //   "message": "購物車產品已全部清空。 (*´▽`*)"
      //   }

}

/**
 * 建立訂單
 * @param {Object} userInfo - 使用者資料
 * @returns {Promise<Object>}
 */
async function createOrder(userInfo) {
  // 請實作此函式
  
  const response = await axios.post(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/orders`, {data:{user: userInfo}} );
  return response.data; 
  // 當 status 為 true 時，應有 id 且為 string -> 要回傳整個 data 物件

}

// ========== 管理員 API ==========

/**
 * 管理員 API 需加上認證
 * 提示：
    headers: {
      authorization: ADMIN_TOKEN
    }
 */

/**
 * 取得訂單列表
 * @returns {Promise<Array>}
 */
async function fetchOrders() {
  // 請實作此函式

  const adminChecked = {headers: {authorization: ADMIN_TOKEN}};
  const response = await axios.get(`${BASE_URL}/api/livejs/v1/admin/${API_PATH}/orders`, adminChecked);
  return response.data.orders;  
  // 應回傳陣列 -> 也就是 data.orders
  // 格式：[{ users, createdAt, paid,..., prodcuts:[...] }]

}

/**
 * 更新訂單狀態
 * @param {string} orderId - 訂單 ID
 * @param {boolean} isPaid - 是否已付款
 * @returns {Promise<Object>}
 */
async function updateOrderStatus(orderId, isPaid) {
  // 請實作此函式 

  const adminChecked = { headers: {authorization: ADMIN_TOKEN} };
  // 請求資料格式：
    // { "data": { "id": "8IIgLIdV2X19WAvEGvXQ","paid": true }};
  const updateData = { data: {id: orderId, paid: isPaid} };
  const response = await axios.put(`${BASE_URL}/api/livejs/v1/admin/${API_PATH}/orders`,updateData , adminChecked);
  return response.data;

}

/**
 * 刪除訂單
 * @param {string} orderId - 訂單 ID
 * @returns {Promise<Object>}
 */
async function deleteOrder(orderId) {
  // 請實作此函式

  const adminChecked = { headers: {authorization: ADMIN_TOKEN} };
  const response = await axios.delete(`${BASE_URL}/api/livejs/v1/admin/${API_PATH}/orders/${orderId}`,adminChecked);
  return response.data;
  // api 成功 { "status": true,  "orders": [{ users, createdAt, paid,..., prodcuts:[...] }] }

}

module.exports = {
  fetchProducts,
  fetchCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
  createOrder,
  fetchOrders,
  updateOrderStatus,
  deleteOrder
};
