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
import { DataTable } from "./summary/data-table";
import { columns } from "./summary/columns";
import { User } from "@/types/UserType";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Invitation } from "@/types/InvitationType";

export interface UserWithDivision extends User {
    division: Division;
}
export default function Index({
    request,
    official,
    division,
    userData,
    all_user,
    invite,
}: {
    request: any;
    official: Official[];
    division: Division[];
    userData: any;
    all_user: UserWithDivision[];
    invite: Invitation[];
}) {
    const { user } = usePage().props.auth as { user: User };
    const { toast } = useToast();
    console.log(user);
    console.log(all_user);
    console.log(request);
    const [formData, setFormData] = useState({
        invitation_id: null as number | null,
        file: null as File | null,
        request_name: "",
    });
    const handleSummaryFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({
                ...formData,
                file: e.target.files[0],
            });
        }
    };

    const handleSummarySubmit = (invitationId: number) => {
        // const formData = new FormData();
        // formData.append("invitation_id", invitationId.toString());
        console.log(formData);

        router.post("/request?intent=summary.create", formData, {
            forceFormData: true,
            onError: (errors) => {
                toast({
                    title: "Terjadi Kesalahan!",
                    description: errors.message,
                    variant: "destructive",
                });
                console.log(errors);
            },
            onSuccess: () => {
                toast({
                    className: "bg-green-500 text-white",
                    title: "Berhasil!",
                    description: "Risalah Rapat berhasil diunggah",
                });
                setFormData({
                    invitation_id: null,
                    file: null,
                    request_name: "",
                });
                router.reload();
            },
        });
    };
    // const handleApprove = ({ id }: { id: number }) => {
    //     router.post("/invite-approve/" + id);
    // };
    function handleApprove(id: number) {
        router.put("/request/" + id + "?intent=summary.approve");
    }
    function handleReject(id: number, rejectionReason: string) {
        router.put("/request/" + id + "?intent=summary.reject", {
            rejection_reason: rejectionReason,
        });
    }
    function handleUpdate(id: number) {
        console.log("Original file object:", formData.file);

        // Create a proper FormData object
        const data = new FormData();
        if (formData.file) {
            data.append("file", formData.file);
            data.append("name", "mamamia");

            // Better debugging to confirm the file was appended
            console.log("File name:", formData.file.name);
            console.log("File size:", formData.file.size);

            // You can iterate over the FormData entries to see what's actually in it
            // This is the correct way to check FormData contents
            for (let pair of data.entries()) {
                console.log(pair[0] + ": " + pair[1]);
            }
        } else {
            console.error("No file to upload!");
            return; // Don't proceed if there's no file
        }

        router.post("/risalah-rapat/update/" + id, data, {
            forceFormData: true,
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
                router.reload();
            },
        });
    }

    const [searchQuery, setSearchQuery] = useState("");
    const [visibleUsers, setVisibleUsers] = useState(2);
    const [filteredUsers, setFilteredUsers] = useState<UserWithDivision[]>([]);

    // useEffect(() => {
    //     // First filter users based on search query
    //     let filtered = all_user.filter(
    //         (user) =>
    //             user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //             user.division.division_code
    //                 .toLowerCase()
    //                 .includes(searchQuery.toLowerCase())
    //     );

    //     // Then sort the filtered list to put selected users at the top
    //     filtered = [...filtered].sort((a, b) => {
    //         const aSelected = formData.invited_users.includes(a.id.toString());
    //         const bSelected = formData.invited_users.includes(b.id.toString());

    //         if (aSelected && !bSelected) return -1;
    //         if (!aSelected && bSelected) return 1;
    //         return 0;
    //     });

    //     setFilteredUsers(filtered);
    // }, [searchQuery, all_user, formData.invited_users]);

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
            <Head title="Risalah Rapat" />
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
                            Risalah Rapat
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
                            Unggah Risalah Rapat
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="font-medium">
                                    Unggah Risalah Rapat
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Pilih undangan rapat dan unggah file risalah
                                    rapat
                                </AlertDialogDescription>

                                <div className="mt-4">
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
                                        htmlFor="invitation_id"
                                        className="block mb-2"
                                    >
                                        Undangan Rapat
                                    </label>
                                    <select
                                        id="invitation_id"
                                        className="w-full p-2 border rounded-lg"
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                invitation_id: parseInt(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        value={formData.invitation_id || ""}
                                    >
                                        <option value="">
                                            Pilih Undangan Rapat
                                        </option>
                                        {invite.map((req: any) => (
                                            <option
                                                key={req.id}
                                                value={req.invite.id}
                                            >
                                                {req.request_name}
                                            </option>
                                        ))}
                                    </select>

                                    <label
                                        htmlFor="file"
                                        className="block mb-2 mt-4"
                                    >
                                        File Risalah Rapat
                                    </label>
                                    <input
                                        type="file"
                                        id="file"
                                        className="w-full p-2 border rounded-lg"
                                        onChange={handleSummaryFileChange}
                                    />

                                    {formData.file && (
                                        <div className="mt-2 text-sm text-green-600">
                                            File selected: {formData.file.name}
                                        </div>
                                    )}
                                </div>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-green-500 font-normal hover:bg-green-600"
                                    onClick={() => {
                                        if (
                                            formData.invitation_id &&
                                            formData.file
                                        ) {
                                            handleSummarySubmit(
                                                formData.invitation_id
                                            );
                                        } else {
                                            toast({
                                                title: "Peringatan",
                                                description:
                                                    "Harap pilih undangan dan file risalah rapat",
                                                variant: "destructive",
                                            });
                                        }
                                    }}
                                >
                                    Unggah Risalah
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

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
                        handleSummaryFileChange={handleSummaryFileChange}
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
