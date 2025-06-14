// Cart/index.js

import {Component} from 'react'
import {Redirect, Link} from 'react-router-dom'
import Cookies from 'js-cookie'

import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import {AiFillCloseCircle} from 'react-icons/ai'
import Header from '../Header'
import CheckoutPopup from '../CheckoutPopup'
import './index.css'

class Cart extends Component {
  state = {
    cartItems: [],
    orderSuccess: false,
    selectedPayment: '',
    showPopup: false,
    redirectToLogin: false,
  }

  componentDidMount() {
    const jwtToken = Cookies.get('jwt_token')
    if (!jwtToken) {
      this.setState({redirectToLogin: true})
    } else {
      const cartData = JSON.parse(localStorage.getItem('cart')) || []
      this.setState({cartItems: cartData})
    }
  }

  incrementItem = id => {
    this.setState(prev => {
      const updated = prev.cartItems.map(item =>
        item.id === id ? {...item, quantity: item.quantity + 1} : item,
      )
      localStorage.setItem('cart', JSON.stringify(updated))
      return {cartItems: updated}
    })
  }

  decrementItem = id => {
    this.setState(prev => {
      const item = prev.cartItems.find(i => i.id === id)
      let updated
      if (item.quantity === 1) {
        updated = prev.cartItems.filter(i => i.id !== id)
      } else {
        updated = prev.cartItems.map(i =>
          i.id === id ? {...i, quantity: item.quantity - 1} : item,
        )
      }
      localStorage.setItem('cart', JSON.stringify(updated))
      return {cartItems: updated}
    })
  }

  removeItem = id => {
    this.setState(prev => {
      const updated = prev.cartItems.filter(item => item.id !== id)
      localStorage.setItem('cart', JSON.stringify(updated))
      return {cartItems: updated}
    })
  }

  removeAll = () => {
    localStorage.removeItem('cart')
    this.setState({cartItems: []})
  }

  getTotalPrice = () => {
    const {cartItems} = this.state
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  render() {
    const {
      cartItems,
      redirectToLogin,
      selectedPayment,
      orderSuccess,
      showPopup,
    } = this.state

    if (redirectToLogin) return <Redirect to="/login" />

    if (cartItems.length === 0) {
      return (
        <>
          <Header />
          <div className="empty-cart-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-empty-cart-img.png"
              alt="cart empty"
              className="empty-cart-img"
            />
            <h1 className="empty-cart-heading">Your Cart Is Empty</h1>
            <Link to="/products" className="shop-now-link">
              <button type="button" className="shop-now-button">
                Shop Now
              </button>
            </Link>
          </div>
        </>
      )
    }

    return (
      <>
        <Header />
        <div className="cart-container">
          <h1 className="cart-title">My Cart</h1>
          <button
            type="button"
            onClick={this.removeAll}
            className="remove-all-button"
          >
            Remove All
          </button>
          <ul className="cart-items-list">
            {cartItems.map(item => (
              <li key={item.id} className="cart-item">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="cart-item-image"
                />
                <div className="cart-item-info">
                  <p className="cart-item-title">{item.title}</p>
                  <p className="cart-item-brand">{item.brand}</p>
                  <p className="cart-item-price">₹{item.price}</p>
                  <div className="quantity-control ad_items">
                    <button
                      data-testid="minus"
                      onClick={() => this.decrementItem(item.id)}
                      className="quantity-button"
                    >
                      <BsDashSquare />
                    </button>
                    <p className="item-quantity">{item.quantity}</p>
                    <button
                      data-testid="plus"
                      onClick={() => this.incrementItem(item.id)}
                      className="quantity-button"
                    >
                      <BsPlusSquare />
                    </button>
                  </div>
                </div>
                <button
                  className="remove-btn"
                  data-testid="remove"
                  onClick={() => this.removeItem(item.id)}
                >
                  <AiFillCloseCircle />
                </button>
              </li>
            ))}
          </ul>
          <div className="order-summary">
            <h2 className="order-total-title">Order Total</h2>
            <h2 className="order-total-amount">₹{this.getTotalPrice()}</h2>
            <p className="cart-items-count">{cartItems.length} Items in cart</p>
          </div>
          <button
            className="checkout-button"
            onClick={() => this.setState({showPopup: true})}
          >
            Checkout
          </button>

          {showPopup && (
            <CheckoutPopup
              totalAmount={this.getTotalPrice()}
              cartItemsCount={cartItems.length}
              selectedPayment={selectedPayment}
              onPaymentChange={e =>
                this.setState({selectedPayment: e.target.value})
              }
              onConfirm={() => this.setState({orderSuccess: true})}
              orderSuccess={orderSuccess}
              onClose={() => this.setState({showPopup: false})}
            />
          )}
        </div>
      </>
    )
  }
}

export default Cart
