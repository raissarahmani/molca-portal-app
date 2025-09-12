import Image from "next/image"
import Link from "next/link"

type CardProps = {
  image: string;
  title: string;
  link: string;
}

export default function card({ title, link }: CardProps) {
  return (
    <Link 
      href={link}
      className='flex flex-col items-center justify-center bg-[var(--color-text)] rounded-lg relative max-w-[250px] h-[300px] cursor-pointer hover:scale-105 hover:duration-200'
    >
      <Image
        src="/noimage.png"
        alt="No image"
        width={50}
        height={50}
        className="object-contain z-0"
      />
      <div className="z-10 absolute bottom-0 inset-x-0 bg-[#00000099] px-5 py-3">
        <div className="font-semibold text-sm text-[var(--color-primary)]">{title}</div>
      </div>
    </Link>
  )
}
