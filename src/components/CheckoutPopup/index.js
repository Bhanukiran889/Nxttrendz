// src/components/CheckoutPopup/index.js
import './index.css'

const CheckoutPopup = ({
  onClose,
  totalAmount,
  cartItemsCount,
  selectedPayment,
  onPaymentChange,
  onConfirm,
  orderSuccess,
}) => {
  const isCodSelected = selectedPayment === 'COD'

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close-button" onClick={onClose}>
          ×
        </button>
        <h3>Payment Options</h3>
        <form>
          <label>
            <input type="radio" name="payment" disabled />
            Card
          </label>
          <label>
            <input type="radio" name="payment" disabled />
            UPI
          </label>
          <label>
            <input type="radio" name="payment" disabled />
            Net Banking
          </label>
          <label>
            <input
              type="radio"
              name="payment"
              value="COD"
              checked={isCodSelected}
              onChange={onPaymentChange}
            />
            Cash on Delivery
          </label>
        </form>
        <p>Total: ₹{totalAmount}</p>
        <p>Items: {cartItemsCount}</p>
        <button
          className="confirm-button"
          disabled={!isCodSelected}
          onClick={onConfirm}
        >
          Confirm Order
        </button>
        {orderSuccess && (
          <p className="success-text">
            Your order has been placed successfully
          </p>
        )}
      </div>
    </div>
  )
}

export default CheckoutPopup
