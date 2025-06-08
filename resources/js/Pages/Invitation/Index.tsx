import { Head, router } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import SidebarAuthenticated from "@/Layouts/SidebarAuthenticated";
import React, { useEffect, useState } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
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
import { Official } from "@/types/OfficialType";
import { Division } from "@/types/DivisionType";
import { DataTable } from "./invitation/data-table";
import { columns } from "./invitation/columns";
import { User } from "@/types/UserType";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/hooks/use-toast";

export interface UserWithDivision extends User {
    division: Division;
}
export default function Index({
    request,
    official,
    division,
    userData,
    all_user,
    
}: {
    request: any;
    official: Official[];
    division: Division[];
    userData: any;
    // all_user: UserWithDivision[];
    all_user: any;
}) {
    const { user } = usePage().props.auth as { user: User };
    const { toast } = useToast();
    console.log(user);
    console.log(all_user);
    console.log(request);
    const validateInvitationFormData = () => {
        const errors: string[] = [];

        if (!formData.request_name.trim()) {
            errors.push("Nama Permintaan Persetujuan");
        }
        if (!formData.perihal.trim()) {
            errors.push("Perihal");
        }
        if (!formData.content.trim()) {
            errors.push("Isi");
        }
        if (!formData.official.trim()) {
            errors.push("Pejabat");
        }
        if (!formData.hari_tanggal.trim()) {
            errors.push("Hari / Tanggal");
        }
        if (!formData.waktu.trim()) {
            errors.push("Waktu");
        }
        if (!formData.tempat.trim()) {
            errors.push("Tempat");
        }
        if (!formData.agenda.trim()) {
            errors.push("Agenda");
        }
        if (!formData.to_division) {
            errors.push("Divisi Tujuan");
        }
        if (!formData.invited_users || formData.invited_users.length === 0) {
            errors.push("Peserta Undangan");
        }

        return errors;
    };

    const handleInvitationInputValidation = () => {
        const emptyFields = validateInvitationFormData();

        if (emptyFields.length > 0) {
            toast({
                title: "Peringatan",
                description: `Harap lengkapi field berikut: ${emptyFields.join(
                    ", "
                )}`,
                variant: "destructive",
            });
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        if (!handleInvitationInputValidation()) {
            return;
        }

        router.post("/request?intent=invitation.create", formData, {
            onError: (errors) => {
                toast({
                    title: "Terjadi Kesalahan !",
                    description: errors.message,
                    variant: "destructive",
                });
                console.log(errors);
            },
            onSuccess: () => {
                toast({
                    className: "bg-green-500 text-white",
                    title: "Berhasil !",
                    description: "Undangan Rapat berhasil dibuat",
                });
                router.visit(window.location.pathname, {
                    preserveScroll: true,
                });
            },
        });
    };
    // const handleApprove = ({ id }: { id: number }) => {
    //     router.post("/invite-approve/" + id);
    // };
    function handleApprove(id: number) {
        router.put("/request/" + id + "?intent=invitation.approve");
    }
    function handleReject(id: number, rejectionReason: string) {
        router.put("/request/" + id + "?intent=invitation.reject", {
            rejection_reason: rejectionReason,
        });
    }
    function handleUpdate(id: number) {
        console.log(formData);
        router.put("/undangan-rapat/" + id, formData, {
            onError: (errors) => {
                toast({
                    title: "Terjadi Kesalahan !",
                    description: errors.message,
                    variant: "destructive",
                });
                console.log(errors);
            },
            onSuccess: () => {
                toast({
                    className: "bg-green-500 text-white",
                    title: "Berhasil !",
                    description: "Undangan Rapat berhasil diubah",
                });
                router.visit(window.location.pathname, {
                    preserveScroll: true,
                });
            },
        });
    }
    const [formData, setFormData] = useState({
        request_name: "",
        perihal: "",
        content: "",
        official: "",
        hari_tanggal: "",
        waktu: "",
        tempat: "",
        agenda: "",
        to_division: null,
        invited_users: [] as string[],
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [visibleUsers, setVisibleUsers] = useState(2);
    const [filteredUsers, setFilteredUsers] = useState<UserWithDivision[]>([]);

    useEffect(() => {
        // First filter users based on search query
        let filtered = all_user.filter(
            (user: any) =>
                user.nama_pengguna
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                user.division.division_code
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
        );

        // Then sort the filtered list to put selected users at the top
        filtered = [...filtered].sort((a, b) => {
            const aSelected = formData.invited_users.includes(a.id.toString());
            const bSelected = formData.invited_users.includes(b.id.toString());

            if (aSelected && !bSelected) return -1;
            if (!aSelected && bSelected) return 1;
            return 0;
        });

        setFilteredUsers(filtered);
    }, [searchQuery, all_user, formData.invited_users]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    return (
        <SidebarAuthenticated>
            <Head title="Undangan Rapat" />
            <div className="w-full p-10 bg-white">
                <Breadcrumb className="mb-6">
                    {/* <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="">Manajemen</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Manajemen Divisi</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList> */}
                </Breadcrumb>
                <div className="flex justify-between items-center">
                    <div className="">
                        <h1 className="text-2xl font-semibold">
                            Undangan Rapat
                        </h1>
                        <h1 className="text-xl font-medium mt-2">
                            Divisi : {userData.division.division_name}
                        </h1>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger
                            className={`bg-blue-500 p-2 mt-2 text-white text-sm font-medium rounded-lg ${
                                user.role_id == 1 ? "hidden" : ""
                            }`}
                        >
                            Buat Undangan Rapat
                        </AlertDialogTrigger>
                        <AlertDialogContent className="w-[300rem]">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="font-medium">
                                    Buat Undangan Rapat Baru
                                </AlertDialogTitle>
                                <ScrollArea className="h-[500px] w-full pr-4">
                                    <div className="">
                                        <label
                                            htmlFor="perihal"
                                            className="block mb-2"
                                        >
                                            Nama Permintaan Persetujuan
                                        </label>
                                        <input
                                            onChange={handleChange}
                                            type="text"
                                            name="request_name"
                                            id=""
                                            className="w-full p-2 border rounded-lg"
                                        />
                                        <label
                                            htmlFor="perihal"
                                            className="block mb-2"
                                        >
                                            Perihal
                                        </label>
                                        <input
                                            onChange={handleChange}
                                            type="text"
                                            name="perihal"
                                            id=""
                                            className="w-full p-2 border rounded-lg"
                                        />
                                        <label
                                            htmlFor="content"
                                            className="block mb-2"
                                        >
                                            Isi
                                        </label>
                                        <textarea
                                            onChange={handleChange}
                                            rows={10}
                                            name="content"
                                            id=""
                                            className="w-full p-2 border rounded-lg"
                                        />
                                        <label
                                            htmlFor="hari_tanggal"
                                            className="block mb-2"
                                        >
                                            Hari / tanggal
                                        </label>
                                        <input
                                            onChange={handleChange}
                                            type="date"
                                            name="hari_tanggal"
                                            id=""
                                            className="w-full p-2 border rounded-lg"
                                        />
                                        <label
                                            htmlFor="waktu"
                                            className="block mb-2"
                                        >
                                            Waktu
                                        </label>
                                        <input
                                            onChange={handleChange}
                                            type="text"
                                            name="waktu"
                                            id=""
                                            className="w-full p-2 border rounded-lg"
                                        />
                                        <label
                                            htmlFor="tempat"
                                            className="block mb-2"
                                        >
                                            Tempat
                                        </label>
                                        <input
                                            onChange={handleChange}
                                            type="text"
                                            name="tempat"
                                            id=""
                                            className="w-full p-2 border rounded-lg"
                                        />
                                        <label
                                            htmlFor="agenda"
                                            className="block mb-2"
                                        >
                                            Agenda
                                        </label>
                                        <input
                                            onChange={handleChange}
                                            type="text"
                                            name="agenda"
                                            id=""
                                            className="w-full p-2 border rounded-lg"
                                        />
                                        <label
                                            htmlFor="official"
                                            className="block mb-2"
                                        >
                                            Pejabat
                                        </label>
                                        <select
                                            name="official"
                                            id=""
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-lg"
                                        >
                                            <option value="">
                                                Pilih Pejabat
                                            </option>
                                            {official.map((offi) => (
                                                <option value={offi.id}>
                                                    {offi.official_name}
                                                </option>
                                            ))}
                                        </select>
                                        <label
                                            htmlFor="to_division"
                                            className="block mb-2"
                                        >
                                            Divisi Tujuan
                                        </label>
                                        <select
                                            name="to_division"
                                            id=""
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-lg"
                                        >
                                            <option value="">
                                                Pilih Divisi
                                            </option>
                                            {division.map((divi: any) => (
                                                <option value={divi.id}>
                                                    {divi.division_name}
                                                </option>
                                            ))}
                                        </select>

                                        <label className="block mb-2 mt-4 font-medium">
                                            Undang Peserta
                                        </label>

                                        <div className="border rounded-lg p-3 max-h-48 overflow-y-auto">
                                            <div className="mb-2">
                                                <input
                                                    type="text"
                                                    placeholder="Search users..."
                                                    value={searchQuery}
                                                    onChange={(e) =>
                                                        setSearchQuery(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full mb-2"
                                                />
                                            </div>

                                            {filteredUsers
                                                .slice(0, visibleUsers)
                                                .map((user: any) => {
                                                    const isSelected =
                                                        formData.invited_users.includes(
                                                            user.id.toString()
                                                        );

                                                    return (
                                                        <div
                                                            key={user.id}
                                                            className={`flex w-[70%] justify-between mb-2 p-1 ${
                                                                isSelected
                                                                    ? "bg-blue-50 rounded border border-blue-200"
                                                                    : ""
                                                            }`}
                                                        >
                                                            <label
                                                                htmlFor={`user-${user.id}`}
                                                                className={`text-sm ${
                                                                    isSelected
                                                                        ? "font-medium"
                                                                        : ""
                                                                }`}
                                                            >
                                                                {
                                                                    user.nama_pengguna
                                                                }{" "}
                                                                <span className="text-gray-500">
                                                                    (
                                                                    {
                                                                        user
                                                                            .division
                                                                            .division_code
                                                                    }
                                                                    )
                                                                </span>
                                                            </label>
                                                            <input
                                                                type="checkbox"
                                                                id={`user-${user.id}`}
                                                                value={user.id}
                                                                checked={
                                                                    isSelected
                                                                }
                                                                className="ml-2 h-4 w-4"
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const userId =
                                                                        e.target
                                                                            .value;
                                                                    const isChecked =
                                                                        e.target
                                                                            .checked;

                                                                    setFormData(
                                                                        (
                                                                            prevData
                                                                        ) => {
                                                                            const currentUsers =
                                                                                prevData.invited_users ||
                                                                                [];

                                                                            if (
                                                                                isChecked
                                                                            ) {
                                                                                return {
                                                                                    ...prevData,
                                                                                    invited_users:
                                                                                        [
                                                                                            ...currentUsers,
                                                                                            userId,
                                                                                        ],
                                                                                };
                                                                            } else {
                                                                                return {
                                                                                    ...prevData,
                                                                                    invited_users:
                                                                                        currentUsers.filter(
                                                                                            (
                                                                                                id
                                                                                            ) =>
                                                                                                id !==
                                                                                                userId
                                                                                        ),
                                                                                };
                                                                            }
                                                                        }
                                                                    );
                                                                }}
                                                            />
                                                        </div>
                                                    );
                                                })}

                                            {filteredUsers.length >
                                                visibleUsers && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full mt-2"
                                                    onClick={() =>
                                                        setVisibleUsers(
                                                            (prev) => prev + 5
                                                        )
                                                    }
                                                >
                                                    Show More
                                                </Button>
                                            )}

                                            {formData.invited_users.length >
                                                0 && (
                                                <div className="mt-2 text-sm text-blue-600 font-medium">
                                                    {
                                                        formData.invited_users
                                                            .length
                                                    }{" "}
                                                    user(s) selected
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </ScrollArea>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Kembali</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-blue-500 font-normal hover:bg-blue-600"
                                    // onClick={handleSubmit}

                                    onClick={() => {
                                        if (handleInvitationInputValidation()) {
                                            handleSubmit();
                                        }
                                    }}
                                >
                                    Buat Undangan Rapat
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                {/* <div className="flex gap-3">
                    <a
                        href={`/Undangan Rapat`}
                        // onClick={() => router.re}
                        className={`bg-blue-500 p-2 mt-2 text-white rounded-lg
                                        `}
                    >
                        All Memo
                    </a>
                    <a
                        href={`/memo?intent=memo.internal`}
                        // onClick={() => router.re}
                        className={`bg-blue-500 p-2 mt-2 text-white rounded-lg
                                        `}
                    >
                        Memo Internal
                    </a>
                    <a
                        href={`/memo?intent=memo.eksternal`}
                        // onClick={() => router.re}
                        className={`bg-blue-500 p-2 mt-2 text-white rounded-lg
                                        `}
                    >
                        Memo Eksternal
                    </a>
                </div> */}

                <div className="mt-8">
                    <DataTable
                        user={user}
                        handleApprove={handleApprove}
                        handleReject={handleReject}
                        data={request}
                        columns={columns}
                        formData={formData}
                        setFormData={setFormData}
                        handleChange={handleChange}
                        // setFilePreview={setFilePreview}
                        // setFileData={setFileData}
                        // filePreview={filePreview}
                        // fileData={fileData}
                        // handleUpload={handleFileUpload}
                        // handleUpdate={() => {
                        //     return null;
                        // }}
                        handleUpdate={handleUpdate}
                        handleUpload={function (id: number): void {
                            throw new Error("Function not implemented.");
                        }}
                        setFilePreview={function (
                            value: React.SetStateAction<string | null>
                        ): void {
                            throw new Error("Function not implemented.");
                        }}
                        setFileData={function (
                            value: React.SetStateAction<{
                                file: File | null;
                                memo_id: number;
                                fileName: string;
                            } | null>
                        ): void {
                            throw new Error("Function not implemented.");
                        }}
                        filePreview={null}
                        fileData={null}
                        official={official}
                        division={division}
                    />
                </div>
                {/*  */}

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
        // <div className="w-full ">
        //     <h1 className="text-2xl font-bold">Undangan Rapat</h1>
        //     <table className="w-[80%]">
        //         <tr>
        //             <th>Id</th>
        //             <th>Request Name</th>
        //             <th>Stages</th>
        //             <th>Status</th>
        //             <th className={`${user.role_id == 1 ? "" : "hidden"}`}>
        //                 Approval
        //             </th>
        //         </tr>
        //         {request.map((request: any) => (
        //             //{" "}
        //             <tr key={request.id} className="">
        //                 <td className="">{request.id}</td>
        //                 <td className="">{request.request_name}</td>
        //                 <td className="text-center">
        //                     {request.stages.stage_name}
        //                 </td>
        //                 <td className="text-center">
        //                     {request.stages.status.status_name}
        //                 </td>
        //                 <td className={`${user.role_id == 1 ? "" : "hidden"}`}>
        //                     <div className="flex gap-2">
        //                         <button
        //                             onClick={() =>
        //                                 handleApprove(request.invite.id)
        //                             }
        //                             className={`bg-green-500 p-2 mt-2 text-white rounded-lg
        //                             `}
        //                         >
        //                             Approve
        //                         </button>
        //                         <button
        //                             onClick={() =>
        //                                 handleReject(request.invite.id)
        //                             }
        //                             className={`bg-red-500 p-2 mt-2 text-white rounded-lg
        //                             `}
        //                         >
        //                             Reject
        //                         </button>
        //                     </div>
        //                 </td>
        //                 {/* //{" "} */}
        //             </tr>
        //         ))}
        //     </table>
        //     <button
        //         onClick={handleSubmit}
        //         className={`bg-blue-500 p-2 mt-2 text-white rounded-lg ${
        //             user.role_id == 1 ? "hidden" : ""
        //         }`}
        //     >
        //         Buat Memo
        //     </button>
        // </div>
    );
}
