type Option = {
  name: string
  value: string
}

type DropdownProps = {
  options: Option[]
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export default function Dropdown({ options, value, onChange }: DropdownProps) {

  return (
    <select
      name="type"
      value={value}
      onChange={onChange}
      className="input-form text-xs cursor-pointer bg-inherit text-inherit p-2"
    >
        {options.map((option) => (
            <option 
                key={option.value} 
                value={option.value} 
                className="text-xs bg-inherit text-inherit cursor-pointer px-2"
            >
                {option.name}
            </option>
        ))}
    </select>
  )
}