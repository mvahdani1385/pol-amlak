import Link from "next/link"
import { prisma } from "@/lib/prisma"

async function Categoris(){
    const categories = await prisma.filesCategory.findMany({
        select: {
            id: true,
            title: true,
            imageUrl: true,
        }
    })

    return(
        <div className="container comments w-[90%] md:w-[80%] mr-[5%] md:mr-[10%] py-10 mt-20 md:mt-10">
            <div className="title flex flex-wrap gap-3 text-4xl text-[var(--title)]">
                <i className="ri-layout-grid-line"></i>
                <h2 className="font-bold">دسته بندی ها</h2>
            </div>
            {categories.length > 0 ? (
                <div className="categoris flex flex-wrap gap- gap-y-3 justify-center gap-[2%] mt-7">
                    {categories.map((cat: any)=>{
                        return(
                            <div  key={cat.id} className="catbox w-[45%] md:w-[18%] border-[3px] border-[var(--title)] rounded-xl p-5 transition hover:bg-[var(--title)]/20">
                                {cat.imageUrl ? (
                                    <img src={`/uploads/${cat.imageUrl}`} className="w-[50px] md:w-[80px] h-[50px] md:h-[80px] object-cover m-auto rounded-lg" />
                                ) : (
                                    <img src="/media/404.jpg" className="w-[50px] md:w-[90px] h-[50px] md:h-[90px] m-auto rounded-lg" />
                                )}
                                <h3 className="text-xl font-light text-center mt-4">{cat.title}</h3>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <p 
                    className="w-full h-20 text-center"
                >هنوز دسته بندی ایجاد نشده  است</p>
            )}
        </div>
    )
}

export default Categoris