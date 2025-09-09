"use client"

import Header from '@/app/components/header'
import Card from '@/app/components/home/card'
import Pagination from '@/app/components/pagination'
import { SignedIn, SignedOut } from '@clerk/nextjs'

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
};

type PaginatedProjects = {
  items: Project[];
  total_pages: number;
  total_items: number;
};

export default function Menu() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const mockData: Record<number, Project[]> = {
    1: [
      { _id: "1", title: "Project A", slug: "project-a", link: "#", image_url: "/image.png", type: "smart manufacturing" },
      { _id: "2", title: "Project B", slug: "project-b", link: "#", image_url: "/image.png", type: "digital twin" },
      { _id: "3", title: "Project C", slug: "project-c", link: "#", image_url: "/image.png", type: "ar" },
      { _id: "4", title: "Project D", slug: "project-d", link: "#", image_url: "/image.png", type: "vr" },
      { _id: "5", title: "Project E", slug: "project-e", link: "#", image_url: "/image.png", type: "tools" },
      { _id: "6", title: "Project F", slug: "project-f", link: "#", image_url: "/image.png", type: "deck" },
    ],
    2: [
      { _id: "7", title: "Project G", slug: "project-g", link: "#", image_url: "/image.png", type: "smart manufacturing" },
      { _id: "8", title: "Project H", slug: "project-h", link: "#", image_url: "/image.png", type: "digital twin" },
      { _id: "9", title: "Project I", slug: "project-i", link: "#", image_url: "/image.png", type: "ar" },
    ],
  };

  const fetchProjects = async () => {
    try {
      let res: Response;

      if (search) {
        res = await fetch(`${apiUrl}/project/${search}`, { cache: "no-store" });

        if (!res.ok) {
          res = await fetch(`${apiUrl}/project/slug/${search}`, { cache: "no-store" });
        }
      } else {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "8",
        });
        res = await fetch(`${apiUrl}/projects/latest?${params.toString()}`, { cache: "no-store" });
      }

      if (!res.ok) throw new Error("Failed to fetch projects");

      const data = (await res.json()) as PaginatedProjects | Project;

      if ("items" in data) {
        setProjects(data.items ?? []);
        setTotalPages(data.total_pages ?? 1);
      } else {
        setProjects([data]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setProjects(mockData[page] ?? []);
      setTotalPages(Object.keys(mockData).length);
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

          <div className="grid grid-cols-4 gap-5 min-h-[350px] my-5">
            {projects.map((project) => (
              <Card key={project._id} image={project.image_url} title={project.title} />
            ))}
          </div>

          <div className="flex flex-row gap-2 items-center justify-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <Pagination
                key={num}
                page={String(num)}
                active={num === page}
                onClick={() => setPage(num)}
              />
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