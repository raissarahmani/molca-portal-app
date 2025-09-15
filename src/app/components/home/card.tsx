import Image from "next/image"

type CardProps = {
  image: string;
  title: string;
  link: string;
  type: string;
}

export default function card({ title, link, image, type }: CardProps) {
  function normalizeImage(url: string): string {
    try {
      new URL(url)
      return url
    } catch {
      return "/noimage.png"
    }
  }

  const handleRedirect = () => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "project_click", {
        project_title: title,
        project_type: type,
      });
    }
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <div 
      onClick={handleRedirect}
      className='flex flex-col items-center justify-center bg-[var(--color-text)] rounded-lg relative max-w-[250px] h-[300px] cursor-pointer hover:scale-105 hover:duration-200'
    >
      <Image
        src={normalizeImage(image)}
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
