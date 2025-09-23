"use client";

export default function AdminLogout() {
  const handleLogout = () => {
    // Clear the cookie by setting it to expired
    document.cookie =
      "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/admin/login";
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      Logout
    </button>
  );
}
