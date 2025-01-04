import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Users from "@/components/Users";
import Logs from "@/components/Logs";
import Bugs from "@/components/Bugs";

export default function BugsPage() {
  const [open, setOpen] = useState(true);

  return (
    <div dir="ltr" className="flex h-full ">
      {" "}
      {/* Set height of the flex container */}
      <Sidebar open={open} setOpen={setOpen} />
      <div className="flex-1 flex flex-col  min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-900">
        <div className="md:hidden">{/* <Header /> */}</div>


        <div className="flex-1 p-5 "> 
          <Bugs />
        </div>
      </div>
    </div>
  );
}
