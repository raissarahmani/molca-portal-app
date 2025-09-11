"use client"

import Header from '@/app/components/dashboard/header'
import Dropdown from '@/app/components/dropdown'
import Projects from '@/app/components/dashboard/projects'
import Pagination from '@/app/components/pagination'
import Panel from '@/app/components/dashboard/panel'

import Image from 'next/image'
import { SignedIn, useAuth } from '@clerk/nextjs'
import { useState, useEffect } from 'react'

type Project = {
  _id: string;
  title: string;
  slug: string;
  link: string;
  image_url: string;
  type: string;
  last_updated_at: string;
};

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newProject, setNewProject] = useState(false)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const {getToken} = useAuth()

  const options = [
    {name: "Select type", value: ""},
    {name: "Digital Twin", value: "digital-twin"},
    {name: "VR", value: "vr"},
    {name: "AR", value: "ar"},
    {name: "Smart Manufacturing", value: "smart-manufacture"},
    {name: "Deck", value: "deck"},
    {name: "Tools", value: "tool"},
  ]
  const [type, setType] = useState(options[0]?.value ?? "")
  const limit = 10

  const projectData = [
    { name: "Image", width: "w-30"},
    { name: "Project Name", width: "w-50"},
    { name: "Type", width: "w-30"},
    { name: "Slug", width: "w-30"},
    { name: "Link", width: "w-30"},
    { name: "Last Update", width: "w-30"},
    { name: "Action", width: "w-30"},
  ]

  const handleProject = () => {
    void fetchProjects()
  }

  const fetchProjects = async () => {
    try {
      const token = await getToken({ template: "default" });
      if (!token) throw new Error("No token available");
      console.log(token)
      
      let res: Response;

      if (search) {
        res = await fetch(`${apiUrl}/project/${encodeURIComponent(search)}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })

        if (res.status >= 400 && res.status < 500) {
          res = await fetch(`${apiUrl}/project/slug/${encodeURIComponent(search)}`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          })
        }
      } else {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: (limit + 1).toString()
        });
        res = await fetch(`${apiUrl}/projects/latest?${params.toString()}`, { cache: "no-store" });
      }

      if (!res.ok) throw new Error("Failed to fetch projects");

      const result = await res.json() as {
        code: string;
        status: number;
        message: string;
        data: Project[];
      };

      let data: Project[] = [];
      if (Array.isArray(result.data)) {
        data = result.data;
      } else if (result.data) {
        data = [result.data];
      }

      const nextPage = data.length > limit
      setProjects(data.slice(0, limit))
      setTotalPages(nextPage ? page + 1 : page)
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  }

  useEffect(() => {
      void fetchProjects();
    }, [page, search]);

  return (
    <div className='bg-[var(--color-text)] min-h-screen'>
      <SignedIn>
        <Header />
        <div className='flex flex-row'>
          <div className='w-1/5'></div>
          <div className='flex flex-col gap-3 w-4/5 px-10'>
            <div className='flex flex-row justify-between w-full my-5'>
              <div className='flex flex-row gap-3 items-center px-2'>
                  <p className='text-xs text-[var(--color-base)]'>Type:</p>
                  <div className='bg-[var(--color-grey-light)] text-[var(--color-base)]'>
                    <Dropdown 
                      options={options}
                      value={type}
                      onChange={(e) => setType(e.target.value)} 
                    />
                  </div>
                  <div className="flex flex-row gap-2 input border-[var(--color-grey-light)] rounded-lg py-1 text-xs">
                    <Image
                      src="/Search2.png"
                      alt="Search"
                      width={15}
                      height={15}
                      className="object-contain"
                    />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={search}
                      onChange={(e) => {
                        setPage(1);
                        setSearch(e.target.value);
                      }}
                      className="input-form text-[var(--color-base)]"
                    />
                  </div>
              </div>
              <button 
                onClick={() => setNewProject(true)} 
                className='button m-0 py-0 px-3 bg-[var(--color-red)] border-[var(--color-red)] flex flex-row gap-2 items-center justify-center'>
                  <p className='font-semibold'>+</p>
                  <p className='text-xs font-semibold'>Add project</p>
              </button>
            </div>
            <div className="flex flex-col">
              <div className='bg-[var(--color-grey-light)] text-xs text-[var(--color-base)] font-semibold flex flex-row items-center w-full py-2 rounded-lg'>
                {projectData.map((item, i) => (
                  <div key={i} className={`${item.width} text-center`}>{item.name}</div>
                ))}
              </div>
              <div className='flex flex-col gap-3 py-2'>
                {projects.map((project) => (
                  <Projects 
                      key={project._id}  
                      project={project}
                      options={options}
                      onProjectUpdated={handleProject}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-row gap-2 items-center justify-center my-10">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <div key={num} className='bg-[var(--color-base)] text-[var(--color-text)] hover:bg-[var(--color-base)] hover:text-[var(--color-text)] rounded-md'>
                  <Pagination
                    page={String(num)}
                    active={num === page}
                    onClick={() => setPage(num)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`fixed inset-0 z-50 bg-[#00000099] ${newProject ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
          <div className={`fixed top-0 right-0 h-full min-w-100 w-1/3 transition-all duration-500 ease-in-out bg-[#00000099] shadow-lg overflow-y-auto
              ${newProject ? "translate-x-0 opacity-100 pointer-events-auto" : "translate-x-full opacity-0 pointer-events-none"}`}
          >
            <div className='shadow-md p-10 z-50 bg-[var(--color-text)]'>
              <Panel 
                setProject={setNewProject} 
                onProjectUpdated={handleProject} 
                options={options}
              />
            </div>
          </div>
        </div>
      </SignedIn>
    </div>
  )
}
