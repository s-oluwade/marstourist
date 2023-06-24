import { RadioGroup } from "@headlessui/react";
import { useEffect, useState } from "react";

export default function ThemeSubPage() {
    const [theme, setTheme] = useState("");

    useEffect(() => {
        // Use theme
        const theme = localStorage.getItem('themeStorage');
        if (theme) {
            setTheme(theme);
        }
        else {
            // Use default theme
            const defaultTheme = localStorage.getItem('defaultThemeStorage');
            if (defaultTheme) {
                setTheme(defaultTheme);
            }
        }
    }, [theme])

    function changeTheme(newTheme: string) {
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('themeStorage', newTheme);
    }

    return (
        <div className="flex flex-col font-mono grow justify-center">
            <div className="mx-20 border-8">
                <h1 className="text-3xl font-bold text-center mb-5">Themes</h1>
                <RadioGroup className="mt-5" value={theme} onChange={changeTheme}>
                    <RadioGroup.Label>Choose theme color</RadioGroup.Label>
                    <div className="flex flex-wrap mt-2 gap-4">
                        <RadioGroup.Option value="light">
                            <span className="ui-checked:bg-primary cursor-pointer">Light</span>
                        </RadioGroup.Option>
                        <RadioGroup.Option value="dark">
                            <span className="ui-checked:bg-primary cursor-pointer">Dark</span>
                        </RadioGroup.Option>
                        <RadioGroup.Option value="cupcake">
                            {<span className="ui-checked:bg-primary cursor-pointer">Cupcake</span>}
                        </RadioGroup.Option>
                    </div>
                </RadioGroup>
            </div>
        </div>
    )
}
