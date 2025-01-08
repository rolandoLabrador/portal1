"use client";

import { useState, useEffect } from "react";
import Footer from "../../components/footer/page";
import Header from "../../components/header/page";
import { useQuery } from "@tanstack/react-query";
import client from "../axios.config";
import dayjs from "dayjs";

const TableStatusPage = () => {
  const [hasError, setHasError] = useState(false);
  const { data } = useQuery({
    queryKey: ["table", "data"],
    queryFn: async () => {
      return client.get("/api/table");
    },
  });

  // Simulate an error condition 

  const checkForErrors = () => {
    // Example condition
    if (data && data.data.some(elem => elem.status !== "PAID")) {
      setHasError(true);
    }
  };

  // Call the error check function once when the component mounts
  useEffect(() => {
    if (data) {
      checkForErrors();
    }
  }, [data]);

  return (
    <>
      <Header />
      <div className="flex justify-center items-start pt-20 min-h-[82vh]">
        <div className="overflow-x-auto">
          <table className="table table-xs">
            <thead>
              <tr>
                <th>Dealer Number</th>
                <th>Dealer Name</th>
                <th>Register Number</th>
                <th>Amount</th>
                <th>User Name</th>
                <th>Check Number</th>
                <th>Status</th>
                <th>Entry Date</th>
                <th>Paid Date</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((elem) => (
                <tr
                  key={elem.id}
                  className={
                    hasError && elem.status !== "PAID" ? "bg-red-400" : ""
                  }
                >
                  <th>{elem?.dealerNumber ?? "--"}</th>
                  <th>{elem?.dealerName ?? "--"} </th>
                  <td>{elem?.registerNumber ?? "--"}</td>
                  <td>{elem?.checkAmount ?? "--"}</td>
                  <td>{elem?.userName ?? "--"}</td>
                  <td>{elem?.checkNumber === "" ? "--" : elem?.checkNumber}</td>
                  <td>{elem?.status ?? "--"}</td>
                  <td>
                    {dayjs(elem?.entryDate).isValid()
                      ? dayjs(elem?.entryDate).format("YYYY-MM-DD")
                      : "--"}
                  </td>
                  <td>
                    {dayjs(elem?.paidDate).isValid()
                      ? dayjs(elem?.paidDate).format("YYYY-MM-DD")
                      : "--"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TableStatusPage;