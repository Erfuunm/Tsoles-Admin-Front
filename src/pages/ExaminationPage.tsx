// ExaminationPage.tsx

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Examinations from "@/components/Examinations";

export default function ExaminationPage() {
  const [open, setOpen] = useState(true);

  return (
    <div dir="ltr" className="flex h-full">
      <Sidebar open={open} setOpen={setOpen} />
      <div
        className={`flex-1 flex flex-col min-h-screen 
          bg-white  dark:bg-zinc-900 
          transition-colors duration-300`}
      >
        <div className="md:hidden">{/* <Header /> */}</div>

        <div className="flex-1 p-5">
          <Examinations />
        </div>
      </div>
    </div>
  );
}