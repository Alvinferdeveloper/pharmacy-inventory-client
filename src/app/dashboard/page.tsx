"use client"
import Dashboard from "./components/Dashboard";
import { withAuth } from "@/app/components/withAuth";

export default withAuth(Dashboard, ["Administrator", "Consultant"]);