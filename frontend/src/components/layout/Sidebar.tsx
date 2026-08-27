<NavLink
  to="/add-booking"
  className={({ isActive }) =>
    `
      mb-1
      flex
      items-center
      gap-4
      rounded-2xl
      px-4
      py-3
      text-sm
      transition
      ${
        isActive
          ? "bg-white/15 text-white"
          : "text-white/65 hover:bg-white/10 hover:text-white"
      }
    `
  }
>
  <FaPlusCircle size={15} />

  <span>Add Booking</span>
</NavLink>