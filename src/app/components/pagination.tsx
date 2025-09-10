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
      className={`${active === true ? "bg-inherit text-inherit" : "bg-[var(--color-grey)] text-[var(--color-text)]" } rounded-md flex flex-col items-center justify-center w-[25px] h-[25px] text-xs cursor-pointer hover:bg-inherit hover:text-inherit`}
    >
      {page}
    </div>
  )
}
