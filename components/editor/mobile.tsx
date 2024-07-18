// import Editor from "@/components/editor/Editor";
// added dynamic import and disable server rendering to fix document not defined error
// import ChatWindow from "@/components/chatWindow";

// import {Projects} from '@/components/pojects/project'

import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { Inter } from 'next/font/google'
import dynamic from "next/dynamic";
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})
const Editor =dynamic(()=>
	import ("@/components/editor/Mobile_Editor"),{ssr:false,}
)
const ChatWindow =dynamic(()=>
	import ("@/components/chatWindow"),{ssr:false,}
)
const Projects =dynamic(()=>
	import ("@/components/pojects/project"),{ssr:false,}
)
export default function Mobile() {
	

	return (
		<main className="h-full main-editor duration-150 ease-in-out ">
			<div className={` w-full flex h-full ${inter.className}`}>
				<Editor/>
			</div>
		</main>
	);
}