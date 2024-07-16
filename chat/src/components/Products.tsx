// ProductCard.tsx
import React from 'react';
import { CompareObject } from './../App';
import './../styles/products.css';

interface ProductCardProps {
  products: CompareObject[];
  onCardClick: (index: number, productUrl: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ products, onCardClick }) => {
  return (
    <div className="product-card-container">
      {products.map((product, index) => (
        <div
          key={index}
          className="product-card"
          onClick={() => onCardClick(index, product.productUrl)}
        >
          {index === 0 && <div className="best-match-label">Best Match</div>}
          <img src={product.picUrl} alt={product.title} className="product-image" />
          <div className="product-details">
            <h2 className="product-title">{product.title}</h2>
            {product.quantity && <p className="product-quantity">Quantity: {product.quantity}</p>}
            {product.price && <p className="product-price">Price: {product.price}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCard;
