import "rsuite/dist/rsuite.css";
import { useEffect, useState } from "react";
import "./adminDashboard.css";
import { DateRangePicker } from "rsuite";

import { ArcElement } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { DateRange } from "rsuite/esm/DateRangePicker";
import useApiCall from "../../../hooks/useApiCall";
import Loading from "../../../components/common/Loading/Loading";
import { ADMIN_DASHBOARD } from "../../../config/backendApi";
import { useStore } from "../../../context/store";
import { IStatitics } from "../../../interfaces/IAdminDashboard";
import { generateRandomColors } from "../../../utils/utils";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export function AdminDashboard() {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  const endDate = new Date();
  const [overViewDateRange, setOverViewDateRange] = useState<DateRange | null>([
    startDate,
    endDate,
  ]);
  const [statitics, setStatitics] = useState<IStatitics>();
  const [isLoadingOverView, setIsLoadingOverView] = useState<boolean>();
  const [reFetch, setReFetch] = useState<boolean>(false);
  const { loading, makeApiCall, reload } = useApiCall();
  const { authToken } = useStore();
  useEffect(() => {
    fetchData();
  }, [reFetch]);
  const fetchData = async () => {
    try {
      const url = ADMIN_DASHBOARD;
      const data = {
        custom_sales_overview_date: {
          start_date: overViewDateRange?.[0].toISOString().slice(0, 10),
          end_date: overViewDateRange?.[1].toISOString().slice(0, 10),
        },
      };
      const { ok, response } = await makeApiCall(
        url,
        "post",
        data,
        true,
        authToken,
        true
      );
      if (ok) {
        setStatitics(response?.data);
      }
    } catch {}
  };

  const handleDateChange = (value: DateRange | null) => {
    if (value?.[0] && value[1]) {
      setOverViewDateRange([value?.[0], value?.[1]]);
    }
    setReFetch((prev) => !prev);
  };

  if (loading && reload) {
    return <Loading />;
  }
  const barChartOptions: any = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function (value: number) {
            if (value >= 1000) {
              return (value / 1000).toFixed(1) + "k";
            }
            return value.toString();
          },
        },
      },
    },
  };
  const orderBarChartData = {
    labels: statitics?.orders_bar_chart.labels,
    datasets: [
      {
        label: "Total Sales",
        data: statitics?.orders_bar_chart.data,
        backgroundColor: "#ff5d01",
        borderRadius: 10,
      },
    ],
  };
  const salesBarChartData = {
    labels: statitics?.sales_bar_chart.labels,
    datasets: [
      {
        label: "Total Sales",
        data: statitics?.sales_bar_chart.data,
        backgroundColor: "#ff5d01",
        borderRadius: 10,
      },
    ],
  };
  var { backgroundColors, borderColors } = generateRandomColors(
    statitics?.order_status.labels.length ?? 0
  );
  const PiedataOrderStatus = {
    labels: statitics?.order_status.labels,
    datasets: [
      {
        label: "# of Votes",
        data: statitics?.order_status.data,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };
  var { backgroundColors, borderColors } = generateRandomColors(
    statitics?.order_status.labels.length ?? 0
  );
  const PiedataOrderReturn = {
    labels: statitics?.total_order_return.labels,
    datasets: [
      {
        label: "# of Votes",
        data: statitics?.total_order_return.data,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };
  return (
    <>
      <div className="admin-dashboard section">
        <div className="section-center-80 admin-dashboard-center">
          <div className="admin-dashboard-charting">
            <div className="all-time-sales-overview a">
              <div className="periods">
                <p className="">All Time</p>
              </div>
              <div className="heading">
                <h3>Sales Overview</h3>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Customers</td>
                    <td>
                      {statitics?.all_time_sales_overview.total_customers.value}
                    </td>
                  </tr>
                
                  <tr>
                    <td>Orders</td>
                    <td>{statitics?.all_time_sales_overview.orders.value}</td>
                  </tr>
                  <tr>
                    <td>Gross Sales</td>
                    <td>
                      {statitics?.all_time_sales_overview.gross_sales.value}{" "}
                      &#8377;
                    </td>
                  </tr>
                  <tr>
                    <td>Net Sales</td>
                    <td>
                      {statitics?.all_time_sales_overview.net_sales.value}{" "}
                      &#8377;
                    </td>
                  </tr>
                  <tr>
                    <td>Discounts</td>
                    <td>
                      {statitics?.all_time_sales_overview.discounts.value}{" "}
                      &#8377;
                    </td>
                  </tr>
                  <tr>
                    <td>Refunds</td>
                    <td>
                      {statitics?.all_time_sales_overview.refunds.value} &#8377;
                    </td>
                  </tr>
                  <tr>
                    <td>Shipping</td>
                    <td>
                      {statitics?.all_time_sales_overview.shipping.value}{" "}
                      &#8377;
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="last-month-sales-overview b">
              <div className="periods">
                <h3>
                  <DateRangePicker
                    value={overViewDateRange}
                    onChange={handleDateChange}
                    style={{ backgroundColor: "#21364f" }}
                  />
                </h3>
              </div>
              <div className="heading">
                <h3>Sales Overview</h3>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Value</th>
                    <th>vs prev</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Customers</td>
                    <td>
                      {statitics?.custom_sales_overview.total_customers.value}
                    </td>
                    <td
                      className={`up-or-down ${statitics?.custom_sales_overview.total_customers.type}`}
                    >
                      <span>
                        {statitics?.custom_sales_overview.total_customers
                          .type == "up" && "▲"}
                        {statitics?.custom_sales_overview.total_customers
                          .type == "down" && "▼"}
                        {
                          statitics?.custom_sales_overview.total_customers
                            .growth_rate
                        }{" "}
                        %
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>Orders</td>
                    <td>{statitics?.custom_sales_overview.orders.value}</td>
                    <td
                      className={`up-or-down ${statitics?.custom_sales_overview.orders.type}`}
                    >
                      <span>
                        {statitics?.custom_sales_overview.orders.type == "up" &&
                          "▲"}
                        {statitics?.custom_sales_overview.orders.type ==
                          "down" && "▼"}
                        {statitics?.custom_sales_overview.orders.growth_rate} %
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>Gross Sales</td>
                    <td>
                      {statitics?.custom_sales_overview.gross_sales.value}{" "}
                      &#8377;
                    </td>
                    <td
                      className={`up-or-down ${statitics?.custom_sales_overview.gross_sales.type}`}
                    >
                      <span>
                        {statitics?.custom_sales_overview.gross_sales.type ==
                          "up" && "▲"}
                        {statitics?.custom_sales_overview.gross_sales.type ==
                          "down" && "▼"}
                        {
                          statitics?.custom_sales_overview.gross_sales
                            .growth_rate
                        }{" "}
                        %
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>Net Sales</td>
                    <td>
                      {statitics?.custom_sales_overview.net_sales.value} &#8377;
                    </td>
                    <td
                      className={`up-or-down ${statitics?.custom_sales_overview.net_sales.type}`}
                    >
                      <span>
                        {statitics?.custom_sales_overview.net_sales.type ==
                          "up" && "▲"}
                        {statitics?.custom_sales_overview.net_sales.type ==
                          "down" && "▼"}
                        {statitics?.custom_sales_overview.net_sales.growth_rate}{" "}
                        %
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>Discounts</td>
                    <td>
                      {statitics?.custom_sales_overview.discounts.value} &#8377;
                    </td>
                    <td
                      className={`up-or-down ${statitics?.custom_sales_overview.discounts.type}`}
                    >
                      <span>
                        {statitics?.custom_sales_overview.discounts.type ==
                          "up" && "▲"}
                        {statitics?.custom_sales_overview.discounts.type ==
                          "down" && "▼"}
                        {statitics?.custom_sales_overview.discounts.growth_rate}{" "}
                        %
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>Refunds</td>
                    <td>
                      {statitics?.custom_sales_overview.refunds.value} &#8377;
                    </td>
                    <td
                      className={`up-or-down ${statitics?.custom_sales_overview.refunds.type}`}
                    >
                      <span>
                        {statitics?.custom_sales_overview.refunds.type ==
                          "up" && "▲"}
                        {statitics?.custom_sales_overview.refunds.type ==
                          "down" && "▼"}
                        {statitics?.custom_sales_overview.refunds.growth_rate} %
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>Shipping</td>
                    <td>
                      {statitics?.custom_sales_overview.shipping.value} &#8377;
                    </td>
                    <td
                      className={`up-or-down ${statitics?.custom_sales_overview.shipping.type}`}
                    >
                      <span>
                        {statitics?.custom_sales_overview.shipping.type == "up" &&
                          "▲"}
                        {statitics?.custom_sales_overview.shipping.type ==
                          "down" && "▼"}
                        {statitics?.custom_sales_overview.shipping.growth_rate}{" "}
                        %
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="best-sales-product c ">
              <div className="periods">
                <p className="">All Time</p>
              </div>
              <div className="heading">
                <h3>Best Selling Product</h3>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Metric</th>
                    <th>Value</th>
                    <th>orders</th>
                  </tr>
                </thead>
                <tbody>
                  {statitics?.best_selling_products.map((item, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{item.product_name}</td>
                      <td>&#8377;{item.total_amount}</td>
                      <td>
                        <span>{item.total_orders}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="total-sales-bar-chart d ">
              <div className="periods">
                <p className="">All Time</p>
              </div>
              <div className="heading">
                <h3>Total Sales</h3>
              </div>
              <div className="chart">
                <Bar data={salesBarChartData} options={barChartOptions} />
              </div>
            </div>
            <div className="total-orders-bar-chart e ">
              <div className="periods">
                <p className="">All Time</p>
              </div>
              <div className="heading">
                <h3>Total Orders </h3>
              </div>
              <div className="chart">
                <Bar data={orderBarChartData} options={barChartOptions} />
              </div>
            </div>
            <div className="orders-pi-chart f">
              <div className="periods">
                <p className="">All Time</p>
              </div>
              <div className="heading">
                <h3>Order status </h3>
              </div>
              <div className="char">
                <Doughnut data={PiedataOrderStatus} />
              </div>
            </div>
            <div className="orders-return-pie-chart g">
              <div className="periods">
                <p className="">All Time</p>
              </div>
              <div className="heading">
                <h3>Order & Return </h3>
              </div>
              <div className="char">
                <Doughnut data={PiedataOrderReturn} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
