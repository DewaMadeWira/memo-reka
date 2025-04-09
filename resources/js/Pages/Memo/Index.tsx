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
import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from "@/Components/ui/menubar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { ArrowRight } from "lucide-react";

export default function Index({
    request,
    division,
    userData,
    stages,
}: {
    request: any;
    division: any;
    userData: any;
    stages: any;
}) {
    console.log(userData);
    console.log(request);
    console.log(stages);
    const [formData, setFormData] = useState({
        request_name: "",
        perihal: "",
        content: "",
        to_division: null,
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
            <h1 className="text-xl font-bold">
                Divisi : {userData.division.division_name}
            </h1>
            <div className="flex gap-3">
                <a
                    href={`/memo`}
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
            </div>
            <table className="w-[80%]">
                <tr>
                    <th>Id</th>
                    <th>Request Name</th>
                    <th>Divisi Tujuan</th>
                    <th>Stages</th>
                    <th>Status</th>
                    <th>PDF</th>
                    <th className={`${user.role_id == 1 ? "" : "hidden"}`}>
                        Approval
                    </th>
                </tr>
                {request.map((request: any, index: number) => (
                    //{" "}
                    <tr key={request.id} className="">
                        <td className="">{index + 1}</td>
                        <td className="">{request.request_name}</td>
                        <td className="">
                            {request.memo.to_division.division_name}
                        </td>
                        <td className="text-center">
                            <Popover>
                                <PopoverTrigger>
                                    {request.stages.stage_name}
                                </PopoverTrigger>
                                <PopoverContent className="w-fit">
                                    <div className="">
                                        {/* {request.progress.map((step, index) => {
                                            let bgColor =
                                                "bg-gray-100 text-gray-800"; // default color

                                            if (step.id === request.stages_id) {
                                                bgColor =
                                                    "bg-blue-500 text-white";
                                            } else if (
                                                step.request_rejected &&
                                                step.request_rejected.id ===
                                                    request.stages_id
                                            ) {
                                                bgColor =
                                                    "bg-red-500 text-white";
                                            }

                                            return (
                                                <div
                                                    key={index}
                                                    className={`rounded-xl p-4 shadow transition-all ${bgColor}`}
                                                >
                                                    <div className="text-lg font-semibold">
                                                        {step.stage_name}
                                                    </div>
                                                    {step.request_rejected && (
                                                        <div className="text-sm opacity-80">
                                                            Rejected Stage:{" "}
                                                            {
                                                                step
                                                                    .request_rejected
                                                                    .stage_name
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })} */}
                                        <h4 className="text-sm">
                                            {request.stages.stage_name}
                                        </h4>
                                        <Menubar className="h-fit border-none shadow-none">
                                            {request.progress.map(
                                                (prog: any, index: number) => {
                                                    const currentStageIndex =
                                                        request.progress.findIndex(
                                                            (p: any) =>
                                                                p.id ===
                                                                request.stages_id
                                                        );

                                                    const rejectedStageIndex =
                                                        request.request_rejected
                                                            ? request.progress.findIndex(
                                                                  (p: any) =>
                                                                      p.id ===
                                                                      request
                                                                          .request_rejected
                                                                          .id
                                                              )
                                                            : -1;

                                                    // Pick the *lowest* index between red and blue stages
                                                    const targetStageIndex =
                                                        currentStageIndex === -1
                                                            ? rejectedStageIndex
                                                            : rejectedStageIndex ===
                                                              -1
                                                            ? currentStageIndex
                                                            : Math.min(
                                                                  currentStageIndex,
                                                                  rejectedStageIndex
                                                              );

                                                    const isBeforeTargetStage =
                                                        index <
                                                        targetStageIndex;

                                                    let triggerClass =
                                                        "w-44 h-7 border-[1px] border-gray-200"; // default

                                                    if (
                                                        prog.id ===
                                                        request.request_rejected
                                                            ?.id
                                                    ) {
                                                        triggerClass =
                                                            "bg-red-500 text-white w-44 h-7";
                                                    } else if (
                                                        prog.id ===
                                                        request.stages_id
                                                    ) {
                                                        triggerClass =
                                                            "bg-blue-500 text-white w-44 h-7";
                                                    } else if (
                                                        isBeforeTargetStage
                                                    ) {
                                                        triggerClass =
                                                            "bg-blue-200 text-black w-44 h-7"; // for stages before red or blue
                                                    }

                                                    return (
                                                        <div className="flex flex-col gap-2">
                                                            <MenubarMenu>
                                                                <div className="text-sm">
                                                                    <MenubarTrigger
                                                                        // className={`w-44 p-1${
                                                                        //     request.stages_id ===
                                                                        //     prog
                                                                        //         .request_rejected
                                                                        //         ?.id
                                                                        //         ? "bg-red-500 text-white"
                                                                        //         : prog.id ===
                                                                        //           request.stages_id
                                                                        //         ? "bg-blue-500 text-white"
                                                                        //         : ""
                                                                        // }
                                                                        //         `}
                                                                        className={
                                                                            request.stages_id ===
                                                                            prog
                                                                                .request_rejected
                                                                                ?.id
                                                                                ? "bg-red-500 text-white w-44 h-7 focus:bg-red-500 hover:bg-red-500 focus:hover:bg-red-500"
                                                                                : prog.id ===
                                                                                  request.stages_id
                                                                                ? "bg-blue-500 text-white w-44 h-7 focus:bg-blue-500 hover:bg-blue-500 focus:hover:bg-blue-500"
                                                                                : "w-44 h-7 border-[1px] border-gray-200"
                                                                        }
                                                                    ></MenubarTrigger>
                                                                </div>
                                                                <MenubarContent className="border-b border-gray-200 w-1/3">
                                                                    <div className="p-3 flex flex-col gap-1">
                                                                        <h4 className="text-base">
                                                                            <span className="font-bold">
                                                                                Tahapan
                                                                                :{" "}
                                                                            </span>
                                                                        </h4>
                                                                        <h4 className="text-sm">
                                                                            {
                                                                                prog.stage_name
                                                                            }
                                                                        </h4>
                                                                        <p className="text-xs">
                                                                            Lorem
                                                                            ipsum
                                                                            dolor
                                                                            sit,
                                                                            amet
                                                                            consectetur
                                                                            adipisicing
                                                                            elit.
                                                                            Pariatur,
                                                                            in.
                                                                            Laudantium
                                                                            ex
                                                                            molestias
                                                                            optio
                                                                            accusamus
                                                                            velit,
                                                                            nisi
                                                                            ducimus
                                                                            iusto
                                                                            vitae?
                                                                        </p>
                                                                        <div
                                                                            className={
                                                                                request.stages_id ===
                                                                                prog
                                                                                    .request_rejected
                                                                                    ?.id
                                                                                    ? ""
                                                                                    : "hidden"
                                                                            }
                                                                        >
                                                                            <h4 className="text-sm font-bold">
                                                                                Tahapan
                                                                                Ditolak
                                                                                Pada
                                                                                :{" "}
                                                                            </h4>
                                                                            <p className="text-xs">
                                                                                {
                                                                                    prog
                                                                                        .request_rejected
                                                                                        ?.stage_name
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    {/* <MenubarItem>
                                                            </MenubarItem> */}
                                                                </MenubarContent>
                                                            </MenubarMenu>
                                                            {/* <ArrowRight /> */}
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </Menubar>
                                    </div>
                                    {/* <div className="flex gap-2 w">
                                        {request.progress.map((prog: any) => (
                                            <div className="flex">
                                                <p>{prog.stage_name}</p>
                                                <p>{"=>"}</p>
                                            </div>
                                        ))}
                                    </div> */}
                                </PopoverContent>
                            </Popover>
                        </td>
                        <td className="text-center">
                            {request.stages.status.status_name}
                        </td>
                        <td className="text-center">
                            <a
                                href={`/memo/${request.memo.id}`}
                                // onClick={() => router.re}
                                className={`bg-blue-500 p-2 mt-2 text-white rounded-lg 
                                    `}
                            >
                                Lihat PDF
                            </a>
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
