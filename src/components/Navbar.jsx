import React from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

/**
 * Task 2.1 (1.0 mark): Create a Navbar
 * Navigate all the routes in the application.
 * Including: Home, All Lessons, Completed Lessons.
 */
export default function AppNavbar() {
  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          SE181834
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Task 2.1: Home link */}
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            {/* Task 2.1: All Lessons link */}
            <Nav.Link as={Link} to="/SE181834/all-lessons">
              All Lessons
            </Nav.Link>
            {/* Task 2.1: Completed Lessons link */}
            <Nav.Link as={Link} to="/SE181834/completed-lessons">
              Completed Lessons
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
