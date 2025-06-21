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

    // request_file_upload: number;
    formData: {
        request_name: string;
        perihal: string;
        content: string;
        official: string;
        to_division: string | null;
        hari_tanggal: string;
        waktu: string;
        tempat: string;
        agenda: string;
        invited_users: string[];
    };
    setFormData: React.Dispatch<
        React.SetStateAction<{
            perihal: string;
            content: string;
            request_name: string;
            official: string;
            to_division: string | null;
            hari_tanggal: string;
            waktu: string;
            tempat: string;
            agenda: string;
            invited_users: string[];
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
        "bg-blue-500 p-2 text-white rounded-lg text-sm font-normal w-fit";
    const rejectButtonClass =
        "bg-red-500 p-2  text-white rounded-lg text-sm font-normal  w-fit";
    const approveButtonClass =
        "bg-green-500 p-2  text-white rounded-lg text-sm font-normal w-fit";

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
                                                <AlertDialog>
                                                    <AlertDialogTrigger>
                                                        <button
                                                            className={`${actionButtonClass} flex items-center gap-2`}
                                                        >
                                                            <TooltipProvider
                                                                delayDuration={
                                                                    50
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
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Preview PDF
                                                            </AlertDialogTitle>
                                                            <div className="">
                                                                <div className="mb-2">
                                                                    <p className="text-sm">
                                                                        Tahapan
                                                                        surat
                                                                        saat
                                                                        ini:{" "}
                                                                    </p>
                                                                    <p className="">
                                                                        {
                                                                            row
                                                                                .original
                                                                                .stages
                                                                                .stage_name
                                                                        }
                                                                    </p>
                                                                </div>
                                                                {/* PDF Viewer */}
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
                                                        <AlertDialogFooter className="items-center">
                                                            {/* All action buttons moved here */}
                                                            <div className="flex items-center justify-center gap-1">
                                                                {/* Approve Button */}
                                                                {row.original
                                                                    .stages
                                                                    .is_external ==
                                                                1
                                                                    ? row
                                                                          .original
                                                                          .invite!
                                                                          .to_division
                                                                          .id ==
                                                                          user.division_id && (
                                                                          <>
                                                                              {user.role_id ==
                                                                                  row
                                                                                      .original
                                                                                      .stages
                                                                                      .approver_id &&
                                                                                  row
                                                                                      .original
                                                                                      .stages
                                                                                      .to_stage_id !=
                                                                                      null && (
                                                                                      <AlertDialog>
                                                                                          <AlertDialogTrigger
                                                                                              asChild
                                                                                          >
                                                                                              <button
                                                                                                  className={`${approveButtonClass} flex items-center gap-2 mr-1`}
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
                                                                                                                  Undangan
                                                                                                                  Rapat
                                                                                                              </p>
                                                                                                          </TooltipContent>
                                                                                                      </Tooltip>
                                                                                                  </TooltipProvider>
                                                                                              </button>
                                                                                          </AlertDialogTrigger>
                                                                                          <AlertDialogContent>
                                                                                              <AlertDialogHeader>
                                                                                                  <AlertDialogTitle>
                                                                                                      Apakah
                                                                                                      Anda
                                                                                                      Yakin?
                                                                                                  </AlertDialogTitle>
                                                                                                  <AlertDialogDescription>
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
                                                                                                                  .invite!
                                                                                                                  .to_division
                                                                                                                  .division_name
                                                                                                          }
                                                                                                      </span>{" "}
                                                                                                      apakah
                                                                                                      anda
                                                                                                      yakin?
                                                                                                  </AlertDialogDescription>
                                                                                              </AlertDialogHeader>
                                                                                              <AlertDialogFooter>
                                                                                                  <AlertDialogCancel>
                                                                                                      Kembali
                                                                                                  </AlertDialogCancel>
                                                                                                  <AlertDialogAction
                                                                                                      onClick={() =>
                                                                                                          handleApprove(
                                                                                                              row
                                                                                                                  .original
                                                                                                                  .invite!
                                                                                                                  .id
                                                                                                          )
                                                                                                      }
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
                                                                                  )}

                                                                              {/* Reject Button */}
                                                                              {user.role_id ==
                                                                                  row
                                                                                      .original
                                                                                      .stages
                                                                                      .approver_id &&
                                                                                  row
                                                                                      .original
                                                                                      .stages
                                                                                      .rejected_id !=
                                                                                      null && (
                                                                                      <AlertDialog>
                                                                                          <AlertDialogTrigger
                                                                                              asChild
                                                                                          >
                                                                                              <button
                                                                                                  className={`${rejectButtonClass} flex items-center gap-2`}
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
                                                                                                                  Undangan
                                                                                                                  Rapat
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
                                                                                                      undangan
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
                                                                                                      Undangan
                                                                                                      Rapat
                                                                                                  </AlertDialogAction>
                                                                                              </AlertDialogFooter>
                                                                                          </AlertDialogContent>
                                                                                      </AlertDialog>
                                                                                  )}
                                                                          </>
                                                                      )
                                                                    : row
                                                                          .original
                                                                          .invite!
                                                                          .from_division
                                                                          .id ==
                                                                          user.division_id && (
                                                                          <>
                                                                              {/* Approve Button for from_division */}
                                                                              {user.role_id ==
                                                                                  row
                                                                                      .original
                                                                                      .stages
                                                                                      .approver_id &&
                                                                                  row
                                                                                      .original
                                                                                      .stages
                                                                                      .to_stage_id !=
                                                                                      null && (
                                                                                      <AlertDialog>
                                                                                          <AlertDialogTrigger
                                                                                              asChild
                                                                                          >
                                                                                              <button
                                                                                                  className={`${approveButtonClass} flex items-center gap-2`}
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
                                                                                                                  Undangan
                                                                                                                  Rapat
                                                                                                              </p>
                                                                                                          </TooltipContent>
                                                                                                      </Tooltip>
                                                                                                  </TooltipProvider>
                                                                                              </button>
                                                                                          </AlertDialogTrigger>
                                                                                          <AlertDialogContent>
                                                                                              <AlertDialogHeader>
                                                                                                  <AlertDialogTitle>
                                                                                                      Apakah
                                                                                                      Anda
                                                                                                      Yakin?
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
                                                                                                                          .invite!
                                                                                                                          .to_division
                                                                                                                          .division_name
                                                                                                                  }
                                                                                                              </span>{" "}
                                                                                                              apakah
                                                                                                              anda
                                                                                                              yakin?
                                                                                                          </>
                                                                                                      ) : (
                                                                                                          `Undangan Rapat akan dikirimkan ke manajer. Apakah anda yakin dengan perubahan yang sudah dibuat?`
                                                                                                      )}
                                                                                                  </AlertDialogDescription>
                                                                                              </AlertDialogHeader>
                                                                                              <AlertDialogFooter>
                                                                                                  <AlertDialogCancel>
                                                                                                      Kembali
                                                                                                  </AlertDialogCancel>
                                                                                                  <AlertDialogAction
                                                                                                      onClick={() =>
                                                                                                          handleApprove(
                                                                                                              row
                                                                                                                  .original
                                                                                                                  .invite!
                                                                                                                  .id
                                                                                                          )
                                                                                                      }
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
                                                                                  )}

                                                                              {/* Reject Button for from_division */}
                                                                              {user.role_id ==
                                                                                  row
                                                                                      .original
                                                                                      .stages
                                                                                      .approver_id &&
                                                                                  row
                                                                                      .original
                                                                                      .stages
                                                                                      .rejected_id !=
                                                                                      null && (
                                                                                      <AlertDialog>
                                                                                          <AlertDialogTrigger
                                                                                              asChild
                                                                                          >
                                                                                              <button
                                                                                                  className={`${rejectButtonClass} flex items-center gap-2`}
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
                                                                                                                  Undangan
                                                                                                                  Rapat
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
                                                                                                      Undangan
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
                                                                                                                  .invite!
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
                                                                                                      Undangan
                                                                                                      Rapat
                                                                                                  </AlertDialogAction>
                                                                                              </AlertDialogFooter>
                                                                                          </AlertDialogContent>
                                                                                      </AlertDialog>
                                                                                  )}
                                                                          </>
                                                                      )}

                                                                {/* Edit Button */}
                                                                {row.original
                                                                    .stages
                                                                    .is_fixable ==
                                                                    1 &&
                                                                    row.original
                                                                        .stages
                                                                        .approver_id ==
                                                                        user.role_id && (
                                                                        <AlertDialog>
                                                                            <AlertDialogTrigger
                                                                                onClick={() =>
                                                                                    setFormData(
                                                                                        {
                                                                                            request_name:
                                                                                                "",
                                                                                            perihal:
                                                                                                row
                                                                                                    .original
                                                                                                    .invite!
                                                                                                    .perihal ||
                                                                                                "",
                                                                                            content:
                                                                                                row
                                                                                                    .original
                                                                                                    .invite!
                                                                                                    .content ||
                                                                                                "",
                                                                                            official:
                                                                                                "",
                                                                                            to_division:
                                                                                                null,

                                                                                            hari_tanggal:
                                                                                                row
                                                                                                    .original
                                                                                                    .invite!
                                                                                                    .hari_tanggal ||
                                                                                                "",
                                                                                            waktu:
                                                                                                row
                                                                                                    .original
                                                                                                    .invite!
                                                                                                    .waktu ||
                                                                                                "",
                                                                                            tempat:
                                                                                                row
                                                                                                    .original
                                                                                                    .invite!
                                                                                                    .tempat ||
                                                                                                "",
                                                                                            agenda:
                                                                                                row
                                                                                                    .original
                                                                                                    .invite!
                                                                                                    .agenda ||
                                                                                                "",
                                                                                            invited_users:
                                                                                                [],
                                                                                        }
                                                                                    )
                                                                                }
                                                                                className={`${actionButtonClass} bg-orange-500 flex items-center gap-2`}
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
                                                                                            <Pencil
                                                                                                size={
                                                                                                    20
                                                                                                }
                                                                                            />
                                                                                            <span>
                                                                                                Edit
                                                                                            </span>
                                                                                        </TooltipTrigger>
                                                                                        <TooltipContent
                                                                                            side="top"
                                                                                            sideOffset={
                                                                                                10
                                                                                            }
                                                                                        >
                                                                                            <p>
                                                                                                Edit
                                                                                                Undangan
                                                                                                Rapat
                                                                                            </p>
                                                                                        </TooltipContent>
                                                                                    </Tooltip>
                                                                                </TooltipProvider>
                                                                            </AlertDialogTrigger>
                                                                            <AlertDialogContent className="w-[300rem]">
                                                                                <AlertDialogHeader>
                                                                                    <AlertDialogTitle className="font-medium">
                                                                                        Edit
                                                                                        Undangan
                                                                                        Rapat
                                                                                    </AlertDialogTitle>
                                                                                    <ScrollArea className="h-[500px] w-full pr-4">
                                                                                        <div className="space-y-4">
                                                                                            <div>
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
                                                                                                    value={
                                                                                                        formData.perihal
                                                                                                    }
                                                                                                    className="w-full p-2 border rounded-lg"
                                                                                                />
                                                                                            </div>
                                                                                            <div>
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
                                                                                                    value={
                                                                                                        formData.content
                                                                                                    }
                                                                                                    className="w-full p-2 border rounded-lg"
                                                                                                />
                                                                                            </div>
                                                                                            <div>
                                                                                                <label
                                                                                                    htmlFor="hari_tanggal"
                                                                                                    className="block mb-2"
                                                                                                >
                                                                                                    Hari
                                                                                                    /
                                                                                                    tanggal
                                                                                                </label>
                                                                                                <input
                                                                                                    onChange={
                                                                                                        handleChange
                                                                                                    }
                                                                                                    type="date"
                                                                                                    name="hari_tanggal"
                                                                                                    value={safeFormatDate(
                                                                                                        formData.hari_tanggal
                                                                                                    )}
                                                                                                    className="w-full p-2 border rounded-lg"
                                                                                                />
                                                                                            </div>
                                                                                            <div>
                                                                                                <label
                                                                                                    htmlFor="waktu"
                                                                                                    className="block mb-2"
                                                                                                >
                                                                                                    Waktu
                                                                                                </label>
                                                                                                <input
                                                                                                    onChange={
                                                                                                        handleChange
                                                                                                    }
                                                                                                    type="text"
                                                                                                    name="waktu"
                                                                                                    value={
                                                                                                        formData.waktu
                                                                                                    }
                                                                                                    className="w-full p-2 border rounded-lg"
                                                                                                />
                                                                                            </div>
                                                                                            <div>
                                                                                                <label
                                                                                                    htmlFor="tempat"
                                                                                                    className="block mb-2"
                                                                                                >
                                                                                                    Tempat
                                                                                                </label>
                                                                                                <input
                                                                                                    onChange={
                                                                                                        handleChange
                                                                                                    }
                                                                                                    type="text"
                                                                                                    name="tempat"
                                                                                                    value={
                                                                                                        formData.tempat
                                                                                                    }
                                                                                                    className="w-full p-2 border rounded-lg"
                                                                                                />
                                                                                            </div>
                                                                                            <div>
                                                                                                <label
                                                                                                    htmlFor="agenda"
                                                                                                    className="block mb-2"
                                                                                                >
                                                                                                    Agenda
                                                                                                </label>
                                                                                                <input
                                                                                                    onChange={
                                                                                                        handleChange
                                                                                                    }
                                                                                                    type="text"
                                                                                                    name="agenda"
                                                                                                    value={
                                                                                                        formData.agenda
                                                                                                    }
                                                                                                    className="w-full p-2 border rounded-lg"
                                                                                                />
                                                                                            </div>
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
                                                                                            handleUpdate(
                                                                                                row
                                                                                                    .original
                                                                                                    .invite!
                                                                                                    .id
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        Ubah
                                                                                        Undangan
                                                                                        Rapat
                                                                                    </AlertDialogAction>
                                                                                </AlertDialogFooter>
                                                                            </AlertDialogContent>
                                                                        </AlertDialog>
                                                                    )}

                                                                {/* Upload File Button */}
                                                                {row.original
                                                                    .stages
                                                                    .requires_file_upload ==
                                                                    1 && (
                                                                    <AlertDialog>
                                                                        <AlertDialogTrigger
                                                                            asChild
                                                                        >
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
                                                                                            <FileUp
                                                                                                size={
                                                                                                    20
                                                                                                }
                                                                                            />
                                                                                            <span>
                                                                                                Upload
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
                                                                                                Undangan
                                                                                            </p>
                                                                                        </TooltipContent>
                                                                                    </Tooltip>
                                                                                </TooltipProvider>
                                                                            </button>
                                                                        </AlertDialogTrigger>
                                                                        <AlertDialogContent className="w-full">
                                                                            <AlertDialogHeader>
                                                                                <AlertDialogTitle>
                                                                                    Upload
                                                                                    File
                                                                                    Undangan
                                                                                    Rapat
                                                                                </AlertDialogTitle>
                                                                                <div className="">
                                                                                    <div className="mb-4">
                                                                                        <label
                                                                                            htmlFor="fileUpload"
                                                                                            className="block text-sm font-medium mb-2"
                                                                                        >
                                                                                            Upload
                                                                                            File
                                                                                            Undangan
                                                                                            Rapat
                                                                                            (PDF)
                                                                                        </label>
                                                                                        <input
                                                                                            type="file"
                                                                                            id="fileUpload"
                                                                                            name="fileUpload"
                                                                                            accept=".pdf"
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
                                                                                                    if (
                                                                                                        file.type ===
                                                                                                        "application/pdf"
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
                                                                                                    }
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
                                                                                                <embed
                                                                                                    src={
                                                                                                        filePreview
                                                                                                    }
                                                                                                    type="application/pdf"
                                                                                                    width="100%"
                                                                                                    height="200px"
                                                                                                    className="border"
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
                                                                    </AlertDialog>
                                                                )}

                                                                {/* Rejection Reason Info Button */}
                                                                {row.original
                                                                    .invite!
                                                                    .rejection_reason && (
                                                                    <AlertDialog>
                                                                        <AlertDialogTrigger
                                                                            asChild
                                                                        >
                                                                            <button
                                                                                className={`${actionButtonClass} bg-yellow-500 flex items-center gap-2`}
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
                                                                                                Info
                                                                                                Penolakan
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
                                                                                                .invite!
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
                                                                )}
                                                            </div>

                                                            <div className="flex gap-3">
                                                                <PDFDownloadLink
                                                                    document={
                                                                        <UndanganTemplate
                                                                            data={
                                                                                row
                                                                                    .original
                                                                                    .invite!
                                                                            }
                                                                        />
                                                                    }
                                                                    fileName={`undangan-${
                                                                        row
                                                                            .original
                                                                            .invite!
                                                                            .id ||
                                                                        "document"
                                                                    }.pdf`}
                                                                    className="bg-blue-500 text-white px-4 rounded-lg text-center text-sm hover:bg-blue-600 flex items-center gap-2"
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
                                            </div>
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
