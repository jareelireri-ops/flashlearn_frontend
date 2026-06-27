function NotificationBadge({ count }) {
  if (!count || count <= 0) return null

  return (
    <span className="bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
      {count > 9 ? '9+' : count}
    </span>
  )
}

export default NotificationBadge