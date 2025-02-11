import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        // behavior: "smooth", // Smooth scrolling effect
      });
    }); // Small delay to ensure content loads before scrolling
  }, [pathname]);

  return null;
};

export default ScrollToTop;
