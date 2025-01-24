import Logo from "./Logo";

function Footer() {
  return (
    <footer
      className="p-4 border-t border-gray-200 bg-white flex flex-col sm:flex-row justify-between items-center gap-4"
      aria-label="Footer"
    >
      {/* Logo */}
      <Logo />

      {/* Copyright Text */}
      <small className="text-sm font-light text-center text-gray-600">
        &copy; {new Date().getFullYear()} ChitraSetu | All Rights Reserved.
      </small>
    </footer>
  );
}

export default Footer;
