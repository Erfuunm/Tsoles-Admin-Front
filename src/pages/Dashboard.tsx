import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Users from "@/components/Users";
import STLViewer from "@/components/STLViewer";


export default function Dashboard() {
  const [open, setOpen] = useState(true);

  return (
    <div dir="ltr" className="flex h-full ">
      {" "}
      {/* Set height of the flex container */}
      <Sidebar open={open} setOpen={setOpen} />
      <div className="flex-1 flex flex-col  min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-900">
        <div className="md:hidden">{/* <Header /> */}</div>


        <div className="flex-1 p-5 "> 

       <Users/>
        </div>
      </div>
    </div>
  );
}
