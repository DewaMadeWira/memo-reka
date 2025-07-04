"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    SortingState,
    getSortedRowModel,
    ColumnFiltersState,
    getFilteredRowModel,
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";

import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { useState } from "react";
import { Memo } from "@/types/MemoType";
import { RequestLetter } from "@/types/RequestType";
import { User } from "@/types/UserType";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import Template from "@/Pages/Pdf/Template";
import {
    Check,
    FileSearch,
    FileText,
    FileUp,
    Info,
    Pencil,
    X,
} from "lucide-react";
import { Textarea } from "@/Components/ui/textarea";
import { ImagePreview } from "../PreviewImage";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { StageProgressBar } from "../ProgressBar";
export interface FileUploadData {
    files: File[];
    memo_id: number;
    fileNames: string[];
}
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
    // handleReject: (id: number) => void;
    handleReject: (id: number, rejectionReason?: string) => void;
    handleUpdate: (id: number) => void;
    handleUpload: (id: number) => void;

    // request_file_upload: number;
    formData: {
        request_name: string;
        perihal: string;
        content: string;
        official: string;
        to_division: null;
        previous_memo: null;
    };
    setFormData: React.Dispatch<
        React.SetStateAction<{
            perihal: string;
            content: string;
            request_name: string;
            official: string;
            to_division: null;
            previous_memo: null;
        }>
    >;
    handleChange: (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => void;
    // setFilePreview: React.Dispatch<React.SetStateAction<string | null>>;
    // setFileData: React.Dispatch<
    //     React.SetStateAction<{
    //         file: File | null;
    //         memo_id: number;
    //         fileName: string;
    //     } | null>
    // >;
    // filePreview: string | null;
    // fileData: {
    //     file: File | null;
    //     memo_id: number;
    //     fileName: string;
    // } | null;
    filePreview: string[];
    setFilePreview: React.Dispatch<React.SetStateAction<string[]>>;
    fileData: FileUploadData | null;
    setFileData: React.Dispatch<React.SetStateAction<FileUploadData | null>>;
    handleFileSelection: (files: FileList | null, memo_id: number) => void;
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
    formData,
    setFormData,
    handleChange,
    handleUpdate,
    handleFileSelection,
}: // request_file_upload,
// handleDelete,
// role,

// division,
// formData,
// setFormData,
DataTableProps<TData, TValue>) {
    // console.log(request_file_upload);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 30, // or whatever default page size you want
    });

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
    const [previewImages, setPreviewImages] = useState<Array<any>>([]);

    const navigateNext = (imagesCount: number) => {
        setCurrentImageIndex((prev) => (prev + 1) % imagesCount);
    };

    const navigatePrev = (imagesCount: number) => {
        setCurrentImageIndex((prev) => (prev - 1 + imagesCount) % imagesCount);
    };

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
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            pagination,
            columnFilters,
        },
    });

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

    const [rejectionReason, setRejectionReason] = useState<string>("");

    const actionButtonClass =
        "bg-blue-500 p-2 text-white rounded-lg text-sm font-normal w-fit";
    const rejectButtonClass =
        "bg-red-500 p-2  text-white rounded-lg text-sm font-normal  w-fit";
    const approveButtonClass =
        "bg-green-500 p-2  text-white rounded-lg text-sm font-normal w-fit";

    return (
        <div>
            <div className="flex items-center py-4">
                <Input
                    placeholder="Cari Surat ..."
                    value={
                        (table
                            .getColumn("request_name")
                            ?.getFilterValue() as string) ?? ""
                    }
                    onChange={(event) =>
                        table
                            .getColumn("request_name")
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>
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
                                                    {/* <Menubar className="h-fit border-none shadow-none">
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
                                                    </Menubar> */}
                                                    <StageProgressBar
                                                        row={row as any}
                                                    ></StageProgressBar>
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
                                            <div className="flex gap-3">
                                                <>
                                                    {/* PDF Preview Button */}
                                                    <AlertDialog>
                                                        <AlertDialogTrigger>
                                                            <button
                                                                className={`${actionButtonClass} flex items-center gap-2`}
                                                            >
                                                                <FileText
                                                                // size={20}
                                                                />
                                                                {/* <span>
                                                                    Preview PDF
                                                                </span> */}
                                                            </button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className="w-full max-w-7xl">
                                                            <AlertDialogHeader className="">
                                                                <AlertDialogTitle>
                                                                    Preview PDF
                                                                </AlertDialogTitle>
                                                                <div className="">
                                                                    <div className="mb-2">
                                                                        <p className="text-sm">
                                                                            Tahapan
                                                                            surat
                                                                            saat
                                                                            ini
                                                                            :{" "}
                                                                        </p>
                                                                        <p className=" ">
                                                                            {
                                                                                row
                                                                                    .original
                                                                                    .stages
                                                                                    .stage_name
                                                                            }
                                                                        </p>
                                                                    </div>
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
                                                            <AlertDialogFooter className=" items-center">
                                                                {/* All other action buttons moved here */}
                                                                <div className="flex items-center justify-center gap-1 ">
                                                                    {/* Approve Button */}
                                                                    {row
                                                                        .original
                                                                        .stages
                                                                        .is_external ==
                                                                    1
                                                                        ? row
                                                                              .original
                                                                              .memo!
                                                                              .to_division
                                                                              .id ==
                                                                              user.division_id && (
                                                                              <TooltipProvider
                                                                                  delayDuration={
                                                                                      100
                                                                                  }
                                                                                  skipDelayDuration={
                                                                                      0
                                                                                  }
                                                                              >
                                                                                  <Tooltip>
                                                                                      <TooltipTrigger
                                                                                          className={
                                                                                              user.role_id !=
                                                                                                  row
                                                                                                      .original
                                                                                                      .stages
                                                                                                      .approver_id ||
                                                                                              row
                                                                                                  .original
                                                                                                  .stages
                                                                                                  .to_stage_id ==
                                                                                                  null
                                                                                                  ? "hidden"
                                                                                                  : ""
                                                                                          }
                                                                                      >
                                                                                          <button
                                                                                              onClick={() =>
                                                                                                  handleApprove(
                                                                                                      row
                                                                                                          .original
                                                                                                          .memo!
                                                                                                          .id
                                                                                                  )
                                                                                              }
                                                                                              className={
                                                                                                  user.role_id !=
                                                                                                      row
                                                                                                          .original
                                                                                                          .stages
                                                                                                          .approver_id ||
                                                                                                  row
                                                                                                      .original
                                                                                                      .stages
                                                                                                      .to_stage_id ==
                                                                                                      null
                                                                                                      ? "hidden"
                                                                                                      : `${approveButtonClass} flex items-center gap-2 mr-1 ${
                                                                                                            row
                                                                                                                .original
                                                                                                                .stages
                                                                                                                .requires_file_upload ==
                                                                                                                1 &&
                                                                                                            row
                                                                                                                .original
                                                                                                                .memo!
                                                                                                                .images
                                                                                                                .length ==
                                                                                                                0
                                                                                                                ? "opacity-50 cursor-not-allowed"
                                                                                                                : ""
                                                                                                        }`
                                                                                              }
                                                                                              disabled={
                                                                                                  row
                                                                                                      .original
                                                                                                      .stages
                                                                                                      .requires_file_upload ==
                                                                                                      1 &&
                                                                                                  row
                                                                                                      .original
                                                                                                      .memo!
                                                                                                      .images
                                                                                                      .length ==
                                                                                                      0
                                                                                              }
                                                                                          >
                                                                                              <Check
                                                                                                  size={
                                                                                                      20
                                                                                                  }
                                                                                              />
                                                                                              <span>
                                                                                                  Setujui
                                                                                              </span>
                                                                                          </button>
                                                                                      </TooltipTrigger>
                                                                                      <TooltipContent
                                                                                          side="top"
                                                                                          sideOffset={
                                                                                              10
                                                                                          }
                                                                                      >
                                                                                          {row
                                                                                              .original
                                                                                              .stages
                                                                                              .requires_file_upload ==
                                                                                              1 &&
                                                                                          row
                                                                                              .original
                                                                                              .memo!
                                                                                              .images
                                                                                              .length ==
                                                                                              0 ? (
                                                                                              <p>
                                                                                                  File
                                                                                                  Belum
                                                                                                  Diupload.
                                                                                              </p>
                                                                                          ) : (
                                                                                              <p>
                                                                                                  Setujui
                                                                                                  Memo
                                                                                              </p>
                                                                                          )}
                                                                                      </TooltipContent>
                                                                                  </Tooltip>
                                                                              </TooltipProvider>
                                                                          )
                                                                        : row
                                                                              .original
                                                                              .memo!
                                                                              .from_division
                                                                              .id ==
                                                                              user.division_id && (
                                                                              <button
                                                                                  onClick={() =>
                                                                                      handleApprove(
                                                                                          row
                                                                                              .original
                                                                                              .memo!
                                                                                              .id
                                                                                      )
                                                                                  }
                                                                                  className={
                                                                                      user.role_id !=
                                                                                          row
                                                                                              .original
                                                                                              .stages
                                                                                              .approver_id ||
                                                                                      row
                                                                                          .original
                                                                                          .stages
                                                                                          .to_stage_id ==
                                                                                          null
                                                                                          ? "hidden"
                                                                                          : `${approveButtonClass} flex items-center gap-2`
                                                                                  }
                                                                              >
                                                                                  <TooltipProvider
                                                                                      delayDuration={
                                                                                          100
                                                                                      }
                                                                                      skipDelayDuration={
                                                                                          0
                                                                                      }
                                                                                  >
                                                                                      <Tooltip>
                                                                                          <TooltipTrigger className="flex items-center gap-2">
                                                                                              <Check
                                                                                                  size={
                                                                                                      20
                                                                                                  }
                                                                                              />
                                                                                              <span>
                                                                                                  Setujui
                                                                                              </span>
                                                                                          </TooltipTrigger>
                                                                                          <TooltipContent
                                                                                              side="top"
                                                                                              sideOffset={
                                                                                                  10
                                                                                              }
                                                                                          >
                                                                                              <p>
                                                                                                  Setujui
                                                                                                  Memo
                                                                                              </p>
                                                                                          </TooltipContent>
                                                                                      </Tooltip>
                                                                                  </TooltipProvider>
                                                                              </button>
                                                                          )}

                                                                    {/* Rejection Info Button */}
                                                                    <AlertDialog>
                                                                        <AlertDialogTrigger>
                                                                            <button
                                                                                className={
                                                                                    row
                                                                                        .original
                                                                                        .memo!
                                                                                        .rejection_reason
                                                                                        ? `${actionButtonClass} bg-yellow-500 flex items-center `
                                                                                        : "hidden"
                                                                                }
                                                                            >
                                                                                <TooltipProvider
                                                                                    delayDuration={
                                                                                        100
                                                                                    }
                                                                                    skipDelayDuration={
                                                                                        0
                                                                                    }
                                                                                >
                                                                                    <Tooltip>
                                                                                        <TooltipTrigger className="flex items-center gap-2">
                                                                                            <Info
                                                                                                size={
                                                                                                    20
                                                                                                }
                                                                                            />
                                                                                            <span>
                                                                                                Lihat
                                                                                                Alasan
                                                                                            </span>
                                                                                        </TooltipTrigger>
                                                                                        <TooltipContent
                                                                                            side="top"
                                                                                            sideOffset={
                                                                                                10
                                                                                            }
                                                                                        >
                                                                                            <p>
                                                                                                Lihat
                                                                                                Alasan
                                                                                                Penolakan
                                                                                            </p>
                                                                                        </TooltipContent>
                                                                                    </Tooltip>
                                                                                </TooltipProvider>
                                                                            </button>
                                                                        </AlertDialogTrigger>
                                                                        <AlertDialogContent>
                                                                            <AlertDialogHeader>
                                                                                <AlertDialogTitle>
                                                                                    Alasan
                                                                                    Penolakan
                                                                                    Memo
                                                                                </AlertDialogTitle>
                                                                                <AlertDialogDescription>
                                                                                    <div className="mt-2 p-4 bg-gray-50 rounded-md border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                                                                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                                            Ditolak
                                                                                            pada
                                                                                            tahap:
                                                                                        </p>
                                                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                                                            {row
                                                                                                .original
                                                                                                .stages
                                                                                                .stage_name ||
                                                                                                "Tidak diketahui"}
                                                                                        </p>
                                                                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                                            Alasan
                                                                                            penolakan:
                                                                                        </p>
                                                                                        <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                                                                                            {row
                                                                                                .original
                                                                                                .memo!
                                                                                                .rejection_reason ||
                                                                                                "Tidak ada alasan yang diberikan"}
                                                                                        </p>
                                                                                    </div>
                                                                                </AlertDialogDescription>
                                                                            </AlertDialogHeader>
                                                                            <AlertDialogFooter>
                                                                                <AlertDialogCancel className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white">
                                                                                    Tutup
                                                                                </AlertDialogCancel>
                                                                            </AlertDialogFooter>
                                                                        </AlertDialogContent>
                                                                    </AlertDialog>

                                                                    {/* Reject Button */}
                                                                    <AlertDialog>
                                                                        <AlertDialogTrigger>
                                                                            <button
                                                                                className={
                                                                                    user.role_id !=
                                                                                        row
                                                                                            .original
                                                                                            .stages
                                                                                            .approver_id ||
                                                                                    row
                                                                                        .original
                                                                                        .stages
                                                                                        .rejected_id ==
                                                                                        null ||
                                                                                    (row
                                                                                        .original
                                                                                        .stages
                                                                                        .is_external ==
                                                                                        1 &&
                                                                                        row
                                                                                            .original
                                                                                            .memo!
                                                                                            .from_division
                                                                                            .id ==
                                                                                            user.division_id)
                                                                                        ? "hidden"
                                                                                        : `${rejectButtonClass} flex items-center gap-2`
                                                                                }
                                                                            >
                                                                                <TooltipProvider
                                                                                    delayDuration={
                                                                                        100
                                                                                    }
                                                                                    skipDelayDuration={
                                                                                        0
                                                                                    }
                                                                                >
                                                                                    <Tooltip>
                                                                                        <TooltipTrigger className="flex items-center gap-2">
                                                                                            <X
                                                                                                size={
                                                                                                    20
                                                                                                }
                                                                                            />
                                                                                            <span>
                                                                                                Tolak
                                                                                            </span>
                                                                                        </TooltipTrigger>
                                                                                        <TooltipContent
                                                                                            side="top"
                                                                                            sideOffset={
                                                                                                10
                                                                                            }
                                                                                        >
                                                                                            <p>
                                                                                                Tolak
                                                                                                Memo
                                                                                            </p>
                                                                                        </TooltipContent>
                                                                                    </Tooltip>
                                                                                </TooltipProvider>
                                                                            </button>
                                                                        </AlertDialogTrigger>
                                                                        <AlertDialogContent>
                                                                            <AlertDialogHeader>
                                                                                <AlertDialogTitle>
                                                                                    Alasan
                                                                                    Penolakan
                                                                                </AlertDialogTitle>
                                                                                <AlertDialogDescription>
                                                                                    Mohon
                                                                                    berikan
                                                                                    alasan
                                                                                    penolakan
                                                                                    memo
                                                                                    ini.
                                                                                </AlertDialogDescription>
                                                                                <div className="mt-4">
                                                                                    <Textarea
                                                                                        placeholder="Alasan penolakan..."
                                                                                        value={
                                                                                            rejectionReason
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            setRejectionReason(
                                                                                                e
                                                                                                    .target
                                                                                                    .value
                                                                                            )
                                                                                        }
                                                                                        className="w-full min-h-[100px]"
                                                                                    />
                                                                                </div>
                                                                            </AlertDialogHeader>
                                                                            <AlertDialogFooter>
                                                                                <AlertDialogCancel
                                                                                    onClick={() =>
                                                                                        setRejectionReason(
                                                                                            ""
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    Batal
                                                                                </AlertDialogCancel>
                                                                                <AlertDialogAction
                                                                                    onClick={() => {
                                                                                        handleReject(
                                                                                            row
                                                                                                .original
                                                                                                .memo!
                                                                                                .id,
                                                                                            rejectionReason
                                                                                        );
                                                                                        setRejectionReason(
                                                                                            ""
                                                                                        );
                                                                                    }}
                                                                                    className="bg-red-500 hover:bg-red-600"
                                                                                    disabled={
                                                                                        rejectionReason.trim() ===
                                                                                        ""
                                                                                    }
                                                                                >
                                                                                    Tolak
                                                                                    Memo
                                                                                </AlertDialogAction>
                                                                            </AlertDialogFooter>
                                                                        </AlertDialogContent>
                                                                    </AlertDialog>

                                                                    {/* Edit Button */}
                                                                    <AlertDialog
                                                                        open={
                                                                            editDialogOpen
                                                                        }
                                                                        onOpenChange={
                                                                            setEditDialogOpen
                                                                        }
                                                                    >
                                                                        <AlertDialogTrigger
                                                                            onClick={() =>
                                                                                setFormData(
                                                                                    {
                                                                                        official:
                                                                                            "",
                                                                                        request_name:
                                                                                            "",
                                                                                        to_division:
                                                                                            null,
                                                                                        perihal:
                                                                                            row
                                                                                                .original
                                                                                                .memo!
                                                                                                .perihal,
                                                                                        content:
                                                                                            row
                                                                                                .original
                                                                                                .memo!
                                                                                                .content,
                                                                                        previous_memo:
                                                                                            null,
                                                                                    }
                                                                                )
                                                                            }
                                                                            className={`${actionButtonClass} flex items-center gap-2 ${
                                                                                row
                                                                                    .original
                                                                                    .stages
                                                                                    .is_fixable ==
                                                                                    1 &&
                                                                                row
                                                                                    .original
                                                                                    .stages
                                                                                    .approver_id ==
                                                                                    user.role_id
                                                                                    ? ""
                                                                                    : "hidden"
                                                                            }`}
                                                                        >
                                                                            <Pencil
                                                                                size={
                                                                                    20
                                                                                }
                                                                            />
                                                                            <span>
                                                                                Edit
                                                                            </span>
                                                                        </AlertDialogTrigger>
                                                                        <AlertDialogContent className="w-[300rem]">
                                                                            <AlertDialogHeader>
                                                                                <AlertDialogTitle className="font-medium">
                                                                                    Edit
                                                                                    Memo{" "}
                                                                                    {
                                                                                        row
                                                                                            .original
                                                                                            .memo!
                                                                                            .memo_number
                                                                                    }
                                                                                </AlertDialogTitle>
                                                                                <div className="">
                                                                                    <label
                                                                                        htmlFor="perihal"
                                                                                        className="block mb-2"
                                                                                    >
                                                                                        Perihal
                                                                                    </label>
                                                                                    <input
                                                                                        onChange={
                                                                                            handleChange
                                                                                        }
                                                                                        type="text"
                                                                                        name="perihal"
                                                                                        className="w-full p-2 border rounded-lg"
                                                                                        value={
                                                                                            formData.perihal
                                                                                        }
                                                                                    />
                                                                                    <label
                                                                                        htmlFor="content"
                                                                                        className="block mb-2"
                                                                                    >
                                                                                        Isi
                                                                                    </label>
                                                                                    <textarea
                                                                                        onChange={
                                                                                            handleChange
                                                                                        }
                                                                                        rows={
                                                                                            10
                                                                                        }
                                                                                        name="content"
                                                                                        className="w-full p-2 border rounded-lg"
                                                                                        value={
                                                                                            formData.content
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                            </AlertDialogHeader>
                                                                            <AlertDialogFooter>
                                                                                <AlertDialogCancel>
                                                                                    Kembali
                                                                                </AlertDialogCancel>
                                                                                <AlertDialogAction
                                                                                    onClick={() =>
                                                                                        handleUpdate(
                                                                                            row
                                                                                                .original
                                                                                                .memo!
                                                                                                .id
                                                                                        )
                                                                                    }
                                                                                    className="bg-blue-500 font-normal hover:bg-blue-600"
                                                                                >
                                                                                    Simpan
                                                                                    Perubahan
                                                                                    Memo
                                                                                </AlertDialogAction>
                                                                            </AlertDialogFooter>
                                                                        </AlertDialogContent>
                                                                    </AlertDialog>

                                                                    {/* Upload Files Button */}
                                                                    <AlertDialog>
                                                                        <AlertDialogTrigger>
                                                                            {user.role_id !=
                                                                                1 && (
                                                                                <button
                                                                                    // className={
                                                                                    //     row
                                                                                    //         .original
                                                                                    //         .stages
                                                                                    //         .requires_file_upload !=
                                                                                    //         1 ||
                                                                                    //     row
                                                                                    //         .original
                                                                                    //         .memo!
                                                                                    //         .to_division
                                                                                    //         .id !=
                                                                                    //         user.division_id
                                                                                    //         ? "hidden"
                                                                                    //         : `${actionButtonClass} flex items-center gap-2`
                                                                                    // }
                                                                                    className={
                                                                                        row
                                                                                            .original
                                                                                            .stages
                                                                                            .requires_file_upload !=
                                                                                        1
                                                                                            ? "hidden"
                                                                                            : `${actionButtonClass} flex items-center gap-2`
                                                                                    }
                                                                                >
                                                                                    <TooltipProvider
                                                                                        delayDuration={
                                                                                            100
                                                                                        }
                                                                                        skipDelayDuration={
                                                                                            0
                                                                                        }
                                                                                    >
                                                                                        <Tooltip>
                                                                                            <TooltipTrigger className="flex items-center gap-2">
                                                                                                <FileUp
                                                                                                    size={
                                                                                                        20
                                                                                                    }
                                                                                                />
                                                                                                <span>
                                                                                                    Unggah
                                                                                                    File
                                                                                                </span>
                                                                                            </TooltipTrigger>
                                                                                            <TooltipContent
                                                                                                side="top"
                                                                                                sideOffset={
                                                                                                    10
                                                                                                }
                                                                                            >
                                                                                                <p>
                                                                                                    Upload
                                                                                                    File
                                                                                                </p>
                                                                                            </TooltipContent>
                                                                                        </Tooltip>
                                                                                    </TooltipProvider>
                                                                                </button>
                                                                            )}
                                                                        </AlertDialogTrigger>
                                                                        <AlertDialogContent className="w-full">
                                                                            <AlertDialogHeader>
                                                                                <AlertDialogTitle>
                                                                                    Upload
                                                                                    File
                                                                                </AlertDialogTitle>
                                                                                <div>
                                                                                    <div className="mt-4">
                                                                                        <label
                                                                                            htmlFor="file-upload"
                                                                                            className="block text-sm font-medium text-gray-700"
                                                                                        >
                                                                                            Upload
                                                                                            Bukti
                                                                                        </label>
                                                                                        <input
                                                                                            type="file"
                                                                                            id="file-upload"
                                                                                            multiple
                                                                                            accept=".jpg,.jpeg,.png"
                                                                                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                                                            onChange={(
                                                                                                e
                                                                                            ) =>
                                                                                                handleFileSelection(
                                                                                                    e
                                                                                                        .target
                                                                                                        .files,
                                                                                                    row
                                                                                                        .original
                                                                                                        .memo!
                                                                                                        .id
                                                                                                )
                                                                                            }
                                                                                        />
                                                                                        {filePreview.length >
                                                                                            0 && (
                                                                                            <ScrollArea>
                                                                                                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                                                                    {filePreview.map(
                                                                                                        (
                                                                                                            preview,
                                                                                                            index
                                                                                                        ) => (
                                                                                                            <div
                                                                                                                key={
                                                                                                                    index
                                                                                                                }
                                                                                                                className="relative"
                                                                                                            >
                                                                                                                {preview ? (
                                                                                                                    <img
                                                                                                                        src={
                                                                                                                            preview
                                                                                                                        }
                                                                                                                        alt={`Preview ${
                                                                                                                            index +
                                                                                                                            1
                                                                                                                        }`}
                                                                                                                        className="h-24 w-full object-cover rounded-md"
                                                                                                                    />
                                                                                                                ) : (
                                                                                                                    <div className="h-24 w-full flex items-center justify-center bg-gray-100 rounded-md">
                                                                                                                        <span className="text-gray-500">
                                                                                                                            Non-image
                                                                                                                            file
                                                                                                                        </span>
                                                                                                                    </div>
                                                                                                                )}
                                                                                                                <button
                                                                                                                    type="button"
                                                                                                                    className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1"
                                                                                                                    onClick={() => {
                                                                                                                        if (
                                                                                                                            fileData
                                                                                                                        ) {
                                                                                                                            const newFiles =
                                                                                                                                [
                                                                                                                                    ...fileData.files,
                                                                                                                                ];
                                                                                                                            const newFileNames =
                                                                                                                                [
                                                                                                                                    ...fileData.fileNames,
                                                                                                                                ];
                                                                                                                            const newPreviews =
                                                                                                                                [
                                                                                                                                    ...filePreview,
                                                                                                                                ];
                                                                                                                            newFiles.splice(
                                                                                                                                index,
                                                                                                                                1
                                                                                                                            );
                                                                                                                            newFileNames.splice(
                                                                                                                                index,
                                                                                                                                1
                                                                                                                            );
                                                                                                                            newPreviews.splice(
                                                                                                                                index,
                                                                                                                                1
                                                                                                                            );
                                                                                                                            if (
                                                                                                                                newFiles.length ===
                                                                                                                                0
                                                                                                                            ) {
                                                                                                                                setFileData(
                                                                                                                                    null
                                                                                                                                );
                                                                                                                                setFilePreview(
                                                                                                                                    []
                                                                                                                                );
                                                                                                                            } else {
                                                                                                                                setFileData(
                                                                                                                                    {
                                                                                                                                        ...fileData,
                                                                                                                                        files: newFiles,
                                                                                                                                        fileNames:
                                                                                                                                            newFileNames,
                                                                                                                                    }
                                                                                                                                );
                                                                                                                                setFilePreview(
                                                                                                                                    newPreviews
                                                                                                                                );
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }}
                                                                                                                >
                                                                                                                    <svg
                                                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                                                        className="h-4 w-4"
                                                                                                                        fill="none"
                                                                                                                        viewBox="0 0 24 24"
                                                                                                                        stroke="currentColor"
                                                                                                                    >
                                                                                                                        <path
                                                                                                                            strokeLinecap="round"
                                                                                                                            strokeLinejoin="round"
                                                                                                                            strokeWidth={
                                                                                                                                2
                                                                                                                            }
                                                                                                                            d="M6 18L18 6M6 6l12 12"
                                                                                                                        />
                                                                                                                    </svg>
                                                                                                                </button>
                                                                                                            </div>
                                                                                                        )
                                                                                                    )}
                                                                                                </div>
                                                                                            </ScrollArea>
                                                                                        )}

                                                                                        {/* File names display */}
                                                                                        {fileData &&
                                                                                            fileData.fileNames &&
                                                                                            fileData
                                                                                                .fileNames
                                                                                                .length >
                                                                                                0 && (
                                                                                                <div className="mt-2">
                                                                                                    <p className="text-sm font-medium text-gray-700">
                                                                                                        Selected
                                                                                                        files:
                                                                                                    </p>
                                                                                                    <ul className="mt-1 text-sm text-gray-500 list-disc list-inside">
                                                                                                        {fileData.fileNames.map(
                                                                                                            (
                                                                                                                name,
                                                                                                                index
                                                                                                            ) => (
                                                                                                                <li
                                                                                                                    key={
                                                                                                                        index
                                                                                                                    }
                                                                                                                >
                                                                                                                    {
                                                                                                                        name
                                                                                                                    }
                                                                                                                </li>
                                                                                                            )
                                                                                                        )}
                                                                                                    </ul>
                                                                                                </div>
                                                                                            )}
                                                                                    </div>

                                                                                    {filePreview.length >
                                                                                        0 && (
                                                                                        <div className="mt-4 mb-4">
                                                                                            <h4 className="text-sm font-medium mb-2">
                                                                                                Preview:
                                                                                            </h4>
                                                                                            <ScrollArea className="h-36">
                                                                                                <div className="grid grid-cols-2 gap-4">
                                                                                                    {filePreview.map(
                                                                                                        (
                                                                                                            preview,
                                                                                                            index
                                                                                                        ) => (
                                                                                                            <div
                                                                                                                key={
                                                                                                                    index
                                                                                                                }
                                                                                                                className="border rounded-md p-2"
                                                                                                            >
                                                                                                                {preview ? (
                                                                                                                    <img
                                                                                                                        src={
                                                                                                                            preview
                                                                                                                        }
                                                                                                                        alt={`File Preview ${
                                                                                                                            index +
                                                                                                                            1
                                                                                                                        }`}
                                                                                                                        className="max-h-48 max-w-full mx-auto"
                                                                                                                    />
                                                                                                                ) : (
                                                                                                                    <div className="h-24 w-full flex items-center justify-center bg-gray-100 rounded-md">
                                                                                                                        <span className="text-gray-500">
                                                                                                                            Non-image
                                                                                                                            file
                                                                                                                        </span>
                                                                                                                    </div>
                                                                                                                )}
                                                                                                                <p className="text-xs text-center mt-2 text-gray-500">
                                                                                                                    {
                                                                                                                        fileData
                                                                                                                            ?.fileNames[
                                                                                                                            index
                                                                                                                        ]
                                                                                                                    }
                                                                                                                </p>
                                                                                                            </div>
                                                                                                        )
                                                                                                    )}
                                                                                                </div>
                                                                                            </ScrollArea>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </AlertDialogHeader>
                                                                            <AlertDialogFooter>
                                                                                <AlertDialogCancel>
                                                                                    Kembali
                                                                                </AlertDialogCancel>
                                                                                <AlertDialogAction
                                                                                    className="bg-blue-500 text-white"
                                                                                    onClick={() =>
                                                                                        handleUpload(
                                                                                            row
                                                                                                .original
                                                                                                .memo!
                                                                                                .id
                                                                                        )
                                                                                    }
                                                                                    disabled={
                                                                                        !fileData ||
                                                                                        fileData
                                                                                            .files
                                                                                            .length ===
                                                                                            0
                                                                                    }
                                                                                >
                                                                                    Upload
                                                                                </AlertDialogAction>
                                                                            </AlertDialogFooter>
                                                                        </AlertDialogContent>
                                                                    </AlertDialog>
                                                                </div>

                                                                <div className="flex gap-3">
                                                                    <PDFDownloadLink
                                                                        document={
                                                                            <Template
                                                                                data={
                                                                                    row
                                                                                        .original
                                                                                        .memo
                                                                                }
                                                                            />
                                                                        }
                                                                        fileName={`memo-${
                                                                            row
                                                                                .original
                                                                                .memo
                                                                                ?.memo_number ||
                                                                            "document"
                                                                        }.pdf`}
                                                                        className="bg-blue-500 text-white px-4   rounded-lg text-center text-sm   hover:bg-blue-600 flex items-center gap-2"
                                                                    >
                                                                        {({
                                                                            blob,
                                                                            url,
                                                                            loading,
                                                                            error,
                                                                        }) => (
                                                                            <>
                                                                                <FileText
                                                                                    size={
                                                                                        20
                                                                                    }
                                                                                />
                                                                                <span>
                                                                                    {loading
                                                                                        ? "Generating PDF..."
                                                                                        : "Download PDF"}
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </PDFDownloadLink>

                                                                    <AlertDialogCancel className="bg-gray-500 text-white hover:bg-gray-600 hover:text-white flex items-center gap-2">
                                                                        <X
                                                                            size={
                                                                                20
                                                                            }
                                                                        />
                                                                        <span>
                                                                            Tutup
                                                                        </span>
                                                                    </AlertDialogCancel>
                                                                </div>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>

                                                    {/* Keep only the File Preview Button outside */}
                                                    <AlertDialog>
                                                        <AlertDialogTrigger
                                                            onClick={() => {
                                                                setPreviewImages(
                                                                    row.original
                                                                        .memo!
                                                                        .images
                                                                );
                                                                setImagePreviewOpen(
                                                                    true
                                                                );
                                                            }}
                                                        >
                                                            {row.original.memo!
                                                                .images.length >
                                                                0 && (
                                                                <button
                                                                    className={`${actionButtonClass} flex items-center gap-2`}
                                                                >
                                                                    <TooltipProvider
                                                                        delayDuration={
                                                                            100
                                                                        }
                                                                        skipDelayDuration={
                                                                            0
                                                                        }
                                                                    >
                                                                        <Tooltip>
                                                                            <TooltipTrigger className="flex items-center gap-2">
                                                                                <FileSearch />
                                                                            </TooltipTrigger>
                                                                            <TooltipContent
                                                                                side="top"
                                                                                sideOffset={
                                                                                    10
                                                                                }
                                                                            >
                                                                                <p>
                                                                                    Lihat
                                                                                    File
                                                                                </p>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>
                                                                </button>
                                                            )}
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className="w-full max-w-7xl">
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Preview File
                                                                    {row
                                                                        .original
                                                                        .memo!
                                                                        .images
                                                                        .length >
                                                                    1
                                                                        ? "s"
                                                                        : ""}
                                                                </AlertDialogTitle>
                                                                {imagePreviewOpen && (
                                                                    <ImagePreview
                                                                        isOpen={
                                                                            imagePreviewOpen
                                                                        }
                                                                        onClose={() =>
                                                                            setImagePreviewOpen(
                                                                                false
                                                                            )
                                                                        }
                                                                        images={
                                                                            previewImages
                                                                        }
                                                                        allowEdit={
                                                                            row
                                                                                .original
                                                                                .stages
                                                                                .requires_file_upload ===
                                                                            1
                                                                        }
                                                                    />
                                                                )}
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white flex items-center gap-2">
                                                                    <X
                                                                        size={
                                                                            20
                                                                        }
                                                                    />
                                                                    <span>
                                                                        Tutup
                                                                    </span>
                                                                </AlertDialogCancel>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                        <AlertDialogContent className="w-full max-w-7xl">
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Preview File
                                                                    {row
                                                                        .original
                                                                        .memo!
                                                                        .images
                                                                        .length >
                                                                    1
                                                                        ? "s"
                                                                        : ""}
                                                                </AlertDialogTitle>
                                                                {imagePreviewOpen && (
                                                                    <ImagePreview
                                                                        isOpen={
                                                                            imagePreviewOpen
                                                                        }
                                                                        onClose={() =>
                                                                            setImagePreviewOpen(
                                                                                false
                                                                            )
                                                                        }
                                                                        images={
                                                                            previewImages
                                                                        }
                                                                    />
                                                                )}
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white flex items-center gap-2">
                                                                    <X
                                                                        size={
                                                                            20
                                                                        }
                                                                    />
                                                                    <span>
                                                                        Tutup
                                                                    </span>
                                                                </AlertDialogCancel>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </>
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
                    Sebelumnya
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Selanjutnya
                </Button>
            </div>
        </div>
    );
}
