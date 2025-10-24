import { 
    ArrowExit20Filled, ArrowExit20Regular,
    ArrowTrendingLines20Filled, ArrowTrendingLines20Regular,
    Board20Filled, Board20Regular,
    CalendarDate20Filled, CalendarDate20Regular,
    CalendarLtr20Filled, CalendarLtr20Regular,
    Guardian20Filled, Guardian20Regular,
    PersonBriefcase20Filled, PersonBriefcase20Regular,
    PersonNote20Filled, PersonNote20Regular,
    Settings20Filled, Settings20Regular
} from "@fluentui/react-icons";
import { NavItemProps } from "@/app/components/shared/nav/NavItem";
import { NavCategoryProps } from "@/app/components/shared/nav/NavCategory";
import { NavCategoryItemProps } from "@/app/components/shared/nav/NavCategoryItem";
import { NavCategorySubItemProps } from "@/app/components/shared/nav/NavSubItem";

const Administration = "administration"
const Dashboard : NavItemProps = { 
    href: "/dashboard",
    labelKey: "dashboard",
    iconDefault: Board20Regular,
    iconSelected: Board20Filled,
    value: "01-00"
}
const Analytics : NavItemProps = { 
    href: "/analytics",
    labelKey: "analytics",
    iconDefault: ArrowTrendingLines20Regular,
    iconSelected: ArrowTrendingLines20Filled,
    value: "02-00"
}
const Holidays : NavItemProps = { 
    href: "/holidays",
    labelKey: "holidays",
    iconDefault: CalendarDate20Regular,
    iconSelected: CalendarDate20Filled,
    value: "03-00"
}
const Sessions : NavCategoryItemProps = { 
    labelKey: "therapy",
    iconDefault: CalendarLtr20Regular,
    iconSelected: CalendarLtr20Filled,
    value: "04-00"
}
const TherapyPlans : NavCategorySubItemProps = { 
    href: "/therapy/planning",
    labelKey: "planning",
    value: "04-01"
}
const Calendar : NavCategorySubItemProps = { 
    href: "/therapy/sessions-calendar",
    labelKey: "sessions-calendar",
    value: "04-02"
}
const SessionsCategory: NavCategoryProps = { 
    ...Sessions,
    items: [TherapyPlans, Calendar],
};

const People = "people"
const Patients : NavCategoryItemProps = { 
    labelKey: "patients",
    iconDefault: PersonNote20Regular,
    iconSelected: PersonNote20Filled,
    value: "05-00"
}
const PatientsClinicalRecords: NavCategorySubItemProps = { 
    href: "/patients/filiation-files",
    labelKey: "filiation-files",
    value: "05-02",
};
const PatientsTariffs: NavCategorySubItemProps = { 
    href: "/patients/tariffs",
    labelKey: "tariffs",
    value: "05-03",
};
const PatientsCategory: NavCategoryProps = { 
    ...Patients,
    items: [PatientsClinicalRecords, PatientsTariffs],
};
const Therapists : NavCategoryItemProps = { 
    labelKey: "therapists",
    iconDefault: PersonBriefcase20Regular,
    iconSelected: PersonBriefcase20Filled,
    value: "06-00"
}
const TherapistsData: NavCategorySubItemProps = { 
    href: "/therapists/data",
    labelKey: "data",
    value: "06-01",
};
const TherapistsAccounts: NavCategorySubItemProps = { 
    href: "/therapists/accounts",
    labelKey: "accounts",
    value: "06-02",
};
const TherapistsCategory: NavCategoryProps = { 
    ...Therapists,
    items: [TherapistsData, TherapistsAccounts],
};
const LegalGuardians: NavCategoryItemProps = { 
    labelKey: "legal-guardians",
    iconDefault: Guardian20Regular,
    iconSelected: Guardian20Filled,
    value: "07-00",
};
const LegalGuardiansData: NavCategorySubItemProps = { 
    href: "/legal-guardians/data",
    labelKey: "data",
    value: "07-01",
};
const LegalGuardiansAccounts: NavCategorySubItemProps = { 
    href: "/legal-guardians/accounts",
    labelKey: "accounts",
    value: "07-02",
};
const LegalGuardiansCategory: NavCategoryProps = { 
    ...LegalGuardians,
    items: [LegalGuardiansData, LegalGuardiansAccounts],
};
const Settings: NavItemProps = { 
    href: "/settings",
    labelKey: "settings",
    iconDefault: Settings20Regular,
    iconSelected: Settings20Filled,
    value: "8-00",
};
const SignOut: NavItemProps = { 
    href: "/sign-out",
    labelKey: "sign-out",
    iconDefault: ArrowExit20Regular,
    iconSelected: ArrowExit20Filled,
    value: "9-00",
};

export interface NavRouteSection {
    labelKey?: string;
    items: (NavItemProps | NavCategoryProps)[];
}

type NavRoutesType = {
    Administration: NavRouteSection;
    People: NavRouteSection;
    Utility: NavRouteSection;
};

export const NavRoutes: NavRoutesType = {
    Administration: {
        labelKey: Administration,
        items: [
            Dashboard,
            Analytics,
            Holidays,
            SessionsCategory,
        ],
    },
    People: { 
        labelKey: People,
        items: [
            PatientsCategory,
            TherapistsCategory,
            LegalGuardiansCategory,
        ],
    },
    Utility: { 
        items: [
            Settings,
            SignOut,
        ],
    },
};
