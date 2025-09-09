import Image from "next/image"

type CardProps = {
  image: string;
  title: string;
}

export default function card({ image, title }: CardProps) {
  return (
    <div className='relative w-[250px] h-[300px] cursor-pointer hover:scale-105 hover:duration-200'>
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover z-0 rounded-lg"
      />
      <div className="z-10 absolute bottom-0 inset-x-0 bg-[#00000099] px-5 py-3">
        <div className="font-semibold text-sm text-[var(--color-primary)]">{title}</div>
      </div>
    </div>
  )
}
