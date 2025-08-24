"use client"
import CategoriesPage from "./components/CategoriesPage"
import { withAuth } from "@/app/components/withAuth";

export default withAuth(CategoriesPage, ["Administrator", "Salesman"]);
