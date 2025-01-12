import React, { useState, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { Link, useNavigate, useParams } from "react-router-dom";

// csss
import "./orderhistory.css";
// Images

// interfaces
import { IOrderListItem } from "../../../interfaces/IAccount";
import AccountBackNavigation from "../../../components/common/AccountBackNavigation/AccountBackNavigation";
import useApiCall from "../../../hooks/useApiCall";
import Loading from "../../../components/common/Loading/Loading";
import { ACCOUNT_ORDER_LIST } from "../../../config/backendApi";
import { useStore } from "../../../context/store";
import { IPagination } from "../../../interfaces/CommonInterfaces";
import Filter from "../../../components/common/Filter/Filter";
const orderPackageImg = require("../../../assets/images/orderStatusIcons/orderPackage.png");
const orderConfirmedImg = require("../../../assets/images/orderStatusIcons/orderConfirmed.png");
const orderPendingImg = require("../../../assets/images/orderStatusIcons/orderPending.png");
const orderShippedImg = require("../../../assets/images/orderStatusIcons/orderShipped.png");
const orderCompletedImg = require("../../../assets/images/orderStatusIcons/orderCompleted.png");
export default function AccountOrderHistory() {
  const [orders, setOrders] = useState<IOrderListItem[]>();
  const { isDataFetched, loading, makeApiCall, reload } = useApiCall();
  const [pagination, setPagination] = useState<IPagination>({
    currentPage: 1,
    totalPages: 10,
  });
  const [filter, setFilter] = useState<{
    order: boolean;
    return_order: boolean;
  }>({ order: false, return_order: false });
  const [orderIcon, setOrderIcon] = useState("");
  const navigate = useNavigate();
  const { pageNumber } = useParams();
  const { authToken } = useStore();
  const [reFetch, setReFetch] = useState<boolean>(false);
  useEffect(() => {
    fetchData();
  }, [pageNumber, reFetch]);
  const fetchData = async () => {
    try {
      let type = "both";
      if (filter.order && !filter.return_order) {
        type = "order";
      } else if (filter.return_order && !filter.order) {
        type = "return_order";
      }
      const url = ACCOUNT_ORDER_LIST + type + `/${pageNumber}/`;
      const { response, ok } = await makeApiCall(
        url,
        "get",
        {},
        true,
        authToken,
        true
      );
      if (ok) {
        const data: {
          order_icon: string;
          orders: IOrderListItem[];
          pagination: IPagination;
        } = response?.data;
        console.log(data);
        if (data.order_icon) {
          setOrderIcon(data.order_icon);
        }
        if (data.orders) {
          setOrders(data.orders);
        }
        if (data.pagination) {
          setPagination(data.pagination);
        }
      } else {
        navigate("/account/");
      }
    } catch {}
  };

  const onFliterReset = () => {
    setFilter({ order: false, return_order: false });
  };
  const onFilterApply = () => {
    setReFetch((prev) => !prev);
  };
  if (loading && reload) {
    return <Loading />;
  }

  return (
    <section className="account-orders">
      <div className="section-center account-orders-center">
        <AccountBackNavigation heading={"Order History"} />
        <div className="filter" style={{ width: "100%" }}>
          <Filter onFilterReset={onFliterReset} onFilterApply={onFilterApply}>
            <div>
              <h4 className="filter-heading">Filter by Type</h4>
              <ul>
                <li
                  data-selected={filter.order}
                  onClick={() => setFilter({ ...filter, order: !filter.order })}
                >
                  Order
                </li>
                <li
                  data-selected={filter.return_order}
                  onClick={() =>
                    setFilter({ ...filter, return_order: !filter.return_order })
                  }
                >
                  Return Order
                </li>
              </ul>
            </div>
          </Filter>
        </div>
        <ul className="account-orders-items">
          {orders?.map((item, idx) => (
            <li
              key={idx}
              className="account-orders-item"
              onClick={() => navigate(`/orders/${item.id}/`)}
            >
              <div className="order-info">
                <div className="order-logo">
                  <img src={orderIcon} alt="" />
                </div>
                <div className="order-details">
                  <p className="order_id">Order ID :{item.order_id}</p>
                  <p className="total">Total :&#8377;{item.total}</p>
                  <p className="quantity">Quantity :{item.quantity}</p>
                  <p className="discount">Discount :&#8377;{item.discount}</p>
                </div>
              </div>
              <div className="order-status">
                <img src={item.status_image_url} alt="" />
                <p className="status cap"> {item.status}</p>
                <p> Placed: {item.order_at}</p>
              </div>
            </li>
          ))}
        </ul>
        {orders?.length != 0 && (
          <Pagination
            page={pagination.currentPage}
            count={pagination.totalPages}
            renderItem={(item) => (
              <PaginationItem
                component={Link}
                to={`/account/orders/page/${item.page}/`}
                {...item}
              />
            )}
          />
        )}
      </div>
    </section>
  );
}
