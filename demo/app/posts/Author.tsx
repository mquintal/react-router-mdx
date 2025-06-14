type Props = {
  name: string
  role: string
  imageUrl: string
}

export const Author = ({ name, role, imageUrl }: Props) => {
  return (
    <div className="relative mt-8 flex items-center gap-x-4">
      <img alt="" src={imageUrl} className="size-10 rounded-full bg-gray-50" />
      <div className="text-sm/6">
        <p className="font-semibold text-gray-900">
          <a href='#'>
            <span className="absolute inset-0" />
            {name}
          </a>
        </p>
        <p className="text-gray-600">{role}</p>
      </div>
    </div>
  )
}