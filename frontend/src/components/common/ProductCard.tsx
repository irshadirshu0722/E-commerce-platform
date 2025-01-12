import React, { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { IProductCard } from "../../interfaces/CommonInterfaces";
import RatingStar from "./RatingStar";

const styles: { [key: string]: CSSProperties } = {
  searchProductsLi: {
    backgroundColor: "var(--white)",
    boxShadow: "var(--shadow-3)",
    position: "relative", // To position the offer badge
  },
  offerBadge: {
    position: "absolute",
    top: "0",
    right: "0rem",
    backgroundColor: "green",
    color: "white",
    padding: "0.5rem 0.6rem", // Padding adjusted to rectangular shape
    fontSize: "0.8rem",
    borderRadius: "0.2rem", // Adjusted for rectangular shape
  },
  offerPrice: {
    color: "green",
  },
  originalPriceCross: {
    textDecoration: "line-through",
    color: "black",
  },
  searchProductInfo: {
    borderTop: "1px solid var(--black)",
    padding: "0.5rem",
    display: "flex",
    alignItems: "center",
  },
  price: {
    marginTop: "",
    color: "var(--grey-900)",
    fontSize: "1rem",
    marginRight: "1rem",
  },
  searchProductImage: {
    width: "100%",
    objectFit: "cover",
    objectPosition: "center",
    height: "17rem",
  },
};

const ProductCard: React.FC<IProductCard> = ({
  image_url,
  name,
  price,
  offer,
  id,
  actual_price,
  rating,
  total_rating,
  stock,
}) => {
  const navigate = useNavigate();
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null; // To prevent infinite loop in case of another error
    target.src =
      "http://res.cloudinary.com/dg3m2vvvs/image/upload/v1710835028/vtsipjaola9uaeldow5b.jpg";
  };
  return (
    <li
      className="product-card"
      style={{
        ...styles.searchProductsLi,
        display: "grid",
        gridTemplateRows: "auto 1fr",
      }}
      onClick={() => navigate(`/products/${id}/`)}
    >
      <div className="search-product-image" style={styles.searchProductImage}>
        <img
          src={image_url}
          style={styles.searchProductImage}
          onError={handleImageError}
        />
        {offer &&
          (offer.discount_type == "percentage" ? (
            <div style={styles.offerBadge}>
              {Math.round(offer.discount)}% off
            </div>
          ) : (
            <div style={styles.offerBadge}>
              &mdash;&#8377;{offer.discount} off
            </div>
          ))}
      </div>
      <div
        className=""
        style={{
          ...styles.searchProductInfo,
          display: "grid",
          gridTemplateRows: "1fr auto auto auto",
          gridAutoColumns: "1fr",
        }}
      >
        <h5 style={{ height: "100%" }} className="">
          {name}
        </h5>
        <div className="star-rating" style={{ margin: "0.5rem 0" }}>
          <div
            className=""
            style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
          >
            <div>
              {rating != null && (
                <RatingStar
                  fullStar={+(+rating).toFixed(0)}
                  halfStar={+(+rating % 1 > 0 ? 1 : 0)}
                  styles={{ color: "var(--gold-clr)" }}
                />
              )}
            </div>
            <p style={{ verticalAlign: "middle", fontSize: "1.1rem" }}>
              {total_rating}
            </p>
          </div>
          {}
        </div>
        <h5 className="" style={styles.price}>
          <span
            style={
              offer
                ? { ...styles.price, ...styles.originalPriceCross }
                : styles.price
            }
          >
            &#8377;{actual_price}
          </span>
          {offer && <span style={styles.offerPrice}>${price}</span>}
        </h5>
        {stock && stock > 0 ? (
          <h6 className="in-stock mt-0-5 ">In stock</h6>
        ) : (
          <h6 className="out-of-stock mt-0-5">Out of stock</h6>
        )}
      </div>
    </li>
  );
};

export default ProductCard;
