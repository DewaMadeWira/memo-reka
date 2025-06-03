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

    // Function to sort stages by approval flow and include rejected stages
    const sortStagesByFlow = (stages: any[]): FlowStage[] => {
        const stageMap = new Map();
        const visited = new Set();
        const result: FlowStage[] = [];

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

            // Add the current stage (positive flow)
            result.push({
                stage: stage,
                isRejectedFlow: false,
            });

            // If this stage has a rejected path, add it next
            if (
                stage.request_rejected?.id &&
                stage.request_rejected.id !== -1
            ) {
                const rejectedStage = stageMap.get(stage.request_rejected.id);
                if (rejectedStage) {
                    result.push({
                        stage: rejectedStage,
                        isRejectedFlow: true,
                        parentStageId: stage.id,
                    });
                }
            }

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
                result.push({
                    stage: stage,
                    isRejectedFlow: false,
                });
            }
        });

        return result;
    };

    // Sort stages by flow including rejected paths
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
                    setFormData({
                        stage_name: "",
                        sequence: "",
                        to_stage_id: "",
                        rejected_id: "",
                        letter_id: "",
                        approver_id: "",
                        status_id: "",
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
                setFormData({
                    stage_name: "",
                    sequence: "",
                    to_stage_id: "",
                    rejected_id: "",
                    letter_id: "",
                    approver_id: "",
                    status_id: "",
                });
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

    const resetForm = () => {
        setFormData({
            stage_name: "",
            sequence: "",
            to_stage_id: "",
            rejected_id: "",
            letter_id: "",
            approver_id: "",
            status_id: "",
        });
        setEditingStage(null);
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
                        <AlertDialogContent className="w-[300rem] max-w-2xl">
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    {editingStage
                                        ? "Edit Tahapan"
                                        : "Buat Tahapan Baru"}
                                </AlertDialogTitle>
                                <div className="grid gap-4">
                                    <div>
                                        <label
                                            htmlFor="stage_name"
                                            className="block mb-2 text-sm font-medium"
                                        >
                                            Stage Name *
                                        </label>
                                        <input
                                            value={formData.stage_name}
                                            onChange={handleChange}
                                            type="text"
                                            name="stage_name"
                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter stage name"
                                        />
                                    </div>

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

                {/* Flow-Based Timeline View with Rejected Stages */}
                <div className="mt-8">
                    <div className="mb-4 p-4 ">
                        <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                            {/* <ArrowRight className="text-blue-600" size={20} /> */}
                            Alur Tahapan dari surat.
                        </h3>
                        <p className="text-sm text-blue-600">
                            Tampilan menunjukkan tahapan dari surat dimana warna
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

                    <div className="space-y-6">
                        {flowOrderedStages.map(
                            (flowStage: FlowStage, index: number) => {
                                const { stage, isRejectedFlow, parentStageId } =
                                    flowStage;
                                const isStartingStage =
                                    stage.sequence === 1 && !isRejectedFlow;
                                const hasApprovedNextStage =
                                    stage.request_approved?.id &&
                                    stage.request_approved.id !== -1;
                                const hasRejectedNextStage =
                                    stage.request_rejected?.id &&
                                    stage.request_rejected.id !== -1;
                                const isEndStage =
                                    !hasApprovedNextStage && !isRejectedFlow;

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

                                        {/* Flow Connection Indicator */}
                                        {/* {isRejectedFlow && (
                                            <div className="absolute -top-3 left-0 transform translate-x-1">
                                                <div className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                                    <XCircle size={12} />
                                                    Rejection Handler
                                                </div>
                                            </div>
                                        )} */}

                                        {/* {!isRejectedFlow &&
                                            index > 0 &&
                                            !flowOrderedStages[index - 1]
                                                ?.isRejectedFlow && (
                                                <div className="absolute -top-3 left-0 transform translate-x-1">
                                                    <div className="bg-green-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                                        <CheckCircle
                                                            size={12}
                                                        />
                                                        Approval Flow
                                                    </div>
                                                </div>
                                            )} */}

                                        {/* Stage Card */}
                                        <div className="flex items-start space-x-4">
                                            {/* Timeline Dot */}
                                            <div
                                                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold  border-2 ${
                                                    isRejectedFlow
                                                        ? "bg-gradient-to-br bg-orange-400"
                                                        : isStartingStage
                                                        ? "bg-gradient-to-br bg-green-500"
                                                        : isEndStage
                                                        ? "bg-gradient-to-br bg-gray-500"
                                                        : "bg-gradient-to-br bg-green-500 "
                                                }`}
                                            >
                                                {isRejectedFlow ? (
                                                    <AlertTriangle size={18} />
                                                ) : (
                                                    index +
                                                    1 -
                                                    flowOrderedStages
                                                        .slice(0, index)
                                                        .filter(
                                                            (fs) =>
                                                                fs.isRejectedFlow
                                                        ).length
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
                                                                    {/* <AlertTriangle
                                                                        size={
                                                                            10
                                                                        }
                                                                    /> */}
                                                                    Tahapan
                                                                    Ditolak
                                                                </span>
                                                            )}

                                                            {isStartingStage && (
                                                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                                                                    {/* <CheckCircle
                                                                        size={
                                                                            10
                                                                        }
                                                                    /> */}
                                                                    Awal Tahapan
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
                                                                    <div className="mt-4">
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
                                                                        {/* <p>
                                                                            <span className="font-medium">
                                                                                Posisi Tahapan :
                                                                            </span>
                                                                            <span className="ml-1">
                                                                                {isRejectedFlow
                                                                                    ? "Exception Handler"
                                                                                    : isStartingStage
                                                                                    ? "Awal "
                                                                                    : `Step ${
                                                                                          index +
                                                                                          1 -
                                                                                          flowOrderedStages
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
                                                                                      }`}
                                                                            </span>
                                                                        </p> */}
                                                                    </div>
                                                                    {/* <p>
                                                                        <span className="font-medium">
                                                                            Approver:
                                                                        </span>{" "}
                                                                        {
                                                                            stage
                                                                                .approver
                                                                                ?.role_name
                                                                        }
                                                                    </p> */}
                                                                </div>
                                                            </div>

                                                            {/* {isRejectedFlow &&
                                                                parentStageId && (
                                                                    <div className="mt-3 p-2 bg-orange-100 rounded border border-orange-200">
                                                                        <p className="text-xs text-orange-800">
                                                                            <span className="font-medium">
                                                                                🔄
                                                                                Triggered
                                                                                by
                                                                                rejection
                                                                                from:
                                                                            </span>
                                                                            <span className="ml-1 font-semibold">
                                                                                {
                                                                                    getStageById(
                                                                                        parentStageId
                                                                                    )
                                                                                        ?.stage_name
                                                                                }
                                                                            </span>
                                                                        </p>
                                                                    </div>
                                                                )} */}
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
                                                                className={`p-2 hover:bg-opacity-50 rounded-lg transition-colors ${
                                                                    isRejectedFlow
                                                                        ? "text-orange-600 hover:bg-orange-200"
                                                                        : "text-blue-600 hover:bg-blue-50"
                                                                }`}
                                                            >
                                                                <Edit
                                                                    size={16}
                                                                />
                                                            </AlertDialogTrigger>
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
                                                            <Trash2 size={16} />
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
                                                            {/* <CheckCircle
                                                                size={16}
                                                            /> */}
                                                            {isRejectedFlow
                                                                ? "Setelah tahapan disetujui:"
                                                                : "Jika tahapan disetujui :"}
                                                        </div>
                                                        <select
                                                            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
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
                                                                ❌ Tahapan Akhir
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
                                                        {/* {stage.request_approved &&
                                                            stage
                                                                .request_approved
                                                                .id !== -1 && (
                                                                <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 p-2 rounded border border-green-200">
                                                                    <ArrowRight
                                                                        size={
                                                                            12
                                                                        }
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
                                                            )} */}
                                                        {/* {(!stage.request_approved ||
                                                            stage
                                                                .request_approved
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
                                                        )} */}
                                                    </div>

                                                    {/* Rejected Path */}
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2 text-sm font-medium text-red-700">
                                                            {/* <XCircle
                                                                size={16}
                                                            /> */}
                                                            {isRejectedFlow
                                                                ? "Jika tahapan ditolak kembali:"
                                                                : "Jika tahapan ditolak:"}
                                                        </div>
                                                        <select
                                                            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
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
                                                                ❌ Tahapan Akhir
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
                                                        {/* {stage.request_rejected &&
                                                            stage
                                                                .request_rejected
                                                                .id !== -1 && (
                                                                <div className="flex items-center gap-2 text-xs text-orange-600 bg-orange-50 p-2 rounded border border-orange-200">
                                                                    <ArrowDown
                                                                        size={
                                                                            12
                                                                        }
                                                                    />
                                                                    <span className="font-medium">
                                                                        Goes to:
                                                                    </span>{" "}
                                                                    {
                                                                        stage
                                                                            .request_rejected
                                                                            .stage_name
                                                                    }
                                                                    <span className="ml-1 text-xs bg-orange-200 text-orange-800 px-1 rounded">
                                                                        shown
                                                                        below
                                                                    </span>
                                                                </div>
                                                            )}
                                                        {(!stage.request_rejected ||
                                                            stage
                                                                .request_rejected
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
                                                        )} */}
                                                    </div>
                                                </div>

                                                {/* Additional Information for Rejected Stages */}
                                                {/* {isRejectedFlow && (
                                                    <div className="mt-4 pt-4 border-t border-orange-200">
                                                        <div className="bg-orange-100 p-3 rounded-lg">
                                                            <div className="flex items-start gap-2 text-sm">
                                                                <AlertTriangle
                                                                    size={16}
                                                                    className="text-orange-600 mt-0.5 flex-shrink-0"
                                                                />
                                                                <div>
                                                                    <p className="font-medium text-orange-800 mb-1">
                                                                        Tahapan Ditolak
                                                                    </p>
                                                                    <p className="text-xs text-orange-700 mb-3">
                                                                        This
                                                                        stage
                                                                        processes
                                                                        documents
                                                                        that
                                                                        have
                                                                        been
                                                                        rejected
                                                                        from "
                                                                        {
                                                                            getStageById(
                                                                                parentStageId ||
                                                                                    0
                                                                            )
                                                                                ?.stage_name
                                                                        }
                                                                        ". It
                                                                        can
                                                                        either
                                                                        approve
                                                                        (continue
                                                                        process)
                                                                        or
                                                                        reject
                                                                        again
                                                                        (further
                                                                        handling).
                                                                    </p>

                                                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                                                        <div className="bg-green-50 p-2 rounded border border-green-200">
                                                                            <div className="flex items-center gap-1 font-medium text-green-800 mb-1">
                                                                                <CheckCircle
                                                                                    size={
                                                                                        10
                                                                                    }
                                                                                />
                                                                                Can
                                                                                Approve
                                                                            </div>
                                                                            <p className="text-green-700">
                                                                                Process
                                                                                document
                                                                                and
                                                                                continue
                                                                                to
                                                                                next
                                                                                stage
                                                                            </p>
                                                                        </div>
                                                                        <div className="bg-red-50 p-2 rounded border border-red-200">
                                                                            <div className="flex items-center gap-1 font-medium text-red-800 mb-1">
                                                                                <XCircle
                                                                                    size={
                                                                                        10
                                                                                    }
                                                                                />
                                                                                Can
                                                                                Reject
                                                                            </div>
                                                                            <p className="text-red-700">
                                                                                Send
                                                                                to
                                                                                another
                                                                                stage
                                                                                or
                                                                                end
                                                                                process
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )} */}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        )}

                        {/* End of Process Indicator */}
                        {/* <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-lg border-2 border-green-300">
                                <CheckCircle className="text-white" size={20} />
                            </div>
                            <div className="flex-1 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                                    ✅ Process Complete
                                    <span className="text-sm font-normal text-green-600">
                                        (Final Destination)
                                    </span>
                                </h3>
                                <p className="text-sm text-green-700">
                                    Document has successfully completed all
                                    approval stages and reached the end of the
                                    workflow
                                </p>
                            </div>
                        </div> */}

                        {/* Enhanced Legend */}
                        {/* <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                                Legend & Flow Guide
                            </h4>
                            <div className="grid md:grid-cols-3 gap-6 text-sm">
                                <div className="space-y-3">
                                    <h5 className="font-medium text-gray-700 mb-2">
                                        Stage Types
                                    </h5>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-400 to-green-600"></div>
                                        <span>
                                            Starting Stage (Entry Point)
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
                                        <span>Regular Approval Stage</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                                            <AlertTriangle
                                                size={8}
                                                className="text-white"
                                            />
                                        </div>
                                        <span>Rejection Handler Stage</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-gray-400 to-gray-600"></div>
                                        <span>End Stage (No Next Stage)</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h5 className="font-medium text-gray-700 mb-2">
                                        Flow Paths
                                    </h5>
                                    <div className="flex items-center gap-2">
                                        <div className="w-0.5 h-4 bg-green-500"></div>
                                        <span>Approval Flow Path</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-0.5 h-4 bg-orange-500"></div>
                                        <span>Rejection Flow Path</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle
                                            size={14}
                                            className="text-green-600"
                                        />
                                        <span>Approved Action</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <XCircle
                                            size={14}
                                            className="text-red-600"
                                        />
                                        <span>Rejected Action</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h5 className="font-medium text-gray-700 mb-2">
                                        Key Features
                                    </h5>
                                    <div className="text-xs space-y-2">
                                        <p>
                                            •{" "}
                                            <span className="font-medium">
                                                Rejection Handlers:
                                            </span>{" "}
                                            Can both approve and reject
                                            documents
                                        </p>
                                        <p>
                                            •{" "}
                                            <span className="font-medium">
                                                Flow Control:
                                            </span>{" "}
                                            Each stage can define where
                                            documents go next
                                        </p>
                                        <p>
                                            •{" "}
                                            <span className="font-medium">
                                                End Points:
                                            </span>{" "}
                                            Stages can terminate the process
                                        </p>
                                        <p>
                                            •{" "}
                                            <span className="font-medium">
                                                Complete Workflow:
                                            </span>{" "}
                                            Shows all possible paths documents
                                            can take
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </SidebarAuthenticated>
    );
}
