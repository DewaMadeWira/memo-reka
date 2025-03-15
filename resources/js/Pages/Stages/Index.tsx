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

export default function Index({ data }: { data: any }) {
    console.log(data);
    const [formData, setFormData] = useState({
        request_name: "",
        perihal: "",
        content: "",
        to_division: null,
    });
    const { user } = usePage().props.auth;
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
    function deleteStages(id: number) {
        router.delete("/stages/" + id);
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
            <h1 className="text-2xl font-bold">Stages</h1>
            <h1 className="text-xl font-bold">
                {/* Divisi : {userData.division.division_name} */}
            </h1>
            <div className="flex gap-3"></div>
            <table className="w-[80%]">
                <tr>
                    <th>Id</th>
                    <th>Stage Name</th>
                    <th>Stage Status</th>
                    <th>Stage Conditions</th>
                    {/* <th>Stage Sequence</th> */}
                    <th>To Stage ID</th>
                    <th>Rejected ID</th>
                </tr>
                {data.map((request: any, index: number) => (
                    //{" "}
                    <tr key={request.id} className="text-center">
                        <td className="">{index + 1}</td>
                        <td className="">{request.stage_name}</td>
                        <td className="">{request.status.status_name}</td>
                        <td className="">{request.conditions}</td>
                        {/* <td className="">{request.sequence}</td> */}
                        <td className="text-center">
                            {request.request_approved?.stage_name}
                        </td>
                        <td className="text-center">
                            {request.request_rejected?.stage_name}
                        </td>
                        <td className={`${user.role_id == 1 ? "" : "hidden"}`}>
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
                        {/* //{" "} */}
                    </tr>
                ))}
            </table>
            <AlertDialog>
                <AlertDialogTrigger
                    className={`bg-blue-500 p-2 mt-2 text-white rounded-lg ${
                        user.role_id == 2 ? "hidden" : ""
                    }`}
                >
                    Buat Stages Baru
                </AlertDialogTrigger>
                <AlertDialogContent className="w-[300rem]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Buat Stages Baru</AlertDialogTitle>
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
                                {/* <option value="">Pilih Divisi</option>
                                {division.map((divi: any) => (
                                    <option value={divi.id}>
                                        {divi.division_name}
                                    </option>
                                ))} */}
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
