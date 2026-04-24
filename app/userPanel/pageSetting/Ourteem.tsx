"use client";

import TextArey from "@/app/components/themes/TextArey";
import TextInput from "@/app/components/themes/TextInput";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";



function Ourteem({ allteem, setAllteem }: any){
    const [newServ, setNewServ] = useState({name: '', img: '', position: ''})
    const imageref = useRef<any>(null);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [imageUploadProgress, setImageUploadProgress] = useState(0);
    const [btnTpe, setBtntype] = useState('');
    const [editeId, setEditeId] = useState<number | null>(null);

    const handleDataChange = (key: any, value: any)=>{
        setNewServ(prev => ({ ...prev, [key]: value }))
    }

    // useEffect(()=>{
    //     console.log(newServ)
    // }, [newServ])

    const handleclickinput = ()=>{
        imageref.current?.click()
    }

    const handleuploadimage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // ایجاد نام فایل بر اساس زمان
        const timestamp = Date.now();
        const fileExtension = file.name.split('.').pop();
        const imageTimeName = `icon_${timestamp}.${fileExtension}`;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', imageTimeName);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                handleDataChange('img', imageTimeName);
                toast.success('آیکون با موفقیت آپلود شد');
            } else {
                toast.error('خطا در آپلود تصویر');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('خطای اتصال در آپلود تصویر');
        }
    };

    const handleArrayPropertyChange = (key: string, item: any) => {
        setAllteem((prev: any) => ({
            ...prev,
            [key]: Array.isArray(prev[key]) ? [...prev[key], item] : [item],
        }));
    };

    const updateServiceByIndex = (index: any, newItem: any) => {
        console.log('index : ', index)
        console.log('value : ', newItem)
        setAllteem((prev: any) => {
            if (!Array.isArray(prev.ourteem)) return prev;
            if (index < 0 || index >= prev.ourteem.length) {
            return prev;
            }
            const updated = [...prev.ourteem];
            updated[index] = newItem;
            return {
                ...prev,
                ourteem: updated,
            };
        });
    };


    const handlecreate = ()=>{
        if(newServ.name === ''){
            toast.warn('وارد کردن نام عضو الزامی است.');
            return;
        }
        handleArrayPropertyChange('ourteem', newServ)
        setBtntype('');
        setEditeId(null);
        setNewServ({name: '', img: '', position: ''})
    }

    const handleedite = ()=>{
        
        if(newServ.name === ''){
            toast.warn('وارد کردن نام عضو الزامی است.');
            return;
        }
        updateServiceByIndex(editeId, newServ)
        setBtntype('');
        setEditeId(null);
        setNewServ({name: '', img: '', position: ''})
    }

    const handleDeleteService = (indexToDelete: number) => {
        setAllteem((prev: any) => {
            if (!Array.isArray(prev.ourteem) || prev.ourteem.length === 0) {
                return prev;
            }
            if (indexToDelete < 0 || indexToDelete >= prev.ourteem.length) {
                console.warn(`Index ${indexToDelete} is out of bounds for deletion.`);
                return prev;
            }
            const updatedourteem = prev.ourteem.filter((_: any, index: any) => index !== indexToDelete);
            return {
                ...prev,
                ourteem: updatedourteem,
            };
        });
    };


    return(
        <div className="w-full">
            {btnTpe === '' ? (
                <button
                    onClick={()=>{
                        setBtntype('create');
                        setEditeId(null);
                        setNewServ({name: '', img: '', position: ''})
                    }}
                    className="subBtn w-[300px] h-[45px]"
                >ایجاد عضو جدید</button>
            ) : (
                <button
                    onClick={()=>{
                        setBtntype('');
                        setEditeId(null);
                        setNewServ({name: '', img: '', position: ''})
                    }}
                    className="subBtn w-[300px] h-[45px] mb-5"
                >بازگشت به لیست</button>
            )}
            <div className={`form flex flex-wrap items-end gap-5 border p-3 rounded-lg border-[var(--foreground)]/80 ${btnTpe === '' && 'hidden'}`}>
                <input 
                    type="file" 
                    accept=""
                    ref={imageref} 
                    className="hidden"
                    onChange={handleuploadimage}
                />
                <div 
                    onClick={handleclickinput}
                    className="upimage w-[100px] h-[100px] ccdiv flex-col border border-dashed border-[var(--foreground)]/20 p-3 text-xs rounded-xl cursor-pointer hover:bg-[var(--lightboxback)]">
                    <p>+</p>
                    <p>بارگذاری تصویر</p>
                </div>
                {newServ?.img !== '' && (
                    <div 
                        onClick={handleclickinput}
                        className="upimage w-[100px] h-[100px] ccdiv flex-col border border-dashed border-[var(--foreground)]/20 overflow-hidden text-xs rounded-xl cursor-pointer hover:bg-[var(--lightboxback)]">
                        <img src={`/uploads/${newServ.img}`} className="w-full h-full object-cover" />
                    </div>
                )}
                <TextInput
                    place="نام کامل عضو"
                    category="name"
                    handlePropertyChange={handleDataChange}
                    value={newServ.name}
                />
                <TextInput
                    place="سمت عضو"
                    category="position"
                    handlePropertyChange={handleDataChange}
                    value={newServ.position}
                />
                {btnTpe === 'create' ? (
                    <button
                        onClick={handlecreate}
                        className="subBtnRe w-full h-[45px]"
                    >افزودن عضو</button>
                ) : btnTpe === 'edite' && (
                    <button
                        onClick={handleedite}
                        className="subBtnRe w-full h-[45px]"
                    >ویرایش عضو</button>
                )}
            </div>
            {allteem?.length > 0 && (
                <div className="all flex flex-wrap gap-3">
                    {btnTpe === '' && (
                        <h3 className="mt-3 w-full text-xl">همه اعضا : </h3>
                    )}
                    {[...allteem].reverse().map((ser: any, idx: any)=>{
                        const realIndex = allteem.length - 1 - idx;
                        if(btnTpe === 'create'){return}
                        if(btnTpe === 'edite' && realIndex !== editeId){return}
                        return(
                            <div key={realIndex} className="box relative w-[220px] h-[300px] flex flex-col items-center justify-end gap-3 border border-[var(--foreground)]/0 p-2 z-0 mt-1 rounded-lg overflow-hidden">
                                {ser.img !== '' ? (
                                    <>
                                        <img src={`/uploads/${ser.img}`} className="absolute w-full h-full rounded top-0 object-cover" />
                                        <div className="cover absolute w-full h-full bg-gradient-to-t from-[var(--background)] via-[var(--background)]/80  top-0 z-1"></div>
                                    </>
                                ) : (
                                    <>
                                        <img src={`/media/404.jpg`} className="absolute w-full h-full rounded top-0 object-cover" />
                                        <div className="cover absolute w-full h-full bg-gradient-to-t from-[var(--background)] via-[var(--background)]/80  top-0 z-1"></div>
                                    </>
                                )}
                                <h2 className="w-[100%] overflow-hidden text-ellipsis whitespace-nowrap mr-2 z-1 text-center">{ser.name}</h2>
                                <p className="w-[100%] overflow-hidden text-ellipsis whitespace-nowrap text-sm text-[var(--foreground)] z-1 text-center">{ser.position}</p>
                                <div className="btns w-[100%] flex justify-around z-1">
                                    <button
                                        onClick={()=>{
                                            setBtntype('edite');
                                            setEditeId(realIndex);
                                            setNewServ({name: ser.name, img: ser.img, position: ser.position})
                                        }}
                                        className="subBtn w-[60%] h-[40px]"
                                    >ویرایش</button>
                                    <button
                                        onClick={()=> handleDeleteService(realIndex)}
                                        className="delBtn w-[30%] h-[40px]"
                                    >حذف</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default Ourteem