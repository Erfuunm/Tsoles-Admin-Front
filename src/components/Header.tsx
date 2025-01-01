import React, { useState } from 'react';

export default function Header() {
    const data = {
        logo: "/assets/logo.png",
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuItems = [
        {
            title: "Shipments",
            href: "/shipments",
        },
        // Add more menu items here as needed
    ];

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="bg-gray-800 p-4 flex justify-between items-center">
            {/* Logo */}
            <a href="/">
                <img
                    src={data.logo}
                    alt="logo"
                    className="h-10"
                />
            </a>

            {/* Menu Toggle Button */}
            <button
                onClick={toggleMenu}
                className="lg:hidden text-white focus:outline-none"
            >
                {isMenuOpen ? 'Close' : 'Menu'}
            </button>

            {/* Menu Items */}
            <nav className={`absolute lg:static lg:flex lg:items-center lg:gap-4 ${isMenuOpen ? 'block' : 'hidden'} transition-all duration-300 bg-gray-700 lg:bg-transparent lg:p-0 p-4 top-16 right-0 left-0`}>
                {menuItems.map((item, index) => (
                    <a key={index} href={item.href} className="text-white block lg:inline-block px-4 py-2">
                        {item.title}
                    </a>
                ))}
            </nav>
        </header>
    );
}