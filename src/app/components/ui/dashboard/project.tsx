import Image from "next/image"
import Panel from "@/app/components/ui/dashboard/panel"

type Project = {
  _id: string;
  title: string;
  slug: string;
  link: string;
  image_url: string;
  type: string;
  last_updated_at: string;
};

type ProjectProps = {
  project: Project
  onProjectUpdated?: (project: Project) => void
  options: { name: string; value: string; bg?: string; text?: string }[]
  setShowProject: (showProject: boolean) => void
  editProject: boolean
  setEditProject: (editProject: boolean) => void
}

export default function Project({project, options, onProjectUpdated, setShowProject, editProject, setEditProject}: ProjectProps) {
  const matchedOption = options.find(opt => opt.value === project.type)

  function normalizeImage(url: string): string {
    try {
      new URL(url)
      return url
    } catch {
      return "/noimage.png"
    }
  }

  function normalizeLink(url: string): string {
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  }

  const handleRedirect = () => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "project_click", {
        project_title: project.title,
        project_type: project.type,
      });
    }
    const finalUrl = normalizeLink(project.link);
    window.open(finalUrl, "_blank", "noopener,noreferrer");
  };
  
  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <p className='text-2xl text-[var(--color-base)] font-semibold'>Project Detail</p>
        <Image 
          src="/close.svg"
          alt="close" 
          width={20}
          height={20}
          onClick={() => setShowProject(false)}
          className="cursor-pointer"
        />
      </div>

      <div className="border border-[var(--color-grey-light)] rounded-md p-5 my-5">
        <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col gap-1">
                <p className="font-semibold text-[var(--color-base)] truncate">{project.title}</p>
                <p className="text-[var(--color-grey)] text-xs truncate">{project.slug}</p>
            </div>
            <div className="text-xs text-[var(--color-base)]">
              <span className={`${matchedOption?.bg} ${matchedOption?.text} rounded-md px-1`}>{project.type}</span>
            </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="relative w-70 h-50 my-5 bg-[var(--color-grey-light)] rounded-md">
            <Image 
              src={normalizeImage(project.image_url)}
              alt={project.title} 
              fill
              className="object-cover rounded-md"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 text-[var(--color-base)] text-xs">
            <div className="flex flex-row justify-between">
                <p>Last updated</p>
                <p>
                    {new Date(project.last_updated_at).toLocaleString('en-GB', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false
                    }).replace(',', '')}
                </p>
            </div>
            <div className="flex flex-row justify-between">
                <p>Link</p>
                <div className="flex flex-row items-center gap-2 w-30 px-2">
                  <Image
                    src="/link.png"
                    alt="Link"
                    width={15}
                    height={15}
                    className="object-contain"
                  />
                  <div onClick={handleRedirect} className="text-xs truncate cursor-pointer">{project.link}</div>
                </div>
            </div>
        </div>
      </div>

      <button 
        type="button" 
        onClick={() => {
          setShowProject(false)
          setEditProject(true); 
        }} 
        className="w-full font-normal text-sm button bg-[var(--color-grey-light)] text-[var(--color-grey)] hover:bg-[var(--color-red)] hover:text-[var(--color-text)]"
      >
        Edit
      </button>

      <div className={`fixed inset-0 z-50 bg-[#00000099] ${editProject ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className={`fixed top-0 right-0 h-full min-w-100 w-1/3 transition-all duration-500 ease-in-out bg-[#00000099] shadow-lg overflow-y-auto
            ${editProject ? "translate-x-0 opacity-100 pointer-events-auto" : "translate-x-full opacity-0 pointer-events-none"}`}
        >
          <div className='shadow-md p-10 z-50 bg-[var(--color-text)]'>
            <Panel 
              setProject={setEditProject} 
              project={project}
              options={options}
              onProjectUpdated={onProjectUpdated} 
            />
          </div>
        </div>
      </div>
    </>
  )
}
