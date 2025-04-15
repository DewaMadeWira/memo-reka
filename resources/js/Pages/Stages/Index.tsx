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
import { DataTable } from "./stage/data-table";
import { User } from "@/types/UserType";
import { Stages } from "@/types/StagesType";
import { columns } from "./stage/columns";
import { Status } from "@/types/StatusType";
import { Letter } from "@/types/LetterType";
import { Role } from "@/types/RoleType";
import { useToast } from "@/hooks/use-toast";
// import { toast } from "@/hooks/use-toast";

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
    const { user } = usePage().props.auth as { user: User };
    const handleSubmit = () => {
        console.log(formData);
        router.post("/admin/manajemen-tahapan-surat?intent=stages.create", formData, {
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
        });
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
            // Check if the ID exists in the array

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
                // If ID exists, update the id_value
                const updatedData = [...prevData];
                updatedData[index] = {
                    ...updatedData[index],
                    [field]: value,
                };
                return updatedData;
            } else {
                // If ID does not exist, add new item
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
        // setUpdateData([{ id: id, id_value: id_value }]);
        // router.put("/stages/" + id,formData)
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

    useEffect(() => {
        console.log(updateData);
    }, [updateData]);

    return (
        <SidebarAuthenticated>
            <Head title="Manajemen Tahapan Surat"  />
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
                <div className=" font-medium text-sm flex w-full justify-end gap-3">
                    <AlertDialog>
                        <AlertDialogTrigger
                            className={`bg-blue-500 p-2 mt-2 text-white rounded-lg ${
                                user.role_id == 2 ? "hidden" : ""
                            }`}
                        >
                            Buat Tahapan Baru
                        </AlertDialogTrigger>
                        <AlertDialogContent className="w-[300rem]">
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Buat Stages Baru
                                </AlertDialogTitle>
                                <div className="">
                                    <label
                                        htmlFor="stage_name"
                                        className="block mb-2"
                                    >
                                        Stage Name
                                    </label>
                                    <input
                                        onChange={handleChange}
                                        type="text"
                                        name="stage_name"
                                        id=""
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
                                        id=""
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
                                        id=""
                                        className="w-full p-2 border rounded-lg"
                                        onChange={handleChange}
                                    >
                                        <option>Pilih Opsi</option>
                                        {letter.map((stage: any) => (
                                            <option value={stage.id}>
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
                                        id=""
                                        className="w-full p-2 border rounded-lg"
                                        onChange={handleChange}
                                    >
                                        <option>Pilih Opsi</option>
                                        {role.map((stage: any) => (
                                            <option value={stage.id}>
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
                                        id=""
                                        className="w-full p-2 border rounded-lg"
                                        onChange={handleChange}
                                    >
                                        <option value={-1}>Pilih Opsi</option>
                                        {data.map((stage: any) => (
                                            <option value={stage.id}>
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
                                        id=""
                                        className="w-full p-2 border rounded-lg"
                                        onChange={handleChange}
                                    >
                                        <option value={-1}>Pilih Opsi</option>
                                        {data.map((stage: any) => (
                                            <option value={stage.id}>
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
                                        id=""
                                        className="w-full p-2 border rounded-lg"
                                        onChange={handleChange}
                                    >
                                        <option>Pilih Opsi</option>
                                        {statuses.map((status: any) => (
                                            <option value={status.id}>
                                                {status.status_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Kembali</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-green-500"
                                    onClick={handleSubmit}
                                >
                                    Buat Tahapan
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
                {/* <table className="w-[80%]">
                    <tr>
                        <th>Id</th>
                        <th>Letter Type</th>
                        <th>Stage Name</th>
                        <th>Stage Status</th>
                        <th>To Stage ID</th>
                        <th>Rejected ID</th>
                    </tr>
                    {data.map((request: any, index: number) => (
                        //{" "}
                        <tr
                            key={request.id}
                            className={`text-center ${updateData}`}
                        >
                            <td className="">{index + 1}</td>
                            <td className="">
                                {request.letter_type.letter_name}
                            </td>
                            <td className="">{request.stage_name}</td>
                            <td className="">{request.status.status_name}</td>
                            <td>
                                <select
                                    name=""
                                    id=""
                                    className="w-full p-2 border rounded-lg"
                                    onChange={(e) =>
                                        handleUpdate({
                                            id: request.id,
                                            field: "to_stage_id",
                                            value: parseInt(e.target.value),
                                        })
                                    }
                                    defaultValue={request.request_approved?.id}
                                >
                                    <option value={-1}>Null</option>
                                    {data.map((stage: any) => (
                                        <option value={stage.id}>
                                            {stage.stage_name}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <select
                                    name=""
                                    id=""
                                    className="w-full p-2 border rounded-lg"
                                    onChange={(e) =>
                                        handleUpdate({
                                            id: request.id,
                                            field: "rejected_id",
                                            value: parseInt(e.target.value),
                                        })
                                    }
                                    defaultValue={request.request_rejected?.id}
                                >
                                    <option value={-1}>Null</option>
                                    {data.map((stage: any) => (
                                        <option value={stage.id}>
                                            {stage.stage_name}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td
                                className={`${
                                    user.role_id == 1 ? "" : "hidden"
                                }`}
                            >
                                <div className="flex gap-2">
                                    <button
                                        // onClick={() =>
                                        //     handleApprove(request.memo.id)
                                        // }
                                        className={`bg-green-500 p-2 mt-2 text-white rounded-lg
                                        `}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteStages(request.id)}
                                        className={`bg-red-500 p-2 mt-2 text-white rounded-lg
                                        `}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </table> */}
                <div className="mt-8">
                    <DataTable
                        statuses={statuses}
                        deleteStages={deleteStages}
                        user={user}
                        data={data}
                        columns={columns}
                        letter={letter}
                        role={role}
                        handleChange={handleChange}
                        handleUpdate={handleUpdate}
                        handleEdit={handleEdit}
                    />
                </div>

                {/* <button
                    onClick={handleSubmit}
                    className={`bg-blue-500 p-2 mt-2 text-white rounded-lg ${
                        user.role_id == 1 ? "hidden" : ""
                    }`}
                >
                    Buat Memo
                </button> */}
            </div>
        </SidebarAuthenticated>
    );
}
