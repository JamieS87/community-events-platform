"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { createEventFormSchema } from "./create-event-form-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, isBefore } from "date-fns";
import { CalendarDaysIcon, PlusIcon } from "lucide-react";
import { createEvent } from "@/app/lib/actions/events";
import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { SubmitButton } from "../submit-button";
export const CreateEventForm = () => {
  const router = useRouter();
  const [state, createEventAction] = useFormState(createEvent, null);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof createEventFormSchema>>({
    mode: "all",
    resolver: zodResolver(createEventFormSchema),
    defaultValues: {
      name: "Untitled Event",
      description: "No description",
      start_date: new Date(),
      end_date: new Date(),
      start_time: "12:00",
      end_time: "20:00",
      price: 1.0,
      pricing_model: "free",
    },
  });

  useEffect(() => {
    if (form.getValues("pricing_model") === "free") {
      form.setValue("price", 0);
    }
    if (state) {
      if (state.code === "success") {
        setOpen(false);
        router.refresh();
      }
    }
  }, [state, form, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="w-6 h-6" />
          Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-scroll max-h-full">
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
          <DialogDescription>Create a new event</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col space-y-4 max-wm-full">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Untitled Event" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Super awesome event" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="pricing_model"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pricing Model</FormLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pricing Model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="payf">Pay As You Feel</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="price"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1.00"
                      {...field}
                      readOnly={form.getValues().pricing_model === "free"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex items-center">
              <div className="flex-1">
                <FormField
                  name="start_date"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Start Date
                      </FormLabel>
                      <Input
                        name="start_date"
                        type="hidden"
                        value={format(field.value, "yyyy-MM-dd")}
                      />
                      <Popover>
                        <FormControl>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="flex">
                              {field.value
                                ? format(field.value, "PPP")
                                : "Pick a date"}
                              <CalendarDaysIcon className="ml-4 w-4 h-4" />
                            </Button>
                          </PopoverTrigger>
                        </FormControl>
                        <PopoverContent>
                          <Calendar
                            data-testid="start-date-calendar"
                            mode="single"
                            selected={field.value}
                            onSelect={(e) => {
                              field.onChange(e);
                              form.trigger();
                            }}
                            disabled={(date) =>
                              isBefore(
                                format(date, "yyyy-MM-dd"),
                                format(new Date(), "yyyy-MM-dd")
                              )
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1">
                <FormField
                  name="end_date"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        End Date
                      </FormLabel>
                      <Input
                        name="end_date"
                        type="hidden"
                        value={format(field.value, "yyyy-MM-dd")}
                      />
                      <Popover>
                        <FormControl>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="flex">
                              {field.value
                                ? format(field.value, "PPP")
                                : "Pick a date"}
                              <CalendarDaysIcon className="ml-4 w-4 h-4" />
                            </Button>
                          </PopoverTrigger>
                        </FormControl>
                        <PopoverContent>
                          <Calendar
                            data-testid="end-date-calendar"
                            mode="single"
                            selected={field.value}
                            onSelect={(e) => {
                              field.onChange(e);
                              form.trigger();
                            }}
                            disabled={(date) =>
                              date < form.getValues().start_date
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              name="start_time"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Start time</FormLabel>
                  <FormControl>
                    <Input placeholder="12:00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="end_time"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">End time</FormLabel>
                  <FormControl>
                    <Input placeholder="20:00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SubmitButton
              formAction={createEventAction}
              pendingText="Saving..."
              loadingIcon={true}
            >
              Save
            </SubmitButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
