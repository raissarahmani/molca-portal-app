"use client"

import Image from "next/image"
import { useState } from "react"
import { useAuth } from "@clerk/nextjs"
import Dropdown from "../dropdown"

type PanelProps = {
  setIsOpen: (isOpen: boolean) => void
  onProjectCreated: (project: Project) => void
  options: { name: string; value: string }[]
}

type Cover = {
  url: string
}

type Project = {
  _id: string;
  title: string;
  slug: string;
  link: string;
  image_url: string;
  type: string;
  last_updated_at: string;
};

export default function New({setIsOpen, onProjectCreated, options}: PanelProps) {
    const {getToken} = useAuth()

    const project = ["Project Title", "Slug", "Link"]
    const [values, setValues] = useState<string[]>(Array(project.length).fill(""))
    const [cover, setCover] = useState<File | null>(null)
    const [type, setType] = useState(options[0]?.value ?? "")
    const [successMsg, setSuccessMsg] = useState("")
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const uploadCover = async (file: File, token: string): Promise<string> => {
      const formData = new FormData()
      formData.append("name", file.name)
      formData.append("file", file)

      const res = await fetch(`${apiUrl}/cover/upload`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      })
    
      if (!res.ok) throw new Error("Failed to upload cover")

      const data = (await res.json()) as Cover;
      return data.url
    }

    const newProject = async () => {
      try {
        const token = await getToken({template: "default"})
        if (!token) throw new Error("No token available")
        
        let coverUrl = ""
        if (cover) {
          coverUrl = await uploadCover(cover, token)
        }

        if (!values[0] || !values[1] || !values[2] || !type) {
          console.error("Missing required project fields")
          return
        }

        const body = {
          title: values[0],
          slug: values[1],
          image_url: coverUrl || "logo2.png",
          link: values[2],
          type: type.toLowerCase(),
        }
      
        const res = await fetch(`${apiUrl}/project/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        })
      
        if (!res.ok) throw new Error("Failed to create project")
        
        const data = (await res.json()) as Project;

        onProjectCreated(data)
        setSuccessMsg("Project uploaded successfully")
        resetForm()
      } catch (err) {
        console.error("Error creating project:", err)
      }
    }

    const resetForm = () => {
      setValues(Array(project.length).fill(""))
      setType(options[0]?.value ?? "")
      setCover(null)
    }

  return (
    <div className='shadow-md p-10 z-50 bg-[var(--color-text)]'>
      <div className="flex flex-row justify-between items-center">
        <p className='text-2xl text-[var(--color-base)] font-semibold'>Add Project</p>
        <Image 
          src="/close.svg"
          alt="close" 
          width={20}
          height={20}
          onClick={() => setIsOpen(false)}
          className="cursor-pointer"
        />
      </div>
      <form 
        onSubmit={(e) => {
          e.preventDefault()
          void newProject()
        }}
        className='my-5 flex flex-col gap-2'
      >
        <div className='input flex flex-col gap-1 border-[var(--color-grey-light)]'>
            <label htmlFor="type" className="text-xs text-[var(--color-base)]">Project Type</label>
            <div className='text-[var(--color-base)]'>
              <Dropdown 
                options={options}
                value={type}
                onChange={(e) => setType(e.target.value)} 
              />
            </div>
        </div>
        {project.map((p, i) => (
          <div key={i} className='input flex flex-col gap-1 border-[var(--color-grey-light)]'>
              <label htmlFor={p} className="text-xs text-[var(--color-base)]">{p}</label>
              <input 
                type="text" 
                name={p}
                value={values[i] ?? ""}
                placeholder={`Input ${p}`}
                onChange={(e) => {
                  const newValue = [...values]
                  newValue[i] = e.target.value
                  setValues(newValue)
                }}
                required
                className='input-form text-xs text-[var(--color-grey)]' 
              />
          </div>
        ))}
        <p className="text-xs text-[var(--color-base)]">Upload cover</p>
        <div className="rounded-md bg-[var(--color-grey-light)] flex flex-col gap-2 justify-center items-center py-5">
          <div className="flex flex-col items-center justify-center bg-[var(--color-text)] rounded-lg w-7 h-7 my-2">
            <Image 
              src="/upload.png"
              alt="Upload file" 
              width={20}
              height={20}
              className="object-contain"
            />
          </div>
          <input 
            id="cover"
            type="file" 
            name="cover"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setCover(e.target.files[0])
              }
            }} 
            className="hidden" 
          />
          <label htmlFor="cover" className="text-sm text-[var(--color-grey)] cursor-pointer">
            <span className="text-[var(--color-base)] font-semibold">Click to upload </span>
            or drag and drop
          </label>
          <p className="text-xs text-[var(--color-grey)]">PNG, JPEG, JPG, etc (max 5mb)</p>
        </div>

        <div className="flex flex-row gap-3 w-full">
          <button type="button" onClick={resetForm} className="w-1/2 font-normal text-sm button bg-[var(--color-grey-light)] text-[var(--color-grey)] hover:bg-[var(--color-red)] hover:text-[var(--color-text)]">Discard</button>
          <button type="submit" className="w-1/2 flex flex-row justify-center items-center gap-2 button bg-[var(--color-grey-light)] text-[var(--color-grey)] hover:bg-[var(--color-red)] hover:text-[var(--color-text)]">
            <Image 
              src="/save.png"
              alt="Save" 
              width={15}
              height={15}
              className="object-contain"
            />
            <p className="font-normal text-sm">Save</p>
          </button>
        </div>

        {successMsg && (
          <span className="text-xs text-[var(--color-base)] my-2">{successMsg}</span>
        )}
      </form>
    </div>
  )
}
