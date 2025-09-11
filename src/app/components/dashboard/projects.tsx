"use client"

import Image from "next/image"
import { useState } from "react"

import Project from "@/app/components/dashboard/project"
import Panel from "@/app/components/dashboard/panel"
import Modal from "@/app/components/dashboard/modal"
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

  return (
    <div className="relative">
      <SignedIn>
      <div  className='flex flex-row items-center text-[var(--color-base)] text-xs hover:bg-[var(--color-grey-light)] py-2 rounded-md'>
        <div className="w-30 px-2 truncate">{project.image_url}</div>
        <div onClick={() => setShowProject(true)} className="w-50 px-2 truncate hover:font-semibold cursor-pointer">{project.title}</div>
        <div className="w-30 px-2">
          <span className={`${matchedOption?.bg} ${matchedOption?.text} rounded-md px-1`}>{project.type}</span>
        </div>
        <div className="w-30 px-2 truncate">{project.slug}</div>
        <div className="flex flex-row items-center gap-2 w-30 px-2">
          <Image
            src="/link.png"
            alt="Link"
            width={15}
            height={15}
            className="object-contain"
          />
          <a href={project.link} className="text-xs truncate">{project.link}</a>
        </div>
        <div className="w-30 px-2">
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
        <div className="flex flex-row justify-center items-center gap-5 w-30 px-2">
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
