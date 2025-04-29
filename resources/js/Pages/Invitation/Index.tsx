import { Head, router } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import SidebarAuthenticated from "@/Layouts/SidebarAuthenticated";
import React, { useState } from "react";
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

export default function Index({
    request,
    official,
    division,
    userData,
}: {
    request: any;
    official: Official[];
    division: Division[];
    userData: any;
}) {
    const { user } = usePage().props.auth as { user: User };
    console.log(user);
    console.log(request);
    const handleSubmit = () => {
        router.post("/request?intent=invitation.create", formData);
    };
    // const handleApprove = ({ id }: { id: number }) => {
    //     router.post("/invite-approve/" + id);
    // };
    function handleApprove(id: number) {
        router.put("/request/" + id + "?intent=invitation.approve");
    }
    function handleReject(id: number) {
        router.put("/request/" + id + "?intent=invitation.reject");
    }
    const [formData, setFormData] = useState({
        request_name: "",
        perihal: "",
        content: "",
        official: "",
        to_division: null,
    });
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
                                        <option value="">Pilih Pejabat</option>
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
                                        <option value="">Pilih Divisi</option>
                                        {division.map((divi: any) => (
                                            <option value={divi.id}>
                                                {divi.division_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Kembali</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-blue-500 font-normal hover:bg-blue-600"
                                    onClick={handleSubmit}
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
                        handleUpdate={() => {
                            return null;
                        }}
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
