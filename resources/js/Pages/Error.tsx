import { Head } from "@inertiajs/react";

interface ErrorProps {
    status: number;
    message?: string;
}

export default function Error({ status, message }: ErrorProps) {
    const title =
        {
            503: "503: Service Unavailable",
            500: "500: Server Error",
            404: "404: Page Not Found",
            403: "403: Forbidden",
        }[status] || `${status}: Error`;

    const description =
        {
            503: "Sorry, we are doing some maintenance. Please check back soon.",
            500: "Whoops, something went wrong on our servers.",
            404: "Sorry, the page you are looking for could not be found.",
            403: "Sorry, you are forbidden from accessing this page.",
        }[status] ||
        message ||
        "An error occurred.";

    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
            <Head title={title} />

            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        {status}
                    </h1>
                    <p className="text-gray-600 mb-6">{description}</p>
                    <a
                        href="/"
                        className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
                    >
                        Go Home
                    </a>
                </div>
            </div>
        </div>
    );
}
