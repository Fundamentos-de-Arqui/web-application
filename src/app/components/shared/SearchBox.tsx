import { SearchBox as FluentSearchBox } from "@fluentui/react-search";
import {useI18n} from "@/app/providers/i18n";
import {useEffect} from "react";

interface SearchBoxProps {
    labelKey?: string;
    namespace: string;
    updateValueStateFunction: (value: string) => void;
}

export default function SearchBox({labelKey = "search-placeholder", namespace, updateValueStateFunction} : SearchBoxProps) {
    const i18n = useI18n();

    useEffect(() => {
        void i18n.loadChunk(namespace);
    }, [i18n.loadChunk]);
    
    return (
        <FluentSearchBox
            size="medium"
            placeholder={i18n.t(namespace, labelKey)}
            onChange={(_, newValue) => updateValueStateFunction(newValue.value ?? "")}
        />
    );
}
