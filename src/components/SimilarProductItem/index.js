// SimilarProducts.js
import './index.css'

const SimilarProductItem = props => {
  const {similarProducts} = props
  return (
    <div>
      <h1>Similar Producs</h1>
      {similarProducts && similarProducts.length > 0 ? (
        <div className="similar-products">
          {similarProducts.map(similarProduct => (
            <div key={similarProduct.id} className="product-card">
              <img
                className="similer-img"
                src={similarProduct.imageUrl}
                alt={`Similar product ${similarProduct.id}`}
              />
              <p>{similarProduct.title}</p>
              <p>{similarProduct.brand}</p>
              <p>Rs {similarProduct.price}/-</p>
              <div>
                <p>{similarProduct.rating} </p>
                <img src="https://assets.ccbp.in/frontend/react-js/star-img.png" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No similar products available.</p>
      )}
    </div>
  )
}

export default SimilarProductItem
