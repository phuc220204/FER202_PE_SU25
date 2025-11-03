import React from "react";
import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import AppNavbar from "../components/Navbar";

export default function MainLayout() {
  return (
    <>
      <AppNavbar />
      <Container className="mt-4">
        <Outlet />
      </Container>
    </>
  );
}
