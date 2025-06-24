import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
    MenubarContent,
    MenubarItem,
} from "@/Components/ui/menubar";
import { Stages } from "@/types/StagesType";

interface Stage {
    id: number;
    stage_name: string;
    description?: string;
    sequence?: number;
}

interface ApprovedRecord {
    from_stage_id: number;
    from_stage: Stage;
    to_stage_id: number;
    to_stage: Stage;
}

interface RejectedRecord {
    from_stage_id: number;
    from_stage: Stage;
    rejected_stage_id: number;
    rejected_stage: Stage;
}

interface Props {
    row: {
        original: {
            to_stages_with_records: ApprovedRecord[];
            rejected_stages_with_records: RejectedRecord[];
            stages: Stages;
        };
    };
}

// function buildStageSequence(
//     approvedLinks: ApprovedRecord[],
//     rejectedLinks: RejectedRecord[],
//     startStageId: number,
//     currentStageId: number
// ) {
//     const approvedMap = new Map<number, Stage>();
//     const rejectedMap = new Map<number, Stage>();
//     const reverseRejectedMap = new Map<number, Stage>();

//     approvedLinks.forEach((link) => {
//         approvedMap.set(link.from_stage_id, link.to_stage);
//     });

//     rejectedLinks.forEach((link) => {
//         rejectedMap.set(link.from_stage_id, link.rejected_stage);
//         reverseRejectedMap.set(link.rejected_stage_id, link.from_stage);
//     });

//     // const sequence: {
//     //     id: number;
//     //     name: string;
//     //     rejected?: { id: number; name: string; from?: string };
//     //     isRejected?: boolean;
//     //     isCurrent?: boolean;
//     // }[] = [];
//     // const sequence: {
//     //     id: number;
//     //     name: string;
//     //     description?: string;
//     //     rejected?: { id: number; name: string; from?: string };
//     //     isRejected?: boolean;
//     //     isCurrent?: boolean;
//     // }[] = [];
//     const sequence: {
//         id: number;
//         name: string;
//         description?: string;
//         rejected?: { id: number; name: string; from?: string };
//         isRejected?: boolean;
//         isCurrent?: boolean;
//     }[] = [];

//     let current = startStageId;

//     while (current) {
//         const to = approvedMap.get(current);
//         const rejected = rejectedMap.get(current);
//         const isCurrent = current === currentStageId;

//         // sequence.push({
//         //     id: current,
//         //     name:
//         //         approvedLinks.find((s) => s.from_stage_id === current)
//         //             ?.from_stage.stage_name || `Stage ${current}`,
//         //     rejected: rejected
//         //         ? {
//         //               id: rejected.id,
//         //               name: rejected.stage_name,
//         //           }
//         //         : undefined,
//         //     isCurrent,
//         //     isRejected: false,
//         // });
//         sequence.push({
//             id: current,
//             name:
//                 approvedLinks.find((s) => s.from_stage_id === current)
//                     ?.from_stage.stage_name || `Stage ${current}`,
//             rejected: rejected
//                 ? {
//                       id: rejected.id,
//                       name: rejected.stage_name,
//                   }
//                 : undefined,
//             isCurrent,
//             isRejected: false,
//             description:
//                 approvedLinks.find((s) => s.from_stage_id === current)
//                     ?.from_stage.description || "",
//         });

//         if (!to) break;
//         current = to.id;
//     }

//     // Check if current stage is a result of rejection
//     // const last = sequence.find((s) => s.id === currentStageId);
//     // if (last && reverseRejectedMap.has(currentStageId)) {
//     //     last.isRejected = true;
//     //     last.rejected = {
//     //         id: currentStageId,
//     //         name: last.name,
//     //         from: reverseRejectedMap.get(currentStageId)?.stage_name,
//     //     };
//     // }

//     // Step: Detect if current stage is reached through a rejection path
//     const rejectedDestinations = new Map<number, Stage>();
//     const rejectionSources = new Map<number, Stage>();

//     rejectedLinks.forEach((link) => {
//         rejectedDestinations.set(link.rejected_stage_id, link.rejected_stage);
//         rejectionSources.set(link.rejected_stage_id, link.from_stage); // reverse lookup
//     });

//     if (rejectedDestinations.has(currentStageId)) {
//         sequence.push({
//             id: currentStageId,
//             name:
//                 rejectedDestinations.get(currentStageId)?.stage_name ||
//                 `Stage ${currentStageId}`,
//             description:
//                 rejectedDestinations.get(currentStageId)?.description || "",
//             isRejected: true,
//             isCurrent: true,
//             rejected: {
//                 id: currentStageId,
//                 name:
//                     rejectedDestinations.get(currentStageId)?.stage_name || "",
//                 from: rejectionSources.get(currentStageId)?.stage_name || "",
//             },
//         });
//     }

//     return sequence;
// }
// function buildStageSequence(
//     approvedLinks: ApprovedRecord[],
//     rejectedLinks: RejectedRecord[],
//     startStageId: number,
//     currentStageId: number
// ) {
//     const approvedMap = new Map<number, Stage>();
//     const rejectedMap = new Map<number, { from: Stage; to: Stage }>();

//     approvedLinks.forEach((link) => {
//         approvedMap.set(link.from_stage_id, link.to_stage);
//     });

//     rejectedLinks.forEach((link) => {
//         rejectedMap.set(link.from_stage_id, {
//             from: link.from_stage,
//             to: link.rejected_stage,
//         });
//     });

//     const sequence: {
//         id: number;
//         name: string;
//         description?: string;
//         rejected?: { id: number; name: string };
//         isCurrent?: boolean;
//     }[] = [];

//     let current = startStageId;

//     while (current) {
//         const fromStage = approvedLinks.find(
//             (s) => s.from_stage_id === current
//         )?.from_stage;
//         const to = approvedMap.get(current);
//         const rejection = rejectedMap.get(current);

//         // Check if this stage is the one that leads to the rejected current stage
//         const rejectedToCurrent = rejection?.to.id === currentStageId;

//         sequence.push({
//             id: current,
//             name: fromStage?.stage_name || `Stage ${current}`,
//             description: fromStage?.description || "",
//             isCurrent: current === currentStageId,
//             rejected: rejectedToCurrent
//                 ? {
//                       id: rejection?.to.id,
//                       name: rejection?.to.stage_name || "",
//                   }
//                 : undefined,
//         });

//         if (!to) break;
//         current = to.id;
//     }

//     return sequence;
// }
function buildStageSequence(
    approvedLinks: ApprovedRecord[],
    rejectedLinks: RejectedRecord[],
    startStageId: number,
    currentStageId: number
) {
    const approvedMap = new Map<number, Stage>();
    const approvedFromMap = new Map<number, Stage>();
    const rejectedMap = new Map<number, { from: Stage; to: Stage }>();
    const rejectedTargetMap = new Map<number, Stage>();

    approvedLinks.forEach((link) => {
        approvedMap.set(link.from_stage_id, link.to_stage);
        approvedFromMap.set(link.from_stage_id, link.from_stage);
    });

    rejectedLinks.forEach((link) => {
        rejectedMap.set(link.from_stage_id, {
            from: link.from_stage,
            to: link.rejected_stage,
        });
        rejectedTargetMap.set(link.rejected_stage_id, link.from_stage);
    });

    const sequence: {
        id: number;
        name: string;
        description?: string;
        rejected?: { id: number; name: string };
        isCurrent?: boolean;
    }[] = [];

    const seenStageIds = new Set<number>();
    let current = startStageId;

    while (current && !seenStageIds.has(current)) {
        seenStageIds.add(current);

        const fromStage = approvedFromMap.get(current);
        const to = approvedMap.get(current);
        const rejection = rejectedMap.get(current);

        const rejectedToCurrent = rejection?.to.id === currentStageId;

        sequence.push({
            id: current,
            name: fromStage?.stage_name || `Stage ${current}`,
            description: fromStage?.description || "",
            isCurrent: current === currentStageId,
            rejected: rejectedToCurrent
                ? {
                      id: rejection.to.id,
                      name: rejection.to.stage_name,
                  }
                : undefined,
        });

        if (!to) break;
        current = to.id;
    }

    // ✅ ADD MISSING CURRENT STAGE IF NOT IN SEQUENCE
    const foundStage = sequence.find((s) => s.id === currentStageId);

    if (foundStage) {
        foundStage.isCurrent = true;
    } else {
        // Try to find if it's a rejected destination
        const rejectedStage = rejectedLinks.find(
            (r) => r.rejected_stage_id === currentStageId
        );

        if (rejectedStage) {
            const parent = sequence.find(
                (s) => s.id === rejectedStage.from_stage_id
            );
            if (parent) {
                parent.rejected = {
                    id: currentStageId,
                    name: rejectedStage.rejected_stage.stage_name,
                };
            }
        } else {
            // Not found anywhere — add as fallback
            sequence.push({
                id: currentStageId,
                name: `Stage ${currentStageId}`,
                description: "",
                isCurrent: true,
            });
        }
    }

    console.log(
        "Final stage sequence",
        sequence.map((s) => ({
            id: s.id,
            current: s.isCurrent,
            rejectedTo: s.rejected?.name,
        }))
    );
    return sequence;
}

export function StageProgressBar({ row }: Props) {
    const { to_stages_with_records, rejected_stages_with_records, stages } =
        row.original;

    const startStageId = to_stages_with_records[0]?.from_stage_id ?? 1;
    const stagesSequence = buildStageSequence(
        to_stages_with_records,
        rejected_stages_with_records,
        startStageId,
        stages.id
    );

    return (
        // <Menubar className="bg-muted rounded-lg px-4 shadow-sm space-x-2">
        //     {stagesSequence.map((stage) => (
        //         <MenubarMenu key={stage.id}>
        //             <MenubarTrigger
        //                 className={`
        //   w-5 h-5 rounded-full border
        //   ${
        //       stage.isRejected
        //           ? "bg-red-500"
        //           : stage.isCurrent
        //           ? "bg-blue-500"
        //           : "bg-green-500"
        //   }
        // `}
        //             >
        //                 {/* No text inside */}
        //             </MenubarTrigger>

        //             <MenubarContent className="p-3 w-64 space-y-1">
        //                 <MenubarItem className="text-base font-semibold">
        //                     {stage.name}
        //                 </MenubarItem>
        //                 <MenubarItem className="text-sm text-muted-foreground whitespace-normal break-words">
        //                     {stage.description || "No description provided."}
        //                 </MenubarItem>

        //                 {stage.rejected && !stage.isRejected && (
        //                     <MenubarItem className="text-sm">
        //                         On reject → {stage.rejected.name}
        //                     </MenubarItem>
        //                 )}

        //                 {stage.isRejected && (
        //                     <>
        //                         <MenubarItem className="text-red-600 font-medium">
        //                             ❌ Reached via Rejection
        //                         </MenubarItem>
        //                         {stage.rejected?.from && (
        //                             <MenubarItem className="text-muted-foreground text-xs">
        //                                 Rejected from: {stage.rejected.from}
        //                             </MenubarItem>
        //                         )}
        //                     </>
        //                 )}

        //                 {stage.isCurrent && !stage.isRejected && (
        //                     <MenubarItem className="text-blue-600 font-medium">
        //                         ✅ Current Active Stage
        //                     </MenubarItem>
        //                 )}
        //             </MenubarContent>
        //         </MenubarMenu>
        //     ))}
        // </Menubar>
        <Menubar className="bg-muted rounded-lg px-4 shadow-sm space-x-2">
            {stagesSequence.map((stage) => (
                <MenubarMenu key={stage.id}>
                    {/* <MenubarTrigger className="w-5 h-5 rounded-full border bg-green-500" /> */}
                    <MenubarTrigger
                        className={`
    w-5 h-5 rounded-full border
    ${
        stage.rejected
            ? "bg-red-500 border-red-600"
            : stage.isCurrent
            ? "bg-blue-500 border-blue-600"
            : "bg-green-500 border-green-600"
    }
  `}
                    />

                    <MenubarContent className="p-3 w-64 space-y-1">
                        <MenubarItem className="text-base font-semibold">
                            {stage.name}
                        </MenubarItem>

                        <MenubarItem className="text-sm text-muted-foreground whitespace-normal break-words">
                            {stage.description || "Tidak ada deskripsi."}
                        </MenubarItem>

                        {stage.rejected && (
                            <MenubarItem className="text-red-600 text-sm font-medium">
                                ❌ Ditolak → {stage.rejected.name}
                            </MenubarItem>
                        )}

                        {stage.isCurrent && !stage.rejected && (
                            <MenubarItem className="text-blue-600 font-medium">
                                ✅ Tahapan saat ini
                            </MenubarItem>
                        )}
                    </MenubarContent>
                </MenubarMenu>
            ))}
        </Menubar>
    );
}
