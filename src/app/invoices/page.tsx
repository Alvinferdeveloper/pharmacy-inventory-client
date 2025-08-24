"use client"
import InvoicesPage from "./components/InvoicesPage"
import { withAuth } from "@/app/components/withAuth";

export default withAuth(InvoicesPage, ["Administrator", "Salesman", "Consultant"]);
