"use client"
import ClientesPage from "./components/ClientesPage";
import { withAuth } from "@/app/components/withAuth";

export default withAuth(ClientesPage, ["Administrator", "Salesman", "Consultant"]);
