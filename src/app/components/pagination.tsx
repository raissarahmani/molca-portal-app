import React from 'react'

type PaginationProps = {
  page: string;
  active: boolean;
  onClick: () => void;
}


export default function pagination({ page, active, onClick }: PaginationProps) {
  return (
    <div 
      onClick={onClick} 
      className={`${active === true ? "bg-[var(--color-primary)] text-[var(--color-base)]" : "bg-[var(--color-grey)] text-[var(--color-text)]" } rounded-md flex flex-col items-center justify-center w-[25px] h-[25px] text-xs cursor-pointer hover:bg-[var(--color-primary)] hover:text-[var(--color-base)]`}
    >
      {page}
    </div>
  )
}
