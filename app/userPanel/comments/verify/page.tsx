"use client";

import { notFound } from "next/navigation";
import { useState, useEffect } from 'react';
import Link from "next/link";


const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";


async function getCommentData() {
    const res = await fetch(`${baseUrl}/api/comments`, {
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


    try {
        const response = await fetch(`${baseUrl}/api/comments`, {
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
        const response = await fetch(`${baseUrl}/api/comments`, {
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
        alert('نظر با موفقیت حذف شد')
        return result;

    } catch (error) {
        console.error('Failed to update comment:', error);
        throw error;
    }
}



function Comments() {
    const [comments, setComments] = useState<any[]>([]);
    const visibleComments = comments.filter((comment: any) => !comment.verify);

    useEffect(() => {
        getCommentData()
            .then(result => {
                setComments(result);
            })
            .catch(error => {
                console.error("Error fetching comments:", error);
            });
    }, [])

    const handleAccept = async (id: number, replay: string, verify: boolean) => {
        if (!confirm("آیا از اینکه این نظر رو تایید کنید مطمئنید!؟")) { return }
        try {
            const updatedComment = await updateComment(id, replay, verify);

            setComments(prevComments =>
                prevComments.map(comment =>
                    comment.id === id
                        ? { ...comment, replay: updatedComment.replay, verify: updatedComment.verify }
                        : comment
                )
            );


        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };


    const handleDelete = async (id: number) => {
        if (!confirm("آیا مطمئنید که می‌خواهید این نظر را حذف کنید؟")) return;

        try {
            const response = await DeleteComment(id);


            setComments(prevComments => prevComments.filter(comment => comment.id !== id));


        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('خطا در حذف نظر رخ داد!');
        }
    };


    return (
        <div className="container comments w-[90%] md:w-[80%] mr-[5%] md:mr-[10%]">
            <div className="notVerify flex flex-wrap gap-5 mt-10 pb-10 border-b border-[var(--title)]/30">

                {visibleComments.length > 0 && (
                    <h2 className="w-full text-3xl font-bold">نظرات در انتظار تایید</h2>
                )}

                {visibleComments.length === 0 ? (
                    <p className="w-full text-center text-[var(--title)] my-5">هیچ نظری برای نمایش وجود ندارد</p>
                ) : (
                    visibleComments.map((comment: any, idx: any) => (

                        <div key={idx} className="w-[24%] border border-[var(--title)] shadow-[var(--yellowshadow)] rounded-lg p-5 flex flex-col justify-between">
                            <div className="info text-sm flex flex-wrap justify-around border-b pb-3">
                                <h3 className=" w-2/4 flex flex-col gap-1"><span className="text-[var(--title)]">نام کاربر : </span> {comment.user[0]}</h3>
                                <h3 className=" w-2/4 flex flex-col gap-1"><span className="text-[var(--title)]">شماره تماس : </span>{comment.user[1]}</h3>
                            </div>
                            <h3 className="text-[var(--title)] text-lg mt-3">متن پیام : </h3>
                            <p className="font-light mt-2">{comment.comment}</p>
                            <div className="btns mt-5 flex justify-between">
                                <button className="subBtn w-5/9 h-[45px] font-bold" onClick={() => { handleAccept(comment.id, comment.replay, true) }}>تایید و نمایش در سایت</button>
                                <button className="subBtn w-2/5 h-[45px] font-bold border-red-500" onClick={() => { handleDelete(comment.id) }}>هرزنامه</button>
                            </div>
                            <Link className="w-full mt-2 text-center" href={`/userPanel/articles/${comment.articleSlug}`}>این نظر برای این مقاله است</Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}


export default Comments