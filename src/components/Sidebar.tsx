/* eslint-disable jsx-a11y/alt-text */
import {
    Divider,
} from "@nextui-org/react";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineUser } from "react-icons/ai"; // User icon
import { BsBug } from "react-icons/bs"; // Bug icon
import { PiFediverseLogo } from "react-icons/pi";
import { MdOutlineNotifications } from "react-icons/md"; // Tickets icon
import { HiOutlineClipboardList } from "react-icons/hi";
import { LuSettings } from "react-icons/lu";
import { BiLogOutCircle } from "react-icons/bi";
import { useAuth } from "@/contexts/AuthContext";

interface Menu {
    title: string;
    icon: JSX.Element;
    href: string;
}

interface SidebarProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
    const { logout } = useAuth();
    const Menus: Menu[] = [
        {
            title: "Users",
            icon: <AiOutlineUser className="w-7 text-gray-300 dark:text-sky-500  h-7" />,
            href: "/dashboard",
        },
        {
            title: "Bugs List",
            icon: <BsBug className="w-7 text-gray-300 dark:text-sky-500 h-7" />,
            href: "/bugs",
        },
        {
            title: "Logs List ",
            icon: <PiFediverseLogo className="w-7 text-gray-300 dark:text-sky-500 h-7" />,
            href: "/logs",
        },
        {
            title: "Tickets List",
            icon: <MdOutlineNotifications className="w-7 text-gray-300 dark:text-sky-500 h-7" />,
            href: "/tickets",
        },
        {
            title: "Examinations",
            icon: <HiOutlineClipboardList className="w-7 text-gray-300 dark:text-sky-500 h-7" />,
            href: "/examinations",
        },
        {
            title: "Settings",
            icon: <LuSettings className="w-7 text-gray-300 dark:text-sky-500 h-7" />,
            href: "/settings",
        },
    ];

    const [selectItem, setSelectItem] = useState<string | undefined>();
    const navigate = useNavigate();

    const toggleDarkMode = () => {
        document.documentElement.classList.toggle('dark');
    };

    return (
        <div
            className={`hidden md:block ${open ? "w-60" : "w-20"} bg-[#036597] dark:bg-primary p-5 relative pt-14 duration-300`}
        >
            <div className="flex -mt-8 items-center border-b border-white pb-1">
                <img
                    src="/assets/Tsoles-logo.png"
                    className={`cursor-pointer -ml-5 h-20 w-24 duration-500 ${open && "rotate-[360deg]"}`}
                    alt="Logo"
                />
                <h1
                    className={`text-white origin-left font-medium  text-base duration-200 ${!open && "scale-0"}`}
                >
                    Tsoles-Admin
                </h1>
            </div>
            

            <ul className="pt-6">
                {Menus.map((Menu, index) => (
                    <li
                        key={index}
                        className={`flex rounded-md p-2 mb-8 cursor-pointer hover:bg-light-white text-white dark:text-gray-100 text-lg items-center gap-x-4 
                                    ${Menu.title === selectItem ? "bg-[#3e3c3c]" : ""}`}
                        onClick={() => {
                            navigate(Menu.href);
                            setSelectItem(Menu.title);
                        }}
                    >
                        {Menu.icon}
                        <span className={`${!open && "hidden"} origin-left duration-200`}>
                            {Menu.title}
                        </span>
                    </li>
                ))}

                <li
                    className={`flex rounded-md p-2 mb-8 cursor-pointer hover:bg-light-white text-gray-300 text-lg items-center gap-x-4`}
                    onClick={logout}
                >
                    <BiLogOutCircle className="w-7 text-mainColor text-gray-300 dark:text-sky-500 h-7" />
                    <span className={`${!open && "hidden"} origin-left text-white dark:text-gray-100 duration-200`}>
                       Log out
                    </span>
                </li>
            </ul>

            {/* Dark Mode Toggle Button */}
            <div className="flex items-center mt-4">
                <button
                    className="flex items-center p-2 rounded-md bg-blue-600 text-white shadow-md"
                    onClick={toggleDarkMode}
                >
                    Toggle Dark Mode
                </button>
            </div>
        </div>
    );
};

export default Sidebar;