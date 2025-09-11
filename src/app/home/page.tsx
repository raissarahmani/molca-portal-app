"use client"

import Header from '@/app/components/header'
import Card from '@/app/components/home/card'
import Pagination from '@/app/components/pagination'
import { SignedIn, SignedOut, useAuth } from '@clerk/nextjs'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import HomePage from '../page'

type Project = {
  _id: string;
  title: string;
  slug: string;
  link: string;
  image_url: string;
  type: string;
  last_updated_at: string;
};

export default function Menu() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const {getToken} = useAuth()

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
        data: Project | Project[];
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
    <div className="flex flex-col justify-between min-h-screen bg-[var(--color-base)]">
      <SignedIn>
        <div><Header /></div>

        <div className="px-30">
          <div className="px-50">
            <div className="flex flex-row gap-2 input my-10">
              <Image
                src="/Search.svg"
                alt="Search"
                width={20}
                height={20}
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
                className="input-form"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 min-gap-1 gap-5 min-h-[350px] my-5">
            {projects.map((project) => (
              <Card key={project._id} image={project.image_url} title={project.title} />
            ))}
          </div>

          <div className="flex flex-row gap-2 items-center justify-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <div key={num} className='bg-[var(--color-primary)] text-[var(--color-base)] hover:bg-[var(--color-primary)] hover:text-[var(--color-base)] rounded-md'>
                <Pagination
                  page={String(num)}
                  active={num === page}
                  onClick={() => setPage(num)}
                />
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-center my-5">Copyright © PT Molca Teknologi Nusantara</p>
      </SignedIn>

      <SignedOut>
        <HomePage />
      </SignedOut>
    </div>
  )
}