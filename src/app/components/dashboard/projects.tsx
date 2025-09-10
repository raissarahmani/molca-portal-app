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
    <div className='flex flex-row items-center text-[var(--color-base)] text-xs cursor-pointer hover:bg-[var(--color-grey-light)] py-2 rounded-md'>
      <div className="w-30 px-2 truncate">{image}</div>
      <div className="w-50 px-2 truncate">{title}</div>
      <div className="w-30 px-2">{type}</div>
      <div className="w-20 px-2 truncate">{slug}</div>
      <div className="flex flex-row items-center gap-2 w-50 px-2">
        <Image
          src="/link.png"
          alt="Link"
          width={15}
          height={15}
          className="object-contain"
        />
        <p className="text-xs truncate">{link}</p>
      </div>
      <div className="w-30 px-2">
        {new Date(updated).toLocaleString('en-GB', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).replace(',', '')}
      </div>
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
