import { useState } from "react";
import Sidebar from "@/components/Sidebar";

import STLViewer from "@/components/STLViewer";
import { useParams } from "react-router-dom";


export default function STLViewerPage() {
  const [open, setOpen] = useState(true);
  const {id} = useParams();

  return (
    <div dir="ltr" className="flex h-full ">
      {" "}
      {/* Set height of the flex container */}
      <Sidebar open={open} setOpen={setOpen} />
      <div className="flex-1 flex flex-col  min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-900">
        <div className="md:hidden">{/* <Header /> */}</div>


        <div className="flex-1 p-5 "> 
       <STLViewer id={id} />

        </div>
      </div>
    </div>
  );
}
