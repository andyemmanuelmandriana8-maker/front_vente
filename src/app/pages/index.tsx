import { Layout } from "@/components/layout/Layout"
import { Outlet } from "react-router-dom"

export default function PagesLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

