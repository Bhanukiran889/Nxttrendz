// ProductItemDetails.js
import React, {Component} from 'react'
import {Redirect} from 'react-router-dom' // For redirecting to the login route or products route
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header' // Assuming Header is a navigation bar component
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
  }

  componentDidMount() {
    this.checkAuthentication()
    this.getProductDetails()
  }

  checkAuthentication = () => {
    const jwtToken = Cookies.get('jwt_token')
    if (!jwtToken) {
      this.setState({redirectToLogin: true})
    }
  }

  getProductDetails = async () => {
    const {match} = this.props
    const {id} = match.params // Assuming you're using react-router and URL params for product id

    if (!id) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
        errorMsg: 'Product ID is missing.',
      })
      return
    }

    this.setState({apiStatus: apiStatusConstants.inProgress})

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
        const fetchedData = await response.json()

        // Map each key from the response to the state
        const updatedProductDetails = {
          id: fetchedData.id,
          imageUrl: fetchedData.image_url, // image_url mapped to imageUrl
          title: fetchedData.title, // title mapped to title
          price: fetchedData.price,
          description: fetchedData.description,
          brand: fetchedData.brand,
          totalReviews: fetchedData.total_reviews, // total_reviews mapped to totalReviews
          rating: fetchedData.rating,
          availability: fetchedData.availability,
        }

        // Map the similar products
        const updatedSimilarProducts = fetchedData.similar_products.map(
          product => ({
            id: product.id,
            imageUrl: product.image_url, // image_url mapped to imageUrl
            title: product.title, // title mapped to title
            price: product.price,
            description: product.description,
            brand: product.brand,
            totalReviews: product.total_reviews, // total_reviews mapped to totalReviews
            rating: product.rating,
            availability: product.availability,
          }),
        )

        // Set the state
        this.setState({
          productdetails: updatedProductDetails,
          similarProducts: updatedSimilarProducts,
          apiStatus: apiStatusConstants.success,
        })
      } else if (response.status === 404) {
        const errorData = await response.json()
        this.setState({
          apiStatus: apiStatusConstants.failure,
          errorMsg: errorData.error_msg || 'Product not found.',
        })
      } else {
        this.setState({
          apiStatus: apiStatusConstants.failure,
          errorMsg: 'Something went wrong, please try again later.',
        })
      }
    } catch (error) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
        errorMsg: 'Failed to fetch product details. Please try again later.',
      })
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
    history.push('/products') // Redirect to Products Route
  }

  render() {
    const {
      productdetails,
      similarProducts,
      apiStatus,
      quantity,
      errorMsg,
      redirectToLogin,
    } = this.state

    if (redirectToLogin) {
      return <Redirect to="/login" />
    }

    if (apiStatus === apiStatusConstants.inProgress) {
      return (
        <div>
          <Header />

      <Loader dta-testid="loader" type="ThreeDots" color="#0b69ff" height="50" width="50" />        </div>
      )
    }

    if (apiStatus === apiStatusConstants.failure) {
      return (
        <div>
          <Header />
          <h2>Failed to fetch product details</h2>
          <p>{errorMsg}</p>
          <button onClick={this.handleContinueShopping}>
            Continue Shopping
          </button>
        </div>
      )
    }

    return (
      <div>
        <Header />
        {productdetails ? (
          <div>
            <div className="product-details">
              <img
                className="product_img"
                src={productdetails.imageUrl}
                alt="product"
              />
              <div>
                <h1>{productdetails.title}</h1>
                <p>{productdetails.description}</p>

                <p>{productdetails.price}/-</p>
                <p> {productdetails.rating}</p>
                <p>{productdetails.category}</p>
                <p>{productdetails.availability}</p>
                <p> {productdetails.brand}</p>

                <div>
                  <button data-testid="plus" onClick={this.decrementQuantity}>
                    -
                  </button>
                  <p>{quantity}</p>
                  <button data-testid="minus" onClick={this.incrementQuantity}>
                    +
                  </button>
                </div>
                <button type="button">ADD TO CART</button>
              </div>
            </div>

            <SimilarProductItem similarProducts={similarProducts} />
          </div>
        ) : (
          <h2>Product Not Found</h2>
        )}
      </div>
    )
  }
}

export default ProductItemDetails
