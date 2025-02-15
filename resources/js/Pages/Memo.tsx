import { router } from "@inertiajs/react";
import React from "react";
import { usePage } from "@inertiajs/react";

export default function Memo({ memo }: { memo: any }) {
    const { user } = usePage().props.auth;
    console.log(user);
    console.log(memo);
    const handleSubmit = () => {
        router.post("/memo");
    };
    // const handleApprove = ({ id }: { id: number }) => {
    //     router.post("/memo-approve/" + id);
    // };
    function handleApprove(id: number) {
        router.post("/memo-approve/" + id);
    }
    return (
        <div className="w-full ">
            <h1 className="text-2xl font-bold">Memo</h1>
            <table className="w-[80%]">
                <tr>
                    <th>Id</th>
                    <th>Request Name</th>
                    <th>Stages</th>
                    <th>Status</th>
                    <th className={`${user.role_id == 1 ? "" : "hidden"}`}>
                        Approval
                    </th>
                </tr>
                {memo.map((memo: any) => (
                    //{" "}
                    <tr key={memo.id} className="">
                        <td className="">{memo.id}</td>
                        <td className="">{memo.request_name}</td>
                        <td className="text-center">
                            {memo.stages.stage_name}
                        </td>
                        <td className="text-center">
                            {memo.status.status_name}
                        </td>
                        <td className={`${user.role_id == 1 ? "" : "hidden"}`}>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleApprove(memo.id)}
                                    className={`bg-green-500 p-2 mt-2 text-white rounded-lg 
                                    `}
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={handleSubmit}
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
            <button
                onClick={handleSubmit}
                className={`bg-blue-500 p-2 mt-2 text-white rounded-lg ${
                    user.role_id == 1 ? "hidden" : ""
                }`}
            >
                Buat Memo
            </button>
        </div>
    );
}
