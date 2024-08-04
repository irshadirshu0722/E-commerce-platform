import "./singleproduct.css";

import React, { useState, useEffect, FormEvent, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
// component
import { RatingSlider } from "../../components/common/RatingSlider";
import { GoogleIcons } from "../../components/common/GoogleIcons";
import ProductCard from "../../components/common/ProductCard";
import RatingStar from "../../components/common/RatingStar";

// hooks and store
import useApiCall from "../../hooks/useApiCall";
import { useStore } from "../../context/store";

// others
import { SINGLE_PRODUCT, ADD_TO_CART, PRODUCT_NOTIFY } from "../../config/backendApi";
// interface
import { IProductCard } from "../../interfaces/CommonInterfaces";
import { IProduct } from "../../interfaces/ISingleProduct";

// utils

import Loading from "../../components/common/Loading/Loading";
import LoadingButton from "../../components/common/LoadingButton";
import { popupMessage } from "../../utils/popupMessage";
import HorizontalScrollView from "../ImageSlideShow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBasketShopping } from "@fortawesome/free-solid-svg-icons";

const notifySchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
});

export function SingleProduct() {
  const { authToken, setUserDetails } = useStore();
  const { loading, makeApiCall, isDataFetched, reload } = useApiCall();
  const [product, setProduct] = useState<IProduct>();
  const [relatedProducts, setRelatedProducts] = useState<IProductCard[]>([]);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(0);
  const { productId } = useParams();
  const productSliderImages = useRef<Array<React.RefObject<HTMLDivElement>>>(
    []
  );
  const [notifyLoading,setNotifyLoading] = useState<boolean>(false)

  const navigate = useNavigate();

  // schema
  const { register, getValues,handleSubmit, formState:{errors}} = useForm({
    resolver: yupResolver(notifySchema),
  });
  useEffect(() => {
    fetchData();
  }, [productId]);
  const fetchData = async () => {
    try {
      const url = SINGLE_PRODUCT + `${productId}/`;
      const { ok, response } = await makeApiCall(url);
      if (ok) {
        const data = response?.data;
        if (data.product) {
          setProduct(data.product);
        }
        if (data.related_products) {
          setRelatedProducts(data.related_products);
        }
      }
    } catch (e) {
      console.log(e);
      // navigate("/error/500/");
    }
  };
  const onAddToCart = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const url = ADD_TO_CART;
      const data = {
        id: productId,
        quantity: selectedQuantity,
      };
      const { ok, response } = await makeApiCall(
        url,
        "post",
        data,
        true,
        authToken,
        false
      );
      if (ok) {
        if (response?.data.quantity) {
          setUserDetails((prev: any) => ({
            ...prev,
            quantity: response?.data.quantity,
          }));
        }
        popupMessage(false, response?.data.message);
      } else {
        if (response?.error) {
          popupMessage(true, response?.error);
        }
      }
    } catch {}
  };

  const onClickImage = (index: number) => {
    const imageItem = productSliderImages.current[index].current;
    if (imageItem) {
      const scrollOptions: ScrollIntoViewOptions = {
        inline: "center",
        behavior: "smooth",
      };
      const scrollY = window.scrollY;
      imageItem.scrollIntoView(scrollOptions);
      window.scrollTo({
        top: scrollY,
        behavior: "smooth",
      });
    }
  };
  const onNotifySUbmit = async() => {
    const name = getValues().name
    const email = getValues().email
    try {
      const url = PRODUCT_NOTIFY 
      const data = {
        'name':name,
        'email':email,
        'product_id':productId
      }
      setNotifyLoading(true)
      const { ok, response } = await makeApiCall(url,'post',data,false,null,false);
      if (ok) {
        const data = response?.data;
        popupMessage(false,data.message)
      }
    } catch (e) {
      console.log(e);
      // navigate("/error/500/");
    }finally{
      setNotifyLoading(false);
    }
  };
  if (loading && reload) {
    return <Loading />;
  }
  return (
    <>
      <GoogleIcons />
      <section className="single-product-section">
        <div className="section-center-medium single-product-center">
          <div className="product-images-info">
            <div className="product-images">
              <div className="product-main-image">
                <HorizontalScrollView>
                  {product?.images.map((item, index) => {
                    const ref = React.createRef<HTMLDivElement>();
                    productSliderImages.current[index] = ref;
                    return (
                      <div
                        ref={ref}
                        id={index.toString()}
                        key={index}
                        style={{
                          backgroundImage: `url("${item.image_url}")`,
                          backgroundSize: "cover",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center",
                          width: "100%",
                          height: "100%",
                          display: "inline-block",
                          scrollSnapAlign: "center",
                        }}
                        className="img"
                      ></div>
                    );
                  })}
                </HorizontalScrollView>
              </div>
              <div style={{ width: "100%" }}>
                <HorizontalScrollView>
                  {product?.images.map((item, index) => (
                    <div
                      onClick={() => onClickImage(index)}
                      id={index.toString()}
                      key={index}
                      // src={images[Math.floor(Math.random() * colors.length)]}
                      style={{
                        background: `url("${item.image_url}")`,
                        margin: "10px",
                        width: "100px",
                        height: "100px",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "top",
                        display: "inline-block",
                        userSelect: "none",
                        // scrollSnapAlign: "center",
                      }}
                    ></div>
                  ))}
                </HorizontalScrollView>
              </div>
            </div>
            <div className="product-info">
              <h4 className="product-name">{product?.name}</h4>
              <div className="product-rating-stock">
                <div className="rating-star ">
                  <RatingStar
                    fullStar={
                      product?.rating ? parseInt(product.rating.overall) : 0
                    }
                    halfStar={
                      product?.rating
                        ? parseFloat(product.rating.overall) % 1 >= 0.5
                          ? 1
                          : undefined
                        : undefined
                    }
                  />
                  <span className="product-overall-rating">
                    {product?.rating.overall}
                  </span>
                </div>
                <div className="stock-detail">
                  <FontAwesomeIcon
                    width={16}
                    height={16}
                    icon={faBasketShopping}
                  />
                  {product?.stock && product.stock > 0 ? (
                    <>
                      <span className="quantity">{product?.stock} orders</span>
                      <span className="text-success stock first-cap">
                        In stock
                      </span>
                    </>
                  ) : (
                    <span className="text-danger">Out of stock</span>
                  )}
                </div>
              </div>

              <h5 className="price">
                &#8377;{product?.price}/<span className="lower">per item</span>
              </h5>
              <p className="description"> {product?.description}</p>
              {product?.specializations && (
                <div className="product-specialisation">
                  <ul className="product-specialisation-list">
                    {product.specializations.map((item, idx) => (
                      <li key={idx} className="specialization-item">
                        <h5 className="specialization-item-heading">
                          {item.key}
                        </h5>
                        <h5 className="specialization-item-value">
                          {item.value}
                        </h5>
                      </li>
                    ))}
                    {product.package_contains.map((item, idx) => (
                      <li key={idx} className="specialization-item">
                        <h5 className="specialization-item-heading">
                          {item.key}
                        </h5>
                        <h5 className="specialization-item-value">
                          {item.value} <span className="lower">qty</span>
                        </h5>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="product-rating">
                <ul className="product-single-rating">
                  <RatingSlider
                    fiveStarP={
                      product?.rating ? product?.rating.five_star_percentage : 0
                    }
                    fourStarP={
                      product?.rating ? product?.rating.four_star_percentage : 0
                    }
                    threeStarP={
                      product?.rating
                        ? product?.rating.three_star_percentage
                        : 0
                    }
                    twoStarP={
                      product?.rating ? product?.rating.two_star_percentage : 0
                    }
                    oneStarP={
                      product?.rating ? product?.rating.one_star_percentage : 0
                    }
                  />
                </ul>
              </div>
              {product?.stock && product.stock > 0 ? (
                <div className="add-to-cart">
                  <form action="" onSubmit={onAddToCart}>
                    <div className="dropdown-select form-group">
                      <label htmlFor="" className="cap">
                        quantity :
                      </label>
                      <select
                        value={selectedQuantity}
                        onChange={(e) =>
                          setSelectedQuantity(parseInt(e.target.value))
                        }
                        className=""
                        required
                      >
                        <option value="">select quantity</option>
                        {Array.from({ length: product.stock }, (_, idx) => (
                          <option key={idx} value={idx + 1}>
                            {idx + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-btn">
                      <LoadingButton
                        isLoading={loading}
                        className="btn btn-medium"
                        type="submit"
                      >
                        Add to cart
                      </LoadingButton>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="product-actions">
                  <div className="prodcut-in-stock-mail">
                    <h5 className="prodcut-in-stock-mail-heading">
                      Notify me via email when the item becomes available
                    </h5>
                    <form action="" onSubmit={handleSubmit(onNotifySUbmit)}>
                      <div className="form-group">
                        <span className="input-box-error-message">
                          {errors?.name?.message}
                        </span>
                        <input
                          type="text"
                          placeholder="Full name"
                          {...register("name")}
                        />
                      </div>
                      <div className="form-group">
                        <span className="input-box-error-message">
                          {errors?.email?.message}
                        </span>
                        <input
                          type="email"
                          placeholder="Email"
                          {...register("email")}
                        />
                      </div>
                      <div className="form-btn">
                        <LoadingButton
                          isLoading={loading && notifyLoading}
                          className="btn btn-medium"
                          type="submit"
                        >
                          Submit
                        </LoadingButton>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* <div className="product-rating">
            <div className="section-sub-heading">
              <h3>Product Rating</h3>
            </div>
            <div className="product-overall-rating">
              <h3>{product?.rating.overall}</h3>
              <div className="rating-stars">
                <RatingStar
                  fullStar={
                    product?.rating ? parseInt(product.rating.overall) : 0
                  }
                  halfStar={
                    product?.rating
                      ? parseFloat(product.rating.overall) % 1 >= 0.5
                        ? 1
                        : undefined
                      : undefined
                  }
                />
              </div>
            </div>
          </div> */}
          <div className="related-product-section">
            <h4 className="related-products-heading">You may also like</h4>
            <ul className="related-products">
              {relatedProducts.map((item) => (
                <ProductCard {...item} />
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
// document.addEventListener("DOMContentLoaded", function () {
//   const switchingImagesContainer = document.querySelector(
//     ".product-main-image img"
//   );
//   const leftArrow = document.querySelector(
//     ".single-product-center .arrow-icon-left "
//   );
//   const rightArrow = document.querySelector(
//     ".single-product-center .arrow-icon-right"
//   );

//   leftArrow.addEventListener("click", () => {
//     imageSlider(switchingImagesContainer, productImages, false);
//   });
//   rightArrow.addEventListener("click", () => {
//     imageSlider(switchingImagesContainer, productImages, true);
//   });

//   const specializationToggleBtn = document.querySelector(
//     ".single-product-center .specialization-toggle-btn"
//   );
//   const specializationItemsContainer = document.querySelector(
//     ".single-product-center .product-specializations-items"
//   );

//   specializationToggleBtn.addEventListener("click", (e) => {
//     e.preventDefault();
//     if (
//       !specializationToggleBtn.classList.contains(
//         "open-specialization-toggle-btn"
//       )
//     ) {
//       specializationToggleBtn.classList.add("open-specialization-toggle-btn");
//       specializationItemsContainer.classList.add(
//         "show-product-specializations-items"
//       );
//       console.log("Button class added:", specializationToggleBtn.classList);
//     } else {
//       specializationToggleBtn.classList.remove(
//         "open-specialization-toggle-btn"
//       );
//       specializationItemsContainer.classList.remove(
//         "show-product-specializations-items"
//       );
//       console.log("Button class removed:", specializationToggleBtn.classList);
//     }
//   });
// });
