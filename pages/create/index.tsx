import dynamic from "next/dynamic"
export default dynamic(() => import("components/create2"), { ssr: false })
