"use client";

import Dashboard from "@/components/Dashboard";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function DashboardPage() {
  const [dashboardData, setDashboardData] = useState([]);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast.success(data.message);
          setDashboardData(data.data);
        } else {
          toast.error(data.message);
        }
      });
  }, []);
  return <div><Dashboard data={dashboardData} /></div>;
}
export default DashboardPage;
