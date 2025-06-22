import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
    MenubarContent,
    MenubarItem,
} from "@/components/ui/menubar";

const approvedPaths = {
    "1": 3,
    "2": 1,
    "3": 4,
    "4": 15,
    "5": 15,
    "15": 6,
    "19": 15,
    "22": 3,
};

const rejectedPaths = {
    "1": 2,
    "3": 14,
    "15": 5,
    "22": 5,
};

// Simulated state (could come from props or backend)
const currentStage = 15;
const rejectedStages = [15]; // e.g., stage 15 was rejected

function buildStageSequence(startId: number) {
    const sequence: {
        id: number;
        rejected?: number;
        isRejected?: boolean;
        isCurrent?: boolean;
    }[] = [];

    let current = startId;

    while (current) {
        sequence.push({
            id: current,
            rejected: rejectedPaths[current],
            isRejected: rejectedStages.includes(current),
            isCurrent: current === currentStage,
        });

        current = approvedPaths[current];
    }

    return sequence;
}

export default function StageProgressBarPrototype() {
    const stages = buildStageSequence(1);

    return (
        <Menubar className="bg-muted rounded-lg px-4 shadow-sm space-x-2">
            {stages.map((stage) => (
                <MenubarMenu key={stage.id}>
                    <MenubarTrigger
                        className={`${
                            stage.isRejected
                                ? "text-red-600 font-semibold"
                                : stage.isCurrent
                                ? "text-blue-700 font-bold"
                                : "text-green-700"
                        }`}
                    >
                        Stage {stage.id}
                    </MenubarTrigger>

                    <MenubarContent className="p-2 space-y-1">
                        <MenubarItem>Stage ID: {stage.id}</MenubarItem>

                        {stage.rejected && (
                            <MenubarItem>
                                Reject path → Stage {stage.rejected}
                            </MenubarItem>
                        )}

                        {stage.isRejected && (
                            <MenubarItem className="text-red-600 font-medium">
                                ❌ Rejected at this stage
                            </MenubarItem>
                        )}

                        {stage.isCurrent && !stage.isRejected && (
                            <MenubarItem className="text-blue-600 font-medium">
                                ✅ Current Active Stage
                            </MenubarItem>
                        )}
                    </MenubarContent>
                </MenubarMenu>
            ))}
        </Menubar>
    );
}
