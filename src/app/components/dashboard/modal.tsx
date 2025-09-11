import { useAuth } from "@clerk/nextjs"

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
  setOpenModal: (openModal: boolean) => void
}

export default function Modal({project, onProjectUpdated, setOpenModal}: ProjectProps) {
    const {getToken} = useAuth()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
    const removeProject = async () => {
      if (!project?._id) return;
  
      try {
        const token = await getToken({ template: "default" });
        if (!token) throw new Error("No token available");
  
        const res = await fetch(`${apiUrl}/project/${project._id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
  
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed (${res.status}): ${errorText}`);
        }
      } catch (err) {
        console.error("Error deleting project:", err);
      }
    };

  return (
    <div className='fixed inset-0 z-50 bg-[#00000099] flex flex-col items-center justify-center'>
      <div className='bg-[var(--color-text)] rounded-lg flex flex-col justify-center items-center p-10'>
        <p className='font-semibold text-[var(--color-base)] text-lg'>Are you sure to delete this project permanently?</p>
        <div className='flex flex-row gap-5 my-5 w-1/2'>
            <button 
              type="button" 
              onClick={async () => {
                await removeProject()
                if (onProjectUpdated) onProjectUpdated(project)
              }}
              className='button m-0 w-full bg-[var(--color-grey-light)] text-[var(--color-grey)] hover:bg-[var(--color-red)] hover:text-[var(--color-text)]'
            >
              Yes
            </button>
            <button
              type="button" 
              onClick={() => setOpenModal(false)}
              className='button m-0 w-full bg-[var(--color-grey-light)] text-[var(--color-grey)] hover:bg-[var(--color-red)] hover:text-[var(--color-text)]'
            >
              No
            </button>
        </div>
      </div>
    </div>
  )
}