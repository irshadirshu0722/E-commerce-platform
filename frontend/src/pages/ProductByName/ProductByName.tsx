import "./productbyname.css";

import React, { useEffect, useState } from "react";
import { SEARCH_BY_NAME } from "../../config/backendApi";
import { Link, useParams } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { GoogleIcons } from "../../components/common/GoogleIcons";
import { Slider } from "@mui/material";
import ProductCard from "../../components/common/ProductCard";

// utils
import { toggler } from "../../utils/toggler";

// CustomHok
import useApiCall from "../../hooks/useApiCall";

// component
import Loading from "../../components/common/Loading/Loading";

import {
  IProductCard,
  DefaultIPagination,
  IPagination,
} from "../../interfaces/CommonInterfaces";
import { IFilterDetails, Iparams } from "../../interfaces/IProductByNamePage";
export function ProductByName() {
  const { productName, pageNumber } = useParams();
  const [products, setProducts] = useState<IProductCard[]>([]);
  const [filterDetails, setFilterDetails] = useState<IFilterDetails>({
    categories: {
      categories: [],
      selected_ids: [],
    },
    brands: {
      brands: [],
      selected_ids: [],
    },
    offers: {
      offers: [],
      selected_ids: [],
    },
    selectedPriceRange: [],
    priceRange: [],
  });
  const [pagination, setPagination] = useState<IPagination>(DefaultIPagination);
  const { makeApiCall, loading, isDataFetched } = useApiCall();
  const [fetchToggle, setFetchToggle] = useState<boolean>(true);
  useEffect(() => {
    fetchData();
  }, [fetchToggle, pageNumber, productName]);

  const fetchData = async () => {
    try {
      const url = SEARCH_BY_NAME + `${productName}/${pageNumber}/`;
      const data = {
        filterDetails: filterDetails,
      };
      const { ok, response } = await makeApiCall(url, "post", data);
      if (ok) {
        const data = response?.data.data;
        if (data.filter_details) {
          setFilterDetails(data.filter_details);
        }
        if (data.pagination) {
          setPagination(data.pagination);
        }
        if (data.products) {
          setProducts(data.products);
        }
      }
    } catch {}
  };
  function toggleFilter() {
    toggler(
      document.querySelector(
        ".search-products-center .filter-toggle-container"
      ),
      "show-filter-container"
    );
  }
  function onChangeFilter(
    e: any,
    is_category = false,
    is_brand = false,
    is_price_range = false,
    is_offer = false,
    newValue: any,
    id: number | null
  ) {
    if (is_price_range) {
      setFilterDetails({ ...filterDetails, selectedPriceRange: newValue });
    } else if (is_brand && id) {
      let new_selected_ids = filterDetails.brands.selected_ids;
      if (new_selected_ids.includes(id)) {
        let indexToRemove = new_selected_ids.indexOf(id);
        new_selected_ids.splice(indexToRemove, 1);
      } else {
        new_selected_ids.push(id);
      }
      setFilterDetails({
        ...filterDetails,
        brands: { ...filterDetails.brands, selected_ids: new_selected_ids },
      });
      console.log("brand selected");
    } else if (is_category && id) {
      let new_selected_ids = filterDetails.categories.selected_ids;
      if (new_selected_ids.includes(id)) {
        let indexToRemove = new_selected_ids.indexOf(id);
        new_selected_ids.splice(indexToRemove, 1);
      } else {
        new_selected_ids.push(id);
      }
      setFilterDetails({
        ...filterDetails,
        categories: {
          ...filterDetails.categories,
          selected_ids: new_selected_ids,
        },
      });
      console.log("category selected");
    } else if (is_offer && id) {
      let new_selected_ids = filterDetails.offers.selected_ids;
      if (new_selected_ids.includes(id)) {
        let indexToRemove = new_selected_ids.indexOf(id);
        new_selected_ids.splice(indexToRemove, 1);
      } else {
        new_selected_ids.push(id);
      }
      setFilterDetails({
        ...filterDetails,
        offers: {
          ...filterDetails.offers,
          selected_ids: new_selected_ids,
        },
      });
    }
  }
  function filterReset() {
    Object.keys(filterDetails.categories).map((key, idx) => {});
    setFilterDetails({
      ...filterDetails,
      brands: { ...filterDetails.brands, selected_ids: [] },
      categories: { ...filterDetails.categories, selected_ids: [] },
    });
    console.log("price selected");
  }
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <GoogleIcons />
      <section className="search-products-section">
        <div className="search-products-center section-center">
          {products.length!=0 && (
            <div className="search-product-filter">
              <div className="filter-toggle">
                <div
                  className="filter-toggle-group"
                  id="filter-toggle-button"
                  onClick={toggleFilter}
                >
                  <span>Filter products</span>
                  <span className="material-symbols-outlined icon">
                    filter_list
                  </span>
                </div>
              </div>
              <div className="filter-container filter-toggle-container">
                {Array.isArray(filterDetails.categories.categories) &&
                  filterDetails.categories.categories.length != 0 && (
                    <div className="filter-by-category">
                      <h4 className="filter-heading">Filter by category</h4>
                      <ul className="filter-by-category-items">
                        {filterDetails.categories.categories.map(
                          (item, idx) => (
                            <li
                              key={item.id}
                              data-category={item}
                              data-selected={filterDetails.categories.selected_ids.includes(
                                item.id
                              )}
                              onClick={(e) =>
                                onChangeFilter(
                                  e,
                                  true,
                                  false,
                                  false,
                                  false,
                                  item,
                                  item.id
                                )
                              }
                            >
                              {item.name}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                {Array.isArray(filterDetails.brands.brands) &&
                  filterDetails.brands.brands.length != 0 && (
                    <div className="filter-by-brand">
                      <h4 className="filter-heading">Filter by Brand</h4>
                      <ul className="filter-by-brand-items">
                        {filterDetails.brands.brands.map((item, idx) => (
                          <li
                            key={item.id}
                            data-category={item}
                            data-selected={filterDetails.brands.selected_ids.includes(
                              item.id
                            )}
                            onClick={(e) =>
                              onChangeFilter(
                                e,
                                false,
                                true,
                                false,
                                false,
                                item,
                                item.id
                              )
                            }
                          >
                            {item.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {Array.isArray(filterDetails.offers.offers) &&
                  filterDetails.offers.offers.length != 0 && (
                    <div className="filter-by-category">
                      <h4 className="filter-heading">Filter by offer</h4>
                      <ul className="filter-by-category-items">
                        {filterDetails.offers.offers.map((item) => (
                          <li
                            key={item.id}
                            data-category={item}
                            data-selected={filterDetails.offers.selected_ids.includes(
                              item.id
                            )}
                            onClick={(e) =>
                              onChangeFilter(
                                e,
                                false,
                                false,
                                false,
                                true,
                                item,
                                item.id
                              )
                            }
                          >
                            {item.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                <div className="filter-by-price-range">
                  <h4 className="filter-heading">Price Range</h4>
                  <Slider
                    value={filterDetails.selectedPriceRange}
                    onChange={(e, newValue) =>
                      onChangeFilter(
                        e,
                        false,
                        false,
                        true,
                        false,
                        newValue,
                        null
                      )
                    }
                    valueLabelDisplay="auto"
                    min={filterDetails.priceRange[0]}
                    max={filterDetails.priceRange[1]}
                  />
                  The selected range is {filterDetails.selectedPriceRange[0]} -{" "}
                  {filterDetails.selectedPriceRange[1]}
                </div>
                <div className="filter-apply-btn">
                  <button
                    className="btn btn-medium reset-btn"
                    onClick={filterReset}
                  >
                    Reset
                  </button>
                  <button
                    className="btn btn-medium apply-btn"
                    onClick={() => setFetchToggle((prev) => !prev)}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="search-product-container">
            {products.length == 0 && isDataFetched && (
              <h1 style={{ textAlign: "center" }}>Products not available</h1>
            )}
            <ul className="search-products">
              {products.map((item, idx) => (
                <ProductCard {...item} />
              ))}
            </ul>
          </div>
          {products.length != 0 && (
            <Pagination
              page={pagination.currentPage}
              count={pagination.totalPages}
              renderItem={(item) => (
                <PaginationItem
                  component={Link}
                  to={`/products/search/${productName}/page/${item.page}`}
                  {...item}
                />
              )}
            />
          )}
        </div>
      </section>
    </>
  );
}

//  else if (is_brand) {
//       const brand = newValue;
//       const new_brand = filterDetails.brand;
//       if (!filterDetails.brand[brand]) {
//         new_brand[brand] = true;
//         e.currentTarget.setAttribute("data-selected", "true");
//       } else {
//         new_brand[brand] = false;
//         e.currentTarget.setAttribute("data-selected", "false");
//       }
//       setFilterDetails({ ...filterDetails, brand: new_brand });
//     } else if (is_category) {
//       const category = newValue;
//       const new_categories = filterDetails.categories;
//       if (!filterDetails.categories[category]) {
//         new_categories[category] = true;
//         e.currentTarget.setAttribute("data-selected", "true");
//       } else {
//         new_categories[category] = false;
//         e.currentTarget.setAttribute("data-selected", "false");
//       }
//       setFilterDetails({ ...filterDetails, categories: new_categories });
//     }

// const newBrandFilter: Record<string, boolean> = Object.keys(
//   filterDetails.brand
// ).reduce((acc, key) => {
//   acc[key] = false;
//   return acc;
// }, {} as Record<string, boolean>);
// const newCategoriesFilter: Record<string, boolean> = Object.keys(
//   filterDetails.categories
// ).reduce((acc: any, key) => {
//   acc[key] = false;
//   return acc;
// }, {} as Record<string, boolean>);

// const newSelectedPriceRange = filterDetails.priceRange;
// setFilterDetails((prev) => ({
//   ...prev,
//   brand: newBrandFilter,
//   categories: newCategoriesFilter,
//   selectedPriceRange: newSelectedPriceRange,
// }));
