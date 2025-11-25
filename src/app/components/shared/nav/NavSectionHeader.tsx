import {
    NavSectionHeader as FluentNavSectionHeader,
} from "@fluentui/react-components";

export type NavSectionHeaderProps = {
    label: string;
};

export const NavSectionHeader = ({ label }: NavSectionHeaderProps) => {
    return (
        <FluentNavSectionHeader>{label}</FluentNavSectionHeader>
    );
};