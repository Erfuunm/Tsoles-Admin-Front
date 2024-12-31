import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Itegrations from "@/components/Itegrations";
import Meetings from "@/components/Meetings";

export default function CallsPage() {
  const [open, setOpen] = useState(true);

  return (
    <div dir="ltr" className="flex h-full ">
      {" "}
      {/* Set height of the flex container */}
      <Sidebar open={open} setOpen={setOpen} />
      <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-b from-zinc-300 to-zinc-400">
        <div className="md:hidden">{/* <Header /> */}</div>
        <div className="flex-1 p-5 mt-3">
          <Meetings />
        </div>
      </div>
    </div>
  );
}
