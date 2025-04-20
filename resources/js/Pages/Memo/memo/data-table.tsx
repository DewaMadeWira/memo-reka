"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    SortingState,
    getSortedRowModel,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";

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
import { Button } from "@/Components/ui/button";
import { useState } from "react";
import { Memo } from "@/types/MemoType";
import { RequestLetter } from "@/types/RequestType";
import { User } from "@/types/UserType";
import { PDFViewer } from "@react-pdf/renderer";
import Template from "@/Pages/Pdf/Template";

interface DataTableProps<TData extends RequestLetter, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    user: User;
    // handleDelete: (id: number) => void;
    // handleChange: (
    //     e: React.ChangeEvent<
    //         HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    //     >
    // ) => void;
    handleApprove: (id: number) => void;
    handleReject: (id: number) => void;
    handleUpload: (id: number) => void;
    // request_file_upload: number;
    // formData: {
    //     role_name: string;
    // };
    setFilePreview: React.Dispatch<React.SetStateAction<string | null>>;
    setFileData: React.Dispatch<
        React.SetStateAction<{
            file: File | null;
            memo_id: number;
            fileName: string;
        } | null>
    >;
    filePreview: string | null;
    fileData: {
        file: File | null;
        memo_id: number;
        fileName: string;
    } | null;
}

export function DataTable<TData extends RequestLetter, TValue>({
    columns,
    data,
    handleApprove,
    handleReject,
    user,
    fileData,
    filePreview,
    setFileData,
    setFilePreview,
    handleUpload,
}: // request_file_upload,
// handleDelete,
// role,

// division,
// formData,
// setFormData,
DataTableProps<TData, TValue>) {
    // console.log(request_file_upload);
    const [sorting, setSorting] = useState<SortingState>([]);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 2, // or whatever default page size you want
    });

    const setEdit = (data: any) => {
        // alert("Edit");
        // console.log(data);
        // setFormData(data);
        // setFormData({
        //     role_name: data.role_name,
        // });
        // console.log(formData);
    };
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onPaginationChange: setPagination,
        state: {
            sorting,
            pagination,
        },
    });

    return (
        <div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {/* <TableHead className="text-center">
                                    Nomor
                                </TableHead> */}
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className="text-center"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                                <TableHead className="text-center">
                                    Tahapan
                                </TableHead>
                                <TableHead
                                // className={
                                //     user.role_id != 1
                                //         ? "hidden"
                                //         : "text-center"
                                // }
                                >
                                    Aksi
                                </TableHead>
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row, index) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                    className="text-center"
                                >
                                    {/* <TableCell>{index + 1}</TableCell> */}
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                    <TableCell>
                                        <Popover>
                                            <PopoverTrigger>
                                                {row.original.stages.stage_name}
                                            </PopoverTrigger>
                                            <PopoverContent className="w-fit">
                                                <div className="">
                                                    <h4 className="text-sm">
                                                        {
                                                            row.original.stages
                                                                .stage_name
                                                        }
                                                    </h4>
                                                    <Menubar className="h-fit border-none shadow-none">
                                                        {row.original.progress.map(
                                                            (
                                                                prog: any,
                                                                index: number
                                                            ) => {
                                                                const currentStageIndex =
                                                                    row.original.progress.findIndex(
                                                                        (
                                                                            p: any
                                                                        ) =>
                                                                            p.id ===
                                                                            row
                                                                                .original
                                                                                .stages_id
                                                                    );
                                                                const rejectedStageIndex =
                                                                    row.original
                                                                        .request_rejected
                                                                        ? row.original.progress.findIndex(
                                                                              (
                                                                                  p: any
                                                                              ) =>
                                                                                  p.id ===
                                                                                  row
                                                                                      .original
                                                                                      .request_rejected
                                                                                      .id
                                                                          )
                                                                        : -1;
                                                                // Pick the *lowest* index between red and blue stages
                                                                const targetStageIndex =
                                                                    currentStageIndex ===
                                                                    -1
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
                                                                    row.original
                                                                        .request_rejected
                                                                        ?.id
                                                                ) {
                                                                    triggerClass =
                                                                        "bg-red-500 text-white w-44 h-7";
                                                                } else if (
                                                                    prog.id ===
                                                                    row.original
                                                                        .stages_id
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
                                                                                    className={
                                                                                        row
                                                                                            .original
                                                                                            .stages_id ===
                                                                                        prog
                                                                                            .request_rejected
                                                                                            ?.id
                                                                                            ? "bg-red-500 text-white w-44 h-7 focus:bg-red-500 hover:bg-red-500 focus:hover:bg-red-500"
                                                                                            : prog.id ===
                                                                                              row
                                                                                                  .original
                                                                                                  .stages_id
                                                                                            ? "bg-emerald-500 text-white w-44 h-7 focus:bg-emerald-500 hover:bg-emerald-500 focus:hover:bg-blue-500"
                                                                                            : "w-44 h-7 border-[1px] border-gray-200"
                                                                                    }
                                                                                ></MenubarTrigger>
                                                                            </div>
                                                                            <MenubarContent className="border-b border-gray-200 w-1/3">
                                                                                <div className="p-3 flex flex-col gap-1">
                                                                                    <h4 className="text-base">
                                                                                        <span className="font-semibold">
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
                                                                                        {
                                                                                            prog.description
                                                                                        }
                                                                                    </p>
                                                                                    <div
                                                                                        className={
                                                                                            row
                                                                                                .original
                                                                                                .stages_id ===
                                                                                            prog
                                                                                                .request_rejected
                                                                                                ?.id
                                                                                                ? ""
                                                                                                : "hidden"
                                                                                        }
                                                                                    >
                                                                                        <MenubarSeparator className="bg-slate-300"></MenubarSeparator>
                                                                                        <h4 className="text-sm font-semibold mt-2">
                                                                                            Tahapan
                                                                                            Ditolak
                                                                                            Pada
                                                                                            :{" "}
                                                                                        </h4>
                                                                                        <p className="text-sm mt-1">
                                                                                            {
                                                                                                prog
                                                                                                    .request_rejected
                                                                                                    ?.stage_name
                                                                                            }
                                                                                        </p>
                                                                                        <p className="text-xs mt-1">
                                                                                            {
                                                                                                prog
                                                                                                    .request_rejected
                                                                                                    ?.description
                                                                                            }
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </MenubarContent>
                                                                        </MenubarMenu>
                                                                    </div>
                                                                );
                                                            }
                                                        )}
                                                    </Menubar>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                    <TableCell
                                    // className={
                                    //     user.role_id != 1 ? "hidden" : ""
                                    // }
                                    >
                                        <div className="flex gap-2 justify-center">
                                            <div className="flex gap-2">
                                                <>
                                                    {row.original.stages
                                                        .is_external == 1
                                                        ? row.original.memo
                                                              .to_division.id ==
                                                              user.division_id && (
                                                              <>
                                                                  <button
                                                                      onClick={() =>
                                                                          handleApprove(
                                                                              row
                                                                                  .original
                                                                                  .memo
                                                                                  .id
                                                                          )
                                                                      }
                                                                      className={
                                                                          user.role_id !=
                                                                          1
                                                                              ? "hidden"
                                                                              : `bg-green-500 p-2 mt-2 text-white rounded-lg
                                                                                            `
                                                                      }
                                                                  >
                                                                      Approve
                                                                  </button>
                                                                  <button
                                                                      onClick={() =>
                                                                          handleReject(
                                                                              row
                                                                                  .original
                                                                                  .memo
                                                                                  .id
                                                                          )
                                                                      }
                                                                      className={
                                                                          user.role_id !=
                                                                          1
                                                                              ? "hidden"
                                                                              : `bg-red-500 p-2 mt-2 text-white rounded-lg
                                                                                            `
                                                                      }
                                                                  >
                                                                      Reject
                                                                  </button>
                                                              </>
                                                          )
                                                        : row.original.memo
                                                              .from_division
                                                              .id ==
                                                              user.division_id && (
                                                              <>
                                                                  <button
                                                                      onClick={() =>
                                                                          handleApprove(
                                                                              row
                                                                                  .original
                                                                                  .memo
                                                                                  .id
                                                                          )
                                                                      }
                                                                      className={
                                                                          user.role_id !=
                                                                          1
                                                                              ? "hidden"
                                                                              : `bg-green-500 p-2 mt-2 text-white rounded-lg
                                                                                            `
                                                                      }
                                                                  >
                                                                      Approve
                                                                  </button>
                                                                  <button
                                                                      onClick={() =>
                                                                          handleReject(
                                                                              row
                                                                                  .original
                                                                                  .memo
                                                                                  .id
                                                                          )
                                                                      }
                                                                      className={
                                                                          user.role_id !=
                                                                          1
                                                                              ? "hidden"
                                                                              : `bg-red-500 p-2 mt-2 text-white rounded-lg
                                                                                            `
                                                                      }
                                                                  >
                                                                      Reject
                                                                  </button>
                                                              </>
                                                          )}
                                                </>
                                                <AlertDialog>
                                                    <AlertDialogTrigger>
                                                        <button
                                                            // onClick={() =>
                                                            //     handleApprove(
                                                            //         row.original.memo.id
                                                            //     )
                                                            // }
                                                            className={`bg-blue-500 p-2 mt-2 text-white rounded-lg
                                        `}
                                                        >
                                                            Lihat PDF
                                                        </button>{" "}
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="w-full max-w-7xl">
                                                        <AlertDialogHeader className="">
                                                            <AlertDialogTitle>
                                                                Preview PDF
                                                            </AlertDialogTitle>
                                                            <div className="">
                                                                <PDFViewer className="w-full h-[80vh]">
                                                                    <Template
                                                                        data={
                                                                            row
                                                                                .original
                                                                                .memo
                                                                        }
                                                                    />
                                                                </PDFViewer>
                                                            </div>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel className="bg-blue-500 text-white">
                                                                Kembali
                                                            </AlertDialogCancel>
                                                            {/* <AlertDialogAction>
                                                                Continue
                                                            </AlertDialogAction> */}
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                                <AlertDialog>
                                                    <AlertDialogTrigger>
                                                        {row.original.memo
                                                            .file_path !=
                                                        null ? (
                                                            <button
                                                                className={
                                                                    row.original
                                                                        .stages
                                                                        .requires_file_upload !=
                                                                    1
                                                                        ? "hidden"
                                                                        : `bg-blue-500 p-2 mt-2 text-white rounded-lg`
                                                                }
                                                            >
                                                                Lihat File
                                                            </button>
                                                        ) : user.role_id !=
                                                          1 ? (
                                                            <button
                                                                className={
                                                                    row.original
                                                                        .stages
                                                                        .requires_file_upload !=
                                                                    1
                                                                        ? "hidden"
                                                                        : `bg-blue-500 p-2 mt-2 text-white rounded-lg`
                                                                }
                                                            >
                                                                Upload File
                                                            </button>
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </AlertDialogTrigger>
                                                    {row.original.memo
                                                        .file_path != null ? (
                                                        <AlertDialogContent className="w-full max-w-7xl">
                                                            <AlertDialogHeader className="">
                                                                <AlertDialogTitle>
                                                                    Preview File
                                                                </AlertDialogTitle>
                                                                <div className="flex w-full h-[50vh] justify-center items-center">
                                                                    <img
                                                                        src={`memo-file/${row.original.memo.file_path}`}
                                                                        alt=""
                                                                    />
                                                                    {/* <PDFViewer className="w-full h-[80vh]">
                                                                    <Template
                                                                        data={
                                                                            row
                                                                                .original
                                                                                .memo
                                                                        }
                                                                    />
                                                                </PDFViewer> */}
                                                                </div>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel className="bg-blue-500 text-white">
                                                                    Kembali
                                                                </AlertDialogCancel>
                                                                {/* <AlertDialogAction>
                                                                Continue
                                                            </AlertDialogAction> */}
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    ) : (
                                                        <AlertDialogContent className="w-full">
                                                            <AlertDialogHeader className="">
                                                                <AlertDialogTitle>
                                                                    Upload File
                                                                </AlertDialogTitle>
                                                                <div className="">
                                                                    <div className="">
                                                                        <div className="mb-4">
                                                                            <label
                                                                                htmlFor="fileUpload"
                                                                                className="block text-sm font-medium mb-2"
                                                                            >
                                                                                Upload
                                                                                File
                                                                                (Hanya
                                                                                gambar
                                                                                )
                                                                            </label>
                                                                            <input
                                                                                type="file"
                                                                                id="fileUpload"
                                                                                name="fileUpload"
                                                                                accept="image/*"
                                                                                className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
                                                                                onChange={(
                                                                                    e
                                                                                ) => {
                                                                                    const file =
                                                                                        e
                                                                                            .target
                                                                                            .files?.[0];
                                                                                    if (
                                                                                        file
                                                                                    ) {
                                                                                        const reader =
                                                                                            new FileReader();
                                                                                        reader.onload =
                                                                                            (
                                                                                                event
                                                                                            ) => {
                                                                                                setFilePreview(
                                                                                                    event
                                                                                                        .target
                                                                                                        ?.result as string
                                                                                                );
                                                                                            };
                                                                                        reader.readAsDataURL(
                                                                                            file
                                                                                        );
                                                                                        setFileData(
                                                                                            {
                                                                                                file: file,
                                                                                                memo_id:
                                                                                                    row
                                                                                                        .original
                                                                                                        .memo
                                                                                                        .id,
                                                                                                fileName:
                                                                                                    file.name,
                                                                                            }
                                                                                        );
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </div>

                                                                        {filePreview && (
                                                                            <div className="mt-4 mb-4">
                                                                                <h4 className="text-sm font-medium mb-2">
                                                                                    Preview:
                                                                                </h4>
                                                                                <div className="border rounded-md p-2 max-w-md">
                                                                                    <img
                                                                                        src={
                                                                                            filePreview
                                                                                        }
                                                                                        alt="File Preview"
                                                                                        className="max-h-48 max-w-full mx-auto"
                                                                                    />
                                                                                    <p className="text-xs text-center mt-2 text-gray-500">
                                                                                        {
                                                                                            fileData?.fileName
                                                                                        }
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* <input type="file" /> */}
                                                                    {/* <PDFViewer className="w-full h-[80vh]">
                                                                    <Template
                                                                        data={
                                                                            row
                                                                                .original
                                                                                .memo
                                                                        }
                                                                    />
                                                                </PDFViewer> */}
                                                                </div>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel className=" ">
                                                                    Kembali
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    className="bg-blue-500 text-white"
                                                                    onClick={() =>
                                                                        handleUpload(
                                                                            row
                                                                                .original
                                                                                .id
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        !fileData?.file
                                                                    }
                                                                >
                                                                    Upload
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    )}
                                                </AlertDialog>
                                            </div>
                                            {/* <AlertDialog>
                                                <AlertDialogTrigger
                                                    onClick={() =>
                                                        setEdit(row.original)
                                                    }
                                                    className="p-2 bg-emerald-500 text-white rounded-md"
                                                >
                                                    Edit
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle className="">
                                                            Edit Role "
                                                            {
                                                                (
                                                                    row.original as {
                                                                        role_name: string;
                                                                    }
                                                                ).role_name
                                                            }
                                                            "
                                                        </AlertDialogTitle>
                                                        <div className="flex flex-col gap-3">
                                                            <div className="flex flex-col gap-2">
                                                                <label htmlFor="name">
                                                                    Nama Role
                                                                </label>
                                                                <input
                                                                    // onChange={
                                                                    //     handleChange
                                                                    // }
                                                                    className=" rounded-md"
                                                                    type="text"
                                                                    id="role_name"
                                                                    name="role_name"
                                                                    // value={
                                                                    //     formData.role_name
                                                                    // }
                                                                />
                                                            </div>
                                                        </div>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Kembali
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            // onClick={() =>
                                                            //     handleUpdate(
                                                            //         Number(
                                                            //             (
                                                            //                 row.original as {
                                                            //                     id: number;
                                                            //                 }
                                                            //             ).id
                                                            //         )
                                                            //     )
                                                            // }
                                                            className="bg-blue-500"
                                                        >
                                                            Simpan
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog> */}

                                            {/* <AlertDialog>
                                                <AlertDialogTrigger>
                                                    Hapus
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Apakah anda yakin ?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Data yang dipilih
                                                            akan dihapus
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Kembali
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                        // onClick={() =>
                                                        //     handleDelete(
                                                        //         Number(
                                                        //             (
                                                        //                 row.original as {
                                                        //                     id: number;
                                                        //                 }
                                                        //             ).id
                                                        //         )
                                                        //     )
                                                        // }
                                                        >
                                                            Hapus
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog> */}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
