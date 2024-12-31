import { useState } from "react";
import Sidebar from "@/components/Sidebar";

import Tickets from "@/components/Tickets";

export default function TicketsPage() {
  const [open, setOpen] = useState(true);

  return (
    <div dir="ltr" className="flex h-full ">
      {" "}
      {/* Set height of the flex container */}
      <Sidebar open={open} setOpen={setOpen} />
      <div className="flex-1 flex flex-col  md:h-screen bg-gradient-to-b from-zinc-300 to-zinc-400">
        <div className="md:hidden">{/* <Header /> */}</div>


        <div className="flex-1 p-5 "> 
          <Tickets />
        </div>
      </div>
    </div>
  );
}
