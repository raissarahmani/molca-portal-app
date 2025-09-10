import Image from "next/image"

type ProjectProps = {
  title: string;
  slug: string;
  link: string;
  image: string;
  type: string;
  updated: string
}

export default function Projects({title, slug, link, image, type, updated}: ProjectProps) {
  return (
    <div className='flex flex-row text-[var(--color-base)] text-xs'>
      <div className="w-30 px-2">{image}</div>
      <div className="w-50 px-2">{title}</div>
      <div className="w-30 px-2">{type}</div>
      <div className="w-20 px-2">{slug}</div>
      <div className="flex flex-row justify-center items-center gap-2 w-40 px-2">
        <Image
          src="/link.png"
          alt="Link"
          width={15}
          height={15}
          className="object-contain"
        />
        <p className="text-xs">{link}</p>
      </div>
      <div className="w-30 px-2 text-center">{updated}</div>
      <div className="flex flex-row justify-center items-center gap-2 w-20 px-2">
        <Image
          src="/edit.png"
          alt="Edit"
          width={15}
          height={15}
          className="object-contain"
        />
        <Image
          src="/delete.png"
          alt="Delete"
          width={15}
          height={15}
          className="object-contain"
        />
      </div>
    </div>
  )
}
