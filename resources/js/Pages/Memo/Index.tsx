import { router } from "@inertiajs/react";
import React, { useState } from "react";
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

export default function Index({
    request,
    division,
}: {
    request: any;
    division: any;
}) {
    console.log(request);
    console.log(division);
    const [formData, setFormData] = useState({
        request_name: "",
        perihal: "",
        content: "",
        to_division: 0,
    });
    const { user } = usePage().props.auth;
    console.log(user);
    console.log(request);
    const handleSubmit = () => {
        console.log(formData);
        router.post("/request?intent=memo.create", formData);
    };
    // const handleApprove = ({ id }: { id: number }) => {
    //     router.post("/memo-approve/" + id);
    // };
    function handleApprove(id: number) {
        router.put("/request/" + id + "?intent=memo.approve");
    }
    function handleReject(id: number) {
        router.put("/request/" + id + "?intent=memo.reject");
    }
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="w-full ">
            <h1 className="text-2xl font-bold">Memo</h1>
            <table className="w-[80%]">
                <tr>
                    <th>Id</th>
                    <th>Request Name</th>
                    <th>Stages</th>
                    <th>Status</th>
                    <th>PDF</th>
                    <th className={`${user.role_id == 1 ? "" : "hidden"}`}>
                        Approval
                    </th>
                </tr>
                {request.map((request: any) => (
                    //{" "}
                    <tr key={request.id} className="">
                        <td className="">{request.id}</td>
                        <td className="">{request.request_name}</td>
                        <td className="text-center">
                            {request.stages.stage_name}
                        </td>
                        <td className="text-center">
                            {request.stages.status.status_name}
                        </td>
                        <td className="text-center">
                            <button
                                // onClick={() => handleApprove(request.memo.id)}
                                className={`bg-blue-500 p-2 mt-2 text-white rounded-lg 
                                    `}
                            >
                                Lihat PDF
                            </button>
                        </td>
                        <td className={`${user.role_id == 1 ? "" : "hidden"}`}>
                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        handleApprove(request.memo.id)
                                    }
                                    className={`bg-green-500 p-2 mt-2 text-white rounded-lg 
                                    `}
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() =>
                                        handleReject(request.memo.id)
                                    }
                                    className={`bg-red-500 p-2 mt-2 text-white rounded-lg 
                                    `}
                                >
                                    Reject
                                </button>
                            </div>
                        </td>
                        {/* //{" "} */}
                    </tr>
                ))}
            </table>
            <AlertDialog>
                <AlertDialogTrigger
                    className={`bg-blue-500 p-2 mt-2 text-white rounded-lg ${
                        user.role_id == 1 ? "hidden" : ""
                    }`}
                >
                    Buat Memo
                </AlertDialogTrigger>
                <AlertDialogContent className="w-[300rem]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Buat Memo Baru</AlertDialogTitle>
                        <div className="">
                            <label htmlFor="perihal" className="block mb-2">
                                Nama Permintaan Persetujuan
                            </label>
                            <input
                                onChange={handleChange}
                                type="text"
                                name="request_name"
                                id=""
                                className="w-full p-2 border rounded-lg"
                            />
                            <label htmlFor="perihal" className="block mb-2">
                                Perihal
                            </label>
                            <input
                                onChange={handleChange}
                                type="text"
                                name="perihal"
                                id=""
                                className="w-full p-2 border rounded-lg"
                            />
                            <label htmlFor="content" className="block mb-2">
                                Isi
                            </label>
                            <textarea
                                onChange={handleChange}
                                rows={10}
                                name="content"
                                id=""
                                className="w-full p-2 border rounded-lg"
                            />
                            <label htmlFor="to_division" className="block mb-2">
                                Divisi Tujuan
                            </label>
                            <select
                                name="to_division"
                                id=""
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg"
                            >
                                {division.map((divi: any) => (
                                    <option value={divi.id}>
                                        {divi.division_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSubmit}>
                            Buat Memo
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* <button
                onClick={handleSubmit}
                className={`bg-blue-500 p-2 mt-2 text-white rounded-lg ${
                    user.role_id == 1 ? "hidden" : ""
                }`}
            >
                Buat Memo
            </button> */}
        </div>
    );
}
