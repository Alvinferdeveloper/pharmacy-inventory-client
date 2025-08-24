"use client"
import { withAuth } from "@/app/components/withAuth";
import ProductsPage from "./components/ProductsPage";

export default withAuth(ProductsPage, ["Administrator", "Salesman", "Consultant"]);