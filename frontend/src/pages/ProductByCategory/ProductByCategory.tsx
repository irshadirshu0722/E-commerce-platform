import "./productbycategory.css";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { sliderEffect } from "../../utils/sliderScrpt";
import { SEARCH_BY_CATEGORY } from "../../config/backendApi";
// component
import ProductCard from "../../components/common/ProductCard";
import Loading from "../../components/common/Loading/Loading";

// CustomHook
import useApiCall from "../../hooks/useApiCall";

// interfaces
import {
  IProductCard,
  DefaultIPagination,
  IPagination,
} from "../../interfaces/CommonInterfaces";
import {
  ICategoryNames,
  IRouteParams,
} from "../../interfaces/IProductByCategory";

// utils
import { arraysEqual } from "../../utils/arraysEqual";
export function ProductByCategory() {
  const categoriesContainerRef = useRef<HTMLUListElement>(null);
  const { categoryId, pageNumber } = useParams<IRouteParams>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<IProductCard[]>([]);
  const [categories, setCategories] = useState<ICategoryNames[]>([]);
  const [pagination, setPagination] = useState<IPagination>(DefaultIPagination);
  const [isDataFetched, setIsDataFetched] = useState<boolean>(false);
  const { loading, makeApiCall } = useApiCall();
  useEffect(() => {
    fetchData();
  }, [categoryId, pageNumber]);
  const fetchData = async () => {
    try {
      const url = SEARCH_BY_CATEGORY + `${categoryId}/${pageNumber}/`;
      const { ok, response } = await makeApiCall(url);
      if (ok) {
        const data = response?.data;
        if (data.pagination) {
          setPagination(data.pagination);
        }
        if (data.products) {
          setProducts(data.products);
        }
        if (!isDataFetched) {
          if (data.categories) {
            setCategories(data.categories);
            setIsDataFetched(true);
          }
        }
      }
    } catch {}
  };

  useEffect(() => {
    if (categoriesContainerRef.current) {
      sliderEffect(categoriesContainerRef.current);
    }
  }, [categories]);
  useEffect(() => {
    const categoriesContainer = categoriesContainerRef.current;
    if (categoriesContainer) {
      const selectedCategory =
        categoriesContainer.querySelector<HTMLLIElement>(".selected");
      if (selectedCategory) {
        categoriesContainer.scrollTo({
          left: selectedCategory.offsetLeft,
          behavior: "smooth",
        });
      }
    }
  }, [categoryId]);

  if (loading && !isDataFetched) {
    return <Loading />;
  }
  return (
    <>
      <section className="category-products-section">
        <div className="category-products-center section-center">
          <ul
            className="categories scrollable-div"
            id="categoriesScrollContainer"
            ref={categoriesContainerRef}
          >
            {categories.map((item: any, idx: number) => (
              <li
                className={item.id == categoryId ? `selected` : ""}
                key={item.category_name}
                value={item.id}
                onClick={(e) => {
                  navigate(`/products/category/${item.id}/page/1`);
                }}
              >
                {item.category_name}
              </li>
            ))}
          </ul>
          {loading && isDataFetched ? (
            <Loading />
          ) : (
            <>
              <div>
                {products.length == 0 && (
                  <h1 style={{ textAlign: "center" }}>
                    Products not available
                  </h1>
                )}
                <ul className="category-products">
                  {products.map((item) => (
                    <ProductCard {...item} />
                  ))}
                </ul>
              </div>
              <div>
                {products.length != 0 && (
                  <Pagination
                    page={pagination.currentPage}
                    count={pagination.totalPages}
                    renderItem={(item) => (
                      <PaginationItem
                        component={Link}
                        to={`/products/category/${categoryId}/page/${item.page}`}
                        {...item}
                      />
                    )}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

// useEffect(() => {
//   script();
// }, [categories]);
// function script() {
//   const categoryItems: NodeListOf<HTMLLIElement> | null =
//     document.querySelectorAll<HTMLLIElement>(
//       ".category-products-center .categories li"
//     );
//   const pointer: HTMLDivElement | null =
//     document.querySelector<HTMLDivElement>(
//       ".category-products-center .categories .category-pointer"
//     );
//   const categoriesScrollContainer: HTMLElement | null =
//     document.getElementById("categoriesScrollContainer");
//   // if (categoryItems) {
//   //   // categoryItems.forEach((item) => {
//   //     // item.addEventListener("click", function () {
//   //     //   console.log("clicked");
//   //     //   if (pointer) {
//   //     //     pointer.style.width = this.offsetWidth + "px";
//   //     //     pointer.style.left = this.offsetLeft + "px";
//   //     //     if (item.parentElement) {
//   //     //       item.parentElement.scrollTo({
//   //     //         left: item.offsetLeft,
//   //     //         behavior: "smooth",
//   //     //       });
//   //     //     }
//   //     //   }
//   //     // });
//   //     // if (categoryId !== undefined && item.value === parseInt(categoryId)) {
//   //     //   if(pointer){
//   //     //     pointer.style.width = item.offsetWidth + "px";
//   //     //     pointer.style.left = item.offsetLeft + "px";
//   //     //   }
//   //     //   if (item.parentElement) {
//   //     //     item.parentElement.scrollTo({
//   //     //       left: item.offsetLeft,
//   //     //       behavior: "smooth",
//   //     //     });
//   //     //   }

//   //     // }
//   //   // });
//   // }
//   // if (categoriesScrollContainer) {
//   //   sliderEffect(categoriesScrollContainer);
//   // }
// }

// change the category point when the categories changed
// useEffect(() => {
//     pointToCategory();
// }, [categories]);

// function pointToCategory() {
//   const parent = categoryPointerRef.current?.parentElement;
//   if (parent) {
//     const categoryItems: NodeListOf<HTMLElement> =
//       parent.querySelectorAll("li");
//     categoryItems.forEach((item) => {
//       const itemValue = item.getAttribute("value");
//       if (itemValue === categoryId && categoryPointerRef.current) {
//         console.log("value equal", itemValue);
//         categoryPointerRef.current.style.width = item.offsetWidth + "px";
//         categoryPointerRef.current.style.left = item.offsetLeft + "px";
//         parent.scrollTo({
//           left: item.offsetLeft,
//           behavior: "smooth",
//         });
//       }
//     });
//   }
// }

// function onCategoryChange(e: React.MouseEvent) {
//   const item = e.currentTarget as HTMLElement;
//   const itemParent = item.parentElement as HTMLElement;
//   if (item && categoryPointerRef.current && itemParent) {
//     categoryPointerRef.current.style.width = item.offsetWidth + "px";
//     categoryPointerRef.current.style.left = item.offsetLeft + "px";
//     itemParent.scrollTo({
//       left: item.offsetLeft,
//       behavior: "smooth",
//     });
//   }
// }
