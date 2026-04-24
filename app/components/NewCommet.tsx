import { useState, useEffect } from "react"


import TextInput from "./themes/TextInput"
import TextArey from "./themes/TextArey"
import { toast } from "react-toastify"

interface ContentData {
    articleId?: any,
    articleSlug?: any
}


export default function NewCommet({ articleId, articleSlug }: ContentData) {
    const [newComment, setNewcomment] = useState<any>({
        userName: '',
        userPhone: '',
        comment: '',
        replay: '',
        userID: null
    })

    const handleCommentChange = async (key: string, value: any) => {
        await setNewcomment((prev: any) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleAPendedComment = async () => {
        const commentData = {
            articleId: articleId,
            articleSlug: articleSlug,
            user: [newComment.userName, newComment.userPhone],
            comment: newComment.comment,
            replay: newComment.replay,
            userID: null
        }

        console.log(newComment.userPhone.slice(0, 2))



        if (newComment.userPhone.length > 11 || newComment.userPhone.length < 11) {
            toast.warn('شماره موبایل  باید حتما 11 کاراکتر داشته باشد');
            return
        } else if (newComment.userPhone.slice(0, 2) !== '09') {
            toast.warn('شماره موبایل باید شامل با 09 شروع شود');
            return
        }

        try {
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(commentData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to create comment:', errorData.message || response.statusText);
                toast.error(` خطا در  ایجاد نظر: ${errorData.message || response.statusText}`);
            } else {
                const createdArticle = await response.json();
                toast.success('نظر شما با موفقیت ثبت شد');
                // setTimeout(()=>{
                //     window.location.reload();
                // }, 500)
            }
        } catch (error) {
            console.error('An unexpected error occurred:', error);
        }

    }

    return (
        <>
            <div className="form border p-5 border-[var(--reversbotder)]/30 shadow-[var(--headershadow)] rounded-xl mb-10">
                <h2 className="my-3 text-xl mr-2 font-bold">ثبت نظر و پیشنهاد</h2>
                <div className="flex flex-wrap gap-5 mb-5">
                    <TextInput
                        place='نام کامل'
                        category={'userName'}
                        handlePropertyChange={handleCommentChange}
                        isNumber={false}
                        value={newComment.userName}
                    />
                    <TextInput
                        place='شماره تماس'
                        category={'userPhone'}
                        handlePropertyChange={handleCommentChange}
                        isNumber={true}
                        phone={true}
                        value={newComment.userPhone}
                    />
                </div>

                <TextArey
                    category={'comment'}
                    handlePropertyChange={handleCommentChange}
                    place={'متن نظر شما'}
                    value={newComment.comment}
                />


                <button className="subBtn w-full h-[50px] mt-5" onClick={handleAPendedComment}>ثبت نظر</button>

            </div>
        </>
    )
}