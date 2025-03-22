import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <div className="container text-center">
        {/* Brand Name */}
        <h5 className="mb-3 fw-bold">BlogSphere</h5>
        <p className="mb-1">Empowering writers & readers worldwide.</p>

        {/* Social Media Icons */}
        <div className="d-flex justify-content-center gap-3 my-3">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white fs-5">
            <FaFacebook />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white fs-5">
            <FaTwitter />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white fs-5">
            <FaInstagram />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white fs-5">
            <FaLinkedin />
          </a>
        </div>

        {/* Copyright */}
        <p className="small mb-0">© {new Date().getFullYear()} BlogSphere. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
