import dynamic from "next/dynamic"
export default dynamic(() => import("components/hovis"), { ssr: false })
