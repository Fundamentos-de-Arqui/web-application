import {Title1} from "@fluentui/react-text";
import {useI18n} from "@/app/providers/i18n";
import {useEffect} from "react";

const HEADER_LABEL = "page-header"

interface PageHeaderProps {
    namespace: string
}

export function PageHeader({namespace}: PageHeaderProps) {
    const i18n = useI18n();

    useEffect(() => {
        void i18n.loadChunk(namespace);
    }, [i18n.loadChunk]);

    return (
        <div className={"page-header"}>
            <Title1>{i18n.t(namespace, HEADER_LABEL)}</Title1>
        </div>
    );
}