import React from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

export default function AppNavbar() {
  return (
    // Dùng bg="dark" và data-bs-theme="dark" cho dễ nhìn
    <Navbar bg="dark" data-bs-theme="dark" expand="lg">
      <Container>
        {/* Navbar.Brand trỏ về trang chủ */}
        <Navbar.Brand as={Link} to="/">
          SE181834
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Link Task 2.1: Home */}
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            {/* Link Task 2.1: All Lessons (đúng URL) */}
            <Nav.Link as={Link} to="/SE181834/all-lessons">
              All Lessons
            </Nav.Link>
            {/* Link Task 2.1: Completed Lessons (đúng URL) */}
            <Nav.Link as={Link} to="/SE181834/completed-lessons">
              Completed Lessons
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
