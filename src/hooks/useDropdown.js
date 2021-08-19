import { useState, useEffect } from "react";

export default function useDropdown() {
  const [open, setOpen] = useState();

  const toggleDropdown = () => {
    setOpen((open) => !open);
  };

  const closeDropdown = (e) => {
    e.stopPropagation();
    setOpen(false);
  };

  // when clicked outside, close the dropdown
  useEffect(() => {
    if (open) {
      window.addEventListener("click", closeDropdown);
    } else {
      window.removeEventListener("click", closeDropdown);
    }

    return () => window.removeEventListener("click", closeDropdown);
  }, [open]);

  return { open, toggleDropdown, closeDropdown };
}
