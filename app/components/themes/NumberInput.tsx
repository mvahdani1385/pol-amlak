import "@/app/css/themes.css"

interface NumberInputProps {
    category?: string;
    place?: string;
    handlePropertyChange?: (fieldName: string, value: string) => void;
}


function NumberInput({ category, handlePropertyChange, place }: NumberInputProps) {
    return (
        <>
            <div className="numberInput">
                <label className="label">{place}</label>
                <input
                    type="number"
                    className=""
                    placeholder={place}
                    onChange={(e) => {
                        if (handlePropertyChange && category) {
                            handlePropertyChange(
                                category,
                                e.target.value
                            );
                        }
                    }}
                />
            </div>
        </>
    )
}

export default NumberInput