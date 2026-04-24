import Link from "next/link"


function Breadcrumbs({ sitMap }: any) {
    // console.log(sitMap)
    return (
        <>
            <div className="berd w-full flex flex-wrap items-center gap-3">
                <Link href='/' className="hover:text-[var(--title)]">صفحه اصلی</Link>
                {sitMap.map((m: any, idx: any) => {
                    if (sitMap.length === idx + 1) {
                        return (
                            <div key={idx} className="flex items-center gap-3">
                                <p className="text-xl">{`›`}</p>
                                <Link href={m.url} className="text-[var(--title)]">{m.name}</Link>
                            </div>
                        )
                    } else {
                        return (
                            <div key={idx} className="flex items-center  gap-3">
                                <p className="text-xl">{`›`}</p>
                                <Link href={m.url} className="hover:text-[var(--title)]">{m.name}</Link>
                            </div>
                        )
                    }
                })}
            </div>
        </>
    )
}

export default Breadcrumbs