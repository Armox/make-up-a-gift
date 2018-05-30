import React from "react";
import Colors from "./Colors";

const ProductItem = props => {
  // console.log(props);
  const { product, productNum, toggleLock } = props;

  return (
    <React.Fragment>
      <img
        src={props.locked ? "/assets/lock.svg" : "/assets/unlock.svg"}
        className="productBtn"
        onClick={() => props.toggleLock(product.product_type, product.id)}
      />
      {product.name && (
        <p className="product-name">
          {product.name.replace(/\b\w/g, l => l.toUpperCase())}
        </p>
      )}
      {product.brand && <p>By - {product.brand.toUpperCase()}</p>}
      {product.api_featured_image && (
        <img src={product.api_featured_image} className="displayImg" />
      )}
      {props.product.product_colors && (
        <Colors colors={props.product.product_colors} id={props.product.id} />
      )}
    </React.Fragment>
  );
};

export default ProductItem;
