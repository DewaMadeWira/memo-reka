import React from "react";
import { Link } from "@inertiajs/react";

export default function Index({
    message = "Anda tidak memiliki akses untuk halaman ini.",
}) {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <div className="text-center">
                    <h1 className="text-6xl font-bold text-red-500 mb-4">
                        403
                    </h1>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                        Akses Ditolak
                    </h2>
                    {/* <div className="h-1 w-16 bg-red-500 mx-auto my-4"></div> */}
                    <p className="text-gray-600 mb-6">{message}</p>

                    <Link
                        href="/dashboard"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300 ease-in-out"
                    >
                        Kembali ke Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
