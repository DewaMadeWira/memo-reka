import { router } from "@inertiajs/react";
import React from "react";

export default function Memo({ memo }: { memo: any }) {
    console.log(memo);
    const handleSubmit = () => {
        router.post("/memo");
    };
    return (
        <div className="w-full ">
            <h1 className="text-2xl font-bold">Memo</h1>
            <table className="w-[80%]">
                <tr>
                    <th>Request Name</th>
                    <th>Stages</th>
                    <th>Status</th>
                </tr>
                {memo.map((memo: any) => (
                    //{" "}
                    <tr key={memo.id} className="">
                        <td className="">{memo.request_name}</td>
                        <td className="text-center">
                            {memo.stages.stage_name}
                        </td>
                        <td className="text-center">
                            {memo.status.status_name}
                        </td>
                        {/* //{" "} */}
                    </tr>
                ))}
            </table>
            <button
                onClick={handleSubmit}
                className="bg-blue-500 p-2 mt-2 text-white rounded-lg "
            >
                Buat Memo
            </button>
        </div>
    );
}
