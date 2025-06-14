import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    productdetails: null,
    similarProducts: [],
    quantity: 1,
    apiStatus: apiStatusConstants.inProgress,
    errorMsg: '',
    redirectToLogin: false,
  }

  componentDidMount() {
    const jwtToken = Cookies.get('jwt_token')
    if (!jwtToken) {
      this.setState({redirectToLogin: true})
    } else {
      this.getProductDetails()
    }
  }

  getProductDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {id} = match.params

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    try {
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const data = await response.json()
        const updatedProductDetails = {
          id: data.id,
          imageUrl: data.image_url,
          title: data.title,
          price: data.price,
          description: data.description,
          brand: data.brand,
          totalReviews: data.total_reviews,
          rating: data.rating,
          availability: data.availability,
        }

        const updatedSimilarProducts = data.similar_products.map(item => ({
          id: item.id,
          imageUrl: item.image_url,
          title: item.title,
          price: item.price,
          description: item.description,
          brand: item.brand,
          totalReviews: item.total_reviews,
          rating: item.rating,
          availability: item.availability,
        }))

        this.setState({
          productdetails: updatedProductDetails,
          similarProducts: updatedSimilarProducts,
          apiStatus: apiStatusConstants.success,
        })
      } else if (response.status === 404) {
        this.setState({apiStatus: apiStatusConstants.failure})
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  incrementQuantity = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  decrementQuantity = () => {
    this.setState(prevState => ({
      quantity: Math.max(1, prevState.quantity - 1),
    }))
  }

  handleContinueShopping = () => {
    const {history} = this.props
    history.push('/products')
  }

  addToCart = () => {
    const {productdetails, quantity} = this.state
    const cart = JSON.parse(localStorage.getItem('cart')) || []

    const existingIndex = cart.findIndex(item => item.id === productdetails.id)
    if (existingIndex !== -1) {
      cart[existingIndex].quantity += quantity
    } else {
      cart.push({...productdetails, quantity})
    }

    localStorage.setItem('cart', JSON.stringify(cart))
  }

  renderLoadingView = () => (
    <div className="product-loader" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="product-error-view">
      <Header />
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error view"
      />
      <h1>Product Not Found</h1>
      <button type="button" onClick={this.handleContinueShopping}>
        Continue Shopping
      </button>
    </div>
  )

  renderProductDetails = () => {
    const {productdetails, quantity, similarProducts} = this.state

    return (
      <div>
        <Header />
        <div className="product-details">
          <img
            src={productdetails.imageUrl}
            alt="product"
            className="product_img"
          />
          <div>
            <h1>{productdetails.title}</h1>
            <p>{productdetails.description}</p>
            <p>₹{productdetails.price}/-</p>
            <p>Total Reviews: {productdetails.totalReviews}</p>
            <p>Rating: {productdetails.rating}</p>
            <p>Availability: {productdetails.availability}</p>
            <p>Brand: {productdetails.brand}</p>

            <div className="quantity-container">
              <button data-testid="minus" onClick={this.decrementQuantity}>
                <BsDashSquare size={24} />
              </button>
              <p>{quantity}</p>
              <button data-testid="plus" onClick={this.incrementQuantity}>
                <BsPlusSquare size={24} />
              </button>
            </div>

            <button type="button" onClick={this.addToCart}>
              ADD TO CART
            </button>
          </div>
        </div>
        <SimilarProductItem similarProducts={similarProducts} />
      </div>
    )
  }

  render() {
    const {redirectToLogin, apiStatus} = this.state

    if (redirectToLogin) {
      return <Redirect to="/login" />
    }

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.success:
        return this.renderProductDetails()
      default:
        return null
    }
  }
}

export default ProductItemDetails
