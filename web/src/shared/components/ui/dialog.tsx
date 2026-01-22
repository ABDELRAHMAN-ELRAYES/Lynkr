"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => onOpenChange(false)}
            />
            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    {children}
                </div>
            </div>
        </div>
    );
}

interface DialogContentProps {
    className?: string;
    children: React.ReactNode;
}

export function DialogContent({ className, children }: DialogContentProps) {
    return (
        <div
            className={cn(
                "relative z-50 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl",
                className
            )}
            onClick={(e) => e.stopPropagation()}
        >
            {children}
        </div>
    );
}

interface DialogHeaderProps {
    className?: string;
    children: React.ReactNode;
}

export function DialogHeader({ className, children }: DialogHeaderProps) {
    return (
        <div className={cn("mb-4 space-y-1.5", className)}>
            {children}
        </div>
    );
}

interface DialogTitleProps {
    className?: string;
    children: React.ReactNode;
}

export function DialogTitle({ className, children }: DialogTitleProps) {
    return (
        <h2 className={cn("text-lg font-semibold text-slate-900", className)}>
            {children}
        </h2>
    );
}

interface DialogDescriptionProps {
    className?: string;
    children: React.ReactNode;
}

export function DialogDescription({ className, children }: DialogDescriptionProps) {
    return (
        <p className={cn("text-sm text-slate-500", className)}>
            {children}
        </p>
    );
}

interface DialogFooterProps {
    className?: string;
    children: React.ReactNode;
}

export function DialogFooter({ className, children }: DialogFooterProps) {
    return (
        <div className={cn("mt-6 flex justify-end gap-3", className)}>
            {children}
        </div>
    );
}

interface DialogCloseProps {
    className?: string;
    onClick?: () => void;
}

export function DialogClose({ className, onClick }: DialogCloseProps) {
    return (
        <button
            className={cn(
                "absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600",
                className
            )}
            onClick={onClick}
        >
            <X className="h-4 w-4" />
        </button>
    );
}
