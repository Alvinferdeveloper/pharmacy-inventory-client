"use client"
import { withAuth } from "@/app/components/withAuth";
import UsersPage from "./components/UsersPage";

export default withAuth(UsersPage, ["Administrator", "Consultant"]);
