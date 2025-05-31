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

import { Input } from "@/Components/ui/input";
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
import { useState } from "react";
import { Memo } from "@/types/MemoType";
import { RequestLetter } from "@/types/RequestType";
import { User } from "@/types/UserType";
import { PDFViewer } from "@react-pdf/renderer";
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
import UndanganTemplate from "@/Pages/Pdf/UndanganTemplate";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Official } from "@/types/OfficialType";
import { Division } from "@/types/DivisionType";
import { UserWithDivision } from "../Index";

import { format, parseISO } from "date-fns";

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
    official: Official[];
    division: Division[];
    handleApprove: (id: number) => void;
    // handleReject: (id: number) => void;
    handleReject: (id: number, rejectionReason: string) => void;
    handleUpdate: (id: number) => void;
    handleUpload: (id: number) => void;
    handleSummaryFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

    // request_file_upload: number;
    formData: {
        invitation_id: number | null;
        file: File | null;
        request_name: string;
    };
    setFormData: React.Dispatch<
        React.SetStateAction<{
            invitation_id: number | null;
            file: File | null;
            request_name: string;
            judul_rapat: string;
            rangkuman_rapat: string;
        }>
    >;
    handleChange: (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => void;
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
    formData,
    setFormData,
    handleChange,
    handleUpdate,
    official,
    division,
    handleSummaryFileChange,
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

    const [searchQuery, setSearchQuery] = useState("");
    const [visibleUsers, setVisibleUsers] = useState(2);
    const [filteredUsers, setFilteredUsers] = useState<UserWithDivision[]>([]);

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

    const [rejectionReason, setRejectionReason] = useState<string>("");

    const actionButtonClass =
        "bg-blue-500 p-2 mt-2 text-white rounded-lg text-sm font-normal h-10 w-fit";
    const rejectButtonClass =
        "bg-red-500 p-2 mt-2 text-white rounded-lg text-sm font-normal h-10 w-fit";
    const approveButtonClass =
        "bg-green-500 p-2 mt-2 text-white rounded-lg text-sm font-normal h-10 w-fit";

    const safeFormatDate = (dateString: string | null | undefined) => {
        if (!dateString) return "";
        try {
            return format(parseISO(dateString), "yyyy-MM-dd");
        } catch (error) {
            console.error("Date parsing error:", error);
            return "";
        }
    };

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
                                                        ? row.original.summary!
                                                              .invite!
                                                              .to_division.id ==
                                                              user.division_id && (
                                                              <>
                                                                  {/* <TooltipProvider
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
                                                                                              .invite!
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
                                                                                          : `${approveButtonClass} ${
                                                                                                row
                                                                                                    .original
                                                                                                    .stages
                                                                                                    .requires_file_upload ==
                                                                                                    1 &&
                                                                                                row
                                                                                                    .original
                                                                                                    .invite!
                                                                                                    .file_path ==
                                                                                                    null
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
                                                                                          .invite!
                                                                                          .file_path ==
                                                                                          null
                                                                                  }
                                                                              >
                                                                                  <Check />
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
                                                                                  .invite!
                                                                                  .file_path ==
                                                                                  null ? (
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
                                                                  </TooltipProvider> */}

                                                                  <AlertDialog>
                                                                      <AlertDialogTrigger>
                                                                          <button
                                                                              className={
                                                                                  row
                                                                                      .original
                                                                                      .summary!
                                                                                      .rejection_reason
                                                                                      ? `${actionButtonClass} bg-yellow-500`
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
                                                                                      <TooltipTrigger>
                                                                                          <Info
                                                                                          //   size={
                                                                                          //       18
                                                                                          //   }
                                                                                          />
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
                                                                                  Undangan
                                                                                  Rapat
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
                                                                                              .summary!
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

                                                                  <AlertDialog>
                                                                      <AlertDialogTrigger>
                                                                          <button
                                                                              //   onClick={() =>
                                                                              //       handleReject(
                                                                              //           row
                                                                              //               .original
                                                                              //               .invite!
                                                                              //               .id
                                                                              //       )
                                                                              //   }
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
                                                                                      null
                                                                                      ? "hidden"
                                                                                      : `${rejectButtonClass}
                                                                                            `
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
                                                                                      <TooltipTrigger>
                                                                                          <X></X>
                                                                                      </TooltipTrigger>
                                                                                      <TooltipContent
                                                                                          side="top"
                                                                                          sideOffset={
                                                                                              10
                                                                                          }
                                                                                      >
                                                                                          <p>
                                                                                              Tolak
                                                                                              Undangan
                                                                                              Rapat
                                                                                          </p>
                                                                                      </TooltipContent>
                                                                                  </Tooltip>
                                                                              </TooltipProvider>
                                                                              {/* Reject */}
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
                                                                                  invite!
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
                                                                                  onClick={() => {
                                                                                      setRejectionReason(
                                                                                          ""
                                                                                      );
                                                                                      // setMemoToReject(
                                                                                      //     null
                                                                                      // );
                                                                                  }}
                                                                              >
                                                                                  Batal
                                                                              </AlertDialogCancel>
                                                                              <AlertDialogAction
                                                                                  onClick={() => {
                                                                                      alert(
                                                                                          "mema"
                                                                                      );
                                                                                      handleReject(
                                                                                          row
                                                                                              .original
                                                                                              .id,
                                                                                          rejectionReason
                                                                                      );
                                                                                      setRejectionReason(
                                                                                          ""
                                                                                      );
                                                                                      // setMemoToReject(
                                                                                      //     null
                                                                                      // );
                                                                                      // }
                                                                                  }}
                                                                                  className="bg-red-500 hover:bg-red-600"
                                                                                  disabled={
                                                                                      rejectionReason.trim() ===
                                                                                      ""
                                                                                  }
                                                                              >
                                                                                  Tolak
                                                                                  Risalah
                                                                                  Rapat
                                                                              </AlertDialogAction>
                                                                          </AlertDialogFooter>
                                                                      </AlertDialogContent>
                                                                  </AlertDialog>
                                                              </>
                                                          )
                                                        : row.original.summary!
                                                              .invite!
                                                              .from_division
                                                              .id ==
                                                              user.division_id && (
                                                              <>
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
                                                                                      .to_stage_id ==
                                                                                      null
                                                                                      ? "hidden"
                                                                                      : `${approveButtonClass}`
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
                                                                                      <TooltipTrigger>
                                                                                          <Check></Check>
                                                                                      </TooltipTrigger>
                                                                                      <TooltipContent
                                                                                          side="top"
                                                                                          sideOffset={
                                                                                              10
                                                                                          }
                                                                                      >
                                                                                          <p>
                                                                                              Setujui
                                                                                              Undangan
                                                                                              Rapat
                                                                                          </p>
                                                                                      </TooltipContent>
                                                                                  </Tooltip>
                                                                              </TooltipProvider>
                                                                              {/* {user.role_id ==
                                                                              1
                                                                                  ? "Approve"
                                                                                  : "Perbaiki"} */}
                                                                          </button>
                                                                      </AlertDialogTrigger>
                                                                      <AlertDialogContent>
                                                                          <AlertDialogHeader>
                                                                              <AlertDialogTitle>
                                                                                  Apakah
                                                                                  Anda
                                                                                  Yakin
                                                                                  ?
                                                                              </AlertDialogTitle>
                                                                              <AlertDialogDescription>
                                                                                  {row
                                                                                      .original
                                                                                      .stages
                                                                                      .is_fixable ==
                                                                                  0 ? (
                                                                                      <>
                                                                                          Undangan
                                                                                          Rapat
                                                                                          akan
                                                                                          dikirimkan
                                                                                          ke
                                                                                          manajer
                                                                                          divisi{" "}
                                                                                          <span className="font-bold">
                                                                                              {
                                                                                                  row
                                                                                                      .original
                                                                                                      .summary!
                                                                                                      .invite!
                                                                                                      .to_division
                                                                                                      .division_name
                                                                                              }
                                                                                          </span>{" "}
                                                                                          apakah
                                                                                          anda
                                                                                          yakin
                                                                                          ?
                                                                                      </>
                                                                                  ) : (
                                                                                      `
                                                                                      
                                                                                  Undangan Rapat
                                                                                  akan
                                                                                  dikirimkan
                                                                                  ke
                                                                                  manajer.
                                                                                  Apakah
                                                                                  anda
                                                                                  yakin
                                                                                  dengan
                                                                                  perubahan
                                                                                  yang
                                                                                  sudah
                                                                                  dibuat
                                                                                  ?
                                                                                      `
                                                                                  )}
                                                                              </AlertDialogDescription>
                                                                          </AlertDialogHeader>
                                                                          <AlertDialogFooter>
                                                                              <AlertDialogCancel>
                                                                                  Kembali{" "}
                                                                                  {
                                                                                      row
                                                                                          .original
                                                                                          .summary!
                                                                                          .id
                                                                                  }
                                                                              </AlertDialogCancel>
                                                                              <AlertDialogAction
                                                                                  onClick={() => {
                                                                                      handleApprove(
                                                                                          row
                                                                                              .original
                                                                                              .summary!
                                                                                              .id
                                                                                      );
                                                                                  }}
                                                                                  className="bg-blue-500 font-normal hover:bg-blue-600"
                                                                              >
                                                                                  Kirim
                                                                                  Undangan
                                                                                  Rapat
                                                                                  ke
                                                                                  Manajer
                                                                              </AlertDialogAction>
                                                                          </AlertDialogFooter>
                                                                      </AlertDialogContent>
                                                                  </AlertDialog>
                                                                  <AlertDialog>
                                                                      <AlertDialogTrigger>
                                                                          <button
                                                                              className={
                                                                                  row
                                                                                      .original
                                                                                      .summary!
                                                                                      .rejection_reason
                                                                                      ? `${actionButtonClass} bg-yellow-500`
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
                                                                                      <TooltipTrigger>
                                                                                          <Info
                                                                                          //   size={
                                                                                          //       18
                                                                                          //   }
                                                                                          />
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
                                                                                  Undangan
                                                                                  Rapat
                                                                              </AlertDialogTitle>
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
                                                                                          .summary!
                                                                                          .rejection_reason ||
                                                                                          "Tidak ada alasan yang diberikan"}
                                                                                  </p>
                                                                              </div>
                                                                          </AlertDialogHeader>
                                                                          <AlertDialogFooter>
                                                                              <AlertDialogCancel className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white">
                                                                                  Tutup
                                                                              </AlertDialogCancel>
                                                                          </AlertDialogFooter>
                                                                      </AlertDialogContent>
                                                                  </AlertDialog>
                                                                  <AlertDialog>
                                                                      <AlertDialogTrigger>
                                                                          <button
                                                                              //   onClick={() =>
                                                                              //       handleReject(
                                                                              //           row
                                                                              //               .original
                                                                              //               .invite!
                                                                              //               .id
                                                                              //       )
                                                                              //   }
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
                                                                                      null
                                                                                      ? "hidden"
                                                                                      : `${rejectButtonClass}
                                                                                            `
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
                                                                                      <TooltipTrigger>
                                                                                          <X></X>
                                                                                      </TooltipTrigger>
                                                                                      <TooltipContent
                                                                                          side="top"
                                                                                          sideOffset={
                                                                                              10
                                                                                          }
                                                                                      >
                                                                                          <p>
                                                                                              Tolak
                                                                                              Undangan
                                                                                              Rapat
                                                                                          </p>
                                                                                      </TooltipContent>
                                                                                  </Tooltip>
                                                                              </TooltipProvider>
                                                                              {/* Reject */}
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
                                                                                  Risalah
                                                                                  Rapat.
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
                                                                                  onClick={() => {
                                                                                      setRejectionReason(
                                                                                          ""
                                                                                      );
                                                                                      // setMemoToReject(
                                                                                      //     null
                                                                                      // );
                                                                                  }}
                                                                              >
                                                                                  Batal
                                                                              </AlertDialogCancel>
                                                                              <AlertDialogAction
                                                                                  onClick={() => {
                                                                                      handleReject(
                                                                                          row
                                                                                              .original
                                                                                              .summary!
                                                                                              .id,
                                                                                          rejectionReason
                                                                                      );
                                                                                      setRejectionReason(
                                                                                          ""
                                                                                      );
                                                                                      // setMemoToReject(
                                                                                      //     null
                                                                                      // );
                                                                                      // }
                                                                                  }}
                                                                                  className="bg-red-500 hover:bg-red-600"
                                                                                  disabled={
                                                                                      rejectionReason.trim() ===
                                                                                      ""
                                                                                  }
                                                                              >
                                                                                  Tolak
                                                                                  Undangan
                                                                                  Rapat
                                                                              </AlertDialogAction>
                                                                          </AlertDialogFooter>
                                                                      </AlertDialogContent>
                                                                  </AlertDialog>
                                                              </>
                                                          )}
                                                </>
                                                <AlertDialog
                                                    open={editDialogOpen}
                                                    onOpenChange={
                                                        setEditDialogOpen
                                                    }
                                                >
                                                    <AlertDialogTrigger
                                                        onClick={() =>
                                                            // setFormData({
                                                            //     perihal:
                                                            //         row.original
                                                            //             .invite!
                                                            //             .perihal,
                                                            //     content:
                                                            //         row.original
                                                            //             .invite!
                                                            //             .content,
                                                            // })
                                                            setFormData({
                                                                invitation_id: 0,
                                                                file: null,
                                                                request_name:
                                                                    "",
                                                                judul_rapat: "",
                                                                rangkuman_rapat:
                                                                    "",
                                                            })
                                                        }
                                                        // onClick={() =>
                                                        //     setFormData({
                                                        //         official: "",
                                                        //         request_name:
                                                        //             "",
                                                        //         to_division:
                                                        //             null,
                                                        //         perihal:
                                                        //             row.original
                                                        //                 .invite!
                                                        //                 .perihal,
                                                        //         content:
                                                        //             row.original
                                                        //                 .invite!
                                                        //                 .content,
                                                        //     })
                                                        // }
                                                        // onClick={() =>
                                                        //     alert(
                                                        //         row.original
                                                        //             .invite!
                                                        //             .perihal
                                                        //     )
                                                        // }
                                                        className={`${actionButtonClass} ${
                                                            row.original.stages
                                                                .is_fixable ==
                                                                1 &&
                                                            row.original.stages
                                                                .approver_id ==
                                                                user.role_id
                                                                ? ""
                                                                : "hidden"
                                                        }`}
                                                    >
                                                        <Pencil></Pencil>
                                                        {/* Edit Memo */}
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="w-[300rem]">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle className="font-medium">
                                                                Perbaiki Risalah
                                                                Rapat
                                                            </AlertDialogTitle>
                                                            <ScrollArea className="h-[500px] w-full pr-4">
                                                                <div className="mt-4">
                                                                    <label
                                                                        htmlFor="judul_rapat"
                                                                        className="block mb-2 mt-4"
                                                                    >
                                                                        Judul
                                                                        Rapat
                                                                    </label>
                                                                    <input
                                                                        onChange={
                                                                            handleChange
                                                                        }
                                                                        type="text"
                                                                        name="judul_rapat"
                                                                        id="judul_rapat"
                                                                        className="w-full p-2 border rounded-lg"
                                                                    />

                                                                    <label
                                                                        htmlFor="rangkuman_rapat"
                                                                        className="block mb-2 mt-4"
                                                                    >
                                                                        Rangkuman
                                                                        Rapat
                                                                    </label>
                                                                    <textarea
                                                                        onChange={
                                                                            handleChange
                                                                        }
                                                                        name="rangkuman_rapat"
                                                                        id="rangkuman_rapat"
                                                                        rows={4}
                                                                        className="w-full p-2 border rounded-lg"
                                                                    ></textarea>
                                                                    <label
                                                                        htmlFor="perihal"
                                                                        className="block mb-2"
                                                                    >
                                                                        File
                                                                        Risalah
                                                                        Rapat
                                                                    </label>
                                                                    <input
                                                                        type="file"
                                                                        id="file"
                                                                        className="w-full p-2 border rounded-lg"
                                                                        onChange={
                                                                            handleSummaryFileChange
                                                                        }
                                                                    />
                                                                </div>
                                                            </ScrollArea>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>
                                                                Kembali
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-blue-500 font-normal hover:bg-blue-600"
                                                                onClick={() =>
                                                                    // alert(
                                                                    //     row
                                                                    //         .original
                                                                    //         .invite!
                                                                    //         .id
                                                                    // )
                                                                    handleUpdate(
                                                                        row
                                                                            .original
                                                                            .summary!
                                                                            .id
                                                                    )
                                                                }
                                                            >
                                                                Ubah Risalah
                                                                Rapat
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                                {/* <AlertDialog>
                                                    <AlertDialogTrigger>
                                                        <button
                                                            className={
                                                                actionButtonClass
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
                                                                    <TooltipTrigger>
                                                                        <FileText></FileText>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent
                                                                        side="top"
                                                                        sideOffset={
                                                                            10
                                                                        }
                                                                    >
                                                                        <p>
                                                                            Preview
                                                                            PDF
                                                                        </p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="w-full max-w-7xl">
                                                        <AlertDialogHeader className="">
                                                            <AlertDialogTitle>
                                                                Preview PDF
                                                            </AlertDialogTitle>
                                                            <div className="">
                                                                <PDFViewer className="w-full h-[80vh]">
                                                                    <UndanganTemplate
                                                                        data={
                                                                            row
                                                                                .original
                                                                                .invite!
                                                                        }
                                                                    />
                                                                </PDFViewer>
                                                            </div>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel className="bg-blue-500 text-white">
                                                                Kembali
                                                            </AlertDialogCancel>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog> */}
                                                {/* {
                                                    row.original.summary!
                                                        .file_path
                                                } */}

                                                <AlertDialog>
                                                    <AlertDialogTrigger>
                                                        {row.original.summary!
                                                            .file_path && (
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
                                                                <FileSearch></FileSearch>
                                                            </button>
                                                        )}
                                                    </AlertDialogTrigger>
                                                    {row.original.summary!
                                                        .file_path != null ? (
                                                        <AlertDialogContent className="w-full max-w-7xl">
                                                            <AlertDialogHeader className="">
                                                                <AlertDialogTitle>
                                                                    Preview File
                                                                </AlertDialogTitle>
                                                                <div className="flex flex-col w-full">
                                                                    {/* Add meeting title and summary information */}
                                                                    <div className="mb-6 p-4 bg-blue-50 rounded-md border border-blue-200">
                                                                        <h3 className="text-lg font-semibold text-blue-800 mb-2">
                                                                            Judul
                                                                            :{" "}
                                                                            {row
                                                                                .original
                                                                                .summary!
                                                                                .judul_rapat ||
                                                                                "Tidak ada judul"}
                                                                        </h3>
                                                                        <div className="mt-3">
                                                                            <h4 className="text-sm font-medium text-blue-700 mb-1">
                                                                                Rangkuman
                                                                                Rapat:
                                                                            </h4>
                                                                            <p className="text-sm text-gray-700 whitespace-pre-line">
                                                                                {row
                                                                                    .original
                                                                                    .summary!
                                                                                    .rangkuman_rapat ||
                                                                                    "Tidak ada rangkuman"}
                                                                            </p>
                                                                        </div>
                                                                        {/* <div className="mt-3 text-xs text-gray-500">
                                                                            Tanggal:{" "}
                                                                            {safeFormatDate(
                                                                                row
                                                                                    .original
                                                                                    .summary!
                                                                                    .created_at
                                                                            )}
                                                                        </div> */}
                                                                    </div>
                                                                    <div
                                                                        style={{
                                                                            height: "400px",
                                                                        }}
                                                                    >
                                                                        <embed
                                                                            src={`/risalah-file/${
                                                                                row
                                                                                    .original
                                                                                    .summary!
                                                                                    .file_path
                                                                            }`}
                                                                            type="application/pdf"
                                                                            width="100%"
                                                                            height="100%"
                                                                            className="border"
                                                                            onContextMenu={(
                                                                                e
                                                                            ) =>
                                                                                e.preventDefault()
                                                                            }
                                                                        />
                                                                    </div>

                                                                    {/* Original file preview content */}
                                                                    {/* <div className="relative w-full h-[60vh] bg-gray-100 rounded-md overflow-hidden">
                                                                        <div
                                                                            className="absolute inset-0 flex items-center justify-center z-10 bg-white/50"
                                                                            id="loading-indicator"
                                                                        >
                                                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                                                        </div>

                                                                        <div className="w-full h-full flex items-center justify-center overflow-auto">
                                                                            <p>
                                                                                {
                                                                                    row
                                                                                        .original
                                                                                        .summary!
                                                                                        .file_path
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </div> */}

                                                                    <div className="flex items-center justify-between mt-4">
                                                                        <div className="text-sm text-gray-500">
                                                                            {row.original
                                                                                .summary!.file_path?.split(
                                                                                    "/"
                                                                                )
                                                                                .pop()}
                                                                        </div>
                                                                        <div className="flex gap-2">
                                                                            <button
                                                                                className="px-3 py-1 bg-gray-200 rounded-md text-sm"
                                                                                onClick={() =>
                                                                                    window.open(
                                                                                        `invite!-file/${
                                                                                            row
                                                                                                .original
                                                                                                .summary!
                                                                                                .file_path
                                                                                        }`,
                                                                                        "_blank"
                                                                                    )
                                                                                }
                                                                            >
                                                                                Buka
                                                                                di
                                                                                tab
                                                                                baru
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel className="bg-blue-500 text-white">
                                                                    Kembali
                                                                </AlertDialogCancel>
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
                                                                                                        .invite!
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
