
import { notFound } from "next/navigation";

const MOCK_DATA: Record<string, { name: string; dni: string }> = {
    "1": { name: "Juan Pérez", dni: "12345678" },
    "2": { name: "María López", dni: "87654321" },
};

interface Props {
    params: { id: string };
}

const USE_MOCK = true;

export default async function FiliationFilePage({ params }: Props) {
    const { id } = params;

    let data: { name: string; dni: string } | null = null;

    data = MOCK_DATA[id] ?? null;

    if (!data) notFound();

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold">Ficha de filiación #{id}</h1>
            <p className="text-gray-600 mt-2">Nombre del paciente: {data.name}</p>
            <p className="text-gray-600">DNI: {data.dni}</p>
        </main>
    );
}
