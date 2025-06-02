import SidebarAuthenticated from "@/Layouts/SidebarAuthenticated";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useState } from "react";

interface SettingsProps {
    settings: {
        company_name: string;
        company_code: string;
        company_logo: string;
        company_logo_small: string;
    };
}

export default function Index({ settings }: SettingsProps) {
    const [logoPreview, setLogoPreview] = useState<string | null>(
        settings.company_logo
    );
    const [smallLogoPreview, setSmallLogoPreview] = useState<string | null>(
        settings.company_logo_small
    );

    const { data, setData, post, processing, errors } = useForm({
        company_name: settings.company_name || "",
        company_code: settings.company_code || "",
        company_logo: null as File | null,
        company_logo_small: null as File | null,
    });

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData("company_logo", file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSmallLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData("company_logo_small", file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSmallLogoPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/admin/manajemen-pengaturan", {
            forceFormData: true,
        });
    };

    return (
        <SidebarAuthenticated>
            <Head title="Pengaturan Aplikasi" />
            <div className="w-full p-10">
                <Breadcrumb className="mb-6">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="">Manajemen</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Pengaturan Aplikasi</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <h1 className="font-bold text-2xl">Pengaturan Aplikasi</h1>

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Informasi Perusahaan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="company_name">
                                        Nama Perusahaan
                                    </Label>
                                    <Input
                                        id="company_name"
                                        value={data.company_name}
                                        onChange={(e) =>
                                            setData(
                                                "company_name",
                                                e.target.value
                                            )
                                        }
                                    />
                                    {errors.company_name && (
                                        <p className="text-red-500 text-sm">
                                            {errors.company_name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="company_code">
                                        Kode Perusahaan
                                    </Label>
                                    <Input
                                        id="company_code"
                                        value={data.company_code}
                                        onChange={(e) =>
                                            setData(
                                                "company_code",
                                                e.target.value
                                            )
                                        }
                                    />
                                    {errors.company_code && (
                                        <p className="text-red-500 text-sm">
                                            {errors.company_code}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="company_logo">
                                        Logo Perusahaan
                                    </Label>
                                    <Input
                                        id="company_logo"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                    />
                                    {errors.company_logo && (
                                        <p className="text-red-500 text-sm">
                                            {errors.company_logo}
                                        </p>
                                    )}
                                    {logoPreview && (
                                        <div className="mt-2">
                                            <p className="text-sm mb-1">
                                                Preview:
                                            </p>
                                            <img
                                                src={logoPreview}
                                                alt="Logo Preview"
                                                className="h-20 object-contain border rounded p-2"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="company_logo_small">
                                        Logo Kecil (Icon)
                                    </Label>
                                    <Input
                                        id="company_logo_small"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleSmallLogoChange}
                                    />
                                    {errors.company_logo_small && (
                                        <p className="text-red-500 text-sm">
                                            {errors.company_logo_small}
                                        </p>
                                    )}
                                    {smallLogoPreview && (
                                        <div className="mt-2">
                                            <p className="text-sm mb-1">
                                                Preview:
                                            </p>
                                            <img
                                                src={smallLogoPreview}
                                                alt="Small Logo Preview"
                                                className="h-10 object-contain border rounded p-2"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing
                                        ? "Menyimpan..."
                                        : "Simpan Pengaturan"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </SidebarAuthenticated>
    );
}
