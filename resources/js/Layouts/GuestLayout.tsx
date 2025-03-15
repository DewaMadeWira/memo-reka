import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { PropsWithChildren } from "react";

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-white pt-6 sm:justify-center sm:pt-0 ">
            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4  sm:max-w-md sm:rounded-lg mx-10 font-cabin">
                <div className="flex justify-center">
                    <Link href="/">
                        <ApplicationLogo width={200} height={200} />
                    </Link>
                </div>
                <h3 className="text-center font-bold text-2xl my-7">
                    Sistem Informasi Persuratan
                </h3>
                <div className="">{children}</div>
            </div>
        </div>
    );
}
