"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import Dropdown from "../dropdown"

type Project = {
  _id: string;
  title: string;
  slug: string;
  link: string;
  image_url: string;
  type: string;
  last_updated_at: string;
};

type CoverResponse = {
  code: string;
  status: number;
  message: string;
  data: {
    image_url: string;
  };
};

type PanelProps = {
  setProject: (newProject: boolean) => void
  onProjectUpdated?: (project: Project) => void
  options: { name: string; value: string }[]
  project?: Project
}

export default function Panel({setProject, onProjectUpdated, options, project}: PanelProps) {
    const {getToken} = useAuth()

    const fields = ["Project Title", "Slug", "Link"]
    const [values, setValues] = useState<string[]>([
      project?.title ?? "",
      project?.slug ?? "",
      project?.link ?? "",
    ])
    const [cover, setCover] = useState<File | null>(null);
    const [type, setType] = useState(project?.type ?? options[0]?.value ?? "")
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

      const data = (await res.json()) as CoverResponse;
      console.log("Cover upload response:", data);
      return data.data.image_url
    }

    const saveProject = async () => {
      try {
        const token = await getToken({ template: "default" });
        if (!token) throw new Error("No token available");
        console.log(token)
      
        let coverUrl = "";
        const fileInput = document.getElementById("cover") as HTMLInputElement;
        const file = fileInput?.files?.[0];
      
        console.log("File from input:", file);
      
        if (file) {
          coverUrl = await uploadCover(file, token);
        } else if (project?.image_url) {
          coverUrl = project.image_url;
        }

        const body = {
          title: values[0],
          slug: values[1],
          image_url: coverUrl || 'noimage.png',
          link: values[2],
          type: type.toLowerCase(),
        }

        let res: Response
        if (project?._id) {
          console.log("Sending body:", body);
          res = await fetch(`${apiUrl}/project/${project._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(body),
          })
        } else {
          console.log("Sending body:", body);
          res = await fetch(`${apiUrl}/project/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(body),
          })
        }

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed (${res.status}): ${errorText}`);
        }

        const data = (await res.json()) as Project

        if (onProjectUpdated) onProjectUpdated(data)

        setSuccessMsg(
          (project?._id ? "Project updated successfully" : "Project uploaded successfully")
        )
      } catch (err) {
        console.error("Error saving project:", err)
      }
    }

    const resetForm = () => {
      setValues(Array(fields.length).fill(""))
      setType(options[0]?.value ?? "")
    }

    useEffect(() => {
      if (!successMsg) return;

      const timer = setTimeout(() => {
        setSuccessMsg("");
        resetForm()
      }, 2000);
    
      return () => clearTimeout(timer);
    }, [successMsg]);

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <p className='text-2xl text-[var(--color-base)] font-semibold'>Add Project</p>
        <Image 
          src="/close.svg"
          alt="close" 
          width={20}
          height={20}
          onClick={() => setProject(false)}
          className="cursor-pointer"
        />
      </div>
      <form 
        onSubmit={(e) => {
          e.preventDefault()
          void saveProject()
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
        {fields.map((p, i) => (
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
                console.log("Selected file:", e.target.files[0]);
              }
            }} 
            className="hidden" 
          />
          <label htmlFor="cover" className="text-sm text-[var(--color-grey)] cursor-pointer">
            <span className="text-[var(--color-base)] font-semibold">Click to upload </span>
            or drag and drop
          </label>
          <p className="text-xs text-[var(--color-grey)]">PNG, JPEG, JPG, etc (max 5mb)</p>

          {cover && (
            <p className="text-xs text-[var(--color-grey)] my-3">Selected: {cover.name}</p>
          )}
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
    </>
  )
}
