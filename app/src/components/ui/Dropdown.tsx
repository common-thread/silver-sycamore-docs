"use client";

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import clsx from "clsx";

interface DropdownItem {
    label: string;
    href?: string;
    onClick?: () => void;
    disabled?: boolean;
    danger?: boolean;
    icon?: React.ReactNode;
}

interface DropdownProps {
    trigger: React.ReactNode;
    items: DropdownItem[][]; // Array of arrays for grouped items
    align?: "left" | "right";
    width?: string;
}

export default function Dropdown({
    trigger,
    items,
    align = "left",
    width = "w-56",
}: DropdownProps) {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button as={Fragment}>
                    {trigger}
                </Menu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items
                    className={clsx(
                        "absolute z-50 mt-2 origin-top-right divide-y divide-border rounded-lg bg-paper-white shadow-lg border border-border focus:outline-none",
                        width,
                        align === "right" ? "right-0" : "left-0"
                    )}
                >
                    {items.map((group, groupIndex) => (
                        <div key={groupIndex} className="p-1">
                            {group.map((item, itemIndex) => (
                                <Menu.Item key={itemIndex} disabled={item.disabled}>
                                    {({ active, disabled }) => {
                                        const classes = clsx(
                                            "group flex w-full items-center rounded-md px-3 py-2 text-sm transition-colors",
                                            active ? "bg-paper-warm text-ink" : "text-ink-mid",
                                            disabled && "opacity-50 cursor-not-allowed",
                                            item.danger && active ? "bg-error-bg text-error" : "",
                                            item.danger && !active ? "text-error" : ""
                                        );

                                        const content = (
                                            <>
                                                {item.icon && (
                                                    <span className="mr-2 h-4 w-4 opacity-70 group-hover:opacity-100">
                                                        {item.icon}
                                                    </span>
                                                )}
                                                {item.label}
                                            </>
                                        );

                                        if (item.href) {
                                            return (
                                                <Link href={item.href} className={classes}>
                                                    {content}
                                                </Link>
                                            );
                                        }

                                        return (
                                            <button
                                                type="button"
                                                onClick={item.onClick}
                                                disabled={disabled}
                                                className={classes}
                                            >
                                                {content}
                                            </button>
                                        );
                                    }}
                                </Menu.Item>
                            ))}
                        </div>
                    ))}
                </Menu.Items>
            </Transition>
        </Menu>
    );
}
