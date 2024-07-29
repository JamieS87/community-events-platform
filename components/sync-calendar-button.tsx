// "use client";

// import { requestCalendarEventsScope } from "@/app/lib/actions/auth";
// import { syncCalendar } from "@/app/lib/actions/calendar";
// import { Button } from "@/components/ui/button";
// import { RefreshCw } from "lucide-react";
// import { usePathname, useRouter } from "next/navigation";
// import { useState } from "react";

// export default function SyncCalendarButton() {
//   const pathname = usePathname();
//   const router = useRouter();
//   const [pending, setIsPending] = useState(false);

//   return (
//     <Button
//       onClick={async () => {
//         setIsPending(true);
//         const result = await syncCalendar();
//         setIsPending(false);
//         if (result && result.code === "scopes_required") {
//           return requestCalendarEventsScope(pathname);
//         }
//         return router.refresh();
//       }}
//       className="text-primary-foreground"
//     >
//       <RefreshCw className="w-4 h-4 mr-4" />{" "}
//       {pending ? "Syncing..." : "Sync Calendar"}
//     </Button>
//   );
// }
