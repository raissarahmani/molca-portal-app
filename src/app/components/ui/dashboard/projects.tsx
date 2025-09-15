"use client"

import Image from "next/image"
import { useState } from "react"

import Project from "@/app/components/ui/dashboard/project"
import Panel from "@/app/components/ui/dashboard/panel"
import Modal from "@/app/components/ui/dashboard/modal"
import { SignedIn } from "@clerk/nextjs"

type ProjectDetail = {
  _id: string;
  title: string;
  slug: string;
  link: string;
  image_url: string;
  type: string;
  last_updated_at: string;
};

type ProjectProps = {
  project: ProjectDetail
  options: { name: string; value: string; bg?: string; text?: string }[]
  onProjectUpdated?: (project: ProjectDetail) => void
}

export default function Projects({project, options, onProjectUpdated}: ProjectProps) {
  const [showProject, setShowProject] = useState(false)
  const [editProject, setEditProject] = useState(false)
  const [openModal, setOpenModal] = useState(false)

  const matchedOption = options.find(opt => opt.value === project.type)

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
        project_id: project._id,
        project_title: project.title,
        project_type: project.type,
      });
    }
    window.open(project.link, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative">
      <SignedIn>
      <div  className='flex flex-row items-center text-[var(--color-base)] text-xs hover:bg-[var(--color-grey-light)] py-2 rounded-md'>
        <div onClick={() => setShowProject(true)} className="flex-1 min-w-30 px-2 truncate cursor-pointer">
          <div className="relative min-w-30 h-20 rounded-md">
            <Image
              src={normalizeImage(project.image_url)}
              alt={project.title}
              fill
              className="object-contain"
            />
          </div>
        </div>
        <div onClick={() => setShowProject(true)} className="flex-1 min-w-50 px-2 truncate hover:font-semibold cursor-pointer">{project.title}</div>
        <div onClick={() => setShowProject(true)} className="flex-1 min-w-30 px-2 cursor-pointer">
          <span className={`${matchedOption?.bg} ${matchedOption?.text} rounded-md px-1`}>{project.type}</span>
        </div>
        <div onClick={() => setShowProject(true)} className="flex-1 min-w-30 px-2 truncate cursor-pointer">{project.slug}</div>
        <div  className="flex flex-row flex-1 items-center gap-2 min-w-30 px-2">
          <Image
            src="/link.png"
            alt="Link"
            width={15}
            height={15}
            className="object-contain"
          />
          <div onClick={handleRedirect} className="text-xs truncate">{project.link}</div>
        </div>
        <div className="flex-1 min-w-30 px-2 text-center">
          {new Date(project.last_updated_at).toLocaleString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          }).replace(',', '')}
        </div>
        <div className="flex flex-row flex-1 justify-center items-center gap-5 min-w-30 px-2">
          <button type="button" onClick={() => setEditProject(true)} className="button m-0">
            <Image
              src="/edit.png"
              alt="Edit"
              width={15}
              height={15}
              className="object-contain"
            />
          </button>
          <button 
            type="button"
            onClick={() => setOpenModal(true)}
             className="button m-0">
            <Image
              src="/delete.png"
              alt="Delete"
              width={15}
              height={15}
              className="object-contain"
            />
          </button>
        </div>
      </div>

      <div className={`fixed inset-0 z-50 bg-[#00000099] ${showProject && !editProject ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className={`fixed top-0 right-0 h-full min-w-100 w-1/3 transition-all duration-500 ease-in-out bg-[#00000099] shadow-lg overflow-y-auto overflow-x-hidden
            ${showProject && !editProject ? "translate-x-0 opacity-100 pointer-events-auto" : "translate-x-full opacity-0 pointer-events-none"}`}
        >
          <div className='shadow-md p-10 z-50 bg-[var(--color-text)]'>
            <Project
              project={project}
              options={options}
              onProjectUpdated={onProjectUpdated} 
              setShowProject={setShowProject}
              editProject={editProject}
              setEditProject={setEditProject}
            />
          </div>
        </div>
      </div>

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

      {openModal && (
        <Modal 
          project={project}
          onProjectUpdated={onProjectUpdated}
          setOpenModal={setOpenModal}
        />
      )}
      </SignedIn>
    </div>
  )
}
