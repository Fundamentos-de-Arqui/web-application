"use client";

import Link from "next/link";
import { Button } from "@fluentui/react-components";
import { OpenRegular } from "@fluentui/react-icons";
import { useEffect, useMemo } from "react";
import {useI18n} from "@/app/providers/i18n";
import { usePathname } from "next/navigation";

const OPEN_DETAIL_LABEL = "open-detail"

interface OpenFileButtonProps {
    namespace: string;
    id: string;
}

export function OpenFileButton({ namespace, id }: OpenFileButtonProps) {
    const i18n = useI18n();
    useEffect(() => {
        void i18n.loadChunk(namespace);
    }, [i18n, namespace]);

    const pathname = usePathname();
    const href = useMemo(() => `${pathname}/${id}`, [pathname, id]);

    return (
        <Link href={href}>
            <Button icon={<OpenRegular />} appearance="primary">
                {i18n.t(namespace, OPEN_DETAIL_LABEL)}
            </Button>
        </Link>
    );
}