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
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, isBefore, parse } from "date-fns";
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
import Image from "next/image";
import { CreateEventSubmitButton } from "../create-event-submit-button";
import { uploadEventThumbnail } from "@/utils/events/client";
import { useToast } from "../ui/use-toast";

export const CreateEventForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [state, createEventAction] = useFormState(createEvent, null);
  const [open, setOpen] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const form = useForm<z.infer<typeof createEventFormSchema>>({
    mode: "all",
    resolver: zodResolver(createEventFormSchema),
    defaultValues: {
      name: "Untitled Event",
      description: "No description",
      start_date: format(new Date(), "yyyy-MM-dd"),
      end_date: format(new Date(), "yyyy-MM-dd"),
      start_time: "12:00",
      end_time: "20:00",
      price: 0,
      pricing_model: "free",
      thumbnail: "",
    },
  });

  useEffect(() => {
    if (state?.code === "success") {
      toast({
        title: "Event created",
        description: "Successfully created event",
        variant: "success",
      });
    }
  }, [state, toast]);

  useEffect(() => {
    const formWatcher = form.watch((values, { type, name }) => {
      if (type === "change") {
        if (name === "pricing_model") {
          if (values.pricing_model === "free") {
            form.setValue("price", 0, { shouldValidate: true });
          }
        }
      }
    });

    if (state) {
      setSaving(false);
      if (state.code === "success") {
        setOpen(false);
        form.reset();
        setThumbnailPreview(null);
        router.refresh();
      }
    }

    return () => formWatcher.unsubscribe();
  }, [state, form, router]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.setValue("thumbnail", undefined);
      setThumbnailPreview(null);
    }
    setOpen(open);
  };

  const onSubmit: SubmitHandler<z.infer<typeof createEventFormSchema>> = async (
    values
  ) => {
    const thumbnailFile = values.thumbnail;
    let fullPath: string;
    try {
      const data = await uploadEventThumbnail(thumbnailFile);
      fullPath = data.fullPath;
    } catch (error) {
      form.setError("thumbnail", {
        message:
          "An unknown error occurred while uploading the thumbnail. Try choosing a different thumbnail.",
      });
      return;
    }

    const formData = new FormData();

    Object.entries(values).forEach(([fieldName, fieldValue]) => {
      if (fieldName === "thumbnail") {
        formData.append("thumbnail", fullPath);
      } else {
        formData.append(fieldName, fieldValue);
      }
    });
    setSaving(true);
    createEventAction(formData);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-slate-900">
          <PlusIcon className="w-6 h-6" />
          Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-scroll max-h-full w-full md:max-h-[90vh] md:px-10 md:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="md:text-2xl">Create Event</DialogTitle>
          <DialogDescription>Create a new event</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex flex-col gap-y-4 w-full md:space-y-8"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Untitled Event"
                      {...field}
                      autoComplete="off"
                    />
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
            <div className="aspect-video w-full border flex items-center justify-center">
              {thumbnailPreview ? (
                <Image
                  src={URL.createObjectURL(thumbnailPreview)}
                  alt="event image preview"
                  className="aspect-video object-cover"
                  width={1024}
                  height={1024}
                />
              ) : (
                <span className="text-sm">Thumbnail Preview</span>
              )}
            </div>
            <FormField
              name="thumbnail"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Thumbnail</FormLabel>
                  <FormControl>
                    <Input
                      className="border-primary/20 shadow-sm"
                      name={field.name}
                      type="file"
                      value={undefined}
                      accept="image/webp,image/png,image/jpeg,image/jfif"
                      onChange={(e) => {
                        field.onChange({
                          target: {
                            value: (e.target.files && e.target.files[0]) || "",
                            name: field.name,
                          },
                        });
                        setThumbnailPreview(
                          (e.target.files && e.target.files[0]) || null
                        );
                      }}
                    />
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
                  <Select onValueChange={field.onChange} value={field.value}>
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
                <FormItem
                  className={
                    form.getValues().pricing_model === "free" ? "hidden" : ""
                  }
                >
                  <FormLabel className="text-foreground" htmlFor="price-input">
                    Price
                  </FormLabel>
                  <FormControl>
                    <div className="flex">
                      <div className="flex items-center font-semibold min-h-full px-4 rounded-tl-md rounded-bl-md border-t border-b border-l border-r">
                        £
                      </div>
                      <Input
                        id="price-input"
                        className="border-l-0 rounded-tl-none rounded-bl-none"
                        type="number"
                        placeholder="1.00"
                        {...field}
                        readOnly={form.getValues().pricing_model === "free"}
                      />
                    </div>
                  </FormControl>
                  {form.getValues().pricing_model === "payf" && (
                    <p className="text-sm font-semibold text-muted-foreground">
                      For pay as you feel events, price represents a recommended
                      price
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex items-center flex-col gap-y-4 md:flex-row md:items-start md:gap-x-2">
              <div className="w-full flex-1">
                <FormField
                  name="start_date"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-foreground">
                        Start Date
                      </FormLabel>
                      <Input
                        name="start_date"
                        type="hidden"
                        value={field.value}
                      />
                      <Popover>
                        <FormControl>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex border-primary/20 shadow-sm"
                            >
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
                            selected={parse(
                              field.value,
                              "yyyy-MM-dd",
                              new Date()
                            )}
                            onSelect={(e) => {
                              if (e === undefined) return;
                              field.onChange(format(e, "yyyy-MM-dd"));
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
              <div className="w-full flex-1">
                <FormField
                  name="end_date"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-foreground">
                        End Date
                      </FormLabel>
                      <Input
                        name="end_date"
                        type="hidden"
                        value={field.value}
                      />
                      <Popover>
                        <FormControl>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex border-primary/20 shadow-sm"
                            >
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
                            selected={parse(
                              field.value,
                              "yyyy-MM-dd",
                              new Date()
                            )}
                            onSelect={(e) => {
                              if (e === undefined) return;
                              field.onChange(format(e, "yyyy-MM-dd"));
                              form.trigger();
                            }}
                            disabled={(date) =>
                              isBefore(
                                date,
                                parse(
                                  form.getValues().start_date,
                                  "yyyy-MM-dd",
                                  new Date()
                                )
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
            </div>
            <FormField
              name="start_time"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Start time</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="12:00"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        form.trigger("end_time");
                      }}
                    />
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
            <CreateEventSubmitButton
              pending={saving}
              pendingText="Saving"
              loadingIcon={true}
            >
              Save
            </CreateEventSubmitButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
