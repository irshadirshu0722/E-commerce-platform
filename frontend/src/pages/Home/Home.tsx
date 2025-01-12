import React, { useEffect, useState } from "react";
import "./home.css";
import { Link, useNavigate } from "react-router-dom";
import useApiCall from "../../hooks/useApiCall";
import { HOME } from "../../config/backendApi";

// componenet
import Loading from "../../components/common/Loading/Loading";

// interface
import {
  IProductCard,
  IProductCategory,
} from "../../interfaces/CommonInterfaces";
import {
  IHighlights,
  DefaultIHighlights,
  ILatestOffer,
} from "../../interfaces/IHomePage";
import ProductCard from "../../components/common/ProductCard";
import ProductList from "../../components/common/ProductList";

export function Home() {
  const { loading, makeApiCall } = useApiCall();
  const [latestOffers, setLatestOffers] = useState<ILatestOffer[]>([]);
  const [categories, setCategories] = useState<IProductCategory[]>([]);
  const [newArrivals, setNewArrivals] = useState<IProductCard[]>([]);
  const [highlight, setHighlight] = useState<IHighlights>(DefaultIHighlights);
  const navigate = useNavigate();
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const { ok, response } = await makeApiCall(HOME);
      if (ok) {
        setCategories(response?.data.categories);
        setHighlight(response?.data.highlight);
        setNewArrivals(response?.data.latest_products);
        setLatestOffers(response?.data.latest_offers);
      } else {
      }
    } catch {}
  };
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <section className="home" id="home">
        <div className="home-center">
          <div className="hero home-section">
            <div className="hero-info">
              <h1>{highlight.banner_text}</h1>
              <p>{highlight.description}</p>

              <button
                onClick={() => navigate("/products/search/all product/page/1/")}
                className="btn btn-large cursor-pointer"
                type="button"
              >
                shop all products
              </button>
            </div>
          </div>
          {latestOffers.length != 0 && (
            <div className="latest-offers-section home-section">
              <div className="section-heading">
                <h1>Latest Offers</h1>
              </div>
              <ul className="latest-offers">
                {latestOffers.map((item, idx) => (
                  <li key={item.search_key}>
                    <div className="offer-image">
                      <img
                        src={item?.image_url}
                        className="offer-photo"
                        alt=""
                      />
                    </div>
                    <div className="offer-info">
                      <h5 className="info-heading">{item.offer_name}</h5>
                      {/* <h4 className="info-date">Ends June 30,2023</h4> */}
                    </div>
                    <Link
                      to={`/products/search/${item.search_key}/page/1/`}
                      type="button"
                    >
                      View all
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {categories.length != 0 && (
            <div className="product-categories-section home-section">
              <div className="section-heading">
                <h1>Product Categories</h1>
              </div>
              <ul className="product-categories">
                {categories.map((item, idx) => (
                  <li
                    key={item.category_name}
                    onClick={() =>
                      navigate(`/products/category/${item.id}/page/1`)
                    }
                  >
                    <div className="category-image">
                      <img src={item.image_url} alt="" />
                    </div>
                    <div className="category-info">
                      <h3>{item.category_name}</h3>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {newArrivals.length != 0 && (
            <div className="new-arrivals-section home-section">
              <div className="section-heading">
                <h1>New Arrivals</h1>
              </div>
              <ProductList>
                {newArrivals.map((item, idx) => (
                  <ProductCard {...item} />
                ))}
              </ProductList>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
