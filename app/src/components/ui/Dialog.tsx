"use client";

import { Fragment } from "react";
import { Dialog as HeadlessDialog, Transition } from "@headlessui/react";
import Button from "@/components/ui/Button";

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
}

export default function Dialog({
    isOpen,
    onClose,
    title,
    description,
    children,
    footer,
    size = "md",
}: DialogProps) {
    const maxWidthClass = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-2xl",
    }[size];

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <HeadlessDialog as="div" className="relative z-[400]" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-ink/20 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <HeadlessDialog.Panel
                                className={`w-full ${maxWidthClass} transform overflow-hidden rounded-xl bg-paper-white p-6 text-left align-middle shadow-xl transition-all border border-border`}
                            >
                                <HeadlessDialog.Title
                                    as="h3"
                                    className="font-display text-xl font-bold leading-6 text-ink mb-2"
                                >
                                    {title}
                                </HeadlessDialog.Title>

                                {description && (
                                    <div className="mt-1 mb-4">
                                        <p className="text-sm text-ink-muted">
                                            {description}
                                        </p>
                                    </div>
                                )}

                                <div className="mt-4 text-ink text-sm">
                                    {children}
                                </div>

                                {footer && (
                                    <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-border-subtle">
                                        {footer}
                                    </div>
                                )}
                            </HeadlessDialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </HeadlessDialog>
        </Transition>
    );
}
