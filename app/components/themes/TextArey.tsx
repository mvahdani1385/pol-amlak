import "@/app/css/themes.css"


interface TextAreyInputProps {
    key?: string | number;
    category?: string;
    place: string;
    handlePropertyChange?: (fieldName: string, value: string) => void;
    value: string;
}


function TextArey({ category, place, handlePropertyChange, value }: TextAreyInputProps) {
    return (
        <>
            <div className="TextArey w-[100%]">
                <label className="label">{place} :</label>
                {value ? (
                    <textarea
                        placeholder={place}
                        value={value}
                        onChange={(e) => {
                            if (handlePropertyChange && category) {
                                handlePropertyChange(
                                    category,
                                    e.target.value
                                );
                            }
                        }}
                    />

                ) : (
                    <textarea
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

                )}
            </div>
        </>
    )
}

export default TextArey