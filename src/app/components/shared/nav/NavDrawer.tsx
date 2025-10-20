import React from "react";
import {
    makeStyles,
    tokens,
    Hamburger,
    NavDivider,
    NavDrawer as FluentNavDrawer,
    NavDrawerBody,
    NavDrawerHeader,
    Tooltip, DrawerProps,
} from "@fluentui/react-components";
import { NavSectionHeader } from "@/app/components/shared/nav/NavSectionHeader";
import { NavRenderer } from "@/app/components/shared/nav/NavRenderer";
import {NavRoutes} from "@/app/config/navRoutes";

const useStyles = makeStyles({
    root: {
        overflow: "hidden",
        display: "flex",
        height: "100%",
    },
    nav: {
        minWidth: "260px",
    },
    content: {
        flex: "1",
        padding: "16px",
        display: "grid",
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    field: {
        display: "flex",
        marginTop: "4px",
        marginLeft: "8px",
        flexDirection: "column",
        gridRowGap: tokens.spacingVerticalS,
    },
});

type DrawerType = Required<DrawerProps>["type"];
export default function NavDrawer() {
    const styles = useStyles();

    const [isOpen, setIsOpen] = React.useState(true);
    const [type] = React.useState<DrawerType>("inline");
    const [isMultiple] = React.useState(true);

    const sections = Object.values(NavRoutes);
    const defaultSelectedValue = NavRoutes.Administration.items[0].value;

    return (
        <div className={styles.root}>
            <FluentNavDrawer
                defaultSelectedValue={defaultSelectedValue}
                open={isOpen}
                type={type}
                multiple={isMultiple}
                className={styles.nav}
            >
                <NavDrawerHeader>
                    <Tooltip content="Close Navigation" relationship="label">
                        <Hamburger onClick={() => setIsOpen(!isOpen)} />
                    </Tooltip>
                </NavDrawerHeader>

                <NavDrawerBody>
                    {sections.map((section, index) => (
                        <React.Fragment key={section.labelKey || `section-${index}`}>
                            {section.labelKey && (
                                <NavSectionHeader labelKey={section.labelKey} />
                            )}
                            <NavRenderer items={section.items} />
                            {index < sections.length - 1 && <NavDivider />}
                        </React.Fragment>
                    ))}
                </NavDrawerBody>
            </FluentNavDrawer>
        </div>
    );
}