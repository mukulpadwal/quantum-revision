import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Reminder from "@/types/Reminder";
import { BellDot } from "lucide-react";

interface ReminderDrawerType {
  reminderData: Reminder[];
}

const ReminderDrawer = ({ reminderData }: ReminderDrawerType) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="secondary"
          className="text-base flex flex-row items-center justify-center gap-x-2"
        >
          Topics To Revise Today
          <BellDot className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Daily Reminder</DrawerTitle>
            <DrawerDescription>
              Boost Your Knowledge, One Step at a Time.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <ul className="grid grid-cols-2 list-inside gap-y-4">
              {reminderData.length === 0
                ? "No topics to revise today..."
                : reminderData.map((data) => (
                    <li className="list-disc" key={data._id}>{data.title}</li>
                  ))}
            </ul>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ReminderDrawer;
