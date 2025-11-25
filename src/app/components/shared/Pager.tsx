import {Button, makeStyles, shorthands} from "@fluentui/react-components";

const useStyles = makeStyles({
    container: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: "16px",
    },

    buttonEnabled: {
        backgroundColor: "rgb(15, 108, 189)",
        color: "white",
        borderBottomColor: "rgba(0, 0, 0, 0)",
        borderRadius: "4px",
        ":hover": {
            backgroundColor: "rgb(12, 92, 160)",
        },
    },

    buttonDisabled: {
        backgroundColor: "lightgray",
        color: "gray",
    },
});

interface PagerProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pager({ currentPage, totalPages, onPageChange }: PagerProps) {
    const styles = useStyles();

    return (
        <div className={styles.container}>
            <Button
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
                className={
                    currentPage <= 1 ? styles.buttonDisabled : styles.buttonEnabled
                }
            >
                Anterior
            </Button>
            <span>Página {currentPage} de {totalPages}</span>
            <Button
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className={
                    currentPage >= totalPages ? styles.buttonDisabled : styles.buttonEnabled
                }
            >
                Siguiente
            </Button>
        </div>
    );
}