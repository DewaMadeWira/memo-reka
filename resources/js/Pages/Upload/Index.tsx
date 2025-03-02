import { router } from "@inertiajs/react";
import React, { useState } from "react";

export default function Index() {
    const [values, setValues] = useState<{ file: File | undefined }>({
        file: undefined,
    });
    function handleSubmit() {
        router.post("/upload/", values);
    }
    return (
        <div>
            <input
                type="file"
                onChange={(e) =>
                    setValues({
                        ...values,
                        file: e.target.files?.[0],
                    })
                }
            />
            <button onClick={() => handleSubmit()}>Submit</button>
        </div>
    );
}
