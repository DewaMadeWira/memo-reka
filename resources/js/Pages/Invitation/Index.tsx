import { router } from "@inertiajs/react";
import React from "react";
import { usePage } from "@inertiajs/react";

export default function Index({ request }: { request: any }) {
    const { user } = usePage().props.auth;
    console.log(user);
    console.log(request);
    const handleSubmit = () => {
        router.post("/request?intent=invitation.create");
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
    return (
        <div className="w-full ">
            <h1 className="text-2xl font-bold">Undangan Rapat</h1>
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
                        <td className={`${user.role_id == 1 ? "" : "hidden"}`}>
                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        handleApprove(request.invite.id)
                                    }
                                    className={`bg-green-500 p-2 mt-2 text-white rounded-lg 
                                    `}
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() =>
                                        handleReject(request.invite.id)
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
