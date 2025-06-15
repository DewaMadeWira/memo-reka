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
    AlertTriangle,
    RefreshCw,
    FileText,
} from "lucide-react";

type updateDataType = {
    id: number;
    to_stage_id: number;
    rejected_id: number;
};

type FlowStage = {
    stage: any;
    isRejectedFlow: boolean;
    parentStageId?: number;
};

type StagesByLetterType = {
    [letterTypeName: string]: {
        letterType: any;
        stages: Stages[];
        flowOrderedStages: FlowStage[];
    };
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
        requires_rejection_reason: false,
        is_fixable: false,
        requires_file_upload: false,
        is_external: false,
        notify_internal_manager: false,
        notify_internal_user: false,
        notify_internal: false,
        notify_external: false,
        notify_external_manager: false,
        notify_external_user: false,
    });

    const [updateData, setUpdateData] = useState<updateDataType[]>();
    const [editingStage, setEditingStage] = useState<number | null>(null);
    const { user } = usePage().props.auth as { user: User };

    // Function to sort stages by approval flow and include rejected stages
    const sortStagesByFlow = (stages: any[]): FlowStage[] => {
        const stageMap = new Map();
        const result: FlowStage[] = [];

        // Create a map for quick lookup
        stages.forEach((stage) => {
            stageMap.set(stage.id, stage);
        });

        // Find the starting stage (sequence = 1)
        const startingStage = stages.find((stage) => stage.sequence === 1);

        if (!startingStage) {
            // If no starting stage, return all stages as regular stages
            return stages.map((stage) => ({
                stage: stage,
                isRejectedFlow: false,
            }));
        }

        // First, identify all stages that are part of the main approval flow
        const mainFlowStageIds = new Set();
        let currentStageId = startingStage.id;

        while (
            currentStageId &&
            currentStageId !== -1 &&
            !mainFlowStageIds.has(currentStageId)
        ) {
            const stage = stageMap.get(currentStageId);
            if (!stage) break;

            mainFlowStageIds.add(currentStageId);
            currentStageId = stage.request_approved?.id;
        }

        // Now build the flow with rejected stages inline
        const processedStages = new Set();
        currentStageId = startingStage.id;

        while (
            currentStageId &&
            currentStageId !== -1 &&
            !processedStages.has(currentStageId)
        ) {
            const stage = stageMap.get(currentStageId);
            if (!stage) break;

            processedStages.add(currentStageId);

            // Add the main stage
            result.push({
                stage: stage,
                isRejectedFlow: false,
            });

            // Check if this stage has a rejected path
            const rejectedStageId = stage.request_rejected?.id;
            if (rejectedStageId && rejectedStageId !== -1) {
                const rejectedStage = stageMap.get(rejectedStageId);

                // Only add rejected stage if:
                // 1. It exists
                // 2. It's not part of the main approval flow (to avoid duplication)
                // 3. We haven't already processed it as a rejected stage
                if (
                    rejectedStage &&
                    !mainFlowStageIds.has(rejectedStageId) &&
                    !processedStages.has(`rejected-${rejectedStageId}`)
                ) {
                    result.push({
                        stage: rejectedStage,
                        isRejectedFlow: true,
                        parentStageId: stage.id,
                    });

                    processedStages.add(`rejected-${rejectedStageId}`);
                }
            }

            // Move to next approved stage
            currentStageId = stage.request_approved?.id;
        }

        // Add any remaining stages that aren't part of the main flow or already added as rejected
        stages.forEach((stage) => {
            if (
                !processedStages.has(stage.id) &&
                !processedStages.has(`rejected-${stage.id}`)
            ) {
                result.push({
                    stage: stage,
                    isRejectedFlow: false,
                });
            }
        });

        return result;
    };

    // Group stages by letter type and sort each group's flow
    const groupStagesByLetterType = (stages: Stages[]): StagesByLetterType => {
        const grouped: StagesByLetterType = {};

        stages.forEach((stage) => {
            const letterTypeName =
                stage.letter_type?.letter_name || "Uncategorized";

            if (!grouped[letterTypeName]) {
                grouped[letterTypeName] = {
                    letterType: stage.letter_type,
                    stages: [],
                    flowOrderedStages: [],
                };
            }

            grouped[letterTypeName].stages.push(stage);
        });

        // Sort stages within each letter type group
        Object.keys(grouped).forEach((letterTypeName) => {
            grouped[letterTypeName].flowOrderedStages = sortStagesByFlow(
                grouped[letterTypeName].stages
            );
        });

        return grouped;
    };

    // Group stages by letter type
    const stagesByLetterType = groupStagesByLetterType(data);

    const handleSubmit = () => {
        console.log("before filter", formData);
        // Validate required fields
        const requiredFields = [
            { field: "stage_name", label: "Nama Tahapan" },
            { field: "sequence", label: "Urutan" },
            { field: "letter_id", label: "Tipe Surat" },
            { field: "approver_id", label: "Role Approver" },
            { field: "status_id", label: "Status" },
        ];

        // const emptyFields = requiredFields.filter(({ field }) => {
        //     const value = formData[field as keyof typeof formData];
        //     return !value || value === "" || value === "0";
        // });
        const emptyFields = requiredFields.filter(({ field }) => {
            const value = formData[field as keyof typeof formData];

            // Special handling for sequence field since 0 is a valid value
            if (field === "sequence") {
                return value === "" || value === undefined || value === null;
            }

            return !value || value === "" || value === "0";
        });

        if (emptyFields.length > 0) {
            const fieldNames = emptyFields.map(({ label }) => label).join(", ");
            toast({
                variant: "destructive",
                title: "Error Validasi!",
                description: `Harap isi field yang wajib diisi: ${fieldNames}`,
            });
            return;
        }

        console.log("after filter", formData);
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
                    resetForm();
                },
                onError: (errors) => {
                    toast({
                        variant: "destructive",
                        title: "Terjadi Kesalahan !",
                        description:
                            errors.message ||
                            "Terjadi kesalahan saat membuat tahapan",
                    });
                },
            }
        );
    };

    const handleEdit = (id: number) => {
        console.log("before edit", formData);
        // Validate required fields
        const requiredFields = [
            { field: "stage_name", label: "Nama Tahapan" },
            { field: "sequence", label: "Urutan" },
            { field: "letter_id", label: "Tipe Surat" },
            { field: "approver_id", label: "Role Approver" },
            { field: "status_id", label: "Status" },
        ];

        // const emptyFields = requiredFields.filter(({ field }) => {
        //     const value = formData[field as keyof typeof formData];
        //     return !value || value === "" || value === "0";
        // });
        const emptyFields = requiredFields.filter(({ field }) => {
            const value = formData[field as keyof typeof formData];

            // Special handling for sequence field since 0 is a valid value
            if (field === "sequence") {
                return value === "" || value === undefined || value === null;
            }

            return !value || value === "" || value === "0";
        });

        if (emptyFields.length > 0) {
            const fieldNames = emptyFields.map(({ label }) => label).join(", ");
            toast({
                variant: "destructive",
                title: "Error Validasi!",
                description: `Harap isi field yang wajib diisi: ${fieldNames}`,
            });
            return;
        }

        console.log(formData);
        router.put("/admin/manajemen-tahapan-surat/" + id, formData, {
            onSuccess: () => {
                toast({
                    className: "bg-green-500 text-white",
                    title: "Berhasil !",
                    description: "Tahapan berhasil diedit",
                });
                setEditingStage(null);
                resetForm();
            },
            onError: (errors) => {
                toast({
                    variant: "destructive",
                    title: "Terjadi Kesalahan !",
                    description:
                        errors.message ||
                        "Terjadi kesalahan saat mengupdate tahapan",
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
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? (e.target as HTMLInputElement).checked
                    : value,
        }));
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
                    setUpdateData(undefined);
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
            stage_name: stage.stage_name || "",
            sequence: stage.sequence || "",
            to_stage_id: stage.to_stage_id || "",
            rejected_id: stage.rejected_id || "",
            letter_id: stage.letter_id || "",
            approver_id: stage.approver_id || "",
            status_id: stage.status_id || "",
            requires_rejection_reason: stage.requires_rejection_reason || false,
            is_fixable: stage.is_fixable || false,
            requires_file_upload: stage.requires_file_upload || false,
            is_external: stage.is_external || false,
            notify_internal_manager: stage.notify_internal_manager || false,
            notify_internal_user: stage.notify_internal_user || false,
            notify_internal: stage.notify_internal || false,
            notify_external: stage.notify_external || false,
            notify_external_manager: stage.notify_external_manager || false,
            notify_external_user: stage.notify_external_user || false,
        });
    };

    const resetForm = () => {
        setFormData({
            stage_name: "",
            sequence: "",
            to_stage_id: "",
            rejected_id: "",
            letter_id: "",
            approver_id: "",
            status_id: "",
            requires_rejection_reason: false,
            is_fixable: false,
            requires_file_upload: false,
            is_external: false,
            notify_internal_manager: false,
            notify_internal_user: false,
            notify_internal: false,
            notify_external: false,
            notify_external_manager: false,
            notify_external_user: false,
        });
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
                            className={`bg-blue-500 p-2 mt-2 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors ${
                                user.role_id == 2 ? "hidden" : ""
                            }`}
                        >
                            <Plus size={16} />
                            Buat Tahapan Baru
                        </AlertDialogTrigger>
                        <AlertDialogContent className="w-[60rem] max-w-4xl max-h-[90vh] overflow-y-auto">
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    {editingStage
                                        ? "Edit Tahapan"
                                        : "Buat Tahapan Baru"}
                                </AlertDialogTitle>
                                <div className="grid gap-4">
                                    {/* Stage Name */}
                                    <div>
                                        <label
                                            htmlFor="stage_name"
                                            className="block mb-2 text-sm font-medium"
                                        >
                                            Stage Name *
                                        </label>
                                        <input
                                            value={formData.stage_name}
                                            type="text"
                                            name="stage_name"
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter stage name"
                                        />
                                    </div>

                                    {/* Sequence and Status */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label
                                                htmlFor="sequence"
                                                className="block mb-2 text-sm font-medium"
                                            >
                                                Sequence *
                                            </label>
                                            <select
                                                name="sequence"
                                                value={formData.sequence}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                onChange={handleChange}
                                            >
                                                <option value="">
                                                    Pilih Opsi
                                                </option>
                                                <option value={1}>
                                                    First Stage
                                                </option>
                                                <option value={0}>
                                                    Regular Stage
                                                </option>
                                            </select>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="status_id"
                                                className="block mb-2 text-sm font-medium"
                                            >
                                                Status *
                                            </label>
                                            <select
                                                name="status_id"
                                                value={formData.status_id}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                onChange={handleChange}
                                            >
                                                <option value="">
                                                    Pilih Status
                                                </option>
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
                                    </div>

                                    {/* Letter Type and Approver */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label
                                                htmlFor="letter_id"
                                                className="block mb-2 text-sm font-medium"
                                            >
                                                Letter Type *
                                            </label>
                                            <select
                                                name="letter_id"
                                                value={formData.letter_id}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                onChange={handleChange}
                                            >
                                                <option value="">
                                                    Pilih Tipe Surat
                                                </option>
                                                {letter.map(
                                                    (letterType: any) => (
                                                        <option
                                                            key={letterType.id}
                                                            value={
                                                                letterType.id
                                                            }
                                                        >
                                                            {
                                                                letterType.letter_name
                                                            }
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="approver_id"
                                                className="block mb-2 text-sm font-medium"
                                            >
                                                Approver Role *
                                            </label>
                                            <select
                                                name="approver_id"
                                                value={formData.approver_id}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                onChange={handleChange}
                                            >
                                                <option value="">
                                                    Pilih Role
                                                </option>
                                                {role.map((roleItem: any) => (
                                                    <option
                                                        key={roleItem.id}
                                                        value={roleItem.id}
                                                    >
                                                        {roleItem.role_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Next Stages */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label
                                                htmlFor="to_stage_id"
                                                className="block mb-2 text-sm font-medium"
                                            >
                                                Next Stage (If Approved)
                                            </label>
                                            <select
                                                name="to_stage_id"
                                                value={formData.to_stage_id}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                onChange={handleChange}
                                            >
                                                <option value="-1">
                                                    ❌ Tahapan Akhir
                                                </option>
                                                {data.map((stage: any) => (
                                                    <option
                                                        key={stage.id}
                                                        value={stage.id}
                                                    >
                                                        ➡️ {stage.stage_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="rejected_id"
                                                className="block mb-2 text-sm font-medium"
                                            >
                                                Next Stage (If Rejected)
                                            </label>
                                            <select
                                                name="rejected_id"
                                                value={formData.rejected_id}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                                onChange={handleChange}
                                            >
                                                <option value="-1">
                                                    ❌ Tahapan Akhir
                                                </option>
                                                {data.map((stage: any) => (
                                                    <option
                                                        key={stage.id}
                                                        value={stage.id}
                                                    >
                                                        ↩️ {stage.stage_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Stage Configuration Options */}
                                    <div className="border-t pt-4">
                                        <h4 className="text-sm font-semibold mb-3 text-gray-700">
                                            Konfigurasi Tahapan
                                        </h4>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-3">
                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        name="requires_rejection_reason"
                                                        checked={
                                                            formData.requires_rejection_reason ||
                                                            false
                                                        }
                                                        onChange={handleChange}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm">
                                                        Butuh alasan penolakan
                                                    </span>
                                                </label>

                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        name="is_fixable"
                                                        checked={
                                                            formData.is_fixable ||
                                                            false
                                                        }
                                                        onChange={handleChange}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm">
                                                        Dapat diperbaiki
                                                    </span>
                                                </label>

                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        name="requires_file_upload"
                                                        checked={
                                                            formData.requires_file_upload ||
                                                            false
                                                        }
                                                        onChange={handleChange}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm">
                                                        Butuh upload file
                                                    </span>
                                                </label>

                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        name="is_external"
                                                        checked={
                                                            formData.is_external ||
                                                            false
                                                        }
                                                        onChange={handleChange}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm">
                                                        Tahapan eksternal
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notification Settings */}
                                    <div className="border-t pt-4">
                                        <h4 className="text-sm font-semibold mb-3 text-gray-700">
                                            Pengaturan Notifikasi
                                        </h4>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-3">
                                                <h5 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                                    Notifikasi Internal
                                                </h5>
                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        name="notify_internal"
                                                        checked={
                                                            formData.notify_internal ||
                                                            false
                                                        }
                                                        onChange={handleChange}
                                                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                    />
                                                    <span className="text-sm">
                                                        Notifikasi ke internal
                                                    </span>
                                                </label>

                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        name="notify_internal_manager"
                                                        checked={
                                                            formData.notify_internal_manager ||
                                                            false
                                                        }
                                                        onChange={handleChange}
                                                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                    />
                                                    <span className="text-sm">
                                                        Notifikasi ke manajer
                                                        internal
                                                    </span>
                                                </label>

                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        name="notify_internal_user"
                                                        checked={
                                                            formData.notify_internal_user ||
                                                            false
                                                        }
                                                        onChange={handleChange}
                                                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                    />
                                                    <span className="text-sm">
                                                        Notifikasi ke pengguna
                                                        internal
                                                    </span>
                                                </label>
                                            </div>

                                            <div className="space-y-3">
                                                <h5 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                                    Notifikasi Eksternal
                                                </h5>
                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        name="notify_external"
                                                        checked={
                                                            formData.notify_external ||
                                                            false
                                                        }
                                                        onChange={handleChange}
                                                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                                    />
                                                    <span className="text-sm">
                                                        Notifikasi ke eksternal
                                                    </span>
                                                </label>

                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        name="notify_external_manager"
                                                        checked={
                                                            formData.notify_external_manager ||
                                                            false
                                                        }
                                                        onChange={handleChange}
                                                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                                    />
                                                    <span className="text-sm">
                                                        Notifikasi ke manajer
                                                        eksternal
                                                    </span>
                                                </label>

                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        name="notify_external_user"
                                                        checked={
                                                            formData.notify_external_user ||
                                                            false
                                                        }
                                                        onChange={handleChange}
                                                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                                    />
                                                    <span className="text-sm">
                                                        Notifikasi ke pengguna
                                                        eksternal
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={resetForm}>
                                    Batal
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-green-500 hover:bg-green-600"
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
                        disabled={!updateData || updateData.length === 0}
                        className={`p-2 mt-2 text-white rounded-lg transition-colors flex items-center gap-2 ${
                            updateData && updateData.length > 0
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-gray-400 cursor-not-allowed"
                        }`}
                    >
                        <RefreshCw size={16} />
                        {updateData && updateData.length > 0
                            ? `Simpan Perubahan (${updateData.length})`
                            : "Belum ada perubahan"}
                    </button>
                </div>

                {/* Flow-Based Timeline View Grouped by Letter Type */}
                <div className="mt-8">
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                            <FileText className="text-blue-600" size={20} />
                            Alur Tahapan Berdasarkan Tipe Surat
                        </h3>
                        <p className="text-sm text-blue-600">
                            Tampilan menunjukkan tahapan dari setiap tipe surat
                            dimana warna
                            <span className="inline-block mx-2 px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                                Hijau
                            </span>
                            menunjukkan alur persetujuan dan warna
                            <span className="inline-block mx-2 px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium">
                                Orange
                            </span>
                            menunjukkan alur penolakan.
                        </p>
                    </div>

                    {/* Display stages grouped by letter type */}
                    <div className="space-y-12">
                        {Object.entries(stagesByLetterType).map(
                            ([letterTypeName, letterTypeData]) => (
                                <div
                                    key={letterTypeName}
                                    className="bg-white rounded-lg border border-gray-200 shadow-sm"
                                >
                                    {/* Letter Type Header */}
                                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-lg">
                                        <div className="flex items-center gap-3">
                                            <FileText size={24} />
                                            <div>
                                                <h2 className="text-xl font-bold">
                                                    {letterTypeName}
                                                </h2>
                                                <p className="text-blue-100 text-sm">
                                                    {
                                                        letterTypeData.stages
                                                            .length
                                                    }{" "}
                                                    tahapan dalam alur ini
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stages Flow for this Letter Type */}
                                    <div className="p-6">
                                        <div className="space-y-6">
                                            {letterTypeData.flowOrderedStages.map(
                                                (
                                                    flowStage: FlowStage,
                                                    index: number
                                                ) => {
                                                    const {
                                                        stage,
                                                        isRejectedFlow,
                                                        parentStageId,
                                                    } = flowStage;
                                                    const isStartingStage =
                                                        stage.sequence === 1 &&
                                                        !isRejectedFlow;
                                                    const hasApprovedNextStage =
                                                        stage.request_approved
                                                            ?.id &&
                                                        stage.request_approved
                                                            .id !== -1;
                                                    const hasRejectedNextStage =
                                                        stage.request_rejected
                                                            ?.id &&
                                                        stage.request_rejected
                                                            .id !== -1;
                                                    const isEndStage =
                                                        !hasApprovedNextStage &&
                                                        !isRejectedFlow;

                                                    return (
                                                        <div
                                                            key={`${stage.id}-${
                                                                isRejectedFlow
                                                                    ? "rejected"
                                                                    : "approved"
                                                            }`}
                                                            className="relative"
                                                        >
                                                            {/* Timeline Line Logic */}
                                                            {!isRejectedFlow &&
                                                                (hasApprovedNextStage ||
                                                                    hasRejectedNextStage) && (
                                                                    <div className="absolute left-6 top-20 w-0.5 h-16 bg-gradient-to-b from-green-400 to-green-600"></div>
                                                                )}

                                                            {isRejectedFlow &&
                                                                (hasApprovedNextStage ||
                                                                    hasRejectedNextStage) && (
                                                                    <div className="absolute left-6 top-20 w-0.5 h-16 bg-gradient-to-b from-orange-400 to-orange-600"></div>
                                                                )}

                                                            {/* Stage Card */}
                                                            <div className="flex items-start space-x-4">
                                                                {/* Timeline Dot */}
                                                                <div
                                                                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold border-2 ${
                                                                        isRejectedFlow
                                                                            ? "bg-gradient-to-br bg-orange-400"
                                                                            : isStartingStage
                                                                            ? "bg-gradient-to-br bg-green-500"
                                                                            : isEndStage
                                                                            ? "bg-gradient-to-br bg-gray-500"
                                                                            : "bg-gradient-to-br bg-green-500"
                                                                    }`}
                                                                >
                                                                    {isRejectedFlow ? (
                                                                        <AlertTriangle
                                                                            size={
                                                                                18
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        index +
                                                                        1 -
                                                                        letterTypeData.flowOrderedStages
                                                                            .slice(
                                                                                0,
                                                                                index
                                                                            )
                                                                            .filter(
                                                                                (
                                                                                    fs
                                                                                ) =>
                                                                                    fs.isRejectedFlow
                                                                            )
                                                                            .length
                                                                    )}
                                                                </div>

                                                                {/* Stage Content */}
                                                                <div
                                                                    className={`flex-1 border rounded-lg shadow-sm hover:shadow-md transition-all p-6 ${
                                                                        isRejectedFlow
                                                                            ? "bg-orange-50 border-orange-200 hover:bg-orange-100"
                                                                            : "bg-white border-gray-200 hover:bg-gray-50"
                                                                    }`}
                                                                >
                                                                    <div className="flex justify-between items-start mb-4">
                                                                        <div className="flex-1">
                                                                            <div className="flex items-center gap-2 mb-3">
                                                                                <h3
                                                                                    className={`text-lg font-semibold ${
                                                                                        isRejectedFlow
                                                                                            ? "text-orange-900"
                                                                                            : "text-gray-900"
                                                                                    }`}
                                                                                >
                                                                                    {
                                                                                        stage.stage_name
                                                                                    }
                                                                                </h3>

                                                                                {isRejectedFlow && (
                                                                                    <span className="bg-orange-200 text-orange-800 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                                                                                        Tahapan
                                                                                        Ditolak
                                                                                    </span>
                                                                                )}

                                                                                {isStartingStage && (
                                                                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                                                                                        Awal
                                                                                        Tahapan
                                                                                    </span>
                                                                                )}

                                                                                {isEndStage && (
                                                                                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                                                                                        Tahapan
                                                                                        Akhir
                                                                                    </span>
                                                                                )}
                                                                            </div>

                                                                            <div
                                                                                className={`space-y-2 text-sm ${
                                                                                    isRejectedFlow
                                                                                        ? "text-orange-700"
                                                                                        : "text-gray-600"
                                                                                }`}
                                                                            >
                                                                                <div className="grid md:grid-cols-2 gap-4">
                                                                                    <div>
                                                                                        {/* <p>
                                                                                            <span className="font-medium">
                                                                                                Approver:
                                                                                            </span>{" "}
                                                                                            {stage
                                                                                                .approver
                                                                                                ?.role_name ||
                                                                                                "Not Set"}
                                                                                        </p> */}
                                                                                        <div className="mt-2">
                                                                                            <p>
                                                                                                <span className="font-medium">
                                                                                                    Status:
                                                                                                </span>
                                                                                                <span
                                                                                                    className={`ml-2 px-2 py-1 rounded-full text-xs ${
                                                                                                        stage
                                                                                                            .status
                                                                                                            ?.status_name ===
                                                                                                        "Active"
                                                                                                            ? isRejectedFlow
                                                                                                                ? "bg-orange-100 text-orange-800"
                                                                                                                : "bg-green-100 text-green-800"
                                                                                                            : "bg-gray-100 text-gray-800"
                                                                                                    }`}
                                                                                                >
                                                                                                    {
                                                                                                        stage
                                                                                                            .status
                                                                                                            ?.status_name
                                                                                                    }
                                                                                                </span>
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        {/* Action Buttons */}
                                                                        <div
                                                                            className={`flex gap-2 ${
                                                                                user.role_id ==
                                                                                2
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
                                                                                    className={`p-2 hover:bg-opacity-50 rounded-lg transition-colors ${
                                                                                        isRejectedFlow
                                                                                            ? "text-orange-600 hover:bg-orange-200"
                                                                                            : "text-blue-600 hover:bg-blue-50"
                                                                                    }`}
                                                                                >
                                                                                    <Edit
                                                                                        size={
                                                                                            16
                                                                                        }
                                                                                    />
                                                                                </AlertDialogTrigger>
                                                                                <AlertDialogContent className="w-[60rem] max-w-4xl max-h-[90vh] overflow-y-auto">
                                                                                    <AlertDialogHeader>
                                                                                        <AlertDialogTitle>
                                                                                            Edit
                                                                                            Tahapan:{" "}
                                                                                            {
                                                                                                stage.stage_name
                                                                                            }
                                                                                        </AlertDialogTitle>
                                                                                        <div className="grid gap-4">
                                                                                            {/* Stage Name */}
                                                                                            <div>
                                                                                                <label
                                                                                                    htmlFor="stage_name"
                                                                                                    className="block mb-2 text-sm font-medium"
                                                                                                >
                                                                                                    Stage
                                                                                                    Name
                                                                                                    *
                                                                                                </label>
                                                                                                <input
                                                                                                    value={
                                                                                                        formData.stage_name
                                                                                                    }
                                                                                                    type="text"
                                                                                                    name="stage_name"
                                                                                                    onChange={
                                                                                                        handleChange
                                                                                                    }
                                                                                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                                    placeholder="Enter stage name"
                                                                                                />
                                                                                            </div>

                                                                                            {/* Sequence and Status */}
                                                                                            <div className="grid md:grid-cols-2 gap-4">
                                                                                                <div>
                                                                                                    <label
                                                                                                        htmlFor="sequence"
                                                                                                        className="block mb-2 text-sm font-medium"
                                                                                                    >
                                                                                                        Sequence
                                                                                                        *
                                                                                                    </label>
                                                                                                    <select
                                                                                                        name="sequence"
                                                                                                        value={
                                                                                                            formData.sequence
                                                                                                        }
                                                                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                                        onChange={
                                                                                                            handleChange
                                                                                                        }
                                                                                                    >
                                                                                                        <option value="">
                                                                                                            Pilih
                                                                                                            Opsi
                                                                                                        </option>
                                                                                                        <option
                                                                                                            value={
                                                                                                                1
                                                                                                            }
                                                                                                        >
                                                                                                            First
                                                                                                            Stage
                                                                                                        </option>
                                                                                                        <option
                                                                                                            value={
                                                                                                                0
                                                                                                            }
                                                                                                        >
                                                                                                            Regular
                                                                                                            Stage
                                                                                                        </option>
                                                                                                    </select>
                                                                                                </div>

                                                                                                <div>
                                                                                                    <label
                                                                                                        htmlFor="status_id"
                                                                                                        className="block mb-2 text-sm font-medium"
                                                                                                    >
                                                                                                        Status
                                                                                                        *
                                                                                                    </label>
                                                                                                    <select
                                                                                                        name="status_id"
                                                                                                        value={
                                                                                                            formData.status_id
                                                                                                        }
                                                                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                                        onChange={
                                                                                                            handleChange
                                                                                                        }
                                                                                                    >
                                                                                                        <option value="">
                                                                                                            Pilih
                                                                                                            Status
                                                                                                        </option>
                                                                                                        {statuses.map(
                                                                                                            (
                                                                                                                status: any
                                                                                                            ) => (
                                                                                                                <option
                                                                                                                    key={
                                                                                                                        status.id
                                                                                                                    }
                                                                                                                    value={
                                                                                                                        status.id
                                                                                                                    }
                                                                                                                >
                                                                                                                    {
                                                                                                                        status.status_name
                                                                                                                    }
                                                                                                                </option>
                                                                                                            )
                                                                                                        )}
                                                                                                    </select>
                                                                                                </div>
                                                                                            </div>

                                                                                            {/* Letter Type and Approver */}
                                                                                            <div className="grid md:grid-cols-2 gap-4">
                                                                                                <div>
                                                                                                    <label
                                                                                                        htmlFor="letter_id"
                                                                                                        className="block mb-2 text-sm font-medium"
                                                                                                    >
                                                                                                        Letter
                                                                                                        Type
                                                                                                        *
                                                                                                    </label>
                                                                                                    <select
                                                                                                        name="letter_id"
                                                                                                        value={
                                                                                                            formData.letter_id
                                                                                                        }
                                                                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                                        onChange={
                                                                                                            handleChange
                                                                                                        }
                                                                                                    >
                                                                                                        <option value="">
                                                                                                            Pilih
                                                                                                            Tipe
                                                                                                            Surat
                                                                                                        </option>
                                                                                                        {letter.map(
                                                                                                            (
                                                                                                                letterType: any
                                                                                                            ) => (
                                                                                                                <option
                                                                                                                    key={
                                                                                                                        letterType.id
                                                                                                                    }
                                                                                                                    value={
                                                                                                                        letterType.id
                                                                                                                    }
                                                                                                                >
                                                                                                                    {
                                                                                                                        letterType.letter_name
                                                                                                                    }
                                                                                                                </option>
                                                                                                            )
                                                                                                        )}
                                                                                                    </select>
                                                                                                </div>

                                                                                                <div>
                                                                                                    <label
                                                                                                        htmlFor="approver_id"
                                                                                                        className="block mb-2 text-sm font-medium"
                                                                                                    >
                                                                                                        Approver
                                                                                                        Role
                                                                                                        *
                                                                                                    </label>
                                                                                                    <select
                                                                                                        name="approver_id"
                                                                                                        value={
                                                                                                            formData.approver_id
                                                                                                        }
                                                                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                                                        onChange={
                                                                                                            handleChange
                                                                                                        }
                                                                                                    >
                                                                                                        <option value="">
                                                                                                            Pilih
                                                                                                            Role
                                                                                                        </option>
                                                                                                        {role.map(
                                                                                                            (
                                                                                                                roleItem: any
                                                                                                            ) => (
                                                                                                                <option
                                                                                                                    key={
                                                                                                                        roleItem.id
                                                                                                                    }
                                                                                                                    value={
                                                                                                                        roleItem.id
                                                                                                                    }
                                                                                                                >
                                                                                                                    {
                                                                                                                        roleItem.role_name
                                                                                                                    }
                                                                                                                </option>
                                                                                                            )
                                                                                                        )}
                                                                                                    </select>
                                                                                                </div>
                                                                                            </div>

                                                                                            {/* Next Stages */}
                                                                                            <div className="grid md:grid-cols-2 gap-4">
                                                                                                <div>
                                                                                                    <label
                                                                                                        htmlFor="to_stage_id"
                                                                                                        className="block mb-2 text-sm font-medium"
                                                                                                    >
                                                                                                        Next
                                                                                                        Stage
                                                                                                        (If
                                                                                                        Approved)
                                                                                                    </label>
                                                                                                    <select
                                                                                                        name="to_stage_id"
                                                                                                        value={
                                                                                                            formData.to_stage_id
                                                                                                        }
                                                                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                                                                        onChange={
                                                                                                            handleChange
                                                                                                        }
                                                                                                    >
                                                                                                        <option value="-1">
                                                                                                            ❌
                                                                                                            Tahapan
                                                                                                            Akhir
                                                                                                        </option>
                                                                                                        {data.map(
                                                                                                            (
                                                                                                                stageOption: any
                                                                                                            ) => (
                                                                                                                <option
                                                                                                                    key={
                                                                                                                        stageOption.id
                                                                                                                    }
                                                                                                                    value={
                                                                                                                        stageOption.id
                                                                                                                    }
                                                                                                                >
                                                                                                                    ➡️{" "}
                                                                                                                    {
                                                                                                                        stageOption.stage_name
                                                                                                                    }
                                                                                                                </option>
                                                                                                            )
                                                                                                        )}
                                                                                                    </select>
                                                                                                </div>

                                                                                                <div>
                                                                                                    <label
                                                                                                        htmlFor="rejected_id"
                                                                                                        className="block mb-2 text-sm font-medium"
                                                                                                    >
                                                                                                        Next
                                                                                                        Stage
                                                                                                        (If
                                                                                                        Rejected)
                                                                                                    </label>
                                                                                                    <select
                                                                                                        name="rejected_id"
                                                                                                        value={
                                                                                                            formData.rejected_id
                                                                                                        }
                                                                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                                                                                        onChange={
                                                                                                            handleChange
                                                                                                        }
                                                                                                    >
                                                                                                        <option value="-1">
                                                                                                            ❌
                                                                                                            Tahapan
                                                                                                            Akhir
                                                                                                        </option>
                                                                                                        {data.map(
                                                                                                            (
                                                                                                                stageOption: any
                                                                                                            ) => (
                                                                                                                <option
                                                                                                                    key={
                                                                                                                        stageOption.id
                                                                                                                    }
                                                                                                                    value={
                                                                                                                        stageOption.id
                                                                                                                    }
                                                                                                                >
                                                                                                                    ↩️{" "}
                                                                                                                    {
                                                                                                                        stageOption.stage_name
                                                                                                                    }
                                                                                                                </option>
                                                                                                            )
                                                                                                        )}
                                                                                                    </select>
                                                                                                </div>
                                                                                            </div>

                                                                                            {/* Stage Configuration Options */}
                                                                                            <div className="border-t pt-4">
                                                                                                <h4 className="text-sm font-semibold mb-3 text-gray-700">
                                                                                                    Konfigurasi
                                                                                                    Tahapan
                                                                                                </h4>
                                                                                                <div className="grid md:grid-cols-2 gap-4">
                                                                                                    <div className="space-y-3">
                                                                                                        <label className="flex items-center space-x-2">
                                                                                                            <input
                                                                                                                type="checkbox"
                                                                                                                name="requires_rejection_reason"
                                                                                                                checked={
                                                                                                                    formData.requires_rejection_reason ||
                                                                                                                    false
                                                                                                                }
                                                                                                                onChange={
                                                                                                                    handleChange
                                                                                                                }
                                                                                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                                                                            />
                                                                                                            <span className="text-sm">
                                                                                                                Butuh
                                                                                                                alasan
                                                                                                                penolakan
                                                                                                            </span>
                                                                                                        </label>

                                                                                                        <label className="flex items-center space-x-2">
                                                                                                            <input
                                                                                                                type="checkbox"
                                                                                                                name="is_fixable"
                                                                                                                checked={
                                                                                                                    formData.is_fixable ||
                                                                                                                    false
                                                                                                                }
                                                                                                                onChange={
                                                                                                                    handleChange
                                                                                                                }
                                                                                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                                                                            />
                                                                                                            <span className="text-sm">
                                                                                                                Dapat
                                                                                                                Diperbaiki
                                                                                                                (Tahapan
                                                                                                                dapat
                                                                                                                diperbaiki)
                                                                                                            </span>
                                                                                                        </label>

                                                                                                        <label className="flex items-center space-x-2">
                                                                                                            <input
                                                                                                                type="checkbox"
                                                                                                                name="requires_file_upload"
                                                                                                                checked={
                                                                                                                    formData.requires_file_upload ||
                                                                                                                    false
                                                                                                                }
                                                                                                                onChange={
                                                                                                                    handleChange
                                                                                                                }
                                                                                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                                                                            />
                                                                                                            <span className="text-sm">
                                                                                                                Butuh
                                                                                                                Upload
                                                                                                                File
                                                                                                            </span>
                                                                                                        </label>

                                                                                                        <label className="flex items-center space-x-2">
                                                                                                            <input
                                                                                                                type="checkbox"
                                                                                                                name="is_external"
                                                                                                                checked={
                                                                                                                    formData.is_external ||
                                                                                                                    false
                                                                                                                }
                                                                                                                onChange={
                                                                                                                    handleChange
                                                                                                                }
                                                                                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                                                                            />
                                                                                                            <span className="text-sm">
                                                                                                                Tahapan
                                                                                                                bersifat
                                                                                                                eksternal
                                                                                                                (tahapan
                                                                                                                berada
                                                                                                                pada
                                                                                                                sisi
                                                                                                                penerima
                                                                                                                surat)
                                                                                                            </span>
                                                                                                        </label>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>

                                                                                            {/* Notification Settings */}
                                                                                            <div className="border-t pt-4">
                                                                                                <h4 className="text-sm font-semibold mb-3 text-gray-700">
                                                                                                    Pengaturan
                                                                                                    Notifikasi
                                                                                                </h4>
                                                                                                <div className="grid md:grid-cols-2 gap-4">
                                                                                                    <div className="space-y-3">
                                                                                                        <h5 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                                                                                            Notifikasi
                                                                                                            Internal
                                                                                                        </h5>
                                                                                                        <label className="flex items-center space-x-2">
                                                                                                            <input
                                                                                                                type="checkbox"
                                                                                                                name="notify_internal"
                                                                                                                checked={
                                                                                                                    formData.notify_internal ||
                                                                                                                    false
                                                                                                                }
                                                                                                                onChange={
                                                                                                                    handleChange
                                                                                                                }
                                                                                                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                                                                            />
                                                                                                            <span className="text-sm">
                                                                                                                Notifikasi
                                                                                                                ke
                                                                                                                seluruh
                                                                                                                pengguna
                                                                                                                Internal
                                                                                                            </span>
                                                                                                        </label>

                                                                                                        <label className="flex items-center space-x-2">
                                                                                                            <input
                                                                                                                type="checkbox"
                                                                                                                name="notify_internal_manager"
                                                                                                                checked={
                                                                                                                    formData.notify_internal_manager ||
                                                                                                                    false
                                                                                                                }
                                                                                                                onChange={
                                                                                                                    handleChange
                                                                                                                }
                                                                                                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                                                                            />
                                                                                                            <span className="text-sm">
                                                                                                                Notifikasi
                                                                                                                ke
                                                                                                                Manajer
                                                                                                                Internal
                                                                                                            </span>
                                                                                                        </label>

                                                                                                        <label className="flex items-center space-x-2">
                                                                                                            <input
                                                                                                                type="checkbox"
                                                                                                                name="notify_internal_user"
                                                                                                                checked={
                                                                                                                    formData.notify_internal_user ||
                                                                                                                    false
                                                                                                                }
                                                                                                                onChange={
                                                                                                                    handleChange
                                                                                                                }
                                                                                                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                                                                            />
                                                                                                            <span className="text-sm">
                                                                                                                Notifikasi
                                                                                                                ke
                                                                                                                Pegawai
                                                                                                                Internal
                                                                                                            </span>
                                                                                                        </label>
                                                                                                    </div>

                                                                                                    <div className="space-y-3">
                                                                                                        <h5 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                                                                                            Notifikasi
                                                                                                            Eksternal
                                                                                                        </h5>
                                                                                                        <label className="flex items-center space-x-2">
                                                                                                            <input
                                                                                                                type="checkbox"
                                                                                                                name="notify_external"
                                                                                                                checked={
                                                                                                                    formData.notify_external ||
                                                                                                                    false
                                                                                                                }
                                                                                                                onChange={
                                                                                                                    handleChange
                                                                                                                }
                                                                                                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                                                                                            />
                                                                                                            <span className="text-sm">
                                                                                                                Notifikasi
                                                                                                                ke
                                                                                                                seluruh
                                                                                                                pengguna
                                                                                                                eksternal
                                                                                                            </span>
                                                                                                        </label>

                                                                                                        <label className="flex items-center space-x-2">
                                                                                                            <input
                                                                                                                type="checkbox"
                                                                                                                name="notify_external_manager"
                                                                                                                checked={
                                                                                                                    formData.notify_external_manager ||
                                                                                                                    false
                                                                                                                }
                                                                                                                onChange={
                                                                                                                    handleChange
                                                                                                                }
                                                                                                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                                                                                            />
                                                                                                            <span className="text-sm">
                                                                                                                Notifikasi
                                                                                                                ke
                                                                                                                Manajer
                                                                                                                Eksternal
                                                                                                            </span>
                                                                                                        </label>

                                                                                                        <label className="flex items-center space-x-2">
                                                                                                            <input
                                                                                                                type="checkbox"
                                                                                                                name="notify_external_user"
                                                                                                                checked={
                                                                                                                    formData.notify_external_user ||
                                                                                                                    false
                                                                                                                }
                                                                                                                onChange={
                                                                                                                    handleChange
                                                                                                                }
                                                                                                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                                                                                            />
                                                                                                            <span className="text-sm">
                                                                                                                Notifikasi
                                                                                                                ke
                                                                                                                pengguna
                                                                                                                Eksternal
                                                                                                            </span>
                                                                                                        </label>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </AlertDialogHeader>
                                                                                    <AlertDialogFooter>
                                                                                        <AlertDialogCancel
                                                                                            onClick={
                                                                                                resetForm
                                                                                            }
                                                                                        >
                                                                                            Batal
                                                                                        </AlertDialogCancel>
                                                                                        <AlertDialogAction
                                                                                            className="bg-green-500 hover:bg-green-600"
                                                                                            onClick={() =>
                                                                                                handleEdit(
                                                                                                    stage.id
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            Update
                                                                                            Tahapan
                                                                                        </AlertDialogAction>
                                                                                    </AlertDialogFooter>
                                                                                </AlertDialogContent>
                                                                            </AlertDialog>

                                                                            <button
                                                                                onClick={() =>
                                                                                    deleteStages(
                                                                                        stage.id
                                                                                    )
                                                                                }
                                                                                className={`p-2 hover:bg-opacity-50 rounded-lg transition-colors ${
                                                                                    isRejectedFlow
                                                                                        ? "text-red-700 hover:bg-red-200"
                                                                                        : "text-red-600 hover:bg-red-50"
                                                                                }`}
                                                                            >
                                                                                <Trash2
                                                                                    size={
                                                                                        16
                                                                                    }
                                                                                />
                                                                            </button>
                                                                        </div>
                                                                    </div>

                                                                    {/* Flow Controls - Available for ALL stages including rejected ones */}
                                                                    <div
                                                                        className={`grid md:grid-cols-2 gap-4 mt-6 pt-4 border-t ${
                                                                            isRejectedFlow
                                                                                ? "border-orange-200"
                                                                                : "border-gray-200"
                                                                        }`}
                                                                    >
                                                                        {/* Approved Path */}
                                                                        <div className="space-y-3">
                                                                            <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                                                                                <CheckCircle
                                                                                    size={
                                                                                        16
                                                                                    }
                                                                                />
                                                                                {isRejectedFlow
                                                                                    ? "Setelah tahapan disetujui:"
                                                                                    : "Jika tahapan disetujui:"}
                                                                            </div>
                                                                            <select
                                                                                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    handleUpdate(
                                                                                        {
                                                                                            id: stage.id,
                                                                                            field: "to_stage_id",
                                                                                            value: parseInt(
                                                                                                e
                                                                                                    .target
                                                                                                    .value
                                                                                            ),
                                                                                        }
                                                                                    )
                                                                                }
                                                                                defaultValue={
                                                                                    stage
                                                                                        .request_approved
                                                                                        ?.id ||
                                                                                    -1
                                                                                }
                                                                            >
                                                                                <option
                                                                                    value={
                                                                                        -1
                                                                                    }
                                                                                >
                                                                                    ❌
                                                                                    Tahapan
                                                                                    Akhir
                                                                                </option>
                                                                                {letterTypeData.stages
                                                                                    .filter(
                                                                                        (
                                                                                            s
                                                                                        ) =>
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
                                                                        </div>

                                                                        {/* Rejected Path */}
                                                                        <div className="space-y-3">
                                                                            <div className="flex items-center gap-2 text-sm font-medium text-red-700">
                                                                                <XCircle
                                                                                    size={
                                                                                        16
                                                                                    }
                                                                                />
                                                                                {isRejectedFlow
                                                                                    ? "Jika tahapan ditolak kembali:"
                                                                                    : "Jika tahapan ditolak:"}
                                                                            </div>
                                                                            <select
                                                                                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    handleUpdate(
                                                                                        {
                                                                                            id: stage.id,
                                                                                            field: "rejected_id",
                                                                                            value: parseInt(
                                                                                                e
                                                                                                    .target
                                                                                                    .value
                                                                                            ),
                                                                                        }
                                                                                    )
                                                                                }
                                                                                defaultValue={
                                                                                    stage
                                                                                        .request_rejected
                                                                                        ?.id ||
                                                                                    -1
                                                                                }
                                                                            >
                                                                                <option
                                                                                    value={
                                                                                        -1
                                                                                    }
                                                                                >
                                                                                    ❌
                                                                                    Tahapan
                                                                                    Akhir
                                                                                </option>
                                                                                {letterTypeData.stages
                                                                                    .filter(
                                                                                        (
                                                                                            s
                                                                                        ) =>
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
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>

                                        {/* No stages message */}
                                        {letterTypeData.flowOrderedStages
                                            .length === 0 && (
                                            <div className="text-center py-8 text-gray-500">
                                                <FileText
                                                    size={48}
                                                    className="mx-auto mb-4 opacity-50"
                                                />
                                                <p className="text-lg font-medium mb-2">
                                                    Belum ada tahapan
                                                </p>
                                                <p className="text-sm">
                                                    Silakan buat tahapan baru
                                                    untuk tipe surat{" "}
                                                    {letterTypeName}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    {/* No data message */}
                    {Object.keys(stagesByLetterType).length === 0 && (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                            <FileText
                                size={64}
                                className="mx-auto mb-4 text-gray-400"
                            />
                            <h3 className="text-xl font-medium text-gray-900 mb-2">
                                Belum ada tahapan surat
                            </h3>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                Mulai dengan membuat tahapan pertama untuk
                                mengatur alur persetujuan surat
                            </p>
                            <AlertDialog>
                                <AlertDialogTrigger
                                    className={`bg-blue-500 px-6 py-3 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors mx-auto ${
                                        user.role_id == 2 ? "hidden" : ""
                                    }`}
                                >
                                    <Plus size={20} />
                                    Buat Tahapan Pertama
                                </AlertDialogTrigger>
                            </AlertDialog>
                        </div>
                    )}
                </div>
            </div>
        </SidebarAuthenticated>
    );
}
