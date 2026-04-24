import "@/app/css/themes.css"
import { toast } from "react-toastify";

interface TextInputProps {
    key?: string | number;
    category?: string;
    place?: string;
    isNumber?: boolean;
    isPrice?: boolean;
    lang?: String;
    value?: string | number;
    phone?: boolean;
    handlePropertyChange?: (fieldName: string, value: string) => void;
}

function TextInput({ category, place, isNumber, isPrice, value, lang, phone, handlePropertyChange }: TextInputProps) {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let currentValue = e.target.value;

        function validateInput(input: any) {
            const regex = /[^a-zA-Z0-9\s-.:/]/g;
            if (regex.test(input)) {
                toast.warn("فقط اجازه ورود کاراکترهای انگلیسی را دارید.");
                return input.replace(regex, '');
            }
            return input;
        }

        if (lang === 'en') {
            currentValue = validateInput(currentValue);
        }


        if (isNumber || isPrice) {
            const numericValue = currentValue.replace(/[^0-9]/g, '');

            if (isPrice) {
                const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                if (handlePropertyChange && category) {
                    handlePropertyChange(category, numericValue);
                }

                e.target.value = formattedValue;
                return;
            }

            currentValue = numericValue;
        }

        if (handlePropertyChange && category) {
            handlePropertyChange(category, currentValue);
        }
    };

    const actualLang = (lang === '' || lang === undefined || lang === null) ? 'all' : lang;

    if (lang !== 'en') {
        lang = 'all';
    }

    let minle = 0
    let maxle = 999

    if (phone === true) {
        minle = 11
        maxle = 11
    }

    const formattedValue =
        isPrice && typeof value === "string"
            ? value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : value ?? '';

    return (
        <div className="textInput">
            <label className="label">{place} :</label>
            <input
                type="text"
                className=""
                placeholder={place}
                inputMode={isNumber || isPrice ? "numeric" : "text"}
                onChange={handleChange}
                value={formattedValue}
                minLength={minle}
                maxLength={maxle}
                style={phone === true || lang === 'en' ? { textAlign: 'left' } : undefined}
            />
        </div>
    );
}

export default TextInput;
