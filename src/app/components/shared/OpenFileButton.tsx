"use client";

import Link from "next/link";
import { Button } from "@fluentui/react-components";
import { OpenRegular } from "@fluentui/react-icons";
import { useMemo } from "react";
import { usePathname } from "next/navigation";


interface OpenFileButtonProps {
    id: string;
}

export function OpenFileButton({ id }: OpenFileButtonProps) {

    const pathname = usePathname();
    const href = useMemo(() => `${pathname}/${id}`, [pathname, id]);

    return (
        <Link href={href}>
            <Button icon={<OpenRegular />} appearance="primary">Ver detalle</Button>
        </Link>
    );
}