"use client";

import TextArey from "@/app/components/themes/TextArey";
import TextInput from "@/app/components/themes/TextInput";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";



function Services({ allServ, setAllserv }: any){
    const [newServ, setNewServ] = useState({name: '', img: '', desc: ''})
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
        setAllserv((prev: any) => ({
            ...prev,
            [key]: Array.isArray(prev[key]) ? [...prev[key], item] : [item],
        }));
    };

    const updateServiceByIndex = (index: any, newItem: any) => {
        console.log('index : ', index)
        console.log('value : ', newItem)
        setAllserv((prev: any) => {
            if (!Array.isArray(prev.services)) return prev;
            if (index < 0 || index >= prev.services.length) {
            return prev;
            }
            const updated = [...prev.services];
            updated[index] = newItem;
            return {
                ...prev,
                services: updated,
            };
        });
    };


    const handlecreate = ()=>{
        if(newServ.name === ''){
            toast.warn('وارد کردن نام خدمت الزامی است.');
            return;
        }
        handleArrayPropertyChange('services', newServ)
        setBtntype('');
        setEditeId(null);
        setNewServ({name: '', img: '', desc: ''})
    }

    const handleedite = ()=>{
        
        if(newServ.name === ''){
            toast.warn('وارد کردن نام خدمت الزامی است.');
            return;
        }
        updateServiceByIndex(editeId, newServ)
        setBtntype('');
        setEditeId(null);
        setNewServ({name: '', img: '', desc: ''})
    }

    const handleDeleteService = (indexToDelete: number) => {
        setAllserv((prev: any) => {
            if (!Array.isArray(prev.services) || prev.services.length === 0) {
                return prev;
            }
            if (indexToDelete < 0 || indexToDelete >= prev.services.length) {
                console.warn(`Index ${indexToDelete} is out of bounds for deletion.`);
                return prev;
            }
            const updatedServices = prev.services.filter((_: any, index: any) => index !== indexToDelete);
            return {
                ...prev,
                services: updatedServices,
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
                        setNewServ({name: '', img: '', desc: ''})
                    }}
                    className="subBtn w-[300px] h-[45px]"
                >ایجاد خدمت جدید</button>
            ) : (
                <button
                    onClick={()=>{
                        setBtntype('');
                        setEditeId(null);
                        setNewServ({name: '', img: '', desc: ''})
                    }}
                    className="subBtn w-[300px] h-[45px] mb-5"
                >بازگشت به لیست</button>
            )}
            <div className={`form flex flex-wrap items-end gap-5 border p-3 rounded-lg border-[var(--foreground)]/80 ${btnTpe === '' && 'hidden'}`}>
                <input 
                    type="file" 
                    accept=".svg, .png, image/svg+xml, image/png"
                    ref={imageref} 
                    className="hidden"
                    onChange={handleuploadimage}
                />
                <div 
                    onClick={handleclickinput}
                    className="upimage w-[100px] h-[100px] ccdiv flex-col border border-dashed border-[var(--foreground)]/20 p-3 text-xs rounded-xl cursor-pointer hover:bg-[var(--lightboxback)]">
                    <p>+</p>
                    <p>بارگذاری ایکن</p>
                </div>
                {newServ?.img !== '' && (
                    <div 
                        onClick={handleclickinput}
                        className="upimage w-[100px] h-[100px] ccdiv flex-col border border-dashed border-[var(--foreground)]/20 p-3 text-xs rounded-xl cursor-pointer hover:bg-[var(--lightboxback)]">
                        <img src={`/uploads/${newServ.img}`} className="w-full h-full" />
                    </div>
                )}
                <TextInput
                    place="نام خدمت"
                    category="name"
                    handlePropertyChange={handleDataChange}
                    value={newServ.name}
                />
                <TextInput
                    place="توضیح کوتاه خدمت"
                    category="desc"
                    handlePropertyChange={handleDataChange}
                    value={newServ.desc}
                />
                {btnTpe === 'create' ? (
                    <button
                        onClick={handlecreate}
                        className="subBtnRe w-full h-[45px]"
                    >ایجاد خدمت</button>
                ) : btnTpe === 'edite' && (
                    <button
                        onClick={handleedite}
                        className="subBtnRe w-full h-[45px]"
                    >ویرایش خدمت</button>
                )}
            </div>
            {allServ?.length > 0 && (
                <div className="all flex flex-col gap-3">
                    {btnTpe === '' && (
                        <h3 className="mt-3 w-full text-xl">همه خدمات : </h3>
                    )}
                    {[...allServ].reverse().map((ser: any, idx: any)=>{
                        const realIndex = allServ.length - 1 - idx;
                        if(btnTpe === 'create'){return}
                        if(btnTpe === 'edite' && realIndex !== editeId){return}
                        return(
                            <div key={realIndex} className="box border border-[var(--foreground)]/40 p-2 mt-1 rounded flex items-center justify-between">
                                {ser.img !== '' ? (
                                    <img src={`/uploads/${ser.img}`} className="w-[50px] h-[50px] rounded" />
                                ) : (
                                    <img src="/media/404.jpg" className="w-[50px] h-[50px] rounded" />
                                )}
                                <h2 className="w-[20%] overflow-hidden text-ellipsis whitespace-nowrap mr-2">{ser.name}</h2>
                                <p className="w-[30%] md:w-[20%] overflow-hidden text-ellipsis whitespace-nowrap text-sm text-[var(--foreground)]/50">{ser.desc}</p>
                                <div className="btns w-[40%] md:w-[20%] flex justify-around">
                                    <button
                                        onClick={()=>{
                                            setBtntype('edite');
                                            setEditeId(realIndex);
                                            setNewServ({name: ser.name, img: ser.img, desc: ser.desc})
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

export default Services