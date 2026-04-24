"use client";

import { notFound } from "next/navigation";
import { useState, useEffect } from 'react';
import Link from "next/link";
import { verify } from "crypto";
import { spawn } from "child_process";
import { toast } from "react-toastify";


const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";


async function getCommentData() {
    const res = await fetch(`/api/comments`, {
        cache: "no-store",
    });

    if (!res.ok) {
        if (res.status === 404) {
            notFound();
        }
        throw new Error(`Failed to fetch article: ${res.statusText}`);
    }

    const result = await res.json();
    return result;
}

async function updateComment(id?: number, replay?: any, verify?: any) {
    const commentData = {
        id: id,
        replay: replay,
        verify: verify
    };


    console.log(commentData)


    try {
        const response = await fetch(`/api/comments`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(commentData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'No error message from server'}`);
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error('Failed to update comment:', error);
        throw error;
    }
}

async function DeleteComment(id?: any) {
    try {
        const response = await fetch(`/api/comments`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ "id": id }
            )
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'No error message from server'}`);
        }

        const result = await response.json();
        toast.success('نظر با موفقیت حذف شد')
        return result;

    } catch (error) {
        console.error('Failed to update comment:', error);
        throw error;
    }
}

interface CommentType {
    id: number;
    user: [string, string]; // فرض بر این است که user یک tuple دو عنصری است
    comment: string;
    articleSlug: string;
    replay: String;
    verify: boolean
}

function Comments() {
    const [comments, setComments] = useState<any[]>([]);
    const [replayPopup, setReplayPopup] = useState<any>(null);
    const [popup, setPopup] = useState(true);
    const [replay, setReplay] = useState('');

    const [filter, setfilter] = useState('all')
    const [filterComment, setFilterComment] = useState<any[]>([]);

    useEffect(() => {
        if (filter === 'all') {
            setFilterComment(comments)
        } else if (filter === 'true') {
            setFilterComment(comments.filter(comment => comment.verify === true))
        } else if (filter === 'false') {
            setFilterComment(comments.filter(comment => comment.verify === false))
        }
    }, [filter, comments])

    useEffect(() => {
        getCommentData()
            .then(result => {
                setComments(result);
            })
            .catch(error => {
                console.error("Error fetching comments:", error);
            });
    }, [])

    useEffect(() => {
        document.title = 'ادمین پنل | دیدگاه ها';
    }, []);

    useEffect(() => {
        if (replayPopup && replayPopup.replay !== undefined) {
            setReplay(replayPopup.replay)
        }
    }, [replayPopup]);

    const handlePopup = ((id: number) => {
        const targetId = comments.findIndex((com) => com.id === id);
        setReplayPopup(comments[targetId])
    })

    const handleReplay = async (id: number, replay: string, verify: boolean) => {
        if (!confirm("آیا از اینکه این رو انتشار بدید مطمئنید!؟")) { return }
        try {
            const updatedComment = await updateComment(id, replay, verify);

            setComments(prevComments =>
                prevComments.map(comment =>
                    comment.id === id
                        ? { ...comment, replay: updatedComment.replay, verify: updatedComment.verify }
                        : comment
                )
            );

            setPopup(false)


        } catch (error) {
            console.error('Error updating comment:', error);
        }
    }

    const handleAccept = async (id: number, replay: string, verify: boolean) => {
        // if (!confirm("آیا از اینکه این نظر رو غیر فعال کنید مطمئنید!؟")) { return }
        try {
            const updatedComment = await updateComment(id, replay, verify);

            setComments(prevComments =>
                prevComments.map(comment =>
                    comment.id === id
                        ? { ...comment, replay: updatedComment.replay, verify: updatedComment.verify }
                        : comment
                )
            );

            setPopup(false)

            toast.success('عملیات با موفقیت انجام شد.')
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("آیا مطمئنید که می‌خواهید این نظر را حذف کنید؟")) return;

        try {
            const response = await DeleteComment(id);


            setComments(prevComments => prevComments.filter(comment => comment.id !== id));


        } catch (error) {
            console.error('Error deleting comment:', error);
            toast.error('خطا در حذف نظر رخ داد!');
        }
    };

    const activedbtn = ((e: any) => {
        document.querySelectorAll('.filters button')
            .forEach((btn) => {
                btn.classList.remove('bg-[var(--foreground)]', 'text-[var(--inputback)]')
            })
        e.classList.add('bg-[var(--foreground)]', 'text-[var(--inputback)]')
    })


    return (
        <div className="container comments w-[90%] md:w-[80%] mr-[5%] md:mr-[10%] py-10">
            <div className="backs flex gap-8 w-full justify-end text-xl cursor-pointer">
                <Link href={`/userPanel`}><i className="tabBtn ri-arrow-go-back-line"></i></Link>
                <Link href={'/userPanel'}><i className="tabBtn ri-home-line"></i></Link>
            </div>
            <h2 className="text-3xl font-bold">نظرات کاربران </h2>
            <h4 className="mt-3 text-xl">تعداد <span className="text-[var(--title)] text-2xl">{filterComment.length}</span> نظر وجود دارد</h4>
            <div className="filters h-[30px] mt-10 flex flex-wrap">
                <h2 className="w-full font-bold text-xl mb-3">فیلتر ها </h2>
                <button
                    onClick={(e) => {
                        setfilter('all')
                        activedbtn(e.target)
                    }}
                    className="cursor-pointer px-3 py-1 rounded hover:bg-[var(--foreground)] hover:text-[var(--inputback)] bg-[var(--foreground)] text-[var(--inputback)]"
                >همه</button>
                <p className="w-[1px] h-full bg-gray-500 mx-2"></p>
                <button
                    onClick={(e) => {
                        setfilter('true')
                        activedbtn(e.target)
                    }}
                    className="cursor-pointer px-3 py-1 rounded hover:bg-[var(--foreground)] hover:text-[var(--inputback)]"
                >تایید شده</button>
                <p className="w-[1px] h-full bg-gray-500 mx-2"></p>
                <button
                    onClick={(e) => {
                        setfilter('false')
                        activedbtn(e.target)
                    }}
                    className="cursor-pointer px-3 py-1 rounded hover:bg-[var(--foreground)] hover:text-[var(--inputback)]"
                >در انتظار تایید</button>
            </div>

            {replayPopup && (
                <div className={`lightbox fixed w-full h-[100vh] top-0 left-0 bg-[var(--background)]/30 filter-blur-10 z-1000 ${popup ? 'ccdiv' : 'hidden'}`}>
                    <div className="popUP container w-[90%] md:w-[70%] py-10 rounded-xl bg-[var(--inputback)]">
                        <div className="info w-[90%] mx-auto flex justify-between items-center">
                            <div className="flex justify-between items-center gap-5">
                                <img src="/media/user.png" className="w-[100px] h-[100px] rounded-full" />
                                <div className="text-lg">
                                    <p className="font-bold text-[var(--title)]">{replayPopup.user[0]}</p>
                                    <p>{replayPopup.user[1]}</p>
                                </div>
                            </div>
                            <div className="close text-red-500 text-3xl cursor-pointer" onClick={() => { setPopup(false) }}>
                                X
                            </div>
                        </div>
                        <div className="comment w-[90%] m-auto my-10">
                            {/* <h2 className="font-bold text-[var(--title)] text-2xl">متن نظر : </h2> */}
                            <p className="text-lg mt-5 border-x border-[var(--title)] p-3 px-5">{replayPopup.comment}</p>
                            <h2 className="font-bold text-[var(--title)] text-2xl mt-3">پاسخ به نظر : </h2>
                            <textarea
                                className="w-full max-h-[300px] min-h-[300px] border border-[var(--foreground)]/20 mt-5 rounded-xl p-5 text-justify"
                                value={replay}
                                placeholder="پاسخی برای این نظزر ثبت نشده است ..."
                                onChange={(e) => { setReplay(e.target.value) }}
                            >

                            </textarea>
                            <button
                                onClick={() => { handleReplay(replayPopup.id, replay, replayPopup.verify) }}
                                className="subBtn w-full h-[45px]">
                                انتشار پاسخ
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* <div className="tableTitr w-full flex mt-10">
                <p className="w-1/6">اطلاعات کاربر</p>
                <p className="w-2/6">متن نظر</p>
                <div className="w-3/6 flex justify-end text-center">
                    <p className="w-4/10">مشاهده مقاله</p>
                    <p className="w-4/10">نمایش و پاسخ به نظر</p>
                    <p className="w-3/10">وضعیت نمایش</p>
                    <p className="w-2/10">حذف نظر</p>
                </div>
            </div> */}
            {filterComment.length === 0 && (
                <p className="w-full text-center fixed left-0 top-[50%]">هیچ نظری برای نمایش وجود ندارد</p>
            )}
            <div className="list mt-15">
                {[...filterComment].reverse().map((comment: any, idx: any) => {
                    return (
                        <div key={idx} className="relative my-3 flex flex-wrap items-center justify-between border-b border-[var(--title)]/60 p-3  ">
                            <div className="info xl:w-1/6 w-6/6 flex items-center gap-5">
                                <img src="/media/user.png" className="w-[70px] h-[70px] rounded-full" />
                                <div>
                                    <p>{comment.user[0]}</p>
                                    <p>{comment.user[1]}</p>
                                </div>
                            </div>
                            <div className="comment flex xl:w-1/6 w-full xl:mt-0 mt-5 overflow-hidden">
                                {/* <span className="text-[var(--title)]">متن نظر : </span>
                                <p className="truncate max-w-[85%]" >{comment.comment}</p> */}
                                {comment.verify ? (
                                    <span
                                        className="w-[120px] border border-green-300 text-white bg-green-300/50 rounded-full text-center"
                                    >تایید شده</span>
                                ) : (
                                    <span
                                        className="w-[120px] border border-red-400 text-white bg-red-400/50 rounded-full text-center"
                                    >در انتظار تایید</span>
                                )}
                            </div>
                            <div className="btns xl:w-4/6 w-full xl:mt-0 mt-5 flex items-center justify-end gap-4">
                                <Link href={`/articles/${comment.articleSlug}`} className="normBtn w-3/10 h-[45px]">مقاله نظر</Link>
                                <button className="subBtn w-3/10 h-[45px]" onClick={() => { handlePopup(comment.id), setPopup(true) }}>نمایش و پاسخ</button>
                                {/* <div className="relative w-[100px] h-[45px] shadow-[var(--blackshadow)] rounded-full bg-[var(--inputback)]">
                                    {comment.verify ? (
                                        <button className="absolute left-[5px] top-[5px] w-[35px] h-[35px] rounded-full bg-[var(--title)] cursor-pointer" onClick={() => { handleAccept(comment.id, comment.replay, false) }}></button>
                                    ) : (
                                        <button className="absolute right-[5px] top-[5px] w-[35px] h-[35px] rounded-full bg-[var(--textdisable)]  cursor-pointer" onClick={() => { handleAccept(comment.id, comment.replay, true) }}></button>
                                    )}
                                </div> */}
                                <div className="relative w-2/10 h-[45px]">
                                    {comment.verify ? (
                                        <button
                                            className="normBtn w-full h-full ccdiv"
                                            onClick={() => { handleAccept(comment.id, comment.replay, false) }}
                                        >در انتظار</button>
                                    ) : (
                                        <button
                                            className="subBtnRe w-full h-full ccdiv"
                                            onClick={() => { handleAccept(comment.id, comment.replay, true) }}
                                        >انتشار</button>
                                    )}
                                </div>
                                <button className="delBtn w-2/10 h-[45px]" onClick={() => { handleDelete(comment.id) }}>حذف</button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Comments