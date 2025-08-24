"use client"
import { withAuth } from "@/app/components/withAuth";
import SuppliersPage from "./components/SuppliersPage";

export default withAuth(SuppliersPage, ["Administrator", "Salesman"]);
