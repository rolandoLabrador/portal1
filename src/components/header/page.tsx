// src/app/components/header/page.tsx
"use client";
import Image from "next/image";
import logo from "@/app/assets/OmniShield Logo.png"; // Adjusted path to match your structure
import LogoutButton from "@/components/logout/logout"; // Adjust the import path to where your logoutButton component is located
import Link from "next/link";

const Header = () => {
  return (
    <div className="navbar bg-gray-200">
      <div className="flex-none dropdown">
        <button tabIndex={0} className="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-5 w-5 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
        >
          <li>
            <a href="form">form</a>
          </li>
          <li>
            <a href="tableStatus">Table</a>
          </li>
          <li>
            <LogoutButton />
          </li>
        </ul>
      </div>

      <div className="flex-1">
        <Link href="/">
          <div>
            <Image src={logo} alt="OmniShield Logo" width={100} height={100} />{" "}
            {/* Adjust width/height as needed */}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Header;
