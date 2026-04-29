// ========================================
// 購物車服務
// ========================================

const { fetchCart, addToCart, updateCartItem, deleteCartItem, clearCart } = require('../api');
const { validateCartQuantity, formatCurrency } = require('../utils');

/**
 * 取得購物車
 * @returns {Promise<Object>}
 */
async function getCart() {
  // 請實作此函式
  // 提示：呼叫 fetchCart() 取得購物車資料並回傳
  const cart = await fetchCart();
  return cart;
}

/**
 * 加入商品到購物車
 * @param {string} productId - 產品 ID
 * @param {number} quantity - 數量
 * @returns {Promise<Object>}
 */
async function addProductToCart(productId, quantity) {
  // 請實作此函式
  // 提示：先用 utils validateCartQuantity() 驗證數量，驗證失敗時回傳 { success: false, error: ... }
  // 驗證通過後，呼叫 addToCart() 加入購物車
  // 回傳格式：{ success: true, data: ... } / { success: false, error: ... }

// 1. 先驗證
  const validateResult = validateCartQuantity(quantity);
  // validateCartQuantity(quantity) 結果為 { isValid: false, error: "..." }
  if( !validateResult.isValid ){
    return { 
      success: false, 
      error: validateResult.errors }
  };
 
// 2. 驗證通過後，才跑呼叫 API
  try{
    // addToCart(productId, quantity) 回傳 response.data 的資料結構
    // {status, carts:{...}, total, finalTotal}
    const addToCartResult = await addToCart(productId, quantity);
    return {
       success: true,
       data: addToCartResult }

  } catch(error) {
    return {
          success: false, 
          error: error.response?.data?.message || "網路連線異常" };
  }
  

}

/**
 * 更新購物車商品數量
 * @param {string} cartId - 購物車項目 ID
 * @param {number} quantity - 新數量
 * @returns {Promise<Object>}
 */
async function updateProduct(cartId, quantity) {
  // 請實作此函式
  // 提示：先用 utils validateCartQuantity() 驗證數量，驗證失敗時回傳 { success: false, error: ... }
  // 驗證通過後，呼叫 updateCartItem() 更新數量
  // 回傳格式：{ success: true, data: ... } / { success: false, error: ... }

// 1. 先驗證
  const validateResult = validateCartQuantity(quantity);
  if( !validateResult.isValid ){
    return { success: false, error: validateResult.error }
  };
 
// 2. 驗證通過後，才跑呼叫 API
  try {
    const updateCartResult = await updateCartItem(cartId, quantity);
      // updateCartItem(cartId, quantity) 回傳 response.data 的資料結構
      // {status, carts:{...}, total, finalTotal}
    return {
      success: true,
      data: updateCartResult };
  } catch(error) {
    return {
          success: false, 
          error: error.response?.data?.message || "網路連線異常" }
  };


}

/**
 * 移除購物車商品
 * @param {string} cartId - 購物車項目 ID
 * @returns {Promise<Object>}
 */
async function removeProduct(cartId) {
  // 請實作此函式
  // 提示：呼叫 deleteCartItem()
  // 回傳格式：{ success: true, data: ... } / { success: false, error: ... }

  try{
    // deleteCartItem(cartId) 回傳 response.data 
    // 格式： { status, carts:[{...},{...}], Total ,finalTotal} 
    const delteCartItemResult = await deleteCartItem(cartId);
    return {
      success: true, 
      data: delteCartItemResult };
  
  } catch(error) {
    return {
          success: false,
          error: error.response?.data?.message || "網路連線異常" };
  };

}

/**
 * 清空購物車
 * @returns {Promise<Object>}
 */
async function emptyCart() {
  // 請實作此函式
  // 提示：呼叫 clearCart()
  // 回傳格式：{ success: true, data: ... } 

  try{
    const clearCartResult = await clearCart();
    return {
      success: true,
      data: clearCartResult };
  } catch(error) {
    return {
      success: false,
      error: error.response?.data?.message || "網路連線異常" }
  }
  
}

/**
 * 計算購物車總金額
 * @returns {Promise<Object>}
 */
async function getCartTotal() {
  // 請實作此函式
  // 提示：呼叫 fetchCart() 取得購物車資料
  // 回傳格式：{ total: 原始金額, finalTotal: 折扣後金額, itemCount: 商品筆數 }
  
  const fetchCartResult = await fetchCart();
  // 結果為 { carts: [...], total: 數字, finalTotal: 數字 }
  return {
    total: fetchCartResult.total, 
    finalTotal: fetchCartResult.finalTotal, 
    itemCount: fetchCartResult.carts.length
  }

}

/**
 * 顯示購物車內容
 * @param {Object} cart - 購物車資料
 */
function displayCart(cart) {
  // 請實作此函式
  // 提示：先判斷購物車是否為空（cart.carts 不存在或長度為 0），若空則輸出「購物車是空的」
  // 會使用到 utils formatCurrency() 來格式化金額
  //
  // 預期輸出格式：
  // 購物車內容：
  // ----------------------------------------
  // 1. 產品名稱
  //    數量：2
  //    單價：NT$ 800
  //    小計：NT$ 1,600
  // ----------------------------------------
  // 商品總計：NT$ 1,600
  // 折扣後金額：NT$ 1,600

  
  // 這裡的參數 cart 是把資料 mockCartData { carts:[...], total, finalTotal } 傳進來，所以不用再打 api！
    // 測試資料格式：
    // const mockCartData = {
    //   carts: [
    //     { id: 'cart-1', product: mockApiProducts[0], qty: 2, total: 1600, final_total: 1600 }
    //   ],
    //   total: 1600,
    //   finalTotal: 1600
    // };

  // 先判斷購物車是否為空，包括：
  // 1. 參數格式不符合預期 -> !cart.carts，這個要先寫！！以免 2.carts.length 讀不到直接噴錯中止
  // 2. 購物車內容物為空 -> cart.carts.length === 0
  if(!cart.carts || cart.carts.length === 0){
    console.log("購物車是空的")
    return "購物車是空的"
   }

  // 接著印出購物車內容（一筆筆跑）
  cart.carts.forEach( (item, index) => {
    console.log(`購物車內容：`)
    console.log(`----------------------------------------`)
    console.log(`${index+1}. ${item.product.title}產品名稱`)
    console.log(`   數量：${item.quantity}`)
    console.log(`   單價：${formatCurrency(item.product.price)}`)
    console.log(`   小計：${formatCurrency(item.quantity * item.product.price)}`) // 這邊要算小計，所以要把數量*單價
    console.log(`----------------------------------------`)
  });
  // 跑完 forEach 之後，再接著印出總金額
  console.log(`商品總計：${formatCurrency(cart.total)}`)
  console.log(`折扣後金額：${formatCurrency(cart.finalTotal)}`)

   
}

module.exports = {
  getCart,
  addProductToCart,
  updateProduct,
  removeProduct,
  emptyCart,
  getCartTotal,
  displayCart
};
