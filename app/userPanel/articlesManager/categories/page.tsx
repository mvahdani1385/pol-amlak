"use client";

import { useState, useEffect } from 'react';
import TextInput from "../../../components/themes/TextInput"
import TextArey from "../../../components/themes/TextArey"
import "@/app/css/themes.css"
import Link from 'next/link';
import { toast } from 'react-toastify';

function Categories() {
    const [seobox, setSeobox] = useState(false);
    const [categories, setCategories] = useState<any>()
    const [pageStatus, setPageStatus] = useState('insert')

    const [category, setCategory] = useState<any>({
        name: "",
        slug: "",
        description: "",
        seoTitle: "",
        seoMeta: "",
        seoCanonikalOrigin: "",
        seoCanonikalDestination: "",
        indexed: "false",
        seoOrigin: "",
        seoDestination: "",
        seoRedirect: "301",
    })

    const handlePropertyChange = async (key: string, value: any) => {
        await setCategory((prev: any) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleCreateCategory = async () => {
        if (category.name === '' || null || undefined) {
            toast.warn("وارد کردن نام دسته بندی اجباری است");
            return
        }
        if (category.slug === '' || null || undefined) {
            toast.warn("وارد کردن نامک برای دسته بندی اجباری است");
            return
        }
        try {
            const response = await fetch('http://localhost:3000/api/articlesCategories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(category)
            });

            const result = await response.json();

            if (!response.ok) {
                if (response.status === 409) {
                    toast.warn(result.message || 'این نامک قبلاً استفاده شده است.');
                } else {
                    toast.error(result.message || 'خطایی رخ داد!');
                }
                return;
            }

            toast.success('دسته با موفقیت ایجاد شد');
            window.location.reload();

            return result;
        } catch (error) {
            console.error('خطا در ایجاد دسته:', error);
        }
    }

    const handleUpdateCategory = () => {
        try {
            fetch('/api/articlesCategories', {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(category)
            })

            window.location.reload();
        } catch (error) {
            console.error('خطا در  حذف دیته بندی', error)
        }
    }

    const handleDlete = ((id: any) => {
        if (!confirm('آیا از حذف این دسته بندی مطمئنید ... !؟')) { return }
        try {
            fetch('/api/articlesCategories', {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        "id": id
                    }
                )
            })

            window.location.reload();
        } catch (error) {
            console.error('خطا در  حذف دیته بندی', error)
        }
    })

    useEffect(() => {
        let editeslug = category.slug.replace(/ /g, '-')
        handlePropertyChange('slug', editeslug)
    }, [category.slug])

    useEffect(() => {
        fetch('/api/articlesCategories', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                setCategories(data.data);
            })
            .catch(error => {
                console.error("خطا در دریافت دسته‌بندی‌ها:", error);
            });
    }, []);


    useEffect(() => {
        console.log(categories)
    }, [categories])

    useEffect(() => {
        document.title = 'ادمین پنل | دسته بندی مقالات';
    }, []);


    return (
        <div className="container flex flex-wrap justify-between py-5 items-center h-[100vh] flex gap-15 m-auto">
            <div className="backs flex gap-8 w-full justify-end text-xl cursor-pointer px-6">
                <Link href={`/userPanel/articlesManager`}><i className="tabBtn ri-arrow-go-back-line"></i></Link>
                <Link href={'/userPanel'}><i className="tabBtn ri-home-line"></i></Link>
            </div>
            <div className={`insert w-[95%] md:w-[45%] m-auto border transition duration-1000 ${pageStatus === 'update' && 'border-[var(--title)] animate-poop'} rounded-xl p-5 max-h-[90vh] h-[80vh] overflow-y-scroll`}>
                {pageStatus === 'insert' ? (
                    <h2 className="text-xl font-bold text-center">افزودن دسته بندی</h2>
                ) : (
                    <div className='flex w-[90%] m-auto justify-between'>
                        <h2 className="text-xl font-bold text-center text-[var(--title)]">ویرایش دسته بندی</h2>
                        <button onClick={() => {
                            setPageStatus('insert')
                            setCategory({
                                name: "",
                                slug: "",
                                description: "",
                                seoTitle: "",
                                seoMeta: "",
                                seoCanonikalOrigin: "",
                                seoCanonikalDestination: "",
                                indexed: "false",
                                seoOrigin: "",
                                seoDestination: "",
                                seoRedirect: "301",
                            })
                        }} className='text-red-900 hover:text-red-500 cursor-pointer'>خروج از ویرایش</button>
                    </div>
                )}
                <div className="form flex flex-wrap justify-between mt-5">
                    <div className="normaldata w-[95%] flex flex-wrap justify-between m-auto">
                        <TextInput
                            place='نام دسته بندی'
                            category={'name'}
                            handlePropertyChange={handlePropertyChange}
                            isNumber={false}
                            value={category.name}
                        />
                        <TextInput
                            place='نامک دسته بندی ( حتما انگلیسی باشه )'
                            category={'slug'}
                            handlePropertyChange={handlePropertyChange}
                            isNumber={false}
                            lang={'en'}
                            value={category.slug}
                        />
                        <div className='w-[100%] mt-5'>
                            <TextArey
                                place='توضیحات دسته بندی'
                                category={'description'}
                                handlePropertyChange={handlePropertyChange}
                                value={category.description}
                            />
                        </div>
                    </div>
                    <div className={`seoData w-[98%] transition flex flex-wrap justify-between m-auto mt-10 border border-[var(--boxback)] rounded-xl overflow-hidden ${seobox ? 'h-auto' : 'h-[80px]'}`}>
                        <div
                            className={`flex justify-between items-center px-10 w-[100%] bg-[var(--boxback)] cursor-pointer h-[80px]`}
                            onClick={() => {
                                if (seobox) {
                                    setSeobox(false)
                                } else {
                                    setSeobox(true)
                                }
                            }}
                        >
                            <h2>باکس سئو</h2>
                            <i className=''>▼</i>
                        </div>
                        <div className='w-[100%] transition flex flex-wrap justify-around m-auto p-1 py-7'>
                            <TextInput
                                place='تایتل سئو'
                                category={'seoTitle'}
                                handlePropertyChange={handlePropertyChange}
                                isNumber={false}
                                value={category.seoTitle}
                            />
                            <TextInput
                                place='متا دیسکریپشن'
                                category={'seoMeta'}
                                handlePropertyChange={handlePropertyChange}
                                isNumber={false}
                                value={category.seoMeta}
                            />

                            <h3 className='w-full mt-5 mb-2 mr-3'>تگ کنونیکال :</h3>
                            <TextInput
                                place='لینک صفحه مبدا'
                                category={'seoCanonikalOrigin'}
                                handlePropertyChange={handlePropertyChange}
                                isNumber={false}
                                value={category.seoCanonikalOrigin}
                            />
                            <TextInput
                                place='لینک صفحه مقصد'
                                category={'seoCanonikalDestination'}
                                handlePropertyChange={handlePropertyChange}
                                isNumber={false}
                                value={category.seoCanonikalDestination}
                            />

                            <h3 className='w-full mt-5 mb-2 mr-3'>وضعیت ایندکس :</h3>
                            <button
                                className={`subBtn w-[48%] h-[45px] ${category.indexed === 'true' ? 'active' : ''}`}
                                onClick={() => {
                                    handlePropertyChange('indexed', 'true')
                                }}
                            >ایندکس</button>
                            <button
                                className={`subBtn w-[48%] h-[45px] ${category.indexed === 'false' ? 'active' : ''}`}
                                onClick={() => {
                                    handlePropertyChange('indexed', 'false')
                                }}
                            >نو ایندکس</button>

                            <h3 className='w-full mt-5 mb-2 mr-3'>ریدایرکت :</h3>
                            <TextInput
                                place='لینک مبدا'
                                category={'seoOrigin'}
                                handlePropertyChange={handlePropertyChange}
                                isNumber={false}
                                value={category.seoOrigin}
                            />
                            <TextInput
                                place='لینک مقصد'
                                category={'seoDestination'}
                                handlePropertyChange={handlePropertyChange}
                                isNumber={false}
                                value={category.seoDestination}
                            />

                            <h3 className='w-full mt-5 mb-2 mr-3'>نوع ریدایرکت :</h3>
                            <button
                                className={`subBtn w-[48%] h-[45px] ${category.seoRedirect === '301' ? 'active' : ''}`}
                                onClick={() => {
                                    handlePropertyChange('seoRedirect', '301')
                                }}
                            >301</button>
                            <button
                                className={`subBtn w-[48%] h-[45px] ${category.seoRedirect === '302' ? 'active' : ''}`}
                                onClick={(e) => {
                                    handlePropertyChange('seoRedirect', '302')
                                }}
                            >302</button>
                        </div>
                    </div>
                    {pageStatus === 'insert' ? (
                        <button
                            className='subBtn w-[98%] h-[45px] m-auto mt-5'
                            onClick={handleCreateCategory}
                        >ایجاد دسته بندی</button>
                    ) : (
                        <button
                            className='subBtn w-[98%] h-[45px] m-auto mt-5'
                            onClick={handleUpdateCategory}
                        >به روزرسانی دسته بندی</button>
                    )}
                </div>
            </div>
            <div className="report w-[95%] md:w-[45%] m-auto  border rounded-xl p-5 max-h-[90vh] h-[80vh] overflow-y-scroll">
                <h2 className="text-xl font-bold text-center">مدیریت دسته بندی ها</h2>
                {categories && categories.length > 0 ? (
                    <div className='w-full px-5 mt-5'>
                        <div className='flex h-[50px] justify-between items-center px-5 border-b'>
                            <p className='w-[30%] h-[20px] overflow-hidden'>نام</p>
                            <p className='w-[30%] h-[20px] overflow-hidden'>نامک</p>
                            <div className='w-[40%] flex ccdiv gap-5'>
                                <p>عملیات ها</p>
                            </div>
                        </div>
                        {
                            categories.map((cate: any, idx: any) => (
                                <div key={idx} className='flex h-[50px] justify-between items-center px-5 my-5 border rounded-xl'>
                                    <p className='w-[30%] h-[20px] overflow-hidden'>{cate.name}</p>
                                    <p className='w-[30%] h-[20px] overflow-hidden'>{cate.slug}</p>
                                    <div className='w-[40%] flex ccdiv gap-5'>
                                        {/* <Link href={''} className='hover:border-b'>مشاهده</Link> */}
                                        <button
                                            className='text-orange-400 hover:text-orange-600 cursor-pointer'
                                            onClick={() => {
                                                setPageStatus('update');
                                                setCategory(cate)
                                            }}
                                        >ویرایش</button>
                                        <button
                                            className='text-red-300 hover:text-red-600 cursor-pointer'
                                            onClick={() => {
                                                handleDlete(cate.id)
                                            }}
                                        >حذف</button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                ) : (
                    <p className='mt-10 text-center'>هیچ دسته بندی وجود ندارد</p>
                )}
            </div>
        </div>
    )
}

export default Categories