import { Head, router } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import SidebarAuthenticated from "@/Layouts/SidebarAuthenticated";
import { User } from "@/types/UserType";
import { Stages } from "@/types/StagesType";
import { Status } from "@/types/StatusType";
import { Letter } from "@/types/LetterType";
import { Role } from "@/types/RoleType";
import { useToast } from "@/hooks/use-toast";
import {
    CheckCircle,
    XCircle,
    ArrowRight,
    ArrowDown,
    Edit,
    Trash2,
    Plus,
} from "lucide-react";

type updateDataType = {
    id: number;
    to_stage_id: number;
    rejected_id: number;
};

export default function Index({
    data,
    statuses,
    letter,
    role,
}: {
    data: Stages[];
    statuses: Status[];
    letter: Letter[];
    role: Role[];
}) {
    console.log(data);
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        stage_name: "",
        sequence: "",
        to_stage_id: "",
        rejected_id: "",
        letter_id: "",
        approver_id: "",
        status_id: "",
    });
    const [updateData, setUpdateData] = useState<updateDataType[]>();
    const [editingStage, setEditingStage] = useState<number | null>(null);
    const { user } = usePage().props.auth as { user: User };

    // Function to sort stages by approval flow
    const sortStagesByFlow = (stages: any[]) => {
        const stageMap = new Map();
        const visited = new Set();
        const result: any[] = [];

        // Create a map for quick lookup
        stages.forEach((stage) => {
            stageMap.set(stage.id, stage);
        });

        // Find starting stages (sequence = 1 or not referenced as to_stage_id by others)
        const referencedIds = new Set(
            stages
                .map((s) => s.request_approved?.id)
                .filter((id) => id !== undefined && id !== -1)
        );

        const startingStages = stages.filter(
            (stage) => stage.sequence === 1 || !referencedIds.has(stage.id)
        );

        // Function to traverse the flow chain
        const traverseFlow = (
            stageId: number,
            path: Set<number> = new Set()
        ) => {
            if (
                !stageId ||
                stageId === -1 ||
                visited.has(stageId) ||
                path.has(stageId)
            ) {
                return; // Avoid infinite loops
            }

            const stage = stageMap.get(stageId);
            if (!stage) return;

            visited.add(stageId);
            path.add(stageId);
            result.push(stage);

            // Follow the approval path
            const nextStageId = stage.request_approved?.id;
            if (nextStageId && nextStageId !== -1) {
                traverseFlow(nextStageId, new Set(path));
            }
        };

        // Start traversal from each starting stage
        startingStages.forEach((stage) => {
            if (!visited.has(stage.id)) {
                traverseFlow(stage.id);
            }
        });

        // Add any remaining stages that weren't part of the main flow
        stages.forEach((stage) => {
            if (!visited.has(stage.id)) {
                result.push(stage);
            }
        });

        return result;
    };

    // Sort stages by flow
    const flowOrderedStages = sortStagesByFlow(data);

    const handleSubmit = () => {
        console.log(formData);
        router.post(
            "/admin/manajemen-tahapan-surat?intent=stages.create",
            formData,
            {
                onSuccess: () => {
                    toast({
                        className: "bg-green-500 text-white",
                        title: "Berhasil !",
                        description: "Tahapan berhasil dibuat",
                    });
                },
                onError: (errors) => {
                    toast({
                        title: "Terjadi Kesalahan !",
                        description: errors.message,
                    });
                },
            }
        );
    };

    const handleEdit = (id: number) => {
        console.log(formData);
        router.put("/admin/manajemen-tahapan-surat/" + id, formData, {
            onSuccess: () => {
                toast({
                    className: "bg-green-500 text-white",
                    title: "Berhasil !",
                    description: "Tahapan berhasil diedit",
                });
                setEditingStage(null);
            },
            onError: (errors) => {
                toast({
                    title: "Terjadi Kesalahan !",
                    description: errors.message,
                });
            },
        });
    };

    function deleteStages(id: number) {
        router.delete("/admin/manajemen-tahapan-surat/" + id, {
            onSuccess: () => {
                toast({
                    className: "bg-green-500 text-white",
                    title: "Berhasil !",
                    description: "Tahapan berhasil dihapus",
                });
            },
            onError: (errors) => {
                toast({
                    title: "Terjadi Kesalahan !",
                    description: errors.message,
                });
            },
        });
    }

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdate = ({
        id,
        field,
        value,
    }: {
        id: number;
        field: "to_stage_id" | "rejected_id";
        value: number;
    }) => {
        setUpdateData((prevData) => {
            if (!prevData) {
                return [
                    {
                        id: id,
                        to_stage_id: field === "to_stage_id" ? value : -2,
                        rejected_id: field === "rejected_id" ? value : -2,
                    },
                ];
            }

            const index = prevData.findIndex((item) => item.id === id);

            if (index !== -1) {
                const updatedData = [...prevData];
                updatedData[index] = {
                    ...updatedData[index],
                    [field]: value,
                };
                return updatedData;
            } else {
                return [
                    ...prevData,
                    {
                        id: id,
                        to_stage_id: field === "to_stage_id" ? value : -1,
                        rejected_id: field === "rejected_id" ? value : -1,
                    },
                ];
            }
        });
    };

    const sendUpdate = () => {
        console.log(updateData);
        router.post(
            "/admin/manajemen-tahapan-surat?intent=stages.update",
            {
                data: updateData,
            },
            {
                onSuccess: () => {
                    toast({
                        className: "bg-green-500 text-white",
                        title: "Berhasil !",
                        description: "Tahapan berhasil diubah",
                    });
                },
                onError: (errors) => {
                    toast({
                        title: "Terjadi Kesalahan !",
                        description: errors.message,
                    });
                },
            }
        );
    };

    const getStageById = (id: number) => {
        return data.find((stage) => stage.id === id);
    };

    const populateEditForm = (stage: any) => {
        setFormData({
            stage_name: stage.stage_name,
            sequence: stage.sequence.toString(),
            to_stage_id: stage.request_approved?.id?.toString() || "",
            rejected_id: stage.request_rejected?.id?.toString() || "",
            letter_id: stage.letter_type?.id?.toString() || "",
            approver_id: stage.approver?.id?.toString() || "",
            status_id: stage.status?.id?.toString() || "",
        });
        setEditingStage(stage.id);
    };

    useEffect(() => {
        console.log(updateData);
    }, [updateData]);

    return (
        <SidebarAuthenticated>
            <Head title="Manajemen Tahapan Surat" />
            <div className="w-full p-10 ">
                <Breadcrumb className="mb-6">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="">Manajemen</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>
                                Manajemen Tahapan Surat
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-2xl font-bold">Tahapan</h1>

                <div className="font-medium text-sm flex w-full justify-end gap-3">
                    <AlertDialog>
                        <AlertDialogTrigger
                            className={`bg-blue-500 p-2 mt-2 text-white rounded-lg flex items-center gap-2 ${
                                user.role_id == 2 ? "hidden" : ""
                            }`}
                        >
                            <Plus size={16} />
                            Buat Tahapan Baru
                        </AlertDialogTrigger>
                        <AlertDialogContent className="w-[300rem]">
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    {editingStage
                                        ? "Edit Tahapan"
                                        : "Buat Tahapan Baru"}
                                </AlertDialogTitle>
                                <div className="">
                                    <label
                                        htmlFor="stage_name"
                                        className="block mb-2"
                                    >
                                        Stage Name
                                    </label>
                                    <input
                                        value={formData.stage_name}
                                        onChange={handleChange}
                                        type="text"
                                        name="stage_name"
                                        className="w-full p-2 border rounded-lg"
                                    />
                                    <label
                                        htmlFor="sequence"
                                        className="block mb-2"
                                    >
                                        Sequence
                                    </label>
                                    <select
                                        name="sequence"
                                        value={formData.sequence}
                                        className="w-full p-2 border rounded-lg"
                                        onChange={handleChange}
                                    >
                                        <option>Pilih Opsi</option>
                                        <option value={1}>First</option>
                                        <option value={0}>Not First</option>
                                    </select>
                                    <label
                                        htmlFor="letter_id"
                                        className="block mb-2"
                                    >
                                        Letter Type
                                    </label>
                                    <select
                                        name="letter_id"
                                        value={formData.letter_id}
                                        className="w-full p-2 border rounded-lg"
                                        onChange={handleChange}
                                    >
                                        <option>Pilih Opsi</option>
                                        {letter.map((stage: any) => (
                                            <option
                                                key={stage.id}
                                                value={stage.id}
                                            >
                                                {stage.letter_name}
                                            </option>
                                        ))}
                                    </select>
                                    <label
                                        htmlFor="approver_id"
                                        className="block mb-2"
                                    >
                                        Approver
                                    </label>
                                    <select
                                        name="approver_id"
                                        value={formData.approver_id}
                                        className="w-full p-2 border rounded-lg"
                                        onChange={handleChange}
                                    >
                                        <option>Pilih Opsi</option>
                                        {role.map((stage: any) => (
                                            <option
                                                key={stage.id}
                                                value={stage.id}
                                            >
                                                {stage.role_name}
                                            </option>
                                        ))}
                                    </select>
                                    <label
                                        htmlFor="to_stage_id"
                                        className="block mb-2"
                                    >
                                        To Stage ID
                                    </label>
                                    <select
                                        name="to_stage_id"
                                        value={formData.to_stage_id}
                                        className="w-full p-2 border rounded-lg"
                                        onChange={handleChange}
                                    >
                                        <option value={-1}>Pilih Opsi</option>
                                        {data.map((stage: any) => (
                                            <option
                                                key={stage.id}
                                                value={stage.id}
                                            >
                                                {stage.stage_name}
                                            </option>
                                        ))}
                                    </select>
                                    <label
                                        htmlFor="rejected_id"
                                        className="block mb-2"
                                    >
                                        Rejected ID
                                    </label>
                                    <select
                                        name="rejected_id"
                                        value={formData.rejected_id}
                                        className="w-full p-2 border rounded-lg"
                                        onChange={handleChange}
                                    >
                                        <option value={-1}>Pilih Opsi</option>
                                        {data.map((stage: any) => (
                                            <option
                                                key={stage.id}
                                                value={stage.id}
                                            >
                                                {stage.stage_name}
                                            </option>
                                        ))}
                                    </select>
                                    <label
                                        htmlFor="status_id"
                                        className="block mb-2"
                                    >
                                        Status
                                    </label>
                                    <select
                                        name="status_id"
                                        value={formData.status_id}
                                        className="w-full p-2 border rounded-lg"
                                        onChange={handleChange}
                                    >
                                        <option>Pilih Opsi</option>
                                        {statuses.map((status: any) => (
                                            <option
                                                key={status.id}
                                                value={status.id}
                                            >
                                                {status.status_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel
                                    onClick={() => {
                                        setEditingStage(null);
                                        setFormData({
                                            stage_name: "",
                                            sequence: "",
                                            to_stage_id: "",
                                            rejected_id: "",
                                            letter_id: "",
                                            approver_id: "",
                                            status_id: "",
                                        });
                                    }}
                                >
                                    Kembali
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-green-500"
                                    onClick={() =>
                                        editingStage
                                            ? handleEdit(editingStage)
                                            : handleSubmit()
                                    }
                                >
                                    {editingStage
                                        ? "Update Tahapan"
                                        : "Buat Tahapan"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <button
                        onClick={sendUpdate}
                        disabled={updateData ? false : true}
                        className={`bg-green-500 p-2 mt-2 text-white rounded-lg disabled:cursor-not-allowed disabled:bg-gray-400`}
                    >
                        {updateData
                            ? "Simpan Perubahan"
                            : "Belum ada perubahan"}
                    </button>
                </div>

                {/* Flow-Based Timeline View */}
                <div className="mt-8">
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-2">
                            Flow Timeline
                        </h3>
                        <p className="text-sm text-blue-600">
                            Stages are ordered by approval flow. Each stage
                            shows where documents go when approved or rejected.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {flowOrderedStages.map((stage: any, index: number) => {
                            const isStartingStage = stage.sequence === 1;
                            const hasNextStage =
                                stage.request_approved?.id &&
                                stage.request_approved.id !== -1;
                            const nextStage = hasNextStage
                                ? getStageById(stage.request_approved.id)
                                : null;

                            return (
                                <div key={stage.id} className="relative">
                                    {/* Timeline Line to Next Stage */}
                                    {hasNextStage && (
                                        <div className="absolute left-6 top-16 w-0.5 h-20 bg-gradient-to-b from-green-400 to-green-600"></div>
                                    )}

                                    {/* Flow Connection Indicator */}
                                    {index > 0 && (
                                        <div className="absolute -top-4 left-6 transform -translate-x-1/2">
                                            <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                                ↓ Flow
                                            </div>
                                        </div>
                                    )}

                                    {/* Stage Card */}
                                    <div className="flex items-start space-x-4">
                                        {/* Timeline Dot */}
                                        <div
                                            className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
                                                isStartingStage
                                                    ? "bg-gradient-to-br from-green-400 to-green-600"
                                                    : hasNextStage
                                                    ? "bg-gradient-to-br from-blue-400 to-blue-600"
                                                    : "bg-gradient-to-br from-gray-400 to-gray-600"
                                            }`}
                                        >
                                            {index + 1}
                                        </div>

                                        {/* Stage Content */}
                                        <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            {stage.stage_name}
                                                        </h3>
                                                        {isStartingStage && (
                                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                                                START
                                                            </span>
                                                        )}
                                                        {!hasNextStage && (
                                                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                                                                END
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                                                        <p>
                                                            <span className="font-medium">
                                                                Type:
                                                            </span>{" "}
                                                            {
                                                                stage
                                                                    .letter_type
                                                                    ?.letter_name
                                                            }
                                                        </p>
                                                        <p>
                                                            <span className="font-medium">
                                                                Approver:
                                                            </span>{" "}
                                                            {
                                                                stage.approver
                                                                    ?.role_name
                                                            }
                                                        </p>
                                                        <p>
                                                            <span className="font-medium">
                                                                Status:
                                                            </span>
                                                            <span
                                                                className={`ml-2 px-2 py-1 rounded-full text-xs ${
                                                                    stage.status
                                                                        ?.status_name ===
                                                                    "Active"
                                                                        ? "bg-green-100 text-green-800"
                                                                        : "bg-gray-100 text-gray-800"
                                                                }`}
                                                            >
                                                                {
                                                                    stage.status
                                                                        ?.status_name
                                                                }
                                                            </span>
                                                        </p>
                                                        <p>
                                                            <span className="font-medium">
                                                                Position in
                                                                Flow:
                                                            </span>
                                                            <span className="ml-1">
                                                                {isStartingStage
                                                                    ? "First Stage"
                                                                    : `Step ${
                                                                          index +
                                                                          1
                                                                      }`}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div
                                                    className={`flex gap-2 ${
                                                        user.role_id == 2
                                                            ? "hidden"
                                                            : ""
                                                    }`}
                                                >
                                                    <AlertDialog>
                                                        <AlertDialogTrigger
                                                            onClick={() =>
                                                                populateEditForm(
                                                                    stage
                                                                )
                                                            }
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        >
                                                            <Edit size={16} />
                                                        </AlertDialogTrigger>
                                                    </AlertDialog>
                                                    <button
                                                        onClick={() =>
                                                            deleteStages(
                                                                stage.id
                                                            )
                                                        }
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Flow Controls */}
                                            <div className="grid md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                                                {/* Approved Path */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                                                        <CheckCircle
                                                            size={16}
                                                        />
                                                        If Approved:
                                                    </div>
                                                    <select
                                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                        onChange={(e) =>
                                                            handleUpdate({
                                                                id: stage.id,
                                                                field: "to_stage_id",
                                                                value: parseInt(
                                                                    e.target
                                                                        .value
                                                                ),
                                                            })
                                                        }
                                                        defaultValue={
                                                            stage
                                                                .request_approved
                                                                ?.id || -1
                                                        }
                                                    >
                                                        <option value={-1}>
                                                            🏁 End Process
                                                        </option>
                                                        {data
                                                            .filter(
                                                                (s) =>
                                                                    s.id !==
                                                                    stage.id
                                                            )
                                                            .map(
                                                                (
                                                                    nextStage: any
                                                                ) => (
                                                                    <option
                                                                        key={
                                                                            nextStage.id
                                                                        }
                                                                        value={
                                                                            nextStage.id
                                                                        }
                                                                    >
                                                                        ➡️{" "}
                                                                        {
                                                                            nextStage.stage_name
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                    </select>
                                                    {stage.request_approved &&
                                                        stage.request_approved
                                                            .id !== -1 && (
                                                            <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 p-2 rounded border border-green-200">
                                                                <ArrowRight
                                                                    size={12}
                                                                />
                                                                <span className="font-medium">
                                                                    Next:
                                                                </span>{" "}
                                                                {
                                                                    stage
                                                                        .request_approved
                                                                        .stage_name
                                                                }
                                                            </div>
                                                        )}
                                                    {(!stage.request_approved ||
                                                        stage.request_approved
                                                            .id === -1) && (
                                                        <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-200">
                                                            <CheckCircle
                                                                size={12}
                                                            />
                                                            <span className="font-medium">
                                                                Process ends
                                                                here
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Rejected Path */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-sm font-medium text-red-700">
                                                        <XCircle size={16} />
                                                        If Rejected:
                                                    </div>
                                                    <select
                                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                                        onChange={(e) =>
                                                            handleUpdate({
                                                                id: stage.id,
                                                                field: "rejected_id",
                                                                value: parseInt(
                                                                    e.target
                                                                        .value
                                                                ),
                                                            })
                                                        }
                                                        defaultValue={
                                                            stage
                                                                .request_rejected
                                                                ?.id || -1
                                                        }
                                                    >
                                                        <option value={-1}>
                                                            ❌ End Process
                                                        </option>
                                                        {data
                                                            .filter(
                                                                (s) =>
                                                                    s.id !==
                                                                    stage.id
                                                            )
                                                            .map(
                                                                (
                                                                    nextStage: any
                                                                ) => (
                                                                    <option
                                                                        key={
                                                                            nextStage.id
                                                                        }
                                                                        value={
                                                                            nextStage.id
                                                                        }
                                                                    >
                                                                        ↩️{" "}
                                                                        {
                                                                            nextStage.stage_name
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                    </select>
                                                    {stage.request_rejected &&
                                                        stage.request_rejected
                                                            .id !== -1 && (
                                                            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                                                                <ArrowDown
                                                                    size={12}
                                                                />
                                                                <span className="font-medium">
                                                                    Returns to:
                                                                </span>{" "}
                                                                {
                                                                    stage
                                                                        .request_rejected
                                                                        .stage_name
                                                                }
                                                            </div>
                                                        )}
                                                    {(!stage.request_rejected ||
                                                        stage.request_rejected
                                                            .id === -1) && (
                                                        <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-200">
                                                            <XCircle
                                                                size={12}
                                                            />
                                                            <span className="font-medium">
                                                                Process ends
                                                                here
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* End of Process Indicator */}
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-lg">
                                <CheckCircle className="text-white" size={20} />
                            </div>
                            <div className="flex-1 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-green-800">
                                    ✅ Process Complete
                                </h3>
                                <p className="text-sm text-green-700">
                                    Document has successfully completed all
                                    approval stages
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarAuthenticated>
    );
}
